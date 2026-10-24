// A watch's two addresses: its home network address and its internet
// address, kept by the integration for each watch (`watch_addresses.py`).
// Each is Automatic (Home Assistant's own Settings, System, Network), an
// address someone set, or None. The watch reads them after it pairs and
// whenever they change, so the panel always shows what the watch uses.
//
// Edited in two places with the same form: a watch's page on Home, under
// its Addresses button, and the "what next" step of Home's pairing dialog.
// The panel holds the state; the words, the rules and the form are here so
// the tests read them without a DOM.

import { css, html, nothing, type TemplateResult } from "lit";
import { live } from "lit/directives/live.js";
import type { AddressSource, DeviceAddresses } from "./ha-api.js";

export type AddressSlot = "local" | "remote";

/** One slot as the form holds it: the setting picked, and the text typed. */
export interface AddressSlotDraft {
  mode: AddressSource;
  text: string;
}

export interface AddressDraft {
  local: AddressSlotDraft;
  remote: AddressSlotDraft;
}

export const ADDRESS_SLOTS: readonly AddressSlot[] = ["local", "remote"];

export const ADDRESS_LABELS: Record<AddressSlot, string> = {
  local: "Home network address",
  remote: "Internet address",
};

/** What each slot is for, under its name. */
export const ADDRESS_HINTS: Record<AddressSlot, string> = {
  local: "Used on the same Wi-Fi as Home Assistant.",
  remote: "Used when the watch is away from home.",
};

export const ADDRESS_PLACEHOLDERS: Record<AddressSlot, string> = {
  local: "http://homeassistant.local:8123",
  remote: "https://example.duckdns.org",
};

export const ADDRESS_MODES: readonly { mode: AddressSource; label: string }[] = [
  { mode: "auto", label: "Automatic" },
  { mode: "set", label: "Set" },
  { mode: "none", label: "None" },
];

export const ADDRESSES_BUTTON_TEXT = "Addresses";
export const ADDRESSES_BUTTON_TITLE = "The addresses this watch uses to reach Home Assistant";
export const ADDRESSES_NETWORK_PATH = "/config/network";
export const ADDRESSES_NETWORK_TEXT = "Settings > System > Network";
export const ADDRESSES_NOTHING_DETECTED = "nothing set in Home Assistant";
export const ADDRESSES_SAVED_NOTE = "The watch picks up a change the next time it checks in.";

const SET_FORM = /^https?:\/\/[^\s/?#@]+\/?$/i;

/** The address an Automatic slot follows: the internal URL at home, the
 * external URL away, else the Home Assistant Cloud one. */
export function automaticAddress(record: Pick<DeviceAddresses, "detected">, slot: AddressSlot): string | null {
  const d = record.detected;
  return slot === "local" ? d.internal : (d.external ?? d.cloud);
}

/** "Automatic: <address>", or that Home Assistant has none. */
export function automaticLine(record: Pick<DeviceAddresses, "detected">, slot: AddressSlot): string {
  return `Automatic: ${automaticAddress(record, slot) ?? ADDRESSES_NOTHING_DETECTED}`;
}

/** The form's starting point: each slot's setting, with the address typed
 * in when it is one someone set. */
export function addressDraft(record: DeviceAddresses): AddressDraft {
  const slot = (source: AddressSource, url: string | null): AddressSlotDraft => ({
    mode: source,
    text: source === "set" ? (url ?? "") : "",
  });
  return { local: slot(record.local_source, record.local_url), remote: slot(record.remote_source, record.remote_url) };
}

/** Why a typed address will not do, or undefined when it will. The
 * integration checks again, and its answer is the one that counts. */
export function addressProblem(text: string): string | undefined {
  const typed = text.trim();
  if (typed === "") return "Type an address, or pick Automatic or None.";
  if (!/^https?:\/\//i.test(typed)) return "Start the address with http:// or https://.";
  if (!SET_FORM.test(typed)) return "Leave out any path after the address and port.";
  return undefined;
}

/** What to send for a draft: null for Automatic, "" for None, the typed
 * address for Set. A Set slot with no usable address stops the save and
 * names the slot. */
export function addressPayload(draft: AddressDraft):
  { ok: true; slots: { local_url: string | null; remote_url: string | null } }
  | { ok: false; slot: AddressSlot; message: string } {
  const value = (slot: AddressSlot): string | null | { problem: string } => {
    const d = draft[slot];
    if (d.mode === "auto") return null;
    if (d.mode === "none") return "";
    const problem = addressProblem(d.text);
    return problem === undefined ? d.text.trim() : { problem };
  };
  const local = value("local");
  const remote = value("remote");
  for (const [slot, v] of [["local", local], ["remote", remote]] as const) {
    if (v !== null && typeof v === "object") return { ok: false, slot, message: `${ADDRESS_LABELS[slot]}: ${v.problem}` };
  }
  return { ok: true, slots: { local_url: local as string | null, remote_url: remote as string | null } };
}

/** The words for an `invalid_url` refusal, naming the slot the integration
 * named. */
export function invalidAddressText(message: string | undefined): string {
  const slot: AddressSlot | undefined = message?.includes("remote_url") ? "remote" : message?.includes("local_url") ? "local" : undefined;
  const lead = slot === undefined ? "That address" : `The ${ADDRESS_LABELS[slot].toLowerCase()}`;
  return `${lead} cannot be used. Start it with http:// or https://, and leave out any path.`;
}

/** One slot in a line: the address the watch uses and where it comes
 * from, for the pairing dialog. */
export function addressWords(record: DeviceAddresses, slot: AddressSlot): string {
  const source = slot === "local" ? record.local_source : record.remote_source;
  const url = slot === "local" ? record.local_url : record.remote_url;
  if (source === "none") return "None";
  if (source === "auto") return url === null ? `Automatic, ${ADDRESSES_NOTHING_DETECTED}` : `${url} (automatic)`;
  return url ?? "None";
}

/** Move inside Home Assistant the way its own frontend does, so the
 * Network settings open in place. A click with a modifier is left to the
 * browser. */
export function openNetworkSettings(e: MouseEvent): void {
  if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  e.preventDefault();
  history.pushState(null, "", ADDRESSES_NETWORK_PATH);
  window.dispatchEvent(new CustomEvent("location-changed", { detail: { replace: false } }));
}

export interface AddressFormView {
  /** The record as the integration has it, once it is in. */
  record?: DeviceAddresses;
  /** The form's own copy, once the record is in. */
  draft?: AddressDraft;
  busy: boolean;
  error?: string;
  onMode: (slot: AddressSlot, mode: AddressSource) => void;
  onText: (slot: AddressSlot, text: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

/**
 * The form: for each address its name and what it is for, a choice of
 * Automatic, Set or None, the address field, and what Automatic gives.
 * Typing in the field picks Set. A line under both links to Home
 * Assistant's Network settings, which Automatic follows. Escape cancels.
 */
export function renderAddressForm(v: AddressFormView): TemplateResult {
  const { record, draft } = v;
  if (record === undefined || draft === undefined) {
    return html`<div class="hb-addr">
      ${v.error ? html`<p class="dev-err">${v.error}</p>` : html`<p class="dev-small">Loading…</p>`}
      <div class="dev-acts"><button type="button" class="ghost" @click=${v.onCancel}>Cancel</button></div>
    </div>`;
  }
  const slot = (s: AddressSlot) => {
    const d = draft[s];
    return html`<fieldset class="dev-addr-slot" ?disabled=${v.busy}>
      <legend>${ADDRESS_LABELS[s]}</legend>
      <p class="dev-small">${ADDRESS_HINTS[s]}</p>
      <div class="dev-addr-modes" role="radiogroup" aria-label=${ADDRESS_LABELS[s]}>
        ${ADDRESS_MODES.map((m) => html`<label class="dev-addr-mode ${d.mode === m.mode ? "on" : ""}">
          <input type="radio" name=${`addr-${s}`} value=${m.mode} .checked=${live(d.mode === m.mode)}
            @change=${() => v.onMode(s, m.mode)} /><span>${m.label}</span></label>`)}
      </div>
      <input type="url" class="dev-addr-in" inputmode="url" autocomplete="off" spellcheck="false"
        aria-label=${ADDRESS_LABELS[s]} placeholder=${automaticAddress(record, s) ?? ADDRESS_PLACEHOLDERS[s]}
        .value=${live(d.mode === "set" ? d.text : "")} ?disabled=${d.mode === "none"}
        @input=${(e: Event) => v.onText(s, (e.target as HTMLInputElement).value)} />
      <p class="dev-small dev-addr-auto">${automaticLine(record, s)}</p>
    </fieldset>`;
  };
  return html`<div class="hb-addr">
    <form class="dev-addr" @submit=${(e: Event) => { e.preventDefault(); v.onSave(); }}
      @keydown=${(e: KeyboardEvent) => {
        if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); v.onCancel(); }
      }}>
      ${ADDRESS_SLOTS.map(slot)}
      <p class="dev-small">Automatic follows <a href=${ADDRESSES_NETWORK_PATH} @click=${openNetworkSettings}>${ADDRESSES_NETWORK_TEXT}</a> in Home Assistant. ${ADDRESSES_SAVED_NOTE}</p>
      ${v.error ? html`<p class="dev-err">${v.error}</p>` : nothing}
      <div class="dev-acts">
        <button type="submit" class="home-btn" ?disabled=${v.busy}>${v.busy ? "Saving…" : "Save"}</button>
        <button type="button" class="ghost" ?disabled=${v.busy} @click=${v.onCancel}>Cancel</button>
      </div>
    </form>
  </div>`;
}

/** The form's look: each address in a hairline box, the three choices as a
 * small segmented row, the field full width under them. */
export const addressStyles = css`
  .hb-addr { display: flex; flex-direction: column; gap: 10px; }
  .dev-addr { display: flex; flex-direction: column; gap: 10px; }
  .dev-addr-slot {
    margin: 0; min-width: 0; display: flex; flex-direction: column; gap: 7px; padding: 10px 12px 11px;
    border: 1px solid var(--wa-line-strong); border-radius: 12px; background: var(--wa-card);
  }
  .dev-addr-slot legend { padding: 0 4px; margin-left: -4px; font-size: 13px; font-weight: 500; color: var(--wa-ink); }
  .dev-addr-modes { display: inline-flex; align-self: flex-start; border: 1px solid var(--wa-line-strong); border-radius: 8px; overflow: hidden; }
  .dev-addr-mode { position: relative; display: inline-flex; align-items: center; padding: 4px 12px; font-size: 12.5px; color: var(--wa-muted); cursor: pointer; }
  .dev-addr-mode + .dev-addr-mode { border-left: 1px solid var(--wa-line-strong); }
  .dev-addr-mode input { position: absolute; inset: 0; margin: 0; opacity: 0; cursor: pointer; }
  .dev-addr-mode.on { color: var(--wa-ink); background: color-mix(in srgb, var(--wa-ink) 9%, transparent); }
  .dev-addr-mode:has(input:focus-visible) { box-shadow: var(--wa-ring); }
  .dev-addr-in { width: 100%; height: 32px; box-sizing: border-box; }
  .dev-addr-in:disabled { opacity: .55; }
  .dev-addr-auto { overflow-wrap: anywhere; }
  .dev-addr a { color: var(--wa-hue-blue); text-decoration: none; }
  .dev-addr a:hover { text-decoration: underline; }
`;
