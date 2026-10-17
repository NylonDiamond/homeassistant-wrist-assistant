// The Menus tab: every device's Anywhere menu and Entity quick menu, one card
// each, as the Pages tab lists pages (`watch-pages/all-pages.ts`).
//
// A linked menu is one card with a chip per device that shares it. The head
// is the Pages tab's without Multi select or New (every device already has
// both menus): the Device menu (watches or iPhones) and the search, over a
// row of device tabs. A card opens its menu in that device's menu editor,
// and its Devices menu shares the menu with another device or stops sharing
// it, the editor's own menu (`menu-devices.ts`) with the same writes: the
// link (`watch_pages/link`, asking before it replaces a device's own menu)
// and the unlink (`unlinkMenuUnit`). What can be worked out without the
// element is in `all-menus-model.ts`.
//
// An unlinked card whose menu is the very same as another device's says so
// ("Same as Chen's Watch's."), and its Link links them in one call with
// `replace`, asking nothing (`sameMenuLink`). The cards then fold into one.
//
// Every device's menus are read when the tab opens, with its pages and its
// status pages for the lines of a card's Devices menu, and a device's again
// whenever Home Assistant says one of them changed. The panel loads this
// file the first time the tab opens (`all-menus-hook.ts`).

import { LitElement, css, html, nothing, type PropertyValues, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import {
  type HassLike,
  type OwnerSummary,
  type WatchPagesPlaces,
  fetchWatchConfig,
  fetchWatchPagesPlaces,
  linkWatchMenus,
  saveWatchConfig,
  subscribeWatchConfig,
} from "../ha-api.js";
import { deviceColor, deviceColorsCache } from "../device-colors.js";
import { type IconProvider, REFERENCE_CASE } from "../renderer.js";
import { uiIcon } from "../ui-icons.js";
import { ALL_FILTER, type PagesFilter, type PagesKind, hasBothKinds, resolveFilter, resolveKind } from "../watch-pages/all-pages-model.js";
import { devicesMenuStyles } from "../watch-pages/devices-menu.js";
import { listTabStyles } from "../watch-pages/list-tab-styles.js";
import {
  type LinkDevice,
  type PageDevicePlace,
  type PagesRecordFacts,
  awaitingMove,
  joinWords,
  linkAlsoAddedText,
  linkDevicesOf,
  pagesRecordFacts,
} from "../watch-pages/links.js";
import { type WatchPagesDocument, asWatchPagesDocument } from "../watch-pages/model.js";
import { type WatchPagesNote, watchCommandError } from "../watch-pages/save-note.js";
import { asStatusPagesDocument, statusPageId, statusPagesOf } from "../watch-status-pages/model.js";
import {
  MENU_CARD_DIRTY_TEXT,
  type MenuCard,
  type MenuCopy,
  allMenusLead,
  menuCardDetail,
  menuCardGroup,
  menuCardSource,
  menuCards,
  menuCopyOn,
  menuFilterChips,
  menuKindOptions,
  MENU_SECTION_TITLES,
  menuSections,
  menusEmptyText,
  openMenuCopy,
  sameMenuDevices,
  sameMenuLink,
  sameMenuLinkedText,
  sameMenuText,
  shownMenuCards,
} from "./all-menus-model.js";
import { askWatchMenu, keptWatchMenusDraft } from "./draft.js";
import { menuDevicesStyles, renderMenuDevicesMenu } from "./menu-devices.js";
import { watchMenuPageTargets } from "./menu-editor.js";
import {
  MENU_UNIT_NAMES,
  type MenuLinkUnit,
  menuLinkErrorText,
  menuIsUntouched,
  menuReplaceAsk,
  unlinkMenuUnit,
} from "./menu-links.js";
import "./menu-thumbs.js";
import { type MenusDocument, asWatchMenusDocument } from "./model.js";

/** How tall a card's picture of its menu is, in CSS pixels. */
const PIC_H = 180;
/** A menu is one menu on every device, so its picture is drawn on one
 * screen for every card, as the Pages tab draws its pages. */
const PIC_SCREEN = REFERENCE_CASE.screen;
/** How often a stream of state changes draws the pictures again. */
const STATES_EVERY_MS = 2000;
/** How long after a change event a device is read again, so a burst of
 * saves reads once. */
const RELOAD_DELAY_MS = 250;

/** Where the tab's view is remembered in this browser, as the Pages tab
 * remembers its. */
const VIEW_STORE_KEY = "wrist-assistant-panel.all-menus.v1";

/** The device tab and the Device menu last used. */
interface KeptView {
  filter?: PagesFilter;
  kind: PagesKind;
}

let kept: KeptView | undefined;

/** The view as last left, read once from storage. A browser with storage
 * off keeps it while the panel is open. */
function keptView(): KeptView {
  if (kept !== undefined) return kept;
  const view: KeptView = { kind: "all" };
  try {
    const raw = window.localStorage.getItem(VIEW_STORE_KEY);
    const saved = raw ? (JSON.parse(raw) as { filter?: unknown; kind?: unknown }) : {};
    if (typeof saved.filter === "string") view.filter = saved.filter;
    if (saved.kind === "watch" || saved.kind === "iphone") view.kind = saved.kind;
  } catch {
    /* Storage off: the defaults. */
  }
  kept = view;
  return view;
}

function keepView(change: Partial<KeptView>): void {
  kept = { ...keptView(), ...change };
  try {
    window.localStorage.setItem(VIEW_STORE_KEY, JSON.stringify(kept));
  } catch {
    /* Storage off: the choice still holds while the panel is open. */
  }
}

/** The card a Devices menu is open on, named by one of its copies: a card's
 * key moves when its menu is linked or unlinked. */
interface MenuAt {
  ownerId: string;
  unit: MenuLinkUnit;
}

/** A tick that met a device with its own menu there, asked about first. */
interface ReplaceAsk {
  source: string;
  unit: MenuLinkUnit;
  target: string;
}

/** Whether a device's menu editor holds unsaved edits in this tab. */
const dirtyHere = (ownerId: string): boolean => keptWatchMenusDraft(ownerId)?.dirty ?? false;

/** One device's three records as read: its menus (undefined for none), what
 * its menus record said, its pages and its status page ids. "failed" when
 * the menus could not be read. */
type DeviceRead = {
  menus: MenusDocument | undefined;
  facts: PagesRecordFacts;
  pages: WatchPagesDocument | undefined;
  statusPages: { id: string }[] | undefined;
} | "failed";

export class WaAllMenus extends LitElement {
  @property({ attribute: false }) owners: readonly OwnerSummary[] = [];
  @property({ attribute: false }) ownersReady = false;
  @property({ attribute: false }) phones = false;
  @property({ attribute: false }) icons?: IconProvider;
  @property({ attribute: false }) iconsTick = 0;
  /** Open a device's menu editor. The element has already asked it for the
   * card's menu (`askWatchMenu`). */
  @property({ attribute: false }) onOpen?: (ownerId: string, kind: "watch" | "iphone") => void;

  /** Each device's menus as last read; a device with none is missing. */
  @state() private docs: ReadonlyMap<string, MenusDocument> = new Map();
  /** What each device's menus record said: whether Home Assistant holds
   * one, for the watches that wait for their iPhone. */
  @state() private facts: ReadonlyMap<string, PagesRecordFacts> = new Map();
  /** Each device's pages, for the names of the pages a link brings. */
  @state() private pages: ReadonlyMap<string, WatchPagesDocument> = new Map();
  /** Each device's status page ids, for how many a link brings. */
  @state() private statusPages: ReadonlyMap<string, { id: string }[]> = new Map();
  /** The devices whose menus could not be read last time. */
  @state() private failed: readonly string[] = [];
  @state() private readState: "idle" | "loading" | "ready" = "idle";
  /** Where every link is (`watch_pages/places`); undefined on an
   * integration without linked pages, which leaves the Devices menus off. */
  @state() private places?: WatchPagesPlaces;
  @state() private linksOn = true;
  @state() private search = "";
  @state() private menuAt?: MenuAt;
  @state() private linking = false;
  @state() private devicesNote?: WatchPagesNote;
  @state() private replaceAsk?: ReplaceAsk;
  /** What a card's Same as Link did, on the card by one of its copies. */
  @state() private sameNote?: { at: MenuAt; note: WatchPagesNote };

  private hassNow?: HassLike;
  private hassDrawnAt = 0;
  private loadSeq = 0;
  private readSeq = new Map<string, number>();
  private reloadTimers = new Map<string, number>();
  /** The device ids read and listened to, as one string. */
  private deviceSig?: string;
  private unsubscribers: (() => Promise<void> | void)[] = [];
  private subscribeSeq = 0;
  private cardsMemo?: { docs: ReadonlyMap<string, MenusDocument>; devices: readonly LinkDevice[]; cards: MenuCard[] };
  private sameMemo?: { cards: readonly MenuCard[]; same: Map<string, LinkDevice[]> };

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

  private colorsFor = deviceColorsCache();

  /** A device's color (`device-colors.ts`), the one it wears on every tab. */
  private colorOf = (ownerId: string): string | undefined => deviceColor(this.colorsFor(this.owners), ownerId);

  /** Every device a menu can be on, the editor's list. */
  private get devices(): LinkDevice[] {
    return linkDevicesOf(this.owners, this.phones);
  }

  private get cards(): MenuCard[] {
    const devices = this.devices;
    const memo = this.cardsMemo;
    if (memo !== undefined && memo.docs === this.docs && memo.devices.length === devices.length
      && memo.devices.every((d, i) => d.ownerId === devices[i]!.ownerId && d.name === devices[i]!.name)) return memo.cards;
    const cards = menuCards(devices, this.docs);
    this.cardsMemo = { docs: this.docs, devices, cards };
    return cards;
  }

  /** For each unlinked card, the devices that hold the same menu
   * (`sameMenuDevices`), worked out again only when the cards change. */
  private sameOf(cards: readonly MenuCard[]): Map<string, LinkDevice[]> {
    if (this.sameMemo?.cards === cards) return this.sameMemo.same;
    const same = sameMenuDevices(cards);
    this.sameMemo = { cards, same };
    return same;
  }

  private get filter(): PagesFilter {
    return resolveFilter(keptView().filter, this.devices);
  }

  private get deviceKind(): PagesKind {
    return resolveKind(keptView().kind, this.devices);
  }

  // ── reading ────────────────────────────────────────────────────────────

  /** Read every device, and where the links are. Only the newest read
   * lands. */
  private async loadAll(): Promise<void> {
    const hass = this.hassNow;
    if (!hass) return;
    const seq = ++this.loadSeq;
    const devices = this.devices;
    if (this.readState === "idle") this.readState = "loading";
    const placesRead = fetchWatchPagesPlaces(hass).then(
      (reply): WatchPagesPlaces | undefined | "kept" => reply,
      (err: unknown) => (watchCommandError(err).code === "unknown_command" ? undefined : "kept"),
    );
    const reads = await Promise.all(devices.map(async (d) => [d.ownerId, await this.readOne(hass, d.ownerId)] as const));
    const places = await placesRead;
    if (seq !== this.loadSeq) return;
    const docs = new Map<string, MenusDocument>();
    const facts = new Map<string, PagesRecordFacts>();
    const pages = new Map<string, WatchPagesDocument>();
    const statusPages = new Map<string, { id: string }[]>();
    const failed: string[] = [];
    for (const [ownerId, read] of reads) {
      if (read === "failed") {
        failed.push(ownerId);
        const held = this.docs.get(ownerId);
        if (held !== undefined) docs.set(ownerId, held);
        const known = this.facts.get(ownerId);
        if (known !== undefined) facts.set(ownerId, known);
        continue;
      }
      if (read.menus !== undefined) docs.set(ownerId, read.menus);
      facts.set(ownerId, read.facts);
      if (read.pages !== undefined) pages.set(ownerId, read.pages);
      if (read.statusPages !== undefined) statusPages.set(ownerId, read.statusPages);
    }
    this.docs = docs;
    this.facts = facts;
    this.pages = pages;
    this.statusPages = statusPages;
    this.failed = failed;
    if (places !== "kept") {
      this.places = places;
      this.linksOn = places !== undefined;
    }
    this.readState = "ready";
  }

  /** One device's menus, pages and status pages. Only the menus failing
   * fails the read; the others then say nothing about what a link brings. */
  private async readOne(hass: HassLike, ownerId: string): Promise<DeviceRead> {
    const quiet = <T>(p: Promise<T>): Promise<T | undefined> => p.then((v) => v, () => undefined);
    const [menus, pagesRecord, statusRecord] = await Promise.all([
      quiet(fetchWatchConfig(hass, ownerId, "menus")),
      quiet(fetchWatchConfig(hass, ownerId, "pages")),
      quiet(fetchWatchConfig(hass, ownerId, "status_pages")),
    ]);
    if (menus === undefined) return "failed";
    const statusDoc = statusRecord !== undefined && statusRecord.revision > 0 ? asStatusPagesDocument(statusRecord.document) : undefined;
    return {
      menus: menus.revision > 0 ? asWatchMenusDocument(menus.document) : undefined,
      facts: pagesRecordFacts(menus),
      pages: pagesRecord !== undefined && pagesRecord.revision > 0 ? asWatchPagesDocument(pagesRecord.document) : undefined,
      statusPages: statusDoc === undefined ? undefined : statusPagesOf(statusDoc).map((p) => ({ id: statusPageId(p) })),
    };
  }

  /** Read one device again after a change there. */
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
      void this.readOne(hass, ownerId).then((read) => {
        if (seq !== this.readSeq.get(ownerId) || all !== this.loadSeq || read === "failed") return;
        const put = <V>(map: ReadonlyMap<string, V>, value: V | undefined): Map<string, V> => {
          const next = new Map(map);
          if (value === undefined) next.delete(ownerId);
          else next.set(ownerId, value);
          return next;
        };
        this.docs = put(this.docs, read.menus);
        this.facts = put(this.facts, read.facts);
        this.pages = put(this.pages, read.pages);
        this.statusPages = put(this.statusPages, read.statusPages);
      });
    }, RELOAD_DELAY_MS));
  }

  /** Hear every save of each device's menus, pages and status pages,
   * whoever made it. A menus save on one device of a link saves the others
   * too, and each says so. */
  private startSubscriptions(devices: readonly LinkDevice[]): void {
    this.endSubscriptions();
    const hass = this.hassNow;
    if (!hass) return;
    const seq = this.subscribeSeq;
    for (const device of devices) {
      const ownerId = device.ownerId;
      subscribeWatchConfig(hass, ownerId, (event) => {
        if (seq !== this.subscribeSeq) return;
        if (event.kind === "menus" || event.kind === "pages" || event.kind === "status_pages") this.reloadOne(ownerId);
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
    keepView({ filter });
    this.requestUpdate();
    this.closeDevices();
  }

  private setDeviceKind(kind: PagesKind): void {
    keepView({ kind });
    this.requestUpdate();
    this.closeDevices();
  }

  /** Open the menu in its device's menu editor, on that menu. */
  private open(card: MenuCard): void {
    const copy = openMenuCopy(card, this.filter, this.deviceKind);
    askWatchMenu(copy.device.ownerId, card.unit);
    this.onOpen?.(copy.device.ownerId, copy.device.kind);
  }

  private cardOfMenu(cards: readonly MenuCard[]): MenuCard | undefined {
    const at = this.menuAt;
    if (at === undefined) return undefined;
    return cards.find((c) => c.unit === at.unit && menuCopyOn(c, at.ownerId) !== undefined);
  }

  private openDevices(card: MenuCard): void {
    this.menuAt = { ownerId: card.copies[0]!.device.ownerId, unit: card.unit };
    this.devicesNote = undefined;
    this.replaceAsk = undefined;
    void this.updateComplete.then(() => {
      this.renderRoot.querySelector?.<HTMLElement>(".me-dev-menu")?.scrollIntoView({ block: "nearest" });
    });
  }

  private closeDevices(): void {
    this.menuAt = undefined;
    this.devicesNote = undefined;
    this.replaceAsk = undefined;
  }

  private deviceName(ownerId: string): string {
    return this.devices.find((d) => d.ownerId === ownerId)?.name ?? "the other device";
  }

  /** A switch flipped: tick shares the menu with that device, untick stops
   * sharing it there and leaves that device's menu as it is. */
  private toggle(card: MenuCard, place: PageDevicePlace): void {
    if (place.stuck !== undefined || this.linking) return;
    if (place.on) {
      void this.unlink(card, place.device.ownerId);
      return;
    }
    const source = menuCardSource(card, dirtyHere);
    if (source === undefined) {
      this.devicesNote = { kind: "warn", text: MENU_CARD_DIRTY_TEXT };
      return;
    }
    void this.link(source, card.unit, place.device.ownerId);
  }

  /**
   * Put the menu, as saved on `source`, on `target`, linked, with the pages
   * and status pages its slots open. A device with its own menu there is
   * refused `unit_taken`: the question comes up in the menu, and Replace
   * sends the link again with `replace`. A device whose menu there is still
   * the app's own, linked to nothing, loses nothing, so it is replaced at
   * once with no question, as the editor does. That is judged on a fresh
   * read of its menus, never the tab's copy.
   */
  private async link(source: string, unit: MenuLinkUnit, target: string, replace = false): Promise<void> {
    const hass = this.hassNow;
    if (!hass || this.linking) return;
    this.linking = true;
    this.devicesNote = undefined;
    this.replaceAsk = undefined;
    let again = false;
    try {
      const reply = await linkWatchMenus(hass, source, [unit], [target], replace);
      const also = linkAlsoAddedText(reply, target, [], this.pages.get(source));
      this.devicesNote = { kind: "ok", text: [`The ${MENU_UNIT_NAMES[unit]} is on ${this.deviceName(target)} now.`, also].filter((t) => t !== undefined).join(" ") };
      this.menuAt = { ownerId: source, unit };
    } catch (err) {
      if (watchCommandError(err).code === "unit_taken" && !replace) {
        // Read fresh: the tab's copy can miss an edit saved since.
        again = await menuIsUntouched((o) => fetchWatchConfig(hass, o, "menus"), target, unit);
        if (!again) this.replaceAsk = { source, unit, target };
      } else this.devicesNote = { kind: "err", text: `Not added. ${menuLinkErrorText(err)}` };
    } finally {
      this.linking = false;
    }
    if (again) {
      await this.link(source, unit, target, true);
      return;
    }
    if (this.replaceAsk === undefined) await this.loadAll();
  }

  /** Stop sharing the menu with `owner`: its menu stays as it is, linked to
   * nothing. The menu stays open on a copy the change left in place. */
  private async unlink(card: MenuCard, owner: string): Promise<void> {
    const hass = this.hassNow;
    if (!hass || this.linking) return;
    this.linking = true;
    this.devicesNote = undefined;
    this.replaceAsk = undefined;
    const result = await unlinkMenuUnit({
      read: (o) => fetchWatchConfig(hass, o, "menus"),
      save: (o, base, document) => saveWatchConfig(hass, o, "menus", base, document),
    }, owner, card.unit);
    this.linking = false;
    const name = this.deviceName(owner);
    this.devicesNote = result.ok
      ? { kind: "ok", text: `Unlinked ${name}. Its ${MENU_UNIT_NAMES[card.unit]} stays as it is.` }
      : { kind: "err", text: `Not unlinked. ${menuLinkErrorText(Object.assign(new Error(result.message), { code: result.code }))}` };
    const stays = card.copies.find((c) => c.device.ownerId !== owner);
    if (stays !== undefined && this.menuAt !== undefined) this.menuAt = { ownerId: stays.device.ownerId, unit: card.unit };
    await this.loadAll();
  }

  /**
   * A card's Same as Link: the menu, as saved on the card's device, onto
   * every device that holds the same one (`sameMenuLink`), in one call with
   * `replace` and no question, since nothing differs. The pages and status
   * pages its slots open come along, as for any menu link. Then every device
   * is read again, and the one card left says what happened.
   */
  private async linkSame(card: MenuCard): Promise<void> {
    const hass = this.hassNow;
    if (!hass || this.linking) return;
    const plan = sameMenuLink(card, this.sameOf(this.cards), dirtyHere);
    if (plan === undefined) return;
    const at: MenuAt = { ownerId: card.copies[0]!.device.ownerId, unit: card.unit };
    if (plan === "dirty") {
      this.sameNote = { at, note: { kind: "warn", text: MENU_CARD_DIRTY_TEXT } };
      return;
    }
    this.linking = true;
    this.sameNote = undefined;
    let note: WatchPagesNote;
    try {
      const reply = await linkWatchMenus(hass, plan.source, [plan.unit], plan.targets, true);
      const also = [...new Set(plan.targets.flatMap((t) => linkAlsoAddedText(reply, t, [], this.pages.get(plan.source)) ?? []))];
      note = { kind: "ok", text: [sameMenuLinkedText(plan.unit, plan.targets.map((t) => this.deviceName(t))), ...also].join(" ") };
    } catch (err) {
      note = { kind: "err", text: `Not linked. ${menuLinkErrorText(err)}` };
    } finally {
      this.linking = false;
    }
    this.sameNote = { at, note };
    await this.loadAll();
  }

  /** Escape closes the replace question, then a card's Devices menu. */
  private onKeyDown = (e: KeyboardEvent): void => {
    if (e.key !== "Escape") return;
    if (this.replaceAsk !== undefined && !this.linking) {
      e.preventDefault();
      this.replaceAsk = undefined;
    } else if (this.menuAt !== undefined) {
      e.preventDefault();
      this.closeDevices();
    }
  };

  /** A press outside an open Devices menu and its button closes it. */
  private onWindowPointerDown = (e: PointerEvent): void => {
    if (this.menuAt === undefined) return;
    const within = e.composedPath().some((el) => el instanceof Element && (el.classList.contains("me-dev-menu") || el.classList.contains("ap-dev-open")));
    if (!within) this.closeDevices();
  };

  // ── drawing ────────────────────────────────────────────────────────────

  protected override render(): TemplateResult {
    const devices = this.devices;
    if (devices.length === 0 && !this.ownersReady) return html`<div class="ap-page"><div class="ap-wrap"><p class="ap-empty">Loading…</p></div></div>`;
    const cards = this.cards;
    const filter = this.filter;
    const kind = this.deviceKind;
    const shown = shownMenuCards(cards, filter, this.search, kind);
    const loading = this.readState !== "ready" && cards.length === 0;
    const failed = this.failed.map((id) => devices.find((d) => d.ownerId === id)?.name).filter((n): n is string => n !== undefined);
    const tabbed = devices.length > 1;
    const hint = `Click a menu to edit it.${this.linksOn && devices.length > 1 ? " Devices on a card shares it with another watch or iPhone." : ""}`;
    const reading = "Reading every device's menus…";
    return html`<div class="ap-page"><div class="ap-wrap">
      <div class="ap-head">
        <div class="ap-head-text">
          <h1>Menus</h1>
          <p class="ap-lead">${loading ? reading : allMenusLead(cards.length)}</p>
        </div>
      </div>
      ${failed.length === 0 ? nothing : html`<p class="ap-warn" role="status">Could not read the menus of ${failed.join(", ")}. They show as last read.</p>`}
      <div class="pk-surface pk-page" role="region" aria-label="Your menus">
        <div class="pk-pin">
          ${this.renderHead(cards, filter, devices)}
          ${tabbed ? this.renderTabs(devices, cards, filter) : nothing}
        </div>
        <div class="pk-body" role=${tabbed ? "tabpanel" : nothing} aria-labelledby=${tabbed ? `am-tab-${filter}` : nothing}>
          ${loading ? html`<p class="ap-empty">${reading}</p>`
            : shown.length === 0 ? html`<p class="ap-empty">${menusEmptyText(filter, devices, this.search, kind)}</p>`
            : this.renderSections(shown, devices, cards)}
        </div>
        <div class="pk-foot"><span class="pk-foot-hint">${hint}</span></div>
      </div>
    </div></div>`;
  }

  /** The cards in two sections, Anywhere menus first, then Entity quick
   * menus, each under its own heading. A section with no card is left
   * out. */
  private renderSections(shown: readonly MenuCard[], devices: readonly LinkDevice[], cards: readonly MenuCard[]): TemplateResult {
    return html`${menuSections(shown).map(({ unit, cards: inUnit }) => html`<section class="am-section" aria-labelledby=${`am-section-${unit}`}>
      <h2 class="am-section-title" id=${`am-section-${unit}`}>${MENU_SECTION_TITLES[unit]} <span class="am-section-n">${inUnit.length}</span></h2>
      <div class="ap-grid" role="list">${inUnit.map((card) => this.renderCard(card, devices, cards))}</div>
    </section>`)}`;
  }

  /** The head, the Pages tab's without Multi select: the Device menu and
   * the search at the right. */
  private renderHead(cards: readonly MenuCard[], filter: PagesFilter, devices: readonly LinkDevice[]): TemplateResult {
    return html`<div class="pk-head">
      ${hasBothKinds(devices) ? this.renderKinds(cards, filter) : nothing}
      <label class="pk-search">
        ${uiIcon("search")}
        <input type="search" class="pk-search-input" .value=${this.search} placeholder="Search by menu or device" aria-label="Search menus"
          @input=${(e: InputEvent) => { this.search = (e.target as HTMLInputElement).value; }} />
      </label>
    </div>`;
  }

  /** The Device menu: All, Watches, iPhones, each with how many menus the
   * tab and the search have left. */
  private renderKinds(cards: readonly MenuCard[], filter: PagesFilter): TemplateResult {
    const kind = this.deviceKind;
    const options = menuKindOptions(shownMenuCards(cards, filter, this.search));
    return html`<label class="pk-shape">
      <span class="pk-shape-lead">Device</span>
      <select aria-label="Show the menus on one kind of device" .value=${kind}
        @change=${(e: Event) => this.setDeviceKind((e.target as HTMLSelectElement).value as PagesKind)}>
        ${options.map((o) => html`<option value=${o.key} ?selected=${o.key === kind}>${o.label} (${o.count})</option>`)}
      </select>
    </label>`;
  }

  /** The device tabs: All, then a tab per device with how many menus it
   * holds, the selected one underlined. */
  private renderTabs(devices: readonly LinkDevice[], cards: readonly MenuCard[], filter: PagesFilter): TemplateResult {
    return html`<div class="pk-tabs" role="tablist" aria-label="Devices">
      ${menuFilterChips(devices, cards, this.colorOf).map((chip) => html`<button type="button" role="tab" class="pk-tab ${chip.id === filter ? "on" : ""}"
        style=${chip.color === undefined ? nothing : `--dc:${chip.color}`} id=${`am-tab-${chip.id}`} aria-selected=${chip.id === filter ? "true" : "false"}
        title=${chip.id === ALL_FILTER ? "Every menu on every device" : `The menus on ${chip.label}`}
        @click=${() => this.setFilter(chip.id)}>
        <span class="pk-tab-glyph" aria-hidden="true">${uiIcon(chip.kind === undefined ? "grid" : chip.kind === "iphone" ? "phone" : "watch")}</span>
        <span class="pk-tab-name">${chip.label}</span>
        <span class="pk-tab-count">${chip.count}</span>
      </button>`)}
    </div>`;
  }

  private renderCard(card: MenuCard, devices: readonly LinkDevice[], cards: readonly MenuCard[]): TemplateResult {
    const copy = openMenuCopy(card, this.filter, this.deviceKind);
    const menuOpen = this.cardOfMenu(cards)?.key === card.key;
    const devicesOn = this.linksOn && devices.length > 1;
    const title = `Edit the ${card.name} on ${copy.device.name}`;
    const color = (ownerId: string) => `--dc:${this.colorOf(ownerId) ?? "var(--wa-line-strong)"}`;
    return html`<div class="ap-card ${menuOpen ? "over" : ""}" role="listitem" data-card=${card.key}>
      <div class="ap-top">
        <button type="button" class="ap-open" title=${title} @click=${() => this.open(card)}>
          <b class="ap-name">${card.name}</b>
          <small class="ap-detail">${menuCardDetail(card)}</small>
        </button>
      </div>
      <button type="button" class="ap-thumb" tabindex="-1" aria-hidden="true" title=${title} @click=${() => this.open(card)}>
        ${this.renderThumb(card, copy)}
      </button>
      ${this.renderSame(card, cards, devicesOn)}
      <div class="ap-foot">
        <span class="ap-devs">${card.copies.map((c) => html`<span class="ap-dev" style=${color(c.device.ownerId)} title=${`On ${c.device.name}`}>
          ${uiIcon(c.device.kind === "iphone" ? "phone" : "watch")}<span class="ap-dev-n">${c.device.name}</span>
        </span>`)}</span>
        ${devicesOn ? html`<button type="button" class="ap-dev-open ${menuOpen ? "on" : ""}" aria-expanded=${menuOpen ? "true" : "false"}
          title=${card.copies.length > 1 ? `Pick the devices that share this ${card.name}` : `Share this ${card.name} with other devices`}
          @click=${() => (menuOpen ? this.closeDevices() : this.openDevices(card))}>${uiIcon("phone")}<span>Devices</span>${uiIcon("chevron")}</button>` : nothing}
      </div>
      ${menuOpen ? this.renderMenu(card, devices) : nothing}
    </div>`;
  }

  /** Over an unlinked card's chips while another device holds the very same
   * menu: "Same as Chen's Watch's." and Link, when menus can be linked here.
   * Then what the last Link did, on the card it was for. */
  private renderSame(card: MenuCard, cards: readonly MenuCard[], linkable: boolean): TemplateResult | typeof nothing {
    const twins = this.sameOf(cards).get(card.key);
    const at = this.sameNote?.at;
    const note = at !== undefined && card.unit === at.unit && menuCopyOn(card, at.ownerId) !== undefined ? this.sameNote!.note : undefined;
    if (twins === undefined && note === undefined) return nothing;
    return html`<div class="ap-same">
      ${twins === undefined ? nothing : html`<div class="ap-same-row"><span class="ap-same-t">${sameMenuText(twins)}</span>
        ${linkable ? html`<button type="button" class="ap-same-btn" ?disabled=${this.linking}
          title=${`Link this ${card.name} with ${joinWords(twins.map((d) => d.name))}. An edit on one then shows on all of them.`}
          @click=${() => void this.linkSame(card)}>${uiIcon("link")}<span>Link</span></button>` : nothing}</div>`}
      ${note === undefined ? nothing : html`<div class="ap-same-note ${note.kind}" role="status">${note.text}</div>`}
    </div>`;
  }

  /** The menu on its own, as the menu editor's stage draws it, on one
   * watch screen. */
  private renderThumb(card: MenuCard, copy: MenuCopy): TemplateResult | typeof nothing {
    const hass = this.hassNow;
    if (hass === undefined || this.icons === undefined) return nothing;
    return html`<wa-menu-thumbs .hass=${hass} .icons=${this.icons} .tick=${this.iconsTick} .menus=${copy.document}
      .pages=${this.pages.get(copy.device.ownerId)} .screen=${PIC_SCREEN} .height=${PIC_H} menu=${card.unit}></wa-menu-thumbs>`;
  }

  private renderMenu(card: MenuCard, devices: readonly LinkDevice[]): TemplateResult {
    const source = menuCardSource(card, dirtyHere);
    const from = source ?? card.copies[0]!.device.ownerId;
    const statusPages = this.statusPages.get(from);
    const group = menuCardGroup({
      card, devices, places: this.places, waiting: awaitingMove(this.owners, this.facts), source: from,
      pages: watchMenuPageTargets(this.pages.get(from)),
      ...(statusPages === undefined ? {} : { statusPages }),
    });
    const ask = this.replaceAsk;
    return renderMenuDevicesMenu({
      groups: [group],
      hereKind: "watch",
      ...(source === undefined ? { blocked: MENU_CARD_DIRTY_TEXT } : {}),
      busy: this.linking,
      ...(this.devicesNote === undefined ? {} : { note: this.devicesNote }),
      ...(ask === undefined || ask.unit !== card.unit ? {} : { ask: this.renderReplaceAsk(ask) }),
      className: "at-card am-dev-menu",
      colorOf: (ownerId) => this.colorOf(ownerId),
      onToggle: (_unit, place) => this.toggle(card, place),
      onUnlinkHere: () => undefined,
      onDone: () => this.closeDevices(),
    });
  }

  /** The question before a tick replaces a device's own menu, in the menu. */
  private renderReplaceAsk(ask: ReplaceAsk): TemplateResult {
    const { title, body } = menuReplaceAsk(ask.unit, this.deviceName(ask.target));
    return html`<div class="me-dev-ask" role="alertdialog" aria-label=${title}>
      <span><b>${title}</b> ${body}</span>
      <span class="me-dev-ask-acts">
        <button type="button" class="danger" ?disabled=${this.linking}
          @click=${() => void this.link(ask.source, ask.unit, ask.target, true)}>Replace</button>
        <button type="button" @click=${() => { this.replaceAsk = undefined; }}>Cancel</button>
      </span>
    </div>`;
  }

  static override styles = [devicesMenuStyles, menuDevicesStyles, listTabStyles, css`
    /* The menu's picture: the watch screen alone, as the Pages tab's cards
       draw a page. */
    .ap-thumb wa-menu-thumbs { flex: none; width: 100%; }
    /* The Devices menu hangs under its card, as on the Pages tab, not in
       the flow as in the editor's inspector. */
    .ap-card > .pe-dev-menu.am-dev-menu { margin: 0; box-shadow: var(--wa-shadow-pop, 0 10px 30px rgba(0, 0, 0, .35)); }
    /* The two sections, Anywhere menus and Entity quick menus, each under
       a small heading with its count. */
    .am-section { display: flex; flex-direction: column; gap: 10px; }
    .am-section + .am-section { margin-top: 22px; padding-top: 18px; border-top: 1px solid var(--wa-line); }
    .am-section-title { margin: 0; padding: 0 2px; font-size: 13px; font-weight: 600; letter-spacing: .01em; color: var(--wa-text); }
    .am-section-n { margin-left: 4px; font-weight: 500; color: var(--wa-muted); }
  `];
}

if (!customElements.get("wa-all-menus")) customElements.define("wa-all-menus", WaAllMenus);

declare global {
  interface HTMLElementTagNameMap {
    "wa-all-menus": WaAllMenus;
  }
}
