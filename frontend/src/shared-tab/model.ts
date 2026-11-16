// What the Shared tab's cards say: one short line of facts for each thing the
// whole home keeps, worked out from what Home Assistant answers, with no
// drawing in it so a test can read it.

import type { CameraFraming, HttpActionsRecord, OwnerSummary } from "../ha-api.js";
import { ASLEEP_AFTER_DAYS, seenDays } from "../sync-pill.js";
import { HTTP_ACTIONS_LIMIT_BYTES, httpActionsSize } from "../watch-http-actions/model.js";
import { settingsWatches } from "../watch-settings.js";

/** "812 bytes", "2.4 KB". */
function kb(bytes: number): string {
  return bytes < 1000 ? `${bytes} bytes` : `${Number((bytes / 1000).toFixed(1))} KB`;
}

function plural(n: number, one: string, many = `${one}s`): string {
  return `${n} ${n === 1 ? one : many}`;
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** One action as its card lists it. `method` is absent in the list a person
 * who is not an administrator is told. */
export interface HttpCardRow {
  method?: string;
  name: string;
}

/** The HTTP actions card. */
export interface HttpCardFacts {
  /** "5 actions · 2.4 KB of 262 KB · Synced". */
  words: string;
  /** The first few, to recognize them by. */
  rows: HttpCardRow[];
}

/** How many actions its card lists. */
export const HTTP_CARD_ROWS = 3;

/** The card's facts. An administrator's answer holds the whole library, and
 * says its size and whether every awake device has collected it; anyone
 * else's holds only the public list. */
export function httpCardFacts(record: HttpActionsRecord | undefined, owners: readonly OwnerSummary[]): HttpCardFacts {
  if (record === undefined || record.revision <= 0) return { words: "No actions yet", rows: [] };
  const full = isObject(record.document) ? record.document : undefined;
  const source = full ?? (isObject(record.public) ? record.public : undefined);
  const list = Array.isArray(source?.actions) ? source.actions.filter(isObject) : [];
  const rows = list.slice(0, HTTP_CARD_ROWS).map((a): HttpCardRow => {
    const name = typeof a.name === "string" && a.name.trim() !== "" ? a.name.trim() : "Unnamed action";
    if (full === undefined) return { name };
    return { name, method: (typeof a.method === "string" ? a.method : "POST").trim().toUpperCase() };
  });
  const parts = [plural(list.length, "action")];
  if (full !== undefined) {
    parts.push(`${kb(httpActionsSize(full))} of ${Math.round(HTTP_ACTIONS_LIMIT_BYTES / 1000)} KB`);
    const waiting = watchesAwake(owners).filter((o) => (record.delivered?.[o.owner_watch_id] ?? 0) < record.revision).length;
    parts.push(waiting === 0 ? "Synced" : `${waiting} waiting`);
  }
  return { words: parts.join(" · "), rows };
}

/** The devices that count for "Synced": the watches the HTTP actions screen
 * reports the pulls of (`settingsWatches`, as `httpActionsDelivery` reads
 * them), less any asleep (`ASLEEP_AFTER_DAYS`). */
function watchesAwake(owners: readonly OwnerSummary[]): OwnerSummary[] {
  return settingsWatches(owners).filter((o) => {
    if (o.polling === true) return true;
    const days = seenDays(typeof o.last_seen_seconds === "number" ? o.last_seen_seconds : undefined);
    return days === undefined || days < ASLEEP_AFTER_DAYS;
  });
}

/** The Camera framing card. */
export interface CameraCardFacts {
  /** "2 of 13 cameras framed · how each picture is cut in alerts". */
  words: string;
  /** The ones to show small, framed ones first. */
  thumbs: { entityId: string; name: string; framed: boolean }[];
}

/** How many pictures its card shows. */
export const CAMERA_CARD_THUMBS = 4;

export function cameraCardFacts(cameras: readonly CameraFraming[] | undefined): CameraCardFacts {
  if (cameras === undefined || cameras.length === 0) return { words: "No cameras in Home Assistant yet", thumbs: [] };
  const framed = cameras.filter((c) => c.viewport !== null);
  const thumbs = [...framed, ...cameras.filter((c) => c.viewport === null)].slice(0, CAMERA_CARD_THUMBS)
    .map((c) => ({ entityId: c.entity_id, name: c.name, framed: c.viewport !== null }));
  return { words: `${framed.length} of ${plural(cameras.length, "camera")} framed · how each picture is cut in alerts`, thumbs };
}
