// The home's one sync pill: where each device stands (a week unseen is asleep
// and no longer waiting), what the pill says for the home, each device's
// words in its popover, and the drawing, flattened to text.

import { describe, expect, it } from "vitest";

import type { HomeDeviceRow } from "../src/home.js";
import { ASLEEP_AFTER_DAYS, ASLEEP_NOTE, type SyncPillDevice, isAsleep, renderSyncPill, seenDays, syncPillDevices, syncPillStyles, syncPillSummary, syncRowWords, syncStateOf } from "../src/sync-pill.js";

const DAY = 86_400;

const flat = (v: unknown): string => {
  if (Array.isArray(v)) return v.map(flat).join("");
  if (v !== null && typeof v === "object" && "strings" in v && "values" in v) {
    const r = v as { strings: readonly string[]; values: unknown[] };
    return r.strings.map((s, i) => s + (i < r.values.length ? flat(r.values[i]) : "")).join("");
  }
  return typeof v === "string" || typeof v === "number" || typeof v === "boolean" ? String(v) : "";
};

const device = (over: Partial<SyncPillDevice> = {}): SyncPillDevice => ({
  id: "w1", name: "Apple Watch", kind: "watch", sync: "synced", waitingFor: [], ...over,
});

describe("a device's state", () => {
  it("is synced, however long it has been away: it has nothing to catch up on", () => {
    expect(syncStateOf(device())).toBe("synced");
    expect(syncStateOf(device({ seenSeconds: 40 * DAY }))).toBe("synced");
    expect(syncRowWords(device({ seenSeconds: 40 * DAY }))).toBe("Synced");
  });

  it("is waiting while it has been seen lately, or nobody knows when", () => {
    const waiting = { sync: "waiting", waitingFor: ["menus"] } as const;
    expect(syncStateOf(device({ ...waiting, seenSeconds: 60 }))).toBe("waiting");
    expect(syncStateOf(device({ ...waiting, seenSeconds: (ASLEEP_AFTER_DAYS * DAY) - 1 }))).toBe("waiting");
    expect(syncStateOf(device(waiting))).toBe("waiting");
    expect(syncRowWords(device({ ...waiting, seenSeconds: 60 }))).toBe("Waiting: menus");
    expect(syncRowWords(device({ sync: "waiting", waitingFor: ["pages", "menus"] }))).toBe("Waiting: pages, menus");
    expect(syncRowWords(device({ sync: "waiting", waitingFor: [] }))).toBe("Waiting");
  });

  it("is asleep from a week unseen, with the days said", () => {
    const waiting = { sync: "waiting", waitingFor: ["pages"] } as const;
    expect(ASLEEP_AFTER_DAYS).toBe(7);
    expect(isAsleep(device({ ...waiting, seenSeconds: 7 * DAY }))).toBe(true);
    expect(syncStateOf(device({ ...waiting, seenSeconds: 7 * DAY }))).toBe("asleep");
    expect(syncRowWords(device({ ...waiting, seenSeconds: 15 * DAY + 3600 }))).toBe("Asleep · 15 days");
    expect(seenDays(undefined)).toBeUndefined();
    expect(seenDays(DAY * 2 - 1)).toBe(1);
  });

  it("counts a device that could not use the last save as waiting, and says so", () => {
    expect(syncStateOf(device({ rejected: ["pages"] }))).toBe("waiting");
    expect(syncRowWords(device({ rejected: ["pages"] }))).toBe("Not synced");
    expect(syncStateOf(device({ rejected: ["pages"], seenSeconds: 9 * DAY }))).toBe("asleep");
  });

  it("is idle when it has never synced and has nothing to receive", () => {
    expect(syncStateOf(device({ sync: "idle" }))).toBe("idle");
    expect(syncStateOf(device({ sync: "idle", seenSeconds: 30 * DAY }))).toBe("idle");
    expect(syncRowWords(device({ sync: "idle" }))).toBe("Nothing waiting");
  });
});

describe("what the pill says", () => {
  const synced = device({ id: "a", name: "A" });
  const waiting = device({ id: "b", name: "B", sync: "waiting", waitingFor: ["menus"], seenSeconds: 60 });
  const asleep = device({ id: "c", name: "C", sync: "waiting", waitingFor: ["pages"], seenSeconds: 15 * DAY });
  const asleep2 = device({ id: "d", name: "D", sync: "waiting", waitingFor: ["pages"], seenSeconds: 25 * DAY });

  it("counts only the devices you can act on as waiting, and the asleep apart", () => {
    const s = syncPillSummary([synced, asleep, asleep2, waiting]);
    expect(s).toMatchObject({ tone: "wait", label: "Waiting · 1", more: "· 2 asleep", waiting: 1, asleep: 2, synced: 1, all: 4 });
    expect(s.title).toContain("B");
    expect(s.title).not.toContain("C,");
  });

  it("is green once nobody awake waits, even with some asleep", () => {
    expect(syncPillSummary([synced])).toMatchObject({ tone: "ok", label: "Synced", more: "" });
    expect(syncPillSummary([synced, asleep])).toMatchObject({ tone: "ok", label: "Synced", more: "· 1 asleep" });
  });

  it("is grey when everything is asleep, or there is nothing to say", () => {
    expect(syncPillSummary([asleep, asleep2])).toMatchObject({ tone: "quiet", label: "Asleep · 2", more: "" });
    expect(syncPillSummary([device({ sync: "idle" })])).toMatchObject({ tone: "quiet", label: "Nothing waiting" });
    expect(syncPillSummary([])).toMatchObject({ tone: "quiet", label: "No devices", all: 0 });
  });
});

describe("the devices for the pill", () => {
  const row = (over: Partial<HomeDeviceRow>): HomeDeviceRow => ({ id: "w1", name: "Watch", kind: "watch", sync: "waiting", waitingFor: ["menus"], ...over });

  it("ages when it was last heard from, and a long-poll counts as now", () => {
    const owners: Record<string, { polling?: boolean; last_seen_seconds?: number | null }> = {
      w1: { last_seen_seconds: 7 * DAY - 10 }, w2: { polling: true, last_seen_seconds: 90 * DAY }, w3: {}, w4: { last_seen_seconds: null },
    };
    const list = syncPillDevices(
      [row({}), row({ id: "w2" }), row({ id: "w3" }), row({ id: "w4" })],
      (id) => owners[id], 20,
    );
    expect(list.map((d) => d.seenSeconds)).toEqual([7 * DAY + 10, 0, undefined, undefined]);
    expect(list.map(syncStateOf)).toEqual(["asleep", "waiting", "waiting", "waiting"]);
  });

  it("carries whose it is and its color, in the order given", () => {
    const list = syncPillDevices([row({ id: "b" }), row({ id: "a" })], () => undefined, 0, {
      personOf: (id) => (id === "a" ? "Jesse" : undefined),
      colorOf: (id) => `var(--c-${id})`,
    });
    expect(list.map((d) => d.id)).toEqual(["b", "a"]);
    expect(list[1]).toMatchObject({ person: "Jesse", color: "var(--c-a)" });
    expect(list[0]).not.toHaveProperty("person");
  });

  it("leaves out a person named after the device, which says nothing new", () => {
    const [d] = syncPillDevices([row({ name: "Sim" })], () => undefined, 0, { personOf: () => "sim" });
    expect(d).not.toHaveProperty("person");
  });
});

describe("the pill as drawn", () => {
  const devices = [
    device({ id: "a", name: "Apple Watch", person: "jesse", color: "var(--wa-person-1)" }),
    device({ id: "b", name: "iPhone 17 Pro", kind: "iphone", sync: "waiting", waitingFor: ["menus"], seenSeconds: 60 }),
    device({ id: "c", name: "Sim", sync: "waiting", waitingFor: ["pages"], seenSeconds: 25 * DAY }),
  ];

  it("is a summary to press, with a popover listing every device", () => {
    const text = flat(renderSyncPill({ devices, deviceHref: (id) => `/wrist-assistant/devices/${id}` }));
    expect(text).toContain(`<details class="wa-sync"`);
    expect(text).toContain(`<summary class="wa-sync-pill wait"`);
    expect(text).toContain("Waiting · 1");
    expect(text).toContain("· 1 asleep");
    expect(text).toContain("<b>Sync</b><span>3 devices</span>");
    for (const words of ["Synced", "Waiting: menus", "Asleep · 25 days", "Apple Watch", "<small>jesse</small>", "iPhone 17 Pro", "Sim"]) expect(text).toContain(words);
    expect(text).toContain("href=/wrist-assistant/devices/b");
    expect(text).toContain("--c:var(--wa-person-1)");
  });

  it("explains Asleep only while a device is asleep", () => {
    expect(flat(renderSyncPill({ devices }))).toContain(ASLEEP_NOTE);
    expect(flat(renderSyncPill({ devices: devices.slice(0, 2) }))).not.toContain(ASLEEP_NOTE);
  });

  it("draws nothing for a home with no devices", () => {
    expect(flat(renderSyncPill({ devices: [] }))).toBe("");
  });

  it("uses no hue but the status colors", () => {
    const text = syncPillStyles.cssText;
    expect(text).toContain("var(--wa-amber)");
    expect(text).toContain("var(--wa-green)");
    expect(text).toContain("var(--wa-faint)");
    expect(text).not.toContain("--wa-hue");
  });
});
