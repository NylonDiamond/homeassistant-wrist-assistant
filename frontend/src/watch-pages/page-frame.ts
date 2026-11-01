// The frame the page editor and the status page editor share, so there is one
// editor layout to learn (mock-pages, view 2): the top bar's parts in their
// order (the way back, the switcher's grid button, the name in place, what
// the page holds, "Shown on" and its chips, then a divider and the fixed
// right cluster of Undo, Redo, Saved or Save, ··· and Hints), the stage's
// dock and + Add button, and the inspector's Page head and tip line.
//
// Only what both editors draw lives here, as plain templates over what each
// hands in: neither imports the other. Both put `pageFrameStyles` in their
// sheet, before their own rules.

import { css, html, nothing, svg, type TemplateResult } from "lit";
import { live } from "lit/directives/live.js";
import { type PreviewKind, rememberPreview } from "../library/item-mode.js";
import { uiIcon } from "../ui-icons.js";

const IS_MAC = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
const MOD = IS_MAC ? "⌘" : "Ctrl+";

// ── the name in place ────────────────────────────────────────────────────

/** A name being typed in the bar or the inspector, kept by the editor until
 * Enter or clicking away writes it and Escape drops it. */
export interface TypedName {
  pageId: string;
  value: string;
}

/** What a name field is handed. */
export interface NameFieldInput {
  /** The name as the draft has it. */
  name: string;
  /** What is typed now, while the field is being typed in. */
  typed: string | undefined;
  /** The field's name for a screen reader and its tooltip. */
  label: string;
  placeholder: string;
  disabled: boolean;
  onInput: (value: string) => void;
  /** Enter or clicking away. Nothing typed: the editor does nothing. */
  onCommit: () => void;
  /** Escape: the name goes back to what the draft has. */
  onCancel: () => void;
}

/** The keys both name fields answer: Enter keeps and Escape drops, and each
 * lets go of the field, so the next key goes to the editor again. Escape
 * stops here, so it never also lets go of a picked tile or row. */
function nameKeys(o: NameFieldInput): (e: KeyboardEvent) => void {
  return (e) => {
    const input = e.target as HTMLInputElement;
    if (e.key === "Enter") {
      e.preventDefault();
      o.onCommit();
      input.blur();
    } else if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      o.onCancel();
      input.blur();
    }
  };
}

const PENCIL = svg`<path d="M10.8 2.7l2.5 2.5L5.6 12.9l-3.1.6.6-3.1 7.7-7.7z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>`;

/**
 * The name as a text field in the bar: a plain title until the pointer is on
 * it, then a faint well and a pencil. It is a real input all along, so it
 * takes a click, a Tab and a screen reader as any field does. The hidden copy
 * of its text (`data-size`) is what sizes it to its words.
 */
export function renderNameInPlace(o: NameFieldInput): TemplateResult {
  const shown = o.typed ?? o.name;
  return html`<span class="pe-name" data-size=${shown === "" ? o.placeholder : shown}>
    <input type="text" class="pe-name-in" size="1" aria-label=${o.label} title=${`${o.label}. Click to rename.`} placeholder=${o.placeholder}
      spellcheck="false" autocomplete="off" .value=${live(shown)} ?disabled=${o.disabled}
      @input=${(e: Event) => o.onInput((e.target as HTMLInputElement).value)}
      @keydown=${nameKeys(o)}
      @blur=${() => o.onCommit()} />
    <svg class="pe-name-pen" viewBox="0 0 16 16" aria-hidden="true">${PENCIL}</svg>
  </span>`;
}

/** The same name as the first row of the inspector's Page: a plain field. */
export function renderNameRow(o: NameFieldInput): TemplateResult {
  const shown = o.typed ?? o.name;
  return html`<label class="field pe-page-name"><span>Name</span>
    <input type="text" aria-label=${o.label} placeholder=${o.placeholder} autocomplete="off" .value=${live(shown)} ?disabled=${o.disabled}
      @input=${(e: Event) => o.onInput((e.target as HTMLInputElement).value)}
      @keydown=${nameKeys(o)}
      @blur=${() => o.onCommit()} /></label>`;
}

/** The lead of the device chips while the page is on no device: a quiet fact,
 * in no warning ink, since nothing is wrong with it. */
export const ON_NO_DEVICE_TEXT = "On no device yet";

/** The names of the devices a page is on, for a switcher card: "On no device
 * yet", "On Jesse's Watch", "On Jesse's Watch and Kitchen", "On 3 devices". */
export function pageDevicesText(names: readonly string[]): string {
  if (names.length === 0) return ON_NO_DEVICE_TEXT;
  if (names.length <= 2) return `On ${names.join(" and ")}`;
  return `On ${names.length} devices`;
}

// ── the switcher's button ────────────────────────────────────────────────

/** The small grid button that opens the page switcher, its tooltip saying
 * what it does: separate from the name, which it used to hide behind. */
export function renderSwitcherButton(o: { open: boolean; title: string; label: string; onClick: () => void }): TemplateResult {
  return html`<button type="button" class="pe-pp" aria-haspopup="dialog" aria-expanded=${o.open ? "true" : "false"}
    aria-label=${o.label} title=${o.title} @click=${o.onClick}>${uiIcon("grid")}</button>`;
}

/** What the page holds beside its name: "9 tiles · Shared". */
export function renderBarMeta(what: string, sharedTitle: string): TemplateResult {
  return html`<span class="pe-bar-meta">${what} · <span title=${sharedTitle}>Shared</span></span>`;
}

// ── the right cluster ────────────────────────────────────────────────────

/** Undo and Redo, first in the right cluster. */
export function renderUndoRedo(o: { canUndo: boolean; canRedo: boolean; onUndo: () => void; onRedo: () => void }): TemplateResult {
  return html`<span class="pe-bar-undo">
    <button type="button" class="tb-btn icon pe-bar-icon" ?disabled=${!o.canUndo} title=${`Undo (${MOD}Z)`} aria-label="Undo"
      @click=${o.onUndo}>${uiIcon("undo")}</button>
    <button type="button" class="tb-btn icon pe-bar-icon" ?disabled=${!o.canRedo} title=${IS_MAC ? "Redo (⇧⌘Z)" : "Redo (Ctrl+Y)"} aria-label="Redo"
      @click=${o.onRedo}>${uiIcon("redo")}</button>
  </span>`;
}

/**
 * Where the draft stands: a quiet "Saved" with a check and no button, or
 * "Unsaved changes" and the blue Save, reading "Saving…" while one runs.
 * `reach` finishes the tooltips: "A save reaches every device that has this
 * page."
 */
export function renderSaveState(o: { dirty: boolean; saving: boolean; reach: string; onSave: () => void }): TemplateResult {
  if (!o.dirty && !o.saving) {
    return html`<span class="pe-saved" role="status" title=${`Everything here is saved. ${o.reach}`}>${uiIcon("check")}<span>Saved</span></span>`;
  }
  return html`${o.saving ? nothing : html`<span class="pe-unsaved" role="status" title="Not saved yet"><i class="pe-unsaved-dot" aria-hidden="true"></i><span>Unsaved changes</span></span>`}
    <button type="button" class="primary save dirty pe-save" ?disabled=${o.saving}
      title=${`Save (${MOD}S). ${o.reach}`} @click=${o.onSave}>${o.saving ? "Saving…" : "Save"}</button>`;
}

const HINTS_KEY = "wa-page-editor-help";

/** Whether the bar's Hints are on. Off by default. Kept in this browser only,
 * and one switch for both editors. */
export function hintsOn(): boolean {
  try {
    return globalThis.localStorage.getItem(HINTS_KEY) === "1";
  } catch {
    return false;
  }
}

export function setHintsOn(on: boolean): void {
  try {
    if (on) globalThis.localStorage.setItem(HINTS_KEY, "1");
    else globalThis.localStorage.removeItem(HINTS_KEY);
  } catch {
    // A browser without storage keeps the hints off on the next visit.
  }
}

/** Hints, last in the right cluster. Called Hints, not Help: the panel's tab
 * row right above has a Help that opens the setup guide. */
export function renderHintsButton(on: boolean, onToggle: () => void): TemplateResult {
  const title = on ? "Hide the hints on the stage and under the settings" : "Show the hints on the stage and under the settings";
  return html`<button type="button" class="tb-btn pe-bar-help ${on ? "on" : ""}" aria-pressed=${on ? "true" : "false"} title=${title}
    @click=${onToggle}>Hints</button>`;
}

// ── the dock ─────────────────────────────────────────────────────────────

/** Preview on, last in the stage's dock: Watch, iPhone and, on a home that
 * keeps iPhone pages, Both (the other kind drawn beside the edited one). A
 * pick changes what the page is drawn on and nothing else. */
export function renderPreviewSeg(o: { kind: PreviewKind; duo: boolean; phones: boolean; onPick: (kind: PreviewKind) => void; onBoth: () => void }): TemplateResult {
  const kind = (k: PreviewKind, label: string) => {
    const on = o.kind === k && !o.duo;
    return html`<button type="button" class="pe-seg-btn ${on ? "on" : ""}" aria-pressed=${on ? "true" : "false"}
      title=${k === "watch" ? "Preview on a watch" : "Preview on an iPhone"}
      @click=${() => { if (!on) { rememberPreview(k); o.onPick(k); } }}>${label}</button>`;
  };
  return html`<div class="pe-seg" role="group" aria-label="Preview on" title="What the page is drawn on. Nothing is changed on any device.">
    ${kind("watch", "Watch")}
    ${kind("iphone", "iPhone")}
    ${o.phones ? html`<button type="button" class="pe-seg-btn ${o.duo ? "on" : ""}" aria-pressed=${o.duo ? "true" : "false"}
      title="Side by side: a watch and an iPhone" @click=${() => { if (!o.duo) o.onBoth(); }}>Both</button>` : nothing}
  </div>`;
}

// ── the rules ────────────────────────────────────────────────────────────

export const pageFrameStyles = css`
  /* The editor bar (renderTopBar): one row the mock's 58px tall, All
     pages and the page picker at the left, the devices after them, and
     Undo, Redo, the save status, ··· and Help at the right. It wraps on a
     narrow editor, the right-hand group keeping together. */
  .wa-bar.pe-bar { gap: 6px 7px; min-height: 58px; padding: 6px 12px; margin-bottom: 0; }
  /* The right cluster pushes itself to the end: a spacer would only add a gap,
     and this bar needs every pixel to stay on one line at 1184. */
  .wa-bar.pe-bar > .spacer { display: none; }
  .pe-bar button.tb-btn { height: 32px; border-radius: 8px; }
  .pe-bar button.tb-btn:has(> svg.ui-icon) { display: inline-flex; align-items: center; gap: 6px; padding: 0 11px 0 9px; }
  .pe-bar button.tb-btn.pe-bar-back:has(> svg.ui-icon) { padding: 0 6px 0 2px; }
  .pe-bar button.tb-btn.pe-bar-help { padding: 0 9px; }
  .pe-bar button.tb-btn svg.ui-icon { width: 14px; height: 14px; }
  /* All pages, Undo and Redo are quiet: no outline until the pointer is on them. */
  .pe-bar button.tb-btn.pe-bar-back, .pe-bar button.tb-btn.icon { border-color: transparent; background: transparent; color: var(--wa-label, var(--wa-ink)); }
  .pe-bar button.tb-btn.pe-bar-back:hover, .pe-bar button.tb-btn.icon:hover:not(:disabled) { background: var(--wa-hover); color: var(--wa-ink); }
  .pe-bar button.tb-btn.icon { width: 34px; padding: 0; display: inline-grid; place-items: center; }
  .pe-bar button.tb-btn.icon svg.ui-icon { width: 17px; height: 17px; }
  .pe-bar-div { flex: none; width: 1px; height: 24px; background: var(--wa-line-strong); }
  .pe-bar-undo { display: inline-flex; align-items: center; gap: 2px; flex: none; }
  .pe-bar button.tb-btn:disabled { opacity: .4; cursor: default; }
  .pe-bar .pop-menu .row:disabled { opacity: .5; cursor: default; }
  .pe-bar .pop-menu .row:disabled:hover { background: transparent; }
  /* The ··· menu hangs from its own button, not the bar's right edge. */
  .pe-top-menu { position: relative; display: inline-flex; flex: none; }
  .pe-menu { min-width: 240px; }
  .pe-menu-facts {
    display: flex; flex-direction: column; gap: 2px; max-width: 320px; padding: 7px 10px 8px; margin-bottom: 3px;
    border-bottom: 1px solid var(--wa-line); font-size: 12px; line-height: 1.35; color: var(--wa-muted); white-space: normal;
  }
  .pe-menu-facts > b { font-size: 12.5px; font-weight: 600; color: var(--wa-ink); }
  .pe-bar button.tb-btn.pe-bar-help.on { background: var(--wa-sel-bg); border-color: var(--wa-sel-ring); color: var(--wa-ink); }
  /* Saved: quiet, in green with a check. Unsaved: the words in orange
     with a dot, and Save in blue, the bar's one loud button. */
  .pe-saved { display: inline-flex; align-items: center; gap: 6px; flex: none; padding: 0 2px; font-size: 12.5px; color: var(--wa-green); white-space: nowrap; }
  .pe-saved svg.ui-icon { width: 14px; height: 14px; }
  .pe-unsaved { display: inline-flex; align-items: center; gap: 7px; flex: none; font-size: 12.5px; font-weight: 500; color: var(--wa-hue-orange); white-space: nowrap; }
  .pe-unsaved-dot { display: block; flex: none; width: 7px; height: 7px; border-radius: 50%; background: currentColor; }
  .wa-bar.pe-bar button.primary.save.pe-save {
    height: 32px; min-height: 32px; padding: 0 16px; border-radius: 9px; border: 0; box-shadow: none;
    background: var(--wa-hue-blue); color: #fff; font-size: 13px; font-weight: 600; opacity: 1;
  }
  .wa-bar.pe-bar button.primary.save.pe-save:hover:not(:disabled) { background: color-mix(in srgb, var(--wa-hue-blue) 86%, #fff); }
  .wa-bar.pe-bar button.primary.save.pe-save:focus-visible { box-shadow: var(--wa-ring); }
  .wa-bar.pe-bar button.primary.save.pe-save:disabled { opacity: .7; cursor: progress; }
  /* The right cluster: always together at the bar's end, after its divider,
     so the save state sits in the same spot whatever the page is called. */
  .pe-bar-right { display: inline-flex; align-items: center; gap: 4px; flex: none; margin-left: auto; }
  .pe-bar-right > .pe-bar-div { margin-right: 2px; }
  /* The devices after the name (renderBarTicks): "Shown on", the ticked
     chips a size up from the cards', the dashed fold with the rest, then
     "saves at once". The fold is always shown here, whatever the width: the
     chip row only folds itself inside the old device strip. */
  .pe-bar-on { position: relative; display: flex; align-items: center; gap: 8px; flex: 0 1 auto; min-width: 0; }
  .pe-bar-on .lt-ticks { flex-direction: row; align-items: center; min-width: 0; }
  .pe-bar-on .lt-lead { font-weight: 600; }
  .pe-bar-on .lt-chips { gap: 6px; }
  .pe-bar-on .lt-chip { height: 28px; padding: 0 9px 0 7px; font-size: 12px; border-color: color-mix(in srgb, var(--dc, var(--wa-muted)) 55%, transparent); }
  .pe-bar-on .lt-chip.add { border-color: var(--wa-line-strong); }
  .pe-bar-on .lt-box { width: 12px; height: 12px; }
  /* "skips 2" stays in the chip's tooltip here: the line under the stage says
     the same in full, and the bar has no room for it at 1184. */
  .pe-bar-on .lt-chip .lt-skips { display: none; }
  .pe-bar-on wa-chip-row > .lt-chip.off:not(.add) { display: none; }
  .pe-bar-on wa-chip-row > .lt-fold { display: inline-flex; }
  .pe-bar-on .lt-fold-pop .lt-chip { height: 26px; }
  /* An untick's question and a refusal hang under the bar, over the stage. */
  .pe-bar-on :is(.lt-ask, .lt-note) { position: absolute; top: calc(100% + 10px); left: 0; z-index: 45; width: max-content; max-width: min(460px, 80vw); }
  .pe-bar-on .lt-note { padding: 7px 10px; border-radius: 8px; background: var(--wa-card); box-shadow: inset 0 0 0 1px var(--wa-line-strong), var(--wa-shadow-pop); }
  .pe-bar-on .pe-lib-hint { max-width: 280px; font-size: 12px; line-height: 1.3; color: var(--wa-muted); }

  /* The page switcher's small grid button, beside the name it used to hide
     behind. */
  .pe-pp-wrap { position: relative; flex: none; }
  .pe-pp {
    display: inline-grid; place-items: center; width: 30px; height: 30px; margin: 0; padding: 0;
    border: 1px solid var(--wa-line-strong); border-radius: 7px;
    background: var(--wa-card); color: var(--wa-label, var(--wa-ink)); cursor: pointer;
  }
  .pe-pp svg.ui-icon { width: 15px; height: 15px; }
  .pe-pp:hover, .pe-pp[aria-expanded="true"] { background: var(--wa-hover); color: var(--wa-ink); }
  .pe-pp:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  /* The popover: under the button, as wide as four cards, never past the
     editor's edge. */
  .pe-pp-pop {
    position: absolute; top: calc(100% + 8px); left: 0; z-index: 40;
    width: min(720px, calc(100cqw - 2 * var(--cf-pad, 16px))); max-height: min(72vh, 680px); overflow-y: auto;
    display: flex; flex-direction: column; gap: 14px; padding: 16px;
    border: 1px solid var(--wa-line-strong); border-radius: var(--wa-r-lg, 16px);
    background: var(--wa-card); color: var(--wa-ink); box-shadow: var(--wa-shadow-pop);
  }
  .pe-pp-top { display: flex; align-items: center; flex-wrap: wrap; gap: 8px 10px; }
  .pe-pp-top > strong { font-size: 15px; }
  .pe-pp-count { font-size: 12.5px; color: var(--wa-muted); }
  .pe-pp-find {
    margin-left: auto; width: 220px; max-width: 100%; min-height: 34px; padding: 0 10px;
    border: 1px solid var(--wa-line-strong); border-radius: var(--wa-r-sm, 8px);
    background: var(--wa-input, var(--wa-card)); color: var(--wa-ink); font: inherit; font-size: 13.5px;
  }
  .pe-pp-find:focus { outline: none; box-shadow: var(--wa-ring); border-color: var(--wa-sel-ring); }
  .pe-pp-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 12px; }
  .pe-pp-card {
    position: relative; display: flex; flex-direction: column; align-items: center; gap: 6px; min-width: 0; margin: 0;
    padding: 14px 8px 10px; border: 1px solid var(--wa-line); border-radius: 12px;
    background: var(--wa-panel); color: var(--wa-ink); font: inherit; cursor: pointer;
  }
  .pe-pp-card:hover:not(:disabled) { border-color: var(--wa-accent); }
  .pe-pp-card:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .pe-pp-card.on { border-color: var(--wa-sel-ring); background: var(--wa-sel-bg); }
  .pe-pp-card:disabled { opacity: .55; cursor: default; }
  .pe-pp-card-name, .pe-pp-card-sub { max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .pe-pp-card-name { font-size: 13.5px; font-weight: 600; }
  .pe-pp-card-sub { font-size: 11.5px; color: var(--wa-muted); }
  .pe-pp-tag {
    position: absolute; top: 7px; right: 7px; padding: 2px 7px; border-radius: 999px;
    background: var(--wa-primary-bg); color: var(--wa-primary-ink); font-size: 10.5px; font-weight: 600;
  }
  .pe-pp-card.pe-pp-new { justify-content: center; min-height: 150px; border-style: dashed; background: transparent; color: var(--wa-muted); }
  .pe-pp-card.pe-pp-new:hover:not(:disabled) { color: var(--wa-ink); }
  .pe-pp-plus svg.ui-icon { width: 22px; height: 22px; }
  .pe-pp-none { font-size: 13px; color: var(--wa-muted); }
  .pe-pp-foot { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; padding-top: 12px; border-top: 1px solid var(--wa-line); }
  .pe-pp-board { margin-left: auto; }

  .pe-seg {
    display: inline-flex; gap: 2px; padding: 3px; border-radius: 10px;
    background: var(--wa-field, var(--wa-panel)); border: 1px solid var(--wa-line);
  }
  .pe-seg-btn {
    margin: 0; padding: 5px 14px; border: 0; border-radius: 7px; background: none; color: var(--wa-muted);
    font: inherit; font-size: 12.5px; font-weight: 500; white-space: nowrap; cursor: pointer;
  }
  .pe-seg-btn:hover { color: var(--wa-ink); }
  .pe-seg-btn:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .pe-seg-btn.on { background: var(--wa-seg-on, var(--wa-card)); color: var(--wa-ink); box-shadow: 0 1px 2px rgba(0, 0, 0, .35); cursor: default; }

  /* The stage's foot, top to bottom: the row the picked tile's states
     float in, and the dock, one pill that ends with Preview on (Watch,
     iPhone, Both) beside Live preview. All in the flow, so none of them
     covers the device. */
  .pe-dock-area { position: relative; display: flex; flex-direction: column; align-items: center; gap: 6px; flex: none; min-width: 0; }
  .pe-dock > .pe-seg { flex: none; max-width: 100%; }
  /* The states' row keeps its height whether a tile is picked or not, so
     picking one never moves the device or refits it. The strip floats in
     it and stays one line (its chips scroll sideways, \`.pe-state-chips\`),
     so it never rises over the device above it. */
  .pe-try-slot { position: relative; align-self: stretch; height: 32px; flex: none; }
  .pe-dock-area > .stage-tools.pe-dock {
    position: relative; top: auto; z-index: 8; margin: 0; height: auto; min-height: 46px; width: max-content; max-width: calc(100% - 8px);
    display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: 4px; padding: 6px; overflow: visible;
    border-radius: 14px; background: var(--wa-card); border: 1px solid var(--wa-line-strong);
    box-shadow: var(--wa-shadow-float, var(--wa-shadow-pop));
  }
  .pe-dock .pe-zoom-pct { min-width: 50px; text-align: center; font-size: 12.5px; font-variant-numeric: tabular-nums; color: var(--wa-ink); }

  /* + Add tile at the top of the stage: the stage's one loud button, big
     and in blue with a soft glow of its own color, so it is found first. */
  .pe-stage-add {
    display: inline-flex; align-items: center; justify-content: center; gap: 7px; flex: none;
    margin: 0; padding: 9px 20px 9px 16px; border: 0; border-radius: 10px;
    background: var(--wa-hue-blue); color: #fff; font: inherit; font-size: 14px; font-weight: 600; line-height: 18px; cursor: pointer;
    box-shadow: 0 4px 18px color-mix(in srgb, var(--wa-hue-blue) 40%, transparent);
  }
  .pe-stage-add:hover:not(:disabled) { background: color-mix(in srgb, var(--wa-hue-blue) 86%, #fff); }
  .pe-stage-add:focus-visible { outline: none; box-shadow: var(--wa-ring), 0 4px 18px color-mix(in srgb, var(--wa-hue-blue) 40%, transparent); }
  .pe-stage-add:disabled { opacity: .5; cursor: default; box-shadow: none; }
  .pe-stage-add svg.ui-icon { width: 16px; height: 16px; }

  /* The page's card headings read as a tile's sections do: sentence case,
     13px semibold, no colored badge. They still fold, so they keep the
     chevron. */
  .pe-page-insp .sec-h h4 { font-size: 13px; font-weight: 600; letter-spacing: 0; text-transform: none; }
  .pe-page-insp .sec-h .swatch { display: none; }

  /* No tile selected: the page's own cards, then a quiet line saying how
     to reach a tile (a dashed hairline, muted), then Delete page. */
  .pe-no-tile {
    display: flex; align-items: center; gap: 10px; margin: 12px 0 0; padding: 10px 12px;
    border: 1px dashed var(--wa-line-strong); border-radius: var(--wa-lc-r);
  }
  .pe-no-tile > p { margin: 0; flex: 1; min-width: 0; font-size: 12.5px; line-height: 1.4; color: var(--wa-muted); overflow-wrap: anywhere; }
  .pe-no-tile-ic { display: grid; place-items: center; flex: none; color: var(--wa-muted); }
  .pe-no-tile-ic svg { width: 16px; height: 16px; }
  .pe-add-first { flex: none; }
  .pe-page-acts { display: flex; flex-wrap: wrap; gap: 6px; padding: 10px 0 0; }
  .pe-page-acts > .pe-btn { flex: 1 1 0; min-width: 0; min-height: 30px; font-size: 12.5px; white-space: normal; overflow-wrap: anywhere; }
  .pe-page-acts > .pe-btn.pe-danger { align-self: auto; border-color: color-mix(in srgb, var(--wa-need) 55%, var(--wa-line-strong)); background: transparent; }
  .pe-page-acts > .pe-btn.pe-danger:hover:not(:disabled) { background: color-mix(in srgb, var(--wa-need) 10%, transparent); }

  .pe-stage-top { position: relative; display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; flex: none; min-width: 0; }
  /* The name in place: a plain title at rest, a faint well and a pencil
     under the pointer, the field's own ring while typed in. The hidden copy
     of the words sizes the box, with the pencil's room kept at its end so
     the words beside it do not move when it shows. */
  .pe-name {
    position: relative; display: inline-grid; flex: 0 1 auto; min-width: 72px; max-width: 320px; font-size: 15px; font-weight: 650;
  }
  .pe-name::after {
    content: attr(data-size); grid-area: 1 / 1; visibility: hidden; height: 0; overflow: hidden; white-space: pre;
    padding: 0 21px 0 10px; border-inline: 1px solid transparent; font: inherit;
  }
  .wa-bar.pe-bar .pe-name > input.pe-name-in {
    grid-area: 1 / 1; width: 100%; min-width: 0; height: 32px; min-height: 32px; margin: 0; padding: 0 20px 0 9px;
    border: 1px solid transparent; border-radius: 7px; background: transparent; box-shadow: none;
    color: var(--wa-ink); font: inherit; text-overflow: ellipsis; cursor: text;
  }
  .wa-bar.pe-bar .pe-name:hover > input.pe-name-in:not(:disabled) { background: var(--wa-hover); border-color: transparent; }
  .wa-bar.pe-bar .pe-name > input.pe-name-in:focus,
  .wa-bar.pe-bar .pe-name > input.pe-name-in:focus-visible { outline: none; padding-right: 9px; background: var(--wa-input, var(--wa-card)); border-color: var(--wa-sel-ring); box-shadow: var(--wa-ring); }
  .wa-bar.pe-bar .pe-name > input.pe-name-in:disabled { opacity: 1; cursor: default; }
  .pe-name-pen {
    position: absolute; top: 50%; right: 6px; width: 13px; height: 13px; margin-top: -6.5px; color: var(--wa-muted);
    opacity: 0; pointer-events: none;
  }
  .pe-name:hover > .pe-name-pen { opacity: 1; }
  .pe-name:has(> input:focus) > .pe-name-pen, .pe-name:has(> input:disabled) > .pe-name-pen { opacity: 0; }
  .pe-bar-meta { flex: none; font-size: 12px; color: var(--wa-muted); white-space: nowrap; }
  /* The inspector's Page: Name, on the row the mock draws, over the cards. */
  .pe-page-name { margin: 8px 0 10px; padding: 0 10px; --wa-lab: 96px; }
  /* With Hints off, a plain hint is hidden. A warning, an error, a status, or
     a hint marked keep (an empty list, why a setting is greyed) still shows,
     as the complication editor's "?" does. */
  .insp-body[data-help="off"] .hint:not(.warn):not(.err):not(.keep):not([role="status"]):not(.value-pop .hint) { display: none; }
`;
