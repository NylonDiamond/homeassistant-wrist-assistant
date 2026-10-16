// The Pages tab's element against a stand-in Home Assistant: it reads every
// device's pages, draws a card per page with a chip per device, opens a page
// on its device, and its Devices menu links a page to another device or
// takes it off one.

import { describe, expect, it } from "vitest";

import type { HassLike, OwnerSummary } from "../src/ha-api.js";
import "../src/watch-pages/all-pages.js";
import { keptWatchPagesSelection } from "../src/watch-pages/kept.js";
import type { JsonObject, WatchPagesDocument } from "../src/watch-pages/model.js";
import { type PageCard, cardDevicePlaces } from "../src/watch-pages/all-pages-model.js";
import type { LinkDevice } from "../src/watch-pages/links.js";

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

function tab() {
  const n = ++made;
  const watch = `ap-w1-${n}`;
  const phone = `ap-p1-${n}`;
  const owners = [
    { owner_watch_id: watch, device_name: "Jesse's Watch", device_kind: "watch" },
    { owner_watch_id: phone, device_name: "Jesse's iPhone", device_kind: "iphone" },
  ] as unknown as OwnerSummary[];
  const held = new Map<string, { revision: number; document: JsonObject }>([
    [`${watch}/pages`, { revision: 3, document: { schemaVersion: 1, pages: [{ id: HALL, name: "Hall", linkId: "L1", items: [] }, { id: DEN, name: "Den", items: [] }] } }],
    [`${phone}/pages`, { revision: 2, document: { schemaVersion: 1, pages: [{ id: MINE, name: "Mine", items: [] }, { id: HALL, name: "Hall", linkId: "L1", isHidden: true, items: [] }] } }],
  ]);
  const sent: JsonObject[] = [];
  const pagesOf = (owner: string) => ((held.get(`${owner}/pages`)?.document.pages ?? []) as JsonObject[]);
  const put = (owner: string, pages: JsonObject[]) => {
    const now = held.get(`${owner}/pages`);
    held.set(`${owner}/pages`, { revision: (now?.revision ?? 0) + 1, document: { schemaVersion: 1, pages } });
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
          return Promise.resolve({ kind: msg.kind, revision: r.revision, document: r.document });
        }
        if (type.endsWith("watch_config/save")) {
          const now = held.get(at)?.revision ?? 0;
          if (msg.base_revision !== now) return Promise.reject({ code: "conflict", message: "conflict" });
          held.set(at, { revision: now + 1, document: msg.document as JsonObject });
          return Promise.resolve({ revision: now + 1 });
        }
        if (type.endsWith("watch_pages/places")) return Promise.resolve({ pages: {}, status_pages: {} });
        if (type.endsWith("watch_pages/link")) {
          const source = msg.source_id as string;
          const ids = msg.page_ids as string[];
          const from = pagesOf(source).map((p) => (ids.includes(p.id as string) ? { ...p, linkId: p.linkId ?? `L-${p.id as string}` } : p));
          put(source, from);
          for (const target of msg.targets as string[]) put(target, [...pagesOf(target), ...from.filter((p) => ids.includes(p.id as string))]);
          return Promise.resolve({ targets: Object.fromEntries((msg.targets as string[]).map((t) => [t, { pages: ids, status_pages: [] }])) });
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
  return { el, watch, phone, held, sent, call, cards, card, place, whole: () => flat(call("render")) };
}

describe("the Pages tab", () => {
  it("reads every device's pages and draws a card per page, a linked one once with a chip per device", async () => {
    const { call, cards, whole } = tab();
    await call<Promise<void>>("loadAll");
    expect(cards().map((c) => c.name)).toEqual(["Hall", "Den", "Mine"]);
    const text = whole();
    expect(text).toContain("Every page on your watches and iPhones.");
    expect(text).toMatch(/ap-name">Hall</);
    expect(text).toContain("<em>hidden</em>");
    expect(text).toMatch(/ap-chip-n">3</);
    expect(text).toContain("Devices");
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
      expect(text).toContain("ap-pick");
      expect(text).toContain("2 selected");
      expect(text).toContain("Add to…");
      expect(text).toContain("Remove from…");
      expect(text).toContain("Delete…");
      expect(text).not.toContain("Pick the devices this page is on");
      call("onKeyDown", { key: "Escape", preventDefault: () => undefined });
      expect(el.selecting).toBe(false);
      expect((el.selected as Set<string>).size).toBe(0);
      expect(whole()).not.toContain("ap-bar");
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
      call("tickDevice", phone, true);
      await call<Promise<void>>("runBulk", "add");
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
      call("tickDevice", phone, true);
      await call<Promise<void>>("runBulk", "remove");
      expect(sent.some((m) => (m.type as string).endsWith("watch_config/save"))).toBe(false);
      expect((el.bulkNote as { text: string }).text).toBe("Kept Mine: it would be left on no device. Use Delete for those.");
    });
  });
});
