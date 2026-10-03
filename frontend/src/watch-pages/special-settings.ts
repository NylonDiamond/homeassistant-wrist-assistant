// The special tasks of the Tile card (part 3f batch 1): Remote, Vacuum and
// Mower (the phone's Data task under the kind's title), Camera for a camera
// and a camera group, Calendars, Weather, Person and Alarm. Drawn as the
// `special` section, before Icon, by `tile-settings.ts`.
//
// Every edit goes through `commit` with a setter of `special-model.ts`, read
// against the document, the page and the tile as they are when it commits;
// each user action is one undo step (typing in one field is one run). What
// the module needs beyond the tile settings' host it reads from the host
// too: the device's other entities (`deviceSiblings`), the watch's camera
// default (`cameraRefreshDefaults`), and a picture's size for ratio
// detection (`loadImageSize`), which a test or the harness stands in for.
//
// Plan: app repo docs/pages_in_home_assistant_step3.md, "3f batch 1 build
// contract".

import { css, html, nothing, type TemplateResult } from "lit";
import type { EntityRef } from "../model.js";
import { checkField, colorField, entityField, segField, sliderField, symbolField, textField } from "../editors.js";
import { uiIcon } from "../ui-icons.js";
import type { TileSettingsHost } from "./editor-host.js";
import { type WatchPagesDocument, tileEntityId, tileKind, watchPageTiles } from "./model.js";
import { watchPageSwatchTheme } from "./page-settings-model.js";
import { watchThemeDisplayName, watchThemeSwatches } from "./tile-new.js";
import { watchColorRefusal, watchCustomBoxColor } from "./tile-settings-options.js";
import { commit, fieldNote, linkButton, menuField, swatchRow, typed, typingField } from "./tile-settings.js";
import {
  type WatchSpecialResize,
  type WatchSpecialTask,
  type WatchVacuumPicks,
  type WatchVacuumSlot,
  WATCH_SPECIAL,
  addWatchCalendars,
  addWatchCamerasToGroup,
  addWatchRemoteLauncher,
  applyWatchVacuumDiscovery,
  centerWatchCameraCellOffset,
  centerWatchCameraOffset,
  detectWatchCameraRatios,
  isWatchTvRemote,
  mergeWatchCameraTiles,
  nudgeWatchCameraCellOffset,
  nudgeWatchCameraOffset,
  removeWatchCalendar,
  removeWatchCameraFromGroup,
  removeWatchRemoteLauncher,
  resetWatchRemoteLayout,
  resetWatchSpecialTask,
  resizeWatchSpecialTile,
  setWatchAlarmAutoSubmit,
  setWatchCalendarColor,
  setWatchCameraBorder,
  setWatchCameraBorderColor,
  setWatchCameraBorderThickness,
  setWatchCameraCellFill,
  setWatchCameraCellWeight,
  setWatchCameraDisplayMode,
  setWatchCameraFill,
  setWatchCameraRefresh,
  setWatchMowerBattery,
  setWatchRemoteCrownBack,
  setWatchRemoteCrownSelect,
  setWatchRemoteEdgeSide,
  setWatchRemoteEdgeVolume,
  setWatchRemoteLauncherColor,
  setWatchRemoteLauncherIcon,
  setWatchRemoteLauncherLabel,
  setWatchRemoteLayoutSlot,
  setWatchRemoteMediaPlayer,
  setWatchRemoteQuickConfirm,
  setWatchRemoteVolumePlayer,
  setWatchShowBattery,
  setWatchUsePersonPhoto,
  setWatchVacuumEntity,
  setWatchVacuumExtraLabel,
  setWatchVacuumSwitches,
  setWatchWeatherShowIcons,
  setWatchWeatherTextScale,
  swapWatchCameraInGroup,
  swapWatchRemoteLayoutSlots,
  unmergeWatchCameraGroup,
  watchAlarmAutoSubmit,
  watchBatterySensors,
  watchCalendarIds,
  watchCalendarSourceColor,
  watchCameraGroupSettings,
  watchCameraRefreshChoices,
  watchCameraSettings,
  watchEditablePalette,
  watchMowerBatteryResolved,
  watchMowerFallbackBatteryId,
  watchObjectName,
  watchRatioName,
  watchRemoteButtonKind,
  watchRemoteKindAvailability,
  watchRemoteLaunchers,
  watchRemotePlayers,
  watchRemoteSettings,
  watchShowBattery,
  watchSnapshotRatio,
  watchSpecialTask,
  watchSpecialTaskModified,
  watchSuggestedMediaPlayer,
  watchSuggestedTileSizes,
  watchToggled,
  watchUsesPersonPhoto,
  watchVacuumAttention,
  watchVacuumDiscoveryResult,
  watchVacuumDiscoverySuggestions,
  watchVacuumPicks,
  watchVacuumSlot,
  watchWeatherSettings,
} from "./special-model.js";

/** Every `uiState` key of this module starts with this. */
const KEY = "special";

const T = WATCH_SPECIAL;

function stateKey(host: TileSettingsHost, what: string): string {
  return `${KEY}:${what}:${host.tileId.toUpperCase()}`;
}

/** The page and tile ids the setters take. */
function at(host: TileSettingsHost): [string, string] {
  return [host.pageId, host.tileId];
}

/** An entity's friendly name, else its object id made readable. */
function nameOf(host: TileSettingsHost, entityId: string): string {
  const friendly = host.hass.states[entityId]?.attributes?.friendly_name;
  return typeof friendly === "string" && friendly.trim() !== "" ? friendly : watchObjectName(entityId);
}

function refOf(host: TileSettingsHost, entityId: string | undefined): EntityRef {
  const id = entityId ?? "";
  return { entityId: id, displayName: id === "" ? "" : nameOf(host, id), domain: tileKind(id) };
}

const RESIZE_REASONS: Readonly<Record<NonNullable<WatchSpecialResize["refused"]>, string>> = {
  overlap: "There is no room: a tile that starts above this one is in the way. Move it, then try again.",
  end: "The page would run past its last row.",
};

/** A resize edit: refused with the reason by the field, else one step. */
function commitResize(host: TileSettingsHost, setting: string, run: (d: WatchPagesDocument) => WatchSpecialResize): void {
  const tried = run(host.document);
  if (tried.refused !== undefined) return commit(host, setting, (d) => d, { reason: RESIZE_REASONS[tried.refused] });
  commit(host, setting, (d) => run(d).document);
}

/** The refusal a setting's last edit was given, for rows that are not typed
 * in (a typed field shows its own). */
function noteOf(host: TileSettingsHost, setting: string): TemplateResult | typeof nothing {
  return fieldNote(host, setting);
}

// ── the section ──────────────────────────────────────────────────────────

/** The section's title: the task's own ("Remote", "Camera", ...). */
export function watchSpecialSectionTitle(host: TileSettingsHost): string {
  return watchSpecialTask(host.tile, host.hass.states)?.title ?? "";
}

/** What the folded section says it holds. */
export function specialSummary(host: TileSettingsHost): string {
  const task = watchSpecialTask(host.tile, host.hass.states);
  const tile = host.tile;
  switch (task?.kind) {
    case "remote": {
      if (isWatchTvRemote(tileEntityId(tile), host.hass.states)) return "TV";
      const player = watchRemoteSettings(tile).mediaPlayer;
      return player === undefined ? "No media player" : nameOf(host, player);
    }
    case "vacuum":
      return watchVacuumAttention(tile, host.hass.states).any ? "Needs linked entities" : "";
    case "lawn_mower":
      return watchMowerBatteryResolved(tile, host.hass.states) ? "" : "No battery sensor";
    case "camera": {
      const c = watchCameraSettings(tile);
      const mode = T.camera.displayModes.find((m) => m.value === c.displayMode)?.label ?? c.displayMode;
      return c.ratio === undefined ? mode : `${mode}, ${watchRatioName(c.ratio)}`;
    }
    case "multicam": {
      const n = watchCameraGroupSettings(tile).cameraIds.length;
      return `${n} camera${n === 1 ? "" : "s"}`;
    }
    case "calendar": {
      const n = watchCalendarIds(tile).length;
      return `${n} calendar${n === 1 ? "" : "s"}`;
    }
    case "weather": {
      const w = watchWeatherSettings(tile);
      return w.textScaleStored ? `Text ${Math.round(w.textScale * 100)}%` : "";
    }
    case "person":
      return watchUsesPersonPhoto(tile) ? "Photo" : "Icon";
    case "alarm_control_panel":
      return watchAlarmAutoSubmit(tile) ? "Auto-submit" : "";
    default:
      return "";
  }
}

/** The task's rows for `host.tile`. */
export function renderSpecial(host: TileSettingsHost): TemplateResult {
  const task = watchSpecialTask(host.tile, host.hass.states);
  if (task === undefined) return html``;
  let body: TemplateResult;
  switch (task.kind) {
    case "remote":
      body = renderRemote(host);
      break;
    case "vacuum":
      body = renderVacuum(host);
      break;
    case "lawn_mower":
      body = renderMower(host);
      break;
    case "camera":
      body = renderCamera(host);
      break;
    case "multicam":
      body = renderCameraGroup(host);
      break;
    case "calendar":
      body = renderCalendars(host);
      break;
    case "weather":
      body = renderWeather(host);
      break;
    case "person":
      body = renderPerson(host);
      break;
    case "alarm_control_panel":
      body = renderAlarm(host);
      break;
    default:
      body = html``;
  }
  return html`${body}${resetRow(host, task.task, task.title)}`;
}

/** A task's Reset, shown while it would change the tile (Data, Alarm,
 * Person; the others have none). */
function resetRow(host: TileSettingsHost, task: WatchSpecialTask, title: string): TemplateResult | typeof nothing {
  if (!watchSpecialTaskModified(host.tile, task)) return nothing;
  return html`<div class="ts-after ts-reset">${linkButton(`Reset ${title}`, `Put every ${title.toLowerCase()} setting back as the iPhone app's reset does`, () =>
    commit(host, `reset:${task}`, (d) => resetWatchSpecialTask(d, ...at(host), task)))}</div>`;
}

// ── Remote ───────────────────────────────────────────────────────────────

function renderRemote(host: TileSettingsHost): TemplateResult {
  const tile = host.tile;
  const entityId = tileEntityId(tile);
  const tv = isWatchTvRemote(entityId, host.hass.states);
  const s = watchRemoteSettings(tile);
  const pickPlayer = (setting: string, set: typeof setWatchRemoteMediaPlayer) => (next: EntityRef) => {
    const id = next.entityId.trim();
    if (id !== "" && tileKind(id) !== "media_player") return commit(host, setting, (d) => d, { reason: "Pick a media player." });
    commit(host, setting, (d) => set(d, ...at(host), id === "" ? null : id));
  };
  const suggestion = !tv && s.mediaPlayer === undefined ? watchSuggestedMediaPlayer(host.deviceSiblings(entityId).all) : undefined;
  return html`
    ${tv
      ? html`<div class="hint">This TV is its own media player: playback, volume and inputs go to it.</div>`
      : html`<div class="ts-sub-h"><span>Linked media player</span>${s.mediaPlayer === undefined ? html`<span class="sp-warn">Required</span>` : nothing}</div>
        <div class="ts-stack">${entityField({ hass: host.hass }, "Media player", refOf(host, s.mediaPlayer), pickPlayer("mediaPlayer", setWatchRemoteMediaPlayer), `pe:sp:media:${host.tileId}`, { domain: "media_player", clearable: true })}</div>
        ${suggestion === undefined
          ? nothing
          : html`<div class="ts-chips"><button type="button" class="pe-chip" @click=${() =>
              commit(host, "mediaPlayer", (d) => (watchRemoteSettings(host.tile).mediaPlayer === undefined ? setWatchRemoteMediaPlayer(d, ...at(host), suggestion) : d))}>Use ${nameOf(host, suggestion)}</button></div>`}
        ${s.mediaPlayer === undefined ? html`<div class="hint warn">Volume, playback, now playing, inputs and an accurate power state need a linked media player.</div>` : nothing}
        ${noteOf(host, "mediaPlayer")}`}
    <div class="ts-sub-h"><span>Volume</span></div>
    <div class="ts-stack">${entityField({ hass: host.hass }, "Volume player", refOf(host, s.volumePlayer), pickPlayer("volumePlayer", setWatchRemoteVolumePlayer), `pe:sp:volume:${host.tileId}`, { domain: "media_player", clearable: true })}</div>
    <div class="hint">${s.volumePlayer === undefined ? (tv ? "Empty: the TV's own volume." : "Empty: the media player's volume.") : "Volume goes to this player, a receiver or a soundbar."}</div>
    ${noteOf(host, "volumePlayer")}
    <div class="ts-sub-h"><span>Watch input</span></div>
    ${checkField("Select with Crown", s.crownSelect, (on) => commit(host, "crownSelect", (d) => setWatchRemoteCrownSelect(d, ...at(host), on)))}
    ${s.crownSelect ? checkField("Reverse = Back", s.crownBack, (on) => commit(host, "crownBack", (d) => setWatchRemoteCrownBack(d, ...at(host), on))) : nothing}
    ${checkField("Edge volume slide", s.edgeVolume, (on) => commit(host, "edgeVolume", (d) => setWatchRemoteEdgeVolume(d, ...at(host), on)))}
    ${s.edgeVolume
      ? segField("Side", s.edgeSide, T.remote.edgeSides.map((c) => [c.value, c.label] as [string, string]), (v) =>
          commit(host, "edgeSide", (d) => setWatchRemoteEdgeSide(d, ...at(host), v)))
      : nothing}
    ${renderLaunchers(host)}
    ${renderLayout(host)}`;
}

function renderLaunchers(host: TileSettingsHost): TemplateResult {
  const s = watchRemoteSettings(host.tile);
  const rows = watchRemoteLaunchers(host.tile);
  const palette = watchEditablePalette();
  const add = (next: EntityRef) => {
    const id = next.entityId.trim();
    if (id === "") return;
    if (tileKind(id) !== "script") return commit(host, "launcherAdd", (d) => d, { reason: "Pick a script." });
    const friendly = host.hass.states[id]?.attributes?.friendly_name;
    const name = typeof friendly === "string" && friendly !== id ? friendly : "";
    commit(host, "launcherAdd", (d) => addWatchRemoteLauncher(d, ...at(host), id, name));
  };
  return html`<div class="ts-sub">
    <div class="ts-sub-h"><span>Quick actions</span></div>
    ${checkField("Require confirmation", s.quickConfirm, (on) => commit(host, "quickConfirm", (d) => setWatchRemoteQuickConfirm(d, ...at(host), on)))}
    ${rows.map((row, i) => {
      const labelSetting = `launcherLabel:${i}`;
      const iconSetting = `launcherIcon:${i}`;
      const colorSetting = `launcherColor:${i}`;
      const writeColor = (value: string | null, typing = false) =>
        commit(host, colorSetting, (d) => setWatchRemoteLauncherColor(d, ...at(host), i, value), { typing });
      const custom = (value: string | undefined) => {
        const reason = watchColorRefusal(value);
        if (reason !== undefined || value === undefined) return commit(host, colorSetting, (d) => d, { reason: reason ?? "Pick a color." });
        writeColor(value.toUpperCase(), true);
      };
      return html`<div class="sp-card">
        <div class="sp-card-h"><span class="sp-name">${row.label || nameOf(host, row.scriptId)}</span>
          <span class="sp-faint">${row.scriptId}</span>
          <button type="button" class="sp-icon-btn" title="Remove this quick action" aria-label="Remove ${row.label || row.scriptId}"
            @click=${() => commit(host, `launcherRemove`, (d) => removeWatchRemoteLauncher(d, ...at(host), i))}>${uiIcon("delete")}</button></div>
        ${typingField(host, labelSetting, textField("Label", typed(host, labelSetting) ?? row.label, (v) =>
          commit(host, labelSetting, (d) => setWatchRemoteLauncherLabel(d, ...at(host), i, v), { typing: true })))}
        ${typingField(host, iconSetting, symbolField({ icons: host.icons, symbols: host.symbols }, typed(host, iconSetting) ?? row.icon, (v) =>
          commit(host, iconSetting, (d) => setWatchRemoteLauncherIcon(d, ...at(host), i, v.trim() === "" ? null : v), { typing: true }),
          `pe:sp:launcher:${host.tileId}:${i}`, undefined, "Icon", false))}
        <div class="ts-chips sp-indent"><button type="button" class="pe-chip ${row.color === "" ? "on" : ""}" aria-pressed=${row.color === "" ? "true" : "false"}
          title="The remote's accent color" @click=${() => writeColor(null)}>Accent</button></div>
        <div class="ts-swatch-row">${swatchRow("Quick action colors", palette, row.color, (v) => writeColor(v))}</div>
        ${typingField(host, colorSetting, html`<div class="ts-no-alpha">${colorField("Custom", typed(host, colorSetting) ?? watchCustomBoxColor(row.color === "" ? undefined : row.color), custom)}</div>`)}
      </div>`;
    })}
    <div class="ts-stack">${entityField({ hass: host.hass }, "Add quick action", refOf(host, undefined), add, `pe:sp:launcherAdd:${host.tileId}`, { domain: "script", clearable: false })}</div>
    ${noteOf(host, "launcherAdd")}
    <div class="hint">Scripts the remote runs from its quick action list on the watch.</div>
  </div>`;
}

/** The 12 slot layout: pick a slot, then a button for it; pick two slots to
 * swap them. A button the players cannot do is dimmed with the reason, and
 * can still be placed. */
function renderLayout(host: TileSettingsHost): TemplateResult {
  const s = watchRemoteSettings(host.tile);
  const players = watchRemotePlayers(host.tile, host.hass.states);
  const selKey = stateKey(host, "slot");
  const stored = host.uiState.get(selKey);
  const selected = typeof stored === "number" && stored >= 0 && stored < T.remote.slotCount ? stored : undefined;
  const noteKey = stateKey(host, "layoutNote");
  const note = host.uiState.get(noteKey);
  const select = (i: number | undefined) => {
    if (i === undefined) host.uiState.delete(selKey);
    else host.uiState.set(selKey, i);
    host.uiState.delete(noteKey);
    host.requestUpdate();
  };
  const glyph = (symbol: string, dim: boolean) => host.icons.render(symbol, 15, dim ? "#8E8E93" : "#FFFFFF");
  const slotClick = (i: number) => {
    if (selected === undefined) return select(i);
    if (selected === i) return select(undefined);
    commit(host, "layout", (d) => swapWatchRemoteLayoutSlots(d, ...at(host), selected, i));
    select(undefined);
  };
  const place = (kind: string, reason: string) => {
    if (selected === undefined) return;
    commit(host, "layout", (d) => setWatchRemoteLayoutSlot(d, ...at(host), selected, kind));
    if (reason !== "") {
      host.uiState.set(noteKey, reason);
      host.requestUpdate();
    }
  };
  return html`<div class="ts-sub">
    <div class="ts-sub-h"><span>Button layout</span>
      ${s.layoutStored ? linkButton("Reset", "Back to the watch's own layout, which adapts to the player", () => {
        select(undefined);
        commit(host, "layout", (d) => resetWatchRemoteLayout(d, ...at(host)));
      }) : nothing}</div>
    <div class="sp-layout" role="group" aria-label="Button layout">
      ${s.layout.map((value, i) => {
        const kind = watchRemoteButtonKind(value);
        const a = watchRemoteKindAvailability(value, players);
        const on = selected === i;
        return html`<button type="button" class="sp-slot ${on ? "on" : ""} ${a.available ? "" : "dim"} ${value === "empty" ? "empty" : ""}"
          aria-pressed=${on ? "true" : "false"} title=${a.reason || (kind?.label ?? value)} @click=${() => slotClick(i)}>
          ${kind === undefined || value === "empty" ? nothing : html`<span class="sp-slot-glyph">${glyph(kind.symbol, !a.available) ?? nothing}</span>`}
          <span class="sp-slot-label">${value === "empty" ? "" : (kind?.label ?? value)}</span>
        </button>`;
      })}
    </div>
    <div class="hint">${selected === undefined
      ? s.layoutStored ? "Pick a slot, then a button for it. Pick two slots to swap them." : "The watch's own layout, which swaps Prev and Next for -10s and +10s when the player can seek. Pick a slot to change it."
      : `Slot ${selected + 1}: pick a button below, or another slot to swap with.`}</div>
    ${selected === undefined
      ? nothing
      : html`<div class="sp-palette" role="group" aria-label="Buttons">
        ${T.remote.kinds.map((kind) => {
          const a = watchRemoteKindAvailability(kind.value, players);
          return html`<button type="button" class="pe-chip sp-chip ${a.available ? "" : "dim"} ${s.layout[selected] === kind.value ? "on" : ""}"
            title=${a.reason || kind.category} @click=${() => place(kind.value, a.reason)}>
            ${kind.value === "empty" ? nothing : html`<span class="sp-slot-glyph">${glyph(kind.symbol, !a.available) ?? nothing}</span>`}${kind.label}</button>`;
        })}
      </div>`}
    ${typeof note === "string" ? html`<div class="hint warn" role="status">Placed. ${note}.</div>` : nothing}
  </div>`;
}

// ── Camera ───────────────────────────────────────────────────────────────

const CAMERA_HINTS: Readonly<Record<string, string>> = {
  icon: "Tap opens the full-screen live view.",
  preview: "Tap opens the live view; hold and slide up refreshes the snapshot.",
};

/** A D-pad: up, left, the middle, right, down; each press one step. */
function dpad(label: string, x: number, y: number, step: (dx: number, dy: number) => void, center: () => void): TemplateResult {
  const b = (dx: number, dy: number, icon: "up" | "down" | "left" | "right", name: string) =>
    html`<button type="button" class="sp-pad-${icon}" aria-label="${label} ${name}" @click=${() => step(dx, dy)}>${uiIcon(icon)}</button>`;
  return html`<div class="field sp-pad-field"><span>${label}</span>
    <div class="sp-pad-row">
      <div class="sp-pad" role="group" aria-label=${label}>
        ${b(0, -1, "up", "up")}${b(-1, 0, "left", "left")}
        <button type="button" class="sp-pad-mid" aria-label="${label}: center" title="Center" @click=${center}><span></span></button>
        ${b(1, 0, "right", "right")}${b(0, 1, "down", "down")}
      </div>
      <span class="sp-faint">x ${x}, y ${y}</span>
    </div></div>`;
}

/** The pictures of the cameras a tile shows, by camera. */
function pictureOf(host: TileSettingsHost, cameraId: string): string | undefined {
  const picture = host.hass.states[cameraId]?.attributes?.entity_picture;
  return typeof picture === "string" && picture !== "" ? picture : undefined;
}

/** Detect Camera Ratio: every camera's snapshot loaded for its size, then
 * the detection as one step. A camera that does not load counts as missing:
 * a single camera then stays as it is, a group's camera counts as 1.78. */
export async function detectCameraRatio(host: TileSettingsHost, tileId = host.tileId): Promise<void> {
  const find = () => watchPageTiles(host.page).find((t) => typeof t.id === "string" && t.id.toUpperCase() === tileId.toUpperCase());
  const tile = find();
  if (tile === undefined) return;
  const group = tileKind(tileEntityId(tile)) === "multicam";
  const cameraIds = group ? watchCameraGroupSettings(tile).cameraIds : [tileEntityId(tile)];
  const statusKey = `${KEY}:detect:${tileId.toUpperCase()}`;
  host.uiState.set(statusKey, "Loading the snapshots…");
  host.requestUpdate();
  const sizes = await Promise.all(cameraIds.map(async (id) => {
    const url = pictureOf(host, id);
    if (url === undefined) return undefined;
    try {
      return await host.loadImageSize(url);
    } catch {
      return undefined;
    }
  }));
  const ratios = sizes.map((size) => watchSnapshotRatio(size) ?? null);
  const missing = ratios.filter((r) => r === null).length;
  host.uiState.delete(statusKey);
  // Gone while the pictures loaded (an undo, a delete, a merge from the
  // iPhone): nothing to detect on.
  if (find() === undefined) return host.requestUpdate();
  if (!group && missing > 0) {
    host.uiState.set(statusKey, "The snapshot did not load, so nothing changed.");
    return host.requestUpdate();
  }
  commitResize(host, "detect", (d) => detectWatchCameraRatios(d, host.pageId, tileId, ratios));
  if (group && missing > 0) host.uiState.set(statusKey, `${missing} snapshot${missing === 1 ? "" : "s"} did not load and count${missing === 1 ? "s" : ""} as ${T.camera.detectFallbackRatio}:1.`);
  host.requestUpdate();
}

function renderDetect(host: TileSettingsHost, ratio: number | undefined): TemplateResult {
  const status = host.uiState.get(stateKey(host, "detect"));
  const running = status === "Loading the snapshots…";
  return html`<div class="ts-chips">
      <button type="button" class="pe-chip" ?disabled=${running} @click=${() => void detectCameraRatio(host)}>${ratio === undefined ? "Detect camera ratio" : "Detect again"}</button>
      ${ratio === undefined ? nothing : html`<span class="sp-faint sp-ratio">${watchRatioName(ratio)}</span>`}
    </div>
    ${typeof status === "string" ? html`<div class="hint" role="status">${status}</div>` : nothing}
    ${noteOf(host, "detect")}`;
}

function refreshMenu(host: TileSettingsHost, refresh: boolean | undefined): TemplateResult {
  const d = host.cameraRefreshDefaults;
  const choices = watchCameraRefreshChoices(d.on, d.debounce);
  const value = (v: boolean | null | undefined) => (v === undefined || v === null ? "default" : v ? "on" : "off");
  return html`${menuField("Refresh on open", {
    options: choices.map((c) => ({ value: value(c.value), label: c.label })),
    selected: value(refresh),
  }, (v) => commit(host, "refresh", (doc) => setWatchCameraRefresh(doc, ...at(host), v === "default" ? null : v === "on")))}
    <div class="hint ts-under">Takes a new snapshot each time the page opens. Default follows the watch's camera setting.</div>`;
}

function renderCamera(host: TileSettingsHost): TemplateResult {
  const c = watchCameraSettings(host.tile);
  const suggestions = c.ratio === undefined ? [] : watchSuggestedTileSizes(c.ratio);
  const size = { colSpan: Number(host.tile.colSpan), rowSpan: Number(host.tile.rowSpan) };
  return html`
    ${segField("Display", c.displayMode, T.camera.displayModes.map((m) => [m.value, m.label] as [string, string]), (v) =>
      commit(host, "displayMode", (d) => setWatchCameraDisplayMode(d, ...at(host), v)))}
    <div class="hint ts-under">${CAMERA_HINTS[c.displayMode] ?? ""}</div>
    ${segField("Content", c.fillMode, T.camera.fillModes.map((m) => [m.value, m.label] as [string, string]), (v) =>
      commit(host, "fill", (d) => setWatchCameraFill(d, ...at(host), v)))}
    ${c.fillMode === "fill"
      ? dpad("Crop position", c.offsetX, c.offsetY, (dx, dy) => commit(host, "offset", (d) => nudgeWatchCameraOffset(d, ...at(host), dx, dy)),
          () => commit(host, "offset", (d) => centerWatchCameraOffset(d, ...at(host))))
      : html`<div class="hint ts-under">Fit shows the whole picture with bars; Fill crops it to the tile.</div>`}
    <div class="ts-sub-h"><span>Tile size</span></div>
    ${renderDetect(host, c.ratio)}
    ${suggestions.length === 0
      ? html`<div class="hint">Detect the ratio for sizes that fit the picture.</div>`
      : html`<div class="ts-chips" role="group" aria-label="Suggested sizes">
        ${suggestions.map((s) => {
          const on = s.colSpan === size.colSpan && s.rowSpan === size.rowSpan;
          return html`<button type="button" class="pe-chip ${on ? "on" : ""}" aria-pressed=${on ? "true" : "false"}
            @click=${() => commitResize(host, "size", (d) => resizeWatchSpecialTile(d, ...at(host), s.colSpan, s.rowSpan))}>${s.colSpan}×${s.rowSpan}${s.bestFit ? html` <span class="sp-best">Best fit</span>` : nothing}</button>`;
        })}
      </div>${noteOf(host, "size")}`}
    ${refreshMenu(host, c.refresh)}
    ${renderGroupWith(host)}`;
}

/**
 * The open camera tile and the picked camera and group tiles become one
 * group (the phone's merge, one undo step), the group is selected, and its
 * ratios are detected (a second step, as on the phone). Resolves once the
 * detection is in; returns the group's id, or undefined when the merge was
 * refused.
 */
export async function groupWithCameras(host: TileSettingsHost, tileIds: readonly string[]): Promise<string | undefined> {
  let groupId: string | undefined;
  commit(host, "groupWith", (d) => {
    const out = mergeWatchCameraTiles(d, host.pageId, [host.tileId, ...tileIds]);
    groupId = out.groupId;
    return out.document;
  });
  if (groupId === undefined) return undefined;
  host.selectTile(groupId);
  await detectCameraRatio(host, groupId);
  return groupId;
}

/** "Group with other cameras": the other camera and group tiles of the page
 * to pick; the picks and this tile become one group (the phone's merge),
 * then the ratios are detected on it. */
function renderGroupWith(host: TileSettingsHost): TemplateResult {
  const others = watchPageTiles(host.page).filter((t) => {
    const kind = tileKind(tileEntityId(t));
    return (kind === "camera" || kind === "multicam") && typeof t.id === "string" && t.id.toUpperCase() !== host.tileId.toUpperCase();
  });
  const pickKey = stateKey(host, "groupWith");
  const raw = host.uiState.get(pickKey);
  const picked = Array.isArray(raw) ? (raw as string[]).filter((id) => others.some((t) => String(t.id).toUpperCase() === id)) : [];
  const toggleOne = (id: string) => {
    host.uiState.set(pickKey, watchToggled(picked, id.toUpperCase()));
    host.requestUpdate();
  };
  const merge = () => {
    host.uiState.delete(pickKey);
    void groupWithCameras(host, picked);
  };
  return html`<div class="ts-sub">
    <div class="ts-sub-h"><span>Group with other cameras</span></div>
    ${others.length === 0
      ? html`<div class="hint">Add another camera to this page to show several in one tile.</div>`
      : html`${others.map((t) => {
          const id = String(t.id).toUpperCase();
          const entityId = tileEntityId(t);
          const label = typeof t.customLabel === "string" && t.customLabel !== "" ? t.customLabel : nameOf(host, entityId);
          return checkField(tileKind(entityId) === "multicam" ? `${label} (group)` : label, picked.includes(id), () => toggleOne(id));
        })}
        <div class="ts-chips"><button type="button" class="pe-chip" ?disabled=${picked.length === 0} @click=${merge}>
          ${picked.length === 0 ? "Pick cameras to group" : `Group ${picked.length + 1} cameras`}</button></div>
        <div class="hint">One tile shows them all, in page order. A group among them keeps its place; else the new group takes this camera's.</div>`}
  </div>`;
}

// ── Camera group ─────────────────────────────────────────────────────────

function renderCameraGroup(host: TileSettingsHost): TemplateResult {
  const g = watchCameraGroupSettings(host.tile);
  const total = g.weights?.reduce((a, b) => a + b, 0) ?? 0;
  const theme = watchPageSwatchTheme(host.page);
  const addCamera = (next: EntityRef) => {
    const id = next.entityId.trim();
    if (id === "") return;
    if (tileKind(id) !== "camera") return commit(host, "groupAdd", (d) => d, { reason: "Pick a camera." });
    if (g.cameraIds.includes(id)) return commit(host, "groupAdd", (d) => d, { reason: "That camera is in the group already." });
    commit(host, "groupAdd", (d) => addWatchCamerasToGroup(d, ...at(host), [id]));
  };
  const writeColor = (value: string, typing = false) => commit(host, "borderColor", (d) => setWatchCameraBorderColor(d, ...at(host), value), { typing });
  const customColor = (value: string | undefined) => {
    const reason = watchColorRefusal(value);
    if (reason !== undefined || value === undefined) return commit(host, "borderColor", (d) => d, { reason: reason ?? "Pick a color." });
    writeColor(value, true);
  };
  const split = () => {
    let first: string | undefined;
    commit(host, "split", (d) => {
      const out = unmergeWatchCameraGroup(d, host.pageId, host.tileId);
      first = out.tileIds[0];
      return out.document;
    });
    if (first !== undefined) host.selectTile(first);
  };
  return html`
    <div class="ts-sub-h"><span>Cameras</span></div>
    ${g.cameraIds.map((id, i) => {
      const weight = g.weights?.[i];
      const percent = weight === undefined || total <= 0 ? undefined : Math.round((weight / total) * 100);
      return html`<div class="sp-card">
        <div class="sp-card-h"><span class="sp-name">${nameOf(host, id)}</span>
          <button type="button" class="sp-icon-btn" ?disabled=${i === 0} aria-label="Move ${nameOf(host, id)} up"
            @click=${() => commit(host, "groupOrder", (d) => swapWatchCameraInGroup(d, ...at(host), i, -1))}>${uiIcon("up")}</button>
          <button type="button" class="sp-icon-btn" ?disabled=${i === g.cameraIds.length - 1} aria-label="Move ${nameOf(host, id)} down"
            @click=${() => commit(host, "groupOrder", (d) => swapWatchCameraInGroup(d, ...at(host), i, 1))}>${uiIcon("down")}</button>
          ${g.cameraIds.length >= 2
            ? html`<button type="button" class="sp-icon-btn" aria-label="Remove ${nameOf(host, id)} from the group"
                title=${g.cameraIds.length === 2 ? "The tile becomes the other camera" : "Remove from the group"}
                @click=${() => commit(host, "groupRemove", (d) => removeWatchCameraFromGroup(d, ...at(host), i))}>${uiIcon("delete")}</button>`
            : nothing}</div>
        ${percent === undefined
          ? nothing
          : html`<div class="field"><span>Height</span><div class="sp-stepper">
              <button type="button" class="pe-chip" aria-label="Less height for ${nameOf(host, id)}"
                @click=${() => commitResize(host, `weight:${i}`, (d) => setWatchCameraCellWeight(d, ...at(host), i, -T.multicam.weight.step))}>−</button>
              <span class="sp-faint">${percent}%</span>
              <button type="button" class="pe-chip" aria-label="More height for ${nameOf(host, id)}"
                @click=${() => commitResize(host, `weight:${i}`, (d) => setWatchCameraCellWeight(d, ...at(host), i, T.multicam.weight.step))}>+</button>
            </div></div>${noteOf(host, `weight:${i}`)}`}
        ${segField("Content", g.fills[i] ?? "fill", T.camera.fillModes.map((m) => [m.value, m.label] as [string, string]), (v) =>
          commit(host, `cellFill:${i}`, (d) => setWatchCameraCellFill(d, ...at(host), i, v)))}
        ${(g.fills[i] ?? "fill") === "fill"
          ? dpad("Position", g.offsetsX[i] ?? 0, g.offsetsY[i] ?? 0,
              (dx, dy) => commit(host, `cellOffset:${i}`, (d) => nudgeWatchCameraCellOffset(d, ...at(host), i, dx, dy)),
              () => commit(host, `cellOffset:${i}`, (d) => centerWatchCameraCellOffset(d, ...at(host), i)))
          : nothing}
      </div>`;
    })}
    <div class="ts-stack">${entityField({ hass: host.hass }, "Add camera", refOf(host, undefined), addCamera, `pe:sp:groupAdd:${host.tileId}`, { domain: "camera", clearable: false })}</div>
    ${noteOf(host, "groupAdd")}
    <div class="hint">Cameras show top to bottom in the grid. Adding one names the group by its cameras again.</div>
    <div class="ts-sub-h"><span>Border</span></div>
    ${checkField("Grid border", g.border.on, (on) => commit(host, "border", (d) => setWatchCameraBorder(d, ...at(host), on)))}
    ${g.border.on
      ? html`
        <div class="ts-swatch-row">${swatchRow(`Border: ${watchThemeDisplayName(theme)} colors`, watchThemeSwatches(theme, false), g.border.color.startsWith("#") ? g.border.color : `#${g.border.color}`, (v) => writeColor(v))}</div>
        <div class="ts-chips sp-indent"><button type="button" class="pe-chip ${g.border.color === "#RAINBOW" ? "on" : ""}" aria-pressed=${g.border.color === "#RAINBOW" ? "true" : "false"}
          @click=${() => writeColor("#RAINBOW")}>Rainbow</button></div>
        ${typingField(host, "borderColor", html`<div class="ts-no-alpha">${colorField("Custom", typed(host, "borderColor") ?? watchCustomBoxColor(g.border.color === "#RAINBOW" ? undefined : g.border.color.startsWith("#") ? g.border.color : `#${g.border.color}`), customColor)}</div>`)}
        ${segField("Thickness", g.border.thickness, T.multicam.borderThicknesses.map((c) => [c.value, c.label] as [string, string]), (v) =>
          commit(host, "borderThickness", (d) => setWatchCameraBorderThickness(d, ...at(host), v)))}`
      : nothing}
    <div class="ts-sub-h"><span>Tile size</span></div>
    ${renderDetect(host, g.ratio)}
    <div class="hint">Detection sets the columns and each camera's height from the snapshots, full width.</div>
    ${refreshMenu(host, g.refresh)}
    <div class="ts-chips"><button type="button" class="pe-chip" @click=${split}>Split into cameras</button></div>
    <div class="hint">The group goes; each camera gets a tile of its own at the first free place.</div>`;
}

// ── Vacuum ───────────────────────────────────────────────────────────────

const SLOT_LABELS: Readonly<Record<WatchVacuumSlot, string>> = {
  cleaningMode: "Cleaning mode",
  fanSpeed: "Fan speed",
  extraSelect: "Extra tab",
  battery: "Battery",
};

/** A select over the battery sensors, battery class first; the none row in
 * the phone's words. */
function batteryMenu(host: TileSettingsHost, label: string, value: string | null, noneLabel: string, pick: (id: string | null) => void): TemplateResult {
  const ids = watchBatterySensors(host.hass.states);
  const options = [{ value: "", label: noneLabel }, ...ids.map((id) => ({ value: id, label: nameOf(host, id) }))];
  if (value !== null && !ids.includes(value)) options.push({ value, label: value });
  return menuField(label, { options, selected: value ?? "" }, (v) => pick(v === "" ? null : v));
}

function renderVacuum(host: TileSettingsHost): TemplateResult {
  const tile = host.tile;
  const picks = watchVacuumPicks(tile);
  const attention = watchVacuumAttention(tile, host.hass.states);
  const setSlot = (slot: WatchVacuumSlot) => (id: string | null) => commit(host, `vac:${slot}`, (d) => setWatchVacuumEntity(d, ...at(host), slot, id));
  const pickSlot = (slot: WatchVacuumSlot) => (next: EntityRef) => {
    const id = next.entityId.trim();
    if (id !== "" && !T.vacuum.selectDomains.includes(tileKind(id))) return commit(host, `vac:${slot}`, (d) => d, { reason: "Pick a select or an input select." });
    setSlot(slot)(id === "" ? null : id);
  };
  const needs = (["cleaningMode", "fanSpeed", "battery"] as const).filter((s) => attention[s]).map((s) => SLOT_LABELS[s].toLowerCase());
  const selectRow = (slot: WatchVacuumSlot) => html`
    <div class="ts-stack">${entityField({ hass: host.hass }, SLOT_LABELS[slot], refOf(host, picks[slot as "cleaningMode"] ?? undefined), pickSlot(slot), `pe:sp:vac:${slot}:${host.tileId}`, { domain: T.vacuum.selectDomains, clearable: true })}</div>
    ${picks[slot as "cleaningMode"] === null ? html`<div class="hint">Empty: ${watchVacuumSlot(slot).noneLabel}.</div>` : nothing}
    ${noteOf(host, `vac:${slot}`)}`;
  const label = typed(host, "vacExtraLabel") ?? (typeof tile.vacuumExtraSelectLabel === "string" ? tile.vacuumExtraSelectLabel : "");
  const addSwitch = (next: EntityRef) => {
    const id = next.entityId.trim();
    if (id === "") return;
    if (tileKind(id) !== "switch") return commit(host, "vacSwitches", (d) => d, { reason: "Pick a switch." });
    commit(host, "vacSwitches", (d) => setWatchVacuumSwitches(d, ...at(host), [...watchVacuumPicks(host.tile).switches, id]));
  };
  return html`
    ${renderDiscovery(host)}
    ${attention.any ? html`<div class="hint warn">The vacuum does not report its ${needs.join(", ")}. Link an entity for ${needs.length === 1 ? "it" : "them"}.</div>` : nothing}
    ${selectRow("cleaningMode")}
    ${selectRow("fanSpeed")}
    ${selectRow("extraSelect")}
    ${picks.extraSelect === null
      ? nothing
      : typingField(host, "vacExtraLabel", textField("Tab label", label, (v) =>
          commit(host, "vacExtraLabel", (d) => setWatchVacuumExtraLabel(d, ...at(host), v), { typing: true }), { placeholder: watchObjectName(picks.extraSelect) }))}
    ${batteryMenu(host, "Battery", picks.battery, watchVacuumSlot("battery").noneLabel, setSlot("battery"))}
    ${checkField("Show battery on tile", watchShowBattery(tile), (on) => commit(host, "showBattery", (d) => setWatchShowBattery(d, ...at(host), on)))}
    <div class="ts-sub-h"><span>Switches</span></div>
    ${picks.switches.map((id) => html`<div class="sp-list-row"><span>${nameOf(host, id)}</span>
      <button type="button" class="sp-icon-btn" aria-label="Remove ${nameOf(host, id)}"
        @click=${() => commit(host, "vacSwitches", (d) => setWatchVacuumSwitches(d, ...at(host), watchVacuumPicks(host.tile).switches.filter((s) => s !== id)))}>${uiIcon("delete")}</button></div>`)}
    <div class="ts-stack">${entityField({ hass: host.hass }, "Add switch", refOf(host, undefined), addSwitch, `pe:sp:vacSwitch:${host.tileId}`, { domain: "switch", clearable: false })}</div>
    ${noteOf(host, "vacSwitches")}
    <div class="hint">Switches show as toggles in the vacuum's controls, in this order.</div>`;
}

/** "Discover linked entities": the device's other entities, offered as the
 * phone's sheet offers them; Apply writes the picks. */
function renderDiscovery(host: TileSettingsHost): TemplateResult {
  const sheetKey = stateKey(host, "discover");
  const resultKey = stateKey(host, "discoverResult");
  const sheet = host.uiState.get(sheetKey) as WatchVacuumPicks | undefined;
  const result = host.uiState.get(resultKey);
  const siblings = host.deviceSiblings(tileEntityId(host.tile));
  const open = () => {
    host.uiState.delete(resultKey);
    if (siblings.all.length === 0) host.uiState.set(resultKey, "No companion entities found.");
    else host.uiState.set(sheetKey, watchVacuumDiscoverySuggestions(host.tile, siblings));
    host.requestUpdate();
  };
  const close = () => {
    host.uiState.delete(sheetKey);
    host.requestUpdate();
  };
  const change = (patch: Partial<WatchVacuumPicks>) => {
    host.uiState.set(sheetKey, { ...sheet!, ...patch });
    host.requestUpdate();
  };
  const apply = () => {
    const picks = sheet!;
    commit(host, "discover", (d) => applyWatchVacuumDiscovery(d, ...at(host), picks));
    host.uiState.set(resultKey, `${watchVacuumDiscoveryResult(picks)}.`);
    close();
  };
  const menu = (label: string, value: string | null, ids: readonly string[], pick: (v: string | null) => void) =>
    menuField(label, {
      options: [{ value: "", label: "None" }, ...ids.map((id) => ({ value: id, label: nameOf(host, id) }))],
      selected: value !== null && ids.includes(value) ? value : "",
    }, (v) => pick(v === "" ? null : v));
  return html`
    <div class="ts-chips"><button type="button" class="pe-chip" @click=${open}>Discover linked entities</button></div>
    ${typeof result === "string" && sheet === undefined ? html`<div class="hint" role="status">${result}</div>` : nothing}
    ${sheet === undefined
      ? nothing
      : html`<div class="sp-card">
        <div class="sp-card-h"><span class="sp-name">From this vacuum's device</span></div>
        ${menu("Cleaning mode", sheet.cleaningMode, siblings.selects, (v) => change({ cleaningMode: v }))}
        ${menu("Fan speed", sheet.fanSpeed, siblings.selects, (v) => change({ fanSpeed: v }))}
        ${menu("Extra tab", sheet.extraSelect, siblings.selects, (v) => change({ extraSelect: v }))}
        ${menu("Battery", sheet.battery, siblings.sensors, (v) => change({ battery: v }))}
        ${siblings.switches.map((id) => checkField(nameOf(host, id), sheet.switches.includes(id), () => change({ switches: watchToggled(sheet.switches, id) })))}
        <div class="ts-chips"><button type="button" class="pe-chip on" @click=${apply}>Apply</button>
          <button type="button" class="pe-chip" @click=${close}>Cancel</button></div>
        <div class="hint">Apply links each pick; switches are added to the ones linked already.</div>
      </div>`}`;
}

// ── Mower ────────────────────────────────────────────────────────────────

function renderMower(host: TileSettingsHost): TemplateResult {
  const tile = host.tile;
  const resolved = watchMowerBatteryResolved(tile, host.hass.states);
  const own = typeof tile.mowerBatteryEntityId === "string" && tile.mowerBatteryEntityId !== "" ? tile.mowerBatteryEntityId : null;
  return html`
    ${resolved
      ? own === null ? html`<div class="hint">Reads ${watchMowerFallbackBatteryId(tileEntityId(tile))}. Pick another to override it.</div>` : nothing
      : html`<div class="hint warn">Battery sensor not detected. Set one to show the charge.</div>`}
    ${batteryMenu(host, "Battery sensor", own, "Not set", (id) => commit(host, "mowerBattery", (d) => setWatchMowerBattery(d, ...at(host), id)))}
    ${checkField("Show battery on tile", watchShowBattery(tile), (on) => commit(host, "showBattery", (d) => setWatchShowBattery(d, ...at(host), on)))}`;
}

// ── Calendars ────────────────────────────────────────────────────────────

function renderCalendars(host: TileSettingsHost): TemplateResult {
  const tile = host.tile;
  const ids = watchCalendarIds(tile);
  const palette = watchEditablePalette();
  const add = (next: EntityRef) => {
    const id = next.entityId.trim();
    if (id === "") return;
    if (tileKind(id) !== "calendar") return commit(host, "calendarAdd", (d) => d, { reason: "Pick a calendar." });
    if (ids.includes(id)) return commit(host, "calendarAdd", (d) => d, { reason: "That calendar is on this tile already." });
    commit(host, "calendarAdd", (d) => addWatchCalendars(d, ...at(host), [id]));
  };
  return html`
    <div class="hint">Calendars merged into this tile. The watch's calendar sheet colors each one's events.</div>
    ${ids.map((id, i) => {
      const color = watchCalendarSourceColor(tile, id);
      return html`<div class="sp-card">
        <div class="sp-card-h"><span class="sp-name">${nameOf(host, id)}</span>
          ${i === 0 ? html`<span class="sp-faint">Primary</span>` : nothing}
          ${ids.length >= 2
            ? html`<button type="button" class="sp-icon-btn" aria-label="Remove ${nameOf(host, id)}"
                title=${i === 0 ? "The next calendar becomes the primary" : "Remove"}
                @click=${() => commit(host, "calendarRemove", (d) => removeWatchCalendar(d, ...at(host), id))}>${uiIcon("delete")}</button>`
            : nothing}</div>
        <div class="sp-color-row">
          <button type="button" class="pe-chip ${color === undefined ? "on" : ""}" aria-pressed=${color === undefined ? "true" : "false"}
            @click=${() => commit(host, `calendarColor:${i}`, (d) => setWatchCalendarColor(d, ...at(host), id, null))}>None</button>
          ${swatchRow(`${nameOf(host, id)} colors`, palette, color, (v) => commit(host, `calendarColor:${i}`, (d) => setWatchCalendarColor(d, ...at(host), id, v)))}
        </div>
      </div>`;
    })}
    <div class="ts-stack">${entityField({ hass: host.hass }, "Add calendar", refOf(host, undefined), add, `pe:sp:calendarAdd:${host.tileId}`, { domain: "calendar", clearable: false })}</div>
    ${noteOf(host, "calendarAdd")}`;
}

// ── Weather, Person, Alarm ───────────────────────────────────────────────

function renderWeather(host: TileSettingsHost): TemplateResult {
  const w = watchWeatherSettings(host.tile);
  const s = T.weather.textScale;
  return html`
    ${typingField(host, "weatherScale", sliderField("Text size", w.textScale, (v) =>
      commit(host, "weatherScale", (d) => setWatchWeatherTextScale(d, ...at(host), v), { typing: true }), {
      min: s.min, max: s.max, step: s.step, def: s.auto,
      format: (v) => (Math.abs(v - s.auto) < 0.001 ? "Default" : `${Math.round(v * 100)}%`),
    }), w.textScale)}
    ${checkField("Show icons", w.showIcons, (on) => commit(host, "weatherIcons", (d) => setWatchWeatherShowIcons(d, ...at(host), on)))}
    <div class="hint">Both change the watch's weather detail and forecast rows, not the tile.</div>`;
}

function renderPerson(host: TileSettingsHost): TemplateResult {
  const photo = watchUsesPersonPhoto(host.tile);
  return html`
    ${segField("Tile icon", photo ? "photo" : "icon", T.person.choices.map((c) => [c.value ? "photo" : "icon", c.label] as [string, string]), (v) =>
      commit(host, "personPhoto", (d) => setWatchUsePersonPhoto(d, ...at(host), v === "photo")))}
    <div class="hint ts-under">The person's Home Assistant photo, or the symbol. Photo falls back to the symbol when there is none.</div>`;
}

function renderAlarm(host: TileSettingsHost): TemplateResult {
  return html`
    ${checkField("Auto-submit", watchAlarmAutoSubmit(host.tile), (on) => commit(host, "autoSubmit", (d) => setWatchAlarmAutoSubmit(d, ...at(host), on)))}
    <div class="hint ts-under">Submits the PIN once the code's digits are in, with no Submit tap.</div>`;
}

export const specialSettingsStyles = css`
  .sp-warn { color: var(--wa-warn, #c47f00); font-weight: 600; }
  .sp-faint { color: var(--wa-muted); font-size: 11.5px; font-weight: 400; }
  .sp-indent { padding-left: calc(var(--wa-lab) + 8px); }
  .sp-card { display: flex; flex-direction: column; gap: 2px; margin: 4px 0; padding: 6px 8px;
    border: 1px solid var(--wa-line); border-radius: 8px; --wa-lab: 70px; }
  .sp-card-h { display: flex; align-items: center; gap: 6px; min-width: 0; }
  .sp-name { flex: 1; min-width: 0; font-size: 12.5px; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .sp-card-h .sp-faint { flex: none; max-width: 45%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .sp-icon-btn { flex: none; display: grid; place-items: center; width: 26px; height: 26px; padding: 0; border: 0; border-radius: 6px;
    background: none; color: var(--wa-muted); cursor: pointer; }
  .sp-icon-btn:hover:not(:disabled) { background: var(--wa-field); color: var(--wa-ink); }
  .sp-icon-btn:disabled { opacity: .35; cursor: default; }
  .sp-icon-btn svg.ui-icon { width: 15px; height: 15px; }
  .sp-list-row { display: flex; align-items: center; gap: 6px; padding: 2px 0 2px calc(var(--wa-lab) + 8px); font-size: 12.5px; }
  .sp-list-row > span { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; }
  .sp-color-row { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; padding: 2px 0; }
  .sp-stepper { display: flex; align-items: center; gap: 8px; }
  .sp-best { font-size: 10.5px; color: var(--wa-accent); font-weight: 600; }
  .sp-ratio { align-self: center; }

  .sp-layout { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 4px; padding: 4px 0; }
  .sp-slot { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px; min-height: 44px;
    padding: 4px 2px; border: 1px solid var(--wa-line); border-radius: 10px; background: #1c1c1e; color: #fff; font: inherit;
    font-size: 10.5px; cursor: pointer; }
  .sp-slot.empty { background: transparent; border-style: dashed; }
  .sp-slot.dim { opacity: .55; }
  .sp-slot.on { box-shadow: 0 0 0 2px var(--wa-card), 0 0 0 4px var(--wa-accent); }
  .sp-slot:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .sp-slot-glyph { display: inline-grid; place-items: center; }
  .sp-slot-glyph svg { display: block; }
  .sp-palette { display: flex; flex-wrap: wrap; gap: 4px; padding: 2px 0 4px; }
  .sp-chip { display: inline-flex; align-items: center; gap: 4px; }
  .sp-chip .sp-slot-glyph { background: #1c1c1e; border-radius: 4px; padding: 1px; }
  .sp-chip.dim { opacity: .55; }

  .sp-pad-field { align-items: center; }
  .sp-pad-row { display: flex; align-items: center; gap: 10px; }
  .sp-pad { display: grid; grid-template-columns: repeat(3, 24px); grid-template-rows: repeat(3, 24px); gap: 2px; }
  .sp-pad button { display: grid; place-items: center; padding: 0; border: 1px solid var(--wa-line); border-radius: 6px;
    background: var(--wa-field); color: var(--wa-ink); cursor: pointer; }
  .sp-pad button:hover { background: var(--wa-panel); }
  .sp-pad button svg.ui-icon { width: 13px; height: 13px; }
  .sp-pad-up { grid-column: 2; grid-row: 1; }
  .sp-pad-left { grid-column: 1; grid-row: 2; }
  .sp-pad-mid { grid-column: 2; grid-row: 2; }
  .sp-pad-mid span { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
  .sp-pad-right { grid-column: 3; grid-row: 2; }
  .sp-pad-down { grid-column: 2; grid-row: 3; }
`;
