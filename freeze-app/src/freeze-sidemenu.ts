import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { RouterSource } from "./data-source";

import { ChildrenMap, CourseMeta } from "./types";

interface MenuItem {
  typename?: string;
  name: string;
  countable: boolean;
}
const menuItems: Array<MenuItem> = [
  {
    name: "課程說明",
    countable: false,
  },
  {
    typename: "announcement",
    name: "公告",
    countable: true,
  },
  {
    typename: "material",
    name: "上課教材",
    countable: true,
  },
  {
    typename: "discussion",
    name: "討論區",
    countable: true,
  },
  {
    typename: "homework",
    name: "作業",
    countable: true,
  },
  {
    typename: "score",
    name: "成績計算",
    countable: false,
  },
  {
    typename: "grouplist",
    name: "小組專區",
    countable: false,
  },
];

const getLink = (course_id: number, menuItem: MenuItem) => {
  if (menuItem.typename === undefined) {
    return `/course/${course_id}`;
  }
  return `/course/${course_id}/${menuItem.typename}`;
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

  renderLink(meta: CourseMeta, item: MenuItem) {
    const children = this.courseChildren!;
    const url = getLink(meta.id, item);
    const classes = {
      "is-active": url === this.activeUrl,
      "side-menu-disabled":
        item.typename !== undefined && !(item.typename in children),
    };
    let text = item.name;
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
