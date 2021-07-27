import { assert } from "@open-wc/testing";
import { notnull } from "../utils";
import { processAttachment } from "./file";
import { ATTACHMENT_2616319, ATTACHMENT_2616322 } from "./testdata";
import { gather, readall } from "./testutil";

const ATTACHMENT_2616319_CONTENT = `HW3 成績已公佈
請到 iLMS 查看

各項得分在 iLMS 的評語內
說明：
[C]orrectness, w: 錯的測資數量
[P]erformance, t: 執行總時間
[T]estcase, t: 除了自己以外的執行總時間
[D]emo
[R]eport
[L]inearAdjustment

如有疑問請與助教聯絡
`;

suite("attachment", () => {
  test("process", async () => {
    const [children, saves] = await gather(
      processAttachment(ATTACHMENT_2616319)
    );

    assert.isEmpty(children);
    assert.containsAllKeys(saves, ["meta.json", "announcement.txt"]);
    assert.deepEqual(JSON.parse(saves["meta.json"] as string), {
      ...ATTACHMENT_2616319,
      children: [],
      saved_filename: "announcement.txt",
    });

    const attachmentContent = await readall(
      saves["announcement.txt"] as ReadableStream
    );
    assert.equal(attachmentContent, ATTACHMENT_2616319_CONTENT);
  });

  test("rename", async () => {
    const [children, saves] = await gather(
      processAttachment(ATTACHMENT_2616322)
    );

    assert.isEmpty(children);
    assert.containsAllKeys(saves, ["meta.json", "meta_.json"]);

    const meta = notnull(JSON.parse(saves["meta.json"] as string));
    assert.equal(meta.saved_filename, "meta_.json");
  });

  test("rename illegal", async () => {
    const [children, saves] = await gather(
      processAttachment({ ...ATTACHMENT_2616322, title: ">.<.txt" })
    );

    assert.isEmpty(children);
    assert.containsAllKeys(saves, ["meta.json", "_._.txt"]);

    const meta = notnull(JSON.parse(saves["meta.json"] as string));
    assert.equal(meta.saved_filename, "_._.txt");
  });
});
