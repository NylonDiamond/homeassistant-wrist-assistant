// `<wa-http-actions-editor>`: the home's HTTP action library as Home
// Assistant keeps it (`wrist_assistant/http_actions/*`), and an editor for
// it. One library for the whole home: the screen is handed no watch and
// follows none, and says so on its bar.
//
// It wears the complication editor's chrome (`editor-chrome.ts`) for its bar
// and its foot, and between them is laid out like a desktop HTTP client: the
// collection on the left (the actions and one Globals row) beside a drag
// gutter, and one main pane with the picked action's request over its
// response, or the Globals table. The views are `view.ts`.
//
// The host pattern of the Control Center editor
// (`watch-control-center/control-center-editor.ts`): the library read with
// `http_actions/get` and kept as raw JSON in a draft (`draft.ts`) with undo
// and redo, a save through `http_actions/save` that merges by action and by
// global when the library changed somewhere else, the leave guard, and the
// size budget. There is no history and no live line for the library; it is
// read again on every visit, on a reconnect, and every so often while a
// watch has still to collect a save.
//
// A home with no library yet (revision 0) can start one: "Add an action"
// makes a draft over the empty library, which the first save creates.
//
// The panel loads this module on its own, with one `import()`, when its route
// is `/http-actions` (`hook.ts`). Nothing it imports may import `icons.ts`.
//
// Plan: app repo docs/pages_in_home_assistant_step4.md ("4d batch 4 build
// contract", rules 10 and 11).

import { LitElement, css, html, nothing, type PropertyValues, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { type ColumnWidths, beginColumnDrag, clampColumnWidth, loadColumnWidths, saveColumnWidths } from "../column-split.js";
import { chromeTokens, columnStyles, inspectorStyles, leftCardStyles, rowListStyles, topBarStyles } from "../editor-chrome.js";
import { formStyles } from "../form-styles.js";
import { type HassLike, type HttpActionsRecord, type OwnerSummary, fetchHttpActions, fetchOwners, saveHttpActions, testHttpAction } from "../ha-api.js";
import type { IconProvider } from "../renderer.js";
import { agoWords } from "../send-state.js";
import { SymbolBrowser } from "../symbols.js";
import { uiIcon } from "../ui-icons.js";
import { NO_ICONS, memoIconNames, watchKeysTypeText } from "../watch-pages/editor-host.js";
import { type WatchPagesNote, watchCommandError } from "../watch-pages/save-note.js";
import { deviceKindOf } from "../version.js";
import { COLLECTED_PILL_TEXT, WAITING_PILL_TEXT, settingsWatches, watchName } from "../watch-settings.js";
import {
  type HttpActionsDraft,
  dropHttpActionsDraft,
  forgetHttpActionsDraft,
  httpActionsDirty,
  keptHttpActionsDraft,
  saveHttpActionsDraft,
  startHttpActionsDraft,
  takeHttpActionsRecord,
} from "./draft.js";
import { WATCH_HTTP_ACTIONS_HELP_URL, registerWatchHttpActionsDrafts } from "./hook.js";
import {
  HTTP_ACTIONS_ADD_BUTTON,
  HTTP_ACTIONS_CLIENT_CERT_TEXT,
  HTTP_ACTIONS_EMPTY_TITLE,
  HTTP_ACTIONS_PHONE_TEXT,
  HTTP_ACTIONS_SHARED_TEXT,
  HTTP_ACTIONS_UPDATE_TEXT,
  type HttpActionsDoc,
  asHttpActionsDoc,
  httpActionList,
  httpActionsBudget,
  httpActionsReadMeansUnsupported,
  newHttpId,
  tidyHttpActionsForSave,
} from "./model.js";
import { httpActionsKeptText, httpActionsSaveNote } from "./save-note.js";
import {
  type HttpActionsViewHost,
  addHttpActionTo,
  closeHttpLook,
  httpActionsViewStyles,
  renderHttpList,
  renderHttpMain,
} from "./view.js";

registerWatchHttpActionsDrafts({ dirty: httpActionsDirty, drop: dropHttpActionsDraft });

if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", (e: BeforeUnloadEvent) => {
    if (!httpActionsDirty()) return;
    e.preventDefault();
    e.returnValue = "";
  });
}

/** How often the screen asks whether every watch has collected a save. */
const DELIVERY_POLL_MS = 15_000;

const IS_MAC = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
const MOD = IS_MAC ? "⌘" : "Ctrl+";

/** The collection pane, widened by dragging the gutter beside it. The main
 * pane takes the rest and never goes below `middleMin`. Only `left` is read;
 * `right` is kept so a width saved before stays readable. */
const HA_COLUMNS = { min: 200, max: 520, middleMin: 520 } as const;
const HA_COLUMNS_DEFAULT: ColumnWidths = { left: 280, right: 0 };
export const HA_COLUMNS_KEY = "wrist-assistant-panel.http-actions.columns.v1";
const HA_GRID_CHROME = 8;
/** At or below this content width the panes stack. */
const HA_STACK_WIDTH = 760;

/** The collection pane's width fitted beside a main pane of `middleMin`. */
export function fitHttpListWidth(available: number, want: number): number {
  const width = clampColumnWidth(want, HA_COLUMNS);
  if (available <= 0) return width;
  return Math.max(HA_COLUMNS.min, Math.min(width, available - HA_COLUMNS.middleMin));
}

type Note = WatchPagesNote;

interface HassConnectionEvents {
  addEventListener?(type: "ready", listener: () => void): void;
  removeEventListener?(type: "ready", listener: () => void): void;
}

function kb(bytes: number): string {
  return bytes < 1000 ? `${bytes} bytes` : `${Number((bytes / 1000).toFixed(1))} KB`;
}

function ago(iso: string | null | undefined): string {
  const at = iso ? Date.parse(iso) : NaN;
  return Number.isNaN(at) ? "" : agoWords(Math.max(0, (Date.now() - at) / 1000));
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

/** Which watches have collected the revision Home Assistant holds, and which
 * have still to. Nothing at revision 0. */
export function httpActionsDelivery(record: Pick<HttpActionsRecord, "revision" | "delivered"> | undefined, watches: readonly OwnerSummary[]): { collected: string[]; waiting: string[] } {
  const collected: string[] = [];
  const waiting: string[] = [];
  if (record === undefined || record.revision <= 0) return { collected, waiting };
  for (const w of watches) {
    const got = record.delivered?.[w.owner_watch_id] ?? 0;
    (got >= record.revision ? collected : waiting).push(watchName(w, watches));
  }
  return { collected, waiting };
}

/** Who made the copy Home Assistant holds, for the foot line. */
export function httpActionsSavedBy(record: Pick<HttpActionsRecord, "updated_by">, owners: readonly OwnerSummary[]): string {
  if (record.updated_by === "panel") return "saved here";
  const owner = owners.find((o) => o.owner_watch_id === record.updated_by);
  return owner === undefined ? "handed over by a phone" : `handed over by ${owner.paired_iphone_name ?? owner.device_name ?? "a phone"}`;
}

/** Whether the home has a phone that could hand its actions over: an iPhone
 * of its own, or a watch paired to one. */
export function homeHasPhone(owners: readonly OwnerSummary[]): boolean {
  return owners.some((o) => !o.is_orphan && (deviceKindOf(o) === "iphone" || (o.paired_iphone_name ?? "") !== ""));
}

export class WaHttpActionsEditor extends LitElement {
  @property({ attribute: false }) hass?: HassLike;
  @property({ attribute: false }) owners: readonly OwnerSummary[] = [];
  @property({ type: Boolean, reflect: true }) narrow = false;
  @property({ attribute: false }) icons?: IconProvider;
  @property({ attribute: false }) iconsTick = 0;

  @state() private record?: HttpActionsRecord;
  /** The integration keeps no HTTP action library (too old for it). */
  @state() private unsupported = false;
  @state() private loading = false;
  @state() private loadError?: string;
  @state() private note?: Note;
  @state() private ownList?: readonly OwnerSummary[];
  @state() private topMenuOpen = false;
  @state() private columns: ColumnWidths = { ...HA_COLUMNS_DEFAULT };
  @state() private hostWidth = 0;
  private ownListAsked = false;
  private sizeObserver?: ResizeObserver;
  private observedTop?: HTMLElement;
  private topHeight = 0;
  private readonly symbols = new SymbolBrowser(() => this.requestUpdate());
  private readonly uiState = new Map<string, unknown>();
  private iconMemo?: { provider: IconProvider; tick: number; icons: IconProvider };
  private reloadPending = false;
  private followedSave?: Promise<unknown>;
  private loadSeq = 0;
  private pollTimer?: number;
  private readyConnection?: HassConnectionEvents;
  private askedOnce = false;

  private get allOwners(): readonly OwnerSummary[] {
    return this.owners.length > 0 ? this.owners : (this.ownList ?? []);
  }

  private get watches(): OwnerSummary[] {
    return settingsWatches(this.allOwners);
  }

  private get draft(): HttpActionsDraft | undefined {
    if (this.record === undefined || this.unsupported) return undefined;
    return keptHttpActionsDraft();
  }

  private get saving(): boolean {
    return this.draft?.saving ?? false;
  }

  private get dirty(): boolean {
    return this.draft?.dirty ?? false;
  }

  constructor() {
    super();
    this.addEventListener("focusout", () => this.draft?.endCoalesce());
  }

  override connectedCallback(): void {
    super.connectedCallback();
    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("pointerdown", this.onWindowPointerDown, true);
    this.columns = loadColumnWidths(HA_COLUMNS_KEY, HA_COLUMNS_DEFAULT, HA_COLUMNS);
    this.watchSize();
    this.listenForReconnect();
    if (this.askedOnce) void this.load(true);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    window.removeEventListener("keydown", this.onKeyDown);
    window.removeEventListener("pointerdown", this.onWindowPointerDown, true);
    this.sizeObserver?.disconnect();
    this.observedTop = undefined;
    this.stopListeningForReconnect();
    this.reloadPending = false;
    this.stopPolling();
    this.loadSeq++;
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
      if (!this.askedOnce) {
        this.askedOnce = true;
        void this.load();
      }
    }
    this.followSave();
  }

  protected override updated(): void {
    this.observeTop();
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
    if (this.isConnected) void this.load(true);
  };

  private followSave(): void {
    const done = keptHttpActionsDraft()?.saveDone;
    if (done === undefined || done === this.followedSave) return;
    this.followedSave = done;
    const ended = (): void => this.saveEnded();
    void done.then(ended, ended);
  }

  private saveEnded(): void {
    this.requestUpdate();
    if (!this.isConnected) return;
    this.reloadPending = false;
    void this.load(true);
  }

  // ── loading ────────────────────────────────────────────────────────────

  private async load(quiet = false): Promise<void> {
    const hass = this.hass;
    if (!hass) return;
    if (quiet && this.saving) {
      this.reloadPending = true;
      return;
    }
    const seq = ++this.loadSeq;
    this.stopPolling();
    if (!quiet) {
      this.loading = this.record === undefined;
      this.loadError = undefined;
    }
    try {
      const record = await fetchHttpActions(hass);
      if (seq !== this.loadSeq) return;
      if (this.saving) {
        this.reloadPending = true;
        return;
      }
      this.unsupported = false;
      this.show(record);
      this.loadError = undefined;
    } catch (err) {
      if (seq !== this.loadSeq) return;
      if (httpActionsReadMeansUnsupported(err)) {
        this.unsupported = true;
        this.loadError = undefined;
      } else if (!quiet || this.record === undefined) {
        this.loadError = watchCommandError(err).message;
      }
    }
    this.loading = false;
    if (!this.unsupported) this.pollIfWaiting();
  }

  private flushPending(): void {
    if (!this.reloadPending || this.saving) return;
    this.reloadPending = false;
    void this.load(true);
  }

  private show(record: HttpActionsRecord): void {
    this.record = record;
    const document = record.revision > 0 ? asHttpActionsDoc(record.document) : undefined;
    const taken = takeHttpActionsRecord(document, record.revision);
    if (taken.kept.length > 0) this.note = { kind: "warn", text: httpActionsKeptText(taken.kept) };
    else if (taken.mergedIntoEdits) this.note = { kind: "warn", text: "The HTTP actions changed somewhere else. Your edits are kept." };
    this.requestUpdate();
  }

  private pollIfWaiting(): void {
    this.stopPolling();
    if (!this.isConnected || httpActionsDelivery(this.record, this.watches).waiting.length === 0) return;
    this.pollTimer = window.setTimeout(() => {
      this.pollTimer = undefined;
      void this.load(true);
    }, DELIVERY_POLL_MS);
  }

  private stopPolling(): void {
    if (this.pollTimer !== undefined) window.clearTimeout(this.pollTimer);
    this.pollTimer = undefined;
  }

  // ── editing ────────────────────────────────────────────────────────────

  private edit(change: (document: HttpActionsDoc) => HttpActionsDoc, coalesce?: string): boolean {
    const draft = this.draft;
    if (!draft || this.saving) return false;
    const changed = draft.apply(change(draft.document), coalesce);
    // A refused edit draws too, so a field that shows its own new value (a
    // select) goes back to the document's.
    this.requestUpdate();
    return changed;
  }

  private memoIcons(): IconProvider {
    const provider = this.icons ?? NO_ICONS;
    const memo = this.iconMemo;
    if (memo !== undefined && memo.provider === provider && memo.tick === this.iconsTick) return memo.icons;
    const icons = memoIconNames(provider);
    this.iconMemo = { provider, tick: this.iconsTick, icons };
    return icons;
  }

  private viewHost(): HttpActionsViewHost | undefined {
    const draft = this.draft;
    const hass = this.hass;
    if (draft === undefined || hass === undefined) return undefined;
    const self = this;
    return {
      hass,
      icons: this.memoIcons(),
      symbols: this.symbols,
      uiState: this.uiState,
      get document() { return draft.document; },
      get busy() { return self.saving; },
      edit: (change, coalesce) => this.draft === draft && this.edit(change, coalesce),
      endCoalesce: () => draft.endCoalesce(),
      requestUpdate: () => this.requestUpdate(),
      test: (action, globals, values) => testHttpAction(hass, action, globals, values),
      newId: newHttpId,
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

  /** "Add an action" in a home with no library yet: a draft over the empty
   * library, with one action in it. */
  private startLibrary(): void {
    if (this.record === undefined || this.unsupported) return;
    startHttpActionsDraft();
    const host = this.viewHost();
    if (host !== undefined) addHttpActionTo(host);
    this.requestUpdate();
  }

  private async save(): Promise<void> {
    const hass = this.hass;
    const draft = this.draft;
    if (!hass || !draft || this.saving || !draft.dirty) return;
    this.note = undefined;
    // The phone's tidy on save, as its own undo step: nameless headers and
    // values no longer asked for go, in the actions changed here.
    draft.apply(tidyHttpActionsForSave(draft.document, draft.base));
    const running = saveHttpActionsDraft(draft, {
      save: (base, document) => saveHttpActions(hass, base, document).catch((err: unknown) => {
        throw flatError(err);
      }),
      fetch: async () => {
        const record = await fetchHttpActions(hass).catch((err: unknown) => {
          throw flatError(err);
        });
        return record.document === undefined ? { revision: record.revision } : { revision: record.revision, document: record.document };
      },
    });
    this.followedSave = draft.saveDone;
    this.requestUpdate();
    const result = await running.catch((err: unknown) => {
      const { code, message } = watchCommandError(err);
      return { ok: false, revision: draft.revision, merged: false, code: code ?? "unknown", message };
    });
    this.saveEnded();
    this.note = httpActionsSaveNote(result);
    this.flushPending();
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
    if (e.key === "Escape" && this.topMenuOpen) {
      e.preventDefault();
      this.topMenuOpen = false;
      return;
    }
    if (e.key === "Escape" && closeHttpLook(this.lookHost())) {
      e.preventDefault();
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

  private onWindowPointerDown = (e: PointerEvent): void => {
    const path = e.composedPath();
    const inside = (cls: string) => path.some((n) => n instanceof HTMLElement && n.classList.contains(cls));
    if (this.topMenuOpen && !inside("pe-top-menu")) this.topMenuOpen = false;
    // The icon and color popover closes on a press anywhere but in it or on
    // the button that opens it, which toggles it itself.
    if (!inside("ha-look")) closeHttpLook(this.lookHost());
  };

  private lookHost(): Pick<HttpActionsViewHost, "uiState" | "requestUpdate"> {
    return { uiState: this.uiState, requestUpdate: () => this.requestUpdate() };
  }

  // ── drawing ────────────────────────────────────────────────────────────

  override render(): TemplateResult {
    const draft = this.draft;
    return html`
      <div class="pe-top">
        ${this.renderTopBar(draft)}
        ${this.note ? html`<div class="pe-note ${this.note.kind}" role="status"><span>${this.note.text}</span>
          <button class="pe-link" @click=${() => { this.note = undefined; }}>Dismiss</button></div>` : nothing}
      </div>
      ${this.renderBody()}
    `;
  }

  private get stacked(): boolean {
    return this.narrow || (this.hostWidth > 0 && this.hostWidth <= HA_STACK_WIDTH);
  }

  private renderTopBar(draft: HttpActionsDraft | undefined): TemplateResult {
    const editing = draft !== undefined;
    const dirty = editing && this.dirty;
    return html`<div class="wa-bar ${this.stacked ? "stacked" : ""}" role="toolbar" aria-label="HTTP actions">
      <span class="ha-title"><b>HTTP actions</b><span class="ha-shared">${HTTP_ACTIONS_SHARED_TEXT}</span></span>
      <span class="spacer"></span>
      ${this.renderSyncPill()}
      ${editing ? html`<span class="side-menu pe-top-menu">
          <button class="tb-btn tb-more" aria-haspopup="menu" aria-expanded=${this.topMenuOpen ? "true" : "false"} aria-label="More actions" title="More"
            @click=${() => { this.topMenuOpen = !this.topMenuOpen; }}>···</button>
          ${this.topMenuOpen ? html`<div class="pop-menu side-pop" role="menu" aria-label="More actions">
            <button class="row" role="menuitem" ?disabled=${!dirty || this.saving}
              title="Go back to the copy Home Assistant holds. Undo brings the edits back."
              @click=${() => { this.topMenuOpen = false; this.discard(); }}>Discard edits</button>
          </div>` : nothing}
        </span>
        <button class="cv-act icon undo" ?disabled=${!draft.canUndo} title=${`Undo (${MOD}Z)`} aria-label="Undo" @click=${() => this.undo()}>${uiIcon("undo")}</button>
        <button class="cv-act icon undo" ?disabled=${!draft.canRedo} title=${IS_MAC ? "Redo (⇧⌘Z)" : "Redo (Ctrl+Y)"} aria-label="Redo" @click=${() => this.redo()}>${uiIcon("redo")}</button>
        <button class="primary save ${dirty ? "dirty" : ""}" ?disabled=${!dirty || this.saving}
          title=${dirty ? `Save (${MOD}S). A save reaches every watch the next time it checks.` : `Nothing to save (${MOD}S)`}
          @click=${() => void this.save()}>${this.saving ? "Saving…" : "Save"}</button>
        <span class="tb-saved" title=${dirty ? "Unsaved changes" : ""}>${this.savedText()}</span>` : nothing}
      <button class="help" title="Help: HTTP actions" aria-label="Help"
        @click=${() => window.open(WATCH_HTTP_ACTIONS_HELP_URL, "_blank", "noopener")}>?</button>
    </div>`;
  }

  private savedText(): string {
    const record = this.record;
    if (record === undefined || record.revision <= 0) return "";
    const when = ago(record.updated_at);
    return when ? `Saved ${when}` : "Saved";
  }

  private renderSyncPill(): TemplateResult | typeof nothing {
    const record = this.record;
    if (record === undefined || record.revision <= 0 || this.unsupported) return nothing;
    const { collected, waiting } = httpActionsDelivery(record, this.watches);
    if (collected.length === 0 && waiting.length === 0) return nothing;
    const title = [waiting.length > 0 ? `Waiting: ${waiting.join(", ")}.` : "", collected.length > 0 ? `Collected: ${collected.join(", ")}.` : ""].filter((s) => s !== "").join(" ");
    return html`<span class="tb-sync ${waiting.length === 0 ? "ok" : "warn"}" title=${title}>
      <i class="tb-dot" aria-hidden="true"></i><span class="tb-sync-l">${waiting.length === 0 ? COLLECTED_PILL_TEXT : WAITING_PILL_TEXT}</span>
    </span>`;
  }

  // ── the panes ──────────────────────────────────────────────────────────

  private listWidth(): number {
    if (this.hostWidth > 0 && this.hostWidth <= HA_STACK_WIDTH) return this.columns.left;
    return fitHttpListWidth(this.hostWidth - HA_GRID_CHROME, this.columns.left);
  }

  private renderGutter(): TemplateResult {
    return html`<div class="gutter left" role="separator" aria-orientation="vertical" aria-label="Resize the list"
      title="Drag to resize. Double-click to reset."
      @pointerdown=${(e: PointerEvent) => {
        beginColumnDrag(e, {
          side: "left",
          base: this.listWidth(),
          limits: HA_COLUMNS,
          onWidth: (width) => { this.columns = { ...this.columns, left: width }; },
          onEnd: () => saveColumnWidths(HA_COLUMNS_KEY, this.columns),
        });
      }}
      @dblclick=${() => {
        this.columns = { ...this.columns, left: HA_COLUMNS_DEFAULT.left };
        saveColumnWidths(HA_COLUMNS_KEY, this.columns);
      }}></div>`;
  }

  private renderBody(): TemplateResult {
    if (this.unsupported) return html`<div class="ha-calm"><div class="pe-empty"><b>${HTTP_ACTIONS_UPDATE_TEXT}</b></div></div>`;
    if (this.loadError !== undefined) {
      return html`<div class="ha-calm"><div class="pe-empty">
        <span>Could not read the HTTP actions: ${this.loadError}</span>
        <button class="pe-btn" @click=${() => void this.load()}>Try again</button>
      </div></div>`;
    }
    const record = this.record;
    if (this.loading || record === undefined) return html`<div class="ha-calm"><div class="pe-empty">Loading…</div></div>`;
    const draft = this.draft;
    const host = this.viewHost();
    if (draft === undefined || host === undefined) {
      return html`<div class="ha-calm"><div class="pe-empty ha-empty"><b>${HTTP_ACTIONS_EMPTY_TITLE}</b>
        <span>An HTTP action is a web request a watch asks Home Assistant to send. ${HTTP_ACTIONS_SHARED_TEXT}</span>
        <span class="ha-start"><button class="pe-btn pe-primary" @click=${() => this.startLibrary()}>${uiIcon("plus")}<span>${HTTP_ACTIONS_ADD_BUTTON}</span></button></span>
        ${homeHasPhone(this.allOwners) ? html`<span class="pe-muted">${HTTP_ACTIONS_PHONE_TEXT}</span>` : nothing}
      </div></div>`;
    }
    const certs = httpActionList(draft.document).filter((a) => a.presentsClientCertificate === true).length;
    return html`${certs === 0 ? nothing : html`<p class="ha-cert-line">${certs === 1 ? "An action asks" : `${certs} actions ask`} for a client certificate. ${HTTP_ACTIONS_CLIENT_CERT_TEXT}</p>`}
    <div class="layout pe-layout ha-two ${this.stacked ? "cols-1" : ""}" style=${`--wa-left:${this.listWidth()}px`}>
      <div class="column left">
        ${renderHttpList(host)}
      </div>
      ${this.renderGutter()}
      <div class="column card ha-main">
        ${renderHttpMain(host)}
      </div>
    </div>
    ${this.renderFoot(record, draft)}`;
  }

  private renderFoot(record: HttpActionsRecord, draft: HttpActionsDraft): TemplateResult {
    const budget = httpActionsBudget(draft.document);
    const when = ago(record.updated_at);
    const stored = record.revision <= 0
      ? "Not saved yet. The first save makes the library."
      : `Revision ${record.revision} · ${httpActionsSavedBy(record, this.allOwners)}${when ? ` ${when}` : ""}`;
    const { waiting } = httpActionsDelivery(record, this.watches);
    return html`<div class="ha-foot" role="status">
      <i class="ha-foot-dot ${record.revision <= 0 ? "" : waiting.length === 0 ? "ok" : "warn"}" aria-hidden="true"></i>
      <span>${stored}</span>
      ${waiting.length === 0 ? nothing : html`<span class="pe-muted" data-devices-pop>Waiting for ${waiting.join(", ")}.</span>`}
      <span class="spacer"></span>
      <span class="pe-muted ${budget.near ? "ha-near" : ""}">${kb(budget.size)} of ${kb(budget.limit)}</span>
    </div>`;
  }

  static override styles = [formStyles, chromeTokens, topBarStyles, columnStyles, leftCardStyles, rowListStyles, inspectorStyles, css`
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
    .ha-title { display: inline-flex; align-items: baseline; gap: 10px; min-width: 0; padding-left: 4px; }
    .ha-title b { font-size: 11px; font-weight: 500; letter-spacing: .08em; text-transform: uppercase; color: var(--wa-muted); white-space: nowrap; }
    .ha-shared { font-size: 13px; color: var(--wa-ink); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .pe-muted { color: var(--wa-muted); font-size: 13px; }
    .wa-bar button.tb-btn:disabled, .wa-bar button.primary.save:disabled { opacity: .45; cursor: default; }
    .wa-bar .pop-menu .row:disabled { opacity: .5; cursor: default; }
    .wa-bar .pop-menu .row:disabled:hover { background: transparent; }
    .wa-bar button.cv-act {
      display: inline-grid; place-items: center; width: 30px; height: 30px; padding: 0; border-radius: 6px;
      border: 1px solid var(--wa-line-strong); background: transparent; color: var(--wa-ink); cursor: pointer;
    }
    .wa-bar button.cv-act:disabled { opacity: .4; cursor: default; }
    .wa-bar button.cv-act:hover:not(:disabled) { background: var(--wa-hover); }
    .wa-bar .tb-saved { font-size: 12px; color: var(--wa-muted); white-space: nowrap; }
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
    /* A screen with nothing to edit yet: one calm card in the middle. */
    .ha-calm { flex: 1 1 auto; min-height: 280px; display: flex; align-items: center; justify-content: center; padding: 24px 0; }
    .pe-empty {
      display: flex; flex-direction: column; align-items: center; text-align: center; gap: 10px; max-width: 520px;
      padding: 28px 24px; border: 1px solid var(--wa-line); border-radius: var(--wa-r-lg, 16px); background: var(--wa-card);
    }
    .pe-empty > b { font-size: 15px; }
    .ha-start { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; }
    .ha-cert-line {
      flex: none; margin: 0 0 10px; padding: 8px 12px; font-size: 13px;
      border: 1px solid var(--wa-amber-line); border-radius: var(--wa-r-md, 12px);
    }
    /* Two panes, as a desktop HTTP client lays itself out: the collection
       on the left and the request over its response on the right, together
       exactly as tall as the screen leaves them, each scrolling inside. */
    .layout.pe-layout.ha-two {
      grid-template-columns: var(--wa-left, 260px) 8px minmax(0, 1fr);
      flex: 1 1 0; min-height: 460px; overflow: hidden; padding: 0; margin-bottom: 10px;
    }
    .ha-two > .column { min-width: 0; }
    .ha-two > .column.left { display: flex; flex-direction: column; min-height: 0; overflow: hidden; scrollbar-gutter: auto; }
    .ha-two > .column.ha-main {
      display: flex; flex-direction: column; min-height: 0; overflow: hidden; padding: 0; scrollbar-gutter: auto;
      border-radius: var(--wa-lc-r, 10px);
    }
    /* Stacked: the list first, then the main pane full width, and the page
       scrolls as one. */
    .layout.pe-layout.ha-two.cols-1 {
      grid-template-columns: minmax(0, 1fr); flex: none; min-height: auto; overflow: visible; row-gap: 10px;
    }
    .ha-two.cols-1 > .gutter { display: none; }
    .ha-two.cols-1 > .column { overflow: visible; }
    .layout.ha-two.cols-1 > .column.left { order: 1; }
    .layout.ha-two.cols-1 > .column.ha-main { order: 2; }
    .ha-two.cols-1 .ha-list-card { max-height: none; }
    .ha-two.cols-1 .ha-items { overflow: visible; }
    .ha-two.cols-1 .ha-req, .ha-two.cols-1 .ha-resp { flex: none; }
    .ha-two.cols-1 .ha-tabbody, .ha-two.cols-1 .ha-scroll { overflow: visible; }
    .ha-two.cols-1 .ha-resp-body { overflow: visible; }
    .ha-two.cols-1 pre.ha-snippet { max-height: 320px; overflow: auto; }
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
    .ha-foot {
      flex: none; display: flex; flex-wrap: wrap; align-items: center; gap: 6px 10px; padding: 8px 12px; font-size: 12.5px;
      border: 1px solid var(--wa-line); border-radius: var(--wa-r-md, 12px); background: var(--wa-card);
    }
    .ha-foot .spacer { flex: 1; }
    .ha-foot-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--wa-muted); flex: none; }
    .ha-foot-dot.ok { background: var(--wa-green); }
    .ha-foot-dot.warn { background: var(--wa-amber); }
    .ha-near { color: var(--wa-amber); }
    :host([narrow]) { --cf-pad: 12px; }
  `, httpActionsViewStyles];
}

function flatError(err: unknown): Error {
  const { code, message } = watchCommandError(err);
  return Object.assign(new Error(message), code === undefined ? {} : { code });
}

if (!customElements.get("wa-http-actions-editor")) {
  customElements.define("wa-http-actions-editor", WaHttpActionsEditor);
}

declare global {
  interface HTMLElementTagNameMap {
    "wa-http-actions-editor": WaHttpActionsEditor;
  }
}
