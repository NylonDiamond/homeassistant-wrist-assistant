// The "Send to watch" button, as a pure function of what the server said.
//
// The watch pulls its custom complications only when the token on its
// long-poll reply differs from the one it applied, and it reports the applied
// token on every poll request. So the server knows two numbers per watch:
// `token` (what it holds) and `appliedToken` (what the watch last confirmed).
// Equal means on the wrist. The button exists to make that state visible and
// to re-wake a watch that missed the first wake.

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

/** Button label and title for a state; the title is the explanation. */
export function describeSend(s: SendState): { label: string; title: string; disabled: boolean } {
  switch (s.kind) {
    case "unsupported":
      return { label: "", title: "", disabled: true };
    case "sent":
      return { label: "On watch", title: "The watch has applied every change here.", disabled: true };
    case "sending":
      return { label: "Sending…", title: "Waiting for the watch to pull and confirm.", disabled: true };
    case "waiting":
      return {
        label: "Send to watch",
        title: "The watch is connected but has not confirmed the latest change. Tap to wake it again.",
        disabled: false,
      };
    case "offline":
      return {
        label: "Send to watch",
        title: "The watch is not connected to this home. Open Wrist Assistant on the watch, or switch it to this home, then tap Sync now.",
        disabled: false,
      };
  }
}
