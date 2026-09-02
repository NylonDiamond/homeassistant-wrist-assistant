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
}

export type SendState =
  | { kind: "unsupported" }
  | { kind: "sent" }
  | { kind: "sending" }
  | { kind: "waiting" }
  | { kind: "offline" };

/** How long a save or a tap waits for the watch's ack before giving up. */
export const SEND_WAIT_MS = 10_000;

export function sendState(i: SendInputs): SendState {
  if (i.appliedToken === undefined) return { kind: "unsupported" };
  if (i.token === i.appliedToken) return { kind: "sent" };
  if (i.pending && i.polling) return { kind: "sending" };
  if (i.polling) return { kind: "waiting" };
  return { kind: "offline" };
}

/** Status text and its explanation; `resend` offers the re-wake link. */
export function describeSend(s: SendState): { label: string; title: string; resend: boolean } {
  switch (s.kind) {
    case "unsupported":
      return { label: "", title: "", resend: false };
    case "sent":
      return { label: "On watch", title: "The watch has applied every change here.", resend: false };
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
