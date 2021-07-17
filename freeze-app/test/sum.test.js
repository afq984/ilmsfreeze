import { expect } from "@esm-bundle/chai";
import { rewriteHTML } from "../out/tsc/rewrite";

it("sums up 2 numbers", () => {
  const src = '<video src="100"></video>';
  const dst = '<video src="200"></video>';
  expect(rewriteHTML(src, "video", { 100: "200" })).to.equal(dst);
  expect(rewriteHTML(src, "video", { 200: "200" })).to.equal(src);
});
