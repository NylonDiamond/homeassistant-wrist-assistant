// A tile's "Show only when" (`showWhen`): the comparison against the watch's
// `VisibilityOperator.evaluate`, the setters, and the preview's reflow. And
// its Show tile template (`showWhenTemplate`): the truthiness the watch's
// `GridConfiguration.TemplateCondition` reads, the setter, the render
// requests and the preview.

import { describe, expect, it } from "vitest";

import pageKeys from "../src/watch-pages/page-keys.json";
import type { HassEntityState } from "../src/ha-api.js";
import type { WatchPage, WatchPageTile, WatchPagesDocument } from "../src/watch-pages/model.js";
import { findWatchPage } from "../src/watch-pages/edit.js";
import { watchReflowPage, watchTileHidden } from "../src/watch-pages/preview.js";
import {
  WATCH_SHOW_WHEN_OPERATOR_VALUES,
  WATCH_SHOW_WHEN_TEMPLATE_MAX_CHARS,
  watchShowWhenCompares,
  watchShowWhenPasses,
  watchShowWhenStateChoices,
  watchShowWhenTemplateShows,
  watchTemplateTruthy,
  watchTileShowWhen,
  watchTileShowWhenTemplate,
} from "../src/watch-pages/show-when.js";
import {
  type WatchTemplateRender,
  watchMergedRenders,
  watchShowWhenTemplateAllows,
  watchShowWhenTemplateKey,
  watchTemplateRequests,
} from "../src/watch-pages/app-model.js";
import {
  setWatchTileShowAlways,
  setWatchTileShowWhenEntity,
  setWatchTileShowWhenTemplate,
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

  it("offers a person home, away and the zones", () => {
    const s = states(state("person.alex", "Work"), state("zone.work", "0", { friendly_name: "Work" }), state("zone.gym", "0", { friendly_name: "Gym" }));
    expect(watchShowWhenStateChoices("person.alex", s)).toEqual([
      { value: "home", label: "Home" },
      { value: "not_home", label: "Away" },
      { value: "Work", label: "Work" },
      { value: "Gym", label: "Gym" },
    ]);
  });

  it("names a binary sensor's on and off in its device class's words", () => {
    const s = states(state("binary_sensor.car_plugged_in", "off", { device_class: "plug" }));
    expect(watchShowWhenStateChoices("binary_sensor.car_plugged_in", s)).toEqual([
      { value: "on", label: "Plugged in" },
      { value: "off", label: "Unplugged" },
    ]);
    expect(watchShowWhenStateChoices("binary_sensor.unknown", {})).toEqual([{ value: "on", label: "On" }, { value: "off", label: "Off" }]);
  });

  it("offers a climate entity's own modes, a select's options and a sensor's reading", () => {
    const s = states(
      state("climate.hall", "heat", { hvac_modes: ["off", "heat"] }),
      state("input_select.mode", "Away", { options: ["Home", "Away"] }),
      state("sensor.car_battery", "42"),
      state("sensor.gone", "unavailable"),
    );
    expect(watchShowWhenStateChoices("climate.hall", s).map((c) => c.value)).toEqual(["off", "heat"]);
    expect(watchShowWhenStateChoices("input_select.mode", s).map((c) => c.value)).toEqual(["Home", "Away"]);
    expect(watchShowWhenStateChoices("sensor.car_battery", s)).toEqual([{ value: "42", label: "42" }]);
    expect(watchShowWhenStateChoices("sensor.gone", s)).toEqual([]);
    expect(watchShowWhenStateChoices("", s)).toEqual([]);
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

describe("Show tile: Template", () => {
  const condition = { comparisonOperator: "eq", entityId: "person.alex", state: "home" };
  const dark = "{{ is_state('sun.sun', 'below_horizon') }}";

  it("reads true as Home Assistant's template conditions do", () => {
    // The same table as the watch's TemplateConditionTests.
    for (const yes of ["true", "True", " TRUE ", "on", "On", "yes", "enable", "1", "2", "-1", "0.5", "1e3", "inf"]) {
      expect(watchTemplateTruthy(yes), yes).toBe(true);
    }
    for (const no of ["", "  ", "false", "off", "no", "disable", "0", "0.0", "-0", "None", "home", "nan", "[]", "{}", "truthy"]) {
      expect(watchTemplateTruthy(no), no).toBe(false);
    }
  });

  it("shows the tile with no render, a failed one, or unknown and unavailable", () => {
    expect(watchShowWhenTemplateShows(undefined)).toBe(true);
    expect(watchShowWhenTemplateShows({ ok: false, error: "UndefinedError: 'x' is undefined" })).toBe(true);
    expect(watchShowWhenTemplateShows({ ok: true, value: "unknown" })).toBe(true);
    expect(watchShowWhenTemplateShows({ ok: true, value: "Unavailable" })).toBe(true);
    expect(watchShowWhenTemplateShows({ ok: true, value: "true" })).toBe(true);
    expect(watchShowWhenTemplateShows({ ok: true, value: "false" })).toBe(false);
    expect(watchShowWhenTemplateShows({ ok: true, value: "" })).toBe(false);
  });

  it("is listed in page-keys.json as an optional string", () => {
    const tile = (pageKeys as { types: Record<string, { keys: Record<string, unknown> }> }).types.tile!.keys;
    expect(tile.showWhenTemplate).toEqual({ type: "string", required: false });
  });

  it("reads a blank text as none", () => {
    expect(watchTileShowWhenTemplate({ ...door, showWhenTemplate: dark } as WatchPageTile)).toBe(dark);
    expect(watchTileShowWhenTemplate({ ...door, showWhenTemplate: " \n " } as WatchPageTile)).toBeUndefined();
    expect(watchTileShowWhenTemplate({ ...door, showWhenTemplate: 3 } as WatchPageTile)).toBeUndefined();
  });

  it("is a choice of its own, after a stored condition", () => {
    expect(watchShowTileMode({ ...door, showWhenTemplate: dark } as WatchPageTile)).toBe("template");
    expect(watchShowTileMode({ ...door, hideWhenInactive: true, showWhenTemplate: dark } as WatchPageTile)).toBe("template");
    expect(watchShowTileMode({ ...door, showWhen: condition, showWhenTemplate: dark } as WatchPageTile)).toBe("when");
  });

  it("writes the text as typed and drops the other choices", () => {
    const both = docWith({ ...door, hideWhenInactive: true, showWhen: condition });
    const written = tileIn(setWatchTileShowWhenTemplate(both, PAGE, DOOR, dark));
    expect(written.showWhenTemplate).toBe(dark);
    expect(Object.hasOwn(written, "hideWhenInactive") || Object.hasOwn(written, "showWhen")).toBe(false);
    // Spaces typed so far stay.
    expect(tileIn(setWatchTileShowWhenTemplate(both, PAGE, DOOR, "{{ ")).showWhenTemplate).toBe("{{ ");
    // Empty is Always again.
    const withText = docWith({ ...door, showWhenTemplate: dark });
    expect(Object.hasOwn(tileIn(setWatchTileShowWhenTemplate(withText, PAGE, DOOR, "")), "showWhenTemplate")).toBe(false);
    expect(setWatchTileShowWhenTemplate(withText, PAGE, DOOR, dark)).toBe(withText);
    expect(setWatchTileShowWhenTemplate(withText, PAGE, DOOR, 3 as never)).toBe(withText);
  });

  it("goes when another choice is made", () => {
    const withText = docWith({ ...door, showWhenTemplate: dark });
    expect(Object.hasOwn(tileIn(setWatchTileShowAlways(withText, PAGE, DOOR)), "showWhenTemplate")).toBe(false);
    expect(Object.hasOwn(tileIn(setWatchTileShowWhileOn(withText, PAGE, DOOR)), "showWhenTemplate")).toBe(false);
    expect(Object.hasOwn(tileIn(setWatchTileShowWhenEntity(withText, PAGE, DOOR, "person.alex", "home")), "showWhenTemplate")).toBe(false);
  });

  it("is rendered with the page's template tiles, under a key of its own", () => {
    const tpl = { id: "T", entityId: "template.X", templateString: "{{ 1 }}", showWhenTemplate: dark } as WatchPageTile;
    const blank = { id: "B", entityId: "light.b", showWhenTemplate: "  " } as WatchPageTile;
    const long = { id: "G", entityId: "light.g", showWhenTemplate: "x".repeat(WATCH_SHOW_WHEN_TEMPLATE_MAX_CHARS + 1) } as WatchPageTile;
    const page = { id: PAGE, name: "Home", items: [{ ...door, showWhenTemplate: dark }, tpl, blank, long] } as WatchPage;
    expect(watchTemplateRequests(page)).toEqual({
      [watchShowWhenTemplateKey(DOOR)]: dark,
      [watchShowWhenTemplateKey("T")]: dark,
      T: "{{ 1 }}",
    });
  });

  describe("the preview", () => {
    const front = { ...door, showWhenTemplate: dark } as WatchPageTile;
    const lamp = { id: "L", entityId: "light.lamp", gridRow: 0, gridCol: 4, colSpan: 4, rowSpan: 4 } as WatchPageTile;
    const page = { id: PAGE, name: "Home", items: [front, lamp] } as WatchPage;
    const on = states(state("light.lamp", "on"));
    const renders = (value: string, text = dark): Map<string, WatchTemplateRender> =>
      watchMergedRenders(new Map(), { [watchShowWhenTemplateKey(DOOR)]: text }, { [watchShowWhenTemplateKey(DOOR)]: { ok: true, value } });

    it("hides the tile while the template renders false, and packs the rest", () => {
      expect(watchTileHidden(front, on, renders("false"))).toBe(true);
      const packed = watchReflowPage(page, on, 12, renders("false")).items as WatchPageTile[];
      expect(packed.map((t) => t.id)).toEqual(["L"]);
    });

    it("keeps it while true, before the first render, and for a render of another text", () => {
      expect(watchTileHidden(front, on, renders("true"))).toBe(false);
      expect(watchTileHidden(front, on)).toBe(false);
      expect(watchShowWhenTemplateAllows(renders("false", "{{ false }}"), front)).toBe(true);
      expect(watchReflowPage(page, on, 12, renders("true"))).toBe(page);
    });

    it("needs Hide when off and Only when to pass too", () => {
      const off = states(state("light.lamp", "off"));
      const both = { ...lamp, hideWhenInactive: true, showWhenTemplate: dark } as WatchPageTile;
      const r = watchMergedRenders(new Map(), { [watchShowWhenTemplateKey("L")]: dark }, { [watchShowWhenTemplateKey("L")]: { ok: true, value: "true" } });
      expect(watchTileHidden(both, off, r)).toBe(true);
      expect(watchTileHidden(both, on, r)).toBe(false);
      const gated = { ...front, showWhen: condition } as WatchPageTile;
      expect(watchTileHidden(gated, states(state("person.alex", "not_home")), renders("true"))).toBe(true);
    });
  });
});
