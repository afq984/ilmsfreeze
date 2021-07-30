import { AttachmentMeta, VideoMeta } from "../types";
import { notnull } from "../utils";
import { buildURL, CrawlResult, fetch200 } from "./crawler";
import { replaceIllegalCharactersInPath } from "./fileutil";

function suggestAttachmentFilename(dirty: string) {
  if (dirty === "meta.json") {
    return "meta_.json";
  }
  return replaceIllegalCharactersInPath(dirty, "_");
}

export async function* processAttachment(
  attachmentMeta: AttachmentMeta
): CrawlResult {
  const respose = await fetch200(
    buildURL("/sys/read_attach.php", {
      id: attachmentMeta.id.toFixed(),
    })
  );

  const saveName = suggestAttachmentFilename(attachmentMeta.title);
  const metaString = JSON.stringify({
    ...attachmentMeta,
    children: [],
    saved_filename: saveName,
  });

  return {
    "meta.json": metaString,
    [saveName]: notnull(respose.body),
  };
}

export async function* processVideo(videoMeta: VideoMeta): CrawlResult {
  const response = await fetch200(videoMeta.url);
  return { "video.mp4": notnull(response.body) };
}
