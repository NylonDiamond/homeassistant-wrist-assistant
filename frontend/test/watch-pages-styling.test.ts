// A tile's styling: the State, Border and Background setters and readers,
// the State Icons and Colors card with its vocabulary and the phone's sync of
// `usesStateIcons`, every task's reset, and the slider rounding. The phone's
// own cases are replayed in `watch-pages-tile-settings.test.ts`.

import { describe, expect, it } from "vitest";

import { findWatchPage } from "../src/watch-pages/edit.js";
import type { WatchPageTile, WatchPagesDocument } from "../src/watch-pages/model.js";
import {
  clearWatchTileStateOverrides,
  resetWatchTileState,
  resetWatchTileTask,
  setWatchTileBorderColor,
  setWatchTileBorderGlow,
  setWatchTileBorderStyle,
  setWatchTileBorderThickness,
  setWatchTileDecimals,
  setWatchTileEffectColor,
  setWatchTileEffectSpeed,
  setWatchTilePattern,
  setWatchTilePatternColor,
  setWatchTilePatternScale,
  setWatchTileShowActivity,
  setWatchTileShowTargetTemp,
  setWatchTileStateBarStyle,
  setWatchTileStateColor,
  setWatchTileStateIcon,
  setWatchTileStateTextSize,
  setWatchTileStatusIconSize,
  setWatchTileValueLabelStyle,
  watchSliderValue,
  watchStateVocabularyRows,
  watchTileBackgroundSettings,
  watchTileBorderSettings,
  watchTileHasStateTask,
  watchTileStateIcons,
  watchTileStateCards,
  watchTileTaskModified,
} from "../src/watch-pages/styling-model.js";
import {
  watchExtraStateLabel,
  watchExtraStateSample,
  watchStateDomains,
  watchStateVocabulary,
  watchStylingChoices,
  watchStylingReset,
  watchStylingSlider,
} from "../src/watch-pages/tile-styling.js";

type Json = Record<string, unknown>;

const PAGE = "C3A0E000-0000-4000-8000-0000000000AA";
const ID = "C3A0E000-0000-4000-8000-000000000001";

function docWith(tile: Json): WatchPagesDocument {
  return { schemaVersion: 1, pages: [{ id: PAGE, name: "Living", items: [tile] }] };
}

function tileIn(document: WatchPagesDocument): WatchPageTile {
  return (findWatchPage(document, PAGE)!.items as WatchPageTile[])[0]!;
}

/** A tile as the phone encodes it, keys sorted. */
function tile(entityId: string, extra: Json = {}): Json {
  const t: Json = { ...extra, entityId, id: ID, color: "#FFD60A", icon: "lightbulb" };
  return Object.fromEntries(Object.keys(t).sort().map((k) => [k, t[k]]));
}

function edit(t: Json, f: (d: WatchPagesDocument) => WatchPagesDocument): { before: WatchPagesDocument; after: WatchPagesDocument; tile: WatchPageTile } {
  const before = docWith(t);
  const after = f(before);
  return { before, after, tile: tileIn(after) };
}

const sorted = (o: object) => {
  const keys = Object.keys(o);
  return keys.every((k, i) => i === 0 || keys[i - 1]! < k);
};

describe("slider values", () => {
  it("snap to the slider's step from its start, without float noise", () => {
    expect(watchSliderValue(0.3, { min: 0, max: 1, step: 0.1 })).toBe(0.3);
    expect(watchSliderValue(0.34, { min: 0, max: 1, step: 0.1 })).toBe(0.3);
    expect(watchSliderValue(1.1, { min: 0.25, max: 5, step: 0.25 })).toBe(1);
    expect(watchSliderValue(0.371, { min: 0, max: 1, step: 0.01 })).toBe(0.37);
  });

  it("refuse what is out of range or no number", () => {
    expect(watchSliderValue(1.2, { min: 0, max: 1, step: 0.1 })).toBeUndefined();
    expect(watchSliderValue(-1, { min: 0, max: 1, step: 0.1 })).toBeUndefined();
    expect(watchSliderValue(Number.NaN, { min: 0, max: 1, step: 0.1 })).toBeUndefined();
    expect(watchSliderValue("0.5", { min: 0, max: 1, step: 0.1 })).toBeUndefined();
  });

  it("every slider of these tasks is in the table", () => {
    for (const name of [
      "badgeFontSizeOverride", "statusIconSizeOverride", "borderGlow", "borderAnimationSpeed",
      "borderAnimationIntensity", "borderAnimationSize", "patternOpacity", "patternScale", "animationSpeed",
      "animationIntensity", "animationSize", "backgroundBrightness", "backgroundPatternOpacity",
      "backgroundPatternScale", "backgroundOverlaySpeed", "backgroundOverlayIntensity", "backgroundOverlaySize",
    ]) {
      const s = watchStylingSlider(name);
      expect(s.max, name).toBeGreaterThan(s.min);
      expect(s.step, name).toBeGreaterThan(0);
    }
  });
});

describe("the State task", () => {
  it("shows the table's cards by domain, rows read as the watch reads them", () => {
    const rows = (t: Json) => Object.fromEntries(watchTileStateCards(t).flatMap((c) => c.rows.map((r) => [r.key, r.value])));
    const ids = (t: Json) => watchTileStateCards(t).map((c) => c.id);
    expect(ids(tile("light.desk"))).toEqual(["valueLabel", "textSize", "bar"]);
    expect(rows(tile("light.desk"))).toEqual({
      stateValueLabelStyle: "Plain", statusTextShadow: true, badgeFontSizeOverride: undefined,
      stateBarStyle: "Top", stateBarColorStyle: "Tile", stateBarBorder: false, stateBarShadow: false,
    });
    expect(ids(tile("climate.hall"))).toEqual(["temperature", "textSize", "activity"]);
    expect(rows(tile("climate.hall"))).toMatchObject({ showTargetTempOnTile: true, showCurrentTempOnTile: true, showActivityStatus: true, statusIconSizeOverride: undefined });
    expect(rows(tile("sensor.temp")).decimalPlaces).toBe(1);
    expect(rows(tile("sensor.temp", { stateValueLabelStyle: "Off" }))).not.toHaveProperty("decimalPlaces");
    expect(rows(tile("climate.hall", { showActivityStatus: false }))).not.toHaveProperty("statusIconSizeOverride");
    expect(rows(tile("person.alex"))).not.toHaveProperty("statusIconSizeOverride");
    expect(watchTileStateCards(tile("light.desk"))[0]!.title).toBe("Brightness Display");

    expect(watchTileHasStateTask(tile("switch.fan"))).toBe(false);
    expect(watchTileHasStateTask(tile("lock.door"))).toBe(false);
    for (const d of watchStateDomains("bars")) expect(watchTileHasStateTask(tile(`${d}.x`)), d).toBe(true);
  });

  it("refuses a row the domain does not show", () => {
    const doc = docWith(tile("switch.fan"));
    expect(setWatchTileShowTargetTemp(doc, PAGE, ID, false)).toBe(doc);
    expect(setWatchTileStateBarStyle(doc, PAGE, ID, "Fill")).toBe(doc);
    expect(setWatchTileShowActivity(doc, PAGE, ID, false)).toBe(doc);
    const climate = docWith(tile("climate.hall"));
    expect(setWatchTileValueLabelStyle(climate, PAGE, ID, "Pill")).toBe(climate);
    const light = docWith(tile("light.desk"));
    expect(setWatchTileDecimals(light, PAGE, ID, 2)).toBe(light);
  });

  it("writes a new key at its sorted place", () => {
    const { tile: t } = edit(tile("climate.hall"), (d) => setWatchTileShowTargetTemp(d, PAGE, ID, false));
    expect(t.showTargetTempOnTile).toBe(false);
    expect(sorted(t)).toBe(true);
  });

  it("takes only the offered values", () => {
    const doc = docWith(tile("light.desk"));
    expect(setWatchTileValueLabelStyle(doc, PAGE, ID, "Huge")).toBe(doc);
    expect(watchStylingChoices("stateValueLabelStyle").map((c) => c.value)).toEqual(["Off", "Plain", "Pill"]);
    expect(tileIn(setWatchTileValueLabelStyle(doc, PAGE, ID, "Pill")).stateValueLabelStyle).toBe("Pill");
    expect(tileIn(setWatchTileStateBarStyle(doc, PAGE, ID, "Fill")).stateBarStyle).toBe("Fill");
  });

  it("sizes are whole numbers in range, and Auto removes the key", () => {
    const doc = docWith(tile("light.desk"));
    const set = setWatchTileStateTextSize(doc, PAGE, ID, 9.4);
    expect(tileIn(set).badgeFontSizeOverride).toBe(9);
    expect(setWatchTileStateTextSize(doc, PAGE, ID, 30)).toBe(doc);
    expect(tileIn(setWatchTileStateTextSize(set, PAGE, ID, null))).not.toHaveProperty("badgeFontSizeOverride");
    const climate = docWith(tile("climate.hall"));
    expect(tileIn(setWatchTileStatusIconSize(climate, PAGE, ID, 20)).statusIconSizeOverride).toBe(20);
    expect(setWatchTileStatusIconSize(docWith(tile("person.alex")), PAGE, ID, 20)).toEqual(docWith(tile("person.alex")));
  });

  it("decimals are the table's choices on a sensor", () => {
    const doc = docWith(tile("sensor.temp"));
    expect(tileIn(setWatchTileDecimals(doc, PAGE, ID, 3)).decimalPlaces).toBe(3);
    expect(setWatchTileDecimals(doc, PAGE, ID, 4)).toBe(doc);
  });
});

describe("State Icons and Colors", () => {
  it("lists the domain's states, narrowed by the entity's attributes", () => {
    expect(watchStateVocabularyRows("light")!.map((r) => r.key)).toEqual(["on", "off"]);
    expect(watchStateVocabularyRows("sensor")).toBeUndefined();
    expect(watchStateVocabularyRows("climate", { hvac_modes: ["heat", "OFF", "eco_mode"] })).toEqual([
      { key: "heat", label: "Heat" },
      { key: "off", label: "Off" },
      { key: "eco_mode", label: "Eco Mode" },
    ]);
    expect(watchStateVocabularyRows("climate")!.length).toBe(7);
    expect(watchStateVocabularyRows("media_player", { supported_features: 1 })!.map((r) => r.key)).toEqual(["playing", "paused", "idle"]);
    expect(watchStateVocabularyRows("media_player", { supported_features: 256 })!.map((r) => r.key)).toEqual(["playing", "idle", "on", "off", "standby"]);
    expect(watchStateVocabularyRows("alarm_control_panel", { supported_features: 2 | 32 })!.map((r) => r.key)).toEqual([
      "disarmed", "armed_away", "armed_vacation", "arming", "pending", "triggered",
    ]);
  });

  it("appends overridden states the list lacks, sorted, with readable labels", () => {
    const card = watchTileStateIcons(tile("light.desk", { stateColors: { zeta_mode: "#FF0000" }, stateIcons: { alpha: "star" }, usesStateIcons: true }))!;
    expect(card.rows.map((r) => [r.key, r.label])).toEqual([["on", "On"], ["off", "Off"], ["alpha", "Alpha"], ["zeta_mode", "Zeta Mode"]]);
    expect(card.any).toBe(true);
    expect(card.rows[2]).toMatchObject({ icon: "star", overridden: true });
  });

  it("labels every appended state of the table's sample as Foundation's capitalized does", () => {
    const sample = watchExtraStateSample();
    expect(sample.overridden.length).toBeGreaterThan(0);
    const stateColors = Object.fromEntries(sample.overridden.map((k) => [k, "#FF0000"]));
    const card = watchTileStateIcons(tile("light.desk", { stateColors, usesStateIcons: true }))!;
    expect(card.rows.map((r) => ({ key: r.key, label: r.label }))).toEqual(sample.rows);
    for (const row of sample.rows) if (!["on", "off"].includes(row.key)) expect(watchExtraStateLabel(row.key), row.key).toBe(row.label);
    expect(watchExtraStateLabel("fan-only")).toBe("Fan-Only");
    expect(watchExtraStateLabel("3rd_floor")).toBe("3Rd Floor");
  });

  it("takes a cover's default icons from its device class", () => {
    const rows = (attributes?: Record<string, unknown>) => watchTileStateIcons(tile("cover.door"), attributes)!.rows;
    const garage = watchStateVocabulary("cover")!.deviceClassIcons.garage!;
    expect(rows({ device_class: "garage" }).find((r) => r.key === "open")!.defaultIcon).toBe(garage.open);
    expect(rows().find((r) => r.key === "open")!.defaultIcon).toBe(watchStateVocabulary("cover")!.defaultIcons.open);
  });

  it("writes lowercased keys in sorted order and syncs usesStateIcons", () => {
    let doc = docWith(tile("light.desk"));
    doc = setWatchTileStateIcon(doc, PAGE, ID, "ON", "lightbulb.fill");
    let t = tileIn(doc);
    expect(t.stateIcons).toEqual({ on: "lightbulb.fill" });
    expect(t.usesStateIcons).toBe(true);
    expect(sorted(t)).toBe(true);
    doc = setWatchTileStateColor(doc, PAGE, ID, "off", "#ff3b30");
    doc = setWatchTileStateColor(doc, PAGE, ID, "idle", "#34C759");
    t = tileIn(doc);
    expect(Object.keys(t.stateColors as object)).toEqual(["idle", "off"]);
    expect((t.stateColors as Json).off).toBe("#FF3B30");
    doc = resetWatchTileState(doc, PAGE, ID, "on");
    t = tileIn(doc);
    expect(t).not.toHaveProperty("stateIcons");
    expect(t.usesStateIcons).toBe(true);
    doc = setWatchTileStateColor(doc, PAGE, ID, "off", null);
    doc = setWatchTileStateColor(doc, PAGE, ID, "idle", null);
    t = tileIn(doc);
    expect(t).not.toHaveProperty("stateColors");
    expect(t).not.toHaveProperty("usesStateIcons");
  });

  it("refuses an empty icon or state, and a color it cannot store", () => {
    const doc = docWith(tile("light.desk"));
    expect(setWatchTileStateIcon(doc, PAGE, ID, "on", "")).toBe(doc);
    expect(setWatchTileStateIcon(doc, PAGE, ID, "", "star")).toBe(doc);
    expect(setWatchTileStateColor(doc, PAGE, ID, "on", "red")).toBe(doc);
    expect(setWatchTileStateColor(doc, PAGE, ID, "on", "#RAINBOW")).toBe(doc);
    expect(resetWatchTileState(doc, PAGE, ID, "on")).toBe(doc);
  });

  it("Clear State Overrides removes all three keys", () => {
    const { tile: t } = edit(tile("light.desk", { stateColors: { on: "#FF0000" }, stateIcons: { off: "x" }, usesStateIcons: true }), (d) =>
      clearWatchTileStateOverrides(d, PAGE, ID));
    expect(t).not.toHaveProperty("stateIcons");
    expect(t).not.toHaveProperty("stateColors");
    expect(t).not.toHaveProperty("usesStateIcons");
  });
});

describe("the Border task", () => {
  it("reads absent keys as a new tile has them", () => {
    expect(watchTileBorderSettings(tile("light.desk"))).toEqual({
      style: "none", thickness: "extraThin", lineStyle: "solid", glow: 0, animation: "none",
      speed: 1, intensity: 1, size: 1, activeOnly: true, color: undefined,
    });
  });

  it("offers the four thicknesses, not none or auto", () => {
    expect(watchStylingChoices("borderThickness").map((c) => c.value)).toEqual(["extraThin", "thin", "medium", "thick"]);
    const doc = docWith(tile("light.desk"));
    expect(setWatchTileBorderThickness(doc, PAGE, ID, "auto")).toBe(doc);
    expect(tileIn(setWatchTileBorderThickness(doc, PAGE, ID, "thick")).borderThickness).toBe("thick");
  });

  it("switching style keeps the other style's keys", () => {
    const { tile: t } = edit(tile("light.desk", { borderAnimation: "chase", borderGlow: 0.4, borderStyle: "animate" }), (d) =>
      setWatchTileBorderStyle(d, PAGE, ID, "line"));
    expect(t).toMatchObject({ borderStyle: "line", borderAnimation: "chase", borderGlow: 0.4 });
  });

  it("glow in tenths; color with Tile color removing the key", () => {
    const doc = docWith(tile("light.desk"));
    expect(tileIn(setWatchTileBorderGlow(doc, PAGE, ID, 0.66)).borderGlow).toBe(0.7);
    const red = setWatchTileBorderColor(doc, PAGE, ID, "#ff0000");
    expect(tileIn(red).borderColor).toBe("#FF0000");
    expect(tileIn(setWatchTileBorderColor(doc, PAGE, ID, "#RAINBOW")).borderColor).toBe("#RAINBOW");
    expect(tileIn(setWatchTileBorderColor(red, PAGE, ID, null))).not.toHaveProperty("borderColor");
  });
});

describe("the Background task", () => {
  it("reads absent keys as the phone decodes them", () => {
    expect(watchTileBackgroundSettings(tile("light.desk"))).toMatchObject({ pattern: "none", patternOpacity: 1, patternScale: 1, effect: "none", effectActiveOnly: false });
  });

  it("pattern, size and color; no rainbow pattern", () => {
    const doc = docWith(tile("light.desk"));
    const set = setWatchTilePattern(doc, PAGE, ID, "dots");
    expect(tileIn(set).backgroundPattern).toBe("dots");
    expect(tileIn(setWatchTilePatternScale(set, PAGE, ID, 2.5)).patternScale).toBe(2.5);
    expect(setWatchTilePatternColor(doc, PAGE, ID, "#RAINBOW")).toBe(doc);
    const gray = setWatchTilePatternColor(doc, PAGE, ID, "#808080");
    expect(tileIn(setWatchTilePatternColor(gray, PAGE, ID, null))).not.toHaveProperty("patternColor");
  });

  it("effect color and speed", () => {
    const doc = docWith(tile("light.desk"));
    expect(tileIn(setWatchTileEffectColor(doc, PAGE, ID, "#RAINBOW")).animationColor).toBe("#RAINBOW");
    expect(tileIn(setWatchTileEffectSpeed(doc, PAGE, ID, 2.6)).animationSpeed).toBe(2.5);
    expect(setWatchTileEffectSpeed(doc, PAGE, ID, 9)).toBe(doc);
  });
});

describe("resets", () => {
  for (const task of ["state", "border", "background"] as const) {
    it(`${task}: writes the phone's keys and removes the null ones`, () => {
      const keys = watchStylingReset(task);
      expect(Object.keys(keys).length).toBeGreaterThan(0);
      const messy: Json = {};
      for (const key of Object.keys(keys)) messy[key] = "changed";
      const { tile: t, before } = edit(tile("light.desk", messy), (d) => resetWatchTileTask(d, PAGE, ID, task));
      for (const [key, value] of Object.entries(keys)) {
        if (value === null) expect(t, key).not.toHaveProperty(key);
        else expect(t[key], key).toEqual(value);
      }
      expect(watchTileTaskModified(tileIn(before), task)).toBe(true);
      expect(watchTileTaskModified(t, task)).toBe(false);
      expect(resetWatchTileTask(docWith(t), PAGE, ID, task)).toEqual(docWith(t));
    });
  }

  it("State reset leaves decimals, Background reset leaves the pattern color and size", () => {
    expect(Object.keys(watchStylingReset("state"))).not.toContain("decimalPlaces");
    expect(Object.keys(watchStylingReset("background"))).not.toContain("patternColor");
    expect(Object.keys(watchStylingReset("background"))).not.toContain("patternScale");
  });
});
