import { html } from "lit";
import { customElement, property } from "lit/decorators.js";

import { BaseView, Course } from "./base-view.js";
import { FileSystemDataSource } from "./data-source.js";

@customElement("freeze-course")
export class FreezeCourse extends BaseView {
  @property({ type: Number })
  course_id?: number;

  @property({ attribute: false })
  course?: Course;

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
    this.course = await source.getMeta("course", this.course_id);
  }

  render() {
    return html` <h2 class="title is-2">Course ${this.course_id}</h2>
      <p>${JSON.stringify(this.course)}</p>`;
  }
}
