// Bundles the panel into ES modules the integration serves as static files.
// The output is committed so a HACS install needs no toolchain.
//
// The entry keeps its one name, `wrist-assistant-panel.js`, which is what the
// integration registers. Code that loads later (the watch page editor) and
// code it shares with the entry go into `chunks/`, named by their content, so
// a browser that has cached one never mistakes it for a newer one. The entry
// imports them by relative path, and the integration serves the whole folder.
//
// A second entry, `wrist-assistant-card.js`, is the dashboard card's loader.
// The integration adds it to every dashboard page, so it imports almost
// nothing up front; the card's drawing code shares chunks with the panel.
//
// A chunk no build wrote is deleted after every successful build, so the
// folder holds exactly what the entry names and CI can tell a stale or missing
// chunk from a fresh one. Deleting after rather than before means a failed
// rebuild in watch mode leaves the last good set in place.
//
// The UI font, Geist, is copied out of @fontsource-variable/geist into
// `fonts/` beside the entry, with its licence, so the panel loads it from the
// integration's own static path and never from another host. Only the two
// Latin files are copied: src/font.ts names exactly these and declares them.
import * as esbuild from "esbuild";
import { copyFileSync, mkdirSync, readFileSync, readdirSync, rmSync } from "node:fs";
import { join, relative, resolve } from "node:path";

const watch = process.argv.includes("--watch");
const outdir = "../custom_components/wrist_assistant/frontend";
const chunkDir = join(outdir, "chunks");
const entryName = "wrist-assistant-panel";
const cardEntryName = "wrist-assistant-card";

const fontPackage = "node_modules/@fontsource-variable/geist";
const fontDir = join(outdir, "fonts");
const fontFiles = ["geist-latin-wght-normal.woff2", "geist-latin-ext-wght-normal.woff2"];

function copyFont() {
  mkdirSync(fontDir, { recursive: true });
  for (const name of fontFiles) copyFileSync(join(fontPackage, "files", name), join(fontDir, name));
  copyFileSync(join(fontPackage, "LICENSE"), join(fontDir, "LICENSE-geist.txt"));
}

copyFont();

/** `import.meta.url` is where a module was served from. In an entry that is
 * the folder the symbol files sit in (each entry passes it to `icons.ts`); in
 * a chunk it is `chunks/`, where they are not. So only the entries may use it. */
function checkImportMeta(outputs) {
  const bad = outputs.filter((file) => file.startsWith(resolve(chunkDir)) && readFileSync(file, "utf8").includes("import.meta"));
  return bad.map((file) => relative(outdir, file));
}

let importMetaFault;

const tidyChunks = {
  name: "tidy-chunks",
  setup(build) {
    build.onEnd((result) => {
      if (result.errors.length > 0 || !result.metafile) return;
      const outputs = Object.keys(result.metafile.outputs).map((file) => resolve(file));
      const keep = new Set(outputs);
      let files = [];
      try {
        files = readdirSync(chunkDir);
      } catch {
        // No chunks folder: nothing to tidy.
      }
      for (const name of files) {
        const file = resolve(chunkDir, name);
        if (!keep.has(file)) rmSync(file, { force: true });
      }
      const bad = checkImportMeta(outputs);
      if (bad.length > 0) {
        importMetaFault = `import.meta is used in ${bad.join(", ")}. Only an entry (panel.ts, dashboard-card-loader.ts) may read it; pass it down instead.`;
        console.error(`error: ${importMetaFault}`);
      }
    });
  },
};

const options = {
  entryPoints: { [entryName]: "src/panel.ts", [cardEntryName]: "src/dashboard-card-loader.ts" },
  bundle: true,
  format: "esm",
  splitting: true,
  target: "es2022",
  minify: !watch,
  sourcemap: watch ? "inline" : false,
  outdir,
  entryNames: "[name]",
  chunkNames: "chunks/[name]-[hash]",
  metafile: true,
  legalComments: "none",
  logLevel: "info",
  plugins: [tidyChunks],
};

if (watch) {
  const ctx = await esbuild.context(options);
  await ctx.watch();
} else {
  await esbuild.build(options).catch(() => process.exit(1));
  if (importMetaFault !== undefined) process.exit(1);
}
