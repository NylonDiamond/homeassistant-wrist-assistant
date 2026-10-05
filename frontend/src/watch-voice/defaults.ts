// The voice defaults the page editor and the menu editor show behind a
// tile's or a slot's own voice: the watch's `voice` record when Home
// Assistant holds one, else the iPhone's `catalog.voice` (part 3f batch 2,
// kept for older apps), else none. Small on purpose: both editors' chunks
// import it, the voice editor's own chunk stays apart.
//
// Plan: app repo docs/pages_in_home_assistant_step4.md ("4d batch 2 build
// contract", items 2 and 4).

import type { WatchConfigRecord } from "../ha-api.js";
import type { WatchCatalog, WatchCatalogVoice } from "../watch-pages/catalog.js";
import { type JsonObject, isJsonObject } from "../watch-pages/model.js";

function filled(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() !== "" ? value : undefined;
}

/** A voice document's defaults, read as the catalog's are: each field only
 * when it is a string that is not blank; the speakers that are not blank,
 * in order, left out when none is left. */
export function voiceDefaultsOfDocument(document: JsonObject): WatchCatalogVoice {
  const out: { defaultAssistAgentId?: string; defaultSpeakers?: string[]; defaultTTSEngine?: string } = {};
  const agent = filled(document.defaultAssistAgentId);
  if (agent !== undefined) out.defaultAssistAgentId = agent;
  const speakers = Array.isArray(document.defaultSpeakers) ? document.defaultSpeakers.filter((s): s is string => filled(s) !== undefined) : [];
  if (speakers.length > 0) out.defaultSpeakers = speakers;
  const engine = filled(document.defaultTTSEngine);
  if (engine !== undefined) out.defaultTTSEngine = engine;
  return out;
}

/** The voice document of a `voice` record, or undefined when Home Assistant
 * holds none (revision 0) or there is no record. */
export function voiceDocumentOfRecord(record: Pick<WatchConfigRecord, "revision" | "document"> | undefined): JsonObject | undefined {
  return record !== undefined && record.revision > 0 && isJsonObject(record.document) ? record.document : undefined;
}

/**
 * The defaults to show: the voice record's when there is one, else the
 * catalog's, else undefined (neither: the editors say where to set them).
 */
export function watchVoiceFallbacks(voiceDocument: JsonObject | undefined, catalog: Pick<WatchCatalog, "voice"> | undefined): WatchCatalogVoice | undefined {
  if (voiceDocument !== undefined) return voiceDefaultsOfDocument(voiceDocument);
  return catalog?.voice;
}

/** A phrase of the voice record as a picker lists it: its id and its name
 * (its label, else its message). */
export interface VoicePhraseTarget {
  id: string;
  name: string;
}

/** The phrases of a voice document, in library order, for the menu editor's
 * pickers. Entries without a string id are skipped. */
export function voicePhraseTargets(voiceDocument: JsonObject | undefined): VoicePhraseTarget[] {
  const list = voiceDocument !== undefined && Array.isArray(voiceDocument.phrases) ? voiceDocument.phrases : [];
  return list.filter(isJsonObject).filter((p) => typeof p.id === "string" && p.id !== "").map((p) => ({
    id: p.id as string,
    name: filled(p.label)?.trim() ?? filled(p.message)?.trim() ?? "New phrase",
  }));
}

/** The line the editors show where a default would be named, while neither
 * the voice record nor the catalog says what the defaults are. */
export const WATCH_VOICE_DEFAULTS_UNKNOWN_TEXT = "Set the voice defaults in Voice, or open the iPhone app to list its own here";
