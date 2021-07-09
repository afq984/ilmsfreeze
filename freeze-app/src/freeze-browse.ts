import { html } from "lit";
import { customElement } from "lit/decorators.js";

import { BaseView } from "./base-view.js";
import "./freeze-table";

@customElement("freeze-browse")
export class FreezeBrowse extends BaseView {
  render() {
    const fields = ["id", "serial", "is_admin", "name"];
    return html` <div class="container">
      <freeze-table sortField="id" .items=${this.courses} .fields=${fields}></freeze-table>
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
