import { expect } from "@esm-bundle/chai";

it("cors configured properly", async () => {
  const response = await fetch("https://lms.nthu.edu.tw");
  expect(response.status).to.equal(200);
});
