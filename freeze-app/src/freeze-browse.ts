import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { RouterLocation } from "@vaadin/router";

import { BrowseBaseView } from "./base-view.js";
import { DataSource } from "./data-source.js";
import { TableFields, textField } from "./freeze-table";
import "./freeze-pathbar";
import { CourseMeta } from "./types.js";
import "./freeze-no-source";

@customElement("freeze-browse")
export class FreezeBrowse extends BrowseBaseView {
  @property({ attribute: false })
  courses: Array<CourseMeta> = [];

  renderState() {
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
    return html`
      ${this.renderHeader()}
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

  async prepareState(location: RouterLocation, source: DataSource) {
    super.prepareState(location, source);
    this.courses = await source.getAllMeta("course");
  }
}
