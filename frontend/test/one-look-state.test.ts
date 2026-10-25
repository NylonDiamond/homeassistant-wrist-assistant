// One Look's state lines (`src/watch-pages/one-look/state.ts`): what each
// kind says under its name, its accessory and its palette role, each case
// the app's own from `WristAssistantTests/OneLookStateTests.swift` with the
// same words. Then the stored tile read with Home Assistant's states, as
// each of the app's tile views (`SimpleTileViews.swift`) builds its state.

import { describe, expect, it } from "vitest";

import type { HassEntityState } from "../src/ha-api.js";
import type { WatchPageTile } from "../src/watch-pages/model.js";
import {
  ONE_LOOK_ASSUMED_STATE,
  type OneLookStateLine,
  type OneLookTileState,
  oneLookAction,
  oneLookAgo,
  oneLookAlarm,
  oneLookAssist,
  oneLookBarValue,
  oneLookCameraTile,
  oneLookClimate,
  oneLookClimateTemperature,
  oneLookClock,
  oneLookCover,
  oneLookFan,
  oneLookFillLevel,
  oneLookFormatNumber,
  oneLookHidingNumber,
  oneLookHidingState,
  oneLookHttpAction,
  oneLookHttpTile,
  oneLookInputNumber,
  oneLookInputSelect,
  oneLookInternetDate,
  oneLookLight,
  oneLookLocation,
  oneLookLock,
  oneLookMedia,
  oneLookNowPlaying,
  oneLookPointControl,
  oneLookPrintfFixed,
  oneLookRanLine,
  oneLookRemoved,
  oneLookScene,
  oneLookScript,
  oneLookSensor,
  oneLookSensorParts,
  oneLookStateFor,
  oneLookTileState,
  oneLookTimer,
  oneLookToggle,
  oneLookUnavailableLine,
  oneLookVacuum,
  oneLookWeather,
  oneLookWeatherText,
  oneLookWithBattery,
} from "../src/watch-pages/one-look/state.js";

const NOW = 1_800_000_000_000;
const NONE: OneLookStateLine = { kind: "none" };
const word = (w: string, o: { short?: string; amber?: boolean } = {}): OneLookStateLine => ({ kind: "word", word: w, ...o });
const num = (figure: string, o: { unit?: string; unitSpaced?: boolean; tail?: string; keepTail?: boolean } = {}): OneLookStateLine => ({ kind: "number", figure, ...o });
const calm = (o: Partial<OneLookTileState> = {}): OneLookTileState => ({ state: NONE, accessory: "none", role: { kind: "plain" }, isUnavailable: false, isCalm: true, ...o });
const ent = (entity_id: string, state: string, attributes: Record<string, unknown> = {}, last_updated = ""): HassEntityState => ({
  entity_id, state, attributes, last_changed: last_updated, last_updated,
});
const states = (...list: HassEntityState[]) => Object.fromEntries(list.map((e) => [e.entity_id, e]));
const tile = (entityId: string, keys: Record<string, unknown> = {}): WatchPageTile => ({ id: "t", entityId, ...keys });
const climateFormat = (step = 1) => (v: number) => oneLookClimateTemperature(v, step);

describe("lights and toggles", () => {
  it("shows a dimmable light's brightness while on", () => {
    // 163 / 255 is 64%.
    const s = oneLookTileState(tile("light.desk"), states(ent("light.desk", "on", { brightness: 163 })), NOW)!;
    expect(s.state).toEqual(num("64", { unit: "%" }));
    expect(s.role).toEqual({ kind: "light", on: true, brightness: 0.64 });
    expect(s.accessory).toBe("none");
  });

  it("says On for a light that does not dim, Off for an off light", () => {
    const plug = oneLookTileState(tile("light.plug"), states(ent("light.plug", "on")), NOW)!;
    expect(plug.state).toEqual(word("On"));
    expect(plug.role).toEqual({ kind: "light", on: true });
    const hall = oneLookTileState(tile("light.hall"), states(ent("light.hall", "off", { brightness: 200 })), NOW)!;
    expect(hall.state).toEqual(word("Off"));
    expect(hall.role).toEqual({ kind: "light", on: false });
  });

  it("says On or Off for toggles", () => {
    expect(oneLookTileState(tile("switch.a"), states(ent("switch.a", "on")), NOW)!.state).toEqual(word("On"));
    expect(oneLookTileState(tile("input_boolean.a"), states(ent("input_boolean.a", "off")), NOW)!.state).toEqual(word("Off"));
    expect(oneLookTileState(tile("automation.a"), states(ent("automation.a", "on")), NOW)!.state).toEqual(word("On"));
    expect(oneLookTileState(tile("automation.b"), states(ent("automation.b", "off")), NOW)!.state).toEqual(word("Off"));
  });

  it("shows a fan's speed while on", () => {
    expect(oneLookFan(true, 40).state).toEqual(num("40", { unit: "%" }));
    expect(oneLookFan(true, undefined).state).toEqual(word("On"));
    expect(oneLookFan(false, 40).state).toEqual(word("Off"));
    expect(oneLookTileState(tile("fan.b"), states(ent("fan.b", "on")), NOW)!.state).toEqual(word("On"));
  });
});

describe("locks and covers", () => {
  it("says what a lock does", () => {
    expect(oneLookTileState(tile("lock.front"), states(ent("lock.front", "locked")), NOW)!.state).toEqual(word("Locked"));
    expect(oneLookTileState(tile("lock.back"), states(ent("lock.back", "unlocked")), NOW)!.state).toEqual(word("Unlocked"));
    for (const [raw, w] of [["locking", "Locking"], ["unlocking", "Unlocking"], ["jammed", "Jammed"], ["open", "Open"]] as const) {
      expect(oneLookLock(raw, true).state).toEqual(word(w));
    }
  });

  it("says where a cover is", () => {
    expect(oneLookCover("closed", false, 0).state).toEqual(word("Closed"));
    expect(oneLookCover("open", true, 100).state).toEqual(word("Open"));
    expect(oneLookCover("open", true, 35).state).toEqual(num("35", { unit: "%" }));
    expect(oneLookCover("open", true, undefined).state).toEqual(word("Open"));
    expect(oneLookCover("opening", false, 20).state).toEqual(word("Opening"));
    expect(oneLookCover("closing", true, 80).state).toEqual(word("Closing"));
  });
});

describe("climate", () => {
  it("shows the room and the range, with the fan disc (Page B's ecobee)", () => {
    const s = oneLookTileState(
      tile("climate.ecobee"),
      states(ent("climate.ecobee", "heat_cool", { target_temp_low: 68, target_temp_high: 77, current_temperature: 70, supported_features: 2 | 8 })),
      NOW,
    )!;
    expect(s.state).toEqual(num("70°", { tail: "68\u201377°" }));
    expect(s.accessory).toBe("fan");
    expect(s.role).toEqual({ kind: "plain" });
  });

  it("says where a single target is going", () => {
    const s = oneLookTileState(tile("climate.den"), states(ent("climate.den", "heat", { temperature: 72, current_temperature: 70.4 })), NOW)!;
    expect(s.state).toEqual(num("70°", { tail: "to 72°" }));
    expect(s.accessory).toBe("none");
  });

  it("shows the room then Off when off", () => {
    expect(oneLookTileState(tile("climate.den"), states(ent("climate.den", "off", { temperature: 72, current_temperature: 70 })), NOW)!.state).toEqual(num("70°", { tail: "Off" }));
    expect(oneLookTileState(tile("climate.den"), states(ent("climate.den", "off")), NOW)!.state).toEqual(word("Off"));
  });

  it("lets the tile's settings choose the number", () => {
    const base = { isOff: false, current: 23.2, target: 21.5, isDualSetpoint: false, supportsFanMode: false, format: climateFormat(0.5) };
    expect(oneLookClimate({ ...base, showTarget: false }).state).toEqual(num("23.2°"));
    expect(oneLookClimate({ ...base, showCurrent: false }).state).toEqual(num("21.5°"));
    expect(oneLookClimate({ ...base, showCurrent: false, showTarget: false }).state).toEqual(NONE);
    const den = states(ent("climate.den", "cool", { temperature: 21.5, current_temperature: 23.2, target_temp_step: 0.5 }));
    expect(oneLookTileState(tile("climate.den", { showTargetTempOnTile: false }), den, NOW)!.state).toEqual(num("23.2°"));
    expect(oneLookTileState(tile("climate.den", { showCurrentTempOnTile: false }), den, NOW)!.state).toEqual(num("21.5°"));
  });

  it("rounds as printf does, a tie to even", () => {
    expect(oneLookPrintfFixed(72.5, 0)).toBe("72");
    expect(oneLookPrintfFixed(73.5, 0)).toBe("74");
    expect(oneLookPrintfFixed(21.25, 1)).toBe("21.2");
    expect(oneLookPrintfFixed(21.75, 1)).toBe("21.8");
    expect(oneLookPrintfFixed(70.4, 0)).toBe("70");
    expect(oneLookPrintfFixed(-72.5, 0)).toBe("-72");
    expect(oneLookClimateTemperature(21.5, 0.5)).toBe("21.5°");
  });
});

describe("sensors", () => {
  it("splits numbers into figure and unit", () => {
    expect(oneLookSensor({ entityId: "sensor.co2", state: "735", unit: "ppm" }).state).toEqual(num("735", { unit: "ppm", unitSpaced: true }));
    expect(oneLookSensor({ entityId: "sensor.eight_sleep", state: "71.04", unit: "°F" }).state).toEqual(num("71", { unit: "°F" }));
    expect(oneLookSensor({ entityId: "sensor.phone_battery", state: "15", unit: "%", deviceClass: "battery" }).state).toEqual(num("15", { unit: "%" }));
  });

  it("rounds the split exactly as the legacy string", () => {
    const joined = (state: string, unit: string | undefined, dp: number | undefined) => {
      const p = oneLookSensorParts(state, unit, dp)!;
      return p.number + (p.unit === undefined ? "" : (p.spaced ? " " : "") + p.unit);
    };
    expect(joined("72.45", "°F", 1)).toBe("72.5°F");
    expect(joined("4.15", "kWh", 1)).toBe("4.2 kWh");
    expect(joined("1234.5", "W", 0)).toBe("1235 W");
    expect(joined("0.5", undefined, 0)).toBe("1");
    expect(joined("12", "%", 2)).toBe("12%");
    expect(oneLookSensorParts("on", undefined, 1)).toBeUndefined();
    // Rounded on the shortest decimal, as ICU does.
    expect(oneLookFormatNumber(1.005, 2)).toBe("1.01");
    expect(oneLookFormatNumber(2.5, 0, { mode: "halfEven" })).toBe("2");
    expect(oneLookFormatNumber(1234567.891, 2, { mode: "halfEven", grouping: true })).toBe("1,234,567.89");
  });

  it("reads a counter as its raw number", () => {
    expect(oneLookSensor({ entityId: "counter.coffees", state: "3" }).state).toEqual(num("3"));
  });

  it("gives binary words their short forms (Page A's Fireplace Occupancy)", () => {
    expect(oneLookSensor({ entityId: "binary_sensor.fireplace", state: "off", deviceClass: "occupancy" }).state).toEqual(word("Not occupied", { short: "Vacant" }));
    expect(oneLookSensor({ entityId: "binary_sensor.yard", state: "off", deviceClass: "motion" }).state).toEqual(word("Clear"));
    expect(oneLookSensor({ entityId: "binary_sensor.door", state: "on", deviceClass: "door" }).state).toEqual(word("Open"));
  });

  it("adds how long ago a binary sensor changed", () => {
    const motion = { entityId: "binary_sensor.yard", state: "off", deviceClass: "motion", lastChanged: NOW - 5 * 60_000 };
    expect(oneLookSensor(motion, { now: NOW, missingData: "appSideNow", changeTimes: false }).state).toEqual(word("Clear"));
    expect(oneLookSensor(motion, { now: NOW, missingData: "integrationFirst", changeTimes: false }).state).toEqual(word("Clear · 5m ago", { short: "Clear" }));
    expect(oneLookSensor(motion, { now: NOW, missingData: "appSideNow", changeTimes: true }).state).toEqual(word("Clear · 5m ago", { short: "Clear" }));
    expect(oneLookSensor({ ...motion, lastChanged: undefined }, { now: NOW, changeTimes: true }).state).toEqual(word("Clear"));
    const occupied = { entityId: "binary_sensor.fire", state: "off", deviceClass: "occupancy", lastChanged: NOW - 3 * 3_600_000 };
    expect(oneLookSensor(occupied, { now: NOW }).state).toEqual(word("Not occupied · 3h ago", { short: "Vacant" }));
    const detected = { entityId: "binary_sensor.yard", state: "on", deviceClass: "motion", lastChanged: NOW - 20_000 };
    expect(oneLookSensor(detected, { now: NOW }).state).toEqual(word("Detected · just now", { short: "Detected" }));
    // From the entity's last_updated, through the tile.
    const yard = states(ent("binary_sensor.yard", "off", { device_class: "motion" }, new Date(NOW - 5 * 60_000).toISOString()));
    expect(oneLookTileState(tile("binary_sensor.yard"), yard, NOW)!.state).toEqual(word("Clear · 5m ago", { short: "Clear" }));
  });

  it("keeps idle states calm", () => {
    expect(oneLookToggle(false).isCalm).toBe(true);
    expect(oneLookToggle(true).isCalm).toBe(false);
    expect(oneLookLock("locked", true).isCalm).toBe(true);
    expect(oneLookLock("unlocked", false).isCalm).toBe(false);
    expect(oneLookLock("jammed", true).isCalm).toBe(false);
    expect(oneLookCover("closed", false, undefined).isCalm).toBe(true);
    expect(oneLookCover("closed", false, 0).isCalm).toBe(true);
    expect(oneLookCover("open", true, 40).isCalm).toBe(false);
    expect(oneLookFan(false, undefined).isCalm).toBe(true);
    expect(oneLookAction().isCalm && oneLookAssist().isCalm && oneLookPointControl().isCalm).toBe(true);
    expect(oneLookLocation("not_home").isCalm && !oneLookLocation("home").isCalm).toBe(true);
    expect(oneLookMedia("paused").isCalm && !oneLookMedia("playing").isCalm).toBe(true);
    expect(oneLookAlarm("disarmed").isCalm && !oneLookAlarm("armed_away").isCalm).toBe(true);
    expect(oneLookVacuum("docked").isCalm && !oneLookVacuum("cleaning").isCalm).toBe(true);
    const sensor = (state: string, deviceClass: string, unit?: string) => oneLookSensor({ entityId: "sensor.x", state, deviceClass, unit });
    expect(oneLookSensor({ entityId: "binary_sensor.yard", state: "off", deviceClass: "motion" }).isCalm).toBe(true);
    expect(oneLookSensor({ entityId: "binary_sensor.yard", state: "on", deviceClass: "motion" }).isCalm).toBe(false);
    expect(oneLookSensor({ entityId: "binary_sensor.net", state: "on", deviceClass: "connectivity" }).isCalm).toBe(true);
    expect(oneLookSensor({ entityId: "binary_sensor.net", state: "off", deviceClass: "connectivity" }).isCalm).toBe(false);
    expect(sensor("31", "humidity", "%").isCalm).toBe(true);
    expect(sensor("15", "battery", "%").isCalm).toBe(false);
    expect(sensor("80", "battery", "%").isCalm).toBe(true);
  });

  it("reads other sensor states as words", () => {
    expect(oneLookSensor({ entityId: "assist_satellite.kitchen", state: "listening" }).state).toEqual(word("Listening"));
    expect(oneLookSensor({ entityId: "assist_satellite.kitchen", state: "idle" }).state).toEqual(NONE);
    expect(oneLookSensor({ entityId: "lawn_mower.bob", state: "mowing" }).state).toEqual(word("Mowing"));
    expect(oneLookSensor({ entityId: "sensor.next_bin", state: "Recycling" }).state).toEqual(word("Recycling"));
    expect(oneLookSensor({ entityId: "device_tracker.phone", state: "not_home" }).state).toEqual(word("Away"));
    expect(oneLookSensor({ entityId: "siren.hall", state: "on" }).state).toEqual(word("On"));
    expect(oneLookSensor({ entityId: "update.core", state: "off" }).state).toEqual(word("Up to date"));
    expect(oneLookSensor({ entityId: "update.core", state: "on" }).state).toEqual(word("Update available", { short: "Update" }));
    expect(oneLookSensor({ entityId: "update.core", state: "off", installedVersion: "1", latestVersion: "2" }).state).toEqual(word("Update available", { short: "Update" }));
  });

  it("shows weather's condition with the temperature on the right (Page B's Home)", () => {
    const s = oneLookSensor({ entityId: "weather.home", state: "partlycloudy", temperature: 62.4 });
    expect(s.state).toEqual(word("Partly cloudy"));
    expect(s.bigValue).toEqual({ figure: "62°" });
    expect(oneLookStateFor(s, true)).toEqual(word("Partly cloudy"));
    expect(oneLookStateFor(s, false)).toEqual(num("62°", { tail: "Partly cloudy" }));
    expect(oneLookWeather("sunny", 62, { high: 68, low: 51 }).bigValue).toEqual({ figure: "62°", sub: "H 68° L 51°" });
    expect(oneLookWeather("rainy", undefined).state).toEqual(word("Rain"));
    expect(oneLookWeatherText("clear-night")).toBe("Clear night");
    expect(oneLookWeatherText("snowy_windy")).toBe("Snowy windy");
  });
});

describe("people", () => {
  it("says where a person is", () => {
    const at = (state: string) => oneLookTileState(tile("person.a"), states(ent("person.a", state)), NOW)!;
    expect(at("home").state).toEqual(word("Home"));
    expect(at("not_home").state).toEqual(word("Away"));
    expect(at("Work").state).toEqual(word("Work"));
    expect(at("Office Building").state).toEqual(word("Office Building", { short: "Office" }));
    expect(at("unknown").isUnavailable).toBe(true);
  });

  it("takes a zone's short form only as a whole word", () => {
    expect(oneLookLocation("unknown").state).toEqual(word("Unknown"));
    expect(oneLookLocation("grandmas_house").state).toEqual(word("Grandmas house"));
    expect(oneLookLocation("gym_downtown").state).toEqual(word("Gym downtown", { short: "Gym" }));
  });

  it("leaves the word when a value label is off", () => {
    const dim = oneLookLight(true, 64);
    expect(oneLookHidingNumber(dim, true).state).toEqual(word("On"));
    expect(oneLookHidingNumber(dim, false).state).toEqual(num("64", { unit: "%" }));
    expect(oneLookHidingNumber(oneLookLight(false, undefined), true).state).toEqual(word("Off"));
    expect(oneLookHidingNumber(oneLookFan(true, 40), true).state).toEqual(word("On"));
    expect(oneLookHidingNumber(oneLookFan(true, 40, false), true).isUnavailable).toBe(true);
  });
});

describe("media", () => {
  it("says Playing or Paused with the play button", () => {
    const paused = oneLookMedia("paused");
    expect(paused.state).toEqual(word("Paused"));
    expect(paused.accessory).toBe("playPause");
    expect(paused.role).toEqual({ kind: "media", playing: false });
    const playing = oneLookMedia("playing");
    expect(playing.state).toEqual(word("Playing"));
    expect(playing.role).toEqual({ kind: "media", playing: true });
    expect(oneLookMedia("idle").state).toEqual(NONE);
    expect(oneLookMedia("idle").accessory).toBe("playPause");
    expect(oneLookMedia("off").state).toEqual(NONE);
    expect(oneLookMedia("off").accessory).toBe("none");
  });

  it("says what plays", () => {
    const both = oneLookNowPlaying("playing", "Blue in Green", "Miles Davis");
    expect(both.state).toEqual(word("Blue in Green · Miles Davis", { short: "Blue in Green" }));
    expect(both.accessory).toBe("playPause");
    expect(both.role).toEqual({ kind: "media", playing: true });
    expect(oneLookNowPlaying("paused", "So What", " ").state).toEqual(word("So What"));
    expect(oneLookNowPlaying("idle", "So What", undefined).state).toEqual(NONE);
    expect(oneLookNowPlaying("playing", undefined, "Miles").state).toEqual(word("Playing"));
    expect(oneLookNowPlaying("playing", "So What", undefined, false).state).toEqual(oneLookUnavailableLine());
  });
});

describe("timers, scenes, scripts", () => {
  it("says a running timer's time left", () => {
    const finishes = new Date(NOW + (4 * 60 + 32.6) * 1000).toISOString();
    const running = oneLookTileState(tile("timer.t"), states(ent("timer.t", "active", { remaining: "0:10:00", finishes_at: finishes })), NOW)!;
    expect(running.state).toEqual(num("4:32", { tail: "left", keepTail: true }));
    expect(oneLookTimer("paused", 272).state).toEqual(num("4:32", { tail: "paused", keepTail: true }));
    expect(oneLookTimer("idle", undefined).state).toEqual(NONE);
    expect(oneLookTimer("active", undefined).state).toEqual(num("0:00", { tail: "left", keepTail: true }));
    const done = oneLookTileState(tile("timer.t"), states(ent("timer.t", "active", { finishes_at: new Date(NOW - 3000).toISOString() })), NOW)!;
    expect(done.state).toEqual(num("0:00", { tail: "left", keepTail: true }));
    expect(oneLookClock(3 * 3600 + 4 * 60 + 5)).toBe("3:04:05");
    const ninety = oneLookTileState(tile("timer.test"), states(ent("timer.test", "active", { finishes_at: new Date(NOW + 90_000).toISOString() })), NOW)!;
    expect(ninety.state).toEqual(num("1:30", { tail: "left", keepTail: true }));
  });

  it("says when a scene ran (Page B's Office Red)", () => {
    const at = (state: string) => oneLookTileState(tile("scene.office_red"), states(ent("scene.office_red", state)), NOW)!;
    expect(at(new Date(NOW - (2 * 60 + 10) * 1000).toISOString()).state).toEqual(word("Ran 2m ago", { short: "2m ago" }));
    expect(at("scening").state).toEqual(NONE);
    expect(at("unknown").state).toEqual(NONE);
    expect(at("unavailable").isUnavailable).toBe(true);
  });

  it("reads Home Assistant's scene times", () => {
    expect(oneLookInternetDate("2026-10-24T14:02:11.123456+00:00")).toBeDefined();
    expect(oneLookInternetDate("2026-10-24T14:02:11+00:00")).toBeDefined();
    expect(oneLookInternetDate("2026-10-24")).toBeUndefined();
  });

  it("uses minutes, hours and days", () => {
    expect(oneLookAgo(NOW - 20_000, NOW).long).toBe("Just now");
    expect(oneLookAgo(NOW + 30_000, NOW).long).toBe("Just now");
    expect(oneLookAgo(NOW - 59 * 60_000, NOW)).toEqual({ long: "59m ago", short: "59m" });
    expect(oneLookAgo(NOW - (3 * 3600 + 59 * 60) * 1000, NOW)).toEqual({ long: "3h ago", short: "3h" });
    expect(oneLookAgo(NOW - (2 * 86400 + 3600) * 1000, NOW)).toEqual({ long: "2d ago", short: "2d" });
    expect(oneLookRanLine(NOW - 10_000, NOW)).toEqual(word("Ran just now", { short: "Just now" }));
  });

  it("shows only a script's name for now", () => {
    expect(oneLookTileState(tile("script.good_night"), states(ent("script.good_night", "off")), NOW)!.state).toEqual(NONE);
    const ran = NOW - 120_000;
    expect(oneLookScript({ lastTriggered: ran, now: NOW, missingData: "appSideNow" }).state).toEqual(NONE);
    expect(oneLookScript({ lastTriggered: ran, now: NOW, missingData: "integrationFirst" }).state).toEqual(word("Ran 2m ago", { short: "2m ago" }));
  });
});

describe("helpers, alarms, vacuums", () => {
  it("shows an input number's and select's value", () => {
    expect(oneLookTileState(tile("input_number.a"), states(ent("input_number.a", "40", { unit_of_measurement: "%" })), NOW)!.state).toEqual(num("40", { unit: "%" }));
    expect(oneLookTileState(tile("input_number.b"), states(ent("input_number.b", "2.5", { step: 0.5, unit_of_measurement: "min" })), NOW)!.state).toEqual(num("2.5", { unit: "min", unitSpaced: true }));
    expect(oneLookInputNumber(7, 1, undefined).state).toEqual(num("7"));
    expect(oneLookTileState(tile("input_select.mode"), states(ent("input_select.mode", "Movie night")), NOW)!.state).toEqual(word("Movie night"));
    expect(oneLookInputSelect("  ").state).toEqual(NONE);
  });

  it("shows an alarm's state, then its short form", () => {
    expect(oneLookTileState(tile("alarm_control_panel.a"), states(ent("alarm_control_panel.a", "armed_away")), NOW)!.state).toEqual(word("Armed Away", { short: "Away" }));
    expect(oneLookAlarm("disarmed").state).toEqual(word("Disarmed", { short: "Off" }));
    expect(oneLookAlarm("triggered").state).toEqual(word("Triggered", { short: "Alert" }));
    expect(oneLookAlarm("pending").state).toEqual(word("Pending"));
  });

  it("never says idle for a vacuum", () => {
    expect(oneLookVacuum("cleaning").state).toEqual(word("Cleaning"));
    expect(oneLookVacuum("docked").state).toEqual(word("Docked"));
    expect(oneLookVacuum("idle").state).toEqual(NONE);
  });
});

describe("actions and cues", () => {
  it("puts cues in the accessory disc", () => {
    expect(oneLookPointControl()).toEqual(calm({ accessory: "arrow" }));
    expect(oneLookAssist()).toEqual(calm({ accessory: "mic" }));
    expect(oneLookAction()).toEqual(calm());
    expect(oneLookCameraTile(true, true)).toEqual({ ...calm({ accessory: "live", role: { kind: "camera" } }), isCalm: false });
    expect(oneLookCameraTile(true, false)).toEqual({ ...calm({ role: { kind: "camera" } }), isCalm: false });
  });

  it("shows an HTTP action's value or its warning", () => {
    expect(oneLookHttpAction("42").state).toEqual(num("42"));
    expect(oneLookHttpAction("ok").state).toEqual(word("ok"));
    expect(oneLookHttpAction("42", "Timed out").state).toEqual(word("Timed out", { amber: true }));
    expect(oneLookHttpAction(undefined).state).toEqual(NONE);
  });

  it("shows an HTTP action tile's reply", () => {
    const broken = oneLookHttpTile(true, true, "42");
    expect(broken.state).toEqual(word("Needs setup", { amber: true }));
    expect(broken.isUnavailable).toBe(true);
    expect(broken.bigValue).toBeUndefined();
    const number = oneLookHttpTile(false, true, "21.5");
    expect(number.bigValue).toEqual({ figure: "21.5" });
    expect(number.state).toEqual(NONE);
    expect(oneLookStateFor(number, false)).toEqual(num("21.5"));
    const words = oneLookHttpTile(false, true, "\nall good\nsecond line");
    expect(words.state).toEqual(word("all good"));
    expect(words.bigValue).toBeUndefined();
    expect(oneLookHttpTile(false, true, undefined)).toEqual(calm());
    expect(oneLookHttpTile(false, false, "42")).toEqual(calm());
  });

  it("says Removed for a removed macro", () => {
    const removed = oneLookRemoved();
    expect(removed.state).toEqual(word("Removed", { amber: true }));
    expect(removed.isUnavailable).toBe(true);
  });

  it("says what point control aims at", () => {
    expect(oneLookPointControl("Desk Lamp")).toEqual(calm({ state: word("Desk Lamp"), accessory: "arrow" }));
    expect(oneLookPointControl("  ")).toEqual(calm({ accessory: "arrow" }));
    expect(oneLookPointControl(undefined)).toEqual(calm({ accessory: "arrow" }));
  });

  it("follows a vacuum's or mower's state with its battery", () => {
    expect(oneLookWithBattery(oneLookVacuum("docked"), 82).state).toEqual(word("Docked · 82%", { short: "Docked" }));
    expect(oneLookWithBattery(oneLookVacuum("idle"), 140).state).toEqual(num("100", { unit: "%" }));
    expect(oneLookWithBattery(oneLookVacuum("docked", false), 50).state).toEqual(oneLookUnavailableLine());
    expect(oneLookWithBattery(oneLookVacuum("cleaning"), undefined).state).toEqual(word("Cleaning"));
  });
});

describe("unavailable", () => {
  it("says Offline quietly on every kind, drops the accessory and is never lit", () => {
    expect(oneLookUnavailableLine(false)).toEqual(word("Unavailable", { short: "Offline", amber: true }));
    expect(oneLookUnavailableLine(true)).toEqual(word("Offline"));
    const offline = oneLookUnavailableLine();
    const list = [
      oneLookTileState(tile("light.garage"), states(ent("light.garage", "unavailable", { brightness: 255 })), NOW)!,
      oneLookTileState(tile("climate.a"), states(ent("climate.a", "unavailable", { supported_features: 8 })), NOW)!,
      oneLookTileState(tile("lock.a"), states(ent("lock.a", "unknown")), NOW)!,
      oneLookTileState(tile("media_player.a"), states(ent("media_player.a", "unavailable")), NOW)!,
      oneLookTileState(tile("sensor.a"), states(ent("sensor.a", "unavailable")), NOW)!,
      oneLookCameraTile(true, true, false),
      oneLookPointControl(undefined, false),
      oneLookTimer("active", 10, false),
    ];
    for (const s of list) {
      expect(s.state).toEqual(offline);
      expect(s.isUnavailable).toBe(true);
      expect(s.accessory).toBe("none");
    }
    expect(list[0]!.role).toEqual({ kind: "light", on: false });
    expect(list[3]!.role).toEqual({ kind: "media", playing: false });
    expect(list[5]!.role).toEqual({ kind: "camera" });
  });

  it("keeps Offline when the state is hidden", () => {
    const on = oneLookLight(true, 50);
    expect(oneLookHidingState(on, true).state).toEqual(NONE);
    expect(oneLookHidingState(on, false)).toBe(on);
    const gone = oneLookLight(true, 50, false);
    expect(oneLookHidingState(gone, true)).toBe(gone);
    const weather = oneLookHidingState(oneLookWeather("sunny", 60), true);
    expect(oneLookStateFor(weather, false)).toEqual(NONE);
    expect(weather.bigValue).toEqual({ figure: "60°" });
  });
});

describe("no filler", () => {
  it("never says Scene, Script, Idle or --:--", () => {
    const text = (line: OneLookStateLine) =>
      line.kind === "number" ? [line.figure, line.unit, line.tail].filter(Boolean).join(" ") : line.kind === "word" ? [line.word, line.short].filter(Boolean).join(" ") : "";
    const list = [
      oneLookScene(undefined, NOW),
      oneLookScript(),
      oneLookTimer("idle", undefined),
      oneLookTimer("active", undefined),
      oneLookMedia("idle"),
      oneLookVacuum("idle"),
      oneLookSensor({ entityId: "sensor.a", state: "idle" }),
    ];
    for (const s of list) for (const filler of ["Scene", "Script", "Idle", "--:--"]) expect(text(s.state)).not.toContain(filler);
  });
});

describe("cameras", () => {
  it("is its picture or a plain tile", () => {
    expect(oneLookCameraTile(false, true)).toEqual(calm());
    const picture = oneLookTileState(tile("camera.driveway", { cameraDisplayMode: "preview" }), states(ent("camera.driveway", "unavailable")), NOW)!;
    expect(picture.state).toEqual(oneLookUnavailableLine());
    expect(picture.role).toEqual({ kind: "camera" });
    expect(picture.accessory).toBe("none");
    const icon = oneLookTileState(tile("camera.driveway"), states(ent("camera.driveway", "unavailable")), NOW)!;
    expect(icon.role).toEqual({ kind: "plain" });
    expect(icon.isUnavailable).toBe(true);
    // A static preview plays no live video, so no chip.
    expect(oneLookTileState(tile("camera.driveway", { cameraDisplayMode: "preview" }), states(ent("camera.driveway", "idle")), NOW)!.accessory).toBe("none");
    expect(oneLookTileState(tile("multicam.yard", { cameraDisplayMode: "preview" }), {}, NOW)!.role).toEqual({ kind: "camera" });
  });
});

describe("a stored tile (each kind's oneLookBody)", () => {
  it("draws a tile whose entity has not loaded as the placeholder", () => {
    const loading = oneLookTileState(tile("light.living_room", { color: "#FF3B30" }), {}, NOW)!;
    expect(loading.placeholder && loading.stateHidden && loading.keepsBarRoom).toBe(true);
    expect(loading.state).toEqual(ONE_LOOK_ASSUMED_STATE);
    expect(oneLookTileState(tile("switch.a"), {}, NOW)!.keepsBarRoom).toBe(false);
    // Any kind the app has no tile for draws as the placeholder too.
    expect(oneLookTileState(tile("sun.sun"), states(ent("sun.sun", "above_horizon")), NOW)!.placeholder).toBe(true);
  });

  it("leaves the kinds that keep their own face", () => {
    for (const id of ["divider.a", "spacer.a", "template.a", "chart.a", "map.a", "web.a", "text_field.a"]) expect(oneLookTileState(tile(id), {}, NOW)).toBeUndefined();
  });

  it("hides a state by the value labels or activity status switch", () => {
    const light = states(ent("light.desk", "on", { brightness: 128 }));
    expect(oneLookTileState(tile("light.desk", { stateValueLabelStyle: "Off" }), light, NOW)!.state).toEqual(word("On"));
    const cover = states(ent("cover.blind", "open", { current_position: 35 }));
    expect(oneLookTileState(tile("cover.blind", { stateValueLabelStyle: "Off" }), cover, NOW)!.state).toEqual(NONE);
    const fan = states(ent("fan.a", "on", { percentage: 40 }));
    expect(oneLookTileState(tile("fan.a", { stateValueLabelStyle: "Off" }), fan, NOW)!.state).toEqual(word("On"));
    // The fan's activity status hides nothing.
    expect(oneLookTileState(tile("fan.a", { showActivityStatus: false }), fan, NOW)!.state).toEqual(num("40", { unit: "%" }));
    const sensor = states(ent("sensor.co2", "735", { unit_of_measurement: "ppm" }));
    expect(oneLookTileState(tile("sensor.co2", { stateValueLabelStyle: "Off" }), sensor, NOW)!.state).toEqual(NONE);
    const timer = states(ent("timer.t", "paused", { remaining: "0:04:32" }));
    expect(oneLookTileState(tile("timer.t"), timer, NOW)!.state).toEqual(num("4:32", { tail: "paused", keepTail: true }));
    expect(oneLookTileState(tile("timer.t", { showActivityStatus: false }), timer, NOW)!.state).toEqual(NONE);
    const vacuum = states(ent("vacuum.v", "docked", { battery_level: 82 }));
    expect(oneLookTileState(tile("vacuum.v"), vacuum, NOW)!.state).toEqual(word("Docked · 82%", { short: "Docked" }));
    expect(oneLookTileState(tile("vacuum.v", { showActivityStatus: false }), vacuum, NOW)!.state).toEqual(num("82", { unit: "%" }));
    expect(oneLookTileState(tile("vacuum.v", { showBatteryOnTile: false }), vacuum, NOW)!.state).toEqual(word("Docked"));
  });

  it("hides the sensor tile's state on a kind without value labels, as the app does", () => {
    // `stateShowsValueLabels` is false for weather, trackers, updates and
    // mowers, so the app's sensor tile shows no state on them.
    const weather = oneLookTileState(tile("weather.home"), states(ent("weather.home", "sunny", { temperature: 60 })), NOW)!;
    expect(oneLookStateFor(weather, false)).toEqual(NONE);
    expect(weather.bigValue).toEqual({ figure: "60°" });
    const mower = oneLookTileState(tile("lawn_mower.bob"), states(ent("lawn_mower.bob", "mowing"), ent("sensor.bob_battery", "64.8")), NOW)!;
    expect(mower.state).toEqual(num("64", { unit: "%" }));
  });

  it("gives a cover, fan and player their bar level", () => {
    const cover = oneLookTileState(tile("cover.blind"), states(ent("cover.blind", "open", { current_position: 40 })), NOW)!;
    expect(cover.barLevel).toBe(0.4);
    expect(oneLookBarValue(cover)).toBe(0.4);
    expect(oneLookFillLevel(cover, true)).toBe(0.4);
    expect(oneLookFillLevel(cover, false)).toBeUndefined();
    expect(oneLookTileState(tile("fan.a"), states(ent("fan.a", "off", { percentage: 40 })), NOW)!.barLevel).toBe(0);
    expect(oneLookTileState(tile("fan.a"), states(ent("fan.a", "on")), NOW)!.barLevel).toBeUndefined();
    expect(oneLookTileState(tile("media_player.den"), states(ent("media_player.den", "playing", { volume_level: 0.3 })), NOW)!.barLevel).toBe(0.3);
    expect(oneLookTileState(tile("media_player.den"), states(ent("media_player.den", "off", { volume_level: 0.3 })), NOW)!.barLevel).toBe(0);
    const light = oneLookTileState(tile("light.desk"), states(ent("light.desk", "on", { brightness: 153 })), NOW)!;
    expect(oneLookBarValue(light)).toBe(0.6);
    expect(oneLookBarValue(oneLookTileState(tile("light.plug"), states(ent("light.plug", "on")), NOW)!)).toBeUndefined();
  });

  it("asks for the fill variant as each kind does, and reads state colours only in Multi mode", () => {
    const off = states(ent("light.desk", "off"));
    expect(oneLookTileState(tile("light.desk"), off, NOW)!.filled).toBe(false);
    expect(oneLookTileState(tile("light.desk"), states(ent("light.desk", "on")), NOW)!.filled).toBe(true);
    expect(oneLookTileState(tile("automation.a"), states(ent("automation.a", "off")), NOW)!.filled).toBe(false);
    expect(oneLookTileState(tile("lock.a"), states(ent("lock.a", "locked")), NOW)!.filled).toBe(true);
    const multi = tile("light.desk", { usesStateIcons: true, stateIcons: { on: "lamp.desk" }, stateColors: { on: "#FF3B30" } });
    const s = oneLookTileState(multi, states(ent("light.desk", "on")), NOW)!;
    expect(s.stateKey).toBe("on");
    expect(s.filled).toBe(false);
    expect(oneLookTileState(tile("light.desk"), states(ent("light.desk", "on")), NOW)!.stateKey).toBeUndefined();
    // A kind that passes no state key never reads them.
    expect(oneLookTileState(tile("vacuum.v", { usesStateIcons: true }), states(ent("vacuum.v", "docked")), NOW)!.stateKey).toBeUndefined();
  });

  it("draws a remote with its player's words and no play button", () => {
    const tv = states(ent("remote.tv", "on"), ent("media_player.tv", "playing"));
    const s = oneLookTileState(tile("remote.tv"), tv, NOW)!;
    expect(s.state).toEqual(word("Playing"));
    expect(s.accessory).toBe("none");
    expect(s.role).toEqual({ kind: "plain" });
    expect(oneLookTileState(tile("remote.box"), states(ent("remote.box", "off")), NOW)!.state).toEqual(word("Off"));
  });

  it("draws a music hub from its leading speaker", () => {
    const hub = tile("music_hub.a", { musicHubSpeakerIds: ["media_player.a", "media_player.b"] });
    const s = oneLookTileState(hub, states(ent("media_player.a", "paused", { media_title: "So What" }), ent("media_player.b", "playing", { media_title: "Blue in Green", media_artist: "Miles Davis" })), NOW)!;
    expect(s.state).toEqual(word("Blue in Green · Miles Davis", { short: "Blue in Green" }));
    expect(s.accessory).toBe("playPause");
    const quiet = oneLookTileState(hub, {}, NOW)!;
    expect(quiet.state).toEqual(NONE);
    expect(quiet.role).toEqual({ kind: "media", playing: false });
    expect(quiet.accessory).toBe("none");
  });

  it("draws the app's own kinds without an entity", () => {
    expect(oneLookTileState(tile("assist.a"), {}, NOW)!.accessory).toBe("mic");
    expect(oneLookTileState(tile("point_control.a"), {}, NOW)!.accessory).toBe("arrow");
    expect(oneLookTileState(tile("macro.a"), {}, NOW)!.state).toEqual(word("Removed", { amber: true }));
    expect(oneLookTileState(tile("page.p1"), {}, NOW)!.state).toEqual(NONE);
    expect(oneLookTileState(tile("http_action.a"), {}, NOW, { httpNeedsAttention: true })!.isUnavailable).toBe(true);
    expect(oneLookTileState(tile("http_action.a", { httpResponseDisplay: "tileValue" }), {}, NOW, { httpValue: "21.5" })!.bigValue).toEqual({ figure: "21.5" });
  });
});
