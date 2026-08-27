// Bundles the panel into one ES module the integration serves as a static
// file. The output is committed so a HACS install needs no toolchain.
import * as esbuild from "esbuild";

const watch = process.argv.includes("--watch");

const options = {
  entryPoints: ["src/panel.ts"],
  bundle: true,
  format: "esm",
  target: "es2022",
  minify: !watch,
  sourcemap: watch ? "inline" : false,
  outfile: "../custom_components/wrist_assistant/frontend/wrist-assistant-panel.js",
  legalComments: "none",
  logLevel: "info",
};

if (watch) {
  const ctx = await esbuild.context(options);
  await ctx.watch();
} else {
  await esbuild.build(options);
}
