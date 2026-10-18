// The app kinds' tasks of the Tile card (part 3f batch 2): Template, Music,
// Assist, Speak and Pointer, drawn as the `special` section, before Icon,
// under the task's own title (`special-settings.ts` hands them here), and the
// one line a webhook inbox tile shows where its task would be.
//
// Every edit goes through `commit` with a setter of `app-model.ts`, read
// against the document as it is when it commits; each user action is one
// undo step, and typing in the template editor or a preset's name is one
// step per visit to the field. The words come from `tile-app.json`. What
// the module reads beyond the tile it reads from the host: the voice
// defaults in the catalog, whether Home Assistant Cloud can speak, the
// template renders and the `behavior` document.
//
// Plan: app repo docs/pages_in_home_assistant_step3.md, "3f batch 2 build
// contract".

import { css, html, nothing, type TemplateResult } from "lit";
import { checkField, entityField, segField, sliderField, templateBox, textField } from "../editors.js";
import type { EntityRef } from "../model.js";
import { uiIcon } from "../ui-icons.js";
import { type TileSettingsHost, hostDeviceNoun } from "./editor-host.js";
import { tileEntityId, tileKind } from "./model.js";
import {
  WATCH_CHART_MAX_ENTITIES,
  WATCH_CHART_RANGES,
  WATCH_CHART_STYLES,
  WATCH_MAP_ENTITY_DOMAINS,
  WATCH_MAP_STYLES,
  WATCH_MAP_ZOOMS,
  WATCH_TEXT_SUBMITS,
  WATCH_TEXT_TARGET_KINDS,
  WATCH_WEB_CARD_HELP,
  addWatchChartEntity,
  addWatchMapEntity,
  removeWatchChartEntity,
  removeWatchMapEntity,
  setWatchChartRange,
  setWatchChartStyle,
  setWatchMapStyle,
  setWatchMapZoom,
  setWatchTextPlaceholder,
  setWatchTextSubmit,
  setWatchTextTargetField,
  setWatchTextTargetId,
  setWatchTextTargetKind,
  setWatchWebInteractive,
  setWatchWebScroll,
  setWatchWebURL,
  watchChartEntityIds,
  watchChartRange,
  watchChartStyle,
  watchMapEntityIds,
  watchMapStyle,
  watchMapZoom,
  watchPhoneTileKindOf,
  watchTextPlaceholder,
  watchTextSubmit,
  watchTextTargetDomain,
  watchTextTargetField,
  watchTextTargetId,
  watchTextTargetKind,
  watchWebInteractive,
  watchWebScroll,
  watchWebURL,
  watchWebURLNote,
} from "./phone-tiles-model.js";
import { watchTemplateRichText, watchTemplateTileLook } from "./preview.js";
import { commit, fieldNote, linkButton, menuField, typed, typingField } from "./tile-settings.js";
import { watchChoiceMenu, watchTileFallbackName } from "./tile-settings-options.js";
import { WATCH_VOICE_DEFAULTS_UNKNOWN_TEXT } from "../watch-voice/defaults.js";
import {
  type WatchAppChoice,
  type WatchSpeakerListKey,
  type WatchVoiceChoice,
  WATCH_APP,
  addWatchMusicHubPreset,
  addWatchMusicHubSpeakers,
  moveWatchMusicHubPreset,
  moveWatchMusicHubSpeaker,
  removeWatchMusicHubPreset,
  removeWatchMusicHubSpeaker,
  renameWatchMusicHubPreset,
  setWatchAssistListen,
  setWatchAssistMode,
  setWatchAssistReplySpeaker,
  setWatchAssistVolumeMode,
  setWatchMusicHubAlbumArt,
  setWatchSpeakListen,
  setWatchSpeakOutput,
  setWatchSpeakVolumeMode,
  setWatchTemplatePreset,
  setWatchTemplateText,
  setWatchVoiceId,
  setWatchVoiceSpeakers,
  setWatchVoiceVolume,
  toggleWatchMusicHubPresetSpeaker,
  watchAgentDisplay,
  watchAssistSettings,
  watchConversationAgents,
  watchEngineDisplay,
  watchEngineName,
  watchInboxTopicWords,
  watchMusicHubCanAddPreset,
  watchMusicHubPresets,
  watchMusicHubSpeakerChoices,
  watchMusicHubSpeakerIds,
  watchPointControlSwitches,
  watchSpeakSettings,
  watchSpeakerChoices,
  watchSpeakerCountSummary,
  watchSpeakerListSummary,
  watchTTSEngines,
  watchTemplatePresetSelected,
  watchTemplateText,
  watchVoiceMenu,
} from "./app-model.js";

const A = WATCH_APP;

/** The kinds this module draws a task for. */
const APP_KINDS: ReadonlySet<string> = new Set(["template", "music_hub", "assist", "speak_message", "point_control", "webhook_inbox"]);

/** The line shown while neither the watch's voice settings nor the iPhone's
 * catalog says what the voice defaults are (`watch-voice/defaults.ts`). */
export { WATCH_VOICE_DEFAULTS_UNKNOWN_TEXT };

/** Whether a tile's task is one of the app kinds' (a template, music hub,
 * assist, speak message, point control or webhook inbox tile). */
export function isWatchAppTaskKind(kind: string | undefined): boolean {
  return kind !== undefined && APP_KINDS.has(kind);
}

/** The page and tile ids the setters take. */
function at(host: TileSettingsHost): [string, string] {
  return [host.pageId, host.tileId];
}

/** An entity's friendly name, else its object id made readable. */
function nameOf(host: TileSettingsHost, entityId: string): string {
  const friendly = host.hass.states[entityId]?.attributes?.friendly_name;
  if (typeof friendly === "string" && friendly.trim() !== "") return friendly;
  const object = entityId.slice(entityId.indexOf(".") + 1).replaceAll("_", " ");
  return object.charAt(0).toUpperCase() + object.slice(1);
}

function unavailable(host: TileSettingsHost, entityId: string): boolean {
  const state = host.hass.states[entityId]?.state;
  return state === undefined || state === "unavailable";
}

function seg(choices: readonly WatchAppChoice[], short = false): [string, string][] {
  return choices.map((c) => [c.value, short ? (c.shortLabel ?? c.label) : c.label]);
}

function detailOf(choices: readonly WatchAppChoice[], value: string): string | undefined {
  const c = choices.find((x) => x.value === value);
  return c?.detail ?? c?.help;
}

// ── the section ──────────────────────────────────────────────────────────

/** What the folded section says it holds. */
export function appSummary(host: TileSettingsHost, kind: string): string {
  const tile = host.tile;
  switch (kind) {
    case "template": {
      const preset = A.template.presets.find((p) => watchTemplatePresetSelected(tile, p));
      return preset !== undefined ? preset.label : watchTemplateText(tile).trim() === "" ? "Empty" : "Custom";
    }
    case "music_hub": {
      const n = watchMusicHubSpeakerIds(tile).length;
      return `${n} speaker${n === 1 ? "" : "s"}`;
    }
    case "assist":
      return A.assist.modes.find((m) => m.value === watchAssistSettings(tile).mode)?.label ?? "";
    case "speak_message":
      return A.speak.outputs.find((o) => o.value === watchSpeakSettings(tile).output)?.label ?? "";
    case "webhook_inbox":
      return watchInboxTopicWords(tileEntityId(tile));
    default:
      return "";
  }
}

/** The task's rows for an app kind's tile. */
export function renderAppTask(host: TileSettingsHost, kind: string): TemplateResult {
  switch (kind) {
    case "template":
      return renderTemplate(host);
    case "music_hub":
      return renderMusicHub(host);
    case "assist":
      return renderAssist(host);
    case "speak_message":
      return renderSpeak(host);
    case "point_control":
      return renderPointer(host);
    case "webhook_inbox":
      return renderInboxLine(host);
    default:
      return html``;
  }
}

/** A webhook inbox tile's line, where its kind's task would be: it has none
 * here, its topics live on the iPhone. */
export function renderInboxLine(host: TileSettingsHost): TemplateResult {
  return html`<p class="hint ap-inbox">${A.webhookInbox.setUpLine}
    <span class="ap-faint">${watchInboxTopicWords(tileEntityId(host.tile))}</span></p>`;
}

// ── Template ─────────────────────────────────────────────────────────────

function renderTemplate(host: TileSettingsHost): TemplateResult {
  const tile = host.tile;
  const text = watchTemplateText(tile);
  const look = watchTemplateTileLook(tile, { page: host.page, templates: host.templateRenders });
  // Each keystroke writes at once, as typed; one visit to the field is one
  // undo step, as one opening of the phone's editor sheet is. A recipe or an
  // entity put in is a step of its own.
  const write = (value: string, typing: boolean) =>
    commit(host, "template", (d) => setWatchTemplateText(d, ...at(host), value), typing ? { typing: true } : {});
  let result: TemplateResult;
  // The rich text as the tile draws it (symbols, their colors, the tile's
  // color, centered for one line), never the markup.
  if (text.trim() === "") result = html`<div class="hint">Empty: the tile shows its symbol.</div>`;
  else if (look.kind === "error") result = html`<div class="hint warn" role="status">${look.error}</div>`;
  else if (look.kind !== "text" || look.pending) result = html`<div class="hint">Rendering in Home Assistant…</div>`;
  else {
    result = html`<div class="ap-render" role="img" aria-label=${`Rendered: ${look.text}`}
      style=${`color:${look.ink};text-align:${look.multiLine ? "left" : "center"}`}>${watchTemplateRichText(look.text, look.ink, 14, host.icons)}</div>`;
  }
  return html`
    <div class="ts-sub-h"><span>Examples</span></div>
    <div class="ts-chips">${A.template.presets.map((p) => {
      const on = watchTemplatePresetSelected(tile, p);
      return html`<button type="button" class="pe-chip ${on ? "on" : ""}" aria-pressed=${on ? "true" : "false"}
        @click=${() => commit(host, "templatePreset", (d) => setWatchTemplatePreset(d, ...at(host), p.id))}>${p.label}</button>`;
    })}</div>
    <div class="ap-text">${templateBox(host, text, {
      label: "Jinja2 Template", rows: 6, key: `tile-${host.tileId}-tpl`, use: "text", bare: false,
      placeholder: "Tap to edit template...", error: look.kind === "error" ? look.error : undefined,
      write,
      onBlur: () => host.endCoalesce(),
    })}</div>
    <div class="ts-sub-h"><span>Preview</span></div>
    ${result}
    <div class="hint">Add [icon:symbolName] for inline SF Symbols, e.g. [icon:lightbulb.fill]</div>
    <div class="hint">Color one icon with [icon:snowflake color:blue] or color:#FF8800</div>`;
}

// ── Music ────────────────────────────────────────────────────────────────

function renderMusicHub(host: TileSettingsHost): TemplateResult {
  const tile = host.tile;
  const w = A.musicHub.words;
  const speakers = watchMusicHubSpeakerIds(tile);
  const presets = watchMusicHubPresets(tile);
  const choices = watchMusicHubSpeakerChoices(host.hass.states).filter((c) => !speakers.includes(c.entityId));
  const addSpeaker = (id: string) => {
    if (id !== "") commit(host, "musicSpeakers", (d) => addWatchMusicHubSpeakers(d, ...at(host), [id]));
  };
  const options = [
    { value: "", label: choices.length === 0 ? "No more grouping speakers" : "Pick a speaker" },
    ...choices.map((c) => ({ value: c.entityId, label: unavailable(host, c.entityId) ? `${c.name} (unavailable)` : c.name })),
  ];
  return html`
    ${checkField(w.albumArt, tile.showAlbumArt !== false, (on) => commit(host, "albumArt", (d) => setWatchMusicHubAlbumArt(d, ...at(host), on)))}
    <div class="hint ts-under">${w.albumArtDetail}</div>
    <div class="ts-sub-h"><span>${w.speakerList}</span><span class="ap-faint">${speakers.length}</span></div>
    <div class="hint">${w.speakersHeader}</div>
    ${speakers.length === 0 ? html`<div class="hint">${w.noSpeakers}</div>` : nothing}
    ${speakers.map((id, i) => html`<div class="sp-list-row ap-row"><span>${nameOf(host, id)}${unavailable(host, id) ? html` <span class="ap-faint">unavailable</span>` : nothing}</span>
      <button type="button" class="sp-icon-btn" ?disabled=${i === 0} aria-label="Move ${nameOf(host, id)} up"
        @click=${() => commit(host, "musicOrder", (d) => moveWatchMusicHubSpeaker(d, ...at(host), i, i - 1))}>${uiIcon("up")}</button>
      <button type="button" class="sp-icon-btn" ?disabled=${i === speakers.length - 1} aria-label="Move ${nameOf(host, id)} down"
        @click=${() => commit(host, "musicOrder", (d) => moveWatchMusicHubSpeaker(d, ...at(host), i, i + 1))}>${uiIcon("down")}</button>
      <button type="button" class="sp-icon-btn" aria-label="Remove ${nameOf(host, id)}" title="Also leaves every preset"
        @click=${() => commit(host, "musicSpeakers", (d) => removeWatchMusicHubSpeaker(d, ...at(host), i))}>${uiIcon("delete")}</button></div>`)}
    ${menuField(w.addSpeaker, { options, selected: "" }, addSpeaker)}
    <div class="hint">${w.speakersFooter}</div>
    <div class="ts-sub-h"><span>${w.presets}</span><span class="ap-faint">${w.presetCount.replace("{count}", String(presets.length)).replace("{max}", String(A.musicHub.maxPresets))}</span></div>
    <div class="hint">${w.presetsHeader}</div>
    ${presets.map((p, i) => {
      const setting = `presetName:${i}`;
      return html`<div class="sp-card">
        <div class="sp-card-h"><span class="sp-name">${p.name === "" ? "Untitled" : p.name}</span>
          <span class="sp-faint">${p.speakerIds.length} speaker${p.speakerIds.length === 1 ? "" : "s"}</span>
          <button type="button" class="sp-icon-btn" ?disabled=${i === 0} aria-label="Move ${p.name} up"
            @click=${() => commit(host, "presetOrder", (d) => moveWatchMusicHubPreset(d, ...at(host), i, i - 1))}>${uiIcon("up")}</button>
          <button type="button" class="sp-icon-btn" ?disabled=${i === presets.length - 1} aria-label="Move ${p.name} down"
            @click=${() => commit(host, "presetOrder", (d) => moveWatchMusicHubPreset(d, ...at(host), i, i + 1))}>${uiIcon("down")}</button>
          <button type="button" class="sp-icon-btn" aria-label="Remove ${p.name}"
            @click=${() => commit(host, "presets", (d) => removeWatchMusicHubPreset(d, ...at(host), i))}>${uiIcon("delete")}</button></div>
        ${typingField(host, setting, textField("Name", typed(host, setting) ?? p.name, (v) =>
          commit(host, setting, (d) => renameWatchMusicHubPreset(d, ...at(host), i, v), { typing: true })))}
        ${speakers.map((id) => checkField(nameOf(host, id), p.speakerIds.includes(id), () =>
          commit(host, `presetSpeakers:${i}`, (d) => toggleWatchMusicHubPresetSpeaker(d, ...at(host), i, id))))}
      </div>`;
    })}
    ${watchMusicHubCanAddPreset(tile)
      ? html`<div class="ts-chips"><button type="button" class="pe-chip" @click=${() => commit(host, "presets", (d) => addWatchMusicHubPreset(d, ...at(host)))}>${w.addPreset}</button></div>`
      : nothing}`;
}

// ── Assist and Speak ─────────────────────────────────────────────────────

/** The voice defaults: the watch's voice settings when Home Assistant holds
 * them, else the catalog's, or undefined when neither says (a phone older
 * than the key, or no catalog, and no voice record). */
function voiceOf(host: TileSettingsHost) {
  return host.voice ?? host.catalog?.voice;
}

/** A checklist over the speakers (announce bit first), the stored ids the
 * list does not have kept at the end; a tick writes the whole list. */
function speakerChecklist(host: TileSettingsHost, label: string, key: WatchSpeakerListKey, stored: readonly string[]): TemplateResult {
  const list = watchSpeakerChoices(host.hass.states);
  const all = watchVoiceMenu(list, stored);
  const toggle = (id: string, on: boolean) => {
    const next = on ? [...stored, id] : stored.filter((s) => s !== id);
    commit(host, key, (d) => setWatchVoiceSpeakers(d, ...at(host), key, next));
  };
  // An unavailable speaker is marked as the Music task marks it.
  const name = (c: WatchVoiceChoice) =>
    c.missing ? `${c.entityId} (not found)` : unavailable(host, c.entityId) ? `${c.name} (unavailable)` : c.name;
  const row = (c: WatchVoiceChoice) => checkField(name(c), stored.includes(c.entityId), (on) => toggle(c.entityId, on));
  const announcing = list.filter((c) => c.announces);
  const others = all.filter((c) => !announcing.some((a) => a.entityId === c.entityId));
  return html`<div class="ts-sub-h"><span>${label}</span></div>
    <div class="ap-list" role="group" aria-label=${label}>
      ${all.length === 0 ? html`<div class="hint">No media players in Home Assistant.</div>` : nothing}
      ${announcing.length > 0 ? html`<div class="ap-group">Speakers</div>${announcing.map(row)}` : nothing}
      ${others.length > 0 ? html`${announcing.length > 0 ? html`<div class="ap-group">Other Media Players</div>` : nothing}${others.map(row)}` : nothing}
    </div>`;
}

/** The Conversation Agent picker: the default first, named by the voice
 * defaults, then the agents. */
function agentMenu(host: TileSettingsHost, agent: string | undefined): TemplateResult {
  const voice = voiceOf(host);
  const agents = watchVoiceMenu(watchConversationAgents(host.hass.states), agent === undefined ? [] : [agent]);
  const name = (id: string) => agents.find((c) => c.entityId === id && !c.missing)?.name ?? watchAgentDisplay(id, undefined);
  const fallback = voice === undefined ? "Default" : watchAgentDisplay(undefined, voice.defaultAssistAgentId, name);
  const options = [{ value: "", label: fallback }, ...agents.map((c) => ({ value: c.entityId, label: c.missing ? `${c.entityId} (not found)` : c.name }))];
  return html`
    <div class="ts-sub-h"><span>Assistant</span></div>
    ${menuField("Conversation Agent", { options, selected: agent ?? "" }, (v) =>
      commit(host, "agent", (d) => setWatchVoiceId(d, ...at(host), "assistAgentId", v === "" ? null : v)))}
    ${agent !== undefined
      ? html`<div class="ts-after">${linkButton(A.assist.agent.useDefault, "Remove this tile's agent", () =>
          commit(host, "agent", (d) => setWatchVoiceId(d, ...at(host), "assistAgentId", null)))}</div>`
      : nothing}
    <div class="hint ts-under">${A.assist.agent.help}</div>`;
}

/** The Voice Engine picker: the default first, named by the voice defaults
 * ("Not set" when there is none), then the engines. */
function engineMenu(host: TileSettingsHost, key: "assistTTSEngine" | "speakMessageTTSEngine", engine: string | undefined): TemplateResult {
  const voice = voiceOf(host);
  const services = Object.keys(host.hass.services?.tts ?? {});
  const engines = watchVoiceMenu(watchTTSEngines(host.hass.states, services, host.cloudTTS), engine === undefined ? [] : [engine]);
  const name = (id: string) => engines.find((c) => c.entityId === id && !c.missing)?.name ?? watchEngineName(id);
  // The phone's row: the tile's engine, else the default's name, else "Not
  // set" in the warning color.
  const fallback = voice === undefined ? undefined : watchEngineDisplay(undefined, voice.defaultTTSEngine, name);
  const options = [
    { value: "", label: fallback === undefined ? "Default" : fallback.configured ? `Default: ${fallback.text}` : fallback.text },
    ...engines.map((c) => ({ value: c.entityId, label: c.missing ? `${c.entityId} (not found)` : c.name })),
  ];
  return html`
    <div class="sp-contents ${engine === undefined && fallback?.configured === false ? "ap-unset" : ""}">
      ${menuField("Voice Engine", { options, selected: engine ?? "" }, (v) => commit(host, key, (d) => setWatchVoiceId(d, ...at(host), key, v === "" ? null : v)))}</div>
    ${engine !== undefined
      ? html`<div class="ts-after">${linkButton(A.voice.engine.useDefault, "Remove this tile's engine", () => commit(host, key, (d) => setWatchVoiceId(d, ...at(host), key, null)))}</div>`
      : nothing}
    <div class="hint ts-under">${A.voice.engine.help}</div>`;
}

/** Speech Volume and, unless it keeps the speakers' volume, Target Volume
 * with the three presets. */
function volumeRows(
  host: TileSettingsHost,
  mode: string,
  percent: number,
  setMode: (v: string) => void,
  key: "assistSpeechVolumePercent" | "speakMessageSpeechVolumePercent",
  short: boolean,
): TemplateResult {
  const v = A.voice.volume;
  const write = (value: number, typing: boolean) => commit(host, key, (d) => setWatchVoiceVolume(d, ...at(host), key, value), { typing });
  return html`
    ${short
      ? segField("Speech Volume", mode, seg(A.voice.volumeModes, true), (value) => setMode(value))
      : // Assist's long words, the phone's radio rows, as a menu.
        menuField("Speech Volume", { options: A.voice.volumeModes.map((c) => ({ value: c.value, label: c.label })), selected: mode }, setMode)}
    <div class="hint ts-under">${detailOf(A.voice.volumeModes, mode) ?? ""}</div>
    ${mode === "keepCurrent"
      ? nothing
      : html`${typingField(host, key, sliderField("Target Volume", percent, (value) => write(value, true), {
          min: v.min, max: v.max, step: v.step, def: v.absent, format: (n) => `${Math.round(n)}%`,
        }), percent)}
        <div class="ts-chips sp-indent">${v.presets.map((p) => html`<button type="button" class="pe-chip ${percent === p.value ? "on" : ""}"
          aria-pressed=${percent === p.value ? "true" : "false"} @click=${() => write(p.value, false)}>${p.label} ${p.value}%</button>`)}</div>`}`;
}

function listenRow(host: TileSettingsHost, on: boolean, set: (on: boolean) => void): TemplateResult {
  return html`<div class="ts-sub-h"><span>Voice Input</span></div>
    ${checkField("Start Listening Immediately", on, set)}`;
}

function voiceDefaultsLine(host: TileSettingsHost): TemplateResult | typeof nothing {
  return voiceOf(host) === undefined ? html`<div class="hint">${WATCH_VOICE_DEFAULTS_UNKNOWN_TEXT}.</div>` : nothing;
}

function renderAssist(host: TileSettingsHost): TemplateResult {
  const s = watchAssistSettings(host.tile);
  const speakReply = s.mode === A.assist.replySpeakerShownWith;
  const choose = speakReply && s.replySpeaker === "configuredSpeakers";
  return html`
    ${voiceDefaultsLine(host)}
    ${agentMenu(host, s.agent)}
    ${segField("Assist Mode", s.mode, seg(A.assist.modes), (v) => commit(host, "assistMode", (d) => setWatchAssistMode(d, ...at(host), v)))}
    <div class="hint ts-under">${detailOf(A.assist.modes, s.mode) ?? ""}</div>
    ${s.replyOutputMode !== undefined
      ? html`<div class="hint warn">An older reply setting decides this tile's reply on the ${hostDeviceNoun(host)}. An Assist Mode or Reply Speaker change removes it.</div>`
      : nothing}
    ${speakReply
      ? html`${segField("Reply Speaker", s.replySpeaker, seg(A.assist.replySpeakers), (v) => commit(host, "replySpeaker", (d) => setWatchAssistReplySpeaker(d, ...at(host), v)))}
        <div class="hint ts-under">${choose ? detailOf(A.assist.replySpeakers, s.replySpeaker) : A.assist.watchSpeakerNote}</div>`
      : nothing}
    ${choose
      ? html`${speakerChecklist(host, "Choose Speakers", "assistTargetSpeakerIds", s.speakers)}
        <div class="hint ${s.speakers.length === 0 ? "warn" : ""}">${watchSpeakerCountSummary(s.speakers)}</div>
        ${engineMenu(host, "assistTTSEngine", s.engine)}
        ${volumeRows(host, s.volumeMode, s.volumePercent, (v) => commit(host, "assistVolumeMode", (d) => setWatchAssistVolumeMode(d, ...at(host), v)), "assistSpeechVolumePercent", false)}`
      : nothing}
    ${listenRow(host, s.listen, (on) => commit(host, "assistListen", (d) => setWatchAssistListen(d, ...at(host), on)))}`;
}

function renderSpeak(host: TileSettingsHost): TemplateResult {
  const s = watchSpeakSettings(host.tile);
  const voice = voiceOf(host);
  const named = (ids: readonly string[]) => watchSpeakerListSummary(ids, (id) => nameOf(host, id));
  const hasEngine = s.engine !== undefined || (voice?.defaultTTSEngine ?? "").trim() !== "";
  return html`
    ${voiceDefaultsLine(host)}
    ${segField("Speaker", s.output, seg(A.speak.outputs), (v) => commit(host, "speakOutput", (d) => setWatchSpeakOutput(d, ...at(host), v)))}
    <div class="hint ts-under">${detailOf(A.speak.outputs, s.output) ?? ""}</div>
    ${s.output === "watchSpeaker" ? html`<div class="hint">${A.speak.watchSpeakerNote}</div>` : nothing}
    ${s.output === "configuredSpeakers"
      ? html`${speakerChecklist(host, "Choose Speakers", "speakMessageTargetSpeakerIds", s.speakers)}
        <div class="hint ${s.speakers.length === 0 ? "warn" : ""}">${named(s.speakers)}</div>`
      : nothing}
    ${s.output === "chooseEachTime"
      ? html`${speakerChecklist(host, "Speakers Shown on Watch", "speakMessageChooseListSpeakerIds", s.watchList)}
        <div class="hint">${named(s.watchList)}</div>
        ${s.watchList.length === 0 ? html`<div class="hint warn">${A.speak.warnings.chooseEachTimeEmptyList}</div>` : nothing}
        ${voice !== undefined && !hasEngine ? html`<div class="hint warn">${A.speak.warnings.chooseEachTimeNoEngine}</div>` : nothing}`
      : nothing}
    ${s.output === "watchSpeaker"
      ? nothing
      : html`${engineMenu(host, "speakMessageTTSEngine", s.engine)}
        ${volumeRows(host, s.volumeMode, s.volumePercent, (v) => commit(host, "speakVolumeMode", (d) => setWatchSpeakVolumeMode(d, ...at(host), v)), "speakMessageSpeechVolumePercent", true)}`}
    ${listenRow(host, s.listen, (on) => commit(host, "speakListen", (d) => setWatchSpeakListen(d, ...at(host), on)))}`;
}

// ── Pointer ──────────────────────────────────────────────────────────────

function renderPointer(host: TileSettingsHost): TemplateResult {
  return html`
    ${watchPointControlSwitches(host.behavior).map((s) => html`<div class="field ap-read"><span>${s.label}</span><b>${s.on ? "On" : "Off"}</b></div>
      <div class="hint ts-under">${s.detail}</div>`)}
    <div class="hint">${A.pointControl.readOnlyLine}</div>`;
}

// ── the kinds only the iPhone draws ──────────────────────────────────────
//
// A map, a chart, a text field and a web card (phone native pages, phase 3):
// the `phoneTile` section, before Icon, under the kind's title with the
// iPhone tag (`tile-settings.ts`). Their rules are `tile-app.json`
// `phoneTiles`, the setters `phone-tiles-model.ts`. No reset.

/** The task's rows for a tile only the iPhone draws; nothing for any other
 * tile. */
export function renderPhoneTileTask(host: TileSettingsHost): TemplateResult {
  switch (watchPhoneTileKindOf(host.tile)) {
    case "map":
      return renderMap(host);
    case "chart":
      return renderChart(host);
    case "text_field":
      return renderTextField(host);
    case "web":
      return renderWebCard(host);
    default:
      return html``;
  }
}

/** An entity as an entity field holds it. */
function entityRef(host: TileSettingsHost, entityId: string): EntityRef {
  return { entityId, displayName: entityId === "" ? "" : nameOf(host, entityId), domain: tileKind(entityId) };
}

/** A list of entities, each with its remove button, then the field that
 * adds one (left out once the list is full, with `full` in its place). */
function entityList(
  host: TileSettingsHost,
  setting: string,
  ids: readonly string[],
  remove: (id: string) => void,
  add: TemplateResult | undefined,
  full: string,
): TemplateResult {
  return html`
    ${ids.map((id) => html`<div class="sp-card"><div class="sp-card-h">
      <span class="sp-name" title=${id}>${nameOf(host, id)}</span>
      ${unavailable(host, id) ? html`<span class="sp-faint">Not in Home Assistant</span>` : nothing}
      <button type="button" class="sp-icon-btn" aria-label="Remove ${nameOf(host, id)}" title="Remove"
        @click=${() => remove(id)}>${uiIcon("delete")}</button></div></div>`)}
    ${add === undefined ? html`<div class="hint">${full}</div>` : html`<div class="ts-stack">${add}</div>`}
    ${fieldNote(host, setting)}`;
}

function choiceMenu(rule: { choices: readonly { value: string; label: string }[] }, value: string) {
  return watchChoiceMenu(rule.choices.map((c) => ({ value: c.value, label: c.label })), value);
}

function renderMap(host: TileSettingsHost): TemplateResult {
  const tile = host.tile;
  const ids = watchMapEntityIds(tile);
  const add = (next: EntityRef) => {
    const id = next.entityId.trim();
    if (id === "") return;
    if (!WATCH_MAP_ENTITY_DOMAINS.includes(tileKind(id))) return commit(host, "mapAdd", (d) => d, { reason: "Pick a person, a device tracker or a zone." });
    if (ids.includes(id)) return commit(host, "mapAdd", (d) => d, { reason: "That one is on the map already." });
    commit(host, "mapAdd", (d) => addWatchMapEntity(d, ...at(host), id));
  };
  return html`
    <div class="hint">A marker for each person or tracker, a circle for each zone.</div>
    ${entityList(host, "mapAdd", ids, (id) => commit(host, "mapAdd", (d) => removeWatchMapEntity(d, ...at(host), id)),
      entityField({ hass: host.hass }, "Add to map", entityRef(host, ""), add, `pe:ph:mapAdd:${host.tileId}`, { domain: WATCH_MAP_ENTITY_DOMAINS, clearable: false }), "")}
    ${menuField("Zoom", choiceMenu(WATCH_MAP_ZOOMS, watchMapZoom(tile)), (v) => commit(host, "mapZoom", (d) => setWatchMapZoom(d, ...at(host), v)))}
    <div class="hint ts-under">Fit shows every marker. City and Street center on the first one.</div>
    ${menuField("Style", choiceMenu(WATCH_MAP_STYLES, watchMapStyle(tile)), (v) => commit(host, "mapStyle", (d) => setWatchMapStyle(d, ...at(host), v)))}`;
}

function renderChart(host: TileSettingsHost): TemplateResult {
  const tile = host.tile;
  const ids = watchChartEntityIds(tile);
  const max = WATCH_CHART_MAX_ENTITIES;
  const add = (next: EntityRef) => {
    const id = next.entityId.trim();
    if (id === "") return;
    if (ids.includes(id)) return commit(host, "chartAdd", (d) => d, { reason: "That entity is on the chart already." });
    commit(host, "chartAdd", (d) => addWatchChartEntity(d, ...at(host), id));
  };
  const field = ids.length >= max
    ? undefined
    : entityField({ hass: host.hass }, "Add entity", entityRef(host, ""), add, `pe:ph:chartAdd:${host.tileId}`, { preferNumeric: true, clearable: false });
  return html`
    <div class="hint">Up to ${max} entities over one time range, named in the legend.</div>
    ${entityList(host, "chartAdd", ids, (id) => commit(host, "chartAdd", (d) => removeWatchChartEntity(d, ...at(host), id)),
      field, `The chart holds ${max}. Remove one to add another.`)}
    ${menuField("Range", choiceMenu(WATCH_CHART_RANGES, watchChartRange(tile)), (v) => commit(host, "chartRange", (d) => setWatchChartRange(d, ...at(host), v)))}
    ${menuField("Style", choiceMenu(WATCH_CHART_STYLES, watchChartStyle(tile)), (v) => commit(host, "chartStyle", (d) => setWatchChartStyle(d, ...at(host), v)))}`;
}

function renderTextField(host: TileSettingsHost): TemplateResult {
  const tile = host.tile;
  const kind = watchTextTargetKind(tile);
  const domain = watchTextTargetDomain(kind);
  const target = watchTextTargetId(tile);
  const pickTarget = (next: EntityRef, source?: string) => {
    const id = next.entityId.trim();
    if (id === "" || source === "clear") return commit(host, "textTarget", (d) => setWatchTextTargetId(d, ...at(host), ""));
    if (domain === undefined || tileKind(id) !== domain) {
      return commit(host, "textTarget", (d) => d, { reason: domain === "script" ? "Pick a script." : "Pick an input text." });
    }
    commit(host, "textTarget", (d) => setWatchTextTargetId(d, ...at(host), id));
  };
  const placeholderKey = "textPlaceholder";
  const fieldKey = "textField";
  return html`
    ${menuField("Sends to", choiceMenu(WATCH_TEXT_TARGET_KINDS, kind), (v) => commit(host, "textKind", (d) => setWatchTextTargetKind(d, ...at(host), v)))}
    <div class="hint ts-under">${kind === "script"
      ? "Runs the script with the text in the field named below."
      : kind === "assist" ? "Asks Assist, and shows the reply under the field." : "Sets the input text to what was typed."}</div>
    ${domain === undefined
      ? nothing
      : html`<div class="ts-stack">${entityField({ hass: host.hass }, domain === "script" ? "Script" : "Input text", entityRef(host, target), pickTarget,
          `pe:ph:textTarget:${host.tileId}`, { domain, needed: target === "" })}</div>${fieldNote(host, "textTarget")}`}
    ${kind === "script"
      ? typingField(host, fieldKey, textField("Field name", typed(host, fieldKey) ?? watchTextTargetField(tile), (v) =>
          commit(host, fieldKey, (d) => setWatchTextTargetField(d, ...at(host), v), { typing: true }), { placeholder: "text", mono: true }))
      : nothing}
    ${typingField(host, placeholderKey, textField("Placeholder", typed(host, placeholderKey) ?? watchTextPlaceholder(tile), (v) =>
      commit(host, placeholderKey, (d) => setWatchTextPlaceholder(d, ...at(host), v), { typing: true }), { placeholder: tileName(host) }))}
    <div class="hint ts-under">Grey text in the empty field. Empty shows the tile's name.</div>
    ${menuField("Submit with", choiceMenu(WATCH_TEXT_SUBMITS, watchTextSubmit(tile)), (v) => commit(host, "textSubmit", (d) => setWatchTextSubmit(d, ...at(host), v)))}`;
}

/** The tile's name as the iPhone draws it: its label, else its kind's. */
function tileName(host: TileSettingsHost): string {
  const label = host.tile.customLabel;
  return typeof label === "string" && label.trim() !== "" ? label : watchTileFallbackName(host.tile, host.hass.states, [], host.catalog);
}

function renderWebCard(host: TileSettingsHost): TemplateResult {
  const tile = host.tile;
  const key = "webURL";
  const url = typed(host, key) ?? watchWebURL(tile);
  const note = watchWebURLNote(url);
  return html`
    ${typingField(host, key, textField("Address", url, (v) => commit(host, key, (d) => setWatchWebURL(d, ...at(host), v), { typing: true }),
      { placeholder: "https://", mono: true }))}
    ${note === undefined ? nothing : html`<div class="hint warn ts-under" role="status">${note}</div>`}
    <div class="hint ts-under">${WATCH_WEB_CARD_HELP}</div>
    ${checkField("Scroll", watchWebScroll(tile), (on) => commit(host, "webScroll", (d) => setWatchWebScroll(d, ...at(host), on)))}
    <div class="hint ts-under">The page scrolls inside the tile.</div>
    ${checkField("Interactive", watchWebInteractive(tile), (on) => commit(host, "webInteractive", (d) => setWatchWebInteractive(d, ...at(host), on)))}
    <div class="hint ts-under">The page takes taps inside the tile. Off: a tap opens it full screen.</div>`;
}

/** The kinds whose task has no reset in this module's tasks: template,
 * music hub, point control and the inbox line. */
export function watchAppTaskHasReset(kind: string): boolean {
  return kind === "assist" || kind === "speak_message";
}

export const appSettingsStyles = css`
  .ap-faint { color: var(--wa-muted); font-size: 11.5px; font-weight: 400; }
  .ap-inbox { margin: 6px 0 2px; }
  .ap-text { align-items: flex-start; }
  .ap-text textarea { width: 100%; min-height: 96px; resize: vertical; font: 12px/1.4 ui-monospace, SFMono-Regular, Menlo, monospace;
    color: var(--wa-ink); background: var(--wa-field); border: 1px solid var(--wa-line); border-radius: 6px; padding: 6px 8px; box-sizing: border-box; }
  .ap-render { margin: 2px 0 4px; padding: 8px 10px; border-radius: 10px; background: #000;
    font: 600 14px/1.25 ui-rounded, "SF Pro Rounded", "Nunito", system-ui, sans-serif; white-space: pre-wrap; overflow-wrap: anywhere;
    max-height: 140px; overflow: auto; }
  .ap-render .wp-tpl-icon { display: inline-block; vertical-align: -0.12em; }
  .ap-row > span { min-width: 0; }
  .ap-list { display: flex; flex-direction: column; max-height: 220px; overflow: auto; padding: 2px 0; }
  /* A row keeps its own height in the scrolling list, and a speaker's name
     runs the row's width with its switch at the end: in the label column the
     long names wrapped over each other. */
  .ap-list > * { flex: none; }
  .ap-list .field.check { grid-template-columns: minmax(0, 1fr) auto; min-height: 28px; }
  .ap-list .field.check > span { color: var(--wa-ink); }
  .ap-group { font-size: 11px; font-weight: 600; color: var(--wa-muted); text-transform: uppercase; letter-spacing: .04em; padding: 6px 0 2px; }
  .ap-read b { font-weight: 600; }
  .ap-unset select { color: var(--wa-warn, #c47f00); }
`;
