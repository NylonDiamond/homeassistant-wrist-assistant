// Linked phrases (`watch-voice/links.ts`): the unit's keys split the voice
// table as Home Assistant's do, `linkIds` rides through every edit and the
// merge, the Devices menu's switches, the badge, the replace question, Start
// fresh, and unlinking another watch over a conflict.

import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import type { WatchUnitPlace } from "../src/ha-api.js";
import { DEVICES_MENU_NOTE, type DevicesMenuInput, renderPageDevicesMenu } from "../src/watch-pages/devices-menu.js";
import type { LinkDevice } from "../src/watch-pages/devices.js";
import type { JsonObject } from "../src/watch-pages/model.js";
import {
  VOICE_DEVICES_HEAD,
  VOICE_DEVICES_HERE_TEXT,
  VOICE_DEVICES_NOTE,
  VOICE_PHRASES_UNIT_NAME,
  VOICE_DEVICES_WAIT_TAG,
  VOICE_LINK_IDS_KEY,
  VOICE_PHRASES_UNIT_KEYS,
  VOICE_WATCH_OWN_KEYS,
  type VoiceUnlinkIO,
  restoreLinkLines,
  startFreshChoices,
  startFreshVoicePhrases,
  unlinkVoiceFrom,
  voiceDevicePlaces,
  voiceDeviceTitle,
  voiceLinkBadgeText,
  voiceLinkBadgeTitle,
  voiceLinkErrorText,
  voiceLinkNeedsReplace,
  voiceLinkPlaces,
  voicePhrasesAreFresh,
  voicePhrasesHolders,
  voicePhrasesLinkId,
  voiceReplaceQuestion,
  withoutVoicePhrasesLink,
} from "../src/watch-voice/links.js";
import { mergeWatchVoice, watchVoiceClashes } from "../src/watch-voice/merge.js";
import {
  VOICE_KEYS,
  type VoiceDocument,
  addWatchVoicePhrase,
  setWatchVoiceEngine,
  setWatchVoiceSilentMode,
  watchVoiceDefaults,
  watchVoicePhrases,
} from "../src/watch-voice/model.js";

const FIXTURES = join(__dirname, "fixtures-voice");
const LINK = "a".repeat(32);

function configured(): VoiceDocument {
  return JSON.parse(readFileSync(join(FIXTURES, "02-configured.json"), "utf8")) as VoiceDocument;
}

/** The configured fixture as Home Assistant marks it: `linkIds` at its
 * sorted place among the top keys. */
function linked(link = LINK): VoiceDocument {
  const doc = configured();
  const out: VoiceDocument = {};
  let placed = false;
  for (const key of Object.keys(doc)) {
    if (!placed && key > VOICE_LINK_IDS_KEY) {
      out[VOICE_LINK_IDS_KEY] = { phrases: link };
      placed = true;
    }
    out[key] = doc[key];
  }
  if (!placed) out[VOICE_LINK_IDS_KEY] = { phrases: link };
  return out;
}

const WATCHES: LinkDevice[] = [
  { ownerId: "w1", name: "Jesse's Watch", kind: "watch" },
  { ownerId: "w2", name: "Chen's Watch", kind: "watch" },
  { ownerId: "w3", name: "Kitchen Watch", kind: "watch" },
];

const PLACES: Record<string, WatchUnitPlace> = { [LINK]: { unit: "phrases", owners: ["w1", "w2"] } };

describe("the voice table and the phrase unit", () => {
  it("splits the document's keys into the unit, the watch's own and schemaVersion", () => {
    const keys = Object.keys(VOICE_KEYS.types.document.keys).sort();
    const unit = new Set(VOICE_PHRASES_UNIT_KEYS);
    const own = new Set(VOICE_WATCH_OWN_KEYS);
    expect([...unit].filter((k) => own.has(k))).toEqual([]);
    expect([...unit, ...own, "schemaVersion"].sort()).toEqual(keys);
  });

  it("lists linkIds as a key the panel keeps and the watch's types do not", () => {
    expect(VOICE_KEYS.linkKeys.document?.linkIds).toMatchObject({ type: "map", keep: true });
    expect(VOICE_KEYS.types.document.keys.linkIds).toBeUndefined();
  });

  it("keeps linkIds as it came through the editor's setters", () => {
    const doc = linked();
    const edits = [
      setWatchVoiceEngine(doc, "tts.piper"),
      setWatchVoiceSilentMode(doc, true),
      addWatchVoicePhrase(doc, () => "B0000000-0000-4000-8000-000000000001").document,
    ];
    for (const edited of edits) {
      expect(edited).not.toBe(doc);
      expect(edited.linkIds).toBe(doc.linkIds);
      expect(Object.keys(edited).indexOf("linkIds")).toBe(Object.keys(doc).indexOf("linkIds"));
    }
  });

  it("takes a link the server made or dropped, and keeps the local edits", () => {
    const base = linked();
    const local = setWatchVoiceEngine(base, "tts.piper");
    const unlinked = withoutVoicePhrasesLink(base);
    const merged = mergeWatchVoice(base, local, unlinked);
    expect(merged.linkIds).toBeUndefined();
    expect(merged.defaultTTSEngine).toBe("tts.piper");
    const relinked = mergeWatchVoice(unlinked, setWatchVoiceEngine(unlinked, "tts.piper"), base);
    expect(relinked.linkIds).toEqual({ phrases: LINK });
    expect(watchVoiceClashes(unlinked, unlinked, base)).toEqual([]);
  });
});

describe("where the phrases are", () => {
  it("reads the phrase link id, and none from a document without one", () => {
    expect(voicePhrasesLinkId(linked())).toBe(LINK);
    expect(voicePhrasesLinkId(configured())).toBeUndefined();
    expect(voicePhrasesLinkId({ linkIds: { phrases: "" } })).toBeUndefined();
    expect(voicePhrasesLinkId(undefined)).toBeUndefined();
  });

  it("reads the voice links of a places reply, and none from an older integration", () => {
    expect(voiceLinkPlaces({ pages: {}, status_pages: {} })).toBeUndefined();
    expect(voiceLinkPlaces({ voice: { [LINK]: { unit: "phrases", owners: ["w1", 2, "w2"] }, bad: { owners: [] } } }))
      .toEqual({ [LINK]: { unit: "phrases", owners: ["w1", "w2"] } });
    expect(voiceLinkPlaces({ voice: {} })).toEqual({});
  });

  it("lists the holders here first", () => {
    expect(voicePhrasesHolders(linked(), "w2", PLACES)).toEqual(["w2", "w1"]);
    expect(voicePhrasesHolders(configured(), "w1", PLACES)).toEqual(["w1"]);
    expect(voicePhrasesHolders(linked(), "w1", undefined)).toEqual(["w1"]);
  });

  it("draws a switch per watch, this one stuck on and a waiting one stuck off", () => {
    const devices: LinkDevice[] = [...WATCHES, { ownerId: "p1", name: "Jesse's iPhone", kind: "iphone" }];
    const places = voiceDevicePlaces(devices, linked(), "w1", PLACES, new Set(["w3"]));
    expect(places.map((p) => [p.device.ownerId, p.on, p.here])).toEqual([["w1", true, true], ["w2", true, false], ["w3", false, false]]);
    expect(places[0]!.stuck).toBe(VOICE_DEVICES_HERE_TEXT);
    expect(places[1]!.stuck).toBeUndefined();
    expect(places[2]!.tag).toBe(VOICE_DEVICES_WAIT_TAG);
    expect(voiceDeviceTitle(places[1]!)).toMatch(/^Unlink Chen's Watch\./);
    expect(voiceDeviceTitle({ device: WATCHES[2]!, on: false, here: false })).toMatch(/^Put them on Kitchen Watch\./);
  });

  it("names the other watches on the badge", () => {
    expect(voiceLinkBadgeText(["w1"], "w1", WATCHES)).toBeUndefined();
    expect(voiceLinkBadgeText(["w1", "w2"], "w1", WATCHES)).toBe("Also on Chen's Watch");
    expect(voiceLinkBadgeText(["w1", "zz"], "w1", WATCHES)).toBe("On 2 watches");
    expect(voiceLinkBadgeText(["w1", "w2", "w3"], "w1", WATCHES)).toBe("On 3 watches");
    expect(voiceLinkBadgeTitle(["w1", "w2", "w3"], "w1", WATCHES)).toBe("Also on Chen's Watch and Kitchen Watch. An edit here shows there too.");
  });
});

const flat = (v: unknown): string => {
  if (Array.isArray(v)) return v.map(flat).join("");
  if (v !== null && typeof v === "object" && "strings" in v && "values" in v) {
    const r = v as { strings: readonly string[]; values: unknown[] };
    return r.strings.map((s, i) => s + (i < r.values.length ? flat(r.values[i]) : "")).join("");
  }
  return typeof v === "string" || typeof v === "number" || typeof v === "boolean" ? String(v) : "";
};

describe("the Devices menu for the phrases", () => {
  const menu = (extra: Partial<DevicesMenuInput> = {}) => flat(renderPageDevicesMenu({
    name: VOICE_PHRASES_UNIT_NAME,
    places: voiceDevicePlaces(WATCHES, linked(), "w1", PLACES),
    busy: false,
    onToggle: () => undefined,
    onDone: () => undefined,
    ...extra,
  }));

  it("draws the voice head, foot and titles in place of a page's", () => {
    const text = menu({ head: VOICE_DEVICES_HEAD, foot: VOICE_DEVICES_NOTE, titleOf: voiceDeviceTitle });
    expect(text).toContain(`<div class="pk-dup-head">${VOICE_DEVICES_HEAD}</div>`);
    expect(text).toContain(VOICE_DEVICES_NOTE);
    expect(text).not.toContain(DEVICES_MENU_NOTE);
    expect(text).toContain("Unlink Chen's Watch.");
    expect(text).toContain("Put them on Kitchen Watch.");
    expect(text).toContain("Phrases and defaults on Kitchen Watch");
  });

  it("keeps a page's words when they are left out", () => {
    const text = menu();
    expect(text).toContain(`<div class="pk-dup-head">This page is on</div>`);
    expect(text).toContain(DEVICES_MENU_NOTE);
    expect(text).toContain("Put it on Kitchen Watch.");
  });
});

describe("ticking a watch", () => {
  it("asks first only over phrases of the target's own", () => {
    expect(voiceLinkNeedsReplace(undefined, undefined)).toBe(false);
    expect(voiceLinkNeedsReplace(watchVoiceDefaults(), undefined)).toBe(false);
    expect(voiceLinkNeedsReplace(configured(), undefined)).toBe(true);
    expect(voiceLinkNeedsReplace(linked(), LINK)).toBe(false);
    expect(voiceLinkNeedsReplace({ ...watchVoiceDefaults(), linkIds: { phrases: "b".repeat(32) } }, LINK)).toBe(true);
    expect(voiceReplaceQuestion("Chen's Watch")).toBe("Replace the phrases on Chen's Watch? Its own are lost.");
  });

  it("says each refusal in the editor's words", () => {
    expect(voiceLinkErrorText({ code: "unit_taken", message: "x" })).toBe("That watch has phrases of its own.");
    expect(voiceLinkErrorText({ code: "not_found", message: "x" })).toMatch(/Save first/);
    expect(voiceLinkErrorText({ code: "unknown_command", message: "x" })).toMatch(/Update it first/);
    expect(voiceLinkErrorText({ code: "other", message: "Something else." })).toBe("Something else.");
  });
});

describe("Start fresh", () => {
  it("clears the phrases and defaults and leaves the watch's own settings", () => {
    const doc = linked();
    const fresh = startFreshVoicePhrases(doc);
    const defaults = watchVoiceDefaults();
    expect(watchVoicePhrases(fresh)).toEqual([]);
    for (const key of VOICE_PHRASES_UNIT_KEYS) expect(fresh[key]).toEqual(defaults[key]);
    for (const key of VOICE_WATCH_OWN_KEYS) expect(fresh[key]).toEqual(doc[key]);
    expect(fresh.linkIds).toEqual({ phrases: LINK });
    expect(voicePhrasesAreFresh(fresh)).toBe(true);
    expect(voicePhrasesAreFresh(doc)).toBe(false);
  });

  it("here only unlinks this watch", () => {
    const fresh = startFreshVoicePhrases(linked(), true);
    expect(Object.hasOwn(fresh, "linkIds")).toBe(false);
    const other: JsonObject = { ...linked(), linkIds: { phrases: LINK, more: "c".repeat(32) } };
    expect(withoutVoicePhrasesLink(other).linkIds).toEqual({ more: "c".repeat(32) });
    expect(withoutVoicePhrasesLink(configured())).toEqual(configured());
  });

  it("asks only for phrases on several watches", () => {
    expect(startFreshChoices(["w1"])).toBeUndefined();
    expect(startFreshChoices(["w1", "w2", "w3"])).toEqual({
      question: "These phrases and defaults are on 3 watches.", here: "Here only", all: "On all 3 watches", count: 3,
    });
  });
});

describe("unlinking another watch", () => {
  function io(revisions: number[], conflicts = 0): VoiceUnlinkIO & { saved: VoiceDocument[] } {
    let reads = 0;
    let left = conflicts;
    const saved: VoiceDocument[] = [];
    return {
      saved,
      read: async () => ({ revision: revisions[Math.min(reads++, revisions.length - 1)]!, document: linked() }),
      save: async (_owner, _base, document) => {
        if (left-- > 0) throw { code: "conflict", message: "stored revision is 9" };
        saved.push(document);
        return { revision: 10 };
      },
    };
  }

  it("saves the copy without the link and keeps its phrases", async () => {
    const calls = io([4]);
    expect(await unlinkVoiceFrom(calls, "w2")).toEqual({ ok: true, unlinked: true });
    expect(calls.saved).toHaveLength(1);
    expect(Object.hasOwn(calls.saved[0]!, "linkIds")).toBe(false);
    expect(watchVoicePhrases(calls.saved[0]!)).toEqual(watchVoicePhrases(configured()));
  });

  it("reads again after a conflict, and gives up after three", async () => {
    expect(await unlinkVoiceFrom(io([4, 5], 1), "w2")).toEqual({ ok: true, unlinked: true });
    const result = await unlinkVoiceFrom(io([4, 5, 6], 3), "w2");
    expect(result).toMatchObject({ ok: false, code: "conflict" });
  });

  it("writes nothing to a watch with no link or no record", async () => {
    const plain: VoiceUnlinkIO = { read: async () => ({ revision: 3, document: configured() }), save: async () => { throw new Error("no save"); } };
    expect(await unlinkVoiceFrom(plain, "w2")).toEqual({ ok: true, unlinked: false });
    const none: VoiceUnlinkIO = { read: async () => ({ revision: 0, document: {} }), save: async () => { throw new Error("no save"); } };
    expect(await unlinkVoiceFrom(none, "w2")).toEqual({ ok: true, unlinked: false });
  });
});

describe("what a restore does to the phrase links", () => {
  const held: Record<string, string[]> = { A: ["Chen's Watch"], B: ["Jesse's Watch", "Chen's Watch"], C: [] };
  const holders = (link: string) => held[link] ?? [];
  const unit = (now?: string, restored?: string) => ({
    name: "phrases and defaults", holders, ...(now === undefined ? {} : { now }), ...(restored === undefined ? {} : { restored }),
  });

  it("says the copies change when the save keeps the link", () => {
    expect(restoreLinkLines([unit("A", "A")], "watch")).toEqual(["Also changes the phrases and defaults on Chen's Watch."]);
    // A link on this watch alone moves nothing.
    expect(restoreLinkLines([unit("C", "C")], "watch")).toEqual([]);
    expect(restoreLinkLines([unit()], "watch")).toEqual([]);
  });

  it("says this watch is unlinked when the save has no link or another one", () => {
    expect(restoreLinkLines([unit("A")], "watch")).toEqual(["Unlinks the phrases and defaults on this watch from Chen's Watch, which keeps its copy as it is."]);
    expect(restoreLinkLines([unit("B", "A")], "watch")).toEqual([
      "Unlinks the phrases and defaults on this watch from Jesse's Watch and Chen's Watch, which keep their copies as they are.",
      "Also changes the phrases and defaults on Chen's Watch, which it was shared with in that save.",
    ]);
    expect(restoreLinkLines([unit(undefined, "A")], "watch")).toEqual(["Also changes the phrases and defaults on Chen's Watch, which it was shared with in that save."]);
  });
});
