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
  type FamilyLayout,
  type InlineLayout,
  DRAWABLE_FAMILIES,
  defaultLayout,
  literal,
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
 * A new canvas shape starts blank.
 *
 * Layers belong to the document rather than to one shape, so a shape added to
 * a complication that is already drawn used to arrive carrying every layer on
 * it, at frames chosen for a canvas of another size. Blank is the honest
 * start: every layer is still there to be put on the shape, one eye at a time
 * or a whole shape's arrangement at once, and none of them lands somewhere
 * nobody chose. Each layer keeps its own frame under the hidden placement, so
 * showing one puts it where it sits elsewhere rather than in a corner.
 */
function blankLayout(cfg: CustomComplicationConfig): FamilyLayout {
  const layout = defaultLayout();
  for (const el of cfg.elements) {
    layout.placements[el.payload.id] = { frame: { ...el.payload.frame }, isHidden: true };
  }
  return layout;
}

/** Add a shape. A canvas shape starts blank unless a layout is already there
 * (a shape removed and re-added in one session keeps nothing, since removal
 * deletes the layout; a document that arrived with a stray layout keeps it).
 * Inline starts empty. No-op when already supported. */
export function addFamily(cfg: CustomComplicationConfig, family: FamilyKind): void {
  if (!cfg.supportedFamilies.includes(family)) {
    cfg.supportedFamilies = ALL_FAMILIES.filter((f) => f === family || cfg.supportedFamilies.includes(f));
  }
  if (isDrawable(family)) {
    if (!cfg.perFamily[family]) cfg.perFamily[family] = blankLayout(cfg);
  } else if (!cfg.inline) {
    cfg.inline = blankInline();
  }
  cfg.schemaVersion = schemaVersionFor(cfg);
}

/** Remove a shape and its layout in one step, so the set and the document
 * never disagree. Refuses to empty the set. */
export function removeFamily(cfg: CustomComplicationConfig, family: FamilyKind): void {
  if (!canRemoveFamily(cfg, family)) return;
  cfg.supportedFamilies = cfg.supportedFamilies.filter((f) => f !== family);
  if (isDrawable(family)) delete cfg.perFamily[family];
  else delete cfg.inline;
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
  const placed = Object.values(layout.placements).filter((p) => !p.isHidden).length;
  if (placed > 0) out.push(`${placed} placed layer${placed === 1 ? "" : "s"}`);
  if (layout.rules.length > 0) out.push(`${layout.rules.length} rule${layout.rules.length === 1 ? "" : "s"}`);
  if (layout.bezelText || layout.bezelGauge) out.push("the bezel");
  if (layout.curvedText) out.push("the curved text");
  if (layout.backgroundColorHex || layout.borderColorHex) out.push("the background or border");
  return out;
}
