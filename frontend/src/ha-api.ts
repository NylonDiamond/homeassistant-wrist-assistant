// Thin typed wrapper over the integration's WebSocket commands. The panel
// receives the frontend's live `hass` object; `hass.connection` is the
// authenticated socket every HA panel shares.

export interface HassEntityState {
  entity_id: string;
  state: string;
  attributes: Record<string, unknown>;
  last_changed: string;
  last_updated: string;
}

export interface HassLike {
  connection: {
    sendMessagePromise<T>(message: Record<string, unknown>): Promise<T>;
    subscribeMessage<T>(
      callback: (message: T) => void,
      message: Record<string, unknown>,
    ): Promise<() => Promise<void>>;
  };
  states: Record<string, HassEntityState>;
  /** The frontend's registry snapshots, which is where an entity's area comes
      from: the entity carries an area itself, or inherits its device's. All
      three are optional so the panel still runs against a Home Assistant that
      does not put them on `hass`, and against the tests, which do not. */
  entities?: Record<string, { area_id?: string | null; device_id?: string | null }>;
  devices?: Record<string, { area_id?: string | null; name?: string | null }>;
  areas?: Record<string, { name?: string | null }>;
  user?: { is_admin?: boolean; name?: string };
  language?: string;
  /** The frontend's theme state; `darkMode` is what the panel's dark skin keys off. */
  themes?: { darkMode?: boolean };
  /** "always_hidden" when the user has hidden Home Assistant's sidebar for
      good, which leaves a panel to offer the menu button, as on a phone. */
  dockedSidebar?: string;
}

import { type CustomComplicationConfig, type ListRequestSpec, type OccupiedSlot, chartHistoryRequests, chartStatisticsRequests } from "./model.js";
import { listRequests } from "./compiler.js";
import type { SavedPart } from "./parts.js";
import type { DeviceKind } from "./version.js";

export interface OwnerSummary {
  owner_watch_id: string;
  device_name: string | null;
  /** Which device owns these records. Absent from integrations older than the
      field, and absent means a watch: every owner was one until iPhones could
      own records of their own. Null on an orphan, which has no registered
      device left to ask. A phone row carries `app_version` and `device_name`,
      with `screen_size` and `paired_iphone_name` null and `polling` never
      true: there is no long poll to a phone. */
  device_kind?: DeviceKind | null;
  /** Name of the iPhone this watch is paired to. Both real watches report
      themselves as "Apple Watch", so this is what tells them apart. */
  paired_iphone_name: string | null;
  /** Owner id of the iPhone this watch is paired to, which is the same pairing
      as `paired_iphone_name` without the guesswork: two watches in one home
      report the same name and so can the phones they belong to. Optional
      because an integration older than the field sends neither key, and the
      panel falls back to matching on the name there. Null on a phone, which is
      nobody's paired phone, and on an orphan, which has no entry left to ask. */
  paired_iphone_id?: string | null;
  app_version: string | null;
  /** Build number (CFBundleVersion, "11" style) reported beside the version.
      Null when the app has not reported one and on an orphan, absent from an
      integration older than the field. Build numbers restart at 1 on every new
      version, so this only ever means anything read together with
      `app_version`: the one gate that needs it is the split migration, whose
      resolver landed part-way through a beta (see `SPLIT_GATE`). */
  app_build?: string | null;
  /** Screen size in points ("208x248"), reported by the watch app. Matches a
      renderer `WatchCase` so the preview dropdown defaults to this watch. */
  screen_size: string | null;
  complication_count: number;
  token: number;
  /** The store token this watch last said it applied, null when it never has.
      Absent from integrations older than the field. */
  applied_token?: number | null;
  /** No device is registered under this id any more, but it still owns
      records: a reinstall gave the watch a new id. Offer the Move action. */
  is_orphan: boolean;
}

export interface ComplicationRecord {
  id: string;
  ownerWatchId: string;
  revision: number;
  token: number;
  updatedAt: string;
  updatedBy: string;
  deleted: boolean;
  document: Record<string, unknown> | null;
}

export interface ChangeEvent {
  owner_watch_id: string;
  token: number;
  /** Null on an ack event: the watch reported the token it applied. */
  record: ComplicationRecord | null;
  /** Set on an ack event; absent from integrations older than the field. */
  applied_token?: number | null;
}

export interface SaveResult {
  ok: boolean;
  record?: ComplicationRecord;
  error?: string;
  message?: string;
  current?: ComplicationRecord | null;
}

export type RenderResult =
  | { ok: true; value: string }
  | { ok: false; error: string };

const D = "wrist_assistant/complications";

/** The random key this Home Assistant sends to the complication gallery.
 * Made by the integration on the first request and kept after that. */
export async function fetchGalleryKey(hass: HassLike) {
  return hass.connection.sendMessagePromise<{ key: string }>({ type: "wrist_assistant/gallery_key" });
}

/** Parts: the home's library of saved layer sets. One library per home, so
 * none of the three takes an owner. `text` is the whole part; the panel draws
 * its picture from that rather than the integration keeping one. */
export async function fetchParts(hass: HassLike) {
  return hass.connection.sendMessagePromise<{ parts: SavedPart[] }>({ type: `${D}/parts_list` });
}

/** Add a part, or replace the one with `partId`, which is how both renaming a
 * part and saving over it are spelled. */
export async function savePart(hass: HassLike, name: string, text: string, partId?: string) {
  const message: Record<string, unknown> = { type: `${D}/parts_save`, name, text };
  if (partId !== undefined) message.part_id = partId;
  return hass.connection.sendMessagePromise<{ part: SavedPart }>(message);
}

export async function deletePart(hass: HassLike, partId: string) {
  return hass.connection.sendMessagePromise<{ ok: boolean }>({ type: `${D}/parts_delete`, part_id: partId });
}

/**
 * Call a Home Assistant service, straight down the websocket the frontend
 * already holds open. The one place the panel changes the home rather than the
 * document, and it exists for demo mode: a tap that toggles a light has to
 * really toggle it, or the demo is a picture rather than a test.
 *
 * `service_data` carries the target the way the watch sends it, `entity_id`
 * inside the data, because that is what every service in Home Assistant has
 * always accepted and it keeps one shape for both callers.
 */
export async function callService(
  hass: HassLike,
  domain: string,
  service: string,
  data: Record<string, unknown> = {},
) {
  return hass.connection.sendMessagePromise<unknown>({
    type: "call_service",
    domain,
    service,
    service_data: data,
  });
}

export async function fetchOwners(hass: HassLike) {
  return hass.connection.sendMessagePromise<{
    owners: OwnerSummary[];
    max_schema_version: number;
    token: number;
  }>({ type: `${D}/owners` });
}

export async function fetchList(hass: HassLike, owner: string) {
  return hass.connection.sendMessagePromise<{
    owner_watch_id: string;
    token: number;
    max_schema_version: number;
    // iPhone presets on this watch (slot + name, its last sync report). The
    // auto-assigner skips their slots (a custom under a preset is masked at
    // render) and the list shows them as locked rows. Absent from
    // integrations older than this field.
    presets?: { slot: number; name: string }[];
    /** Every slot something other than this server's records holds: the
     * presets above plus customs on another home. Absent from integrations
     * older than the field; the panel then builds it from `presets`. */
    occupied?: OccupiedSlot[];
    /** The store token the watch last said it applied. Equal to `token` means
     * everything here is on the wrist. Null when the watch has never acked at
     * all, which is not the same as 0: nothing saved here reaches it. */
    applied_token?: number | null;
    /** How many designs the device's next pull will bring (each changed or
     * deleted design once). Null before its first ack, absent from
     * integrations older than the field. */
    pending_changes?: number | null;
    /** Whether the watch holds a long-poll on this server right now. */
    polling?: boolean;
    /** Seconds since the watch last polled. Null when it has not polled since
     * the server started, absent from integrations older than the field. */
    last_poll_seconds?: number | null;
    /** Whether the server holds a push token for this owner; see
     * `fetchWatchStatus`. Absent from integrations older than the field, and
     * from any list reply that does not carry it, in which case the panel
     * keeps what the last status reply told it. */
    push_available?: boolean;
    /** Seconds since the last push attempt for this owner; see
     * `fetchWatchStatus`. Absent under the same conditions. */
    last_push_seconds?: number | null;
    /** Watch-app pages (id + name, watch order), per its last sync report. */
    pages?: { id: string; name: string }[];
    records: ComplicationRecord[];
  }>({ type: `${D}/list`, owner_watch_id: owner });
}

/** "Send to watch", and "Refresh now" on a phone: wake the watch's parked
 * long-poll so it is handed the current token again, or send the phone a
 * silent push so it pulls now. Changes nothing in the store. */
export async function nudgeWatch(hass: HassLike, owner: string) {
  return hass.connection.sendMessagePromise<{
    polling: boolean;
    last_poll_seconds?: number | null;
    /** Whether this call actually sent a push. False for a watch owner, and
     * for a phone with no token on file. Absent from integrations older than
     * the field, which never push at all. */
    pushed?: boolean;
    /** Whether the server holds a push token for this owner, so a save can
     * wake it. False for a watch owner. Absent from integrations older than
     * the field. */
    push_available?: boolean;
    token: number;
    /** Null when the watch has never acked; see `fetchList`. */
    applied_token: number | null;
    /** See `fetchList`. */
    pending_changes?: number | null;
  }>({ type: `${D}/nudge`, owner_watch_id: owner });
}

/** Just the watch's reachability, for the header chip. Cheap enough to ask
 * for on a timer: nothing fires when a watch stops polling or starts again,
 * so without this the chip is only ever as fresh as the last list. */
export async function fetchWatchStatus(hass: HassLike, owner: string) {
  return hass.connection.sendMessagePromise<{
    polling: boolean;
    last_poll_seconds?: number | null;
    /** Seconds since this owner last ran a sync, which is what a phone has
     * instead of a poll: its `last_poll_seconds` is always null. Null when it
     * has never synced, absent from integrations older than the field. */
    last_sync_seconds?: number | null;
    /** Whether the server holds a push token for this owner, so a save wakes
     * it with a silent push. False for a watch owner, which is woken by its
     * long poll instead. Absent from integrations older than the field, which
     * never push at all. */
    push_available?: boolean;
    /** Seconds since the last push attempt for this owner, this server run.
     * Null when there has been none, and always null for a watch owner.
     * Absent from integrations older than the field. */
    last_push_seconds?: number | null;
    token: number;
    /** Null when the watch has never acked; see `fetchList`. */
    applied_token: number | null;
    /** See `fetchList`. */
    pending_changes?: number | null;
  }>({ type: `${D}/watch_status`, owner_watch_id: owner });
}

export async function saveRecord(
  hass: HassLike,
  owner: string,
  document: Record<string, unknown>,
  baseRevision: number | null,
) {
  return hass.connection.sendMessagePromise<SaveResult>({
    type: `${D}/save`,
    owner_watch_id: owner,
    document,
    base_revision: baseRevision,
  });
}

export async function deleteRecord(
  hass: HassLike,
  owner: string,
  id: string,
  baseRevision: number | null,
) {
  return hass.connection.sendMessagePromise<SaveResult>({
    type: `${D}/delete`,
    owner_watch_id: owner,
    // Not `id`: that key is the WebSocket message id and the schema rejects it.
    complication_id: id,
    base_revision: baseRevision,
  });
}

/** One past revision of a complication, as the history list draws it. No
 * document body: the list only needs enough to tell two entries apart, and
 * the preview fetches the one entry it is showing. */
export interface SaveHistoryEntry {
  /** The revision this entry is a picture of, not the one that replaced it. */
  revision: number;
  /** ISO-8601 UTC of when that revision was saved. */
  savedAt: string;
  /** Who saved it, in the `ha-panel:Name` shape the record uses. */
  updatedBy: string;
  name: string;
  layers: number;
  families: string[];
}

/** Past revisions of one complication, newest first. The revision the record
 * is on now is not among them: it is the one the editor has open. */
export async function fetchSaveHistory(hass: HassLike, owner: string, id: string) {
  return hass.connection.sendMessagePromise<{
    owner_watch_id: string;
    complication_id: string;
    revision: number;
    entries: SaveHistoryEntry[];
  }>({ type: `${D}/history`, owner_watch_id: owner, complication_id: id });
}

/** One past revision's document, for the history dialog's preview. */
export async function fetchSaveHistoryEntry(
  hass: HassLike,
  owner: string,
  id: string,
  revision: number,
) {
  return hass.connection.sendMessagePromise<{
    entry: SaveHistoryEntry & { document: Record<string, unknown> };
  }>({
    type: `${D}/history_get`,
    owner_watch_id: owner,
    complication_id: id,
    revision,
  });
}

/** Put a past revision back, as a new revision of its own. Nothing rewinds,
 * so undoing a restore is another restore rather than a special case.
 * `baseRevision` is the revision the editor has open, so someone else saving
 * first comes back as the usual conflict. */
export async function restoreSaveHistory(
  hass: HassLike,
  owner: string,
  id: string,
  revision: number,
  baseRevision: number | null,
) {
  return hass.connection.sendMessagePromise<SaveResult & { restored_revision?: number }>({
    type: `${D}/history_restore`,
    owner_watch_id: owner,
    complication_id: id,
    revision,
    base_revision: baseRevision,
  });
}

/** Hand every live record of one watch to another watch. Admin only. */
export async function moveOwner(hass: HassLike, source: string, target: string) {
  return hass.connection.sendMessagePromise<{
    records: ComplicationRecord[];
    token: number;
  }>({
    type: `${D}/move_owner`,
    source_owner_watch_id: source,
    target_owner_watch_id: target,
  });
}

export function subscribeChanges(
  hass: HassLike,
  owner: string | undefined,
  callback: (event: ChangeEvent) => void,
) {
  const message: Record<string, unknown> = { type: `${D}/subscribe` };
  if (owner) message.owner_watch_id = owner;
  return hass.connection.subscribeMessage<ChangeEvent>(callback, message);
}

export async function renderTemplates(
  hass: HassLike,
  templates: Record<string, string>,
): Promise<Record<string, RenderResult>> {
  if (Object.keys(templates).length === 0) return {};
  const reply = await hass.connection.sendMessagePromise<{
    results: Record<string, RenderResult>;
  }>({ type: `${D}/render_values`, templates });
  return reply.results;
}

/** One recorder series per request key, for the preview's history charts.
 *
 * The browser could read HA's own history API and average the rows itself, but
 * then the editor's arithmetic and the watch's would be two implementations of
 * one average, free to drift. This asks the integration to run the module the
 * watch's signed `op=history` runs, so the preview draws what the wrist draws. */
export async function fetchHistorySeries(
  hass: HassLike,
  requests: Record<string, HistorySeriesRequest>,
): Promise<Record<string, HistorySeriesResult>> {
  if (Object.keys(requests).length === 0) return {};
  const reply = await hass.connection.sendMessagePromise<{
    results: Record<string, HistorySeriesResult>;
  }>({ type: `${D}/history_series`, requests });
  return reply.results;
}

/** One recorder query.
 *
 * `mode` picks what comes back: numbers averaged into `points` slots, or the
 * states themselves with the second each began. It is left out at `numeric`,
 * which is what every chart asks for, so a chart's request is byte for byte
 * what it was before timelines existed. */
export interface HistorySeriesRequest {
  entity_id: string;
  minutes: number;
  points: number;
  mode?: "numeric" | "states";
  /** Empty tokens where the entity was unavailable. Sent only as true, so an
   * older server never meets the key from a chart that does not ask. */
  gaps?: true;
  /** An aggregate timeline's entities, merged server-side into one strip.
   * Sent only when the layer has some, so a chart and a single-entity timeline
   * send exactly what they always sent. */
  entities?: string[];
  /** How those are merged. Sent beside `entities` and never on its own. */
  combine?: "any" | "all";
}

/** The wire body of one history query, with every optional key left out at
 * its default so a plain chart sends exactly what it always sent. */
export function historySeriesRequest(r: { entityId: string; minutes: number; points: number; mode: "numeric" | "states"; gaps: boolean; entities?: string[]; combine?: "any" | "all" }): HistorySeriesRequest {
  return {
    entity_id: r.entityId,
    minutes: r.minutes,
    points: r.points,
    ...(r.mode === "states" ? { mode: "states" as const } : {}),
    ...(r.gaps ? { gaps: true as const } : {}),
    ...(r.entities !== undefined && r.entities.length > 0
      ? { entities: [...r.entities], combine: r.combine ?? "any" }
      : {}),
  };
}

/** The wire body of one statistics query, `gaps` sent only when true. */
export function statisticsSeriesRequest(r: { entityId: string; minutes: number; period: string; type: string; gaps: boolean }): StatisticsSeriesRequest {
  return {
    entity_id: r.entityId,
    minutes: r.minutes,
    period: r.period,
    type: r.type,
    ...(r.gaps ? { gaps: true as const } : {}),
  };
}

/** `readings` and `averaged` arrive only for a numeric every-reading request
 * (`points` 0): the count found in the span, and whether there were more than
 * the server keeps, so it averaged the whole span instead. */
export type HistorySeriesResult =
  | { ok: true; series: string; readings?: number; averaged?: boolean }
  | { ok: false; error: string };

/** What the server said about an every-reading fetch. */
export interface HistoryReadings {
  readings: number;
  averaged: boolean;
}

/** Folds command results into the series Map the resolver reads and the
 * readings Map the chart editor explains averaging from. Failed keys land in
 * neither, and a result without `readings` (averaged mode, a timeline, a
 * statistics row, an older server) lands only in the series. */
export function collectSeriesResults(results: Record<string, HistorySeriesResult>): {
  series: Map<string, string>;
  readings: Map<string, HistoryReadings>;
} {
  const series = new Map<string, string>();
  const readings = new Map<string, HistoryReadings>();
  for (const [key, result] of Object.entries(results)) {
    if (!result.ok) continue;
    series.set(key, result.series);
    if (typeof result.readings === "number") {
      readings.set(key, { readings: result.readings, averaged: result.averaged === true });
    }
  }
  return { series, readings };
}

/** One long-term statistics series per request key, for the preview's charts.
 *
 * The sibling of `fetchHistorySeries` and the same bargain: the browser runs
 * the module the watch's signed `op=statistics` runs, so the editor's hourly
 * energy bars and the wrist's are one implementation. The reply shape is the
 * history command's, so both fold into the one series Map. */
export async function fetchStatisticsSeries(
  hass: HassLike,
  requests: Record<string, StatisticsSeriesRequest>,
): Promise<Record<string, HistorySeriesResult>> {
  if (Object.keys(requests).length === 0) return {};
  const reply = await hass.connection.sendMessagePromise<{
    results: Record<string, HistorySeriesResult>;
  }>({ type: `${D}/statistics_series`, requests });
  return reply.results;
}

/** One statistics query. No point count: the period already decides how many
 * rows a span holds. */
export interface StatisticsSeriesRequest {
  entity_id: string;
  minutes: number;
  period: string;
  type: string;
  gaps?: true;
}

/** What one list key came back as: the items and how many there were before
 * the slice, or the reason the service call failed. The history commands'
 * shape, so a failed key blanks that list and leaves every other one alone. */
export type ListItemsResult =
  | { ok: true; items: unknown[]; total: number }
  | { ok: false; error: string };

/**
 * Calendar events, to-do items and weather forecasts for the preview's list
 * layers, one entry per readable list key.
 *
 * The same bargain `fetchHistorySeries` makes: these need service calls with
 * `return_response`, which the browser could make itself, but then the panel's
 * merge, sort and caps and the watch's would be two implementations of one
 * answer. The integration runs the module the signed `op=list` runs, so the
 * preview draws what the wrist draws.
 */
export async function fetchListItems(
  hass: HassLike,
  requests: Record<string, ListRequestSpec>,
): Promise<Record<string, ListItemsResult>> {
  if (Object.keys(requests).length === 0) return {};
  const reply = await hass.connection.sendMessagePromise<{
    results: Record<string, ListItemsResult>;
  }>({ type: `${D}/list_items`, requests });
  return reply.results;
}

/** The list fetches one document needs, keyed the way the reply comes back and
 * the way the resolver reads it. `signature` is the question as text, so a
 * caller can tell a changed question from the same one asked again. */
export function listItemsRequests(cfg: CustomComplicationConfig): {
  requests: Record<string, ListRequestSpec>;
  signature: string;
} {
  const requests: Record<string, ListRequestSpec> = {};
  for (const [key, spec] of listRequests(cfg)) requests[key] = spec;
  return { requests, signature: JSON.stringify(requests) };
}

/** Folds the command's results into the Map the resolver reads. A failed key
 * lands nowhere, so that list keeps whatever it had rather than blanking every
 * time one calendar is slow. The stored text is the reply as the watch caches
 * it, which is the one shape `parseListItems` reads. */
export function collectListResults(results: Record<string, ListItemsResult>): Map<string, string> {
  const out = new Map<string, string>();
  for (const [key, result] of Object.entries(results)) {
    if (!result.ok) continue;
    out.set(key, JSON.stringify({ items: result.items, total: result.total }));
  }
  return out;
}

/** Both commands' request bodies for one document, keyed as the resolver
 * reads the answers. `keep` leaves out entities not worth asking about: the
 * import preview drops the `sensor.shared_1` placeholders nobody has answered,
 * since the recorder has nothing for an id that is not in this house.
 * `signature` is the pair as text, so a caller can tell a changed question
 * from the same one asked again. */
export function seriesRequests(
  cfg: CustomComplicationConfig,
  keep: (entityId: string) => boolean = () => true,
): { history: Record<string, HistorySeriesRequest>; statistics: Record<string, StatisticsSeriesRequest>; signature: string } {
  const history: Record<string, HistorySeriesRequest> = {};
  for (const r of chartHistoryRequests(cfg)) if (keep(r.entityId)) history[r.key] = historySeriesRequest(r);
  const statistics: Record<string, StatisticsSeriesRequest> = {};
  for (const r of chartStatisticsRequests(cfg)) if (keep(r.entityId)) statistics[r.key] = statisticsSeriesRequest(r);
  return { history, statistics, signature: JSON.stringify([history, statistics]) };
}
