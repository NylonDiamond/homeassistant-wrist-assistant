// The header chip. The state machine itself is four lines; what is worth
// pinning is the one claim it used to make forever, that everything is "On
// watch", long after the watch stopped listening.

import { describe, expect, it } from "vitest";
import { agoWords, describeSend, sendState, type SendInputs } from "../src/send-state.js";

const inputs = (over: Partial<SendInputs> = {}): SendInputs =>
  ({ token: 5, appliedToken: 5, polling: true, pending: false, ...over });

describe("sendState", () => {
  it("offers nothing on an integration without the ack", () => {
    expect(sendState(inputs({ appliedToken: undefined })).kind).toBe("unsupported");
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
