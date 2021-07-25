import { AnnouncementMeta, AttachmentMeta } from "../types";
import { check, mustParseInt, notnull } from "../utils";
import { buildURL, fetch200, mustGetQs, parse } from "./crawler";
import { $x } from "./xpath";

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

export async function* processAnnouncement(announcementMeta: AnnouncementMeta) {
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
      parse(attachmentRawDiv)
    )) {
      yield attachment;
    }
  }

  return {
    "index.json": JSON.stringify(json),
  };
}
