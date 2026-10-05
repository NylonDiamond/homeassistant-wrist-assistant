// The Control Center editor's views, flattened to text: the route and the
// top bar's button, the list card, the watch preview drawn from the states,
// the inspector, and Add from an area.

import { describe, expect, it } from "vitest";

import type { HassLike, OwnerSummary } from "../src/ha-api.js";
import { SymbolBrowser } from "../src/symbols.js";
import {
  WATCH_CONTROL_CENTER_PATH,
  isWatchControlCenterRoute,
  renderWatchControlCenterButton,
  watchControlCenterRouteOwner,
  watchControlCenterUrl,
} from "../src/watch-control-center/hook.js";
import { type ControlCenterDocument, controlCenterEntries } from "../src/watch-control-center/model.js";
import {
  type ControlCenterViewHost,
  addControlCenterEntities,
  controlCenterAreaEntities,
  controlCenterAreas,
  controlCenterStageFacts,
  deselectControlCenter,
  openControlCenterAdd,
  renderControlCenterInspector,
  renderControlCenterScreen,
  renderEntriesCard,
  selectControlCenterEntry,
  selectedControlCenterEntry,
} from "../src/watch-control-center/view.js";

const flat = (v: unknown): string => {
  if (Array.isArray(v)) return v.map(flat).join("");
  if (v !== null && typeof v === "object" && "strings" in v && "values" in v) {
    const r = v as { strings: readonly string[]; values: unknown[] };
    return r.strings.map((s, i) => s + (i < r.values.length ? flat(r.values[i]) : "")).join("");
  }
  return typeof v === "string" || typeof v === "number" || typeof v === "boolean" ? String(v) : "";
};

const NO_ICONS = { render: () => undefined, available: () => false, names: () => [] } as unknown as ControlCenterViewHost["icons"];

const DOC: ControlCenterDocument = {
  schemaVersion: 1,
  entities: [
    { displayName: "Kitchen", domain: "light", entityId: "light.kitchen", iconName: "lightbulb", tintColorHex: "#FBBF24" },
    { displayName: "Porch", domain: "light", entityId: "light.porch", iconName: "lightbulb", isHidden: true },
    { customDisplayName: "Door", displayName: "Front Door", domain: "lock", entityId: "lock.front_door", iconName: "lock" },
    { displayName: "Movie", domain: "scene", entityId: "scene.movie", iconName: "play" },
    { displayName: "Outside", domain: "sensor", entityId: "sensor.outside", iconName: "circle" },
  ],
};

const HASS = {
  states: {
    "light.kitchen": { state: "on", attributes: { friendly_name: "Kitchen" } },
    "light.porch": { state: "off", attributes: {} },
    "lock.front_door": { state: "unlocked", attributes: {} },
    "light.lounge": { state: "off", attributes: { friendly_name: "Lounge Lamp" } },
    "switch.lounge_fan": { state: "off", attributes: { friendly_name: "Lounge Fan" } },
    "sensor.lounge_temp": { state: "20", attributes: {} },
    "script.lounge_movie": { state: "off", attributes: { friendly_name: "Movie Time" } },
  },
  areas: { lounge: { name: "Lounge" }, attic: { name: "Attic" } },
  devices: { d1: { area_id: "lounge" } },
  entities: {
    "light.lounge": { area_id: "lounge" },
    "switch.lounge_fan": { device_id: "d1" },
    "sensor.lounge_temp": { area_id: "lounge" },
    "script.lounge_movie": { area_id: "lounge" },
    "light.kitchen": { area_id: "lounge" },
  },
  user: { is_admin: true },
} as unknown as HassLike;

function host(document: ControlCenterDocument = DOC): ControlCenterViewHost & { edits: number } {
  const h = {
    hass: HASS,
    icons: NO_ICONS,
    symbols: new SymbolBrowser(() => undefined),
    document,
    busy: false,
    uiState: new Map<string, unknown>(),
    screen: { width: 208, height: 248 },
    scale: 1,
    edits: 0,
    edit(change: (d: ControlCenterDocument) => ControlCenterDocument) {
      const next = change(h.document);
      if (next === h.document) return false;
      h.document = next;
      h.edits++;
      return true;
    },
    endCoalesce() {},
    requestUpdate() {},
  };
  return h;
}

describe("the route and the button", () => {
  it("answers to /control-center and names the watch", () => {
    const route = (path: string) => ({ prefix: "/wrist-assistant", path });
    expect(isWatchControlCenterRoute(route(WATCH_CONTROL_CENTER_PATH))).toBe(true);
    expect(isWatchControlCenterRoute(route("/control-center/abc"))).toBe(true);
    expect(isWatchControlCenterRoute(route("/control-centers"))).toBe(false);
    expect(watchControlCenterRouteOwner(route("/control-center/w%201"))).toBe("w 1");
    expect(watchControlCenterRouteOwner(route("/control-center"))).toBeUndefined();
    expect(watchControlCenterUrl(route(""), true)).toBe("/wrist-assistant/control-center");
    expect(watchControlCenterUrl(undefined, false, "/wrist-assistant/control-center/x")).toBe("/wrist-assistant");
  });

  it("shows the button to an administrator with a watch", () => {
    const owners = [{ owner_watch_id: "w1", kind: "watch" }] as unknown as OwnerSummary[];
    expect(flat(renderWatchControlCenterButton(HASS, owners, () => undefined))).toContain("Control Center");
    expect(flat(renderWatchControlCenterButton({ ...HASS, user: { is_admin: false } }, owners, () => undefined))).toBe("");
  });
});

describe("the list card", () => {
  it("lists every entry, hidden ones dimmed, other domains marked", () => {
    const text = flat(renderEntriesCard(host()));
    expect(text).toContain("5 entities");
    expect(text).toContain("Door");
    expect(text).toContain("light.porch · Toggle");
    expect(text).toContain("scene.movie · Action");
    expect(text).toContain("sensor.outside · Not shown on the watch");
    expect(text.match(/cc-entry-row  dim/g)?.length).toBe(2);
  });
});

describe("the watch preview", () => {
  it("draws toggles then actions, leaving out hidden entries and other domains", () => {
    const text = flat(renderControlCenterScreen(host()));
    expect(text).toContain("Toggle");
    expect(text).toContain("Action");
    expect(text).toContain("Kitchen, on");
    expect(text).toContain("Door, on");
    expect(text).toContain("Movie, action");
    expect(text).not.toContain("Porch");
    expect(text).not.toContain("Outside");
    expect(text).toContain("background:#FBBF24");
    expect(controlCenterStageFacts(host())).toEqual(["5 entities, 1 hidden, 1 not shown"]);
  });

  it("says when there is nothing to draw", () => {
    expect(flat(renderControlCenterScreen(host({ schemaVersion: 1, entities: [] })))).toContain("Add entities");
  });
});

describe("the inspector", () => {
  it("edits a picked entry and resets it", () => {
    const h = host();
    selectControlCenterEntry(h, "lock.front_door");
    expect(selectedControlCenterEntry(h)?.entityId).toBe("lock.front_door");
    const text = flat(renderControlCenterInspector(h));
    expect(text).toContain("Reset to defaults");
    expect(text).toContain("Front Door");
    selectControlCenterEntry(h, "sensor.outside");
    expect(flat(renderControlCenterInspector(h))).toContain("Not shown on the watch");
    expect(deselectControlCenter(h)).toBe(true);
    expect(flat(renderControlCenterInspector(h))).toContain("Add from an area");
  });

  it("adds an entity once and says so", () => {
    const h = host();
    openControlCenterAdd(h);
    expect(addControlCenterEntities(h, ["light.lounge"])).toEqual(["light.lounge"]);
    expect(addControlCenterEntities(h, ["light.lounge"])).toEqual([]);
    expect(flat(renderControlCenterInspector(h))).toContain("Lounge Lamp is on the list already.");
    const added = controlCenterEntries(h.document).at(-1);
    expect(added).toEqual({ displayName: "Lounge Lamp", domain: "light", entityId: "light.lounge", iconName: "lightbulb", schemaVersion: 1 });
  });
});

describe("add from an area", () => {
  it("lists areas by name and the area's entities in the nine domains, by the device's area too", () => {
    expect(controlCenterAreas(HASS)).toEqual([{ id: "attic", name: "Attic" }, { id: "lounge", name: "Lounge" }]);
    expect(controlCenterAreaEntities(HASS, "lounge")).toEqual(["light.kitchen", "switch.lounge_fan", "light.lounge", "script.lounge_movie"]);
    expect(controlCenterAreaEntities(HASS, "attic")).toEqual([]);
    expect(controlCenterAreas({ states: {} } as unknown as HassLike)).toBeUndefined();
  });

  it("shows the area's entities, those on the list already fixed", () => {
    const h = host();
    openControlCenterAdd(h, "area");
    h.uiState.set("cc:add", { mode: "area", area: "lounge", picked: [] });
    const text = flat(renderControlCenterInspector(h));
    expect(text).toContain("Lounge Fan");
    expect(text).toContain("on the list");
    expect(text).toContain("Add all 3");
  });
});
