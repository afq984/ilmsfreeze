import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import { createRef, Ref, ref } from "lit/directives/ref.js";

import "./freeze-navbar";
import "./freeze-browse";
import "./freeze-download";
import "./freeze-course";
import "./freeze-index";
import { RouterSource, routes } from "./routes";
import { FileSystemDataSource } from "./data-source";

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
    this.initServiceWorker();
  }

  initRouter(element: Element) {
    this.router = new RouterSource(element);
    this.router.setRoutes(routes);
  }

  initServiceWorker() {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").then(
        function (registration) {
          // Registration was successful
          console.log(
            "ServiceWorker registration successful with scope: ",
            registration.scope
          );
        },
        function (err) {
          // registration failed :(
          console.log("ServiceWorker registration failed: ", err);
        }
      );
    }
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

    if (
      !("serviceWorker" in navigator) ||
      navigator.serviceWorker.controller === null
    ) {
      console.log("Service worker not available, not sending data source");
    } else {
      navigator.serviceWorker.controller.postMessage({
        op: "set_root_handle",
        data: rootHandle,
      });
    }
  }

  private async _onSubscribe(e: CustomEvent) {
    await e.detail(this, this.rootHandle);
  }
}
