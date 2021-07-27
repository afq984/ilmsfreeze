import { assert } from "@open-wc/testing";

import { $x, $x1 } from "./xpath";
import { parseHTML } from "./crawler";

const body = `<ul>
  <li><a href="/a">a</a></li>
  <li><a href="/b">b</a></li>
  <li class="last"><a href="/c">c</a></li>
</ul>`;

const html = parseHTML(body);

suite("xpath", () => {
  test("xpath", () => {
    assert.lengthOf($x("//li", html), 3);
  });

  test("element", () => {
    assert.dom.equal(
      $x1('//li[@class="last"]', html),
      `<li class="last"><a href="/c">c</li>`
    );
  });

  test("text", () => {
    assert.equal(
      $x1<Text>('//li[@class="last"]/a/text()', html).textContent,
      "c"
    );
  });

  test("attr", () => {
    assert.equal(
      $x1<Attr>('//li[@class="last"]/a/@href', html).nodeValue,
      "/c"
    );
  });

  test("$x1 none matched", () => {
    assert.throws(() => $x1("//table", html));
  });

  test("$x1 matched multiple", () => {
    assert.throws(() => $x1("//li", html));
  });
});
