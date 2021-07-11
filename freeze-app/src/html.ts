import { html } from "lit";
import { StyleInfo, styleMap } from "lit/directives/style-map.js";

export const materialIcon = (
  name: string,
  styles: StyleInfo = { "font-size": "inherit" }
) =>
  html`<span class="icon">
    <span class="material-icons" style=${styleMap(styles)}>${name}</span>
  </span>`;
