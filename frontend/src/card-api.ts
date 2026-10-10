// The dashboard card's three commands (`dashboard_card_ws.py`). Open to every
// signed-in user, and read only: the card never writes a design.

import type { HassLike } from "./ha-api.js";

const PREFIX = "wrist_assistant/card";

/** One design in the card editor's picker. */
export interface CardDesign {
  owner_watch_id: string;
  owner_name: string;
  complication_id: string;
  name: string;
  families: string[];
  revision: number;
  /** A Dashboard design's own size in points. Absent for every other shape. */
  canvas?: { width: number; height: number };
}

/** The design a card shows, as `get` and each `subscribe` event carry it.
 * `owner_watch_id` is where it is now, which is not always where the card was
 * set up: a design can move to another device or into the Library. */
export interface CardRecord {
  owner_watch_id: string;
  complication_id: string;
  revision: number;
  updated_at: string;
  document: unknown;
}

export type CardEvent = CardRecord | { deleted: true };

export async function fetchCardDesigns(hass: HassLike): Promise<CardDesign[]> {
  const reply = await hass.connection.sendMessagePromise<{ designs: CardDesign[] }>({ type: `${PREFIX}/designs` });
  return reply.designs;
}

export function fetchCardRecord(hass: HassLike, owner: string, complicationId: string): Promise<CardRecord> {
  return hass.connection.sendMessagePromise<CardRecord>({
    type: `${PREFIX}/get`,
    owner_watch_id: owner,
    complication_id: complicationId,
  });
}

export function subscribeCardRecord(
  hass: HassLike,
  owner: string,
  complicationId: string,
  onEvent: (event: CardEvent) => void,
): Promise<() => Promise<void>> {
  return hass.connection.subscribeMessage<CardEvent>(onEvent, {
    type: `${PREFIX}/subscribe`,
    owner_watch_id: owner,
    complication_id: complicationId,
  });
}

/** The error code a command failed with, when it says one. */
export function errorCode(err: unknown): string | undefined {
  const code = (err as { code?: unknown } | null)?.code;
  return typeof code === "string" ? code : undefined;
}
