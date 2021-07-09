import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";

const symbolAscending = "⬆︎";
const symbolDescending = "⬇︎";

type AttrFn = (item: any, attr: any) => any;
export interface TableFields {
  [key: string]: AttrFn;
}
export const textField: AttrFn = (_: any, attr: any) => attr;

@customElement("freeze-table")
export class FreezeTable extends LitElement {
  createRenderRoot() {
    return this;
  }

  @property({ attribute: false })
  items: Array<any>;

  @property({ attribute: false })
  fields: TableFields;

  @property()
  sortField?: string;

  @property({ type: Boolean })
  sortDescending = false;

  constructor() {
    super();
    this.items = [];
    this.fields = {};
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.sortField !== undefined) {
      this.sort();
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

  willUpdate() {
    if (this.sortField !== undefined) {
      this.sort();
    }
  }

  render() {
    return html`
    <table class="table">
      <tr>
      ${Object.keys(this.fields).map(
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
            ${Object.entries(this.fields).map(
              ([field, attrFn]) => html`<td>${attrFn(item, item[field])}</td>`
            )}
          </tr>`
      )}
      </table>
    `;
  }
}
