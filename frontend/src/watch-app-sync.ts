// Whether a watch still has watch app records to pick up, for Home's Devices
// card: its pages, menus, status pages, Control Center list, settings (Rooms
// writes the same record on the main house), a second home's own rooms,
// notification style and voice, and the home's HTTP actions.
//
// Each of these is a watch config record, and each record carries its own
// delivery state: `revision` is the copy Home Assistant holds, and
// `delivered_revision` the newest one a device is known to hold (the watch's
// own pull). The editors' sync pills and Watch
// settings' "Collected" read the same two numbers (`deliveryState`).
//
// `watch_config/summary` answers those numbers for every watch at once, with
// no documents, so Home asks one question however many watches and pages a
// home has (`summaryWatchAppSyncs`). It is asked when Home is entered rather
// than kept live. An integration older than that command is read the old
// way, one `watch_config/get` per kind per watch (`readWatchAppSync`), where
// a kind the integration refuses counts as no record.
//
// HTTP actions are one library for the whole home, not a watch config kind:
// the summary carries its revision and, per device, the last revision that
// device pulled (`http_actions`). A watch behind a revision above 0 waits
// for it. An integration older than the library leaves the key out, and the
// old per-kind reads never see it, so then it counts for neither side.
//
// The complication part of a device's verdict stays `deviceSync`
// (send-state.ts), and the header pill (`homeSync`) stays about
// complications only. Home's row takes the worse of the two.

import type { HttpActionsDelivery, WatchConfigPanelKind, WatchConfigRecord, WatchConfigSummary } from "./ha-api.js";
import type { DeviceSync } from "./send-state.js";
import { deliveryState, rejectedNow } from "./watch-settings.js";

/** One watch app record, named the way Home's note names it. */
export interface WatchAppPart {
  kind: WatchConfigPanelKind;
  label: string;
}

/** Every kind the panel writes for the watch app, in the order the watch row
 * lists the screens, settings and its notification style after them. The
 * phone's catalog is left out: only the phone writes it, so it never waits
 * for the watch. */
export const WATCH_APP_PARTS: readonly WatchAppPart[] = [
  { kind: "pages", label: "pages" },
  { kind: "menus", label: "menus" },
  { kind: "status_pages", label: "status pages" },
  { kind: "control_center", label: "Control Center" },
  { kind: "voice", label: "voice" },
  { kind: "behavior", label: "settings" },
  // Only a home that is not the watch's main house keeps this record.
  { kind: "rooms", label: "rooms" },
  { kind: "notification_style", label: "notification style" },
];

/** How Home's note names the HTTP action library. */
export const HTTP_ACTIONS_PART_LABEL = "HTTP actions";

/** The part the library is named after, as the watch row lists HTTP actions
 * after Voice. */
const HTTP_ACTIONS_AFTER: WatchConfigPanelKind = "voice";

/** Where one watch's watch app records have got to. */
export interface WatchAppSync {
  /** The parts a device has not collected yet, by label, in part order. */
  waiting: string[];
  /** A device has collected at least one record: the watch has synced
   * something, even with no complication at all. */
  delivered: boolean;
  /** The parts whose stored save the watch reported it could not use
   * (`rejectedNow`), by label, in part order. Absent when there are none. */
  rejected?: string[];
}

type Delivery = Pick<WatchConfigRecord, "revision" | "delivered_revision" | "rejected_revision">;

/** The verdict over the records read, by kind, and the HTTP action library
 * when it is known (`httpActions`). A kind with no record (or none read),
 * and a library at revision 0, count for neither side. A record the watch
 * could not use is listed in `rejected` as well; it still counts as
 * collected, since the watch did fetch it. */
export function watchAppSync(records: ReadonlyMap<string, Delivery | undefined>, httpActions?: Delivery): WatchAppSync {
  const waiting: string[] = [];
  const rejected: string[] = [];
  let delivered = false;
  const count = (record: Delivery | undefined, label: string) => {
    const state = deliveryState(record);
    if (state === "waiting") waiting.push(label);
    else if (state === "delivered") delivered = true;
    if (rejectedNow(record)) rejected.push(label);
  };
  for (const part of WATCH_APP_PARTS) {
    count(records.get(part.kind), part.label);
    if (part.kind === HTTP_ACTIONS_AFTER) count(httpActions, HTTP_ACTIONS_PART_LABEL);
  }
  return rejected.length === 0 ? { waiting, delivered } : { waiting, delivered, rejected };
}

/** One device's place in the library: the revision Home Assistant holds and
 * the last one that device pulled (0 when it never has). Undefined when the
 * summary says nothing of the library. */
export function httpActionsDeliveryFor(httpActions: HttpActionsDelivery | undefined, ownerId: string): Delivery | undefined {
  if (typeof httpActions !== "object" || httpActions === null || typeof httpActions.revision !== "number") return undefined;
  const got = httpActions.delivered?.[ownerId];
  return { revision: httpActions.revision, delivered_revision: typeof got === "number" ? got : 0 };
}

/**
 * The verdict for each watch asked about, from the one summary answer. A
 * watch the summary leaves out but which is still asked about has no stored
 * records at all (never paired here, or nothing written yet): nothing
 * waiting, nothing collected. The summary also leaves out a watch whose file
 * could not be read, and that reads the same way: a rare fault the editors
 * themselves report when opened.
 */
export function summaryWatchAppSyncs(summary: WatchConfigSummary, watchIds: readonly string[]): Map<string, WatchAppSync> {
  const out = new Map<string, WatchAppSync>();
  for (const id of watchIds) {
    const kinds = summary.owners[id] ?? {};
    out.set(id, watchAppSync(new Map(Object.entries(kinds)), httpActionsDeliveryFor(summary.http_actions, id)));
  }
  return out;
}

/** Whether a refused summary means the integration is older than the command,
 * which is the one refusal the per-kind reads can stand in for. */
export function summaryUnknown(err: unknown): boolean {
  return typeof err === "object" && err !== null && (err as { code?: unknown }).code === "unknown_command";
}

/**
 * Read one watch's records, every kind side by side, and give their verdict.
 * Only for an integration with no summary command.
 * A refused read counts as no record. Undefined when every read failed: the
 * panel cannot tell (a watch it may not read, the integration not ready, the
 * connection gone), so Home says nothing about the watch app rather than
 * calling it fine.
 */
export async function readWatchAppSync(read: (kind: WatchConfigPanelKind) => Promise<Delivery>): Promise<WatchAppSync | undefined> {
  const replies = await Promise.allSettled(WATCH_APP_PARTS.map((part) => read(part.kind)));
  if (replies.every((r) => r.status === "rejected")) return undefined;
  const records = new Map<string, Delivery | undefined>();
  WATCH_APP_PARTS.forEach((part, i) => {
    const reply = replies[i]!;
    records.set(part.kind, reply.status === "fulfilled" ? reply.value : undefined);
  });
  return watchAppSync(records);
}

/** One device's verdict on Home: the worse of its complications and, on a
 * watch, its watch app, with what it is waiting for. */
export interface DeviceVerdict {
  sync: DeviceSync;
  /** "complications" first when they wait, then the watch app's parts. */
  waitingFor: string[];
  /** The watch app's parts whose last save the watch could not use. Absent
   * when there are none. */
  rejected?: string[];
}

/**
 * Waiting when either side waits. Synced when nothing waits and the device
 * has collected something on either side. Otherwise idle: nothing waiting,
 * and nothing ever collected. Without a watch app reading (a phone, or a
 * watch whose records could not be read) the complications decide alone.
 * A save the watch could not use rides along as `rejected`; Home then says
 * so in place of "Synced" (`homeDeviceLabel`).
 */
export function deviceVerdict(complications: DeviceSync, watchApp: WatchAppSync | undefined): DeviceVerdict {
  const waitingFor = [...(complications === "waiting" ? ["complications"] : []), ...(watchApp?.waiting ?? [])];
  const rejected = watchApp?.rejected ?? [];
  const sync: DeviceSync = waitingFor.length > 0 ? "waiting"
    : complications === "synced" || watchApp?.delivered === true ? "synced" : "idle";
  return rejected.length === 0 ? { sync, waitingFor } : { sync, waitingFor, rejected: [...rejected] };
}

/** What Home says about a watch that reported it could not use the last
 * save of some part, for its card and its line under Waiting to sync. */
export const REJECTED_SAVE_TEXT = "Watch could not use the last save";

/** `REJECTED_SAVE_TEXT` naming the parts: "Watch could not use the last
 * save of its pages", "… of its pages and menus", "… of its pages, menus
 * and voice". The bare sentence for no parts. */
export function rejectedSaveText(parts: readonly string[]): string {
  if (parts.length === 0) return REJECTED_SAVE_TEXT;
  const list = parts.length === 1 ? parts[0]! : `${parts.slice(0, -1).join(", ")} and ${parts[parts.length - 1]!}`;
  return `${REJECTED_SAVE_TEXT} of its ${list}`;
}

/** The muted note after "Waiting" on Home's row: what it waits for. */
export function waitingForText(waitingFor: readonly string[]): string {
  return waitingFor.join(", ");
}

/** The watches to read, as one key, so a fresh owners list with the same
 * watches does not read them all again. */
export function watchAppSyncKey(watchIds: readonly string[]): string {
  return [...watchIds].sort().join("\n");
}
