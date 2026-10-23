// A new watch as the person meets it on the two screens that open ready: the
// page editor on one empty page and Watch settings on the defaults, while
// Home Assistant holds no record and no iPhone will send one. Nothing is
// stored and nothing counts as unsaved until a change; Save is greyed out with
// its reason beside it; the first Save creates the record over revision 0;
// Discard goes back to the opening state. While an iPhone may still move the
// watch's setup here, the screen waits, and "Start fresh instead" opens the
// same ready screen without saving. A record this panel cannot read opens
// nothing. The builders have their own tests; this drives the element and
// the page controller over a stand-in Home Assistant connection.
//
// No DOM: the page editor is made but never connected (so it never draws,
// polls or reloads), and both are read by flattening the Lit templates they
// return.

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { HassLike, OwnerSummary, WatchConfigRecord } from "../src/ha-api.js";
import { WaPageEditor } from "../src/watch-pages/page-editor.js";
import { newWatchPage, setWatchPageName } from "../src/watch-pages/edit.js";
import { anyWatchPagesDirty, dropAllWatchPages, keptWatchPagesDraft, takeWatchPagesRecord } from "../src/watch-pages/kept.js";
import type { WatchPagesDocument } from "../src/watch-pages/model.js";
import { WatchSettings } from "../src/watch-settings-view.js";
import { anyWatchSettingsDirty, dropWatchSettingsDrafts } from "../src/watch-settings-draft.js";
import { SETTINGS_GROUPS } from "../src/watch-settings-nav.js";
import {
  type CatalogSetting,
  NEW_WATCH_TEXT,
  NOTHING_TO_SAVE_TEXT,
  PAGES_UNREADABLE_TEXT,
  PAIR_FIRST_TEXT,
  SETTINGS_PAIR_FIRST_TEXT,
  SETTINGS_UNREADABLE_TEXT,
  START_FRESH_BUTTON,
  START_FRESH_CONFIRM_TEXT,
  WAIT_FOR_IPHONE_TEXT,
  WATCH_SETTINGS_CATALOG,
  catalogSettings,
  pagesUnreadableText,
  watchBehaviorDefaults,
  watchRecordUnreadable,
} from "../src/watch-settings.js";

// ── reading templates ────────────────────────────────────────────────────

interface Tpl {
  strings: readonly string[];
  values: unknown[];
}

function isTpl(node: unknown): node is Tpl {
  return typeof node === "object" && node !== null && "strings" in node && "values" in node;
}

function flatten(node: unknown): string {
  if (node === undefined || node === null || typeof node === "symbol") return "";
  if (Array.isArray(node)) return node.map(flatten).join("");
  if (isTpl(node)) return node.strings.map((s, i) => s + (i < node.values.length ? flatten(node.values[i]) : "")).join("");
  if (typeof node === "function" || typeof node === "object") return "";
  return String(node);
}

// ── a stand-in Home Assistant ────────────────────────────────────────────

const refusal = (code: string, message = code) => Object.assign(new Error(message), { code });

function record(revision: number, document?: Record<string, unknown>, kind = "pages"): WatchConfigRecord {
  return {
    kind,
    revision,
    hash: revision > 0 ? "h" : null,
    updated_at: null,
    updated_by: revision > 0 ? "panel" : null,
    delivered_revision: 0,
    delivered_at: null,
    ...(document === undefined ? {} : { document }),
  };
}

/** A connection that answers `get` with what it holds and `save` with
 * `onSave`, which by default stores the document as the next revision. A
 * kind other than `kind` is refused as `invalid`, as an integration older
 * than it does: Watch settings then leaves the notification style out. */
function fakeHass(kind: string, held: WatchConfigRecord, onSave?: (msg: Record<string, unknown>) => Promise<{ revision: number }>) {
  const sent: Record<string, unknown>[] = [];
  let stored = held;
  const hass = {
    user: { is_admin: true },
    states: {},
    connection: {
      async sendMessagePromise(msg: Record<string, unknown>): Promise<unknown> {
        if (msg.kind !== undefined && msg.kind !== kind) throw refusal("invalid", `unknown kind ${String(msg.kind)}`);
        sent.push(msg);
        const type = String(msg.type);
        if (type.endsWith("/get")) return structuredClone(stored);
        if (type.endsWith("/history")) return { entries: [] };
        if (type.endsWith("/save")) {
          if (onSave) return onSave(msg);
          stored = record(stored.revision + 1, msg.document as Record<string, unknown>, kind);
          return { revision: stored.revision };
        }
        throw refusal("unknown_command");
      },
      async subscribeMessage() {
        return async () => undefined;
      },
    },
  } as unknown as HassLike;
  return {
    hass,
    sent,
    saves: () => sent.filter((m) => String(m.type).endsWith("/save")),
    gets: () => sent.filter((m) => String(m.type).endsWith("/get")),
    /** What a conflict leaves behind: someone else's record. */
    hold(next: WatchConfigRecord) { stored = next; },
  };
}

const owner = (id: string, extra: Partial<OwnerSummary> = {}): OwnerSummary => ({
  ...extra,
  owner_watch_id: id,
  device_name: "Apple Watch",
  device_kind: "watch",
  paired_iphone_name: null,
  app_version: "3.1.0",
  screen_size: null,
  complication_count: 0,
  token: 1,
  is_orphan: false,
} as OwnerSummary);

/** Let the voided loads a save kicks off run to their end. */
const settle = () => new Promise((resolve) => setTimeout(resolve, 0));

/** `window.confirm` for the start fresh question, and nothing else. */
const realWindow = (globalThis as { window?: unknown }).window;
function answer(yes: boolean) {
  const confirm = vi.fn(() => yes);
  (globalThis as { window?: unknown }).window = { confirm, setTimeout: () => 1, clearTimeout: () => undefined };
  return confirm;
}

// ── the page editor ──────────────────────────────────────────────────────

/** The element's private parts this file reads and drives. */
interface PageEditorInside {
  hass?: HassLike;
  owners: readonly OwnerSummary[];
  watchId?: string;
  record?: WatchConfigRecord;
  note?: { kind: string; text: string };
  draft?: { document: WatchPagesDocument; revision: number; dirty: boolean; apply(next: WatchPagesDocument): boolean };
  isNew: boolean;
  save(): Promise<void>;
  discard(): void;
  askStartFresh(state?: "wait" | "start"): void;
  render(): unknown;
  renderBody(watches: readonly OwnerSummary[]): unknown;
  renderTopBar(draft: unknown): unknown;
}

let pageWatch = 0;

/** An unconnected page editor on a watch of its own (kept drafts are per
 * watch and live for the module), showing `held`. */
function pageEditor(
  held: WatchConfigRecord,
  onSave?: (msg: Record<string, unknown>) => Promise<{ revision: number }>,
  extra: Partial<OwnerSummary> = {},
) {
  const id = `start-pages-${++pageWatch}`;
  const ha = fakeHass("pages", held, onSave);
  const el = new WaPageEditor() as unknown as PageEditorInside;
  el.hass = ha.hass;
  el.owners = [owner(id, extra)];
  el.watchId = id;
  el.record = held;
  return {
    el,
    ha,
    id,
    body: () => flatten(el.renderBody(el.owners)),
    bar: () => flatten(el.renderTopBar(el.draft)),
    all: () => flatten(el.render()),
  };
}

/** Rename the ready page: the person's first change. */
function renameFirstPage(el: PageEditorInside, name: string): void {
  const draft = el.draft!;
  const id = String((draft.document.pages as { id: string }[])[0]!.id);
  draft.apply(setWatchPageName(draft.document, id, name));
}

describe("the page editor on a new watch", () => {
  beforeEach(() => answer(false));
  afterEach(() => {
    (globalThis as { window?: unknown }).window = realWindow;
    dropAllWatchPages();
  });

  it("opens ready on one empty page, with no Start, nothing stored and nothing unsaved", () => {
    for (const extra of [{ has_iphone: false }, {}]) {
      // `{}` is an integration older than the field: the same ready page.
      const { el, ha, all } = pageEditor(record(0), undefined, extra);
      const draft = el.draft!;
      expect(draft.revision).toBe(0);
      expect(draft.dirty).toBe(false);
      expect(draft.document.pages as unknown[]).toHaveLength(1);
      expect(el.isNew).toBe(true);
      expect(anyWatchPagesDirty()).toBe(false);
      expect(ha.saves()).toHaveLength(0);
      const text = all();
      expect(text).toContain(NEW_WATCH_TEXT);
      expect(text).toContain("pe-note info pe-new");
      expect(text).not.toContain("Start with");
      expect(text).not.toContain(WAIT_FOR_IPHONE_TEXT);
      expect(text).not.toContain(START_FRESH_BUTTON);
      expect(text).not.toContain(PAGES_UNREADABLE_TEXT);
      dropAllWatchPages();
    }
  });

  it("greys Save out with its reason beside it until a change", () => {
    const { el, bar } = pageEditor(record(0));
    expect(bar()).toMatch(/class="primary save "\s*\?disabled=true/);
    expect(bar()).toContain(NOTHING_TO_SAVE_TEXT);
    renameFirstPage(el, "Living room");
    expect(el.draft!.dirty).toBe(true);
    expect(anyWatchPagesDirty()).toBe(true);
    expect(bar()).toMatch(/class="primary save dirty"\s*\?disabled=false/);
    expect(bar()).not.toContain(NOTHING_TO_SAVE_TEXT);
  });

  it("goes back to the empty page on Discard", () => {
    const { el, bar } = pageEditor(record(0));
    const opened = structuredClone(el.draft!.document);
    renameFirstPage(el, "Living room");
    el.discard();
    expect(el.draft!.dirty).toBe(false);
    expect(el.draft!.document).toEqual(opened);
    expect(el.isNew).toBe(true);
    expect(bar()).toContain(NOTHING_TO_SAVE_TEXT);
  });

  it("creates the record on the first Save, over revision 0, with the change in it", async () => {
    const { el, ha, all } = pageEditor(record(0));
    renameFirstPage(el, "Living room");
    await el.save();
    await settle();
    const saves = ha.saves();
    expect(saves).toHaveLength(1);
    expect(saves[0]).toMatchObject({ kind: "pages", base_revision: 0 });
    const pages = (saves[0]!.document as { pages: { name: string }[] }).pages;
    expect(pages.map((p) => p.name)).toEqual(["Living room"]);
    expect(el.draft?.revision).toBe(1);
    expect(el.draft?.dirty).toBe(false);
    expect(el.isNew).toBe(false);
    expect(el.note).toBeUndefined();
    expect(all()).not.toContain(NEW_WATCH_TEXT);
  });

  it("asks for a pairing first when the first Save is refused as no_record, and keeps the change", async () => {
    const { el, ha } = pageEditor(record(0), async () => { throw refusal("no_record"); });
    renameFirstPage(el, "Living room");
    await el.save();
    await settle();
    expect(el.note).toEqual({ kind: "warn", text: PAIR_FIRST_TEXT });
    expect(ha.gets()).toHaveLength(0);
    expect(el.draft?.revision).toBe(0);
    expect(el.draft?.dirty).toBe(true);
    expect(el.isNew).toBe(true);
  });

  it("merges a record that came meanwhile under the change on a conflict, then saves over it", async () => {
    const theirs = { schemaVersion: 1, pages: [newWatchPage("7E1A0000-0000-4000-8000-000000000001", "Home")] };
    const fake: { ha?: ReturnType<typeof fakeHass> } = {};
    const bases: unknown[] = [];
    const { el, ha } = pageEditor(record(0), async (msg) => {
      bases.push(msg.base_revision);
      if (msg.base_revision === 0) {
        fake.ha!.hold(record(1, theirs));
        throw refusal("conflict", "stored revision is 1, save was based on 0");
      }
      return { revision: 2 };
    });
    fake.ha = ha;
    renameFirstPage(el, "Mine");
    await el.save();
    await settle();
    expect(bases).toEqual([0, 1]);
    expect(el.note).toEqual({ kind: "ok", text: "Saved. Changes made somewhere else were merged in." });
    expect(el.draft?.revision).toBe(2);
    const names = (el.draft!.document.pages as { name: string }[]).map((p) => p.name);
    expect(names).toContain("Home");
    expect(names).toContain("Mine");
  });

  it("waits for the iPhone's move, with a small link to start fresh, while the watch has an iPhone", () => {
    const { el, body } = pageEditor(record(0), undefined, { has_iphone: true });
    const text = body();
    expect(el.draft).toBeUndefined();
    expect(el.isNew).toBe(false);
    expect(text).toContain(WAIT_FOR_IPHONE_TEXT);
    expect(text).toContain(START_FRESH_BUTTON);
    expect(text).toContain("link start-fresh");
    expect(text).not.toContain(NEW_WATCH_TEXT);
    expect(text.indexOf(START_FRESH_BUTTON)).toBeGreaterThan(text.indexOf(WAIT_FOR_IPHONE_TEXT));
  });

  it("opens the same ready page from the link after a yes, and saves nothing", async () => {
    const no = answer(false);
    const { el, ha, all } = pageEditor(record(0), undefined, { has_iphone: true });
    el.askStartFresh("wait");
    expect(no).toHaveBeenCalledWith(START_FRESH_CONFIRM_TEXT);
    expect(el.draft).toBeUndefined();
    const yes = answer(true);
    el.askStartFresh("wait");
    await settle();
    expect(yes).toHaveBeenCalledTimes(1);
    expect(el.draft?.revision).toBe(0);
    expect(el.draft?.dirty).toBe(false);
    expect(el.isNew).toBe(true);
    expect(ha.saves()).toHaveLength(0);
    const text = all();
    expect(text).toContain(NEW_WATCH_TEXT);
    expect(text).not.toContain(WAIT_FOR_IPHONE_TEXT);
  });

  it("opens nothing over a record it cannot read, and never saves over one", async () => {
    const { el, ha, body } = pageEditor(record(3));
    const text = body();
    expect(text).toContain(PAGES_UNREADABLE_TEXT);
    expect(text).not.toContain(START_FRESH_BUTTON);
    expect(text).not.toContain(NEW_WATCH_TEXT);
    expect(el.draft).toBeUndefined();
    await el.save();
    expect(ha.saves()).toHaveLength(0);
  });

  it("names the device and where to update when a record cannot be read", () => {
    expect(PAGES_UNREADABLE_TEXT).toBe(pagesUnreadableText("watch"));
    expect(pagesUnreadableText("watch")).toContain("pages for this watch");
    expect(pagesUnreadableText("iphone")).toContain("pages for this iPhone");
    expect(pagesUnreadableText("iphone")).toContain("Update Wrist Assistant in HACS, then reload.");
  });

  it("keeps edits from a record that went away, instead of opening the ready page over them", () => {
    const { el, id, body } = pageEditor(record(0));
    const kept = takeWatchPagesRecord(id, { schemaVersion: 1, pages: [{ id: "P1", name: "Home", items: [] }] }, 3).draft;
    kept.apply(setWatchPageName(kept.document, "P1", "Kitchen"));
    expect(el.draft).toBeUndefined();
    const text = body();
    expect(text).toContain("Your unsaved edits from before are kept.");
    expect(text).toContain("Discard the kept edits");
    expect(text).not.toContain(START_FRESH_BUTTON);
    expect(keptWatchPagesDraft(id)).toBe(kept);
  });
});

// ── Watch settings ───────────────────────────────────────────────────────

/** The page shows one group at a time: every group's page it lists, in the
 * side panel's order, or the one page when it has no side panel. */
function everyGroup(inside: { group: string }, draw: () => string): string {
  const pages = SETTINGS_GROUPS.map((g) => {
    inside.group = g.id;
    const page = draw();
    return page.includes(`aria-label=${g.title} settings>`) ? page : "";
  }).join("");
  return pages === "" ? draw() : pages;
}

interface SettingsInside {
  group: string;
  record?: WatchConfigRecord;
  edits: ReadonlyMap<string, unknown>;
  loading: boolean;
  note?: { kind: string; text: string };
  save(): Promise<void>;
  discard(): void;
  askStartFresh(): void;
  edit(setting: CatalogSetting, value: unknown): void;
  renderBar(): unknown;
}

const setting = (key: string): CatalogSetting => {
  const s = catalogSettings().find((x) => x.key === key);
  if (s === undefined) throw new Error(`no setting ${key}`);
  return s;
};

let settingsWatch = 0;

describe("Watch settings on a new watch", () => {
  beforeEach(() => answer(false));
  afterEach(() => {
    (globalThis as { window?: unknown }).window = realWindow;
    dropWatchSettingsDrafts();
  });

  async function page(
    held: WatchConfigRecord,
    onSave?: (msg: Record<string, unknown>) => Promise<{ revision: number }>,
    extra: Partial<OwnerSummary> = {},
  ) {
    const id = `start-settings-${++settingsWatch}`;
    const ha = fakeHass("behavior", held, onSave);
    const host = {
      addController: () => undefined,
      removeController: () => undefined,
      requestUpdate: () => undefined,
      updateComplete: Promise.resolve(true),
      renderRoot: { querySelector: () => null },
    };
    const ws = new WatchSettings(host as unknown as ConstructorParameters<typeof WatchSettings>[0]);
    const owners = [owner(id, extra)];
    ws.show(ha.hass, owners, id);
    const inside = ws as unknown as SettingsInside;
    await vi.waitFor(() => expect(inside.loading).toBe(false));
    return {
      ws, inside, ha, owners, id,
      text: () => everyGroup(inside, () => flatten(ws.render(ha.hass, owners))),
      bar: () => flatten(inside.renderBar()),
    };
  }

  it("opens ready on the defaults, with no Start, nothing stored and nothing unsaved", async () => {
    for (const extra of [{ has_iphone: false }, {}]) {
      const { ha, text, bar } = await page(record(0, undefined, "behavior"), undefined, extra);
      const shown = text();
      expect(shown).toContain(NEW_WATCH_TEXT);
      expect(shown).toContain('class="ws-new"');
      for (const section of WATCH_SETTINGS_CATALOG.sections) expect(shown).toContain(section.title);
      expect(shown).not.toContain("No settings from this watch yet.");
      expect(shown).not.toContain("Start with");
      expect(shown).not.toContain(WAIT_FOR_IPHONE_TEXT);
      expect(shown).not.toContain(START_FRESH_BUTTON);
      expect(ha.saves()).toHaveLength(0);
      expect(anyWatchSettingsDirty()).toBe(false);
      expect(bar()).toContain(NOTHING_TO_SAVE_TEXT);
      expect(bar()).toContain("?disabled=true");
    }
  });

  it("counts a change as unsaved, and Discard goes back to the defaults", async () => {
    const { inside, bar } = await page(record(0, undefined, "behavior"));
    const wrap = setting("wrapPages");
    inside.edit(wrap, !(watchBehaviorDefaults().wrapPages as boolean));
    expect(anyWatchSettingsDirty()).toBe(true);
    expect(bar()).toContain("1 unsaved change");
    expect(bar()).not.toContain(NOTHING_TO_SAVE_TEXT);
    inside.discard();
    expect(inside.edits.size).toBe(0);
    expect(anyWatchSettingsDirty()).toBe(false);
    expect(bar()).toContain(NOTHING_TO_SAVE_TEXT);
  });

  it("creates the record on the first Save, over revision 0, from the defaults with the change on top", async () => {
    const { inside, ha, text } = await page(record(0, undefined, "behavior"));
    const flipped = !(watchBehaviorDefaults().wrapPages as boolean);
    inside.edit(setting("wrapPages"), flipped);
    await inside.save();
    const saves = ha.saves();
    expect(saves).toHaveLength(1);
    expect(saves[0]).toMatchObject({ kind: "behavior", base_revision: 0, document: { ...watchBehaviorDefaults(), wrapPages: flipped } });
    expect(inside.record?.revision).toBe(1);
    expect(inside.edits.size).toBe(0);
    expect(inside.note).toBeUndefined();
    expect(text()).not.toContain(NEW_WATCH_TEXT);
  });

  it("asks for a pairing first when the first Save is refused as no_record, and keeps the change", async () => {
    const { inside, ha } = await page(record(0, undefined, "behavior"), async () => { throw refusal("no_record"); });
    const before = ha.gets().length;
    inside.edit(setting("wrapPages"), !(watchBehaviorDefaults().wrapPages as boolean));
    await inside.save();
    expect(inside.note).toEqual({ kind: "warn", text: SETTINGS_PAIR_FIRST_TEXT });
    expect(ha.gets()).toHaveLength(before);
    expect(inside.edits.size).toBe(1);
    expect(inside.record?.revision).toBe(0);
  });

  it("shows the record that came meanwhile on a conflict, with the change on top", async () => {
    const theirs = { ...watchBehaviorDefaults(), crownSwitchesPages: true };
    const fake: { ha?: ReturnType<typeof fakeHass> } = {};
    const opened = await page(record(0, undefined, "behavior"), async () => {
      fake.ha!.hold(record(1, theirs, "behavior"));
      throw refusal("conflict", "stored revision is 1, save was based on 0");
    });
    fake.ha = opened.ha;
    const flipped = !(watchBehaviorDefaults().wrapPages as boolean);
    opened.inside.edit(setting("wrapPages"), flipped);
    await opened.inside.save();
    expect(opened.inside.record?.revision).toBe(1);
    expect(opened.inside.record?.document).toEqual(theirs);
    expect([...opened.inside.edits]).toEqual([["wrapPages", flipped]]);
    expect(opened.inside.note?.kind).toBe("warn");
    expect(opened.text()).not.toContain(NEW_WATCH_TEXT);
  });

  it("keeps a change made on the defaults when the page is left and opened again", async () => {
    const { ws, inside, ha, owners, id, bar } = await page(record(0, undefined, "behavior"));
    const flipped = !(watchBehaviorDefaults().wrapPages as boolean);
    inside.edit(setting("wrapPages"), flipped);
    ws.leave();
    ws.show(ha.hass, owners, id);
    await vi.waitFor(() => expect(inside.loading).toBe(false));
    expect([...inside.edits]).toEqual([["wrapPages", flipped]]);
    expect(inside.note).toBeUndefined();
    expect(bar()).toContain("1 unsaved change");
  });

  it("waits for the iPhone's move, with a small link to start fresh, while the watch has an iPhone", async () => {
    const { text, bar } = await page(record(0, undefined, "behavior"), undefined, { has_iphone: true });
    const shown = text();
    expect(shown).toContain(WAIT_FOR_IPHONE_TEXT);
    expect(shown).toContain(START_FRESH_BUTTON);
    expect(shown).toContain("link start-fresh ws-start");
    expect(shown).not.toContain(NEW_WATCH_TEXT);
    expect(bar()).not.toContain(NOTHING_TO_SAVE_TEXT);
  });

  it("opens the same ready page from the link after a yes, and saves nothing", async () => {
    const { inside, ha, text } = await page(record(0, undefined, "behavior"), undefined, { has_iphone: true });
    const no = answer(false);
    inside.askStartFresh();
    expect(no).toHaveBeenCalledWith(START_FRESH_CONFIRM_TEXT);
    expect(text()).toContain(WAIT_FOR_IPHONE_TEXT);
    answer(true);
    inside.askStartFresh();
    const shown = text();
    expect(shown).toContain(NEW_WATCH_TEXT);
    expect(shown).not.toContain(WAIT_FOR_IPHONE_TEXT);
    for (const section of WATCH_SETTINGS_CATALOG.sections) expect(shown).toContain(section.title);
    expect(ha.saves()).toHaveLength(0);
    expect(anyWatchSettingsDirty()).toBe(false);
  });

  it("opens nothing over a record it cannot read, and never saves over one", async () => {
    const { inside, ha, text } = await page(record(2, undefined, "behavior"));
    const shown = text();
    expect(shown).toContain(SETTINGS_UNREADABLE_TEXT);
    expect(shown).not.toContain(START_FRESH_BUTTON);
    expect(shown).not.toContain(NEW_WATCH_TEXT);
    await inside.save();
    expect(ha.saves()).toHaveLength(0);
  });
});

describe("which records are unreadable", () => {
  const read = (d: unknown) => (typeof d === "object" && d !== null ? d : undefined);
  it("is only a held record (revision above 0) whose document does not read", () => {
    expect(watchRecordUnreadable(undefined, read)).toBe(false);
    expect(watchRecordUnreadable(record(0), read)).toBe(false);
    expect(watchRecordUnreadable(record(1, { pages: [] }), read)).toBe(false);
    expect(watchRecordUnreadable(record(1), read)).toBe(true);
  });
});
