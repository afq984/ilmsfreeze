import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("freeze-no-source")
export class FreezeNoSource extends LitElement {
  createRenderRoot() {
    return this;
  }

  render() {
    const 佛心 = "╰(⊙д⊙)╮";
    const 公司 = "╭(⊙д⊙)╯";
    return html`<div>
      <div class="oops has-text-centered">
        ${Math.random() < 0.5 ? 佛心 : 公司}
      </div>
      <div class="has-text-centered">Open a local directory to get started</div>
    </div>`;
  }
}
