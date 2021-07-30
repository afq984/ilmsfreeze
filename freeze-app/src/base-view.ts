import { Commands, RouterLocation } from "@vaadin/router";
import { LitElement, TemplateResult } from "lit";
import { FileSystemDataSource } from "./data-source";
import { errorNoSource, RenderableError } from "./errors";
import { renderError } from "./html";
import { RouterSource } from "./routes";

export abstract class DirectoryChangeAwareView extends LitElement {
  private subscribedTo?: Element;
  private directoryChangedListener: EventListener;

  constructor() {
    super();
    this.directoryChangedListener = (e: Event) => {
      this.handleDirectoryChange(
        (e as CustomEvent).detail as FileSystemDirectoryHandle
      );
    };
  }

  private async subscribe(e: Element, rootHandle?: FileSystemDirectoryHandle) {
    this.subscribedTo = e;
    if (rootHandle !== undefined) {
      await this.handleDirectoryChange(rootHandle);
    }
    e.addEventListener("directory-changed", this.directoryChangedListener);
  }

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

  abstract handleDirectoryChange(rootHandle: FileSystemDirectoryHandle): any;
}

export abstract class BaseView extends DirectoryChangeAwareView {
  location?: RouterLocation;
  activeUrl?: string;
  router?: RouterSource;
  private error?: RenderableError;

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
      await this.prepareStateProtected(router.dataSource);
    }
  }

  async handleDirectoryChange(rootHandle: FileSystemDirectoryHandle) {
    const source = new FileSystemDataSource(rootHandle);
    await this.prepareStateProtected(source);
    this.requestUpdate();
  }

  private async prepareStateProtected(source: FileSystemDataSource) {
    try {
      await this.prepareState(this.location!, source);
    } catch (e) {
      if (e instanceof RenderableError) {
        this.error = e;
        return;
      }
      this.error = new RenderableError(
        "(╯°□°)╯︵ ┻┻",
        "Something really bad happened. Please report a bug."
      );
      console.error(e);
      return;
    }
    this.error = undefined;
  }

  render() {
    if (this.error !== undefined) {
      return renderError(this.error);
    }
    if (this.router!.dataSource === undefined) {
      return renderError(errorNoSource());
    }
    return this.renderState();
  }

  abstract prepareState(
    _location: RouterLocation,
    _source: FileSystemDataSource
  ): Promise<any>;

  abstract renderState(): TemplateResult;
}
