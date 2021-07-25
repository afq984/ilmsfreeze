import { assert } from "@open-wc/testing";
import { capture } from "./testutil";

suite("capture helper", () => {
  test("resolve", async () => {
    assert.equal((await capture(Promise.resolve("foo")))(), "foo");
  });
  test("reject", async () => {
    assert.throw(await capture(Promise.reject("bar")), "bar");
  });
});

test("cors configured properly", async () => {
  const response = await fetch("https://lms.nthu.edu.tw");
  assert.equal(response.status, 200);
});
