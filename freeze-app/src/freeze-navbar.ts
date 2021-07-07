import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("freeze-navbar")
export class IlNavbar extends LitElement {
  createRenderRoot() {
    return this;
  }

  render() {
    return html`<nav
      class="navbar is-light"
      role="navigation"
      aria-label="main navigation"
    >
      <section class="container">
        <div class="navbar-brand">
          <a class="navbar-item" href="#">
            <strong>ilmsfreeze</strong>
          </a>

          <a
            role="button"
            class="navbar-burger"
            aria-label="menu"
            aria-expanded="false"
            data-target="navbarBasicExample"
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>

        <div id="navbarBasicExample" class="navbar-menu">
          <div class="navbar-start">
            <a class="navbar-item"> Browse </a>
            <a class="navbar-item"> Download </a>
          </div>

          <div class="navbar-end">
            <div class="navbar-item">
              <div class="buttons">
                <button
                  class="button is-primary"
                  @click="${this._dispatchClick}"
                >
                  <strong>Open Directory...</strong>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </nav>`;
  }

  private _dispatchClick() {
    const options = {
      detail: "yee",
      bubbles: true,
      composed: true,
    };
    this.dispatchEvent(new CustomEvent("directory-open", options));
  }
}
