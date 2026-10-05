// The watch's rules for the Control Center list, the one module that reads
// `control-center-rules.json`: which domains draw as a toggle and which as an
// action, the icon the phone gives a new entry of each domain, and the keys
// an entry holds. Everything else in the editor asks here, so the table can
// be swapped for the copy the app's tests write from Swift without touching
// another file.
//
// The table's sources in the app: the two domain sets are
// `ComplicationEntityState.CuratedEntity.toggleDomains` and `actionDomains`
// (`Shared/ComplicationEntityState.swift`), the icons are
// `ControlCenterSettingsView.defaultIcon(for:)`, and the keys are
// `CuratedEntity`'s synthesized coding keys.
//
// Two rules are watch code with no table, ported by hand: a toggle reads as
// on when a lock is unlocked, a cover is open, and anything else is "on"
// (`EntityToggleValueProvider.activeState`); a control with no tint is drawn
// in the system blue (`controlTint`, `ControlWidgets.swift`).
//
// Plan: app repo docs/pages_in_home_assistant_step4.md ("4d batch 5 build
// contract", item 4).

import rulesTable from "./control-center-rules.json";

export interface ControlCenterRules {
  toggleDomains: string[];
  actionDomains: string[];
  defaultIcons: Record<string, string>;
  fallbackIcon: string;
  requiredKeys: string[];
  optionalKeys: string[];
}

export const CONTROL_CENTER_RULES = rulesTable as ControlCenterRules;

/** The SwiftUI `.blue` a control with no tint is drawn in, as watchOS draws
 * it on a dark face. */
export const CONTROL_CENTER_DEFAULT_TINT = "#0A84FF";

/** How the watch's Control Center treats a domain. */
export type ControlCenterKind = "toggle" | "action" | "none";

export function controlCenterKind(domain: string): ControlCenterKind {
  if (CONTROL_CENTER_RULES.toggleDomains.includes(domain)) return "toggle";
  if (CONTROL_CENTER_RULES.actionDomains.includes(domain)) return "action";
  return "none";
}

/** The nine domains the watch draws, toggles first, in the table's order. */
export function controlCenterDomains(): string[] {
  return [...CONTROL_CENTER_RULES.toggleDomains, ...CONTROL_CENTER_RULES.actionDomains];
}

/** The icon the phone gives a new entry of `domain`. */
export function controlCenterDefaultIcon(domain: string): string {
  const icons = CONTROL_CENTER_RULES.defaultIcons;
  return Object.hasOwn(icons, domain) ? icons[domain]! : CONTROL_CENTER_RULES.fallbackIcon;
}

/** Whether a toggle in `domain` reads as on in `state`, as the watch's
 * toggle does. Undefined for an action, or with no state. */
export function controlCenterIsOn(domain: string, state: string | undefined): boolean | undefined {
  if (controlCenterKind(domain) !== "toggle" || state === undefined) return undefined;
  const s = state.toLowerCase();
  if (domain === "lock") return s === "unlocked";
  if (domain === "cover") return s === "open";
  return s === "on";
}

/** The keys an entry may hold that the editor writes or clears. */
export const CONTROL_CENTER_CUSTOM_KEYS = ["customIconName", "customDisplayName", "tintColorHex"] as const;
