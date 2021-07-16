import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { createRef, Ref, ref } from "lit/directives/ref.js";

import "./freeze-navbar";
import "./freeze-browse";
import "./freeze-download";
import "./freeze-course";
import "./freeze-index";
import { RouterSource, routes } from "./routes";
import { FileSystemDataSource } from "./data-source";
import { IDBPDatabase, openDB } from "idb";

@customElement("freeze-extension-status")
export class FreezeExtensionStatus extends LitElement {
  @property()
  extensionId = "";
  @property()
  extensionVersion = "";
}

@customElement("freeze-app")
export class FreezeApp extends LitElement {
  rootHandle?: FileSystemDirectoryHandle;
  mainRef: Ref<Element> = createRef();
  router: RouterSource;
  db?: IDBPDatabase;

  constructor() {
    super();
    this.router = new RouterSource();
  }

  createRenderRoot() {
    return this;
  }

  connectedCallback() {
    super.connectedCallback();
    this.initServiceWorker();
    this.initDB();
  }

  firstUpdated() {
    this.router.setOutlet(this.mainRef.value!);
    this.router.setRoutes(routes);
  }

  async initDB() {
    this.db = await openDB("meta", 1, {
      upgrade(db) {
        db.createObjectStore("keyval");
      },
    });
    const cachedHandle = await this.db.get("keyval", "storedHandle");
    if (cachedHandle !== undefined) {
      if (
        (await cachedHandle.queryPermission({ mode: "read" })) === "granted"
      ) {
        this.setRootHandle(cachedHandle, true);
      }
    }
  }

  initServiceWorker() {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").then(
        (registration) => {
          console.log(
            "ServiceWorker registration successful with scope: ",
            registration.scope
          );
          registration.addEventListener("updatefound", () => {
            const newWorker = registration.installing;
            if (this.rootHandle !== undefined) {
              newWorker!.postMessage({
                op: "set_root_handle",
                data: this.rootHandle,
              });
            }
            newWorker?.postMessage({
              op: "take_over",
            });
          });
        },
        (err) => {
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
    this.setRootHandle(rootHandle);
  }

  setRootHandle(rootHandle: FileSystemDirectoryHandle, skipDB = false) {
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

    if (!skipDB) {
      this.db?.put("keyval", rootHandle, "storedHandle");
    }
    console.log(`set data source: ${rootHandle.name}`);
  }

  private async _onSubscribe(e: CustomEvent) {
    await e.detail(this, this.rootHandle);
  }
}
