// The HTTP actions screen's views, drawn from a host and laid out like a
// desktop HTTP client: on the left the collection (every action with its
// method tag, then one Globals row); in the main pane the picked action's
// title row, its request bar (method, URL, Send), a tab strip over one tab
// body (Headers, Auth, Body, Prompts, Reply value, Settings) and the
// response under it; or, with Globals picked, one table of every global.
// `<wa-http-actions-editor>` owns the draft and hands a host in on every
// draw; nothing here keeps state of its own beyond `uiState`, which lives in
// memory with the element (the open tab, the shown secrets, the tests).
//
// Header values and global values are secrets: each is a password box with
// its own Show and Hide, and none is written anywhere but the draft.
//
// Every edit is a setter of `model.ts` applied to the document as it is at
// the moment the edit commits (`host.edit`), never to the one drawn. An
// edit to anything a `{{key}}` can sit in also reconciles the values asked
// for, as the phone's editor does while typing.
//
// Plan: app repo docs/pages_in_home_assistant_step4.md ("4d batch 4 build
// contract", rules 10 and 11).

import { css, html, nothing, type TemplateResult } from "lit";
import { colorField, numberField, segField, selectField, symbolField, textField } from "../editors.js";
import type { HassLike, HttpActionTestReply } from "../ha-api.js";
import type { IconProvider } from "../renderer.js";
import type { SymbolBrowser } from "../symbols.js";
import { uiIcon } from "../ui-icons.js";
import { colorBody, formatJsonBody, piecesText, prettyJson, sizeText } from "./pretty.js";
import { type JsonObject } from "../watch-pages/model.js";
import {
  HTTP_AUTH_KINDS,
  HTTP_DEFAULT_TIMEOUT,
  HTTP_METHODS,
  HTTP_REPLY_FIELD,
  HTTP_TIMEOUT_MAX,
  HTTP_TIMEOUT_MIN,
  HTTP_TOKEN_HELP,
  HTTP_ACTIONS_CLIENT_CERT_TEXT,
  HTTP_ACTIONS_EMPTY_TITLE,
  HTTP_ACTIONS_ADD_BUTTON,
  type HttpAction,
  type HttpActionsDoc,
  type HttpAuth,
  type HttpAuthKind,
  type HttpBodyType,
  type HttpReplySource,
  type HttpVariable,
  addHttpAction,
  addHttpGlobal,
  addHttpHeader,
  duplicateHttpAction,
  extractHttpAuth,
  findHttpAction,
  freshHttpActionName,
  freshHttpGlobalKey,
  httpActionLabel,
  httpActionList,
  httpActionTokens,
  httpAuthNone,
  httpGlobalKeys,
  httpGlobalList,
  httpGlobalUsers,
  httpMethodOf,
  httpNeedsAudio,
  httpNeedsSetup,
  httpPromptVariables,
  httpQuickValues,
  httpSendsBody,
  httpUnusedVariables,
  moveHttpAction,
  newHttpAction,
  parseHttpAuthHeader,
  readHttpAction,
  readHttpGlobal,
  reconcileHttpVariables,
  removeHttpAction,
  removeHttpGlobal,
  removeHttpHeader,
  removeHttpVariable,
  setHttpActionBody,
  setHttpActionBodyType,
  setHttpActionColor,
  setHttpActionIcon,
  setHttpActionMethod,
  setHttpActionName,
  setHttpActionTimeout,
  setHttpActionUntrusted,
  setHttpActionUrl,
  setHttpAuth,
  setHttpGlobalKey,
  setHttpGlobalValue,
  setHttpHeader,
  setHttpReplyField,
  setHttpReplySource,
  setHttpVariable,
  useHttpReplyHeader,
  useHttpReplyPath,
} from "./model.js";

/** What the views are handed on every draw. `document` and `busy` are read
 * live. */
export interface HttpActionsViewHost {
  readonly hass: HassLike;
  readonly icons: IconProvider;
  readonly symbols: SymbolBrowser;
  readonly document: HttpActionsDoc;
  /** A save is out: every field is drawn off and every edit refused. */
  readonly busy: boolean;
  readonly uiState: Map<string, unknown>;
  /** Apply `change` to the document as it is now: one undo step, or with
   * `coalesce` a step the next edits with the same key replace. */
  edit(change: (document: HttpActionsDoc) => HttpActionsDoc, coalesce?: string): boolean;
  endCoalesce(): void;
  requestUpdate(): void;
  /** Send one action from Home Assistant, as drafted, with the draft's
   * globals. */
  test(action: JsonObject, globals: unknown[], values: Record<string, string>): Promise<HttpActionTestReply>;
  newId(): string;
}

type Picker = Pick<HttpActionsViewHost, "uiState" | "requestUpdate">;
type ViewState = Pick<HttpActionsViewHost, "uiState" | "document">;

const SELECTED_KEY = "ha:sel";
const TAB_KEY = "ha:tab";
const REPLY_TAB_KEY = "ha:rtab";
const BODY_MODE_KEY = "ha:bmode";
const BODY_WRAP_KEY = "ha:bwrap";
const BODY_COPIED_KEY = "ha:bcopied";
const SEND_WRAP_KEY = "ha:qwrap";
const SEND_COPIED_KEY = "ha:qcopied";
const SHOW_PREFIX = "ha:show:";
const AUTH_PREFIX = "ha:auth:";
const TEST_PREFIX = "ha:test:";
/** The action whose icon and color popover is open, if any. */
export const HTTP_LOOK_KEY = "ha:look";

/** The default glyph and tint of an action with none set, as the phone draws
 * an HTTP action tile. */
const DEFAULT_ICON = "network";
const DEFAULT_TINT = "#CCD8E6";

// ── words ────────────────────────────────────────────────────────────────

export const HTTP_ACTIONS_CARD_LINE =
  "Web requests Home Assistant sends when a watch runs one, from a tile, a menu, a complication or a control. A save reaches every watch the next time it checks.";

export const HTTP_GLOBALS_CARD_LINE =
  "Fixed values any action can use as {{key}}, such as a server address or a token. Change one here and every action that uses it follows.";

export const HTTP_AUDIO_TEXT =
  "The watch records a voice clip of up to 30 seconds when the action runs and sends it as the body, as audio/mp4. Nothing to type here.";

export const HTTP_NO_BODY_TEXT = "This method sends no body. Pick POST, PUT, PATCH or DELETE to send one.";

export const HTTP_TIMEOUT_TEXT = `Empty means ${HTTP_DEFAULT_TIMEOUT} seconds. Home Assistant holds it between ${HTTP_TIMEOUT_MIN} and ${HTTP_TIMEOUT_MAX}.`;

export const HTTP_SELF_SIGNED_TEXT = "Only for a server you run whose HTTPS certificate is not publicly trusted.";

export const HTTP_NO_URL_TEXT = "With no URL the watch shows the action as needing setup.";

/** The response pane before a send. */
export const HTTP_TEST_LINE = "Press Send to try this action. Home Assistant sends it. Nothing is saved.";

/** The one line over the values asked for. The whole rule is its title. */
export const HTTP_PROMPTS_LINE = "For a value you choose on the watch each time, such as a brightness or a message. Type {{name}} in the URL, a header or the body, and the watch asks for it when you tap the action.";
export const HTTP_PROMPTS_NONE = "This action asks for nothing. It runs as soon as you tap it.";
export const HTTP_PROMPTS_GLOBALS = "filled in from Globals, so the watch does not ask";

const BODY_TYPES: [HttpBodyType, string][] = [
  ["none", "None"],
  ["json", "JSON"],
  ["form", "Form"],
  ["text", "Text"],
  ["audio", "Voice clip"],
];

const CONTENT_TYPE: Readonly<Record<HttpBodyType, string | undefined>> = {
  none: undefined,
  json: "application/json",
  form: "application/x-www-form-urlencoded",
  text: "text/plain",
  audio: "audio/mp4",
};

const BODY_PLACEHOLDER: Readonly<Record<HttpBodyType, string>> = {
  none: "Request body",
  json: `{"key": "value"}`,
  form: "key=value&other=123",
  text: "Plain text",
  audio: "",
};

const REPLY_SOURCES: [HttpReplySource | "none", string][] = [
  ["none", "None"],
  ["statusCode", "Status code"],
  ["bodyText", "Body text"],
  ["jsonField", "JSON field"],
  ["header", "Header"],
  ["regex", "Regex"],
];

function plural(n: number, one: string, many: string): string {
  return `${n} ${n === 1 ? one : many}`;
}

/** An action's line under its name: its method and where it goes. */
export function httpActionSubtitle(action: HttpAction): string {
  if (httpNeedsSetup(action)) return `${httpMethodOf(action)} · no URL yet`;
  const url = action.url.trim().replace(/^https?:\/\//i, "");
  return `${httpMethodOf(action)} · ${url}`;
}

/** The tag a method wears in the list and on the request bar: a short word
 * of fixed width, its colour named by `tone`. */
export function httpMethodTag(method: string): { text: string; tone: string } {
  const m = method.trim().toUpperCase();
  switch (m) {
    case "GET": return { text: "GET", tone: "get" };
    case "POST": return { text: "POST", tone: "post" };
    case "PUT": return { text: "PUT", tone: "put" };
    case "PATCH": return { text: "PATCH", tone: "patch" };
    case "DELETE": return { text: "DEL", tone: "del" };
    default: return { text: m === "" ? "?" : m.slice(0, 5), tone: "other" };
  }
}

function methodTag(method: string): TemplateResult {
  const tag = httpMethodTag(method);
  return html`<span class="ha-mtag m-${tag.tone}" title=${method.trim().toUpperCase()}>${tag.text}</span>`;
}

// ── selection ────────────────────────────────────────────────────────────

export type HttpSelection = { kind: "action"; id: string } | { kind: "globals" };

/** What is picked: an action still in the library, or the Globals table,
 * else the first action, else nothing. */
export function httpSelection(host: ViewState): HttpSelection | undefined {
  const picked = host.uiState.get(SELECTED_KEY) as HttpSelection | undefined;
  if (picked?.kind === "action" && findHttpAction(host.document, picked.id) !== undefined) return picked;
  if (picked?.kind === "globals") return picked;
  const first = httpActionList(host.document)[0];
  return typeof first?.id === "string" ? { kind: "action", id: first.id } : undefined;
}

export function selectHttp(host: Picker, selection: HttpSelection | undefined): void {
  if (selection === undefined) host.uiState.delete(SELECTED_KEY);
  else host.uiState.set(SELECTED_KEY, selection);
  host.uiState.delete(HTTP_LOOK_KEY);
  host.requestUpdate();
}

// ── tabs ─────────────────────────────────────────────────────────────────

export type HttpTab = "headers" | "auth" | "body" | "prompts" | "reply" | "settings";
export const HTTP_TABS: readonly HttpTab[] = ["headers", "auth", "body", "prompts", "reply", "settings"];

export type HttpReplyTab = "body" | "headers" | "paths";
const REPLY_TABS: readonly HttpReplyTab[] = ["body", "headers", "paths"];

/** The request tab open, for this visit; Headers until another is picked. */
export function httpTab(host: Pick<HttpActionsViewHost, "uiState">): HttpTab {
  const held = host.uiState.get(TAB_KEY);
  return HTTP_TABS.includes(held as HttpTab) ? (held as HttpTab) : "headers";
}

export function setHttpTab(host: Picker, tab: HttpTab): void {
  host.uiState.set(TAB_KEY, tab);
  host.requestUpdate();
}

export function httpReplyTab(host: Pick<HttpActionsViewHost, "uiState">): HttpReplyTab {
  const held = host.uiState.get(REPLY_TAB_KEY);
  return REPLY_TABS.includes(held as HttpReplyTab) ? (held as HttpReplyTab) : "body";
}

export function setHttpReplyTab(host: Picker, tab: HttpReplyTab): void {
  host.uiState.set(REPLY_TAB_KEY, tab);
  host.requestUpdate();
}

export type HttpBodyMode = "pretty" | "raw";

/** How the answer's body is drawn: formatted (the default) or as sent. */
export function httpBodyMode(host: Pick<HttpActionsViewHost, "uiState">): HttpBodyMode {
  return host.uiState.get(BODY_MODE_KEY) === "raw" ? "raw" : "pretty";
}

/** Whether long lines of the body wrap (the default) or scroll sideways. */
export function httpBodyWrap(host: Pick<HttpActionsViewHost, "uiState">): boolean {
  return host.uiState.get(BODY_WRAP_KEY) !== false;
}

/** The body of a test answer as the Body tab shows it: the text, its JSON
 * pieces when it is JSON and Pretty is on, and what Copy copies. An older
 * integration sends no body, so the short line the watch sees stands in. */
export function httpBodyShown(host: Pick<HttpActionsViewHost, "uiState">, reply: HttpActionTestReply) {
  const raw = reply.body ?? reply.snippet;
  const pieces = prettyJson(raw);
  const pretty = pieces !== undefined && httpBodyMode(host) === "pretty";
  return { raw, isJson: pieces !== undefined, pieces: pretty ? pieces : undefined, text: pretty ? piecesText(pieces) : raw };
}

/** A strip of tabs: real buttons, the arrow keys move along it, and only the
 * open one is in the page's tab order, as a tab list is. */
function tabStrip<T extends string>(label: string, idBase: string, tabs: { id: T; label: string; extra?: TemplateResult | typeof nothing }[], open: T, pick: (tab: T) => void, cls: string): TemplateResult {
  return html`<div class="ha-tabs ${cls}" role="tablist" aria-label=${label}
    @keydown=${(e: KeyboardEvent) => {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft" && e.key !== "Home" && e.key !== "End") return;
      const at = tabs.findIndex((t) => t.id === open);
      const next = e.key === "Home" ? 0 : e.key === "End" ? tabs.length - 1 : (at + (e.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
      e.preventDefault();
      pick(tabs[next]!.id);
      const strip = e.currentTarget as HTMLElement;
      (strip.querySelectorAll<HTMLElement>("[role=tab]")[next])?.focus();
    }}>
    ${tabs.map((t) => html`<button type="button" role="tab" class="ha-tab ${t.id === open ? "on" : ""}" id=${`${idBase}-${t.id}`}
      aria-selected=${t.id === open ? "true" : "false"} aria-controls=${`${idBase}-panel`} tabindex=${t.id === open ? "0" : "-1"}
      @click=${() => pick(t.id)}>${t.label}${t.extra ?? nothing}</button>`)}
  </div>`;
}

const tabCount = (n: number) => (n === 0 ? nothing : html`<span class="ha-tab-n">${n}</span>`);
const tabDot = (on: boolean) => (on ? html`<i class="ha-tab-dot" aria-label="set"></i>` : nothing);

// ── editing helpers ──────────────────────────────────────────────────────

/** An edit to one action's request: the values asked for are reconciled
 * with its tokens in the same step. */
function editRequest(host: HttpActionsViewHost, id: string, change: (d: HttpActionsDoc) => HttpActionsDoc, coalesce?: string): boolean {
  return host.edit((d) => reconcileHttpVariables(change(d), id, () => host.newId()), coalesce);
}

/** Add an action and pick it. */
export function addHttpActionTo(host: HttpActionsViewHost): string {
  const id = host.newId();
  host.edit((d) => addHttpAction(d, newHttpAction(id, freshHttpActionName(d))));
  selectHttp(host, { kind: "action", id });
  return id;
}

/** Add a global and show the Globals table it lands in. */
export function addHttpGlobalTo(host: HttpActionsViewHost): string {
  const id = host.newId();
  host.edit((d) => addHttpGlobal(d, id, freshHttpGlobalKey(d)));
  selectHttp(host, { kind: "globals" });
  return id;
}

function duplicateAction(host: HttpActionsViewHost, id: string): void {
  let made: string | undefined;
  host.edit((d) => {
    const out = duplicateHttpAction(d, id, () => host.newId());
    made = out.id;
    return out.document;
  });
  if (made !== undefined) selectHttp(host, { kind: "action", id: made });
}

/** Close the icon and color popover. Whether one was open. */
export function closeHttpLook(host: Picker): boolean {
  if (!host.uiState.has(HTTP_LOOK_KEY)) return false;
  host.uiState.delete(HTTP_LOOK_KEY);
  host.requestUpdate();
  return true;
}

// ── secrets ──────────────────────────────────────────────────────────────

export function secretShown(host: Pick<HttpActionsViewHost, "uiState">, key: string): boolean {
  return host.uiState.get(SHOW_PREFIX + key) === true;
}

function toggleSecret(host: Picker, key: string): void {
  if (secretShown(host, key)) host.uiState.delete(SHOW_PREFIX + key);
  else host.uiState.set(SHOW_PREFIX + key, true);
  host.requestUpdate();
}

/** A box for a secret: dotted until its Show is pressed. The value lives in
 * the draft only. */
function secretBox(host: HttpActionsViewHost, label: string, value: string, set: (v: string) => void, key: string, placeholder = ""): TemplateResult {
  const shown = secretShown(host, key);
  return html`<span class="ha-secret">
    <input type=${shown ? "text" : "password"} class="mono" .value=${value} placeholder=${placeholder} aria-label=${label}
      autocomplete="off" spellcheck="false" data-secret=${key}
      @input=${(e: Event) => set((e.target as HTMLInputElement).value)} />
    <button type="button" class="ha-show" aria-pressed=${shown ? "true" : "false"} aria-label=${`${shown ? "Hide" : "Show"} ${label}`}
      @click=${() => toggleSecret(host, key)}>${shown ? "Hide" : "Show"}</button>
  </span>`;
}

function secretField(host: HttpActionsViewHost, label: string, value: string, set: (v: string) => void, key: string, placeholder = ""): TemplateResult {
  return html`<div class="field ha-secret-field"><span>${label}</span>${secretBox(host, label, value, set, key, placeholder)}</div>`;
}

/** A switch with its words beside it rather than in the title column, so a
 * long title stays on one line. */
function switchRow(label: string, value: boolean, set: (v: boolean) => void, opts: { disabled?: boolean } = {}): TemplateResult {
  return html`<label class="ha-switch"><input type="checkbox" .checked=${value} ?disabled=${opts.disabled === true}
    @change=${(e: Event) => set((e.target as HTMLInputElement).checked)} /><span>${label}</span></label>`;
}

// ── the sign-in helper ───────────────────────────────────────────────────

interface AuthHeld {
  kind: HttpAuthKind;
  headerId?: string;
  /** What was typed while the setting makes no header yet (a token not
   * given, a header name cleared), so it is not lost on the next draw. */
  auth: HttpAuth;
}

/** What the helper shows for an action, and which header it edits. Once the
 * helper has been used it keeps to its header by id, so a name typed for
 * an API key that the reader would not know stays in the helper. Before
 * that it is the first header the reader understands. */
export function httpAuthOf(host: Pick<HttpActionsViewHost, "uiState">, action: HttpAction): { auth: HttpAuth; headerId?: string } {
  const held = host.uiState.get(AUTH_PREFIX + action.id) as AuthHeld | undefined;
  if (held !== undefined) {
    const header = held.headerId === undefined ? undefined : action.headers.find((h) => h.id === held.headerId);
    if (header === undefined) return { auth: held.auth.kind === held.kind ? held.auth : httpAuthNone(held.kind) };
    if (held.kind === "apiKey") return { auth: { ...httpAuthNone("apiKey"), headerName: header.name, apiKeyValue: header.value }, headerId: header.id };
    const parsed = parseHttpAuthHeader(header);
    if (parsed !== undefined && parsed.kind === held.kind) return { auth: parsed, headerId: header.id };
    return { auth: httpAuthNone(held.kind), headerId: header.id };
  }
  return extractHttpAuth(action.headers);
}

/** Write the helper's setting: one header, edited in place. */
export function setHttpAuthOf(host: HttpActionsViewHost, action: HttpAction, auth: HttpAuth, coalesce?: string): void {
  const { headerId } = httpAuthOf(host, action);
  let next: string | undefined = headerId;
  editRequest(host, action.id, (d) => {
    const out = setHttpAuth(d, action.id, headerId, auth);
    next = out.headerId;
    return out.document;
  }, coalesce);
  host.uiState.set(AUTH_PREFIX + action.id, { kind: auth.kind, auth, ...(next === undefined ? {} : { headerId: next }) } satisfies AuthHeld);
  host.requestUpdate();
}

function renderAuthTab(host: HttpActionsViewHost, action: HttpAction): TemplateResult {
  const { auth } = httpAuthOf(host, action);
  const set = (change: Partial<HttpAuth>, coalesce?: string) => setHttpAuthOf(host, action, { ...auth, ...change }, coalesce);
  const key = (part: string) => `auth:${action.id}:${part}`;
  let fields: TemplateResult | typeof nothing = nothing;
  if (auth.kind === "bearer") {
    fields = secretField(host, "Token", auth.token, (v) => set({ token: v }, key("token")), key("token"), "Paste the token");
  } else if (auth.kind === "basic") {
    fields = html`${textField("Username", auth.username, (v) => set({ username: v }, key("user")))}
      ${secretField(host, "Password", auth.password, (v) => set({ password: v }, key("password")), key("password"))}`;
  } else if (auth.kind === "apiKey") {
    fields = html`${textField("Header", auth.headerName, (v) => set({ headerName: v }, key("name")), { mono: true, placeholder: "X-Api-Key" })}
      ${secretField(host, "Key", auth.apiKeyValue, (v) => set({ apiKeyValue: v }, key("key")), key("key"), "Paste the key")}`;
  }
  const hint = auth.kind === "none"
    ? "Add sign-in if the server asks for it. It is written as one header."
    : auth.kind === "basic"
      ? "Sent as an Authorization header, the username and password encoded together."
      : auth.kind === "bearer" ? "Sent as Authorization: Bearer and the token." : "Sent as a header with the key as its value.";
  return html`<p class="ha-line">${hint}</p>
    <div class="ha-form">
      ${selectField("Type", auth.kind, HTTP_AUTH_KINDS, (v) => set({ kind: v }), { snapBack: true })}
      ${fields}
    </div>`;
}

// ── the collection ───────────────────────────────────────────────────────

function glyph(host: Pick<HttpActionsViewHost, "icons">, icon: string, size: number, color: string): TemplateResult {
  return host.icons.render(icon, size, color) ?? html`<span class="ha-glyph-dot" style=${`background:${color}`}></span>`;
}

function rowKeys(pick: () => void) {
  return (e: KeyboardEvent) => {
    if (e.target !== e.currentTarget || (e.key !== "Enter" && e.key !== " ")) return;
    e.preventDefault();
    pick();
  };
}

function actionRow(host: HttpActionsViewHost, action: HttpAction, index: number, count: number, selected: boolean): TemplateResult {
  const name = httpActionLabel(action);
  const pick = () => selectHttp(host, { kind: "action", id: action.id });
  const setup = httpNeedsSetup(action);
  return html`<div class="ha-item ${selected ? "on" : ""}" role="listitem" tabindex="0" data-action=${action.id}
    aria-current=${selected ? "true" : "false"} aria-label=${name} title=${`${name} · ${httpActionSubtitle(action)}`}
    @click=${(e: Event) => { if (!(e.target instanceof Element && e.target.closest("button"))) pick(); }}
    @keydown=${rowKeys(pick)}>
    ${methodTag(httpMethodOf(action))}
    <span class="ha-item-name">${name}</span>
    ${setup ? html`<span class="ha-need-mark" title=${HTTP_NO_URL_TEXT}>needs setup</span>` : nothing}
    ${httpNeedsAudio(action) ? html`<span class="ha-mark">voice</span>` : nothing}
    <span class="ha-item-acts">
      <button type="button" class="icon" ?disabled=${host.busy || index === 0} title="Move up" aria-label=${`Move ${name} up`}
        @click=${() => host.edit((d) => moveHttpAction(d, action.id, index - 1))}>${uiIcon("up")}</button>
      <button type="button" class="icon" ?disabled=${host.busy || index === count - 1} title="Move down" aria-label=${`Move ${name} down`}
        @click=${() => host.edit((d) => moveHttpAction(d, action.id, index + 1))}>${uiIcon("down")}</button>
    </span>
  </div>`;
}

/** The left pane: every action in the stored order, + Add, and under them
 * one Globals row that opens the globals table. */
export function renderHttpList(host: HttpActionsViewHost): TemplateResult {
  const actions = httpActionList(host.document).map(readHttpAction);
  const globals = httpGlobalList(host.document).length;
  const selection = httpSelection(host);
  const onGlobals = selection?.kind === "globals";
  const pickGlobals = () => selectHttp(host, { kind: "globals" });
  return html`<section class="card lc ha-list-card" aria-label="Actions" style="--c: var(--wa-lc-layers, #4a7fe8)">
    <div class="lc-head">
      <span class="swatch">${uiIcon("globe")}</span><span class="lc-title">Actions</span>
      <span class="lc-sub" title=${HTTP_ACTIONS_CARD_LINE}>${actions.length}</span>
      <span class="spacer"></span>
      <button type="button" class="lc-btn pri ha-add" aria-label="Add an action" ?disabled=${host.busy}
        title="A new action" @click=${() => addHttpActionTo(host)}>${uiIcon("plus")}<span>Add</span></button>
    </div>
    ${actions.length === 0
      ? html`<div class="lc-note ha-list-note">No actions yet. Add one to send a request from the watch.</div>`
      : html`<div class="ha-items" role="list">${actions.map((a, i) => actionRow(host, a, i, actions.length, selection?.kind === "action" && selection.id === a.id))}</div>`}
    <div class="ha-list-foot">
      <div class="ha-item ha-globals-item ${onGlobals ? "on" : ""}" role="button" tabindex="0" aria-pressed=${onGlobals ? "true" : "false"}
        title=${HTTP_GLOBALS_CARD_LINE} @click=${pickGlobals} @keydown=${rowKeys(pickGlobals)}>
        <span class="ha-mtag ha-gtag" aria-hidden="true">{ }</span>
        <span class="ha-item-name">Globals</span>
        <span class="ha-count">${globals}</span>
      </div>
    </div>
  </section>`;
}

// ── the main pane: an action ─────────────────────────────────────────────

function urlWarning(url: string): string | undefined {
  const t = url.trim();
  if (t === "" || t.startsWith("{")) return undefined;
  const lower = t.toLowerCase();
  return lower.startsWith("http://") || lower.startsWith("https://") ? undefined : "Add http:// or https://. Without one the request will not send.";
}

function lookPopover(host: HttpActionsViewHost, action: HttpAction): TemplateResult {
  const id = action.id;
  return html`<div class="ha-look-pop" role="dialog" aria-label="Icon and color">
    <fieldset class="ha-set" ?disabled=${host.busy}>
      <div class="ha-stack">${symbolField({ icons: host.icons, symbols: host.symbols }, action.icon ?? DEFAULT_ICON,
        (v) => host.edit((d) => setHttpActionIcon(d, id, v === DEFAULT_ICON ? "" : v), `a:${id}:icon`), `ha:icon:${id}`, undefined, "Icon", false)}</div>
      ${colorField("Color", action.iconColor, (v) => host.edit((d) => setHttpActionColor(d, id, v), `a:${id}:color`), true, null)}
    </fieldset>
    <div class="ha-pop-foot"><span class="ha-line">The icon and color the action wears on the watch.</span>
      <button type="button" class="pe-btn ha-sm" @click=${() => closeHttpLook(host)}>Done</button></div>
  </div>`;
}

function titleRow(host: HttpActionsViewHost, action: HttpAction): TemplateResult {
  const id = action.id;
  const color = action.iconColor ?? DEFAULT_TINT;
  const lookOpen = host.uiState.get(HTTP_LOOK_KEY) === id;
  return html`<div class="ha-titlerow">
    <span class="ha-look">
      <button type="button" class="ha-look-btn" style=${`--c:${color}`} aria-haspopup="dialog" aria-expanded=${lookOpen ? "true" : "false"}
        title="Icon and color" aria-label="Icon and color"
        @click=${() => { if (lookOpen) host.uiState.delete(HTTP_LOOK_KEY); else host.uiState.set(HTTP_LOOK_KEY, id); host.requestUpdate(); }}>
        <span class="ha-look-glyph">${glyph(host, action.icon ?? DEFAULT_ICON, 16, color)}</span>
      </button>
      ${lookOpen ? lookPopover(host, action) : nothing}
    </span>
    <input type="text" class="ha-name" .value=${action.name} placeholder="My action" aria-label="Name" ?disabled=${host.busy}
      @input=${(e: Event) => host.edit((d) => setHttpActionName(d, id, (e.target as HTMLInputElement).value), `a:${id}:name`)} />
    <span class="ha-title-acts">
      <button type="button" class="pe-btn ha-sm" ?disabled=${host.busy} title="A copy with new ids, named Copy"
        @click=${() => duplicateAction(host, id)}>${uiIcon("duplicate")}<span>Duplicate</span></button>
      <button type="button" class="pe-btn ha-sm pe-danger" ?disabled=${host.busy}
        title="Remove this action. Tiles and menu items that run it stop working."
        @click=${() => host.edit((d) => removeHttpAction(d, id))}>${uiIcon("delete")}<span>Remove</span></button>
    </span>
  </div>`;
}

function requestBar(host: HttpActionsViewHost, action: HttpAction): TemplateResult {
  const id = action.id;
  const state = httpTestState(host, id);
  const setup = httpNeedsSetup(action);
  const method = httpMethodOf(action);
  const tag = httpMethodTag(method);
  const known = (HTTP_METHODS as readonly string[]).includes(method);
  const warning = urlWarning(action.url);
  return html`<div class="ha-reqbar">
      <div class="ha-reqbox">
        <select class="ha-method m-${tag.tone}" aria-label="Method" ?disabled=${host.busy} .value=${method}
          @change=${(e: Event) => { editRequest(host, id, (d) => setHttpActionMethod(d, id, (e.target as HTMLSelectElement).value)); host.requestUpdate(); }}>
          ${known ? nothing : html`<option value=${method} selected>${method}</option>`}
          ${HTTP_METHODS.map((m) => html`<option value=${m} ?selected=${m === method}>${m}</option>`)}
        </select>
        <input type="text" class="ha-url mono" .value=${action.url} placeholder="https://example.com/api" aria-label="URL"
          spellcheck="false" autocomplete="off" ?disabled=${host.busy}
          @input=${(e: Event) => editRequest(host, id, (d) => setHttpActionUrl(d, id, (e.target as HTMLInputElement).value), `a:${id}:url`)}
          @keydown=${(e: KeyboardEvent) => {
            if (e.key !== "Enter" || e.isComposing) return;
            e.preventDefault();
            void runHttpTest(host, id);
          }} />
      </div>
      <button type="button" class="pe-btn pe-primary ha-send ${state.running ? "busy" : ""}" ?disabled=${state.running || setup}
        aria-busy=${state.running ? "true" : "false"} title=${setup ? "Add a URL first" : "Send it now (Enter in the URL)"}
        @click=${() => void runHttpTest(host, id)}>${state.running ? "Sending…" : "Send"}</button>
    </div>
    ${warning === undefined && !setup ? nothing : html`<div class="ha-barnote">
      ${warning === undefined ? nothing : html`<p class="ha-warn">${warning}</p>`}
      ${setup ? html`<p class="ha-warn">${HTTP_NO_URL_TEXT}</p>` : nothing}
    </div>`}`;
}

function renderHeadersTab(host: HttpActionsViewHost, action: HttpAction, authHeaderId: string | undefined): TemplateResult {
  const id = action.id;
  const authHeader = authHeaderId === undefined ? undefined : action.headers.find((h) => h.id === authHeaderId);
  const rows = action.headers.filter((h) => h.id !== authHeaderId);
  return html`<div class="ha-table ha-htable" role="table" aria-label="Headers">
    <div class="ha-tr ha-th" role="row"><span role="columnheader">Key</span><span role="columnheader">Value</span><span></span></div>
    ${authHeader === undefined ? nothing : html`<div class="ha-tr ha-auth-row" role="row">
      <span class="ha-td ha-ro mono" role="cell">${authHeader.name}</span>
      <span class="ha-td ha-ro" role="cell"><span class="ha-dots" aria-label="Hidden">••••••••</span></span>
      <span class="ha-td ha-end" role="cell"><button type="button" class="ha-from-auth" title="Written by the Auth tab. Edit it there."
        @click=${() => setHttpTab(host, "auth")}>Auth</button></span>
    </div>`}
    ${rows.map((h) => html`<div class="ha-tr" role="row">
      <span class="ha-td" role="cell"><input type="text" class="mono" .value=${h.name} placeholder="Name" aria-label="Header name" spellcheck="false"
        @input=${(e: Event) => editRequest(host, id, (d) => setHttpHeader(d, id, h.id, { name: (e.target as HTMLInputElement).value }), `h:${h.id}:name`)} /></span>
      <span class="ha-td" role="cell">${secretBox(host, `${h.name.trim() || "Header"} value`, h.value,
        (v) => editRequest(host, id, (d) => setHttpHeader(d, id, h.id, { value: v }), `h:${h.id}:value`), `header:${h.id}`, "Value")}</span>
      <span class="ha-td ha-end" role="cell"><button type="button" class="icon ha-remove" title="Remove this header" aria-label=${`Remove ${h.name.trim() || "header"}`}
        @click=${() => editRequest(host, id, (d) => removeHttpHeader(d, id, h.id))}>${uiIcon("delete")}</button></span>
    </div>`)}
    <div class="ha-tr ha-addrow" role="row"><button type="button" class="ha-add-row" @click=${() => editRequest(host, id, (d) => addHttpHeader(d, id, host.newId()))}>${uiIcon("plus")}<span>Add header</span></button></div>
  </div>
  <p class="ha-line">Header values stay hidden until shown.</p>`;
}

function renderBodyTab(host: HttpActionsViewHost, action: HttpAction): TemplateResult {
  if (!httpSendsBody(action)) return html`<p class="ha-line">${HTTP_NO_BODY_TEXT}</p>`;
  const type = action.bodyContentType;
  const contentType = CONTENT_TYPE[type];
  return html`<div class="ha-body-head">
      <label class="ha-inline"><span>Type</span>
        <select .value=${type} @change=${(e: Event) => { editRequest(host, action.id, (d) => setHttpActionBodyType(d, action.id, (e.target as HTMLSelectElement).value as HttpBodyType)); host.requestUpdate(); }}>
          ${BODY_TYPES.map(([v, text]) => html`<option value=${v} ?selected=${v === type}>${text}</option>`)}
        </select></label>
      ${contentType === undefined ? nothing : html`<span class="ha-line">Sends Content-Type: ${contentType}, unless a header sets one.</span>`}
    </div>
    ${type === "audio" ? html`<p class="ha-line ha-audio">${HTTP_AUDIO_TEXT}</p>` : renderSendBody(host, action, type)}`;
}

/** The body to send: a text box with its text colored behind it (JSON
 * tokens for a JSON body, every {{key}} for any), and Format, Wrap, Copy. */
function renderSendBody(host: HttpActionsViewHost, action: HttpAction, type: HttpBodyType): TemplateResult {
  const text = action.body ?? "";
  const json = type === "json";
  const formatted = json ? formatJsonBody(text) : undefined;
  const wrap = host.uiState.get(SEND_WRAP_KEY) !== false;
  const copied = host.uiState.get(SEND_COPIED_KEY) === true;
  const set = (key: string, value: unknown) => {
    host.uiState.set(key, value);
    host.requestUpdate();
  };
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      set(SEND_COPIED_KEY, true);
      setTimeout(() => set(SEND_COPIED_KEY, false), 1500);
    } catch {
      /* No clipboard here: the text can still be selected. */
    }
  };
  const bad = json && text.trim() !== "" && formatted === undefined;
  return html`<div class="ha-bbar ha-qbar" role="toolbar" aria-label="Body options">
      ${json ? html`<button type="button" class="ha-bopt" title=${bad ? "The body is not JSON" : "Indent the JSON"}
        ?disabled=${host.busy || formatted === undefined || formatted === text}
        @click=${() => { if (formatted !== undefined) editRequest(host, action.id, (d) => setHttpActionBody(d, action.id, formatted)); }}>Format</button>` : nothing}
      <button type="button" class="ha-bopt ${wrap ? "on" : ""}" aria-pressed=${wrap ? "true" : "false"} title="Wrap long lines" @click=${() => set(SEND_WRAP_KEY, !wrap)}>Wrap</button>
      <button type="button" class="ha-bopt" title="Copy the body" ?disabled=${text === ""} @click=${() => void copy()}>${copied ? "Copied" : "Copy"}</button>
      <span class="ha-bmeta">${bad ? html`<span class="ha-bad">Not JSON</span> · ` : nothing}${sizeText(new TextEncoder().encode(text).length)}</span>
    </div>
    <div class="ha-code ${wrap ? "" : "nowrap"}">
      <pre class="mono" aria-hidden="true">${colorBody(text, json).map((p) => (p.kind === "ws" || p.kind === "punct" ? p.text : html`<span class=${`j-${p.kind}`}>${p.text}</span>`))}${"\n"}</pre>
      <textarea class="mono ha-body-text" spellcheck="false" autocapitalize="off" autocomplete="off" wrap=${wrap ? "soft" : "off"} aria-label="Body" .value=${text} placeholder=${BODY_PLACEHOLDER[type]}
        @scroll=${(e: Event) => {
          const box = e.target as HTMLTextAreaElement;
          const back = box.previousElementSibling as HTMLElement | null;
          if (back !== null) { back.scrollTop = box.scrollTop; back.scrollLeft = box.scrollLeft; }
        }}
        @input=${(e: Event) => editRequest(host, action.id, (d) => setHttpActionBody(d, action.id, (e.target as HTMLTextAreaElement).value), `a:${action.id}:body`)}></textarea>
    </div>`;
}

function variableEditor(host: HttpActionsViewHost, action: HttpAction, v: HttpVariable, unused: boolean): TemplateResult {
  const set = (change: Parameters<typeof setHttpVariable>[3], coalesce?: string) =>
    host.edit((d) => setHttpVariable(d, action.id, v.id, change), coalesce);
  const quick = httpQuickValues(v);
  return html`<div class="ha-var ${unused ? "unused" : ""}" data-key=${v.key}>
    <div class="ha-var-head"><code>{{${v.key}}}</code>
      ${unused ? html`<span class="ha-mark">unused, left out when saved</span>
        <button type="button" class="icon ha-remove" title="Remove" aria-label=${`Remove {{${v.key}}}`}
          @click=${() => host.edit((d) => removeHttpVariable(d, action.id, v.id))}>${uiIcon("delete")}</button>` : nothing}
    </div>
    ${unused ? nothing : html`<div class="ha-var-grid">
      ${textField("Prompt", v.prompt, (p) => set({ prompt: p }, `v:${v.id}:prompt`), { placeholder: "Message" })}
      ${segField("Kind", v.kind, [["text", "Text"], ["number", "Number"]], (k) => set({ kind: k }))}
      <label class="field ha-quick"><span>Quick values</span>
        <textarea rows=${Math.max(2, Math.min(6, v.presetValues.length + 1))} .value=${v.presetValues.join("\n")} placeholder="One per line"
          @input=${(e: Event) => set({ presetValues: (e.target as HTMLTextAreaElement).value.split("\n") }, `v:${v.id}:presets`)}></textarea></label>
      <div class="ha-only">${switchRow("Only these", v.presetsOnly, (on) => set({ presetsOnly: on }), { disabled: quick.length === 0 && !v.presetsOnly })}
        <span class="ha-line">${quick.length === 0 ? "Add a quick value to offer only these." : v.presetsOnly ? "The watch shows only the quick values, with no typing." : "The watch offers the quick values and lets you type too."}</span></div>
    </div>`}
  </div>`;
}

function renderPromptsTab(host: HttpActionsViewHost, action: HttpAction): TemplateResult {
  const globals = httpGlobalKeys(host.document);
  const tokens = httpActionTokens(action, globals);
  const unused = httpUnusedVariables(action, globals);
  const missing = tokens.asked.filter((k) => !action.variables.some((v) => v.key === k));
  return html`<p class="ha-line" title=${HTTP_TOKEN_HELP}>${HTTP_PROMPTS_LINE}</p>
    ${tokens.global.length === 0 ? nothing : html`<p class="ha-from-globals">${tokens.global.map((k) => html`<code>{{${k}}}</code>`)} <span>${HTTP_PROMPTS_GLOBALS}</span></p>`}
    ${tokens.asked.length === 0 && unused.length === 0 ? html`<p class="ha-quiet">${HTTP_PROMPTS_NONE}</p>` : nothing}
    ${httpPromptVariables(action, globals).map((v) => variableEditor(host, action, v, false))}
    ${missing.map((k) => html`<div class="ha-var" data-key=${k}><div class="ha-var-head"><code>{{${k}}}</code><span class="ha-need-mark">not set up</span>
      <span class="ha-line">Sent as typed until it is set up.</span>
      <button type="button" class="pe-btn ha-sm" @click=${() => editRequest(host, action.id, (d) => d)}>Ask for it on the watch</button></div></div>`)}
    ${unused.map((v) => variableEditor(host, action, v, true))}`;
}

function renderReplyTab(host: HttpActionsViewHost, action: HttpAction): TemplateResult {
  const id = action.id;
  const reply = action.reply;
  const source: HttpReplySource | "none" = reply?.source ?? "none";
  const test = httpTestState(host, id);
  const field = reply === undefined ? undefined : HTTP_REPLY_FIELD[reply.source];
  const extra = field === "jsonPath"
    ? textField("JSON path", reply?.jsonPath ?? "", (v) => host.edit((d) => setHttpReplyField(d, id, "jsonPath", v), `r:${id}:path`), { mono: true, placeholder: "result.price" })
    : field === "headerName"
      ? textField("Header", reply?.headerName ?? "", (v) => host.edit((d) => setHttpReplyField(d, id, "headerName", v), `r:${id}:header`), { mono: true, placeholder: "X-RateLimit-Remaining" })
      : field === "pattern"
        ? textField("Pattern", reply?.pattern ?? "", (v) => host.edit((d) => setHttpReplyField(d, id, "pattern", v), `r:${id}:pattern`), { mono: true, placeholder: "temperature=([0-9.]+)" })
        : nothing;
  const line = reply === undefined
    ? "Pick what to take from the reply to show on the watch, as a tile's value or in the banner after it runs."
    : field === "jsonPath"
      ? "Or type the path: keys joined by dots, a number for an item of a list (data.0.temp)."
      : field === "pattern" ? "The first group in brackets, else the whole match." : "Shown on the watch, as a tile's value or in the banner after it runs.";
  return html`${field === "jsonPath" ? html`<p class="ha-info">Press Send, then click a value in the response below to use it as the reply value.</p>` : nothing}
    <p class="ha-line">${line}</p>
    <div class="ha-form">
      ${selectField("Read", source, REPLY_SOURCES, (v) => host.edit((d) => setHttpReplySource(d, id, v === "none" ? undefined : v)), { snapBack: true })}
      ${extra}
      ${reply === undefined ? nothing : textField("Unit", reply.unit ?? "", (v) => host.edit((d) => setHttpReplyField(d, id, "unit", v), `r:${id}:unit`), { placeholder: "°, $, kWh" })}
    </div>
    ${reply === undefined ? nothing : html`<p class="ha-reply-now" role="status">${test.reply === undefined || test.running
      ? html`<span class="ha-muted">Press Send to see the value the watch would show.</span>`
      : html`On the watch, from the last answer: ${liveValue(action, test)}`}</p>`}`;
}

function renderSettingsTab(host: HttpActionsViewHost, action: HttpAction): TemplateResult {
  const id = action.id;
  return html`<div class="ha-form ha-settings">
      ${numberField("Timeout", action.timeout, (v) => host.edit((d) => setHttpActionTimeout(d, id, v), `a:${id}:timeout`),
        { optional: true, min: HTTP_TIMEOUT_MIN, max: HTTP_TIMEOUT_MAX, step: 1, unit: "s", placeholder: String(HTTP_DEFAULT_TIMEOUT), def: null })}
      <p class="ha-line ha-under">${HTTP_TIMEOUT_TEXT}</p>
    </div>
    <div class="ha-setting">
      ${switchRow("Accept a self-signed certificate", action.allowsUntrustedCertificate, (v) => host.edit((d) => setHttpActionUntrusted(d, id, v)))}
      <p class="ha-line">${HTTP_SELF_SIGNED_TEXT}</p>
    </div>
    ${action.presentsClientCertificate ? html`<p class="ha-cert">This action asks for a client certificate. ${HTTP_ACTIONS_CLIENT_CERT_TEXT}</p>` : nothing}`;
}

function bodyIsSet(action: HttpAction): boolean {
  if (!httpSendsBody(action)) return false;
  return action.bodyContentType === "audio" || (action.body ?? "").trim() !== "";
}

function renderRequestTabs(host: HttpActionsViewHost, action: HttpAction): TemplateResult {
  const { headerId: authHeaderId, auth } = httpAuthOf(host, action);
  const tab = httpTab(host);
  const asked = httpPromptVariables(action, httpGlobalKeys(host.document)).length;
  const tabs: { id: HttpTab; label: string; extra?: TemplateResult | typeof nothing }[] = [
    { id: "headers", label: "Headers", extra: tabCount(action.headers.length) },
    { id: "auth", label: "Auth", extra: tabDot(auth.kind !== "none") },
    { id: "body", label: "Body", extra: tabDot(bodyIsSet(action)) },
    { id: "prompts", label: "Ask on watch", extra: tabCount(asked) },
    { id: "reply", label: "Reply value", extra: tabDot(action.reply !== undefined) },
    { id: "settings", label: "Settings" },
  ];
  const body = tab === "headers" ? renderHeadersTab(host, action, authHeaderId)
    : tab === "auth" ? renderAuthTab(host, action)
      : tab === "body" ? renderBodyTab(host, action)
        : tab === "prompts" ? renderPromptsTab(host, action)
          : tab === "reply" ? renderReplyTab(host, action)
            : renderSettingsTab(host, action);
  return html`<div class="ha-req">
    ${tabStrip("Request", "ha-tab", tabs, tab, (t) => setHttpTab(host, t), "ha-req-tabs")}
    <div class="ha-tabbody tab-${tab}" role="tabpanel" id="ha-tab-panel" aria-labelledby=${`ha-tab-${tab}`}>
      <fieldset class="ha-set" ?disabled=${host.busy}>${body}</fieldset>
    </div>
  </div>`;
}

// ── the response ─────────────────────────────────────────────────────────

interface TestState {
  values: Record<string, string>;
  running: boolean;
  reply?: HttpActionTestReply;
  /** The action's reply setting as it was sent, to tell when `reply.value`
   * no longer answers for the setting on screen. */
  sent?: string;
  error?: string;
  run: number;
}

/** What the reply value would be for the last answer, with the reply
 * setting as it is now. The value Home Assistant read stands while the
 * setting is the one that was sent. After a change, a JSON path is looked
 * up among the answer's leaves (each with the value Home Assistant reads
 * there); any other change needs a new send. */
export function httpLiveValue(action: HttpAction, state: Pick<TestState, "reply" | "sent">): { value?: string; found: boolean; stale: boolean } {
  const reply = state.reply;
  if (reply === undefined || action.reply === undefined) return { found: false, stale: false };
  if (state.sent === JSON.stringify(action.reply)) return reply.value === null ? { found: false, stale: false } : { value: reply.value, found: true, stale: false };
  if (action.reply.source !== "jsonField" || reply.leaves === undefined) return { found: false, stale: true };
  const path = (action.reply.jsonPath ?? "").trim();
  const leaf = reply.leaves.find((l) => l.path === path);
  if (leaf !== undefined) return { value: `${leaf.value}${action.reply.unit ?? ""}`, found: true, stale: false };
  // A path to a list or an object, or one past the listed leaves: only a
  // send can say.
  const inside = path !== "" && reply.leaves.some((l) => l.path.startsWith(`${path}.`));
  return { found: false, stale: inside || reply.leaves_cut === true || path === "" };
}

export function httpTestState(host: Pick<HttpActionsViewHost, "uiState">, actionId: string): TestState {
  const held = host.uiState.get(TEST_PREFIX + actionId) as TestState | undefined;
  return held ?? { values: {}, running: false, run: 0 };
}

function setTestState(host: Picker, actionId: string, next: TestState): void {
  host.uiState.set(TEST_PREFIX + actionId, next);
  host.requestUpdate();
}

/** The value each prompt sends in a test: what was typed, else its first
 * quick value, else nothing, as a run with no answer sends. */
export function httpTestValues(action: HttpAction, globals: ReadonlySet<string>, typed: Readonly<Record<string, string>>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const v of httpPromptVariables(action, globals)) {
    const t = typed[v.key];
    out[v.key] = t !== undefined ? t : (v.presetValues[0] ?? "");
  }
  return out;
}

/** Run the test: the draft's action and globals as they are now. An action
 * with no URL is not sent. */
export async function runHttpTest(host: HttpActionsViewHost, actionId: string): Promise<void> {
  const raw = findHttpAction(host.document, actionId);
  if (raw === undefined) return;
  const action = readHttpAction(raw);
  if (httpNeedsSetup(action)) return;
  const before = httpTestState(host, actionId);
  if (before.running) return;
  const run = before.run + 1;
  const values = httpTestValues(action, httpGlobalKeys(host.document), before.values);
  setTestState(host, actionId, { values: before.values, running: true, run });
  const globals = httpGlobalList(host.document);
  let next: TestState;
  try {
    const reply = await host.test(raw, globals, values);
    next = { values: httpTestState(host, actionId).values, running: false, reply, sent: JSON.stringify(action.reply), run };
  } catch (err) {
    next = { values: httpTestState(host, actionId).values, running: false, error: testErrorText(err), run };
  }
  if (httpTestState(host, actionId).run === run) setTestState(host, actionId, next);
}

function testErrorText(err: unknown): string {
  const e = err as { code?: unknown; message?: unknown; error?: { code?: unknown; message?: unknown } } | undefined;
  const code = typeof e?.code === "string" ? e.code : typeof e?.error?.code === "string" ? e.error.code : undefined;
  const message = typeof e?.message === "string" ? e.message : typeof e?.error?.message === "string" ? e.error.message : "";
  if (code === "unknown_command") return "This version of the integration cannot test an action. Update it to test here.";
  if (code === "invalid") return `Home Assistant could not build the request${message === "" ? "." : `: ${message}`}`;
  return message === "" ? "No answer from Home Assistant." : message;
}

function testValueField(host: HttpActionsViewHost, action: HttpAction, v: HttpVariable, state: TestState): TemplateResult {
  const quick = httpQuickValues(v);
  const value = state.values[v.key] ?? quick[0] ?? "";
  const set = (to: string) => setTestState(host, action.id, { ...httpTestState(host, action.id), values: { ...httpTestState(host, action.id).values, [v.key]: to } });
  const label = v.prompt.trim() === "" ? v.key : v.prompt.trim();
  if (v.presetsOnly && quick.length > 0) {
    return html`<label class="ha-tv"><span>${label}</span>
      <select .value=${value} @change=${(e: Event) => set((e.target as HTMLSelectElement).value)}>
        ${quick.map((q) => html`<option value=${q} ?selected=${q === value}>${q}</option>`)}
      </select></label>`;
  }
  const list = `ha-q-${v.id}`;
  return html`<label class="ha-tv"><span>${label}</span>
    <input type="text" inputmode=${v.kind === "number" ? "decimal" : nothing} .value=${value} list=${quick.length === 0 ? nothing : list}
      placeholder=${v.key} @input=${(e: Event) => set((e.target as HTMLInputElement).value)} />
    ${quick.length === 0 ? nothing : html`<datalist id=${list}>${quick.map((q) => html`<option value=${q}></option>`)}</datalist>`}</label>`;
}

function statusTone(reply: HttpActionTestReply): "ok" | "warn" | "err" {
  if (reply.status === null) return "err";
  return reply.status >= 200 && reply.status < 300 ? "ok" : "warn";
}

/** "Value 21.5°": what the watch would show for the last answer. */
function liveValue(action: HttpAction, state: Pick<TestState, "reply" | "sent">): TemplateResult {
  const live = httpLiveValue(action, state);
  return html`<span class="ha-val"><b>Value</b>${live.found ? html`<code>${live.value}</code>`
    : html`<span class="ha-muted">${live.stale ? "Send to see it" : "Not found"}</span>`}</span>`;
}

function renderBodyText(host: HttpActionsViewHost, action: HttpAction, reply: HttpActionTestReply): TemplateResult {
  if (reply.body_binary === true) return html`<p class="ha-quiet">The body is not text (${sizeText(reply.body_size ?? 0)}).</p>`;
  const shown = httpBodyShown(host, reply);
  if (shown.raw === "") return html`<p class="ha-quiet">No body.</p>`;
  const mode = shown.isJson ? httpBodyMode(host) : "raw";
  const wrap = httpBodyWrap(host);
  const pickable = new Set((reply.leaves ?? []).map((l) => l.path));
  const picked = action.reply?.source === "jsonField" ? (action.reply.jsonPath ?? "").trim() : undefined;
  const copied = host.uiState.get(BODY_COPIED_KEY) === true;
  const set = (key: string, value: unknown) => {
    host.uiState.set(key, value);
    host.requestUpdate();
  };
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(shown.text);
      set(BODY_COPIED_KEY, true);
      setTimeout(() => set(BODY_COPIED_KEY, false), 1500);
    } catch {
      /* No clipboard here: the text can still be selected. */
    }
  };
  const seg = (id: HttpBodyMode, label: string) => html`<button type="button" class="ha-bopt ${mode === id ? "on" : ""}" aria-pressed=${mode === id ? "true" : "false"}
    ?disabled=${!shown.isJson} title=${shown.isJson ? (id === "pretty" ? "Indented and colored" : "As the server sent it") : "The body is not JSON"}
    @click=${() => set(BODY_MODE_KEY, id)}>${label}</button>`;
  return html`<div class="ha-bbar" role="toolbar" aria-label="Body options">
      <span class="ha-bseg">${seg("pretty", "Pretty")}${seg("raw", "Raw")}</span>
      <button type="button" class="ha-bopt ${wrap ? "on" : ""}" aria-pressed=${wrap ? "true" : "false"} title="Wrap long lines" @click=${() => set(BODY_WRAP_KEY, !wrap)}>Wrap</button>
      <button type="button" class="ha-bopt" title="Copy the body as shown" @click=${() => void copy()}>${copied ? "Copied" : "Copy"}</button>
      <span class="ha-bmeta">${shown.isJson ? "JSON" : "Text"}${reply.body_size === undefined ? nothing : html` · ${sizeText(reply.body_size)}`}${reply.body === undefined
        ? html` · <span title="Update the integration to see the whole body.">first line only</span>` : nothing}${reply.body_cut === true ? " · cut at the size limit" : nothing}</span>
    </div>
    ${pickable.size === 0 || shown.pieces === undefined ? nothing : html`<p class="ha-info ha-pickline">Click a value to use it as the reply value.</p>`}
    <pre class="ha-snippet mono ${wrap ? "" : "nowrap"}">${shown.pieces === undefined ? shown.text
      : shown.pieces.map((p) => {
        if (p.kind === "ws" || p.kind === "punct") return p.text;
        if (p.path === undefined || !pickable.has(p.path)) return html`<span class=${`j-${p.kind}`}>${p.text}</span>`;
        const path = p.path;
        const on = picked === path;
        return html`<span class=${`j-${p.kind} j-pick ${on ? "on" : ""}`} role="button" tabindex="0" aria-pressed=${on ? "true" : "false"}
          title=${on ? `The reply value: ${path}` : `Use ${path} as the reply value`}
          @click=${() => { if (!host.busy) host.edit((d) => useHttpReplyPath(d, action.id, path)); }}
          @keydown=${(e: KeyboardEvent) => {
            if (e.key !== "Enter" && e.key !== " ") return;
            e.preventDefault();
            if (!host.busy) host.edit((d) => useHttpReplyPath(d, action.id, path));
          }}>${p.text}</span>`;
      })}</pre>`;
}

function renderReplyBody(host: HttpActionsViewHost, action: HttpAction, reply: HttpActionTestReply): TemplateResult {
  const tab = httpReplyTab(host);
  const headers = Object.entries(reply.headers ?? {});
  const tabs: { id: HttpReplyTab; label: string; extra?: TemplateResult | typeof nothing }[] = [
    { id: "body", label: "Body" },
    { id: "headers", label: "Headers", extra: tabCount(headers.length) },
    { id: "paths", label: "Paths", extra: tabCount(reply.paths.length) },
  ];
  let body: TemplateResult;
  if (tab === "body") {
    body = renderBodyText(host, action, reply);
  } else if (tab === "headers") {
    body = headers.length === 0 ? html`<p class="ha-quiet">No headers.</p>` : html`<div class="ha-rlist" role="list" aria-label="Reply headers">
      ${headers.map(([name, value]) => {
        const on = action.reply?.source === "header" && action.reply.headerName === name;
        return html`<div class="ha-rrow ${on ? "on" : ""}" role="listitem"><code>${name}</code><span class="mono ha-rval">${value}</span>
          <button type="button" class="ha-use" title=${`Read the ${name} header`} ?disabled=${host.busy}
            @click=${() => host.edit((d) => useHttpReplyHeader(d, action.id, name))}>${on ? "Reply value" : "Use"}</button></div>`;
      })}</div>`;
  } else {
    body = reply.paths.length === 0 ? html`<p class="ha-quiet">No JSON fields found.</p>` : html`<div class="ha-rlist" role="list" aria-label="JSON fields found">
      ${reply.paths.map((p) => {
        const on = action.reply?.source === "jsonField" && action.reply.jsonPath === p.path;
        return html`<button type="button" role="listitem" class="ha-rrow ha-path ${on ? "on" : ""}" title=${`${p.path} is ${p.value}. Read this field.`} ?disabled=${host.busy}
          @click=${() => host.edit((d) => useHttpReplyPath(d, action.id, p.path))}><code>${p.path}</code><span class="mono ha-rval">${p.value}</span><span class="ha-use-word">${on ? "Reply value" : "Use"}</span></button>`;
      })}</div>`;
  }
  return html`${tabStrip("Response", "ha-rtab", tabs, tab, (t) => setHttpReplyTab(host, t), "ha-resp-tabs")}
    <div class="ha-resp-body" role="tabpanel" id="ha-rtab-panel" aria-labelledby=${`ha-rtab-${tab}`}>${body}</div>`;
}

function renderResponse(host: HttpActionsViewHost, action: HttpAction): TemplateResult {
  const state = httpTestState(host, action.id);
  const prompts = httpPromptVariables(action, httpGlobalKeys(host.document));
  const reply = state.running ? undefined : state.reply;
  const tone = reply === undefined ? undefined : statusTone(reply);
  return html`<section class="ha-resp" aria-label="Response">
    <div class="ha-resp-head" role="status">
      <span class="ha-cap">Response</span>
      ${reply === undefined ? nothing : html`
        <span class="ha-status ${tone}">${reply.status === null ? "No answer" : `HTTP ${reply.status}`}</span>
        <span class="ha-ms">${reply.elapsed_ms} ms</span>
        ${action.reply === undefined ? nothing : liveValue(action, state)}`}
    </div>
    ${prompts.length === 0 ? nothing : html`<div class="ha-testvals" role="group" aria-label="Test values"><span class="ha-cap2">Test values</span>
      ${prompts.map((v) => testValueField(host, action, v, state))}</div>`}
    ${state.running ? html`<p class="ha-quiet ha-pad">Sending…</p>`
      : state.error !== undefined ? html`<p class="ha-test-err ha-pad" role="status">${state.error}</p>`
        : reply === undefined
          ? html`<p class="ha-quiet ha-pad">${HTTP_TEST_LINE}${httpNeedsAudio(action) ? " A test sends no voice clip." : ""}</p>`
          : html`${reply.error ? html`<p class="ha-test-err ha-pad">${reply.error}</p>` : nothing}${renderReplyBody(host, action, reply)}`}
  </section>`;
}

function renderActionMain(host: HttpActionsViewHost, action: HttpAction): TemplateResult {
  return html`<div class="ha-main-in" data-action=${action.id}>
    ${titleRow(host, action)}
    ${requestBar(host, action)}
    ${renderRequestTabs(host, action)}
    ${renderResponse(host, action)}
  </div>`;
}

// ── the main pane: the globals ───────────────────────────────────────────

function renderGlobalsMain(host: HttpActionsViewHost): TemplateResult {
  const globals = httpGlobalList(host.document).map(readHttpGlobal);
  const counts = new Map<string, number>();
  for (const g of globals) counts.set(g.key.trim(), (counts.get(g.key.trim()) ?? 0) + 1);
  return html`<div class="ha-main-in ha-globals">
    <div class="ha-titlerow">
      <span class="ha-mtag ha-gtag big" aria-hidden="true">{ }</span>
      <h3 class="ha-h">Globals</h3><span class="ha-count">${globals.length}</span>
      <span class="ha-title-acts"></span>
    </div>
    <div class="ha-scroll">
      <p class="ha-line ha-glead">${HTTP_GLOBALS_CARD_LINE}</p>
      <fieldset class="ha-set" ?disabled=${host.busy}>
      <div class="ha-table ha-gtable" role="table" aria-label="Globals">
        <div class="ha-tr ha-th" role="row"><span role="columnheader">Key</span><span role="columnheader">Value</span><span role="columnheader">Used by</span><span></span></div>
        ${globals.map((g) => {
          const key = g.key.trim();
          const users = httpGlobalUsers(host.document, key);
          return html`<div class="ha-tr" role="row" data-global=${g.id}>
            <span class="ha-td" role="cell"><input type="text" class="mono" .value=${g.key} placeholder="haurl"
              aria-label="Key" spellcheck="false" @input=${(e: Event) => host.edit((d) => setHttpGlobalKey(d, g.id, (e.target as HTMLInputElement).value), `g:${g.id}:key`)} /></span>
            <span class="ha-td" role="cell">${secretBox(host, `${key === "" ? "Global" : key} value`, g.value,
              (v) => host.edit((d) => setHttpGlobalValue(d, g.id, v), `g:${g.id}:value`), `global:${g.id}`, "https://ha.local:8123")}</span>
            <span class="ha-td ha-users" role="cell" title=${users.length === 0 ? "No action uses it yet." : `Used by ${users.join(", ")}.`}>${users.length === 0 ? html`<span class="ha-muted">Not used yet</span>` : plural(users.length, "action", "actions")}</span>
            <span class="ha-td ha-end" role="cell"><button type="button" class="icon ha-remove" aria-label=${`Remove ${key === "" ? "this global" : `{{${key}}}`}`}
              title=${users.length === 0 ? "Remove this global" : "Remove this global. The actions that use it send the {{key}} as typed."}
              @click=${() => host.edit((d) => removeHttpGlobal(d, g.id))}>${uiIcon("delete")}</button></span>
            ${key === "" ? html`<p class="ha-warn ha-rowwarn">A global needs a key before it can be saved.</p>`
              : (counts.get(key) ?? 0) > 1 ? html`<p class="ha-warn ha-rowwarn">Another global has this key. Each key must be its own.</p>` : nothing}
          </div>`;
        })}
        <div class="ha-tr ha-addrow" role="row"><button type="button" class="ha-add-row ha-add-global" @click=${() => addHttpGlobalTo(host)}>${uiIcon("plus")}<span>Add global</span></button></div>
      </div>
      </fieldset>
      <p class="ha-line">Type {{key}} in a URL, header or body. It is filled in as typed, before the values asked for on the watch. Values stay hidden until shown.</p>
    </div>
  </div>`;
}

// ── the main pane ────────────────────────────────────────────────────────

/** The main pane: the picked action as a request, the Globals table, or a
 * calm start when there is nothing to pick. */
export function renderHttpMain(host: HttpActionsViewHost): TemplateResult {
  const s = httpSelection(host);
  if (s?.kind === "globals") return renderGlobalsMain(host);
  if (s?.kind === "action") return renderActionMain(host, readHttpAction(findHttpAction(host.document, s.id)!));
  return html`<div class="ha-empty-main">
    <b>${HTTP_ACTIONS_EMPTY_TITLE}</b>
    <span>An HTTP action is a web request a watch asks Home Assistant to send. Add one to start, or a global for a value several actions share.</span>
    <button type="button" class="pe-btn pe-primary" ?disabled=${host.busy} @click=${() => addHttpActionTo(host)}>${uiIcon("plus")}<span>${HTTP_ACTIONS_ADD_BUTTON}</span></button>
  </div>`;
}

/** The views' rules, after the shared chrome and the editor's own in the
 * editor's sheet. */
export const httpActionsViewStyles = css`
  .mono, input[type].mono, textarea.mono { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
  .ha-glyph-dot { display: inline-block; width: 8px; height: 8px; border-radius: 50%; }
  .ha-muted { color: var(--wa-muted); }
  .ha-line { margin: 0; font-size: 12px; line-height: 1.45; color: var(--wa-muted); }
  .ha-quiet { margin: 0; font-size: 12.5px; color: var(--wa-muted); }
  .ha-warn { margin: 0; font-size: 12px; line-height: 1.45; color: var(--wa-amber); }
  .ha-test-err { margin: 0; font-size: 12.5px; line-height: 1.4; color: var(--wa-need); }
  fieldset.ha-set { margin: 0; padding: 0; border: 0; min-width: 0; display: contents; }

  /* ── the collection ── */
  .ha-list-card { display: flex; flex-direction: column; min-height: 0; max-height: 100%; }
  .ha-list-card > .lc-head { flex: none; }
  .ha-list-note { flex: none; margin: 4px 10px 8px; color: var(--wa-muted); }
  .ha-items { display: flex; flex-direction: column; gap: 1px; padding: 0 6px 6px; overflow-y: auto; min-height: 0; flex: 0 1 auto; scrollbar-width: thin; }
  .ha-item {
    position: relative; display: flex; align-items: center; gap: 8px; min-height: 32px; padding: 0 8px; border-radius: 6px;
    cursor: pointer; user-select: none; font-size: 13px; color: var(--wa-ink); flex: none; background: var(--wa-card);
  }
  .ha-item:hover { background: var(--wa-hover); }
  .ha-item.on { background: var(--wa-pick-bg); box-shadow: inset 0 0 0 1px var(--wa-pick-line); }
  .ha-item:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .ha-item-name { flex: 1 1 auto; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .ha-item.on .ha-item-name { font-weight: 600; }
  .ha-mtag {
    flex: none; width: 40px; font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 10.5px; font-weight: 700; letter-spacing: .02em; color: var(--wa-muted);
  }
  .m-get { color: var(--wa-hue-green); }
  .m-post { color: var(--wa-hue-orange); }
  .m-put { color: var(--wa-hue-blue); }
  .m-patch { color: var(--wa-hue-yellow); }
  .m-del { color: var(--wa-hue-red); }
  .m-other { color: var(--wa-muted); }
  .ha-gtag { color: var(--wa-hue-green); }
  .ha-need-mark { flex: none; font-size: 10.5px; font-weight: 600; color: var(--wa-amber); white-space: nowrap; }
  .ha-mark { flex: none; font-size: 10.5px; font-weight: 500; color: var(--wa-muted); white-space: nowrap; }
  /* The move buttons sit over the row's right end, on its own ground, only
     while the row is under the pointer or holds the focus, so at rest the
     name has the whole width. */
  .ha-item-acts {
    position: absolute; right: 2px; top: 50%; transform: translateY(-50%); display: inline-flex; gap: 0;
    padding-left: 6px; border-radius: 6px; background: inherit; opacity: 0; pointer-events: none;
  }
  .ha-item:is(:hover, :focus-within) .ha-item-acts { opacity: 1; pointer-events: auto; }
  .ha-item-acts button.icon { width: 22px; height: 22px; }
  .ha-item-acts button.icon svg.ui-icon { width: 12px; height: 12px; }
  .ha-item-acts button.icon:disabled { opacity: .3; }
  @media (hover: none) { .ha-item-acts { position: static; transform: none; opacity: 1; pointer-events: auto; } }
  .ha-list-foot { flex: none; padding: 6px; border-top: 1px solid var(--wa-line); }
  .ha-count {
    flex: none; min-width: 20px; height: 18px; padding: 0 6px; border-radius: 9px; display: inline-grid; place-items: center;
    font-size: 11px; font-weight: 600; color: var(--wa-muted); background: var(--wa-field); font-variant-numeric: tabular-nums;
  }

  /* ── the main pane ── */
  .ha-main-in { display: flex; flex-direction: column; min-height: 0; min-width: 0; flex: 1 1 auto; container: hamain / inline-size; }
  .ha-req, .ha-resp, .ha-tabbody, .ha-tabs, .ha-scroll { min-width: 0; }
  .ha-titlerow { flex: none; display: flex; align-items: center; gap: 10px; min-height: 50px; padding: 8px 12px 4px 12px; }
  .ha-title-acts { margin-left: auto; display: inline-flex; gap: 6px; flex: none; }
  .ha-h { margin: 0; font-size: 15px; font-weight: 600; }
  .ha-gtag.big { width: auto; font-size: 13px; }
  .pe-btn.ha-sm { min-height: 28px; padding: 0 10px; font-size: 12.5px; }
  .pe-btn.ha-sm svg.ui-icon { width: 13px; height: 13px; }
  .ha-look { position: relative; flex: none; }
  button.ha-look-btn {
    display: grid; place-items: center; width: 32px; height: 32px; padding: 0; border-radius: 8px; cursor: pointer;
    border: 1px solid var(--wa-line-strong); background: color-mix(in srgb, var(--c, #888) 22%, #000);
  }
  button.ha-look-btn:hover { border-color: color-mix(in srgb, var(--wa-ink) 34%, var(--wa-card)); }
  button.ha-look-btn:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  button.ha-look-btn[aria-expanded="true"] { border-color: var(--wa-accent); }
  .ha-look-glyph { display: grid; place-items: center; width: 18px; height: 18px; }
  .ha-look-glyph svg { width: 16px; height: 16px; display: block; }
  .ha-look-pop {
    position: absolute; top: calc(100% + 6px); left: 0; z-index: 40; width: 360px; max-width: calc(100cqw - 24px);
    max-height: 420px; overflow: auto; padding: 10px 12px; display: flex; flex-direction: column; gap: 4px;
    background: var(--wa-card); border: 1px solid var(--wa-line-strong); border-radius: var(--wa-r-md); box-shadow: var(--wa-shadow-pop);
    --wa-lab: 52px;
  }
  .ha-stack .field { grid-template-columns: minmax(0, 1fr); gap: 4px; padding: 2px 0; }
  .ha-pop-foot { display: flex; align-items: center; gap: 8px; padding-top: 6px; }
  .ha-pop-foot .ha-line { flex: 1; }
  input.ha-name {
    flex: 1 1 auto; min-width: 0; max-width: 520px; height: 32px; padding: 0 8px; margin-left: -4px;
    font-size: 15px; font-weight: 600; border-color: transparent; background: transparent;
  }
  input.ha-name:hover:not(:disabled) { border-color: var(--wa-line-strong); }

  .ha-reqbar { flex: none; display: flex; align-items: stretch; gap: 8px; padding: 4px 12px 8px; }
  .ha-reqbox {
    flex: 1 1 auto; min-width: 0; display: flex; align-items: stretch; height: 36px;
    border: 1px solid var(--wa-line-strong); border-radius: 8px; background: var(--wa-input); overflow: hidden;
  }
  .ha-reqbox:focus-within { border-color: var(--wa-accent); box-shadow: var(--wa-ring); }
  .ha-reqbox select.ha-method {
    flex: none; width: 104px; height: 100%; border: 0; border-right: 1px solid var(--wa-line-strong); border-radius: 0;
    background-color: transparent; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 12.5px; font-weight: 700;
    padding-left: 12px;
  }
  .ha-reqbox select.ha-method option { color: var(--wa-ink); }
  .ha-reqbox select.ha-method:focus-visible { box-shadow: none; }
  .ha-reqbox input.ha-url {
    flex: 1 1 auto; min-width: 0; height: 100%; border: 0; border-radius: 0; background: transparent; font-size: 13px; padding: 0 12px;
  }
  .ha-reqbox input.ha-url:focus-visible { box-shadow: none; }
  .pe-btn.ha-send { flex: none; min-width: 92px; min-height: 36px; font-weight: 600; }
  .pe-btn.ha-send.busy { opacity: .75; cursor: progress; }
  .ha-barnote { flex: none; padding: 0 12px 8px; display: flex; flex-direction: column; gap: 2px; }
  @container hamain (max-width: 520px) {
    .ha-reqbar { flex-wrap: wrap; }
    .ha-reqbox { flex-basis: 100%; }
    .pe-btn.ha-send { flex: 1 1 auto; }
    .ha-titlerow { flex-wrap: wrap; }
    .ha-tabs { flex-wrap: wrap; }
    button.ha-tab { padding: 0 8px; }
  }

  .ha-tabs { flex: none; display: flex; align-items: stretch; gap: 2px; padding: 0 8px; border-bottom: 1px solid var(--wa-line); overflow-x: auto; scrollbar-width: none; }
  button.ha-tab {
    flex: none; display: inline-flex; align-items: center; gap: 6px; height: 34px; padding: 0 10px; margin-bottom: -1px;
    border: 0; border-bottom: 2px solid transparent; background: transparent; color: var(--wa-muted);
    font: inherit; font-size: 12.5px; font-weight: 500; cursor: pointer; white-space: nowrap;
  }
  button.ha-tab:hover { color: var(--wa-ink); }
  button.ha-tab.on { color: var(--wa-ink); border-bottom-color: var(--wa-ink); font-weight: 600; }
  button.ha-tab:focus-visible { outline: none; box-shadow: inset 0 0 0 2px color-mix(in srgb, var(--wa-accent) 60%, transparent); border-radius: 6px 6px 0 0; }
  .ha-tab-n { font-size: 11px; font-weight: 600; color: var(--wa-muted); font-variant-numeric: tabular-nums; }
  .ha-tab-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--wa-hue-green); }

  .ha-req { display: flex; flex-direction: column; min-height: 0; flex: 1 1 0; }
  .ha-tabbody { flex: 1 1 auto; min-height: 0; overflow: auto; padding: 12px 14px; display: flex; flex-direction: column; gap: 10px; scrollbar-width: thin; }
  .ha-tabbody > .ha-line:first-child { margin-top: -2px; }

  /* A form in a tab: titles in a short column, controls at their own width. */
  .ha-form { --wa-lab: 92px; display: flex; flex-direction: column; gap: 4px; max-width: 520px; }
  .ha-form .field select { width: auto; min-width: 200px; max-width: 100%; justify-self: start; }
  .ha-form .field.num > :last-child { width: 110px; justify-self: start; }
  .ha-form .ha-under { margin-left: calc(var(--wa-lab) + 8px); }
  .ha-setting { display: flex; flex-direction: column; gap: 4px; }
  .ha-setting > .ha-line { margin-left: 40px; }
  .ha-cert { padding: 8px 10px; border: 1px solid var(--wa-amber-line); border-radius: 8px; max-width: 620px; }
  label.ha-switch { display: inline-flex; align-items: center; gap: 8px; min-height: 28px; font-size: 13px; cursor: pointer; }
  label.ha-switch:has(input:disabled) { cursor: default; color: var(--wa-muted); }

  /* A secret: a password box with its own Show. */
  .ha-secret { display: flex; align-items: center; gap: 6px; min-width: 0; }
  .ha-secret > input { flex: 1; min-width: 0; }
  input[type=password] {
    font: inherit; font-size: 13px; font-weight: 500; color: var(--wa-ink); min-height: 28px; height: 28px;
    padding: 0 9px; border-radius: 6px; border: 1px solid var(--wa-line-strong); background: var(--wa-input);
  }
  input[type=password]:focus-visible { outline: none; border-color: var(--wa-accent); box-shadow: var(--wa-ring); }
  .ha-secret > input[type=text] { height: 28px; min-height: 28px; padding: 0 9px; font-size: 12px; }
  .ha-secret > input[type=password] { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 12px; }
  button.ha-show {
    flex: none; height: 24px; padding: 0 8px; border-radius: 6px; border: 1px solid var(--wa-line);
    background: transparent; color: var(--wa-muted); font: inherit; font-size: 11.5px; cursor: pointer;
  }
  button.ha-show:hover { color: var(--wa-ink); background: var(--wa-hover); }
  button.ha-show:focus-visible { outline: none; box-shadow: var(--wa-ring); }

  /* A key and value table: hairlines between rows and cells, the boxes flat
     in their cells, as an HTTP client draws one. */
  .ha-table { --cols: minmax(0, 2fr) minmax(0, 3fr) 48px; max-width: 1100px; border: 1px solid var(--wa-line); border-radius: 8px; overflow: hidden; }
  .ha-gtable { --cols: minmax(0, 2fr) minmax(0, 3fr) 110px 48px; }
  .ha-tr { display: grid; grid-template-columns: var(--cols); align-items: stretch; border-top: 1px solid var(--wa-line); }
  .ha-tr:first-child { border-top: 0; }
  .ha-th { background: var(--wa-field); }
  .ha-th > span { padding: 6px 10px; font-size: 11px; font-weight: 600; letter-spacing: .04em; text-transform: uppercase; color: var(--wa-muted); }
  .ha-td { display: flex; align-items: center; min-width: 0; min-height: 34px; border-left: 1px solid var(--wa-line); }
  .ha-td:first-child { border-left: 0; }
  .ha-td > input[type=text], .ha-td .ha-secret > input {
    width: 100%; height: 34px; min-height: 34px; border: 0; border-radius: 0; background: transparent; font-size: 12.5px; padding: 0 10px;
  }
  .ha-td > input[type=text]:focus-visible, .ha-td .ha-secret > input:focus-visible { box-shadow: inset 0 0 0 1px var(--wa-accent); }
  .ha-td .ha-secret { flex: 1; gap: 4px; padding-right: 6px; }
  .ha-td.ha-end { justify-content: center; }
  .ha-td.ha-ro { padding: 0 10px; font-size: 12.5px; color: var(--wa-muted); }
  .ha-dots { letter-spacing: .1em; }
  .ha-td.ha-users { padding: 0 10px; font-size: 12px; white-space: nowrap; }
  .ha-rowwarn { grid-column: 1 / -1; padding: 0 10px 6px; }
  button.ha-from-auth {
    height: 20px; padding: 0 7px; border-radius: 5px; border: 1px solid var(--wa-line-strong); background: transparent;
    font: inherit; font-size: 10.5px; font-weight: 600; color: var(--wa-muted); cursor: pointer;
  }
  button.ha-from-auth:hover { color: var(--wa-ink); }
  button.icon.ha-remove { width: 26px; height: 26px; }
  button.icon.ha-remove:hover:not(:disabled) { color: var(--wa-need); }
  .ha-addrow { display: block; }
  button.ha-add-row {
    display: flex; align-items: center; gap: 6px; width: 100%; height: 34px; padding: 0 10px; border: 0; background: transparent;
    font: inherit; font-size: 12.5px; color: var(--wa-muted); cursor: pointer; text-align: left;
  }
  button.ha-add-row svg.ui-icon { width: 13px; height: 13px; }
  button.ha-add-row:hover:not(:disabled) { color: var(--wa-ink); background: var(--wa-hover); }
  button.ha-add-row:focus-visible { outline: none; box-shadow: inset 0 0 0 2px color-mix(in srgb, var(--wa-accent) 60%, transparent); }
  @container hamain (max-width: 560px) {
    .ha-gtable { --cols: minmax(0, 1fr) minmax(0, 1.4fr) 40px; }
    .ha-gtable .ha-users, .ha-gtable .ha-th > span:nth-child(3) { display: none; }
  }

  .ha-body-head { display: flex; flex-wrap: wrap; align-items: center; gap: 6px 14px; }
  label.ha-inline { display: inline-flex; align-items: center; gap: 8px; font-size: 12px; color: var(--wa-label, var(--wa-muted)); }
  label.ha-inline select { min-width: 130px; }
  .ha-qbar { position: static; margin: 0; padding: 0; background: none; }
  .ha-bad { color: var(--wa-amber); font-weight: 600; }
  .ha-code { position: relative; flex: 1 1 auto; min-height: 140px; border: 1px solid var(--wa-line-strong); border-radius: 8px; background: var(--wa-input); overflow: hidden; }
  .ha-code:focus-within { border-color: color-mix(in srgb, var(--wa-accent) 60%, var(--wa-line-strong)); }
  .ha-code pre, .ha-code textarea.ha-body-text {
    position: absolute; inset: 0; width: 100%; height: 100%; min-height: 0; margin: 0; box-sizing: border-box; border: 0; border-radius: 0; outline: none; box-shadow: none;
    padding: 8px 10px; font-size: 12.5px; line-height: 1.5; letter-spacing: 0; tab-size: 2;
    white-space: pre-wrap; overflow-wrap: anywhere; word-break: normal; scrollbar-width: thin; scrollbar-gutter: stable;
  }
  .ha-code.nowrap pre, .ha-code.nowrap textarea.ha-body-text { white-space: pre; overflow-wrap: normal; }
  .ha-code pre { overflow: hidden; color: var(--wa-ink); pointer-events: none; }
  .ha-code textarea.ha-body-text { overflow: auto; resize: none; background: transparent; color: transparent; caret-color: var(--wa-ink); }
  .ha-code textarea.ha-body-text::placeholder { color: var(--wa-muted); }
  .ha-code .j-key { color: var(--wa-hue-blue); }
  .ha-code .j-str { color: var(--wa-hue-green); }
  .ha-code .j-num { color: var(--wa-hue-orange); }
  .ha-code .j-lit { color: var(--wa-hue-pink); }
  .ha-code .j-var, pre.ha-snippet .j-var { color: var(--wa-val); }

  .ha-from-globals { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; margin: 0; font-size: 12px; color: var(--wa-muted); }
  .ha-var { display: flex; flex-direction: column; gap: 6px; padding: 10px 12px; max-width: 760px; border: 1px solid var(--wa-line); border-radius: 8px; }
  .ha-var.unused { opacity: .75; }
  .ha-var-head { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; min-height: 24px; }
  .ha-var-head code { font-size: 12.5px; font-weight: 600; }
  .ha-var-head .ha-remove, .ha-var-head .pe-btn { margin-left: auto; }
  .ha-var-grid { --wa-lab: 88px; display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 4px 20px; align-items: start; }
  .ha-var-grid .seg.wide { max-width: 200px; }
  .ha-var-grid .field.ha-quick textarea { min-height: 50px; resize: vertical; }
  .ha-only { display: flex; flex-direction: column; gap: 2px; padding-top: 1px; }

  /* ── the response ── */
  .ha-resp { flex: 1.15 1 0; min-height: 0; display: flex; flex-direction: column; border-top: 1px solid var(--wa-line-strong); background: var(--wa-raised, var(--wa-card)); }
  .ha-resp-head { flex: none; display: flex; flex-wrap: wrap; align-items: center; gap: 6px 12px; min-height: 38px; padding: 6px 14px; }
  .ha-cap { font-size: 11px; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; color: var(--wa-muted); }
  .ha-cap2 { font-size: 11.5px; font-weight: 600; color: var(--wa-muted); }
  .ha-status {
    display: inline-flex; align-items: center; height: 22px; padding: 0 8px; border-radius: 6px; font-size: 12px; font-weight: 700;
    font-variant-numeric: tabular-nums; border: 1px solid var(--wa-line-strong); color: var(--wa-ink);
  }
  .ha-status.ok { color: var(--wa-green); border-color: color-mix(in srgb, var(--wa-green) 55%, transparent); }
  .ha-status.warn { color: var(--wa-amber); border-color: color-mix(in srgb, var(--wa-amber) 55%, transparent); }
  .ha-status.err { color: var(--wa-need); border-color: color-mix(in srgb, var(--wa-need) 55%, transparent); }
  .ha-ms { font-size: 12px; color: var(--wa-muted); font-variant-numeric: tabular-nums; }
  .ha-val { display: inline-flex; align-items: baseline; gap: 6px; font-size: 12.5px; min-width: 0; }
  .ha-val b { font-weight: 500; color: var(--wa-muted); font-size: 12px; }
  .ha-val code { color: var(--wa-val); overflow-wrap: anywhere; }
  .ha-testvals { flex: none; display: flex; flex-wrap: wrap; align-items: center; gap: 6px 14px; padding: 0 14px 8px; }
  label.ha-tv { display: inline-flex; align-items: center; gap: 6px; font-size: 12px; color: var(--wa-label, var(--wa-muted)); }
  label.ha-tv input, label.ha-tv select { width: 150px; height: 28px; min-height: 28px; font-size: 12.5px; padding-top: 0; padding-bottom: 0; }
  .ha-pad { padding: 4px 14px 12px; }
  .ha-resp-tabs { padding: 0 8px; }
  .ha-resp-body { flex: 1 1 auto; min-height: 0; overflow: auto; padding: 10px 14px 12px; scrollbar-width: thin; }
  pre.ha-snippet { margin: 0; font-size: 12px; line-height: 1.5; white-space: pre-wrap; overflow-wrap: anywhere; color: var(--wa-ink); }
  pre.ha-snippet.nowrap { white-space: pre; overflow-wrap: normal; }
  pre.ha-snippet .j-pick { cursor: pointer; border-radius: 3px; }
  pre.ha-snippet .j-pick:hover { background: var(--wa-hover); box-shadow: 0 0 0 1px var(--wa-line-strong); }
  pre.ha-snippet .j-pick:focus-visible { outline: none; box-shadow: 0 0 0 2px color-mix(in srgb, var(--wa-accent) 60%, transparent); }
  pre.ha-snippet .j-pick.on { box-shadow: 0 0 0 1px var(--wa-green); background: color-mix(in srgb, var(--wa-green) 14%, transparent); }
  .ha-pickline { margin: 0 0 6px; }
  .ha-info { margin: 0; font-size: 12.5px; color: var(--wa-amber); }
  .ha-reply-now { margin: 4px 0 0; font-size: 12.5px; color: var(--wa-muted); display: flex; flex-wrap: wrap; align-items: baseline; gap: 6px; }
  pre.ha-snippet .j-key { color: var(--wa-hue-blue); }
  pre.ha-snippet .j-str { color: var(--wa-hue-green); }
  pre.ha-snippet .j-num { color: var(--wa-hue-orange); }
  pre.ha-snippet .j-lit { color: var(--wa-hue-pink); }
  .ha-bbar { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; margin: 0 0 8px; position: sticky; top: -10px; padding: 4px 0; background: var(--wa-raised, var(--wa-card)); z-index: 1; }
  .ha-bseg { display: inline-flex; }
  .ha-bseg button.ha-bopt { border-radius: 0; margin-left: -1px; }
  .ha-bseg button.ha-bopt:first-child { border-radius: 5px 0 0 5px; margin-left: 0; }
  .ha-bseg button.ha-bopt:last-child { border-radius: 0 5px 5px 0; }
  button.ha-bopt { font: inherit; font-size: 11.5px; height: 24px; padding: 0 9px; border-radius: 5px; border: 1px solid var(--wa-line); background: transparent; color: var(--wa-muted); cursor: pointer; }
  button.ha-bopt:hover:not(:disabled) { color: var(--wa-ink); border-color: var(--wa-line-strong); }
  button.ha-bopt.on { color: var(--wa-ink); border-color: var(--wa-line-strong); background: var(--wa-hover); font-weight: 600; position: relative; }
  button.ha-bopt:disabled { opacity: 0.45; cursor: default; }
  button.ha-bopt:focus-visible { outline: none; box-shadow: 0 0 0 2px color-mix(in srgb, var(--wa-accent) 60%, transparent); }
  .ha-bmeta { margin-left: auto; font-size: 11.5px; color: var(--wa-muted); font-variant-numeric: tabular-nums; }
  .ha-rlist { display: flex; flex-direction: column; max-width: 1100px; }
  .ha-rrow {
    display: grid; grid-template-columns: minmax(0, 2fr) minmax(0, 3fr) 84px; align-items: center; gap: 12px;
    min-height: 30px; padding: 0 8px; border-radius: 6px; border: 0; background: transparent; color: var(--wa-ink);
    font: inherit; font-size: 12.5px; text-align: left;
  }
  .ha-rrow + .ha-rrow { border-top: 1px solid var(--wa-line); border-radius: 0; }
  button.ha-rrow { cursor: pointer; }
  button.ha-rrow:hover:not(:disabled), div.ha-rrow:hover { background: var(--wa-hover); }
  button.ha-rrow:focus-visible { outline: none; box-shadow: inset 0 0 0 2px color-mix(in srgb, var(--wa-accent) 60%, transparent); }
  .ha-rrow code { font-size: 12px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .ha-rval { font-size: 12px; color: var(--wa-muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .ha-use-word, button.ha-use { font-size: 11.5px; color: var(--wa-muted); justify-self: end; white-space: nowrap; }
  button.ha-use { font: inherit; font-size: 11.5px; height: 22px; padding: 0 8px; border-radius: 5px; border: 1px solid var(--wa-line); background: transparent; cursor: pointer; }
  button.ha-use:hover:not(:disabled) { color: var(--wa-ink); border-color: var(--wa-line-strong); }
  .ha-rrow.on .ha-use-word, .ha-rrow.on button.ha-use { color: var(--wa-green); font-weight: 600; }

  /* ── the globals ── */
  .ha-scroll { flex: 1 1 auto; min-height: 0; overflow: auto; padding: 4px 12px 14px; display: flex; flex-direction: column; gap: 10px; }
  .ha-glead { max-width: 760px; }

  /* ── nothing picked ── */
  .ha-empty-main {
    margin: auto; display: flex; flex-direction: column; align-items: center; gap: 10px; max-width: 420px; padding: 32px 20px; text-align: center;
    font-size: 13px; color: var(--wa-muted);
  }
  .ha-empty-main b { font-size: 15px; color: var(--wa-ink); }
  .ha-empty-main .pe-btn { margin-top: 4px; }
`;
