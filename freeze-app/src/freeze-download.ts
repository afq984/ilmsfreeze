import { html } from "lit";
import { customElement } from "lit/decorators.js";

import { BaseView } from "./base-view.js";

@customElement("freeze-download")
export class FreezeDownload extends BaseView {
  render() {
    return html` <h2 class="title is-2">Not implemented</h2>
      <p>Download is not yet implemented.</p>`;
  }

  async handleDirectoryChange() {}
}
