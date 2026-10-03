// The tile settings model: every shared settings case written by the phone
// (`fixtures-pages/settings`), the refusals, the readers against the table,
// and the helpers.

import { describe, expect, it } from "vitest";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

import pageKeys from "../src/watch-pages/page-keys.json";
import tileActions from "../src/watch-pages/tile-actions.json";
import tileDefaults from "../src/watch-pages/tile-defaults.json";
import { findWatchPage } from "../src/watch-pages/edit.js";
import type { WatchPageTile, WatchPagesDocument } from "../src/watch-pages/model.js";
import {
  WATCH_ICON_TAP_ANIMATIONS,
  WATCH_LABEL_FONT_DESIGNS,
  WATCH_LABEL_FONT_WEIGHTS,
  WATCH_SLIDE_DIRECTIONS,
  WATCH_TILE_SETTING_KEYS,
  WATCH_TRIGGER_TARGET_DOMAINS,
  type WatchSlideDirection,
  clearWatchTileHoldSlide,
  isWatchLibraryAction,
  isWatchTriggerTarget,
  normalizeWatchColor,
  readWatchSlideMap,
  setWatchHeaderColor,
  setWatchHeaderGlow,
  setWatchHeaderLabel,
  setWatchHeaderStyle,
  setWatchHeaderTextSize,
  setWatchPageLinkTarget,
  setWatchTileAskBeforeRunning,
  setWatchTileColor,
  setWatchTileColorMode,
  setWatchTileDimWhenOff,
  setWatchTileFontDesign,
  setWatchTileFontSize,
  setWatchTileFontWeight,
  setWatchTileHideWhenOff,
  setWatchTileHoldSlide,
  setWatchTileHoldSlideHTTP,
  setWatchTileHoldSlideHTTPBanner,
  setWatchTileHoldSlideHTTPBannerSeconds,
  setWatchTileHoldSlideTarget,
  setWatchTileHoldSlideTargetMode,
  setWatchTileIcon,
  setWatchTileIconDefault,
  setWatchTileIconShadow,
  setWatchTileIconSize,
  setWatchTileLabel,
  setWatchTileLabelColor,
  setWatchTileRainbow,
  setWatchTileShowLabel,
  setWatchTileSingleTap,
  setWatchTileSkipConditions,
  setWatchTileTapAnimation,
  setWatchTileTextShadow,
  watchColorInMode,
  watchColorMode,
  watchHeaderSettings,
  watchHoldSlideSettings,
  watchPageLinkTarget,
  watchSingleTapSettings,
  watchStorageIconName,
  watchTapActionLabel,
  watchTileActionSettings,
  watchTileIconSettings,
  watchTileKindEntry,
  watchTileKindName,
  watchTileMaxIconSize,
  watchTileTextSettings,
  watchTriggerModes,
  writeWatchSlideMap,
  scrubWatchOrphanTriggers,
  watchStoredPageName,
  watchTileIconSizeTop,
  watchTileIconSizeValue,
} from "../src/watch-pages/tile-settings-model.js";
import { watchLinkTargetMenu } from "../src/watch-pages/tile-settings-options.js";
import { newWatchEntityTile, newWatchPageLinkTile, watchGradientOf } from "../src/watch-pages/tile-new.js";
import {
  WATCH_TILE_STYLING_SETTERS,
  clearWatchTileStateOverrides,
  resetWatchTileState,
  resetWatchTileTask,
  setWatchTileStateColor,
  setWatchTileStateIcon,
} from "../src/watch-pages/styling-model.js";
import {
  WATCH_PAGE_STYLING_SETTERS,
  resetWatchPage,
  selectWatchPageDecoration,
  setWatchPageColorMode,
  setWatchPageGradientColors,
  setWatchPageTheme,
} from "../src/watch-pages/page-settings-model.js";
import { watchHeaderLook } from "../src/watch-pages/preview.js";
import type { WatchLibraryKind } from "../src/watch-pages/catalog.js";
import {
  setWatchLibraryTileTarget,
  setWatchTileHTTPReply,
  setWatchTileHTTPToastSeconds,
  setWatchTileMacroCloseMode,
  setWatchTileMacroRunSilently,
} from "../src/watch-pages/library-model.js";
import {
  WATCH_SPECIAL_SETTERS,
  addWatchCalendars,
  addWatchCamerasToGroup,
  addWatchRemoteLauncher,
  applyWatchVacuumDiscovery,
  centerWatchCameraCellOffset,
  centerWatchCameraOffset,
  detectWatchCameraRatios,
  mergeWatchCameraTiles,
  moveWatchCameraInGroup,
  nudgeWatchCameraCellOffset,
  nudgeWatchCameraOffset,
  removeWatchCalendar,
  removeWatchCameraFromGroup,
  removeWatchGroupCamera,
  removeWatchRemoteLauncher,
  resetWatchRemoteLayout,
  resetWatchSpecialTask,
  setWatchAlarmAutoSubmit,
  setWatchCalendarColor,
  setWatchCameraCellFill,
  setWatchCameraCellWeight,
  setWatchCameraDisplayMode,
  setWatchCameraFill,
  setWatchRemoteLauncherColor,
  setWatchRemoteLauncherIcon,
  setWatchRemoteLauncherLabel,
  setWatchRemoteLayoutSlot,
  setWatchVacuumEntity,
  setWatchVacuumExtraLabel,
  setWatchVacuumSwitches,
  setWatchWeatherShowIcons,
  setWatchWeatherTextScale,
  swapWatchCameraInGroup,
  swapWatchRemoteLayoutSlots,
  unmergeWatchCameraGroup,
  watchVacuumDiscoverySuggestions,
} from "../src/watch-pages/special-model.js";
import {
  WATCH_APP_SETTERS,
  type WatchSpeakerListKey,
  type WatchVoiceIdKey,
  type WatchVolumePercentKey,
  addWatchMusicHubPreset,
  addWatchMusicHubSpeakers,
  moveWatchMusicHubPreset,
  moveWatchMusicHubSpeaker,
  removeWatchMusicHubPreset,
  removeWatchMusicHubSpeaker,
  renameWatchMusicHubPreset,
  setWatchAssistMode,
  setWatchAssistReplySpeaker,
  setWatchTemplatePreset,
  setWatchTemplateText,
  setWatchVoiceId,
  setWatchVoiceSpeakers,
  setWatchVoiceVolume,
  toggleWatchMusicHubPresetSpeaker,
} from "../src/watch-pages/app-model.js";

type Json = Record<string, unknown>;

/** The special tasks with a reset (part 3f); the rest are 3d's. */
const SPECIAL_TASKS = ["data", "alarm", "person", "camera", "calendarSettings", "weather"];

const PAGE = "C3A0E000-0000-4000-8000-0000000000AA";
const SYSTEM_PAGE = "C3A0E000-0000-4000-8000-0000000000BB";
const SMART_PAGE = "C3A0E000-0000-4000-8000-0000000000CC";
const OTHER_TILE: Json = { id: "C3A0E000-0000-4000-8000-0000000000DD", entityId: "switch.fan", showLabel: true };

function deepFreeze<T>(value: T): T {
  if (typeof value === "object" && value !== null) {
    Object.values(value).forEach(deepFreeze);
    Object.freeze(value);
  }
  return value;
}

/** A document with a system page, then the page holding `tile` after
 * another tile, then a smart page holding a copy of it. Frozen. */
function docWith(tile: Json): WatchPagesDocument {
  return deepFreeze({
    schemaVersion: 1,
    pages: [
      { id: SYSTEM_PAGE, name: "System", isSystemPage: true, items: [structuredClone(tile)] },
      { id: PAGE, name: "Living", items: [structuredClone(OTHER_TILE), structuredClone(tile)] },
      { id: SMART_PAGE, name: "Smart", dynamicConfig: { rules: [] }, items: [structuredClone(tile)] },
    ],
  });
}

function tileIn(document: WatchPagesDocument): WatchPageTile {
  return (findWatchPage(document, PAGE)!.items as WatchPageTile[])[1]!;
}

// The phone's gradient version of a solid color, taken from the test values
// `tile-defaults.json` carries for every swatch and role of every theme.
const GRADIENTS = new Map<string, string>();
for (const theme of Object.values((tileDefaults as unknown as { themes: Record<string, Json> }).themes)) {
  const hexes = theme.expandedSwatchHexes as string[];
  const gradients = theme.expandedSwatchGradients as string[];
  hexes.forEach((h, i) => GRADIENTS.set(h, gradients[i]!));
  const roles = theme.roles as Record<string, string>;
  const gradientRoles = theme.gradientRoles as Record<string, string>;
  for (const [role, hex] of Object.entries(roles)) if (gradientRoles[role]) GRADIENTS.set(hex, gradientRoles[role]!);
}
function gradientOf(hex: string): string {
  const g = GRADIENTS.get(hex);
  if (g === undefined) throw new Error(`no gradient test value for ${hex}`);
  return g;
}

// ── the case files ───────────────────────────────────────────────────────

interface SettingsCase {
  name: string;
  source: string;
  tile: Json;
  edit: Json & { op: string };
  expected: Json;
}

/** A page case: a whole page and one edit in, the whole page out. */
interface PageSettingsCase {
  name: string;
  source: string;
  page: Json;
  edit: Json & { op: string };
  expected: Json;
}

const dir = join(__dirname, "fixtures-pages", "settings");
// `WA_SETTINGS_CASES` points the replay at another folder of case files
// (the app's own, before they are synced here).
const casesDir = process.env.WA_SETTINGS_CASES ?? dir;
const files = existsSync(casesDir) ? readdirSync(casesDir).filter((f) => f.endsWith(".json")).sort() : [];

function applyCase(document: WatchPagesDocument, c: SettingsCase): WatchPagesDocument {
  // The case file decides each field's type; `never` passes it on as is.
  const e = c.edit as unknown as Record<
    "value" | "gradient" | "mode" | "direction" | "entityId" | "friendlyName" | "style" | "page" | "oldTargetName" | "task" | "state",
    never
  >;
  const T = c.tile.id as string;
  switch (c.edit.op) {
    case "icon":
      return setWatchTileIcon(document, PAGE, T, e.value);
    case "iconDefault":
      return setWatchTileIconDefault(document, PAGE, T, {
        icon: (c.expected.icon as string | undefined) ?? null,
        color: (c.expected.color as string | undefined) ?? null,
      });
    case "color":
      return setWatchTileColor(
        document,
        PAGE,
        T,
        watchColorInMode(e.value, e.gradient ? "gradient" : "solid", gradientOf)!,
      );
    case "colorMode":
      return setWatchTileColorMode(document, PAGE, T, e.mode, gradientOf);
    case "rainbow":
      return setWatchTileRainbow(document, PAGE, T);
    case "iconSize":
      return setWatchTileIconSize(document, PAGE, T, e.value);
    case "iconShadow":
      return setWatchTileIconShadow(document, PAGE, T, e.value);
    case "dimWhenOff":
      return setWatchTileDimWhenOff(document, PAGE, T, e.value);
    case "tapAnimation":
      return setWatchTileTapAnimation(document, PAGE, T, e.value);
    case "label":
      return setWatchTileLabel(document, PAGE, T, e.value);
    case "showLabel":
      return setWatchTileShowLabel(document, PAGE, T, e.value);
    case "fontSize":
      return setWatchTileFontSize(document, PAGE, T, e.value);
    case "fontWeight":
      return setWatchTileFontWeight(document, PAGE, T, e.value);
    case "fontDesign":
      return setWatchTileFontDesign(document, PAGE, T, e.value);
    case "textShadow":
      return setWatchTileTextShadow(document, PAGE, T, e.value);
    case "labelColor":
      return setWatchTileLabelColor(document, PAGE, T, e.value);
    case "singleTap":
      return setWatchTileSingleTap(document, PAGE, T, e.value);
    case "holdSlide":
      return setWatchTileHoldSlide(document, PAGE, T, e.direction, e.value);
    case "holdSlideClear":
      return clearWatchTileHoldSlide(document, PAGE, T);
    case "holdSlideTarget":
      return setWatchTileHoldSlideTarget(document, PAGE, T, e.direction, e.entityId, e.friendlyName);
    case "holdSlideTargetMode":
      return setWatchTileHoldSlideTargetMode(document, PAGE, T, e.direction, e.mode);
    case "askBeforeRunning":
      return setWatchTileAskBeforeRunning(document, PAGE, T, e.value);
    case "hideWhenOff":
      return setWatchTileHideWhenOff(document, PAGE, T, e.value);
    case "skipConditions":
      return setWatchTileSkipConditions(document, PAGE, T, e.value);
    case "headerStyle":
      return setWatchHeaderStyle(document, PAGE, T, e.style);
    case "headerLabel":
      return setWatchHeaderLabel(document, PAGE, T, e.value);
    case "headerTextSize":
      return setWatchHeaderTextSize(document, PAGE, T, e.value);
    case "headerGlow":
      return setWatchHeaderGlow(document, PAGE, T, e.value);
    case "headerColor":
      return setWatchHeaderColor(document, PAGE, T, e.value);
    case "pageTarget":
      return setWatchPageLinkTarget(document, PAGE, T, e.page, e.oldTargetName);
    // Part 3d: every styling row by the key it writes.
    case "set":
      return tileSetter(c.edit.key)(document, PAGE, T, e.value);
    case "swatch":
      return tileSetter(c.edit.key)(document, PAGE, T, (e.gradient ? watchGradientOf(e.value) : e.value) as never);
    case "reset":
      return SPECIAL_TASKS.includes(c.edit.task as string)
        ? resetWatchSpecialTask(document, PAGE, T, e.task)
        : resetWatchTileTask(document, PAGE, T, e.task);
    case "stateIcon":
      return setWatchTileStateIcon(document, PAGE, T, e.state, e.value);
    case "stateColor":
      return setWatchTileStateColor(document, PAGE, T, e.state, e.value);
    case "stateRowReset":
      return resetWatchTileState(document, PAGE, T, e.state);
    case "stateOverridesClear":
      return clearWatchTileStateOverrides(document, PAGE, T);
    // Part 3e: the library tiles.
    case "libraryTarget":
      // `oldTargetNames`: the old entry's names now, none when it is gone.
      return setWatchLibraryTileTarget(document, PAGE, T, c.edit.kind as WatchLibraryKind, { id: c.edit.id as string, name: c.edit.name as string }, c.edit.oldTargetNames as string[]);
    case "holdSlideHTTP":
      return setWatchTileHoldSlideHTTP(document, PAGE, T, e.direction, c.edit.id as string);
    case "holdSlideHTTPBanner":
      return setWatchTileHoldSlideHTTPBanner(document, PAGE, T, e.direction, e.value);
    case "holdSlideHTTPBannerSeconds":
      return setWatchTileHoldSlideHTTPBannerSeconds(document, PAGE, T, e.direction, e.value);
    case "httpReply":
      return setWatchTileHTTPReply(document, PAGE, T, e.value);
    case "httpToastSeconds":
      return setWatchTileHTTPToastSeconds(document, PAGE, T, e.value);
    case "macroCloseMode":
      return setWatchTileMacroCloseMode(document, PAGE, T, e.value);
    case "macroRunSilently":
      return setWatchTileMacroRunSilently(document, PAGE, T, e.value);
    // Part 3f batch 1: the special tiles.
    default:
      return applySpecialCase(document, T, c.edit);
  }
}

/** A special tile case's edit (part 3f), on the tile `T` of `PAGE`. */
function applySpecialCase(document: WatchPagesDocument, T: string, edit: Json & { op: string }): WatchPagesDocument {
  // The case file decides each field's type; `never` passes it on as is.
  const e = edit as unknown as Record<
    "slot" | "kind" | "from" | "to" | "scriptId" | "friendlyName" | "index" | "value" | "dx" | "dy" | "entityIds" | "direction" | "toOffset" | "ids" | "picks" | "siblings" | "id" | "hex",
    never
  >;
  switch (edit.op) {
    case "remoteLayoutSlot":
      return setWatchRemoteLayoutSlot(document, PAGE, T, e.slot, e.kind);
    case "remoteLayoutSwap":
      return swapWatchRemoteLayoutSlots(document, PAGE, T, e.from, e.to);
    case "remoteLayoutReset":
      return resetWatchRemoteLayout(document, PAGE, T);
    case "remoteLauncherAdd":
      return addWatchRemoteLauncher(document, PAGE, T, e.scriptId, e.friendlyName);
    case "remoteLauncherLabel":
      return setWatchRemoteLauncherLabel(document, PAGE, T, e.index, e.value);
    case "remoteLauncherIcon":
      return setWatchRemoteLauncherIcon(document, PAGE, T, e.index, e.value);
    case "remoteLauncherColor":
      return setWatchRemoteLauncherColor(document, PAGE, T, e.index, e.value);
    case "remoteLauncherRemove":
      return removeWatchRemoteLauncher(document, PAGE, T, e.index);
    case "cameraDisplayMode":
      return setWatchCameraDisplayMode(document, PAGE, T, e.value);
    case "cameraFill":
      return setWatchCameraFill(document, PAGE, T, e.value);
    case "cameraOffset":
      return nudgeWatchCameraOffset(document, PAGE, T, e.dx, e.dy);
    case "cameraOffsetCenter":
      return centerWatchCameraOffset(document, PAGE, T);
    case "cameraGroupAdd":
      return addWatchCamerasToGroup(document, PAGE, T, e.entityIds);
    case "cameraGroupRemove":
      return removeWatchCameraFromGroup(document, PAGE, T, e.index);
    case "cameraGroupSwap":
      return swapWatchCameraInGroup(document, PAGE, T, e.index, e.direction);
    case "cameraGroupMove":
      return moveWatchCameraInGroup(document, PAGE, T, e.from, e.toOffset);
    case "cameraCellFill":
      return setWatchCameraCellFill(document, PAGE, T, e.index, e.value);
    case "cameraCellOffset":
      return nudgeWatchCameraCellOffset(document, PAGE, T, e.index, e.dx, e.dy);
    case "cameraCellOffsetCenter":
      return centerWatchCameraCellOffset(document, PAGE, T, e.index);
    case "vacuumEntity":
      return setWatchVacuumEntity(document, PAGE, T, e.slot, e.value);
    case "vacuumExtraLabel":
      return setWatchVacuumExtraLabel(document, PAGE, T, e.value);
    case "vacuumSwitches":
      return setWatchVacuumSwitches(document, PAGE, T, e.ids);
    case "vacuumDiscovery": {
      // `siblings`: the sheet applied as it suggests; `picks`: as picked.
      if (edit.picks !== undefined) return applyWatchVacuumDiscovery(document, PAGE, T, e.picks);
      const tile = (findWatchPage(document, PAGE)!.items as WatchPageTile[]).find((t) => t.id === T)!;
      return applyWatchVacuumDiscovery(document, PAGE, T, watchVacuumDiscoverySuggestions(tile, e.siblings));
    }
    case "calendarAdd":
      return addWatchCalendars(document, PAGE, T, e.ids);
    case "calendarRemove":
      return removeWatchCalendar(document, PAGE, T, e.id);
    case "calendarColor":
      return setWatchCalendarColor(document, PAGE, T, e.id, e.hex);
    case "weatherTextScale":
      return setWatchWeatherTextScale(document, PAGE, T, e.value);
    case "weatherShowIcons":
      return setWatchWeatherShowIcons(document, PAGE, T, e.value);
    case "autoSubmitPIN":
      return setWatchAlarmAutoSubmit(document, PAGE, T, e.value);
    // Part 3f batch 2: the app tiles.
    case "templatePreset":
      return setWatchTemplatePreset(document, PAGE, T, e.id);
    case "templateText":
      return setWatchTemplateText(document, PAGE, T, e.value);
    case "musicHubSpeakersAdd":
      return addWatchMusicHubSpeakers(document, PAGE, T, e.ids);
    case "musicHubSpeakerRemove":
      return removeWatchMusicHubSpeaker(document, PAGE, T, e.index);
    case "musicHubSpeakerMove":
      return moveWatchMusicHubSpeaker(document, PAGE, T, e.from, e.to);
    case "musicHubPresetAdd":
      return addWatchMusicHubPreset(document, PAGE, T, { newId: () => edit.id as string });
    case "musicHubPresetRemove":
      return removeWatchMusicHubPreset(document, PAGE, T, e.index);
    case "musicHubPresetMove":
      return moveWatchMusicHubPreset(document, PAGE, T, e.from, e.to);
    case "musicHubPresetName":
      return renameWatchMusicHubPreset(document, PAGE, T, e.index, e.value);
    case "musicHubPresetToggle":
      return toggleWatchMusicHubPresetSpeaker(document, PAGE, T, e.index, edit.speakerId as string);
    case "assistMode":
      return setWatchAssistMode(document, PAGE, T, e.value);
    case "assistReplySpeaker":
      return setWatchAssistReplySpeaker(document, PAGE, T, e.value);
    case "voiceId":
      return setWatchVoiceId(document, PAGE, T, edit.key as WatchVoiceIdKey, e.value);
    case "voiceSpeakers":
      return setWatchVoiceSpeakers(document, PAGE, T, edit.key as WatchSpeakerListKey, e.ids);
    case "voiceVolume":
      return setWatchVoiceVolume(document, PAGE, T, edit.key as WatchVolumePercentKey, e.value);
    default:
      throw new Error(`unknown op ${edit.op}`);
  }
}

/** The ids a case hands out, in order. */
function idsFrom(ids: unknown): () => string {
  const queue = [...(ids as string[])];
  return () => {
    const next = queue.shift();
    if (next === undefined) throw new Error("the case ran out of ids");
    return next;
  };
}

function tileSetter(key: unknown) {
  if (typeof key === "string" && Object.hasOwn(WATCH_SPECIAL_SETTERS, key)) return WATCH_SPECIAL_SETTERS[key]!;
  if (typeof key === "string" && Object.hasOwn(WATCH_APP_SETTERS, key)) return WATCH_APP_SETTERS[key]!;
  const setter = typeof key === "string" && Object.hasOwn(WATCH_TILE_STYLING_SETTERS, key) ? WATCH_TILE_STYLING_SETTERS[key] : undefined;
  if (setter === undefined) throw new Error(`no tile setter for ${String(key)}`);
  return setter;
}

function pageSetter(key: unknown) {
  const setter = typeof key === "string" && Object.hasOwn(WATCH_PAGE_STYLING_SETTERS, key) ? WATCH_PAGE_STYLING_SETTERS[key] : undefined;
  if (setter === undefined) throw new Error(`no page setter for ${String(key)}`);
  return setter;
}

/** One page case's edit on a document that holds its page. */
function applyPageCase(document: WatchPagesDocument, c: PageSettingsCase): WatchPagesDocument {
  const e = c.edit as unknown as Record<"value" | "gradient" | "mode" | "key" | "task", never>;
  const P = c.page.id as string;
  switch (c.edit.op) {
    case "pageSet":
      return pageSetter(e.key)(document, P, e.value);
    case "pageSwatch":
      return pageSetter(e.key)(document, P, (e.gradient ? watchGradientOf(e.value) : e.value) as never);
    case "pageColorMode":
      return setWatchPageColorMode(document, P, e.key, e.mode);
    case "decoration":
      return selectWatchPageDecoration(document, P, e.value).document;
    case "theme":
      return setWatchPageTheme(document, P, e.value);
    case "gradientColors":
      return setWatchPageGradientColors(document, P, e.value);
    case "reset":
      if (e.task !== "page") throw new Error(`unknown page reset ${String(e.task)}`);
      return resetWatchPage(document, P);
    // Part 3f batch 1: the camera edits that move tiles.
    case "cameraDetected":
      return detectWatchCameraRatios(document, P, c.edit.tileId as string, c.edit.ratios as (number | null)[]).document;
    case "cameraMerge":
      return mergeWatchCameraTiles(document, P, c.edit.tileIds as string[], { newId: idsFrom(c.edit.ids) }).document;
    case "cameraCellWeight":
      return setWatchCameraCellWeight(document, P, c.edit.tileId as string, c.edit.index as number, c.edit.delta as number).document;
    case "cameraGroupRemove":
      return removeWatchGroupCamera(document, P, c.edit.tileId as string, c.edit.index as number);
    case "cameraUnmerge":
      return unmergeWatchCameraGroup(document, P, c.edit.tileId as string, { newId: idsFrom(c.edit.ids) }).document;
    default:
      throw new Error(`unknown op ${c.edit.op}`);
  }
}

describe("settings case files written by the phone", () => {
  it("are all here", () => {
    expect(files.length).toBeGreaterThanOrEqual(416);
  });

  for (const file of files) {
    const raw = JSON.parse(readFileSync(join(casesDir, file), "utf8")) as SettingsCase | PageSettingsCase;
    if ("page" in raw) {
      const c = raw;
      it(`${file}: ${c.name}`, () => {
        const before = deepFreeze({
          schemaVersion: 1,
          pages: [
            { id: SYSTEM_PAGE, name: "System", isSystemPage: true, items: [] },
            structuredClone(c.page),
            { id: SMART_PAGE, name: "Smart", dynamicConfig: { rules: [] }, items: [] },
          ],
        }) as WatchPagesDocument;
        const after = applyPageCase(before, c);
        const page = (after.pages as Json[])[1]!;
        expect(page).toEqual(c.expected);
        if (JSON.stringify(c.page) === JSON.stringify(c.expected)) {
          expect(after).toBe(before);
          return;
        }
        expect(after).not.toBe(before);
        const pages = after.pages as Json[];
        const oldPages = before.pages as Json[];
        expect(pages[0]).toBe(oldPages[0]);
        expect(pages[2]).toBe(oldPages[2]);
        // To the byte, as the phone encodes the page.
        expect(JSON.stringify(page)).toBe(JSON.stringify(c.expected));
      });
      continue;
    }
    const c = raw;
    it(`${file}: ${c.name}`, () => {
      const before = docWith(c.tile);
      const after = applyCase(before, c);
      const tile = tileIn(after);
      expect(tile).toEqual(c.expected);
      if (JSON.stringify(c.tile) === JSON.stringify(c.expected)) {
        expect(after).toBe(before);
        return;
      }
      expect(after).not.toBe(before);
      // Only the path is new.
      const pages = after.pages as Json[];
      const oldPages = before.pages as Json[];
      expect(pages[0]).toBe(oldPages[0]);
      expect(pages[2]).toBe(oldPages[2]);
      expect((pages[1]!.items as Json[])[0]).toBe((oldPages[1]!.items as Json[])[0]);
      // To the byte: the phone encodes sorted keys, and a key the panel adds
      // to a tile in that order goes where the phone puts it.
      expect(JSON.stringify(tile)).toBe(JSON.stringify(c.expected));
    });
  }
});

// ── fixtures for the rest ────────────────────────────────────────────────

const fixture = (name: string): Json =>
  (JSON.parse(readFileSync(join(dir, `${name}.json`), "utf8")) as SettingsCase).tile;
const LAMP = fixture("label-set");
const LAMP_ID = LAMP.id as string;
const tileOf = (patch: Json): Json => ({ ...structuredClone(LAMP), ...patch });

function edits(tile: Json) {
  const doc = docWith(tile);
  const id = tile.id as string;
  return { doc, id, read: (d: WatchPagesDocument) => tileIn(d) };
}

// ── refusals and no-ops ──────────────────────────────────────────────────

describe("refusals return the document as given", () => {
  const lamp = edits(LAMP);
  const doc = lamp.doc;
  const T = LAMP_ID;

  it("for a page or tile that cannot be edited", () => {
    expect(setWatchTileShowLabel(doc, "nope", T, false)).toBe(doc);
    expect(setWatchTileShowLabel(doc, SYSTEM_PAGE, T, false)).toBe(doc);
    expect(setWatchTileShowLabel(doc, SMART_PAGE, T, false)).toBe(doc);
    expect(setWatchTileShowLabel(doc, PAGE, "nope", false)).toBe(doc);
    // The id is matched without regard to case.
    expect(setWatchTileShowLabel(doc, PAGE.toLowerCase(), T.toLowerCase(), false)).not.toBe(doc);
  });

  it("for values of the wrong type", () => {
    const bad = "x" as unknown as boolean;
    expect(setWatchTileShowLabel(doc, PAGE, T, bad)).toBe(doc);
    expect(setWatchTileIconShadow(doc, PAGE, T, bad)).toBe(doc);
    expect(setWatchTileTextShadow(doc, PAGE, T, bad)).toBe(doc);
    expect(setWatchTileHideWhenOff(doc, PAGE, T, bad)).toBe(doc);
    expect(setWatchTileAskBeforeRunning(doc, PAGE, T, bad)).toBe(doc);
    expect(setWatchTileIcon(doc, PAGE, T, 3 as unknown as string)).toBe(doc);
    expect(setWatchTileLabel(doc, PAGE, T, null as unknown as string)).toBe(doc);
  });

  it("for colors the field cannot hold", () => {
    for (const bad of ["#12345", "red", "yellow", "#FFC145AA", "GRADIENT|#FFC145", "GRADIENT|#FFC145|blue", "gradient|#FFC145|#000000"]) {
      expect(setWatchTileColor(doc, PAGE, T, bad)).toBe(doc);
      expect(setWatchTileLabelColor(doc, PAGE, T, bad)).toBe(doc);
    }
    expect(setWatchTileLabelColor(doc, PAGE, T, "#RAINBOW")).toBe(doc);
    expect(setWatchTileColorMode(doc, PAGE, T, "hsl" as "solid", gradientOf)).toBe(doc);
  });

  it("for sizes out of range", () => {
    for (const bad of [3, 3.4, 16.5, 17, Number.NaN, Infinity]) expect(setWatchTileFontSize(doc, PAGE, T, bad)).toBe(doc);
    // A 6 by 4 tile with a label tops out at 48.6: up to 49 stores that.
    for (const bad of [7, 7.4, 49.5, 50, Number.NaN]) expect(setWatchTileIconSize(doc, PAGE, T, bad)).toBe(doc);
    expect(tileIn(setWatchTileIconSize(doc, PAGE, T, 48.4)).iconSizeOverride).toBe(48);
    expect(tileIn(setWatchTileIconSize(doc, PAGE, T, 48.6)).iconSizeOverride).toBe(48.6);
    expect(tileIn(setWatchTileIconSize(doc, PAGE, T, 49)).iconSizeOverride).toBe(48.6);
    expect(tileIn(setWatchTileFontSize(doc, PAGE, T, 3.6)).labelFontSizeOverride).toBe(4);
  });

  it("for menu values the phone does not have", () => {
    expect(setWatchTileFontWeight(doc, PAGE, T, "heavy")).toBe(doc);
    expect(setWatchTileFontDesign(doc, PAGE, T, "comic")).toBe(doc);
    expect(setWatchTileTapAnimation(doc, PAGE, T, "wobble")).toBe(doc);
  });

  it("for single tap actions the kind does not offer", () => {
    expect(setWatchTileSingleTap(doc, PAGE, T, "nextTrack")).toBe(doc);
    expect(setWatchTileSingleTap(doc, PAGE, T, "triggerEntity")).toBe(doc);
    expect(setWatchTileSingleTap(doc, PAGE, T, "bogus")).toBe(doc);
    // A library action only on its own kind, where it needs no pick.
    expect(setWatchTileSingleTap(doc, PAGE, T, "httpAction")).toBe(doc);
    expect(setWatchTileSingleTap(doc, PAGE, T, "runMacro")).toBe(doc);
    const http = edits(tileOf({ entityId: "http_action.C3A0E000-0000-4000-8000-000000000070" }));
    expect(http.read(setWatchTileSingleTap(http.doc, PAGE, http.id, "httpAction")).singleTapAction).toBe("httpAction");
    expect(setWatchTileSingleTap(http.doc, PAGE, http.id, "runMacro")).toBe(http.doc);
    expect(http.read(setWatchTileSingleTap(http.doc, PAGE, http.id, "none")).singleTapAction).toBe("none");
    const macro = edits(tileOf({ entityId: "macro.C3A0E000-0000-4000-8000-000000000071" }));
    expect(macro.read(setWatchTileSingleTap(macro.doc, PAGE, macro.id, "runMacro")).singleTapAction).toBe("runMacro");
    expect(setWatchTileSingleTap(macro.doc, PAGE, macro.id, "httpAction")).toBe(macro.doc);
    const page = edits(tileOf({ entityId: "page.C3A0E000-0000-4000-8000-000000000050" }));
    expect(setWatchTileSingleTap(page.doc, PAGE, page.id, "toggle")).toBe(page.doc);
    expect(setWatchTileSingleTap(page.doc, PAGE, page.id, null)).toBe(page.doc);
  });

  it("for hold and slide values not offered", () => {
    expect(setWatchTileHoldSlide(doc, PAGE, T, "up", "runMacro")).toBe(doc);
    expect(setWatchTileHoldSlide(doc, PAGE, T, "up", "httpAction")).toBe(doc);
    expect(setWatchTileHoldSlide(doc, PAGE, T, "up", "nextTrack")).toBe(doc);
    expect(setWatchTileHoldSlide(doc, PAGE, T, "sideways" as WatchSlideDirection, "toggle")).toBe(doc);
    const spacer = edits(tileOf({ entityId: "spacer.C3A0E000-0000-4000-8000-000000000071" }));
    expect(setWatchTileHoldSlide(spacer.doc, PAGE, spacer.id, "up", "none")).toBe(spacer.doc);
    expect(clearWatchTileHoldSlide(spacer.doc, PAGE, spacer.id)).toBe(spacer.doc);
  });

  it("for trigger targets and modes not offered", () => {
    // No Trigger Entity on that direction.
    expect(setWatchTileHoldSlideTarget(doc, PAGE, T, "left", "scene.movie_night")).toBe(doc);
    const awaiting = edits(tileOf({ holdSlideActions: ["left", "triggerEntity"] }));
    const d = awaiting.doc;
    expect(setWatchTileHoldSlideTarget(d, PAGE, T, "left", "sensor.temperature")).toBe(d);
    expect(setWatchTileHoldSlideTarget(d, PAGE, T, "left", "scene.")).toBe(d);
    expect(setWatchTileHoldSlideTarget(d, PAGE, T, "left", "scene")).toBe(d);
    // No target yet: no mode to change.
    expect(setWatchTileHoldSlideTargetMode(d, PAGE, T, "left", "activate")).toBe(d);
    const targeted = setWatchTileHoldSlideTarget(d, PAGE, T, "left", "light.hall", "Hall");
    expect(awaiting.read(targeted).holdSlideTriggerTargets).toEqual([
      "left",
      { entityId: "light.hall", friendlyName: "Hall", mode: "toggle" },
    ]);
    expect(setWatchTileHoldSlideTargetMode(targeted, PAGE, T, "left", "activate")).toBe(targeted);
    expect(setWatchTileHoldSlideTargetMode(targeted, PAGE, T, "left", "bogus")).toBe(targeted);
    expect(awaiting.read(setWatchTileHoldSlideTargetMode(targeted, PAGE, T, "left", "turnOff")).holdSlideTriggerTargets).toEqual([
      "left",
      { entityId: "light.hall", friendlyName: "Hall", mode: "turnOff" },
    ]);
  });

  it("for settings the kind does not show", () => {
    expect(setWatchTileSkipConditions(doc, PAGE, T, true)).toBe(doc);
    const sensor = edits(tileOf({ entityId: "sensor.temperature" }));
    expect(setWatchTileDimWhenOff(sensor.doc, PAGE, sensor.id, false)).toBe(sensor.doc);
    expect(setWatchHeaderStyle(doc, PAGE, T, "label")).toBe(doc);
    expect(setWatchHeaderLabel(doc, PAGE, T, "x")).toBe(doc);
    expect(setWatchHeaderTextSize(doc, PAGE, T, 12)).toBe(doc);
    expect(setWatchHeaderGlow(doc, PAGE, T, 0.5)).toBe(doc);
    expect(setWatchHeaderColor(doc, PAGE, T, "#7CC4E8")).toBe(doc);
    expect(setWatchPageLinkTarget(doc, PAGE, T, { id: PAGE, name: "x" })).toBe(doc);
  });

  it("for header values out of range", () => {
    const header = edits(fixture("header-label-set"));
    const d = header.doc;
    expect(setWatchHeaderStyle(d, PAGE, header.id, "dots" as "line")).toBe(d);
    for (const bad of [7, 7.4, 20.5, 21, Number.NaN]) expect(setWatchHeaderTextSize(d, PAGE, header.id, bad)).toBe(d);
    for (const bad of [-0.1, 1.1, Number.NaN]) expect(setWatchHeaderGlow(d, PAGE, header.id, bad)).toBe(d);
    for (const bad of ["GRADIENT|#FFC145|#3BBED9", "#RAINBOW", "teal"]) expect(setWatchHeaderColor(d, PAGE, header.id, bad)).toBe(d);
    expect(header.read(setWatchHeaderGlow(d, PAGE, header.id, 1)).entityId).toBe("divider.label.custom.g100");
    expect(header.read(setWatchHeaderTextSize(d, PAGE, header.id, null)).labelFontSizeOverride).toBeUndefined();
  });

  it("for page link targets the phone would not pick", () => {
    const link = edits(fixture("page-link-retarget-label-follows"));
    const d = link.doc;
    const status = edits(tileOf({ entityId: "status_page.C3A0E000-0000-4000-8000-000000000050" }));
    expect(setWatchPageLinkTarget(status.doc, PAGE, status.id, { id: "C3A0E000-0000-4000-8000-000000000051", name: "A" })).toBe(
      status.doc,
    );
    // Its own page, the target it has, a blank id.
    expect(setWatchPageLinkTarget(d, PAGE, link.id, { id: PAGE.toLowerCase(), name: "Living" }, "Upstairs")).toBe(d);
    expect(setWatchPageLinkTarget(d, PAGE, link.id, { id: "C3A0E000-0000-4000-8000-000000000050", name: "U" }, "Upstairs")).toBe(d);
    expect(setWatchPageLinkTarget(d, PAGE, link.id, { id: "", name: "U" })).toBe(d);
    // A lower case id is written in upper case.
    const lower = setWatchPageLinkTarget(d, PAGE, link.id, { id: "c3a0e000-0000-4000-8000-000000000051", name: "Attic" }, "Upstairs");
    expect(link.read(lower).entityId).toBe("page.C3A0E000-0000-4000-8000-000000000051");
    expect(link.read(lower).customLabel).toBe("Attic");
  });

  it("when the color mode switch has nothing to do", () => {
    const noColor = edits(Object.fromEntries(Object.entries(LAMP).filter(([k]) => k !== "color")));
    expect(setWatchTileColorMode(noColor.doc, PAGE, noColor.id, "gradient", gradientOf)).toBe(noColor.doc);
    expect(setWatchTileColorMode(doc, PAGE, T, "solid", gradientOf)).toBe(doc);
    const named = edits(tileOf({ color: "yellow" }));
    expect(setWatchTileColorMode(named.doc, PAGE, named.id, "gradient", gradientOf)).toBe(named.doc);
  });
});

describe("no-ops return the document as given", () => {
  const { doc } = edits(
    tileOf({
      singleTapAction: "openControl",
      holdSlideActions: ["down", "none"],
      requiresConfirmation: true,
      hideWhenInactive: true,
      dimWhenOff: false,
      labelColorHex: "#FFD60A",
    }),
  );
  const T = LAMP_ID;
  it("for every setter given the stored value", () => {
    expect(setWatchTileIcon(doc, PAGE, T, "lightbulb")).toBe(doc);
    expect(setWatchTileIconDefault(doc, PAGE, T, { icon: "lightbulb", color: "#FFC145" })).toBe(doc);
    expect(setWatchTileColor(doc, PAGE, T, "#ffc145")).toBe(doc);
    expect(setWatchTileIconSize(doc, PAGE, T, null)).toBe(doc);
    expect(setWatchTileIconShadow(doc, PAGE, T, false)).toBe(doc);
    expect(setWatchTileDimWhenOff(doc, PAGE, T, false)).toBe(doc);
    expect(setWatchTileTapAnimation(doc, PAGE, T, "replace")).toBe(doc);
    expect(setWatchTileLabel(doc, PAGE, T, "Desk Lamp")).toBe(doc);
    expect(setWatchTileShowLabel(doc, PAGE, T, true)).toBe(doc);
    expect(setWatchTileFontSize(doc, PAGE, T, null)).toBe(doc);
    expect(setWatchTileFontWeight(doc, PAGE, T, "light")).toBe(doc);
    expect(setWatchTileFontDesign(doc, PAGE, T, "default")).toBe(doc);
    expect(setWatchTileTextShadow(doc, PAGE, T, true)).toBe(doc);
    expect(setWatchTileLabelColor(doc, PAGE, T, "#FFD60A")).toBe(doc);
    expect(setWatchTileSingleTap(doc, PAGE, T, "openControl")).toBe(doc);
    expect(setWatchTileHoldSlide(doc, PAGE, T, "down", "none")).toBe(doc);
    expect(setWatchTileHoldSlide(doc, PAGE, T, "up", null)).toBe(doc);
    expect(setWatchTileAskBeforeRunning(doc, PAGE, T, true)).toBe(doc);
    expect(setWatchTileHideWhenOff(doc, PAGE, T, true)).toBe(doc);
  });
});

// ── what the setters write ───────────────────────────────────────────────

describe("setters keep the tile's other keys", () => {
  it("unknown keys keep their values and places; a new key goes at the end", () => {
    const tile = { futureKey: { nested: [1, 2] }, ...structuredClone(LAMP), zzLater: "kept" };
    const t = edits(tile);
    const after = t.read(setWatchTileLabel(t.doc, PAGE, LAMP_ID, "Reading"));
    expect(Object.keys(after)).toEqual(Object.keys(tile));
    expect(after.futureKey).toBe((tileIn(t.doc) as Json).futureKey);
    const added = t.read(setWatchTileSingleTap(t.doc, PAGE, LAMP_ID, "none"));
    expect(Object.keys(added)).toEqual([...Object.keys(tile), "singleTapAction"]);
    const removed = t.read(setWatchTileFontWeight(t.doc, PAGE, LAMP_ID, "regular"));
    expect(Object.keys(removed)).toEqual(Object.keys(tile).filter((k) => k !== "labelFontWeight"));
    expect(Object.hasOwn(removed, "labelFontWeight")).toBe(false);
  });

  it("the label field may remove the label instead of writing it empty", () => {
    const t = edits(LAMP);
    expect(t.read(setWatchTileLabel(t.doc, PAGE, LAMP_ID, "")).customLabel).toBe("");
    const removed = t.read(setWatchTileLabel(t.doc, PAGE, LAMP_ID, "", { emptyRemoves: true }));
    expect(Object.hasOwn(removed, "customLabel")).toBe(false);
    expect(t.read(setWatchTileLabel(t.doc, PAGE, LAMP_ID, "x", { emptyRemoves: true })).customLabel).toBe("x");
    const absent = edits(Object.fromEntries(Object.entries(LAMP).filter(([k]) => k !== "customLabel")));
    expect(setWatchTileLabel(absent.doc, PAGE, LAMP_ID, "", { emptyRemoves: true })).toBe(absent.doc);
  });

  it("colors are written in upper case with a #", () => {
    const t = edits(LAMP);
    expect(t.read(setWatchTileColor(t.doc, PAGE, LAMP_ID, "5fa5e6")).color).toBe("#5FA5E6");
    expect(t.read(setWatchTileColor(t.doc, PAGE, LAMP_ID, "GRADIENT|#5fa5e6|c35153")).color).toBe("GRADIENT|#5FA5E6|#C35153");
    expect(t.read(setWatchTileColor(t.doc, PAGE, LAMP_ID, "#rainbow")).color).toBe("#RAINBOW");
    expect(t.read(setWatchTileLabelColor(t.doc, PAGE, LAMP_ID, "GRADIENT|#5FA5E6|#C35153")).labelColorHex).toBe(
      "GRADIENT|#5FA5E6|#C35153",
    );
  });

  it("the default icon removes keys the kind has no default for", () => {
    const header = edits(fixture("header-color"));
    const after = header.read(setWatchTileIconDefault(header.doc, PAGE, header.id, { icon: null, color: "#CCD8E6" }));
    expect(Object.hasOwn(after, "icon")).toBe(false);
    expect(after.color).toBe("#CCD8E6");
    const spacer = edits(tileOf({ entityId: "spacer.X", icon: "star" }));
    const cleared = spacer.read(setWatchTileIconDefault(spacer.doc, PAGE, spacer.id, { icon: null, color: null }));
    expect(Object.hasOwn(cleared, "icon") || Object.hasOwn(cleared, "color")).toBe(false);
    expect(setWatchTileIconDefault(spacer.doc, PAGE, spacer.id, { icon: null, color: "teal" })).toBe(spacer.doc);
  });

  it("the header glow ports the phone's dot part rules", () => {
    const header = edits({ ...fixture("header-label-set"), entityId: "divider.line.custom.g50" });
    const read = (d: WatchPagesDocument) => header.read(d).entityId;
    expect(read(setWatchHeaderGlow(header.doc, PAGE, header.id, 0.05))).toBe("divider.line.custom.g5");
    expect(read(setWatchHeaderStyle(header.doc, PAGE, header.id, "label"))).toBe("divider.label.custom.g50");
    expect(setWatchHeaderGlow(header.doc, PAGE, header.id, 0.5)).toBe(header.doc);
  });
});

// ── hold and slide arrays ────────────────────────────────────────────────

describe("hold and slide arrays", () => {
  it("parse in any order and write up, down, left, right", () => {
    const map = readWatchSlideMap(["right", "toggle", "up", "none"])!;
    expect([...map.entries()]).toEqual([
      ["right", "toggle"],
      ["up", "none"],
    ]);
    expect(writeWatchSlideMap(map)).toEqual(["up", "none", "right", "toggle"]);
    expect(readWatchSlideMap(undefined)!.size).toBe(0);
    expect(readWatchSlideMap(null)!.size).toBe(0);
  });

  it("refuse an array that does not parse", () => {
    expect(readWatchSlideMap(["up"])).toBeUndefined();
    expect(readWatchSlideMap(["north", "toggle"])).toBeUndefined();
    expect(readWatchSlideMap({ up: "toggle" })).toBeUndefined();
  });

  it("a setter leaves an unparsable array alone and refuses", () => {
    for (const bad of [["up"], ["north", "toggle"], { up: "toggle" }]) {
      const t = edits(tileOf({ holdSlideActions: bad }));
      expect(setWatchTileHoldSlide(t.doc, PAGE, t.id, "down", "toggle")).toBe(t.doc);
      expect(clearWatchTileHoldSlide(t.doc, PAGE, t.id)).toBe(t.doc);
      expect(watchHoldSlideSettings(tileIn(t.doc)).parses).toBe(false);
      const targets = edits(tileOf({ holdSlideActions: ["left", "triggerEntity"], holdSlideTriggerTargets: bad }));
      expect(setWatchTileHoldSlide(targets.doc, PAGE, targets.id, "left", "toggle")).toBe(targets.doc);
      expect(setWatchTileHoldSlideTarget(targets.doc, PAGE, targets.id, "left", "light.hall")).toBe(targets.doc);
      expect(clearWatchTileHoldSlide(targets.doc, PAGE, targets.id)).toBe(targets.doc);
    }
  });

  it("a change rewrites the array in direction order and removes it when empty", () => {
    const t = edits(tileOf({ holdSlideActions: ["right", "toggle", "up", "none"] }));
    const added = t.read(setWatchTileHoldSlide(t.doc, PAGE, t.id, "left", "openControl"));
    expect(added.holdSlideActions).toEqual(["up", "none", "left", "openControl", "right", "toggle"]);
    let d = setWatchTileHoldSlide(t.doc, PAGE, t.id, "up", null);
    d = setWatchTileHoldSlide(d, PAGE, t.id, "right", null);
    expect(Object.hasOwn(t.read(d), "holdSlideActions")).toBe(false);
  });

  it("an HTTP direction keeps its target only while it stays an HTTP action, and banner keys stay", () => {
    const t = edits(
      tileOf({
        holdSlideActions: ["right", "httpAction"],
        holdSlideHTTPActionTargets: ["right", "C3A0E000-0000-4000-8000-000000000070"],
        holdSlideHTTPActionShowBanner: ["right", false],
      }),
    );
    // A stored library action is offered for its own direction only.
    const settings = watchHoldSlideSettings(tileIn(t.doc));
    expect(settings.directions[3]!.offered.map((c) => c.value)).toContain("httpAction");
    expect(settings.directions[0]!.offered.map((c) => c.value)).not.toContain("httpAction");
    expect(setWatchTileHoldSlide(t.doc, PAGE, t.id, "right", "httpAction")).toBe(t.doc);
    const after = t.read(setWatchTileHoldSlide(t.doc, PAGE, t.id, "right", "none"));
    expect(after.holdSlideActions).toEqual(["right", "none"]);
    expect(Object.hasOwn(after, "holdSlideHTTPActionTargets")).toBe(false);
    expect(after.holdSlideHTTPActionShowBanner).toEqual(["right", false]);
    const cleared = t.read(clearWatchTileHoldSlide(t.doc, PAGE, t.id));
    expect(cleared.holdSlideHTTPActionShowBanner).toEqual(["right", false]);
  });

  it("a trigger target keeps a stale mode and unknown keys, and drops a friendly name not given", () => {
    const t = edits(
      tileOf({
        holdSlideActions: ["left", "triggerEntity"],
        holdSlideTriggerTargets: ["left", { entityId: "scene.movie_night", friendlyName: "Movie Night", mode: "activate", extra: 1 }],
      }),
    );
    const after = t.read(setWatchTileHoldSlideTarget(t.doc, PAGE, t.id, "left", "light.hall"));
    expect(after.holdSlideTriggerTargets).toEqual(["left", { entityId: "light.hall", mode: "activate", extra: 1 }]);
    const info = watchHoldSlideSettings(after).directions[2]!;
    expect(info.target).toEqual({ entityId: "light.hall", mode: "activate", friendlyName: undefined, modeOffered: false });
    expect(setWatchTileHoldSlideTarget(t.doc, PAGE, t.id, "left", "scene.movie_night", "Movie Night")).toBe(t.doc);
  });
});

// ── readers ──────────────────────────────────────────────────────────────

const KINDS = (tileActions as unknown as { kinds: Record<string, Json> }).kinds;
const reader = (entityId: string, patch: Json = {}): WatchPageTile => tileOf({ entityId, ...patch });

describe("readers follow the table", () => {
  const cases: [string, string][] = [
    ["light.desk_lamp", "light"],
    ["cover.blinds", "cover"],
    ["automation.porch", "automation"],
    ["sensor.temperature", "sensor"],
    ["page.C3A0E000-0000-4000-8000-000000000050", "page"],
    ["divider.line.custom", "divider"],
    ["spacer.C3A0E000-0000-4000-8000-000000000071", "spacer"],
    ["frobnicator.thing", "*"],
    ["nodot", "*"],
  ];
  for (const [entityId, kind] of cases) {
    it(`${entityId} reads as ${kind}`, () => {
      const tile = reader(entityId);
      const entry = KINDS[kind]!;
      expect(watchTileKindName(entityId)).toBe(kind);
      expect(watchTileKindEntry(tile)).toBe(entry);
      const single = watchSingleTapSettings(tile);
      expect(single.picker).toBe(entry.tapPicker);
      expect(single.offered.map((c) => c.value)).toEqual((entry.tapActions as string[]).filter((a) => !isWatchLibraryAction(a)));
      expect(single.offered.map((c) => c.label)).toEqual(
        single.offered.map((c) => (entry.labels as Record<string, string>)[c.value] ?? c.value),
      );
      expect(single.stored).toBeUndefined();
      expect(single.absent).toBe(entry.absentTap);
      const hold = watchHoldSlideSettings(tile);
      expect(hold.picker).toBe(entry.holdSlidePicker);
      expect(hold.parses).toBe(true);
      expect(hold.anyStored).toBe(false);
      expect(hold.directions.map((d) => d.direction)).toEqual(["up", "down", "left", "right"]);
      for (const d of hold.directions) {
        expect(d.default).toBe((entry.holdSlideDefaults as Record<string, string>)[d.direction]);
        expect(d.offered.map((c) => c.value)).toEqual(
          (entry.holdSlideActions as string[]).filter((a) => !isWatchLibraryAction(a)),
        );
      }
      const action = watchTileActionSettings(tile);
      expect(action.askBeforeRunning).toEqual({
        stored: undefined,
        default: entry.defaultRequiresConfirmation,
        value: entry.defaultRequiresConfirmation,
      });
      expect(action.skipConditions).toEqual({ shown: entry.skipConditions, value: null });
      expect(action.hideWhenOff).toBe(false);
      expect(watchTileIconSettings(tile).dimWhenOff).toEqual({ applies: entry.dimWhenOff, value: true });
      expect(watchHeaderSettings(tile) === undefined).toBe(kind !== "divider");
      expect(watchPageLinkTarget(tile) === undefined).toBe(kind !== "page");
    });
  }

  it("a light", () => {
    const tile = reader("light.desk_lamp");
    const single = watchSingleTapSettings(tile);
    expect(single.offered).toEqual([
      { value: "toggle", label: "Toggle Light" },
      { value: "openControl", label: "Open Light Controls" },
      { value: "none", label: "None" },
    ]);
    expect(single.resolved).toBe("toggle");
    expect(single.storedNotOffered).toBe(false);
    const down = watchHoldSlideSettings(tile).directions[1]!;
    expect(down).toMatchObject({ default: "openControl", resolved: "openControl", resolvedLabel: "Open Light Controls" });
    expect(down.offered.map((c) => c.value)).toEqual(["toggle", "openControl", "triggerEntity", "none"]);
    expect(watchHoldSlideSettings(tile).directions[0]).toMatchObject({ default: undefined, resolved: "none" });
    expect(watchTileIconSettings(tile).dimWhenOff.applies).toBe(true);
  });

  it("stored values the panel does not offer are shown, not offered", () => {
    const stale = watchSingleTapSettings(reader("light.desk_lamp", { singleTapAction: "nextTrack" }));
    expect(stale).toMatchObject({ stored: "nextTrack", storedNotOffered: true, resolved: "toggle", storedLabel: "Next Track" });
    const unknown = watchSingleTapSettings(reader("light.desk_lamp", { singleTapAction: "teleport" }));
    expect(unknown).toMatchObject({ storedNotOffered: true, resolved: "toggle", storedLabel: "Sync Needed" });
    // Run HTTP Action on its own kind is offered: the tile is the target.
    const http = watchSingleTapSettings(reader("http_action.C3A0E000-0000-4000-8000-000000000070", { singleTapAction: "httpAction" }));
    expect(http).toMatchObject({ storedNotOffered: false, resolved: "httpAction", absent: "httpAction" });
    expect(http.offered.map((c) => c.value)).toEqual(["httpAction", "none"]);
    const macroTap = watchSingleTapSettings(reader("macro.C3A0E000-0000-4000-8000-000000000071"));
    expect(macroTap.offered.map((c) => c.value)).toEqual(["runMacro", "none"]);
    const macro = watchHoldSlideSettings(reader("light.desk_lamp", { holdSlideActions: ["right", "runMacro", "up", "teleport"] }));
    expect(macro.directions[3]).toMatchObject({ stored: "runMacro", storedNotOffered: true, resolved: "none" });
    expect(macro.directions[0]).toMatchObject({ stored: "teleport", storedNotOffered: true, resolvedLabel: "Sync Needed" });
    expect(macro.anyStored).toBe(true);
  });

  it("a trigger direction without its target reads as Sync Needed", () => {
    const tile = reader("light.desk_lamp", { holdSlideActions: ["left", "triggerEntity"] });
    expect(watchHoldSlideSettings(tile).directions[2]).toMatchObject({ resolved: "triggerEntity", resolvedLabel: "Sync Needed" });
    const set = reader("light.desk_lamp", fixture("hold-slide-trigger-mode"));
    const left = watchHoldSlideSettings(set).directions[2]!;
    expect(left.resolvedLabel).toBe("Trigger Entity");
    expect(left.target).toEqual({ entityId: "script.good_morning", mode: "run", friendlyName: "Good Morning", modeOffered: true });
  });

  it("a cover, an automation, a sensor, a lock", () => {
    expect(watchSingleTapSettings(reader("cover.blinds")).offered.map((c) => c.label)).toEqual([
      "Toggle Cover",
      "Open Cover Controls",
      "Open",
      "Close",
      "Stop",
      "None",
    ]);
    expect(watchSingleTapSettings(reader("cover.blinds")).resolved).toBe("openControl");
    expect(watchTileActionSettings(reader("automation.porch", { automationSkipConditionOverride: false })).skipConditions).toEqual({
      shown: true,
      value: false,
    });
    expect(watchSingleTapSettings(reader("sensor.temperature")).offered.map((c) => c.label)).toEqual(["Open Details", "None"]);
    expect(watchTileIconSettings(reader("sensor.temperature")).dimWhenOff.applies).toBe(false);
    expect(watchTileActionSettings(reader("lock.back_door")).askBeforeRunning).toEqual({ stored: undefined, default: true, value: true });
    expect(watchTileActionSettings(reader("lock.back_door", { requiresConfirmation: false })).askBeforeRunning.value).toBe(false);
  });

  it("a page link, a header, a spacer, an unknown domain", () => {
    const page = reader("page.C3A0E000-0000-4000-8000-000000000050");
    expect(watchSingleTapSettings(page).picker).toBe(false);
    expect(watchHoldSlideSettings(page).directions[0]!.offered.map((c) => c.value)).toEqual(["triggerEntity", "none"]);
    expect(watchPageLinkTarget(page)).toEqual({ kind: "page", targetId: "C3A0E000-0000-4000-8000-000000000050" });
    expect(watchPageLinkTarget(reader("show_page.abc"))).toEqual({ kind: "show_page", targetId: "abc" });
    const header = reader("divider.label.custom.g35", { customLabel: "Lights", labelFontSizeOverride: 12, color: "#CCD8E6" });
    expect(watchHeaderSettings(header)).toEqual({
      style: "label",
      domain: "custom",
      label: "Lights",
      textSize: 12,
      glow: 0.35,
      color: "#CCD8E6",
    });
    expect(watchSingleTapSettings(reader("spacer.x")).picker).toBe(false);
    expect(watchHoldSlideSettings(reader("spacer.x")).picker).toBe(false);
    const other = reader("frobnicator.thing");
    expect(watchSingleTapSettings(other).offered.map((c) => c.label)).toEqual(["Toggle", "Open Controls", "None"]);
  });

  it("text and icon settings", () => {
    expect(watchTileTextSettings(reader("light.desk_lamp"))).toEqual({
      label: "Desk Lamp",
      showLabel: true,
      fontSize: undefined,
      fontWeight: "light",
      fontDesign: "default",
      textShadow: true,
      labelColor: undefined,
    });
    const bare = { id: "X", entityId: "light.x" };
    expect(watchTileTextSettings(bare)).toMatchObject({ fontWeight: "regular", fontDesign: "default", showLabel: true });
    expect(watchTileIconSettings(bare)).toMatchObject({ icon: undefined, iconShadow: false, tapAnimation: "replace" });
    expect(watchTileIconSettings(bare).iconSizeMax).toBeCloseTo(48.6, 10);
    expect(watchTileIconSettings(reader("light.x", { color: "GRADIENT|#FFC145|#3BBED9", iconSizeOverride: 24 }))).toMatchObject({
      colorMode: "gradient",
      iconSize: 24,
    });
  });

  it("the trigger target domains and modes", () => {
    expect(WATCH_TRIGGER_TARGET_DOMAINS).toContain("scene");
    expect(WATCH_TRIGGER_TARGET_DOMAINS).not.toContain("sensor");
    expect(watchTriggerModes("scene")).toEqual([
      { value: "activate", label: "Activate" },
      { value: "refresh", label: "Refresh" },
    ]);
    expect(watchTriggerModes("light").map((m) => m.value)).toEqual(["toggle", "turnOn", "turnOff", "refresh"]);
    expect(watchTriggerModes("frobnicator").map((m) => m.value)).toEqual(["toggle", "refresh"]);
    expect(isWatchTriggerTarget("light.hall")).toBe(true);
    expect(isWatchTriggerTarget("sensor.hall")).toBe(false);
    expect(isWatchTriggerTarget("light.")).toBe(false);
    expect(isWatchTriggerTarget(".hall")).toBe(false);
  });

  it("the menus come from the table", () => {
    expect(WATCH_LABEL_FONT_WEIGHTS.map((c) => c.label)).toEqual(["Light", "Regular", "Medium", "Semibold", "Bold"]);
    expect(WATCH_LABEL_FONT_DESIGNS.map((c) => c.value)).toEqual(["default", "rounded", "monospaced", "serif"]);
    expect(WATCH_ICON_TAP_ANIMATIONS[0]).toEqual({ value: "replace", label: "Morph" });
    expect(WATCH_ICON_TAP_ANIMATIONS).toHaveLength(10);
    expect(watchTapActionLabel(KINDS.template as never, "toggle")).toBe("Refresh");
    expect(watchTapActionLabel(KINDS["*"] as never, "teleport")).toBe("Sync Needed");
  });
});

describe("the keys and values match page-keys.json", () => {
  const types = (pageKeys as unknown as { types: { tile: { keys: Record<string, Json> } } }).types;
  const enums = (pageKeys as unknown as { enums: Record<string, string[]> }).enums;
  it("every key a setter writes is a tile key", () => {
    for (const key of WATCH_TILE_SETTING_KEYS) expect(Object.hasOwn(types.tile.keys, key), key).toBe(true);
  });
  it("every table value is one the phone decodes", () => {
    const table = tileActions as unknown as {
      actions: { raw: string }[];
      triggerEntity: { modes: Record<string, string[]> };
    };
    for (const a of table.actions) expect(enums.TileTapAction).toContain(a.raw);
    for (const modes of Object.values(table.triggerEntity.modes)) for (const m of modes) expect(enums.TriggerMode).toContain(m);
    expect(WATCH_LABEL_FONT_WEIGHTS.map((c) => c.value)).toEqual(enums.FontWeight);
    expect(WATCH_LABEL_FONT_DESIGNS.map((c) => c.value)).toEqual(enums.FontDesign);
    expect(WATCH_ICON_TAP_ANIMATIONS.map((c) => c.value)).toEqual(enums.IconTapAnimation);
    expect([...WATCH_SLIDE_DIRECTIONS]).toEqual(enums.SlideDirection);
    expect(types.tile.keys.holdSlideActions!.type).toBe("slideMap");
  });
});

// ── helpers ──────────────────────────────────────────────────────────────

describe("watchTileMaxIconSize", () => {
  const size = (colSpan: number, rowSpan: number, showLabel = true) =>
    watchTileMaxIconSize({ colSpan, rowSpan, showLabel });
  it("is the phone's maxIconSizeOverride", () => {
    expect(size(6, 4)).toBeCloseTo(48.6, 10); // height 90 x 0.54
    expect(size(6, 4, false)).toBeCloseTo(61.2, 10); // height 90 x 0.68
    expect(size(3, 3)).toBeCloseTo(36.18, 10); // 67 x 0.54
    expect(size(12, 1)).toBeCloseTo(14.28, 10); // too short for a label: 21 x 0.68
    expect(size(1, 1)).toBeCloseTo(14.28, 10);
    expect(size(2, 12)).toBeCloseTo(28.16, 10); // narrow: width 44 x 0.64
    expect(size(1, 2)).toBeCloseTo(13.44, 10); // height 44, width 21 x 0.64
    expect(watchTileMaxIconSize({})).toBeCloseTo(48.6, 10); // absent spans read as 6 by 4
    expect(watchTileMaxIconSize({ colSpan: 1, rowSpan: 2, showLabel: false })).toBeCloseTo(14.7, 10);
  });
  it("is never under 8", () => {
    expect(size(1, 1)).toBeGreaterThanOrEqual(8);
  });
});

describe("watchStorageIconName", () => {
  const symbols = new Set(["lightbulb", "person.checkmark", "drop", "rectangle.on.rectangle"]);
  const exists = (s: string) => symbols.has(s);
  it("stores the base name when it exists", () => {
    expect(watchStorageIconName("lightbulb.fill", exists)).toBe("lightbulb");
    expect(watchStorageIconName("drop.fill", exists)).toBe("drop");
    // Every `.fill` goes, as Swift's replacingOccurrences does.
    expect(watchStorageIconName("person.fill.checkmark", exists)).toBe("person.checkmark");
    expect(watchStorageIconName("rectangle.fill.on.rectangle.fill", exists)).toBe("rectangle.on.rectangle");
  });
  it("keeps a fill only symbol and a name with no fill", () => {
    expect(watchStorageIconName("bolt.fill", exists)).toBe("bolt.fill");
    expect(watchStorageIconName("lamp.desk", exists)).toBe("lamp.desk");
    expect(watchStorageIconName("", exists)).toBe("");
  });
});

describe("watchColorInMode and watchColorMode", () => {
  const seen: string[] = [];
  const spy = (hex: string) => {
    seen.push(hex);
    return gradientOf(hex);
  };
  it("converts solid to gradient through the function", () => {
    expect(watchColorInMode("#FFC145", "gradient", spy)).toBe("GRADIENT|#FFC145|#3BBED9");
    expect(watchColorInMode("ffc145", "gradient", spy)).toBe("GRADIENT|#FFC145|#3BBED9");
    expect(seen).toEqual(["#FFC145", "#FFC145"]);
  });
  it("converts gradient to solid by its first color", () => {
    expect(watchColorInMode("GRADIENT|#EC368D|#2EC931", "solid", spy)).toBe("#EC368D");
    expect(watchColorInMode("GRADIENT|#ec368d|#2EC931", "solid", spy)).toBe("#EC368D");
  });
  it("leaves rainbow, absent, same mode and unreadable colors alone", () => {
    seen.length = 0;
    expect(watchColorInMode("#RAINBOW", "gradient", spy)).toBe("#RAINBOW");
    expect(watchColorInMode(undefined, "gradient", spy)).toBeUndefined();
    expect(watchColorInMode("#FFC145", "solid", spy)).toBe("#FFC145");
    expect(watchColorInMode("GRADIENT|#EC368D|#2EC931", "gradient", spy)).toBe("GRADIENT|#EC368D|#2EC931");
    expect(watchColorInMode("yellow", "gradient", spy)).toBe("yellow");
    expect(seen).toEqual([]);
  });
  it("reads the mode of a stored color", () => {
    expect(watchColorMode("#FFC145")).toBe("solid");
    expect(watchColorMode("GRADIENT|#EC368D|#2EC931")).toBe("gradient");
    expect(watchColorMode("#RAINBOW")).toBe("rainbow");
    expect(watchColorMode(undefined)).toBeUndefined();
    expect(watchColorMode("yellow")).toBeUndefined();
    expect(watchColorMode("GRADIENT|#EC368D")).toBeUndefined();
  });
  it("normalizes per field", () => {
    expect(normalizeWatchColor("#abcdef", "solid")).toBe("#ABCDEF");
    expect(normalizeWatchColor("GRADIENT|#ABCDEF|#000000", "solid")).toBeUndefined();
    expect(normalizeWatchColor("#RAINBOW", "label")).toBeUndefined();
    expect(normalizeWatchColor("#RAINBOW", "tile")).toBe("#RAINBOW");
  });
});

// ── review fixes ─────────────────────────────────────────────────────────

describe("the save's tidy of a trigger with no entity", () => {
  const orphan = (patch: Json) => tileOf({ holdSlideActions: ["left", "triggerEntity"], ...patch });

  it("sets the direction to None and drops its target, as the phone's save does", () => {
    const t = edits(orphan({ holdSlideTriggerTargets: ["left", { entityId: "  ", mode: "toggle" }] }));
    const after = scrubWatchOrphanTriggers(t.doc);
    expect(t.read(after).holdSlideActions).toEqual(["left", "none"]);
    expect(Object.hasOwn(t.read(after), "holdSlideTriggerTargets")).toBe(false);
    // Every page, the system and smart pages' copies too, as the tidy runs
    // over the document that is sent.
    const pages = after.pages as Json[];
    expect(((pages[0]!.items as Json[])[0]!).holdSlideActions).toEqual(["left", "none"]);
    expect(((pages[2]!.items as Json[])[0]!).holdSlideActions).toEqual(["left", "none"]);
  });

  it("covers a direction with no target entry at all, and keeps the others", () => {
    const t = edits(orphan({
      holdSlideActions: ["up", "triggerEntity", "left", "triggerEntity", "down", "toggle"],
      holdSlideTriggerTargets: ["up", { entityId: "light.hall", mode: "toggle" }],
    }));
    const tile = t.read(scrubWatchOrphanTriggers(t.doc));
    expect(tile.holdSlideActions).toEqual(["up", "triggerEntity", "down", "toggle", "left", "none"]);
    expect(tile.holdSlideTriggerTargets).toEqual(["up", { entityId: "light.hall", mode: "toggle" }]);
  });

  it("keeps the identity of everything with nothing to tidy", () => {
    const t = edits(orphan({ holdSlideTriggerTargets: ["left", { entityId: "light.hall", mode: "toggle" }] }));
    expect(scrubWatchOrphanTriggers(t.doc)).toBe(t.doc);
    const loose = edits(orphan({}));
    const after = scrubWatchOrphanTriggers(loose.doc);
    const pages = after.pages as Json[];
    const old = loose.doc.pages as Json[];
    expect((pages[1]!.items as Json[])[0]).toBe((old[1]!.items as Json[])[0]);
    const plain = docWith(structuredClone(OTHER_TILE));
    expect(scrubWatchOrphanTriggers(plain)).toBe(plain);
  });

  it("leaves a tile whose arrays do not parse alone", () => {
    for (const bad of [["left"], { left: "triggerEntity" }]) {
      const a = edits(tileOf({ holdSlideActions: bad }));
      expect(scrubWatchOrphanTriggers(a.doc)).toBe(a.doc);
      const b = edits(orphan({ holdSlideTriggerTargets: bad }));
      expect(scrubWatchOrphanTriggers(b.doc)).toBe(b.doc);
    }
  });
});

describe("icon size at the top of a tile with a fraction", () => {
  // A 6 by 2 tile with a label: 23.76 at most, which the phone's slider
  // stores at its end.
  const small = edits(tileOf({ colSpan: 6, rowSpan: 2, showLabel: true }));

  it("stores the largest size for the next whole number above it", () => {
    expect(watchTileMaxIconSize(small.read(small.doc))).toBeCloseTo(23.76, 10);
    expect(watchTileIconSizeTop(23.76)).toBe(24);
    expect(small.read(setWatchTileIconSize(small.doc, PAGE, LAMP_ID, 24)).iconSizeOverride).toBe(watchTileMaxIconSize(small.read(small.doc)));
    expect(small.read(setWatchTileIconSize(small.doc, PAGE, LAMP_ID, 23)).iconSizeOverride).toBe(23);
    expect(setWatchTileIconSize(small.doc, PAGE, LAMP_ID, 25)).toBe(small.doc);
  });

  it("takes nothing past a whole largest size", () => {
    expect(watchTileIconSizeTop(30)).toBe(30);
    expect(watchTileIconSizeValue(30, 30)).toBe(30);
    expect(watchTileIconSizeValue(30.4, 30)).toBe(30);
    expect(watchTileIconSizeValue(31, 30)).toBeUndefined();
    expect(watchTileIconSizeValue(7.4, 30)).toBeUndefined();
    expect(watchTileIconSizeValue(Number.NaN, 30)).toBeUndefined();
  });
});

describe("hold and slide setters check every array they are about to touch", () => {
  it("refuses Trigger entity while the target array does not parse", () => {
    for (const bad of [["up"], ["north", { entityId: "light.hall", mode: "toggle" }], { up: {} }]) {
      const t = edits(tileOf({ holdSlideTriggerTargets: bad }));
      expect(setWatchTileHoldSlide(t.doc, PAGE, t.id, "up", "triggerEntity")).toBe(t.doc);
      expect(setWatchTileHoldSlide(t.doc, PAGE, t.id, "up", null)).toBe(t.doc);
    }
  });

  it("refuses a target or a mode while the HTTP array does not parse", () => {
    const t = edits(tileOf({
      holdSlideActions: ["left", "triggerEntity"],
      holdSlideTriggerTargets: ["left", { entityId: "light.hall", mode: "toggle" }],
      holdSlideHTTPActionTargets: ["left"],
    }));
    expect(setWatchTileHoldSlideTarget(t.doc, PAGE, t.id, "left", "switch.fan")).toBe(t.doc);
    expect(setWatchTileHoldSlideTargetMode(t.doc, PAGE, t.id, "left", "turnOn")).toBe(t.doc);
    expect(setWatchTileHoldSlide(t.doc, PAGE, t.id, "left", "triggerEntity")).toBe(t.doc);
  });
});

describe("a page with no name", () => {
  const NAMELESS = "C3A0E000-0000-4000-8000-0000000000EE";

  it("is \"Page\", as the phone reads it", () => {
    expect(watchStoredPageName({})).toBe("Page");
    expect(watchStoredPageName({ name: 3 })).toBe("Page");
    expect(watchStoredPageName({ name: "" })).toBe("");
    expect(watchStoredPageName({ name: "Den" })).toBe("Den");
  });

  it("names a new link and a retarget \"Page\"", () => {
    expect(newWatchPageLinkTile({ id: NAMELESS }, undefined).customLabel).toBe("Page");
    const link = edits(tileOf({ entityId: `page.${SMART_PAGE}`, customLabel: "Smart" }));
    const retargeted = link.read(setWatchPageLinkTarget(link.doc, PAGE, link.id, { id: NAMELESS }, "Smart"));
    expect(retargeted.entityId).toBe(`page.${NAMELESS}`);
    expect(retargeted.customLabel).toBe("Page");
  });

  it("is the old target's name a label follows", () => {
    const tile = tileOf({ entityId: `page.${NAMELESS}`, customLabel: "Page" });
    const doc = deepFreeze({
      schemaVersion: 1,
      pages: [
        { id: PAGE, name: "Living", items: [tile] },
        { id: NAMELESS, items: [] },
        { id: SMART_PAGE, name: "Den", items: [] },
      ],
    }) as WatchPagesDocument;
    const menu = watchLinkTargetMenu(doc, tile as WatchPageTile, (doc.pages as WatchPageTile[]).slice(1) as never);
    expect(menu?.oldTargetName).toBe("Page");
    const after = setWatchPageLinkTarget(doc, PAGE, tile.id as string, { id: SMART_PAGE, name: "Den" }, menu?.oldTargetName);
    expect(((after.pages as Json[])[0]!.items as Json[])[0]!.customLabel).toBe("Den");
  });
});

describe("a hold and slide array with a direction twice", () => {
  it("reads the last, as Swift's dictionary decoding does", () => {
    expect(readWatchSlideMap(["up", "toggle", "up", "none"])).toEqual(new Map([["up", "none"]]));
    const t = edits(tileOf({ holdSlideActions: ["up", "toggle", "down", "none", "up", "openControl"] }));
    expect(watchHoldSlideSettings(t.read(t.doc)).parses).toBe(true);
    expect(watchHoldSlideSettings(t.read(t.doc)).directions[0]!.stored).toBe("openControl");
  });

  it("is written back with one of each", () => {
    const t = edits(tileOf({ holdSlideActions: ["up", "toggle", "up", "none"] }));
    expect(t.read(setWatchTileHoldSlide(t.doc, PAGE, t.id, "left", "toggle")).holdSlideActions).toEqual(["up", "none", "left", "toggle"]);
  });
});

describe("a tap animation the watch does not know", () => {
  it("reads as bounce, the stored string kept", () => {
    const odd = watchTileIconSettings(tileOf({ iconTapAnimation: "wobble" }) as WatchPageTile);
    expect(odd.tapAnimation).toBe("bounce");
    expect(odd.tapAnimationStored).toBe("wobble");
    const known = watchTileIconSettings(tileOf({ iconTapAnimation: "spin" }) as WatchPageTile);
    expect([known.tapAnimation, known.tapAnimationStored]).toEqual(["spin", "spin"]);
    const absent = tileOf({});
    delete absent.iconTapAnimation;
    const none = watchTileIconSettings(absent as WatchPageTile);
    expect([none.tapAnimation, none.tapAnimationStored]).toEqual(["replace", undefined]);
  });

  it("stays as stored until another is picked", () => {
    const t = edits(tileOf({ iconTapAnimation: "wobble" }));
    expect(t.read(setWatchTileIconShadow(t.doc, PAGE, t.id, true)).iconTapAnimation).toBe("wobble");
    expect(t.read(setWatchTileTapAnimation(t.doc, PAGE, t.id, "bounce")).iconTapAnimation).toBe("bounce");
  });
});

describe("a header's glow as the watch reads it", () => {
  it("in the settings and the preview, uncapped", () => {
    const header = (entityId: string) => ({ id: "C3A0E000-0000-4000-8000-0000000000F1", entityId }) as WatchPageTile;
    expect(watchHeaderSettings(header("divider.line.custom.g250"))!.glow).toBe(2.5);
    expect(watchHeaderSettings(header("divider.label.custom.g-10"))!.glow).toBe(-0.1);
    expect(watchHeaderSettings(header("divider.line.custom.gx.g40"))!.glow).toBe(0.4);
    expect(watchHeaderLook(header("divider.line.custom.g250")).glow).toBe(2.5);
    expect(watchHeaderLook(header("divider.line.custom.g+5")).glow).toBe(0.05);
  });
});

describe("a key a setter adds goes where the phone's sorted encoding puts it", () => {
  it("on a tile in sorted order", () => {
    const t = edits(LAMP);
    const keys = Object.keys(t.read(setWatchTileIconSize(t.doc, PAGE, t.id, 20)));
    expect(keys).toEqual([...keys].sort());
    expect(keys).toContain("iconSizeOverride");
  });

  it("at the end of a tile in some other order", () => {
    const tile: Json = { id: LAMP_ID, entityId: "light.desk_lamp", colSpan: 6 };
    const t = edits(tile);
    expect(Object.keys(t.read(setWatchTileIconShadow(t.doc, PAGE, t.id, true)))).toEqual(["id", "entityId", "colSpan", "iconShadow"]);
  });

  it("in a trigger target", () => {
    const t = edits(tileOf({
      holdSlideActions: ["left", "triggerEntity"],
      holdSlideTriggerTargets: ["left", { entityId: "light.hall", mode: "toggle" }],
    }));
    const named = t.read(setWatchTileHoldSlideTarget(t.doc, PAGE, t.id, "left", "light.kitchen", "Kitchen"));
    expect(JSON.stringify(named.holdSlideTriggerTargets)).toBe(JSON.stringify(["left", { entityId: "light.kitchen", friendlyName: "Kitchen", mode: "toggle" }]));
  });

  it("and a new calendar tile's colors are sorted too", () => {
    const tile = newWatchEntityTile({ entityId: "calendar.home" }, undefined);
    const keys = Object.keys(tile);
    expect(keys).toEqual([...keys].sort());
    expect(Object.keys(tile.calendarSourceColors as Json)).toEqual(["calendar.home"]);
  });
});
