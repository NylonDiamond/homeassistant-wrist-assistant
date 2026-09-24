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
// An iPhone owner has no long poll, but a save does reach it. The integration
// sends one silent push, the app wakes in the background, pulls, and acks the
// same `appliedToken` a watch does. So a phone runs the same sending, waiting,
// sent machine, on a longer clock, and Refresh now sends the push again by
// hand. The exception is a phone the server holds no push token for: that one
// still only syncs when someone opens the app.
//
// The Library is outside all of it. It is the home's shelf rather than a
// device, so nothing polls it, nothing is pushed to it and nothing ever acks:
// a save to it is finished the moment the store has it. It gets a state of its
// own rather than a borrowed "sent", because every word of the sent chip is
// about a device confirming, and there is no device.

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
  /** Whether the server holds a push token for this phone, so a save can wake
   * it. Absent means no, which is what every integration older than the field
   * says by staying silent, and what a watch owner always is. */
  pushAvailable?: boolean;
  /** How many designs the device's next pull will bring, when the server
   * says. Undefined before the first ack and from older integrations. */
  pendingChanges?: number;
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
  /** `push` marks a phone the server can wake, which is the one that gets the
   * Refresh now button. Left off a watch, and off a phone with no token. */
  | { kind: "sent"; awaySeconds?: number; device?: DeviceKind; push?: boolean }
  | { kind: "sending"; device?: DeviceKind }
  | { kind: "waiting"; device?: DeviceKind }
  /** A phone the server holds no push token for, holding something older than
   * the store. Nothing here can wake it, so the only true thing to say is what
   * makes it arrive. */
  | { kind: "openApp" }
  /** The home's Library, which is not waiting for anything. */
  | { kind: "library" }
  /** `pending` is how many designs are waiting for the watch, when known. */
  | { kind: "offline"; pending?: number };

/** How long a save or a tap waits for the watch's ack before giving up. */
export const SEND_WAIT_MS = 10_000;

/** The same wait for a phone. Longer because the round trip is longer: the
 * push is debounced by the integration, APNs delivers it at its own pace, and
 * the app has to wake in the background before it can pull. */
export const PHONE_SEND_WAIT_MS = 20_000;

/** How long to wait for this owner's ack. Zero for the Library: there is
 * nothing to wait for, so a wait of any length would only be a spinner that
 * resolves to the same thing it started at. */
export function sendWaitMs(deviceKind?: DeviceKind | null): number {
  if (deviceKind === "library") return 0;
  return deviceKind === "iphone" ? PHONE_SEND_WAIT_MS : SEND_WAIT_MS;
}

export function sendState(i: SendInputs): SendState {
  if (i.deviceKind === "library") return { kind: "library" };
  if (i.deviceKind === "iphone") return iphoneSendState(i);
  if (i.appliedToken === undefined) return { kind: "unsupported" };
  if (i.token === i.appliedToken) {
    const away = !i.polling && typeof i.lastPollSeconds === "number" ? i.lastPollSeconds : undefined;
    return away === undefined ? { kind: "sent" } : { kind: "sent", awaySeconds: away };
  }
  if (i.pending && i.polling) return { kind: "sending" };
  if (i.polling) return { kind: "waiting" };
  return typeof i.pendingChanges === "number" && i.pendingChanges > 0
    ? { kind: "offline", pending: i.pendingChanges }
    : { kind: "offline" };
}

/**
 * A phone, which the server can wake when it holds a push token for it.
 *
 * With a token this is the watch's machine with the phone's words: a save
 * shows `sending` while the wait runs, then `waiting`, then `sent` on the ack.
 * `polling` says nothing here, since a phone never holds a long poll; the wait
 * itself is what `pending` carries.
 *
 * With no token, `pending` is ignored on purpose: nothing was sent, and a
 * spinner that never resolves is worse than a sentence saying what to do.
 *
 * "Never acked" is not its own state either way. On a watch that means an app
 * older than custom complications, and no Resend would help; on a phone it
 * means only that it has not synced yet. So it reads the same as being behind.
 */
function iphoneSendState(i: SendInputs): SendState {
  const synced = i.appliedToken !== undefined && i.token === i.appliedToken;
  if (!i.pushAvailable) {
    if (!synced) return { kind: "openApp" };
    const since = typeof i.lastSyncSeconds === "number" ? i.lastSyncSeconds : undefined;
    return since === undefined
      ? { kind: "sent", device: "iphone" }
      : { kind: "sent", awaySeconds: since, device: "iphone" };
  }
  if (synced) {
    const since = typeof i.lastSyncSeconds === "number" ? i.lastSyncSeconds : undefined;
    return since === undefined
      ? { kind: "sent", device: "iphone", push: true }
      : { kind: "sent", awaySeconds: since, device: "iphone", push: true };
  }
  return i.pending ? { kind: "sending", device: "iphone" } : { kind: "waiting", device: "iphone" };
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

/** Status text and its explanation; `resend` offers the watch's re-wake link,
 * `refresh` the phone's re-push one (never both), and `note` is the quieter
 * half of the chip, drawn in muted ink beside the label rather than in the
 * label's own color. */
export function describeSend(
  s: SendState,
): { label: string; note?: string; title: string; resend: boolean; refresh: boolean } {
  switch (s.kind) {
    case "unsupported":
      return {
        label: "Update the watch app",
        note: "to receive this",
        title:
          "This watch has never reported which changes it applied, so nothing saved here can reach it. Its Wrist Assistant app is older than custom complications, or it has not been opened on this home yet.",
        resend: false,
        refresh: false,
      };
    case "sent":
      if (s.device === "iphone") {
        const pushable = s.push === true;
        return s.awaySeconds === undefined
          ? {
              label: "On iPhone",
              title: pushable
                ? "This iPhone has applied every change here. A save sends it a push and it syncs in the background. iOS redraws the widget when it allows: opening the app or tapping the widget redraws it at once."
                : "This iPhone has applied every change here.",
              resend: false,
              refresh: pushable,
            }
          : {
              label: "On iPhone",
              note: `last sync ${agoWords(s.awaySeconds)}`,
              title: pushable
                ? "This iPhone has applied every change here, as of its last sync. A save sends it a push and it syncs in the background. iOS redraws the widget when it allows: opening the app or tapping the widget redraws it at once."
                : "This iPhone has applied every change here, as of its last sync. A save made after this reaches the lock screen when the app is opened, or on the widget's own refresh.",
              resend: false,
              refresh: pushable,
            };
      }
      return s.awaySeconds === undefined
        ? { label: "On watch", title: "The watch has applied every change here.", resend: false, refresh: false }
        : {
            label: "On watch",
            note: `last seen ${agoWords(s.awaySeconds)}`,
            title:
              "The watch has applied every change here, but it is not listening now. A save made after this will not reach it until the watch app is open on this home again.",
            resend: false,
            refresh: false,
          };
    case "openApp":
      return {
        label: "Open Wrist Assistant on your iPhone to sync",
        title: "This iPhone has no push token yet. Open Wrist Assistant on it once.",
        resend: false,
        refresh: false,
      };
    case "library":
      return {
        label: "Saved, and unassigned.",
        title:
          "Unassigned is where a design waits until it is put on something. Nothing is sent anywhere until you tick a device under Appears on.",
        resend: false,
        refresh: false,
      };
    case "sending":
      if (s.device === "iphone") {
        return {
          label: "Sending to the phone",
          title: "The push is on its way. The iPhone pulls in the background and confirms. The widget itself redraws when iOS allows, or at once when the app is opened or the widget is tapped.",
          resend: false,
          refresh: false,
        };
      }
      return {
        label: "Sending…",
        title: "Waiting for the watch to pull and confirm.",
        resend: false,
        refresh: false,
      };
    case "waiting":
      if (s.device === "iphone") {
        return {
          label: "Sent to the phone, waiting for it to sync",
          title:
            "The push has gone out, and the iPhone has not confirmed the latest change yet. Refresh now sends it another.",
          resend: false,
          refresh: true,
        };
      }
      return {
        label: "Not on watch yet",
        title: "The watch is connected but has not confirmed the latest change. Resend wakes it again.",
        resend: true,
        refresh: false,
      };
    case "offline":
      if (s.pending !== undefined) {
        return {
          label: `${s.pending} ${s.pending === 1 ? "change" : "changes"} waiting`,
          note: "open the watch app to sync",
          title:
            "Saved here, not on the watch yet. Saves reach the watch by themselves while Wrist Assistant is open on this home. Open the app, or switch the watch to this home, and it pulls at once.",
          resend: true,
          refresh: false,
        };
      }
      return {
        label: "Open the watch app to sync",
        title:
          "Saves reach the watch by themselves while Wrist Assistant is open on this home. Open the app, or switch the watch to this home, and it pulls at once.",
        resend: true,
        refresh: false,
      };
  }
}
