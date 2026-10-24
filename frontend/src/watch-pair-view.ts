// The "Pair a device" card. One card, drawn in two places: on the Watch
// app's Settings page, after its other cards, and in the dialog Home's
// Devices card opens. Each place holds its own card and says what happens
// once a device is paired (`onPaired`).
//
// Home's dialog opens on a choice, "What are you pairing?" (`pair-flow.ts`):
// most people pair a watch first, and the QR code it used to open on is no
// use to a watch. Each answer opens one of the card's two ways to pair, and
// Back returns to the choice. The Settings page opens straight on Type a
// code, with no choice to go back to. Either way, a link in the foot moves
// between the two ways:
//
// - Show a QR code: for an iPhone. The integration makes a one-time offer,
//   the card draws it as a QR code with a countdown and asks every two
//   seconds whether a phone has used it. An offer still open when the card
//   is left, or the mode or the person changes, is withdrawn. Picking iPhone
//   (or the link to it) shows a code at once.
// - Type a code: a watch, or an iPhone, shows a six character code. Look up
//   comes first, so the person at the card sees which device it is (its name, app
//   version and build, when and from where it asked) before it gets a key.
//
// Anyone signed in can pair, but only for themselves; an administrator also
// gets "Whose watch is this?" to pair for somebody else (`mayPairForOthers`).
//
// Once a watch is paired, Home's dialog shows what to do next
// (`renderPairNext`, below); the panel fills in where each step goes.
//
// Its words and rules are in `watch-settings.ts` and `pair-flow.ts`, which
// the tests read without a DOM. Plan: app repo
// docs/iphone_pairing_without_sign_in_2026-10.md.

import { css, html, nothing, type TemplateResult } from "lit";
import { live } from "lit/directives/live.js";
import { ref } from "lit/directives/ref.js";
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
import {
  PAIR_BACK_TEXT,
  PAIR_CHOICES,
  PAIR_CHOICE_TITLE,
  PAIR_NEXT_ADDRESSES,
  PAIR_NEXT_ANOTHER_TEXT,
  PAIR_NEXT_COMPLICATION_TEXT,
  PAIR_NEXT_DONE_TEXT,
  PAIR_NEXT_GUIDE_TEXT,
  PAIR_NEXT_OPEN,
  PAIR_NEXT_PAGE,
  PAIR_NEXT_TITLE,
  PAIR_NOT_THIS_TEXT,
  PAIR_QR_TITLE,
  PAIR_SETUP_GUIDE_URL,
  PAIR_TO_CODE_TEXT,
  PAIR_TO_QR_IPHONE_TEXT,
  PAIR_TO_QR_TEXT,
  type PairChoice,
  type PairStart,
  pairChoiceMode,
  pairChoiceNote,
  pairCodeSteps,
  pairCodeTitle,
  pairFoundLines,
  pairFoundTitle,
  pairGoLabel,
  pairOpening,
  pairQrLink,
  pairSubtitle,
  pairedHeadline,
} from "./pair-flow.js";
import { type QrPicture, qrPicture } from "./qr-code.js";
import { uiIcon } from "./ui-icons.js";
import {
  PAIR_CARD_TITLE,
  PAIR_CODE_LENGTH,
  PAIR_NOT_FOUND_TEXT,
  PAIR_OFFER_POLL_MS,
  PAIR_OPEN_APP_TEXT,
  PAIR_QR_EXPIRED_TEXT,
  PAIR_MORE_TEXT,
  PAIR_QR_REPLACE_HINT,
  PAIR_QR_REPLACE_LABEL,
  PAIR_QR_STEPS,
  PAIR_REPLACE_LABEL,
  PAIR_SHOW_QR_TEXT,
  PAIR_USER_PLACEHOLDER,
  type PairChecks,
  type PairDeviceKind,
  type PairMode,
  type PairUserChoice,
  errorCode,
  mayPairForOthers,
  pairNeedsAdmin,
  normalizePairCode,
  pairCanConfirm,
  pairChecksNeeded,
  pairCodeIsComplete,
  pairCountdownText,
  pairDefaultUser,
  pairDeviceKind,
  pairErrorText,
  pairOnIPhone,
  pairExpectLabel,
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
   * the integration's confirm takes no user, the person at the card is not an
   * administrator, or the list could not be read: the device is then paired
   * for the person at the card. */
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
  /** Who the iPhone can be paired for. Undefined when the person at the card
   * is not an administrator, or the list could not be read: the iPhone is
   * then paired for the person at the card. */
  users?: readonly PairUserChoice[];
  userId?: string;
  /** "Replace an iPhone paired for someone else", sent as `replace`. Only an
   * administrator sees the box or sends it: the server refuses `replace` on
   * an offer from anyone else (`unauthorized`). */
  replace: boolean;
  busy?: "offer";
  /** The QR code on screen, until it is used, runs out or is withdrawn.
   * `lasts` is how long it was made to last, in milliseconds, for the bar
   * under it. */
  open?: { id: string; url: string; picture: QrPicture; expiresAt: number; lasts?: number };
  expired?: boolean;
  error?: string;
  /** "Paired <device> for <person>." once a phone used it. */
  done?: string;
}

/** Hears of a device just paired. `deviceId` is the paired device's id, or
 * undefined for an iPhone paired by QR code on an integration whose offer
 * state does not name it yet. `stale` answers true once the card has been closed or opened again
 * since the pairing started, so whatever the place does afterwards can leave
 * a later visit alone. */
export type OnPaired = (deviceId: string | undefined, stale: () => boolean, kind: PairDeviceKind) => void | Promise<void>;

/** Only a link into the app goes on the Pair this iPhone instead link. */
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
  /** Opened to show a QR code at once (Home's dialog and welcome): the QR
   * mode makes its code without waiting for Show QR code, as soon as it knows
   * whose iPhone it is. With more than one person to choose from, nobody is
   * picked until the administrator picks, so a code scanned too early can
   * never pair the iPhone to the wrong person. */
  private autoQr = false;
  /** The code box takes the cursor on its next drawing: the mode was just
   * switched to Type a code. */
  private focusCode = false;
  /** More options is open in the QR mode, showing Replace. */
  private qrMore = false;
  /** "What are you pairing?" is on screen, in place of either mode. */
  private choosing = false;
  /** The card opened on the choice, so each mode offers Back to it. */
  private asks = false;
  /** The device the person said they are pairing, which picks the code
   * mode's steps. Undefined on the Settings page, whose steps cover both. */
  private device?: PairChoice;

  /** `update` asks the place to draw again. */
  constructor(
    private readonly update: () => void,
    private readonly onPaired?: OnPaired,
  ) {}

  /** The card has come on screen: it starts afresh, on Type a code unless
   * told otherwise (`pairOpening`). `choose` starts on "What are you
   * pairing?". With `showQr` it starts on the QR mode and makes a code as
   * soon as it knows who it is for. */
  open(hass: HassLike, start: { mode?: PairStart; showQr?: boolean } = {}): void {
    this.withdrawOffer();
    this.hass = hass;
    this.visit++;
    this.pairSeq++;
    this.offerSeq++;
    const opening = pairOpening(start);
    this.mode = opening.mode;
    this.autoQr = opening.autoQr;
    this.choosing = opening.choosing;
    this.asks = opening.asks;
    this.device = undefined;
    this.qrMore = false;
    this.pair = { code: "" };
    this.offer = { usersRead: false, replace: false };
    if (this.mode === "qr") void this.readOfferUsers();
  }

  /** The line under the dialog's title, for the step on screen. */
  get subtitle(): string {
    return pairSubtitle(this.choosing, this.mode, this.device);
  }

  /** The card has gone from the screen. An open QR code is withdrawn. */
  close(): void {
    this.withdrawOffer();
    this.visit++;
    this.pairSeq++;
    this.offerSeq++;
    this.mode = "code";
    this.autoQr = false;
    this.choosing = false;
    this.asks = false;
    this.device = undefined;
    this.qrMore = false;
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
    this.offer = { usersRead: this.offer.usersRead, users: this.offer.users, replace: false, userId: this.startUser(this.offer.users) };
    if (mode === "qr" && !this.offer.usersRead) void this.readOfferUsers();
    this.focusCode = mode === "code";
    this.update();
    if (mode === "qr" && this.offer.usersRead && this.autoQr) void this.showOffer();
  }

  /** An answer to "What are you pairing?", or a link in a mode's foot: the
   * mode that device pairs by. An iPhone's QR code is made at once, the way
   * a person who asked for one expects; a watch's code box takes the cursor.
   * "No camera? Type a code" is an iPhone in the code mode. */
  private choose(device: PairChoice, mode: PairMode = pairChoiceMode(device)): void {
    if (this.busy) return;
    this.choosing = false;
    this.device = device;
    if (mode === "qr") this.autoQr = true;
    if (mode !== this.mode) {
      this.setMode(mode);
      return;
    }
    this.focusCode = mode === "code";
    this.update();
  }

  /** Home's welcome picks the device on its own stage, in place of the
   * card's choice. The same as an answer to "What are you pairing?", except
   * that `focus: false` leaves the cursor where it is (the page has only just
   * opened). False while a pairing is under way, which keeps its device. */
  pick(device: PairChoice, options: { focus?: boolean } = {}): boolean {
    if (this.busy) return false;
    this.choose(device);
    if (options.focus === false) this.focusCode = false;
    return true;
  }

  /** The device the person said they are pairing, from the choice, a link
   * in a mode's foot, or `pick`. */
  get picked(): PairChoice | undefined {
    return this.device;
  }

  /** Back to "What are you pairing?". Whatever the mode held goes with it:
   * an open QR code is withdrawn and a typed code cleared, so the next
   * answer starts afresh. The people already read are kept. */
  private backToChoice(): void {
    if (this.busy) return;
    this.offerSeq++;
    this.withdrawOffer();
    this.pairSeq++;
    this.mode = "code";
    this.autoQr = false;
    this.qrMore = false;
    this.device = undefined;
    this.choosing = true;
    this.pair = { code: "" };
    this.offer = { usersRead: this.offer.usersRead, users: this.offer.users, replace: false, userId: this.startUser(this.offer.users) };
    this.update();
  }

  /** "Not this one": the found device goes, and the box takes the cursor
   * for the right code. */
  private notThisOne(): void {
    if (this.pair.busy) return;
    this.pairSeq++;
    this.pair = { code: "" };
    this.focusCode = true;
    this.update();
  }

  /** Who the QR mode starts on: the menu's own default, which is the one
   * person when there is only one, and nobody otherwise. */
  private startUser(users: readonly PairUserChoice[] | undefined): string | undefined {
    if (users === undefined) return undefined;
    return pairDefaultUser(users, null);
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

  /** Who a device can be paired for. Only an administrator gets a list (and
   * only an administrator may read one); anyone else, or a list that cannot
   * be read, leaves the menu out, and the device is paired for the person at
   * the card. */
  private async pairUsers(hass: HassLike): Promise<readonly PairUserChoice[] | undefined> {
    if (!mayPairForOthers(hass.user)) return undefined;
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
    if (pairNeedsAdmin(found, mayPairForOthers(hass.user))) return;
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
    this.offer = { ...this.offer, usersRead: true, users, userId: this.offer.userId ?? this.startUser(users) };
    this.update();
    if (this.autoQr && this.mode === "qr") void this.showOffer();
  }

  /** A new person, or a new Replace, makes a new code when one is showing
   * (or the card shows one by itself): the old one was for the old choice. */
  private pickOfferUser(userId: string): void {
    this.offer = { ...this.offer, userId, error: undefined };
    this.update();
    this.remakeOffer();
  }

  private setOfferReplace(on: boolean): void {
    this.offer = { ...this.offer, replace: on };
    this.update();
    this.remakeOffer();
  }

  /** Make the code again for the choices now on the card. One being made
   * is dropped: it withdraws itself when it answers. */
  private remakeOffer(): void {
    if (this.offer.open === undefined && this.offer.busy === undefined && !this.autoQr) return;
    this.offerSeq++;
    this.withdrawOffer();
    this.offer = { ...this.offer, busy: undefined, open: undefined, expired: false };
    void this.showOffer();
  }

  /** Make an offer and draw it. One already open is withdrawn first. */
  private async showOffer(): Promise<void> {
    const hass = this.hass;
    const { users, userId } = this.offer;
    const replace = this.offer.replace && mayPairForOthers(hass?.user);
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
      // The code holds the web address, which opens the app from the
      // Camera; the Open in app link keeps the app's own link.
      const picture = await qrPicture(pairQrLink(url) ?? url);
      if (seq !== this.offerSeq) {
        void cancelPairOffer(hass, reply.offer_id).catch(() => undefined);
        return;
      }
      this.offer = { ...this.offer, open: { id: reply.offer_id, url, picture, expiresAt: Date.now() + reply.expires_in * 1000, lasts: reply.expires_in * 1000 } };
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
        await this.onPaired?.(status.device_id ?? undefined, () => visit !== this.visit, "iphone");
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

  /** The card. `headEnd` goes at the right of its title row. `bare` draws
   * the body alone, for a dialog that has its own head. */
  render(options: { headEnd?: TemplateResult; bare?: boolean } = {}): TemplateResult {
    const body = this.choosing ? this.renderChoice() : this.mode === "code" ? this.renderCode() : this.renderQr();
    if (options.bare) return html`<div class="ws-pair bare" style=${`--c:${PAIR_LOOK.color}`}>${body}</div>`;
    return html`<section class="sec ws-pair" data-sec="ws-pair" data-open="true" data-help="on" style=${`--c:${PAIR_LOOK.color}`}>
      <div class="sec-h pinned">
        <span class="swatch">${uiIcon(PAIR_LOOK.icon)}</span>
        <span class="tt"><h4>${PAIR_CARD_TITLE}</h4></span>
        ${options.headEnd ?? nothing}
      </div>
      <div class="sec-b">${body}</div>
    </section>`;
  }

  /** "What are you pairing?": two large outlined answers, each with its
   * glyph and one line on how it pairs, and whose a paired device is. */
  private renderChoice() {
    return html`<h3 class="ws-pair-title">${PAIR_CHOICE_TITLE}</h3>
      <div class="ws-pair-choices">
        ${PAIR_CHOICES.map((c, i) => html`<button type="button" class="ws-pair-choice ${c.choice}" ?autofocus=${i === 0}
            @click=${() => this.choose(c.choice)}>
            ${uiIcon(c.choice === "iphone" ? "phone" : "watch")}<b>${c.label}</b><span>${c.line}</span></button>`)}
      </div>
      <p class="hint keep ws-pair-note">${pairChoiceNote(mayPairForOthers(this.hass?.user))}</p>`;
  }

  /** The foot under a mode: Back to the choice when the card opened on it,
   * then the way across to the other mode. */
  private renderFoot(other: TemplateResult | typeof nothing) {
    const busy = this.busy;
    if (!this.asks && other === nothing) return nothing;
    return html`<div class="ws-pair-foot">
        ${this.asks ? html`<button type="button" class="ghost ws-pair-back" ?disabled=${busy} @click=${() => this.backToChoice()}>${uiIcon("left")}<span>${PAIR_BACK_TEXT}</span></button>` : nothing}
        <span class="ws-pair-gap"></span>
        ${other}
      </div>`;
  }

  /** The steps on the device, numbered. */
  private steps(lines: readonly string[]) {
    return html`<ol class="ws-pair-steps">${lines.map((line, i) => html`<li><b aria-hidden="true">${i + 1}</b><span>${line}</span></li>`)}</ol>`;
  }

  /** Type a code: the steps on the device, the box and Look up. A device
   * found by the code takes the step's place (`renderFound`). */
  private renderCode() {
    const p = this.pair;
    const complete = pairCodeIsComplete(p.code);
    const found = p.found !== undefined && p.found.code === p.code ? p.found : undefined;
    if (found !== undefined) return this.renderFound(p, found);
    const busy = this.busy;
    const toQr = html`<button type="button" class="ghost ws-pair-switch" ?disabled=${busy}
        @click=${() => this.choose("iphone", "qr")}>${uiIcon("qr")}<span>${this.device === "iphone" ? PAIR_TO_QR_IPHONE_TEXT : PAIR_TO_QR_TEXT}</span></button>`;
    return html`<h3 class="ws-pair-title">${pairCodeTitle(this.device)}</h3>
      ${this.steps(pairCodeSteps(this.device))}
      <div class="ws-pair-entry">
        <div class="ws-pair-row">
          <input type="text" class="mono ws-pair-code" aria-label="Pairing code" maxlength=${PAIR_CODE_LENGTH}
            ${ref((el) => {
              if (el === undefined || !this.focusCode) return;
              this.focusCode = false;
              // The box is drawn before it is on the page: focus it after.
              setTimeout(() => (el as HTMLInputElement).focus(), 0);
            })}
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
          <button class="small ws-go" ?disabled=${!complete || p.busy !== undefined}
            title=${complete ? "Find the device showing this code" : `Type the ${PAIR_CODE_LENGTH} character code first`}
            @click=${() => void this.lookUpPair()}>${p.busy === "lookup" ? "Looking up…" : "Look up"}</button>
        </div>
      </div>
      ${p.notFound ? html`<div class="hint warn" role="status">${PAIR_NOT_FOUND_TEXT}</div>` : nothing}
      ${p.done ? html`<div class="hint keep ws-pair-done" role="status">${p.done}</div>` : nothing}
      ${p.error ? html`<div class="hint err" role="alert">${p.error}</div>` : nothing}
      ${this.renderFoot(toQr)}`;
  }

  /** "Is this your watch?": the device a code belongs to in a box (its name,
   * its app, when and from where it asked), whose it is, the boxes it calls
   * for, then Not this one and Pair this watch. */
  private renderFound(p: PairState, found: PairLookupFound) {
    const kind = pairDeviceKind(found);
    const needed = pairChecksNeeded(found, p.asked);
    const ticked = p.ticked ?? UNTICKED;
    const busy = p.busy !== undefined;
    const admin = mayPairForOthers(this.hass?.user);
    const lines = pairFoundLines(found);
    const request = pairRequestLine(found);
    const device = html`<h3 class="ws-pair-title">${pairFoundTitle(kind)}</h3>
      <div class="ws-pair-found">
        <span class="ws-pair-found-art" aria-hidden="true">${uiIcon(kind === "iphone" ? "phone" : "watch")}</span>
        <div class="ws-pair-found-t">
          <b class="ws-pair-watch">${lines.name}</b>
          ${lines.app === undefined ? nothing : html`<span>${lines.app}</span>`}
          ${request === undefined ? nothing : html`<span class="ws-pair-request">${request}</span>`}
        </div>
      </div>
      ${this.renderRemoteWarning(found, kind)}`;
    const notThis = html`<button type="button" class="ghost ws-pair-not" ?disabled=${busy} @click=${() => this.notThisOne()}>${PAIR_NOT_THIS_TEXT}</button>`;
    // Paired to someone else and the caller is no administrator: there is
    // nothing they can tick, so neither box nor Pair is offered.
    if (pairNeedsAdmin(found, admin)) {
      return html`${device}
        ${pairLookupWarnings(found, admin).map((line) => html`<div class="hint warn ws-pair-admin">${line}</div>`)}
        <div class="ws-pair-foot">${notThis}</div>`;
    }
    const ready = pairCanConfirm(needed, ticked, p.users, p.userId);
    const why = !pairPersonPicked(p.users, p.userId)
      ? "Choose a person first"
      : !ready ? "Tick the boxes above first"
      : kind === "iphone" ? "Give this iPhone its key, so it can read from Home Assistant"
      : "Give this watch its key, so it can read from Home Assistant without an iPhone";
    const box = (key: keyof PairChecks, label: string, cls: string) => html`<label class="field check ${cls}"><span>${label}</span>
        <input type="checkbox" .checked=${live(ticked[key])} ?disabled=${busy}
          @change=${(e: Event) => this.tickPair(key, (e.target as HTMLInputElement).checked)} /></label>`;
    return html`${device}
      ${pairLookupWarnings(found).map((line) => html`<div class="hint warn">${line}</div>`)}
      ${this.renderUserMenu(p.users, p.userId, kind, busy, (id) => this.pickPairUser(id))}
      ${needed.replace ? box("replace", PAIR_REPLACE_LABEL, "ws-pair-replace") : nothing}
      ${needed.remote ? box("remote", pairExpectLabel(kind), "ws-pair-expect") : nothing}
      ${p.error ? html`<div class="hint err" role="alert">${p.error}</div>` : nothing}
      <div class="ws-pair-foot">
        ${notThis}
        <span class="ws-pair-gap"></span>
        <button class="small ws-go ws-pair-go" ?disabled=${busy || !ready} title=${why}
          @click=${() => void this.confirmPair()}>${p.busy === "confirm" ? "Pairing…" : pairGoLabel(kind)}</button>
      </div>`;
  }

  /**
   * The QR mode: the code on a white tile in a dark well, a bar under it
   * that runs down with its time, and beside it the steps on the iPhone,
   * whose iPhone it is, and Replace (both for an administrator only, behind
   * More options for Replace). Before a code shows, the well holds
   * Show QR code (or "Making…" while one is made).
   */
  private renderQr() {
    const o = this.offer;
    const open = o.open;
    const busy = o.busy !== undefined;
    const picked = pairPersonPicked(o.users, o.userId);
    const why = !o.usersRead ? "Reading the people in Home Assistant…"
      : !picked ? "Choose a person first"
      : "Make a QR code the iPhone can scan to pair";
    const left = open === undefined ? 0 : Math.max(0, open.expiresAt - Date.now());
    const share = open?.lasts ? Math.min(1, left / open.lasts) : 1;
    const toCode = html`<button type="button" class="ghost ws-pair-switch" ?disabled=${this.busy}
        @click=${() => this.choose("iphone", "code")}>${uiIcon("keyboard")}<span>${PAIR_TO_CODE_TEXT}</span></button>`;
    return html`<h3 class="ws-pair-title">${PAIR_QR_TITLE}</h3>
      <div class="ws-qr-wrap">
        <div class="ws-qr-well ${open === undefined ? "empty" : ""}">
          ${open === undefined
            ? html`<span class="ws-qr-ghost" aria-hidden="true">${uiIcon("qr")}</span>
                <span class="ws-qr-msg">${o.expired ? "This code ran out." : !o.usersRead ? "Getting ready…" : !picked ? "Choose whose iPhone it is." : busy ? "Making a code…" : "No code showing."}</span>
                <button class="small ws-go ws-qr-show" ?disabled=${busy || !o.usersRead || !picked} title=${why}
                  @click=${() => void this.showOffer()}>${busy ? "Making…" : PAIR_SHOW_QR_TEXT}</button>`
            : html`<div class="ws-qr">
                  <svg viewBox=${`0 0 ${open.picture.size} ${open.picture.size}`} role="img" aria-label="QR code for pairing an iPhone"
                    shape-rendering="crispEdges"><rect width=${open.picture.size} height=${open.picture.size} fill="#fff"></rect><path d=${open.picture.path} fill="#000"></path></svg>
                </div>
                <span class="ws-qr-time" aria-hidden="true"><i style=${`width:${(share * 100).toFixed(1)}%`}></i></span>
                <span class="hint keep ws-qr-count" role="timer">${pairCountdownText(left / 1000)}</span>`}
        </div>
        <div class="ws-qr-side">
          ${this.renderQrSteps(o, picked)}
          ${!mayPairForOthers(this.hass?.user) ? nothing
            : this.qrMore || o.replace
            ? html`<label class="field check ws-qr-replace"><span>${PAIR_QR_REPLACE_LABEL}</span>
                  <input type="checkbox" .checked=${live(o.replace)} ?disabled=${!o.usersRead}
                    @change=${(e: Event) => this.setOfferReplace((e.target as HTMLInputElement).checked)} /></label>
                <div class="hint keep ws-qr-replace-hint">${PAIR_QR_REPLACE_HINT}</div>`
            : html`<button type="button" class="link ws-qr-more" aria-expanded="false"
                @click=${() => { this.qrMore = true; this.update(); }}>${PAIR_MORE_TEXT}${uiIcon("chevron")}</button>`}
          ${open === undefined || !pairOnIPhone(globalThis.navigator?.userAgent) ? nothing
            : html`<a class="ws-qr-open" href=${open.url} title="For this page open on the iPhone itself">${PAIR_OPEN_APP_TEXT}${uiIcon("right")}</a>`}
        </div>
      </div>
      ${o.expired ? html`<div class="hint warn" role="status">${PAIR_QR_EXPIRED_TEXT}</div>` : nothing}
      ${o.done ? html`<div class="hint keep ws-pair-done" role="status">${o.done}</div>` : nothing}
      ${o.error ? html`<div class="hint err" role="alert">${o.error}</div>` : nothing}
      ${this.renderFoot(toCode)}`;
  }

  /** The QR mode's steps. When the administrator is asked whose iPhone it
   * is, that comes first, as step 1 with its menu, lit until someone is
   * picked; the steps on the iPhone follow, faint until then, since no code
   * shows before it. Otherwise the steps on the iPhone alone. */
  private renderQrSteps(o: OfferState, picked: boolean) {
    const menu = this.renderUserMenu(o.users, o.userId, "iphone", false, (id) => this.pickOfferUser(id));
    if (menu === nothing) return this.steps(PAIR_QR_STEPS);
    return html`<ol class="ws-pair-steps">
        <li class="ws-qr-who ${picked ? "" : "next"}"><b aria-hidden="true">1</b><div class="ws-qr-who-menu">${menu}</div></li>
        ${PAIR_QR_STEPS.map((line, i) => html`<li class=${picked ? "" : "later"}><b aria-hidden="true">${i + 2}</b><span>${line}</span></li>`)}
      </ol>`;
  }

  /** "Whose watch is this?", for an administrator: the Home Assistant users,
   * each with its account type, the administrator at the card first. With
   * more than one, nobody is picked until the administrator picks (a known
   * device starts on its owner). Left out for anyone else, with one person
   * to choose from, or when the integration's confirm takes no user. */
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

  /** Under the device's box: a warning when it asked from an address
   * outside the home network. */
  private renderRemoteWarning(found: PairLookupFound, kind: PairDeviceKind) {
    const warning = pairRemoteWarning(found.remote, kind);
    return warning === undefined ? nothing : html`<div class="hint warn">${warning}</div>`;
  }
}

/** What Home's dialog shows once a watch is paired: the panel's own facts
 * about it, worked out by the panel (`pair-flow.ts` holds the words), and
 * where each step goes. */
export interface PairNextView {
  /** The watch's name, as Home names it. */
  name: string;
  /** Its kind, app and paired iPhone, then whose it is (`pairedFactsLine`). */
  facts: string;
  /** Home's own sync word for it (`pairNextStatus`), when there is one. */
  status?: { state: "synced" | "waiting" | "rejected"; label: string };
  /** The watch on its stage, as Home draws it. */
  art: TemplateResult;
  /** The Pages screen on this watch, for New page's link. */
  pagesHref: string;
  onNewPage: (e: MouseEvent) => void;
  /** The two addresses the watch uses (`device-addresses.ts`), once they are
   * in, with Change to edit them in place. `editor` is the open form. */
  addresses?: { local: string; remote: string; editor?: TemplateResult; onEdit: () => void };
  onComplication: () => void;
  onAnother: () => void;
  onDone: () => void;
}

/**
 * "<name> is paired.", then What next: make a first page (a green New page
 * that goes to the Pages screen on this watch) and open the app on the
 * watch, with Home's sync word beside it when Home has one. Once the
 * watch's addresses are in, a third step shows the two it will use, with
 * Change opening the address form in place. The foot links
 * out to the setup guide, quietly to the Complications tab, and offers Pair
 * another device and Done. The watch stands on a stage above, with an
 * outlined green Paired.
 */
export function renderPairNext(v: PairNextView): TemplateResult {
  return html`<div class="pair-next">
      <div class="pair-next-hero">
        <span class="pair-next-stage" aria-hidden="true">${v.art}</span>
        <span class="pair-next-chip">${uiIcon("check")}<span>Paired</span></span>
        <button class="icon pair-next-close" title="Close (Escape)" aria-label="Close" @click=${v.onDone}>${uiIcon("close")}</button>
      </div>
      <div class="pair-next-body">
        <div class="pair-next-head" role="status">
          <h2>${pairedHeadline(v.name)}</h2>
          ${v.facts ? html`<p>${v.facts}</p>` : nothing}
        </div>
        <h3 class="pair-next-title">${PAIR_NEXT_TITLE}</h3>
        <ol class="pair-next-steps">
          <li class="first">
            <b class="pair-next-n" aria-hidden="true">1</b>
            <div class="pair-next-t"><b>${PAIR_NEXT_PAGE.title}</b><span>${PAIR_NEXT_PAGE.line}</span></div>
            <a class="pair-next-btn go" href=${v.pagesHref} @click=${v.onNewPage}>${uiIcon("plus")}<span>${PAIR_NEXT_PAGE.action}</span></a>
          </li>
          <li>
            <b class="pair-next-n" aria-hidden="true">2</b>
            <div class="pair-next-t"><b>${PAIR_NEXT_OPEN.title}</b><span>${PAIR_NEXT_OPEN.line}</span></div>
            ${v.status === undefined ? nothing
              : html`<span class="pair-next-state ${v.status.state}"><i aria-hidden="true"></i>${v.status.label}</span>`}
          </li>
          ${v.addresses === undefined ? nothing : html`<li class="pair-next-addr">
            <b class="pair-next-n" aria-hidden="true">3</b>
            <div class="pair-next-t"><b>${PAIR_NEXT_ADDRESSES.title}</b>
              ${v.addresses.editor ? nothing : html`<span>${PAIR_NEXT_ADDRESSES.local}: ${v.addresses.local}</span>
                <span>${PAIR_NEXT_ADDRESSES.remote}: ${v.addresses.remote}</span>`}</div>
            ${v.addresses.editor ? html`<div class="pair-next-form">${v.addresses.editor}</div>`
              : html`<button type="button" class="pair-next-btn" @click=${v.addresses.onEdit}>${PAIR_NEXT_ADDRESSES.action}</button>`}
          </li>`}
        </ol>
        <div class="pair-next-foot">
          <a class="pair-next-guide" href=${PAIR_SETUP_GUIDE_URL} target="_blank" rel="noopener noreferrer">${PAIR_NEXT_GUIDE_TEXT}</a>
          <button type="button" class="pair-next-quiet" @click=${v.onComplication}>${PAIR_NEXT_COMPLICATION_TEXT}</button>
          <span class="pair-next-gap"></span>
          <button type="button" class="pair-next-btn" @click=${v.onAnother}>${PAIR_NEXT_ANOTHER_TEXT}</button>
          <button type="button" class="pair-next-btn" @click=${v.onDone}>${PAIR_NEXT_DONE_TEXT}</button>
        </div>
      </div>
    </div>`;
}

/** What next's look: the watch on a neutral lit stage the width of the
 * dialog, the headline, then the steps as outlined rows, the first lit
 * green since it is the one to do now. Buttons are outlined: green for New
 * page, a neutral hairline for the rest; the guide is a blue link out, the
 * complication link quieter still. The rows wrap their button under the
 * words on a phone. */
const pairNextStyles = css`
  .pair-next { display: flex; flex-direction: column; min-height: 0; overflow: auto; border-radius: inherit; }
  .pair-next-hero {
    position: relative; flex: none; display: grid; place-items: center; height: 176px; border-bottom: 1px solid var(--wa-line);
    background: linear-gradient(180deg, color-mix(in srgb, var(--wa-ink) 8%, var(--wa-bg)) 0%, var(--wa-bg) 85%);
  }
  .pair-next-stage { display: grid; }
  .pair-next-stage svg.ha-art { width: auto; height: 136px; }
  .pair-next-chip {
    position: absolute; top: 12px; left: 12px; display: inline-flex; align-items: center; gap: 5px; padding: 3px 10px;
    border-radius: 999px; border: 1px solid var(--wa-green); color: var(--wa-green); font-size: 12px; font-weight: 500;
  }
  .pair-next-chip svg.ui-icon { width: 13px; height: 13px; }
  .pair-next-hero > button.icon.pair-next-close { position: absolute; top: 8px; right: 8px; width: 30px; height: 30px; }
  .pair-next-hero > button.icon.pair-next-close svg.ui-icon { width: 16px; height: 16px; }
  .pair-next-body { display: flex; flex-direction: column; gap: 14px; padding: 18px 16px 16px; }
  .pair-next-head h2 { margin: 0; font-size: 20px; font-weight: 500; letter-spacing: -.01em; line-height: 1.25; overflow-wrap: anywhere; }
  .pair-next-head p { margin: 4px 0 0; font-size: 13px; line-height: 1.4; color: var(--wa-muted); overflow-wrap: anywhere; }
  .pair-next-title { margin: 4px 0 -4px; font-size: 11px; font-weight: 500; letter-spacing: .1em; text-transform: uppercase; color: var(--wa-ink); }
  .pair-next-steps { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 10px; }
  .pair-next-steps li {
    display: flex; flex-wrap: wrap; align-items: center; gap: 10px 12px; padding: 12px 14px; border-radius: 12px;
    border: 1px solid var(--wa-line-strong); background: var(--wa-card);
  }
  .pair-next-steps li.first { border-color: color-mix(in srgb, var(--wa-green) 45%, var(--wa-line-strong)); }
  .pair-next-n {
    flex: none; align-self: flex-start; width: 22px; height: 22px; box-sizing: border-box; border-radius: 50%; display: grid; place-items: center;
    border: 1px solid var(--wa-line-strong); font-size: 11px; font-weight: 500; color: var(--wa-muted); font-variant-numeric: tabular-nums;
  }
  li.first .pair-next-n { border-color: var(--wa-green); color: var(--wa-ink); }
  .pair-next-t { flex: 1 1 220px; min-width: 0; display: flex; flex-direction: column; gap: 3px; }
  .pair-next-t b { font-size: 14px; font-weight: 500; }
  .pair-next-t span { font-size: 13px; line-height: 1.45; color: var(--wa-muted); overflow-wrap: anywhere; }
  .pair-next-form { flex: 1 1 100%; min-width: 0; }
  .pair-next-state { flex: none; display: inline-flex; align-items: center; gap: 6px; font-size: 12px; color: var(--wa-muted); }
  .pair-next-state i { width: 7px; height: 7px; border-radius: 50%; background: var(--wa-muted); }
  .pair-next-state.synced { color: var(--wa-green); }
  .pair-next-state.synced i { background: var(--wa-green); }
  .pair-next-state.waiting { color: var(--wa-amber); }
  .pair-next-state.waiting i { background: var(--wa-amber); }
  .pair-next-state.rejected { color: var(--error-color); }
  .pair-next-state.rejected i { background: var(--error-color); }
  a.pair-next-btn, button.pair-next-btn {
    display: inline-flex; align-items: center; gap: 6px; box-sizing: border-box; height: 32px; padding: 0 13px; border-radius: 8px;
    font: inherit; font-size: 12.5px; font-weight: 500; cursor: pointer; white-space: nowrap; text-decoration: none;
    color: var(--wa-ink); background: var(--wa-card); border: 1px solid var(--wa-line-strong);
  }
  a.pair-next-btn.go { border-color: var(--wa-green); }
  a.pair-next-btn:hover, button.pair-next-btn:hover { background: var(--wa-hover); }
  a.pair-next-btn:focus-visible, button.pair-next-btn:focus-visible, .pair-next-foot a:focus-visible, button.pair-next-quiet:focus-visible {
    outline: none; box-shadow: var(--wa-ring);
  }
  .pair-next-btn svg.ui-icon { width: 14px; height: 14px; }
  .pair-next-foot { display: flex; flex-wrap: wrap; align-items: center; gap: 10px 14px; padding-top: 14px; border-top: 1px solid var(--wa-line); }
  .pair-next-gap { flex: 1 1 0; }
  a.pair-next-guide { font-size: 13px; color: var(--wa-hue-blue); text-decoration: none; }
  a.pair-next-guide:hover { text-decoration: underline; }
  button.pair-next-quiet { padding: 0; border: 0; background: none; font: inherit; font-size: 13px; color: var(--wa-muted); cursor: pointer; }
  button.pair-next-quiet:hover { color: var(--wa-ink); text-decoration: underline; }
`;

/** The card's own rules, wherever it is drawn. Each step under a small
 * capitals title. The choice as two large outlined answers that light green
 * under the pointer, side by side, one above the other on a phone. The
 * steps on the device numbered in small outlined rounds. The code box large
 * and centered, spaced out so the six characters read one by one, with Look
 * up beside it. A found device in a sunken box. The QR code sits on white
 * with its quiet zone, dark on light in either theme, which is what a phone
 * camera reads best, in a sunken well with a bar under it that runs down
 * with its time; the steps and the choices go beside it, or under it when
 * the card is narrow. A foot under a hairline: Back and the way across.
 * The step's main action is outlined green, every other button a neutral
 * hairline or none. */
export const pairCardStyles = css`
  .ws-pair .ws-pair-title {
    margin: 2px 0 12px; font-size: 11px; font-weight: 500; letter-spacing: .1em; text-transform: uppercase; color: var(--wa-ink);
  }
  .ws-pair-choices { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(200px, 100%), 1fr)); gap: 12px; }
  .ws-pair button.ws-pair-choice {
    display: flex; flex-direction: column; align-items: flex-start; gap: 8px; min-height: 148px; box-sizing: border-box; padding: 16px;
    border-radius: 12px; border: 1px solid var(--wa-line-strong); background: var(--wa-card); color: var(--wa-ink);
    font: inherit; text-align: left; cursor: pointer; transition: border-color .12s ease-out, background-color .12s ease-out;
  }
  .ws-pair button.ws-pair-choice:hover { border-color: var(--wa-green); background: var(--wa-hover); }
  .ws-pair button.ws-pair-choice:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .ws-pair button.ws-pair-choice svg.ui-icon { width: 28px; height: 28px; margin-bottom: 4px; color: var(--wa-green); }
  .ws-pair button.ws-pair-choice.iphone svg.ui-icon { color: var(--wa-hue-blue); }
  .ws-pair button.ws-pair-choice b { font-size: 15px; font-weight: 500; }
  .ws-pair button.ws-pair-choice span { font-size: 13px; line-height: 1.45; color: var(--wa-muted); overflow-wrap: anywhere; }
  .ws-pair .hint.ws-pair-note { margin: 12px 0 0; }
  .ws-pair-foot {
    display: flex; flex-wrap: wrap; align-items: center; gap: 8px; margin-top: 16px; padding-top: 12px; border-top: 1px solid var(--wa-line);
  }
  .ws-pair-gap { flex: 1 1 0; }
  .ws-pair-foot button.ghost { white-space: normal; text-align: left; }
  .ws-pair-foot button.ghost svg.ui-icon { width: 14px; height: 14px; flex: none; }
  .ws-pair button.small.ws-go { border: 1px solid var(--wa-green); background: var(--wa-card); color: var(--wa-ink); font-weight: 500; }
  .ws-pair button.small.ws-go:hover:not(:disabled) { border-color: var(--wa-green); background: var(--wa-hover); }
  .ws-pair-foot button.small.ws-go { min-height: 32px; padding: 0 14px; border-radius: 8px; }
  .ws-pair-found {
    display: flex; align-items: center; gap: 14px; padding: 14px; margin-bottom: 8px; border-radius: 12px;
    border: 1px solid var(--wa-line-strong); background: color-mix(in srgb, var(--wa-bg) 45%, var(--wa-card));
  }
  .ws-pair-found-art {
    flex: none; width: 48px; height: 56px; box-sizing: border-box; border-radius: 12px; display: grid; place-items: center;
    border: 1px solid var(--wa-line-strong); color: var(--wa-muted);
  }
  .ws-pair-found-art svg.ui-icon { width: 26px; height: 26px; }
  .ws-pair-found-t { min-width: 0; display: flex; flex-direction: column; gap: 3px; font-size: 13px; color: var(--wa-muted); overflow-wrap: anywhere; }
  .ws-pair-found-t b { font-size: 15px; font-weight: 500; color: var(--wa-ink); }
  .ws-pair-steps { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 9px; }
  .ws-pair-steps li { display: flex; align-items: flex-start; gap: 10px; font-size: 12.5px; line-height: 1.4; color: var(--wa-ink); }
  .ws-pair-steps b {
    flex: none; width: 20px; height: 20px; box-sizing: border-box; border-radius: 50%; display: grid; place-items: center;
    border: 1px solid var(--wa-line-strong); font-size: 10.5px; font-weight: 500; color: var(--wa-muted); font-variant-numeric: tabular-nums;
  }
  .ws-pair-steps span { min-width: 0; padding-top: 1px; overflow-wrap: anywhere; }
  /* Whose iPhone it is, as the QR mode's first step: its menu fills the
     line, its number is lit until someone is picked, and the steps after it
     wait faint until then. */
  .ws-qr-who-menu { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 6px; }
  .ws-qr-who-menu > .field.ws-pair-user { display: flex; flex-direction: column; align-items: stretch; gap: 6px; }
  .ws-qr-who-menu > .field.ws-pair-user > span { padding-top: 1px; font-size: 12.5px; color: var(--wa-ink); }
  .ws-qr-who-menu > .hint { margin: 0; }
  .ws-pair-steps li.next b { border-color: color-mix(in srgb, var(--wa-hue-green) 70%, var(--wa-card)); color: var(--wa-green); }
  .ws-pair-steps li.later { opacity: .55; }
  .ws-pair-entry { display: flex; justify-content: center; margin: 16px 0 8px; }
  .ws-pair-row { display: flex; align-items: stretch; gap: 8px; flex-wrap: nowrap; min-width: 0; }
  .ws-pair input.ws-pair-code {
    width: 200px; max-width: 100%; height: 44px; box-sizing: border-box; padding: 0 12px; border-radius: 10px;
    font-size: 22px; letter-spacing: .3em; text-align: center; text-transform: uppercase;
  }
  .ws-pair-row > button.small { flex: none; height: 44px; padding: 0 16px; border-radius: 10px; }
  .ws-qr-wrap { display: flex; flex-wrap: wrap; align-items: flex-start; gap: 16px 20px; margin: 2px 0 4px; }
  .ws-qr-well {
    flex: 0 0 232px; max-width: 100%; box-sizing: border-box; display: flex; flex-direction: column; align-items: center; gap: 10px;
    padding: 14px; border-radius: 14px; border: 1px solid var(--wa-line-strong);
    background: color-mix(in srgb, var(--wa-bg) 55%, var(--wa-card));
  }
  .ws-qr-well.empty { min-height: 262px; justify-content: center; text-align: center; }
  .ws-qr-ghost { display: grid; color: var(--wa-line-strong); }
  .ws-qr-ghost svg.ui-icon { width: 56px; height: 56px; }
  .ws-qr-msg { font-size: 12px; color: var(--wa-muted); }
  .ws-pair .ws-qr {
    width: 100%; aspect-ratio: 1; border-radius: 10px; overflow: hidden; background: #fff;
    box-shadow: 0 0 0 1px color-mix(in srgb, var(--wa-ink) 12%, transparent);
  }
  .ws-pair .ws-qr svg { display: block; width: 100%; height: 100%; }
  .ws-qr-time { align-self: stretch; height: 3px; border-radius: 2px; overflow: hidden; background: var(--wa-line-strong); }
  .ws-qr-time i { display: block; height: 100%; border-radius: inherit; background: var(--wa-green); transition: width .9s linear; }
  .ws-pair .hint.ws-qr-count { margin: -4px 0 0; font-size: 11.5px; font-variant-numeric: tabular-nums; }
  .ws-qr-side { flex: 1 1 220px; min-width: 0; display: flex; flex-direction: column; gap: 14px; }
  .ws-qr-side > .field.ws-pair-user { display: flex; flex-direction: column; align-items: stretch; gap: 6px; }
  .ws-qr-side > .field.ws-pair-user > span { font-size: 12px; color: var(--wa-muted); }
  .ws-qr-side > .hint { margin: -8px 0 0; }
  .ws-qr-side > .field.check { display: flex; flex-direction: row-reverse; justify-content: flex-end; align-items: center; gap: 8px; font-size: 12.5px; }
  .ws-qr-side > .hint.ws-qr-replace-hint { margin: -10px 0 0 34px; font-size: 11.5px; }
  .ws-pair button.ws-qr-more {
    display: inline-flex; align-items: center; gap: 4px; align-self: flex-start; padding: 0; border: 0; background: none;
    font: inherit; font-size: 12px; color: var(--wa-muted); cursor: pointer;
  }
  .ws-pair button.ws-qr-more:hover { color: var(--wa-ink); }
  .ws-pair button.ws-qr-more svg.ui-icon { width: 12px; height: 12px; }
  .ws-pair a.ws-qr-open { display: inline-flex; align-items: center; gap: 4px; align-self: flex-start; font-size: 12.5px; color: var(--wa-accent); text-decoration: none; }
  .ws-pair a.ws-qr-open:hover { text-decoration: underline; }
  .ws-pair a.ws-qr-open svg.ui-icon { width: 13px; height: 13px; }
  .ws-pair .hint.ws-pair-done { color: var(--wa-green); font-weight: 600; }

  ${pairNextStyles}
`;
