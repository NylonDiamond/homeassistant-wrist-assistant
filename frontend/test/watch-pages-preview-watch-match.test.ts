// The page preview drawn as the watch draws it, rule by rule, each checked
// against the watch app's Swift (the file and view named in each test) and,
// where the code leaves it open, against the 46 mm simulator.

import { svg } from "lit";
import { describe, expect, it } from "vitest";

import type { HassEntityState } from "../src/ha-api.js";
import type { IconProvider } from "../src/renderer.js";
import type { WatchPage, WatchPageTile } from "../src/watch-pages/model.js";
import { watchThemeRoleColors } from "../src/watch-pages/tile-new.js";
import {
  WATCH_FONT_FAMILY,
  WATCH_LABEL_TRACKING,
  WATCH_SCREEN_SIDE_INSET,
  WATCH_SECONDARY,
  WATCH_TILE_THEME,
  renderWatchPageIndicator,
  renderWatchPagePreview,
  renderWatchPageTitle,
  renderWatchTileFace,
  symbolScale,
  watchCoverSymbol,
  watchDiagonal,
  watchEntityActive,
  watchHeaderPlacement,
  watchMediaPlayerOn,
  watchPreviewLayout,
  watchReflowPage,
  watchSensorSuggestedColor,
  watchSpacerStyle,
  watchStateUnavailable,
  watchStubState,
  watchSymbolPaint,
  watchSyncedTile,
  watchSyncedTileColor,
  watchTileBadge,
  watchTileFallbackInk,
  watchTileSymbol,
  watchTimerRemaining,
  watchTimerRemainingText,
  watchUniformScale,
  watchValueInLabel,
} from "../src/watch-pages/preview.js";

/** A template's text with its values. */
function text(t: unknown): string {
  if (typeof t === "symbol" || t === null || t === undefined) return "";
  if (Array.isArray(t)) return t.map(text).join("");
  if (typeof t !== "object") return String(t);
  const r = t as { strings?: readonly string[]; values?: unknown[] };
  if (r.strings === undefined) return "";
  return r.strings.map((s, i) => s + (i < (r.values?.length ?? 0) ? text(r.values![i]) : "")).join("");
}

const entity = (entityId: string, value: string, attributes: Record<string, unknown> = {}): HassEntityState =>
  ({ entity_id: entityId, state: value, attributes, last_changed: "", last_updated: "" });
const states = (...list: HassEntityState[]): Record<string, HassEntityState> => Object.fromEntries(list.map((e) => [e.entity_id, e]));
const page = (extra: Record<string, unknown> = {}): WatchPage => ({ id: "P", name: "Hall", items: [], ...extra });
const screen = { width: 208, height: 248 };
const face = (t: WatchPageTile, s?: Record<string, HassEntityState>, size = { width: 66, height: 66 }, icons?: IconProvider) =>
  text(renderWatchTileFace(t, size, { page: page(), pages: [], screen, states: s, scale: 1, icons }, 15.17));

/** A provider with each symbol's viewBox, drawing a rect. */
const boxes = (map: Record<string, [number, number]>): IconProvider => ({
  render: (symbol: string, size: number) => {
    const box = map[symbol];
    return box === undefined ? undefined : svg`<svg x="0" y="0" width=${size} height=${size} viewBox=${`0 0 ${box[0]} ${box[1]}`}><rect /></svg>`;
  },
  available: () => true,
  names: () => Object.keys(map),
});

describe("the grid on the watch's screen", () => {
  it("leaves the side safe area: tiles 2 points in from each side, units from 204 points (InteractiveGrid.gridBase)", () => {
    const tiles = [0, 4, 8].map((col, i) => ({ id: `T${i}`, entityId: "light.a", gridRow: 0, gridCol: col, colSpan: 4, rowSpan: 4 }));
    const layout = watchPreviewLayout(page({ items: tiles }), screen);
    expect(WATCH_SCREEN_SIDE_INSET).toBe(2);
    expect(layout.unit).toBeCloseTo((204 - 22) / 12);
    expect(layout.tiles.map((t) => Math.round(t.x * 100) / 100)).toEqual([2, 70.67, 139.33]);
    expect(layout.tiles[2]!.x + layout.tiles[2]!.width).toBeCloseTo(206);
    expect(layout.screen).toEqual(screen);
  });
});

describe("symbols", () => {
  it("draw at the watch's font size: the viewBox's longer side times the size over 22", () => {
    const icons = boxes({ "lightbulb": [13.65, 23.68], gearshape: [21.57, 21.2] });
    expect(symbolScale(icons, "lightbulb")).toBeCloseTo(23.68 / 22);
    expect(symbolScale(icons, "nothing.here")).toBe(1);
    expect(symbolScale(undefined, "lightbulb")).toBe(1);
    // A 36 point bulb is a 38.75 point box.
    expect(face({ id: "L", entityId: "light.a", icon: "lightbulb", showLabel: false }, undefined, { width: 100, height: 100 }, icons)).toContain("width=43.05");
  });

  it("read the watch's old names through their new ones, and draw nothing for an unknown one", () => {
    const icons = boxes({ "thermometer.medium": [15.46, 22.02], "battery.100percent": [26, 12] });
    const thermo = face({ id: "S", entityId: "sensor.t", icon: "thermometer" }, undefined, undefined, icons);
    expect(thermo).toContain("<rect />");
    expect(face({ id: "S", entityId: "sensor.b", icon: "battery.100" }, undefined, undefined, icons)).toContain("<rect />");
    // A provider without the name: an empty box, as Image(systemName:) draws.
    const unknown = face({ id: "S", entityId: "sensor.t", icon: "not.a.symbol" }, undefined, undefined, icons);
    expect(unknown).not.toContain("<circle");
    expect(unknown).not.toContain("<rect />");
    // No provider at all: the faint dot.
    expect(face({ id: "S", entityId: "sensor.t", icon: "not.a.symbol" })).toContain("<circle");
  });

  it("paint a tile's symbol as foregroundStyleWithRainbow does", () => {
    expect(watchSymbolPaint("#FF0000", "#FFFFFF")).toEqual({ kind: "fade", hex: "#FF0000" });
    expect(watchSymbolPaint(undefined, "#00FF00")).toEqual({ kind: "fade", hex: "#00FF00" });
    expect(watchSymbolPaint("#RAINBOW", "#FFFFFF")).toEqual({ kind: "rainbow" });
    expect(watchSymbolPaint("GRADIENT|#112233|#445566", "#FFFFFF")).toEqual({ kind: "mesh", from: "#112233", to: "#445566" });
    const icons = boxes({ "lightbulb.fill": [13.65, 23.68] });
    const drawn = face({ id: "L", entityId: "light.a", icon: "lightbulb", color: "#FF0000" }, states(entity("light.a", "on")), undefined, icons);
    // From 0.98 at the glyph's top left to 0.64 at its bottom right, along
    // the diagonal in points.
    expect(drawn).toContain('gradientUnits="userSpaceOnUse"');
    expect(drawn).toContain("stop-color=#FF0000 stop-opacity=0.98");
    expect(drawn).toContain("stop-color=#FF0000 stop-opacity=0.64");
    expect(drawn).toContain("<mask");
  });
});

describe("text", () => {
  it("is SF Compact, with the watch's tracking on names", () => {
    expect(WATCH_FONT_FAMILY.startsWith('"SF Compact Text", "SF Compact"')).toBe(true);
    expect(WATCH_LABEL_TRACKING).toBe(0.045);
  });

  it("puts a badge 1 point in from its padding, in the secondary color under the label shadow", () => {
    const drawn = face({ id: "L", entityId: "light.a" }, states(entity("light.a", "on", { brightness: 255 })));
    expect(WATCH_SECONDARY).toEqual({ hex: "#EBEBF5", alpha: 0.6 });
    expect(drawn).toContain("left:6px;padding:0 1px;color:rgba(235, 235, 245, 0.6)");
    expect(drawn).toContain("text-shadow:0 1px 2px rgba(0, 0, 0, 0.8)");
  });

  it("gives a sensor's capsule 5 points of room and the others 1", () => {
    const sensor = face({ id: "S", entityId: "sensor.t", stateValueLabelStyle: "Pill" }, states(entity("sensor.t", "21")));
    expect(sensor).toContain("padding:0 5px;border-radius:999px");
    const light = face({ id: "L", entityId: "light.a", stateValueLabelStyle: "Pill" }, states(entity("light.a", "on", { brightness: 255 })));
    expect(light).toContain("padding:0 1px;border-radius:999px");
  });
});

describe("media players (SimpleMediaPlayerTile)", () => {
  it("count as on in any state but off and standby", () => {
    expect(["on", "playing", "idle", "unavailable"].map(watchMediaPlayerOn)).toEqual([true, true, true, true]);
    expect(["off", "standby", "OFF"].map(watchMediaPlayerOn)).toEqual([false, false, false]);
  });

  it("show the volume and the top bar while on, lit or not, and play or pause top right while playing, paused or idle", () => {
    const tile = { id: "M", entityId: "media_player.den", color: "#F08D62" };
    expect(watchTileBadge(tile, { states: states(entity("media_player.den", "on", { volume_level: 0.615 })) }, 66, 66)).toMatchObject({ text: "61%", top: 8 });
    const on = face(tile, states(entity("media_player.den", "on", { volume_level: 0.615 })));
    expect(on).toContain("wp-bar");
    expect(on).toContain("border-radius:1.5px");
    expect(on).not.toContain("play.fill");
    const icons = boxes({ "play.fill": [10, 12], "pause.fill": [10, 12] });
    const playing = face(tile, states(entity("media_player.den", "playing", { volume_level: 0.5 })), undefined, icons);
    expect(playing).toContain("top:8px;right:6px;opacity:0.6");
    expect(face({ ...tile, showActivityStatus: false }, states(entity("media_player.den", "playing", { volume_level: 0.5 })), undefined, icons)).not.toContain("right:6px;opacity:0.6");
  });
});

describe("entities the watch has no state for", () => {
  it("draw the state the watch seeds, at 0.7 (seedEntitiesFromGrid, TileStateModifier)", () => {
    expect(["light.a", "cover.a", "lock.a", "alarm_control_panel.a", "vacuum.a", "timer.a", "person.a", "sensor.a", "scene.a", "page.X"].map(watchStubState))
      .toEqual(["off", "closed", "locked", "disarmed", "docked", "idle", "unknown", "", undefined, undefined]);
    const drawn = face({ id: "L", entityId: "light.gone", customLabel: "Gone" }, states(entity("light.other", "on")));
    expect(drawn).toContain(">OFF<");
    expect(drawn).toContain("opacity:0.7");
    expect(drawn).toContain("wp-tile off");
    // With no states at all there is nothing to seed: the tile draws lit.
    expect(face({ id: "L", entityId: "light.gone" })).not.toContain("opacity:0.7");
  });
});

describe("unavailable entities (UnavailableOverlay)", () => {
  it("fade to 0.4 under a red line from corner to corner", () => {
    const drawn = face({ id: "L", entityId: "light.a" }, states(entity("light.a", "unavailable")));
    expect(drawn).toContain("opacity:0.4");
    expect(drawn).toContain('class="wp-gone"');
    expect(drawn).toContain('<line x1="0" y1="0" x2=66 y2=66 stroke="rgba(255, 69, 58, 0.6)" stroke-width=1.5 />');
  });

  it("read unknown as unavailable, except a scene, script, button or siren's, and none too for a sensor", () => {
    expect(watchStateUnavailable("unknown", "light")).toBe(true);
    expect(watchStateUnavailable("unknown", "scene")).toBe(false);
    expect(watchStateUnavailable("unavailable", "scene")).toBe(true);
    expect(watchStateUnavailable("unknown", "siren")).toBe(false);
    expect(watchStateUnavailable("none", "sensor")).toBe(true);
    expect(watchStateUnavailable("none", "light")).toBe(false);
    expect(face({ id: "S", entityId: "scene.night" }, states(entity("scene.night", "unknown")))).not.toContain("wp-gone");
  });
});

describe("the colors the watch is sent (WatchPagesSyncRules.applyDefaultTileColors)", () => {
  it("give a tile with no color its domain's color in its page's theme, else white", () => {
    const neon = watchThemeRoleColors("neonLagoon");
    const ember = watchThemeRoleColors("ember");
    expect(watchSyncedTileColor("light.a", page())).toBe(neon.entityLight);
    expect(watchSyncedTileColor("light.a", page({ themeOverride: "ember" }))).toBe(ember.entityLight);
    expect(watchSyncedTileColor("binary_sensor.a", page())).toBe(neon.entitySensor);
    expect(watchSyncedTileColor("input_number.a", page())).toBe(neon.entitySensor);
    expect(watchSyncedTileColor("valve.a", page())).toBe(neon.entityCover);
    expect(watchSyncedTileColor("page.X", page())).toBe(neon.entityPage);
    // Every other domain is the accent, which a theme palette has no hex for.
    for (const id of ["input_select.a", "counter.a", "automation.a", "template.X", "spacer.X", "divider.line.x", "http_action.X"]) {
      expect(watchSyncedTileColor(id, page()), id).toBe("#FFFFFF");
    }
    expect(watchSyncedTile({ id: "L", entityId: "light.a", color: "#123456" }, page()).color).toBe("#123456");
    expect(watchSyncedTile({ id: "L", entityId: "light.a" }, page()).color).toBe(neon.entityLight);
    expect(watchSyncedTile({ id: "L", entityId: "light.a", color: null }, page()).color).toBe(neon.entityLight);
  });

  it("are what the tiles draw in", () => {
    // A select with no color is white on the watch, not the button color.
    const drawn = face({ id: "S", entityId: "select.mode" }, states(entity("select.mode", "Away")));
    expect(drawn).toContain("rgba(255, 255, 255, 0.52)");
  });
});

describe("a symbol's box", () => {
  it("is the glyph's own shape, as SwiftUI frames an image", () => {
    const icons = boxes({ video: [32.5, 20.63] });
    const drawn = face({ id: "C", entityId: "camera.a", icon: "video", cameraDisplayMode: "icon" }, undefined, { width: 66, height: 49.5 }, icons);
    // 26.73 points: 39.49 by 25.07.
    expect(drawn).toMatch(/width=39\.4\d height=25\.0\d/);
  });
});

describe("a tile's own default look", () => {
  it("takes its colors from sunnyBeachDay whatever the page's theme, the sensors' by device class", () => {
    const sunny = watchThemeRoleColors(WATCH_TILE_THEME);
    expect(WATCH_TILE_THEME).toBe("sunnyBeachDay");
    expect(watchTileFallbackInk({ id: "L", entityId: "light.a" }, page({ themeOverride: "neonLagoon" }))).toBe(sunny.entityLight);
    expect(watchTileFallbackInk({ id: "N", entityId: "input_number.a" })).toBe(sunny.entitySensor);
    expect(watchTileFallbackInk({ id: "N", entityId: "select.a" })).toBe(sunny.entityButton);
    expect(watchTileFallbackInk({ id: "H", entityId: "http_action.X" })).toBe("#2EC4B6");
    expect(watchTileFallbackInk({ id: "W", entityId: "status_page.X" })).toBe("#4BBDE0");
    expect(watchSensorSuggestedColor("sensor.t", entity("sensor.t", "21", { device_class: "temperature" }))).toBe("#FF9500");
    expect(watchSensorSuggestedColor("sensor.b", entity("sensor.b", "15", { device_class: "battery" }))).toBe("#FF3B30");
    expect(watchSensorSuggestedColor("sensor.b", entity("sensor.b", "55", { device_class: "battery" }))).toBe("#34C759");
    expect(watchSensorSuggestedColor("counter.c", undefined)).toBe("#64D2FF");
    expect(watchSensorSuggestedColor("sensor.x", undefined)).toBe("#8E8E93");
    // A timer in its color while it runs, else the secondary text's white.
    expect(watchTileFallbackInk({ id: "T", entityId: "timer.tea" }, undefined, states(entity("timer.tea", "idle")))).toBe("#FFFFFF");
    expect(watchTileFallbackInk({ id: "T", entityId: "timer.tea" }, undefined, states(entity("timer.tea", "active")))).toBe(sunny.entityTimer);
  });

  it("draws the symbol each view picks when the tile names none", () => {
    const sym = (entityId: string, value?: string, attrs: Record<string, unknown> = {}, icon?: string) =>
      watchTileSymbol({ id: "X", entityId, ...(icon === undefined ? {} : { icon }) }, value === undefined ? undefined : entity(entityId, value, attrs));
    expect(sym("light.a", "on")).toBe("lightbulb");
    expect(sym("lock.a", "locked")).toBe("lock");
    expect(sym("lock.a", "unlocked")).toBe("lock.open");
    expect(sym("lock.a", "unlocked", {}, "lock.fill")).toBe("lock.open.fill");
    expect(sym("cover.a", "open", { device_class: "garage" })).toBe("door.garage.open");
    expect(sym("cover.a", "closed")).toBe("window.ceiling");
    expect(sym("cover.a", "open", { current_position: 30 }, "window.ceiling")).toBe("window.ceiling.open");
    expect(watchCoverSymbol("awning", true)).toBe("tent");
    expect(sym("media_player.a", "playing")).toBe("pause.fill");
    expect(sym("media_player.a", "paused")).toBe("play.fill");
    expect(sym("media_player.a", "off")).toBe("play.circle");
    expect(sym("timer.a", "paused")).toBe("pause.fill");
    expect(sym("sensor.a", "21", { device_class: "humidity" })).toBe("humidity");
    expect(sym("sensor.a", "8", { device_class: "battery" })).toBe("battery.0");
    expect(sym("sensor.a", "60", { device_class: "battery" })).toBe("battery.75");
    expect(sym("counter.a", "3")).toBe("number.circle");
    expect(sym("sensor.a", "3")).toBe("sensor");
    expect(sym("scene.a", "x")).toBe("play");
    expect(sym("input_select.a", "x")).toBe("list.bullet");
    expect(sym("light.a", "on", {}, "star")).toBe("star");
  });

  it("writes a number's value as displayValueString does, and a select's option as it is", () => {
    const value = (entityId: string, v: string, attrs: Record<string, unknown> = {}) => watchValueInLabel({ id: "N", entityId }, entity(entityId, v, attrs));
    expect(value("input_number.a", "1234.567", { step: 0.5, unit_of_measurement: "W" })).toBe("1,234.57 W");
    expect(value("number.a", "20.6", { step: 1 })).toBe("21");
    expect(value("select.a", "option_a")).toBe("option_a");
    expect(value("light.a", "on")).toBeUndefined();
    expect(face({ id: "N", entityId: "input_number.a", customLabel: "Level" }, states(entity("input_number.a", "3.25", { step: 0.25 })))).toContain(">3.25<");
  });
});

describe("timers (SimpleTimerTile)", () => {
  it("count down to finishes_at while active, else read remaining", () => {
    const now = Date.parse("2026-10-03T12:00:00Z");
    const active = entity("timer.tea", "active", { finishes_at: "2026-10-03T12:04:05Z", remaining: "0:10:00", duration: "0:10:00" });
    expect(watchTimerRemaining(active, now)).toBe(245);
    expect(watchTimerRemainingText(active, now)).toBe("4:05");
    expect(watchTimerRemainingText(entity("timer.tea", "paused", { remaining: "1:02:03" }), now)).toBe("1:02:03");
    expect(watchTimerRemainingText(entity("timer.tea", "paused", { remaining: "0:00:00" }), now)).toBe("--:--");
  });

  it("draw the time left as a right anchored bar and, while active, across the tile", () => {
    const drawn = face({ id: "T", entityId: "timer.tea" }, states(entity("timer.tea", "paused", { remaining: "0:05:00", duration: "0:10:00" })));
    expect(drawn).toContain("top:4px;right:6px;height:3px;width:27px");
    expect(drawn).not.toContain("wp-timer");
    const running = face({ id: "T", entityId: "timer.tea" }, states(entity("timer.tea", "active", { remaining: "0:05:00", duration: "0:10:00" })));
    expect(running).toContain('class="wp-timer"');
    expect(running).toContain("font-size:18.48px");
  });
});

describe("hide when off (InteractiveGrid.computeReflow)", () => {
  const t = (id: string, entityId: string, row: number, col: number, extra: Record<string, unknown> = {}) =>
    ({ id, entityId, gridRow: row, gridCol: col, colSpan: 6, rowSpan: 2, ...extra });

  it("reads each kind's active state as the watch does", () => {
    const s = states(entity("lock.a", "locked"), entity("cover.a", "open", { current_position: 0 }), entity("media_player.a", "on"), entity("binary_sensor.a", "on"), entity("alarm_control_panel.a", "armed_home"));
    expect(watchEntityActive("lock.a", s)).toBe(false);
    expect(watchEntityActive("cover.a", s)).toBe(false);
    expect(watchEntityActive("media_player.a", s)).toBe(true);
    expect(watchEntityActive("binary_sensor.a", s)).toBe(true);
    expect(watchEntityActive("alarm_control_panel.a", s)).toBe(true);
    expect(watchEntityActive("light.missing", s)).toBe(false);
  });

  it("removes the hidden tiles and packs the rest into each section, headers fixed", () => {
    const items = [
      t("A", "light.a", 0, 0, { hideWhenInactive: true }),
      t("B", "light.b", 0, 6),
      t("C", "light.c", 2, 0),
      { id: "H", entityId: "divider.line.custom", gridRow: 4, gridCol: 0, colSpan: 12, rowSpan: 1 },
      t("D", "light.d", 7, 6),
    ];
    const s = states(entity("light.a", "off"), entity("light.b", "on"), entity("light.c", "on"), entity("light.d", "on"));
    const packed = watchReflowPage(page({ items }), s).items as WatchPageTile[];
    expect(packed.map((x) => [x.id, x.gridRow, x.gridCol])).toEqual([["B", 0, 0], ["C", 0, 6], ["H", 4, 0], ["D", 5, 0]]);
    // Nothing hidden, or no states: the page as it is.
    const p = page({ items });
    expect(watchReflowPage(p, states(entity("light.a", "on")))).toBe(p);
    expect(watchReflowPage(p, undefined)).toBe(p);
  });
});

describe("the page", () => {
  it("draws the watch's page dots when it shows more than one page (PageLineIndicator)", () => {
    const pages = [page({ id: "A" }), page({ id: "B" }), page({ id: "C", isHidden: true })];
    expect(watchUniformScale(screen)).toBeCloseTo(1.0433, 3);
    const dots = text(renderWatchPageIndicator({ page: pages[1]!, pages, screen }, 1));
    expect(dots.match(/wp-pages-dot/g)).toHaveLength(2);
    expect(dots).toContain("rgba(255, 255, 255, 0.5)");
    expect(dots).toContain("rgba(255, 255, 255, 0.15)");
    expect(text(renderWatchPageIndicator({ page: pages[0]!, pages: [pages[0]!], screen }, 1))).toBe("");
    expect(text(renderWatchPageIndicator({ page: pages[0]!, pages, screen, behavior: { showPageIndicator: false } }, 1))).toBe("");
    expect(text(renderWatchPageIndicator({ page: pages[0]!, pages, screen, behavior: { pageIndicatorStyle: "Dash", pageIndicatorOpacity: "Bright" } }, 1))).toContain("rgba(255, 255, 255, 0.9)");
  });

  it("centres the title 3 points down, the switcher text first, in the watch's pill and glass", () => {
    const p = page({ pageTitleDisplayStyle: "pill", pageTitleTextSize: "size12" });
    const pill = text(renderWatchPageTitle(p, 1, 34, undefined));
    expect(pill).toContain("top:3px;font-size:12px");
    expect(pill).toContain("padding:3px 8px;background:rgba(0, 0, 0, 0.32)");
    expect(pill).toContain(">Hall<");
    expect(text(renderWatchPageTitle({ ...p, switcherText: " Downstairs " }, 1, 34, undefined))).toContain(">Downstairs<");
    const glass = text(renderWatchPageTitle({ ...p, pageTitleDisplayStyle: "glass" }, 1, 34, undefined));
    expect(glass).toContain("wp-title-rim");
    expect(glass).toContain("wp-title-shine");
    expect(text(renderWatchPageTitle({ ...p, name: " " }, 1, 34, undefined))).toBe("");
    // The watch's Page title setting off hides it.
    expect(text(renderWatchPageTitle(p, 1, 34, undefined, { pageTitleMode: "Off" }))).toBe("");
    expect(text(renderWatchPageTitle(p, 1, 34, undefined, { pageTitleMode: "Auto" }))).toContain(">Hall<");
  });

  it("rests a first row header on its bottom and moves any other down a fifth (DividerTile)", () => {
    expect(watchHeaderPlacement({ id: "H", entityId: "divider.line.x", gridRow: 0 }, false, 15, 2)).toBe("justify-content:flex-end;padding:0 0px 4px");
    expect(watchHeaderPlacement({ id: "H", entityId: "divider.label.x", gridRow: 3 }, true, 15, 2)).toBe("justify-content:center;padding:0 8px 0px;transform:translateY(6px)");
  });

  it("runs SwiftUI's corner to corner gradients along the box's diagonal", () => {
    expect(watchDiagonal(100, 100)).toBe("135deg");
    expect(watchDiagonal(100, 50)).toBe("116.57deg");
    expect(watchDiagonal()).toBe("to bottom right");
  });

  it("puts a spacer over the thin material", () => {
    expect(watchSpacerStyle({ id: "S", entityId: "spacer.A" }, 1, { width: 50, height: 50 })).toContain("linear-gradient(135deg,");
    expect(watchSpacerStyle({ id: "S", entityId: "spacer.A" }, 1)).toContain("rgba(0, 0, 0, 0.48)");
  });

  it("draws the whole page from the watch's rules", () => {
    const items = [{ id: "L", entityId: "light.a", gridRow: 0, gridCol: 0, colSpan: 4, rowSpan: 4, hideWhenInactive: true }, { id: "M", entityId: "light.b", gridRow: 0, gridCol: 4, colSpan: 4, rowSpan: 4 }];
    const drawn = text(renderWatchPagePreview({ page: page({ items }), pages: [page({ items }), page({ id: "Q" })], screen, scale: 1, states: states(entity("light.a", "off"), entity("light.b", "on")) }));
    // The hidden light is gone and the other packed to the left edge, 2 in.
    expect(drawn).toContain("left:2px;top:34px");
    expect(drawn.match(/class="wp-tile/g)).toHaveLength(1);
    expect(drawn).toContain("wp-pages");
  });
});
