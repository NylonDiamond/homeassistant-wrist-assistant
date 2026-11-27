// Getting started: the three steps a new home walks through, as the Help
// sheet shows them. Get the app, pair a device, make a first page. HouseLit
// is for the whole home, so an iPhone alone is a full setup, as is a watch
// alone. Each step is done or not from what Home Assistant already knows
// (the devices, and which of them hold a page), never from a tick the person
// sets, so the sheet can never disagree with the devices themselves. Home's
// welcome, in a home with no devices, has its own three steps (install,
// pick, pair).
//
// The words live here too, beside the rule, so a test can read them without
// drawing the sheet.

import { androidHereNow, gateVersion, generalCopy, platformModel, platformOf } from "./device-platform.js";
import type { OwnerSummary, WatchConfigSummary } from "./ha-api.js";
import { deviceKindOf, setupMoveNeedsUpdate } from "./version.js";
import { noRecordStart, settingsWatches, waitsForWatchSeed, watchAppDevices, watchName } from "./watch-settings.js";

/** Wrist Assistant's App Store page, the one the README and the website link. */
export const APP_STORE_URL = "https://apps.apple.com/us/app/wrist-assistant/id6759152098";
/** Its Google Play page, for an Android phone and a Wear OS watch. Linked
 * beside the App Store everywhere the panel offers the app. */
export { PLAY_STORE_URL } from "./device-platform.js";
export const SETUP_GUIDE_URL = "https://docs.houselit.app/getting-started/setup/";
export const TROUBLESHOOTING_URL = "https://docs.houselit.app/getting-started/troubleshooting/";
export const REPORT_PROBLEM_URL = "https://github.com/NylonDiamond/homeassistant-wrist-assistant/issues";
export const DOCS_URL = "https://docs.houselit.app/";

export type StepId = "app" | "pair" | "page";

export interface GettingStartedStep {
  id: StepId;
  done: boolean;
}

export interface GettingStarted {
  /** Always the three, in order. */
  steps: GettingStartedStep[];
  /** How many are done, for "N of 3 done". */
  done: number;
  /** The first step not done, marked Next. Undefined once all three are. */
  next?: StepId;
  /** The device a New page opens Pages on: the shared watch when it is one
   * of the home's watches, else the first watch, else the first iPhone that
   * keeps pages of its own. Undefined with no such device. */
  device?: string;
  /** The paired devices' names, watches first, for the Help sheet's "is
   * paired" line. */
  deviceNames: string[];
  /** Whether the page step is known: the panel has read which devices hold
   * a page, or there is no device to ask about. Until then a home with a
   * device cannot say whether the card should still show. */
  known: boolean;
}

/** A paired device's name in the Help sheet: a watch as the watch picker
 * names it, a phone by its own name, else by its kind. */
function deviceNameOf(owner: OwnerSummary, watches: readonly OwnerSummary[]): string {
  if (deviceKindOf(owner) === "watch") return watchName(owner, watches);
  return owner.device_name?.trim() || platformModel(platformOf(owner));
}

/**
 * The three steps from the home's devices.
 *
 * - Get the app: done once any device (a watch or an iPhone) is paired, since
 *   pairing needs the app.
 * - Pair a device: done once a watch or an iPhone is paired. Either one
 *   alone is a full setup.
 * - Make your first page: done once any device has a page stored in Home
 *   Assistant (`devicesWithPages`): a watch's pages record, or an iPhone's
 *   own on a home that keeps phone pages (`phones`).
 *
 * The Library row and orphans are not devices and count for nothing.
 * `pages` is undefined until the panel has read it.
 *
 * The page step is never marked Next while every watch without pages here
 * already has some on the way: its app is older than the setup move
 * (`setupMoveNeedsUpdate`), so its pages still live on the iPhone, or its
 * iPhone may still move them here (`noRecordStart` is `wait`), or the watch
 * itself may still send them (`waitsForWatchSeed`). A long time
 * user is not new, and a first page made now would make the move skip
 * theirs. The step itself stays not done.
 */
export function gettingStarted(
  owners: readonly OwnerSummary[],
  pages: ReadonlySet<string> | undefined,
  shared?: string,
  phones = false,
): GettingStarted {
  const devices = owners.filter((o) => deviceKindOf(o) !== "library" && !o.is_orphan);
  const watches = settingsWatches(owners);
  const holders = watchAppDevices(owners, phones);
  const page = pages !== undefined && holders.some((d) => pages.has(d.owner_watch_id));
  const pagesComing = watches.length > 0
    && watches.every((w) => setupMoveNeedsUpdate(gateVersion(w)) || noRecordStart(w) === "wait" || waitsForWatchSeed(w));
  const steps: GettingStartedStep[] = [
    { id: "app", done: devices.length > 0 },
    { id: "pair", done: devices.length > 0 },
    { id: "page", done: page },
  ];
  const device = watches.some((w) => w.owner_watch_id === shared) ? shared : holders[0]?.owner_watch_id;
  const named = [...watches, ...devices.filter((d) => deviceKindOf(d) !== "watch")];
  const out: GettingStarted = {
    steps,
    done: steps.filter((s) => s.done).length,
    deviceNames: named.map((d) => deviceNameOf(d, watches)),
    known: pages !== undefined || holders.length === 0,
  };
  const next = steps.find((s) => !s.done && !(s.id === "page" && pagesComing))?.id;
  if (next !== undefined) out.next = next;
  if (device !== undefined) out.device = device;
  return out;
}

/**
 * The devices with at least one page of their own stored in Home Assistant,
 * from the watch config summary Home reads: watches, and iPhones on a home
 * that keeps phone pages. A pages record that lists no page (only the
 * device's own system pages, which are never counted) is not a first page.
 * An integration older than the summary's item counts sends no `items`, and
 * there the record itself is taken as the page.
 */
export function devicesWithPages(summary: WatchConfigSummary, deviceIds: readonly string[]): Set<string> {
  const out = new Set<string>();
  for (const id of deviceIds) {
    const record = summary.owners[id]?.pages;
    if (record === undefined) continue;
    if (typeof record.items !== "number" || record.items > 0) out.add(id);
  }
  return out;
}

// ── the words ───────────────────────────────────────────────────────────

/** "2 of 3 done". */
export function doneWords(done: number): string {
  return `${done} of 3 done`;
}

export const OPEN_APP_STORE_LABEL = "Open the App Store";
export const OPEN_PLAY_STORE_LABEL = "Open Google Play";
export const PAIR_DEVICE_LABEL = "Pair a device";
export const NEW_PAGE_LABEL = "New page";
/** In place of New page when the only paired device is an iPhone whose app
 * is too old to keep pages of its own. */
export function updateFirstText(): string {
  return generalCopy("Update HouseLit on the iPhone first.", "Update HouseLit on the phone first.");
}

/** Each step in the Help sheet: shorter, and saying what is true now. */
export function helpStepWords(id: StepId, gs: Pick<GettingStarted, "steps" | "deviceNames">): { title: string; text: string } {
  const done = gs.steps.find((s) => s.id === id)?.done === true;
  if (id === "app") {
    return {
      title: "Get the app",
      text: done
        // Google Play is named only once an Android device is paired here: the
        // Android app is on Play's testing tracks, not in the store, until then.
        ? (androidHereNow() ? "HouseLit is on the App Store and Google Play." : "HouseLit is on the App Store.")
        : generalCopy("Install it on the watch, the iPhone or both.", "Install it on the watch, the phone or both."),
    };
  }
  if (id === "pair") {
    const names = gs.deviceNames;
    const text = !done ? pairStepTodoText()
      : names.length === 1 ? `${names[0]} is paired.` : `${names.length} devices are paired.`;
    return { title: "Pair a device", text };
  }
  return { title: "Make your first page", text: "Tiles for lights, scenes and cameras." };
}

/** The pair step's line before anything is paired: the one sign in on the
 * phone first, which pairs the watch too, then the watch's own code. */
export function pairStepTodoText(): string {
  return generalCopy(
    "Sign in on the iPhone app, or type the code the watch shows.",
    "Sign in on the phone app, or type the code the watch shows.",
  );
}
