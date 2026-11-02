// Each picture in the page editor is drawn for the device its title names
// (`pictureOwnerId`, page-editor.ts `pictureOwnerOf`): the first device of
// the kind that shows the page, else the home's first of the kind, never
// the Preview on device of that kind when another one shows the page. Jesse's
// home on 2026-11-01: "New Page 1" shows on Apple Watch (his Ultra, 211 by
// 257) while Chen Watch (187 by 223) was picked in Preview on. Drawn on Chen
// Watch's screen the 2-across "Jesse Office Lights" tile had no room beside
// "100%" for its wide lamp photo, which shrank to about 30% of the tile; on
// the Ultra it runs from under the bar down to the name, as on the watch.

import { svg } from "lit";
import { describe, expect, it } from "vitest";

import type { HassEntityState } from "../src/ha-api.js";
import { type IconProvider, REFERENCE_CASE, caseForScreenSize } from "../src/renderer.js";
import { type LinkDevice, pictureOwnerId } from "../src/watch-pages/devices.js";
import type { WatchPage, WatchPageTile } from "../src/watch-pages/model.js";
import { type WatchPagePreviewInput, renderWatchPagePreview } from "../src/watch-pages/preview.js";

function text(t: unknown): string {
  if (typeof t === "symbol" || t === null || t === undefined) return "";
  if (Array.isArray(t)) return t.map(text).join("");
  if (typeof t !== "object") return String(t);
  const r = t as { strings?: readonly string[]; values?: unknown[] };
  if (r.strings === undefined) return "";
  return r.strings.map((s, i) => s + (i < (r.values?.length ?? 0) ? text(r.values![i]) : "")).join("");
}

/** The inline style of the first element with this class, and its box. */
function boxOf(html: string, cls: string): { x: number; y: number; w: number; h: number } {
  const style = new RegExp(`<[a-z]+ class="${cls}(?: [^"]*)?"[^>]*?style=([^>]*)>`).exec(html)?.[1] ?? "";
  const n = (k: string) => Number(new RegExp(`(?:^|;)${k}:(-?[\\d.]+)px`).exec(style)?.[1]);
  return { x: n("left"), y: n("top"), w: n("width"), h: n("height") };
}

const APPLE_WATCH = "A1A1A1A1-0000-4000-8000-000000000001";
const JESSE_APPLE_WATCH = "B2B2B2B2-0000-4000-8000-000000000002";
const CHEN_WATCH = "C3C3C3C3-0000-4000-8000-000000000003";
const SIM = "D4D4D4D4-0000-4000-8000-000000000004";
const IPHONE = "E5E5E5E5-0000-4000-8000-000000000005";

/** The home's devices in the owners op's order, with the screens they report. */
const devices: (LinkDevice & { screen: string })[] = [
  { ownerId: APPLE_WATCH, name: "Apple Watch", kind: "watch", appVersion: "3.2.0", screen: "211x257" },
  { ownerId: JESSE_APPLE_WATCH, name: "Jesse Apple Watch", kind: "watch", appVersion: "3.1.0", screen: "208x248" },
  { ownerId: CHEN_WATCH, name: "Chen Watch", kind: "watch", appVersion: "3.1.0", screen: "187x223" },
  { ownerId: SIM, name: "Sim", kind: "watch", appVersion: "3.0.1", screen: "208x248" },
  { ownerId: IPHONE, name: "iPhone 15 Pro JESSE", kind: "iphone", appVersion: "3.2.0", screen: "" },
];
/** The screen the editor draws a device's picture on (`screenOf`): its case,
 * else the reference 46 mm one (the panel has no 211 by 257 case, so the
 * Ultra draws on the 208 by 248 screen). */
const screenOf = (id: string | undefined) => (caseForScreenSize(devices.find((d) => d.ownerId === id)?.screen) ?? REFERENCE_CASE).screen;

describe("the device a picture is drawn for", () => {
  it("is the first device of the kind that shows the page, not the Preview on device", () => {
    // Shown on Apple Watch and the iPhone; Chen Watch is picked in Preview on.
    const showing = [IPHONE.toLowerCase(), APPLE_WATCH];
    expect(pictureOwnerId(devices, "watch", showing)).toBe(APPLE_WATCH);
    expect(pictureOwnerId(devices, "iphone", showing)).toBe(IPHONE);
    // In the devices' order: the first name under the picture.
    expect(pictureOwnerId(devices, "watch", [SIM, JESSE_APPLE_WATCH])).toBe(JESSE_APPLE_WATCH);
  });

  it("is the home's first of the kind when none of it shows the page, and the caller's before the library is read", () => {
    expect(pictureOwnerId(devices, "watch", [IPHONE])).toBe(APPLE_WATCH);
    expect(pictureOwnerId(devices.filter((d) => d.kind === "watch"), "iphone", [APPLE_WATCH])).toBeUndefined();
    expect(pictureOwnerId(devices, "watch", undefined)).toBeUndefined();
  });

  it("draws the Office lamp on the Ultra as the watch does: about 47 points, 57% of the tile", () => {
    const tile: WatchPageTile = {
      id: "A5D0758D-EF8F-4081-8E8E-FF6A4EF5465F", entityId: "light.jesse_office_lights", customLabel: "Jesse Office Lights",
      icon: "lightbulb", color: "#E9C46A", colSpan: 6, rowSpan: 4, gridRow: 0, gridCol: 0, showLabel: true,
      iconPhotoId: "C1B6FF23-BA89-4C81-95B0-1C42419BD741",
    };
    const page: WatchPage = { id: "4A95277D-4E32-4C8A-B3A0-17D78E887C72", name: "New Page 1", items: [tile] };
    const states: Record<string, HassEntityState> = {
      "light.jesse_office_lights": { entity_id: "light.jesse_office_lights", state: "on", attributes: { brightness: 255 }, last_changed: "", last_updated: "" },
    };
    const bulb: Record<string, [number, number]> = { lightbulb: [13.65, 23.68], "lightbulb.fill": [13.65, 23.68] };
    const icons = {
      render: (name: string, size: number) => bulb[name] === undefined ? undefined
        : svg`<svg width=${size} height=${size} viewBox=${`0 0 ${bulb[name]![0]} ${bulb[name]![1]}`}><rect /></svg>`,
      available: () => true,
      names: () => Object.keys(bulb),
    } as unknown as IconProvider;
    const draw = (owner: string | undefined) => {
      const input: WatchPagePreviewInput = {
        page, pages: [page], screen: screenOf(owner), states, icons, scale: 1, appVersion: "3.2.0",
        photo: () => "blob:lamp", photoSize: () => ({ width: 384, height: 310 }),
      };
      const html = text(renderWatchPagePreview(input));
      return { lamp: boxOf(html, "ol-cutout"), tile: boxOf(html, "wp-tile ol-tile") };
    };

    const owner = pictureOwnerId(devices, "watch", [APPLE_WATCH, IPHONE]);
    expect(owner).toBe(APPLE_WATCH);
    const { lamp, tile: box } = draw(owner);
    // The ink square of the 55 point glyph box, the lamp fitted in it.
    expect(lamp.w).toBeGreaterThan(46);
    expect(lamp.w).toBeLessThan(48.5);
    expect(lamp.h).toBeCloseTo(lamp.w * 310 / 384, 1);
    expect(lamp.h / box.h).toBeGreaterThan(0.55);
    expect(lamp.h / box.h).toBeLessThan(0.62);
  });
});
