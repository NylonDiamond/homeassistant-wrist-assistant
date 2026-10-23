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
// The head is the Pages tab's without Multi select: the Device menu
// (watches or iPhones) and the search, over a row of device tabs. On a
// device's tab the list is the device's two menus with a menu to pick
// another, then "Not on this watch": the rest of the library's menus,
// dimmed (mock frame 2b). The panel loads this file the first time the tab
// opens (`all-menus-hook.ts`).

import { LitElement, css, html, nothing, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { live } from "lit/directives/live.js";
import type { HassLike, OwnerSummary } from "../ha-api.js";
import { deviceColor, deviceColorsCache } from "../device-colors.js";
import { LIBRARY_UNSUPPORTED_TEXT, type MenuUnit } from "../library/client.js";
import { type Library, type LibraryMenu, hasItem, holdsRecord, libraryMenus, menuDocument, pagesDocumentFor } from "../library/model.js";
import { ROW_MENU_PICTURE_H, renderMenuRowPicture, rowPictureStyles } from "../library/row-picture.js";
import { LibraryController } from "../library/store.js";
import { newItemDialogStyles, openNewItemDialog, renderNewItemDialog } from "../library/new-dialog.js";
import { libraryTicksStyles, renderTicks } from "../library/ticks.js";
import { type IconProvider, REFERENCE_CASE } from "../renderer.js";
import { uiIcon } from "../ui-icons.js";
import { ALL_FILTER, type PagesFilter, type PagesKind, hasBothKinds, libraryEditTitle, onDeviceTitle, resolveFilter, resolveKind, restHint, restTitle } from "../watch-pages/all-pages-model.js";
import { libraryListStyles } from "../watch-pages/library-list-styles.js";
import { listTabStyles } from "../watch-pages/list-tab-styles.js";
import { type LinkDevice, type PagesRecordFacts, awaitingMove, linkDevicesOf } from "../watch-pages/devices.js";
import type { WatchPagesNote } from "../watch-pages/save-note.js";
import {
  MENU_SECTION_TITLES,
  MENUS_FOOT,
  MENUS_WAIT_TEXT,
  NEW_MENU_ADMIN_TEXT,
  allMenusLead,
  deviceMenuMeta,
  deviceMenuRows,
  menuDetail,
  menuFilterChips,
  menuKindOptions,
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
import { askWatchMenu, keptWatchMenusDraft } from "./draft.js";
import "./menu-thumbs.js";
import type { MenusDocument } from "./model.js";

/** How tall a card's picture of its menu is, in CSS pixels. */
const PIC_H = 180;
/** A menu is one menu on every device, so its picture is drawn on one
 * screen for every card, as the Pages tab draws its pages. */
const PIC_SCREEN = REFERENCE_CASE.screen;
/** How often a stream of state changes draws the pictures again. */
const STATES_EVERY_MS = 2000;

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
  /** Open a device's menu editor. The element has already asked it for the
   * card's menu (`askWatchMenu`). */
  @property({ attribute: false }) onOpen?: (ownerId: string, kind: "watch" | "iphone") => void;
  /** Open a menu no device uses in the menu editor's library mode. A menu
   * New menu has just made opens there too. */
  @property({ attribute: false }) onOpenLibrary?: (menuId: string) => void;

  @state() private search = "";
  /** New menu's form, open under the tab's head. */
  @state() private newForm?: NewForm;
  /** What the last New menu said, under the head, once its form closed. */
  @state() private newNote?: WatchPagesNote;
  /** The menu whose delete is being asked about. */
  @state() private deleteAsk?: string;
  @state() private deleting = false;

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
  }

  private colorsFor = deviceColorsCache();

  /** A device's color (`device-colors.ts`), the one it wears on every tab. */
  private colorOf = (ownerId: string): string | undefined => deviceColor(this.colorsFor(this.owners), ownerId);

  /** Every device that uses menus. */
  private get devices(): LinkDevice[] {
    return linkDevicesOf(this.owners, this.phones);
  }

  private get filter(): PagesFilter {
    return resolveFilter(keptView().filter, this.devices);
  }

  private filterDevice(): LinkDevice | undefined {
    const filter = this.filter;
    return filter === ALL_FILTER ? undefined : this.devices.find((d) => d.ownerId === filter);
  }

  private get deviceKind(): PagesKind {
    return resolveKind(keptView().kind, this.devices);
  }

  /** The watches that wait for their iPhone to move their menus here: none
   * can move to another menu yet. */
  private waiting(library: Library): Set<string> {
    const facts = new Map<string, PagesRecordFacts>();
    for (const d of this.devices) facts.set(d.ownerId, { held: holdsRecord(library, d.ownerId, "menus"), free: false });
    return awaitingMove(this.owners, facts);
  }

  // ── acting ─────────────────────────────────────────────────────────────

  private setFilter(filter: PagesFilter): void {
    keepView({ filter });
    this.newForm = undefined;
    this.deleteAsk = undefined;
    this.requestUpdate();
  }

  private setDeviceKind(kind: PagesKind): void {
    keepView({ kind });
    this.requestUpdate();
  }

  /** Open a menu in a device's menu editor: the device tab's, or one that
   * uses it. A menu no device uses opens in the library itself. */
  private open(menu: LibraryMenu, device?: LinkDevice): void {
    const on = device ?? openMenuDevice(menu, this.filter, this.deviceKind, this.devices);
    if (on === undefined) {
      this.onOpenLibrary?.(menu.id);
      return;
    }
    askWatchMenu(on.ownerId, menu.unit);
    this.onOpen?.(on.ownerId, on.kind);
  }

  /** A device's own menu of a unit, in its menu editor. */
  private openUnit(device: LinkDevice, unit: MenuUnit): void {
    askWatchMenu(device.ownerId, unit);
    this.onOpen?.(device.ownerId, device.kind);
  }

  /** A tick, or a pick in a device's menu: the device uses this menu for
   * its unit from now on. */
  private use(menu: LibraryMenu, ownerId: string): void {
    const store = this.lib.store;
    if (store === undefined) return;
    void store.pickMenu(ownerId, menu.unit, menu.id);
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
    const library = this.lib.library;
    const readState = this.lib.readState;
    const device = this.filterDevice();
    const filter = this.filter;
    const tabbed = devices.length > 1;
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
        <div class="pk-pin">
          ${this.renderHead(library, device, devices)}
          ${tabbed ? this.renderTabs(devices, library, filter) : nothing}
        </div>
        <div class="pk-body" role=${tabbed ? "tabpanel" : nothing} aria-labelledby=${tabbed ? `am-tab-${filter}` : nothing}>
          ${library === undefined ? html`<p class="ap-empty">${lead}</p>`
            : devices.length === 0 ? html`<p class="ap-empty">${menusEmptyText(devices, this.search)}</p>`
            : device === undefined ? this.renderSections(library, devices)
            : this.renderDevice(library, device, devices)}
        </div>
        <div class="pk-foot"><span class="pk-foot-hint">${device === undefined ? MENUS_FOOT : menusDeviceFoot(device)}</span></div>
      </div>
    </div></div>`;
  }

  /** All: the menus in two sections, Anywhere menus first, each under its
   * heading with its count. */
  private renderSections(library: Library, devices: readonly LinkDevice[]): TemplateResult {
    const shown = shownMenus(library, this.search, this.deviceKind, devices);
    const waiting = this.waiting(library);
    return html`${menuSections(shown).map(({ unit, menus }) => html`<section class="am-section" aria-labelledby=${`am-section-${unit}`}>
      <div class="am-section-head">
        <h2 class="am-section-title" id=${`am-section-${unit}`}>${MENU_SECTION_TITLES[unit]} <span class="am-section-n">${menus.length}</span></h2>
      </div>
      ${menus.length === 0 ? html`<p class="ap-empty">${menusEmptyText(devices, this.search, this.deviceKind)}</p>`
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
   * tick on its card puts it on one. */
  private renderNewDialog(form: NewForm): TemplateResult {
    return renderNewItemDialog("menus", form, [], {
      onName: (name) => { this.newForm = { ...form, name }; },
      onUnit: (unit) => this.setNewUnit(form, unit),
      onMake: () => void this.makeMenu(),
      onClose: () => { if (!form.busy) this.newForm = undefined; },
    });
  }

  /** The head, the Pages tab's without Multi select: the Device menu on All
   * and the search at the right. */
  private renderHead(library: Library | undefined, device: LinkDevice | undefined, devices: readonly LinkDevice[]): TemplateResult {
    return html`<div class="pk-head">
      ${device === undefined && library !== undefined && hasBothKinds(devices) ? this.renderKinds(library, devices) : nothing}
      <label class="pk-search">
        ${uiIcon("search")}
        <input type="search" class="pk-search-input" .value=${this.search} placeholder="Search by menu or device" aria-label="Search menus"
          @input=${(e: InputEvent) => { this.search = (e.target as HTMLInputElement).value; }} />
      </label>
    </div>`;
  }

  /** The Device menu: All, Watches, iPhones, each with how many menus the
   * search has left. */
  private renderKinds(library: Library, devices: readonly LinkDevice[]): TemplateResult {
    const kind = this.deviceKind;
    const options = menuKindOptions(shownMenus(library, this.search, "all", devices), devices);
    return html`<label class="pk-shape">
      <span class="pk-shape-lead">Device</span>
      <select aria-label="Show the menus used on one kind of device" .value=${kind}
        @change=${(e: Event) => this.setDeviceKind((e.target as HTMLSelectElement).value as PagesKind)}>
        ${options.map((o) => html`<option value=${o.key} ?selected=${o.key === kind}>${o.label} (${o.count})</option>`)}
      </select>
    </label>`;
  }

  /** The device tabs: All, then a tab per device with how many menus it
   * uses, the selected one underlined. */
  private renderTabs(devices: readonly LinkDevice[], library: Library | undefined, filter: PagesFilter): TemplateResult {
    return html`<div class="pk-tabs" role="tablist" aria-label="Devices">
      ${menuFilterChips(devices, library, this.colorOf).map((chip) => html`<button type="button" role="tab" class="pk-tab ${chip.id === filter ? "on" : ""}"
        style=${chip.color === undefined ? nothing : `--dc:${chip.color}`} id=${`am-tab-${chip.id}`} aria-selected=${chip.id === filter ? "true" : "false"}
        title=${chip.id === ALL_FILTER ? "Every menu in your home" : `The menus ${chip.label} uses`}
        @click=${() => this.setFilter(chip.id)}>
        <span class="pk-tab-glyph" aria-hidden="true">${uiIcon(chip.kind === undefined ? "grid" : chip.kind === "iphone" ? "phone" : "watch")}</span>
        <span class="pk-tab-name">${chip.label}</span>
        <span class="pk-tab-count">${chip.count}</span>
      </button>`)}
    </div>`;
  }

  /** A card's round ticks: one per device, or on a device tab's rest the
   * menu's devices and "Add to this watch". */
  private renderCardTicks(library: Library, menu: LibraryMenu, devices: readonly LinkDevice[], waiting: ReadonlySet<string>, addFor?: string): TemplateResult {
    const store = this.lib.store;
    const note = store?.noteFor("menus", menu.id);
    const admin = this.hassNow?.user?.is_admin;
    return renderTicks({
      library, kind: "menus", itemId: menu.id, devices, colorOf: this.colorOf,
      ...(store === undefined ? {} : { pending: store.pending }),
      ...(note === undefined ? {} : { note }),
      ...(admin === undefined ? {} : { admin }),
      ...(addFor === undefined ? {} : { addFor }),
      locked: (ownerId) => {
        if (hasItem(library, ownerId, "menus", menu.id)) return undefined;
        if (dirtyHere(ownerId)) return menusDirtyText(devices.find((d) => d.ownerId === ownerId)?.name ?? "This device");
        if (waiting.has(ownerId)) return MENUS_WAIT_TEXT;
        return undefined;
      },
    }, (ownerId) => this.use(menu, ownerId));
  }

  private renderCard(library: Library, menu: LibraryMenu, devices: readonly LinkDevice[], waiting: ReadonlySet<string>, addFor?: string): TemplateResult {
    const opensOn = openMenuDevice(menu, addFor === undefined ? this.filter : ALL_FILTER, this.deviceKind, devices);
    const title = opensOn === undefined ? libraryEditTitle(menu.name) : `Edit ${menu.name} on ${opensOn.name}`;
    const unused = menu.owners.length === 0;
    const asking = this.deleteAsk === menu.id;
    return html`<div class="ap-card ${addFor === undefined ? "" : "lt-dim"}" role="listitem" data-card=${menu.id}>
      <div class="ap-top">
        <button type="button" class="ap-open" title=${title} @click=${() => this.open(menu)}>
          <b class="ap-name">${menu.name}</b>
          <small class="ap-detail">${menuDetail(menu)}</small>
        </button>
      </div>
      <button type="button" class="ap-thumb" tabindex="-1" aria-hidden="true" title=${title} @click=${() => this.open(menu)}>
        ${this.renderThumb(library, menu, opensOn, addFor === undefined ? PIC_H : 92)}
      </button>
      ${this.renderCardTicks(library, menu, devices, waiting, addFor)}
      ${unused ? (asking ? html`<div class="am-del-ask" role="alertdialog" aria-label=${`Delete ${menu.name}?`}>
          <span><b>Delete ${menu.name}?</b> No device uses it. This cannot be undone.</span>
          <span class="am-new-acts">
            <button type="button" class="am-btn danger" ?disabled=${this.deleting} @click=${() => void this.deleteMenu(menu)}>Really delete</button>
            <button type="button" class="am-btn" ?disabled=${this.deleting} @click=${() => { this.deleteAsk = undefined; }}>Cancel</button>
          </span>
        </div>` : html`<button type="button" class="am-btn danger am-del" title=${`Delete ${menu.name} from the library`}
          @click=${() => { this.deleteAsk = menu.id; }}>${uiIcon("delete")}<span>Delete</span></button>`) : nothing}
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

  /**
   * A device's tab (mock frame 2b): its Anywhere menu and Entity quick menu,
   * each a row with its picture, its name and facts, and a menu to pick
   * another; then the library's other menus, dimmed, each with its ticks.
   */
  private renderDevice(library: Library, device: LinkDevice, devices: readonly LinkDevice[]): TemplateResult {
    const rows = deviceMenuRows(library, device.ownerId);
    const rest = restMenus(library, device.ownerId, this.search, devices);
    const waiting = this.waiting(library);
    const store = this.lib.store;
    const pages = pagesDocumentFor(library, device.ownerId);
    const stuck = dirtyHere(device.ownerId) ? menusDirtyText(device.name) : waiting.has(device.ownerId) ? MENUS_WAIT_TEXT : undefined;
    const notes = rows.flatMap((r) => [r.menu, ...r.others]).map((m) => (m === undefined ? undefined : store?.noteFor("menus", m.id))).filter((n): n is string => n !== undefined);
    return html`<div class="lt-view">
      <div class="lt-sect"><span>${onDeviceTitle(device)} <small>${rows.filter((r) => r.menu !== undefined).length}</small></span>
        <span class="lt-sect-r">${menusDeviceFoot(device)}</span></div>
      <div class="lt-list" role="list" aria-label=${onDeviceTitle(device)}>${rows.map((row) => html`<div class="lt-row" role="listitem" data-unit=${row.unit}>
        <button type="button" class="lt-row-open" title=${`Edit the ${row.title} on ${device.name}`} @click=${() => this.openUnit(device, row.unit)}>
          ${row.menu === undefined ? html`<span class="lr-ring" style=${`width:${ROW_MENU_PICTURE_H}px;height:${ROW_MENU_PICTURE_H}px`} aria-hidden="true"></span>` : renderMenuRowPicture({
            menu: row.menu, hass: this.hassNow, icons: this.icons, tick: this.iconsTick, onReady: () => this.requestUpdate(),
            ...(row.unit === "anywhere" ? { pages } : {}),
          })}
          <span class="lt-row-nm"><span class="lt-row-n">${row.title}</span>
            <span class="lt-row-m">${row.menu === undefined ? "None yet. Open it to set it up." : deviceMenuMeta(row.menu, device.ownerId, devices)}</span></span>
        </button>
        ${row.menu === undefined && row.others.length === 0 ? nothing : html`<select class="lt-pick-sel" aria-label=${`The ${row.title} ${device.name} uses`}
          .value=${live(row.menu?.id ?? "")}
          ?disabled=${stuck !== undefined || store === undefined} title=${stuck ?? `Pick the ${row.title} ${device.name} uses`}
          @change=${(e: Event) => {
            const id = (e.target as HTMLSelectElement).value;
            const menu = row.others.find((m) => m.id === id);
            if (menu !== undefined) this.use(menu, device.ownerId);
          }}>
          ${row.menu === undefined ? html`<option value="" selected disabled>Pick a menu</option>` : nothing}
          ${[...(row.menu === undefined ? [] : [row.menu]), ...row.others].map((m) => html`<option value=${m.id} ?selected=${m === row.menu}>${m.name}</option>`)}
        </select>`}
      </div>`)}</div>
      ${notes.map((n) => html`<p class="lt-line warn" role="alert">${n}</p>`)}
      <div class="lt-sect"><span>${restTitle(device)} <small>${rest.length}</small></span><span class="lt-sect-r">${restHint("menus")}</span></div>
      ${rest.length === 0 ? html`<p class="lt-line">${this.search.trim() === "" ? `${device.name} uses every menu in your home.` : "No other menu has that name."}</p>`
        : html`<div class="ap-grid" role="list">${rest.map((menu) => this.renderCard(library, menu, devices, waiting, device.ownerId))}</div>`}
    </div>`;
  }

  static override styles = [listTabStyles, libraryListStyles, libraryTicksStyles, rowPictureStyles, newItemDialogStyles, css`
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
  `];
}

if (!customElements.get("wa-all-menus")) customElements.define("wa-all-menus", WaAllMenus);

declare global {
  interface HTMLElementTagNameMap {
    "wa-all-menus": WaAllMenus;
  }
}
