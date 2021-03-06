import { Commands, RouterLocation } from "@vaadin/router";
import { html, LitElement } from "lit";
import { customElement, query, state } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import { BaseView } from "./base-view.js";
import { getCourse, getEnrolledCourses } from "./crawler/course";
import { DownloadManager, DownloadState } from "./crawler/download-manager.js";
import {
  DataSource,
  FileSystemDataSource,
  RemoteDataSource,
} from "./data-source.js";
import "./freeze-no-source";
import { ask } from "./freeze-prompt.js";

import {
  externalLink,
  materialIcon,
  renderStatus,
  statusFail,
  statusSuccess,
  statusUnknown,
  statusWarn,
} from "./html.js";
import { RouterSource } from "./routes.js";
import { CourseMeta } from "./types.js";
import { mustParseInt } from "./utils.js";

const getLoginState = async () => {
  let response: Response;
  try {
    response = await fetch("https://lms.nthu.edu.tw/home.php");
  } catch (err) {
    return renderStatus(statusFail, "Inaccessible");
  }
  const body = new DOMParser().parseFromString(
    await response.text(),
    "text/html"
  );
  const profile = body.querySelector("#profile");
  if (profile === null) {
    return renderStatus(statusWarn, "Logged out");
  }
  const nameTag = profile.querySelector("span.lt");
  console.assert(nameTag !== null);
  const nameTagName = nameTag!.textContent!.trim();
  console.assert(
    ["Name:", "姓名:"].find((x) => x === nameTagName) === nameTagName,
    nameTag
  );
  const loggedInAs = nameTag!.nextSibling!.textContent;
  return renderStatus(statusSuccess, `Logged in as ${loggedInAs}`);
};

enum DirectoryState {
  None,
  ReadOnly,
  ReadWrite,
  Remote,
}

@customElement("freeze-download")
export class FreezeDownload extends BaseView {
  @state()
  ilmsAccess = renderStatus(statusUnknown, "Unknown");

  @state()
  directoryAccess = DirectoryState.None;
  dh!: FileSystemDirectoryHandle;

  @query("freeze-dump")
  dumper?: FreezeDump;

  windowOnBeforeUnload: () => boolean | null;

  constructor() {
    super();
    this.windowOnBeforeUnload = () => this.downlaodIsRunning() || null;
  }

  createRenderRoot() {
    return this;
  }

  connectedCallback() {
    super.connectedCallback();
    this.getStatus();
  }

  private downlaodIsRunning() {
    if (this.dumper === undefined || this.dumper === null) {
      return false;
    }
    return this.dumper.downloadRunning > 0;
  }

  async onBeforeEnter(
    location: RouterLocation,
    commands: Commands,
    router: RouterSource
  ) {
    window.onbeforeunload = this.windowOnBeforeUnload;
    await super.onBeforeEnter(location, commands, router);
  }

  async onBeforeLeave(_: any, commands: Commands) {
    window.onbeforeunload = null;

    if (!this.downlaodIsRunning()) {
      return;
    }
    const leave = await ask(
      "Are you sure you want to leave?",
      "Download will be interrupted.",
      "Leave",
      "Cancel"
    );
    if (!leave) {
      return commands.prevent();
    }
    return;
  }

  private async getStatus() {
    this.ilmsAccess = await getLoginState();
  }

  async prepareState(_location: RouterLocation, source: DataSource) {
    if (source instanceof FileSystemDataSource) {
      this.dh = source.rootHandle;
      if ((await this.dh.queryPermission({ mode: "read" })) !== "granted") {
        this.directoryAccess = DirectoryState.None;
        return;
      }
      if (
        (await this.dh.queryPermission({ mode: "readwrite" })) !== "granted"
      ) {
        this.directoryAccess = DirectoryState.ReadOnly;
        return;
      }
      this.directoryAccess = DirectoryState.ReadWrite;
    } else if (source instanceof RemoteDataSource) {
      this.directoryAccess = DirectoryState.Remote;
    }
  }

  renderState() {
    return html`
      <p class="has-text-centered">
        <span>
          ${externalLink("iLMS", "https://lms.nthu.edu.tw")} status:
          ${this.ilmsAccess}
          <span style="opacity: 0.7">(refresh this page to update status)</span>
        </span>
      </p>
      <hr />
      <freeze-dump
        .directoryAccess=${this.directoryAccess}
        .dh=${this.dh}
      ></freeze-dump>
    `;
  }
}

@customElement("freeze-dump")
export class FreezeDump extends LitElement {
  createRenderRoot() {
    return this;
  }

  @state()
  dh!: FileSystemDirectoryHandle;

  @state()
  directoryAccess = DirectoryState.None;

  @state()
  enrolledCourses: CourseMeta[] = [];

  @state()
  queue: UIDownloadManager[] = [];
  added: { [_: number]: DownloadManager } = {};

  @state()
  completedDownloads = 0;

  // XXX is this async-safe?
  downloadRunning = 0;

  @query("#dump-course-id")
  courseIdInput!: HTMLInputElement;

  constructor() {
    super();
    this.setEnrolledCoursesAsync();
  }

  private async setEnrolledCoursesAsync() {
    this.enrolledCourses = await getEnrolledCourses();
  }

  private async doDownload() {
    if (this.downloadRunning > 0) {
      return;
    }
    ++this.downloadRunning;
    console.assert(this.downloadRunning === 1, this.downloadRunning);
    for (
      ;
      this.completedDownloads < this.queue.length;
      this.completedDownloads++
    ) {
      const dm = this.queue[this.completedDownloads];
      await dm.download();
    }

    --this.downloadRunning;
    console.assert(this.downloadRunning === 0, this.downloadRunning);
  }

  addCourse(course: CourseMeta) {
    if (this.added[course.id]) {
      return;
    }
    const dm = new UIDownloadManager(course, this.dh);
    this.added[course.id] = dm;
    this.queue.push(dm);
    this.doDownload();
  }

  addEnrolledCourses() {
    for (const course of this.enrolledCourses) {
      if (course.id in this.added) {
        continue;
      }
      this.addCourse(course);
    }
    this.requestUpdate();
  }

  async addSelectedCourse() {
    const courseID = this.courseIdInput.value;
    this.courseIdInput.value = "";

    let course: CourseMeta;
    try {
      course = await getCourse(mustParseInt(courseID));
    } catch (e) {
      ask("Cannot add course", e.toString(), "Close", "");
      this.requestUpdate();
      return;
    }
    this.addCourse(course);
    this.requestUpdate();
  }

  private _requestWriteAccess() {
    this.dispatchEvent(new Event("request-write", { bubbles: true }));
  }

  render() {
    if (
      this.directoryAccess === DirectoryState.None ||
      this.directoryAccess === DirectoryState.Remote
    ) {
      return html`<freeze-no-source></freeze-no-source>`;
    }
    if (this.directoryAccess === DirectoryState.ReadOnly) {
      return html`<div class="has-text-centered">
        <div class="oops">(._.)</div>
        <div>Cannot download without write access</div>
        <div style="margin-top: 20px">
          <button class="button is-info" @click=${this._requestWriteAccess}>
            Grant Write Access
          </button>
        </div>
      </div>`;
    }
    console.assert(this.directoryAccess === DirectoryState.ReadWrite);
    return this.renderState();
  }

  renderForm() {
    return html`
      <div class="field is-grouped is-grouped-centered">
        <div class="field has-addons">
          <div class="control">
            <input
              id="dump-course-id"
              class="input has-text-centered"
              type="text"
              placeholder="Course ID"
              @keyup=${(event: KeyboardEvent) => {
                if (event.key !== "Enter") return;
                this.addSelectedCourse();
                event.preventDefault();
              }}
            />
          </div>
          <div class="control">
            <button class="button is-info" @click=${this.addSelectedCourse}>
              ${materialIcon("download")}
              <span>Download</span>
            </button>
          </div>
        </div>
        &emsp;

        <div class="field has-addons">
          <div class="control">
            <input
              class="input has-text-centered is-italic"
              type="text"
              value="all ${this.enrolledCourses.length} enrolled courses"
              readonly
            />
          </div>
          <div class="control">
            <button
              class="button is-info"
              @click=${this.addEnrolledCourses}
              ?disabled=${this.enrolledCourses.length === 0}
            >
              ${materialIcon("download")}
              <span>Download</span>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  renderQueue() {
    if (this.queue.length === 0) {
      return html`<span class="panel-block">
        <div style="width: 100%">
          <div class="oops has-text-centered">ᕦ( ᐛ )ᕡ</div>
          <div class=" has-text-centered">No courses queued for download.</div>
        </div>
      </span>`;
    }
    return html`
      <div class="container" style="max-width: 768px">
        <div class="panel">
          <p class="panel-heading">
            Downloads ${this.completedDownloads}/${this.queue.length}
          </p>
          ${repeat(
            this.queue,
            (dm) => dm.course.id,
            (dm) =>
              html`
                <span class="panel-block">
                  <freeze-dump-course
                    .course=${dm.course}
                    .downloadManager=${dm}
                    style="width: 100%"
                  ></freeze-dump-course>
                </span>
              `
          )}
        </div>
      </div>
    `;
  }

  renderState() {
    return html` ${this.renderForm()} ${this.renderQueue()} `;
  }
}

@customElement("freeze-dump-course")
export class FreezeDumpCourse extends LitElement {
  createRenderRoot() {
    return this;
  }

  course!: CourseMeta;
  downloadManager!: UIDownloadManager;

  connectedCallback() {
    super.connectedCallback();
    this.downloadManager.ui = this;
  }

  startDownload() {
    this.downloadManager.download();
  }

  getIconName(status: DownloadState) {
    switch (status) {
      case DownloadState.Scheduled:
        return "hourglass_empty";
      case DownloadState.Processing:
        return "downloading";
      case DownloadState.Completed:
        return "file_download_done";
      case DownloadState.Errored:
        return "error";
    }
  }

  render() {
    const dm = this.downloadManager;
    return html`
      <span> ${materialIcon(this.getIconName(dm.status))} </span>
      <span>
        <span class="tag">${this.course.id}</span>
        <span>${this.course.name}</span>
        <span class="tag">${this.course.serial}</span>
        ${this.course.is_admin
          ? html`<span class="tag is-primary is-light">admin</span>`
          : undefined}
        ${dm.status === DownloadState.Processing
          ? html`
              <progress
                class="progress is-info"
                value="${dm.progress}"
                max="${dm.total}"
                style="height: 4px; margin-top: 8px; margin-bottom: 4px"
              >
                ${dm.progress}/${dm.total}
              </progress>
              <small style="opacity: .7"
                >Downloading (${dm.progress}/${dm.total})...
                ${dm.message}</small
              >
            `
          : undefined}
      </span>
    `;
  }
}

class UIDownloadManager extends DownloadManager {
  course: CourseMeta;
  ui?: FreezeDumpCourse;

  constructor(course: CourseMeta, dh: FileSystemDirectoryHandle) {
    super({ typename: "Course", meta: course }, dh);
    this.course = course;
  }

  stateChanged() {
    this.ui?.requestUpdate();
  }
}
