// The footer's one line. It is the only thing the panel says about saving
// while the footer is shut, so what it puts first matters more than what it
// says: bad news outranks good, and a revision number is only ever the whole
// story when nothing is wrong.

import { describe, expect, it } from "vitest";
import { draftStatus } from "../src/draft.js";

describe("draftStatus", () => {
  it("reports a clean draft with the revision it is at", () => {
    expect(draftStatus({ revision: 4, dirty: false })).toEqual({ tone: "ok", text: "Saved, revision 4" });
  });

  it("says so while there is work the server has not seen", () => {
    expect(draftStatus({ revision: 4, dirty: true })).toEqual({ tone: "warn", text: "Unsaved changes" });
  });

  it("treats a complication that was never saved as unsaved, not as an error", () => {
    expect(draftStatus({ revision: null, dirty: false })).toEqual({ tone: "warn", text: "Not saved yet" });
  });

  it("puts a failed save ahead of everything else", () => {
    expect(draftStatus({ revision: 4, dirty: true, error: "conflict", templateError: "bad jinja" }))
      .toEqual({ tone: "err", text: "Not saved: conflict" });
  });

  it("shows a template that will not render, once the save itself is fine", () => {
    expect(draftStatus({ revision: 4, dirty: false, templateError: "bad jinja" }))
      .toEqual({ tone: "err", text: "Template error: bad jinja" });
  });

  it("ignores an empty message rather than reporting a blank error", () => {
    expect(draftStatus({ revision: 2, dirty: false, error: "", templateError: "" }).tone).toBe("ok");
  });
});
