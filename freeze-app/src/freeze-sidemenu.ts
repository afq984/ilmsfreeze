import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";

import { ChildrenMap, CourseMeta } from "./types";
import { menuItems, RouteEntry, RouterSource } from "./routes";

const getLink = (
  router: RouterSource,
  course_id: number,
  menuItem: RouteEntry
) => {
  const params = { course_id: course_id.toString() };
  return router.urlForName(menuItem.component!, params);
};

@customElement("freeze-sidemenu")
export class FreezeSidemenu extends LitElement {
  createRenderRoot() {
    return this;
  }

  @property({ attribute: false })
  courseMeta?: CourseMeta;
  @property({ attribute: false })
  courseChildren?: ChildrenMap;
  @property({ attribute: false })
  activeUrl?: string;
  @property({ attribute: false })
  router?: RouterSource;

  renderLink(meta: CourseMeta, item: RouteEntry) {
    const children = this.courseChildren!;
    const url = getLink(this.router!, meta.id, item);
    const classes = {
      "is-active": url === this.activeUrl,
      "side-menu-disabled":
        item.typename !== undefined && !(item.typename in children),
    };
    let text = item.displayname;
    if (item.typename !== undefined && item.countable) {
      text = `${text} (${(children[item.typename] || []).length})`;
    }
    return html`<a href="${url}" class="${classMap(classes)}">${text}</a>`;
  }

  render() {
    const meta = this.courseMeta!;
    return html`<aside class="menu">
      <p class="menu-label">${meta.serial}</p>
      <ul class="menu-list">
        ${menuItems.map(
          (item) => html` <li>${this.renderLink(meta, item)}</li> `
        )}
      </ul>
    </aside>`;
  }
}
