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

/** First watch app version that draws the chart looks keys (curve, smoothing,
 * and the fill, bar corner, dot, grid and gap keys after them). Not a gate: an
 * older watch ignores those keys and draws the plain chart, so the controls
 * stay usable and only carry a note (`watchVersionNote`). null until the app
 * release that draws them is cut; set it then, not before. */
export const MIN_WATCH_VERSION_FOR_CHART_LOOKS: string | null = null;

/** First watch app version that knows the `chartTimes` layer kind, and with it
 * the `chartDots`, `chartGrid` and `imageTime` kinds, the `zero` chart anchor,
 * and a `chartTimes` layer linked to a timeline. A watch that meets a kind it
 * does not know drops the whole document, and since 2026-09-12 the clock times
 * of a chart or timeline and a picture's timestamp are always layers (a
 * document drawing its own is converted when opened). So this must not be newer than
 * `MIN_WATCH_VERSION_FOR_SHAPES`, the editor's own gate. null until the app
 * release that draws the layer is cut. */
export const MIN_WATCH_VERSION_FOR_CHART_TIMES_LAYER: string | null = null;

/** First watch app version that skips the iPhone only tile kinds (map,
 * chart, text_field, web) instead of drawing them as grey placeholders.
 * Confirmed at release time: bump it if the release that ships the skip is
 * not 3.2.0. */
export const MIN_WATCH_VERSION_FOR_PHONE_TILES = "3.2.0";

/** Whether a watch app at this version skips the iPhone only kinds. A
 * version not yet reported reads as new enough, as `deviceSupportsControls`
 * does. */
export function watchSupportsPhoneTiles(appVersion: string | null | undefined): boolean {
  const have = parseVersion(appVersion);
  if (!have) return true;
  return compareVersions(have, parseVersion(MIN_WATCH_VERSION_FOR_PHONE_TILES)!) >= 0;
}

/** First app version, on either device, that draws every tile in One Look,
 * the shared tile look of the iPhone and the watch. null until the app
 * release that draws One Look is cut; until then every device previews One
 * Look. Set it at release so an older app keeps the old look in the preview
 * and the old settings. Not a gate on what is stored: a tile keeps every key
 * whichever look draws it. */
export const MIN_VERSION_FOR_ONE_LOOK: string | null = null;

/** Whether an app at this version draws One Look, by `MIN_VERSION_FOR_ONE_LOOK`.
 * A version not yet reported reads as new enough, as `deviceSupportsControls`
 * does: guessing "too old" would show the old look to a device that is not. */
export function oneLookFor(appVersion: string | null | undefined): boolean {
  return oneLookAtVersion(appVersion, MIN_VERSION_FOR_ONE_LOOK);
}

/** `oneLookFor` against a given minimum, so the rule can be checked with a
 * version set before the release sets one. A minimum that does not parse
 * reads as none. */
export function oneLookAtVersion(appVersion: string | null | undefined, minimum: string | null): boolean {
  if (minimum === null) return true;
  const need = parseVersion(minimum);
  const have = parseVersion(appVersion);
  if (!need || !have) return true;
  return compareVersions(have, need) >= 0;
}

/** First app version, on either device, that draws a tile's Arrangement
 * (`arrange`). Not a gate: an older app ignores the key and draws the tile's
 * Default arrangement, so the card stays usable and only carries a note.
 * null until the app release that draws it is cut, as `MIN_VERSION_FOR_ONE_LOOK`
 * is: until then no device carries the note, so a development build of the
 * app (still reporting the last release's version) is not told to update.
 * Set it at release. */
export const MIN_VERSION_FOR_ARRANGEMENT: string | null = null;

/** Whether an app at this version draws a tile's Arrangement. Not yet
 * reported reads as new enough, as `deviceSupportsControls` does, and so does
 * every version while no minimum is set. */
export function arrangementFor(
  appVersion: string | null | undefined,
  minimum: string | null = MIN_VERSION_FOR_ARRANGEMENT,
): boolean {
  return oneLookAtVersion(appVersion, minimum);
}

/** The note the Arrangement card shows when devices on the page are too
 * old to draw it, naming them: "Needs Wrist Assistant 3.2 on Chen Watch.
 * Until then it draws the Default arrangement." (two: "on A and B ... they
 * draw"; more: "on A, B and C"). Undefined for an empty list. */
export function arrangementUpdateNote(
  deviceNames: readonly string[],
  minimum: string | null = MIN_VERSION_FOR_ARRANGEMENT,
): string | undefined {
  const names = deviceNames.filter((n) => n.trim() !== "");
  if (names.length === 0 || minimum === null) return undefined;
  const version = versionForCopy(minimum);
  const list = names.length === 1 ? names[0]! : `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
  return `Needs Wrist Assistant ${version} on ${list}. Until then ${names.length === 1 ? "it draws" : "they draw"} the Default arrangement.`;
}

/** Whether every one of these devices draws One Look, from the versions they
 * reported: what a setting shared by all of them can be written for. No
 * device at all (a page on none yet) reads as an unreported one. */
export function oneLookForEvery(
  appVersions: readonly (string | null | undefined)[],
  minimum: string | null = MIN_VERSION_FOR_ONE_LOOK,
): boolean {
  return appVersions.length === 0 ? oneLookAtVersion(undefined, minimum) : appVersions.every((v) => oneLookAtVersion(v, minimum));
}

/** First iPhone app version that draws custom complications on the lock
 * screen. The phone is an owner in its own right from that release: it signs
 * with its own identity, pulls its own records and renders them in the iOS
 * widget extension. An older phone has no widget to draw them, so the editor
 * is held back the same way it is for an old watch. */
export const MIN_IPHONE_VERSION_FOR_LOCK_SCREEN = "2.8.0";

/** First iPhone app version that draws custom complications on the Home
 * Screen: the four tile sizes (small, medium, large, extra large). Unlike the
 * lock screen gate this never closes the editor. A phone below it simply is
 * not offered the four shapes, so its lock screen shapes keep working. Same
 * release as the lock screen, so the two gates are the same version today. */
export const MIN_IPHONE_VERSION_FOR_HOME_SCREEN = "2.8.0";

/** First app version, on either device, that draws a document's Control
 * Center control. The panel hides the Control Center card below it, since a
 * control saved against an app with no control widget would simply never
 * appear. Same release as the editor's own gate today, so the card is shown to
 * everyone the panel already opens for; bump it when the control ships in a
 * later release, or set it to null to hide the card everywhere while the app
 * half is unbuilt. */
export const MIN_VERSION_FOR_CONTROL_CENTER: string | null = "2.8.0";

/** Whether this device's app draws a Control Center control. A version that
 * has not been reported reads as new enough: the panel only opens for a device
 * at or above its own gate, so guessing "too old" there would hide the card
 * from an orphan that is really fine.
 *
 * This one takes a version string rather than an owner, because most of its
 * callers have only a version to hand. The Library has no version and no app,
 * so it cannot be recognised here: `ownerSupportsControls` below is the
 * overload that takes the owner, and it is what the panel should call
 * wherever an owner is in scope. */
export function deviceSupportsControls(
  appVersion: string | null | undefined,
  minimum: string | null = MIN_VERSION_FOR_CONTROL_CENTER,
): boolean {
  if (minimum === null) return false;
  const need = parseVersion(minimum);
  if (!need) return false;
  const have = parseVersion(appVersion);
  if (!have) return true;
  return compareVersions(have, need) >= 0;
}

/** The same question asked about an owner rather than a version string.
 *
 * The Library always answers yes: a design kept there is not being drawn by
 * anything, so there is nothing to hold back. Holding the control card away
 * from it would mean a design built on the shelf loses its control the moment
 * it is put on a device that draws one, which is the opposite of what a shelf
 * is for. A real device falls through to the version check. */
export function ownerSupportsControls(
  owner: DeviceOwnerLike | null | undefined,
  minimum: string | null = MIN_VERSION_FOR_CONTROL_CENTER,
): boolean {
  if (isLibraryOwner(owner)) return true;
  return deviceSupportsControls(owner?.app_version, minimum);
}

/** Which device owns a set of records. Absent on the wire means a watch:
 * every owner was one before phones could own records. Null on an orphan,
 * which has no registered device left to ask. `library` is the odd one: it is
 * not a device at all, it is the home's shelf for designs that are on no
 * device yet (see `LIBRARY_OWNER_ID`). */
export type DeviceKind = "watch" | "iphone" | "library";

/** The one owner id that is not a device. Matches `LIBRARY_OWNER_ID` in the
 * integration's const.py, which is where the reserved word is decided. */
export const LIBRARY_OWNER_ID = "library";

/** The part of an owner row these helpers read. Structural on purpose, so
 * the pure modules never have to import the websocket types. */
export interface DeviceOwnerLike {
  app_version?: string | null;
  device_kind?: DeviceKind | null;
  phone_pages?: boolean | null;
  /** The owner's id. Read only to recognise the Library, which an older
   * integration's reply would name without knowing the kind. */
  owner_watch_id?: string;
}

/** Whether this owner is the home's Library rather than a device.
 *
 * Either half proves it. The kind is what a current integration sends, and
 * the id is the reserved word itself, which is true whatever the reply says
 * about the kind. */
export function isLibraryOwner(owner: DeviceOwnerLike | null | undefined): boolean {
  return owner?.device_kind === "library" || owner?.owner_watch_id === LIBRARY_OWNER_ID;
}

/** A device kind with the wire's two absences resolved: no field and null
 * both read as a watch, because that is what every owner used to be. The
 * Library is recognised by either half of `isLibraryOwner`, so a reply that
 * names the id without the kind still reads as the shelf. */
export function deviceKindOf(owner: DeviceOwnerLike | null | undefined): DeviceKind {
  if (isLibraryOwner(owner)) return "library";
  return owner?.device_kind === "iphone" ? "iphone" : "watch";
}

/** Whether the panel offers this owner for pages as an iPhone: an iPhone
 * whose app has polled Home Assistant as itself, which only an app with phone
 * pages does. An iPhone on an older app has no Pages tab to show them on, so
 * it is left out until it updates. */
export function phoneShowsPages(owner: DeviceOwnerLike | null | undefined): boolean {
  return deviceKindOf(owner) === "iphone" && owner?.phone_pages === true;
}

/** The word for the device in copy the owner reads. The Library is a place
 * rather than a device, so it is named as one, the way the picker names it
 * (`UNASSIGNED_LIST` in pickerRows.ts, which this file cannot import).
 * "Library" is the store's word and appears nowhere on screen, so a sentence
 * built on it ("Save. The library picks it up.") named a place nobody could
 * find. */
export function deviceNoun(owner: DeviceOwnerLike | null | undefined): string {
  const kind = deviceKindOf(owner);
  if (kind === "library") return "Not on a device list";
  return kind === "iphone" ? "iPhone" : "watch";
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

/** The one line under a control whose setting this watch is too old to draw,
 * or undefined for no line: when there is no minimum yet, when the watch is
 * new enough, and when its version is unknown (a guess would nag every watch
 * that has not reported). The setting still saves either way. */
export function watchVersionNote(
  appVersion: string | null | undefined,
  minimum: string | null = MIN_WATCH_VERSION_FOR_CHART_LOOKS,
): string | undefined {
  if (minimum === null) return undefined;
  const have = parseVersion(appVersion);
  const need = parseVersion(minimum);
  if (!have || !need || compareVersions(have, need) >= 0) return undefined;
  const named = need[2] === 0 ? `${need[0]}.${need[1]}` : need.join(".");
  return `Needs Wrist Assistant ${named} or later on your watch.`;
}

/** The first version anyone outside TestFlight can install. The per-shape
 * release was 2.8.0 during the beta and was renamed 3.0 before it shipped, so
 * the gates above stay at 2.8.0 (testers on a 2.8.0 build keep working) while
 * the words people read name 3.0. */
export const FIRST_PUBLIC_VERSION = "3.0.0";

/** A minimum as the update messages name it: never below the first public
 * version, since nobody can install a version that only testers had, and
 * without a trailing ".0" patch. */
export function versionForCopy(minimum: string): string {
  const need = parseVersion(minimum);
  if (!need) return minimum;
  const first = parseVersion(FIRST_PUBLIC_VERSION)!;
  const shown = compareVersions(need, first) < 0 ? first : need;
  return shown[2] === 0 ? `${shown[0]}.${shown[1]}` : shown.join(".");
}

/** The lead line of the whole-panel gate, worded for what the watch reported.
 * The steps that follow it live in the panel's gate screen. */
export function updateWatchMessage(appVersion: string | null | undefined, minimum = MIN_WATCH_VERSION_FOR_SHAPES): string {
  const have = parseVersion(appVersion);
  const reported = have
    ? `This watch runs Wrist Assistant ${appVersion}.`
    : "This watch has not reported its Wrist Assistant version yet.";
  return `${reported} The editor needs ${versionForCopy(minimum)} or later. Update Wrist Assistant on your iPhone; the watch app updates with it.`;
}

/** The same lead line for a phone owner. Its own sentence rather than a
 * substitution, because what the phone is missing is the widget extension,
 * not a watch app. Both places that extension draws are named, since the gate
 * release brings the Lock Screen and the Home Screen at once. */
export function updateIPhoneMessage(appVersion: string | null | undefined, minimum = MIN_IPHONE_VERSION_FOR_LOCK_SCREEN): string {
  const have = parseVersion(appVersion);
  const reported = have
    ? `This iPhone runs Wrist Assistant ${appVersion}.`
    : "This iPhone has not reported its Wrist Assistant version yet.";
  return `${reported} Lock Screen and Home Screen complications need ${versionForCopy(minimum)} or later. Update Wrist Assistant on your iPhone.`;
}

/** Whether the panel opens for this owner, whichever device it is. A watch
 * needs the per-shape release, a phone needs the lock screen release.
 *
 * The Library opens for everyone. The gate is about what a device can draw,
 * and the Library draws nothing: it is a place to keep a design, so it holds
 * every shape and nothing on it is waiting on an App Store release. A home
 * whose only watch is too old can still build there and place it later. */
export function deviceSupportsShapes(owner: DeviceOwnerLike | null | undefined): boolean {
  const kind = deviceKindOf(owner);
  if (kind === "library") return true;
  return kind === "iphone"
    ? watchSupportsShapes(owner?.app_version, MIN_IPHONE_VERSION_FOR_LOCK_SCREEN)
    : watchSupportsShapes(owner?.app_version);
}

/** The gate's lead line for whichever device the owner is, and nothing at all
 * for the Library: there is no app behind it to update. */
export function updateDeviceMessage(owner: DeviceOwnerLike | null | undefined): string {
  const kind = deviceKindOf(owner);
  if (kind === "library") return "";
  return kind === "iphone"
    ? updateIPhoneMessage(owner?.app_version)
    : updateWatchMessage(owner?.app_version);
}
