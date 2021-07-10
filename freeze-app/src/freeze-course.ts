import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";

import { BaseView, CourseMeta } from "./base-view.js";
import { FileSystemDataSource } from "./data-source.js";
import { Fragment, homeFragment } from "./freeze-pathbar.js";
import "./freeze-sidemenu";

@customElement("freeze-course")
export class FreezeCourse extends BaseView {
  @property({ type: Number })
  course_id?: number;

  @property({ attribute: false })
  courseMeta?: CourseMeta;

  @property({ attribute: false })
  body = "";

  @property({ attribute: false })
  fragments: Array<Fragment>;

  constructor() {
    super();
    this.fragments = [];
  }

  connectedCallback() {
    if (this.location !== undefined) {
      this.course_id = parseInt(this.location.params.course_id.toString());
    }
    super.connectedCallback();
  }

  async handleDirectoryChange(rootHandle: FileSystemDirectoryHandle) {
    if (this.course_id === undefined) {
      return;
    }
    const source = new FileSystemDataSource(rootHandle);
    this.courseMeta = await source.getMeta("course", this.course_id);
    this.body = await source.getText("course", this.course_id, "index.html");
    this.fragments = [
      homeFragment,
      {
        text: this.courseMeta!.name,
        href: `/course/${this.course_id}`,
        active: true,
      },
    ];
  }

  render() {
    return html`
      <freeze-pathbar .fragments=${this.fragments}></freeze-pathbar>
      <div class="columns">
        <freeze-sidemenu
          class="column is-one-fifth"
          .courseMeta=${this.courseMeta}
        ></freeze-sidemenu>
        <div class="column">
          <div class="content">${unsafeHTML(this.body)}</div>
        </div>
      </div>
    `;
  }
}
