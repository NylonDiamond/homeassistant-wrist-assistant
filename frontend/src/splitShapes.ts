// Splitting a complication that draws several shapes into one document per
// shape, once, the first time the panel opens after the update.
//
// A complication is one shape on one kind of device from 2.8.0 onwards (see
// docs/complication_one_shape_per_document.md in the app repo). Everything
// built before that can carry four shapes in one document, and asking people
// to take them apart by hand would be the first thing they met after the
// update. So the panel does it for them.
//
// The whole run is built out of pure functions with the writes at the edge:
// `documentParts` says what a document holds, `splitDocument` cuts it into its
// children, `ownerCanSplit` decides whether that owner's app can follow, and
// only `autoSplitShapes` talks to the server.
//
// Hard rule, from the doc: no backup, no split. Nothing is written for an
// owner until every record the run means to touch has proved its current
// document will be recoverable from the store's save history, because a bad
// split on first open is the worst bug this beta can have.

import {
  type CustomComplicationConfig,
  type FamilyKind,
  DRAWABLE_FAMILIES,
  newId,
  normalizeOwnership,
  parseConfig,
  schemaVersionFor,
  syncAttachedTaps,
} from "./model.js";
import { dropFamily, keepFamilies, supportedFamilies } from "./layouts.js";
import {
  type ComplicationRecord,
  type HassLike,
  type OwnerSummary,
  deleteRecord,
  fetchList,
  fetchSaveHistory,
  restoreSaveHistory,
  saveRecord,
} from "./ha-api.js";
import { type DeviceOwnerLike, compareVersions, deviceKindOf, parseVersion } from "./version.js";
import { fnv1a64Hex } from "./compiler.js";
import { Draft } from "./draft.js";

// ── the limits ────────────────────────────────────────────────────────────

/**
 * The most live records one owner may hold.
 *
 * Mirrored from `COMPLICATION_MAX_PER_OWNER` in
 * custom_components/wrist_assistant/const.py, which is where the number is
 * decided. The store refuses the save that would pass it ("owner already has
 * 512 complications"), and a split is the one thing in the panel that can walk
 * a device into the limit several records at a time, so it counts first rather
 * than discovering it half way through. A Python test asserts the two numbers
 * are still the same.
 */
export const COMPLICATION_MAX_PER_OWNER = 512;

// ── the gate ──────────────────────────────────────────────────────────────

/**
 * The first app that resolves a placed slot by shape, and so the first app a
 * split can happen under.
 *
 * Below this, a placed complication resolves with `first(where: slotIndex ==
 * n)`. Every child of a split keeps the parent's slot, so an older app would
 * pick whichever child came first and print "No circular layout" on a face
 * that used to draw fine. The build number matters as well as the version
 * because the resolver landed part-way through the 2.8.0 beta, and build
 * numbers restart at 1 on each new version, so a later version passes on its
 * version alone.
 */
export const SPLIT_GATE = { version: "2.8.0", build: 11 } as const;

/** An owner as the gate reads it: its device kind, its app version, and the
 * build number beside it. Structural so the pure half never has to import the
 * websocket types. */
export interface SplitOwnerLike extends DeviceOwnerLike {
  /** Build number (CFBundleVersion) the app last reported, as a numeric
   * string. Null when it has not reported one, and absent from an integration
   * older than the field. */
  app_build?: string | null;
}

/**
 * Whether this owner's app understands a slot that holds one document per
 * shape, and so whether its records may be split.
 *
 * The Library always passes: nothing draws what is kept there, so there is no
 * resolver to get it wrong, and a design taken off the shelf later lands on a
 * device that is by then new enough.
 *
 * An app version that was never reported reads as too old. That is the
 * opposite of how `deviceSupportsControls` treats an unknown version, and
 * deliberately: hiding a card from a device that is really fine costs a
 * setting, while splitting under a device that is really old breaks a face the
 * owner is looking at. Orphans have no entry left to ask and fall here too.
 */
export function ownerCanSplit(owner: SplitOwnerLike | null | undefined): boolean {
  if (deviceKindOf(owner) === "library") return true;
  const have = parseVersion(owner?.app_version);
  const need = parseVersion(SPLIT_GATE.version);
  if (!have || !need) return false;
  const order = compareVersions(have, need);
  if (order !== 0) return order > 0;
  const build = Number.parseInt(String(owner?.app_build ?? ""), 10);
  return Number.isFinite(build) && build >= SPLIT_GATE.build;
}

/**
 * Why this document cannot be edited on this owner, or undefined for one that
 * can.
 *
 * A document with more than one part is a document the editor would have to
 * save back as one shape, and an app below the gate cannot follow that. It
 * opens read-only instead, with the one thing that fixes it. Single-shape
 * documents on the same owner stay editable.
 */
export function editBlockedBySplitGate(
  cfg: Pick<CustomComplicationConfig, "supportedFamilies" | "control">,
  owner: SplitOwnerLike | null | undefined,
): string | undefined {
  if (documentParts(cfg) < 2 || ownerCanSplit(owner)) return undefined;
  const app = deviceKindOf(owner) === "iphone" ? "iPhone" : "watch";
  return `Update the ${app} app to edit this complication.`;
}

// ── what a document holds ─────────────────────────────────────────────────

/** How many documents this one will become: one per shape, plus one for a
 * Control Center control. One means there is nothing to split. */
export function documentParts(
  cfg: Pick<CustomComplicationConfig, "supportedFamilies" | "control">,
): number {
  return supportedFamilies(cfg).length + (cfg.control === undefined ? 0 : 1);
}

/** Whether this document draws more than one thing, and so has to be cut. */
export function needsSplit(
  cfg: Pick<CustomComplicationConfig, "supportedFamilies" | "control">,
): boolean {
  return documentParts(cfg) > 1;
}

// ── the link each child inherits ──────────────────────────────────────────

/**
 * The link one child of a split carries, worked out from its parent's.
 *
 * A `linkId` joins the copies of one design across this home's devices: the
 * watch and the phone hold two records that carry the same uuid, and a save of
 * one is written to the other. Both copies carry the same shapes, so both are
 * cut the same way, and the answer that keeps the link alive is a link per
 * part rather than no link at all: the rectangular child on the watch and the
 * rectangular child on the phone must end up with the same one, without the
 * two runs ever talking to each other.
 *
 * So it is derived, not invented. The same parent link and the same part give
 * the same answer on every device, in every browser, on a second run. Two
 * different parents give different answers, which is what keeps two designs
 * from being merged into one.
 *
 * The result is shaped like a v4 uuid and uppercased, the same as `newId`
 * writes: nothing that reads a link today needs more than a string, but the
 * store's document schema calls it a uuid, and a link that does not look like
 * one would be the sort of thing a later validator refuses.
 */
export function childLinkId(parentLink: string, part: FamilyKind | "control"): string {
  // FNV-1a is 64 bits and a uuid is 128, so two passes over two different
  // strings. The salt keeps this out of the way of any other use of the hash.
  const seed = `wa-split-link:${parentLink}|${part}`;
  const hex = fnv1a64Hex(seed).padStart(16, "0") + fnv1a64Hex(`${seed}#2`).padStart(16, "0");
  // Version nibble 4, variant nibble 8..b, so it reads as a v4.
  const variant = (8 + (Number.parseInt(hex[16]!, 16) & 3)).toString(16);
  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    `4${hex.slice(13, 16)}`,
    `${variant}${hex.slice(17, 20)}`,
    hex.slice(20, 32),
  ].join("-").toUpperCase();
}

/** What this run would do to one record: cut it up, or leave it alone. A
 * one-shape record is left alone whatever else it carries: its `linkId`, if
 * it has one, is the link to the same design on another device, which is
 * what the panel writes now and nothing this run should touch. A record that
 * is cut keeps that link too, one derived link per part (`childLinkId`). */
export type SplitPlan = "split" | "none";

export function planFor(cfg: CustomComplicationConfig): SplitPlan {
  return needsSplit(cfg) ? "split" : "none";
}

// ── the cut ───────────────────────────────────────────────────────────────

/**
 * One document per shape, plus one for the control.
 *
 * The first shape in the canonical family order keeps the record id, so
 * history, the gallery's `replaces` and anything else pointing at this
 * complication still point at something. Every other child, and the
 * control-only child, gets a new id from `nextId`.
 *
 * Every child keeps the whole envelope: the slot (a slot holds one document
 * per shape now, so the children sit together), `hidden`, the name unchanged,
 * the data sources, the refresh interval, the tap action and the pages. What
 * differs is the drawing: each child keeps the layers its own shape owns, its
 * own `perFamily` entry and rules, and `inline` only on the inline child.
 * `keepFamilies` does that cut, the same one Share and Import have always
 * used. A layer no shape owns, which is what a document written before
 * per-shape ownership is full of, reaches every shape that was drawing it:
 * `normalizedForSplit` settles those first, so each of them gets a copy.
 *
 * `linkId` is carried across the cut rather than dropped: each child gets the
 * link `childLinkId` derives for its own part, so the rectangular child on the
 * watch and the rectangular child on the phone stay one design and a save of
 * one still reaches the other. A parent with no link gives children with none.
 * Only a document that is really being cut is touched this way; a single-part
 * document keeps its own link, since it is still the one record it always was.
 *
 * The document passed in is never touched. A document with nothing to split
 * comes back as a single child, so a caller can treat every record the same
 * way.
 */
export function splitDocument(
  cfg: CustomComplicationConfig,
  nextId: () => string = newId,
): CustomComplicationConfig[] {
  const source = normalizedForSplit(cfg);
  const families = supportedFamilies(source);
  const children: CustomComplicationConfig[] = [];
  const cut = needsSplit(source);
  /** The link this part of a cut document carries. Undefined leaves the
   * child's own key alone, which is only ever the uncut case. */
  const linkFor = (part: FamilyKind | "control"): string | undefined =>
    cut && source.linkId !== undefined ? childLinkId(source.linkId, part) : undefined;
  const setLink = (child: CustomComplicationConfig, part: FamilyKind | "control") => {
    const link = linkFor(part);
    if (link !== undefined) child.linkId = link;
    else if (cut) delete child.linkId;
  };

  for (const family of families) {
    const child = pruneLayouts(keepFamilies(source, [family]), family);
    // The link joins this shape to the same shape of the same design on the
    // home's other devices, which is a link the children can still honour.
    setLink(child, family);
    // The control is one per document and becomes its own document below, so
    // no shape child carries a copy of it.
    delete child.control;
    child.id = children.length === 0 ? cfg.id : nextId();
    child.schemaVersion = schemaVersionFor(child);
    children.push(child);
  }

  if (source.control !== undefined) {
    const control = structuredClone(source);
    setLink(control, "control");
    // No guards: this copy draws nothing and is meant to, so the refusal that
    // keeps an author from emptying a document they are editing is not the
    // rule here.
    for (const family of families) dropFamily(control, family);
    // A control has no canvas, so nothing is left for a layer to land on. Any
    // layer no shape owned is already on every shape child, so none is lost.
    control.elements = [];
    control.perFamily = {};
    delete control.groups;
    control.id = children.length === 0 ? cfg.id : nextId();
    control.schemaVersion = schemaVersionFor(control);
    children.push(control);
  }

  if (children.length === 0) {
    // A document with no shape and no control: nothing to cut, and nothing
    // this run should invent. It comes back as itself, link and all, because
    // it is still the one record it was.
    const only = structuredClone(source);
    only.schemaVersion = schemaVersionFor(only);
    children.push(only);
  }
  return children;
}

/**
 * The document the cut works from: a copy with every layer settled on exactly
 * one shape.
 *
 * A document written before per-shape ownership can have one layer that three
 * shapes all draw, held as three placements of one layer. Cutting that up with
 * `keepFamilies` alone would delete the layer from every child but the last,
 * because dropping a shape takes that shape's layers with it. `normalizeOwnership`
 * is the function that already knows the answer: it gives the first shape the
 * original and every later one its own copy, on the same spot, so the document
 * draws exactly what it drew before. It is the same heal the editor runs when
 * it opens such a document, so the split writes what opening and saving by
 * hand would have written.
 */
export function normalizedForSplit(cfg: CustomComplicationConfig): CustomComplicationConfig {
  const source = structuredClone(cfg);
  normalizeOwnership(source);
  syncAttachedTaps(source);
  return source;
}

/** Drop a layout for a shape the child does not draw. A document can arrive
 * carrying one (it was written when the shape was supported, or moved from a
 * device that drew it), and a one-shape document has no room for a second. */
function pruneLayouts(
  child: CustomComplicationConfig,
  family: FamilyKind,
): CustomComplicationConfig {
  for (const f of DRAWABLE_FAMILIES) if (f !== family) delete child.perFamily[f];
  return child;
}

/** The shape a child draws. Undefined for the control-only child, which draws
 * no shape at all. */
export function childFamily(cfg: CustomComplicationConfig): FamilyKind | undefined {
  return supportedFamilies(cfg)[0];
}

// ── what the panel says ───────────────────────────────────────────────────

/** What the panel draws after a run: a line or two, an Undo while there is
 * something to put back, and a Dismiss the panel owns. */
export interface SplitNotice {
  lines: string[];
  /** Absent once there is nothing left to put back. */
  undo?: () => void;
  /** An Undo is running: the button is held disabled. */
  busy: boolean;
}

export function splitLine(names: readonly string[]): string {
  const n = names.length;
  return `Split ${n} complication${n === 1 ? "" : "s"} into one per shape: ${names.join(", ")}.`;
}

export function refusedLine(what: string, reason: string): string {
  return `Not split, ${what}: ${reason}`;
}

// ── writing ───────────────────────────────────────────────────────────────

/** One record this run wrote, and everything Undo needs to put it back. */
export interface SplitWrite {
  owner: string;
  id: string;
  name: string;
  /** A record that already existed and was rewritten, or a child this run
   * created. A parent is restored, a child is deleted. */
  kind: "parent" | "child";
  /** Parent only: the revision holding the pre-split document. The store files
   * the document a save replaces as a past revision before anything on the
   * record moves (`ComplicationStore._remember`), so this is the revision the
   * split based its save on. */
  previous?: number;
  /** The revision this run wrote, which the undo is based on so someone else
   * saving first comes back as the usual conflict. */
  current: number;
}

/** One owner's records, parsed, with what the run means to do to each. */
interface Target {
  record: ComplicationRecord;
  config: CustomComplicationConfig;
  plan: Exclude<SplitPlan, "none">;
}

function errText(err: unknown): string {
  return String((err as { message?: string })?.message ?? err);
}

/**
 * The hard rule, checked per record: no backup, no split.
 *
 * The store keeps the last `COMPLICATION_HISTORY_LIMIT` documents a save
 * replaced, and `save` files the current one before it writes. That is the
 * store's half. This is the panel's half: ask for the record's history and
 * make the server prove it serves one for this record, at the revision this
 * run is about to base its save on.
 *
 * Any answer but that, an error, a record the server does not know, or a
 * revision that moved while the panel was reading, means the recovery this
 * split rests on cannot be trusted.
 *
 * An empty entry list is fine and is the usual answer: a record nobody has
 * saved over has no past revisions yet. What matters is that the command
 * answers for it, because the split's own save is what puts the pre-split
 * document in there.
 */
async function backupReady(
  hass: HassLike,
  owner: string,
  record: ComplicationRecord,
): Promise<string | undefined> {
  try {
    const reply = await fetchSaveHistory(hass, owner, record.id);
    if (reply.complication_id.toUpperCase() !== record.id.toUpperCase()) {
      return "the server answered about another complication";
    }
    if (reply.revision !== record.revision) {
      return "it changed on the server while the panel was reading it";
    }
    return undefined;
  } catch (err) {
    return `its save history could not be read (${errText(err)})`;
  }
}

/** The document to send, through the panel's own save path so each child is
 * normalised and its data sources re-derived exactly as a hand save would. */
function encodeForSave(cfg: CustomComplicationConfig, revision: number | null): Record<string, unknown> {
  return new Draft(structuredClone(cfg), revision).encoded();
}

/** Which records of one owner this run would touch, and what it would do to
 * each. A document this panel cannot read is a document it must not rewrite,
 * so it is skipped whole. */
export function targetsIn(records: readonly ComplicationRecord[]): {
  split: { record: ComplicationRecord; config: CustomComplicationConfig }[];
} {
  const split: { record: ComplicationRecord; config: CustomComplicationConfig }[] = [];
  for (const record of records) {
    if (record.deleted || !record.document) continue;
    let config: CustomComplicationConfig;
    try {
      config = parseConfig(record.document);
    } catch {
      continue;
    }
    if (planFor(config) === "split") split.push({ record, config });
  }
  return { split };
}

/**
 * Cut up one owner's records, or write nothing at all and say why.
 *
 * Every record the run means to touch is proved recoverable before any of them
 * is written, so one record whose history the server will not serve leaves the
 * whole device alone rather than half done. The per-owner cap is counted the
 * same way and for the same reason: a device close to `COMPLICATION_MAX_PER_OWNER`
 * would take some of its children and then be refused the rest, and the panel
 * has no way of knowing which half it left behind.
 */
export async function splitOwner(
  hass: HassLike,
  owner: OwnerSummary,
  records: readonly ComplicationRecord[],
  nextId: () => string = newId,
): Promise<{ writes: SplitWrite[]; split: string[]; problem?: string }> {
  const ownerId = owner.owner_watch_id;
  const targets: Target[] = targetsIn(records).split.map((t): Target => ({ ...t, plan: "split" }));
  if (targets.length === 0) return { writes: [], split: [] };

  const device = owner.device_name ?? ownerId;

  // Every cut adds one record per extra part: the parent is rewritten in
  // place, the rest are new. Counted before the history checks because it
  // needs no round trip and it is the cheapest way to find out the run cannot
  // finish.
  const live = records.filter((r) => !r.deleted).length;
  const after = live + targets.reduce((n, t) => n + (documentParts(t.config) - 1), 0);
  if (after > COMPLICATION_MAX_PER_OWNER) {
    return {
      writes: [],
      split: [],
      problem: refusedLine(
        device,
        `it would end up with ${after} complications, past the ${COMPLICATION_MAX_PER_OWNER} one device can hold`,
      ),
    };
  }

  for (const target of targets) {
    const reason = await backupReady(hass, ownerId, target.record);
    if (reason !== undefined) {
      return {
        writes: [],
        split: [],
        problem: refusedLine(`${target.config.name} on ${device}`, reason),
      };
    }
  }

  const writes: SplitWrite[] = [];
  const split: string[] = [];
  for (const target of targets) {
    const children = splitDocument(target.config, nextId);
    const name = target.config.name;
    // The parent goes first, because its save is what files the pre-split
    // document as the revision Undo restores.
    let failed: string | undefined;
    for (const [index, child] of children.entries()) {
      const parent = index === 0;
      try {
        const result = await saveRecord(
          hass,
          ownerId,
          encodeForSave(child, parent ? target.record.revision : null),
          parent ? target.record.revision : null,
        );
        if (!result.ok || !result.record) {
          failed = result.message ?? result.error ?? "the save was refused";
          break;
        }
        writes.push({
          owner: ownerId,
          id: child.id,
          name,
          kind: parent ? "parent" : "child",
          ...(parent ? { previous: target.record.revision } : {}),
          current: result.record.revision,
        });
      } catch (err) {
        failed = errText(err);
        break;
      }
    }
    if (failed !== undefined) {
      return { writes, split, problem: refusedLine(`${name} on ${device}`, failed) };
    }
    split.push(name);
  }
  return { writes, split };
}

/** Put one written record back the way it was: a child this run made is
 * deleted, a record it rewrote is restored from the revision the split
 * replaced. The panel's own restore path, the one the History dialog uses. */
async function undoWrite(hass: HassLike, write: SplitWrite): Promise<string | undefined> {
  try {
    if (write.kind === "child") {
      const result = await deleteRecord(hass, write.owner, write.id, write.current);
      if (!result.ok) return `${write.name}: ${result.message ?? result.error ?? "the delete was refused"}`;
      return undefined;
    }
    const result = await restoreSaveHistory(
      hass,
      write.owner,
      write.id,
      write.previous ?? write.current,
      write.current,
    );
    if (!result.ok) return `${write.name}: ${result.message ?? result.error ?? "the restore was refused"}`;
    return undefined;
  } catch (err) {
    return `${write.name}: ${errText(err)}`;
  }
}

// ── the run ───────────────────────────────────────────────────────────────

const MARKER_PREFIX = "wa-split-shapes:";

/**
 * Whether this owner has already had its turn in this browser session.
 *
 * Only an owner the run really reached is marked: one below the gate is left
 * unmarked on purpose, so the device that updates its app and reports the new
 * version gets split on the next open rather than being written off for the
 * session.
 *
 * The durable half of "once only" is the data itself, exactly as it is for the
 * link merge: once an owner's records are one shape apiece and carry no
 * `linkId`, a second run in another browser, on another machine, or after this
 * marker is gone finds nothing left to do. This marker is what keeps the
 * notice from coming back on a reload.
 */
function takeOwnerTurn(ownerId: string): boolean {
  const store = (globalThis as { sessionStorage?: Storage }).sessionStorage;
  try {
    if (store?.getItem(MARKER_PREFIX + ownerId) === "done") return false;
    store?.setItem(MARKER_PREFIX + ownerId, "done");
  } catch {
    // Storage off (a private window, blocked site data): the run happens once
    // per page load instead, which is the same thing for anyone who is not
    // reloading.
  }
  return true;
}

/**
 * The whole automatic split, from the panel's first open.
 *
 * Reads every owner's records (the panel itself only loads the selected
 * owner's), cuts what can be cut, and hands back a notice through `onNotice`:
 * once when the run is done, and again on each step of an Undo. Nothing at all
 * is reported when nothing was changed.
 *
 * Nothing runs for a non-admin (the save, delete and history commands are
 * admin-only anyway), for an owner whose app is below the gate, or for an
 * owner that has already had its turn this session. An owner whose list will
 * not load is skipped rather than abandoning the run: unlike the link merge,
 * nothing here reads across devices, so one unreadable device cannot make
 * another device's answer wrong.
 */
export async function autoSplitShapes(
  hass: HassLike,
  owners: readonly OwnerSummary[],
  onNotice: (notice: SplitNotice | undefined) => void,
): Promise<void> {
  if (!hass.user?.is_admin) return;

  let writes: SplitWrite[] = [];
  const split: string[] = [];
  const problems: string[] = [];
  for (const owner of owners) {
    if (!ownerCanSplit(owner)) continue;
    if (!takeOwnerTurn(owner.owner_watch_id)) continue;
    let records: readonly ComplicationRecord[];
    try {
      records = (await fetchList(hass, owner.owner_watch_id)).records;
    } catch {
      continue;
    }
    const result = await splitOwner(hass, owner, records);
    writes = [...writes, ...result.writes];
    split.push(...result.split);
    if (result.problem !== undefined) problems.push(result.problem);
  }
  if (split.length === 0 && problems.length === 0) return;

  /** The lines the notice carries, with `lead` standing where the "Split N"
   * line stands: it is replaced, not added to, once an Undo has put the
   * records back. */
  const lines = (lead: string[]) => [...lead, ...problems];
  const done: string[] = [];
  if (split.length > 0) done.push(splitLine(split));

  const undo = () => {
    onNotice({ lines: lines(done), undo, busy: true });
    void (async () => {
      const failed: string[] = [];
      // Children first, so a slot never holds the restored parent and a child
      // of it at the same time.
      const order = [...writes].sort((a, b) => (a.kind === b.kind ? 0 : a.kind === "child" ? -1 : 1));
      for (const write of order) {
        const problem = await undoWrite(hass, write);
        if (problem !== undefined) failed.push(problem);
      }
      writes = [];
      onNotice({
        lines: lines([
          failed.length === 0
            ? "Undone. Those complications are back the way they were."
            : `Undone, except: ${failed.join("; ")}.`,
        ]),
        busy: false,
      });
    })();
  };

  onNotice({ lines: lines(done), busy: false, ...(writes.length > 0 ? { undo } : {}) });
}
