// The way out of the wait for an iPhone's move. A watch can wait for good when
// its iPhone is sold, lost or replaced, since only a person can know that. So
// every screen that waits offers this: "No longer have that iPhone? Use what
// is on the watch". It asks first, tells Home Assistant to stop waiting, and
// the watch then sends its own setup here (`devices/end_move_wait`). It writes
// no record. The panel's owner list then says `has_iphone: false`, and the wait
// lines go by themselves. The words and the rule are in `watch-settings.ts`, so
// tests read them without a DOM.

import { LitElement, type TemplateResult, css, html, nothing } from "lit";
import { friendlyError } from "./friendly-error.js";
import { type HassLike, type OwnerSummary, endMoveWait } from "./ha-api.js";
import type { LibraryKind } from "./library/client.js";
import { type Library, holdsRecord } from "./library/model.js";
import { type PagesRecordFacts, awaitingMove } from "./watch-pages/devices.js";
import { MOVE_WAIT_ENDED_EVENT, NO_IPHONE_QUESTION, USE_WATCH_BUTTON, USE_WATCH_CONFIRM_TEXT, offersUseWatch, waitingWatchText } from "./watch-settings.js";

/** What the way out needs of the watch that waits. */
export type MoveWaitOwner = Pick<OwnerSummary, "owner_watch_id" | "app_version" | "device_name">;

export class WaMoveWaitOut extends LitElement {
  static override properties = {
    hass: { attribute: false },
    owner: { attribute: false },
    named: { type: Boolean },
    busy: { state: true },
    failed: { state: true },
  };

  declare hass: HassLike | undefined;
  /** The watch that waits. */
  declare owner: MoveWaitOwner | undefined;
  /** Say which watch: on a screen about more than one. */
  declare named: boolean;
  declare busy: boolean;
  declare failed: string | undefined;

  constructor() {
    super();
    this.named = false;
    this.busy = false;
    this.failed = undefined;
  }

  static override styles = css`
    :host { display: block; margin: 8px 0; font-size: 13px; line-height: 1.4; color: var(--wa-muted); }
    button {
      padding: 0; border: 0; background: none; font: inherit; color: var(--wa-accent); font-weight: 600;
      cursor: pointer; text-decoration: underline; text-underline-offset: 2px;
    }
    button:disabled { opacity: 0.5; cursor: default; }
    .failed { color: var(--wa-warn, var(--wa-muted)); }
  `;

  private async use(): Promise<void> {
    const hass = this.hass;
    const owner = this.owner;
    if (hass === undefined || owner === undefined || this.busy) return;
    if (!window.confirm(USE_WATCH_CONFIRM_TEXT)) return;
    this.busy = true;
    this.failed = undefined;
    try {
      await endMoveWait(hass, owner.owner_watch_id);
      this.dispatchEvent(new CustomEvent(MOVE_WAIT_ENDED_EVENT, { bubbles: true, composed: true, detail: { watchId: owner.owner_watch_id } }));
    } catch (err) {
      this.failed = friendlyError(err);
    } finally {
      this.busy = false;
    }
  }

  protected override render(): TemplateResult | typeof nothing {
    if (!offersUseWatch(this.owner)) return nothing;
    return html`${this.named && this.owner !== undefined ? html`${waitingWatchText(this.owner.device_name ?? this.owner.owner_watch_id)} ` : nothing}${NO_IPHONE_QUESTION}
      <button type="button" ?disabled=${this.busy} @click=${() => void this.use()}>${USE_WATCH_BUTTON}</button>
      ${this.failed === undefined ? nothing : html`<div class="failed" role="alert">${this.failed}</div>`}`;
  }
}

if (typeof customElements !== "undefined" && !customElements.get("wa-move-wait-out")) customElements.define("wa-move-wait-out", WaMoveWaitOut);

/** The way out for one watch, on a screen about that watch. */
export function renderMoveWaitOut(hass: HassLike | undefined, owner: MoveWaitOwner | undefined): TemplateResult {
  return html`<wa-move-wait-out .hass=${hass} .owner=${owner}></wa-move-wait-out>`;
}

/** The way out for every waiting watch that can take it, on a screen about
 * several, each saying which watch. Nothing when none can. */
export function renderMoveWaitOuts(
  hass: HassLike | undefined,
  owners: readonly OwnerSummary[],
  waiting: ReadonlySet<string>,
): TemplateResult | typeof nothing {
  const shown = owners.filter((o) => waiting.has(o.owner_watch_id) && offersUseWatch(o));
  if (shown.length === 0) return nothing;
  return html`${shown.map((owner) => html`<wa-move-wait-out .hass=${hass} .owner=${owner} named></wa-move-wait-out>`)}`;
}

/** `renderMoveWaitOuts` for the watches that hold none of `kind` in the
 * library while they wait (`awaitingMove`): a tab or editor of that kind. */
export function renderLibraryWaitOuts(
  hass: HassLike | undefined,
  owners: readonly OwnerSummary[],
  library: Library,
  kind: LibraryKind,
): TemplateResult | typeof nothing {
  const facts = new Map<string, PagesRecordFacts>();
  for (const o of owners) facts.set(o.owner_watch_id, { held: holdsRecord(library, o.owner_watch_id, kind), free: false });
  return renderMoveWaitOuts(hass, owners, awaitingMove(owners, facts));
}
