import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("freeze-table")
export class FreezeTable extends LitElement {
  createRenderRoot() {
    return this;
  }

  @property({ attribute: false })
  items: Array<any>;

  @property({ attribute: false })
  fields: Array<any>;

  constructor() {
    super();
    this.items = [];
    this.fields = [];
  }

  render() {
    return html`
    <table class="table">
      <tr>
      ${this.fields.map((field) => html`<th>${field}</th>`)}
  </tr>
  </tr>
      ${this.items.map(
        (item) =>
          html`<tr>
            ${this.fields.map((field) => html`<td>${item[field]}</td>`)}
          </tr>`
      )}
      </table>
    `;
  }
}
