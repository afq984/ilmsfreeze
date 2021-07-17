import { html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";
import {
  externalLink,
  renderStatus,
  statusFail,
  statusSuccess,
  statusUnknown,
  statusWarn,
} from "./html";

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
  @state()
  extensionInstalled = false;
  @state()
  extensionVersion = "";
  updatedListener: EventListener;

  constructor() {
    super();
    this.updatedListener = () => this.updateExtensionStatus();
  }

  connectedCallback() {
    super.connectedCallback();
    this.checkServiceWorkerStatus();

    const status = document.querySelector("freeze-extension-status") as any;
    status.addEventListener("updated", this.updatedListener);
    this.updateExtensionStatus();
  }

  disconnectedCallback() {
    document
      .querySelector("freeze-extension-status")
      ?.removeEventListener("updated", this.updatedListener);
  }

  updateExtensionStatus() {
    const status = document.querySelector("freeze-extension-status") as any;
    this.extensionInstalled = status.extensionId !== "";
    this.extensionVersion = status.extensionVersion;
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
        this.serviceWorkerStatus = statusUnknown;
        this.serviceWorkerDescription = "Unknown";
    }
  }

  render() {
    return html`
      <div class="content">
        <h1 class="title">ilmsfreeze</h1>
        <p>
          Hello! ilmsfreeze helps you back up & view
          ${externalLink("NTHU iLMS", "https://lms.nthu.edu.tw/")} data in the
          browser.<br />
          <strong>NOTE: This is currently a work in progress.</strong>
        </p>
        <p>
          Source code is hosted on
          ${externalLink("GitHub", "https://github.com/afq984/ilmsfreeze")}. Bug
          reports & contributions welcome!
        </p>
        ${this.renderDiagnostics()}
        <h3>Privacy</h3>
        Your iLMS data stays on your disk and does not go to our server.<br />
        Google Analytics is used to track site usage.
      </div>
    `;
  }

  renderDiagnostics() {
    return html`
      <h3>Diagnostics</h3>
      <dl>
        <dt>
          <strong>File System Access API</strong>
          ${this.fsAvailable
            ? renderStatus(statusSuccess, "Available")
            : renderStatus(statusFail, "Unsupported")}
        </dt>
        <dd>
          <em>Required</em> to load/download iLMS data from/to your disk.<br />
          See
          ${externalLink(
            "supported browsers",
            "https://caniuse.com/native-filesystem-api"
          )}.
        </dd>
        <dt>
          <strong>Service Worker</strong>
          ${renderStatus(
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
          ${this.extensionInstalled
            ? renderStatus(
                statusSuccess,
                `Installed (version: ${this.extensionVersion})`
              )
            : renderStatus(statusWarn, `Not installed`)}
        </dt>
        <dd>
          You need the Chrome Extension to <em>download</em> from iLMS.<br />
          Alternatively, you can use
          ${externalLink("ilmsdump", "https://github.com/afq984/ilmsdump")} to
          backup.<br />
          ilmsfreeze is compatible with the <code>ilmsdump.out</code> directory.
        </dd>
      </dl>
    `;
  }
}
