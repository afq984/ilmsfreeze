import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { createRef, Ref, ref } from "lit/directives/ref.js";

import "./freeze-navbar";
import "./freeze-browse";
import "./freeze-download";
import "./freeze-course";
import "./freeze-index";
import "./freeze-404";
import { RouterSource, routes } from "./routes";
import {
  DataSource,
  deserializeDataSource,
  FileSystemDataSource,
  RemoteDataSource,
  serializeDataSource,
} from "./data-source";
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
  dataSource?: DataSource;
  mainRef: Ref<Element> = createRef();
  router: RouterSource;
  db?: IDBPDatabase;
  private dbInitDone: Promise<void>;

  constructor() {
    super();
    this.router = new RouterSource();
    this.dbInitDone = this.initDB();
  }

  createRenderRoot() {
    return this;
  }

  connectedCallback() {
    super.connectedCallback();
    this.initServiceWorker();
  }

  async firstUpdated() {
    await this.dbInitDone;
    this.router.setOutlet(this.mainRef.value!);
    this.router.setRoutes(routes);
  }

  async initDB() {
    this.db = await openDB("meta", 1, {
      upgrade(db) {
        db.createObjectStore("keyval");
      },
    });

    const q = new URLSearchParams(window.location.search);
    const remote = q.get("open");
    if (remote === "https://ilmsdump.afq984.org") {
      this.setDataSource(new RemoteDataSource(remote));
      window.history.replaceState("", "", window.location.pathname);
      return;
    }

    const serializedSource = await this.db.get("keyval", "storedSource");
    if (serializedSource !== undefined) {
      const cachedSource = deserializeDataSource(serializedSource);
      if (cachedSource !== null) {
        if (cachedSource instanceof FileSystemDataSource) {
          const readPerm = await cachedSource.rootHandle.queryPermission({
            mode: "read",
          });
          if (readPerm === "granted") {
            this.setDataSource(cachedSource, true);
          } else {
            console.log("Bad read perm:", readPerm);
          }
        } else {
          this.setDataSource(cachedSource, true);
        }
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
            if (this.dataSource !== undefined) {
              newWorker!.postMessage({
                op: "set_data_source",
                data: serializeDataSource(this.dataSource),
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
      <freeze-navbar
        @subscribe=${this._onSubscribe}
        @directory-open=${this._onClick}
      ></freeze-navbar>

      <div class="section">
        <main
          ${ref(this.mainRef)}
          class="container"
          @subscribe=${this._onSubscribe}
          @request-write=${this._onRequestWrite}
        ></main>
      </div>
    `;
  }

  private async _onClick() {
    const rootHandle = await window.showDirectoryPicker();
    this.setDataSource(new FileSystemDataSource(rootHandle));
  }

  private async _onRequestWrite() {
    if (this.dataSource === undefined) {
      return;
    }
    if (this.dataSource instanceof FileSystemDataSource) {
      const rootHandle = this.dataSource.rootHandle;
      const rw = await rootHandle.queryPermission({ mode: "readwrite" });
      if (rw === "prompt") {
        await rootHandle.requestPermission({ mode: "readwrite" });
        this.setDataSource(this.dataSource);
      }
    }
  }

  setDataSource(dataSource: DataSource, skipDB = false) {
    this.dataSource = dataSource;
    const options = {
      detail: this.dataSource,
    };
    this.router!.dataSource = dataSource;
    this.dispatchEvent(new CustomEvent("directory-changed", options));

    if (
      !("serviceWorker" in navigator) ||
      navigator.serviceWorker.controller === null
    ) {
      console.log("Service worker not available, not sending data source");
    } else {
      navigator.serviceWorker.controller.postMessage({
        op: "set_data_source",
        data: serializeDataSource(dataSource),
      });
    }

    if (!skipDB) {
      this.db?.put("keyval", serializeDataSource(dataSource), "storedSource");
    }
    console.log(`set data source: ${dataSource.name}`);
  }

  private async _onSubscribe(e: CustomEvent) {
    await e.detail(this, this.dataSource);
  }
}
