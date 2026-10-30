// One Look's tile as the panel's pictures draw it (one-look/render.ts),
// against the app's own layout numbers: the derived cases D15 to D18 of the
// job's layout spec (the app's Swift layout run with the tests' fake
// measurer). The panel's tests run in node, where there is no canvas, so the
// measurer falls back to the app's own estimate of 0.55 em a character,
// which is that fake; the symbol provider here gives each symbol the
// viewBox that makes the image's extent and aspect the cases use.
//
// There is no DOM in node either, so a tile is read as the HTML lit would
// write: each part's place is the inline style its layout gave it.

import { svg } from "lit";
import { describe, expect, it } from "vitest";

import type { HassEntityState } from "../src/ha-api.js";
import type { IconProvider } from "../src/renderer.js";
import { phonePagesLayout, phonePagesScreen } from "../src/phone-frame.js";
import type { WatchPage, WatchPageTile } from "../src/watch-pages/model.js";
import {
  type WatchPagePreviewInput,
  previewOneLook,
  previewTileCellInset,
  previewTileCornerRadius,
  renderWatchPagePreview,
  renderWatchTileFace,
  watchPreviewSideInset,
  watchPreviewTopInset,
} from "../src/watch-pages/preview.js";
import { oneLookOldSizes, oneLookTileTextScale } from "../src/watch-pages/one-look/render.js";
import { renderPageRowPicture } from "../src/library/row-picture.js";

/** A template's text with its values, as lit would write it. */
function text(t: unknown): string {
  if (typeof t === "symbol" || t === null || t === undefined) return "";
  if (Array.isArray(t)) return t.map(text).join("");
  if (typeof t !== "object") return String(t);
  const r = t as { strings?: readonly string[]; values?: unknown[] };
  if (r.strings === undefined) return "";
  return r.strings.map((s, i) => s + (i < (r.values?.length ?? 0) ? text(r.values![i]) : "")).join("");
}

/** The inline style of the first element with this class (and `extra` in
 * its tag, when given). */
function styleOf(html: string, cls: string, extra = ""): string | undefined {
  const tag = new RegExp(`<[a-z]+ class="${cls}(?: [^"]*)?"[^>]*?${extra}[^>]*?style=([^>]*)>`).exec(html);
  return tag?.[1]?.replace(/\s*\/$/, "");
}

/** A place written as `left:Xpx;top:Ypx;width:Wpx;height:Hpx`. */
function place(style: string | undefined): { x: number; y: number; w: number; h: number } {
  const n = (k: string) => Number(new RegExp(`(?:^|;)${k}:(-?[\\d.]+)px`).exec(style ?? "")?.[1]);
  return { x: n("left"), y: n("top"), w: n("width"), h: n("height") };
}

/**
 * Symbols with the viewBoxes that give their images (ink plus Apple's
 * margin, 0.26 em across and 0.24 em up and down) the cases' sizes: the
 * phone's bulb an extent of 1.25 and an aspect of 0.7, the watch's 1.3 and
 * 0.7, and the round ones 1.25 and 1. Each draws as a rect in the hex it
 * is given, so the glyph's colour can be read.
 */
const BOXES: Record<string, [number, number]> = {
  lightbulb: [13.53, 22.22], "lightbulb.fill": [13.53, 22.22],
  "lightbulb.slash": [13.53, 22.22], "lightbulb.slash.fill": [13.53, 22.22],
  person: [21.78, 22.22], "person.fill": [21.78, 22.22],
  "play.fill": [21.78, 22.22], "pause.fill": [21.78, 22.22], "play.circle": [21.78, 22.22], "play.circle.fill": [21.78, 22.22],
};
function provider(boxes: Record<string, [number, number]> = BOXES): IconProvider {
  return {
    render: (name: string, size: number, colour: string) => {
      const box = boxes[name];
      return box === undefined ? undefined : svg`<svg width=${size} height=${size} viewBox=${`0 0 ${box[0]} ${box[1]}`} data-n=${name} fill=${colour}><rect /></svg>`;
    },
    available: () => true,
    names: () => Object.keys(boxes),
  };
}
/** The watch's bulb: an image of extent 1.3 and aspect 0.7. */
const WATCH_BULB: Record<string, [number, number]> = { ...BOXES, lightbulb: [14.3, 23.32], "lightbulb.fill": [14.3, 23.32] };

const page: WatchPage = { id: "P", name: "P", items: [] };
const entity = (entityId: string, state: string, attributes: Record<string, unknown> = {}): Record<string, HassEntityState> => ({
  [entityId]: { entity_id: entityId, state, attributes, last_changed: "", last_updated: "" },
});
const tile = (entityId: string, extra: Partial<WatchPageTile> = {}): WatchPageTile => ({ id: "T", entityId, colSpan: 6, rowSpan: 4, ...extra });

/** The iPhone look on the default iPhone: a 6 x 4 cell is 189 by 125.33 on
 * One Look's 29.83 point unit, drawn 5 in a side at 179 by 115.33. */
const phone = phonePagesLayout(undefined, { look: "iphone" });
const PHONE_UNIT = (380 - 22) / 12;
const PHONE_CELL = { width: 6 * PHONE_UNIT + 10, height: 4 * PHONE_UNIT + 6 };
/** The Ultra: a 15.5 point unit, a 6 x 4 cell 103 by 68, drawn at 102 by
 * 67. */
const WATCH_UNIT = 15.5;
const WATCH_CELL = { width: 6 * WATCH_UNIT + 10, height: 4 * WATCH_UNIT + 6 };

function onPhone(t: WatchPageTile, states: Record<string, HassEntityState>, icons = provider()): string {
  const input: WatchPagePreviewInput = { page, pages: [page], screen: phonePagesScreen(phone), phone, states, icons, scale: 1 };
  return text(renderWatchTileFace(t, PHONE_CELL, input, PHONE_UNIT));
}
function onWatch(t: WatchPageTile, states: Record<string, HassEntityState>, icons = provider(WATCH_BULB)): string {
  const input: WatchPagePreviewInput = { page, pages: [page], screen: { width: 211, height: 251 }, states, icons, scale: 1 };
  return text(renderWatchTileFace(t, WATCH_CELL, input, WATCH_UNIT));
}

describe("which look a picture draws", () => {
  it("is One Look unless the picture says otherwise or the app is older than 3.2.0", () => {
    expect(previewOneLook({})).toBe("watch");
    expect(previewOneLook({ phone })).toBe("phone");
    expect(previewOneLook({ appVersion: "3.2.0" })).toBe("watch");
    expect(previewOneLook({ appVersion: "1.0.0" })).toBeUndefined();
    expect(previewOneLook({ oneLook: false })).toBeUndefined();
  });

  it("keeps the old tile look when One Look is off", () => {
    const t = tile("light.kitchen", { customLabel: "Kitchen" });
    const states = entity("light.kitchen", "on", { brightness: 189 });
    const old = text(renderWatchTileFace(t, WATCH_CELL, { page, pages: [page], screen: { width: 211, height: 251 }, states, scale: 1, oneLook: false }, WATCH_UNIT));
    expect(old).toContain("wp-glass");
    expect(old).not.toContain("ol-tile");
    expect(onWatch(t, states)).toContain("ol-tile");
  });
});

describe("One Look's grid in a picture (OneLookGrid)", () => {
  it("draws a tile in from its cell on both devices, a header and a spacer keeping the whole cell", () => {
    const light = tile("light.a");
    expect(previewTileCellInset({}, light, 103, 68)).toBe(0.5);
    expect(previewTileCellInset({ phone }, light, 189, 125)).toBe(5);
    expect(previewTileCellInset({ phone: phonePagesLayout(undefined, { look: "watch" }) }, light, 189, 125)).toBe(5);
    expect(previewTileCellInset({ phone }, tile("divider.line.light"), 189, 125)).toBe(0);
    expect(previewTileCellInset({ phone }, tile("spacer.1"), 189, 125)).toBe(0);
  });

  it("rounds a tile by its drawn size: up to 22 at a fifth on the iPhone, up to 12 at 0.17 on the watch", () => {
    expect(previewTileCornerRadius({ phone }, PHONE_CELL.width, PHONE_CELL.height)).toBe(22);
    expect(previewTileCornerRadius({ phone }, 60, 60)).toBeCloseTo(10, 5);
    expect(previewTileCornerRadius({}, WATCH_CELL.width, WATCH_CELL.height)).toBeCloseTo(11.39, 2);
    expect(previewTileCornerRadius({}, 30, 30, 0)).toBeCloseTo(5.1, 5);
  });

  it("moves the grid out by the cell inset so the drawn edges stay where the look puts them", () => {
    expect(watchPreviewSideInset({})).toBe(1.5);
    // The iPhone look's pages area is 12 in; One Look pads the grid 11.
    expect(watchPreviewSideInset({ phone })).toBe(-1);
    expect(watchPreviewTopInset({ phone })).toBe(3);
    // The Watch look's is 6 in; One Look pads it 1.
    const watchLook = phonePagesLayout(undefined, { look: "watch" });
    expect(watchPreviewSideInset({ phone: watchLook })).toBe(-5);
    expect(watchPreviewTopInset({ phone: watchLook })).toBe(0);
    expect(watchPreviewTopInset({})).toBe(34);
    // One Look's unit on the iPhone look: (402 - 22 - 22) / 12.
    expect((phonePagesScreen(phone).width - 2 * watchPreviewSideInset({ phone }) - 22) / 12).toBeCloseTo(29.833, 3);
  });
});

describe("the old look's sizes (takeOldSizes)", () => {
  it("grows the iPhone look's text with its unit and caps a Home sized name at 15", () => {
    expect(oneLookTileTextScale(PHONE_UNIT, "iphone")).toBeCloseTo(1.6574, 4);
    expect(oneLookTileTextScale(30.5, "watch")).toBe(1.5);
    expect(oneLookTileTextScale(15.5, "watch")).toBe(1);
    const sizes = oneLookOldSizes(tile("light.a"), PHONE_CELL, 6, PHONE_UNIT, "iphone");
    expect(sizes.nameSize).toBe(15);
    expect(sizes.iconSize).toBeCloseTo(52.64, 2);
    expect(sizes.iconOffset).toBe(-4);
  });

  it("gives the Ultra's 6 x 4 bulb 36 points, its name 10, lifted 3", () => {
    expect(oneLookOldSizes(tile("light.a"), WATCH_CELL, 6, WATCH_UNIT, "watch")).toEqual({ nameSize: 10, iconSize: 36, iconOffset: -3 });
  });
});

describe("a light in One Look", () => {
  const states = entity("light.kitchen", "on", { brightness: 189 });
  const t = tile("light.kitchen", { customLabel: "Kitchen", color: "#8F7BEA" });

  it("puts the glyph where the old look drew its bulb, as big (D17)", () => {
    const html = onPhone(t, states);
    expect(html).toContain('data-ol-mode=centred');
    expect(place(styleOf(html, "ol-glyph"))).toEqual({ x: 51.24, y: 15.41, w: 76.51, h: 76.51 });
    // The image fitted in the middle 86%: its ink 1.01 em of an image 1.25
    // em tall, so 52.64 points of the 65.8 point square.
    expect(html).toMatch(/<svg width=53\.17 height=53\.17 viewBox=0 0 13\.53 22\.22 data-n=lightbulb\.fill fill=#FFF8EA>/);
    // The halo behind the bare glyph: 1.5 times it, brighter while lit.
    expect(place(styleOf(html, "ol-halo"))).toEqual({ x: 32.12, y: -3.72, w: 114.77, h: 114.77 });
    expect(styleOf(html, "ol-halo")).toContain("rgba(255, 255, 255, 0.32)");
  });

  it("writes its state top left and its name centred at the bottom on one line", () => {
    const html = onPhone(t, states);
    expect(place(styleOf(html, "ol-state"))).toEqual({ x: 12.69, y: 17, w: 30.72, h: 23.1 });
    expect(html).toContain('class="ol-figure"');
    expect(html).toMatch(/font:700 21px\/1 "SF Pro Rounded"[^>]*>74<\/span><span class="ol-unit"[^>]*>%<\/span>/);
    expect(place(styleOf(html, "ol-text centred"))).toEqual({ x: 8, y: 84.95, w: 163, h: 17.7 });
    expect(html).toMatch(/class="ol-name" style=height:17\.7px;font:500 15px\/17\.7px "SF Pro Text"[^>]*>Kitchen<\/span>/);
  });

  it("fills the bar across the top to its brightness, a pale tint of its colour", () => {
    const html = onPhone(t, states);
    expect(place(styleOf(html, "ol-bar"))).toEqual({ x: 12, y: 8, w: 155, h: 4 });
    // 74% of 155.
    expect(styleOf(html, "ol-bar-fill")).toContain("width:114.7px");
    expect(styleOf(html, "ol-bar-fill")).toMatch(/background:rgba\(\d+, \d+, \d+, 0\.7\)/);
  });

  it("is drawn on the watch at the watch's sizes, its bar 3 high (D16)", () => {
    const desk = tile("light.desk", { customLabel: "Desk Lamp" });
    const html = onWatch(desk, entity("light.desk", "on", { brightness: 204 }));
    expect(place(styleOf(html, "ol-bar"))).toEqual({ x: 6, y: 4, w: 90, h: 3 });
    expect(place(styleOf(html, "ol-glyph"))).toEqual({ x: 26.54, y: 6.04, w: 48.92, h: 48.92 });
    expect(place(styleOf(html, "ol-state"))).toEqual({ x: 6.03, y: 9.5, w: 20.9, h: 14 });
    expect(place(styleOf(html, "ol-text centred"))).toEqual({ x: 3, y: 49.17, w: 96, h: 11.8 });
    // No soft shadow under text on the watch.
    expect(html).not.toContain("text-shadow");
    // The watch's own corners, and no under-glow.
    expect(html).toContain("border-radius:11.39px");
    expect(html).not.toContain("box-shadow:0 12px");
  });

  it("is graphite with its bulb in amber while off, with no bar", () => {
    const html = onPhone(tile("light.kitchen", { customLabel: "Kitchen" }), entity("light.kitchen", "off"));
    expect(html).toContain("linear-gradient(135deg, #2D2E33 0%, #202125 55%, #191A1D 100%)");
    expect(html).toMatch(/data-n=lightbulb fill=#F5C27A/);
    expect(html).not.toContain("ol-bar-fill");
    expect(html).toMatch(/class="ol-line ol-word"[^>]*>Off<\/span>/);
  });

  it("says Offline over a quiet ground, its content at half and its bulb crossed out", () => {
    const html = onPhone(t, entity("light.kitchen", "unavailable"));
    expect(html).toContain("linear-gradient(135deg, #18191C 0%, #18191C 55%, #18191C 100%)");
    expect(html).toContain('class="ol-content" style=opacity:0.5');
    // Drawn off, so the outline bulb, crossed out.
    expect(html).toContain("data-n=lightbulb.slash ");
    expect(html).toMatch(/>Offline<\/span>/);
  });

  it("puts its state in a capsule with the Pill style", () => {
    const html = onPhone({ ...t, stateValueLabelStyle: "Pill" }, states);
    expect(html).toContain('class="ol-state pill"');
    expect(styleOf(html, "ol-state pill")).toContain("background:rgba(0, 0, 0, 0.22)");
  });

  it("fills from the left to its brightness with the Fill style, and keeps no bar", () => {
    const html = onPhone({ ...t, stateBarStyle: "Fill" }, states);
    expect(html).not.toContain('class="ol-bar"');
    expect(styleOf(html, "ol-fill")).toContain(`width:${Math.round(179 * 0.74 * 100) / 100}px`);
    expect(html).toContain('class="ol-edge"');
  });
});

describe("the other parts", () => {
  it("draws a player's play or pause top right, its glyph half the disc (D18)", () => {
    const music = tile("media_player.music", { customLabel: "Music" });
    const html = onPhone(music, entity("media_player.music", "playing"));
    expect(html).toContain("data-accessory=playPause");
    expect(place(styleOf(html, "ol-acc"))).toEqual({ x: 136.31, y: 12.69, w: 30, h: 30 });
    expect(html).toContain("data-symbol=pause.fill");
    expect(html).toMatch(/>Playing<\/span>/);
  });

  it("scales the round button by Status Icon Size", () => {
    const music = tile("media_player.music", { customLabel: "Music", statusIconSizeOverride: 21 });
    const html = onPhone(music, entity("media_player.music", "paused"));
    // 21 over the old 15 is 1.4, the most it grows.
    expect(place(styleOf(html, "ol-acc")).w).toBe(42);
    expect(html).toContain("data-symbol=play.fill");
  });

  it("draws a person's photo round at 1.35 times the bulb, shrunk to clear the name", () => {
    const chen = tile("person.chen", { customLabel: "Chen" });
    const html = onWatch(chen, entity("person.chen", "not_home", { entity_picture: "/api/chen.jpg" }));
    expect(html).toContain('class="ol-photo"');
    // D15's 48.6 point photo, centred 3 above the middle, shrunk until it
    // clears the name. D15 has the name at One Look's 11.5; a drawn tile's
    // is the old look's 10 (11.8 high, its top at 49.17), which leaves the
    // photo 35.34 across.
    expect(place(styleOf(html, "ol-photo"))).toEqual({ x: 33.33, y: 12.83, w: 35.34, h: 35.34 });
    expect(html).toMatch(/>Away<\/span>/);
  });

  it("draws a camera showing its picture as the picture alone, on the camera's ground", () => {
    const cam = tile("camera.porch", { customLabel: "Porch", cameraDisplayMode: "preview", cameraFillMode: "fill" });
    const html = onPhone(cam, entity("camera.porch", "idle", { entity_picture: "/api/porch.jpg" }));
    expect(html).toContain("#222222");
    expect(html).toContain('class="wp-snap"');
    expect(html).not.toContain("ol-glyph");
    expect(html).not.toContain("Porch");
  });

  it("draws the user's border only when it is thick enough to show", () => {
    const thin = onPhone(tile("light.a", { color: "#FF3B30", borderStyle: "line", borderThickness: "medium" }), entity("light.a", "on"));
    expect(thin).toContain('class="wp-rim"');
    const hairline = onPhone(tile("light.a", { color: "#FF3B30", borderStyle: "line", borderThickness: "extraThin" }), entity("light.a", "on"));
    expect(hairline).not.toContain('class="wp-rim"');
    // The rim is always there.
    expect(hairline).toContain('class="ol-rim"');
  });
});

describe("every picture of a page", () => {
  const items: WatchPageTile[] = [
    { id: "A", entityId: "light.a", gridRow: 0, gridCol: 0, colSpan: 6, rowSpan: 4, customLabel: "Lamp" },
    { id: "H", entityId: "divider.line.light", gridRow: 4, gridCol: 0, colSpan: 12, rowSpan: 1 },
  ];
  const shown: WatchPage = { ...page, items };
  const states = entity("light.a", "on", { brightness: 128 });

  it("draws One Look's tiles in a page preview, a header keeping its own face", () => {
    const html = text(renderWatchPagePreview({ page: shown, pages: [shown], screen: { width: 208, height: 248 }, states, scale: 1 }));
    expect(html).toContain("ol-tile");
    expect(html).toContain("wp-divider");
    const old = text(renderWatchPagePreview({ page: shown, pages: [shown], screen: { width: 208, height: 248 }, states, scale: 1, oneLook: false }));
    expect(old).not.toContain("ol-tile");
  });

  it("draws them in a library row's picture, kept apart from the old look's", () => {
    const html = text(renderPageRowPicture({ page: shown, pages: [shown], states }));
    expect(html).toContain("ol-tile");
  });
});

describe("every kind at every size", () => {
  const kinds: [string, string, Record<string, unknown>][] = [
    ["light.a", "on", { brightness: 128 }], ["switch.a", "off", {}], ["fan.a", "on", { percentage: 40 }],
    ["cover.a", "open", { current_position: 35 }], ["lock.a", "locked", {}],
    ["climate.a", "heat", { current_temperature: 21.5, temperature: 22, supported_features: 9 }],
    ["sensor.a", "735", { unit_of_measurement: "ppm" }], ["binary_sensor.a", "off", { device_class: "motion" }],
    ["weather.a", "sunny", { temperature: 62 }], ["media_player.a", "paused", { volume_level: 0.4, media_title: "Song" }],
    ["person.a", "home", {}], ["vacuum.a", "docked", { battery_level: 82 }], ["timer.a", "idle", {}],
    ["scene.a", "2026-10-24T10:00:00+00:00", {}], ["script.a", "off", {}], ["automation.a", "on", {}],
    ["input_number.a", "2.5", { step: 0.5, unit_of_measurement: "min" }], ["input_select.a", "Movie", {}],
    ["alarm_control_panel.a", "armed_home", {}], ["remote.a", "on", {}], ["lawn_mower.a", "mowing", {}],
    ["update.a", "on", {}], ["button.a", "unknown", {}], ["light.gone", "unavailable", {}],
  ];
  const virtual = ["camera.a", "multicam.a", "music_hub.a", "point_control.a", "assist.a", "http_action.a", "page.a", "status_page.a", "macro.a", "light.missing"];
  const sizes: [number, number][] = [[1, 1], [2, 2], [3, 3], [4, 2], [6, 2], [6, 4], [12, 1], [12, 8]];
  const states = Object.assign({}, ...kinds.map(([id, s, a]) => entity(id, s, a)), entity("camera.a", "idle", { entity_picture: "/c.jpg" })) as Record<string, HassEntityState>;

  it("draws each One Look tile without throwing, its glyph and text inside the tile", () => {
    for (const [device, unit] of [["phone", PHONE_UNIT], ["watch", WATCH_UNIT]] as const) {
      for (const [c, r] of sizes) {
        const cell = { width: c * unit + 2 * (c - 1), height: r * unit + 2 * (r - 1) };
        const inset = device === "phone" ? 5 : 0.5;
        for (const id of [...kinds.map((k) => k[0]), ...virtual]) {
          const t = tile(id, { colSpan: c, rowSpan: r, ...(id === "camera.a" ? { cameraDisplayMode: "preview" } : {}) });
          const input: WatchPagePreviewInput = { page, pages: [page], screen: device === "phone" ? phonePagesScreen(phone) : { width: 211, height: 251 }, states, icons: provider(), scale: 1, ...(device === "phone" ? { phone } : {}) };
          const html = text(renderWatchTileFace(t, cell, input, unit));
          expect(html, `${device} ${id} ${c}x${r}`).toContain("ol-tile");
          const name = place(styleOf(html, "ol-text(?: centred)?"));
          if (Number.isFinite(name.x)) {
            expect(name.y + name.h, `${device} ${id} ${c}x${r} text`).toBeLessThanOrEqual(cell.height - 2 * inset + 0.51);
            expect(name.y, `${device} ${id} ${c}x${r} text`).toBeGreaterThanOrEqual(-0.51);
          }
        }
      }
    }
  });
});

describe("the app's own names and symbols", () => {
  const SYMBOLS: Record<string, [number, number]> = {
    ...BOXES,
    "hand.point.up.left": [21.78, 22.22], "hand.point.up.left.fill": [21.78, 22.22],
    link: [21.78, 22.22], "link.fill": [21.78, 22.22],
    leaf: [21.78, 22.22], "leaf.fill": [21.78, 22.22],
    "music.note.house": [21.78, 22.22], "music.note.house.fill": [21.78, 22.22],
  };
  const symbolOf = (html: string) => /class="ol-glyph" data-symbol=([^ >]+)/.exec(html)?.[1];
  const namesOf = (html: string) => [...html.matchAll(/class="ol-name"[^>]*>([^<]*)</g)].map((m) => m[1]);

  it("names a point control, a music hub, a macro and an inbox when the label is empty", () => {
    const icons = provider(SYMBOLS);
    expect(namesOf(onPhone(tile("point_control.a", { customLabel: "" }), {}, icons))).toEqual(["Point Control"]);
    expect(namesOf(onPhone(tile("music_hub.a", { customLabel: "" }), {}, icons))).toEqual(["Music"]);
    expect(namesOf(onPhone(tile("macro.a"), {}, icons))).toEqual(["Macro"]);
    expect(namesOf(onPhone(tile("webhook_inbox.garage"), {}, icons))).toEqual(["Inbox"]);
    expect(namesOf(onPhone(tile("macro.a", { customLabel: "Morning" }), {}, icons))).toEqual(["Morning"]);
  });

  it("fills a point control's hand and a macro's link, as their models ask", () => {
    const icons = provider(SYMBOLS);
    expect(symbolOf(onPhone(tile("point_control.a"), {}, icons))).toBe("hand.point.up.left.fill");
    expect(symbolOf(onPhone(tile("macro.a"), {}, icons))).toBe("link.fill");
  });

  it("fills a special kind's own icon by One Look's rule, not the old look's", () => {
    // A mower's sensor tile fills its icon unless a state's icon stands in.
    const states = entity("lawn_mower.a", "mowing");
    expect(symbolOf(onPhone(tile("lawn_mower.a", { icon: "leaf" }), states, provider(SYMBOLS)))).toBe("leaf.fill");
    expect(symbolOf(onPhone(tile("lawn_mower.a", { usesStateIcons: true, stateIcons: { mowing: "leaf" } }), states, provider(SYMBOLS)))).toBe("leaf");
  });

  it("keeps a spacer's own corners, the watch's on its whole cell", () => {
    const html = onPhone(tile("spacer.a", { colSpan: 6, rowSpan: 4 }), {});
    expect(html).toContain("border-radius:8px");
  });
});
