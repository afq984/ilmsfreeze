import { html, TemplateResult } from "lit";
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

export type statusClass = {
  iconName: string;
  cssClass: string;
};

export const statusSuccess: statusClass = {
  iconName: "check",
  cssClass: "has-text-success",
};

export const statusUnknown: statusClass = {
  iconName: "hourglass_empty",
  cssClass: "",
};

export const statusWarn: statusClass = {
  iconName: "warning",
  cssClass: "has-text-warning",
};

export const statusFail: statusClass = {
  iconName: "error",
  cssClass: "has-text-danger",
};

export const renderStatus = (
  cls: statusClass,
  text: TemplateResult | string
) => {
  return html`<span class="icon-text">
    <span class="${cls.cssClass}">${materialIcon(cls.iconName)}</span>
    <span>${text}</span>
  </span>`;
};
