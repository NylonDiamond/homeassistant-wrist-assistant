// The HTTP actions screen's views, flattened to text: the route and the
// stand-in while the chunk loads, the actions and Globals cards, the
// request in the middle with its sign-in helper and its secrets dotted
// until shown, the values asked for, the reply value and the Test card, and
// that no secret reaches the console or the browser's storage.

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
  readHttpAction,
  setHttpActionMethod,
} from "../src/watch-http-actions/model.js";
import {
  HTTP_AUDIO_TEXT,
  HTTP_NO_BODY_TEXT,
  HTTP_TIMEOUT_TEXT,
  type HttpActionsViewHost,
  addHttpActionTo,
  addHttpGlobalTo,
  httpAuthOf,
  httpSelection,
  httpTestState,
  httpTestValues,
  renderActionsCard,
  renderGlobalsCard,
  renderHttpMiddle,
  renderHttpRight,
  runHttpTest,
  secretShown,
  selectHttp,
  setHttpAuthOf,
} from "../src/watch-http-actions/view.js";

const flat = (v: unknown): string => {
  if (Array.isArray(v)) return v.map(flat).join("");
  if (v !== null && typeof v === "object" && "strings" in v && "values" in v) {
    const r = v as { strings: readonly string[]; values: unknown[] };
    return r.strings.map((s, i) => s + (i < r.values.length ? flat(r.values[i]) : "")).join("");
  }
  return typeof v === "string" || typeof v === "number" || typeof v === "boolean" ? String(v) : "";
};

/** Every `@click` handler a template holds, with where it sits in the
 * flattened text. */
function clicks(v: unknown, out: { at: number; fn: (e: unknown) => void }[] = [], seen = { length: 0 }) {
  if (Array.isArray(v)) {
    for (const x of v) clicks(x, out, seen);
    return out;
  }
  if (v !== null && typeof v === "object" && "strings" in v && "values" in v) {
    const r = v as { strings: readonly string[]; values: unknown[] };
    r.strings.forEach((s, i) => {
      seen.length += s.length;
      if (i >= r.values.length) return;
      const value = r.values[i];
      if (/@click=$/.test(s) && typeof value === "function") out.push({ at: seen.length, fn: value as (e: unknown) => void });
      else clicks(value, out, seen);
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
  const hit = clicks(tpl).find((c) => {
    const rest = text.slice(c.at);
    const own = rest.slice(0, rest.indexOf("</button>"));
    return !own.includes("<button") && !own.includes("<div") && own.includes(label);
  });
  if (hit === undefined) throw new Error(`no button for ${label}`);
  hit.fn({ preventDefault() {}, button: 0 });
}

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
});

describe("the left column", () => {
  it("lists the actions, an action with no URL marked, and the globals with their use", () => {
    const h = host();
    const actions = flat(renderActionsCard(h));
    expect(actions).toContain("Lights");
    expect(actions).toContain("POST · {{haurl}}/api/lights");
    expect(actions).toContain("Untitled action");
    expect(actions).toContain("GET · no URL yet");
    expect(actions.match(/needs setup/g)).toHaveLength(1);
    const globals = flat(renderGlobalsCard(h));
    expect(globals).toContain("{{haurl}}");
    expect(globals).toContain("Used by 1 action");
    // A global's value is never on the list.
    expect(globals).not.toContain(SECRET);
  });

  it("adds an action and a global, each picked", () => {
    const h = host();
    expect(httpSelection(h)).toEqual({ kind: "action", id: A });
    const id = addHttpActionTo(h);
    expect(readHttpAction(findHttpAction(h.document, id)!).name).toBe("New action");
    expect(httpSelection(h)).toEqual({ kind: "action", id });
    const g = addHttpGlobalTo(h);
    expect(httpSelection(h)).toEqual({ kind: "global", id: g });
    expect(flat(renderHttpMiddle(h))).toContain("value");
  });
});

describe("the request", () => {
  it("draws every card of the picked action, the certificate line among them", () => {
    const text = flat(renderHttpMiddle(host()));
    for (const part of ["Action", "Request", "Sign-in", "Headers", "Body", "Timeout and certificate", "Accept a self-signed certificate", HTTP_TIMEOUT_TEXT, HTTP_ACTIONS_CLIENT_CERT_TEXT]) {
      expect(text, part).toContain(part);
    }
    for (const method of ["GET", "POST", "PUT", "PATCH", "DELETE"]) expect(text).toContain(`<option value=${method}`);
    for (const type of ["None", "JSON", "Form", "Text", "Voice clip"]) expect(text).toContain(`>${type}</option>`);
    expect(text).toContain("Sends Content-Type: application/json, unless a header sets one.");
  });

  it("offers no body on a verb with none, and a voice clip with nothing to type", () => {
    const h = host(setHttpActionMethod(DOC, A, "GET"));
    expect(flat(renderHttpMiddle(h))).toContain(HTTP_NO_BODY_TEXT);
    h.document = { ...DOC, actions: [{ ...(DOC.actions as Record<string, unknown>[])[0], bodyContentType: "audio", body: undefined }, (DOC.actions as unknown[])[1]] };
    const text = flat(renderHttpMiddle(h));
    expect(text).toContain(HTTP_AUDIO_TEXT);
    expect(HTTP_AUDIO_TEXT).toContain("30 seconds");
    expect(text).not.toContain("<textarea class=\"mono\" rows=\"7\"");
  });

  it("dots every header value and global value until its Show is pressed", () => {
    const h = host();
    let text = flat(renderHttpMiddle(h));
    expect(text).toMatch(/<input type=password class="mono" \.value=\{\{token\}\}/);
    expect(text).toContain(">Show</button>");
    expect(secretShown(h, "header:H1")).toBe(false);
    press(renderHttpMiddle(h), "Show");
    expect(secretShown(h, "header:H1")).toBe(true);
    text = flat(renderHttpMiddle(h));
    expect(text).toMatch(/<input type=text class="mono" \.value=\{\{token\}\}/);
    expect(text).toContain(">Hide</button>");

    selectHttp(h, { kind: "global", id: "G2" });
    text = flat(renderHttpMiddle(h));
    expect(text).toMatch(new RegExp(`<input type=password class="mono" \\.value=${SECRET}`));
    expect(text).not.toMatch(new RegExp(`type=text[^>]*${SECRET}`));
  });

  it("writes the sign-in helper's header first, with the phone's id, and keeps to it while typing", () => {
    const h = host();
    const lights = () => readHttpAction(findHttpAction(h.document, A)!);
    expect(httpAuthOf(h, lights()).auth.kind).toBe("none");
    // Bearer chosen, no token yet: nothing written, the choice kept.
    setHttpAuthOf(h, lights(), httpAuthNone("bearer"));
    expect(lights().headers.map((h) => h.id)).toEqual(["H1"]);
    expect(httpAuthOf(h, lights()).auth.kind).toBe("bearer");
    setHttpAuthOf(h, lights(), { ...httpAuthNone("bearer"), token: SECRET });
    expect(lights().headers[0]).toEqual({ id: HTTP_AUTH_HEADER_ID, name: "Authorization", value: `Bearer ${SECRET}` });
    // An API key under a name the reader would not know stays in the helper.
    setHttpAuthOf(h, lights(), { ...httpAuthNone("apiKey"), headerName: "X-Api-Key", apiKeyValue: "k" });
    setHttpAuthOf(h, lights(), { ...httpAuthNone("apiKey"), headerName: "X-My-Key", apiKeyValue: "k" });
    expect(lights().headers[0]).toEqual({ id: HTTP_AUTH_HEADER_ID, name: "X-My-Key", value: "k" });
    expect(httpAuthOf(h, lights())).toMatchObject({ auth: { kind: "apiKey", headerName: "X-My-Key" }, headerId: HTTP_AUTH_HEADER_ID });
    // The helper's header is not listed again under Headers.
    const text = flat(renderHttpMiddle(h));
    expect(text).toContain("X-Trace");
    expect(text).not.toMatch(/value=X-My-Key placeholder="Name"/);
  });

  it("asks for a new token's value once it is typed in a request field", () => {
    const h = host();
    // A sign-in token that is a {{key}} becomes a value asked for.
    setHttpAuthOf(h, readHttpAction(findHttpAction(h.document, A)!), { ...httpAuthNone("bearer"), token: "{{pin}}" });
    expect(readHttpAction(findHttpAction(h.document, A)!).variables.map((v) => v.key)).toEqual(["room", "pin"]);
  });
});

describe("the right column", () => {
  it("says how {{key}} works, names the globals used, and edits the values asked for", () => {
    const text = flat(renderHttpRight(host()));
    expect(text).toContain(HTTP_TOKEN_HELP);
    expect(HTTP_TOKEN_HELP).toContain("filled in from Globals");
    expect(HTTP_TOKEN_HELP).toContain("asked for on the watch");
    expect(HTTP_TOKEN_HELP).toContain("letters, digits and underscores");
    expect(text).toContain("<code>{{haurl}}</code><code>{{token}}</code> <span>from Globals</span>");
    expect(text).toContain("{{room}}");
    expect(text).toContain("Quick values");
    expect(text).toContain("Only these");
    for (const source of ["Status code", "Body text", "JSON field", "Header", "Regex"]) expect(text).toContain(`>${source}</option>`);
    expect(text).toContain("JSON path");
    expect(text).toContain("Unit");
  });

  it("tests the draft action with the draft globals and a value for each prompt, and offers the paths it found", async () => {
    const reply: HttpActionTestReply = {
      status: 200, value: "on", snippet: `{"state":"on","data":[{"temp":21}]}`, error: null,
      headers: { "Content-Type": "application/json" },
      paths: [{ path: "state", value: "on" }, { path: "data.0.temp", value: "21" }],
      elapsed_ms: 87,
    };
    const h = host(DOC, reply);
    // The quick value stands in for a value not typed, as on the watch.
    expect(httpTestValues(readHttpAction(findHttpAction(h.document, A)!), new Set(["haurl", "token"]), {})).toEqual({ room: "Kitchen" });
    await runHttpTest(h, A);
    expect(h.sent).toHaveLength(1);
    expect(h.sent[0]!.action).toBe(findHttpAction(h.document, A));
    expect(h.sent[0]!.globals).toEqual(DOC.globalVariables);
    expect(h.sent[0]!.values).toEqual({ room: "Kitchen" });
    expect(httpTestState(h, A).running).toBe(false);
    const text = flat(renderHttpRight(h));
    expect(text).toContain("HTTP 200");
    expect(text).toContain("87 ms");
    expect(text).toContain("<code>on</code>");
    expect(text).toContain("JSON fields found");
    expect(text).toContain("<code>data.0.temp</code><span>21</span>");
    press(renderHttpRight(h), "data.0.temp");
    expect(readHttpAction(findHttpAction(h.document, A)!).reply).toEqual({ source: "jsonField", jsonPath: "data.0.temp" });
  });

  it("says plainly when there was no answer, or the integration cannot test", async () => {
    const none = host(DOC, { status: null, value: null, snippet: "", error: "Could not reach the server.", headers: {}, paths: [], elapsed_ms: 10_000 });
    await runHttpTest(none, A);
    const text = flat(renderHttpRight(none));
    expect(text).toContain("No answer");
    expect(text).toContain("Could not reach the server.");
    const old = host(DOC, Object.assign(new Error("Unknown command."), { code: "unknown_command" }));
    await runHttpTest(old, A);
    expect(flat(renderHttpRight(old))).toContain("This version of the integration cannot test an action. Update it to test here.");
  });

  it("does not offer a test of an action with no URL", () => {
    const h = host();
    selectHttp(h, { kind: "action", id: B });
    expect(flat(renderHttpRight(h))).toMatch(/ha-send" \?disabled=true/);
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
    press(renderHttpMiddle(h), "Show");
    selectHttp(h, { kind: "global", id: "G2" });
    flat(renderHttpMiddle(h));
    flat(renderHttpRight(h));
    selectHttp(h, { kind: "action", id: A });
    await runHttpTest(h, A);
    flat(renderHttpRight(h));
    const draft = new HttpActionsDraft(DOC, 1);
    draft.apply(h.document);
    await saveHttpActionsDraft(draft, { save: async () => ({ revision: 2 }), fetch: async () => ({ revision: 1 }) });
    const all = JSON.stringify([stored, logged]);
    expect(all).not.toContain(SECRET);
    expect(all).not.toContain(btoa(`me:${SECRET}`));
  });
});
