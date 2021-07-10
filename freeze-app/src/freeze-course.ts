import { RouterLocation } from "@vaadin/router";
import { html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";

import { BaseView } from "./base-view.js";
import { FileSystemDataSource, RouterSource } from "./data-source.js";
import { Fragment, homeFragment } from "./freeze-pathbar.js";
import "./freeze-sidemenu";
import { TableFields, textField } from "./freeze-table.js";
import {
  AnnouncementMeta,
  ChildrenMap,
  CourseMeta,
  DiscussionMeta,
  HomeworkMeta,
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

abstract class FreezeCourseTable<T> extends FreezeCourseBase {
  @state()
  table: Array<T> = [];
  abstract typename: string;
  abstract fields: TableFields;

  async prepareState(location: RouterLocation, source: FileSystemDataSource) {
    await super.prepareState(location, source);
    this.table = await source.getMetas(
      this.typename,
      this.courseChildren![this.typename]
    );
  }

  renderBody() {
    return html`<freeze-table
      .items=${this.table}
      .fields=${this.fields}
      .sortDescending=${true}
      .sortField=${"id"}
    ></freeze-table>`;
  }
}

@customElement("freeze-course-announcements")
export class FreezeCouseAnnouncements extends FreezeCourseTable<AnnouncementMeta> {
  typename = "announcement";
  fields = {
    id: textField,
    title: textField,
  };
}

@customElement("freeze-course-materials")
export class FreezeCouseMaterials extends FreezeCourseTable<MaterialMeta> {
  typename = "material";
  fields = {
    id: textField,
    title: textField,
    type: textField,
  };
}

@customElement("freeze-course-discussions")
export class FreezeCouseDiscussions extends FreezeCourseTable<DiscussionMeta> {
  typename = "discussion";
  fields = {
    id: textField,
    title: textField,
  };
}

@customElement("freeze-course-homeworks")
export class FzeezeCourseHomeworks extends FreezeCourseTable<HomeworkMeta> {
  typename = "homework";
  fields = {
    id: textField,
    title: textField,
  };
}
