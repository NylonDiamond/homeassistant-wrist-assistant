// The page editor previewing a library page on an iPhone, against a stand-in
// Home Assistant that records every command: the stage's label and look, the
// page's cards naming the iPhone, and the phone among the devices to preview
// on, on a home with and without phone pages. The library's parts of the
// editor (ticks, unticks) are `library-page-editor.test.ts`.

import { describe, expect, it } from "vitest";

import type { HassLike, OwnerSummary, WatchConfigRecord } from "../src/ha-api.js";
import { libraryDraftKey } from "../src/library/item-mode.js";
import { forgetWatchPagesDraft, takeWatchPagesRecord } from "../src/watch-pages/kept.js";
import type { JsonObject, WatchPagesDocument } from "../src/watch-pages/model.js";
import { PHONE_FRAME_TEXT } from "../src/watch-pages/page-editor.js";

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

/** The id of the one page a library page's document holds. */
const watchPageIdOf = (pages: WatchPagesDocument): string => ((pages.pages as JsonObject[])[0]!.id as string);

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

/** The page editor on a library page, `pages` its document, previewed on the
 * home's iPhone (Preview on), on a home with phone pages unless `phones` is
 * false. */
function phoneEditor(pages: WatchPagesDocument, records: Record<string, JsonObject> = {}, phones = true) {
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
  const ha = home(all);
  const Ctor = customElements.get("wa-page-editor") as unknown as new () => Record<string, unknown>;
  const el = new Ctor();
  el.hass = ha.hass;
  el.owners = owners;
  el.phones = phones;
  const ref = { kind: "pages" as const, id: watchPageIdOf(pages) };
  el.libraryItem = ref;
  // As `followLibraryItem` leaves it once it opened the item on an iPhone.
  el.openedItem = ref;
  el.previewKind = "iphone";
  el.watchId = phone;
  const key = libraryDraftKey(ref);
  forgetWatchPagesDraft(key);
  el.record = { kind: "pages", revision: 4, hash: null, updated_at: null, updated_by: null, delivered_revision: 0, delivered_at: null, document: pages } as unknown as WatchConfigRecord;
  takeWatchPagesRecord(key, pages, 4);
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

describe("the stage on an iPhone", () => {
  it("draws an iPhone, named as the iPhone 17 Pro it is drawn as", () => {
    const mine: WatchPagesDocument = { schemaVersion: 1, pages: [{ id: U(90), name: "Mine", items: [tile(1, "light.a")] }] };
    const { el, whole } = phoneEditor(mine);
    el.selectedPageId = U(90);
    // The model and the frame's words are the facts at the top of the
    // editor bar's ··· menu.
    el.topMenuOpen = true;
    const text = whole();
    expect(text).toContain("iPhone 17 Pro");
    expect(text).toContain(PHONE_FRAME_TEXT);
    el.topMenuOpen = false;
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
    // The dock's zoom is the phone's own: half the watch's 150% (Fit with no
    // stage measured to fill).
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
  const mine: WatchPagesDocument = { schemaVersion: 1, pages: [{ id: U(90), name: "Mine", items: [] }] };

  it("is a device to preview on with phone pages, and not on a home without", () => {
    const on = phoneEditor(mine, {}, true);
    expect((on.el.watches as OwnerSummary[]).map((o) => o.owner_watch_id)).toEqual([on.watch, on.phone]);
    // The same phone on a home whose integration has no phone pages: not
    // listed.
    const off = phoneEditor(mine, {}, false);
    expect((off.el.watches as OwnerSummary[]).map((o) => o.owner_watch_id)).toEqual([off.watch]);
  });

  it("follows a home switch: another home's device list, with or without its phone", () => {
    const { el, phone } = phoneEditor(mine);
    // The next home lists only a watch, and keeps no phone pages.
    el.owners = [owner({ owner_watch_id: "other-home-watch", device_name: "Watch" })];
    el.phones = false;
    expect((el.watches as OwnerSummary[]).map((o) => o.owner_watch_id)).toEqual(["other-home-watch"]);
    // And back on a home that lists the same phone with phone pages.
    el.owners = [owner({ owner_watch_id: "w9" }), owner({ owner_watch_id: phone, device_kind: "iphone", phone_pages: true })];
    el.phones = true;
    expect((el.watches as OwnerSummary[]).map((o) => o.owner_watch_id)).toEqual(["w9", phone]);
  });
});
