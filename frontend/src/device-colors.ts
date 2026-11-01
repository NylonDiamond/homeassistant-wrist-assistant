// Each device's color, the same on every tab.
//
// A device (a watch or an iPhone) takes one of the panel's six person colors
// (`--wa-person-1` to `-6`, set for the light and the dark skin) by its place
// in the home: the watches, then the iPhones, each in the order Home
// Assistant lists them. That is the order the Pages tab's device tabs and
// the Complications tab's device tabs both draw, so a device's tab, chips,
// frame and menu rows wear the same color on either tab, and in the Watch
// app's and the iPhone app's device pickers, on Home and on the Watch app's
// Complications screen. A device no longer registered comes after every
// live one, so it never moves a live device's color. The Library is no
// device and has none. A seventh device starts the six again.
//
// Per device rather than per person: one person's watch and iPhone are the
// two devices most often told apart.
//
// The six are purple, mint, blue, slate, pink and magenta (set in the panel's
// sheet for each skin), far enough apart to tell two devices by color: no
// red, amber or green, which mean destructive, waiting and synced. The color
// is the panel's own drawing: it is worked out here from the owners list
// and never stored, and the watch and iPhone apps do not read it.

import type { OwnerSummary } from "./ha-api.js";
import { deviceKindOf } from "./version.js";

/** How many device colors there are. */
export const DEVICE_COLORS = 6;

/** The six device colors, in order, as `--wa-person-1` to `-6` hold them:
 * each one's name, its dark skin value and its light skin value (dark
 * enough for 4.5:1 on a white card). The panel's sheet sets the tokens to
 * exactly these (a test holds them to it). */
export const DEVICE_PALETTE: readonly { name: string; dark: string; light: string }[] = [
  { name: "Purple", dark: "#a78bfa", light: "#6d28d9" },
  { name: "Mint", dark: "#5eead4", light: "#0f766e" },
  { name: "Blue", dark: "#60a5fa", light: "#1d4ed8" },
  { name: "Slate", dark: "#94a3b8", light: "#475569" },
  { name: "Pink", dark: "#f9a8d4", light: "#c2188a" },
  { name: "Magenta", dark: "#d946ef", light: "#a21caf" },
];

/** The color at one place in the order. */
export function deviceColorAt(index: number): string {
  return `var(--wa-person-${(index % DEVICE_COLORS) + 1})`;
}

/** What the order reads off a device. */
export type DeviceColorOwner = Pick<OwnerSummary, "owner_watch_id" | "device_kind" | "is_orphan">;

/** The devices' ids in color order: the live watches, the live iPhones, then
 * the ones no longer registered (watches, then iPhones). No Library. */
export function deviceColorOrder(owners: readonly DeviceColorOwner[]): string[] {
  const devices = owners.filter((o) => deviceKindOf(o) !== "library");
  const byKind = (list: readonly DeviceColorOwner[]) => [
    ...list.filter((o) => deviceKindOf(o) === "watch"),
    ...list.filter((o) => deviceKindOf(o) === "iphone"),
  ];
  return [...byKind(devices.filter((o) => !o.is_orphan)), ...byKind(devices.filter((o) => o.is_orphan))]
    .map((o) => o.owner_watch_id);
}

/** Every device's color, by owner id (upper-cased, as ids are compared). */
export type DeviceColors = ReadonlyMap<string, string>;

/** Each device's color var, from the panel's owners list. */
export function deviceColors(owners: readonly DeviceColorOwner[]): DeviceColors {
  const out = new Map<string, string>();
  deviceColorOrder(owners).forEach((id, i) => {
    const key = id.toUpperCase();
    if (!out.has(key)) out.set(key, deviceColorAt(i));
  });
  return out;
}

/** One device's color var, or undefined for the Library, a device the home
 * does not have, or no device. */
export function deviceColor(colors: DeviceColors, ownerId: string | undefined): string | undefined {
  return ownerId === undefined ? undefined : colors.get(ownerId.toUpperCase());
}

/** `deviceColors` kept for one owners list: the panel and the editors draw
 * often and the list changes rarely, so the map is made once per list. */
export function deviceColorsCache(): (owners: readonly DeviceColorOwner[]) => DeviceColors {
  let last: readonly DeviceColorOwner[] | undefined;
  let colors: DeviceColors = new Map();
  return (owners) => {
    if (owners !== last) {
      last = owners;
      colors = deviceColors(owners);
    }
    return colors;
  };
}
