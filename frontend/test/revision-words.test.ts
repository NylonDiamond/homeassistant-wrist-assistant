// Who saved a complication and when, in words: "version" and a time rather
// than a revision number, and a name rather than `ha-panel:Jesse`.

import { describe, expect, it } from "vitest";
import {
  conflictText,
  restoredText,
  savedByWords,
  savedLine,
  saverName,
  versionLabel,
  versionWhen,
} from "../src/revision-words.js";

const NOW = Date.parse("2026-10-13T12:00:00Z");

describe("saverName", () => {
  it("names a panel user and nobody else's plumbing", () => {
    expect(saverName("ha-panel:Jesse")).toBe("Jesse");
    expect(saverName("ha-panel")).toBeUndefined();
    expect(saverName("")).toBeUndefined();
    expect(saverName("app-import:ABC123")).toBe("the app");
    expect(saverName("watch-restore:ABC123")).toBe("the app");
    expect(saverName("forget:ABC123")).toBe("Home Assistant");
    expect(savedByWords("ha-panel:Jesse")).toBe("by Jesse");
    expect(savedByWords("ha-panel")).toBe("");
  });
});

describe("versionWhen and versionLabel", () => {
  it("dates a version, with the year only when it is not this one", () => {
    expect(versionWhen("2026-05-03T14:02:00", NOW, "en-GB")).toBe("3 May, 14:02");
    expect(versionWhen("2025-05-03T14:02:00", NOW, "en-GB")).toBe("3 May 2025, 14:02");
    expect(versionWhen("not a date", NOW, "en-GB")).toBeUndefined();
  });

  it("falls back to the number when the date is unknown", () => {
    expect(versionLabel(4, "2026-05-03T14:02:00", NOW, "en-GB")).toBe("Version from 3 May, 14:02");
    expect(versionLabel(4, undefined, NOW)).toBe("Version 4");
  });

  it("says which version came back", () => {
    expect(restoredText("2026-05-03T14:02:00", NOW, "en-GB")).toBe("The version from 3 May, 14:02 is back.");
    expect(restoredText(null, NOW)).toBe("That version is back.");
  });
});

describe("conflictText", () => {
  // The old banner read "Save rejected. stored revision is 5, save was based
  // on 4 The server has revision 5, saved 2026-10-13T… by ha-panel:Jesse."
  it("says who saved over the work, and when, in words", () => {
    expect(conflictText({ updatedAt: "2026-10-13T11:57:00Z", updatedBy: "ha-panel:Jesse" }, NOW))
      .toBe("Jesse saved this complication 3 min ago, after you opened it.");
    expect(conflictText({ updatedAt: "", updatedBy: "" }, NOW))
      .toBe("Someone saved this complication, after you opened it.");
    expect(conflictText({ updatedAt: "2026-10-13T11:59:30Z", updatedBy: "app-import:X" }, NOW))
      .toBe("The app saved this complication just now, after you opened it.");
  });

  it("says when the complication is gone", () => {
    expect(conflictText(null, NOW)).toBe("This complication was deleted after you opened it.");
  });
});

describe("savedLine", () => {
  it("reads as one short phrase", () => {
    expect(savedLine("2026-10-13T11:57:00Z", "ha-panel:Jesse", NOW)).toBe("Saved 3 min ago by Jesse");
    expect(savedLine(undefined, "ha-panel", NOW)).toBe("Saved");
  });
});
