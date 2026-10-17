// `<wa-voice-editor>`: the watch's voice settings as Home Assistant keeps them
// (the `voice` watch config kind), and an editor for them: the defaults an
// Assist or Speak slot falls back to, the phrase library, and the watch's own
// speech settings (Speak even in Silent Mode, the watch voice).
//
// It wears the complication editor's chrome (`editor-chrome.ts`) the way the
// menu editor does: the top bar, then three columns with drag gutters (the
// Voice and Phrases cards, the canvas with Pick from List on the watch, and
// the inspector), and the foot bar. The views are `voice-view.ts`.
//
// The host pattern of the menu editor (`watch-menus/menu-editor.ts`): watch
// chips from the owners list, the record read with `watch_config/get` and
// kept as raw JSON in a draft (`draft.ts`) with undo and redo, a save through
// `watch_config/save` that merges when another save landed too, the earlier
// saves with restore, the delivery check, and the size budget. The watch's
// installed voices are read beside it (`watch_voices/get`) for the Watch
// voice picker.
//
// A watch with no voice record yet opens ready on the app's defaults,
// unsaved, under the new watch line (`watch-menus/new-watch.ts`); its first
// Save is a save over revision 0, which Home Assistant takes for a paired
// watch. While its iPhone may still move the voice settings here it waits,
// and "Start fresh instead" opens the same ready screen.
//
// The phrases and their defaults can be on several watches (`links.ts`): a
// Devices menu on the Phrases card, also reached from the ··· menu, ticks
// another watch to link it and unticks one to unlink it, and the card's
// badge names the others. Start fresh on linked phrases asks whether it is
// for this watch only or for all of them.
//
// The panel loads this module on its own, with one `import()`, when its route
// is `/voice` (`hook.ts`). Nothing it imports may import `icons.ts`.
//
// Plan: app repo docs/pages_in_home_assistant_step4.md ("4d batch 2 build
// contract", items 3, 4 and 26).

import { LitElement, css, html, nothing, type PropertyValues, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { type ColumnWidths, beginColumnDrag, fitColumnWidths, loadColumnWidths, saveColumnWidths } from "../column-split.js";
import {
  canvasStyles,
  chromeTokens,
  columnStyles,
  inspectorStyles,
  leftCardStyles,
  rowListStyles,
  topBarStyles,
} from "../editor-chrome.js";
import { SCRUB_END, SCRUB_START } from "../editors.js";
import { formStyles } from "../form-styles.js";
import { HeadBar, headBarStyles, renderHeadStatus } from "../head-bar.js";
import {
  type HassLike,
  type OwnerSummary,
  type WatchConfigHistoryEntry,
  type WatchConfigLinkFailure,
  type WatchConfigRecord,
  type WatchUnitPlace,
  fetchCloudStatus,
  fetchOwners,
  fetchWatchConfig,
  fetchWatchConfigHistory,
  fetchWatchConfigHistoryEntry,
  fetchWatchPagesPlaces,
  fetchWatchVoices,
  linkWatchUnits,
  restoreWatchConfig,
  saveWatchConfig,
  subscribeWatchConfig,
} from "../ha-api.js";
import { devicesMenuStyles, renderPageDevicesMenu } from "../watch-pages/devices-menu.js";
import { type LinkDevice, type PagesRecordFacts, awaitingMove, linkDevicesOf, pagesRecordFacts } from "../watch-pages/devices.js";
import { deviceColor, deviceColors } from "../device-colors.js";
import { type IconProvider, REFERENCE_CASE, caseForScreenSize } from "../renderer.js";
import { agoWords } from "../send-state.js";
import { SymbolBrowser } from "../symbols.js";
import { uiIcon } from "../ui-icons.js";
import { watchFrameStyles } from "../watch-frame.js";
import { watchCloudTTSAvailable } from "../watch-pages/app-model.js";
import {
  SavedAgoTicker,
  configFootStatus,
  configFootStyles,
  copyConfigText,
  openConfigDialogs,
  renderConfigFoot,
  renderConfigHistoryDialog,
  renderConfigRawDialog,
  renderConfigSaved,
} from "../watch-pages/config-foot.js";
import { NO_ICONS, memoIconNames, watchKeysTypeText } from "../watch-pages/editor-host.js";
import { type WatchPagesNote, linkFailuresOf, watchCommandError, withLinkFailures } from "../watch-pages/save-note.js";
import { friendlyError } from "../friendly-error.js";
import { restoredText } from "../revision-words.js";
import { stageFitZoom, stageZoomIn, stageZoomLabel, stageZoomOut } from "../watch-pages/stage.js";
import { START_FRESH_BUTTON, type NoRecordStart, WAIT_FOR_IPHONE_TEXT, deliveryState, followWatch, mayStart, noRecordStart, settingsWatches, watchName } from "../watch-settings.js";
import {
  chooseStartFresh,
  firstSaveNote,
  newWatchStyles,
  opensReady,
  renderNewWatchBanner,
  renderSaveReason,
  saveBlockedText,
} from "../watch-menus/new-watch.js";
import {
  type WatchVoiceDraft,
  anyWatchVoiceDirty,
  dropAllWatchVoice,
  forgetWatchVoiceDraft,
  keptWatchVoiceDraft,
  newWatchVoiceDraft,
  saveWatchVoiceDraft,
  takeWatchVoiceRecord,
} from "./draft.js";
import { navigateWatchVoice, registerWatchVoiceDrafts } from "./hook.js";
import {
  VOICE_DEVICES_HEAD,
  VOICE_DEVICES_NOTE,
  VOICE_PHRASES_UNIT,
  VOICE_PHRASES_UNIT_NAME,
  VOICE_REPLACE_KEEPS_TEXT,
  restoreLinkLines,
  startFreshChoices,
  startFreshVoicePhrases,
  unlinkVoiceFrom,
  voiceDevicePlaces,
  voiceDeviceTitle,
  voiceLinkBadgeText,
  voiceLinkBadgeTitle,
  voiceLinkErrorText,
  voiceLinkNeedsReplace,
  voiceLinkPlaces,
  voicePhrasesAreFresh,
  voicePhrasesHolders,
  voicePhrasesLinkId,
  voiceReplaceQuestion,
} from "./links.js";
import {
  type VoiceDocument,
  WATCH_VOICE_NO_RECORD_TITLE,
  WATCH_VOICE_UPDATE_TEXT,
  type WatchVoiceInfo,
  asWatchVoiceDocument,
  readWatchVoices,
  watchVoiceBudget,
  watchVoiceDefaultsOf,
  watchVoicePhrases,
  watchVoiceReadMeansUnsupported,
} from "./model.js";
import { watchVoiceReplacedText, watchVoiceSaveNote } from "./save-note.js";
import {
  type PhrasesCardLinks,
  VOICE_STAGE_HINT,
  type VoiceViewHost,
  type WatchVoicesState,
  deselectVoicePhrase,
  renderPhrasesCard,
  renderVoiceCard,
  renderVoiceInspector,
  renderVoiceScreen,
  voiceStageFacts,
  voiceViewStyles,
} from "./voice-view.js";

registerWatchVoiceDrafts({ dirty: anyWatchVoiceDirty, drop: dropAllWatchVoice });

if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", (e: BeforeUnloadEvent) => {
    if (!anyWatchVoiceDirty()) return;
    e.preventDefault();
    e.returnValue = "";
  });
}

/** How often the view asks whether a device has collected a save. */
const DELIVERY_POLL_MS = 15_000;

const IS_MAC = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
const MOD = IS_MAC ? "⌘" : "Ctrl+";

const VE_COLUMNS = { min: 200, max: 720, middleMin: 320 } as const;
const VE_COLUMNS_DEFAULT: ColumnWidths = { left: 280, right: 340 };
export const VE_COLUMNS_KEY = "wrist-assistant-panel.voice.columns.v1";
const VE_GRID_CHROME = 2 * 8 + 4 * 2;
const VE_STACK_WIDTH = 820;

type Note = WatchPagesNote;
type HistoryState = "loading" | "ready" | "error" | "unsupported";

interface RestoreAsk {
  entry: WatchConfigHistoryEntry;
  baseRevision: number;
  summary?: string;
  /** What the restore does to the linked phrases (`restoreLinkLines`). */
  links?: string[];
}

/** A tick onto a watch with phrases of its own, waiting for its yes. */
interface ReplaceAsk {
  watchId: string;
  target: string;
  name: string;
}

/** Start fresh on phrases several watches hold, waiting for which. */
interface FreshAsk {
  watchId: string;
  question: string;
  here: string;
  all: string;
}

/** Another watch's voice record as the Devices menu reads it. */
interface OtherVoice {
  facts: PagesRecordFacts;
  document?: VoiceDocument;
}

/** Why the Devices menu's switches cannot be flipped while a save is out. */
const DEVICES_SAVING_TEXT = "Saving. The phrases can go on another watch once the save is done.";
/** Nor over unsaved edits: the phrases go on another watch as saved. */
const DEVICES_DIRTY_TEXT = "Save or discard your edits first. The phrases go on another watch as they are saved here.";

interface HassConnectionEvents {
  addEventListener?(type: "ready", listener: () => void): void;
  removeEventListener?(type: "ready", listener: () => void): void;
}

function errText(err: unknown): string {
  return watchCommandError(err).message;
}

function errCode(err: unknown): string | undefined {
  return watchCommandError(err).code;
}

function flatError(err: unknown): Error {
  const { code, message } = watchCommandError(err);
  return Object.assign(new Error(message), code === undefined ? {} : { code });
}

function kb(bytes: number): string {
  return bytes < 1000 ? `${bytes} bytes` : `${Number((bytes / 1000).toFixed(1))} KB`;
}

function ago(iso: string | null | undefined): string {
  const at = iso ? Date.parse(iso) : NaN;
  return Number.isNaN(at) ? "" : agoWords(Math.max(0, (Date.now() - at) / 1000));
}

function savedBy(updatedBy: string | null | undefined): string {
  return updatedBy === "panel" ? "Saved here" : "From the watch";
}

function isTextField(node: EventTarget | undefined): boolean {
  if (!(node instanceof HTMLElement)) return false;
  return watchKeysTypeText(node.tagName, node instanceof HTMLInputElement ? node.type : undefined, node.isContentEditable);
}

function nothingFocused(): boolean {
  let active: Element | null = document.activeElement;
  while (active?.shadowRoot?.activeElement) active = active.shadowRoot.activeElement;
  return active === null || active === document.body || active === document.documentElement;
}

/** A restore's one line: how many phrases, and the speakers. */
export function watchVoiceSummary(document: unknown): string {
  const doc = asWatchVoiceDocument(document) ?? {};
  const n = watchVoicePhrases(doc).length;
  const speakers = watchVoiceDefaultsOf(doc).speakers.length;
  return `${n} ${n === 1 ? "phrase" : "phrases"}. ${speakers === 0 ? "No default speakers." : `${speakers} default ${speakers === 1 ? "speaker" : "speakers"}.`}`;
}

export class WaVoiceEditor extends LitElement {
  @property({ attribute: false }) hass?: HassLike;
  @property({ attribute: false }) owners: readonly OwnerSummary[] = [];
  @property({ attribute: false }) ownerId?: string;
  @property({ type: Boolean, reflect: true }) narrow = false;
  @property({ attribute: false }) icons?: IconProvider;
  @property({ attribute: false }) iconsTick = 0;
  @property({ attribute: false }) haMenu = false;
  @property({ attribute: false }) onHaMenu?: () => void;
  /** Back to the complication editor. Without it, the address less `/voice`. */
  @property({ attribute: false }) onBack?: () => void;
  @property({ attribute: false }) barActions: TemplateResult | typeof nothing = nothing;
  /** The panel's Watch app row owns the watch: it picks the watch (this
   * element follows `ownerId` wherever it goes) and holds the ways to the
   * other screens, so the bar leaves out its own watch picker and the way
   * back to complications. Off, the bar is as it always was. */
  @property({ attribute: false }) shellOwnsWatch = false;
  /** The box in the panel's Watch app header the bar is drawn in
   * (`head-bar.ts`). Without one the bar is drawn on top, as it always was. */
  @property({ attribute: false }) barHost: HTMLElement | undefined = undefined;
  private readonly headBar = new HeadBar(this);

  @state() private watchId?: string;
  @state() private record?: WatchConfigRecord;
  /** The integration does not keep voice settings (too old for the kind). */
  @state() private unsupported = false;
  @state() private voices: readonly WatchVoiceInfo[] = [];
  @state() private voicesState: WatchVoicesState = "loading";
  @state() private cloudTTS?: boolean;
  @state() private loading = false;
  @state() private loadError?: string;
  @state() private history: WatchConfigHistoryEntry[] = [];
  @state() private historyState: HistoryState = "loading";
  @state() private note?: Note;
  @state() private restoreAsk?: RestoreAsk;
  @state() private restoring = false;
  @state() private historyOpen = false;
  @state() private rawOpen = false;
  @state() private rawCopied = false;
  private readonly shownFootDialogs = new WeakSet<HTMLDialogElement>();
  @state() private ownList?: readonly OwnerSummary[];
  @state() private topMenuOpen = false;
  @state() private watchMenuOpen = false;
  /** Where each linked unit of voice is (`watch_pages/places`), undefined
   * before the first read and on an integration that does not link voice,
   * which leaves the Devices menu and the badge off. */
  @state() private voicePlaces?: Record<string, WatchUnitPlace>;
  /** The other watches' voice records, read for the Devices menu. */
  @state() private otherVoice: ReadonlyMap<string, OtherVoice> = new Map();
  @state() private devicesOpen = false;
  @state() private linking = false;
  @state() private devicesNote?: Note;
  @state() private replaceAsk?: ReplaceAsk;
  @state() private freshAsk?: FreshAsk;
  private linksSeq = 0;
  /** The phrase link id the places were last read for. */
  private linksFor?: string;
  /** The stage's scale as stepped with the zoom buttons, undefined while it
   * fits. */
  @state() private zoom?: number;
  @state() private columns: ColumnWidths = { ...VE_COLUMNS_DEFAULT };
  @state() private hostWidth = 0;
  @state() private hostHeight = 0;
  private ownListAsked = false;
  private sizeObserver?: ResizeObserver;
  private observedTop?: HTMLElement;
  private topHeight = 0;
  private readonly savedTicker = new SavedAgoTicker(this);

  private readonly symbols = new SymbolBrowser(() => this.requestUpdate());
  private readonly uiState = new Map<string, unknown>();
  private iconMemo?: { provider: IconProvider; tick: number; icons: IconProvider };
  private scrubKey?: string;
  private scrubSeq = 0;
  private reloadPending = false;
  private restartDraft?: { watchId: string; revision: number };
  private followedSave?: Promise<unknown>;
  private shownDialog?: HTMLDialogElement;
  private loadSeq = 0;
  private voicesSeq = 0;
  private historySeq = 0;
  private subscribeSeq = 0;
  private cloudSeq = 0;
  private unsubscribe?: () => Promise<void>;
  private pollTimer?: number;
  private readyConnection?: HassConnectionEvents;

  private get watches(): OwnerSummary[] {
    return settingsWatches(this.owners.length > 0 ? this.owners : (this.ownList ?? []));
  }

  /** The voice settings being edited. While Home Assistant holds none for
   * the watch it is the new watch's ready draft (`new-watch.ts`), on the
   * defaults at revision 0 and unsaved, once the screen opens ready; none
   * while it waits for the iPhone. */
  private get draft(): WatchVoiceDraft | undefined {
    const watchId = this.watchId;
    const record = this.record;
    if (watchId === undefined || record === undefined) return undefined;
    if (record.revision > 0) {
      // Made from the record when none is kept (the panel's leave guard may
      // have dropped it); none for a record this panel cannot read.
      const kept = keptWatchVoiceDraft(watchId);
      if (kept !== undefined) return kept;
      const document = asWatchVoiceDocument(record.document);
      return document === undefined ? undefined : takeWatchVoiceRecord(watchId, document, record.revision).draft;
    }
    if (this.unsupported || !this.opensReady()) return undefined;
    return keptWatchVoiceDraft(watchId) ?? newWatchVoiceDraft(watchId);
  }

  /** Home Assistant holds no voice settings for the watch: the ready
   * screen's banner, and Save's reason while there is nothing to save. */
  private get newWatch(): boolean {
    const record = this.record;
    return record !== undefined && record.revision <= 0 && !this.unsupported;
  }

  private get saving(): boolean {
    return this.draft?.saving ?? false;
  }

  private get holdReload(): boolean {
    return this.saving || this.scrubKey !== undefined;
  }

  constructor() {
    super();
    this.addEventListener(SCRUB_START, this.onScrubStart);
    this.addEventListener(SCRUB_END, this.onScrubEnd);
    this.addEventListener("focusout", () => this.draft?.endCoalesce());
  }

  override connectedCallback(): void {
    super.connectedCallback();
    // The bar goes back into the header on the next draw.
    if (this.barHost !== undefined) this.requestUpdate();
    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("pointerdown", this.onWindowPointerDown, true);
    this.columns = loadColumnWidths(VE_COLUMNS_KEY, VE_COLUMNS_DEFAULT, VE_COLUMNS);
    this.watchSize();
    this.listenForReconnect();
    this.loadCloud();
    if (this.watchId !== undefined) this.openWatch(this.watchId, true);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.headBar.clear();
    window.removeEventListener("keydown", this.onKeyDown);
    window.removeEventListener("pointerdown", this.onWindowPointerDown, true);
    this.sizeObserver?.disconnect();
    this.observedTop = undefined;
    this.stopListeningForReconnect();
    this.reloadPending = false;
    this.endScrub();
    this.endSubscription();
    this.stopPolling();
    this.loadSeq++;
    this.voicesSeq++;
    this.historySeq++;
    this.cloudSeq++;
    this.linksSeq++;
  }

  protected override willUpdate(changed: PropertyValues): void {
    if (this.hass) {
      if (changed.has("hass")) {
        this.listenForReconnect();
        if (this.cloudTTS === undefined && changed.get("hass") === undefined) this.loadCloud();
      }
      if (this.owners.length === 0 && !this.ownListAsked) {
        this.ownListAsked = true;
        fetchOwners(this.hass).then(
          (reply) => { this.ownList = reply.owners; },
          () => { this.ownList = []; },
        );
      }
      const id = followWatch(this.watches, this.watchId, this.ownerId, this.shellOwnsWatch || changed.has("ownerId"));
      if (id !== undefined) this.openWatch(id);
    }
    this.followSave();
    const ask = this.restoreAsk;
    if (ask !== undefined && !this.restoring && this.historyState === "ready" && !this.history.some((e) => e.revision === ask.entry.revision)) {
      this.closeAsk();
    }
  }

  protected override updated(): void {
    this.headBar.draw(this.barHost, () => this.renderTopBar(this.draft, this.watches));
    const dialog = this.renderRoot.querySelector<HTMLDialogElement>("dialog.pe-ask") ?? undefined;
    if (dialog !== this.shownDialog) {
      this.shownDialog = dialog;
      if (dialog && !dialog.open) dialog.showModal();
    }
    openConfigDialogs(this.renderRoot, this.shownFootDialogs);
    this.observeTop();
    this.savedTicker.show(this.headBar.query(this.renderRoot, ".cf-saved") !== null
      || this.renderRoot.querySelector(".cf-saved") !== null);
  }

  private watchSize(): void {
    if (typeof ResizeObserver === "undefined") return;
    this.sizeObserver ??= new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target !== this) {
          this.measureTop(entry.target as HTMLElement);
          continue;
        }
        const box = entry.contentRect;
        if (Math.abs(box.width - this.hostWidth) >= 1) this.hostWidth = box.width;
        if (Math.abs(box.height - this.hostHeight) >= 1) this.hostHeight = box.height;
      }
    });
    this.sizeObserver.observe(this);
    this.observeTop();
  }

  private observeTop(): void {
    const observer = this.sizeObserver;
    if (observer === undefined) return;
    const top = this.renderRoot?.querySelector<HTMLElement>(".pe-top") ?? undefined;
    if (top === this.observedTop) return;
    if (this.observedTop !== undefined) observer.unobserve(this.observedTop);
    this.observedTop = top;
    if (top !== undefined) observer.observe(top);
  }

  private measureTop(top: HTMLElement): void {
    const height = top.offsetHeight;
    if (height === this.topHeight) return;
    this.topHeight = height;
    this.style.setProperty("--pe-top-h", `${height}px`);
  }

  private listenForReconnect(): void {
    const connection = this.hass?.connection as unknown as HassConnectionEvents | undefined;
    if (connection === this.readyConnection) return;
    this.stopListeningForReconnect();
    if (!this.isConnected || typeof connection?.addEventListener !== "function") return;
    connection.addEventListener("ready", this.onReconnect);
    this.readyConnection = connection;
  }

  private stopListeningForReconnect(): void {
    this.readyConnection?.removeEventListener?.("ready", this.onReconnect);
    this.readyConnection = undefined;
  }

  private onReconnect = (): void => {
    const watchId = this.watchId;
    if (!this.isConnected || watchId === undefined) return;
    void this.load(watchId, true);
    void this.loadVoices(watchId);
    this.loadCloud();
  };

  private followSave(): void {
    const watchId = this.watchId;
    if (watchId === undefined) return;
    const done = keptWatchVoiceDraft(watchId)?.saveDone;
    if (done === undefined || done === this.followedSave) return;
    this.followedSave = done;
    const ended = (): void => this.saveEnded(watchId);
    void done.then(ended, ended);
  }

  private saveEnded(watchId: string): void {
    this.requestUpdate();
    if (!this.isConnected) return;
    if (watchId === this.watchId) {
      this.reloadPending = false;
      void this.load(watchId, true);
    } else {
      this.flushPending();
    }
  }

  // ── loading ────────────────────────────────────────────────────────────

  private openWatch(watchId: string, quiet = false): void {
    if (watchId !== this.watchId) {
      this.reloadPending = false;
      this.restartDraft = undefined;
      this.watchId = watchId;
      this.note = undefined;
      this.unsupported = false;
      this.voices = [];
      this.voicesState = "loading";
      this.voicesSeq++;
      this.history = [];
      if (this.historyState !== "unsupported") this.historyState = "loading";
      this.closeAsk();
      this.endScrub();
      this.uiState.clear();
      this.devicesOpen = false;
      this.devicesNote = undefined;
      this.replaceAsk = undefined;
      this.freshAsk = undefined;
      this.otherVoice = new Map();
      this.linksFor = undefined;
      quiet = false;
    }
    this.startSubscription(watchId);
    void this.load(watchId, quiet);
    void this.loadVoices(watchId);
    void this.loadLinks(watchId);
  }

  /** Home Assistant Cloud's state, for `tts.cloud` in the engine lists. */
  private loadCloud(): void {
    const hass = this.hass;
    if (!hass) return;
    const seq = ++this.cloudSeq;
    fetchCloudStatus(hass).then(
      (status) => { if (seq === this.cloudSeq) this.cloudTTS = watchCloudTTSAvailable(status); },
      () => { if (seq === this.cloudSeq) this.cloudTTS = false; },
    );
  }

  /** The voices the watch reported. Never in the way of the record: a failed
   * read only says so under the picker. */
  private async loadVoices(watchId: string): Promise<void> {
    const hass = this.hass;
    if (!hass) return;
    const seq = ++this.voicesSeq;
    try {
      const reply = await fetchWatchVoices(hass, watchId);
      if (seq !== this.voicesSeq || watchId !== this.watchId) return;
      this.voices = readWatchVoices(reply);
      this.voicesState = "ready";
    } catch (err) {
      if (seq !== this.voicesSeq || watchId !== this.watchId) return;
      this.voicesState = errCode(err) === "unknown_command" ? "unsupported" : "error";
    }
  }

  private async load(watchId: string, quiet = false): Promise<void> {
    const hass = this.hass;
    if (!hass) return;
    if (quiet && this.holdReload) {
      this.reloadPending = true;
      return;
    }
    const seq = ++this.loadSeq;
    this.stopPolling();
    if (!quiet) {
      this.record = undefined;
      this.loading = true;
      this.loadError = undefined;
    }
    try {
      const record = await fetchWatchConfig(hass, watchId, "voice");
      if (seq !== this.loadSeq) return;
      if (quiet && this.holdReload) {
        this.reloadPending = true;
        return;
      }
      this.unsupported = false;
      this.show(record);
      this.loadError = undefined;
    } catch (err) {
      if (seq !== this.loadSeq) return;
      if (watchVoiceReadMeansUnsupported(err)) {
        this.unsupported = true;
        this.loadError = undefined;
      } else if (!quiet) {
        this.loadError = errText(err);
      }
      if (this.restartDraft?.watchId === watchId) this.restartDraft = undefined;
    }
    this.loading = false;
    if (this.unsupported) return;
    this.pollIfWaiting();
    void this.loadHistory(watchId);
  }

  private flushPending(): void {
    if (!this.reloadPending || this.holdReload || this.watchId === undefined) return;
    this.reloadPending = false;
    void this.load(this.watchId, true);
  }

  private show(record: WatchConfigRecord): void {
    const watchId = this.watchId;
    this.record = record;
    // No voice settings here: a kept draft from an earlier record moves onto
    // the defaults at revision 0, its edits kept, so its first save makes
    // the record (`newWatchVoiceDraft`).
    if (watchId !== undefined && record.revision <= 0) newWatchVoiceDraft(watchId);
    const document = record.revision > 0 ? asWatchVoiceDocument(record.document) : undefined;
    if (watchId === undefined || document === undefined) return;
    const restart = this.restartDraft;
    if (restart !== undefined && restart.watchId === watchId && record.revision >= restart.revision) {
      this.restartDraft = undefined;
      if (!(keptWatchVoiceDraft(watchId)?.dirty ?? false)) forgetWatchVoiceDraft(watchId);
    }
    const taken = takeWatchVoiceRecord(watchId, document, record.revision);
    if (taken.replaced.length > 0) this.note = { kind: "warn", text: watchVoiceReplacedText(taken.replaced) };
    else if (taken.mergedIntoEdits) this.note = { kind: "warn", text: "The voice settings changed somewhere else. Your edits are kept." };
    // Another watch linked these phrases, or dropped the link: read where
    // they are again for the badge.
    if (voicePhrasesLinkId(document) !== this.linksFor) void this.loadLinks(watchId);
    this.requestUpdate();
  }

  private async loadHistory(watchId: string): Promise<void> {
    const hass = this.hass;
    if (!hass || this.historyState === "unsupported") return;
    const seq = ++this.historySeq;
    try {
      const reply = await fetchWatchConfigHistory(hass, watchId, "voice");
      if (seq !== this.historySeq || watchId !== this.watchId) return;
      this.history = Array.isArray(reply?.entries) ? reply.entries : [];
      this.historyState = "ready";
    } catch (err) {
      if (seq !== this.historySeq || watchId !== this.watchId) return;
      this.historyState = errCode(err) === "unknown_command" ? "unsupported" : "error";
    }
  }

  /** Hear every save of this watch's config: a new `voice` revision is read
   * and merged into the draft. */
  private startSubscription(watchId: string): void {
    const hass = this.hass;
    this.endSubscription();
    if (!hass) return;
    const seq = ++this.subscribeSeq;
    subscribeWatchConfig(hass, watchId, (event) => {
      if (seq !== this.subscribeSeq) return;
      if (event.kind === "voice" && event.revision !== (this.record?.revision ?? 0)) void this.load(watchId, true);
    }).then(
      (unsubscribe) => {
        if (seq === this.subscribeSeq) this.unsubscribe = unsubscribe;
        else void unsubscribe().catch(() => undefined);
      },
      () => undefined,
    );
  }

  private endSubscription(): void {
    this.subscribeSeq++;
    const unsubscribe = this.unsubscribe;
    this.unsubscribe = undefined;
    void unsubscribe?.().catch(() => undefined);
  }

  private pollIfWaiting(): void {
    this.stopPolling();
    if (!this.isConnected || deliveryState(this.record) !== "waiting") return;
    this.pollTimer = window.setTimeout(() => void this.poll(), DELIVERY_POLL_MS);
  }

  private async poll(): Promise<void> {
    this.pollTimer = undefined;
    const hass = this.hass;
    const watchId = this.watchId;
    const shown = this.record;
    if (!hass || watchId === undefined || shown === undefined) return;
    if (this.holdReload) {
      this.pollIfWaiting();
      return;
    }
    try {
      const fresh = await fetchWatchConfig(hass, watchId, "voice");
      if (watchId !== this.watchId || this.record !== shown) return;
      if (fresh.revision === shown.revision) {
        this.record = {
          ...shown,
          delivered_revision: fresh.delivered_revision,
          delivered_at: fresh.delivered_at,
          rejected_revision: fresh.rejected_revision,
          rejected_at: fresh.rejected_at,
          rejected_reason: fresh.rejected_reason,
        };
      } else if (this.holdReload) {
        this.reloadPending = true;
      } else {
        this.show(fresh);
        void this.loadHistory(watchId);
      }
    } catch {
      // A missed check is not news.
    }
    this.pollIfWaiting();
  }

  private stopPolling(): void {
    if (this.pollTimer !== undefined) window.clearTimeout(this.pollTimer);
    this.pollTimer = undefined;
  }

  // ── editing ────────────────────────────────────────────────────────────

  private edit(change: (document: VoiceDocument) => VoiceDocument, coalesce?: string): boolean {
    const draft = this.draft;
    if (!draft || this.saving) return false;
    const changed = draft.apply(change(draft.document), this.scrubKey ?? coalesce);
    this.requestUpdate();
    return changed;
  }

  private onScrubStart = (e: Event): void => {
    e.stopPropagation();
    this.endScrub();
    this.draft?.endCoalesce();
    this.scrubKey = `scrub:${++this.scrubSeq}`;
    window.addEventListener("pointerup", this.onScrubPointerUp, true);
    window.addEventListener("pointercancel", this.onScrubPointerUp, true);
  };

  private onScrubEnd = (e: Event): void => {
    e.stopPropagation();
    this.endScrub();
  };

  private onScrubPointerUp = (): void => {
    this.endScrub();
  };

  private endScrub(): void {
    window.removeEventListener("pointerup", this.onScrubPointerUp, true);
    window.removeEventListener("pointercancel", this.onScrubPointerUp, true);
    if (this.scrubKey === undefined) return;
    this.scrubKey = undefined;
    this.draft?.endCoalesce();
    this.flushPending();
  }

  private memoIcons(): IconProvider {
    const provider = this.icons ?? NO_ICONS;
    const memo = this.iconMemo;
    if (memo !== undefined && memo.provider === provider && memo.tick === this.iconsTick) return memo.icons;
    const icons = memoIconNames(provider);
    this.iconMemo = { provider, tick: this.iconsTick, icons };
    return icons;
  }

  private screen(): { width: number; height: number } {
    const owner = this.watches.find((w) => w.owner_watch_id === this.watchId);
    return (caseForScreenSize(owner?.screen_size) ?? REFERENCE_CASE).screen;
  }

  private viewHost(): VoiceViewHost | undefined {
    const draft = this.draft;
    const hass = this.hass;
    if (draft === undefined || hass === undefined) return undefined;
    const self = this;
    return {
      hass,
      icons: this.memoIcons(),
      symbols: this.symbols,
      uiState: this.uiState,
      screen: this.screen(),
      scale: this.stageScale,
      voices: this.voices,
      voicesState: this.voicesState,
      cloudTTS: this.cloudTTS,
      get document() { return draft.document; },
      get busy() { return self.saving; },
      edit: (change, coalesce) => this.draft === draft && this.edit(change, coalesce),
      endCoalesce: () => draft.endCoalesce(),
      requestUpdate: () => this.requestUpdate(),
    };
  }

  private undo(): void {
    if (this.draft?.undo()) this.requestUpdate();
  }

  private redo(): void {
    if (this.draft?.redo()) this.requestUpdate();
  }

  private discard(): void {
    if (this.saving) return;
    if (this.draft?.discard()) {
      this.note = { kind: "ok", text: "Edits discarded. Undo brings them back." };
      this.requestUpdate();
    }
  }

  private async save(): Promise<void> {
    const hass = this.hass;
    const watchId = this.watchId;
    this.endScrub();
    const draft = this.draft;
    if (!hass || watchId === undefined || !draft || this.saving || !draft.dirty) return;
    this.note = undefined;
    // A first save over revision 0 that Home Assistant refuses as
    // `no_record` means the watch is not paired (`firstSaveNote`).
    const first = draft.revision <= 0;
    // The linked watches Home Assistant could not bring up to date.
    let failures: WatchConfigLinkFailure[] = [];
    const running = saveWatchVoiceDraft(draft, {
      save: (base, document) => saveWatchConfig(hass, watchId, "voice", base, document).then((reply) => {
        failures = linkFailuresOf(reply);
        return reply;
      }, (err: unknown) => {
        throw flatError(err);
      }),
      fetch: async () => {
        const record = await fetchWatchConfig(hass, watchId, "voice").catch((err: unknown) => {
          throw flatError(err);
        });
        return { revision: record.revision, document: record.document };
      },
    });
    this.followedSave = draft.saveDone;
    this.requestUpdate();
    const result = await running.catch((err: unknown) => ({
      ok: false,
      revision: draft.revision,
      merged: false,
      code: errCode(err) ?? "unknown",
      message: errText(err),
    }));
    this.saveEnded(watchId);
    if (watchId === this.watchId) {
      const note = firstSaveNote(first, result.code, watchVoiceSaveNote(result));
      this.note = result.ok ? withLinkFailures(note, failures, "phrases") : note;
      if (result.ok) void this.loadLinks(watchId);
    }
  }

  /** "Start fresh instead", asked first: while an iPhone may still move the
   * voice settings here, open the same ready screen a watch without one
   * opens on, the defaults unsaved. Nothing is written until Save. */
  private startFresh(): void {
    const watchId = this.watchId;
    if (watchId === undefined || !mayStart(this.noRecordState())) return;
    chooseStartFresh("voice", watchId);
    this.note = undefined;
    this.requestUpdate();
  }

  // ── linked phrases ─────────────────────────────────────────────────────

  /** The watches the phrases can be on (`links.ts`): watches only, named as
   * the editor names them. */
  private get linkDevices(): LinkDevice[] {
    return linkDevicesOf(this.owners.length > 0 ? this.owners : (this.ownList ?? []), false);
  }

  private deviceName(ownerId: string): string {
    return this.linkDevices.find((d) => d.ownerId === ownerId)?.name ?? "the other watch";
  }

  /** The watches that hold the phrases, this one first. */
  private phraseHolders(): string[] {
    const watchId = this.watchId;
    return watchId === undefined ? [] : voicePhrasesHolders(this.draft?.document, watchId, this.voicePlaces);
  }

  /** The phrases can go on another watch: the integration links voice, the
   * watch has saved voice settings, and there is another watch. */
  private get linksOn(): boolean {
    return this.voicePlaces !== undefined && (this.record?.revision ?? 0) > 0 && this.linkDevices.length > 1;
  }

  /**
   * Read where the linked voice settings are (`watch_pages/places`), then
   * the other watches' voice records, for the replace question and the
   * watches that wait for their iPhone. Only the newest read lands. An
   * integration without voice links leaves the Devices menu off; a failed
   * read keeps what was known.
   */
  private async loadLinks(watchId: string): Promise<void> {
    const hass = this.hass;
    if (!hass) return;
    const seq = ++this.linksSeq;
    const shown = this.record !== undefined && this.record.revision > 0 ? asWatchVoiceDocument(this.record.document) : undefined;
    this.linksFor = voicePhrasesLinkId(shown);
    let reply: unknown;
    try {
      reply = await fetchWatchPagesPlaces(hass);
    } catch (err) {
      if (seq === this.linksSeq && errCode(err) === "unknown_command") this.voicePlaces = undefined;
      return;
    }
    if (seq !== this.linksSeq || watchId !== this.watchId) return;
    this.voicePlaces = voiceLinkPlaces(reply);
    if (this.voicePlaces === undefined) return;
    const others = this.linkDevices.filter((d) => d.ownerId !== watchId);
    const read = await Promise.all(others.map(async (d): Promise<[string, OtherVoice] | undefined> => {
      try {
        const record = await fetchWatchConfig(hass, d.ownerId, "voice");
        const document = record.revision > 0 ? asWatchVoiceDocument(record.document) : undefined;
        return [d.ownerId, { facts: pagesRecordFacts(record), ...(document === undefined ? {} : { document }) }];
      } catch {
        // A watch whose voice settings could not be read asks nothing first;
        // Home Assistant still refuses a link that would replace its own.
        return undefined;
      }
    }));
    if (seq !== this.linksSeq || watchId !== this.watchId) return;
    this.otherVoice = new Map(read.filter((r): r is [string, OtherVoice] => r !== undefined));
  }

  /** The watches that wait for their iPhone to move their voice settings
   * here, which cannot take the phrases yet. */
  private waitingWatches(): Set<string> {
    const facts = new Map([...this.otherVoice].map(([id, v]) => [id, v.facts] as const));
    return awaitingMove(this.owners.length > 0 ? this.owners : (this.ownList ?? []), facts);
  }

  /** Open the Devices menu on the Phrases card, and read the places again
   * for it. */
  private openDevices(): void {
    this.topMenuOpen = false;
    this.devicesNote = undefined;
    this.devicesOpen = true;
    if (this.watchId !== undefined) void this.loadLinks(this.watchId);
    void this.updateComplete.then(() => {
      this.renderRoot.querySelector?.<HTMLElement>(".vo-phrases-card .pe-dev-menu")?.scrollIntoView({ block: "nearest" });
    });
  }

  private closeDevices(): void {
    this.devicesOpen = false;
    this.devicesNote = undefined;
  }

  /** Why the Devices menu's switches cannot be flipped now, or undefined.
   * The phrases go on another watch as saved, so not over edits. */
  private devicesBlocked(): string | undefined {
    if (this.saving) return DEVICES_SAVING_TEXT;
    if (this.draft?.dirty ?? false) return DEVICES_DIRTY_TEXT;
    return undefined;
  }

  /**
   * Tick a watch: the phrases and their defaults, as saved, go on it,
   * linked (`watch_pages/link`, kind `voice`). A watch with phrases of its
   * own asks first (`voiceLinkNeedsReplace`), and so does one Home Assistant
   * refuses as `unit_taken`; its yes sends `replace`. This watch's copy gets
   * the link too, and arrives as a change.
   */
  private async linkTo(target: string, replace = false): Promise<void> {
    const hass = this.hass;
    const watchId = this.watchId;
    if (!hass || watchId === undefined || target === watchId || this.linking || this.devicesBlocked() !== undefined) return;
    const name = this.deviceName(target);
    if (!replace && voiceLinkNeedsReplace(this.otherVoice.get(target)?.document, voicePhrasesLinkId(this.draft?.document))) {
      this.replaceAsk = { watchId, target, name };
      return;
    }
    this.linking = true;
    this.devicesNote = undefined;
    try {
      await linkWatchUnits(hass, "voice", watchId, [VOICE_PHRASES_UNIT], [target], replace);
      if (watchId !== this.watchId) return;
      this.devicesNote = { kind: "ok", text: [`Now on ${name} too.`, replace ? VOICE_REPLACE_KEEPS_TEXT : undefined].filter((t) => t !== undefined).join(" ") };
      void this.load(watchId, true);
      void this.loadLinks(watchId);
    } catch (err) {
      if (watchId !== this.watchId) return;
      if (!replace && errCode(err) === "unit_taken") this.replaceAsk = { watchId, target, name };
      else this.devicesNote = { kind: "err", text: `Not added. ${voiceLinkErrorText(err)}` };
    } finally {
      this.linking = false;
    }
  }

  /** Untick a watch: its copy is saved without the link and keeps its
   * phrases (`unlinkVoiceFrom`). */
  private async unlinkFrom(target: string): Promise<void> {
    const hass = this.hass;
    const watchId = this.watchId;
    if (!hass || watchId === undefined || target === watchId || this.linking || this.devicesBlocked() !== undefined) return;
    this.linking = true;
    this.devicesNote = undefined;
    const result = await unlinkVoiceFrom({
      read: (o) => fetchWatchConfig(hass, o, "voice"),
      save: (o, base, document) => saveWatchConfig(hass, o, "voice", base, document),
    }, target);
    this.linking = false;
    if (watchId !== this.watchId) return;
    const name = this.deviceName(target);
    this.devicesNote = result.ok
      ? { kind: "ok", text: `Unlinked ${name}. It keeps its copy of the phrases.` }
      : { kind: "err", text: `Not unlinked from ${name}: ${result.message}` };
    void this.load(watchId, true);
    void this.loadLinks(watchId);
  }

  private closeReplaceAsk(): void {
    this.renderRoot?.querySelector<HTMLDialogElement>("dialog.ve-replace-ask")?.close();
    this.replaceAsk = undefined;
  }

  private confirmReplace(): void {
    const ask = this.replaceAsk;
    this.closeReplaceAsk();
    if (ask !== undefined && ask.watchId === this.watchId) void this.linkTo(ask.target, true);
  }

  /**
   * Start fresh: no phrases and the app's defaults, as one edit Undo takes
   * back; the watch's own speech settings stay. Phrases on several watches
   * ask first, here only (this watch is unlinked as it saves) or on all of
   * them (the save hands the fresh start on).
   */
  private startFreshPhrases(): void {
    const watchId = this.watchId;
    const draft = this.draft;
    if (watchId === undefined || draft === undefined || this.saving) return;
    const choices = startFreshChoices(this.phraseHolders());
    if (choices === undefined) {
      this.applyFresh(false);
      return;
    }
    this.freshAsk = { watchId, question: choices.question, here: choices.here, all: choices.all };
  }

  private applyFresh(unlink: boolean): void {
    if (this.edit((d) => startFreshVoicePhrases(d, unlink))) {
      this.note = { kind: "ok", text: unlink
        ? "Started fresh on this watch. Save to unlink it from the others. Undo brings the phrases back."
        : "Started fresh. Save to clear the phrases everywhere they are. Undo brings them back." };
    }
  }

  private closeFreshAsk(): void {
    this.renderRoot?.querySelector<HTMLDialogElement>("dialog.ve-fresh-ask")?.close();
    this.freshAsk = undefined;
  }

  private answerFresh(unlink: boolean): void {
    const ask = this.freshAsk;
    this.closeFreshAsk();
    if (ask !== undefined && ask.watchId === this.watchId) this.applyFresh(unlink);
  }

  /** The Phrases card's badge and Devices menu, while the phrases can go on
   * another watch. */
  private phrasesLinks(): PhrasesCardLinks | undefined {
    const watchId = this.watchId;
    if (watchId === undefined || !this.linksOn) return undefined;
    const holders = this.phraseHolders();
    const devices = this.linkDevices;
    const badge = voiceLinkBadgeText(holders, watchId, devices);
    const badgeTitle = voiceLinkBadgeTitle(holders, watchId, devices);
    const blocked = this.devicesBlocked();
    return {
      ...(badge === undefined ? {} : { badge }),
      ...(badgeTitle === undefined ? {} : { badgeTitle }),
      open: this.devicesOpen,
      onDevices: () => (this.devicesOpen ? this.closeDevices() : this.openDevices()),
      menu: this.devicesOpen ? renderPageDevicesMenu({
        name: VOICE_PHRASES_UNIT_NAME,
        head: VOICE_DEVICES_HEAD,
        foot: VOICE_DEVICES_NOTE,
        places: voiceDevicePlaces(devices, this.draft?.document, watchId, this.voicePlaces, this.waitingWatches()),
        ...(blocked === undefined ? {} : { blocked }),
        busy: this.linking,
        ...(this.devicesNote === undefined ? {} : { note: this.devicesNote }),
        className: "at-card",
        colorOf: (ownerId) => this.colorOf(ownerId),
        titleOf: voiceDeviceTitle,
        onToggle: (place) => void (place.on ? this.unlinkFrom(place.device.ownerId) : this.linkTo(place.device.ownerId)),
        onDone: () => this.closeDevices(),
      }) : nothing,
    };
  }

  // ── restore ────────────────────────────────────────────────────────────

  private closeAsk(): void {
    this.renderRoot?.querySelector<HTMLDialogElement>("dialog.pe-ask")?.close();
    this.restoreAsk = undefined;
  }

  private askRestore(entry: WatchConfigHistoryEntry): void {
    const hass = this.hass;
    const watchId = this.watchId;
    const record = this.record;
    if (!hass || watchId === undefined || record === undefined || this.draft?.dirty) return;
    const ask: RestoreAsk = { entry, baseRevision: record.revision };
    this.restoreAsk = ask;
    fetchWatchConfigHistoryEntry(hass, watchId, "voice", entry.revision).then(
      (reply) => {
        if (this.restoreAsk !== ask) return;
        this.restoreAsk = { ...ask, summary: watchVoiceSummary(reply.document), links: this.restoreLinks(record.document, reply.document) };
      },
      () => undefined,
    );
  }

  /** What restoring `restored` over `now` does to the linked phrases. */
  private restoreLinks(now: unknown, restored: unknown): string[] {
    const watchId = this.watchId;
    if (watchId === undefined) return [];
    const current = voicePhrasesLinkId(asWatchVoiceDocument(now));
    const back = voicePhrasesLinkId(asWatchVoiceDocument(restored));
    return restoreLinkLines([{
      name: "phrases and defaults",
      holders: (link) => (this.voicePlaces?.[link]?.owners ?? []).filter((o) => o !== watchId).map((o) => this.deviceName(o)),
      ...(current === undefined ? {} : { now: current }),
      ...(back === undefined ? {} : { restored: back }),
    }], "watch");
  }

  private async restore(): Promise<void> {
    const hass = this.hass;
    const watchId = this.watchId;
    const ask = this.restoreAsk;
    if (!hass || watchId === undefined || ask === undefined || this.restoring) return;
    this.restoring = true;
    let note: Note;
    try {
      const reply = await restoreWatchConfig(hass, watchId, "voice", ask.entry.revision, ask.baseRevision);
      note = withLinkFailures({ kind: "ok", text: restoredText(ask.entry.updated_at) }, linkFailuresOf(reply), "phrases")!;
      if (watchId === this.watchId) this.restartDraft = { watchId, revision: reply.revision };
      else if (!(keptWatchVoiceDraft(watchId)?.dirty ?? false)) forgetWatchVoiceDraft(watchId);
    } catch (err) {
      const code = errCode(err);
      if (code === "conflict") note = { kind: "warn", text: "Not restored. The voice settings changed somewhere else, so the newest copy is shown." };
      else if (code === "no_record") note = { kind: "warn", text: "Not restored. Home Assistant no longer holds voice settings for this watch." };
      else if (code === "not_found") note = { kind: "warn", text: "Not restored. That save is no longer kept." };
      else if (code === "unknown_command") {
        this.historyState = "unsupported";
        note = { kind: "warn", text: "This version of the integration cannot restore voice settings. Update it to restore an earlier save." };
      } else note = { kind: "err", text: `Could not restore: ${friendlyError(err)}` };
    } finally {
      this.restoring = false;
      if (this.restoreAsk === ask) this.closeAsk();
    }
    if (watchId !== this.watchId) return;
    this.note = note;
    void this.load(watchId, true);
  }

  // ── keys ───────────────────────────────────────────────────────────────

  private onKeyDown = (e: KeyboardEvent): void => {
    if (e.defaultPrevented) return;
    const path = e.composedPath();
    if (!path.includes(this) && !this.headBar.holds(path) && !nothingFocused()) return;
    if (this.renderRoot.querySelector("dialog[open]")) return;
    const mod = e.metaKey || e.ctrlKey;
    const key = e.key.toLowerCase();
    if (mod && !e.altKey && key === "s") {
      e.preventDefault();
      void this.save();
      return;
    }
    if (e.key === "Escape" && this.topMenuOpen) {
      e.preventDefault();
      this.topMenuOpen = false;
      return;
    }
    if (e.key === "Escape" && this.watchMenuOpen) {
      e.preventDefault();
      this.watchMenuOpen = false;
      return;
    }
    if (e.key === "Escape" && this.devicesOpen) {
      e.preventDefault();
      this.closeDevices();
      return;
    }
    if (isTextField(path[0])) return;
    if (mod && !e.altKey && key === "z") {
      e.preventDefault();
      if (e.shiftKey) this.redo();
      else this.undo();
      return;
    }
    if (e.ctrlKey && !e.metaKey && !e.altKey && key === "y") {
      e.preventDefault();
      this.redo();
      return;
    }
    if (e.key === "Escape" && !mod && !e.altKey) {
      const host = this.viewHost();
      if (host !== undefined && deselectVoicePhrase(host)) e.preventDefault();
    }
  };

  private onWindowPointerDown = (e: PointerEvent): void => {
    if (!this.topMenuOpen && !this.watchMenuOpen && !this.devicesOpen) return;
    const path = e.composedPath();
    const within = (name: string) => path.some((n) => n instanceof HTMLElement && n.classList.contains(name));
    if (this.topMenuOpen && !within("pe-top-menu")) this.topMenuOpen = false;
    if (this.watchMenuOpen && !within("ve-watch-picker")) this.watchMenuOpen = false;
    if (this.devicesOpen && !within("pe-dev-menu") && !within("vo-dev-open") && !within("pe-top-menu") && !within("pe-ask")) this.closeDevices();
  };

  // ── drawing ────────────────────────────────────────────────────────────

  override render(): TemplateResult {
    const watches = this.watches;
    const draft = this.draft;
    return html`
      <div class="pe-top">
        ${this.barHost === undefined ? this.renderTopBar(draft, watches) : nothing}
        ${this.note ? html`<div class="pe-note ${this.note.kind}" role="status"><span>${this.note.text}</span>
          <button class="pe-link" @click=${() => { this.note = undefined; }}>Dismiss</button></div>` : nothing}
      </div>
      ${this.renderBody(watches)}
      ${this.restoreAsk ? this.renderRestoreAsk(this.restoreAsk)
        : this.replaceAsk ? this.renderReplaceAsk(this.replaceAsk)
        : this.freshAsk ? this.renderFreshAsk(this.freshAsk) : nothing}
    `;
  }

  /** The question before a tick writes over a watch's own phrases. */
  private renderReplaceAsk(ask: ReplaceAsk): TemplateResult {
    return html`<dialog class="pe-ask ve-replace-ask" aria-labelledby="ve-replace-title"
      @close=${() => { this.replaceAsk = undefined; }}>
      <h3 id="ve-replace-title">${voiceReplaceQuestion(ask.name)}</h3>
      <p class="pe-muted">Its phrases and defaults become these, linked: an edit on one watch then shows on both. ${VOICE_REPLACE_KEEPS_TEXT}</p>
      <div class="pe-ask-foot">
        <button class="pe-btn" @click=${() => this.closeReplaceAsk()}>Cancel</button>
        <button class="pe-btn pe-primary" @click=${() => this.confirmReplace()}>Replace</button>
      </div>
    </dialog>`;
  }

  /** Start fresh's question for phrases on several watches. */
  private renderFreshAsk(ask: FreshAsk): TemplateResult {
    return html`<dialog class="pe-ask ve-fresh-ask" aria-labelledby="ve-fresh-title"
      @close=${() => { this.freshAsk = undefined; }}>
      <h3 id="ve-fresh-title">Start fresh?</h3>
      <p>${ask.question} Here only unlinks this watch and leaves the others as they are.</p>
      <div class="pe-ask-foot">
        <button class="pe-btn" @click=${() => this.closeFreshAsk()}>Cancel</button>
        <button class="pe-btn" @click=${() => this.answerFresh(true)}>${ask.here}</button>
        <button class="pe-btn pe-primary" @click=${() => this.answerFresh(false)}>${ask.all}</button>
      </div>
    </dialog>`;
  }

  private get stacked(): boolean {
    return this.narrow || (this.hostWidth > 0 && this.hostWidth <= VE_STACK_WIDTH);
  }

  private renderTopBar(draft: WatchVoiceDraft | undefined, watches: readonly OwnerSummary[]): TemplateResult {
    const editing = draft !== undefined && !this.unsupported;
    const dirty = editing && draft.dirty;
    return html`<div class="wa-bar ${this.barHost !== undefined ? "in-head" : this.stacked ? "stacked" : ""}" role="toolbar" aria-label="Watch voice">
      ${this.haMenu ? html`<button class="icon tb-icon tb-menu" title="Home Assistant menu" aria-label="Home Assistant menu"
        @click=${() => this.onHaMenu?.()}>${uiIcon("menu")}</button>` : nothing}
      ${this.shellOwnsWatch ? nothing : html`<button class="tb-btn tb-back" title="Back to complications"
        @click=${() => (this.onBack ? this.onBack() : navigateWatchVoice(undefined, false))}>${uiIcon("left")}<span>Complications</span></button>`}
      <span class="spacer"></span>
      ${this.shellOwnsWatch ? nothing : this.renderWatchPicker(watches)}
      ${this.barHost !== undefined && editing ? renderHeadStatus({ newWatch: this.newWatch, dirty, saved: renderConfigSaved(this.record) }) : nothing}
      ${this.renderSyncPill(editing ? draft : undefined)}
      ${this.renderTopMenu(editing ? draft : undefined)}
      ${editing ? html`<button class="primary save ${dirty ? "dirty" : ""}" ?disabled=${!dirty || this.saving}
          title=${dirty ? `Save (${MOD}S). A save reaches the watch the next time it checks.` : `Nothing to save (${MOD}S)`}
          @click=${() => void this.save()}>${this.saving ? "Saving…" : "Save"}</button>
        ${this.barHost !== undefined ? nothing : html`<span class="tb-saved" title=${dirty ? "Unsaved changes" : ""}>${renderConfigSaved(this.record)}</span>
        ${renderSaveReason(saveBlockedText({ newWatch: this.newWatch, dirty, saving: this.saving }))}`}` : nothing}
      ${this.barActions}
    </div>`;
  }

  private renderSyncPill(draft: WatchVoiceDraft | undefined): TemplateResult | typeof nothing {
    const record = this.record;
    if (record === undefined || record.revision <= 0 || this.unsupported) return nothing;
    const budget = draft === undefined ? { size: 0, limit: 1 } : watchVoiceBudget(draft.document);
    const status = configFootStatus({ record, size: budget.size, limit: budget.limit, noun: "voice settings", historyState: this.historyState });
    return html`<span class="tb-sync ${status.tone === "ok" ? "ok" : "warn"}" title=${`${status.state}. ${status.help}`}>
      <i class="tb-dot" aria-hidden="true"></i><span class="tb-sync-l">${status.state}</span>
    </span>`;
  }

  /** Whether this watch's iPhone may still move this kind here, so the
   * screen waits and "Start fresh instead" asks first (`noRecordStart`). */
  private noRecordState(watches: readonly OwnerSummary[] = this.watches): NoRecordStart {
    return noRecordStart(watches.find((w) => w.owner_watch_id === this.watchId));
  }

  /** With no voice settings here, whether the screen opens ready
   * (`new-watch.ts`) rather than wait for the iPhone. */
  private opensReady(watches: readonly OwnerSummary[] = this.watches): boolean {
    return opensReady(this.noRecordState(watches), "voice", this.watchId);
  }

  /** "Start fresh instead" applies: Home Assistant holds no voice settings
   * for this watch, the integration keeps them, and the screen waits for
   * the iPhone. */
  private canStartFresh(): boolean {
    return this.watchId !== undefined && this.newWatch && !this.opensReady();
  }

  /** The ··· menu: Discard edits; on a watch with saved voice settings,
   * Devices (the Phrases card's menu) and Start fresh; and Start fresh
   * instead while the screen waits for the iPhone. */
  private renderTopMenu(draft: WatchVoiceDraft | undefined): TemplateResult | typeof nothing {
    const start = this.canStartFresh();
    if (draft === undefined && !start) return nothing;
    const open = this.topMenuOpen;
    const run = (fn: () => void) => () => { this.topMenuOpen = false; fn(); };
    const saved = draft !== undefined && !this.newWatch;
    return html`<span class="side-menu pe-top-menu">
      <button class="tb-btn tb-more" aria-haspopup="menu" aria-expanded=${open ? "true" : "false"} aria-label="More actions" title="More"
        @click=${() => { this.topMenuOpen = !open; }}>···</button>
      ${open ? html`<div class="pop-menu side-pop" role="menu" aria-label="More actions">
        ${draft ? html`<button class="row" role="menuitem" ?disabled=${!draft.dirty || this.saving}
          title=${this.newWatch ? "Go back to the defaults. Undo brings the edits back." : "Go back to the copy Home Assistant holds. Undo brings the edits back."}
          @click=${run(() => this.discard())}>Discard edits</button>` : nothing}
        ${saved && this.linksOn ? html`<button class="row ve-dev-item" role="menuitem"
          title="Pick the watches these phrases and defaults are on"
          @click=${run(() => this.openDevices())}>Devices…</button>` : nothing}
        ${saved ? html`<button class="row" role="menuitem" ?disabled=${this.saving || voicePhrasesAreFresh(draft.document)}
          title="No phrases and the app's defaults again. The watch voice and Silent Mode setting stay. Undo brings the phrases back."
          @click=${run(() => this.startFreshPhrases())}>Start fresh</button>` : nothing}
        ${start ? html`<button class="row" role="menuitem"
          @click=${run(() => this.startFresh())}>${START_FRESH_BUTTON}</button>` : nothing}
      </div>` : nothing}
    </span>`;
  }

  /** A watch's device color (`device-colors.ts`), for its glyph. */
  private colorOf(watchId: string): string | undefined {
    return deviceColor(deviceColors(this.owners.length > 0 ? this.owners : (this.ownList ?? [])), watchId);
  }

  private renderWatchPicker(watches: readonly OwnerSummary[]): TemplateResult | typeof nothing {
    if (watches.length < 2) return nothing;
    const current = watches.find((w) => w.owner_watch_id === this.watchId);
    const open = this.watchMenuOpen;
    const glyph = (id: string | undefined) => {
      const color = id === undefined ? undefined : this.colorOf(id);
      return html`<span class="pe-chip-glyph" style=${color ? `--pe-person: ${color}` : nothing} aria-hidden="true">${uiIcon("watch")}</span>`;
    };
    return html`<span class="picker ve-watch-picker">
      <button type="button" class="tb-browse ve-watch-btn" aria-haspopup="menu" aria-expanded=${open ? "true" : "false"}
        title="Choose the watch whose voice settings are shown" @click=${() => { this.watchMenuOpen = !open; }}>
        ${glyph(current?.owner_watch_id)}<span class="tb-browse-l">${current ? watchName(current, watches) : "Choose a watch"}</span>
        <span class="ve-caret" aria-hidden="true">${uiIcon("chevron")}</span>
      </button>
      ${open ? html`<div class="pop-menu ve-watch-menu" role="menu" aria-label="Watches">
        ${watches.map((w) => {
          const on = w.owner_watch_id === this.watchId;
          return html`<button type="button" class="row ve-watch-row" role="menuitemradio" aria-checked=${on ? "true" : "false"}
            @click=${() => { this.watchMenuOpen = false; if (!on) this.openWatch(w.owner_watch_id); }}>
            ${glyph(w.owner_watch_id)}<span class="ve-watch-name">${watchName(w, watches)}</span>
            <span class="ve-watch-check" aria-hidden="true">${on ? uiIcon("check") : nothing}</span>
          </button>`;
        })}
      </div>` : nothing}
    </span>`;
  }

  private fittedColumns(): ColumnWidths {
    if (this.hostWidth > 0 && this.hostWidth <= VE_STACK_WIDTH) return this.columns;
    return fitColumnWidths(this.hostWidth - VE_GRID_CHROME, this.columns, VE_COLUMNS);
  }

  private renderGutter(side: "left" | "right"): TemplateResult {
    return html`<div class="gutter ${side}" role="separator" aria-orientation="vertical"
      aria-label=${side === "left" ? "Resize the voice and phrases column" : "Resize the settings column"}
      title="Drag to resize. Double-click to reset."
      @pointerdown=${(e: PointerEvent) => {
        const shown = this.fittedColumns();
        beginColumnDrag(e, {
          side,
          base: side === "left" ? shown.left : shown.right,
          limits: VE_COLUMNS,
          onWidth: (width) => { this.columns = { ...this.columns, [side]: width }; },
          onEnd: () => saveColumnWidths(VE_COLUMNS_KEY, this.columns),
        });
      }}
      @dblclick=${() => {
        this.columns = { ...this.columns, [side]: VE_COLUMNS_DEFAULT[side] };
        saveColumnWidths(VE_COLUMNS_KEY, this.columns);
      }}></div>`;
  }

  private get stageScale(): number {
    return this.zoom ?? stageFitZoom(this.narrow || this.stacked);
  }

  private renderStage(host: VoiceViewHost, watches: readonly OwnerSummary[]): TemplateResult {
    const owner = watches.find((w) => w.owner_watch_id === this.watchId);
    const found = caseForScreenSize(owner?.screen_size);
    const watchCase = found ?? REFERENCE_CASE;
    const facts = [...voiceStageFacts(host), watchCase.label];
    const draft = this.draft;
    const scale = this.stageScale;
    const fit = stageFitZoom(this.narrow || this.stacked);
    return html`<div class="card canvas-card lit ve-canvas" aria-label="Pick from List">
      <div class="cv-head">
        <span class="cv-title">Pick from List</span>
        ${owner !== undefined ? html`<span class="cv-part cv-where"><span class="cv-slash" aria-hidden="true">/</span>
          <span class="cv-watch">${watchName(owner, watches)}</span></span>` : nothing}
        <span class="cv-part cv-what"><span class="cv-slash" aria-hidden="true">/</span>
          <span class="cv-shape" title=${facts.join(" · ")}><span class="fam">${facts.join(" · ")}</span></span></span>
        <span class="cv-acts">
          <button class="cv-act icon undo" ?disabled=${!draft?.canUndo} title=${`Undo (${MOD}Z)`} aria-label="Undo"
            @click=${() => this.undo()}>${uiIcon("undo")}</button>
          <button class="cv-act icon undo" ?disabled=${!draft?.canRedo} title=${IS_MAC ? "Redo (⇧⌘Z)" : "Redo (Ctrl+Y)"} aria-label="Redo"
            @click=${() => this.redo()}>${uiIcon("redo")}</button>
        </span>
      </div>
      <div class="stage-area ve-stage-area">
        <div class="stage-tools" role="toolbar" aria-label="Stage tools">
          <span class="tb-zoom" role="group" aria-label="Zoom">
            <button class="tb icon" ?disabled=${scale <= stageZoomOut(scale)} aria-label="Zoom out" title="Zoom out"
              @click=${() => { this.zoom = stageZoomOut(scale); }}>−</button>
            <button class="tb pct" aria-label=${`Zoom ${stageZoomLabel(scale)}. Back to fit`}
              title=${`The watch at ${stageZoomLabel(scale)} of its own points. Click to fit it again (${stageZoomLabel(fit)}).`}
              @click=${() => { this.zoom = undefined; }}>${stageZoomLabel(scale)}</button>
            <button class="tb icon" ?disabled=${scale >= stageZoomIn(scale)} aria-label="Zoom in" title="Zoom in"
              @click=${() => { this.zoom = stageZoomIn(scale); }}>+</button>
          </span>
        </div>
        <div class="ve-stage-body">${renderVoiceScreen(host)}</div>
        <div class="under"><span class="tail">${VOICE_STAGE_HINT}</span></div>
      </div>
    </div>`;
  }

  private renderBody(watches: readonly OwnerSummary[]): TemplateResult {
    if (watches.length === 0) {
      const waiting = this.owners.length === 0 && this.ownList === undefined;
      return html`<div class="pe-empty">${waiting ? "Loading…" : "No watch has connected to this Home Assistant yet. Pair one on the Home tab."}</div>`;
    }
    if (this.unsupported) return html`<div class="pe-empty"><b>${WATCH_VOICE_UPDATE_TEXT}</b></div>`;
    if (this.loading) return html`<div class="pe-empty">Loading…</div>`;
    if (this.loadError !== undefined) {
      const id = this.watchId;
      return html`<div class="pe-empty">
        <span>Could not read this watch's voice settings: ${this.loadError}</span>
        ${id === undefined ? nothing : html`<button class="pe-btn" @click=${() => void this.load(id)}>Try again</button>`}
      </div>`;
    }
    const record = this.record;
    if (record === undefined) return html`<div class="pe-empty">Loading…</div>`;
    const draft = this.draft;
    // A record this panel cannot read, such as one from a newer schema.
    if (draft === undefined && record.revision > 0) return html`<div class="pe-empty"><b>${WATCH_VOICE_UPDATE_TEXT}</b></div>`;
    if (draft === undefined) {
      const kept = this.watchId === undefined ? undefined : keptWatchVoiceDraft(this.watchId);
      const id = this.watchId;
      // No voice settings here and the screen does not open ready: the
      // iPhone's move may still come, so it waits, and "Start fresh instead"
      // is a small link that asks first.
      return html`<div class="pe-empty"><b>${WATCH_VOICE_NO_RECORD_TITLE}</b><span>${WAIT_FOR_IPHONE_TEXT}</span>
        <button class="link start-fresh" @click=${() => this.startFresh()}>${START_FRESH_BUTTON}</button>
        ${kept?.dirty && id !== undefined ? html`<span class="pe-warn">Your unsaved edits from before are kept. They come back, merged in, when voice settings are here again.</span>
          <button class="pe-btn" @click=${() => { forgetWatchVoiceDraft(id); this.requestUpdate(); }}>Discard the kept edits</button>` : nothing}
      </div>`;
    }
    const host = this.viewHost();
    if (host === undefined) return html`<div class="pe-empty">Loading…</div>`;
    const fit = this.fittedColumns();
    const view = this.hostHeight > 0 ? `--pe-view-h:${this.hostHeight}px;` : "";
    const fresh = record.revision <= 0;
    return html`${fresh && this.barHost === undefined ? renderNewWatchBanner() : nothing}
    <div class="layout pe-layout ${this.stacked ? "cols-1" : "cols-3"}" style=${`--wa-left:${fit.left}px;--wa-right:${fit.right}px;${view}`}>
      <div class="column left">
        ${renderVoiceCard(host)}
        ${renderPhrasesCard(host, this.phrasesLinks())}
      </div>
      ${this.renderGutter("left")}
      <div class="column canvas">
        ${this.renderStage(host, watches)}
      </div>
      ${this.renderGutter("right")}
      <div class="column inspector card">
        ${renderVoiceInspector(host)}
      </div>
    </div>
    ${fresh ? nothing : this.renderFoot(record, draft.document, draft.dirty)}`;
  }

  private renderFoot(record: WatchConfigRecord, document: VoiceDocument, dirty: boolean): TemplateResult {
    const budget = watchVoiceBudget(document);
    const status = configFootStatus({ record, size: budget.size, limit: budget.limit, noun: "voice settings", historyState: this.historyState });
    const watchId = this.watchId;
    return html`${renderConfigFoot({
      status,
      historyState: this.historyState,
      historyOpen: this.historyOpen,
      rawOpen: this.rawOpen,
      onHistory: () => { this.historyOpen = true; },
      onRaw: () => { this.rawCopied = false; this.rawOpen = true; },
    })}
    ${this.historyOpen ? renderConfigHistoryDialog({
      noun: "voice settings",
      record,
      entries: this.history,
      historyState: this.historyState,
      dirty,
      restoring: this.restoring,
      onRetry: () => {
        if (watchId === undefined) return;
        this.historyState = "loading";
        void this.loadHistory(watchId);
      },
      onRestore: (entry) => { this.historyOpen = false; this.askRestore(entry); },
      onClosed: () => { this.historyOpen = false; },
    }) : nothing}
    ${this.rawOpen ? renderConfigRawDialog({
      noun: "voice settings",
      document,
      revision: record.revision,
      dirty,
      copied: this.rawCopied,
      onCopy: (text) => { void copyConfigText(text).then((ok) => { this.rawCopied = ok; }); },
      onClosed: () => { this.rawOpen = false; },
    }) : nothing}`;
  }

  private renderRestoreAsk(ask: RestoreAsk): TemplateResult {
    const record = this.record;
    const when = ago(ask.entry.updated_at);
    return html`<dialog class="pe-ask" aria-labelledby="ve-ask-title"
      @cancel=${(e: Event) => { if (this.restoring) e.preventDefault(); }}
      @close=${() => { this.restoreAsk = undefined; }}>
      <h3 id="ve-ask-title">Restore revision ${ask.entry.revision}?</h3>
      <p>${savedBy(ask.entry.updated_by)}${when ? ` ${when}` : ""}, ${kb(ask.entry.size)}.</p>
      ${ask.summary ? html`<p class="pe-muted">${ask.summary}</p>` : nothing}
      <p>It is saved again as a new revision${record ? `, after revision ${record.revision}` : ""}. The copy shown now stays in the earlier saves.</p>
      ${(ask.links ?? []).map((line) => html`<p>${line}</p>`)}
      <div class="pe-ask-foot">
        <button class="pe-btn" ?disabled=${this.restoring} @click=${() => this.closeAsk()}>Cancel</button>
        <button class="pe-btn pe-primary" ?disabled=${this.restoring} @click=${() => void this.restore()}>${this.restoring ? "Restoring…" : "Restore"}</button>
      </div>
    </dialog>`;
  }

  static override styles = [formStyles, chromeTokens, topBarStyles, columnStyles, leftCardStyles, rowListStyles, canvasStyles, inspectorStyles, watchFrameStyles, newWatchStyles, css`
    :host {
      display: flex;
      flex-direction: column;
      flex: 1 1 auto;
      min-height: 0;
      overflow: auto;
      container-type: inline-size;
      --cf-pad: 16px;
      padding: var(--cf-pad);
      scroll-padding-top: var(--pe-top-h, 0px);
      color: var(--wa-ink);
      background: var(--wa-bg);
      font-size: 14px;
    }
    * { box-sizing: border-box; }
    svg.ui-icon { width: 14px; height: 14px; display: block; flex: none; }
    h2, h3, h4, p { margin: 0; }
    .pe-top {
      flex: none; display: flex; flex-direction: column;
      position: sticky; top: calc(-1 * var(--cf-pad, 16px)); z-index: 7;
      margin: calc(-1 * var(--cf-pad, 16px)) calc(-1 * var(--cf-pad, 16px)) 0;
      padding: 0 0 10px;
      background: var(--wa-bg);
    }
    h3 { font-size: 13px; font-weight: 650; text-transform: uppercase; letter-spacing: .04em; color: var(--wa-muted); }
    code { font-family: monospace; font-size: 12px; overflow-wrap: anywhere; }
    .pe-muted { color: var(--wa-muted); font-size: 13px; }
    .pe-warn { color: var(--wa-amber); font-size: 13px; font-weight: 600; }
    .wa-bar button.tb-btn:has(> svg.ui-icon) { display: inline-flex; align-items: center; gap: 6px; padding: 0 11px 0 9px; }
    .wa-bar button.tb-btn svg.ui-icon { width: 14px; height: 14px; }
    .wa-bar button.tb-btn:disabled, .wa-bar button.primary.save:disabled { opacity: .45; cursor: default; }
    .wa-bar .tb-saved .cf-saved { margin: 0; font-size: inherit; color: inherit; }
    .wa-bar .pop-menu .row:disabled { opacity: .5; cursor: default; }
    .wa-bar .pop-menu .row:disabled:hover { background: transparent; }
    .pe-top > .pe-note { margin: 10px var(--cf-pad, 16px) 0; }
    .pe-note {
      display: flex; align-items: center; gap: 10px; margin-bottom: 12px; padding: 10px 12px;
      border-radius: var(--wa-r-md, 12px); border: 1px solid var(--wa-line); background: var(--wa-card); font-size: 13px;
    }
    .pe-note > span { flex: 1; min-width: 0; }
    .pe-note.ok { border-color: color-mix(in srgb, var(--wa-green) 40%, transparent); }
    .pe-note.warn { border-color: var(--wa-amber-line); background: var(--wa-amber-bg); }
    .pe-note.err { border-color: color-mix(in srgb, var(--wa-need) 45%, transparent); }
    .pe-link { border: 0; background: none; padding: 0; color: var(--wa-accent); font: inherit; font-size: 13px; cursor: pointer; }
    .pe-link:focus-visible { outline: none; box-shadow: var(--wa-ring); border-radius: 4px; }
    .pe-empty {
      display: flex; flex-direction: column; align-items: flex-start; gap: 8px; max-width: 560px;
      padding: 20px; border: 1px solid var(--wa-line); border-radius: var(--wa-r-lg, 16px); background: var(--wa-card);
    }
    .layout.pe-layout { flex: none; min-height: auto; overflow: visible; align-items: start; padding: 0; margin-bottom: 14px; }
    .pe-layout > .column.left, .pe-layout > .column.inspector {
      --pe-under-top: max(0px, calc(var(--pe-top-h, 0px) - var(--cf-pad, 16px)));
      position: sticky; top: var(--pe-under-top);
      max-height: calc(var(--pe-view-h, calc(100dvh - 120px)) - 30px - var(--pe-under-top));
      overflow-y: auto; overflow-x: hidden;
    }
    .pe-layout > .column.left { display: flex; flex-direction: column; gap: 8px; scrollbar-gutter: auto; }
    .pe-layout > .column.left > .card { flex: none; }
    .pe-layout > .column.canvas { overflow: visible; min-height: auto; }
    @container (max-width: 820px) {
      .layout.pe-layout { grid-template-columns: minmax(0, 1fr); }
      .pe-layout > .gutter { display: none; }
      /* As strong as the sticky rule, so a stacked list or inspector stops
         sliding over the cards above it (the page editor's fix). */
      .pe-layout > .column.left, .pe-layout > .column.canvas, .pe-layout > .column.inspector { grid-column: auto; position: static; max-height: none; overflow: visible; }
      .pe-layout > .column.canvas { order: 1; }
      .pe-layout > .column.inspector { order: 2; }
      .pe-layout > .column.left { order: 3; }
    }
    .column.canvas > .card.canvas-card.ve-canvas { min-height: 0; flex: none; }
    /* The lit stage's edge in Voice's hue, Home's Voice door. */
    .canvas-card.ve-canvas { --wa-stage-hue: var(--wa-hue-red); }
    .cv-head .cv-title { flex: 0 1 auto; min-width: 0; font-size: 14px; font-weight: 600; letter-spacing: -.01em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .cv-head .cv-watch { min-width: 0; font-size: 12.5px; font-weight: 500; color: var(--wa-ink); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .pe-chip-glyph { display: inline-flex; flex: none; color: var(--pe-person, var(--wa-muted)); }
    .pe-chip-glyph svg.ui-icon { width: 13px; height: 13px; }
    .picker > button.ve-watch-btn { max-width: 260px; }
    .ve-watch-btn .tb-browse-l { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .ve-watch-btn .ve-caret { display: inline-flex; flex: none; color: var(--wa-muted); }
    .picker > button.ve-watch-btn .ve-caret svg { width: 11px; height: 11px; }
    .pop-menu.ve-watch-menu { left: 0; right: auto; min-width: 220px; }
    .ve-watch-menu .row.ve-watch-row { display: flex; align-items: center; gap: 8px; }
    .ve-watch-row .ve-watch-name { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; }
    .ve-watch-row[aria-checked="true"] { font-weight: 700; }
    .ve-watch-check { display: inline-flex; flex: none; width: 14px; color: var(--wa-accent); }
    .ve-watch-check svg.ui-icon { width: 14px; height: 14px; }
    .ve-stage-area { position: relative; padding: 64px 12px 12px; gap: 10px; }
    .ve-stage-body { display: flex; justify-content: center; padding: 0 4px 4px; overflow-x: auto; overflow-y: hidden; }
    .ve-stage-area > .under {
      display: flex; flex-direction: column; gap: 4px; align-self: center; max-width: 460px; text-align: center;
      font-size: 11.5px; font-weight: 400; line-height: 15px; color: var(--wa-hint, var(--wa-muted));
    }
    .pe-history { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; }
    .pe-history > li { display: flex; align-items: center; gap: 10px; padding: 8px 0; border-top: 1px solid var(--wa-line); }
    .pe-history > li:first-child { border-top: 0; }
    .pe-h-text { display: flex; flex-direction: column; gap: 2px; flex: 1; min-width: 0; }
    .pe-h-text > .pe-muted { font-size: 12px; }
    .pe-btn {
      display: inline-flex; align-items: center; justify-content: center; gap: 6px;
      flex: none; min-height: 32px; padding: 0 12px; border: 1px solid var(--wa-line-strong); border-radius: var(--wa-r-sm, 8px);
      background: var(--wa-card); color: var(--wa-ink); font: inherit; font-size: 13px; cursor: pointer;
    }
    .pe-btn:hover:not(:disabled) { background: var(--wa-panel); }
    .pe-btn:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .pe-btn:disabled { opacity: .55; cursor: default; }
    .pe-btn.pe-primary { border-color: transparent; background: var(--wa-primary-bg); color: var(--wa-primary-ink); }
    .pe-btn.pe-primary:hover:not(:disabled) { background: var(--wa-primary-bg); filter: brightness(1.1); }
    .pe-btn.pe-danger { color: var(--wa-need); }
    dialog.pe-ask {
      width: min(460px, calc(100vw - 32px)); padding: 20px; border: 1px solid var(--wa-line); border-radius: var(--wa-r-lg, 16px);
      background: var(--wa-card); color: var(--wa-ink); box-shadow: var(--wa-shadow-pop);
    }
    dialog.pe-ask::backdrop { background: rgba(0, 0, 0, .45); }
    dialog.pe-ask > * + * { margin-top: 10px; }
    dialog.pe-ask h3 { font-size: 17px; text-transform: none; letter-spacing: 0; color: var(--wa-ink); overflow-wrap: anywhere; }
    dialog.pe-ask p { font-size: 14px; line-height: 1.4; }
    dialog.pe-ask p.pe-muted { font-size: 13px; }
    .pe-ask-foot { display: flex; justify-content: flex-end; gap: 8px; padding-top: 6px; }
    :host([narrow]) { --cf-pad: 12px; }
  `, voiceViewStyles, devicesMenuStyles, configFootStyles, headBarStyles];
}

if (!customElements.get("wa-voice-editor")) {
  customElements.define("wa-voice-editor", WaVoiceEditor);
}

declare global {
  interface HTMLElementTagNameMap {
    "wa-voice-editor": WaVoiceEditor;
  }
}
