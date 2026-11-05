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
import { attentionText, homeDeviceRows, homeDevices, homeGroupSummary, waitsOnlyForOwnSetup } from "../src/home.js";
import { mayAddFirst, mayAddFirstToAny, mayMakeFirst, watchesToSendFirst } from "../src/move-wait-out.js";
import { syncRowWords } from "../src/sync-pill.js";
import { IPHONE_UPDATE_LABEL } from "../src/watch-app-sync.js";
import { allPhonesMove, devicesWaitText, linkDevicesOf, waitingEmptyText, waitingLibraryText, waitingPhoneMoves } from "../src/watch-pages/devices.js";
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
  START_FRESH_CONFIRM_TEXT,
  USE_WATCH_CONFIRM_TEXT,
  USE_WATCH_PHONE_MOVES_CONFIRM_TEXT,
  WAITING_FOR_WATCH_STATUS,
  WAIT_FOR_IPHONE_TEXT,
  WAIT_FOR_UPDATE_TEXT,
  WAIT_OTHER_PHONE_TEXT,
  WAIT_PHONE_MOVES_TEXT,
  WAIT_WATCH_ONLY_UPDATE_TEXT,
  WAIT_WATCH_UPDATE_TEXT,
  WATCH_SEED_LABEL,
  firstSaveAskText,
  mayFirstSave,
  noRecordStart,
  noRecordWords,
  phoneMovesOf,
  seedMayLand,
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

  it("never asks or says waiting for a watch too old to send anything, whatever the row says", () => {
    for (const seed_pending of [true, false]) {
      const old = owner("w", { ...pending, seed_pending, app_version: "3.0.1" });
      expect(firstSaveAskText(old, ["pages"])).toBeUndefined();
      expect(firstSaveAskText(old, ["notification_style"])).toBeUndefined();
      expect(noRecordWords(old, "voice")?.status).not.toBe(WAITING_FOR_WATCH_STATUS);
      // It waits for its update instead, with those words.
      expect(noRecordStart(old)).toBe("wait");
    }
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

  it("asks on a watch that said it runs its own settings, whatever paired it", () => {
    // A watch forgotten, changed on the wrist and paired by code: the forget
    // lost `holds_old_setup`, and the watch's word still stands.
    const own = { holds_old_setup: false, seed_pending: false, has_iphone: false, standard_settings: false };
    expect(firstSaveAskText(owner("w", own), ["behavior"])).toBe(REPLACE_OWN_SETTINGS_ASK_TEXT);
    expect(noRecordWords(owner("w", own), "behavior")?.status).toBe(KEEPS_OWN_SETTINGS_STATUS);
    // Only its settings: it has said nothing of another kind.
    expect(firstSaveAskText(owner("w", own), ["pages"])).toBeUndefined();
    expect(noRecordWords(owner("w", own), "voice")).toBeUndefined();
    // Never on a watch still in the wait, or on an iPhone.
    expect(firstSaveAskText(owner("w", { ...own, has_iphone: true }), ["behavior"])).toBeUndefined();
    expect(firstSaveAskText(owner("p", { ...own, device_kind: "iphone" }), ["behavior"])).toBeUndefined();
  });

  it("stays as it is on a watch a code first paired", () => {
    const fresh = { holds_old_setup: false, seed_pending: false, has_iphone: false };
    for (const said of [{}, { standard_settings: null }, { standard_settings: true }]) {
      expect(firstSaveAskText(owner("w", { ...fresh, ...said }), ["behavior"])).toBeUndefined();
      expect(noRecordWords(owner("w", { ...fresh, ...said }), "behavior")).toBeUndefined();
    }
    expect(noRecordWords(owner("w", fresh), "voice")).toBeUndefined();
    // And on an integration older than these fields.
    expect(firstSaveAskText(owner("w"), ["behavior"])).toBeUndefined();
    expect(noRecordWords(owner("w"), "behavior")).toBeUndefined();
  });

  it("does not call another kind on such a watch new", () => {
    expect(noRecordWords(owner("w", old), "voice")?.status).toBe(NOT_SAVED_HERE_STATUS);
    expect(firstSaveAskText(owner("w", old), [])).toBeUndefined();
    expect(firstSaveAskText(owner("w", old), ["rooms"])).toBeUndefined();
  });

  it("does not ask twice after Start fresh, or on an iPhone", () => {
    expect(firstSaveAskText(owner("w", { ...old, has_iphone: true }), ["behavior"])).toBeUndefined();
    expect(firstSaveAskText(owner("p", { ...old, device_kind: "iphone" }), ["behavior"])).toBeUndefined();
    expect(noRecordWords(owner("p", { ...old, device_kind: "iphone" }), "behavior")).toBeUndefined();
  });
});

describe("a seed in the minutes after the first poll", () => {
  // The watch polled, so `seed_pending` is over, but nothing says its seed
  // landed: it takes seconds, and a short session or a failed put ends with no
  // record.
  const polled = { holds_old_setup: true, seed_pending: false, seed_may_land: true, has_iphone: false };

  it("still asks before the first record of any kind the watch seeds", () => {
    for (const kind of ["notification_style", "pages", "menus", "voice", "status_pages", "control_center"]) {
      expect(firstSaveAskText(owner("w", polled), [kind])).toBe(SEED_PENDING_ASK_TEXT);
    }
    expect(firstSaveAskText(owner("w", polled), ["behavior"])).toBe(REPLACE_OWN_SETTINGS_ASK_TEXT);
    expect(seedMayLand(owner("w", polled))).toBe(true);
  });

  it("is for a watch from before the move whose wait is over, not an iPhone", () => {
    expect(seedMayLand(owner("w", { ...polled, holds_old_setup: false }))).toBe(false);
    expect(seedMayLand(owner("w", { ...polled, has_iphone: true }))).toBe(false);
    expect(seedMayLand(owner("p", { ...polled, device_kind: "iphone" }))).toBe(false);
    expect(seedMayLand(owner("w", { ...polled, seed_may_land: false }))).toBe(false);
    expect(seedMayLand(owner("w"))).toBe(false);
    expect(seedMayLand(undefined)).toBe(false);
  });

  it("no longer says to wait, as nothing would end that line", () => {
    expect(waitsForWatchSeed(owner("w", polled))).toBe(false);
    expect(watchesToSendFirst([owner("w", polled)], emptyLibrary(), "pages")).toEqual([]);
    expect(noRecordWords(owner("w", polled), "pages")?.status).toBe(NOT_SAVED_HERE_STATUS);
  });

  it("asks before a first tick, and a person can always go on", () => {
    const w = owner("W1", polled);
    const no = vi.fn(() => false);
    expect(mayAddFirst([w], emptyLibrary(), "W1", "pages", no)).toBe(false);
    expect(no).toHaveBeenCalledWith(SEED_PENDING_ASK_TEXT);
    const yes = vi.fn(() => true);
    expect(mayAddFirst([w], emptyLibrary(), "W1", "pages", yes)).toBe(true);
    expect(yes).toHaveBeenCalledOnce();
  });

  it("ends per kind once a record of that kind exists", () => {
    const w = owner("W1", polled);
    const never = vi.fn(() => false);
    expect(mayAddFirst([w], holding("W1", "pages"), "W1", "pages", never)).toBe(true);
    expect(never).not.toHaveBeenCalled();
    const asked = vi.fn(() => false);
    expect(mayAddFirst([w], holding("W1", "pages"), "W1", "menus", asked)).toBe(false);
    expect(asked).toHaveBeenCalledOnce();
  });

  it("ends for the settings when the watch reports it has none of its own, and only for them", () => {
    const standard = { ...polled, standard_settings: true };
    expect(firstSaveAskText(owner("w", standard), ["behavior"])).toBeUndefined();
    expect(firstSaveAskText(owner("w", standard), ["pages"])).toBe(SEED_PENDING_ASK_TEXT);
    expect(firstSaveAskText(owner("w", standard), ["behavior", "notification_style"])).toBe(SEED_PENDING_ASK_TEXT);
  });

  it("never asks on a watch a code first paired", () => {
    const never = vi.fn(() => false);
    expect(mayAddFirst([owner("W1", { holds_old_setup: false, has_iphone: false })], emptyLibrary(), "W1", "pages", never)).toBe(true);
    expect(never).not.toHaveBeenCalled();
  });
});

describe("a watch too old to send its setup", () => {
  // Opening it cannot send anything, so it gets the update words and no ask.
  const tooOld = { holds_old_setup: true, seed_may_land: true, has_iphone: false, app_version: "3.0.1" };

  it("asks nothing before a first record, in or after the minutes its seed may land", () => {
    for (const kind of ["notification_style", "pages", "menus", "voice", "status_pages", "control_center"]) {
      expect(firstSaveAskText(owner("w", tooOld), [kind])).toBeUndefined();
      expect(firstSaveAskText(owner("w", { ...tooOld, seed_pending: true }), [kind])).toBeUndefined();
    }
  });

  it("does not say its seed may be landing", () => {
    expect(seedMayLand(owner("w", tooOld))).toBe(false);
    expect(seedMayLand(owner("w", { ...tooOld, app_version: "3.2.0" }))).toBe(true);
  });
});

describe("a watch from before the move, once those minutes are over", () => {
  // A kind with no record has nothing coming: the watch sends nothing for a
  // kind it holds no copy of, so opening it would change nothing.
  const over = { holds_old_setup: true, seed_pending: false, seed_may_land: false, has_iphone: false };

  it("no longer asks before the first record of any kind but the settings", () => {
    for (const kind of ["notification_style", "pages", "menus", "voice", "status_pages", "control_center"]) {
      expect(firstSaveAskText(owner("w", over), [kind])).toBeUndefined();
    }
    expect(firstSaveAskText(owner("w", { ...over, standard_settings: true }), ["behavior", "notification_style"])).toBeUndefined();
  });

  it("keeps the settings' own ask, which has its own rules", () => {
    expect(firstSaveAskText(owner("w", over), ["behavior"])).toBe(REPLACE_OWN_SETTINGS_ASK_TEXT);
    expect(firstSaveAskText(owner("w", over), ["behavior", "notification_style"])).toBe(REPLACE_OWN_SETTINGS_ASK_TEXT);
    expect(noRecordWords(owner("w", over), "behavior")?.status).toBe(KEEPS_OWN_SETTINGS_STATUS);
  });

  it("asks nothing on the All tab, on a focused device, or on New page", () => {
    const never = vi.fn(() => false);
    const w = owner("W1", over);
    expect(mayAddFirst([w], emptyLibrary(), "W1", "menus", never)).toBe(true);
    expect(mayAddFirstToAny([w, owner("W2", over)], emptyLibrary(), ["W1", "W2"], "pages", never)).toBe(true);
    expect(mayMakeFirst([w], emptyLibrary(), "W1", "status_pages", never)).toEqual({ go: true });
    expect(never).not.toHaveBeenCalled();
  });

  it("still asks once if one of several watches is in its minutes", () => {
    const ask = vi.fn(() => true);
    const landing = owner("W2", { ...over, seed_may_land: true });
    expect(mayAddFirstToAny([owner("W1", over), landing], emptyLibrary(), ["W1", "W2"], "pages", ask)).toBe(true);
    expect(ask).toHaveBeenCalledOnce();
  });

  it("gives Home's lineup nothing to ask", () => {
    expect(firstSaveAskText(owner("w", over), ["pages"])).toBeUndefined();
    expect(firstSaveAskText(owner("w", { ...over, seed_may_land: true }), ["pages"])).toBe(SEED_PENDING_ASK_TEXT);
    expect(firstSaveAskText(owner("w", { ...over, seed_pending: true }), ["pages"])).toBe(SEED_PENDING_ASK_TEXT);
  });

  it("does not change the wait", () => {
    expect(noRecordStart(owner("w", over))).toBe("start");
    expect(noRecordStart(owner("w", { ...over, seed_may_land: true }))).toBe("start");
    expect(noRecordStart(owner("w", { ...over, has_iphone: true }))).toBe("wait");
    expect(noRecordStart(owner("w", { ...over, has_iphone: true, seed_may_land: false }))).toBe("wait");
  });
});

describe("a default user's 3.0.1 watch after the phone finished", () => {
  const row = { has_iphone: false, seed_pending: true, holds_old_setup: true, app_version: "3.0.1", token: 1, applied_token: 1, complication_count: 1 } as Partial<OwnerSummary>;
  const rowsOf = (o: OwnerSummary) => homeDeviceRows(homeDevices([o], (d) => d.owner_watch_id, (d) => d.owner_watch_id));

  it("keeps waiting, with the words about the watch, whatever has_iphone says", () => {
    expect(noRecordStart(owner("w", row))).toBe("wait");
    expect(phoneMovesOf(owner("w", { ...row, owner_iphone_moves: true }))).toBe(true);
    expect(waitForIphoneText("3.0.1", phoneMovesOf(owner("w", { ...row, owner_iphone_moves: true })))).toBe(WAIT_WATCH_UPDATE_TEXT);
    expect(waitForIphoneText("3.0.1", phoneMovesOf(owner("w", { ...row, has_iphone: true, owner_iphone_moves: true })))).toBe(WAIT_WATCH_UPDATE_TEXT);
    expect(linkDevicesOf([owner("w", { ...row, owner_iphone_moves: true })], false)[0]?.phoneMoves).toBe(true);
  });

  it("makes no claim about an iPhone that was forgotten, or whose wait was ended by hand", () => {
    for (const gone of [row, { ...row, owner_iphone_moves: false }, { ...row, owner_iphone_moves: false, another_iphone_moves: true }]) {
      expect(phoneMovesOf(owner("w", gone))).toBe("watch-only");
      const line = waitForIphoneText("3.0.1", phoneMovesOf(owner("w", gone)));
      expect(line).toBe(WAIT_WATCH_ONLY_UPDATE_TEXT);
      expect(line).toContain("Your watch needs Wrist Assistant 3.2 or later");
      expect(line).not.toContain("iPhone");
    }
    expect(linkDevicesOf([owner("w", row)], false)[0]?.phoneMoves).toBe("watch-only");
    expect(useWatchQuestion("watch-only")).toBe(NO_IPHONE_QUESTION);
    expect(waitingLibraryText("menus", true, "watch-only")).toBe("Your watch needs Wrist Assistant 3.2 or later to send its menus here.");
    const devices = linkDevicesOf([owner("w", row)], false);
    expect(allPhonesMove(devices, new Set(["w"]))).toBe(false);
    expect(waitingPhoneMoves(devices, new Set(["w"]))).toBe("watch-only");
    expect(menusEmptyText(devices, "", new Set(["w"]))).not.toContain("iPhone");
  });

  it("does not say an iPhone that may still be old is up to date", () => {
    expect(waitForIphoneText("3.0.1", phoneMovesOf(owner("w", { ...row, has_iphone: true, owner_iphone_moves: false })))).toBe(WAIT_FOR_UPDATE_TEXT);
  });

  it("does not count as Synced, with or without a record, and names the release", () => {
    const [device] = rowsOf(owner("w", row));
    expect(device?.sync).toBe("waiting");
    expect(device?.waitingFor).toEqual([IPHONE_UPDATE_LABEL]);
    expect(syncRowWords(device!)).toBe("Waiting: Wrist Assistant 3.2");
    expect(homeGroupSummary(["waiting"]).text).toBe("1 waiting");
    // The phone's move counts as collected, as it signs as the watch.
    const held = homeDeviceRows(
      homeDevices([owner("w", row)], (d) => d.owner_watch_id, (d) => d.owner_watch_id),
      new Map([["w", { waiting: [], delivered: true }]]),
    );
    expect(syncRowWords(held[0]!)).toBe("Waiting: Wrist Assistant 3.2");
  });

  it("leaves a watch that is only old, and an up to date one, as they were", () => {
    const alone = owner("w", { has_iphone: false, holds_old_setup: false, app_version: "3.0.1" });
    expect(noRecordStart(alone)).toBe("start");
    expect(phoneMovesOf(alone)).toBeUndefined();
    expect(noRecordStart(owner("w", { has_iphone: false, holds_old_setup: true, app_version: "3.2.0" }))).toBe("start");
    expect(noRecordStart(owner("p", { ...row, device_kind: "iphone" }))).toBe("start");
  });

  it("New page says why it cannot go on, as only that update helps", () => {
    const never = vi.fn(() => true);
    const may = mayMakeFirst([owner("W1", row)], emptyLibrary(), "w1", "pages", never);
    expect(may).toEqual({ go: false, note: WAIT_WATCH_ONLY_UPDATE_TEXT });
    expect(never).not.toHaveBeenCalled();
  });
});

describe("New page's first record", () => {
  it("asks what Start fresh asks while a watch waits for its iPhone", () => {
    const w = owner("W1", { has_iphone: true });
    const no = vi.fn(() => false);
    expect(mayMakeFirst([w], emptyLibrary(), "W1", "pages", no)).toEqual({ go: false });
    expect(no).toHaveBeenCalledWith(START_FRESH_CONFIRM_TEXT);
    expect(mayMakeFirst([w], emptyLibrary(), "W1", "pages", () => true)).toEqual({ go: true });
  });

  it("asks what a first tick asks on a watch from before the move", () => {
    const no = vi.fn(() => false);
    const w = owner("W1", { has_iphone: false, holds_old_setup: true, seed_pending: true });
    expect(mayMakeFirst([w], emptyLibrary(), "W1", "status_pages", no)).toEqual({ go: false });
    expect(no).toHaveBeenCalledWith(SEED_PENDING_ASK_TEXT);
  });

  it("asks nothing of a fresh watch, or of a device that holds the kind", () => {
    const never = vi.fn(() => false);
    expect(mayMakeFirst([owner("W1", { has_iphone: false, holds_old_setup: false })], emptyLibrary(), "W1", "pages", never)).toEqual({ go: true });
    expect(mayMakeFirst([owner("W1", { has_iphone: true })], holding("W1", "pages"), "W1", "pages", never)).toEqual({ go: true });
    expect(never).not.toHaveBeenCalled();
  });
});

describe("the iPhone paired again under a new id", () => {
  const k2 = { has_iphone: true, owner_iphone_moves: false, another_iphone_moves: true };

  it("does not say to update, nor assume the iPhone is gone", () => {
    expect(phoneMovesOf(owner("w", k2))).toBe("another");
    expect(waitForIphoneText("3.2.0", "another")).toBe(WAIT_OTHER_PHONE_TEXT);
    expect(WAIT_OTHER_PHONE_TEXT).not.toContain("Update Wrist Assistant");
    expect(WAIT_OTHER_PHONE_TEXT).toContain("use what is on the watch");
    expect(useWatchQuestion("another")).toBe(NOTHING_MORE_QUESTION);
    expect(useWatchConfirmText("another")).toBe(USE_WATCH_PHONE_MOVES_CONFIRM_TEXT);
  });

  it("names the watch when the watch is what is too old", () => {
    expect(waitForIphoneText("3.0.1", "another")).toBe(WAIT_WATCH_UPDATE_TEXT);
    expect(waitForIphoneText("3.0.1", "another")).not.toContain("Once your iPhone has it");
  });

  it("reaches the lists and the HTTP actions line, and the wait goes on", () => {
    const devices = linkDevicesOf([owner("w", k2)], false);
    expect(devices[0]?.phoneMoves).toBe("another");
    expect(allPhonesMove(devices, new Set(["w"]))).toBe(true);
    expect(noRecordStart(owner("w", k2))).toBe("wait");
    expect(homeOwesHttpActions([owner("w", k2)])).toBe(false);
    expect(devicesWaitText("3.2.0", "another")).toContain(WAIT_OTHER_PHONE_TEXT);
  });

  it("says the same on the Pages, Status pages and Menus tabs", () => {
    const devices = linkDevicesOf([owner("w", k2), owner("x", k2)], false);
    const waiting = new Set(["w", "x"]);
    expect(waitingPhoneMoves(devices, waiting)).toBe("another");
    expect(waitingLibraryText("status pages", false, "another")).toBe(WAIT_OTHER_PHONE_TEXT);
    expect(waitingLibraryText("pages", false, waitingPhoneMoves(devices, waiting))).toBe(WAIT_OTHER_PHONE_TEXT);
    expect(menusEmptyText(devices, "", waiting)).toBe(`None yet. ${WAIT_OTHER_PHONE_TEXT}`);
    expect(waitingLibraryText("pages", false, "another")).not.toContain("its pages");
    // A too old watch still names its own update.
    expect(waitingLibraryText("pages", true, "another")).toContain("Your watch needs Wrist Assistant");
  });

  it("uses those words only when every waiting watch is on that route", () => {
    const devices = linkDevicesOf([owner("w", k2), owner("own", { has_iphone: true, owner_iphone_moves: true }), owner("old", { has_iphone: true, owner_iphone_moves: false })], false);
    expect(waitingPhoneMoves(devices, new Set(["w", "own"]))).toBe(true);
    expect(waitingPhoneMoves(devices, new Set(["own"]))).toBe(true);
    expect(waitingPhoneMoves(devices, new Set(["w", "old"]))).toBe(false);
    expect(waitingPhoneMoves(devices, new Set())).toBe(false);
    expect(waitingLibraryText("pages", false, true)).toBe("Your iPhone is up to date. If its pages do not come here, use what is on the watch.");
    expect(waitingLibraryText("pages", false, false)).toBe("Update Wrist Assistant on your iPhone and open it once. Its pages move here by themselves.");
  });

  it("prefers what the watch's own iPhone says", () => {
    expect(phoneMovesOf(owner("w", { ...k2, owner_iphone_moves: true }))).toBe(true);
    expect(phoneMovesOf(owner("w", { has_iphone: true, owner_iphone_moves: false }))).toBe(false);
    expect(phoneMovesOf(owner("w", { has_iphone: true }))).toBeUndefined();
  });
});

describe("the ask after Use what is on the watch", () => {
  it("says to open the watch first, and promises nothing about the iPhone's copy", () => {
    expect(USE_WATCH_CONFIRM_TEXT).toContain("Open Wrist Assistant on the watch next, before you update or open your iPhone.");
    expect(USE_WATCH_CONFIRM_TEXT).toContain("Until the watch has sent it, what your iPhone sends lands first.");
    expect(USE_WATCH_CONFIRM_TEXT).not.toContain("will not move here later");
    expect(USE_WATCH_PHONE_MOVES_CONFIRM_TEXT).toContain("Open Wrist Assistant on the watch next.");
  });
});

describe("Home while the watch's own setup may still come", () => {
  const seed = { has_iphone: false, seed_pending: true, holds_old_setup: true, app_version: "3.2.0", token: 1, applied_token: 1, complication_count: 1 } as Partial<OwnerSummary>;
  const rows = (o: OwnerSummary, watchApp = new Map()) => homeDeviceRows(homeDevices([o], (d) => d.owner_watch_id, (d) => d.owner_watch_id), watchApp);

  it("says Waiting for the watch in the device's header, not Synced", () => {
    const [device] = rows(owner("w", seed));
    expect(device?.sync).toBe("waiting");
    expect(syncRowWords(device!)).toBe(WAITING_FOR_WATCH_STATUS);
    expect(attentionText(device!, undefined)).toBe(WAITING_FOR_WATCH_STATUS);
    expect(syncRowWords(rows(owner("w", seed), new Map([["w", { waiting: [], delivered: true }]]))[0]!)).toBe(WAITING_FOR_WATCH_STATUS);
  });

  it("says it beside the person's name too, not All synced", () => {
    expect(homeGroupSummary(["waiting"], 1)).toEqual({ text: WAITING_FOR_WATCH_STATUS, tone: "waiting" });
    expect(homeGroupSummary(["synced", "waiting"], 1).text).toBe(WAITING_FOR_WATCH_STATUS);
    // Another device waits for something else: the count says both.
    expect(homeGroupSummary(["waiting", "waiting"], 1).text).toBe("2 waiting");
    expect(homeGroupSummary(["synced"]).text).toBe("All synced");
  });

  it("counts only a device that waits for its own setup and nothing else", () => {
    expect(waitsOnlyForOwnSetup({ waitingFor: [WATCH_SEED_LABEL] })).toBe(true);
    expect(waitsOnlyForOwnSetup({ waitingFor: ["complications", WATCH_SEED_LABEL] })).toBe(false);
    expect(waitsOnlyForOwnSetup({ waitingFor: ["pages", WATCH_SEED_LABEL] })).toBe(false);
    expect(waitsOnlyForOwnSetup({ waitingFor: [WATCH_SEED_LABEL], rejected: ["pages"] })).toBe(false);
    expect(waitsOnlyForOwnSetup({ waitingFor: [] })).toBe(false);
    const [mixed] = rows(owner("w", { ...seed, applied_token: 0 }));
    expect(mixed?.waitingFor).toEqual(["complications", WATCH_SEED_LABEL]);
    expect(waitsOnlyForOwnSetup(mixed!)).toBe(false);
    expect(homeGroupSummary(["waiting"], 0).text).toBe("1 waiting");
    expect(readFileSync(join(SRC, "panel.ts"), "utf8")).toContain(`syncStateOf(d) === "waiting" && waitsOnlyForOwnSetup(d)`);
  });

  it("ends with the wait, and never on a watch a code first paired", () => {
    expect(syncRowWords(rows(owner("w", { ...seed, seed_pending: false }))[0]!)).toBe("Synced");
    expect(syncRowWords(rows(owner("w", { ...seed, holds_old_setup: false, seed_pending: false }))[0]!)).toBe("Synced");
  });

  it("keeps its dashed line clear of the Pages row", () => {
    expect(readFileSync(join(SRC, "home-lineup.ts"), "utf8")).toContain(`class="hl-empty hl-seed-wait"`);
    expect(readFileSync(join(SRC, "home-lineup-look.ts"), "utf8")).toMatch(/\.hl-seed-wait \{ margin-bottom: 18px; \}/);
  });
});
