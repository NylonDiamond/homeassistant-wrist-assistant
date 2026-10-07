// The bar pinned to the foot of the page and menu editors, after the
// complication editor's footer (`panel.ts`, `renderFooter`): on the left a dot
// and one line about the copy Home Assistant holds (its revision, who saved
// it and when, whether a device has collected it, its size against what the
// watch takes), on the right "History" and "Raw configuration".
//
// History is the earlier saves list that used to be a card of its own, in a
// dialog, with the same Restore: a row's Restore hands the entry back to the
// editor, which asks its own restore question. Raw configuration shows the
// open document as JSON, read only with a Copy button, as the complication
// editor's raw view is read only.
//
// The toolbar's "Saved 3 min ago" is here too, read from the same stored
// copy, with the small timer that keeps it true (`SavedAgoTicker`).
//
// Pure functions of their input, so a test can flatten what they draw. Both
// editors put `configFootStyles` in their sheets and open the dialogs with
// `openConfigDialogs` from `updated()`.

import { type ReactiveController, type ReactiveControllerHost, css, html, nothing, type TemplateResult } from "lit";

import type { WatchConfigHistoryEntry, WatchConfigRecord } from "../ha-api.js";
import { agoWords } from "../send-state.js";
import { uiIcon } from "../ui-icons.js";
import { COLLECTED_PILL_TEXT, WAITING_HELP_TEXT, WAITING_PILL_TEXT, deliveryState, rejectedNow, savedByWords } from "../watch-settings.js";

export type ConfigHistoryState = "loading" | "ready" | "error" | "unsupported";

/** What the editor keeps: its pages, its menus, the voice settings, its
 * status pages, its Control Center list, or the watch settings (Rooms,
 * whose keys are part of the `behavior` record), or the rooms of a home that
 * is not the watch's main house (their own `rooms` record). */
export type ConfigNoun = "pages" | "menus" | "voice settings" | "status pages" | "Control Center list" | "watch settings" | "rooms";

/** The pronoun for a noun: "it" for the one list, "them" for the rest. */
function them(noun: ConfigNoun): string {
  return noun === "Control Center list" ? "it" : "them";
}

export const REJECTED_TEXT = "The watch could not read this save";

function kb(bytes: number): string {
  return bytes < 1000 ? `${bytes} bytes` : `${Number((bytes / 1000).toFixed(1))} KB`;
}

function ago(iso: string | null | undefined, now: number): string {
  const at = iso ? Date.parse(iso) : NaN;
  return Number.isNaN(at) ? "" : agoWords(Math.max(0, (now - at) / 1000));
}

/** Who made a save, capitalised for the start of a line. */
function savedBy(updatedBy: string | null | undefined): string {
  const words = savedByWords(updatedBy);
  return words.charAt(0).toUpperCase() + words.slice(1);
}

export interface ConfigFootStatus {
  /** The dot: green once collected, amber while it waits, red when a
   * device could not read it. */
  tone: "ok" | "warn" | "err";
  /** "Revision 12 · saved here 3 minutes ago". */
  revision: string;
  /** Collected, waiting, or could not be read. */
  state: string;
  /** What to do about the state, or what it means. */
  help: string;
  /** The size against what the watch takes. */
  size: string;
  /** The size is past four fifths of the limit. */
  near: boolean;
}

/** What the bar says about the stored copy. Every fact the old "Stored copy"
 * card showed is here: the revision, who saved it and when, the delivery
 * state with its help line, and the size. */
export function configFootStatus(i: {
  record: WatchConfigRecord;
  size: number;
  limit: number;
  noun: ConfigNoun;
  historyState: ConfigHistoryState;
  now?: number;
}): ConfigFootStatus {
  const { record } = i;
  const when = ago(record.updated_at, i.now ?? Date.now());
  const revision = `Revision ${record.revision} · ${savedByWords(record.updated_by)}${when ? ` ${when}` : ""}`;
  const near = i.limit > 0 && i.size / i.limit > 0.8;
  const size = `${kb(i.size)} of the ${kb(i.limit)} the watch takes${near ? ". Close to the limit." : ""}`;
  if (rejectedNow(record)) {
    return {
      tone: "err", revision, state: REJECTED_TEXT, size, near,
      help: i.historyState === "unsupported" ? `Change the ${i.noun} and save ${them(i.noun)} again.` : "Restore an earlier save from History.",
    };
  }
  if (deliveryState(record) === "delivered") {
    return { tone: "ok", revision, state: COLLECTED_PILL_TEXT, help: `Revision ${record.revision} has been collected.`, size, near };
  }
  return { tone: "warn", revision, state: WAITING_PILL_TEXT, help: WAITING_HELP_TEXT, size, near };
}

/** The toolbar's quiet fact about the stored copy, left of Discard: "Saved
 * 3 min ago", "Saved just now". It reads the same `updated_at` as the foot
 * bar's line, so the two always agree. Empty when there is no stored copy;
 * plain "Saved" for a time that will not parse. A plain save that went
 * through says nothing else: this is how it shows. */
export function configSavedText(record: WatchConfigRecord | undefined, now: number = Date.now()): string {
  if (record === undefined || record.revision <= 0) return "";
  const when = ago(record.updated_at, now);
  return when ? `Saved ${when}` : "Saved";
}

/** The fact as a muted span, the whole stamp in its title. */
export function renderConfigSaved(record: WatchConfigRecord | undefined, now: number = Date.now()): TemplateResult | typeof nothing {
  const text = configSavedText(record, now);
  if (record === undefined || text === "") return nothing;
  const at = record.updated_at ? Date.parse(record.updated_at) : NaN;
  const stamp = Number.isNaN(at) ? "" : `, ${new Date(at).toLocaleString()}`;
  return html`<span class="cf-saved" title=${`Revision ${record.revision}, ${savedByWords(record.updated_by)}${stamp}`}>${text}</span>`;
}

/** How often a shown "Saved 3 min ago" is drawn again: twice a minute, so
 * it is never a minute behind. */
export const SAVED_TICK_MS = 30_000;

/**
 * Draws its host again every `SAVED_TICK_MS` while the saved fact is shown,
 * so "Saved just now" turns into "Saved 1 min ago" without an edit. The host
 * says whether the fact is shown after each draw (`show`); the timer stops
 * when it is not, and while the host is out of the tree.
 */
export class SavedAgoTicker implements ReactiveController {
  private wanted = false;
  private connected = false;
  private timer?: ReturnType<typeof setInterval>;

  constructor(private readonly host: ReactiveControllerHost) {
    host.addController(this);
  }

  show(on: boolean): void {
    this.wanted = on;
    this.sync();
  }

  /** The timer runs now. For tests. */
  get running(): boolean {
    return this.timer !== undefined;
  }

  hostConnected(): void {
    this.connected = true;
    this.sync();
  }

  hostDisconnected(): void {
    this.connected = false;
    this.sync();
  }

  private sync(): void {
    const run = this.wanted && this.connected;
    if (run && this.timer === undefined) this.timer = setInterval(() => this.host.requestUpdate(), SAVED_TICK_MS);
    else if (!run && this.timer !== undefined) {
      clearInterval(this.timer);
      this.timer = undefined;
    }
  }
}

export interface ConfigFootInput {
  status: ConfigFootStatus;
  historyState: ConfigHistoryState;
  historyOpen: boolean;
  rawOpen: boolean;
  onHistory: () => void;
  onRaw: () => void;
}

/** The bar itself: the dot and the stored copy's line on the left, History
 * and Raw configuration on the right. A device that could not read the save
 * lights History, where the earlier save to go back to is offered. */
export function renderConfigFoot(i: ConfigFootInput): TemplateResult {
  const s = i.status;
  const whole = `${s.revision}. ${s.state}. ${s.help} ${s.size}`;
  return html`<footer class="cf-bar" aria-label="Stored copy">
    <span class="cf-dot ${s.tone}" aria-hidden="true"></span>
    <span class="cf-text" title=${whole}>
      <span class="cf-rev">${s.revision}</span>
      <span class="cf-sep" aria-hidden="true">·</span>
      <span class="cf-state ${s.tone}">${s.state}</span>
      ${s.tone === "err" ? html`<span class="cf-help">${s.help}</span>` : nothing}
    </span>
    <span class="cf-size ${s.near ? "near" : ""}" title=${s.size}>${s.size}</span>
    ${i.historyState === "unsupported" ? nothing : html`<button type="button" class="cf-btn cf-history-btn ${s.tone === "err" ? "lit" : ""}"
      aria-haspopup="dialog" aria-expanded=${i.historyOpen ? "true" : "false"}
      title="Earlier saves, with Restore" @click=${i.onHistory}>History</button>`}
    <button type="button" class="cf-btn cf-raw-btn" aria-haspopup="dialog" aria-expanded=${i.rawOpen ? "true" : "false"}
      title="The document as JSON" @click=${i.onRaw}>Raw configuration</button>
  </footer>`;
}

export interface ConfigHistoryInput {
  noun: ConfigNoun;
  record: WatchConfigRecord;
  entries: readonly WatchConfigHistoryEntry[];
  historyState: ConfigHistoryState;
  dirty: boolean;
  restoring: boolean;
  onRetry: () => void;
  onRestore: (entry: WatchConfigHistoryEntry) => void;
  /** The dialog shut, however it was shut. */
  onClosed: () => void;
  now?: number;
}

/** The earlier saves, newest first, in a dialog: the list the "Earlier
 * saves" card held, row for row. The newest save older than one a device
 * could not read is the one offered first. */
export function renderConfigHistoryDialog(i: ConfigHistoryInput): TemplateResult {
  const { record, entries, dirty } = i;
  const now = i.now ?? Date.now();
  const rejected = rejectedNow(record);
  let body: TemplateResult;
  if (i.historyState === "loading") body = html`<p class="pe-muted">Loading…</p>`;
  else if (i.historyState === "error") {
    body = html`<p class="pe-muted">Could not load the earlier saves.</p>
      <button type="button" class="pe-btn" @click=${i.onRetry}>Try again</button>`;
  } else if (entries.length === 0) body = html`<p class="pe-muted">No earlier saves yet.</p>`;
  else {
    const offer = rejected ? entries.find((e) => e.revision < record.revision)?.revision : undefined;
    body = html`${dirty ? html`<p class="pe-muted">Save or discard your edits first.</p>` : nothing}
      <ul class="pe-history cf-rows">
      ${entries.map((entry) => {
        const current = entry.revision === record.revision;
        const when = ago(entry.updated_at, now);
        return html`<li class=${entry.revision === offer ? "offer" : ""}>
          <span class="pe-h-text">
            <b>Revision ${entry.revision}</b>
            <span class="pe-muted">${savedBy(entry.updated_by)}${when ? ` ${when}` : ""} · ${kb(entry.size)}</span>
          </span>
          ${current
            ? html`<span class="pe-badge">Current</span>`
            : html`<button type="button" class="pe-btn ${entry.revision === offer ? "pe-primary" : ""}" ?disabled=${i.restoring || dirty}
                title=${dirty ? "Save or discard your edits first." : `Put revision ${entry.revision} back as a new revision`}
                @click=${() => i.onRestore(entry)}>Restore</button>`}
        </li>`;
      })}
    </ul>`;
  }
  return html`<dialog class="cf-dialog cf-history" aria-labelledby="cf-history-title" @close=${i.onClosed}>
    <div class="cf-dialog-head">
      <div class="cf-dialog-title">
        <h3 id="cf-history-title">History of the ${i.noun}</h3>
        <span class="pe-muted">Revision ${record.revision} is the stored copy</span>
      </div>
      <button type="button" class="cf-close" title="Close" aria-label="Close" @click=${closeOwnDialog}>${uiIcon("close")}</button>
    </div>
    ${rejected ? html`<p class="pe-warn" role="note">${REJECTED_TEXT}. Restore the save before it.</p>` : nothing}
    <div class="cf-dialog-body">${body}</div>
    <p class="pe-muted">Restoring saves the earlier copy again as a new revision. The copy stored now stays in this list.</p>
    <div class="pe-ask-foot">
      <button type="button" class="pe-btn" @click=${closeOwnDialog}>Close</button>
    </div>
  </dialog>`;
}

export interface ConfigRawInput {
  noun: ConfigNoun;
  /** The open document, edits and all: what Save would write. */
  document: unknown;
  revision: number;
  dirty: boolean;
  copied: boolean;
  onCopy: (text: string) => void;
  onClosed: () => void;
}

/** The document as JSON. */
export function configRawText(document: unknown): string {
  return JSON.stringify(document, null, 2) ?? "";
}

/** Raw configuration: the open document as JSON, read only, with Copy. */
export function renderConfigRawDialog(i: ConfigRawInput): TemplateResult {
  const text = configRawText(i.document);
  return html`<dialog class="cf-dialog cf-raw" aria-labelledby="cf-raw-title" @close=${i.onClosed}>
    <div class="cf-dialog-head">
      <div class="cf-dialog-title">
        <h3 id="cf-raw-title">Raw configuration</h3>
        <span class="pe-muted">${i.dirty
          ? `The ${i.noun} as ${them(i.noun) === "it" ? "it" : "they"} would be saved, with your unsaved edits, over revision ${i.revision}`
          : `The ${i.noun} as Home Assistant holds ${them(i.noun)}, revision ${i.revision}`}</span>
      </div>
      <button type="button" class="cf-close" title="Close" aria-label="Close" @click=${closeOwnDialog}>${uiIcon("close")}</button>
    </div>
    <pre class="cf-json" tabindex="0" aria-label="JSON">${text}</pre>
    <div class="pe-ask-foot">
      <span class="pe-muted cf-copied" aria-live="polite">${i.copied ? "Copied" : ""}</span>
      <button type="button" class="pe-btn" @click=${() => i.onCopy(text)}>Copy</button>
      <button type="button" class="pe-btn pe-primary" @click=${closeOwnDialog}>Close</button>
    </div>
  </dialog>`;
}

function closeOwnDialog(e: Event): void {
  (e.currentTarget as Element | null)?.closest("dialog")?.close();
}

/** Open each of these dialogs once, when first drawn. Opening any closed one
 * on every draw would reopen one just shut, in the draw before its close
 * event. */
export function openConfigDialogs(root: ParentNode, shown: WeakSet<HTMLDialogElement>): void {
  for (const dialog of root.querySelectorAll<HTMLDialogElement>("dialog.cf-dialog")) {
    if (shown.has(dialog)) continue;
    shown.add(dialog);
    if (!dialog.open) dialog.showModal();
  }
}

/** Put text on the clipboard; false when the browser will not. */
export async function copyConfigText(text: string): Promise<boolean> {
  try {
    if (typeof navigator === "undefined" || navigator.clipboard === undefined) return false;
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/** The bar and its dialogs. The host is a flex column scroll box whose
 * padding is `--cf-pad`: the bar takes the space left at the foot of a short
 * editor and sticks to the bottom edge of a long one, edge to edge. */
export const configFootStyles = css`
  .cf-bar {
    flex: none; position: sticky; bottom: calc(-1 * var(--cf-pad, 16px)); z-index: 6;
    display: flex; align-items: center; gap: 8px; min-height: 36px;
    margin: auto calc(-1 * var(--cf-pad, 16px)) calc(-1 * var(--cf-pad, 16px));
    padding: 0 calc(var(--cf-pad, 16px) - 8px) 0 var(--cf-pad, 16px);
    background: var(--wa-top, var(--wa-card)); border-top: 1px solid var(--wa-line);
    font-size: 12px; color: var(--wa-muted);
  }
  .cf-dot { width: 7px; height: 7px; border-radius: 50%; flex: none; background: var(--wa-muted); }
  .cf-dot.ok { background: var(--success-color, var(--wa-green, #3dd68c)); }
  .cf-dot.warn { background: var(--warning-color, var(--wa-amber, #ffa600)); }
  .cf-dot.err { background: var(--error-color, var(--wa-need, #db4437)); }
  .cf-text { flex: 1 1 auto; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .cf-sep { margin: 0 4px; }
  .cf-state.warn { color: var(--warning-color, var(--wa-amber, #ffa600)); }
  .cf-state.err { color: var(--error-color, var(--wa-need, #db4437)); font-weight: 600; }
  .cf-help { margin-left: 6px; }
  .cf-size { flex: 0 1 auto; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .cf-size.near { color: var(--warning-color, var(--wa-amber, #ffa600)); font-weight: 600; }
  .cf-btn {
    flex: none; font: inherit; font-size: 12px; font-weight: 400; color: var(--wa-soft, var(--wa-muted)); cursor: pointer;
    background: transparent; border: 0; padding: 0 8px; min-height: 24px; border-radius: 6px;
  }
  .cf-btn:hover, .cf-btn[aria-expanded="true"] { background: var(--wa-panel); color: var(--wa-ink); }
  .cf-btn:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .cf-btn.lit { color: var(--wa-ink); font-weight: 600; }
  @container (max-width: 560px) {
    .cf-size { display: none; }
  }
  /* The toolbar's "Saved 3 min ago", left of Discard. */
  .cf-saved { margin-right: 4px; color: var(--wa-muted); font-size: 13px; white-space: nowrap; }

  dialog.cf-dialog {
    width: min(560px, calc(100vw - 32px)); max-height: min(80vh, 720px); padding: 20px;
    border: 1px solid var(--wa-line); border-radius: var(--wa-r-lg, 16px);
    background: var(--wa-card); color: var(--wa-ink); box-shadow: var(--wa-shadow-pop);
  }
  dialog.cf-dialog[open] { display: flex; flex-direction: column; gap: 10px; }
  dialog.cf-dialog::backdrop { background: rgba(0, 0, 0, .45); }
  dialog.cf-dialog h3 { font-size: 17px; text-transform: none; letter-spacing: 0; color: var(--wa-ink); overflow-wrap: anywhere; }
  .cf-dialog-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; }
  .cf-close {
    display: inline-flex; align-items: center; justify-content: center; flex: none; width: 28px; height: 28px;
    margin: -4px -6px 0 0; padding: 0; border: 0; border-radius: 6px; background: none; color: var(--wa-muted); cursor: pointer;
  }
  .cf-close:hover { background: var(--wa-panel); color: var(--wa-ink); }
  .cf-close:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .cf-close svg.ui-icon { width: 16px; height: 16px; }
  .cf-dialog-title { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
  .cf-dialog-body { min-height: 0; overflow: auto; display: flex; flex-direction: column; gap: 8px; }
  .cf-json {
    flex: 1 1 auto; min-height: 120px; margin: 0; padding: 10px 12px; overflow: auto;
    border: 1px solid var(--wa-line); border-radius: var(--wa-r-sm, 8px); background: var(--wa-field);
    font: 12px/1.45 ui-monospace, SFMono-Regular, Menlo, monospace; white-space: pre; tab-size: 2;
  }
  .cf-json:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .cf-copied { margin-right: auto; align-self: center; }
`;
