import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import { Router } from "@vaadin/router";

import "./freeze-navbar";
import "./freeze-browse";
import "./freeze-download";
import "./freeze-course";

function initRouter(element: any) {
  const router = new Router(element);
  router.setRoutes([
    {
      path: "/",
      component: "freeze-browse",
    },
    {
      path: "/download",
      component: "freeze-download",
    },
    {
      path: "/course/:course_id",
      component: "freeze-course",
    },
  ]);
}

@customElement("freeze-app")
export class FreezeApp extends LitElement {
  rootHandle?: FileSystemDirectoryHandle;

  createRenderRoot() {
    return this;
  }

  firstUpdated() {
    initRouter(this.renderRoot.querySelector("main"));
  }

  render() {
    return html`
      <freeze-navbar @directory-open=${this._onClick}></freeze-navbar>

      <main class="section" @subscribe=${this._onSubscribe}></main>
    `;
  }

  private async _onClick() {
    const rootHandle = await window.showDirectoryPicker();
    this.rootHandle = rootHandle;
    const options = {
      detail: rootHandle,
    };
    this.dispatchEvent(new CustomEvent("directory-changed", options));
  }

  private async _onSubscribe(e: CustomEvent) {
    await e.detail(this, this.rootHandle);
  }
}
