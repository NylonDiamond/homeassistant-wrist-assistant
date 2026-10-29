// The map editor's Devices mode without any drawing (mock board 3): the
// home's devices as Home Assistant has them, where each lives, which are not
// on the map yet, the kinds the On the map card filters by, a device's
// state in a few words, the words and presets of the pin inspector, and
// picking several pins at once (what is picked, the values they share).
//
// A device is any entity Home Assistant shows: one hidden in its registry is
// left out (a disabled one has no state, so it never shows). Its area is its
// own, else its device's, as Home Assistant resolves it. The tray of devices
// not on the map lists only the kinds that belong on a plan (lights,
// switches, climate, sensors, media, locks, covers, cameras, ...), with an
// area and no entity category, so it is not buried in diagnostics; the find
// box searches every entity.

import type { HassLike } from "../ha-api.js";
import type { HomeMapSelection } from "./editor-mode.js";
import { type HomeMapDocument, type HomeMapFloor, type HomeMapPin, type HomeMapPinTap, type HomeMapStates, sameHomeMapId } from "./model.js";

/** The data type a device carries while dragged from the rail. */
export const HOME_MAP_DEVICE_DRAG_TYPE = "application/x-wa-home-map-entity";

/** The data type a light carries beside it while dragged from the rail, so
 * the plan can tell a light is coming before the drop (a drag's data is
 * read only on the drop): a lamp that holds nothing lights up under it. */
export const HOME_MAP_LIGHT_DRAG_TYPE = "application/x-wa-home-map-light";

/** One of the home's devices. */
export interface HomeMapDeviceEntry {
  entityId: string;
  /** Its friendly name, else its id. */
  name: string;
  domain: string;
  areaId?: string | undefined;
  areaName?: string | undefined;
  deviceClass?: string | undefined;
  /** Diagnostic and configuration entities, left out of the tray. */
  category?: string | undefined;
}

/** The kinds of entity the tray offers. */
export const HOME_MAP_TRAY_DOMAINS: ReadonlySet<string> = new Set([
  "light", "switch", "fan", "climate", "humidifier", "water_heater", "sensor", "binary_sensor", "media_player",
  "lock", "cover", "valve", "camera", "vacuum", "alarm_control_panel", "siren", "input_boolean", "remote",
]);

/** An entity's area id: its own, else its device's, as Home Assistant
 * resolves it. Undefined without the registries or an area. */
export function homeMapEntityAreaId(hass: Pick<HassLike, "entities" | "devices"> | undefined, entityId: string): string | undefined {
  const reg = hass?.entities?.[entityId];
  if (reg === undefined) return undefined;
  if (typeof reg.area_id === "string" && reg.area_id !== "") return reg.area_id;
  const device = reg.device_id ? hass?.devices?.[reg.device_id] : undefined;
  return typeof device?.area_id === "string" && device.area_id !== "" ? device.area_id : undefined;
}

/** Every device Home Assistant shows, by name: hidden ones left out. */
export function homeMapDevices(hass: Pick<HassLike, "states" | "entities" | "devices" | "areas"> | undefined): HomeMapDeviceEntry[] {
  const out: HomeMapDeviceEntry[] = [];
  for (const [entityId, entity] of Object.entries(hass?.states ?? {})) {
    const reg = hass?.entities?.[entityId];
    if (reg?.hidden === true) continue;
    const friendly = entity?.attributes?.friendly_name;
    const areaId = homeMapEntityAreaId(hass, entityId);
    const areaName = areaId === undefined ? undefined : hass?.areas?.[areaId]?.name?.trim() || areaId;
    const deviceClass = entity?.attributes?.device_class;
    out.push({
      entityId,
      name: typeof friendly === "string" && friendly.trim() !== "" ? friendly.trim() : entityId,
      domain: entityId.slice(0, entityId.indexOf(".")),
      areaId,
      areaName,
      deviceClass: typeof deviceClass === "string" ? deviceClass : undefined,
      category: typeof reg?.entity_category === "string" ? reg.entity_category : undefined,
    });
  }
  return out.sort((a, b) => a.name.localeCompare(b.name) || a.entityId.localeCompare(b.entityId));
}

/** The entities with a pin on any floor of the map. */
export function homeMapEntitiesOnMap(doc: HomeMapDocument): Set<string> {
  return new Set(doc.floors.flatMap((f) => f.pins.map((p) => p.entityId)));
}

/** One area's devices not on the map. `here`: a room of the floor shown is
 * that area. */
export interface HomeMapTrayGroup {
  areaId: string;
  name: string;
  here: boolean;
  devices: HomeMapDeviceEntry[];
}

/**
 * Not on the map: the devices of the kinds the tray offers, with an area and
 * no entity category, that no floor has a pin for, grouped by area. The
 * areas of the floor's rooms come first, in the rooms' order, then the rest
 * by name.
 */
export function homeMapTray(doc: HomeMapDocument, floor: HomeMapFloor, devices: readonly HomeMapDeviceEntry[]): HomeMapTrayGroup[] {
  const onMap = homeMapEntitiesOnMap(doc);
  const groups = new Map<string, HomeMapTrayGroup>();
  for (const d of devices) {
    if (onMap.has(d.entityId) || d.areaId === undefined || d.category !== undefined || !HOME_MAP_TRAY_DOMAINS.has(d.domain)) continue;
    let group = groups.get(d.areaId);
    if (group === undefined) groups.set(d.areaId, (group = { areaId: d.areaId, name: d.areaName ?? d.areaId, here: false, devices: [] }));
    group.devices.push(d);
  }
  const roomOrder = floor.rooms.map((r) => r.areaId).filter((a): a is string => a !== undefined);
  for (const g of groups.values()) g.here = roomOrder.includes(g.areaId);
  return [...groups.values()].sort((a, b) => {
    const ia = roomOrder.indexOf(a.areaId);
    const ib = roomOrder.indexOf(b.areaId);
    if (ia >= 0 || ib >= 0) return (ia < 0 ? Infinity : ia) - (ib < 0 ? Infinity : ib);
    return a.name.localeCompare(b.name);
  });
}

/** How many of the tray's devices Place all by area would place on this
 * floor: those whose area is a room's here. */
export function homeMapPlaceableCount(floor: HomeMapFloor, groups: readonly HomeMapTrayGroup[]): number {
  const areas = new Set(floor.rooms.map((r) => r.areaId).filter((a) => a !== undefined));
  return groups.filter((g) => areas.has(g.areaId)).reduce((n, g) => n + g.devices.length, 0);
}

/** The devices whose name, id or area holds every word typed, the best
 * first: a name starting with the words, then any. */
export function homeMapFindDevices(devices: readonly HomeMapDeviceEntry[], query: string, limit = 40): HomeMapDeviceEntry[] {
  const words = query.toLowerCase().split(/\s+/).filter((w) => w !== "");
  if (words.length === 0) return [];
  const text = (d: HomeMapDeviceEntry) => `${d.name} ${d.entityId} ${d.areaName ?? ""}`.toLowerCase();
  const found = devices.filter((d) => words.every((w) => text(d).includes(w)));
  const lead = query.trim().toLowerCase();
  return found.sort((a, b) => Number(!a.name.toLowerCase().startsWith(lead)) - Number(!b.name.toLowerCase().startsWith(lead))).slice(0, limit);
}

// ── kinds ────────────────────────────────────────────────────────────────

/** The kinds the On the map card filters pins by. */
export type HomeMapDeviceKind = "lights" | "climate" | "sensors" | "power" | "media" | "security" | "covers" | "other";

export const HOME_MAP_DEVICE_KINDS: readonly [HomeMapDeviceKind, string][] = [
  ["lights", "Lights"],
  ["climate", "Climate"],
  ["sensors", "Sensors"],
  ["power", "Power"],
  ["media", "Media"],
  ["security", "Security"],
  ["covers", "Covers"],
  ["other", "Other"],
];

/** The kind an entity is filtered as, by its domain. */
export function homeMapDeviceKind(entityId: string): HomeMapDeviceKind {
  switch (entityId.slice(0, entityId.indexOf("."))) {
    case "light": return "lights";
    case "climate": case "fan": case "humidifier": case "water_heater": return "climate";
    case "sensor": case "binary_sensor": return "sensors";
    case "switch": case "input_boolean": return "power";
    case "media_player": case "remote": return "media";
    case "lock": case "camera": case "alarm_control_panel": case "siren": return "security";
    case "cover": case "valve": return "covers";
    default: return "other";
  }
}

/** The floor's pins counted by kind, the kinds it has in the card's order. */
export function homeMapKindCounts(floor: HomeMapFloor): { kind: HomeMapDeviceKind; label: string; count: number }[] {
  const counts = new Map<HomeMapDeviceKind, number>();
  for (const pin of floor.pins) {
    const kind = homeMapDeviceKind(pin.entityId);
    counts.set(kind, (counts.get(kind) ?? 0) + 1);
  }
  return HOME_MAP_DEVICE_KINDS.filter(([k]) => counts.has(k)).map(([kind, label]) => ({ kind, label, count: counts.get(kind)! }));
}

// ── words ────────────────────────────────────────────────────────────────

/** A domain in words: "binary sensor", "media player". */
export function homeMapDomainWords(domain: string): string {
  return domain.replace(/_/g, " ");
}

/** What a device is doing, in a few words: "on · 80%" for a light with its
 * brightness, a sensor's value with its unit, a thermostat's room
 * temperature, otherwise its state; "gone" for an entity the home lacks. */
export function homeMapStateText(entityId: string, states: HomeMapStates | undefined): string {
  const entity = states?.[entityId];
  if (entity === undefined) return "gone";
  const state = String(entity.state ?? "");
  const domain = entityId.slice(0, entityId.indexOf("."));
  const attrs = entity.attributes ?? {};
  if (domain === "light" && state === "on" && typeof attrs.brightness === "number") return `on · ${Math.round((attrs.brightness / 255) * 100)}%`;
  if (domain === "climate" && typeof attrs.current_temperature === "number") return `${state} · ${attrs.current_temperature}°`;
  const unit = typeof attrs.unit_of_measurement === "string" ? attrs.unit_of_measurement : "";
  if (unit !== "" && state !== "" && Number.isFinite(Number(state))) return `${state} ${unit}`.replace(" °", "°").replace(" %", "%");
  return state.replace(/_/g, " ");
}

/** Whether Turn on or off works on a device: one Home Assistant's toggle
 * takes. */
export function homeMapCanToggle(entityId: string): boolean {
  return ["light", "switch", "fan", "input_boolean", "media_player", "cover", "humidifier", "siren"].includes(entityId.slice(0, entityId.indexOf(".")));
}

/** What the pill's toggle says for a device's state now. */
export function homeMapToggleWords(entityId: string, states: HomeMapStates | undefined): string {
  const state = String(states?.[entityId]?.state ?? "");
  if (entityId.startsWith("cover.")) return state === "open" || state === "opening" ? "Close" : "Open";
  return state === "on" || state === "playing" || state === "paused" || state === "idle" ? "Turn off" : "Turn on";
}

/** The height presets under the Height slider. */
export const HOME_MAP_HEIGHT_PRESETS: readonly [string, number][] = [
  ["Floor", 0.3],
  ["Table", 0.8],
  ["Wall", 1.6],
  ["Ceiling", 2.5],
];

/** Tap on the map's choices; absent is the tile's own tap. */
export const HOME_MAP_TAP_CHOICES: readonly [HomeMapPinTap | undefined, string][] = [
  [undefined, "As the tile does"],
  ["toggle", "Turn on or off"],
  ["details", "Show details"],
  ["page", "Open a page"],
  ["none", "Nothing"],
];

/** The floor a pin of an entity is on, and the pin, when the map has one. */
export function homeMapPinOfEntity(doc: HomeMapDocument, entityId: string): { floorId: string; pinId: string } | undefined {
  for (const f of doc.floors) {
    const pin = f.pins.find((p) => p.entityId === entityId);
    if (pin !== undefined) return { floorId: f.id, pinId: pin.id };
  }
  return undefined;
}

/** The room of the floor a device's area is, if any. */
export function homeMapRoomOfArea(floor: HomeMapFloor, areaId: string | undefined): HomeMapFloor["rooms"][number] | undefined {
  return areaId === undefined ? undefined : floor.rooms.find((r) => r.areaId !== undefined && r.areaId === areaId);
}

// ── picking several devices ──────────────────────────────────────────────
//
// A plain click picks one pin; Shift, Cmd or Ctrl and a click adds a pin to
// the pick or takes it out, and Shift and a drag over empty space adds every
// pin inside the box. One pin picked is the selection `pin`, two or more
// `pins`, in the order they were picked.

/** The ids of the pins a selection picks, in the order picked: none, one,
 * or several. */
export function homeMapPickedPins(sel: HomeMapSelection | undefined): string[] {
  if (sel?.kind === "pin") return [sel.pinId];
  if (sel?.kind === "pins") return sel.pinIds.slice();
  return [];
}

/** The selection that picks these pins, each once: none, `pin` for one,
 * `pins` for several. */
export function homeMapPickOf(pinIds: readonly string[]): HomeMapSelection | undefined {
  const ids: string[] = [];
  for (const id of pinIds) if (!ids.some((x) => sameHomeMapId(x, id))) ids.push(id);
  if (ids.length === 0) return undefined;
  return ids.length === 1 ? { kind: "pin", pinId: ids[0]! } : { kind: "pins", pinIds: ids };
}

/** Shift and a click on a pin: the pick with the pin taken out when it was
 * in it, else added to it. Anything else picked (a room, a wall) gives way
 * to the pin alone. */
export function homeMapTogglePick(sel: HomeMapSelection | undefined, pinId: string): HomeMapSelection | undefined {
  const ids = homeMapPickedPins(sel);
  return ids.some((x) => sameHomeMapId(x, pinId)) ? homeMapPickOf(ids.filter((x) => !sameHomeMapId(x, pinId))) : homeMapPickOf([...ids, pinId]);
}

/** The pick with these pins added, the ones picked already kept first. */
export function homeMapAddPicks(sel: HomeMapSelection | undefined, pinIds: readonly string[]): HomeMapSelection | undefined {
  return homeMapPickOf([...homeMapPickedPins(sel), ...pinIds]);
}

/** The pins standing inside the box with corners `a` and `b` on the plan
 * (either way round), edges included. */
export function homeMapPinsInBox(pins: readonly HomeMapPin[], a: readonly number[], b: readonly number[]): string[] {
  const [x0, x1] = [Math.min(a[0]!, b[0]!), Math.max(a[0]!, b[0]!)];
  const [y0, y1] = [Math.min(a[1]!, b[1]!), Math.max(a[1]!, b[1]!)];
  return pins.filter((p) => p.at[0] >= x0 && p.at[0] <= x1 && p.at[1] >= y0 && p.at[1] <= y1).map((p) => p.id);
}

/** One value the picked pins share, or `mixed` when they differ. */
export type HomeMapShared<T> = { mixed: false; value: T } | { mixed: true };

/** Whether every value is the same (as JSON, so an absent key matches an
 * absent key); `mixed` for none. */
export function homeMapShared<T>(values: readonly T[]): HomeMapShared<T> {
  if (values.length === 0) return { mixed: true };
  const first = JSON.stringify(values[0]) ?? "undefined";
  return values.every((v) => (JSON.stringify(v) ?? "undefined") === first) ? { mixed: false, value: values[0]! } : { mixed: true };
}

/** The selection pill's Turn on or off for several devices, when every one
 * takes it: Turn off while any is on (Close while any cover is open, when
 * they are all covers), else Turn on, as Home Assistant's own turn_on and
 * turn_off, which open and close a cover. */
export function homeMapGroupToggle(entityIds: readonly string[], states: HomeMapStates | undefined): { words: string; service: "turn_on" | "turn_off" } | undefined {
  if (entityIds.length === 0 || !entityIds.every(homeMapCanToggle)) return undefined;
  const covers = entityIds.every((id) => id.startsWith("cover."));
  const anyOn = entityIds.some((id) => {
    const words = homeMapToggleWords(id, states);
    return words === "Turn off" || words === "Close";
  });
  if (covers) return anyOn ? { words: "Close", service: "turn_off" } : { words: "Open", service: "turn_on" };
  return anyOn ? { words: "Turn off", service: "turn_off" } : { words: "Turn on", service: "turn_on" };
}
