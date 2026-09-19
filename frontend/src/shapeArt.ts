// A shape drawn where it sits on the device, for the buttons that offer it.
//
// The names alone say nothing to anyone who has not already learned them:
// "Corner" is a place rather than a shape, and Rectangular on a watch face and
// Rectangular on a Lock Screen are the same design in two very different spots.
// So every button carries a tiny outline of the device with the shape lit up
// where it lands, and a shared shape carries one outline per device, which is
// the whole of what makes one design on two screens readable at a glance.
//
// Deliberately smaller and plainer than the drawings the New dialog's place
// cards used to carry, which drew the device's furniture (a page of icons, a
// real clock, a dock) at four times the size. These sit inside a row of
// checkboxes, so everything but the outline and the shape is left out.
//
// The outline is `currentColor` at low opacity and the shape is `currentColor`
// too, so a button inherits one colour and the drawing follows its state.

import { type TemplateResult, html, nothing, svg } from "lit";

import type { FamilyKind } from "./model.js";
import { isHomeFamily } from "./layouts.js";
import { isSharedFamily } from "./linking.js";
import type { DeviceKind } from "./version.js";

/** Tall enough for a phone and wide enough for a watch's bands, with the two
 * devices drawn at the same scale so a row of them lines up. */
const VIEW_BOX = "0 0 32 28";

/** The unlit parts of a drawing: the outline, the clock, the neighbouring
 * tiles. Quiet enough to read as furniture rather than as a second shape. */
const FURNITURE = "0.25";
const GRID = "0.2";

/** A watch: the case, with a stub of band above and below so it is not just a
 * rounded rectangle. */
const WATCH_OUTLINE = svg`<rect x="12" y="1" width="8" height="3" fill="currentColor" opacity=${GRID} />
  <rect x="12" y="24" width="8" height="3" fill="currentColor" opacity=${GRID} />
  <rect x="8" y="4" width="16" height="20" rx="4" fill="none" stroke="currentColor" stroke-opacity="0.45" />`;

/** A phone: one tall rounded rectangle. The clock goes on with the shape,
 * because only the Lock Screen shapes sit under one. */
const PHONE_OUTLINE = svg`<rect x="10" y="1" width="12" height="26" rx="3" fill="none" stroke="currentColor" stroke-opacity="0.45" />`;

/** The Lock Screen clock the three shared shapes sit around. Inline goes above
 * it, the other two below, so the clock moves rather than the shape: that is
 * where iOS puts them. */
const clock = (y: number) => svg`<rect x="13" y=${y} width="6" height="2" fill="currentColor" opacity=${FURNITURE} />`;

/** One app icon beside a Home Screen tile. What says the tile is a tile and
 * not a bar: Small against Large reads as how much of the page each one takes
 * only when the rest of the page is there. */
const stub = (x: number, y: number) => svg`<rect x=${x} y=${y} width="3" height="3" rx="0.6" fill="currentColor" opacity=${GRID} />`;

/** The row of icons under a full-width tile. */
const stubRow = (y: number) => svg`${stub(12, y)}${stub(17, y)}`;

function watchShape(family: FamilyKind, opacity: string): unknown {
  switch (family) {
    case "rectangular":
      return svg`<rect x="10" y="15" width="12" height="6" rx="1.5" fill="currentColor" opacity=${opacity} />`;
    // High and to one side, where a face puts it: the middle is the hands.
    case "circular":
      return svg`<circle cx="13" cy="10" r="3" fill="currentColor" opacity=${opacity} />`;
    case "inline":
      return svg`<rect x="10" y="6" width="12" height="3" rx="1.5" fill="currentColor" opacity=${opacity} />`;
    // The arc that gives the slot its name, curving into the top right corner.
    case "corner":
      return svg`<path d="M16 6.5a5.5 5.5 0 0 1 5.5 5.5" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" opacity=${opacity} />`;
    // The four Home Screen tiles, which no watch has.
    default:
      return nothing;
  }
}

function phoneShape(family: FamilyKind, opacity: string): unknown {
  const tile = (width: number, height: number) =>
    svg`<rect x="12" y="4" width=${width} height=${height} rx="1" fill="currentColor" opacity=${opacity} />`;
  switch (family) {
    case "rectangular":
      return svg`${clock(5)}<rect x="12" y="10" width="8" height="4" rx="1" fill="currentColor" opacity=${opacity} />`;
    case "circular":
      return svg`${clock(5)}<circle cx="16" cy="12" r="2.5" fill="currentColor" opacity=${opacity} />`;
    // Inline sits above the clock rather than below it, so the clock moves
    // down to make room instead of the shape moving off the screen.
    case "inline":
      return svg`${clock(6)}<rect x="12" y="3" width="8" height="1.6" rx="0.8" fill="currentColor" opacity=${opacity} />`;
    case "small":
      return svg`${tile(4, 4)}${stub(17, 4)}${stub(12, 10)}${stub(17, 10)}`;
    case "medium":
      return svg`${tile(8, 4)}${stubRow(10)}`;
    case "large":
      return svg`${tile(8, 8)}${stubRow(14)}`;
    case "xlarge":
      return svg`${tile(8, 12)}${stubRow(18)}`;
    // Corner, which is a watch face slot and nothing else.
    default:
      return nothing;
  }
}

function art(device: DeviceKind, inner: unknown): TemplateResult {
  return html`<svg class="shape-art" viewBox=${VIEW_BOX} aria-hidden="true">
    ${device === "iphone" ? PHONE_OUTLINE : WATCH_OUTLINE}${inner}
  </svg>`;
}

/**
 * One device with one shape on it, lit or not.
 *
 * A family the device does not draw gives the bare outline rather than an
 * error: the same button is drawn for every device in a row, and a row that
 * throws on the one phone that cannot draw corner is worse than a row with a
 * blank phone in it. `shapeArtKinds` is what stops that being drawn at all.
 */
export function deviceShapeArt(family: FamilyKind, device: DeviceKind, on: boolean): TemplateResult {
  const opacity = on ? "1" : "0.45";
  return art(device, device === "iphone" ? phoneShape(family, opacity) : watchShape(family, opacity));
}

/**
 * The Control Center tile: a grid of controls with the top left one yours.
 *
 * Its neighbours are the whole drawing. One lit square on a phone says nothing
 * about Control Center; three grey ones beside it say where it is.
 */
export function controlDeviceArt(device: DeviceKind, on: boolean): TemplateResult {
  const opacity = on ? "1" : "0.45";
  const phone = device === "iphone";
  const side = phone ? 3.5 : 5;
  const radius = phone ? 1 : 1.5;
  const tile = (x: number, y: number, lit: boolean) =>
    svg`<rect x=${x} y=${y} width=${side} height=${side} rx=${radius} fill="currentColor" opacity=${lit ? opacity : GRID} />`;
  const [x0, x1, y0, y1] = phone ? [12, 16.5, 4, 8.5] : [10, 17, 8, 15];
  return art(device, svg`${tile(x0, y0, true)}${tile(x1, y0, false)}${tile(x0, y1, false)}${tile(x1, y1, false)}`);
}

/**
 * Which device outlines a shape is worth drawing.
 *
 * The three shared shapes get both, because that is the point being made: one
 * design, a watch face and a Lock Screen. Corner is a watch face slot, and the
 * four tiles are a phone's Home Screen, so each of those gets the one device
 * that has it.
 */
export function shapeArtKinds(family: FamilyKind): DeviceKind[] {
  if (isHomeFamily(family)) return ["iphone"];
  return isSharedFamily(family) ? ["watch", "iphone"] : ["watch"];
}
