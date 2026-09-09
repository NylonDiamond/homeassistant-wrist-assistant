// The watch status in the panel header, as a pure function of what the
// server said.
//
// The watch pulls its custom complications only when the token on its
// long-poll reply differs from the one it applied, and it reports the applied
// token on every poll request. So the server knows two numbers per watch:
// `token` (what it holds) and `appliedToken` (what the watch last confirmed).
// Equal means on the wrist. A save wakes the parked poll, so while the watch
// app is open on this home a save lands by itself; this status makes that
// visible, and the Resend link re-wakes a watch that missed the first wake.
//
// An iPhone owner has none of that. There is no long poll to the phone, so
// there is nothing to wake: it pulls when the app is opened, when Sync now is
// tapped, or on its widget's own refresh. A phone is therefore only ever in
// one of two states here, and neither offers Resend: what it holds matches,
// or someone has to open the app.

import type { DeviceKind } from "./version.js";

export interface SendInputs {
  /** The owner's store token on the server. */
  token: number;
  /** The token the watch last reported it applied. Undefined when it never
   * has: its watch app predates custom complications, or it has not opened
   * this home yet. Not the same as 0, which is a real ack of an empty store. */
  appliedToken: number | undefined;
  /** Whether the watch holds a long-poll on this server right now. */
  polling: boolean;
  /** A save or a tap started a wait for the ack that has not timed out. */
  pending: boolean;
  /** Seconds since the watch last polled, when the server knows. Undefined
   * from an integration that predates the field, and null when nothing has
   * polled since the server started. */
  lastPollSeconds?: number | null;
  /** Which device owns these records. Absent means a watch, which is what
   * every owner was before phones could own any. */
  deviceKind?: DeviceKind | null;
  /** Seconds since a phone owner last ran a sync, when the server knows.
   * Null when it never has, undefined from an integration that predates the
   * field. Watches report `lastPollSeconds` instead. */
  lastSyncSeconds?: number | null;
}

export type SendState =
  /** The watch has never told this server which changes it applied, so
   * nothing here can be sent to it and no Resend would help. */
  | { kind: "unsupported" }
  /** `awaySeconds` is set only when the tokens match and the watch is not
   * listening now: "On watch" is true forever once it has pulled, so without
   * the age a green tick claims a watch that went flat hours ago is still
   * there. Undefined while it is connected, and while the server has no age
   * to give. */
  | { kind: "sent"; awaySeconds?: number; device?: DeviceKind }
  | { kind: "sending" }
  | { kind: "waiting" }
  /** A phone owner holding something older than the store. Nothing here can
   * push it, so the only true thing to say is what makes it arrive. */
  | { kind: "openApp" }
  | { kind: "offline" };

/** How long a save or a tap waits for the watch's ack before giving up. */
export const SEND_WAIT_MS = 10_000;

export function sendState(i: SendInputs): SendState {
  if (i.deviceKind === "iphone") return iphoneSendState(i);
  if (i.appliedToken === undefined) return { kind: "unsupported" };
  if (i.token === i.appliedToken) {
    const away = !i.polling && typeof i.lastPollSeconds === "number" ? i.lastPollSeconds : undefined;
    return away === undefined ? { kind: "sent" } : { kind: "sent", awaySeconds: away };
  }
  if (i.pending && i.polling) return { kind: "sending" };
  if (i.polling) return { kind: "waiting" };
  return { kind: "offline" };
}

/**
 * A phone, which either has it or has not been opened since.
 *
 * "Never acked" is not its own state here. On a watch that means an app older
 * than custom complications, and no Resend would help; on a phone it means
 * only that it has not synced yet, which opening the app fixes. So it reads
 * the same as being behind.
 *
 * `pending` and `polling` are ignored on purpose: a save cannot start a wait
 * for something with nothing listening, and a spinner that never resolves is
 * worse than a sentence saying what to do.
 */
function iphoneSendState(i: SendInputs): SendState {
  if (i.appliedToken === undefined || i.token !== i.appliedToken) return { kind: "openApp" };
  const since = typeof i.lastSyncSeconds === "number" ? i.lastSyncSeconds : undefined;
  return since === undefined
    ? { kind: "sent", device: "iphone" }
    : { kind: "sent", awaySeconds: since, device: "iphone" };
}

/**
 * A gap, rounded to one unit and to how precisely anyone cares.
 *
 * Under a minute is "just now": a watch that polled 40 seconds ago is a watch
 * that is about to poll again, and a ticking seconds count in a header reads
 * as an alarm rather than a fact.
 */
export function agoWords(seconds: number): string {
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} h ago`;
  const days = Math.floor(hours / 24);
  return `${days} ${days === 1 ? "day" : "days"} ago`;
}

/** Status text and its explanation; `resend` offers the re-wake link, and
 * `note` is the quieter half of the chip, drawn in muted ink beside the
 * label rather than in the label's own colour. */
export function describeSend(s: SendState): { label: string; note?: string; title: string; resend: boolean } {
  switch (s.kind) {
    case "unsupported":
      return {
        label: "Update the watch app",
        note: "to receive this",
        title:
          "This watch has never reported which changes it applied, so nothing saved here can reach it. Its Wrist Assistant app is older than custom complications, or it has not been opened on this home yet.",
        resend: false,
      };
    case "sent":
      if (s.device === "iphone") {
        return s.awaySeconds === undefined
          ? { label: "On iPhone", title: "This iPhone has applied every change here.", resend: false }
          : {
              label: "On iPhone",
              note: `last sync ${agoWords(s.awaySeconds)}`,
              title:
                "This iPhone has applied every change here, as of its last sync. A save made after this reaches the lock screen when the app is opened, or on the widget's own refresh.",
              resend: false,
            };
      }
      return s.awaySeconds === undefined
        ? { label: "On watch", title: "The watch has applied every change here.", resend: false }
        : {
            label: "On watch",
            note: `last seen ${agoWords(s.awaySeconds)}`,
            title:
              "The watch has applied every change here, but it is not listening now. A save made after this will not reach it until the watch app is open on this home again.",
            resend: false,
          };
    case "openApp":
      return {
        label: "Open Wrist Assistant on your iPhone to sync",
        title:
          "Nothing here can be pushed to an iPhone. It pulls when the app is opened, when Sync now is tapped in the app, and on the lock screen widget's own refresh.",
        resend: false,
      };
    case "sending":
      return { label: "Sending…", title: "Waiting for the watch to pull and confirm.", resend: false };
    case "waiting":
      return {
        label: "Not on watch yet",
        title: "The watch is connected but has not confirmed the latest change. Resend wakes it again.",
        resend: true,
      };
    case "offline":
      return {
        label: "Open the watch app to sync",
        title:
          "Saves reach the watch by themselves while Wrist Assistant is open on this home. Open the app, or switch the watch to this home, and it pulls at once.",
        resend: true,
      };
  }
}
