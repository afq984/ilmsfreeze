import { CourseMeta } from "./types";

const fetch200 = async (url: string) => {
  const response = await fetch(url);
  console.assert(response.ok, response.status);
  return response;
};

const parse = (body: string) =>
  new DOMParser().parseFromString(body, "text/html");

const Bug = Error;

export const getEnrolledCourses = async () => {
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
