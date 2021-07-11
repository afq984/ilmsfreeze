import { RouterLocation } from "@vaadin/router";
import { html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";

import { BaseView } from "./base-view.js";
import { FileSystemDataSource } from "./data-source.js";
import { Fragment, homeFragment } from "./freeze-pathbar.js";
import "./freeze-sidemenu";
import { TableFields, textField } from "./freeze-table.js";
import { materialIcon } from "./html.js";
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
          .courseChildren=${this.courseChildren}
          .activeUrl=${this.activeUrl}
          .router=${this.router}
        ></freeze-sidemenu>
        <div class="column">${this.renderBody()}</div>
      </div>
    `;
  }
}

abstract class FreezeCourseBody extends FreezeCourseBase {
  @state()
  body = "";

  renderBody() {
    return html`<div class="content">${unsafeHTML(this.body)}</div>`;
  }
}

@customElement("freeze-course")
export class FreezeCourseOverview extends FreezeCourseBody {
  async prepareState(location: RouterLocation, source: FileSystemDataSource) {
    await super.prepareState(location, source);
    this.body = await source.getText(
      "course",
      this.courseMeta!.id,
      "index.html"
    );
  }
}

@customElement("freeze-course-score")
export class FreezeCourseScore extends FreezeCourseBody {
  async prepareState(location: RouterLocation, source: FileSystemDataSource) {
    await super.prepareState(location, source);
    this.body = await source.getText(
      "score",
      this.courseMeta!.id,
      "index.html"
    );
  }
}

@customElement("freeze-course-grouplist")
export class FreezeCourseGrouplist extends FreezeCourseBody {
  async prepareState(location: RouterLocation, source: FileSystemDataSource) {
    await super.prepareState(location, source);
    this.body = await source.getText(
      "grouplist",
      this.courseMeta!.id,
      "index.html"
    );
  }
}

abstract class FreezeCourseTable<T> extends FreezeCourseBase {
  @state()
  table: Array<T> = [];
  abstract typename: string;
  abstract fields(): TableFields;

  makeLinkFn(component: string) {
    const typename_id = `${this.typename}_id`;
    return (item: any, attr: any) => {
      const url = this.router!.urlForName(component, {
        course_id: this.courseMeta!.id.toString(),
        [typename_id]: item.id.toString(),
      });
      return html`<a href="${url}">${attr}</a>`;
    };
  }

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
      .fields=${this.fields()}
      .sortDescending=${true}
      .sortField=${"id"}
    ></freeze-table>`;
  }
}

@customElement("freeze-course-announcements")
export class FreezeCouseAnnouncements extends FreezeCourseTable<AnnouncementMeta> {
  typename = "announcement";
  fields() {
    return {
      id: this.makeLinkFn("freeze-announcement"),
      title: this.makeLinkFn("freeze-announcement"),
    };
  }
}

@customElement("freeze-course-materials")
export class FreezeCouseMaterials extends FreezeCourseTable<MaterialMeta> {
  typename = "material";
  fields() {
    return {
      id: textField,
      title: textField,
      type: textField,
    };
  }
}

@customElement("freeze-course-discussions")
export class FreezeCouseDiscussions extends FreezeCourseTable<DiscussionMeta> {
  typename = "discussion";
  fields() {
    return {
      id: textField,
      title: textField,
    };
  }
}

@customElement("freeze-course-homeworks")
export class FzeezeCourseHomeworks extends FreezeCourseTable<HomeworkMeta> {
  typename = "homework";
  fields() {
    return {
      id: textField,
      title: textField,
    };
  }
}

@customElement("freeze-announcement")
export class FreezeCourseAnnouncement extends FreezeCourseBase {
  announcementMeta?: AnnouncementMeta;
  news: any;

  async prepareState(location: RouterLocation, source: FileSystemDataSource) {
    await super.prepareState(location, source);
    const announcement_id = parseInt(
      location.params.announcement_id.toString()
    );
    console.log(announcement_id);
    this.announcementMeta = await source.getMeta(
      "announcement",
      announcement_id
    );
    this.news = (
      await source.getJson(
        "announcement",
        this.announcementMeta!.id,
        "index.json"
      )
    ).news;
  }

  renderBody() {
    return html`
      <h1 class="title">${this.announcementMeta!.title}</h1>
      <strong>${this.news.poster}</strong>
      <small>
        ${materialIcon("visibility")}
        <span>${this.news.views}</span>
      </small>
      <small>
        ${materialIcon("calendar_today")}
        <span>${this.news.createTime}</span>
      </small>
      <div class="content">
        <br />
        ${unsafeHTML(this.news.note)}
      </div>
    `;
  }
}
