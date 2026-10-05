// Whether a watch has watch app records still to collect, and Home's verdict
// per device: the worse of its complications and its watch app.

import { describe, expect, it } from "vitest";

import { homeDeviceRows, homeDevices } from "../src/home.js";
import type { OwnerSummary } from "../src/ha-api.js";
import { deviceSyncLabel, homeSync } from "../src/send-state.js";
import {
  WATCH_APP_PARTS,
  type WatchAppSync,
  deviceVerdict,
  readWatchAppSync,
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
    expect(watchAppSync(new Map([["pages", rec(0, 0)], ["menus", undefined]]))).toEqual({ waiting: [], delivered: false });
  });

  it("calls the behavior record settings, which Rooms writes too", () => {
    expect(WATCH_APP_PARTS.find((p) => p.kind === "behavior")?.label).toBe("settings");
    expect(watchAppSync(new Map([["behavior", rec(7, 6)]])).waiting).toEqual(["settings"]);
  });

  it("asks every kind the panel writes, never the phone's catalog", () => {
    expect(WATCH_APP_PARTS.map((p) => p.kind).sort()).toEqual(
      ["behavior", "control_center", "menus", "notification_style", "pages", "status_pages", "voice"],
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

  it("takes the worse of the two on a watch, and leaves a phone on its complications", () => {
    const owners = [
      owner({ owner_watch_id: "w1", device_name: "Synced watch" }),
      owner({ owner_watch_id: "w2", device_name: "Settings waiting" }),
      owner({ owner_watch_id: "p1", device_name: "Phone", device_kind: "iphone" }),
    ];
    const watchApp = new Map<string, WatchAppSync>([
      ["w1", { waiting: [], delivered: true }],
      ["w2", { waiting: ["settings"], delivered: true }],
      // A phone has no watch app; a reading for one is ignored.
      ["p1", { waiting: ["pages"], delivered: true }],
    ]);
    const rows = homeDeviceRows(devices(owners), watchApp);
    expect(rows.map((r) => [r.id, r.sync, r.waitingFor])).toEqual([
      ["w1", "synced", []],
      ["w2", "waiting", ["settings"]],
      ["p1", "synced", []],
    ]);
    // The header pill stays about complications only.
    expect(homeSync(devices(owners))).toEqual({ kind: "synced", devices: ["Synced watch", "Settings waiting", "Phone"] });
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
