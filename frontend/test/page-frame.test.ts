// The frame the page editor and the status page editor share
// (`watch-pages/page-frame.ts`): the name in place and the words each part
// wears. The two editors' bars are tested in their own files.

import { describe, expect, it, vi } from "vitest";
import { type NameFieldInput, ON_NO_DEVICE_TEXT, pageDevicesText, renderBarMeta, renderNameInPlace, renderNameRow, renderSaveState, renderSwitcherButton } from "../src/watch-pages/page-frame.js";

type Tpl = { strings: readonly string[]; values: unknown[] };
const isTpl = (v: unknown): v is Tpl => v !== null && typeof v === "object" && "strings" in v && "values" in v;
const flat = (v: unknown): string => {
  if (Array.isArray(v)) return v.map(flat).join("");
  if (isTpl(v)) return v.strings.map((s, i) => s + (i < v.values.length ? flat(v.values[i]) : "")).join("");
  return typeof v === "string" || typeof v === "number" || typeof v === "boolean" ? String(v) : "";
};

function field(over: Partial<NameFieldInput> = {}) {
  const calls: string[] = [];
  const o: NameFieldInput = {
    name: "Hall",
    typed: undefined,
    label: "Page name",
    placeholder: "Page name",
    disabled: false,
    onInput: (v) => calls.push(`input:${v}`),
    onCommit: () => calls.push("commit"),
    onCancel: () => calls.push("cancel"),
    ...over,
  };
  return { o, calls };
}

/** The handler a template binds after `marker`. */
function bound(root: unknown, marker: string): (e: unknown) => void {
  if (!isTpl(root)) throw new Error("no template");
  const at = root.strings.findIndex((s) => s.includes(marker));
  if (at >= 0 && typeof root.values[at] === "function") return root.values[at] as (e: unknown) => void;
  throw new Error(`nothing bound at ${marker}`);
}

describe("the name in place", () => {
  it("sizes itself to the words typed, a real input with a name for a screen reader, its pencil hidden from it", () => {
    const { o } = field({ typed: "Hallway" });
    const text = flat(renderNameInPlace(o));
    expect(text).toContain(`<span class="pe-name" data-size=Hallway>`);
    expect(text).toContain(`<input type="text" class="pe-name-in" size="1" aria-label=Page name`);
    expect(text).toContain(`<svg class="pe-name-pen" viewBox="0 0 16 16" aria-hidden="true">`);
  });

  it("sizes itself to the placeholder while empty", () => {
    expect(flat(renderNameInPlace(field({ name: "", typed: "" }).o))).toContain(`data-size=Page name>`);
  });

  it("keeps on Enter and lets go of the field; Escape drops, lets go and goes no further; other keys type", () => {
    for (const render of [renderNameInPlace, renderNameRow]) {
      const { o, calls } = field();
      const key = bound(render(o), "@keydown=");
      const blur = vi.fn();
      const stop = vi.fn();
      const press = (k: string) => key({ key: k, target: { blur }, preventDefault() {}, stopPropagation: stop });
      press("a");
      expect(calls).toEqual([]);
      press("Enter");
      expect(calls).toEqual(["commit"]);
      expect(blur).toHaveBeenCalledTimes(1);
      expect(stop).not.toHaveBeenCalled();
      press("Escape");
      expect(calls).toEqual(["commit", "cancel"]);
      expect(blur).toHaveBeenCalledTimes(2);
      expect(stop).toHaveBeenCalledTimes(1);
    }
  });

  it("writes on clicking away, in the bar and in the inspector's row", () => {
    for (const render of [renderNameInPlace, renderNameRow]) {
      const { o, calls } = field();
      bound(render(o), "@blur=")({});
      expect(calls).toEqual(["commit"]);
    }
  });

  it("labels the inspector's row Name, one field for the page's real name", () => {
    expect(flat(renderNameRow(field().o))).toMatch(/<label class="field pe-page-name"><span>Name<\/span>/);
  });
});

describe("the bar's other parts", () => {
  it("draws the switcher as a button with a tooltip and a popup, separate from the name", () => {
    const text = flat(renderSwitcherButton({ open: false, title: "Pick a page to edit, or make one", label: "Switch page. Editing Hall", onClick: () => undefined }));
    expect(text).toContain(`aria-haspopup="dialog" aria-expanded=false`);
    expect(text).toContain("title=Pick a page to edit, or make one");
    expect(text).toContain("aria-label=Switch page. Editing Hall");
  });

  it("says what the page holds and Shared", () => {
    expect(flat(renderBarMeta("9 tiles", "One page"))).toBe(`<span class="pe-bar-meta">9 tiles · <span title=One page>Shared</span></span>`);
  });

  it("says Saved with no button, or Unsaved changes with Save, or Saving and waits", () => {
    const state = (dirty: boolean, saving: boolean) => flat(renderSaveState({ dirty, saving, reach: "A save reaches every device.", onSave: () => undefined }));
    expect(state(false, false)).toContain("<span>Saved</span>");
    expect(state(false, false)).not.toContain("primary save");
    expect(state(true, false)).toContain("<span>Unsaved changes</span>");
    expect(state(true, false)).toMatch(/\?disabled=false[\s\S]*>Save<\/button>/);
    expect(state(true, true)).toMatch(/\?disabled=true[\s\S]*>Saving…<\/button>/);
    expect(state(true, true)).not.toContain("Unsaved changes");
  });

  it("says where a page is in a few words", () => {
    expect(pageDevicesText([])).toBe(ON_NO_DEVICE_TEXT);
    expect(pageDevicesText(["a", "b"])).toBe("On a and b");
    expect(pageDevicesText(["a", "b", "c"])).toBe("On 3 devices");
  });
});
