// A tile's "Show only when" (`showWhen`): the comparison against the watch's
// `VisibilityOperator.evaluate`, the setters, and the preview's reflow.

import { describe, expect, it } from "vitest";

import pageKeys from "../src/watch-pages/page-keys.json";
import type { HassEntityState } from "../src/ha-api.js";
import type { WatchPage, WatchPageTile, WatchPagesDocument } from "../src/watch-pages/model.js";
import { findWatchPage } from "../src/watch-pages/edit.js";
import { watchReflowPage, watchTileHidden } from "../src/watch-pages/preview.js";
import {
  WATCH_SHOW_WHEN_OPERATOR_VALUES,
  watchShowWhenCompares,
  watchShowWhenPasses,
  watchShowWhenStateSuggestions,
  watchTileShowWhen,
} from "../src/watch-pages/show-when.js";
import {
  setWatchTileShowAlways,
  setWatchTileShowWhenEntity,
  setWatchTileShowWhileOn,
  watchShowTileMode,
  setWatchTileShowWhenOperator,
  setWatchTileShowWhenState,
} from "../src/watch-pages/tile-settings-model.js";

const PAGE = "C3A0E000-0000-4000-8000-0000000000AA";
const DOOR = "C3A0E000-0000-4000-8000-0000000000D1";

function state(entityId: string, value: string, attributes: Record<string, unknown> = {}): HassEntityState {
  return { entity_id: entityId, state: value, attributes, last_changed: "", last_updated: "" };
}

function states(...list: HassEntityState[]): Record<string, HassEntityState> {
  return Object.fromEntries(list.map((s) => [s.entity_id, s]));
}

function docWith(tile: Record<string, unknown>): WatchPagesDocument {
  return Object.freeze({ schemaVersion: 1, pages: [{ id: PAGE, name: "Home", items: [{ ...tile }] }] }) as WatchPagesDocument;
}

function tileIn(document: WatchPagesDocument): WatchPageTile {
  return (findWatchPage(document, PAGE)!.items as WatchPageTile[])[0]!;
}

const door: Record<string, unknown> = { id: DOOR, entityId: "lock.front_door", gridRow: 0, gridCol: 0, colSpan: 4, rowSpan: 4 };

describe("the comparison", () => {
  it("offers exactly the operators page-keys.json lists", () => {
    expect([...WATCH_SHOW_WHEN_OPERATOR_VALUES]).toEqual(pageKeys.enums.VisibilityOperator);
  });

  it("compares text ignoring case and numbers only as numbers", () => {
    expect(watchShowWhenCompares("eq", "Home", "home")).toBe(true);
    expect(watchShowWhenCompares("neq", "home", "home")).toBe(false);
    expect(watchShowWhenCompares("contains", "armed_away", "ARMED")).toBe(true);
    expect(watchShowWhenCompares("gt", "21.5", "20")).toBe(true);
    expect(watchShowWhenCompares("lt", "21.5", "20")).toBe(false);
    expect(watchShowWhenCompares("gte", "20", "20")).toBe(true);
    expect(watchShowWhenCompares("lte", "1e2", "100")).toBe(true);
    // Swift's Double("") and Double("unavailable") are nil: false, not 0.
    expect(watchShowWhenCompares("lt", "", "5")).toBe(false);
    expect(watchShowWhenCompares("gt", "unavailable", "5")).toBe(false);
  });

  it("shows the tile while the entity has no state, as the watch does before its first data", () => {
    const c = { entityId: "person.alex", comparisonOperator: "eq" as const, state: "home" };
    expect(watchShowWhenPasses(c, {})).toBe(true);
    expect(watchShowWhenPasses(c, states(state("person.alex", "not_home")))).toBe(false);
    expect(watchShowWhenPasses(c, states(state("person.alex", "home")))).toBe(true);
  });

  it("reads only a whole condition", () => {
    expect(watchTileShowWhen({ id: DOOR, entityId: "lock.a" })).toBeUndefined();
    expect(watchTileShowWhen({ id: DOOR, entityId: "lock.a", showWhen: { entityId: "person.a", state: "home" } })).toBeUndefined();
    expect(watchTileShowWhen({ id: DOOR, entityId: "lock.a", showWhen: { entityId: "person.a", comparisonOperator: "between", state: "home" } })).toBeUndefined();
    expect(watchTileShowWhen({ id: DOOR, entityId: "lock.a", showWhen: { entityId: "person.a", comparisonOperator: "neq", state: "home" } }))
      .toEqual({ entityId: "person.a", comparisonOperator: "neq", state: "home" });
  });

  it("suggests the state now first, then the domain's usual ones and the zones", () => {
    const s = states(state("person.alex", "Work"), state("zone.work", "0", { friendly_name: "Work" }), state("zone.gym", "0", { friendly_name: "Gym" }));
    expect(watchShowWhenStateSuggestions("person.alex", s)).toEqual(["Work", "home", "not_home", "Gym", "unavailable"]);
    expect(watchShowWhenStateSuggestions("binary_sensor.car_plugged_in", {})).toEqual(["on", "off", "unavailable"]);
  });
});

describe("the setters", () => {
  it("make a condition from an entity, in the phone's key order", () => {
    const next = setWatchTileShowWhenEntity(docWith(door), PAGE, DOOR, "person.alex", "home");
    const written = tileIn(next).showWhen as Record<string, unknown>;
    expect(written).toEqual({ comparisonOperator: "eq", entityId: "person.alex", state: "home" });
    expect(Object.keys(written)).toEqual(["comparisonOperator", "entityId", "state"]);
  });

  it("keep the comparison when the entity changes", () => {
    const doc = docWith({ ...door, showWhen: { comparisonOperator: "neq", entityId: "person.alex", state: "home" } });
    expect(tileIn(setWatchTileShowWhenEntity(doc, PAGE, DOOR, "person.sam", "work")).showWhen)
      .toEqual({ comparisonOperator: "neq", entityId: "person.sam", state: "work" });
  });

  it("change the comparison and the state, and remove the condition", () => {
    const doc = docWith({ ...door, showWhen: { comparisonOperator: "eq", entityId: "sensor.battery", state: "20" } });
    expect(tileIn(setWatchTileShowWhenOperator(doc, PAGE, DOOR, "gt")).showWhen).toEqual({ comparisonOperator: "gt", entityId: "sensor.battery", state: "20" });
    expect(tileIn(setWatchTileShowWhenState(doc, PAGE, DOOR, "50")).showWhen).toEqual({ comparisonOperator: "eq", entityId: "sensor.battery", state: "50" });
    expect(Object.hasOwn(tileIn(setWatchTileShowWhenEntity(doc, PAGE, DOOR, null)), "showWhen")).toBe(false);
  });

  it("refuse what is no entity id, and edits with no condition to edit", () => {
    const doc = docWith(door);
    expect(setWatchTileShowWhenEntity(doc, PAGE, DOOR, "not an id")).toBe(doc);
    expect(setWatchTileShowWhenOperator(doc, PAGE, DOOR, "gt")).toBe(doc);
    expect(setWatchTileShowWhenState(doc, PAGE, DOOR, "on")).toBe(doc);
    expect(setWatchTileShowWhenOperator(doc, PAGE, DOOR, "between" as never)).toBe(doc);
  });

  it("return the document as given for the stored value", () => {
    const doc = docWith({ ...door, showWhen: { comparisonOperator: "eq", entityId: "person.alex", state: "home" } });
    expect(setWatchTileShowWhenEntity(doc, PAGE, DOOR, "person.alex", "home")).toBe(doc);
    expect(setWatchTileShowWhenOperator(doc, PAGE, DOOR, "eq")).toBe(doc);
    expect(setWatchTileShowWhenState(doc, PAGE, DOOR, "home")).toBe(doc);
  });
});

describe("Show tile", () => {
  const condition = { comparisonOperator: "eq", entityId: "person.alex", state: "home" };

  it("reads one choice, a stored condition first", () => {
    expect(watchShowTileMode(door as WatchPageTile)).toBe("always");
    expect(watchShowTileMode({ ...door, hideWhenInactive: true } as WatchPageTile)).toBe("on");
    expect(watchShowTileMode({ ...door, showWhen: condition } as WatchPageTile)).toBe("when");
    expect(watchShowTileMode({ ...door, hideWhenInactive: true, showWhen: { bad: 1 } } as WatchPageTile)).toBe("when");
  });

  it("writes only the chosen key", () => {
    const both = docWith({ ...door, hideWhenInactive: true, showWhen: condition });
    const always = tileIn(setWatchTileShowAlways(both, PAGE, DOOR));
    expect(Object.hasOwn(always, "hideWhenInactive") || Object.hasOwn(always, "showWhen")).toBe(false);
    const on = tileIn(setWatchTileShowWhileOn(both, PAGE, DOOR));
    expect(on.hideWhenInactive).toBe(true);
    expect(Object.hasOwn(on, "showWhen")).toBe(false);
    const when = tileIn(setWatchTileShowWhenEntity(docWith({ ...door, hideWhenInactive: true }), PAGE, DOOR, "person.alex", "home"));
    expect(when.showWhen).toEqual(condition);
    expect(Object.hasOwn(when, "hideWhenInactive")).toBe(false);
  });

  it("returns the document as given when the choice is already stored", () => {
    const plain = docWith(door);
    expect(setWatchTileShowAlways(plain, PAGE, DOOR)).toBe(plain);
    const on = docWith({ ...door, hideWhenInactive: true });
    expect(setWatchTileShowWhileOn(on, PAGE, DOOR)).toBe(on);
  });
});

describe("the preview", () => {
  const front = { ...door, showWhen: { comparisonOperator: "eq", entityId: "person.alex", state: "home" } } as WatchPageTile;
  const lamp = { id: "L", entityId: "light.lamp", gridRow: 0, gridCol: 4, colSpan: 4, rowSpan: 4 } as WatchPageTile;
  const page = { id: PAGE, name: "Home", items: [front, lamp] } as WatchPage;

  it("hides a tile while its condition fails, and packs the rest", () => {
    const away = states(state("person.alex", "not_home"), state("light.lamp", "on"));
    expect(watchTileHidden(front, away)).toBe(true);
    const packed = watchReflowPage(page, away).items as WatchPageTile[];
    expect(packed.map((t) => t.id)).toEqual(["L"]);
    expect(packed[0]!.gridCol).toBe(0);
  });

  it("keeps the tile while its condition holds", () => {
    const home = states(state("person.alex", "home"), state("light.lamp", "on"));
    expect(watchTileHidden(front, home)).toBe(false);
    expect(watchReflowPage(page, home)).toBe(page);
  });
});
