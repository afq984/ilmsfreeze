import {
  DiscussionMeta,
  GroupListMeta,
  HomeworkMeta,
  MaterialMeta,
  ScoreMeta,
  SubmissionMeta,
  VideoMeta,
} from "./../types";
import { AnnouncementMeta, AttachmentMeta } from "../types";
import { check, mustParseInt, notnull } from "../utils";
import {
  buildURL,
  CrawlResult,
  dl,
  fetch200,
  mustGetQs,
  parseHTML,
  parseDownloadableReference,
  SaveFiles,
  tableIsEmpty,
  htmlGetMain,
} from "./crawler";
import { $x, $x1 } from "./xpath";

export function* getAttachments(
  parent: string,
  element: Document | Element
): Generator<AttachmentMeta> {
  const ids: Record<number, boolean> = {};
  for (const a of $x<Element>(
    './/a[starts-with(@href, "/sys/read_attach.php")]',
    element
  )) {
    if (a.textContent === null || a.textContent.trim().length == 0) {
      continue;
    }
    const id = mustParseInt(mustGetQs(notnull(a.getAttribute("href")), "id"));
    if (ids[id]) {
      continue;
    }
    ids[id] = true;
    const title = notnull(a.getAttribute("title") || a.textContent);
    yield {
      id: id,
      title: title,
      parent: parent,
    };
  }
}

export async function* processAnnouncement(
  announcementMeta: AnnouncementMeta
): CrawlResult {
  const response = await fetch200(
    buildURL("/home/http_event_select.php", {
      id: announcementMeta.id.toFixed(),
      type: "n",
    })
  );
  const json = await response.json();

  check(notnull(json.news.note) !== "NA");
  check(notnull(json.news.poster) !== "");

  const attachmentRawDiv = json.news.attach;
  if (attachmentRawDiv !== null) {
    for (const attachment of getAttachments(
      `Announcement-${announcementMeta.id}`,
      parseHTML(attachmentRawDiv)
    )) {
      yield {
        typename: "Attachment",
        meta: attachment,
      };
    }
  }

  return {
    "index.json": JSON.stringify(json),
  };
}

export const getMaterialVideo = async (
  materialMeta: MaterialMeta,
  baseURL: string
): Promise<VideoMeta | null> => {
  const response = await fetch200(
    buildURL("/sys/http_get_media.php", {
      id: materialMeta.id.toFixed(),
      db_table: "content",
      flash_installed: "false",
      swf_id: `swfslide${materialMeta.id}`,
      area_size: "724x3",
    })
  );
  const json = notnull(await response.json());
  check(json.ret.status === "true", materialMeta.id);
  if (json.ret.player_width === null) {
    return null;
  }

  const html = parseHTML(json.ret.embed);
  const src = $x1<Attr>("//video/@src", html).value;
  return { id: materialMeta.id, url: new URL(src, baseURL).toString() };
};

export async function* processMaterial(
  materialMeta: MaterialMeta
): CrawlResult {
  const response = await fetch200(
    buildURL("/course.php", {
      courseID: parseDownloadableReference(materialMeta.course).id.toFixed(),
      f: "doc",
      cid: materialMeta.id.toFixed(),
    })
  );
  const html = parseHTML(await response.text());
  const main = htmlGetMain(html);
  const refString = `Material-${materialMeta.id}`;

  for (const attachment of getAttachments(refString, main)) {
    yield dl("Attachment", attachment);
  }

  if (materialMeta.type === "Epowercam") {
    const video = await getMaterialVideo(materialMeta, response.url);
    if (video !== null) {
      yield dl("Video", video);
    }
  }

  return {
    "index.html": main.outerHTML,
  };
}

export async function* processDiscussion(
  discussionMeta: DiscussionMeta
): CrawlResult {
  const response = await fetch200(
    buildURL("/sys/lib/ajax/post.php", {
      id: discussionMeta.id.toFixed(),
    })
  );
  const json = await response.json();

  for (const post of json["posts"]["items"]) {
    for (const attachment of post["attach"]) {
      yield dl("Attachment", {
        id: mustParseInt(attachment.id),
        title: attachment.srcName,
        parent: `Discussion-${discussionMeta.id}`,
      });
    }
  }

  return {
    "index.json": JSON.stringify(json),
  };
}

export async function* processHomework(
  homeworkMeta: HomeworkMeta
): CrawlResult {
  const refString = `Homework-${homeworkMeta.id}`;
  const saveFiles: SaveFiles = {};

  // Homework page
  {
    const response = await fetch200(
      buildURL("/course.php", {
        courseID: parseDownloadableReference(homeworkMeta.course).id.toFixed(),
        f: "hw",
        hw: homeworkMeta.id.toFixed(),
      })
    );
    const html = parseHTML(await response.text());
    const main = htmlGetMain(html);

    for (const toRemove of $x('.//span[@class="toolWrapper"]', main)) {
      toRemove.parentElement!.removeChild(toRemove);
    }

    for (const attachment of getAttachments(refString, main)) {
      yield dl("Attachment", attachment);
    }

    saveFiles["index.html"] = main.outerHTML;
  }

  // Submissions
  {
    const response = await fetch200(
      buildURL("/course.php", {
        courseID: parseDownloadableReference(homeworkMeta.course).id.toFixed(),
        f: "hw_doclist",
        hw: homeworkMeta.id.toFixed(),
      })
    );
    const html = parseHTML(await response.text());
    const main = htmlGetMain(html);

    if (tableIsEmpty(main)) {
      return saveFiles;
    }

    const headerTr = $x1<Element>(
      './/div[@class="tableBox"]//tr[@class="header"]',
      main
    );
    const fieldIndexes: Record<string, number> = {};
    headerTr.childNodes.forEach((td, i) => {
      const as = $x<Element>("a", td);
      if (as.length === 1) {
        fieldIndexes[mustGetQs(notnull(as[0].getAttribute("href")), "order")] =
          i;
      }
    });

    const ititle = notnull(fieldIndexes.title);
    const iname = notnull(fieldIndexes.name);
    check(iname > ititle, iname);

    for (const tr of $x<Element>(
      '//div[@class="tableBox"]//tr[@class!="header"]',
      main
    )) {
      const as = $x<Element>("div/a", tr.childNodes[ititle]);
      if (as.length === 0) {
        continue;
      }
      check(as.length === 1);
      const id = mustParseInt(
        mustGetQs(notnull(as[0].getAttribute("href")), "cid")
      );
      const title = notnull(as[0].textContent).trim();

      const comments = $x<Attr>(
        'div/img[@src="/sys/res/icon/hw_comment.png"]/@title',
        tr.childNodes[ititle]
      );
      check(comments.length < 2);
      const comment = comments.length > 0 ? comments[0].value : null;

      // Group homework may hide behind a <a>
      const by = $x1<Text>(
        "div/text()|div/a/text()",
        tr.childNodes[iname]
      ).data;

      yield dl("Submission", {
        id: id,
        title: title,
        by: by,
        comment: comment,
        course: homeworkMeta.course,
      });
    }

    saveFiles["list.html"] = main.outerHTML;
  }

  return saveFiles;
}

export async function* processSubmission(
  submissionMeta: SubmissionMeta
): CrawlResult {
  const response = await fetch200(
    buildURL("/course.php", {
      courseID: parseDownloadableReference(submissionMeta.course).id.toFixed(),
      f: "doc",
      cid: submissionMeta.id.toFixed(),
    })
  );
  const html = parseHTML(await response.text());
  const main = htmlGetMain(html);

  for (const attachment of getAttachments(
    `Submission-${submissionMeta.id}`,
    main
  )) {
    yield dl("Attachment", attachment);
  }

  return {
    "index.html": main.outerHTML,
  };
}

async function* processSinglePage(
  f: string,
  meta: ScoreMeta | GroupListMeta
): CrawlResult {
  const response = await fetch200(
    buildURL("/course.php", {
      courseID: parseDownloadableReference(meta.course).id.toFixed(),
      f: f,
    })
  );
  const html = parseHTML(await response.text());
  const main = htmlGetMain(html);

  return {
    "index.html": main.outerHTML,
  };
}

export const processScore = (scoreMeta: ScoreMeta): CrawlResult =>
  processSinglePage("score", scoreMeta);

export const processGroupList = (groupListMeta: GroupListMeta): CrawlResult =>
  processSinglePage("grouplist", groupListMeta);
