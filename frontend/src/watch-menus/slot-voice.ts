// A menu slot's voice: the routing an Assist, Speak Message or Broadcast slot
// keeps in its `voiceConfig`, and the phrases a Pick from List slot shows
// (`hiddenPhraseIds`, `knownPhraseIds`). The keys, their defaults and when
// each shows come from the voice table (`watch-voice/voice-keys.json`,
// `watch-voice/routing.ts`); `menu-keys.json` still lists them as kept keys,
// and it is built from the app, so it is not edited here.
//
// Each setter changes one key and leaves the rest of the slot, and of its
// `voiceConfig`, as it came: a slot whose `voiceConfig` is `{}` keeps `{}`
// until a value really changes. The defaults each row names ("Default
// (Kitchen)") are the watch's voice settings, else the iPhone's catalog.
//
// Plan: app repo docs/pages_in_home_assistant_step4.md ("4d batch 2 build
// contract", part 2d, item 22).

import { html, nothing, type TemplateResult } from "lit";
import { checkField, selectField, sliderField } from "../editors.js";
import type { HassLike } from "../ha-api.js";
import type { WatchCatalogVoice } from "../watch-pages/catalog.js";
import { watchConversationAgents, watchSpeakerChoices, watchTTSEngines, watchVoiceMenu, type WatchVoiceChoice } from "../watch-pages/app-model.js";
import type { JsonObject } from "../watch-pages/model.js";
import { WATCH_VOICE_DEFAULTS_UNKNOWN_TEXT, type VoicePhraseTarget } from "../watch-voice/defaults.js";
import { VOICE_KEYS } from "../watch-voice/model.js";
import {
  type VoiceFallbacks,
  setSlotPhraseShown,
  setVoiceRoutingKey,
  slotVoiceConfig,
  toggleVoiceRoutingSpeaker,
  visibleSlotPhraseIds,
  voiceRoutingAction,
  voiceRoutingChoices,
  voiceRoutingDefaultLabel,
  voiceRoutingKeys,
  voiceRoutingLabel,
  voiceRoutingShown,
  voiceRoutingSpec,
  voiceRoutingValue,
} from "../watch-voice/routing.js";
import { type MenuListRef, type MenusDocument, editWatchMenuSlot, slotActionType, withMenuKey } from "./model.js";

/** What the menu editor knows of the watch's voice settings. */
export interface MenuVoiceContext {
  /** The phrases of the voice record, in library order; undefined when Home
   * Assistant holds no voice settings for the watch. */
  readonly phrases: readonly VoicePhraseTarget[] | undefined;
  /** The defaults behind a slot: the voice record's, else the catalog's;
   * undefined when neither says. */
  readonly defaults: WatchCatalogVoice | undefined;
}

/** The defaults as the routing reads them. */
export function menuVoiceFallbacks(defaults: WatchCatalogVoice | undefined): VoiceFallbacks | undefined {
  if (defaults === undefined) return undefined;
  return { agent: defaults.defaultAssistAgentId, engine: defaults.defaultTTSEngine, speakers: defaults.defaultSpeakers ?? [] };
}

// ── setters ──────────────────────────────────────────────────────────────

/** One key of the slot's `voiceConfig` set (`setVoiceRoutingKey`). Refused
 * for a key the slot's action does not read. */
export function setWatchMenuSlotVoiceKey(document: MenusDocument, ref: MenuListRef, id: string, key: string, value: unknown): MenusDocument {
  return editWatchMenuSlot(document, ref, id, (slot) => {
    if (!voiceRoutingKeys(slotActionType(slot)).includes(key)) return slot;
    const config = slotVoiceConfig(slot);
    const next = setVoiceRoutingKey(config, key, value);
    return next === config ? slot : withMenuKey(slot, "voiceConfig", next);
  });
}

/** A speaker ticked or unticked in one of the slot's speaker lists. */
export function toggleWatchMenuSlotVoiceSpeaker(document: MenusDocument, ref: MenuListRef, id: string, key: string, entityId: string, on: boolean): MenusDocument {
  return editWatchMenuSlot(document, ref, id, (slot) => {
    if (!voiceRoutingKeys(slotActionType(slot)).includes(key)) return slot;
    const config = slotVoiceConfig(slot);
    const next = toggleVoiceRoutingSpeaker(config, key, entityId, on);
    return next === config ? slot : withMenuKey(slot, "voiceConfig", next);
  });
}

/** A Pick from List slot with one phrase of the library shown or hidden. */
export function setWatchMenuSlotPhraseShown(
  document: MenusDocument,
  ref: MenuListRef,
  id: string,
  library: readonly string[],
  phraseId: string,
  shown: boolean,
): MenusDocument {
  return editWatchMenuSlot(document, ref, id, (slot) => (slotActionType(slot) === "ttsMenu" ? setSlotPhraseShown(slot, library, phraseId, shown) : slot));
}

/** Whether the slot's voice holds anything: the Voice card's dot. */
export function menuSlotVoiceChanged(slot: JsonObject): boolean {
  return Object.keys(slotVoiceConfig(slot)).some((key) => voiceRoutingKeys(slotActionType(slot)).includes(key));
}

/** Whether a slot has a Voice card: Assist, Speak Message, Broadcast, or
 * Pick from List (its phrases). */
export function menuSlotHasVoice(slot: JsonObject): boolean {
  const raw = slotActionType(slot);
  return voiceRoutingKeys(raw).length > 0 || raw === "ttsMenu";
}

// ── drawing ──────────────────────────────────────────────────────────────

export interface SlotVoiceHost {
  readonly hass: HassLike;
  readonly voice?: MenuVoiceContext | undefined;
  edit(change: (document: MenusDocument) => MenusDocument, coalesce?: string): boolean;
}

function nameOf(hass: HassLike, entityId: string): string {
  const name = hass.states[entityId]?.attributes?.friendly_name;
  return typeof name === "string" && name.trim() !== "" ? name : entityId;
}

function speakerList(host: SlotVoiceHost, label: string, stored: readonly string[], toggle: (id: string, on: boolean) => void): TemplateResult {
  const list = watchSpeakerChoices(host.hass.states);
  const all = watchVoiceMenu(list, stored);
  const row = (c: WatchVoiceChoice) => checkField(c.missing ? `${c.entityId} (not found)` : c.name, stored.includes(c.entityId), (on) => toggle(c.entityId, on));
  return html`<div class="me-sub-h">${label}</div>
    <div class="me-voice-list" role="group" aria-label=${label}>
      ${all.length === 0 ? html`<div class="hint">No media players in Home Assistant.</div>` : all.map(row)}
    </div>`;
}

/** The entity menu of a row: the default first, named by the voice
 * settings, then Home Assistant's agents or engines. */
function entityChoices(host: SlotVoiceHost, config: JsonObject, key: string, stored: string): [string, string][] {
  const spec = voiceRoutingSpec(key);
  const fallbacks = menuVoiceFallbacks(host.voice?.defaults);
  const choices = spec?.domain === "conversation"
    ? watchConversationAgents(host.hass.states)
    : watchTTSEngines(host.hass.states, Object.keys(host.hass.services?.tts ?? {}), undefined);
  const menu = watchVoiceMenu(choices, stored === "" ? [] : [stored]);
  const name = (id: string) => menu.find((c) => c.entityId === id && !c.missing)?.name ?? nameOf(host.hass, id);
  return [["", voiceRoutingDefaultLabel(config, key, fallbacks, name)], ...menu.map((c): [string, string] => [c.entityId, c.missing ? `${c.entityId} (not found)` : c.name])];
}

function voiceRow(host: SlotVoiceHost, ref: MenuListRef, id: string, config: JsonObject, key: string): TemplateResult | typeof nothing {
  const spec = voiceRoutingSpec(key);
  if (spec === undefined || !voiceRoutingShown(config, key)) return nothing;
  const label = voiceRoutingLabel(key);
  const value = voiceRoutingValue(config, key);
  const set = (v: unknown, coalesce?: string) => host.edit((d) => setWatchMenuSlotVoiceKey(d, ref, id, key, v), coalesce);
  switch (spec.type) {
    case "enum":
      return selectField(label, String(value), voiceRoutingChoices(config, key), (v) => set(v), { snapBack: true, def: String(spec.default) });
    case "bool":
      return checkField(label, value === true, (v) => set(v), spec.default as boolean);
    case "int": {
      const n = typeof value === "number" ? value : Number(spec.default);
      const v = VOICE_KEYS.volume;
      const [min, max] = spec.clamp ?? [v.min, v.max];
      return html`${sliderField(label, n, (x) => set(x, `slot:${id}:${key}`), { min, max, step: v.step, def: Number(spec.default), format: (x) => `${Math.round(x)}${v.unit}` })}
        <div class="ts-after">${v.presets.map((p) => html`<button type="button" class="pe-chip ${p.value === n ? "on" : ""}"
          aria-pressed=${p.value === n ? "true" : "false"} @click=${() => set(p.value)}>${p.label} ${p.value}%</button>`)}</div>`;
    }
    case "entity": {
      const stored = typeof value === "string" ? value : "";
      return selectField(label, stored, entityChoices(host, config, key, stored), (v) => set(v === "" ? undefined : v), { snapBack: true });
    }
    case "array": {
      const stored = Array.isArray(value) ? (value as string[]) : [];
      const fallbacks = menuVoiceFallbacks(host.voice?.defaults);
      const empty = spec.whenBlank !== undefined ? `None picked: ${spec.whenBlank}.`
        : spec.fallsBackTo !== undefined ? `None picked: ${voiceRoutingDefaultLabel(config, key, fallbacks, (s) => nameOf(host.hass, s))}.`
        : "None picked.";
      return html`${speakerList(host, label, stored, (sid, on) => host.edit((d) => toggleWatchMenuSlotVoiceSpeaker(d, ref, id, key, sid, on)))}
        <div class="hint ${stored.length === 0 && spec.fallsBackTo === undefined && spec.whenBlank === undefined ? "warn" : ""}">${stored.length === 0 ? empty : `${stored.length} picked.`}</div>`;
    }
  }
}

/** The Voice card's body for an Assist, Speak Message or Broadcast slot:
 * each key the action reads, as the table orders and shows them. */
function routingBody(host: SlotVoiceHost, ref: MenuListRef, slot: JsonObject): TemplateResult {
  const id = typeof slot.id === "string" ? slot.id : "";
  const config = slotVoiceConfig(slot);
  const keys = voiceRoutingKeys(slotActionType(slot));
  return html`${host.voice?.defaults === undefined ? html`<div class="hint">${WATCH_VOICE_DEFAULTS_UNKNOWN_TEXT}.</div>` : nothing}
    ${keys.map((key) => voiceRow(host, ref, id, config, key))}`;
}

/** The Voice card's body for a Pick from List slot: each phrase of the
 * library with whether this slot shows it. */
function phrasesBody(host: SlotVoiceHost, ref: MenuListRef, slot: JsonObject): TemplateResult {
  const id = typeof slot.id === "string" ? slot.id : "";
  const phrases = host.voice?.phrases;
  if (phrases === undefined) {
    return html`<div class="hint">No voice settings from this watch yet. Start them in Voice to pick the phrases this slot shows.</div>`;
  }
  if (phrases.length === 0) return html`<div class="hint">No phrases yet. Add them in Voice.</div>`;
  const library = phrases.map((p) => p.id);
  const visible = visibleSlotPhraseIds(library, slot.hiddenPhraseIds, slot.knownPhraseIds);
  const known = Array.isArray(slot.knownPhraseIds) ? slot.knownPhraseIds.filter((s): s is string => typeof s === "string") : [];
  const late = known.length > 0 && library.some((p) => !known.some((k) => k.toUpperCase() === p.toUpperCase()));
  const shown = (pid: string) => visible.some((v) => v.toUpperCase() === pid.toUpperCase());
  return html`<div class="me-sub-h">${voiceRoutingAction("ttsMenu")?.slotLabel ?? "Phrase List"}</div>
    <div class="me-voice-list" role="group" aria-label="Phrases this slot shows">
      ${phrases.map((p) => checkField(p.name, shown(p.id), (on) => host.edit((d) => setWatchMenuSlotPhraseShown(d, ref, id, library, p.id, on))))}
    </div>
    <div class="hint">${visible.length === 0 ? "No phrase shows: the list on the watch is empty." : `${visible.length} of ${phrases.length} show on the watch.`}</div>
    ${late ? html`<div class="hint">A phrase added after this slot's list was set stays hidden here until it is ticked.</div>` : nothing}`;
}

/** The Voice card's body for a slot, or undefined when its action has no
 * voice. */
export function renderSlotVoiceBody(host: SlotVoiceHost, ref: MenuListRef, slot: JsonObject): TemplateResult | undefined {
  const raw = slotActionType(slot);
  if (raw === "ttsMenu") return phrasesBody(host, ref, slot);
  if (voiceRoutingKeys(raw).length > 0) return routingBody(host, ref, slot);
  return undefined;
}

/** The Voice card's one line. */
export function menuSlotVoiceSummary(host: SlotVoiceHost, slot: JsonObject): string {
  const raw = slotActionType(slot);
  if (raw === "ttsMenu") {
    const phrases = host.voice?.phrases;
    if (phrases === undefined) return "";
    const n = visibleSlotPhraseIds(phrases.map((p) => p.id), slot.hiddenPhraseIds, slot.knownPhraseIds).length;
    return `${n} of ${phrases.length} phrases`;
  }
  const config = slotVoiceConfig(slot);
  const mode = voiceRoutingKeys(raw)[0];
  if (mode === undefined) return "";
  const value = voiceRoutingValue(config, mode);
  return voiceRoutingChoices(config, mode).find(([v]) => v === value)?.[1] ?? "";
}
