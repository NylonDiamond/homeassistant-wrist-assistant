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
  entities?: Record<string, { area_id?: string | null; device_id?: string | null; entity_category?: string | null; hidden?: boolean }>;
  devices?: Record<string, { area_id?: string | null; name?: string | null }>;
  areas?: Record<string, { name?: string | null }>;
  user?: { id?: string; is_admin?: boolean; name?: string };
  /** The frontend's services by domain, then by name: the voice engine list
      reads `tts.<platform>_say` from it. Optional, as the registries are. */
  services?: Record<string, Record<string, unknown>>;
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
  /** False while this watch takes its watch settings and notification style
      from another home, its main house: a watch with several homes says so
      on every config read it sends any other. Absent from integrations older
      than the field and from the Library and orphan rows; anything but
      `false` means this home is the main house. */
  main_house?: boolean | null;
  /** True when an iPhone may still move this watch's own setup into Home
      Assistant: the old phone link set the watch up, so it names the iPhone
      that paired it, and its key did not come from a pairing code. Another
      iPhone of the watch's user does not count. The phone's one-time move sends a
      kind only while Home Assistant holds none, so the watch editors wait
      for it rather than offer a start over it (`noRecordStart`). False on a
      phone, absent from the Library row and from integrations older than the
      field. */
  has_iphone?: boolean | null;
  /** The Home Assistant user this device is bound to (a watch through its
      paired iPhone when its own key predates binding), null when none.
      Absent from the Library and orphan rows and from integrations older
      than the field. `haPeople` turns it into a person. */
  user_id?: string | null;
  /** Whether a watch holds a long-poll on this server right now. Never true
      for a phone. Absent where `user_id` is. */
  polling?: boolean;
  /** Seconds since a watch last polled, or a phone last pulled, when the
      list was read. Null when it has not since the server started. */
  last_seen_seconds?: number | null;
  /** How many designs the device's next pull brings. Null before its first
      ack. */
  pending_changes?: number | null;
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

/** A Browse card's picture of one record, as the list names it: which shape
 * on which device, and the size it was drawn at. The PNG itself comes from
 * `fetchCardPreview`. `focus` is a corner's disc within its quadrant. */
export interface CardPreview {
  revision: number;
  family: "rectangular" | "circular" | "corner" | "small" | "medium" | "large" | "xlarge";
  device: "watch" | "iphone";
  width: number;
  height: number;
  focus?: { cx: number; cy: number; diameter: number };
  /** How the panel drew it (`CARD_PREVIEW_VERSION`). Absent is version 1. */
  version?: number;
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
    /** The current card picture of each record that has one, by record id.
     * Absent from integrations older than the field. */
    previews?: Record<string, CardPreview>;
  }>({ type: `${D}/list`, owner_watch_id: owner });
}

/** Keep the card picture of one revision of one record. `stale` means the
 * record moved on while the picture was being drawn. */
export async function saveCardPreview(
  hass: HassLike,
  owner: string,
  id: string,
  revision: number,
  png: string,
  meta: Omit<CardPreview, "revision">,
) {
  return hass.connection.sendMessagePromise<
    { ok: true; preview: CardPreview } | { ok: false; error: "stale"; revision: number }
  >({ type: `${D}/preview_save`, owner_watch_id: owner, complication_id: id, revision, png, meta });
}

/** The PNG of one record's card picture, as base64. Fails when the preview
 * held is of another revision. */
export async function fetchCardPreview(hass: HassLike, owner: string, id: string, revision: number) {
  return hass.connection.sendMessagePromise<{ revision: number; png: string }>({
    type: `${D}/preview_get`, owner_watch_id: owner, complication_id: id, revision,
  });
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

/** Give one device the name Home Assistant shows for it, the same rename as
 * on its page in Settings, Devices. Null drops the rename, so the name the
 * device reports shows again. Admin only, as the registry commands are. */
export async function renameDevice(hass: HassLike, watchId: string, name: string | null) {
  const devices = await hass.connection.sendMessagePromise<{ id: string; identifiers: [string, string][] }[]>({
    type: "config/device_registry/list",
  });
  const device = devices.find((d) => d.identifiers.some(([domain, id]) => domain === "wrist_assistant" && id === `watch_${watchId}`));
  if (device === undefined) throw new Error("Home Assistant has no device entry for it");
  await hass.connection.sendMessagePromise({ type: "config/device_registry/update", device_id: device.id, name_by_user: name });
}

/** Remove one device from this home: its pairing, its push token and its
 * watch setup go, and its designs move to the Library. Always forced: the
 * panel asks first, and every device in use still holds a token or a design,
 * which is what the server's own check refuses without force. */
export async function forgetDevice(hass: HassLike, watchId: string) {
  return hass.connection.sendMessagePromise<{
    ok: boolean;
    watch_id: string;
    device_removed: boolean;
    complications_moved_to_library: number;
  }>({ type: "wrist_assistant/devices/forget", watch_id: watchId, force: true });
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

/** The kinds of watch config Home Assistant keeps a copy of. The panel reads
 * all of them and saves every one but `catalog` (`WatchConfigPanelKind`).
 * `catalog` is the iPhone's list of its HTTP actions and status pages
 * (an older phone lists its macros too, which the panel does not read): the
 * phone publishes it and the server refuses a panel save or
 * restore of it. `menus` (the Anywhere menu, the Entity quick menu and the
 * page switcher) and `status_pages` (the watch's own status pages) are
 * refused as `invalid` by an integration older than them. */
export type WatchConfigKind = "pages" | "behavior" | "catalog" | "menus" | "voice" | "status_pages"
  // The watch's notification style, sounds and delivery route, edited in
  // Watch settings beside `behavior`. Refused as `invalid` by an integration
  // older than the kind.
  | "notification_style"
  // The watch's Control Center list, the entities its Toggle and Action
  // controls offer. Refused as `invalid` by an integration older than the
  // kind.
  | "control_center"
  // The rooms of a home that is not the watch's main house, which keeps no
  // `behavior` of its own there. Refused as `invalid` by an integration older
  // than the kind.
  | "rooms";

/** The kinds the panel may save and restore. */
export type WatchConfigPanelKind = Exclude<WatchConfigKind, "catalog">;

/** One watch's stored config of one kind, as the get command answers.
 * `revision` 0 with no `document` is a watch nothing has stored that kind
 * for yet (no iPhone upload and no panel start). `delivered_revision` is the
 * newest revision a device is known to hold: an iPhone upload counts, a
 * panel save does not until the watch's own pull or the iPhone's next check
 * collects it. `updated_by` is `panel` for a panel save, else the watch id
 * the device signed with. */
export interface WatchConfigRecord {
  kind: string;
  revision: number;
  hash: string | null;
  updated_at: string | null;
  updated_by: string | null;
  delivered_revision: number;
  delivered_at: string | null;
  /** The revision the phone fetched and could not decode, 0 when none. When
   * it equals `revision`, the stored copy is one the phone cannot use. Absent
   * from integrations older than the field. */
  rejected_revision?: number;
  /** When the phone said so. Null or absent when it never has. */
  rejected_at?: string | null;
  document?: Record<string, unknown>;
}

const PAIR = "wrist_assistant/pair";

/** A pairing request a watch is waiting on, as `pair/lookup` finds it by its
 * code. `expires_in` is in seconds. */
export interface PairLookupFound {
  found: true;
  watch_id: string;
  /** What asked: a watch, or an iPhone showing a code. Missing from an
      integration before iPhones paired by code, when only a watch could. */
  kind?: "watch" | "iphone";
  device_name?: string | null;
  screen_size?: string | null;
  app_version?: string | null;
  app_build?: string | null;
  expires_in: number;
  /** The watch already has a key here; pairing again gives it a new one. */
  already_paired: boolean;
  /** The watch's key was made by another Home Assistant user. */
  paired_by_other_user: boolean;
  /** The address the watch's pairing request came from, null when Home
      Assistant could not tell. Missing from an integration before it. */
  remote?: string | null;
  /** How long ago the watch asked, in seconds. */
  age_seconds?: number;
  /** The Home Assistant user the watch is bound to now, null when it is new
      or unbound. Missing from an integration whose confirm takes no
      `user_id`, which is how the panel knows not to offer the choice. */
  bound_user_id?: string | null;
  /** The confirm will want `replace: true` / `allow_remote: true`. The
      server's own reading, which also knows a request through Home
      Assistant Cloud is remote. Missing from an older integration. */
  needs_replace?: boolean;
  needs_allow_remote?: boolean;
}

export type PairLookup = PairLookupFound | { found: false };

/** `new` paired a watch for the first time, `rekey` gave a paired watch a new
 * key, `idempotent` found the same key already in place. */
export type PairResult = "new" | "rekey" | "idempotent";

export interface PairConfirmReply {
  ok: true;
  watch_id: string;
  device_name?: string | null;
  result: PairResult;
  /** The user the watch was bound to. Missing from an older integration. */
  user_id?: string | null;
}

/** One Home Assistant user, as `config/auth/list` reports it. Only the fields
 * the pairing card reads. */
export interface HaUser {
  id: string;
  name?: string | null;
  username?: string | null;
  is_active?: boolean;
  system_generated?: boolean;
  /** The owner is an administrator whatever their groups. */
  is_owner?: boolean;
  /** `system-admin` makes an administrator, `system-users` a user. */
  group_ids?: string[];
}

/** Every Home Assistant user. Home Assistant's own command, admin only. */
export async function listHaUsers(hass: HassLike) {
  return hass.connection.sendMessagePromise<HaUser[]>({ type: "config/auth/list" });
}

/** Find the pairing request a watch shows `code` for. Admin only. An
 * unknown or expired code answers `{found: false}`, not an error. */
export async function lookupPairCode(hass: HassLike, code: string) {
  return hass.connection.sendMessagePromise<PairLookup>({ type: `${PAIR}/lookup`, code });
}

/** Pair the device that shows `code`, for the Home Assistant user `userId`,
 * or for the signed in administrator when it is undefined (the only form an
 * integration from before the choice accepts). `replace` and `allowRemote`
 * are the card's ticked boxes, sent only when ticked so an older integration
 * never sees a key it does not know. A refusal rejects with a WebSocket error
 * whose `code` is `unknown_code` (unknown or expired), `unavailable` (the
 * integration is not ready), `invalid_user` (no such user, a deactivated
 * one, or one Home Assistant made for itself), `needs_replace` (the device
 * is paired already, or by another user, and Replace was not ticked),
 * `needs_allow_remote` (the request came from a public address and the box
 * owning up to it was not ticked), `invalid_secret` or another of the secret
 * checks. */
export async function confirmPairCode(
  hass: HassLike,
  code: string,
  userId?: string,
  opts: { replace?: boolean; allowRemote?: boolean } = {},
) {
  return hass.connection.sendMessagePromise<PairConfirmReply>({
    type: `${PAIR}/confirm`,
    code,
    ...(userId === undefined ? {} : { user_id: userId }),
    ...(opts.replace === true ? { replace: true } : {}),
    ...(opts.allowRemote === true ? { allow_remote: true } : {}),
  });
}

/** A QR code offer, as `pair/offer` makes it. `url` is what the QR code
 * holds, `wristassistant://pair#...`, and `expires_in` is in seconds. */
export interface PairOffer {
  offer_id: string;
  url: string;
  expires_in: number;
}

/** Where an offer has got to. A redeemed one names the iPhone and the user it
 * was paired for. */
export interface PairOfferStatus {
  state: "open" | "redeemed" | "expired";
  device_name?: string | null;
  user_id?: string | null;
  /** The paired iPhone's id, which is its owner id. Absent from
      integrations older than the field. */
  device_id?: string | null;
}

/** Make a QR code an iPhone can pair with, for `userId` (the signed in
 * administrator when undefined). `replace` lets it take over an iPhone
 * paired for another user. Admin only. An integration from before QR
 * pairing rejects with `unknown_command`. */
export async function offerPairQr(hass: HassLike, userId?: string, replace = false) {
  return hass.connection.sendMessagePromise<PairOffer>({
    type: `${PAIR}/offer`,
    ...(userId === undefined ? {} : { user_id: userId }),
    ...(replace ? { replace: true } : {}),
  });
}

/** Ask whether an iPhone has used the offer yet. */
export async function pairOfferStatus(hass: HassLike, offerId: string) {
  return hass.connection.sendMessagePromise<PairOfferStatus>({ type: `${PAIR}/offer_status`, offer_id: offerId });
}

/** Withdraw an offer nobody used, so its QR code stops working at once. */
export async function cancelPairOffer(hass: HassLike, offerId: string) {
  return hass.connection.sendMessagePromise<unknown>({ type: `${PAIR}/offer_cancel`, offer_id: offerId });
}

const CLIENT_CERT = "wrist_assistant/client_certificate";

/** The signed in user's client certificate (mTLS), as every
 * `client_certificate/*` command answers. One per Home Assistant user; that
 * user's watches and iPhone read it. Only a fingerprint ever comes back, never
 * the certificate itself. */
export interface ClientCertificateStatus {
  present: boolean;
  fingerprint: string | null;
  updated_at: string | null;
  revision: number;
  /** Who stored the record, or removed it. Null when the user never had one. */
  source: "panel" | "iphone" | null;
}

/** The signed in user's certificate, or that there is none. An integration
 * from before the panel kept certificates rejects with `unknown_command`. */
export async function fetchClientCertificate(hass: HassLike) {
  return hass.connection.sendMessagePromise<ClientCertificateStatus>({ type: `${CLIENT_CERT}/status` });
}

/** Store a `.p12` (base64) and its passphrase, which may be empty, as the
 * signed in user's certificate, over any held. Refusals: `invalid_pkcs12`
 * (not a .p12 file), `bad_passphrase`, `too_large` (over 32 KiB), and the
 * generic ones. */
export async function putClientCertificate(hass: HassLike, pkcs12: string, passphrase: string) {
  return hass.connection.sendMessagePromise<ClientCertificateStatus>({ type: `${CLIENT_CERT}/put`, pkcs12, passphrase });
}

/** Remove the signed in user's certificate. */
export async function deleteClientCertificate(hass: HassLike) {
  return hass.connection.sendMessagePromise<ClientCertificateStatus>({ type: `${CLIENT_CERT}/delete` });
}

const WC = "wrist_assistant/watch_config";

/** Admin only. */
export async function fetchWatchConfig(hass: HassLike, owner: string, kind: WatchConfigKind) {
  return hass.connection.sendMessagePromise<WatchConfigRecord>({ type: `${WC}/get`, owner_watch_id: owner, kind });
}

/** Where one record has got to: the copy Home Assistant holds, the newest a
 * device is known to hold, and the newest a device could not read. */
export interface WatchConfigDelivery {
  revision: number;
  delivered_revision: number;
  rejected_revision: number;
  /** How many items the record lists, on the pages, status pages and Control
   * Center kinds only. Absent from integrations older than the field. */
  items?: number;
}

/** Every watch's panel-written records by kind, numbers only. A kind with no
 * record is absent, and so is a watch whose stored file could not be read.
 * `http_actions` is the home's one HTTP action library: its revision, and
 * the last revision each device pulled. Absent from an integration older
 * than the library. */
export interface WatchConfigSummary {
  owners: Record<string, Record<string, WatchConfigDelivery>>;
  http_actions?: HttpActionsDelivery;
}

/** Admin only. One answer for every watch, no documents: what Home asks in
 * place of a read per kind per watch. An integration older than the command
 * rejects with the code `unknown_command`. */
export async function fetchWatchConfigSummary(hass: HassLike) {
  return hass.connection.sendMessagePromise<WatchConfigSummary>({ type: `${WC}/summary` });
}

/** Save one watch's config of one kind, compare-and-swap on `baseRevision`.
 * Admin only. A record has three parties: the iPhone mirror writes it, the
 * panel writes it here, and the watch reads it with its own signed pull. A
 * refusal rejects with a WebSocket error whose `code` is `conflict` (someone
 * saved since; the message starts "stored revision is N"), `no_record`
 * (nothing is stored to save over, or the watch is not paired for a
 * create), `invalid` or `unavailable`. An integration older than page saves
 * answers `invalid` for `pages`. A save over `baseRevision` 0 creates the
 * record (revision 1) when none is stored and the watch is paired; an
 * unpaired watch gets `no_record`, a stored record `conflict`. */
export async function saveWatchConfig(
  hass: HassLike,
  owner: string,
  kind: WatchConfigPanelKind,
  baseRevision: number,
  document: Record<string, unknown>,
) {
  return hass.connection.sendMessagePromise<{ revision: number }>({
    type: `${WC}/save`,
    owner_watch_id: owner,
    kind,
    base_revision: baseRevision,
    document,
  });
}

/** One earlier save of a watch config, as the history list names it. No
 * document: `fetchWatchConfigHistoryEntry` reads the one that is wanted.
 * `size` is the document's size in bytes as the store measured it. */
export interface WatchConfigHistoryEntry {
  revision: number;
  hash: string | null;
  updated_at: string | null;
  updated_by: string | null;
  size: number;
}

/** The kept earlier saves of one kind, newest first. Admin only. An
 * integration older than the command rejects with code `unknown_command`. */
export async function fetchWatchConfigHistory(hass: HassLike, owner: string, kind: WatchConfigKind) {
  return hass.connection.sendMessagePromise<{ entries: WatchConfigHistoryEntry[] }>({
    type: `${WC}/history`,
    owner_watch_id: owner,
    kind,
  });
}

/** One earlier save with its document. Admin only. Rejects with `not_found`
 * when the store no longer keeps that revision. */
export async function fetchWatchConfigHistoryEntry(hass: HassLike, owner: string, kind: WatchConfigKind, revision: number) {
  return hass.connection.sendMessagePromise<{
    revision: number;
    hash: string | null;
    updated_at: string | null;
    updated_by: string | null;
    document: Record<string, unknown>;
  }>({ type: `${WC}/history_entry`, owner_watch_id: owner, kind, revision });
}

/** Save an earlier revision again as a new revision, by `panel`. The same
 * conflict rule and shape guard as a save: `baseRevision` is the revision on
 * screen, so a save that landed since comes back as `conflict`, and a
 * revision the store no longer keeps as `not_found`. Admin only. */
export async function restoreWatchConfig(
  hass: HassLike,
  owner: string,
  kind: WatchConfigPanelKind,
  revision: number,
  baseRevision: number,
) {
  return hass.connection.sendMessagePromise<{ revision: number }>({
    type: `${WC}/restore`,
    owner_watch_id: owner,
    kind,
    revision,
    base_revision: baseRevision,
  });
}

/** What the live line says when a watch's stored config changes: which kind,
 * and its revision now (0 when it was removed). Never the document. */
export interface WatchConfigChangeEvent {
  kind: string;
  revision: number;
}

/** Hear every accepted save of one watch's config, whoever made it. The
 * promise gives the function that ends the subscription. */
export function subscribeWatchConfig(
  hass: HassLike,
  owner: string,
  callback: (event: WatchConfigChangeEvent) => void,
) {
  return hass.connection.subscribeMessage<WatchConfigChangeEvent>(callback, {
    type: `${WC}/subscribe`,
    owner_watch_id: owner,
  });
}

const HA_ACTIONS = "wrist_assistant/http_actions";

/** The home's HTTP action library as the phone writes it: `actions` and
 * `globalVariables`, every key kept as it came. */
export interface HttpActionsDocument {
  schemaVersion?: number;
  actions?: unknown[];
  globalVariables?: unknown[];
  [key: string]: unknown;
}

/** Where the library has got to: the revision Home Assistant holds (0 when
 * none yet) and, by owner id, the last revision each device pulled. */
export interface HttpActionsDelivery {
  revision: number;
  delivered: Record<string, number>;
}

/** The library as the get command answers. `document` is absent at
 * revision 0. `handed_over` lists the owners whose phone gave its library
 * once. `updated_by` is `panel` for a save here, else the owner that handed
 * a library over. */
export interface HttpActionsRecord extends HttpActionsDelivery {
  hash: string | null;
  updated_at: string | null;
  updated_by: string | null;
  handed_over: string[];
  document?: HttpActionsDocument;
}

/** Admin only. An integration older than the library rejects with the code
 * `unknown_command`. */
export async function fetchHttpActions(hass: HassLike) {
  return hass.connection.sendMessagePromise<HttpActionsRecord>({ type: `${HA_ACTIONS}/get` });
}

/** Save the library, compare-and-swap on `baseRevision` (0 creates it). A
 * refusal rejects with a WebSocket error whose `code` is `conflict` (the
 * message starts "stored revision is N"), `invalid` (the message says what)
 * or `unavailable`. Admin only. */
export async function saveHttpActions(hass: HassLike, baseRevision: number, document: HttpActionsDocument) {
  return hass.connection.sendMessagePromise<{ revision: number }>({
    type: `${HA_ACTIONS}/save`,
    base_revision: baseRevision,
    document,
  });
}

/** One JSON path the test found in a reply body, with its value as text. */
export interface HttpActionTestPath {
  path: string;
  value: string;
}

/** What a test run answers. `status` is null when no answer came, and then
 * `error` says why. `headers` are the answer's, `paths` the JSON paths found
 * in its body (empty for a body that is not JSON). */
export interface HttpActionTestReply {
  status: number | null;
  value: string | null;
  snippet: string;
  error: string | null;
  headers: Record<string, string>;
  paths: HttpActionTestPath[];
  elapsed_ms: number;
  /** The whole text that was read, as sent (empty when it is not text). An
   * integration older than the response formats sends none of these four. */
  body?: string;
  body_size?: number;
  body_binary?: boolean;
  /** The read stopped at Home Assistant's size limit. */
  body_cut?: boolean;
  /** Every JSON leaf of the body with the value a JSON path to it reads
   * (`paths` lists only the first item of each list). */
  leaves?: HttpActionTestPath[];
  /** The list of leaves stopped at its limit. */
  leaves_cut?: boolean;
}

/** Send one action from Home Assistant without saving it: the draft action,
 * the draft globals, and a value for each prompt by key. Admin only. */
export async function testHttpAction(
  hass: HassLike,
  action: Record<string, unknown>,
  globalVariables: unknown[],
  values: Record<string, string>,
) {
  return hass.connection.sendMessagePromise<HttpActionTestReply>({
    type: `${HA_ACTIONS}/test`,
    action,
    global_variables: globalVariables,
    values,
  });
}

const CAMERAS = "wrist_assistant/cameras";

/** A camera's crop for alert pictures, as fractions of the full frame. */
export interface CameraViewport {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** One camera as the list command answers: the device's representative
 * entity, every entity of that device (a crop is written to all of them),
 * its crop (null for the full frame), whether the watch opens its live view
 * zoomed to the crop, and which stream a tap on the alert's picture opens:
 * the override set here, or else the one Home Assistant detects. */
export interface CameraFraming {
  entity_id: string;
  name: string;
  all_entity_ids: string[];
  viewport: CameraViewport | null;
  open_zoomed: boolean;
  stream: { override: string | null; auto: string | null };
  stream_choices: string[];
}

/** Every camera in the home with its framing. Admin only. An integration
 * older than the command rejects with the code `unknown_command`. */
export async function fetchCameras(hass: HassLike) {
  return hass.connection.sendMessagePromise<{ cameras: CameraFraming[] }>({ type: `${CAMERAS}/list` });
}

/** What a save sends: the entities to write, the crop (null or the full
 * frame clears it), and, when given, the zoomed live view and the stream
 * override (null clears it; left out, it stays as it is). */
export interface CameraFramingSave {
  entity_ids: string[];
  viewport: CameraViewport | null;
  open_zoomed?: boolean;
  stream_entity?: string | null;
}

/** Save one camera's framing. Rejects with a WebSocket error whose code is
 * `invalid`, `unavailable` or `failed`. Admin only. */
export async function saveCameraFraming(hass: HassLike, save: CameraFramingSave) {
  return hass.connection.sendMessagePromise<{ ok: true; count: number }>({ type: `${CAMERAS}/save`, ...save });
}

/** What a test alert answers: how many devices it went to, and when none,
 * why (`no_devices`, `no_push_token`, or the server's own words). */
export interface CameraTestReply {
  ok: boolean;
  sent: number;
  reason?: string;
}

/** Send a real alert with this camera's picture to the signed in person's
 * devices. Admin only. */
export async function sendCameraTest(hass: HassLike, camera: string, title?: string, message?: string) {
  return hass.connection.sendMessagePromise<CameraTestReply>({
    type: `${CAMERAS}/test`,
    camera,
    ...(title === undefined ? {} : { title }),
    ...(message === undefined ? {} : { message }),
  });
}

/** The voices a watch reported it has installed (`watch_voices_put`), for
 * the voice editor's Watch voice picker: each `{id, name, language,
 * quality}`, and when they came (null when the watch never sent any). Not a
 * watch config record: no revision, no history. Admin only. An integration
 * older than it does not know the command. */
export async function fetchWatchVoices(hass: HassLike, watchId: string) {
  return hass.connection.sendMessagePromise<{
    voices: { id: string; name: string; language: string; quality: number }[];
    updated_at: string | null;
  }>({ type: "wrist_assistant/watch_voices/get", watch_id: watchId });
}

const PAGE_IMAGES = "wrist_assistant/page_images";

/** A built-in page photo, shipped in the integration. */
export interface PageImagePreset {
  id: string;
  name: string;
  width: number;
  height: number;
}

/** A photo of the home's page photo library. `used_by` lists the owners
 * whose saved pages name it. */
export interface PageImageEntry {
  id: string;
  width: number;
  height: number;
  bytes: number;
  added_at: string;
  used_by: string[];
}

/** The built-in photos in the phone's order, then the library, newest
 * first. Admin only. An integration older than the photo store rejects with
 * the code `unknown_command`. */
export async function listPageImages(hass: HassLike) {
  return hass.connection.sendMessagePromise<{ presets: PageImagePreset[]; images: PageImageEntry[] }>({ type: `${PAGE_IMAGES}/list` });
}

/** One photo's JPEG as base64. Built-in ids work too. Refused `not_found`
 * when the store has no such photo. Admin only. */
export async function fetchPageImage(hass: HassLike, imageId: string) {
  return hass.connection.sendMessagePromise<{ image_id: string; content_type: string; data: string }>({
    type: `${PAGE_IMAGES}/get`,
    image_id: imageId,
  });
}

/** Store a JPEG (base64). The reply names the new photo, or the stored one
 * with the same bytes. Refusals: `invalid`, `too_large`, `full`,
 * `unavailable`. Admin only. */
export async function uploadPageImage(hass: HassLike, data: string) {
  return hass.connection.sendMessagePromise<{ image_id: string; width: number; height: number; bytes: number }>({
    type: `${PAGE_IMAGES}/upload`,
    data,
  });
}

/** Delete a photo of the library. Refused `in_use` while a saved page names
 * it, `invalid` for a built-in id. Admin only. */
export async function deletePageImage(hass: HassLike, imageId: string) {
  return hass.connection.sendMessagePromise<unknown>({ type: `${PAGE_IMAGES}/delete`, image_id: imageId });
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

/** One config entry as Home Assistant's `config_entries/get` lists it. Only
 * the fields the panel reads are typed; the rest pass through. */
export interface HassConfigEntry {
  entry_id: string;
  domain: string;
  title?: string;
  /** `loaded`, `setup_error`, `not_loaded` and the rest. */
  state?: string;
  disabled_by?: string | null;
  [key: string]: unknown;
}

/** Home Assistant's own config entries of one integration, in any state.
 * Asked by `domain` alone: adding `type_filter` hides entries Home
 * Assistant files under another type (measured on 2026.9: Music Assistant's
 * one entry came back only without it). Admin only. */
export async function fetchConfigEntries(hass: HassLike, domain: string): Promise<HassConfigEntry[]> {
  return hass.connection.sendMessagePromise<HassConfigEntry[]>({ type: "config_entries/get", domain });
}

/** Home Assistant Cloud's status as `cloud/status` answers it. Only the two
 * fields the panel reads are typed: `logged_in`, and `cloud`, the link's
 * state (`connected`, `connecting`, `disconnected`), which is there only
 * while logged in. Everything else (account, preferences, certificates)
 * passes through untouched and is never kept. */
export interface HassCloudStatus {
  logged_in: boolean;
  cloud?: string;
  [key: string]: unknown;
}

/** Ask Home Assistant Cloud's status. Rejects when the cloud integration is
 * not loaded (`unknown_command`). */
export async function fetchCloudStatus(hass: HassLike): Promise<HassCloudStatus> {
  return hass.connection.sendMessagePromise<HassCloudStatus>({ type: "cloud/status" });
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
