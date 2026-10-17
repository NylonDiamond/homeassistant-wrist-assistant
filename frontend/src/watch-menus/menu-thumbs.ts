// The three menus drawn small, for the Menus door on Home: the Anywhere
// menu, the Entity quick menu (the Light menu) and the page switcher, each as
// the Menus screen's own stage draws it (`renderMenuScreen`), only scaled down
// to the door's height and still. With `menu` it draws that one alone, as a
// card on the Menus tab does (`all-menus.ts`). It lives in the menu editor's
// chunk, so Home loads it the first time it shows a watch's Menus door
// (`import("./watch-menus/menu-thumbs.js")` in panel.ts), and the panel's
// first download stays as it was.

import { LitElement, css, html, nothing } from "lit";
import { property } from "lit/decorators.js";
import type { HassLike } from "../ha-api.js";
import type { IconProvider } from "../renderer.js";
import { SymbolBrowser } from "../symbols.js";
import { watchFrameStyles } from "../watch-frame.js";
import { watchSwitcherRows } from "./menu-editor.js";
import { menuStageStyles, renderMenuScreen } from "./menu-stage.js";
import { type MenusScreen, type MenusSection, type MenusViewHost, menuViewStyles, selectMenu } from "./menu-view.js";
import { type MenusDocument, NO_MENU_TARGETS, asWatchMenusDocument, watchMenusDefaults } from "./model.js";

/** The menus, in the Menus card's order, with the name each thumbnail's
 * tooltip gives. */
const THUMBS: readonly [MenusSection, string][] = [
  ["anywhere", "Anywhere menu"],
  ["entity", "Entity quick menu"],
  ["switcher", "Page switcher"],
];

export class WaMenuThumbs extends LitElement {
  @property({ attribute: false }) hass?: HassLike;
  @property({ attribute: false }) icons?: IconProvider;
  /** The watch's menus record's document; nothing stored yet draws the
   * defaults, as the watch does. */
  @property({ attribute: false }) menus: unknown;
  /** The watch's pages record's document, for the switcher's pages. */
  @property({ attribute: false }) pages: unknown;
  @property({ attribute: false }) screen?: MenusScreen;
  /** Draw this menu alone, centred, rather than all three. */
  @property({ reflect: true }) menu?: MenusSection;
  /** Each watch's height on screen, in CSS pixels. */
  @property({ type: Number }) height = 56;
  /** The panel's icon tick: a new value draws again once more icons load. */
  @property({ attribute: false }) tick = 0;

  private readonly symbols = new SymbolBrowser(() => this.requestUpdate());

  private host(document: MenusDocument, menu: MenusSection, screen: MenusScreen, hass: HassLike, icons: IconProvider): MenusViewHost {
    const rows = watchSwitcherRows(this.pages);
    const host: MenusViewHost = {
      hass,
      icons,
      symbols: this.symbols,
      document,
      targets: NO_MENU_TARGETS,
      catalogKnown: false,
      busy: true,
      uiState: new Map(),
      screen,
      scale: this.height / screen.height,
      switcherPages: rows.filter((p) => !p.hidden).map(({ hidden: _, ...page }) => page),
      switcherRows: rows,
      edit: () => false,
      endCoalesce: () => undefined,
      requestUpdate: () => undefined,
    };
    selectMenu(host, menu);
    return host;
  }

  override render() {
    const { hass, icons, screen } = this;
    if (hass === undefined || icons === undefined || screen === undefined) return nothing;
    const document = asWatchMenusDocument(this.menus) ?? watchMenusDefaults();
    const thumbs = this.menu === undefined ? THUMBS : THUMBS.filter(([menu]) => menu === this.menu);
    return html`${thumbs.map(([menu, name]) => html`<span class="mt" title=${name}>
      ${renderMenuScreen(this.host(document, menu, screen, hass, icons))}</span>`)}`;
  }

  static override styles = [watchFrameStyles, menuViewStyles, menuStageStyles, css`
    :host { flex: 1; min-width: 0; display: flex; justify-content: space-between; gap: 6px; pointer-events: none; line-height: 0; }
    :host([menu]) { justify-content: center; }
    .mt { flex: none; display: block; }
    /* The screen alone, as the Pages door draws its pages: no case, no
       crown, a hairline round the screen's corners. */
    .mt .wa-watch { padding: 0; margin: 0; background: none; box-shadow: 0 0 0 1px var(--wa-line-strong); border-radius: var(--wf-radius, 6px); }
    .mt .wa-watch::before, .mt .wa-watch::after { display: none; }
    .mt .ms-label, .mt .me-count { display: none; }
  `];
}

if (!customElements.get("wa-menu-thumbs")) customElements.define("wa-menu-thumbs", WaMenuThumbs);
