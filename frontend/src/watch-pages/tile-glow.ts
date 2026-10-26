// The checks a save of a tile's icon glow needs (`iconGlow`, the Glow rows
// of the Icon card in `tile-settings.ts`), and the code point count the
// template caps are measured in. Apart from the drawing so the page draft's
// value check (`merge.ts`) can read them without pulling One Look in.

import { type WatchPageTile, isJsonObject } from "./model.js";

/** A string's length in Unicode code points, as Python's `len` and Swift's
 * `unicodeScalars.count` count it. */
export function codePoints(text: string): number {
  let n = 0;
  for (const _ of text) n++;
  return n;
}

/**
 * What would make a save of this tile's `iconGlow` wrong, as sentences that
 * start with the key, or an empty list; the integration's `_check_icon_glow`
 * refuses the same. Absent or null is no setting. Ranges and colour forms are
 * not checked: the readers clamp and fall back.
 */
export function tileGlowProblems(tile: WatchPageTile): string[] {
  const raw = tile.iconGlow;
  if (raw === undefined || raw === null) return [];
  if (!isJsonObject(raw)) return ["iconGlow must be an object."];
  const problems: string[] = [];
  if (raw.mode !== undefined && raw.mode !== "auto" && raw.mode !== "on" && raw.mode !== "off") problems.push('iconGlow.mode must be "auto", "on" or "off".');
  for (const key of ["size", "brightness"] as const) {
    const v = raw[key];
    if (v !== undefined && !(typeof v === "number" && Number.isFinite(v))) problems.push(`iconGlow.${key} must be a number.`);
  }
  if (raw.color !== undefined && typeof raw.color !== "string") problems.push("iconGlow.color must be a string.");
  return problems;
}
