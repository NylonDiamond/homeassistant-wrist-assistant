// The This watch card's words and rows: when the device was paired, its
// app, when it last reached Home Assistant, whose it is, and the one line
// on what to do when it stops connecting. The Settings page draws them;
// `watch-settings-shell.test.ts` reads the drawn card.

import { describe, expect, it } from "vitest";

import type { OwnerSummary } from "../src/ha-api.js";
import { matchesSearch, searchTerms } from "../src/watch-settings-nav.js";
import {
  THIS_DEVICE_PAIRED_HELP,
  THIS_DEVICE_SEARCH_WORDS,
  appText,
  ownerText,
  pairedDateText,
  reachedText,
  thisDeviceNote,
  thisDeviceRows,
  thisDeviceTitle,
} from "../src/watch-this-device.js";

const watch = (extra: Partial<OwnerSummary> = {}): OwnerSummary => ({
  owner_watch_id: "w1",
  device_name: "Apple Watch",
  device_kind: "watch",
  paired_iphone_name: null,
  app_version: "3.1.0",
  app_build: "2",
  screen_size: null,
  complication_count: 0,
  token: 1,
  is_orphan: false,
  ...extra,
});

describe("the This watch card", () => {
  it("is named for the device, with its one line on pairing again", () => {
    expect(thisDeviceTitle("watch")).toBe("This watch");
    expect(thisDeviceTitle("iphone")).toBe("This iPhone");
    expect(thisDeviceNote("watch")).toBe("If this watch stops connecting, open Settings on the watch and choose Pair again.");
    expect(thisDeviceNote("iphone")).toContain("choose Pair Again.");
  });

  it("writes the paired date short, and nothing for a missing or broken one", () => {
    expect(pairedDateText("2026-10-07T12:00:00+00:00", "en-GB")).toBe("7 Oct 2026");
    expect(pairedDateText(null)).toBeUndefined();
    expect(pairedDateText(undefined)).toBeUndefined();
    expect(pairedDateText("not a date")).toBeUndefined();
  });

  it("says the app's version with its build", () => {
    expect(appText(watch())).toBe("3.1.0 (2)");
    expect(appText(watch({ app_build: null }))).toBe("3.1.0");
    expect(appText(watch({ app_version: null }))).toBe("Not reported yet");
  });

  it("says when it last reached Home Assistant", () => {
    expect(reachedText(watch({ polling: true, last_seen_seconds: 900 }))).toBe("Now");
    expect(reachedText(watch({ last_seen_seconds: 30 }))).toBe("Just now");
    expect(reachedText(watch({ last_seen_seconds: 600 }))).toBe("10 min ago");
    expect(reachedText(watch({ last_seen_seconds: 600 }), 3600)).toBe("1 h ago");
    expect(reachedText(watch({ last_seen_seconds: null }))).toBe("Not since Home Assistant started");
  });

  it("names the owner, or says there is none or it was removed", () => {
    expect(ownerText(watch({ user_id: "chen" }), "Chen")).toBe("Chen");
    expect(ownerText(watch({ user_id: "chen" }), undefined)).toBe("A Home Assistant user");
    expect(ownerText(watch({ user_id: null }), undefined)).toBe("No one yet");
    expect(ownerText(watch({ user_id: "gone", user_gone: true }), "Gone")).toBe("A removed Home Assistant user");
  });

  it("lists Paired, App, Last reached and Owner, and leaves Paired out when it is not known", () => {
    const rows = thisDeviceRows(watch({ last_provision: "2026-10-07T12:00:00Z", user_id: "chen" }), "Chen", { locale: "en-GB" });
    expect(rows.map((r) => [r.label, r.value])).toEqual([
      ["Paired", "7 Oct 2026"],
      ["App", "3.1.0 (2)"],
      ["Last reached Home Assistant", "Not since Home Assistant started"],
      ["Owner", "Chen"],
    ]);
    expect(rows[0]!.title).toBe(THIS_DEVICE_PAIRED_HELP);
    expect(thisDeviceRows(watch(), undefined).map((r) => r.label)).toEqual(["App", "Last reached Home Assistant", "Owner"]);
  });

  it("is found by pair, as the pairing card was", () => {
    for (const words of ["pair", "pairing", "paired", "owner", "app version"]) {
      expect(matchesSearch(searchTerms(words), [THIS_DEVICE_SEARCH_WORDS]), words).toBe(true);
    }
  });

  it("keeps to plain words: no dashes between clauses", () => {
    const all = [thisDeviceNote("watch"), thisDeviceNote("iphone"), THIS_DEVICE_PAIRED_HELP, THIS_DEVICE_SEARCH_WORDS];
    for (const text of all) {
      expect(text).not.toMatch(/[–—]/);
      expect(text).not.toContain(" - ");
    }
  });
});
