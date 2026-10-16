// The page editor on an iPhone: the empty editor with Add page and Add all
// watch pages, that question, and an add run through it against a stand-in
// Home Assistant that records every command and links pages as the store
// does. Then linked pages in the editor: the badge, the Devices menu, the Not
// on this iPhone list and the delete choices. Then the stage's label, and the
// phone across homes with and without phone pages.

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
 * and saves that check their base revision as the store does. With `links`
 * it answers the linked pages commands too: `places` from the stored pages,
 * and `link` by putting the asked pages on each target with a link id,
 * appended, and the link id on the source's page. */
function home(records: Record<string, JsonObject>, links = false) {
  const held = new Map<string, { revision: number; document: unknown }>();
  for (const [at, document] of Object.entries(records)) held.set(at, { revision: 4, document });
  const sent: JsonObject[] = [];
  const record = (at: string): WatchConfigRecord => {
    const r = held.get(at) ?? { revision: 0, document: null };
    return { kind: at.split("/")[1]!, revision: r.revision, hash: null, updated_at: null, updated_by: "panel", delivered_revision: 0, delivered_at: null, document: r.document } as WatchConfigRecord;
  };
  const pagesOf = (owner: string): JsonObject[] => (((held.get(`${owner}/pages`)?.document as WatchPagesDocument | undefined)?.pages ?? []) as JsonObject[]);
  const put = (owner: string, pages: JsonObject[]) => {
    const now = held.get(`${owner}/pages`);
    held.set(`${owner}/pages`, { revision: (now?.revision ?? 0) + 1, document: { ...((now?.document as JsonObject | undefined) ?? { schemaVersion: 1 }), pages } });
  };
  const places = () => {
    const out: Record<string, string[]> = {};
    for (const [at, r] of held) {
      if (!at.endsWith("/pages") || r.revision <= 0) continue;
      for (const p of ((r.document as WatchPagesDocument).pages ?? []) as JsonObject[]) {
        if (typeof p.linkId === "string") (out[p.linkId] ??= []).push(at.split("/")[0]!);
      }
    }
    return { pages: out, status_pages: {} };
  };
  const link = (msg: JsonObject) => {
    const source = msg.source_id as string;
    const ids = msg.page_ids as string[];
    const from = pagesOf(source).map((p) => (ids.includes(p.id as string) ? { ...p, linkId: (p.linkId as string | undefined) ?? `L-${p.id as string}` } : p));
    put(source, from);
    const targets: Record<string, { pages: string[]; status_pages: string[] }> = {};
    for (const target of msg.targets as string[]) {
      const add = from.filter((p) => ids.includes(p.id as string));
      put(target, [...pagesOf(target), ...add.map((p) => ({ ...p, isHidden: undefined }))]);
      targets[target] = { pages: ids, status_pages: [] };
    }
    return { targets, link_ids: Object.fromEntries(from.filter((p) => ids.includes(p.id as string)).map((p) => [p.id, p.linkId])) };
  };
  /** `link_all`: every listed page the target lacks, every status page, and
   * the menus and rooms the target has none of. */
  const linkAll = (msg: JsonObject) => {
    const source = msg.source_id as string;
    const target = msg.target_id as string;
    const held_ = new Set(pagesOf(target).map((p) => p.id));
    const ids = pagesOf(source).filter((p) => p.isSystemPage !== true && !held_.has(p.id)).map((p) => p.id as string);
    if (ids.length > 0) link({ source_id: source, page_ids: ids, targets: [target] });
    const status = (((held.get(`${source}/status_pages`)?.document as JsonObject | undefined)?.statusPages ?? []) as JsonObject[]).map((p) => p.id as string);
    const copied: string[] = [];
    if ((held.get(`${target}/menus`)?.revision ?? 0) === 0 && held.has(`${source}/menus`)) {
      held.set(`${target}/menus`, { revision: 1, document: held.get(`${source}/menus`)!.document });
      copied.push("menus");
    }
    const behavior = held.get(`${source}/behavior`)?.document as JsonObject | undefined;
    if ((held.get(`${target}/rooms`)?.revision ?? 0) === 0 && behavior?.roomQuickJumpFallbackPageId !== undefined) {
      held.set(`${target}/rooms`, { revision: 1, document: { schemaVersion: 1, roomQuickJumpFallbackPageId: behavior.roomQuickJumpFallbackPageId } });
      copied.push("rooms");
    }
    return { pages: ids, status_pages: status, copied };
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
        if (links && type.endsWith("watch_pages/places")) return Promise.resolve(places());
        if (links && type.endsWith("watch_pages/link")) return Promise.resolve(link(msg));
        if (links && type.endsWith("watch_pages/link_all")) return Promise.resolve(linkAll(msg));
        if (type.endsWith("/list")) return Promise.resolve({ records: [] });
        return Promise.reject({ code: "unknown_command", message: type });
      },
    },
  } as unknown as HassLike;
  const saves = () => sent.filter((m) => (m.type as string).endsWith("watch_config/save")).map((m) => `${m.owner_watch_id as string}/${m.kind as string}`);
  const linksSent = () => sent.filter((m) => (m.type as string).endsWith("watch_pages/link")).map((m) => ({ source: m.source_id, pages: m.page_ids, targets: m.targets }));
  const linkAllsSent = () => sent.filter((m) => (m.type as string).endsWith("watch_pages/link_all")).map((m) => ({ source: m.source_id, target: m.target_id }));
  return { hass, held, sent, saves, linksSent, linkAllsSent };
}

/** The page editor on the home's iPhone, in the shell with phone pages, its
 * pages record as given (none for revision 0). */
function phoneEditor(pages: WatchPagesDocument | undefined, records: Record<string, JsonObject> = {}, phones = true, links = false) {
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
  const ha = home(all, links);
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
  // An integration with linked pages, as if its places were read already.
  if (links) el.places = { pages: {}, status_pages: {} };
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
    ask: () => el.addAsk as { state: string; pages?: WatchPagesDocument } | undefined,
  };
}

/** Wait for the stand-in's answers to land. */
const settle = () => new Promise((r) => setTimeout(r, 0));

describe("an iPhone with no pages", () => {
  it("shows an empty editor with Add page and Add all watch pages, never the watch's start", () => {
    const { body } = phoneEditor(undefined, {}, true, true);
    const text = body();
    expect(text).toContain("No pages on this iPhone yet.");
    expect(text).toContain(PHONE_PAGES_EMPTY_TEXT);
    expect(PHONE_PAGES_EMPTY_TEXT).not.toContain("Nothing is copied");
    expect(text).toMatch(/pe-add-first[\s\S]*Add page/);
    expect(text).toMatch(/pe-add-all-open[\s\S]*Add all watch pages/);
    expect(text).not.toContain("Copy from watch");
    expect(text).not.toContain("Start with an empty page");
    expect(text).not.toContain("No pages from this watch yet.");
  });

  it("shows the same once a record lists no pages, with the foot bar for its earlier saves", () => {
    const { body } = phoneEditor({ schemaVersion: 1, pages: [] }, {}, true, true);
    const text = body();
    expect(text).toContain("No pages on this iPhone yet.");
    expect(text).toContain("pe-add-all-open");
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

  it("offers Add all watch pages on a phone that has pages too, in the ··· menu", () => {
    const { el, whole } = phoneEditor({ schemaVersion: 1, pages: [{ id: U(90), name: "Mine", items: [] }] }, {}, true, true);
    el.topMenuOpen = true;
    const text = whole();
    expect(text).toMatch(/pe-add-all-menu[\s\S]*Add all watch pages…/);
    expect(text).not.toContain("Copy from watch");
  });

  it("offers no Add all watch pages on an integration without linked pages", () => {
    const { el, body, whole, call } = phoneEditor(undefined);
    expect(body()).toContain("pe-add-first");
    expect(body()).not.toContain("pe-add-all-open");
    el.topMenuOpen = true;
    expect(whole()).not.toContain("pe-add-all-menu");
    call("openAdd");
    expect(el.addAsk).toBeUndefined();
  });

  it("is not how a watch with no pages reads", () => {
    const { el, watch, owners, call } = phoneEditor(undefined);
    el.watchId = watch;
    const text = flat(call("renderBody", owners));
    // A watch with no pages opens ready on one empty page.
    expect(text).toContain("pe-layout");
    expect(text).not.toContain("No pages on this iPhone yet.");
    expect(text).not.toContain("pe-add-all-open");
  });
});

describe("the Add all watch pages question", () => {
  it("reads the watch's pages and says how many go on the iPhone, linked", async () => {
    const { call, ask, whole } = phoneEditor(undefined, {}, true, true);
    call("openAdd");
    expect(ask()?.state).toBe("loading");
    await settle();
    expect(ask()).toMatchObject({ state: "ready" });
    const text = whole();
    expect(text).toContain("From <b>Jesse's Watch</b>.");
    expect(text).toContain("3 pages and the watch's status pages go on this iPhone, after its own.");
    expect(text).toContain("They stay linked: an edit on one device shows on both.");
    expect(text).toContain("only where this iPhone has none");
  });

  it("counts only the pages the iPhone does not hold yet", async () => {
    const mine: WatchPagesDocument = { schemaVersion: 1, pages: [{ id: HALL, name: "Hall", linkId: "L-H", items: [] }] };
    const { call, whole } = phoneEditor(mine, {}, true, true);
    call("openAdd");
    await settle();
    const text = whole();
    expect(text).toContain("2 pages and the watch's status pages go on this iPhone");
    expect(text).toContain("1 page is here already.");
  });
});

describe("an add through the editor", () => {
  it("is one link_all from the watch, which copies the menus and rooms in Home Assistant, and the panel saves nothing", async () => {
    const { el, phone, watch, ha, call } = phoneEditor(undefined, {}, true, true);
    call("openAdd");
    await settle();
    await call<Promise<void>>("runAdd");
    expect(ha.linkAllsSent()).toEqual([{ source: watch, target: phone }]);
    expect(ha.saves()).toEqual([]);
    const pages = ha.held.get(`${phone}/pages`)!.document as WatchPagesDocument;
    expect((pages.pages as JsonObject[]).map((p) => [p.id, p.linkId])).toEqual([[HALL, `L-${HALL}`], [YARD, `L-${YARD}`], [DEN, `L-${DEN}`]]);
    expect((el.note as { text: string }).text).toBe("Added 3 pages, 1 status page, the menus and the rooms from Jesse's Watch. They stay linked: an edit on one device shows on both.");
    expect(el.addAsk).toBeUndefined();
    // The phone's new record is read back, and the first page opens.
    expect(el.selectedPageId).toBe(HALL);
  });

  it("keeps the phone's own menus and rooms", async () => {
    const mine: WatchPagesDocument = { schemaVersion: 1, pages: [{ id: U(90), name: "Mine", items: [] }] };
    const menus = { quickAction: { slots: [] }, entityRadial: {}, pageSwitcher: {}, schemaVersion: 1 };
    const { el, phone, ha, call } = phoneEditor(mine, { "PHONE/menus": menus, "PHONE/rooms": { schemaVersion: 1 } }, true, true);
    call("openAdd");
    await settle();
    await call<Promise<void>>("runAdd");
    expect(ha.saves()).toEqual([]);
    expect(ha.held.get(`${phone}/menus`)!.document).toEqual(menus);
    const pages = ha.held.get(`${phone}/pages`)!.document as WatchPagesDocument;
    expect((pages.pages as JsonObject[]).map((p) => p.name)).toEqual(["Mine", "Hall", "Yard", "Den"]);
    expect((el.note as { text: string }).text).toBe("Added 3 pages and 1 status page from Jesse's Watch. They stay linked: an edit on one device shows on both.");
  });

  it("says why when the integration refuses", async () => {
    const { el, call } = phoneEditor(undefined, {}, true, false);
    el.places = { pages: {}, status_pages: {} };
    call("openAdd");
    await settle();
    await call<Promise<void>>("runAdd");
    expect((el.note as { kind: string; text: string })).toEqual({ kind: "err", text: "Not added: This version of the integration cannot share pages between devices. Update it first." });
  });

  it("closes its question when another device opened before it ended", async () => {
    const { el, watch, call } = phoneEditor(undefined, {}, true, true);
    call("openAdd");
    await settle();
    const running = call<Promise<void>>("runAdd");
    el.watchId = watch;
    await running;
    expect(el.adding).toBe(false);
    expect(el.addAsk).toBeUndefined();
  });
});

describe("linked pages in the editor", () => {
  /** The phone holding Hall linked to the watch, and Mine of its own. */
  const linked = async () => {
    const watchPages = { schemaVersion: 1, pages: [{ ...(WATCH_PAGES.pages as JsonObject[])[0]!, linkId: "L1" }, ...(WATCH_PAGES.pages as JsonObject[]).slice(1)] };
    const mine: WatchPagesDocument = { schemaVersion: 1, pages: [{ id: HALL, name: "Hall", linkId: "L1", items: [] }, { id: U(90), name: "Mine", items: [] }] };
    const e = phoneEditor(mine, {}, true, true);
    e.ha.held.set(`${e.watch}/pages`, { revision: 4, document: watchPages });
    await e.call<Promise<void>>("loadLinks", e.phone);
    return { ...e, mine };
  };

  it("are off on an integration without them", async () => {
    const { el, phone, call, body } = phoneEditor({ schemaVersion: 1, pages: [{ id: HALL, name: "Hall", linkId: "L1", items: [] }] });
    await call<Promise<void>>("loadLinks", phone);
    expect(el.places).toBeUndefined();
    const text = body();
    expect(text).not.toContain("Also on");
    expect(text).not.toContain("on other devices.");
  });

  it("badge a linked row with the other device", async () => {
    const { el, body } = await linked();
    expect(el.places).toBeDefined();
    expect(body()).toMatch(/pe-linked[^>]*>Also on Jesse's Watch</);
  });

  it("count the watch's other pages in one line under the list, with a link to the Pages tab", async () => {
    const { body } = await linked();
    const text = body();
    expect(text).not.toContain("Not on this iPhone");
    expect(text).toMatch(/pe-else-line[^>]*>2 pages on other devices\.</);
    expect(text).toContain(">See all pages</a>");
  });

  it("show a Devices menu with a switch per device, this one fixed on", async () => {
    const { el, call } = await linked();
    call("openDevices", HALL, "row");
    const text = flat(call("renderDevicesMenu", { id: HALL, name: "Hall", linkId: "L1", items: [] }, "row"));
    expect(text).toContain("This page is on");
    expect(text).toMatch(/Hall on Jesse's Watch/);
    expect(text).toMatch(/Hall on Jesse's iPhone/);
    expect(text).toContain("this iPhone");
    expect(text).toContain("Delete takes it off this device.");
    expect(el.devicesMenu).toEqual({ pageId: HALL, where: "row" });
  });

  it("put a page on another device from its switch, and take it off again", async () => {
    const { el, watch, phone, ha, call } = await linked();
    call("openDevices", U(90), "card");
    await call<Promise<void>>("linkTo", U(90), watch);
    expect(ha.linksSent()).toEqual([{ source: phone, pages: [U(90)], targets: [watch] }]);
    expect(((ha.held.get(`${watch}/pages`)!.document as WatchPagesDocument).pages as JsonObject[]).map((p) => p.name)).toEqual(["Hall", "Yard", "Den", "Mine"]);
    expect((el.devicesNote as { text: string }).text).toBe("Added to Jesse's Watch.");
    await call<Promise<void>>("unlinkFrom", U(90), watch);
    expect(((ha.held.get(`${watch}/pages`)!.document as WatchPagesDocument).pages as JsonObject[]).map((p) => p.name)).toEqual(["Hall", "Yard", "Den"]);
    expect((el.devicesNote as { text: string }).text).toBe("Taken off Jesse's Watch.");
  });

  it("refuse a switch over unsaved edits", async () => {
    const { el, watch, phone, ha, call, mine } = await linked();
    keptWatchPagesDraft(phone)!.apply({ ...mine, pages: [...(mine.pages as JsonObject[]), { id: U(91), name: "New", items: [] }] });
    expect(call("devicesBlocked")).toMatch(/^Save or discard your edits first\./);
    await call<Promise<void>>("linkTo", U(90), watch);
    expect(ha.linksSent()).toEqual([]);
    expect(el.devicesNote).toBeUndefined();
  });

  it("will not take a page off a device whose editor holds unsaved edits", async () => {
    const { watch, call } = await linked();
    takeWatchPagesRecord(watch, WATCH_PAGES, 4);
    keptWatchPagesDraft(watch)!.apply({ ...WATCH_PAGES, pages: [] });
    expect(await call<Promise<string | undefined>>("takePageOff", watch, HALL)).toBe("Not taken off Jesse's Watch: its pages have unsaved edits. Save or discard them first.");
    forgetWatchPagesDraft(watch);
  });

  it("ask on delete whether to delete here or on every device, and delete everywhere", async () => {
    const { el, watch, phone, ha, call, mine } = await linked();
    call("askDelete", HALL);
    await settle();
    const text = flat(call("renderDeleteAsk", el.deleteAsk, mine));
    expect(text).toContain("It is also on Jesse's Watch.");
    expect(text).toContain("Delete on this iPhone");
    expect(text).toContain("Delete on all 2 devices");
    await call<Promise<void>>("deleteEverywhere");
    expect(((ha.held.get(`${watch}/pages`)!.document as WatchPagesDocument).pages as JsonObject[]).map((p) => p.name)).toEqual(["Yard", "Den"]);
    // Here it is an edit, saved with Save like any delete.
    expect((keptWatchPagesDraft(phone)!.document.pages as JsonObject[]).map((p) => p.name)).toEqual(["Mine"]);
    expect((el.note as { text: string }).text).toBe("Deleted on the other devices. Save to finish the delete on this iPhone.");
  });

  it("ask nothing more on delete for a page on this device alone", async () => {
    const { el, call, mine } = await linked();
    call("askDelete", U(90));
    await settle();
    const text = flat(call("renderDeleteAsk", el.deleteAsk, mine));
    expect(text).toContain(">Delete page<");
    expect(text).not.toContain("Delete on all");
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
    expect(text).toContain('class="wa-phone"');
    expect(text).not.toContain('class="wa-watch"');
    expect(text).not.toContain("watch frame");
    expect(text).toContain("iPhone showing Mine");
    // The tool strip's zoom is the phone's own: half the watch's 150%.
    expect(text).toContain(">75%<");
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
