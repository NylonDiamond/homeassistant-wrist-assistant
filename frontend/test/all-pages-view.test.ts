// The Pages tab's element against a stand-in Home Assistant: it reads every
// device's pages, draws a card per page with a chip per device under the
// Complications list's head and device tabs, opens a page on its device,
// and its Devices menu links a page to another device or takes it off one.

import { describe, expect, it } from "vitest";

import type { HassLike, OwnerSummary } from "../src/ha-api.js";
import { pageCrop } from "../src/watch-pages/all-pages.js";
import { REFERENCE_CASE } from "../src/renderer.js";
import { keptWatchPagesSelection, takeNewWatchPageAsk } from "../src/watch-pages/kept.js";
import { takeStatusPageAsk } from "../src/watch-status-pages/draft.js";
import type { JsonObject, WatchPagesDocument } from "../src/watch-pages/model.js";
import { type PageCard, cardDevicePlaces } from "../src/watch-pages/all-pages-model.js";
import { DEVICES_WAIT_TAG, type LinkDevice } from "../src/watch-pages/links.js";

const flat = (v: unknown): string => {
  if (Array.isArray(v)) return v.map(flat).join("");
  if (v !== null && typeof v === "object" && "strings" in v && "values" in v) {
    const r = v as { strings: readonly string[]; values: unknown[] };
    return r.strings.map((s, i) => s + (i < r.values.length ? flat(r.values[i]) : "")).join("");
  }
  if (v !== null && typeof v === "object" && "_$litDirective$" in v && "values" in v) return flat((v as { values: unknown[] }).values[0]);
  return typeof v === "string" || typeof v === "number" || typeof v === "boolean" ? String(v) : "";
};

const U = (n: number) => `5A17E000-0000-4000-8000-${n.toString(16).toUpperCase().padStart(12, "0")}`;
const HALL = U(1), DEN = U(2), MINE = U(3);

let made = 0;

const HOUSE = "5A7E0000-0000-4000-8000-000000000001", DOORS = "5A7E0000-0000-4000-8000-000000000002";
const STARTER = "00000000-0000-0000-0000-000000000001";

/** The tab over a watch and an iPhone. With `status`, the watch also holds
 * the status pages House (linked to the iPhone) and Doors, and both hold a
 * starter page. */
function tab(status = false) {
  const n = ++made;
  const watch = `ap-w1-${n}`;
  const phone = `ap-p1-${n}`;
  const owners = [
    { owner_watch_id: watch, device_name: "Jesse's Watch", device_kind: "watch" },
    { owner_watch_id: phone, device_name: "Jesse's iPhone", device_kind: "iphone", phone_pages: true },
  ] as unknown as OwnerSummary[];
  const held = new Map<string, { revision: number; document: JsonObject; multiple_pages?: boolean }>([
    [`${watch}/pages`, { revision: 3, document: { schemaVersion: 1, pages: [{ id: HALL, name: "Hall", linkId: "L1", items: [] }, { id: DEN, name: "Den", items: [] }] } }],
    [`${phone}/pages`, { revision: 2, document: { schemaVersion: 1, pages: [{ id: MINE, name: "Mine", items: [] }, { id: HALL, name: "Hall", linkId: "L1", isHidden: true, items: [] }] } }],
  ]);
  if (status) {
    const starter = { id: STARTER, name: "Lights On", rows: [] };
    held.set(`${watch}/status_pages`, { revision: 5, document: { schemaVersion: 1, statusPages: [starter, { id: HOUSE, name: "House", linkId: "S1", rows: [] }, { id: DOORS, name: "Doors", rows: [] }] } });
    held.set(`${phone}/status_pages`, { revision: 4, document: { schemaVersion: 1, statusPages: [starter, { id: HOUSE, name: "House", linkId: "S1", rows: [] }] } });
  }
  const sent: JsonObject[] = [];
  const listKey = (kind: string) => (kind === "status_pages" ? "statusPages" : "pages");
  const pagesOf = (owner: string, kind = "pages") => ((held.get(`${owner}/${kind}`)?.document[listKey(kind)] ?? []) as JsonObject[]);
  const put = (owner: string, pages: JsonObject[], kind = "pages") => {
    const now = held.get(`${owner}/${kind}`);
    held.set(`${owner}/${kind}`, { ...now, revision: (now?.revision ?? 0) + 1, document: { schemaVersion: 1, [listKey(kind)]: pages } });
  };
  const hass = {
    states: {},
    connection: {
      sendMessagePromise: (msg: JsonObject) => {
        sent.push(msg);
        const type = msg.type as string;
        const at = `${msg.owner_watch_id as string}/${msg.kind as string}`;
        if (type.endsWith("watch_config/get")) {
          const r = held.get(at) ?? { revision: 0, document: null };
          return Promise.resolve({ kind: msg.kind, revision: r.revision, document: r.document, multiple_pages: "multiple_pages" in r ? r.multiple_pages : null });
        }
        if (type.endsWith("watch_config/save")) {
          const now = held.get(at)?.revision ?? 0;
          if (msg.base_revision !== now) return Promise.reject({ code: "conflict", message: "conflict" });
          held.set(at, { revision: now + 1, document: msg.document as JsonObject });
          return Promise.resolve({ revision: now + 1 });
        }
        if (type.endsWith("watch_pages/places")) return Promise.resolve({ pages: {}, status_pages: {} });
        if (type.endsWith("watch_pages/link")) {
          const kind = (msg.kind as string | undefined) ?? "pages";
          const source = msg.source_id as string;
          const ids = msg.page_ids as string[];
          const from = pagesOf(source, kind).map((p) => (ids.includes(p.id as string) ? { ...p, linkId: p.linkId ?? `L-${p.id as string}` } : p));
          put(source, from, kind);
          for (const target of msg.targets as string[]) put(target, [...pagesOf(target, kind), ...from.filter((p) => ids.includes(p.id as string))], kind);
          const added = (t: string) => (kind === "status_pages" ? { pages: [], status_pages: ids } : { pages: ids, status_pages: [] });
          return Promise.resolve({ targets: Object.fromEntries((msg.targets as string[]).map((t) => [t, added(t)])) });
        }
        if (type.endsWith("/list")) return Promise.resolve({ records: [] });
        return Promise.reject({ code: "unknown_command", message: type });
      },
      subscribeMessage: () => Promise.resolve(() => undefined),
    },
  } as unknown as HassLike;
  const Ctor = customElements.get("wa-all-pages") as unknown as new () => Record<string, unknown>;
  const el = new Ctor();
  el.hass = hass;
  el.owners = owners;
  el.phones = true;
  el.ownersReady = true;
  el.renderRoot = { querySelector: () => null };
  const call = <T>(name: string, ...args: unknown[]): T => (el[name] as (...a: unknown[]) => T).apply(el, args);
  const cards = () => el.cards as PageCard[];
  const card = (name: string) => cards().find((c) => c.name === name)!;
  const place = (c: PageCard, owner: string) => cardDevicePlaces(el.devices as LinkDevice[], c).find((p) => p.device.ownerId === owner)!;
  return { el, owners, watch, phone, held, sent, call, cards, card, place, whole: () => flat(call("render")) };
}

describe("the Pages tab", () => {
  it("reads every device's pages and draws a card per page, a linked one once with a chip per device", async () => {
    const { call, cards, whole } = tab();
    await call<Promise<void>>("loadAll");
    expect(cards().map((c) => c.name)).toEqual(["Hall", "Den", "Mine"]);
    const text = whole();
    expect(text).toContain("3 pages on your watches and iPhones.");
    expect(text).toMatch(/ap-name">Hall</);
    expect(text).toContain("<em>hidden</em>");
    expect(text).toContain("Devices");
  });

  it("has the Complications list's head: Multi select, the Device menu and the search, over device tabs", async () => {
    const { call, whole } = tab();
    await call<Promise<void>>("loadAll");
    const text = whole();
    expect(text).not.toContain("On device");
    expect(text).not.toContain("Page only");
    expect(text).toContain("Multi select");
    expect(text).toContain("Search by name");
    expect(text).toMatch(/pk-shape-lead">Device</);
    expect(text).toContain("Watches (2)");
    expect(text).toContain("iPhones (2)");
    // All 3, then each device with its count and its color.
    expect(text).toMatch(/pk-tab-name">All<\/span>\s*<span class="pk-tab-count">3</);
    expect(text).toMatch(/pk-tab-name">Jesse's Watch<\/span>\s*<span class="pk-tab-count">2</);
    expect(text).toContain("--dc:var(--wa-person-2)");
    expect(text).not.toContain("Not on a device");
    expect(text).not.toContain("ap-chip");
    // No colored strip along a card's top: the device chips say where it is.
    expect(text).not.toContain("ap-strip");
    // A card draws the page alone: no iPhone, whatever device it is on.
    expect(text).toContain("ap-pic");
    expect(text).not.toContain("wa-phone");
  });

  it("crops a page's picture to its tiles", async () => {
    const { card, call } = tab();
    await call<Promise<void>>("loadAll");
    const page = card("Hall").copies[0]!.page;
    const crop = pageCrop(page, undefined, undefined);
    const empty = pageCrop({ ...page, tiles: [] }, undefined, undefined);
    expect(crop.height).toBeGreaterThan(0);
    expect(empty).toEqual({ top: 0, height: REFERENCE_CASE.screen.height });
  });

  it("narrows the cards to one kind of device with the Device menu", async () => {
    const { call, whole } = tab();
    await call<Promise<void>>("loadAll");
    call("setKind", "iphone");
    const text = whole();
    expect(text).toMatch(/ap-name">Hall</);
    expect(text).toMatch(/ap-name">Mine</);
    expect(text).not.toMatch(/ap-name">Den</);
    call("setKind", "all");
  });

  it("opens a page on its device, picked in the page editor", async () => {
    const { el, watch, phone, call, card } = tab();
    await call<Promise<void>>("loadAll");
    const opened: string[] = [];
    el.onOpen = (owner: string, kind: string) => opened.push(`${owner}/${kind}`);
    call("open", card("Hall"), "all");
    call("open", card("Mine"), "all");
    call("open", card("Hall"), phone);
    expect(opened).toEqual([`${watch}/watch`, `${phone}/iphone`, `${phone}/iphone`]);
    expect(keptWatchPagesSelection(watch).pageId).toBe(HALL);
    expect(keptWatchPagesSelection(phone).pageId).toBe(HALL);
  });

  it("has New page: on All it asks which device, on a device's tab it adds the page there, and either opens that device's editor", async () => {
    const { el, watch, phone, call, whole } = tab();
    await call<Promise<void>>("loadAll");
    const opened: string[] = [];
    el.onOpen = (owner: string, kind: string) => opened.push(`${owner}/${kind}`);
    expect(whole()).toContain("<span>New page</span>");
    expect(whole()).toContain("Pick the device to add a page on");
    el.newOpen = true;
    expect(whole()).toContain("ap-new-menu");
    expect(whole()).toContain("<span>Jesse's iPhone</span></button>");
    call("newPage", (el.devices as LinkDevice[]).find((d) => d.ownerId === phone));
    expect(el.newOpen).toBe(false);
    expect(opened).toEqual([`${phone}/iphone`]);
    expect(takeNewWatchPageAsk(phone)).toBe(true);
    expect(takeNewWatchPageAsk(phone)).toBe(false);
    call("setFilter", watch);
    expect(whole()).toContain("Add a page on Jesse's Watch");
    expect(whole()).not.toContain("ap-new-menu");
    call("setFilter", "all");
  });

  it("puts a page on another device from its Devices menu, then takes it off again", async () => {
    const { el, watch, phone, held, sent, call, card, place } = tab();
    await call<Promise<void>>("loadAll");
    call("openDevices", card("Den"));
    await call<Promise<void>>("toggle", card("Den"), place(card("Den"), phone));
    expect(sent.filter((m) => (m.type as string).endsWith("watch_pages/link")).map((m) => [m.source_id, m.page_ids, m.targets]))
      .toEqual([[watch, [DEN], [phone]]]);
    expect((el.devicesNote as { text: string }).text).toBe("Added to Jesse's iPhone.");
    // One card still, now on both, and its menu still open on it.
    expect(card("Den").copies.map((c) => c.device.ownerId)).toEqual([watch, phone]);
    expect(call<PageCard | undefined>("cardOfMenu", el.cards)?.name).toBe("Den");
    await call<Promise<void>>("toggle", card("Den"), place(card("Den"), phone));
    expect((held.get(`${phone}/pages`)!.document.pages as JsonObject[]).map((p) => p.name)).toEqual(["Mine", "Hall"]);
    expect((el.devicesNote as { text: string }).text).toBe("Taken off Jesse's iPhone.");
    expect(card("Den").copies.map((c) => c.device.ownerId)).toEqual([watch]);
  });

  it("says a page added to a device on the free plan shows only if it is first", async () => {
    const { el, phone, held, call, card, place } = tab();
    held.set(`${phone}/pages`, { ...held.get(`${phone}/pages`)!, multiple_pages: false });
    await call<Promise<void>>("loadAll");
    call("openDevices", card("Den"));
    await call<Promise<void>>("toggle", card("Den"), place(card("Den"), phone));
    expect((el.devicesNote as { text: string }).text).toBe("Added to Jesse's iPhone. On the free plan, Jesse's iPhone shows only its first page.");
  });

  it("greys out a watch that waits for its iPhone, in a card's Devices menu and in Add to", async () => {
    const { el, owners, call, card } = tab();
    const waiting = `${owners[0]!.owner_watch_id}-new`;
    el.owners = [...owners, { owner_watch_id: waiting, device_name: "Chen's Watch", device_kind: "watch", has_iphone: true } as unknown as OwnerSummary];
    await call<Promise<void>>("loadAll");
    call("openDevices", card("Den"));
    const menu = flat(call("renderMenu", card("Den"), el.devices));
    expect(menu).toContain(`<span class="pk-dup-full">${DEVICES_WAIT_TAG}</span>`);
    call("startSelect");
    el.selected = new Set([card("Den").key]);
    el.bulkMenu = "add";
    const bar = flat(call("renderBarMenu", "add", [card("Den")], el.devices, false));
    const at = bar.indexOf("Chen's Watch");
    const row = bar.slice(bar.lastIndexOf("<button", at), bar.indexOf("</button>", at));
    expect(row).toContain(`class="pk-bar-row" ?disabled=true`);
    expect(row).toContain(`<span class="pk-bar-row-n">${DEVICES_WAIT_TAG}</span>`);
  });

  it("will not switch off a page's only device", async () => {
    const { call, card, place, watch, sent } = tab();
    await call<Promise<void>>("loadAll");
    const only = place(card("Den"), watch);
    expect(only.stuck).toBeDefined();
    await call<Promise<void>>("toggle", card("Den"), only);
    expect(sent.some((m) => (m.type as string).endsWith("watch_config/save"))).toBe(false);
  });

  describe("multi-select", () => {
    const click = (mods: { meta?: boolean; ctrl?: boolean; shift?: boolean } = {}) => ({
      metaKey: mods.meta ?? false, ctrlKey: mods.ctrl ?? false, shiftKey: mods.shift ?? false,
      preventDefault: () => undefined, stopPropagation: () => undefined,
    });

    it("Cmd+click picks a card and starts select mode; then a click picks, Shift+click a run, and Esc leaves", async () => {
      const { el, call, card, whole } = tab();
      await call<Promise<void>>("loadAll");
      const opened: string[] = [];
      el.onOpen = (owner: string) => opened.push(owner);
      call("cardClick", click({ meta: true }), card("Hall"), "all");
      expect(el.selecting).toBe(true);
      expect([...(el.selected as Set<string>)]).toEqual([card("Hall").key]);
      call("cardClick", click({ shift: true }), card("Mine"), "all");
      expect((el.selected as Set<string>).size).toBe(3);
      call("cardClick", click(), card("Den"), "all");
      expect((el.selected as Set<string>).has(card("Den").key)).toBe(false);
      expect(opened).toEqual([]);
      const text = whole();
      expect(text).toContain("pk-card-pick");
      expect(text).toContain("2 picked");
      expect(text).toContain("All shown");
      expect(text).toContain("Add to…");
      expect(text).toContain("Remove from…");
      expect(text).toContain("Delete…");
      expect(text).toContain("Done");
      expect(text).not.toContain("Pick the devices this page is on");
      call("onKeyDown", { key: "Escape", preventDefault: () => undefined });
      expect(el.selecting).toBe(false);
      expect((el.selected as Set<string>).size).toBe(0);
      expect(whole()).not.toContain("pk-bar");
    });

    it("Multi select shows the bar under the tabs at once, with All shown, None and Done", async () => {
      const { el, call, whole } = tab();
      await call<Promise<void>>("loadAll");
      call("startSelect");
      expect(whole()).toContain("Pick a page to start.");
      call("selectShown", true);
      expect(whole()).toContain("3 picked");
      expect(whole()).toMatch(/>None</);
      call("endSelect");
      expect(el.selecting).toBe(false);
    });

    it("lists the devices under Add to, one press each, greying a device that has them all", async () => {
      const { call, card, whole } = tab();
      await call<Promise<void>>("loadAll");
      call("startSelect");
      call("pick", card("Mine"), false);
      call("openBulkMenu", "add");
      const text = whole();
      expect(text).toContain("Add 1 page to");
      expect(text.match(/class="pk-bar-row"/g)?.length).toBe(2);
      expect(text).toMatch(/pk-dup-name">Jesse's iPhone<\/span>\s*<span class="pk-bar-row-n">has them all</);
      call("openBulkMenu", "add");
      expect(whole()).not.toContain("pk-bar-list");
    });

    it("Select all and none act on the shown cards, and a filter unpicks what it hides", async () => {
      const { el, phone, call } = tab();
      await call<Promise<void>>("loadAll");
      call("startSelect");
      call("selectShown", true);
      expect((el.selected as Set<string>).size).toBe(3);
      call("setFilter", phone);
      expect((el.selected as Set<string>).size).toBe(2);
      call("selectShown", false);
      expect((el.selected as Set<string>).size).toBe(0);
      call("setFilter", "all");
    });

    it("adds the picked pages to a device, linked, and keeps them picked", async () => {
      const { el, watch, phone, sent, call, card } = tab();
      await call<Promise<void>>("loadAll");
      call("cardClick", click({ ctrl: true }), card("Den"), "all");
      call("openBulkMenu", "add");
      await call<Promise<void>>("runBulk", "add", [phone]);
      expect(sent.filter((m) => (m.type as string).endsWith("watch_pages/link")).map((m) => [m.source_id, m.page_ids, m.targets]))
        .toEqual([[watch, [DEN], [phone]]]);
      expect((el.bulkNote as { text: string }).text).toBe("Added 1 page to Jesse's iPhone.");
      expect(card("Den").copies.map((c) => c.device.ownerId)).toEqual([watch, phone]);
      expect([...(el.selected as Set<string>)]).toEqual([card("Den").key]);
    });

    it("asks before a delete, then takes the pages off every device in one save each", async () => {
      const { el, watch, phone, held, sent, call, card, cards, whole } = tab();
      await call<Promise<void>>("loadAll");
      call("startSelect");
      call("pick", card("Hall"), false);
      call("pick", card("Mine"), false);
      call("openBulkMenu", "delete");
      expect(whole()).toContain("Delete 2 pages from 2 devices?");
      expect(whole()).toContain("Really delete");
      await call<Promise<void>>("runBulk", "delete");
      const saves = sent.filter((m) => (m.type as string).endsWith("watch_config/save") && m.kind === "pages").map((m) => m.owner_watch_id);
      expect(saves).toEqual([watch, phone]);
      expect((held.get(`${phone}/pages`)!.document.pages as JsonObject[]).map((p) => p.name)).toEqual([]);
      expect((held.get(`${watch}/pages`)!.document.pages as JsonObject[]).map((p) => p.name)).toEqual(["Den"]);
      expect((el.bulkNote as { text: string }).text).toBe("Deleted 2 pages.");
      expect(cards().map((c) => c.name)).toEqual(["Den"]);
      expect((el.selected as Set<string>).size).toBe(0);
    });

    it("will not take a page off its only device", async () => {
      const { el, phone, sent, call, card } = tab();
      await call<Promise<void>>("loadAll");
      call("startSelect");
      call("pick", card("Mine"), false);
      call("openBulkMenu", "remove");
      await call<Promise<void>>("runBulk", "remove", [phone]);
      expect(sent.some((m) => (m.type as string).endsWith("watch_config/save"))).toBe(false);
      expect((el.bulkNote as { text: string }).text).toBe("Kept Mine: it would be left on no device. Use Delete for those.");
    });
  });
});

describe("the Pages tab's info pages", () => {
  /** A tab with status pages, read, shown on the Info pages chip. Set back
   * to Pages after, since the chip is remembered for the next tab. */
  async function infoTab() {
    const t = tab(true);
    await t.call<Promise<void>>("loadAll");
    t.call("setCardKind", "status_pages");
    return t;
  }

  it("has the kind chips with their counts, and Pages first", async () => {
    const { call, whole } = tab(true);
    await call<Promise<void>>("loadAll");
    const text = whole();
    expect(text).toMatch(/pk-seg-btn on"[^>]*>Pages<span class="ap-kind-n">3</);
    expect(text).toMatch(/>Info pages<span class="ap-kind-n">2</);
    expect(text).toMatch(/ap-name">Hall</);
    expect(text).not.toMatch(/ap-name">House</);
  });

  it("shows the info pages, a linked one once, the starter pages left out", async () => {
    const t = await infoTab();
    const text = t.whole();
    expect(text).toContain("2 info pages on your watches and iPhones. An info page is a status page");
    expect(text).toMatch(/ap-name">House</);
    expect(text).toMatch(/ap-name">Doors</);
    expect(text).not.toMatch(/ap-name">Lights On</);
    expect(text).not.toMatch(/ap-name">Hall</);
    expect(text).toContain("0 rows");
    expect(text).toContain("sp-screen");
    // No New page under Info pages: the status pages editor makes them.
    expect(text).not.toContain("<span>New page</span>");
    expect(t.card("House").copies.map((c) => c.device.ownerId)).toEqual([t.watch, t.phone]);
    t.call("setCardKind", "pages");
  });

  it("opens an info page in its device's status pages editor, on that page", async () => {
    const t = await infoTab();
    const opened: string[] = [];
    t.el.onOpen = (owner: string, kind: string, what?: string) => opened.push(`${owner}/${kind}/${what ?? "pages"}`);
    t.call("open", t.card("Doors"), "all");
    expect(opened).toEqual([`${t.watch}/watch/status_pages`]);
    expect(takeStatusPageAsk(t.watch)).toBe(DOORS);
    t.call("setCardKind", "pages");
  });

  it("links an info page from its Devices menu with the status_pages kind, then takes it off again", async () => {
    const t = await infoTab();
    t.call("openDevices", t.card("Doors"));
    await t.call<Promise<void>>("toggle", t.card("Doors"), t.place(t.card("Doors"), t.phone));
    expect(t.sent.filter((m) => (m.type as string).endsWith("watch_pages/link")).map((m) => [m.source_id, m.page_ids, m.targets, m.kind]))
      .toEqual([[t.watch, [DOORS], [t.phone], "status_pages"]]);
    expect((t.el.devicesNote as { text: string }).text).toBe("Added to Jesse's iPhone.");
    expect(t.card("Doors").copies.map((c) => c.device.ownerId)).toEqual([t.watch, t.phone]);
    await t.call<Promise<void>>("toggle", t.card("Doors"), t.place(t.card("Doors"), t.phone));
    const phoneStatus = t.held.get(`${t.phone}/status_pages`)!.document.statusPages as JsonObject[];
    expect(phoneStatus.map((p) => p.name)).toEqual(["Lights On", "House"]);
    expect((t.el.devicesNote as { text: string }).text).toBe("Taken off Jesse's iPhone.");
    t.call("setCardKind", "pages");
  });

  it("picks info pages only, and deletes them from every device without touching pages", async () => {
    const t = await infoTab();
    t.call("startSelect");
    expect(t.whole()).toContain("Pick an info page to start.");
    t.call("selectShown", true);
    expect((t.el.selected as Set<string>).size).toBe(2);
    t.call("openBulkMenu", "delete");
    expect(t.whole()).toContain("Delete 2 info pages from 2 devices?");
    await t.call<Promise<void>>("runBulk", "delete");
    const saves = t.sent.filter((m) => (m.type as string).endsWith("watch_config/save")).map((m) => `${m.owner_watch_id as string}/${m.kind as string}`);
    expect(saves).toEqual([`${t.watch}/status_pages`, `${t.phone}/status_pages`]);
    expect((t.el.bulkNote as { text: string }).text).toBe("Deleted 2 info pages.");
    expect((t.held.get(`${t.watch}/status_pages`)!.document.statusPages as JsonObject[]).map((p) => p.name)).toEqual(["Lights On"]);
    // Each device's menus were read for the Status page slots that showed
    // them; the complications, which never open an info page, were not.
    const menuReads = t.sent.filter((m) => (m.type as string).endsWith("watch_config/get") && m.kind === "menus").map((m) => m.owner_watch_id);
    expect(menuReads).toEqual([t.watch, t.phone]);
    expect(t.sent.some((m) => (m.type as string).endsWith("/list"))).toBe(false);
    t.call("endSelect");
    t.call("setCardKind", "pages");
  });

  it("drops the picks when the kind chip changes", async () => {
    const t = await infoTab();
    t.call("startSelect");
    t.call("selectShown", true);
    t.call("setCardKind", "pages");
    expect((t.el.selected as Set<string>).size).toBe(0);
    expect(t.el.cardKind).toBe("pages");
  });
});
