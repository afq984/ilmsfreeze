import { assert } from "@esm-bundle/chai";
import { getCourse } from "./crawler";
import * as td from "./testdata";

test("cors configured properly", async () => {
  const response = await fetch("https://lms.nthu.edu.tw");
  assert.equal(response.status, 200);
});

test("getCourse", async () => {
  assert.deepEqual(await getCourse(46274), td.COURSE_46274);
  assert.deepEqual(await getCourse(74), td.COURSE_74);
  assert.deepEqual(await getCourse(40596), td.COURSE_40596);
  assert.deepEqual(await getCourse(1808), td.COURSE_1808);
});
