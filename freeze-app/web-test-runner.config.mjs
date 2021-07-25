import { puppeteerLauncher } from "@web/test-runner-puppeteer";

const origin = process.env.ILMS_ORIGIN;
let createPage = undefined;
if (origin) {
  const originURL = new URL(origin);
  createPage = async ({ context }) => {
    const page = await context.newPage();
    await page.setRequestInterception(true);
    page.on("request", (request) => {
      const url = new URL(request.url());
      if (url.host === "lms.nthu.edu.tw") {
        url.host = originURL.host;
        url.protocol = originURL.protocol;
      }
      request.continue({
        url: url.toString(),
      });
    });
    return page;
  };
}

export default {
  files: "out/tsc/**/*.test.js",
  nodeResolve: true,
  browsers: [
    puppeteerLauncher({
      launchOptions: {
        args: ["--disable-web-security"],
      },
      createPage: createPage,
    }),
  ],
  testFramework: {
    config: {
      ui: "tdd",
    },
  },
};
