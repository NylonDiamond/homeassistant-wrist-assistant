// The home's HTTP action library as Home Assistant keeps it (one for the
// whole home, not a watch config kind), without any drawing: the phone's own
// document `{"schemaVersion": 1, "actions": [HTTPAction…],
// "globalVariables": [HTTPGlobalVariable…]}`.
//
// The document is kept raw, as the watch editors keep theirs. Every setter
// takes the document and returns a new one in which only the objects on the
// path of the change are new; every key it does not model goes back as it
// came, on the document, on each action and on each header, variable and
// global. A key an object did not have goes in at its sorted place, as the
// phone's sorted-key encoder writes it. A setter refuses by returning the
// document it was given, and so does an edit that changes nothing. No setter
// writes a null: an optional key that is not set is left out, as the
// phone's encoder leaves out a nil.
//
// An action is matched by its `id`, a header and a variable by theirs, a
// global by its `id` too (the merge matches globals by key).
//
// The field rules are the phone's (`Shared/HTTPActionConfig.swift` and its
// editor, `HTTPActionsSettingsView.swift`): which keys are left out when
// unset, the methods, body types and reply sources, the `{{key}}` tokens,
// and the sign-in helper (`HTTPActionAuth`), which writes one ordinary
// header and reads it back.
//
// Plan: app repo docs/pages_in_home_assistant_step4.md ("4d batch 4 build
// contract", rules 10 and 11).

import { sameWatchPagesJson } from "../watch-pages/merge.js";
import { type JsonObject, isJsonObject } from "../watch-pages/model.js";
import { watchCommandError } from "../watch-pages/save-note.js";

// ── the document ─────────────────────────────────────────────────────────

export type HttpActionsDoc = JsonObject;

export const HTTP_ACTIONS_KEY = "actions";
export const HTTP_GLOBALS_KEY = "globalVariables";
export const HTTP_ACTIONS_SCHEMA_VERSION = 1;

/** What Home Assistant stores at most, compact UTF-8. */
export const HTTP_ACTIONS_LIMIT_BYTES = 256 * 1024;

export const HTTP_METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE"] as const;
export type HttpMethod = (typeof HTTP_METHODS)[number];

/** The verbs that carry a body. */
export const HTTP_BODY_METHODS: readonly string[] = ["POST", "PUT", "PATCH", "DELETE"];

export const HTTP_BODY_TYPES = ["none", "json", "form", "text", "audio"] as const;
export type HttpBodyType = (typeof HTTP_BODY_TYPES)[number];

export const HTTP_REPLY_SOURCES = ["statusCode", "bodyText", "jsonField", "header", "regex"] as const;
export type HttpReplySource = (typeof HTTP_REPLY_SOURCES)[number];

export const HTTP_VARIABLE_KINDS = ["text", "number"] as const;
export type HttpVariableKind = (typeof HTTP_VARIABLE_KINDS)[number];

/** Seconds, when an action sets none. Home Assistant holds a timeout
 * between the two bounds. */
export const HTTP_DEFAULT_TIMEOUT = 10;
export const HTTP_TIMEOUT_MIN = 1;
export const HTTP_TIMEOUT_MAX = 60;

/** What a `{{key}}` may be made of. */
export const HTTP_KEY_PATTERN = /^[A-Za-z0-9_]+$/;

/** A `{{key}}` token, spaces inside the braces allowed, as the phone reads one. */
const TOKEN = /\{\{\s*([A-Za-z0-9_]+)\s*\}\}/g;

/** The library before anything is in it, keys sorted. */
export function httpActionsEmpty(): HttpActionsDoc {
  return { [HTTP_ACTIONS_KEY]: [], [HTTP_GLOBALS_KEY]: [], schemaVersion: HTTP_ACTIONS_SCHEMA_VERSION };
}

export function asHttpActionsDoc(value: unknown): HttpActionsDoc | undefined {
  return isJsonObject(value) ? value : undefined;
}

export function httpActionsSize(document: HttpActionsDoc): number {
  return new TextEncoder().encode(JSON.stringify(document)).length;
}

export function httpActionsBudget(document: HttpActionsDoc): { size: number; limit: number; near: boolean } {
  const size = httpActionsSize(document);
  return { size, limit: HTTP_ACTIONS_LIMIT_BYTES, near: size / HTTP_ACTIONS_LIMIT_BYTES > 0.8 };
}

function rawList(object: JsonObject | undefined, key: string): unknown[] {
  const list = object !== undefined && Object.hasOwn(object, key) ? object[key] : undefined;
  return Array.isArray(list) ? list : [];
}

/** The actions, in the stored order: every element that is an object. */
export function httpActionList(document: HttpActionsDoc | undefined): JsonObject[] {
  return rawList(document, HTTP_ACTIONS_KEY).filter(isJsonObject);
}

/** The globals, in the stored order. */
export function httpGlobalList(document: HttpActionsDoc | undefined): JsonObject[] {
  return rawList(document, HTTP_GLOBALS_KEY).filter(isJsonObject);
}

export function findHttpAction(document: HttpActionsDoc | undefined, id: string): JsonObject | undefined {
  return httpActionList(document).find((a) => a.id === id);
}

export function findHttpGlobal(document: HttpActionsDoc | undefined, id: string): JsonObject | undefined {
  return httpGlobalList(document).find((g) => g.id === id);
}

// ── reading ──────────────────────────────────────────────────────────────

export interface HttpHeader {
  id: string;
  name: string;
  value: string;
}

export interface HttpVariable {
  id: string;
  key: string;
  prompt: string;
  kind: HttpVariableKind;
  presetValues: string[];
  presetsOnly: boolean;
}

export interface HttpGlobal {
  id: string;
  key: string;
  value: string;
}

export interface HttpReply {
  source: HttpReplySource;
  jsonPath?: string;
  headerName?: string;
  pattern?: string;
  unit?: string;
}

/** One action as the phone's decoder reads it, with its fallbacks. */
export interface HttpAction {
  id: string;
  name: string;
  method: string;
  url: string;
  headers: HttpHeader[];
  body?: string;
  bodyContentType: HttpBodyType;
  timeout?: number;
  variables: HttpVariable[];
  reply?: HttpReply;
  allowsUntrustedCertificate: boolean;
  presentsClientCertificate: boolean;
  icon?: string;
  iconColor?: string;
}

function str(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function oneOf<T extends string>(value: unknown, list: readonly T[]): T | undefined {
  return typeof value === "string" && (list as readonly string[]).includes(value) ? (value as T) : undefined;
}

export function readHttpHeader(raw: unknown): HttpHeader {
  const o = isJsonObject(raw) ? raw : {};
  return { id: str(o.id) ?? "", name: str(o.name) ?? "", value: str(o.value) ?? "" };
}

export function readHttpVariable(raw: unknown): HttpVariable {
  const o = isJsonObject(raw) ? raw : {};
  const presets = Array.isArray(o.presetValues) ? o.presetValues.filter((v): v is string => typeof v === "string") : [];
  return {
    id: str(o.id) ?? "",
    key: str(o.key) ?? "",
    prompt: str(o.prompt) ?? "",
    kind: oneOf(o.kind, HTTP_VARIABLE_KINDS) ?? "text",
    presetValues: presets,
    presetsOnly: o.presetsOnly === true,
  };
}

export function readHttpGlobal(raw: unknown): HttpGlobal {
  const o = isJsonObject(raw) ? raw : {};
  return { id: str(o.id) ?? "", key: str(o.key) ?? "", value: str(o.value) ?? "" };
}

/** The reply setting, or none. An unknown source reads as none, as the
 * phone's decoder drops the whole setting then. */
export function readHttpReply(raw: unknown): HttpReply | undefined {
  if (!isJsonObject(raw)) return undefined;
  const source = oneOf(raw.source, HTTP_REPLY_SOURCES);
  if (source === undefined) return undefined;
  const out: HttpReply = { source };
  for (const key of ["jsonPath", "headerName", "pattern", "unit"] as const) {
    const v = str(raw[key]);
    if (v !== undefined) out[key] = v;
  }
  return out;
}

export function readHttpAction(raw: JsonObject): HttpAction {
  const timeout = typeof raw.timeout === "number" && Number.isFinite(raw.timeout) ? raw.timeout : undefined;
  const out: HttpAction = {
    id: str(raw.id) ?? "",
    name: str(raw.name) ?? "",
    method: str(raw.method) ?? "POST",
    url: str(raw.url) ?? "",
    headers: Array.isArray(raw.headers) ? raw.headers.map(readHttpHeader) : [],
    bodyContentType: oneOf(raw.bodyContentType, HTTP_BODY_TYPES) ?? "none",
    variables: Array.isArray(raw.variables) ? raw.variables.map(readHttpVariable) : [],
    allowsUntrustedCertificate: raw.allowsUntrustedCertificate === true,
    presentsClientCertificate: raw.presentsClientCertificate === true,
  };
  const body = str(raw.body);
  if (body !== undefined) out.body = body;
  if (timeout !== undefined) out.timeout = timeout;
  const reply = readHttpReply(raw.responseConfig);
  if (reply !== undefined) out.reply = reply;
  const icon = str(raw.icon);
  const color = str(raw.iconColor);
  if (icon !== undefined) out.icon = icon;
  if (color !== undefined) out.iconColor = color;
  return out;
}

/** The method as the request sends it. */
export function httpMethodOf(action: Pick<HttpAction, "method">): string {
  return action.method.trim().toUpperCase();
}

/** Whether the action's verb carries a body. */
export function httpSendsBody(action: Pick<HttpAction, "method">): boolean {
  return HTTP_BODY_METHODS.includes(httpMethodOf(action));
}

/** A voice clip action: the watch records the body when it runs. */
export function httpNeedsAudio(action: Pick<HttpAction, "method" | "bodyContentType">): boolean {
  return action.bodyContentType === "audio" && httpSendsBody(action);
}

/** No URL yet: the watch shows it as needing setup. */
export function httpNeedsSetup(action: Pick<HttpAction, "url">): boolean {
  return action.url.trim() === "";
}

/** The name a list shows: the action's own, else its URL, else a stand-in. */
export function httpActionLabel(action: Pick<HttpAction, "name" | "url">): string {
  const name = action.name.trim();
  if (name !== "") return name;
  const url = action.url.trim();
  return url !== "" ? url : "Untitled action";
}

/** The timeout the request uses: the action's, else 10 s, held between 1
 * and 60 s as Home Assistant holds it. */
export function httpEffectiveTimeout(action: Pick<HttpAction, "timeout">): number {
  const t = action.timeout ?? HTTP_DEFAULT_TIMEOUT;
  return Math.min(HTTP_TIMEOUT_MAX, Math.max(HTTP_TIMEOUT_MIN, t));
}

/** `garage_message` → "Garage Message", the phone's prompt for a key with
 * none typed. */
export function humanizeHttpKey(key: string): string {
  const spaced = key.replaceAll("_", " ").replaceAll("-", " ");
  if (spaced.trim() === "") return "Value";
  return spaced.split(" ").filter((w) => w !== "").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

/** A typed key with every character the token pattern refuses taken out. */
export function sanitizeHttpKey(raw: string): string {
  return raw.replace(/[^A-Za-z0-9_]/g, "");
}

/** The quick values as a run reads them: trimmed, empties dropped, first
 * occurrence wins. */
export function httpQuickValues(variable: Pick<HttpVariable, "presetValues">): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const v of variable.presetValues) {
    const t = v.trim();
    if (t === "" || seen.has(t)) continue;
    seen.add(t);
    out.push(t);
  }
  return out;
}

// ── tokens ───────────────────────────────────────────────────────────────

/** Every distinct `{{key}}` in the strings, in first-seen order. */
export function httpTokens(strings: readonly string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const s of strings) {
    for (const m of s.matchAll(TOKEN)) {
      const key = m[1]!;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(key);
    }
  }
  return out;
}

/** The keys of the globals, those with a name. */
export function httpGlobalKeys(document: HttpActionsDoc | undefined): Set<string> {
  const keys = new Set<string>();
  for (const g of httpGlobalList(document)) {
    const key = readHttpGlobal(g).key.trim();
    if (key !== "") keys.add(key);
  }
  return keys;
}

/** Every string a token can sit in: the URL, the header names and values,
 * and the body when the verb sends one and it is not a voice clip. A
 * username and password header is base64, which no token reaches, so its
 * value is left out, as the phone leaves it out. */
export function httpTokenSources(action: HttpAction): string[] {
  const out = [action.url];
  for (const h of action.headers) {
    out.push(h.name);
    if (!isBasicAuthHeader(h)) out.push(h.value);
  }
  if (httpSendsBody(action) && action.bodyContentType !== "audio" && action.body !== undefined) out.push(action.body);
  return out;
}

/** The action's tokens: those that name a global (filled in from Globals)
 * and those asked for when it runs, each in first-seen order. */
export function httpActionTokens(action: HttpAction, globals: ReadonlySet<string>): { global: string[]; asked: string[] } {
  const all = httpTokens(httpTokenSources(action));
  return { global: all.filter((k) => globals.has(k)), asked: all.filter((k) => !globals.has(k)) };
}

/** The variables a run asks for: those whose key is a token of the action
 * and names no global, in token order. */
export function httpPromptVariables(action: HttpAction, globals: ReadonlySet<string>): HttpVariable[] {
  const { asked } = httpActionTokens(action, globals);
  return asked.map((k) => action.variables.find((v) => v.key === k)).filter((v): v is HttpVariable => v !== undefined);
}

// ── writing keys ─────────────────────────────────────────────────────────

function put(object: JsonObject, key: string, value: unknown): void {
  if (key === "__proto__") Object.defineProperty(object, key, { value, enumerable: true, writable: true, configurable: true });
  else object[key] = value;
}

/** `object` with `key` set. A key it holds keeps its place; a new key goes at
 * its sorted place. The object itself when the value is the same JSON. */
export function withHttpKey(object: JsonObject, key: string, value: unknown): JsonObject {
  if (Object.hasOwn(object, key)) {
    if (sameWatchPagesJson(object[key], value) && typeof object[key] === typeof value) return object;
    const out: JsonObject = {};
    for (const k of Object.keys(object)) put(out, k, k === key ? value : object[k]);
    return out;
  }
  const out: JsonObject = {};
  let placed = false;
  for (const k of Object.keys(object)) {
    if (!placed && k > key) {
      put(out, key, value);
      placed = true;
    }
    put(out, k, object[k]);
  }
  if (!placed) put(out, key, value);
  return out;
}

/** `object` without `key`, or the object itself when it has none. */
export function withoutHttpKey(object: JsonObject, key: string): JsonObject {
  if (!Object.hasOwn(object, key)) return object;
  const out: JsonObject = {};
  for (const k of Object.keys(object)) if (k !== key) put(out, k, object[k]);
  return out;
}

/** An optional key: set, or left out for `undefined`. */
function withOptional(object: JsonObject, key: string, value: unknown): JsonObject {
  return value === undefined ? withoutHttpKey(object, key) : withHttpKey(object, key, value);
}

/** An element of a list of objects replaced through `change`, matched by
 * `id`. The list itself when there is no such element or nothing changed. */
function withListItem(list: unknown[], id: string, change: (item: JsonObject) => JsonObject): unknown[] {
  const index = list.findIndex((e) => isJsonObject(e) && e.id === id);
  if (index < 0) return list;
  const item = list[index] as JsonObject;
  const next = change(item);
  if (next === item) return list;
  const copy = list.slice();
  copy[index] = next;
  return copy;
}

function withList(object: JsonObject, key: string, list: unknown[]): JsonObject {
  return list === object[key] ? object : withHttpKey(object, key, list);
}

/** The document with one action replaced through `change`. */
export function withHttpAction(document: HttpActionsDoc, id: string, change: (action: JsonObject) => JsonObject): HttpActionsDoc {
  const list = rawList(document, HTTP_ACTIONS_KEY);
  const next = withListItem(list, id, change);
  return next === list ? document : withList(document, HTTP_ACTIONS_KEY, next);
}

/** The document with one global replaced through `change`. */
function withHttpGlobal(document: HttpActionsDoc, id: string, change: (global: JsonObject) => JsonObject): HttpActionsDoc {
  const list = rawList(document, HTTP_GLOBALS_KEY);
  const next = withListItem(list, id, change);
  return next === list ? document : withList(document, HTTP_GLOBALS_KEY, next);
}

// ── ids ──────────────────────────────────────────────────────────────────

/** A new id, upper case as the phone's UUIDs are written. */
export function newHttpId(): string {
  const c = globalThis.crypto;
  if (c !== undefined && typeof c.randomUUID === "function") return c.randomUUID().toUpperCase();
  const hex = (n: number) => Array.from({ length: n }, () => Math.floor(Math.random() * 16).toString(16)).join("");
  return `${hex(8)}-${hex(4)}-4${hex(3)}-${(8 + Math.floor(Math.random() * 4)).toString(16)}${hex(3)}-${hex(12)}`.toUpperCase();
}

// ── actions ──────────────────────────────────────────────────────────────

/** A new action as the phone makes one: POST, no body, nothing asked for.
 * Keys sorted. */
export function newHttpAction(id: string, name: string): JsonObject {
  return { bodyContentType: "none", headers: [], id, method: "POST", name, url: "", variables: [] };
}

/** "New action", or "New action 2" and on while the name is taken. */
export function freshHttpActionName(document: HttpActionsDoc, base = "New action"): string {
  const taken = new Set(httpActionList(document).map((a) => readHttpAction(a).name.trim().toLowerCase()));
  if (!taken.has(base.toLowerCase())) return base;
  for (let n = 2; ; n++) if (!taken.has(`${base} ${n}`.toLowerCase())) return `${base} ${n}`;
}

export function addHttpAction(document: HttpActionsDoc, action: JsonObject): HttpActionsDoc {
  return withList(document, HTTP_ACTIONS_KEY, [...rawList(document, HTTP_ACTIONS_KEY), action]);
}

/** A copy under a new identity, as the phone duplicates: new ids for the
 * action, its headers and its variables, named "<name> Copy", right after
 * the original. */
export function duplicateHttpAction(document: HttpActionsDoc, id: string, makeId: () => string = newHttpId): { document: HttpActionsDoc; id?: string } {
  const list = rawList(document, HTTP_ACTIONS_KEY);
  const index = list.findIndex((e) => isJsonObject(e) && e.id === id);
  if (index < 0) return { document };
  const original = list[index] as JsonObject;
  const copyId = makeId();
  let copy = withHttpKey(original, "id", copyId);
  copy = withHttpKey(copy, "name", `${httpActionLabel(readHttpAction(original))} Copy`);
  const rekey = (items: unknown) => (Array.isArray(items) ? items.map((e) => (isJsonObject(e) ? withHttpKey(e, "id", makeId()) : e)) : items);
  if (Array.isArray(original.headers)) copy = withHttpKey(copy, "headers", rekey(original.headers));
  if (Array.isArray(original.variables)) copy = withHttpKey(copy, "variables", rekey(original.variables));
  const next = list.slice();
  next.splice(index + 1, 0, copy);
  return { document: withList(document, HTTP_ACTIONS_KEY, next), id: copyId };
}

export function removeHttpAction(document: HttpActionsDoc, id: string): HttpActionsDoc {
  const list = rawList(document, HTTP_ACTIONS_KEY);
  const next = list.filter((e) => !(isJsonObject(e) && e.id === id));
  return next.length === list.length ? document : withList(document, HTTP_ACTIONS_KEY, next);
}

/** The action moved to `index` (clamped). */
export function moveHttpAction(document: HttpActionsDoc, id: string, index: number): HttpActionsDoc {
  const list = rawList(document, HTTP_ACTIONS_KEY);
  const from = list.findIndex((e) => isJsonObject(e) && e.id === id);
  if (from < 0) return document;
  const to = Math.max(0, Math.min(index, list.length - 1));
  if (from === to) return document;
  const copy = list.slice();
  const [item] = copy.splice(from, 1);
  copy.splice(to, 0, item);
  return withList(document, HTTP_ACTIONS_KEY, copy);
}

export function setHttpActionName(document: HttpActionsDoc, id: string, name: string): HttpActionsDoc {
  return withHttpAction(document, id, (a) => withHttpKey(a, "name", name));
}

/** The icon, or the default glyph for an empty one. */
export function setHttpActionIcon(document: HttpActionsDoc, id: string, icon: string): HttpActionsDoc {
  const v = icon.trim();
  return withHttpAction(document, id, (a) => withOptional(a, "icon", v === "" ? undefined : v));
}

/** The icon's color as `#RRGGBB`, or the accent for none. */
export function setHttpActionColor(document: HttpActionsDoc, id: string, hex: string | undefined): HttpActionsDoc {
  if (hex !== undefined && !/^#[0-9a-f]{6}([0-9a-f]{2})?$/i.test(hex)) return document;
  return withHttpAction(document, id, (a) => withOptional(a, "iconColor", hex?.toUpperCase()));
}

export function setHttpActionMethod(document: HttpActionsDoc, id: string, method: string): HttpActionsDoc {
  const m = method.trim().toUpperCase();
  if (!(HTTP_METHODS as readonly string[]).includes(m)) return document;
  return withHttpAction(document, id, (a) => {
    let next = withHttpKey(a, "method", m);
    // A verb with no body drops the voice clip, as the phone's body picker
    // goes away with it; a typed body stays for the next body verb.
    if (!HTTP_BODY_METHODS.includes(m) && next.bodyContentType === "audio") next = withHttpKey(next, "bodyContentType", "none");
    return next;
  });
}

export function setHttpActionUrl(document: HttpActionsDoc, id: string, url: string): HttpActionsDoc {
  return withHttpAction(document, id, (a) => withHttpKey(a, "url", url));
}

/** The body type. A voice clip carries no typed body, so its body is left
 * out, as the phone stores none for it. */
export function setHttpActionBodyType(document: HttpActionsDoc, id: string, type: HttpBodyType): HttpActionsDoc {
  if (!(HTTP_BODY_TYPES as readonly string[]).includes(type)) return document;
  return withHttpAction(document, id, (a) => {
    const next = withHttpKey(a, "bodyContentType", type);
    return type === "audio" ? withoutHttpKey(next, "body") : next;
  });
}

/** The body; one that is empty or only spaces is left out, as the phone
 * stores none. */
export function setHttpActionBody(document: HttpActionsDoc, id: string, body: string): HttpActionsDoc {
  return withHttpAction(document, id, (a) => withOptional(a, "body", body.trim() === "" ? undefined : body));
}

/** Seconds, or none for the default 10. */
export function setHttpActionTimeout(document: HttpActionsDoc, id: string, seconds: number | undefined): HttpActionsDoc {
  if (seconds !== undefined && (!Number.isFinite(seconds) || seconds <= 0)) return document;
  return withHttpAction(document, id, (a) => withOptional(a, "timeout", seconds));
}

/** On writes `true`; off leaves the key out, as the phone writes nil. */
export function setHttpActionUntrusted(document: HttpActionsDoc, id: string, on: boolean): HttpActionsDoc {
  return withHttpAction(document, id, (a) => withOptional(a, "allowsUntrustedCertificate", on ? true : undefined));
}

// ── headers ──────────────────────────────────────────────────────────────

function rawHeaders(action: JsonObject): unknown[] {
  return rawList(action, "headers");
}

/** A new header row at the end, blank. */
export function addHttpHeader(document: HttpActionsDoc, actionId: string, headerId: string): HttpActionsDoc {
  return withHttpAction(document, actionId, (a) => withHttpKey(a, "headers", [...rawHeaders(a), { id: headerId, name: "", value: "" }]));
}

export function setHttpHeader(document: HttpActionsDoc, actionId: string, headerId: string, change: { name?: string; value?: string }): HttpActionsDoc {
  return withHttpAction(document, actionId, (a) => {
    const list = rawHeaders(a);
    const next = withListItem(list, headerId, (h) => {
      let out = h;
      if (change.name !== undefined) out = withHttpKey(out, "name", change.name);
      if (change.value !== undefined) out = withHttpKey(out, "value", change.value);
      return out;
    });
    return next === list ? a : withHttpKey(a, "headers", next);
  });
}

export function removeHttpHeader(document: HttpActionsDoc, actionId: string, headerId: string): HttpActionsDoc {
  return withHttpAction(document, actionId, (a) => {
    const list = rawHeaders(a);
    const next = list.filter((h) => !(isJsonObject(h) && h.id === headerId));
    return next.length === list.length ? a : withHttpKey(a, "headers", next);
  });
}

// ── the sign-in helper ───────────────────────────────────────────────────

export type HttpAuthKind = "none" | "bearer" | "basic" | "apiKey";

export const HTTP_AUTH_KINDS: [HttpAuthKind, string][] = [
  ["none", "None"],
  ["bearer", "Bearer token"],
  ["basic", "Username and password"],
  ["apiKey", "API key header"],
];

/** What the helper edits. Not stored: it is one ordinary header. */
export interface HttpAuth {
  kind: HttpAuthKind;
  token: string;
  username: string;
  password: string;
  headerName: string;
  apiKeyValue: string;
}

export const HTTP_API_KEY_HEADER = "X-Api-Key";

/** The phone's fixed id for the header the helper makes, so making it twice
 * gives the same bytes. */
export const HTTP_AUTH_HEADER_ID = "A07A0000-0000-0000-0000-0000000A0140";

/** Header names read back as an API key, lower case. */
const API_KEY_NAMES = new Set(["x-api-key", "api-key", "apikey", "x-api-token", "x-auth-token", "x-access-token"]);

export function httpAuthNone(kind: HttpAuthKind = "none"): HttpAuth {
  return { kind, token: "", username: "", password: "", headerName: HTTP_API_KEY_HEADER, apiKeyValue: "" };
}

function base64Utf8(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary);
}

function utf8FromBase64(payload: string): string | undefined {
  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(payload) || payload.length % 4 !== 0) return undefined;
  try {
    const binary = atob(payload);
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch {
    return undefined;
  }
}

/** The one header the setting stands for, or none: `none`, or a setting
 * missing its secret. `HTTPActionAuth.composedHeader`. */
export function composeHttpAuth(auth: HttpAuth): { name: string; value: string } | undefined {
  switch (auth.kind) {
    case "bearer": {
      const token = auth.token.trim();
      return token === "" ? undefined : { name: "Authorization", value: `Bearer ${token}` };
    }
    case "basic":
      if (auth.username === "" && auth.password === "") return undefined;
      return { name: "Authorization", value: `Basic ${base64Utf8(`${auth.username}:${auth.password}`)}` };
    case "apiKey": {
      const name = auth.headerName.trim();
      const value = auth.apiKeyValue.trim();
      return name === "" || value === "" ? undefined : { name, value };
    }
    default:
      return undefined;
  }
}

/** One header read as a sign-in setting, or none when the helper cannot show
 * it (another scheme, a Basic value that is not base64 `user:pass`). */
export function parseHttpAuthHeader(header: Pick<HttpHeader, "name" | "value">): HttpAuth | undefined {
  const name = header.name.trim();
  const value = header.value.trim();
  if (name.toLowerCase() === "authorization") {
    if (value.length > 7 && value.slice(0, 7).toLowerCase() === "bearer ") {
      return { ...httpAuthNone("bearer"), token: value.slice(7).trim() };
    }
    if (value.length > 6 && value.slice(0, 6).toLowerCase() === "basic ") {
      const decoded = utf8FromBase64(value.slice(6).trim());
      const colon = decoded?.indexOf(":") ?? -1;
      if (decoded === undefined || colon < 0) return undefined;
      return { ...httpAuthNone("basic"), username: decoded.slice(0, colon), password: decoded.slice(colon + 1) };
    }
    return undefined;
  }
  if (API_KEY_NAMES.has(name.toLowerCase())) {
    if (value === "") return undefined;
    return { ...httpAuthNone("apiKey"), headerName: name, apiKeyValue: value };
  }
  return undefined;
}

function isBasicAuthHeader(header: Pick<HttpHeader, "name" | "value">): boolean {
  return parseHttpAuthHeader(header)?.kind === "basic";
}

/** The sign-in setting the headers hold, and which header it is: the first
 * one the helper can show. `HTTPActionAuth.extract`. */
export function extractHttpAuth(headers: readonly HttpHeader[]): { auth: HttpAuth; headerId?: string } {
  for (const h of headers) {
    const auth = parseHttpAuthHeader(h);
    if (auth !== undefined) return { auth, headerId: h.id };
  }
  return { auth: httpAuthNone() };
}

/**
 * The helper's setting written into the action's headers. The header it
 * edits (`headerId`) keeps its place and id: changed when the setting still
 * makes a header, removed when it makes none. With no such header, a new one
 * goes first, with the phone's fixed id, as the phone writes it.
 */
export function setHttpAuth(document: HttpActionsDoc, actionId: string, headerId: string | undefined, auth: HttpAuth): { document: HttpActionsDoc; headerId?: string } {
  const header = composeHttpAuth(auth);
  const raw = findHttpAction(document, actionId);
  if (raw === undefined) return { document };
  const list = rawHeaders(raw);
  const at = headerId === undefined ? -1 : list.findIndex((h) => isJsonObject(h) && h.id === headerId);
  if (at >= 0) {
    if (header === undefined) return { document: removeHttpHeader(document, actionId, headerId!) };
    return { document: setHttpHeader(document, actionId, headerId!, header), headerId };
  }
  if (header === undefined) return { document };
  const taken = list.some((h) => isJsonObject(h) && h.id === HTTP_AUTH_HEADER_ID);
  const id = taken ? newHttpId() : HTTP_AUTH_HEADER_ID;
  const fresh = { id, name: header.name, value: header.value };
  return { document: withHttpAction(document, actionId, (a) => withHttpKey(a, "headers", [fresh, ...rawHeaders(a)])), headerId: id };
}

// ── variables ────────────────────────────────────────────────────────────

/** A new variable row for a key: asked as text, its prompt the key made
 * readable. Keys sorted. */
export function newHttpVariable(id: string, key: string): JsonObject {
  return { id, key, kind: "text", presetValues: [], presetsOnly: false, prompt: humanizeHttpKey(key) };
}

/**
 * The variable rows reconciled with the tokens the action asks for now
 * (`HTTPActionVariable.reconcile`): a new token gets a row; a row whose
 * token went stays (shown as unused) so a passing edit loses nothing. One
 * new token with exactly one row left without its token is a rename: that
 * row takes the new key and keeps its prompt, kind and quick values, its
 * prompt renamed too when it was the one made from the old key.
 */
export function reconcileHttpVariables(document: HttpActionsDoc, actionId: string, makeId: () => string = newHttpId): HttpActionsDoc {
  const raw = findHttpAction(document, actionId);
  if (raw === undefined) return document;
  const action = readHttpAction(raw);
  const detected = httpActionTokens(action, httpGlobalKeys(document)).asked;
  const rows = rawList(raw, "variables");
  const keyOf = (r: unknown) => readHttpVariable(r).key;
  const fresh = detected.filter((k) => !rows.some((r) => keyOf(r) === k));
  if (fresh.length === 0) return document;
  const orphans = rows.map((r, i) => [r, i] as const).filter(([r]) => !detected.includes(keyOf(r)));
  let next: unknown[];
  if (fresh.length === 1 && orphans.length === 1) {
    const [row, index] = orphans[0]!;
    const old = keyOf(row);
    let renamed = isJsonObject(row) ? withHttpKey(row, "key", fresh[0]) : newHttpVariable(makeId(), fresh[0]!);
    const prompt = readHttpVariable(row).prompt;
    if (isJsonObject(row) && (prompt === "" || prompt === humanizeHttpKey(old))) renamed = withHttpKey(renamed, "prompt", humanizeHttpKey(fresh[0]!));
    next = rows.slice();
    next[index] = renamed;
  } else {
    next = [...rows, ...fresh.map((k) => newHttpVariable(makeId(), k))];
  }
  return withHttpAction(document, actionId, (a) => withHttpKey(a, "variables", next));
}

export function setHttpVariable(
  document: HttpActionsDoc,
  actionId: string,
  variableId: string,
  change: { prompt?: string; kind?: HttpVariableKind; presetValues?: string[]; presetsOnly?: boolean },
): HttpActionsDoc {
  return withHttpAction(document, actionId, (a) => {
    const list = rawList(a, "variables");
    const next = withListItem(list, variableId, (v) => {
      let out = v;
      if (change.prompt !== undefined) out = withHttpKey(out, "prompt", change.prompt);
      if (change.kind !== undefined && (HTTP_VARIABLE_KINDS as readonly string[]).includes(change.kind)) out = withHttpKey(out, "kind", change.kind);
      if (change.presetValues !== undefined) out = withHttpKey(out, "presetValues", change.presetValues);
      if (change.presetsOnly !== undefined) out = withHttpKey(out, "presetsOnly", change.presetsOnly);
      return out;
    });
    return next === list ? a : withHttpKey(a, "variables", next);
  });
}

export function removeHttpVariable(document: HttpActionsDoc, actionId: string, variableId: string): HttpActionsDoc {
  return withHttpAction(document, actionId, (a) => {
    const list = rawList(a, "variables");
    const next = list.filter((v) => !(isJsonObject(v) && v.id === variableId));
    return next.length === list.length ? a : withHttpKey(a, "variables", next);
  });
}

/** The variable rows whose token went: kept while editing, left out when
 * the action is saved. */
export function httpUnusedVariables(action: HttpAction, globals: ReadonlySet<string>): HttpVariable[] {
  const asked = new Set(httpActionTokens(action, globals).asked);
  return action.variables.filter((v) => !asked.has(v.key));
}

/**
 * The tidy the phone does when it saves an action, done to every action
 * that differs from `base` (and only those, so an action nobody touched
 * goes back as it came): headers with no name left out, the variables cut
 * to the ones its request asks for, in token order, and their quick values
 * trimmed with empty lines out. A variable whose key names a global goes
 * too, since the global fills that token in.
 */
export function tidyHttpActionsForSave(document: HttpActionsDoc, base: HttpActionsDoc | undefined): HttpActionsDoc {
  const globals = httpGlobalKeys(document);
  const before = new Map(httpActionList(base).map((a) => [a.id, a] as const));
  let next = document;
  for (const raw of httpActionList(document)) {
    const id = str(raw.id);
    if (id === undefined) continue;
    const was = before.get(id);
    if (was !== undefined && sameWatchPagesJson(was, raw)) continue;
    next = withHttpAction(next, id, (a) => {
      let out = a;
      const headers = rawHeaders(a);
      const named = headers.filter((h) => !isJsonObject(h) || readHttpHeader(h).name.trim() !== "");
      if (named.length !== headers.length) out = withHttpKey(out, "headers", named);
      const action = readHttpAction(out);
      const rows = rawList(out, "variables");
      const kept = httpActionTokens(action, globals).asked
        .map((k) => rows.find((r) => readHttpVariable(r).key === k))
        .filter((r) => r !== undefined)
        .map((r) => {
          if (!isJsonObject(r) || !Array.isArray(r.presetValues)) return r;
          const lines = r.presetValues.map((p) => (typeof p === "string" ? p.trim() : p)).filter((p) => p !== "");
          return sameWatchPagesJson(lines, r.presetValues) && lines.length === r.presetValues.length ? r : withHttpKey(r, "presetValues", lines);
        });
      if (kept.length !== rows.length || kept.some((r, i) => r !== rows[i])) out = withHttpKey(out, "variables", kept);
      return out;
    });
  }
  return next;
}

// ── the reply value ──────────────────────────────────────────────────────

/** The extra field each source reads. */
export const HTTP_REPLY_FIELD: Readonly<Record<HttpReplySource, "jsonPath" | "headerName" | "pattern" | undefined>> = {
  statusCode: undefined,
  bodyText: undefined,
  jsonField: "jsonPath",
  header: "headerName",
  regex: "pattern",
};

/** The reply source, or none to take no value from the reply. A new source
 * keeps the unit and drops the extra field another source read, as the
 * phone writes only the one that applies. */
export function setHttpReplySource(document: HttpActionsDoc, actionId: string, source: HttpReplySource | undefined): HttpActionsDoc {
  return withHttpAction(document, actionId, (a) => {
    if (source === undefined) return withoutHttpKey(a, "responseConfig");
    if (!(HTTP_REPLY_SOURCES as readonly string[]).includes(source)) return a;
    const held = isJsonObject(a.responseConfig) ? a.responseConfig : {};
    let next = withHttpKey(held, "source", source);
    for (const key of ["jsonPath", "headerName", "pattern"]) if (HTTP_REPLY_FIELD[source] !== key) next = withoutHttpKey(next, key);
    return withHttpKey(a, "responseConfig", next);
  });
}

/** The extra field of the reply's source (path, header or pattern), or the
 * unit. Empty leaves the key out. The unit is kept as typed, a leading
 * space and all; the others are trimmed, as the phone stores them. */
export function setHttpReplyField(document: HttpActionsDoc, actionId: string, key: "jsonPath" | "headerName" | "pattern" | "unit", value: string): HttpActionsDoc {
  return withHttpAction(document, actionId, (a) => {
    if (!isJsonObject(a.responseConfig)) return a;
    const v = key === "unit" ? value : value.trim();
    return withHttpKey(a, "responseConfig", withOptional(a.responseConfig, key, v === "" ? undefined : v));
  });
}

/** A found JSON path picked from a test: the reply reads that field. */
export function useHttpReplyPath(document: HttpActionsDoc, actionId: string, path: string): HttpActionsDoc {
  return setHttpReplyField(setHttpReplySource(document, actionId, "jsonField"), actionId, "jsonPath", path);
}

/** A header of a test's answer picked: the reply reads that header. */
export function useHttpReplyHeader(document: HttpActionsDoc, actionId: string, name: string): HttpActionsDoc {
  return setHttpReplyField(setHttpReplySource(document, actionId, "header"), actionId, "headerName", name);
}

// ── globals ──────────────────────────────────────────────────────────────

/** "value", or "value_2" and on while the key is taken. */
export function freshHttpGlobalKey(document: HttpActionsDoc, base = "value"): string {
  const taken = httpGlobalKeys(document);
  if (!taken.has(base)) return base;
  for (let n = 2; ; n++) if (!taken.has(`${base}_${n}`)) return `${base}_${n}`;
}

export function addHttpGlobal(document: HttpActionsDoc, id: string, key: string): HttpActionsDoc {
  return withList(document, HTTP_GLOBALS_KEY, [...rawList(document, HTTP_GLOBALS_KEY), { id, key, value: "" }]);
}

/** The key, with what the token pattern refuses taken out. */
export function setHttpGlobalKey(document: HttpActionsDoc, id: string, key: string): HttpActionsDoc {
  return withHttpGlobal(document, id, (g) => withHttpKey(g, "key", sanitizeHttpKey(key)));
}

export function setHttpGlobalValue(document: HttpActionsDoc, id: string, value: string): HttpActionsDoc {
  return withHttpGlobal(document, id, (g) => withHttpKey(g, "value", value));
}

export function removeHttpGlobal(document: HttpActionsDoc, id: string): HttpActionsDoc {
  const list = rawList(document, HTTP_GLOBALS_KEY);
  const next = list.filter((g) => !(isJsonObject(g) && g.id === id));
  return next.length === list.length ? document : withList(document, HTTP_GLOBALS_KEY, next);
}

/** The actions whose request names a global's key, by label. */
export function httpGlobalUsers(document: HttpActionsDoc, key: string): string[] {
  if (key === "") return [];
  return httpActionList(document).map(readHttpAction).filter((a) => httpTokens(httpTokenSources(a)).includes(key)).map(httpActionLabel);
}

// ── checks ───────────────────────────────────────────────────────────────

/**
 * What Home Assistant's check refuses, in plain words, so a save that cannot
 * land is not sent: the lists, a distinct id on every action, the string
 * fields strings, a known method, body type and reply source, variable keys
 * of letters, digits and underscores, and globals with distinct names.
 */
export function checkHttpActions(document: unknown): string[] {
  if (!isJsonObject(document)) return ["The library is not an object."];
  const problems: string[] = [];
  const actions = Object.hasOwn(document, HTTP_ACTIONS_KEY) ? document[HTTP_ACTIONS_KEY] : undefined;
  const globals = Object.hasOwn(document, HTTP_GLOBALS_KEY) ? document[HTTP_GLOBALS_KEY] : undefined;
  if (!Array.isArray(actions)) problems.push("The action list is missing.");
  if (globals !== undefined && !Array.isArray(globals)) problems.push("The globals are not a list.");
  const ids = new Set<string>();
  (Array.isArray(actions) ? actions : []).forEach((raw, index) => {
    if (!isJsonObject(raw)) {
      problems.push(`Action ${index + 1} is not an object.`);
      return;
    }
    const name = typeof raw.name === "string" && raw.name.trim() !== "" ? `"${raw.name.trim()}"` : `Action ${index + 1}`;
    const id = raw.id;
    if (typeof id !== "string" || id === "") problems.push(`${name} has no id.`);
    else if (ids.has(id)) problems.push(`${name} has the id of another action.`);
    else ids.add(id);
    for (const key of ["name", "method", "url"]) {
      if (Object.hasOwn(raw, key) && typeof raw[key] !== "string") problems.push(`${name} has a ${key} that is not text.`);
    }
    for (const key of ["body", "icon", "iconColor"]) {
      if (Object.hasOwn(raw, key) && raw[key] !== null && typeof raw[key] !== "string") problems.push(`${name} has a ${key} that is not text.`);
    }
    if (typeof raw.method === "string" && !(HTTP_METHODS as readonly string[]).includes(raw.method.trim().toUpperCase())) {
      problems.push(`${name} uses ${raw.method}, which is not GET, POST, PUT, PATCH or DELETE.`);
    }
    if (Object.hasOwn(raw, "bodyContentType") && oneOf(raw.bodyContentType, HTTP_BODY_TYPES) === undefined) {
      problems.push(`${name} has a body type Home Assistant does not know.`);
    }
    if (Object.hasOwn(raw, "timeout") && raw.timeout !== null && (typeof raw.timeout !== "number" || !Number.isFinite(raw.timeout))) {
      problems.push(`${name} has a timeout that is not a number.`);
    }
    if (isJsonObject(raw.responseConfig) && oneOf(raw.responseConfig.source, HTTP_REPLY_SOURCES) === undefined) {
      problems.push(`${name} reads its reply value from a source Home Assistant does not know.`);
    }
    const headers = raw.headers;
    if (Object.hasOwn(raw, "headers") && !Array.isArray(headers)) problems.push(`${name} has headers that are not a list.`);
    for (const h of Array.isArray(headers) ? headers : []) {
      if (!isJsonObject(h) || (Object.hasOwn(h, "name") && typeof h.name !== "string") || (Object.hasOwn(h, "value") && typeof h.value !== "string")) {
        problems.push(`${name} has a header that is not text.`);
        break;
      }
    }
    const variables = raw.variables;
    if (Object.hasOwn(raw, "variables") && !Array.isArray(variables)) problems.push(`${name} has values to ask for that are not a list.`);
    for (const v of Array.isArray(variables) ? variables : []) {
      const key = isJsonObject(v) ? v.key : undefined;
      if (typeof key !== "string" || !HTTP_KEY_PATTERN.test(key)) {
        problems.push(`${name} asks for a value whose key is not letters, digits and underscores.`);
        break;
      }
    }
  });
  const keys = new Set<string>();
  (Array.isArray(globals) ? globals : []).forEach((raw, index) => {
    const key = isJsonObject(raw) && typeof raw.key === "string" ? raw.key.trim() : "";
    if (!isJsonObject(raw) || (Object.hasOwn(raw, "value") && typeof raw.value !== "string")) {
      problems.push(`Global ${index + 1} is not text.`);
      return;
    }
    if (key === "") problems.push(`Global ${index + 1} has no name.`);
    else if (!HTTP_KEY_PATTERN.test(key)) problems.push(`The global {{${key}}} has a name that is not letters, digits and underscores.`);
    else if (keys.has(key)) problems.push(`Two globals are named {{${key}}}.`);
    else keys.add(key);
  });
  return problems;
}

// ── words ────────────────────────────────────────────────────────────────

export const HTTP_ACTIONS_SHARED_TEXT = "Shared by every watch.";

export const HTTP_ACTIONS_EMPTY_TITLE = "No HTTP actions yet.";

export const HTTP_ACTIONS_ADD_BUTTON = "Add an action";

export const HTTP_ACTIONS_PHONE_TEXT =
  "Turning on Edit pages in Home Assistant in the iPhone app brings the phone's actions here.";

export const HTTP_ACTIONS_UPDATE_TEXT = "Update the integration to edit HTTP actions here.";

export const HTTP_ACTIONS_CLIENT_CERT_TEXT = "Home Assistant does not send a client certificate.";

export const HTTP_TOKEN_HELP =
  "Type {{key}} in the URL, a header or the body. A key that names a global is filled in from Globals. Any other key is asked for on the watch when the action runs. Keys are letters, digits and underscores.";

/** Whether a failed read means this integration keeps no HTTP action
 * library: one older than it does not know the command. */
export function httpActionsReadMeansUnsupported(error: unknown): boolean {
  return watchCommandError(error).code === "unknown_command";
}
