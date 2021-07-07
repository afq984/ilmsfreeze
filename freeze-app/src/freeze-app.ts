import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";

import "./freeze-navbar";

interface Course {
  id: string;
  serial: string;
  is_admin: string;
  name: string;
}

@customElement("freeze-app")
export class FreezeApp extends LitElement {
  @property({ attribute: false })
  courses: Array<Course> = [];

  createRenderRoot() {
    return this;
  }

  renderTable(items: Array<any>, attrs: Array<string>) {
    return html`
    <table class="table">
      <tr>
      ${attrs.map((attr) => html`<th>${attr}</th>`)}
  </tr>
  </tr>
      ${items.map(
        (item) =>
          html`<tr>
            ${attrs.map((attr) => html`<td>${item[attr]}</td>`)}
          </tr>`
      )}
      </table>
    `;
  }

  render() {
    return html`
      <freeze-navbar @directory-open=${this._onClick}></freeze-navbar>

      <section class="section">
        <div class="container">
          ${this.renderTable(this.courses, [
            "id",
            "serial",
            "is_admin",
            "name",
          ])}
        </div>
      </section>
    `;
  }

  private async _onClick() {
    const rootHandle = await window.showDirectoryPicker();
    console.log(rootHandle);
    const courseDir = await rootHandle.getDirectoryHandle("course");
    let courses = [];
    for await (const entry of courseDir.values()) {
      // @ts-ignore
      const meta = await entry.getFileHandle("meta.json");
      const file = await meta.getFile();
      const obj = JSON.parse(await file.text());
      courses.push(obj);
    }
    this.courses = courses;
  }
}
