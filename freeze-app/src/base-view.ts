import { Commands, RouterLocation } from "@vaadin/router";
import { LitElement, TemplateResult } from "lit";
import { DataSource } from "./data-source";
import { errorNoSource, RenderableError } from "./errors";
import { renderError } from "./html";
import { RouterSource } from "./routes";

export abstract class DirectoryChangeAwareView extends LitElement {
  private subscribedTo?: Element;
  private directoryChangedListener: EventListener;

  constructor() {
    super();
    this.directoryChangedListener = (e: Event) => {
      this.handleDirectoryChange((e as CustomEvent).detail as DataSource);
    };
  }

  private async subscribe(e: Element, dataSource?: DataSource) {
    this.subscribedTo = e;
    if (dataSource !== undefined) {
      await this.handleDirectoryChange(dataSource);
    }
    e.addEventListener("directory-changed", this.directoryChangedListener);
  }

  connectedCallback() {
    super.connectedCallback();
    const options = {
      detail: async (e: Element, dataSource?: DataSource) => {
        await this.subscribe(e, dataSource);
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

  abstract handleDirectoryChange(dataSource: DataSource): any;
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

  async handleDirectoryChange(dataSource: DataSource) {
    await this.prepareStateProtected(dataSource);
    this.requestUpdate();
  }

  private async prepareStateProtected(source: DataSource) {
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
    _source: DataSource
  ): Promise<any>;

  abstract renderState(): TemplateResult;
}
