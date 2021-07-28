import { assert } from "@open-wc/testing";
import { RenderableError } from "../errors";
import {
  getCourse,
  getCourseAnnouncements,
  getCourseDiscussions,
  getCourseGroupLists,
  getCourseHomeworks,
  getCourseMaterials,
  getCourseScores,
} from "./course";
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

  test("Discussions", async () => {
    const [discussions] = await gather(getCourseDiscussions(td.COURSE_40596));

    assert.includeDeepMembers(discussions, [
      td.DISCUSSION_236608,
      td.DISCUSSION_258543,
    ]);
  });

  test("DiscissionsEmpty", async () => {
    const [discussions] = await gather(getCourseDiscussions(td.COURSE_1808));

    assert.deepEqual(discussions, []);
  });

  test("Materials Course-40596", async () => {
    const [materials] = await gather(getCourseMaterials(td.COURSE_40596));

    assert.includeDeepMembers(materials, [
      td.MATERIAL_2004666,
      td.MATERIAL_2173495,
    ]);
  });

  test("Materials Course-74", async () => {
    const [materials] = await gather(getCourseMaterials(td.COURSE_74));

    assert.includeDeepMembers(materials, [td.MATERIAL_1518]);
  });

  test("MatirealsEmpty", async () => {
    const [materials] = await gather(getCourseMaterials(td.COURSE_359));

    assert.deepEqual(materials, []);
  });

  test("Homeworks", async () => {
    const [homeworks] = await gather(getCourseHomeworks(td.COURSE_40596));

    assert.includeDeepMembers(homeworks, [
      td.HOMEWORK_198377,
      td.HOMEWORK_200355,
    ]);
  });

  test("HomeworksEmpty", async () => {
    const [homeworks] = await gather(getCourseHomeworks(td.COURSE_1808));

    assert.deepEqual(homeworks, []);
  });

  test("ScoresEmpty", async () => {
    const [scores] = await gather(getCourseScores(td.COURSE_74));
    assert.deepEqual(scores, []);
  });

  test("GroupList", async () => {
    const [grouplists] = await gather(getCourseGroupLists(td.COURSE_40596));
    assert.deepEqual(grouplists, [td.GROUPLIST_40596]);
  });

  test("GroupListEmpty", async () => {
    const [grouplists] = await gather(getCourseGroupLists(td.COURSE_1808));
    assert.deepEqual(grouplists, []);
  });
});
