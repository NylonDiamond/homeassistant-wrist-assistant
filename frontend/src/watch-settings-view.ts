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
// it the next time it checks. A watch with no record yet opens ready on the
// defaults, unsaved, and its first Save creates the record; or the record
// comes from its iPhone's one-time move. There is no live line, so while a
// save waits the page asks the store again now and then and turns the pill
// green once the watch has it.
//
// The page shows one group of cards at a time, picked in a side panel that
// also searches every group (`watch-settings-nav.ts` says which card is in
// which group). Every setting is always in one group: nothing is hidden.
//
// The watch's notification style (kind `notification_style`) is a second
// record shown on the same page, as the Notifications, Sounds and Wrist
// Webhooks cards. It loads with `behavior`, and the one Save sends whichever
// of the two changed, each over its own revision. Its thinking is in
// `watch-notification-style/model.ts`.

import { css, html, nothing, type ReactiveController, type ReactiveControllerHost, type TemplateResult } from "lit";
import { live } from "lit/directives/live.js";
import { checkField, colorField, entityField, entityRefFor, percentSliderField, selectField, settingTitle, sliderField } from "./editors.js";
import {
  type HassLike,
  type OwnerSummary,
  type WatchConfigRecord,
  fetchWatchConfig,
  saveWatchConfig,
  subscribeWatchConfig,
} from "./ha-api.js";
import { SECTION_COLOR } from "./kinds.js";
import type { IconProvider } from "./renderer.js";
import { agoWords } from "./send-state.js";
import { type UiIconName, uiIcon } from "./ui-icons.js";
import {
  type BehaviorDocument,
  type CatalogSection,
  type CatalogSetting,
  type MotionActions,
  type PairDeviceKind,
  type SettingValue,
  COLLECTED_PILL_TEXT,
  NEW_WATCH_TEXT,
  NOTHING_TO_SAVE_TEXT,
  SETTINGS_PAIR_FIRST_TEXT,
  SETTINGS_MAIN_HOUSE_TEXT,
  SETTINGS_UNREADABLE_TEXT,
  START_FRESH_BUTTON,
  WAITING_HELP_TEXT,
  WAITING_TEXT,
  WAIT_FOR_IPHONE_TEXT,
  WATCH_SETTINGS_CATALOG,
  buildSaveDocument,
  conflictRevision,
  deliveryState,
  dirtyKeys,
  domainList,
  errorCode,
  formValues,
  initialWatch,
  mayStart,
  motionAction,
  noRecordStart,
  optionsFor,
  readMotionActions,
  savedLine,
  sectionRuns,
  settingValue,
  settingsWatches,
  takesSettingsFromAnotherHome,
  watchBehaviorDefaults,
  watchName,
  watchRecordUnreadable,
  withEdit,
  withMotionAction,
  withMotionTarget,
} from "./watch-settings.js";
import {
  SETTINGS_MOVED_TEXT,
  dropWatchSettingsDrafts,
  keepSettingsDraft,
  keptSettingsDraft,
  restoreSettingsDraft,
  settingsStartedFresh,
  startSettingsFresh,
} from "./watch-settings-draft.js";
import { settingsCanSave, settingsPageStep } from "./watch-settings-page.js";
import { demoPicture } from "./watch-settings-demo.js";
import { type TileChoice, WATCH_SETTING_LOOK, domainTiles, gestureIcon, optionPreview, settingIcon, tileChoices, usesTiles } from "./watch-settings-look.js";
import { type SettingsCardId, type SettingsGroup, SETTINGS_GROUPS, groupOfCard, matchesSearch, searchTerms, settingsGroup } from "./watch-settings-nav.js";
import {
  type StyleDocument,
  type StyleRow,
  type StyleSection,
  type StyleValue,
  NOTIFICATION_STYLE_KIND,
  NOTIFICATION_STYLE_SECTIONS,
  STYLE_NO_RECORD_TITLE,
  STYLE_UNREADABLE_TEXT,
  VOLUME,
  notificationStyleDefaults,
  notificationStyleReadMeansUnsupported,
  readStyleDocument,
  saveNotificationStyle,
  soundChoices,
  soundValueText,
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
import { friendlyError } from "./friendly-error.js";

/** How often the page asks whether a device has collected a save. */
const DELIVERY_POLL_MS = 15_000;

const IS_MAC = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
/** Save's key, as its hover text names it. */
const SAVE_KEY = IS_MAC ? "⌘S" : "Ctrl+S";

/** Each card's mark and tint, from the inspector's own palette. */
const SECTION_LOOK: Record<string, { icon: UiIconName; color: string }> = {
  connection: { icon: "globe", color: SECTION_COLOR.place },
  gestures: { icon: "tap", color: SECTION_COLOR.tap },
  motion: { icon: "watch", color: SECTION_COLOR.home },
  navigation: { icon: "pages", color: SECTION_COLOR.numbers },
  controls: { icon: "radial", color: "var(--wa-hue-blue)" },
  camera: { icon: "image", color: SECTION_COLOR.look },
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
  /** What a new watch's page opens on while Home Assistant holds no record
   * of a kind: the defaults the first Save creates. Made once, read only
   * (a save sends a copy, `buildSaveDocument`). */
  private readonly readyBehavior: BehaviorDocument = watchBehaviorDefaults();
  private readonly readyStyle: StyleDocument = notificationStyleDefaults();
  /** The notification style record, beside `record`. */
  private styleRecord?: WatchConfigRecord;
  private styleEdits: ReadonlyMap<string, StyleValue> = new Map();
  /** The integration does not keep the kind: its cards are left out. */
  private styleUnsupported = false;
  private styleError?: string;
  private note?: Note;
  private confirm?: Confirm;
  /** The watch row the page shows, for its no-record state
   * (`noRecordStart`). Set when the page is handed the watch and on every
   * draw. */
  private shownOwner?: OwnerSummary;
  /** Sections whose help is hidden. Help starts shown: this is a form people
   * fill once, and its short titles ("Delay", "Debounce") need their line. */
  private helpOff: ReadonlySet<string> = new Set();
  /** The side panel's group on show (`watch-settings-nav.ts`). It stays
   * when the row moves to another watch, so the same settings stay in view. */
  private group = SETTINGS_GROUPS[0]!.id;
  /** The side panel's search. While it holds words the page shows the
   * matching settings of every group instead of one group. */
  private query = "";
  /** Bumped by every load, so a reply that arrives after another watch was
   * picked, or after a newer load, is dropped. */
  private loadSeq = 0;
  private pollTimer?: number;
  // The live line for the watch on the page (`follow`): another writer's
  // save of its settings or its notification style is shown at once.
  private subscribeSeq = 0;
  private unsubscribe?: () => Promise<void>;
  private followed?: string;
  /** The "Pair a device" card, after the other cards. It starts afresh on
   * each visit, and a watch paired on it becomes the one shown. */
  private readonly pairCard = new PairWatchCard(() => this.changed(), (id, stale, kind) => this.showPaired(id, stale, kind));
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
    if (this.active) {
      this.pollIfWaiting();
      if (this.ownerId !== undefined && !this.loading) this.follow(this.ownerId);
    }
  }

  hostDisconnected(): void {
    this.stopPolling();
    this.unfollow();
    this.pairCard.stopOffer();
  }

  /** Every change: the page is drawn again, and the watch's form is kept as
   * it stands (`watch-settings-draft.ts`), so leaving it loses nothing. Not
   * while a load is out: the form is between two watches then. */
  private changed(): void {
    if (!this.loading && this.ownerId !== undefined) {
      keepSettingsDraft(this.ownerId, {
        behaviorRevision: this.record?.revision ?? 0,
        behaviorDocument: this.behaviorDocument,
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
    this.shownOwner = settingsWatches(owners).find((w) => w.owner_watch_id === id);
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
      this.unfollow();
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
    this.unfollow();
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
    const restored = restoreSettingsDraft(keptSettingsDraft(ownerId), this.record, this.styleRecord, {
      behavior: this.behaviorIsNew ? this.readyBehavior : undefined,
      style: this.styleIsNew ? this.readyStyle : undefined,
    });
    this.edits = restored.edits;
    this.styleEdits = restored.styleEdits;
    if (restored.moved && !keepNote) this.note = { kind: "warn", text: SETTINGS_MOVED_TEXT };
    this.loading = false;
    this.pollIfWaiting();
    this.follow(ownerId);
    this.changed();
  }

  /**
   * Hear every save of this watch's settings and notification style while
   * the page shows it, as the other watch editors do. A save made somewhere
   * else (the iPhone, another panel, a forced write) replaces what is shown
   * when the form holds no edits to that record; with edits the form is
   * kept, and Save then says the settings changed somewhere else
   * (`freshen`, and the save's own conflict).
   */
  private follow(ownerId: string): void {
    const hass = this.hass;
    if (!hass || this.followed === ownerId) return;
    this.unfollow();
    this.followed = ownerId;
    const seq = ++this.subscribeSeq;
    subscribeWatchConfig(hass, ownerId, (event) => {
      if (seq !== this.subscribeSeq || ownerId !== this.ownerId || this.loading || !this.active) return;
      const now = this.hass;
      if (!now) return;
      if (event.kind === "behavior" && event.revision !== (this.record?.revision ?? 0)) {
        void this.freshen(now, ownerId, "behavior");
      } else if (event.kind === NOTIFICATION_STYLE_KIND && event.revision !== (this.styleRecord?.revision ?? 0)) {
        void this.freshen(now, ownerId, "style");
      }
    }).then(
      (unsubscribe) => {
        if (seq === this.subscribeSeq) this.unsubscribe = unsubscribe;
        else void unsubscribe().catch(() => undefined);
      },
      () => {
        // No live line (an older integration): the delivery checks still
        // pick a newer copy up while a save waits.
        if (seq === this.subscribeSeq) this.followed = undefined;
      },
    );
  }

  private unfollow(): void {
    this.subscribeSeq++;
    this.followed = undefined;
    const unsubscribe = this.unsubscribe;
    this.unsubscribe = undefined;
    void unsubscribe?.().catch(() => undefined);
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

  /**
   * Whether `record` is a kind Home Assistant holds nothing of for the watch
   * shown, and the page opens ready on its defaults: unsaved, held only here,
   * so nothing asks before leaving until a change, and the first Save
   * creates the record over revision 0. With no iPhone to wait for this is
   * how the page opens; while one may still move the watch's setup here,
   * only after "Start fresh instead".
   */
  private opensReady(record: WatchConfigRecord | undefined): boolean {
    const id = this.ownerId;
    if (id === undefined || record === undefined || record.revision > 0) return false;
    return noRecordStart(this.shownOwner) === "start" || settingsStartedFresh(id);
  }

  /** The behavior settings open ready on the defaults (`opensReady`). */
  private get behaviorIsNew(): boolean {
    return this.loadError === undefined && this.opensReady(this.record);
  }

  /** The notification style opens ready on its defaults (`opensReady`). */
  private get styleIsNew(): boolean {
    return !this.styleUnsupported && this.styleError === undefined && this.opensReady(this.styleRecord);
  }

  /** The behavior document the form edits: the record's, or on a new watch
   * the defaults (`behaviorIsNew`). Undefined while there is none to edit. */
  private get behaviorDocument(): BehaviorDocument | undefined {
    const record = this.record;
    if (record !== undefined && record.revision > 0) return record.document;
    return this.behaviorIsNew ? this.readyBehavior : undefined;
  }

  /** The notification style document shown, when there is one to edit: the
   * record's, or on a new watch the defaults (`styleIsNew`). */
  private get styleDocument(): Record<string, unknown> | undefined {
    const record = this.styleRecord;
    if (record !== undefined && record.revision > 0) return readStyleDocument(record.document);
    return this.styleIsNew ? this.readyStyle : undefined;
  }

  private get behaviorChanges(): number {
    return dirtyKeys(this.behaviorDocument, this.edits).length;
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
    const behavior = this.behaviorDocument !== undefined && this.behaviorChanges > 0;
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

  /** The behavior's save over the revision shown. On a new watch that is
   * revision 0, so the first Save creates the record from the defaults with
   * the edits on top. */
  private async saveBehavior(hass: HassLike, ownerId: string): Promise<Note | undefined> {
    const record = this.record;
    const base = this.behaviorDocument;
    if (record === undefined || base === undefined) return undefined;
    const first = record.revision <= 0;
    const edits = this.edits;
    const document = buildSaveDocument(base, edits);
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
        await this.reread("behavior", ownerId);
        // Lay the edits over the newer copy, the way a watch switch does
        // (`restoreSettingsDraft`): they are key writes, and only those the
        // newer copy does not already hold still count. A copy that could
        // not be read keeps the old behavior and drops them.
        const fresh = this.record;
        if (ownerId === this.ownerId && this.loadError === undefined && fresh?.document !== undefined && fresh.revision > 0) {
          const still = dirtyKeys(fresh.document, edits);
          this.edits = new Map(still.map((key) => [key, edits.get(key)!]));
          return still.length === 0
            ? { kind: "note", text: "These settings changed somewhere else, and the newer copy already has your changes." }
            : { kind: "warn", text: "Not saved yet. These settings changed somewhere else, so the newer copy is shown with your changes on top. Check them and Save again." };
        }
        const stored = conflictRevision(err);
        return {
          kind: "warn",
          text: `Your changes were not saved. These settings changed somewhere else${stored === undefined ? "" : ` (now revision ${stored})`}, so the newest copy is shown. Make your changes again on top of it.`,
        };
      }
      // A first save refused: the watch is not paired. The edits stay for
      // the Save after pairing.
      if (code === "no_record" && first) return { kind: "warn", text: SETTINGS_PAIR_FIRST_TEXT };
      if (code === "no_record") {
        await this.reread("behavior", ownerId);
        return { kind: "warn", text: "Your changes were not saved. Home Assistant no longer holds settings for this watch." };
      }
      return { kind: "err", text: `Could not save: ${errText(err)}` };
    }
  }

  /** The notification style's save: a conflict reads the newer copy and
   * lays these edits over it key by key, then sends again. On a new watch it
   * is over revision 0, from the defaults, and creates the record. */
  private async saveStyle(hass: HassLike, ownerId: string): Promise<Note | undefined> {
    const record = this.styleRecord;
    const document = this.styleDocument;
    if (record === undefined || document === undefined) return undefined;
    const first = record.revision <= 0;
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
    // A first save refused: the watch is not paired. The edits stay.
    if (result.code === "no_record" && first && result.fresh === undefined) return { kind: "warn", text: SETTINGS_PAIR_FIRST_TEXT };
    if (result.code === "no_record") {
      if (result.fresh === undefined) await this.reread("style", ownerId);
      else this.styleEdits = new Map();
      return { kind: "warn", text: "The notification style was not saved. Home Assistant no longer holds one for this watch." };
    }
    return { kind: "err", text: `Could not save the notification style: ${friendlyError(result)}` };
  }

  /** "Start fresh instead", while the page waits for the iPhone's move:
   * after a yes, the records Home Assistant does not hold open ready on the
   * defaults. Nothing is saved until Save. */
  private askStartFresh(): void {
    const id = this.ownerId;
    if (id === undefined || !mayStart(noRecordStart(this.shownOwner))) return;
    startSettingsFresh(id);
    this.note = undefined;
    this.changed();
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

  /** Back to the copies Home Assistant holds, or on a new watch to the
   * defaults it opened on. */
  private discard(): void {
    this.edits = new Map();
    this.styleEdits = new Map();
    this.confirm = undefined;
    this.changed();
  }

  /** A watch just paired on the card joins the device list and becomes the
   * one shown, and the panel's shared watch, whether or not another watch
   * was open. Edits on the watch shown before are kept for it, so nothing
   * needs asking. Nothing moves once the page has been left. An iPhone
   * joins the device list and nothing moves. */
  private async showPaired(watchId: string | undefined, stale: () => boolean, kind: PairDeviceKind): Promise<void> {
    if (!this.refreshOwners) return;
    let owners: readonly OwnerSummary[];
    try {
      owners = await this.refreshOwners();
    } catch {
      return;
    }
    if (stale() || watchId === undefined || kind !== "watch") return;
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
    this.edits = withEdit(this.edits, this.behaviorDocument, setting, value);
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

  /** A group picked in the side panel: it shows, and a search ends. */
  private pickGroup(id: string): void {
    this.group = id;
    this.query = "";
    this.host.requestUpdate();
  }

  private search(query: string): void {
    this.query = query;
    this.host.requestUpdate();
  }

  // ── drawing ────────────────────────────────────────────────────────────

  /**
   * The page: a bar that stays at the top while the page scrolls under it
   * (the title and which watch and revision at the left, where the settings
   * have got to and Save at the right). Under it, the side panel lists the
   * groups (`watch-settings-nav.ts`) under a search box, and beside it the
   * picked group's cards show, or every group's matching settings while the
   * search holds words. A narrow page puts the panel over the cards. A home
   * with no watch yet, and a watch whose settings live in another home, get
   * one column instead: the note, then pairing and the client certificate.
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
        ${!one && this.isNew ? html`<div class="ws-new" role="note">${uiIcon("info")}<span>${NEW_WATCH_TEXT}</span></div>` : nothing}
        ${this.note ? html`<div class="banner ${this.note.kind} ws-note" role="alert"><span>${this.note.text}</span>
          <button class="link" @click=${() => { this.note = undefined; this.changed(); }}>Dismiss</button></div>` : nothing}
      </div>
      ${one
        ? html`<div class="ws-cols one"><div class="ws-body ws-col">
            ${elsewhere ? html`<div class="xf-lead ws-main-house">${uiIcon("info")}<span>${SETTINGS_MAIN_HOUSE_TEXT}</span></div>` : this.behaviorStandIn() ?? nothing}
            ${this.pairCard.render()}${this.cert.render(hass)}
          </div></div>`
        : this.renderSplit(hass)}
    </div>`;
  }

  /** The side panel and the cards beside it. A group whose cards are all
   * missing (the notification style on an integration that does not keep
   * it) is left out of the panel. A search leaves the panel as it is. */
  private renderSplit(hass: HassLike) {
    const terms = searchTerms(this.query);
    const cards = this.loading ? undefined : this.cardsById(hass, terms);
    const groups = this.loading ? SETTINGS_GROUPS : SETTINGS_GROUPS.filter((g) => g.cards.some((c) => this.hasCard(c)));
    const group = groups.find((g) => g.id === this.group) ?? groups[0] ?? settingsGroup(undefined);
    const searching = terms.length > 0;
    return html`<div class="ws-split">
      ${this.renderNav(group, groups, searching)}
      <div class="ws-body ws-col ws-main" role="region" aria-label=${searching ? "Settings found" : `${group.title} settings`}>
        ${cards === undefined
          ? html`<div class="empty">Loading…</div>`
          : searching
          ? this.renderFound(cards)
          : html`<p class="ws-blurb">${group.blurb}</p>${group.cards.map((c) => cards.get(c) ?? nothing)}`}
      </div>
    </div>`;
  }

  /** The side panel: the search box, then a button per group, each with its
   * count of unsaved changes. */
  private renderNav(current: SettingsGroup, groups: readonly SettingsGroup[], searching: boolean) {
    const changes = this.changesByGroup();
    return html`<nav class="ws-nav" aria-label="Settings groups">
      <label class="ws-search">${uiIcon("search")}
        <input type="search" placeholder="Find a setting" aria-label="Find a setting" .value=${live(this.query)}
          @input=${(e: Event) => this.search((e.target as HTMLInputElement).value)}
          @keydown=${(e: KeyboardEvent) => { if (e.key === "Escape" && this.query !== "") { e.preventDefault(); this.search(""); } }}>
      </label>
      <div class="ws-nav-list">
        ${groups.map((g) => {
          const on = !searching && g.id === current.id;
          const n = changes.get(g.id) ?? 0;
          return html`<button type="button" class="ws-nav-item ${on ? "on" : ""}" data-group=${g.id} aria-current=${on ? "page" : "false"}
            style=${`--ws-hue:${g.color}`} @click=${() => this.pickGroup(g.id)}>
            <span class="ws-nav-ic">${uiIcon(g.icon)}</span><span class="ws-nav-t">${g.title}</span>
            ${n > 0 ? html`<span class="ws-nav-n" title=${`${n} unsaved ${n === 1 ? "change" : "changes"}`}>${n}</span>` : nothing}
          </button>`;
        })}
      </div>
    </nav>`;
  }

  /** A search's cards, under the name of the group each is in. The name
   * opens that group. */
  private renderFound(cards: ReadonlyMap<SettingsCardId, unknown>) {
    if (cards.size === 0) {
      return html`<div class="xf-lead ws-none">${uiIcon("search")}<span>No setting matches “${this.query.trim()}”. Try a shorter word, like “camera”, “sound” or “swipe”.</span></div>`;
    }
    return SETTINGS_GROUPS.map((g) => {
      const found = g.cards.filter((c) => cards.has(c));
      if (found.length === 0) return nothing;
      return html`<button type="button" class="ws-found" title=${`Show all of ${g.title}`} @click=${() => this.pickGroup(g.id)}>${g.title}</button>
        ${found.map((c) => cards.get(c))}`;
    });
  }

  /** Whether the page has this card to show without a search, its record's
   * note counting as one: the side panel lists a group only when it does. */
  private hasCard(card: SettingsCardId): boolean {
    if (card === "pair" || card === "cert") return true;
    if (NOTIFICATION_STYLE_SECTIONS.some((s) => s.id === card)) return !this.styleUnsupported && this.styleStandIn() !== null;
    return this.behaviorStandIn() !== null;
  }

  /** Unsaved changes per group, for the side panel. */
  private changesByGroup(): Map<string, number> {
    const counts = new Map<string, number>();
    const add = (card: SettingsCardId, n: number) => {
      const g = groupOfCard(card);
      if (g !== undefined && n > 0) counts.set(g.id, (counts.get(g.id) ?? 0) + n);
    };
    const dirty = new Set(dirtyKeys(this.behaviorDocument, this.edits));
    for (const s of WATCH_SETTINGS_CATALOG.sections) add(s.id as SettingsCardId, s.settings.filter((x) => dirty.has(x.key)).length);
    const styleDirty = new Set(styleDirtyKeys(this.styleDocument, this.styleEdits));
    for (const s of NOTIFICATION_STYLE_SECTIONS) add(s.id, s.groups.reduce((n, g) => n + g.rows.filter((r) => styleDirty.has(r.key)).length, 0));
    return counts;
  }

  /**
   * The page's cards by id. Without a search: every card there is. A record
   * not there yet, or one that cannot be read, has its one note instead,
   * drawn once in each group it would fill. With a search: only the cards
   * holding a match, each cut down to the matching settings, and no notes.
   */
  private cardsById(hass: HassLike, terms: readonly string[]): Map<SettingsCardId, unknown> {
    const cards = new Map<SettingsCardId, unknown>();
    const searching = terms.length > 0;
    const standIn = (ids: ReadonlySet<string>, card: TemplateResult) => {
      for (const g of SETTINGS_GROUPS) {
        const first = g.cards.find((c) => ids.has(c));
        if (first !== undefined) cards.set(first, card);
      }
    };
    const behavior = this.behaviorStandIn();
    if (behavior === undefined) {
      const values = formValues(this.behaviorDocument, this.edits);
      for (const section of WATCH_SETTINGS_CATALOG.sections) {
        const card = this.renderSection(hass, section, values, terms);
        if (card !== undefined) cards.set(section.id as SettingsCardId, card);
      }
    } else if (behavior !== null && !searching) {
      standIn(new Set(WATCH_SETTINGS_CATALOG.sections.map((s) => s.id)), behavior);
    }
    const style = this.styleUnsupported ? null : this.styleStandIn();
    const styleDocument = this.styleDocument;
    if (style === undefined && styleDocument !== undefined) {
      const values = styleFormValues(styleDocument, this.styleEdits);
      for (const section of NOTIFICATION_STYLE_SECTIONS) {
        const card = this.renderStyleSection(section, values, terms);
        if (card !== undefined) cards.set(section.id, card);
      }
    } else if (style !== undefined && style !== null && !searching) {
      standIn(new Set(NOTIFICATION_STYLE_SECTIONS.map((s) => s.id)), style);
    }
    const pairing = groupOfCard("pair")?.title;
    if (matchesSearch(terms, ["Pair a device, watch, iPhone, QR code, pairing code, add", pairing])) cards.set("pair", this.pairCard.render());
    if (matchesSearch(terms, ["Client certificate, mTLS, proxy, passphrase", pairing])) cards.set("cert", this.cert.render(hass));
    return cards;
  }

  /** Beside the title: which watch, and who last saved its settings and
   * when. The revision numbers are jargon to a new user, so they are only in
   * the tooltip (`headTitle`). */
  private headLine(name: string): string {
    if (this.ownerId === undefined) return "No watch paired yet";
    const r = this.record;
    if (r === undefined || r.revision <= 0) return name;
    const at = r.updated_at ? Date.parse(r.updated_at) : NaN;
    const when = Number.isNaN(at) ? "" : agoWords(Math.max(0, (Date.now() - at) / 1000));
    return `${name} · ${savedLine(r.updated_by, when)}`;
  }

  /** The head line's tooltip: the revisions it leaves out. */
  private headTitle(): string | undefined {
    const parts: string[] = [];
    const r = this.record;
    const s = this.styleRecord;
    if (r !== undefined && r.revision > 0) parts.push(`Settings revision ${r.revision}`);
    if (s !== undefined && s.revision > 0) parts.push(`notification style revision ${s.revision}`);
    return parts.length === 0 ? undefined : `${parts.join(", ")}.`.replace(/^./, (c) => c.toUpperCase());
  }

  /** What stands in for the behavior settings' cards: a note, `null` while
   * there is nothing to draw yet, or undefined when the record's own cards
   * draw. */
  private behaviorStandIn(): TemplateResult | null | undefined {
    if (this.loadError !== undefined) {
      const id = this.ownerId;
      return html`<div class="xf-lead warn">${uiIcon("info")}<span>Could not read this watch's settings: ${this.loadError}</span></div>
        ${id === undefined ? nothing : html`<button class="small ws-retry" @click=${() => void this.reread("behavior", id)}>Try again</button>`}`;
    }
    if (this.ownerId === undefined) {
      return html`<div class="xf-lead">${uiIcon("info")}<span><b>No watch has connected to this Home Assistant yet.</b> Pair one below.</span></div>`;
    }
    const record = this.record;
    if (record === undefined) return null;
    // A record that is there but unreadable is not "no settings yet": a
    // start would only meet a conflict.
    if (watchRecordUnreadable(record, (document) => document)) {
      return html`<div class="xf-lead warn">${uiIcon("info")}<span>${SETTINGS_UNREADABLE_TEXT}</span></div>`;
    }
    // No record and nothing to wait for: the cards open on the defaults.
    if (this.behaviorDocument !== undefined) return undefined;
    // While the iPhone's move may still come it waits, and a small link that
    // asks first opens the cards anyway.
    return html`<div class="xf-lead">${uiIcon("info")}<span><b>No settings from this watch yet.</b> ${WAIT_FOR_IPHONE_TEXT}</span></div>
      <button class="link start-fresh ws-start" ?disabled=${this.saving}
        title="Open the settings on the app's defaults. Nothing is saved until you press Save."
        @click=${() => this.askStartFresh()}>${START_FRESH_BUTTON}</button>`;
  }

  /** One catalog section as an inspector card that is always open: the
   * inspector's mark, title and "?" for its help. With search `terms`, only
   * the runs holding a match, and nothing at all when none does. */
  private renderSection(hass: HassLike, section: CatalogSection, values: ReadonlyMap<string, SettingValue>, terms: readonly string[] = []) {
    const look = SECTION_LOOK[section.id];
    const help = !this.helpOff.has(section.id);
    const helpLabel = help ? `Hide the help in ${section.title}` : `Show help for ${section.title}`;
    const group = groupOfCard(section.id as SettingsCardId)?.title;
    const runs = sectionRuns(section, values)
      .filter((run) => [run.setting, ...run.dependents].some((s) => matchesSearch(terms, settingWords(s, section.title, group))));
    if (runs.length === 0 && terms.length > 0) return undefined;
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
    // A hand movement the words cannot show plays beside the menu.
    const demo = WATCH_SETTING_LOOK[setting.key]?.demo;
    const row = (field: TemplateResult) => html`<div class="ws-row ${demo === undefined ? "" : "has-demo"}" data-key=${setting.key}>
      ${this.glyph("ws-ic", settingIcon(setting), 14)}${field}${demo === undefined ? nothing : html`<span class="ws-demo-box">${demoPicture(demo)}</span>`}${helpLine}</div>`;
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
      ${tile.demo !== undefined
        ? html`<span class="ws-tile-glyph demo" aria-hidden="true">${demoPicture(tile.demo, tile.value)}</span>`
        : tile.preview === undefined
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
      const demo = WATCH_SETTING_LOOK[setting.key]?.demo;
      return html`<div class="ws-row ${demo === undefined ? "" : "has-demo"}" data-key=${`${setting.key}:${g.value}`}>
          ${this.glyph("ws-ic", gestureIcon(setting, g.value), 14)}${selectField(g.label, action, options, (v) => set(withMotionAction(value, g.value, v)), { def: "Disabled" })}
          ${demo === undefined ? nothing : html`<span class="ws-demo-box">${demoPicture(demo, g.value)}</span>`}
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

  /** What stands in for the Notifications, Sounds and Wrist Webhooks cards:
   * one card while there is no record yet or it cannot be read, `null`
   * while there is nothing to draw yet, or undefined when the record's own
   * cards draw. The caller leaves them all out on an integration that does
   * not keep the kind. */
  private styleStandIn(): TemplateResult | null | undefined {
    const id = this.ownerId;
    if (this.styleError !== undefined) {
      return this.renderStyleCard(html`<div class="xf-lead warn">${uiIcon("info")}<span>Could not read this watch's notification style: ${this.styleError}</span></div>
        ${id === undefined ? nothing : html`<button class="small ns-retry" @click=${() => void this.reread("style", id)}>Try again</button>`}`);
    }
    const record = this.styleRecord;
    if (record === undefined) return null;
    if (watchRecordUnreadable(record, readStyleDocument)) {
      return this.renderStyleCard(html`<div class="xf-lead warn">${uiIcon("info")}<span>${STYLE_UNREADABLE_TEXT}</span></div>`);
    }
    // No record and nothing to wait for: the cards open on the defaults.
    // Else the page waits for the iPhone's move, with the same small link.
    if (this.styleDocument === undefined) {
      return this.renderStyleCard(html`<div class="xf-lead">${uiIcon("info")}<span><b>${STYLE_NO_RECORD_TITLE}</b> ${WAIT_FOR_IPHONE_TEXT}</span></div>
        <button class="link start-fresh ns-start" ?disabled=${this.saving}
          title="Open the notification style on the app's defaults. Nothing is saved until you press Save."
          @click=${() => this.askStartFresh()}>${START_FRESH_BUTTON}</button>`);
    }
    return undefined;
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

  /** One notification style section as a card. With search `terms`, only
   * the runs holding a match, and nothing at all when none does. */
  private renderStyleSection(section: StyleSection, values: ReadonlyMap<string, StyleValue>, terms: readonly string[] = []) {
    const look = STYLE_LOOK[section.id];
    const helpKey = `ns-${section.id}`;
    const help = !this.helpOff.has(helpKey);
    const helpLabel = help ? `Hide the help in ${section.title}` : `Show help for ${section.title}`;
    const group = groupOfCard(section.id)?.title;
    const groups = section.groups.map((g) => ({
      label: g.label,
      runs: styleRuns(g, values)
        .filter((run) => [run.row, ...run.dependents].some((r) => matchesSearch(terms, styleRowWords(r, g.label, section.title, group)))),
    }));
    if (terms.length > 0 && groups.every((g) => g.runs.length === 0)) return undefined;
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
        ${groups.map(({ label, runs }) => {
          if (runs.length === 0) return nothing;
          return html`<div class="ws-group">${label}</div>
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

  /** Whether the page shows a new watch: a record of either kind opens
   * ready on its defaults. The line over the page says what that means. */
  private get isNew(): boolean {
    return this.ownerId !== undefined && !this.loading && (this.behaviorIsNew || this.styleIsNew);
  }

  /** Whether Save can run (`settingsCanSave`). */
  private get canSave(): boolean {
    return settingsCanSave({
      behaviorChanges: this.behaviorChanges,
      styleChanges: this.styleChanges,
      busy: this.saving,
      behaviorHeld: this.behaviorDocument !== undefined,
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
    const head = html`<span class="ws-title">Watch settings</span><span class="ws-head-line" title=${this.headTitle() ?? nothing}>${this.headLine(name)}</span>
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
    // Both records save under the one button. A record Home Assistant does
    // not hold yet is created by its first Save, from the defaults the page
    // opened on; until a change, Save is greyed out and says why beside it.
    const canSave = this.canSave;
    return html`<div class="wa-bar ws-bar ${stacked ? "stacked" : ""}" role="toolbar" aria-label="Watch settings">${head}
      ${changes > 0
        ? html`<span class="xf-sub ws-changes">${changes} unsaved ${changes === 1 ? "change" : "changes"}</span>`
        : elsewhere ? nothing
        : this.isNew ? html`<span class="xf-sub ws-why" title=${NOTHING_TO_SAVE_TEXT}>${NOTHING_TO_SAVE_TEXT}</span>`
        : this.renderDelivery()}
      ${changes > 0 ? html`<button class="tb-btn ws-discard" ?disabled=${this.saving}
        title="Go back to the copies Home Assistant holds" @click=${() => this.askDiscard()}>Discard</button>` : nothing}
      ${this.ownerId === undefined ? nothing : html`<button class="primary save ${changes > 0 ? "dirty" : ""}" ?disabled=${!canSave}
        title=${changes > 0 ? `Save (${SAVE_KEY}). Then open Wrist Assistant on the watch to get these settings.` : `Nothing to save (${SAVE_KEY})`}
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
      const title = held.map((h) => `The watch has ${h.what} revision ${h.revision}.`).join(" ");
      return html`<span class="tb-sync ok" title=${title}>
        <i class="tb-dot" aria-hidden="true"></i><span class="tb-sync-l">${COLLECTED_PILL_TEXT}</span>
      </span>`;
    }
    const title = `${waiting.map((h) => `${h.what} saved as revision ${h.revision}.`).join(" ")} ${WAITING_HELP_TEXT}`;
    return html`<span class="tb-sync warn sending" title=${title}>
      <i class="tb-dot" aria-hidden="true"></i><span class="tb-sync-l">${WAITING_TEXT}</span>
    </span>`;
  }
}

function errText(err: unknown): string {
  return friendlyError(err);
}

/** The two saves' notes as one: their words side by side, at the graver of
 * their two kinds, the same words once (both first saves of a watch that is
 * not paired say the same line). None when neither had anything to say. */
function joinNotes(notes: readonly (Note | undefined)[]): Note | undefined {
  const said = notes.filter((n): n is Note => n !== undefined);
  if (said.length <= 1) return said[0];
  const rank = { note: 0, warn: 1, err: 2 } as const;
  const kind = said.reduce<Note["kind"]>((k, n) => (rank[n.kind] > rank[k] ? n.kind : k), "note");
  return { kind, text: [...new Set(said.map((n) => n.text))].join(" ") };
}

/** The words a search looks through for one setting: its title, help and
 * choices, and the names of its card and group. */
function settingWords(setting: CatalogSetting, card: string, group: string | undefined): (string | undefined)[] {
  return [
    setting.label, setting.help, card, group,
    ...(setting.options ?? []).map((o) => o.label),
    ...(setting.gestures ?? []).map((g) => g.label),
  ];
}

/** The same for a notification style row, with the heading it sits under. */
function styleRowWords(row: StyleRow, heading: string, card: string, group: string | undefined): (string | undefined)[] {
  return [row.label, row.help, heading, card, group, ...(row.options ?? []).map((o) => o.label)];
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
  .ws-top > .ws-note { display: flex; align-items: center; gap: 10px; box-sizing: border-box; width: min(1088px, calc(100% - 32px)); margin: 10px auto 0; }
  .ws-top > .ws-note > span { flex: 1; min-width: 0; }
  /* The new watch's line: the panel's plain notice (its card fill and a
     hairline), with the info mark in the accent. */
  .ws-top > .ws-new {
    display: flex; align-items: center; gap: 10px; box-sizing: border-box; width: min(1088px, calc(100% - 32px)); margin: 10px auto 0;
    padding: 10px 14px; border: 1px solid var(--wa-line); border-radius: 8px; background: var(--wa-panel); font-size: 13px;
  }
  .ws-top > .ws-new > svg.ui-icon { width: 16px; height: 16px; flex: none; color: var(--wa-accent); }
  .ws-top > .ws-new > span { flex: 1; min-width: 0; }
  .ws-bar .ws-why { flex: 0 1 auto; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  /* One column, as wide as the dialog the page replaced: a home with no
     watch yet, or a watch whose settings live in another home. */
  .ws-cols { box-sizing: border-box; width: min(720px, 100%); margin: 0 auto; padding: 16px 16px 48px; display: grid; gap: 8px; }
  /* The side panel at the page's left edge and the group's cards filling the
     room to its right, edge to edge, as the page editor lays out its
     columns. On a narrow page the panel goes over the cards and its groups
     wrap as chips. */
  .ws-split {
    box-sizing: border-box; width: 100%; margin: 0; padding: 16px 16px 48px;
    display: flex; flex-wrap: wrap; align-items: flex-start; gap: 16px 24px;
  }
  @media (max-width: 640px) {
    .ws-cols, .ws-split { padding: 12px 12px 32px; }
  }
  /* The panel stays in view while a long group scrolls, just under the bar. */
  .ws-nav { flex: 0 0 248px; min-width: 0; display: flex; flex-direction: column; gap: 10px; position: sticky; top: 64px; }
  .ws-search {
    display: flex; align-items: center; gap: 8px; height: 38px; padding: 0 10px; box-sizing: border-box;
    border: 1px solid var(--wa-line-strong); border-radius: 8px; background: var(--wa-field); color: var(--wa-muted);
  }
  .ws-search:focus-within { border-color: color-mix(in srgb, var(--wa-ink) 45%, var(--wa-line-strong)); }
  .ws-search svg { width: 15px; height: 15px; flex: none; }
  .ws-search input { flex: 1; min-width: 0; padding: 0; border: 0; outline: 0; background: transparent; color: var(--wa-ink); font: inherit; font-size: 14px; }
  .ws-nav-list { display: flex; flex-direction: column; gap: 2px; }
  button.ws-nav-item {
    font: inherit; display: flex; align-items: center; gap: 10px; min-height: 40px; margin: 0; padding: 0 10px;
    border: 0; border-radius: 8px; background: transparent; color: var(--wa-label); text-align: left; cursor: pointer;
  }
  button.ws-nav-item:hover { background: color-mix(in srgb, var(--wa-ink) 6%, transparent); color: var(--wa-ink); }
  button.ws-nav-item.on {
    background: color-mix(in srgb, var(--ws-hue) 16%, var(--wa-seg-on)); color: var(--wa-ink);
    box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--ws-hue) 40%, transparent);
  }
  button.ws-nav-item:focus-visible { outline: none; box-shadow: inset 0 0 0 2px color-mix(in srgb, var(--wa-ink) 60%, transparent); }
  .ws-nav-ic {
    width: 26px; height: 26px; flex: none; display: grid; place-items: center; border-radius: 7px;
    color: var(--ws-hue); background: color-mix(in srgb, var(--ws-hue) 15%, transparent);
  }
  .ws-nav-ic svg { width: 16px; height: 16px; }
  .ws-nav-t { flex: 1; min-width: 0; font-size: 14px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  button.ws-nav-item.on .ws-nav-t { font-weight: 600; }
  .ws-nav-n {
    flex: none; min-width: 18px; height: 18px; padding: 0 5px; box-sizing: border-box; border-radius: 9px; display: grid; place-items: center;
    font-size: 11px; font-weight: 600; color: var(--wa-ink); background: color-mix(in srgb, var(--wa-hue-orange) 30%, transparent);
  }
  @container wspage (max-width: 840px) {
    .ws-nav { position: static; flex-basis: 100%; }
    .ws-nav-list { flex-direction: row; flex-wrap: wrap; gap: 4px; }
    button.ws-nav-item { min-height: 34px; box-shadow: inset 0 0 0 1px var(--wa-line); }
  }
  .ws-main { flex: 999 1 520px; }
  .ws-main > .ws-blurb { margin: 0 2px 2px; font-size: 14px; line-height: 1.4; color: var(--wa-muted); }
  .ws-main > button.ws-found {
    align-self: flex-start; font: inherit; margin: 10px 2px 0; padding: 0; border: 0; background: none; cursor: pointer;
    font-size: 11px; font-weight: 600; letter-spacing: .04em; text-transform: uppercase; color: var(--wa-muted);
  }
  .ws-main > button.ws-found:first-child { margin-top: 0; }
  .ws-main > button.ws-found:hover { color: var(--wa-ink); }
  .ws-col { display: flex; flex-direction: column; min-width: 0; container: xfer / inline-size; }
  .ws-col > * { flex: none; }
  .ws-col > .empty { padding: 12px 2px; color: var(--wa-muted); }
  /* The cards sit closer than the panel's usual blocks, and the title column
     is wider than the inspector's: these titles are whole phrases with an
     icon in front. The help column is set again beside it, because the
     panel's is worked out from the panel's own title width. */
  .ws-body { --wa-lab: 172px; --wa-col: 180px; gap: 10px; }
  .ws-body > .sec { margin: 0; }
  @container xfer (max-width: 440px) {
    .ws-body .sec { --wa-lab: 122px; --wa-col: 130px; }
  }
  /* Each setting's icon: a small chip in its card's hue, the one place a
     setting carries color. A fixed box, so a row does not move when the
     symbol file arrives. The symbol provider paints white; the chip's color
     wins here. */
  .ws-body .ws-ic {
    width: 26px; height: 26px; flex: none; display: grid; place-items: center; border-radius: 7px; pointer-events: none;
    color: var(--ws-hue, var(--wa-muted)); background: color-mix(in srgb, var(--ws-hue, var(--wa-muted)) 15%, transparent);
  }
  .ws-body :is(.ws-ic, .ws-tile-glyph) svg { display: block; overflow: visible; }
  .ws-body .ws-ic svg { width: 15px; height: 15px; }
  .ws-body :is(.ws-ic, .ws-tile-glyph) svg:not(.ws-pv, .ws-demo) path { fill: currentColor; fill-opacity: 1; }
  /* Settings are a list: a hairline between each, none over the first. */
  .ws-body :is(.sec-b, .fgroup) > :is(.ws-row, .ws-tile-row) { padding: 10px 0; border-top: 1px solid var(--wa-line); }
  .ws-body :is(.sec-b, .fgroup) > :is(.ws-row, .ws-tile-row):first-child { border-top: 0; padding-top: 3px; }
  .ws-body .sec-b > :is(.ws-row, .ws-tile-row):last-child { padding-bottom: 2px; }
  .ws-body .fgroup { margin: 0 -8px 8px; padding: 2px 8px; }
  .ws-body .fgroup > :last-child { padding-bottom: 5px; }
  /* Help reads as a quiet second line, upright. */
  .ws-body .sec[data-help] > .sec-b :is(.ws-row, .ws-head) > .hint { padding: 0; margin: 0; font-style: normal !important; font-size: 12.5px; line-height: 1.4; color: var(--wa-muted); }
  /* A row drawn by the panel's own field: the chip, then the title with its
     help under it, and the control at the right edge. */
  .ws-row { display: grid; grid-template-columns: 26px minmax(0, 1fr) auto; column-gap: 10px; align-items: center; }
  .ws-row > .ws-ic { grid-column: 1; grid-row: 1 / span 2; align-self: start; }
  .ws-row > .field { display: contents; }
  .ws-row > .field > :first-child { grid-column: 2; grid-row: 1; color: var(--wa-ink); font-size: 13.5px; font-weight: 500; }
  .ws-row > .field > :not(:first-child) { grid-column: 3; grid-row: 1 / span 2; justify-self: end; }
  .ws-row > .field:not(.check) > :not(:first-child) { width: 270px; max-width: 44cqw; box-sizing: border-box; }
  .ws-row > .hint { grid-column: 2; grid-row: 2; }
  .ws-row > :not(.ws-ic, .hint, .field) { grid-column: 2 / -1; min-width: 0; }
  /* A row with a moving picture of its hand movement: the picture sits
     between the title and the menu. */
  .ws-row.has-demo { grid-template-columns: 26px minmax(0, 1fr) 60px auto; }
  .ws-row.has-demo > .field > :not(:first-child) { grid-column: 4; }
  .ws-row.has-demo > .ws-demo-box { grid-column: 3; grid-row: 1 / span 2; align-self: center; width: 60px; height: 60px; color: var(--ws-hue, var(--wa-muted)); }
  .ws-demo-box svg.ws-demo { display: block; width: 60px; height: 60px; }
  /* A row of tiles: the chip, title and help on one line, the strip of
     choices under them, starting where the title starts. */
  .ws-head { position: relative; display: flex; align-items: center; gap: 10px; min-height: 26px; }
  .ws-head > span:not(.ws-ic) { flex: none; max-width: 100%; min-width: 0; color: var(--wa-ink); font-size: 13.5px; font-weight: 500; line-height: 1.25; overflow-wrap: break-word; }
  .ws-head button.reset-dot { top: 50%; margin-top: -2.5px; }
  /* The help never gets cut short: with too little room beside the title it
     goes onto its own line under it. */
  .ws-head { flex-wrap: wrap; row-gap: 2px; }
  .ws-body .sec[data-help] > .sec-b .ws-head > .hint { flex: 1 1 220px; min-width: 0; }
  /* The choices are one strip: a single outline with hairlines between the
     choices, the picked one a raised grey with the brighter line. Neutral, no
     hue. Five at most to a line, three on a narrow column. */
  .ws-tiles {
    display: grid; grid-template-columns: repeat(var(--cols, 3), minmax(0, 1fr)); gap: 1px; margin: 8px 0 0 36px;
    border: 1px solid var(--wa-line-strong); border-radius: 8px; overflow: hidden; background: var(--wa-line-strong);
  }
  @container xfer (max-width: 440px) {
    .ws-tiles { grid-template-columns: repeat(var(--cols-narrow, 3), minmax(0, 1fr)); margin-left: 0; }
    .ws-row > .field:not(.check) > :not(:first-child) { width: 160px; }
    /* A smaller picture here, so the title keeps some room. */
    .ws-row.has-demo { grid-template-columns: 26px minmax(0, 1fr) 44px auto; }
    .ws-row.has-demo > .ws-demo-box, .ws-row.has-demo > .ws-demo-box svg.ws-demo { width: 44px; height: 44px; }
    /* The picture and the menu leave the title little room: the help goes
       under all three, at the row's full width. */
    .ws-row.has-demo > .hint { grid-column: 2 / -1; grid-row: 3; margin-top: 2px; }
  }
  button.ws-tile {
    --ws-tile-bg: var(--wa-field);
    font: inherit; min-width: 0; min-height: 40px; margin: 0; padding: 6px 8px; cursor: pointer;
    display: grid; grid-template-columns: auto minmax(0, auto); align-items: center; justify-content: center; column-gap: 8px; row-gap: 0;
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
  .ws-tile-glyph { grid-row: 1 / span 2; height: 24px; min-width: 18px; display: grid; place-items: center; color: var(--wa-muted); }
  .ws-tile-name:last-child { grid-row: 1 / span 2; }
  .ws-tile-glyph svg { height: 17px; width: auto; max-width: 100%; }
  .ws-tile-glyph svg.ws-pv { width: 38px; height: 22px; }
  .ws-tile-glyph.demo { width: 56px; height: 56px; }
  .ws-tile-glyph svg.ws-demo { width: 56px; height: 56px; }
  button.ws-tile.on .ws-tile-glyph { color: color-mix(in srgb, var(--ws-hue, var(--wa-ink)) 55%, var(--wa-ink)); }
  /* A name is never cut short: it wraps between words instead. */
  .ws-tile-name { max-width: 100%; font-size: 12.5px; font-weight: 500; line-height: 1.2; text-align: left; overflow-wrap: normal; text-wrap: balance; }
  button.ws-tile.on .ws-tile-name { font-weight: 600; }
  .ws-tile-detail {
    max-width: 100%; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 11px; line-height: 1.2;
    grid-column: 2; color: var(--wa-muted); text-align: left; overflow-wrap: normal; text-wrap: balance;
  }
  button.ws-tile.on .ws-tile-detail { color: var(--wa-label); }
  /* A tile with a moving picture puts it over the name, so the name and its
     detail keep the tile's whole width. */
  button.ws-tile:has(> .ws-tile-glyph.demo) { grid-template-columns: minmax(0, 1fr); justify-items: center; align-content: start; row-gap: 3px; padding: 10px 6px 9px; }
  button.ws-tile:has(> .ws-tile-glyph.demo) > * { grid-column: 1; grid-row: auto; text-align: center; }
  button.ws-tile:has(> .ws-tile-glyph.demo) > .ws-tile-glyph { margin-bottom: 3px; }
  @container xfer (max-width: 440px) {
    .ws-tile-glyph.demo, .ws-tile-glyph svg.ws-demo { width: 48px; height: 48px; }
  }
  .ws-body > button.ws-retry, .ws-body > button.ws-start { align-self: flex-start; }
  /* The indicator has no opacity, so the color row drops the percent box. */
  .ws-body .color-box .alpha { display: none; }
  /* The notification style's cards: the phone's groups as small headings
     between the rows, the volume presets under the slider. */
  .ws-body .sec-b > .ws-group {
    margin: 10px 0 1px; font-size: 11px; font-weight: 600; letter-spacing: .04em; text-transform: uppercase; color: var(--wa-muted);
  }
  .ws-body .sec-b > .ws-group:first-child, .ws-body .sec-b > .ns-pv + .ws-group { margin-top: 2px; }
  .ws-body .sec-b > .ws-group + :is(.ws-row, .ws-tile-row) { border-top: 0; padding-top: 3px; }
  .ws-row > .ns-presets { margin: 6px 0 0; }
  .ws-body > .sec .ns-start, .ws-body > .sec .ns-retry { align-self: flex-start; }
  ${notificationPreviewStyles}
  ${clientCertStyles}
  ${pairCardStyles}
`;
