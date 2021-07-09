import { html } from "lit";
import { customElement, property } from "lit/decorators.js";

import { BaseView, Course } from "./base-view.js";

@customElement("freeze-course")
export class FreezeCourse extends BaseView {
  @property()
  course_id?: string;

  @property({ attribute: false })
  course?: Course;

  connectedCallback() {
    if (this.location !== undefined) {
      this.course_id = this.location.params.course_id.toString();
    }
    super.connectedCallback();
  }

  async handleDirectoryChange(rootHandle: FileSystemDirectoryHandle) {
    if (this.course_id === undefined) {
      return;
    }
    const meta = await (
      await (
        await rootHandle.getDirectoryHandle("course")
      ).getDirectoryHandle(this.course_id)
    ).getFileHandle("meta.json");
    this.course = JSON.parse(await (await meta.getFile()).text());
  }

  render() {
    return html` <h2 class="title is-2">Course ${this.course_id}</h2>
      <p>${JSON.stringify(this.course)}</p>`;
  }
}
