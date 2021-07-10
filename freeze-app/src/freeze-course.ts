import { RouterLocation } from "@vaadin/router";
import { html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";

import { BaseView } from "./base-view.js";
import { FileSystemDataSource, RouterSource } from "./data-source.js";
import { Fragment, homeFragment } from "./freeze-pathbar.js";
import "./freeze-sidemenu";
import { textField } from "./freeze-table.js";
import {
  AnnouncementMeta,
  ChildrenMap,
  CourseMeta,
  MaterialMeta,
  parseChildren,
} from "./types.js";

class FreezeCourseBase extends BaseView {
  @state()
  courseMeta?: CourseMeta;
  @state()
  courseChildren?: ChildrenMap;
  @state()
  fragments: Array<Fragment>;

  constructor() {
    super();
    this.fragments = [];
  }

  async onBeforeEnter(location: RouterLocation, _: any, router: RouterSource) {
    await this.prepareState(location, router.dataSource!);
  }

  async prepareState(location: RouterLocation, source: FileSystemDataSource) {
    const course_id = parseInt(location.params.course_id.toString());
    this.courseMeta = await source.getMeta("course", course_id);
    this.courseChildren = parseChildren(this.courseMeta!.children);
    this.fragments = [
      homeFragment,
      {
        text: this.courseMeta!.name,
        href: `/course/${course_id}`,
        active: true,
      },
    ];
  }

  renderBody() {}

  render() {
    if (this.courseMeta === undefined) {
      return html`404`;
    }
    return html`
      <freeze-pathbar .fragments=${this.fragments}></freeze-pathbar>
      <div class="columns">
        <freeze-sidemenu
          class="column is-one-fifth"
          .courseMeta=${this.courseMeta}
        ></freeze-sidemenu>
        <div class="column">${this.renderBody()}</div>
      </div>
    `;
  }
}

@customElement("freeze-course")
export class FreezeCourseOverview extends FreezeCourseBase {
  @state()
  body = "";

  async prepareState(location: RouterLocation, source: FileSystemDataSource) {
    await super.prepareState(location, source);
    this.body = await source.getText(
      "course",
      this.courseMeta!.id,
      "index.html"
    );
  }

  renderBody() {
    return html`<div class="content">${unsafeHTML(this.body)}</div>`;
  }
}

@customElement("freeze-course-announcements")
export class FreezeCouseAnnouncements extends FreezeCourseBase {
  @state()
  announcements: Array<AnnouncementMeta> = [];

  async prepareState(location: RouterLocation, source: FileSystemDataSource) {
    await super.prepareState(location, source);
    this.announcements = await source.getMetas(
      "announcement",
      this.courseChildren!.announcement
    );
  }

  renderBody() {
    const fields = {
      id: textField,
      title: textField,
    };
    return html`<freeze-table
      .items=${this.announcements}
      .fields=${fields}
      .sortDescending=${true}
      .sortField=${"id"}
    ></freeze-table>`;
  }
}

@customElement("freeze-course-materials")
export class FreezeCourseMaterials extends FreezeCourseBase {
  @state()
  materials: Array<MaterialMeta> = [];

  async prepareState(location: RouterLocation, source: FileSystemDataSource) {
    await super.prepareState(location, source);
    this.materials = await source.getMetas(
      "material",
      this.courseChildren!.material
    );
  }

  renderBody() {
    const fields = {
      id: textField,
      title: textField,
      type: textField,
    };
    return html`<freeze-table
      .items=${this.materials}
      .fields=${fields}
      .sortDescending=${true}
      .sortField=${"id"}
    ></freeze-table>`;
  }
}
