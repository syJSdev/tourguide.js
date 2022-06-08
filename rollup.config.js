import path from "node:path";
import { babel } from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
// import eslint from "@rollup/plugin-eslint";
import { nodeResolve as resolve } from "@rollup/plugin-node-resolve";
import filesize from "rollup-plugin-filesize";
import sass from "rollup-plugin-sass";
import { terser } from "rollup-plugin-terser";
import autoprefixer from "autoprefixer";
import postcss from "postcss";
import pkg from "./package.json";

const plugins = [
  resolve({
    browser: true,
    preferBuiltins: true,
  }),
  commonjs({
    exclude: "node_modules/process-es6/**",
    include: "node_modules/**",
  }),
  babel({ babelHelpers: "bundled", configFile: path.resolve(__dirname, ".babelrc") }),
  filesize(),
];

// eslint-disable-next-line import/no-anonymous-default-export
export default [
  {
    input: pkg.src,
    output: [
      {
        format: "esm",
        exports: "auto",
        file: pkg.module,
      },
      {
        format: "umd",
        name: "Tourguide",
        file: pkg.main,
      },
    ],
    plugins: [
      sass({
        insert: false,
        output: "tourguide.css",
        options: { outputStyle: "compressed" },
        processor: (css) =>
          postcss([autoprefixer])
            .process(css, { from: undefined })
            .then((result) => result.css),
      }),
      // eslint({
      //   include: ["./src/**"],
      //   fix: true,
      //   throwOnError: true,
      // }),
      ...plugins,
    ],
  },
  {
    input: pkg.src,
    output: [
      {
        format: "iife",
        strict: false,
        exports: "auto",
        name: "Tourguide",
        file: pkg.browser,
      },
    ],
    plugins: [
      sass({
        insert: false,
      }),
      ...plugins,
      terser(),
    ],
  },
];
