import { error403 } from "../errors";
import {
  AnnouncementMeta,
  AnyMeta,
  CourseMeta,
  DiscussionMeta,
  GroupListMeta,
  HomeworkMeta,
  MaterialMeta,
  ScoreMeta,
  Typename,
} from "../types";
import { Bug, mustParseInt, notnull } from "../utils";
import {
  buildURL,
  CrawlResult,
  dl,
  fetch200,
  htmlGetMain,
  mustGetQs,
  parseHTML,
  tableIsEmpty,
} from "./crawler";
import { $x, $x1 } from "./xpath";

export const getEnrolledCourses = async (): Promise<CourseMeta[]> => {
  const response = await fetch200(
    buildURL("/home.php", {
      f: "allcourse",
    })
  );
  const body = await response.text();
  const html = parseHTML(body);

  const result: CourseMeta[] = [];

  for (const a of $x<Element>('.//td[@class="listTD"]/a', html)) {
    const bs = $x<Element>("b", a);
    let is_admin = false;
    let tag: Element;
    if (bs.length > 0) {
      is_admin = true;
      [tag] = bs;
    } else {
      tag = a;
    }

    const name = notnull(tag.textContent);
    const serial = notnull(
      a.parentElement!.parentElement!.childNodes[1].textContent
    );

    const courseURL = notnull(a.getAttribute("href"));
    const m = courseURL.match(new RegExp("/course/(\\d+)"));
    if (m === null) {
      throw Bug(`invalid course URL ${courseURL}`);
    }
    result.push({
      id: parseInt(m[1]),
      serial: serial,
      name: name,
      is_admin: is_admin,
      children: [],
    });
  }
  return result;
};

export const getCourse = async (course_id: number): Promise<CourseMeta> => {
  const response = await fetch200(
    buildURL("/course.php", {
      f: "syllabus",
      courseID: course_id.toFixed(),
    })
  );
  const responseURL = new URL(response.url);
  if (responseURL.pathname === "/course_login.php") {
    throw error403(`No access to course: course_id=${course_id}`);
  }

  const body = await response.text();
  if (body.trim().length === 0) {
    throw error403(
      `Empty response returned from course, the course probably doesn't exist: course_id=${course_id}`
    );
  }

  const html = parseHTML(body);
  const name = $x1<Text>('//div[@class="infoPath"]/a/text()', html).nodeValue!;

  const hint = notnull(
    $x1<Text>(
      '//div[@class="infoTable"]//td[2]/span[@class="hint"]/text()',
      html
    ).nodeValue
  );
  const m = hint.match(
    new RegExp(`\\([^,()]+, ([^,()]+), [^,()]+, [^,()]+\\)`)
  );
  if (!m) {
    throw new Bug(hint || "hint is null");
  }
  const serial = m[1];

  const is_admin =
    $x('//div[@id="main"]//a[@href="javascript:editDoc(1)"]', html).length > 0;

  return {
    id: course_id,
    serial: serial,
    name: name,
    is_admin: is_admin,
  };
};

async function* flattenPaginator(courseMeta: CourseMeta, f: string, page = 1) {
  while (true) {
    const response = await fetch200(
      buildURL("/course.php", {
        courseID: courseMeta.id.toFixed(),
        f: f,
        page: page.toFixed(),
      })
    );
    const html = parseHTML(await response.text());

    if (tableIsEmpty(html)) {
      break;
    }

    yield html;

    const nextHrefs = $x<Attr>(
      '//span[@class="page"]//a[text()="Next"]/@href',
      html
    ).map((x) => x.value);
    if (nextHrefs.length === 0) {
      break;
    }
    const next_page = mustParseInt(mustGetQs(nextHrefs[0], "page"));
    page++;
    console.assert(page === next_page);
  }
}

export async function* getCourseAnnouncements(
  courseMeta: CourseMeta
): AsyncGenerator<AnnouncementMeta> {
  for await (const html of flattenPaginator(courseMeta, "news")) {
    for (const tr of $x('//*[@id="main"]//tr[@class!="header"]', html)) {
      const href = $x1<Attr>("td[1]/a/@href", tr);
      const title = $x1<Text>("td[2]//a/text()", tr);
      yield {
        id: mustParseInt(mustGetQs(href.value, "newsID")),
        title: notnull(title.textContent),
        course: `Course-${courseMeta.id}`,
      };
    }
  }
}

export async function* getCourseDiscussions(
  courseMeta: CourseMeta
): AsyncGenerator<DiscussionMeta> {
  for await (const html of flattenPaginator(courseMeta, "forumlist")) {
    for (const tr of $x<Element>(
      '//*[@id="main"]//tr[@class!="header"]',
      html
    )) {
      if ($x('.//img[@class="vmiddle"]', tr).length > 0) {
        // XXX: belongs to a homework, material
        // don't know if it is accessible
        continue;
      }
      const href = $x1<Attr>("td[1]/a/@href", tr);
      const title = $x1<Text>("td[2]//a/span/text()", tr);
      yield {
        id: mustParseInt(mustGetQs(href.value, "tid")),
        title: title.data,
        course: `Course-${courseMeta.id}`,
      };
    }
  }
}

export async function* getCourseMaterials(
  courseMeta: CourseMeta
): AsyncGenerator<MaterialMeta> {
  for await (const html of flattenPaginator(courseMeta, "doclist")) {
    for (const a of $x<Element>(
      '//*[@id="main"]//tr[@class!="header"]/td[2]/div/a',
      html
    )) {
      const url = new URL(
        notnull(a.getAttribute("href")),
        "https://example.com"
      );
      if (
        url.pathname !== "/course.php" ||
        url.searchParams.get("f") !== "doc"
      ) {
        // linked material (the copy should still be downloaded)
        // XXX: this cannot be tested without logging in :(
        continue;
      }
      yield {
        id: mustParseInt(notnull(url.searchParams.get("cid"))),
        title: notnull(a.textContent),
        type: notnull(notnull(a.parentElement).getAttribute("class")),
        course: `Course-${courseMeta.id}`,
      };
    }
  }
}

export async function* getCourseHomeworks(
  courseMeta: CourseMeta
): AsyncGenerator<HomeworkMeta> {
  for await (const html of flattenPaginator(courseMeta, "hwlist")) {
    for (const a of $x<Element>(
      '//*[@id="main"]//tr[@class!="header"]/td[2]/a[1]',
      html
    )) {
      yield {
        id: mustParseInt(mustGetQs(notnull(a.getAttribute("href")), "hw")),
        title: notnull(a.textContent),
        course: `Course-${courseMeta.id}`,
      };
    }
  }
}

export async function* getCourseScores(
  courseMeta: CourseMeta
): AsyncGenerator<ScoreMeta> {
  const response = await fetch200(
    buildURL("/course.php", {
      f: "score",
      courseID: courseMeta.id.toFixed(),
    })
  );
  const html = parseHTML(await response.text());

  if (
    $x(
      '//div[@id="main"]//input[@type="button" and @onclick="history.back()"]',
      html
    ).length === 0
  ) {
    yield {
      id: courseMeta.id,
      course: `Course-${courseMeta.id}`,
    };
  }
}

export async function* getCourseGroupLists(
  courseMeta: CourseMeta
): AsyncGenerator<GroupListMeta> {
  const response = await fetch200(
    buildURL("/course.php", {
      f: "grouplist",
      courseID: courseMeta.id.toFixed(),
    })
  );
  const html = parseHTML(await response.text());
  if (!tableIsEmpty(html)) {
    yield {
      id: courseMeta.id,
      course: `Course-${courseMeta.id}`,
    };
  }
}

export async function* processCourse(courseMeta: CourseMeta): CrawlResult {
  const getters: Array<[Typename, (_: CourseMeta) => AsyncGenerator<AnyMeta>]> =
    [
      ["Announcement", getCourseAnnouncements],
      ["Material", getCourseMaterials],
      ["Discussion", getCourseDiscussions],
      ["Homework", getCourseHomeworks],
      ["Score", getCourseScores],
      ["GroupList", getCourseGroupLists],
    ];
  for (const [typename, func] of getters) {
    for await (const meta of func(courseMeta)) {
      yield dl(typename, meta);
    }
  }

  const response = await fetch200(
    buildURL("/course.php", {
      courseID: courseMeta.id.toFixed(),
      f: "syllabus",
    })
  );
  const html = parseHTML(await response.text());
  const main = htmlGetMain(html);

  return {
    "index.html": main.outerHTML,
  };
}
