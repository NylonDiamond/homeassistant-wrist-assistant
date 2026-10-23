// The page editor on an iPhone, against a stand-in Home Assistant that
// records every command: the empty editor with Add page, the delete question's
// room lines, the stage's label, and the phone across homes with and without
// phone pages. The library's parts of the editor (ticks, Not on this iPhone,
// the delete choices) are `library-page-editor.test.ts`.

import { describe, expect, it } from "vitest";

import type { HassLike, OwnerSummary, WatchConfigRecord } from "../src/ha-api.js";
import { forgetWatchPagesDraft, keptWatchPagesDraft, takeWatchPagesRecord } from "../src/watch-pages/kept.js";
import type { JsonObject, WatchPagesDocument } from "../src/watch-pages/model.js";
import { PHONE_FRAME_TEXT, PHONE_PAGES_EMPTY_TEXT } from "../src/watch-pages/page-editor.js";

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
 * and saves that check their base revision as the store does. An integration
 * with no library: `library/summary` is an unknown command. */
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
        if (type.endsWith("/list")) return Promise.resolve({ records: [] });
        return Promise.reject({ code: "unknown_command", message: type });
      },
      subscribeMessage: () => Promise.resolve(() => Promise.resolve()),
    },
  } as unknown as HassLike;
  return { hass, held, sent };
}

/** The page editor on the home's iPhone, in the shell with phone pages, its
 * pages record as given (none for revision 0). */
function phoneEditor(pages: WatchPagesDocument | undefined, records: Record<string, JsonObject> = {}, phones = true) {
  const n = ++made;
  const watch = `ce-w1-${n}`;
  const phone = `ce-p1-${n}`;
  const owners = [
    owner({ owner_watch_id: watch, device_name: "Jesse's Watch", main_house: true }),
    owner({ owner_watch_id: phone, device_name: "Jesse's iPhone", device_kind: "iphone", phone_pages: true }),
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
  };
}

/** Wait for the stand-in's answers to land. */
const settle = () => new Promise((r) => setTimeout(r, 0));

describe("an iPhone with no pages", () => {
  it("shows an empty editor with Add page, never the watch's start, and no Add all watch pages", () => {
    const { body } = phoneEditor(undefined);
    const text = body();
    expect(text).toContain("No pages on this iPhone yet.");
    expect(text).toContain(PHONE_PAGES_EMPTY_TEXT);
    expect(PHONE_PAGES_EMPTY_TEXT).not.toContain("linked");
    expect(text).toMatch(/pe-add-first[\s\S]*Add page/);
    expect(text).not.toContain("Add all watch pages");
    expect(text).not.toContain("Copy from watch");
    expect(text).not.toContain("Start with an empty page");
    expect(text).not.toContain("No pages from this watch yet.");
  });

  it("shows the same once a record lists no pages, with the foot bar for its earlier saves", () => {
    const { el, body, whole } = phoneEditor({ schemaVersion: 1, pages: [] });
    const text = body();
    expect(text).toContain("No pages on this iPhone yet.");
    expect(text).toContain("History");
    el.topMenuOpen = true;
    expect(whole()).not.toContain("Add all watch pages");
  });

  it("adds a first page from Add page in a record that lists none, as one undo step", () => {
    const { el, phone, call } = phoneEditor({ schemaVersion: 1, pages: [] });
    call("addPage");
    const draft = keptWatchPagesDraft(phone)!;
    expect((draft.document.pages as unknown[]).length).toBe(1);
    expect(draft.canUndo).toBe(true);
    expect(el.renaming).toBeDefined();
  });

  it("is not how a watch with no pages reads", () => {
    const { el, watch, owners, call } = phoneEditor(undefined);
    el.watchId = watch;
    const text = flat(call("renderBody", owners));
    // A watch with no pages opens ready on one empty page.
    expect(text).toContain("pe-layout");
    expect(text).not.toContain("No pages on this iPhone yet.");
  });
});

describe("deleting a page on an iPhone", () => {
  it("reads the phone's rooms record and lists the rooms that open the page", async () => {
    const mine: WatchPagesDocument = { schemaVersion: 1, pages: [{ id: U(90), name: "Mine", items: [] }] };
    const rooms = { schemaVersion: 1, roomQuickJumpFallbackPageId: U(90), roomQuickJumpMappings: { kitchen: U(90) } };
    const { el, phone, ha, call } = phoneEditor(mine, { "PHONE/rooms": rooms });
    call("askDelete", U(90));
    await settle();
    const gets = ha.sent.filter((m) => (m.type as string).endsWith("watch_config/get") && m.owner_watch_id === phone).map((m) => m.kind);
    expect(gets).toContain("rooms");
    expect(gets).not.toContain("behavior");
    expect(el.deleteAsk).toMatchObject({ roomsKind: "rooms", behaviorState: "ready", behavior: rooms });
    const text = flat(call("renderDeleteAsk", el.deleteAsk, mine));
    expect(text).toContain("This home's rooms name this page for room quick jump:");
    expect(text).toContain("The page it opens when no room matches");
    expect(text).toContain("The page for <b>kitchen</b>");
    expect(text).toContain("After the delete the iPhone opens another page there instead.");
  });
});

describe("the stage on an iPhone", () => {
  it("draws an iPhone, named as the iPhone 17 Pro it is drawn as", () => {
    const mine: WatchPagesDocument = { schemaVersion: 1, pages: [{ id: U(90), name: "Mine", items: [tile(1, "light.a")] }] };
    const { el, whole } = phoneEditor(mine);
    el.selectedPageId = U(90);
    const text = whole();
    expect(text).toContain("iPhone 17 Pro");
    expect(text).toContain(PHONE_FRAME_TEXT);
    // In the iPhone look, the default while the phone's settings say nothing.
    expect(text).toContain('class="wa-phone ios"');
    // The one-screen app's top row: no tab bar, no large title. "Mine" sets
    // no title style, so the phone names it nowhere, and with one page there
    // is no grid.
    expect(text).toContain('class="wa-phone-top"');
    expect(text).toContain("wa-phone-gear");
    expect(text).not.toContain("wa-phone-grid");
    expect(text).not.toContain("wa-phone-tab");
    expect(text).not.toContain("wa-phone-title");
    expect(text).not.toContain('class="wa-watch"');
    expect(text).not.toContain("watch frame");
    expect(text).toContain("iPhone showing Mine");
    // The tool strip's zoom is the phone's own: half the watch's 150%.
    expect(text).toContain(">75%<");
  });

  it("draws the Watch look when the phone's Page look says so", () => {
    const mine: WatchPagesDocument = { schemaVersion: 1, pages: [{ id: U(90), name: "Mine", items: [tile(1, "light.a")] }] };
    const { el, whole } = phoneEditor(mine);
    el.selectedPageId = U(90);
    el.behavior = { phonePageLook: "watch" };
    const text = whole();
    expect(text).toContain('class="wa-phone"');
    expect(text).not.toContain("wa-phone ios");
    expect(text).not.toContain("wa-phone-title");
    expect(text).toContain("iPhone showing Mine");
  });
});

describe("the page's cards on an iPhone", () => {
  it("name the iPhone, not the watch", () => {
    const mine: WatchPagesDocument = { schemaVersion: 1, pages: [{ id: U(90), name: "Mine", items: [tile(1, "light.a")] }] };
    const { el, call } = phoneEditor(mine);
    el.selectedPageId = U(90);
    const page = (mine.pages as JsonObject[])[0]!;
    const text = flat(call("renderPageCards", page, undefined));
    expect(text).toContain("On the iPhone");
    expect(text).toContain("Click a tile on the iPhone to edit it.");
    expect(text).not.toContain("On the watch");
    expect(text).not.toContain("tile on the watch");
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
    el.owners = [owner({ owner_watch_id: "w9" }), owner({ owner_watch_id: phone, device_kind: "iphone", phone_pages: true })];
    el.phones = true;
    expect(el.onPhone).toBe(true);
  });
});
