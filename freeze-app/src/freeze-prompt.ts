import { html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";

@customElement("freeze-prompt")
export class FreezePrompt extends LitElement {
  createRenderRoot() {
    return this;
  }

  @state()
  title = "title";
  @state()
  body = "";
  @state()
  yes = "OK";
  @state()
  no = "Cancel";
  resolve!: (value: boolean) => any;

  private closeWith(value: boolean) {
    this.resolve(value);
    this.remove();
  }

  render() {
    return html`<div class="modal is-active">
      <div class="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">${this.title}</p>
          <button
            class="delete"
            aria-label="close"
            @click=${() => this.closeWith(false)}
          ></button>
        </header>

        <section class="modal-card-body">
          ${this.body && html`<p style="margin-bottom: 16px">${this.body}</p>`}
          <button class="button is-info" @click=${() => this.closeWith(true)}>
            ${this.yes}
          </button>
          ${this.no &&
          html`<button class="button" @click=${() => this.closeWith(false)}>
            ${this.no}
          </button>`}
        </section>
      </div>
    </div>`;
  }
}

export const ask = (
  title = "title",
  body = "",
  yes = "OK",
  no = "Cancel"
): Promise<boolean> => {
  const prompt = document.createElement("freeze-prompt") as FreezePrompt;
  prompt.title = title;
  prompt.body = body;
  prompt.yes = yes;
  prompt.no = no;
  return new Promise((resolve) => {
    prompt.resolve = resolve;
    document.querySelector("body")!.appendChild(prompt);
  });
};
