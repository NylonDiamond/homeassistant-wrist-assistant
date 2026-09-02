// Which watch app the panel will work with, by the version it reports.
//
// The owners reply carries the watch's `app_version` (CFBundleShortVersionString,
// "2.8.0" style). The panel authors documents only the per-shape watch app can
// draw (one shape is enough, Inline is real), and nothing older has ever been
// released with the HA editor, so a watch below the minimum gets no editor at
// all: a message to update, and the watch picker. Rule 8 of app repo
// docs/custom_complication_family_kinds.md, tightened 2026-09-02.

/** First watch app version the panel works with: the per-shape release.
 * Bump only when the app's marketing version for that release is known. */
export const MIN_WATCH_VERSION_FOR_SHAPES = "2.8.0";

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

/** The whole-panel block, worded for what the watch reported. */
export function updateWatchMessage(appVersion: string | null | undefined, minimum = MIN_WATCH_VERSION_FOR_SHAPES): string {
  const have = parseVersion(appVersion);
  const reported = have
    ? `This watch runs Wrist Assistant ${appVersion}.`
    : "This watch has not reported its Wrist Assistant version yet.";
  return `${reported} The complication editor needs ${minimum} or newer. Update Wrist Assistant on the watch, open it once so it reports its version, then reload this page.`;
}
