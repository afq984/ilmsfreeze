// https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
export class RenderableError extends Error {
  title: string;
  constructor(title: string, message: string) {
    super(message);
    this.title = title;
    Object.setPrototypeOf(this, RenderableError.prototype);
  }
}

export const error404 = (message = "Page not found") =>
  new RenderableError("404", message);

const 佛心 = new RenderableError("╰(⊙д⊙)╮", "Open a directory to get started");
const 公司 = new RenderableError("╭(⊙д⊙)╯", 佛心.message);
export const errorNoSource = () => (Math.random() < 0.5 ? 佛心 : 公司);

export const error400 = (message: string) =>
  new RenderableError("ヽ(´ー｀)┌", message);

export const error403 = (message: string) =>
  new RenderableError("（・Ａ・）", message);
