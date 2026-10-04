// Smart pages in the side column (part 3f batch 3): the Page card's smart
// rows (the Smart Page switch with the phone's convert question, Updates,
// Tile Size, Show labels, Sort order), and the Rules card that stands where
// the Tile card would: a chip per rule, the Add Domain dialog, the selected
// rule's rows, its Header, and its per-domain style through the tile
// settings sections.
//
// `<wa-page-editor>` calls `renderSmartPageRows` from its Page card and
// `renderSmartRulesCard` above it on a smart page, and puts
// `smartSettingsStyles` in its sheet. Every edit goes through `commit` with a
// writer of `smart-model.ts`, read against the document as it is when it
// commits: each action is one undo step, a run of typing in one field one
// step.
//
// The phone's words come from `tile-smart.json`, which the Swift side
// writes. The panel has rows and buttons the phone lacks, and their words
// are the panel's own, written here: the card's "Rules" heading and strip
// label, "Header", "Mode", the "N entity"/"N entities" count and the
// badge's "Entities", "Columns" and "Rows" on the size boxes, the heading's
// "Up", "Down", "Reset" and "Delete" with their tooltips, "Size", "Search",
// the Resolve tooltip, the pick's "(not found)", "No ... in Home
// Assistant" and "N more" lines, the hints under the boxes ("Empty is ...",
// "Empty takes the page's tile size"), the refusals, "Added" and its
// reason (`SMART_PRESET_ADDED_REASON`) on Add Domain, and the chip
// tooltips. A new word goes in the table when the phone shows it too.
//
// The per-domain style edits a stand-in tile (`smartStyleStandIn`): a host
// whose document is the stand-in, whose `apply` writes the keys a setter
// changed back into the rule (`applySmartStyleStandIn`), and whose
// `domainStyle` flag makes the tile sections leave out every row a rule
// cannot hold.
//
// Plan: app repo docs/pages_in_home_assistant_step3.md, "3f batch 3 build
// contract".

import { css, html, nothing, type TemplateResult } from "lit";
import { live } from "lit/directives/live.js";
import { checkField, colorField, numberField, segField, sliderField, textField } from "../editors.js";
import { uiIcon } from "../ui-icons.js";
import { type TileSettingsHost, type WatchPagesEditorHost, extendHost } from "./editor-host.js";
import { sectionOpen, setSectionOpen } from "./fold-memory.js";
import type { WatchPagesApplyOptions } from "./draft.js";
import { sameWatchId } from "./edit.js";
import { type JsonObject, type WatchPage, type WatchPageTile, type WatchPagesDocument, isJsonObject, watchPagesOf } from "./model.js";
import { watchPageSwatchTheme } from "./page-settings-model.js";
import {
  type WatchSmartConfig,
  type WatchSmartPreset,
  type WatchSmartRule,
  WATCH_SMART,
  WATCH_SMART_HEADER_SIZE_RANGE,
  WATCH_SMART_PAGE_SETTERS,
  WATCH_SMART_SPAN_RANGE,
  addSmartRule,
  applySmartStyleStandIn,
  convertToSmartPage,
  deleteSmartRule,
  disableSmartPage,
  moveSmartRuleBy,
  parseSmartNumber,
  readSmartConfig,
  resetSmartRule,
  setSmartRuleActiveWhen,
  setSmartRuleEntityIds,
  setSmartRuleHeader,
  setSmartRuleHeaderColor,
  setSmartRuleHeaderGlow,
  setSmartRuleHeaderLabel,
  setSmartRuleHeaderSize,
  setSmartRuleInvert,
  setSmartRuleMaxValue,
  setSmartRuleMode,
  setSmartRulePlayingOnly,
  setSmartRuleSize,
  setSmartRuleSpan,
  setSmartSortOrder,
  setSmartTileColSpan,
  setSmartTileRowSpan,
  setSmartTileShowLabel,
  setSmartTileSize,
  smartConvertTileCount,
  smartCountBadge,
  smartDomainInfo,
  smartDomainName,
  smartDuplicateDomainNote,
  smartFriendlyName,
  smartMaxValueLabel,
  smartMaxValueText,
  smartPresetAdded,
  smartRuleAfterDelete,
  smartRuleName,
  smartRulePlace,
  smartRuleUnresolved,
  smartStandInTile,
  smartStyleStandIn,
  smartSyntheticPage,
  smartWord,
  toggleSmartRuleDeviceClass,
  withResolvedRule,
} from "./smart-model.js";
import { commit, linkButton, menuField, reasonOf, renderTileSettings, swatchRow, typed, typedNumber, typingField } from "./tile-settings.js";
import { watchColorEnds, watchColorRefusal, watchCustomBoxColor, watchDomainStyleSections, watchWholeRefusal } from "./tile-settings-options.js";
import { watchAddThemeOf, watchThemeDisplayName, watchThemeRoleColors, watchThemeSwatches } from "./tile-new.js";

/** Every `uiState` key of this module starts with this. */
const KEY = "smart";
/** The open question: `{kind, pageId}`. */
const ASK = `${KEY}:ask`;

const W = (name: string, values?: Readonly<Record<string, string | number>>): string => smartWord(name, values);

// ── the table's parts no reader of the model needs ───────────────────────

function objectAt(value: unknown, key: string): JsonObject {
  return isJsonObject(value) && isJsonObject(value[key]) ? value[key] : {};
}

function listAt(value: unknown, key: string): JsonObject[] {
  const list = isJsonObject(value) ? value[key] : undefined;
  return Array.isArray(list) ? list.filter(isJsonObject) : [];
}

const str = (v: unknown): string => (typeof v === "string" ? v : "");

/** The Updates switches: key, words, and whether Live Updates hides it. */
const PAGE_SWITCHES = listAt(objectAt(WATCH_SMART.raw, "page"), "switches").flatMap((s) => {
  const key = str(s.key);
  return key === "" ? [] : [{ key, label: str(s.label), detail: str(s.detail), always: s.shownWhen === "always" }];
});

/** The two sort orders with their words. */
const SORT_ORDERS = listAt(objectAt(WATCH_SMART.raw, "page"), "sortOrders").map((o) => ({ value: str(o.value), label: str(o.label) }));

/** The rule's two modes with their words. */
const MODES = listAt(objectAt(objectAt(WATCH_SMART.raw, "domains"), "rows"), "modes").map((m) => [str(m.value), str(m.label)] as [string, string]);

/** The color role and chip symbol of a domain the table does not list. */
const OTHER = objectAt(objectAt(WATCH_SMART.raw, "domains"), "other");
const OTHER_ROLE = str(OTHER.colorRole) || "entitySensor";
const OTHER_CHIP_ICON = str(OTHER.chipIcon) || "questionmark.circle";

/** Why an Add Domain card is off. */
export const SMART_PRESET_ADDED_REASON = "Added: a rule on this page has this domain and filter.";

// ── hosts ────────────────────────────────────────────────────────────────

const NO_TILE: WatchPageTile = Object.freeze({}) as WatchPageTile;

/** The page's smart rows, as the shared fields take a host: their typed
 * text and refusals kept under the page. */
function pageScope(host: WatchPagesEditorHost): TileSettingsHost {
  return extendHost(host, { tileId: () => `smart-page-${host.pageId}`, tile: () => NO_TILE });
}

/** One rule's rows, under the rule. */
function ruleScope(host: WatchPagesEditorHost, ruleId: string): TileSettingsHost {
  return extendHost(host, { tileId: () => `smart-rule-${ruleId}`, tile: () => NO_TILE });
}

/** A rule of the shown page as it is now, by id. */
function ruleNow(host: WatchPagesEditorHost, ruleId: string): WatchSmartRule | undefined {
  return readSmartConfig(host.page)?.rules.find((r) => sameWatchId(r.id, ruleId));
}

/**
 * The tile settings' host for a rule's style: the stand-in document (built
 * again only when the real one moved), the stand-in tile under the rule's id,
 * the `domainStyle` flag, and an `apply` that writes what a setter changed
 * on the stand-in back into the rule, as one step of the real draft. Every
 * other member is the page's host.
 */
export function smartStyleHost(host: WatchPagesEditorHost, ruleId: string): TileSettingsHost {
  const pageId = host.pageId;
  let seen: { document: WatchPagesDocument; standIn: WatchPagesDocument } | undefined;
  const standIn = (): WatchPagesDocument => {
    const document = host.document;
    if (seen?.document !== document) {
      const page = host.page;
      seen = { document, standIn: smartStyleStandIn(ruleNow(host, ruleId)?.raw ?? {}, pageId, page) };
    }
    return seen.standIn;
  };
  return extendHost(host, {
    document: standIn,
    page: () => watchPagesOf(standIn())[0] as WatchPage,
    tileId: () => ruleId,
    tile: () => smartStandInTile(standIn(), pageId, ruleId) ?? NO_TILE,
    domainStyle: () => true as const,
    apply: () => (next: WatchPagesDocument, options?: WatchPagesApplyOptions) =>
      host.apply(applySmartStyleStandIn(host.document, pageId, ruleId, next), options),
  }) as TileSettingsHost;
}

// ── shared pieces ────────────────────────────────────────────────────────

/** The color a rule of `domain` gets from the page's theme: the domain's
 * role, as an entity tile's add colors it (`tile-smart.json` `colorRole`),
 * solid. */
export function smartDomainColorHex(domain: string, page: WatchPage | undefined): string {
  const roles = watchThemeRoleColors(watchAddThemeOf(page));
  const role = smartDomainInfo(domain)?.colorRole || OTHER_ROLE;
  return roles[role] ?? roles[OTHER_ROLE] ?? "#CCD8E6";
}

/** The rule the Rules card shows, by index in `config.rules`: the selected
 * one, else the first, as on the phone; undefined with no rules. */
export function smartSelectedRuleIndex(config: WatchSmartConfig, ruleId: string | undefined): number | undefined {
  if (config.rules.length === 0) return undefined;
  const index = ruleId === undefined ? -1 : config.rules.findIndex((r) => sameWatchId(r.id, ruleId));
  return index >= 0 ? index : 0;
}

/** "1 rule", "3 rules". */
export function smartRuleCountWords(count: number): string {
  return count === 1 ? W("ruleCountOne") : W("ruleCountMany", { count });
}

/** The stage's facts for a smart page: "Smart page", the rule count, and
 * the page's title as the watch names it from its fill ("All Off", "3
 * Lights On", "5 Active"). Undefined for a page that is not smart. */
export function smartStageFacts(page: WatchPage, states: Parameters<typeof smartSyntheticPage>[1]): string[] | undefined {
  const config = readSmartConfig(page);
  if (config === undefined) return undefined;
  return ["Smart page", smartRuleCountWords(config.rules.length), String(smartSyntheticPage(page, states).switcherText ?? "")];
}

function chip(label: string, on: boolean, title: string, action: () => void, extra: TemplateResult | typeof nothing = nothing): TemplateResult {
  return html`<button type="button" class="pe-chip ${on ? "on" : ""}" aria-pressed=${on ? "true" : "false"} title=${title}
    @click=${action}>${extra}${label}</button>`;
}

/** A small text button on a rule's heading line. */
function actButton(label: string, title: string, disabled: boolean, action: () => void): TemplateResult {
  return html`<button type="button" class="link ts-link sm-act" title=${title} ?disabled=${disabled} @click=${action}>${label}</button>`;
}

/** A whole number box from 1 to 12, as batch 1's: a number outside is
 * refused with the reason under it, the stored value kept. `optional` lets
 * an empty box remove the key. */
function spanBox(
  sh: TileSettingsHost,
  setting: string,
  label: string,
  stored: number | undefined,
  write: (document: WatchPagesDocument, value: number | null) => WatchPagesDocument,
  optional?: { placeholder: string },
): TemplateResult {
  const { min, max } = WATCH_SMART_SPAN_RANGE;
  const shown = typedNumber(typed(sh, setting), stored);
  const set = (v: number | undefined) => {
    if (v === undefined) {
      if (optional !== undefined) commit(sh, setting, (d) => write(d, null), { typing: true });
      return;
    }
    commit(sh, setting, (d) => write(d, v), { typing: true, ...reasonOf(watchWholeRefusal(v, min, max)) });
  };
  return typingField(sh, setting, numberField(label, shown, set, {
    step: 1, min, max, ...(optional === undefined ? {} : { optional: true, placeholder: optional.placeholder }),
  }), stored);
}

// ── questions ────────────────────────────────────────────────────────────

type AskKind = "convert" | "add";

function askOf(host: WatchPagesEditorHost): AskKind | undefined {
  const ask = host.uiState.get(ASK) as { kind?: unknown; pageId?: unknown } | undefined;
  if (ask === undefined || typeof ask.pageId !== "string" || !sameWatchId(ask.pageId, host.pageId)) return undefined;
  return ask.kind === "convert" || ask.kind === "add" ? ask.kind : undefined;
}

function openAsk(host: WatchPagesEditorHost, kind: AskKind): void {
  host.uiState.set(ASK, { kind, pageId: host.pageId });
  host.requestUpdate();
}

/** The question is answered or dismissed: its state goes at once, and its
 * dialog (found from the pressed button) closes. */
function endAsk(host: WatchPagesEditorHost, target?: EventTarget | null): void {
  host.uiState.delete(ASK);
  const dialog = (target as { closest?: (s: string) => { close?: () => void } | null } | null | undefined)?.closest?.("dialog");
  dialog?.close?.();
  host.requestUpdate();
}

// ── the Page card's smart rows ───────────────────────────────────────────

/**
 * The Smart Page switch was pressed. Off makes the page a normal one at
 * once (undo brings it back). On with tiles on the page asks first, as the
 * phone does; on an empty page it converts at once.
 */
export function smartSwitchPressed(host: WatchPagesEditorHost, on: boolean): void {
  const sh = pageScope(host);
  if (!on) {
    commit(sh, "smartPage", (d) => disableSmartPage(d, host.pageId));
    host.selectSmartRule(undefined);
    host.requestUpdate();
    return;
  }
  const count = smartConvertTileCount(host.document, host.pageId);
  if (count === undefined || host.busy) {
    host.requestUpdate();
    return;
  }
  if (count === 0) {
    commit(sh, "smartPage", (d) => convertToSmartPage(d, host.pageId));
    return;
  }
  openAsk(host, "convert");
}

/** Convert in the question: the page made smart, its tiles gone. */
export function smartConvertConfirmed(host: WatchPagesEditorHost, target?: EventTarget | null): void {
  commit(pageScope(host), "smartPage", (d) => convertToSmartPage(d, host.pageId));
  host.selectSmartRule(undefined);
  endAsk(host, target);
}

/** The switch, and on a smart page its rows; the convert question when it
 * is open. */
export function renderSmartPageRows(host: WatchPagesEditorHost): TemplateResult {
  const config = readSmartConfig(host.page);
  const smart = config !== undefined;
  return html`
    <label class="pe-switch sm-switch" title=${W("smartPageDetail")}>
      <input type="checkbox" role="switch" .checked=${live(smart)} ?disabled=${host.busy}
        @change=${(e: Event) => smartSwitchPressed(host, (e.target as HTMLInputElement).checked)} />
      <span>${W("smartPage")}</span>
    </label>
    <p class="pe-muted sm-under">${config === undefined ? W("smartPageDetail") : `${W("smartPageActive")}: ${smartRuleCountWords(config.rules.length)}`}</p>
    ${config === undefined ? nothing : renderSmartPageSection(host, config)}
    ${askOf(host) === "convert" ? renderConvertAsk(host) : nothing}`;
}

function renderConvertAsk(host: WatchPagesEditorHost): TemplateResult {
  const count = smartConvertTileCount(host.document, host.pageId) ?? 0;
  const message = count === 1 ? W("convertMessageOne") : W("convertMessageMany", { count });
  return html`<dialog class="pe-ask sm-ask" aria-labelledby="sm-convert-title" @close=${() => endAsk(host)}>
    <h3 id="sm-convert-title">${W("convertTitle")}</h3>
    <p>${message}</p>
    <div class="pe-ask-foot">
      <button type="button" class="pe-btn" @click=${(e: Event) => endAsk(host, e.currentTarget)}>${W("cancel")}</button>
      <button type="button" class="pe-btn pe-primary pe-danger" @click=${(e: Event) => smartConvertConfirmed(host, e.currentTarget)}>${W("convert")}</button>
    </div>
  </dialog>`;
}

/** Open unless folded, this visit or an earlier one (`fold-memory.ts`). */
function isOpen(host: WatchPagesEditorHost, section: string): boolean {
  return sectionOpen(host.uiState, KEY, section);
}

/** A folding section in the tile settings' look. */
function fold(host: WatchPagesEditorHost, section: string, title: string, summary: string, body: () => TemplateResult): TemplateResult {
  const open = isOpen(host, section);
  const id = `sm-body-${section}`;
  return html`<section class="ts-sec" data-open=${open ? "true" : "false"}>
    <h4 class="ts-h">
      <button type="button" class="ts-fold" aria-expanded=${open ? "true" : "false"} aria-controls=${open ? id : nothing}
        @click=${() => { setSectionOpen(host.uiState, KEY, section, !open); host.requestUpdate(); }}>
        <span class="ts-title">${title}</span>
        ${open || summary === "" ? nothing : html`<span class="ts-sum">${summary}</span>`}
        <span class="ts-chev">${uiIcon("chevron")}</span>
      </button>
    </h4>
    ${open ? html`<fieldset class="ts-body sec-b" id=${id} ?disabled=${host.busy} aria-label=${title}>${body()}</fieldset>` : nothing}
  </section>`;
}

function renderSmartPageSection(host: WatchPagesEditorHost, config: WatchSmartConfig): TemplateResult {
  const sh = pageScope(host);
  const P = host.pageId;
  const summary = `${W("sizeSubtitle", { cols: config.tileColSpan, rows: config.tileRowSpan })}, ${config.liveUpdates ? PAGE_SWITCHES[0]?.label ?? "" : SORT_ORDERS.find((o) => o.value === config.sortOrder)?.label ?? ""}`;
  return html`<div class="ts-root sm-root">${fold(host, "page", W("smartPage"), summary, () => html`
    <div class="ts-sub-h"><span>${W("updates")}</span></div>
    <div class="hint">${W("updatesHelp")}</div>
    ${PAGE_SWITCHES.filter((s) => s.always || !config.liveUpdates).map((s) => {
      const value = (config as unknown as Record<string, unknown>)[s.key] === true;
      const setter = WATCH_SMART_PAGE_SETTERS[s.key] as ((d: WatchPagesDocument, p: string, v: boolean) => WatchPagesDocument) | undefined;
      return html`${checkField(s.label, value, (on) => commit(sh, s.key, (d) => (setter === undefined ? d : setter(d, P, on))))}
        <div class="hint ts-under">${s.detail}</div>`;
    })}
    <div class="ts-sub-h"><span>${W("tileSize")}</span></div>
    <div class="ts-chips" role="group" aria-label=${W("tileSize")}>
      ${WATCH_SMART.pageSizes.map((p) => chip(p.name, p.colSpan === config.tileColSpan && p.rowSpan === config.tileRowSpan,
        W("sizeSubtitle", { cols: p.colSpan, rows: p.rowSpan }), () => commit(sh, "tileSize", (d) => setSmartTileSize(d, P, p.colSpan, p.rowSpan))))}
    </div>
    ${spanBox(sh, "tileColSpan", "Columns", config.tileColSpan, (d, v) => (v === null ? d : setSmartTileColSpan(d, P, v)))}
    ${spanBox(sh, "tileRowSpan", "Rows", config.tileRowSpan, (d, v) => (v === null ? d : setSmartTileRowSpan(d, P, v)))}
    ${checkField(W("showLabels"), config.tileShowLabel, (on) => commit(sh, "tileShowLabel", (d) => setSmartTileShowLabel(d, P, on)))}
    ${menuField(W("sortOrder"), { options: SORT_ORDERS, selected: config.sortOrder }, (v) => commit(sh, "sortOrder", (d) => setSmartSortOrder(d, P, v)))}
  `)}</div>`;
}

// ── the Rules card ───────────────────────────────────────────────────────

/** The glyph of a rule: its style's icon, else the domain's, in its style's
 * color, else the domain's for the page theme. */
function ruleGlyph(host: WatchPagesEditorHost, rule: WatchSmartRule, size: number): TemplateResult | typeof nothing {
  const icon = rule.tileStyle?.icon || smartDomainInfo(rule.domain)?.icon || OTHER_CHIP_ICON;
  const ink = watchColorEnds(rule.tileStyle?.color)?.from ?? smartDomainColorHex(rule.domain, host.page);
  return host.icons.render(icon, size, ink) ?? nothing;
}

/** The Rules card of a smart page, or nothing for a page that is not one. */
export function renderSmartRulesCard(host: WatchPagesEditorHost): TemplateResult | typeof nothing {
  const config = readSmartConfig(host.page);
  if (config === undefined) return nothing;
  const index = smartSelectedRuleIndex(config, host.smartRuleId);
  const rule = index === undefined ? undefined : config.rules[index];
  const note = smartDuplicateDomainNote(config);
  return html`<div class="pe-card sm-rules">
    <h3>Rules</h3>
    ${note === undefined ? nothing : html`<p class="hint warn sm-note" role="note">${note}</p>`}
    <div class="sm-strip" role="group" aria-label="Rules">
      ${config.rules.map((r, i) => html`<button type="button" class="pe-chip sm-chip ${i === index ? "on" : ""}" aria-pressed=${i === index ? "true" : "false"}
        title=${r.domain} @click=${() => host.selectSmartRule(r.id)}><span class="sm-chip-glyph" aria-hidden="true">${ruleGlyph(host, r, 13)}</span>${smartRuleName(r)}</button>`)}
      <button type="button" class="pe-chip sm-add-btn ${config.rules.length === 0 ? "first" : ""}" aria-haspopup="dialog" ?disabled=${host.busy}
        @click=${() => openAsk(host, "add")}>${uiIcon("plus")}${W("addDomain")}</button>
    </div>
    ${rule === undefined || index === undefined
      ? html`<p class="pe-muted">${W("pickerIntro")}</p>`
      : renderRule(host, config, rule, index)}
    ${askOf(host) === "add" ? renderAddDomain(host, config) : nothing}
  </div>`;
}

/** A rule was deleted from its heading: the one now at its place is
 * selected, else the last, else none. */
export function smartRuleDeleted(host: WatchPagesEditorHost, ruleId: string, index: number): void {
  commit(ruleScope(host, ruleId), "delete", (d) => deleteSmartRule(d, host.pageId, ruleId));
  const config = readSmartConfig(host.page);
  host.selectSmartRule(config === undefined ? undefined : smartRuleAfterDelete(config, index));
}

function renderRule(host: WatchPagesEditorHost, config: WatchSmartConfig, rule: WatchSmartRule, index: number): TemplateResult {
  const rh = ruleScope(host, rule.id);
  const P = host.pageId;
  const R = rule.id;
  const badge = smartCountBadge(rule);
  const name = smartRuleName(rule);
  // Up and Down count the document's list, which can hold a rule the view
  // skips (one without a domain).
  const place = smartRulePlace(host.page, R);
  const first = place === undefined || place.index === 0;
  const last = place === undefined || place.index === place.count - 1;
  return html`
    <div class="sm-rule-h">
      <span class="sm-glyph" aria-hidden="true">${ruleGlyph(host, rule, 18)}</span>
      <span class="sm-rule-name">${name}</span>
      ${badge === undefined ? nothing : html`<span class="pe-badge sm-badge" title="Entities" aria-label=${`${badge} entities`}>${badge}</span>`}
      <span class="sm-acts">
        ${actButton("Up", `Move ${name} up`, host.busy || first, () => commit(rh, "move", (d) => moveSmartRuleBy(d, P, R, -1)))}
        ${actButton("Down", `Move ${name} down`, host.busy || last, () => commit(rh, "move", (d) => moveSmartRuleBy(d, P, R, 1)))}
        ${actButton("Reset", "The rule's look and filters back as its preset adds it. The mode, picks and device classes stay.", host.busy, () =>
          commit(rh, "reset", (d) => resetSmartRule(d, P, R, smartDomainColorHex(rule.domain, host.page))))}
        ${actButton("Delete", `Delete ${name}. Undo brings it back.`, host.busy, () => smartRuleDeleted(host, R, index))}
      </span>
    </div>
    <fieldset class="ts-body sec-b sm-body" ?disabled=${host.busy} aria-label=${name}>
      ${renderRuleRows(host, rh, rule)}
    </fieldset>
    <div class="ts-root sm-root">${fold(host, "header", "Header", headerSummary(rule), () => renderHeader(host, rh, rule))}</div>
    <div class="sm-style">${renderTileSettings(smartStyleHost(host, R), {
      sections: watchDomainStyleSections(smartDomainInfo(rule.domain)?.stateTask === true),
      size: { summary: () => sizeSummary(config, rule), body: () => renderRuleSize(host, rh, config, rule) },
    })}</div>`;
}

function renderRuleRows(host: WatchPagesEditorHost, rh: TileSettingsHost, rule: WatchSmartRule): TemplateResult {
  const P = host.pageId;
  const R = rule.id;
  const info = smartDomainInfo(rule.domain);
  const count = (rule.resolvedEntityIds ?? []).length;
  const maxText = typed(rh, "maxValue") ?? smartMaxValueText(rule);
  const writeMax = (v: string) => {
    const t = v.trim();
    const refused = t !== "" && parseSmartNumber(t) === undefined;
    commit(rh, "maxValue", (d) => setSmartRuleMaxValue(d, P, R, v), {
      typing: true,
      ...(refused ? { reason: "Use a number, like 20 or 0.5. The stored value stays until one is typed." } : {}),
    });
  };
  return html`
    ${segField("Mode", rule.mode, MODES, (v) => commit(rh, "mode", (d) => setSmartRuleMode(d, P, R, v, host.hass.states)))}
    ${rule.mode === "all"
      ? html`<div class="sm-line">
          ${smartRuleUnresolved(rule)
            ? html`<span class="sm-warn">${W("notResolved")}</span>`
            : html`<span>${count} ${count === 1 ? "entity" : "entities"}</span>`}
          ${linkButton(W("resolve"), "List the domain's entities from Home Assistant now. A save does it too.", () =>
            commit(rh, "resolve", (d) => withResolvedRule(d, P, R, host.hass.states)))}
        </div>`
      : html`<div class="ts-sub-h"><span>${W("entitiesSelected", { count: rule.entityIds.length })}</span></div>
        ${renderEntityPick(host, rh, rule)}`}
    ${info?.showWhen === undefined
      ? nothing
      : checkField(info.showWhen, rule.invertActive, (on) => commit(rh, "invert", (d) => setSmartRuleInvert(d, P, R, on)))}
    ${info?.playingOnly === true
      ? checkField(W("playingOnly"), rule.mediaPlayerPlayingOnly, (on) => commit(rh, "playingOnly", (d) => setSmartRulePlayingOnly(d, P, R, on)))
      : nothing}
    ${info !== undefined && info.deviceClasses.length > 0
      ? html`<div class="ts-sub-h"><span>${W("deviceClass")}</span></div>
        <div class="ts-chips" role="group" aria-label=${W("deviceClass")}>
          ${info.deviceClasses.map((c) => chip(c.label, rule.deviceClassFilter?.includes(c.value) === true, c.value, () =>
            commit(rh, "deviceClass", (d) => toggleSmartRuleDeviceClass(d, P, R, c.value))))}
        </div>`
      : nothing}
    ${info?.maxValue === true
      ? typingField(rh, "maxValue", textField(smartMaxValueLabel(rule), maxText, writeMax, { placeholder: W("noLimit") }))
      : nothing}
    ${info?.activeWhen === true
      ? typingField(rh, "activeWhen", textField(W("activeWhen"), typed(rh, "activeWhen") ?? rule.activeWhen ?? "", (v) =>
          commit(rh, "activeWhen", (d) => setSmartRuleActiveWhen(d, P, R, v), { typing: true }), { placeholder: info.activeWord }))
      : nothing}`;
}

/** The most entities the pick lists before asking for a search. */
const PICK_LIMIT = 150;

/**
 * A Specific rule's pick: the domain's entities in Home Assistant, narrowed
 * to the rule's device classes when it has any; the picked ones first in
 * pick order (one Home Assistant no longer has named so), then the rest by
 * name. A search box narrows a long list.
 */
function renderEntityPick(host: WatchPagesEditorHost, rh: TileSettingsHost, rule: WatchSmartRule): TemplateResult {
  const P = host.pageId;
  const R = rule.id;
  const states = host.hass.states;
  const prefix = `${rule.domain}.`;
  const filter = rule.deviceClassFilter ?? [];
  const classOf = (id: string) => states[id]?.attributes?.device_class;
  const ids = Object.keys(states).filter((id) => id.startsWith(prefix) && (filter.length === 0 || filter.includes(String(classOf(id) ?? ""))));
  const picked = rule.entityIds;
  const findKey = `${KEY}:find:${R.toUpperCase()}`;
  const query = String(host.uiState.get(findKey) ?? "").trim().toLowerCase();
  const name = (id: string) => smartFriendlyName(id, states);
  const rest = ids
    .filter((id) => !picked.includes(id))
    .filter((id) => query === "" || id.toLowerCase().includes(query) || name(id).toLowerCase().includes(query))
    .sort((a, b) => name(a).localeCompare(name(b), undefined, { sensitivity: "accent" }));
  const toggle = (id: string, on: boolean) => {
    const now = ruleNow(host, R)?.entityIds ?? [];
    commit(rh, "picks", (d) => setSmartRuleEntityIds(d, P, R, on ? [...now, id] : now.filter((x) => x !== id)));
  };
  const row = (id: string, on: boolean) =>
    checkField(Object.hasOwn(states, id) ? name(id) : `${id} (not found)`, on, (v) => toggle(id, v));
  return html`
    ${ids.length + picked.length > 12
      ? html`<input type="search" class="sm-find" placeholder="Search" aria-label="Search the entities" .value=${live(String(host.uiState.get(findKey) ?? ""))}
          @input=${(e: Event) => { host.uiState.set(findKey, (e.target as HTMLInputElement).value); host.requestUpdate(); }} />`
      : nothing}
    <div class="ap-list sm-pick" role="group" aria-label=${W("entitiesSelected", { count: picked.length })}>
      ${picked.map((id) => row(id, true))}
      ${rest.slice(0, PICK_LIMIT).map((id) => row(id, false))}
      ${ids.length === 0 && picked.length === 0 ? html`<div class="hint">No ${smartDomainName(rule.domain).toLowerCase()} in Home Assistant${filter.length > 0 ? " with these device classes" : ""}.</div>` : nothing}
      ${rest.length > PICK_LIMIT ? html`<div class="hint">${rest.length - PICK_LIMIT} more. Search to narrow the list.</div>` : nothing}
    </div>`;
}

// ── a rule's header ──────────────────────────────────────────────────────

function headerSummary(rule: WatchSmartRule): string {
  const style = WATCH_SMART.headerStyles.find((s) => s.value === rule.header)?.label ?? rule.header;
  return rule.header === "label" ? `${style}: ${rule.headerLabel ?? smartDomainName(rule.domain)}` : style;
}

function renderHeader(host: WatchPagesEditorHost, rh: TileSettingsHost, rule: WatchSmartRule): TemplateResult {
  const P = host.pageId;
  const R = rule.id;
  const { min, max, auto } = WATCH_SMART_HEADER_SIZE_RANGE;
  const size = typedNumber(typed(rh, "headerSize"), rule.headerLabelSize);
  const setSize = (v: number | undefined) =>
    commit(rh, "headerSize", (d) => setSmartRuleHeaderSize(d, P, R, v ?? null), { typing: true, ...(v === undefined ? {} : reasonOf(watchWholeRefusal(v, min, max))) });
  const glow = typedNumber(typed(rh, "headerGlow"), rule.headerGlow) ?? 0;
  const theme = watchPageSwatchTheme(host.page);
  const writeColor = (v: string | undefined, typing = false) => commit(rh, "headerColor", (d) => setSmartRuleHeaderColor(d, P, R, v), { typing });
  const custom = (v: string | undefined) => {
    const reason = watchColorRefusal(v);
    if (reason !== undefined || v === undefined) return commit(rh, "headerColor", (d) => d, { reason: reason ?? "Pick a color." });
    writeColor(v, true);
  };
  const lined = rule.header === "line" || rule.header === "label";
  return html`
    ${segField(W("style"), rule.header, WATCH_SMART.headerStyles.map((s) => [s.value, s.label] as [string, string]), (v) =>
      commit(rh, "header", (d) => setSmartRuleHeader(d, P, R, v)))}
    ${rule.header === "label"
      ? html`${typingField(rh, "headerLabel", textField(W("labelText"), typed(rh, "headerLabel") ?? rule.headerLabel ?? "", (v) =>
          commit(rh, "headerLabel", (d) => setSmartRuleHeaderLabel(d, P, R, v), { typing: true }), { placeholder: smartDomainName(rule.domain) }))}
        ${typingField(rh, "headerSize", numberField(W("textSize"), size, setSize, { step: 1, min, max, optional: true, placeholder: String(auto), unit: "pt" }), rule.headerLabelSize)}
        <div class="hint ts-under">Empty is ${auto} pt. Or ${min} to ${max}.</div>`
      : nothing}
    ${lined
      ? html`${typingField(rh, "headerGlow", sliderField(W("glow"), Math.round(glow * 100), (v) =>
          commit(rh, "headerGlow", (d) => setSmartRuleHeaderGlow(d, P, R, v / 100), { typing: true }), {
          min: 0, max: 100, step: 5, def: 0, unit: "%", format: (v) => (v <= 0 ? W("off") : W("percent", { value: Math.round(v) })),
        }), Math.round(rule.headerGlow * 100))}
        <div class="hint ts-under">${rule.headerGlow <= 0 ? W("off") : W("percent", { value: Math.round(rule.headerGlow * 100) })}</div>`
      : nothing}
    <div class="ts-sub-h"><span>${W("color")}</span></div>
    <div class="ts-swatch-row">${swatchRow(`${watchThemeDisplayName(theme)} colors`, watchThemeSwatches(theme, false), rule.headerColor, (v) => writeColor(v))}</div>
    ${typingField(rh, "headerColor", html`<div class="ts-no-alpha">${colorField("Custom", typed(rh, "headerColor") ?? watchCustomBoxColor(rule.headerColor), custom)}</div>`)}
    <div class="ts-after">${chip(W("colorDefault"), rule.headerColor === undefined, "No color of its own: the watch draws the header white", () => writeColor(undefined))}</div>`;
}

// ── a rule's size ────────────────────────────────────────────────────────

function sizeSummary(config: WatchSmartConfig, rule: WatchSmartRule): string {
  const cs = rule.tileStyle?.colSpan;
  const rs = rule.tileStyle?.rowSpan;
  if (cs === undefined && rs === undefined) return W("pageSize");
  return W("sizeSubtitle", { cols: cs ?? config.tileColSpan, rows: rs ?? config.tileRowSpan });
}

function renderRuleSize(host: WatchPagesEditorHost, rh: TileSettingsHost, config: WatchSmartConfig, rule: WatchSmartRule): TemplateResult {
  const P = host.pageId;
  const R = rule.id;
  const cs = rule.tileStyle?.colSpan;
  const rs = rule.tileStyle?.rowSpan;
  const page = W("sizeSubtitle", { cols: config.tileColSpan, rows: config.tileRowSpan });
  return html`
    <div class="ts-chips" role="group" aria-label="Size">
      ${chip(W("pageSize"), cs === undefined && rs === undefined, `The page's tile size, ${page}`, () => commit(rh, "size", (d) => setSmartRuleSize(d, P, R, undefined)))}
      ${WATCH_SMART.styleSizes.map((p) => chip(p.name, cs === p.colSpan && rs === p.rowSpan, W("sizeSubtitle", { cols: p.colSpan, rows: p.rowSpan }), () =>
        commit(rh, "size", (d) => setSmartRuleSize(d, P, R, { colSpan: p.colSpan, rowSpan: p.rowSpan }))))}
    </div>
    ${spanBox(rh, "colSpan", "Columns", cs, (d, v) => setSmartRuleSpan(d, P, R, "colSpan", v), { placeholder: String(config.tileColSpan) })}
    ${spanBox(rh, "rowSpan", "Rows", rs, (d, v) => setSmartRuleSpan(d, P, R, "rowSpan", v), { placeholder: String(config.tileRowSpan) })}
    <div class="hint ts-under">Empty takes the page's tile size, ${page}.</div>`;
}

// ── Add Domain ───────────────────────────────────────────────────────────

/** A preset was picked: the rule added at the end, resolved from Home
 * Assistant, selected, and the dialog closed. */
export function smartPresetPicked(host: WatchPagesEditorHost, preset: WatchSmartPreset, target?: EventTarget | null): void {
  const before = readSmartConfig(host.page)?.rules.length ?? 0;
  commit(pageScope(host), "addRule", (d) => addSmartRule(d, host.pageId, preset, smartDomainColorHex(preset.domain, host.page), host.hass.states));
  const rules = readSmartConfig(host.page)?.rules ?? [];
  if (rules.length > before) host.selectSmartRule(rules[rules.length - 1]!.id);
  endAsk(host, target);
}

function renderAddDomain(host: WatchPagesEditorHost, config: WatchSmartConfig): TemplateResult {
  return html`<dialog class="pe-ask pe-add-dialog sm-add" aria-labelledby="sm-add-title" @close=${() => endAsk(host)}>
    <div class="pe-ask-head">
      <h3 id="sm-add-title">${W("addDomain")}</h3>
      <button type="button" class="pe-icon-btn" title=${W("cancel")} aria-label=${W("cancel")} @click=${(e: Event) => endAsk(host, e.currentTarget)}>${uiIcon("close")}</button>
    </div>
    <p class="at-muted">${W("pickerIntro")}</p>
    <div class="sm-presets" role="group" aria-label=${W("addDomain")}>
      ${WATCH_SMART.presets.map((preset) => {
        const added = smartPresetAdded(config, preset);
        const glyph = host.icons.render(preset.icon, 22, smartDomainColorHex(preset.domain, host.page));
        return html`<button type="button" class="sm-preset ${added ? "added" : ""}" ?disabled=${added || host.busy}
          title=${added ? SMART_PRESET_ADDED_REASON : preset.label}
          @click=${(e: Event) => smartPresetPicked(host, preset, e.currentTarget)}>
          <span class="sm-preset-glyph" aria-hidden="true">${glyph ?? nothing}</span>
          <span class="sm-preset-label">${preset.label}</span>
          ${added ? html`<span class="at-added">${uiIcon("check")}Added</span>` : nothing}
        </button>`;
      })}
    </div>
  </dialog>`;
}

/** This module's rules, in the page editor's sheet after the tile settings'.
 * Prefix classes with `sm-`. */
export const smartSettingsStyles = css`
  .sm-under { margin: -2px 0 6px; }
  .sm-root { margin-top: 6px; }
  .sm-style > .ts-root { margin-top: -4px; border-top: 0; }
  .sm-note { margin: 0 0 8px; }
  .sm-strip { display: flex; flex-wrap: wrap; gap: 6px; padding: 2px 0 8px; }
  .sm-chip { display: inline-flex; align-items: center; gap: 5px; }
  .sm-chip-glyph { display: inline-grid; place-items: center; width: 16px; height: 16px; border-radius: 4px; background: #0b0b0d; }
  .sm-chip-glyph svg { display: block; }
  .sm-add-btn { display: inline-flex; align-items: center; gap: 4px; }
  .sm-add-btn svg.ui-icon { width: 12px; height: 12px; }
  .sm-add-btn.first { color: var(--wa-accent); border-color: color-mix(in srgb, var(--wa-accent) 50%, transparent); }
  .sm-rule-h { display: flex; align-items: center; gap: 8px; min-width: 0; padding: 6px 0 2px; border-top: 1px solid var(--wa-line); }
  .sm-glyph { flex: none; width: 28px; height: 28px; border-radius: 8px; display: grid; place-items: center; background: #0b0b0d; }
  .sm-glyph svg { display: block; }
  .sm-rule-name { min-width: 0; font-weight: 650; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .sm-badge { flex: none; }
  .sm-acts { display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 2px 8px; margin-left: auto; }
  .sm-act:disabled { opacity: .4; cursor: default; }
  fieldset.sm-body { margin: 0 -14px; }
  .sm-line { display: flex; align-items: center; gap: 8px; padding: 2px 0 6px calc(var(--wa-lab) + 8px); font-size: 12px; }
  .sm-warn { color: var(--wa-warn, #c47f00); font-weight: 600; }
  .sm-find { width: 100%; box-sizing: border-box; margin: 2px 0 4px; padding: 4px 8px; border: 1px solid var(--wa-line); border-radius: 6px;
    background: var(--wa-field); color: var(--wa-ink); font: inherit; font-size: 12px; }
  .sm-pick { max-height: 240px; }

  dialog.sm-add { width: min(560px, calc(100vw - 32px)); }
  .sm-presets { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 6px; margin-top: 10px; }
  button.sm-preset {
    display: flex; flex-direction: column; align-items: center; gap: 4px; min-width: 0; padding: 10px 6px 8px;
    border: 1px solid var(--wa-line); border-radius: 10px; background: var(--wa-raised, var(--wa-card)); color: var(--wa-ink);
    font: inherit; font-size: 12.5px; cursor: pointer;
  }
  button.sm-preset:hover:not(:disabled) { background: color-mix(in srgb, var(--wa-accent) 12%, var(--wa-card)); }
  button.sm-preset:focus-visible { outline: none; box-shadow: inset 0 0 0 2px var(--wa-accent); }
  button.sm-preset:disabled { opacity: .5; cursor: default; }
  .sm-preset-glyph { width: 36px; height: 36px; border-radius: 9px; display: grid; place-items: center; background: #0b0b0d; }
  .sm-preset-glyph svg { display: block; }
  .sm-preset-label { max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-weight: 600; }
  @media (max-width: 480px) { .sm-presets { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
`;
