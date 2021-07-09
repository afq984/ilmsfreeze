import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

import { Course } from "./base-view";

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

@customElement("freeze-sidemenu")
export class FreezeSidemenu extends LitElement {
  createRenderRoot() {
    return this;
  }

  @property({ attribute: false })
  course?: Course;

  render() {
    return html`<aside class="menu">
      <p class="menu-label">${this.course?.serial}</p>
      <ul class="menu-list">
        ${menuItems.map(
          (item) => html`
            <li>
              <a data-href-TODO> ${item.name} </a>
            </li>
          `
        )}
      </ul>
    </aside>`;
  }
}
