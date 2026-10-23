// A new watch as the person meets it on Watch settings, which opens ready on
// the defaults while Home Assistant holds no record and no iPhone will send
// one. Nothing is stored and nothing counts as unsaved until a change; Save
// is greyed out with its reason beside it; the first Save creates the record
// over revision 0; Discard goes back to the opening state. While an iPhone
// may still move the watch's setup here, the screen waits, and "Start fresh
// instead" opens the same ready screen without saving. A record this panel
// cannot read opens nothing, on Watch settings and in the page editor. The
// builders have their own tests; this drives the element and the page
// controller over a stand-in Home Assistant connection.
//
// No DOM: the page editor is made but never connected (so it never draws or
// reloads), and both are read by flattening the Lit templates they return.

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { HassLike, OwnerSummary, WatchConfigRecord } from "../src/ha-api.js";
import { WaPageEditor } from "../src/watch-pages/page-editor.js";
import { dropAllWatchPages } from "../src/watch-pages/kept.js";
import { WatchSettings } from "../src/watch-settings-view.js";
import { anyWatchSettingsDirty, dropWatchSettingsDrafts } from "../src/watch-settings-draft.js";
import { SETTINGS_GROUPS } from "../src/watch-settings-nav.js";
import {
  type CatalogSetting,
  NEW_WATCH_TEXT,
  NOTHING_TO_SAVE_TEXT,
  PAGES_UNREADABLE_TEXT,
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

/** `window.confirm` for the start fresh question, and nothing else. */
const realWindow = (globalThis as { window?: unknown }).window;
function answer(yes: boolean) {
  const confirm = vi.fn(() => yes);
  (globalThis as { window?: unknown }).window = { confirm, setTimeout: () => 1, clearTimeout: () => undefined };
  return confirm;
}

// ── the page editor ──────────────────────────────────────────────────────

// The page editor is a library page's only: there is no ready page for a new
// device any more. What is left of its part here is the record it cannot read.

/** The element's private parts this file reads and drives. */
interface PageEditorInside {
  hass?: HassLike;
  owners: readonly OwnerSummary[];
  watchId?: string;
  libraryItem?: { kind: "pages"; id: string };
  record?: WatchConfigRecord;
  draft?: unknown;
  save(): Promise<void>;
  renderBody(watches: readonly OwnerSummary[]): unknown;
}

let pageWatch = 0;

/** An unconnected page editor on a library page of its own (kept drafts
 * live for the module), previewed on a watch, showing `held`. */
function pageEditor(held: WatchConfigRecord) {
  const id = `start-pages-${++pageWatch}`;
  const ha = fakeHass("pages", held);
  const el = new WaPageEditor() as unknown as PageEditorInside;
  el.hass = ha.hass;
  el.owners = [owner(id)];
  el.libraryItem = { kind: "pages", id };
  el.watchId = id;
  el.record = held;
  return { el, ha, body: () => flatten(el.renderBody(el.owners)) };
}

describe("the page editor over a record it cannot read", () => {
  afterEach(() => {
    dropAllWatchPages();
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
