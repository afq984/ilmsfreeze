import { assert } from "@open-wc/testing";
import { RenderableError } from "../errors";
import { getCourse, getCourseAnnouncements } from "./course";
import { capture, gather } from "./testutil";
import * as td from "./testdata";

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

  test("authentication required", async () => {
    assert.throws(
      await capture(getCourse(43477)),
      RenderableError,
      "No access to course: course_id=43477"
    );
  });
});

suite("getCourse*", () => {
  test("Announcements", async () => {
    const [announcements] = await gather(
      getCourseAnnouncements(td.COURSE_40596)
    );
    assert.deepInclude(announcements, td.ANNOUNCEMENT_2008652);
    assert.deepInclude(announcements, td.ANNOUNCEMENT_2218728);
  });

  test("AnnouncementsEmpty", async () => {
    const [announcements] = await gather(
      getCourseAnnouncements(td.COURSE_1808)
    );
    assert.deepEqual(announcements, []);
  });
});
