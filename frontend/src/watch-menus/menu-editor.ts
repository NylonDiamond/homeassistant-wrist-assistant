// `<wa-menu-editor>`: the watch's menus as Home Assistant keeps them (the
// `menus` watch config kind), and an editor for them: the Anywhere menu and
// its style, the Entity quick menu with each entity's own menu, and the page
// switcher's style.
//
// The host pattern of the page editor (`watch-pages/page-editor.ts`): watch
// tabs from the owners list, the record read with `watch_config/get` and kept
// as raw JSON in a draft (`draft.ts`) with undo and redo, a save through
// `watch_config/save` that merges when the iPhone saved too, the earlier saves
// with restore, the delivery check, and the size budget. The `catalog`,
// `pages` and `behavior` records are read beside it, read only, for the
// pickers' names; the live line reads them again when they change and merges
// a `menus` change into the open draft.
//
// A watch with no menus record yet can start from the app's defaults
// (`menu-defaults.json`): a save over revision 0, which Home Assistant takes
// for a paired watch.
//
// The panel loads this module on its own, with one `import()`, when its route
// is `/menus` (`hook.ts`). Nothing it imports may import `icons.ts`.
//
// Plan: app repo docs/pages_in_home_assistant_step4.md ("4d batch 1 build
// contract", items 5 to 7).

import { LitElement, css, html, nothing, type PropertyValues, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { SCRUB_END, SCRUB_START } from "../editors.js";
import { formStyles } from "../form-styles.js";
import {
  type HassLike,
  type OwnerSummary,
  type WatchConfigHistoryEntry,
  type WatchConfigRecord,
  fetchOwners,
  fetchWatchConfig,
  fetchWatchConfigHistory,
  fetchWatchConfigHistoryEntry,
  restoreWatchConfig,
  saveWatchConfig,
  subscribeWatchConfig,
} from "../ha-api.js";
import { peopleOf } from "../people.js";
import { personColorVar } from "../pickerRows.js";
import { type IconProvider, REFERENCE_CASE, caseForScreenSize } from "../renderer.js";
import { agoWords } from "../send-state.js";
import { SymbolBrowser } from "../symbols.js";
import { uiIcon } from "../ui-icons.js";
import { type WatchCatalog, watchCatalogEventIsNews, watchCatalogFromRecord, watchCatalogReadMeansNone } from "../watch-pages/catalog.js";
import { NO_ICONS, memoIconNames, watchKeysTypeText } from "../watch-pages/editor-host.js";
import { watchFrameStyles } from "../watch-frame.js";
import { isHiddenWatchPage, isJsonObject, isSmartWatchPage, isSystemWatchPage, watchPageId, watchPageName, watchPageTiles, watchPagesOf } from "../watch-pages/model.js";
import { type WatchPagesNote, watchCommandError } from "../watch-pages/save-note.js";
import {
  COLLECTED_PILL_TEXT,
  WAITING_HELP_TEXT,
  START_PHONE_FIRST_TEXT,
  WAITING_PILL_TEXT,
  deliveryState,
  initialWatch,
  rejectedNow,
  settingsWatches,
  watchName,
} from "../watch-settings.js";
import {
  type WatchMenusDraft,
  anyWatchMenusDirty,
  dropAllWatchMenus,
  forgetWatchMenusDraft,
  keptWatchMenusDraft,
  saveWatchMenusDraft,
  startWatchMenus,
  takeWatchMenusRecord,
} from "./draft.js";
import { registerWatchMenusDrafts } from "./hook.js";
import { type MenuSwitcherPage, type MenusScreen, type MenusViewHost, menuViewStyles, menusPreviewScale, renderMenus } from "./menu-view.js";
import {
  type MenuTargets,
  type MenusDocument,
  WATCH_MENUS_NO_RECORD_TEXT,
  WATCH_MENUS_NO_RECORD_TITLE,
  WATCH_MENUS_PAIR_FIRST_TEXT,
  WATCH_MENUS_START_BUTTON,
  WATCH_MENUS_UPDATE_TEXT,
  asWatchMenusDocument,
  isMenuUUID,
  scrubWatchMenuOrphanTriggers,
  watchMenuOverrideIds,
  watchMenuSlots,
  watchMenusBudget,
  watchMenusReadMeansUnsupported,
} from "./model.js";
import { watchMenusReplacedText, watchMenusSaveNote } from "./save-note.js";

registerWatchMenusDrafts({ dirty: anyWatchMenusDirty, drop: dropAllWatchMenus });

if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", (e: BeforeUnloadEvent) => {
    if (!anyWatchMenusDirty()) return;
    e.preventDefault();
    e.returnValue = "";
  });
}

/** How often the view asks whether a device has collected a save. */
const DELIVERY_POLL_MS = 15_000;

const IS_MAC = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
const MOD = IS_MAC ? "⌘" : "Ctrl+";

type Note = WatchPagesNote;
type HistoryState = "loading" | "ready" | "error" | "unsupported";

interface RestoreAsk {
  entry: WatchConfigHistoryEntry;
  baseRevision: number;
  summary?: string;
}

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

/** Who made a save: the panel writes `panel`, a device its id. */
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

/** The pages a Go to Page slot can open, from the pages record: every page
 * with a UUID id that is not a system page, in watch order. */
export function watchMenuPageTargets(document: unknown): { id: string; name: string }[] {
  if (!isJsonObject(document)) return [];
  return watchPagesOf(document)
    .filter((p) => !isSystemWatchPage(p) && isMenuUUID(watchPageId(p)))
    .map((p) => ({ id: watchPageId(p), name: watchPageName(p) }));
}

/** The colors the watch's page switcher gives a page with no switcher color
 * of its own, by its place in the switcher (`PageSwitcherOverlay.swift`). */
export const WATCH_SWITCHER_COLORS: readonly string[] = ["#8FA8C4", "#9CB6A6", "#C8AE8E", "#A5B7CF", "#D8A3A0", "#A8BED5", "#CCD8E6", "#D8A3A0"];

function filled(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() !== "" ? value : undefined;
}

/** The pages the watch's page switcher shows, from the pages record, as it
 * draws them: every page not hidden, not a system page and not left out of
 * the switcher, in watch order; by its switcher text (else its name) or, set
 * to icon, by its switcher icon (else its first tile's, else the watch's
 * stand-in); in its switcher color, else the switcher's color for its
 * place. */
export function watchSwitcherPages(document: unknown): MenuSwitcherPage[] {
  if (!isJsonObject(document)) return [];
  return watchPagesOf(document)
    .filter((p) => !isHiddenWatchPage(p) && !isSystemWatchPage(p) && p.hideFromSwitcher !== true)
    .map((p, i) => {
      const name = watchPageName(p);
      const icon = filled(p.switcherIcon) ?? filled(watchPageTiles(p)[0]?.icon) ?? (isSmartWatchPage(p) ? "bolt.fill" : "square.grid.2x2.fill");
      const color = filled(p.switcherColor) ?? WATCH_SWITCHER_COLORS[i % WATCH_SWITCHER_COLORS.length]!;
      const text = p.switcherDisplayMode === "icon" ? undefined : filled(p.switcherText) ?? name;
      return { id: watchPageId(p), name, icon, color, ...(text === undefined ? {} : { text }) };
    });
}

/** A restore's one line: how many slots each menu holds. */
export function watchMenusSummary(document: unknown): string {
  const doc = asWatchMenusDocument(document) ?? {};
  const anywhere = watchMenuSlots(doc, { list: "anywhere" }).length;
  const overrides = watchMenuOverrideIds(doc).length;
  const slots = (n: number) => `${n} ${n === 1 ? "slot" : "slots"}`;
  return `Anywhere menu: ${slots(anywhere)}. ${overrides === 0 ? "No entity has its own menu." : `${overrides} ${overrides === 1 ? "entity has" : "entities have"} its own menu.`}`;
}

export class WaMenuEditor extends LitElement {
  @property({ attribute: false }) hass?: HassLike;
  @property({ attribute: false }) owners: readonly OwnerSummary[] = [];
  @property({ attribute: false }) ownerId?: string;
  @property({ type: Boolean, reflect: true }) narrow = false;
  @property({ attribute: false }) icons?: IconProvider;
  @property({ attribute: false }) iconsTick = 0;

  @state() private watchId?: string;
  @state() private record?: WatchConfigRecord;
  /** The integration does not keep menus (too old for the kind). */
  @state() private unsupported = false;
  @state() private catalog?: WatchCatalog;
  @state() private pages: { id: string; name: string }[] = [];
  /** The pages the watch's page switcher shows, for its preview. */
  @state() private switcherPages: MenuSwitcherPage[] = [];
  /** The watch's behavior settings, read only. The Entity quick menu's
   * gestures live there; batch 1 shows none of them. */
  @state() private behavior?: Readonly<Record<string, unknown>>;
  @state() private loading = false;
  @state() private loadError?: string;
  @state() private history: WatchConfigHistoryEntry[] = [];
  @state() private historyState: HistoryState = "loading";
  @state() private note?: Note;
  @state() private restoreAsk?: RestoreAsk;
  @state() private restoring = false;
  @state() private starting = false;
  @state() private ownList?: readonly OwnerSummary[];
  /** The editor's own width, for the previews' scale; 0 until measured. */
  @state() private hostWidth = 0;
  private ownListAsked = false;
  private sizeObserver?: ResizeObserver;

  private readonly symbols = new SymbolBrowser(() => this.requestUpdate());
  private readonly uiState = new Map<string, unknown>();
  private iconMemo?: { provider: IconProvider; tick: number; icons: IconProvider };
  /** The coalesce key of a drag on a number field running now. */
  private scrubKey?: string;
  private scrubSeq = 0;
  private reloadPending = false;
  private restartDraft?: { watchId: string; revision: number };
  private followedSave?: Promise<unknown>;
  private shownDialog?: HTMLDialogElement;
  private loadSeq = 0;
  private catalogSeq = 0;
  private pagesSeq = 0;
  private behaviorSeq = 0;
  private historySeq = 0;
  private subscribeSeq = 0;
  private unsubscribe?: () => Promise<void>;
  private pollTimer?: number;
  private readyConnection?: HassConnectionEvents;

  private get watches(): OwnerSummary[] {
    return settingsWatches(this.owners.length > 0 ? this.owners : (this.ownList ?? []));
  }

  private get draft(): WatchMenusDraft | undefined {
    if (this.watchId === undefined || this.record === undefined || this.record.revision <= 0) return undefined;
    return keptWatchMenusDraft(this.watchId);
  }

  private get saving(): boolean {
    return this.watchId !== undefined && (keptWatchMenusDraft(this.watchId)?.saving ?? false);
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
    window.addEventListener("keydown", this.onKeyDown);
    this.watchSize();
    this.listenForReconnect();
    if (this.watchId !== undefined) this.openWatch(this.watchId, true);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    window.removeEventListener("keydown", this.onKeyDown);
    this.sizeObserver?.disconnect();
    this.stopListeningForReconnect();
    this.reloadPending = false;
    this.endScrub();
    this.endSubscription();
    this.stopPolling();
    this.loadSeq++;
    this.catalogSeq++;
    this.pagesSeq++;
    this.behaviorSeq++;
    this.historySeq++;
  }

  protected override willUpdate(changed: PropertyValues): void {
    if (this.hass) {
      if (changed.has("hass")) this.listenForReconnect();
      if (this.owners.length === 0 && !this.ownListAsked) {
        this.ownListAsked = true;
        fetchOwners(this.hass).then(
          (reply) => { this.ownList = reply.owners; },
          () => { this.ownList = []; },
        );
      }
      const watches = this.watches;
      if (this.watchId === undefined || !watches.some((w) => w.owner_watch_id === this.watchId)) {
        const id = initialWatch(watches, this.ownerId);
        if (id !== undefined && id !== this.watchId) this.openWatch(id);
      }
    }
    this.followSave();
    const ask = this.restoreAsk;
    if (ask !== undefined && !this.restoring && this.historyState === "ready" && !this.history.some((e) => e.revision === ask.entry.revision)) {
      this.closeAsk();
    }
  }

  protected override updated(): void {
    const dialog = this.renderRoot.querySelector<HTMLDialogElement>("dialog.pe-ask") ?? undefined;
    if (dialog !== this.shownDialog) {
      this.shownDialog = dialog;
      if (dialog && !dialog.open) dialog.showModal();
    }
  }

  /** Measure the host, not the window: the Home Assistant sidebar changes
   * the editor's width without changing the window's. */
  private watchSize(): void {
    if (typeof ResizeObserver === "undefined") return;
    this.sizeObserver ??= new ResizeObserver((entries) => {
      const box = entries[0]?.contentRect;
      if (box && Math.abs(box.width - this.hostWidth) >= 1) this.hostWidth = box.width;
    });
    this.sizeObserver.observe(this);
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
    void this.loadCatalog(watchId);
    void this.loadPages(watchId);
    void this.loadBehavior(watchId);
  };

  private followSave(): void {
    const watchId = this.watchId;
    const done = watchId === undefined ? undefined : keptWatchMenusDraft(watchId)?.saveDone;
    if (watchId === undefined || done === undefined || done === this.followedSave) return;
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
      this.catalog = undefined;
      this.catalogSeq++;
      this.pages = [];
      this.switcherPages = [];
      this.pagesSeq++;
      this.behavior = undefined;
      this.behaviorSeq++;
      this.history = [];
      if (this.historyState !== "unsupported") this.historyState = "loading";
      this.closeAsk();
      this.endScrub();
      this.uiState.clear();
      quiet = false;
    }
    this.startSubscription(watchId);
    void this.load(watchId, quiet);
    void this.loadCatalog(watchId);
    void this.loadPages(watchId);
    void this.loadBehavior(watchId);
  }

  private async loadCatalog(watchId: string): Promise<void> {
    const hass = this.hass;
    if (!hass) return;
    const seq = ++this.catalogSeq;
    try {
      const record = await fetchWatchConfig(hass, watchId, "catalog");
      if (seq !== this.catalogSeq || watchId !== this.watchId) return;
      this.catalog = watchCatalogFromRecord(record);
    } catch (error) {
      if (seq !== this.catalogSeq || watchId !== this.watchId) return;
      if (watchCatalogReadMeansNone(error)) this.catalog = undefined;
    }
  }

  private async loadPages(watchId: string): Promise<void> {
    const hass = this.hass;
    if (!hass) return;
    const seq = ++this.pagesSeq;
    try {
      const record = await fetchWatchConfig(hass, watchId, "pages");
      if (seq !== this.pagesSeq || watchId !== this.watchId) return;
      this.pages = record.revision > 0 ? watchMenuPageTargets(record.document) : [];
      this.switcherPages = record.revision > 0 ? watchSwitcherPages(record.document) : [];
    } catch {
      // A failed read keeps the names shown: the picker still saves ids.
    }
  }

  private async loadBehavior(watchId: string): Promise<void> {
    const hass = this.hass;
    if (!hass) return;
    const seq = ++this.behaviorSeq;
    try {
      const record = await fetchWatchConfig(hass, watchId, "behavior");
      if (seq !== this.behaviorSeq || watchId !== this.watchId) return;
      this.behavior = record.revision > 0 && isJsonObject(record.document) ? record.document : undefined;
    } catch {
      if (seq !== this.behaviorSeq || watchId !== this.watchId) return;
      this.behavior = undefined;
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
      const record = await fetchWatchConfig(hass, watchId, "menus");
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
      if (watchMenusReadMeansUnsupported(err)) {
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
    const document = record.revision > 0 ? asWatchMenusDocument(record.document) : undefined;
    if (watchId === undefined || document === undefined) return;
    const restart = this.restartDraft;
    if (restart !== undefined && restart.watchId === watchId && record.revision >= restart.revision) {
      this.restartDraft = undefined;
      if (!(keptWatchMenusDraft(watchId)?.dirty ?? false)) forgetWatchMenusDraft(watchId);
    }
    const taken = takeWatchMenusRecord(watchId, document, record.revision);
    if (taken.replaced.length > 0) this.note = { kind: "warn", text: watchMenusReplacedText(taken.replaced) };
    else if (taken.mergedIntoEdits) this.note = { kind: "warn", text: "The menus changed on the iPhone. Your edits are kept." };
    this.requestUpdate();
  }

  private async loadHistory(watchId: string): Promise<void> {
    const hass = this.hass;
    if (!hass || this.historyState === "unsupported") return;
    const seq = ++this.historySeq;
    try {
      const reply = await fetchWatchConfigHistory(hass, watchId, "menus");
      if (seq !== this.historySeq || watchId !== this.watchId) return;
      this.history = Array.isArray(reply?.entries) ? reply.entries : [];
      this.historyState = "ready";
    } catch (err) {
      if (seq !== this.historySeq || watchId !== this.watchId) return;
      this.historyState = errCode(err) === "unknown_command" ? "unsupported" : "error";
    }
  }

  /** Hear every save of this watch's config: a new `menus` revision is read
   * and merged into the draft; `catalog`, `pages` and `behavior` are read
   * again for the pickers. */
  private startSubscription(watchId: string): void {
    const hass = this.hass;
    this.endSubscription();
    if (!hass) return;
    const seq = ++this.subscribeSeq;
    subscribeWatchConfig(hass, watchId, (event) => {
      if (seq !== this.subscribeSeq) return;
      if (event.kind === "catalog") {
        if (watchCatalogEventIsNews(event, this.catalog)) void this.loadCatalog(watchId);
      } else if (event.kind === "pages") {
        void this.loadPages(watchId);
      } else if (event.kind === "behavior") {
        void this.loadBehavior(watchId);
      } else if (event.kind === "menus") {
        if (event.revision !== (this.record?.revision ?? 0)) void this.load(watchId, true);
      }
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
      const fresh = await fetchWatchConfig(hass, watchId, "menus");
      if (watchId !== this.watchId || this.record !== shown) return;
      if (fresh.revision === shown.revision) {
        this.record = {
          ...shown,
          delivered_revision: fresh.delivered_revision,
          delivered_at: fresh.delivered_at,
          rejected_revision: fresh.rejected_revision,
          rejected_at: fresh.rejected_at,
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

  private edit(change: (document: MenusDocument) => MenusDocument, coalesce?: string): boolean {
    const draft = this.draft;
    if (!draft || this.saving) return false;
    const changed = draft.apply(change(draft.document), this.scrubKey ?? coalesce);
    // A refused edit draws too, so a field that shows its own new value (a
    // select) goes back to the document's.
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

  private targets(): MenuTargets {
    return {
      pages: this.pages,
      statusPages: this.catalog?.statusPages ?? [],
      httpActions: this.catalog?.httpActions ?? [],
    };
  }

  /** The open watch's screen in points, as the page editor finds it: the
   * size the watch reported, else the 46 mm reference. */
  private screen(): MenusScreen {
    const owner = this.watches.find((w) => w.owner_watch_id === this.watchId);
    return (caseForScreenSize(owner?.screen_size) ?? REFERENCE_CASE).screen;
  }

  private viewHost(): MenusViewHost | undefined {
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
      scale: menusPreviewScale(this.hostWidth, this.narrow),
      switcherPages: this.switcherPages,
      get document() { return draft.document; },
      get targets() { return self.targets(); },
      get catalogKnown() { return self.catalog !== undefined; },
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
    if (!hass || watchId === undefined || !draft || !draft.dirty || draft.saving) return;
    this.note = undefined;
    const running = saveWatchMenusDraft(draft, {
      prepare: scrubWatchMenuOrphanTriggers,
      save: (base, document) => saveWatchConfig(hass, watchId, "menus", base, document).catch((err: unknown) => {
        throw flatError(err);
      }),
      fetch: async () => {
        const record = await fetchWatchConfig(hass, watchId, "menus").catch((err: unknown) => {
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
    if (watchId === this.watchId) this.note = watchMenusSaveNote(result);
    this.saveEnded(watchId);
  }

  /** "Start with the defaults": create the record from the app's default
   * menus. */
  private async startWithDefaults(): Promise<void> {
    const hass = this.hass;
    const watchId = this.watchId;
    if (!hass || watchId === undefined || this.starting) return;
    this.starting = true;
    this.note = undefined;
    const result = await startWatchMenus((base, document) => saveWatchConfig(hass, watchId, "menus", base, document));
    this.starting = false;
    if (watchId !== this.watchId) return;
    if (result.ok) {
      this.note = { kind: "ok", text: `Started with the defaults, saved as revision ${result.revision}. The watch picks them up the next time it checks.` };
    } else if (result.code === "no_record") {
      this.note = { kind: "warn", text: `${WATCH_MENUS_PAIR_FIRST_TEXT} Watch settings has Pair a watch.` };
      return;
    } else if (result.code === "conflict") {
      this.note = { kind: "warn", text: "The iPhone sent menus meanwhile, so those are shown." };
    } else if (result.code === "unsupported") {
      this.unsupported = true;
      return;
    } else {
      this.note = { kind: "err", text: `Could not start: ${result.message}` };
      return;
    }
    void this.load(watchId, true);
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
    fetchWatchConfigHistoryEntry(hass, watchId, "menus", entry.revision).then(
      (reply) => {
        if (this.restoreAsk === ask) this.restoreAsk = { ...ask, summary: watchMenusSummary(reply.document) };
      },
      () => undefined,
    );
  }

  private async restore(): Promise<void> {
    const hass = this.hass;
    const watchId = this.watchId;
    const ask = this.restoreAsk;
    if (!hass || watchId === undefined || ask === undefined || this.restoring) return;
    this.restoring = true;
    let note: Note;
    try {
      const reply = await restoreWatchConfig(hass, watchId, "menus", ask.entry.revision, ask.baseRevision);
      note = { kind: "ok", text: `Revision ${ask.entry.revision} is back, saved as revision ${reply.revision}.` };
      if (watchId === this.watchId) this.restartDraft = { watchId, revision: reply.revision };
      else if (!(keptWatchMenusDraft(watchId)?.dirty ?? false)) forgetWatchMenusDraft(watchId);
    } catch (err) {
      const code = errCode(err);
      if (code === "conflict") note = { kind: "warn", text: "Not restored. The menus changed somewhere else, so the newest copy is shown." };
      else if (code === "no_record") note = { kind: "warn", text: "Not restored. Home Assistant no longer holds menus for this watch." };
      else if (code === "not_found") note = { kind: "warn", text: "Not restored. That save is no longer kept." };
      else if (code === "unknown_command") {
        this.historyState = "unsupported";
        note = { kind: "warn", text: "This version of the integration cannot restore menus. Update it to restore an earlier save." };
      } else note = { kind: "err", text: `Could not restore: ${errText(err)}` };
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
    if (!path.includes(this) && !nothingFocused()) return;
    if (this.renderRoot.querySelector("dialog[open]")) return;
    const mod = e.metaKey || e.ctrlKey;
    const key = e.key.toLowerCase();
    if (mod && !e.altKey && key === "s") {
      e.preventDefault();
      void this.save();
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
    }
  };

  // ── drawing ────────────────────────────────────────────────────────────

  override render(): TemplateResult {
    const watches = this.watches;
    const only = watches.length === 1 ? watches[0] : undefined;
    const draft = this.draft;
    return html`
      <div class="pe-head">
        <div class="pe-title">
          <h2>Watch menus</h2>
          <span>${only ? `${watchName(only, watches)}. ` : ""}The Anywhere menu, the Entity quick menu and the page switcher. A save reaches the watch the next time it checks, or through the iPhone.</span>
        </div>
        ${watches.length > 1 ? this.renderTabs(watches) : nothing}
      </div>
      ${draft && !this.unsupported ? this.renderToolbar(draft) : nothing}
      ${this.note ? html`<div class="pe-note ${this.note.kind}" role="status"><span>${this.note.text}</span>
        <button class="pe-link" @click=${() => { this.note = undefined; }}>Dismiss</button></div>` : nothing}
      ${this.renderBody(watches)}
      ${this.restoreAsk ? this.renderRestoreAsk(this.restoreAsk) : nothing}
    `;
  }

  private renderToolbar(draft: WatchMenusDraft): TemplateResult {
    const dirty = draft.dirty;
    const stateText = this.saving ? "Saving…" : dirty ? "Unsaved changes" : "";
    return html`<div class="pe-tools" role="toolbar" aria-label="Edits">
      <button class="pe-btn pe-icon-only" title=${`Undo (${MOD}Z)`} aria-label="Undo" ?disabled=${!draft.canUndo}
        @click=${() => this.undo()}>${uiIcon("undo")}</button>
      <button class="pe-btn pe-icon-only" title=${IS_MAC ? "Redo (⇧⌘Z)" : "Redo (Ctrl+Y)"} aria-label="Redo" ?disabled=${!draft.canRedo}
        @click=${() => this.redo()}>${uiIcon("redo")}</button>
      <span class="pe-state-text" aria-live="polite">${stateText}</span>
      <span class="pe-tools-gap"></span>
      <button class="pe-btn" title="Go back to the copy Home Assistant holds. Undo brings the edits back." ?disabled=${!dirty || this.saving}
        @click=${() => this.discard()}>Discard</button>
      <button class="pe-btn pe-primary" title=${`Save (${MOD}S)`} ?disabled=${!dirty || this.saving}
        @click=${() => void this.save()}>${this.saving ? "Saving…" : "Save"}</button>
    </div>`;
  }

  private renderTabs(watches: readonly OwnerSummary[]): TemplateResult {
    const people = peopleOf(this.owners.length > 0 ? this.owners : (this.ownList ?? []));
    return html`<div class="pe-tabs" role="tablist" aria-label="Watches">
      ${watches.map((w) => {
        const index = people.findIndex((p) => p.owners.some((o) => o.owner_watch_id === w.owner_watch_id));
        const color = personColorVar(index);
        const on = w.owner_watch_id === this.watchId;
        return html`<button type="button" role="tab" class="pe-tab ${on ? "on" : ""}" aria-selected=${on ? "true" : "false"}
          style=${color ? `--pe-person: ${color}` : nothing}
          @click=${() => { if (!on) this.openWatch(w.owner_watch_id); }}>
          <span class="pe-tab-glyph" aria-hidden="true">${uiIcon("watch")}</span>
          <span class="pe-tab-name">${watchName(w, watches)}</span>
        </button>`;
      })}
    </div>`;
  }

  private renderBody(watches: readonly OwnerSummary[]): TemplateResult {
    if (watches.length === 0) {
      const waiting = this.owners.length === 0 && this.ownList === undefined;
      return html`<div class="pe-empty">${waiting ? "Loading…" : "No watch has connected to this Home Assistant yet."}</div>`;
    }
    if (this.unsupported) return html`<div class="pe-empty"><b>${WATCH_MENUS_UPDATE_TEXT}</b></div>`;
    if (this.loading) return html`<div class="pe-empty">Loading…</div>`;
    if (this.loadError !== undefined) {
      const id = this.watchId;
      return html`<div class="pe-empty">
        <span>Could not read this watch's menus: ${this.loadError}</span>
        ${id === undefined ? nothing : html`<button class="pe-btn" @click=${() => void this.load(id)}>Try again</button>`}
      </div>`;
    }
    const record = this.record;
    if (record === undefined) return html`<div class="pe-empty">Loading…</div>`;
    const draft = this.draft;
    const host = this.viewHost();
    if (record.revision <= 0 || draft === undefined || host === undefined) {
      const kept = this.watchId === undefined ? undefined : keptWatchMenusDraft(this.watchId);
      const id = this.watchId;
      return html`<div class="pe-empty"><b>${WATCH_MENUS_NO_RECORD_TITLE}</b><span>${WATCH_MENUS_NO_RECORD_TEXT}</span>
        <button class="pe-btn pe-primary" ?disabled=${this.starting} @click=${() => void this.startWithDefaults()}>${this.starting ? "Starting…" : WATCH_MENUS_START_BUTTON}</button>
        <span class="pe-muted">${START_PHONE_FIRST_TEXT}</span>
        ${kept?.dirty && id !== undefined ? html`<span class="pe-warn">Your unsaved edits from before are kept. They come back, merged in, when menus are here again.</span>
          <button class="pe-btn" @click=${() => { forgetWatchMenusDraft(id); this.requestUpdate(); }}>Discard the kept edits</button>` : nothing}
      </div>`;
    }
    return html`<div class="me-grid">
      <div class="me-main">
        ${renderMenus(host)}
      </div>
      <aside class="pe-side">
        ${this.renderState(record, draft.document)}
        ${this.renderHistory(record, draft.dirty)}
      </aside>
    </div>`;
  }

  private renderState(record: WatchConfigRecord, document: MenusDocument): TemplateResult {
    const delivery = deliveryState(record);
    const rejected = rejectedNow(record);
    const budget = watchMenusBudget(document);
    const when = ago(record.updated_at);
    return html`<div class="pe-card pe-state">
      <h3>Stored copy</h3>
      <p><b>Revision ${record.revision}</b> · ${savedBy(record.updated_by)}${when ? ` ${when}` : ""}</p>
      ${rejected
        ? html`<p class="pe-pill err"><i aria-hidden="true"></i>The watch or the iPhone could not read this save</p>
          <p class="pe-muted">${this.historyState === "unsupported" ? "Change the menus and save them again." : "Restore an earlier save below."}</p>`
        : delivery === "delivered"
        ? html`<p class="pe-pill ok" title=${`Revision ${record.revision} has been collected.`}><i aria-hidden="true"></i>${COLLECTED_PILL_TEXT}</p>`
        : html`<p class="pe-pill warn"><i aria-hidden="true"></i>${WAITING_PILL_TEXT}</p>
          <p class="pe-muted">${WAITING_HELP_TEXT}</p>`}
      <p class=${budget.near ? "pe-warn" : "pe-muted"}>${kb(budget.size)} of the ${kb(budget.limit)} the watch takes${budget.near ? ". Close to the limit." : ""}</p>
    </div>`;
  }

  private renderHistory(record: WatchConfigRecord, dirty: boolean): TemplateResult | typeof nothing {
    if (this.historyState === "unsupported") return nothing;
    const entries = this.history;
    const rejected = rejectedNow(record);
    let body: TemplateResult;
    if (this.historyState === "loading") body = html`<p class="pe-muted">Loading…</p>`;
    else if (this.historyState === "error") {
      const id = this.watchId;
      body = html`<p class="pe-muted">Could not load the earlier saves.</p>
        ${id === undefined ? nothing : html`<button class="pe-btn" @click=${() => { this.historyState = "loading"; void this.loadHistory(id); }}>Try again</button>`}`;
    } else if (entries.length === 0) body = html`<p class="pe-muted">No earlier saves yet.</p>`;
    else {
      const offer = rejected ? entries.find((e) => e.revision < record.revision)?.revision : undefined;
      body = html`${dirty ? html`<p class="pe-muted">Save or discard your edits first.</p>` : nothing}
        <ul class="pe-history">
        ${entries.map((entry) => {
          const current = entry.revision === record.revision;
          const when = ago(entry.updated_at);
          return html`<li class=${entry.revision === offer ? "offer" : ""}>
            <span class="pe-h-text">
              <b>Revision ${entry.revision}</b>
              <span class="pe-muted">${savedBy(entry.updated_by)}${when ? ` ${when}` : ""} · ${kb(entry.size)}</span>
            </span>
            ${current
              ? html`<span class="pe-badge">Current</span>`
              : html`<button class="pe-btn ${entry.revision === offer ? "pe-primary" : ""}" ?disabled=${this.restoring || dirty}
                  title=${dirty ? "Save or discard your edits first." : nothing}
                  @click=${() => this.askRestore(entry)}>Restore</button>`}
          </li>`;
        })}
      </ul>`;
    }
    return html`<div class="pe-card pe-past" tabindex="-1"><h3>Earlier saves</h3>${body}</div>`;
  }

  private renderRestoreAsk(ask: RestoreAsk): TemplateResult {
    const record = this.record;
    const when = ago(ask.entry.updated_at);
    return html`<dialog class="pe-ask" aria-labelledby="me-ask-title"
      @cancel=${(e: Event) => { if (this.restoring) e.preventDefault(); }}
      @close=${() => { this.restoreAsk = undefined; }}>
      <h3 id="me-ask-title">Restore revision ${ask.entry.revision}?</h3>
      <p>${savedBy(ask.entry.updated_by)}${when ? ` ${when}` : ""}, ${kb(ask.entry.size)}.</p>
      ${ask.summary ? html`<p class="pe-muted">${ask.summary}</p>` : nothing}
      <p>It is saved again as a new revision${record ? `, after revision ${record.revision}` : ""}. The copy shown now stays in the earlier saves.</p>
      <div class="pe-ask-foot">
        <button class="pe-btn" ?disabled=${this.restoring} @click=${() => this.closeAsk()}>Cancel</button>
        <button class="pe-btn pe-primary" ?disabled=${this.restoring} @click=${() => void this.restore()}>${this.restoring ? "Restoring…" : "Restore"}</button>
      </div>
    </dialog>`;
  }

  static override styles = [formStyles, css`
    :host {
      display: block;
      flex: 1 1 auto;
      min-height: 0;
      overflow: auto;
      container-type: inline-size;
      padding: 16px;
      color: var(--wa-ink);
      background: var(--wa-bg);
      font-size: 14px;
    }
    * { box-sizing: border-box; }
    svg.ui-icon { width: 14px; height: 14px; display: block; flex: none; }
    h2, h3, h4, p { margin: 0; }
    h2 { font-size: 20px; font-weight: 650; }
    h3 { font-size: 13px; font-weight: 650; text-transform: uppercase; letter-spacing: .04em; color: var(--wa-muted); }
    code { font-family: monospace; font-size: 12px; overflow-wrap: anywhere; }
    .pe-muted { color: var(--wa-muted); font-size: 13px; }
    .pe-warn { color: var(--wa-amber); font-size: 13px; font-weight: 600; }

    .pe-head { display: flex; flex-wrap: wrap; align-items: flex-end; gap: 12px 24px; margin-bottom: 12px; }
    .pe-title { display: flex; flex-direction: column; gap: 4px; min-width: 0; flex: 1 1 280px; }
    .pe-title > span { color: var(--wa-muted); font-size: 13px; }

    .pe-tabs { display: flex; flex-wrap: wrap; gap: 6px; }
    .pe-tab {
      display: inline-flex; align-items: center; gap: 6px; min-height: 32px; padding: 0 12px;
      border: 1px solid var(--wa-line); border-radius: 999px; background: var(--wa-card);
      color: var(--wa-ink); font: inherit; font-size: 13px; cursor: pointer;
    }
    .pe-tab:hover { border-color: var(--wa-line-strong); }
    .pe-tab:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .pe-tab.on { background: var(--wa-sel-bg); border-color: var(--wa-sel-ring); font-weight: 600; }
    .pe-tab-glyph { color: var(--pe-person, var(--wa-muted)); }

    .pe-tools {
      display: flex; flex-wrap: wrap; align-items: center; gap: 6px; margin-bottom: 12px; padding: 8px 10px;
      border: 1px solid var(--wa-line); border-radius: var(--wa-r-md, 12px); background: var(--wa-card);
    }
    .pe-tools-gap { flex: 1; }
    .pe-state-text { margin-left: 6px; color: var(--wa-amber); font-size: 13px; font-weight: 600; }
    .pe-btn.pe-icon-only { display: inline-flex; align-items: center; justify-content: center; width: 32px; padding: 0; }
    .pe-btn.pe-icon-only svg.ui-icon { width: 16px; height: 16px; }

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

    .me-grid { display: grid; grid-template-columns: minmax(0, 1fr) minmax(240px, 300px); gap: 14px; align-items: start; }
    @container (max-width: 820px) { .me-grid { grid-template-columns: minmax(0, 1fr); } }
    .me-main { display: flex; flex-direction: column; gap: 14px; min-width: 0; }
    .pe-card {
      display: flex; flex-direction: column; gap: 8px; min-width: 0; padding: 14px;
      border: 1px solid var(--wa-line); border-radius: var(--wa-r-lg, 16px); background: var(--wa-card);
    }
    .pe-side { display: flex; flex-direction: column; gap: 14px; min-width: 0; }
    .pe-badge {
      display: inline-block; padding: 1px 7px; border-radius: 999px; font-size: 11px; font-weight: 600;
      color: var(--wa-muted); background: var(--wa-field); white-space: nowrap;
    }

    .pe-state p { font-size: 13px; }
    .pe-pill {
      display: inline-flex; align-items: center; gap: 7px; align-self: flex-start;
      padding: 3px 10px; border-radius: 999px; font-weight: 600;
    }
    .pe-pill > i { width: 8px; height: 8px; border-radius: 50%; background: currentColor; }
    .pe-pill.ok { color: var(--wa-green); background: color-mix(in srgb, var(--wa-green) 13%, transparent); }
    .pe-pill.warn { color: var(--wa-amber); background: var(--wa-amber-bg); }
    .pe-pill.err { color: var(--wa-need); background: color-mix(in srgb, var(--wa-need) 13%, transparent); }
    .pe-history { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; }
    .pe-history > li { display: flex; align-items: center; gap: 10px; padding: 8px 0; border-top: 1px solid var(--wa-line); }
    .pe-history > li:first-child { border-top: 0; }
    .pe-history > li.offer .pe-h-text > b { color: var(--wa-accent); }
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

    :host([narrow]) { padding: 12px; }
  `, watchFrameStyles, menuViewStyles];
}

if (!customElements.get("wa-menu-editor")) {
  customElements.define("wa-menu-editor", WaMenuEditor);
}

declare global {
  interface HTMLElementTagNameMap {
    "wa-menu-editor": WaMenuEditor;
  }
}
