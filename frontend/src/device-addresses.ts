// A device's two addresses: its home network address and its internet
// address, kept by the integration for each paired watch and iPhone
// (`watch_addresses.py`). Each is Automatic (Home Assistant's own Settings,
// System, Network), an address someone set, or None. The device reads them
// after it pairs and whenever they change, so the panel always shows what
// the device uses.
//
// Shown and edited in three places with the same parts: a watch's or an
// iPhone's page on Home, which shows both addresses under its bar with Edit
// opening the form in place; the Connection card of the Watch app's
// Settings page (watches only), the same block, whose form the page's own
// Save saves; and the "what next" step of Home's pairing dialog. The panel
// and the Settings page hold the state; the words, the rules and the drawing
// are here so the tests read them without a DOM. The few words that name
// the device take it (`AddressDevice`), a watch when left out.

import { css, html, nothing, type TemplateResult } from "lit";
import { live } from "lit/directives/live.js";
import type { AddressSource, DeviceAddresses } from "./ha-api.js";

export type AddressSlot = "local" | "remote";

/** The device the addresses belong to, for the words that name it. */
export type AddressDevice = "watch" | "iphone";

/** The device as a sentence says it: "watch" or "iPhone". */
function deviceNoun(device: AddressDevice): string {
  return device === "iphone" ? "iPhone" : "watch";
}

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

/** What each slot is for, under its name, for the device it belongs to. */
export function addressHint(slot: AddressSlot, device: AddressDevice = "watch"): string {
  return slot === "local" ? "Used on the same Wi-Fi as Home Assistant." : `Used when the ${deviceNoun(device)} is away from home.`;
}

/** What each slot is for, under its name, on a watch. */
export const ADDRESS_HINTS: Record<AddressSlot, string> = {
  local: addressHint("local"),
  remote: addressHint("remote"),
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

/** Each slot's name in the short block that shows both. */
export const ADDRESS_SHORT_LABELS: Record<AddressSlot, string> = {
  local: "Home network",
  remote: "Internet",
};

export const ADDRESSES_TITLE = "Addresses";
/** What the addresses are, for the device they belong to. */
export function addressesHelp(device: AddressDevice = "watch"): string {
  return `The two addresses this ${deviceNoun(device)} uses to reach Home Assistant.`;
}
export const ADDRESSES_HELP = addressesHelp();
export const ADDRESSES_EDIT_TEXT = "Edit";
/** Edit's tooltip, for the device the addresses belong to. */
export function addressesEditTitle(device: AddressDevice = "watch"): string {
  return `Change the addresses this ${deviceNoun(device)} uses to reach Home Assistant`;
}
export const ADDRESSES_EDIT_TITLE = addressesEditTitle();
/** The quiet tag on a slot that follows Home Assistant. */
export const ADDRESSES_AUTOMATIC_TAG = "Automatic";
export const ADDRESSES_NONE = "None";
export const ADDRESSES_LOADING = "Loading the addresses…";
/** Under the form on the Settings page, whose Save at the top saves it. */
export const ADDRESSES_PAGE_SAVE_NOTE = "Press Save at the top to keep these.";
/** The words a settings search looks through for the addresses. */
export const ADDRESSES_SEARCH_WORDS = "Addresses, address, URL, home network, internet, local, remote, external, internal, Nabu Casa, Home Assistant Cloud";
export const ADDRESSES_NETWORK_PATH = "/config/network";
export const ADDRESSES_NETWORK_TEXT = "Settings > System > Network";
export const ADDRESSES_NOTHING_DETECTED = "nothing set in Home Assistant";
/** When a saved change reaches the device. */
export function addressesSavedNote(device: AddressDevice = "watch"): string {
  return `The ${deviceNoun(device)} picks up a change the next time it checks in.`;
}
export const ADDRESSES_SAVED_NOTE = addressesSavedNote();

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

/** One slot of a draft changed: a mode picked, or an address typed. Typing
 * picks Set, whatever the slot was on, so a field on Automatic or None never
 * holds words it would not save. */
export function withSlotEdit(draft: AddressDraft, slot: AddressSlot, change: { mode?: AddressSource; text?: string }): AddressDraft {
  const was = draft[slot];
  const next: AddressSlotDraft = { mode: change.mode ?? (change.text !== undefined ? "set" : was.mode), text: change.text ?? was.text };
  return { ...draft, [slot]: next };
}

/** The slots a draft changes from the record: another mode, or for Set
 * another address. Space round a typed address does not count. */
export function changedSlots(record: DeviceAddresses, draft: AddressDraft): AddressSlot[] {
  const base = addressDraft(record);
  return ADDRESS_SLOTS.filter((s) => {
    const d = draft[s];
    if (d.mode !== base[s].mode) return true;
    return d.mode === "set" && d.text.trim() !== base[s].text.trim();
  });
}

/** A draft kept while the page was away, laid over a record read since: the
 * slots it changed from the record it was made on keep their edit, unless
 * the newer record already says the same. The other slots follow the newer
 * record. */
export function restoreAddressDraft(kept: { record: DeviceAddresses; draft: AddressDraft }, fresh: DeviceAddresses): AddressDraft {
  const out = addressDraft(fresh);
  for (const s of changedSlots(kept.record, kept.draft)) out[s] = { ...kept.draft[s] };
  return out;
}

type SlotsPayload = { local_url?: string | null; remote_url?: string | null };

/** What to send for a draft: null for Automatic, "" for None, the typed
 * address for Set. `only` limits it to those slots, so a slot nobody
 * touched stays as Home Assistant has it. A Set slot with no usable address
 * stops the save and names the slot. */
export function addressPayload(draft: AddressDraft, only: readonly AddressSlot[] = ADDRESS_SLOTS):
  { ok: true; slots: SlotsPayload }
  | { ok: false; slot: AddressSlot; message: string } {
  const slots: SlotsPayload = {};
  for (const slot of ADDRESS_SLOTS) {
    if (!only.includes(slot)) continue;
    const d = draft[slot];
    let value: string | null;
    if (d.mode === "auto") value = null;
    else if (d.mode === "none") value = "";
    else {
      const problem = addressProblem(d.text);
      if (problem !== undefined) return { ok: false, slot, message: `${ADDRESS_LABELS[slot]}: ${problem}` };
      value = d.text.trim();
    }
    slots[slot === "local" ? "local_url" : "remote_url"] = value;
  }
  return { ok: true, slots };
}

/** One slot as the short block shows it: the address the watch uses, null
 * for none, and whether it follows Home Assistant. */
export function addressShown(record: DeviceAddresses, slot: AddressSlot): { url: string | null; automatic: boolean } {
  const source = slot === "local" ? record.local_source : record.remote_source;
  const url = slot === "local" ? record.local_url : record.remote_url;
  return { url: source === "none" ? null : url, automatic: source === "auto" };
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
  /** Who saves the form. `own` (the default): its own Save, lit once
   * something changed, beside Cancel. `page`: the Settings page's Save at
   * the top does, so the form says so and keeps only Cancel. */
  saves?: "own" | "page";
  /** Whose addresses they are, for the words that name it. A watch when
   * left out. */
  device?: AddressDevice;
  onMode: (slot: AddressSlot, mode: AddressSource) => void;
  onText: (slot: AddressSlot, text: string) => void;
  /** Enter in a field. */
  onSave: () => void;
  onCancel: () => void;
}

/**
 * The form: for each address its name and what it is for, a choice of
 * Automatic, Set or None, the address field, and what Automatic gives.
 * Typing in the field picks Set, from Automatic or None too, so the field
 * is never greyed out. A line under both links to Home Assistant's Network
 * settings, which Automatic follows. Save wears the panel's call to action,
 * the Settings page's own green Save, and stays greyed out until something
 * changed. Escape cancels.
 */
export function renderAddressForm(v: AddressFormView): TemplateResult {
  const { record, draft } = v;
  if (record === undefined || draft === undefined) {
    return html`<div class="hb-addr">
      ${v.error ? html`<p class="dev-err">${v.error}</p>` : html`<p class="dev-small">Loading…</p>`}
      <div class="dev-acts"><button type="button" class="ghost" @click=${v.onCancel}>Cancel</button></div>
    </div>`;
  }
  const changed = changedSlots(record, draft).length > 0;
  const page = v.saves === "page";
  const device = v.device ?? "watch";
  const slot = (s: AddressSlot) => {
    const d = draft[s];
    return html`<fieldset class="dev-addr-slot" ?disabled=${v.busy}>
      <legend>${ADDRESS_LABELS[s]}</legend>
      <p class="dev-small">${addressHint(s, device)}</p>
      <div class="dev-addr-modes" role="radiogroup" aria-label=${ADDRESS_LABELS[s]}>
        ${ADDRESS_MODES.map((m) => html`<label class="dev-addr-mode ${d.mode === m.mode ? "on" : ""}">
          <input type="radio" name=${`addr-${s}`} value=${m.mode} .checked=${live(d.mode === m.mode)}
            @change=${() => v.onMode(s, m.mode)} /><span>${m.label}</span></label>`)}
      </div>
      <input type="url" class="dev-addr-in ${d.mode === "set" ? "" : "idle"}" inputmode="url" autocomplete="off" spellcheck="false"
        aria-label=${ADDRESS_LABELS[s]} placeholder=${(d.mode === "auto" ? automaticAddress(record, s) : undefined) ?? ADDRESS_PLACEHOLDERS[s]}
        .value=${live(d.mode === "set" ? d.text : "")}
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
      <p class="dev-small">Automatic follows <a href=${ADDRESSES_NETWORK_PATH} @click=${openNetworkSettings}>${ADDRESSES_NETWORK_TEXT}</a> in Home Assistant. ${addressesSavedNote(device)}</p>
      ${v.error ? html`<p class="dev-err">${v.error}</p>` : nothing}
      <div class="dev-acts">
        ${page
          ? html`<p class="dev-small dev-addr-page">${ADDRESSES_PAGE_SAVE_NOTE}</p>`
          : html`<button type="submit" class="primary save ${changed ? "dirty" : ""}" ?disabled=${v.busy || !changed}
              title=${changed ? "Save the addresses" : "Nothing changed yet"}>${v.busy ? "Saving…" : "Save"}</button>`}
        <button type="button" class="ghost" ?disabled=${v.busy} @click=${v.onCancel}>Cancel</button>
      </div>
    </form>
  </div>`;
}

export interface AddressBlockView {
  /** The record as the integration has it, once it is in. */
  record?: DeviceAddresses;
  /** Why it could not be read. */
  readError?: string;
  /** The form is open in the block's place. */
  editing: boolean;
  onEdit: () => void;
  /** The form, when `editing`. */
  form: AddressFormView;
  /** Whose addresses they are, for Edit's tooltip. A watch when left out. */
  device?: AddressDevice;
}

/**
 * Both addresses, short: one line each, the slot's name, the address the
 * watch or iPhone uses or None, and a quiet Automatic tag when it follows Home
 * Assistant. One Edit button opens the form in the block's place. No
 * explaining until then; the form says what each address is for.
 */
export function renderAddressBlock(v: AddressBlockView): TemplateResult {
  if (v.editing) return renderAddressForm(v.form);
  const record = v.record;
  if (record === undefined) {
    return html`<div class="addr-sum">${v.readError
      ? html`<p class="dev-err">${v.readError}</p>`
      : html`<p class="dev-small">${ADDRESSES_LOADING}</p>`}</div>`;
  }
  const line = (s: AddressSlot) => {
    const { url, automatic } = addressShown(record, s);
    return html`<div class="addr-sum-line">
      <dt>${ADDRESS_SHORT_LABELS[s]}</dt>
      <dd><span class="addr-sum-url ${url === null ? "none" : ""}" title=${url ?? nothing}>${url ?? ADDRESSES_NONE}</span>${automatic
        ? html`<span class="addr-sum-tag" title="Follows Home Assistant's Network settings">${ADDRESSES_AUTOMATIC_TAG}</span>`
        : nothing}</dd>
    </div>`;
  };
  return html`<div class="addr-sum">
    <dl class="addr-sum-list" aria-label=${ADDRESSES_TITLE}>${ADDRESS_SLOTS.map(line)}</dl>
    <button type="button" class="small lined addr-sum-edit" title=${addressesEditTitle(v.device)} @click=${v.onEdit}>${ADDRESSES_EDIT_TEXT}</button>
  </div>`;
}

/** The look: the short block as two lines of name and address with Edit at
 * their right; the form with each address in a hairline box, the three
 * choices as a small segmented row, the field full width under them. */
export const addressStyles = css`
  .addr-sum { display: flex; align-items: flex-start; gap: 12px; min-width: 0; }
  .addr-sum > p { flex: 1; }
  .addr-sum-list {
    flex: 1; min-width: 0; margin: 0;
    display: grid; grid-template-columns: max-content minmax(0, 1fr); column-gap: 14px; row-gap: 4px; align-items: baseline;
  }
  .addr-sum-line { display: contents; }
  .addr-sum-list dt { font-size: 12.5px; color: var(--wa-muted); white-space: nowrap; }
  .addr-sum-list dd { margin: 0; min-width: 0; display: flex; align-items: baseline; gap: 7px; }
  .addr-sum-url { min-width: 0; font-size: 13px; color: var(--wa-ink); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .addr-sum-url.none { color: var(--wa-muted); }
  .addr-sum-tag {
    flex: none; padding: 1px 7px; border-radius: 999px; font-size: 11px; line-height: 16px; color: var(--wa-muted);
    background: color-mix(in srgb, var(--wa-ink) 7%, transparent);
  }
  .addr-sum-edit { flex: none; }
  /* Very narrow: each address goes under its name. */
  @container (max-width: 360px) {
    .addr-sum-list { grid-template-columns: minmax(0, 1fr); row-gap: 0; }
    .addr-sum-line + .addr-sum-line dt { margin-top: 6px; }
  }
  .dev-addr-page { flex: 1 1 180px; }
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
  .dev-addr-in.idle:not(:focus) { opacity: .7; }
  .dev-addr-auto { overflow-wrap: anywhere; }
  .dev-addr a { color: var(--wa-hue-blue); text-decoration: none; }
  .dev-addr a:hover { text-decoration: underline; }
`;
