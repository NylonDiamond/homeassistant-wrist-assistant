// The Watch app's Settings page: one watch's simple behavior settings, edited
// in the panel and saved to the copy Home Assistant keeps for the watch. The
// panel draws it as the page body on `/settings` (`watch-settings-page.ts`),
// under the Watch app row, which owns the watch: the page shows the row's
// watch and follows it, with no watch tabs of its own.
//
// It is a controller rather than an element of its own so it draws inside the
// panel's shadow root and wears the panel's own rows: the inspector's tinted
// cards, its switches, segmented choices, selects, color and entity fields, and
// the header's sync pill for where a save has got to. Everything that decides
// something lives in `watch-settings.ts`, `watch-settings-page.ts` and
// `watch-settings-draft.ts`, which the tests read without a DOM.
//
// Unsaved edits are kept per watch (`watch-settings-draft.ts`), the way every
// other watch screen keeps its drafts, so following the row to another watch,
// or leaving for another screen or tab, loses nothing and asks nothing. The
// panel's leave guards count them.
//
// The path a change takes: the panel saves a new revision, and the watch pulls
// it the next time it checks. A watch with no record yet gets one from "Start
// with the defaults", or from its iPhone's one-time move. There is no live
// line, so while a save waits the page asks the store again now and then and
// turns the pill green once the watch has it.
//
// The watch's notification style (kind `notification_style`) is a second
// record shown on the same page, as the Notifications, Sounds and Wrist
// Webhooks cards after the behavior ones. It loads with `behavior`, and the
// one Save sends whichever of the two changed, each over its own revision.
// Its thinking is in `watch-notification-style/model.ts`.

import { css, html, nothing, type ReactiveController, type ReactiveControllerHost, type TemplateResult } from "lit";
import { live } from "lit/directives/live.js";
import { checkField, colorField, entityField, entityRefFor, percentSliderField, selectField, settingTitle, sliderField } from "./editors.js";
import {
  type HassLike,
  type OwnerSummary,
  type WatchConfigRecord,
  fetchWatchConfig,
  saveWatchConfig,
} from "./ha-api.js";
import { SECTION_COLOR } from "./kinds.js";
import type { IconProvider } from "./renderer.js";
import { agoWords } from "./send-state.js";
import { type UiIconName, uiIcon } from "./ui-icons.js";
import {
  type CatalogSection,
  type CatalogSetting,
  type MotionActions,
  type SettingValue,
  COLLECTED_PILL_TEXT,
  SETTINGS_NO_RECORD_TEXT,
  SETTINGS_PAIR_FIRST_TEXT,
  SETTINGS_START_BUTTON,
  SETTINGS_START_CONFLICT_TEXT,
  SETTINGS_MAIN_HOUSE_TEXT,
  SETTINGS_UNREADABLE_TEXT,
  START_FRESH_BUTTON,
  WAITING_HELP_TEXT,
  WAITING_PILL_TEXT,
  WATCH_SETTINGS_CATALOG,
  buildSaveDocument,
  conflictRevision,
  createWatchBehavior,
  deliveryState,
  dirtyKeys,
  domainList,
  errorCode,
  formValues,
  initialWatch,
  mayStart,
  motionAction,
  noRecordStart,
  noRecordText,
  optionsFor,
  readMotionActions,
  savedByWords,
  sectionRuns,
  settingValue,
  settingsWatches,
  takesSettingsFromAnotherHome,
  watchName,
  watchRecordUnreadable,
  withEdit,
  withMotionAction,
  withMotionTarget,
} from "./watch-settings.js";
import { SETTINGS_MOVED_TEXT, dropWatchSettingsDrafts, keepSettingsDraft, keptSettingsDraft, restoreSettingsDraft } from "./watch-settings-draft.js";
import { settingsCanSave, settingsPageStep } from "./watch-settings-page.js";
import { type TileChoice, domainTiles, gestureIcon, optionPreview, settingIcon, tileChoices, usesTiles } from "./watch-settings-look.js";
import {
  type StyleRow,
  type StyleSection,
  type StyleValue,
  NOTIFICATION_STYLE_KIND,
  NOTIFICATION_STYLE_SECTIONS,
  STYLE_NO_RECORD_TEXT,
  STYLE_NO_RECORD_TITLE,
  STYLE_START_BUTTON,
  STYLE_START_CONFLICT_TEXT,
  STYLE_UNREADABLE_TEXT,
  VOLUME,
  notificationStyleReadMeansUnsupported,
  readStyleDocument,
  saveNotificationStyle,
  soundChoices,
  soundValueText,
  startNotificationStyle,
  styleDirtyKeys,
  styleFormValues,
  styleOptionsFor,
  styleRuns,
  styleTileChoices,
  styleUsesTiles,
  volumeText,
  withStyleEdit,
} from "./watch-notification-style/model.js";
import { notificationPreview, notificationPreviewStyles } from "./watch-notification-style/preview.js";
import { ClientCertCard, clientCertStyles } from "./watch-client-cert-view.js";
import { PairWatchCard, pairCardStyles } from "./watch-pair-view.js";

/** How often the page asks whether a device has collected a save. */
const DELIVERY_POLL_MS = 15_000;

const IS_MAC = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
/** Save's key, as its hover text names it. */
const SAVE_KEY = IS_MAC ? "⌘S" : "Ctrl+S";

/** Each card's mark and tint, from the inspector's own palette. */
const SECTION_LOOK: Record<string, { icon: UiIconName; color: string }> = {
  connection: { icon: "globe", color: SECTION_COLOR.place },
  interaction: { icon: "tap", color: SECTION_COLOR.tap },
  navigation: { icon: "pages", color: SECTION_COLOR.numbers },
  camera: { icon: "image", color: SECTION_COLOR.look },
  motion: { icon: "watch", color: SECTION_COLOR.home },
};

/** The notification style's cards, after the behavior ones. */
const STYLE_LOOK: Record<StyleSection["id"], { icon: UiIconName; color: string }> = {
  notifications: { icon: "note", color: SECTION_COLOR.position },
  sounds: { icon: "states", color: "var(--wa-hue-purple)" },
  wristWebhooks: { icon: "link", color: SECTION_COLOR.states },
};

interface Note {
  text: string;
  kind: "note" | "warn" | "err";
}

/** A question the bar asks before edits are thrown away. */
interface Confirm {
  text: string;
  label: string;
  run: () => void;
}

type PanelHost = ReactiveControllerHost & { renderRoot: ParentNode };

/** Reads the device list again and answers it, so a watch that has just been
 * paired is one the row can show. The panel's own full owners load. */
type RefreshOwners = () => Promise<readonly OwnerSummary[]>;

export class WatchSettings implements ReactiveController {
  /** The page is on screen. */
  private active = false;
  private hass?: HassLike;
  private ownerId?: string;
  private record?: WatchConfigRecord;
  private loading = false;
  private loadError?: string;
  private edits: ReadonlyMap<string, SettingValue> = new Map();
  private saving = false;
  /** "Start with the defaults" is out. */
  private starting = false;
  /** The notification style record, beside `record`. */
  private styleRecord?: WatchConfigRecord;
  private styleEdits: ReadonlyMap<string, StyleValue> = new Map();
  /** The integration does not keep the kind: its cards are left out. */
  private styleUnsupported = false;
  private styleError?: string;
  /** The notification style's "Start with the defaults" is out. */
  private styleStarting = false;
  private note?: Note;
  private confirm?: Confirm;
  /** The watch row the page drew last, for its no-record state
   * (`noRecordStart`). */
  private shownOwner?: OwnerSummary;
  /** Sections whose help is hidden. Help starts shown: this is a form people
   * fill once, and its short titles ("Delay", "Debounce") need their line. */
  private helpOff: ReadonlySet<string> = new Set();
  /** Bumped by every load, so a reply that arrives after another watch was
   * picked, or after a newer load, is dropped. */
  private loadSeq = 0;
  private pollTimer?: number;
  /** The "Pair a watch" card, after the other cards. It starts afresh on
   * each visit, and a watch paired on it becomes the one shown. */
  private readonly pairCard = new PairWatchCard(() => this.changed(), (id, stale) => this.showPaired(id, stale));
  /** The signed in user's client certificate, the card under the pairing
   * card. It reads its status once each time the page is opened. */
  private readonly cert = new ClientCertCard(() => this.host.requestUpdate());

  /** `icons` is the panel's symbol provider, asked on every draw: it loads
   * its file on first use and wakes the panel when it can draw more.
   * `onPaired` hears of a watch just paired here once the page has moved to
   * it, so the panel can make it the watch the Watch app shows. */
  constructor(
    private readonly host: PanelHost,
    private readonly refreshOwners?: RefreshOwners,
    private readonly icons?: () => IconProvider | undefined,
    private readonly onPaired?: (watchId: string) => void,
  ) {
    host.addController(this);
  }

  /** Whether the page is on screen. */
  get shown(): boolean {
    return this.active;
  }

  /** The watch on the page, undefined while there is none. */
  get watchId(): string | undefined {
    return this.ownerId;
  }

  /** The panel back in the page (Home Assistant moves it in and out): a
   * save still waiting on the page is checked on again. */
  hostConnected(): void {
    if (this.active) this.pollIfWaiting();
  }

  hostDisconnected(): void {
    this.stopPolling();
  }

  /** Every change: the page is drawn again, and the watch's form is kept as
   * it stands (`watch-settings-draft.ts`), so leaving it loses nothing. Not
   * while a load is out: the form is between two watches then. */
  private changed(): void {
    if (!this.loading && this.ownerId !== undefined) {
      keepSettingsDraft(this.ownerId, {
        behaviorRevision: this.record?.revision ?? 0,
        behaviorDocument: this.record?.document,
        edits: this.edits,
        styleRevision: this.styleRecord?.revision ?? 0,
        styleDocument: this.styleDocument,
        styleEdits: this.styleEdits,
      });
    }
    this.host.requestUpdate();
  }

  // ── following the row's watch, loading, saving ─────────────────────────

  /**
   * The page on the watch the panel hands it: the Watch app's shared watch
   * when it is one of the home's watches, else the first. Called on every
   * draw of the page, so it follows the row's picker; it reads only on the
   * way onto the page and when the watch changes (`settingsPageStep`). A
   * home with no watch yet shows the pairing card alone.
   */
  show(hass: HassLike, owners: readonly OwnerSummary[], current: string | undefined): void {
    this.hass = hass;
    const id = initialWatch(settingsWatches(owners), current);
    const step = settingsPageStep(this.active, this.ownerId, id);
    if (step === "stay") return;
    if (!this.active) {
      // A new visit: the pairing card and the bar start afresh.
      this.active = true;
      this.confirm = undefined;
      this.note = undefined;
      this.pairCard.open(hass);
      this.cert.open(hass);
    }
    if (step === "clear" || id === undefined) {
      // Nothing to load: clear whatever was shown, a load still out
      // included, so the card says no watch has connected.
      this.loadSeq++;
      this.ownerId = undefined;
      this.record = undefined;
      this.edits = new Map();
      this.loadError = undefined;
      this.loading = false;
      this.clearStyle();
      this.stopPolling();
      this.changed();
      return;
    }
    void this.load(id);
  }

  /** The page has gone from the screen: another screen, tab or page. The
   * form is kept (`changed` keeps it on every edit); only the checks for
   * delivery stop, and the next visit reads both records again. */
  leave(): void {
    if (!this.active) return;
    this.active = false;
    this.stopPolling();
    this.confirm = undefined;
    this.pairCard.close();
    this.cert.close();
    this.changed();
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
    this.clearStyle();
    this.stopPolling();
    this.changed();
    await Promise.all([this.readBehavior(hass, ownerId, seq), this.readStyle(hass, ownerId, seq)]);
    if (seq !== this.loadSeq) return;
    // The edits kept for this watch go back on, over the copies just read.
    const restored = restoreSettingsDraft(keptSettingsDraft(ownerId), this.record, this.styleRecord);
    this.edits = restored.edits;
    this.styleEdits = restored.styleEdits;
    if (restored.moved && !keepNote) this.note = { kind: "warn", text: SETTINGS_MOVED_TEXT };
    this.loading = false;
    this.pollIfWaiting();
    this.changed();
  }

  private clearStyle(): void {
    this.styleRecord = undefined;
    this.styleEdits = new Map();
    this.styleUnsupported = false;
    this.styleError = undefined;
  }

  private async readBehavior(hass: HassLike, ownerId: string, seq: number): Promise<void> {
    try {
      const record = await fetchWatchConfig(hass, ownerId, "behavior");
      if (seq !== this.loadSeq) return;
      this.record = record;
    } catch (err) {
      if (seq !== this.loadSeq) return;
      this.loadError = errText(err);
    }
  }

  /** The notification style, read beside the behavior. An integration that
   * does not keep the kind leaves its cards out; any other failure is said in
   * their place. */
  private async readStyle(hass: HassLike, ownerId: string, seq: number): Promise<void> {
    try {
      const record = await fetchWatchConfig(hass, ownerId, NOTIFICATION_STYLE_KIND);
      if (seq !== this.loadSeq) return;
      this.styleRecord = record;
    } catch (err) {
      if (seq !== this.loadSeq) return;
      if (notificationStyleReadMeansUnsupported(err)) this.styleUnsupported = true;
      else this.styleError = errText(err);
    }
  }

  /** Read one record again, leaving the other and its edits alone: after a
   * conflict, a refusal or a start. This record's edits are dropped. */
  private async reread(kind: "behavior" | "style", ownerId: string): Promise<void> {
    const hass = this.hass;
    if (!hass || ownerId !== this.ownerId) return;
    const seq = this.loadSeq;
    if (kind === "behavior") {
      this.loadError = undefined;
      await this.readBehavior(hass, ownerId, seq);
      if (seq === this.loadSeq) this.edits = new Map();
    } else {
      this.styleError = undefined;
      this.styleUnsupported = false;
      await this.readStyle(hass, ownerId, seq);
      if (seq === this.loadSeq) this.styleEdits = new Map();
    }
    this.changed();
  }

  /** The notification style document shown, when there is one to edit. */
  private get styleDocument(): Record<string, unknown> | undefined {
    const record = this.styleRecord;
    return record !== undefined && record.revision > 0 ? readStyleDocument(record.document) : undefined;
  }

  private get behaviorChanges(): number {
    return dirtyKeys(this.record?.document, this.edits).length;
  }

  private get styleChanges(): number {
    return styleDirtyKeys(this.styleDocument, this.styleEdits).length;
  }

  /** One Save for both records: each that changed is sent over its own
   * revision, side by side, and each ends in its own way. A conflict on one
   * never costs the other its save or its edits. */
  private async save(): Promise<void> {
    const hass = this.hass;
    const ownerId = this.ownerId;
    if (!hass || ownerId === undefined || this.saving) return;
    const behavior = this.record?.document !== undefined && this.behaviorChanges > 0;
    const style = this.styleDocument !== undefined && this.styleChanges > 0;
    if (!behavior && !style) return;
    this.saving = true;
    this.note = undefined;
    this.changed();
    try {
      const notes = await Promise.all([
        behavior ? this.saveBehavior(hass, ownerId) : undefined,
        style ? this.saveStyle(hass, ownerId) : undefined,
      ]);
      if (ownerId !== this.ownerId) return;
      this.note = joinNotes(notes);
      this.pollIfWaiting();
    } finally {
      this.saving = false;
      this.changed();
    }
  }

  private async saveBehavior(hass: HassLike, ownerId: string): Promise<Note | undefined> {
    const record = this.record;
    if (record?.document === undefined) return undefined;
    const edits = this.edits;
    const document = buildSaveDocument(record.document, edits);
    try {
      const reply = await saveWatchConfig(hass, ownerId, "behavior", record.revision, document);
      if (ownerId !== this.ownerId) return undefined;
      // The store keeps the document as sent, so what was sent is the new
      // revision. Delivery stays where it was: no device has seen it yet.
      this.record = {
        ...record,
        revision: reply.revision,
        updated_at: new Date().toISOString(),
        updated_by: "panel",
        document,
      };
      if (this.edits === edits) this.edits = new Map();
      return undefined;
    } catch (err) {
      if (ownerId !== this.ownerId) return undefined;
      const code = errorCode(err);
      if (code === "conflict") {
        const stored = conflictRevision(err);
        await this.reread("behavior", ownerId);
        return {
          kind: "warn",
          text: `Your changes were not saved. These settings changed somewhere else${stored === undefined ? "" : ` (now revision ${stored})`}, so the newest copy is shown. Make your changes again on top of it.`,
        };
      }
      if (code === "no_record") {
        await this.reread("behavior", ownerId);
        return { kind: "warn", text: "Your changes were not saved. Home Assistant no longer holds settings for this watch. Start with the defaults again." };
      }
      return { kind: "err", text: `Could not save: ${errText(err)}` };
    }
  }

  /** The notification style's save: a conflict reads the newer copy and
   * lays these edits over it key by key, then sends again. */
  private async saveStyle(hass: HassLike, ownerId: string): Promise<Note | undefined> {
    const record = this.styleRecord;
    const document = this.styleDocument;
    if (record === undefined || document === undefined) return undefined;
    const edits = this.styleEdits;
    const result = await saveNotificationStyle({
      save: (base, doc) => saveWatchConfig(hass, ownerId, NOTIFICATION_STYLE_KIND, base, doc),
      fetch: () => fetchWatchConfig(hass, ownerId, NOTIFICATION_STYLE_KIND),
    }, { revision: record.revision, document }, edits);
    if (ownerId !== this.ownerId) return undefined;
    if (result.ok) {
      const base = result.fresh ?? record;
      this.styleRecord = result.alreadySaved
        ? base
        : { ...base, revision: result.revision, updated_at: new Date().toISOString(), updated_by: "panel", document: result.document };
      if (this.styleEdits === edits) this.styleEdits = new Map();
      if (result.alreadySaved) return { kind: "note", text: "The notification style already had these changes, so there was nothing to save." };
      return result.merged ? { kind: "note", text: "Notification style saved. Changes made elsewhere meanwhile were kept." } : undefined;
    }
    // The newest copy read is shown, and the edits stay on top of it for the
    // next Save.
    if (result.fresh !== undefined) this.styleRecord = result.fresh;
    if (result.code === "conflict") {
      return { kind: "warn", text: "The notification style was not saved: it kept changing elsewhere. Your changes are kept, so try Save again in a moment." };
    }
    if (result.code === "no_record") {
      if (result.fresh === undefined) await this.reread("style", ownerId);
      else this.styleEdits = new Map();
      return { kind: "warn", text: "The notification style was not saved. Home Assistant no longer holds one for this watch. Start with the defaults again." };
    }
    return { kind: "err", text: `Could not save the notification style: ${result.message}` };
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
    if (ownerId !== this.ownerId) {
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
    await this.reread("behavior", ownerId);
    this.pollIfWaiting();
  }

  /**
   * The notification style's "Start with the defaults": the app's fresh
   * install document (`01-defaults.json`) saved over revision 0, then read
   * back. The behavior record and its edits are left alone.
   */
  private async startStyle(): Promise<void> {
    const hass = this.hass;
    const ownerId = this.ownerId;
    const record = this.styleRecord;
    if (!hass || ownerId === undefined || this.styleStarting || this.saving) return;
    if (record !== undefined && record.revision > 0) return;
    this.styleStarting = true;
    this.note = undefined;
    this.changed();
    const result = await startNotificationStyle((base, document) => saveWatchConfig(hass, ownerId, NOTIFICATION_STYLE_KIND, base, document));
    this.styleStarting = false;
    if (ownerId !== this.ownerId) {
      this.changed();
      return;
    }
    if (result.ok) {
      this.note = { kind: "note", text: "Started the notification style with the defaults. The watch picks it up the next time it checks." };
    } else if (result.code === "no_record") {
      this.note = { kind: "warn", text: SETTINGS_PAIR_FIRST_TEXT };
      this.changed();
      return;
    } else if (result.code === "conflict") {
      this.note = { kind: "warn", text: STYLE_START_CONFLICT_TEXT };
    } else {
      this.note = { kind: "err", text: `Could not start: ${result.message}` };
      this.changed();
      return;
    }
    await this.reread("style", ownerId);
    this.pollIfWaiting();
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
    if (!this.active) return;
    if (deliveryState(this.record) !== "waiting" && deliveryState(this.styleRecord) !== "waiting") return;
    this.pollTimer = window.setTimeout(() => void this.poll(), DELIVERY_POLL_MS);
  }

  private async poll(): Promise<void> {
    this.pollTimer = undefined;
    const hass = this.hass;
    const ownerId = this.ownerId;
    if (!hass || ownerId === undefined || !this.active) return;
    await Promise.all([
      deliveryState(this.record) === "waiting" ? this.freshen(hass, ownerId, "behavior") : undefined,
      deliveryState(this.styleRecord) === "waiting" ? this.freshen(hass, ownerId, "style") : undefined,
    ]);
    this.pollIfWaiting();
  }

  /** One record's check while it waits: only the delivery fields are taken
   * while the revision is the one shown. A newer revision means someone else
   * wrote since, and with no edits in that record it replaces what is shown. */
  private async freshen(hass: HassLike, ownerId: string, which: "behavior" | "style"): Promise<void> {
    const shown = which === "behavior" ? this.record : this.styleRecord;
    if (shown === undefined) return;
    try {
      const fresh = await fetchWatchConfig(hass, ownerId, which === "behavior" ? "behavior" : NOTIFICATION_STYLE_KIND);
      const now = which === "behavior" ? this.record : this.styleRecord;
      if (ownerId !== this.ownerId || now !== shown || !this.active) return;
      const edits = which === "behavior" ? this.edits : this.styleEdits;
      let next: WatchConfigRecord | undefined;
      if (fresh.revision === shown.revision) {
        next = { ...shown, delivered_revision: fresh.delivered_revision, delivered_at: fresh.delivered_at };
      } else if (edits.size === 0 && !this.saving) {
        next = fresh;
      }
      if (next !== undefined) {
        if (which === "behavior") this.record = next;
        else this.styleRecord = next;
      }
      this.changed();
    } catch {
      // A missed check is not news: the next one, or reopening, will tell.
    }
  }

  private stopPolling(): void {
    if (this.pollTimer !== undefined) window.clearTimeout(this.pollTimer);
    this.pollTimer = undefined;
  }

  // ── discarding ─────────────────────────────────────────────────────────

  /** Whether the form holds unsaved changes to either record. */
  get dirty(): boolean {
    return this.behaviorChanges > 0 || this.styleChanges > 0;
  }

  /** Save from the keyboard (⌘S or Ctrl+S on the page), as the button would:
   * nothing when it could not run. */
  saveFromKey(): void {
    if (this.canSave) void this.save();
  }

  /** The person agreed to leave the panel with settings unsaved: every
   * watch's kept edits go, the ones on screen included. */
  dropKept(): void {
    dropWatchSettingsDrafts();
    this.discard();
  }

  /** The bar's Discard: it asks first, since the edits have no undo. */
  private askDiscard(): void {
    const changes = this.behaviorChanges + this.styleChanges;
    if (changes === 0) return;
    this.confirm = {
      text: `Throw away ${changes} unsaved ${changes === 1 ? "change" : "changes"}?`,
      label: "Discard",
      run: () => this.discard(),
    };
    this.changed();
  }

  /** Back to the copies Home Assistant holds. */
  private discard(): void {
    this.edits = new Map();
    this.styleEdits = new Map();
    this.confirm = undefined;
    this.changed();
  }

  /** A watch just paired on the card joins the device list and becomes the
   * one shown, and the panel's shared watch, whether or not another watch
   * was open. Edits on the watch shown before are kept for it, so nothing
   * needs asking. Nothing moves once the page has been left. */
  private async showPaired(watchId: string, stale: () => boolean): Promise<void> {
    if (!this.refreshOwners) return;
    let owners: readonly OwnerSummary[];
    try {
      owners = await this.refreshOwners();
    } catch {
      return;
    }
    if (stale()) return;
    const watches = settingsWatches(owners);
    const id = watches.some((w) => w.owner_watch_id === watchId)
      ? watchId
      : this.ownerId === undefined ? initialWatch(watches, undefined) : undefined;
    if (id === undefined) return;
    this.confirm = undefined;
    void this.load(id, true);
    this.onPaired?.(id);
  }

  private edit(setting: CatalogSetting, value: SettingValue): void {
    this.edits = withEdit(this.edits, this.record?.document, setting, value);
    this.confirm = undefined;
    this.changed();
  }

  private editStyle(row: StyleRow, value: StyleValue): void {
    this.styleEdits = withStyleEdit(this.styleEdits, this.styleDocument, row, value);
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

  /**
   * The page: a bar that stays at the top while the cards scroll under it
   * (the title and which watch and revision at the left, where the settings
   * have got to and Save at the right), then the cards. On a wide page the
   * behavior cards and the notification style's sit in two columns, the
   * pairing and client certificate cards under the second; on a narrow one
   * they are one column in that order. A home with no watch yet has those
   * two cards alone.
   */
  render(hass: HassLike, owners: readonly OwnerSummary[], options: { narrow?: boolean } = {}): TemplateResult {
    this.hass = hass;
    const watches = settingsWatches(owners);
    const owner = watches.find((w) => w.owner_watch_id === this.ownerId);
    this.shownOwner = owner;
    const name = owner ? watchName(owner, watches) : "Watch";
    // A watch whose settings live in another home: the note stands in for
    // both editors, and the pairing card stays.
    const elsewhere = takesSettingsFromAnotherHome(owner);
    const one = this.ownerId === undefined || elsewhere;
    return html`<div class="ws-page">
      <div class="ws-top">
        ${this.renderBar(name, options.narrow === true, elsewhere)}
        ${this.note ? html`<div class="banner ${this.note.kind} ws-note" role="alert"><span>${this.note.text}</span>
          <button class="link" @click=${() => { this.note = undefined; this.changed(); }}>Dismiss</button></div>` : nothing}
      </div>
      <div class="ws-cols ${one ? "one" : ""}">
        ${elsewhere
          ? html`<div class="ws-body ws-col"><div class="xf-lead ws-main-house">${uiIcon("info")}<span>${SETTINGS_MAIN_HOUSE_TEXT}</span></div>${this.pairCard.render()}${this.cert.render(hass)}</div>`
          : one
          ? html`<div class="ws-body ws-col">${this.renderBehavior(hass)}${this.pairCard.render()}${this.cert.render(hass)}</div>`
          : html`<div class="ws-body ws-col">${this.loading ? html`<div class="empty">Loading…</div>` : this.renderBehavior(hass)}</div>
            <div class="ws-body ws-col">${this.loading ? nothing : this.renderStyle()}${this.pairCard.render()}${this.cert.render(hass)}</div>`}
      </div>
    </div>`;
  }

  /** Beside the title: which watch, and which revision of its settings. */
  private headLine(name: string): string {
    if (this.ownerId === undefined) return "No watch paired yet";
    const r = this.record;
    const s = this.styleRecord;
    const style = s !== undefined && s.revision > 0 ? ` · notification style revision ${s.revision}` : "";
    if (r === undefined || r.revision <= 0) return `${name}${style}`;
    const by = savedByWords(r.updated_by);
    const at = r.updated_at ? Date.parse(r.updated_at) : NaN;
    const when = Number.isNaN(at) ? "" : ` ${agoWords(Math.max(0, (Date.now() - at) / 1000))}`;
    return `${name} · revision ${r.revision}, ${by}${when}${style}`;
  }

  /** The behavior settings' cards, or what stands in for them. */
  private renderBehavior(hass: HassLike) {
    if (this.loadError !== undefined) {
      const id = this.ownerId;
      return html`<div class="xf-lead warn">${uiIcon("info")}<span>Could not read this watch's settings: ${this.loadError}</span></div>
        ${id === undefined ? nothing : html`<button class="small ws-retry" @click=${() => void this.reread("behavior", id)}>Try again</button>`}`;
    }
    if (this.ownerId === undefined) {
      return html`<div class="xf-lead">${uiIcon("info")}<span><b>No watch has connected to this Home Assistant yet.</b> Pair one below.</span></div>`;
    }
    const record = this.record;
    if (record === undefined) return nothing;
    // A record that is there but unreadable is not "no settings yet": a
    // start would only meet a conflict.
    if (watchRecordUnreadable(record, (document) => document)) {
      return html`<div class="xf-lead warn">${uiIcon("info")}<span>${SETTINGS_UNREADABLE_TEXT}</span></div>`;
    }
    if (record.revision <= 0 || record.document === undefined) {
      // While the iPhone's move may still come it waits, and the start is a
      // small link that asks first.
      const state = noRecordStart(this.shownOwner);
      return html`<div class="xf-lead">${uiIcon("info")}<span><b>No settings from this watch yet.</b> ${noRecordText(state, SETTINGS_NO_RECORD_TEXT)}</span></div>
        ${state === "wait"
          ? html`<button class="link start-fresh ws-start" ?disabled=${this.starting || this.saving}
              title="Save the app's default settings as this watch's first copy"
              @click=${() => { if (mayStart(state)) void this.start(); }}>${this.starting ? "Starting…" : START_FRESH_BUTTON}</button>`
          : html`<button class="small primary ws-start" ?disabled=${this.starting || this.saving}
              title="Save the app's default settings as this watch's first copy"
              @click=${() => void this.start()}>${this.starting ? "Starting…" : SETTINGS_START_BUTTON}</button>`}`;
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
      style=${look ? `--c:${look.color};--ws-hue:${look.color}` : nothing}>
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
      ${this.glyph("ws-ic", settingIcon(setting), 14)}${field}${helpLine}</div>`;
    switch (setting.type) {
      case "number": {
        const def = typeof setting.default === "number" ? setting.default : 0;
        return row(sliderField(setting.label, typeof value === "number" ? value : def, (v) => set(v), {
          min: setting.min ?? 0, max: setting.max ?? 10, step: setting.step ?? 1, def, format: (v) => v.toFixed(1),
        }));
      }
      case "domains":
        return this.renderDomains(setting, domainList(value), set);
      case "motionGestures":
        return this.renderTwists(hass, setting, typeof value === "object" && !Array.isArray(value) ? value as MotionActions : readMotionActions(setting, undefined), set);
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
   * width, all the same width, wrapping on a narrow column.
   */
  private renderTiles(setting: CatalogSetting, value: string, set: (v: SettingValue) => void) {
    const options = optionsFor(setting, value);
    const name = (v: string) => options.find((o) => o.value === v)?.label ?? v;
    return this.renderTileRow({
      key: setting.key, label: setting.label, icon: settingIcon(setting), help: setting.help,
      value, def: String(setting.default), name, tiles: tileChoices(setting, options, value),
    }, set);
  }

  /** The tile row both records' choices of up to five are drawn as. */
  private renderTileRow(
    row: { key: string; label: string; icon: string; help?: string | undefined; value: string; def: string; name: (v: string) => string; tiles: TileChoice[] },
    set: (v: string) => void,
  ) {
    const n = row.tiles.length;
    // Up to five side by side; on a narrow column five or more go three to a
    // line. A sixth (a stored value the catalog does not list) halves the row.
    const cols = n <= 5 ? n : Math.ceil(n / 2);
    const narrow = n >= 5 ? 3 : n;
    return html`<div class="ws-tile-row" data-key=${row.key}>
      <div class="ws-head">${this.glyph("ws-ic", row.icon, 14)}${settingTitle(row.label, row.value, row.def, (v) => set(v), row.name)}${row.help ? html`<div class="hint">${row.help}</div>` : nothing}</div>
      <div class="ws-tiles" role="group" aria-label=${row.label} data-n=${n} style=${`--cols:${cols};--cols-narrow:${narrow}`}>
        ${row.tiles.map((t) => this.renderTile(t, set))}
      </div>
    </div>`;
  }

  private renderTile(tile: TileChoice, set: (v: string) => void) {
    return html`<button type="button" class="ws-tile ${tile.on ? "on" : ""}" aria-pressed=${tile.on ? "true" : "false"}
      title=${tile.title ?? nothing} @click=${() => { if (!tile.on) set(tile.value); }}>
      ${tile.preview === undefined
        ? this.glyph("ws-tile-glyph", tile.icon, 16)
        : html`<span class="ws-tile-glyph" aria-hidden="true">${optionPreview(tile.preview, tile.value)}</span>`}
      <span class="ws-tile-name">${tile.name}</span>
      ${tile.detail === undefined ? nothing : html`<span class="ws-tile-detail">${tile.detail}</span>`}
    </button>`;
  }

  /**
   * The domains that skip the busy bounce, as a strip of tiles that each
   * turn on and off: a lit tile bounces, a dark one is in the stored list. A
   * stored domain the catalog does not list is one more tile, dark, so it can
   * be lit again.
   */
  private renderDomains(setting: CatalogSetting, skipped: readonly string[], set: (v: SettingValue) => void) {
    const tiles = domainTiles(setting, skipped);
    return html`<div class="ws-tile-row" data-key=${setting.key}>
      <div class="ws-head">${this.glyph("ws-ic", settingIcon(setting), 14)}<span>${setting.label}</span>${setting.help ? html`<div class="hint">${setting.help}</div>` : nothing}</div>
      <div class="ws-tiles" role="group" aria-label=${setting.label} data-n=${tiles.length} style="--cols:3;--cols-narrow:2">
        ${tiles.map((t) => html`<button type="button" class="ws-tile ${t.on ? "on" : ""}" aria-pressed=${t.on ? "true" : "false"}
          title=${t.on ? `${t.name}: bounce while waiting` : `${t.name}: no bounce`}
          @click=${() => set(t.on ? [...skipped, t.value] : skipped.filter((d) => d !== t.value))}>
          ${this.glyph("ws-tile-glyph", t.icon, 16)}<span class="ws-tile-name">${t.name}</span>
        </button>`)}
      </div>
    </div>`;
  }

  /** The wrist twists' row: for each gesture its action as a menu, then the
   * scene or script it runs when the action needs one. */
  private renderTwists(hass: HassLike, setting: CatalogSetting, value: MotionActions, set: (v: SettingValue) => void) {
    return html`${(setting.gestures ?? []).map((g) => {
      const action = motionAction(value, g.value);
      const options = optionsFor(setting, action).map((o): [string, string] => [o.value, o.label]);
      const kind = action === "Activate Scene" ? "scenes" : action === "Run Script" ? "scripts" : undefined;
      return html`<div class="ws-row" data-key=${`${setting.key}:${g.value}`}>
          ${this.glyph("ws-ic", gestureIcon(setting, g.value), 14)}${selectField(g.label, action, options, (v) => set(withMotionAction(value, g.value, v)), { def: "Disabled" })}
        </div>
        ${kind === undefined ? nothing : this.renderTwistTarget(hass, setting, value, g.value, kind, set)}`;
    })}`;
  }

  private renderTwistTarget(hass: HassLike, setting: CatalogSetting, value: MotionActions, gesture: string, kind: "scenes" | "scripts", set: (v: SettingValue) => void) {
    const domain = kind === "scenes" ? "scene" : "script";
    const id = value[kind][gesture] ?? "";
    const ref = id === "" ? { entityId: "", displayName: "", domain: "" } : entityRefFor(hass, id);
    return html`<div class="ws-row" data-key=${`${setting.key}:${gesture}:${domain}`}>
      ${this.glyph("ws-ic", kind === "scenes" ? "theatermasks" : "scroll.fill", 14)}
      ${entityField({ hass }, kind === "scenes" ? "Scene" : "Script", ref, (next) => set(withMotionTarget(value, kind, gesture, next.entityId)),
        `ws:${this.ownerId ?? ""}:${setting.key}:${gesture}:${domain}`, { domain })}
      ${setting.help ? html`<div class="hint">${setting.help}</div>` : nothing}
    </div>`;
  }

  // ── the notification style's cards ─────────────────────────────────────

  /** The Notifications, Sounds and Wrist Webhooks cards; one card in their
   * place while there is no record yet; nothing at all on an integration
   * that does not keep the kind. */
  private renderStyle() {
    if (this.styleUnsupported) return nothing;
    const id = this.ownerId;
    if (this.styleError !== undefined) {
      return this.renderStyleCard(html`<div class="xf-lead warn">${uiIcon("info")}<span>Could not read this watch's notification style: ${this.styleError}</span></div>
        ${id === undefined ? nothing : html`<button class="small ns-retry" @click=${() => void this.reread("style", id)}>Try again</button>`}`);
    }
    const record = this.styleRecord;
    if (record === undefined) return nothing;
    if (watchRecordUnreadable(record, readStyleDocument)) {
      return this.renderStyleCard(html`<div class="xf-lead warn">${uiIcon("info")}<span>${STYLE_UNREADABLE_TEXT}</span></div>`);
    }
    const document = this.styleDocument;
    if (document === undefined) {
      const state = noRecordStart(this.shownOwner);
      return this.renderStyleCard(html`<div class="xf-lead">${uiIcon("info")}<span><b>${STYLE_NO_RECORD_TITLE}</b> ${noRecordText(state, STYLE_NO_RECORD_TEXT)}</span></div>
        ${state === "wait"
          ? html`<button class="link start-fresh ns-start" ?disabled=${this.styleStarting || this.saving}
              title="Save the app's default notification style as this watch's first copy"
              @click=${() => { if (mayStart(state)) void this.startStyle(); }}>${this.styleStarting ? "Starting…" : START_FRESH_BUTTON}</button>`
          : html`<button class="small primary ns-start" ?disabled=${this.styleStarting || this.saving}
              title="Save the app's default notification style as this watch's first copy"
              @click=${() => void this.startStyle()}>${this.styleStarting ? "Starting…" : STYLE_START_BUTTON}</button>`}`);
    }
    const values = styleFormValues(document, this.styleEdits);
    return html`${NOTIFICATION_STYLE_SECTIONS.map((section) => this.renderStyleSection(section, values))}`;
  }

  /** The one card that stands in for the three. */
  private renderStyleCard(body: TemplateResult) {
    const look = STYLE_LOOK.notifications;
    return html`<section class="sec ns-card" data-sec="ws-notification-style" data-open="true" data-help="on" style=${`--c:${look.color};--ws-hue:${look.color}`}>
      <div class="sec-h pinned">
        <span class="swatch">${uiIcon(look.icon)}</span>
        <span class="tt"><h4>Notifications and sounds</h4></span>
      </div>
      <div class="sec-b">${body}</div>
    </section>`;
  }

  private renderStyleSection(section: StyleSection, values: ReadonlyMap<string, StyleValue>) {
    const look = STYLE_LOOK[section.id];
    const helpKey = `ns-${section.id}`;
    const help = !this.helpOff.has(helpKey);
    const helpLabel = help ? `Hide the help in ${section.title}` : `Show help for ${section.title}`;
    return html`<section class="sec" data-sec=${`ws-${section.id}`} data-open="true" data-help=${help ? "on" : "off"}
      style=${`--c:${look.color};--ws-hue:${look.color}`}>
      <div class="sec-h pinned">
        <span class="swatch">${uiIcon(look.icon)}</span>
        <span class="tt"><h4>${section.title}</h4></span>
        <button type="button" class="sec-help ${help ? "on" : ""}" aria-pressed=${help ? "true" : "false"} title=${helpLabel} aria-label=${helpLabel}
          @click=${() => this.toggleHelp(helpKey)}>?</button>
      </div>
      <div class="sec-b">
        ${section.id === "notifications"
          ? notificationPreview(values, (name, size, color) => this.icons?.()?.render(name, size, color))
          : nothing}
        ${section.groups.map((group) => {
          const runs = styleRuns(group, values);
          if (runs.length === 0) return nothing;
          return html`<div class="ws-group">${group.label}</div>
            ${runs.map((run) => html`${this.renderStyleRow(run.row, values)}${run.dependents.length === 0
              ? nothing
              : html`<div class="fgroup">${run.dependents.map((r) => this.renderStyleRow(r, values))}</div>`}`)}`;
        })}
      </div>
    </section>`;
  }

  /** One notification style row, in the same dress as the behavior rows. */
  private renderStyleRow(row: StyleRow, values: ReadonlyMap<string, StyleValue>) {
    const value = values.get(row.key) ?? row.default;
    const set = (v: StyleValue) => this.editStyle(row, v);
    const helpLine = row.help ? html`<div class="hint">${row.help}</div>` : nothing;
    if (styleUsesTiles(row)) {
      const options = styleOptionsFor(row, value);
      return this.renderTileRow({
        key: row.key, label: row.label, icon: row.icon, help: row.help,
        value: String(value), def: String(row.resetTo),
        name: (v) => options.find((o) => o.value === v)?.label ?? v,
        tiles: styleTileChoices(row, value),
      }, set);
    }
    const wrap = (field: TemplateResult, extra: TemplateResult | typeof nothing = nothing, hint: TemplateResult | typeof nothing = helpLine) =>
      html`<div class="ws-row" data-key=${row.key}>${this.glyph("ws-ic", row.icon, 14)}${field}${extra}${hint}</div>`;
    switch (row.type) {
      case "bool":
        return wrap(checkField(row.label, value === true, set, row.resetTo === true));
      case "enum": {
        const options = styleOptionsFor(row, value).map((o): [string, string] => [o.value, o.label]);
        return wrap(selectField(row.label, String(value), options, (v) => set(v), { def: String(row.resetTo) }));
      }
      case "number": {
        const volume = typeof value === "number" ? value : Number(row.default);
        const silent = volumeText(volume) === "Silent";
        return wrap(
          percentSliderField(row.label, volume, (v) => set(v), { step: VOLUME.step, def: Number(row.resetTo), min: VOLUME.min }),
          this.renderVolumePresets(volume, set),
          silent ? html`<div class="hint">Silent: the watch plays no sounds at all.</div>` : helpLine,
        );
      }
      case "sound":
        return wrap(this.soundField(row, String(value), set));
    }
  }

  /** The phone's four volume presets under the slider, the one that matches
   * lit. Silent is anything at or below the phone's silent level. */
  private renderVolumePresets(volume: number, set: (v: StyleValue) => void) {
    const silent = volumeText(volume) === "Silent";
    return html`<div class="seg wide ns-presets" role="radiogroup" aria-label="Volume presets">
      ${VOLUME.presets.map((p) => {
        const on = p.value <= VOLUME.silentBelow ? silent : !silent && Math.abs(volume - p.value) < 0.001;
        return html`<button type="button" role="radio" aria-checked=${on ? "true" : "false"} class=${on ? "on" : ""}
          @click=${() => { if (!on) set(p.value); }}>${p.label}</button>`;
      })}
    </div>`;
  }

  /** A sound as a menu: "Default" and "None" first, then the phone's Short
   * and Longer lists. No preview: the panel plays nothing. */
  private soundField(row: StyleRow, value: string, set: (v: StyleValue) => void) {
    const choices = soundChoices(row, value);
    const option = (o: { value: string; label: string }) => html`<option value=${o.value} ?selected=${o.value === value}>${o.label}</option>`;
    return html`<label class="field">${settingTitle(row.label, value, String(row.resetTo), (v: string) => set(v), (v) => soundValueText(row, v))}
      <select .value=${live(value)} @change=${(e: Event) => set((e.target as HTMLSelectElement).value)}>
        ${choices.lead.map(option)}
        ${choices.groups.map((g) => html`<optgroup label=${g.label}>${g.options.map(option)}</optgroup>`)}
      </select></label>`;
  }

  /** Whether Save can run (`settingsCanSave`). */
  private get canSave(): boolean {
    return settingsCanSave({
      behaviorChanges: this.behaviorChanges,
      styleChanges: this.styleChanges,
      busy: this.saving || this.starting || this.styleStarting,
      behaviorHeld: this.record?.document !== undefined,
      styleHeld: this.styleDocument !== undefined,
    });
  }

  /** The page's bar, the way the other watch screens draw theirs: the title
   * and the head line at the left; at the right the unsaved count or where
   * the settings have got to, Discard while there is something to throw
   * away, and Save. Before edits are thrown away it asks there instead.
   * `elsewhere`: the watch takes its settings from another home, so nothing
   * here is on its way to it and no sync pill shows. */
  renderBar(name = "Watch", stacked = false, elsewhere = false) {
    const confirm = this.confirm;
    const head = html`<span class="ws-title">Watch settings</span><span class="ws-head-line">${this.headLine(name)}</span>
      <span class="spacer"></span>`;
    if (confirm) {
      return html`<div class="wa-bar ws-bar ${stacked ? "stacked" : ""}" role="toolbar" aria-label="Watch settings">${head}
        <span class="xf-sub ws-ask">${confirm.text}</span>
        <button class="tb-btn" @click=${() => { this.confirm = undefined; this.changed(); }}>Keep editing</button>
        <button class="primary" @click=${() => { this.confirm = undefined; confirm.run(); }}>${confirm.label}</button>
      </div>`;
    }
    const behaviorChanges = this.behaviorChanges;
    const styleChanges = this.styleChanges;
    const changes = behaviorChanges + styleChanges;
    // A watch with no record is created by "Start with the defaults" in the
    // body; Save sends edits to a record that exists. Both records save under
    // the one button.
    const canSave = this.canSave;
    return html`<div class="wa-bar ws-bar ${stacked ? "stacked" : ""}" role="toolbar" aria-label="Watch settings">${head}
      ${changes > 0
        ? html`<span class="xf-sub ws-changes">${changes} unsaved ${changes === 1 ? "change" : "changes"}</span>`
        : elsewhere ? nothing : this.renderDelivery()}
      ${changes > 0 ? html`<button class="tb-btn ws-discard" ?disabled=${this.saving}
        title="Go back to the copies Home Assistant holds" @click=${() => this.askDiscard()}>Discard</button>` : nothing}
      ${this.ownerId === undefined ? nothing : html`<button class="primary save ${changes > 0 ? "dirty" : ""}" ?disabled=${!canSave}
        title=${changes > 0 ? `Save (${SAVE_KEY}). The watch picks these settings up the next time it checks.` : `Nothing to save (${SAVE_KEY})`}
        @click=${() => void this.save()}>${this.saving ? "Saving…" : "Save"}</button>`}
    </div>`;
  }

  /** The header's sync pill, saying whether a device has collected the
   * revisions shown, the settings' and the notification style's: green once
   * every one held has been, amber while a save of either waits. */
  private renderDelivery() {
    const held = [
      { what: "Settings", record: this.record },
      { what: "Notification style", record: this.styleUnsupported ? undefined : this.styleRecord },
    ].flatMap(({ what, record }) => {
      const state = deliveryState(record);
      return state === "none" || record === undefined ? [] : [{ what, revision: record.revision, state }];
    });
    if (held.length === 0) return nothing;
    const waiting = held.filter((h) => h.state === "waiting");
    if (waiting.length === 0) {
      const title = held.map((h) => `${h.what} revision ${h.revision} has been collected.`).join(" ");
      return html`<span class="tb-sync ok" title=${title}>
        <i class="tb-dot" aria-hidden="true"></i><span class="tb-sync-l">${COLLECTED_PILL_TEXT}</span>
      </span>`;
    }
    const title = `${waiting.map((h) => `${h.what} saved as revision ${h.revision}.`).join(" ")} ${WAITING_HELP_TEXT}`;
    return html`<span class="tb-sync warn sending" title=${title}>
      <i class="tb-dot" aria-hidden="true"></i><span class="tb-sync-l">${WAITING_PILL_TEXT}</span>
    </span>`;
  }
}

function errText(err: unknown): string {
  return String((err as { message?: string })?.message ?? err);
}

/** The two saves' notes as one: their words side by side, at the graver of
 * their two kinds. None when neither had anything to say. */
function joinNotes(notes: readonly (Note | undefined)[]): Note | undefined {
  const said = notes.filter((n): n is Note => n !== undefined);
  if (said.length <= 1) return said[0];
  const rank = { note: 0, warn: 1, err: 2 } as const;
  const kind = said.reduce<Note["kind"]>((k, n) => (rank[n.kind] > rank[k] ? n.kind : k), "note");
  return { kind, text: said.map((n) => n.text).join(" ") };
}

/** The page's own rules, added to the panel's sheet. Everything else it
 * wears (bar, cards, rows, pill, Save) is the panel's. */
export const watchSettingsStyles = css`
  /* The page scrolls under its bar, which stays at the top so Save is always
     in reach. The page is a container, so the columns follow its width
     rather than the window's. */
  .ws-page {
    flex: 1 1 auto; min-height: 0; overflow: auto; box-sizing: border-box;
    background: var(--wa-bg); color: var(--wa-ink); container: wspage / inline-size;
  }
  .ws-top { position: sticky; top: 0; z-index: 7; display: flex; flex-direction: column; background: var(--wa-bg); }
  .ws-top > .wa-bar { margin-bottom: 0; }
  .ws-bar .ws-title { font-size: 14px; font-weight: 600; letter-spacing: -.01em; padding: 0 4px; white-space: nowrap; }
  .ws-bar .ws-head-line { flex: 0 1 auto; min-width: 0; font-size: 12px; color: var(--wa-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .ws-bar .ws-changes, .ws-bar .ws-ask { flex: 0 1 auto; min-width: 0; }
  .ws-bar .tb-sync { min-width: 0; flex: 0 1 auto; }
  .ws-top > .ws-note { display: flex; align-items: center; gap: 10px; box-sizing: border-box; width: min(720px, calc(100% - 32px)); margin: 10px auto 0; }
  .ws-top > .ws-note > span { flex: 1; min-width: 0; }
  /* A centred column at most as wide as the dialog it replaced; two columns
     once the page has room for two of them side by side. Each column is a
     container of its own, so a row's narrow rules follow the column. */
  .ws-cols {
    box-sizing: border-box; width: min(720px, 100%); margin: 0 auto; padding: 16px 16px 48px;
    display: grid; grid-template-columns: minmax(0, 1fr); gap: 8px 20px; align-items: start;
  }
  @container wspage (min-width: 1100px) {
    .ws-top > .ws-note { width: min(1320px, calc(100% - 32px)); }
    .ws-cols:not(.one) { width: min(1320px, 100%); grid-template-columns: repeat(2, minmax(0, 1fr)); }
  }
  @media (max-width: 640px) {
    .ws-cols { padding: 12px 12px 32px; }
  }
  .ws-col { display: flex; flex-direction: column; min-width: 0; container: xfer / inline-size; }
  .ws-col > * { flex: none; }
  .ws-col > .empty { padding: 12px 2px; color: var(--wa-muted); }
  /* The cards sit closer than the panel's usual blocks, and the title column
     is wider than the inspector's: these titles are whole phrases with an
     icon in front. The help column is set again beside it, because the
     panel's is worked out from the panel's own title width. */
  .ws-body { --wa-lab: 172px; --wa-col: 180px; gap: 8px; }
  .ws-body > .sec { margin: 0; }
  @container xfer (max-width: 440px) {
    .ws-body .sec { --wa-lab: 122px; --wa-col: 130px; }
  }
  /* Each setting's icon: a small chip in its card's hue, the one place a
     setting carries color. A fixed box, so a row does not move when the
     symbol file arrives. The symbol provider paints white; the chip's color
     wins here. */
  .ws-body .ws-ic {
    width: 22px; height: 22px; flex: none; display: grid; place-items: center; border-radius: 6px; pointer-events: none;
    color: var(--ws-hue, var(--wa-muted)); background: color-mix(in srgb, var(--ws-hue, var(--wa-muted)) 15%, transparent);
  }
  .ws-body :is(.ws-ic, .ws-tile-glyph) svg { display: block; overflow: visible; }
  .ws-body .ws-ic svg { width: 13px; height: 13px; }
  .ws-body :is(.ws-ic, .ws-tile-glyph) svg:not(.ws-pv) path { fill: currentColor; fill-opacity: 1; }
  /* Settings are a list: a hairline between each, none over the first. */
  .ws-body :is(.sec-b, .fgroup) > :is(.ws-row, .ws-tile-row) { padding: 7px 0; border-top: 1px solid var(--wa-line); }
  .ws-body :is(.sec-b, .fgroup) > :is(.ws-row, .ws-tile-row):first-child { border-top: 0; padding-top: 3px; }
  .ws-body .sec-b > :is(.ws-row, .ws-tile-row):last-child { padding-bottom: 2px; }
  .ws-body .fgroup { margin: 0 -8px 8px; padding: 2px 8px; }
  .ws-body .fgroup > :last-child { padding-bottom: 5px; }
  /* Help reads as a quiet second line, upright. */
  .ws-body .sec[data-help] > .sec-b :is(.ws-row, .ws-head) > .hint { padding: 0; margin: 0; font-style: normal !important; font-size: 11.5px; line-height: 1.35; color: var(--wa-muted); }
  /* A row drawn by the panel's own field: the chip, then the title with its
     help under it, and the control at the right edge. */
  .ws-row { display: grid; grid-template-columns: 22px minmax(0, 1fr) auto; column-gap: 9px; align-items: center; }
  .ws-row > .ws-ic { grid-column: 1; grid-row: 1 / span 2; align-self: start; }
  .ws-row > .field { display: contents; }
  .ws-row > .field > :first-child { grid-column: 2; grid-row: 1; color: var(--wa-ink); font-size: 12.5px; font-weight: 500; }
  .ws-row > .field > :not(:first-child) { grid-column: 3; grid-row: 1 / span 2; justify-self: end; }
  .ws-row > .field:not(.check) > :not(:first-child) { width: 250px; max-width: 44cqw; box-sizing: border-box; }
  .ws-row > .hint { grid-column: 2; grid-row: 2; }
  .ws-row > :not(.ws-ic, .hint, .field) { grid-column: 2 / -1; min-width: 0; }
  /* A row of tiles: the chip, title and help on one line, the strip of
     choices under them, starting where the title starts. */
  .ws-head { position: relative; display: flex; align-items: center; gap: 9px; min-height: 22px; }
  .ws-head > span:not(.ws-ic) { flex: none; max-width: 100%; min-width: 0; color: var(--wa-ink); font-size: 12.5px; font-weight: 500; line-height: 1.25; overflow-wrap: break-word; }
  .ws-head button.reset-dot { top: 50%; margin-top: -2.5px; }
  .ws-body .sec[data-help] > .sec-b .ws-head > .hint { flex: 1 1 0; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  /* The choices are one strip: a single outline with hairlines between the
     choices, the picked one a raised grey with the brighter line. Neutral, no
     hue. Five at most to a line, three on a narrow column. */
  .ws-tiles {
    display: grid; grid-template-columns: repeat(var(--cols, 3), minmax(0, 1fr)); gap: 1px; margin: 6px 0 0 31px;
    border: 1px solid var(--wa-line-strong); border-radius: 8px; overflow: hidden; background: var(--wa-line-strong);
  }
  @container xfer (max-width: 440px) {
    .ws-tiles { grid-template-columns: repeat(var(--cols-narrow, 3), minmax(0, 1fr)); margin-left: 0; }
    .ws-row > .field:not(.check) > :not(:first-child) { width: 150px; }
  }
  button.ws-tile {
    --ws-tile-bg: var(--wa-field);
    font: inherit; min-width: 0; min-height: 32px; margin: 0; padding: 3px 6px; cursor: pointer;
    display: grid; grid-template-columns: auto minmax(0, auto); align-items: center; justify-content: center; column-gap: 7px; row-gap: 0;
    border: 0; border-radius: 0; background: var(--ws-tile-bg); color: var(--wa-label);
    transition: background-color .12s ease-out, color .12s ease-out;
  }
  button.ws-tile:hover:not(:disabled) { --ws-tile-bg: color-mix(in srgb, var(--wa-ink) 6%, var(--wa-field)); color: var(--wa-ink); }
  button.ws-tile.on {
    --ws-tile-bg: color-mix(in srgb, var(--ws-hue, var(--wa-ink)) 16%, var(--wa-seg-on));
    color: var(--wa-ink); box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--ws-hue, var(--wa-ink)) 45%, var(--wa-seg-on));
  }
  button.ws-tile:focus-visible { outline: none; box-shadow: inset 0 0 0 2px color-mix(in srgb, var(--wa-ink) 60%, transparent); }
  button.ws-tile:disabled { opacity: .45; cursor: default; }
  .ws-tile-glyph { grid-row: 1 / span 2; height: 20px; min-width: 16px; display: grid; place-items: center; color: var(--wa-muted); }
  .ws-tile-name:last-child { grid-row: 1 / span 2; }
  .ws-tile-glyph svg { height: 15px; width: auto; max-width: 100%; }
  .ws-tile-glyph svg.ws-pv { width: 32px; height: 18px; }
  button.ws-tile.on .ws-tile-glyph { color: color-mix(in srgb, var(--ws-hue, var(--wa-ink)) 55%, var(--wa-ink)); }
  .ws-tile-name { max-width: 100%; font-size: 11.5px; font-weight: 500; line-height: 1.2; text-align: left; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  button.ws-tile.on .ws-tile-name { font-weight: 600; }
  .ws-tile-detail {
    max-width: 100%; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 10px; line-height: 1.2;
    grid-column: 2; color: var(--wa-muted); text-align: left; overflow-wrap: break-word;
  }
  button.ws-tile.on .ws-tile-detail { color: var(--wa-label); }
  .ws-body > button.ws-retry, .ws-body > button.ws-start { align-self: flex-start; }
  /* The indicator has no opacity, so the color row drops the percent box. */
  .ws-body .color-box .alpha { display: none; }
  /* The notification style's cards: the phone's groups as small headings
     between the rows, the volume presets under the slider. */
  .ws-body .sec-b > .ws-group {
    margin: 8px 0 1px; font-size: 10.5px; font-weight: 600; letter-spacing: .04em; text-transform: uppercase; color: var(--wa-muted);
  }
  .ws-body .sec-b > .ws-group:first-child, .ws-body .sec-b > .ns-pv + .ws-group { margin-top: 2px; }
  .ws-body .sec-b > .ws-group + :is(.ws-row, .ws-tile-row) { border-top: 0; padding-top: 3px; }
  .ws-row > .ns-presets { margin: 6px 0 0; }
  .ws-body > .sec .ns-start, .ws-body > .sec .ns-retry { align-self: flex-start; }
  ${notificationPreviewStyles}
  ${clientCertStyles}
  ${pairCardStyles}
`;
