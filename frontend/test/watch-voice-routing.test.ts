// A menu slot's voice (part 2d): the routing table's rules (which keys an
// action reads, when each row shows, which default stands behind it, the
// phrase visibility cases), the slot setters over the shared menus fixtures
// (an untouched `voiceConfig` stays as it came, `{}` included), and where the
// page editor and the menu editor take their voice defaults from.

import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import type { HassLike } from "../src/ha-api.js";
import { renderAppTask, WATCH_VOICE_DEFAULTS_UNKNOWN_TEXT } from "../src/watch-pages/app-settings.js";
import { readWatchCatalog } from "../src/watch-pages/catalog.js";
import { NO_ICONS, type TileSettingsHost } from "../src/watch-pages/editor-host.js";
import type { JsonObject } from "../src/watch-pages/model.js";
import {
  ANYWHERE,
  type MenuListRef,
  type MenusDocument,
  findWatchMenuSlot,
  newWatchMenuAction,
  watchMenuActionUnavailable,
  watchMenuSlots,
} from "../src/watch-menus/model.js";
import {
  menuSlotHasVoice,
  menuSlotVoiceChanged,
  renderSlotVoiceBody,
  setWatchMenuSlotPhraseShown,
  setWatchMenuSlotVoiceKey,
  toggleWatchMenuSlotVoiceSpeaker,
} from "../src/watch-menus/slot-voice.js";
import { voiceDocumentOfRecord, voicePhraseTargets, watchVoiceFallbacks } from "../src/watch-voice/defaults.js";
import {
  VOICE_ROUTING,
  setSlotPhraseShown,
  setVoiceRoutingKey,
  slotPhraseLists,
  visibleSlotPhraseIds,
  voiceRoutingChoices,
  voiceRoutingDefaultLabel,
  voiceRoutingFallsBack,
  voiceRoutingKeys,
  voiceRoutingShown,
  voiceRoutingValue,
} from "../src/watch-voice/routing.js";

const menus = (name: string) => JSON.parse(readFileSync(join(__dirname, "fixtures-menus", name), "utf8")) as MenusDocument;
const voice = (name: string) => JSON.parse(readFileSync(join(__dirname, "fixtures-voice", name), "utf8")) as JsonObject;
const DEFAULTS = menus("01-defaults.json");
const CONFIGURED = menus("02-configured.json");
const VOICE = voice("02-configured.json");

const flat = (v: unknown): string => {
  if (Array.isArray(v)) return v.map(flat).join("");
  if (v !== null && typeof v === "object" && "strings" in v && "values" in v) {
    const r = v as { strings: readonly string[]; values: unknown[] };
    return r.strings.map((s, i) => s + (i < r.values.length ? flat(r.values[i]) : "")).join("");
  }
  return typeof v === "string" || typeof v === "number" || typeof v === "boolean" ? String(v) : "";
};

/** Every slot list of a menus document, with the ref that edits it. */
function everySlot(doc: MenusDocument): { ref: MenuListRef; slot: JsonObject }[] {
  const out: { ref: MenuListRef; slot: JsonObject }[] = watchMenuSlots(doc, ANYWHERE).map((slot) => ({ ref: ANYWHERE, slot }));
  const radial = doc.entityRadial as JsonObject;
  for (const key of Object.keys(radial)) {
    if (!key.endsWith("Slots")) continue;
    const domain = key === "allSlots" ? "all" : key.replace(/Slots$/, "");
    for (const slot of watchMenuSlots(doc, { list: "domain", domain })) out.push({ ref: { list: "domain", domain }, slot });
  }
  return out;
}

describe("the routing table", () => {
  it("lists the keys each voice action reads", () => {
    expect(voiceRoutingKeys("assist")).toContain("assistAutoSendOnPause");
    expect(voiceRoutingKeys("speakMessage")[0]).toBe("speakMessageOutputMode");
    expect(voiceRoutingKeys("broadcast")).toEqual(["broadcastTargetMode", "broadcastTargetSpeakerIds", "broadcastChooseListSpeakerIds", "broadcastImmediateListen"]);
    expect(voiceRoutingKeys("toggle")).toEqual([]);
  });

  it("reads absent keys as their defaults, and the legacy reply mode as speakers", () => {
    expect(voiceRoutingValue({}, "assistReplyOutputMode")).toBe("silent");
    expect(voiceRoutingValue({}, "assistImmediateListen")).toBe(true);
    expect(voiceRoutingValue({}, "assistSpeechVolumePercent")).toBe(70);
    expect(voiceRoutingValue({ assistSpeechVolumePercent: 300 }, "assistSpeechVolumePercent")).toBe(100);
    expect(voiceRoutingValue({ assistReplyOutputMode: "defaultSpeakers" }, "assistReplyOutputMode")).toBe("configuredSpeakers");
    expect(voiceRoutingValue({ assistReplyOutputMode: "bogus" }, "assistReplyOutputMode")).toBe("silent");
  });

  it("offers the phone's choices", () => {
    expect(voiceRoutingChoices({}, "assistReplyOutputMode").map(([v]) => v)).toEqual(VOICE_ROUTING.offered.assistReplyOutputMode);
    expect(voiceRoutingChoices({}, "broadcastTargetMode")).toEqual([["configuredSpeakers", "Specific Speakers"], ["chooseEachTime", "Choose on Watch"]]);
  });

  it("shows each row by its rule", () => {
    expect(voiceRoutingShown({}, "assistTargetSpeakerIds")).toBe(false);
    expect(voiceRoutingShown({ assistReplyOutputMode: "configuredSpeakers" }, "assistTargetSpeakerIds")).toBe(true);
    expect(voiceRoutingShown({ assistReplyOutputMode: "defaultSpeakers" }, "assistTargetSpeakerIds")).toBe(true);
    expect(voiceRoutingShown({ assistReplyOutputMode: "chooseEachTime" }, "assistTTSEngine")).toBe(true);
    expect(voiceRoutingShown({ assistReplyOutputMode: "watchSpeaker" }, "assistTTSEngine")).toBe(false);
    expect(voiceRoutingShown({}, "assistSpeechVolumePercent")).toBe(false);
    expect(voiceRoutingShown({ assistSpeechVolumeMode: "setAndKeep" }, "assistSpeechVolumePercent")).toBe(true);
    expect(voiceRoutingShown({}, "speakMessageTTSEngine")).toBe(false);
    expect(voiceRoutingShown({ speakMessageOutputMode: "chooseEachTime" }, "speakMessageTTSEngine")).toBe(true);
    expect(voiceRoutingShown({}, "broadcastTargetSpeakerIds")).toBe(true);
    expect(voiceRoutingShown({}, "assistAgentId")).toBe(true);
  });

  it("names the default behind a row from the voice settings, when it falls back", () => {
    const name = (id: string) => ({ "media_player.kitchen": "Kitchen", "tts.piper": "Piper" })[id] ?? id;
    const defaults = { agent: undefined, engine: "tts.piper", speakers: ["media_player.kitchen"] };
    const speakers = { speakMessageOutputMode: "configuredSpeakers" };
    expect(voiceRoutingDefaultLabel(speakers, "speakMessageTargetSpeakerIds", defaults, name)).toBe("Default (Kitchen)");
    expect(voiceRoutingDefaultLabel(speakers, "speakMessageTTSEngine", defaults, name)).toBe("Default (Piper)");
    expect(voiceRoutingDefaultLabel({}, "assistAgentId", defaults, name)).toBe("Default (Home Assistant default)");
    expect(voiceRoutingDefaultLabel({}, "assistAgentId", undefined, name)).toBe("Default");
    // Assist's engine stands on the default only while it speaks on chosen speakers.
    expect(voiceRoutingFallsBack({ assistReplyOutputMode: "chooseEachTime" }, "assistTTSEngine")).toBe(false);
    expect(voiceRoutingDefaultLabel({ assistReplyOutputMode: "chooseEachTime" }, "assistTTSEngine", defaults, name)).toBe("Not set");
    expect(voiceRoutingDefaultLabel(speakers, "speakMessageTTSEngine", { speakers: [] }, name)).toBe("Default (Not set)");
  });

  it("changes nothing for a value the watch reads already, and keeps keys it does not know", () => {
    const empty = {};
    expect(setVoiceRoutingKey(empty, "assistReplyOutputMode", "silent")).toBe(empty);
    expect(setVoiceRoutingKey(empty, "assistImmediateListen", true)).toBe(empty);
    expect(setVoiceRoutingKey(empty, "assistAgentId", "")).toBe(empty);
    expect(setVoiceRoutingKey(empty, "assistTargetSpeakerIds", [])).toBe(empty);
    expect(setVoiceRoutingKey(empty, "assistReplyOutputMode", "nope")).toBe(empty);
    const odd = { future: 1, speakMessageTTSEngine: "tts.a" };
    const next = setVoiceRoutingKey(odd, "speakMessageOutputMode", "chooseEachTime");
    expect(next).toEqual({ future: 1, speakMessageOutputMode: "chooseEachTime", speakMessageTTSEngine: "tts.a" });
    expect(Object.keys(next)).toEqual(["future", "speakMessageOutputMode", "speakMessageTTSEngine"]);
    expect(setVoiceRoutingKey(odd, "speakMessageTTSEngine", " ")).toEqual({ future: 1 });
    // A legacy value is written out as the phone writes it.
    expect(setVoiceRoutingKey({ assistReplyOutputMode: "defaultSpeakers" }, "assistReplyOutputMode", "configuredSpeakers"))
      .toEqual({ assistReplyOutputMode: "configuredSpeakers" });
    expect(setVoiceRoutingKey({}, "assistSpeechVolumePercent", 33.7)).toEqual({ assistSpeechVolumePercent: 34 });
  });
});

describe("the phrase visibility rule", () => {
  const action = VOICE_ROUTING.actions.find((a) => a.action === "ttsMenu")!;
  for (const [i, c] of action.phraseVisibility!.cases.entries()) {
    it(`case ${i + 1}: hidden ${JSON.stringify(c.hiddenPhraseIds ?? null)}, known ${JSON.stringify(c.knownPhraseIds ?? null)}`, () => {
      expect(visibleSlotPhraseIds(c.phrases, c.hiddenPhraseIds, c.knownPhraseIds)).toEqual(c.visible);
    });
  }

  it("writes both lists the way the phone's picker does", () => {
    expect(slotPhraseLists(["A", "B", "C"], ["C", "A"])).toEqual({ hiddenPhraseIds: ["B"], knownPhraseIds: ["A", "B", "C"] });
    const slot = { id: "S", knownPhraseIds: ["A"] };
    // C was added after the slot knew A only: ticking it writes the library.
    expect(setSlotPhraseShown(slot, ["A", "B", "C"], "C", true)).toEqual({ hiddenPhraseIds: ["B"], id: "S", knownPhraseIds: ["A", "B", "C"] });
    expect(setSlotPhraseShown(slot, ["A", "B", "C"], "A", true)).toBe(slot);
    expect(setSlotPhraseShown(slot, ["A", "B", "C"], "Z", true)).toBe(slot);
  });
});

describe("a menu slot's voice", () => {
  it("leaves every phone-written slot as it came when each shown key is set to what it reads", () => {
    for (const doc of [DEFAULTS, CONFIGURED]) {
      for (const { ref, slot } of everySlot(doc)) {
        const config = (slot.voiceConfig ?? {}) as JsonObject;
        const id = slot.id as string;
        for (const key of voiceRoutingKeys((slot.action as JsonObject).type as string)) {
          const now = voiceRoutingValue(config, key);
          // An entity or a list the slot does not hold reads as empty: set
          // as it reads, it stays absent.
          expect(setWatchMenuSlotVoiceKey(doc, ref, id, key, now), `${id} ${key}`).toBe(doc);
        }
      }
    }
  });

  it("writes one key into voiceConfig, keeping the slot's other keys", () => {
    const id = "3E4D0000-0000-4000-8000-000000000001";
    // The defaults' first Anywhere slot made an Assist slot.
    const slot = findWatchMenuSlot(DEFAULTS, ANYWHERE, id)!;
    const doc = { ...DEFAULTS, quickAction: { ...(DEFAULTS.quickAction as JsonObject), slots: watchMenuSlots(DEFAULTS, ANYWHERE).map((s) => (s === slot ? { ...s, action: { type: "assist" } } : s)) } };
    const before = findWatchMenuSlot(doc, ANYWHERE, id)!;
    expect(before.voiceConfig).toEqual({});
    expect(setWatchMenuSlotVoiceKey(doc, ANYWHERE, id, "assistReplyOutputMode", "silent")).toBe(doc);
    const set = setWatchMenuSlotVoiceKey(doc, ANYWHERE, id, "assistReplyOutputMode", "configuredSpeakers");
    const after = findWatchMenuSlot(set, ANYWHERE, id)!;
    expect(after.voiceConfig).toEqual({ assistReplyOutputMode: "configuredSpeakers" });
    for (const key of Object.keys(before)) if (key !== "voiceConfig") expect(after[key], key).toBe(before[key]);
    expect(menuSlotVoiceChanged(after)).toBe(true);
    const ticked = toggleWatchMenuSlotVoiceSpeaker(set, ANYWHERE, id, "assistTargetSpeakerIds", "media_player.kitchen", true);
    expect(findWatchMenuSlot(ticked, ANYWHERE, id)!.voiceConfig).toEqual({ assistReplyOutputMode: "configuredSpeakers", assistTargetSpeakerIds: ["media_player.kitchen"] });
    // A key another action reads is refused.
    expect(setWatchMenuSlotVoiceKey(doc, ANYWHERE, id, "broadcastTargetMode", "chooseEachTime")).toBe(doc);
  });

  it("keeps the configured fixture's Pick from List routing as it came while its phrases change", () => {
    // The phone wrote Speak Message keys on a Pick from List slot, which reads
    // none: they are kept, and the panel writes none there.
    const at = everySlot(CONFIGURED).find(({ slot }) => Object.keys((slot.voiceConfig ?? {}) as JsonObject).length > 0)!;
    const id = at.slot.id as string;
    expect((at.slot.action as JsonObject).type).toBe("ttsMenu");
    expect(setWatchMenuSlotVoiceKey(CONFIGURED, at.ref, id, "speakMessageImmediateListen", false)).toBe(CONFIGURED);
    const library = ["3E4D1000-0000-4000-8000-000000000387", "3E4D1000-0000-4000-8000-000000000388"];
    expect(visibleSlotPhraseIds(library, at.slot.hiddenPhraseIds, at.slot.knownPhraseIds)).toEqual([library[1]]);
    const next = setWatchMenuSlotPhraseShown(CONFIGURED, at.ref, id, library, library[0]!, true);
    const slot = findWatchMenuSlot(next, at.ref, id)!;
    expect(slot.voiceConfig).toBe(at.slot.voiceConfig);
    expect(slot.hiddenPhraseIds).toEqual([]);
    expect(slot.knownPhraseIds).toEqual(library);
  });

  it("shows and hides a phrase on a Pick from List slot", () => {
    const id = "3E4D0000-0000-4000-8000-000000000001";
    const slots = watchMenuSlots(DEFAULTS, ANYWHERE).map((s) => (s.id === id ? { ...s, action: { type: "ttsMenu" } } : s));
    const doc = { ...DEFAULTS, quickAction: { ...(DEFAULTS.quickAction as JsonObject), slots } };
    const library = voicePhraseTargets(VOICE).map((p) => p.id);
    const hidden = setWatchMenuSlotPhraseShown(doc, ANYWHERE, id, library, library[1]!, false);
    const slot = findWatchMenuSlot(hidden, ANYWHERE, id)!;
    expect(slot.hiddenPhraseIds).toEqual([library[1]]);
    expect(slot.knownPhraseIds).toEqual(library);
    expect(slot.voiceConfig).toEqual({});
    expect(setWatchMenuSlotPhraseShown(doc, ANYWHERE, id, library, library[0]!, true)).toBe(doc);
  });

  it("draws the voice rows with the defaults named, and the phrases a Pick from List slot shows", () => {
    const hass = { states: { "media_player.kitchen": { entity_id: "media_player.kitchen", state: "idle", attributes: { friendly_name: "Kitchen" } } } } as unknown as HassLike;
    const defaults = watchVoiceFallbacks(VOICE, undefined);
    const vhost = { hass, voice: { phrases: voicePhraseTargets(VOICE), defaults }, edit: () => false };
    const speak = { id: "S", action: { type: "speakMessage" }, voiceConfig: { speakMessageOutputMode: "configuredSpeakers" } };
    const text = flat(renderSlotVoiceBody(vhost, ANYWHERE, speak));
    expect(text).toContain("None picked: Default (Kitchen, media_player.living_room).");
    expect(text).toContain("Default (tts.google_translate_en_com)");
    const menu = flat(renderSlotVoiceBody(vhost, ANYWHERE, { id: "M", action: { type: "ttsMenu" }, voiceConfig: {} }));
    expect(menu).toContain("3 of 3 show on the watch.");
    expect(renderSlotVoiceBody(vhost, ANYWHERE, { id: "T", action: { type: "toggle" } })).toBeUndefined();
    expect(menuSlotHasVoice({ action: { type: "broadcast" } })).toBe(true);
    // Without voice settings the phrase list says where to make them.
    expect(flat(renderSlotVoiceBody({ hass, edit: () => false }, ANYWHERE, { id: "M", action: { type: "ttsMenu" } }))).toContain("Start them in Voice");
  });

  it("picks Speak Phrase's phrase from the voice record", () => {
    const phrases = voicePhraseTargets(VOICE);
    expect(phrases.map((p) => p.name)).toEqual(["Dinner", "Bedtime", "Leaving"]);
    const targets = { pages: [], statusPages: [], httpActions: [], phrases };
    expect(watchMenuActionUnavailable("speakPhrase", targets)).toBeUndefined();
    expect(newWatchMenuAction("speakPhrase", targets)).toEqual({ phraseId: phrases[0]!.id, type: "speakPhrase" });
    expect(watchMenuActionUnavailable("speakPhrase", { ...targets, phrases: [] })).toBe("No phrases");
  });
});

describe("where the voice defaults come from", () => {
  const catalog = readWatchCatalog({ voice: { defaultTTSEngine: "tts.cloud", defaultSpeakers: ["media_player.lounge"] } });

  it("prefers the voice record, then the catalog, then none", () => {
    expect(watchVoiceFallbacks(VOICE, catalog)).toEqual({
      defaultAssistAgentId: "conversation.home_assistant",
      defaultSpeakers: ["media_player.kitchen", "media_player.living_room"],
      defaultTTSEngine: "tts.google_translate_en_com",
    });
    // A record with blank defaults still wins: the watch reads it, not the phone's.
    expect(watchVoiceFallbacks(voice("01-defaults.json"), catalog)).toEqual({});
    expect(watchVoiceFallbacks(undefined, catalog)).toEqual(catalog.voice);
    expect(watchVoiceFallbacks(undefined, undefined)).toBeUndefined();
    expect(voiceDocumentOfRecord({ revision: 0, document: undefined })).toBeUndefined();
    expect(voiceDocumentOfRecord({ revision: 2, document: VOICE })).toBe(VOICE);
  });

  it("the page editor names the record's defaults and says where to set them when there are none", () => {
    const tile = { id: "T", entityId: "speak_message.say", speakMessageOutputMode: "configuredSpeakers" };
    const host = (extra: object) => ({
      hass: { states: { "tts.google_translate_en_com": { entity_id: "tts.google_translate_en_com", state: "x", attributes: { friendly_name: "Google" } } } },
      icons: NO_ICONS,
      document: { pages: [] },
      pageId: "P",
      page: { id: "P", items: [tile] },
      tileId: "T",
      tile,
      otherPages: [],
      busy: false,
      uiState: new Map(),
      catalog: undefined,
      apply: () => false,
      endCoalesce: () => undefined,
      selectTile: () => undefined,
      requestUpdate: () => undefined,
      ...extra,
    }) as unknown as TileSettingsHost;
    const none = flat(renderAppTask(host({}), "speak_message"));
    expect(none).toContain(WATCH_VOICE_DEFAULTS_UNKNOWN_TEXT);
    expect(WATCH_VOICE_DEFAULTS_UNKNOWN_TEXT).toContain("Voice");
    const fromRecord = flat(renderAppTask(host({ voice: watchVoiceFallbacks(VOICE, catalog), catalog }), "speak_message"));
    expect(fromRecord).not.toContain(WATCH_VOICE_DEFAULTS_UNKNOWN_TEXT);
    expect(fromRecord).toContain("Default: Google");
    const fromCatalog = flat(renderAppTask(host({ catalog }), "speak_message"));
    expect(fromCatalog).not.toContain(WATCH_VOICE_DEFAULTS_UNKNOWN_TEXT);
    expect(fromCatalog).toContain("Default: Cloud");
  });
});
