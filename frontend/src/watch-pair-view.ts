// The "Pair a device" card. One card, drawn in two places: on the Watch
// app's Settings page, after its other cards, and in the dialog Home's
// Devices card opens. Each place holds its own card and says what happens
// once a device is paired (`onPaired`).
//
// It pairs two ways, picked in a small segmented control:
//
// - Type a code: a watch, or an iPhone, shows a six character code. Look up
//   comes first, so the administrator sees which device it is (its name, app
//   version and build, when and from where it asked) before it gets a key.
// - Show a QR code: for an iPhone. The integration makes a one-time offer,
//   the card draws it as a QR code with a countdown and asks every two
//   seconds whether a phone has used it. An offer still open when the card
//   is left, or the mode changes, is withdrawn.
//
// Its words and rules are in `watch-settings.ts`, which the tests read
// without a DOM. Plan: app repo docs/iphone_pairing_without_sign_in_2026-10.md.

import { css, html, nothing, type TemplateResult } from "lit";
import { live } from "lit/directives/live.js";
import {
  type HassLike,
  type PairLookupFound,
  cancelPairOffer,
  confirmPairCode,
  listHaUsers,
  lookupPairCode,
  offerPairQr,
  pairOfferStatus,
} from "./ha-api.js";
import { SECTION_COLOR } from "./kinds.js";
import { type QrPicture, qrPicture } from "./qr-code.js";
import { uiIcon } from "./ui-icons.js";
import {
  PAIR_CARD_TITLE,
  PAIR_CODE_HINT,
  PAIR_CODE_LENGTH,
  PAIR_MODES,
  PAIR_NOT_FOUND_TEXT,
  PAIR_OFFER_POLL_MS,
  PAIR_OPEN_APP_TEXT,
  PAIR_QR_EXPIRED_TEXT,
  PAIR_QR_HINT,
  PAIR_QR_REPLACE_LABEL,
  PAIR_REPLACE_LABEL,
  PAIR_SHOW_QR_TEXT,
  PAIR_USER_PLACEHOLDER,
  type PairChecks,
  type PairDeviceKind,
  type PairMode,
  type PairUserChoice,
  errorCode,
  normalizePairCode,
  pairCanConfirm,
  pairChecksNeeded,
  pairCodeIsComplete,
  pairCountdownText,
  pairDefaultUser,
  pairDeviceKind,
  pairDeviceTitle,
  pairErrorText,
  pairExpectLabel,
  pairLookupLine,
  pairLookupWarnings,
  pairPersonPicked,
  pairRemoteWarning,
  pairRequestLine,
  pairUserChoices,
  pairUserHint,
  pairUserTitle,
  pairUserToSend,
  pairedFor,
  pairedText,
} from "./watch-settings.js";

/** The card's mark and tint. */
const PAIR_LOOK = { icon: "link", color: SECTION_COLOR.complication } as const;

/** No box ticked. */
const UNTICKED: PairChecks = { replace: false, remote: false };

/** The code mode's state: the code being typed, then what looking it up
 * found, then the pairing. */
export interface PairState {
  code: string;
  /** The device waiting on `code`, once looked up. */
  found?: PairLookupFound & { code: string };
  /** Who the device can be paired for, read with the lookup. Undefined when
   * the integration's confirm takes no user, or the list could not be read:
   * the device is then paired for the administrator at the card. */
  users?: readonly PairUserChoice[];
  /** The user picked in "Whose watch is this?". Undefined while nobody is. */
  userId?: string;
  /** Boxes a confirm was refused for that the lookup did not call for. */
  asked?: Partial<PairChecks>;
  /** The boxes ticked. */
  ticked?: PairChecks;
  notFound?: boolean;
  busy?: "lookup" | "confirm";
  error?: string;
  /** "Paired <name>." after a confirm. */
  done?: string;
}

/** The QR mode's state. */
export interface OfferState {
  /** The people list has been read (or failed to be). Show QR code waits on
   * it, so nobody is paired for the wrong person while it loads. */
  usersRead: boolean;
  /** Who the iPhone can be paired for. Undefined when the list could not be
   * read: the iPhone is then paired for the administrator at the card. */
  users?: readonly PairUserChoice[];
  userId?: string;
  /** "Replace an iPhone paired for someone else", sent as `replace`. */
  replace: boolean;
  busy?: "offer";
  /** The QR code on screen, until it is used, runs out or is withdrawn. */
  open?: { id: string; url: string; picture: QrPicture; expiresAt: number };
  expired?: boolean;
  error?: string;
  /** "Paired <device> for <person>." once a phone used it. */
  done?: string;
}

/** Hears of a device just paired. `deviceId` is the paired device's id, or
 * undefined for an iPhone paired by QR code (the offer's state does not name
 * it). `stale` answers true once the card has been closed or opened again
 * since the pairing started, so whatever the place does afterwards can leave
 * a later visit alone. */
export type OnPaired = (deviceId: string | undefined, stale: () => boolean, kind: PairDeviceKind) => void | Promise<void>;

/** Only a link into the app goes on the Open in Wrist Assistant link. */
function appLink(url: string): string | undefined {
  return url.startsWith("wristassistant://") ? url : undefined;
}

export class PairWatchCard {
  private hass?: HassLike;
  private mode: PairMode = "code";
  private pair: PairState = { code: "" };
  private offer: OfferState = { usersRead: false, replace: false };
  /** Bumped by every change of code and by closing, so a lookup that answers
   * for a code no longer in the field is dropped. */
  private pairSeq = 0;
  /** Bumped by every new offer, every mode change and every closing, so an
   * offer that answers after the QR mode was left is withdrawn unseen. */
  private offerSeq = 0;
  /** Bumped by every opening and closing, so a pairing that answers after
   * the card was left leaves the next visit's card alone. */
  private visit = 0;
  /** The countdown's second tick while a QR code is open; every other tick
   * also asks the offer's state. */
  private ticker?: ReturnType<typeof setInterval>;
  private ticks = 0;
  /** An offer state question is out. */
  private polling = false;

  /** `update` asks the place to draw again. */
  constructor(
    private readonly update: () => void,
    private readonly onPaired?: OnPaired,
  ) {}

  /** The card has come on screen: it starts afresh, on Type a code. */
  open(hass: HassLike): void {
    this.withdrawOffer();
    this.hass = hass;
    this.visit++;
    this.pairSeq++;
    this.offerSeq++;
    this.mode = "code";
    this.pair = { code: "" };
    this.offer = { usersRead: false, replace: false };
  }

  /** The card has gone from the screen. An open QR code is withdrawn. */
  close(): void {
    this.withdrawOffer();
    this.visit++;
    this.pairSeq++;
    this.offerSeq++;
    this.mode = "code";
    this.pair = { code: "" };
    this.offer = { usersRead: false, replace: false };
  }

  /** The page the card is on has gone (Home Assistant moved the panel out):
   * an open QR code is withdrawn, the rest is kept. */
  stopOffer(): void {
    this.offerSeq++;
    this.withdrawOffer();
    this.offer = { ...this.offer, busy: undefined };
  }

  /** A pairing is being looked up, confirmed or offered. */
  get busy(): boolean {
    return this.pair.busy !== undefined || this.offer.busy !== undefined;
  }

  // ── switching mode ─────────────────────────────────────────────────────

  private setMode(mode: PairMode): void {
    if (mode === this.mode) return;
    this.mode = mode;
    // Leaving the QR mode takes its code with it; coming back starts over.
    this.offerSeq++;
    this.withdrawOffer();
    this.offer = { usersRead: this.offer.usersRead, users: this.offer.users, replace: false,
      userId: this.offer.users === undefined ? undefined : pairDefaultUser(this.offer.users, null) };
    if (mode === "qr" && !this.offer.usersRead) void this.readOfferUsers();
    this.update();
  }

  // ── Type a code ────────────────────────────────────────────────────────

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
      this.pair = {
        code,
        found: { ...reply, code },
        users,
        userId: users === undefined ? undefined : pairDefaultUser(users, reply.bound_user_id),
        ticked: UNTICKED,
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

  /** Who a device can be paired for. A list that cannot be read leaves the
   * menu out, and the device is paired for the administrator as before. */
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

  private tickPair(box: keyof PairChecks, on: boolean): void {
    this.pair = { ...this.pair, ticked: { ...(this.pair.ticked ?? UNTICKED), [box]: on }, error: undefined };
    this.update();
  }

  private async confirmPair(): Promise<void> {
    const hass = this.hass;
    const found = this.pair.found;
    if (!hass || this.pair.busy || found === undefined) return;
    const { users, userId, asked } = this.pair;
    const ticked = this.pair.ticked ?? UNTICKED;
    const needed = pairChecksNeeded(found, asked);
    if (!pairCanConfirm(needed, ticked, users, userId)) return;
    const kind = pairDeviceKind(found);
    const visit = this.visit;
    this.pair = { ...this.pair, busy: "confirm", error: undefined };
    this.update();
    let paired: string | undefined;
    try {
      const sent = pairUserToSend(userId, hass.user?.id);
      const reply = await confirmPairCode(hass, found.code, sent, {
        replace: needed.replace && ticked.replace,
        allowRemote: needed.remote && ticked.remote,
      });
      paired = reply.watch_id;
      if (visit === this.visit) {
        this.pairSeq++;
        this.pair = { code: "", done: pairedText(reply.device_name ?? found.device_name, pairedFor(users, userId), kind) };
      }
    } catch (err) {
      if (visit === this.visit) {
        this.pairSeq++;
        const code = errorCode(err);
        // An unknown code here is one that ran out between the lookup and
        // the Pair button, or was confirmed somewhere else meanwhile. A box
        // the server wants ticked is shown, unticked, with why.
        this.pair = code === "unknown_code"
          ? { code: found.code, notFound: true }
          : {
              code: found.code, found, users, userId, ticked,
              asked: {
                ...asked,
                ...(code === "needs_replace" ? { replace: true } : {}),
                ...(code === "needs_allow_remote" ? { remote: true } : {}),
              },
              error: pairErrorText(err, "confirm", kind),
            };
      }
    } finally {
      if (visit === this.visit) this.pair = { ...this.pair, busy: undefined };
      this.update();
    }
    if (paired !== undefined) await this.onPaired?.(paired, () => visit !== this.visit, kind);
  }

  // ── Show a QR code ─────────────────────────────────────────────────────

  /** Read the people once per visit, on the way into the QR mode. */
  private async readOfferUsers(): Promise<void> {
    const hass = this.hass;
    if (!hass) return;
    const visit = this.visit;
    const users = await this.pairUsers(hass);
    if (visit !== this.visit) return;
    this.offer = { ...this.offer, usersRead: true, users, userId: this.offer.userId ?? (users === undefined ? undefined : pairDefaultUser(users, null)) };
    this.update();
  }

  private pickOfferUser(userId: string): void {
    this.offer = { ...this.offer, userId, error: undefined };
    this.update();
  }

  private setOfferReplace(on: boolean): void {
    this.offer = { ...this.offer, replace: on };
    this.update();
  }

  /** Make an offer and draw it. One already open is withdrawn first. */
  private async showOffer(): Promise<void> {
    const hass = this.hass;
    const { users, userId, replace } = this.offer;
    if (!hass || this.offer.busy || !this.offer.usersRead || !pairPersonPicked(users, userId)) return;
    this.withdrawOffer();
    const seq = ++this.offerSeq;
    this.offer = { ...this.offer, busy: "offer", open: undefined, expired: false, done: undefined, error: undefined };
    this.update();
    let offerId: string | undefined;
    try {
      const reply = await offerPairQr(hass, pairUserToSend(userId, hass.user?.id), replace);
      offerId = reply.offer_id;
      const url = appLink(reply.url);
      if (url === undefined) throw new Error("the integration sent a link that is not for Wrist Assistant");
      const picture = await qrPicture(url);
      if (seq !== this.offerSeq) {
        void cancelPairOffer(hass, reply.offer_id).catch(() => undefined);
        return;
      }
      this.offer = { ...this.offer, open: { id: reply.offer_id, url, picture, expiresAt: Date.now() + reply.expires_in * 1000 } };
      this.startTicking();
    } catch (err) {
      if (offerId !== undefined) void cancelPairOffer(hass, offerId).catch(() => undefined);
      if (seq !== this.offerSeq) return;
      this.offer = { ...this.offer, error: pairErrorText(err, "offer", "iphone") };
    } finally {
      if (seq === this.offerSeq) this.offer = { ...this.offer, busy: undefined };
      this.update();
    }
  }

  /** Ask whether a phone has used the open offer. A question that fails is
   * asked again on the next tick, until the code has run out by the clock. */
  private async pollOffer(): Promise<void> {
    const hass = this.hass;
    const open = this.offer.open;
    if (!hass || open === undefined || this.polling) return;
    const visit = this.visit;
    this.polling = true;
    try {
      const status = await pairOfferStatus(hass, open.id);
      if (this.offer.open?.id !== open.id) return;
      if (status.state === "redeemed") {
        this.stopTicking();
        const whom = pairedFor(this.offer.users, status.user_id ?? this.offer.userId);
        this.offer = { ...this.offer, open: undefined, done: pairedText(status.device_name, whom, "iphone") };
        this.update();
        await this.onPaired?.(undefined, () => visit !== this.visit, "iphone");
        return;
      }
      if (status.state === "expired") this.expireOffer();
    } catch {
      // Asked again on the next tick.
    } finally {
      this.polling = false;
    }
    // The server is the judge, but a code well past its time is gone
    // whatever it says.
    if (this.offer.open?.id === open.id && Date.now() > open.expiresAt + PAIR_OFFER_POLL_MS * 2) this.expireOffer();
  }

  private expireOffer(): void {
    this.stopTicking();
    this.offer = { ...this.offer, open: undefined, expired: true };
    this.update();
  }

  private startTicking(): void {
    this.stopTicking();
    this.ticks = 0;
    const every = PAIR_OFFER_POLL_MS / 2;
    this.ticker = setInterval(() => {
      this.ticks++;
      this.update();
      if (this.ticks % 2 === 0) void this.pollOffer();
    }, every);
  }

  private stopTicking(): void {
    if (this.ticker !== undefined) clearInterval(this.ticker);
    this.ticker = undefined;
  }

  /** Withdraw the open offer, if any, so its QR code stops working now
   * rather than when it runs out. */
  private withdrawOffer(): void {
    this.stopTicking();
    const open = this.offer.open;
    if (open === undefined) return;
    this.offer = { ...this.offer, open: undefined };
    if (this.hass) void cancelPairOffer(this.hass, open.id).catch(() => undefined);
  }

  // ── drawing ────────────────────────────────────────────────────────────

  /** The card. `headEnd` goes at the right of its title row, for the
   * dialog's Close. */
  render(options: { headEnd?: TemplateResult } = {}): TemplateResult {
    const busy = this.busy;
    return html`<section class="sec ws-pair" data-sec="ws-pair" data-open="true" data-help="on" style=${`--c:${PAIR_LOOK.color}`}>
      <div class="sec-h pinned">
        <span class="swatch">${uiIcon(PAIR_LOOK.icon)}</span>
        <span class="tt"><h4>${PAIR_CARD_TITLE}</h4></span>
        ${options.headEnd ?? nothing}
      </div>
      <div class="sec-b">
        <div class="seg wide ws-pair-modes" role="radiogroup" aria-label="How to pair">
          ${PAIR_MODES.map(([mode, label]) => html`<button type="button" role="radio" aria-checked=${mode === this.mode ? "true" : "false"}
            class=${mode === this.mode ? "on" : ""} ?disabled=${busy && mode !== this.mode}
            @click=${() => this.setMode(mode)}>${label}</button>`)}
        </div>
        ${this.mode === "code" ? this.renderCode() : this.renderQr()}
      </div>
    </section>`;
  }

  private renderCode() {
    const p = this.pair;
    const complete = pairCodeIsComplete(p.code);
    const found = p.found !== undefined && p.found.code === p.code ? p.found : undefined;
    return html`<div class="hint keep">${PAIR_CODE_HINT}</div>
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
            title=${complete ? "Find the device showing this code" : `Type the ${PAIR_CODE_LENGTH} character code first`}
            @click=${() => void this.lookUpPair()}>${p.busy === "lookup" ? "Looking up…" : "Look up"}</button>
        </div>
      </div>
      ${found === undefined ? nothing : this.renderFound(p, found)}
      ${p.notFound ? html`<div class="hint warn" role="status">${PAIR_NOT_FOUND_TEXT}</div>` : nothing}
      ${p.done ? html`<div class="hint keep ws-pair-done" role="status">${p.done}</div>` : nothing}
      ${p.error ? html`<div class="hint err" role="alert">${p.error}</div>` : nothing}`;
  }

  /** The device a code belongs to, whose it is, the boxes it calls for, and
   * Pair. */
  private renderFound(p: PairState, found: PairLookupFound) {
    const kind = pairDeviceKind(found);
    const needed = pairChecksNeeded(found, p.asked);
    const ticked = p.ticked ?? UNTICKED;
    const busy = p.busy !== undefined;
    const ready = pairCanConfirm(needed, ticked, p.users, p.userId);
    const why = !pairPersonPicked(p.users, p.userId)
      ? "Choose a person first"
      : !ready ? "Tick the boxes above first"
      : kind === "iphone" ? "Give this iPhone its key, so it can read from Home Assistant"
      : "Give this watch its key, so it can read from Home Assistant without an iPhone";
    const box = (key: keyof PairChecks, label: string, cls: string) => html`<label class="field check ${cls}"><span>${label}</span>
        <input type="checkbox" .checked=${live(ticked[key])} ?disabled=${busy}
          @change=${(e: Event) => this.tickPair(key, (e.target as HTMLInputElement).checked)} /></label>`;
    return html`<div class="field readout">
        <span>${pairDeviceTitle(kind)}</span>
        <div class="readout-v ws-pair-watch">${pairLookupLine(found)}</div>
      </div>
      ${this.renderPairRequest(found, kind)}
      ${pairLookupWarnings(found).map((line) => html`<div class="hint warn">${line}</div>`)}
      ${this.renderUserMenu(p.users, p.userId, kind, busy, (id) => this.pickPairUser(id))}
      ${needed.replace ? box("replace", PAIR_REPLACE_LABEL, "ws-pair-replace") : nothing}
      ${needed.remote ? box("remote", pairExpectLabel(kind), "ws-pair-expect") : nothing}
      <button class="small primary ws-pair-go" ?disabled=${busy || !ready} title=${why}
        @click=${() => void this.confirmPair()}>${p.busy === "confirm" ? "Pairing…" : "Pair"}</button>`;
  }

  private renderQr() {
    const o = this.offer;
    const open = o.open;
    const busy = o.busy !== undefined;
    const picked = pairPersonPicked(o.users, o.userId);
    const why = !o.usersRead ? "Reading the people in Home Assistant…"
      : !picked ? "Choose a person first"
      : "Make a QR code the iPhone can scan to pair";
    return html`<div class="hint keep">${PAIR_QR_HINT}</div>
      ${this.renderUserMenu(o.users, o.userId, "iphone", busy || open !== undefined, (id) => this.pickOfferUser(id))}
      <label class="field check ws-qr-replace"><span>${PAIR_QR_REPLACE_LABEL}</span>
        <input type="checkbox" .checked=${live(o.replace)} ?disabled=${busy || open !== undefined}
          @change=${(e: Event) => this.setOfferReplace((e.target as HTMLInputElement).checked)} /></label>
      ${open === undefined
        ? html`<button class="small primary ws-qr-show" ?disabled=${busy || !o.usersRead || !picked} title=${why}
            @click=${() => void this.showOffer()}>${busy ? "Making…" : PAIR_SHOW_QR_TEXT}</button>`
        : html`<div class="ws-qr">
              <svg viewBox=${`0 0 ${open.picture.size} ${open.picture.size}`} role="img" aria-label="QR code for pairing an iPhone"
                shape-rendering="crispEdges"><rect width=${open.picture.size} height=${open.picture.size} fill="#fff"></rect><path d=${open.picture.path} fill="#000"></path></svg>
            </div>
            <div class="ws-qr-foot">
              <span class="hint keep ws-qr-count" role="timer">${pairCountdownText((open.expiresAt - Date.now()) / 1000)}</span>
              <a class="ws-qr-open" href=${open.url} title="For this page open on the iPhone itself">${PAIR_OPEN_APP_TEXT}</a>
            </div>`}
      ${o.expired ? html`<div class="hint warn" role="status">${PAIR_QR_EXPIRED_TEXT}</div>` : nothing}
      ${o.done ? html`<div class="hint keep ws-pair-done" role="status">${o.done}</div>` : nothing}
      ${o.error ? html`<div class="hint err" role="alert">${o.error}</div>` : nothing}`;
  }

  /** "Whose watch is this?": the Home Assistant users, each with its account
   * type, the administrator at the card first. With more than one, nobody is
   * picked until the administrator picks (a known device starts on its
   * owner). Left out with one person to choose from, or when the
   * integration's confirm takes no user. */
  private renderUserMenu(
    users: readonly PairUserChoice[] | undefined,
    userId: string | undefined,
    kind: PairDeviceKind,
    disabled: boolean,
    pick: (id: string) => void,
  ) {
    if (users === undefined || users.length < 2) return nothing;
    const picked = userId !== undefined && users.some((u) => u.id === userId) ? userId : undefined;
    return html`<label class="field ws-pair-user"><span>${pairUserTitle(kind)}</span>
        <select .value=${live(picked ?? "")} ?disabled=${disabled}
          @change=${(e: Event) => pick((e.target as HTMLSelectElement).value)}>
          ${picked === undefined ? html`<option value="" disabled selected>${PAIR_USER_PLACEHOLDER}</option>` : nothing}
          ${users.map((u) => html`<option value=${u.id} ?selected=${u.id === picked}>${u.label}</option>`)}
        </select></label>
      <div class="hint keep">${pairUserHint(kind)}</div>`;
  }

  /** Under the device line: when and from where it asked, and a warning when
   * that address is outside the home network. */
  private renderPairRequest(found: PairLookupFound, kind: PairDeviceKind) {
    const line = pairRequestLine(found);
    const warning = pairRemoteWarning(found.remote, kind);
    return html`${line === undefined ? nothing : html`<div class="hint keep ws-pair-request">${line}</div>`}
      ${warning === undefined ? nothing : html`<div class="hint warn">${warning}</div>`}`;
  }
}

/** The card's own rules, wherever it is drawn: the code box only as wide as
 * a code, spaced out so the six characters read one by one, with Look up
 * beside it. The QR code sits on white with its quiet zone, dark on light in
 * either theme, which is what a phone camera reads best. */
export const pairCardStyles = css`
  .ws-pair .ws-pair-modes { margin: 2px 0 6px; }
  .ws-pair-row { flex-wrap: nowrap; }
  .sec.ws-pair .field input.ws-pair-code { flex: 0 1 112px; width: 112px; letter-spacing: .14em; text-transform: uppercase; }
  .ws-pair-row > button.small { flex: none; }
  .ws-pair .readout-v.ws-pair-watch { color: var(--wa-ink); }
  .ws-pair .ws-qr { width: min(224px, 100%); margin: 8px auto 4px; border-radius: 8px; overflow: hidden; background: #fff; }
  .ws-pair .ws-qr svg { display: block; width: 100%; height: auto; }
  .ws-pair .ws-qr-foot { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
  .ws-pair .ws-qr-count { font-variant-numeric: tabular-nums; }
  .ws-pair a.ws-qr-open { font-size: 12.5px; color: var(--wa-accent); }
`;
