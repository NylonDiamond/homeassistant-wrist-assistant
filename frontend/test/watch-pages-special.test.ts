// The special tiles (part 3f batch 1) beyond the shared case files, which
// `watch-pages-tile-settings.test.ts` replays: the table and page-keys.json
// as the panel reads them, the readers the views draw from, the refusals,
// and the multi-step flows through a host over a draft (merge then detect,
// detection with a stand-in picture loader).

import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

import settingsCatalog from "../src/watch-settings-catalog.json";
import type { WatchPage, WatchPageTile, WatchPagesDocument } from "../src/watch-pages/model.js";
import { type WatchPagesApplyOptions, WatchPagesDraft } from "../src/watch-pages/draft.js";
import { NO_ICONS, type TileSettingsHost } from "../src/watch-pages/editor-host.js";
import { watchTileSettingsSections } from "../src/watch-pages/tile-settings-options.js";
import { forgetTileSettingsNotes } from "../src/watch-pages/tile-settings.js";
import { detectCameraRatio, groupWithCameras, specialSummary, watchSpecialSectionTitle } from "../src/watch-pages/special-settings.js";
import {
  WATCH_SPECIAL,
  WATCH_SPECIAL_SETTING_KEYS,
  addWatchCalendars,
  detectWatchCameraRatios,
  detectWatchCameraRatiosById,
  isWatchTvRemote,
  mergeWatchCameraTiles,
  removeWatchCameraFromGroup,
  removeWatchGroupCamera,
  resetWatchSpecialTask,
  setWatchCameraCellWeight,
  setWatchCameraFill,
  setWatchRemoteLauncherColor,
  setWatchRemoteMediaPlayer,
  setWatchUsePersonPhoto,
  setWatchVacuumEntity,
  setWatchWeatherTextScale,
  watchBatterySensors,
  watchBestFitTileSize,
  watchCameraGroupLabel,
  watchCameraMergeIds,
  watchCameraRefreshChoices,
  watchCameraRefreshDefaults,
  watchCleaningModeAutoDetectable,
  watchDeviceSiblings,
  watchMowerBatteryResolved,
  watchMowerFallbackBatteryId,
  watchObjectName,
  watchPlayerFeatures,
  watchRatioName,
  watchRemoteKindAvailability,
  watchRemoteLayout,
  watchRemotePlatform,
  watchRemotePlayers,
  watchRemoteSettings,
  watchShowBattery,
  watchSnapshotRatio,
  watchSpecialTask,
  watchSpecialTaskModified,
  watchSuggestedMediaPlayer,
  watchSuggestedTileSizes,
  watchTileKeyAccepts,
  watchTileKeyDefault,
  watchTileKeySpec,
  watchToggled,
  watchUsesPersonPhoto,
  watchVacuumAttention,
  watchVacuumDiscoveryResult,
  watchVacuumDiscoverySuggestions,
} from "../src/watch-pages/special-model.js";

type Json = Record<string, unknown>;

const PAGE_ID = "C3A0E000-0000-4000-8000-0000000000AA";
const tile = (entityId: string, extra: Json = {}): WatchPageTile => ({ id: "T1", entityId, ...extra });

// ── the table and page-keys.json ─────────────────────────────────────────

describe("the special table", () => {
  it("gives each kind its task, in the phone's words", () => {
    const titles = Object.fromEntries(Object.entries(WATCH_SPECIAL.tasks.kinds).map(([k, v]) => [k, `${v.task}:${v.title}`]));
    expect(titles).toEqual({
      remote: "data:Remote",
      vacuum: "data:Vacuum",
      lawn_mower: "data:Mower",
      alarm_control_panel: "alarm:Alarm",
      camera: "camera:Camera",
      multicam: "camera:Camera",
      calendar: "calendarSettings:Calendars",
      weather: "weather:Weather",
      person: "person:Person",
    });
    expect(WATCH_SPECIAL.remote.kinds).toHaveLength(21);
    expect(WATCH_SPECIAL.remote.defaultLayout).toHaveLength(12);
  });

  it("puts the task before Icon, and a TV media player gets the Remote task", () => {
    expect(watchTileSettingsSections(tile("camera.door"))).toEqual(["special", "icon", "text", "border", "action", "background"]);
    expect(watchTileSettingsSections(tile("vacuum.robo"))[0]).toBe("special");
    // Climate's options are the State rows: no task of its own.
    expect(watchTileSettingsSections(tile("climate.hall"))).not.toContain("special");
    const tv = { "media_player.lounge_tv": { state: "on", attributes: { device_class: "tv" } } };
    expect(watchTileSettingsSections(tile("media_player.lounge_tv"))).not.toContain("special");
    expect(watchTileSettingsSections(tile("media_player.lounge_tv"), tv)[0]).toBe("special");
    expect(watchSpecialTask(tile("media_player.lounge_tv"), tv)).toEqual({ task: "data", title: "Remote", kind: "remote" });
    // A TV with a remote of its own stays a media player.
    expect(isWatchTvRemote("media_player.lounge_tv", { ...tv, "remote.lounge_tv": { state: "on" } })).toBe(false);
    // The watch also draws an LG or webOS id as a remote, whatever its state
    // says (RemotePlatform.detect), so the Remote task shows for it too.
    expect(isWatchTvRemote("media_player.LG_OLED", undefined)).toBe(true);
    expect(isWatchTvRemote("media_player.bedroom_webos", {})).toBe(true);
    expect(watchSpecialTask(tile("media_player.lg_c3"))).toEqual({ task: "data", title: "Remote", kind: "remote" });
    expect(isWatchTvRemote("light.lg_strip", undefined)).toBe(false);
    expect(isWatchTvRemote("media_player.kitchen", {})).toBe(false);
  });
});

describe("page-keys.json", () => {
  const dir = join(__dirname, "fixtures-pages", "settings");
  const SPECIAL_OPS = /^(remote|camera|vacuum|calendar|weather|autoSubmit)/;
  const specialCases = readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => JSON.parse(readFileSync(join(dir, f), "utf8")) as { tile?: Json; page?: Json; edit: Json; expected: Json })
    .filter((c) => SPECIAL_OPS.test(String(c.edit.op)) || (c.edit.op === "set" && WATCH_SPECIAL_SETTING_KEYS.includes(String(c.edit.key))));

  it("has every key a special setter writes", () => {
    for (const key of WATCH_SPECIAL_SETTING_KEYS) expect(watchTileKeySpec(key), key).toBeDefined();
    expect(watchTileKeySpec("nope")).toBeUndefined();
    expect(watchTileKeyAccepts("nope", 1)).toBe(false);
  });

  it("accepts every special value the phone wrote in the case files", () => {
    expect(specialCases.length).toBeGreaterThan(60);
    for (const c of specialCases) {
      const tiles = c.expected.items === undefined ? [c.expected] : (c.expected.items as Json[]);
      for (const t of tiles) {
        for (const key of WATCH_SPECIAL_SETTING_KEYS) {
          if (Object.hasOwn(t, key)) expect(watchTileKeyAccepts(key, t[key]), `${String(c.edit.op)} ${key}=${JSON.stringify(t[key])}`).toBe(true);
        }
      }
    }
  });

  it("lets a quick action color be empty, the remote's accent, and nothing else", () => {
    expect(watchTileKeyAccepts("remoteLauncherColors", ["", "#FF9F0A"])).toBe(true);
    expect(watchTileKeyAccepts("remoteLauncherColors", ["blue"])).toBe(false);
    expect(watchTileKeyAccepts("calendarSourceColors", { "calendar.a": "" })).toBe(false);
    expect(watchTileKeyAccepts("multiCamBorderColor", "FFFFFF")).toBe(true);
    expect(watchTileKeyAccepts("remoteEdgeVolumeSide", "middle")).toBe(true); // not strict
    expect(watchTileKeyAccepts("cameraFillModes", ["fill", "zoom"])).toBe(false);
  });

  it("names the defaults the watch reads, the same as the table's", () => {
    for (const [key, value] of Object.entries(WATCH_SPECIAL.remote.inputDefaults)) expect(watchTileKeyDefault(key), key).toBe(value);
    expect(watchTileKeyDefault("showBatteryOnTile")).toBe(true);
    expect(watchTileKeyDefault("autoSubmitPIN")).toBe(WATCH_SPECIAL.alarm.absent);
    expect(watchRemoteSettings(tile("remote.tv"))).toMatchObject({ crownSelect: true, crownBack: true, edgeVolume: false, edgeSide: "right", quickConfirm: true, layoutStored: false });
    expect(watchShowBattery(tile("vacuum.robo"))).toBe(true);
  });
});

// ── Remote ───────────────────────────────────────────────────────────────

describe("the remote's layout and players", () => {
  it("reads a layout as the watch does", () => {
    expect(watchRemoteLayout(undefined)).toEqual(WATCH_SPECIAL.remote.defaultLayout);
    expect(watchRemoteLayout(["home", 3, "nope"]).slice(0, 4)).toEqual(["home", "empty", "empty", WATCH_SPECIAL.remote.defaultLayout[3]]);
    expect(watchRemoteLayout(new Array(14).fill("mute"))).toHaveLength(12);
  });

  it("dims a kind the linked players cannot do, with the phone's reason", () => {
    const none = watchRemotePlayers(tile("remote.living_room_apple_tv"), {});
    expect(watchRemoteKindAvailability("back", none)).toEqual({ available: true, reason: "" });
    expect(watchRemoteKindAvailability("stop", none)).toEqual({ available: false, reason: "Link a media player to use Stop" });
    expect(watchRemoteKindAvailability("volume_up", none).reason).toBe("Link a volume player to use Vol ±");
    const states = {
      "media_player.tv": { state: "on", attributes: { supported_features: 2 | 4096, source_list: ["HDMI 1"] } },
      "media_player.old": { state: "on", attributes: { supported_features: 0, shuffle: false } },
    };
    const linked = watchRemotePlayers(tile("remote.apple_tv", { associatedMediaPlayerId: "media_player.tv" }), states);
    expect(watchRemoteKindAvailability("stop", linked).available).toBe(true);
    expect(watchRemoteKindAvailability("seek", linked).available).toBe(true);
    // Source needs the bit and a source list.
    expect(watchRemoteKindAvailability("source", linked).available).toBe(false);
    expect(watchRemoteKindAvailability("shuffle", linked)).toEqual({ available: false, reason: "This player doesn't support Shuffle" });
    // No feature mask: the attribute stands in.
    const old = watchRemotePlayers(tile("remote.x", { associatedMediaPlayerId: "media_player.old" }), states);
    expect(watchRemoteKindAvailability("shuffle", old).available).toBe(true);
    // A platform with a native mute key steps the volume without a player.
    expect(watchRemotePlatform("remote.samsung_q80").nativeMute).toBe(true);
    expect(watchRemotePlatform("remote.apple_tv").value).toBe("apple_tv");
    expect(watchRemoteKindAvailability("volume_up", watchRemotePlayers(tile("remote.lg_webos"), {})).available).toBe(true);
    // A TV remote is its own media player.
    const tv = { "media_player.lounge_tv": { state: "on", attributes: { device_class: "tv", supported_features: 4096 } } };
    expect(watchRemoteKindAvailability("stop", watchRemotePlayers(tile("media_player.lounge_tv"), tv)).available).toBe(true);
    expect(watchPlayerFeatures(states, "media_player.gone")).toBeUndefined();
  });

  it("suggests the device's first media player", () => {
    expect(watchSuggestedMediaPlayer(["remote.x", "media_player.a", "media_player.b"])).toBe("media_player.a");
    expect(watchSuggestedMediaPlayer(["remote.x"])).toBeUndefined();
  });
});

// ── Camera ───────────────────────────────────────────────────────────────

describe("camera sizes and words", () => {
  it("fits a ratio as the phone does", () => {
    expect(watchBestFitTileSize(16 / 9)).toEqual({ colSpan: 12, rowSpan: 7 });
    expect(watchBestFitTileSize(9 / 16)).toEqual({ colSpan: 8, rowSpan: 14 });
    expect(watchSuggestedTileSizes(16 / 9).map((s) => `${s.colSpan}x${s.rowSpan}${s.bestFit ? "*" : ""}`)).toEqual(["12x7*", "8x4", "6x3", "4x2", "3x2"]);
    expect(watchSuggestedTileSizes(0.3)[0]).toMatchObject({ colSpan: 8, rowSpan: 14 });
  });

  it("names a ratio", () => {
    expect(watchRatioName(1.7777)).toBe("16:9 (Wide)");
    expect(watchRatioName(2.4)).toBe("2.40:1 (Wide)");
    expect(watchRatioName(1.2)).toBe("1.20:1");
    expect(watchRatioName(0.4)).toBe("1:2.50 (Tall)");
  });

  it("words the refresh default from the behavior document", () => {
    // Absent keys read as the behavior catalog's defaults.
    const catalog = (settingsCatalog as { sections: { settings: { key: string; default?: unknown }[] }[] }).sections.flatMap((s) => s.settings);
    const defaultOf = (key: string) => catalog.find((s) => s.key === key)?.default;
    expect(watchCameraRefreshDefaults(undefined)).toEqual({ on: defaultOf("cameraRefreshOnOpen"), debounce: defaultOf("cameraRefreshOnOpenDebounce") });
    expect(watchCameraRefreshDefaults(undefined)).toEqual({ on: true, debounce: "10s" });
    expect(watchCameraRefreshDefaults({ cameraRefreshOnOpen: false })).toEqual({ on: false, debounce: "10s" });
    expect(watchCameraRefreshChoices(true, "30s").map((c) => c.label)).toEqual(["Default (On/30s)", "On", "Off"]);
    expect(watchCameraRefreshChoices(false, "10s")[0]).toEqual({ value: null, label: "Default (Off)" });
  });

  it("reads a snapshot's ratio, none for a picture that is no picture", () => {
    expect(watchSnapshotRatio({ width: 640, height: 360 })).toBeCloseTo(16 / 9, 12);
    expect(watchSnapshotRatio({ width: 0, height: 360 })).toBeUndefined();
    expect(watchSnapshotRatio(undefined)).toBeUndefined();
  });

  it("labels a group by its cameras", () => {
    expect(watchCameraGroupLabel(["camera.front_door", "camera.back_yard"])).toBe("Front Door, Back Yard");
    expect(watchCameraGroupLabel(["camera.a", "camera.b", "camera.c", "camera.d"])).toBe("4 Cameras");
    expect(watchObjectName("select.robo_mop_intensity")).toBe("Robo Mop Intensity");
  });
});

// ── Vacuum, mower, person ────────────────────────────────────────────────

describe("vacuum discovery and attention", () => {
  const entities = {
    "vacuum.robo": { device_id: "d1" },
    "select.robo_mop": { device_id: "d1" },
    "light.hall": { device_id: "d2" },
    "select.robo_cleaning_mode": { device_id: "d1" },
    "switch.robo_dnd": { device_id: "d1" },
    "sensor.robo_battery": { device_id: "d1" },
    "input_select.robo_suction": { device_id: "d1" },
  };

  it("lists the device's other entities in registry order", () => {
    expect(watchDeviceSiblings(entities, "vacuum.robo")).toEqual({
      selects: ["select.robo_mop", "select.robo_cleaning_mode", "input_select.robo_suction"],
      switches: ["switch.robo_dnd"],
      sensors: ["sensor.robo_battery"],
      all: ["select.robo_mop", "select.robo_cleaning_mode", "switch.robo_dnd", "sensor.robo_battery", "input_select.robo_suction"],
    });
    expect(watchDeviceSiblings(entities, "light.nowhere").all).toEqual([]);
    expect(watchDeviceSiblings(undefined, "vacuum.robo").all).toEqual([]);
  });

  it("suggests what the sheet suggests and words the result", () => {
    const picks = watchVacuumDiscoverySuggestions(tile("vacuum.robo"), watchDeviceSiblings(entities, "vacuum.robo"));
    expect(picks).toEqual({ cleaningMode: "select.robo_cleaning_mode", fanSpeed: null, extraSelect: null, switches: ["switch.robo_dnd"], battery: "sensor.robo_battery" });
    expect(watchVacuumDiscoveryResult(picks)).toBe("Linked: Cleaning Mode, 1 switch, Battery");
    expect(watchVacuumDiscoveryResult({ cleaningMode: null, fanSpeed: null, extraSelect: null, switches: [], battery: null })).toBe("No changes applied");
  });

  it("marks the rows that need a link", () => {
    const bare = { "vacuum.robo": { state: "docked", attributes: {} } };
    expect(watchVacuumAttention(tile("vacuum.robo"), bare)).toEqual({ cleaningMode: true, fanSpeed: true, battery: true, any: true });
    const full = { "vacuum.robo": { state: "docked", attributes: { fan_speed_list: ["quiet"], battery_level: 80 } }, "select.robo_cleaning_mode": { state: "x" } };
    expect(watchVacuumAttention(tile("vacuum.robo"), full).any).toBe(false);
    expect(watchCleaningModeAutoDetectable("vacuum.robo", ["select.other_cleaning_mode"])).toBe(true);
    expect(watchCleaningModeAutoDetectable("vacuum.robo", ["select.a_cleaning_mode", "select.b_cleaning_mode"])).toBe(false);
  });

  it("orders battery sensors first and keeps pick order for switches", () => {
    const states = {
      "sensor.a_power": { state: "1", attributes: { friendly_name: "A power" } },
      "sensor.z_level": { state: "1", attributes: { friendly_name: "Z level", device_class: "battery" } },
      "sensor.b_battery": { state: "1", attributes: { friendly_name: "B battery" } },
    };
    expect(watchBatterySensors(states)).toEqual(["sensor.b_battery", "sensor.z_level", "sensor.a_power"]);
    expect(watchToggled(["a", "b"], "a")).toEqual(["b"]);
    expect(watchToggled(["b"], "a")).toEqual(["b", "a"]);
  });

  it("finds a mower's battery by its own id", () => {
    expect(watchMowerFallbackBatteryId("lawn_mower.front_lawn")).toBe("sensor.front_lawn_battery");
    expect(watchMowerBatteryResolved(tile("lawn_mower.front_lawn"), { "sensor.front_lawn_battery": { state: "50" } })).toBe(true);
    expect(watchMowerBatteryResolved(tile("lawn_mower.front_lawn"), {})).toBe(false);
  });

  it("reads Photo or Icon as the watch does", () => {
    expect(watchUsesPersonPhoto(tile("person.alex"))).toBe(true);
    expect(watchUsesPersonPhoto(tile("person.alex", { icon: "star" }))).toBe(false);
    expect(watchUsesPersonPhoto(tile("person.alex", { icon: "star", usePersonPhoto: true }))).toBe(true);
    // The watch's own samples (`resolvedUsePersonPhoto`): "" and a state
    // icon count as an icon of the tile's own.
    expect(WATCH_SPECIAL.person.absentSamples.length).toBeGreaterThanOrEqual(6);
    for (const s of WATCH_SPECIAL.person.absentSamples) {
      const t = tile("person.alex", { ...(s.icon === null ? {} : { icon: s.icon }), ...(s.stateIcons === null ? {} : { stateIcons: s.stateIcons }) });
      expect(watchUsesPersonPhoto(t), JSON.stringify(s)).toBe(s.photo);
    }
  });
});

// ── refusals ─────────────────────────────────────────────────────────────

function documentWith(page: WatchPage): WatchPagesDocument {
  return { schemaVersion: 1, pages: [page] };
}

const pageOf = (...items: Json[]): WatchPage => ({ id: PAGE_ID, name: "Den", themeOverride: "neonLagoon", useGradientColors: false, items });

describe("refusals return the document as given", () => {
  it("for a key on the wrong kind of tile or a value the phone could not write", () => {
    const doc = documentWith(pageOf({ id: "T1", entityId: "light.desk" }, { id: "T2", entityId: "remote.tv" }, { id: "T3", entityId: "calendar.home" }));
    expect(setWatchRemoteMediaPlayer(doc, PAGE_ID, "T1", "media_player.tv")).toBe(doc);
    expect(setWatchRemoteMediaPlayer(doc, PAGE_ID, "T2", "light.tv")).toBe(doc);
    expect(setWatchRemoteMediaPlayer(doc, PAGE_ID, "T2", "media_player.tv")).not.toBe(doc);
    expect(setWatchRemoteLauncherColor(doc, PAGE_ID, "T2", 0, "blue")).toBe(doc);
    expect(setWatchCameraFill(doc, PAGE_ID, "T1", "fit")).toBe(doc);
    expect(setWatchVacuumEntity(doc, PAGE_ID, "T1", "battery", "sensor.x")).toBe(doc);
    expect(setWatchUsePersonPhoto(doc, PAGE_ID, "T1", true)).toBe(doc);
    expect(addWatchCalendars(doc, PAGE_ID, "T3", ["calendar.home", "light.x"])).toBe(doc);
    expect(resetWatchSpecialTask(doc, PAGE_ID, "T1", "camera")).toBe(doc);
  });

  it("for a merge of fewer than two cameras and a group's last camera", () => {
    const doc = documentWith(pageOf({ id: "C1", entityId: "camera.a", gridCol: 0, gridRow: 0, colSpan: 6, rowSpan: 4 }, { id: "L1", entityId: "light.desk", gridCol: 6, gridRow: 0, colSpan: 6, rowSpan: 4 }));
    expect(mergeWatchCameraTiles(doc, PAGE_ID, ["C1", "L1"])).toEqual({ document: doc });
    const one = documentWith(pageOf({ id: "G1", entityId: "multicam.X", cameraGroupIds: ["camera.a"] }));
    expect(removeWatchCameraFromGroup(one, PAGE_ID, "G1", 0)).toBe(one);
  });

  it("for a resize that would leave the tile over one that starts above it", () => {
    // The camera at row 4 grows to 12 wide into a tall tile that starts at row 0.
    const doc = documentWith(pageOf(
      { id: "C1", entityId: "camera.a", gridCol: 0, gridRow: 4, colSpan: 6, rowSpan: 4 },
      { id: "T1", entityId: "light.tall", gridCol: 6, gridRow: 0, colSpan: 6, rowSpan: 12 },
      { id: "T2", entityId: "light.top", gridCol: 0, gridRow: 0, colSpan: 6, rowSpan: 4 },
    ));
    expect(detectWatchCameraRatios(doc, PAGE_ID, "C1", [16 / 9])).toEqual({ document: doc, refused: "overlap" });
  });

  it("but not for an overlap that was there before the edit", () => {
    // A group placed over a tile that starts above it (as an older merge
    // did): its height and its detection still work, and an overlap with
    // another tile is still refused.
    const group = { id: "G1", entityId: "multicam.X", cameraGroupIds: ["camera.a", "camera.b"], cameraRowWeights: [1, 1], gridCol: 0, gridRow: 2, colSpan: 4, rowSpan: 4 };
    const doc = documentWith(pageOf(
      { id: "T1", entityId: "light.top", gridCol: 0, gridRow: 0, colSpan: 4, rowSpan: 4 },
      group,
      { id: "T2", entityId: "light.side", gridCol: 4, gridRow: 0, colSpan: 8, rowSpan: 12 },
    ));
    const lower = setWatchCameraCellWeight(doc, PAGE_ID, "G1", 0, -0.2);
    expect(lower.refused).toBeUndefined();
    const items = (lower.document.pages as WatchPage[])[0]!.items as Json[];
    expect(items[1]).toMatchObject({ cameraRowWeights: [0.8, 1], rowSpan: 4 });
    // Detection widens the group to 12 columns, over the tall tile beside it.
    expect(detectWatchCameraRatios(doc, PAGE_ID, "G1", [16 / 9, 16 / 9]).refused).toBe("overlap");
  });
});

describe("a merge of cameras", () => {
  it("puts a new group at the first free place once the cameras are gone, and lists each camera once", () => {
    const doc = documentWith(pageOf(
      { id: "L1", entityId: "light.a", gridCol: 0, gridRow: 0, colSpan: 4, rowSpan: 6 },
      { id: "C1", entityId: "camera.a", gridCol: 4, gridRow: 4, colSpan: 2, rowSpan: 2 },
      { id: "G1", entityId: "multicam.X", cameraGroupIds: ["camera.a", "camera.b"], gridCol: 8, gridRow: 0, colSpan: 4, rowSpan: 4 },
      { id: "C2", entityId: "camera.c", gridCol: 4, gridRow: 0, colSpan: 4, rowSpan: 2 },
    ));
    const page = (doc.pages as WatchPage[])[0]!;
    expect(watchCameraMergeIds(page, ["C1", "G1"])).toEqual(["camera.a", "camera.b"]);
    const grouped = mergeWatchCameraTiles(doc, PAGE_ID, ["C1", "G1"]);
    expect(((grouped.document.pages as WatchPage[])[0]!.items as Json[]).find((t) => t.id === "G1")!.cameraGroupIds).toEqual(["camera.a", "camera.b"]);
    const ids = ["E", "N"];
    const fresh = mergeWatchCameraTiles(doc, PAGE_ID, ["C1", "C2"], { newId: () => ids.shift()! });
    const items = (fresh.document.pages as WatchPage[])[0]!.items as Json[];
    expect(items.map((t) => t.id)).toEqual(["L1", "G1", "N"]);
    // The cameras' own places are free again: the first 4 by 4 free place is
    // at column 4, row 0.
    expect(items[2]).toMatchObject({ gridCol: 4, gridRow: 0, colSpan: 4, rowSpan: 4 });
  });

  it("removes a group's last camera with the tile", () => {
    const doc = documentWith(pageOf({ id: "G1", entityId: "multicam.X", cameraGroupIds: ["camera.a"] }, { id: "L1", entityId: "light.a" }));
    const out = removeWatchGroupCamera(doc, PAGE_ID, "G1", 0);
    expect(((out.pages as WatchPage[])[0]!.items as Json[]).map((t) => t.id)).toEqual(["L1"]);
  });
});

describe("detection by camera id", () => {
  const group = (ids: string[]) => documentWith(pageOf({ id: "G1", entityId: "multicam.X", cameraGroupIds: ids, gridCol: 0, gridRow: 0, colSpan: 4, rowSpan: 4 }));
  const measured = new Map<string, number | null>([["camera.a", 2.4], ["camera.b", null]]);

  it("applies each ratio to its camera wherever it is now", () => {
    const swapped = detectWatchCameraRatiosById(group(["camera.b", "camera.a"]), PAGE_ID, "G1", measured);
    const byPosition = detectWatchCameraRatios(group(["camera.b", "camera.a"]), PAGE_ID, "G1", [null, 2.4]);
    expect(swapped.document).toEqual(byPosition.document);
    expect(swapped.missing).toBe(1);
  });

  it("skips a camera that left the group, and changes nothing for one that was not measured", () => {
    const left = detectWatchCameraRatiosById(group(["camera.a"]), PAGE_ID, "G1", measured);
    expect(left.document).toEqual(detectWatchCameraRatios(group(["camera.a"]), PAGE_ID, "G1", [2.4]).document);
    expect(left.missing).toBe(0);
    const doc = group(["camera.a", "camera.c"]);
    expect(detectWatchCameraRatiosById(doc, PAGE_ID, "G1", measured)).toEqual({ document: doc, unmeasured: ["camera.c"], missing: 0 });
  });
});

describe("weather text size", () => {
  it("holds a typed value to the slider's range and snaps it", () => {
    const doc = documentWith(pageOf({ id: "W1", entityId: "weather.home" }));
    const scale = (v: number) => ((setWatchWeatherTextScale(doc, PAGE_ID, "W1", v).pages as WatchPage[])[0]!.items as Json[])[0]!.weatherDetailTextScale;
    expect(scale(0.4)).toBe(1);
    expect(scale(2.5)).toBe(2);
    expect(scale(1.17)).toBe(1.15);
    expect(scale(1.5)).toBeUndefined();
    expect(setWatchWeatherTextScale(doc, PAGE_ID, "W1", Number.NaN)).toBe(doc);
  });
});

describe("resets", () => {
  it("writes the speak tile's output mode, and marks a task modified", () => {
    const doc = documentWith(pageOf({ id: "S1", entityId: "speak_message.X", speakMessageOutputMode: "watchSpeaker" }));
    const out = resetWatchSpecialTask(doc, PAGE_ID, "S1", "data");
    expect(((out.pages as WatchPage[])[0]!.items as Json[])[0]!.speakMessageOutputMode).toBe("configuredSpeakers");
    expect(watchSpecialTaskModified(tile("remote.tv", { remoteButtonLayout: [] }), "data")).toBe(true);
    expect(watchSpecialTaskModified(tile("remote.tv"), "data")).toBe(false);
    expect(watchSpecialTaskModified(tile("camera.a"), "camera")).toBe(false);
  });
});

// ── flows through a host over a draft ────────────────────────────────────

/** A host as the page editor builds one, with a stand-in picture loader. */
function draftHost(page: WatchPage, tileId: string, pictures: Record<string, { width: number; height: number }>, states: Json = {}) {
  const draft = new WatchPagesDraft(documentWith(page), 1);
  const pageNow = () => (draft.document.pages as WatchPage[])[0]!;
  let selected: string | undefined = tileId;
  const loads: string[] = [];
  const host = {
    hass: { states },
    icons: NO_ICONS,
    get document() { return draft.document; },
    pageId: PAGE_ID,
    get page() { return pageNow(); },
    otherPages: [],
    catalog: undefined,
    busy: false,
    uiState: new Map<string, unknown>(),
    cameraRefreshDefaults: { on: true, debounce: "10s" },
    deviceSiblings: () => ({ selects: [], switches: [], sensors: [], all: [] }),
    loadImageSize: async (url: string) => {
      loads.push(url);
      return pictures[url];
    },
    apply: (next: WatchPagesDocument, options?: WatchPagesApplyOptions) => draft.apply(next, options),
    endCoalesce: () => draft.endCoalesce(),
    selectTile: (id: string | undefined) => { selected = id; },
    requestUpdate: () => undefined,
    tileId,
    get tile() { return ((pageNow().items as WatchPageTile[] | undefined) ?? []).find((t) => t.id === tileId) ?? ({} as WatchPageTile); },
  } as unknown as TileSettingsHost;
  return { draft, host, page: pageNow, selected: () => selected, loads };
}

const camera = (id: string, entityId: string, col: number, row: number): Json => ({
  id, entityId, cameraDisplayMode: "preview", cameraFillOffsetX: 0, cameraFillOffsetY: 0, gridCol: col, gridRow: row, colSpan: 6, rowSpan: 4,
});

describe("the camera flows", () => {
  const states = {
    "camera.front": { state: "idle", attributes: { friendly_name: "Front", entity_picture: "/api/camera_proxy/camera.front?token=1" } },
    "camera.back": { state: "idle", attributes: { friendly_name: "Back", entity_picture: "/api/camera_proxy/camera.back?token=2" } },
  };
  const pictures = { "/api/camera_proxy/camera.front?token=1": { width: 1920, height: 1080 }, "/api/camera_proxy/camera.back?token=2": { width: 1280, height: 720 } };

  it("detects a single camera's ratio from its picture, one undo step", async () => {
    const { draft, host, page, loads } = draftHost(pageOf(camera("C1", "camera.front", 6, 0), { id: "L1", entityId: "light.desk", gridCol: 0, gridRow: 4, colSpan: 6, rowSpan: 4 }), "C1", pictures, states);
    await detectCameraRatio(host);
    expect(loads).toEqual(["/api/camera_proxy/camera.front?token=1"]);
    const items = page().items as Json[];
    expect(items[0]).toMatchObject({ cameraAspectRatio: 16 / 9, gridCol: 0, colSpan: 12, rowSpan: 7 });
    expect(items[1]).toMatchObject({ gridRow: 7 });
    expect(draft.undoDepth).toBe(1);
  });

  it("leaves a camera whose picture does not load as it is, and says so until the next edit or selection", async () => {
    const { draft, host } = draftHost(pageOf(camera("C1", "camera.front", 0, 0)), "C1", {}, states);
    await detectCameraRatio(host);
    expect(draft.undoDepth).toBe(0);
    // The line is about the document as it was: an edit moves past it.
    expect(host.uiState.get("special:detect:C1")).toEqual({ text: "The snapshot did not load, so nothing changed.", document: draft.document });
    forgetTileSettingsNotes(host.uiState);
    expect(host.uiState.has("special:detect:C1")).toBe(false);
  });

  it("says why a detection that ends during a save was not applied", async () => {
    const { draft, host } = draftHost(pageOf(camera("C1", "camera.front", 0, 0)), "C1", pictures, states);
    let busy = false;
    Object.defineProperty(host, "busy", { get: () => busy });
    const loading = detectCameraRatio(host);
    busy = true;
    await loading;
    expect(draft.undoDepth).toBe(0);
    expect((host.uiState.get("special:detect:C1") as { text: string }).text).toMatch(/saving/);
  });

  it("shows a refused detection after a merge by the new group's Detect", async () => {
    // The new group takes the first free place, row 1, under a tile that
    // starts at row 0; detection widens it over the tall tile beside it.
    const { draft, host, page } = draftHost(pageOf(
      { id: "L0", entityId: "light.top", gridCol: 0, gridRow: 0, colSpan: 8, rowSpan: 1 },
      { id: "T1", entityId: "light.tall", gridCol: 8, gridRow: 0, colSpan: 4, rowSpan: 12 },
      { ...camera("C1", "camera.front", 0, 1), colSpan: 4 },
      { ...camera("C2", "camera.back", 4, 1), colSpan: 4 },
    ), "C1", pictures, states);
    const groupId = await groupWithCameras(host, ["C2"]);
    const group = (page().items as Json[]).find((t) => t.id === groupId)!;
    expect(group).toMatchObject({ gridCol: 0, gridRow: 1, colSpan: 4, rowSpan: 4 });
    expect(draft.undoDepth).toBe(1);
    expect(host.uiState.get(`tile-settings:note:${groupId!.toUpperCase()}:detect`)).toMatch(/no room/);
  });

  it("counts the cameras of the result on the group button", () => {
    const { host } = draftHost(pageOf(
      camera("C1", "camera.front", 0, 0),
      { id: "G1", entityId: "multicam.X", cameraGroupIds: ["camera.front", "camera.side", "camera.yard"], gridCol: 6, gridRow: 0, colSpan: 6, rowSpan: 4 },
    ), "C1", pictures, states);
    expect(watchCameraMergeIds(host.page, ["C1", "G1"])).toHaveLength(3);
  });

  it("groups cameras, selects the group and detects it: two undo steps, as on the phone", async () => {
    const { draft, host, page, selected } = draftHost(pageOf(camera("C1", "camera.front", 0, 0), camera("C2", "camera.back", 6, 0)), "C1", pictures, states);
    const groupId = await groupWithCameras(host, ["C2"]);
    expect(groupId).toBeDefined();
    expect(selected()).toBe(groupId);
    const items = page().items as Json[];
    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({
      id: groupId,
      cameraGroupIds: ["camera.front", "camera.back"],
      customLabel: "Front, Back",
      cameraGridColumns: 2,
      colSpan: 12,
      rowSpan: 3,
      icon: "rectangle.split.2x2",
      color: "#5A7FB8",
    });
    expect(String(items[0]!.entityId)).toMatch(/^multicam\.[0-9A-F-]{36}$/);
    expect(draft.undoDepth).toBe(2);
    draft.undo();
    expect((page().items as Json[])[0]!.colSpan).toBe(4);
  });

  it("titles and sums up the section by the task", () => {
    const { host } = draftHost(pageOf(camera("C1", "camera.front", 0, 0)), "C1", pictures, states);
    expect(watchSpecialSectionTitle(host)).toBe("Camera");
    expect(specialSummary(host)).toBe("Preview");
  });
});
