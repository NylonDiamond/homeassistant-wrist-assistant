// A stand-in Home Assistant for the Pages, Status pages and Menus tabs: the
// library summary of `library-fixture.ts`, the picks and menu ops on it, each
// device's records as Home Assistant materialises them (no link marks), and
// each device's complications.

import type { HassLike, OwnerSummary } from "../src/ha-api.js";
import type { LibrarySummary, MenuUnit } from "../src/library/client.js";
import type { JsonObject } from "../src/watch-pages/model.js";
import { CHEN, JESSE, PAGE1, PHONE, summary } from "./library-fixture.js";

export type Msg = Record<string, unknown>;

export interface HeldRecord {
  revision: number;
  document: JsonObject;
  multiple_pages?: boolean;
}

let made = 0;

/** The flat text of a Lit template, for matching. */
export const flat = (v: unknown): string => {
  if (Array.isArray(v)) return v.map(flat).join("");
  if (v !== null && typeof v === "object" && "strings" in v && "values" in v) {
    const r = v as { strings: readonly string[]; values: unknown[] };
    return r.strings.map((s, i) => s + (i < r.values.length ? flat(r.values[i]) : "")).join("");
  }
  if (v !== null && typeof v === "object" && "_$litDirective$" in v && "values" in v) return flat((v as { values: unknown[] }).values[0]);
  return typeof v === "string" || typeof v === "number" || typeof v === "boolean" ? String(v) : "";
};

/** The fixture's three devices as the panel lists them. */
export const OWNERS = [
  { owner_watch_id: CHEN, device_name: "Chen Watch", device_kind: "watch" },
  { owner_watch_id: JESSE, device_name: "Jesse Apple Watch", device_kind: "watch" },
  { owner_watch_id: PHONE, device_name: "iPhone 15 Pro", device_kind: "iphone", phone_pages: true },
] as unknown as OwnerSummary[];

const up = (id: string) => id.toUpperCase();

export function fakeHome(admin = true) {
  // A connection of its own, so each test has its own library store.
  const n = ++made;
  const lib: LibrarySummary = summary();
  const held = new Map<string, HeldRecord>();
  const complications = new Map<string, { id: string; revision: number; document: JsonObject; deleted?: boolean }[]>();
  const sent: Msg[] = [];
  const refuse = new Map<string, { code: string; message: string }>();

  /** A device's records, materialised from the library as Home Assistant
   * does: the picked items in the device's order, with its Hide here. */
  const materialise = (owner: string) => {
    const picks = lib.picks[owner];
    if (picks?.pages !== undefined) {
      const pages = picks.pages.map((p) => {
        if (p.page !== undefined) return p.page;
        const entry = Object.entries(lib.pages).find(([id]) => up(id) === up(p.id))?.[1];
        const item: JsonObject = { ...(entry?.item ?? { id: p.id }) };
        if (p.isHidden === true) item.isHidden = true;
        return item;
      });
      const now = held.get(`${owner}/pages`);
      held.set(`${owner}/pages`, { ...now, revision: (now?.revision ?? 0) + 1, document: { schemaVersion: 1, pages } });
    }
    if (picks?.status_pages !== undefined) {
      const statusPages = picks.status_pages.map((p) => ({ ...(lib.status_pages[p.id]?.item ?? { id: p.id }) }));
      const now = held.get(`${owner}/status_pages`);
      held.set(`${owner}/status_pages`, { revision: (now?.revision ?? 0) + 1, document: { schemaVersion: 1, statusPages } });
    }
    if (picks?.menus !== undefined) {
      const doc: JsonObject = { schemaVersion: 1 };
      for (const id of Object.values(picks.menus)) {
        const menu = lib.menus[id!];
        if (menu === undefined) continue;
        Object.assign(doc, structuredClone(menu.sections));
      }
      const now = held.get(`${owner}/menus`);
      held.set(`${owner}/menus`, { revision: (now?.revision ?? 0) + 1, document: doc });
    }
  };
  for (const owner of Object.keys(lib.picks)) materialise(owner);

  const sortOwners = (owners: string[]) => [...new Set(owners)].sort();

  const reply = (msg: Msg): unknown => {
    const type = msg.type as string;
    const why = refuse.get(type);
    if (why !== undefined) throw why;
    if (type === "wrist_assistant/library/summary") return structuredClone(lib);
    if (type === "wrist_assistant/library/pick") {
      const owner = msg.owner_id as string;
      const kind = msg.kind as "pages" | "status_pages" | "menus";
      const id = msg.item_id as string;
      if ("id" in msg) throw { code: "invalid_format", message: "extra keys not allowed @ data['id']" };
      const picks = (lib.picks[owner] ??= {});
      if (kind === "menus") {
        const unit = msg.unit as MenuUnit;
        const old = picks.menus?.[unit];
        if (old !== undefined) lib.menus[old]!.owners = lib.menus[old]!.owners.filter((o) => o !== owner);
        lib.menus[id]!.owners = sortOwners([...lib.menus[id]!.owners, owner]);
        picks.menus = { ...picks.menus, [unit]: id };
        for (const o of Object.keys(lib.picks)) materialise(o);
        return { revisions: { [owner]: { menus: held.get(`${owner}/menus`)!.revision } } };
      }
      const entry = Object.entries(lib[kind]).find(([k]) => up(k) === up(id));
      if (entry === undefined) throw { code: "not_found", message: "no such item" };
      const list = (picks[kind] ??= []) as { id: string; isHidden?: boolean }[];
      if (msg.on === true) {
        entry[1].owners = sortOwners([...entry[1].owners, owner]);
        if (!list.some((p) => up(p.id) === up(id))) list.push({ id: entry[0] });
      } else {
        entry[1].owners = entry[1].owners.filter((o) => o !== owner);
        picks[kind] = list.filter((p) => up(p.id) !== up(id)) as never;
      }
      for (const o of Object.keys(lib.picks)) materialise(o);
      return { revisions: {} };
    }
    if (type === "wrist_assistant/library/menus/copy") {
      const owner = msg.owner_id as string;
      const unit = msg.unit as MenuUnit;
      const from = lib.picks[owner]?.menus?.[unit];
      if (from === undefined) throw { code: "not_found", message: "no menu" };
      const id = `DDDD0000-0000-4000-8000-${String(n).padStart(6, "0")}${String(Object.keys(lib.menus).length).padStart(6, "0")}`;
      lib.menus[from]!.owners = lib.menus[from]!.owners.filter((o) => o !== owner);
      lib.menus[id] = { name: (msg.name as string).trim(), kind: unit, sections: structuredClone(lib.menus[from]!.sections), owners: [owner] };
      lib.picks[owner]!.menus = { ...lib.picks[owner]!.menus, [unit]: id };
      for (const o of Object.keys(lib.picks)) materialise(o);
      return { id, revisions: { [owner]: { menus: held.get(`${owner}/menus`)!.revision } } };
    }
    if (type === "wrist_assistant/library/menus/create") {
      // Administrators only, as Home Assistant's `require_admin`.
      if (!admin) throw { code: "unauthorized", message: "Unauthorized" };
      const unit = msg.unit as MenuUnit;
      const name = (msg.name as string).trim();
      const sections = msg.sections as JsonObject;
      const keys = unit === "entity" ? ["entityRadial"] : unit === "anywhere" ? ["pageSwitcher", "quickAction"] : undefined;
      if (keys === undefined || name === "" || Object.keys(sections).sort().join() !== keys.join()) throw { code: "invalid", message: "invalid menu" };
      const id = `EEEE0000-0000-4000-8000-${String(n).padStart(6, "0")}${String(Object.keys(lib.menus).length).padStart(6, "0")}`;
      lib.menus[id] = { name, kind: unit, sections: structuredClone(sections), owners: [] };
      return { id, revisions: {} };
    }
    if (type === "wrist_assistant/library/menus/delete" || (type === "wrist_assistant/library/delete" && msg.kind === "menus")) {
      const id = msg.item_id as string;
      if ((lib.menus[id]?.owners.length ?? 0) > 0) throw { code: "in_use", message: "in use" };
      delete lib.menus[id];
      return { revisions: {}, link_failures: [] };
    }
    if (type === "wrist_assistant/library/delete") {
      const kind = msg.kind as "pages" | "status_pages";
      const id = msg.item_id as string;
      const key = Object.keys(lib[kind]).find((k) => up(k) === up(id));
      if (key === undefined) throw { code: "not_found", message: "no such item" };
      delete lib[kind][key];
      for (const picks of Object.values(lib.picks)) {
        const list = picks[kind] as { id: string }[] | undefined;
        if (list !== undefined) picks[kind] = list.filter((p) => up(p.id) !== up(id)) as never;
      }
      for (const o of Object.keys(lib.picks)) materialise(o);
      return { revisions: {}, link_failures: [] };
    }
    if (type === "wrist_assistant/watch_config/get") {
      const r = held.get(`${msg.owner_watch_id as string}/${msg.kind as string}`) ?? { revision: 0, document: null };
      return { kind: msg.kind, revision: r.revision, document: r.document, multiple_pages: "multiple_pages" in r ? r.multiple_pages : null };
    }
    if (type === "wrist_assistant/watch_config/save") {
      const at = `${msg.owner_watch_id as string}/${msg.kind as string}`;
      const now = held.get(at);
      if (msg.base_revision !== (now?.revision ?? 0)) throw { code: "conflict", message: "conflict" };
      held.set(at, { ...now, revision: (now?.revision ?? 0) + 1, document: msg.document as JsonObject });
      return { revision: (now?.revision ?? 0) + 1 };
    }
    if (type === "wrist_assistant/complications/list") return { records: complications.get(msg.owner_watch_id as string) ?? [] };
    if (type === "wrist_assistant/complications/save") {
      const list = complications.get(msg.owner_watch_id as string) ?? [];
      const doc = msg.document as JsonObject;
      const at = list.findIndex((r) => r.id === doc.id);
      if (at >= 0) list[at] = { ...list[at]!, revision: list[at]!.revision + 1, document: doc };
      return { revision: 1 };
    }
    throw { code: "unknown_command", message: type };
  };

  const hass = {
    states: {},
    user: { is_admin: admin },
    connection: {
      n,
      sendMessagePromise: (msg: Msg) => {
        sent.push(msg);
        try {
          return Promise.resolve(reply(msg));
        } catch (err) {
          return Promise.reject(err);
        }
      },
      subscribeMessage: () => Promise.resolve(() => Promise.resolve()),
    },
  } as unknown as HassLike;

  return { hass, lib, held, complications, sent, refuse, materialise, PAGE1 };
}

/** Let every promise in flight settle. */
export async function settle(times = 6): Promise<void> {
  for (let i = 0; i < times; i++) await new Promise((r) => setTimeout(r, 0));
}

/** One of the tab elements, stood up without a page: its library hooked to
 * the fake home, its private parts reachable by name. */
export function standUp(tag: "wa-all-pages" | "wa-all-menus", home: ReturnType<typeof fakeHome>, props: Record<string, unknown> = {}) {
  const Ctor = customElements.get(tag) as unknown as new () => Record<string, unknown>;
  const el = new Ctor();
  el.hass = home.hass;
  el.owners = OWNERS;
  el.phones = true;
  el.ownersReady = true;
  el.renderRoot = { querySelector: () => null };
  Object.assign(el, props);
  const call = <T>(name: string, ...args: unknown[]): T => (el[name] as (...a: unknown[]) => T).apply(el, args);
  const lib = el.lib as { hostConnected(): void; store?: { refresh(): Promise<void> } };
  lib.hostConnected();
  return {
    el,
    call,
    lib,
    whole: () => flat(call("render")),
    ready: async () => {
      await lib.store?.refresh();
      await settle();
    },
  };
}
