import { html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { DirectoryChangeAwareView } from "./base-view";
import { materialIcon } from "./html";

@customElement("freeze-navbar")
export class FreezeNavbar extends DirectoryChangeAwareView {
  @state()
  directoryName = "no directory";
  @state()
  directoryAccess = "unknown";

  createRenderRoot() {
    return this;
  }

  async handleDirectoryChange(rootHandle: FileSystemDirectoryHandle) {
    if ((await rootHandle.queryPermission({ mode: "read" })) !== "granted") {
      this.directoryName = "no directory";
      this.directoryAccess = "unknown";
      return;
    }
    this.directoryName = rootHandle.name;
    if (
      (await rootHandle.queryPermission({ mode: "readwrite" })) === "granted"
    ) {
      this.directoryAccess = "readwrite";
    } else {
      this.directoryAccess = "readonly";
    }
  }

  private renderDirectoryStatus() {
    const directoryAccessClasses = {
      tag: true,
      "is-success": this.directoryAccess === "readwrite",
      "is-info": this.directoryAccess === "readonly",
      "is-warning": this.directoryAccess === "unknown",
    };
    return html`<div class="field is-grouped is-grouped-multiline">
      <div class="control">
        <div class="tags has-addons">
          <span class="tag is-dark">${this.directoryName}</span>
          <span class=${classMap(directoryAccessClasses)}
            >${this.directoryAccess}</span
          >
        </div>
      </div>
    </div>`;
  }

  render() {
    return html`<nav
      class="navbar is-light"
      role="navigation"
      aria-label="main navigation"
    >
      <section class="container" style="display: flex">
        <div
          style="display: flex; justify-content: flex-start; align-items: center;"
        >
          <a class="navbar-item" href="/">
            <strong>ilmsfreeze</strong>
          </a>
          <a href="/course/" class="navbar-item">Browse</a>
          <a href="/download" class="navbar-item">Download</a>
        </div>

        <div
          class="navbar-end"
          style="display: flex; justify-content: flex-end; align-items: center;"
        >
          <div class="navbar-item">${this.renderDirectoryStatus()}</div>
          <div class="navbar-item">${this.renderOpenButton()}</div>
        </div>
      </section>
    </nav>`;
  }

  private renderOpenButton() {
    return html`<div class="buttons">
      <button class="button is-primary" @click="${this._dispatchClick}">
        <strong class="icon-text"
          >${materialIcon("folder")}<span>Open...</span></strong
        >
      </button>
    </div>`;
  }

  private _dispatchClick() {
    const options = {
      bubbles: true,
      composed: true,
    };
    this.dispatchEvent(new CustomEvent("directory-open", options));
  }
}
