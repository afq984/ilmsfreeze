import { html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";

import {
  externalLink,
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
  const profile = body.querySelector("#profile");
  if (profile === null) {
    return renderStatus(statusWarn, "Logged out");
  }
  const nameTag = profile.querySelector("span.lt");
  console.assert(nameTag !== null);
  console.assert(nameTag!.textContent!.trim() === "Name:");
  const loggedInAs = nameTag!.nextSibling!.textContent;
  return renderStatus(statusSuccess, `Logged in as ${loggedInAs}`);
};

@customElement("freeze-download")
export class FreezeDownload extends LitElement {
  @state()
  ilmsAccess = renderStatus(statusUnknown, "Unknown");

  createRenderRoot() {
    return this;
  }

  connectedCallback() {
    super.connectedCallback();
    this.getStatus();
  }

  async getStatus() {
    this.ilmsAccess = await getLoginState();
  }

  render() {
    return html`<h2 class="title">ilmsfreeze download</h2>
      <p>
        ${externalLink("iLMS", "https://lms.nthu.edu.tw")} status:
        ${this.ilmsAccess}
      </p>`;
  }
}
