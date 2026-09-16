// The shapes a complication has, as pure functions over the config.
//
// `supportedFamilies` is authoritative since schema 6: the watch draws only
// these shapes and each shape's picker lists the document only when its shape
// is here. These helpers keep the set and the layouts it names in step, so a
// document never says "circular" without a circular layout, or carries an
// `inline` object it does not support. Plan: app repo
// docs/custom_complication_family_kinds.md, slice 4.

import {
  type CustomComplicationConfig,
  type DrawableFamily,
  type Element,
  type FamilyKind,
  type HomeFamily,
  type InlineLayout,
  DRAWABLE_FAMILIES,
  HOME_FAMILIES,
  LIST_FAMILIES,
  WATCH_CANVAS_FAMILIES,
  defaultLayout,
  literal,
  ownedElements,
  isAttachedTap,
  pruneGroups,
  removeElement,
  schemaVersionFor,
  shapesRequired,
} from "./model.js";
import {
  type DeviceOwnerLike,
  MIN_IPHONE_VERSION_FOR_HOME_SCREEN,
  deviceKindOf,
  watchSupportsShapes,
} from "./version.js";

/** Every shape, in the order the schema, the pickers and the panel list them. */
export const ALL_FAMILIES: FamilyKind[] = ["rectangular", "circular", "corner", "inline", ...HOME_FAMILIES];

/** Whether the panel offers the Extra Large Home Screen shape at all.
 *
 * Its design box is measured (2026-09-14, iPhone 15 Pro simulator on iOS 27).
 * What still holds it back is the app: the family exists only in the iOS 27
 * SDK, and the release toolchain is Xcode 26, so the App Store build has no
 * Extra Large widget for a layout to land on. Flip this to true once a release
 * built with Xcode 27 is out; nothing else needs to change. */
export const XLARGE_OFFERED = false;

/** The shapes the panel offers for one owner.
 *
 * Corner is a watch face slot and nothing else: the iPhone lock screen has
 * circular, rectangular and inline, so a phone owner is never offered one.
 * A document that already carries a corner layout keeps it (it was moved or
 * imported from a watch), it simply has no tab here, the same way the panel
 * treats any family a device cannot draw.
 *
 * The four Home Screen shapes go the other way: only a phone has them, and
 * only from the release whose widget extension draws them. A phone below that
 * is not locked out, it simply keeps its three lock screen shapes.
 *
 * Everywhere the panel lists shapes for the selected owner goes through this,
 * so the picker, the filter, the tabs and the New dialog can never disagree
 * about which shapes exist. */
export function familiesFor(owner: DeviceOwnerLike | null | undefined): FamilyKind[] {
  if (deviceKindOf(owner) !== "iphone") return ALL_FAMILIES.filter((f) => !isHomeFamily(f));
  const home = watchSupportsShapes(owner?.app_version, MIN_IPHONE_VERSION_FOR_HOME_SCREEN);
  return ALL_FAMILIES.filter((f) => {
    if (f === "corner") return false;
    if (f === "xlarge") return home && XLARGE_OFFERED;
    if (isHomeFamily(f)) return home;
    return true;
  });
}

/** Shapes the New dialog shows as coming soon: named and drawn, but not yet
 * pickable. Only Extra Large, only for a phone that already gets the other
 * Home Screen shapes, and only while `XLARGE_OFFERED` is false. A watch, or a
 * phone too old for the Home Screen at all, sees nothing here; a promise about
 * a screen the device does not have would just confuse. */
export function comingSoonFamilies(owner: DeviceOwnerLike | null | undefined): FamilyKind[] {
  if (XLARGE_OFFERED) return [];
  if (deviceKindOf(owner) !== "iphone") return [];
  return watchSupportsShapes(owner?.app_version, MIN_IPHONE_VERSION_FOR_HOME_SCREEN) ? ["xlarge"] : [];
}

export function isDrawable(family: FamilyKind): family is DrawableFamily {
  return (DRAWABLE_FAMILIES as FamilyKind[]).includes(family);
}

/**
 * Whether a shape is offered a layer kind at all.
 *
 * Only the list has anything to say here: a cell on a 51 point circle is not a
 * row, and the corner's canvas is a fifth of a face wide, so the list is
 * offered on the wide face and the four Home Screen tiles and nowhere else
 * (`LIST_FAMILIES`). A placement written for one of the other shapes is
 * ignored rather than drawn, so this only decides what the Add buttons show.
 */
export function familyAllowsKind(family: FamilyKind, kind: Element["kind"]): boolean {
  if (kind !== "list") return true;
  return (LIST_FAMILIES as readonly FamilyKind[]).includes(family);
}

/** Whether a shape is one of the four iPhone Home Screen tiles. */
export function isHomeFamily(family: FamilyKind): family is HomeFamily {
  return (HOME_FAMILIES as FamilyKind[]).includes(family);
}

/** The one short line a shape carries beside its name, or undefined for a
 * shape that needs none. The full-page tile is the only one with a condition
 * on it: iOS 27 added the family, and no OS version travels on the wire, so
 * the label is how a phone on iOS 26 learns why the size never appears in its
 * widget gallery. Read by the New dialog's shape card and the shape's own
 * editor card, which is why it is here rather than in either of them. */
export function familyNote(family: FamilyKind): string | undefined {
  return family === "xlarge" ? "iOS 27 and later" : undefined;
}

/** One labelled group of shape cards in the New dialog. */
export interface ShapeGroup {
  /** The heading over the group, or undefined when the dialog has only one
   * group and a heading would just repeat the field's own label. */
  label?: string;
  families: FamilyKind[];
  /** Shapes drawn after `families` as greyed-out cards that cannot be picked
   * yet. Only ever set on the Home Screen group. */
  comingSoon?: FamilyKind[];
}

/**
 * The New dialog's shape cards, split by where the shape lives on the
 * device. A watch has one place, the face, so its shapes stay in one unlabelled
 * run. A phone has two, the Lock Screen and the Home Screen, and a card grid
 * that mixes Circular with Small reads as six sizes of one thing when they are
 * two different screens, so each screen gets its own heading. The Home Screen
 * comes first: it is the bigger canvas and the one a phone owner most often
 * opens the dialog for. Order within a group follows `families`. `comingSoon`
 * (see `comingSoonFamilies`) lands at the end of the Home Screen group.
 */
export function shapeGroups(families: readonly FamilyKind[], comingSoon: readonly FamilyKind[] = []): ShapeGroup[] {
  const home = families.filter(isHomeFamily);
  if (home.length === 0 && comingSoon.length === 0) return [{ families: [...families] }];
  const lock = families.filter((f) => !isHomeFamily(f));
  const homeGroup: ShapeGroup = { label: "Home Screen", families: home };
  if (comingSoon.length > 0) homeGroup.comingSoon = [...comingSoon];
  const groups: ShapeGroup[] = [homeGroup];
  if (lock.length > 0) groups.push({ label: "Lock Screen", families: lock });
  return groups;
}

/**
 * The shapes an import can land on this device: the document's own, narrowed
 * to the shapes the owner draws.
 *
 * A watch document imported on a phone loses Corner, and a Home Screen
 * document imported on a watch loses its tiles, rather than arriving with a
 * shape nothing on this device will ever draw. The preview and the saved copy
 * read the same list, so what is shown is what lands.
 *
 * A document naming nothing this device draws keeps its shapes: there is no
 * complication left otherwise, and the panel already copes with a shape that
 * has no tab.
 */
export function importableFamilies(
  cfg: Pick<CustomComplicationConfig, "supportedFamilies">,
  offered: readonly FamilyKind[],
): FamilyKind[] {
  const have = supportedFamilies(cfg);
  const kept = have.filter((f) => offered.includes(f));
  return kept.length > 0 ? kept : have;
}

/** The document's shapes in canonical order, whatever order the file had. */
export function supportedFamilies(cfg: Pick<CustomComplicationConfig, "supportedFamilies">): FamilyKind[] {
  return ALL_FAMILIES.filter((f) => cfg.supportedFamilies.includes(f));
}

/** The shapes the document does not have yet, in canonical order. */
export function missingFamilies(cfg: Pick<CustomComplicationConfig, "supportedFamilies">): FamilyKind[] {
  return ALL_FAMILIES.filter((f) => !cfg.supportedFamilies.includes(f));
}

/** The first supported canvas shape, for the parts of the editor that need a
 * canvas (layer placements, drags) when the active shape is Inline. */
export function firstDrawable(cfg: Pick<CustomComplicationConfig, "supportedFamilies">): DrawableFamily | undefined {
  return DRAWABLE_FAMILIES.find((f) => cfg.supportedFamilies.includes(f));
}

/** A shape can go while another remains, and the last one can go too when the
 * document has a control: what is left then is a complication in Control
 * Center and in no widget picker. Without a control the set is never emptied,
 * since a document with no shape would draw nowhere at all. */
export function canRemoveFamily(cfg: Pick<CustomComplicationConfig, "supportedFamilies" | "control">, family: FamilyKind): boolean {
  if (!cfg.supportedFamilies.includes(family)) return false;
  return cfg.supportedFamilies.length > 1 || !shapesRequired(cfg);
}

/**
 * A new Inline layout starts empty.
 *
 * It used to copy the first text layer's value, on the theory that a
 * complication already showing a temperature wants to show it on the inline
 * line too. It reads as the shape helping itself to something nobody offered
 * it, and it is the same complaint a canvas shape used to earn by arriving
 * with every layer already on it. Every shape now starts with nothing, and
 * the Inline card is the first thing on screen after one is added, so there
 * is one field to fill in and no guess to undo.
 *
 * Empty is also the document's own idea of untouched, so a shape added and
 * dropped again goes without stopping to ask what it would throw away.
 */
export function blankInline(): InlineLayout {
  return { value: literal("") };
}

/**
 * Add a shape. A canvas shape starts with nothing on it: no layers, an empty
 * Layers card, and the offer to take a copy of another shape's arrangement.
 *
 * Every layer belongs to one shape, so there is nothing for a new shape to
 * inherit. It used to arrive carrying every layer in the document, at frames
 * chosen for a canvas of another size, which read as the shape helping itself
 * to something nobody offered it.
 *
 * A layout already there is kept (a document that arrived with a stray one);
 * a shape removed and re-added in one session keeps nothing, since removal
 * deletes the layout. Inline starts empty. No-op when already supported.
 */
export function addFamily(cfg: CustomComplicationConfig, family: FamilyKind): void {
  if (!cfg.supportedFamilies.includes(family)) {
    cfg.supportedFamilies = ALL_FAMILIES.filter((f) => f === family || cfg.supportedFamilies.includes(f));
  }
  if (isDrawable(family)) {
    if (!cfg.perFamily[family]) cfg.perFamily[family] = defaultLayout();
  } else if (!cfg.inline) {
    cfg.inline = blankInline();
  }
  cfg.schemaVersion = schemaVersionFor(cfg);
}

/** Remove a shape, its layout and its layers in one step, so the set and the
 * document never disagree. The layers go with it because they were only ever
 * on this shape; nothing else in the complication is drawing them. Refuses
 * whatever `canRemoveFamily` refuses, which on a document with no control
 * means it never empties the set. */
export function removeFamily(cfg: CustomComplicationConfig, family: FamilyKind): void {
  if (!canRemoveFamily(cfg, family)) return;
  cfg.supportedFamilies = cfg.supportedFamilies.filter((f) => f !== family);
  if (isDrawable(family)) {
    for (const el of ownedElements(cfg, family)) removeElement(cfg, el.payload.id);
    delete cfg.perFamily[family];
    pruneGroups(cfg);
  } else {
    delete cfg.inline;
  }
  cfg.schemaVersion = schemaVersionFor(cfg);
}

/**
 * A copy with only the shapes in `keep`, each dropped one removed the way
 * `removeFamily` removes it, layers included. Share and Import use it to send
 * or take part of a design. A `keep` that names none of the document's shapes
 * would send a design with nothing in it, so it returns the copy whole
 * instead; that covers a control-only document, whose set is already empty and
 * comes back untouched. The document passed in is never touched.
 */
export function keepFamilies(cfg: CustomComplicationConfig, keep: readonly FamilyKind[]): CustomComplicationConfig {
  const next = structuredClone(cfg);
  const have = supportedFamilies(next);
  if (!have.some((f) => keep.includes(f))) return next;
  for (const family of have) if (!keep.includes(family)) removeFamily(next, family);
  return next;
}

/** What removing a shape would throw away, for the confirmation. Empty when
 * the layout holds nothing the user typed, in which case no confirmation is
 * needed. */
export function familyContentSummary(cfg: CustomComplicationConfig, family: FamilyKind): string[] {
  const out: string[] = [];
  if (!isDrawable(family)) {
    const inline = cfg.inline;
    if (!inline) return out;
    const isDefault = inline.value.kind.kind === "literal" && (inline.value.kind.value === "" || inline.value.kind.value === "Text") && !inline.label && !inline.symbol;
    if (!isDefault) out.push("the Inline text");
    return out;
  }
  const layout = cfg.perFamily[family];
  if (!layout) return out;
  // Every layer on the shape, hidden ones included: removing the shape deletes
  // them now, so a hidden layer is still something the author would lose.
  const placed = ownedElements(cfg, family).filter((el) => !isAttachedTap(cfg, el)).length;
  if (placed > 0) out.push(`${placed} layer${placed === 1 ? "" : "s"}`);
  if (layout.rules.length > 0) out.push(`${layout.rules.length} rule${layout.rules.length === 1 ? "" : "s"}`);
  if (layout.bezelText || layout.bezelGauge) out.push("the bezel");
  if (layout.curvedText) out.push("the curved text");
  if (layout.backgroundColorHex || layout.borderColorHex) out.push("the background or border");
  return out;
}

// ── The Control Center tab ────────────────────────────────────────────────
//
// A control is not a shape, but it is edited like one: it takes a tab in the
// canvas card's shape bar, and while that tab is up the layer tools step
// aside, because a control has no layers for them to act on. These two are the
// decisions that view needs, kept pure so they can be read in a test.

/**
 * Whether a document opens on its Control Center tab rather than on a shape.
 *
 * Only a document that is nothing but a control: it has one, and no shape has
 * a single layer. That is what the New dialog's Control tile makes, and
 * landing such a document on an empty canvas with an add-layer palette beside
 * it would point the author at the one thing they did not ask for. A document
 * with layers opens on its layers, control or not.
 */
export function opensInControlView(cfg: Pick<CustomComplicationConfig, "control" | "elements">): boolean {
  return cfg.control !== undefined && cfg.elements.length === 0;
}

/**
 * The note that stands where the layer tools were, as its two lines: what
 * draws a control, then what the shapes beside it do.
 *
 * `shapeName` is the shape that stays, already titled, and undefined on a
 * document that has no shape at all: there the second line offers one instead
 * of explaining one. `phone` picks the surface a shape shows up on, since the
 * same sentence has to be true on a watch face and on an iPhone lock screen.
 */
export function controlNoteLines(shapeName: string | undefined, phone: boolean): [string, string] {
  const surface = phone ? "Lock Screen" : "watch face";
  return [
    "A control has no layers. Control Center draws it from the title, symbol, tint, value line and status on the right.",
    shapeName === undefined
      ? `This complication has no widget. Add a shape above if you want one on the ${surface}.`
      : `The ${shapeName} tab is what the ${surface} shows; a complication always keeps at least one shape.`,
  ];
}
