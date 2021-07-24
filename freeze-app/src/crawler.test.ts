import { assert } from "@open-wc/testing";
import { getCourse } from "./crawler";
import { RenderableError } from "./errors";
import * as td from "./testdata";

const capture = async <T>(promise: Promise<T>) => {
  let result: T;
  try {
    result = await promise;
  } catch (exc) {
    return () => {
      throw exc;
    };
  }
  return () => result;
};

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

suite("getCourse", () => {
  test("open courses", async () => {
    assert.deepEqual(await getCourse(46274), td.COURSE_46274);
    assert.deepEqual(await getCourse(74), td.COURSE_74);
    assert.deepEqual(await getCourse(40596), td.COURSE_40596);
    assert.deepEqual(await getCourse(1808), td.COURSE_1808);
  });

  test("does not exist", async () => {
    assert.throws(
      await capture(getCourse(0)),
      RenderableError,
      "Empty response returend from course, the course probably doesn't exist: course_id=0"
    );
  });
});