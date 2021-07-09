import { html } from "lit";
import { customElement } from "lit/decorators.js";

import { BaseView } from "./base-view.js";
import { TableFields, textField } from "./freeze-table";

@customElement("freeze-browse")
export class FreezeBrowse extends BaseView {
  render() {
    const linkfn = (item: any, attr: any) =>
      html`<a href="/course/${item.id}">${attr}</a>`;
    const fields: TableFields = {
      id: linkfn,
      serial: textField,
      is_admin: textField,
      name: linkfn,
    };
    return html` <div class="container">
      <freeze-table
        sortField="id"
        .items=${this.courses}
        .fields=${fields}
      ></freeze-table>
    </div>`;
  }

  async handleDirectoryChange(rootHandle: FileSystemDirectoryHandle) {
    await super.handleDirectoryChange(rootHandle);
    const courseDir = await rootHandle.getDirectoryHandle("course");
    let courses = [];
    for await (const entry of courseDir.values()) {
      if (entry.kind == "file") {
        continue;
      }
      const meta = await entry.getFileHandle("meta.json");
      const file = await meta.getFile();
      const obj = JSON.parse(await file.text());
      courses.push(obj);
    }

    this.courses = courses;
  }
}
