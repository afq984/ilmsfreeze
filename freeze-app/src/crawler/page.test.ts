import { assert } from "@open-wc/testing";
import { dl } from "./crawler";
import {
  processAnnouncement,
  processDiscussion,
  processMaterial,
} from "./page";
import {
  ANNOUNCEMENT_2218728,
  ATTACHMENT_2107249,
  ATTACHMENT_2134734,
  ATTACHMENT_2134738,
  ATTACHMENT_2616319,
  ATTACHMENT_2616320,
  ATTACHMENT_2616322,
  DISCUSSION_258543,
  MATERIAL_1518,
  MATERIAL_2173495,
  VIDEO_1518,
} from "./testdata";
import { capture, gather } from "./testutil";

suite("announcement", () => {
  test("process", async () => {
    const [attachments, saves] = await gather(
      processAnnouncement(ANNOUNCEMENT_2218728)
    );

    assert.containsAllKeys(saves, ["index.json"]);

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
