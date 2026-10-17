// The Pages tab and the Status pages tab: every page, or every status page,
// on every watch and iPhone, one card each. One element draws both, told by
// its `kind` which records it lists.
//
// A linked page is one card with a chip per device it is on (dimmed where
// that device hides it). The head is the Complications list page's:
// Multi select, the Device menu (watches or iPhones) and the search, over a
// row of device tabs. A card opens its page in that device's page editor, or
// a status page in its status pages editor, and its Devices menu puts the
// page on another device or takes it off one, the editor's own menu
// (`devices-menu.ts`) with the same writes (`page-links-io.ts`,
// `links-io.ts`). What can be worked out without the element is in
// `all-pages-model.ts`.
//
// Every device's record of the tab's kind is read when the tab opens, and a
// device's again whenever Home Assistant says it changed
// (`subscribeWatchConfig`). The panel loads this file the first time either
// tab opens (`all-pages-hook.ts`).
//
// Multi select (or Cmd/Ctrl+click on a card) turns the cards into tick
// boxes, and a bar under the tabs, as on the Complications list, adds the
// picked pages to a device, takes them off one or deletes them everywhere.
// Its rules and writes are `all-pages-bulk.ts`.

import { LitElement, css, html, nothing, type PropertyValues, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { live } from "lit/directives/live.js";
import { type HassLike, type OwnerSummary, fetchWatchConfig, fetchWatchPagesPlaces, linkWatchPages, subscribeWatchConfig } from "../ha-api.js";
import { deviceColor, deviceColorsCache } from "../device-colors.js";
import { type IconProvider, REFERENCE_CASE } from "../renderer.js";
import { uiIcon } from "../ui-icons.js";
import { watchFrameStyles } from "../watch-frame.js";
import { askNewStatusPage, askStatusPage, keptStatusPagesDraft } from "../watch-status-pages/draft.js";
import { takeStatusPageOff } from "../watch-status-pages/links-io.js";
import { type StatusPagesDocument, asStatusPagesDocument } from "../watch-status-pages/model.js";
import { renderStatusPagePicture, statusPagesViewStyles } from "../watch-status-pages/view.js";
import {
  ALL_FILTER,
  type CardKind,
  type PageCard,
  type PageCopy,
  type PagesFilter,
  type PagesKind,
  aCard,
  allPagesLead,
  cardDetail,
  cardDevicePlaces,
  cardNoun,
  cardsOfKind,
  cardsTitle,
  copyOn,
  devicesDirtyText,
  emptyText,
  filterChips,
  hasBothKinds,
  kindOptions,
  linkSource,
  openCopy,
  pageCards,
  resolveFilter,
  resolveKind,
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
import { NO_ICONS as NO_PICTURE_ICONS } from "./editor-host.js";
import { askNewWatchPage, keepWatchPagesSelection, keptWatchPagesDraft } from "./kept.js";
import {
  DEVICES_WAIT_TAG,
  DEVICES_WAIT_TEXT,
  type LinkDevice,
  type PageDevicePlace,
  type PagesRecordFacts,
  awaitingMove,
  freePlanText,
  linkAlsoAddedText,
  linkDevicesOf,
  linkErrorText,
  pagesRecordFacts,
} from "./links.js";
import { type WatchPage, type WatchPagesDocument, asWatchPagesDocument, isSmartWatchPage, watchPageId, watchPagesOf } from "./model.js";
import { pagesBulkIO } from "./all-pages-io.js";
import { listTabStyles } from "./list-tab-styles.js";
import { takePageOff } from "./page-links-io.js";
import { renderWatchPagePreview, renderWatchPageTitle, watchPagePreviewStyles, watchPreviewLayout, watchReflowPage } from "./preview.js";
import { type WatchPagesNote, watchCommandError } from "./save-note.js";

/** How wide a card's picture of its page is, in CSS pixels. */
const PIC_W = 200;
/** The tallest a picture grows before it is cut, in CSS pixels. */
const PIC_MAX_H = 320;
/** The room kept above the top tile and under the lowest, in points. */
const PIC_PAD_PT = 6;

/** A page is one page on every device, so its picture is the page alone:
 * no watch case, no iPhone, laid out on one screen for every card. */
const PIC_SCREEN = REFERENCE_CASE.screen;

/**
 * The part of a page's picture a card shows, in points from the top of the
 * page: from its title (or its top tile when it has no title) to just under
 * its lowest tile. A smart page, or one with no tiles, shows one screen.
 */
export function pageCrop(page: WatchPage, states: Record<string, unknown> | undefined, icons: IconProvider | undefined,
  screen: { width: number; height: number } = PIC_SCREEN): { top: number; height: number } {
  if (isSmartWatchPage(page)) return { top: 0, height: screen.height };
  const layout = watchPreviewLayout(watchReflowPage(page, states as Parameters<typeof watchReflowPage>[1]), screen);
  if (layout.tiles.length === 0) return { top: 0, height: screen.height };
  const titled = renderWatchPageTitle(page, 1, layout.topInset, icons) !== nothing;
  const top = titled ? 0 : Math.max(0, layout.topInset + Math.min(...layout.tiles.map((t) => t.y)) - PIC_PAD_PT);
  const bottom = layout.topInset + Math.max(...layout.tiles.map((t) => t.y + t.height)) + PIC_PAD_PT;
  return { top, height: Math.max(1, bottom - top) };
}
/** How often a stream of state changes draws the pictures again. */
const STATES_EVERY_MS = 2000;
/** How long after a change event a device's pages are read again, so a
 * burst of saves reads once. */
const RELOAD_DELAY_MS = 250;

/** Where each tab's view is remembered in this browser, as the Complications
 * list remembers its tab and its On device | Shape only toggle. The Pages
 * tab keeps the key it always had. */
const VIEW_STORE_KEYS: Record<CardKind, string> = {
  pages: "wrist-assistant-panel.all-pages.v1",
  status_pages: "wrist-assistant-panel.all-status-pages.v1",
};

/** The device tab and the Device menu last used on one tab. */
interface KeptView {
  filter?: PagesFilter;
  kind: PagesKind;
}

const kept = new Map<CardKind, KeptView>();

/** A tab's view as last left, read once from storage. A browser with
 * storage off keeps it while the panel is open. */
function keptView(cards: CardKind): KeptView {
  const held = kept.get(cards);
  if (held !== undefined) return held;
  const view: KeptView = { kind: "all" };
  try {
    const raw = window.localStorage.getItem(VIEW_STORE_KEYS[cards]);
    const saved = raw ? (JSON.parse(raw) as { filter?: unknown; kind?: unknown }) : {};
    if (typeof saved.filter === "string") view.filter = saved.filter;
    if (saved.kind === "watch" || saved.kind === "iphone") view.kind = saved.kind;
  } catch {
    /* Storage off: the defaults. */
  }
  kept.set(cards, view);
  return view;
}

function keepView(cards: CardKind, change: Partial<KeptView>): void {
  const view = { ...keptView(cards), ...change };
  kept.set(cards, view);
  try {
    window.localStorage.setItem(VIEW_STORE_KEYS[cards], JSON.stringify(view));
  } catch {
    /* Storage off: the choice still holds while the panel is open. */
  }
}

/** The card a Devices menu is open on, named by one of its copies: a card's
 * key moves when its page is linked or unlinked. */
interface MenuAt {
  ownerId: string;
  pageId: string;
}

const sameId = (a: string, b: string): boolean => a.toUpperCase() === b.toUpperCase();

/** What the multi-select bar has open: the Add to or Remove from menu, or
 * the delete question in the bar itself. */
type BulkKind = "add" | "remove" | "delete";

/** Whether a device's page editor, or for status pages its status pages
 * editor, holds unsaved edits in this tab. */
const dirtyHere = (ownerId: string, kind: CardKind = "pages"): boolean =>
  (kind === "status_pages" ? keptStatusPagesDraft(ownerId)?.dirty : keptWatchPagesDraft(ownerId)?.dirty) ?? false;

/** One device's record of one kind as read (`readOne`). */
type ReadResult<D> = [string, D | undefined | "failed", PagesRecordFacts?];

export class WaAllPages extends LitElement {
  /** What the tab lists: pages (the Pages tab), or status pages (the
   * Status pages tab). Only that kind's records are read. */
  @property({ attribute: false }) kind: CardKind = "pages";
  @property({ attribute: false }) owners: readonly OwnerSummary[] = [];
  @property({ attribute: false }) ownersReady = false;
  @property({ attribute: false }) phones = false;
  @property({ attribute: false }) icons?: IconProvider;
  @property({ attribute: false }) iconsTick = 0;
  /** Open a device's page editor, or with `what` `status_pages` its status
   * pages editor. */
  @property({ attribute: false }) onOpen?: (ownerId: string, kind: "watch" | "iphone", what?: CardKind) => void;

  /** Each device's pages as last read; a device with none is missing. */
  @state() private docs: ReadonlyMap<string, WatchPagesDocument> = new Map();
  /** Each device's status pages as last read, the same way. */
  @state() private statusDocs: ReadonlyMap<string, StatusPagesDocument> = new Map();
  /** What each device's pages record said as last read: whether Home
   * Assistant holds one, and whether the device is on the free plan. A
   * device not read is missing. */
  @state() private facts: ReadonlyMap<string, PagesRecordFacts> = new Map();
  /** The same of each device's status pages record. */
  @state() private statusFacts: ReadonlyMap<string, PagesRecordFacts> = new Map();
  /** The devices whose pages could not be read last time. */
  @state() private failed: readonly string[] = [];
  @state() private readState: "idle" | "loading" | "ready" = "idle";
  /** False on an integration without linked pages: no Devices menus. */
  @state() private linksOn = true;
  @state() private search = "";
  @state() private menuAt?: MenuAt;
  @state() private linking = false;
  @state() private devicesNote?: WatchPagesNote;
  /** New page's menu of devices is open. */
  @state() private newOpen = false;
  /** Select mode: a click picks a card instead of opening it. */
  @state() private selecting = false;
  /** The picked cards, by key. Only those shown count. */
  @state() private selected: ReadonlySet<string> = new Set();
  /** The bar's open menu, or its delete question. */
  @state() private bulkMenu?: BulkKind;
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
  private cardsMemo?: {
    docs: ReadonlyMap<string, WatchPagesDocument>;
    statusDocs: ReadonlyMap<string, StatusPagesDocument>;
    devices: readonly LinkDevice[];
    cards: PageCard[];
  };

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

  protected override willUpdate(changed: PropertyValues): void {
    // Told to list the other kind: what was open, picked or typed was of the
    // old one, and the new one's records are read.
    if (changed.has("kind") && changed.get("kind") !== undefined) this.kindChanged();
    const devices = this.devices;
    const sig = devices.map((d) => d.ownerId).join(",");
    if (this.hassNow !== undefined && this.isConnected && sig !== this.deviceSig) {
      this.deviceSig = sig;
      void this.loadAll();
      this.startSubscriptions(devices);
    }
  }

  private kindChanged(): void {
    this.endSubscriptions();
    this.loadSeq++;
    this.deviceSig = undefined;
    this.readState = "idle";
    this.failed = [];
    this.search = "";
    this.selecting = false;
    this.selected = new Set();
    this.anchor = undefined;
    this.bulkMenu = undefined;
    this.bulkNote = undefined;
    this.newOpen = false;
    this.closeDevices();
  }

  /** The device tab picked, kept for each tab apart (`keptView`). */
  private get filter(): PagesFilter | undefined {
    return keptView(this.kind).filter;
  }

  /** The head's Device menu, kept the same way. */
  private get deviceKind(): PagesKind {
    return keptView(this.kind).kind;
  }

  private colorsFor = deviceColorsCache();

  /** A device's color (`device-colors.ts`), the one it wears on every tab. */
  private colorOf = (ownerId: string): string | undefined => deviceColor(this.colorsFor(this.owners), ownerId);

  /** The watches that wait for their iPhone to move their pages (or their
   * status pages) here, so none can go on them yet (`awaitingMove`). */
  private waitingDevices(kind: CardKind = this.kind): Set<string> {
    return awaitingMove(this.owners, kind === "status_pages" ? this.statusFacts : this.facts);
  }

  /** The devices that said they are on the free plan. */
  private freeDevices(): Set<string> {
    return new Set([...this.facts].filter(([, f]) => f.free).map(([id]) => id));
  }

  /** Every device a page can be on, the editor's list. */
  private get devices(): LinkDevice[] {
    return linkDevicesOf(this.owners, this.phones);
  }

  /** Every card of the kinds read. */
  private get cards(): PageCard[] {
    const devices = this.devices;
    const memo = this.cardsMemo;
    if (memo !== undefined && memo.docs === this.docs && memo.statusDocs === this.statusDocs && memo.devices.length === devices.length
      && memo.devices.every((d, i) => d.ownerId === devices[i]!.ownerId && d.name === devices[i]!.name)) return memo.cards;
    const cards = pageCards(devices, this.docs, this.statusDocs);
    this.cardsMemo = { docs: this.docs, statusDocs: this.statusDocs, devices, cards };
    return cards;
  }

  /** The cards of the tab's kind: all the rest of the tab works on these. */
  private get kindCards(): PageCard[] {
    return cardsOfKind(this.cards, this.kind);
  }

  // ── reading ────────────────────────────────────────────────────────────

  /** Read every device's record of the tab's kind, and whether pages can be
   * linked here. Only the newest read lands. */
  private async loadAll(): Promise<void> {
    const hass = this.hassNow;
    if (!hass) return;
    const seq = ++this.loadSeq;
    const devices = this.devices;
    const kind = this.kind;
    if (this.readState === "idle") this.readState = "loading";
    const links = fetchWatchPagesPlaces(hass).then(
      () => true,
      (err: unknown) => watchCommandError(err).code !== "unknown_command",
    );
    const reads = await Promise.all(devices.map((d) => this.readOne(hass, d.ownerId, kind)));
    const linksOn = await links;
    if (seq !== this.loadSeq || kind !== this.kind) return;
    const failed = new Set<string>();
    const land = <D>(reads: readonly ReadResult<D>[], heldDocs: ReadonlyMap<string, D>, heldFacts: ReadonlyMap<string, PagesRecordFacts>) => {
      const docs = new Map<string, D>();
      const facts = new Map<string, PagesRecordFacts>();
      for (const [ownerId, read, fact] of reads) {
        if (read === "failed") {
          failed.add(ownerId);
          const held = heldDocs.get(ownerId);
          if (held !== undefined) docs.set(ownerId, held);
          const known = heldFacts.get(ownerId);
          if (known !== undefined) facts.set(ownerId, known);
        } else if (read !== undefined) docs.set(ownerId, read);
        if (fact !== undefined) facts.set(ownerId, fact);
      }
      return { docs, facts };
    };
    if (kind === "status_pages") {
      const status = land(reads as ReadResult<StatusPagesDocument>[], this.statusDocs, this.statusFacts);
      this.statusDocs = status.docs;
      this.statusFacts = status.facts;
    } else {
      const pages = land(reads as ReadResult<WatchPagesDocument>[], this.docs, this.facts);
      this.docs = pages.docs;
      this.facts = pages.facts;
    }
    this.failed = devices.map((d) => d.ownerId).filter((id) => failed.has(id));
    this.linksOn = linksOn;
    this.readState = "ready";
  }

  /** One device's record of one kind: its document (undefined for none),
   * and what the record said; "failed" when it could not be read. An
   * integration too old for status pages reads as none. */
  private async readOne(hass: HassLike, ownerId: string, kind: CardKind): Promise<ReadResult<WatchPagesDocument | StatusPagesDocument>> {
    try {
      const record = await fetchWatchConfig(hass, ownerId, kind);
      const doc = record.revision <= 0 ? undefined : kind === "status_pages" ? asStatusPagesDocument(record.document) : asWatchPagesDocument(record.document);
      return [ownerId, doc, pagesRecordFacts(record)];
    } catch {
      return [ownerId, "failed"];
    }
  }

  /** Read one device's pages, or its status pages, again after a change
   * there. */
  private reloadOne(ownerId: string, kind: CardKind): void {
    const at = `${kind}|${ownerId}`;
    const timer = this.reloadTimers.get(at);
    if (timer !== undefined) window.clearTimeout(timer);
    this.reloadTimers.set(at, window.setTimeout(() => {
      this.reloadTimers.delete(at);
      const hass = this.hassNow;
      if (!hass || !this.isConnected) return;
      const seq = (this.readSeq.get(at) ?? 0) + 1;
      this.readSeq.set(at, seq);
      const all = this.loadSeq;
      void this.readOne(hass, ownerId, kind).then(([, read, fact]) => {
        if (seq !== this.readSeq.get(at) || all !== this.loadSeq || read === "failed") return;
        if (kind === "status_pages") {
          const docs = new Map(this.statusDocs);
          if (read === undefined) docs.delete(ownerId);
          else docs.set(ownerId, read);
          this.statusDocs = docs;
          if (fact !== undefined) this.statusFacts = new Map(this.statusFacts).set(ownerId, fact);
          return;
        }
        const docs = new Map(this.docs);
        if (read === undefined) docs.delete(ownerId);
        else docs.set(ownerId, read as WatchPagesDocument);
        this.docs = docs;
        if (fact !== undefined) this.facts = new Map(this.facts).set(ownerId, fact);
      });
    }, RELOAD_DELAY_MS));
  }

  /** Hear every save of each device's record of the tab's kind, whoever
   * made it. */
  private startSubscriptions(devices: readonly LinkDevice[]): void {
    this.endSubscriptions();
    const hass = this.hassNow;
    if (!hass) return;
    const seq = this.subscribeSeq;
    const kind = this.kind;
    for (const device of devices) {
      const ownerId = device.ownerId;
      subscribeWatchConfig(hass, ownerId, (event) => {
        if (seq !== this.subscribeSeq) return;
        if (event.kind === kind) this.reloadOne(ownerId, kind);
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

  /** A device tab picked: shown, and remembered. */
  private setFilter(filter: PagesFilter): void {
    keepView(this.kind, { filter });
    this.requestUpdate();
    this.closeDevices();
    this.pruneSelected();
  }

  private setSearch(search: string): void {
    this.search = search;
    this.pruneSelected();
  }

  /** The Device menu: all pages, or those on a watch, or on an iPhone. */
  private setDeviceKind(kind: PagesKind): void {
    keepView(this.kind, { kind });
    this.requestUpdate();
    this.closeDevices();
    this.pruneSelected();
  }

  /** New page on a device: its page editor opens and adds one. On the
   * Status pages tab, New status page: its status pages editor does. */
  private newPage(device: LinkDevice): void {
    this.newOpen = false;
    if (this.kind === "status_pages") {
      askNewStatusPage(device.ownerId);
      this.onOpen?.(device.ownerId, device.kind, "status_pages");
      return;
    }
    askNewWatchPage(device.ownerId);
    this.onOpen?.(device.ownerId, device.kind);
  }

  /** Open the page in its device's page editor, on that page, or a status
   * page in that device's status pages editor. */
  private open(card: PageCard, filter: PagesFilter): void {
    const copy = openCopy(card, filter, this.deviceKindNow());
    const pageId = watchPageId(copy.page);
    if (card.kind === "status_pages") {
      askStatusPage(copy.device.ownerId, pageId);
      this.onOpen?.(copy.device.ownerId, copy.device.kind, "status_pages");
      return;
    }
    keepWatchPagesSelection(copy.device.ownerId, { pageId });
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
    const status = card.kind === "status_pages";
    let note: WatchPagesNote;
    this.linking = true;
    this.devicesNote = undefined;
    try {
      if (place.on) {
        const there = watchPageId(copyOn(card, target)!.page);
        const refusal = status ? await takeStatusPageOff(hass, target, there, name) : await takePageOff(hass, target, there, name);
        note = refusal === undefined ? { kind: "ok", text: `Taken off ${name}.` } : { kind: "err", text: refusal };
      } else {
        const source = linkSource(card, dirtyHere);
        if (source === undefined) {
          note = { kind: "warn", text: devicesDirtyText(card.kind) };
        } else {
          const sourcePage = watchPageId(copyOn(card, source)!.page);
          const reply = await linkWatchPages(hass, source, [sourcePage], [target], card.kind);
          const also = status ? undefined : linkAlsoAddedText(reply, target, [sourcePage], this.docs.get(source));
          const free = !status && this.facts.get(target)?.free === true ? freePlanText([name]) : undefined;
          note = { kind: "ok", text: [`Added to ${name}.`, also, free].filter((t) => t !== undefined).join(" ") };
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

  /** Escape closes the newest thing open: the bar's menu or its delete
   * question, then a card's Devices menu, then Multi select. */
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

  /** A press outside an open menu and its button closes it. The delete
   * question stays until it is answered, as the Complications bar's does. */
  private onWindowPointerDown = (e: PointerEvent): void => {
    const barMenu = (this.bulkMenu === "add" || this.bulkMenu === "remove") && this.bulkBusy === undefined;
    if (this.menuAt === undefined && !barMenu) return;
    const path = e.composedPath();
    const within = (...names: string[]) => path.some((el) => el instanceof Element && names.some((n) => el.classList.contains(n)));
    if (this.menuAt !== undefined && !within("pe-dev-menu", "ap-dev-open")) this.closeDevices();
    if (barMenu && !within("pk-bar-menu")) this.closeBulkMenu();
  };

  // ── picking ────────────────────────────────────────────────────────────

  /** The Device menu's kind, All when the home has no menu for it. */
  private deviceKindNow(): PagesKind {
    return resolveKind(this.deviceKind, this.devices);
  }

  /** The cards shown now, under the kind chip, the tab, the search and the
   * Device menu. */
  private shownNow(): PageCard[] {
    return shownCards(this.kindCards, resolveFilter(this.filter, this.devices), this.search, this.deviceKindNow());
  }

  /** The picked cards among those shown, in the order shown. */
  private pickedCards(): PageCard[] {
    return this.shownNow().filter((c) => this.selected.has(c.key));
  }

  /** Unpick the cards a tab, a search or the Device menu hides. */
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
   * A click on a card. Outside Multi select it opens the page, unless
   * Cmd/Ctrl is held: that picks it and turns Multi select on. In Multi
   * select it picks or unpicks the card, and Shift+click picks every card
   * from the last one clicked.
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

  /** The bar's All shown, or None: every card on screen picked, or let go. */
  private selectShown(all: boolean): void {
    if (this.bulkBusy !== undefined) return;
    const keys = this.shownNow().map((c) => c.key);
    this.selected = all ? withAll(this.selected, keys) : withNone(this.selected, keys);
    this.bulkNote = undefined;
    if (this.selected.size === 0) this.bulkMenu = undefined;
  }

  // ── the bar's actions ──────────────────────────────────────────────────

  /** Open Add to or Remove from under its button, or the delete question
   * in the bar. Pressed again, it closes. */
  private openBulkMenu(kind: BulkKind): void {
    if (this.bulkBusy !== undefined) return;
    if (this.bulkMenu === kind) {
      this.closeBulkMenu();
      return;
    }
    this.bulkMenu = kind;
    this.bulkNote = undefined;
    void this.updateComplete.then(() => {
      const bar = this.renderRoot.querySelector?.<HTMLElement>(".pk-bar");
      bar?.querySelector<HTMLElement>(kind === "delete" ? ".pk-bar-cancel" : ".pk-bar-row:not(:disabled)")?.focus();
    });
  }

  private closeBulkMenu(): void {
    this.bulkMenu = undefined;
  }

  /**
   * Run an action on the picked cards, one device at a time: add them to
   * or take them off the devices given, or delete them. Then read every
   * device again and say in one line what happened. The cards stay picked
   * where their pages are still there.
   */
  private async runBulk(kind: BulkKind, targets: readonly string[] = []): Promise<void> {
    const hass = this.hassNow;
    if (!hass || this.bulkBusy !== undefined) return;
    const devices = this.devices;
    const picked = this.pickedCards();
    if (picked.length === 0) return;
    const on = devices.map((d) => d.ownerId).filter((id) => targets.includes(id));
    if (kind !== "delete" && on.length === 0) return;
    const io = pagesBulkIO(hass);
    const step = (text: string) => { this.bulkBusy = text; };
    this.bulkMenu = undefined;
    this.bulkNote = undefined;
    this.bulkBusy = "Working…";
    let note: WatchPagesNote;
    try {
      let result: BulkResult;
      if (kind === "add") result = await runAdd(io, addPlan(picked, on, this.docs, dirtyHere, this.statusDocs), devices, step);
      else if (kind === "remove") result = await runRemove(io, removePlan(picked, on, dirtyHere), devices, step);
      else result = await runDelete(io, deletePlan(picked, devices, dirtyHere), devices, step);
      note = bulkResultText(result, devices, this.freeDevices());
    } catch (err) {
      note = { kind: "err", text: watchCommandError(err).message };
    }
    this.bulkBusy = `Reading the ${cardNoun(this.kind, 2)} again…`;
    try {
      await this.loadAll();
    } finally {
      this.bulkBusy = undefined;
    }
    this.selected = keepPresent(remapSelection(picked, this.kindCards), this.shownNow().map((c) => c.key));
    this.anchor = undefined;
    this.bulkNote = note;
  }

  // ── drawing ────────────────────────────────────────────────────────────

  protected override render(): TemplateResult {
    const devices = this.devices;
    if (devices.length === 0 && !this.ownersReady) return html`<div class="ap-page"><div class="ap-wrap"><p class="ap-empty">Loading…</p></div></div>`;
    const what = this.kind;
    const cards = this.kindCards;
    const filter = resolveFilter(this.filter, devices);
    const kind = this.deviceKindNow();
    const shown = shownCards(cards, filter, this.search, kind);
    // Counted in the tab's kind only, so cards of the other kind, read
    // before the element was told to switch, never hide the loading line.
    const loading = this.readState !== "ready" && cards.length === 0;
    const failed = this.failed.map((id) => devices.find((d) => d.ownerId === id)?.name).filter((n): n is string => n !== undefined);
    const tabbed = devices.length > 1;
    const one = cardNoun(what);
    const many = cardNoun(what, 2);
    const hint = this.selecting
      ? `Click ${many} to pick them. Shift+click picks every ${one} between two.`
      : `Click ${aCard(what)} to edit it.${this.linksOn && devices.length > 1 ? " Devices on a card puts it on another watch or iPhone." : ""}`;
    const reading = `Reading every device's ${many}…`;
    return html`<div class="ap-page"><div class="ap-wrap">
      <div class="ap-head">
        <div class="ap-head-text">
          <h1>${cardsTitle(what)}</h1>
          <p class="ap-lead">${loading ? reading : allPagesLead(cards.length, what)}</p>
        </div>
        ${devices.length === 0 ? nothing : this.renderNew(filter, devices)}
      </div>
      ${failed.length === 0 ? nothing : html`<p class="ap-warn" role="status">Could not read the ${many} of ${failed.join(", ")}. They show as last read.</p>`}
      <div class="pk-surface pk-page" role="region" aria-label=${`Your ${many}`}>
        <div class="pk-pin">
          ${this.renderHead(cards, filter, devices)}
          ${tabbed ? this.renderTabs(devices, cards, filter) : nothing}
          ${this.selecting ? this.renderBar(shown, devices) : nothing}
        </div>
        <div class="pk-body" role=${tabbed ? "tabpanel" : nothing} aria-labelledby=${tabbed ? `ap-tab-${filter}` : nothing}>
          ${loading ? html`<p class="ap-empty">${reading}</p>`
            : shown.length === 0 ? html`<p class="ap-empty">${emptyText(filter, devices, this.search, kind, what)}</p>`
            : html`<div class="ap-grid" role="list">${shown.map((card) => this.renderCard(card, filter, devices, cards))}</div>`}
        </div>
        <div class="pk-foot"><span class="pk-foot-hint">${hint}</span></div>
      </div>
    </div></div>`;
  }

  /**
   * The head, the Complications list's: Multi select, the Device menu, and
   * the search at the right. A page is the same page on a watch and on an
   * iPhone, so there is no On device toggle: a card draws the page alone.
   */
  private renderHead(cards: readonly PageCard[], filter: PagesFilter, devices: readonly LinkDevice[]): TemplateResult {
    const on = this.selecting;
    const busy = this.bulkBusy !== undefined;
    const many = cardNoun(this.kind, 2);
    return html`<div class="pk-head">
      <button type="button" class="pk-pick-btn ${on ? "on" : ""}" aria-pressed=${on ? "true" : "false"}
        title=${on ? `Back to opening one ${cardNoun(this.kind)} at a time` : `Pick several ${many} to add, remove or delete together`}
        ?disabled=${busy} @click=${() => (on ? this.endSelect() : this.startSelect())}>
        ${uiIcon("checklist")}<span>Multi select</span></button>
      ${hasBothKinds(devices) ? this.renderKinds(cards, filter) : nothing}
      <label class="pk-search">
        ${uiIcon("search")}
        <input type="search" class="pk-search-input" .value=${this.search} placeholder="Search by name" aria-label=${`Search ${many}`}
          @input=${(e: InputEvent) => this.setSearch((e.target as HTMLInputElement).value)} />
      </label>
    </div>`;
  }

  /**
   * New page, at the head's right as New complication is on its tab, or
   * New status page on the Status pages tab. On a device's tab, or in a
   * home with one device, it adds the page there; otherwise it asks which
   * device first.
   */
  private renderNew(filter: PagesFilter, devices: readonly LinkDevice[]): TemplateResult {
    const target = devices.find((d) => d.ownerId === filter) ?? (devices.length === 1 ? devices[0] : undefined);
    const open = this.newOpen && target === undefined;
    const one = cardNoun(this.kind);
    const label = `New ${one}`;
    const head = `Add ${aCard(this.kind)} on`;
    return html`<div class="ap-new" @keydown=${(e: KeyboardEvent) => { if (e.key === "Escape" && open) { e.stopPropagation(); this.newOpen = false; } }}
      @focusout=${(e: FocusEvent) => {
        const to = e.relatedTarget;
        if (open && !(to instanceof Node && (e.currentTarget as HTMLElement).contains(to))) this.newOpen = false;
      }}>
      <button type="button" class="ap-new-btn" aria-haspopup=${target === undefined ? "menu" : nothing}
        aria-expanded=${target === undefined ? (open ? "true" : "false") : nothing}
        title=${target === undefined ? `Pick the device to add ${aCard(this.kind)} on` : `${head} ${target.name}`}
        @click=${() => (target === undefined ? (this.newOpen = !this.newOpen) : this.newPage(target))}>
        ${uiIcon("plus")}<span>${label}</span></button>
      ${open ? html`<div class="ap-new-menu" role="menu" aria-label=${head}>
        <div class="ap-new-h">${head}</div>
        ${devices.map((d) => html`<button type="button" class="ap-new-row" role="menuitem"
          style=${`--dc:${this.colorOf(d.ownerId) ?? "var(--wa-line-strong)"}`} @click=${() => this.newPage(d)}>
          ${uiIcon(d.kind === "iphone" ? "phone" : "watch")}<span>${d.name}</span></button>`)}
      </div>` : nothing}
    </div>`;
  }

  /** The Device menu, the Shape menu's look: All, Watches, iPhones, each
   * with how many pages the tab and the search have left. */
  private renderKinds(cards: readonly PageCard[], filter: PagesFilter): TemplateResult {
    const kind = this.deviceKindNow();
    const options = kindOptions(shownCards(cards, filter, this.search));
    return html`<label class="pk-shape">
      <span class="pk-shape-lead">Device</span>
      <select aria-label=${`Show the ${cardNoun(this.kind, 2)} on one kind of device`} .value=${kind}
        @change=${(e: Event) => this.setDeviceKind((e.target as HTMLSelectElement).value as PagesKind)}>
        ${options.map((o) => html`<option value=${o.key} ?selected=${o.key === kind}>${o.label} (${o.count})</option>`)}
      </select>
    </label>`;
  }

  /** The device tabs: All, then a tab per device with how many pages it
   * holds, the selected one underlined. */
  private renderTabs(devices: readonly LinkDevice[], cards: readonly PageCard[], filter: PagesFilter): TemplateResult {
    return html`<div class="pk-tabs" role="tablist" aria-label="Devices">
      ${filterChips(devices, cards, this.colorOf).map((chip) => html`<button type="button" role="tab" class="pk-tab ${chip.id === filter ? "on" : ""}"
        style=${chip.color === undefined ? nothing : `--dc:${chip.color}`} id=${`ap-tab-${chip.id}`} aria-selected=${chip.id === filter ? "true" : "false"}
        title=${chip.id === ALL_FILTER ? `Every ${cardNoun(this.kind)} on every device` : `The ${cardNoun(this.kind, 2)} on ${chip.label}`}
        @click=${() => this.setFilter(chip.id)}>
        <span class="pk-tab-glyph" aria-hidden="true">${uiIcon(chip.kind === undefined ? "grid" : chip.kind === "iphone" ? "phone" : "watch")}</span>
        <span class="pk-tab-name">${chip.label}</span>
        <span class="pk-tab-count">${chip.count}</span>
      </button>`)}
    </div>`;
  }

  private renderCard(card: PageCard, filter: PagesFilter, devices: readonly LinkDevice[], cards: readonly PageCard[]): TemplateResult {
    const copy = openCopy(card, filter, this.deviceKindNow());
    const selecting = this.selecting;
    const menuOpen = !selecting && this.cardOfMenu(cards)?.key === card.key;
    const devicesOn = !selecting && this.linksOn && devices.length > 1;
    const picked = selecting && this.selected.has(card.key);
    const title = selecting ? `${picked ? "Let" : "Pick"} ${card.name}${picked ? " go" : ""}` : `Edit ${card.name} on ${copy.device.name}`;
    const click = (e: MouseEvent) => this.cardClick(e, card, filter);
    const color = (ownerId: string) => `--dc:${this.colorOf(ownerId) ?? "var(--wa-line-strong)"}`;
    return html`<div class="ap-card ${menuOpen ? "over" : ""} ${selecting ? "picking" : ""} ${picked ? "picked" : ""}" role="listitem" data-card=${card.key}
      @click=${(e: MouseEvent) => { if (selecting) click(e); }}>
      <div class="ap-top">
        ${selecting ? html`<input type="checkbox" class="pk-card-pick" .checked=${live(picked)} ?disabled=${this.bulkBusy !== undefined}
          aria-label=${title}
          @click=${(e: MouseEvent) => {
            e.stopPropagation();
            this.pick(card, e.shiftKey);
          }} />` : nothing}
        <button type="button" class="ap-open" title=${title} tabindex=${selecting ? "-1" : "0"} @click=${click}>
          <b class="ap-name">${card.name}</b>
          <small class="ap-detail">${cardDetail(card)}</small>
        </button>
      </div>
      <button type="button" class="ap-thumb" tabindex="-1" aria-hidden="true" title=${title} @click=${click}>
        ${card.kind === "status_pages" ? this.renderStatusThumb(copy) : this.renderThumb(copy)}
      </button>
      <div class="ap-foot">
        <span class="ap-devs">${card.copies.map((c) => html`<span class="ap-dev ${c.hidden ? "dim" : ""}" style=${color(c.device.ownerId)}
          title=${c.hidden ? `On ${c.device.name}, hidden there` : `On ${c.device.name}`}>
          ${uiIcon(c.device.kind === "iphone" ? "phone" : "watch")}<span class="ap-dev-n">${c.device.name}</span>${c.hidden ? html`<em>hidden</em>` : nothing}
        </span>`)}</span>
        ${devicesOn ? html`<button type="button" class="ap-dev-open ${menuOpen ? "on" : ""}" aria-expanded=${menuOpen ? "true" : "false"}
          title=${`Pick the devices this ${cardNoun(card.kind)} is on`}
          @click=${() => (menuOpen ? this.closeDevices() : this.openDevices(card))}>${uiIcon("phone")}<span>Devices</span>${uiIcon("chevron")}</button>` : nothing}
      </div>
      ${menuOpen ? this.renderMenu(card, devices) : nothing}
    </div>`;
  }

  private renderMenu(card: PageCard, devices: readonly LinkDevice[]): TemplateResult {
    const dirty = linkSource(card, dirtyHere) === undefined;
    return renderPageDevicesMenu({
      name: card.name,
      places: cardDevicePlaces(devices, card, this.waitingDevices(card.kind)),
      ...(dirty ? { blocked: devicesDirtyText(card.kind) } : {}),
      busy: this.linking,
      ...(this.devicesNote === undefined ? {} : { note: this.devicesNote }),
      className: "at-card",
      colorOf: (ownerId) => this.colorOf(ownerId),
      onToggle: (place) => void this.toggle(card, place),
      onDone: () => this.closeDevices(),
    });
  }

  /**
   * The bar under the tabs while Multi select is on, the Complications
   * list's: how many are picked (or what is running), All shown or None,
   * what the last action did, then the actions and Done. Delete asks in
   * the bar itself; Add to and Remove from open a list of devices under
   * their button, one press each.
   */
  private renderBar(shown: readonly PageCard[], devices: readonly LinkDevice[]): TemplateResult {
    const picked = shown.filter((c) => this.selected.has(c.key));
    const n = picked.length;
    const busy = this.bulkBusy !== undefined;
    const none = n === 0;
    const allShown = shown.length > 0 && shown.every((c) => this.selected.has(c.key));
    const multi = devices.length > 1;
    const note = busy ? undefined : this.bulkNote;
    const one = cardNoun(this.kind);
    const many = cardNoun(this.kind, 2);
    return html`<div class="pk-bar" role="group" aria-label=${`Act on the picked ${many}`}>
      <span class="pk-bar-count" role="status">${this.bulkBusy ?? (none ? `Pick ${aCard(this.kind)} to start.` : `${n} picked`)}</span>
      <button type="button" class="ghost small" ?disabled=${busy || shown.length === 0}
        title=${allShown ? `Let the ${many} on screen go` : `Pick every ${one} the tab, the search and the Device menu have left`}
        @click=${() => this.selectShown(!allShown)}>${allShown ? "None" : "All shown"}</button>
      ${note === undefined ? nothing : html`<span class="pk-bar-said ${note.kind}">${note.text}</span>`}
      <span class="pk-bar-gap" aria-hidden="true"></span>
      ${this.bulkMenu === "delete" && !none
        ? this.renderDeleteAsk(picked, devices)
        : html`${multi && this.linksOn ? this.renderBarMenu("add", picked, devices, busy || none) : nothing}
          ${multi ? this.renderBarMenu("remove", picked, devices, busy || none) : nothing}
          <button type="button" class="ghost danger small" ?disabled=${busy || none}
            title=${`Delete these ${many} from every device they are on`}
            @click=${() => this.openBulkMenu("delete")}>${uiIcon("delete")}<span>Delete…</span></button>`}
      <button type="button" class="primary small pk-bar-done" ?disabled=${busy}
        title=${`Stop picking and go back to opening one ${one} at a time`}
        @click=${() => this.endSelect()}>${uiIcon("check")}<span>Done</span></button>
    </div>`;
  }

  /** Add to or Remove from: a row per device, one press each. A device none
   * of the picked pages could change is greyed, with the reason. */
  private renderBarMenu(kind: "add" | "remove", picked: readonly PageCard[], devices: readonly LinkDevice[], off: boolean): TemplateResult {
    const add = kind === "add";
    const open = this.bulkMenu === kind && !off;
    const n = picked.length;
    const what = this.kind;
    const many = cardNoun(what, 2);
    const count = `${n} ${cardNoun(what, n)}`;
    const head = add ? `Add ${count} to` : `Remove ${count} from`;
    const waiting = add ? this.waitingDevices(what) : new Set<string>();
    return html`<span class="pk-bar-menu">
      <button type="button" class="ghost small ${open ? "on" : ""}" aria-expanded=${open ? "true" : "false"} ?disabled=${off}
        title=${add ? `Put these ${many} on another device, linked` : `Take these ${many} off a device`}
        @click=${() => this.openBulkMenu(kind)}>${uiIcon(add ? "plus" : "layers")}<span>${add ? "Add to…" : "Remove from…"}</span></button>
      ${open ? html`<div class="pk-bar-list" role="group" aria-label=${head}>
        <div class="pk-bar-head">${head}</div>
        ${devices.map((device) => {
          const holds = picked.filter((c) => copyOn(c, device.ownerId) !== undefined).length;
          const dirty = dirtyHere(device.ownerId, what);
          const wait = waiting.has(device.ownerId);
          const why = dirty ? "unsaved edits" : wait ? DEVICES_WAIT_TAG : add ? (holds === n ? "has them all" : undefined) : (holds === 0 ? "has none" : undefined);
          return html`<button type="button" class="pk-bar-row" ?disabled=${why !== undefined}
            style=${`--dc:${this.colorOf(device.ownerId) ?? "var(--wa-muted)"}`}
            title=${dirty ? `Its ${what === "status_pages" ? "status pages" : "pages"} have unsaved edits. Save or discard them first.` : wait ? DEVICES_WAIT_TEXT : `${add ? "Add to" : "Remove from"} ${device.name}`}
            @click=${() => void this.runBulk(kind, [device.ownerId])}>
            ${uiIcon(device.kind === "iphone" ? "phone" : "watch")}
            <span class="pk-dup-name">${device.name}</span>
            ${why === undefined ? (add ? nothing : html`<span class="pk-bar-row-n">${holds} of ${n}</span>`) : html`<span class="pk-bar-row-n">${why}</span>`}
          </button>`;
        })}
        <div class="pk-bar-note">${add
          ? "They go on linked: an edit on one device shows on all of them."
          : `${what === "status_pages" ? "A status page" : "A page"} this would leave on no device stays. Use Delete for those.`}</div>
      </div>` : nothing}
    </span>`;
  }

  /** The delete question, in the bar where the actions were: how many
   * pages, from which devices. */
  private renderDeleteAsk(picked: readonly PageCard[], devices: readonly LinkDevice[]): TemplateResult {
    const ask = deleteAskText(deletePlan(picked, devices, dirtyHere), devices);
    return html`<span class="pk-bar-ask" id="ap-del-ask"><b>${ask.title}</b> ${ask.body}</span>
      <button type="button" class="ghost danger small" aria-describedby="ap-del-ask"
        @click=${() => void this.runBulk("delete")}>Really delete</button>
      <button type="button" class="ghost small pk-bar-cancel" @click=${() => this.closeBulkMenu()}>Cancel</button>`;
  }

  /**
   * The page alone, with a plain outline: no watch case, no iPhone, no
   * clock and no page dots, since the same page is on a watch and on an
   * iPhone. One screen width for every card. Only as tall as its tiles
   * (`pageCrop`), and cut with a fade past `PIC_MAX_H`.
   */
  private renderThumb(copy: PageCopy): TemplateResult {
    const doc = this.docs.get(copy.device.ownerId);
    const pages = doc === undefined ? [copy.page] : watchPagesOf(doc);
    const states = this.hassNow?.states;
    const icons = this.icons;
    const scale = PIC_W / PIC_SCREEN.width;
    const crop = pageCrop(copy.page, states, icons);
    const tall = crop.height * scale;
    const cut = tall > PIC_MAX_H;
    const px = (n: number) => `${Math.round(n * 100) / 100}px`;
    return html`<span class="ap-pic ${cut ? "cut" : ""}" style=${`width:${px(PIC_W)};height:${px(Math.min(tall, PIC_MAX_H))}`}>
      <span class="ap-pic-in" style=${`transform:translateY(${px(-crop.top * scale)})`}>${renderWatchPagePreview({
        page: copy.page, pages, screen: PIC_SCREEN, scale,
        ...(states === undefined ? {} : { states }), ...(icons === undefined ? {} : { icons }),
      })}</span>
    </span>`;
  }

  /**
   * A status page alone, as the watch draws it from the states now
   * (`renderStatusPagePicture`), with the same plain outline as a page: one
   * screen tall, cut with a fade when its rows go on past it.
   */
  private renderStatusThumb(copy: PageCopy): TemplateResult {
    const hass = this.hassNow;
    const scale = PIC_W / PIC_SCREEN.width;
    const px = (n: number) => `${Math.round(n * 100) / 100}px`;
    const rows = Array.isArray(copy.page.rows) ? copy.page.rows.length : 0;
    // About as many rows as one screen holds before the fade is needed.
    const cut = rows > 5;
    return html`<span class="ap-pic ap-pic-status ${cut ? "cut" : ""}" style=${`width:${px(PIC_W)};height:${px(Math.min(PIC_SCREEN.height * scale, PIC_MAX_H))}`}>
      <span class="ap-pic-in">${hass === undefined ? nothing : renderStatusPagePicture({
        page: copy.page, hass, icons: this.icons ?? NO_PICTURE_ICONS, screen: PIC_SCREEN, scale,
      })}</span>
    </span>`;
  }

  /** The look the list tabs share (`list-tab-styles.ts`), then this tab's
   * own: New page, Multi select and its bar, and a page's picture. */
  static override styles = [watchPagePreviewStyles, watchFrameStyles, devicesMenuStyles, statusPagesViewStyles, listTabStyles, css`
    /* New page: filled, as New complication is, the one way to start a page
       from this tab. Its menu of devices opens under it, at its right edge. */
    .ap-new { position: relative; flex: none; }
    .ap-new-btn {
      display: inline-flex; align-items: center; gap: 6px; font: inherit; font-size: 12.5px; font-weight: 600;
      height: 30px; padding: 0 11px; border-radius: 8px; cursor: pointer;
      border: 1px solid transparent; background: var(--wa-primary-bg); color: var(--wa-primary-ink);
    }
    .ap-new-btn:hover { filter: brightness(1.1); }
    .ap-new-btn:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .ap-new-btn svg { width: 16px; height: 16px; }
    .ap-new-menu {
      position: absolute; right: 0; top: calc(100% + 6px); z-index: 9; width: min(260px, calc(100vw - 24px));
      display: flex; flex-direction: column; gap: 2px; padding: 6px;
      background: var(--wa-card); border: 1px solid var(--wa-line-strong); border-radius: 10px; box-shadow: var(--wa-shadow-pop);
    }
    .ap-new-h { padding: 6px 8px 4px; font-size: 11px; font-weight: 500; letter-spacing: .08em; text-transform: uppercase; color: var(--wa-muted); }
    .ap-new-row {
      display: flex; align-items: center; gap: 10px; min-height: 36px; padding: 0 10px; border-radius: 6px; cursor: pointer;
      font-size: 13px; text-align: left; color: var(--wa-ink); background: transparent; border: 1px solid var(--wa-line);
      box-shadow: inset 3px 0 0 var(--dc);
    }
    .ap-new-row:hover { background: var(--wa-hover); border-color: var(--wa-line-strong); }
    .ap-new-row:focus-visible { outline: none; box-shadow: inset 3px 0 0 var(--dc), var(--wa-ring); }
    .ap-new-row svg { width: 14px; height: 14px; flex: none; color: var(--wa-muted); }

    /* The rest of the Complications surface's rules in panel.ts (\`.pk-*\`)
       this tab uses: the segments, Multi select and its bar. Keep the two
       in step. */
    .pk-seg {
      display: inline-flex; flex: none; gap: 2px; padding: 2px; height: 28px;
      border: 1px solid var(--wa-line-strong); border-radius: 6px; background: var(--wa-field);
    }
    .pk-seg-btn {
      display: inline-flex; align-items: center; gap: 6px; font: inherit; font-size: 12.5px;
      padding: 0 9px; border: 0; border-radius: 4px; font-weight: 600;
      background: transparent; color: var(--wa-muted); cursor: pointer;
      transition: background .12s ease, color .12s ease;
    }
    .pk-seg-btn svg { width: 14px; height: 14px; }
    .pk-seg-btn:hover { color: var(--wa-ink); }
    .pk-seg-btn.on { background: var(--wa-seg-on); color: var(--wa-ink); }
    .pk-seg-btn:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .pk-seg-btn:disabled { opacity: .45; cursor: default; }
    /* A status page's picture: the watch's black screen, one screen tall. */
    .ap-pic-status .sp-screen { pointer-events: none; }
    .pk-pick-btn {
      display: inline-flex; align-items: center; gap: 6px; flex: none; font: inherit; font-size: 12.5px;
      height: 28px; padding: 0 10px; border-radius: 6px; border: 1px solid var(--wa-line-strong);
      background: var(--wa-field); color: var(--wa-ink); cursor: pointer; font-weight: 600;
    }
    .pk-pick-btn:hover:not(:disabled) { border-color: color-mix(in srgb, var(--wa-ink) 34%, var(--wa-card)); }
    .pk-pick-btn:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .pk-pick-btn:disabled { opacity: .45; cursor: default; }
    .pk-pick-btn svg { width: 14px; height: 14px; }
    .pk-pick-btn.on { border-color: transparent; background: var(--wa-seg-on); color: var(--wa-ink); }

    /* The panel's small buttons (form-styles.ts), for the bar. */
    button.small {
      display: inline-flex; align-items: center; gap: 5px;
      font: inherit; font-size: 13px; font-weight: 600; padding: 0 9px; min-height: 26px; border-radius: 6px; cursor: pointer;
      border: 1px solid transparent; background: var(--wa-field); color: var(--wa-ink);
      transition: background-color .12s ease-out, border-color .12s ease-out, box-shadow .12s ease-out;
    }
    button.small:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    button.small:disabled { opacity: .45; cursor: default; }
    button.small > svg { width: 13px; height: 13px; flex: none; }
    button.primary { background: var(--wa-primary-bg); color: var(--wa-primary-ink); border-color: transparent; }
    button.primary:hover:not(:disabled) { background: color-mix(in srgb, var(--wa-primary-bg) 85%, var(--wa-muted)); }

    /* The bar under the tabs while pages are picked, the Complications
       list's. */
    .pk-bar {
      display: flex; align-items: center; flex-wrap: wrap; gap: 8px; flex: none;
      padding: 8px 18px; border-bottom: 1px solid var(--wa-line); background: var(--wa-card);
    }
    .pk-bar-count { font-size: 12px; color: var(--wa-muted); min-width: 90px; }
    .pk-bar-said { min-width: 0; font-size: 12px; line-height: 1.4; color: var(--wa-ink); }
    .pk-bar-said.ok { color: var(--wa-ok, var(--wa-ink)); }
    .pk-bar-said.warn, .pk-bar-said.err { color: var(--wa-need); }
    .pk-bar-ask { flex: 1 1 260px; min-width: 0; font-size: 12px; line-height: 1.4; color: var(--wa-ink); }
    .pk-bar-ask b { font-weight: 600; }
    .pk-bar-gap { flex: 1; min-width: 0; }
    .pk-bar button.ghost {
      font-size: 12.5px; min-height: 28px; padding: 0 10px; border-radius: 8px;
      border-color: var(--wa-line); background: var(--wa-panel); color: var(--wa-ink);
    }
    .pk-bar button.ghost:hover:not(:disabled), .pk-bar button.ghost.on { border-color: var(--wa-line-strong); background: var(--wa-card); }
    .pk-bar button.ghost.danger {
      color: var(--error-color, #b42318);
      border-color: color-mix(in srgb, var(--error-color, #b42318) 45%, var(--wa-line));
      background: color-mix(in srgb, var(--error-color, #b42318) 10%, var(--wa-panel));
    }
    .pk-bar button.ghost.danger:hover:not(:disabled) {
      background: color-mix(in srgb, var(--error-color, #b42318) 18%, var(--wa-panel));
    }
    .pk-bar button.ghost svg { width: 14px; height: 14px; color: var(--wa-muted); }
    .pk-bar button.ghost.danger svg { color: inherit; }
    .pk-bar-done { margin-left: 4px; }
    .pk-bar-done svg { width: 14px; height: 14px; }
    /* Add to and Remove from open downwards, over the cards. */
    .pk-bar-menu { position: relative; display: inline-flex; }
    .pk-bar-list {
      position: absolute; top: calc(100% + 6px); right: 0; z-index: 8; min-width: 220px; max-width: calc(100vw - 32px);
      display: flex; flex-direction: column; gap: 2px; padding: 6px;
      border: 1px solid var(--wa-line); border-radius: 10px; background: var(--wa-card); box-shadow: 0 10px 30px rgba(0,0,0,.35);
    }
    .pk-bar-head { font-size: 11.5px; font-weight: 700; color: var(--wa-muted); margin: 2px 4px 4px; }
    .pk-bar-row {
      display: flex; align-items: center; gap: 8px; width: 100%; padding: 6px 8px; border: 0; border-radius: 7px;
      font: inherit; font-size: 12.5px; color: var(--wa-ink); background: transparent; cursor: pointer; text-align: left;
    }
    .pk-bar-row:hover:not(:disabled) { background: color-mix(in srgb, var(--wa-ink) 9%, transparent); }
    .pk-bar-row:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .pk-bar-row:disabled { opacity: .5; cursor: default; }
    .pk-bar-row svg { width: 15px; height: 15px; flex: none; color: var(--dc, var(--wa-muted)); }
    .pk-bar-row { box-shadow: inset 3px 0 0 var(--dc, transparent); }
    .pk-bar-row-n { flex: none; font-size: 10.5px; color: var(--wa-muted); }
    .pk-bar-note { margin: 4px 4px 2px; padding-top: 6px; border-top: 1px solid var(--wa-line); font-size: 10.5px; line-height: 1.4; color: var(--wa-muted); }
    /* A card's tick while picking: a box, not the panel's switch. */
    input.pk-card-pick {
      appearance: none; -webkit-appearance: none; position: relative; flex: none; margin: 0; cursor: pointer;
      width: 17px; height: 17px; border-radius: 5px; border: 0;
      background: color-mix(in srgb, var(--wa-ink) 8%, transparent);
      box-shadow: inset 0 0 0 1.5px var(--wa-line-strong);
    }
    input.pk-card-pick::after {
      content: ""; position: absolute; top: 2px; left: 6px; width: 4px; height: 8.5px; opacity: 0;
      border: solid var(--wa-primary-ink, #fff); border-width: 0 2px 2px 0;
      transform: rotate(45deg); transition: opacity .1s ease-out;
    }
    input.pk-card-pick:checked { background: var(--wa-accent); box-shadow: inset 0 0 0 1.5px var(--wa-accent); }
    input.pk-card-pick:checked::after { opacity: 1; }
    input.pk-card-pick:hover:not(:disabled) { box-shadow: inset 0 0 0 1.5px var(--wa-accent); }
    input.pk-card-pick:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    input.pk-card-pick:disabled { opacity: .45; cursor: default; }

    /* The page alone in a plain outline: no case, no clock, no page dots,
       no fold line. */
    .ap-pic {
      position: relative; display: block; max-width: 100%; overflow: hidden; line-height: 0; pointer-events: none;
      border-radius: 10px; box-shadow: 0 0 0 1px var(--wa-line-strong);
    }
    .ap-pic-in { display: block; }
    .ap-pic .wa-watch { padding: 0; margin: 0; background: none; box-shadow: none; border-radius: 0; }
    .ap-pic .wa-watch::before, .ap-pic .wa-watch::after { display: none; }
    .ap-pic .wa-watch > .wp-screen { border-radius: 0; }
    .ap-pic :is(.wp-clock, .wp-pages, .wp-fold) { display: none; }
    /* A page taller than the picture fades out at its foot. */
    .ap-pic.cut::after {
      content: ""; position: absolute; left: 0; right: 0; bottom: 0; height: 36px;
      background: linear-gradient(to bottom, transparent, rgba(0, 0, 0, .75));
    }
    /* Picking: every click on the card picks it, and a picked card wears
       the Complications card's ink ring. */
    .ap-card.picking { cursor: pointer; user-select: none; }
    .ap-card.picked { border-color: var(--wa-ink); box-shadow: 0 0 0 1px var(--wa-ink); }
    /* A phone: the bar folds with the head (\`listTabStyles\`). */
    @media (max-width: 640px) {
      .pk-bar { padding: 8px 10px; }
    }
  `];
}

if (!customElements.get("wa-all-pages")) customElements.define("wa-all-pages", WaAllPages);

declare global {
  interface HTMLElementTagNameMap {
    "wa-all-pages": WaAllPages;
  }
}
