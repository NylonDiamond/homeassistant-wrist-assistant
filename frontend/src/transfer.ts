// Turning one complication into text and back, so a design can be posted in a
// forum thread and pasted by everyone who reads it.
//
// Port of `Shared/CustomComplicationTransfer.swift` in the app repo, with the
// two things the panel adds: a share mode that replaces the author's entities
// with numbered slots, and an import step that maps those slots onto the
// reader's own entities. The wire shape is the Swift one exactly (pretty JSON,
// sorted keys, no `id`, no `slotIndex`, `dataSources: []`), so text from either
// side imports on the other.
//
// Three things a plain `JSON.stringify` gets wrong for sharing:
//
//   1. Identity travels badly. `id` and `slotIndex` describe this watch's copy,
//      not the design. Shipping them means a paste either collides with an
//      existing document or claims a slot nobody picked.
//   2. `dataSources` is derived. `Draft.encoded()` recomputes it on every save,
//      so a shared copy carries a snapshot that is stale at once.
//   3. Entity ids are local, and they are also private. `light.kitchen` is
//      nothing on another house, and the friendly names beside the ids are a
//      list of what is in this one.

import {
  type AggregateScope,
  type CustomComplicationConfig,
  type EntityRef,
  type FamilyKind,
  type TapAction,
  auditUnknownKeys,
  ConfigParseError,
  documentEntityUses,
  encodeConfig,
  forEachValue,
  mapEntityRefs,
  mapFreeText,
  parseConfig,
  quotedEntityIds,
  replaceQuotedEntityIds,
  schemaVersionFor,
} from "./model.js";
import { type SlotHolder, freeSlotForFamily } from "./copies.js";
import { familiesFor, importableFamilies, isHomeFamily, supportedFamilies } from "./layouts.js";
import { familyTitle } from "./renderer.js";
import { type DeviceOwnerLike, deviceSupportsShapes, isLibraryOwner, ownerSupportsControls } from "./version.js";

// ── placeholders ──────────────────────────────────────────────────────────

/**
 * A shared document's stand-in for one of the author's entities.
 *
 * Dotted and free of Jinja braces on purpose. Nothing on either side validates
 * an entity id, so the shape only has to survive a round trip, and a `{{` in an
 * id would land inside a compiled template. The domain is kept so the import
 * picker can filter by it: a slot that was a light stays a light.
 */
export const PLACEHOLDER_RE = /^[a-z0-9_]+\.shared_(\d+)$/;

export function isPlaceholderId(id: string): boolean {
  return PLACEHOLDER_RE.test(id);
}

function upperFirst(s: string): string {
  return s.length === 0 ? s : s[0]!.toUpperCase() + s.slice(1);
}

/** The domain a slot keeps: the reference's own, else the part before the dot,
 * reduced to what a placeholder id can hold. */
function slotDomain(ref: EntityRef, entityId: string): string {
  const raw = (ref.domain || entityId.split(".")[0] || "").toLowerCase();
  const safe = raw.replace(/[^a-z0-9_]/g, "");
  return safe === "" ? "entity" : safe;
}

// ── share ─────────────────────────────────────────────────────────────────

/** One of the author's entities, as the shared copy will carry it. */
export interface ShareSlot {
  placeholderId: string;
  domain: string;
  /** What the reader sees in the import table. Editable before sharing, so an
   * author can say "the one on the porch" instead of "Light 2". */
  label: string;
  originalId: string;
  /** Every place in the document that reads this entity, in words. */
  where: string[];
}

/**
 * The slots one document shares, in first-use order.
 *
 * Numbering is that order, from 1, across every domain, so two slots never
 * collide. Two uses of one entity share a slot: they are one thing to pick on
 * the way in.
 *
 * `knownDomains` gates ids found in free text. A template is substituted rather
 * than parsed, so the only signal that `'sensor.energy'` is an entity and
 * `'3.5'` is not is whether anything in this house has that domain.
 */
export function shareSlots(cfg: CustomComplicationConfig, knownDomains: ReadonlySet<string>): ShareSlot[] {
  const slots = new Map<string, ShareSlot>();
  for (const use of documentEntityUses(cfg, (_id, domain) => knownDomains.has(domain))) {
    if (use.entityId === "") continue;
    let slot = slots.get(use.entityId);
    if (!slot) {
      const domain = slotDomain(use.ref, use.entityId);
      const n = slots.size + 1;
      slot = {
        placeholderId: `${domain}.shared_${n}`,
        domain,
        label: `${upperFirst(domain.replace(/_/g, " "))} ${n}`,
        originalId: use.entityId,
        where: [],
      };
      slots.set(use.entityId, slot);
    }
    if (!slot.where.includes(use.where)) slot.where.push(use.where);
  }
  return [...slots.values()];
}

/** The picked complications of a refresh tap are document ids on the author's
 * watch, so on the wire the tap keeps its type and loses its picks. The reader
 * sees "none picked" and chooses their own; "all placed" carries over as is,
 * because it names nothing.
 *
 * The per-complication layer narrowing goes with them. It is keyed by those
 * same document ids and names layer ids inside documents the reader does not
 * have, so keeping it would put a dead list on the wire. */
function scrubRefreshTargets(action: TapAction): TapAction {
  if (action.type !== "refreshAll") return action;
  if (action.targets === undefined && action.targetLayers === undefined) return action;
  const { targets: _dropped, targetLayers: _narrowed, ...rest } = action;
  return rest;
}

/**
 * A copy of the document with nothing local left in it.
 *
 * Every reference is replaced whole, not just by id: `deriveDataSources` copies
 * `displayName` straight off the layer, so an id swapped under an old name
 * would put that name back on the wire at the reader's first save. `iconName`
 * goes for the same reason, and the page a tap opens goes because a page id is
 * a UUID on the author's watch and means nothing on anyone else's.
 */
export function scrubForShare(cfg: CustomComplicationConfig, slots: readonly ShareSlot[]): CustomComplicationConfig {
  const next = structuredClone(cfg);
  const refs = new Map<string, EntityRef>();
  const ids = new Map<string, string>();
  for (const slot of slots) {
    refs.set(slot.originalId, { entityId: slot.placeholderId, displayName: slot.label, domain: slot.domain });
    ids.set(slot.originalId, slot.placeholderId);
  }
  mapEntityRefs(next, (ref) => {
    const to = refs.get(ref.entityId);
    return to ? { ...to } : undefined;
  });
  mapFreeText(next, (text) => replaceQuotedEntityIds(text, ids));
  // Notes are prose, so an id in them is bare rather than quoted. It becomes
  // the slot's label, which is what the reader's import table calls it.
  if (next.notes !== undefined) {
    for (const slot of slots) {
      if (slot.originalId === "") continue;
      const bare = new RegExp(`(?<![\\w.])${slot.originalId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?![\\w])`, "g");
      next.notes = next.notes.replace(bare, slot.label.trim() || slot.placeholderId);
    }
  }

  delete next.openPageId;
  delete next.openPageName;
  if (next.tapAction.type === "openPage") next.tapAction = { type: "none" };
  next.tapAction = scrubRefreshTargets(next.tapAction);
  for (const el of next.elements) {
    if (el.kind !== "tap") continue;
    delete el.payload.openPageId;
    delete el.payload.openPageName;
    if (el.payload.action.type === "openPage") el.payload.action = { type: "none" };
    el.payload.action = scrubRefreshTargets(el.payload.action);
  }
  next.dataSources = [];
  return next;
}

/** True when an aggregate reads a scope named by area, label or floor. Those
 * ids belong to the author's Home Assistant and no picker can remap them, so
 * the import dialog says so rather than pretending the design landed whole.
 *
 * A list whose items come from an `entities` source reads the same scope object
 * an aggregate does, so it is asked the same question: "the lights in the
 * kitchen" is a sentence about the author's house however it is drawn. */
export function hasInstanceFilters(cfg: CustomComplicationConfig): boolean {
  const local = (scope: AggregateScope): boolean =>
    scope.kind === "filter" && scope.areaIds.length + scope.labelIds.length + scope.floorIds.length > 0;
  let found = false;
  forEachValue(cfg, (v) => {
    const kind = v.kind;
    if (kind.kind !== "aggregate") return;
    if (local(kind.aggregate.scope)) found = true;
  });
  for (const el of cfg.elements) {
    if (el.kind !== "list") continue;
    const source = el.payload.source;
    if (source.kind === "entities" && local(source.scope)) found = true;
  }
  return found;
}

// ── export ────────────────────────────────────────────────────────────────

/**
 * JSON with its keys sorted at every level, two spaces of indent, arrays in
 * document order.
 *
 * Sorted and pretty is not cosmetic. This text is meant to be read, hand
 * edited, and to diff cleanly when somebody posts "here is mine with one line
 * changed". It matches Swift's `.sortedKeys` so the same document exported on
 * either side is the same text.
 *
 * `indent: null` prints the same sorted text on one line, for a copy that is
 * sent somewhere with a size limit rather than read.
 */
export function stableStringify(value: unknown, indent: string | null = "  "): string {
  if (indent === null) {
    const flat = (v: unknown): string => {
      if (v === null || typeof v !== "object") return JSON.stringify(v) ?? "null";
      if (Array.isArray(v)) return `[${v.map(flat).join(",")}]`;
      const record = v as Record<string, unknown>;
      const keys = Object.keys(record).filter((k) => record[k] !== undefined).sort();
      return `{${keys.map((k) => `${JSON.stringify(k)}:${flat(record[k])}`).join(",")}}`;
    };
    return flat(value);
  }
  const write = (v: unknown, pad: string): string => {
    if (v === null || typeof v !== "object") return JSON.stringify(v) ?? "null";
    const inner = pad + indent;
    if (Array.isArray(v)) {
      if (v.length === 0) return "[]";
      return `[\n${v.map((x) => inner + write(x, inner)).join(",\n")}\n${pad}]`;
    }
    const record = v as Record<string, unknown>;
    const keys = Object.keys(record).filter((k) => record[k] !== undefined).sort();
    if (keys.length === 0) return "{}";
    const body = keys.map((k) => `${inner}${JSON.stringify(k)}: ${write(record[k], inner)}`).join(",\n");
    return `{\n${body}\n${pad}}`;
  };
  return write(value, "");
}

/**
 * The text for one complication.
 *
 * "share" replaces the author's entities with the slots; "backup" is an exact
 * copy, ids and names included. Both drop identity: the two keys go after
 * encoding rather than through an export mode on the model, because the parser
 * puts both back on the way in and their absence is the honest wire shape. This
 * text describes a design, not a copy of one.
 */
export function exportText(
  cfg: CustomComplicationConfig,
  mode: "share" | "backup",
  slots: readonly ShareSlot[] = [],
): string {
  return `${stableStringify(exportObject(cfg, mode, slots))}\n`;
}

/** The object `exportText` prints, for a caller that nests it in a bigger file. */
export function exportObject(
  cfg: CustomComplicationConfig,
  mode: "share" | "backup",
  slots: readonly ShareSlot[] = [],
): Record<string, unknown> {
  const doc = mode === "share" ? scrubForShare(cfg, slots) : cfg;
  const encoded = encodeConfig(doc);
  delete encoded.id;
  delete encoded.slotIndex;
  // Hiding is about the author's own watch picker. A backup keeps it, since it
  // is a record of this copy; a share does not.
  if (mode === "share") delete encoded.hidden;
  // `linkId` joins this record to the same design on this home's other
  // devices. It means nothing in another house, and a backup restored here
  // comes back as a design of its own: joining a link is asked for from the
  // card's Devices menu, never smuggled in by a paste.
  delete encoded.linkId;
  // Derived on save. Exporting it would ship a stale answer to a question the
  // reader's own save re-answers correctly.
  encoded.dataSources = [];
  return encoded;
}

/** A filename somebody will recognise a week later in their downloads. Mirrors
 * `CustomComplicationTransfer.fileName(for:)`. */
export function exportFileName(cfg: CustomComplicationConfig): string {
  const base = cfg.name === "" ? "Complication" : cfg.name;
  const safe = base.split(/[^\p{L}\p{N}]+/u).filter((part) => part !== "").join("-");
  return `${safe === "" ? "Complication" : safe}.json`;
}

// ── import ────────────────────────────────────────────────────────────────

// The Swift `ImportError` strings, word for word, so the same paste explains
// itself the same way on the phone and in the panel.
const EMPTY = "There is nothing to read here. Paste a complication first.";
const NOT_JSON = "This is not valid JSON. Check for a missing brace or a stray comma.";
const NOT_AN_OBJECT = "This is valid JSON but not a complication. A complication starts with { and ends with }.";
const DECODE_FAILED = "This does not look like a complication.";

/** The two refusals that are about the panel being behind, not the text being
 * wrong. Importing either would only open read-only anyway. */
const UPDATE_INTEGRATION = "It was made by a newer panel, so update the Wrist Assistant integration before importing it.";

export type ImportParse =
  | { ok: true; config: CustomComplicationConfig; raw: unknown }
  | { ok: false; error: string };

/** The identity a parsed document carries until the caller stamps its own. */
const IMPORT_PLACEHOLDER_ID = "00000000-0000-4000-8000-000000000000";

/** `parseConfig` says "name is required"; Swift's decoder says `It is missing
 * "name".` for the same document. Use the sentence, since it is the one the
 * reader can act on. */
function readableParseFailure(message: string): string {
  const missing = /^([A-Za-z]+) is required$/.exec(message);
  return missing ? `It is missing "${missing[1]}".` : message;
}

/**
 * Read pasted text back into a config.
 *
 * `id` and `slotIndex` are stamped with placeholders before parsing, because
 * `parseConfig` requires both and an export carries neither. The caller
 * replaces them with the reader's own: honouring the sender's is how two
 * documents end up claiming one slot.
 */
export function parseImportText(text: string, maxSchemaVersion: number): ImportParse {
  const trimmed = text.trim();
  if (trimmed === "") return { ok: false, error: EMPTY };

  let raw: unknown;
  try {
    raw = JSON.parse(trimmed);
  } catch {
    return { ok: false, error: NOT_JSON };
  }
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) {
    return { ok: false, error: NOT_AN_OBJECT };
  }
  const object = raw as Record<string, unknown>;

  const schema = object.schemaVersion;
  if (typeof schema === "number" && schema > maxSchemaVersion) {
    return {
      ok: false,
      error: `This complication is schema v${schema}; this panel understands up to v${maxSchemaVersion}. ${UPDATE_INTEGRATION}`,
    };
  }
  // Parsing comes before the unknown-key audit, because text that is not a
  // complication at all trips the audit on every key it has, and "it uses keys
  // this panel does not know" is a confusing thing to say about a shopping list.
  const stamped = { ...object, id: IMPORT_PLACEHOLDER_ID, slotIndex: 0 };
  let config: CustomComplicationConfig;
  try {
    config = parseConfig(stamped);
  } catch (err) {
    const detail = err instanceof ConfigParseError || err instanceof Error ? err.message : String(err);
    return { ok: false, error: `${DECODE_FAILED}\n\n${readableParseFailure(detail)}` };
  }
  // An imported complication starts shown, even from a backup of a hidden one:
  // nobody expects a design they just brought in to be missing from the watch.
  delete config.hidden;
  // And it is a design of its own, whatever link the text names: a pasted
  // key must never quietly join a design on somebody's watch.
  delete config.linkId;

  const unknown = auditUnknownKeys(object);
  if (unknown.length > 0) {
    const shown = unknown.slice(0, 3).join(", ");
    const rest = unknown.length > 3 ? `, and ${unknown.length - 3} more` : "";
    return {
      ok: false,
      error: `This complication uses keys this panel does not know: ${shown}${rest}. ${UPDATE_INTEGRATION}`,
    };
  }

  return { ok: true, config, raw };
}

/** One entity the reader has to answer for before the design can land. */
export interface UnresolvedEntity {
  entityId: string;
  domain: string;
  /** The author's label for a slot, else the name or id the document carries. */
  label: string;
  where: string[];
  /** True for a placeholder, which nothing local can resolve on its own. An
   * ordinary id that is simply absent is optional: the entity may be back
   * tomorrow, and keeping it is better than blanking it. */
  required: boolean;
}

/**
 * What the import dialog asks about, in first-use order.
 *
 * Placeholders always, plus any real id this Home Assistant does not have. Free
 * text is read the same way it is on the way out, gated by the domains that
 * exist here so that a quoted number is not offered as an entity.
 */
export function unresolvedEntities(
  cfg: CustomComplicationConfig,
  states: Record<string, unknown>,
): UnresolvedEntity[] {
  const known = new Set<string>();
  for (const id of Object.keys(states)) {
    const domain = id.split(".")[0] ?? "";
    if (domain !== "") known.add(domain);
  }
  const has = (id: string) => Object.prototype.hasOwnProperty.call(states, id);

  const rows = new Map<string, UnresolvedEntity>();
  const uses = documentEntityUses(cfg, (id, domain) => isPlaceholderId(id) || known.has(domain));
  for (const use of uses) {
    if (use.entityId === "") continue;
    const required = isPlaceholderId(use.entityId);
    if (!required && has(use.entityId)) continue;
    let row = rows.get(use.entityId);
    if (!row) {
      row = {
        entityId: use.entityId,
        domain: slotDomain(use.ref, use.entityId),
        label: use.ref.displayName || use.entityId,
        where: [],
        required,
      };
      rows.set(use.entityId, row);
    }
    if (row.label === use.entityId && use.ref.displayName !== "") row.label = use.ref.displayName;
    if (!row.where.includes(use.where)) row.where.push(use.where);
  }
  const out = [...rows.values()];
  const perDomain = new Map<string, number>();
  for (const row of out) if (row.required) perDomain.set(row.domain, (perDomain.get(row.domain) ?? 0) + 1);
  for (const row of out) {
    if (!row.required || !isNumberedSlotLabel(row)) continue;
    row.label = betterSlotLabel(cfg, row, perDomain.get(row.domain) ?? 0) ?? row.label;
  }
  return out;
}

/** The label `shareSlots` makes up when the author leaves it: the domain and
 * the slot's number, "Light 2". It says what kind of thing to pick and
 * nothing about which one. */
function isNumberedSlotLabel(row: UnresolvedEntity): boolean {
  const n = PLACEHOLDER_RE.exec(row.entityId)?.[1];
  return n !== undefined && row.label === `${upperFirst(row.domain.replace(/_/g, " "))} ${n}`;
}

/**
 * A made-up slot label said better, from what the document already carries.
 *
 * A shared value that reads the slot has a name the author chose, and on the
 * wire it is already the public one, so "Light 1" becomes "Downstairs left
 * light". Failing that, the only slot of its domain drops the number: "Sun"
 * rather than "Sun 7", which read as if there were six other suns to choose
 * between.
 */
function betterSlotLabel(cfg: CustomComplicationConfig, row: UnresolvedEntity, sameDomain: number): string | undefined {
  const names: string[] = [];
  for (const valueId of slotValueIds(cfg, row.entityId)) {
    const name = cfg.values.find((v) => v.id.toUpperCase() === valueId)?.name.trim() ?? "";
    if (name !== "" && !names.includes(name)) names.push(name);
  }
  if (names.length === 1) return names[0];
  if (names.length > 1) return `${names[0]} / ${names[1]}${names.length > 2 ? " …" : ""}`;
  if (sameDomain === 1) return upperFirst(row.domain.replace(/_/g, " "));
  return undefined;
}

/**
 * Slots this home can answer without asking: the only open slot of a domain,
 * when the home has exactly one entity of that domain. Every home has one
 * `sun.sun`, and a design whose sky follows the sun would otherwise stay dark
 * until the reader worked out that "Sun" wanted it.
 *
 * Returned as slot id to entity id; the caller builds the reference.
 */
export function autoSlotPicks(rows: readonly UnresolvedEntity[], states: Record<string, unknown>): Map<string, string> {
  const open = new Map<string, UnresolvedEntity[]>();
  for (const row of rows) {
    if (!row.required) continue;
    open.set(row.domain, [...(open.get(row.domain) ?? []), row]);
  }
  const out = new Map<string, string>();
  for (const [domain, slots] of open) {
    if (slots.length !== 1) continue;
    const ids = Object.keys(states).filter((id) => id.startsWith(`${domain}.`));
    if (ids.length === 1) out.set(slots[0]!.entityId, ids[0]!);
  }
  return out;
}

/**
 * The slots a document still carries: placeholders nobody has pointed at one
 * of this home's entities. The editor counts them and asks for them, because a
 * slot left open reads nothing, and a layer that reads nothing looks broken
 * rather than unfinished (a sky that stays at night, a reading of "--").
 */
export function openSlots(cfg: CustomComplicationConfig, states: Record<string, unknown>): UnresolvedEntity[] {
  return unresolvedEntities(cfg, states).filter((row) => row.required);
}

/** The shared values that read a slot, directly: the ones whose own source
 * names it. */
export function slotValueIds(cfg: CustomComplicationConfig, entityId: string): string[] {
  const ids = new Set<string>();
  mapEntityRefs(cfg, (ref, site) => {
    if (ref.entityId === entityId && site.kind === "named" && site.valueId !== undefined) ids.add(site.valueId.toUpperCase());
    return undefined;
  });
  mapFreeText(cfg, (text, site) => {
    if (site.kind === "named" && site.valueId !== undefined && quotedEntityIds(text).includes(entityId)) ids.add(site.valueId.toUpperCase());
    return text;
  });
  return [...ids];
}

/**
 * A copy of the document reading the reader's entities.
 *
 * The whole reference is rewritten, `iconName` included (dropped: the icon
 * belonged to the old entity), and every quoted id in free text is substituted
 * the same way the share did it in reverse.
 */
export function remapEntities(
  cfg: CustomComplicationConfig,
  map: ReadonlyMap<string, EntityRef>,
): CustomComplicationConfig {
  const next = structuredClone(cfg);
  applyEntityMap(next, map);
  return next;
}

/** `remapEntities` in place, for the editor, whose edits mutate the draft. */
export function applyEntityMap(next: CustomComplicationConfig, map: ReadonlyMap<string, EntityRef>): void {
  mapEntityRefs(next, (ref) => {
    const to = map.get(ref.entityId);
    if (!to) return undefined;
    return {
      entityId: to.entityId,
      displayName: to.displayName,
      domain: to.domain || to.entityId.split(".")[0] || "",
    };
  });
  const ids = new Map<string, string>();
  for (const [from, to] of map) ids.set(from, to.entityId);
  mapFreeText(next, (text) => replaceQuotedEntityIds(text, ids));
}

// ── what the import dialog works out ──────────────────────────────────────
//
// The three questions the dialog asks that are arithmetic rather than markup:
// what to call the copy, what the pasted text turned out to be, and whether
// Import can do anything yet. They live here so the dialog is only markup and
// so all three can be tested without a browser.

/**
 * A name for the imported copy that this watch does not already use.
 *
 * The sender's own name arrives with the document and is nearly always the
 * right one, so it is offered first and numbered only when it has to be. The
 * alternative, refusing on arrival, makes the reader answer a question before
 * they have read anything else in the dialog.
 */
export function suggestImportName(name: string, taken: ReadonlySet<string>): string {
  const base = name.trim();
  if (base === "") return "";
  const has = (n: string) => taken.has(n.toLowerCase());
  if (!has(base)) return base;
  for (let n = 2; n <= 99; n += 1) {
    const next = `${base} ${n}`;
    if (!has(next)) return next;
  }
  return base;
}

function joinWords(words: readonly string[]): string {
  if (words.length <= 1) return words[0] ?? "";
  return `${words.slice(0, -1).join(", ")} and ${words[words.length - 1]!}`;
}

/**
 * One line saying what the pasted text turned out to be: how many layers, and
 * which shapes. Enough to catch "that is not the one I copied" before any
 * entity has been picked.
 *
 * A document with no shape and a control is a whole complication of its own,
 * and counting its layers would say nothing, so it says what it is instead.
 */
export function importSummary(cfg: CustomComplicationConfig): string {
  const layers = cfg.elements.length;
  const count = layers === 1 ? "1 layer" : `${layers} layers`;
  const families = supportedFamilies(cfg);
  if (families.length === 0 && cfg.control !== undefined) return "A Control Center control, and no shape";
  return families.length === 0 ? count : `${count}, ${joinWords(families)}`;
}

/** What the import preview lists beside its picture. */
export interface ImportFacts {
  layers: number;
  /** In schema order, as their titles. */
  families: string[];
  /** Placeholders the reader has to point at one of their own entities. */
  slots: number;
  /** Real ids this Home Assistant does not have, which the reader may leave. */
  missing: number;
}

/** The numbers the preview shows, so "this needs four entities" is known
 * before the table of them is read. */
export function importFacts(cfg: CustomComplicationConfig, rows: readonly UnresolvedEntity[]): ImportFacts {
  return {
    layers: cfg.elements.length,
    families: supportedFamilies(cfg).map(familyTitle),
    slots: rows.filter((r) => r.required).length,
    missing: rows.filter((r) => !r.required).length,
  };
}

// ── what a tap runs ───────────────────────────────────────────────────────
//
// A shared design keeps its tap actions. Most of them are harmless on their
// own (a toggle of an entity the reader picks), but a service call carries
// the service name and its data whole, and an area or device in that data is
// not an entity, so no picker ever shows it: a design could bind
// `lock.unlock` on the kitchen to a tap and nothing else in the import dialog
// would say so. These are listed before the reader imports, and on the
// gallery page before they even copy.

/** One tap in a shared design that runs something on the reader's Home
 * Assistant, said in words the import dialog and the gallery can show. */
export interface ImportAction {
  /** Which tap: the complication's own, a numbered tap layer, or the control. */
  where: string;
  /** What it runs, e.g. `lock.unlock on Front door (lock.front_door) with {"code": 1}`. */
  runs: string;
}

/** Every tap in the document that calls a service or fires an HTTP action, in
 * document order. Tap layers are counted the way the layer list shows them,
 * attached ones included, because the reader looks them up there. */
export function importActions(cfg: CustomComplicationConfig): ImportAction[] {
  const out: ImportAction[] = [];
  const add = (where: string, action: TapAction | undefined): void => {
    const runs = describeRun(action);
    if (runs !== undefined) out.push({ where, runs });
  };
  add("The complication", cfg.tapAction);
  let n = 0;
  for (const el of cfg.elements) {
    if (el.kind !== "tap") continue;
    n += 1;
    add(el.payload.attachedTo !== undefined ? `Tap ${n} (on a layer)` : `Tap ${n}`, el.payload.action);
  }
  if (cfg.control !== undefined) add("The Control Center control", cfg.control.action);
  return out;
}

function describeRun(action: TapAction | undefined): string | undefined {
  if (action === undefined) return undefined;
  if (action.type === "callService") {
    let words = `${action.serviceDomain}.${action.serviceName}`;
    if (action.target !== undefined && action.target.entityId !== "") words += ` on ${targetWords(action.target)}`;
    const data = action.serviceDataJSON?.trim() ?? "";
    if (data !== "") words += ` with ${data}`;
    return words;
  }
  if (action.type === "runHTTPAction") return `an HTTP action, ${targetWords(action)}`;
  return undefined;
}

function targetWords(ref: EntityRef): string {
  if (isPlaceholderId(ref.entityId)) return `the entity you pick for ${ref.displayName || ref.entityId}`;
  return ref.displayName !== "" ? `${ref.displayName} (${ref.entityId})` : ref.entityId;
}

// ── share links ───────────────────────────────────────────────────────────
//
// A link to this panel with the shared text in its hash. The hash never
// reaches a server, Home Assistant's included, so the link is as private as
// the text it carries. The payload starts with one letter saying how it was
// packed: `z` for gzip, `t` for plain UTF-8, both then base64url. Gzip roughly
// quarters a pretty-printed document, which is what keeps a link short enough
// for a chat message; a browser without CompressionStream still makes a link,
// just a longer one, and every browser that can read one kind can read both
// unless it lacks DecompressionStream too.

/** The hash key a share link uses: `#import=<payload>`. */
export const SHARE_LINK_KEY = "import";

export function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = "";
  // Chunked, because spreading a large array into one call overflows the stack.
  for (let i = 0; i < bytes.length; i += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/** Undefined for anything that is not base64url. */
export function base64UrlToBytes(text: string): Uint8Array | undefined {
  if (!/^[A-Za-z0-9_-]*$/.test(text) || text.length % 4 === 1) return undefined;
  const padded = text.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((text.length + 3) % 4);
  try {
    const binary = atob(padded);
    const out = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) out[i] = binary.charCodeAt(i);
    return out;
  } catch {
    return undefined;
  }
}

async function throughStream(bytes: Uint8Array, stream: GenericTransformStream): Promise<Uint8Array> {
  const out = new Blob([bytes as BlobPart]).stream().pipeThrough(stream as TransformStream<Uint8Array, Uint8Array>);
  return new Uint8Array(await new Response(out).arrayBuffer());
}

/** The hash payload for one shared text. `compress: false` forces the plain
 * form, which is also what a browser without CompressionStream gets. */
export async function encodeShareLink(text: string, opts: { compress?: boolean } = {}): Promise<string> {
  const bytes = new TextEncoder().encode(text);
  if (opts.compress !== false && typeof CompressionStream === "function") {
    try {
      return `z${bytesToBase64Url(await throughStream(bytes, new CompressionStream("gzip")))}`;
    } catch {
      // Fall through to the plain form.
    }
  }
  return `t${bytesToBase64Url(bytes)}`;
}

/** The text a hash payload carries, or undefined when it is damaged, cut
 * short, or packed in a way this browser cannot unpack. */
export async function decodeShareLink(payload: string): Promise<string | undefined> {
  const bytes = base64UrlToBytes(payload.slice(1));
  if (!bytes) return undefined;
  const decoder = new TextDecoder("utf-8", { fatal: true });
  try {
    if (payload.startsWith("t")) return decoder.decode(bytes);
    if (payload.startsWith("z") && typeof DecompressionStream === "function") {
      return decoder.decode(await throughStream(bytes, new DecompressionStream("gzip")));
    }
  } catch {
    // A truncated gzip stream or bytes that are not UTF-8.
  }
  return undefined;
}

/** Where a copied share link points. Every home has its own address, so a
 * link to this panel would only open on this home's network. The page there
 * asks the reader for their own Home Assistant address once, then forwards
 * the same hash to their panel. The hash never reaches the site's server. */
export const SHARE_LINK_SITE = "https://wrist-assistant.com/import/";

/** A link to `base` (a panel address, or SHARE_LINK_SITE, without a hash)
 * that opens the Import dialog with the text filled in. */
export function shareLinkUrl(base: string, payload: string): string {
  const bare = base.split("#")[0] ?? base;
  return `${bare}#${SHARE_LINK_KEY}=${payload}`;
}

/** The payload in a location hash, when it is a share link. */
export function shareLinkPayload(hash: string): string | undefined {
  const body = hash.startsWith("#") ? hash.slice(1) : hash;
  const prefix = `${SHARE_LINK_KEY}=`;
  if (!body.startsWith(prefix)) return undefined;
  const payload = body.slice(prefix.length);
  return payload.length > 1 ? payload : undefined;
}

/** The payload of a share link pasted as text: one line, no spaces, with the
 * link's hash in it. Undefined for anything else, a document included. This is
 * how a link made on another home still works: its address is somebody else's
 * Home Assistant, but the hash is the whole document. */
export function shareLinkInText(text: string): string | undefined {
  const t = text.trim();
  if (t === "" || /\s/.test(t) || t.startsWith("{")) return undefined;
  const at = t.indexOf("#");
  return at < 0 ? undefined : shareLinkPayload(t.slice(at));
}

/** What the import dialog says about a link that does not unpack. */
export const SHARE_LINK_DAMAGED = "This share link is damaged or cut short. Ask for it again, or paste the text instead.";

/** Everything the Import button waits on, in the order the reader meets it. */
export interface ImportReadiness {
  /** True once the text parsed into a document. */
  parsed: boolean;
  name: string;
  /** Names already on this watch, lower-cased. */
  taken: ReadonlySet<string>;
  /** Required rows with nothing picked yet. */
  unchosen: number;
}

/** What still stands between the pasted text and the editor, in words for the
 * disabled button's tooltip, or undefined when nothing does. */
export function importProblem(state: ImportReadiness): string | undefined {
  if (!state.parsed) return "Paste a complication first.";
  const name = state.name.trim();
  if (name === "") return "Give it a name first.";
  if (state.taken.has(name.toLowerCase())) return "A complication on this watch already has that name.";
  if (state.unchosen === 1) return "One entity still needs choosing.";
  if (state.unchosen > 1) return `${state.unchosen} entities still need choosing.`;
  return undefined;
}

/** Where an import is written: the device being edited, or Unassigned and the
 * reason, in words that finish "Imported to Unassigned: …". */
export type ImportDestination = { unassigned: false } | { unassigned: true; reason: string };

/**
 * Whether an import goes to the device being edited or to Unassigned.
 *
 * The device is only right when it can draw what comes in. An app too old for
 * custom complications, or a document whose shapes the device has none of (a
 * Home Screen widget pasted while a watch is selected), would otherwise be
 * saved where nothing draws it, and on a device whose seats count by shape it
 * would hold a seat nobody can see. Unassigned holds every shape, so the
 * design lands whole and goes onto a device from its card.
 *
 * A link opened in the address (the gallery's Add, or a link a friend sent)
 * says nothing about the device it is for, and the panel opened on whichever
 * device came first. It always goes to Unassigned.
 *
 * A control with no shape asks the same of the device's Control Center.
 */
export function importDestination(input: {
  owner: DeviceOwnerLike | null | undefined;
  ownerName: string;
  /** The document's own shapes, before any narrowing to a device. */
  shapes: readonly FamilyKind[];
  control: boolean;
  fromLink: boolean;
}): ImportDestination {
  const { owner, ownerName } = input;
  if (isLibraryOwner(owner)) return { unassigned: false };
  if (input.fromLink) return { unassigned: true, reason: "a link does not say which device it is for" };
  if (!deviceSupportsShapes(owner)) return { unassigned: true, reason: `${ownerName} needs a newer Wrist Assistant app to draw it` };
  const first = input.shapes[0];
  if (first !== undefined && importableFamilies({ supportedFamilies: [...input.shapes] }, familiesFor(owner)).length === 0) {
    const what = isHomeFamily(first) ? "Home Screen widgets" : `the ${familyTitle(first)} shape`;
    return { unassigned: true, reason: `${ownerName} does not draw ${what}` };
  }
  if (first === undefined && input.control && !ownerSupportsControls(owner)) {
    return { unassigned: true, reason: `${ownerName} does not have Control Center controls` };
  }
  return { unassigned: false };
}

/** Whether the Import dialog folds the shared text away to one row. Only text
 * that parsed folds: an empty box is where the pasting happens, and text with
 * a problem has to stay readable so it can be fixed. `shown` is the reader
 * having asked to see it anyway. */
export function importTextFolded(parse: ImportParse | undefined, shown: boolean): boolean {
  return parse?.ok === true && !shown;
}

// ── backup of every complication ──────────────────────────────────────────
//
// One file holding every design in this home, for the day the integration is
// removed. Removing it deletes the complication store with it, and the only
// other way back is restoring a whole Home Assistant backup, which also rolls
// back everything else in the house.
//
// Each design in the file is the same object a single "Backup for me" export
// prints, so every rule about identity above holds here too. A restore puts
// them all in Unassigned (the Library), never on a device: device ids do not
// survive a remove and re-add, and the author places each one from its card.

/** What marks a file as a whole-home backup rather than one complication. */
export const BACKUP_KIND = "wrist-assistant-complications";
/** The newest backup layout this panel reads. */
export const BACKUP_VERSION = 1;

/** One design on its way into a backup, with the device it came from. */
export interface BackupSource {
  device: string;
  config: CustomComplicationConfig;
}

/**
 * The text of a whole-home backup.
 *
 * Linked copies of one design on several devices are the same document once
 * identity is gone, so each design is written once, with every device it was
 * on. Different shapes of one design differ, and each is kept.
 */
export function backupText(sources: readonly BackupSource[], createdAt: Date): string {
  const byText = new Map<string, { devices: string[]; document: Record<string, unknown> }>();
  for (const source of sources) {
    const document = exportObject(source.config, "backup");
    const key = stableStringify(document);
    const seen = byText.get(key);
    if (seen) {
      if (!seen.devices.includes(source.device)) seen.devices.push(source.device);
    } else {
      byText.set(key, { devices: [source.device], document });
    }
  }
  const complications = [...byText.values()].map((entry) => ({
    devices: entry.devices,
    document: entry.document,
  }));
  return `${stableStringify({
    kind: BACKUP_KIND,
    version: BACKUP_VERSION,
    createdAt: createdAt.toISOString(),
    complications,
  })}\n`;
}

/** A filename that sorts by date in a downloads folder. */
export function backupFileName(createdAt: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  const day = `${createdAt.getFullYear()}-${pad(createdAt.getMonth() + 1)}-${pad(createdAt.getDate())}`;
  return `Wrist-Assistant-complications-${day}.json`;
}

/** One design read back out of a backup. */
export interface BackupEntry {
  devices: string[];
  config: CustomComplicationConfig;
}

export type BackupParse =
  | {
      ok: true;
      createdAt: string;
      entries: BackupEntry[];
      /** Designs in the file that did not read, by name, with the reason. */
      problems: { name: string; error: string }[];
    }
  | { ok: false; error: string };

/**
 * Read a whole-home backup, or undefined when the text is not one.
 *
 * Undefined rather than an error, so the caller can go on to read the text as
 * one complication and say what is wrong with it in those words. Each design
 * goes through `parseImportText`, so a backup is held to exactly the rules a
 * single paste is, and one damaged design does not stop the rest.
 */
export function parseBackupText(text: string, maxSchemaVersion: number): BackupParse | undefined {
  let raw: unknown;
  try {
    raw = JSON.parse(text.trim());
  } catch {
    return undefined;
  }
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) return undefined;
  const object = raw as Record<string, unknown>;
  if (object.kind !== BACKUP_KIND) return undefined;

  const version = object.version;
  if (typeof version === "number" && version > BACKUP_VERSION) {
    return { ok: false, error: `This backup was made by a newer panel. ${UPDATE_INTEGRATION}` };
  }
  if (!Array.isArray(object.complications)) {
    return { ok: false, error: "This backup is damaged: it has no list of complications." };
  }

  const entries: BackupEntry[] = [];
  const problems: { name: string; error: string }[] = [];
  object.complications.forEach((item, index) => {
    const entry = typeof item === "object" && item !== null ? (item as Record<string, unknown>) : {};
    const document = entry.document;
    const named = typeof document === "object" && document !== null
      ? (document as Record<string, unknown>).name
      : undefined;
    const name = typeof named === "string" && named.trim() !== "" ? named.trim() : `Complication ${index + 1}`;
    const parse = parseImportText(JSON.stringify(document ?? null), maxSchemaVersion);
    if (!parse.ok) {
      problems.push({ name, error: parse.error });
      return;
    }
    const devices = Array.isArray(entry.devices)
      ? entry.devices.filter((d): d is string => typeof d === "string" && d !== "")
      : [];
    entries.push({ devices, config: parse.config });
  });
  const createdAt = typeof object.createdAt === "string" ? object.createdAt : "";
  return { ok: true, createdAt, entries, problems };
}

/** What a restore writes, and what it had no room for. */
export interface RestorePlan {
  /** Complete documents, each with its own id, seat and name. */
  writes: CustomComplicationConfig[];
  /** Names of the designs no seat was left for. */
  full: string[];
}

/**
 * Where each design of a backup lands in Unassigned.
 *
 * `held` and `blocked` are what Unassigned already holds, and `taken` its
 * names, lower-cased. Each design takes the first seat free for its shape and
 * a name nothing there uses yet, and then counts as held for the next one, so
 * two designs of one backup never claim the same seat or the same name.
 */
export function planRestore(
  entries: readonly BackupEntry[],
  held: readonly SlotHolder[],
  blocked: readonly { slot: number }[],
  taken: ReadonlySet<string>,
  makeId: () => string,
): RestorePlan {
  const seats: SlotHolder[] = [...held];
  const names = new Set(taken);
  const writes: CustomComplicationConfig[] = [];
  const full: string[] = [];
  for (const entry of entries) {
    const cfg = structuredClone(entry.config);
    const families = supportedFamilies(cfg);
    const slot = freeSlotForFamily(families[0], seats, blocked);
    const name = suggestImportName(cfg.name, names) || "Restored complication";
    if (slot < 0) {
      full.push(name);
      continue;
    }
    cfg.id = makeId();
    cfg.slotIndex = slot;
    cfg.name = name;
    cfg.dataSources = [];
    cfg.schemaVersion = schemaVersionFor(cfg);
    seats.push({ slotIndex: slot, families });
    names.add(name.toLowerCase());
    writes.push(cfg);
  }
  return { writes, full };
}
