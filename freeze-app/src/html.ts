import { html, TemplateResult } from "lit";
import { classMap } from "lit/directives/class-map.js";
import { StyleInfo, styleMap } from "lit/directives/style-map.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { RenderableError } from "./errors";

export const materialIcon = (
  name: string,
  styles: StyleInfo = { "font-size": "inherit" }
) =>
  html`<span class="icon">
    <span class="material-icons" style=${styleMap(styles)}>${name}</span>
  </span>`;

export const unsafeContent = (content: string) =>
  html`<div class="content">${unsafeHTML(content)}</div>`;

export const externalLink = (
  text: string,
  url: string,
  classes: Record<string, boolean> = {}
) =>
  html`<a target="_blank" href=${url} class=${classMap(
    classes
  )}><span class="icon-text">${text}</span>${materialIcon(
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

export const renderError = (err: RenderableError) => {
  const classes = {
    "has-text-centered": true,
    oops: true,
    x2: err.title === "404",
  };
  return html`<div>
    <div class="${classMap(classes)}">${err.title}</div>
    <div class="has-text-centered">${err.message}</div>
  </div>`;
};
