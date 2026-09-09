// The header chip. The state machine itself is four lines; what is worth
// pinning is the one claim it used to make forever, that everything is "On
// watch", long after the watch stopped listening.

import { describe, expect, it } from "vitest";
import { agoWords, describeSend, sendState, type SendInputs } from "../src/send-state.js";

const inputs = (over: Partial<SendInputs> = {}): SendInputs =>
  ({ token: 5, appliedToken: 5, polling: true, pending: false, ...over });

describe("sendState", () => {
  // A watch that has never acked is not behind, it is unreachable: the chip
  // says so and offers no Resend, because there is nothing there to wake.
  it("reads a watch that has never acked as unsupported", () => {
    const s = sendState(inputs({ appliedToken: undefined }));
    expect(s.kind).toBe("unsupported");
    const d = describeSend(s);
    expect(d.label).toBe("Update the watch app");
    expect(d.note).toBe("to receive this");
    expect(d.resend).toBe(false);
  });

  it("keeps an ack of zero apart from never having acked", () => {
    // An empty store acked is "On watch"; the two used to be the same number.
    expect(sendState(inputs({ token: 0, appliedToken: 0 })).kind).toBe("sent");
    expect(sendState(inputs({ token: 0, appliedToken: undefined })).kind).toBe("unsupported");
  });

  it("is plain On watch while the watch is listening", () => {
    const s = sendState(inputs({ lastPollSeconds: 2 }));
    expect(s).toEqual({ kind: "sent" });
    expect(describeSend(s).label).toBe("On watch");
  });

  it("adds how long it has been away once the watch stops listening", () => {
    const s = sendState(inputs({ polling: false, lastPollSeconds: 7200 }));
    expect(s).toEqual({ kind: "sent", awaySeconds: 7200 });
    expect(describeSend(s).label).toBe("On watch");
    expect(describeSend(s).note).toBe("last seen 2 h ago");
  });

  it("says only On watch when the server has no age to give", () => {
    // A server restarted since the watch last polled knows nothing, and a
    // guessed age is worse than none.
    expect(sendState(inputs({ polling: false }))).toEqual({ kind: "sent" });
    expect(sendState(inputs({ polling: false, lastPollSeconds: null }))).toEqual({ kind: "sent" });
  });

  it("keeps the age out of the states that are already about the wait", () => {
    const away = { token: 6, appliedToken: 5, polling: false, pending: false, lastPollSeconds: 900 };
    expect(sendState(away).kind).toBe("offline");
    expect(describeSend(sendState(away)).label).toBe("Open the watch app to sync");
    expect(describeSend(sendState(away)).note).toBeUndefined();
    expect(sendState({ ...away, polling: true }).kind).toBe("waiting");
    expect(sendState({ ...away, polling: true, pending: true }).kind).toBe("sending");
  });
});

// An iPhone owner has no long poll, so it is never "sending" and never
// "waiting": either what it holds matches, or someone opens the app.
describe("sendState on an iPhone", () => {
  const phone = (over: Partial<SendInputs> = {}): SendInputs =>
    inputs({ deviceKind: "iphone", polling: false, ...over });

  it("is On iPhone once the tokens match", () => {
    const s = sendState(phone());
    expect(s).toEqual({ kind: "sent", device: "iphone" });
    const d = describeSend(s);
    expect(d.label).toBe("On iPhone");
    expect(d.resend).toBe(false);
  });

  it("ages On iPhone by the last sync, since a phone never polls", () => {
    const s = sendState(phone({ lastSyncSeconds: 3600, lastPollSeconds: null }));
    expect(s).toEqual({ kind: "sent", awaySeconds: 3600, device: "iphone" });
    expect(describeSend(s).note).toBe("last sync 1 h ago");
  });

  it("asks for the app when the phone is behind, with no Resend", () => {
    const s = sendState(phone({ token: 6, appliedToken: 5 }));
    expect(s).toEqual({ kind: "openApp" });
    const d = describeSend(s);
    expect(d.label).toBe("Open Wrist Assistant on your iPhone to sync");
    expect(d.resend).toBe(false);
    expect(d.note).toBeUndefined();
  });

  // On a watch this reads as an app too old to receive anything. On a phone it
  // only means it has not synced yet, which opening the app fixes.
  it("reads a phone that has never acked as one to open, not as unsupported", () => {
    expect(sendState(phone({ appliedToken: undefined }))).toEqual({ kind: "openApp" });
  });

  it("never sends or waits, whatever the poll flags say", () => {
    const behind = phone({ token: 6, appliedToken: 5, pending: true, polling: true });
    expect(sendState(behind)).toEqual({ kind: "openApp" });
  });

  it("leaves a watch exactly as it was", () => {
    // The same inputs with the kind spelled out, and with it absent.
    for (const kind of ["watch", null, undefined] as const) {
      expect(sendState(inputs({ deviceKind: kind, lastSyncSeconds: 99 }))).toEqual({ kind: "sent" });
      expect(sendState(inputs({ deviceKind: kind, token: 6, appliedToken: 5, polling: true }))).toEqual({ kind: "waiting" });
      expect(sendState(inputs({ deviceKind: kind, appliedToken: undefined }))).toEqual({ kind: "unsupported" });
    }
  });
});

describe("agoWords", () => {
  it("rounds down to one unit, and calls anything under a minute just now", () => {
    expect(agoWords(0)).toBe("just now");
    expect(agoWords(59)).toBe("just now");
    expect(agoWords(60)).toBe("1 min ago");
    expect(agoWords(59 * 60)).toBe("59 min ago");
    expect(agoWords(60 * 60)).toBe("1 h ago");
    expect(agoWords(23.9 * 3600)).toBe("23 h ago");
    expect(agoWords(24 * 3600)).toBe("1 day ago");
    expect(agoWords(50 * 3600)).toBe("2 days ago");
  });
});
