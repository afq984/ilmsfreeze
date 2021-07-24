import { assert } from "@open-wc/testing";
import { check, mustParseInt, notnull } from "./utils";

suite("check", () => {
  test("true", () => {
    check(true);
  });

  test("false", () => {
    assert.throws(() => check(false));
  });
});

suite("notnull", () => {
  test("null", () => {
    assert.throws(() => notnull(null));
  });

  test("notnull", () => {
    notnull(3);
  });
});

suite("mustParseInt", () => {
  test("int", () => {
    mustParseInt("3");
  });

  for (const s of [".", "?", "NaN", "Inf", "."]) {
    test(s, () => {
      assert.throws(() => mustParseInt(s));
    });
  }
});
