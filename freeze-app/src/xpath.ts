import { check } from "./utils";

export const $x = <T extends Node>(
  xpathExpression: string,
  contextNode: Node
): T[] => {
  const iterator = (
    (contextNode.ownerDocument || contextNode) as Document
  ).evaluate(xpathExpression, contextNode);
  const result = [];
  let item: Node | null;
  while ((item = iterator.iterateNext()) !== null) {
    result.push(item as T);
  }
  return result;
};

export const $x1 = <T extends Node>(
  xpathExpression: string,
  contextNode: Node
): T => {
  const results = $x<T>(xpathExpression, contextNode);
  check(results.length === 1, results.length);
  return results[0];
};
