// Import rollup plugins
import html from "@web/rollup-plugin-html";
import typescript from "@rollup/plugin-typescript";
import { copy } from "@web/rollup-plugin-copy";
import resolve from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";
import minifyHTML from "rollup-plugin-minify-html-literals";
import summary from "rollup-plugin-summary";
import replace from "@rollup/plugin-replace";

const plugins = () => {
  return [
    replace({
      "process.env.NODE_ENV": JSON.stringify("development"),
      preventAssignment: true,
    }),
    // Resolve bare module specifiers to relative paths
    resolve(),
    // Minify HTML template literals
    minifyHTML(),
    // Minify JS
    terser({
      ecma: 2020,
      module: true,
      warnings: true,
    }),
    // Print bundle summary
    summary(),
  ];
};

export default [
  {
    plugins: [
      // Entry point for application build; can specify a glob to build multiple
      // HTML files for non-SPA app
      html({
        input: "index.html",
      }),
      typescript({ tsconfig: "src/tsconfig.json", outDir: null }),
      ...plugins(),
      // Optional: copy any static assets to build directory
      copy({
        patterns: ["sys/**/*", "sw-status.json"],
      }),
    ],
    output: {
      dir: "out/dist",
      sourcemap: true,
    },
    preserveEntrySignatures: "strict",
  },
  {
    input: "service-worker/sw.ts",
    plugins: [
      typescript({ tsconfig: "service-worker/tsconfig.json", outDir: null }),
      ...plugins(),
    ],
    output: {
      dir: "out/dist",
      sourcemap: true,
    },
  },
];
