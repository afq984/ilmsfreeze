import { RouterLocation } from "@vaadin/router";
import { html, LitElement } from "lit";
import { customElement, query, state } from "lit/decorators.js";
import { BaseView } from "./base-view.js";
import { getCourse, getEnrolledCourses } from "./crawler/crawler.js";
import { FileSystemDataSource } from "./data-source.js";
import { RenderableError } from "./errors.js";

import {
  externalLink,
  materialIcon,
  renderStatus,
  statusFail,
  statusSuccess,
  statusUnknown,
  statusWarn,
} from "./html.js";
import { CourseMeta } from "./types.js";

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

@customElement("freeze-download")
export class FreezeDownload extends BaseView {
  @state()
  ilmsAccess = renderStatus(statusUnknown, "Unknown");
  @state()
  directoryName = "";
  @state()
  directoryWritable = false;

  createRenderRoot() {
    return this;
  }

  connectedCallback() {
    super.connectedCallback();
    this.getStatus();
  }

  async getStatus() {
    this.ilmsAccess = await getLoginState();
  }

  async prepareState(_: RouterLocation, source: FileSystemDataSource) {
    const h = source.rootHandle;
    [this.directoryName, this.directoryWritable] = [
      h.name,
      (await h.queryPermission({ mode: "readwrite" })) === "granted",
    ];
  }

  renderState() {
    return html`
      <p class="has-text-centered">
        <span
          >${externalLink("iLMS", "https://lms.nthu.edu.tw")} status:
          ${this.ilmsAccess}</span
        >&emsp;|&emsp;<span
          >Directory:
          ${this.directoryName !== ""
            ? html`<code>${this.directoryName}</code>`
            : "None"}</span
        >${this.directoryName !== ""
          ? html`&emsp;|&emsp;<span
                >Writable:
                ${this.directoryWritable
                  ? renderStatus(statusSuccess, "Yes")
                  : html`${renderStatus(statusFail, "No")};
                      <a @click=${this._requestWriteAccess}>
                        Grant Access
                      </a>`}</span
              >`
          : ""}
      </p>
      <hr />
      <freeze-dump .router=${this.router}></freeze-dump>
    `;
  }

  private _requestWriteAccess() {
    this.dispatchEvent(new Event("request-write", { bubbles: true }));
  }

  render() {
    return this.renderState();
  }
}
@customElement("freeze-dump")
export class FreezeDump extends BaseView {
  @state()
  courses: CourseMeta[] = [];
  @state()
  queue: CourseMeta[] = [];
  added: { [_: number]: boolean } = {};
  @query("#dump-course-id")
  courseIdInput!: HTMLInputElement;

  async prepareState(_location: RouterLocation, source: FileSystemDataSource) {
    if (
      "granted" !==
      (await source.rootHandle.queryPermission({ mode: "readwrite" }))
    ) {
      throw new RenderableError(
        "(._.)",
        "Cannot download without write access"
      );
    }

    this.courses = await getEnrolledCourses();
  }

  addCourse(course: CourseMeta) {
    if (this.added[course.id]) {
      return;
    }
    this.added[course.id] = true;
    this.queue.push(course);
  }

  addEnrolledCourses() {
    for (const course of this.courses) {
      if (course.id in this.added) {
        continue;
      }
      this.addCourse(course);
    }
    this.requestUpdate();
  }

  async addSelectedCourse() {
    const course = await getCourse(parseInt(this.courseIdInput.value));
    this.addCourse(course);
    this.requestUpdate();
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
              value="all ${this.courses.length} enrolled courses"
              readonly
            />
          </div>
          <div class="control">
            <button
              class="button is-info"
              @click=${this.addEnrolledCourses}
              ?disabled=${this.courses.length === 0}
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
    return html`
      <div class="container" style="max-width: 768px">
        <div class="panel">
          <p class="panel-heading">Downloading 0/${this.queue.length}</p>

          ${this.queue.length
            ? this.queue.map(
                (course) =>
                  html`
                    <span class="panel-block">
                      <freeze-dump-course
                        .course=${course}
                      ></freeze-dump-course>
                    </span>
                  `
              )
            : html`<span class="panel-block">
                <div style="width: 100%">
                  <div class="oops has-text-centered">ᕦ( ᐛ )ᕡ</div>
                  <div class=" has-text-centered">
                    No courses queued for download.
                  </div>
                </div>
              </span>`}
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

  render() {
    return html`
      ${materialIcon("hourglass_empty")}
      <span class="tag">${this.course.id}</span>
      <span>${this.course.name}</span>
      <span class="tag">${this.course.serial}</span>
      ${this.course.is_admin
        ? html`<span class="tag is-primary is-light">admin</span>`
        : undefined}
    `;
  }
}
