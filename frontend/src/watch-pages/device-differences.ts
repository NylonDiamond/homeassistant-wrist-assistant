// The one line under each preview of Side by side (plan step 4): what that
// kind of device does otherwise with this page, and nothing else. No how-to
// text. A page both kinds draw the same way gets no line.
//
// Both lines read the tables the devices read: `tileDrawsOn` for the kinds
// only an iPhone draws, and the phone keys (`phone-keys-model.ts`) for what
// an iPhone adds to a tile both draw. App repo
// docs/panel_one_board_plan_2026-10.md, step 4.

import type { PreviewKind } from "../library/item-mode.js";
import { joinNames } from "../copies.js";
import { type WatchPage, type WatchPageTile, watchPageTiles } from "./model.js";
import { watchCameraTileLive, watchMediaArtwork, watchPhoneKeysOf, watchSensorChart } from "./phone-keys-model.js";
import { watchSkippedTileNames } from "./phone-tiles-model.js";

/** The skipped tiles' names in one phrase: four at most, then how many more. */
function namesPhrase(names: readonly string[]): string {
  return names.length <= 4 ? joinNames(names) : `${names.slice(0, 3).join(", ")} and ${names.length - 3} more`;
}

/** How many tiles on the page have an iPhone extra switched on. */
function extrasOn(tiles: readonly WatchPageTile[]): { cameras: number; charts: number; artwork: number } {
  let cameras = 0;
  let charts = 0;
  let artwork = 0;
  for (const tile of tiles) {
    const keys = watchPhoneKeysOf(tile);
    if (keys.includes("cameraTileLive") && watchCameraTileLive(tile)) cameras++;
    if (keys.includes("sensorChart") && watchSensorChart(tile) !== undefined) charts++;
    if (keys.includes("mediaArtwork") && watchMediaArtwork(tile)) artwork++;
  }
  return { cameras, charts, artwork };
}

/**
 * The differences line under one kind's preview, or "" when it draws the
 * page as the other kind does. A watch: "Skips Map and Web. Cameras show a
 * still picture." An iPhone: "Also shows Map and Web. Cameras play live."
 */
export function deviceDifferenceText(page: WatchPage | undefined, kind: PreviewKind): string {
  const skipped = watchSkippedTileNames(page);
  const extras = extrasOn(watchPageTiles(page));
  const lines: string[] = [];
  const one = (n: number, single: string, many: string) => (n === 1 ? single : many);
  if (kind === "watch") {
    if (skipped.length > 0) lines.push(`Skips ${namesPhrase(skipped)}.`);
    if (extras.cameras > 0) lines.push(one(extras.cameras, "The camera shows a still picture.", "Cameras show a still picture."));
    if (extras.charts > 0) lines.push(one(extras.charts, "The sensor shows no chart.", "Sensors show no chart."));
    if (extras.artwork > 0) lines.push(one(extras.artwork, "The media player shows no artwork.", "Media players show no artwork."));
  } else {
    if (skipped.length > 0) lines.push(`Also shows ${namesPhrase(skipped)}.`);
    if (extras.cameras > 0) lines.push(one(extras.cameras, "The camera plays live.", "Cameras play live."));
    if (extras.charts > 0) lines.push(one(extras.charts, "The sensor shows a chart.", "Sensors show a chart."));
    if (extras.artwork > 0) lines.push(one(extras.artwork, "The media player shows artwork and controls.", "Media players show artwork and controls."));
  }
  return lines.join(" ");
}
