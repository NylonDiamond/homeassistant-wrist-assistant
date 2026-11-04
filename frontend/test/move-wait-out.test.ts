// The way out of the wait for an iPhone's move: the words, who is offered it,
// the command, and that every screen that waits has it, since a person whose
// iPhone is gone has no other way to keep what is on the watch.

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it, vi } from "vitest";

import { type HassLike, endMoveWait } from "../src/ha-api.js";
import {
  NO_IPHONE_QUESTION,
  USE_WATCH_BUTTON,
  USE_WATCH_CONFIRM_TEXT,
  noRecordStart,
  offersUseWatch,
  waitingWatchText,
} from "../src/watch-settings.js";
import { SETUP_MOVE_PUBLIC_VERSION } from "../src/version.js";

const SRC = join(dirname(fileURLToPath(import.meta.url)), "..", "src");

describe("the way out of the wait", () => {
  it("says it in short words, and warns the iPhone's copy will not move later", () => {
    expect(NO_IPHONE_QUESTION).toBe("No longer have that iPhone?");
    expect(USE_WATCH_BUTTON).toBe("Use what is on the watch");
    expect(USE_WATCH_CONFIRM_TEXT).toContain("Your iPhone's copy will not move here later.");
    expect(waitingWatchText("Kitchen Watch")).toBe("Kitchen Watch is waiting for its iPhone.");
  });

  it("is for a watch whose app can send its setup", () => {
    expect(offersUseWatch({ app_version: SETUP_MOVE_PUBLIC_VERSION })).toBe(true);
    expect(offersUseWatch({ app_version: "3.0.1" })).toBe(false);
    expect(offersUseWatch(undefined)).toBe(false);
  });

  it("ends the wait with one command", async () => {
    const sendMessagePromise = vi.fn().mockResolvedValue({ ok: true, watch_id: "w", changed: true, polling: false });
    const hass = { connection: { sendMessagePromise } } as unknown as HassLike;
    await endMoveWait(hass, "w");
    expect(sendMessagePromise).toHaveBeenCalledWith({ type: "wrist_assistant/devices/end_move_wait", watch_id: "w" });
  });

  it("clears the wait lines once Home Assistant says no iPhone", () => {
    expect(noRecordStart({ has_iphone: true })).toBe("wait");
    expect(noRecordStart({ has_iphone: false })).toBe("start");
  });

  it.each([
    ["watch-settings-view.ts", "renderMoveWaitOut("],
    ["watch-rooms/rooms-editor.ts", "renderMoveWaitOut("],
    ["watch-voice/voice-editor.ts", "renderMoveWaitOut("],
    ["watch-voice/voice-editor.ts", "renderMoveWaitOuts("],
    ["watch-pages/all-pages.ts", "renderLibraryWaitOuts("],
    ["watch-pages/page-editor.ts", "renderLibraryWaitOuts("],
    ["watch-status-pages/status-pages-editor.ts", "renderLibraryWaitOuts("],
    ["watch-menus/all-menus.ts", "renderLibraryWaitOuts("],
    ["watch-menus/menu-editor.ts", "renderLibraryWaitOuts("],
    ["home-lineup.ts", "renderMoveWaitOut("],
  ])("is on the screen in %s", (file, call) => {
    expect(readFileSync(join(SRC, file), "utf8")).toContain(call);
  });

  it("is on New page, beside the watches it locks", () => {
    const allPages = readFileSync(join(SRC, "watch-pages/all-pages.ts"), "utf8");
    expect(allPages).toContain("waitOuts: library === undefined ? nothing : renderLibraryWaitOuts(");
  });
});

describe("the words about updating the integration", () => {
  it("name Marketplace in every string the panel shows", async () => {
    const { UPDATE_INTEGRATION_TEXT, NEWER_VERSION_TEXT } = await import("../src/friendly-error.js");
    expect(UPDATE_INTEGRATION_TEXT).toContain("Marketplace or HACS");
    expect(NEWER_VERSION_TEXT).toContain("Marketplace or HACS");
  });
});
