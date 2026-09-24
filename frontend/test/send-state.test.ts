// The header chip. The state machine itself is four lines; what is worth
// pinning is the one claim it used to make forever, that everything is "On
// watch", long after the watch stopped listening.

import { describe, expect, it } from "vitest";
import {
  PHONE_SEND_WAIT_MS,
  SEND_WAIT_MS,
  agoWords,
  describeHomeSync,
  describeSend,
  homeSync,
  sendState,
  sendWaitMs,
  type HomeDevice,
  type SendInputs,
} from "../src/send-state.js";

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

  it("counts the changes waiting for a watch that is not listening", () => {
    const away = { token: 6, appliedToken: 4, polling: false, pending: false };
    const two = sendState({ ...away, pendingChanges: 2 });
    expect(two).toEqual({ kind: "offline", pending: 2 });
    expect(describeSend(two).label).toBe("2 changes waiting");
    expect(describeSend(two).note).toBe("open the watch app to sync");
    expect(describeSend(sendState({ ...away, pendingChanges: 1 })).label).toBe("1 change waiting");
    // Zero or unknown falls back to the plain sentence rather than "0 changes".
    expect(describeSend(sendState({ ...away, pendingChanges: 0 })).label).toBe("Open the watch app to sync");
    expect(describeSend(sendState(away)).label).toBe("Open the watch app to sync");
  });
});

// An iPhone the server holds no push token for has no long poll and no push,
// so it is never "sending" and never "waiting": either what it holds matches,
// or someone opens the app.
describe("sendState on an iPhone with no push token", () => {
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

// With a push token the phone runs the watch's machine: a save pushes, the
// app wakes in the background, pulls, and acks.
describe("sendState on an iPhone the server can push", () => {
  const pushPhone = (over: Partial<SendInputs> = {}): SendInputs =>
    inputs({ deviceKind: "iphone", polling: false, pushAvailable: true, ...over });

  it("is sending while the wait after a save is still running", () => {
    const s = sendState(pushPhone({ token: 6, appliedToken: 5, pending: true }));
    expect(s).toEqual({ kind: "sending", device: "iphone" });
    const d = describeSend(s);
    expect(d.label).toBe("Sending to the phone");
    expect(d.resend).toBe(false);
    expect(d.refresh).toBe(false);
  });

  it("is waiting once the 20 s wait has run out with no ack", () => {
    // `pending` is the wait; the panel clears it after PHONE_SEND_WAIT_MS.
    expect(PHONE_SEND_WAIT_MS).toBe(20_000);
    expect(sendWaitMs("iphone")).toBe(PHONE_SEND_WAIT_MS);
    expect(sendWaitMs("watch")).toBe(SEND_WAIT_MS);
    expect(sendWaitMs()).toBe(SEND_WAIT_MS);
    const s = sendState(pushPhone({ token: 6, appliedToken: 5, pending: false }));
    expect(s).toEqual({ kind: "waiting", device: "iphone" });
    const d = describeSend(s);
    expect(d.label).toBe("Sent to the phone, waiting for it to sync");
    expect(d.resend).toBe(false);
    expect(d.refresh).toBe(true);
  });

  // A phone that has never acked is reachable, so it waits rather than asking
  // for the app to be opened.
  it("waits on a phone that has never acked", () => {
    expect(sendState(pushPhone({ appliedToken: undefined }))).toEqual({ kind: "waiting", device: "iphone" });
  });

  it("is On iPhone once the ack matches the token", () => {
    const s = sendState(pushPhone({ pending: true }));
    expect(s).toEqual({ kind: "sent", device: "iphone", push: true });
    const d = describeSend(s);
    expect(d.label).toBe("On iPhone");
    expect(d.resend).toBe(false);
  });

  it("still ages On iPhone by the last sync", () => {
    const s = sendState(pushPhone({ lastSyncSeconds: 120 }));
    expect(s).toEqual({ kind: "sent", awaySeconds: 120, device: "iphone", push: true });
    expect(describeSend(s).note).toBe("last sync 2 min ago");
  });

  it("falls back to opening the app when no push token is on file", () => {
    const s = sendState(pushPhone({ token: 6, appliedToken: 5, pending: true, pushAvailable: false }));
    expect(s).toEqual({ kind: "openApp" });
    const d = describeSend(s);
    expect(d.label).toBe("Open Wrist Assistant on your iPhone to sync");
    expect(d.title).toBe("This iPhone has no push token yet. Open Wrist Assistant on it once.");
    expect(d.refresh).toBe(false);
  });
});

describe("the Refresh now flag", () => {
  const phone = (over: Partial<SendInputs> = {}): SendInputs =>
    inputs({ deviceKind: "iphone", polling: false, ...over });

  it("is offered only to an iPhone the server can push", () => {
    // Every phone state with a token, behind or not.
    expect(describeSend(sendState(phone({ pushAvailable: true }))).refresh).toBe(true);
    expect(describeSend(sendState(phone({ pushAvailable: true, lastSyncSeconds: 30 }))).refresh).toBe(true);
    expect(describeSend(sendState(phone({ pushAvailable: true, token: 6, appliedToken: 5 }))).refresh).toBe(true);
    // The same phone without one.
    expect(describeSend(sendState(phone())).refresh).toBe(false);
    expect(describeSend(sendState(phone({ token: 6, appliedToken: 5 }))).refresh).toBe(false);
  });

  it("is never offered to a watch, whose button stays Resend", () => {
    const behind = { token: 6, appliedToken: 5, pending: false };
    for (const i of [
      inputs(),
      inputs({ polling: false, lastPollSeconds: 900 }),
      inputs({ appliedToken: undefined }),
      inputs({ ...behind, polling: true }),
      inputs({ ...behind, polling: true, pending: true }),
      inputs({ ...behind, polling: false }),
    ]) {
      expect(describeSend(sendState(i)).refresh).toBe(false);
    }
    expect(describeSend(sendState(inputs({ ...behind, polling: true }))).resend).toBe(true);
  });

  it("never offers a phone the watch's Resend", () => {
    for (const push of [true, false]) {
      for (const over of [{}, { token: 6, appliedToken: 5 }, { appliedToken: undefined }, { pending: true }]) {
        expect(describeSend(sendState(phone({ pushAvailable: push, ...over }))).resend).toBe(false);
      }
    }
  });
});

describe("the library", () => {
  // Not a device: nothing polls it, nothing is pushed to it and nothing ever
  // acks, so a save to it is finished the moment the store has it.
  it("is saved and done, whatever the tokens say", () => {
    for (const over of [{}, { token: 6, appliedToken: 5 }, { appliedToken: undefined }, { pending: true }, { polling: false }]) {
      expect(sendState(inputs({ deviceKind: "library", ...over }))).toEqual({ kind: "library" });
    }
  });

  it("says where it went and offers neither Resend nor Refresh", () => {
    const d = describeSend({ kind: "library" });
    expect(d.label).toBe("Saved, and unassigned.");
    expect(d.note).toBeUndefined();
    expect(d.resend).toBe(false);
    expect(d.refresh).toBe(false);
  });

  // A wait of any length would be a spinner resolving to what it started at.
  it("waits for nothing", () => {
    expect(sendWaitMs("library")).toBe(0);
  });

  // Every word of the sending, waiting and sent chips is about a device
  // confirming, so none of them may be borrowed here.
  it("never reads as sending, waiting or on a device", () => {
    const d = describeSend({ kind: "library" });
    for (const word of ["watch", "iPhone", "phone", "Sending", "sync"]) {
      expect(d.label).not.toContain(word);
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

describe("homeSync", () => {
  const dev = (over: Partial<HomeDevice> = {}): HomeDevice =>
    ({ name: "Watch", kind: "watch", token: 5, appliedToken: 5, count: 1, orphan: false, ...over });

  it("is synced when every device has applied its token", () => {
    const s = homeSync([dev(), dev({ name: "iPhone", kind: "iphone" })]);
    expect(s).toEqual({ kind: "synced", devices: ["Watch", "iPhone"] });
    expect(describeHomeSync(s!).label).toBe("Synced");
  });

  it("names every device that is behind, watch and phone together", () => {
    const s = homeSync([
      dev({ appliedToken: 3 }),
      dev({ name: "iPhone", kind: "iphone", appliedToken: 4 }),
      dev({ name: "Other watch" }),
    ]);
    expect(s).toEqual({ kind: "waiting", waiting: ["Watch", "iPhone"] });
    expect(describeHomeSync(s!).label).toBe("Waiting: Watch, iPhone");
  });

  it("counts a device that applied a later token as synced", () => {
    expect(homeSync([dev({ token: 5, appliedToken: 9 })])?.kind).toBe("synced");
  });

  it("waits for a device that owns designs and has never acked", () => {
    expect(homeSync([dev({ appliedToken: null })])).toEqual({ kind: "waiting", waiting: ["Watch"] });
  });

  it("leaves out the Library, orphans and empty never-acked devices", () => {
    expect(homeSync([
      dev({ name: "Library", kind: "library", appliedToken: null }),
      dev({ orphan: true, appliedToken: 1 }),
      dev({ appliedToken: undefined, count: 0 }),
    ])).toBeUndefined();
  });
});
