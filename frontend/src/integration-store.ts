// Where this Home Assistant updates the integration. Home Assistant 2026.11
// replaced HACS with Marketplace and no longer loads HACS, so the panel's
// update lines name the one this box has, from the version `hass.config` gives
// it. Until a version is known they name both: a guess would send someone to a
// place their box does not have.
//
// Error words are plain functions with no `hass` of their own, so the panel
// tells this module the version as it arrives.

let known: string | undefined;

/** The version the panel was last handed. */
export function noteHaVersion(version: string | undefined): void {
  known = version;
}

/** The first Home Assistant that has Marketplace, and refuses HACS. */
const MARKETPLACE_FIRST = [2026, 11] as const;

/** The place to update the integration on `version`, by default the version
 * the panel knows. */
export function integrationStoreName(version: string | undefined = known): string {
  const m = version === undefined ? null : /^(\d+)\.(\d+)/.exec(version);
  if (m === null) return "Marketplace or HACS";
  const year = Number(m[1]);
  const month = Number(m[2]);
  const newer = year > MARKETPLACE_FIRST[0] || (year === MARKETPLACE_FIRST[0] && month >= MARKETPLACE_FIRST[1]);
  return newer ? "Marketplace" : "HACS";
}
