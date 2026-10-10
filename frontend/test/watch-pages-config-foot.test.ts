// The foot bar of the page and menu editors (`config-foot.ts`): the stored
// copy's line on the left, History and Raw configuration on the right, and
// the two dialogs they open. Then the page editor drawn with a record, to
// check the bar is there and the Page card sits under the watch, in the
// stage card, with the settings column holding only the Tile card.

import { afterEach, describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import type { OwnerSummary, WatchConfigHistoryEntry, WatchConfigRecord } from "../src/ha-api.js";
import {
  OVER_LIMIT_TEXT,
  REJECTED_TEXT,
  SAVED_TICK_MS,
  SavedAgoTicker,
  configFootStatus,
  configRawText,
  configSavedText,
  renderConfigFoot,
  renderConfigHistoryDialog,
  renderConfigRawDialog,
  renderConfigSaved,
  rejectedText,
} from "../src/watch-pages/config-foot.js";
import { takeWatchPagesRecord } from "../src/watch-pages/kept.js";
import { type WatchPagesDocument, WATCH_CONFIG_LIMIT_BYTES, WATCH_PAGES_LIMIT_BYTES } from "../src/watch-pages/model.js";
import "../src/watch-pages/page-editor.js";
import { takeWatchMenusRecord } from "../src/watch-menus/draft.js";
import type { MenusDocument } from "../src/watch-menus/model.js";
import "../src/watch-menus/menu-editor.js";
import { COLLECTED_PILL_TEXT, WAITING_HELP_TEXT, WAITING_PILL_TEXT } from "../src/watch-settings.js";

/** A template flattened to its markup, values in place (a bound attribute
 * comes out unquoted). */
const flat = (v: unknown): string => {
  if (Array.isArray(v)) return v.map(flat).join("");
  if (v !== null && typeof v === "object" && "strings" in v && "values" in v) {
    const r = v as { strings: readonly string[]; values: unknown[] };
    return r.strings.map((s, i) => s + (i < r.values.length ? flat(r.values[i]) : "")).join("");
  }
  return typeof v === "string" || typeof v === "number" ? String(v) : "";
};

const NOW = Date.parse("2026-10-03T12:00:00Z");

function record(over: Partial<WatchConfigRecord> = {}): WatchConfigRecord {
  return {
    kind: "pages", revision: 7, hash: null, updated_at: "2026-10-03T11:55:00Z", updated_by: "panel",
    delivered_revision: 7, delivered_at: null, ...over,
  };
}

const noop = () => undefined;

function foot(r: WatchConfigRecord, historyState: "ready" | "unsupported" = "ready", size = 2_048): string {
  const status = configFootStatus({ record: r, size, limit: 10_240, noun: "pages", historyState, now: NOW });
  return flat(renderConfigFoot({ status, historyState, historyOpen: false, rawOpen: false, onHistory: noop, onRaw: noop }));
}

describe("the foot bar", () => {
  it("says the revision and who saved it, then History and Raw configuration", () => {
    const text = foot(record());
    expect(text).toContain("Revision 7 · saved here 5 min ago");
    expect(text).toContain(COLLECTED_PILL_TEXT);
    expect(text).toContain("cf-dot ok");
    expect(text).toContain(">History</button>");
    expect(text).toContain(">Raw configuration</button>");
    expect(text.indexOf(">History<")).toBeLessThan(text.indexOf(">Raw configuration<"));
    expect(text).toContain("2 KB of the 10 KB Home Assistant keeps");
  });

  it("keeps every fact of the old Stored copy card: waiting, rejected, near the limit", () => {
    const waiting = configFootStatus({ record: record({ delivered_revision: 6 }), size: 9_000, limit: 10_000, noun: "pages", historyState: "ready", now: NOW });
    expect(waiting).toMatchObject({ tone: "warn", state: WAITING_PILL_TEXT, help: WAITING_HELP_TEXT, near: true });
    expect(waiting.size).toContain("Close to the limit.");
    const rejected = foot(record({ rejected_revision: 7 }));
    expect(rejected).toContain("cf-dot err");
    expect(rejected).toContain(REJECTED_TEXT);
    expect(rejected).toContain("Restore an earlier save from History.");
    expect(rejected).toContain("cf-history-btn lit");
    const old = configFootStatus({ record: record({ rejected_revision: 7, kind: "menus" }), size: 1, limit: 10, noun: "menus", historyState: "unsupported" });
    expect(old.help).toBe("Change the menus and save them again.");
  });

  it("names an iPhone in its help lines when the record is a phone's", () => {
    const waiting = configFootStatus({ record: record({ delivered_revision: 6 }), size: 1, limit: 10, noun: "pages", historyState: "ready", device: "iphone", now: NOW });
    expect(waiting.help).toBe("The iPhone picks it up the next time it checks.");
    const collected = configFootStatus({ record: record(), size: 1, limit: 10, noun: "pages", historyState: "ready", device: "iphone", now: NOW });
    expect(collected.help).toBe("The iPhone has revision 7.");
    const watch = configFootStatus({ record: record(), size: 1, limit: 10, noun: "pages", historyState: "ready", now: NOW });
    expect(watch.help).toBe("The watch has revision 7.");
  });

  it("says the watch's reason when it gave one, and the plain words when it did not", () => {
    const why = configFootStatus({ record: record({ rejected_revision: 7, rejected_reason: "too large for the watch" }), size: 1, limit: 10, noun: "pages", historyState: "ready", now: NOW });
    expect(why).toMatchObject({ tone: "err", state: "The watch could not use this save: too large for the watch" });
    expect(foot(record({ rejected_revision: 7, rejected_reason: "too large for the watch" }))).toContain("The watch could not use this save: too large for the watch");
    // An older watch app sends none; an integration older than the field sends nothing at all.
    for (const rejected_reason of [null, undefined, "", "   "]) {
      expect(rejectedText({ rejected_reason })).toBe(REJECTED_TEXT);
      expect(configFootStatus({ record: record({ rejected_revision: 7, rejected_reason }), size: 1, limit: 10, noun: "pages", historyState: "ready" }).state).toBe(REJECTED_TEXT);
    }
    // A reason left from a report a later save replaced says nothing.
    const stale = configFootStatus({ record: record({ rejected_revision: 6, rejected_reason: "too large for the watch" }), size: 1, limit: 10, noun: "pages", historyState: "ready", now: NOW });
    expect(stale.state).toBe(COLLECTED_PILL_TEXT);
  });

  it("measures against the cap Home Assistant enforces, says over past it, and never calls 189 % close", () => {
    // The test bed's 40 pages: 472,375 bytes, inside the 700 KB pages cap.
    const big = configFootStatus({ record: record(), size: 472_375, limit: WATCH_PAGES_LIMIT_BYTES, noun: "pages", historyState: "ready", now: NOW });
    expect(big.size).toBe("461.3 KB of the 700 KB Home Assistant keeps");
    expect(big).toMatchObject({ near: false, over: false });
    const close = configFootStatus({ record: record(), size: 650_000, limit: WATCH_PAGES_LIMIT_BYTES, noun: "pages", historyState: "ready", now: NOW });
    expect(close).toMatchObject({ near: true, over: false });
    expect(close.size).toContain("Close to the limit.");
    const past = configFootStatus({ record: record(), size: 300 * 1024, limit: WATCH_CONFIG_LIMIT_BYTES, noun: "menus", historyState: "ready", now: NOW });
    expect(past).toMatchObject({ near: false, over: true });
    expect(past.size).toBe(`300 KB of the 256 KB Home Assistant keeps. ${OVER_LIMIT_TEXT}`);
    expect(past.size).not.toContain("Close to the limit.");
    const drawn = flat(renderConfigFoot({ status: past, historyState: "ready", historyOpen: false, rawOpen: false, onHistory: noop, onRaw: noop }));
    expect(drawn).toContain("cf-size over");
  });

  it("says over only past the cap, and never shows a size over or under it as the cap", () => {
    const at = (size: number) => configFootStatus({ record: record(), size, limit: WATCH_PAGES_LIMIT_BYTES, noun: "pages", historyState: "ready", now: NOW });
    // Exactly at the cap: Home Assistant keeps it, so not over.
    const exact = at(WATCH_PAGES_LIMIT_BYTES);
    expect(exact).toMatchObject({ near: true, over: false });
    expect(exact.size).toBe("700 KB of the 700 KB Home Assistant keeps. At the limit.");
    expect(exact.size).not.toContain(OVER_LIMIT_TEXT);
    // A few bytes under rounds down, so it does not read as the cap.
    const under = at(WATCH_PAGES_LIMIT_BYTES - 50);
    expect(under).toMatchObject({ near: true, over: false });
    expect(under.size).toBe("699.9 KB of the 700 KB Home Assistant keeps. Close to the limit.");
    // A few bytes over (the verify run's 142 bytes) rounds up, so it reads as more than the cap.
    const past = at(WATCH_PAGES_LIMIT_BYTES + 142);
    expect(past).toMatchObject({ near: false, over: true });
    expect(past.size).toBe(`700.2 KB of the 700 KB Home Assistant keeps. ${OVER_LIMIT_TEXT}`);
    const byte = at(WATCH_PAGES_LIMIT_BYTES + 1);
    expect(byte.size).toBe(`700.1 KB of the 700 KB Home Assistant keeps. ${OVER_LIMIT_TEXT}`);
  });

  it("uses the same caps as the integration", () => {
    // 716,800 bytes, the watch's own pages budget (`WatchDefaultsBudgetRules`).
    expect(WATCH_PAGES_LIMIT_BYTES).toBe(700 * 1024);
    expect(WATCH_PAGES_LIMIT_BYTES).toBe(716_800);
    expect(WATCH_CONFIG_LIMIT_BYTES).toBe(256 * 1024);
  });

  it("leaves History out on an integration that keeps no earlier saves", () => {
    const text = foot(record(), "unsupported");
    expect(text).not.toContain(">History<");
    expect(text).toContain(">Raw configuration<");
  });
});

describe("the dialogs", () => {
  const entries: WatchConfigHistoryEntry[] = [
    { revision: 7, hash: null, updated_at: "2026-10-03T11:55:00Z", updated_by: "panel", size: 2_000 },
    { revision: 6, hash: null, updated_at: "2026-10-03T10:00:00Z", updated_by: "w1", size: 1_500 },
  ];
  const history = (r: WatchConfigRecord, dirty = false) => flat(renderConfigHistoryDialog({
    noun: "pages", record: r, entries, historyState: "ready", dirty, restoring: false,
    onRetry: noop, onRestore: noop, onClosed: noop, now: NOW,
  }));

  it("History lists the earlier saves with Restore, the current one marked", () => {
    const text = history(record());
    expect(text).toContain("History of the pages");
    expect(text).toContain("<b>Revision 7</b>");
    expect(text).toContain(">Current</span>");
    expect(text).toContain("From the watch");
    expect(text).toContain(">Restore</button>");
    expect(text).not.toContain("Save or discard your edits first.</p>");
    expect(history(record(), true)).toContain("Save or discard your edits first.</p>");
  });

  it("History offers the save before one a device could not read", () => {
    const text = history(record({ revision: 8, rejected_revision: 8 }));
    expect(text).toContain(`<li class=offer>`);
    expect(text).toContain("pe-btn pe-primary");
    expect(text).toContain(`${REJECTED_TEXT}. Restore the save before it.`);
    expect(history(record({ revision: 8, rejected_revision: 8, rejected_reason: "too large for the watch" })))
      .toContain("The watch could not use this save: too large for the watch. Restore the save before it.");
  });

  it("Raw configuration shows the open document as JSON, read only, with Copy", () => {
    const document = { pages: [{ id: "A", name: "Home" }] };
    const text = flat(renderConfigRawDialog({ noun: "pages", document, revision: 7, dirty: true, copied: false, onCopy: noop, onClosed: noop }));
    expect(text).toContain(configRawText(document));
    expect(text).toContain("with your unsaved edits");
    expect(text).toContain(">Copy</button>");
    expect(text).not.toContain("<textarea");
  });
});

describe("the page editor", () => {
  const document = JSON.parse(readFileSync(join(__dirname, "fixtures-pages", "05-pages.json"), "utf8")) as WatchPagesDocument;
  const owner = {
    owner_watch_id: "foot-test-watch", device_name: "Apple Watch", device_kind: "watch", paired_iphone_name: null,
  } as unknown as OwnerSummary;

  /** The element's body with the fixture's pages open, as markup. */
  function body(): string {
    const Ctor = customElements.get("wa-page-editor") as unknown as new () => Record<string, unknown>;
    const el = new Ctor();
    el.owners = [owner];
    el.watchId = owner.owner_watch_id;
    el.record = record({ document: document as unknown as Record<string, unknown> });
    takeWatchPagesRecord(owner.owner_watch_id, document, 7);
    el.selectedPageId = (document.pages as { id: string }[])[0]!.id;
    const draw = el.renderBody as (watches: readonly OwnerSummary[]) => unknown;
    return flat(draw.call(el, [owner]));
  }

  it("pins the foot bar under the columns, with no Stored copy or Earlier saves card", () => {
    const text = body();
    expect(text).toContain(`<footer class="cf-bar"`);
    expect(text).toContain("Revision 7 · saved here");
    expect(text).toContain(">History</button>");
    expect(text).toContain(">Raw configuration</button>");
    expect(text).not.toContain("Stored copy</h3>");
    expect(text).not.toContain("Earlier saves</h3>");
    const inspector = text.indexOf(`<div class="column inspector card">`);
    expect(inspector).toBeGreaterThan(-1);
    expect(inspector).toBeLessThan(text.indexOf(`<footer class="cf-bar"`));
  });

  it("draws the page's own settings in the strip over the watch, and only the line and Delete page in the inspector with no tile selected", () => {
    const text = body();
    const canvas = text.indexOf(`<div class="column canvas">`);
    const inspector = text.indexOf(`<div class="column inspector card">`);
    expect(canvas).toBeGreaterThan(-1);
    expect(inspector).toBeGreaterThan(canvas);
    // In the canvas card: the head, then the strip, then the stage.
    const card = text.slice(canvas, inspector);
    const head = card.indexOf(`<div class="cv-head">`);
    const strip = card.indexOf(`<div class="pe-pstrip" role="toolbar" aria-label="Page settings">`);
    const stage = card.indexOf(`<div class="stage-area pe-stage-area">`);
    expect(head).toBeGreaterThan(-1);
    expect(strip).toBeGreaterThan(head);
    expect(stage).toBeGreaterThan(strip);
    expect(card).not.toContain(`class="sec name-sec"`);
    const side = text.slice(inspector, text.indexOf(`<footer class="cf-bar"`));
    expect(side).toContain(`<div class="insp-head">`);
    expect(side).toContain(`>Page</span><span class="nm"`);
    expect(side).not.toContain(`class="sec name-sec"`);
    expect(side).not.toContain(`aria-label="Page name"`);
    expect(side).not.toContain("Hidden on the watch");
    expect(side).toContain("Select a tile to edit it, or add one. The page's own settings are above the watch.");
    expect(side).toContain("Delete page…");
    expect(side).not.toContain("pe-page-card");
  });

  it("wears the complication editor's chrome, with no settings left under the watch", () => {
    const element = customElements.get("wa-page-editor") as unknown as { styles: unknown };
    const sheet = (s: unknown): string => (Array.isArray(s) ? s.map(sheet).join("\n") : String((s as { cssText?: string } | undefined)?.cssText ?? ""));
    const css = sheet(element.styles);
    for (const selector of [".wa-bar", ".layout {", ".card.lc", ".layer {", ".canvas-card", ".stage-tools", ".values-bar", ".cf-bar"]) {
      expect(css, selector).toContain(selector);
    }
    expect(css).not.toContain(".pe-stage-settings");
    const text = body();
    expect(text).toContain(`<div class="layout pe-layout`);
    expect(text).not.toContain("pe-stage-settings");
  });
});

describe("the toolbar's saved fact", () => {
  afterEach(() => { vi.useRealTimers(); });

  it("reads the stored copy's time, the same the foot bar reads", () => {
    expect(configSavedText(record(), NOW)).toBe("Saved 5 min ago");
    expect(configSavedText(record({ updated_at: "2026-10-03T11:59:30Z" }), NOW)).toBe("Saved just now");
    expect(configSavedText(record({ updated_at: null }), NOW)).toBe("Saved");
    expect(configSavedText(record({ revision: 0 }), NOW)).toBe("");
    expect(configSavedText(undefined, NOW)).toBe("");
    // The foot bar's line for the same record says the same time.
    expect(foot(record())).toContain("5 min ago");
    const span = flat(renderConfigSaved(record(), NOW));
    expect(span).toContain(`<span class="cf-saved"`);
    expect(span).toContain(">Saved 5 min ago</span>");
    expect(flat(renderConfigSaved(undefined, NOW))).toBe("");
  });

  it("draws its host again while shown and connected, and stops otherwise", () => {
    vi.useFakeTimers();
    const host = { addController: vi.fn(), requestUpdate: vi.fn(), removeController: vi.fn(), updateComplete: Promise.resolve(true) };
    const ticker = new SavedAgoTicker(host);
    expect(host.addController).toHaveBeenCalledWith(ticker);
    ticker.show(true);
    expect(ticker.running).toBe(false);
    ticker.hostConnected();
    expect(ticker.running).toBe(true);
    vi.advanceTimersByTime(SAVED_TICK_MS);
    expect(host.requestUpdate).toHaveBeenCalledTimes(1);
    expect(SAVED_TICK_MS).toBeLessThanOrEqual(60_000);
    ticker.show(false);
    expect(ticker.running).toBe(false);
    vi.advanceTimersByTime(SAVED_TICK_MS * 3);
    expect(host.requestUpdate).toHaveBeenCalledTimes(1);
    ticker.show(true);
    ticker.hostDisconnected();
    expect(ticker.running).toBe(false);
    // Back in the tree with the fact still shown: it runs again.
    ticker.hostConnected();
    expect(ticker.running).toBe(true);
    ticker.hostDisconnected();
  });
});

describe("the sticky top block", () => {
  const pagesDocument = JSON.parse(readFileSync(join(__dirname, "fixtures-pages", "05-pages.json"), "utf8")) as WatchPagesDocument;
  const menusDocument = JSON.parse(readFileSync(join(__dirname, "fixtures-menus", "01-defaults.json"), "utf8")) as MenusDocument;
  const fiveMinutesAgo = () => new Date(Date.now() - 5 * 60_000).toISOString();

  function styles(tag: "wa-page-editor" | "wa-menu-editor"): string {
    const element = customElements.get(tag) as unknown as { styles: unknown };
    const sheet = (s: unknown): string => (Array.isArray(s) ? s.map(sheet).join("\n") : String((s as { cssText?: string } | undefined)?.cssText ?? ""));
    return sheet(element.styles);
  }

  /** The declarations of the first rule whose selector is exactly `selector`. */
  function rule(css: string, selector: string): string {
    const at = css.search(new RegExp(`(^|[}\\s])${selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*\\{`));
    if (at < 0) return "";
    const open = css.indexOf("{", at);
    return css.slice(open + 1, css.indexOf("}", open));
  }

  /** The whole element drawn with a stored copy open, as markup. With no
   * owners passed the body is the short "no watch" line, so the markup is
   * the top block and little else. */
  function drawn(tag: "wa-page-editor" | "wa-menu-editor", watchId: string, dirty: boolean): string {
    const Ctor = customElements.get(tag) as unknown as new () => Record<string, unknown>;
    const el = new Ctor();
    el.watchId = watchId;
    if (tag === "wa-page-editor") {
      el.record = record({ updated_at: fiveMinutesAgo() });
      const { draft } = takeWatchPagesRecord(watchId, pagesDocument, 7);
      if (dirty) draft.apply({ ...pagesDocument, pages: [...(pagesDocument.pages as unknown[]), { id: "added", name: "Added" }] } as WatchPagesDocument);
    } else {
      el.record = record({ kind: "menus", updated_at: fiveMinutesAgo() });
      const { draft } = takeWatchMenusRecord(watchId, menusDocument, 7);
      if (dirty) draft.apply({ ...menusDocument, extraForTest: true });
    }
    return flat((el.render as () => unknown).call(el));
  }

  /** The sticky block's rule and the host's, which both editors keep. */
  function expectStickyBlock(tag: "wa-page-editor" | "wa-menu-editor"): void {
    const css = styles(tag);
    const block = rule(css, ".pe-top");
    expect(block).toMatch(/position:\s*sticky/);
    expect(block).toMatch(/top:\s*calc\(-1 \* var\(--cf-pad, 16px\)\)/);
    expect(block).toMatch(/z-index:\s*7/);
    expect(block).toMatch(/background:\s*var\(--wa-bg\)/);
    expect(block).toMatch(/margin:\s*calc\(-1 \* var\(--cf-pad, 16px\)\) calc\(-1 \* var\(--cf-pad, 16px\)\) 0/);
    // Above the foot bar's own layer, which the cards sit under.
    expect(rule(css, ".cf-bar")).toMatch(/z-index:\s*6/);
    expect(rule(css, ":host")).toMatch(/scroll-padding-top:\s*var\(--pe-top-h, 0px\)/);
  }

  it("wa-page-editor: draws its own top bar, the complication editor's, as the sticky block, edge to edge", () => {
    const text = drawn("wa-page-editor", "wa-page-editor-sticky", false);
    const top = text.indexOf(`<div class="pe-top">`);
    expect(top).toBe(text.search(/\S/));
    const bar = text.indexOf(`<div class="wa-bar `);
    expect(bar).toBeGreaterThan(top);
    // The old title line and toolbar are gone.
    expect(text).not.toContain("Watch pages</h2>");
    expect(text).not.toContain(`class="pe-tools"`);
    // The bar closes inside the block: the body comes after it.
    expect(text.indexOf(`class="pe-empty"`)).toBeGreaterThan(bar);
    expectStickyBlock("wa-page-editor");
  });

  it("wa-page-editor: says when the stored copy was saved, beside Save, and Unsaved changes on it while dirty", () => {
    const clean = drawn("wa-page-editor", "wa-page-editor-saved-clean", false);
    expect(clean).toContain(">Saved 5 min ago</span>");
    expect(clean.indexOf(">Save</button>")).toBeLessThan(clean.indexOf(">Saved 5 min ago<"));
    expect(clean).toContain(`class="primary save "`);
    expect(clean).not.toContain("Unsaved changes");
    const dirty = drawn("wa-page-editor", "wa-page-editor-saved-dirty", true);
    expect(dirty).toContain(`class="primary save dirty"`);
    expect(dirty).toContain(`<span class="tb-saved" title=Unsaved changes>`);
    expect(dirty).toContain(">Saved 5 min ago</span>");
  });

  it("wa-menu-editor: draws its own top bar, the complication editor's, as the sticky block, edge to edge", () => {
    const text = drawn("wa-menu-editor", "wa-menu-editor-sticky", false);
    const top = text.indexOf(`<div class="pe-top">`);
    expect(top).toBe(text.search(/\S/));
    const bar = text.indexOf(`<div class="wa-bar `);
    expect(bar).toBeGreaterThan(top);
    // The old title line and toolbar are gone.
    expect(text).not.toContain("Watch menus</h2>");
    expect(text).not.toContain(`class="pe-tools"`);
    expect(text).not.toContain(`class="pe-head"`);
    // The bar closes inside the block: the body comes after it.
    expect(text.indexOf(`class="pe-empty"`)).toBeGreaterThan(bar);
    expectStickyBlock("wa-menu-editor");
  });

  it("wa-menu-editor: says when the stored copy was saved, beside Save, and Unsaved changes on it while dirty", () => {
    const clean = drawn("wa-menu-editor", "wa-menu-editor-saved-clean", false);
    expect(clean).toContain(">Saved 5 min ago</span>");
    expect(clean.indexOf(">Save</button>")).toBeLessThan(clean.indexOf(">Saved 5 min ago<"));
    expect(clean).toContain(`class="primary save "`);
    expect(clean).not.toContain("Unsaved changes");
    const dirty = drawn("wa-menu-editor", "wa-menu-editor-saved-dirty", true);
    expect(dirty).toContain(`class="primary save dirty"`);
    expect(dirty).toContain(`<span class="tb-saved" title=Unsaved changes>`);
    expect(dirty).toContain(">Saved 5 min ago</span>");
  });

  it("moves both editors' sticky side columns under the block", () => {
    for (const tag of ["wa-page-editor", "wa-menu-editor"] as const) {
      const columns = rule(styles(tag), ".pe-layout > .column.left, .pe-layout > .column.inspector");
      expect(columns, tag).toContain("--pe-under-top: max(0px, calc(var(--pe-top-h, 0px) - var(--cf-pad, 16px)))");
      expect(columns, tag).toMatch(/top:\s*var\(--pe-under-top\)/);
      expect(columns, tag).toMatch(/max-height:\s*calc\(var\(--pe-view-h, calc\(100dvh - 120px\)\) - 30px - var\(--pe-under-top\)\)/);
    }
  });
});
