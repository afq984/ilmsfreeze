import { notnull } from "../utils";

const isIllegalAnywhere = (c: string) => {
  const i = notnull(c.codePointAt(0));
  return (
    `"~*/:<>??\\|`.includes(c) ||
    c.match(/\p{Cc}|\p{Cf}/gu) ||
    (0xfdd0 <= i && i <= 0xfdef) ||
    (i <= 0x10ffff && (i & 0xfffe) === 0xfffe)
  );
};

const isIllegalAtEnds = (c: string) => {
  return c.match(/\p{Zs}|\./gu);
};

export const replaceIllegalCharactersInPath = (
  fileName: string,
  replaceChar: string
): string => {
  return Array.from(fileName)
    .map((c, i, a) => {
      if (
        isIllegalAnywhere(c) ||
        ((i === 0 || i + 1 == a.length) && isIllegalAtEnds(c))
      ) {
        return replaceChar;
      }
      return c;
    })
    .join("");
};
