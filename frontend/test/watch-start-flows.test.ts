// The two Start buttons as the person meets them: the page editor's "Start
// with an empty page" and Watch settings' "Start with the defaults". The
// builders and create helpers have their own tests; this drives the element
// and the dialog controller over a stand-in Home Assistant connection, so the
// wiring around them is covered: what is selected or shown after a start,
// the note each refusal leaves, the reload after a conflict, and a record
// this panel cannot read, which offers no Start at all.
//
// No DOM: the page editor is made but never connected (so it never draws or
// polls), and both are read by flattening the Lit templates they return.

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { HassLike, OwnerSummary, WatchConfigRecord } from "../src/ha-api.js";
import { WaPageEditor } from "../src/watch-pages/page-editor.js";
import { findWatchPage } from "../src/watch-pages/edit.js";
import { WatchSettings } from "../src/watch-settings-view.js";
import {
  PAGES_NO_RECORD_TEXT,
  PAGES_START_BUTTON,
  PAGES_START_CONFLICT_TEXT,
  PAGES_UNREADABLE_TEXT,
  PAIR_FIRST_TEXT,
  SETTINGS_NO_RECORD_TEXT,
  SETTINGS_PAIR_FIRST_TEXT,
  SETTINGS_START_BUTTON,
  SETTINGS_START_CONFLICT_TEXT,
  SETTINGS_UNREADABLE_TEXT,
  START_PHONE_FIRST_TEXT,
  WATCH_SETTINGS_CATALOG,
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
 * `onSave`, which by default stores the document as the next revision. */
function fakeHass(kind: string, held: WatchConfigRecord, onSave?: (msg: Record<string, unknown>) => Promise<{ revision: number }>) {
  const sent: Record<string, unknown>[] = [];
  let stored = held;
  const hass = {
    user: { is_admin: true },
    states: {},
    connection: {
      async sendMessagePromise(msg: Record<string, unknown>): Promise<unknown> {
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

const owner = (id: string): OwnerSummary => ({
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

/** Let the voided loads a start kicks off run to their end. */
const settle = () => new Promise((resolve) => setTimeout(resolve, 0));

// ── the page editor ──────────────────────────────────────────────────────

/** The element's private parts this file reads and drives. */
interface PageEditorInside {
  hass?: HassLike;
  watchId?: string;
  record?: WatchConfigRecord;
  note?: { kind: string; text: string };
  selectedPageId?: string;
  draft?: { document: Record<string, unknown>; revision: number };
  startEmptyPage(): Promise<void>;
  renderBody(watches: readonly OwnerSummary[]): unknown;
}

let pageWatch = 0;

/** An unconnected page editor on a watch of its own (kept drafts are per
 * watch and live for the module), showing `held`. */
function pageEditor(held: WatchConfigRecord, onSave?: (msg: Record<string, unknown>) => Promise<{ revision: number }>) {
  const id = `start-pages-${++pageWatch}`;
  const ha = fakeHass("pages", held, onSave);
  const el = new WaPageEditor() as unknown as PageEditorInside;
  el.hass = ha.hass;
  el.watchId = id;
  el.record = held;
  return { el, ha, id, body: () => flatten(el.renderBody([owner(id)])) };
}

describe("the page editor's Start", () => {
  it("offers the button with the iPhone line under it while no record is held", () => {
    const { body } = pageEditor(record(0));
    const text = body();
    expect(text).toContain(PAGES_NO_RECORD_TEXT);
    expect(text).toContain(PAGES_START_BUTTON);
    expect(text).toContain(START_PHONE_FIRST_TEXT);
    expect(text.indexOf(START_PHONE_FIRST_TEXT)).toBeGreaterThan(text.indexOf(PAGES_START_BUTTON));
    expect(text).not.toContain(PAGES_UNREADABLE_TEXT);
  });

  it("saves one empty page over revision 0, then selects it once the record is read back", async () => {
    const { el, ha } = pageEditor(record(0));
    await el.startEmptyPage();
    await settle();
    const saves = ha.saves();
    expect(saves).toHaveLength(1);
    expect(saves[0]).toMatchObject({ kind: "pages", base_revision: 0 });
    const pages = (saves[0]!.document as { pages: { id: string }[] }).pages;
    expect(pages).toHaveLength(1);
    expect(el.selectedPageId).toBe(pages[0]!.id);
    expect(el.note).toMatchObject({ kind: "ok" });
    expect(el.note!.text).toContain("revision 1");
    expect(el.record?.revision).toBe(1);
    expect(el.draft?.revision).toBe(1);
    expect(findWatchPage(el.draft!.document, pages[0]!.id)).toBeDefined();
  });

  it("asks for a pairing first when the watch is not paired, and reads nothing", async () => {
    const { el, ha } = pageEditor(record(0), async () => { throw refusal("no_record"); });
    await el.startEmptyPage();
    await settle();
    expect(el.note).toEqual({ kind: "warn", text: PAIR_FIRST_TEXT });
    expect(el.selectedPageId).toBeUndefined();
    expect(ha.gets()).toHaveLength(0);
    expect(el.record?.revision).toBe(0);
  });

  it("reads the record that came meanwhile on a conflict, and says so", async () => {
    const theirs = { schemaVersion: 1, pages: [{ id: "THEIRS", name: "Home", items: [] }] };
    const fake: { ha?: ReturnType<typeof fakeHass> } = {};
    const { el, ha } = pageEditor(record(0), async () => {
      fake.ha!.hold(record(1, theirs));
      throw refusal("conflict", "stored revision is 1, save was based on 0");
    });
    fake.ha = ha;
    await el.startEmptyPage();
    await settle();
    expect(el.note).toEqual({ kind: "warn", text: PAGES_START_CONFLICT_TEXT });
    expect(ha.gets()).toHaveLength(1);
    expect(el.record?.revision).toBe(1);
    expect(el.draft?.document).toEqual(theirs);
  });

  it("offers no Start over a record it cannot read, and never saves over one", async () => {
    const { el, ha, body } = pageEditor(record(3));
    const text = body();
    expect(text).toContain(PAGES_UNREADABLE_TEXT);
    expect(text).not.toContain(PAGES_START_BUTTON);
    expect(text).not.toContain(START_PHONE_FIRST_TEXT);
    await el.startEmptyPage();
    expect(ha.saves()).toHaveLength(0);
  });
});

// ── Watch settings ───────────────────────────────────────────────────────

interface SettingsInside {
  record?: WatchConfigRecord;
  loading: boolean;
  note?: { kind: string; text: string };
  start(): Promise<void>;
}

describe("Watch settings' Start", () => {
  // The dialog polls for delivery once a save waits for the watch; Node has
  // no window to time it with.
  const realWindow = (globalThis as { window?: unknown }).window;
  beforeEach(() => {
    (globalThis as { window?: unknown }).window = { setTimeout: () => 1, clearTimeout: () => undefined };
  });
  afterEach(() => {
    (globalThis as { window?: unknown }).window = realWindow;
  });

  async function dialog(held: WatchConfigRecord, onSave?: (msg: Record<string, unknown>) => Promise<{ revision: number }>) {
    const ha = fakeHass("behavior", held, onSave);
    const host = {
      addController: () => undefined,
      removeController: () => undefined,
      requestUpdate: () => undefined,
      updateComplete: Promise.resolve(true),
      renderRoot: { querySelector: () => null },
    };
    const ws = new WatchSettings(host as unknown as ConstructorParameters<typeof WatchSettings>[0]);
    const owners = [owner("w1")];
    ws.show(ha.hass, owners, "w1");
    const inside = ws as unknown as SettingsInside;
    await vi.waitFor(() => expect(inside.loading).toBe(false));
    return { ws, inside, ha, text: () => flatten(ws.render(ha.hass, owners)) };
  }

  it("offers the button with the iPhone line under it while no record is held", async () => {
    const { text } = await dialog(record(0, undefined, "behavior"));
    const shown = text();
    expect(shown).toContain(SETTINGS_NO_RECORD_TEXT);
    expect(shown).toContain(SETTINGS_START_BUTTON);
    expect(shown).toContain(START_PHONE_FIRST_TEXT);
    expect(shown.indexOf(START_PHONE_FIRST_TEXT)).toBeGreaterThan(shown.indexOf(SETTINGS_START_BUTTON));
  });

  it("saves the defaults over revision 0 and opens the settings on them", async () => {
    const { inside, ha, text } = await dialog(record(0, undefined, "behavior"));
    await inside.start();
    const saves = ha.saves();
    expect(saves).toHaveLength(1);
    expect(saves[0]).toMatchObject({ kind: "behavior", base_revision: 0, document: watchBehaviorDefaults() });
    expect(inside.record?.revision).toBe(1);
    expect(inside.note).toMatchObject({ kind: "note" });
    expect(inside.note!.text).toContain("revision 1");
    const shown = text();
    expect(shown).not.toContain(SETTINGS_START_BUTTON);
    for (const section of WATCH_SETTINGS_CATALOG.sections) expect(shown).toContain(section.title);
  });

  it("asks for a pairing first when the watch is not paired, and keeps the button", async () => {
    const { inside, ha, text } = await dialog(record(0, undefined, "behavior"), async () => { throw refusal("no_record"); });
    const before = ha.gets().length;
    await inside.start();
    expect(inside.note).toEqual({ kind: "warn", text: SETTINGS_PAIR_FIRST_TEXT });
    expect(ha.gets()).toHaveLength(before);
    expect(text()).toContain(SETTINGS_START_BUTTON);
  });

  it("reads the record that came meanwhile on a conflict, and says so", async () => {
    const theirs = { ...watchBehaviorDefaults(), crownSwitchesPages: true };
    const fake: { ha?: ReturnType<typeof fakeHass> } = {};
    const opened = await dialog(record(0, undefined, "behavior"), async () => {
      fake.ha!.hold(record(1, theirs, "behavior"));
      throw refusal("conflict", "stored revision is 1, save was based on 0");
    });
    fake.ha = opened.ha;
    await opened.inside.start();
    expect(opened.inside.note).toEqual({ kind: "warn", text: SETTINGS_START_CONFLICT_TEXT });
    expect(opened.inside.record?.revision).toBe(1);
    expect(opened.inside.record?.document).toEqual(theirs);
    expect(opened.text()).not.toContain(SETTINGS_START_BUTTON);
  });

  it("offers no Start over a record it cannot read, and never saves over one", async () => {
    const { inside, ha, text } = await dialog(record(2, undefined, "behavior"));
    const shown = text();
    expect(shown).toContain(SETTINGS_UNREADABLE_TEXT);
    expect(shown).not.toContain(SETTINGS_START_BUTTON);
    expect(shown).not.toContain(START_PHONE_FIRST_TEXT);
    await inside.start();
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
