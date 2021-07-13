import { html, LitElement, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";

import { materialIcon } from "./html";

export interface Fragment {
  text: string | TemplateResult;
  href: string;
  active?: boolean;
}

export const homeFragment = {
  text: materialIcon("home", { "font-size": "1.25em" }),
  href: "/course/",
};

export const fragmentsPush = (frags: Fragment[], f: Fragment) => {
  frags[frags.length - 1].active = false;
  frags.push(f);
  return frags;
};

@customElement("freeze-pathbar")
export class FreezePathbar extends LitElement {
  createRenderRoot() {
    return this;
  }

  @property({ attribute: false })
  fragments: Array<Fragment>;

  constructor() {
    super();
    this.fragments = [];
  }

  render() {
    return html`
      <nav
        class="breadcrumb"
        aria-label="breadcrumbs"
        style="margin-bottom: 1.5rem"
      >
        <ul>
          ${this.fragments.map(
            (fragment) => html`
              <li class="${fragment.active ? "is-active" : ""}">
                <a href="${fragment.href}"> ${fragment.text} </a>
              </li>
            `
          )}
        </ul>
      </nav>
    `;
  }
}
