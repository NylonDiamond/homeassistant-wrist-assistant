// The stage's Live switch: off, every tile is drawn lit, with the badge it
// shows in a typical on state; on, the real states from Home Assistant.

import { describe, expect, it } from "vitest";

import type { HassEntityState } from "../src/ha-api.js";
import type { WatchPage, WatchPageTile } from "../src/watch-pages/model.js";
import {
  type WatchPagePreviewInput,
  renderWatchPagePreview,
  renderWatchTileFace,
  watchAllOnStates,
  watchTileBadge,
  watchTileIconTreatment,
  watchTileStyleActive,
} from "../src/watch-pages/preview.js";
import { STAGE_LIVE_KEY, loadStageLive, saveStageLive } from "../src/watch-pages/stage.js";

const entity = (entityId: string, state: string, attributes: Record<string, unknown> = {}): HassEntityState =>
  ({ entity_id: entityId, state, attributes, last_changed: "", last_updated: "" });
const statesOf = (...list: HassEntityState[]): Record<string, HassEntityState> =>
  Object.fromEntries(list.map((e) => [e.entity_id, e]));
const tile = (entityId: string, extra: Partial<WatchPageTile> = {}): WatchPageTile =>
  ({ id: entityId, entityId, gridRow: 0, gridCol: 0, colSpan: 6, rowSpan: 4, ...extra });

/** The badge an all-on tile shows, at a 90 point square. */
const badgeOn = (t: WatchPageTile, states?: Record<string, HassEntityState>) =>
  watchTileBadge(t, { states: watchAllOnStates(t, states) }, 90, 90)?.text;

/** A template's text with its values. */
function text(t: unknown): string {
  if (typeof t === "symbol" || t === null || t === undefined) return "";
  if (Array.isArray(t)) return t.map(text).join("");
  if (typeof t !== "object") return String(t);
  const r = t as { strings?: readonly string[]; values?: unknown[] };
  if (r.strings === undefined) return "";
  return r.strings.map((s, i) => s + (i < (r.values?.length ?? 0) ? text(r.values![i]) : "")).join("");
}

const page = (items: WatchPageTile[]): WatchPage => ({ id: "P", name: "P", items });
const input = (items: WatchPageTile[], states: Record<string, HassEntityState> | undefined, stateMode?: "live" | "all-on"): WatchPagePreviewInput =>
  ({ page: page(items), pages: [page(items)], screen: { width: 208, height: 248 }, states, scale: 1, stateMode });

describe("the all-on picture's states", () => {
  it("turns a light on, keeping its brightness only while it is really on", () => {
    const off = tile("light.desk");
    expect(watchAllOnStates(off, statesOf(entity("light.desk", "off", { brightness: 200, friendly_name: "Desk" })))!["light.desk"]).toMatchObject({
      state: "on", attributes: { friendly_name: "Desk" },
    });
    expect(watchAllOnStates(off, statesOf(entity("light.desk", "off", { brightness: 200 })))!["light.desk"]!.attributes).not.toHaveProperty("brightness");
    // An off light has no brightness to show: no badge, not OFF.
    expect(badgeOn(off, statesOf(entity("light.desk", "off")))).toBeUndefined();
    expect(badgeOn(off, statesOf(entity("light.desk", "on", { brightness: 128 })))).toBe("50%");
  });

  it("opens a cover, at its full position when it has one", () => {
    expect(badgeOn(tile("cover.blind"), statesOf(entity("cover.blind", "closed")))).toBe("Open");
    expect(badgeOn(tile("cover.blind"), statesOf(entity("cover.blind", "open", { current_position: 30 })))).toBe("Open");
  });

  it("plays a media player, with its volume when Home Assistant gives one", () => {
    expect(badgeOn(tile("media_player.tv"), statesOf(entity("media_player.tv", "off")))).toBeUndefined();
    expect(badgeOn(tile("media_player.tv"), statesOf(entity("media_player.tv", "paused", { volume_level: 0.4 })))).toBe("40%");
    expect(watchAllOnStates(tile("media_player.tv"), statesOf(entity("media_player.tv", "off")))!["media_player.tv"]!.state).toBe("playing");
  });

  it("keeps a sensor's real value, and leaves the states alone for it", () => {
    const states = statesOf(entity("sensor.temp", "21.46", { unit_of_measurement: "°C" }));
    expect(watchAllOnStates(tile("sensor.temp"), states)).toBe(states);
    expect(badgeOn(tile("sensor.temp"), states)).toBe("21.5°C");
  });

  it("enables an automation, which reads ON", () => {
    expect(badgeOn(tile("automation.night"), statesOf(entity("automation.night", "off")))).toBe("ON");
  });

  it("runs a timer with nothing to count: lit, no badge, no countdown", () => {
    const t = tile("timer.tea");
    const states = statesOf(entity("timer.tea", "active", { remaining: "0:04:00", duration: "0:05:00", finishes_at: "2026-10-03T12:00:00Z" }));
    expect(badgeOn(t, states)).toBeUndefined();
    const lit = watchAllOnStates(t, states);
    expect(watchTileStyleActive(t, lit)).toBe(true);
    const drawn = text(renderWatchTileFace(t, { width: 90, height: 90 }, input([t], states, "all-on"), 15));
    expect(drawn).not.toContain("wp-timer");
    expect(drawn).not.toContain("wp-bar");
    // Live, the countdown is there.
    expect(text(renderWatchTileFace(t, { width: 90, height: 90 }, input([t], states, "live"), 15))).toContain("wp-timer");
  });

  it("locks a lock (its glowing look), puts a climate in a mode, arms an alarm and brings a person home", () => {
    const states = statesOf(
      entity("lock.door", "unlocked"),
      entity("climate.hall", "off", { hvac_modes: ["off", "cool", "heat"] }),
      entity("alarm_control_panel.home", "disarmed"),
      entity("alarm_control_panel.away", "armed_away"),
      entity("person.jesse", "not_home"),
    );
    const on = (id: string) => watchAllOnStates(tile(id), states)![id]!.state;
    expect(on("lock.door")).toBe("locked");
    expect(watchTileIconTreatment(tile("lock.door"), watchAllOnStates(tile("lock.door"), states)).glow).toBe("lit");
    expect(on("climate.hall")).toBe("cool");
    expect(on("alarm_control_panel.home")).toBe("armed_home");
    expect(on("alarm_control_panel.away")).toBe("armed_away");
    expect(on("person.jesse")).toBe("home");
  });

  it("lights a remote's media player too", () => {
    const t = tile("remote.living_room");
    const lit = watchAllOnStates(t, statesOf(entity("remote.living_room", "off"), entity("media_player.living_room", "standby", { volume_level: 0.2 })))!;
    expect(lit["remote.living_room"]!.state).toBe("on");
    expect(lit["media_player.living_room"]).toMatchObject({ state: "playing", attributes: { volume_level: 0.2 } });
  });

  it("gives an entity Home Assistant has not reported its on state rather than the faded seed", () => {
    const t = tile("switch.kettle");
    const states = statesOf(entity("light.other", "off"));
    expect(text(renderWatchTileFace(t, { width: 90, height: 90 }, input([t], states, "live"), 15))).toContain("opacity:0.7");
    expect(text(renderWatchTileFace(t, { width: 90, height: 90 }, input([t], states, "all-on"), 15))).not.toContain("opacity:0.7");
  });
});

describe("the all-on picture", () => {
  const states = statesOf(entity("switch.fan", "off"), entity("light.lamp", "off"));

  it("draws an off tile lit, and live draws it dimmed", () => {
    const t = tile("switch.fan");
    const live = text(renderWatchTileFace(t, { width: 90, height: 90 }, input([t], states, "live"), 15));
    const allOn = text(renderWatchTileFace(t, { width: 90, height: 90 }, input([t], states, "all-on"), 15));
    expect(live).toMatch(/class="wp-tile off/);
    expect(allOn).not.toMatch(/class="wp-tile off/);
    // The lit symbol glows.
    expect(allOn).toContain("drop-shadow");
  });

  it("is live by default", () => {
    const t = tile("switch.fan");
    expect(text(renderWatchTileFace(t, { width: 90, height: 90 }, input([t], states), 15))).toMatch(/class="wp-tile off/);
  });

  it("leaves an entity whose state is being tried as tried: the test state wins over the lit one", () => {
    const t = tile("switch.fan");
    expect(watchAllOnStates(t, states, new Set(["switch.fan"]))).toBe(states);
    expect(watchAllOnStates(t, states, new Set(["light.lamp"]))!["switch.fan"]!.state).toBe("on");
    const tried = { ...input([t], states, "all-on"), testedIds: new Set(["switch.fan"]) };
    expect(text(renderWatchTileFace(t, { width: 90, height: 90 }, tried, 15))).toMatch(/class="wp-tile off/);
    // A remote's media player being tried stays as tried too.
    const remote = tile("remote.living_room");
    const both = statesOf(entity("remote.living_room", "off"), entity("media_player.living_room", "standby"));
    const lit = watchAllOnStates(remote, both, new Set(["media_player.living_room"]))!;
    expect(lit["remote.living_room"]!.state).toBe("on");
    expect(lit["media_player.living_room"]!.state).toBe("standby");
  });

  it("shows a tile hidden while off, in the read only preview too", () => {
    const hidden = tile("light.lamp", { hideWhenInactive: true, customLabel: "Hidden lamp" });
    const other = tile("switch.fan", { id: "B", gridRow: 4 });
    expect(text(renderWatchPagePreview(input([hidden, other], states, "live")))).not.toContain("Hidden lamp");
    expect(text(renderWatchPagePreview(input([hidden, other], states, "all-on")))).toContain("Hidden lamp");
  });
});

describe("the Live switch's memory", () => {
  const memory = () => {
    const kept = new Map<string, string>();
    return { kept, getItem: (k: string) => kept.get(k) ?? null, setItem: (k: string, v: string) => void kept.set(k, v) };
  };

  it("is off until switched on, and remembers either way", () => {
    const store = memory();
    expect(loadStageLive(store)).toBe(false);
    saveStageLive(true, store);
    expect(store.kept.get(STAGE_LIVE_KEY)).toBe("1");
    expect(loadStageLive(store)).toBe(true);
    saveStageLive(false, store);
    expect(loadStageLive(store)).toBe(false);
    expect(STAGE_LIVE_KEY).toBe("wrist-assistant-panel.pages.live.v1");
  });

  it("is off, and never throws, where the browser keeps nothing", () => {
    const broken = { getItem: () => { throw new Error("denied"); }, setItem: () => { throw new Error("denied"); } };
    expect(loadStageLive(broken)).toBe(false);
    expect(() => saveStageLive(true, broken)).not.toThrow();
    expect(loadStageLive(undefined)).toBe(false);
  });
});
