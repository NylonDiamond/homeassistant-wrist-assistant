// Turns a directory of SF Symbol SVGs into the one gzipped file the panel ships.
//
// Home Assistant serves static files uncompressed (checked against a live box
// on 2026-08-27: no `Content-Encoding` on any response from the integration's
// own static route), so the compression has to be part of the asset. The panel
// unzips it with `DecompressionStream`, which every browser Home Assistant
// supports already has.
//
// Only the path and the viewBox survive. The rest of an Apple SVG is an XML
// header, a doctype, a generator comment and an invisible bounding rect that
// exactly repeats the viewBox, none of which draw anything.
//
// Usage:
//   node build-icons.mjs --src <dir of *.svg> [--only <file, one name per line>]
//
// Source file names use the icon pack spelling (`lightbulb-fill.svg`); the
// output is keyed by Apple's own (`lightbulb.fill`), because that is what the
// saved documents and the watch both use.

import { gzipSync } from "node:zlib";
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { optimize } from "svgo";

const OUT = "../custom_components/wrist_assistant/frontend/symbol-icons.json.gz";

/** Two decimals moves any point at most 0.05 user units. The narrowest symbol
 * Apple ships is 2.5 units wide, so that is under a twentieth of a pixel on a
 * 24px tile: smaller than the rounding the renderer does anyway. */
const PRECISION = 2;

function arg(name) {
  const i = process.argv.indexOf(name);
  return i === -1 ? undefined : process.argv[i + 1];
}

const src = arg("--src");
if (!src) {
  console.error("build-icons: --src <dir> is required");
  process.exit(1);
}

const onlyFile = arg("--only");
const only = onlyFile
  ? new Set(
      readFileSync(onlyFile, "utf8")
        .split("\n")
        .map((s) => s.trim())
        .filter((s) => s !== "" && !s.startsWith("#"))
    )
  : undefined;

const svgoConfig = {
  multipass: true,
  floatPrecision: PRECISION,
  plugins: [
    // The viewBox is the only thing that says how big the drawing is, and the
    // preset drops it by default.
    { name: "preset-default", params: { overrides: { removeViewBox: false } } },
    { name: "convertPathData", params: { floatPrecision: PRECISION, utilizeAbsolute: true } },
  ],
};

const PATH_RE = /<path[^>]*\bd="([^"]+)"/g;
const VIEWBOX_RE = /viewBox="([^"]+)"/;

const icons = {};
const skipped = [];

for (const file of readdirSync(src).sort()) {
  if (!file.endsWith(".svg")) continue;
  const name = file.slice(0, -4).replace(/-/g, ".");
  if (only && !only.has(name)) continue;

  const optimized = optimize(readFileSync(join(src, file), "utf8"), svgoConfig).data;
  const paths = [...optimized.matchAll(PATH_RE)].map((m) => m[1]);
  const viewBox = VIEWBOX_RE.exec(optimized)?.[1];
  if (paths.length === 0 || !viewBox) {
    skipped.push(name);
    continue;
  }
  // Several subpaths concatenate into one `d` without changing the drawing,
  // which saves repeating the element for every piece of a layered symbol.
  icons[name] = [paths.join(" "), viewBox];
}

if (only) {
  const missing = [...only].filter((n) => !(n in icons));
  if (missing.length > 0) console.warn(`build-icons: not found in --src: ${missing.join(", ")}`);
}
if (skipped.length > 0) console.warn(`build-icons: no drawable path in ${skipped.length} file(s)`);

const json = Buffer.from(JSON.stringify(icons));
const gz = gzipSync(json, { level: 9 });
writeFileSync(OUT, gz);

const kb = (n) => `${(n / 1024).toFixed(1)} kB`;
console.log(`build-icons: ${Object.keys(icons).length} symbols  ${kb(json.length)} → ${kb(gz.length)} gzipped`);
