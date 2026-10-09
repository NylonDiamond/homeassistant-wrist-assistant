// The voice editor's model, draft, merge and views: the shared voice
// fixtures (`fixtures-voice`, a copy of the app repo's canonical
// `WristAssistantTests/Fixtures/voice`) open and save back as the same bytes,
// "Start with the defaults" writes the defaults fixture, and each section's
// setters write only what they change.

import { describe, expect, it } from "vitest";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

import type { HassLike } from "../src/ha-api.js";
import type { JsonObject } from "../src/watch-pages/model.js";
import { SymbolBrowser } from "../src/symbols.js";
import { WatchVoiceDraft, saveWatchVoiceDraft, startWatchVoice, takeWatchVoiceRecord, forgetWatchVoiceDraft } from "../src/watch-voice/draft.js";
import { WATCH_VOICE_PATH, isWatchVoiceRoute, watchVoiceRouteOwner, watchVoiceUrl } from "../src/watch-voice/hook.js";
import { mergeWatchVoice, mergeWatchVoicePhrases, watchVoiceClashes } from "../src/watch-voice/merge.js";
import {
  VOICE_KEYS,
  type VoiceDocument,
  WATCH_VOICES_EMPTY_TEXT,
  WATCH_VOICE_MAX_PHRASES,
  type WatchVoiceInfo,
  addWatchVoicePhrase,
  asWatchVoiceDocument,
  checkWatchVoice,
  findWatchVoicePhrase,
  groupWatchVoices,
  moveWatchVoicePhrase,
  readWatchVoices,
  removeWatchVoicePhrase,
  setWatchVoiceAgent,
  setWatchVoiceEngine,
  setWatchVoiceIdentifier,
  setWatchVoicePhraseKey,
  setWatchVoiceSilentMode,
  toggleWatchVoicePhraseSpeaker,
  toggleWatchVoiceSpeaker,
  voiceColorWords,
  watchVoiceDefaults,
  watchVoiceDefaultsOf,
  watchVoiceLabel,
  watchVoicePhraseName,
  watchVoicePhrases,
  watchVoicePhraseVolumeMode,
  watchVoicePhraseVolumePercent,
  watchVoiceSilentMode,
  watchVoiceSize,
} from "../src/watch-voice/model.js";
import { watchVoiceReplacedText, watchVoiceSaveNote } from "../src/watch-voice/save-note.js";
import {
  type VoiceViewHost,
  defaultEngineChoices,
  pickVoicePhrase,
  renderPhrasesCard,
  renderVoiceInspector,
  renderVoiceScreen,
  voicePhraseColorCss,
  voicePick,
  watchVoiceOptions,
} from "../src/watch-voice/voice-view.js";

const dir = join(__dirname, "fixtures-voice");
const files = existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith(".json")).sort() : [];

function read(name: string): { text: string; doc: VoiceDocument } {
  const text = readFileSync(join(dir, name), "utf8");
  return { text, doc: JSON.parse(text) as VoiceDocument };
}

const CONFIGURED = read("02-configured.json").doc;
const DINNER = "7E1CE000-0000-4000-8000-000000000001";
const BEDTIME = "7E1CE000-0000-4000-8000-000000000002";
const LEAVING = "7E1CE000-0000-4000-8000-000000000003";

let idSeq = 0;
const nextId = () => `aaaaaaaa-0000-4000-8000-${String(++idSeq).padStart(12, "0")}`;

const ids = (doc: VoiceDocument) => watchVoicePhrases(doc).map((p) => p.id);

describe("the voice fixtures", () => {
  it("are there: the defaults and a configured one", () => {
    expect(files).toEqual(expect.arrayContaining(["01-defaults.json", "02-configured.json"]));
  });

  for (const file of files) {
    it(`${file} saves back as the same bytes with no edit`, () => {
      const { text, doc } = read(file);
      const draft = new WatchVoiceDraft(asWatchVoiceDocument(doc)!, 2);
      expect(draft.dirty).toBe(false);
      expect(draft.document).toBe(doc);
      expect(JSON.stringify(draft.document)).toBe(text.trimEnd());
      expect(watchVoiceSize(draft.document)).toBe(Buffer.byteLength(text.trimEnd(), "utf8"));
      expect(checkWatchVoice(doc)).toEqual([]);
    });
  }

  it("Start with the defaults writes the defaults fixture's bytes", () => {
    expect(JSON.stringify(watchVoiceDefaults())).toBe(read("01-defaults.json").text.trimEnd());
    // A fresh copy each time.
    expect(watchVoiceDefaults()).not.toBe(watchVoiceDefaults());
  });
});

describe("no record yet", () => {
  it("starts over revision 0 with the defaults", async () => {
    const calls: [number, VoiceDocument][] = [];
    const result = await startWatchVoice(async (base, doc) => {
      calls.push([base, doc]);
      return { revision: 1 };
    });
    expect(result).toEqual({ ok: true, revision: 1 });
    expect(calls).toEqual([[0, watchVoiceDefaults()]]);
  });

  it("says why a start was refused", async () => {
    const refuse = (code: string) => startWatchVoice(async () => { throw { code, message: `said ${code}` }; });
    expect(await refuse("no_record")).toEqual({ ok: false, code: "no_record", message: "said no_record" });
    expect(await refuse("conflict")).toEqual({ ok: false, code: "conflict", message: "said conflict" });
    expect(await refuse("unknown_command")).toMatchObject({ ok: false, code: "unsupported" });
    expect(await refuse("invalid")).toMatchObject({ ok: false, code: "error", message: "said invalid" });
  });
});

describe("the defaults", () => {
  it("reads the agent, the engine and the speakers", () => {
    expect(watchVoiceDefaultsOf(CONFIGURED)).toEqual({
      agent: "conversation.home_assistant",
      engine: "tts.google_translate_en_com",
      speakers: ["media_player.kitchen", "media_player.living_room"],
    });
    expect(watchVoiceDefaultsOf(read("01-defaults.json").doc)).toEqual({ agent: undefined, engine: undefined, speakers: [] });
  });

  it("writes the agent at its sorted place, and none removes it", () => {
    const base = watchVoiceDefaults();
    const set = setWatchVoiceAgent(base, "conversation.openai");
    expect(Object.keys(set)).toEqual(["defaultAssistAgentId", "defaultSpeakers", "defaultTTSEngine", "phrases", "schemaVersion"]);
    expect(setWatchVoiceAgent(set, undefined)).toEqual(base);
    expect(setWatchVoiceAgent(base, "")).toBe(base);
    expect(setWatchVoiceAgent(set, "conversation.openai")).toBe(set);
  });

  it("writes the engine, none as the app's empty default", () => {
    const set = setWatchVoiceEngine(CONFIGURED, "tts.piper");
    expect(set.defaultTTSEngine).toBe("tts.piper");
    expect(setWatchVoiceEngine(set, undefined).defaultTTSEngine).toBe("");
    const none = watchVoiceDefaults();
    expect(setWatchVoiceEngine(none, "")).toBe(none);
  });

  it("ticks a speaker onto the end and off again", () => {
    const on = toggleWatchVoiceSpeaker(CONFIGURED, "media_player.office", true);
    expect(on.defaultSpeakers).toEqual(["media_player.kitchen", "media_player.living_room", "media_player.office"]);
    expect(toggleWatchVoiceSpeaker(on, "media_player.office", false)).toEqual(CONFIGURED);
    expect(toggleWatchVoiceSpeaker(CONFIGURED, "media_player.kitchen", true)).toBe(CONFIGURED);
    // Every other key stays the very object it was.
    expect(on.phrases).toBe(CONFIGURED.phrases);
  });
});

describe("on the watch", () => {
  it("reads Silent Mode as on when absent and writes only a change", () => {
    const base = watchVoiceDefaults();
    expect(watchVoiceSilentMode(base)).toBe(true);
    expect(setWatchVoiceSilentMode(base, true)).toBe(base);
    const off = setWatchVoiceSilentMode(base, false);
    expect(off.watchSpeakReplyInSilentMode).toBe(false);
    expect(watchVoiceSilentMode(CONFIGURED)).toBe(false);
  });

  it("sets the watch voice, and System voice removes it", () => {
    expect(setWatchVoiceIdentifier(CONFIGURED, undefined)).not.toHaveProperty("watchSpeechVoiceIdentifier");
    const base = watchVoiceDefaults();
    expect(setWatchVoiceIdentifier(base, undefined)).toBe(base);
    expect(Object.keys(setWatchVoiceIdentifier(base, "com.apple.voice.compact.de-DE.Anna")).at(-1)).toBe("watchSpeechVoiceIdentifier");
  });
});

describe("the watch voice picker", () => {
  const VOICES: WatchVoiceInfo[] = [
    { id: "com.apple.voice.compact.en-US.Samantha", name: "Samantha", language: "en-US", quality: 1 },
    { id: "com.apple.voice.premium.en-US.Zoe", name: "Zoe", language: "en-US", quality: 3 },
    { id: "com.apple.voice.enhanced.en-US.Ava", name: "Ava", language: "en-US", quality: 2 },
    { id: "com.apple.voice.compact.de-DE.Anna", name: "Anna", language: "de-DE", quality: 1 },
    { id: "com.apple.voice.compact.en-US.Alex", name: "alex", language: "en-US", quality: 1 },
  ];

  it("groups by language, best quality first, then by name", () => {
    const groups = groupWatchVoices(VOICES);
    expect(groups.map((g) => g.language)).toEqual(["de-DE", "en-US"]);
    expect(groups[1]!.voices.map((v) => v.name)).toEqual(["Zoe", "Ava", "alex", "Samantha"]);
  });

  it("offers System voice first, then each group, and keeps a stored voice the watch did not list", () => {
    const options = watchVoiceOptions(VOICES, "com.apple.voice.gone");
    expect(options[0]).toEqual({ value: "", label: "System voice" });
    expect(options[1]).toEqual({ value: "com.apple.voice.gone", label: "com.apple.voice.gone (not on this watch)" });
    expect(options.slice(2).map((o) => o.group)).toEqual(["de-DE", "en-US", "en-US", "en-US", "en-US"]);
    expect(options[3]!.label).toBe("Zoe (Premium)");
    expect(watchVoiceLabel(VOICES[2]!)).toBe("Ava (Enhanced)");
    expect(watchVoiceLabel(VOICES[0]!)).toBe("Samantha");
    expect(watchVoiceOptions([], undefined)).toEqual([{ value: "", label: "System voice" }]);
  });

  it("reads the reply's voices and skips anything else", () => {
    expect(readWatchVoices({ voices: [VOICES[0], { id: "", name: "x", language: "en", quality: 1 }, { id: "a" }, 3], updated_at: null })).toEqual([VOICES[0]]);
    expect(readWatchVoices(undefined)).toEqual([]);
  });
});

describe("phrases", () => {
  it("adds a phrase with the table's new values, an upper case id, keys sorted", () => {
    const { document, id } = addWatchVoicePhrase(CONFIGURED, nextId);
    expect(id).toMatch(/^AAAAAAAA-/);
    const added = findWatchVoicePhrase(document, id!)!;
    expect(added).toEqual({ color: "#D88CC4", displayMode: "icon", icon: "speaker.wave.2", id, label: "", message: "", targetSpeakers: [] });
    expect(Object.keys(added)).toEqual([...Object.keys(added)].sort());
    expect(ids(document)).toEqual([DINNER, BEDTIME, LEAVING, id]);
    // A new phrase must get a message and a label before it is saved.
    expect(checkWatchVoice(document)).toEqual(["Every phrase needs a message and a label."]);
    expect(watchVoicePhraseName(added)).toBe("New phrase");
  });

  it("holds the library to eight", () => {
    let doc = CONFIGURED;
    while (watchVoicePhrases(doc).length < WATCH_VOICE_MAX_PHRASES) doc = addWatchVoicePhrase(doc, nextId).document;
    expect(watchVoicePhrases(doc)).toHaveLength(8);
    const full = addWatchVoicePhrase(doc, nextId);
    expect(full.document).toBe(doc);
    expect(full.id).toBeUndefined();
    expect(checkWatchVoice({ ...doc, phrases: [...(doc.phrases as unknown[]), { id: "X", label: "a", message: "b" }] }))
      .toContain("There are 9 phrases. The watch takes at most 8.");
  });

  it("removes and reorders, leaving every other phrase the very object it was", () => {
    const removed = removeWatchVoicePhrase(CONFIGURED, BEDTIME.toLowerCase());
    expect(ids(removed)).toEqual([DINNER, LEAVING]);
    expect(removeWatchVoicePhrase(CONFIGURED, "nope")).toBe(CONFIGURED);
    const moved = moveWatchVoicePhrase(CONFIGURED, LEAVING, 0);
    expect(ids(moved)).toEqual([LEAVING, DINNER, BEDTIME]);
    expect(watchVoicePhrases(moved)[1]).toBe(watchVoicePhrases(CONFIGURED)[0]);
    expect(moveWatchVoicePhrase(CONFIGURED, DINNER, 0)).toBe(CONFIGURED);
    expect(ids(moveWatchVoicePhrase(CONFIGURED, DINNER, 99))).toEqual([BEDTIME, LEAVING, DINNER]);
  });

  it("writes each field the table lists, as the phone writes it", () => {
    const at = (doc: VoiceDocument, id = DINNER) => findWatchVoicePhrase(doc, id)!;
    expect(at(setWatchVoicePhraseKey(CONFIGURED, DINNER, "message", "Dinner time!")).message).toBe("Dinner time!");
    expect(at(setWatchVoicePhraseKey(CONFIGURED, DINNER, "label", "Eat")).label).toBe("Eat");
    expect(at(setWatchVoicePhraseKey(CONFIGURED, DINNER, "icon", " fork.knife.circle ")).icon).toBe("fork.knife.circle");
    expect(setWatchVoicePhraseKey(CONFIGURED, DINNER, "icon", " ")).toBe(CONFIGURED);
    expect(at(setWatchVoicePhraseKey(CONFIGURED, DINNER, "color", "#aabbcc80")).color).toBe("#AABBCC");
    expect(setWatchVoicePhraseKey(CONFIGURED, DINNER, "color", "red")).toBe(CONFIGURED);
    expect(at(setWatchVoicePhraseKey(CONFIGURED, DINNER, "displayMode", "text")).displayMode).toBe("text");
    expect(setWatchVoicePhraseKey(CONFIGURED, DINNER, "displayMode", "huge")).toBe(CONFIGURED);
    // The optional keys go in at their sorted place.
    const engine = at(setWatchVoicePhraseKey(CONFIGURED, DINNER, "ttsEngine", "tts.piper"));
    expect(Object.keys(engine)).toEqual(["color", "displayMode", "icon", "id", "label", "message", "targetSpeakers", "ttsEngine"]);
    expect(at(setWatchVoicePhraseKey(CONFIGURED, BEDTIME, "ttsEngine", ""), BEDTIME)).not.toHaveProperty("ttsEngine");
    expect(at(setWatchVoicePhraseKey(CONFIGURED, BEDTIME, "language", "  "), BEDTIME)).not.toHaveProperty("language");
    expect(at(setWatchVoicePhraseKey(CONFIGURED, DINNER, "language", " de ")).language).toBe("de");
    // Keep Current, which an absent mode means, removes the mode.
    expect(at(setWatchVoicePhraseKey(CONFIGURED, LEAVING, "speechVolumeMode", "keepCurrent"), LEAVING)).not.toHaveProperty("speechVolumeMode");
    expect(at(setWatchVoicePhraseKey(CONFIGURED, DINNER, "speechVolumeMode", "setAndKeep")).speechVolumeMode).toBe("setAndKeep");
    expect(at(setWatchVoicePhraseKey(CONFIGURED, LEAVING, "speechVolumePercent", 140.6), LEAVING).speechVolumePercent).toBe(100);
    expect(at(setWatchVoicePhraseKey(CONFIGURED, LEAVING, "speechVolumePercent", 33.4), LEAVING).speechVolumePercent).toBe(33);
    expect(setWatchVoicePhraseKey(CONFIGURED, DINNER, "id", "X")).toBe(CONFIGURED);
    expect(setWatchVoicePhraseKey(CONFIGURED, DINNER, "message", 3)).toBe(CONFIGURED);
  });

  it("reads the volume as the watch does", () => {
    expect(watchVoicePhraseVolumeMode(findWatchVoicePhrase(CONFIGURED, DINNER)!)).toBe("keepCurrent");
    expect(watchVoicePhraseVolumeMode(findWatchVoicePhrase(CONFIGURED, LEAVING)!)).toBe("setForMessageThenRestore");
    expect(watchVoicePhraseVolumePercent(findWatchVoicePhrase(CONFIGURED, DINNER)!)).toBe(VOICE_KEYS.volume.default);
    expect(watchVoicePhraseVolumePercent({ speechVolumePercent: -5 })).toBe(0);
  });

  it("ticks a phrase's own speakers", () => {
    const on = toggleWatchVoicePhraseSpeaker(CONFIGURED, DINNER, "media_player.kitchen", true);
    expect(findWatchVoicePhrase(on, DINNER)!.targetSpeakers).toEqual(["media_player.kitchen"]);
    expect(toggleWatchVoicePhraseSpeaker(on, DINNER, "media_player.kitchen", false)).toEqual(CONFIGURED);
  });

  it("keeps a phrase key it does not model, and the gradient and rainbow colors until one is picked", () => {
    const odd = { ...CONFIGURED, phrases: [{ ...(CONFIGURED.phrases as JsonObject[])[0], futureKey: { a: 1 } }] };
    const next = setWatchVoicePhraseKey(odd, DINNER, "label", "Eat");
    expect(findWatchVoicePhrase(next, DINNER)!.futureKey).toBe((odd.phrases[0] as JsonObject).futureKey);
    expect(voiceColorWords("GRADIENT|#7C6CE8|#E86CC4")).toBe("Gradient");
    expect(voiceColorWords("#RAINBOW")).toBe("Rainbow");
    expect(voiceColorWords("#E8A855")).toBeUndefined();
    expect(voicePhraseColorCss("GRADIENT|#7C6CE8|#E86CC4")).toEqual({ fill: "linear-gradient(135deg, #7C6CE8, #E86CC4)", ink: "#7C6CE8" });
  });
});

describe("the merge", () => {
  const phrase = (id: string, label: string): JsonObject => ({ id, label, message: label });
  const doc = (phrases: JsonObject[], extra: JsonObject = {}): VoiceDocument => ({ defaultSpeakers: [], defaultTTSEngine: "", phrases, schemaVersion: 1, ...extra });
  const A = phrase("A", "a");
  const B = phrase("B", "b");
  const C = phrase("C", "c");

  it("keeps a phrase each side changed, each its own", () => {
    const base = doc([A, B]);
    const local = doc([phrase("A", "a2"), B]);
    const server = doc([A, phrase("B", "b2")]);
    expect(mergeWatchVoice(base, local, server)).toEqual(doc([phrase("A", "a2"), phrase("B", "b2")]));
  });

  it("takes local's phrase when both changed it", () => {
    const base = doc([A]);
    const merged = mergeWatchVoice(base, doc([phrase("A", "mine")]), doc([phrase("A", "theirs")]));
    expect(merged.phrases).toEqual([phrase("A", "mine")]);
    expect(watchVoiceClashes(base, doc([phrase("A", "mine")]), doc([phrase("A", "theirs")]))).toEqual(["phrases"]);
  });

  it("keeps an added phrase from either side and drops one deleted on a side the other left alone", () => {
    const base = doc([A, B]);
    const local = doc([A, B, C]);
    const server = doc([B]);
    expect(ids(mergeWatchVoice(base, local, server))).toEqual(["B", "C"]);
    // Deleted on the server, changed here: it stays.
    expect(ids(mergeWatchVoice(base, doc([phrase("A", "kept"), B]), server))).toEqual(["B", "A"]);
  });

  it("follows local's order when local moved the phrases, else the server's", () => {
    const base = doc([A, B, C]);
    expect(ids(mergeWatchVoice(base, doc([C, A, B]), doc([A, B, C, phrase("D", "d")])))).toEqual(["C", "A", "B", "D"]);
    expect(ids(mergeWatchVoice(base, doc([A, B, C, phrase("E", "e")]), doc([B, A, C])))).toEqual(["B", "A", "C", "E"]);
  });

  it("matches ids ignoring case", () => {
    const base = doc([phrase("abc", "x")]);
    expect(mergeWatchVoicePhrases(base.phrases, [phrase("ABC", "y")], [phrase("abc", "x")])).toEqual([phrase("ABC", "y")]);
  });

  it("merges the other keys by key", () => {
    const base = doc([A]);
    const local = doc([A], { defaultTTSEngine: "tts.piper" });
    const server = doc([A], { defaultSpeakers: ["media_player.k"], watchSpeakReplyInSilentMode: false });
    expect(mergeWatchVoice(base, local, server)).toEqual(doc([A], { defaultTTSEngine: "tts.piper", defaultSpeakers: ["media_player.k"], watchSpeakReplyInSilentMode: false }));
    expect(watchVoiceClashes(base, local, server)).toEqual([]);
  });

  it("rebases an open draft onto the iPhone's save, keeping the edit and the other side's", () => {
    const watchId = "merge-test";
    forgetWatchVoiceDraft(watchId);
    const { draft } = takeWatchVoiceRecord(watchId, CONFIGURED, 3);
    draft.apply(setWatchVoicePhraseKey(draft.document, DINNER, "label", "Supper"));
    const server = setWatchVoiceEngine(CONFIGURED, "tts.piper");
    const taken = takeWatchVoiceRecord(watchId, server, 4);
    expect(taken.mergedIntoEdits).toBe(true);
    expect(findWatchVoicePhrase(draft.document, DINNER)!.label).toBe("Supper");
    expect(draft.document.defaultTTSEngine).toBe("tts.piper");
    expect(draft.revision).toBe(4);
    forgetWatchVoiceDraft(watchId);
  });

  it("saves through a conflict by merging onto the newest record", async () => {
    const draft = new WatchVoiceDraft(CONFIGURED, 3);
    draft.apply(setWatchVoicePhraseKey(CONFIGURED, DINNER, "label", "Supper"));
    const server = setWatchVoiceEngine(CONFIGURED, "tts.piper");
    const sent: [number, VoiceDocument][] = [];
    let first = true;
    const result = await saveWatchVoiceDraft(draft, {
      save: async (base, document) => {
        sent.push([base, document]);
        if (first) {
          first = false;
          throw { code: "conflict", message: "stored revision is 4" };
        }
        return { revision: 5 };
      },
      fetch: async () => ({ revision: 4, document: server }),
    });
    expect(result).toEqual({ ok: true, revision: 5, merged: true });
    expect(sent[1]![0]).toBe(4);
    expect(sent[1]![1].defaultTTSEngine).toBe("tts.piper");
    expect(findWatchVoicePhrase(sent[1]![1], DINNER)!.label).toBe("Supper");
    expect(draft.dirty).toBe(false);
  });

  it("does not send a phrase without a message", async () => {
    const draft = new WatchVoiceDraft(CONFIGURED, 3);
    draft.apply(addWatchVoicePhrase(CONFIGURED, nextId).document);
    let called = false;
    const result = await saveWatchVoiceDraft(draft, { save: async () => { called = true; return { revision: 4 }; }, fetch: async () => ({ revision: 3, document: CONFIGURED }) });
    expect(called).toBe(false);
    expect(watchVoiceSaveNote(result)).toEqual({ kind: "err", text: "Not saved. Every phrase needs a message and a label." });
  });

  it("names what the iPhone also changed", () => {
    expect(watchVoiceReplacedText(["phrases"])).toBe("Another save also changed the phrases. Your version replaced it.");
    expect(watchVoiceReplacedText(["defaultSpeakers", "phrases"])).toBe("Another save also changed the speakers and the phrases. Your versions replaced them.");
  });
});

describe("the route", () => {
  it("answers to /voice and /voice/<owner>", () => {
    expect(WATCH_VOICE_PATH).toBe("/voice");
    expect(isWatchVoiceRoute({ prefix: "/wrist-assistant", path: "/voice" })).toBe(true);
    expect(isWatchVoiceRoute({ prefix: "/wrist-assistant", path: "/voices" })).toBe(false);
    expect(watchVoiceRouteOwner({ prefix: "/wrist-assistant", path: "/voice/AB%20C" })).toBe("AB C");
    expect(watchVoiceRouteOwner({ prefix: "/wrist-assistant", path: "/voice" })).toBeUndefined();
    expect(watchVoiceUrl(undefined, false, "/wrist-assistant/voice/X")).toBe("/wrist-assistant");
    expect(watchVoiceUrl({ prefix: "/wrist-assistant", path: "" }, true)).toBe("/wrist-assistant/voice");
  });
});

// ── the views ────────────────────────────────────────────────────────────

const flat = (v: unknown): string => {
  if (Array.isArray(v)) return v.map(flat).join("");
  if (v !== null && typeof v === "object" && "strings" in v && "values" in v) {
    const r = v as { strings: readonly string[]; values: unknown[] };
    return r.strings.map((s, i) => s + (i < r.values.length ? flat(r.values[i]) : "")).join("");
  }
  return typeof v === "string" || typeof v === "number" || typeof v === "boolean" ? String(v) : "";
};

const NO_ICONS = { render: () => undefined, available: () => false, names: () => [] } as unknown as VoiceViewHost["icons"];

function host(document: VoiceDocument, voices: WatchVoiceInfo[] = [], voicesState: VoiceViewHost["voicesState"] = "ready"): VoiceViewHost {
  return {
    hass: { states: { "media_player.kitchen": { entity_id: "media_player.kitchen", state: "idle", attributes: { friendly_name: "Kitchen" } } } } as unknown as HassLike,
    icons: NO_ICONS,
    symbols: new SymbolBrowser(() => undefined),
    document,
    busy: false,
    uiState: new Map(),
    screen: { width: 208, height: 248 },
    scale: 1,
    voices,
    voicesState,
    edit: () => false,
    endCoalesce: () => undefined,
    requestUpdate: () => undefined,
  };
}

describe("the views", () => {
  it("list the phrases with Add, and say the cap", () => {
    const card = flat(renderPhrasesCard(host(CONFIGURED)));
    expect(card).toContain("3 of 8");
    expect(card.split(`<div class="layer vo-phrase-row`).length - 1).toBe(3);
    expect(card).toContain(">Bedtime</span></b>");
    expect(flat(renderPhrasesCard(host(watchVoiceDefaults())))).toContain("No phrases yet.");
  });

  it("show the defaults until a phrase is picked, then the phrase's cards", () => {
    const h = host(CONFIGURED);
    expect(voicePick(h)).toEqual({ section: "defaults" });
    expect(flat(renderVoiceInspector(h))).toContain(">Defaults</span>");
    pickVoicePhrase(h, BEDTIME);
    const text = flat(renderVoiceInspector(h));
    expect(text).toContain(">Phrase</span>");
    expect(text).toContain(">Speech<");
    expect(text).toContain(">Look<");
  });

  it("say the watch has sent no voices yet", () => {
    const h = host(CONFIGURED, [], "ready");
    h.uiState.set("vo:pick", "watch");
    expect(flat(renderVoiceInspector(h))).toContain(WATCH_VOICES_EMPTY_TEXT);
  });

  it("draw Pick from List on the watch, a text phrase by its label", () => {
    const text = flat(renderVoiceScreen(host(CONFIGURED)));
    expect(text).toContain(`<span class="vo-say-text">Bedtime</span>`);
    expect(text).toContain(`<span class="vo-say-label">Dinner</span>`);
  });
});

describe("the Defaults card's engine", () => {
  // The test bed's A3: `tts.demo` comes from the `demo_say` service and has
  // no state, so a field that read only states called it missing.
  const host = (states: Record<string, unknown>, services: string[]) => ({
    hass: { states, services: { tts: Object.fromEntries(services.map((s) => [s, {}])) } } as unknown as HassLike,
    cloudTTS: false,
  });

  it("offers the engines the phrase menu offers, a service-only engine included", () => {
    const choices = defaultEngineChoices(host({ "tts.piper": { attributes: { friendly_name: "Piper" } } }, ["demo_say", "speak", "clear_cache"]), "tts.demo");
    expect(choices[0]).toEqual(["", "Not set"]);
    const ids = choices.map(([id]) => id);
    expect(ids).toContain("tts.demo");
    expect(ids).toContain("tts.piper");
    expect(choices.find(([id]) => id === "tts.demo")![1]).not.toContain("not found");
  });

  it("keeps a stored engine Home Assistant does not have, marked not found", () => {
    const choices = defaultEngineChoices(host({}, []), "tts.gone");
    expect(choices).toContainEqual(["tts.gone", "tts.gone (not found)"]);
  });
});
