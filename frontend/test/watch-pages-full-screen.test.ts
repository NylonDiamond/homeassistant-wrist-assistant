// A page's Full screen switch, under Page title: on writes `fullScreen: true`,
// off removes the key, which the watch reads as off. Every other key stays.
// While it is on the title's own rows are hidden, their values kept.

import { describe, expect, it } from "vitest";

import { findWatchPage } from "../src/watch-pages/edit.js";
import type { WatchPage, WatchPagesDocument } from "../src/watch-pages/model.js";
import { setWatchPageFullScreen, watchPageSettings } from "../src/watch-pages/page-settings-model.js";
import { renderPageSettingBody } from "../src/watch-pages/page-settings.js";
import { WatchPagesDraft } from "../src/watch-pages/draft.js";
import { NO_ICONS, type WatchPagesEditorHost } from "../src/watch-pages/editor-host.js";
import { SymbolBrowser } from "../src/symbols.js";

const PAGE = "C3A0E000-0000-4000-8000-0000000000AB";

function doc(extra: Record<string, unknown> = {}): WatchPagesDocument {
  return {
    schemaVersion: 1,
    pages: [{ hideFromSwitcher: false, id: PAGE, items: [], name: "Living", ...extra }],
  };
}

const pageOf = (d: WatchPagesDocument): WatchPage => findWatchPage(d, PAGE)!;

describe("the page's Full screen switch", () => {
  it("reads off while absent", () => {
    expect(watchPageSettings(pageOf(doc())).fullScreen).toBe(false);
  });

  it("writes true when on and removes the key when off", () => {
    const on = setWatchPageFullScreen(doc(), PAGE, true);
    expect(pageOf(on).fullScreen).toBe(true);
    expect(watchPageSettings(pageOf(on)).fullScreen).toBe(true);
    const off = setWatchPageFullScreen(on, PAGE, false);
    expect(Object.hasOwn(pageOf(off), "fullScreen")).toBe(false);
  });

  it("keeps every other key", () => {
    const on = setWatchPageFullScreen(doc({ switcherText: "Lounge", odd: 7 }), PAGE, true);
    expect(pageOf(on)).toMatchObject({ switcherText: "Lounge", odd: 7, name: "Living" });
  });
});

// ── the title rows while Full screen is on ───────────────────────────────

(globalThis as { document?: unknown }).document ??= { activeElement: null };
(globalThis as { HTMLElement?: unknown }).HTMLElement ??= class {};
(globalThis as { HTMLInputElement?: unknown }).HTMLInputElement ??= class {};

/** A template as text: each part's strings with its values in place. */
function drawn(node: unknown): string {
  if (node === undefined || node === null || typeof node === "symbol") return "";
  if (Array.isArray(node)) return node.map(drawn).join("");
  if (typeof node === "object" && "strings" in node && "values" in node) {
    const t = node as { strings: readonly string[]; values: unknown[] };
    return t.strings.map((x, i) => x + (i < t.values.length ? drawn(t.values[i]) : "")).join("");
  }
  return typeof node === "function" || typeof node === "object" ? "" : String(node);
}

/** The Page title section's rows for a page holding `extra`. */
function titleRows(extra: Record<string, unknown>): { text: string; page: () => WatchPage } {
  const draft = new WatchPagesDraft(doc(extra), 1);
  const host = {
    hass: { states: {} },
    icons: NO_ICONS,
    symbols: new SymbolBrowser(() => undefined),
    get document() { return draft.document; },
    pageId: PAGE,
    get page() { return pageOf(draft.document); },
    otherPages: [],
    busy: false,
    uiState: new Map<string, unknown>(),
    apply: (next: WatchPagesDocument) => draft.apply(next),
    endCoalesce: () => draft.endCoalesce(),
    selectTile: () => undefined,
    requestUpdate: () => undefined,
  } as unknown as WatchPagesEditorHost;
  return { text: drawn(renderPageSettingBody(host, "title")), page: () => pageOf(draft.document) };
}

describe("the page title rows", () => {
  const titled = { pageTitleDisplayStyle: "standard", pageTitleTextSize: "large", pageTitleIcon: "sofa", pageTitleTextColor: "#FF9F0A" };

  it("hide Display, Size, the icon and Text color while Full screen is on, and say why", () => {
    const { text, page } = titleRows({ ...titled, fullScreen: true });
    expect(text).toContain("Full screen is on: the watch hides the title.");
    expect(text).toContain(">Full screen<");
    for (const gone of [">Display<", ">Size<", `aria-label="Title icon"`, ">Text color<"]) expect(text, gone).not.toContain(gone);
    // Hidden, never cleared.
    expect(page()).toMatchObject(titled);
  });

  it("draw them again once Full screen is off", () => {
    const { text } = titleRows(titled);
    for (const row of [">Display<", ">Size<", `aria-label="Title icon"`, ">Text color<", ">Full screen<"]) expect(text, row).toContain(row);
    expect(text).not.toContain("Full screen is on");
  });
});
