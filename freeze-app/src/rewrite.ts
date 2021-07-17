export const rewriteHTML = (
  html: string,
  tag: string,
  srcmap: { [key: string]: string },
  keyfunc: (_: string) => string = (x) => x
) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  for (const element of doc.querySelectorAll(tag)) {
    const src = element.getAttribute("src");
    if (src !== null) {
      const key = keyfunc(src);
      if (key in srcmap) {
        element.setAttribute("src", srcmap[key]);
      }
    }
  }
  return doc.querySelector("body")!.innerHTML;
};
