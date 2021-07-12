import { html, LitElement, TemplateResult } from "lit";
import { customElement, state } from "lit/decorators.js";
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
  @state()
  fsAvailable = "showDirectoryPicker" in window;
  @state()
  serviceWorkerStatus = statusWarn;
  @state()
  serviceWorkerDescription = "Unknown";

  connectedCallback() {
    super.connectedCallback();
    this.checkServiceWorkerStatus();
  }

  async checkServiceWorkerStatus() {
    const response = await fetch("/sw-status.json");
    const status = await response.json();
    switch (status.version) {
      case null:
        this.serviceWorkerStatus = statusWarn;
        this.serviceWorkerDescription = "Unavailable";
        break;
      case 1:
        this.serviceWorkerStatus = statusSuccess;
        this.serviceWorkerDescription = "Active";
        break;
      default:
        this.serviceWorkerStatus = statusWarn;
        this.serviceWorkerDescription = "Unknown";
    }
  }

  renderStatus(cls: statusClass, text: TemplateResult | string) {
    return html`<span class="icon-text">
      <span class="${cls.cssClass}">${materialIcon(cls.iconName)}</span>
      <span>${text}</span>
    </span>`;
  }

  render() {
    return html`
      <h1 class="title">Browser status</h1>
      <div class="content">
        <dl>
          <dt>
            <strong>File System Access API</strong>
            ${this.fsAvailable
              ? this.renderStatus(statusSuccess, "Available")
              : this.renderStatus(statusFail, "Unsupported")}
          </dt>
          <dd>
            <em>Required</em> to load/save backup iLMS data from/to your
            disk.<br />
            See
            ${externalLink(
              "supported browsers",
              "https://caniuse.com/native-filesystem-api"
            )}.
          </dd>
          <dt>
            <strong>Service Worker</strong>
            ${this.renderStatus(
              this.serviceWorkerStatus,
              this.serviceWorkerDescription
            )}
          </dt>
          <dd>
            The service worker provides access to
            <em>attachments, videos, and inline images</em>.<br />
            Try close all tabs and reload this site if there is a problem.
          </dd>
          <dt>
            <strong>Chrome Extension</strong>
            ${this.renderStatus(statusWarn, "Not Implemented")}
          </dt>
          <dd>
            You need the Chrome Extension to <em>download</em> from the
            browser.<br />
            You can also load the <code>ilmsdump.out</code> directory produced
            by
            ${externalLink("ilmsdump", "https://github.com/afq984/ilmsdump")}.
          </dd>
        </dl>
      </div>
    `;
  }
}
