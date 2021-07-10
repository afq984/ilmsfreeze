import { RouterLocation } from "@vaadin/router";
import { LitElement } from "lit";
import { FileSystemDataSource, RouterSource } from "./data-source";

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

  async onBeforeEnter(location: RouterLocation, _: any, router: RouterSource) {
    this.router = router;
    this.activeUrl = location.pathname;
    await this.prepareState(location, router.dataSource!);
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

  async handleDirectoryChange(_rootHandle: FileSystemDirectoryHandle) {}

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
