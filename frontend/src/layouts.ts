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
  type Value,
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

/** The Inline text a new Inline layout starts with: the first text layer's
 * value when the document has one, so a complication that already shows a
 * temperature keeps showing it on the inline line, else a literal. */
export function seedInline(cfg: Pick<CustomComplicationConfig, "elements">): InlineLayout {
  const text = cfg.elements.find((e) => e.kind === "text");
  const value: Value = text && text.kind === "text" ? structuredClone(text.payload.value) : literal("Text");
  return { value };
}

/** Add a shape. A canvas shape gets `defaultLayout()` unless a layout is
 * already there (a shape removed and re-added in one session keeps nothing,
 * since removal deletes the layout; a document that arrived with a stray
 * layout keeps it). Inline gets `seedInline`. No-op when already supported. */
export function addFamily(cfg: CustomComplicationConfig, family: FamilyKind): void {
  if (!cfg.supportedFamilies.includes(family)) {
    cfg.supportedFamilies = ALL_FAMILIES.filter((f) => f === family || cfg.supportedFamilies.includes(f));
  }
  if (isDrawable(family)) {
    if (!cfg.perFamily[family]) cfg.perFamily[family] = defaultLayout();
  } else if (!cfg.inline) {
    cfg.inline = seedInline(cfg);
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
  const placed = Object.keys(layout.placements).length;
  if (placed > 0) out.push(`${placed} placement${placed === 1 ? "" : "s"}`);
  if (layout.rules.length > 0) out.push(`${layout.rules.length} rule${layout.rules.length === 1 ? "" : "s"}`);
  if (layout.bezelText || layout.bezelGauge) out.push("the bezel");
  if (layout.curvedText) out.push("the curved text");
  if (layout.backgroundColorHex || layout.borderColorHex) out.push("the background or border");
  return out;
}
