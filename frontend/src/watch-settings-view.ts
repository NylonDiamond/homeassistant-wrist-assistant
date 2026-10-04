// The Watch settings dialog: one watch's simple behavior settings, edited in
// the panel and saved to the copy Home Assistant keeps for the watch.
//
// It is a controller rather than an element of its own so it draws inside the
// panel's shadow root and wears the panel's own rows: the inspector's tinted
// cards, its switches, segmented choices, selects, color and entity fields, and
// the header's sync pill for where a save has got to. Everything that decides
// something lives in `watch-settings.ts`, which the tests read without a DOM.
//
// The path a change takes: the panel saves a new revision, and the watch pulls
// it the next time it checks, or the iPhone app pulls it (launch, foreground,
// reconnect) and passes it on the way it sends any settings change. A watch
// with no record yet gets one from "Start with the defaults". There is no
// live line, so while a save waits the dialog asks the store again now and
// then and turns the pill green once a device has it.

import { css, html, nothing, type ReactiveController, type ReactiveControllerHost, type TemplateResult } from "lit";
import { checkField, colorField, entityField, entityRefFor, selectField, settingTitle } from "./editors.js";
import {
  type HassLike,
  type OwnerSummary,
  type PairLookupFound,
  type WatchConfigRecord,
  confirmPairCode,
  fetchWatchConfig,
  lookupPairCode,
  saveWatchConfig,
} from "./ha-api.js";
import { SECTION_COLOR } from "./kinds.js";
import { peopleOf } from "./people.js";
import { personColorVar } from "./pickerRows.js";
import type { IconProvider } from "./renderer.js";
import { agoWords } from "./send-state.js";
import { type UiIconName, uiIcon } from "./ui-icons.js";
import {
  type CatalogSection,
  type CatalogSetting,
  type SettingValue,
  COLLECTED_PILL_TEXT,
  PAIR_CODE_LENGTH,
  PAIR_NOT_FOUND_TEXT,
  SETTINGS_NO_RECORD_TEXT,
  SETTINGS_PAIR_FIRST_TEXT,
  SETTINGS_START_BUTTON,
  SETTINGS_START_CONFLICT_TEXT,
  SETTINGS_UNREADABLE_TEXT,
  START_PHONE_FIRST_TEXT,
  WAITING_HELP_TEXT,
  WAITING_PILL_TEXT,
  WATCH_SETTINGS_CATALOG,
  buildSaveDocument,
  conflictRevision,
  createWatchBehavior,
  deliveryState,
  dirtyKeys,
  errorCode,
  formValues,
  initialWatch,
  normalizePairCode,
  optionsFor,
  pairCodeIsComplete,
  pairErrorText,
  pairLookupLine,
  pairLookupWarnings,
  pairRemoteWarning,
  pairRequestLine,
  pairedText,
  savedByWords,
  sectionRuns,
  settingValue,
  settingsWatches,
  watchName,
  watchRecordUnreadable,
  withEdit,
} from "./watch-settings.js";
import { type TileChoice, optionPreview, settingIcon, tileChoices, usesTiles } from "./watch-settings-look.js";

/** How often an open dialog asks whether a device has collected a save. */
const DELIVERY_POLL_MS = 15_000;

/** Each card's mark and tint, from the inspector's own palette. */
const SECTION_LOOK: Record<string, { icon: UiIconName; color: string }> = {
  connection: { icon: "globe", color: SECTION_COLOR.place },
  interaction: { icon: "tap", color: SECTION_COLOR.tap },
  navigation: { icon: "pages", color: SECTION_COLOR.numbers },
  camera: { icon: "image", color: SECTION_COLOR.look },
};

/** The pairing card's mark and tint. */
const PAIR_LOOK: { icon: UiIconName; color: string } = { icon: "link", color: SECTION_COLOR.complication };

interface Note {
  text: string;
  kind: "note" | "warn" | "err";
}

/** A question the foot asks before edits are thrown away. */
interface Confirm {
  text: string;
  label: string;
  run: () => void;
}

type PanelHost = ReactiveControllerHost & { renderRoot: ParentNode };

/** Reads the device list again and answers it, so a watch that has just been
 * paired shows up as a tab. The panel's own full owners load. */
type RefreshOwners = () => Promise<readonly OwnerSummary[]>;

/** The "Pair a watch" card's state: the code being typed, then what looking
 * it up found, then the pairing. */
interface PairState {
  code: string;
  /** The watch waiting on `code`, once looked up. */
  found?: PairLookupFound & { code: string };
  notFound?: boolean;
  busy?: "lookup" | "confirm";
  error?: string;
  /** "Paired <name>." after a confirm. */
  done?: string;
}

export class WatchSettings implements ReactiveController {
  private open = false;
  private hass?: HassLike;
  private ownerId?: string;
  private record?: WatchConfigRecord;
  private loading = false;
  private loadError?: string;
  private edits: ReadonlyMap<string, SettingValue> = new Map();
  private saving = false;
  /** "Start with the defaults" is out. */
  private starting = false;
  private note?: Note;
  private confirm?: Confirm;
  /** Sections whose help is hidden. Help starts shown: this is a form people
   * fill once, and its short titles ("Delay", "Debounce") need their line. */
  private helpOff: ReadonlySet<string> = new Set();
  /** Bumped by every load, so a reply that arrives after another watch was
   * picked, or after a newer load, is dropped. */
  private loadSeq = 0;
  private pollTimer?: number;
  private pair: PairState = { code: "" };
  /** Bumped by every change of code and by closing, so a lookup that answers
   * for a code no longer in the field is dropped. */
  private pairSeq = 0;
  /** Bumped by every open and close, so a pairing that answers after the
   * dialog was shut leaves the next visit's card alone. */
  private visit = 0;

  /** `icons` is the panel's symbol provider, asked on every draw: it loads
   * its file on first use and wakes the panel when it can draw more. */
  constructor(
    private readonly host: PanelHost,
    private readonly refreshOwners?: RefreshOwners,
    private readonly icons?: () => IconProvider | undefined,
  ) {
    host.addController(this);
  }

  hostDisconnected(): void {
    this.stopPolling();
  }

  /** The dialog is only in the tree while open, and a native dialog needs
   * showModal() for its backdrop, focus trap and Escape. */
  hostUpdated(): void {
    if (!this.open) return;
    const dialog = this.host.renderRoot.querySelector<HTMLDialogElement>("dialog.ws-dialog");
    if (dialog && !dialog.open) dialog.showModal();
  }

  private changed(): void {
    this.host.requestUpdate();
  }

  // ── opening, loading, saving ───────────────────────────────────────────

  /** Open on the watch being edited when it is one, else the home's first.
   * A home with no watch yet opens on the pairing card alone. */
  show(hass: HassLike, owners: readonly OwnerSummary[], current: string | undefined): void {
    this.hass = hass;
    const id = initialWatch(settingsWatches(owners), current);
    this.open = true;
    this.confirm = undefined;
    this.note = undefined;
    this.visit++;
    this.pairSeq++;
    this.pair = { code: "" };
    if (id === undefined) {
      // Nothing to load: clear whatever an earlier visit left, a load cut off
      // by closing included, so the card says no watch has connected.
      this.loadSeq++;
      this.ownerId = undefined;
      this.record = undefined;
      this.loadError = undefined;
      this.loading = false;
    }
    this.changed();
    if (id !== undefined) void this.load(id);
  }

  private async load(ownerId: string, keepNote = false): Promise<void> {
    const hass = this.hass;
    if (!hass) return;
    const seq = ++this.loadSeq;
    this.ownerId = ownerId;
    this.record = undefined;
    this.edits = new Map();
    this.loading = true;
    this.loadError = undefined;
    if (!keepNote) this.note = undefined;
    this.stopPolling();
    this.changed();
    try {
      const record = await fetchWatchConfig(hass, ownerId, "behavior");
      if (seq !== this.loadSeq) return;
      this.record = record;
    } catch (err) {
      if (seq !== this.loadSeq) return;
      this.loadError = errText(err);
    }
    this.loading = false;
    this.pollIfWaiting();
    this.changed();
  }

  private async save(): Promise<void> {
    const hass = this.hass;
    const ownerId = this.ownerId;
    const record = this.record;
    if (!hass || ownerId === undefined || record?.document === undefined || this.saving) return;
    if (dirtyKeys(record.document, this.edits).length === 0) return;
    const document = buildSaveDocument(record.document, this.edits);
    this.saving = true;
    this.note = undefined;
    this.changed();
    try {
      const reply = await saveWatchConfig(hass, ownerId, "behavior", record.revision, document);
      if (ownerId !== this.ownerId || !this.open) return;
      // The store keeps the document as sent, so what was sent is the new
      // revision. Delivery stays where it was: no device has seen it yet.
      this.record = {
        ...record,
        revision: reply.revision,
        updated_at: new Date().toISOString(),
        updated_by: "panel",
        document,
      };
      this.edits = new Map();
      this.pollIfWaiting();
    } catch (err) {
      if (ownerId !== this.ownerId || !this.open) return;
      const code = errorCode(err);
      if (code === "conflict") {
        const stored = conflictRevision(err);
        await this.load(ownerId, true);
        this.note = {
          kind: "warn",
          text: `Your changes were not saved. These settings changed somewhere else${stored === undefined ? "" : ` (now revision ${stored})`}, so the newest copy is shown. Make your changes again on top of it.`,
        };
      } else if (code === "no_record") {
        await this.load(ownerId, true);
        this.note = { kind: "warn", text: "Your changes were not saved. Home Assistant no longer holds settings for this watch. Start with the defaults again, or let the iPhone send its settings." };
      } else {
        this.note = { kind: "err", text: `Could not save: ${errText(err)}` };
      }
    } finally {
      this.saving = false;
      this.changed();
    }
  }

  /**
   * "Start with the defaults": create the watch's settings record from the
   * catalog's defaults, a save over revision 0. The integration takes it only
   * for a paired watch; a record that came meanwhile is read and shown.
   */
  private async start(): Promise<void> {
    const hass = this.hass;
    const ownerId = this.ownerId;
    const record = this.record;
    if (!hass || ownerId === undefined || this.starting || this.saving) return;
    // A record is there (perhaps one this panel cannot read): never start
    // over it.
    if (record !== undefined && record.revision > 0) return;
    this.starting = true;
    this.note = undefined;
    this.changed();
    const result = await createWatchBehavior((base, document) => saveWatchConfig(hass, ownerId, "behavior", base, document));
    this.starting = false;
    if (ownerId !== this.ownerId || !this.open) {
      this.changed();
      return;
    }
    if (result.ok) {
      this.note = { kind: "note", text: "Started with the defaults. The watch picks them up the next time it checks." };
    } else if (result.code === "no_record") {
      this.note = { kind: "warn", text: SETTINGS_PAIR_FIRST_TEXT };
      this.changed();
      return;
    } else if (result.code === "conflict") {
      this.note = { kind: "warn", text: SETTINGS_START_CONFLICT_TEXT };
    } else {
      this.note = { kind: "err", text: `Could not start: ${result.message}` };
      this.changed();
      return;
    }
    await this.load(ownerId, true);
  }

  /**
   * While a save waits for a device, ask the store again now and then.
   *
   * Only the delivery fields are taken from the answer while the revision is
   * the one shown. A newer revision means someone else wrote since, and with
   * no edits in the form it simply replaces what is shown.
   */
  private pollIfWaiting(): void {
    this.stopPolling();
    if (!this.open || deliveryState(this.record) !== "waiting") return;
    this.pollTimer = window.setTimeout(() => void this.poll(), DELIVERY_POLL_MS);
  }

  private async poll(): Promise<void> {
    this.pollTimer = undefined;
    const hass = this.hass;
    const ownerId = this.ownerId;
    const shown = this.record;
    if (!hass || ownerId === undefined || shown === undefined || !this.open) return;
    try {
      const fresh = await fetchWatchConfig(hass, ownerId, "behavior");
      if (ownerId !== this.ownerId || this.record !== shown || !this.open) return;
      if (fresh.revision === shown.revision) {
        this.record = { ...shown, delivered_revision: fresh.delivered_revision, delivered_at: fresh.delivered_at };
      } else if (this.edits.size === 0 && !this.saving) {
        this.record = fresh;
      }
      this.changed();
    } catch {
      // A missed check is not news: the next one, or reopening, will tell.
    }
    this.pollIfWaiting();
  }

  private stopPolling(): void {
    if (this.pollTimer !== undefined) window.clearTimeout(this.pollTimer);
    this.pollTimer = undefined;
  }

  // ── closing and switching, which may cost edits ────────────────────────

  private get dirty(): boolean {
    return dirtyKeys(this.record?.document, this.edits).length > 0;
  }

  /** Run `then` now, or once the foot has asked about the unsaved edits. */
  private guard(label: string, then: () => void): void {
    if (!this.dirty) { then(); return; }
    this.confirm = { text: "Your changes to these settings are not saved.", label, run: then };
    this.changed();
  }

  private close(): void {
    this.host.renderRoot.querySelector<HTMLDialogElement>("dialog.ws-dialog")?.close();
  }

  /** The dialog has gone, by Close, Escape or Discard: forget the visit. */
  private closed(): void {
    this.open = false;
    this.loadSeq++;
    this.stopPolling();
    this.record = undefined;
    this.edits = new Map();
    this.confirm = undefined;
    this.note = undefined;
    this.visit++;
    this.pairSeq++;
    this.pair = { code: "" };
    this.changed();
  }

  // ── pairing a watch by its code ────────────────────────────────────────

  /** A new code in the field: whatever was found for the old one goes. */
  private setPairCode(raw: string): string {
    const code = normalizePairCode(raw).slice(0, PAIR_CODE_LENGTH);
    if (code !== this.pair.code) {
      this.pairSeq++;
      this.pair = { code, busy: this.pair.busy };
    }
    this.changed();
    return code;
  }

  private async lookUpPair(): Promise<void> {
    const hass = this.hass;
    const code = this.pair.code;
    if (!hass || this.pair.busy || !pairCodeIsComplete(code)) return;
    const visit = this.visit;
    const seq = ++this.pairSeq;
    this.pair = { code, busy: "lookup" };
    this.changed();
    try {
      const reply = await lookupPairCode(hass, code);
      if (seq !== this.pairSeq) return;
      this.pair = reply.found ? { code, found: { ...reply, code } } : { code, notFound: true };
    } catch (err) {
      if (seq !== this.pairSeq) return;
      this.pair = { code, error: pairErrorText(err, "lookup") };
    } finally {
      // Typing on while it ran keeps the new code but frees the buttons.
      if (visit === this.visit) this.pair = { ...this.pair, busy: undefined };
      this.changed();
    }
  }

  private async confirmPair(): Promise<void> {
    const hass = this.hass;
    const found = this.pair.found;
    if (!hass || this.pair.busy || found === undefined) return;
    const visit = this.visit;
    this.pair = { ...this.pair, busy: "confirm", error: undefined };
    this.changed();
    let paired: { watchId: string } | undefined;
    try {
      const reply = await confirmPairCode(hass, found.code);
      paired = { watchId: reply.watch_id };
      if (visit === this.visit) {
        this.pairSeq++;
        this.pair = { code: "", done: pairedText(reply.device_name ?? found.device_name) };
      }
    } catch (err) {
      if (visit === this.visit) {
        this.pairSeq++;
        // An unknown code here is one that ran out between the lookup and
        // the Pair button, or was confirmed somewhere else meanwhile.
        this.pair = errorCode(err) === "unknown_code"
          ? { code: found.code, notFound: true }
          : { code: found.code, found, error: pairErrorText(err, "confirm") };
      }
    } finally {
      if (visit === this.visit) this.pair = { ...this.pair, busy: undefined };
      this.changed();
    }
    if (paired === undefined || !this.refreshOwners) return;
    // The new watch joins the device list and becomes the one shown, its tab
    // selected, whether or not another watch was open.
    let owners: readonly OwnerSummary[];
    try {
      owners = await this.refreshOwners();
    } catch {
      return;
    }
    if (visit !== this.visit) return;
    const watches = settingsWatches(owners);
    const id = watches.some((w) => w.owner_watch_id === paired.watchId)
      ? paired.watchId
      : this.ownerId === undefined ? initialWatch(watches, undefined) : undefined;
    if (id === undefined) return;
    this.guard("Discard and switch", () => {
      this.confirm = undefined;
      void this.load(id, true);
    });
  }

  private pickWatch(ownerId: string): void {
    if (ownerId === this.ownerId) return;
    this.guard("Discard and switch", () => {
      this.confirm = undefined;
      void this.load(ownerId);
    });
  }

  private edit(setting: CatalogSetting, value: SettingValue): void {
    this.edits = withEdit(this.edits, this.record?.document, setting, value);
    this.confirm = undefined;
    this.changed();
  }

  private toggleHelp(sectionId: string): void {
    const next = new Set(this.helpOff);
    if (next.has(sectionId)) next.delete(sectionId);
    else next.add(sectionId);
    this.helpOff = next;
    this.changed();
  }

  // ── drawing ────────────────────────────────────────────────────────────

  /** The top bar's way in. Administrators only, since every command is
   * theirs. A home with no watch yet still gets it: pairing the first watch
   * without an iPhone starts here. */
  renderButton(hass: HassLike, owners: readonly OwnerSummary[], current: string | undefined): TemplateResult | typeof nothing {
    if (!hass.user?.is_admin) return nothing;
    return html`<button class="tb-btn tb-watch" aria-haspopup="dialog" aria-expanded=${this.open ? "true" : "false"}
      title="How the watch behaves: gestures, pages, cameras and connection"
      @click=${() => this.show(hass, owners, current)}>${uiIcon("watch")}<span>Watch settings</span></button>`;
  }

  render(hass: HassLike, owners: readonly OwnerSummary[]): TemplateResult | typeof nothing {
    if (!this.open) return nothing;
    this.hass = hass;
    const watches = settingsWatches(owners);
    const owner = watches.find((w) => w.owner_watch_id === this.ownerId);
    const name = owner ? watchName(owner, watches) : "Watch";
    return html`<dialog class="ws-dialog xf" aria-label="Watch settings"
      @cancel=${(e: Event) => {
        // Escape with unsaved edits asks first, the way Close does.
        if (!this.dirty) return;
        e.preventDefault();
        this.guard("Discard and close", () => this.close());
      }}
      @close=${() => this.closed()}>
      <div class="xf-head">
        <div class="xf-t"><h2>Watch settings</h2><span>${this.headLine(name)}</span></div>
        <button class="icon" title="Close" aria-label="Close" @click=${() => this.guard("Discard and close", () => this.close())}>${uiIcon("close")}</button>
      </div>
      ${watches.length > 1 ? this.renderTabs(watches, owners) : nothing}
      <div class="xfer-body ws-body">
        ${this.note ? html`<div class="banner ${this.note.kind} ws-note" role="alert"><span>${this.note.text}</span>
          <button class="link" @click=${() => { this.note = undefined; this.changed(); }}>Dismiss</button></div>` : nothing}
        ${this.renderBody(hass)}
        ${this.renderPair()}
      </div>
      ${this.renderFoot()}
    </dialog>`;
  }

  /** Under the title: which watch, and which revision of its settings. */
  private headLine(name: string): string {
    const r = this.record;
    if (r === undefined || r.revision <= 0) return name;
    const by = savedByWords(r.updated_by);
    const at = r.updated_at ? Date.parse(r.updated_at) : NaN;
    const when = Number.isNaN(at) ? "" : ` ${agoWords(Math.max(0, (Date.now() - at) / 1000))}`;
    return `${name} · revision ${r.revision}, ${by}${when}`;
  }

  /** One tab per watch, as the picker draws its device tabs: the watch
   * glyph and the count in the person's color, the name in ink. */
  private renderTabs(watches: readonly OwnerSummary[], owners: readonly OwnerSummary[]) {
    const people = peopleOf(owners);
    return html`<div class="pk-tabs ws-tabs" role="tablist" aria-label="Watches">
      ${watches.map((w) => {
        const index = people.findIndex((p) => p.owners.some((o) => o.owner_watch_id === w.owner_watch_id));
        const color = personColorVar(index);
        const on = w.owner_watch_id === this.ownerId;
        return html`<button type="button" role="tab" class="pk-tab ${on ? "on" : ""}" aria-selected=${on ? "true" : "false"}
          style=${color ? `--pk-person: ${color}` : nothing} ?disabled=${this.saving}
          title=${people[index]?.label ? `${people[index]!.label}'s watch` : nothing}
          @click=${() => this.pickWatch(w.owner_watch_id)}>
          <span class="pk-tab-glyph" aria-hidden="true">${uiIcon("watch")}</span>
          <span class="pk-tab-name">${watchName(w, watches)}</span>
        </button>`;
      })}
    </div>`;
  }

  private renderBody(hass: HassLike) {
    if (this.loading) return html`<div class="empty">Loading…</div>`;
    if (this.loadError !== undefined) {
      const id = this.ownerId;
      return html`<div class="xf-lead warn">${uiIcon("info")}<span>Could not read this watch's settings: ${this.loadError}</span></div>
        ${id === undefined ? nothing : html`<button class="small ws-retry" @click=${() => void this.load(id)}>Try again</button>`}`;
    }
    if (this.ownerId === undefined) {
      return html`<div class="xf-lead">${uiIcon("info")}<span><b>No watch has connected to this Home Assistant yet.</b> Pair one below, or open the Wrist Assistant app on your iPhone.</span></div>`;
    }
    const record = this.record;
    if (record === undefined) return nothing;
    // A record that is there but unreadable is not "no settings yet": a
    // start would only meet a conflict.
    if (watchRecordUnreadable(record, (document) => document)) {
      return html`<div class="xf-lead warn">${uiIcon("info")}<span>${SETTINGS_UNREADABLE_TEXT}</span></div>`;
    }
    if (record.revision <= 0 || record.document === undefined) {
      return html`<div class="xf-lead">${uiIcon("info")}<span><b>No settings from this watch yet.</b> ${SETTINGS_NO_RECORD_TEXT}</span></div>
        <button class="small primary ws-start" ?disabled=${this.starting || this.saving}
          title="Save the app's default settings as this watch's first copy"
          @click=${() => void this.start()}>${this.starting ? "Starting…" : SETTINGS_START_BUTTON}</button>
        <div class="hint ws-start-hint">${START_PHONE_FIRST_TEXT}</div>`;
    }
    const values = formValues(record.document, this.edits);
    return html`${WATCH_SETTINGS_CATALOG.sections.map((section) => this.renderSection(hass, section, values))}`;
  }

  /** One catalog section as an inspector card that is always open: the
   * inspector's mark, title and "?" for its help. */
  private renderSection(hass: HassLike, section: CatalogSection, values: ReadonlyMap<string, SettingValue>) {
    const look = SECTION_LOOK[section.id];
    const help = !this.helpOff.has(section.id);
    const helpLabel = help ? `Hide the help in ${section.title}` : `Show help for ${section.title}`;
    const runs = sectionRuns(section, values);
    return html`<section class="sec" data-sec=${`ws-${section.id}`} data-open="true" data-help=${help ? "on" : "off"}
      style=${look ? `--c:${look.color}` : nothing}>
      <div class="sec-h pinned">
        <span class="swatch">${uiIcon(look?.icon ?? "content")}</span>
        <span class="tt"><h4>${section.title}</h4></span>
        <button type="button" class="sec-help ${help ? "on" : ""}" aria-pressed=${help ? "true" : "false"} title=${helpLabel} aria-label=${helpLabel}
          @click=${() => this.toggleHelp(section.id)}>?</button>
      </div>
      <div class="sec-b">
        ${runs.map((run) => html`${this.renderRow(hass, run.setting, values)}${run.dependents.length === 0
          ? nothing
          : html`<div class="fgroup">${run.dependents.map((s) => this.renderRow(hass, s, values))}</div>`}`)}
      </div>
    </section>`;
  }

  /** An SF Symbol in a box of fixed size, so a row does not move when the
   * symbol file arrives after the first draw. Drawn in the box's own color:
   * the provider paints white, and the sheet repaints its path. */
  private glyph(cls: string, name: string, size: number) {
    const drawn = this.icons?.()?.render(name, size, "#FFFFFF");
    return html`<span class=${cls} aria-hidden="true">${drawn ?? nothing}</span>`;
  }

  /** One setting with the panel's own field for its kind, its icon beside its
   * title, and its help line under it. Every field offers the reset dot back
   * to the watch's default. The help line stays the row's sibling, so a box
   * of dependents holds the same rows it always did. */
  private renderRow(hass: HassLike, setting: CatalogSetting, values: ReadonlyMap<string, SettingValue>) {
    const value = values.get(setting.key) ?? settingValue(setting, undefined);
    const set = (v: SettingValue) => this.edit(setting, v);
    const helpLine = setting.help ? html`<div class="hint">${setting.help}</div>` : nothing;
    if (usesTiles(setting)) return this.renderTiles(setting, String(value), set);
    const row = (field: TemplateResult) => html`<div class="ws-row" data-key=${setting.key}>
      ${this.glyph("ws-ic", settingIcon(setting), 14)}${field}</div>${helpLine}`;
    switch (setting.type) {
      case "bool":
        return row(checkField(setting.label, value === true, set, setting.default === true));
      case "color":
        return row(colorField(setting.label, String(value), (v) => { if (v !== undefined) set(v); }, false, String(setting.default)));
      case "entity": {
        const id = String(value);
        const ref = id === "" ? { entityId: "", displayName: "", domain: "" } : entityRefFor(hass, id);
        return row(entityField({ hass }, setting.label, ref, (next) => set(next.entityId),
          `ws:${this.ownerId ?? ""}:${setting.key}`, setting.domain === undefined ? {} : { domain: setting.domain }));
      }
      case "enum": {
        // More choices than tiles fit: the panel's menu.
        const options = optionsFor(setting, value).map((o): [string, string] => [o.value, o.label]);
        return row(selectField(setting.label, String(value), options, (v) => set(v), { def: String(setting.default) }));
      }
    }
  }

  /**
   * A choice of up to five as a row of tiles, the way the iPhone app draws
   * it: each an icon or a small picture, the choice's name and its detail. The
   * row stacks: the title and its help on top, the tiles under them at full
   * width, all the same width, wrapping on a narrow dialog.
   */
  private renderTiles(setting: CatalogSetting, value: string, set: (v: SettingValue) => void) {
    const options = optionsFor(setting, value);
    const tiles = tileChoices(setting, options, value);
    const def = String(setting.default);
    const name = (v: string) => options.find((o) => o.value === v)?.label ?? v;
    const n = tiles.length;
    // Up to five side by side; on a narrow dialog five or more go three to a
    // line. A sixth (a stored value the catalog does not list) halves the row.
    const cols = n <= 5 ? n : Math.ceil(n / 2);
    const narrow = n >= 5 ? 3 : n;
    return html`<div class="ws-tile-row" data-key=${setting.key}>
      <div class="ws-head">${this.glyph("ws-ic", settingIcon(setting), 14)}${settingTitle(setting.label, value, def, (v) => set(v), name)}</div>
      ${setting.help ? html`<div class="hint">${setting.help}</div>` : nothing}
      <div class="ws-tiles" role="group" aria-label=${setting.label} data-n=${n} style=${`--cols:${cols};--cols-narrow:${narrow}`}>
        ${tiles.map((t) => this.renderTile(t, set))}
      </div>
    </div>`;
  }

  private renderTile(tile: TileChoice, set: (v: SettingValue) => void) {
    return html`<button type="button" class="ws-tile ${tile.on ? "on" : ""}" aria-pressed=${tile.on ? "true" : "false"}
      title=${tile.title ?? nothing} @click=${() => { if (!tile.on) set(tile.value); }}>
      ${tile.preview === undefined
        ? this.glyph("ws-tile-glyph", tile.icon, 16)
        : html`<span class="ws-tile-glyph" aria-hidden="true">${optionPreview(tile.preview, tile.value)}</span>`}
      <span class="ws-tile-name">${tile.name}</span>
      ${tile.detail === undefined ? nothing : html`<span class="ws-tile-detail">${tile.detail}</span>`}
    </button>`;
  }

  /** The last card: pairing a watch that has no iPhone, by the code it shows.
   * Look up first, so the administrator sees which watch it is (its name, app
   * version and build) before it gets a key. */
  private renderPair() {
    const p = this.pair;
    const complete = pairCodeIsComplete(p.code);
    const found = p.found !== undefined && p.found.code === p.code ? p.found : undefined;
    return html`<section class="sec ws-pair" data-sec="ws-pair" data-open="true" data-help="on" style=${`--c:${PAIR_LOOK.color}`}>
      <div class="sec-h pinned">
        <span class="swatch">${uiIcon(PAIR_LOOK.icon)}</span>
        <span class="tt"><h4>Pair a watch</h4></span>
      </div>
      <div class="sec-b">
        <div class="hint keep">On the watch, choose Pair with Home Assistant and type the code it shows.</div>
        <div class="field">
          <span>Code</span>
          <div class="row-acts ws-pair-row">
            <input type="text" class="mono ws-pair-code" aria-label="Pairing code" maxlength=${PAIR_CODE_LENGTH}
              autocapitalize="characters" autocomplete="off" autocorrect="off" spellcheck="false"
              .value=${p.code}
              @input=${(e: Event) => {
                const input = e.target as HTMLInputElement;
                // Write the clean code back at once: lit leaves the field
                // alone when the clean code is the one it already holds.
                input.value = this.setPairCode(input.value);
              }}
              @paste=${(e: ClipboardEvent) => {
                // A pasted "ABC-DEF" is longer than the field allows, so it
                // is cleaned before the length cut rather than after.
                const text = e.clipboardData?.getData("text");
                if (text === undefined) return;
                e.preventDefault();
                (e.target as HTMLInputElement).value = this.setPairCode(text);
              }}
              @keydown=${(e: KeyboardEvent) => {
                if (e.key !== "Enter" || e.isComposing) return;
                e.preventDefault();
                void this.lookUpPair();
              }} />
            <button class="small" ?disabled=${!complete || p.busy !== undefined}
              title=${complete ? "Find the watch showing this code" : `Type the ${PAIR_CODE_LENGTH} character code first`}
              @click=${() => void this.lookUpPair()}>${p.busy === "lookup" ? "Looking up…" : "Look up"}</button>
          </div>
        </div>
        ${found === undefined ? nothing : html`<div class="field readout">
            <span>Watch</span>
            <div class="readout-v ws-pair-watch">${pairLookupLine(found)}</div>
          </div>
          ${this.renderPairRequest(found)}
          ${pairLookupWarnings(found).map((line) => html`<div class="hint warn">${line}</div>`)}
          <button class="small primary ws-pair-go" ?disabled=${p.busy !== undefined}
            title="Give this watch its key, so it can read from Home Assistant without an iPhone"
            @click=${() => void this.confirmPair()}>${p.busy === "confirm" ? "Pairing…" : "Pair"}</button>`}
        ${p.notFound ? html`<div class="hint warn" role="status">${PAIR_NOT_FOUND_TEXT}</div>` : nothing}
        ${p.done ? html`<div class="hint keep ws-pair-done" role="status">${p.done}</div>` : nothing}
        ${p.error ? html`<div class="hint err" role="alert">${p.error}</div>` : nothing}
      </div>
    </section>`;
  }

  /** Under the watch line: when and from where it asked, and a warning when
   * that address is outside the home network. */
  private renderPairRequest(found: PairLookupFound) {
    const line = pairRequestLine(found);
    const warning = pairRemoteWarning(found.remote);
    return html`${line === undefined ? nothing : html`<div class="hint keep ws-pair-request">${line}</div>`}
      ${warning === undefined ? nothing : html`<div class="hint warn">${warning}</div>`}`;
  }

  /** Where the settings have got to on the left, Close and Save on the right;
   * or, before edits are thrown away, the question and its two answers. */
  private renderFoot() {
    const confirm = this.confirm;
    if (confirm) {
      return html`<div class="xfer-foot">
        <span class="xf-sub">${confirm.text}</span>
        <span class="spacer"></span>
        <button class="small" @click=${() => { this.confirm = undefined; this.changed(); }}>Keep editing</button>
        <button class="primary" @click=${() => { this.confirm = undefined; confirm.run(); }}>${confirm.label}</button>
      </div>`;
    }
    const record = this.record;
    const changes = dirtyKeys(record?.document, this.edits).length;
    // A watch with no record is created by "Start with the defaults" in the
    // body; Save sends edits to a record that exists.
    const canSave = changes > 0 && !this.saving && !this.starting && record?.document !== undefined;
    return html`<div class="xfer-foot">
      ${changes > 0
        ? html`<span class="xf-sub">${changes} unsaved ${changes === 1 ? "change" : "changes"}</span>`
        : this.renderDelivery(record)}
      <span class="spacer"></span>
      <button class="small" @click=${() => this.guard("Discard and close", () => this.close())}>Close</button>
      <button class="primary save ${changes > 0 ? "dirty" : ""}" ?disabled=${!canSave}
        title=${changes > 0 ? "Save these settings for the watch to pick up" : "Nothing to save"}
        @click=${() => void this.save()}>${this.saving ? "Saving…" : "Save"}</button>
    </div>`;
  }

  /** The header's sync pill, saying whether a device has collected the
   * revision shown: green once one has, amber while a save waits. */
  private renderDelivery(record: WatchConfigRecord | undefined) {
    const state = deliveryState(record);
    if (state === "none" || record === undefined) return nothing;
    if (state === "delivered") {
      return html`<span class="tb-sync ok" title=${`Revision ${record.revision} has been collected.`}>
        <i class="tb-dot" aria-hidden="true"></i><span class="tb-sync-l">${COLLECTED_PILL_TEXT}</span>
      </span>`;
    }
    return html`<span class="tb-sync warn sending" title=${`Saved as revision ${record.revision}. ${WAITING_HELP_TEXT}`}>
      <i class="tb-dot" aria-hidden="true"></i><span class="tb-sync-l">${WAITING_PILL_TEXT}</span>
    </span>`;
  }
}

function errText(err: unknown): string {
  return String((err as { message?: string })?.message ?? err);
}

/** The dialog's own rules, added to the panel's sheet. Everything else it
 * wears (cards, rows, tabs, pill, head and foot) is the panel's. */
export const watchSettingsStyles = css`
  /* The top bar's button: the watch glyph and its words on one line. */
  button.tb-btn.tb-watch { display: inline-flex; align-items: center; gap: 6px; padding: 0 11px 0 9px; }
  button.tb-btn.tb-watch svg.ui-icon { width: 14px; height: 14px; }
  /* A fixed height, like the picker's, so moving between watches does not
     resize the dialog under the pointer. */
  dialog.ws-dialog { width: min(660px, calc(100vw - 32px)); height: min(860px, calc(100dvh - 40px)); }
  @media (max-width: 640px) {
    dialog.ws-dialog { width: calc(100vw - 16px); height: calc(100dvh - 16px); }
  }
  /* The cards sit closer than the dialog's usual blocks, and the title column
     is wider than the inspector's: these titles are whole phrases with an
     icon in front. The help column is set again beside it, because the
     panel's is worked out from the panel's own title width. */
  .ws-body { --wa-lab: 172px; --wa-col: 180px; gap: 8px; }
  .ws-body > .sec { margin: 0; }
  @container xfer (max-width: 440px) {
    .ws-body .sec { --wa-lab: 122px; --wa-col: 130px; }
  }
  /* Each setting's icon: a fixed box in front of its title, muted like the
     title, kept the same size before and after the symbol file arrives. The
     symbol provider paints white; the box's color wins here. */
  .ws-body .ws-ic { width: 14px; height: 14px; flex: none; display: grid; place-items: center; color: var(--wa-muted); pointer-events: none; }
  .ws-body :is(.ws-ic, .ws-tile-glyph) svg { display: block; overflow: visible; }
  .ws-body .ws-ic svg { width: 14px; height: 14px; }
  .ws-body :is(.ws-ic, .ws-tile-glyph) svg:not(.ws-pv) path { fill: currentColor; fill-opacity: 1; }
  /* A row drawn by the panel's own field: the icon sits in the title column,
     level with the title, which moves over to make room for it. */
  .ws-row { position: relative; }
  .ws-row > .ws-ic { position: absolute; left: 0; top: 8px; z-index: 1; }
  .ws-row > .field > span:first-child { padding-left: 21px; }
  /* A row of tiles stacks: the icon and title on one line, the help under
     them where the title starts, the tiles under that at full width. */
  .ws-tile-row { padding: 3px 0 4px; }
  .ws-head { position: relative; display: flex; align-items: center; gap: 7px; min-height: 24px; }
  .ws-head > span:not(.ws-ic) { min-width: 0; color: var(--wa-label, var(--wa-muted)); font-size: 12px; line-height: 1.25; overflow-wrap: break-word; }
  .ws-head > span.changed { color: var(--wa-ink); }
  .ws-head button.reset-dot { top: 50%; margin-top: -2.5px; }
  .ws-tile-row > .hint { margin: 0 0 2px 21px; }
  /* The tiles: equal columns, five at most to a line, three on a narrow
     dialog. Neutral like every control here: a hairline at rest that
     brightens under the pointer, and the picked one a raised grey with ink
     words and the brighter line. No hue. */
  .ws-tiles {
    display: grid; grid-template-columns: repeat(var(--cols, 3), minmax(0, 1fr)); gap: 6px; margin-top: 6px;
  }
  @container xfer (max-width: 440px) {
    .ws-tiles { grid-template-columns: repeat(var(--cols-narrow, 3), minmax(0, 1fr)); }
  }
  button.ws-tile {
    --ws-tile-bg: var(--wa-field);
    font: inherit; min-width: 0; min-height: 54px; margin: 0; padding: 6px 4px 5px; cursor: pointer;
    display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 3px;
    border: 1px solid var(--wa-line-strong); border-radius: 8px; background: var(--ws-tile-bg); color: var(--wa-label);
    transition: border-color .12s ease-out, background-color .12s ease-out, color .12s ease-out;
  }
  button.ws-tile:hover:not(:disabled) { border-color: color-mix(in srgb, var(--wa-ink) 34%, var(--wa-card)); color: var(--wa-ink); }
  button.ws-tile.on {
    --ws-tile-bg: var(--wa-seg-on);
    color: var(--wa-ink); border-color: color-mix(in srgb, var(--wa-ink) 34%, var(--wa-card)); box-shadow: var(--wa-seg-shadow);
  }
  button.ws-tile:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  button.ws-tile:disabled { opacity: .45; cursor: default; }
  .ws-tile-glyph { height: 20px; min-width: 16px; display: grid; place-items: center; color: var(--wa-muted); }
  .ws-tile-glyph svg { height: 16px; width: auto; max-width: 100%; }
  .ws-tile-glyph svg.ws-pv { width: 36px; height: 20px; }
  button.ws-tile.on .ws-tile-glyph { color: var(--wa-ink); }
  .ws-tile-name { max-width: 100%; font-size: 11.5px; font-weight: 500; line-height: 1.2; text-align: center; overflow-wrap: anywhere; }
  button.ws-tile.on .ws-tile-name { font-weight: 600; }
  .ws-tile-detail {
    max-width: 100%; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 10px; line-height: 1.2;
    color: var(--wa-muted); text-align: center; overflow-wrap: anywhere;
  }
  button.ws-tile.on .ws-tile-detail { color: var(--wa-label); }
  .ws-body > .ws-note { display: flex; align-items: center; gap: 10px; }
  .ws-body > .ws-note > span { flex: 1; min-width: 0; }
  .ws-body > button.ws-retry, .ws-body > button.ws-start { align-self: flex-start; }
  /* The indicator has no opacity, so the color row drops the percent box. */
  .ws-body .color-box .alpha { display: none; }
  .ws-tabs { padding: 0 8px; }
  .ws-tabs .pk-tab:disabled { cursor: default; opacity: .6; }
  .xfer-foot .tb-sync { min-width: 0; flex: 0 1 auto; }
  /* The pairing card: the code box only as wide as a code, spaced out so the
     six characters read one by one, with Look up beside it. */
  .ws-pair-row { flex-wrap: nowrap; }
  .ws-body .ws-pair .field input.ws-pair-code { flex: 0 1 112px; width: 112px; letter-spacing: .14em; text-transform: uppercase; }
  .ws-pair-row > button.small { flex: none; }
  .ws-pair .readout-v.ws-pair-watch { color: var(--wa-ink); }
`;
