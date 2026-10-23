// The Complications tab's board (plan: app repo
// docs/panel_one_board_plan_2026-10.md, step 5): a row per design, a column
// per device, a box where the design is. The rows are grouped by where the
// shape sits: a watch face, an iPhone Lock Screen, an iPhone Home Screen,
// Control Center.
//
// A box writes what a card's Devices menu writes (`addRowTo` and
// `removeRowFrom` in panel.ts): a tick puts a copy on that device, an untick
// takes it off in one click. The devices a design can go on are its place
// list's (`devicePlaces`): a watch design goes on watches, an iPhone design
// on iPhones, and a design on no device on either. Every other box is a dash
// that says why.
//
// What is worked out here is pure, so a test can reach it; the panel draws
// it through `renderBoard`.

import { css } from "lit";
import type { FamilyKind } from "./model.js";
import type { DeviceKind } from "./version.js";

/** How the Complications tab shows its designs: the board, or the cards. */
export type CompListView = "board" | "cards";

/** Where a row's shape sits, which is the board section it is under. */
export type CompWhere = "face" | "lock" | "home" | "control" | "other";

/** The sections, in board order. */
export const COMP_WHERE_ORDER: readonly CompWhere[] = ["face", "lock", "home", "control", "other"];

export const COMP_WHERE_TITLES: Readonly<Record<CompWhere, string>> = {
  face: "Watch face",
  lock: "Lock Screen",
  home: "Home Screen",
  control: "Control Center",
  other: "Not ready to place",
};

/** The words at a section head's right. */
export const COMP_WHERE_HINTS: Readonly<Record<CompWhere, string>> = {
  face: "On a watch face. A design on no device can go on an iPhone's Lock Screen too.",
  lock: "On an iPhone's Lock Screen.",
  home: "On an iPhone's Home Screen.",
  control: "A control in Control Center, on a watch or an iPhone.",
  other: "These have no shape yet, or wait to move from the iPhone app.",
};

const HOME_SHAPES: readonly string[] = ["small", "medium", "large", "xlarge"];
const LOCK_SHAPES: readonly string[] = ["rectangular", "circular", "inline"];

/** Shapes in the order their rows come inside a section. */
const SHAPE_ORDER: readonly string[] = ["rectangular", "circular", "corner", "inline", "small", "medium", "large", "xlarge"];

/**
 * The section a design is under. `kind` is the kind of device it stands on
 * (`designKind`): a rectangular design on an iPhone is on its Lock Screen,
 * the same shape on a watch or on no device is on a watch face. A Home
 * Screen size is the iPhone's; a corner is the watch's.
 */
export function compWhere(kind: DeviceKind, family: FamilyKind | undefined, control: boolean): CompWhere {
  if (family === undefined) return control ? "control" : "other";
  if (HOME_SHAPES.includes(family)) return "home";
  if (kind === "iphone" && LOCK_SHAPES.includes(family)) return "lock";
  return "face";
}

/** A row's rank inside its section: its shape, then its name. */
export function compRowOrder(a: { family?: FamilyKind; name: string }, b: { family?: FamilyKind; name: string }): number {
  const rank = (f: FamilyKind | undefined) => {
    const i = f === undefined ? -1 : SHAPE_ORDER.indexOf(f);
    return i < 0 ? SHAPE_ORDER.length : i;
  };
  const x = a.name.toLocaleLowerCase();
  const y = b.name.toLocaleLowerCase();
  return rank(a.family) - rank(b.family) || (x < y ? -1 : x > y ? 1 : 0);
}

/** What one box is worked out from. */
export interface CompCellFacts {
  /** The device is in the design's place list (`devicePlaces`). */
  listed: boolean;
  /** The design has a copy there. */
  on: boolean;
  /** That device's app draws the shape. */
  draws: boolean;
  /** No seat is left there for this shape. */
  full: boolean;
  /** Why the app there is too old, in the gate's words, when it is. */
  tooOld?: string;
  /** The copy there is the design's last one: an untick keeps it under
   * "Not on a device". */
  last: boolean;
  /** The kind of device the design stands on, and this one's. */
  designKind: DeviceKind;
  deviceKind: "watch" | "iphone";
  deviceName: string;
  /** The design's shape goes on an iPhone's Lock Screen. */
  lockShape: boolean;
  /** Where an untick of the last copy keeps it ("Not on a device"). */
  shelfName: string;
}

/** One box: a dash with its reason, or a tick with what a click asks for. */
export interface CompCell {
  dash?: string;
  on: boolean;
  /** What a click asks for, or undefined when a click does nothing. */
  next?: boolean;
  title: string;
  note?: string;
  noteWarn?: boolean;
}

export function compCell(f: CompCellFacts): CompCell {
  const name = f.deviceName;
  if (!f.listed) {
    return {
      on: false,
      dash: f.designKind === "iphone"
        ? `An iPhone widget. To have it on ${name}, open it and use Duplicate as.`
        : `A watch complication. To have it on ${name}, open it and use Duplicate as.`,
      title: "",
    };
  }
  if (f.on) {
    return {
      on: true, next: false,
      title: f.last
        ? `Take it off ${name}. It stays in your list, under ${f.shelfName}.`
        : `Take it off ${name}. A face or widget already using it keeps it.`,
    };
  }
  if (!f.draws) {
    if (f.tooOld !== undefined) return { on: false, title: f.tooOld, note: "update app", noteWarn: true };
    return { on: false, dash: `${name} does not draw this shape.`, title: "" };
  }
  if (f.full) {
    return { on: false, title: `${name} is full for this shape. Presets made in the iPhone app count too. Delete a complication on it first.`, note: "full", noteWarn: true };
  }
  const lock = f.deviceKind === "iphone" && f.designKind === "library" && f.lockShape;
  return { on: false, next: true, title: lock ? `Put it on ${name}'s Lock Screen.` : `Put it on ${name}.` };
}

/** What a focused device's head calls its things. */
export function compNoun(kind: "watch" | "iphone", n: number): string {
  if (kind === "iphone") return n === 1 ? "widget" : "widgets";
  return n === 1 ? "complication" : "complications";
}

/** The line under a focused device's board, when designs of the other kind
 * are left out: a watch cannot show an iPhone's widgets, nor the other way. */
export function compLeftOutText(kind: "watch" | "iphone", n: number): string | undefined {
  if (n === 0) return undefined;
  return kind === "watch"
    ? `${n} iPhone ${n === 1 ? "widget is" : "widgets are"} not listed: a watch cannot show ${n === 1 ? "it" : "them"}.`
    : `${n} watch ${n === 1 ? "complication is" : "complications are"} not listed: an iPhone cannot show ${n === 1 ? "it" : "them"}.`;
}

/** Where the tab remembers Board or Cards. */
export const COMP_VIEW_STORE_KEY = "wrist-assistant:complications-view";

/** The view as last left: the board unless Cards was picked. */
export function readCompView(storage: () => Storage): CompListView {
  try {
    const raw = storage().getItem(COMP_VIEW_STORE_KEY);
    return raw === "cards" ? "cards" : "board";
  } catch {
    return "board";
  }
}

export function saveCompView(storage: () => Storage, view: CompListView): void {
  try {
    storage().setItem(COMP_VIEW_STORE_KEY, view);
  } catch {
    /* Storage off: the choice still holds for this visit. */
  }
}

/** The board's own bits on the Complications tab; the table is
 * `boardStyles`. A board page is as wide as the list tabs' boards. */
export const compBoardStyles = css`
  .cl-page.cl-board .cl-wrap { width: min(2200px, 100%); gap: 14px; }
  .cl-acts { align-items: center; }
  .cb-tools { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }
  .cb-tools .pk-search { flex: 0 1 320px; }
  .cb-pic { display: inline-flex; flex: none; align-items: center; justify-content: center; max-height: 96px; overflow: hidden; border-radius: 6px; }
  .cb-pic > * { width: 100%; height: 100%; }
  .cb-empty { margin: 0; font-size: 13px; color: var(--wa-muted); }
`;
