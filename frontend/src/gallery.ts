// Sending a complication to the public gallery on wrist-assistant.com.
//
// Everything here is pure: what the upload body is, what in it becomes public,
// what stops it from being sent, and the three calls to the gallery. The panel
// adds the markup, the preview pictures and the real `fetch`.
//
// The body is the Share text, never the Backup one. The same scrub that keeps
// entity ids and friendly names out of a forum post keeps them out of the
// gallery; this file only adds the checks a public, reviewed upload needs on
// top of it, and a list of the free text the author wrote, because no scrub
// can tell a private sentence from a harmless one.

import {
  type CustomComplicationConfig,
  type FamilyKind,
  type Rule,
  type Value,
  forEachValue,
  mapFreeText,
} from "./model.js";
import { type ShareSlot, exportText, hasInstanceFilters, isPlaceholderId, scrubForShare } from "./transfer.js";
import { supportedFamilies } from "./layouts.js";

/** Where the gallery lives. The one place to change for testing on staging. */
export const GALLERY_API_BASE = "https://wrist-assistant.com/api/gallery";

/** The shapes the gallery files a complication under: the panel's own. */
export const GALLERY_FAMILIES: readonly FamilyKind[] = ["rectangular", "circular", "corner", "inline"];

export const GALLERY_TAGS = [
  "weather", "energy", "climate", "security", "media", "health",
  "calendar", "transport", "lights", "sensors", "battery", "other",
] as const;
export type GalleryTag = (typeof GALLERY_TAGS)[number];

/** The words a tag chip shows. */
export const GALLERY_TAG_LABEL: Record<GalleryTag, string> = {
  weather: "Weather",
  energy: "Energy",
  climate: "Climate",
  security: "Security",
  media: "Media",
  health: "Health",
  calendar: "Calendar",
  transport: "Transport",
  lights: "Lights",
  sensors: "Sensors",
  battery: "Battery",
  other: "Other",
};

/** The gallery's limits, as its contract states them. Lengths are JavaScript
 * string lengths, which is what the gallery measures too. */
export const GALLERY_LIMITS = {
  title: 60,
  description: 500,
  authorName: 40,
  tags: 5,
  slots: 40,
  slotLabel: 60,
  previews: 4,
  shareTextBytes: 64 * 1024,
  pngBytes: 150 * 1024,
  bodyBytes: 1024 * 1024,
} as const;

/** The slot id shape the gallery accepts. Digits are allowed in the domain,
 * as in the panel's own placeholder rule. */
const GALLERY_SLOT_ID_RE = /^[a-z0-9_]+\.shared_[0-9]+$/;

export interface GalleryMeta {
  title: string;
  description: string;
  /** The nickname shown beside the upload. May be empty. */
  authorName: string;
  tags: readonly string[];
  /** The integration version the panel was served with. */
  panelVersion: string;
}

export interface GallerySlot {
  id: string;
  label: string;
}

export interface GalleryPreview {
  family: FamilyKind;
  /** Base64 PNG, no data URL prefix. */
  png: string;
}

export interface GallerySubmission {
  shareText: string;
  title: string;
  description: string;
  authorName: string;
  tags: GalleryTag[];
  families: FamilyKind[];
  slots: GallerySlot[];
  previews: GalleryPreview[];
  panelVersion: string;
}

/**
 * Names the author changed for the gallery copy only. Keyed by folder id and
 * shared value id; an empty or missing entry keeps the document's own name.
 * The draft is never touched: these apply to a clone just before export.
 */
export interface GalleryOverrides {
  /** The name the shared copy takes. The submission fills it from the title. */
  name?: string;
  groupNames?: ReadonlyMap<string, string>;
  valueNames?: ReadonlyMap<string, string>;
}

/** A copy of the document with the gallery's renames applied. */
export function applyGalleryOverrides(cfg: CustomComplicationConfig, overrides: GalleryOverrides = {}): CustomComplicationConfig {
  const next = structuredClone(cfg);
  const pick = (original: string, wanted: string | undefined): string =>
    wanted === undefined || wanted.trim() === "" ? original : wanted.trim();
  next.name = pick(next.name, overrides.name);
  for (const g of next.groups ?? []) g.name = pick(g.name, overrides.groupNames?.get(g.id));
  for (const n of next.values) n.name = pick(n.name, overrides.valueNames?.get(n.id));
  return next;
}

function isGalleryTag(tag: string): tag is GalleryTag {
  return (GALLERY_TAGS as readonly string[]).includes(tag);
}

function byteLength(text: string): number {
  return new TextEncoder().encode(text).length;
}

/**
 * The upload body, less the preview pictures (those need a canvas).
 *
 * `slots` are the Share dialog's slots with the author's labels applied, the
 * same ones its text uses, so the gallery text is exactly the text the Share
 * dialog shows. Passing no slots would scrub nothing, which is why they are
 * not optional here.
 *
 * The copy is named by the title, and takes the folder and shared value names
 * the author changed for the gallery.
 */
export function buildGallerySubmission(
  cfg: CustomComplicationConfig,
  slots: readonly ShareSlot[],
  meta: GalleryMeta,
  overrides: GalleryOverrides = {},
): Omit<GallerySubmission, "previews"> {
  const tags: GalleryTag[] = [];
  for (const tag of meta.tags) if (isGalleryTag(tag) && !tags.includes(tag)) tags.push(tag);
  return {
    shareText: exportText(applyGalleryOverrides(cfg, { ...overrides, name: meta.title }), "share", slots),
    title: meta.title.trim(),
    description: meta.description.trim(),
    authorName: meta.authorName.trim(),
    tags,
    families: supportedFamilies(cfg).filter((f) => GALLERY_FAMILIES.includes(f)),
    slots: slots.map((slot) => ({ id: slot.placeholderId, label: slot.label.trim() })),
    panelVersion: meta.panelVersion,
  };
}

// ── what becomes public ───────────────────────────────────────────────────

/** One name the dialog lets the author change for the gallery copy. */
export interface GalleryNameRow {
  kind: "folder" | "shared" | "slot";
  /** Folder id, shared value id, or slot placeholder id. */
  id: string;
  /** The name as it will be sent. */
  value: string;
  /** The document's own name, which an emptied field falls back to. */
  original: string;
}

export interface GalleryPublicGroup {
  label: string;
  values: string[];
  /** Present on the groups the author can rename, one row per item. */
  rows?: GalleryNameRow[];
}

/** Keys in the share text whose strings are structure, not writing: ids,
 * enum values, colours, symbol names, and the placeholders the scrub put in.
 * A key missing here shows its strings under "Other text", which is the safe
 * way to be wrong. */
const STRUCTURAL_KEYS = new Set([
  "id", "kind", "type", "join", "domain", "domains", "entityId", "displayName",
  "supportedFamilies", "perFamily", "fontWeight", "weight", "alignment", "style", "cornerBodyShape",
  "function", "baseline", "coloring", "highlight", "marker", "highMarker", "lowMarker", "scale",
  "at", "place", "barCorners", "curve", "smoothing", "dots", "fillStyle", "stat", "source",
  "statType", "statPeriod", "hourCycle", "minutes", "timeField", "timestampCorner", "contentMode",
  "symbol", "path", "serviceDomain", "serviceName", "attachedTo", "layer", "chart", "image",
  "scaleFrom", "groupId", "partId", "areaIds", "labelIds", "floorIds",
]);

const UUID_RE = /^[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{12}$/;
const HEX_RE = /^#[0-9A-Fa-f]{3,8}$/;
const NUMBER_RE = /^-?\d+(\.\d+)?$/;

function pushUnique(list: string[], value: string | undefined): void {
  if (value === undefined) return;
  const v = value.trim();
  if (v !== "" && !list.includes(v)) list.push(v);
}

/**
 * Every piece of free text the upload will make public, grouped the way the
 * author will recognise it.
 *
 * Read off the scrubbed document, so an entity id the scrub replaced shows as
 * its placeholder. The named groups come from the document walkers; "Other
 * text" is every remaining string in the share text that is not structure,
 * which is what catches a literal typed into a layer, a rule's pattern, or a
 * text part's prefix.
 *
 * The complication's name is not listed: the copy takes the title, which the
 * author typed a moment ago. Folder, shared value and slot groups carry rows
 * so the dialog can offer each name for editing.
 */
export function galleryPublicFields(
  cfg: CustomComplicationConfig,
  slots: readonly ShareSlot[],
  overrides: GalleryOverrides = {},
): GalleryPublicGroup[] {
  const renamed = applyGalleryOverrides(cfg, overrides);
  const scrubbed = scrubForShare(renamed, slots);
  const layers: string[] = [];
  const folders: string[] = [];
  const shared: string[] = [];
  const labels: string[] = [];
  const templates: string[] = [];
  const serviceData: string[] = [];
  const symbols = new Set<string>();
  const other: string[] = [];

  const folderRows: GalleryNameRow[] = [];
  const sharedRows: GalleryNameRow[] = [];
  for (const el of scrubbed.elements) pushUnique(layers, el.payload.name);
  (scrubbed.groups ?? []).forEach((g, i) => {
    pushUnique(folders, g.name);
    folderRows.push({ kind: "folder", id: g.id, value: g.name, original: cfg.groups?.[i]?.name ?? g.name });
  });
  scrubbed.values.forEach((n, i) => {
    pushUnique(shared, n.name);
    sharedRows.push({ kind: "shared", id: n.id, value: n.name, original: cfg.values[i]?.name ?? n.name });
  });
  for (const slot of slots) pushUnique(labels, slot.label);
  const slotRows: GalleryNameRow[] = slots.map((slot) => ({
    kind: "slot", id: slot.placeholderId, value: slot.label, original: slot.label,
  }));
  forEachValue(scrubbed, (v) => {
    if (v.kind.kind === "jinja") pushUnique(templates, v.kind.value);
  });
  mapFreeText(scrubbed, (text, site) => {
    if (site.part === "serviceData") pushUnique(serviceData, text);
    return text;
  });
  // An icon's literal symbol, on the layer or set by a rule, is a built-in
  // icon name such as `circle.fill`, not something the author wrote.
  const symbolOf = (v: Value | undefined): void => {
    if (v?.kind.kind === "literal") symbols.add(v.kind.value.trim());
  };
  const ruleSymbols = (rules: readonly Rule[]): void => {
    for (const rule of rules) {
      for (const c of rule.cases) for (const change of c.then) if (change.kind === "setIcon") symbolOf(change.value);
      for (const change of rule.otherwise ?? []) if (change.kind === "setIcon") symbolOf(change.value);
    }
  };
  for (const el of scrubbed.elements) {
    if (el.kind === "icon") symbolOf(el.payload.symbol);
    ruleSymbols(el.payload.rules);
  }
  for (const layout of Object.values(scrubbed.perFamily)) if (layout) ruleSymbols(layout.rules);

  const listed = new Set([scrubbed.name.trim(), ...layers, ...folders, ...shared, ...labels, ...templates, ...serviceData, ...symbols]);
  const walk = (v: unknown, key: string): void => {
    if (typeof v === "string") {
      const s = v.trim();
      if (s === "" || listed.has(s) || STRUCTURAL_KEYS.has(key) || key.endsWith("Hex")) return;
      if (UUID_RE.test(s) || HEX_RE.test(s) || NUMBER_RE.test(s) || isPlaceholderId(s)) return;
      pushUnique(other, s);
      return;
    }
    if (Array.isArray(v)) {
      for (const x of v) walk(x, key);
      return;
    }
    if (v !== null && typeof v === "object") {
      for (const [k, x] of Object.entries(v)) walk(x, k);
    }
  };
  walk(JSON.parse(exportText(renamed, "share", slots)), "");

  const groups: GalleryPublicGroup[] = [
    { label: "Layer names", values: layers },
    { label: "Folder names", values: folders, rows: folderRows },
    { label: "Shared value names", values: shared, rows: sharedRows },
    { label: "Slot labels", values: labels, rows: slotRows },
    { label: "Template text", values: templates },
    { label: "Service data", values: serviceData },
    { label: "Other text", values: other },
  ];
  return groups.filter((g) => g.values.length > 0);
}

// ── what stops an upload ──────────────────────────────────────────────────

/**
 * An entity id written into free text without quotes, such as
 * `states.sensor.energy.state`. The share scrub only rewrites quoted ids, so
 * this form would reach the gallery with the author's real id in it. Only
 * domains this house has count, so `value.attributes` is not an entity.
 */
export function unquotedEntityIds(text: string, knownDomains: ReadonlySet<string>): string[] {
  const out: string[] = [];
  for (const m of text.matchAll(/[a-z0-9_]+(?:\.[a-z0-9_]+)+/g)) {
    const start = m.index ?? 0;
    const before = start > 0 ? text[start - 1] : "";
    const parts = m[0].split(".");
    for (let i = 0; i + 1 < parts.length; i++) {
      if (!knownDomains.has(parts[i]!)) continue;
      const id = `${parts[i]}.${parts[i + 1]}`;
      // The object id is not the start of another id: `sun.sun.attributes`
      // names sun.sun and nothing else.
      const at = i++;
      if (isPlaceholderId(id)) continue;
      // A quoted id on its own is the scrub's job, and it has done it.
      const quoted = at === 0 && (before === "'" || before === "\"") && parts.length === 2;
      if (!quoted && !out.includes(id)) out.push(id);
    }
  }
  return out;
}

/**
 * Why this upload cannot be sent, in sentences the author can act on. Empty
 * means nothing stops it.
 *
 * `knownDomains` turns on the unquoted id check; leave it out where the house
 * is not known.
 */
export function galleryBlockers(
  cfg: CustomComplicationConfig,
  slots: readonly ShareSlot[],
  meta: GalleryMeta,
  knownDomains?: ReadonlySet<string>,
  overrides: GalleryOverrides = {},
): string[] {
  const out: string[] = [];
  const body = buildGallerySubmission(cfg, slots, meta, overrides);

  if (hasInstanceFilters(cfg)) {
    out.push("It reads entities by area, label or floor. Those belong to your Home Assistant, so pick the entities themselves before sending it to the gallery.");
  }
  if (body.title === "") out.push("Give it a title.");
  if (body.title.length > GALLERY_LIMITS.title) out.push(`The title is longer than ${GALLERY_LIMITS.title} characters.`);
  if (body.description.length > GALLERY_LIMITS.description) {
    out.push(`The description is longer than ${GALLERY_LIMITS.description} characters.`);
  }
  if (body.authorName.length > GALLERY_LIMITS.authorName) {
    out.push(`The nickname is longer than ${GALLERY_LIMITS.authorName} characters.`);
  }
  if (meta.tags.length > GALLERY_LIMITS.tags) out.push(`Pick at most ${GALLERY_LIMITS.tags} tags.`);
  if (meta.tags.some((t) => !isGalleryTag(t))) out.push("One of the tags is not a gallery tag.");
  if (body.families.length === 0) out.push("It has no shape the gallery can show.");

  if (body.slots.length > GALLERY_LIMITS.slots) {
    out.push(`It reads ${body.slots.length} entities. The gallery takes at most ${GALLERY_LIMITS.slots}.`);
  }
  for (const slot of body.slots) {
    if (!GALLERY_SLOT_ID_RE.test(slot.id)) {
      out.push(`The gallery cannot take the slot ${slot.id}, because its domain has characters other than letters and underscores.`);
    }
    if (slot.label.length > GALLERY_LIMITS.slotLabel) {
      out.push(`The label for ${slot.id} is longer than ${GALLERY_LIMITS.slotLabel} characters.`);
    }
  }

  const bytes = byteLength(body.shareText);
  if (bytes > GALLERY_LIMITS.shareTextBytes) {
    out.push(`It is too big for the gallery: its text is ${Math.ceil(bytes / 1024)} KB and the limit is ${GALLERY_LIMITS.shareTextBytes / 1024} KB.`);
  }

  // The scrub's own promise, checked on the text that would actually leave.
  const leaked = slots.filter((slot) => slot.originalId !== "" && body.shareText.includes(slot.originalId));
  const unquoted = new Set<string>();
  if (knownDomains) {
    mapFreeText(scrubForShare(cfg, slots), (text) => {
      for (const id of unquotedEntityIds(text, knownDomains)) unquoted.add(id);
      return text;
    });
  }
  for (const slot of leaked) unquoted.add(slot.originalId);
  if (unquoted.size > 0) {
    out.push(`Template or service data text names ${[...unquoted].join(", ")} in a way sharing cannot replace. Write it in quotes, like states('sensor.example'), so it becomes a slot.`);
  }
  return out;
}

// ── talking to the gallery ────────────────────────────────────────────────

/** The part of `fetch` these calls use, so tests can pass a stub. */
export type GalleryFetch = (
  url: string,
  init: { method: string; headers: Record<string, string>; body?: string; credentials?: "omit"; mode?: "cors" },
) => Promise<{
  ok: boolean;
  status: number;
  headers: { get(name: string): string | null };
  json(): Promise<unknown>;
}>;

export type GalleryErrorCode =
  | "bad_json" | "too_large" | "invalid_field" | "schema_too_new" | "bad_png"
  | "rate_limited" | "not_found" | "forbidden" | "server_error" | "network";

const KNOWN_CODES: readonly GalleryErrorCode[] = [
  "bad_json", "too_large", "invalid_field", "schema_too_new", "bad_png",
  "rate_limited", "not_found", "forbidden", "server_error",
];

export class GalleryError extends Error {
  constructor(
    readonly code: GalleryErrorCode,
    readonly status: number,
    readonly detail?: string,
    /** Seconds, from `retry-after` on a 429. */
    readonly retryAfter?: number,
  ) {
    super(detail ? `${code}: ${detail}` : code);
    this.name = "GalleryError";
  }
}

/** The contract's field names, in the words the dialog uses. */
const FIELD_WORDS: Record<string, string> = {
  shareText: "complication text",
  title: "title",
  description: "description",
  authorName: "nickname",
  tags: "tags",
  families: "shapes",
  slots: "slot labels",
  previews: "preview pictures",
  panelVersion: "panel version",
};

/** One sentence for the dialog, per error. */
export function galleryErrorMessage(err: unknown): string {
  if (!(err instanceof GalleryError)) return "Something went wrong. Try again.";
  switch (err.code) {
    case "rate_limited":
      return "That is as many uploads as the gallery takes in a day. Try again tomorrow.";
    case "too_large":
      return "It is too big for the gallery.";
    case "invalid_field": {
      const field = err.detail === undefined ? undefined : (FIELD_WORDS[err.detail.split(/[.[\s]/)[0] ?? ""] ?? err.detail);
      return field === undefined ? "The gallery did not accept one of the fields." : `The gallery did not accept the ${field}.`;
    }
    case "schema_too_new":
      return "The gallery does not take complications made by this panel version yet.";
    case "bad_png":
      return "A preview picture could not be read. Close this and try again.";
    case "bad_json":
      return "The gallery could not read the upload. Update the Wrist Assistant integration and try again.";
    case "not_found":
      return "That upload is not in the gallery any more.";
    case "forbidden":
      return "The gallery did not accept this Home Assistant's key.";
    case "network":
      return "Could not reach the gallery. Check the connection and try again.";
    case "server_error":
      return "The gallery had a problem. Try again later.";
  }
}

async function failure(res: Awaited<ReturnType<GalleryFetch>>): Promise<GalleryError> {
  let code: GalleryErrorCode = "server_error";
  let detail: string | undefined;
  try {
    const body = await res.json() as { error?: unknown; detail?: unknown };
    if (typeof body.error === "string" && (KNOWN_CODES as readonly string[]).includes(body.error)) {
      code = body.error as GalleryErrorCode;
    }
    if (typeof body.detail === "string") detail = body.detail;
  } catch {
    // Not JSON: a proxy page or an outage. The status decides below.
  }
  if (res.status === 429) code = "rate_limited";
  const retry = Number(res.headers.get("retry-after"));
  return new GalleryError(code, res.status, detail, Number.isFinite(retry) && retry > 0 ? retry : undefined);
}

async function call(
  fetchFn: GalleryFetch,
  url: string,
  method: string,
  key: string,
  body?: string,
): Promise<Awaited<ReturnType<GalleryFetch>>> {
  const headers: Record<string, string> = { "X-Gallery-Key": key };
  if (body !== undefined) headers["content-type"] = "application/json";
  let res;
  try {
    res = await fetchFn(url, { method, headers, body, credentials: "omit", mode: "cors" });
  } catch {
    throw new GalleryError("network", 0);
  }
  if (!res.ok) throw await failure(res);
  return res;
}

export async function submitToGallery(
  fetchFn: GalleryFetch,
  key: string,
  submission: GallerySubmission,
  base: string = GALLERY_API_BASE,
): Promise<{ id: string; status: string }> {
  const body = JSON.stringify(submission);
  // Refused here rather than after a megabyte of upload.
  if (byteLength(body) > GALLERY_LIMITS.bodyBytes) throw new GalleryError("too_large", 0);
  const res = await call(fetchFn, `${base}/submissions`, "POST", key, body);
  const out = await res.json() as { id?: unknown; status?: unknown };
  return { id: String(out.id ?? ""), status: String(out.status ?? "pending") };
}

export type GalleryUploadStatus = "pending" | "approved" | "rejected" | "removed";

export interface GalleryUpload {
  id: string;
  title: string;
  status: GalleryUploadStatus;
  rejectReason: string | null;
  createdAt: string;
  voteCount: number;
}

export async function listMyUploads(
  fetchFn: GalleryFetch,
  key: string,
  base: string = GALLERY_API_BASE,
): Promise<GalleryUpload[]> {
  const res = await call(fetchFn, `${base}/mine`, "GET", key);
  const body = await res.json() as { items?: unknown };
  return Array.isArray(body.items) ? (body.items as GalleryUpload[]) : [];
}

export async function deleteMyUpload(
  fetchFn: GalleryFetch,
  key: string,
  id: string,
  base: string = GALLERY_API_BASE,
): Promise<void> {
  await call(fetchFn, `${base}/mine/${encodeURIComponent(id)}`, "DELETE", key);
}

/** What each status reads as in the uploads list. */
export const GALLERY_STATUS_LABEL: Record<GalleryUploadStatus, string> = {
  pending: "Waiting for review",
  approved: "In the gallery",
  rejected: "Not accepted",
  removed: "Removed",
};
