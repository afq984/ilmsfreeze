import { Commands, RouterLocation } from "@vaadin/router";
import { LitElement } from "lit";
import { FileSystemDataSource } from "./data-source";
import { RouterSource } from "./routes";

export abstract class BaseView extends LitElement {
  subscribedTo?: Element;
  directoryChangedListener: EventListener;
  location?: RouterLocation;
  activeUrl?: string;
  router?: RouterSource;

  constructor() {
    super();
    this.directoryChangedListener = async (e: Event) => {
      await this.handleDirectoryChange(
        (e as CustomEvent).detail as FileSystemDirectoryHandle
      );
    };
  }

  createRenderRoot() {
    return this;
  }

  async onBeforeEnter(
    location: RouterLocation,
    _: Commands,
    router: RouterSource
  ) {
    this.router = router;
    this.activeUrl = location.pathname;
    if (router.dataSource !== undefined) {
      await this.prepareState(location, router.dataSource);
    }
  }

  async prepareState(
    _location: RouterLocation,
    _source: FileSystemDataSource
  ) {}

  private async subscribe(e: Element, rootHandle?: FileSystemDirectoryHandle) {
    this.subscribedTo = e;
    if (rootHandle !== undefined) {
      await this.handleDirectoryChange(rootHandle);
    }
    e.addEventListener("directory-changed", this.directoryChangedListener);
  }

  abstract handleDirectoryChange(_rootHandle: FileSystemDirectoryHandle): Promise<any>;

  connectedCallback() {
    super.connectedCallback();
    const options = {
      detail: async (e: Element, rootHandle?: FileSystemDirectoryHandle) => {
        await this.subscribe(e, rootHandle);
      },
      bubbles: true,
    };
    this.dispatchEvent(new CustomEvent("subscribe", options));
  }

  disconnectedCallback() {
    this.subscribedTo?.removeEventListener(
      "directory-changed",
      this.directoryChangedListener
    );
  }
}
