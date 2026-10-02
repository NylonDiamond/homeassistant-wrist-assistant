// The Add tile dialog's list without the dialog: which entities it offers,
// that it ranks with the panel's entity search, that a fresh `hass` with new
// state values hands back the very same rows (so the list neither jumps nor
// loses its highlight while Home Assistant ticks), the paging, the
// highlight, and the words.

import { describe, expect, it } from "vitest";
import type { HassEntityState } from "../src/ha-api.js";
import {
  WATCH_ADD_ROWS,
  WatchAddListCache,
  type WatchAddPoolInput,
  watchAddEmptyText,
  watchAddHighlightIndex,
  watchAddMoreText,
  watchAddNextOpen,
  watchAddPool,
  watchAddRefusalText,
  watchAddResults,
  watchAddRowCount,
  watchAddStep,
  watchAddedCountText,
  watchLeftOutText,
} from "../src/watch-pages/add-tile-list.js";
import type { WatchAddRefusal } from "../src/watch-pages/tile-new.js";

function st(entityId: string, state: string, friendly?: string): HassEntityState {
  return {
    entity_id: entityId,
    state,
    attributes: friendly === undefined ? {} : { friendly_name: friendly },
    last_changed: "2026-10-01T08:00:00Z",
    last_updated: "2026-10-01T08:00:00Z",
  };
}

function states(list: HassEntityState[]): Record<string, HassEntityState> {
  return Object.fromEntries(list.map((s) => [s.entity_id, s]));
}

const HOME = states([
  st("light.kitchen", "on", "Kitchen"),
  st("light.porch", "off", "Porch Lamp"),
  st("switch.kettle", "off", "Kettle"),
  st("sensor.kitchen_temperature", "21.5", "Kitchen Temperature"),
  st("binary_sensor.back_door", "off", "Back Door"),
  st("media_player.lounge", "playing", "Lounge"),
  st("sun.sun", "above_horizon", "Sun"),
  st("group.downstairs", "on", "Downstairs"),
  st("light.no_name", "on"),
]);

const REGISTRIES = {
  entities: {
    "light.kitchen": { area_id: "kitchen", device_id: null },
    "switch.kettle": { area_id: null, device_id: "dev_kettle" },
  },
  devices: { dev_kettle: { area_id: "kitchen", name: "Kettle plug" } },
  areas: { kitchen: { name: "Kitchen" } },
};

function input(over: Partial<WatchAddPoolInput> = {}): WatchAddPoolInput {
  return { hass: { states: HOME, ...REGISTRIES }, onPage: new Set(), keep: new Set(), ...over };
}

/** A new `hass` as Home Assistant hands one over: every state a new object,
 * values moved, ids and names the same. */
function ticked(from: Record<string, HassEntityState>): Record<string, HassEntityState> {
  return Object.fromEntries(
    Object.entries(from).map(([id, s]) => [id, { ...s, state: `${s.state}!`, attributes: { ...s.attributes } }]),
  );
}

const ids = (rows: readonly { entityId: string }[]) => rows.map((r) => r.entityId);

describe("the pool", () => {
  it("offers every addable entity not on the page, by name, and counts the rest as left out", () => {
    const pool = watchAddPool(input({ onPage: new Set(["light.kitchen"]) }));
    expect(ids(pool.candidates)).toEqual([
      "binary_sensor.back_door",
      "switch.kettle",
      "sensor.kitchen_temperature",
      "light.no_name",
      "media_player.lounge",
      "light.porch",
    ]);
    // `sun` and `group` have no tile on the watch.
    expect(pool.leftOut).toBe(2);
    expect(ids(pool.onPage)).toEqual(["light.kitchen"]);
  });

  it("names each row's kind as the phone's add does, and takes the area from the registries", () => {
    const pool = watchAddPool(input());
    const byId = new Map(pool.candidates.map((c) => [c.entityId, c]));
    expect(byId.get("light.kitchen")).toMatchObject({ name: "Kitchen", kind: "Lights", area: "Kitchen" });
    // The device's area when the entity has none of its own.
    expect(byId.get("switch.kettle")).toMatchObject({ kind: "Switches", area: "Kitchen" });
    expect(byId.get("binary_sensor.back_door")).toMatchObject({ kind: "Sensors" });
    expect(byId.get("binary_sensor.back_door")?.area).toBeUndefined();
    // No friendly name: the search row's name is the id, as in the panel.
    expect(byId.get("light.no_name")?.name).toBe("light.no_name");
  });

  it("lists the kinds by name with how many can still be added", () => {
    const pool = watchAddPool(input({ onPage: new Set(["light.porch"]) }));
    expect(pool.kinds).toEqual([
      { name: "Lights", count: 2 },
      { name: "Media Players", count: 1 },
      { name: "Sensors", count: 2 },
      { name: "Switches", count: 1 },
    ]);
  });

  it("keeps a row added during this search, without counting it", () => {
    const pool = watchAddPool(input({ onPage: new Set(["light.kitchen"]), keep: new Set(["light.kitchen"]) }));
    expect(ids(pool.candidates)).toContain("light.kitchen");
    expect(pool.onPage).toEqual([]);
    expect(pool.kinds.find((k) => k.name === "Lights")?.count).toBe(2);
  });

  it("is empty for a home with nothing", () => {
    const pool = watchAddPool({ hass: { states: {} }, onPage: new Set(), keep: new Set() });
    expect(pool).toEqual({ candidates: [], onPage: [], kinds: [], leftOut: 0 });
  });
});

describe("the rows of a search", () => {
  const pool = watchAddPool(input());

  it("an empty search keeps the order by name", () => {
    expect(ids(watchAddResults(pool.candidates, "", ""))).toEqual(ids(pool.candidates));
    expect(watchAddResults(pool.candidates, "  ", "")).not.toBe(pool.candidates);
  });

  it("ranks as the panel's entity search does: the exact id, then ids, then names, then the room", () => {
    expect(ids(watchAddResults(pool.candidates, "light.porch", ""))).toEqual(["light.porch"]);
    expect(ids(watchAddResults(pool.candidates, "kitchen", ""))).toEqual([
      // Name starts with it.
      "light.kitchen",
      "sensor.kitchen_temperature",
      // Only the room matches.
      "switch.kettle",
    ]);
    expect(ids(watchAddResults(pool.candidates, "lamp porch", ""))).toEqual(["light.porch"]);
  });

  it("narrows to one kind", () => {
    expect(ids(watchAddResults(pool.candidates, "", "Sensors"))).toEqual([
      "binary_sensor.back_door",
      "sensor.kitchen_temperature",
    ]);
    expect(ids(watchAddResults(pool.candidates, "kitchen", "Lights"))).toEqual(["light.kitchen"]);
  });

  it("has no limit: the dialog pages through them itself", () => {
    const many = states(Array.from({ length: 500 }, (_, i) => st(`light.bulk_${String(i).padStart(3, "0")}`, "on")));
    const big = watchAddPool({ hass: { states: many }, onPage: new Set(), keep: new Set() });
    expect(watchAddResults(big.candidates, "bulk", "")).toHaveLength(500);
  });
});

describe("the cache", () => {
  it("hands back the same pool and rows when only state values moved", () => {
    const cache = new WatchAddListCache();
    const onPage = new Set(["light.kitchen"]);
    const pool = cache.poolFor(input({ onPage }));
    const rows = cache.resultsOf(pool, "k", "");
    const next = cache.poolFor(input({ hass: { states: ticked(HOME), ...REGISTRIES }, onPage: new Set(onPage) }));
    expect(next).toBe(pool);
    expect(cache.resultsOf(next, "k", "")).toBe(rows);
  });

  it("builds again when an entity comes or goes, or a name changes", () => {
    const cache = new WatchAddListCache();
    const pool = cache.poolFor(input());
    const more = { ...HOME, "light.attic": st("light.attic", "off", "Attic") };
    const withAttic = cache.poolFor(input({ hass: { states: more, ...REGISTRIES } }));
    expect(withAttic).not.toBe(pool);
    expect(ids(withAttic.candidates)).toContain("light.attic");
    const renamed = { ...more, "light.attic": st("light.attic", "off", "Loft") };
    const withLoft = cache.poolFor(input({ hass: { states: renamed, ...REGISTRIES } }));
    expect(withLoft).not.toBe(withAttic);
    expect(withLoft.candidates.find((c) => c.entityId === "light.attic")?.name).toBe("Loft");
  });

  it("builds again when the page, the kept rows or a registry change", () => {
    const cache = new WatchAddListCache();
    const pool = cache.poolFor(input());
    const added = cache.poolFor(input({ onPage: new Set(["light.porch"]) }));
    expect(added).not.toBe(pool);
    const kept = cache.poolFor(input({ onPage: new Set(["light.porch"]), keep: new Set(["light.porch"]) }));
    expect(kept).not.toBe(added);
    expect(cache.poolFor(input({ onPage: new Set(["light.porch"]), keep: new Set(["light.porch"]) }))).toBe(kept);
    const areas = { kitchen: { name: "Galley" } };
    const moved = cache.poolFor(input({
      hass: { states: HOME, ...REGISTRIES, areas },
      onPage: new Set(["light.porch"]),
      keep: new Set(["light.porch"]),
    }));
    expect(moved).not.toBe(kept);
    expect(moved.candidates.find((c) => c.entityId === "light.kitchen")?.area).toBe("Galley");
  });

  it("ranks again for another search or kind", () => {
    const cache = new WatchAddListCache();
    const pool = cache.poolFor(input());
    const a = cache.resultsOf(pool, "k", "");
    expect(cache.resultsOf(pool, "ki", "")).not.toBe(a);
    const b = cache.resultsOf(pool, "ki", "Lights");
    expect(ids(b)).toEqual(["light.kitchen"]);
    expect(cache.resultsOf(pool, "ki", "Lights")).toBe(b);
  });
});

describe("paging and the highlight", () => {
  it("draws a page of rows at first, all of a short list, and always the highlighted row", () => {
    expect(WATCH_ADD_ROWS).toBe(60);
    expect(watchAddRowCount(3000, WATCH_ADD_ROWS, 0)).toBe(60);
    expect(watchAddRowCount(25, WATCH_ADD_ROWS, 0)).toBe(25);
    expect(watchAddRowCount(3000, 120, 5)).toBe(120);
    expect(watchAddRowCount(3000, 60, 60)).toBe(120);
    expect(watchAddRowCount(3000, 60, 250)).toBe(300);
    expect(watchAddRowCount(130, 60, 125)).toBe(130);
    expect(watchAddRowCount(0, 60, -1)).toBe(0);
  });

  it("keeps the highlight on its entity, else the first row", () => {
    const rows = [{ entityId: "a.a" }, { entityId: "b.b" }, { entityId: "c.c" }] as never[];
    expect(watchAddHighlightIndex(rows, undefined)).toBe(0);
    expect(watchAddHighlightIndex(rows, "c.c")).toBe(2);
    expect(watchAddHighlightIndex(rows, "gone.gone")).toBe(0);
    expect(watchAddHighlightIndex([], "a.a")).toBe(-1);
  });

  it("moves the highlight inside the list, without wrapping", () => {
    expect(watchAddStep(0, 1, 3)).toBe(1);
    expect(watchAddStep(2, 1, 3)).toBe(2);
    expect(watchAddStep(0, -1, 3)).toBe(0);
    expect(watchAddStep(1, 10, 3)).toBe(2);
    expect(watchAddStep(-1, 1, 0)).toBe(-1);
  });

  it("goes on to the next row that can still be added after an add", () => {
    const rows = ["a.a", "b.b", "c.c", "d.d"].map((entityId) => ({ entityId })) as never[];
    const added = new Set(["c.c"]);
    expect(watchAddNextOpen(rows, 1, (id) => id === "b.b" || added.has(id))).toBe(3);
    expect(watchAddNextOpen(rows, 3, (id) => id === "d.d" || added.has(id))).toBe(1);
    expect(watchAddNextOpen(rows.slice(0, 1), 0, () => true)).toBe(0);
  });
});

describe("words", () => {
  it("says why an add was refused, for every reason", () => {
    const all: Record<WatchAddRefusal, string> = {
      onPage: "Kitchen is already on this page.",
      smartPage: "This page fills itself with tiles, so none can be added by hand.",
      systemPage: "This page belongs to the app, so no tiles can be added to it.",
      noPage: "This page is gone. It may have been deleted on the iPhone.",
      badItems: "The tiles on this page could not be read, so adding one would lose them.",
    };
    for (const [code, text] of Object.entries(all)) {
      expect(watchAddRefusalText(code as WatchAddRefusal, "Kitchen")).toBe(text);
    }
    expect(watchAddRefusalText("onPage")).toBe("That entity is already on this page.");
  });

  it("counts the visit and the left out entities", () => {
    expect(watchAddedCountText(0)).toBe("No tiles added yet.");
    expect(watchAddedCountText(1)).toBe("1 tile added.");
    expect(watchAddedCountText(3)).toBe("3 tiles added.");
    expect(watchLeftOutText(0)).toBeUndefined();
    expect(watchLeftOutText(1)).toBe("1 entity is left out: the watch has no tile for its kind.");
    expect(watchLeftOutText(12)).toBe("12 entities are left out: the watch has no tile for their kind.");
  });

  it("says how many more rows a press shows", () => {
    expect(watchAddMoreText(12)).toBe("Show 12 more");
    expect(watchAddMoreText(60)).toBe("Show 60 more");
    expect(watchAddMoreText(240)).toBe("Show 60 more (240 left)");
  });

  it("says why the list is empty, naming an entity that is on the page already", () => {
    expect(watchAddEmptyText("", "", 0)).toBe("Every entity the watch has a tile for is on this page already.");
    expect(watchAddEmptyText("zz", "", 5)).toBe("Nothing matches that search.");
    expect(watchAddEmptyText("zz", "Lights", 5)).toBe("Nothing of that kind matches the search.");
    expect(watchAddEmptyText("", "Lights", 5)).toBe("Nothing of that kind is left to add.");
    expect(watchAddEmptyText("kitch", "", 5, [{ name: "Kitchen" }])).toBe("Kitchen is already on this page.");
    expect(watchAddEmptyText("kitch", "", 5, [{ name: "A" }, { name: "B" }])).toBe(
      "The 2 entities that match are already on this page.",
    );
  });

  it("never breaks a sentence with a dash", () => {
    const texts = [
      ...(["onPage", "smartPage", "systemPage", "noPage", "badItems"] as const).map((c) => watchAddRefusalText(c, "X")),
      watchAddedCountText(2),
      watchLeftOutText(2)!,
      watchAddMoreText(200),
      watchAddEmptyText("q", "Lights", 3),
    ];
    for (const t of texts) expect(t).not.toMatch(/[–—]| - /);
  });
});
