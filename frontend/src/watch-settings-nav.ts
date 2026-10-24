// The Watch settings page's side panel: the groups it lists, the cards each
// group shows, and the search that looks through every group at once. The
// page shows one group at a time, so a person new to the app meets a short
// list of settings instead of all of them. Every setting the app still uses
// is in one group, and the search finds any of them.
//
// A card is one catalog section (`watch-settings-catalog.json`), one of the
// notification style's sections, or the This watch or client certificate
// card. Pairing another device is Home's, not a device's page.
// The view draws the cards; this file only says which go where, so the tests
// can check that every card is in exactly one group without a DOM.

import { SECTION_COLOR } from "./kinds.js";
import type { UiIconName } from "./ui-icons.js";

/** The page's cards, by the id each one draws under (`data-sec="ws-<id>"`). */
export type SettingsCardId =
  | "connection" | "gestures" | "motion" | "navigation" | "controls" | "camera"
  | "notifications" | "sounds"
  | "device" | "cert";

export interface SettingsGroup {
  id: string;
  title: string;
  /** One plain line under the group's name, over its cards. */
  blurb: string;
  icon: UiIconName;
  color: string;
  cards: readonly SettingsCardId[];
}

/** The side panel's groups, in its order. */
export const SETTINGS_GROUPS: readonly SettingsGroup[] = [
  { id: "connection", title: "Connection", blurb: "How your watch reaches Home Assistant.", icon: "globe", color: SECTION_COLOR.place, cards: ["connection"] },
  { id: "gestures", title: "Gestures", blurb: "What happens when you pinch, tap, pull, hold or twist.", icon: "tap", color: SECTION_COLOR.tap, cards: ["gestures", "motion"] },
  { id: "pages", title: "Pages", blurb: "Moving between pages, and what each page shows.", icon: "pages", color: SECTION_COLOR.numbers, cards: ["navigation"] },
  { id: "controls", title: "Controls", blurb: "How lights, locks and sliders look and respond.", icon: "radial", color: "var(--wa-hue-blue)", cards: ["controls"] },
  { id: "cameras", title: "Cameras", blurb: "Live video, and how often pictures update.", icon: "image", color: SECTION_COLOR.look, cards: ["camera"] },
  { id: "notifications", title: "Notifications", blurb: "How alerts look on your wrist, and how fast they arrive.", icon: "note", color: SECTION_COLOR.position, cards: ["notifications"] },
  { id: "sounds", title: "Sounds", blurb: "Volume, and the sound for each action.", icon: "states", color: "var(--wa-hue-blue)", cards: ["sounds"] },
  { id: "pairing", title: "Pairing and security", blurb: "When this device was paired, and a certificate for special setups.", icon: "lock", color: SECTION_COLOR.states, cards: ["device", "cert"] },
];

/** The group with this id, or the first. */
export function settingsGroup(id: string | undefined): SettingsGroup {
  return SETTINGS_GROUPS.find((g) => g.id === id) ?? SETTINGS_GROUPS[0]!;
}

/** The group a card is in. */
export function groupOfCard(card: SettingsCardId): SettingsGroup | undefined {
  return SETTINGS_GROUPS.find((g) => g.cards.includes(card));
}

/** The words of a search, lower case, without the spaces round them. Empty
 * means no search. */
export function searchTerms(query: string): string[] {
  return query.toLowerCase().split(/\s+/).filter((t) => t !== "");
}

/** Whether every term is somewhere in `words`. No terms match everything. */
export function matchesSearch(terms: readonly string[], words: readonly (string | undefined)[]): boolean {
  if (terms.length === 0) return true;
  const text = words.filter((w): w is string => w !== undefined).join(" ").toLowerCase();
  return terms.every((t) => text.includes(t));
}
