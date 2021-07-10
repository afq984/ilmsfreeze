import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

import { CourseMeta } from "./base-view";

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

  render() {
    const meta = this.courseMeta!;
    return html`<aside class="menu">
      <p class="menu-label">${meta.serial}</p>
      <ul class="menu-list">
        ${menuItems.map(
          (item) => html`
            <li>
              <a href=${getLink(meta.id, item)}> ${item.name} </a>
            </li>
          `
        )}
      </ul>
    </aside>`;
  }
}
