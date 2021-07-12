import resolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";

export default {
  input: "out/tsc/sw.js",
  output: {
    dir: ".",
  },
  plugins: [
    resolve(),
    replace({
      "process.env.NODE_ENV": JSON.stringify("development"),
      preventAssignment: true,
    }),
  ],
};
