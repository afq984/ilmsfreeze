import { assert } from "@open-wc/testing";
import { dl } from "./crawler";
import {
  processAnnouncement,
  processDiscussion,
  processGroupList,
  processHomework,
  processMaterial,
  processScore,
  processSubmission,
} from "./page";
import {
  ANNOUNCEMENT_2218728,
  ATTACHMENT_133807,
  ATTACHMENT_2038513,
  ATTACHMENT_2047732,
  ATTACHMENT_2107249,
  ATTACHMENT_2134734,
  ATTACHMENT_2134738,
  ATTACHMENT_2406879,
  ATTACHMENT_2616319,
  ATTACHMENT_2616320,
  ATTACHMENT_2616322,
  ATTACHMENT_49113,
  DISCUSSION_258543,
  HOMEWORK_182409,
  HOMEWORK_18264,
  HOMEWORK_183084,
  HOMEWORK_201015,
  HOMEWORK_220144,
  HOMEWORK_32460,
  MATERIAL_1518,
  MATERIAL_2173495,
  SUBMISSION_59376,
  SUBMISSION_2474481,
  VIDEO_1518,
} from "./testdata";
import { capture, gather } from "./testutil";

suite("announcement", () => {
  test("process", async () => {
    const [attachments, saves] = await gather(
      processAnnouncement(ANNOUNCEMENT_2218728)
    );

    assert.hasAllKeys(saves, ["index.json"]);

    assert.deepEqual(attachments, [
      dl("Attachment", ATTACHMENT_2616319),
      dl("Attachment", ATTACHMENT_2616320),
      dl("Attachment", ATTACHMENT_2616322),
    ]);
  });

  test("invalid", async () => {
    assert.throws(
      await capture(
        gather(
          processAnnouncement({
            id: 0,
            title: "invalid announcement",
            course: "Course-0",
          })
        )
      )
    );
  });
});

suite("material", () => {
  test("process", async () => {
    const [children, saves] = await gather(processMaterial(MATERIAL_2173495));

    assert.hasAllKeys(saves, ["index.html"]);

    assert.deepEqual(children, [dl("Attachment", ATTACHMENT_2107249)]);
  });

  test("process powercam", async () => {
    const [children, saves] = await gather(processMaterial(MATERIAL_1518));

    assert.hasAllKeys(saves, ["index.html"]);

    assert.deepEqual(children, [dl("Video", VIDEO_1518)]);
  });

  test("invalid", async () => {
    assert.throw(
      await capture(
        gather(
          processMaterial({
            id: 0,
            title: "invalid material",
            type: "Econtent",
            course: "Course-74",
          })
        )
      )
    );
  });
});

suite("discussion", () => {
  test("process", async () => {
    const [children, saves] = await gather(
      processDiscussion(DISCUSSION_258543)
    );

    assert.hasAllKeys(saves, ["index.json"]);

    assert.includeDeepMembers(children, [
      dl("Attachment", ATTACHMENT_2134734),
      dl("Attachment", ATTACHMENT_2134738),
    ]);
  });

  test("invalid", async () => {
    assert.throw(
      await capture(
        gather(
          processDiscussion({
            id: 0,
            title: "invalid discussion",
            course: "Course-74",
          })
        )
      )
    );
  });
});

suite("homework", () => {
  test("process", async () => {
    const [children, saves] = await gather(processHomework(HOMEWORK_201015));

    assert.hasAllKeys(saves, ["index.html", "list.html"]);

    assert.deepEqual(children, [
      dl("Attachment", ATTACHMENT_2038513),
      dl("Attachment", ATTACHMENT_2047732),
    ]);
  });

  test("invalid", async () => {
    assert.throw(
      await capture(
        gather(
          processHomework({
            id: 0,
            title: "invalid homework",
            course: "Course-74",
          })
        )
      )
    );
  });

  test("with submissions", async () => {
    const [children, saves] = await gather(processHomework(HOMEWORK_182409));

    assert.hasAllKeys(saves, ["index.html", "list.html"]);

    assert.isAtLeast(children.length, 50);

    for (const child of children) {
      assert.equal(child.typename, "Submission");
    }
  });

  test("multiple div main", async () => {
    const [, saves] = await gather(processHomework(HOMEWORK_183084));
    assert.hasAllKeys(saves, ["index.html", "list.html"]);
  });

  test("open submission", async () => {
    const [children] = await gather(processHomework(HOMEWORK_220144));

    assert.includeDeepMembers(children, [dl("Submission", SUBMISSION_2474481)]);
  });

  test("open group submission", async () => {
    const [children] = await gather(processHomework(HOMEWORK_18264));

    assert.deepEqual(children, [dl("Submission", SUBMISSION_59376)]);
  });

  test("donload a without content", async () => {
    const [children] = await gather(processHomework(HOMEWORK_32460));

    assert.deepEqual(children, [dl("Attachment", ATTACHMENT_133807)]);
  });
});

suite("submission", () => {
  test("process", async () => {
    const [children, saves] = await gather(
      processSubmission(SUBMISSION_2474481)
    );

    assert.deepEqual(children, [dl("Attachment", ATTACHMENT_2406879)]);
    assert.hasAllKeys(saves, ["index.html"]);
  });

  test("group download", async () => {
    const [children, saves] = await gather(processSubmission(SUBMISSION_59376));

    assert.deepEqual(children, [dl("Attachment", ATTACHMENT_49113)]);
    assert.hasAllKeys(saves, ["index.html"]);
  });
});

suite("score", () => {
  test("process", async () => {
    const [children, saves] = await gather(
      processScore({
        course: "Course-74",
      })
    );

    assert.isEmpty(children);
    assert.hasAllKeys(saves, ["index.html"]);
  });
});

suite("grouplist", () => {
  test("process", async () => {
    const [children, saves] = await gather(
      processGroupList({
        course: "Course-46274",
      })
    );

    assert.isEmpty(children);
    assert.hasAllKeys(saves, ["index.html"]);
  });
});
