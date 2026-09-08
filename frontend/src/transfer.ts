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
  type CustomComplicationConfig,
  type EntityRef,
  auditUnknownKeys,
  ConfigParseError,
  documentEntityUses,
  encodeConfig,
  forEachValue,
  mapEntityRefs,
  mapFreeText,
  parseConfig,
  replaceQuotedEntityIds,
} from "./model.js";
import { supportedFamilies } from "./layouts.js";

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

  delete next.openPageId;
  delete next.openPageName;
  if (next.tapAction.type === "openPage") next.tapAction = { type: "none" };
  for (const el of next.elements) {
    if (el.kind !== "tap") continue;
    delete el.payload.openPageId;
    delete el.payload.openPageName;
    if (el.payload.action.type === "openPage") el.payload.action = { type: "none" };
  }
  next.dataSources = [];
  return next;
}

/** True when an aggregate reads a scope named by area, label or floor. Those
 * ids belong to the author's Home Assistant and no picker can remap them, so
 * the import dialog says so rather than pretending the design landed whole. */
export function hasInstanceFilters(cfg: CustomComplicationConfig): boolean {
  let found = false;
  forEachValue(cfg, (v) => {
    const kind = v.kind;
    if (kind.kind !== "aggregate") return;
    const scope = kind.aggregate.scope;
    if (scope.kind !== "filter") return;
    if (scope.areaIds.length + scope.labelIds.length + scope.floorIds.length > 0) found = true;
  });
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
 */
export function stableStringify(value: unknown, indent = "  "): string {
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
  const doc = mode === "share" ? scrubForShare(cfg, slots) : cfg;
  const encoded = encodeConfig(doc);
  delete encoded.id;
  delete encoded.slotIndex;
  // Derived on save. Exporting it would ship a stale answer to a question the
  // reader's own save re-answers correctly.
  encoded.dataSources = [];
  return `${stableStringify(encoded)}\n`;
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
  return [...rows.values()];
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
  return next;
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
 */
export function importSummary(cfg: CustomComplicationConfig): string {
  const layers = cfg.elements.length;
  const count = layers === 1 ? "1 layer" : `${layers} layers`;
  const families = supportedFamilies(cfg);
  return families.length === 0 ? count : `${count}, ${joinWords(families)}`;
}

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
