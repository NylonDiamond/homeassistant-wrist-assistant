// The page editor element itself, where it can be read without a page: the
// keys it leaves to a focused field, and the stage's tiles, which stand on
// the page's own background rather than on a patch of its color.

import { describe, expect, it } from "vitest";

import { watchKeysTypeText } from "../src/watch-pages/editor-host.js";
import "../src/watch-pages/page-editor.js";

function sheet(): string {
  const element = customElements.get("wa-page-editor") as unknown as { styles: unknown };
  const flat = (s: unknown): string => (Array.isArray(s) ? s.map(flat).join("\n") : String((s as { cssText?: string } | undefined)?.cssText ?? ""));
  return flat(element.styles);
}

/** The declarations of the first rule whose selector is exactly `selector`. */
function rule(css: string, selector: string): string {
  const at = css.search(new RegExp(`(^|[}\\s])${selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*\\{`));
  if (at < 0) return "";
  const open = css.indexOf("{", at);
  return css.slice(open + 1, css.indexOf("}", open));
}

describe("keys", () => {
  it("leave only text-like fields to themselves; Cmd+Z on a slider or a menu is the editor's", () => {
    for (const type of ["text", "number", "search", ""]) expect(watchKeysTypeText("INPUT", type, false), type).toBe(true);
    expect(watchKeysTypeText("TEXTAREA", undefined, false)).toBe(true);
    expect(watchKeysTypeText("DIV", undefined, true)).toBe(true);
    for (const type of ["range", "color", "checkbox", "radio", "button"]) expect(watchKeysTypeText("INPUT", type, false), type).toBe(false);
    expect(watchKeysTypeText("SELECT", undefined, false)).toBe(false);
    expect(watchKeysTypeText("BUTTON", undefined, false)).toBe(false);
  });
});

describe("the stage", () => {
  it("draws no ground under a tile: the screen's background shows through", () => {
    const tile = rule(sheet(), ".pe-tile");
    expect(tile).toContain("position: absolute");
    expect(tile).toMatch(/background:\s*transparent/);
    expect(sheet()).not.toContain("--pe-base");
  });
});
