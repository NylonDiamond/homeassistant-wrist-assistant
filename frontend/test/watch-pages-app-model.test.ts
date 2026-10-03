// The app kinds' rules (part 3f batch 2) beyond the shared case files, which
// `watch-pages-tile-settings.test.ts` replays: every rule `tile-app.json`
// carries samples for (the save checks, the voice lists, the row words, the
// volume, the inbox words, the rich text), the save warning, the Pointer
// switches and the refusals.

import { describe, expect, it } from "vitest";

import type { HassEntityState } from "../src/ha-api.js";
import type { WatchPage, WatchPageTile, WatchPagesDocument } from "../src/watch-pages/model.js";
import { templateIconColor, templateRichTextSegments } from "../src/watch-pages/rich-text.js";
import { watchTileKeyAccepts, watchTileKeySpec } from "../src/watch-pages/special-model.js";
import {
  WATCH_APP,
  WATCH_APP_SETTING_KEYS,
  addWatchMusicHubPreset,
  setWatchAssistMode,
  setWatchMusicHubAlbumArt,
  setWatchTemplateText,
  setWatchVoiceId,
  setWatchVoiceSpeakers,
  setWatchVoiceVolume,
  watchAgentDisplay,
  watchAssistTileMissingSpeakers,
  watchConversationAgents,
  watchEngineDisplay,
  watchInboxLabel,
  watchInboxTopicWords,
  watchMissingSpeakersMessage,
  watchMusicHubCanAddPreset,
  watchMusicHubGroupingSpeakers,
  watchMusicHubPresetName,
  watchPointControlSwitches,
  watchSaveSpeakerWarning,
  watchShownVolumePercent,
  watchSpeakTileMissingSpeakers,
  watchSpeakerChoices,
  watchSpeakerCountSummary,
  watchSpeakerListSummary,
  watchTTSEngines,
  watchTemplateAddText,
  watchVoiceMenu,
} from "../src/watch-pages/app-model.js";

type Json = Record<string, unknown>;
const A = WATCH_APP;
const PAGE_ID = "C3A0E000-0000-4000-8000-0000000000AA";

function state(entityId: string, attributes: Json = {}, value = "idle"): HassEntityState {
  return { entity_id: entityId, state: value, attributes, last_changed: "", last_updated: "" };
}

function statesOf(list: HassEntityState[]): Record<string, HassEntityState> {
  return Object.fromEntries(list.map((s) => [s.entity_id, s]));
}

function documentWith(...pages: WatchPage[]): WatchPagesDocument {
  return { schemaVersion: 1, pages };
}

function pageOf(items: Json[], extra: Json = {}): WatchPage {
  return { id: PAGE_ID, name: "Living", items, ...extra };
}

// ── the table's samples ──────────────────────────────────────────────────

describe("the save checks, on the table's samples", () => {
  it("find the tiles the phone finds", () => {
    expect(A.checks.samples.length).toBeGreaterThanOrEqual(12);
    for (const s of A.checks.samples) {
      expect(watchSpeakTileMissingSpeakers(s.tile), s.name).toBe(s.speakMissing);
      expect(watchAssistTileMissingSpeakers(s.tile), s.name).toBe(s.assistMissing);
    }
  });

  it("say it in the phone's words, one or many", () => {
    expect(watchMissingSpeakersMessage("speak", 1)).toBe(A.checks.messages.speakOne);
    expect(watchMissingSpeakersMessage("assist", 3)).toBe(A.checks.messages.assistMany.replace("{count}", "3"));
    expect(watchMissingSpeakersMessage("assist", 3)).toMatch(/^3 Assist tiles/);
  });
});

describe("the voice lists, on the table's samples", () => {
  const sample = A.voice.lists.engineSample;
  const states = statesOf(sample.states.map((s) => state(s.entityId, s.friendlyName === null ? {} : { friendly_name: s.friendlyName })));
  const names = (list: { entityId: string; name: string }[]) => list.map(({ entityId, name }) => ({ entityId, name }));

  it("list the engines with the cloud gate, by name then id", () => {
    expect(names(watchTTSEngines(states, sample.services, false))).toEqual(sample.cloudOff);
    expect(names(watchTTSEngines(states, sample.services, true))).toEqual(sample.cloudOn);
    // A cloud status that is not known (the call failed) drops tts.cloud.
    expect(names(watchTTSEngines(states, sample.services, undefined))).toEqual(sample.cloudOff);
  });

  it("put the speakers that announce first, then by name ignoring case", () => {
    const s = A.voice.lists.speakerSample;
    const players = statesOf(s.players.map((p) => state(p.entityId, { friendly_name: p.name, supported_features: p.supportedFeatures })));
    expect(watchSpeakerChoices(players).map((c) => c.entityId)).toEqual(s.order);
  });

  it("give a new music hub the grouping players, sorted by id", () => {
    const s = A.musicHub.groupingSample;
    const players = statesOf(s.players.map((p) => state(p.entityId, { supported_features: p.supportedFeatures })));
    expect(watchMusicHubGroupingSpeakers(players)).toEqual(s.speakers);
    expect(watchMusicHubGroupingSpeakers({})).toEqual([]);
  });

  it("list the conversation agents by name", () => {
    const states = statesOf([
      state("conversation.zeta", { friendly_name: "Zeta" }),
      state("conversation.home_assistant"),
      state("conversation.alpha", { friendly_name: "alpha" }),
      state("tts.piper"),
    ]);
    expect(watchConversationAgents(states).map((c) => c.name)).toEqual(["alpha", "Home Assistant", "Zeta"]);
  });

  it("keep a stored id the list does not have as a choice, so nothing blocks", () => {
    expect(watchVoiceMenu([], ["tts.piper"])).toEqual([{ entityId: "tts.piper", name: "tts.piper", missing: true }]);
    expect(watchVoiceMenu([{ entityId: "tts.piper", name: "Piper" }], ["tts.piper", ""])).toEqual([{ entityId: "tts.piper", name: "Piper" }]);
  });
});

describe("the row words, on the table's samples", () => {
  it("name the agent", () => {
    for (const s of A.voice.agentSamples) expect(watchAgentDisplay(s.tileAgent, s.defaultAgent), JSON.stringify(s)).toBe(s.shows);
  });

  it("name the engine, and say when there is none", () => {
    for (const s of A.voice.engine.displaySamples) {
      expect(watchEngineDisplay(s.tileEngine, s.defaultEngine), JSON.stringify(s)).toEqual({ text: s.shows, configured: s.configured });
    }
  });

  it("count and list the speakers", () => {
    for (const s of A.voice.speakers.countSamples) expect(watchSpeakerCountSummary(s.ids)).toBe(s.shows);
    for (const s of A.voice.speakers.listSamples) expect(watchSpeakerListSummary(s.ids)).toBe(s.shows);
  });

  it("read the volume as the watch does", () => {
    for (const s of A.voice.volume.readSamples) expect(watchShownVolumePercent(s.stored ?? undefined)).toBe(s.shows);
  });
});

describe("the webhook inbox, on the table's samples", () => {
  it("names the topic and the label as the watch does", () => {
    for (const s of A.webhookInbox.samples) {
      const tile: WatchPageTile = { id: "I1", entityId: s.entityId, ...(s.customLabel === null ? {} : { customLabel: s.customLabel }) };
      expect(watchInboxTopicWords(s.entityId), s.entityId).toBe(s.topic);
      expect(watchInboxLabel(tile), JSON.stringify(s)).toBe(s.label);
    }
  });
});

describe("the rich text, on the table's samples", () => {
  it("cuts each sample into the phone's segments", () => {
    for (const s of A.template.richText.samples) {
      const want = s.segments.map((seg) => ("text" in seg ? { kind: "text", text: seg.text } : { kind: "icon", symbol: seg.icon, color: seg.color ?? undefined }));
      expect(templateRichTextSegments(s.input), s.input).toEqual(want);
    }
  });

  it("reads each color sample", () => {
    for (const s of A.template.richText.colorSamples) {
      const got = templateIconColor(s.spec);
      if (s.color === null) expect(got, s.spec).toBeUndefined();
      else if ("name" in s.color) {
        expect(got, s.spec).toBeDefined();
        expect(A.template.richText.colorNames).toContain(s.color.name);
      } else {
        const alpha = Math.round(got!.alpha * 255).toString(16).padStart(2, "0");
        expect(`${got!.hex}${alpha}`.toUpperCase(), s.spec).toBe(s.color.hex.toUpperCase());
      }
    }
  });
});

describe("the template presets", () => {
  it("are the phone's eight, in order, and Home Status starts a new tile", () => {
    expect(A.template.presets.map((p) => p.id)).toEqual(["home_status", "lights", "doors", "locks", "home", "weather", "temp_humidity", "last_motion"]);
    expect(watchTemplateAddText()).toBe(A.template.presets[0]!.template);
  });
});

// ── the rest ─────────────────────────────────────────────────────────────

describe("page-keys.json", () => {
  it("has every key an app setter writes", () => {
    for (const key of WATCH_APP_SETTING_KEYS) expect(watchTileKeySpec(key), key).toBeDefined();
    expect(watchTileKeyAccepts("assistPrimaryAction", "assistAndSpeakReply")).toBe(true);
    expect(watchTileKeyAccepts("speakMessageOutputMode", "chooseEachTime")).toBe(true);
  });
});

describe("the save warning", () => {
  const speak = { id: "S1", entityId: "speak_message.voice_hub", speakMessageOutputMode: "configuredSpeakers", customLabel: "Speak" };
  const assist = { id: "A1", entityId: "assist.voice_hub", assistPrimaryAction: "assistAndSpeakReply", assistSpeakTargetMode: "configuredSpeakers" };

  it("is none when every tile has its speakers", () => {
    expect(watchSaveSpeakerWarning(documentWith(pageOf([{ ...speak, speakMessageTargetSpeakerIds: ["media_player.a"] }])))).toBeUndefined();
  });

  it("names the tiles of every page, Speak first, with the phone's words and the default speakers", () => {
    const other: WatchPage = { id: "P2", name: "Kitchen", items: [{ ...speak, id: "S2" }, assist] };
    const smart: WatchPage = { id: "P3", name: "Smart", dynamicConfig: { rules: [] }, items: [{ ...speak, id: "S3" }] };
    const w = watchSaveSpeakerWarning(documentWith(pageOf([speak]), other, smart), { defaultSpeakers: ["media_player.lounge"] })!;
    expect(w.title).toBe(A.checks.title);
    expect(w.messages).toEqual([watchMissingSpeakersMessage("speak", 2), watchMissingSpeakersMessage("assist", 1)]);
    // A smart page's tiles are made by its rules: not asked about.
    expect(w.tiles.map((t) => `${t.kind}:${String(t.tile.id)}`)).toEqual(["speak:S1", "speak:S2", "assist:A1"]);
    expect(w.fallback).toEqual(["media_player.lounge"]);
    expect([w.saveAnyway, w.cancel]).toEqual([A.checks.saveAnyway, A.checks.cancel]);
    expect(watchSaveSpeakerWarning(documentWith(pageOf([speak])))!.fallback).toEqual([]);
  });
});

describe("the Pointer switches", () => {
  it("read the behavior document, off when absent", () => {
    expect(watchPointControlSwitches(undefined).map((s) => [s.key, s.on])).toEqual([["pointControlTapToToggle", false], ["pointControlLiveTile", false]]);
    const on = watchPointControlSwitches({ pointControlTapToToggle: true, pointControlLiveTile: "yes" });
    expect(on[0]).toEqual({ key: "pointControlTapToToggle", label: "Tap to Toggle", on: true, detail: "Tap immediately toggles the aimed entity" });
    expect(on[1]!.on).toBe(false);
  });
});

describe("refusals return the document as given", () => {
  const doc = documentWith(pageOf([{ id: "L1", entityId: "light.desk" }, { id: "M1", entityId: "music_hub.X", musicHubSpeakerIds: ["media_player.a"] }]));

  it("for a tile of another kind", () => {
    expect(setWatchTemplateText(doc, PAGE_ID, "L1", "x")).toBe(doc);
    expect(setWatchMusicHubAlbumArt(doc, PAGE_ID, "L1", false)).toBe(doc);
    expect(setWatchAssistMode(doc, PAGE_ID, "L1", "assistOnly")).toBe(doc);
    expect(setWatchVoiceId(doc, PAGE_ID, "L1", "assistAgentId", "conversation.a")).toBe(doc);
    expect(setWatchVoiceSpeakers(doc, PAGE_ID, "L1", "assistTargetSpeakerIds", ["media_player.a"])).toBe(doc);
  });

  it("for a value the phone never writes", () => {
    const assistDoc = documentWith(pageOf([{ id: "A1", entityId: "assist.voice_hub" }]));
    expect(setWatchAssistMode(assistDoc, PAGE_ID, "A1", "speakOnly")).toBe(assistDoc);
    expect(setWatchVoiceVolume(assistDoc, PAGE_ID, "A1", "assistSpeechVolumePercent", Number.NaN)).toBe(assistDoc);
  });

  it("for Add Preset while its button is hidden: fewer than two speakers, or three presets", () => {
    expect(watchMusicHubCanAddPreset({ musicHubSpeakerIds: ["media_player.a"] })).toBe(false);
    expect(addWatchMusicHubPreset(doc, PAGE_ID, "M1")).toBe(doc);
    const full = { musicHubSpeakerIds: ["a", "b"], musicHubGroupPresets: [{}, {}, {}] };
    expect(watchMusicHubCanAddPreset(full)).toBe(false);
    expect(watchMusicHubPresetName(2)).toBe("Preset 3");
  });

  it("writes a new preset's id in upper case", () => {
    const two = documentWith(pageOf([{ id: "M1", entityId: "music_hub.X", musicHubSpeakerIds: ["a", "b"] }]));
    const out = addWatchMusicHubPreset(two, PAGE_ID, "M1", { newId: () => "6f1c2a3b-4d5e-4f60-8172-93a4b5c6d7e8" });
    const tile = ((out.pages as WatchPage[])[0]!.items as Json[])[0]!;
    expect(tile.musicHubGroupPresets).toEqual([{ id: "6F1C2A3B-4D5E-4F60-8172-93A4B5C6D7E8", name: "Preset 1", speakerIds: [] }]);
  });
});
