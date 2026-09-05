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
  user?: { is_admin?: boolean; name?: string };
  language?: string;
  /** The frontend's theme state; `darkMode` is what the panel's dark skin keys off. */
  themes?: { darkMode?: boolean };
}

import type { OccupiedSlot } from "./model.js";

export interface OwnerSummary {
  owner_watch_id: string;
  device_name: string | null;
  /** Name of the iPhone this watch is paired to. Both real watches report
      themselves as "Apple Watch", so this is what tells them apart. */
  paired_iphone_name: string | null;
  app_version: string | null;
  /** Screen size in points ("208x248"), reported by the watch app. Matches a
      renderer `WatchCase` so the preview dropdown defaults to this watch. */
  screen_size: string | null;
  complication_count: number;
  token: number;
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
    /** The store token the watch last said it applied (0 = never). Equal to
     * `token` means everything here is on the wrist. Absent from older
     * integrations, where "Send to watch" is not offered. */
    applied_token?: number;
    /** Whether the watch holds a long-poll on this server right now. */
    polling?: boolean;
    /** Watch-app pages (id + name, watch order), per its last sync report. */
    pages?: { id: string; name: string }[];
    records: ComplicationRecord[];
  }>({ type: `${D}/list`, owner_watch_id: owner });
}

/** "Send to watch": wake the watch's parked long-poll so it is handed the
 * current token again. Changes nothing in the store. */
export async function nudgeWatch(hass: HassLike, owner: string) {
  return hass.connection.sendMessagePromise<{
    polling: boolean;
    token: number;
    applied_token: number;
  }>({ type: `${D}/nudge`, owner_watch_id: owner });
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
