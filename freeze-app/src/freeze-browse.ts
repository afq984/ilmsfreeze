import { html } from "lit";
import { customElement } from "lit/decorators.js";

import { BaseView } from './base-view.js';

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
}
