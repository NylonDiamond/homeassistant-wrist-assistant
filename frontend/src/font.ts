// The panel's UI font, Geist, served from the integration's own folder so the
// panel never asks another host for anything. build.mjs copies the two
// variable font files (Latin and Latin Extended, one file each for every
// weight) out of @fontsource-variable/geist into `fonts/` beside the bundle.
//
// The face is declared on the document, not in the panel's sheet: a
// @font-face rule inside a shadow root does not register in any browser, so
// the family would never load. The panel's sheet only names the family, with
// the system's UI font after it for the moment before it loads, or a host
// that never serves it.
//
// The family is called "WA Geist" rather than "Geist" so a Geist that Home
// Assistant or a theme may declare one day can never stand in for this one,
// or this one for it.

/** The family name the panel's `--wa-font` asks for. */
export const UI_FONT_FAMILY = "WA Geist";

/** The files build.mjs writes, relative to the bundle, with the characters
 * each one covers (the ranges @fontsource ships them with). */
export const UI_FONT_FILES: readonly { file: string; range: string }[] = [
  {
    file: "fonts/geist-latin-ext-wght-normal.woff2",
    range: "U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF",
  },
  {
    file: "fonts/geist-latin-wght-normal.woff2",
    range: "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD",
  },
];

const STYLE_ID = "wa-ui-font";

/** The @font-face rules, with each file resolved against `base` (the URL the
 * bundle was served from). */
export function uiFontFaces(base: string): string {
  return UI_FONT_FILES.map(({ file, range }) => `@font-face {
  font-family: "${UI_FONT_FAMILY}";
  font-style: normal;
  font-weight: 100 900;
  font-display: swap;
  src: url("${new URL(file, base).href}") format("woff2");
  unicode-range: ${range};
}`).join("\n");
}

// The tile font, Inter. The iPhone and the watch both bundle it and draw a
// tile's text in it (`TileFont` in the app's `OneLookText.swift`), so a name
// or a template fits the same on both. The previews measure and draw tiles
// in it too. These four files are woff2 copies of the exact cuts the apps
// ship: static Regular, Medium, SemiBold and Bold at the 14 pt optical size.
// build.mjs copies them out of `frontend/fonts/` with their licence.
//
// Called "WA Inter" for the reason the UI font is "WA Geist".

/** The family a tile's text asks for. */
export const TILE_FONT_FAMILY = "WA Inter";

/** The CSS stack a tile's text is drawn in: Inter, then the system's font
 * for the moment before it loads. */
export const TILE_FONT_STACK = `"${TILE_FONT_FAMILY}", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;

/** The files build.mjs writes, relative to the bundle, one for each weight. */
export const TILE_FONT_FILES: readonly { file: string; weight: number }[] = [
  { file: "fonts/inter-regular.woff2", weight: 400 },
  { file: "fonts/inter-medium.woff2", weight: 500 },
  { file: "fonts/inter-semibold.woff2", weight: 600 },
  { file: "fonts/inter-bold.woff2", weight: 700 },
];

/** The tile font's @font-face rules, resolved against `base`. */
export function tileFontFaces(base: string): string {
  return TILE_FONT_FILES.map(({ file, weight }) => `@font-face {
  font-family: "${TILE_FONT_FAMILY}";
  font-style: normal;
  font-weight: ${weight};
  font-display: swap;
  src: url("${new URL(file, base).href}") format("woff2");
}`).join("\n");
}

let tileFontReady = false;
let tileFontLoading: Promise<void> | undefined;
const tileFontListeners: (() => void)[] = [];

/** Whether all four tile faces have loaded. Until then a canvas measures in
 * the fallback, so a measurer must not keep those widths. */
export function tileFontLoaded(): boolean {
  return tileFontReady;
}

/** Call `listener` once the tile faces have loaded, for example to drop
 * widths measured before. Listeners run in the order they were added. */
export function onTileFontLoaded(listener: () => void): void {
  tileFontListeners.push(listener);
}

/** Load the four tile faces once. A face that fails to load leaves the
 * fallback in place, and widths are then never kept. */
export function loadTileFont(doc: Document | undefined): Promise<void> {
  const fonts = doc?.fonts;
  if (fonts === undefined || typeof fonts.load !== "function") return Promise.resolve();
  tileFontLoading ??= Promise.all(TILE_FONT_FILES.map(({ weight }) => fonts.load(`${weight} 16px "${TILE_FONT_FAMILY}"`)))
    .then((loaded) => {
      if (loaded.some((faces) => faces.length === 0)) return;
      tileFontReady = true;
      for (const listener of tileFontListeners) listener();
    })
    .catch(() => undefined);
  return tileFontLoading;
}

/** Declare the fonts on the document once. A second panel, or the same one
 * mounted again, finds the rules already there. */
export function installUiFont(doc: Document | undefined, base: string): void {
  if (doc === undefined || doc.getElementById(STYLE_ID) !== null) return;
  const style = doc.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `${uiFontFaces(base)}\n${tileFontFaces(base)}`;
  doc.head.append(style);
}
