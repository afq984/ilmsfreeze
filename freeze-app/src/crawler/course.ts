import { error403 } from "../errors";
import { AnnouncementMeta, CourseMeta, MaterialMeta } from "../types";
import { Bug, mustParseInt, notnull } from "../utils";
import {
  buildURL,
  fetch200,
  flattenPaginator,
  mustGetQs,
  parseHTML,
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
      `Empty response returend from course, the course probably doesn't exist: course_id=${course_id}`
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
