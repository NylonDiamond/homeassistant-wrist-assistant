// Make a copy: the one way to make a page really different on some devices.
// The dialog asks "For which devices?" with the devices that show the page,
// the watches then the iPhones, and a name for the copy that follows the
// ticks ("Lights (iPhone)") until it is typed over. Those devices then use
// the copy, and the original stays on every other device under its own id
// (`library/fork_page`). After it the dialog lists what Home Assistant
// pointed at the copy on those devices (menu slots, page links,
// complications), and what stayed on the original.
//
// The Pages tab opens it from a row's "..." and a card's copy button; the
// page editor from its ··· menu and from a right click on a device chip,
// with that device ticked. Each host holds the form and draws the dialog
// from its own render, as the New dialog is drawn.
// Spec: integration repo docs/ux-review-2026-10-31/pages-design-v4.md,
// "The one escape hatch".

import { type TemplateResult, css, html, nothing } from "lit";
import { live } from "lit/directives/live.js";
import type { LibraryForkReply } from "../library/client.js";
import { sameId } from "../library/model.js";
import type { LibraryStore } from "../library/store.js";
import { uiIcon } from "../ui-icons.js";
import { type LinkDevice, joinWords } from "./devices.js";
import type { WatchPagesNote } from "./save-note.js";

/** The sentence every copy dialog says. */
export const COPY_WARNING_TEXT = "These become two pages. A change to one never reaches the other.";

/** Why Make a copy is greyed for a page on one device or none. */
export const COPY_NEEDS_TWO_TEXT = "Make a copy needs the page on two devices or more: one keeps it, the others get the copy.";

/** What a copy dialog holds while it is open. */
export interface CopyForm {
  /** The page copied, and its name. */
  itemId: string;
  name: string;
  /** The copy's name. */
  copyName: string;
  /** Typed by hand: the ticks no longer rename it. */
  named: boolean;
  /** The devices ticked for the copy. */
  owners: readonly string[];
  busy: boolean;
  note?: WatchPagesNote;
  /** Made: the copy, and what the devices open now. */
  done?: CopyDone;
}

export interface CopyDone {
  itemId: string;
  name: string;
  /** The devices that use the copy, by name. */
  devices: string[];
  /** "Jesse's iPhone: menu slot Up in Anywhere menu". */
  rewritten: string[];
  /** What stayed on the original, in the same words. */
  kept: string[];
}

/** The selector a host opens the dialog by (`openCopyDialog`). */
export const COPY_DIALOG = "dialog.lib-copy";

/** The devices a copy can be for: the ones that show the page, the watches
 * first, each kind in device order. */
export function copyDevices(owners: readonly string[], devices: readonly LinkDevice[]): LinkDevice[] {
  const on = devices.filter((d) => owners.some((o) => sameId(o, d.ownerId)));
  return [...on.filter((d) => d.kind === "watch"), ...on.filter((d) => d.kind === "iphone")];
}

/** The copy's name for the devices ticked: "Lights (iPhone)" when they are
 * all iPhones, "Lights (Watch)" when all watches, "Lights (copy)" else. */
export function copyNameFor(name: string, ticked: readonly LinkDevice[]): string {
  const kinds = new Set(ticked.map((d) => d.kind));
  const tag = kinds.size !== 1 ? "copy" : kinds.has("iphone") ? "iPhone" : "Watch";
  return `${name} (${tag})`;
}

/** A new form, with `ticked` ticked (a device chip's device, or none). */
export function newCopyForm(itemId: string, name: string, holders: readonly LinkDevice[], ticked: readonly string[] = []): CopyForm {
  const owners = holders.filter((d) => ticked.some((t) => sameId(t, d.ownerId))).map((d) => d.ownerId);
  return { itemId, name, owners, named: false, busy: false, copyName: copyNameFor(name, holders.filter((d) => owners.includes(d.ownerId))) };
}

/** The form after a tick: the copy renamed for the ticks unless typed. */
export function tickCopyForm(form: CopyForm, holders: readonly LinkDevice[], ownerId: string, on: boolean): CopyForm {
  const owners = on
    ? holders.filter((d) => sameId(d.ownerId, ownerId) || form.owners.some((o) => sameId(o, d.ownerId))).map((d) => d.ownerId)
    : form.owners.filter((o) => !sameId(o, ownerId));
  const { note: _note, ...rest } = form;
  const copyName = form.named ? form.copyName : copyNameFor(form.name, holders.filter((d) => owners.includes(d.ownerId)));
  return { ...rest, owners, copyName };
}

/** Why Make a copy cannot run now, or undefined. */
export function copyRefusal(form: CopyForm, holders: readonly LinkDevice[]): string | undefined {
  if (form.owners.length === 0) return "Tick the devices that get the copy.";
  if (holders.length > 0 && holders.every((d) => form.owners.some((o) => sameId(o, d.ownerId)))) {
    return `Leave ${form.name} on at least one device. To change it everywhere, just edit it.`;
  }
  if (form.copyName.trim() === "") return "Give the copy a name.";
  return undefined;
}

/** The reply's lines in the dialog's words, each after its device's name. */
export function copyLines(lines: readonly { owner_id: string; what: string }[] | undefined, devices: readonly LinkDevice[]): string[] {
  return (lines ?? []).map((l) => {
    const name = devices.find((d) => sameId(d.ownerId, l.owner_id))?.name;
    return name === undefined ? l.what : `${name}: ${l.what}`;
  });
}

/** What the done view says first: "Lights (iPhone) is on Jesse's iPhone
 * now. Lights stays on the other devices." */
export function copyDoneText(done: CopyDone, original: string): string {
  return `${done.name} is on ${joinWords(done.devices)} now. ${original} stays on the other devices.`;
}

/** Run the copy, and say how it went: the form done, or with its refusal. */
export async function runCopy(store: LibraryStore, form: CopyForm, holders: readonly LinkDevice[], devices: readonly LinkDevice[]): Promise<CopyForm> {
  const refusal = copyRefusal(form, holders);
  if (refusal !== undefined) return { ...form, note: { kind: "warn", text: refusal } };
  const name = form.copyName.trim();
  const made = await store.forkPage(form.itemId, form.owners, name);
  if (!made.ok) return { ...form, busy: false, note: { kind: "err", text: `Not copied. ${made.text}` } };
  const reply: LibraryForkReply = made.reply;
  const { note: _note, ...rest } = form;
  return {
    ...rest,
    busy: false,
    done: {
      itemId: reply.item_id,
      name,
      devices: holders.filter((d) => form.owners.some((o) => sameId(o, d.ownerId))).map((d) => d.name),
      rewritten: copyLines(reply.rewritten, devices),
      kept: copyLines(reply.kept, devices),
    },
  };
}

export interface CopyDialogHandlers {
  onTick: (ownerId: string, on: boolean) => void;
  onName: (name: string) => void;
  onMake: () => void;
  /** Open the copy in the editor, after it is made. */
  onOpen?: (itemId: string) => void;
  /** Cancel, Done, the close cross, or Escape. */
  onClose: () => void;
}

function deviceTicks(form: CopyForm, holders: readonly LinkDevice[], h: CopyDialogHandlers): TemplateResult {
  const group = (kind: LinkDevice["kind"], title: string) => {
    const list = holders.filter((d) => d.kind === kind);
    if (list.length === 0) return nothing;
    return html`<div class="lib-copy-group" role="group" aria-label=${title}>
      <span class="lib-copy-kind">${uiIcon(kind === "iphone" ? "phone" : "watch")}<span>${title}</span></span>
      ${list.map((d) => {
        const on = form.owners.some((o) => sameId(o, d.ownerId));
        return html`<label class="lib-copy-dev">
          <input type="checkbox" .checked=${live(on)} ?disabled=${form.busy}
            @change=${(e: Event) => h.onTick(d.ownerId, (e.target as HTMLInputElement).checked)} />
          <span>${d.name}</span>
        </label>`;
      })}
    </div>`;
  };
  return html`${group("watch", "Watches")}${group("iphone", "iPhones")}`;
}

/** The dialog: the devices, the copy's name and the warning, or once made
 * what now opens the copy. The host calls `openCopyDialog` once it is in
 * the tree. */
export function renderCopyDialog(form: CopyForm, holders: readonly LinkDevice[], h: CopyDialogHandlers): TemplateResult {
  const done = form.done;
  const refusal = copyRefusal(form, holders);
  return html`<dialog class="new-dialog lib-new lib-copy" aria-label="Make a copy" @close=${() => h.onClose()}
    @cancel=${(e: Event) => { e.preventDefault(); if (!form.busy) h.onClose(); }}>
    <form class="lib-new-form" @submit=${(e: Event) => { e.preventDefault(); if (done === undefined && refusal === undefined && !form.busy) h.onMake(); }}>
      <div class="new-head">
        <h2>Make a copy of ${form.name}</h2>
        <span class="spacer"></span>
        <button type="button" class="icon lib-new-x" title="Close" aria-label="Close" ?disabled=${form.busy} @click=${() => h.onClose()}>${uiIcon("close")}</button>
      </div>
      ${done === undefined ? html`<div class="new-body">
        <section class="new-step step-name">
          <div class="new-step-head"><span class="new-step-title">For which devices?</span>
            <span class="new-step-hint">They get the copy. The others keep ${form.name}.</span></div>
          ${deviceTicks(form, holders, h)}
        </section>
        <section class="new-step step-copy-name">
          <div class="new-step-head"><span class="new-step-title">Name of the copy</span></div>
          <input type="text" class="new-name" .value=${live(form.copyName)} maxlength="80" aria-label="Name of the copy"
            ?disabled=${form.busy} @input=${(e: Event) => h.onName((e.target as HTMLInputElement).value)} />
        </section>
        <p class="lib-copy-warn">${COPY_WARNING_TEXT} Anything on those devices that opened ${form.name} (menu slots, complications, page links) opens the copy.</p>
        ${form.note === undefined ? nothing : html`<p class="lt-line ${form.note.kind}" role="status">${form.note.text}</p>`}
      </div>
      <div class="new-foot">
        <span class="new-count">${refusal ?? `${form.copyName.trim()}, for ${form.owners.length === 1 ? "1 device" : `${form.owners.length} devices`}.`}</span>
        <button type="button" class="lib-new-btn" ?disabled=${form.busy} @click=${() => h.onClose()}>Cancel</button>
        <button type="submit" class="lib-new-btn primary lib-copy-make" ?disabled=${refusal !== undefined || form.busy}
          title=${refusal ?? "Make the copy"}>${form.busy ? "Copying…" : "Make a copy"}</button>
      </div>` : html`<div class="new-body lib-copy-done" role="status">
        <p class="lib-copy-said">${copyDoneText(done, form.name)}</p>
        ${done.rewritten.length === 0
          ? html`<p class="lib-copy-none">Nothing on those devices opened ${form.name}, so nothing else changed.</p>`
          : html`<p class="lib-copy-lead">Now open the copy:</p><ul class="lib-copy-list">${done.rewritten.map((l) => html`<li>${l}</li>`)}</ul>`}
        ${done.kept.length === 0 ? nothing : html`<p class="lib-copy-lead">Still open ${form.name}, because another device shares the page they sit on:</p>
          <ul class="lib-copy-list">${done.kept.map((l) => html`<li>${l}</li>`)}</ul>`}
      </div>
      <div class="new-foot">
        <span class="new-count"></span>
        ${h.onOpen === undefined ? nothing : html`<button type="button" class="lib-new-btn lib-copy-open" @click=${() => h.onOpen?.(done.itemId)}>Open the copy</button>`}
        <button type="button" class="lib-new-btn primary lib-copy-done-btn" @click=${() => h.onClose()}>Done</button>
      </div>`}
    </form>
  </dialog>`;
}

/** The dialog's own look, on top of the New dialog's (`newItemDialogStyles`),
 * which every host draws it with. */
export const copyDialogStyles = css`
  .lib-copy .new-step.step-copy-name { background: none; }
  .lib-copy-group { display: flex; flex-direction: column; gap: 4px; }
  .lib-copy-kind { display: inline-flex; align-items: center; gap: 6px; font-size: 11.5px; font-weight: 600; color: var(--wa-muted); }
  .lib-copy-kind svg { width: 13px; height: 13px; }
  .lib-copy-dev { display: flex; align-items: center; gap: 8px; font-size: 13px; padding: 2px 0 2px 2px; cursor: pointer; }
  .lib-copy-dev input { margin: 0; accent-color: var(--wa-accent); }
  .lib-copy-warn { margin: 0; font-size: 12.5px; line-height: 1.45; color: var(--wa-ink); }
  .lib-copy-done p { margin: 0; font-size: 13px; line-height: 1.45; }
  .lib-copy-lead { color: var(--wa-muted); }
  .lib-copy-none { color: var(--wa-muted); }
  .lib-copy-list { margin: 0; padding-left: 18px; font-size: 12.5px; line-height: 1.5; }
`;

/** Show the dialog as a modal once it is in the tree. A render root with no
 * `querySelector` (a test's) has nothing to show. */
export function openCopyDialog(root: { querySelector?: (s: string) => Element | null } | undefined): void {
  const dialog = root?.querySelector?.(COPY_DIALOG) as HTMLDialogElement | null | undefined;
  if (!dialog) return;
  if (!dialog.open && typeof dialog.showModal === "function") dialog.showModal();
}
