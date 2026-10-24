// A watch's two addresses in the panel: the words and rules in
// device-addresses.ts, the short block and the form it draws, the pairing
// dialog's third step, and how panel.ts wires them, read from its source
// since no test mounts the panel (as panel-home-source.test.ts does). The
// Settings page's side is in watch-settings-addresses.test.ts.

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { html, nothing } from "lit";
import { describe, expect, it, vi } from "vitest";
import {
  ADDRESSES_NETWORK_PATH,
  ADDRESSES_PAGE_SAVE_NOTE,
  addressDraft,
  addressPayload,
  addressProblem,
  addressShown,
  addressWords,
  automaticLine,
  changedSlots,
  invalidAddressText,
  renderAddressBlock,
  renderAddressForm,
  restoreAddressDraft,
  withSlotEdit,
  type AddressBlockView,
  type AddressFormView,
} from "../src/device-addresses.js";
import type { DeviceAddresses } from "../src/ha-api.js";
import { renderPairNext } from "../src/watch-pair-view.js";

const SOURCE = readFileSync(join(__dirname, "..", "src", "panel.ts"), "utf8");
const API = readFileSync(join(__dirname, "..", "src", "ha-api.ts"), "utf8");
const WORDS = readFileSync(join(__dirname, "..", "src", "device-addresses.ts"), "utf8");

function method(signature: string): string {
  const at = SOURCE.indexOf(signature);
  if (at < 0) throw new Error(`no ${signature}`);
  const end = SOURCE.indexOf("\n  }\n", at);
  return SOURCE.slice(at, end);
}

function flatten(node: unknown): string {
  if (node === undefined || node === null || node === nothing) return "";
  if (Array.isArray(node)) return node.map(flatten).join("");
  if (typeof node === "object" && "strings" in (node as Record<string, unknown>)) {
    const t = node as { strings: readonly string[]; values: unknown[] };
    return t.strings.map((s, i) => s + (i < t.values.length ? flatten(t.values[i]) : "")).join("");
  }
  if (typeof node === "function") return "";
  return String(node);
}

const LOCAL = "http://homeassistant.local:8123";
const EXTERNAL = "https://ha.example.com";
const CLOUD = "https://abc.ui.nabu.casa";

function record(over: Partial<DeviceAddresses> = {}): DeviceAddresses {
  return {
    ok: true,
    watch_id: "w1",
    local_url: LOCAL,
    remote_url: EXTERNAL,
    local_source: "auto",
    remote_source: "auto",
    hash: "0123456789abcdef",
    detected: { internal: LOCAL, external: EXTERNAL, cloud: null },
    ...over,
  };
}

function view(over: Partial<AddressFormView> = {}): AddressFormView {
  return {
    record: record(),
    draft: addressDraft(record()),
    busy: false,
    onMode: () => {},
    onText: () => {},
    onSave: () => {},
    onCancel: () => {},
    ...over,
  };
}

describe("the address words", () => {
  it("shows what Automatic gives, or that Home Assistant has nothing", () => {
    expect(automaticLine(record(), "local")).toBe(`Automatic: ${LOCAL}`);
    expect(automaticLine(record(), "remote")).toBe(`Automatic: ${EXTERNAL}`);
    // No external URL: the internet address follows the cloud one.
    const cloud = record({ detected: { internal: null, external: null, cloud: CLOUD } });
    expect(automaticLine(cloud, "remote")).toBe(`Automatic: ${CLOUD}`);
    expect(automaticLine(cloud, "local")).toBe("Automatic: nothing set in Home Assistant");
  });

  it("starts the form on each slot's setting, with a set address typed in", () => {
    expect(addressDraft(record())).toEqual({ local: { mode: "auto", text: "" }, remote: { mode: "auto", text: "" } });
    expect(addressDraft(record({ local_source: "set", local_url: "http://10.0.0.5:8123", remote_source: "none", remote_url: null })))
      .toEqual({ local: { mode: "set", text: "http://10.0.0.5:8123" }, remote: { mode: "none", text: "" } });
  });

  it("sends null for Automatic, an empty string for None, and the typed address for Set", () => {
    expect(addressPayload({ local: { mode: "auto", text: "x" }, remote: { mode: "none", text: "" } }))
      .toEqual({ ok: true, slots: { local_url: null, remote_url: "" } });
    expect(addressPayload({ local: { mode: "set", text: `  ${LOCAL}/ ` }, remote: { mode: "auto", text: "" } }))
      .toEqual({ ok: true, slots: { local_url: `${LOCAL}/`, remote_url: null } });
  });

  it("stops a Set slot with no usable address, naming it", () => {
    expect(addressPayload({ local: { mode: "auto", text: "" }, remote: { mode: "set", text: "" } }))
      .toEqual({ ok: false, slot: "remote", message: "Internet address: Type an address, or pick Automatic or None." });
    expect(addressProblem("homeassistant.local:8123")).toBe("Start the address with http:// or https://.");
    expect(addressProblem("https://ha.example.com/lovelace")).toBe("Leave out any path after the address and port.");
    expect(addressProblem("https://user@ha.example.com")).toBe("Leave out any path after the address and port.");
    expect(addressProblem(LOCAL)).toBeUndefined();
  });

  it("words a refusal from the integration for the slot it named", () => {
    expect(invalidAddressText("remote_url must be an http:// or https:// address with no path"))
      .toBe("The internet address cannot be used. Start it with http:// or https://, and leave out any path.");
    expect(invalidAddressText(undefined)).toMatch(/^That address cannot be used\./);
  });

  it("says each address in a line, with where it comes from", () => {
    expect(addressWords(record(), "local")).toBe(`${LOCAL} (automatic)`);
    expect(addressWords(record({ remote_source: "none", remote_url: null }), "remote")).toBe("None");
    expect(addressWords(record({ local_source: "set", local_url: "http://10.0.0.5" }), "local")).toBe("http://10.0.0.5");
    expect(addressWords(record({ local_url: null }), "local")).toBe("Automatic, nothing set in Home Assistant");
  });

  it("typing picks Set from Automatic or None, and a mode keeps what was typed", () => {
    const start = addressDraft(record({ remote_source: "none", remote_url: null }));
    expect(withSlotEdit(start, "local", { text: "h" }).local).toEqual({ mode: "set", text: "h" });
    expect(withSlotEdit(start, "remote", { text: "h" }).remote).toEqual({ mode: "set", text: "h" });
    const typed = withSlotEdit(start, "local", { text: LOCAL });
    expect(withSlotEdit(typed, "local", { mode: "auto" }).local).toEqual({ mode: "auto", text: LOCAL });
    // The other slot is left alone.
    expect(typed.remote).toEqual(start.remote);
  });

  it("knows which slots a draft changes", () => {
    const r = record({ local_source: "set", local_url: "http://10.0.0.5:8123" });
    expect(changedSlots(r, addressDraft(r))).toEqual([]);
    expect(changedSlots(r, withSlotEdit(addressDraft(r), "local", { text: " http://10.0.0.5:8123 " }))).toEqual([]);
    expect(changedSlots(r, withSlotEdit(addressDraft(r), "local", { text: "http://10.0.0.6:8123" }))).toEqual(["local"]);
    expect(changedSlots(r, withSlotEdit(addressDraft(r), "remote", { mode: "none" }))).toEqual(["remote"]);
    // Text kept under Automatic is not a change.
    expect(changedSlots(record(), { local: { mode: "auto", text: "x" }, remote: { mode: "auto", text: "" } })).toEqual([]);
  });

  it("lays a kept draft over a newer record, slot by slot", () => {
    const old = record();
    const kept = { record: old, draft: withSlotEdit(addressDraft(old), "remote", { mode: "none" }) };
    // The newer record set the home network address meanwhile: it is kept,
    // and the internet address keeps its edit.
    const fresh = record({ local_source: "set", local_url: "http://10.0.0.5" });
    expect(restoreAddressDraft(kept, fresh)).toEqual({ local: { mode: "set", text: "http://10.0.0.5" }, remote: { mode: "none", text: "" } });
  });

  it("sends only the slots asked for", () => {
    const draft = { local: { mode: "set" as const, text: "nope" }, remote: { mode: "none" as const, text: "" } };
    // The bad local address is not checked when only the remote one goes.
    expect(addressPayload(draft, ["remote"])).toEqual({ ok: true, slots: { remote_url: "" } });
    expect(addressPayload(draft, ["local"]).ok).toBe(false);
  });

  it("shows a slot as its address, or none, and whether it follows Home Assistant", () => {
    expect(addressShown(record(), "local")).toEqual({ url: LOCAL, automatic: true });
    expect(addressShown(record({ remote_source: "none", remote_url: null }), "remote")).toEqual({ url: null, automatic: false });
    expect(addressShown(record({ local_url: null }), "local")).toEqual({ url: null, automatic: true });
    expect(addressShown(record({ local_source: "set", local_url: "http://10.0.0.5" }), "local")).toEqual({ url: "http://10.0.0.5", automatic: false });
  });

  it("uses no dashes to break a sentence", () => {
    const strings = WORDS.match(/"[^"\n]*"/g) ?? [];
    for (const s of strings) {
      expect(s).not.toMatch(/[—–]/);
      expect(s).not.toContain(" - ");
    }
  });
});

describe("the address form", () => {
  it("has both fields, the three choices each, the automatic values and the Network link", () => {
    const text = flatten(renderAddressForm(view()));
    expect(text).toContain("Home network address");
    expect(text).toContain("Internet address");
    for (const label of ["Automatic", "Set", "None"]) expect(text.split(`<span>${label}</span>`).length - 1).toBe(2);
    expect(text).toContain(`Automatic: ${LOCAL}`);
    expect(text).toContain(`Automatic: ${EXTERNAL}`);
    expect(text).toContain(`href=${ADDRESSES_NETWORK_PATH}`);
    expect(text).toContain("Settings > System > Network");
    expect(text).toContain("Save");
    expect(text).toContain("Cancel");
  });

  it("says Loading… until the record is in, and the error when it could not be read", () => {
    expect(flatten(renderAddressForm(view({ record: undefined, draft: undefined })))).toContain("Loading…");
    const failed = flatten(renderAddressForm(view({ record: undefined, draft: undefined, error: "Could not read the addresses: gone" })));
    expect(failed).toContain("Could not read the addresses: gone");
    expect(failed).not.toContain("Loading…");
  });

  it("shows Saving… and the error while saving", () => {
    const text = flatten(renderAddressForm(view({ busy: true, error: "Nope" })));
    expect(text).toContain("Saving…");
    expect(text).toContain("Nope");
  });

  it("wears the panel's Save, greyed out until something changed, then lit", () => {
    const idle = flatten(renderAddressForm(view()));
    expect(idle).toContain(`type="submit" class="primary save "`);
    expect(idle).toMatch(/class="primary save " \?disabled=true/);
    const changed = view({ draft: withSlotEdit(addressDraft(record()), "remote", { mode: "none" }) });
    const lit = flatten(renderAddressForm(changed));
    expect(lit).toMatch(/class="primary save dirty" \?disabled=false/);
    expect(lit).not.toContain(`class="home-btn"`);
  });

  it("never greys out a field, so typing into Automatic or None is possible", () => {
    const none = view({ draft: { local: { mode: "none", text: "" }, remote: { mode: "auto", text: "" } } });
    const text = flatten(renderAddressForm(none));
    expect(text).not.toMatch(/dev-addr-in[^>]*\?disabled/);
  });

  it("leaves Save to the page when the page saves it", () => {
    const text = flatten(renderAddressForm(view({ saves: "page" })));
    expect(text).not.toContain(`type="submit"`);
    expect(text).toContain(ADDRESSES_PAGE_SAVE_NOTE);
    expect(text).toContain("Cancel");
  });
});

describe("the short block", () => {
  const block = (over: Partial<AddressBlockView> = {}): AddressBlockView => ({
    record: record(),
    editing: false,
    onEdit: () => {},
    form: view(),
    ...over,
  });

  it("shows one line each, Automatic as a quiet tag, and one Edit", () => {
    const text = flatten(renderAddressBlock(block()));
    expect(text).toContain("<dt>Home network</dt>");
    expect(text).toContain("<dt>Internet</dt>");
    expect(text).toContain(LOCAL);
    expect(text).toContain(EXTERNAL);
    expect(text.split(`class="addr-sum-tag"`).length - 1).toBe(2);
    expect(text.split(">Edit</button>").length - 1).toBe(1);
    // No explaining until Edit.
    expect(text).not.toContain("Used on the same Wi-Fi");
    expect(text).not.toContain("dev-addr-slot");
  });

  it("says None, with no tag, for a slot set to none", () => {
    const text = flatten(renderAddressBlock(block({ record: record({ remote_source: "none", remote_url: null, local_source: "set", local_url: "http://10.0.0.5" }) })));
    expect(text).toContain(">None</span>");
    expect(text).toContain("http://10.0.0.5");
    expect(text).not.toContain(`class="addr-sum-tag"`);
  });

  it("is the form in the same place while editing", () => {
    const text = flatten(renderAddressBlock(block({ editing: true })));
    expect(text).toContain("dev-addr-slot");
    expect(text).not.toContain("<dt>Home network</dt>");
  });

  it("says it is loading, or why it could not read them", () => {
    expect(flatten(renderAddressBlock(block({ record: undefined })))).toContain("Loading the addresses…");
    const failed = flatten(renderAddressBlock(block({ record: undefined, readError: "Could not read the addresses: gone" })));
    expect(failed).toContain("Could not read the addresses: gone");
    expect(failed).not.toContain(">Edit</button>");
  });

  it("opens Network settings in place on a plain click, through Home Assistant's own move", () => {
    const pushes: string[] = [];
    const events: string[] = [];
    vi.stubGlobal("history", { pushState: (_s: unknown, _t: string, url: string) => pushes.push(url) });
    vi.stubGlobal("window", { dispatchEvent: (e: Event) => events.push(e.type) });
    vi.stubGlobal("CustomEvent", class { type: string; constructor(type: string) { this.type = type; } });
    try {
      const form = renderAddressForm(view());
      // Find the link's click handler among the template's values.
      const handlers: ((e: MouseEvent) => void)[] = [];
      const walk = (node: unknown) => {
        if (Array.isArray(node)) { node.forEach(walk); return; }
        if (node && typeof node === "object" && "values" in node) (node as { values: unknown[] }).values.forEach(walk);
        if (typeof node === "function" && node.name === "openNetworkSettings") handlers.push(node as (e: MouseEvent) => void);
      };
      walk(form);
      expect(handlers).toHaveLength(1);
      let prevented = false;
      handlers[0]!({ button: 0, metaKey: false, ctrlKey: false, shiftKey: false, altKey: false, preventDefault: () => { prevented = true; } } as unknown as MouseEvent);
      expect(prevented).toBe(true);
      expect(pushes).toEqual([ADDRESSES_NETWORK_PATH]);
      expect(events).toEqual(["location-changed"]);
      // A click with a modifier is the browser's.
      handlers[0]!({ button: 0, metaKey: true, preventDefault: () => { throw new Error("prevented"); } } as unknown as MouseEvent);
      expect(pushes).toHaveLength(1);
    } finally {
      vi.unstubAllGlobals();
    }
  });
});

describe("the pairing dialog's third step", () => {
  const base = {
    name: "Left wrist",
    facts: "",
    art: html`<svg></svg>`,
    pagesHref: "#",
    onNewPage: () => {},
    onComplication: () => {},
    onAnother: () => {},
    onDone: () => {},
  };

  it("is left out until the addresses are in", () => {
    expect(flatten(renderPairNext(base))).not.toContain("Check its addresses");
  });

  it("shows both addresses with Change, and the form in place once Change is clicked", () => {
    const shown = flatten(renderPairNext({ ...base, addresses: { local: `${LOCAL} (automatic)`, remote: "None", onEdit: () => {} } }));
    expect(shown).toContain("Check its addresses");
    expect(shown).toContain(`Home network: ${LOCAL} (automatic)`);
    expect(shown).toContain("Internet: None");
    expect(shown).toContain("Change");
    const editing = flatten(renderPairNext({ ...base, addresses: { local: "x", remote: "y", editor: renderAddressForm(view()), onEdit: () => {} } }));
    expect(editing).toContain("Home network address");
    expect(editing).not.toContain("Home network: x");
  });
});

describe("the panel's wiring", () => {
  const detail = method("  private renderHomeDetail(");

  it("has the two commands in ha-api.ts", () => {
    expect(API).toContain(`type: "wrist_assistant/devices/addresses", watch_id: watchId,`);
    expect(API).toContain(`type: "wrist_assistant/devices/set_addresses", watch_id: watchId, ...slots,`);
  });

  it("shows a watch's addresses under its bar all the time, with no Addresses button", () => {
    expect(detail).toContain(`const addresses = row.kind === "watch" && !this.deviceForgetAsk && !gone ? this.renderHomeAddresses(ownerId) : nothing;`);
    expect(detail).not.toContain("ADDRESSES_BUTTON");
    expect(SOURCE).not.toContain("ADDRESSES_BUTTON");
    // Under the bar and its transient info, over the lineup.
    expect(detail.indexOf(`<div class="hb-bar">`)).toBeLessThan(detail.indexOf("${addresses}"));
    expect(detail.indexOf(`html\`<div class="hb-info">`)).toBeLessThan(detail.indexOf("${addresses}"));
    expect(detail.indexOf("${addresses}")).toBeLessThan(detail.indexOf("this.renderHomeLineup(row)"));
    expect(detail).toContain("renaming || this.deviceForgetAsk || gone ? html`<div class=\"hb-info\">");
  });

  it("draws the short block, with Edit opening the form in the same place", () => {
    const home = method("  private renderHomeAddresses(ownerId: string) {");
    expect(home).toContain("renderAddressBlock({");
    expect(home).toContain("editing,");
    expect(home).toContain("onEdit: () => void this.startAddressEdit(ownerId),");
    expect(home).toContain("form: this.addressFormView(ownerId),");
    expect(home).toContain(`<section class="hb-addrs \${editing ? "editing" : ""}" aria-label=\${ADDRESSES_TITLE}>`);
    // A watch shown without being picked reads its addresses once.
    expect(home).toContain("if (held === undefined && !this.addressReads.has(ownerId)) {");
    expect(home).toContain("queueMicrotask(() => void this.loadDeviceAddresses(ownerId));");
    expect(method("  private addressFormView(ownerId: string) {")).toContain(`saves: "own" as const,`);
  });

  it("reads a watch's addresses again each time it is picked on Home", () => {
    expect(method("  private openHomeDevice(ownerId: string, forget = false) {"))
      .toContain(`if (deviceKindOf(this.ownerOf(ownerId)) === "watch") void this.loadDeviceAddresses(ownerId);`);
  });

  it("hears the Settings page's saves", () => {
    expect(SOURCE).toContain("(watchId, record) => this.keepAddresses(watchId, { record }));");
  });

  it("holds one form at a time, and leaves it when another device is picked", () => {
    expect(method("  private startDeviceRename(ownerId: string) {")).toContain("this.stopAddressEdit();");
    const start = method("  private async startAddressEdit(ownerId: string) {");
    expect(start).toContain("this.deviceRename = undefined;");
    expect(start).toContain("this.addressEdit = { owner: ownerId, draft: addressDraft(record) };");
    expect(method("  private openHomeDevice(ownerId: string, forget = false) {")).toContain("this.stopAddressEdit();");
    expect(method("  private resetHomeDetail() {")).toContain("this.stopAddressEdit();");
    expect(method("  private stopAddressEdit() {")).toContain("if (this.addressBusy) return;");
  });

  it("keeps each watch's addresses on their own, and keeps what was shown when a read again fails", () => {
    const load = method("  private async loadDeviceAddresses(ownerId: string)");
    expect(load).toContain("this.keepAddresses(ownerId, { record });");
    expect(load).toContain("shown === undefined ? { error: `Could not read the addresses: ${errText(err)}` } : { record: shown }");
    expect(load).toContain("this.addressReads.delete(ownerId);");
  });

  it("sends only the changed slots, checked first, and words an invalid_url refusal", () => {
    const save = method("  private async saveAddressesNow(ownerId: string) {");
    expect(save).toContain("const slots = changedSlots(shown, draft);");
    expect(save).toContain("if (slots.length === 0) return;");
    expect(save.indexOf("addressPayload(draft, slots)")).toBeLessThan(save.indexOf("setDeviceAddresses("));
    expect(save).toContain(`code === "invalid_url"`);
    expect(save).toContain("invalidAddressText(");
    expect(save).toContain("this.keepAddresses(ownerId, { record });");
  });

  it("typing an address picks Set", () => {
    expect(method("  private editAddressSlot(")).toContain("withSlotEdit(edit.draft, slot, change)");
  });

  it("shows the addresses in the pairing dialog's what next, editable in place", () => {
    const next = method("  private renderPairNextBody(watchId: string) {");
    expect(next).toContain(`local: addressWords(addresses, "local"),`);
    expect(next).toContain(`remote: addressWords(addresses, "remote"),`);
    expect(next).toContain("editor: this.addressEdit?.owner === watchId ? this.renderAddressEditor(watchId) : undefined,");
    expect(next).toContain("onEdit: () => void this.startAddressEdit(watchId),");
    expect(method("  private closePairDialog() {")).toContain("this.stopAddressEdit();");
  });

  it("carries the form's look", () => {
    expect(SOURCE).toContain("homeStyles, addressStyles,");
  });
});
