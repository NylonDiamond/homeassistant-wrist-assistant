// Linked copies: one complication, one design, one record per device it lives
// on.
//
// The store keys every record by its owner, so a document cannot sit on two
// devices at once. What joins the copies instead is `linkId` (model.ts): the
// same uuid on each of them, while their record ids stay different because
// placed faces and widgets point at those. The panel edits one merged document
// and writes a per-device copy of it on every save, so a shared field (the
// name, the layers, the rules, a shared shape) changes on both and a per-device
// field (the slot, `hidden`, a shape the device cannot draw) changes on one.
//
// Everything here is pure, so the New dialog's shape sections, the per-device
// trimming and the save plan can all be read in a test without a browser. Plan:
// app repo docs/complication_one_design_everywhere.md.

import {
  type CustomComplicationConfig,
  type FamilyKind,
  HOME_FAMILIES,
  freeSlotFrom,
  newId,
  ownedElements,
  pruneGroups,
  schemaVersionFor,
} from "./model.js";
import { ALL_FAMILIES, biggestFirst, dropFamily, isHomeFamily, supportedFamilies } from "./layouts.js";
import { type DeviceKind, MIN_IPHONE_VERSION_FOR_HOME_SCREEN, watchSupportsShapes } from "./version.js";
import { mergeForLink } from "./linkMerge.js";

// ── the devices a link can join ───────────────────────────────────────────

/**
 * One device the New dialog offers, as the dialog needs it.
 *
 * Structural rather than an `OwnerSummary`, so this module never has to know
 * about the websocket types or about how a device's name is built: the panel
 * hands over the name it already draws in the picker.
 */
export interface LinkOwner {
  ownerId: string;
  /** The name the device list shows, "Jesse's Watch" or "Jesse's iPhone". */
  label: string;
  kind: DeviceKind;
  /** The shapes this device's app draws, from `familiesFor`. */
  families: readonly FamilyKind[];
  /** Shapes named but not pickable yet, from `comingSoonFamilies`. */
  comingSoon: readonly FamilyKind[];
  /** Whether its app draws a Control Center control. */
  controls: boolean;
  /** The app version it reported, for the per-device trimming below. */
  appVersion?: string | null;
}

/** The shapes a watch face and an iPhone Lock Screen both draw, which are the
 * ones a link shows once rather than twice. Control Center is shared too, but
 * it is not a shape: the document has one control, and every ticked device
 * that can draw one gets it. */
export const SHARED_FAMILIES: readonly FamilyKind[] = ["rectangular", "circular", "inline"];

export function isSharedFamily(family: FamilyKind): boolean {
  return SHARED_FAMILIES.includes(family);
}

// ── the picks ─────────────────────────────────────────────────────────────

/** The picks, by device: a family is ticked for the devices whose set holds
 * it, so a shape a device's copy goes without is one entry missing rather
 * than a shape the whole complication lost. */
export type LinkPicks = ReadonlyMap<string, ReadonlySet<FamilyKind>>;

export function picksFor(picks: LinkPicks, ownerId: string): ReadonlySet<FamilyKind> {
  return picks.get(ownerId) ?? new Set();
}

/** Every family ticked on any device, counted once however many devices draw
 * it: three shared shapes on two devices are three designs, not six. */
export function pickedFamilies(picks: LinkPicks): Set<FamilyKind> {
  const out = new Set<FamilyKind>();
  for (const set of picks.values()) for (const f of set) out.add(f);
  return out;
}

/** Tick or untick one shape on the given devices, as a new map. */
export function setPick(picks: LinkPicks, family: FamilyKind, ownerIds: readonly string[], on: boolean): Map<string, Set<FamilyKind>> {
  const next = new Map<string, Set<FamilyKind>>();
  for (const [ownerId, set] of picks) next.set(ownerId, new Set(set));
  for (const ownerId of ownerIds) {
    const set = next.get(ownerId) ?? new Set<FamilyKind>();
    if (on) set.add(family);
    else set.delete(family);
    next.set(ownerId, set);
  }
  return next;
}

/**
 * The picks as they stand for exactly this set of devices.
 *
 * A device that is not in the set is dropped, so unticking a device and
 * ticking it again starts that copy clean. A device in the set with no picks
 * at all gets an empty set rather than no entry, which is not the same thing:
 * `copyFamilies` reads a missing entry as "this device has no opinion" and
 * hands it every shape, and a device that is only on the link for the Control
 * Center control would arrive carrying every shape the others picked.
 */
export function keepPicks(picks: LinkPicks, ownerIds: ReadonlySet<string>): Map<string, Set<FamilyKind>> {
  const next = new Map<string, Set<FamilyKind>>();
  for (const ownerId of ownerIds) next.set(ownerId, new Set(picks.get(ownerId) ?? []));
  return next;
}

/** The devices that can draw a Control Center control, which is who the
 * Control Center section is about. One control, every device that has one:
 * ticking it puts a copy on each of them. */
export function controlOwners(owners: readonly LinkOwner[]): LinkOwner[] {
  return owners.filter((o) => o.controls);
}

export function joinNames(names: readonly string[]): string {
  if (names.length <= 1) return names[0] ?? "";
  return `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]!}`;
}

// ── the shape sections ────────────────────────────────────────────────────

/**
 * The four headings shapes are offered under, once for the whole home.
 *
 * The dialog used to ask "where does it live" device by device, with a card
 * per place per device, which asks the same question once per device: a home
 * with two watches and two phones drew seven cards to offer eight shapes. A
 * design does not belong to a device, so the sections are fixed and the
 * devices are a separate tick: pick Rectangular once, then say who shows it.
 *
 * `shared` is the three shapes a watch face and a Lock Screen both draw, which
 * is why its title changes with the home rather than being a constant.
 */
export type ShapeSectionKey = "shared" | "watch" | "home" | "control";

export interface ShapeSection {
  key: ShapeSectionKey;
  /** The heading, already worded for this home (see `sectionTitle`). */
  title: string;
  /** The device kinds this home draws the section on, watch before iPhone. The
   * line under the heading reads from it, and so does the title. */
  kinds: DeviceKind[];
  /** The shapes offered here, biggest canvas first. Empty for the control
   * section, which is one tile rather than a set of shapes. */
  families: FamilyKind[];
  /** Shapes named but not pickable yet, after the offered ones. */
  comingSoon: FamilyKind[];
}

/** Which shapes each section holds. Control holds none: the document has one
 * control, and it is a tick rather than a shape to design. */
const SECTION_FAMILIES: Record<ShapeSectionKey, readonly FamilyKind[]> = {
  shared: SHARED_FAMILIES,
  watch: ["corner"],
  home: HOME_FAMILIES,
  control: [],
};

/** The order the sections read in: the shapes both devices draw, then the one
 * only a watch has, then the phone's own screen, then the control. */
const SECTION_ORDER: readonly ShapeSectionKey[] = ["shared", "watch", "home", "control"];

/** Watch before iPhone, the order every device list in the panel uses. */
const KIND_ORDER: readonly DeviceKind[] = ["watch", "iphone"];

/**
 * A section's heading, worded for the devices this home has.
 *
 * Only the shared section changes. Its three shapes are a watch face slot and
 * a Lock Screen slot at once, so a home with both devices has to name both;
 * naming a screen the home does not have is worse than saying less.
 */
export function sectionTitle(key: ShapeSectionKey, kinds: readonly DeviceKind[]): string {
  switch (key) {
    case "shared": {
      const phone = kinds.includes("iphone");
      if (kinds.includes("watch")) return phone ? "Watch face and Lock Screen" : "Watch face";
      return phone ? "Lock Screen" : "Watch face";
    }
    case "watch": return "Watch face only";
    case "home": return "Home Screen";
    case "control": return "Control Center";
  }
}

/**
 * The sections this home is offered, in order.
 *
 * A shape is offered when any device in the home draws it, because the tick is
 * about the design and not about a device: a home with an old phone still
 * offers Rectangular, and the phone simply is not one of the devices that can
 * show it (`ownersDrawing`). A section nothing offers and nothing promises is
 * left out rather than drawn empty, which is what keeps a watch-only home from
 * being shown a Home Screen heading.
 */
export function shapeSections(owners: readonly LinkOwner[]): ShapeSection[] {
  const sections: ShapeSection[] = [];
  for (const key of SECTION_ORDER) {
    const members = SECTION_FAMILIES[key];
    const holds = (list: readonly FamilyKind[]) => members.some((f) => list.includes(f));
    // Who the section is about: the devices that draw something in it, or that
    // have been promised something in it.
    const drawing = key === "control"
      ? owners.filter((o) => o.controls)
      : owners.filter((o) => holds(o.families) || holds(o.comingSoon));
    if (drawing.length === 0) continue;
    const families = biggestFirst(members.filter((f) => owners.some((o) => o.families.includes(f))));
    const comingSoon = biggestFirst(
      members.filter((f) => !families.includes(f) && owners.some((o) => o.comingSoon.includes(f))),
    );
    const kinds = KIND_ORDER.filter((k) => drawing.some((o) => o.kind === k));
    sections.push({ key, title: sectionTitle(key, kinds), kinds, families, comingSoon });
  }
  return sections;
}

/** The devices that can show this shape, which is what a section's shape row
 * names under itself and what greys a device's box out. */
export function ownersDrawing(owners: readonly LinkOwner[], family: FamilyKind): LinkOwner[] {
  return owners.filter((o) => o.families.includes(family));
}

/**
 * The per-device picks behind one set of shapes and one set of devices.
 *
 * The dialog now holds two flat sets, the shapes and the ticked devices, and
 * the save plan still takes picks per device, so this is the join: each ticked
 * device gets the shapes it can actually draw. A phone ticked for a design that
 * is corner and nothing else is not an error, it simply draws none of it.
 *
 * A device with nothing left gets an empty set rather than no entry, which is
 * not the same thing: `copyFamilies` reads a missing entry as "no opinion" and
 * hands that device every shape the others picked.
 */
export function picksFromChoice(
  owners: readonly LinkOwner[],
  families: ReadonlySet<FamilyKind>,
  ownerIds: ReadonlySet<string>,
): Map<string, Set<FamilyKind>> {
  const picks = new Map<string, Set<FamilyKind>>();
  for (const owner of owners) {
    if (!ownerIds.has(owner.ownerId)) continue;
    picks.set(owner.ownerId, new Set(owner.families.filter((f) => families.has(f))));
  }
  return picks;
}

// ── per-device trimming ───────────────────────────────────────────────────

/**
 * The shapes a device's copy may carry.
 *
 * Not `familiesFor`, which answers what the panel offers this device to build.
 * Each copy carries only what its device can draw; the panel reassembles the
 * whole document from the copies when it opens the link, so nothing is lost:
 *
 *   - A phone never carries corner. It is a watch face slot, the widget drops
 *     it on import, and there is nothing on a phone for it to land on.
 *   - A phone below the Home Screen release keeps its three Lock Screen
 *     shapes and loses the tiles, which is the same gate `familiesFor` uses.
 *   - A watch never carries the Home Screen sizes, whatever its version. An
 *     app below the per-shape release fails the whole document on a raw value
 *     it predates (the Swift decoder reads `supportedFamilies` as a
 *     `Set<FamilyKind>`), and an app on that release resolves and archives up
 *     to four tiles it never draws on every timeline entry, and until app
 *     2.8.0 build 10 its picker gate called the unserved Home Screen kinds
 *     stale and re-invalidated on every foreground (checked 2026-09-18 in
 *     `ComplicationPickerEntries.sliceFingerprints`).
 */
export function familiesKeptFor(owner: Pick<LinkOwner, "kind" | "appVersion">): FamilyKind[] {
  if (owner.kind === "iphone") {
    const home = watchSupportsShapes(owner.appVersion, MIN_IPHONE_VERSION_FOR_HOME_SCREEN);
    return ALL_FAMILIES.filter((f) => f !== "corner" && (home || !isHomeFamily(f)));
  }
  return ALL_FAMILIES.filter((f) => !isHomeFamily(f));
}

/** The shapes this device's copy ends up with: what the document has, narrowed
 * to what the device can carry and to what was ticked for it.
 *
 * `chosen` is the per-device tick, which is the only thing that can drop a
 * shape the device could otherwise draw. A shape the document gained since
 * that tick was made is in no device's chosen set, so it goes to every device
 * that can draw it rather than to none. */
export function copyFamilies(
  documentFamilies: readonly FamilyKind[],
  owner: Pick<LinkOwner, "kind" | "appVersion">,
  chosen: LinkPicks,
  ownerId: string,
): FamilyKind[] {
  const kept = familiesKeptFor(owner);
  const mine = chosen.get(ownerId);
  const everyone = pickedFamilies(chosen);
  return ALL_FAMILIES.filter((f) => {
    if (!documentFamilies.includes(f) || !kept.includes(f)) return false;
    // Nobody has an opinion about a shape added since the picks were made.
    if (!everyone.has(f)) return true;
    return mine === undefined || mine.has(f);
  });
}

// ── reading the link off the devices ──────────────────────────────────────

/** One stored record, as this module needs to read it. Structural so the pure
 * side never imports the websocket types. */
export interface LinkRecordLike {
  ownerId: string;
  id: string;
  revision: number;
  deleted: boolean;
  document: Record<string, unknown> | null;
}

/** One device's copy of a linked complication. */
export interface LinkedCopy {
  ownerId: string;
  id: string;
  revision: number;
  slotIndex: number;
  hidden: boolean;
  /** The shapes this copy carries, which is not always the document's whole
   * set: a phone copy has no corner, and a device can be sent without a shape
   * the author dropped from it. */
  families: FamilyKind[];
  name: string;
}

export function linkIdOf(document: Record<string, unknown> | null | undefined): string | undefined {
  const raw = document?.linkId;
  return typeof raw === "string" && raw !== "" ? raw.toUpperCase() : undefined;
}

function copyOf(record: LinkRecordLike): LinkedCopy {
  const doc = record.document ?? {};
  const families = Array.isArray(doc.supportedFamilies) ? doc.supportedFamilies : [];
  return {
    ownerId: record.ownerId,
    id: record.id,
    revision: record.revision,
    slotIndex: typeof doc.slotIndex === "number" ? doc.slotIndex : 0,
    hidden: doc.hidden === true,
    families: ALL_FAMILIES.filter((f) => families.includes(f)),
    name: typeof doc.name === "string" ? doc.name : "",
  };
}

/**
 * The copies of one link, in the order the records were given.
 *
 * Grouped by `linkId` and never by record id: the ids stay different so placed
 * faces and widgets keep pointing at the right record, and a merge of two
 * complications that already existed keeps both of them.
 */
export function linkedCopies(records: readonly LinkRecordLike[], linkId: string): LinkedCopy[] {
  const want = linkId.toUpperCase();
  return records.filter((r) => !r.deleted && linkIdOf(r.document) === want).map(copyOf);
}

/** What each copy's own set of shapes says the picks were, so a re-save keeps
 * a shape the author dropped from one device dropped. */
export function picksFromCopies(copies: readonly LinkedCopy[]): Map<string, Set<FamilyKind>> {
  return new Map(copies.map((c) => [c.ownerId, new Set(c.families)]));
}

/**
 * The copy the panel opens for a link: the phone's when there is one, else the
 * first.
 *
 * The phone copy is the one that is never trimmed. A watch copy may have gone
 * without the Home Screen sizes (an older watch app cannot decode them), and
 * opening that one would show a design with its tiles missing and then save
 * them away for good.
 */
export function openCopyOf(copies: readonly LinkedCopy[], kindOf: (ownerId: string) => DeviceKind): LinkedCopy | undefined {
  return copies.find((c) => kindOf(c.ownerId) === "iphone") ?? copies[0];
}

// ── the save plan ─────────────────────────────────────────────────────────

/** One device a save is about to write to. */
export interface LinkTarget {
  owner: LinkOwner;
  /** The copy already on this device; absent on a device joining the link. */
  copy?: LinkedCopy;
  /** Every slot something on that device already holds, its own copy's
   * included: the copy keeps the slot it has, so it is never in its own way. */
  usedSlots: readonly number[];
}

/** What one device's write is: the identity of its copy and the shapes it
 * carries. The document itself comes from `copyForOwner`. */
export interface LinkWrite {
  ownerId: string;
  label: string;
  id: string;
  slotIndex: number;
  hidden: boolean;
  baseRevision: number | null;
  families: FamilyKind[];
}

export type LinkSavePlan =
  | { ok: true; writes: LinkWrite[] }
  | { ok: false; message: string };

/**
 * Every copy a save is about to write, worked out before a single one goes.
 *
 * A device with no free slot is the reason this is a plan rather than a loop:
 * finding out halfway through leaves the watch saved and the phone not, with
 * no way back. The refusal names the device, because "the watch is full" is no
 * help when the full one is the phone.
 *
 * Each copy keeps its own id (placed faces and widgets point at it), its own
 * slot (the devices fill their seats separately) and its own `hidden` (a
 * decision about one device's own list). Everything else is the document.
 */
export function planLinkedSave(
  cfg: Pick<CustomComplicationConfig, "id" | "supportedFamilies" | "control" | "hidden">,
  targets: readonly LinkTarget[],
  picks: LinkPicks,
  primary: { ownerId: string; baseRevision: number | null },
  makeId: () => string = newId,
): LinkSavePlan {
  const writes: LinkWrite[] = [];
  for (const target of targets) {
    const { owner } = target;
    const families = copyFamilies(cfg.supportedFamilies, owner, picks, owner.ownerId);
    if (families.length === 0 && cfg.control === undefined) {
      return { ok: false, message: `${owner.label} cannot draw any of these shapes. Untick it, or add a shape it can draw.` };
    }
    const slot = target.copy ? target.copy.slotIndex : freeSlotFrom(target.usedSlots, []);
    if (slot < 0) {
      return { ok: false, message: `${owner.label} has no free slot (iPhone presets count too). Delete a complication on it first.` };
    }
    const isPrimary = owner.ownerId === primary.ownerId;
    writes.push({
      ownerId: owner.ownerId,
      label: owner.label,
      id: target.copy?.id ?? (isPrimary ? cfg.id : makeId()),
      slotIndex: slot,
      hidden: target.copy ? target.copy.hidden : isPrimary && cfg.hidden === true,
      baseRevision: isPrimary ? primary.baseRevision : target.copy?.revision ?? null,
      families,
    });
  }
  return { ok: true, writes };
}

/**
 * The document one device gets: the whole complication, minus the shapes this
 * copy does not carry, wearing this copy's identity.
 *
 * The shapes go the way the editor's own remove goes, layers and all, so a
 * trimmed copy is a complete document rather than a set that names a layout
 * nothing draws.
 */
export function copyForOwner(
  cfg: CustomComplicationConfig,
  write: Pick<LinkWrite, "id" | "slotIndex" | "hidden" | "families">,
  linkId: string | undefined,
): CustomComplicationConfig {
  const next = structuredClone(cfg);
  for (const family of supportedFamilies(next)) {
    if (!write.families.includes(family)) dropFamily(next, family);
  }
  next.id = write.id;
  next.slotIndex = write.slotIndex;
  if (write.hidden) next.hidden = true;
  else delete next.hidden;
  if (linkId === undefined) delete next.linkId;
  else next.linkId = linkId;
  next.schemaVersion = schemaVersionFor(next);
  return next;
}

// ── what the save says afterwards ─────────────────────────────────────────

/** How one device's copy ended up. "waiting" is not an error: the store has
 * it, and the device picks it up on its next sync. */
export type LinkSaveState = "saved" | "waiting" | "failed";

export interface LinkSaveRow {
  label: string;
  state: LinkSaveState;
  /** Why the store refused this one, for a failed row. */
  message?: string;
}

/**
 * One line about where the save landed, or nothing to say.
 *
 * A device that has the copy but has not synced yet is named as waiting rather
 * than as a problem, because nothing is wrong: the watch takes it on its next
 * long poll and the phone on the push. A device the store refused is named
 * with its own reason, and only that device: the others saved.
 */
export function linkedSaveStatus(rows: readonly LinkSaveRow[]): string | undefined {
  if (rows.length < 2) return undefined;
  const named = (state: LinkSaveState) => rows.filter((r) => r.state === state).map((r) => r.label);
  const saved = [...named("saved"), ...named("waiting")];
  const waiting = named("waiting");
  const failed = rows.filter((r) => r.state === "failed");
  const parts: string[] = [];
  if (saved.length > 0) {
    parts.push(waiting.length > 0 && waiting.length < saved.length
      ? `Saved on ${joinNames(named("saved"))}, waiting for ${joinNames(waiting)}`
      : waiting.length === saved.length
        ? `Saved, waiting for ${joinNames(waiting)}`
        : `Saved on ${joinNames(saved)}`);
  }
  for (const row of failed) parts.push(`${row.label}: ${row.message ?? "the save failed"}`);
  return parts.length === 0 ? undefined : `${parts.join(". ")}.`;
}

// ── merging two complications into one link ───────────────────────────────

/**
 * One document out of two, for "Link with..." and for the automatic merge of
 * pairs that already share a name.
 *
 * `primary` wins: its name, its layers, its rules, and its design wherever the
 * two draw the same shape. The watch copy is the primary, because the watch is
 * where these designs were built and because a shared shape drawn for a watch
 * face is the one that also reads on a Lock Screen. What comes over from
 * `secondary` is the shapes the primary does not have at all: the Home Screen
 * sizes, and any Lock Screen shape the watch went without.
 *
 * Identity is untouched: the merged document keeps the primary's id, slot and
 * `hidden`, and the caller stamps the new `linkId` on both copies. Neither
 * argument is changed.
 */
export function mergeLinkedContent(
  primary: CustomComplicationConfig,
  secondary: CustomComplicationConfig,
): CustomComplicationConfig {
  return mergeForLink(primary, secondary);
}
