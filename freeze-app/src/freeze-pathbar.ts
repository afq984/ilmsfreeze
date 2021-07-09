import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

export interface Fragment {
  text: string;
  href: string;
  active?: boolean;
}

export const homeFragment = {
  text: "homeTODO",
  href: "/",
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
                <a href="${fragment.active ? "#" : fragment.href}">
                  ${fragment.text}
                </a>
              </li>
            `
          )}
        </ul>
      </nav>
    `;
  }
}
