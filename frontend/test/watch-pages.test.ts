// The watch page model: reading the raw document, tile kinds, the grid as
// the watch lays it out, labels and state lines, and the rule everything else
// rests on: a document opened and saved with no edit goes back exactly as it
// came, and an edit changes its own key and nothing else.

import { describe, expect, it } from "vitest";

import type { HassEntityState } from "../src/ha-api.js";
import { isWatchPagesRoute, watchPagesUrl } from "../src/watch-pages/hook.js";
import WATCH_APP from "../src/watch-pages/tile-app.json";
import tileDefaults from "../src/watch-pages/tile-defaults.json";
import {
  type WatchPagesDocument,
  WATCH_GRID_TOP_INSET,
  asWatchPagesDocument,
  dividerParts,
  encodeWatchPages,
  isHiddenWatchPage,
  isSmartWatchPage,
  isWatchPagesEdited,
  openWatchPages,
  parseTileColor,
  renameWatchPage,
  sizeOf,
  smartDomainLabel,
  smartPageDomains,
  tileClass,
  tileDrawsKindLine,
  tileGeometry,
  tileInkColor,
  tileKind,
  tileKindLabel,
  tileLabel,
  tileShowsLabel,
  tileStateText,
  tileSymbol,
  tileTarget,
  watchPageExtent,
  watchPageLayout,
  watchPageName,
  watchPageTiles,
  watchPagesOf,
} from "../src/watch-pages/model.js";
import { rejectedNow } from "../src/watch-settings.js";

const HOME = "0B1C2D3E-0000-4000-8000-000000000001";
const SMART = "0B1C2D3E-0000-4000-8000-000000000002";

/** A small document with made-up ids, and keys no reader here knows. */
function sampleText(): string {
  return JSON.stringify({
    schemaVersion: 1,
    futureTopKey: { nested: [1, 2, { deep: true }] },
    pages: [
      {
        id: HOME,
        name: "Home",
        isHidden: false,
        isSystemPage: false,
        groups: [],
        backgroundColor: "#000000",
        someNewPageKey: "kept",
        items: [
          { id: "T1", entityId: "light.kitchen", gridCol: 0, gridRow: 0, colSpan: 12, rowSpan: 4, icon: "lightbulb", color: "#FFC145", customLabel: "Kitchen", showLabel: true, tileAnimation: "none" },
          { id: "T2", entityId: "sensor.hall_temperature", gridCol: 0, gridRow: 4, colSpan: 6, rowSpan: 4, color: "GRADIENT|#5B74E0|#BE714D", showLabel: false },
          { id: "T3", entityId: `page.${SMART}`, gridCol: 6, gridRow: 4, colSpan: 6, rowSpan: 4 },
          { id: "T4", entityId: "divider.label.light.g40", gridCol: 0, gridRow: 8, colSpan: 12, rowSpan: 1 },
          { id: "T5", entityId: "spacer.0B1C2D3E-0000-4000-8000-000000000005", gridCol: 0, gridRow: 9, colSpan: 3, rowSpan: 3 },
          { id: "T6", entityId: "mystery_kind.0B1C2D3E-0000-4000-8000-000000000006", gridCol: 3, gridRow: 9, colSpan: 3, rowSpan: 3 },
        ],
      },
      "not a page",
      {
        id: SMART,
        name: "Küche ☕",
        isHidden: true,
        items: [],
        dynamicConfig: { rules: [{ domain: "light" }, { domain: "switch" }, { domain: "light" }, { mode: "all" }], tileColSpan: 4 },
      },
    ],
  });
}

function sample(): WatchPagesDocument {
  return asWatchPagesDocument(JSON.parse(sampleText()))!;
}

function state(entityId: string, value: string, attributes: Record<string, unknown> = {}): HassEntityState {
  return { entity_id: entityId, state: value, attributes, last_changed: "", last_updated: "" };
}

const STATES: Record<string, HassEntityState> = {
  "light.kitchen": state("light.kitchen", "on", { friendly_name: "Kitchen Ceiling" }),
  "sensor.hall_temperature": state("sensor.hall_temperature", "21.5", { friendly_name: "Hall Temperature", unit_of_measurement: "°C" }),
  "lock.front_door": state("lock.front_door", "unavailable"),
  "alarm_control_panel.house": state("alarm_control_panel.house", "armed_away"),
  "custom_domain.thing": state("custom_domain.thing", "ready"),
};

describe("reading the document", () => {
  it("lists the pages that are objects, in order, and leaves the rest alone", () => {
    const doc = sample();
    const pages = watchPagesOf(doc);
    expect(pages.map(watchPageName)).toEqual(["Home", "Küche ☕"]);
    expect((doc.pages as unknown[]).length).toBe(3);
    expect(watchPagesOf(undefined)).toEqual([]);
    expect(watchPagesOf({ pages: "nope" })).toEqual([]);
    expect(asWatchPagesDocument([1])).toBeUndefined();
    expect(asWatchPagesDocument(null)).toBeUndefined();
  });

  it("lists a page's tiles in stored order", () => {
    const [home] = watchPagesOf(sample());
    expect(watchPageTiles(home).map((t) => t.id)).toEqual(["T1", "T2", "T3", "T4", "T5", "T6"]);
    expect(watchPageTiles({ items: { not: "an array" } })).toEqual([]);
  });

  it("names a page with no name", () => {
    expect(watchPageName({ name: "  " })).toBe("Untitled page");
    expect(watchPageName({})).toBe("Untitled page");
  });

  it("knows a smart page and the domains it fills itself with", () => {
    const [home, smart] = watchPagesOf(sample());
    expect(isSmartWatchPage(home!)).toBe(false);
    expect(isSmartWatchPage(smart!)).toBe(true);
    expect(isSmartWatchPage({ dynamicConfig: null })).toBe(false);
    expect(smartPageDomains(smart!)).toEqual(["light", "switch"]);
    expect(smartPageDomains(home!)).toEqual([]);
    expect(smartDomainLabel("binary_sensor")).toBe("Binary sensors");
    expect(smartDomainLabel("new_domain")).toBe("New domain");
    expect(isHiddenWatchPage(smart!)).toBe(true);
    expect(isHiddenWatchPage(home!)).toBe(false);
  });
});

describe("tile kinds", () => {
  it("is the part of the entity id before the first dot", () => {
    expect(tileKind("light.kitchen")).toBe("light");
    expect(tileKind("divider.label.light.g40")).toBe("divider");
    expect(tileKind("assist.voice_hub")).toBe("assist");
    expect(tileKind("nodot")).toBe("nodot");
    expect(tileKind("")).toBe("");
    expect(tileTarget(`page.${HOME}`)).toBe(HOME);
    expect(tileTarget("nodot")).toBe("");
  });

  it("names every virtual kind, known domains plainly, and the rest readably", () => {
    for (const kind of ["page", "show_page", "status_page", "http_action", "macro", "template", "spacer", "multicam",
      "point_control", "music_hub", "assist", "speak_message", "webhook_inbox", "divider"]) {
      expect(tileClass(`${kind}.x`), kind).not.toBe("entity");
      expect(tileKindLabel(kind), kind).not.toMatch(/_/);
    }
    expect(tileKindLabel("page")).toBe("Go to page");
    expect(tileKindLabel("show_page")).toBe("Peek page");
    expect(tileKindLabel("media_player")).toBe("Media player");
    expect(tileKindLabel("some_new_thing")).toBe("Some new thing");
    expect(tileKindLabel("")).toBe("Tile");
  });

  it("sorts tiles into the classes the preview draws", () => {
    expect(tileClass("divider.line.custom")).toBe("divider");
    expect(tileClass("spacer.1")).toBe("spacer");
    expect(tileClass("music_hub.1")).toBe("virtual");
    expect(tileClass("light.kitchen")).toBe("entity");
    expect(tileClass("custom_domain.thing")).toBe("unknown");
    expect(tileClass("custom_domain.thing", STATES)).toBe("entity");
    expect(tileClass("mystery_kind.1", STATES)).toBe("unknown");
  });

  it("reads a header's style, domain and glow", () => {
    expect(dividerParts("divider.label.light.g40")).toEqual({ style: "label", domain: "light", glow: 0.4 });
    expect(dividerParts("divider.line.custom")).toEqual({ style: "line", domain: "custom", glow: 0 });
    // As the watch reads it: no cap, a sign allowed, the first that parses.
    expect(dividerParts("divider.fancy.switch.g250")).toEqual({ style: "line", domain: "switch", glow: 2.5 });
    expect(dividerParts("divider.line.custom.g-20")).toEqual({ style: "line", domain: "custom", glow: -0.2 });
    expect(dividerParts("divider.line.custom.g+15")).toEqual({ style: "line", domain: "custom", glow: 0.15 });
    expect(dividerParts("divider.line.garage.gx.g30.g70")).toEqual({ style: "line", domain: "garage", glow: 0.3 });
    expect(dividerParts("divider.line.custom.g")).toEqual({ style: "line", domain: "custom", glow: 0 });
    expect(dividerParts("divider.line.custom.g1.5")).toEqual({ style: "line", domain: "custom", glow: 0.01 });
    expect(dividerParts("divider.line.custom.g99999999999999999999")).toEqual({ style: "line", domain: "custom", glow: 0 });
  });

  it("draws a tile with its own symbol, else its kind's", () => {
    expect(tileSymbol({ entityId: "light.kitchen", icon: "lamp.ceiling" })).toBe("lamp.ceiling");
    expect(tileSymbol({ entityId: "light.kitchen", icon: " " })).toBe("lightbulb.fill");
    expect(tileSymbol({ entityId: "music_hub.1" })).toBe("music.note.house.fill");
    expect(tileSymbol({ entityId: "mystery.1" })).toBeUndefined();
  });
});

describe("placement", () => {
  it("reads geometry as whole numbers, with spans of at least one", () => {
    expect(tileGeometry({ gridCol: 6, gridRow: 4, colSpan: 6, rowSpan: 4 })).toEqual({ col: 6, row: 4, colSpan: 6, rowSpan: 4 });
    expect(tileGeometry({})).toEqual({ col: 0, row: 0, colSpan: 1, rowSpan: 1 });
    expect(tileGeometry({ gridCol: -2, gridRow: 2.7, colSpan: 0, rowSpan: "4" })).toEqual({ col: 0, row: 2, colSpan: 1, rowSpan: 1 });
  });

  it("measures a page by its lowest tile", () => {
    const [home, smart] = watchPagesOf(sample());
    expect(watchPageExtent(home!)).toBe(12);
    expect(watchPageExtent(smart!)).toBe(0);
    // Overlaps and array order do not change the extent.
    expect(watchPageExtent({ items: [{ gridRow: 10, rowSpan: 2 }, { gridRow: 0, rowSpan: 4 }] })).toBe(12);
  });

  it("lays a page out by the watch's arithmetic", () => {
    const [home] = watchPagesOf(sample());
    const layout = watchPageLayout(home!, { width: 208, height: 248 });
    // 12 units and 11 gaps of 2 points across 208 points.
    expect(layout.unit).toBeCloseTo(15.5);
    expect(layout.topInset).toBe(WATCH_GRID_TOP_INSET);
    const byId = new Map(layout.tiles.map((t) => [t.tile.id, t]));
    // A full width tile spans the screen exactly.
    expect(byId.get("T1")).toMatchObject({ x: 0, y: 0, width: 208, height: 68 });
    expect(byId.get("T2")).toMatchObject({ x: 0, y: 70, width: 103, height: 68 });
    expect(byId.get("T3")!.x).toBeCloseTo(105);
    // The header at row 8 is pulled up by 0.6 of a unit, with itself counted.
    expect(byId.get("T4")!.y).toBeCloseTo(8 * 17.5 - 0.6 * 15.5);
    expect(byId.get("T4")!.height).toBeCloseTo(15.5);
    // Tiles below it move up by the same amount.
    expect(byId.get("T5")!.y).toBeCloseTo(9 * 17.5 - 0.6 * 15.5);
    expect(byId.get("T5")!.width).toBeCloseTo(15.5 * 3 + 4);
    expect(byId.get("T6")!.x).toBeCloseTo(3 * 17.5);
    // Draw order is array order.
    expect(layout.tiles.map((t) => t.index)).toEqual([0, 1, 2, 3, 4, 5]);
    // The grid is never shorter than the screen, less what the header took.
    expect(layout.contentHeight).toBeCloseTo(248 - 0.6 * 15.5);
    expect(layout.height).toBeCloseTo(WATCH_GRID_TOP_INSET + 248 - 0.6 * 15.5);
  });

  it("pulls later headers up by 0.4 of a unit each", () => {
    const page = {
      items: [
        { entityId: "divider.label.light", gridCol: 0, gridRow: 0, colSpan: 12, rowSpan: 1 },
        { entityId: "light.a", gridCol: 0, gridRow: 1, colSpan: 6, rowSpan: 4 },
        { entityId: "divider.line.switch", gridCol: 0, gridRow: 5, colSpan: 12, rowSpan: 1 },
        { entityId: "switch.b", gridCol: 0, gridRow: 6, colSpan: 6, rowSpan: 20 },
      ],
    };
    const layout = watchPageLayout(page, { width: 208, height: 248 });
    const [first, a, second, b] = layout.tiles;
    const u = layout.unit;
    expect(first!.y).toBeCloseTo(-0.6 * u);
    expect(a!.y).toBeCloseTo(17.5 - 0.6 * u);
    expect(second!.y).toBeCloseTo(5 * 17.5 - u);
    expect(b!.y).toBeCloseTo(6 * 17.5 - u);
    // Taller than the screen: the picture grows to the last tile.
    const bottom = 6 * 17.5 + 20 * u + 19 * 2;
    expect(layout.contentHeight).toBeCloseTo(bottom - u);
    expect(layout.height).toBeCloseTo(WATCH_GRID_TOP_INSET + bottom - u);
  });

  it("starts a full screen page at the top, and an empty page is one screen", () => {
    const layout = watchPageLayout({ fullScreen: true, items: [] }, { width: 184, height: 224 });
    expect(layout.topInset).toBe(0);
    expect(layout.tiles).toEqual([]);
    expect(layout.contentHeight).toBe(224);
    expect(layout.height).toBe(224);
  });
});

describe("labels and state", () => {
  const doc = sample();
  const pages = watchPagesOf(doc);
  const tiles = watchPageTiles(pages[0]);
  const tile = (id: string) => tiles.find((t) => t.id === id)!;

  it("puts a custom label first", () => {
    expect(tileLabel(tile("T1"), STATES, pages)).toBe("Kitchen");
  });

  it("falls back to the friendly name, then the entity id", () => {
    expect(tileLabel(tile("T2"), STATES, pages)).toBe("Hall Temperature");
    expect(tileLabel(tile("T2"))).toBe("sensor.hall_temperature");
  });

  it("names a page link after its page, and other virtual kinds by kind", () => {
    expect(tileLabel(tile("T3"), STATES, pages)).toBe("Küche ☕");
    expect(tileLabel(tile("T3"))).toBe("Go to page");
    expect(tileLabel({ entityId: "macro.1" })).toBe("Macro");
  });

  it("names an app tile as the watch does, from the tables", () => {
    const WATCH_TILE_DEFAULTS_LABELS = tileDefaults.label;
    expect(tileLabel({ entityId: "speak_message.voice_hub" })).toBe(WATCH_TILE_DEFAULTS_LABELS.speak_message);
    expect(tileLabel({ entityId: "speak_message.voice_hub" })).toBe("Speak");
    expect(tileLabel({ entityId: "assist.voice_hub" })).toBe(WATCH_TILE_DEFAULTS_LABELS.assist);
    expect(tileLabel({ entityId: "point_control.1" })).toBe(WATCH_APP.pointControl.add.customLabel);
    expect(tileLabel({ entityId: "point_control.1" })).toBe("Point Control");
    expect(tileLabel({ entityId: "music_hub.1" })).toBe(WATCH_APP.musicHub.add.customLabel);
    expect(tileLabel({ entityId: "webhook_inbox.all" })).toBe("Inbox");
    expect(tileLabel({ entityId: "webhook_inbox.alerts" })).toBe("#alerts");
    expect(tileLabel({ entityId: "speak_message.voice_hub", customLabel: "Say" })).toBe("Say");
  });

  it("draws no kind line under assist, speak, point control and template tiles, and keeps it for the others", () => {
    for (const kind of ["assist", "speak_message", "point_control", "template"]) expect(tileDrawsKindLine(kind), kind).toBe(false);
    for (const kind of ["page", "show_page", "status_page", "http_action", "macro", "multicam", "music_hub", "webhook_inbox"]) {
      expect(tileDrawsKindLine(kind), kind).toBe(true);
    }
  });

  it("names a header after its domain unless it has a label", () => {
    expect(tileLabel(tile("T4"))).toBe("Lights");
    expect(tileLabel({ entityId: "divider.line.custom" })).toBe("");
    expect(tileLabel({ entityId: "divider.label.custom", customLabel: "Upstairs" })).toBe("Upstairs");
  });

  it("knows when a tile hides its name", () => {
    expect(tileShowsLabel(tile("T1"))).toBe(true);
    expect(tileShowsLabel(tile("T2"))).toBe(false);
    expect(tileShowsLabel({})).toBe(true);
  });

  it("writes one state line for an entity", () => {
    expect(tileStateText(tile("T1"), STATES)).toBe("On");
    expect(tileStateText(tile("T2"), STATES)).toBe("21.5 °C");
    expect(tileStateText({ entityId: "lock.front_door" }, STATES)).toBe("Unavailable");
    expect(tileStateText({ entityId: "alarm_control_panel.house" }, STATES)).toBe("Armed away");
    expect(tileStateText({ entityId: "light.missing" }, STATES)).toBe("Not found");
    expect(tileStateText({ entityId: "light.missing" })).toBeUndefined();
    expect(tileStateText(tile("T3"), STATES)).toBeUndefined();
  });
});

describe("tile colors", () => {
  it("reads every form the app writes", () => {
    expect(parseTileColor("#ffc145")).toEqual({ kind: "solid", hex: "#FFC145", opacity: 1 });
    expect(parseTileColor("#FFC14580")).toEqual({ kind: "solid", hex: "#FFC145", opacity: 128 / 255 });
    expect(parseTileColor("GRADIENT|#5B74E0|#BE714D")).toEqual({ kind: "gradient", from: "#5B74E0", to: "#BE714D" });
    expect(parseTileColor("#RAINBOW")).toEqual({ kind: "rainbow" });
    expect(parseTileColor("yellow")).toEqual({ kind: "solid", hex: "#FFCC00", opacity: 1 });
    expect(parseTileColor("GRADIENT|#5B74E0")).toBeUndefined();
    expect(parseTileColor("chartreuse")).toBeUndefined();
    expect(parseTileColor(undefined)).toBeUndefined();
  });

  it("stands one plain color in for any of them", () => {
    expect(tileInkColor(parseTileColor("GRADIENT|#5B74E0|#BE714D"))).toBe("#5B74E0");
    expect(tileInkColor(parseTileColor("#RAINBOW"))).toBe("#FFFFFF");
    expect(tileInkColor(undefined, "#8E8E93")).toBe("#8E8E93");
  });
});

describe("saving back", () => {
  it("measures compact UTF-8 bytes", () => {
    const doc = sample();
    expect(sizeOf(doc)).toBe(Buffer.byteLength(JSON.stringify(doc), "utf8"));
    expect(sizeOf(doc)).toBeGreaterThan(JSON.stringify(doc).length);
    expect(sizeOf({ pages: [] })).toBe('{"pages":[]}'.length);
  });

  it("encodes an unedited document as the very object it opened", () => {
    const doc = sample();
    const model = openWatchPages(doc);
    expect(isWatchPagesEdited(model)).toBe(false);
    expect(encodeWatchPages(model)).toBe(doc);
    expect(JSON.stringify(encodeWatchPages(model))).toBe(sampleText());
  });

  it("changes a renamed page's name and nothing else, keys it does not know included", () => {
    const doc = sample();
    const model = openWatchPages(doc);
    const renamed = renameWatchPage(model, HOME, "  Ground floor ");
    expect(isWatchPagesEdited(renamed)).toBe(true);
    const out = encodeWatchPages(renamed);
    expect(JSON.stringify(out)).toBe(sampleText().replace('"name":"Home"', '"name":"Ground floor"'));
    // The loaded document is untouched, and only the path to the edit is new.
    expect(JSON.stringify(doc)).toBe(sampleText());
    expect(renamed.loaded).toBe(doc);
    const before = doc.pages as unknown[];
    const after = out.pages as unknown[];
    expect(after).not.toBe(before);
    expect(after[0]).not.toBe(before[0]);
    expect(after[1]).toBe(before[1]);
    expect(after[2]).toBe(before[2]);
    expect((after[0] as { items: unknown }).items).toBe((before[0] as { items: unknown }).items);
    expect(out.futureTopKey).toBe(doc.futureTopKey);
  });

  it("counts a rename undone by hand as no edit", () => {
    const doc = sample();
    const back = renameWatchPage(renameWatchPage(openWatchPages(doc), HOME, "Other"), HOME, "Home");
    expect(back.document).not.toBe(doc);
    expect(isWatchPagesEdited(back)).toBe(false);
    expect(encodeWatchPages(back)).toBe(doc);
  });

  it("leaves the model alone for a blank name, the same name, or an unknown page", () => {
    const model = openWatchPages(sample());
    expect(renameWatchPage(model, HOME, "   ")).toBe(model);
    expect(renameWatchPage(model, HOME, "Home")).toBe(model);
    expect(renameWatchPage(model, "NO-SUCH-PAGE", "X")).toBe(model);
    expect(renameWatchPage(openWatchPages({ schemaVersion: 1 }), HOME, "X").document).toEqual({ schemaVersion: 1 });
  });
});

describe("the stored copy's state", () => {
  it("says the iPhone could not read the save only for the revision held now", () => {
    expect(rejectedNow({ revision: 4, rejected_revision: 4 })).toBe(true);
    expect(rejectedNow({ revision: 5, rejected_revision: 4 })).toBe(false);
    expect(rejectedNow({ revision: 5 })).toBe(false);
    expect(rejectedNow({ revision: 0, rejected_revision: 0 })).toBe(false);
    expect(rejectedNow(undefined)).toBe(false);
  });
});

describe("the panel route", () => {
  it("opens the editor on the sub-path pages only", () => {
    expect(isWatchPagesRoute({ prefix: "/wrist-assistant", path: "/pages" })).toBe(true);
    expect(isWatchPagesRoute({ prefix: "/wrist-assistant", path: "/pages/x" })).toBe(true);
    expect(isWatchPagesRoute({ prefix: "/wrist-assistant", path: "" })).toBe(false);
    expect(isWatchPagesRoute({ prefix: "/wrist-assistant", path: "/pagesx" })).toBe(false);
    expect(isWatchPagesRoute(undefined)).toBe(false);
  });

  it("builds both addresses from the route, or from the address bar without one", () => {
    const route = { prefix: "/wrist-assistant", path: "" };
    expect(watchPagesUrl(route, true)).toBe("/wrist-assistant/pages");
    expect(watchPagesUrl(route, false)).toBe("/wrist-assistant");
    expect(watchPagesUrl(undefined, false, "/wrist-assistant/pages")).toBe("/wrist-assistant");
    expect(watchPagesUrl(undefined, true, "/wrist-assistant")).toBe("/wrist-assistant/pages");
  });
});
