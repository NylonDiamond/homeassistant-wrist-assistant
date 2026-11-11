// Devices first (app repo docs/home_map_plan_2026-10.md, "Devices first
// (2026-11-10)"): which devices wait in a room for a pin, and the checklist
// "Finish your map". The iPhone runs the same rule and says the same words
// (`HomeMapWaiting` and `HomeMapChecklist` there); a change here is a change
// there too.
//
// The rule. `domain` is the entity id's text before the dot.
//
// - Main devices: a domain of `HOME_MAP_MAIN_DOMAINS`, no entity category,
//   not hidden.
// - Switch devices: a domain of `HOME_MAP_SWITCH_DOMAINS`, no entity
//   category, not hidden.
// - Every other entity is neither, and is found only by search.
// - A device waits in a room when it is main or switch, its area is the
//   room's area, and no pin on any floor of the map is for it. Two rooms of
//   one area both list it.
// - A room's wait count is its waiting main devices, its more count its
//   waiting switch devices. Main come first in the domain order, then
//   switch in theirs; inside one domain by name ignoring case, then by id.
// - The map's totals: placed is the number of entity ids with a pin on any
//   floor, waiting the number of main devices that wait in any room of any
//   floor.
//
// The checklist has three steps, Rooms, Devices and On a page, each done or
// not, the first one not done the active one. The whole card goes once all
// three are done.

import type { HomeMapDocument, HomeMapRoom } from "./model.js";

/** The main devices' domains, in the order a room lists them. */
export const HOME_MAP_MAIN_DOMAINS: readonly string[] = [
  "light", "cover", "fan", "climate", "media_player", "lock", "vacuum", "humidifier", "water_heater", "alarm_control_panel", "valve",
];

/** The switch devices' domains, in the order a room lists them, after the
 * main ones. */
export const HOME_MAP_SWITCH_DOMAINS: readonly string[] = ["switch", "input_boolean", "camera", "siren", "remote"];

/** One entity as the rule reads it. A reader that has no category or no
 * hidden flag leaves them out: none and not hidden. */
export interface HomeMapWaitEntity {
  entityId: string;
  name: string;
  areaId?: string | undefined;
  category?: string | null | undefined;
  hidden?: boolean | undefined;
}

/** An entity's domain: its id's text before the dot. */
function domainOf(entityId: string): string {
  const dot = entityId.indexOf(".");
  return dot < 0 ? entityId : entityId.slice(0, dot);
}

/** Whether an entity is a main device, a switch device, or neither. */
export function homeMapWaitKind(e: HomeMapWaitEntity): "main" | "switch" | undefined {
  if ((e.category !== undefined && e.category !== null && e.category !== "") || e.hidden === true) return undefined;
  const domain = domainOf(e.entityId);
  if (HOME_MAP_MAIN_DOMAINS.includes(domain)) return "main";
  if (HOME_MAP_SWITCH_DOMAINS.includes(domain)) return "switch";
  return undefined;
}

/** The entity ids with a pin on any floor of the map. */
export function homeMapPlacedIds(doc: Pick<HomeMapDocument, "floors"> | null | undefined): Set<string> {
  return new Set((doc?.floors ?? []).flatMap((f) => f.pins.map((p) => p.entityId)));
}

/** Where a domain stands in the list: main first, then switch. */
function domainRank(entityId: string): number {
  const domain = domainOf(entityId);
  const main = HOME_MAP_MAIN_DOMAINS.indexOf(domain);
  return main >= 0 ? main : HOME_MAP_MAIN_DOMAINS.length + HOME_MAP_SWITCH_DOMAINS.indexOf(domain);
}

/** Main before switch in the domain order, then by name ignoring case, then
 * by entity id. */
export function homeMapWaitOrder(a: HomeMapWaitEntity, b: HomeMapWaitEntity): number {
  const rank = domainRank(a.entityId) - domainRank(b.entityId);
  if (rank !== 0) return rank;
  const an = a.name.toLowerCase();
  const bn = b.name.toLowerCase();
  if (an !== bn) return an < bn ? -1 : 1;
  return a.entityId < b.entityId ? -1 : a.entityId > b.entityId ? 1 : 0;
}

/** A room's waiting devices: `main` (the wait count) and `more` (the
 * switches and the rest of the more count), each in the room's order. */
export interface HomeMapRoomWaiting<E extends HomeMapWaitEntity = HomeMapWaitEntity> {
  main: E[];
  more: E[];
}

/** The devices that wait in a room. A room with no area waits for none. */
export function homeMapRoomWaiting<E extends HomeMapWaitEntity>(
  room: Pick<HomeMapRoom, "areaId">,
  entities: readonly E[],
  doc: Pick<HomeMapDocument, "floors"> | null | undefined,
  placed: ReadonlySet<string> = homeMapPlacedIds(doc),
): HomeMapRoomWaiting<E> {
  const main: E[] = [];
  const more: E[] = [];
  const area = room.areaId;
  if (area === undefined || area === "") return { main, more };
  for (const e of entities) {
    if (e.areaId !== area || placed.has(e.entityId)) continue;
    const kind = homeMapWaitKind(e);
    if (kind === "main") main.push(e);
    else if (kind === "switch") more.push(e);
  }
  main.sort(homeMapWaitOrder);
  more.sort(homeMapWaitOrder);
  return { main, more };
}

/** The map's totals: every room on every floor, the entity ids with a pin,
 * and the main devices that wait in any room. */
export interface HomeMapWaitTotals {
  rooms: number;
  placed: number;
  waiting: number;
}

export function homeMapWaitTotals(doc: Pick<HomeMapDocument, "floors"> | null | undefined, entities: readonly HomeMapWaitEntity[]): HomeMapWaitTotals {
  const placed = homeMapPlacedIds(doc);
  const floors = doc?.floors ?? [];
  const areas = new Set(floors.flatMap((f) => f.rooms.map((r) => r.areaId)).filter((a): a is string => a !== undefined && a !== ""));
  const waiting = new Set<string>();
  for (const e of entities) {
    if (e.areaId !== undefined && areas.has(e.areaId) && !placed.has(e.entityId) && homeMapWaitKind(e) === "main") waiting.add(e.entityId);
  }
  return { rooms: floors.reduce((n, f) => n + f.rooms.length, 0), placed: placed.size, waiting: waiting.size };
}

// ── the checklist ────────────────────────────────────────────────────────

/** One step of "Finish your map". `id` is 1, 2 or 3. */
export interface HomeMapChecklistStep {
  id: 1 | 2 | 3;
  title: string;
  words: string;
  done: boolean;
}

/** The checklist's header. */
export const HOME_MAP_CHECKLIST_TITLE = "Finish your map";

/** "2 of 3 done". */
export function homeMapChecklistDoneWords(steps: readonly HomeMapChecklistStep[]): string {
  return `${steps.filter((s) => s.done).length} of ${steps.length} done`;
}

const count = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

/** The Devices step's words. */
export function homeMapDevicesStepWords(placed: number, waiting: number): string {
  if (placed === 0) return waiting > 0 ? `${count(waiting, "device waits", "devices wait")} in your rooms.` : "Put your lights and devices on the map.";
  return waiting > 0 ? `${placed} on the map. ${count(waiting, "more waits", "more wait")}.` : `${placed} on the map.`;
}

/** The three steps, with their words: Rooms (done with any room), Devices
 * (done with any pin) and On a page (done when a page holds a Home map
 * tile). */
export function homeMapChecklist(totals: HomeMapWaitTotals, onAPage: boolean): HomeMapChecklistStep[] {
  return [
    { id: 1, title: "Rooms", words: `${count(totals.rooms, "room", "rooms")}.`, done: totals.rooms > 0 },
    { id: 2, title: "Devices", words: homeMapDevicesStepWords(totals.placed, totals.waiting), done: totals.placed > 0 },
    { id: 3, title: "On a page", words: onAPage ? "On a page." : "Put the map on a page to use it each day.", done: onAPage },
  ];
}

/** The step to do now: the first not done, none when all are. */
export function homeMapChecklistActive(steps: readonly HomeMapChecklistStep[]): HomeMapChecklistStep | undefined {
  return steps.find((s) => !s.done);
}

/** A room's wait count on the plan beside its name: "Bedroom · 5 wait",
 * "stairs · 1 waits"; the name alone with none waiting. */
export function homeMapWaitLabel(name: string, wait: number): string {
  return wait > 0 ? `${name} · ${homeMapWaitWords(wait)}` : name;
}

/** "1 waits", "4 wait": a room's wait count in words. */
export function homeMapWaitWords(wait: number): string {
  return count(wait, "waits", "wait");
}

/** A room's line in the Rooms card, from its pins on the map and its
 * waiting devices. */
export function homeMapRoomCardWords(o: { hasArea: boolean; onMap: number; wait: number; more: number }): string {
  if (o.onMap > 0 && o.wait > 0) return `${o.onMap} on the map · ${homeMapWaitWords(o.wait)}`;
  if (o.onMap > 0) return `${o.onMap} on the map`;
  if (o.wait > 0) return homeMapWaitWords(o.wait);
  if (!o.hasArea) return "No area";
  if (o.more > 0) return homeMapMoreWords(o.more);
  return "No devices in its area";
}

/** The tray's last row: "9 switches and more". */
export function homeMapMoreWords(more: number): string {
  return `${count(more, "switch", "switches")} and more`;
}
