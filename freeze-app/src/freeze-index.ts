import { html, LitElement, TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";
import { externalLink, materialIcon } from "./html";

type statusClass = {
  iconName: string;
  cssClass: string;
};

const statusSuccess: statusClass = {
  iconName: "check",
  cssClass: "has-text-success",
};

const statusWarn: statusClass = {
  iconName: "warning",
  cssClass: "has-text-warning",
};

const statusFail: statusClass = {
  iconName: "error",
  cssClass: "has-text-danger",
};

@customElement("freeze-index")
export class FreezeIndex extends LitElement {
  createRenderRoot() {
    return this;
  }

  renderStatus(cls: statusClass, text: TemplateResult | string) {
    return html`<span class="icon-text">
      <span class="${cls.cssClass}">${materialIcon(cls.iconName)}</span>
      <span>${text}</span>
    </span>`;
  }

  render() {
    const fsAvailable = "showDirectoryPicker" in window;
    return html`
      <h1 class="title">Browser status</h1>
      <div class="content">
        <dl>
          <dt>
            <strong>File System Access API</strong>
            ${fsAvailable
              ? this.renderStatus(statusSuccess, "Available")
              : this.renderStatus(statusFail, html`Unsupported`)}
          </dt>
          <dd>
            You must use a browser with this feature to load/save files from/to
            your disk.<br />
            See
            ${externalLink(
              "supported browsers",
              "https://caniuse.com/native-filesystem-api"
            )}.
          </dd>
          <dt>
            <strong>Chrome Extension</strong>
            ${this.renderStatus(statusWarn, "Not Implemented")}
          </dt>
          <dd>
            You need the Chrome Extension to download from the browser.<br />
            You can also load the <code>ilmsdump.out</code> directory produced
            by
            ${externalLink("ilmsdump", "https://github.com/afq984/ilmsdump")}.
          </dd>
        </dl>
      </div>
    `;
  }
}
