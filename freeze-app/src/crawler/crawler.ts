import { isTypename } from "./../types";
import { AnyMeta, Typename } from "../types";
import { Bug, check, mustParseInt, notnull } from "../utils";
import { $x } from "./xpath";
import { error403 } from "../errors";

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

export const tableIsEmpty = (html: Node) => {
  const secondRowTds = $x('//div[@class="tableBox"]/table//tr[2]/td', html);
  if (secondRowTds.length === 1) {
    check(
      ["目前尚無資料", "No Data"].includes(notnull(secondRowTds[0].textContent))
    );
    return true;
  }
  return false;
};

const checkPermission = (html: Document) => {
  const noPermission = $x(
    `//div[contains(@style, "color:#F00;") and ` +
      `(starts-with(text(), "權限不足!") or starts-with(text(), "No Permission!"))]` +
      `/text()`,
    html
  );
  if (noPermission.length > 0) {
    throw error403(noPermission.join(" "));
  }
};

export const htmlGetMain = (html: Document) => {
  checkPermission(html);
  const mains = $x<Element>('//div[@id="main"]', html);
  check(mains.length > 0);
  const [main] = mains;
  for (const bad of ['.//div[@class="infoPath"]', ".//script"]) {
    for (const toRemove of $x<Element>(bad, main)) {
      toRemove.parentElement?.removeChild(toRemove);
    }
  }
  return main;
};
