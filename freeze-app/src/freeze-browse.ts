import { html } from "lit";
import { customElement, property } from "lit/decorators.js";

import { BaseView } from "./base-view.js";
import { FileSystemDataSource } from "./data-source.js";
import { TableFields, textField } from "./freeze-table";
import "./freeze-pathbar";
import { Fragment, homeFragment } from "./freeze-pathbar";
import { CourseMeta } from "./types.js";

@customElement("freeze-browse")
export class FreezeBrowse extends BaseView {
  @property({ attribute: false })
  courses: Array<CourseMeta> = [];

  render() {
    const linkfn = (item: CourseMeta, attr: any) => {
      const url = this.router!.urlForName("freeze-course", {
        course_id: item.id.toString(),
      });
      return html`<a href=${url}>${attr}</a>`;
    };
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
            .sortDescending=${true}
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
