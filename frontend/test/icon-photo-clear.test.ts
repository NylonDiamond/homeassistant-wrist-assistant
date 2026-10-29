// A tile photo's "on" for every kind, and its Clear look (one-look/render.ts;
// app repo docs/photo_tiles_plan_2026-10.md, "On for every kind" and "Clear
// look"; the apps' `OneLookCutout.isActive` and `OneLookPhotoClear`).
//
// On: a light on or media playing, and any other kind not idle and not
// unavailable (a cover open or moving, a switch, fan or input boolean on, a
// lock unlocked); a camera never. Then the On photo and the Light Look draw,
// and a graphite tile (no colour) keeps its photo bright.
//
// Clear: no fill, a white wash at 2.5% and a hairline at 6%, the photo in a
// square box min(0.62 h, 0.8 w) centred across with its top 5% down, no
// rounding; the name and state centred under it; lit, the state in the
// tile's colour (else One Look amber) and a glow of it behind the photo;
// not lit or wrist down, the Off filter and a grey state.

import { describe, expect, it } from "vitest";

import type { HassEntityState } from "../src/ha-api.js";
import type { WatchPage, WatchPageTile } from "../src/watch-pages/model.js";
import { type OneLookPalette, ONE_LOOK_AMBER } from "../src/watch-pages/one-look/colour.js";
import type { OneLookPhotoLight } from "../src/watch-pages/one-look/glow.js";
import {
  type OneLookTileFaceInput,
  ONE_LOOK_CLEAR,
  ONE_LOOK_CUTOUT_OFF_FILTER,
  oneLookClearBox,
  oneLookClearColour,
  oneLookClearDimmed,
  oneLookCutoutActive,
  oneLookCutoutDimmed,
  oneLookCutoutOf,
  oneLookPreviewModel,
  renderOneLookTile,
} from "../src/watch-pages/one-look/render.js";
import type { WatchPagePreviewInput } from "../src/watch-pages/preview.js";

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
        expect(src(out), `${id} ${state} ${color}`).toBe("blob:on");
        expect(styleOf(out, "ol-cutout"), `${id} ${state} ${color}`).not.toContain("filter");
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
    expect(waiting).not.toContain("data-ol-mode=\"clear\"");
    expect(waiting).toContain("data-symbol=");
  });

  it("has no fill, sheen, rim or under-glow: a white wash at 2.5% and a one pixel hairline at 6%", () => {
    const out = html(renderOneLookTile(face(lamp(), lampOn, PHOTOS, "phone")));
    const style = tileStyle(out);
    expect(style).toContain("background:rgba(255, 255, 255, 0.025)");
    expect(style).toContain("box-shadow:inset 0 0 0 1px rgba(255, 255, 255, 0.06)");
    expect(style).toContain("border-radius:");
    expect(out).not.toContain(`class="ol-rim"`);
    expect(out).not.toContain(`class="ol-fill"`);
    expect(out).not.toContain(`class="ol-halo"`);
    expect(out).not.toContain(`class="ol-name"`);
    expect(out).not.toContain(`class="ol-state`);
    expect(ONE_LOOK_CLEAR).toMatchObject({ washOpacity: 0.025, borderOpacity: 0.06 });
  });

  it("keeps the user's pattern and border", () => {
    const out = html(renderOneLookTile(face(lamp({ backgroundPattern: "dots", borderThickness: "thick", borderColor: "#FF0000" }), lampOn)));
    expect(out).toContain(`class="wp-under"`);
  });

  it("puts the photo in a box min(0.62 h, 0.8 w), centred across, its top 5% down, fitted, no rounding", () => {
    expect(oneLookClearBox({ width: 100, height: 100 })).toEqual({ x: 19, y: 5, width: 62, height: 62 });
    // A short wide tile: 62% of the height.
    expect(oneLookClearBox({ width: 200, height: 50 })).toEqual({ x: 84.5, y: 2.5, width: 31, height: 31 });
    // A tall narrow one: 80% of the width.
    expect(oneLookClearBox({ width: 50, height: 200 })).toEqual({ x: 5, y: 10, width: 40, height: 40 });
    const f = face(lamp(), lampOn);
    const out = html(renderOneLookTile(f));
    const size = oneLookPreviewModel(f)!.layout.size;
    const box = oneLookClearBox(size);
    const at = place(styleOf(out, "ol-cutout"));
    // 2:1, so as wide as the box and half as high, on its centre.
    expect(at.w).toBeCloseTo(box.width, 1);
    expect(at.h).toBeCloseTo(box.width / 2, 1);
    expect(at.x + at.w / 2).toBeCloseTo(size.width / 2, 1);
    expect(at.y + at.h / 2).toBeCloseTo(box.y + box.height / 2, 1);
    expect(styleOf(out, "ol-cutout")).not.toContain("border-radius");
  });

  it("puts the name and the state centred under the photo, the state at 0.82 of the name, both semibold", () => {
    const f = face(lamp(), lampOn);
    const out = html(renderOneLookTile(f));
    const model = oneLookPreviewModel(f)!;
    const box = oneLookClearBox(model.layout.size);
    const text = place(styleOf(out, "ol-clear-text"));
    expect(text.y).toBeCloseTo(box.y + box.height, 1);
    expect(text.y + text.h).toBeCloseTo(model.layout.size.height, 1);
    expect(text.x).toBeCloseTo(model.layout.insetH, 1);
    expect(out).toContain(">Thing</span>");
    const nameFont = /font:600 ([\d.]+)px/.exec(styleOf(out, "ol-clear-name") ?? "");
    const stateFont = /font:600 ([\d.]+)px/.exec(styleOf(out, "ol-clear-state") ?? "");
    expect(Number(nameFont?.[1])).toBeCloseTo(model.layout.name.size, 1);
    expect(Number(stateFont?.[1])).toBeCloseTo(model.layout.name.size * 0.82, 1);
    expect(ONE_LOOK_CLEAR.textMinimumScale).toBe(0.7);
  });

  it("shrinks a long name to 70% at most, then truncates", () => {
    const f = face(lamp({ customLabel: "A very long name for a small tile that never fits" }), lampOn);
    f.measurer = { width: (text, size) => text.length * size * 0.6 };
    const out = html(renderOneLookTile(f));
    const model = oneLookPreviewModel(f)!;
    const size = Number(/font:600 ([\d.]+)px/.exec(styleOf(out, "ol-clear-name") ?? "")?.[1]);
    expect(size).toBeCloseTo(model.layout.name.size * 0.7, 1);
  });

  it("lit: the On photo, the state in the tile's colour and a glow of it behind the photo", () => {
    const out = html(renderOneLookTile(face(lamp({ color: "#30A0FF" }), lampOn)));
    expect(src(out)).toBe("blob:on");
    expect(styleOf(out, "ol-cutout")).not.toContain("filter");
    expect(styleOf(out, "ol-clear-state")).toContain("color:rgba(48, 160, 255, 1)");
    const glow = styleOf(out, "ol-layer ol-clear-glow") ?? "";
    expect(glow).toContain("rgba(48, 160, 255, 0.3) 0%");
    expect(glow).toContain("rgba(48, 160, 255, 0) 100%");
    expect(out.indexOf("ol-clear-glow")).toBeLessThan(out.indexOf("ol-cutout"));
  });

  it("the glow sits on the photo box's centre and is gone at 70% of the tile's width", () => {
    const f = face(lamp(), lampOn);
    const size = oneLookPreviewModel(f)!.layout.size;
    const box = oneLookClearBox(size);
    const glow = styleOf(html(renderOneLookTile(f)), "ol-layer ol-clear-glow") ?? "";
    const r2 = (v: number) => Math.round(v * 100) / 100;
    expect(glow).toContain(`radial-gradient(circle ${r2(size.width * 0.7)}px at ${r2(size.width / 2)}px ${r2(box.y + box.height / 2)}px`);
  });

  it("lit with no colour: One Look amber", () => {
    const out = html(renderOneLookTile(face(thing("switch.kettle", { iconPhotoLook: "clear" }), entity("switch.kettle", "on"))));
    const [r, g, b] = ONE_LOOK_AMBER;
    expect(styleOf(out, "ol-clear-state")).toContain(`color:rgba(${r}, ${g}, ${b}, 1)`);
    expect(oneLookClearColour({ hue: undefined } as unknown as OneLookPalette)).toEqual(ONE_LOOK_AMBER);
  });

  it("not lit: the Off photo with the Off filter, a grey state, no glow, whatever its colour", () => {
    for (const [id, state, color] of [["light.lamp", "off", "#30A0FF"], ["switch.kettle", "off", "#30A0FF"], ["cover.blind", "closed", undefined]] as const) {
      const out = html(renderOneLookTile(face(thing(id, { iconPhotoLook: "clear", ...(color === undefined ? {} : { color }) }), entity(id, state))));
      expect(src(out), id).toBe("blob:off");
      expect(styleOf(out, "ol-cutout"), id).toContain(`filter:${ONE_LOOK_CUTOUT_OFF_FILTER}`);
      expect(styleOf(out, "ol-clear-state"), id).toContain("color:rgba(255, 255, 255, 0.6)");
      expect(out, id).not.toContain("ol-clear-glow");
    }
    expect(oneLookClearDimmed(true, false)).toBe(false);
    expect(oneLookClearDimmed(false, false)).toBe(true);
    expect(oneLookClearDimmed(true, true)).toBe(true);
  });

  it("an open cover counts as lit", () => {
    const out = html(renderOneLookTile(face(thing("cover.blind", { iconPhotoLook: "clear", color: "#30A0FF" }), entity("cover.blind", "open", { current_position: 100 }))));
    expect(src(out)).toBe("blob:on");
    expect(out).toContain("ol-clear-glow");
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
    expect(out).not.toContain("ol-clear-name");
    expect(out).toContain("ol-clear-state");
  });
});
