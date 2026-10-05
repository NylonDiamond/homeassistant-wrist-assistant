// The HTTP action library's model, merge and draft: a load and save with no
// edit gives the same bytes, unknown keys kept through edits, the keys left
// out when unset, tokens and the values asked for, the sign-in helper's
// round trip, the checks, the merge by action id and by global key, the save
// with its merge on a conflict, and the no-record path.

import { describe, expect, it } from "vitest";

import {
  HttpActionsDraft,
  dropHttpActionsDraft,
  keptHttpActionsDraft,
  saveHttpActionsDraft,
  startHttpActionsDraft,
  takeHttpActionsRecord,
} from "../src/watch-http-actions/draft.js";
import { httpActionsClashes, mergeHttpActions } from "../src/watch-http-actions/merge.js";
import {
  HTTP_AUTH_HEADER_ID,
  type HttpActionsDoc,
  type HttpAuth,
  addHttpAction,
  addHttpGlobal,
  addHttpHeader,
  checkHttpActions,
  composeHttpAuth,
  duplicateHttpAction,
  extractHttpAuth,
  findHttpAction,
  freshHttpActionName,
  freshHttpGlobalKey,
  httpActionList,
  httpActionTokens,
  httpActionsEmpty,
  httpActionsReadMeansUnsupported,
  httpAuthNone,
  httpEffectiveTimeout,
  httpGlobalKeys,
  httpGlobalList,
  httpGlobalUsers,
  httpPromptVariables,
  httpQuickValues,
  httpTokens,
  humanizeHttpKey,
  moveHttpAction,
  newHttpAction,
  parseHttpAuthHeader,
  readHttpAction,
  reconcileHttpVariables,
  removeHttpAction,
  removeHttpGlobal,
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
  tidyHttpActionsForSave,
  useHttpReplyPath,
} from "../src/watch-http-actions/model.js";
import { httpActionsKeptText, httpActionsSaveNote } from "../src/watch-http-actions/save-note.js";

const NOTIFY = "4F7A2C1E-9B3D-4E5F-8A6B-1C2D3E4F5A6B";
const VOICE = "6A0B1C2D-3E4F-4A5B-8C6D-7E8F9A0B1C2D";

/** A library as the phone writes it (sorted keys), with keys the panel does
 * not model on the document, an action, a header, a variable, a global and
 * the reply setting. */
const STORED = `{"actions":[{"body":"{\\"msg\\":\\"{{message}}\\",\\"level\\":{{level}}}","bodyContentType":"json","futureAction":[1,{"a":true}],"headers":[{"id":"1E000000-0000-4000-8000-000000000001","name":"Authorization","value":"Bearer {{token}}","zHeader":1}],"icon":"bell.fill","iconColor":"#A0C8FF","id":"${NOTIFY}","method":"POST","name":"Notify","presentsClientCertificate":true,"responseConfig":{"jsonPath":"result.id","source":"jsonField","unit":" id","zReply":"x"},"timeout":15,"url":"{{haurl}}/api/webhook/notify","variables":[{"id":"2A000000-0000-4000-8000-000000000002","key":"message","kind":"text","presetValues":["Dinner","Leaving"],"presetsOnly":false,"prompt":"Message","zVar":null},{"id":"3B000000-0000-4000-8000-000000000003","key":"level","kind":"number","presetValues":[],"presetsOnly":false,"prompt":"Level"}]},{"bodyContentType":"audio","headers":[],"id":"${VOICE}","method":"POST","name":"Voice memo","url":"https://example.invalid/upload","variables":[]}],"globalVariables":[{"id":"7C000000-0000-4000-8000-000000000007","key":"haurl","value":"http://192.168.1.10:8123"},{"id":"8D000000-0000-4000-8000-000000000008","key":"token","value":"s3cret","zGlobal":"kept"}],"schemaVersion":1,"zLibrary":{"n":2}}`;

function stored(): HttpActionsDoc {
  return JSON.parse(STORED) as HttpActionsDoc;
}

function action(document: HttpActionsDoc, id: string) {
  return readHttpAction(findHttpAction(document, id)!);
}

let seq = 0;
const ids = () => `ID-${++seq}`;

describe("load and save", () => {
  it("gives the same bytes when nothing was edited", () => {
    const draft = new HttpActionsDraft(stored(), 4);
    expect(draft.dirty).toBe(false);
    expect(JSON.stringify(draft.document)).toBe(STORED);
    // The tidy on save touches no action that was not changed.
    expect(JSON.stringify(tidyHttpActionsForSave(draft.document, draft.base))).toBe(STORED);
  });

  it("keeps every unknown key through edits elsewhere", () => {
    let d = stored();
    d = setHttpActionName(d, VOICE, "Memo");
    d = setHttpGlobalValue(d, "7C000000-0000-4000-8000-000000000007", "http://ha.local:8123");
    d = setHttpActionUrl(d, NOTIFY, "{{haurl}}/api/webhook/other");
    const out = JSON.parse(JSON.stringify(d));
    const before = JSON.parse(STORED);
    expect(out.zLibrary).toEqual({ n: 2 });
    expect(out.actions[0].futureAction).toEqual([1, { a: true }]);
    expect(out.actions[0].headers).toEqual(before.actions[0].headers);
    expect(out.actions[0].variables).toEqual(before.actions[0].variables);
    expect(out.actions[0].responseConfig).toEqual(before.actions[0].responseConfig);
    expect(out.globalVariables[1]).toEqual(before.globalVariables[1]);
    // A key it held keeps its place.
    expect(Object.keys(out.actions[0])).toEqual(Object.keys(before.actions[0]));
  });

  it("reads an action with the phone's fallbacks", () => {
    const a = action(stored(), NOTIFY);
    expect(a).toMatchObject({ name: "Notify", method: "POST", bodyContentType: "json", timeout: 15, presentsClientCertificate: true, icon: "bell.fill" });
    expect(a.reply).toEqual({ source: "jsonField", jsonPath: "result.id", unit: " id" });
    const bare = readHttpAction({ id: "x" });
    expect(bare).toMatchObject({ name: "", method: "POST", url: "", headers: [], bodyContentType: "none", variables: [], allowsUntrustedCertificate: false });
    expect(readHttpAction({ id: "x", responseConfig: { source: "later" } }).reply).toBeUndefined();
    expect(httpEffectiveTimeout({})).toBe(10);
    expect(httpEffectiveTimeout({ timeout: 0.2 })).toBe(1);
    expect(httpEffectiveTimeout({ timeout: 600 })).toBe(60);
  });
});

describe("what an edit writes", () => {
  it("makes a new action as the phone does, keys sorted, with a free name", () => {
    expect(JSON.stringify(newHttpAction("A", "New action"))).toBe(`{"bodyContentType":"none","headers":[],"id":"A","method":"POST","name":"New action","url":"","variables":[]}`);
    const d = addHttpAction(httpActionsEmpty(), newHttpAction("A", freshHttpActionName(httpActionsEmpty())));
    expect(freshHttpActionName(d)).toBe("New action 2");
    expect(JSON.stringify(httpActionsEmpty())).toBe(`{"actions":[],"globalVariables":[],"schemaVersion":1}`);
  });

  it("leaves out what is not set, as the phone's encoder does", () => {
    let d = stored();
    d = setHttpActionTimeout(d, NOTIFY, undefined);
    d = setHttpActionIcon(d, NOTIFY, "");
    d = setHttpActionColor(d, NOTIFY, undefined);
    d = setHttpActionBody(d, NOTIFY, "   ");
    d = setHttpActionUntrusted(d, NOTIFY, false);
    d = setHttpReplySource(d, NOTIFY, undefined);
    const raw = findHttpAction(d, NOTIFY)!;
    for (const key of ["timeout", "icon", "iconColor", "body", "allowsUntrustedCertificate", "responseConfig"]) expect(Object.hasOwn(raw, key), key).toBe(false);
    d = setHttpActionUntrusted(d, NOTIFY, true);
    d = setHttpActionTimeout(d, NOTIFY, 30);
    const on = findHttpAction(d, NOTIFY)!;
    expect(on.allowsUntrustedCertificate).toBe(true);
    expect(on.timeout).toBe(30);
    // New keys go in at their sorted place.
    expect(Object.keys(on).indexOf("allowsUntrustedCertificate")).toBe(0);
    expect(setHttpActionTimeout(d, NOTIFY, -1)).toBe(d);
  });

  it("drops a voice clip's body, and the clip itself on a verb with no body", () => {
    let d = setHttpActionBodyType(stored(), NOTIFY, "audio");
    expect(Object.hasOwn(findHttpAction(d, NOTIFY)!, "body")).toBe(false);
    d = setHttpActionMethod(d, VOICE, "get");
    expect(findHttpAction(d, VOICE)!.method).toBe("GET");
    expect(findHttpAction(d, VOICE)!.bodyContentType).toBe("none");
    expect(setHttpActionMethod(d, VOICE, "TRACE")).toBe(d);
  });

  it("writes only the reply field of the chosen source, and keeps the unit as typed", () => {
    let d = setHttpReplySource(stored(), NOTIFY, "header");
    expect(findHttpAction(d, NOTIFY)!.responseConfig).toEqual({ source: "header", unit: " id", zReply: "x" });
    d = setHttpReplyField(d, NOTIFY, "headerName", "  X-Left ");
    d = setHttpReplyField(d, NOTIFY, "unit", " kWh");
    expect(findHttpAction(d, NOTIFY)!.responseConfig).toMatchObject({ source: "header", headerName: "X-Left", unit: " kWh" });
    d = useHttpReplyPath(d, NOTIFY, "data.0.temp");
    expect(findHttpAction(d, NOTIFY)!.responseConfig).toEqual({ jsonPath: "data.0.temp", source: "jsonField", unit: " kWh", zReply: "x" });
  });

  it("duplicates with new ids, moves and removes", () => {
    seq = 0;
    const { document, id } = duplicateHttpAction(stored(), NOTIFY, ids);
    const list = httpActionList(document);
    expect(list.map((a) => a.name)).toEqual(["Notify", "Notify Copy", "Voice memo"]);
    expect(id).toBe("ID-1");
    const copy = readHttpAction(list[1]!);
    expect(copy.headers.map((h) => h.id)).toEqual(["ID-2"]);
    expect(copy.variables.map((v) => v.id)).toEqual(["ID-3", "ID-4"]);
    expect(httpActionList(moveHttpAction(document, VOICE, 0)).map((a) => a.name)).toEqual(["Voice memo", "Notify", "Notify Copy"]);
    expect(httpActionList(removeHttpAction(document, NOTIFY)).map((a) => a.name)).toEqual(["Notify Copy", "Voice memo"]);
  });

  it("keeps global keys to letters, digits and underscores, and finds a free one", () => {
    let d = setHttpGlobalKey(stored(), "7C000000-0000-4000-8000-000000000007", "ha url!");
    expect(httpGlobalList(d)[0]!.key).toBe("haurl");
    d = addHttpGlobal(d, "G3", freshHttpGlobalKey(d));
    expect(httpGlobalList(d).at(-1)).toEqual({ id: "G3", key: "value", value: "" });
    expect(freshHttpGlobalKey(d)).toBe("value_2");
    expect(httpGlobalUsers(d, "haurl")).toEqual(["Notify"]);
    expect(httpGlobalList(removeHttpGlobal(d, "G3"))).toHaveLength(2);
  });
});

describe("tokens and the values asked for", () => {
  it("finds tokens, splits globals from the values asked for, and leaves out a Basic header", () => {
    expect(httpTokens(["{{a}} {{ b }} {{a}}", "{{c-d}} {{e_1}}"])).toEqual(["a", "b", "e_1"]);
    const a = action(stored(), NOTIFY);
    const globals = httpGlobalKeys(stored());
    expect(httpActionTokens(a, globals)).toEqual({ global: ["haurl", "token"], asked: ["message", "level"] });
    expect(httpPromptVariables(a, globals).map((v) => v.key)).toEqual(["message", "level"]);
    // A body on a GET is not sent, so its tokens are not asked for.
    expect(httpActionTokens(action(setHttpActionMethod(stored(), NOTIFY, "GET"), NOTIFY), globals).asked).toEqual([]);
    expect(humanizeHttpKey("garage_message")).toBe("Garage Message");
    expect(httpQuickValues({ presetValues: [" a ", "", "b", "a"] })).toEqual(["a", "b"]);
  });

  it("adds a row for a new token, carries a rename, and keeps a row whose token went", () => {
    seq = 0;
    let d = setHttpActionUrl(stored(), VOICE, "https://x.invalid/{{room}}");
    d = reconcileHttpVariables(d, VOICE, ids);
    expect(action(d, VOICE).variables).toEqual([{ id: "ID-1", key: "room", kind: "text", presetValues: [], presetsOnly: false, prompt: "Room" }]);
    expect(JSON.stringify(findHttpAction(d, VOICE)!.variables)).toBe(`[{"id":"ID-1","key":"room","kind":"text","presetValues":[],"presetsOnly":false,"prompt":"Room"}]`);
    // One token renamed: the row follows, its quick values kept.
    d = setHttpVariable(d, VOICE, "ID-1", { presetValues: ["Kitchen"] });
    d = reconcileHttpVariables(setHttpActionUrl(d, VOICE, "https://x.invalid/{{area}}"), VOICE, ids);
    expect(action(d, VOICE).variables).toEqual([{ id: "ID-1", key: "area", kind: "text", presetValues: ["Kitchen"], presetsOnly: false, prompt: "Area" }]);
    // The token goes: the row stays while editing.
    d = reconcileHttpVariables(setHttpActionUrl(d, VOICE, "https://x.invalid/"), VOICE, ids);
    expect(action(d, VOICE).variables).toHaveLength(1);
    // ...and is left out when the action is saved.
    const tidied = tidyHttpActionsForSave(d, stored());
    expect(action(tidied, VOICE).variables).toEqual([]);
  });

  it("tidies a changed action as the phone saves it: nameless headers out, quick values trimmed", () => {
    let d = addHttpHeader(stored(), NOTIFY, "H2");
    d = setHttpVariable(d, NOTIFY, "2A000000-0000-4000-8000-000000000002", { presetValues: ["Dinner", "", " Late "] });
    const tidied = tidyHttpActionsForSave(d, stored());
    const a = action(tidied, NOTIFY);
    expect(a.headers.map((h) => h.id)).toEqual(["1E000000-0000-4000-8000-000000000001"]);
    expect(a.variables[0]!.presetValues).toEqual(["Dinner", "Late"]);
    // The untouched action goes back as it came.
    expect(findHttpAction(tidied, VOICE)).toBe(findHttpAction(d, VOICE));
  });
});

describe("the sign-in helper", () => {
  const header = (name: string, value: string, id = "H") => ({ id, name, value });

  it("reads back what it writes, for every kind", () => {
    const cases: HttpAuth[] = [
      { ...httpAuthNone("bearer"), token: "abc.def" },
      { ...httpAuthNone("basic"), username: "jesse", password: "p:ss wörd" },
      { ...httpAuthNone("basic"), username: "", password: "only" },
      { ...httpAuthNone("apiKey"), headerName: "X-Api-Key", apiKeyValue: "k-123" },
      { ...httpAuthNone("apiKey"), headerName: "x-access-token", apiKeyValue: "{{token}}" },
    ];
    for (const auth of cases) {
      const made = composeHttpAuth(auth)!;
      expect(parseHttpAuthHeader(made), JSON.stringify(auth)).toEqual(auth);
    }
    expect(composeHttpAuth({ ...httpAuthNone("basic"), username: "jesse", password: "p:ss wörd" })).toEqual({ name: "Authorization", value: "Basic amVzc2U6cDpzcyB3w7ZyZA==" });
  });

  it("writes nothing without a secret, and trims a token and a key as the phone does", () => {
    expect(composeHttpAuth(httpAuthNone())).toBeUndefined();
    expect(composeHttpAuth({ ...httpAuthNone("bearer"), token: "  " })).toBeUndefined();
    expect(composeHttpAuth({ ...httpAuthNone("basic") })).toBeUndefined();
    expect(composeHttpAuth({ ...httpAuthNone("apiKey"), apiKeyValue: "" })).toBeUndefined();
    expect(composeHttpAuth({ ...httpAuthNone("bearer"), token: " t " })).toEqual({ name: "Authorization", value: "Bearer t" });
  });

  it("leaves a header it cannot show to the headers", () => {
    expect(parseHttpAuthHeader(header("Authorization", "Digest x=1"))).toBeUndefined();
    expect(parseHttpAuthHeader(header("Authorization", "Basic not*base64"))).toBeUndefined();
    expect(parseHttpAuthHeader(header("Authorization", `Basic ${btoa("nocolon")}`))).toBeUndefined();
    expect(parseHttpAuthHeader(header("X-Custom-Key", "v"))).toBeUndefined();
    const found = extractHttpAuth([header("Accept", "x", "A"), header("authorization", "bearer zz", "B"), header("X-Api-Key", "k", "C")]);
    expect(found).toEqual({ auth: { ...httpAuthNone("bearer"), token: "zz" }, headerId: "B" });
  });

  it("edits its header in place, keeping its id and place, and removes it when it makes none", () => {
    const base = stored();
    const { auth, headerId } = extractHttpAuth(action(base, NOTIFY).headers);
    expect(auth).toEqual({ ...httpAuthNone("bearer"), token: "{{token}}" });
    const changed = setHttpAuth(base, NOTIFY, headerId, { ...auth, token: "{{other}}" });
    expect(changed.headerId).toBe(headerId);
    expect(findHttpAction(changed.document, NOTIFY)!.headers).toEqual([{ id: headerId, name: "Authorization", value: "Bearer {{other}}", zHeader: 1 }]);
    const off = setHttpAuth(base, NOTIFY, headerId, httpAuthNone());
    expect(action(off.document, NOTIFY).headers).toEqual([]);
    // Unchanged, it is the same document.
    expect(setHttpAuth(base, NOTIFY, headerId, auth).document).toBe(base);
  });

  it("puts a new header first, with the phone's fixed id", () => {
    let d = addHttpHeader(stored(), VOICE, "H1");
    d = setHttpHeader(d, VOICE, "H1", { name: "Accept", value: "text/plain" });
    const out = setHttpAuth(d, VOICE, undefined, { ...httpAuthNone("apiKey"), apiKeyValue: "k" });
    expect(out.headerId).toBe(HTTP_AUTH_HEADER_ID);
    expect(action(out.document, VOICE).headers).toEqual([
      { id: HTTP_AUTH_HEADER_ID, name: "X-Api-Key", value: "k" },
      { id: "H1", name: "Accept", value: "text/plain" },
    ]);
  });
});

describe("the checks", () => {
  it("passes the phone's library", () => {
    expect(checkHttpActions(stored())).toEqual([]);
    expect(checkHttpActions(httpActionsEmpty())).toEqual([]);
  });

  it("names what Home Assistant would refuse", () => {
    const d = stored();
    const twice = addHttpAction(d, { ...findHttpAction(d, NOTIFY)!, name: "Again" });
    expect(checkHttpActions(twice)).toEqual([`"Again" has the id of another action.`]);
    expect(checkHttpActions(setHttpGlobalKey(d, "8D000000-0000-4000-8000-000000000008", "haurl"))).toEqual(["Two globals are named {{haurl}}."]);
    expect(checkHttpActions(addHttpGlobal(d, "G", ""))).toEqual(["Global 3 has no name."]);
    const bad = { ...d, actions: [{ id: "A", name: "Odd", method: "TRACE", bodyContentType: "xml", url: "u", headers: [], variables: [{ key: "a b" }], responseConfig: { source: "later" } }] };
    expect(checkHttpActions(bad)).toEqual([
      `"Odd" uses TRACE, which is not GET, POST, PUT, PATCH or DELETE.`,
      `"Odd" has a body type Home Assistant does not know.`,
      `"Odd" reads its reply value from a source Home Assistant does not know.`,
      `"Odd" asks for a value whose key is not letters, digits and underscores.`,
    ]);
    expect(checkHttpActions([])).toEqual(["The library is not an object."]);
  });

  it("reads an older integration's refusal as no library to edit", () => {
    expect(httpActionsReadMeansUnsupported({ code: "unknown_command", message: "Unknown command." })).toBe(true);
    expect(httpActionsReadMeansUnsupported({ code: "unavailable" })).toBe(false);
  });
});

describe("the merge", () => {
  it("merges by action id: each side's own changes kept, a clash keeps the draft's copy", () => {
    const base = stored();
    const local = setHttpActionName(setHttpActionUrl(base, VOICE, "https://mine.invalid"), NOTIFY, "Ping");
    const server = addHttpAction(setHttpActionName(base, NOTIFY, "Notify me"), newHttpAction("S", "From the phone"));
    const merged = mergeHttpActions(base, local, server);
    expect(httpActionList(merged).map((a) => a.name)).toEqual(["Ping", "Voice memo", "From the phone"]);
    expect(action(merged, VOICE).url).toBe("https://mine.invalid");
    expect(httpActionsClashes(base, local, server)).toEqual([{ list: "action", key: NOTIFY, name: "Ping" }]);
    expect(httpActionsKeptText(httpActionsClashes(base, local, server))).toBe(`"Ping" also changed somewhere else. Your version was kept.`);
  });

  it("deletes what one side deleted and the other left alone, and keeps what the other changed", () => {
    const base = stored();
    const local = removeHttpAction(base, VOICE);
    const server = setHttpActionName(base, NOTIFY, "Renamed");
    expect(httpActionList(mergeHttpActions(base, local, server)).map((a) => a.name)).toEqual(["Renamed"]);
    const changedThere = setHttpActionName(base, VOICE, "Kept");
    expect(httpActionList(mergeHttpActions(base, local, changedThere)).map((a) => a.name)).toEqual(["Notify", "Kept"]);
  });

  it("merges globals by key, whatever their ids", () => {
    const base = stored();
    const local = setHttpGlobalValue(base, "7C000000-0000-4000-8000-000000000007", "http://mine:8123");
    // The phone's hand-over brought a global under a new id and key.
    const server = addHttpGlobal(base, "PHONE", "token_2");
    const merged = mergeHttpActions(base, local, server);
    expect(httpGlobalList(merged).map((g) => [g.key, g.value])).toEqual([["haurl", "http://mine:8123"], ["token", "s3cret"], ["token_2", ""]]);
    expect(JSON.parse(JSON.stringify(merged)).zLibrary).toEqual({ n: 2 });
  });
});

describe("the draft and its save", () => {
  it("undoes and redoes, and coalesces typing", () => {
    const draft = new HttpActionsDraft(stored(), 2);
    draft.apply(setHttpActionName(draft.document, NOTIFY, "N"), "name");
    draft.apply(setHttpActionName(draft.document, NOTIFY, "No"), "name");
    expect(draft.dirty).toBe(true);
    expect(draft.undo()).toBe(true);
    expect(draft.dirty).toBe(false);
    expect(draft.redo()).toBe(true);
    expect(action(draft.document, NOTIFY).name).toBe("No");
  });

  it("merges on a conflict and saves again, at most three sends", async () => {
    const draft = new HttpActionsDraft(stored(), 2);
    draft.apply(setHttpActionName(draft.document, VOICE, "Memo"));
    const server = setHttpActionName(stored(), NOTIFY, "From the phone");
    const sent: number[] = [];
    const result = await saveHttpActionsDraft(draft, {
      save: async (base, document) => {
        sent.push(base);
        if (base === 2) throw { code: "conflict", message: "stored revision is 3" };
        expect(action(document, NOTIFY).name).toBe("From the phone");
        expect(action(document, VOICE).name).toBe("Memo");
        return { revision: 4 };
      },
      fetch: async () => ({ revision: 3, document: server }),
    });
    expect(sent).toEqual([2, 3]);
    expect(result).toEqual({ ok: true, revision: 4, merged: true });
    expect(draft.dirty).toBe(false);
    expect(httpActionsSaveNote(result)).toEqual({ kind: "ok", text: "Saved. Changes made somewhere else were merged in." });

    draft.apply(setHttpActionName(draft.document, VOICE, "Again"));
    let sends = 0;
    const busy = await saveHttpActionsDraft(draft, {
      save: async () => {
        sends++;
        throw { code: "conflict", message: "stored revision is 9" };
      },
      fetch: async () => ({ revision: 5 + sends, document: setHttpActionName(stored(), NOTIFY, `Other ${sends}`) }),
    });
    expect(sends).toBe(3);
    expect(busy).toMatchObject({ ok: false, code: "conflict" });
    expect(draft.dirty).toBe(true);
  });

  it("sends nothing Home Assistant would refuse, and words a refusal plainly", async () => {
    const draft = new HttpActionsDraft(stored(), 2);
    draft.apply(addHttpGlobal(draft.document, "G", ""));
    let sent = false;
    const result = await saveHttpActionsDraft(draft, { save: async () => { sent = true; return { revision: 3 }; }, fetch: async () => ({ revision: 2 }) });
    expect(sent).toBe(false);
    expect(httpActionsSaveNote(result)).toEqual({ kind: "err", text: "Not saved. Global 3 has no name." });
    expect(httpActionsSaveNote({ ok: false, revision: 2, merged: false, code: "invalid", message: "actions[0].method is not known" })).toEqual({
      kind: "err", text: "Not saved. Home Assistant refused the HTTP actions: actions[0].method is not known",
    });
    expect(httpActionsSaveNote({ ok: false, revision: 2, merged: false, code: "unavailable", message: "" })?.kind).toBe("warn");
  });

  it("starts a library at revision 0 and creates it with the first save", async () => {
    dropHttpActionsDraft();
    expect(takeHttpActionsRecord(undefined, 0)).toEqual({ mergedIntoEdits: false, kept: [] });
    const draft = startHttpActionsDraft();
    expect(draft.revision).toBe(0);
    draft.apply(addHttpAction(draft.document, newHttpAction("A", "First")));
    // A read at revision 0 meanwhile keeps the draft.
    expect(takeHttpActionsRecord(undefined, 0).draft).toBe(draft);
    // A phone handed its library over meanwhile: the save merges onto it.
    const result = await saveHttpActionsDraft(draft, {
      save: async (base) => {
        if (base === 0) throw { code: "conflict", message: "stored revision is 1" };
        return { revision: 2 };
      },
      fetch: async () => ({ revision: 1, document: stored() }),
    });
    expect(result).toMatchObject({ ok: true, revision: 2, merged: true });
    expect(httpActionList(draft.document).map((a) => a.name)).toEqual(["Notify", "Voice memo", "First"]);
    expect(keptHttpActionsDraft()).toBe(draft);
    dropHttpActionsDraft();
    expect(keptHttpActionsDraft()).toBeUndefined();
  });

  it("takes a newer record into a dirty draft and says the edits are kept", () => {
    dropHttpActionsDraft();
    const first = takeHttpActionsRecord(stored(), 3).draft!;
    first.apply(setHttpActionName(first.document, VOICE, "Mine"));
    const next = takeHttpActionsRecord(setHttpActionName(stored(), NOTIFY, "Theirs"), 4);
    expect(next.draft).toBe(first);
    expect(next.mergedIntoEdits).toBe(true);
    expect(httpActionList(first.document).map((a) => a.name)).toEqual(["Theirs", "Mine"]);
    dropHttpActionsDraft();
  });
});
