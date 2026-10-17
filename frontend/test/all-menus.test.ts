// The Menus tab: its cards from every device's menus (`all-menus-model.ts`),
// the device tabs, the Device menu and the search over them, a card's
// Devices menu, and the ask that opens the menu editor on one menu.

import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import type { HassLike, OwnerSummary, WatchPagesPlaces } from "../src/ha-api.js";
import "../src/watch-menus/all-menus.js";
import {
  ALL_MENUS_LEAD,
  MENU_CARD_DIRTY_TEXT,
  MENU_CARD_ONLY_TEXT,
  type MenuCard,
  allMenusLead,
  menuCardDetail,
  menuCardGroup,
  menuCardPlaces,
  menuCardSource,
  menuCards,
  menuFilterChips,
  menuKindOptions,
  menusEmptyText,
  openMenuCopy,
  shownMenuCards,
} from "../src/watch-menus/all-menus-model.js";
import { askWatchMenu, dropAllWatchMenus, takeWatchMenuAsk, takeWatchMenusRecord } from "../src/watch-menus/draft.js";
import {
  MENU_DEVICES_SWITCHER_TEXT,
  MENU_DEVICES_WAIT_TEXT,
  MENU_LINKS_UPDATE_TEXT,
  MENU_PHRASE_GAP_TEXT,
} from "../src/watch-menus/menu-links.js";
import { shownMenu, showMenuSettings, selectedMenuSlot } from "../src/watch-menus/menu-view.js";
import type { MenusDocument } from "../src/watch-menus/model.js";
import { ALL_FILTER } from "../src/watch-pages/all-pages-model.js";
import { NO_ICONS } from "../src/watch-pages/editor-host.js";
import type { LinkDevice } from "../src/watch-pages/links.js";

const DEFAULTS = JSON.parse(readFileSync(join(__dirname, "fixtures-menus", "01-defaults.json"), "utf8")) as MenusDocument;

const WATCH = "watch-a";
const PHONE = "phone-a";
const OTHER = "watch-b";
const DEVICES: LinkDevice[] = [
  { ownerId: WATCH, name: "Jesse's Watch", kind: "watch" },
  { ownerId: PHONE, name: "Jesse's iPhone", kind: "iphone" },
  { ownerId: OTHER, name: "Chen's Watch", kind: "watch" },
];
const ANY_LINK = "a".repeat(32);
const ENTITY_LINK = "b".repeat(32);

/** The defaults with `linkIds`. */
function linked(links: Record<string, string>): MenusDocument {
  return { ...structuredClone(DEFAULTS), linkIds: links };
}

/** The defaults with `n` Anywhere slots, and a Speak phrase slot or a page
 * slot when asked. */
function anywhereWith(n: number, extra: Record<string, unknown>[] = []): MenusDocument {
  const doc = structuredClone(DEFAULTS);
  const qa = doc.quickAction as { slots: unknown[] };
  qa.slots = [...qa.slots.slice(0, n), ...extra];
  return doc;
}

const PAGE = "5A17E000-0000-4000-8000-000000000001";

describe("the Menus tab's cards", () => {
  it("draws two cards per device, the Anywhere menu first, in device order", () => {
    const cards = menuCards(DEVICES, new Map([[WATCH, DEFAULTS], [OTHER, DEFAULTS]]));
    expect(cards.map((c) => [c.name, c.copies.map((x) => x.device.ownerId)])).toEqual([
      ["Anywhere menu", [WATCH]],
      ["Entity quick menu", [WATCH]],
      ["Anywhere menu", [OTHER]],
      ["Entity quick menu", [OTHER]],
    ]);
    // A device with no menus saved (the iPhone here) brings nothing.
    expect(cards.some((c) => c.copies.some((x) => x.device.ownerId === PHONE))).toBe(false);
  });

  it("makes a linked menu one card with a copy per device, the rest one each", () => {
    const docs = new Map<string, MenusDocument>([
      [WATCH, linked({ anywhere: ANY_LINK, entity: ENTITY_LINK })],
      [PHONE, linked({ anywhere: ANY_LINK })],
      [OTHER, linked({ entity: ENTITY_LINK })],
    ]);
    const cards = menuCards(DEVICES, docs);
    expect(cards.map((c) => [c.key, c.copies.map((x) => x.device.ownerId)])).toEqual([
      [`menu-link:anywhere:${ANY_LINK}`, [WATCH, PHONE]],
      [`menu-link:entity:${ENTITY_LINK}`, [WATCH, OTHER]],
      [`menu:${PHONE}:entity`, [PHONE]],
      [`menu:${OTHER}:anywhere`, [OTHER]],
    ]);
    expect(cards[0]!.linkId).toBe(ANY_LINK);
    expect(cards[2]!.linkId).toBeUndefined();
  });

  it("keeps a link id per unit: the same id on two units is two cards", () => {
    const docs = new Map<string, MenusDocument>([[WATCH, linked({ anywhere: ANY_LINK, entity: ANY_LINK })]]);
    expect(menuCards(DEVICES, docs).map((c) => c.unit)).toEqual(["anywhere", "entity"]);
  });

  it("counts a card's slots as the editor's Menus row does", () => {
    const cards = menuCards(DEVICES, new Map([[WATCH, anywhereWith(3)]]));
    expect(menuCardDetail(cards[0]!)).toBe("3 slots");
    expect(menuCardDetail(menuCards(DEVICES, new Map([[WATCH, anywhereWith(1)]]))[0]!)).toBe("1 slot");
    // The Entity quick menu as it first opens: the Light menu.
    expect(menuCardDetail(cards[1]!)).toBe("5 slots");
  });

  it("says how many menus there are and what a shared one is", () => {
    expect(allMenusLead(4)).toBe(`4 menus on your watches and iPhones. ${ALL_MENUS_LEAD}`);
    expect(allMenusLead(1)).toContain("1 menu on");
    expect(ALL_MENUS_LEAD).toContain("The page switcher goes with the Anywhere menu.");
  });
});

describe("the Menus tab's tabs, Device menu and search", () => {
  const docs = new Map<string, MenusDocument>([
    [WATCH, linked({ anywhere: ANY_LINK })],
    [PHONE, linked({ anywhere: ANY_LINK })],
    [OTHER, DEFAULTS],
  ]);
  const cards = menuCards(DEVICES, docs);

  it("gives All and a tab per device, each with its count", () => {
    const chips = menuFilterChips(DEVICES, cards, (id) => (id === WATCH ? "#f00" : undefined));
    expect(chips.map((c) => [c.label, c.count])).toEqual([["All", 5], ["Jesse's Watch", 2], ["Jesse's iPhone", 2], ["Chen's Watch", 2]]);
    expect(chips[1]!.color).toBe("#f00");
    expect(chips[2]!.color).toBeUndefined();
  });

  it("shows a device's menus on its tab, and the Device menu's kind", () => {
    expect(shownMenuCards(cards, PHONE).map((c) => c.key)).toEqual([`menu-link:anywhere:${ANY_LINK}`, `menu:${PHONE}:entity`]);
    expect(shownMenuCards(cards, ALL_FILTER, "", "iphone")).toHaveLength(2);
    expect(shownMenuCards(cards, ALL_FILTER, "", "watch")).toHaveLength(4);
    expect(menuKindOptions(cards).map((o) => [o.label, o.count])).toEqual([["All", 5], ["Watches", 4], ["iPhones", 2]]);
  });

  it("searches the menu's name and the devices it is on, in any case", () => {
    expect(shownMenuCards(cards, ALL_FILTER, "anywhere").map((c) => c.unit)).toEqual(["anywhere", "anywhere"]);
    expect(shownMenuCards(cards, ALL_FILTER, "  CHEN ").map((c) => c.key)).toEqual([`menu:${OTHER}:anywhere`, `menu:${OTHER}:entity`]);
    expect(shownMenuCards(cards, OTHER, "quick").map((c) => c.key)).toEqual([`menu:${OTHER}:entity`]);
    expect(shownMenuCards(cards, ALL_FILTER, "garage")).toEqual([]);
  });

  it("opens the tab's device, else the Device menu's kind, else the first watch", () => {
    const shared = cards[0]!;
    expect(openMenuCopy(shared, PHONE).device.ownerId).toBe(PHONE);
    expect(openMenuCopy(shared, ALL_FILTER, "iphone").device.ownerId).toBe(PHONE);
    expect(openMenuCopy(shared, ALL_FILTER).device.ownerId).toBe(WATCH);
    const phoneFirst = menuCards([DEVICES[1]!, DEVICES[0]!], docs)[0]!;
    expect(openMenuCopy(phoneFirst, ALL_FILTER).device.ownerId).toBe(WATCH);
  });

  it("says what is missing when no card shows", () => {
    expect(menusEmptyText(ALL_FILTER, [], "")).toContain("Pair one on the Home tab.");
    expect(menusEmptyText(ALL_FILTER, DEVICES, "x")).toBe("No menu or device has that name.");
    expect(menusEmptyText(ALL_FILTER, DEVICES, "", "iphone")).toBe("No menu here is on an iPhone.");
    expect(menusEmptyText(PHONE, DEVICES, "")).toBe("No menus saved on Jesse's iPhone yet. Open its Menus to set them up.");
  });
});

describe("a Menus tab card's Devices menu", () => {
  const places: WatchPagesPlaces = { pages: {}, status_pages: {}, menus: { [ANY_LINK]: { unit: "anywhere", owners: [WATCH, OTHER] } } };

  it("is on where the menu is, and a menu on one device stays on there", () => {
    const docs = new Map<string, MenusDocument>([[WATCH, linked({ anywhere: ANY_LINK })], [OTHER, linked({ anywhere: ANY_LINK })], [PHONE, DEFAULTS]]);
    const [shared, , phoneAnywhere] = menuCards(DEVICES, docs);
    expect(menuCardPlaces(DEVICES, shared!, places).map((p) => [p.device.ownerId, p.on, p.stuck])).toEqual([
      [WATCH, true, undefined],
      [PHONE, false, undefined],
      [OTHER, true, undefined],
    ]);
    const alone = menuCardPlaces(DEVICES, phoneAnywhere!, places);
    expect(alone.find((p) => p.on)?.stuck).toBe(MENU_CARD_ONLY_TEXT);
    // No device is "this one" on the tab.
    expect(alone.every((p) => !p.here)).toBe(true);
  });

  it("greys every switch on an integration older than linked menus, and a waiting watch", () => {
    const card = menuCards(DEVICES, new Map([[WATCH, DEFAULTS]]))[0]!;
    expect(menuCardPlaces(DEVICES, card, { pages: {}, status_pages: {} }).every((p) => p.stuck === MENU_LINKS_UPDATE_TEXT)).toBe(true);
    const waiting = menuCardPlaces(DEVICES, card, places, new Set([OTHER]));
    expect(waiting.find((p) => p.device.ownerId === OTHER)).toMatchObject({ stuck: MENU_DEVICES_WAIT_TEXT, tag: "waiting for iPhone" });
  });

  it("carries the editor's lines: the switcher, what a link adds, the phrase gap", () => {
    const doc = anywhereWith(0, [
      { id: "00000000-0000-4000-8000-000000000001", position: "top", action: { type: "navigateToPage", pageId: PAGE } },
      { id: "00000000-0000-4000-8000-000000000002", position: "left", action: { type: "speakPhrase", phraseId: "p1" } },
    ]);
    const card = menuCards(DEVICES, new Map([[WATCH, doc]]))[0]!;
    const group = menuCardGroup({ card, devices: DEVICES, places, source: WATCH, pages: [{ id: PAGE, name: "Lights" }] });
    expect(group.head).toBe("The Anywhere menu is on");
    expect(group.lines).toEqual([MENU_DEVICES_SWITCHER_TEXT, "Also adds: Lights.", MENU_PHRASE_GAP_TEXT]);
    expect(group.linked).toBe(false);
    const entity = menuCardGroup({ card: menuCards(DEVICES, new Map([[WATCH, doc]]))[1]!, devices: DEVICES, places, pages: [] });
    expect(entity.lines).toEqual([]);
  });

  it("copies from a device whose editor has no edits, or from none", () => {
    const docs = new Map<string, MenusDocument>([[WATCH, linked({ anywhere: ANY_LINK })], [OTHER, linked({ anywhere: ANY_LINK })]]);
    const card = menuCards(DEVICES, docs)[0]!;
    expect(menuCardSource(card, () => false)).toBe(WATCH);
    expect(menuCardSource(card, (id) => id === WATCH)).toBe(OTHER);
    expect(menuCardSource(card, () => true)).toBeUndefined();
  });
});

// ── the element ─────────────────────────────────────────────────────────

const flat = (v: unknown): string => {
  if (Array.isArray(v)) return v.map(flat).join("");
  if (v !== null && typeof v === "object" && "strings" in v && "values" in v) {
    const r = v as { strings: readonly string[]; values: unknown[] };
    return r.strings.map((s, i) => s + (i < r.values.length ? flat(r.values[i]) : "")).join("");
  }
  return typeof v === "string" || typeof v === "number" || typeof v === "boolean" ? String(v) : "";
};

const OWNERS = [
  { owner_watch_id: WATCH, device_name: "Jesse's Watch", device_kind: "watch", paired_iphone_name: null },
  { owner_watch_id: OTHER, device_name: "Chen's Watch", device_kind: "watch", paired_iphone_name: null },
] as unknown as OwnerSummary[];

/** The tab's element with `docs` read and `send` as Home Assistant. */
function tab(docs: Map<string, MenusDocument>, send: (m: Record<string, unknown>) => Promise<unknown> = async () => ({})) {
  const Ctor = customElements.get("wa-all-menus") as unknown as new () => Record<string, unknown>;
  const el = new Ctor();
  el.hass = { user: { is_admin: true }, states: {}, connection: { sendMessagePromise: send, subscribeMessage: async () => async () => undefined } } as unknown as HassLike;
  el.owners = OWNERS;
  el.icons = NO_ICONS;
  el.ownersReady = true;
  el.docs = docs;
  el.places = { pages: {}, status_pages: {}, menus: {} } satisfies WatchPagesPlaces;
  el.readState = "ready";
  const opened: [string, string][] = [];
  el.onOpen = (ownerId: string, kind: string) => opened.push([ownerId, kind]);
  const cards = () => (Object.getOwnPropertyDescriptor(Object.getPrototypeOf(el), "cards")!.get as () => MenuCard[]).call(el);
  return { el, opened, cards, whole: () => flat((el.render as () => unknown).call(el)) };
}

describe("the Menus tab", () => {
  it("draws a card per menu with its count, its chips and Devices, and no Multi select or New", () => {
    const t = tab(new Map([[WATCH, linked({ anywhere: ANY_LINK })], [OTHER, linked({ anywhere: ANY_LINK })]]));
    const text = t.whole();
    expect(text).toContain("<h1>Menus</h1>");
    expect(text).toContain("3 menus on your watches and iPhones.");
    expect(text.split(`<b class="ap-name">Anywhere menu</b>`).length - 1).toBe(1);
    expect(text.split(`<b class="ap-name">Entity quick menu</b>`).length - 1).toBe(2);
    expect(text).toContain("8 slots");
    expect(text).toContain("menu=anywhere");
    expect(text).toContain("<span>Devices</span>");
    expect(text).not.toContain("Multi select");
    expect(text).not.toContain("New ");
    // The device tabs: All, then each device.
    expect(text).toContain(`<span class="pk-tab-name">All</span>`);
    expect(text).toContain(`<span class="pk-tab-name">Chen's Watch</span>`);
  });

  it("opens a card's menu in its device's editor, on that menu", () => {
    const t = tab(new Map([[WATCH, DEFAULTS], [OTHER, DEFAULTS]]));
    const entity = t.cards().find((c) => c.unit === "entity" && c.copies[0]!.device.ownerId === OTHER)!;
    (t.el.open as (c: MenuCard) => void).call(t.el, entity);
    expect(t.opened).toEqual([[OTHER, "watch"]]);
    expect(takeWatchMenuAsk(OTHER)).toBe("entity");
  });

  it("opens a card's Devices menu with the editor's lines and no Unlink this watch", () => {
    const t = tab(new Map([[WATCH, DEFAULTS], [OTHER, DEFAULTS]]));
    (t.el.openDevices as (c: MenuCard) => void).call(t.el, t.cards()[0]!);
    const text = t.whole();
    expect(text).toContain("The Anywhere menu is on");
    expect(text).toContain(MENU_DEVICES_SWITCHER_TEXT);
    expect(text).not.toContain("Unlink this");
    expect(text).not.toContain("The Entity quick menu is on");
  });

  /** A tab whose link is refused `unit_taken` until sent with replace. */
  function takenTab(theirs: MenusDocument) {
    const sent: Record<string, unknown>[] = [];
    const t = tab(new Map([[WATCH, DEFAULTS], [OTHER, theirs]]), async (m) => {
      sent.push(m);
      if (m.type === "wrist_assistant/watch_pages/link" && m.replace !== true) throw Object.assign(new Error("taken"), { code: "unit_taken" });
      if (m.type === "wrist_assistant/watch_pages/link") return { targets: { [OTHER]: { pages: [], status_pages: [], units: ["anywhere"] } }, link_ids: { anywhere: ANY_LINK } };
      if (m.type === "wrist_assistant/watch_pages/places") return { pages: {}, status_pages: {}, menus: {} };
      return { revision: 4, document: DEFAULTS };
    });
    const links = () => sent.filter((m) => m.type === "wrist_assistant/watch_pages/link").map((m) => m.replace);
    return { t, links };
  }

  it("replaces a menu the other device never edited without asking", async () => {
    const { t, links } = takenTab(DEFAULTS);
    await (t.el.link as (s: string, u: string, g: string) => Promise<void>).call(t.el, WATCH, "anywhere", OTHER);
    expect(links()).toEqual([false, true]);
    expect(t.el.replaceAsk).toBeUndefined();
    expect((t.el.devicesNote as { text: string }).text).toBe("The Anywhere menu is on Chen's Watch now.");
  });

  it("asks in the menu before replacing a device's own menu", async () => {
    const { t, links } = takenTab(anywhereWith(2));
    (t.el.openDevices as (c: MenuCard) => void).call(t.el, t.cards()[0]!);
    await (t.el.link as (s: string, u: string, g: string) => Promise<void>).call(t.el, WATCH, "anywhere", OTHER);
    expect(links()).toEqual([false]);
    expect(t.el.replaceAsk).toEqual({ source: WATCH, unit: "anywhere", target: OTHER });
    const text = t.whole();
    expect(text).toContain("Replace the Anywhere menu on Chen's Watch?");
    expect(text).toContain("Its own is lost.");
    await (t.el.link as (s: string, u: string, g: string, r: boolean) => Promise<void>).call(t.el, WATCH, "anywhere", OTHER, true);
    expect(links()).toEqual([false, true]);
  });

  it("will not share a menu whose every copy has unsaved edits", () => {
    const t = tab(new Map([[WATCH, DEFAULTS], [OTHER, DEFAULTS]]));
    takeWatchMenusRecord(WATCH, DEFAULTS, 4).draft.apply(anywhereWith(1));
    const card = t.cards()[0]!;
    (t.el.openDevices as (c: MenuCard) => void).call(t.el, card);
    expect(t.whole()).toContain(MENU_CARD_DIRTY_TEXT);
    dropAllWatchMenus();
  });
});

describe("opening a card in the menu editor", () => {
  it("asks once per device, and a dropped draft set drops the ask", () => {
    askWatchMenu(WATCH, "entity");
    expect(takeWatchMenuAsk(WATCH)).toBe("entity");
    expect(takeWatchMenuAsk(WATCH)).toBeUndefined();
    askWatchMenu(OTHER, "anywhere");
    dropAllWatchMenus();
    expect(takeWatchMenuAsk(OTHER)).toBeUndefined();
  });

  it("shows the menu on its own settings, letting go of a picked slot", () => {
    const slotId = (DEFAULTS.quickAction as { slots: { id: string }[] }).slots[0]!.id;
    const uiState = new Map<string, unknown>([["me:menu", "switcher"], ["me:sel:anywhere", slotId], ["me:sel:domain:light", "x"], ["me:sw:page", PAGE]]);
    expect(selectedMenuSlot({ uiState, document: DEFAULTS }, { list: "anywhere" })).toBeDefined();
    const host = { uiState, requestUpdate: () => undefined };
    showMenuSettings(host, "anywhere");
    expect(shownMenu(host)).toBe("anywhere");
    expect(uiState.has("me:sw:page")).toBe(false);
    expect(uiState.has("me:sel:domain:light")).toBe(false);
    expect(selectedMenuSlot({ uiState, document: DEFAULTS }, { list: "anywhere" })).toBeUndefined();
  });
});
