// The Menus tab: every menu of the home's library, one card each, as the
// Pages tab lists pages (`watch-pages/all-pages.ts`), in two sections:
// Anywhere menus, then Entity quick menus (mock frame 1c).
//
// The library is read once, through the library store every tab and editor
// shares (`library/store.ts`). A card is a library menu with its name, its
// slot count, its picture and a round tick per device (`library/ticks.ts`):
// a device uses one menu of each kind, so ticking another device has it use
// this menu from now on, and the ticked one cannot be unticked. A card opens
// its menu in the menu editor of a device that uses it. A menu no device uses
// can be deleted from its card. "+ New menu" in the tab's head makes a menu
// no device uses yet, the app's own Anywhere menu or Entity quick menu
// (`library/menus/create`); its card shows with no device ticked, and a tick
// puts it on a device. Nothing here saves a device's menus record.
//
// The tab draws the Pages tab's board (`library/board.ts`): a row per menu,
// in two sections, a column per device and a round dot where the device uses
// the menu. Picking another dot moves the device to that menu, like a radio
// button. "Cards" shows the big pictures instead. A click on a device's
// name focuses its column: the menus it uses first, then the rest, dimmed.
// The focus is in the address (`/all-menus/<owner>`). The panel loads this
// file the first time the tab opens (`all-menus-hook.ts`).

import { LitElement, type PropertyValues, css, html, nothing, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import type { HassLike, OwnerSummary } from "../ha-api.js";
import { deviceColor, deviceColorsCache } from "../device-colors.js";
import { LIBRARY_UNSUPPORTED_TEXT, type MenuUnit } from "../library/client.js";
import { MENU_UNITS } from "../library/client.js";
import { type Library, type LibraryMenu, hasItem, holdsRecord, libraryMenus, menuDocument, menuFor, pagesDocumentFor, sameId } from "../library/model.js";
import { renderMenuRowPicture, rowPictureStyles } from "../library/row-picture.js";
import { LibraryController } from "../library/store.js";
import { newItemDialogStyles, openNewItemDialog, renderNewItemDialog } from "../library/new-dialog.js";
import { type BoardCell, type BoardRow, type BoardSection, DEVICE_OWN_LABELS, type DeviceOwnScreen, type ListView,
  SAVED_FLASH_MS, WideWatch, boardStackStyles, boardStyles, renderBoard, renderViewSwitch } from "../library/board.js";
import { type TicksInput, libraryTicksStyles, renderTicks, tickChips } from "../library/ticks.js";
import { type IconProvider, REFERENCE_CASE } from "../renderer.js";
import { uiIcon } from "../ui-icons.js";
import { ALL_FILTER, type PagesFilter, libraryEditTitle, onDeviceTitle, resolveFilter, restTitle } from "../watch-pages/all-pages-model.js";
import { libraryListStyles } from "../watch-pages/library-list-styles.js";
import { listTabStyles } from "../watch-pages/list-tab-styles.js";
import { type LinkDevice, type PagesRecordFacts, awaitingMove, deviceWord, joinWords, linkDevicesOf } from "../watch-pages/devices.js";
import type { WatchPagesNote } from "../watch-pages/save-note.js";
import {
  MENU_SECTION_TITLES,
  MENUS_BOARD_FOOT,
  MENUS_BOARD_HINT,
  MENUS_FOOT,
  MENUS_WAIT_TEXT,
  NEW_MENU_ADMIN_TEXT,
  allMenusLead,
  duplicateMenuTitle,
  duplicatedMenuText,
  menuDetail,
  menuMatches,
  menuSections,
  menusDeviceFoot,
  menusDirtyText,
  menusEmptyText,
  newMenuMadeText,
  newMenuName,
  newMenuSections,
  openMenuDevice,
  restMenus,
  shownMenus,
} from "./all-menus-model.js";
import { copyMenuName } from "../watch-pages/library-editing.js";
import { keptWatchMenusDraft } from "./draft.js";
import "./menu-thumbs.js";
import type { MenusDocument } from "./model.js";

/** How tall a card's picture of its menu is, in CSS pixels. */
const PIC_H = 180;
/** A menu is one menu on every device, so its picture is drawn on one
 * screen for every card, as the Pages tab draws its pages. */
const PIC_SCREEN = REFERENCE_CASE.screen;
/** How often a stream of state changes draws the pictures again. */
const STATES_EVERY_MS = 2000;
/** How tall a board row's menu picture is, in CSS pixels. */
const BOARD_PICTURE_H = 38;

/** Where the tab's view is remembered in this browser, as the Pages tab
 * remembers its. */
const VIEW_STORE_KEY = "wrist-assistant-panel.all-menus.v1";

/** Board or Cards, as last left. */
interface KeptView {
  view: ListView;
}

let kept: KeptView | undefined;

/** The view as last left, read once from storage. A browser with storage
 * off keeps it while the panel is open. */
function keptView(): KeptView {
  if (kept !== undefined) return kept;
  const view: KeptView = { view: "board" };
  try {
    const raw = window.localStorage.getItem(VIEW_STORE_KEY);
    const saved = raw ? (JSON.parse(raw) as { view?: unknown }) : {};
    if (saved.view === "cards") view.view = "cards";
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

/** Whether a device's menu editor holds unsaved edits in this tab. */
const dirtyHere = (ownerId: string): boolean => keptWatchMenusDraft(ownerId)?.dirty ?? false;

/** New menu's form, under the tab's head. */
interface NewForm {
  unit: MenuUnit;
  name: string;
  busy: boolean;
  note?: WatchPagesNote;
}

/** Each menu's document for its card picture, made once per menu object. */
const cardDocs = new WeakMap<object, MenusDocument>();

export class WaAllMenus extends LitElement {
  @property({ attribute: false }) owners: readonly OwnerSummary[] = [];
  @property({ attribute: false }) ownersReady = false;
  @property({ attribute: false }) phones = false;
  @property({ attribute: false }) icons?: IconProvider;
  @property({ attribute: false }) iconsTick = 0;
  /** Open a menu in the one editor, the menu editor's library mode, with
   * the focused device when there is one. A menu New menu has just made
   * opens there too. */
  @property({ attribute: false }) onOpenLibrary?: (menuId: string, from?: string) => void;
  /** The focused device, by owner id: the address's (`/all-menus/<owner>`). */
  @property({ attribute: false }) focusOwner?: string;
  /** Focus a device's column, or with undefined every device. */
  @property({ attribute: false }) onFocus?: (ownerId: string | undefined) => void;
  /** Open one of a device's own screens: Settings, Rooms or Voice. */
  @property({ attribute: false }) onOpenScreen?: (ownerId: string, kind: "watch" | "iphone", screen: DeviceOwnScreen) => void;
  /** Drawn inside Home's "All devices" (plan step 6): the board alone,
   * with no head, title or New, under the host's one search. */
  @property({ type: Boolean, reflect: true }) embedded = false;
  /** The host's search, when embedded. */
  @property({ attribute: false }) searchText = "";

  @state() private search = "";
  /** New menu's form, open under the tab's head. */
  @state() private newForm?: NewForm;
  /** What the last New menu said, under the head, once its form closed. */
  @state() private newNote?: WatchPagesNote;
  /** The menu whose delete is being asked about. */
  @state() private deleteAsk?: string;
  @state() private deleting = false;
  /** "Saved" beside the head, for a moment after a dot's write lands. */
  @state() private saved = false;
  /** The menu a Duplicate is copying, while it is out. */
  @state() private copying?: string;
  private savedTimer: ReturnType<typeof setTimeout> | undefined;

  private hassNow?: HassLike;
  private hassDrawnAt = 0;

  /** The library, shared with every other tab and editor. */
  private readonly lib = new LibraryController(this, () => this.hassNow, () => this.devices.map((d) => d.ownerId));

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
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    window.removeEventListener("keydown", this.onKeyDown);
    clearTimeout(this.savedTimer);
  }

  protected override willUpdate(changed: PropertyValues): void {
    if (this.embedded && changed.has("searchText")) this.search = this.searchText;
  }

  /** Whether this tab is wide enough for big row pictures. */
  private roomy = new WideWatch(this);

  private colorsFor = deviceColorsCache();

  /** A device's color (`device-colors.ts`), the one it wears on every tab. */
  private colorOf = (ownerId: string): string | undefined => deviceColor(this.colorsFor(this.owners), ownerId);

  /** Every device that uses menus. */
  private get devices(): LinkDevice[] {
    return linkDevicesOf(this.owners, this.phones);
  }

  /** The focused device's owner id, or All. */
  private get filter(): PagesFilter {
    return resolveFilter(this.focusOwner, this.devices);
  }

  private filterDevice(): LinkDevice | undefined {
    const filter = this.filter;
    return filter === ALL_FILTER ? undefined : this.devices.find((d) => d.ownerId === filter);
  }

  /** Board or Cards. A focused device is always the board. */
  private get view(): ListView {
    return this.embedded || this.filterDevice() !== undefined ? "board" : keptView().view;
  }

  /** The watches that wait for their iPhone to move their menus here: none
   * can move to another menu yet. */
  private waiting(library: Library): Set<string> {
    const facts = new Map<string, PagesRecordFacts>();
    for (const d of this.devices) facts.set(d.ownerId, { held: holdsRecord(library, d.ownerId, "menus"), free: false });
    return awaitingMove(this.owners, facts);
  }

  // ── acting ─────────────────────────────────────────────────────────────

  /** A column head clicked: that device focused, or every device. */
  private setFocus(ownerId: string | undefined): void {
    this.newForm = undefined;
    this.deleteAsk = undefined;
    this.onFocus?.(ownerId);
  }

  /** Board or Cards, remembered. Cards leaves a focused device. */
  private setView(view: ListView): void {
    keepView({ view });
    if (view === "cards" && this.filterDevice() !== undefined) this.setFocus(undefined);
    this.requestUpdate();
  }

  /** "Saved", beside the head, for a moment. */
  private flashSaved(): void {
    clearTimeout(this.savedTimer);
    this.saved = true;
    this.savedTimer = setTimeout(() => { this.saved = false; }, SAVED_FLASH_MS);
  }

  /** Open a menu in the one editor, the library's, whichever devices use
   * it (plan step 4). From a focused board the device goes along, so the
   * editor rings it and Back comes back to that board. */
  private open(menu: LibraryMenu): void {
    this.onOpenLibrary?.(menu.id, this.focusOwner);
  }

  /** Duplicate: a copy of `menu` named "<device>'s menu", which `device`
   * uses in its place from now on; the other devices keep `menu`. */
  private async duplicate(menu: LibraryMenu, device: LinkDevice): Promise<void> {
    const store = this.lib.store;
    if (store === undefined || this.copying !== undefined) return;
    const name = copyMenuName(device.name);
    this.copying = menu.id;
    this.newNote = undefined;
    const result = await store.copyMenu(device.ownerId, menu.unit, name);
    this.copying = undefined;
    this.newNote = result.ok ? { kind: "ok", text: duplicatedMenuText(name, device.name) } : { kind: "err", text: `Not copied. ${result.text}` };
    if (result.ok) this.flashSaved();
  }

  /** A tick, or a pick in a device's menu: the device uses this menu for
   * its unit from now on. */
  private use(menu: LibraryMenu, ownerId: string): void {
    const store = this.lib.store;
    if (store === undefined) return;
    void store.pickMenu(ownerId, menu.unit, menu.id).then((result) => { if (result.ok) this.flashSaved(); });
  }

  /** Whether this Home Assistant user may make a menu: an administrator.
   * Unknown (no user read yet) offers it, and Home Assistant still refuses
   * anyone else. */
  private get mayMake(): boolean {
    return this.hassNow?.user?.is_admin !== false;
  }

  /** Open New menu's form, or close it. */
  private toggleNew(): void {
    if (this.newForm?.busy) return;
    if (this.newForm !== undefined) {
      this.newForm = undefined;
      return;
    }
    const unit: MenuUnit = "anywhere";
    this.newNote = undefined;
    this.newForm = { unit, name: newMenuName(this.lib.library, unit), busy: false };
    void this.updateComplete.then(() => openNewItemDialog(this.renderRoot));
  }

  /** The form's For: another unit, and its offered name when the name was
   * still the one offered for the old unit. */
  private setNewUnit(form: NewForm, unit: MenuUnit): void {
    const library = this.lib.library;
    const name = form.name === newMenuName(library, form.unit) ? newMenuName(library, unit) : form.name;
    this.newForm = { ...form, unit, name };
  }

  /**
   * New menu: a library menu under the name given, the app's own menu for
   * the unit (`library/menus/create`), that no device uses yet. The library
   * is read again after it, so its card shows with no device ticked. No
   * device moves off its menu.
   */
  private async makeMenu(): Promise<void> {
    const form = this.newForm;
    const store = this.lib.store;
    if (form === undefined || form.busy || store === undefined) return;
    const name = form.name.trim();
    if (name === "") {
      this.newForm = { ...form, note: { kind: "warn", text: "Give the menu a name." } };
      return;
    }
    const { note: _dropped, ...asked } = form;
    this.newForm = { ...asked, busy: true };
    const made = await store.createMenu(form.unit, name, newMenuSections(form.unit));
    if (!made.ok) {
      this.newForm = { ...form, busy: false, note: { kind: "err", text: `Not made. ${made.text}` } };
      return;
    }
    this.newForm = undefined;
    // Straight into the new menu, in the library: no device uses it yet.
    if (this.onOpenLibrary !== undefined) this.onOpenLibrary(made.reply.id);
    else this.newNote = { kind: "ok", text: newMenuMadeText(name) };
  }

  /** Delete a menu no device uses, after its question. */
  private async deleteMenu(menu: LibraryMenu): Promise<void> {
    const store = this.lib.store;
    if (store === undefined || this.deleting) return;
    this.deleting = true;
    await store.deleteItem("menus", menu.id);
    this.deleting = false;
    this.deleteAsk = undefined;
  }

  /** Escape closes New menu's form, then a delete question. */
  private onKeyDown = (e: KeyboardEvent): void => {
    if (e.key !== "Escape") return;
    if (this.newForm !== undefined && !this.newForm.busy) {
      e.preventDefault();
      this.newForm = undefined;
    } else if (this.deleteAsk !== undefined && !this.deleting) {
      e.preventDefault();
      this.deleteAsk = undefined;
    }
  };

  // ── drawing ────────────────────────────────────────────────────────────

  protected override render(): TemplateResult {
    const devices = this.devices;
    if (devices.length === 0 && !this.ownersReady) return html`<div class="ap-page"><div class="ap-wrap"><p class="ap-empty">Loading…</p></div></div>`;
    if (this.embedded) return this.renderEmbedded();
    const library = this.lib.library;
    const readState = this.lib.readState;
    const device = this.filterDevice();
    const view = this.view;
    const lead = library === undefined
      ? (readState === "unsupported" ? LIBRARY_UNSUPPORTED_TEXT : readState === "failed" ? (this.lib.store?.readError ?? "Could not read the library.") : "Reading the menus…")
      : allMenusLead(libraryMenus(library).length);
    const stale = library !== undefined && readState === "failed";
    return html`<div class="ap-page"><div class="ap-wrap">
      <div class="ap-head">
        <div class="ap-head-text">
          <h1>Menus</h1>
          <p class="ap-lead">${lead}</p>
        </div>
        ${library === undefined ? nothing : this.renderNewButton()}
      </div>
      ${this.newForm === undefined ? nothing : this.renderNewDialog(this.newForm)}
      ${this.newNote === undefined ? nothing : html`<p class="lt-line ${this.newNote.kind}" role="status">${this.newNote.text}</p>`}
      ${stale ? html`<p class="ap-warn" role="status">Could not read the library again: ${this.lib.store?.readError ?? ""} It shows as last read.</p>` : nothing}
      <div class="pk-surface pk-page" role="region" aria-label="Your menus">
        <div class="pk-pin">${this.renderHead(view)}</div>
        <div class="pk-body">
          ${library === undefined ? html`<p class="ap-empty">${lead}</p>`
            : devices.length === 0 ? html`<p class="ap-empty">${menusEmptyText(devices, this.search)}</p>`
            : device !== undefined ? this.renderFocus(library, device, devices)
            : view === "board" ? this.renderBoardAll(library, devices)
            : this.renderSections(library, devices)}
        </div>
        <div class="pk-foot"><span class="pk-foot-hint">${device === undefined ? (view === "board" ? MENUS_BOARD_FOOT : MENUS_FOOT) : menusDeviceFoot(device)}</span></div>
      </div>
    </div></div>`;
  }

  /** Inside Home's "All devices": the board on every device, a dot a
   * pick as on the tab, with "Saved" over it for a moment after a write. */
  private renderEmbedded(): TemplateResult {
    const library = this.lib.library;
    const devices = this.devices;
    const readState = this.lib.readState;
    if (library === undefined) {
      const why = readState === "unsupported" ? LIBRARY_UNSUPPORTED_TEXT : readState === "failed" ? (this.lib.store?.readError ?? "Could not read the library.") : "Reading the menus…";
      return html`<p class="ap-empty">${why}</p>`;
    }
    if (devices.length === 0) return html`<p class="ap-empty">No device can have menus.</p>`;
    return html`${this.saved ? html`<span class="bd-saved ap-embed-saved" role="status">${uiIcon("check")}<span>Saved</span></span>` : nothing}${this.renderBoardAll(library, devices)}`;
  }

  /** Cards: the menus in two sections, Anywhere menus first, each under its
   * heading with its count. */
  private renderSections(library: Library, devices: readonly LinkDevice[]): TemplateResult {
    const shown = shownMenus(library, this.search, "all", devices);
    const waiting = this.waiting(library);
    return html`${menuSections(shown).map(({ unit, menus }) => html`<section class="am-section" aria-labelledby=${`am-section-${unit}`}>
      <div class="am-section-head">
        <h2 class="am-section-title" id=${`am-section-${unit}`}>${MENU_SECTION_TITLES[unit]} <span class="am-section-n">${menus.length}</span></h2>
      </div>
      ${menus.length === 0 ? html`<p class="ap-empty">${menusEmptyText(devices, this.search)}</p>`
        : html`<div class="ap-grid" role="list">${menus.map((menu) => this.renderCard(library, menu, devices, waiting))}</div>`}
    </section>`)}`;
  }

  /** "+ New menu", beside the lead (mock frame 1c). Greyed for anyone who
   * is not an administrator. */
  private renderNewButton(): TemplateResult {
    const may = this.mayMake;
    const open = this.newForm !== undefined;
    return html`<button type="button" class="am-new-btn ${open ? "on" : ""}" aria-expanded=${open ? "true" : "false"}
      ?disabled=${!may || this.newForm?.busy === true} title=${may ? "Make a new menu no device uses yet" : NEW_MENU_ADMIN_TEXT}
      @click=${() => this.toggleNew()}>${uiIcon("plus")}<span>New menu</span></button>`;
  }

  /** New menu's dialog: a name and which kind of menu it is. No device: a
   * dot on its row puts it on one. */
  private renderNewDialog(form: NewForm): TemplateResult {
    return renderNewItemDialog("menus", form, [], {
      onName: (name) => { this.newForm = { ...form, name }; },
      onUnit: (unit) => this.setNewUnit(form, unit),
      onMake: () => void this.makeMenu(),
      onClose: () => { if (!form.busy) this.newForm = undefined; },
    });
  }

  /** The head: Board or Cards, "Saved" for a moment after a dot's write,
   * then the search at the right. */
  private renderHead(view: ListView): TemplateResult {
    return html`<div class="pk-head">
      ${renderViewSwitch(view, (v) => this.setView(v), "menus")}
      ${this.saved ? html`<span class="bd-saved" role="status">${uiIcon("check")}<span>Saved</span></span>` : nothing}
      <label class="pk-search">
        ${uiIcon("search")}
        <input type="search" class="pk-search-input" .value=${this.search} placeholder="Search by menu or device" aria-label="Search menus"
          @input=${(e: InputEvent) => { this.search = (e.target as HTMLInputElement).value; }} />
      </label>
    </div>`;
  }

  /** What a menu's ticks are drawn from. */
  private ticksInput(library: Library, menu: LibraryMenu, devices: readonly LinkDevice[], waiting: ReadonlySet<string>): TicksInput {
    const store = this.lib.store;
    const note = store?.noteFor("menus", menu.id);
    const admin = this.hassNow?.user?.is_admin;
    return {
      library, kind: "menus", itemId: menu.id, devices, colorOf: this.colorOf,
      ...(store === undefined ? {} : { pending: store.pending }),
      ...(note === undefined ? {} : { note }),
      ...(admin === undefined ? {} : { admin }),
      locked: (ownerId) => {
        if (hasItem(library, ownerId, "menus", menu.id)) return undefined;
        if (dirtyHere(ownerId)) return menusDirtyText(devices.find((d) => d.ownerId === ownerId)?.name ?? "This device");
        if (waiting.has(ownerId)) return MENUS_WAIT_TEXT;
        return undefined;
      },
    };
  }

  /** A card's round ticks: one per device. */
  private renderCardTicks(library: Library, menu: LibraryMenu, devices: readonly LinkDevice[], waiting: ReadonlySet<string>): TemplateResult {
    return renderTicks(this.ticksInput(library, menu, devices, waiting), (ownerId) => this.use(menu, ownerId));
  }

  private renderCard(library: Library, menu: LibraryMenu, devices: readonly LinkDevice[], waiting: ReadonlySet<string>): TemplateResult {
    const opensOn = openMenuDevice(menu, ALL_FILTER, "all", devices);
    const title = libraryEditTitle(menu.name);
    return html`<div class="ap-card" role="listitem" data-card=${menu.id}>
      <div class="ap-top">
        <button type="button" class="ap-open" title=${title} @click=${() => this.open(menu)}>
          <b class="ap-name">${menu.name}</b>
          <small class="ap-detail">${menuDetail(menu)}</small>
        </button>
      </div>
      <button type="button" class="ap-thumb" tabindex="-1" aria-hidden="true" title=${title} @click=${() => this.open(menu)}>
        ${this.renderThumb(library, menu, opensOn, PIC_H)}
      </button>
      ${this.renderCardTicks(library, menu, devices, waiting)}
      ${menu.owners.length === 0 ? this.renderDelete(menu) : nothing}
    </div>`;
  }

  /** Delete on a menu no device uses: one press asks in place. */
  private renderDelete(menu: LibraryMenu): TemplateResult {
    return this.deleteAsk === menu.id ? this.renderDeleteAsk(menu) : html`<button type="button" class="am-btn danger am-del" title=${`Delete ${menu.name} from the library`}
      @click=${(e: Event) => { e.stopPropagation(); this.deleteAsk = menu.id; }}>${uiIcon("delete")}<span>Delete</span></button>`;
  }

  private renderDeleteAsk(menu: LibraryMenu): TemplateResult {
    return html`<div class="am-del-ask" role="alertdialog" aria-label=${`Delete ${menu.name}?`}>
      <span><b>Delete ${menu.name}?</b> No device uses it. This cannot be undone.</span>
      <span class="am-new-acts">
        <button type="button" class="am-btn danger" ?disabled=${this.deleting} @click=${() => void this.deleteMenu(menu)}>Really delete</button>
        <button type="button" class="am-btn" ?disabled=${this.deleting} @click=${() => { this.deleteAsk = undefined; }}>Cancel</button>
      </span>
    </div>`;
  }

  /** The menu on its own, as the menu editor's stage draws it, on one
   * watch screen. The page switcher names the pages of the device it opens
   * on. */
  private renderThumb(library: Library, menu: LibraryMenu, on: LinkDevice | undefined, height: number): TemplateResult | typeof nothing {
    const hass = this.hassNow;
    if (hass === undefined || this.icons === undefined) return nothing;
    let doc = cardDocs.get(menu);
    if (doc === undefined) {
      doc = menuDocument(menu);
      cardDocs.set(menu, doc);
    }
    const pages = on === undefined ? undefined : pagesDocumentFor(library, on.ownerId);
    return html`<wa-menu-thumbs .hass=${hass} .icons=${this.icons} .tick=${this.iconsTick} .menus=${doc}
      .pages=${pages} .screen=${PIC_SCREEN} .height=${height} menu=${menu.unit}></wa-menu-thumbs>`;
  }

  // ── the board ──────────────────────────────────────────────────────────

  private renderBoardOf(library: Library, devices: readonly LinkDevice[], sections: BoardSection[], focus?: string): TemplateResult {
    return renderBoard({
      label: "Menus on each device",
      thing: "Menu",
      columns: devices.map((device) => ({
        device, color: this.colorOf(device.ownerId),
        count: MENU_UNITS.filter((u) => menuFor(library, device.ownerId, u) !== undefined).length,
      })),
      ...(focus === undefined ? {} : { focus }),
      onFocus: (ownerId) => this.setFocus(ownerId),
      wide: this.roomy.wide,
      focusWord: "Its menus",
      focusTitle: (d) => `Show the menus ${d.name} uses first`,
      sections,
    });
  }

  /** The board on every device: Anywhere menus, then Entity quick menus, a
   * row each, a round dot per device. */
  private renderBoardAll(library: Library, devices: readonly LinkDevice[]): TemplateResult {
    const shown = shownMenus(library, this.search, "all", devices);
    const waiting = this.waiting(library);
    return this.renderBoardOf(library, devices, menuSections(shown).map(({ unit, menus }) => ({
      key: unit, title: MENU_SECTION_TITLES[unit], count: menus.length, hint: MENUS_BOARD_HINT,
      rows: menus.map((menu) => this.boardRow(library, menu, devices, waiting)),
      empty: menusEmptyText(devices, this.search),
    })));
  }

  /**
   * One menu's row: its picture, name and slot count, then a round dot per
   * device. A dot not taken says which menu it replaces there. A menu no
   * device uses has Delete after its name.
   */
  private boardRow(library: Library, menu: LibraryMenu, devices: readonly LinkDevice[], waiting: ReadonlySet<string>, focus?: LinkDevice): BoardRow {
    const input = this.ticksInput(library, menu, devices, waiting);
    const cells = tickChips(input).map((chip): BoardCell => {
      const now = chip.on ? undefined : menuFor(library, chip.ownerId, menu.unit);
      const title = now === undefined || chip.next === undefined ? chip.title : `${chip.title.replace(/\.$/, "")}. Replaces ${now.name} there.`;
      return { chip: { ...chip, title }, onPick: () => this.use(menu, chip.ownerId) };
    });
    const opensOn = focus !== undefined && menu.owners.some((o) => sameId(o, focus.ownerId)) ? focus : openMenuDevice(menu, ALL_FILTER, "all", devices);
    const unused = menu.owners.length === 0;
    const row: BoardRow = {
      key: menu.id, name: menu.name, detail: menuDetail(menu),
      picture: renderMenuRowPicture({
        menu, hass: this.hassNow, icons: this.icons, tick: this.iconsTick, onReady: () => this.requestUpdate(), height: this.roomy.size(BOARD_PICTURE_H),
        ...(menu.unit === "anywhere" && opensOn !== undefined ? { pages: pagesDocumentFor(library, opensOn.ownerId) } : {}),
      }),
      openTitle: libraryEditTitle(menu.name),
      onOpen: () => this.open(menu),
      cells,
      ...(focus !== undefined && !menu.owners.some((o) => sameId(o, focus.ownerId)) ? { dim: true } : {}),
      ...(input.note === undefined ? {} : { note: { text: input.note, kind: "warn" as const } }),
    };
    // Duplicate, on a focused device sharing this menu with another: a copy
    // only it uses from now on (`library/menus/copy`). It was the device
    // Menus screen's "Duplicate" (plan step 4).
    const shared = focus !== undefined && menu.owners.some((o) => sameId(o, focus.ownerId)) && menu.owners.some((o) => !sameId(o, focus.ownerId));
    if (shared && focus !== undefined) {
      const busy = this.copying !== undefined;
      row.actions = html`<button type="button" class="bd-act" ?disabled=${busy}
        title=${busy ? "Duplicating…" : duplicateMenuTitle(menu.name, focus.name)} aria-label=${duplicateMenuTitle(menu.name, focus.name)}
        @click=${(e: Event) => { e.stopPropagation(); void this.duplicate(menu, focus); }}>${uiIcon("duplicate")}</button>`;
    }
    if (unused) {
      if (this.deleteAsk === menu.id) row.under = this.renderDeleteAsk(menu);
      else row.actions = html`<button type="button" class="bd-act danger" title=${`Delete ${menu.name} from the library. No device uses it.`}
        aria-label=${`Delete ${menu.name}`} @click=${(e: Event) => { e.stopPropagation(); this.deleteAsk = menu.id; }}>${uiIcon("delete")}</button>`;
    }
    return row;
  }

  /**
   * A focused device: the menus it uses first, one of each kind, then the
   * library's other menus, dimmed. A dot in its column moves it to that
   * menu.
   */
  private renderFocus(library: Library, device: LinkDevice, devices: readonly LinkDevice[]): TemplateResult {
    const waiting = this.waiting(library);
    const used = MENU_UNITS.map((u) => menuFor(library, device.ownerId, u)).filter((m): m is LibraryMenu => m !== undefined && menuMatches(m, this.search, devices));
    const rest = restMenus(library, device.ownerId, this.search, devices);
    const word = deviceWord(device.kind);
    const own: DeviceOwnScreen[] = device.kind === "watch" ? ["settings", "rooms", "voice"] : ["settings", "rooms"];
    const color = this.colorOf(device.ownerId);
    const names = MENU_UNITS.map((u) => menuFor(library, device.ownerId, u)?.name).filter((n): n is string => n !== undefined);
    return html`<div class="bd-focus" style=${color === undefined ? nothing : `--dc:${color}`}>
        <span class="bd-focus-glyph" aria-hidden="true">${uiIcon(device.kind === "iphone" ? "phone" : "watch")}</span>
        <span class="bd-focus-t"><b>${device.name}</b> <span>${names.length === 0 ? "uses no menu yet" : `uses ${joinWords(names)}`}</span></span>
        ${this.onOpenScreen === undefined ? nothing : html`<span class="bd-focus-own">Also on this ${word}:
          ${own.map((screen) => html`<button type="button" class="bd-link" @click=${() => this.onOpenScreen?.(device.ownerId, device.kind, screen)}>${DEVICE_OWN_LABELS[screen]}</button>`)}</span>`}
        <button type="button" class="bd-focus-all" @click=${() => this.setFocus(undefined)}>${uiIcon("grid")}<span>All devices</span></button>
      </div>
      ${this.renderBoardOf(library, devices, [
        { key: "on", title: onDeviceTitle(device), count: used.length, hint: `One of each kind. Pick a dot to switch.`,
          rows: used.map((menu) => this.boardRow(library, menu, devices, waiting, device)),
          empty: this.search.trim() === "" ? `${device.name} uses no menu yet.` : `No menu ${device.name} uses has that name.` },
        { key: "rest", title: restTitle(device), count: rest.length, hint: `Pick its dot under ${device.name} to use it there.`,
          rows: rest.map((menu) => this.boardRow(library, menu, devices, waiting, device)),
          empty: this.search.trim() === "" ? `${device.name} uses every menu in your home.` : "No other menu has that name." },
      ], device.ownerId)}`;
  }

  static override styles = [listTabStyles, libraryListStyles, libraryTicksStyles, rowPictureStyles, newItemDialogStyles, boardStyles, boardStackStyles, css`
    .ap-embed-saved { position: absolute; right: 0; top: -26px; }
    :host([embedded]) { position: relative; }
    /* The menu's picture: the watch screen alone, as the Pages tab's cards
       draw a page. */
    .ap-thumb wa-menu-thumbs { flex: none; width: 100%; }
    /* The two sections, Anywhere menus and Entity quick menus, each under
       a small heading with its count. */
    .am-section { display: flex; flex-direction: column; gap: 10px; }
    .am-section + .am-section { margin-top: 22px; padding-top: 18px; border-top: 1px solid var(--wa-line); }
    .am-section-head { display: flex; align-items: center; gap: 10px; padding: 0 2px; }
    .am-section-title { margin: 0; font-size: 13px; font-weight: 600; letter-spacing: .01em; color: var(--wa-text); }
    .am-section-n { margin-left: 4px; font-weight: 500; color: var(--wa-muted); }
    /* "+ New menu", at the right of the tab's head, beside the lead. */
    .am-new-btn {
      display: inline-flex; align-items: center; gap: 5px; margin-left: auto; height: 30px; padding: 0 11px; border-radius: 8px;
      border: 1px solid var(--wa-line-strong); background: var(--wa-card); color: var(--wa-ink);
      font: inherit; font-size: 12.5px; font-weight: 600; cursor: pointer; flex: none;
    }
    .am-new-btn svg { width: 13px; height: 13px; }
    .am-new-btn:hover:not(:disabled), .am-new-btn.on { background: var(--wa-hover); }
    .am-new-btn:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .am-new-btn:disabled { opacity: .45; cursor: default; }
    .am-new-acts { display: inline-flex; gap: 6px; flex: none; }
    .am-btn {
      display: inline-flex; align-items: center; gap: 5px; height: 28px; padding: 0 10px; border-radius: 7px;
      border: 1px solid var(--wa-line-strong); background: var(--wa-panel, var(--wa-card)); color: var(--wa-ink);
      font: inherit; font-size: 12.5px; font-weight: 600; cursor: pointer;
    }
    .am-btn svg { width: 13px; height: 13px; }
    .am-btn:hover:not(:disabled) { background: var(--wa-hover); }
    .am-btn:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .am-btn:disabled { opacity: .45; cursor: default; }
    .am-btn.primary { background: var(--wa-primary-bg); color: var(--wa-primary-ink); border-color: transparent; }
    .am-btn.danger {
      color: var(--error-color, #b42318);
      border-color: color-mix(in srgb, var(--error-color, #b42318) 45%, var(--wa-line));
      background: color-mix(in srgb, var(--error-color, #b42318) 10%, var(--wa-panel, var(--wa-card)));
    }
    .am-del { align-self: flex-start; height: 24px; font-size: 11.5px; }
    .am-del-ask { display: flex; flex-direction: column; gap: 6px; font-size: 12px; line-height: 1.4; color: var(--wa-ink); }
    .am-del-ask b { font-weight: 600; }
    /* Delete on a board row of a menu no device uses: an icon button after
       its name. */
    .bd-act {
      display: inline-flex; align-items: center; justify-content: center; flex: none; width: 26px; height: 26px; padding: 0;
      border-radius: 6px; border: 1px solid transparent; background: none; color: var(--wa-muted); cursor: pointer;
    }
    .bd-act svg { width: 14px; height: 14px; }
    .bd-act.danger:hover { color: var(--error-color, #b42318); border-color: color-mix(in srgb, var(--error-color, #b42318) 45%, var(--wa-line)); }
    .bd-act:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  `];
}

if (!customElements.get("wa-all-menus")) customElements.define("wa-all-menus", WaAllMenus);

declare global {
  interface HTMLElementTagNameMap {
    "wa-all-menus": WaAllMenus;
  }
}
