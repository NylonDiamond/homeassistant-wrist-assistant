// The "Pair a watch" card: pairing a watch that has no iPhone, by the six
// character code it shows. One card, drawn in two places: on the Watch app's
// Settings page, after its other cards, and in the dialog Home's Devices card
// opens. Each place holds its own card and says what happens once a watch is
// paired (`onPaired`).
//
// Look up comes first, so the administrator sees which watch it is (its name,
// app version and build, when and from where it asked) before it gets a key.
//
// Its words and rules are in `watch-settings.ts`, which the tests read
// without a DOM.

import { css, html, nothing, type TemplateResult } from "lit";
import { live } from "lit/directives/live.js";
import { type HassLike, type PairLookupFound, confirmPairCode, listHaUsers, lookupPairCode } from "./ha-api.js";
import { SECTION_COLOR } from "./kinds.js";
import { uiIcon } from "./ui-icons.js";
import {
  PAIR_CODE_LENGTH,
  PAIR_NOT_FOUND_TEXT,
  PAIR_USER_HINT,
  PAIR_USER_TITLE,
  type PairUserChoice,
  errorCode,
  normalizePairCode,
  pairCodeIsComplete,
  pairDefaultUser,
  pairErrorText,
  pairLookupLine,
  pairLookupWarnings,
  pairRemoteWarning,
  pairRequestLine,
  pairUserChoices,
  pairUserToSend,
  pairedText,
} from "./watch-settings.js";

/** The card's mark and tint. */
const PAIR_LOOK = { icon: "link", color: SECTION_COLOR.complication } as const;

/** The card's state: the code being typed, then what looking it up found,
 * then the pairing. */
export interface PairState {
  code: string;
  /** The watch waiting on `code`, once looked up. */
  found?: PairLookupFound & { code: string };
  /** Who the watch can be paired for, read with the lookup. Undefined when
   * the integration's confirm takes no user, or the list could not be read:
   * the watch is then paired for the administrator at the card. */
  users?: readonly PairUserChoice[];
  /** The user picked in "Whose watch is this?". */
  userId?: string;
  notFound?: boolean;
  busy?: "lookup" | "confirm";
  error?: string;
  /** "Paired <name>." after a confirm. */
  done?: string;
}

/** Hears of a watch just paired. `stale` answers true once the card has been
 * closed or opened again since the pairing started, so whatever the place
 * does afterwards can leave a later visit alone. */
export type OnPaired = (watchId: string, stale: () => boolean) => void | Promise<void>;

export class PairWatchCard {
  private hass?: HassLike;
  private pair: PairState = { code: "" };
  /** Bumped by every change of code and by closing, so a lookup that answers
   * for a code no longer in the field is dropped. */
  private pairSeq = 0;
  /** Bumped by every opening and closing, so a pairing that answers after
   * the card was left leaves the next visit's card alone. */
  private visit = 0;

  /** `update` asks the place to draw again. */
  constructor(
    private readonly update: () => void,
    private readonly onPaired?: OnPaired,
  ) {}

  /** The card has come on screen: it starts afresh. */
  open(hass: HassLike): void {
    this.hass = hass;
    this.visit++;
    this.pairSeq++;
    this.pair = { code: "" };
  }

  /** The card has gone from the screen. */
  close(): void {
    this.visit++;
    this.pairSeq++;
    this.pair = { code: "" };
  }

  /** A pairing is being looked up or confirmed. */
  get busy(): boolean {
    return this.pair.busy !== undefined;
  }

  /** A new code in the field: whatever was found for the old one goes. */
  private setPairCode(raw: string): string {
    const code = normalizePairCode(raw).slice(0, PAIR_CODE_LENGTH);
    if (code !== this.pair.code) {
      this.pairSeq++;
      this.pair = { code, busy: this.pair.busy };
    }
    this.update();
    return code;
  }

  private async lookUpPair(): Promise<void> {
    const hass = this.hass;
    const code = this.pair.code;
    if (!hass || this.pair.busy || !pairCodeIsComplete(code)) return;
    const visit = this.visit;
    const seq = ++this.pairSeq;
    this.pair = { code, busy: "lookup" };
    this.update();
    try {
      const reply = await lookupPairCode(hass, code);
      if (seq !== this.pairSeq) return;
      if (!reply.found) {
        this.pair = { code, notFound: true };
        return;
      }
      const users = "bound_user_id" in reply ? await this.pairUsers(hass) : undefined;
      if (seq !== this.pairSeq) return;
      const adminId = hass.user?.id;
      this.pair = {
        code,
        found: { ...reply, code },
        users,
        userId: users === undefined ? undefined : pairDefaultUser(users, adminId, reply.bound_user_id),
      };
    } catch (err) {
      if (seq !== this.pairSeq) return;
      this.pair = { code, error: pairErrorText(err, "lookup") };
    } finally {
      // Typing on while it ran keeps the new code but frees the buttons.
      if (visit === this.visit) this.pair = { ...this.pair, busy: undefined };
      this.update();
    }
  }

  /** Who a watch can be paired for. A list that cannot be read leaves the
   * menu out, and the watch is paired for the administrator as before. */
  private async pairUsers(hass: HassLike): Promise<readonly PairUserChoice[] | undefined> {
    try {
      return pairUserChoices(await listHaUsers(hass), hass.user?.id);
    } catch {
      return undefined;
    }
  }

  private pickPairUser(userId: string): void {
    this.pair = { ...this.pair, userId, error: undefined };
    this.update();
  }

  private async confirmPair(): Promise<void> {
    const hass = this.hass;
    const found = this.pair.found;
    if (!hass || this.pair.busy || found === undefined) return;
    const visit = this.visit;
    const { users, userId } = this.pair;
    this.pair = { ...this.pair, busy: "confirm", error: undefined };
    this.update();
    let paired: string | undefined;
    try {
      const sent = pairUserToSend(userId, hass.user?.id);
      const reply = await confirmPairCode(hass, found.code, sent);
      paired = reply.watch_id;
      if (visit === this.visit) {
        this.pairSeq++;
        const whom = sent === undefined ? undefined : users?.find((u) => u.id === sent)?.label;
        this.pair = { code: "", done: pairedText(reply.device_name ?? found.device_name, whom) };
      }
    } catch (err) {
      if (visit === this.visit) {
        this.pairSeq++;
        // An unknown code here is one that ran out between the lookup and
        // the Pair button, or was confirmed somewhere else meanwhile.
        this.pair = errorCode(err) === "unknown_code"
          ? { code: found.code, notFound: true }
          : { code: found.code, found, users, userId, error: pairErrorText(err, "confirm") };
      }
    } finally {
      if (visit === this.visit) this.pair = { ...this.pair, busy: undefined };
      this.update();
    }
    if (paired !== undefined) await this.onPaired?.(paired, () => visit !== this.visit);
  }

  /** The card. `headEnd` goes at the right of its title row, for the
   * dialog's Close. */
  render(options: { headEnd?: TemplateResult } = {}): TemplateResult {
    const p = this.pair;
    const complete = pairCodeIsComplete(p.code);
    const found = p.found !== undefined && p.found.code === p.code ? p.found : undefined;
    return html`<section class="sec ws-pair" data-sec="ws-pair" data-open="true" data-help="on" style=${`--c:${PAIR_LOOK.color}`}>
      <div class="sec-h pinned">
        <span class="swatch">${uiIcon(PAIR_LOOK.icon)}</span>
        <span class="tt"><h4>Pair a watch</h4></span>
        ${options.headEnd ?? nothing}
      </div>
      <div class="sec-b">
        <div class="hint keep">On the watch, choose Pair with Home Assistant and type the code it shows.</div>
        <div class="field">
          <span>Code</span>
          <div class="row-acts ws-pair-row">
            <input type="text" class="mono ws-pair-code" aria-label="Pairing code" maxlength=${PAIR_CODE_LENGTH}
              autocapitalize="characters" autocomplete="off" autocorrect="off" spellcheck="false"
              .value=${p.code}
              @input=${(e: Event) => {
                const input = e.target as HTMLInputElement;
                // Write the clean code back at once: lit leaves the field
                // alone when the clean code is the one it already holds.
                input.value = this.setPairCode(input.value);
              }}
              @paste=${(e: ClipboardEvent) => {
                // A pasted "ABC-DEF" is longer than the field allows, so it
                // is cleaned before the length cut rather than after.
                const text = e.clipboardData?.getData("text");
                if (text === undefined) return;
                e.preventDefault();
                (e.target as HTMLInputElement).value = this.setPairCode(text);
              }}
              @keydown=${(e: KeyboardEvent) => {
                if (e.key !== "Enter" || e.isComposing) return;
                e.preventDefault();
                void this.lookUpPair();
              }} />
            <button class="small" ?disabled=${!complete || p.busy !== undefined}
              title=${complete ? "Find the watch showing this code" : `Type the ${PAIR_CODE_LENGTH} character code first`}
              @click=${() => void this.lookUpPair()}>${p.busy === "lookup" ? "Looking up…" : "Look up"}</button>
          </div>
        </div>
        ${found === undefined ? nothing : html`<div class="field readout">
            <span>Watch</span>
            <div class="readout-v ws-pair-watch">${pairLookupLine(found)}</div>
          </div>
          ${this.renderPairRequest(found)}
          ${pairLookupWarnings(found).map((line) => html`<div class="hint warn">${line}</div>`)}
          ${this.renderPairUser(p)}
          <button class="small primary ws-pair-go" ?disabled=${p.busy !== undefined}
            title="Give this watch its key, so it can read from Home Assistant without an iPhone"
            @click=${() => void this.confirmPair()}>${p.busy === "confirm" ? "Pairing…" : "Pair"}</button>`}
        ${p.notFound ? html`<div class="hint warn" role="status">${PAIR_NOT_FOUND_TEXT}</div>` : nothing}
        ${p.done ? html`<div class="hint keep ws-pair-done" role="status">${p.done}</div>` : nothing}
        ${p.error ? html`<div class="hint err" role="alert">${p.error}</div>` : nothing}
      </div>
    </section>`;
  }

  /** "Whose watch is this?": the Home Assistant users, the administrator at
   * the card first. Left out with one person to choose from, or when the
   * integration's confirm takes no user. */
  private renderPairUser(p: PairState) {
    const users = p.users;
    if (users === undefined || users.length < 2) return nothing;
    const picked = p.userId ?? users[0]?.id ?? "";
    return html`<label class="field ws-pair-user"><span>${PAIR_USER_TITLE}</span>
        <select .value=${live(picked)} ?disabled=${p.busy !== undefined}
          @change=${(e: Event) => this.pickPairUser((e.target as HTMLSelectElement).value)}>
          ${users.map((u) => html`<option value=${u.id} ?selected=${u.id === picked}>${u.label}</option>`)}
        </select></label>
      <div class="hint keep">${PAIR_USER_HINT}</div>`;
  }

  /** Under the watch line: when and from where it asked, and a warning when
   * that address is outside the home network. */
  private renderPairRequest(found: PairLookupFound) {
    const line = pairRequestLine(found);
    const warning = pairRemoteWarning(found.remote);
    return html`${line === undefined ? nothing : html`<div class="hint keep ws-pair-request">${line}</div>`}
      ${warning === undefined ? nothing : html`<div class="hint warn">${warning}</div>`}`;
  }
}

/** The card's own rules, wherever it is drawn: the code box only as wide as
 * a code, spaced out so the six characters read one by one, with Look up
 * beside it. */
export const pairCardStyles = css`
  .ws-pair-row { flex-wrap: nowrap; }
  .sec.ws-pair .field input.ws-pair-code { flex: 0 1 112px; width: 112px; letter-spacing: .14em; text-transform: uppercase; }
  .ws-pair-row > button.small { flex: none; }
  .ws-pair .readout-v.ws-pair-watch { color: var(--wa-ink); }
`;
