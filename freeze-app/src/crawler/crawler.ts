import { isTypename } from "./../types";
import { AnyMeta, CourseMeta, Typename } from "../types";
import { Bug, check, mustParseInt, notnull } from "../utils";
import { $x } from "./xpath";

export type SaveFileContent = string | ReadableStream<Uint8Array>;
export type SaveFiles = Record<string, SaveFileContent>;
export type Downloadable = {
  typename: Typename;
  meta: AnyMeta;
};
export type DownloadableReference = {
  typename: Typename;
  id: number;
};
export type CrawlResult = AsyncGenerator<Downloadable, SaveFiles>;

export const dl = (typename: Typename, meta: AnyMeta): Downloadable => {
  return {
    typename: typename,
    meta: meta,
  };
};

// parse "course-1" into {typename: "course", id: 1}
export const parseDownloadableReference = (
  s: string
): DownloadableReference => {
  const [typename, idstr] = s.split("-", 2);
  if (!isTypename(typename)) {
    throw Bug(`${typename} is not a Typename`);
  }
  return { typename, id: mustParseInt(idstr) };
};

export const fetch200 = async (url: RequestInfo) => {
  const response = await fetch(url);
  check(response.ok, response.status);
  return response;
};

export const parseHTML = (body: string) =>
  new DOMParser().parseFromString(body, "text/html");

export const mustGetQs = (href: string, q: string) => {
  const url = new URL(href, "https://example.com");
  const value = url.searchParams.get(q);
  if (value === null) {
    throw Bug;
  }
  return value;
};

export const buildURL = (
  path: string,
  query: Record<string, string>
): string => {
  const url = new URL(path, "https://lms.nthu.edu.tw");
  url.search = new URLSearchParams(query).toString();
  return url.toString();
};

export const tableIsEmpty = (html: Document) => {
  const secondRowTds = $x('//div[@class="tableBox"]/table//tr[2]/td', html);
  if (secondRowTds.length === 1) {
    check(
      ["目前尚無資料", "No Data"].includes(notnull(secondRowTds[0].textContent))
    );
    return true;
  }
  return false;
};

export async function* flattenPaginator(
  courseMeta: CourseMeta,
  f: string,
  page = 1
) {
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
