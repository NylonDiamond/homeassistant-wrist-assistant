// Bundles the page editor's local harness: `pages-harness.ts` and everything
// it imports from `../src`, into `dev/dist/` and nowhere else. The panel's own
// bundle (`../build.mjs`) is never read or written from here, so a harness
// build cannot change what the integration serves.
//
// One file, not minified, with a source map beside it, so the browser's
// debugger shows the TypeScript. `--watch` rebuilds on every change under
// `src/`, `dev/` and the page fixtures.
//
//   node dev/build-harness.mjs            build once
//   node dev/build-harness.mjs --watch    build, then rebuild on change
//
// The page fixtures (`test/fixtures-pages/*.json`, the files directly in the
// folder, which are page documents; `merge/` holds merge cases) reach the
// harness through the module `harness:page-fixtures`, an object keyed by file
// name without `.json`. A fixture added to the folder is picked up on the next
// build with no change here.
import * as esbuild from "esbuild";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const watch = process.argv.includes("--watch");
const devDir = dirname(fileURLToPath(import.meta.url));
const frontendDir = resolve(devDir, "..");
const fixturesDir = join(frontendDir, "test", "fixtures-pages");

const pageFixtures = {
  name: "page-fixtures",
  setup(build) {
    build.onResolve({ filter: /^harness:page-fixtures$/ }, (args) => ({ path: args.path, namespace: "page-fixtures" }));
    build.onLoad({ filter: /.*/, namespace: "page-fixtures" }, () => {
      const files = readdirSync(fixturesDir)
        .filter((name) => name.endsWith(".json") && statSync(join(fixturesDir, name)).isFile())
        .sort();
      const fixtures = {};
      for (const name of files) {
        fixtures[name.slice(0, -".json".length)] = JSON.parse(readFileSync(join(fixturesDir, name), "utf8"));
      }
      return {
        contents: JSON.stringify(fixtures),
        loader: "json",
        watchDirs: [fixturesDir],
        watchFiles: files.map((name) => join(fixturesDir, name)),
      };
    });
  },
};

const report = {
  name: "report",
  setup(build) {
    build.onEnd((result) => {
      if (!watch) return;
      const when = new Date().toLocaleTimeString();
      console.log(result.errors.length > 0 ? `[${when}] harness build failed` : `[${when}] harness rebuilt`);
    });
  },
};

const options = {
  absWorkingDir: frontendDir,
  entryPoints: { "pages-harness": "dev/pages-harness.ts" },
  bundle: true,
  format: "esm",
  splitting: false,
  target: "es2022",
  minify: false,
  sourcemap: "linked",
  outdir: "dev/dist",
  entryNames: "[name]",
  legalComments: "none",
  logLevel: "info",
  plugins: [pageFixtures, report],
};

if (watch) {
  const ctx = await esbuild.context(options);
  await ctx.watch();
  console.log("Watching. Serve with: python3 -m http.server 8765 --directory dev");
} else {
  await esbuild.build(options).catch(() => process.exit(1));
}
