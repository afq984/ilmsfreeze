import { RouterLocation } from "@vaadin/router";
import { html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";

import { BaseView, CourseMeta } from "./base-view.js";
import { FileSystemDataSource, RouterSource } from "./data-source.js";
import { Fragment, homeFragment } from "./freeze-pathbar.js";
import "./freeze-sidemenu";

class FreezeCourseBase extends BaseView {
  @state()
  courseMeta?: CourseMeta;
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
        <div class="column">
          <div class="content">${this.renderBody()}</div>
        </div>
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
    return unsafeHTML(this.body);
  }
}
