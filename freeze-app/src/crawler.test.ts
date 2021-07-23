import { expect } from "@esm-bundle/chai";
import { getCourse } from "./crawler";
import * as td from "./testdata";

it("cors configured properly", async () => {
  const response = await fetch("https://lms.nthu.edu.tw");
  expect(response.status).to.equal(200);
});

it("getCourse", async () => {
  expect(await getCourse(74)).deep.equal(td.COURSE_74);
  expect(await getCourse(46274)).deep.equal(td.COURSE_46274);
});
