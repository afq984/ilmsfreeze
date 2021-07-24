import { error403 } from "./errors";
import { AnnouncementMeta, CourseMeta } from "./types";

const fetch200 = async (url: RequestInfo) => {
  const response = await fetch(url);
  console.assert(response.ok, response.status);
  return response;
};

const parse = (body: string) =>
  new DOMParser().parseFromString(body, "text/html");

const check = (condition: boolean, ...message: any) => {
  if (!condition) {
    throw new Bug(`check failed: ${message}`);
  }
};

const notnull = <T>(value: T | null): T => {
  if (value === null) {
    throw new Bug();
  }
  return value;
};

const $x = <T extends Node>(
  xpathExpression: string,
  contextNode: Node
): T[] => {
  const iterator = (
    (contextNode.ownerDocument || contextNode) as Document
  ).evaluate(xpathExpression, contextNode);
  const result = [];
  let item: Node | null;
  while ((item = iterator.iterateNext()) !== null) {
    result.push(item as T);
  }
  return result;
};

const $x1 = <T extends Node>(xpathExpression: string, contextNode: Node): T => {
  const results = $x<T>(xpathExpression, contextNode);
  check(results.length === 1, results.length);
  return results[0];
};

const Bug = Error;

export const getEnrolledCourses = async (): Promise<CourseMeta[]> => {
  const response = await fetch200(
    "https://lms.nthu.edu.tw/home.php?f=allcourse"
  );
  const body = await response.text();
  const html = parse(body);

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

    const name = tag.textContent!;
    const serial = a.parentElement!.parentElement!.childNodes[1].textContent!;

    const courseURL = a.getAttribute("href");
    const m = courseURL!.match(new RegExp("/course/(\\d+)"));
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
  const url = new URL("https://lms.nthu.edu.tw/course.php");
  url.searchParams.set("f", "syllabus");
  url.searchParams.set("courseID", course_id.toString());
  const response = await fetch200(url.toString());
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

  const html = parse(body);
  const name = $x1<Text>('//div[@class="infoPath"]/a/text()', html).nodeValue!;

  const hint = $x1<Text>(
    '//div[@class="infoTable"]//td[2]/span[@class="hint"]/text()',
    html
  ).nodeValue!;
  const m = hint!.match(
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

const tableIsEmpty = (html: Document) => {
  const secondRowTds = $x('//div[@class="tableBox"]/table//tr[2]/td', html);
  if (secondRowTds.length === 1) {
    check(
      ["目前尚無資料", "No Data"].includes(notnull(secondRowTds[0].textContent))
    );
    return true;
  }
  return false;
};

const mustGetQs = (href: string, q: string) => {
  const url = new URL(href, "https://example.com");
  const value = url.searchParams.get(q);
  if (value === null) {
    throw Bug;
  }
  return value;
};

const mustParseInt = (s: string) => {
  const value = parseInt(s);
  if (isFinite(value)) {
    return value;
  }
  throw Bug;
};

const buildURL = (path: string, query: Record<string, string>): string => {
  const url = new URL(path);
  url.search = new URLSearchParams(query).toString();
  return url.toString();
};

async function* flattenPaginator(
  courseMeta: CourseMeta,
  f: string,
  page: number = 1
) {
  while (true) {
    const response = await fetch200(
      buildURL("https://lms.nthu.edu.tw/course.php", {
        courseID: courseMeta.id.toFixed(),
        f: f,
        page: page.toFixed(),
      })
    );
    const html = parse(await response.text());

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

export const getCourseAnnouncements = async (courseMeta: CourseMeta) => {
  const result: AnnouncementMeta[] = [];
  for await (const html of flattenPaginator(courseMeta, "news")) {
    for (const tr of $x('//*[@id="main"]//tr[@class!="header"]', html)) {
      const href = $x1<Attr>("td[1]/a/@href", tr);
      const title = $x1<Text>("td[2]//a/text()", tr);
      result.push({
        id: mustParseInt(mustGetQs(href.value, "newsID")),
        title: notnull(title.textContent),
        course: `Course-${courseMeta.id}`,
      });
    }
  }
  return result;
};
