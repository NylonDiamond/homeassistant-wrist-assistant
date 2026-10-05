// Whether a watch still has watch app records to pick up, for Home's Devices
// card: its pages, menus, status pages, Control Center list, settings (Rooms
// writes the same record), notification style and voice.
//
// Each of these is a watch config record, and each record carries its own
// delivery state: `revision` is the copy Home Assistant holds, and
// `delivered_revision` the newest one a device is known to hold (the watch's
// own pull, or the iPhone passing it on). The editors' sync pills and Watch
// settings' "Collected" read the same two numbers (`deliveryState`).
//
// `watch_config/summary` answers those numbers for every watch at once, with
// no documents, so Home asks one question however many watches and pages a
// home has (`summaryWatchAppSyncs`). It is asked when Home is entered rather
// than kept live. An integration older than that command is read the old
// way, one `watch_config/get` per kind per watch (`readWatchAppSync`), where
// a kind the integration refuses counts as no record.
//
// The complication part of a device's verdict stays `deviceSync`
// (send-state.ts), and the header pill (`homeSync`) stays about
// complications only. Home's row takes the worse of the two.

import type { WatchConfigPanelKind, WatchConfigRecord, WatchConfigSummary } from "./ha-api.js";
import type { DeviceSync } from "./send-state.js";
import { deliveryState } from "./watch-settings.js";

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
  { kind: "notification_style", label: "notification style" },
];

/** Where one watch's watch app records have got to. */
export interface WatchAppSync {
  /** The parts a device has not collected yet, by label, in part order. */
  waiting: string[];
  /** A device has collected at least one record: the watch has synced
   * something, even with no complication at all. */
  delivered: boolean;
}

type Delivery = Pick<WatchConfigRecord, "revision" | "delivered_revision">;

/** The verdict over the records read, by kind. A kind with no record (or
 * none read) counts for neither side. */
export function watchAppSync(records: ReadonlyMap<string, Delivery | undefined>): WatchAppSync {
  const waiting: string[] = [];
  let delivered = false;
  for (const part of WATCH_APP_PARTS) {
    const state = deliveryState(records.get(part.kind));
    if (state === "waiting") waiting.push(part.label);
    else if (state === "delivered") delivered = true;
  }
  return { waiting, delivered };
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
    out.set(id, watchAppSync(new Map(Object.entries(kinds))));
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
 * panel cannot tell (not an administrator, the integration not ready, the
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
}

/**
 * Waiting when either side waits. Synced when nothing waits and the device
 * has collected something on either side. Otherwise idle: nothing waiting,
 * and nothing ever collected. Without a watch app reading (a phone, or a
 * watch whose records could not be read) the complications decide alone.
 */
export function deviceVerdict(complications: DeviceSync, watchApp: WatchAppSync | undefined): DeviceVerdict {
  const waitingFor = [...(complications === "waiting" ? ["complications"] : []), ...(watchApp?.waiting ?? [])];
  if (waitingFor.length > 0) return { sync: "waiting", waitingFor };
  if (complications === "synced" || watchApp?.delivered === true) return { sync: "synced", waitingFor };
  return { sync: "idle", waitingFor };
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
