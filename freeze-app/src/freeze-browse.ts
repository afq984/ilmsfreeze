import { html } from "lit";
import { customElement } from "lit/decorators.js";

import { BaseView } from "./base-view.js";

@customElement("freeze-browse")
export class FreezeBrowse extends BaseView {
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
    return html` <div class="container">
      ${this.renderTable(this.courses, ["id", "serial", "is_admin", "name"])}
    </div>`;
  }

  async handleDirectoryChange(rootHandle: FileSystemDirectoryHandle) {
    await super.handleDirectoryChange(rootHandle);
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
