// The Pair a device dialog's steps, as words and rules a test can read
// without a DOM: the choice it opens on ("What are you pairing?"), the steps
// each device shows, and what next once a watch is paired. The drawing is in
// `watch-pair-view.ts`; the panel decides where each next step goes.
//
// Most people pair a watch first, so the dialog no longer opens on the QR
// code: it asks first, and each answer opens the way that device pairs. The
// card on the Watch app's Settings page still opens on Type a code, with no
// choice to go back to.

import { type HomeDeviceRow, homeDeviceLabel } from "./home.js";
import { PAIR_CODE_STEPS, type PairMode } from "./watch-settings.js";

/** The two answers to "What are you pairing?". */
export type PairChoice = "watch" | "iphone";

/** How the card opens: on the choice, or straight on one way to pair. */
export type PairStart = PairMode | "choose";

/** The card's first step. `choosing` shows the choice. `autoQr` makes a
 * QR code without waiting for Show QR code. `asks` says the card opened on
 * the choice, so its other steps offer Back to it. */
export interface PairOpening {
  choosing: boolean;
  asks: boolean;
  mode: PairMode;
  autoQr: boolean;
}

/** Where the card starts. Asked for the choice, it shows it, with Type a
 * code under it so nothing is made until a device is picked. Otherwise it
 * opens on the mode asked for, Type a code when none is. */
export function pairOpening(start: { mode?: PairStart; showQr?: boolean } = {}): PairOpening {
  if (start.mode === "choose") return { choosing: true, asks: true, mode: "code", autoQr: false };
  const mode = start.mode ?? "code";
  return { choosing: false, asks: false, mode, autoQr: mode === "qr" && start.showQr === true };
}

/** The mode each answer opens: a watch shows a code to type here, an iPhone
 * scans a QR code the card makes at once. */
export function pairChoiceMode(choice: PairChoice): PairMode {
  return choice === "iphone" ? "qr" : "code";
}

/** The question and its two answers, each with one short line. */
export const PAIR_CHOICE_TITLE = "What are you pairing?";
export const PAIR_CHOICES: readonly { choice: PairChoice; label: string; line: string }[] = [
  { choice: "watch", label: "Apple Watch", line: "The watch shows a code. You type it here. No iPhone needed." },
  { choice: "iphone", label: "iPhone", line: "The panel shows a QR code. You scan it with the iPhone." },
];

/** The line under the choice: whose a paired device is. Only an
 * administrator gets "Whose watch is this?" (`mayPairForOthers`). */
export function pairChoiceNote(isAdmin: boolean): string {
  return isAdmin
    ? "A device you pair belongs to you, unless you choose someone else."
    : "A device you pair belongs to you. An administrator can pair one for someone else.";
}

/** The line under the dialog's title, for the step on screen. */
export function pairSubtitle(choosing: boolean, mode: PairMode, device: PairChoice | undefined): string {
  if (choosing) return "A watch or an iPhone, to this Home Assistant";
  if (mode === "qr") return "iPhone, by a QR code";
  if (device === "watch") return "Apple Watch, by its code";
  if (device === "iphone") return "iPhone, by its code";
  return "A watch or an iPhone, by its code";
}

/** The title over the code box: whose code it is, when the person said. */
export function pairCodeTitle(device: PairChoice | undefined): string {
  if (device === "watch") return "Type the watch's code";
  if (device === "iphone") return "Type the iPhone's code";
  return "Type the code";
}

/** The steps on the device before its code shows. A watch asks for this
 * Home Assistant's address after Pair with Home Assistant; an iPhone shows a
 * code from Show a code instead. Without an answer, the steps cover both. */
export function pairCodeSteps(device: PairChoice | undefined): readonly string[] {
  if (device === "watch") {
    return [
      "On the watch, open Wrist Assistant and choose Pair with Home Assistant.",
      "Pick this Home Assistant, or type its address.",
      "The watch shows a 6-character code. Type it here.",
    ];
  }
  if (device === "iphone") {
    return [
      "On the iPhone, open Wrist Assistant and choose Pair with Home Assistant.",
      "Choose Show a code instead, and pick this Home Assistant.",
      "The iPhone shows a 6-character code. Type it here.",
    ];
  }
  return PAIR_CODE_STEPS;
}

/** The title over a device found by its code. */
export function pairFoundTitle(kind: PairChoice): string {
  return `Is this your ${kind === "iphone" ? "iPhone" : "watch"}?`;
}

/** A found device as its box draws it: its name, large, then its app
 * version and build when it reported them. A device with no name is named
 * by its kind. */
export function pairFoundLines(found: {
  kind?: string | null; device_name?: string | null; app_version?: string | null; app_build?: string | null;
}): { name: string; app?: string } {
  const kind: PairChoice = found.kind === "iphone" ? "iphone" : "watch";
  const name = found.device_name?.trim() || (kind === "iphone" ? "iPhone" : "Apple Watch");
  const version = found.app_version?.trim();
  if (!version) return { name };
  const build = found.app_build?.trim();
  return { name, app: `App ${version}${build ? ` (${build})` : ""}` };
}

/** The button that pairs a found device. */
export function pairGoLabel(kind: PairChoice): string {
  return `Pair this ${kind === "iphone" ? "iPhone" : "watch"}`;
}

/** The QR mode's title. */
export const PAIR_QR_TITLE = "Scan with the iPhone";

/** The web address a pairing QR code holds, in place of the app's own link.
 * Scanned with the iPhone's Camera, it opens Wrist Assistant straight away
 * (a universal link). An iPhone without the app gets the page at this
 * address, which links to the App Store, and an older app is opened from
 * there by its own link. Everything after the `#` stays on the iPhone: a
 * browser never sends it to the website. */
export const PAIR_WEB_LINK = "https://wrist-assistant.com/pair";

/** The QR code's address for the app's link `wristassistant://pair#...`:
 * the same `#` part on `PAIR_WEB_LINK`. Undefined for any other link. */
export function pairQrLink(appLink: string): string | undefined {
  const prefix = "wristassistant://pair";
  if (!appLink.startsWith(`${prefix}#`)) return undefined;
  return PAIR_WEB_LINK + appLink.slice(prefix.length);
}

/** The link from one way to the other, in each step's foot. */
export const PAIR_TO_QR_TEXT = "Pairing an iPhone? Show a QR code";
export const PAIR_TO_QR_IPHONE_TEXT = "Show a QR code instead";
export const PAIR_TO_CODE_TEXT = "No camera? Type a code";
export const PAIR_NOT_THIS_TEXT = "Not this one";
export const PAIR_BACK_TEXT = "Back";

// ── what next, once a watch is paired ────────────────────────────────────

/** The docs' setup guide, from the foot of What next. */
export const PAIR_SETUP_GUIDE_URL = "https://docs.wrist-assistant.com/getting-started/setup/";

/** The headline once a watch is paired. */
export function pairedHeadline(name: string): string {
  return `${name.trim() || "Apple Watch"} is paired.`;
}

/** The line under the headline: what Home says about the device (its kind,
 * app version and paired iPhone), then whose it is when Home knows. */
export function pairedFactsLine(facts: readonly string[], whose: string | undefined): string {
  const owner = whose?.trim();
  return [...facts, ...(owner ? [`Belongs to ${owner}`] : [])].join(" · ");
}

export const PAIR_NEXT_TITLE = "What next";

/** The two next steps, in order. */
export const PAIR_NEXT_PAGE = {
  title: "Make your first page",
  line: "A page is a screen of tiles on the watch: lights, scenes, locks, cameras. You swipe between pages.",
  action: "New page",
} as const;
export const PAIR_NEXT_OPEN = {
  title: "Open Wrist Assistant on the watch",
  line: "The watch gets your changes when the app opens.",
} as const;

/** The foot's links and buttons. */
export const PAIR_NEXT_GUIDE_TEXT = "Setup guide";
export const PAIR_NEXT_COMPLICATION_TEXT = "Make a complication";
export const PAIR_NEXT_ANOTHER_TEXT = "Pair another device";
export const PAIR_NEXT_DONE_TEXT = "Done";

/** The state beside "Open Wrist Assistant on the watch": Home's own word
 * for the device, kept current by Home's own reads. Left out when Home has
 * no row for it, and when there is nothing for it to pick up (a watch
 * paired a moment ago with nothing made yet). */
export function pairNextStatus(
  row: Pick<HomeDeviceRow, "sync" | "rejected"> | undefined,
): { state: "synced" | "waiting" | "rejected"; label: string } | undefined {
  if (row === undefined) return undefined;
  const rejected = (row.rejected?.length ?? 0) > 0;
  if (!rejected && row.sync === "idle") return undefined;
  return { state: rejected ? "rejected" : row.sync === "waiting" ? "waiting" : "synced", label: homeDeviceLabel(row) };
}
