import { html } from "lit";
import { StyleInfo, styleMap } from "lit/directives/style-map.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";

export const materialIcon = (
  name: string,
  styles: StyleInfo = { "font-size": "inherit" }
) =>
  html`<span class="icon">
    <span class="material-icons" style=${styleMap(styles)}>${name}</span>
  </span>`;

export const unsafeContent = (content: string) =>
  html`<div class="content">${unsafeHTML(content)}</div>`;

export const externalLink = (text: string, url: string) =>
  html`<a target="_blank" href=${url}><span class="icon-text">${text}</span>${materialIcon(
    "open_in_new"
  )}</span></a>`;
