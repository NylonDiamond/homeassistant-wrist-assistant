// A tile photo's "on" for every kind, and its Clear look (one-look/render.ts;
// app repo docs/photo_tiles_plan_2026-10.md, "On for every kind" and "Clear
// look"; the apps' `OneLookCutout.isActive` and `OneLookPhotoClear`).
//
// On: a light on or media playing, and any other kind not idle and not
// unavailable (a cover open or moving, a switch, fan or input boolean on, a
// lock unlocked); a camera never. Then the On photo and the Light Look draw,
// and a graphite tile (no colour) keeps its photo bright.
//
// Clear ("a photo is an icon", 2026-10-31): the same layout an icon tile
// has, the state top left, the photo in the icon's place (the normal look's
// box) and the name at the bottom, with the accessory, the bar and the big
// value; on the graphite fill an off tile has and a hairline at 6%, never the
// tile's colour, pattern or animation. Lit, a glow behind the photo and a
// thin rim inside the edge, in a light's own colour, else the tile's, else
// One Look amber; not lit or wrist down, the Off filter, no glow, no rim.
//
// Every tile: an off light's glyph at 70%, a ring round a person's photo.

import { describe, expect, it } from "vitest";

import type { HassEntityState } from "../src/ha-api.js";
import type { WatchPage, WatchPageTile } from "../src/watch-pages/model.js";
import { type OneLookPalette, ONE_LOOK_AMBER } from "../src/watch-pages/one-look/colour.js";
import type { OneLookPhotoLight } from "../src/watch-pages/one-look/glow.js";
import {
  type OneLookTileFaceInput,
  ONE_LOOK_CLEAR,
  ONE_LOOK_CUTOUT_OFF_FILTER,
  oneLookClearColour,
  oneLookClearDimmed,
  oneLookCutoutActive,
  oneLookCutoutDimmed,
  oneLookCutoutBoxSide,
  oneLookCutoutOf,
  oneLookCutoutRect,
  oneLookPreviewModel,
  renderOneLookTile,
} from "../src/watch-pages/one-look/render.js";
import type { WatchPagePreviewInput, WatchSpecialLook } from "../src/watch-pages/preview.js";

function html(t: unknown): string {
  if (typeof t === "symbol" || t === null || t === undefined) return "";
  if (Array.isArray(t)) return t.map(html).join("");
  if (typeof t !== "object") return String(t);
  const r = t as { strings?: readonly string[]; values?: unknown[] };
  if (r.strings === undefined) return "";
  return r.strings.map((s, i) => s + (i < (r.values?.length ?? 0) ? html(r.values![i]) : "")).join("");
}

/** The inline style of the first element whose class list starts with `cls`. */
function styleOf(out: string, cls: string): string | undefined {
  const tag = new RegExp(`<[a-z]+ class="${cls}(?: [^"]*)?"[^>]*?style=([^>]*)>`).exec(out);
  return tag?.[1]?.replace(/\s*\/$/, "");
}

function place(style: string | undefined): { x: number; y: number; w: number; h: number } {
  const n = (k: string) => Number(new RegExp(`(?:^|;)${k}:(-?[\\d.]+)px`).exec(style ?? "")?.[1]);
  return { x: n("left"), y: n("top"), w: n("width"), h: n("height") };
}

/** The tile's own style: the first `style=` after `ol-tile`. */
const tileStyle = (out: string) => /class="wp-tile ol-tile[^"]*"[^>]*?style=([^>]*?)\s+title=/.exec(out)?.[1] ?? "";
const src = (out: string) => /<img class="ol-cutout[^"]*"[^>]*?src=([^ >]*)/.exec(out)?.[1];

const ID = "0A1B2C3D-4E5F-4A6B-8C7D-9E0F1A2B3C4D";
const page: WatchPage = { id: "P", name: "P", items: [] };
const UNIT = 15.5;
const CELL = { width: 6 * UNIT + 10, height: 4 * UNIT + 6 };

function entity(id: string, state: string, attributes: Record<string, unknown> = {}): Record<string, HassEntityState> {
  return { [id]: { entity_id: id, state, attributes, last_changed: "", last_updated: "" } };
}

type Photos = Partial<Pick<WatchPagePreviewInput, "photo" | "photoSize" | "photoGlow" | "photoOn">>;
const photo = (id: string) => (id === ID ? "blob:off" : undefined);
const PHOTOS: Photos = { photo, photoSize: () => ({ width: 200, height: 100 }), photoOn: (id) => (id === ID ? "blob:on" : undefined) };

function face(tile: WatchPageTile, states: Record<string, HassEntityState>, photos: Photos = PHOTOS, device: "watch" | "phone" = "watch"): OneLookTileFaceInput {
  const input: WatchPagePreviewInput = { page, pages: [page], screen: { width: 211, height: 251 }, states, scale: 1, ...photos };
  return { tile, input, stub: false, device, look: undefined, width: CELL.width - 1, height: CELL.height - 1, cell: CELL, unit: UNIT, box: "", s: 1 };
}

const thing = (entityId: string, extra: Partial<WatchPageTile> = {}): WatchPageTile =>
  ({ id: "T", entityId, customLabel: "Thing", colSpan: 6, rowSpan: 4, iconPhotoId: ID, ...extra });

// ── on for every kind ────────────────────────────────────────────────────

const ON: [string, string, Record<string, unknown>?][] = [
  ["light.lamp", "on", { brightness: 200 }],
  ["cover.blind", "open", { current_position: 100 }],
  ["cover.blind", "open", { current_position: 40 }],
  ["cover.blind", "open"],
  ["cover.blind", "opening", { current_position: 10 }],
  ["cover.blind", "closing", { current_position: 60 }],
  ["switch.kettle", "on"],
  ["fan.desk", "on", { percentage: 40 }],
  ["fan.desk", "on"],
  ["input_boolean.guest", "on"],
  ["lock.door", "unlocked"],
];
const OFF: [string, string, Record<string, unknown>?][] = [
  ["light.lamp", "off"],
  ["cover.blind", "closed", { current_position: 0 }],
  ["cover.blind", "closed"],
  ["switch.kettle", "off"],
  ["fan.desk", "off"],
  ["input_boolean.guest", "off"],
  ["lock.door", "locked"],
  ["switch.kettle", "unavailable"],
];

describe("a tile photo's thing is on", () => {
  it("for a light on, a cover open or moving, a switch, fan or input boolean on, a lock unlocked", () => {
    for (const [id, state, attrs] of ON) {
      const model = oneLookPreviewModel(face(thing(id), entity(id, state, attrs)))!;
      expect(oneLookCutoutActive(model.kind, model.palette), `${id} ${state}`).toBe(true);
    }
    for (const [id, state, attrs] of OFF) {
      const model = oneLookPreviewModel(face(thing(id), entity(id, state, attrs)))!;
      expect(oneLookCutoutActive(model.kind, model.palette), `${id} ${state}`).toBe(false);
    }
  });

  it("by the role: a light or media by the palette, any other kind not calm and not unavailable, a camera never", () => {
    const lit = { isLit: true };
    const dark = { isLit: false };
    expect(oneLookCutoutActive({ role: { kind: "light", on: true }, isCalm: false, isUnavailable: false }, lit)).toBe(true);
    expect(oneLookCutoutActive({ role: { kind: "light", on: false }, isCalm: true, isUnavailable: false }, dark)).toBe(false);
    expect(oneLookCutoutActive({ role: { kind: "media", playing: true }, isCalm: false, isUnavailable: false }, lit)).toBe(true);
    expect(oneLookCutoutActive({ role: { kind: "media", playing: false }, isCalm: true, isUnavailable: false }, dark)).toBe(false);
    expect(oneLookCutoutActive({ role: { kind: "plain" }, isCalm: false, isUnavailable: false }, dark)).toBe(true);
    expect(oneLookCutoutActive({ role: { kind: "plain" }, isCalm: true, isUnavailable: false }, dark)).toBe(false);
    expect(oneLookCutoutActive({ role: { kind: "plain" }, isCalm: false, isUnavailable: true }, dark)).toBe(false);
    expect(oneLookCutoutActive({ role: { kind: "camera" }, isCalm: false, isUnavailable: false }, lit)).toBe(false);
  });

  it("gray: wrist down, a light off, or graphite while its thing is not on", () => {
    const p = (surface: string, isLit: boolean, aod = false) => ({ surface, isLit, aod }) as unknown as OneLookPalette;
    // A light: bright only while on.
    expect(oneLookCutoutDimmed(p("coloured", true), true, true)).toBe(false);
    expect(oneLookCutoutDimmed(p("coloured", false), true, false)).toBe(true);
    expect(oneLookCutoutDimmed(p("graphite", false), true, false)).toBe(true);
    // Another kind: bright while it keeps its colour, and on graphite while on.
    expect(oneLookCutoutDimmed(p("coloured", false), false, false)).toBe(false);
    expect(oneLookCutoutDimmed(p("coloured", false), false, true)).toBe(false);
    expect(oneLookCutoutDimmed(p("graphite", false), false, false)).toBe(true);
    expect(oneLookCutoutDimmed(p("graphite", false), false, true)).toBe(false);
    // Wrist down: always gray.
    expect(oneLookCutoutDimmed(p("coloured", true, true), true, true)).toBe(true);
    expect(oneLookCutoutDimmed(p("coloured", false, true), false, true)).toBe(true);
  });

  it("shows the On photo, bright, for every on state, with a colour or with none", () => {
    for (const [id, state, attrs] of ON) {
      for (const color of ["#30A0FF", undefined]) {
        const out = html(renderOneLookTile(face(thing(id, color === undefined ? {} : { color }), entity(id, state, attrs))));
        // A dimmed light draws its Off photo under the On photo (On photo
        // tint), so look at every photo drawn.
        const all = [...out.matchAll(/<img class="ol-cutout[^"]*"[^>]*?src=([^ >]*)[^>]*?style=([^>]*)>/g)];
        expect(all.map((m) => m[1]), `${id} ${state} ${color}`).toContain("blob:on");
        for (const m of all) expect(m[2], `${id} ${state} ${color}`).not.toContain("filter");
      }
    }
    for (const [id, state, attrs] of OFF) {
      expect(src(html(renderOneLookTile(face(thing(id), entity(id, state, attrs))))), `${id} ${state}`).toBe("blob:off");
    }
  });

  it("an off thing with no colour is gray; one that keeps its colour stays bright", () => {
    const off = html(renderOneLookTile(face(thing("switch.kettle"), entity("switch.kettle", "off"))));
    expect(styleOf(off, "ol-cutout")).toContain(`filter:${ONE_LOOK_CUTOUT_OFF_FILTER}`);
    const coloured = html(renderOneLookTile(face(thing("switch.kettle", { color: "#30A0FF" }), entity("switch.kettle", "off"))));
    expect(styleOf(coloured, "ol-cutout")).not.toContain("filter");
  });
});

// ── the Clear look ───────────────────────────────────────────────────────

const lamp = (extra: Partial<WatchPageTile> = {}) => thing("light.lamp", { iconPhotoLook: "clear", ...extra });
const lampOn = entity("light.lamp", "on", { brightness: 255 });
const lampOff = entity("light.lamp", "off");

describe("the Clear look", () => {
  it("is asked for by \"clear\" only, and only counts while the photo is in", () => {
    expect(oneLookCutoutOf(lamp(), PHOTOS)?.clear).toBe(true);
    expect(oneLookCutoutOf(lamp({ iconPhotoLook: "Clear" }), PHOTOS)?.clear).toBeUndefined();
    expect(oneLookCutoutOf(thing("light.lamp"), PHOTOS)?.clear).toBeUndefined();
    // Another value draws exactly as with none.
    const other = html(renderOneLookTile(face(lamp({ iconPhotoLook: "glass" }), lampOn)));
    expect(other).toBe(html(renderOneLookTile(face(thing("light.lamp"), lampOn))));
    // No photo yet: the icon, as today.
    const waiting = html(renderOneLookTile(face(lamp(), lampOn, { photo: () => undefined })));
    expect(waiting).not.toContain("ol-cutout");
    expect(waiting).not.toContain("data-ol-look=");
    expect(waiting).toContain("data-symbol=");
  });

  it("draws the graphite fill an off tile has, its sheen and a one pixel hairline at 6%, never the tile's colour, rim light or under-glow", () => {
    for (const color of [undefined, "#30A0FF"]) {
      const out = html(renderOneLookTile(face(lamp(color === undefined ? {} : { color }), lampOn, PHOTOS, "phone")));
      const style = tileStyle(out);
      expect(style, color).toContain("linear-gradient(135deg, #2D2E33 0%, #202125 55%, #191A1D 100%)");
      expect(style, color).toContain("radial-gradient(120% 100% at 0% 0%, rgba(255, 255, 255, 0.07) 0%, rgba(255, 255, 255, 0) 55%)");
      expect(style, color).toContain("box-shadow:inset 0 0 0 1px rgba(255, 255, 255, 0.06)");
      expect(style, color).not.toContain("0 12px 30px");
      expect(style, color).toContain("border-radius:");
      expect(out, color).not.toContain(`class="ol-rim"`);
      expect(out, color).not.toContain(`class="ol-fill"`);
    }
    // The same ground whether the thing is on or off.
    const ground = (o: string) => /background:([^;]*)/.exec(tileStyle(o))?.[1];
    expect(ground(html(renderOneLookTile(face(lamp(), lampOff))))).toBe(ground(html(renderOneLookTile(face(lamp({ color: "#30A0FF" }), lampOn)))));
    expect(ONE_LOOK_CLEAR.borderOpacity).toBe(0.06);
  });

  it("draws no pattern or animation behind the photo, and keeps the user's border", () => {
    const tile = lamp({ backgroundPattern: "sunburst", tileAnimation: "pulse", borderStyle: "line", borderThickness: "thick", borderColor: "#FF0000" });
    const out = html(renderOneLookTile(face(tile, lampOn)));
    expect(out).not.toContain(`class="wp-under"`);
    // The border draws as it does on the same tile in the normal look.
    const normal = html(renderOneLookTile(face({ ...tile, iconPhotoLook: undefined }, lampOn)));
    expect(normal).toContain(`class="wp-under"`);
    const border = (o: string) => o.slice(o.lastIndexOf("</span>") + 7).replace(/\s+/g, " ").trim();
    expect(border(out)).toContain(`class="wp-rim"`);
    expect(border(out)).toBe(border(normal));
  });

  it("puts the photo in the icon's place, in the box the normal look gives it", () => {
    const f = face(lamp(), lampOn);
    const out = html(renderOneLookTile(f));
    const normal = html(renderOneLookTile(face(thing("light.lamp"), lampOn)));
    expect(place(styleOf(out, "ol-cutout"))).toEqual(place(styleOf(normal, "ol-cutout")));
    const { box } = oneLookCutoutRect(oneLookPreviewModel(f)!.layout.discRect, 2);
    const at = place(styleOf(out, "ol-cutout"));
    // 2:1, so as wide as the box and half as high, on its centre: 1.35 times
    // the disc, on the disc's centre.
    expect(at.w).toBeCloseTo(box.width, 1);
    expect(at.h).toBeCloseTo(box.width / 2, 1);
    expect(at.x + at.w / 2).toBeCloseTo(box.x + box.width / 2, 1);
    expect(at.y + at.h / 2).toBeCloseTo(box.y + box.height / 2, 1);
  });

  it("keeps the state top left, the name at the bottom and the bar where an icon tile has them, in white", () => {
    const f = face(lamp({ color: "#30A0FF" }), entity("light.lamp", "on", { brightness: 128 }));
    const out = html(renderOneLookTile(f));
    const normal = html(renderOneLookTile(face(thing("light.lamp", { color: "#30A0FF" }), entity("light.lamp", "on", { brightness: 128 }))));
    for (const part of ["ol-state", "ol-text centred", "ol-bar"]) {
      expect(styleOf(normal, part), part).toBeDefined();
      expect(styleOf(out, part), part).toBe(styleOf(normal, part));
    }
    expect(out).toContain(">Thing</span>");
    expect(styleOf(out, "ol-name")).toContain("color:#FFFFFF");
    expect(out).toContain("data-ol-mode=centred");
    expect(out).toContain("data-ol-look=\"clear\"");
    expect(out).not.toContain("ol-clear-text");
  });

  it("keeps the accessory as an icon tile has it", () => {
    const state = entity("media_player.speaker", "playing");
    const out = html(renderOneLookTile(face(thing("media_player.speaker", { iconPhotoLook: "clear" }), state)));
    const normal = html(renderOneLookTile(face(thing("media_player.speaker"), state)));
    expect(styleOf(normal, "ol-acc")).toBeDefined();
    expect(styleOf(out, "ol-acc")).toBe(styleOf(normal, "ol-acc"));
  });

  it("follows the tile's Arrangement, the glow with the photo", () => {
    const arrange = { v: 1, parts: { icon: { spot: "tl" } } };
    const f = face(lamp({ arrange }), lampOn);
    const out = html(renderOneLookTile(f));
    const normal = html(renderOneLookTile(face(thing("light.lamp", { arrange }), lampOn)));
    const home = html(renderOneLookTile(face(lamp(), lampOn)));
    expect(place(styleOf(out, "ol-cutout"))).toEqual(place(styleOf(normal, "ol-cutout")));
    expect(place(styleOf(out, "ol-cutout"))).not.toEqual(place(styleOf(home, "ol-cutout")));
    const at = place(styleOf(out, "ol-cutout"));
    const r2 = (v: number) => Math.round(v * 100) / 100;
    expect(styleOf(out, "ol-layer ol-clear-glow")).toContain(`at ${r2(at.x + at.w / 2)}px ${r2(at.y + at.h / 2)}px`);
  });

  it("lit: the On photo, a glow of the tile's colour behind it and a rim inside the edge, no halo", () => {
    const out = html(renderOneLookTile(face(lamp({ color: "#30A0FF" }), lampOn)));
    expect(src(out)).toBe("blob:on");
    expect(styleOf(out, "ol-cutout")).not.toContain("filter");
    const glow = styleOf(out, "ol-layer ol-clear-glow") ?? "";
    // 0.60 at the centre, 0.26 at 45%, screen blended; the tile's colour,
    // as the light's colour is not known.
    expect(glow).toContain("rgba(48, 160, 255, 0.6) 0%, rgba(48, 160, 255, 0.26) 45%, rgba(48, 160, 255, 0) 100%");
    expect(glow).toContain("mix-blend-mode:screen");
    expect(out.indexOf("ol-clear-glow")).toBeLessThan(out.indexOf("ol-cutout"));
    // The rim: 1 pt inside the edge, at the tile's corners, at 30%.
    expect(styleOf(out, "ol-layer ol-clear-rim")).toBe("box-shadow:inset 0 0 0 1px rgba(48, 160, 255, 0.3)");
    // The bare glyph's halo and the pearl glow give way to the glow.
    const normal = html(renderOneLookTile(face(thing("light.lamp", { color: "#30A0FF" }), lampOn)));
    expect(normal).toContain(`class="ol-halo"`);
    expect(out).not.toContain(`class="ol-halo"`);
    expect(out).not.toContain("ol-cutout-glow");
  });

  it("the glow sits on the photo box's centre and is gone at 90% of the tile's width", () => {
    const f = face(lamp(), lampOn);
    const model = oneLookPreviewModel(f)!;
    const size = model.layout.size;
    const { box } = oneLookCutoutRect(model.layout.discRect, 2);
    const glow = styleOf(html(renderOneLookTile(f)), "ol-layer ol-clear-glow") ?? "";
    const r2 = (v: number) => Math.round(v * 100) / 100;
    expect(glow).toContain(`radial-gradient(circle ${r2(size.width * 0.9)}px at ${r2(box.x + box.width / 2)}px ${r2(box.y + box.height / 2)}px`);
  });

  it("lit with no colour: One Look amber", () => {
    const out = html(renderOneLookTile(face(thing("switch.kettle", { iconPhotoLook: "clear" }), entity("switch.kettle", "on"))));
    const [r, g, b] = ONE_LOOK_AMBER;
    expect(styleOf(out, "ol-layer ol-clear-glow")).toContain(`rgba(${r}, ${g}, ${b}, 0.6) 0%`);
    expect(styleOf(out, "ol-layer ol-clear-rim")).toContain(`rgba(${r}, ${g}, ${b}, 0.3)`);
    expect(oneLookClearColour({ hue: undefined } as unknown as OneLookPalette)).toEqual(ONE_LOOK_AMBER);
  });

  it("not lit: the Off photo with the Off filter, no glow, no rim, whatever its colour", () => {
    for (const [id, state, color] of [["light.lamp", "off", "#30A0FF"], ["switch.kettle", "off", "#30A0FF"], ["cover.blind", "closed", undefined]] as const) {
      const out = html(renderOneLookTile(face(thing(id, { iconPhotoLook: "clear", ...(color === undefined ? {} : { color }) }), entity(id, state))));
      expect(src(out), id).toBe("blob:off");
      expect(styleOf(out, "ol-cutout"), id).toContain(`filter:${ONE_LOOK_CUTOUT_OFF_FILTER}`);
      expect(out, id).not.toContain("ol-clear-glow");
      expect(out, id).not.toContain("ol-clear-rim");
    }
    expect(oneLookClearDimmed(true, false)).toBe(false);
    expect(oneLookClearDimmed(false, false)).toBe(true);
    expect(oneLookClearDimmed(true, true)).toBe(true);
  });

  it("an open cover counts as lit", () => {
    const out = html(renderOneLookTile(face(thing("cover.blind", { iconPhotoLook: "clear", color: "#30A0FF" }), entity("cover.blind", "open", { current_position: 100 }))));
    expect(src(out)).toBe("blob:on");
    expect(out).toContain("ol-clear-glow");
    expect(out).toContain("ol-clear-rim");
  });

  it("draws the Light Look's layers as on any tile when there is no On photo", () => {
    const light: OneLookPhotoLight = { recipe: { dir: "up", glow: 0.8 }, width: 200, height: 100, pad: 94, emit: "blob:emit", aura: "blob:aura", beam: "blob:beam" };
    const photos: Photos = { photo, photoSize: () => ({ width: 200, height: 100 }), photoGlow: () => light };
    const out = html(renderOneLookTile(face(lamp(), lampOn, photos)));
    for (const l of ["ol-light-aura", "ol-light-beam", "ol-light-emit"]) expect(out).toContain(l);
    expect(html(renderOneLookTile(face(lamp(), lampOff, photos)))).not.toContain("ol-light");
  });

  it("hides the parts the picture hides", () => {
    const f = face(lamp(), lampOn);
    f.hidden = { glyph: true, name: true, state: false };
    const out = html(renderOneLookTile(f));
    expect(out).not.toContain("ol-cutout");
    expect(out).not.toContain("ol-clear-glow");
    expect(out).not.toContain(`class="ol-name"`);
    expect(out).toContain(`class="ol-state`);
  });
});

// ── every tile ───────────────────────────────────────────────────────────

describe("every tile", () => {
  it("sizes the photo box by the photo's aspect, 1 to 1.35 times the disc, so the photo is never taller than the disc", () => {
    const disc = { x: 10, y: 20, width: 40, height: 40 };
    const centre = (r: { x: number; y: number; width: number; height: number }) => [r.x + r.width / 2, r.y + r.height / 2];
    // A wide lamp, 384 by 322: a 1.19 times box, exactly disc tall.
    const wide = oneLookCutoutRect(disc, 384 / 322);
    expect(wide.box.width).toBeCloseTo(40 * (384 / 322), 6);
    expect(wide.box.height).toBeCloseTo(wide.box.width, 6);
    expect(wide.photo.height).toBeCloseTo(40, 6);
    expect(wide.radius).toBeCloseTo(wide.box.width * 0.22, 6);
    // Wider than 1.35: held there, the photo shorter than the disc.
    const wider = oneLookCutoutRect(disc, 2);
    expect(wider.box.width).toBeCloseTo(54, 6);
    expect(wider.photo).toEqual({ x: 3, y: 26.5, width: 54, height: 27 });
    // Square and tall: the disc's own side.
    expect(oneLookCutoutRect(disc, 1).box).toEqual(disc);
    const tall = oneLookCutoutRect(disc, 0.5);
    expect(tall.box).toEqual(disc);
    expect(tall.photo).toEqual({ x: 20, y: 20, width: 20, height: 40 });
    // Unknown, 0 or not a number: the disc's own side, the photo filling it.
    for (const a of [undefined, 0, Number.NaN, -1]) {
      const r = oneLookCutoutRect(disc, a);
      expect(r.box, String(a)).toEqual(disc);
      expect(r.photo, String(a)).toEqual(disc);
      expect(r.radius, String(a)).toBeCloseTo(40 * 0.22, 6);
    }
    // Always on the disc's centre.
    for (const a of [384 / 322, 2, 1, 0.5, undefined]) expect(centre(oneLookCutoutRect(disc, a).box)).toEqual([30, 40]);
    expect(oneLookCutoutBoxSide(40, 1.1)).toBeCloseTo(44, 6);
  });

  it("draws a tile's photo no taller than its disc, in both looks", () => {
    for (const look of [undefined, "clear"] as const) {
      const f = face(thing("light.lamp", look === undefined ? {} : { iconPhotoLook: look }), lampOn, { ...PHOTOS, photoSize: () => ({ width: 384, height: 322 }) });
      const disc = oneLookPreviewModel(f)!.layout.discRect;
      const at = place(styleOf(html(renderOneLookTile(f)), "ol-cutout"));
      expect(at.h, look).toBeCloseTo(disc.height, 1);
      expect(at.w, look).toBeCloseTo(disc.width * (384 / 322), 1);
      expect(at.y + at.h / 2, look).toBeCloseTo(disc.y + disc.height / 2, 1);
    }
  });

  it("draws an off light's bulb at 70%", () => {
    const glyph = (o: string) => /class="ol-glyph" data-symbol=[^ ]* style=([^>]*)>/.exec(o)?.[1] ?? "";
    const off = html(renderOneLookTile(face({ id: "T", entityId: "light.lamp", customLabel: "Lamp", colSpan: 6, rowSpan: 4, color: "#30A0FF" }, lampOff)));
    expect(glyph(off)).toContain(";opacity:0.7");
    const on = html(renderOneLookTile(face({ id: "T", entityId: "light.lamp", customLabel: "Lamp", colSpan: 6, rowSpan: 4, color: "#30A0FF" }, lampOn)));
    expect(glyph(on)).not.toContain("opacity");
  });

  it("rings a person's round photo: white at 28%, 1 pt on the watch, 1.5 pt on the iPhone", () => {
    for (const [device, width] of [["watch", "1px"], ["phone", "1.5px"]] as const) {
      const f = face({ id: "T", entityId: "person.jesse", customLabel: "Jesse", colSpan: 6, rowSpan: 4 }, entity("person.jesse", "home"), {}, device);
      f.look = { symbol: undefined, filled: false, ink: { kind: "solid", hex: "#FFFFFF" }, opacity: 1, photo: "blob:person", active: true } as unknown as WatchSpecialLook;
      const out = html(renderOneLookTile(f));
      const photoAt = place(styleOf(out, "ol-photo"));
      const ring = styleOf(out, "ol-photo-ring") ?? "";
      expect(place(ring), device).toEqual(photoAt);
      expect(ring, device).toContain(`box-shadow:inset 0 0 0 ${width} rgba(255, 255, 255, 0.28)`);
      expect(out.indexOf("ol-photo-ring"), device).toBeGreaterThan(out.indexOf(`class="ol-photo"`));
    }
  });
});
