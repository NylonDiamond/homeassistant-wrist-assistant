// Complications hidden from the header picker. Hiding is the panel's own
// business: nothing goes on the wire and the watch draws exactly what it drew.
// The list lives in this browser, one per watch, so a complication hidden for
// one watch still shows when another is picked.

const STORE_PREFIX = "wrist-assistant-panel.picker-hidden.v1:";

/** This browser's local storage, or undefined where reaching it throws (a
 * private window, blocked site data) or there is no window at all. */
export function pickerStorage(): Storage | undefined {
  try {
    return typeof window === "undefined" ? undefined : window.localStorage;
  } catch {
    return undefined;
  }
}

/** The storage key for one watch's hidden list. */
export function hiddenStoreKey(ownerId: string): string {
  return STORE_PREFIX + ownerId;
}

/** Read a stored list leniently: anything that is not an array of strings is
 * an empty list rather than an error. */
export function parseHidden(raw: string | null | undefined): Set<string> {
  if (!raw) return new Set();
  try {
    const value: unknown = JSON.parse(raw);
    return Array.isArray(value) ? new Set(value.filter((v): v is string => typeof v === "string")) : new Set();
  } catch {
    return new Set();
  }
}

/** One watch's hidden ids. Storage that throws (a private window, blocked site
 * data) reads as nothing hidden. */
export function loadHidden(storage: Pick<Storage, "getItem"> | undefined, ownerId: string): Set<string> {
  try {
    return parseHidden(storage?.getItem(hiddenStoreKey(ownerId)));
  } catch {
    return new Set();
  }
}

/** Keep one watch's hidden ids. An empty list removes the key. Storage that
 * throws is ignored: the list still holds for this visit. */
export function saveHidden(storage: Pick<Storage, "setItem" | "removeItem"> | undefined, ownerId: string, hidden: ReadonlySet<string>): void {
  try {
    if (hidden.size === 0) storage?.removeItem(hiddenStoreKey(ownerId));
    else storage?.setItem(hiddenStoreKey(ownerId), JSON.stringify([...hidden].sort()));
  } catch {
    // Nothing to do: the in-memory list is still right.
  }
}

/** The list with `id` hidden, or shown again when it already was. Ids no
 * longer on the watch are dropped when `known` is given, so a deleted
 * complication does not linger in storage. */
export function toggleHidden(hidden: ReadonlySet<string>, id: string, known?: readonly string[]): Set<string> {
  const next = new Set(hidden);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  if (known) {
    const keep = new Set(known);
    for (const h of [...next]) if (!keep.has(h)) next.delete(h);
  }
  return next;
}

/** Split picker rows into the ones shown and the ones hidden, each keeping its
 * order. A row without an id (a locked slot) is never hidden, and neither is
 * the complication open now, which stays in the list so it can always be
 * picked. */
export function splitHidden<T>(
  rows: readonly T[],
  idOf: (row: T) => string | undefined,
  hidden: ReadonlySet<string>,
  openId: string | undefined,
): { shown: T[]; hidden: T[] } {
  const shown: T[] = [];
  const tucked: T[] = [];
  for (const row of rows) {
    const id = idOf(row);
    if (id !== undefined && id !== openId && hidden.has(id)) tucked.push(row);
    else shown.push(row);
  }
  return { shown, hidden: tucked };
}
