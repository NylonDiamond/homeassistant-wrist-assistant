// How one page shows in the watch's page switcher: hidden or not, as its name
// or as an icon, the name, the icon and the color there. The menu editor
// draws these rows for the page picked in its Pages card, beside the
// switcher's own look, as the iPhone app's Page Switcher editor has them.
//
// The rows are written against a narrow host, not the page editor's
// `WatchPagesEditorHost`: the menu editor holds a pages draft beside its
// menus draft and has none of the page editor's state. Nothing here imports
// the page editor's views (`page-settings.ts`, `tile-settings.ts`), so the
// menu editor's chunk stays small; the typing bookkeeping below is a small
// copy of the tile settings' own (`typingField`).
//
// Every edit goes through the setters of `page-settings-model.ts` and reads
// the document at the moment it commits (`host.edit`).

import { html, nothing, type TemplateResult } from "lit";
import { checkField, colorField, segField, symbolField, textField } from "../editors.js";
import type { IconProvider } from "../renderer.js";
import type { SymbolBrowser } from "../symbols.js";
import type { WatchPage, WatchPagesDocument } from "./model.js";
import {
  WATCH_PAGE_SWITCHER_MODES,
  setWatchPageHideFromSwitcher,
  setWatchPageSwitcherColor,
  setWatchPageSwitcherDisplayMode,
  setWatchPageSwitcherIcon,
  setWatchPageSwitcherText,
  watchPageReadsOtherThanDefault,
  watchPageSettings,
} from "./page-settings-model.js";

/** What the rows are handed on every draw. `page` and `busy` are getters
 * that read the pages draft each time, never a copy taken at the draw. */
export interface SwitcherSettingsHost {
  /** The page as the pages draft has it now. */
  readonly page: WatchPage;
  readonly pageId: string;
  readonly icons: IconProvider;
  readonly symbols: SymbolBrowser;
  /** A save is out: every row is drawn off and every edit refused. */
  readonly busy: boolean;
  /** View state kept between draws (text typed and not committed yet).
   * Keys here start with `switcher-settings:`. */
  readonly uiState: Map<string, unknown>;
  /** Apply an edit to the pages document; `typing` coalesces a run of
   * keystrokes into one undo step, as tile-settings' commit does. */
  edit(change: (document: WatchPagesDocument) => WatchPagesDocument, opts?: { typing?: boolean }): void;
  /** End the coalesced run, so the next edit is a step of its own. Called
   * when a typed field loses focus. */
  endCoalesce(): void;
  requestUpdate(): void;
}

/** The card's title, in the menu editor's inspector. */
export const SWITCHER_SECTION_TITLE = "In the page switcher";

/** A page's keys for the page switcher. */
export const SWITCHER_KEYS = ["switcherIcon", "switcherColor", "switcherText", "switcherDisplayMode", "hideFromSwitcher"] as const;

/** Every `uiState` key of this module starts with this. */
const KEY = "switcher-settings";
/** Set when a field's reset dot is pressed: the edit it makes next is a
 * step of its own, never part of a run of typing. */
const DOT_KEY = `${KEY}:resetDot`;

/** Whether the page's switcher keys hold a value of the page's own (a name,
 * icon, color or mode, or hiding): the card's changed dot. Stored defaults
 * (`hideFromSwitcher: false`) are no change. */
export function watchPageSwitcherChanged(page: WatchPage): boolean {
  return watchPageReadsOtherThanDefault(page, SWITCHER_KEYS, (p) => {
    const s = watchPageSettings(p);
    return [s.switcherIcon, s.switcherColor, s.switcherText, s.switcherDisplayMode ?? "text", s.hideFromSwitcher];
  });
}

/** How the page shows in the switcher, in a word or two: the card's
 * summary. */
export function switcherSettingsSummary(page: WatchPage): string {
  const s = watchPageSettings(page);
  return s.hideFromSwitcher ? "Hidden" : s.switcherText ?? (s.switcherDisplayMode === "icon" ? "Icon" : "Shown");
}

// ── typing ───────────────────────────────────────────────────────────────

function typedKey(host: SwitcherSettingsHost, setting: string): string {
  return `${KEY}:typed:${host.pageId.toUpperCase()}:${setting}`;
}

/** What a field shows while it is typed in, else undefined. */
function typed(host: SwitcherSettingsHost, setting: string): string | undefined {
  const value = host.uiState.get(typedKey(host, setting));
  return typeof value === "string" ? value : undefined;
}

/** The field a person is in now, through every shadow root. */
function focusedField(): Element | null {
  if (typeof document === "undefined") return null;
  let at: Element | null = document.activeElement;
  while (at?.shadowRoot?.activeElement) at = at.shadowRoot.activeElement;
  return at;
}

/** Drop typed text of fields that are not focused any more: a field removed
 * while focused (an undo that took the page away) sends no focusout. */
function dropStaleTyping(host: SwitcherSettingsHost): void {
  const focused = focusedField();
  const inField = typeof HTMLElement !== "undefined" && focused instanceof HTMLElement
    ? focused.closest<HTMLElement>("[data-sw-field]")?.dataset.swField
    : undefined;
  for (const key of [...host.uiState.keys()]) {
    if (!key.startsWith(`${KEY}:typed:`)) continue;
    if (inField === undefined || key !== typedKey(host, inField)) host.uiState.delete(key);
  }
}

/** One edit. `typing` makes a run of edits from one field one undo step;
 * an edit a reset dot makes is always a step of its own. */
function write(host: SwitcherSettingsHost, change: (document: WatchPagesDocument) => WatchPagesDocument, typing = false): void {
  const fromDot = host.uiState.delete(DOT_KEY);
  if (host.busy) return;
  host.edit(change, typing && !fromDot ? { typing: true } : undefined);
}

/**
 * A field that is typed in: what is typed is kept while it has focus, so a
 * value the setter refuses (half a color) stays as typed, and its run of
 * edits ends when it loses focus. Only the text box counts; the opacity box
 * of a color does not.
 */
function typingRow(host: SwitcherSettingsHost, setting: string, body: TemplateResult): TemplateResult {
  const key = typedKey(host, setting);
  const keeps = (target: EventTarget | null): target is HTMLInputElement =>
    typeof HTMLInputElement !== "undefined" && target instanceof HTMLInputElement && target.type === "text" && !target.closest(".alpha");
  // Recorded on the way down, before the field's own handler edits, so the
  // redraw that edit asks for draws this keystroke's text.
  const record = {
    capture: true,
    handleEvent: (e: Event) => {
      if (keeps(e.target)) host.uiState.set(key, e.target.value);
    },
  };
  // On the way down too: the dot stops its click where it is.
  const dot = {
    capture: true,
    handleEvent: (e: Event) => {
      if (!(e.target instanceof Element) || e.target.closest(".reset-dot") === null) return;
      host.endCoalesce();
      host.uiState.set(DOT_KEY, true);
    },
  };
  return html`<div class="ts-typing" data-sw-field=${setting}
    @input=${record}
    @click=${dot}
    @change=${(e: Event) => {
      const t = e.target;
      if (typeof HTMLInputElement === "undefined" || !(t instanceof HTMLInputElement)) return;
      // The system color picker sends input all through a drag and change
      // when it is let go: the end of that run.
      if (t.type === "color") host.endCoalesce();
      // The color's switch decides what is stored, so text typed in the box
      // beside it is no longer what the row shows.
      if (t.type === "checkbox") {
        host.uiState.delete(key);
        host.endCoalesce();
        host.requestUpdate();
      }
    }}
    @focusout=${(e: FocusEvent) => {
      if (!keeps(e.target)) return;
      const stayed = e.relatedTarget instanceof Node && (e.currentTarget as HTMLElement).contains(e.relatedTarget);
      if (stayed) return;
      host.uiState.delete(key);
      host.endCoalesce();
      host.requestUpdate();
    }}>${body}</div>`;
}

// ── the rows ─────────────────────────────────────────────────────────────

/**
 * The page's rows for the page switcher: Hidden, Show as Name or Icon, the
 * name, Automatic icon, the icon, the color (with its switch), and the hint.
 * Each left empty is chosen by the watch, as on the iPhone. Typed text left
 * over from a field no longer focused is dropped first.
 */
export function renderSwitcherSettings(host: SwitcherSettingsHost): TemplateResult {
  dropStaleTyping(host);
  const page = host.page;
  const s = watchPageSettings(page);
  const mode = s.switcherDisplayMode ?? "text";
  const modes = WATCH_PAGE_SWITCHER_MODES.map((m) => [m, m === "icon" ? "Icon" : "Name"] as [string, string]);
  const name = typeof page.name === "string" ? page.name : "";
  const setIcon = (value: string) => write(host, (d) => setWatchPageSwitcherIcon(d, host.pageId, value), true);
  const setColor = (value: string | undefined) => write(host, (d) => setWatchPageSwitcherColor(d, host.pageId, value), true);
  return html`
    ${checkField("Hidden", s.hideFromSwitcher, (v) => write(host, (d) => setWatchPageHideFromSwitcher(d, host.pageId, v)), false)}
    ${s.hideFromSwitcher ? html`<div class="hint ts-under">The page stays on the watch. Only the switcher leaves it out.</div>` : nothing}
    ${segField("Show as", modes.some(([m]) => m === mode) ? mode : "text", modes, (v) =>
      write(host, (d) => setWatchPageSwitcherDisplayMode(d, host.pageId, v)))}
    ${typingRow(host, "switcherText", textField("Name", typed(host, "switcherText") ?? s.switcherText ?? "", (v) =>
      write(host, (d) => setWatchPageSwitcherText(d, host.pageId, v), true), { placeholder: name }))}
    <div class="ts-chips" role="group" aria-label="Switcher icon">
      <button type="button" class="pe-chip ${s.switcherIcon === undefined ? "on" : ""}" aria-pressed=${s.switcherIcon === undefined ? "true" : "false"}
        title="The watch picks one from the page's first tile" @click=${() => write(host, (d) => setWatchPageSwitcherIcon(d, host.pageId, ""))}>Automatic icon</button>
    </div>
    ${typingRow(host, "switcherIcon", symbolField({ icons: host.icons, symbols: host.symbols }, typed(host, "switcherIcon") ?? s.switcherIcon ?? "", setIcon, "sw:switcher-icon", undefined, "Icon", false))}
    ${typingRow(host, "switcherColor", html`<div class="ts-no-alpha">${colorField("Color", typed(host, "switcherColor") ?? s.switcherColor, setColor, true, null, { switchOn: s.switcherColor !== undefined })}</div>`)}
    <div class="hint ts-under">Left empty, the watch shows the page's name and picks the icon and color itself.</div>`;
}
