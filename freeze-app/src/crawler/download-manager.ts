import {
  AnnouncementMeta,
  AttachmentMeta,
  CourseMeta,
  DiscussionMeta,
  GroupListMeta,
  HomeworkMeta,
  MaterialMeta,
  ScoreMeta,
  SubmissionMeta,
  VideoMeta,
} from "../types";
import { Bug } from "../utils";
import { processCourse } from "./course";
import { CrawlResult, Downloadable, SaveFiles } from "./crawler";
import { processAttachment, processVideo } from "./file";
import {
  processAnnouncement,
  processDiscussion,
  processGroupList,
  processHomework,
  processMaterial,
  processScore,
  processSubmission,
} from "./page";

const processItem = ({ typename, meta }: Downloadable): CrawlResult => {
  switch (typename) {
    case "Course":
      return processCourse(meta as CourseMeta);
    case "Announcement":
      return processAnnouncement(meta as AnnouncementMeta);
    case "Material":
      return processMaterial(meta as MaterialMeta);
    case "Discussion":
      return processDiscussion(meta as DiscussionMeta);
    case "Homework":
      return processHomework(meta as HomeworkMeta);
    case "Submission":
      return processSubmission(meta as SubmissionMeta);
    case "Attachment":
      return processAttachment(meta as AttachmentMeta);
    case "Video":
      return processVideo(meta as VideoMeta);
    case "GroupList":
      return processGroupList(meta as GroupListMeta);
    case "Score":
      return processScore(meta as ScoreMeta);
    default:
      throw new Bug(`invalid typename: ${typename}`);
  }
};

const downloadableToString = ({ typename, meta }: Downloadable) => {
  const ref = `${typename}-${meta.id}`;
  if ("name" in meta) {
    return `${ref}: ${meta.name}`;
  }
  if ("title" in meta) {
    return `${ref}: ${meta.title}`;
  }
  return `${ref}`;
};

export enum DownloadState {
  Scheduled,
  Processing,
  Completed,
  Errored,
}

export class DownloadManager {
  private target: Downloadable;
  status = DownloadState.Scheduled;
  progress = 0;
  total = 0;
  message = "";

  constructor(target: Downloadable) {
    this.target = target;
  }

  stateChanged() {}

  private setState(progress: number, total: number, message: string) {
    this.progress = progress;
    this.total = total;
    this.message = message;
    this.stateChanged();
  }

  async download() {
    this.status = DownloadState.Processing;
    this.stateChanged();
    try {
      await this.downloadInternal();
    } catch (e) {
      console.error("Download failed for:", this.target);
      console.error(e);
      this.status = DownloadState.Errored;
      this.stateChanged();
      return;
    }
    this.status = DownloadState.Completed;
    this.stateChanged();
  }

  private async downloadInternal() {
    let currentItem = 0;
    let totalItems = 1;

    const queue: Array<Downloadable> = [this.target];
    for (; queue.length > 0; ++currentItem) {
      const item = queue.shift()!;
      const itemName = downloadableToString(item);

      this.setState(currentItem, totalItems, itemName);

      const result = processItem(item);
      for (;;) {
        const { value, done } = await result.next();
        if (done) {
          const saveFiles = value as SaveFiles;
          for (const [, value] of Object.entries(saveFiles)) {
            if (!(value instanceof ReadableStream)) continue;
            const stream = value as ReadableStream;
            let nbytes = 0;
            const sink = new WritableStream({
              write: (chunk: Uint8Array) => {
                nbytes += chunk.byteLength;
                this.setState(
                  currentItem,
                  totalItems,
                  `${itemName} ${(nbytes * 1e-6).toFixed(1)}MB`
                );
              },
            });
            await stream.pipeTo(sink);
          }

          break;
        }
        ++totalItems;
        queue.push(value as Downloadable);
        this.setState(currentItem, totalItems, `${itemName}`);
      }
    }
  }
}
