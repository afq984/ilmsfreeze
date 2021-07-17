import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("freeze-404")
export class Freeze404 extends LitElement {
  createRenderRoot() {
    return this;
  }

  render() {
    return html`<div>
      <div class="oops x2 has-text-centered">404</div>
      <div class="has-text-centered">Page not found</div>
    </div>`;
  }
}
