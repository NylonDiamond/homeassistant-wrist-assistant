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

/** Declare the font on the document once. A second panel, or the same one
 * mounted again, finds the rules already there. */
export function installUiFont(doc: Document | undefined, base: string): void {
  if (doc === undefined || doc.getElementById(STYLE_ID) !== null) return;
  const style = doc.createElement("style");
  style.id = STYLE_ID;
  style.textContent = uiFontFaces(base);
  doc.head.append(style);
}
