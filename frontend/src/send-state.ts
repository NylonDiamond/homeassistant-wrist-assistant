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

export interface SendInputs {
  /** The owner's store token on the server. */
  token: number;
  /** The token the watch last reported it applied; undefined when the
   * integration predates the ack (the button is then not offered). */
  appliedToken: number | undefined;
  /** Whether the watch holds a long-poll on this server right now. */
  polling: boolean;
  /** A save or a tap started a wait for the ack that has not timed out. */
  pending: boolean;
  /** Seconds since the watch last polled, when the server knows. Undefined
   * from an integration that predates the field, and null when nothing has
   * polled since the server started. */
  lastPollSeconds?: number | null;
}

export type SendState =
  | { kind: "unsupported" }
  /** `awaySeconds` is set only when the tokens match and the watch is not
   * listening now: "On watch" is true forever once it has pulled, so without
   * the age a green tick claims a watch that went flat hours ago is still
   * there. Undefined while it is connected, and while the server has no age
   * to give. */
  | { kind: "sent"; awaySeconds?: number }
  | { kind: "sending" }
  | { kind: "waiting" }
  | { kind: "offline" };

/** How long a save or a tap waits for the watch's ack before giving up. */
export const SEND_WAIT_MS = 10_000;

export function sendState(i: SendInputs): SendState {
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
      return { label: "", title: "", resend: false };
    case "sent":
      return s.awaySeconds === undefined
        ? { label: "On watch", title: "The watch has applied every change here.", resend: false }
        : {
            label: "On watch",
            note: `last seen ${agoWords(s.awaySeconds)}`,
            title:
              "The watch has applied every change here, but it is not listening now. A save made after this will not reach it until the watch app is open on this home again.",
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
