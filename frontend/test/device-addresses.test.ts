// A watch's two addresses in the panel: the words and rules in
// device-addresses.ts, the form it draws, the pairing dialog's third step,
// and how panel.ts wires them, read from its source since no test mounts the
// panel (as panel-home-source.test.ts does).

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { html, nothing } from "lit";
import { describe, expect, it, vi } from "vitest";
import {
  ADDRESSES_NETWORK_PATH,
  addressDraft,
  addressPayload,
  addressProblem,
  addressWords,
  automaticLine,
  invalidAddressText,
  renderAddressForm,
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

  it("puts an Addresses button beside Rename on a watch's page, and the form in its info", () => {
    expect(detail).toContain(`const editingAddresses = row.kind === "watch" && this.addressEdit?.owner === ownerId;`);
    expect(detail).toContain(`\${row.kind === "watch" && !this.deviceForgetAsk && !renaming && !editingAddresses && !gone`);
    expect(detail).toContain("@click=${() => void this.startAddressEdit(ownerId)}>${ADDRESSES_BUTTON_TEXT}</button>");
    expect(detail.indexOf(">Rename</button>")).toBeLessThan(detail.indexOf("${ADDRESSES_BUTTON_TEXT}</button>"));
    expect(detail.indexOf("${ADDRESSES_BUTTON_TEXT}</button>")).toBeLessThan(detail.indexOf(">Remove</button>"));
    expect(detail).toContain("${editingAddresses && !this.deviceForgetAsk ? this.renderAddressEditor(ownerId) : nothing}");
    expect(detail).toContain("renaming || editingAddresses || this.deviceForgetAsk || gone ? html`<div class=\"hb-info\">");
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

  it("drops a late read for another watch", () => {
    const load = method("  private async loadDeviceAddresses(ownerId: string)");
    expect(load).toContain("if (this.deviceAddresses?.owner !== ownerId) return undefined;");
  });

  it("checks the draft first, then sends it, and words an invalid_url refusal", () => {
    const save = method("  private async saveAddressesNow(ownerId: string) {");
    expect(save.indexOf("addressPayload(draft)")).toBeLessThan(save.indexOf("setDeviceAddresses("));
    expect(save).toContain(`code === "invalid_url"`);
    expect(save).toContain("invalidAddressText(");
    expect(save).toContain("this.deviceAddresses = { owner: ownerId, record };");
  });

  it("typing an address picks Set", () => {
    expect(method("  private editAddressSlot(")).toContain(`change.mode ?? (change.text !== undefined ? "set" : was.mode)`);
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
