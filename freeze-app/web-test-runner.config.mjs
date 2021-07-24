import { puppeteerLauncher } from "@web/test-runner-puppeteer";

export default {
  nodeResolve: true,
  browsers: [
    puppeteerLauncher({
      launchOptions: {
        args: ["--disable-web-security"],
      },
    }),
  ],
  testFramework: {
    config: {
      ui: "tdd",
    },
  },
};
