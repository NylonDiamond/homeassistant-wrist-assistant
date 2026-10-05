// The HTTP actions a watch can use, as the page editor, the menu editor and
// the complication editor list them: the home's one library that Home
// Assistant keeps (`wrist_assistant/http_actions/get`) first, then the
// actions of this watch's iPhone catalog (`catalog.ts`) that the library
// does not hold, each marked as living on the iPhone. So a watch whose phone
// has not handed its library over loses nothing.
//
// The library entry is the catalog's shape (`WatchCatalogHTTPAction`): id,
// name, icon and color, `hasReply` for a reply value, `needsSetup` for a
// blank URL. Never a URL, header or body. An integration older than the
// library, and a library at revision 0, give the catalog's list alone, as
// before the library.
//
// No DOM here, and nothing that would pull the watch editors' modules into
// the panel's first download: the complication editor reads it too.
//
// Plan: app repo docs/pages_in_home_assistant_step4.md ("4d batch 4 build
// contract", rule 12).

import type { WatchCatalog, WatchCatalogHTTPAction } from "./catalog.js";

/** The home's library as the pickers read it. `revision` 0 is a library
 * Home Assistant does not hold yet, and `actions` is then empty. */
export interface WatchHttpLibrary {
  revision: number;
  actions: readonly WatchCatalogHTTPAction[];
}

/** Every pick of a library action writes this prefix and the id in upper
 * case, as a tile's `entityId` and a complication's tap do. */
export const HTTP_ACTION_REF_PREFIX = "http_action.";

/** What the phone's add calls an action whose name is blank. Never the URL. */
const UNNAMED = "HTTP Action";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** The reply sources the phone's decoder knows; any other drops the whole
 * reply setting, so the action has none. */
const REPLY_SOURCES: readonly unknown[] = ["statusCode", "bodyText", "jsonField", "header", "regex"];

/**
 * The library of a `http_actions/get` answer, each action as a picker
 * lists it: a UUID string id (a tile and a slide store one), the first of
 * ids that differ only in case, the trimmed name else "HTTP Action". Every
 * entry is marked `source: "home"`. Undefined for no answer.
 */
export function readWatchHttpLibrary(record: { revision?: unknown; document?: unknown } | undefined): WatchHttpLibrary | undefined {
  if (record === undefined) return undefined;
  const revision = typeof record.revision === "number" && record.revision > 0 ? record.revision : 0;
  if (revision === 0) return { revision, actions: [] };
  const list = isObject(record.document) && Array.isArray(record.document.actions) ? record.document.actions : [];
  const seen = new Set<string>();
  const actions: WatchCatalogHTTPAction[] = [];
  for (const raw of list) {
    if (!isObject(raw) || typeof raw.id !== "string" || !UUID.test(raw.id)) continue;
    const key = raw.id.toUpperCase();
    if (seen.has(key)) continue;
    seen.add(key);
    const name = typeof raw.name === "string" ? raw.name.trim() : "";
    const reply = raw.responseConfig;
    const out: WatchCatalogHTTPAction = {
      id: raw.id,
      name: name === "" ? UNNAMED : name,
      hasReply: isObject(reply) && REPLY_SOURCES.includes(reply.source),
      needsSetup: typeof raw.url !== "string" || raw.url.trim() === "",
      source: "home",
    };
    if (typeof raw.icon === "string") out.icon = raw.icon;
    if (typeof raw.iconColor === "string") out.iconColor = raw.iconColor;
    actions.push(out);
  }
  return { revision, actions };
}

/** Whether a failed read of the library means there is none to read: an
 * integration older than the library does not know the command. Anything
 * else (a dropped socket) keeps what is shown. */
export function watchHttpLibraryReadMeansNone(error: unknown): boolean {
  return isObject(error) && error.code === "unknown_command";
}

/**
 * The catalog the pickers read, with the home's library in it. The library's
 * actions first, in its order, then the catalog's that the library does not
 * hold (ids compared without regard to case), marked `source: "iphone"`;
 * the catalog's other lists are left as they are. Without a phone catalog
 * the library still comes through, on a catalog marked `noPhone`.
 *
 * With no library (an older integration) the catalog comes back as it is.
 * At revision 0 its lists are as they are too, and the catalog is only
 * marked, so the words can name the HTTP actions screen.
 */
export function watchCatalogWithHttpLibrary(catalog: WatchCatalog | undefined, library: WatchHttpLibrary | undefined): WatchCatalog | undefined {
  if (library === undefined) return catalog;
  if (!(library.revision > 0)) return catalog === undefined ? undefined : { ...catalog, httpLibrary: "empty" };
  const held = new Set(library.actions.map((a) => a.id.toUpperCase()));
  const phone = (catalog?.httpActions ?? [])
    .filter((a) => !held.has(a.id.toUpperCase()))
    .map((a): WatchCatalogHTTPAction => ({ ...a, source: "iphone" }));
  const httpActions = [...library.actions.map((a): WatchCatalogHTTPAction => (a.source === "home" ? a : { ...a, source: "home" })), ...phone];
  if (catalog !== undefined) return { ...catalog, httpActions, httpLibrary: "held" };
  return { revision: 0, updatedAt: undefined, httpActions, macros: [], statusPages: [], voice: undefined, noPhone: true, httpLibrary: "held" };
}

/** The action id a stored reference names: the part after `http_action.`,
 * or the reference as it is. The watch reads both forms. */
export function httpActionRefId(reference: string): string {
  return reference.startsWith(HTTP_ACTION_REF_PREFIX) ? reference.slice(HTTP_ACTION_REF_PREFIX.length) : reference;
}

/** The library action a stored reference names, compared without regard to
 * case; undefined for a blank one or one the library does not hold. */
export function findHttpLibraryAction(actions: readonly WatchCatalogHTTPAction[], reference: unknown): WatchCatalogHTTPAction | undefined {
  if (typeof reference !== "string" || reference.trim() === "") return undefined;
  const id = httpActionRefId(reference).toUpperCase();
  return actions.find((a) => a.id.toUpperCase() === id);
}
