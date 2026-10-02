// The made-up home the page editor harness hands the element, beyond the
// states its fixtures name: Home Assistant's entity, device and area
// registries, a few more entities the entity picker should meet (a TV whose
// remote sits on the same device, sensors of several device classes), and a
// stand-in for the panel's symbol provider.
//
// The registries are shaped as Home Assistant's frontend keeps them on
// `hass` (`entities` is the display registry, `devices` and `areas` the
// full entries), and they never change while the harness runs: the frontend
// keeps the same objects across state changes, so the element sees a new
// `hass` with the same three registries on every tick.
//
// The stand-in provider knows a few dozen real SF Symbol names and draws each
// as a simple mark (a circle, a square, bars...), the same for a name every
// time. Its names arrive a moment after the element is mounted, the way the
// panel's symbol file does, so the element's redraw on `iconsTick` is
// exercised.

import { svg, type TemplateResult } from "lit";
import type { HassEntityState } from "../src/ha-api.js";
import type { IconProvider } from "../src/renderer.js";
import { CURATED_SYMBOLS } from "../src/symbols.js";

const AT = "2026-10-01T08:00:00.000Z";

function state(entityId: string, value: string, attributes: Record<string, unknown>): HassEntityState {
  return { entity_id: entityId, state: value, attributes, last_changed: AT, last_updated: AT };
}

/** Entities no page fixture names, so the entity picker has a TV with its
 * remote on one device and sensors of several classes to offer. A state the
 * fixtures already gave is not replaced. */
export const EXTRA_STATES: readonly HassEntityState[] = [
  state("media_player.living_room_tv", "on", { friendly_name: "Living Room TV", device_class: "tv", source: "HDMI 1", volume_level: 0.2 }),
  state("remote.living_room_tv", "on", { friendly_name: "Living Room TV Remote", activity_list: ["Watch TV", "Play Games"], current_activity: "Watch TV" }),
  state("sensor.living_room_humidity", "47", { friendly_name: "Living Room Humidity", device_class: "humidity", unit_of_measurement: "%", state_class: "measurement" }),
  state("sensor.office_co2", "612", { friendly_name: "Office CO2", device_class: "carbon_dioxide", unit_of_measurement: "ppm", state_class: "measurement" }),
  state("sensor.office_illuminance", "320", { friendly_name: "Office Illuminance", device_class: "illuminance", unit_of_measurement: "lx", state_class: "measurement" }),
  state("sensor.house_energy", "1834.2", { friendly_name: "House Energy", device_class: "energy", unit_of_measurement: "kWh", state_class: "total_increasing" }),
  state("sensor.washer_power", "412", { friendly_name: "Washer Power", device_class: "power", unit_of_measurement: "W", state_class: "measurement" }),
  state("sensor.outdoor_pm25", "8", { friendly_name: "Outdoor PM2.5", device_class: "pm25", unit_of_measurement: "µg/m³", state_class: "measurement" }),
  state("sensor.garage_door_last_opened", "2026-10-01T07:12:00+00:00", { friendly_name: "Garage Door Last Opened", device_class: "timestamp" }),
  state("binary_sensor.hallway_motion", "off", { friendly_name: "Hallway Motion", device_class: "motion" }),
  state("binary_sensor.kitchen_window", "on", { friendly_name: "Kitchen Window", device_class: "window" }),
  state("calendar.holidays", "off", { friendly_name: "Holidays", message: "Half term" }),
  state("camera.driveway", "streaming", { friendly_name: "Driveway", entity_picture: "" }),
];

interface Area {
  area_id: string;
  name: string;
  floor_id: string | null;
  icon: string | null;
  picture: string | null;
  aliases: string[];
  labels: string[];
  humidity_entity_id: string | null;
  temperature_entity_id: string | null;
  created_at: number;
  modified_at: number;
}

interface Device {
  id: string;
  name: string;
  name_by_user: string | null;
  area_id: string | null;
  manufacturer: string | null;
  model: string | null;
  model_id: string | null;
  sw_version: string | null;
  hw_version: string | null;
  serial_number: string | null;
  config_entries: string[];
  primary_config_entry: string | null;
  connections: [string, string][];
  identifiers: [string, string][];
  via_device_id: string | null;
  entry_type: "service" | null;
  disabled_by: string | null;
  configuration_url: string | null;
  labels: string[];
  created_at: number;
  modified_at: number;
}

/** The frontend's display entry for an entity (`hass.entities`). */
interface EntityEntry {
  entity_id: string;
  name?: string | null;
  icon?: string;
  device_id?: string;
  area_id?: string;
  labels: string[];
  hidden?: boolean;
  entity_category?: "config" | "diagnostic";
  translation_key?: string;
  platform?: string;
  display_precision?: number;
}

const AREAS: [string, string, string | null][] = [
  ["living_room", "Living Room", "ground"],
  ["kitchen", "Kitchen", "ground"],
  ["hallway", "Hallway", "ground"],
  ["entrance", "Entrance", "ground"],
  ["garage", "Garage", "ground"],
  ["office", "Office", "first"],
  ["bedroom", "Bedroom", "first"],
  ["nursery", "Nursery", "first"],
  ["garden", "Garden", null],
];

/** Devices and the entities on them. An entity on a device takes its area
 * from the device, as in Home Assistant, unless the entity has its own. */
const DEVICES: { id: string; name: string; area: string | null; maker: string; model: string; entities: string[] }[] = [
  { id: "dev_living_room_tv", name: "Living Room TV", area: "living_room", maker: "LG", model: "OLED55C3",
    entities: ["media_player.living_room_tv", "remote.living_room_tv"] },
  { id: "dev_living_room_speaker", name: "Living Room Speaker", area: "living_room", maker: "Sonos", model: "One",
    entities: ["media_player.living_room", "number.speaker_volume"] },
  { id: "dev_kitchen_speaker", name: "Kitchen Speaker", area: "kitchen", maker: "Sonos", model: "Era 100", entities: ["media_player.kitchen"] },
  { id: "dev_living_room_climate", name: "Living Room Sensor", area: "living_room", maker: "Aqara", model: "TH-S02D",
    entities: ["sensor.living_room_temperature", "sensor.living_room_humidity"] },
  { id: "dev_doorbell", name: "Doorbell", area: "entrance", maker: "Reolink", model: "Video Doorbell PoE",
    entities: ["camera.front_door", "event.doorbell", "button.doorbell_chime", "image.doorbell_snapshot"] },
  { id: "dev_front_door_lock", name: "Front Door Lock", area: "entrance", maker: "Nuki", model: "Smart Lock Pro", entities: ["lock.front_door"] },
  { id: "dev_vacuum", name: "Downstairs Vacuum", area: "hallway", maker: "Roborock", model: "S8",
    entities: ["vacuum.downstairs", "sensor.downstairs_battery", "select.downstairs_cleaning_mode", "select.downstairs_mop_level", "select.downstairs_suction", "switch.downstairs_auto_empty"] },
  { id: "dev_mower", name: "Backyard Mower", area: "garden", maker: "Husqvarna", model: "Automower 430X", entities: ["lawn_mower.backyard", "sensor.backyard_mower_battery"] },
  { id: "dev_hallway_motion", name: "Hallway Motion Sensor", area: "hallway", maker: "Philips", model: "Hue motion sensor",
    entities: ["binary_sensor.hallway_motion", "sensor.hallway_motion_battery"] },
  { id: "dev_office_air", name: "Office Air Monitor", area: "office", maker: "Airthings", model: "View Plus", entities: ["sensor.office_co2", "sensor.office_illuminance"] },
  { id: "dev_energy", name: "Energy Meter", area: "garage", maker: "Shelly", model: "Pro 3EM", entities: ["sensor.house_energy", "sensor.washer_power"] },
  { id: "dev_garage_door", name: "Garage Door", area: "garage", maker: "Meross", model: "MSG100", entities: ["cover.garage_door", "sensor.garage_door_last_opened"] },
  { id: "dev_alex_phone", name: "Alex's iPhone", area: null, maker: "Apple", model: "iPhone 17 Pro", entities: ["device_tracker.alex_phone", "sensor.alex_room"] },
  { id: "dev_router", name: "Router", area: "office", maker: "Ubiquiti", model: "Dream Router", entities: ["update.router_firmware"] },
];

/** An entity with no device: its own area when its id names a room. */
function areaInName(objectId: string): string | undefined {
  if (objectId.includes("backyard") || objectId.includes("garden")) return "garden";
  if (objectId.includes("front_door")) return "entrance";
  return AREAS.find(([id]) => objectId.includes(id))?.[0];
}

export interface HomeRegistries {
  entities: Record<string, EntityEntry>;
  devices: Record<string, Device>;
  areas: Record<string, Area>;
}

/** The three registries for these states: every state has an entity entry,
 * every device and area named is in its registry. */
export function homeRegistries(states: Record<string, HassEntityState>): HomeRegistries {
  const areas: Record<string, Area> = {};
  for (const [id, name, floor] of AREAS) {
    areas[id] = {
      area_id: id, name, floor_id: floor, icon: null, picture: null, aliases: [], labels: [],
      humidity_entity_id: id === "living_room" ? "sensor.living_room_humidity" : null,
      temperature_entity_id: id === "living_room" ? "sensor.living_room_temperature" : null,
      created_at: 0, modified_at: 0,
    };
  }
  const devices: Record<string, Device> = {};
  const deviceOf = new Map<string, string>();
  for (const d of DEVICES) {
    devices[d.id] = {
      id: d.id, name: d.name, name_by_user: null, area_id: d.area, manufacturer: d.maker, model: d.model, model_id: null,
      sw_version: "1.0", hw_version: null, serial_number: null, config_entries: [`entry_${d.id}`], primary_config_entry: `entry_${d.id}`,
      connections: [], identifiers: [["harness", d.id]], via_device_id: null, entry_type: null, disabled_by: null,
      configuration_url: null, labels: [], created_at: 0, modified_at: 0,
    };
    for (const e of d.entities) deviceOf.set(e, d.id);
  }
  const entities: Record<string, EntityEntry> = {};
  for (const entityId of Object.keys(states).sort()) {
    const [domain, objectId] = entityId.split(".") as [string, string];
    const device = deviceOf.get(entityId);
    const entry: EntityEntry = { entity_id: entityId, labels: [], platform: `harness_${domain}` };
    if (device !== undefined) {
      entry.device_id = device;
    } else {
      const area = areaInName(objectId);
      if (area !== undefined) entry.area_id = area;
    }
    if (domain === "sensor" && entityId.endsWith("_battery")) entry.entity_category = "diagnostic";
    if (domain === "select" || domain === "number") entry.entity_category = "config";
    entities[entityId] = entry;
  }
  return { entities, devices, areas };
}

// ── the symbol provider ──────────────────────────────────────────────────

/** Eight plain marks on a 24 point square, one picked per name. */
const MARKS = [
  "M12 4a8 8 0 1 1 0 16a8 8 0 1 1 0-16Z",
  "M5 5h14v14H5Z",
  "M12 3.5l8.5 16H3.5Z",
  "M12 2.5l9.5 9.5-9.5 9.5-9.5-9.5Z",
  "M3.5 14h4.5v6.5H3.5Z M9.75 9h4.5v11.5h-4.5Z M16 3.5h4.5v17H16Z",
  "M9.5 3.5h5v6h6v5h-6v6h-5v-6h-6v-5h6Z",
  "M4 6h16v3H4Z M4 10.5h16v3H4Z M4 15h16v3H4Z",
  "M12 3l2.6 5.9 6.4.6-4.9 4.2 1.5 6.3L12 16.8 6.4 20l1.5-6.3L3 9.5l6.4-.6Z",
];

function markFor(name: string): string {
  let h = 0;
  for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return MARKS[h % MARKS.length]!;
}

/**
 * A stand-in for the panel's symbol provider. It knows the first few dozen
 * names of the picker's catalogue and the names given (the fixtures' tile
 * icons), all real SF Symbols. Until `arrive()` it knows none, as the panel's
 * provider before its file is in.
 */
export class StandInIcons implements IconProvider {
  private known: Set<string> | undefined;
  private readonly list: string[];

  constructor(names: Iterable<string>) {
    this.list = [...new Set([...CURATED_SYMBOLS.slice(0, 40), ...names])].sort();
  }

  /** The names are in: from now on everything known draws. */
  arrive(): void {
    this.known = new Set(this.list);
  }

  available(): boolean {
    return true;
  }

  names(): string[] | undefined {
    return this.known === undefined ? undefined : [...this.list];
  }

  render(symbol: string, size: number, colorHex: string): TemplateResult | undefined {
    const name = symbol.trim();
    if (this.known === undefined || !this.known.has(name)) return undefined;
    const color = /^#[0-9a-f]{6}/i.exec(colorHex)?.[0] ?? "#FFFFFF";
    return svg`<svg x="0" y="0" width=${size} height=${size} viewBox="0 0 24 24">
      <path d=${markFor(name)} fill=${color} /></svg>`;
  }
}
