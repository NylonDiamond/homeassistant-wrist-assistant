// Parts: a few layers of a complication, kept under a name and dropped into
// another complication later.
//
// A part is share text. Not a private format of its own: the same wire the
// Share dialog writes, scrubbed the same way, with the author's entity ids
// replaced by the numbered `domain.shared_N` placeholders. That buys three
// things at once. A part of a complication reading the kitchen light can be
// dropped into one reading the porch light, because the way in is the same
// entity table the Import dialog shows. A part survives a panel that has
// learned new keys, because `parseImportText` is the one reader for both.
// And the library holds nothing about this house, which is what makes it safe
// to keep a part around, export it, or hand it to somebody.
//
// What is not a part: the document's own settings. A tap action, a refresh
// interval, the bezel, the Control Center control and the shape's background
// all belong to the complication rather than to the layers somebody picked, so
// they are left behind. A part is layers, their placements on the shape they
// were drawn on, the groups they were in, and the shared values they read.

import {
  type CustomComplicationConfig,
  type FamilyKind,
  type FamilyLayout,
  type LayerClip,
  type NamedValue,
  DRAWABLE_FAMILIES,
  copyElements,
  defaultLayout,
  forEachValue,
  hasCanvas,
  newId,
  pasteElementsOnto,
  schemaVersionFor,
} from "./model.js";
import { exportText, shareSlots } from "./transfer.js";

/** The same ceiling the share text carries, mirrored from `parts_store.py`. A
 * part that will not fit is refused before it is sent, so the message says
 * what happened instead of the socket saying "invalid". */
export const PART_TEXT_MAX_BYTES = 64 * 1024;

/** What the integration keeps. `text` is the whole part; the panel draws the
 * picture from it rather than storing one. */
export interface SavedPart {
  id: string;
  name: string;
  text: string;
  created_at: string;
  updated_at: string;
}

// ── making a part ─────────────────────────────────────────────────────────

/** Every shared value the document reads, however many deep, upper-cased.
 * A value reached only from another shared value counts, so a chain arrives
 * whole or not at all. */
function reachableValueIds(cfg: CustomComplicationConfig): Set<string> {
  const out = new Set<string>();
  for (let grew = true; grew;) {
    grew = false;
    forEachValue(cfg, (v, site) => {
      if (v.kind.kind !== "named") return;
      // A reference sitting inside a shared value only counts once that shared
      // value is known to be read; otherwise a value nothing reads would drag
      // its whole chain along.
      if (site.kind === "named") {
        const owner = site.valueId?.toUpperCase();
        if (owner === undefined || !out.has(owner)) return;
      }
      const id = v.kind.id.toUpperCase();
      if (!out.has(id)) {
        out.add(id);
        grew = true;
      }
    });
  }
  return out;
}

/**
 * The document one part is: the picked layers and nothing else.
 *
 * `ids` are drawing layers, the way `selectedIds` hands them over. An attached
 * tap and a chart's own numbers come along with their owner, because
 * `copyElements` takes them; that is the same rule a copy and a duplicate
 * follow, so a part holds what somebody would expect to have picked.
 *
 * `family` is the shape the layers were picked on. It rides along so a part
 * dropped onto another shape can be refitted rather than landing at the size
 * it happened to have on a wider canvas.
 */
export function partFromSelection(
  cfg: CustomComplicationConfig,
  ids: readonly string[],
  name: string,
  family?: FamilyKind,
): CustomComplicationConfig {
  const clip = copyElements(cfg, ids, family);
  const doc = structuredClone(cfg);
  doc.id = newId();
  doc.name = name;
  doc.slotIndex = 0;
  doc.elements = clip.elements;
  if (clip.groups.length > 0) doc.groups = clip.groups;
  else delete doc.groups;

  const perFamily: Partial<Record<FamilyKind, FamilyLayout>> = {};
  for (const f of DRAWABLE_FAMILIES) {
    const placements = clip.placements[f];
    if (!placements || Object.keys(placements).length === 0) continue;
    perFamily[f] = { ...defaultLayout(), placements: structuredClone(placements) };
  }
  // A layer picked before it was ever placed has no placement anywhere, so the
  // shape it was picked on is named here rather than leaving a part with no
  // shape at all, which nothing could draw.
  if (Object.keys(perFamily).length === 0) {
    const fallback = family !== undefined && hasCanvas(family)
      ? family
      : cfg.supportedFamilies.find((f) => hasCanvas(f)) ?? "rectangular";
    perFamily[fallback] = defaultLayout();
  }
  doc.perFamily = perFamily;
  // Never empty: a document with no shape is one nothing can draw, and the
  // encoder is entitled to assume there is at least one.
  doc.supportedFamilies = DRAWABLE_FAMILIES.filter((f) => perFamily[f] !== undefined);

  // The complication's own settings, which are not the layers'.
  delete doc.inline;
  delete doc.control;
  delete doc.openPageId;
  delete doc.openPageName;
  delete doc.hidden;
  delete doc.refreshMinutes;
  delete doc.showSuccessFlash;
  delete doc.successFlashColorHex;
  delete doc.httpShowResult;
  doc.tapAction = { type: "none" };
  doc.dataSources = [];

  const keep = reachableValueIds(doc);
  doc.values = doc.values.filter((v) => keep.has(v.id.toUpperCase()));
  doc.schemaVersion = schemaVersionFor(doc);
  return doc;
}

/** One part as the text the library holds: the share wire, entity ids replaced
 * by the numbered slots. `knownDomains` gates ids found in free text, exactly
 * as the Share dialog gates them. */
export function partText(cfg: CustomComplicationConfig, knownDomains: ReadonlySet<string>): string {
  return exportText(cfg, "share", shareSlots(cfg, knownDomains));
}

/** Whether a part's text fits the store's cap, so the panel can say so before
 * the socket does. */
export function partTextFits(text: string): boolean {
  return new TextEncoder().encode(text).length <= PART_TEXT_MAX_BYTES;
}

/**
 * A name for a part that the library does not already use.
 *
 * Built from the layers themselves: one layer gives its own name, two give
 * both, more give the first and a count, so a saved part reads as what it is
 * without anybody having to type. Numbered only when it has to be, the same
 * way an imported complication is.
 */
export function suggestPartName(layerNames: readonly string[], taken: ReadonlySet<string>): string {
  const names = layerNames.map((n) => n.trim()).filter((n) => n !== "");
  let base = "Part";
  if (names.length === 1) base = names[0]!;
  else if (names.length === 2) base = `${names[0]} and ${names[1]}`;
  else if (names.length > 2) base = `${names[0]} and ${names.length - 1} more`;
  base = base.slice(0, 60);
  const has = (n: string) => taken.has(n.trim().toLowerCase());
  if (!has(base)) return base;
  for (let n = 2; n <= 99; n += 1) {
    const next = `${base.slice(0, 56)} ${n}`;
    if (!has(next)) return next;
  }
  return base;
}

// ── putting a part back ───────────────────────────────────────────────────

/** The shape a part was drawn on: its first shape with a canvas. */
export function partFamily(part: CustomComplicationConfig): FamilyKind | undefined {
  return part.supportedFamilies.find((f) => hasCanvas(f))
    ?? DRAWABLE_FAMILIES.find((f) => part.perFamily[f] !== undefined);
}

/** A name no shared value of `cfg` uses, ignoring case. */
function freeValueName(taken: Set<string>, wanted: string): string {
  const base = wanted.trim() || "Value";
  if (!taken.has(base.toLowerCase())) {
    taken.add(base.toLowerCase());
    return base;
  }
  for (let i = 2; ; i += 1) {
    const next = `${base} ${i}`;
    if (!taken.has(next.toLowerCase())) {
      taken.add(next.toLowerCase());
      return next;
    }
  }
}

/**
 * Give a part's shared values fresh ids, in place.
 *
 * A part carries the ids it was cut with, so dropping the same part in twice
 * would put two values with one id into a document and leave every reader of
 * them pointing at whichever came first. Fresh ids on the way in is the same
 * thing a paste does for layers, for the same reason.
 */
function freshenSharedValues(part: CustomComplicationConfig, takenNames: Set<string>): void {
  const map = new Map<string, string>();
  for (const named of part.values) map.set(named.id.toUpperCase(), newId());
  forEachValue(part, (v) => {
    if (v.kind.kind !== "named") return;
    const to = map.get(v.kind.id.toUpperCase());
    if (to) v.kind.id = to;
  });
  for (const named of part.values) {
    named.id = map.get(named.id.toUpperCase())!;
    named.name = freeValueName(takenNames, named.name);
  }
}

/**
 * Put a part's layers into an open document, on one shape.
 *
 * One call, so one undo step: the shared values arrive with the layers that
 * read them, and a part dropped in by mistake goes away whole. The layers land
 * the way a paste lands them, refitted when the part was cut on a shape of
 * another size, and the ids that come back are what the panel selects.
 */
export function insertPart(
  target: CustomComplicationConfig,
  part: CustomComplicationConfig,
  family: FamilyKind,
): string[] {
  const doc = structuredClone(part);
  const takenNames = new Set(target.values.map((v) => v.name.trim().toLowerCase()));
  freshenSharedValues(doc, takenNames);
  target.values.push(...doc.values.map((v): NamedValue => structuredClone(v)));
  const from = partFamily(doc);
  const clip: LayerClip = copyElements(doc, doc.elements.map((el) => el.payload.id), from);
  return pasteElementsOnto(target, clip, family);
}
