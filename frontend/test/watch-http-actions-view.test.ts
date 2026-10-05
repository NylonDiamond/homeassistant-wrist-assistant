// The HTTP actions screen's views, flattened to text: the route and the
// stand-in while the chunk loads, the collection with its method tags and
// its Globals row, the picked action as a request (title row, request bar,
// the tab strip and each tab, the sign-in helper, secrets dotted until
// shown), the response under it with the paths a send found, the Globals
// table, and that no secret reaches the console or the browser's storage.

import { afterEach, describe, expect, it, vi } from "vitest";

import type { HassLike, HttpActionTestReply } from "../src/ha-api.js";
import { SymbolBrowser } from "../src/symbols.js";
import { HttpActionsDraft, saveHttpActionsDraft } from "../src/watch-http-actions/draft.js";
import {
  WATCH_HTTP_ACTIONS_PATH,
  isWatchHttpActionsRoute,
  renderWatchHttpActionsView,
} from "../src/watch-http-actions/hook.js";
import {
  HTTP_ACTIONS_CLIENT_CERT_TEXT,
  HTTP_AUTH_HEADER_ID,
  HTTP_TOKEN_HELP,
  type HttpActionsDoc,
  findHttpAction,
  httpAuthNone,
  httpGlobalList,
  readHttpAction,
  readHttpGlobal,
  setHttpActionMethod,
} from "../src/watch-http-actions/model.js";
import {
  HTTP_AUDIO_TEXT,
  HTTP_NO_BODY_TEXT,
  HTTP_NO_URL_TEXT,
  HTTP_SELF_SIGNED_TEXT,
  HTTP_TABS,
  HTTP_TEST_LINE,
  HTTP_TIMEOUT_TEXT,
  type HttpActionsViewHost,
  addHttpActionTo,
  addHttpGlobalTo,
  httpAuthOf,
  httpMethodTag,
  httpReplyTab,
  httpSelection,
  httpTab,
  httpTestState,
  httpTestValues,
  renderHttpList,
  renderHttpMain,
  runHttpTest,
  secretShown,
  selectHttp,
  setHttpAuthOf,
  setHttpReplyTab,
  setHttpTab,
  httpBodyMode,
  httpBodyShown,
  httpBodyWrap,
} from "../src/watch-http-actions/view.js";

const flat = (v: unknown): string => {
  if (Array.isArray(v)) return v.map(flat).join("");
  if (v !== null && typeof v === "object" && "strings" in v && "values" in v) {
    const r = v as { strings: readonly string[]; values: unknown[] };
    return r.strings.map((s, i) => s + (i < r.values.length ? flat(r.values[i]) : "")).join("");
  }
  return typeof v === "string" || typeof v === "number" || typeof v === "boolean" ? String(v) : "";
};

type Handler = { at: number; fn: (e: unknown) => void };

/** Every `@<event>` handler a template holds, with where it sits in the
 * flattened text. */
function handlers(v: unknown, event: string, out: Handler[] = [], seen = { length: 0 }): Handler[] {
  if (Array.isArray(v)) {
    for (const x of v) handlers(x, event, out, seen);
    return out;
  }
  if (v !== null && typeof v === "object" && "strings" in v && "values" in v) {
    const r = v as { strings: readonly string[]; values: unknown[] };
    const attr = new RegExp(`@${event}=$`);
    r.strings.forEach((s, i) => {
      seen.length += s.length;
      if (i >= r.values.length) return;
      const value = r.values[i];
      if (attr.test(s) && typeof value === "function") out.push({ at: seen.length, fn: value as (e: unknown) => void });
      else handlers(value, event, out, seen);
    });
    return out;
  }
  if (typeof v === "string" || typeof v === "number" || typeof v === "boolean") seen.length += String(v).length;
  return out;
}

/** Press the first button whose own text, up to its closing tag, holds
 * `label`. */
function press(tpl: unknown, label: string): void {
  const text = flat(tpl);
  const hit = handlers(tpl, "click").find((c) => {
    const rest = text.slice(c.at);
    const own = rest.slice(0, rest.indexOf("</button>"));
    return !own.includes("<button") && !own.includes("<div") && own.includes(label);
  });
  if (hit === undefined) throw new Error(`no button for ${label}`);
  hit.fn({ preventDefault() {}, button: 0 });
}

/** The `@<event>` handlers of every `<tag>` whose own opening tag, up to the
 * handler, holds `mark`, in order. */
function tagHandlers(tpl: unknown, event: string, mark: string, tags = ["<input"]): Handler["fn"][] {
  const text = flat(tpl);
  return handlers(tpl, event).filter((c) => {
    const start = Math.max(...tags.map((t) => text.lastIndexOf(t, c.at)));
    const own = text.slice(start, c.at);
    return start >= 0 && !own.includes(">") && own.includes(mark);
  }).map((c) => c.fn);
}

const inputHandlers = (tpl: unknown, event: string, mark: string) => tagHandlers(tpl, event, mark);

/** Press the first button (or row drawn as one) whose opening tag holds
 * `mark`: a class, an aria-label. */
function pressTag(tpl: unknown, mark: string): void {
  const hit = tagHandlers(tpl, "click", mark, ["<button", "<div"])[0];
  if (hit === undefined) throw new Error(`no button marked ${mark}`);
  hit({ preventDefault() {}, button: 0, target: null });
}

const typed = (value: string) => ({ target: { value }, preventDefault() {} });

const NO_ICONS = { render: () => undefined, available: () => false, names: () => [] } as unknown as HttpActionsViewHost["icons"];

const A = "AAAAAAAA-0000-4000-8000-000000000001";
const B = "BBBBBBBB-0000-4000-8000-000000000002";
const SECRET = "tok-9f8e7d";

const DOC: HttpActionsDoc = {
  actions: [
    {
      body: `{"room":"{{room}}"}`, bodyContentType: "json",
      headers: [{ id: "H1", name: "X-Trace", value: "{{token}}" }],
      id: A, method: "POST", name: "Lights", presentsClientCertificate: true,
      responseConfig: { jsonPath: "state", source: "jsonField" },
      url: "{{haurl}}/api/lights",
      variables: [{ id: "V1", key: "room", kind: "text", presetValues: ["Kitchen", "Hall"], presetsOnly: true, prompt: "Room" }],
    },
    { bodyContentType: "none", headers: [], id: B, method: "GET", name: "", url: "", variables: [] },
  ],
  globalVariables: [
    { id: "G1", key: "haurl", value: "http://ha.local:8123" },
    { id: "G2", key: "token", value: SECRET },
  ],
  schemaVersion: 1,
};

const HASS = { states: {}, user: { is_admin: true } } as unknown as HassLike;

function host(document: HttpActionsDoc = DOC, reply?: HttpActionTestReply | Error) {
  let n = 0;
  const sent: { action: Record<string, unknown>; globals: unknown[]; values: Record<string, string> }[] = [];
  const h = {
    hass: HASS,
    icons: NO_ICONS,
    symbols: new SymbolBrowser(() => undefined),
    document,
    busy: false,
    uiState: new Map<string, unknown>(),
    edits: 0,
    sent,
    edit(change: (d: HttpActionsDoc) => HttpActionsDoc) {
      const next = change(h.document);
      if (next === h.document) return false;
      h.document = next;
      h.edits++;
      return true;
    },
    endCoalesce() {},
    requestUpdate() {},
    test: async (action: Record<string, unknown>, globals: unknown[], values: Record<string, string>) => {
      sent.push({ action, globals, values });
      if (reply instanceof Error) throw reply;
      return reply ?? { status: 200, value: "on", snippet: "{}", error: null, headers: {}, paths: [], elapsed_ms: 12 };
    },
    newId: () => `NEW-${++n}`,
  };
  return h;
}

/** The main pane with `tab` open. */
function tabText(h: ReturnType<typeof host>, tab: (typeof HTTP_TABS)[number]): string {
  setHttpTab(h, tab);
  return flat(renderHttpMain(h));
}

const tick = () => new Promise((r) => setTimeout(r, 0));

const REPLY: HttpActionTestReply = {
  status: 200, value: "on", snippet: `{"state":"on","data":[{"temp":21}]}`, error: null,
  headers: { "Content-Type": "application/json", "X-Left": "41" },
  paths: [{ path: "state", value: "on" }, { path: "data.0.temp", value: "21" }],
  elapsed_ms: 87,
};

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("the route and the stand-in", () => {
  it("answers to /http-actions, with nothing after it read", () => {
    const route = (path: string) => ({ prefix: "/wrist-assistant", path });
    expect(WATCH_HTTP_ACTIONS_PATH).toBe("/http-actions");
    expect(isWatchHttpActionsRoute(route("/http-actions"))).toBe(true);
    expect(isWatchHttpActionsRoute(route("/http-actions/w1"))).toBe(true);
    expect(isWatchHttpActionsRoute(route("/http-actionsx"))).toBe(false);
    expect(isWatchHttpActionsRoute(route("/pages"))).toBe(false);
  });

  it("draws the editor once its chunk is in, handed no watch", async () => {
    await import("../src/watch-http-actions/http-actions-editor.js");
    const text = flat(renderWatchHttpActionsView({ hass: HASS, owners: [], narrow: false, icons: NO_ICONS, iconsTick: 0, onLoaded: () => undefined }));
    expect(text).toContain("<wa-http-actions-editor");
    expect(text).not.toContain("ownerId");
    expect(text).not.toContain("shellOwnsWatch");
  });

  it("keeps the collection pane beside a main pane wide enough for a request", async () => {
    const { fitHttpListWidth } = await import("../src/watch-http-actions/http-actions-editor.js");
    expect(fitHttpListWidth(0, 280)).toBe(280);
    expect(fitHttpListWidth(1600, 280)).toBe(280);
    expect(fitHttpListWidth(1600, 9000)).toBe(520);
    expect(fitHttpListWidth(800, 280)).toBe(280);
    expect(fitHttpListWidth(760, 400)).toBe(240);
    expect(fitHttpListWidth(600, 280)).toBe(200);
  });
});

describe("the collection", () => {
  it("lists each action with its method tag, an action with no URL marked, and one Globals row with its count", () => {
    const h = host();
    const list = flat(renderHttpList(h));
    expect(list).toContain("Lights");
    expect(list).toContain("POST · {{haurl}}/api/lights");
    expect(list).toContain("Untitled action");
    expect(list).toContain("GET · no URL yet");
    expect(list.match(/>needs setup</g)).toHaveLength(1);
    expect(list).toMatch(/class="ha-mtag m-post"[^>]*>POST</);
    expect(list).toMatch(/class="ha-mtag m-get"[^>]*>GET</);
    expect(list).toMatch(/Globals<\/span>\s*<span class="ha-count">2</);
    // Not one global's value is in the list.
    expect(list).not.toContain(SECRET);
    expect(list).not.toContain("ha.local");
  });

  it("tags each verb in a fixed short word and colour", () => {
    expect(httpMethodTag("GET")).toEqual({ text: "GET", tone: "get" });
    expect(httpMethodTag("post")).toEqual({ text: "POST", tone: "post" });
    expect(httpMethodTag("PUT")).toEqual({ text: "PUT", tone: "put" });
    expect(httpMethodTag("PATCH")).toEqual({ text: "PATCH", tone: "patch" });
    expect(httpMethodTag("DELETE")).toEqual({ text: "DEL", tone: "del" });
    expect(httpMethodTag("OPTIONS")).toEqual({ text: "OPTIO", tone: "other" });
    // The request bar's method wears the same tone as the list.
    const h = host(setHttpActionMethod(DOC, A, "DELETE"));
    expect(flat(renderHttpMain(h))).toMatch(/<select class="ha-method m-del"/);
  });

  it("adds an action and picks it, and adds a global into the Globals table", () => {
    const h = host();
    expect(httpSelection(h)).toEqual({ kind: "action", id: A });
    const id = addHttpActionTo(h);
    expect(readHttpAction(findHttpAction(h.document, id)!).name).toBe("New action");
    expect(httpSelection(h)).toEqual({ kind: "action", id });
    const g = addHttpGlobalTo(h);
    expect(httpSelection(h)).toEqual({ kind: "globals" });
    expect(httpGlobalList(h.document).map(readHttpGlobal).find((x) => x.id === g)?.key).toBe("value");
    const text = flat(renderHttpMain(h));
    expect(text).toContain(`data-global=${g}`);
    expect(text).toContain(".value=value");
  });

  it("opens the Globals table from its row, and moves the actions up and down", () => {
    const h = host();
    pressTag(renderHttpList(h), "Move Lights down");
    expect((h.document.actions as { id: string }[]).map((a) => a.id)).toEqual([B, A]);
    pressTag(renderHttpList(h), "ha-globals-item");
    expect(httpSelection(h)).toEqual({ kind: "globals" });
    expect(flat(renderHttpList(h))).toMatch(/ha-globals-item on" role="button"/);
  });

  it("starts calm with nothing to pick", () => {
    const h = host({ actions: [], globalVariables: [], schemaVersion: 1 });
    const text = flat(renderHttpMain(h));
    expect(text).toContain("No HTTP actions yet.");
    expect(text).toContain("Add an action");
    press(renderHttpMain(h), "Add an action");
    expect(httpSelection(h)?.kind).toBe("action");
  });
});

describe("the request", () => {
  it("draws the title row and the request bar on one line, and reaches every field through the tabs", () => {
    const h = host();
    const main = flat(renderHttpMain(h));
    expect(main).toMatch(/class="ha-name" \.value=Lights/);
    expect(main).toContain(">Duplicate</span>");
    expect(main).toContain(">Remove</span>");
    expect(main).toMatch(/<div class="ha-reqbar">\s*<div class="ha-reqbox">\s*<select class="ha-method/);
    expect(main).toMatch(/ha-url mono" \.value=\{\{haurl\}\}\/api\/lights/);
    for (const method of ["GET", "POST", "PUT", "PATCH", "DELETE"]) expect(main).toContain(`<option value=${method}`);
    for (const tab of ["Headers", "Auth", "Body", "Prompts", "Reply value", "Settings"]) expect(main).toMatch(new RegExp(`role="tab"[^>]*>${tab}`));

    expect(tabText(h, "headers")).toContain("X-Trace");
    expect(tabText(h, "auth")).toContain(">Bearer token</option>");
    const body = tabText(h, "body");
    for (const type of ["None", "JSON", "Form", "Text", "Voice clip"]) expect(body).toContain(`>${type}</option>`);
    expect(body).toContain("Sends Content-Type: application/json, unless a header sets one.");
    expect(body).toContain(`"room":"{{room}}"`);
    expect(tabText(h, "prompts")).toContain("{{room}}");
    expect(tabText(h, "reply")).toContain("JSON path");
    const settings = tabText(h, "settings");
    for (const part of ["Timeout", HTTP_TIMEOUT_TEXT, "Accept a self-signed certificate", HTTP_SELF_SIGNED_TEXT, HTTP_ACTIONS_CLIENT_CERT_TEXT]) {
      expect(settings, part).toContain(part);
    }
  });

  it("keeps the icon and color in a popover off the title row", () => {
    const h = host();
    expect(flat(renderHttpMain(h))).not.toContain("ha-look-pop");
    pressTag(renderHttpMain(h), "ha-look-btn");
    const text = flat(renderHttpMain(h));
    expect(text).toContain("ha-look-pop");
    expect(text).toContain("Color");
    press(renderHttpMain(h), "Done");
    expect(flat(renderHttpMain(h))).not.toContain("ha-look-pop");
  });

  it("switches tabs from the strip, marks the open one, and remembers it for the visit", () => {
    const h = host();
    expect(httpTab(h)).toBe("headers");
    let text = flat(renderHttpMain(h));
    expect(text).toMatch(/role="tab" class="ha-tab on" id=ha-tab-headers\s+aria-selected=true/);
    expect(text).toContain(`role="tablist"`);
    expect(text).toMatch(/role="tabpanel" id="ha-tab-panel" aria-labelledby=ha-tab-headers/);
    press(renderHttpMain(h), "Body");
    expect(httpTab(h)).toBe("body");
    text = flat(renderHttpMain(h));
    expect(text).toMatch(/id=ha-tab-body\s+aria-selected=true/);
    expect(text).toMatch(/id=ha-tab-headers\s+aria-selected=false/);
    expect(text).toContain("ha-tabbody tab-body");
    // Another action opens on the same tab.
    selectHttp(h, { kind: "action", id: B });
    expect(httpTab(h)).toBe("body");
    expect(flat(renderHttpMain(h))).toContain("ha-tabbody tab-body");
    // So does the screen after the Globals table.
    selectHttp(h, { kind: "globals" });
    selectHttp(h, { kind: "action", id: A });
    expect(httpTab(h)).toBe("body");
    // Counts and marks on the strip.
    selectHttp(h, { kind: "action", id: A });
    text = flat(renderHttpMain(h));
    expect(text).toMatch(/>Headers<span class="ha-tab-n">1</);
    expect(text).toMatch(/>Prompts<span class="ha-tab-n">1</);
    expect(text).toMatch(/>Body<i class="ha-tab-dot"/);
    expect(text).toMatch(/>Reply value<i class="ha-tab-dot"/);
    expect(text).not.toMatch(/>Auth<i class="ha-tab-dot"/);
  });

  it("moves along the tab strip with the arrow keys", () => {
    const h = host();
    const main = renderHttpMain(h);
    const text = flat(main);
    const strip = handlers(main, "keydown").find((k) => text.lastIndexOf(`role="tablist"`, k.at) > text.lastIndexOf("<input", k.at))!;
    const focusable = { querySelectorAll: () => [] };
    strip.fn({ key: "ArrowRight", preventDefault() {}, currentTarget: focusable });
    expect(httpTab(h)).toBe("auth");
    strip.fn({ key: "ArrowLeft", preventDefault() {}, currentTarget: focusable });
    strip.fn({ key: "ArrowLeft", preventDefault() {}, currentTarget: focusable });
    expect(httpTab(h)).toBe("settings");
    strip.fn({ key: "Home", preventDefault() {}, currentTarget: focusable });
    expect(httpTab(h)).toBe("headers");
  });

  it("offers no body on a verb with none, and a voice clip with nothing to type", () => {
    const h = host(setHttpActionMethod(DOC, A, "GET"));
    expect(tabText(h, "body")).toContain(HTTP_NO_BODY_TEXT);
    expect(flat(renderHttpMain(h))).not.toMatch(/>Body<i class="ha-tab-dot"/);
    h.document = { ...DOC, actions: [{ ...(DOC.actions as Record<string, unknown>[])[0], bodyContentType: "audio", body: undefined }, (DOC.actions as unknown[])[1]] };
    const text = tabText(h, "body");
    expect(text).toContain(HTTP_AUDIO_TEXT);
    expect(HTTP_AUDIO_TEXT).toContain("30 seconds");
    expect(text).not.toContain("<textarea");
  });

  it("warns on a URL with no scheme, and on no URL at all", () => {
    const h = host();
    selectHttp(h, { kind: "action", id: B });
    expect(flat(renderHttpMain(h))).toContain(HTTP_NO_URL_TEXT);
    h.document = { ...DOC, actions: [{ ...(DOC.actions as Record<string, unknown>[])[0], url: "ha.local/api" }] };
    selectHttp(h, { kind: "action", id: A });
    expect(flat(renderHttpMain(h))).toContain("Add http:// or https://. Without one the request will not send.");
  });

  it("dots every header value and global value until its Show is pressed", () => {
    const h = host();
    let text = flat(renderHttpMain(h));
    expect(text).toMatch(/<input type=password class="mono" \.value=\{\{token\}\}/);
    expect(text).toContain(">Show</button>");
    expect(secretShown(h, "header:H1")).toBe(false);
    press(renderHttpMain(h), "Show");
    expect(secretShown(h, "header:H1")).toBe(true);
    text = flat(renderHttpMain(h));
    expect(text).toMatch(/<input type=text class="mono" \.value=\{\{token\}\}/);
    expect(text).toContain(">Hide</button>");

    selectHttp(h, { kind: "globals" });
    text = flat(renderHttpMain(h));
    expect(text).toMatch(new RegExp(`<input type=password class="mono" \\.value=${SECRET}`));
    expect(text).not.toMatch(new RegExp(`type=text[^>]*${SECRET}`));
  });

  it("writes the sign-in helper's header first, with the phone's id, keeps to it while typing, and marks it in Headers", () => {
    const h = host();
    const lights = () => readHttpAction(findHttpAction(h.document, A)!);
    expect(httpAuthOf(h, lights()).auth.kind).toBe("none");
    // Bearer chosen, no token yet: nothing written, the choice kept.
    setHttpAuthOf(h, lights(), httpAuthNone("bearer"));
    expect(lights().headers.map((h) => h.id)).toEqual(["H1"]);
    expect(httpAuthOf(h, lights()).auth.kind).toBe("bearer");
    expect(flat(renderHttpMain(h))).toMatch(/>Auth<i class="ha-tab-dot"/);
    setHttpAuthOf(h, lights(), { ...httpAuthNone("bearer"), token: SECRET });
    expect(lights().headers[0]).toEqual({ id: HTTP_AUTH_HEADER_ID, name: "Authorization", value: `Bearer ${SECRET}` });
    // An API key under a name the reader would not know stays in the helper.
    setHttpAuthOf(h, lights(), { ...httpAuthNone("apiKey"), headerName: "X-Api-Key", apiKeyValue: "k" });
    setHttpAuthOf(h, lights(), { ...httpAuthNone("apiKey"), headerName: "X-My-Key", apiKeyValue: "k" });
    expect(lights().headers[0]).toEqual({ id: HTTP_AUTH_HEADER_ID, name: "X-My-Key", value: "k" });
    expect(httpAuthOf(h, lights())).toMatchObject({ auth: { kind: "apiKey", headerName: "X-My-Key" }, headerId: HTTP_AUTH_HEADER_ID });
    // The helper's header is in the table, marked as the Auth tab's and
    // dotted, never as a box to edit there.
    setHttpTab(h, "headers");
    const text = flat(renderHttpMain(h));
    expect(text).toContain("X-Trace");
    expect(text).not.toMatch(/value=X-My-Key placeholder="Name"/);
    expect(text).toMatch(/ha-auth-row[\s\S]*X-My-Key[\s\S]*••••••••[\s\S]*>Auth<\/button>/);
    expect(text).toMatch(/>Headers<span class="ha-tab-n">2</);
    pressTag(renderHttpMain(h), "ha-from-auth");
    expect(httpTab(h)).toBe("auth");
  });

  it("adds and removes a header from the table", () => {
    const h = host();
    press(renderHttpMain(h), "Add header");
    expect(readHttpAction(findHttpAction(h.document, A)!).headers.map((x) => x.id)).toEqual(["H1", "NEW-1"]);
    pressTag(renderHttpMain(h), "ha-remove");
    expect(readHttpAction(findHttpAction(h.document, A)!).headers.map((x) => x.id)).toEqual(["NEW-1"]);
  });

  it("asks for a new token's value once it is typed in a request field", () => {
    const h = host();
    // A sign-in token that is a {{key}} becomes a value asked for.
    setHttpAuthOf(h, readHttpAction(findHttpAction(h.document, A)!), { ...httpAuthNone("bearer"), token: "{{pin}}" });
    expect(readHttpAction(findHttpAction(h.document, A)!).variables.map((v) => v.key)).toEqual(["room", "pin"]);
    // Typed in the URL, the same.
    const url = inputHandlers(renderHttpMain(h), "input", "ha-url")[0]!;
    url(typed("{{haurl}}/api/{{zone}}"));
    expect(readHttpAction(findHttpAction(h.document, A)!).variables.map((v) => v.key)).toContain("zone");
    expect(tabText(h, "prompts")).toContain("{{zone}}");
  });

  it("says how {{key}} works, names the globals used, and edits the values asked for, in the Prompts tab", () => {
    const text = tabText(host(), "prompts");
    expect(text).toContain(HTTP_TOKEN_HELP);
    expect(HTTP_TOKEN_HELP).toContain("filled in from Globals");
    expect(HTTP_TOKEN_HELP).toContain("asked for on the watch");
    expect(HTTP_TOKEN_HELP).toContain("letters, digits and underscores");
    expect(text).toContain("<code>{{haurl}}</code><code>{{token}}</code> <span>from Globals</span>");
    expect(text).toContain("{{room}}");
    expect(text).toContain("Quick values");
    expect(text).toContain("Only these");
  });

  it("picks what the reply value reads in its own tab", () => {
    const text = tabText(host(), "reply");
    for (const source of ["Status code", "Body text", "JSON field", "Header", "Regex"]) expect(text).toContain(`>${source}</option>`);
    expect(text).toContain("JSON path");
    expect(text).toContain("Unit");
  });
});

describe("the response", () => {
  it("says what Send does before a send, with a box for each value asked for", () => {
    const text = flat(renderHttpMain(host()));
    expect(text).toContain(HTTP_TEST_LINE);
    expect(text).toMatch(/Test values[\s\S]*Room[\s\S]*<option value=Kitchen/);
  });

  it("sends the draft action with the draft globals and a value for each prompt, and shows status, time, value, body, headers and paths", async () => {
    const h = host(DOC, REPLY);
    // The quick value stands in for a value not typed, as on the watch.
    expect(httpTestValues(readHttpAction(findHttpAction(h.document, A)!), new Set(["haurl", "token"]), {})).toEqual({ room: "Kitchen" });
    await runHttpTest(h, A);
    expect(h.sent).toHaveLength(1);
    expect(h.sent[0]!.action).toBe(findHttpAction(h.document, A));
    expect(h.sent[0]!.globals).toEqual(DOC.globalVariables);
    expect(h.sent[0]!.values).toEqual({ room: "Kitchen" });
    expect(httpTestState(h, A).running).toBe(false);
    let text = flat(renderHttpMain(h));
    expect(text).toMatch(/class="ha-status ok">HTTP 200</);
    expect(text).toContain("87 ms");
    expect(text).toContain("<code>on</code>");
    expect(httpReplyTab(h)).toBe("body");
    expect(text).toContain(`<span class=j-key>"state"</span>: <span class=j-str>"on"</span>,`);
    expect(text).toMatch(/>Headers<span class="ha-tab-n">2</);
    expect(text).toMatch(/>Paths<span class="ha-tab-n">2</);

    setHttpReplyTab(h, "headers");
    text = flat(renderHttpMain(h));
    expect(text).toContain("<code>X-Left</code><span class=\"mono ha-rval\">41</span>");
    press(renderHttpMain(h), "Use");
    expect(readHttpAction(findHttpAction(h.document, A)!).reply).toEqual({ source: "header", headerName: "Content-Type" });

    setHttpReplyTab(h, "paths");
    text = flat(renderHttpMain(h));
    expect(text).toContain("<code>data.0.temp</code><span class=\"mono ha-rval\">21</span>");
  });

  it("formats a JSON body, shows it as sent on Raw, and falls back to the short line of an older integration", async () => {
    const body = `{"state":"on","data":[{"temp":21}]}`;
    const h = host(DOC, { ...REPLY, body, body_size: body.length, body_binary: false, body_cut: false });
    await runHttpTest(h, A);
    expect(httpBodyShown(h, { ...REPLY, body }).text).toBe(
      `{\n  "state": "on",\n  "data": [\n    {\n      "temp": 21\n    }\n  ]\n}`,
    );
    const drawn = flat(renderHttpMain(h));
    expect(drawn).toContain("Pretty");
    expect(drawn).toContain("Raw");
    expect(drawn).toContain("Wrap");
    expect(drawn).toContain("Copy");
    expect(drawn).toContain("JSON");
    h.uiState.set("ha:bmode", "raw");
    expect(httpBodyMode(h)).toBe("raw");
    expect(httpBodyShown(h, { ...REPLY, body }).text).toBe(body);
    h.uiState.set("ha:bwrap", false);
    expect(httpBodyWrap(h)).toBe(false);
    expect(flat(renderHttpMain(h))).toContain("nowrap");
    // No body field: the watch's short line stands in, and says so.
    const old = host(DOC, REPLY);
    await runHttpTest(old, A);
    expect(httpBodyShown(old, REPLY).raw).toBe(REPLY.snippet);
    expect(flat(renderHttpMain(old))).toContain("first line only");
    // Not text: no text, one plain line.
    const bin = host(DOC, { ...REPLY, body: "", body_size: 2048, body_binary: true });
    await runHttpTest(bin, A);
    expect(flat(renderHttpMain(bin))).toContain("The body is not text (2.0 KB).");
  });

  it("writes a picked path into the reply value", async () => {
    const h = host(DOC, REPLY);
    await runHttpTest(h, A);
    setHttpReplyTab(h, "paths");
    press(renderHttpMain(h), "data.0.temp");
    expect(readHttpAction(findHttpAction(h.document, A)!).reply).toEqual({ source: "jsonField", jsonPath: "data.0.temp" });
    expect(flat(renderHttpMain(h))).toMatch(/ha-path on"[^>]*>[\s\S]*?data\.0\.temp[\s\S]*?Reply value</);
    setHttpTab(h, "reply");
    expect(flat(renderHttpMain(h))).toMatch(/\.value=data\.0\.temp/);
  });

  it("sends from the Send button and from Enter in the URL", async () => {
    const h = host(DOC, REPLY);
    press(renderHttpMain(h), "Send");
    expect(httpTestState(h, A).running).toBe(true);
    expect(flat(renderHttpMain(h))).toMatch(/ha-send busy" \?disabled=true\s+aria-busy=true[\s\S]*?>Sending…<\/button>/);
    await tick();
    expect(h.sent).toHaveLength(1);
    const enter = inputHandlers(renderHttpMain(h), "keydown", "ha-url")[0]!;
    let prevented = false;
    enter({ key: "Enter", isComposing: false, preventDefault() { prevented = true; } });
    await tick();
    expect(prevented).toBe(true);
    expect(h.sent).toHaveLength(2);
    // Other keys type as usual.
    enter({ key: "a", isComposing: false, preventDefault() { throw new Error("held"); } });
    await tick();
    expect(h.sent).toHaveLength(2);
  });

  it("says plainly when there was no answer, or the integration cannot test", async () => {
    const none = host(DOC, { status: null, value: null, snippet: "", error: "Could not reach the server.", headers: {}, paths: [], elapsed_ms: 10_000 });
    await runHttpTest(none, A);
    const text = flat(renderHttpMain(none));
    expect(text).toMatch(/class="ha-status err">No answer</);
    expect(text).toContain("Could not reach the server.");
    const old = host(DOC, Object.assign(new Error("Unknown command."), { code: "unknown_command" }));
    await runHttpTest(old, A);
    expect(flat(renderHttpMain(old))).toContain("This version of the integration cannot test an action. Update it to test here.");
  });

  it("does not send an action with no URL, from the button or from Enter", async () => {
    const h = host();
    selectHttp(h, { kind: "action", id: B });
    expect(flat(renderHttpMain(h))).toMatch(/ha-send [^"]*" \?disabled=true/);
    inputHandlers(renderHttpMain(h), "keydown", "ha-url")[0]!({ key: "Enter", isComposing: false, preventDefault() {} });
    await runHttpTest(h, B);
    expect(h.sent).toHaveLength(0);
  });
});

describe("the Globals table", () => {
  it("lists every global with its use, and edits two of them with no selection between", () => {
    const h = host();
    selectHttp(h, { kind: "globals" });
    let text = flat(renderHttpMain(h));
    expect(text).toMatch(/role="columnheader">Key<[\s\S]*role="columnheader">Value<[\s\S]*role="columnheader">Used by</);
    expect(text).toContain(`data-global=G1`);
    expect(text).toContain(`data-global=G2`);
    expect(text).toContain("title=Used by Lights.>1 action");
    const keys = inputHandlers(renderHttpMain(h), "input", `aria-label="Key"`);
    expect(keys).toHaveLength(2);
    keys[0]!(typed("base_url"));
    inputHandlers(renderHttpMain(h), "input", `aria-label="Key"`)[1]!(typed("api_token"));
    expect(httpGlobalList(h.document).map(readHttpGlobal).map((g) => g.key)).toEqual(["base_url", "api_token"]);
    const values = inputHandlers(renderHttpMain(h), "input", "data-secret=global:");
    expect(values).toHaveLength(2);
    values[0]!(typed("http://new"));
    inputHandlers(renderHttpMain(h), "input", "data-secret=global:")[1]!(typed("t2"));
    expect(httpGlobalList(h.document).map(readHttpGlobal).map((g) => g.value)).toEqual(["http://new", "t2"]);
    expect(httpSelection(h)).toEqual({ kind: "globals" });
    text = flat(renderHttpMain(h));
    // No action names these keys now.
    expect(text.match(/Not used yet/g)).toHaveLength(2);
  });

  it("keeps the key rules: one key each, and none left empty", () => {
    const h = host();
    selectHttp(h, { kind: "globals" });
    inputHandlers(renderHttpMain(h), "input", `aria-label="Key"`)[1]!(typed("haurl"));
    expect(flat(renderHttpMain(h)).match(/Another global has this key\. Each key must be its own\./g)).toHaveLength(2);
    inputHandlers(renderHttpMain(h), "input", `aria-label="Key"`)[1]!(typed(""));
    expect(flat(renderHttpMain(h))).toContain("A global needs a key before it can be saved.");
  });

  it("adds a global as the table's last row and removes one", () => {
    const h = host();
    selectHttp(h, { kind: "globals" });
    press(renderHttpMain(h), "Add global");
    expect(httpGlobalList(h.document)).toHaveLength(3);
    expect(httpSelection(h)).toEqual({ kind: "globals" });
    pressTag(renderHttpMain(h), "ha-remove");
    expect(httpGlobalList(h.document).map(readHttpGlobal).map((g) => g.id)).toEqual(["G2", "NEW-1"]);
  });
});

describe("secrets stay in the draft", () => {
  it("writes none to the console or the browser's storage, through edits, drawing, a test and a save", async () => {
    const stored: string[] = [];
    const storage = { getItem: () => null, setItem: (k: string, v: string) => { stored.push(`${k}=${v}`); }, removeItem: () => undefined };
    vi.stubGlobal("localStorage", storage);
    vi.stubGlobal("sessionStorage", storage);
    const logged: unknown[] = [];
    for (const level of ["log", "info", "warn", "error", "debug"] as const) {
      vi.spyOn(console, level).mockImplementation((...args: unknown[]) => { logged.push(...args); });
    }
    const h = host();
    setHttpAuthOf(h, readHttpAction(findHttpAction(h.document, A)!), { ...httpAuthNone("basic"), username: "me", password: SECRET });
    press(renderHttpMain(h), "Show");
    for (const tab of HTTP_TABS) tabText(h, tab);
    selectHttp(h, { kind: "globals" });
    flat(renderHttpMain(h));
    flat(renderHttpList(h));
    selectHttp(h, { kind: "action", id: A });
    await runHttpTest(h, A);
    flat(renderHttpMain(h));
    const draft = new HttpActionsDraft(DOC, 1);
    draft.apply(h.document);
    await saveHttpActionsDraft(draft, { save: async () => ({ revision: 2 }), fetch: async () => ({ revision: 1 }) });
    const all = JSON.stringify([stored, logged]);
    expect(all).not.toContain(SECRET);
    expect(all).not.toContain(btoa(`me:${SECRET}`));
  });
});
