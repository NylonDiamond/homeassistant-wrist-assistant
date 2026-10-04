// The foot bar of the page and menu editors (`config-foot.ts`): the stored
// copy's line on the left, History and Raw configuration on the right, and
// the two dialogs they open. Then the page editor drawn with a record, to
// check the bar is there and the Page card sits under the watch, in the
// stage card, with the settings column holding only the Tile card.

import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import type { OwnerSummary, WatchConfigHistoryEntry, WatchConfigRecord } from "../src/ha-api.js";
import {
  REJECTED_TEXT,
  configFootStatus,
  configRawText,
  renderConfigFoot,
  renderConfigHistoryDialog,
  renderConfigRawDialog,
} from "../src/watch-pages/config-foot.js";
import { takeWatchPagesRecord } from "../src/watch-pages/kept.js";
import type { WatchPagesDocument } from "../src/watch-pages/model.js";
import "../src/watch-pages/page-editor.js";
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

function foot(r: WatchConfigRecord, historyState: "ready" | "unsupported" = "ready", size = 2_000): string {
  const status = configFootStatus({ record: r, size, limit: 10_000, noun: "pages", historyState, now: NOW });
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
    expect(text).toContain("2 KB of the 10 KB the watch takes");
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
    expect(text.indexOf("</aside>")).toBeLessThan(text.indexOf(`<footer class="cf-bar"`));
  });

  it("draws the Page card under the watch, inside the stage card, and leaves the side column to the Tile card", () => {
    const text = body();
    const stage = text.indexOf(`class="pe-card pe-stage"`);
    const settings = text.indexOf(`class="pe-stage-settings"`);
    const pageCard = text.indexOf(`class="pe-card pe-page-card"`);
    const side = text.indexOf(`<aside class="pe-side">`);
    expect(stage).toBeGreaterThan(-1);
    expect(text.indexOf(`class="pe-stage-body"`)).toBeGreaterThan(stage);
    expect(settings).toBeGreaterThan(text.indexOf(`class="pe-stage-body"`));
    expect(pageCard).toBeGreaterThan(settings);
    expect(pageCard).toBeLessThan(text.indexOf("</section>", stage));
    expect(side).toBeGreaterThan(pageCard);
    const aside = text.slice(side, text.indexOf("</aside>"));
    expect(aside).toContain("Select a tile to edit it, or add one.");
    expect(aside).not.toContain("pe-page-card");
  });

  it("goes to two columns of fields only when the stage is wide", () => {
    const element = customElements.get("wa-page-editor") as unknown as { styles: unknown };
    const sheet = (s: unknown): string => (Array.isArray(s) ? s.map(sheet).join("\n") : String((s as { cssText?: string } | undefined)?.cssText ?? ""));
    const css = sheet(element.styles);
    expect(css).toMatch(/\.pe-stage-settings\s*\{[^}]*container:\s*pe-settings\s*\/\s*inline-size/);
    expect(css).toMatch(/@container pe-settings \(min-width: 700px\)\s*\{[^@]*\.pe-page-card \.ps-root \{[^}]*columns: 2/);
    expect(css).toContain(".cf-bar");
  });
});
