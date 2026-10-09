// The voice editor's views, drawn from a host, in the complication editor's
// chrome (`editor-chrome.ts`) as the menu editor wears it: the Voice card,
// which picks the settings the inspector shows (the defaults, or the watch's
// own speech settings); the Phrases card, the phrase library with add,
// reorder and remove; the watch preview, Pick from List as the watch lists
// the phrases; and the inspector, a picked phrase's cards or the picked
// settings. `<wa-voice-editor>` owns the draft and hands a host in on every
// draw; nothing here keeps state of its own beyond `uiState`.
//
// Every edit is a setter of `model.ts` applied to the document as it is at
// the moment the edit commits (`host.edit`), never to the one drawn.
//
// Plan: app repo docs/pages_in_home_assistant_step4.md ("4d batch 2 build
// contract", item 3).

import { css, html, nothing, type TemplateResult } from "lit";
import { live } from "lit/directives/live.js";
import { sectionCard } from "../editor-chrome.js";
import { checkField, colorField, entityField, segField, selectField, sliderField, symbolField, textField } from "../editors.js";
import type { HassLike } from "../ha-api.js";
import { SECTION_COLOR } from "../kinds.js";
import type { EntityRef } from "../model.js";
import type { IconProvider } from "../renderer.js";
import type { SymbolBrowser } from "../symbols.js";
import { type UiIconName, uiIcon } from "../ui-icons.js";
import { renderWatchFrame } from "../watch-frame.js";
import { watchSpeakerChoices, watchTTSEngines, watchVoiceMenu, type WatchVoiceChoice } from "../watch-pages/app-model.js";
import { type FoldId, anySectionOpen, sectionOpen, setSectionOpen, setSectionsOpen } from "../watch-pages/fold-memory.js";
import type { JsonObject } from "../watch-pages/model.js";
import { voiceGlyph } from "./hook.js";
import {
  VOICE_KEYS,
  type VoiceDocument,
  WATCH_VOICES_EMPTY_TEXT,
  WATCH_VOICE_MAX_PHRASES,
  type WatchVoiceInfo,
  addWatchVoicePhrase,
  findWatchVoicePhrase,
  groupWatchVoices,
  isPlainVoiceColor,
  moveWatchVoicePhrase,
  removeWatchVoicePhrase,
  setWatchVoiceAgent,
  setWatchVoiceEngine,
  setWatchVoiceIdentifier,
  setWatchVoicePhraseKey,
  setWatchVoiceSilentMode,
  toggleWatchVoicePhraseSpeaker,
  toggleWatchVoiceSpeaker,
  voiceColorWords,
  watchVoiceDefaultsOf,
  watchVoiceEnumChoices,
  watchVoiceIdentifier,
  watchVoiceLabel,
  watchVoicePhraseId,
  watchVoicePhraseMissing,
  watchVoicePhraseName,
  watchVoicePhraseRouted,
  watchVoicePhraseVolumeMode,
  watchVoicePhraseVolumePercent,
  watchVoicePhrases,
  watchVoicePhrasesFull,
  watchVoiceSilentMode,
} from "./model.js";

/** How the watch's voice list stands: not asked yet, in, failed, or an
 * integration that keeps none. */
export type WatchVoicesState = "loading" | "ready" | "error" | "unsupported";

/** What the views are handed on every draw. `document` and `busy` are read
 * live. */
export interface VoiceViewHost {
  readonly hass: HassLike;
  readonly icons: IconProvider;
  readonly symbols: SymbolBrowser;
  readonly document: VoiceDocument;
  /** A save is out: every field is drawn off and every edit refused. */
  readonly busy: boolean;
  readonly uiState: Map<string, unknown>;
  /** The watch's screen in points. */
  readonly screen: { readonly width: number; readonly height: number };
  /** Points to pixels for the canvas's watch. */
  readonly scale: number;
  /** The voices the watch reported, as last read. */
  readonly voices: readonly WatchVoiceInfo[];
  readonly voicesState: WatchVoicesState;
  /** Whether Home Assistant Cloud is connected, so `tts.cloud` is an engine;
   * undefined until known. */
  readonly cloudTTS?: boolean | undefined;
  /** Apply `change` to the document as it is now: one undo step, or with
   * `coalesce` a step the next edits with the same key replace. */
  edit(change: (document: VoiceDocument) => VoiceDocument, coalesce?: string): boolean;
  endCoalesce(): void;
  requestUpdate(): void;
}

/** The two groups of settings the Voice card picks. */
export type VoiceSection = "defaults" | "watch";

export const VOICE_SECTIONS: readonly [VoiceSection, string][] = [
  ["defaults", "Defaults"],
  ["watch", "On the watch"],
];

/** What each group is, one line. */
export const VOICE_SECTION_LINES: Readonly<Record<VoiceSection, string>> = {
  defaults: "What Assist and Speak use when a tile, a slot or a phrase picks nothing of its own.",
  watch: "How the watch itself speaks a reply.",
};

export const VOICE_CARD_LINE = "The voice defaults, the phrase library and the watch's own speech. A save reaches the watch the next time it checks.";

export const VOICE_STAGE_HINT = "Pick from List shows these phrases on the watch. Tap one to edit it.";

/** The inspector's cards. */
export type VoiceInspectorSection = "defaults" | "watch" | "phrase" | "look" | "speech";

export const VOICE_SECTION_BADGES: Readonly<Record<VoiceInspectorSection, { color: string; icon: UiIconName }>> = {
  defaults: { color: SECTION_COLOR.content, icon: "content" },
  watch: { color: SECTION_COLOR.content, icon: "watch" },
  phrase: { color: SECTION_COLOR.content, icon: "text" },
  look: { color: SECTION_COLOR.look, icon: "look" },
  speech: { color: SECTION_COLOR.content, icon: "content" },
};

/** The breadcrumb chips. */
export const VOICE_CHIP_COLOR = "#ab47bc";

const FOLD_MODULE = "voice-editor";
const THUMB_W = 44;
const THUMB_H = 22;

// ── shared bits ──────────────────────────────────────────────────────────

function nameOf(hass: HassLike, entityId: string): string {
  const name = hass.states[entityId]?.attributes?.friendly_name;
  return typeof name === "string" && name.trim() !== "" ? name : entityId;
}

function refOf(hass: HassLike, entityId: string): EntityRef {
  const dot = entityId.indexOf(".");
  return { entityId, displayName: entityId === "" ? "" : nameOf(hass, entityId), domain: dot > 0 ? entityId.slice(0, dot) : "" };
}

function glyph(host: Pick<VoiceViewHost, "icons">, icon: string, size: number, color: string): TemplateResult {
  return host.icons.render(icon, size, color) ?? html`<span class="vo-glyph-dot" style=${`background:${color}`}></span>`;
}

/**
 * A phrase color as CSS: a plain color as it is, the phone's gradient
 * (`GRADIENT|#a|#b`) as a linear gradient, its rainbow as a conic one; the
 * first color of either for a glyph, which takes one color.
 */
export function voicePhraseColorCss(value: unknown): { fill: string; ink: string } {
  if (typeof value !== "string" || value === "") return { fill: "#D88CC4", ink: "#D88CC4" };
  if (value.toUpperCase() === "#RAINBOW") {
    return { fill: "conic-gradient(#FF3B30, #FF9500, #FFCC00, #34C759, #007AFF, #AF52DE, #FF3B30)", ink: "#FF9500" };
  }
  if (value.toUpperCase().startsWith("GRADIENT|")) {
    const stops = value.split("|").slice(1).filter((s) => /^#[0-9a-fA-F]{6}$/.test(s));
    if (stops.length >= 2) return { fill: `linear-gradient(135deg, ${stops.join(", ")})`, ink: stops[0]! };
    if (stops.length === 1) return { fill: stops[0]!, ink: stops[0]! };
  }
  return { fill: value, ink: value };
}

function isOpen(host: Pick<VoiceViewHost, "uiState">, section: string): boolean {
  return sectionOpen(host.uiState, FOLD_MODULE, section);
}

function toggle(host: Pick<VoiceViewHost, "uiState" | "requestUpdate">, section: string): void {
  setSectionOpen(host.uiState, FOLD_MODULE, section, !isOpen(host, section));
  host.requestUpdate();
}

function card(host: VoiceViewHost, badge: VoiceInspectorSection, title: string, body: TemplateResult, extra: { summary?: string; dot?: boolean } = {}): TemplateResult {
  const open = isOpen(host, badge);
  const mark = VOICE_SECTION_BADGES[badge];
  return sectionCard({
    color: mark.color,
    icon: uiIcon(mark.icon),
    title,
    open,
    onToggle: () => toggle(host, badge),
    ...(extra.summary === undefined || extra.summary === "" ? {} : { summary: extra.summary }),
    dot: extra.dot === true,
    id: `${FOLD_MODULE}:${badge}`,
  }, open ? body : html``);
}

// ── what is picked ───────────────────────────────────────────────────────

const PICK_KEY = "vo:pick";

/** What the inspector shows: a phrase (by id, while it is still there) or a
 * group of settings. The defaults until something is picked. */
export function voicePick(host: Pick<VoiceViewHost, "uiState" | "document">): { phrase: JsonObject } | { section: VoiceSection } {
  const stored = host.uiState.get(PICK_KEY);
  if (typeof stored === "string" && stored.startsWith("phrase:")) {
    const phrase = findWatchVoicePhrase(host.document, stored.slice("phrase:".length));
    if (phrase !== undefined) return { phrase };
  }
  return { section: stored === "watch" ? "watch" : "defaults" };
}

export function pickVoiceSection(host: Pick<VoiceViewHost, "uiState" | "requestUpdate">, section: VoiceSection): void {
  host.uiState.set(PICK_KEY, section);
  host.requestUpdate();
}

export function pickVoicePhrase(host: Pick<VoiceViewHost, "uiState" | "requestUpdate">, id: string): void {
  host.uiState.set(PICK_KEY, `phrase:${id}`);
  host.requestUpdate();
}

/** Let go of a picked phrase, back to the defaults. Whether there was one. */
export function deselectVoicePhrase(host: Pick<VoiceViewHost, "uiState" | "document" | "requestUpdate">): boolean {
  if (!("phrase" in voicePick(host))) return false;
  pickVoiceSection(host, "defaults");
  return true;
}

function addPhrase(host: VoiceViewHost): void {
  let added: string | undefined;
  host.edit((d) => {
    const result = addWatchVoicePhrase(d);
    added = result.id;
    return result.document;
  });
  if (added !== undefined) {
    setSectionOpen(host.uiState, FOLD_MODULE, "phrase", true);
    pickVoicePhrase(host, added);
  }
}

// ── the Voice card ───────────────────────────────────────────────────────

/** What a Voice row says under its name. */
export function voiceRowDetail(host: Pick<VoiceViewHost, "document" | "hass" | "voices">, section: VoiceSection): string {
  if (section === "defaults") {
    const d = watchVoiceDefaultsOf(host.document);
    const speakers = d.speakers.length === 0 ? "No speakers" : d.speakers.map((id) => nameOf(host.hass, id)).join(", ");
    return speakers;
  }
  const id = watchVoiceIdentifier(host.document);
  const voice = id === undefined ? undefined : host.voices.find((v) => v.id === id);
  return id === undefined ? "System voice" : voice !== undefined ? watchVoiceLabel(voice) : id;
}

export function renderVoiceCard(host: VoiceViewHost): TemplateResult {
  const pick = voicePick(host);
  const shown = "section" in pick ? pick.section : undefined;
  return html`<section class="card lc vo-voice-card" aria-label="Voice"
    style=${`--c: var(--wa-lc-pages, #26a69a); --thumb-w: ${THUMB_W}px; --thumb-h: ${THUMB_H}px`}>
    <div class="lc-head">
      <span class="swatch">${voiceGlyph()}</span><span class="lc-title">Voice</span>
      <span class="lc-sub" title=${VOICE_CARD_LINE}>for the watch</span>
    </div>
    <div class="layers vo-section-list" role="list">
      ${VOICE_SECTIONS.map(([id, label]) => {
        const on = id === shown;
        const go = () => pickVoiceSection(host, id);
        return html`<div class="layer vo-section-row ${on ? "hl" : ""}" data-section=${id} role="listitem" tabindex="0"
          aria-current=${on ? "true" : "false"} aria-label=${label} title=${VOICE_SECTION_LINES[id]}
          @click=${go}
          @keydown=${(e: KeyboardEvent) => {
            if (e.target !== e.currentTarget || (e.key !== "Enter" && e.key !== " ")) return;
            e.preventDefault();
            go();
          }}>
          <span class="grip" aria-hidden="true"></span>
          <span class="thumb vo-thumb" aria-hidden="true">${uiIcon(id === "watch" ? "watch" : "content")}</span>
          <span class="name"><b><span class="nm-t">${label}</span></b><small>${voiceRowDetail(host, id)}</small></span>
          <span class="right"></span>
        </div>`;
      })}
    </div>
  </section>`;
}

// ── the Phrases card ─────────────────────────────────────────────────────

function phraseThumb(host: Pick<VoiceViewHost, "icons">, phrase: JsonObject): TemplateResult {
  const color = voicePhraseColorCss(phrase.color);
  const icon = typeof phrase.icon === "string" && phrase.icon !== "" ? phrase.icon : "speaker.wave.2";
  return html`<span class="thumb vo-thumb" style=${`--c:${color.ink}`} aria-hidden="true"><span class="vo-thumb-glyph">${glyph(host, icon, 14, color.ink)}</span></span>`;
}

/** A phrase's row line: its message, or what it still needs. */
export function voicePhraseDetail(phrase: JsonObject): string {
  const missing = watchVoicePhraseMissing(phrase);
  if (missing.length > 0) return `Needs a ${missing.join(" and a ")}`;
  return typeof phrase.message === "string" ? phrase.message : "";
}

function phraseRow(host: VoiceViewHost, phrase: JsonObject, index: number, count: number, picked: JsonObject | undefined): TemplateResult {
  const id = watchVoicePhraseId(phrase);
  const on = picked !== undefined && watchVoicePhraseId(picked).toUpperCase() === id.toUpperCase();
  const name = watchVoicePhraseName(phrase);
  const detail = voicePhraseDetail(phrase);
  const needs = watchVoicePhraseMissing(phrase).length > 0;
  const go = () => pickVoicePhrase(host, id);
  return html`<div class="layer vo-phrase-row ${on ? "hl" : ""}" data-phrase=${id} role="listitem" tabindex="0"
    aria-current=${on ? "true" : "false"} aria-label=${name} title=${`${name} · ${detail}`}
    @click=${(e: Event) => { if (!(e.target instanceof Element && e.target.closest("button"))) go(); }}
    @keydown=${(e: KeyboardEvent) => {
      if (e.target !== e.currentTarget || (e.key !== "Enter" && e.key !== " ")) return;
      e.preventDefault();
      go();
    }}>
    <span class="grip" aria-hidden="true"></span>
    ${phraseThumb(host, phrase)}
    <span class="name"><b><span class="nm-t">${name}</span></b><small class=${needs ? "vo-needs" : ""}>${detail}</small></span>
    <span class="right">
      <span class="acts">
        <button type="button" class="icon" ?disabled=${host.busy || index === 0} title="Move up" aria-label=${`Move ${name} up`}
          @click=${() => host.edit((d) => moveWatchVoicePhrase(d, id, index - 1))}>${uiIcon("up")}</button>
        <button type="button" class="icon" ?disabled=${host.busy || index === count - 1} title="Move down" aria-label=${`Move ${name} down`}
          @click=${() => host.edit((d) => moveWatchVoicePhrase(d, id, index + 1))}>${uiIcon("down")}</button>
        <button type="button" class="icon danger" ?disabled=${host.busy} title="Remove" aria-label=${`Remove ${name}`}
          @click=${() => host.edit((d) => removeWatchVoicePhrase(d, id))}>${uiIcon("delete")}</button>
      </span>
    </span>
  </div>`;
}

/** The Phrases card: the library in its order, each phrase's icon in its
 * color, its name over its message, and move up, move down and remove; Add
 * puts a new phrase at the end, up to eight. */
export function renderPhrasesCard(host: VoiceViewHost): TemplateResult {
  const phrases = watchVoicePhrases(host.document);
  const pick = voicePick(host);
  const picked = "phrase" in pick ? pick.phrase : undefined;
  const full = watchVoicePhrasesFull(host.document);
  return html`<section class="card lc vo-phrases-card" aria-label="Phrases"
    style=${`--c: var(--wa-lc-layers, #4a7fe8); --thumb-w: ${THUMB_W}px; --thumb-h: ${THUMB_H}px`}>
    <div class="lc-head">
      <span class="swatch">${uiIcon("list")}</span><span class="lc-title">Phrases</span>
      <span class="lc-sub">${phrases.length} of ${WATCH_VOICE_MAX_PHRASES}</span>
      <span class="spacer"></span>
      <button type="button" class="lc-btn pri vo-add-phrase" aria-label="Add phrase" ?disabled=${host.busy || full}
        title=${full ? `The watch takes ${WATCH_VOICE_MAX_PHRASES} phrases at most.` : "Add a phrase at the end"}
        @click=${() => addPhrase(host)}>${uiIcon("plus")}<span>Add</span></button>
    </div>
    ${phrases.length === 0
      ? html`<div class="lc-note">No phrases yet. A phrase is a message Pick from List and Speak Phrase can say on your speakers.</div>`
      : html`<div class="layers vo-phrase-list" role="list">${phrases.map((p, i) => phraseRow(host, p, i, phrases.length, picked))}</div>`}
  </section>`;
}

// ── the watch preview ────────────────────────────────────────────────────

/** Pick from List on the watch: each phrase as the watch lists it, its icon
 * in a well of its color, or its label in a pill of its color, the picked
 * one lit. A phrase is a button that picks it. */
export function renderVoiceScreen(host: VoiceViewHost): TemplateResult {
  const { width, height } = host.screen;
  const scale = host.scale;
  const phrases = watchVoicePhrases(host.document);
  const pick = voicePick(host);
  const pickedId = "phrase" in pick ? watchVoicePhraseId(pick.phrase).toUpperCase() : undefined;
  const rows = phrases.map((p) => {
    const id = watchVoicePhraseId(p);
    const color = voicePhraseColorCss(p.color);
    const on = pickedId !== undefined && id.toUpperCase() === pickedId;
    const name = watchVoicePhraseName(p);
    const icon = typeof p.icon === "string" && p.icon !== "" ? p.icon : "speaker.wave.2";
    const text = p.displayMode === "text";
    return html`<button type="button" class="vo-say ${text ? "vo-words" : "vo-glyph"} ${on ? "on" : ""}" style=${`--fill:${color.fill};--ink:${color.ink}`}
      title=${name} aria-label=${name} aria-pressed=${on ? "true" : "false"} @click=${() => pickVoicePhrase(host, id)}>
      ${text ? html`<span class="vo-say-text">${name}</span>` : html`<span class="vo-say-well">${glyph(host, icon, Math.round(16 * scale), "#fff")}</span>
        <span class="vo-say-label">${name}</span>`}
    </button>`;
  });
  const box = html`<div class="vo-screen" role="group" aria-label="Pick from List on the watch"
    style=${`width:${Math.round(width * scale)}px;height:${Math.round(height * scale)}px;--vo-s:${scale}`}>
    <div class="vo-screen-title">Phrases</div>
    ${phrases.length === 0 ? html`<p class="vo-screen-note">No phrases yet.</p>` : html`<div class="vo-say-list">${rows}</div>`}
  </div>`;
  return renderWatchFrame({ width, height }, scale, box, "Pick from List on the watch");
}

/** What the canvas head says: "3 phrases". */
export function voiceStageFacts(host: Pick<VoiceViewHost, "document">): string[] {
  const n = watchVoicePhrases(host.document).length;
  return [`${n} ${n === 1 ? "phrase" : "phrases"}`];
}

// ── the inspector ────────────────────────────────────────────────────────

/** The cards drawn now that fold, for the inspector's Collapse all. */
export function voiceInspectorFolds(host: Pick<VoiceViewHost, "uiState" | "document">): FoldId[] {
  const pick = voicePick(host);
  const ids: VoiceInspectorSection[] = "phrase" in pick ? ["phrase", "look", "speech"] : [pick.section];
  return ids.map((section) => ({ module: FOLD_MODULE, section }));
}

export function renderVoiceInspector(host: VoiceViewHost): TemplateResult {
  const pick = voicePick(host);
  const folds = voiceInspectorFolds(host);
  const anyOpen = anySectionOpen(host.uiState, folds);
  let crumbs: TemplateResult;
  let body: TemplateResult;
  if ("phrase" in pick) {
    const name = watchVoicePhraseName(pick.phrase);
    crumbs = html`<div class="crumbs"><button class="root" title="The voice defaults" @click=${() => pickVoiceSection(host, "defaults")}>Voice</button><span class="sep">›</span><span class="kchip" style=${`--k:${voicePhraseColorCss(pick.phrase.color).ink}`}>Phrase</span><span class="nm" title=${name}>${name}</span></div>`;
    body = renderPhraseInspector(host, pick.phrase);
  } else {
    const label = VOICE_SECTIONS.find(([id]) => id === pick.section)?.[1] ?? "";
    crumbs = html`<div class="crumbs"><span class="kchip" style=${`--k:${VOICE_CHIP_COLOR}`}>Voice</span><span class="nm" title=${label}>${label}</span></div>`;
    body = html`<p class="vo-note">${VOICE_SECTION_LINES[pick.section]}</p>
      ${pick.section === "defaults" ? renderDefaultsCard(host) : renderWatchCard(host)}
      <p class="vo-note vo-pick-note">Pick a phrase to edit it, or add one.</p>`;
  }
  return html`<div class="insp-head">
      ${crumbs}
      <button class="expand" @click=${() => { setSectionsOpen(host.uiState, folds, !anyOpen); host.requestUpdate(); }}>${anyOpen ? "Collapse all" : "Expand all"}</button>
    </div>
    <div class="insp-body">${body}</div>`;
}

/** A checklist over the speakers (those that announce first), the stored
 * ids the list does not have kept at the end, as the page editor draws its
 * own (`app-settings.ts`). */
function speakerChecklist(host: VoiceViewHost, label: string, stored: readonly string[], toggleOne: (id: string, on: boolean) => void): TemplateResult {
  const list = watchSpeakerChoices(host.hass.states);
  const all = watchVoiceMenu(list, stored);
  const name = (c: WatchVoiceChoice) => (c.missing ? `${c.entityId} (not found)` : c.name);
  const row = (c: WatchVoiceChoice) => checkField(name(c), stored.includes(c.entityId), (on) => toggleOne(c.entityId, on));
  const announcing = list.filter((c) => c.announces);
  const others = all.filter((c) => !announcing.some((a) => a.entityId === c.entityId));
  return html`<div class="vo-sub-h"><span>${label}</span></div>
    <div class="vo-list" role="group" aria-label=${label}>
      ${all.length === 0 ? html`<div class="hint">No media players in Home Assistant.</div>` : nothing}
      ${announcing.length > 0 ? html`<div class="vo-group">Speakers</div>${announcing.map(row)}` : nothing}
      ${others.length > 0 ? html`${announcing.length > 0 ? html`<div class="vo-group">Other media players</div>` : nothing}${others.map(row)}` : nothing}
    </div>`;
}

/** The Defaults card: the conversation agent, the engine, the speakers. */
export function renderDefaultsCard(host: VoiceViewHost): TemplateResult {
  const d = watchVoiceDefaultsOf(host.document);
  const engines = defaultEngineChoices(host, d.engine);
  const engineName = d.engine === undefined ? "No engine" : engines.find(([id]) => id === d.engine)?.[1] ?? nameOf(host.hass, d.engine);
  const summary = [d.agent === undefined ? "Default agent" : nameOf(host.hass, d.agent), engineName].join(" · ");
  const body = html`<fieldset class="vo-body" ?disabled=${host.busy} aria-label="Defaults">
    <div class="vo-stack">${entityField({ hass: host.hass }, "Conversation agent", refOf(host.hass, d.agent ?? ""),
      (ref) => host.edit((doc) => setWatchVoiceAgent(doc, ref.entityId)), "vo:agent", { domain: "conversation", clearable: true })}</div>
    <div class="hint">${d.agent === undefined ? "None picked: Home Assistant's own default agent answers." : "Assist uses this agent unless a tile or a slot picks its own."}</div>
    <div class="vo-stack">${selectField("Text to speech engine", d.engine ?? "", engines,
      (value) => host.edit((doc) => setWatchVoiceEngine(doc, value)), { snapBack: true })}</div>
    <div class="hint ${d.engine === undefined ? "warn" : ""}">${d.engine === undefined ? "Not set. Speaking on speakers needs an engine." : "Speakers say messages and replies with this engine unless a tile, a slot or a phrase picks its own."}</div>
    ${speakerChecklist(host, "Speakers", d.speakers, (id, on) => host.edit((doc) => toggleWatchVoiceSpeaker(doc, id, on)))}
    <div class="hint">${d.speakers.length === 0 ? "None picked. A slot or a phrase set to speakers with none of its own then plays nowhere." : "Assist, Speak and phrases play here unless they pick their own."}</div>
  </fieldset>`;
  return card(host, "defaults", "Defaults", body, { summary, dot: d.agent !== undefined || d.engine !== undefined || d.speakers.length > 0 });
}

/** The Watch voice picker's options: System voice, then one group per
 * language, best quality first. A stored id the watch did not list is kept
 * at the top, marked. */
export function watchVoiceOptions(voices: readonly WatchVoiceInfo[], stored: string | undefined): { value: string; label: string; group?: string }[] {
  const out: { value: string; label: string; group?: string }[] = [{ value: "", label: "System voice" }];
  if (stored !== undefined && !voices.some((v) => v.id === stored)) out.push({ value: stored, label: `${stored} (not on this watch)` });
  for (const group of groupWatchVoices(voices)) {
    for (const v of group.voices) out.push({ value: v.id, label: watchVoiceLabel(v), group: group.language });
  }
  return out;
}

/** The On the watch card: Speak even in Silent Mode, and the watch voice. */
export function renderWatchCard(host: VoiceViewHost): TemplateResult {
  const silent = watchVoiceSilentMode(host.document);
  const stored = watchVoiceIdentifier(host.document);
  const options = watchVoiceOptions(host.voices, stored);
  const runs: { group: string | undefined; options: typeof options }[] = [];
  for (const o of options) {
    const last = runs[runs.length - 1];
    if (last !== undefined && last.group !== undefined && last.group === o.group) last.options.push(o);
    else runs.push({ group: o.group, options: [o] });
  }
  const option = (o: (typeof options)[number]) => html`<option value=${o.value} .selected=${live(o.value === (stored ?? ""))}>${o.label}</option>`;
  const voiceLine = host.voicesState === "unsupported" ? "Update the integration to list this watch's voices."
    : host.voicesState === "error" ? "Could not read this watch's voices."
    : host.voicesState === "ready" && host.voices.length === 0 ? WATCH_VOICES_EMPTY_TEXT
    : undefined;
  const body = html`<fieldset class="vo-body" ?disabled=${host.busy} aria-label="On the watch">
    ${checkField("Speak even in Silent Mode", silent, (v) => host.edit((d) => setWatchVoiceSilentMode(d, v)), true)}
    <div class="hint">The watch speaks a reply on its own speaker even while it is in Silent Mode.</div>
    <label class="field"><span>Watch voice</span>
      <select .value=${live(stored ?? "")} @change=${(e: Event) => {
        const v = (e.target as HTMLSelectElement).value;
        if (!host.edit((d) => setWatchVoiceIdentifier(d, v === "" ? undefined : v))) host.requestUpdate();
      }}>
        ${runs.map((r) => (r.group === undefined ? r.options.map(option) : html`<optgroup label=${r.group}>${r.options.map(option)}</optgroup>`))}
      </select></label>
    ${voiceLine === undefined ? html`<div class="hint">The voice the watch speaks a reply in. System voice follows the watch's language.</div>`
      : html`<div class="hint ${host.voicesState === "ready" ? "" : "warn"}">${voiceLine}</div>`}
  </fieldset>`;
  const summary = stored === undefined ? "System voice" : (host.voices.find((v) => v.id === stored)?.name ?? stored);
  return card(host, "watch", "On the watch", body, { summary, dot: !silent || stored !== undefined });
}

// ── a phrase ─────────────────────────────────────────────────────────────

/** The Defaults card's engine menu: "Not set", then the same engines a
 * phrase's menu offers (`watchTTSEngines`: every `tts.` state and a
 * `tts.<platform>` for every `<platform>_say` service), so an engine such as
 * `tts.demo`, which has a service but no state, is not called missing. A
 * stored engine Home Assistant has neither of is kept, marked not found. */
export function defaultEngineChoices(host: Pick<VoiceViewHost, "hass" | "cloudTTS">, stored: string | undefined): [string, string][] {
  const services = Object.keys(host.hass.services?.tts ?? {});
  const engines = watchVoiceMenu(watchTTSEngines(host.hass.states, services, host.cloudTTS), stored === undefined ? [] : [stored]);
  return [["", "Not set"], ...engines.map((c): [string, string] => [c.entityId, c.missing ? `${c.entityId} (not found)` : c.name])];
}

/** The engine menu's entries: the default, named by the voice defaults, then
 * the engines Home Assistant has, a stored one it does not have kept. */
function engineChoices(host: VoiceViewHost, stored: string | undefined): [string, string][] {
  const d = watchVoiceDefaultsOf(host.document);
  const services = Object.keys(host.hass.services?.tts ?? {});
  const engines = watchVoiceMenu(watchTTSEngines(host.hass.states, services, host.cloudTTS), stored === undefined ? [] : [stored]);
  const fallback = d.engine === undefined ? "Default (Not set)" : `Default (${engines.find((c) => c.entityId === d.engine && !c.missing)?.name ?? nameOf(host.hass, d.engine)})`;
  return [["", fallback], ...engines.map((c): [string, string] => [c.entityId, c.missing ? `${c.entityId} (not found)` : c.name])];
}

function renderPhraseInspector(host: VoiceViewHost, phrase: JsonObject): TemplateResult {
  const id = watchVoicePhraseId(phrase);
  const set = (key: string, value: unknown, typing = false) => host.edit((d) => setWatchVoicePhraseKey(d, id, key, value), typing ? `phrase:${id}:${key}` : undefined);
  const missing = watchVoicePhraseMissing(phrase);
  const text = (key: string) => (typeof phrase[key] === "string" ? (phrase[key] as string) : "");
  const phraseBody = html`<fieldset class="vo-body" ?disabled=${host.busy} aria-label="Phrase">
    ${textField("Message", text("message"), (v) => set("message", v, true), { placeholder: "What the speakers say" })}
    ${textField("Label", text("label"), (v) => set("label", v, true), { placeholder: "Its name on the watch" })}
    ${missing.length > 0 ? html`<div class="hint warn">The phrase needs a ${missing.join(" and a ")} before it can be saved.</div>` : nothing}
    ${segField("Display mode", String(phrase.displayMode ?? "icon"), watchVoiceEnumChoices("TTSPhraseDisplayMode"), (v) => set("displayMode", v),
      { def: VOICE_KEYS.newPhrase.displayMode })}
    <div class="hint">How Pick from List shows it: its icon, or its label.</div>
  </fieldset>`;
  const color = phrase.color;
  const special = voiceColorWords(color);
  const lookBody = html`<fieldset class="vo-body" ?disabled=${host.busy} aria-label="Look">
    <div class="vo-stack">${symbolField({ icons: host.icons, symbols: host.symbols }, typeof phrase.icon === "string" ? phrase.icon : "",
      (v) => set("icon", v, true), `vo:icon:${id}`, undefined, "Icon", false)}</div>
    <div class="vo-no-alpha">${colorField("Color", isPlainVoiceColor(color) ? color : undefined,
      (v) => { if (v !== undefined) set("color", v, true); }, false, VOICE_KEYS.newPhrase.color)}</div>
    ${special === undefined ? nothing : html`<div class="hint">${special}, which the panel does not offer. Picking a color here replaces it.</div>`}
  </fieldset>`;
  const speakers = Array.isArray(phrase.targetSpeakers) ? phrase.targetSpeakers.filter((s): s is string => typeof s === "string") : [];
  const defaults = watchVoiceDefaultsOf(host.document);
  const engine = typeof phrase.ttsEngine === "string" && phrase.ttsEngine.trim() !== "" ? phrase.ttsEngine.trim() : undefined;
  const mode = watchVoicePhraseVolumeMode(phrase);
  const percent = watchVoicePhraseVolumePercent(phrase);
  const v = VOICE_KEYS.volume;
  const speechBody = html`<fieldset class="vo-body" ?disabled=${host.busy} aria-label="Speech">
    ${speakerChecklist(host, "Speakers", speakers, (sid, on) => host.edit((d) => toggleWatchVoicePhraseSpeaker(d, id, sid, on)))}
    <div class="hint">${speakers.length > 0 ? "This phrase plays only on these."
      : defaults.speakers.length > 0 ? `None picked: the default speakers play (${defaults.speakers.map((s) => nameOf(host.hass, s)).join(", ")}).`
      : "None picked, and no default speakers: set some in Defaults."}</div>
    ${selectField("Voice engine", engine ?? "", engineChoices(host, engine), (value) => set("ttsEngine", value === "" ? undefined : value), { snapBack: true })}
    ${textField("Language", typeof phrase.language === "string" ? phrase.language : "", (value) => set("language", value, true), { placeholder: "The engine's own" })}
    <div class="hint">A language code such as en or de, for an engine that speaks more than one.</div>
    ${selectField("Speech volume", mode, watchVoiceEnumChoices("TTSPhraseSpeechVolumeMode"), (value) => set("speechVolumeMode", value), { snapBack: true, def: "keepCurrent" })}
    ${mode === "keepCurrent" ? nothing : html`${sliderField("Target volume", percent, (n) => set("speechVolumePercent", n, true), {
        min: v.min, max: v.max, step: v.step, def: v.default, format: (n) => `${Math.round(n)}${v.unit}`,
      })}
      <div class="vo-chips">${v.presets.map((p) => html`<button type="button" class="pe-chip ${percent === p.value ? "on" : ""}"
        aria-pressed=${percent === p.value ? "true" : "false"} @click=${() => set("speechVolumePercent", p.value)}>${p.label} ${p.value}%</button>`)}</div>`}
  </fieldset>`;
  const index = watchVoicePhrases(host.document).findIndex((p) => watchVoicePhraseId(p).toUpperCase() === id.toUpperCase());
  const count = watchVoicePhrases(host.document).length;
  return html`${card(host, "phrase", "Phrase", phraseBody, { summary: text("message"), dot: missing.length > 0 })}
    ${card(host, "look", "Look", lookBody, { summary: typeof phrase.icon === "string" ? phrase.icon : "", dot: false })}
    ${card(host, "speech", "Speech", speechBody, { summary: engine === undefined ? "Defaults" : nameOf(host.hass, engine), dot: watchVoicePhraseRouted(phrase) })}
    <div class="vo-acts">
      <button type="button" class="pe-btn" ?disabled=${host.busy || index <= 0} @click=${() => host.edit((d) => moveWatchVoicePhrase(d, id, index - 1))}>${uiIcon("up")}<span>Move up</span></button>
      <button type="button" class="pe-btn" ?disabled=${host.busy || index >= count - 1} @click=${() => host.edit((d) => moveWatchVoicePhrase(d, id, index + 1))}>${uiIcon("down")}<span>Move down</span></button>
      <button type="button" class="pe-btn pe-danger" ?disabled=${host.busy} title="Remove this phrase from the library"
        @click=${() => host.edit((d) => removeWatchVoicePhrase(d, id))}>${uiIcon("delete")}<span>Remove</span></button>
    </div>
    <p class="vo-note">A menu slot that speaks this phrase keeps pointing at it after an edit. Removing it leaves such a slot with nothing to say.</p>`;
}

/** The views' rules, after the shared chrome and the editor's own. */
export const voiceViewStyles = css`
  .vo-voice-card > .layers, .vo-phrases-card > .layers { padding: 6px 8px 8px; overflow: visible; }
  .vo-voice-card > .lc-note, .vo-phrases-card > .lc-note { margin: 8px 12px; color: var(--wa-muted); font-size: 12px; line-height: 1.4; }
  .lc-head .swatch svg.ui-icon { width: 14px; height: 14px; }
  .layer .acts button.icon { display: inline-grid; place-items: center; padding: 0; }
  .layer .acts button.icon:disabled { opacity: .35; cursor: default; }
  .layer .thumb.vo-thumb {
    display: grid; place-items: center; color: var(--wa-muted);
    background: color-mix(in srgb, var(--c, #888) 22%, #000);
  }
  .layer .thumb.vo-thumb svg.ui-icon { width: 14px; height: 14px; color: #fff; }
  .layer .thumb .vo-thumb-glyph { display: grid; place-items: center; width: 16px; height: 16px; }
  .layer .thumb .vo-thumb-glyph svg { width: 14px; height: 14px; display: block; }
  .layer .name small.vo-needs { color: var(--wa-amber); }
  .vo-glyph-dot { width: 10px; height: 10px; border-radius: 50%; }

  /* The watch screen on the stage: Pick from List's phrases. */
  .vo-screen {
    position: relative; flex: none; background: #000; overflow: hidden;
    display: flex; flex-direction: column; gap: calc(6px * var(--vo-s, 1));
    padding: calc(28px * var(--vo-s, 1)) calc(8px * var(--vo-s, 1)) calc(8px * var(--vo-s, 1));
  }
  .vo-screen-title { color: #fff; font-size: calc(13px * var(--vo-s, 1)); font-weight: 700; padding: 0 calc(4px * var(--vo-s, 1)); }
  .vo-screen-note { margin: auto 0; color: rgba(255, 255, 255, .6); font-size: 12px; text-align: center; }
  .vo-say-list { display: grid; grid-template-columns: 1fr 1fr; gap: calc(6px * var(--vo-s, 1)); overflow: hidden; }
  .vo-say {
    margin: 0; padding: calc(6px * var(--vo-s, 1)); border: 0; border-radius: calc(12px * var(--vo-s, 1));
    background: color-mix(in srgb, var(--ink, #888) 20%, #111); color: #fff; cursor: pointer;
    display: flex; flex-direction: column; align-items: center; gap: calc(4px * var(--vo-s, 1)); min-width: 0;
  }
  .vo-say.vo-words { grid-column: span 2; justify-content: center; background: var(--fill, #444); min-height: calc(30px * var(--vo-s, 1)); }
  .vo-say-well { display: grid; place-items: center; width: calc(30px * var(--vo-s, 1)); height: calc(30px * var(--vo-s, 1)); border-radius: 50%; background: var(--fill, #444); }
  .vo-say-well svg { display: block; }
  .vo-say-label, .vo-say-text {
    max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    font-size: calc(10.5px * var(--vo-s, 1)); font-weight: 600; line-height: 1.3;
  }
  .vo-say-text { text-shadow: 0 1px 2px rgba(0, 0, 0, .45); }
  .vo-screen { --vo-mark: color-mix(in srgb, var(--wa-accent) 55%, #fff); }
  .vo-say.on { box-shadow: 0 0 0 2px #000, 0 0 0 4px var(--vo-mark); }
  .vo-say:focus-visible { outline: none; box-shadow: 0 0 0 2px #000, 0 0 0 4px var(--vo-mark), var(--wa-ring); }

  /* The inspector's cards. */
  fieldset.vo-body { margin: 0; padding: 2px 0 0; border: 0; min-width: 0; display: flex; flex-direction: column; gap: 2px; --wa-lab: 112px; }
  .vo-body .hint { margin: 0 0 6px; }
  .vo-body .hint.warn { color: var(--wa-amber); }
  .vo-note { margin: 6px 2px 2px; font-size: 12px; line-height: 1.4; color: var(--wa-muted); }
  .vo-note.vo-pick-note { margin-top: 10px; }
  .vo-sub-h { margin: 8px 0 2px; font-size: 12px; font-weight: 600; color: var(--wa-muted); }
  .vo-list { display: flex; flex-direction: column; gap: 0; margin-bottom: 4px; }
  .vo-group { margin: 6px 0 2px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: .04em; color: var(--wa-muted); }
  .vo-chips { display: flex; flex-wrap: wrap; gap: 6px; padding: 2px 0 6px calc(var(--wa-lab) + 8px); }
  .vo-acts { display: flex; flex-wrap: wrap; gap: 6px; padding: 12px 0 0; }
  .vo-acts .pe-btn svg.ui-icon { width: 14px; height: 14px; }
  .pe-chip {
    padding: 3px 10px; border: 1px solid var(--wa-line); border-radius: 999px; background: var(--wa-card); color: var(--wa-ink);
    font: inherit; font-size: 12px; cursor: pointer;
  }
  .pe-chip.on { background: var(--wa-sel-bg); border-color: var(--wa-sel-ring); font-weight: 600; }
  .pe-chip:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .vo-no-alpha .color-box .alpha { display: none; }
  .vo-no-alpha .color-box { padding-right: 6px; }
  .vo-stack .field { grid-template-columns: minmax(0, 1fr); gap: 4px; padding: 2px 0; }
  .vo-stack .field.entity-field > :not(:first-child) { grid-column: 1; }
`;
