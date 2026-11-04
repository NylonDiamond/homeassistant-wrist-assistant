// What the panel says and asks around a watch's first record, once its iPhone
// has moved on: the wait lines never tell someone to update an iPhone that is
// already up to date, a first Save never silently replaces what a watch from
// before the move runs, and nothing leaves a person stuck.

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it, vi } from "vitest";

import type { OwnerSummary } from "../src/ha-api.js";
import { type Library, libraryOf } from "../src/library/model.js";
import { mayAddFirst, mayAddFirstToAny, watchesToSendFirst } from "../src/move-wait-out.js";
import { allPhonesMove, devicesWaitText, linkDevicesOf, waitingEmptyText, waitingLibraryText } from "../src/watch-pages/devices.js";
import { homeOwesHttpActions } from "../src/watch-http-actions/http-actions-editor.js";
import { menusEmptyText, menusWaitText } from "../src/watch-menus/all-menus-model.js";
import { roomsWaitText } from "../src/watch-rooms/model.js";
import { voiceDevicesWaitText } from "../src/watch-voice/links.js";
import {
  AWAITING_MOVE_TEXT,
  KEEPS_OWN_SETTINGS_STATUS,
  NOTHING_MORE_QUESTION,
  NOT_SAVED_HERE_STATUS,
  NO_IPHONE_QUESTION,
  REPLACE_OWN_SETTINGS_ASK_TEXT,
  SEED_PENDING_ASK_TEXT,
  STANDARD_SETTINGS_STATUS,
  USE_WATCH_CONFIRM_TEXT,
  USE_WATCH_PHONE_MOVES_CONFIRM_TEXT,
  WAITING_FOR_WATCH_STATUS,
  WAIT_FOR_IPHONE_TEXT,
  WAIT_FOR_UPDATE_TEXT,
  WAIT_PHONE_MOVES_TEXT,
  WAIT_WATCH_UPDATE_TEXT,
  firstSaveAskText,
  mayFirstSave,
  noRecordStart,
  noRecordWords,
  useWatchConfirmText,
  useWatchQuestion,
  waitForIphoneText,
  waitsForWatchSeed,
} from "../src/watch-settings.js";
import { libraryErrorText } from "../src/library/client.js";

const SRC = join(dirname(fileURLToPath(import.meta.url)), "..", "src");

const owner = (id: string, extra: Partial<OwnerSummary> = {}): OwnerSummary => ({
  owner_watch_id: id,
  device_name: id,
  device_kind: "watch",
  paired_iphone_name: null,
  app_version: "3.2.0",
  screen_size: null,
  complication_count: 0,
  token: 1,
  is_orphan: false,
  ...extra,
} as OwnerSummary);

const phone = (id: string, version: string): OwnerSummary => owner(id, { device_kind: "iphone", app_version: version });

const emptyLibrary = (): Library => libraryOf({ pages: [], status_pages: [], menus: [], picks: {} } as never);
const holding = (ownerId: string, kind: string): Library =>
  libraryOf({ pages: [], status_pages: [], menus: [], picks: { [ownerId]: { [kind]: [] } } } as never);

describe("the wait lines", () => {
  it("say to update only an iPhone that is not known to be up to date", () => {
    expect(waitForIphoneText("3.2.0")).toBe(WAIT_FOR_IPHONE_TEXT);
    expect(waitForIphoneText("3.2.0", false)).toBe(WAIT_FOR_IPHONE_TEXT);
    expect(waitForIphoneText("3.2.0", null)).toBe(WAIT_FOR_IPHONE_TEXT);
    expect(waitForIphoneText("3.0.1", false)).toBe(WAIT_FOR_UPDATE_TEXT);
  });

  it("never say to update an iPhone that already runs an app that moves", () => {
    for (const line of [
      waitForIphoneText("3.2.0", true),
      waitForIphoneText("3.0.1", true),
      devicesWaitText("3.2.0", true),
      waitingEmptyText("pages", "this watch", "3.2.0", true),
      menusWaitText("3.2.0", true),
      roomsWaitText("3.2.0", true),
      voiceDevicesWaitText("3.2.0", true),
      waitingLibraryText("menus", false, true),
      waitingLibraryText("menus", true, true),
    ]) {
      expect(line).toContain("Your iPhone is up to date.");
      expect(line).not.toContain("Update Wrist Assistant on your iPhone");
      expect(line).not.toContain("Once your iPhone has it");
    }
    expect(waitForIphoneText("3.2.0", true)).toBe(WAIT_PHONE_MOVES_TEXT);
    expect(waitForIphoneText("3.0.1", true)).toBe(WAIT_WATCH_UPDATE_TEXT);
  });

  it("use the phone's state from the owner row, per watch", () => {
    const devices = linkDevicesOf([
      owner("done", { owner_iphone_moves: true }),
      owner("old", { owner_iphone_moves: false }),
    ], false);
    expect(devices.find((d) => d.ownerId === "done")?.phoneMoves).toBe(true);
    expect(allPhonesMove(devices, new Set(["done"]))).toBe(true);
    // One phone still older keeps the update line, which is true for it.
    expect(allPhonesMove(devices, new Set(["done", "old"]))).toBe(false);
    expect(allPhonesMove(devices, new Set())).toBe(false);
    expect(menusEmptyText(devices, "", new Set(["done"]))).toContain("up to date");
    expect(menusEmptyText(devices, "", new Set(["old"]))).toContain("Update Wrist Assistant on your iPhone");
  });

  it("say nothing false when a write is refused for a watch the panel cannot name", () => {
    expect(libraryErrorText({ code: "awaiting_move", message: "x" })).toBe(AWAITING_MOVE_TEXT);
    expect(AWAITING_MOVE_TEXT).toContain("update it first if it is older");
  });

  it("do not assume the iPhone is gone when it is up to date", () => {
    expect(useWatchQuestion(true)).toBe(NOTHING_MORE_QUESTION);
    expect(useWatchQuestion(false)).toBe(NO_IPHONE_QUESTION);
    expect(useWatchQuestion(undefined)).toBe(NO_IPHONE_QUESTION);
    expect(useWatchConfirmText(true)).toBe(USE_WATCH_PHONE_MOVES_CONFIRM_TEXT);
    expect(useWatchConfirmText(false)).toBe(USE_WATCH_CONFIRM_TEXT);
    expect(useWatchConfirmText(true)).not.toContain("Your iPhone's copy");
  });

  it("are honest about settings in both forms of the ask", () => {
    for (const text of [USE_WATCH_CONFIRM_TEXT, USE_WATCH_PHONE_MOVES_CONFIRM_TEXT]) {
      expect(text).toContain("If it cannot send its settings, it keeps them, and your first Save of settings here replaces them.");
    }
  });
});

describe("HTTP actions' update line", () => {
  it("stays away from a fresh home with an iPhone on the move's app", () => {
    expect(homeOwesHttpActions([phone("p", "3.2.0")])).toBe(false);
    expect(homeOwesHttpActions([phone("p", "3.2.0"), owner("w", { paired_iphone_name: "p", has_iphone: false })])).toBe(false);
    expect(homeOwesHttpActions([])).toBe(false);
  });

  it("stays away from a watch still waiting on an iPhone that has moved", () => {
    expect(homeOwesHttpActions([owner("w", { has_iphone: true, owner_iphone_moves: true })])).toBe(false);
  });

  it("shows while a phone of the home is older than the move", () => {
    expect(homeOwesHttpActions([phone("p", "3.0.1")])).toBe(true);
    expect(homeOwesHttpActions([owner("w", { has_iphone: true, owner_iphone_moves: false })])).toBe(true);
    // An integration older than the field says what it always said.
    expect(homeOwesHttpActions([owner("w", { has_iphone: true })])).toBe(true);
  });

  it("ignores an orphan and a watch that is only old itself", () => {
    expect(homeOwesHttpActions([{ ...phone("p", "3.0.1"), is_orphan: true }])).toBe(false);
    expect(homeOwesHttpActions([owner("w", { app_version: "3.0.1", has_iphone: false })])).toBe(false);
  });
});

describe("a watch's own setup that may still come", () => {
  const pending = { holds_old_setup: true, seed_pending: true, has_iphone: false };

  it("waits only after the wait has ended and until the watch polled", () => {
    expect(waitsForWatchSeed(owner("w", pending))).toBe(true);
    expect(waitsForWatchSeed(owner("w", { ...pending, seed_pending: false }))).toBe(false);
    expect(waitsForWatchSeed(owner("w", { ...pending, has_iphone: true }))).toBe(false);
    expect(waitsForWatchSeed(owner("w"))).toBe(false);
    expect(waitsForWatchSeed(undefined)).toBe(false);
  });

  it("never waits for a watch too old to send anything, nor an iPhone", () => {
    expect(waitsForWatchSeed(owner("w", { ...pending, app_version: "3.0.1" }))).toBe(false);
    expect(waitsForWatchSeed(owner("p", { ...pending, device_kind: "iphone" }))).toBe(false);
  });

  it("opens the editors ready, so nothing refuses a person", () => {
    expect(noRecordStart(owner("w", pending))).toBe("start");
  });

  it("asks first on every kind the watch seeds, and says to open the watch", () => {
    for (const kind of ["behavior", "notification_style", "pages", "menus", "voice", "status_pages", "control_center"]) {
      expect(firstSaveAskText(owner("w", pending), [kind])).toBe(SEED_PENDING_ASK_TEXT);
    }
    expect(firstSaveAskText(owner("w", pending), ["rooms"])).toBeUndefined();
    expect(SEED_PENDING_ASK_TEXT).toContain("Open Wrist Assistant on the watch first.");
    expect(SEED_PENDING_ASK_TEXT).toContain("Saving now replaces what is on the watch.");
  });

  it("lets a person go on, and takes no for an answer", () => {
    const yes = vi.fn(() => true);
    const no = vi.fn(() => false);
    expect(mayFirstSave(owner("w", pending), ["pages"], yes)).toBe(true);
    expect(yes).toHaveBeenCalledWith(SEED_PENDING_ASK_TEXT);
    expect(mayFirstSave(owner("w", pending), ["pages"], no)).toBe(false);
  });

  it("names the wait in the head", () => {
    expect(noRecordWords(owner("w", pending), "voice")?.status).toBe(WAITING_FOR_WATCH_STATUS);
  });

  it("asks once before a first tick or a new page, and not for a kind it holds", () => {
    const w = owner("W1", pending);
    const never = vi.fn(() => true);
    expect(mayAddFirst([w], undefined, "W1", "pages", never)).toBe(true);
    expect(mayAddFirst([w], holding("W1", "pages"), "W1", "pages", never)).toBe(true);
    expect(mayAddFirst([w], emptyLibrary(), "other", "pages", never)).toBe(true);
    expect(never).not.toHaveBeenCalled();

    const ask = vi.fn(() => false);
    expect(mayAddFirst([w], emptyLibrary(), "w1", "pages", ask)).toBe(false);
    expect(ask).toHaveBeenCalledOnce();

    const yes = vi.fn(() => true);
    const both = owner("W2", pending);
    expect(mayAddFirstToAny([w, both], emptyLibrary(), ["W1", "W2"], "pages", yes)).toBe(true);
    expect(yes).toHaveBeenCalledOnce();
    expect(watchesToSendFirst([w, both], holding("W1", "menus"), "menus").map((o) => o.owner_watch_id)).toEqual(["W2"]);
  });

  it.each([
    ["watch-pages/all-pages.ts", "mayAddFirst("],
    ["watch-pages/all-pages.ts", "mayAddFirstToAny("],
    ["watch-pages/page-editor.ts", "mayAddFirst("],
    ["watch-status-pages/status-pages-editor.ts", "mayAddFirst("],
    ["watch-menus/menu-editor.ts", "mayAddFirst("],
    ["watch-menus/all-menus.ts", "mayAddFirst("],
    ["home-lineup.ts", "SEED_PENDING_ASK_TEXT"],
    ["watch-settings-view.ts", "mayFirstSave("],
    ["watch-voice/voice-editor.ts", "mayFirstSave("],
    ["watch-rooms/rooms-editor.ts", "mayFirstSave("],
  ])("asks in %s", (file, call) => {
    expect(readFileSync(join(SRC, file), "utf8")).toContain(call);
  });
});

describe("a first Save of settings", () => {
  const old = { holds_old_setup: true, seed_pending: false, has_iphone: false };

  it("asks on a watch from before the move, which keeps its own settings", () => {
    expect(firstSaveAskText(owner("w", old), ["behavior"])).toBe(REPLACE_OWN_SETTINGS_ASK_TEXT);
    expect(firstSaveAskText(owner("w", { ...old, app_version: "3.0.1" }), ["behavior"])).toBe(REPLACE_OWN_SETTINGS_ASK_TEXT);
    expect(noRecordWords(owner("w", old), "behavior")?.status).toBe(KEEPS_OWN_SETTINGS_STATUS);
    expect(noRecordWords(owner("w", old), "behavior")?.title).toContain("Your first Save replaces them.");
  });

  it("does not ask on a watch that said it runs the standard settings, and says so", () => {
    const standard = { ...old, standard_settings: true };
    expect(firstSaveAskText(owner("w", standard), ["behavior"])).toBeUndefined();
    expect(noRecordWords(owner("w", standard), "behavior")?.status).toBe(STANDARD_SETTINGS_STATUS);
    expect(STANDARD_SETTINGS_STATUS).toBe("Using the standard settings, not saved yet");
  });

  it("stays as it is on a watch a code first paired", () => {
    const fresh = { holds_old_setup: false, seed_pending: false, has_iphone: false };
    expect(firstSaveAskText(owner("w", fresh), ["behavior"])).toBeUndefined();
    expect(noRecordWords(owner("w", fresh), "behavior")).toBeUndefined();
    expect(noRecordWords(owner("w", fresh), "voice")).toBeUndefined();
    // And on an integration older than these fields.
    expect(firstSaveAskText(owner("w"), ["behavior"])).toBeUndefined();
    expect(noRecordWords(owner("w"), "behavior")).toBeUndefined();
  });

  it("does not call another kind on such a watch new", () => {
    expect(noRecordWords(owner("w", old), "voice")?.status).toBe(NOT_SAVED_HERE_STATUS);
    expect(firstSaveAskText(owner("w", old), ["voice"])).toBeUndefined();
    expect(firstSaveAskText(owner("w", old), [])).toBeUndefined();
  });

  it("does not ask twice after Start fresh, or on an iPhone", () => {
    expect(firstSaveAskText(owner("w", { ...old, has_iphone: true }), ["behavior"])).toBeUndefined();
    expect(firstSaveAskText(owner("p", { ...old, device_kind: "iphone" }), ["behavior"])).toBeUndefined();
    expect(noRecordWords(owner("p", { ...old, device_kind: "iphone" }), "behavior")).toBeUndefined();
  });
});
