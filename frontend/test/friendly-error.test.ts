// The panel's errors in plain words. The integration's messages are written
// for logs; these are the ones it really sends, and what a person reads
// instead. Anything else is shown as it came.

import { describe, expect, it } from "vitest";
import {
  NEWER_VERSION_TEXT,
  NOT_READY_TEXT,
  UPDATE_INTEGRATION_TEXT,
  friendlyError,
  rawErrorText,
  rawErrorTitle,
} from "../src/friendly-error.js";

describe("friendlyError", () => {
  it("says the integration is still starting", () => {
    expect(friendlyError({ code: "unavailable", message: "integration not ready" })).toBe(NOT_READY_TEXT);
    // The watch editors pass on the message without its code.
    expect(friendlyError({ code: "error", message: "integration not ready" })).toBe(NOT_READY_TEXT);
  });

  it("names a device that belongs to someone else", () => {
    expect(friendlyError({ code: "unauthorized", message: "not a device paired to this user" }))
      .toBe("This device belongs to someone else.");
  });

  it("says a complication or a version is gone", () => {
    expect(friendlyError({ code: "not_found", message: "no such complication" })).toBe("This complication was deleted.");
    expect(friendlyError({ code: "not_found", message: "no such revision" })).toBe("That version is no longer in the history.");
  });

  it("explains a design that is too big", () => {
    expect(friendlyError({ code: "invalid", message: "document exceeds 262144 bytes" }))
      .toBe("This design is too big to save. Remove some layers or pictures.");
    expect(friendlyError({ code: "invalid", message: "document.elements exceeds 64 layers" }))
      .toBe("This design has too many layers. It can have 64 at most.");
  });

  it("asks for a name", () => {
    expect(friendlyError({ code: "invalid", message: "document.name must not be empty" })).toBe("Give it a name first.");
  });

  it("names the design already in a slot, with no slot number", () => {
    const text = friendlyError({
      code: "invalid",
      message: 'slot 3 already holds "Kitchen" for the rectangular shape on this device; pick another slot',
    });
    expect(text).toBe('"Kitchen" is already in that slot. Pick another slot.');
  });

  it("sends a newer design to HACS", () => {
    expect(friendlyError({ code: "invalid", message: "document.schemaVersion 12 is newer than this integration supports (9)" }))
      .toBe(NEWER_VERSION_TEXT);
    expect(friendlyError({ code: "unknown_command", message: "Unknown command." })).toBe(UPDATE_INTEGRATION_TEXT);
  });

  it("reads a command that died with the connection", () => {
    expect(friendlyError({ type: "result", success: false, error: { code: 3, message: "Connection lost" } }))
      .toBe("Lost the connection to Home Assistant. Try again once it is back.");
  });

  it("shows anything it does not know as it came", () => {
    expect(friendlyError({ code: "invalid", message: "document.inline is only allowed when supportedFamilies includes inline" }))
      .toBe("document.inline is only allowed when supportedFamilies includes inline");
    expect(friendlyError(new Error("boom"))).toBe("boom");
    expect(friendlyError("plain words")).toBe("plain words");
  });
});

describe("rawErrorText and rawErrorTitle", () => {
  it("keeps the server's words for a tooltip", () => {
    const err = { code: "unavailable", message: "integration not ready" };
    expect(rawErrorText(err)).toBe("integration not ready");
    expect(rawErrorTitle(err)).toBe("integration not ready");
  });

  it("has no tooltip when the line is the server's words already", () => {
    expect(rawErrorTitle(new Error("boom"))).toBeUndefined();
  });
});
