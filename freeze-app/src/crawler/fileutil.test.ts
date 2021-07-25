import { replaceIllegalCharactersInPath } from "./fileutil";
import { assert } from "@open-wc/testing";

suite("replaceIllegalCharactersInPath", () => {
  // https://source.chromium.org/chromium/chromium/src/+/master:base/i18n/file_util_icu_unittest.cc;l=52-87;drc=000df18f71b5eddeafbb3e07648f5fb55e464e13
  // https://github.com/afq984/ilmsdump/blob/main/tests/test_fileutil.py
  const testData = [
    ['"bad*file:name?.jpg"', "bad*file:name?.jpg", "bad-file-name-.jpg"],
    ['"**********::::.txt"', "**********::::.txt", "--------------.txt"],
    [
      '"bad\\u0003\\u0091 file\\u200e\\u200fname.png"',
      "bad\u0003\u0091 file\u200e\u200fname.png",
      "bad-- file--name.png",
    ],
    ['"bad*file\\\\?name.jpg"', "bad*file\\?name.jpg", "bad-file--name.jpg"],
    [
      '"\\t  bad*file\\\\name/.jpg"',
      "\t  bad*file\\name/.jpg",
      "-  bad-file-name-.jpg",
    ],
    [
      '"this_file_name is okay!.mp3"',
      "this_file_name is okay!.mp3",
      "this_file_name is okay!.mp3",
    ],
    ['"\\u4e00\\uac00.mp3"', "\u4e00\uac00.mp3", "\u4e00\uac00.mp3"],
    [
      '"\\u0635\\u200c\\u0644.mp3"',
      "\u0635\u200c\u0644.mp3",
      "\u0635-\u0644.mp3",
    ],
    [
      '"\\ud800\\udf30\\ud800\\udf31.mp3"',
      "\ud800\udf30\ud800\udf31.mp3",
      "\ud800\udf30\ud800\udf31.mp3",
    ],
    [
      '"\\u0378\\ud8c0\\udc01.mp3"',
      "\u0378\ud8c0\udc01.mp3",
      "\u0378\ud8c0\udc01.mp3",
    ],
    [
      '"bad\\ufffffile\\udbff\\udffename.jpg"',
      "bad\ufffffile\udbff\udffename.jpg",
      "bad-file-name.jpg",
    ],
    [
      '"bad\\ufdd0file\\ufdefname.jpg"',
      "bad\ufdd0file\ufdefname.jpg",
      "bad-file-name.jpg",
    ],
    [
      '"(\\u200c.\\u200d.\\u200e.\\u200f.\\u202a.\\u202b.\\u202c.\\u202d.\\u202e.\\u206a.\\u206b.\\u206c.\\u206d.\\u206f.\\ufeff)"',
      "(\u200c.\u200d.\u200e.\u200f.\u202a.\u202b.\u202c.\u202d.\u202e.\u206a.\u206b.\u206c.\u206d.\u206f.\ufeff)",
      "(-.-.-.-.-.-.-.-.-.-.-.-.-.-.-)",
    ],
    ['"config~1"', "config~1", "config-1"],
    ['" _ "', " _ ", "-_-"],
    ['" "', " ", "-"],
    ['"\\u2008.(\\u2007).\\u3000"', "\u2008.(\u2007).\u3000", "-.(\u2007).-"],
    ['"     "', "     ", "-   -"],
    ['".    "', ".    ", "-   -"],
  ];

  for (const [name, input, output] of testData) {
    test(name, () => {
      assert.equal(replaceIllegalCharactersInPath(input, "-"), output);
    });
  }
});
