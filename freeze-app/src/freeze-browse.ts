import { html } from "lit";
import { customElement } from "lit/decorators.js";

import { BaseView } from "./base-view.js";
import { FileSystemDataSource } from "./data-source.js";
import { TableFields, textField } from "./freeze-table";
import "./freeze-pathbar";
import { Fragment, homeFragment } from "./freeze-pathbar";

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
    const fragments: Array<Fragment> = [
      {
        text: homeFragment.text,
        href: homeFragment.href,
        active: true,
      },
    ];
    return html`
      <freeze-pathbar .fragments=${fragments}></freeze-pathbar>
      <div class="columns">
        <div class="column">
          <freeze-table
            sortField="id"
            .items=${this.courses}
            .fields=${fields}
          ></freeze-table>
        </div>
      </div>
    `;
  }

  async handleDirectoryChange(rootHandle: FileSystemDirectoryHandle) {
    const source = new FileSystemDataSource(rootHandle);
    this.courses = await source.getAllMeta("course");
  }
}
