// The menu editor's sections, drawn from a host: the Anywhere menu with its
// Style, the Entity quick menu with its per-entity menus, and the page
// switcher. `<wa-menu-editor>` owns the draft and hands a host in on every
// draw; nothing here keeps state of its own beyond `uiState`.
//
// Every edit is a setter of `model.ts` applied to the document as it is at
// the moment the edit commits (`host.edit`), never to the one drawn: one task
// can run two edits, and the second must start from what the first left.
//
// The fields are the panel's own (`editors.ts`), in the label-left rows of
// the page editor's side column.
//
// Plan: app repo docs/pages_in_home_assistant_step4.md ("4d batch 1 build
// contract", item 7).

import { css, html, nothing, type TemplateResult } from "lit";
import { live } from "lit/directives/live.js";
import { checkField, colorField, entityField, numberField, segField, selectField, sliderField, symbolField } from "../editors.js";
import type { HassLike } from "../ha-api.js";
import type { EntityRef } from "../model.js";
import type { IconProvider } from "../renderer.js";
import type { SymbolBrowser } from "../symbols.js";
import { uiIcon } from "../ui-icons.js";
import type { JsonObject } from "../watch-pages/model.js";
import {
  ANYWHERE,
  MENU_ACTIONS,
  type MenuListRef,
  type MenuPayloadSpec,
  type MenuStyleField,
  type MenuStyleSection,
  type MenuTargets,
  type MenusDocument,
  addWatchMenuOverride,
  addWatchMenuSlot,
  entityDomain,
  menuListKey,
  moveWatchMenuSlot,
  removeWatchMenuOverride,
  removeWatchMenuSlot,
  setWatchMenuActionKey,
  setWatchMenuInherits,
  setWatchMenuSlotAction,
  setWatchMenuSlotColor,
  setWatchMenuSlotEntityTypes,
  setWatchMenuSlotIcon,
  setWatchMenuSlotVisible,
  setWatchMenuStyle,
  slotAction,
  slotActionType,
  watchMenuAction,
  watchMenuActionLabel,
  watchMenuActionNeedsInstances,
  watchMenuActionUnavailable,
  watchMenuActionValue,
  watchMenuCategoryLabel,
  watchMenuDomain,
  watchMenuDomains,
  watchMenuDomainsSharing,
  watchMenuEnumChoices,
  watchMenuFreePositions,
  watchMenuInheritedSlots,
  watchMenuInherits,
  watchMenuOfferedActions,
  watchMenuOverrideIds,
  watchMenuPositionLabel,
  watchMenuPositions,
  watchMenuReportsType,
  watchMenuRingPoint,
  watchMenuShowForTypes,
  watchMenuSlotEntityTypes,
  watchMenuSlotId,
  watchMenuSlots,
  watchMenuStyleFields,
  watchMenuStyleShown,
  watchMenuStyleValue,
  watchTriggerModeLabel,
  watchTriggerModes,
  watchTriggerTargetDomains,
} from "./model.js";

/** What the sections are handed on every draw. `document`, `targets` and
 * `busy` are read live. */
export interface MenusViewHost {
  readonly hass: HassLike;
  readonly icons: IconProvider;
  readonly symbols: SymbolBrowser;
  readonly document: MenusDocument;
  /** Pages, status pages and HTTP actions the pickers offer. */
  readonly targets: MenuTargets;
  /** Whether the iPhone has published its library (HTTP actions, status
   * pages) here. */
  readonly catalogKnown: boolean;
  /** A save is out: every field is drawn off and every edit refused. */
  readonly busy: boolean;
  readonly uiState: Map<string, unknown>;
  /** Apply `change` to the document as it is now: one undo step, or with
   * `coalesce` a step the next edits with the same key replace. */
  edit(change: (document: MenusDocument) => MenusDocument, coalesce?: string): boolean;
  endCoalesce(): void;
  requestUpdate(): void;
}

export type MenusTab = "anywhere" | "entity" | "switcher";

export const MENUS_TABS: readonly [MenusTab, string][] = [
  ["anywhere", "Anywhere menu"],
  ["entity", "Entity quick menu"],
  ["switcher", "Page switcher"],
];

export const SWITCHER_LINE = "Each page's icon, color and name are set in that page's settings.";

// ── shared bits ──────────────────────────────────────────────────────────

function nameOf(hass: HassLike, entityId: string): string {
  const name = hass.states[entityId]?.attributes?.friendly_name;
  return typeof name === "string" && name.trim() !== "" ? name : entityId;
}

function refOf(hass: HassLike, entityId: string): EntityRef {
  return { entityId, displayName: entityId === "" ? "" : nameOf(hass, entityId), domain: entityDomain(entityId) };
}

function glyph(host: MenusViewHost, icon: string, size: number, color: string): TemplateResult {
  return host.icons.render(icon, size, color) ?? html`<span class="me-glyph-dot" style=${`background:${color}`}></span>`;
}

/** The icon and color a slot is drawn with: a type this table does not know
 * draws the phone's "Sync Needed" look. */
function slotLook(slot: JsonObject): { icon: string; color: string } {
  if (watchMenuAction(slotActionType(slot)) === undefined) {
    return { icon: MENU_ACTIONS.unknownActionIcon, color: MENU_ACTIONS.unknownActionColor };
  }
  return {
    icon: typeof slot.icon === "string" && slot.icon !== "" ? slot.icon : "circle",
    color: typeof slot.color === "string" ? slot.color : "#FFFFFF",
  };
}

/** The slot's target in words, for the list: the entity's name, the page's,
 * the HTTP action's. */
function targetText(host: MenusViewHost, slot: JsonObject): string | undefined {
  const raw = slotActionType(slot);
  const action = slotAction(slot);
  const spec = watchMenuAction(raw);
  for (const p of spec?.payload ?? []) {
    const value = action[p.key];
    if (typeof value !== "string" || value === "") continue;
    if (p.type === "entity") return nameOf(host.hass, value);
    if (p.target === "page") return host.targets.pages.find((t) => sameId(t.id, value))?.name ?? "A page not in the pages";
    if (p.target === "statusPage") return host.targets.statusPages.find((t) => sameId(t.id, value))?.name ?? "A status page";
    if (p.target === "httpAction") return host.targets.httpActions.find((t) => sameId(t.id, value))?.name ?? "An HTTP action";
    if (p.target === "ttsPhrase") return "A phrase";
  }
  return undefined;
}

function sameId(a: string, b: string): boolean {
  return a.toUpperCase() === b.toUpperCase();
}

/** Slots in the order of the places around the ring. */
function byPlace(slots: JsonObject[]): JsonObject[] {
  const order = watchMenuPositions();
  const at = (s: JsonObject) => {
    const i = order.indexOf(typeof s.position === "string" ? s.position : "");
    return i < 0 ? order.length : i;
  };
  return slots.slice().sort((a, b) => at(a) - at(b));
}

function selectionKey(ref: MenuListRef): string {
  return `me:sel:${menuListKey(ref)}`;
}

/** The selected slot of a list: the one picked last while it is still
 * there, else the first around the ring. */
export function selectedMenuSlot(host: Pick<MenusViewHost, "document" | "uiState">, ref: MenuListRef): JsonObject | undefined {
  const stored = host.uiState.get(selectionKey(ref));
  const slots = watchMenuSlots(host.document, ref);
  const picked = typeof stored === "string" ? slots.find((s) => sameId(watchMenuSlotId(s), stored)) : undefined;
  return picked ?? byPlace(slots)[0];
}

function select(host: MenusViewHost, ref: MenuListRef, id: string | undefined): void {
  host.uiState.set(selectionKey(ref), id);
  host.requestUpdate();
}

function addAt(host: MenusViewHost, ref: MenuListRef, position?: string): void {
  let added: string | undefined;
  host.edit((d) => {
    const result = addWatchMenuSlot(d, ref, { ...(position === undefined ? {} : { position }), targets: host.targets });
    added = result.id;
    return result.document;
  });
  if (added !== undefined) select(host, ref, added);
}

// ── the ring and the list ────────────────────────────────────────────────

/** Where a dot sits on the ring preview, as a style. */
function pointStyle(position: string, radius?: number): string | undefined {
  const point = watchMenuRingPoint(position, radius);
  return point === undefined ? undefined : `left:${point.x * 100}%;top:${point.y * 100}%`;
}

/**
 * The ring preview, one place at a time. The dot at a place is the first of
 * the list's own visible slots there; else a visible All slot the list takes
 * in (dashed, not a button); else the list's own hidden slot; else an add
 * button when the place is free. Any other slot of the list's own at that
 * place is drawn as a second, smaller dot nearer the center, and a main dot
 * of the list's own carries a count of the list's slots there (the phone's
 * climate defaults put two at top center).
 */
function renderRing(host: MenusViewHost, ref: MenuListRef, selected: JsonObject | undefined): TemplateResult {
  const slots = watchMenuSlots(host.document, ref);
  const inherited = watchMenuInheritedSlots(host.document, ref);
  const free = new Set(watchMenuFreePositions(host.document, ref));
  const selectedId = selected === undefined ? undefined : watchMenuSlotId(selected);
  const ownDot = (slot: JsonObject, position: string, style: string, extra: string, count: number): TemplateResult => {
    const look = slotLook(slot);
    const id = watchMenuSlotId(slot);
    const on = selectedId !== undefined && sameId(id, selectedId);
    const label = `${watchMenuPositionLabel(position)}: ${watchMenuActionLabel(slotActionType(slot))}${slot.isVisible === false ? ", hidden" : ""}`;
    return html`<button type="button" class="me-dot ${extra} ${on ? "on" : ""} ${slot.isVisible === false ? "off" : ""}" style=${`${style};--c:${look.color}`}
      title=${label} aria-label=${label} aria-pressed=${on ? "true" : "false"} @click=${() => select(host, ref, id)}>
      ${glyph(host, look.icon, extra === "" ? 16 : 12, look.color)}${count > 1 ? html`<span class="me-count" aria-hidden="true">${count}</span>` : nothing}</button>`;
  };
  return html`<div class="me-ring" role="group" aria-label="The menu around the finger">
    <svg class="me-ring-bg" viewBox="0 0 100 100" aria-hidden="true">
      <circle cx="50" cy="50" r="49" class="me-face"></circle>
      <circle cx="50" cy="50" r="36" class="me-track"></circle>
      <circle cx="50" cy="50" r="5" class="me-center"></circle>
    </svg>
    ${watchMenuPositions().map((position) => {
      const style = pointStyle(position);
      if (style === undefined) return nothing;
      const here = slots.filter((s) => s.position === position);
      const shown = here.find((s) => s.isVisible !== false);
      const shared = shown === undefined ? inherited.find((s) => s.position === position && s.isVisible !== false) : undefined;
      const main = shown ?? (shared === undefined ? here[0] : undefined);
      const second = here.find((s) => s !== main);
      let dot: TemplateResult | typeof nothing;
      if (main !== undefined) {
        dot = ownDot(main, position, style, "", here.length);
      } else if (shared !== undefined) {
        const look = slotLook(shared);
        dot = html`<span class="me-dot inh" style=${`${style};--c:${look.color}`} title=${`${watchMenuPositionLabel(position)}: ${watchMenuActionLabel(slotActionType(shared))}, from All`}>
          ${glyph(host, look.icon, 14, look.color)}</span>`;
      } else if (free.has(position)) {
        dot = html`<button type="button" class="me-dot free" style=${style} ?disabled=${host.busy}
          title=${`Add a slot at ${watchMenuPositionLabel(position)}`} aria-label=${`Add a slot at ${watchMenuPositionLabel(position)}`}
          @click=${() => addAt(host, ref, position)}>${uiIcon("plus")}</button>`;
      } else {
        dot = nothing;
      }
      const inner = second === undefined ? undefined : pointStyle(position, 0.2);
      return html`${dot}${second === undefined || inner === undefined ? nothing : ownDot(second, position, inner, "two", 0)}`;
    })}
  </div>`;
}

function renderList(host: MenusViewHost, ref: MenuListRef, selected: JsonObject | undefined): TemplateResult {
  const slots = byPlace(watchMenuSlots(host.document, ref));
  const selectedId = selected === undefined ? undefined : watchMenuSlotId(selected);
  const free = watchMenuFreePositions(host.document, ref);
  return html`<div class="me-list">
    ${slots.length === 0 ? html`<p class="pe-muted">No slots yet.</p>` : nothing}
    ${slots.map((slot) => {
      const id = watchMenuSlotId(slot);
      const look = slotLook(slot);
      const on = selectedId !== undefined && sameId(id, selectedId);
      const target = targetText(host, slot);
      return html`<button type="button" class="me-row ${on ? "on" : ""} ${slot.isVisible === false ? "off" : ""}" aria-pressed=${on ? "true" : "false"}
        @click=${() => select(host, ref, id)}>
        <span class="me-row-glyph" style=${`--c:${look.color}`}>${glyph(host, look.icon, 15, look.color)}</span>
        <span class="me-row-text">
          <b>${watchMenuActionLabel(slotActionType(slot))}${target === undefined ? "" : `: ${target}`}</b>
          <span>${watchMenuPositionLabel(typeof slot.position === "string" ? slot.position : "")}${slot.isVisible === false ? ", hidden" : ""}</span>
        </span>
      </button>`;
    })}
    <button type="button" class="pe-btn me-add" ?disabled=${host.busy || free.length === 0}
      title=${free.length === 0 ? "Every place around the ring is taken." : "Add a slot at the first free place"}
      @click=${() => addAt(host, ref)}>${uiIcon("plus")}<span>Add slot</span></button>
  </div>`;
}

// ── the slot editor ──────────────────────────────────────────────────────

const PAYLOAD_LABELS: Readonly<Record<string, string>> = {
  triggerMode: "Mode",
  confirmOnRelease: "Confirm on release",
  showBanner: "Show banner",
  bannerSeconds: "Banner seconds",
  openOnRelease: "Open on release",
  instanceSwitchBehavior: "Behavior",
  phraseId: "Phrase",
};

function payloadLabel(raw: string, spec: MenuPayloadSpec): string {
  if (spec.key === "entityId") {
    if (spec.target === "httpAction") return "HTTP action";
    if (raw === "runScene") return "Scene";
    if (raw === "runScript") return "Script";
    return "Entity";
  }
  if (spec.key === "pageId") return spec.target === "statusPage" ? "Status page" : "Page";
  return PAYLOAD_LABELS[spec.key] ?? spec.key;
}

function actionSelect(host: MenusViewHost, ref: MenuListRef, slot: JsonObject): TemplateResult {
  const id = watchMenuSlotId(slot);
  const current = slotActionType(slot);
  const groups = watchMenuOfferedActions(ref);
  const offered = new Set(groups.flatMap((g) => g.actions));
  const option = (raw: string) => {
    const spec = watchMenuAction(raw);
    const why = raw === current ? undefined : watchMenuActionUnavailable(raw, host.targets);
    const label = `${spec?.label ?? watchMenuActionLabel(raw)}${spec?.requiresPremium ? " (Pro)" : ""}${why === undefined ? "" : ` (${why})`}`;
    return html`<option value=${raw} ?selected=${raw === current} ?disabled=${why !== undefined}>${label}</option>`;
  };
  const set = (raw: string) => host.edit((d) => setWatchMenuSlotAction(d, ref, id, raw, host.targets));
  // `.value` is the document's on every draw, so a refused pick goes back.
  return html`<label class="field"><span>Action</span>
    <select .value=${live(current)} @change=${(e: Event) => set((e.target as HTMLSelectElement).value)}>
      ${offered.has(current) ? nothing : html`<optgroup label="Now"><option value=${current} selected>${watchMenuActionLabel(current)}</option></optgroup>`}
      ${groups.map((g) => html`<optgroup label=${watchMenuCategoryLabel(g.category)}>${g.actions.map(option)}</optgroup>`)}
    </select></label>`;
}

function targetSelect(host: MenusViewHost, ref: MenuListRef, slot: JsonObject, raw: string, spec: MenuPayloadSpec): TemplateResult {
  const id = watchMenuSlotId(slot);
  const value = slotAction(slot)[spec.key];
  const stored = typeof value === "string" ? value : "";
  const list = spec.target === "page" ? host.targets.pages : spec.target === "statusPage" ? host.targets.statusPages : host.targets.httpActions;
  const known = stored === "" || list.some((t) => sameId(t.id, stored));
  const set = (v: string) => host.edit((d) => setWatchMenuActionKey(d, ref, id, spec.key, v === "" ? undefined : v));
  const missing = spec.target === "page" ? "A page that is gone" : "Not on the iPhone";
  return html`<label class="field"><span>${payloadLabel(raw, spec)}</span>
    <select .value=${live(list.find((t) => sameId(t.id, stored))?.id ?? stored)} @change=${(e: Event) => set((e.target as HTMLSelectElement).value)}>
      ${spec.required === true ? nothing : html`<option value="" ?selected=${stored === ""}>None</option>`}
      ${known ? nothing : html`<option value=${stored} selected>${missing}</option>`}
      ${list.map((t) => html`<option value=${t.id} ?selected=${sameId(t.id, stored)}>${t.name}</option>`)}
    </select></label>
    ${spec.target !== "page" && !host.catalogKnown
      ? html`<div class="hint ts-under">Open the iPhone app to list its HTTP actions and status pages here.</div>`
      : nothing}`;
}

function payloadField(host: MenusViewHost, ref: MenuListRef, slot: JsonObject, raw: string, spec: MenuPayloadSpec): TemplateResult | typeof nothing {
  const id = watchMenuSlotId(slot);
  const action = slotAction(slot);
  const set = (value: unknown, coalesce?: string) => host.edit((d) => setWatchMenuActionKey(d, ref, id, spec.key, value), coalesce);
  const label = payloadLabel(raw, spec);
  const value = watchMenuActionValue(slot, spec);
  switch (spec.type) {
    case "entity": {
      const entityId = typeof action[spec.key] === "string" ? (action[spec.key] as string) : "";
      const domain = raw === "runScene" ? "scene" : raw === "runScript" ? "script" : watchTriggerTargetDomains();
      return html`<div class="ts-stack">${entityField({ hass: host.hass }, label, refOf(host.hass, entityId),
        (next) => set(next.entityId), `me:entity:${id}`, { domain, clearable: false, needed: entityId === "" })}</div>
        ${entityId === "" ? html`<div class="hint">Pick what it runs. A slot left without one is dropped when you save.</div>` : nothing}`;
    }
    case "uuid":
      if (spec.target === "ttsPhrase") {
        return html`<div class="field"><span>${label}</span><span class="me-readonly">${typeof value === "string" ? "Set on the iPhone" : "None"}</span></div>`;
      }
      return targetSelect(host, ref, slot, raw, spec);
    case "enum": {
      if (spec.key === "triggerMode") {
        const domain = entityDomain(typeof action.entityId === "string" ? action.entityId : "");
        const modes = watchTriggerModes(domain);
        const mode = typeof value === "string" ? value : modes[0] ?? "";
        const choices: [string, string][] = modes.map((m) => [m, watchTriggerModeLabel(m)]);
        if (!modes.includes(mode)) choices.unshift([mode, watchTriggerModeLabel(mode)]);
        return selectField(label, mode, choices, (v) => set(v), { snapBack: true });
      }
      const choices = watchMenuEnumChoices(spec.enum);
      const current = typeof value === "string" ? value : String(spec.default ?? "");
      return choices.length <= 4
        ? segField(label, current, choices, (v) => set(v))
        : selectField(label, current, choices, (v) => set(v), { snapBack: true });
    }
    case "bool":
      return checkField(label, value === true, (v) => set(v), spec.default as boolean | undefined);
    case "number": {
      // The banner's length matters only while the banner shows.
      if (spec.key === "bannerSeconds" && watchMenuActionValue(slot, { key: "showBanner", type: "bool", default: true }) === false) return nothing;
      const stored = typeof action[spec.key] === "number" ? (action[spec.key] as number) : undefined;
      return numberField(label, stored, (v) => set(v, `slot:${id}:${spec.key}`), {
        ...(spec.min === undefined ? {} : { min: spec.min }),
        ...(spec.max === undefined ? {} : { max: spec.max }),
        step: 1,
        optional: true,
        clampOnCommit: true,
        placeholder: typeof spec.absentMeans === "number" ? String(spec.absentMeans) : "",
        unit: "s",
        def: null,
      });
    }
  }
}

/** An entity type's name, from the domain list. */
function typeLabel(type: string): string {
  return watchMenuDomain(type)?.label ?? type;
}

/**
 * The Anywhere slot's "show for" filter. Only the types the watch reports
 * under the finger are offered. A stored type it never reports is kept,
 * drawn as a chip with a note, and can be taken off. With every chip off the
 * list is empty, which the watch reads as "only where no entity is under the
 * finger".
 */
function renderShowFor(host: MenusViewHost, slot: JsonObject): TemplateResult {
  const id = watchMenuSlotId(slot);
  const types = watchMenuSlotEntityTypes(slot);
  const every = types === undefined;
  const set = (next: string[] | undefined) => host.edit((d) => setWatchMenuSlotEntityTypes(d, id, next));
  const offered = watchMenuShowForTypes();
  const unreported = (types ?? []).filter((t) => !watchMenuReportsType(t));
  const summary = every ? "Every screen" : types.length === 0 ? "No entity under the finger" : types.map(typeLabel).join(", ");
  return html`<details class="me-show-for">
    <summary><span>Show for</span><b>${summary}</b></summary>
    ${checkField("Every screen", every, (v) => set(v ? undefined : offered.slice(0, 1)))}
    ${every ? nothing : html`<div class="me-chips" role="group" aria-label="Entity types">
      ${[...offered, ...unreported].map((type) => {
        const on = types.includes(type);
        const odd = !watchMenuReportsType(type);
        return html`<button type="button" class="pe-chip ${on ? "on" : ""} ${odd ? "odd" : ""}" aria-pressed=${on ? "true" : "false"}
          title=${odd ? "Not reported by the watch" : nothing}
          @click=${() => set(on ? types.filter((t) => t !== type) : [...types, type])}>${typeLabel(type)}</button>`;
      })}
    </div>
    ${unreported.length === 0 ? nothing : html`<div class="hint warn">${unreported.map(typeLabel).join(", ")}: Not reported by the watch.</div>`}
    <div class="hint">The slot shows only while the finger is over an entity of these types. With none picked, it shows only where no entity is under the finger.</div>`}
  </details>`;
}

function renderSlotEditor(host: MenusViewHost, ref: MenuListRef, slot: JsonObject): TemplateResult {
  const id = watchMenuSlotId(slot);
  const raw = slotActionType(slot);
  const spec = watchMenuAction(raw);
  const look = slotLook(slot);
  const position = typeof slot.position === "string" ? slot.position : "";
  // A place another slot of the list holds: picking it swaps the two. The
  // slot's own place says so when another slot shares it.
  const others = watchMenuSlots(host.document, ref).filter((s) => !sameId(watchMenuSlotId(s), id));
  const positions: [string, string][] = watchMenuPositions().map((p) => {
    const label = watchMenuPositionLabel(p);
    if (!others.some((s) => s.position === p)) return [p, label];
    return [p, p === position ? `${label} (shared)` : `${label} (swap)`];
  });
  return html`<fieldset class="me-slot sec-b" ?disabled=${host.busy} aria-label="Slot">
    <div class="me-slot-head">
      <span class="me-slot-glyph" style=${`--c:${look.color}`}>${glyph(host, look.icon, 22, look.color)}</span>
      <b>${watchMenuActionLabel(raw)}</b>
      ${spec?.requiresPremium ? html`<span class="pe-badge" title="Needs Wrist Assistant Pro on the watch">Pro</span>` : nothing}
      <span class="me-gap"></span>
      <button type="button" class="pe-btn pe-danger" @click=${() => host.edit((d) => removeWatchMenuSlot(d, ref, id))}>Remove</button>
    </div>
    ${spec === undefined ? html`<div class="hint warn">A newer app wrote this action. The watch shows Sync Needed until the iPhone sends it again. Pick another action to replace it.</div>` : nothing}
    ${selectField("Place", position, positions, (v) => host.edit((d) => moveWatchMenuSlot(d, ref, id, v)), { snapBack: true })}
    ${checkField("Shown", slot.isVisible !== false, (v) => host.edit((d) => setWatchMenuSlotVisible(d, ref, id, v)), true)}
    ${actionSelect(host, ref, slot)}
    ${spec?.description ? html`<div class="hint ts-under">${spec.description}</div>` : nothing}
    ${watchMenuActionNeedsInstances(raw) ? html`<div class="hint ts-under">Only for a watch with more than one Home Assistant.</div>` : nothing}
    ${(spec?.payload ?? []).map((p) => payloadField(host, ref, slot, raw, p))}
    <div class="ts-stack">${symbolField({ icons: host.icons, symbols: host.symbols }, typeof slot.icon === "string" ? slot.icon : "",
      (v) => host.edit((d) => setWatchMenuSlotIcon(d, ref, id, v), `slot:${id}:icon`), `me:icon:${id}`, undefined, "Icon", false)}</div>
    <div class="ts-no-alpha">${colorField("Color", typeof slot.color === "string" ? slot.color : undefined,
      (v) => { if (v !== undefined) host.edit((d) => setWatchMenuSlotColor(d, ref, id, v), `slot:${id}:color`); })}</div>
    ${ref.list === "anywhere" ? renderShowFor(host, slot) : nothing}
  </fieldset>`;
}

/** A list's ring, its rows and the selected slot's settings. */
function renderSlots(host: MenusViewHost, ref: MenuListRef): TemplateResult {
  const selected = selectedMenuSlot(host, ref);
  return html`<div class="me-slots">
      ${renderRing(host, ref, selected)}
      ${renderList(host, ref, selected)}
    </div>
    ${selected === undefined ? nothing : renderSlotEditor(host, ref, selected)}`;
}

// ── style ────────────────────────────────────────────────────────────────

function renderStyleField(host: MenusViewHost, section: MenuStyleSection, field: MenuStyleField): TemplateResult | typeof nothing {
  if (!watchMenuStyleShown(host.document, section, field)) return nothing;
  const value = watchMenuStyleValue(host.document, section, field);
  const coalesce = `style:${section}:${field.key}`;
  const set = (v: unknown, typing = false) => host.edit((d) => setWatchMenuStyle(d, section, field.key, v), typing ? coalesce : undefined);
  switch (field.type) {
    case "bool":
      return checkField(field.label, value === true, (v) => set(v), field.default as boolean);
    case "enum": {
      const choices = watchMenuEnumChoices(field.enum);
      const current = String(value);
      return choices.length <= 4
        ? segField(field.label, current, choices, (v) => set(v), { def: String(field.default) })
        : selectField(field.label, current, choices, (v) => set(v), { def: String(field.default), snapBack: true });
    }
    case "number": {
      const n = typeof value === "number" ? value : Number(field.default);
      return html`${sliderField(field.label, n, (v) => set(v, true), {
        min: field.min ?? 0,
        max: field.max ?? 1,
        step: field.step ?? 0.01,
        def: Number(field.default),
      })}
      ${field.presets === undefined ? nothing : html`<div class="ts-after">${field.presets.map((p) => html`<button type="button"
        class="pe-chip ${p.value === n ? "on" : ""}" aria-pressed=${p.value === n ? "true" : "false"} @click=${() => set(p.value)}>${p.label}</button>`)}</div>`}`;
    }
    case "color": {
      const hex = typeof value === "string" ? value : String(field.default);
      return html`<div class="ts-no-alpha">${colorField(field.label, hex, (v) => { if (v !== undefined) set(v, true); }, false, String(field.default))}</div>
        ${field.swatches === undefined ? nothing : html`<div class="ts-swatch-row"><div class="ts-swatches" role="group" aria-label=${field.label}>
          ${field.swatches.map((s) => {
            const on = s.toUpperCase() === hex.toUpperCase();
            return html`<button type="button" class="ts-swatch ${on ? "on" : ""}" aria-pressed=${on ? "true" : "false"} title=${s} aria-label=${s}
              style=${`--sw:${s}`} @click=${() => set(s)}></button>`;
          })}</div></div>`}`;
    }
  }
}

function renderStyle(host: MenusViewHost, section: MenuStyleSection): TemplateResult {
  return html`<fieldset class="me-style sec-b" ?disabled=${host.busy}>
    ${watchMenuStyleFields(section).map((f) => renderStyleField(host, section, f))}
  </fieldset>`;
}

// ── the sections ─────────────────────────────────────────────────────────

export function renderAnywhereMenu(host: MenusViewHost): TemplateResult {
  return html`<section class="pe-card me-card" aria-label="Anywhere menu">
      <h3>Anywhere menu</h3>
      <p class="pe-muted">Opens on any screen. Each place around the ring holds one slot.</p>
      ${renderSlots(host, ANYWHERE)}
    </section>
    <section class="pe-card me-card" aria-label="Style">
      <h3>Style</h3>
      ${renderStyle(host, "quickAction")}
    </section>`;
}

const ENTITY_MODE_KEY = "me:er:mode";
const ENTITY_DOMAIN_KEY = "me:er:domain";
const ENTITY_ID_KEY = "me:er:entity";
const ENTITY_ADD_KEY = "me:er:add";

function shownDomain(host: MenusViewHost): string {
  const stored = host.uiState.get(ENTITY_DOMAIN_KEY);
  return typeof stored === "string" && watchMenuDomain(stored) !== undefined ? stored : "light";
}

function shownEntity(host: MenusViewHost): string | undefined {
  const ids = watchMenuOverrideIds(host.document);
  const stored = host.uiState.get(ENTITY_ID_KEY);
  return typeof stored === "string" && ids.includes(stored) ? stored : ids[0];
}

export function renderEntityMenu(host: MenusViewHost): TemplateResult {
  const mode = host.uiState.get(ENTITY_MODE_KEY) === "entity" ? "entity" : "domain";
  const setMode = (v: "domain" | "entity") => {
    host.uiState.set(ENTITY_MODE_KEY, v);
    host.requestUpdate();
  };
  return html`<section class="pe-card me-card" aria-label="Entity quick menu">
    <h3>Entity quick menu</h3>
    <p class="pe-muted">Opens over a tile. Each type of entity has its own menu, and an entity can have a menu of its own.</p>
    <div class="sec-b me-mode">${segField("Edit", mode, [["domain", "By type"], ["entity", "By entity"]] as ["domain" | "entity", string][], (v) => setMode(v))}</div>
    ${mode === "domain" ? renderByDomain(host) : renderByEntity(host)}
  </section>`;
}

function renderByDomain(host: MenusViewHost): TemplateResult {
  const domain = shownDomain(host);
  const info = watchMenuDomain(domain);
  const sharing = watchMenuDomainsSharing(domain);
  const ref: MenuListRef = { list: "domain", domain };
  const choices: [string, string][] = watchMenuDomains().map((d) => [d.domain, d.label]);
  return html`<fieldset class="sec-b me-pick" ?disabled=${host.busy}>
      ${selectField("Type", domain, choices, (v) => {
        host.uiState.set(ENTITY_DOMAIN_KEY, v);
        host.requestUpdate();
      })}
      ${sharing.length > 0 ? html`<div class="hint ts-under">The same menu as ${sharing.map((d) => d.label).join(", ")}.</div>` : nothing}
      ${info?.inheritKey ? html`${checkField("Add the All slots", watchMenuInherits(host.document, domain), (v) => host.edit((d) => setWatchMenuInherits(d, domain, v)), false)}
        <div class="hint ts-under">The All menu's slots fill the places this menu leaves free.</div>` : nothing}
    </fieldset>
    ${renderSlots(host, ref)}`;
}

function renderByEntity(host: MenusViewHost): TemplateResult {
  const ids = watchMenuOverrideIds(host.document);
  const shown = shownEntity(host);
  const add = (ref: EntityRef) => {
    const entityId = ref.entityId.trim();
    if (entityId === "") return;
    host.edit((d) => addWatchMenuOverride(d, entityId));
    host.uiState.set(ENTITY_ID_KEY, entityId);
    host.uiState.set(ENTITY_ADD_KEY, (Number(host.uiState.get(ENTITY_ADD_KEY) ?? 0) || 0) + 1);
    host.requestUpdate();
  };
  return html`<div class="me-entities">
      ${ids.length === 0 ? html`<p class="pe-muted">No entity has a menu of its own. Add one below: it starts as a copy of its type's menu.</p>` : nothing}
      ${ids.map((entityId) => {
        const on = entityId === shown;
        return html`<div class="me-entity ${on ? "on" : ""}">
          <button type="button" class="me-entity-pick" aria-pressed=${on ? "true" : "false"}
            @click=${() => { host.uiState.set(ENTITY_ID_KEY, entityId); host.requestUpdate(); }}>
            <b>${nameOf(host.hass, entityId)}</b><code>${entityId}</code></button>
          <button type="button" class="pe-btn pe-danger" ?disabled=${host.busy} title="Remove this entity's own menu. It follows its type's menu again."
            @click=${() => host.edit((d) => removeWatchMenuOverride(d, entityId))}>Remove</button>
        </div>`;
      })}
      <fieldset class="sec-b ts-stack" ?disabled=${host.busy}>
        ${entityField({ hass: host.hass }, "Add an entity", refOf(host.hass, ""), add, `me:er:add:${String(host.uiState.get(ENTITY_ADD_KEY) ?? 0)}`, { clearable: false })}
      </fieldset>
    </div>
    ${shown === undefined ? nothing : html`<h4 class="me-sub">${nameOf(host.hass, shown)}</h4>
      ${renderSlots(host, { list: "entity", entityId: shown })}`}`;
}

export function renderPageSwitcher(host: MenusViewHost): TemplateResult {
  return html`<section class="pe-card me-card" aria-label="Page switcher">
    <h3>Page switcher</h3>
    <p class="pe-muted">${SWITCHER_LINE}</p>
    ${renderStyle(host, "pageSwitcher")}
  </section>`;
}

/** The sections' rules, after the panel's form rules in the editor's sheet. */
export const menuViewStyles = css`
  .me-card { gap: 10px; }
  .me-sub { margin: 4px 0 0; font-size: 13px; font-weight: 650; }
  .me-gap { flex: 1; }
  .me-slots { display: grid; grid-template-columns: 220px minmax(0, 1fr); gap: 14px; align-items: start; }
  @container (max-width: 560px) { .me-slots { grid-template-columns: minmax(0, 1fr); } }
  .me-ring { position: relative; width: 220px; max-width: 100%; aspect-ratio: 1; }
  .me-ring-bg { position: absolute; inset: 0; width: 100%; height: 100%; }
  .me-face { fill: #000; stroke: var(--wa-line); stroke-width: .6; }
  .me-track { fill: none; stroke: rgba(255, 255, 255, .12); stroke-width: .5; stroke-dasharray: 1.5 1.5; }
  .me-center { fill: rgba(255, 255, 255, .35); }
  .me-dot {
    position: absolute; width: 38px; height: 38px; margin: 0; padding: 0; transform: translate(-50%, -50%);
    display: grid; place-items: center; border-radius: 50%; border: 1.5px solid var(--c, rgba(255, 255, 255, .3));
    background: color-mix(in srgb, var(--c, #888) 22%, #000); color: #fff; cursor: pointer;
  }
  .me-dot svg { display: block; }
  .me-dot.on { box-shadow: 0 0 0 2px #000, 0 0 0 4px var(--wa-accent); }
  .me-dot:focus-visible { outline: none; box-shadow: 0 0 0 2px #000, 0 0 0 4px var(--wa-accent), var(--wa-ring); }
  .me-dot.off { opacity: .4; }
  .me-dot.two { width: 24px; height: 24px; border-width: 1px; z-index: 1; }
  .me-count {
    position: absolute; top: -5px; right: -5px; min-width: 16px; height: 16px; padding: 0 4px; border-radius: 999px;
    background: var(--wa-accent); color: #000; font-size: 10px; font-weight: 700; line-height: 16px; text-align: center;
  }
  .me-dot.inh { opacity: .45; border-style: dashed; cursor: default; width: 30px; height: 30px; }
  .me-dot.free { border: 1.5px dashed rgba(255, 255, 255, .28); background: transparent; color: rgba(255, 255, 255, .55); width: 30px; height: 30px; }
  .me-dot.free:hover:not(:disabled) { color: #fff; border-color: rgba(255, 255, 255, .6); }
  .me-dot.free svg.ui-icon { width: 14px; height: 14px; }
  .me-glyph-dot { width: 10px; height: 10px; border-radius: 50%; }
  .me-list { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
  .me-row {
    display: flex; align-items: center; gap: 10px; min-width: 0; padding: 6px 8px; border: 1px solid transparent;
    border-radius: var(--wa-r-sm, 8px); background: none; color: var(--wa-ink); font: inherit; text-align: left; cursor: pointer;
  }
  .me-row:hover { background: var(--wa-field); }
  .me-row.on { background: var(--wa-sel-bg); border-color: var(--wa-sel-ring); }
  .me-row.off .me-row-text b { color: var(--wa-muted); }
  .me-row:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .me-row-glyph, .me-slot-glyph {
    flex: none; width: 28px; height: 28px; border-radius: 50%; display: grid; place-items: center;
    background: color-mix(in srgb, var(--c, #888) 22%, #000); border: 1px solid var(--c, transparent);
  }
  .me-slot-glyph { width: 40px; height: 40px; }
  .me-row-text { display: flex; flex-direction: column; min-width: 0; }
  .me-row-text b { font-size: 13px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .me-row-text span { font-size: 12px; color: var(--wa-muted); }
  .me-add { display: inline-flex; align-items: center; gap: 6px; align-self: flex-start; margin-top: 4px; }
  fieldset.me-slot, fieldset.me-style, fieldset.me-pick, fieldset.me-entities, .me-mode {
    margin: 0; padding: 0; border: 0; min-width: 0; display: flex; flex-direction: column; gap: 2px; --wa-lab: 120px;
  }
  fieldset.me-slot, fieldset.me-style, fieldset.me-pick, .me-mode { max-width: 640px; }
  fieldset.me-slot { padding-top: 10px; border-top: 1px solid var(--wa-line); }
  .me-slot-head { display: flex; align-items: center; gap: 10px; padding-bottom: 6px; }
  .me-slot-head b { font-size: 14px; }
  .me-readonly { font-size: 12px; color: var(--wa-muted); }
  .me-show-for { margin-top: 6px; border-top: 1px solid var(--wa-line); padding-top: 6px; }
  .me-show-for > summary { display: flex; gap: 8px; align-items: baseline; cursor: pointer; font-size: 12px; color: var(--wa-muted); padding: 4px 0; }
  .me-show-for > summary b { color: var(--wa-ink); font-weight: 600; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .me-chips { display: flex; flex-wrap: wrap; gap: 6px; padding: 4px 0; }
  .me-entities { display: flex; flex-direction: column; gap: 6px; }
  .me-entity { display: flex; align-items: center; gap: 8px; padding: 4px 6px; border: 1px solid transparent; border-radius: var(--wa-r-sm, 8px); }
  .me-entity.on { background: var(--wa-sel-bg); border-color: var(--wa-sel-ring); }
  .me-entity-pick { display: flex; flex-direction: column; align-items: flex-start; gap: 2px; flex: 1; min-width: 0; border: 0; background: none; color: var(--wa-ink); font: inherit; text-align: left; cursor: pointer; padding: 2px; }
  .me-entity-pick:focus-visible { outline: none; box-shadow: var(--wa-ring); border-radius: 6px; }
  .me-entity-pick code { color: var(--wa-muted); }
  .pe-chip {
    padding: 3px 10px; border: 1px solid var(--wa-line); border-radius: 999px; background: var(--wa-card); color: var(--wa-ink);
    font: inherit; font-size: 12px; cursor: pointer;
  }
  .pe-chip.on { background: var(--wa-sel-bg); border-color: var(--wa-sel-ring); font-weight: 600; }
  .pe-chip.odd { border-style: dashed; color: var(--wa-amber); }
  .pe-chip:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .hint.ts-under { padding-left: calc(var(--wa-lab) + 8px); margin-top: -2px; }
  .ts-after { display: flex; flex-wrap: wrap; gap: 6px; padding: 2px 0 6px calc(var(--wa-lab) + 8px); }
  .ts-swatch-row { padding: 2px 0 4px calc(var(--wa-lab) + 8px); }
  .ts-swatches { display: flex; flex-wrap: wrap; gap: 6px; }
  .ts-swatch {
    width: 20px; height: 20px; padding: 0; border: 0; border-radius: 50%; cursor: pointer;
    background: var(--sw); box-shadow: inset 0 0 0 1px rgba(128, 128, 128, .45);
  }
  .ts-swatch.on { box-shadow: 0 0 0 2px var(--wa-card), 0 0 0 4px var(--wa-accent); }
  .ts-swatch:focus-visible { outline: none; box-shadow: 0 0 0 2px var(--wa-card), 0 0 0 4px var(--wa-accent), var(--wa-ring); }
  .ts-no-alpha .color-box .alpha { display: none; }
  .ts-no-alpha .color-box { padding-right: 6px; }
  .ts-stack .field { grid-template-columns: minmax(0, 1fr); gap: 4px; padding: 2px 0; }
  .ts-stack .field.entity-field > :not(:first-child) { grid-column: 1; }
`;
