import { assert } from "@open-wc/testing";
import { processAnnouncement } from "./page";
import {
  ANNOUNCEMENT_2218728,
  ATTACHMENT_2616319,
  ATTACHMENT_2616320,
  ATTACHMENT_2616322,
} from "./testdata";
import { capture, gather } from "./testutil";

suite("announcement", () => {
  test("process", async () => {
    const attachments = await gather(processAnnouncement(ANNOUNCEMENT_2218728));

    // TODO: the announcement itself

    assert.deepEqual(attachments, [
      ATTACHMENT_2616319,
      ATTACHMENT_2616320,
      ATTACHMENT_2616322,
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
