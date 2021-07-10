import { RouterLocation } from "@vaadin/router";
import { LitElement } from "lit";
import { property } from "lit/decorators.js";

export interface CourseMeta {
  id: number;
  serial: string;
  is_admin: string;
  name: string;
  children: Array<string>;
}

export class BaseView extends LitElement {
  subscribedTo?: Element;
  directoryChangedListener: EventListener;
  location?: RouterLocation;

  @property({ attribute: false })
  courses: Array<CourseMeta> = [];

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
