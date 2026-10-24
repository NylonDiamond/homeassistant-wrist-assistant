// The "This watch" card on a paired device's Settings page, in Pairing and
// security: when the device was paired, its app, when it last reached Home
// Assistant, and whose it is, with one line on what to do when it stops
// connecting. Pairing another device is Home's job, so the page shows this
// card in place of "Pair a device" once a device is on it.
//
// Only what the owners list already says (`OwnerSummary`). The words and
// rows live here so the tests read them without a DOM; the Settings page
// draws them (`watch-settings-view.ts`).

import type { OwnerSummary } from "./ha-api.js";
import { agoWords } from "./send-state.js";
import type { SettingDevice } from "./watch-settings.js";

/** The card's title. */
export function thisDeviceTitle(device: SettingDevice): string {
  return device === "iphone" ? "This iPhone" : "This watch";
}

/** The one line under the rows. */
export function thisDeviceNote(device: SettingDevice): string {
  return device === "iphone"
    ? "If this iPhone stops connecting, open Settings in Wrist Assistant and choose Pair Again."
    : "If this watch stops connecting, open Settings on the watch and choose Pair again.";
}

/** What the search looks through for the card. "pair" finds it, as it found
 * the pairing card before. */
export const THIS_DEVICE_SEARCH_WORDS = "This watch, this iPhone, paired, pairing, pair again, app version, build, last seen, reached, owner, person";

/** The Paired row's tooltip: the stamp also moves on a re-key and on an app
 * update, so it is the latest of those. */
export const THIS_DEVICE_PAIRED_HELP = "When it was paired, or last re-keyed or updated.";

/** One row of the card: a label and its value, and a tooltip on some. */
export interface ThisDeviceRow {
  label: string;
  value: string;
  title?: string;
}

/** A stamp as a short date, "7 Oct 2026". Undefined when there is none or
 * it does not parse. */
export function pairedDateText(at: string | null | undefined, locale?: string): string | undefined {
  if (typeof at !== "string" || at === "") return undefined;
  const date = new Date(at);
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toLocaleDateString(locale, { day: "numeric", month: "short", year: "numeric" });
}

/** The app's version and build, "3.1.0 (2)". */
export function appText(owner: Pick<OwnerSummary, "app_version" | "app_build"> | undefined): string {
  const version = owner?.app_version;
  if (!version) return "Not reported yet";
  return owner?.app_build ? `${version} (${owner.app_build})` : version;
}

/** When the device last reached Home Assistant: "Now" for a watch holding a
 * long poll, else "5 min ago", aged by `elapsed` seconds since the list was
 * read. Home Assistant forgets on a restart, so a device it has not heard
 * from since says so. */
export function reachedText(owner: Pick<OwnerSummary, "polling" | "last_seen_seconds"> | undefined, elapsed = 0): string {
  if (owner?.polling === true) return "Now";
  const seconds = owner?.last_seen_seconds;
  if (typeof seconds !== "number") return "Not since Home Assistant started";
  const words = agoWords(seconds + Math.max(0, elapsed));
  return words[0]!.toUpperCase() + words.slice(1);
}

/** Whose device it is, by name. `name` is the person's name when the panel
 * knows it; a device bound to a deleted user, or to nobody, says so. */
export function ownerText(owner: Pick<OwnerSummary, "user_id" | "user_gone"> | undefined, name: string | undefined): string {
  if (owner?.user_gone === true) return "A removed Home Assistant user";
  if (name !== undefined && name !== "") return name;
  return owner?.user_id ? "A Home Assistant user" : "No one yet";
}

/** The card's rows, in order. Paired is left out when the date is not
 * known. */
export function thisDeviceRows(
  owner: OwnerSummary | undefined,
  ownerName: string | undefined,
  options: { elapsed?: number; locale?: string } = {},
): ThisDeviceRow[] {
  const rows: ThisDeviceRow[] = [];
  const paired = pairedDateText(owner?.last_provision, options.locale);
  if (paired !== undefined) rows.push({ label: "Paired", value: paired, title: THIS_DEVICE_PAIRED_HELP });
  rows.push({ label: "App", value: appText(owner) });
  rows.push({ label: "Last reached Home Assistant", value: reachedText(owner, options.elapsed) });
  rows.push({ label: "Owner", value: ownerText(owner, ownerName) });
  return rows;
}
