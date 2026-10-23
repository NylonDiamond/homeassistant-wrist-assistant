// Each watch screen's save controls in the Watch app's header row: the words
// beside Save, the bar's look there, and that every editor draws its bar into
// the header box it is handed and on top of itself only without one. Read
// from the helpers, by flattening their templates, and from the editors'
// source.

import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import { NEW_WATCH_STATUS, headBarStyles, renderHeadStatus } from "../src/head-bar.js";
import { NEW_WATCH_TEXT, NOTHING_TO_SAVE_TEXT } from "../src/watch-settings.js";

const flat = (v: unknown): string => {
  if (Array.isArray(v)) return v.map(flat).join("");
  if (v !== null && typeof v === "object" && "strings" in v && "values" in v) {
    const r = v as { strings: readonly string[]; values: unknown[] };
    return r.strings.map((s, i) => s + (i < r.values.length ? flat(r.values[i]) : "")).join("");
  }
  return typeof v === "string" || typeof v === "number" || typeof v === "boolean" ? String(v) : "";
};

describe("the words beside Save", () => {
  it("says a new watch is not saved yet, in orange, with the whole new watch note as its tooltip", () => {
    const clean = flat(renderHeadStatus({ newWatch: true, dirty: false }));
    expect(clean).toContain(`class="tb-status new"`);
    expect(clean).toContain(`>${NEW_WATCH_STATUS}</span>`);
    expect(clean).toContain(`title=${NEW_WATCH_TEXT} ${NOTHING_TO_SAVE_TEXT}`);
    expect(flat(renderHeadStatus({ newWatch: true, dirty: true }))).toContain(`title=${NEW_WATCH_TEXT}>`);
    expect(NEW_WATCH_STATUS).toBe("New watch, not saved yet");
  });

  it("counts the changes where the screen does, and says Unsaved changes where it does not", () => {
    expect(flat(renderHeadStatus({ newWatch: false, dirty: true }))).toContain(">Unsaved changes</span>");
    expect(flat(renderHeadStatus({ newWatch: false, dirty: true, changes: 3 }))).toContain(">3 changes</span>");
    expect(flat(renderHeadStatus({ newWatch: false, dirty: true, changes: 1 }))).toContain(">1 change</span>");
    expect(flat(renderHeadStatus({ newWatch: false, dirty: true }))).toContain(`class="tb-status unsaved"`);
  });

  it("says when the copy was saved while there is nothing to save, and nothing when it never was", () => {
    expect(flat(renderHeadStatus({ newWatch: false, dirty: false, saved: "Saved 2 min ago" }))).toContain(">Saved 2 min ago</span>");
    expect(flat(renderHeadStatus({ newWatch: false, dirty: false, saved: "" }))).toBe("");
    expect(flat(renderHeadStatus({ newWatch: false, dirty: false }))).toBe("");
  });
});

describe("the bar's look in the header", () => {
  const text = headBarStyles.cssText;

  it("reads only tokens, never a fixed color, no purple and no ellipsis", () => {
    expect(text).not.toMatch(/#[0-9a-fA-F]{3,8}\b/);
    expect(text).not.toMatch(/rgba?\(/);
    expect(text).not.toContain("purple");
    expect(text).not.toContain("ellipsis");
  });

  it("outlines every button with one pixel, and Save in green only while there is something to save", () => {
    expect(text).toMatch(/button\.tb-btn, button\.help, button\.cv-act, button\.cm-btn, button\.primary\.save, button\.primary\) \{[^}]*border: 1px solid var\(--wa-line-strong\)/);
    expect(text).toMatch(/button\.primary\.save\.dirty:not\(:disabled\) \{[^}]*border-color: var\(--wa-hue-green\)/);
    expect(text).toMatch(/button\.primary\.save \{[^}]*color: var\(--wa-faint\)/);
    expect(text).toMatch(/\.tb-status:is\(\.new, \.unsaved\) \{ color: var\(--wa-hue-orange\)/);
  });

  it("on a phone keeps the buttons together on top and puts the words under them", () => {
    const phone = text.slice(text.indexOf("@media (max-width: 640px)"));
    expect(phone).toContain(".wa-bar.in-head::before { content: \"\"; order: 1; flex: 0 0 100%;");
    expect(phone).toMatch(/> :is\(\.tb-status, \.tb-sync, \.tb-note\) \{ order: 2;/);
  });
});

describe("every watch editor", () => {
  // The page editor is a library page's only, whose bar is never in the
  // header, so it is not among them.
  const editors = [
    "watch-rooms/rooms-editor.ts",
    "watch-voice/voice-editor.ts",
    "watch-http-actions/http-actions-editor.ts",
    "watch-cameras/cameras-editor.ts",
  ];

  for (const file of editors) {
    it(`${file} draws its bar into the header box it is handed, and on top of itself only without one`, () => {
      const src = readFileSync(new URL(`../src/${file}`, import.meta.url), "utf8");
      expect(src).toContain("@property({ attribute: false }) barHost: HTMLElement | undefined = undefined;");
      expect(src).toContain("private readonly headBar = new HeadBar(this);");
      expect(src).toMatch(/protected override updated\(\): void \{\n    this\.headBar\.draw\(this\.barHost, /);
      expect(src).toContain("this.headBar.clear();");
      expect(src).toMatch(/this\.barHost === undefined \? this\.render(Top)?Bar\(/);
      expect(src).toContain(`"in-head"`);
      expect(src).toMatch(/headBarStyles\];/);
      // No new watch banner over the screen in the header: the words say so.
      expect(src).not.toMatch(/\$\{renderNewWatchBanner\(\)\}/);
    });
  }

  it("each hook of a device's own or the whole home's screen hands the editor the box", () => {
    for (const hook of ["watch-rooms", "watch-voice", "watch-http-actions", "watch-cameras"]) {
      const src = readFileSync(new URL(`../src/${hook}/hook.ts`, import.meta.url), "utf8");
      expect(src, hook).toContain("barHost?: HTMLElement;");
      expect(src, hook).toContain(".barHost=${input.barHost}");
    }
  });
});
