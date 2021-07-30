import html from "@web/rollup-plugin-html";
import typescript from "@rollup/plugin-typescript";
import resolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import { copy } from "@web/rollup-plugin-copy";

export default [
  {
    plugins: [
      html({
        input: "index.html",
      }),
      typescript({ tsconfig: "src/tsconfig.json", outDir: null }),
      resolve(),
      copy({
        patterns: ["sys/**/*", "sw-status.json"],
      }),
    ],
    output: {
      dir: "out/dev",
      sourcemap: true,
    },
  },
  {
    input: "service-worker/sw.ts",
    output: {
      dir: "out/dev",
      sourcemap: true,
    },
    plugins: [
      typescript({ tsconfig: "service-worker/tsconfig.json", outDir: null }),
      resolve(),
      replace({
        "process.env.NODE_ENV": JSON.stringify("development"),
        preventAssignment: true,
      }),
    ],
  },
];
