// New tiles as the phone builds them: every case file the app writes into
// `fixtures-pages/add` (the whole tile, to the byte), the test vectors in
// `tile-defaults.json` (the gradient form, the calendar color, the label),
// what the panel reads from Home Assistant, the refusals, and that an add
// copies only the path to the new tile.

import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

import type { WatchPage, WatchPageTile, WatchPagesDocument } from "../src/watch-pages/model.js";
import {
  type WatchHassView,
  type WatchTileAdd,
  WATCH_TILE_DEFAULTS,
  addNewWatchTile,
  addWatchTile,
  newWatchEntityTile,
  newWatchHeaderTile,
  newWatchPageLinkTile,
  newWatchSpacerTile,
  watchAddRefusal,
  watchAddThemeOf,
  watchAddableDomain,
  watchAddableEntityIds,
  watchCalendarColor,
  watchEntityAddFromHass,
  watchEntityDefaults,
  watchEntityLabel,
  watchGradientOf,
  watchLinkTargetPages,
  watchThemeDisplayName,
  watchThemeNames,
  watchThemeRoleColors,
  watchThemeSwatches,
} from "../src/watch-pages/tile-new.js";

function deepFreeze<T>(value: T): T {
  if (typeof value === "object" && value !== null && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const v of Object.values(value)) deepFreeze(v);
  }
  return value;
}

/** A generator that hands out these ids in order and fails past the end. */
function ids(list: readonly string[]) {
  let next = 0;
  const gen = () => {
    if (next >= list.length) throw new Error("the add took more ids than the case gives");
    return list[next++]!;
  };
  return { newId: gen, used: () => next };
}

const PAGE_ID = "C3A0E000-0000-4000-8000-0000000000AA";

// ── the case files ───────────────────────────────────────────────────────

interface AddCase {
  name: string;
  page: { themeOverride?: string; useGradientColors?: boolean; items: WatchPageTile[] };
  add: WatchTileAdd;
  ids: string[];
  expected: WatchPageTile | null;
}

describe("every add case file", () => {
  const dir = join(__dirname, "fixtures-pages", "add");
  const files = readdirSync(dir).filter((f) => f.endsWith(".json")).sort();

  it("finds the case files", () => {
    expect(files.length).toBeGreaterThanOrEqual(144);
  });

  for (const file of files) {
    it(file, () => {
      const c = JSON.parse(readFileSync(join(dir, file), "utf8")) as AddCase;
      const document = deepFreeze<WatchPagesDocument>({
        schemaVersion: 1,
        pages: [{ id: PAGE_ID, name: "Test", ...c.page }],
      });
      const gen = ids(c.ids);
      const result = addNewWatchTile(document, PAGE_ID, c.add, { newId: gen.newId });
      expect(gen.used()).toBe(c.ids.length);
      if (c.expected === null) {
        expect(result.document).toBe(document);
        expect(result.refusal).toBeDefined();
        expect(result.tile).toBeUndefined();
        return;
      }
      expect(result.refusal).toBeUndefined();
      const items = ((result.document.pages as WatchPage[])[0]!.items as WatchPageTile[]);
      const tile = items[items.length - 1]!;
      expect(tile).toEqual(c.expected);
      expect(JSON.stringify(tile)).toBe(JSON.stringify(c.expected));
      expect(result.tile).toBe(tile);
      expect(items.slice(0, -1)).toEqual(c.page.items);
      items.slice(0, -1).forEach((t, i) => expect(t).toBe(c.page.items[i]));
    });
  }
});

// ── the table's test vectors ─────────────────────────────────────────────

describe("watchGradientOf", () => {
  for (const name of WATCH_TILE_DEFAULTS.themeOrder) {
    const theme = WATCH_TILE_DEFAULTS.themes[name]!;
    it(`gives every role and swatch of ${name} as the table has it`, () => {
      for (const [role, solid] of Object.entries(theme.roles)) {
        expect(watchGradientOf(solid), role).toBe(theme.gradientRoles[role]);
      }
      expect(theme.expandedSwatchHexes.length).toBe(theme.expandedSwatchGradients.length);
      theme.expandedSwatchHexes.forEach((solid, i) => {
        expect(watchGradientOf(solid), solid).toBe(theme.expandedSwatchGradients[i]);
      });
    });
  }

  it("keeps the rainbow and a gradient as given, and normalizes a solid", () => {
    expect(watchGradientOf("#RAINBOW")).toBe("#RAINBOW");
    expect(watchGradientOf("GRADIENT|#112233|#445566")).toBe("GRADIENT|#112233|#445566");
    expect(watchGradientOf(" ffc145 ")).toBe("GRADIENT|#FFC145|#3BBED9");
  });

  it("moves a gray's brightness instead of its hue, rounding half away from zero", () => {
    // 128 / 255 less 0.3 is 51.5 of 255; 32 / 255 plus 0.3 is 108.5 of 255.
    expect(watchGradientOf("#808080")).toBe("GRADIENT|#808080|#343434");
    expect(watchGradientOf("#202020")).toBe("GRADIENT|#202020|#6D6D6D");
  });

  it("gives a value that is no color itself as both ends", () => {
    expect(watchGradientOf("#12")).toBe("GRADIENT|#12|#12");
  });
});

describe("watchCalendarColor", () => {
  for (const [entityId, color] of Object.entries(WATCH_TILE_DEFAULTS.calendar.samples)) {
    it(entityId, () => expect(watchCalendarColor(entityId)).toBe(color));
  }
});

describe("watchEntityLabel", () => {
  for (const s of WATCH_TILE_DEFAULTS.label.samples) {
    it(`${s.entityId} ${JSON.stringify(s.friendlyName ?? null)}`, () => {
      expect(watchEntityLabel(s.entityId, s.friendlyName)).toBe(s.label);
    });
  }

  it("names assist and speak tiles itself", () => {
    expect(watchEntityLabel("assist.home", "Kitchen")).toBe(WATCH_TILE_DEFAULTS.label.assist);
    expect(watchEntityLabel("speak_message.x")).toBe(WATCH_TILE_DEFAULTS.label.speak_message);
  });
});

// ── themes ───────────────────────────────────────────────────────────────

describe("themes", () => {
  it("reads a page's add theme, falling back for none or an unknown name", () => {
    expect(watchAddThemeOf({ themeOverride: "ember" })).toBe("ember");
    expect(watchAddThemeOf({})).toBe("sunnyBeachDay");
    expect(watchAddThemeOf({ themeOverride: "Ember" })).toBe("sunnyBeachDay");
    expect(watchAddThemeOf({ themeOverride: "constructor" })).toBe("sunnyBeachDay");
    expect(watchAddThemeOf(undefined)).toBe("sunnyBeachDay");
  });

  it("lists names, display names, role colors and swatches", () => {
    expect(watchThemeNames()).toEqual(WATCH_TILE_DEFAULTS.themeOrder);
    expect(watchThemeDisplayName("neonLagoon")).toBe("Neon Lagoon");
    expect(watchThemeDisplayName("nope")).toBe("nope");
    expect(watchThemeRoleColors("neonLagoon").entityLight).toBe("#FFC145");
    expect(watchThemeRoleColors("neonLagoon", true).entityLight).toBe("GRADIENT|#FFC145|#3BBED9");
    expect(watchThemeRoleColors("nope").entityLight).toBe("#E9C46A");
    expect(watchThemeSwatches("sunnyBeachDay")).toHaveLength(31);
    expect(watchThemeSwatches("sunnyBeachDay", true)[0]).toBe("GRADIENT|#E9C46A|#5AB0C6");
  });
});

// ── Home Assistant ───────────────────────────────────────────────────────

function state(s: string, attributes: Record<string, unknown> = {}) {
  return { state: s, attributes };
}

describe("watchEntityAddFromHass", () => {
  it("takes the friendly name unless it is empty or the entity id", () => {
    const hass: WatchHassView = {
      states: {
        "light.a": state("on", { friendly_name: "Lamp" }),
        "light.b": state("on", { friendly_name: "" }),
        "light.c": state("on", { friendly_name: "light.c" }),
        "light.d": state("on"),
      },
    };
    expect(watchEntityAddFromHass(hass, "light.a").friendlyName).toBe("Lamp");
    for (const id of ["light.b", "light.c", "light.d", "light.missing"]) {
      expect(watchEntityAddFromHass(hass, id).friendlyName).toBeUndefined();
    }
    expect(newWatchEntityTile(watchEntityAddFromHass(hass, "light.c"), undefined, { newId: () => "x" }).customLabel).toBe("C");
  });

  it("carries the state and device class only when Home Assistant has the entity", () => {
    const hass: WatchHassView = {
      states: { "sensor.t": state("21", { device_class: "temperature", unit_of_measurement: "°C" }), "sensor.u": state("4") },
    };
    expect(watchEntityAddFromHass(hass, "sensor.t", "sensor")).toEqual({
      entityId: "sensor.t",
      picker: "sensor",
      state: "21",
      attributes: { device_class: "temperature" },
    });
    expect(watchEntityAddFromHass(hass, "sensor.u")).toEqual({ entityId: "sensor.u", state: "4", attributes: {} });
    expect(watchEntityAddFromHass(hass, "sensor.gone")).toEqual({ entityId: "sensor.gone" });
  });

  it("makes a TV media player a remote unless a remote has its object id", () => {
    const hass: WatchHassView = {
      states: {
        "media_player.lounge_tv": state("on", { device_class: "tv" }),
        "media_player.den_tv": state("on", { device_class: "tv" }),
        "remote.den_tv": state("on"),
        "media_player.speaker": state("on", { device_class: "speaker" }),
        "media_player.upper": state("on", { device_class: "TV" }),
      },
    };
    expect(watchEntityAddFromHass(hass, "media_player.lounge_tv").tvRemote).toBe(true);
    expect(watchEntityAddFromHass(hass, "media_player.den_tv").tvRemote).toBeUndefined();
    expect(watchEntityAddFromHass(hass, "media_player.speaker").tvRemote).toBeUndefined();
    expect(watchEntityAddFromHass(hass, "media_player.upper").tvRemote).toBeUndefined();
  });

  it("finds a remote's device entities in registry order and links the first media player", () => {
    const hass: WatchHassView = {
      states: { "remote.box": state("on", { friendly_name: "Box" }) },
      entities: {
        "media_player.other": { device_id: "d2" },
        "sensor.box_power": { device_id: "d1" },
        "remote.box": { device_id: "d1" },
        "media_player.box": { device_id: "d1" },
        "media_player.box_cast": { device_id: "d1" },
        "light.loose": { device_id: null },
      },
    };
    const add = watchEntityAddFromHass(hass, "remote.box", "remote");
    expect(add.deviceEntityIds).toEqual(["sensor.box_power", "remote.box", "media_player.box", "media_player.box_cast"]);
    expect(newWatchEntityTile(add, undefined, { newId: () => "x" }).associatedMediaPlayerId).toBe("media_player.box");
  });

  it("gives no device list without a registry, a registry row or a device", () => {
    expect(watchEntityAddFromHass({ states: {} }, "remote.box").deviceEntityIds).toBeUndefined();
    expect(watchEntityAddFromHass({ states: {}, entities: {} }, "remote.box").deviceEntityIds).toBeUndefined();
    expect(
      watchEntityAddFromHass({ states: {}, entities: { "remote.box": { device_id: null } } }, "remote.box").deviceEntityIds,
    ).toBeUndefined();
    expect(
      watchEntityAddFromHass({ states: {}, entities: { "light.x": { device_id: "d" } } }, "light.x").deviceEntityIds,
    ).toBeUndefined();
  });
});

// ── what can be added ────────────────────────────────────────────────────

describe("what can be added", () => {
  it("names addable domains and refuses the others", () => {
    expect(watchAddableDomain("light.x")).toEqual({ domain: "light", name: "Lights", picker: "light" });
    expect(watchAddableDomain("media_player.x")).toEqual({ domain: "media_player", name: "Media Players", picker: "mediaPlayer" });
    expect(watchAddableDomain("text.x")?.name).toBe("Text");
    expect(watchAddableDomain("assist.x")).toBeUndefined();
    expect(watchAddableDomain("persistent_notification.x")).toBeUndefined();
  });

  it("lists entities not yet on the page with an addable domain", () => {
    const page: WatchPage = { id: "P", items: [{ entityId: "light.a" }, { entityId: "spacer.X" }] };
    const states = { "light.a": {}, "light.b": {}, "sun.sun": {}, "switch.c": {} };
    expect(watchAddableEntityIds(page, states)).toEqual(["light.b", "switch.c"]);
    expect(watchAddableEntityIds({ id: "P" }, states)).toEqual(["light.a", "light.b", "switch.c"]);
  });

  it("lists link targets: not this page, not system pages, hidden only for a peek", () => {
    const document: WatchPagesDocument = {
      pages: [
        { id: "AA", name: "This" },
        { id: "BB", name: "Plain" },
        { id: "CC", name: "Hidden", isHidden: true },
        { id: "DD", name: "System", isSystemPage: true },
        { id: "EE", name: "Smart", dynamicConfig: { rules: [] } },
      ],
    };
    const names = (pages: WatchPage[]) => pages.map((p) => p.name);
    expect(names(watchLinkTargetPages(document, "aa", "pageLink"))).toEqual(["Plain", "Smart"]);
    expect(names(watchLinkTargetPages(document, "AA", "peekLink"))).toEqual(["Plain", "Hidden", "Smart"]);
  });

  it("builds a link from a page as it is stored, its id in upper case", () => {
    const tile = newWatchPageLinkTile({ id: "c3a0e000-0000-4000-8000-000000000050", name: "Up" }, { themeOverride: "neonLagoon" }, { newId: () => "x" });
    expect(tile.entityId).toBe("page.C3A0E000-0000-4000-8000-000000000050");
    expect(tile.customLabel).toBe("Up");
  });
});

// ── entity defaults beyond the case files ────────────────────────────────

describe("watchEntityDefaults", () => {
  it("gives a domain with no defaults neither key", () => {
    expect(watchEntityDefaults({ entityId: "sun.sun" }, undefined)).toEqual({ icon: undefined, color: undefined });
    const tile = newWatchEntityTile({ entityId: "sun.sun" }, undefined, { newId: () => "x" });
    expect(Object.hasOwn(tile, "icon")).toBe(false);
    expect(Object.hasOwn(tile, "color")).toBe(false);
  });

  it("reads battery bands on numbers only", () => {
    const look = (s: string) => watchEntityDefaults({ entityId: "sensor.b", state: s, attributes: { device_class: "battery" } }, undefined);
    expect(look("1e1")).toEqual({ icon: "battery.25", color: "#FF3B30" });
    expect(look(" 5")).toEqual({ icon: "battery.100", color: "#34C759" });
    expect(look("")).toEqual({ icon: "battery.100", color: "#34C759" });
    expect(look("nan")).toEqual({ icon: "battery.100", color: "#34C759" });
    expect(look("-inf")).toEqual({ icon: "battery.100", color: "#FF3B30" });
  });
});

// ── adding ───────────────────────────────────────────────────────────────

function sampleDocument(): WatchPagesDocument {
  return deepFreeze<WatchPagesDocument>({
    schemaVersion: 1,
    other: { kept: true },
    pages: [
      { id: "AA", name: "Main", themeOverride: "neonLagoon", items: [{ id: "T1", entityId: "light.a", gridCol: 0, gridRow: 0, colSpan: 6, rowSpan: 4 }] },
      { id: "BB", name: "Second", items: [] },
      { id: "SS", name: "System", isSystemPage: true, items: [] },
      { id: "DD", name: "Smart", dynamicConfig: { rules: [] }, items: [] },
      { id: "NN", name: "No items" },
      { id: "XX", name: "Broken", items: { not: "a list" } },
    ],
  });
}

describe("refusals", () => {
  const document = sampleDocument();
  it("gives every reason", () => {
    expect(watchAddRefusal(document, "ZZ", "light.b")).toBe("noPage");
    expect(watchAddRefusal(document, "SS", "light.b")).toBe("systemPage");
    expect(watchAddRefusal(document, "DD", "light.b")).toBe("smartPage");
    expect(watchAddRefusal(document, "XX", "light.b")).toBe("badItems");
    expect(watchAddRefusal(document, "AA", "light.a")).toBe("onPage");
    expect(watchAddRefusal(document, "aa", "light.b")).toBeUndefined();
    expect(watchAddRefusal(document, "BB", "light.a")).toBeUndefined();
    expect(watchAddRefusal({}, "AA", "light.a")).toBe("noPage");
  });

  it("lets spacers, headers and links repeat", () => {
    const withAll: WatchPagesDocument = {
      pages: [{ id: "AA", items: [{ entityId: "divider.line.custom" }, { entityId: "page.BB" }, { entityId: "show_page.BB" }] }],
    };
    expect(watchAddRefusal(withAll, "AA", "divider.line.custom")).toBeUndefined();
    expect(watchAddRefusal(withAll, "AA", "page.BB")).toBeUndefined();
    expect(watchAddRefusal(withAll, "AA", "show_page.BB")).toBeUndefined();
    expect(watchAddRefusal(withAll, "AA", "spacer.")).toBeUndefined();
  });

  it("returns the same document and takes no id when refused", () => {
    for (const pageId of ["ZZ", "SS", "DD", "XX"]) {
      const gen = ids([]);
      const result = addNewWatchTile(document, pageId, { kind: "header" }, { newId: gen.newId });
      expect(result.document).toBe(document);
      expect(result.refusal).toBeDefined();
    }
    const tile = newWatchHeaderTile({ newId: () => "x" });
    expect(addWatchTile(document, "SS", tile)).toBe(document);
    const dup = newWatchEntityTile({ entityId: "light.a" }, undefined, { newId: () => "x" });
    expect(addWatchTile(document, "AA", dup)).toBe(document);
  });
});

describe("addWatchTile", () => {
  it("copies only the path to the new tile", () => {
    const document = sampleDocument();
    const next = addWatchTile(document, "AA", newWatchSpacerTile({ newId: () => "s" }));
    const before = document.pages as WatchPage[];
    const after = next.pages as WatchPage[];
    expect(next).not.toBe(document);
    expect(after).not.toBe(before);
    expect(next.other).toBe(document.other);
    expect(after[0]).not.toBe(before[0]);
    expect(after[0]!.items).not.toBe(before[0]!.items);
    expect((after[0]!.items as unknown[])[0]).toBe((before[0]!.items as unknown[])[0]);
    for (let i = 1; i < before.length; i++) expect(after[i]).toBe(before[i]);
    const added = (after[0]!.items as WatchPageTile[])[1]!;
    expect([added.gridRow, added.gridCol]).toEqual([0, 6]);
  });

  it("makes `items` on a page that has none", () => {
    const document = sampleDocument();
    const result = addNewWatchTile(document, "NN", { kind: "entity", entityId: "light.b" }, { newId: () => "n" });
    const page = (result.document.pages as WatchPage[])[4]!;
    expect(page.items).toEqual([result.tile]);
    expect(result.tile!.color).toBe("#E9C46A");
    expect([result.tile!.gridRow, result.tile!.gridCol]).toEqual([0, 0]);
  });

  it("writes ids in upper case when the generator gives lower case", () => {
    let n = 0;
    const lower = ["abc-def", "123e4567-e89b-12d3-a456-426614174000"];
    const spacer = newWatchSpacerTile({ newId: () => lower[n++]! });
    expect(spacer.entityId).toBe("spacer.ABC-DEF");
    expect(spacer.id).toBe("123E4567-E89B-12D3-A456-426614174000");
    const entity = newWatchEntityTile({ entityId: "light.a" }, undefined, { newId: () => "lower-id" });
    expect(entity.id).toBe("LOWER-ID");
  });

  it("makes a random upper case id by default", () => {
    const tile = newWatchHeaderTile();
    expect(tile.id).toMatch(/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/);
  });
});
