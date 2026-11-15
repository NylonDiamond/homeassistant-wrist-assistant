// What a paired device runs: iOS, watchOS, Android or Wear OS.
//
// The owners reply carries `platform` beside `device_kind`
// (`device_platform.py` in the integration). An Android phone pairs as the
// `iphone` kind and a Wear OS watch as the `watch` kind, so every rule keyed
// on the kind keeps working; the platform only changes what a person reads
// (the device's noun, its model, the store to get the app from), which
// version gates apply, and how its preview is drawn. An Apple app never sends
// a platform, so a row without one is an Apple device of its kind, and an
// older integration's reply reads the same way.

/** The four platforms, as the integration names them. */
export type DevicePlatform = "ios" | "watchos" | "android" | "wearos";

/** The part of an owner row this file reads. Structural, so the pure modules
 * that use it never import the websocket types. */
export interface PlatformOwnerLike {
  device_kind?: string | null;
  platform?: string | null;
}

/** The Play Store listing of the Android app (phone and Wear OS). */
export const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.wristassistant.android";

/** The Apple version whose features the Android apps draw. The panel's
 * version gates are Apple release numbers, which an Android app's own version
 * says nothing about, so an Android or Wear OS device is gated as if it ran
 * this release: the current feature set. Raise it with the release whose
 * features the Android apps catch up with. */
export const ANDROID_FEATURE_VERSION = "3.2.0";

const PLATFORMS: readonly DevicePlatform[] = ["ios", "watchos", "android", "wearos"];

/** A device's platform: the one its row names when that fits its kind, else
 * its kind's Apple one. The Library and an orphan (no kind) read as a watch,
 * as `deviceKindOf` reads them. */
export function platformOf(owner: PlatformOwnerLike | null | undefined): DevicePlatform {
  const phone = owner?.device_kind === "iphone";
  const said = owner?.platform;
  if (said !== null && said !== undefined && (PLATFORMS as readonly string[]).includes(said)) {
    const p = said as DevicePlatform;
    if (phone ? p === "ios" || p === "android" : p === "watchos" || p === "wearos") return p;
  }
  return phone ? "ios" : "watchos";
}

/** Whether a device runs one of the Android apps. */
export function isAndroidPlatform(platform: DevicePlatform | null | undefined): boolean {
  return platform === "android" || platform === "wearos";
}

/** Whether this owner is a device running one of the Android apps. */
export function ownerIsAndroid(owner: PlatformOwnerLike | null | undefined): boolean {
  return isAndroidPlatform(platformOf(owner));
}

/** The version the panel's gates read for this owner: its own `app_version`
 * on an Apple device, `ANDROID_FEATURE_VERSION` on an Android one. Only for
 * gates; the version a person reads is always the device's own. */
export function gateVersion(owner: (PlatformOwnerLike & { app_version?: string | null }) | null | undefined): string | null | undefined {
  return ownerIsAndroid(owner) ? ANDROID_FEATURE_VERSION : owner?.app_version;
}

/** The device in a sentence: "iPhone" for an iPhone, "phone" for an Android
 * phone, and "watch" for either watch. */
export function platformNoun(platform: DevicePlatform): string {
  if (platform === "ios") return "iPhone";
  if (platform === "android") return "phone";
  return "watch";
}

/** The device at the start of a sentence: "iPhone", "Phone" or "Watch". */
export function platformNounTitle(platform: DevicePlatform): string {
  const noun = platformNoun(platform);
  return noun === "iPhone" ? noun : noun[0]!.toUpperCase() + noun.slice(1);
}

/** What Home Assistant's device registry calls the device (its model):
 * "iPhone", "Apple Watch", "Android phone" or "Wear OS watch". */
export function platformModel(platform: DevicePlatform): string {
  switch (platform) {
    case "ios": return "iPhone";
    case "android": return "Android phone";
    case "wearos": return "Wear OS watch";
    default: return "Apple Watch";
  }
}

/** The noun for a device of a kind with a platform, for the helpers that
 * hold a kind and maybe a platform rather than an owner. */
export function nounFor(kind: "watch" | "iphone", platform?: DevicePlatform | null): string {
  return platformNoun(platformOf({ device_kind: kind, platform: platform ?? null }));
}

/** The store the device's app comes from, as a sentence names it. */
export function storeName(platform: DevicePlatform): string {
  return isAndroidPlatform(platform) ? "Google Play" : "the App Store";
}

// ── General copy ────────────────────────────────────────────────────────
//
// Copy about no device in particular ("Pair a phone", "Scan with the phone",
// the help sheet) says phone and watch in every home. A line about one
// device names that device by its platform (`platformNoun`). Whether an
// Android device is paired here (`androidHereNow`) still decides the
// Android only extras, such as the Google Play links.
//
// The panel learns it from the owners reply (`fetchOwners` notes it on
// every read): `paired_platforms` lists the platforms of every paired
// device, whoever asks, since a person who is not an administrator gets only
// their own rows; from an integration without that field, the rows say.

/** The part of the owners reply `homeHasAndroid` reads. */
export interface PairedPlatformsLike {
  paired_platforms?: readonly string[] | null;
  owners?: readonly (PlatformOwnerLike & { is_orphan?: boolean | null })[] | null;
}

/** Whether an Android phone or a Wear OS watch is paired to this home. */
export function homeHasAndroid(reply: PairedPlatformsLike | null | undefined): boolean {
  const listed = reply?.paired_platforms;
  if (Array.isArray(listed)) return listed.some((p) => p === "android" || p === "wearos");
  return (reply?.owners ?? []).some((o) => o.is_orphan !== true && ownerIsAndroid(o));
}

let androidHere = false;

/** Note what the panel last heard of this home's devices. Called with every
 * owners reply; the panel redraws with the rows it sets beside it. */
export function noteHomeDevices(reply: PairedPlatformsLike | null | undefined): void {
  androidHere = homeHasAndroid(reply);
}

/** Set directly, for tests and for a reply already read. */
export function setAndroidHere(on: boolean): void {
  androidHere = on;
}

/** Whether the panel last heard of an Android device paired here. */
export function androidHereNow(): boolean {
  return androidHere;
}

/** General copy: the phone and watch words, for every home. Until
 * 2026-11-14 a home with only Apple devices kept the Apple words here; now
 * every home reads phone and watch, so an Android user sees the right words
 * before the first Android device is paired. The Apple words stay as the
 * first argument, as a record of what each line said before. */
export function generalCopy<A, B>(_apple: A, phoneAndWatch: B): A | B {
  return phoneAndWatch;
}
