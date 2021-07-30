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
  Typename,
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
  dh: FileSystemDirectoryHandle;

  constructor(target: Downloadable, dh: FileSystemDirectoryHandle) {
    this.target = target;
    this.dh = dh;
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

  async downloadFile(
    typename: Typename,
    itemID: number,
    itemName: string,
    name: string,
    content: string | ReadableStream
  ) {
    const typedir = await this.dh.getDirectoryHandle(typename.toLowerCase(), {
      create: true,
    });
    const objdir = await typedir.getDirectoryHandle(itemID.toFixed(), {
      create: true,
    });
    const fileHandle = await objdir.getFileHandle(name, { create: true });
    const stream = await fileHandle.createWritable();

    if (!(content instanceof ReadableStream)) {
      await stream.write(content);
      await stream.close();
      return;
    }

    let bytesWritten = 0;
    const reportTransform = new TransformStream({
      transform: (
        chunk: Uint8Array,
        controller: TransformStreamDefaultController
      ) => {
        bytesWritten += chunk.byteLength;
        this.setState(
          this.progress,
          this.total,
          `${itemName} ${(bytesWritten * 1e-6).toFixed(1)}MB`
        );

        controller.enqueue(chunk);
      },
    });

    const reportingStream = content.pipeThrough(reportTransform);
    await reportingStream.pipeTo(stream);
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
      const children = [];

      for (;;) {
        const { value, done } = await result.next();

        // handle save files
        if (done) {
          const saveFiles = value as SaveFiles;
          if (saveFiles["meta.json"] === undefined) {
            await this.downloadFile(
              item.typename,
              item.meta.id,
              itemName,
              "meta.json",
              JSON.stringify({ ...item.meta, children: children })
            );
          }
          for (const [name, value] of Object.entries(saveFiles)) {
            await this.downloadFile(
              item.typename,
              item.meta.id,
              itemName,
              name,
              value
            );
          }
          break;
        }

        // handle children
        ++totalItems;
        const child = value as Downloadable;
        children.push(`${child.typename}-${child.meta.id}`);
        queue.push(child);

        this.setState(currentItem, totalItems, `${itemName}`);
      }
    }
  }
}
