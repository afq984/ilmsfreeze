import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import { createRef, Ref, ref } from "lit/directives/ref.js";

import "./freeze-navbar";
import "./freeze-browse";
import "./freeze-download";
import "./freeze-course";
import { FileSystemDataSource, RouterSource } from "./data-source";

@customElement("freeze-app")
export class FreezeApp extends LitElement {
  rootHandle?: FileSystemDirectoryHandle;
  mainRef: Ref<Element> = createRef();
  router?: RouterSource;

  createRenderRoot() {
    return this;
  }

  firstUpdated() {
    this.initRouter(this.mainRef.value!);
  }

  initRouter(element: Element) {
    this.router = new RouterSource(element);
    this.router.setRoutes([
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
      {
        path: "/course/:course_id/:bla",
        component: "freeze-course",
      },
    ]);
  }

  render() {
    return html`
      <freeze-navbar @directory-open=${this._onClick}></freeze-navbar>

      <div class="section">
        <main
          ${ref(this.mainRef)}
          class="container"
          @subscribe=${this._onSubscribe}
        ></main>
      </div>
    `;
  }

  private async _onClick() {
    const rootHandle = await window.showDirectoryPicker();
    this.rootHandle = rootHandle;
    const options = {
      detail: rootHandle,
    };
    this.router!.dataSource = new FileSystemDataSource(rootHandle);
    this.dispatchEvent(new CustomEvent("directory-changed", options));
  }

  private async _onSubscribe(e: CustomEvent) {
    await e.detail(this, this.rootHandle);
  }
}
