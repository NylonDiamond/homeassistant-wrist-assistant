// The panel's UI font is served from the integration's own folder: the files
// font.ts declares are the ones build.mjs copies, and the faces it writes
// point beside the bundle, never at another host.

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { UI_FONT_FAMILY, UI_FONT_FILES, installUiFont, uiFontFaces } from "../src/font.js";
import { rangeFill } from "../src/form-styles.js";

const BASE = "https://ha.example/wrist_assistant_static/wrist-assistant-panel.js?v=1";

describe("the UI font", () => {
  it("declares exactly the files the build copies", () => {
    const build = readFileSync(join(__dirname, "..", "build.mjs"), "utf8");
    for (const { file } of UI_FONT_FILES) {
      expect(file.startsWith("fonts/")).toBe(true);
      expect(build).toContain(`"${file.slice("fonts/".length)}"`);
    }
  });

  it("points every face beside the bundle", () => {
    const faces = uiFontFaces(BASE);
    expect(faces.match(/@font-face/g)).toHaveLength(UI_FONT_FILES.length);
    expect(faces).toContain(`font-family: "${UI_FONT_FAMILY}";`);
    expect(faces).toContain(`url("https://ha.example/wrist_assistant_static/fonts/geist-latin-wght-normal.woff2")`);
    expect(faces).not.toMatch(/googleapis|gstatic|jsdelivr|unpkg/);
  });

  it("is named first in the panel's font stack, with the system font after it", () => {
    const panel = readFileSync(join(__dirname, "..", "src", "panel.ts"), "utf8");
    expect(panel).toContain(`--wa-font: "${UI_FONT_FAMILY}", -apple-system,`);
  });

  it("is declared on the document once", () => {
    const added: { id: string; textContent: string }[] = [];
    const doc = {
      getElementById: (id: string) => added.find((s) => s.id === id) ?? null,
      createElement: () => ({ id: "", textContent: "" }),
      head: { append: (s: { id: string; textContent: string }) => { added.push(s); } },
    } as unknown as Document;
    installUiFont(doc, BASE);
    installUiFont(doc, BASE);
    expect(added).toHaveLength(1);
    expect(added[0]!.textContent).toContain("@font-face");
    installUiFont(undefined, BASE);
  });
});

describe("rangeFill", () => {
  it("says how far along its track a slider's value is", () => {
    expect(rangeFill(0.5, 0, 1)).toBe("--p:50%");
    expect(rangeFill(22, 0, 88)).toBe("--p:25%");
    expect(rangeFill(-3, 0, 10)).toBe("--p:0%");
    expect(rangeFill(30, 0, 10)).toBe("--p:100%");
    expect(rangeFill(5, 5, 5)).toBe("--p:0%");
  });
});
