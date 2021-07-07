import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import { Router } from "@vaadin/router";

import { Course } from "./base-view";
import "./freeze-navbar";
import "./freeze-browse";
import "./freeze-download";

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
  ]);
}

@customElement("freeze-app")
export class FreezeApp extends LitElement {
  courses: Array<Course> = [];

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
    const courseDir = await rootHandle.getDirectoryHandle("course");
    let courses = [];
    for await (const entry of courseDir.values()) {
      // @ts-ignore
      const meta = await entry.getFileHandle("meta.json");
      const file = await meta.getFile();
      const obj = JSON.parse(await file.text());
      courses.push(obj);
    }

    this.courses = courses;
    const options = {
      detail: courses,
    };
    this.dispatchEvent(new CustomEvent("course-changed", options));
  }

  private _onSubscribe(e: CustomEvent) {
    e.detail(this, this.courses);
  }
}
