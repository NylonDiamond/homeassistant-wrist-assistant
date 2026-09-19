// Joining the complications a user already built twice, once on the watch and
// once on the iPhone, into one linked design.
//
// Wrist Assistant 2.8.0 lets one document live on several owners at once,
// joined by `linkId` (see docs/complication_one_design_everywhere.md in the app
// repo, "Merging existing pairs"). Everything built before that is two separate
// records with the same name, and asking people to re-link them by hand would
// be the first thing they met after the update. So the panel does it for them,
// once, the first time it opens.
//
// The whole run is built out of pure functions with the writes at the edge:
// `findLinkPairs` decides what to join, `mergeForLink` decides what the joined
// document says, `linkedCopy` cuts each device's copy of it, and only
// `autoLinkMerge` talks to the server.
//
// Hard rule, from the doc: no backup, no merge. Nothing is written for a pair
// until both of its records have proved their current document will be
// recoverable from the store's save history, because a bad merge on first open
// is the worst bug this beta can have.

import {
  type CustomComplicationConfig,
  type Element,
  type FamilyKind,
  DRAWABLE_FAMILIES,
  HOME_FAMILIES,
  defaultLayout,
  newId,
  pagesSpecOf,
  parseConfig,
  schemaVersionFor,
  usesPages,
} from "./model.js";
import { ALL_FAMILIES, blankInline, keepFamilies } from "./layouts.js";
import {
  type ComplicationRecord,
  type HassLike,
  type OwnerSummary,
  fetchList,
  fetchSaveHistory,
  restoreSaveHistory,
  saveRecord,
} from "./ha-api.js";
import { type DeviceKind, deviceKindOf, watchSupportsShapes } from "./version.js";
import { Draft } from "./draft.js";

// ── pairing ───────────────────────────────────────────────────────────────

/** One complication as a single owner holds it, with its document parsed. */
export interface LinkSide {
  owner: OwnerSummary;
  record: ComplicationRecord;
  config: CustomComplicationConfig;
}

/** Two records that are the same complication built twice. */
export interface LinkPair {
  /** The name both copies carry, as the watch copy spells it. */
  name: string;
  watch: LinkSide;
  phone: LinkSide;
}

/** Every live record of one owner, as the list command handed them over. */
export interface OwnerRecords {
  owner: OwnerSummary;
  records: readonly ComplicationRecord[];
}

export interface PairingResult {
  pairs: LinkPair[];
  /** Names left alone because one side holds more than one of them. The panel
   * offers these to "Link with..." in the complication menu instead. */
  ambiguous: string[];
}

/**
 * The pairs to join, and the names that are too ambiguous to join.
 *
 * A pair is one name (trimmed, case-insensitive), held once on a watch owner
 * and once on an iPhone owner, with neither copy already carrying a `linkId`.
 *
 * That last condition is what makes the merge once-only, and once-only across
 * every browser rather than once per browser: the merge writes a `linkId` onto
 * both copies, so a second run in another browser, on another machine, or after
 * the session flag is gone finds nothing left to pair. The session flag in
 * `autoLinkMerge` only keeps the notice from reappearing on a reload.
 *
 * A name one device holds twice cannot be paired without guessing which copy
 * the other device's copy belongs to, so it is skipped and listed. Two watches
 * holding it counts the same way: there is still no single watch copy to pair.
 */
export function findLinkPairs(loaded: readonly OwnerRecords[]): PairingResult {
  interface Group {
    name: string;
    watch: LinkSide[];
    phone: LinkSide[];
    /** Some copy of this name is already linked, so the whole name is left
     * alone: it has been through this once. */
    linked: boolean;
  }
  const groups = new Map<string, Group>();
  for (const { owner, records } of loaded) {
    const kind = deviceKindOf(owner);
    for (const record of records) {
      if (record.deleted || !record.document) continue;
      let config: CustomComplicationConfig;
      try {
        config = parseConfig(record.document);
      } catch {
        // A document this panel cannot read is a document it must not rewrite.
        continue;
      }
      const name = config.name.trim();
      if (name === "") continue;
      const key = name.toLowerCase();
      const group = groups.get(key) ?? { name, watch: [], phone: [], linked: false };
      if (config.linkId !== undefined) group.linked = true;
      else (kind === "iphone" ? group.phone : group.watch).push({ owner, record, config });
      groups.set(key, group);
    }
  }

  const pairs: LinkPair[] = [];
  const ambiguous: string[] = [];
  for (const group of groups.values()) {
    if (group.linked) continue;
    // A name only one kind of device holds is not a pair at all, and saying so
    // would be noise: there is nothing to join and nothing to choose between.
    if (group.watch.length === 0 || group.phone.length === 0) continue;
    const watch = group.watch[0];
    const phone = group.phone[0];
    if (group.watch.length === 1 && group.phone.length === 1 && watch && phone) {
      pairs.push({ name: watch.config.name.trim(), watch, phone });
    } else {
      ambiguous.push(group.name);
    }
  }
  const byName = (a: string, b: string) => a.localeCompare(b);
  pairs.sort((a, b) => byName(a.name, b.name));
  ambiguous.sort(byName);
  return { pairs, ambiguous };
}

// ── content ───────────────────────────────────────────────────────────────

/**
 * The one document a joined pair shares.
 *
 * Start from the watch copy and add every shape it lacks from the phone copy,
 * with the layers, rules and shared values those shapes draw. Where both copies
 * have the same shape the watch design wins, whole: the phone's old design is
 * not thrown away, it stays in that record's save history as the revision the
 * merge replaced.
 *
 * A layer the two copies share by id (a design that was shared from one device
 * to the other) is the same layer twice, so the watch's copy of it stays and
 * the phone's is dropped, which is the same "watch wins" rule read one level
 * down. The phone's placement for it on a phone-only shape is kept, since that
 * is a per-shape frame rather than a design.
 *
 * Neither document passed in is touched.
 *
 * (The other half of this work is writing `mergeLinkedContent` in linking.ts.
 * The two are the same rule and are meant to become one function; this copy
 * exists so the merge could be built and tested on its own.)
 */
export function mergeForLink(
  watchDoc: CustomComplicationConfig,
  phoneDoc: CustomComplicationConfig,
): CustomComplicationConfig {
  const merged = structuredClone(watchDoc);

  // 1. The shapes the watch copy does not have.
  const added: FamilyKind[] = [];
  for (const family of ALL_FAMILIES) {
    if (!phoneDoc.supportedFamilies.includes(family)) continue;
    if (merged.supportedFamilies.includes(family)) continue;
    if (family === "inline") {
      merged.inline = phoneDoc.inline === undefined ? blankInline() : structuredClone(phoneDoc.inline);
    } else {
      const layout = phoneDoc.perFamily[family];
      merged.perFamily[family] = layout === undefined ? defaultLayout() : structuredClone(layout);
    }
    added.push(family);
  }
  merged.supportedFamilies = ALL_FAMILIES.filter(
    (f) => merged.supportedFamilies.includes(f) || added.includes(f),
  );

  // 2. The layers those shapes place, and the attached taps that follow them.
  const placed = new Set<string>();
  for (const family of added) {
    if (!(DRAWABLE_FAMILIES as FamilyKind[]).includes(family)) continue;
    const layout = merged.perFamily[family];
    if (!layout) continue;
    for (const id of Object.keys(layout.placements)) placed.add(id);
  }
  const held = new Set(merged.elements.map((el) => el.payload.id));
  const copied: Element[] = [];
  for (const el of phoneDoc.elements) {
    if (held.has(el.payload.id)) continue;
    const owner = el.kind === "tap" ? el.payload.attachedTo : undefined;
    if (!placed.has(el.payload.id) && !(owner !== undefined && placed.has(owner))) continue;
    const clone = structuredClone(el);
    // A page number means nothing outside the document it came from: the
    // merged document has the watch copy's pages, so a layer pinned past them
    // would be a layer that never draws. Unpinned draws on every page, which
    // is what a layer arriving from a document with no pages already does.
    if (clone.payload.page !== undefined) {
      const pages = usesPages(merged) ? pagesSpecOf(merged).count : 1;
      if (clone.payload.page > pages) delete clone.payload.page;
    }
    copied.push(clone);
    held.add(el.payload.id);
  }
  merged.elements = [...merged.elements, ...copied];

  // 3. What those layers read and belong to. Shared values are copied whole
  // rather than by use: a `named` value a layer points at and the document
  // does not hold draws as nothing, and an unused row in the Shared values
  // card is the cheaper mistake of the two.
  const values = new Set(merged.values.map((v) => v.id));
  for (const value of phoneDoc.values) {
    if (values.has(value.id)) continue;
    merged.values = [...merged.values, structuredClone(value)];
    values.add(value.id);
  }
  const groupsUsed = new Set(copied.map((el) => el.payload.groupId).filter((g): g is string => g !== undefined));
  if (groupsUsed.size > 0) {
    const groupsHeld = new Set((merged.groups ?? []).map((g) => g.id));
    const extra = (phoneDoc.groups ?? []).filter((g) => groupsUsed.has(g.id) && !groupsHeld.has(g.id));
    if (extra.length > 0) merged.groups = [...(merged.groups ?? []), ...structuredClone(extra)];
  }
  // `dataSources` is derived from the layers on every save (`Draft.encoded`),
  // so the merged document's sources follow the merged layers. Carrying the
  // phone's across keeps the document readable before that save.
  const sources = new Set(merged.dataSources.map((d) => JSON.stringify(d)));
  for (const source of phoneDoc.dataSources) {
    const key = JSON.stringify(source);
    if (sources.has(key)) continue;
    merged.dataSources = [...merged.dataSources, structuredClone(source)];
    sources.add(key);
  }

  // 4. A Control Center control the watch copy never had. The control is one
  // per document and both devices draw it, so the phone's stands rather than
  // being lost; a watch that already has one keeps it, like every shared part.
  if (merged.control === undefined && phoneDoc.control !== undefined) {
    merged.control = structuredClone(phoneDoc.control);
  }

  merged.schemaVersion = schemaVersionFor(merged);
  return merged;
}

/**
 * One device's copy of the merged document.
 *
 * The record keeps its id and its seat in that device's picker, and its own
 * `hidden` flag, because those are per device and always have been. What is
 * shared is the design, plus the `linkId` that says the two are one
 * complication.
 *
 * Shapes the device cannot draw are cut, layers and all:
 *
 * - An iPhone never draws Corner, so a phone copy never carries it.
 * - A watch app older than 2.8.0 reads `supportedFamilies` into a Swift enum
 *   and fails the whole document on a name it does not know, so a watch below
 *   that release gets no Home Screen shapes. A watch that has not reported a
 *   version reads as old here, since guessing the other way blanks the
 *   complication on the wrist.
 *
 * A cut that would leave no shape at all is refused by `keepFamilies`, which
 * hands back the document whole, so this can never write a complication that
 * draws nowhere.
 */
export function linkedCopy(
  merged: CustomComplicationConfig,
  own: Pick<CustomComplicationConfig, "id" | "slotIndex" | "hidden">,
  kind: DeviceKind,
  linkId: string,
  appVersion?: string | null,
): CustomComplicationConfig {
  const drop: FamilyKind[] = kind === "iphone"
    ? ["corner"]
    : watchSupportsShapes(appVersion) ? [] : [...HOME_FAMILIES];
  const copy = keepFamilies(merged, merged.supportedFamilies.filter((f) => !drop.includes(f)));
  copy.id = own.id;
  copy.slotIndex = own.slotIndex;
  if (own.hidden === true) copy.hidden = true;
  else delete copy.hidden;
  copy.linkId = linkId;
  copy.schemaVersion = schemaVersionFor(copy);
  return copy;
}

/** Both copies of one joined pair, sharing a brand-new `linkId`. */
export function linkedPairCopies(
  pair: LinkPair,
  linkId: string,
): { watch: CustomComplicationConfig; phone: CustomComplicationConfig } {
  const merged = mergeForLink(pair.watch.config, pair.phone.config);
  return {
    watch: linkedCopy(merged, pair.watch.config, "watch", linkId, pair.watch.owner.app_version),
    phone: linkedCopy(merged, pair.phone.config, "iphone", linkId, pair.phone.owner.app_version),
  };
}

// ── the notice ────────────────────────────────────────────────────────────

/** What the panel draws after a run: a line or two, an Undo while there is
 * something to undo, and a Dismiss the panel owns. */
export interface LinkMergeNotice {
  lines: string[];
  /** Absent once there is nothing left to put back. */
  undo?: () => void;
  /** An Undo is running: the button is held disabled. */
  busy: boolean;
}

export function joinedLine(names: readonly string[]): string {
  const n = names.length;
  return `Joined ${n} complication${n === 1 ? "" : "s"} that had the same name on your watch and iPhone: ${names.join(", ")}.`;
}

export function ambiguousLine(names: readonly string[]): string {
  return `Not joined, two share a name on one device: ${names.join(", ")}. Use Link with... in the complication menu.`;
}

export function refusedLine(name: string, reason: string): string {
  return `Not joined, ${name}: ${reason}`;
}

// ── writing ───────────────────────────────────────────────────────────────

/** One record the merge wrote, and everything Undo needs to put it back. */
export interface LinkMergeWrite {
  owner: string;
  id: string;
  name: string;
  /** The revision holding the pre-merge document. The store files the document
   * a save replaces as a past revision under the revision it was saved as
   * (`ComplicationStore._remember`, complication_store.py:1263, called from
   * `save` at complication_store.py:1358 before anything on the record moves),
   * so this is the revision the merge based its save on. */
  previous: number;
  /** The revision the merge wrote, which the restore is based on so someone
   * else saving first comes back as the usual conflict. */
  current: number;
}

function errText(err: unknown): string {
  return String((err as { message?: string })?.message ?? err);
}

/**
 * The hard rule, checked per record: no backup, no merge.
 *
 * The store keeps the last `COMPLICATION_HISTORY_LIMIT` documents a save
 * replaced, and `save` files the current one before it writes (see
 * `LinkMergeWrite.previous`). That is the store's half. This is the panel's
 * half: ask for the record's history and make the server prove it serves one
 * for this record, at the revision this run is about to base its save on.
 *
 * Any answer but that, an error, a record the server does not know, or a
 * revision that moved while the panel was reading, means the recovery this
 * merge rests on cannot be trusted, so the pair is left alone.
 *
 * An empty entry list is fine and is the usual answer: a record nobody has
 * saved over has no past revisions yet. What matters is that the command
 * answers for it, because the merge's own save is what puts the pre-merge
 * document in there.
 */
async function backupReady(hass: HassLike, side: LinkSide): Promise<string | undefined> {
  try {
    const reply = await fetchSaveHistory(hass, side.owner.owner_watch_id, side.record.id);
    if (reply.complication_id.toUpperCase() !== side.record.id.toUpperCase()) {
      return "the server answered about another complication";
    }
    if (reply.revision !== side.record.revision) {
      return "it changed on the server while the panel was reading it";
    }
    return undefined;
  } catch (err) {
    return `its save history could not be read (${errText(err)})`;
  }
}

/** The document to send, through the panel's own save path so the merged copy
 * is normalised and its data sources re-derived exactly as a hand save would. */
function encodeForSave(cfg: CustomComplicationConfig, revision: number): Record<string, unknown> {
  return new Draft(structuredClone(cfg), revision).encoded();
}

/** Join one pair, or write nothing at all and say why. */
export async function mergePair(
  hass: HassLike,
  pair: LinkPair,
): Promise<{ writes: LinkMergeWrite[]; problem?: string }> {
  // Both sides are checked before either is written. A pair half written is
  // the one outcome worse than a pair not written.
  for (const side of [pair.watch, pair.phone]) {
    const reason = await backupReady(hass, side);
    if (reason !== undefined) return { writes: [], problem: refusedLine(pair.name, reason) };
  }

  const linkId = newId();
  const copies = linkedPairCopies(pair, linkId);
  const writes: LinkMergeWrite[] = [];
  const sides: [LinkSide, CustomComplicationConfig][] = [
    [pair.watch, copies.watch],
    [pair.phone, copies.phone],
  ];
  for (const [side, document] of sides) {
    try {
      const result = await saveRecord(
        hass,
        side.owner.owner_watch_id,
        encodeForSave(document, side.record.revision),
        side.record.revision,
      );
      if (!result.ok || !result.record) {
        return {
          writes,
          problem: refusedLine(pair.name, result.message ?? result.error ?? "the save was refused"),
        };
      }
      writes.push({
        owner: side.owner.owner_watch_id,
        id: side.record.id,
        name: pair.name,
        previous: side.record.revision,
        current: result.record.revision,
      });
    } catch (err) {
      return { writes, problem: refusedLine(pair.name, errText(err)) };
    }
  }
  return { writes };
}

/**
 * Put one written record back the way it was.
 *
 * The panel's own restore path, the one the History dialog uses: the
 * pre-merge document is saved back on top as a new revision. It predates the
 * merge, so it carries no `linkId` and the copies come apart again by the
 * same act that restores them.
 */
async function undoWrite(hass: HassLike, write: LinkMergeWrite): Promise<string | undefined> {
  try {
    const result = await restoreSaveHistory(hass, write.owner, write.id, write.previous, write.current);
    if (!result.ok) return `${write.name}: ${result.message ?? result.error ?? "the restore was refused"}`;
    return undefined;
  } catch (err) {
    return `${write.name}: ${errText(err)}`;
  }
}

// ── the run ───────────────────────────────────────────────────────────────

const SESSION_KEY = "wa-link-merge-run";

/** Whether this browser session has already had its turn. The merge itself is
 * once-only whatever this says (see `findLinkPairs`); this is what keeps the
 * notice, and the line about ambiguous names, from coming back on a reload. */
function takeSessionTurn(): boolean {
  const store = (globalThis as { sessionStorage?: Storage }).sessionStorage;
  try {
    if (store?.getItem(SESSION_KEY) === "done") return false;
    store?.setItem(SESSION_KEY, "done");
  } catch {
    // Storage off (a private window, blocked site data): the run happens once
    // per page load instead, which is the same thing for anyone who is not
    // reloading.
  }
  return true;
}

/**
 * The whole automatic merge, from the panel's first open.
 *
 * Reads every owner's records (the panel itself only loads the selected
 * owner's), pairs them, joins what can be joined, and hands back a notice
 * through `onNotice`: once when the run is done, and again on each step of an
 * Undo. `undefined` means there is nothing to say and nothing was changed.
 *
 * Nothing runs at all for a non-admin (the save and history commands are
 * admin-only anyway), for a home with no watch or no iPhone, or for a session
 * that has already had its turn. A list that will not load stops the run
 * before any pairing: a device the panel cannot read might hold the other half
 * of a name, and pairing without it could join the wrong two records.
 */
export async function autoLinkMerge(
  hass: HassLike,
  owners: readonly OwnerSummary[],
  onNotice: (notice: LinkMergeNotice | undefined) => void,
): Promise<void> {
  if (!hass.user?.is_admin) return;
  const kinds = new Set(owners.map((o) => deviceKindOf(o)));
  if (!kinds.has("watch") || !kinds.has("iphone")) return;
  if (!takeSessionTurn()) return;

  const loaded: OwnerRecords[] = [];
  for (const owner of owners) {
    try {
      const reply = await fetchList(hass, owner.owner_watch_id);
      loaded.push({ owner, records: reply.records });
    } catch {
      return;
    }
  }

  const { pairs, ambiguous } = findLinkPairs(loaded);
  if (pairs.length === 0 && ambiguous.length === 0) return;

  const joined: string[] = [];
  const problems: string[] = [];
  let writes: LinkMergeWrite[] = [];
  for (const pair of pairs) {
    const result = await mergePair(hass, pair);
    writes = [...writes, ...result.writes];
    if (result.problem === undefined) joined.push(pair.name);
    else problems.push(result.problem);
  }

  /** The lines the notice carries, with `lead` standing where the "Joined N"
   * line stands: it is replaced, not added to, once an Undo has put the
   * joined records back. */
  const lines = (lead: string[]) => {
    const out = [...lead];
    if (ambiguous.length > 0) out.push(ambiguousLine(ambiguous));
    out.push(...problems);
    return out;
  };
  const joinedLead = joined.length > 0 ? [joinedLine(joined)] : [];

  const undo = () => {
    onNotice({ lines: lines(joinedLead), undo, busy: true });
    void (async () => {
      const failed: string[] = [];
      for (const write of writes) {
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

  onNotice({ lines: lines(joinedLead), busy: false, ...(writes.length > 0 ? { undo } : {}) });
}
