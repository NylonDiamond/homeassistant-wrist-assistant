// The Pages tab: every page on every watch and iPhone, one card each.
//
// A linked page is one card with a chip per device it is on (dimmed where
// that device hides it). Filter chips over the cards narrow them to one
// device. A card opens its page in that device's page editor, and its
// Devices menu puts the page on another device or takes it off one, the
// page editor's own menu (`devices-menu.ts`) with the same writes
// (`page-links-io.ts`). What can be worked out without the element is in
// `all-pages-model.ts`.
//
// Every device's pages are read when the tab opens, and a device's again
// whenever Home Assistant says its pages changed (`subscribeWatchConfig`).
// The panel loads this file the first time the tab opens
// (`all-pages-hook.ts`).
//
// Select (or Cmd/Ctrl+click on a card) picks several cards at once, and a bar
// at the foot then adds them to devices, takes them off devices or deletes
// them everywhere. Its rules and writes are `all-pages-bulk.ts`.

import { LitElement, css, html, nothing, type PropertyValues, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { live } from "lit/directives/live.js";
import { type HassLike, type OwnerSummary, fetchWatchConfig, fetchWatchPagesPlaces, linkWatchPages, subscribeWatchConfig } from "../ha-api.js";
import { phoneFrameStyles, phoneModelForScreenSize, phonePagesLayout, phonePagesScreen } from "../phone-frame.js";
import { type IconProvider, REFERENCE_CASE, caseForScreenSize } from "../renderer.js";
import { uiIcon } from "../ui-icons.js";
import { watchFrameStyles } from "../watch-frame.js";
import {
  ALL_FILTER,
  ALL_PAGES_LEAD,
  DEVICES_DIRTY_TEXT,
  type PageCard,
  type PageCopy,
  type PagesFilter,
  cardDetail,
  cardDevicePlaces,
  copyOn,
  emptyText,
  filterChips,
  linkSource,
  openCopy,
  pageCards,
  resolveFilter,
  shownCards,
} from "./all-pages-model.js";
import {
  type BulkResult,
  addPlan,
  bulkResultText,
  deleteAskText,
  deletePlan,
  keepPresent,
  rangeSelected,
  remapSelection,
  removePlan,
  runAdd,
  runDelete,
  runRemove,
  toggleSelected,
  withAll,
  withNone,
} from "./all-pages-bulk.js";
import { devicesMenuStyles, renderPageDevicesMenu } from "./devices-menu.js";
import { keepWatchPagesSelection, keptWatchPagesDraft } from "./kept.js";
import { type LinkDevice, type PageDevicePlace, linkAlsoAddedText, linkDevicesOf, linkErrorText } from "./links.js";
import { type WatchPagesDocument, asWatchPagesDocument, watchPageId, watchPagesOf } from "./model.js";
import { pagesBulkIO, takePageOff } from "./page-links-io.js";
import { renderWatchPagePreview, watchPagePreviewStyles } from "./preview.js";
import { type WatchPagesNote, watchCommandError } from "./save-note.js";

/** How tall a card's picture of its page is, in CSS pixels. */
const THUMB_H = 92;
/** How often a stream of state changes draws the pictures again. */
const STATES_EVERY_MS = 2000;
/** How long after a change event a device's pages are read again, so a
 * burst of saves reads once. */
const RELOAD_DELAY_MS = 250;

/** The filter this browser last used, kept while the panel is open. */
let keptFilter: PagesFilter | undefined;

/** The card a Devices menu is open on, named by one of its copies: a card's
 * key moves when its page is linked or unlinked. */
interface MenuAt {
  ownerId: string;
  pageId: string;
}

const sameId = (a: string, b: string): boolean => a.toUpperCase() === b.toUpperCase();

/** What the multi-select bar's open menu does. */
type BulkKind = "add" | "remove" | "delete";

/** Whether a device's page editor holds unsaved edits in this tab. */
const dirtyHere = (ownerId: string): boolean => keptWatchPagesDraft(ownerId)?.dirty ?? false;

export class WaAllPages extends LitElement {
  @property({ attribute: false }) owners: readonly OwnerSummary[] = [];
  @property({ attribute: false }) ownersReady = false;
  @property({ attribute: false }) phones = false;
  @property({ attribute: false }) icons?: IconProvider;
  @property({ attribute: false }) iconsTick = 0;
  @property({ attribute: false }) onOpen?: (ownerId: string, kind: "watch" | "iphone") => void;

  /** Each device's pages as last read; a device with none is missing. */
  @state() private docs: ReadonlyMap<string, WatchPagesDocument> = new Map();
  /** The devices whose pages could not be read last time. */
  @state() private failed: readonly string[] = [];
  @state() private readState: "idle" | "loading" | "ready" = "idle";
  /** False on an integration without linked pages: no Devices menus. */
  @state() private linksOn = true;
  @state() private filter: PagesFilter | undefined = keptFilter;
  @state() private search = "";
  @state() private menuAt?: MenuAt;
  @state() private linking = false;
  @state() private devicesNote?: WatchPagesNote;
  /** Select mode: a click picks a card instead of opening it. */
  @state() private selecting = false;
  /** The picked cards, by key. Only those shown count. */
  @state() private selected: ReadonlySet<string> = new Set();
  /** The bar's open menu, and the devices ticked in it. */
  @state() private bulkMenu?: BulkKind;
  @state() private bulkTicks: ReadonlySet<string> = new Set();
  /** The line while an action runs, and what the last one did. */
  @state() private bulkBusy?: string;
  @state() private bulkNote?: WatchPagesNote;

  private hassNow?: HassLike;
  /** The last card clicked in select mode, where a Shift+click run starts. */
  private anchor?: string;
  private hassDrawnAt = 0;
  private loadSeq = 0;
  private readSeq = new Map<string, number>();
  private reloadTimers = new Map<string, number>();
  /** The device ids read and listened to, as one string. */
  private deviceSig?: string;
  private unsubscribers: (() => Promise<void> | void)[] = [];
  private subscribeSeq = 0;
  private cardsMemo?: { docs: ReadonlyMap<string, WatchPagesDocument>; devices: readonly LinkDevice[]; cards: PageCard[] };

  /** Home Assistant. A new object on every state change: the pictures are
   * drawn again at most every couple of seconds for it. */
  get hass(): HassLike | undefined {
    return this.hassNow;
  }

  set hass(value: HassLike | undefined) {
    const first = this.hassNow === undefined;
    this.hassNow = value;
    const now = Date.now();
    if (first || now - this.hassDrawnAt >= STATES_EVERY_MS) {
      this.hassDrawnAt = now;
      this.requestUpdate();
    }
  }

  override connectedCallback(): void {
    super.connectedCallback();
    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("pointerdown", this.onWindowPointerDown, true);
    // Back on the tab: read everything again.
    this.deviceSig = undefined;
    this.requestUpdate();
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    window.removeEventListener("keydown", this.onKeyDown);
    window.removeEventListener("pointerdown", this.onWindowPointerDown, true);
    this.endSubscriptions();
    for (const timer of this.reloadTimers.values()) window.clearTimeout(timer);
    this.reloadTimers.clear();
    this.loadSeq++;
    this.deviceSig = undefined;
  }

  protected override willUpdate(_changed: PropertyValues): void {
    const devices = this.devices;
    const sig = devices.map((d) => d.ownerId).join(",");
    if (this.hassNow !== undefined && this.isConnected && sig !== this.deviceSig) {
      this.deviceSig = sig;
      void this.loadAll();
      this.startSubscriptions(devices);
    }
  }

  /** Every device a page can be on, the editor's list. */
  private get devices(): LinkDevice[] {
    return linkDevicesOf(this.owners, this.phones);
  }

  private get cards(): PageCard[] {
    const devices = this.devices;
    const memo = this.cardsMemo;
    if (memo !== undefined && memo.docs === this.docs && memo.devices.length === devices.length
      && memo.devices.every((d, i) => d.ownerId === devices[i]!.ownerId && d.name === devices[i]!.name)) return memo.cards;
    const cards = pageCards(devices, this.docs);
    this.cardsMemo = { docs: this.docs, devices, cards };
    return cards;
  }

  // ── reading ────────────────────────────────────────────────────────────

  /** Read every device's pages, and whether pages can be linked here. Only
   * the newest read lands. */
  private async loadAll(): Promise<void> {
    const hass = this.hassNow;
    if (!hass) return;
    const seq = ++this.loadSeq;
    const devices = this.devices;
    if (this.readState === "idle") this.readState = "loading";
    const links = fetchWatchPagesPlaces(hass).then(
      () => true,
      (err: unknown) => watchCommandError(err).code !== "unknown_command",
    );
    const reads = await Promise.all(devices.map((d) => this.readOne(hass, d.ownerId)));
    const linksOn = await links;
    if (seq !== this.loadSeq) return;
    const docs = new Map<string, WatchPagesDocument>();
    const failed: string[] = [];
    for (const [ownerId, read] of reads) {
      if (read === "failed") {
        failed.push(ownerId);
        const held = this.docs.get(ownerId);
        if (held !== undefined) docs.set(ownerId, held);
      } else if (read !== undefined) docs.set(ownerId, read);
    }
    this.docs = docs;
    this.failed = failed;
    this.linksOn = linksOn;
    this.readState = "ready";
  }

  private async readOne(hass: HassLike, ownerId: string): Promise<[string, WatchPagesDocument | undefined | "failed"]> {
    try {
      const record = await fetchWatchConfig(hass, ownerId, "pages");
      return [ownerId, record.revision > 0 ? asWatchPagesDocument(record.document) : undefined];
    } catch {
      return [ownerId, "failed"];
    }
  }

  /** Read one device's pages again, after a change there. */
  private reloadOne(ownerId: string): void {
    const timer = this.reloadTimers.get(ownerId);
    if (timer !== undefined) window.clearTimeout(timer);
    this.reloadTimers.set(ownerId, window.setTimeout(() => {
      this.reloadTimers.delete(ownerId);
      const hass = this.hassNow;
      if (!hass || !this.isConnected) return;
      const seq = (this.readSeq.get(ownerId) ?? 0) + 1;
      this.readSeq.set(ownerId, seq);
      const all = this.loadSeq;
      void this.readOne(hass, ownerId).then(([, read]) => {
        if (seq !== this.readSeq.get(ownerId) || all !== this.loadSeq || read === "failed") return;
        const docs = new Map(this.docs);
        if (read === undefined) docs.delete(ownerId);
        else docs.set(ownerId, read);
        this.docs = docs;
      });
    }, RELOAD_DELAY_MS));
  }

  /** Hear every save of each device's pages, whoever made it. */
  private startSubscriptions(devices: readonly LinkDevice[]): void {
    this.endSubscriptions();
    const hass = this.hassNow;
    if (!hass) return;
    const seq = this.subscribeSeq;
    for (const device of devices) {
      const ownerId = device.ownerId;
      subscribeWatchConfig(hass, ownerId, (event) => {
        if (seq === this.subscribeSeq && event.kind === "pages") this.reloadOne(ownerId);
      }).then(
        (unsubscribe) => {
          if (seq === this.subscribeSeq) this.unsubscribers.push(unsubscribe);
          else void Promise.resolve(unsubscribe()).catch(() => undefined);
        },
        () => {
          // No live line (an older integration): the tab reads again when
          // it is opened.
        },
      );
    }
  }

  private endSubscriptions(): void {
    this.subscribeSeq++;
    for (const unsubscribe of this.unsubscribers) void Promise.resolve(unsubscribe()).catch(() => undefined);
    this.unsubscribers = [];
  }

  // ── acting ─────────────────────────────────────────────────────────────

  private setFilter(filter: PagesFilter): void {
    this.filter = filter;
    keptFilter = filter;
    this.closeDevices();
    this.pruneSelected();
  }

  private setSearch(search: string): void {
    this.search = search;
    this.pruneSelected();
  }

  /** Open the page in its device's page editor, on that page. */
  private open(card: PageCard, filter: PagesFilter): void {
    const copy = openCopy(card, filter);
    keepWatchPagesSelection(copy.device.ownerId, { pageId: watchPageId(copy.page) });
    this.onOpen?.(copy.device.ownerId, copy.device.kind);
  }

  private cardOfMenu(cards: readonly PageCard[]): PageCard | undefined {
    const at = this.menuAt;
    if (at === undefined) return undefined;
    return cards.find((c) => {
      const copy = copyOn(c, at.ownerId);
      return copy !== undefined && sameId(watchPageId(copy.page), at.pageId);
    });
  }

  private openDevices(card: PageCard): void {
    const first = card.copies[0]!;
    this.menuAt = { ownerId: first.device.ownerId, pageId: watchPageId(first.page) };
    this.devicesNote = undefined;
    void this.updateComplete.then(() => {
      this.renderRoot.querySelector?.<HTMLElement>(".pe-dev-menu")?.scrollIntoView({ block: "nearest" });
    });
  }

  private closeDevices(): void {
    this.menuAt = undefined;
    this.devicesNote = undefined;
  }

  /** A switch flipped: put the page on that device, linked, or take it off
   * there. Then every device is read again, and the menu stays on the card
   * by a copy the change left in place. */
  private async toggle(card: PageCard, place: PageDevicePlace): Promise<void> {
    const hass = this.hassNow;
    if (!hass || this.linking || place.stuck !== undefined) return;
    const target = place.device.ownerId;
    const name = place.device.name;
    const pageId = card.pageId;
    let note: WatchPagesNote;
    this.linking = true;
    this.devicesNote = undefined;
    try {
      if (place.on) {
        const refusal = await takePageOff(hass, target, watchPageId(copyOn(card, target)!.page), name);
        note = refusal === undefined ? { kind: "ok", text: `Taken off ${name}.` } : { kind: "err", text: refusal };
      } else {
        const source = linkSource(card, (id) => keptWatchPagesDraft(id)?.dirty ?? false);
        if (source === undefined) {
          note = { kind: "warn", text: DEVICES_DIRTY_TEXT };
        } else {
          const sourcePage = watchPageId(copyOn(card, source)!.page);
          const reply = await linkWatchPages(hass, source, [sourcePage], [target]);
          const also = linkAlsoAddedText(reply, target, [sourcePage], this.docs.get(source));
          note = { kind: "ok", text: `Added to ${name}.${also === undefined ? "" : ` ${also}`}` };
        }
      }
    } catch (err) {
      note = { kind: "err", text: `Not added. ${linkErrorText(err)}` };
    } finally {
      this.linking = false;
    }
    const stays = place.on ? card.copies.find((c) => c.device.ownerId !== target) : card.copies[0];
    if (stays !== undefined && this.menuAt !== undefined) this.menuAt = { ownerId: stays.device.ownerId, pageId };
    this.devicesNote = note;
    await this.loadAll();
  }

  private onKeyDown = (e: KeyboardEvent): void => {
    if (e.key !== "Escape") return;
    if (this.bulkMenu !== undefined && this.bulkBusy === undefined) {
      e.preventDefault();
      this.closeBulkMenu();
    } else if (this.menuAt !== undefined) {
      e.preventDefault();
      this.closeDevices();
    } else if (this.selecting && this.bulkBusy === undefined) {
      e.preventDefault();
      this.endSelect();
    }
  };

  /** A press outside an open menu and its button closes it. */
  private onWindowPointerDown = (e: PointerEvent): void => {
    if (this.menuAt === undefined && (this.bulkMenu === undefined || this.bulkBusy !== undefined)) return;
    const path = e.composedPath();
    const within = (...names: string[]) => path.some((el) => el instanceof Element && names.some((n) => el.classList.contains(n)));
    if (this.menuAt !== undefined && !within("pe-dev-menu", "ap-dev-open")) this.closeDevices();
    if (this.bulkMenu !== undefined && this.bulkBusy === undefined && !within("ap-bulk-menu", "ap-bar-open")) this.closeBulkMenu();
  };

  // ── picking ────────────────────────────────────────────────────────────

  /** The cards shown now, under the filter and the search. */
  private shownNow(): PageCard[] {
    return shownCards(this.cards, resolveFilter(this.filter, this.devices), this.search);
  }

  /** The picked cards among those shown, in the order shown. */
  private pickedCards(): PageCard[] {
    return this.shownNow().filter((c) => this.selected.has(c.key));
  }

  /** Unpick the cards a filter or a search hides. */
  private pruneSelected(): void {
    if (this.selected.size === 0) return;
    this.selected = keepPresent(this.selected, this.shownNow().map((c) => c.key));
  }

  private startSelect(): void {
    this.selecting = true;
    this.closeDevices();
    this.bulkNote = undefined;
  }

  private endSelect(): void {
    if (this.bulkBusy !== undefined) return;
    this.selecting = false;
    this.selected = new Set();
    this.anchor = undefined;
    this.bulkMenu = undefined;
    this.bulkNote = undefined;
  }

  /**
   * A click on a card. Outside select mode it opens the page, unless
   * Cmd/Ctrl is held: that picks it and starts select mode. In select mode
   * it picks or unpicks the card, and Shift+click picks every card from the
   * last one clicked.
   */
  private cardClick(e: MouseEvent, card: PageCard, filter: PagesFilter): void {
    const toggle = e.metaKey || e.ctrlKey;
    if (!this.selecting && !toggle) {
      this.open(card, filter);
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    this.pick(card, e.shiftKey && this.selecting && !toggle);
  }

  private pick(card: PageCard, range: boolean): void {
    if (this.bulkBusy !== undefined) return;
    if (!this.selecting) this.startSelect();
    this.selected = range
      ? rangeSelected(this.selected, this.shownNow().map((c) => c.key), this.anchor, card.key)
      : toggleSelected(this.selected, card.key);
    this.anchor = card.key;
    this.bulkNote = undefined;
    if (this.selected.size === 0) this.bulkMenu = undefined;
  }

  private selectShown(all: boolean): void {
    if (this.bulkBusy !== undefined) return;
    const keys = this.shownNow().map((c) => c.key);
    this.selected = all ? withAll(this.selected, keys) : withNone(this.selected, keys);
    this.bulkNote = undefined;
    if (this.selected.size === 0) this.bulkMenu = undefined;
  }

  // ── the bar's actions ──────────────────────────────────────────────────

  private openBulkMenu(kind: BulkKind): void {
    if (this.bulkBusy !== undefined) return;
    if (this.bulkMenu === kind) {
      this.closeBulkMenu();
      return;
    }
    this.bulkMenu = kind;
    this.bulkTicks = new Set();
    this.bulkNote = undefined;
    void this.updateComplete.then(() => {
      const menu = this.renderRoot.querySelector?.<HTMLElement>(".ap-bulk-menu");
      menu?.querySelector<HTMLElement>(kind === "delete" ? ".ap-bulk-cancel" : "input:not(:disabled)")?.focus();
    });
  }

  private closeBulkMenu(): void {
    this.bulkMenu = undefined;
    this.bulkTicks = new Set();
  }

  private tickDevice(ownerId: string, on: boolean): void {
    const next = new Set(this.bulkTicks);
    if (on) next.add(ownerId);
    else next.delete(ownerId);
    this.bulkTicks = next;
  }

  /**
   * Run the open menu's action on the picked cards, one device at a time,
   * then read every device again and say in one line what happened. The
   * cards stay picked where their pages are still there.
   */
  private async runBulk(kind: BulkKind): Promise<void> {
    const hass = this.hassNow;
    if (!hass || this.bulkBusy !== undefined) return;
    const devices = this.devices;
    const picked = this.pickedCards();
    if (picked.length === 0) return;
    const targets = devices.map((d) => d.ownerId).filter((id) => this.bulkTicks.has(id));
    if (kind !== "delete" && targets.length === 0) return;
    const io = pagesBulkIO(hass);
    const step = (text: string) => { this.bulkBusy = text; };
    this.bulkMenu = undefined;
    this.bulkTicks = new Set();
    this.bulkNote = undefined;
    this.bulkBusy = "Working…";
    let note: WatchPagesNote;
    try {
      let result: BulkResult;
      if (kind === "add") result = await runAdd(io, addPlan(picked, targets, this.docs, dirtyHere), devices, step);
      else if (kind === "remove") result = await runRemove(io, removePlan(picked, targets, dirtyHere), devices, step);
      else result = await runDelete(io, deletePlan(picked, devices, dirtyHere), devices, step);
      note = bulkResultText(result, devices);
    } catch (err) {
      note = { kind: "err", text: watchCommandError(err).message };
    }
    this.bulkBusy = "Reading the pages again…";
    try {
      await this.loadAll();
    } finally {
      this.bulkBusy = undefined;
    }
    this.selected = keepPresent(remapSelection(picked, this.cards), this.shownNow().map((c) => c.key));
    this.anchor = undefined;
    this.bulkNote = note;
  }

  // ── drawing ────────────────────────────────────────────────────────────

  protected override render(): TemplateResult {
    const devices = this.devices;
    if (devices.length === 0 && !this.ownersReady) return html`<div class="ap-page"><div class="ap-wrap"><p class="ap-empty">Loading…</p></div></div>`;
    const cards = this.cards;
    const filter = resolveFilter(this.filter, devices);
    const shown = shownCards(cards, filter, this.search);
    const device = devices.find((d) => d.ownerId === filter);
    const loading = this.readState !== "ready" && cards.length === 0;
    const failed = this.failed.map((id) => devices.find((d) => d.ownerId === id)?.name).filter((n): n is string => n !== undefined);
    const picked = shown.filter((c) => this.selected.has(c.key));
    const busy = this.bulkBusy !== undefined;
    const note = this.selecting
      ? "Click pages to pick them. Shift+click picks every page between two."
      : `Click a page to edit it.${this.linksOn && devices.length > 1 ? " Devices puts it on another watch or iPhone." : ""}`;
    return html`<div class="ap-page"><div class="ap-wrap">
      <div class="ap-head">
        <div class="ap-head-text">
          <h1>Pages</h1>
          <p class="ap-lead">${ALL_PAGES_LEAD}</p>
        </div>
        ${cards.length > 0 ? html`<div class="ap-tools">
          <label class="ap-search">${uiIcon("search")}
            <input type="search" class="ap-search-input" placeholder="Find a page" aria-label="Find a page by name"
              .value=${this.search} @input=${(e: InputEvent) => this.setSearch((e.target as HTMLInputElement).value)} /></label>
          ${this.selecting ? html`
            <button type="button" class="ap-btn" ?disabled=${busy || shown.length === 0} @click=${() => this.selectShown(true)}>Select all</button>
            <button type="button" class="ap-btn" ?disabled=${busy || picked.length === 0} @click=${() => this.selectShown(false)}>Select none</button>` : nothing}
          <button type="button" class="ap-btn ap-select ${this.selecting ? "on" : ""}" aria-pressed=${this.selecting ? "true" : "false"} ?disabled=${busy}
            title=${this.selecting ? "Stop picking pages" : "Pick several pages to add, remove or delete together"}
            @click=${() => (this.selecting ? this.endSelect() : this.startSelect())}>${this.selecting ? "Done" : "Select"}</button>
        </div>` : nothing}
      </div>
      ${devices.length > 1 ? this.renderChips(devices, cards, filter) : nothing}
      ${failed.length === 0 ? nothing : html`<p class="ap-warn" role="status">Could not read the pages of ${failed.join(", ")}. They show as last read.</p>`}
      <section class="ap-sec" aria-label=${device === undefined ? "Every page" : `Pages on ${device.name}`}>
        <div class="ap-sec-top">
          <span class="ap-sec-chip" aria-hidden="true">${uiIcon(device === undefined ? "pages" : device.kind === "iphone" ? "phone" : "watch")}</span>
          <span class="ap-sec-t">
            <h2>${device === undefined ? "Every page" : `On ${device.name}`}</h2>
            <span class="ap-sec-note">${note}</span>
          </span>
          <span class="ap-sec-count">${shown.length}</span>
        </div>
        ${loading ? html`<p class="ap-empty">Reading every device's pages…</p>`
          : shown.length === 0 ? html`<p class="ap-empty">${emptyText(filter, devices, this.search)}</p>`
          : html`<div class="ap-grid" role="list">${shown.map((card) => this.renderCard(card, filter, devices, cards))}</div>`}
      </section>
      ${this.selecting && (picked.length > 0 || busy || this.bulkNote !== undefined) ? this.renderBar(picked, devices) : nothing}
    </div></div>`;
  }

  /** All, then a chip per device with how many pages it holds. */
  private renderChips(devices: readonly LinkDevice[], cards: readonly PageCard[], filter: PagesFilter): TemplateResult {
    return html`<div class="ap-chips" role="group" aria-label="Show pages on">
      ${filterChips(devices, cards).map((chip) => html`<button type="button" class="ap-chip ${chip.id === filter ? "on" : ""}"
        aria-pressed=${chip.id === filter ? "true" : "false"}
        title=${chip.id === ALL_FILTER ? "Every page on every device" : `The pages on ${chip.label}`}
        @click=${() => this.setFilter(chip.id)}>
        ${chip.kind === undefined ? nothing : uiIcon(chip.kind === "iphone" ? "phone" : "watch")}
        <span>${chip.label}</span><span class="ap-chip-n">${chip.count}</span>
      </button>`)}
    </div>`;
  }

  private renderCard(card: PageCard, filter: PagesFilter, devices: readonly LinkDevice[], cards: readonly PageCard[]): TemplateResult {
    const copy = openCopy(card, filter);
    const selecting = this.selecting;
    const menuOpen = !selecting && this.cardOfMenu(cards)?.key === card.key;
    const devicesOn = !selecting && this.linksOn && devices.length > 1;
    const picked = selecting && this.selected.has(card.key);
    const title = selecting ? `${picked ? "Unpick" : "Pick"} ${card.name}` : `Edit ${card.name} on ${copy.device.name}`;
    const click = (e: MouseEvent) => this.cardClick(e, card, filter);
    return html`<div class="ap-card ${menuOpen ? "over" : ""} ${selecting ? "picking" : ""} ${picked ? "picked" : ""}" role="listitem" data-card=${card.key}
      @click=${(e: MouseEvent) => { if (selecting) click(e); }}>
      ${selecting ? html`<input type="checkbox" class="ap-pick" .checked=${live(picked)} ?disabled=${this.bulkBusy !== undefined}
        aria-label=${`Pick ${card.name}`}
        @click=${(e: MouseEvent) => {
          e.stopPropagation();
          this.pick(card, e.shiftKey);
        }} />` : nothing}
      <button type="button" class="ap-thumb" tabindex="-1" aria-hidden="true" title=${title} @click=${click}>
        ${this.renderThumb(copy)}
      </button>
      <div class="ap-body">
        <button type="button" class="ap-open" title=${title} tabindex=${selecting ? "-1" : "0"} @click=${click}>
          <b class="ap-name">${card.name}</b>
          <small class="ap-detail">${cardDetail(card)}</small>
        </button>
        <span class="ap-devs">${card.copies.map((c) => html`<span class="ap-dev ${c.hidden ? "dim" : ""}"
          title=${c.hidden ? `On ${c.device.name}, hidden there` : `On ${c.device.name}`}>
          ${uiIcon(c.device.kind === "iphone" ? "phone" : "watch")}<span class="ap-dev-n">${c.device.name}</span>${c.hidden ? html`<em>hidden</em>` : nothing}
        </span>`)}</span>
        ${devicesOn ? html`<button type="button" class="ap-dev-open ${menuOpen ? "on" : ""}" aria-expanded=${menuOpen ? "true" : "false"}
          title="Pick the devices this page is on"
          @click=${() => (menuOpen ? this.closeDevices() : this.openDevices(card))}>${uiIcon("phone")}<span>Devices</span>${uiIcon("chevron")}</button>` : nothing}
      </div>
      ${menuOpen ? this.renderMenu(card, devices) : nothing}
    </div>`;
  }

  private renderMenu(card: PageCard, devices: readonly LinkDevice[]): TemplateResult {
    const dirty = linkSource(card, (id) => keptWatchPagesDraft(id)?.dirty ?? false) === undefined;
    return renderPageDevicesMenu({
      name: card.name,
      places: cardDevicePlaces(devices, card),
      ...(dirty ? { blocked: DEVICES_DIRTY_TEXT } : {}),
      busy: this.linking,
      ...(this.devicesNote === undefined ? {} : { note: this.devicesNote }),
      className: "at-card",
      onToggle: (place) => void this.toggle(card, place),
      onDone: () => this.closeDevices(),
    });
  }

  /**
   * The bar at the foot while pages are picked: how many, the actions, and
   * a line on what is running or what the last action did. A menu opens
   * above it for the devices to add to or take off, or the delete question.
   */
  private renderBar(picked: readonly PageCard[], devices: readonly LinkDevice[]): TemplateResult {
    const busy = this.bulkBusy !== undefined;
    const none = picked.length === 0;
    const multi = devices.length > 1;
    const open = (kind: BulkKind, label: string, extra = "") => html`<button type="button" class="ap-btn ap-bar-open ${extra} ${this.bulkMenu === kind ? "on" : ""}"
      aria-expanded=${this.bulkMenu === kind ? "true" : "false"} ?disabled=${busy || none} @click=${() => this.openBulkMenu(kind)}>${label}</button>`;
    const line = this.bulkBusy ?? this.bulkNote?.text;
    return html`<div class="ap-bar" role="region" aria-label="Picked pages">
      <span class="ap-bar-n">${picked.length} selected</span>
      <span class="ap-bar-note ${busy ? "" : (this.bulkNote?.kind ?? "")}" role="status">${line ?? ""}</span>
      <span class="ap-bar-acts">
        ${multi && this.linksOn ? open("add", "Add to…") : nothing}
        ${multi ? open("remove", "Remove from…") : nothing}
        ${open("delete", "Delete…", "ap-danger")}
        <button type="button" class="ap-btn" ?disabled=${busy} @click=${() => this.endSelect()}>Cancel</button>
      </span>
      ${this.bulkMenu === undefined || none ? nothing : this.bulkMenu === "delete" ? this.renderDeleteMenu(picked, devices) : this.renderDevicesPick(this.bulkMenu, picked, devices)}
    </div>`;
  }

  /** Add to or Remove from: a box per device, then the button that runs it.
   * A device none of the picked pages could change is greyed. */
  private renderDevicesPick(kind: "add" | "remove", picked: readonly PageCard[], devices: readonly LinkDevice[]): TemplateResult {
    const add = kind === "add";
    const n = picked.length;
    const count = `${n} ${n === 1 ? "page" : "pages"}`;
    return html`<div class="pk-dup-menu ap-bulk-menu" role="group" aria-label=${add ? `Add ${count} to` : `Remove ${count} from`}>
      <div class="pk-dup-head">${add ? `Add ${count} to` : `Remove ${count} from`}</div>
      ${devices.map((device) => {
        const holds = picked.filter((c) => copyOn(c, device.ownerId) !== undefined).length;
        const dirty = dirtyHere(device.ownerId);
        const why = dirty ? "unsaved edits" : add ? (holds === n ? "has them all" : undefined) : (holds === 0 ? "has none" : undefined);
        const off = why !== undefined;
        const ticked = !off && this.bulkTicks.has(device.ownerId);
        return html`<div class="pk-dup-row check ${off ? "off" : ""}">
          <label class="pk-dup-pick" title=${dirty ? "Its pages have unsaved edits. Save or discard them first." : device.name}>
            <input type="checkbox" .checked=${live(ticked)} ?disabled=${off}
              @change=${(e: Event) => this.tickDevice(device.ownerId, (e.currentTarget as HTMLInputElement).checked)} />
            ${uiIcon(device.kind === "iphone" ? "phone" : "watch")}
            <span class="pk-dup-name">${device.name}</span>
            ${why === undefined ? (add ? nothing : html`<span class="pk-dup-full">${holds} of ${n}</span>`) : html`<span class="pk-dup-full">${why}</span>`}
          </label>
        </div>`;
      })}
      <div class="pk-dup-note">${add
        ? "They go on linked: an edit on one device shows on all of them."
        : "A page these would leave on no device stays. Use Delete for those."}</div>
      <div class="ap-bulk-foot">
        <button type="button" class="ap-btn ap-bulk-cancel" @click=${() => this.closeBulkMenu()}>Cancel</button>
        <button type="button" class="ap-btn ap-primary" ?disabled=${this.bulkTicks.size === 0}
          @click=${() => void this.runBulk(kind)}>${add ? "Add" : "Remove"}</button>
      </div>
    </div>`;
  }

  /** The delete question: how many pages, from which devices. */
  private renderDeleteMenu(picked: readonly PageCard[], devices: readonly LinkDevice[]): TemplateResult {
    const ask = deleteAskText(deletePlan(picked, devices, dirtyHere), devices);
    return html`<div class="pk-dup-menu ap-bulk-menu" role="alertdialog" aria-labelledby="ap-del-title" aria-describedby="ap-del-body">
      <div class="ap-bulk-title" id="ap-del-title">${ask.title}</div>
      <p class="ap-bulk-body" id="ap-del-body">${ask.body}</p>
      <div class="ap-bulk-foot">
        <button type="button" class="ap-btn ap-bulk-cancel" @click=${() => this.closeBulkMenu()}>Cancel</button>
        <button type="button" class="ap-btn ap-primary ap-danger" @click=${() => void this.runBulk("delete")}>Delete</button>
      </div>
    </div>`;
  }

  /** The page small, as its device draws it: a watch screen, or the iPhone
   * around its pages area. Cut at the picture's height. */
  private renderThumb(copy: PageCopy): TemplateResult {
    const owner = this.owners.find((o) => o.owner_watch_id === copy.device.ownerId);
    const doc = this.docs.get(copy.device.ownerId);
    const pages = doc === undefined ? [copy.page] : watchPagesOf(doc);
    const states = this.hassNow?.states;
    const icons = this.icons;
    if (copy.device.kind === "iphone") {
      const phone = phonePagesLayout(phoneModelForScreenSize(owner?.screen_size));
      const scale = THUMB_H / phone.model.screen.height;
      return html`<span class="ap-pic phone">${renderWatchPagePreview({
        page: copy.page, pages, screen: phonePagesScreen(phone), scale, phone,
        ...(states === undefined ? {} : { states }), ...(icons === undefined ? {} : { icons }),
      })}</span>`;
    }
    const screen = (caseForScreenSize(owner?.screen_size) ?? REFERENCE_CASE).screen;
    const scale = THUMB_H / screen.height;
    return html`<span class="ap-pic watch" style=${`--ap-screen-h:${Math.round(THUMB_H * 100) / 100}px`}>${renderWatchPagePreview({
      page: copy.page, pages, screen, scale,
      ...(states === undefined ? {} : { states }), ...(icons === undefined ? {} : { icons }),
    })}</span>`;
  }

  static override styles = [watchPagePreviewStyles, watchFrameStyles, phoneFrameStyles, devicesMenuStyles, css`
    :host { display: flex; flex-direction: column; flex: 1 1 auto; min-height: 0; color: var(--wa-ink); }
    * { box-sizing: border-box; }
    svg { display: block; }
    button { font: inherit; color: inherit; }
    .ap-page {
      flex: 1 1 auto; min-height: 0; overflow: auto;
      padding: 14px clamp(12px, 3vw, 28px) 40px;
      background: var(--wa-bg); color: var(--wa-ink);
    }
    .ap-wrap { width: min(1400px, 100%); margin: 0 auto; display: flex; flex-direction: column; gap: 12px; }
    /* The head, as the watch Complications screen's: the title and a line,
       and the search at the right. */
    .ap-head { display: flex; flex-wrap: wrap; align-items: flex-end; gap: 12px 16px; padding: 0 2px; }
    .ap-head-text { flex: 1 1 320px; min-width: 0; display: flex; flex-direction: column; gap: 6px; }
    .ap-head h1 { margin: 0; font-size: 19px; font-weight: 600; letter-spacing: -.02em; }
    .ap-lead { margin: 0; font-size: 13px; color: var(--wa-muted); max-width: 720px; }
    .ap-tools { display: flex; flex-wrap: wrap; align-items: center; justify-content: flex-end; gap: 6px; max-width: 100%; }
    .ap-btn {
      display: inline-flex; align-items: center; justify-content: center; gap: 6px; flex: none;
      height: 30px; padding: 0 12px; border-radius: 6px; cursor: pointer; white-space: nowrap;
      font: inherit; font-size: 13px; color: var(--wa-ink); background: var(--wa-card); border: 1px solid var(--wa-line-strong);
    }
    .ap-btn:hover:not(:disabled) { background: var(--wa-hover); }
    .ap-btn:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .ap-btn:disabled { opacity: .55; cursor: default; }
    .ap-btn.on { border-color: var(--wa-accent); background: var(--wa-sel-bg); color: var(--wa-accent); }
    .ap-btn.ap-primary { border-color: transparent; background: var(--wa-primary-bg); color: var(--wa-primary-ink); font-weight: 600; }
    .ap-btn.ap-primary:hover:not(:disabled) { background: var(--wa-primary-bg); filter: brightness(1.1); }
    .ap-btn.ap-danger { color: var(--wa-need); border-color: color-mix(in srgb, var(--wa-need) 55%, var(--wa-line-strong)); }
    .ap-btn.ap-danger.on { background: color-mix(in srgb, var(--wa-need) 10%, transparent); }
    .ap-btn.ap-primary.ap-danger { color: #fff; background: var(--wa-need); border-color: transparent; }
    .ap-search {
      display: flex; align-items: center; gap: 8px; flex: none; width: 240px; max-width: 100%;
      height: 30px; padding: 0 10px; border-radius: 6px; border: 1px solid var(--wa-line-strong); background: var(--wa-field, var(--wa-card));
    }
    .ap-search:focus-within { border-color: var(--wa-accent); box-shadow: var(--wa-ring); }
    .ap-search svg { width: 14px; height: 14px; flex: none; color: var(--wa-muted); }
    .ap-search-input { flex: 1; min-width: 0; font: inherit; font-size: 13px; color: var(--wa-ink); border: 0; background: transparent; outline: 0; padding: 0; }
    /* The filter: pills, the gallery's tags' look. */
    .ap-chips { display: flex; flex-wrap: wrap; gap: 6px; }
    .ap-chip {
      display: inline-flex; align-items: center; gap: 6px; font-size: 12.5px; font-weight: 500;
      padding: 5px 10px; border-radius: 999px; cursor: pointer; color: var(--wa-muted);
      border: 1px solid var(--wa-line); background: transparent; white-space: nowrap;
    }
    .ap-chip svg { width: 14px; height: 14px; }
    .ap-chip:hover { border-color: var(--wa-line-strong); color: var(--wa-ink); }
    .ap-chip:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .ap-chip.on { border-color: var(--wa-accent); color: var(--wa-ink); background: color-mix(in srgb, var(--wa-accent) 18%, transparent); }
    .ap-chip-n { font-size: 11.5px; color: var(--wa-muted); font-variant-numeric: tabular-nums; }
    .ap-warn { margin: 0; font-size: 12.5px; color: var(--wa-need); }
    /* The list is a card with a lit outline, as on the watch Complications
       screen, in the Pages door's green. */
    .ap-sec {
      --c: var(--wa-hue-green);
      display: flex; flex-direction: column; gap: 10px; padding: 0 12px 12px;
      border-radius: var(--wa-r-lg);
      background:
        linear-gradient(var(--wa-card), var(--wa-card)) padding-box,
        linear-gradient(140deg, var(--c) 0%, color-mix(in srgb, var(--c) 45%, transparent) 30%,
          color-mix(in srgb, var(--c) 30%, var(--wa-line-strong)) 62%, color-mix(in srgb, var(--c) 35%, transparent) 100%) border-box;
      border: 2px solid transparent;
    }
    .ap-sec-top {
      display: flex; align-items: center; gap: 12px; margin: 0 -12px; padding: 12px 14px;
      border-radius: calc(var(--wa-r-lg) - 2px) calc(var(--wa-r-lg) - 2px) 0 0;
      background: linear-gradient(90deg, color-mix(in srgb, var(--c) 16%, transparent), transparent 70%);
      border-bottom: 1px solid color-mix(in srgb, var(--c) 28%, var(--wa-line));
    }
    .ap-sec-chip {
      flex: none; display: grid; place-items: center; width: 32px; height: 32px; border-radius: 9px;
      color: var(--c); border: 1.5px solid var(--c); background: color-mix(in srgb, var(--c) 12%, transparent);
    }
    .ap-sec-chip svg { width: 17px; height: 17px; }
    .ap-sec-t { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
    .ap-sec-top h2 { margin: 0; font-size: 17px; font-weight: 600; letter-spacing: -.01em; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .ap-sec-note { font-size: 12.5px; color: var(--wa-muted); }
    .ap-sec-count {
      flex: none; min-width: 30px; padding: 3px 10px; border-radius: 999px; text-align: center;
      font-size: 14px; font-weight: 600; font-variant-numeric: tabular-nums;
      color: var(--c); border: 1px solid color-mix(in srgb, var(--c) 60%, transparent);
    }
    .ap-empty { margin: 0; padding: 18px 4px; font-size: 13px; color: var(--wa-muted); }
    /* The cards: as many columns as fit, each the picture and, beside it,
       the name, the devices and Devices. */
    .ap-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 8px; }
    .ap-card {
      position: relative; display: flex; gap: 10px; min-width: 0; padding: 8px;
      border: 1px solid var(--wa-line); border-radius: 10px; background: var(--wa-card);
    }
    .ap-card:hover, .ap-card.over { border-color: var(--wa-line-strong); }
    .ap-card.over { z-index: 5; }
    .ap-thumb {
      flex: none; display: grid; place-items: center; width: 84px; height: ${THUMB_H + 4}px; padding: 0; overflow: hidden;
      border: 0; border-radius: 8px; background: var(--wa-bg); cursor: pointer;
    }
    .ap-pic { display: block; line-height: 0; pointer-events: none; }
    /* A watch's screen alone, with its corners and no case, as Home's
       Pages door draws it. */
    .ap-pic.watch .wa-watch { padding: 0; margin: 0; background: none; box-shadow: 0 0 0 1px var(--wa-line-strong); border-radius: var(--wf-radius, 6px); }
    .ap-pic.watch .wa-watch::before, .ap-pic.watch .wa-watch::after { display: none; }
    .ap-pic.watch .wa-watch > .wp-screen { max-height: var(--ap-screen-h); }
    .ap-pic .wp-fold { display: none; }
    /* An iPhone in its case, without the side buttons. */
    .ap-pic.phone .wa-phone { margin: 0; box-shadow: 0 0 0 1px var(--wa-line-strong); }
    .ap-pic.phone .wa-phone::before, .ap-pic.phone .wa-phone::after { display: none; }
    .ap-body { flex: 1; min-width: 0; display: flex; flex-direction: column; align-items: flex-start; gap: 6px; }
    .ap-open {
      display: flex; flex-direction: column; align-items: flex-start; gap: 1px; max-width: 100%;
      padding: 0; border: 0; background: none; cursor: pointer; text-align: left;
    }
    .ap-open:focus-visible, .ap-thumb:focus-visible { outline: none; box-shadow: var(--wa-ring); border-radius: 6px; }
    .ap-name { max-width: 100%; font-size: 13.5px; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .ap-open:hover .ap-name { text-decoration: underline; text-underline-offset: 2px; }
    .ap-detail { font-size: 11.5px; color: var(--wa-muted); }
    .ap-devs { display: flex; flex-wrap: wrap; gap: 4px; max-width: 100%; }
    .ap-dev {
      display: inline-flex; align-items: center; gap: 4px; max-width: 100%; padding: 2px 7px 2px 5px; border-radius: 999px;
      font-size: 11px; color: var(--wa-ink); background: var(--wa-hover); border: 1px solid var(--wa-line);
    }
    .ap-dev svg { flex: none; width: 12px; height: 12px; color: var(--wa-muted); }
    .ap-dev-n { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .ap-dev.dim { opacity: .55; }
    .ap-dev em { font-style: normal; font-size: 10px; color: var(--wa-muted); }
    .ap-dev-open {
      display: inline-flex; align-items: center; gap: 4px; margin-top: auto; padding: 3px 6px 3px 7px; border-radius: 6px; cursor: pointer;
      font-size: 11.5px; font-weight: 600; color: var(--wa-ink); background: transparent; border: 1px solid var(--wa-line-strong);
    }
    .ap-dev-open svg { width: 13px; height: 13px; }
    .ap-dev-open:hover { background: var(--wa-hover); }
    .ap-dev-open:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .ap-dev-open.on { border-color: var(--wa-accent); background: var(--wa-sel-bg); color: var(--wa-accent); }
    /* Select mode: a box in the picture's corner, and a lit card when
       picked. Every click on the card picks it. */
    .ap-card.picking { cursor: pointer; user-select: none; }
    .ap-card.picked { border-color: var(--wa-accent); background: color-mix(in srgb, var(--wa-accent) 10%, var(--wa-card)); }
    .ap-pick {
      position: absolute; top: 12px; left: 12px; z-index: 2; width: 18px; height: 18px; margin: 0; cursor: pointer;
      accent-color: var(--wa-accent);
    }
    .ap-pick:focus-visible { outline: none; box-shadow: var(--wa-ring); border-radius: 4px; }
    /* The bar: held at the foot of the tab while pages are picked. */
    .ap-bar {
      position: sticky; bottom: 12px; z-index: 8; display: flex; flex-wrap: wrap; align-items: center; gap: 8px 12px;
      padding: 8px 10px 8px 14px; border-radius: 10px;
      border: 1px solid var(--wa-line-strong); background: var(--wa-card); box-shadow: var(--wa-shadow-pop);
    }
    .ap-bar-n { flex: none; font-size: 13px; font-weight: 600; font-variant-numeric: tabular-nums; }
    .ap-bar-note { flex: 1 1 200px; min-width: 0; font-size: 12.5px; line-height: 1.4; color: var(--wa-muted); }
    .ap-bar-note.ok { color: var(--wa-ok, var(--wa-ink)); }
    .ap-bar-note.warn, .ap-bar-note.err { color: var(--wa-need); }
    .ap-bar-acts { display: flex; flex-wrap: wrap; gap: 6px; margin-left: auto; }
    .ap-bar > .ap-bulk-menu { position: absolute; right: 8px; bottom: calc(100% + 6px); width: 280px; max-width: calc(100vw - 32px); }
    .ap-bulk-foot { display: flex; justify-content: flex-end; gap: 6px; margin-top: 4px; }
    .ap-bulk-title { font-size: 13.5px; font-weight: 600; }
    .ap-bulk-body { margin: 0; font-size: 12px; line-height: 1.45; color: var(--wa-muted); }
    /* The Devices menu hangs under its card, over the cards below. */
    .ap-card > .pe-dev-menu { position: absolute; top: calc(100% - 4px); left: 8px; width: 250px; max-width: calc(100vw - 32px); z-index: 6; }
    @media (max-width: 640px) {
      .ap-page { padding: 14px 12px 32px; }
      .ap-sec { padding: 0 10px 10px; }
      .ap-sec-top { margin: 0 -10px; padding: 10px 12px; }
      .ap-search { width: 100%; }
      .ap-tools { width: 100%; justify-content: flex-start; }
      .ap-bar-acts { margin-left: 0; }
    }
  `];
}

if (!customElements.get("wa-all-pages")) customElements.define("wa-all-pages", WaAllPages);

declare global {
  interface HTMLElementTagNameMap {
    "wa-all-pages": WaAllPages;
  }
}
