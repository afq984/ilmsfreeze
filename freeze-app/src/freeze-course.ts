import { IndexedParams, RouterLocation } from "@vaadin/router";
import { html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";

import { BaseView } from "./base-view.js";
import { FileSystemDataSource } from "./data-source.js";
import { Fragment, homeFragment } from "./freeze-pathbar.js";
import "./freeze-sidemenu";
import { TableFields, textField } from "./freeze-table.js";
import { materialIcon } from "./html.js";
import {
  AnnouncementMeta,
  AttachmentMeta,
  ChildrenMap,
  CourseMeta,
  DiscussionMeta,
  HomeworkMeta,
  MaterialMeta,
  parseChildren,
} from "./types.js";

const getParamId = (params: IndexedParams, field: string) => {
  const str = params[field].toString();
  return parseInt(str);
};

const getParamMeta = async (
  params: IndexedParams,
  source: FileSystemDataSource,
  typename: string
) => {
  const id = getParamId(params, `${typename}_id`);
  return await source.getMeta(typename, id);
};

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
export class FreezeCourseAnnouncements extends FreezeCourseTable<AnnouncementMeta> {
  typename = "announcement";
  fields() {
    return {
      id: this.makeLinkFn("freeze-announcement"),
      title: this.makeLinkFn("freeze-announcement"),
    };
  }
}

@customElement("freeze-course-materials")
export class FreezeCousreMaterials extends FreezeCourseTable<MaterialMeta> {
  typename = "material";
  fields() {
    return {
      id: this.makeLinkFn("freeze-material"),
      title: this.makeLinkFn("freeze-material"),
      type: textField,
    };
  }
}

@customElement("freeze-course-discussions")
export class FreezeCourseDiscussions extends FreezeCourseTable<DiscussionMeta> {
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
  attachments?: Array<AttachmentMeta>;

  async prepareState(location: RouterLocation, source: FileSystemDataSource) {
    await super.prepareState(location, source);
    const announcement_id = parseInt(
      location.params.announcement_id.toString()
    );
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
    const children = parseChildren(this.announcementMeta!.children);
    this.attachments = await source.getMetas("attachment", children.attachment);
  }

  renderAttachments() {
    if (this.attachments === undefined) {
      return undefined;
    }
    return html`
      <br />
      ${this.attachments.map(
        (item) => html`
          ${materialIcon("attachment")}
          <a href="#TODO">${item.title}</a>
        `
      )}
    `;
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
        ${unsafeHTML(this.news.note)} ${this.renderAttachments()}
      </div>
    `;
  }
}

@customElement("freeze-material")
export class FreezeMaterial extends FreezeCourseBase {
  materialMeta?: MaterialMeta;
  materialChildren?: ChildrenMap;
  materialBody?: string;

  async prepareState(location: RouterLocation, source: FileSystemDataSource) {
    super.prepareState(location, source);
    this.materialMeta = await getParamMeta(location.params, source, "material");
    this.materialChildren = parseChildren(this.materialMeta!.children);
    this.materialBody = await source.getText(
      "material",
      this.materialMeta!.id,
      "index.html"
    );
  }

  renderVideo() {
    if (this.materialChildren!.video === undefined) {
      return undefined;
    }
    return html`<freeze-video
      video_id=${this.materialChildren!.video[0]}
    ></freeze-video>`;
  }

  renderBody() {
    return html`
      ${this.renderVideo()}
      <div class="contenet">${unsafeHTML(this.materialBody!)}</div>
    `;
  }
}

@customElement("freeze-video")
export class FreezeVideo extends LitElement {
  @property({ type: Number })
  video_id?: number;

  render() {
    return html`<div>Video ${this.video_id} TODO</div>`;
  }
}
