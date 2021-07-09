import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";

const symbolAscending = "⬆︎";
const symbolDescending = "⬇︎";

@customElement("freeze-table")
export class FreezeTable extends LitElement {
  createRenderRoot() {
    return this;
  }

  @property({ attribute: false })
  items: Array<any>;

  @property({ attribute: false })
  fields: Array<any>;

  @property()
  sortField?: string;

  @property({ type: Boolean })
  sortDescending: boolean = false;

  constructor() {
    super();
    this.items = [];
    this.fields = [];
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.sortField !== undefined) {
      this.sort(this.sortField, this.sortDescending);
    }
  }

  sort() {
    if (this.sortField === undefined) {
      return;
    }
    const m = this.sortDescending ? -1 : 1;
    const field = this.sortField;
    this.items.sort(
      (a, b) =>
        ((a[field] > b[field] ? 1 : 0) - (a[field] < b[field] ? 1 : 0)) * m
    );
  }

  toggleSort(field: string) {
    if (this.sortField === field) {
      this.sortDescending = !this.sortDescending;
    } else {
      this.sortField = field;
      this.sortDescending = false;
    }
  }

  render() {
    if (this.sortField !== undefined) {
      this.sort();
    }
    return html`
    <table class="table">
      <tr>
      ${this.fields.map(
        (field) =>
          html`<th
            style="cursor: pointer; user-select: none"
            @click=${() => this.toggleSort(field)}
          >
            ${field}
            ${field === this.sortField
              ? this.sortDescending
                ? symbolDescending
                : symbolAscending
              : ""}
          </th>`
      )}
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
