import { html } from "lit";
import { customElement, state } from "lit/decorators.js";

import { BaseView } from "./base-view.js";
import {
  renderStatus,
  statusFail,
  statusSuccess,
  statusUnknown,
  statusWarn,
} from "./html.js";

const getLoginState = async () => {
  let response: Response;
  try {
    response = await fetch("https://lms.nthu.edu.tw/home.php");
  } catch (err) {
    return renderStatus(statusFail, "Inaccessible");
  }
  const body = new DOMParser().parseFromString(
    await response.text(),
    "text/html"
  );
  console.log(body);
  const profile = body.querySelector("#profile");
  if (profile === null) return renderStatus(statusWarn, "Logged Out");
  return renderStatus(statusSuccess, "Logged In");
};

@customElement("freeze-download")
export class FreezeDownload extends BaseView {
  @state()
  ilmsAccess = renderStatus(statusUnknown, "Unknown");

  connectedCallback() {
    super.connectedCallback();
    this.getStatus();
  }

  async getStatus() {
    this.ilmsAccess = await getLoginState();
  }

  render() {
    return html` <h2 class="title is-2">Not implemented</h2>
      <p>${this.ilmsAccess}</p>`;
  }

  async handleDirectoryChange() {}
}
