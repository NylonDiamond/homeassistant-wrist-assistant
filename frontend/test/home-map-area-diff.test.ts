import { describe, expect, it } from "vitest";
import { homeMapAreaDiff } from "../src/home-map/devices-model.js";

// A pin's room and its device in Home Assistant can name different areas,
// as on the real Upstairs: "All bedroom lights" stands in the Bedroom but is
// kept in the area Light groups.
const hass = {
  entities: {
    "light.all_bedroom_lights": { entity_id: "light.all_bedroom_lights", area_id: "light_groups" },
    "light.lamp": { entity_id: "light.lamp", device_id: "dev1" },
    "light.loose": { entity_id: "light.loose" },
  },
  devices: { dev1: { id: "dev1", area_id: "bedroom" } },
} as never;

describe("a pin's area against its device's", () => {
  it("says nothing when they agree, the device's own area read through its device", () => {
    expect(homeMapAreaDiff(hass, "light.lamp", "bedroom")).toBeUndefined();
  });

  it("names both when they differ", () => {
    expect(homeMapAreaDiff(hass, "light.all_bedroom_lights", "bedroom")).toEqual({ roomAreaId: "bedroom", deviceAreaId: "light_groups", movable: true });
  });

  it("names a device with no area", () => {
    expect(homeMapAreaDiff(hass, "light.loose", "bedroom")).toEqual({ roomAreaId: "bedroom", deviceAreaId: undefined, movable: true });
  });

  it("offers no move for an entity Home Assistant keeps no registry entry for", () => {
    expect(homeMapAreaDiff(hass, "light.yaml_only", "bedroom")?.movable).toBe(false);
  });

  it("says nothing for a room with no area", () => {
    expect(homeMapAreaDiff(hass, "light.all_bedroom_lights", undefined)).toBeUndefined();
  });
});
