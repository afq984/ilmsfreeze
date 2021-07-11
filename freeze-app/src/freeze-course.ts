import { IndexedParams, RouterLocation } from "@vaadin/router";
import { html, LitElement, TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";

import { BaseView } from "./base-view.js";
import { FileSystemDataSource } from "./data-source.js";
import { Fragment, homeFragment } from "./freeze-pathbar.js";
import "./freeze-sidemenu";
import { TableFields, textField } from "./freeze-table.js";
import { materialIcon, unsafeContent } from "./html.js";
import {
  menuItemAnnouncement,
  menuItemDiscussion,
  menuItemGrouplist,
  menuItemHomework,
  menuItemMaterial,
  menuItemScore,
  RouteEntry,
} from "./routes.js";
import {
  AnnouncementMeta,
  AttachmentMeta,
  ChildrenMap,
  CourseMeta,
  DiscussionMeta,
  HomeworkMeta,
  MaterialMeta,
  parseChildren,
  SubmissionMeta,
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

abstract class FreezeCourseBase extends BaseView {
  @state()
  courseMeta?: CourseMeta;
  @state()
  courseChildren?: ChildrenMap;
  abstract get fragments(): Array<Fragment>;

  constructor() {
    super();
  }

  async prepareState(location: RouterLocation, source: FileSystemDataSource) {
    const course_id = parseInt(location.params.course_id.toString());
    this.courseMeta = await source.getMeta("course", course_id);
    this.courseChildren = parseChildren(this.courseMeta!.children);
  }

  abstract renderBody(): string | TemplateResult;

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

@customElement("freeze-course")
export class FreezeCourseOverview extends FreezeCourseBase {
  @state()
  body = "";

  get fragments() {
    return [
      homeFragment,
      {
        text: this.courseMeta!.name,
        href: `/course/${this.courseMeta!.id}`,
        active: true,
      },
    ];
  }

  async prepareState(location: RouterLocation, source: FileSystemDataSource) {
    await super.prepareState(location, source);
    this.body = await source.getText(
      "course",
      this.courseMeta!.id,
      "index.html"
    );
  }

  renderBody() {
    return unsafeContent(this.body);
  }
}

abstract class FreezeCourseL2Base extends FreezeCourseBase {
  abstract menuItem: RouteEntry;

  get typename() {
    return this.menuItem.typename!;
  }

  get fragments(): Fragment[] {
    const course_id_param = { course_id: this.courseMeta!.id.toString() };
    return [
      homeFragment,
      {
        text: this.courseMeta!.name,
        href: this.router!.urlForName("freeze-course", course_id_param),
      },
      {
        text: this.menuItem.displayname,
        href: this.router!.urlForName(
          this.menuItem.component!,
          course_id_param
        ),
        active: true,
      },
    ];
  }
}

@customElement("freeze-course-score")
export class FreezeCourseScore extends FreezeCourseL2Base {
  menuItem = menuItemScore;

  @state()
  body = "";

  async prepareState(location: RouterLocation, source: FileSystemDataSource) {
    await super.prepareState(location, source);
    this.body = await source.getText(
      "score",
      this.courseMeta!.id,
      "index.html"
    );
  }

  renderBody() {
    return unsafeContent(this.body);
  }
}

@customElement("freeze-course-grouplist")
export class FreezeCourseGrouplist extends FreezeCourseL2Base {
  menuItem = menuItemGrouplist;

  @state()
  body = "";

  async prepareState(location: RouterLocation, source: FileSystemDataSource) {
    await super.prepareState(location, source);
    this.body = await source.getText(
      "grouplist",
      this.courseMeta!.id,
      "index.html"
    );
  }

  renderBody() {
    return unsafeContent(this.body);
  }
}

abstract class FreezeCourseTable<T> extends FreezeCourseL2Base {
  @state()
  table: Array<T> = [];
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
  menuItem = menuItemAnnouncement;
  fields() {
    return {
      id: this.makeLinkFn("freeze-announcement"),
      title: this.makeLinkFn("freeze-announcement"),
    };
  }
}

@customElement("freeze-course-materials")
export class FreezeCousreMaterials extends FreezeCourseTable<MaterialMeta> {
  menuItem = menuItemMaterial;
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
  menuItem = menuItemDiscussion;
  fields() {
    return {
      id: this.makeLinkFn("freeze-discussion"),
      title: this.makeLinkFn("freeze-discussion"),
    };
  }
}

@customElement("freeze-course-homeworks")
export class FzeezeCourseHomeworks extends FreezeCourseTable<HomeworkMeta> {
  menuItem = menuItemHomework;
  fields() {
    return {
      id: this.makeLinkFn("freeze-homework"),
      title: this.makeLinkFn("freeze-homework"),
    };
  }
}

@customElement("freeze-announcement")
export class FreezeCourseAnnouncement extends FreezeCourseL2Base {
  menuItem = menuItemAnnouncement;

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
export class FreezeMaterial extends FreezeCourseL2Base {
  menuItem = menuItemMaterial;

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

@customElement("freeze-discussion")
export class FreezeDiscussion extends FreezeCourseL2Base {
  menuItem = menuItemDiscussion;

  discussionMeta?: DiscussionMeta;
  discussionJson?: any;

  async prepareState(location: RouterLocation, source: FileSystemDataSource) {
    super.prepareState(location, source);
    this.discussionMeta = await getParamMeta(
      location.params,
      source,
      "discussion"
    );
    this.discussionJson = await source.getJson(
      "discussion",
      this.discussionMeta!.id,
      "index.json"
    );
  }

  renderBody() {
    return html`${this.discussionJson.posts.items.map(
      (post: any) => html`
        <div class="box">
          <div class="content">
            <strong>${post.name}</strong>
            <small>${materialIcon("email")} ${post.email}</small>
            <small>${materialIcon("calendar_today")} ${post.date}</small>
            <br />
            ${unsafeHTML(post.note)}
            ${post.attach.map(
              (attachment: any, index: number) => html`
                ${index === 0 ? html`<br />` : undefined}
                ${materialIcon("attachment")}
                <a href="#TODO">${attachment.srcName}</a>
              `
            )}
          </div>
        </div>
      `
    )}`;
  }
}

@customElement("freeze-homework")
export class FreezeHomework extends FreezeCourseL2Base {
  menuItem = menuItemHomework;

  @state()
  homeworkMeta?: HomeworkMeta;
  @state()
  homeworkChildren?: ChildrenMap;
  @state()
  body = "";

  get fragments() {
    const frag = super.fragments;
    const hw_params = {
      course_id: this.courseMeta!.id.toString(),
      homework_id: this.homeworkMeta!.id.toString(),
    };
    frag[frag.length - 1].active = false;
    frag.push({
      text: this.homeworkMeta!.title,
      href: this.router!.urlForName("freeze-homework", hw_params),
      active: true,
    });
    frag.push({
      text: `可下載 (${this.homeworkChildren!.submittedhomework?.length || 0})`,
      href: this.router!.urlForName("freeze-homework-submissions", hw_params),
    });
    return frag;
  }

  async prepareState(location: RouterLocation, source: FileSystemDataSource) {
    super.prepareState(location, source);
    this.homeworkMeta = await getParamMeta(location.params, source, "homework");
    this.body = await source.getText(
      "homework",
      this.homeworkMeta!.id,
      "index.html"
    );
    this.homeworkChildren = parseChildren(this.homeworkMeta!.children);
  }

  renderBody() {
    return unsafeContent(this.body);
  }
}

@customElement("freeze-homework-submissions")
export class FreezeHomeworkSubmissions extends FreezeHomework {
  @state()
  submissions?: SubmissionMeta[];

  get fragments() {
    const frag = super.fragments;
    frag[frag.length - 2].active = false;
    frag[frag.length - 1].active = true;
    return frag;
  }

  async prepareState(location: RouterLocation, source: FileSystemDataSource) {
    await super.prepareState(location, source);
    this.submissions = await source.getMetas(
      "submittedhomework",
      this.homeworkChildren!.submittedhomework
    );
  }

  fields() {
    return {
      id: textField,
      title: textField,
      by: textField,
      comment: (_: any, attr: string) => attr || "-",
    };
  }

  renderBody() {
    if (this.submissions === undefined || this.submissions.length === 0) {
      return html`
        <div style="display: inline-block">
          <div class="oops">¯\\_(ツ)_/¯</div>
          <div class="has-text-centered">no submissions found</div>
        </div>
      `;
    }
    return html`<freeze-table
      .items=${this.submissions}
      .fields=${this.fields()}
      .sortDescending=${true}
      .sortField=${"id"}
    ></freeze-table>`;
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
