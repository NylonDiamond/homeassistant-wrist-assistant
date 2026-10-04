// A page's rows for the page switcher (`switcher-settings.ts`), which the
// menu editor draws for the page picked in its Pages card: Hidden, Show as,
// the name, Automatic icon, the icon, the color and the hint. Each row edits
// through the host's `edit` with the page settings' setters, and typing in
// a field is one undo step. Then the card's changed dot and summary.
//
// No DOM: the rows are drawn to their Lit templates and read as text, and a
// control is worked by calling the handler the template holds for it.

import { describe, expect, it } from "vitest";

import { SymbolBrowser } from "../src/symbols.js";
import { WatchPagesDraft } from "../src/watch-pages/draft.js";
import { findWatchPage } from "../src/watch-pages/edit.js";
import type { WatchPage, WatchPagesDocument } from "../src/watch-pages/model.js";
import {
  setWatchPageHideFromSwitcher,
  setWatchPageSwitcherDisplayMode,
  setWatchPageSwitcherIcon,
} from "../src/watch-pages/page-settings-model.js";
import {
  SWITCHER_SECTION_TITLE,
  type SwitcherSettingsHost,
  renderSwitcherSettings,
  switcherSettingsSummary,
  watchPageSwitcherChanged,
} from "../src/watch-pages/switcher-settings.js";

// ── reading templates ────────────────────────────────────────────────────

interface Tpl {
  strings: readonly string[];
  values: unknown[];
}

function isTpl(node: unknown): node is Tpl {
  return typeof node === "object" && node !== null && "strings" in node && "values" in node;
}

function flat(node: unknown): string {
  if (node === undefined || node === null || typeof node === "symbol") return "";
  if (Array.isArray(node)) return node.map(flat).join("");
  if (isTpl(node)) return node.strings.map((s, i) => s + (i < node.values.length ? flat(node.values[i]) : "")).join("");
  if (typeof node === "function" || typeof node === "object") return "";
  return String(node);
}

function templates(node: unknown, out: Tpl[] = []): Tpl[] {
  if (Array.isArray(node)) for (const n of node) templates(n, out);
  else if (isTpl(node)) {
    out.push(node);
    for (const v of node.values) templates(v, out);
  }
  return out;
}

/** The `event` handler of the smallest template whose text holds `marker`
 * and binds that event to a function itself. */
function handler(root: unknown, marker: string, event: "click" | "change" | "input"): (e: unknown) => void {
  const found = templates(root)
    .map((t) => {
      let text = "";
      let fn: unknown;
      t.strings.forEach((s, i) => {
        text += s;
        if (i >= t.values.length) return;
        const v = t.values[i];
        if (typeof v === "function" && s.trimEnd().endsWith(`@${event}=`)) fn ??= v;
        text += flat(v);
      });
      return { text, fn };
    })
    .filter((c) => c.text.includes(marker) && c.fn !== undefined)
    .sort((a, b) => a.text.length - b.text.length);
  if (found.length === 0) throw new Error(`no @${event} handler near ${marker}`);
  return found[0]!.fn as (e: unknown) => void;
}

// ── the host ─────────────────────────────────────────────────────────────

const PAGE = "C3A0E000-0000-4000-8000-0000000000AA";
const NO_ICONS = { render: () => undefined, available: () => false, names: () => [] } as unknown as SwitcherSettingsHost["icons"];

function doc(extra: Record<string, unknown> = {}): WatchPagesDocument {
  return { schemaVersion: 1, pages: [{ hideFromSwitcher: false, id: PAGE, items: [], name: "Living", ...extra }] };
}

/** A host over a real page draft, recording each edit's options. */
function host(extra: Record<string, unknown> = {}) {
  const draft = new WatchPagesDraft(doc(extra), 3);
  const edits: ({ typing?: boolean } | undefined)[] = [];
  const h: SwitcherSettingsHost = {
    pageId: PAGE,
    icons: NO_ICONS,
    symbols: new SymbolBrowser(() => undefined),
    uiState: new Map(),
    get page() { return findWatchPage(draft.document, PAGE)!; },
    busy: false,
    edit: (change, opts) => {
      edits.push(opts);
      draft.apply(change(draft.document), opts?.typing === true ? { coalesce: "typing" } : undefined);
    },
    endCoalesce: () => draft.endCoalesce(),
    requestUpdate: () => undefined,
  };
  return { h, draft, edits, page: () => findWatchPage(draft.document, PAGE)! };
}

const page = (extra: Record<string, unknown> = {}): WatchPage => findWatchPage(doc(extra), PAGE)!;

describe("the switcher rows", () => {
  it("draw Hidden, Show as, Name, Automatic icon, Icon and Color, then the hint", () => {
    const text = flat(renderSwitcherSettings(host().h));
    const order = [">Hidden<", ">Show as<", ">Name<", ">Automatic icon</button>", ">Icon<", ">Color<",
      "Left empty, the watch shows the page's name and picks the icon and color itself."];
    // Each after the one before ("Icon" is also a Show as choice).
    let last = 0;
    for (const part of order) {
      const at = text.indexOf(part, last);
      expect(at, part).toBeGreaterThan(-1);
      last = at;
    }
    // The way to the switcher's own look is this very screen now.
    expect(text).not.toContain("under Menus");
    expect(text).not.toMatch(/ - |–|—/);
    // The name box shows the page's own name as its placeholder.
    expect(text).toContain("placeholder=Living");
    expect(SWITCHER_SECTION_TITLE).toBe("In the page switcher");
  });

  it("Hidden writes the page's hideFromSwitcher, and says the page stays on the watch", () => {
    const { h, page: now, edits } = host();
    handler(renderSwitcherSettings(h), ">Hidden<", "change")({ target: { checked: true } });
    expect(now().hideFromSwitcher).toBe(true);
    expect(edits).toEqual([undefined]);
    expect(now()).toEqual(findWatchPage(setWatchPageHideFromSwitcher(doc(), PAGE, true), PAGE));
    expect(flat(renderSwitcherSettings(h))).toContain("The page stays on the watch. Only the switcher leaves it out.");
  });

  it("Show as writes the mode", () => {
    const { h, page: now } = host();
    handler(renderSwitcherSettings(h), ">Icon</button>", "click")({ currentTarget: null });
    expect(now().switcherDisplayMode).toBe("icon");
    expect(now()).toEqual(findWatchPage(setWatchPageSwitcherDisplayMode(doc(), PAGE, "icon"), PAGE));
  });

  it("typing a name is one undo step", () => {
    const { h, draft, edits, page: now } = host();
    for (const value of ["H", "Ha", "Hall"]) handler(renderSwitcherSettings(h), ">Name<", "input")({ target: { value } });
    expect(now().switcherText).toBe("Hall");
    expect(edits).toEqual([{ typing: true }, { typing: true }, { typing: true }]);
    expect(draft.undoDepth).toBe(1);
    draft.undo();
    expect(Object.hasOwn(now(), "switcherText")).toBe(false);
  });

  it("Automatic icon writes the empty icon, which removes the page's own", () => {
    const { h, page: now, edits } = host({ switcherIcon: "sofa" });
    const text = flat(renderSwitcherSettings(h));
    expect(text).toMatch(/class="pe-chip "\s+aria-pressed=false/);
    handler(renderSwitcherSettings(h), "Automatic icon", "click")({});
    expect(Object.hasOwn(now(), "switcherIcon")).toBe(false);
    expect(edits).toEqual([undefined]);
    expect(now()).toEqual(findWatchPage(setWatchPageSwitcherIcon(doc({ switcherIcon: "sofa" }), PAGE, ""), PAGE));
    expect(flat(renderSwitcherSettings(h))).toMatch(/class="pe-chip on"\s+aria-pressed=true/);
  });

  it("refuses every edit while busy", () => {
    const { h, edits } = host();
    const busy = Object.assign(Object.create(h) as SwitcherSettingsHost, { busy: true });
    handler(renderSwitcherSettings(busy), ">Hidden<", "change")({ target: { checked: true } });
    expect(edits).toEqual([]);
  });
});

describe("the card's dot and summary", () => {
  it("dots a value of the page's own, not the stored defaults", () => {
    expect(watchPageSwitcherChanged(page())).toBe(false);
    expect(watchPageSwitcherChanged(page({ switcherDisplayMode: "text" }))).toBe(false);
    expect(watchPageSwitcherChanged(page({ switcherText: "Den" }))).toBe(true);
    expect(watchPageSwitcherChanged(page({ switcherIcon: "sofa" }))).toBe(true);
    expect(watchPageSwitcherChanged(page({ switcherColor: "#FF9F0A" }))).toBe(true);
    expect(watchPageSwitcherChanged(page({ switcherDisplayMode: "icon" }))).toBe(true);
    expect(watchPageSwitcherChanged(page({ hideFromSwitcher: true }))).toBe(true);
  });

  it("sums the page up: Hidden, its name, Icon, or Shown", () => {
    expect(switcherSettingsSummary(page())).toBe("Shown");
    expect(switcherSettingsSummary(page({ switcherDisplayMode: "icon" }))).toBe("Icon");
    expect(switcherSettingsSummary(page({ switcherText: "Den" }))).toBe("Den");
    expect(switcherSettingsSummary(page({ switcherText: "Den", hideFromSwitcher: true }))).toBe("Hidden");
  });
});
