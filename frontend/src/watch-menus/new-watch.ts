// A new watch on the watch screens: the menu, status page, voice and rooms
// editors, while Home Assistant holds no record of their kind for the watch.
//
// There is no Start button. Each screen opens ready, on what its Start used
// to make (the app's defaults, or no rooms), held unsaved in the editor's
// kept draft at revision 0. Nothing is written until the first Save, which
// is a save over revision 0: the same write the Start made. Until then the
// watch keeps what it has, and the opening state is not unsaved work.
//
// While the watch's iPhone may still move its setup here (`noRecordStart`
// says "wait") the screens wait instead, and "Start fresh instead" (asked
// first, `mayStart`) opens the same ready screen. That choice is kept here,
// per kind and watch, for as long as the panel is open, so a screen opened
// again shows the ready screen and the edits made on it.
//
// The words are Watch settings' (`NEW_WATCH_TEXT`, `NOTHING_TO_SAVE_TEXT`),
// so every watch screen says the same.

import { css, html, nothing, type TemplateResult } from "lit";
import { uiIcon } from "../ui-icons.js";
import { NEW_WATCH_TEXT, NOTHING_TO_SAVE_TEXT, PAIR_FIRST_TEXT, type NoRecordStart } from "../watch-settings.js";

/** The kinds whose screens open ready here. `behavior` is the main house's
 * rooms, which ride in the watch's settings record. */
export type NewWatchKind = "menus" | "status_pages" | "voice" | "behavior" | "rooms";

const freshChoices = new Set<string>();

function choiceKey(kind: NewWatchKind, watchId: string): string {
  return `${kind}\u0000${watchId}`;
}

/** "Start fresh instead" was chosen (and confirmed) for this kind on this
 * watch: its screen opens ready although an iPhone may still move a setup. */
export function chooseStartFresh(kind: NewWatchKind, watchId: string): void {
  freshChoices.add(choiceKey(kind, watchId));
}

/** Whether "Start fresh instead" was chosen for this kind on this watch. */
export function choseStartFresh(kind: NewWatchKind, watchId: string): boolean {
  return freshChoices.has(choiceKey(kind, watchId));
}

/** Forget every choice. For tests. */
export function forgetStartFreshChoices(): void {
  freshChoices.clear();
}

/** Whether a screen with no record opens ready: always when no iPhone will
 * move one here, and while one may only after "Start fresh instead". */
export function opensReady(state: NoRecordStart, kind: NewWatchKind, watchId: string | undefined): boolean {
  if (state === "start") return true;
  return watchId !== undefined && choseStartFresh(kind, watchId);
}

/**
 * The reason beside a greyed-out Save, or "" when Save is not greyed out or
 * the bar already says why (a save running says "Saving…" on the button; a
 * stored copy with no edits says when it was saved). On a new watch's ready
 * screen before any change it is `NOTHING_TO_SAVE_TEXT`.
 */
export function saveBlockedText(i: { newWatch: boolean; dirty: boolean; saving: boolean }): string {
  if (i.saving || i.dirty) return "";
  return i.newWatch ? NOTHING_TO_SAVE_TEXT : "";
}

/** The note for a first save Home Assistant refused as `no_record`: the
 * watch is not paired, so it holds no key to make a record for. Any other
 * ending keeps the editor's own note. */
export function firstSaveNote<N>(wasNew: boolean, code: string | undefined, note: N): N | { kind: "warn"; text: string } {
  return wasNew && code === "no_record" ? { kind: "warn", text: PAIR_FIRST_TEXT } : note;
}

/** The line over a new watch's ready screen. */
export function renderNewWatchBanner(): TemplateResult {
  return html`<div class="pe-note nw-banner" role="note">${uiIcon("info")}<span>${NEW_WATCH_TEXT}</span></div>`;
}

/** The reason beside a greyed-out Save in the top bar, when there is one. */
export function renderSaveReason(text: string): TemplateResult | typeof nothing {
  if (text === "") return nothing;
  return html`<span class="nw-why" role="status">${uiIcon("info")}<span>${text}</span></span>`;
}

/** The banner and the reason, beside each editor's own `.pe-note`: a hairline
 * border and a blue info glyph, a neutral notice rather than a warning. */
export const newWatchStyles = css`
  .pe-note.nw-banner {
    flex: none;
    border-color: color-mix(in srgb, var(--wa-accent) 35%, var(--wa-line));
    background: color-mix(in srgb, var(--wa-accent) 6%, var(--wa-card));
  }
  .pe-note.nw-banner > svg.ui-icon { width: 15px; height: 15px; color: var(--wa-accent); flex: none; }
  .nw-why {
    display: inline-flex; align-items: center; gap: 5px; min-width: 0;
    font-size: 12px; color: var(--wa-muted); padding: 0 4px;
  }
  .nw-why > svg.ui-icon { width: 13px; height: 13px; flex: none; }
  .wa-bar.stacked .nw-why { white-space: normal; }
`;
