// A stand-in Home Assistant with the library, for the editors' tests: device
// records by `owner/kind` as `watch_config/get` and `watch_config/save` keep
// them, and the library commands worked the way the server works them. The
// summary is made from the records each time it is read (an item is a page
// any record lists, its owners every device whose record lists it), so a
// pick, a delete or a save shows in the next read as it does on the box.
// Every command sent is kept, to check what was asked and how.

import type { HassLike, WatchConfigRecord } from "../src/ha-api.js";
import type { LibraryMenuEntry, LibraryOwnerPicks, LibrarySummary, MenuUnit } from "../src/library/client.js";
import type { JsonObject } from "../src/watch-pages/model.js";

/** One library menu as the stand-in holds it: which device uses it for its
 * unit is in `owners`. Its slots are read from the first owner's record. */
export interface HeldMenu {
  name: string;
  kind: MenuUnit;
  owners: string[];
}

export interface LibraryHomeOptions {
  /** The library's menus, by id. */
  menus?: Record<string, HeldMenu>;
  /** Pages the library holds that no device picks. */
  unpicked?: Record<string, JsonObject>;
  /** The complications on each device (`/list`). */
  complications?: Record<string, JsonObject[]>;
  /** Earlier saves (`watch_config/history_entry`), by `owner/kind/revision`. */
  history?: Record<string, JsonObject>;
  /** No library: an integration older than it (`unknown_command`). */
  noLibrary?: boolean;
}

const LIST_KEYS = { pages: "pages", status_pages: "statusPages" } as const;
const UNIT_KEYS: Record<MenuUnit, readonly string[]> = { anywhere: ["quickAction", "pageSwitcher"], entity: ["entityRadial"] };

/** A page as the library holds it: no Hide here, no link key. */
function item(page: JsonObject): JsonObject {
  const { isHidden: _h, linkId: _l, ...rest } = page;
  return rest;
}

export function libraryHome(records: Record<string, unknown>, options: LibraryHomeOptions = {}) {
  const held = new Map<string, { revision: number; document: unknown }>();
  for (const [at, document] of Object.entries(records)) held.set(at, { revision: 4, document });
  const menus = structuredClone(options.menus ?? {});
  const unpicked = new Map(Object.entries(options.unpicked ?? {}));
  const sent: JsonObject[] = [];

  const listOf = (owner: string, kind: "pages" | "status_pages"): JsonObject[] => {
    const doc = held.get(`${owner}/${kind}`)?.document as JsonObject | undefined;
    const list = doc?.[LIST_KEYS[kind]];
    return Array.isArray(list) ? (list as JsonObject[]) : [];
  };
  const putList = (owner: string, kind: "pages" | "status_pages", list: JsonObject[]) => {
    const now = held.get(`${owner}/${kind}`);
    const doc = (now?.document as JsonObject | undefined) ?? { schemaVersion: 1 };
    held.set(`${owner}/${kind}`, { revision: (now?.revision ?? 0) + 1, document: { ...doc, [LIST_KEYS[kind]]: list } });
  };
  const owners = (): string[] => [...new Set([...held.keys()].map((at) => at.split("/")[0]!))].sort();

  const summary = (): LibrarySummary => {
    const out: LibrarySummary = { pages: {}, status_pages: {}, menus: {}, picks: {} };
    for (const [id, page] of unpicked) out.pages[id] = { item: page, owners: [] };
    for (const owner of owners()) {
      const picks: LibraryOwnerPicks = {};
      for (const kind of ["pages", "status_pages"] as const) {
        const record = held.get(`${owner}/${kind}`);
        if (record === undefined || record.revision <= 0) continue;
        const list = listOf(owner, kind);
        if (kind === "pages") {
          picks.pages = list.map((p) => (p.isSystemPage === true ? { id: p.id as string, page: p } : { id: p.id as string, ...(p.isHidden === true ? { isHidden: true } : {}) }));
        } else {
          picks.status_pages = list.map((p) => ({ id: p.id as string }));
        }
        for (const p of list) {
          if (p.isSystemPage === true) continue;
          const entry = (out[kind][p.id as string] ??= { item: item(p), owners: [] });
          entry.owners.push(owner);
        }
      }
      for (const [id, menu] of Object.entries(menus)) {
        if (!menu.owners.includes(owner)) continue;
        (picks.menus ??= {})[menu.kind] = id;
      }
      if (Object.keys(picks).length > 0) out.picks[owner] = picks;
    }
    for (const [id, menu] of Object.entries(menus)) {
      const first = menu.owners[0] === undefined ? undefined : held.get(`${menu.owners[0]}/menus`)?.document as JsonObject | undefined;
      const sections = Object.fromEntries(UNIT_KEYS[menu.kind].flatMap((k) => (first?.[k] === undefined ? [] : [[k, first[k]]])));
      out.menus[id] = { name: menu.name, kind: menu.kind, sections, owners: [...menu.owners].sort() } satisfies LibraryMenuEntry;
    }
    return out;
  };

  const record = (at: string): WatchConfigRecord => {
    const r = held.get(at) ?? { revision: 0, document: null };
    return { kind: at.split("/")[1]!, revision: r.revision, hash: null, updated_at: null, updated_by: "panel", delivered_revision: 0, delivered_at: null, document: r.document } as WatchConfigRecord;
  };

  const pick = (msg: JsonObject): unknown => {
    const owner = msg.owner_id as string;
    const kind = msg.kind as "pages" | "status_pages" | "menus";
    const id = msg.item_id as string;
    if (kind === "menus") {
      const menu = menus[id];
      if (menu === undefined) throw { code: "not_found", message: "no such menu" };
      for (const other of Object.values(menus)) if (other.kind === menu.kind) other.owners = other.owners.filter((o) => o !== owner);
      menu.owners.push(owner);
      return { revisions: {} };
    }
    const entry = summary()[kind][id];
    if (entry === undefined) throw { code: "not_found", message: "no such item" };
    const list = listOf(owner, kind).filter((p) => p.id !== id);
    putList(owner, kind, msg.on === true ? [...list, structuredClone(entry.item)] : list);
    return { revisions: {} };
  };

  const remove = (msg: JsonObject): unknown => {
    const kind = msg.kind as "pages" | "status_pages" | "menus";
    const id = msg.item_id as string;
    if (kind === "menus") {
      if ((menus[id]?.owners.length ?? 0) > 0) throw { code: "in_use", message: "in use" };
      delete menus[id];
      return { revisions: {}, link_failures: [] };
    }
    unpicked.delete(id);
    for (const owner of owners()) {
      if (listOf(owner, kind).some((p) => p.id === id)) putList(owner, kind, listOf(owner, kind).filter((p) => p.id !== id));
    }
    return { revisions: {}, link_failures: [] };
  };

  let copies = 0;
  const answer = (msg: JsonObject): unknown => {
    const type = msg.type as string;
    const at = `${msg.owner_watch_id as string}/${msg.kind as string}`;
    if (type.endsWith("watch_config/get")) return record(at);
    if (type.endsWith("watch_config/history")) return { entries: [] };
    if (type.endsWith("watch_config/history_entry")) {
      const doc = options.history?.[`${at}/${msg.revision as number}`];
      if (doc === undefined) throw { code: "not_found", message: "no such save" };
      return { revision: msg.revision, hash: null, updated_at: null, updated_by: "panel", document: doc };
    }
    if (type.endsWith("watch_config/save")) {
      const now = held.get(at)?.revision ?? 0;
      if (msg.base_revision !== now) throw { code: "conflict", message: `stored revision is ${now}` };
      held.set(at, { revision: now + 1, document: msg.document });
      return { revision: now + 1 };
    }
    if (type.endsWith("/list")) return { records: (options.complications?.[msg.owner_watch_id as string] ?? []).map((document, i) => ({ id: `c${i}`, revision: 1, deleted: false, document })) };
    if (type.endsWith("/save_record") || type.endsWith("/save")) return { revision: 2 };
    if (options.noLibrary !== true) {
      if (type.endsWith("library/summary")) return summary();
      if (type.endsWith("library/pick")) return pick(msg);
      if (type.endsWith("library/delete")) return remove(msg);
      if (type.endsWith("library/menus/rename")) {
        const menu = menus[msg.item_id as string];
        if (menu === undefined) throw { code: "not_found", message: "no such menu" };
        menu.name = msg.name as string;
        return {};
      }
      if (type.endsWith("library/menus/copy")) {
        const owner = msg.owner_id as string;
        const unit = msg.unit as MenuUnit;
        const id = `COPY-${++copies}`;
        for (const menu of Object.values(menus)) if (menu.kind === unit) menu.owners = menu.owners.filter((o) => o !== owner);
        menus[id] = { name: msg.name as string, kind: unit, owners: [owner] };
        return { id, revisions: {} };
      }
    }
    throw { code: "unknown_command", message: type };
  };

  const hass = {
    user: { is_admin: true },
    states: {},
    connection: {
      sendMessagePromise: (msg: JsonObject) => {
        sent.push(msg);
        try {
          return Promise.resolve(answer(msg));
        } catch (err) {
          return Promise.reject(err);
        }
      },
      subscribeMessage: () => Promise.resolve(() => Promise.resolve()),
    },
  } as unknown as HassLike;

  /** The commands of one type sent so far (`library/pick`, say). */
  const of = (type: string): JsonObject[] => sent.filter((m) => (m.type as string).endsWith(type));
  return { hass, held, sent, menus, of, summary };
}

/** A Lit template flattened to its text, directives with their values. */
export function flat(v: unknown): string {
  if (Array.isArray(v)) return v.map(flat).join("");
  if (v !== null && typeof v === "object" && "strings" in v && "values" in v) {
    const r = v as { strings: readonly string[]; values: unknown[] };
    return r.strings.map((s, i) => s + (i < r.values.length ? flat(r.values[i]) : "")).join("");
  }
  if (v !== null && typeof v === "object" && "_$litDirective$" in v && "values" in v) {
    const [items, second, third] = (v as { values: unknown[] }).values;
    const draw = (third ?? second) as unknown;
    if (Array.isArray(items) && typeof draw === "function") return items.map((x, i) => flat((draw as (x: unknown, i: number) => unknown)(x, i))).join("");
    return flat(items);
  }
  return typeof v === "string" || typeof v === "number" || typeof v === "boolean" ? String(v) : "";
}

/** Start an editor's library, as connecting the element would, and wait for
 * its first read. */
export async function connectLibrary(el: Record<string, unknown>): Promise<void> {
  const lib = el.lib as { hostConnected(): void; store?: { refresh(): Promise<void> } };
  lib.hostConnected();
  await lib.store?.refresh();
}

/** Wait for the stand-in's answers to land. */
export const settle = () => new Promise((r) => setTimeout(r, 0));
