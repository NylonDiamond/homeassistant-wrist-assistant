// Which watch app the panel will work with, by the version it reports.
//
// The owners reply carries the watch's `app_version` (CFBundleShortVersionString,
// "2.8.0" style). The panel authors documents only the per-shape watch app can
// draw (one shape is enough, Inline is real), and nothing older has ever been
// released with the HA editor, so a watch below the minimum gets no editor at
// all: a message to update, and the watch picker. Rule 8 of app repo
// docs/custom_complication_family_kinds.md, tightened 2026-09-02.

/** First watch app version the panel works with: the per-shape release.
 * Bump only when the app's marketing version for that release is known.
 *
 * This is the only version gate. A watch decodes a document whole or not at
 * all, so a layer kind it predates blanks the complication rather than
 * dropping one layer; the answer is to keep the whole editor away from a watch
 * that is too old, not to hide individual controls. So when a release adds a
 * layer kind, bump this to that release. */
export const MIN_WATCH_VERSION_FOR_SHAPES = "2.8.0";

/** First iPhone app version that draws custom complications on the lock
 * screen. The phone is an owner in its own right from that release: it signs
 * with its own identity, pulls its own records and renders them in the iOS
 * widget extension. An older phone has no widget to draw them, so the editor
 * is held back the same way it is for an old watch. */
export const MIN_IPHONE_VERSION_FOR_LOCK_SCREEN = "2.8.0";

/** Which device owns a set of records. Absent on the wire means a watch:
 * every owner was one before phones could own records. Null on an orphan,
 * which has no registered device left to ask. */
export type DeviceKind = "watch" | "iphone";

/** The part of an owner row these helpers read. Structural on purpose, so
 * the pure modules never have to import the websocket types. */
export interface DeviceOwnerLike {
  app_version?: string | null;
  device_kind?: DeviceKind | null;
}

/** A device kind with the wire's two absences resolved: no field and null
 * both read as a watch, because that is what every owner used to be. */
export function deviceKindOf(owner: DeviceOwnerLike | null | undefined): DeviceKind {
  return owner?.device_kind === "iphone" ? "iphone" : "watch";
}

/** The word for the device in copy the owner reads. */
export function deviceNoun(owner: DeviceOwnerLike | null | undefined): string {
  return deviceKindOf(owner) === "iphone" ? "iPhone" : "watch";
}

export type Version = [number, number, number];

/** The first three integers of a version string. "2.8" reads as 2.8.0, a
 * beta or build suffix ("2.8.0b3", "2.8.0 (12)", "2.8.0-beta.1") counts as its
 * version. Anything with no leading `major.minor` is undefined, which callers
 * treat as old. */
export function parseVersion(s: string | null | undefined): Version | undefined {
  if (typeof s !== "string") return undefined;
  const m = /^\s*v?(\d+)\.(\d+)(?:\.(\d+))?/.exec(s);
  if (!m) return undefined;
  return [Number(m[1]), Number(m[2]), Number(m[3] ?? 0)];
}

export function compareVersions(a: Version, b: Version): number {
  for (let i = 0; i < 3; i++) {
    if (a[i]! !== b[i]!) return a[i]! < b[i]! ? -1 : 1;
  }
  return 0;
}

/** Whether a watch reporting `appVersion` can use the panel. Unknown or
 * unparseable reads as no. */
export function watchSupportsShapes(appVersion: string | null | undefined, minimum = MIN_WATCH_VERSION_FOR_SHAPES): boolean {
  const have = parseVersion(appVersion);
  const need = parseVersion(minimum);
  if (!have || !need) return false;
  return compareVersions(have, need) >= 0;
}

/** The lead line of the whole-panel gate, worded for what the watch reported.
 * The steps that follow it live in the panel's gate screen. */
export function updateWatchMessage(appVersion: string | null | undefined, minimum = MIN_WATCH_VERSION_FOR_SHAPES): string {
  const have = parseVersion(appVersion);
  const reported = have
    ? `This watch runs Wrist Assistant ${appVersion}.`
    : "This watch has not reported its Wrist Assistant version yet.";
  return `${reported} The editor needs ${minimum}, coming soon to the App Store.`;
}

/** The same lead line for a phone owner. Its own sentence rather than a
 * substitution, because what the phone is missing is the lock screen widget,
 * not a watch app. */
export function updateIPhoneMessage(appVersion: string | null | undefined, minimum = MIN_IPHONE_VERSION_FOR_LOCK_SCREEN): string {
  const have = parseVersion(appVersion);
  const reported = have
    ? `This iPhone runs Wrist Assistant ${appVersion}.`
    : "This iPhone has not reported its Wrist Assistant version yet.";
  return `${reported} Lock screen complications need ${minimum}, coming soon to the App Store.`;
}

/** Whether the panel opens for this owner, whichever device it is. A watch
 * needs the per-shape release, a phone needs the lock screen release. */
export function deviceSupportsShapes(owner: DeviceOwnerLike | null | undefined): boolean {
  return deviceKindOf(owner) === "iphone"
    ? watchSupportsShapes(owner?.app_version, MIN_IPHONE_VERSION_FOR_LOCK_SCREEN)
    : watchSupportsShapes(owner?.app_version);
}

/** The gate's lead line for whichever device the owner is. */
export function updateDeviceMessage(owner: DeviceOwnerLike | null | undefined): string {
  return deviceKindOf(owner) === "iphone"
    ? updateIPhoneMessage(owner?.app_version)
    : updateWatchMessage(owner?.app_version);
}
