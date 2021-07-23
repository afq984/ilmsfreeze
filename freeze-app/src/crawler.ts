import { error403 } from "./errors";
import { CourseMeta } from "./types";

const fetch200 = async (url: RequestInfo) => {
  const response = await fetch(url);
  console.assert(response.ok, response.status);
  return response;
};

const parse = (body: string) =>
  new DOMParser().parseFromString(body, "text/html");

const Bug = Error;

export const getEnrolledCourses = async (): Promise<CourseMeta[]> => {
  const response = await fetch200(
    "https://lms.nthu.edu.tw/home.php?f=allcourse"
  );
  const body = await response.text();
  const html = parse(body);

  const result: CourseMeta[] = [];

  for (const a of html.querySelectorAll("td.listTD>a")) {
    const bs = a.querySelectorAll("b");
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
  const name = html.querySelector("div.infoPath>a")!.textContent!;

  const hint = html.querySelector(
    "div.infoTable td:nth-of-type(2)>span.hint"
  )!.textContent;
  const m = hint!.match(
    new RegExp(`\\([^,()]+, ([^,()]+), [^,()]+, [^,()]+\\)`)
  );
  if (!m) {
    throw new Bug(hint || "hint is null");
  }
  const serial = m[1];

  const is_admin =
    html.querySelector(`div#main a[href="javascript:editDoc(1)"]`) !== null;

  return {
    id: course_id,
    serial: serial,
    name: name,
    is_admin: is_admin,
    children: [],
  };
};
