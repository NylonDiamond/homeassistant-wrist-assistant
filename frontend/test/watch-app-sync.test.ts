// Whether a watch has watch app records still to collect, and Home's verdict
// per device: the worse of its complications and its watch app.

import { describe, expect, it } from "vitest";

import { NOT_SYNCED_TEXT, attentionText, homeDeviceLabel, homeDeviceRows, homeDeviceWhy, homeDevices, needsAttention } from "../src/home.js";
import type { OwnerSummary } from "../src/ha-api.js";
import { deviceSyncLabel, homeSync } from "../src/send-state.js";
import {
  HTTP_ACTIONS_PART_LABEL,
  IPHONE_MOVE_LABEL,
  PHONE_APP_PARTS,
  PHONE_REJECTED_SAVE_TEXT,
  REJECTED_SAVE_TEXT,
  WATCH_APP_PARTS,
  type WatchAppSync,
  deviceVerdict,
  httpActionsDeliveryFor,
  phoneAppSync,
  readWatchAppSync,
  rejectedSaveText,
  summaryUnknown,
  summaryWatchAppSyncs,
  waitingForText,
  watchAppSync,
  watchAppSyncKey,
} from "../src/watch-app-sync.js";

const rec = (revision: number, delivered: number) => ({ revision, delivered_revision: delivered });

describe("watchAppSync", () => {
  it("lists the kinds a device has not collected, in the watch row's order", () => {
    const sync = watchAppSync(new Map([
      ["notification_style", rec(3, 2)],
      ["pages", rec(5, 4)],
      ["behavior", rec(2, 2)],
    ]));
    expect(sync).toEqual({ waiting: ["pages", "notification style"], delivered: true });
  });

  it("counts a kind with no record for neither side", () => {
    expect(watchAppSync(new Map([["pages", rec(0, 0)], ["menus", undefined]]))).toEqual({ waiting: [], delivered: false, noRecord: true });
  });

  it("says when Home Assistant holds no record of any part, the HTTP action library aside", () => {
    expect(watchAppSync(new Map(), rec(3, 3))).toEqual({ waiting: [], delivered: true, noRecord: true });
    expect(watchAppSync(new Map([["menus", rec(1, 0)]]))).toEqual({ waiting: ["menus"], delivered: false });
    expect(phoneAppSync(new Map())).toEqual({ waiting: [], delivered: false, noRecord: true });
  });

  it("calls the behavior record settings, which Rooms writes too", () => {
    expect(WATCH_APP_PARTS.find((p) => p.kind === "behavior")?.label).toBe("settings");
    expect(watchAppSync(new Map([["behavior", rec(7, 6)]])).waiting).toEqual(["settings"]);
  });

  it("calls a second home's own rooms record rooms, after settings", () => {
    const kinds = WATCH_APP_PARTS.map((p) => p.kind);
    expect(kinds.indexOf("rooms")).toBe(kinds.indexOf("behavior") + 1);
    expect(watchAppSync(new Map([["rooms", rec(3, 2)], ["behavior", rec(1, 1)]]))).toEqual({ waiting: ["rooms"], delivered: true });
  });

  it("asks every kind the panel writes, never the phone's catalog", () => {
    expect(WATCH_APP_PARTS.map((p) => p.kind).sort()).toEqual(
      ["behavior", "control_center", "menus", "notification_style", "pages", "rooms", "status_pages", "voice"],
    );
  });
});

describe("readWatchAppSync", () => {
  it("reads every kind, and counts a refused kind as no record", async () => {
    const asked: string[] = [];
    const sync = await readWatchAppSync(async (kind) => {
      asked.push(kind);
      if (kind === "control_center") throw Object.assign(new Error("unknown kind"), { code: "invalid" });
      return kind === "menus" ? rec(4, 3) : rec(1, 1);
    });
    expect(asked.sort()).toEqual(WATCH_APP_PARTS.map((p) => p.kind).sort());
    expect(sync).toEqual({ waiting: ["menus"], delivered: true });
  });

  it("says nothing when every read failed", async () => {
    expect(await readWatchAppSync(async () => { throw new Error("unauthorized"); })).toBeUndefined();
  });
});

describe("summaryWatchAppSyncs", () => {
  const full = (revision: number, delivered: number) => ({ revision, delivered_revision: delivered, rejected_revision: 0 });

  it("gives each watch asked about its verdict from the one answer", () => {
    const syncs = summaryWatchAppSyncs({ owners: {
      w1: { pages: full(5, 4), behavior: full(2, 2) },
      w2: { menus: full(1, 1) },
      gone: { pages: full(9, 1) },
    } }, ["w1", "w2"]);
    expect([...syncs.keys()]).toEqual(["w1", "w2"]);
    expect(syncs.get("w1")).toEqual({ waiting: ["pages"], delivered: true });
    expect(syncs.get("w2")).toEqual({ waiting: [], delivered: true });
  });

  it("reads a watch with no stored records as nothing waiting and nothing collected", () => {
    expect(summaryWatchAppSyncs({ owners: {} }, ["w1"]).get("w1")).toEqual({ waiting: [], delivered: false, noRecord: true });
  });

  it("agrees with the per-kind reads on the same numbers", async () => {
    const kinds = { pages: full(3, 2), voice: full(1, 1), notification_style: full(4, 0) };
    const read = await readWatchAppSync(async (kind) => (kinds as Record<string, ReturnType<typeof full>>)[kind] ?? full(0, 0));
    expect(summaryWatchAppSyncs({ owners: { w: kinds } }, ["w"]).get("w")).toEqual(read);
  });

  it("waits for the HTTP actions on a watch behind the library's revision, after voice and before settings", () => {
    const syncs = summaryWatchAppSyncs({
      owners: { w1: { voice: full(2, 1), behavior: full(4, 3) }, w2: {} },
      http_actions: { revision: 3, delivered: { w1: 2, w2: 3 } },
    }, ["w1", "w2", "w3"]);
    expect(syncs.get("w1")).toEqual({ waiting: ["voice", HTTP_ACTIONS_PART_LABEL, "settings"], delivered: false });
    expect(syncs.get("w2")).toEqual({ waiting: [], delivered: true, noRecord: true });
    // A watch that never pulled the library waits for it.
    expect(syncs.get("w3")).toEqual({ waiting: ["HTTP actions"], delivered: false, noRecord: true });
  });

  it("counts the HTTP actions for neither side at revision 0, or from an integration that sends none", () => {
    const empty = summaryWatchAppSyncs({ owners: { w1: { pages: full(1, 1) } }, http_actions: { revision: 0, delivered: {} } }, ["w1"]);
    expect(empty.get("w1")).toEqual({ waiting: [], delivered: true });
    const older = summaryWatchAppSyncs({ owners: { w1: {} } }, ["w1"]);
    expect(older.get("w1")).toEqual({ waiting: [], delivered: false, noRecord: true });
    expect(httpActionsDeliveryFor(undefined, "w1")).toBeUndefined();
    expect(httpActionsDeliveryFor({ revision: 4, delivered: {} }, "w1")).toEqual({ revision: 4, delivered_revision: 0 });
  });

  it("leaves the HTTP actions out of the per-kind reads an older integration gets", async () => {
    const read = await readWatchAppSync(async () => full(1, 1));
    expect(read?.waiting).toEqual([]);
    expect(watchAppSync(new Map(), undefined)).toEqual({ waiting: [], delivered: false, noRecord: true });
  });

  it("only takes an unknown command as the sign of an older integration", () => {
    expect(summaryUnknown({ code: "unknown_command", message: "Unknown command." })).toBe(true);
    expect(summaryUnknown({ code: "unavailable" })).toBe(false);
    expect(summaryUnknown(new Error("lost"))).toBe(false);
    expect(summaryUnknown(undefined)).toBe(false);
  });
});

describe("deviceVerdict", () => {
  const app = (waiting: string[], delivered = true): WatchAppSync => ({ waiting, delivered });

  it("waits when either side waits, complications named first", () => {
    expect(deviceVerdict("waiting", app(["pages"]))).toEqual({ sync: "waiting", waitingFor: ["complications", "pages"] });
    expect(deviceVerdict("synced", app(["settings"]))).toEqual({ sync: "waiting", waitingFor: ["settings"] });
    expect(deviceVerdict("idle", app(["menus"], false))).toEqual({ sync: "waiting", waitingFor: ["menus"] });
    expect(deviceVerdict("waiting", undefined)).toEqual({ sync: "waiting", waitingFor: ["complications"] });
  });

  it("is synced when nothing waits and either side was collected", () => {
    expect(deviceVerdict("synced", app([]))).toEqual({ sync: "synced", waitingFor: [] });
    expect(deviceVerdict("idle", app([], true))).toEqual({ sync: "synced", waitingFor: [] });
    expect(deviceVerdict("synced", undefined)).toEqual({ sync: "synced", waitingFor: [] });
  });

  it("is idle with nothing waiting and nothing ever collected", () => {
    expect(deviceVerdict("idle", app([], false))).toEqual({ sync: "idle", waitingFor: [] });
    expect(deviceVerdict("idle", undefined)).toEqual({ sync: "idle", waitingFor: [] });
    expect(deviceSyncLabel("idle")).toBe("Nothing waiting");
  });

  it("waits for the iPhone on a watch whose setup has not moved here, whatever its complications say", () => {
    const none: WatchAppSync = { waiting: [], delivered: false, noRecord: true };
    expect(deviceVerdict("synced", none, true)).toEqual({ sync: "waiting", waitingFor: [IPHONE_MOVE_LABEL] });
    expect(deviceVerdict("waiting", { ...none, waiting: [HTTP_ACTIONS_PART_LABEL] }, true))
      .toEqual({ sync: "waiting", waitingFor: ["complications", HTTP_ACTIONS_PART_LABEL, IPHONE_MOVE_LABEL] });
    // A watch with no iPhone to wait for (a new watch paired by code) is
    // judged as before: nothing stored is nothing waiting.
    expect(deviceVerdict("synced", none, false)).toEqual({ sync: "synced", waitingFor: [] });
    expect(deviceVerdict("idle", none)).toEqual({ sync: "idle", waitingFor: [] });
    // Once any of its setup is here, the move is done or was never coming.
    expect(deviceVerdict("synced", app([]), true)).toEqual({ sync: "synced", waitingFor: [] });
    // No reading at all says nothing about the move.
    expect(deviceVerdict("synced", undefined, true)).toEqual({ sync: "synced", waitingFor: [] });
  });

  it("writes the note as a plain list", () => {
    expect(waitingForText(["complications", "pages"])).toBe("complications, pages");
    expect(waitingForText(["settings"])).toBe("settings");
  });
});

describe("Home's rows with the watch app", () => {
  const owner = (o: Partial<OwnerSummary>): OwnerSummary => ({
    owner_watch_id: "w1", device_name: "Watch", device_kind: "watch", paired_iphone_name: null, app_version: "3.0",
    screen_size: null, complication_count: 1, token: 5, applied_token: 5, is_orphan: false, ...o,
  } as OwnerSummary);
  const devices = (owners: OwnerSummary[]) => homeDevices(owners, (o) => o.device_name ?? o.owner_watch_id, (o) => o.owner_watch_id);

  it("takes the worse of the two on every device with a reading, an iPhone's own records included", () => {
    const owners = [
      owner({ owner_watch_id: "w1", device_name: "Synced watch" }),
      owner({ owner_watch_id: "w2", device_name: "Settings waiting" }),
      owner({ owner_watch_id: "p1", device_name: "Phone", device_kind: "iphone" }),
      owner({ owner_watch_id: "p2", device_name: "Other phone", device_kind: "iphone" }),
    ];
    const watchApp = new Map<string, WatchAppSync>([
      ["w1", { waiting: [], delivered: true }],
      ["w2", { waiting: ["settings"], delivered: true }],
      // An iPhone's own pages, on a home with phone pages.
      ["p1", { waiting: ["pages"], delivered: true }],
    ]);
    const rows = homeDeviceRows(devices(owners), watchApp);
    expect(rows.map((r) => [r.id, r.sync, r.waitingFor])).toEqual([
      ["w1", "synced", []],
      ["w2", "waiting", ["settings"]],
      ["p1", "waiting", ["pages"]],
      // No reading (a home with no phone pages): its complications alone.
      ["p2", "synced", []],
    ]);
    expect(homeDeviceWhy(rows[2]!, undefined)).toBe("For pages");
    expect(attentionText(rows[2]!, undefined)).toBe("Waiting for pages");
    // The header pill stays about complications only.
    expect(homeSync(devices(owners))).toEqual({ kind: "synced", devices: ["Synced watch", "Settings waiting", "Phone", "Other phone"] });
  });

  it("says Waiting on Home for an iPhone whose pages the iPhone has not collected, as its Pages screen does", () => {
    const full = (revision: number, delivered: number) => ({ revision, delivered_revision: delivered, rejected_revision: 0 });
    const owners = [
      owner({ owner_watch_id: "w1", device_name: "Watch" }),
      owner({ owner_watch_id: "p1", device_name: "iPhone 15 Pro", device_kind: "iphone" }),
    ];
    const summary = {
      owners: { w1: { pages: full(4, 4) }, p1: { pages: full(3, 2), behavior: full(1, 1) } },
      // The phone may pull the library signed as its watch, so its own mark
      // never moves: the library is not counted for a phone.
      http_actions: { revision: 2, delivered: { w1: 2 } },
    };
    const syncs = summaryWatchAppSyncs(summary, ["w1"], ["p1"]);
    expect(syncs.get("p1")).toEqual({ waiting: ["pages"], delivered: true });
    const rows = homeDeviceRows(devices(owners), syncs);
    expect(rows.map((r) => [r.id, r.sync, r.waitingFor])).toEqual([["w1", "synced", []], ["p1", "waiting", ["pages"]]]);
    // Without the phones asked about, the phone is judged on complications alone.
    const before = homeDeviceRows(devices(owners), summaryWatchAppSyncs(summary, ["w1"]));
    expect(before.find((r) => r.id === "p1")?.sync).toBe("synced");
  });

  it("reads only the kinds an iPhone may own on a phone", () => {
    expect(PHONE_APP_PARTS.map((p) => p.kind)).toEqual(["pages", "menus", "status_pages", "behavior", "rooms"]);
    expect(phoneAppSync(new Map([["voice", rec(3, 1)], ["status_pages", rec(2, 1)]]))).toEqual({ waiting: ["status pages"], delivered: false });
  });

  it("says Waiting for your iPhone, not Synced, for a watch whose setup the iPhone has not moved here yet", () => {
    // The upgrade test: the integration updated, the iPhone app not yet.
    // Complications are synced, Home Assistant holds no watch app record,
    // and the watch's own iPhone may still move them (`has_iphone`).
    const owners = [
      owner({ owner_watch_id: "w1", device_name: "Old watch", has_iphone: true }),
      // A new watch paired by code with nothing made yet: nothing is coming.
      owner({ owner_watch_id: "w2", device_name: "New watch", has_iphone: false }),
      // The move landed: its pages are here.
      owner({ owner_watch_id: "w3", device_name: "Moved watch", has_iphone: true }),
    ];
    const syncs = summaryWatchAppSyncs({ owners: { w3: { pages: { revision: 1, delivered_revision: 1, rejected_revision: 0 } } } }, ["w1", "w2", "w3"]);
    const rows = homeDeviceRows(devices(owners), syncs);
    expect(rows.map((r) => [r.id, r.sync, r.waitingFor])).toEqual([
      ["w1", "waiting", ["your iPhone"]],
      ["w2", "synced", []],
      ["w3", "synced", []],
    ]);
    expect(homeDeviceLabel(rows[0]!)).toBe("Waiting");
    expect(attentionText(rows[0]!, undefined)).toBe("Waiting for your iPhone");
  });

  it("judges on complications alone without a reading, as before", () => {
    const rows = homeDeviceRows(devices([owner({ applied_token: 3 })]));
    expect(rows.map((r) => [r.sync, r.waitingFor])).toEqual([["waiting", ["complications"]]]);
  });

  it("keys the read on the watches, in any order", () => {
    expect(watchAppSyncKey(["b", "a"])).toBe(watchAppSyncKey(["a", "b"]));
    expect(watchAppSyncKey(["a"])).not.toBe(watchAppSyncKey(["a", "b"]));
  });
});

describe("a save the watch could not use", () => {
  const full = (revision: number, delivered: number, rejected = 0) => ({ revision, delivered_revision: delivered, rejected_revision: rejected });
  const owner = (o: Partial<OwnerSummary>): OwnerSummary => ({
    owner_watch_id: "w1", device_name: "Watch", device_kind: "watch", paired_iphone_name: null, app_version: "3.0",
    screen_size: null, complication_count: 1, token: 5, applied_token: 5, is_orphan: false, ...o,
  } as OwnerSummary);
  const devices = (owners: OwnerSummary[]) => homeDevices(owners, (o) => o.device_name ?? o.owner_watch_id, (o) => o.owner_watch_id);

  it("is listed by part from the summary, only while it is the stored revision", () => {
    const syncs = summaryWatchAppSyncs({ owners: {
      // The verify run: 88 pages fetched (so delivered) and reported unreadable.
      w1: { pages: full(12, 12, 12), menus: full(3, 3) },
      // An old report a later save replaced says nothing.
      w2: { pages: full(13, 13, 12) },
      w3: { pages: full(4, 4, 4), voice: full(2, 2, 2) },
    } }, ["w1", "w2", "w3"]);
    expect(syncs.get("w1")).toEqual({ waiting: [], delivered: true, rejected: ["pages"] });
    expect(syncs.get("w2")).toEqual({ waiting: [], delivered: true });
    expect(syncs.get("w2")?.rejected).toBeUndefined();
    expect(syncs.get("w3")?.rejected).toEqual(["pages", "voice"]);
  });

  it("rides along on the verdict without changing it", () => {
    expect(deviceVerdict("synced", { waiting: [], delivered: true, rejected: ["pages"] }))
      .toEqual({ sync: "synced", waitingFor: [], rejected: ["pages"] });
    expect(deviceVerdict("synced", { waiting: ["menus"], delivered: true, rejected: ["pages"] }))
      .toEqual({ sync: "waiting", waitingFor: ["menus"], rejected: ["pages"] });
    expect(deviceVerdict("synced", { waiting: [], delivered: true }).rejected).toBeUndefined();
  });

  it("names the parts in plain words", () => {
    expect(REJECTED_SAVE_TEXT).toBe("Watch could not use the last save");
    expect(rejectedSaveText([])).toBe("Watch could not use the last save");
    expect(rejectedSaveText(["pages"])).toBe("Watch could not use the last save of its pages");
    expect(rejectedSaveText(["pages", "menus"])).toBe("Watch could not use the last save of its pages and menus");
    expect(rejectedSaveText(["pages", "menus", "voice"])).toBe("Watch could not use the last save of its pages, menus and voice");
    expect(rejectedSaveText(["pages"], "iphone")).toBe("iPhone could not use the last save of its pages");
    expect(rejectedSaveText([], "iphone")).toBe(PHONE_REJECTED_SAVE_TEXT);
  });

  it("turns the watch's Home card from Synced to Not synced, says why, and lists it under Waiting to sync", () => {
    const owners = [
      owner({ owner_watch_id: "w1", device_name: "Jesse's watch" }),
      owner({ owner_watch_id: "w2", device_name: "Other watch" }),
      owner({ owner_watch_id: "p1", device_name: "Phone", device_kind: "iphone" }),
    ];
    const syncs = summaryWatchAppSyncs({ owners: { w1: { pages: full(12, 12, 12) }, w2: { pages: full(5, 5) } } }, ["w1", "w2"]);
    const rows = homeDeviceRows(devices(owners), syncs);
    const [watch, other, phone] = rows;
    expect(watch).toMatchObject({ id: "w1", sync: "synced", rejected: ["pages"] });
    expect(homeDeviceLabel(watch!)).toBe(NOT_SYNCED_TEXT);
    expect(homeDeviceWhy(watch!, undefined)).toBe("Watch could not use the last save of its pages");
    expect(homeDeviceWhy(watch!, "2 changes to pick up")).toBe("Watch could not use the last save of its pages · 2 changes to pick up");
    expect(needsAttention(watch!)).toBe(true);
    expect(attentionText(watch!, undefined)).toBe("Watch could not use the last save of its pages");
    // The others are as before.
    expect(other!.rejected).toBeUndefined();
    expect(homeDeviceLabel(other!)).toBe("Synced");
    expect(needsAttention(other!)).toBe(false);
    expect(homeDeviceWhy(other!, undefined)).toBe("");
    expect(phone!.rejected).toBeUndefined();
  });

  it("names the iPhone on a phone that could not use its pages", () => {
    const owners = [owner({ owner_watch_id: "p1", device_name: "Phone", device_kind: "iphone" })];
    const rows = homeDeviceRows(devices(owners), summaryWatchAppSyncs({ owners: { p1: { pages: full(6, 6, 6) } } }, [], ["p1"]));
    expect(rows[0]).toMatchObject({ id: "p1", sync: "synced", rejected: ["pages"] });
    expect(homeDeviceLabel(rows[0]!)).toBe(NOT_SYNCED_TEXT);
    expect(homeDeviceWhy(rows[0]!, undefined)).toBe("iPhone could not use the last save of its pages");
    expect(attentionText(rows[0]!, undefined)).toBe("iPhone could not use the last save of its pages");
  });

  it("says both when the watch also waits for something", () => {
    const row = { sync: "waiting" as const, waitingFor: ["complications", "menus"], rejected: ["pages"] };
    expect(homeDeviceLabel(row)).toBe(NOT_SYNCED_TEXT);
    expect(attentionText(row, "1 change to pick up")).toBe("Watch could not use the last save of its pages · Waiting for complications, menus · 1 change to pick up");
    expect(homeDeviceWhy(row, undefined)).toBe("Watch could not use the last save of its pages · For complications, menus");
    expect(attentionText({ sync: "waiting", waitingFor: ["menus"] }, undefined)).toBe("Waiting for menus");
  });
});
