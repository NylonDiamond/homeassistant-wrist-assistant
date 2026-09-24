// The canvas column's small decisions, kept out of the panel so they can be
// tested without a browser: what the Snap menu's switches write, how the
// zoom steps, and what the first-run tiles on an empty complication add.

import type { LayerKind } from "./kinds.js";
import type { FamilyKind } from "./model.js";
import { isHomeFamily } from "./layouts.js";

/** The four snapping settings, as the panel holds them. */
export interface SnapFlags {
  snapGrid: boolean;
  gridStep: number;
  showGridLines: boolean;
  snapLayers: boolean;
}

/** The three switches in the Snap menu. The grid size is a list of its own. */
export type SnapSwitch = "grid" | "lines" | "layers";

/** Whether a switch is on. */
export function snapSwitchOn(flags: SnapFlags, which: SnapSwitch): boolean {
  return which === "grid" ? flags.snapGrid : which === "lines" ? flags.showGridLines : flags.snapLayers;
}

/** The settings after one switch in the Snap menu is pressed. Each switch
 * flips its own flag and leaves the other three alone, the same as the three
 * buttons it replaces. */
export function toggleSnap(flags: SnapFlags, which: SnapSwitch): SnapFlags {
  switch (which) {
    case "grid": return { ...flags, snapGrid: !flags.snapGrid };
    case "lines": return { ...flags, showGridLines: !flags.showGridLines };
    case "layers": return { ...flags, snapLayers: !flags.snapLayers };
  }
}

/** The settings after a grid size is picked. Picking a size means snapping
 * to it, so the grid switch goes on with it. */
export function pickGridStep(flags: SnapFlags, step: number): SnapFlags {
  return { ...flags, snapGrid: true, gridStep: step };
}

/** Whether the Snap button is lit: any snapping at all is on. Grid lines on
 * their own are a view setting, not snapping. */
export function anySnap(flags: SnapFlags): boolean {
  return flags.snapGrid || flags.snapLayers;
}

/**
 * How big the face is drawn, as a share of the size that fits the stage.
 *
 * 1 is Fit: the face as large as the stage allows while staying whole. The
 * steps run from half that to three times it; past Fit the stage scrolls.
 */
export const ZOOM_FIT = 1;
export const ZOOM_STEPS: readonly number[] = [0.5, 0.67, 0.75, 1, 1.25, 1.5, 2, 2.5, 3];
export const ZOOM_MIN = ZOOM_STEPS[0]!;
export const ZOOM_MAX = ZOOM_STEPS[ZOOM_STEPS.length - 1]!;

/** The next step up from `zoom`, or the largest when there is none. A zoom
 * between two steps goes to the next one past it. */
export function zoomIn(zoom: number): number {
  return ZOOM_STEPS.find((s) => s > zoom + 1e-6) ?? ZOOM_MAX;
}

/** The next step down from `zoom`, or the smallest when there is none. */
export function zoomOut(zoom: number): number {
  return [...ZOOM_STEPS].reverse().find((s) => s < zoom - 1e-6) ?? ZOOM_MIN;
}

/** The zoom button's label: "Fit" at Fit, a whole percent otherwise. */
export function zoomLabel(zoom: number): string {
  return Math.abs(zoom - ZOOM_FIT) < 1e-6 ? "Fit" : `${Math.round(zoom * 100)}%`;
}

/**
 * The height the stage keeps for things other than the face, in CSS px: the
 * floating toolbar over it, the hint under it, and, when they are there, the
 * row designer's banner and the first-run tiles. The face's Fit size is what
 * is left.
 */
export function stageReserve(opts: { rowStrip?: boolean; firstRun?: boolean } = {}): number {
  return 64 + 44 + 16 + (opts.rowStrip ? 60 : 0) + (opts.firstRun ? 230 : 0);
}

/** What one first-run tile does: add one blank layer, or open the Add sheet on
 * its presets. */
export type FirstRunAction = { element: LayerKind } | { sheet: "presets" };

export interface FirstRunTile {
  id: "value" | "gauge" | "chart" | "preset";
  title: string;
  blurb: string;
  action: FirstRunAction;
}

/** The four ways to start an empty complication, left to right. */
export const FIRST_RUN_TILES: readonly FirstRunTile[] = [
  { id: "value", title: "A value", blurb: "Text from one entity", action: { element: "text" } },
  { id: "gauge", title: "A gauge", blurb: "Number between min and max", action: { element: "gauge" } },
  { id: "chart", title: "A chart", blurb: "Recent history", action: { element: "chart" } },
  { id: "preset", title: "A preset", blurb: "Set up, just pick an entity", action: { sheet: "presets" } },
];

/** Run one tile through the two hooks the Layers column provides. */
export function runFirstRunTile(
  tile: FirstRunTile,
  hooks: { addElement: (kind: LayerKind) => void; openAddSheet: (tab: "presets") => void },
): void {
  if ("element" in tile.action) hooks.addElement(tile.action.element);
  else hooks.openAddSheet(tile.action.sheet);
}

/** What the empty face is called: a watch face slot, or on an iPhone a Home
 * Screen or Lock Screen one. */
export function slotWord(family: FamilyKind, asPhone: boolean): string {
  if (isHomeFamily(family)) return "Home Screen slot";
  return asPhone ? "Lock Screen slot" : "watch face slot";
}
