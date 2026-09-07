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
  type FamilyKind,
  type InlineLayout,
  DRAWABLE_FAMILIES,
  defaultLayout,
  literal,
  ownedElements,
  isAttachedTap,
  pruneGroups,
  removeElement,
  schemaVersionFor,
} from "./model.js";

/** Every shape, in the order the schema, the pickers and the panel list them. */
export const ALL_FAMILIES: FamilyKind[] = ["rectangular", "circular", "corner", "inline"];

export function isDrawable(family: FamilyKind): family is "rectangular" | "circular" | "corner" {
  return DRAWABLE_FAMILIES.includes(family);
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
export function firstDrawable(cfg: Pick<CustomComplicationConfig, "supportedFamilies">): "rectangular" | "circular" | "corner" | undefined {
  return DRAWABLE_FAMILIES.find((f) => cfg.supportedFamilies.includes(f)) as "rectangular" | "circular" | "corner" | undefined;
}

/** A shape can go only while another remains: the set is never empty. */
export function canRemoveFamily(cfg: Pick<CustomComplicationConfig, "supportedFamilies">, family: FamilyKind): boolean {
  return cfg.supportedFamilies.includes(family) && cfg.supportedFamilies.length > 1;
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
 * on this shape; nothing else in the complication is drawing them. Refuses to
 * empty the set. */
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
