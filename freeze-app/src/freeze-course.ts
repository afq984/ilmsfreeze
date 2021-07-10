import { RouterLocation } from "@vaadin/router";
import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";

import { BaseView, CourseMeta } from "./base-view.js";
import { RouterSource } from "./data-source.js";
import { Fragment, homeFragment } from "./freeze-pathbar.js";
import "./freeze-sidemenu";

@customElement("freeze-course")
export class FreezeCourse extends BaseView {
  @property({ type: Number })
  course_id?: number;

  @property({ attribute: false })
  courseMeta?: CourseMeta;

  @property({ attribute: false })
  body = "";

  @property({ attribute: false })
  fragments: Array<Fragment>;

  constructor() {
    super();
    this.fragments = [];
  }

  async onBeforeEnter(location: RouterLocation, _: any, router: RouterSource) {
    const source = router.dataSource!;
    this.course_id = parseInt(location.params.course_id.toString());
    this.courseMeta = await source.getMeta("course", this.course_id);
    this.body = await source.getText("course", this.course_id, "index.html");
    this.fragments = [
      homeFragment,
      {
        text: this.courseMeta!.name,
        href: `/course/${this.course_id}`,
        active: true,
      },
    ];
    console.log("onbeforeenter");
  }

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
          <div class="content">${unsafeHTML(this.body)}</div>
        </div>
      </div>
    `;
  }
}
