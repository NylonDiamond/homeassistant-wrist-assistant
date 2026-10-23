// The New page, New status page and New menu dialog: the New complication
// dialog's shape, for the three things the library holds.
//
// Step 1 is a name. Step 2 asks the one other thing a new item needs before
// its editor can open: for a menu, which kind it is (an Anywhere menu or an
// Entity quick menu); for a page or a status page, which kind of device the
// editor first draws it on, when the home has both. No device is asked for:
// the item is made in the library, no device has it, and the editor's ticks
// put it on one. Enter makes it, Escape closes it. The tabs hold the state
// and call `renderNewItemDialog` from their own render, as the Complications
// tab does with its dialog, so a test reads the dialog in the tab's output.

import { type TemplateResult, css, html, nothing, svg } from "lit";
import { live } from "lit/directives/live.js";
import type { LibraryKind, MenuUnit } from "./client.js";
import { MENU_UNIT_TITLES } from "./model.js";
import { uiIcon } from "../ui-icons.js";
import type { WatchPagesNote } from "../watch-pages/save-note.js";

/** The kind of device a new page's editor first draws it on. */
export type NewPreview = "watch" | "iphone";

/** What the dialog holds while it is open. The tab owns it. */
export interface NewItemForm {
  name: string;
  busy: boolean;
  /** A refusal, or a word about the name, under the steps. */
  note?: WatchPagesNote;
  /** Menus: which kind the menu is. */
  unit?: MenuUnit;
  /** Pages and status pages: the device kind the editor opens on, when the
   * home has both kinds to choose from. */
  preview?: NewPreview;
}

export interface NewItemDialogHandlers {
  onName: (name: string) => void;
  onUnit?: (unit: MenuUnit) => void;
  onPreview?: (preview: NewPreview) => void;
  /** Create, or Enter in the name. */
  onMake: () => void;
  /** Cancel, the close cross, or Escape. */
  onClose: () => void;
}

/** The selector the tab opens the dialog by (`openNewItemDialog`). */
export const NEW_ITEM_DIALOG = "dialog.lib-new";

/** "New page", "New status page" or "New menu". */
export function newItemTitle(kind: LibraryKind): string {
  return kind === "menus" ? "New menu" : kind === "status_pages" ? "New status page" : "New page";
}

/** The noun the dialog's lines use: "page", "status page", "menu". */
export function newItemNoun(kind: LibraryKind): string {
  return kind === "menus" ? "menu" : kind === "status_pages" ? "status page" : "page";
}

/** The line beside the title: what the dialog is about to ask. */
export function newItemHeadNote(kind: LibraryKind, previews: readonly NewPreview[]): string {
  if (kind === "menus") return "Name it, pick its kind.";
  return previews.length > 1 ? "Name it, pick where to preview it." : "Name it.";
}

/** The footer's one line: what is missing, or what Create is about to
 * make. A menu names its kind; a page says no device has it yet. */
export function newItemSummary(kind: LibraryKind, form: NewItemForm): string {
  const name = form.name.trim();
  if (name === "") return "Type a name to start.";
  if (kind === "menus") {
    const unit = form.unit ?? "anywhere";
    return `${name}, an ${MENU_UNIT_TITLES[unit]} on no device yet. Tick a device any time.`;
  }
  return `${name}, a ${newItemNoun(kind)} on no device yet. Tick a device any time.`;
}

/** What a menu of each kind is, under its card. */
export function menuUnitNote(unit: MenuUnit): string {
  return unit === "entity" ? "Opens on an entity. Its actions in a ring." : "Opens on any screen. Your shortcuts for the whole watch.";
}

/** What a preview choice is, under its card. */
export function previewNote(preview: NewPreview): string {
  return preview === "iphone" ? "Drawn on an iPhone's screen first." : "Drawn on a watch face first.";
}

/** A ring of dots, the menu's own picture: eight around for an Anywhere
 * menu, six and a middle for an Entity quick menu. */
function ringArt(unit: MenuUnit): TemplateResult {
  const n = unit === "entity" ? 6 : 8;
  const dots = Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2;
    return svg`<circle cx=${(16 + Math.cos(a) * 10).toFixed(2)} cy=${(16 + Math.sin(a) * 10).toFixed(2)} r="2.4" />`;
  });
  return html`<svg class="lib-new-art" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
    <circle cx="16" cy="16" r="14.5" fill="none" stroke="var(--wa-shape-outline, currentColor)" stroke-width="1" opacity=".45" />
    ${dots}${unit === "entity" ? svg`<circle cx="16" cy="16" r="3" />` : nothing}
  </svg>`;
}

function tick(on: boolean): TemplateResult {
  return on
    ? html`<span class="pick-tick" aria-hidden="true"><svg viewBox="0 0 16 16"><path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" /></svg></span>`
    : html`<span class="pick-tick off" aria-hidden="true"></span>`;
}

function card(on: boolean, title: string, note: string, art: TemplateResult, pick: () => void, disabled: boolean): TemplateResult {
  return html`<button type="button" class="shape-card lib-new-card ${on ? "on" : ""}" role="radio" aria-checked=${on ? "true" : "false"}
    title=${note} ?disabled=${disabled} @click=${pick}>
    <span class="shape-arts">${art}</span>
    <span class="shape-card-name">${title}</span>
    <span class="shape-card-note">${note}</span>
    ${tick(on)}
  </button>`;
}

function stepHead(step: number, title: string, hint: string): TemplateResult {
  return html`<div class="new-step-head">
    <span class="new-step-num" aria-hidden="true">${step}</span>
    <span class="new-step-title">${title}</span>
    <span class="new-step-hint">${hint}</span>
  </div>`;
}

/**
 * The dialog. `previews` lists the device kinds the home has for a page's
 * step 2; with fewer than two there is no choice, and the step is not drawn.
 * Rendered only while the tab holds a form, so closing it is dropping the
 * form; the tab calls `openNewItemDialog` once it is in the tree.
 */
export function renderNewItemDialog(kind: LibraryKind, form: NewItemForm, previews: readonly NewPreview[], h: NewItemDialogHandlers): TemplateResult {
  const named = form.name.trim() !== "";
  const noun = newItemNoun(kind);
  const wait = named ? "" : "waiting";
  const menus = kind === "menus";
  const second = menus || previews.length > 1;
  return html`<dialog class="new-dialog lib-new" aria-label=${newItemTitle(kind)} @close=${() => h.onClose()}
    @cancel=${(e: Event) => { e.preventDefault(); if (!form.busy) h.onClose(); }}>
    <form class="lib-new-form" @submit=${(e: Event) => { e.preventDefault(); if (named && !form.busy) h.onMake(); }}>
      <div class="new-head">
        <h2>${newItemTitle(kind)}</h2>
        <span class="new-head-note">${newItemHeadNote(kind, previews)}</span>
        <span class="spacer"></span>
        <button type="button" class="icon lib-new-x" title="Cancel" aria-label="Cancel" ?disabled=${form.busy} @click=${() => h.onClose()}>${uiIcon("close")}</button>
      </div>
      <div class="new-body">
        <section class="new-step step-name">
          ${stepHead(1, "Name it", menus ? "The name the Menus tab and the editor show." : `The name the ${noun}'s card and the ${kind === "status_pages" ? "watch" : "device"} show.`)}
          <input type="text" class="new-name" .value=${live(form.name)} maxlength="80" autofocus aria-label=${`${newItemTitle(kind)} name`}
            ?disabled=${form.busy} @input=${(e: Event) => h.onName((e.target as HTMLInputElement).value)} />
        </section>
        ${!second ? nothing : menus ? html`<section class="new-step step-shapes ${wait}" aria-disabled=${named ? "false" : "true"}>
          ${stepHead(2, "Which kind", named ? "A device uses one of each. It starts as the app's own menu of that kind." : "Waits for a name.")}
          <div class="shape-cards" role="radiogroup" aria-label="Kind of menu">
            ${(["anywhere", "entity"] as const).map((unit) => card((form.unit ?? "anywhere") === unit, MENU_UNIT_TITLES[unit], menuUnitNote(unit), ringArt(unit),
              () => h.onUnit?.(unit), form.busy))}
          </div>
        </section>` : html`<section class="new-step step-shapes ${wait}" aria-disabled=${named ? "false" : "true"}>
          ${stepHead(2, "Preview on", named ? "Only the picture the editor opens with. Nothing is put on a device; the ticks do that." : "Waits for a name.")}
          <div class="shape-cards" role="radiogroup" aria-label="Preview on">
            ${previews.map((preview) => card((form.preview ?? previews[0]) === preview, preview === "iphone" ? "iPhone" : "Watch", previewNote(preview),
              html`<span class="lib-new-art lib-new-device">${uiIcon(preview === "iphone" ? "phone" : "watch")}</span>`, () => h.onPreview?.(preview), form.busy))}
          </div>
        </section>`}
        ${form.note === undefined ? nothing : html`<p class="lt-line ${form.note.kind}" role="status">${form.note.text}</p>`}
      </div>
      <div class="new-foot">
        <span class="new-count">${newItemSummary(kind, form)}</span>
        <button type="button" class="lib-new-btn" ?disabled=${form.busy} @click=${() => h.onClose()}>Cancel</button>
        <button type="submit" class="lib-new-btn primary" ?disabled=${!named || form.busy} title=${named ? `Make the ${noun}` : "Type a name to start."}>${form.busy ? "Making…" : "Create"}</button>
      </div>
    </form>
  </dialog>`;
}

/** Show the dialog as a modal once it is in the tree, with the name
 * selected so typing replaces it. A render root with no `querySelector` (a
 * test's) has nothing to show. */
export function openNewItemDialog(root: { querySelector?: (s: string) => Element | null } | undefined): void {
  const dialog = root?.querySelector?.(NEW_ITEM_DIALOG) as HTMLDialogElement | null | undefined;
  if (!dialog) return;
  if (!dialog.open && typeof dialog.showModal === "function") dialog.showModal();
  dialog.querySelector<HTMLInputElement>("input.new-name")?.select();
}

/** The dialog's look, the Complications tab's New dialog's, for a tab's
 * shadow root. */
export const newItemDialogStyles = css`
  dialog.lib-new {
    width: min(560px, calc(100vw - 32px)); padding: 0;
    border: 1px solid var(--wa-line); border-radius: 12px;
    background: var(--wa-card); color: var(--wa-ink);
    box-shadow: 0 12px 40px rgba(0,0,0,.4);
  }
  dialog.lib-new::backdrop { background: rgba(0,0,0,.45); }
  dialog.lib-new[open] { display: flex; flex-direction: column; max-height: calc(100dvh - 32px); }
  .lib-new-form { display: flex; flex-direction: column; min-height: 0; }
  .lib-new .new-head { display: flex; align-items: center; gap: 8px; padding: 12px 12px 12px 18px; border-bottom: 1px solid var(--wa-line); flex: none; }
  .lib-new .new-head h2 { margin: 0; font-size: 15px; font-weight: 500; }
  .lib-new .new-head .spacer { flex: 1; }
  .lib-new .new-head-note { font-size: 11.5px; color: var(--wa-muted); }
  .lib-new-x {
    display: inline-flex; align-items: center; justify-content: center; width: 28px; height: 28px; border-radius: 7px;
    border: 1px solid transparent; background: transparent; color: var(--wa-muted); cursor: pointer;
  }
  .lib-new-x:hover:not(:disabled) { background: var(--wa-hover); color: var(--wa-ink); }
  .lib-new-x:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .lib-new-x svg { width: 14px; height: 14px; }
  .lib-new .new-body { padding: 14px 18px; display: flex; flex-direction: column; gap: 10px; flex: 1 1 auto; min-height: 0; overflow-y: auto; }
  .lib-new .new-step {
    display: flex; flex-direction: column; gap: 9px; padding: 12px 14px;
    border-radius: var(--wa-r-md, 10px); border: 1px solid var(--wa-line);
    transition: opacity .14s ease-out;
  }
  .lib-new .new-step.step-name {
    background: color-mix(in srgb, var(--wa-accent) 12%, var(--wa-card));
    border-color: color-mix(in srgb, var(--wa-accent) 32%, var(--wa-line));
  }
  .lib-new .new-step.step-shapes {
    background: color-mix(in srgb, var(--success-color, #3dd68c) 12%, var(--wa-card));
    border-color: color-mix(in srgb, var(--success-color, #3dd68c) 32%, var(--wa-line));
  }
  .lib-new .new-step.waiting { opacity: .45; pointer-events: none; }
  .lib-new .new-step-head { display: flex; align-items: baseline; gap: 9px; flex-wrap: wrap; }
  .lib-new .new-step-num {
    flex: none; width: 21px; height: 21px; align-self: center; border-radius: 50%;
    display: inline-flex; align-items: center; justify-content: center;
    font-size: 11.5px; font-weight: 700; color: var(--wa-accent-ink); background: var(--wa-accent);
  }
  .lib-new .step-shapes .new-step-num { background: var(--success-color, #3dd68c); }
  .lib-new .new-step-title { font-size: 13px; font-weight: 700; color: var(--wa-ink); }
  .lib-new .new-step-hint { font-size: 11.5px; line-height: 1.35; color: var(--wa-muted); }
  .lib-new input.new-name {
    width: 100%; box-sizing: border-box; height: 32px; padding: 0 10px; border-radius: 7px; border: 1px solid var(--wa-line-strong);
    font: inherit; font-size: 14px; color: var(--wa-ink); background: var(--wa-input, var(--wa-field));
  }
  .lib-new input.new-name:focus-visible { outline: none; border-color: var(--wa-accent); box-shadow: var(--wa-ring); }
  .lib-new .shape-cards { display: flex; flex-wrap: wrap; gap: 8px; }
  .lib-new .shape-card {
    position: relative; display: flex; flex-direction: column; align-items: center; gap: 4px; cursor: pointer;
    width: 150px; box-sizing: border-box; text-align: center;
    font: inherit; font-size: 11.5px; padding: 22px 8px 8px; color: var(--wa-muted);
    border: 1px solid var(--wa-line); border-radius: 10px; background: var(--wa-raised, var(--wa-card));
    transition: border-color .12s ease-out, background-color .12s ease-out, color .12s ease-out;
  }
  .lib-new .shape-card:hover:not(:disabled) { border-color: var(--wa-line-strong); color: var(--wa-ink); }
  .lib-new .shape-card:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .lib-new .shape-card.on { border-color: var(--wa-accent); background: var(--wa-sel-bg); box-shadow: 0 0 0 2px var(--wa-sel-ring); color: var(--wa-ink); }
  .lib-new .shape-card:disabled { cursor: default; }
  .lib-new .shape-arts { height: 40px; display: flex; align-items: center; justify-content: center; --wa-shape-outline: var(--wa-muted); }
  .lib-new .shape-card.on .shape-arts { color: var(--wa-accent); }
  .lib-new .lib-new-art { width: 36px; height: 36px; display: block; }
  .lib-new .lib-new-device svg { width: 30px; height: 30px; }
  .lib-new .shape-card-name { font-weight: 600; font-size: 12px; }
  .lib-new .shape-card-note { font-size: 10.5px; font-weight: 500; line-height: 1.3; opacity: .85; }
  .lib-new .pick-tick {
    position: absolute; top: 4px; right: 4px; width: 15px; height: 15px; box-sizing: border-box;
    display: flex; align-items: center; justify-content: center; border-radius: 50%;
    background: var(--wa-accent); color: var(--wa-accent-ink);
  }
  .lib-new .pick-tick svg { width: 10px; height: 10px; }
  .lib-new .pick-tick.off { background: transparent; border: 1px solid var(--wa-line-strong); }
  .lib-new .new-foot { display: flex; align-items: center; justify-content: flex-end; gap: 8px; padding: 12px 18px 14px; border-top: 1px solid var(--wa-line); flex: none; }
  .lib-new .new-count { flex: 1; font-size: 12.5px; color: var(--wa-muted); }
  .lib-new-btn {
    display: inline-flex; align-items: center; gap: 5px; height: 28px; padding: 0 10px; border-radius: 7px;
    border: 1px solid var(--wa-line-strong); background: var(--wa-panel, var(--wa-card)); color: var(--wa-ink);
    font: inherit; font-size: 12.5px; font-weight: 600; cursor: pointer;
  }
  .lib-new-btn:hover:not(:disabled) { background: var(--wa-hover); }
  .lib-new-btn:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .lib-new-btn:disabled { opacity: .45; cursor: default; }
  .lib-new-btn.primary { background: var(--wa-primary-bg); color: var(--wa-primary-ink); border-color: transparent; }
  @media (max-width: 640px) {
    .lib-new .new-head { flex-wrap: wrap; row-gap: 2px; padding: 10px 10px 10px 14px; }
    .lib-new .new-head-note { order: 3; flex: 1 1 100%; }
    .lib-new .new-head .spacer { display: none; }
    .lib-new .new-body { padding: 12px; }
  }
`;
