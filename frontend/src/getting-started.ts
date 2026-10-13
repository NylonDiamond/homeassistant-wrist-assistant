// Getting started: the three steps a new home walks through, as the Help
// sheet shows them. Get the app, pair a watch, make a first page. Each step
// is done or not from what Home Assistant already knows (the devices, and
// which watches hold a page), never from a tick the person sets, so the sheet
// can never disagree with the devices themselves. Home's welcome, in a home
// with no devices, has its own three steps (install, pick, pair).
//
// The words live here too, beside the rule, so a test can read them without
// drawing the sheet.

import type { OwnerSummary, WatchConfigSummary } from "./ha-api.js";
import { deviceKindOf } from "./version.js";
import { PAIR_CODE_LENGTH, settingsWatches, watchName } from "./watch-settings.js";

/** Wrist Assistant's App Store page, the one the README and the website link. */
export const APP_STORE_URL = "https://apps.apple.com/us/app/wrist-assistant/id6759152098";
export const SETUP_GUIDE_URL = "https://docs.wrist-assistant.com/getting-started/setup/";
export const TROUBLESHOOTING_URL = "https://docs.wrist-assistant.com/getting-started/troubleshooting/";
export const REPORT_PROBLEM_URL = "https://github.com/NylonDiamond/homeassistant-wrist-assistant/issues";
export const DOCS_URL = "https://docs.wrist-assistant.com/";

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
  /** The watch a New page opens Pages on: the shared watch when it is one of
   * the home's watches, else the first. Undefined with no watch paired. */
  watch?: string;
  /** The paired watches' names, for the Help sheet's "is paired" line. */
  watchNames: string[];
  /** Whether the page step is known: the panel has read which watches hold
   * a page, or there is no watch to ask about. Until then a home with a
   * watch cannot say whether the card should still show. */
  known: boolean;
}

/**
 * The three steps from the home's devices.
 *
 * - Get the app: done once any device (a watch or an iPhone) is paired, since
 *   pairing needs the app.
 * - Pair your watch: done once a watch is paired. An iPhone alone is not
 *   enough: everything this panel makes is for the watch.
 * - Make your first page: done once any watch has a page stored in Home
 *   Assistant (`watchesWithPages`).
 *
 * The Library row and orphans are not devices and count for nothing.
 * `pages` is undefined until the panel has read it.
 */
export function gettingStarted(
  owners: readonly OwnerSummary[],
  pages: ReadonlySet<string> | undefined,
  shared?: string,
): GettingStarted {
  const devices = owners.filter((o) => deviceKindOf(o) !== "library" && !o.is_orphan);
  const watches = settingsWatches(owners);
  const page = pages !== undefined && watches.some((w) => pages.has(w.owner_watch_id));
  const steps: GettingStartedStep[] = [
    { id: "app", done: devices.length > 0 },
    { id: "pair", done: watches.length > 0 },
    { id: "page", done: page },
  ];
  const watch = watches.some((w) => w.owner_watch_id === shared) ? shared : watches[0]?.owner_watch_id;
  const out: GettingStarted = {
    steps,
    done: steps.filter((s) => s.done).length,
    watchNames: watches.map((w) => watchName(w, watches)),
    known: pages !== undefined || watches.length === 0,
  };
  const next = steps.find((s) => !s.done)?.id;
  if (next !== undefined) out.next = next;
  if (watch !== undefined) out.watch = watch;
  return out;
}

/**
 * The watches with at least one page of their own stored in Home Assistant,
 * from the watch config summary Home reads. A pages record that lists no
 * page (only the watch's own system pages, which are never counted) is not a
 * first page. An integration older than the summary's item counts sends no
 * `items`, and there the record itself is taken as the page.
 */
export function watchesWithPages(summary: WatchConfigSummary, watchIds: readonly string[]): Set<string> {
  const out = new Set<string>();
  for (const id of watchIds) {
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
export const PAIR_DEVICE_LABEL = "Pair a device";
export const NEW_PAGE_LABEL = "New page";
/** Beside the greyed New page until a watch is paired. */
export const PAIR_FIRST_TEXT = "Pair a watch first.";

/** Each step in the Help sheet: shorter, and saying what is true now. */
export function helpStepWords(id: StepId, gs: Pick<GettingStarted, "steps" | "watchNames">): { title: string; text: string } {
  const done = gs.steps.find((s) => s.id === id)?.done === true;
  if (id === "app") {
    return { title: "Get the app", text: done ? "Wrist Assistant is on the App Store." : "Install it on the watch and/or on the iPhone." };
  }
  if (id === "pair") {
    const names = gs.watchNames;
    const text = !done ? "Type the code the watch shows."
      : names.length === 1 ? `${names[0]} is paired.` : `${names.length} watches are paired.`;
    return { title: "Pair a watch", text };
  }
  return { title: "Make your first page", text: "Tiles for lights, scenes and cameras." };
}
