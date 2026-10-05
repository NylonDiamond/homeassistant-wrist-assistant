// The HTTP actions screen's views, drawn from a host, in the complication
// editor's chrome (`editor-chrome.ts`) as the Control Center editor wears
// it: on the left the actions, then Globals; in the middle the picked
// action's request (name and look, method and URL, the sign-in helper,
// headers, body, timeout and certificate) or the picked global; on the
// right the values asked for when it runs, the reply value and the Test
// card. `<wa-http-actions-editor>` owns the draft and hands a host in on
// every draw; nothing here keeps state of its own beyond `uiState`, which
// lives in memory with the element.
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
import { sectionCard } from "../editor-chrome.js";
import { checkField, colorField, numberField, segField, selectField, symbolField, textField } from "../editors.js";
import type { HassLike, HttpActionTestReply } from "../ha-api.js";
import { SECTION_COLOR } from "../kinds.js";
import type { IconProvider } from "../renderer.js";
import type { SymbolBrowser } from "../symbols.js";
import { type UiIconName, uiIcon } from "../ui-icons.js";
import { type FoldId, anySectionOpen, sectionOpen, setSectionOpen, setSectionsOpen } from "../watch-pages/fold-memory.js";
import { type JsonObject, isJsonObject } from "../watch-pages/model.js";
import {
  HTTP_AUTH_KINDS,
  HTTP_DEFAULT_TIMEOUT,
  HTTP_METHODS,
  HTTP_REPLY_FIELD,
  HTTP_TIMEOUT_MAX,
  HTTP_TIMEOUT_MIN,
  HTTP_TOKEN_HELP,
  HTTP_ACTIONS_CLIENT_CERT_TEXT,
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
  findHttpGlobal,
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

const FOLD_MODULE = "http-actions";
const SELECTED_KEY = "ha:sel";
const SHOW_PREFIX = "ha:show:";
const AUTH_PREFIX = "ha:auth:";
const TEST_PREFIX = "ha:test:";

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

export const HTTP_TEST_LINE = "Sends the action as it is here, from Home Assistant, with the globals as they are here. Nothing is saved.";

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

// ── selection ────────────────────────────────────────────────────────────

export type HttpSelection = { kind: "action" | "global"; id: string };

/** What is picked: an action or a global still in the library, else the
 * first action, else nothing. */
export function httpSelection(host: ViewState): HttpSelection | undefined {
  const picked = host.uiState.get(SELECTED_KEY) as HttpSelection | undefined;
  if (picked?.kind === "action" && findHttpAction(host.document, picked.id) !== undefined) return picked;
  if (picked?.kind === "global" && findHttpGlobal(host.document, picked.id) !== undefined) return picked;
  const first = httpActionList(host.document)[0];
  return typeof first?.id === "string" ? { kind: "action", id: first.id } : undefined;
}

export function selectHttp(host: Picker, selection: HttpSelection | undefined): void {
  if (selection === undefined) host.uiState.delete(SELECTED_KEY);
  else host.uiState.set(SELECTED_KEY, selection);
  host.requestUpdate();
}

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

export function addHttpGlobalTo(host: HttpActionsViewHost): string {
  const id = host.newId();
  host.edit((d) => addHttpGlobal(d, id, freshHttpGlobalKey(d)));
  selectHttp(host, { kind: "global", id });
  return id;
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

function renderAuth(host: HttpActionsViewHost, action: HttpAction): TemplateResult {
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
  return html`${selectField("Sign-in", auth.kind, HTTP_AUTH_KINDS, (v) => set({ kind: v }), { snapBack: true })}
    ${fields}
    <p class="hint">${hint}</p>`;
}

// ── the left column ──────────────────────────────────────────────────────

function glyph(host: Pick<HttpActionsViewHost, "icons">, icon: string, size: number, color: string): TemplateResult {
  return host.icons.render(icon, size, color) ?? html`<span class="ha-glyph-dot" style=${`background:${color}`}></span>`;
}

function actionThumb(host: HttpActionsViewHost, action: HttpAction): TemplateResult {
  const color = action.iconColor ?? DEFAULT_TINT;
  return html`<span class="thumb ha-thumb" style=${`--c:${color}`} aria-hidden="true"><span class="ha-thumb-glyph">${glyph(host, action.icon ?? DEFAULT_ICON, 14, color)}</span></span>`;
}

function actionRow(host: HttpActionsViewHost, action: HttpAction, index: number, count: number, selected: boolean): TemplateResult {
  const name = httpActionLabel(action);
  const pick = () => selectHttp(host, { kind: "action", id: action.id });
  const setup = httpNeedsSetup(action);
  return html`<div class="layer ha-row ${selected ? "hl" : ""}" role="listitem" tabindex="0" data-action=${action.id}
    aria-current=${selected ? "true" : "false"} aria-label=${name} title=${`${name} · ${httpActionSubtitle(action)}`}
    @click=${(e: Event) => { if (!(e.target instanceof Element && e.target.closest("button"))) pick(); }}
    @keydown=${(e: KeyboardEvent) => {
      if (e.target !== e.currentTarget || (e.key !== "Enter" && e.key !== " ")) return;
      e.preventDefault();
      pick();
    }}>
    <span class="grip" aria-hidden="true"></span>
    ${actionThumb(host, action)}
    <span class="name"><b><span class="nm-t">${name}</span></b><small>${httpActionSubtitle(action)}</small></span>
    <span class="right">
      <span class="badges">
        ${setup ? html`<span class="badge ha-need">needs setup</span>` : nothing}
        ${httpNeedsAudio(action) ? html`<span class="badge">voice</span>` : nothing}
      </span>
      <span class="acts">
        <button type="button" class="icon" ?disabled=${host.busy || index === 0} title="Move up" aria-label=${`Move ${name} up`}
          @click=${() => host.edit((d) => moveHttpAction(d, action.id, index - 1))}>${uiIcon("up")}</button>
        <button type="button" class="icon" ?disabled=${host.busy || index === count - 1} title="Move down" aria-label=${`Move ${name} down`}
          @click=${() => host.edit((d) => moveHttpAction(d, action.id, index + 1))}>${uiIcon("down")}</button>
      </span>
    </span>
  </div>`;
}

/** The actions card: every action in the stored order; + Add makes one. */
export function renderActionsCard(host: HttpActionsViewHost): TemplateResult {
  const actions = httpActionList(host.document).map(readHttpAction);
  const selection = httpSelection(host);
  return html`<section class="card lc ha-actions-card" aria-label="Actions" style="--c: var(--wa-lc-layers, #4a7fe8); --thumb-w: 32px; --thumb-h: 22px">
    <div class="lc-head">
      <span class="swatch">${uiIcon("globe")}</span><span class="lc-title">Actions</span>
      <span class="lc-sub" title=${HTTP_ACTIONS_CARD_LINE}>${actions.length}</span>
      <span class="spacer"></span>
      <button type="button" class="lc-btn pri ha-add" aria-label="Add an action" ?disabled=${host.busy}
        title="A new action" @click=${() => addHttpActionTo(host)}>${uiIcon("plus")}<span>Add</span></button>
    </div>
    ${actions.length === 0
      ? html`<div class="lc-note">No actions yet. Add one to send a request from the watch.</div>`
      : html`<div class="layers ha-list" role="list">${actions.map((a, i) => actionRow(host, a, i, actions.length, selection?.kind === "action" && selection.id === a.id))}</div>`}
  </section>`;
}

/** The Globals card: each global's key, and how many actions use it. */
export function renderGlobalsCard(host: HttpActionsViewHost): TemplateResult {
  const globals = httpGlobalList(host.document).map(readHttpGlobal);
  const selection = httpSelection(host);
  return html`<section class="card lc ha-globals-card" aria-label="Globals" style="--c: var(--wa-hue-green); --thumb-w: 0px">
    <div class="lc-head">
      <span class="swatch">${uiIcon("braces")}</span><span class="lc-title">Globals</span>
      <span class="lc-sub" title=${HTTP_GLOBALS_CARD_LINE}>${globals.length}</span>
      <span class="spacer"></span>
      <button type="button" class="lc-btn pri ha-add-global" aria-label="Add a global" ?disabled=${host.busy}
        title="A new global" @click=${() => addHttpGlobalTo(host)}>${uiIcon("plus")}<span>Add</span></button>
    </div>
    ${globals.length === 0
      ? html`<div class="lc-note">${HTTP_GLOBALS_CARD_LINE}</div>`
      : html`<div class="layers ha-list" role="list">${globals.map((g) => {
          const on = selection?.kind === "global" && selection.id === g.id;
          const users = httpGlobalUsers(host.document, g.key.trim()).length;
          const label = g.key.trim() === "" ? "No name" : `{{${g.key.trim()}}}`;
          const pick = () => selectHttp(host, { kind: "global", id: g.id });
          return html`<div class="layer ha-row ha-global-row ${on ? "hl" : ""}" role="listitem" tabindex="0" data-global=${g.id}
            aria-current=${on ? "true" : "false"} aria-label=${label} @click=${pick}
            @keydown=${(e: KeyboardEvent) => {
              if (e.key !== "Enter" && e.key !== " ") return;
              e.preventDefault();
              pick();
            }}>
            <span class="grip" aria-hidden="true"></span><span aria-hidden="true"></span>
            <span class="name"><b><span class="nm-t mono">${label}</span></b><small>${users === 0 ? "Not used yet" : `Used by ${plural(users, "action", "actions")}`}</small></span>
          </div>`;
        })}</div>`}
  </section>`;
}

// ── the cards ────────────────────────────────────────────────────────────

const BADGES: Readonly<Record<string, { color: string; icon: UiIconName }>> = {
  action: { color: SECTION_COLOR.content, icon: "content" },
  request: { color: SECTION_COLOR.tap, icon: "globe" },
  auth: { color: SECTION_COLOR.states, icon: "lock" },
  headers: { color: SECTION_COLOR.place, icon: "list" },
  body: { color: SECTION_COLOR.numbers, icon: "braces" },
  options: { color: SECTION_COLOR.place, icon: "clock" },
  values: { color: SECTION_COLOR.position, icon: "text" },
  reply: { color: SECTION_COLOR.look, icon: "arrow" },
  test: { color: SECTION_COLOR.complication, icon: "tap" },
  global: { color: SECTION_COLOR.look, icon: "braces" },
};

function isOpen(host: Pick<HttpActionsViewHost, "uiState">, section: string): boolean {
  return sectionOpen(host.uiState, FOLD_MODULE, section);
}

function card(host: HttpActionsViewHost, badge: keyof typeof BADGES, title: string, body: () => TemplateResult, extra: { summary?: string; dot?: boolean } = {}): TemplateResult {
  const open = isOpen(host, badge);
  const mark = BADGES[badge]!;
  return sectionCard({
    color: mark.color,
    icon: uiIcon(mark.icon),
    title,
    open,
    onToggle: () => {
      setSectionOpen(host.uiState, FOLD_MODULE, badge, !open);
      host.requestUpdate();
    },
    ...(extra.summary === undefined || extra.summary === "" ? {} : { summary: extra.summary }),
    dot: extra.dot === true,
    id: `${FOLD_MODULE}:${badge}`,
  }, open ? body() : html``);
}

/** The cards drawn in the middle and on the right now, for Collapse all. */
export function httpActionsFolds(host: ViewState): FoldId[] {
  const s = httpSelection(host);
  const sections = s === undefined ? [] : s.kind === "global" ? ["global"] : ["action", "request", "auth", "headers", "body", "options", "values", "reply", "test"];
  return sections.map((section) => ({ module: FOLD_MODULE, section }));
}

// ── the middle: an action's request ──────────────────────────────────────

function urlWarning(url: string): string | undefined {
  const t = url.trim();
  if (t === "" || t.startsWith("{")) return undefined;
  const lower = t.toLowerCase();
  return lower.startsWith("http://") || lower.startsWith("https://") ? undefined : "Add http:// or https://. Without one the request will not send.";
}

function renderHeaderRows(host: HttpActionsViewHost, action: HttpAction, authHeaderId: string | undefined): TemplateResult {
  const rows = action.headers.filter((h) => h.id !== authHeaderId);
  return html`<div class="ha-headers" role="list" aria-label="Headers">
      ${rows.length === 0 ? html`<p class="hint">No headers.</p>` : rows.map((h) => html`<div class="ha-hrow" role="listitem">
        <input type="text" class="mono" .value=${h.name} placeholder="Name" aria-label="Header name"
          @input=${(e: Event) => editRequest(host, action.id, (d) => setHttpHeader(d, action.id, h.id, { name: (e.target as HTMLInputElement).value }), `h:${h.id}:name`)} />
        ${secretBox(host, `${h.name.trim() || "Header"} value`, h.value,
          (v) => editRequest(host, action.id, (d) => setHttpHeader(d, action.id, h.id, { value: v }), `h:${h.id}:value`), `header:${h.id}`, "Value")}
        <button type="button" class="icon ha-remove" title="Remove this header" aria-label=${`Remove ${h.name.trim() || "header"}`}
          @click=${() => editRequest(host, action.id, (d) => removeHttpHeader(d, action.id, h.id))}>${uiIcon("delete")}</button>
      </div>`)}
    </div>
    <div class="ha-acts">
      <button type="button" class="pe-btn" @click=${() => editRequest(host, action.id, (d) => addHttpHeader(d, action.id, host.newId()))}>${uiIcon("plus")}<span>Add a header</span></button>
    </div>
    <p class="hint">Header values stay hidden until shown.</p>`;
}

function renderBody(host: HttpActionsViewHost, action: HttpAction): TemplateResult {
  if (!httpSendsBody(action)) return html`<p class="hint">${HTTP_NO_BODY_TEXT}</p>`;
  const type = action.bodyContentType;
  const contentType = CONTENT_TYPE[type];
  return html`${selectField("Type", type, BODY_TYPES, (v) => editRequest(host, action.id, (d) => setHttpActionBodyType(d, action.id, v)), { snapBack: true })}
    ${type === "audio"
      ? html`<p class="hint ha-audio">${HTTP_AUDIO_TEXT}</p>`
      : html`<label class="field ha-body"><span>Body</span>
          <textarea class="mono" rows="7" spellcheck="false" .value=${action.body ?? ""} placeholder=${BODY_PLACEHOLDER[type]}
            @input=${(e: Event) => editRequest(host, action.id, (d) => setHttpActionBody(d, action.id, (e.target as HTMLTextAreaElement).value), `a:${action.id}:body`)}></textarea></label>`}
    ${contentType === undefined ? nothing : html`<p class="hint">Sends Content-Type: ${contentType}, unless a header sets one.</p>`}`;
}

/** The middle column for an action. */
export function renderActionMiddle(host: HttpActionsViewHost, action: HttpAction): TemplateResult {
  const id = action.id;
  const { headerId: authHeaderId, auth } = httpAuthOf(host, action);
  const warning = urlWarning(action.url);
  const extraHeaders = action.headers.filter((h) => h.id !== authHeaderId).length;
  const body = !httpSendsBody(action) ? "None" : BODY_TYPES.find(([t]) => t === action.bodyContentType)?.[1] ?? "None";
  return html`
    ${card(host, "action", "Action", () => html`<fieldset class="ha-body-set" ?disabled=${host.busy}>
      ${textField("Name", action.name, (v) => host.edit((d) => setHttpActionName(d, id, v), `a:${id}:name`), { placeholder: "My action" })}
      <div class="ha-stack">${symbolField({ icons: host.icons, symbols: host.symbols }, action.icon ?? DEFAULT_ICON,
        (v) => host.edit((d) => setHttpActionIcon(d, id, v === DEFAULT_ICON ? "" : v), `a:${id}:icon`), `ha:icon:${id}`, undefined, "Icon", false)}</div>
      ${colorField("Color", action.iconColor, (v) => host.edit((d) => setHttpActionColor(d, id, v), `a:${id}:color`), true, null)}
      <p class="hint">The icon and color mark the action in lists.</p>
    </fieldset>`, { summary: httpActionLabel(action) })}
    ${card(host, "request", "Request", () => html`<fieldset class="ha-body-set" ?disabled=${host.busy}>
      ${selectField("Method", httpMethodOf(action), HTTP_METHODS.map((m) => [m, m] as [string, string]),
        (v) => editRequest(host, id, (d) => setHttpActionMethod(d, id, v)), { snapBack: true })}
      ${textField("URL", action.url, (v) => editRequest(host, id, (d) => setHttpActionUrl(d, id, v), `a:${id}:url`), { mono: true, placeholder: "https://example.com/api" })}
      ${warning === undefined ? nothing : html`<p class="hint ha-warn">${warning}</p>`}
      ${httpNeedsSetup(action) ? html`<p class="hint">With no URL the watch shows the action as needing setup.</p>` : nothing}
    </fieldset>`, { summary: `${httpMethodOf(action)}${httpNeedsSetup(action) ? ", no URL" : ""}`, dot: httpNeedsSetup(action) })}
    ${card(host, "auth", "Sign-in", () => html`<fieldset class="ha-body-set" ?disabled=${host.busy}>${renderAuth(host, action)}</fieldset>`,
      { summary: HTTP_AUTH_KINDS.find(([k]) => k === auth.kind)?.[1] ?? "None" })}
    ${card(host, "headers", "Headers", () => html`<fieldset class="ha-body-set" ?disabled=${host.busy}>${renderHeaderRows(host, action, authHeaderId)}</fieldset>`,
      { summary: extraHeaders === 0 ? "None" : plural(extraHeaders, "header", "headers") })}
    ${card(host, "body", "Body", () => html`<fieldset class="ha-body-set" ?disabled=${host.busy}>${renderBody(host, action)}</fieldset>`, { summary: body })}
    ${card(host, "options", "Timeout and certificate", () => html`<fieldset class="ha-body-set" ?disabled=${host.busy}>
      ${numberField("Timeout", action.timeout, (v) => host.edit((d) => setHttpActionTimeout(d, id, v), `a:${id}:timeout`),
        { optional: true, min: HTTP_TIMEOUT_MIN, max: HTTP_TIMEOUT_MAX, step: 1, unit: "s", placeholder: String(HTTP_DEFAULT_TIMEOUT), def: null })}
      <p class="hint">${HTTP_TIMEOUT_TEXT}</p>
      ${checkField("Accept a self-signed certificate", action.allowsUntrustedCertificate, (v) => host.edit((d) => setHttpActionUntrusted(d, id, v)))}
      <p class="hint">Only for a server you run whose HTTPS certificate is not publicly trusted.</p>
      ${action.presentsClientCertificate ? html`<p class="hint ha-warn">This action asks for a client certificate. ${HTTP_ACTIONS_CLIENT_CERT_TEXT}</p>` : nothing}
    </fieldset>`, { summary: `${action.timeout === undefined ? HTTP_DEFAULT_TIMEOUT : action.timeout} s${action.allowsUntrustedCertificate ? ", self-signed" : ""}` })}
    <div class="ha-acts">
      <button type="button" class="pe-btn" ?disabled=${host.busy} title="A copy with new ids, named Copy"
        @click=${() => {
          let made: string | undefined;
          host.edit((d) => {
            const out = duplicateHttpAction(d, id, () => host.newId());
            made = out.id;
            return out.document;
          });
          if (made !== undefined) selectHttp(host, { kind: "action", id: made });
        }}>${uiIcon("duplicate")}<span>Duplicate</span></button>
      <button type="button" class="pe-btn pe-danger" ?disabled=${host.busy}
        title="Remove this action. Tiles and menu items that run it stop working."
        @click=${() => host.edit((d) => removeHttpAction(d, id))}>${uiIcon("delete")}<span>Remove</span></button>
    </div>`;
}

// ── the middle: a global ─────────────────────────────────────────────────

export function renderGlobalMiddle(host: HttpActionsViewHost, raw: JsonObject): TemplateResult {
  const g = readHttpGlobal(raw);
  const users = httpGlobalUsers(host.document, g.key.trim());
  const keys = httpGlobalList(host.document).map(readHttpGlobal).filter((o) => o.key.trim() !== "" && o.key.trim() === g.key.trim());
  return html`${card(host, "global", "Global", () => html`<fieldset class="ha-body-set" ?disabled=${host.busy}>
      ${textField("Key", g.key, (v) => host.edit((d) => setHttpGlobalKey(d, g.id, v), `g:${g.id}:key`), { mono: true, placeholder: "haurl" })}
      ${g.key.trim() === "" ? html`<p class="hint ha-warn">A global needs a key before it can be saved.</p>` : nothing}
      ${keys.length > 1 ? html`<p class="hint ha-warn">Another global has this key. Each key must be its own.</p>` : nothing}
      ${secretField(host, "Value", g.value, (v) => host.edit((d) => setHttpGlobalValue(d, g.id, v), `g:${g.id}:value`), `global:${g.id}`, "https://ha.local:8123")}
      <p class="hint">Type ${g.key.trim() === "" ? "{{key}}" : `{{${g.key.trim()}}}`} in a URL, header or body. It is filled in as typed, before the values asked for on the watch.</p>
    </fieldset>`, { summary: g.key.trim() === "" ? "No key" : `{{${g.key.trim()}}}` })}
    <div class="ha-acts">
      <button type="button" class="pe-btn pe-danger" ?disabled=${host.busy}
        title=${users.length === 0 ? "Remove this global" : "Remove this global. The actions that use it send the {{key}} as typed."}
        @click=${() => host.edit((d) => removeHttpGlobal(d, g.id))}>${uiIcon("delete")}<span>Remove</span></button>
    </div>
    <p class="ha-note">${users.length === 0 ? "No action uses it yet." : `Used by ${users.join(", ")}.`}</p>`;
}

// ── the right: values asked for ──────────────────────────────────────────

function variableEditor(host: HttpActionsViewHost, action: HttpAction, v: HttpVariable, unused: boolean): TemplateResult {
  const set = (change: Parameters<typeof setHttpVariable>[3], coalesce?: string) =>
    host.edit((d) => setHttpVariable(d, action.id, v.id, change), coalesce);
  const quick = httpQuickValues(v);
  return html`<div class="ha-var ${unused ? "unused" : ""}" data-key=${v.key}>
    <div class="ha-var-head"><code>{{${v.key}}}</code>
      ${unused ? html`<span class="badge">unused, left out when saved</span>
        <button type="button" class="icon ha-remove" title="Remove" aria-label=${`Remove {{${v.key}}}`}
          @click=${() => host.edit((d) => removeHttpVariable(d, action.id, v.id))}>${uiIcon("delete")}</button>` : nothing}
    </div>
    ${unused ? nothing : html`
      ${textField("Prompt", v.prompt, (p) => set({ prompt: p }, `v:${v.id}:prompt`), { placeholder: "Message" })}
      ${segField("Kind", v.kind, [["text", "Text"], ["number", "Number"]], (k) => set({ kind: k }))}
      <label class="field ha-quick"><span>Quick values</span>
        <textarea rows="3" .value=${v.presetValues.join("\n")} placeholder="One per line"
          @input=${(e: Event) => set({ presetValues: (e.target as HTMLTextAreaElement).value.split("\n") }, `v:${v.id}:presets`)}></textarea></label>
      ${checkField("Only these", v.presetsOnly, (on) => set({ presetsOnly: on }), undefined, { disabled: quick.length === 0 && !v.presetsOnly })}
      <p class="hint">${quick.length === 0 ? "Quick values are offered as one tap choices on the watch. Add one to offer only these." : v.presetsOnly ? "The watch shows only the quick values, with no typing." : "The watch offers the quick values and lets you type too."}</p>`}
  </div>`;
}

function renderValuesAsked(host: HttpActionsViewHost, action: HttpAction): TemplateResult {
  const globals = httpGlobalKeys(host.document);
  const tokens = httpActionTokens(action, globals);
  const unused = httpUnusedVariables(action, globals);
  const missing = tokens.asked.filter((k) => !action.variables.some((v) => v.key === k));
  return html`<p class="hint">${HTTP_TOKEN_HELP}</p>
    ${tokens.global.length === 0 ? nothing : html`<p class="ha-from-globals">${tokens.global.map((k) => html`<code>{{${k}}}</code>`)} <span>from Globals</span></p>`}
    ${tokens.asked.length === 0 && unused.length === 0 ? html`<p class="ha-note">Nothing is asked for. The action runs at once.</p>` : nothing}
    ${httpPromptVariables(action, globals).map((v) => variableEditor(host, action, v, false))}
    ${missing.map((k) => html`<div class="ha-var" data-key=${k}><div class="ha-var-head"><code>{{${k}}}</code><span class="badge ha-need">not set up</span></div>
      <p class="hint">Sent as typed until it is set up.</p>
      <div class="ha-acts"><button type="button" class="pe-btn" @click=${() => editRequest(host, action.id, (d) => d)}>Ask for it on the watch</button></div></div>`)}
    ${unused.map((v) => variableEditor(host, action, v, true))}`;
}

// ── the right: the reply value ───────────────────────────────────────────

function renderReply(host: HttpActionsViewHost, action: HttpAction): TemplateResult {
  const id = action.id;
  const reply = action.reply;
  const source: HttpReplySource | "none" = reply?.source ?? "none";
  const field = reply === undefined ? undefined : HTTP_REPLY_FIELD[reply.source];
  const extra = field === "jsonPath"
    ? html`${textField("JSON path", reply?.jsonPath ?? "", (v) => host.edit((d) => setHttpReplyField(d, id, "jsonPath", v), `r:${id}:path`), { mono: true, placeholder: "result.price" })}
      <p class="hint">Keys joined by dots, a number for an item of a list: data.0.temp. A test offers the paths it finds.</p>`
    : field === "headerName"
      ? textField("Header", reply?.headerName ?? "", (v) => host.edit((d) => setHttpReplyField(d, id, "headerName", v), `r:${id}:header`), { mono: true, placeholder: "X-RateLimit-Remaining" })
      : field === "pattern"
        ? html`${textField("Pattern", reply?.pattern ?? "", (v) => host.edit((d) => setHttpReplyField(d, id, "pattern", v), `r:${id}:pattern`), { mono: true, placeholder: "temperature=([0-9.]+)" })}
          <p class="hint">The first group in brackets, else the whole match.</p>`
        : nothing;
  return html`${selectField("Read", source, REPLY_SOURCES, (v) => host.edit((d) => setHttpReplySource(d, id, v === "none" ? undefined : v)), { snapBack: true })}
    ${extra}
    ${reply === undefined ? html`<p class="hint">Pick what to take from the reply to show on the watch, as a tile's value or in the banner after it runs.</p>`
      : textField("Unit", reply.unit ?? "", (v) => host.edit((d) => setHttpReplyField(d, id, "unit", v), `r:${id}:unit`), { placeholder: "°, $, kWh" })}`;
}

// ── the right: the Test card ─────────────────────────────────────────────

interface TestState {
  values: Record<string, string>;
  running: boolean;
  reply?: HttpActionTestReply;
  error?: string;
  run: number;
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

/** Run the test: the draft's action and globals as they are now. */
export async function runHttpTest(host: HttpActionsViewHost, actionId: string): Promise<void> {
  const raw = findHttpAction(host.document, actionId);
  if (raw === undefined) return;
  const action = readHttpAction(raw);
  const before = httpTestState(host, actionId);
  if (before.running) return;
  const run = before.run + 1;
  const values = httpTestValues(action, httpGlobalKeys(host.document), before.values);
  setTestState(host, actionId, { values: before.values, running: true, run });
  const globals = httpGlobalList(host.document);
  let next: TestState;
  try {
    const reply = await host.test(raw, globals, values);
    next = { values: httpTestState(host, actionId).values, running: false, reply, run };
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
    return selectField(label, value, quick.map((q) => [q, q] as [string, string]), set, { snapBack: true });
  }
  return html`<label class="field"><span>${label}</span>
    <input type="text" inputmode=${v.kind === "number" ? "decimal" : nothing} .value=${value}
      @input=${(e: Event) => set((e.target as HTMLInputElement).value)} /></label>
    ${quick.length === 0 ? nothing : html`<div class="ha-chips" role="group" aria-label=${`Quick values for ${label}`}>
      ${quick.map((q) => html`<button type="button" class="ha-chip ${q === value ? "on" : ""}" aria-pressed=${q === value ? "true" : "false"} @click=${() => set(q)}>${q}</button>`)}
    </div>`}`;
}

function statusTone(reply: HttpActionTestReply): "ok" | "warn" | "err" {
  if (reply.status === null) return "err";
  return reply.status >= 200 && reply.status < 300 ? "ok" : "warn";
}

function renderTestResult(host: HttpActionsViewHost, action: HttpAction, state: TestState): TemplateResult | typeof nothing {
  if (state.error !== undefined) return html`<p class="ha-test-err" role="status">${state.error}</p>`;
  const reply = state.reply;
  if (reply === undefined) return nothing;
  const tone = statusTone(reply);
  const headers = Object.keys(reply.headers ?? {});
  return html`<div class="ha-result" role="status">
    <div class="ha-result-head">
      <span class="ha-status ${tone}"><i class="ha-dot" aria-hidden="true"></i>${reply.status === null ? "No answer" : `HTTP ${reply.status}`}</span>
      <span class="ha-ms">${reply.elapsed_ms} ms</span>
    </div>
    ${reply.error ? html`<p class="ha-test-err">${reply.error}</p>` : nothing}
    ${action.reply === undefined ? nothing : html`<div class="ha-kv"><b>Value</b>${reply.value === null ? html`<span class="ha-muted">Not found</span>` : html`<code>${reply.value}</code>`}</div>`}
    ${reply.snippet === "" ? nothing : html`<div class="ha-kv"><b>Reply</b><code class="ha-snippet">${reply.snippet}</code></div>`}
    ${reply.paths.length === 0 ? nothing : html`<div class="ha-found">
      <b>JSON fields found</b>
      <div class="ha-chips">${reply.paths.map((p) => html`<button type="button" class="ha-chip ha-path ${action.reply?.source === "jsonField" && action.reply.jsonPath === p.path ? "on" : ""}"
        title=${`${p.path} is ${p.value}. Read this field.`} ?disabled=${host.busy}
        @click=${() => host.edit((d) => useHttpReplyPath(d, action.id, p.path))}><code>${p.path}</code><span>${p.value}</span></button>`)}</div>
    </div>`}
    ${headers.length === 0 ? nothing : html`<div class="ha-found">
      <b>Headers</b>
      <div class="ha-chips">${headers.map((name) => html`<button type="button" class="ha-chip" title=${`Read the ${name} header`} ?disabled=${host.busy}
        @click=${() => host.edit((d) => useHttpReplyHeader(d, action.id, name))}><code>${name}</code></button>`)}</div>
    </div>`}
  </div>`;
}

function renderTest(host: HttpActionsViewHost, action: HttpAction): TemplateResult {
  const state = httpTestState(host, action.id);
  const prompts = httpPromptVariables(action, httpGlobalKeys(host.document));
  const setup = httpNeedsSetup(action);
  return html`<p class="hint">${HTTP_TEST_LINE}</p>
    ${prompts.map((v) => testValueField(host, action, v, state))}
    ${httpNeedsAudio(action) ? html`<p class="hint">A test sends no voice clip.</p>` : nothing}
    <div class="ha-acts">
      <button type="button" class="pe-btn pe-primary ha-send" ?disabled=${state.running || setup}
        title=${setup ? "Add a URL first" : "Send it now"} @click=${() => void runHttpTest(host, action.id)}>${state.running ? "Sending…" : "Send"}</button>
    </div>
    ${renderTestResult(host, action, state)}`;
}

/** The right column for an action. */
export function renderActionRight(host: HttpActionsViewHost, action: HttpAction): TemplateResult {
  const asked = httpPromptVariables(action, httpGlobalKeys(host.document)).length;
  const test = httpTestState(host, action.id).reply;
  return html`
    ${card(host, "values", "Values asked for", () => html`<fieldset class="ha-body-set" ?disabled=${host.busy}>${renderValuesAsked(host, action)}</fieldset>`,
      { summary: asked === 0 ? "None" : plural(asked, "value", "values") })}
    ${card(host, "reply", "Reply value", () => html`<fieldset class="ha-body-set" ?disabled=${host.busy}>${renderReply(host, action)}</fieldset>`,
      { summary: REPLY_SOURCES.find(([s]) => s === (action.reply?.source ?? "none"))?.[1] ?? "None" })}
    ${card(host, "test", "Test", () => renderTest(host, action), { summary: test === undefined ? "" : test.status === null ? "No answer" : `HTTP ${test.status}` })}`;
}

// ── the columns' heads ───────────────────────────────────────────────────

function head(host: HttpActionsViewHost, crumbs: TemplateResult): TemplateResult {
  const folds = httpActionsFolds(host);
  const anyOpen = anySectionOpen(host.uiState, folds);
  return html`<div class="insp-head">${crumbs}
    ${folds.length === 0 ? nothing : html`<button class="expand" @click=${() => { setSectionsOpen(host.uiState, folds, !anyOpen); host.requestUpdate(); }}>${anyOpen ? "Collapse all" : "Expand all"}</button>`}
  </div>`;
}

/** The middle column: the picked action's request, or the picked global. */
export function renderHttpMiddle(host: HttpActionsViewHost): TemplateResult {
  const s = httpSelection(host);
  if (s?.kind === "global") {
    const raw = findHttpGlobal(host.document, s.id)!;
    const g = readHttpGlobal(raw);
    return html`${head(host, html`<div class="crumbs"><span class="kchip" style="--k:var(--wa-hue-green)">Global</span><span class="nm mono">${g.key.trim() === "" ? "No key" : `{{${g.key.trim()}}}`}</span></div>`)}
      <div class="insp-body">${renderGlobalMiddle(host, raw)}</div>`;
  }
  if (s?.kind === "action") {
    const action = readHttpAction(findHttpAction(host.document, s.id)!);
    return html`${head(host, html`<div class="crumbs"><span class="kchip" style="--k:#5B8FD4">${httpMethodOf(action)}</span><span class="nm" title=${httpActionLabel(action)}>${httpActionLabel(action)}</span></div>`)}
      <div class="insp-body">${renderActionMiddle(host, action)}</div>`;
  }
  return html`<div class="insp-head"><div class="crumbs"><span class="nm">HTTP actions</span></div></div>
    <div class="insp-body"><p class="ha-note">Add an action to start, or a global for a value several actions share.</p>
      <div class="ha-acts"><button type="button" class="pe-btn pe-primary" ?disabled=${host.busy} @click=${() => addHttpActionTo(host)}>${uiIcon("plus")}<span>Add an action</span></button></div>
    </div>`;
}

/** The right column: what the picked action asks for, its reply value and
 * its test; for a global, a word on how globals work. */
export function renderHttpRight(host: HttpActionsViewHost): TemplateResult {
  const s = httpSelection(host);
  if (s?.kind === "action") {
    const action = readHttpAction(findHttpAction(host.document, s.id)!);
    return html`<div class="insp-head"><div class="crumbs"><span class="nm">When it runs</span></div></div>
      <div class="insp-body">${renderActionRight(host, action)}</div>`;
  }
  return html`<div class="insp-head"><div class="crumbs"><span class="nm">${s?.kind === "global" ? "Globals" : "When it runs"}</span></div></div>
    <div class="insp-body"><p class="ha-note">${s?.kind === "global" ? HTTP_GLOBALS_CARD_LINE : HTTP_TOKEN_HELP}</p></div>`;
}

/** The views' rules, after the shared chrome and the editor's own in the
 * editor's sheet. */
export const httpActionsViewStyles = css`
  .ha-actions-card > .layers, .ha-globals-card > .layers { padding: 6px 8px 8px; overflow: visible; }
  .ha-actions-card > .lc-note, .ha-globals-card > .lc-note { margin: 8px 12px; color: var(--wa-muted); }
  .layer .acts button.icon { display: inline-grid; place-items: center; padding: 0; }
  .layer .acts button.icon:disabled { opacity: .35; cursor: default; }
  .layer .thumb.ha-thumb { display: grid; place-items: center; background: color-mix(in srgb, var(--c, #888) 22%, #000); }
  .layer .thumb .ha-thumb-glyph { display: grid; place-items: center; width: 16px; height: 16px; }
  .layer .thumb .ha-thumb-glyph svg { width: 14px; height: 14px; display: block; }
  .ha-glyph-dot { display: inline-block; width: 8px; height: 8px; border-radius: 50%; }
  .badge.ha-need { border-color: var(--wa-amber-line); color: var(--wa-amber); }
  .mono, .nm-t.mono { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }

  fieldset.ha-body-set { margin: 0; padding: 2px 0 0; border: 0; min-width: 0; display: flex; flex-direction: column; gap: 2px; --wa-lab: 104px; }
  fieldset.ha-body-set .hint, .insp-body .hint { margin: 0 0 4px; }
  .ha-stack .field { grid-template-columns: minmax(0, 1fr); gap: 4px; padding: 2px 0; }
  .ha-note { margin: 10px 2px 2px; font-size: 12.5px; line-height: 1.45; color: var(--wa-muted); }
  .ha-acts { display: flex; flex-wrap: wrap; gap: 6px; padding: 10px 0 2px; }
  .hint.ha-warn { color: var(--wa-amber); }
  .ha-muted { color: var(--wa-muted); }

  /* A secret: a password box with its own Show. */
  .ha-secret { display: flex; align-items: center; gap: 6px; min-width: 0; }
  .ha-secret > input { flex: 1; min-width: 0; }
  input[type=password] {
    font: inherit; font-size: 13px; font-weight: 500; color: var(--wa-ink); min-height: 28px; height: 28px;
    padding: 0 9px; border-radius: 6px; border: 1px solid var(--wa-line-strong); background: var(--wa-field);
  }
  input[type=password]:focus-visible { outline: none; border-color: var(--wa-accent); box-shadow: var(--wa-ring); }
  .ha-secret > input[type=text] { height: 28px; min-height: 28px; padding: 0 9px; font-size: 12px; background: var(--wa-field); }
  button.ha-show {
    flex: none; height: 28px; padding: 0 9px; border-radius: 6px; border: 1px solid var(--wa-line-strong);
    background: transparent; color: var(--wa-muted); font: inherit; font-size: 12px; cursor: pointer;
  }
  button.ha-show:hover { color: var(--wa-ink); background: var(--wa-hover); }
  button.ha-show:focus-visible { outline: none; box-shadow: var(--wa-ring); }

  .ha-headers { display: flex; flex-direction: column; gap: 6px; }
  .ha-hrow { display: grid; grid-template-columns: minmax(0, 2fr) minmax(0, 3fr) auto; gap: 6px; align-items: center; }
  .ha-hrow > input[type=text] { height: 28px; min-height: 28px; padding: 0 9px; font-size: 12px; background: var(--wa-field); }
  button.icon.ha-remove {
    display: inline-grid; place-items: center; width: 28px; height: 28px; padding: 0; border-radius: 6px;
    border: 1px solid var(--wa-line); background: transparent; color: var(--wa-muted); cursor: pointer;
  }
  button.icon.ha-remove:hover { color: var(--wa-need); border-color: var(--wa-line-strong); }
  @container (max-width: 460px) {
    .ha-hrow { grid-template-columns: minmax(0, 1fr) auto; }
    .ha-hrow > .ha-secret { grid-column: 1 / -1; grid-row: 2; }
  }
  .field.ha-body, .field.ha-quick { grid-template-columns: minmax(0, 1fr); }
  .field.ha-body textarea { min-height: 120px; resize: vertical; }

  .ha-var { display: flex; flex-direction: column; gap: 2px; padding: 8px 0; border-top: 1px solid var(--wa-line); }
  .ha-var.unused { opacity: .75; }
  .ha-var-head { display: flex; align-items: center; gap: 8px; min-height: 28px; }
  .ha-var-head code { font-size: 12.5px; }
  .ha-var-head .ha-remove { margin-left: auto; }
  .ha-from-globals { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; margin: 2px 0 6px; font-size: 12px; color: var(--wa-muted); }

  .ha-chips { display: flex; flex-wrap: wrap; gap: 6px; padding: 4px 0; }
  button.ha-chip {
    display: inline-flex; align-items: center; gap: 6px; max-width: 100%; min-height: 26px; padding: 0 9px; border-radius: 13px;
    border: 1px solid var(--wa-line-strong); background: transparent; color: var(--wa-ink); font: inherit; font-size: 12px; cursor: pointer;
  }
  button.ha-chip:hover:not(:disabled) { background: var(--wa-hover); }
  button.ha-chip:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  button.ha-chip.on { border-color: var(--wa-accent); }
  button.ha-chip code { font-size: 11.5px; }
  button.ha-chip.ha-path span { color: var(--wa-muted); max-width: 140px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

  .ha-result { display: flex; flex-direction: column; gap: 8px; margin-top: 8px; padding: 10px; border: 1px solid var(--wa-line); border-radius: 8px; }
  .ha-result-head { display: flex; align-items: center; gap: 10px; }
  .ha-status { display: inline-flex; align-items: center; gap: 6px; font-weight: 600; font-size: 13px; }
  .ha-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--wa-muted); }
  .ha-status.ok .ha-dot { background: var(--wa-green); }
  .ha-status.warn .ha-dot { background: var(--wa-amber); }
  .ha-status.err .ha-dot { background: var(--wa-need); }
  .ha-ms { font-size: 12px; color: var(--wa-muted); font-variant-numeric: tabular-nums; }
  .ha-kv { display: grid; grid-template-columns: 56px minmax(0, 1fr); gap: 8px; align-items: baseline; font-size: 12.5px; }
  .ha-kv b, .ha-found b { font-weight: 500; color: var(--wa-muted); font-size: 12px; }
  .ha-kv code { overflow-wrap: anywhere; }
  .ha-snippet { white-space: pre-wrap; }
  .ha-found { display: flex; flex-direction: column; gap: 2px; }
  .ha-test-err { margin: 6px 0 0; font-size: 12.5px; line-height: 1.4; color: var(--wa-need); }
`;
