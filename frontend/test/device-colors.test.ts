// Each device's color, shared by every tab: the Pages tab, the Complications
// tab, the Watch app's and the iPhone app's device pickers, Home and the
// Watch app's Complications screen all read it from `device-colors.ts`.

import { describe, expect, it } from "vitest";

import { DEVICE_COLORS, deviceColor, deviceColorAt, deviceColorOrder, deviceColors, deviceColorsCache } from "../src/device-colors.js";
import type { OwnerSummary } from "../src/ha-api.js";
import { ownerShortLabel, ownersByKind } from "../src/panel.js";
import { pickerTabs } from "../src/pickerRows.js";
import { deviceKindOf } from "../src/version.js";
import { linkDevicesOf } from "../src/watch-pages/links.js";
import { watchRowChoices } from "../src/watch-row.js";

const owner = (id: string, kind: "watch" | "iphone" | "library", over: Partial<OwnerSummary> = {}): OwnerSummary => ({
  owner_watch_id: id,
  device_name: id,
  device_kind: kind,
  paired_iphone_name: null,
  app_version: "3.0.0",
  screen_size: null,
  complication_count: 0,
  token: 1,
  is_orphan: false,
  ...over,
}) as OwnerSummary;

// Home Assistant's own order mixes the kinds; both tabs list watches first.
const OWNERS = [
  owner("p-jesse", "iphone"),
  owner("w-jesse", "watch"),
  owner("library", "library"),
  owner("w-chen", "watch"),
  owner("p-chen", "iphone"),
];

const P = (n: number) => `var(--wa-person-${n})`;

describe("a device's color", () => {
  it("goes by the watches, then the iPhones, in the home's order", () => {
    expect(deviceColorOrder(OWNERS)).toEqual(["w-jesse", "w-chen", "p-jesse", "p-chen"]);
    const colors = deviceColors(OWNERS);
    expect(["w-jesse", "w-chen", "p-jesse", "p-chen"].map((id) => deviceColor(colors, id))).toEqual([P(1), P(2), P(3), P(4)]);
  });

  it("gives the Library and an unknown device none", () => {
    const colors = deviceColors(OWNERS);
    expect(deviceColor(colors, "library")).toBeUndefined();
    expect(deviceColor(colors, "gone")).toBeUndefined();
    expect(deviceColor(colors, undefined)).toBeUndefined();
  });

  it("starts the six again on the seventh device", () => {
    expect(DEVICE_COLORS).toBe(6);
    expect(deviceColorAt(5)).toBe(P(6));
    expect(deviceColorAt(6)).toBe(P(1));
    const many = Array.from({ length: 7 }, (_, i) => owner(`w${i}`, "watch"));
    expect(deviceColor(deviceColors(many), "w6")).toBe(P(1));
  });

  it("puts a device no longer registered after every live one, so it moves nobody's color", () => {
    const owners = [owner("w-old", "watch", { is_orphan: true }), ...OWNERS];
    const colors = deviceColors(owners);
    expect(deviceColor(colors, "w-jesse")).toBe(P(1));
    expect(deviceColor(colors, "p-chen")).toBe(P(4));
    expect(deviceColor(colors, "w-old")).toBe(P(5));
  });

  it("matches an id in any case", () => {
    expect(deviceColor(deviceColors([owner("ABC-1", "watch")]), "abc-1")).toBe(P(1));
  });

  it("is made once per owners list by the cache", () => {
    const cached = deviceColorsCache();
    const first = cached(OWNERS);
    expect(cached(OWNERS)).toBe(first);
    expect(cached([...OWNERS])).not.toBe(first);
  });
});

describe("the same color on every tab", () => {
  const colors = deviceColors(OWNERS);

  it("is each tab's own place in the Complications tabs and the Pages tabs", () => {
    // The Complications tab's device tabs (`pickerDevices` in panel.ts).
    const complications = pickerTabs([], ownersByKind(OWNERS).map((o) => ({
      ownerId: o.owner_watch_id, label: ownerShortLabel(o), kind: deviceKindOf(o),
    }))).filter((t) => t.kind === "watch" || t.kind === "iphone").map((t) => t.key);
    // The Pages tab's device tabs, on a home with phone pages.
    const pages = linkDevicesOf(OWNERS, true).map((d) => d.ownerId);
    expect(complications).toEqual(pages);
    expect(complications.map((id) => deviceColor(colors, id))).toEqual(pages.map((_, i) => deviceColorAt(i)));
  });

  it("keeps a watch's color on a home without phone pages, where the Pages tab lists no iPhone", () => {
    const pages = linkDevicesOf(OWNERS, false).map((d) => d.ownerId);
    expect(pages).toEqual(["w-jesse", "w-chen"]);
    expect(pages.map((id) => deviceColor(colors, id))).toEqual([P(1), P(2)]);
  });

  it("is the one the Watch app's and the iPhone app's pickers list", () => {
    expect(watchRowChoices(OWNERS, undefined).map((c) => deviceColor(colors, c.id))).toEqual([P(1), P(2)]);
    expect(watchRowChoices(OWNERS, undefined, "iphone").map((c) => deviceColor(colors, c.id))).toEqual([P(3), P(4)]);
  });
});
