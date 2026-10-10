// The page editor on an iPhone: the empty editor with Add page and Copy from
// watch, the Copy from watch question, and a copy run through it against a
// stand-in Home Assistant that records every command. Every save names the
// phone; the watch's records are only read. Then the stage's label, and the
// phone across homes with and without phone pages.

import { describe, expect, it } from "vitest";

import type { HassLike, OwnerSummary, WatchConfigRecord } from "../src/ha-api.js";
import { forgetWatchPagesDraft, keptWatchPagesDraft, takeWatchPagesRecord } from "../src/watch-pages/kept.js";
import type { JsonObject, WatchPagesDocument } from "../src/watch-pages/model.js";
import { PHONE_FRAME_TEXT, PHONE_PAGES_EMPTY_TEXT, phoneFrameLabel } from "../src/watch-pages/page-editor.js";

const flat = (v: unknown): string => {
  if (Array.isArray(v)) return v.map(flat).join("");
  if (v !== null && typeof v === "object" && "strings" in v && "values" in v) {
    const r = v as { strings: readonly string[]; values: unknown[] };
    return r.strings.map((s, i) => s + (i < r.values.length ? flat(r.values[i]) : "")).join("");
  }
  if (v !== null && typeof v === "object" && "_$litDirective$" in v && "values" in v) {
    const [items, second, third] = (v as { values: unknown[] }).values;
    const draw = (third ?? second) as unknown;
    if (Array.isArray(items) && typeof draw === "function") return items.map((item, i) => flat((draw as (x: unknown, i: number) => unknown)(item, i))).join("");
    return flat(items);
  }
  return typeof v === "string" || typeof v === "number" || typeof v === "boolean" ? String(v) : "";
};

const U = (n: number) => `5A17E000-0000-4000-8000-${n.toString(16).toUpperCase().padStart(12, "0")}`;
const HALL = U(1), YARD = U(2), DEN = U(3), S_ONE = U(11);
const tile = (n: number, entityId: string) => ({ id: U(100 + n), entityId, gridCol: 0, gridRow: n * 3, colSpan: 6, rowSpan: 3 });

const WATCH_PAGES: WatchPagesDocument = {
  schemaVersion: 1,
  pages: [
    { id: HALL, name: "Hall", items: [tile(1, `page.${YARD}`), tile(2, `status_page.${S_ONE}`)] },
    { id: YARD, name: "Yard", items: [tile(1, "light.yard")] },
    { id: DEN, name: "Den", items: [tile(1, "light.den")] },
  ],
};
const WATCH_STATUS = { schemaVersion: 1, statusPages: [{ id: S_ONE, name: "One", rows: [] }] };
const WATCH_MENUS = { quickAction: { slots: [{ id: U(301), action: { type: "navigateToPage", pageId: DEN } }] }, entityRadial: {}, pageSwitcher: {}, schemaVersion: 1 };

const owner = (o: Partial<OwnerSummary>): OwnerSummary => ({
  owner_watch_id: "x", device_name: "Apple Watch", device_kind: "watch", paired_iphone_name: null, app_version: "3.0.0",
  screen_size: null, complication_count: 0, token: 3, applied_token: 3, is_orphan: false, ...o,
} as OwnerSummary);

let made = 0;

/** A stand-in Home Assistant: records by `owner/kind`, every command sent,
 * and saves that check their base revision as the store does. */
function home(records: Record<string, JsonObject>) {
  const held = new Map<string, { revision: number; document: unknown }>();
  for (const [at, document] of Object.entries(records)) held.set(at, { revision: 4, document });
  const sent: JsonObject[] = [];
  const record = (at: string): WatchConfigRecord => {
    const r = held.get(at) ?? { revision: 0, document: null };
    return { kind: at.split("/")[1]!, revision: r.revision, hash: null, updated_at: null, updated_by: "panel", delivered_revision: 0, delivered_at: null, document: r.document } as WatchConfigRecord;
  };
  const hass = {
    user: { is_admin: true },
    states: {},
    connection: {
      sendMessagePromise: (msg: JsonObject) => {
        sent.push(msg);
        const at = `${msg.owner_watch_id as string}/${msg.kind as string}`;
        const type = msg.type as string;
        if (type.endsWith("watch_config/get")) return Promise.resolve(record(at));
        if (type.endsWith("watch_config/history")) return Promise.resolve({ entries: [] });
        if (type.endsWith("watch_config/save")) {
          const now = held.get(at)?.revision ?? 0;
          if (msg.base_revision !== now) return Promise.reject({ code: "conflict", message: `stored revision is ${now}` });
          held.set(at, { revision: now + 1, document: msg.document });
          return Promise.resolve({ revision: now + 1 });
        }
        return Promise.reject({ code: "unknown_command", message: type });
      },
    },
  } as unknown as HassLike;
  const saves = () => sent.filter((m) => (m.type as string).endsWith("watch_config/save")).map((m) => `${m.owner_watch_id as string}/${m.kind as string}`);
  return { hass, held, sent, saves };
}

/** The page editor on the home's iPhone, in the shell with phone pages, its
 * pages record as given (none for revision 0). */
function phoneEditor(pages: WatchPagesDocument | undefined, records: Record<string, JsonObject> = {}, phones = true) {
  const n = ++made;
  const watch = `ce-w1-${n}`;
  const phone = `ce-p1-${n}`;
  const owners = [
    owner({ owner_watch_id: watch, device_name: "Jesse's Watch", main_house: true }),
    owner({ owner_watch_id: phone, device_name: "Jesse's iPhone", device_kind: "iphone" }),
  ];
  const all: Record<string, JsonObject> = {
    [`${watch}/pages`]: WATCH_PAGES as JsonObject,
    [`${watch}/status_pages`]: WATCH_STATUS,
    [`${watch}/menus`]: WATCH_MENUS,
    [`${watch}/behavior`]: { roomQuickJumpFallbackPageId: HALL, longPressDuration: 0.5 },
  };
  for (const [k, v] of Object.entries(records)) all[k.replace("PHONE", phone)] = v;
  if (pages !== undefined) all[`${phone}/pages`] = pages as JsonObject;
  const ha = home(all);
  const Ctor = customElements.get("wa-page-editor") as unknown as new () => Record<string, unknown>;
  const el = new Ctor();
  el.hass = ha.hass;
  el.owners = owners;
  el.phones = phones;
  el.shellOwnsWatch = true;
  el.watchId = phone;
  forgetWatchPagesDraft(phone);
  el.record = (pages === undefined
    ? { kind: "pages", revision: 0, hash: null, updated_at: null, updated_by: null, delivered_revision: 0, delivered_at: null }
    : { kind: "pages", revision: 4, hash: null, updated_at: null, updated_by: "panel", delivered_revision: 4, delivered_at: null, document: pages }) as unknown as WatchConfigRecord;
  if (pages !== undefined) takeWatchPagesRecord(phone, pages, 4);
  el.renderInspector = () => "";
  // Never connected: nothing is drawn into a shadow root to look in.
  el.renderRoot = { activeElement: null, querySelector: () => null };
  // No focused field to let go of, and Node has no HTMLElement to ask.
  el.leaveTile = () => undefined;
  const call = <T>(name: string, ...args: unknown[]): T => (el[name] as (...a: unknown[]) => T).apply(el, args);
  return {
    el, watch, phone, owners, ha, call,
    body: () => flat(call("renderBody", owners)),
    whole: () => flat(call("render")),
    ask: () => el.copyAsk as { state: string; scope: string; pages?: WatchPagesDocument } | undefined,
  };
}

/** Wait for the stand-in's answers to land. */
const settle = () => new Promise((r) => setTimeout(r, 0));

describe("an iPhone with no pages", () => {
  it("shows an empty editor with Add page and Copy from watch, never the watch's start", () => {
    const { body } = phoneEditor(undefined);
    const text = body();
    expect(text).toContain("No pages on this iPhone yet.");
    expect(text).toContain(PHONE_PAGES_EMPTY_TEXT);
    expect(text).toMatch(/pe-add-first[\s\S]*Add page/);
    expect(text).toMatch(/pe-copy-open[\s\S]*Copy from watch/);
    expect(text).not.toContain("Start with an empty page");
    expect(text).not.toContain("No pages from this watch yet.");
  });

  it("shows the same once a record lists no pages, with the foot bar for its earlier saves", () => {
    const { body } = phoneEditor({ schemaVersion: 1, pages: [] });
    const text = body();
    expect(text).toContain("No pages on this iPhone yet.");
    expect(text).toContain("pe-copy-open");
    expect(text).toContain("History");
  });

  it("adds a first page from Add page in a record that lists none, as one undo step", () => {
    const { el, phone, call } = phoneEditor({ schemaVersion: 1, pages: [] });
    call("addPage");
    const draft = keptWatchPagesDraft(phone)!;
    expect((draft.document.pages as unknown[]).length).toBe(1);
    expect(draft.canUndo).toBe(true);
    expect(el.renaming).toBeDefined();
  });

  it("offers Copy from watch on a phone that has pages too, in the ··· menu", () => {
    const { el, whole } = phoneEditor({ schemaVersion: 1, pages: [{ id: U(90), name: "Mine", items: [] }] });
    el.topMenuOpen = true;
    expect(whole()).toMatch(/pe-copy-menu[\s\S]*Copy from watch…/);
  });

  it("is not how a watch with no pages reads", () => {
    const { el, watch, owners, call } = phoneEditor(undefined);
    el.watchId = watch;
    const text = flat(call("renderBody", owners));
    expect(text).toContain("No pages from this watch yet.");
    expect(text).not.toContain("pe-copy-open");
  });
});

describe("the Copy from watch question", () => {
  it("reads the watch's pages and offers all pages or one, each with what comes along", async () => {
    const { call, ask, whole } = phoneEditor(undefined);
    call("openCopy");
    expect(ask()?.state).toBe("loading");
    await settle();
    expect(ask()).toMatchObject({ state: "ready", scope: "all" });
    const text = whole();
    expect(text).toContain("From <b>Jesse's Watch</b>.");
    expect(text).toContain("3 pages, with the watch's status pages, menus and rooms");
    expect(text).toMatch(/Hall<\/b>[\s\S]*With 1 page it links to and the status pages it opens/);
    expect(text).toContain("never share a page");
  });

  it("will not copy over unsaved edits", async () => {
    const mine: WatchPagesDocument = { schemaVersion: 1, pages: [{ id: U(90), name: "Mine", items: [] }] };
    const { phone, call, ask } = phoneEditor(mine);
    keptWatchPagesDraft(phone)!.apply({ ...mine, pages: [{ id: U(90), name: "Renamed", items: [] }] });
    call("openCopy");
    await settle();
    expect(call("copyBlocked", ask())).toBe("Save or discard your edits first. A copy is saved at once.");
  });
});

describe("a copy through the editor", () => {
  it("of one page saves the phone's status pages, then its first pages record, and never writes the watch", async () => {
    const { el, phone, watch, ha, call, ask } = phoneEditor(undefined);
    call("openCopy");
    await settle();
    el.copyAsk = { ...ask(), scope: HALL };
    await call<Promise<void>>("runCopy");
    expect(ha.saves()).toEqual([`${phone}/status_pages`, `${phone}/pages`]);
    expect(ha.sent.filter((m) => (m.type as string).endsWith("/save") && m.owner_watch_id === watch)).toEqual([]);
    const pages = ha.held.get(`${phone}/pages`)!.document as WatchPagesDocument;
    expect((pages.pages as JsonObject[]).map((p) => p.name)).toEqual(["Hall", "Yard"]);
    expect(ha.held.get(`${watch}/pages`)).toEqual({ revision: 4, document: WATCH_PAGES });
    expect((el.note as { text: string }).text).toMatch(/^Copied 2 pages and 1 status page from Jesse's Watch\./);
    expect(el.selectedPageId).toBe((pages.pages as JsonObject[])[0]!.id);
    expect(el.copyAsk).toBeUndefined();
  });

  it("of all pages adds them to the phone's own as one undo step, and saves its menus and rooms too", async () => {
    const mine: WatchPagesDocument = { schemaVersion: 1, pages: [{ id: U(90), name: "Mine", items: [] }] };
    const { el, phone, watch, ha, call } = phoneEditor(mine);
    call("openCopy");
    await settle();
    await call<Promise<void>>("runCopy");
    expect(ha.saves()).toEqual([`${phone}/status_pages`, `${phone}/pages`, `${phone}/menus`, `${phone}/rooms`]);
    expect(ha.sent.some((m) => (m.type as string).endsWith("/save") && m.owner_watch_id === watch)).toBe(false);
    const saved = ha.held.get(`${phone}/pages`)!;
    expect(saved.revision).toBe(5);
    expect(((saved.document as WatchPagesDocument).pages as JsonObject[]).map((p) => p.name)).toEqual(["Mine", "Hall", "Yard", "Den"]);
    // The menus' Den slot opens the phone's Den, and the rooms record holds
    // the room keys alone.
    const den = ((saved.document as WatchPagesDocument).pages as JsonObject[])[3]!.id;
    expect(((ha.held.get(`${phone}/menus`)!.document as JsonObject).quickAction as { slots: JsonObject[] }).slots[0]!.action).toEqual({ type: "navigateToPage", pageId: den });
    expect(ha.held.get(`${phone}/rooms`)!.document).toEqual({ schemaVersion: 1, roomQuickJumpFallbackPageId: ((saved.document as WatchPagesDocument).pages as JsonObject[])[1]!.id });
    // Undo takes the copied pages back off the phone's draft.
    const draft = keptWatchPagesDraft(phone)!;
    expect(draft.dirty).toBe(false);
    expect(draft.canUndo).toBe(true);
    draft.undo();
    expect((draft.document.pages as JsonObject[]).map((p) => p.name)).toEqual(["Mine"]);
    expect((el.note as { kind: string }).kind).toBe("ok");
  });
});

describe("the stage on an iPhone", () => {
  it("keeps the watch frame, labelled with the phone's name", () => {
    const mine: WatchPagesDocument = { schemaVersion: 1, pages: [{ id: U(90), name: "Mine", items: [tile(1, "light.a")] }] };
    const { el, whole } = phoneEditor(mine);
    el.selectedPageId = U(90);
    const text = whole();
    expect(text).toContain(phoneFrameLabel("Jesse's iPhone"));
    expect(text).toContain(PHONE_FRAME_TEXT);
    expect(text).toContain("watch frame");
    expect(phoneFrameLabel("Jesse's iPhone")).toBe("Jesse's iPhone, in a watch frame");
  });
});

describe("the iPhone across homes", () => {
  it("is listed and edited on a home with phone pages, and gone on one without", () => {
    const on = phoneEditor(undefined, {}, true);
    expect((on.el.watches as OwnerSummary[]).map((o) => o.owner_watch_id)).toEqual([on.watch, on.phone]);
    expect(on.el.onPhone).toBe(true);
    // The same phone on a home whose integration has no phone pages: not
    // listed, and its id no longer makes this an iPhone editor.
    const off = phoneEditor(undefined, {}, false);
    expect((off.el.watches as OwnerSummary[]).map((o) => o.owner_watch_id)).toEqual([off.watch]);
    expect(off.el.onPhone).toBe(false);
    expect(flat(off.call("renderBody", off.owners))).not.toContain("No pages on this iPhone yet.");
  });

  it("follows a home switch: another home's device list, with or without its phone", () => {
    const { el, phone } = phoneEditor(undefined);
    expect(el.onPhone).toBe(true);
    // The next home lists only a watch, and keeps no phone pages.
    el.owners = [owner({ owner_watch_id: "other-home-watch", device_name: "Watch" })];
    el.phones = false;
    expect(el.onPhone).toBe(false);
    expect((el.watches as OwnerSummary[]).map((o) => o.owner_watch_id)).toEqual(["other-home-watch"]);
    // And back on a home that lists the same phone with phone pages.
    el.owners = [owner({ owner_watch_id: "w9" }), owner({ owner_watch_id: phone, device_kind: "iphone" })];
    el.phones = true;
    expect(el.onPhone).toBe(true);
  });
});
