// Which watch app can draw what, by the version it reports.
//
// The owners reply carries the watch's `app_version` (CFBundleShortVersionString,
// "2.8.0" style). A watch older than the per-shape release draws every canvas
// shape from the shared layers and "Custom" for Inline, so the panel must not
// author a document with fewer than three canvas shapes, or with Inline, for
// it. It would be skipped on the wrist with "needs app update" and the user
// would see nothing. Rule 8 of app repo docs/custom_complication_family_kinds.md.

/** First watch app version that lists complications per shape and draws
 * Inline. Bump only when the app's marketing version for that release is
 * known. */
export const MIN_WATCH_VERSION_FOR_SHAPES = "2.8.0";

export const SHAPES_NEED_UPDATE_MESSAGE = "Update Wrist Assistant on the watch to use one shape or Inline.";

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

/** Whether a watch reporting `appVersion` can take a one-shape or Inline
 * document. Unknown or unparseable reads as no. */
export function watchSupportsShapes(appVersion: string | null | undefined, minimum = MIN_WATCH_VERSION_FOR_SHAPES): boolean {
  const have = parseVersion(appVersion);
  const need = parseVersion(minimum);
  if (!have || !need) return false;
  return compareVersions(have, need) >= 0;
}
