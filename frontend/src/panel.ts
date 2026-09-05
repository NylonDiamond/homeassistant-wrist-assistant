// Home Assistant sidebar panel: <wrist-assistant-panel>.
// Pick a watch, pick a complication, edit a browser-side draft with live
// previews for all three families, then Save with the record's revision so
// a concurrent edit is caught instead of overwritten (plan §"Save and
// conflict rules"). Rules are edited in the inspector's States section.

import { LitElement, html, css, nothing, unsafeCSS, type PropertyValues, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import {
  type ComplicationRecord,
  type HassLike,
  type OwnerSummary,
  deleteRecord,
  fetchList,
  fetchOwners,
  moveOwner,
  nudgeWatch,
  renderTemplates,
  saveRecord,
  subscribeChanges,
} from "./ha-api.js";
import {
  type CustomComplicationConfig,
  type Element as CElement,
  type EntityRef,
  type FamilyKind,
  type NormalizedFrame,
  type OccupiedSlot,
  type Value,
  MAX_SLOTS,
  attachedTapsOf,
  auditUnknownKeys,
  describeTapAction,
  duplicateElement,
  freeSlotFrom,
  isAttachedTap,
  layerEntityUses,
  type LayerGroup,
  createGroup,
  groupMembers,
  groupOf,
  packGroups,
  pruneGroups,
  setGroup,
  ungroup,
  newConfig,
  newElement,
  newId,
  parseConfig,
  removeElement,
  selectableLayerId,
  setTapOutsetFromFrame,
  hasFreeTimestamp,
  DESIGN_BOX,
} from "./model.js";
import { SEND_WAIT_MS, describeSend, sendState } from "./send-state.js";
import { compile, parseValueDocument, type Compiled } from "./compiler.js";
import {
  type EntityState,
  type ForcedBranches,
  type ResolveContext,
  type ResolvedAll,
  type ResolvedInline,
  Resolver,
  countdownRemainingString,
  resolveAll,
} from "./resolver.js";
import { CASES, REFERENCE_CASE, caseForScreenSize, cornerTileSide, familyTitle, fitBox, renderLayerThumb, renderLayout, timestampChipRect, timestampLabel, type DrawableFamily, type IconProvider, type WatchCase } from "./renderer.js";
import { ALL_FAMILIES, addFamily, canRemoveFamily, familyContentSummary, firstDrawable, isDrawable, removeFamily, supportedFamilies } from "./layouts.js";
import { KIND_COLOR, KIND_LABEL, KIND_ORDER, SECTION_COLOR } from "./kinds.js";
import { updateWatchMessage, watchSupportsShapes } from "./version.js";
import { makeIconProvider } from "./icons.js";
import { makeImageSizeProvider } from "./image-sizes.js";
import { SymbolBrowser } from "./symbols.js";
import { Draft, draftStatus } from "./draft.js";
import { statesSummary } from "./states.js";
import { uiIcon } from "./ui-icons.js";
import { NUDGE_COARSE, beginGesture, beginPointDrag, beginScaleDrag, nudgeFrame, nudgePoint, type HandleCorner } from "./interact.js";
import {
  type EditorHost,
  type PickedFlag,
  ALL_SECTIONS,
  colorField,
  colorWords,
  describeContext,
  describeValue,
  effectivePlacement,
  entityField,
  entitySearchOpen,
  familyEditor,
  generalEditor,
  groupEditor,
  layerEditor,
  layerTitle,
  namedValueEditor,
  newNamedValue,
  pickedCommon,
  setPlacement,
} from "./editors.js";
import { type PresetEnv, type PresetKind, LAYER_PRESETS, applyPreset, presetSpec } from "./presets.js";

const TEMPLATE_REFRESH_MS = 30_000;
const TEMPLATE_DEBOUNCE_MS = 500;

/** Search key for the preset dialog's entity field. One dialog, one field, so
 * one key; the field's transient search state lives in editors.ts under it. */
const PRESET_ENTITY_KEY = "preset-entity";

/** Which way each arrow key moves the selection, in design points. Screen
 * coordinates, so Down is +y. */
const ARROW_STEP: Record<string, { dx: number; dy: number } | undefined> = {
  ArrowLeft: { dx: -1, dy: 0 },
  ArrowRight: { dx: 1, dy: 0 },
  ArrowUp: { dx: 0, dy: -1 },
  ArrowDown: { dx: 0, dy: 1 },
};

/** What the inspector is showing. One object, one selection: a layer's states
 * and its placement are sections of the layer, not selections of their own. */
type Inspect =
  | { kind: "general" }
  | { kind: "family" }
  | { kind: "data"; id: string }
  | { kind: "layer"; id: string }
  | { kind: "group"; id: string };

/** Identity of a selection, so a re-render can tell "the same thing changed"
 * from "something else is selected now". */
function inspectKey(i: Inspect): string {
  return "id" in i ? `${i.kind}:${i.id}` : i.kind;
}

/** The card that opens first when something is selected: what it shows for a
 * layer, how it looks for a shape. */
function defaultSection(i: Inspect): string {
  return i.kind === "family" ? "look" : "content";
}

type Conflict = { current: ComplicationRecord | null; message: string };

/** One row of the header picker: an editable record, or a slot something
 * else holds (an iPhone preset, or a custom on another home). */
type PickerRow =
  | { slot: number; kind: "record"; record: ComplicationRecord }
  | { slot: number; kind: "locked"; name: string; badge: string; title: string; families: readonly string[] };

/** The shapes a stored document lists, read without parsing the whole thing. */
function familiesOf(record: ComplicationRecord): string[] {
  const raw = record.document?.supportedFamilies;
  return Array.isArray(raw) ? raw.filter((f): f is string => typeof f === "string") : [];
}

const COL_LEFT_DEFAULT = 300;
const COL_RIGHT_DEFAULT = 400;
/** Layer-row thumbnail box, CSS px. Wide, because most layers are wider than tall. */
const THUMB_W = 52;
const THUMB_H = 36;
const COL_MIN = 200;
const COL_MAX = 720;
/** The canvas column never goes below this while three columns are shown. */
const CANVAS_MIN = 320;
/** .layout's own padding (16 each side) plus its column gaps and gutter tracks:
 * four 8px gaps and two 8px gutters with three columns, two gaps and one
 * gutter with two. */
const CHROME_3 = 32 + 4 * 8 + 2 * 8;
const CHROME_2 = 32 + 2 * 8 + 8;
/** Versioned: widths dragged for the old three-list layout gave the preview
 * the narrowest column of the three, so they start over here. */
const COL_STORE_KEY = "wrist-assistant-panel.columns.v2";

const clampColumn = (n: number) => Math.max(COL_MIN, Math.min(COL_MAX, Math.round(n)));

/**
 * Picking several layers uses the platform's multi-select key: Cmd on a Mac,
 * Ctrl everywhere else. Shift keeps working too, since it did before.
 */
const isMultiKey = (e: MouseEvent | PointerEvent) => e.metaKey || e.ctrlKey || e.shiftKey;
const MULTI_KEY = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform) ? "Cmd" : "Ctrl";

/** How many columns fit, and how wide the side ones may actually be.
 *
 * The stored widths are what the user dragged; these are what the panel can
 * afford right now. Shrinking the window used to push the inspector past the
 * right edge of a grid that clips, so it was simply cut off. Sizing from the
 * measured panel width instead of a viewport media query also handles the
 * Home Assistant sidebar, which changes the panel's width without changing
 * the window's. */
export function columnFit(
  panelWidth: number,
  wantLeft: number,
  wantRight: number,
): { columns: 1 | 2 | 3; left: number; right: number } {
  // Before the first measurement, assume there is room: the observer corrects
  // it on the same frame and a wide-to-narrow flash is worse than the reverse.
  if (panelWidth <= 0) return { columns: 3, left: wantLeft, right: wantRight };

  const forThree = panelWidth - CHROME_3;
  if (forThree >= COL_MIN * 2 + CANVAS_MIN) {
    const budget = forThree - CANVAS_MIN;
    let left = wantLeft;
    let right = wantRight;
    if (left + right > budget) {
      const factor = budget / (left + right);
      left = Math.max(COL_MIN, Math.floor(left * factor));
      right = Math.max(COL_MIN, Math.floor(right * factor));
      // Flooring at COL_MIN can put the pair back over; take the rest off
      // whichever side still has slack.
      const over = left + right - budget;
      if (over > 0) {
        if (left >= right) left = Math.max(COL_MIN, left - over);
        else right = Math.max(COL_MIN, right - over);
      }
    }
    return { columns: 3, left, right };
  }

  const forTwo = panelWidth - CHROME_2;
  if (forTwo >= COL_MIN + CANVAS_MIN) {
    return { columns: 2, left: Math.min(wantLeft, forTwo - CANVAS_MIN), right: wantRight };
  }

  return { columns: 1, left: wantLeft, right: wantRight };
}

export class WristAssistantPanel extends LitElement {
  @property({ attribute: false }) hass!: HassLike;
  @property({ type: Boolean }) narrow = false;
  @property({ attribute: false }) panel?: { config?: { version?: string } };

  /** Side column widths in px, dragged by the gutters and kept per browser.
   * These are the widths the user asked for; columnFit() decides how much of
   * that the panel can afford at its current width. */
  @state() private colLeft = COL_LEFT_DEFAULT;
  @state() private colRight = COL_RIGHT_DEFAULT;
  /** Measured width of the panel, not of the window. */
  @state() private panelWidth = 0;

  @state() private owners: OwnerSummary[] = [];
  @state() private ownerId?: string;
  @state() private records: ComplicationRecord[] = [];
  @state() private selectedId?: string;
  @state() private draft?: Draft;
  @state() private readOnlyReason?: string;
  @state() private parseError?: string;
  @state() private maxSchemaVersion = 6;
  /** iPhone presets on the selected watch (slot + name). freeSlot() skips
   * their slots; the list shows them as locked rows. */
  @state() private presets: { slot: number; name: string }[] = [];
  /** Every slot something other than this server's records holds: the presets
   * plus customs on another home. The list shows them as locked rows and
   * freeSlot() skips them all. Built from `presets` when the integration
   * predates the field. */
  @state() private occupied: OccupiedSlot[] = [];
  /** The store token for the selected watch and the one it last confirmed.
   * Equal means everything here is on the wrist. `appliedToken` stays
   * undefined on integrations without the ack, which hides the button. */
  @state() private serverToken = 0;
  @state() private appliedToken?: number;
  /** Whether the watch holds a long-poll on this server right now. */
  @state() private polling = false;
  /** A save or a Send tap is waiting for the watch's ack. */
  @state() private sendPending = false;
  private sendTimer?: number;
  /** Watch-app pages (id + name) from the watch's last sync report; feeds the
   * "Open the page" tap-action picker. */
  @state() private pages: { id: string; name: string }[] = [];
  @state() private templateResults = new Map<string, string>();
  @state() private templateError?: string;
  @state() private templateFetchedAt?: number;
  @state() private forced: ForcedBranches = new Map();
  @state() private showRaw = false;
  @state() private inspect: Inspect = { kind: "general" };
  /** The inspector cards that are open. One entry means one at a time. Reset
   * to the first card whenever something else is selected (willUpdate). */
  @state() private openSections: ReadonlySet<string> = new Set(["content"]);
  /** The header's complication menu is open. */
  @state() private pickerOpen = false;
  /** The Shared values list under the complication settings is unfolded. */
  /** Entity states typed in under the preview, standing in for the live ones
   * so the other states can be seen without waiting for the house. Never
   * saved; cleared by Back to live. */
  @state() private testValues: ReadonlyMap<string, string> = new Map();
  /** The value chip whose input is showing. */
  @state() private editingValue?: string;
  /** The layer row being dragged in the Layers list. */
  private dragId?: string;
  /** Layers picked with Cmd/Ctrl-click, in the list or on the preview, waiting to be grouped. */
  @state() private multi: ReadonlySet<string> = new Set();
  /** The row a shift-click measures its range from: the last row clicked. */
  private pickAnchor?: string;
  /** Groups folded shut in the Layers list. List state only, never saved. */
  @state() private collapsed: ReadonlySet<string> = new Set();
  @state() private activeFamily: FamilyKind = "rectangular";
  /** Pick mode: the pointer names the layer under it instead of dragging it,
   * the way a browser inspector picks a node. One click selects and ends it. */
  @state() private picking = false;
  /** The layer the pick-mode pointer is over. Shaded in every preview and
   * marked in the Layers card, so the two lists answer each other. */
  @state() private pickHoverId?: string;
  /** Review mode: every tap area on show, labelled, with the drawing dimmed.
   * An attached tap is invisible during normal editing on purpose, which is
   * exactly why "what happens if I tap here?" needed a mode of its own. */
  @state() private showTaps = false;
  /** The image layer whose timestamp chip was clicked. The chip then shows a
   * selection box and corner handles, so it reads as the movable, resizable
   * thing it is. Cleared by any other click on the face, or by Escape. */
  @state() private timestampActiveId?: string;
  /** The name the open complication had when its edit session started, so the
   * General tab can warn that a rename does not reach the watch face picker.
   * Undefined for a brand-new complication (nothing is on the watch yet). */
  @state() private savedName?: string;
  /** The preset whose entity dialog is open, and the entity chosen in it so
   * far. A preset asks for its entity before it creates anything, so closing
   * the dialog leaves the document exactly as it was. */
  @state() private presetKind?: PresetKind;
  @state() private presetEntity?: EntityRef;
  /** The New button's shape picker is open. Only offered when the watch can
   * take a one-shape document; an older watch gets the three-shape default. */
  @state() private newShapeChooser = false;
  /** Which watch case the previews are drawn in. The reference (46 mm) is scale 1. */
  @state() private previewCase = REFERENCE_CASE.label;
  @state() private loadError?: string;
  @state() private saveError?: string;
  @state() private saving = false;
  @state() private conflict?: Conflict;
  @state() private remoteRevision?: number;
  @state() private confirmDelete = false;
  @state() private moveTarget?: string;
  @state() private moving = false;
  @state() private moveError?: string;
  @state() private version = 0; // bumped on every draft mutation

  private compiled?: Compiled;
  private compiledDocument?: string;
  private icons: IconProvider = makeIconProvider(() => this.requestUpdate());
  /** Natural sizes of the preview's camera pictures, so an image layer can be
   * cropped exactly the way the watch crops it. */
  private imageSizes = makeImageSizeProvider(() => this.requestUpdate());
  private symbols = new SymbolBrowser(() => this.requestUpdate());
  private unsubscribe?: () => Promise<void>;
  private templateTimer?: number;
  private debounceTimer?: number;
  private lastStatesSnapshot?: Record<string, unknown>;
  private cancelGesture?: () => void;
  private keyHandler = (e: KeyboardEvent) => this.onKey(e);
  /** Arrows being held down right now, only the ones that actually nudged. */
  private heldArrows = new Set<string>();
  /** Letting the last one go closes the coalescing window, the way a pointer up
   * does, so the next run of presses is a fresh undo step. Counting them keeps
   * a diagonal nudge (two arrows at once) one step rather than two. */
  private keyUpHandler = (e: KeyboardEvent) => {
    if (!this.heldArrows.delete(e.key)) return;
    if (this.heldArrows.size === 0) this.draft?.endGesture();
  };

  static override styles = css`
    :host {
      /* Column so the footer can sit under a layout that takes the rest of the
         height, rather than being pushed off the bottom of the page. */
      display: flex;
      flex-direction: column;
      height: 100%;
      font-family: var(--paper-font-body1_-_font-family, -apple-system, BlinkMacSystemFont, "Inter", Roboto, sans-serif);
      font-size: 14px;
      /* Colours the whole editor shares: one per layer kind, one per section
         that is not about a kind. Set once so a badge, a bar and a card agree. */
      --wa-text: ${unsafeCSS(KIND_COLOR.text)};
      --wa-icon: ${unsafeCSS(KIND_COLOR.icon)};
      --wa-gauge: ${unsafeCSS(KIND_COLOR.gauge)};
      --wa-shape: ${unsafeCSS(KIND_COLOR.shape)};
      --wa-image: ${unsafeCSS(KIND_COLOR.image)};
      --wa-tap: ${unsafeCSS(KIND_COLOR.tap)};
      --wa-states: ${unsafeCSS(SECTION_COLOR.states)};
      --wa-place: ${unsafeCSS(SECTION_COLOR.place)};
      /* The skin. Light follows the Home Assistant theme it sits in; the dark
         block below replaces these with the editor's own deep palette. The
         rest of the sheet only ever reads these names, so the two skins can
         never drift apart in anything but colour. */
      --wa-bg: var(--primary-background-color, #f3f4f8);
      --wa-card: var(--card-background-color, #fff);
      --wa-panel: var(--secondary-background-color, rgba(127,127,127,.12));
      --wa-raised: color-mix(in srgb, var(--wa-panel) 55%, var(--wa-card));
      --wa-input: var(--wa-card);
      --wa-line: var(--divider-color, rgba(127,127,127,.3));
      --wa-line-strong: color-mix(in srgb, var(--wa-line) 60%, var(--wa-ink));
      --wa-ink: var(--primary-text-color, #1c1c1e);
      --wa-muted: var(--secondary-text-color, rgba(127,127,127,.9));
      --wa-accent: var(--primary-color, #6d5dfc);
      --wa-accent-ink: var(--wa-accent-ink);
      --wa-r-sm: 8px;
      --wa-r-md: 12px;
      --wa-r-lg: 16px;
      --wa-shadow: 0 1px 2px rgba(0,0,0,.06), 0 6px 20px rgba(0,0,0,.06);
      --wa-shadow-pop: 0 12px 36px rgba(0,0,0,.28);
      --wa-ring: 0 0 0 3px color-mix(in srgb, var(--wa-accent) 28%, transparent);
      color: var(--wa-ink);
      background: var(--wa-bg);
    }
    /* The 2026 skin: near-black navy ground, cards a step up, hairlines made
       of light rather than grey, and a violet accent for the one thing on
       screen you are meant to press. Only colours change here. */
    :host([dark]) {
      --wa-bg: #0b0d14;
      --wa-card: #12141d;
      --wa-panel: #1a1d28;
      --wa-raised: #171a24;
      --wa-input: #0e1017;
      --wa-line: rgba(255,255,255,.08);
      --wa-line-strong: rgba(255,255,255,.16);
      --wa-ink: #eceef5;
      --wa-muted: #8d92a6;
      --wa-accent: #7b6cff;
      --wa-accent-ink: #fff;
      --wa-shadow: 0 1px 2px rgba(0,0,0,.45), 0 10px 30px rgba(0,0,0,.35);
      --wa-shadow-pop: 0 16px 48px rgba(0,0,0,.6);
      color-scheme: dark;
      scrollbar-color: rgba(255,255,255,.14) transparent;
    }
    * { box-sizing: border-box; }
    svg { display: block; }
    :host([dark]) ::selection { background: color-mix(in srgb, var(--wa-accent) 45%, transparent); }
    header {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 16px;
      border-bottom: 1px solid var(--wa-line);
      background: var(--wa-card);
      color: var(--wa-ink);
      flex-wrap: wrap;
      position: relative;
      z-index: 20;
    }
    header h1 { display: inline-flex; align-items: center; gap: 10px; font-size: 15px; font-weight: 600; letter-spacing: -.01em; margin: 0 8px 0 0; white-space: nowrap; }
    header h1 .mark {
      width: 28px; height: 28px; border-radius: 9px; display: grid; place-items: center; flex: none;
      background: color-mix(in srgb, var(--wa-accent) 18%, transparent); color: var(--wa-accent);
      border: 1px solid color-mix(in srgb, var(--wa-accent) 35%, transparent);
    }
    header h1 .mark svg { width: 16px; height: 16px; }
    header .spacer { flex: 1; }
    header label { font-size: 13px; display: inline-flex; align-items: center; gap: 8px; color: var(--wa-muted); }
    header label select { max-width: 260px; }
    .toolbar { display: flex; gap: 6px; align-items: center; flex-wrap: wrap; }
    /* Buttons: one quiet shape everywhere, the accent fill kept for the single
       action that matters, and a soft ring on focus instead of a hard outline. */
    .toolbar button, button.primary, button.small, button.danger {
      font: inherit; font-size: 13px; font-weight: 500; padding: 7px 13px; border-radius: 10px; cursor: pointer;
      border: 1px solid var(--wa-line); background: var(--wa-raised); color: var(--wa-ink);
      transition: background-color .12s ease-out, border-color .12s ease-out, box-shadow .12s ease-out;
    }
    .toolbar button:hover:not(:disabled), button.small:hover:not(:disabled) { border-color: var(--wa-line-strong); background: var(--wa-panel); }
    .toolbar button:focus-visible, button.primary:focus-visible, button.small:focus-visible, button.danger:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .toolbar button:disabled, button:disabled { opacity: .45; cursor: default; }
    button.primary { background: var(--wa-accent); color: var(--wa-accent-ink); border-color: transparent; font-weight: 600; }
    button.primary:hover:not(:disabled) { background: color-mix(in srgb, var(--wa-accent) 88%, #fff); }
    /* Save is the header's one call to action. It is quiet while there is
       nothing to save and lit, with the unsaved halo, once there is, so the
       button, the dirty dot and the footer line all say "unsaved" the same
       way. */
    header button.save { min-height: 32px; padding: 7px 16px; }
    header button.save:not(.dirty) { background: var(--wa-raised); color: var(--wa-muted); border-color: var(--wa-line); }
    header button.save.dirty { box-shadow: 0 0 0 3px color-mix(in srgb, var(--warning-color, #ffa600) 40%, transparent), 0 6px 18px color-mix(in srgb, var(--wa-accent) 35%, transparent); }
    button.danger { color: var(--error-color, #e5484d); border-color: color-mix(in srgb, var(--error-color, #e5484d) 45%, transparent); background: color-mix(in srgb, var(--error-color, #e5484d) 8%, transparent); }
    button.danger:hover:not(:disabled) { background: color-mix(in srgb, var(--error-color, #e5484d) 16%, transparent); border-color: var(--error-color, #e5484d); }
    button.small { padding: 5px 11px; font-size: 12.5px; min-height: 28px; border-radius: 9px; }
    button.icon {
      font: inherit; border: none; background: none; cursor: pointer; color: inherit;
      display: inline-flex; align-items: center; justify-content: center;
      width: 28px; height: 28px; padding: 0; border-radius: 8px; opacity: .75;
      transition: background-color .12s ease-out, opacity .12s ease-out;
    }
    button.icon:hover:not(:disabled) { opacity: 1; background: color-mix(in srgb, var(--wa-ink) 10%, transparent); }
    button.icon:focus-visible { opacity: 1; outline: none; box-shadow: var(--wa-ring); }
    button.icon.danger:hover:not(:disabled) { color: var(--error-color, #e5484d); background: color-mix(in srgb, var(--error-color, #e5484d) 14%, transparent); }
    svg.ui-icon { width: 17px; height: 17px; display: block; }
    .dirty-dot { display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: var(--warning-color, #ffa600); margin-left: 6px; vertical-align: middle; box-shadow: 0 0 8px var(--warning-color, #ffa600); }

    /* Native controls: the same dark well, hairline and focus ring as the
       buttons, so a select in the header and a number field in the inspector
       read as one family. */
    select {
      font: inherit; font-size: 13px; color: var(--wa-ink); cursor: pointer;
      padding: 6px 28px 6px 10px; border-radius: 9px; border: 1px solid var(--wa-line); background-color: var(--wa-input);
      appearance: none; -webkit-appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%238d92a6' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
      background-repeat: no-repeat; background-position: right 8px center; background-size: 14px;
      transition: border-color .12s ease-out, box-shadow .12s ease-out;
    }
    select:hover:not(:disabled) { border-color: var(--wa-line-strong); }
    select:focus-visible { outline: none; border-color: var(--wa-accent); box-shadow: var(--wa-ring); }
    input[type=text], input[type=number], input[type=search], input[type=url], textarea {
      font: inherit; font-size: 13px; color: var(--wa-ink);
      padding: 6px 10px; border-radius: 9px; border: 1px solid var(--wa-line); background: var(--wa-input);
      transition: border-color .12s ease-out, box-shadow .12s ease-out;
    }
    input[type=text]:hover:not(:disabled), input[type=number]:hover:not(:disabled), textarea:hover:not(:disabled) { border-color: var(--wa-line-strong); }
    input[type=text]:focus-visible, input[type=number]:focus-visible, input[type=search]:focus-visible, textarea:focus-visible { outline: none; border-color: var(--wa-accent); box-shadow: var(--wa-ring); }
    input::placeholder, textarea::placeholder { color: color-mix(in srgb, var(--wa-muted) 70%, transparent); }
    /* Every checkbox is a switch: a pill that slides, tinted by the section
       it sits in, since a tick box is the one control that still looked like
       a form from 2009. */
    input[type=checkbox] {
      appearance: none; -webkit-appearance: none; margin: 0; cursor: pointer; flex: none;
      width: 34px; height: 20px; border-radius: 999px; position: relative;
      background: color-mix(in srgb, var(--wa-ink) 14%, transparent); border: 1px solid var(--wa-line);
      transition: background-color .15s ease-out, border-color .15s ease-out;
    }
    input[type=checkbox]::after {
      content: ""; position: absolute; top: 2px; left: 2px; width: 14px; height: 14px; border-radius: 50%;
      background: #fff; box-shadow: 0 1px 2px rgba(0,0,0,.35); transition: transform .15s ease-out;
    }
    input[type=checkbox]:checked { background: var(--c, var(--wa-accent)); border-color: transparent; }
    input[type=checkbox]:checked::after { transform: translateX(14px); }
    input[type=checkbox]:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    input[type=checkbox]:disabled { opacity: .45; cursor: default; }
    input[type=range] { accent-color: var(--c, var(--wa-accent)); }
    input[type=color] { border: 1px solid var(--wa-line); border-radius: 8px; background: var(--wa-input); padding: 2px; cursor: pointer; }

    /* The complication picker: one dropdown in the header instead of a list
       down the side, because the list was read once per session and the space
       it held is worth more to the layers. */
    .picker { position: relative; }
    .picker > button {
      display: inline-flex; align-items: center; gap: 8px; font: inherit; font-size: 13.5px; font-weight: 500;
      padding: 7px 10px 7px 12px; border-radius: 10px; cursor: pointer; color: var(--wa-ink);
      border: 1px solid var(--wa-line); background: var(--wa-raised); min-width: 220px; max-width: 380px;
      transition: border-color .12s ease-out, background-color .12s ease-out;
    }
    .picker > button:hover { border-color: var(--wa-line-strong); background: var(--wa-panel); }
    .picker > button:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .picker .pk-name { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; text-align: left; }
    .picker .pk-rev { color: var(--wa-muted); font-weight: 400; font-size: 12px; white-space: nowrap; }
    .picker > button svg { width: 16px; height: 16px; opacity: .7; }
    .picker .menu {
      position: absolute; top: calc(100% + 8px); left: 0; z-index: 50; width: 360px; max-height: 60vh; overflow: auto;
      background: var(--wa-card); color: var(--wa-ink); border: 1px solid var(--wa-line-strong);
      border-radius: var(--wa-r-md); box-shadow: var(--wa-shadow-pop); padding: 6px;
    }
    .picker .menu .row {
      display: flex; align-items: center; gap: 10px; width: 100%; text-align: left; font: inherit; font-size: 13px;
      background: transparent; border: 0; color: inherit; padding: 8px 10px; border-radius: 8px; cursor: pointer;
    }
    .picker .menu .row:hover { background: var(--wa-panel); }
    .picker .menu .row[aria-current="true"] { background: color-mix(in srgb, var(--wa-accent) 18%, transparent); }
    .picker .menu .row.locked { opacity: .6; cursor: default; }
    .picker .menu .pk-badge { font-size: 11px; opacity: .7; white-space: nowrap; }
    .picker .menu .new { margin-top: 6px; border-top: 1px solid var(--wa-line); padding-top: 10px; color: var(--wa-accent); font-weight: 500; }
    .picker .menu .new-shape { padding: 4px 10px 8px; }
    .picker .menu .new-shape .hint { margin: 4px 0 8px; }
    .shape-dots { display: inline-flex; gap: 3px; align-items: center; flex: none; }
    .shape-dot { width: 14px; height: 10px; border-radius: 2px; background: currentColor; opacity: .3; display: inline-block; }
    .shape-dot.circular { width: 10px; border-radius: 50%; }
    .shape-dot.corner { width: 10px; border-radius: 0 6px 0 0; }
    .shape-dot.inline { width: 16px; height: 4px; }
    .shape-dot.on { opacity: 1; }

    /* Three columns with a draggable gutter between each pair. The side widths
       come in as custom properties already fitted to the measured panel width
       (see columnFit), and every track can shrink to zero here, so the grid
       itself can never be wider than the panel and clip a column. */
    .layout {
      display: grid;
      grid-template-columns: var(--wa-left, 280px) 8px minmax(0, 1fr) 8px var(--wa-right, 400px);
      column-gap: 8px;
      row-gap: 16px;
      padding: 16px;
      flex: 1 1 auto;
      min-height: 0;
      overflow: hidden;
    }
    .gutter {
      align-self: stretch; cursor: col-resize; border-radius: 4px;
      background: transparent; position: relative; touch-action: none;
    }
    .gutter::after {
      content: ""; position: absolute; inset: 0 3px; border-radius: 2px;
      background: var(--wa-line); opacity: 0; transition: opacity .12s ease-out;
    }
    .gutter:hover::after, .gutter.dragging::after { background: var(--wa-accent); opacity: 1; }
    .layout.cols-2 {
      grid-template-columns: var(--wa-left, 280px) 8px minmax(0, 1fr);
      overflow: auto;
    }
    .layout.cols-2 > .column.inspector { grid-column: 1 / -1; }
    .layout.cols-2 > .gutter.right { display: none; }
    .layout.cols-1 { grid-template-columns: minmax(0, 1fr); overflow: auto; }
    .layout.cols-1 > .column { grid-column: auto; }
    .layout.cols-1 > .gutter { display: none; }
    .column { overflow: auto; min-height: 0; }
    .card {
      background: var(--wa-card);
      border: 1px solid var(--wa-line);
      border-radius: var(--wa-r-lg);
      box-shadow: var(--wa-shadow);
      padding: 16px 18px;
    }
    .column.left { display: flex; flex-direction: column; gap: 14px; }
    .column.left .card { flex: none; }
    /* Card titles read as titles: sentence case, a little heavier, the ink
       colour. Their side notes stay small and muted. */
    .panel-title {
      display: flex; align-items: center; gap: 8px; margin: 0 0 12px;
      font-size: 15px; font-weight: 600; letter-spacing: -.01em; color: var(--wa-ink);
    }
    .panel-title .spacer { flex: 1; }
    .panel-title .mini { font-weight: 400; font-size: 12px; color: var(--wa-muted); letter-spacing: 0; }
    .panel-title button.small { font-weight: 500; letter-spacing: 0; }

    /* Status and the raw document: one line at the foot of the panel, shut by
       default, saying only whether the work is saved. */
    details.foot { flex: none; border-top: 1px solid var(--wa-line); background: var(--wa-card); }
    details.foot > summary { display: flex; align-items: center; gap: 8px; padding: 9px 16px; font-size: 13px; cursor: pointer; list-style: none; color: var(--wa-muted); }
    details.foot > summary::-webkit-details-marker { display: none; }
    details.foot > summary:hover { background: var(--wa-panel); }
    details.foot .foot-dot { font-size: 10px; }
    details.foot .foot-dot.ok { color: var(--success-color, #3dd68c); text-shadow: 0 0 8px var(--success-color, #3dd68c); }
    details.foot .foot-dot.warn { color: var(--warning-color, #ffa600); }
    /* Same colour on the words as on the dot, so the footer agrees with the
       header's Save button about there being work to save. */
    details.foot .foot-dot.warn + .foot-text { color: var(--warning-color, #ffa600); }
    details.foot .foot-dot.err { color: var(--error-color, #db4437); }
    details.foot .foot-text { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    details.foot .foot-more { font-size: 12px; opacity: .6; }
    details.foot[open] .foot-more { opacity: .4; }
    details.foot .foot-body { padding: 0 16px 12px; max-height: 40vh; overflow: auto; }
    details.foot .foot-body .hint { margin: 8px 0; }

    /* Add a layer: six tinted buttons, one per kind, then the presets. It sits
       above the list so adding a layer never moves the button just pressed. */
    .add-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
    button.add {
      display: flex; align-items: center; justify-content: center; gap: 6px; padding: 9px 4px; border-radius: 10px;
      font: inherit; font-size: 13px; font-weight: 500; cursor: pointer; color: var(--wa-ink); white-space: nowrap;
      background: color-mix(in srgb, var(--k) 14%, var(--wa-card)); border: 1px solid color-mix(in srgb, var(--k) 38%, transparent);
      transition: background-color .12s ease-out, border-color .12s ease-out, transform .12s ease-out;
    }
    button.add:hover:not(:disabled) { background: color-mix(in srgb, var(--k) 26%, var(--wa-card)); border-color: color-mix(in srgb, var(--k) 65%, transparent); }
    button.add:active:not(:disabled) { transform: translateY(1px); }
    button.add:focus-visible { outline: none; box-shadow: 0 0 0 3px color-mix(in srgb, var(--k) 30%, transparent); }
    button.add svg { color: var(--k); width: 15px; height: 15px; flex: none; }
    .presets-l { margin: 14px 0 8px; font-size: 12px; color: var(--wa-muted); }
    .presets { display: flex; flex-wrap: wrap; gap: 6px; }
    button.preset {
      font: inherit; font-size: 12px; padding: 5px 11px; border-radius: 999px; cursor: pointer;
      border: 1px solid var(--wa-line); background: var(--wa-raised); color: var(--wa-muted);
      transition: color .12s ease-out, border-color .12s ease-out;
    }
    button.preset:hover:not(:disabled) { color: var(--wa-ink); border-color: var(--wa-line-strong); }

    /* Layers: one row per layer, coloured by kind, the shape pinned last. */
    .layers { display: flex; flex-direction: column; gap: 6px; }
    /* Every row is its own outlined container at rest. The border is what
       tells one row from the next, so nothing here may set it to transparent. */
    .layer {
      display: grid; grid-template-columns: 16px 4px ${THUMB_W}px minmax(0, 1fr) auto; align-items: center; gap: 8px;
      padding: 7px 8px 7px 5px; border-radius: var(--wa-r-md);
      border: 1px solid var(--wa-line); background: var(--wa-raised);
      cursor: pointer; user-select: none; position: relative; font-size: 13px;
      transition: background-color .12s ease-out, border-color .12s ease-out, box-shadow .12s ease-out;
    }
    /* A group's members keep their own outline, one shade deeper, so they read
       as nested and still separate from each other. */
    .layer.kid { background: var(--wa-panel); }
    .layer:hover { background: var(--wa-panel); border-color: color-mix(in srgb, var(--k) 45%, var(--wa-line)); }
    /* The selected row lights up in its kind's colour and casts a little of
       it, so the eye lands on it from across the panel. */
    .layer.hl {
      border-color: var(--k); background: color-mix(in srgb, var(--k) 12%, var(--wa-card));
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--k) 22%, transparent), 0 6px 18px color-mix(in srgb, var(--k) 18%, transparent);
    }
    .layer:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .layer.pick { box-shadow: inset 0 0 0 2px var(--wa-accent); }
    .layer .grip { color: var(--wa-muted); opacity: .5; display: grid; place-items: center; cursor: grab; }
    .layer:hover .grip { opacity: .9; }
    .layer .grip svg { width: 14px; height: 14px; }
    .layer .bar { width: 4px; height: 28px; border-radius: 2px; background: var(--k); box-shadow: 0 0 6px color-mix(in srgb, var(--k) 50%, transparent); }
    /* The layer's own picture, cropped to it, on the black face. The rounded
       black well is the picture's frame, so an empty thumb still reads as a
       slot rather than a hole. */
    .layer .thumb {
      width: ${THUMB_W}px; height: ${THUMB_H}px; border-radius: 8px; overflow: hidden; flex: none;
      background: #000; border: 1px solid var(--wa-line-strong); box-sizing: border-box; display: block;
    }
    .layer .thumb svg { display: block; width: 100%; height: 100%; }
    .layer.hl .thumb { border-color: color-mix(in srgb, var(--k) 70%, var(--wa-line)); }
    .layer.dim .thumb { opacity: .6; }
    .layer .name { display: flex; flex-direction: column; min-width: 0; gap: 1px; }
    .layer .name b { font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: flex; align-items: center; gap: 6px; }
    .layer .name .glyph { display: inline-grid; place-items: center; width: 18px; height: 18px; flex: none; }
    .layer .name .glyph svg { width: 16px; height: 16px; display: block; }
    .layer .name small { color: var(--wa-muted); font-size: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .layer .kind { font-size: 10.5px; font-weight: 700; letter-spacing: .05em; text-transform: uppercase; color: var(--k); }
    .layer.dim .name b { opacity: .55; }
    .layer .right { display: flex; align-items: center; gap: 2px; }
    .layer .badges { display: inline-flex; gap: 4px; }
    .badge { font-size: 11px; font-weight: 500; padding: 2px 8px; border-radius: 999px; background: color-mix(in srgb, var(--wa-ink) 8%, transparent); color: var(--wa-muted); white-space: nowrap; }
    .badge.tap { color: var(--wa-tap); background: color-mix(in srgb, var(--wa-tap) 16%, transparent); }
    .badge.states { color: color-mix(in srgb, var(--wa-states) 75%, var(--wa-ink)); background: color-mix(in srgb, var(--wa-states) 18%, transparent); }
    /* Reserved, not removed: taking the actions out of the layout made the
       name change width the moment the pointer arrived. The badges step aside
       for them instead, so the row keeps its width. */
    .layer .acts { display: none; gap: 0; }
    .layer:hover .acts, .layer.hl .acts, .layer:focus-within .acts { display: inline-flex; }
    .layer:hover .badges, .layer.hl .badges, .layer:focus-within .badges { display: none; }
    .layer .acts button.icon { width: 24px; height: 24px; }
    .layer .acts svg.ui-icon { width: 15px; height: 15px; }
    .layer.dragging { opacity: .4; }
    .layer.pinned { border-style: dashed; }
    .layer.pinned.hl { border-style: solid; }
    .layer.pinned .grip { cursor: default; opacity: .8; }
    .layer.pinned .bar { background: repeating-linear-gradient(180deg, var(--k) 0 3px, transparent 3px 6px); }
    .group-cta {
      display: flex; align-items: center; gap: 8px; font-size: 13px; padding: 6px 8px; margin-bottom: 6px; border-radius: 8px;
      border: 1px solid color-mix(in srgb, var(--wa-accent) 30%, transparent);
      background: color-mix(in srgb, var(--wa-accent) 12%, transparent);
    }
    .group-cta .spacer { flex: 1; }
    /* Picked for grouping: an accent ring, since the kind colour is taken. */
    .layer.multi { border-color: var(--wa-accent); box-shadow: inset 0 0 0 1px var(--wa-accent); }
    /* A folder row: the chevron folds it, the lock says whether it moves as
       one, and its members sit indented under a guide line. */
    .layer.group .chev {
      font: inherit; background: transparent; border: 0; color: var(--wa-muted); padding: 0; cursor: pointer;
      width: 16px; height: 16px; display: grid; place-items: center;
    }
    .layer.group .chev svg { width: 14px; height: 14px; transition: transform .15s ease-out; }
    .layer.group .chev[aria-expanded="false"] svg { transform: rotate(-90deg); }
    .layer.group .bar { background: repeating-linear-gradient(180deg, var(--k) 0 5px, transparent 5px 8px); }
    .layer.group.drop-into { box-shadow: inset 0 0 0 2px var(--wa-accent); }
    .layer .lockbtn { width: 24px; height: 24px; opacity: .55; }
    .layer .lockbtn svg.ui-icon { width: 15px; height: 15px; }
    .layer .lockbtn.on { opacity: 1; color: ${unsafeCSS(SECTION_COLOR.locked)}; filter: drop-shadow(0 0 4px ${unsafeCSS(SECTION_COLOR.locked)}); }
    .layer:hover .lockbtn, .layer.hl .lockbtn { opacity: 1; }
    .group-kids {
      margin: 0 0 0 14px; padding-left: 10px; display: flex; flex-direction: column; gap: 6px;
      border-left: 2px solid color-mix(in srgb, var(--wa-line) 60%, transparent);
    }
    /* Drop targets last, so the bar and the tinted edge beat whatever the row
       already had on its own border. */
    .layer.drop-before { border-top-color: var(--wa-accent); box-shadow: 0 -3px 0 0 var(--wa-accent); }
    .layer.drop-after { border-bottom-color: var(--wa-accent); box-shadow: 0 3px 0 0 var(--wa-accent); }

    /* The canvas column: one card holding the bar, the big preview and the
       strip of things about the whole complication. */
    .column.canvas > .card.canvas-card { padding: 0; overflow: hidden; }
    .banner { padding: 10px 14px; border-radius: 8px; margin-bottom: 12px; font-size: 13px; background: var(--wa-panel); }
    .banner.warn { border-left: 4px solid var(--warning-color, #ffa600); }
    .banner.err { border-left: 4px solid var(--error-color, #db4437); }
    .banner .acts { display: flex; gap: 6px; margin-top: 8px; flex-wrap: wrap; }
    .canvas-bar { display: flex; align-items: center; gap: 10px; padding: 12px 18px; border-bottom: 1px solid var(--wa-line); flex-wrap: wrap; font-size: 13px; }
    .canvas-bar .spacer { flex: 1; min-width: 0; }
    .canvas-bar .hint { margin: 0; }
    .canvas-bar label { display: inline-flex; align-items: center; gap: 8px; color: var(--wa-muted); }
    .canvas-bar label select { color: var(--wa-ink); font-weight: 500; }
    button.pick {
      font: inherit; font-size: 12.5px; font-weight: 500; padding: 5px 12px; border-radius: 999px; cursor: pointer;
      display: inline-flex; align-items: center; gap: 6px; white-space: nowrap;
      border: 1px solid var(--wa-line); background: var(--wa-raised); color: var(--wa-ink);
      transition: background-color .12s ease-out, border-color .12s ease-out;
    }
    button.pick:hover:not(:disabled) { border-color: var(--wa-line-strong); background: var(--wa-panel); }
    button.pick:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    button.pick.on { background: var(--wa-accent); color: var(--wa-accent-ink); border-color: transparent; }
    button.pick .glyph { font-size: 13px; line-height: 1; }
    /* The stage: a faint dot grid under a soft accent glow, so the watch face
       sits on a work surface rather than on the card. */
    .stage {
      display: grid; justify-items: center; padding: 30px 24px 20px;
      background:
        radial-gradient(ellipse at 50% 35%, color-mix(in srgb, var(--wa-accent) 10%, transparent) 0, transparent 65%),
        radial-gradient(color-mix(in srgb, var(--wa-ink) 9%, transparent) 1px, transparent 1px) 0 0 / 18px 18px;
    }
    .preview { text-align: center; position: relative; width: 100%; min-width: 0; }
    .preview svg {
      display: block; margin: 0 auto; background: #000; border-radius: 18px; touch-action: none;
      height: auto; max-width: 100%;
      box-shadow: 0 0 0 1px rgba(255,255,255,.08), 0 20px 50px rgba(0,0,0,.45);
    }
    .preview.rectangular svg { width: 100%; max-width: 900px; }
    .preview.circular svg { width: min(100%, 440px); border-radius: 50%; }
    .preview.corner svg { width: min(100%, 420px); background: #2c2c2e; }
    .preview.picking svg, .preview.picking svg * { cursor: crosshair; }
    .preview.inline .inline-line {
      display: inline-flex; align-items: center; justify-content: center; gap: 6px; min-width: 220px;
      padding: 8px 18px; border-radius: 999px; background: #000; color: #fff; font-size: 15px;
    }
    .preview.inline .inline-line svg { display: inline-block; margin: 0; background: transparent; border-radius: 0; }
    .preview.inline .inline-line.missing { color: #999; font-style: italic; }
    .under { text-align: center; font-size: 13px; color: var(--wa-muted); margin-top: 12px; }
    .under b { color: var(--wa-ink); font-weight: 500; }
    .strip { padding: 0 22px 26px; }
    .strip-row { padding: 20px 0 22px; }
    .strip-row + .strip-row { border-top: 1px solid var(--wa-line); }
    .strip-row .help { font-size: 12px; color: var(--wa-muted); margin-top: 8px; }
    /* A card title opens with a tinted mark, the same one the inspector's
       cards wear, so every column speaks the same language. */
    .panel-title .swatch {
      width: 26px; height: 26px; border-radius: 8px; flex: none; display: grid; place-items: center;
      background: color-mix(in srgb, var(--c, var(--wa-accent)) 18%, transparent);
      border: 1px solid color-mix(in srgb, var(--c, var(--wa-accent)) 35%, transparent);
      color: var(--c, var(--wa-accent));
    }
    .panel-title .swatch svg { width: 15px; height: 15px; }
    .settings { max-width: 1100px; }
    .settings .gen-row { display: grid; grid-template-columns: minmax(160px, 1.3fr) minmax(130px, .8fr) minmax(150px, 1fr) minmax(220px, 1.4fr); gap: 4px 18px; align-items: start; }
    .settings .gen-row .field { display: flex; flex-direction: column; align-items: stretch; gap: 5px; margin: 4px 0; min-width: 0; }
    .settings .gen-row .field > span { font-size: 12px; }
    .settings .flash-row { display: flex; align-items: center; gap: 10px; min-height: 32px; min-width: 0; }
    .settings .flash-row input.flash-color { width: 36px; height: 28px; padding: 2px; }
    .settings .flash-row .muted { color: var(--wa-muted); font-size: 13px; }
    .settings .entity-field, .settings .hint { max-width: 800px; }
    /* Shared values: a chip per named value, laid out as a titled sub-section
       of the settings rather than a loose row of boxes. The whole chip opens
       the editor, so it carries the hover and selected states a row would, and
       the delete button stays out of the way until the pointer is on it. */
    .values-list { margin-top: 14px; }
    .values-head { display: flex; align-items: baseline; flex-wrap: wrap; gap: 10px; margin-bottom: 8px; }
    .values-head .sub { font-size: 12px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; color: var(--wa-muted); }
    .values-head .help { margin: 0; }
    .values-list .data { display: flex; flex-wrap: wrap; gap: 8px; }
    .values-list .empty { font-size: 12px; color: var(--wa-muted); margin: 0; }
    .values-list .datum {
      gap: 8px; max-width: 320px; padding: 5px 5px 5px 10px; border-radius: 10px;
      background: var(--wa-card); border: 1px solid var(--wa-line);
      transition: border-color .12s ease-out, background-color .12s ease-out;
    }
    .values-list .datum + .datum { box-shadow: none; }
    .values-list .datum:hover { border-color: var(--wa-accent); background: color-mix(in srgb, var(--wa-accent) 7%, var(--wa-card)); }
    /* Selected: the same tint the inspector gives its complication section. */
    .values-list .datum.hl { border-color: var(--c); background: color-mix(in srgb, var(--c) 12%, var(--wa-card)); }
    .values-list .datum .name { flex: none; min-width: 0; max-width: 160px; font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .values-list .datum .meta {
      flex: none; min-width: 0; max-width: 140px; opacity: 1; color: var(--wa-muted);
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 11.5px;
      background: var(--wa-panel); border-radius: 999px; padding: 1px 8px;
      overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    }
    .values-list .datum .meta.none { font-family: inherit; font-style: italic; background: transparent; padding: 1px 0; }
    .values-list .datum button.icon { width: 24px; height: 24px; opacity: 0; pointer-events: none; }
    .values-list .datum button.icon svg.ui-icon { width: 15px; height: 15px; }
    .values-list .datum:hover button.icon, .values-list .datum:focus-within button.icon { opacity: .7; pointer-events: auto; }
    .values-list .datum button.icon:hover:not(:disabled), .values-list .datum button.icon:focus-visible { opacity: 1; }
    .tiles { display: flex; gap: 10px; flex-wrap: wrap; }
    .tile-wrap { position: relative; display: flex; }
    .tile-wrap .tile-x { position: absolute; top: 4px; right: 4px; opacity: .45; }
    .tile-wrap:hover .tile-x, .tile-wrap .tile-x:focus-visible { opacity: 1; }
    .tile-wrap .tile-x:disabled { opacity: .2; cursor: not-allowed; }
    button.tile {
      width: 180px; height: 104px; border-radius: var(--wa-r-md); background: var(--wa-raised); border: 1px solid var(--wa-line);
      display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px;
      color: var(--wa-muted); font: inherit; font-size: 13px; padding: 8px; cursor: pointer; overflow: hidden;
      transition: border-color .12s ease-out, box-shadow .12s ease-out, color .12s ease-out;
    }
    button.tile:hover:not(:disabled) { border-color: var(--wa-line-strong); color: var(--wa-ink); }
    button.tile:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    button.tile[aria-pressed="true"] { border-color: var(--wa-accent); color: var(--wa-ink); box-shadow: 0 0 0 3px color-mix(in srgb, var(--wa-accent) 22%, transparent), 0 8px 24px color-mix(in srgb, var(--wa-accent) 20%, transparent); }
    button.tile.off { border-style: dashed; background: transparent; }
    .tile .art { width: 160px; height: 62px; display: grid; place-items: center; pointer-events: none; }
    .tile .art svg { display: block; max-width: 100%; max-height: 62px; width: auto; height: auto; background: #000; border-radius: 6px; }
    .tile.circular .art svg { border-radius: 50%; }
    .tile.corner .art svg { background: #2c2c2e; }
    .tile .art .inline-line { font-size: 11px; padding: 3px 10px; min-width: 0; display: inline-flex; align-items: center; gap: 4px; border-radius: 999px; background: #000; color: #fff; }
    .tile .art .inline-line svg { background: transparent; border-radius: 0; }
    .tile .ghost { border: 1.5px dashed var(--wa-line); }
    .tile .ghost.rectangular { width: 130px; height: 48px; border-radius: 8px; }
    .tile .ghost.circular { width: 52px; height: 52px; border-radius: 50%; }
    .tile .ghost.corner { width: 52px; height: 52px; border-radius: 50% 0 0 0; border-right: 0; border-bottom: 0; }
    .tile .ghost.inline { width: 120px; height: 20px; border-radius: 10px; }
    .tile .lbl { font-weight: 500; display: flex; gap: 6px; align-items: center; white-space: nowrap; }
    .tile .lbl small { font-weight: 400; opacity: .7; }
    .chips { display: flex; gap: 6px; flex-wrap: wrap; align-items: center; }
    .chips.values { gap: 8px; }
    .vchip {
      display: inline-flex; align-items: center; gap: 8px; font: inherit; font-size: 13px; color: inherit;
      background: var(--wa-card); border: 1px solid var(--wa-line); border-radius: 999px; padding: 5px 12px 5px 6px; cursor: pointer;
    }
    .vchip:hover { border-color: var(--wa-accent); }
    .vchip .dom { width: 22px; height: 22px; border-radius: 50%; background: color-mix(in srgb, var(--k) 20%, transparent); color: var(--k); display: grid; place-items: center; flex: none; }
    .vchip .dom svg { width: 13px; height: 13px; }
    .vchip b { font-weight: 500; }
    .vchip .val { color: var(--wa-muted); border-bottom: 1px dashed var(--wa-line); }
    .vchip.testing { border-color: var(--wa-states); }
    .vchip.testing .val { color: color-mix(in srgb, var(--wa-states) 70%, var(--wa-ink)); border-bottom-color: var(--wa-states); }
    .vchip input { width: 110px; font: inherit; font-size: 13px; padding: 2px 6px; border-radius: 6px; border: 1px solid var(--wa-states); background: var(--wa-card); color: inherit; }
    .testing-pill { display: inline-flex; align-items: center; gap: 8px; font-size: 12px; text-transform: none; letter-spacing: 0; color: color-mix(in srgb, var(--wa-states) 70%, var(--wa-ink)); }
    .testing-pill button { font: inherit; font-size: 12px; font-weight: 500; background: var(--wa-states); color: #1a1600; border: 0; border-radius: 999px; padding: 2px 9px; cursor: pointer; }
    .empty { opacity: .6; padding: 24px; text-align: center; }

    /* The inspector: crumbs on top, then one card per section of the thing
       selected, tinted by what it is. */
    .column.inspector { padding: 0; }
    .insp-head { display: flex; align-items: center; gap: 8px; padding: 12px 14px; border-bottom: 1px solid var(--wa-line); position: sticky; top: 0; background: var(--wa-card); z-index: 5; }
    .crumbs { flex: 1; min-width: 0; display: flex; align-items: center; gap: 6px; flex-wrap: wrap; font-size: 13px; color: var(--wa-muted); }
    .crumbs button { font: inherit; font-size: 13px; background: transparent; border: 0; padding: 3px 6px; border-radius: 5px; color: var(--wa-muted); cursor: pointer; }
    .crumbs button:hover { background: var(--wa-panel); color: var(--wa-ink); }
    .crumbs .sep { opacity: .5; }
    .here {
      display: inline-flex; align-items: center; gap: 6px; padding: 3px 8px 3px 6px; border-radius: 6px;
      background: color-mix(in srgb, var(--k) 14%, transparent); border: 1px solid color-mix(in srgb, var(--k) 40%, transparent);
      color: var(--wa-ink); font-weight: 500;
    }
    .kchip { font-size: 10px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: #fff; background: var(--k); padding: 1px 5px; border-radius: 3px; }
    .insp-head .expand { flex: none; font: inherit; font-size: 12px; font-weight: 500; color: var(--wa-accent); background: transparent; border: 0; padding: 3px 4px; cursor: pointer; }
    .insp-body { padding: 14px 14px 30px; }
    .empty-insp { padding: 40px 20px; text-align: center; color: var(--wa-muted); display: flex; flex-direction: column; gap: 10px; align-items: center; font-size: 13px; }
    .empty-insp svg { width: 40px; height: 40px; opacity: .5; }
    .empty-insp b { color: var(--wa-ink); font-weight: 500; font-size: 14px; }
    .sec {
      --c: var(--wa-accent);
      border: 1px solid color-mix(in srgb, var(--c) 28%, var(--wa-line)); border-radius: var(--wa-r-md);
      background: var(--wa-card); margin-bottom: 10px; overflow: hidden;
      transition: border-color .12s ease-out, box-shadow .12s ease-out;
    }
    .sec[data-open="true"] { border-color: color-mix(in srgb, var(--c) 55%, var(--wa-line)); box-shadow: 0 4px 16px color-mix(in srgb, var(--c) 10%, transparent); }
    .sec-h { display: flex; align-items: center; gap: 10px; padding: 11px 12px; background: color-mix(in srgb, var(--c) 12%, var(--wa-card)); cursor: pointer; transition: background-color .12s ease-out; }
    .sec-h:hover { background: color-mix(in srgb, var(--c) 20%, var(--wa-card)); }
    .sec-h:focus-visible { outline: none; box-shadow: inset 0 0 0 2px var(--c); }
    .sec-h .swatch { width: 28px; height: 28px; border-radius: 8px; background: color-mix(in srgb, var(--c) 20%, transparent); border: 1px solid color-mix(in srgb, var(--c) 35%, transparent); color: var(--c); flex: none; display: grid; place-items: center; }
    .sec-h .swatch svg { width: 15px; height: 15px; }
    .sec-h .tt { display: flex; flex-direction: column; min-width: 0; flex: 1; }
    .sec-h h4 { margin: 0; font-size: 14px; font-weight: 600; letter-spacing: -.01em; }
    .sec-h .sum { color: var(--wa-muted); font-size: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .sec-h .chev { color: var(--wa-muted); opacity: .7; flex: none; transition: transform .15s ease-out; }
    .sec-h .chev svg { width: 16px; height: 16px; }
    .sec[data-open="true"] .sec-h .chev { transform: rotate(180deg); }
    .sec-b { padding: 10px 12px 14px; }
    /* The picked layers, read only: the Layers list's colour coding without
       its controls, so the eye can check the pick without leaving the form. */
    .picked { display: flex; flex-direction: column; gap: 5px; margin-bottom: 4px; }
    .picked .row { display: grid; grid-template-columns: 4px minmax(0, 1fr); align-items: center; gap: 8px; font-size: 13px; }
    .picked .row .bar { width: 4px; height: 22px; border-radius: 2px; background: var(--k); }
    .picked .row .name { display: flex; align-items: center; gap: 6px; min-width: 0; }
    .picked .row .name b { font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .picked .row .glyph { display: inline-grid; place-items: center; width: 18px; height: 18px; flex: none; }
    .picked .row .glyph svg { width: 16px; height: 16px; display: block; }
    .picked .row .kind { font-size: 11px; font-weight: 600; letter-spacing: .04em; text-transform: uppercase; color: var(--k); flex: none; }
    .adders { display: flex; gap: 6px; flex-wrap: wrap; align-items: center; margin-top: 8px; }
    dialog.preset-dialog {
      width: min(420px, calc(100vw - 32px)); padding: 16px 18px 18px;
      border: 1px solid var(--wa-line); border-radius: 12px;
      background: var(--wa-card); color: var(--wa-ink);
      box-shadow: 0 12px 40px rgba(0,0,0,.4);
    }
    dialog.preset-dialog::backdrop { background: rgba(0,0,0,.45); }
    dialog.preset-dialog h2 { margin: 0 0 4px; font-size: 15px; font-weight: 500; }
    .ok { color: var(--success-color, #43a047); }
    .warn { color: var(--warning-color, #ffa600); }
    .err, .error { color: var(--error-color, #db4437); }
    .kv { display: grid; grid-template-columns: auto 1fr; gap: 2px 12px; font-size: 13px; }
    .kv dt { opacity: .7; }
    .kv dd { margin: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .send { font-size: 13px; display: inline-flex; align-items: center; gap: 6px; }
    .send.sent { color: var(--success-color, #43a047); }
    .send.sending { opacity: .7; }
    .send.offline { color: var(--warning-color, #ffa600); }
    header .send.sent { color: inherit; }
    ul { list-style: none; margin: 0; padding: 0; }
    .datum { padding: 6px 8px; border-radius: 6px; cursor: pointer; font-size: 13px; display: flex; align-items: center; gap: 6px; }
    .datum + .datum { box-shadow: inset 0 1px 0 var(--wa-line); }
    .datum:hover, .datum.hl { box-shadow: none; }
    .datum:hover { background: var(--wa-panel); }
    .datum.hl { background: color-mix(in srgb, var(--wa-accent) 14%, transparent); }
    .datum .name { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .datum .meta { font-size: 12px; opacity: .7; }
    .branches { display: flex; flex-wrap: wrap; gap: 4px; }
    .branches button {
      font: inherit; font-size: 12px; padding: 2px 8px; border-radius: 999px;
      border: 1px solid var(--wa-line); background: transparent; color: inherit; cursor: pointer;
    }
    .branches button.active { background: var(--wa-accent); color: var(--wa-accent-ink); border-color: transparent; }
    .branches button.live-match { border-color: var(--success-color, #43a047); }
    pre { font-size: 11px; white-space: pre-wrap; word-break: break-all; max-height: 400px; overflow: auto; background: var(--wa-panel); padding: 8px; border-radius: 6px; }
    button.link { font: inherit; background: none; border: none; color: var(--wa-accent); cursor: pointer; padding: 0; }
    .rule-box { border: 1px solid var(--wa-line); border-radius: 8px; padding: 8px; margin: 8px 0; }
    .case-box { border-left: 3px solid var(--wa-line); padding: 4px 8px; margin: 8px 0; }
    .case-box.match { border-left-color: var(--success-color, #43a047); }
    .case-box.otherwise { border-left-style: dashed; }
    .test-box, .change-box { background: var(--wa-panel); border-radius: 6px; padding: 4px 8px; margin: 6px 0; }
    .rule-head { display: flex; align-items: center; gap: 4px; font-size: 13px; }
    .ok { color: var(--success-color, #43a047); font-size: 12px; }
    .no { color: var(--error-color, #db4437); font-size: 12px; }
    select.adder { font: inherit; font-size: 12px; padding: 3px 6px; margin-top: 4px; }

    /* Form controls: label on the left, control on the right, the way a
       settings page reads. Fields that carry their own machinery (the entity
       search, the value chip) keep the label above, so nothing inside them
       has to fit a half-width column. */
    .field {
      display: grid; grid-template-columns: minmax(84px, 32%) minmax(0, 1fr); align-items: center;
      gap: 4px 10px; margin: 6px 0; font-size: 13px;
    }
    .field > span { color: var(--wa-muted); font-size: 13px; line-height: 1.25; }
    .field input[type=text], .field input[type=number], .field select, .field textarea { width: 100%; min-width: 0; }
    /* Inside a tinted section the focus ring takes the section's colour. */
    .field input:focus-visible, .field select:focus-visible, .field textarea:focus-visible { border-color: var(--c, var(--wa-accent)); box-shadow: 0 0 0 3px color-mix(in srgb, var(--c, var(--wa-accent)) 28%, transparent); }
    .field .mono, code { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 12px; }
    .field.slider .slider-row { display: flex; align-items: center; gap: 8px; min-width: 0; }
    .field.slider input[type=range] { flex: 1; min-width: 60px; }
    .field.slider .slider-value { min-width: 44px; text-align: right; opacity: .85; }
    .field.check { grid-template-columns: auto minmax(0, 1fr); gap: 10px; }
    .field.check > span { color: inherit; }
    .field.check .mixed { color: var(--wa-muted); font-size: 12px; }
    .field.entity-field, .field.value-chip-field { display: flex; flex-direction: column; gap: 4px; align-items: stretch; }
    .field.entity-field > span, .field.value-chip-field > span { font-size: 12px; }
    .color-row { display: flex; align-items: center; gap: 8px; min-width: 0; }
    .color-row input[type=color] { width: 34px; height: 28px; }
    .color-row input[type=range] { flex: 1; min-width: 40px; }
    .color-row input.hex { width: 90px; flex: none; }
    .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 0 10px; }
    .grid4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0 6px; }
    .grid2 .field, .grid4 .field { display: flex; flex-direction: column; align-items: stretch; gap: 3px; }
    .grid2 .field > span, .grid4 .field > span { font-size: 12px; }
    .grid4 input[type=number] { text-align: right; padding-left: 4px; padding-right: 6px; }
    .row-inline { display: flex; align-items: flex-end; gap: 4px; }
    .row-inline .field { flex: 1; }
    .hint { font-size: 12px; opacity: .75; margin: 4px 0; }
    .hint.warn { opacity: 1; }
    details.sub { margin: 6px 0; }
    details.sub summary { font-size: 12px; opacity: .8; cursor: pointer; }
    .chip { display: inline-flex; align-items: center; gap: 4px; font-size: 12px; padding: 2px 8px; border: 1px solid var(--wa-line); border-radius: 999px; }
    button.chip { font: inherit; font-size: 12px; background: transparent; color: inherit; cursor: pointer; }
    button.chip.active { background: var(--wa-accent); color: var(--wa-accent-ink); border-color: transparent; }
    .chip-add { font: inherit; font-size: 12px; padding: 2px 8px; border-radius: 999px; border: 1px dashed var(--wa-line); background: transparent; color: inherit; cursor: pointer; }
    .value-editor { border-left: 2px solid var(--wa-line); padding-left: 10px; margin: 4px 0 8px; }

    /* Value chip: one line saying what a value is, with the full form behind it.
       The form lives in a popover, which the browser draws in the top layer, so
       a scrolling card cannot clip it. Its position is set in editors.ts. */
    .value-chip-field { gap: 4px; }
    button.value-chip {
      display: flex; align-items: center; gap: 8px; width: 100%;
      font: inherit; font-size: 13px; text-align: left; padding: 6px 10px; border-radius: 8px;
      border: 1px solid var(--wa-line); background: var(--wa-card);
      color: inherit; cursor: pointer;
    }
    button.value-chip:hover { border-color: var(--wa-accent); }
    button.value-chip:focus-visible { outline: 2px solid var(--wa-accent); outline-offset: 1px; }
    .value-chip .chip-text { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .value-chip .chip-now { max-width: 45%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; opacity: .65; }
    .value-chip .chip-caret { opacity: .55; font-size: 11px; }
    .value-pop {
      position: fixed; inset: auto; margin: 0; width: min(430px, calc(100vw - 16px));
      max-height: 70vh; overflow: auto; padding: 10px 14px 14px;
      border: 1px solid var(--wa-line); border-radius: 12px;
      background: var(--wa-card); color: var(--wa-ink);
      box-shadow: 0 10px 30px rgba(0,0,0,.35);
    }
    .value-pop::backdrop { background: transparent; }
    .pop-head { display: flex; align-items: center; gap: 8px; font-size: 13px; margin-bottom: 2px; position: sticky; top: -10px; background: inherit; padding: 4px 0; }
    .pop-head .spacer { flex: 1; }
    .value-pop .field { display: flex; flex-direction: column; align-items: stretch; gap: 3px; }

    /* States table: one rule as rows. A two-state light is two lines, so the
       row has to stay one line: every control in it is sized to the text it
       holds rather than to the column. */
    .states-table { width: 100%; border-collapse: collapse; margin: 8px 0 4px; font-size: 13px; }
    .states-table th {
      text-align: left; font-weight: 500; font-size: 11px; text-transform: uppercase; letter-spacing: .04em;
      opacity: .6; padding: 2px 6px; border-bottom: 1px solid var(--wa-line); white-space: nowrap;
    }
    .states-table th button.icon { opacity: 0; }
    .states-table th:hover button.icon, .states-table th button.icon:focus-visible { opacity: .7; }
    .states-table th.acts { width: 1%; }
    .states-table td { padding: 3px 6px; border-bottom: 1px solid var(--wa-line); vertical-align: middle; }
    .states-table td.empty-row { opacity: .6; padding: 12px 6px; border-bottom: none; }
    .states-table tr.state-row { cursor: pointer; }
    .states-table tr.state-row:hover td { background: var(--wa-panel); }
    .states-table tr.state-row.forced td { background: var(--wa-panel); }
    .states-table tr.state-row.forced td { background: color-mix(in srgb, var(--wa-states) 18%, transparent); }
    .states-table td.when { white-space: nowrap; }
    .states-table td.acts { width: 1%; white-space: nowrap; }
    .states-table td.acts button.icon { opacity: 0; }
    .states-table tr:hover td.acts button.icon, .states-table td.acts button.icon:focus-visible { opacity: .8; }
    .row-flag { display: inline-block; width: 12px; color: var(--success-color, #43a047); font-size: 11px; }
    tr.forced .row-flag { color: color-mix(in srgb, var(--wa-states) 70%, var(--wa-ink)); }
    .when-cell { display: inline-flex; align-items: center; gap: 4px; }
    .when-cell select.when-op { font: inherit; font-size: 12px; padding: 2px 4px; border-radius: 6px; border: 1px solid transparent; background: transparent; color: inherit; }
    .when-cell select.when-op:hover { border-color: var(--wa-line); }
    .when-and { opacity: .6; font-size: 12px; }
    .when-otherwise { opacity: .75; font-style: italic; }
    .rhs { display: inline-flex; align-items: center; gap: 2px; }
    .rhs .value-chip-field { margin: 0; }
    input.cellin {
      font: inherit; font-size: 13px; width: 90px; padding: 3px 6px; border-radius: 6px;
      border: 1px solid var(--wa-line); background: var(--wa-card); color: inherit;
    }
    input.cellin.num { width: 64px; }
    button.more { font-size: 12px; opacity: .5; }
    button.cell {
      display: inline-flex; align-items: center; gap: 6px; max-width: 190px;
      font: inherit; font-size: 13px; text-align: left; padding: 3px 6px; border-radius: 6px;
      border: 1px solid transparent; background: transparent; color: inherit; cursor: pointer;
    }
    button.cell:hover { border-color: var(--wa-line); background: var(--wa-card); }
    button.cell.empty { opacity: .45; font-style: italic; }
    .cell-word { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .swatch { width: 12px; height: 12px; border-radius: 3px; border: 1px solid var(--wa-line); flex: none; }
    button.cell svg { display: block; }
    .states-foot { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; margin-top: 6px; }
    .states-foot .spacer { flex: 1; }
    .states-switch { display: flex; align-items: baseline; gap: 8px; margin-top: 8px; }
    .states-switch .hint { margin: 0; }
    .confirm-row { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
    .value-chip-field.compact { margin: 0; }
    .value-chip-field.compact button.value-chip { padding: 3px 8px; font-size: 13px; max-width: 190px; }

    /* Entity search. The friendly name and the entity id both matter and both
       are long, so they stack on two lines instead of fighting for one. */
    .entity-field { position: relative; }
    .entity-results { border: 1px solid var(--wa-line); border-radius: 8px; margin-top: 4px; max-height: 300px; overflow: auto; }
    button.ent {
      display: flex; align-items: center; gap: 8px; width: 100%;
      font: inherit; font-size: 13px; text-align: left; padding: 6px 8px;
      background: none; border: none; color: inherit; cursor: pointer;
    }
    button.ent + button.ent { border-top: 1px solid var(--wa-line); }
    button.ent:hover, button.ent.hl { background: var(--wa-panel); }
    .ent .ent-main { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 1px; }
    .ent .ent-name { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .ent .ent-id { font-size: 11px; opacity: .6; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .ent .ent-state { flex: none; font-size: 11px; opacity: .8; max-width: 34%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .entity-current { display: flex; gap: 8px; align-items: baseline; font-size: 12px; opacity: .8; margin-top: 3px; }
    .entity-current .ent-name { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

    /* Symbol picker */
    .sym-browse { margin: 6px 0; }
    .sym-controls { display: flex; gap: 6px; margin-bottom: 6px; }
    .sym-controls input[type=search] { flex: 1; min-width: 0; }
    .sym-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(64px, 1fr)); gap: 4px; max-height: 240px; overflow-y: auto; padding: 2px; }
    .sym-grid.one-row { display: flex; flex-wrap: nowrap; max-height: none; overflow-x: auto; overflow-y: hidden; }
    .sym-grid.one-row button.sym { flex: 0 0 64px; }
    button.sym { display: flex; flex-direction: column; align-items: center; gap: 3px; padding: 5px 2px; background: none; cursor: pointer; color: var(--wa-ink); border: 1px solid transparent; border-radius: 6px; overflow: hidden; }
    button.sym:hover { border-color: var(--wa-line); background: var(--wa-panel); }
    button.sym.on { border-color: var(--wa-accent); }
    .sym-glyph { display: flex; align-items: center; justify-content: center; height: 24px; }
    .sym-glyph svg path { fill: currentColor; fill-opacity: 1; }
    .sym-none { font-size: 14px; opacity: .4; }
    .sym-name { font-size: 9px; line-height: 1.1; text-align: center; opacity: .8; overflow-wrap: anywhere; max-height: 22px; overflow: hidden; }
    @media (prefers-reduced-motion: reduce) { * { transition: none !important; } }
  `;

  // ── lifecycle ─────────────────────────────────────────────────────────

  override connectedCallback() {
    super.connectedCallback();
    this.loadColumnWidths();
    this.sizeObserver.observe(this);
    window.addEventListener("keydown", this.keyHandler);
    window.addEventListener("keyup", this.keyUpHandler);
    window.addEventListener("beforeunload", this.beforeUnload);
    void this.loadOwners();
  }

  /** Watches the panel itself, not the window, so opening or closing the Home
   * Assistant sidebar re-fits the columns too. */
  private sizeObserver = new ResizeObserver((entries) => {
    const w = entries[0]?.contentRect.width ?? 0;
    if (Math.abs(w - this.panelWidth) >= 1) this.panelWidth = w;
  });

  // ── column widths ─────────────────────────────────────────────────────

  private loadColumnWidths() {
    try {
      const raw = window.localStorage.getItem(COL_STORE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw) as { left?: unknown; right?: unknown };
      if (typeof saved.left === "number") this.colLeft = clampColumn(saved.left);
      if (typeof saved.right === "number") this.colRight = clampColumn(saved.right);
    } catch {
      /* A browser with storage off keeps the defaults. */
    }
  }

  private saveColumnWidths() {
    try {
      window.localStorage.setItem(COL_STORE_KEY, JSON.stringify({ left: this.colLeft, right: this.colRight }));
    } catch {
      /* Storage off: the widths still work for this visit. */
    }
  }

  private renderGutter(side: "left" | "right") {
    return html`<div class="gutter ${side}" role="separator" aria-orientation="vertical"
      title="Drag to resize. Double-click to reset."
      @pointerdown=${(e: PointerEvent) => this.beginColumnDrag(side, e)}
      @dblclick=${() => {
        if (side === "left") this.colLeft = COL_LEFT_DEFAULT;
        else this.colRight = COL_RIGHT_DEFAULT;
        this.saveColumnWidths();
      }}></div>`;
  }

  /** Drag one gutter. The right column grows as the pointer moves left, so
   * both gutters push the middle column rather than the page. */
  private beginColumnDrag(side: "left" | "right", start: PointerEvent) {
    if (start.button !== 0) return;
    start.preventDefault();
    const bar = start.currentTarget as HTMLElement;
    const startX = start.clientX;
    // Drag from the width on screen, not from the stored preference: on a
    // squeezed panel those differ, and starting from the stored one would make
    // the bar jump away from the pointer on the first move.
    const shown = columnFit(this.panelWidth, this.colLeft, this.colRight);
    const base = side === "left" ? shown.left : shown.right;
    bar.setPointerCapture(start.pointerId);
    bar.classList.add("dragging");
    const move = (ev: PointerEvent) => {
      if (ev.pointerId !== start.pointerId) return;
      const dx = ev.clientX - startX;
      const next = clampColumn(side === "left" ? base + dx : base - dx);
      if (side === "left") this.colLeft = next;
      else this.colRight = next;
    };
    const finish = (ev: PointerEvent) => {
      if (ev.pointerId !== start.pointerId) return;
      cleanup();
      this.saveColumnWidths();
    };
    const cleanup = () => {
      bar.classList.remove("dragging");
      bar.removeEventListener("pointermove", move);
      bar.removeEventListener("pointerup", finish);
      bar.removeEventListener("pointercancel", finish);
      try {
        bar.releasePointerCapture(start.pointerId);
      } catch {
        /* already released */
      }
    };
    bar.addEventListener("pointermove", move);
    bar.addEventListener("pointerup", finish);
    bar.addEventListener("pointercancel", finish);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.sizeObserver.disconnect();
    window.removeEventListener("keydown", this.keyHandler);
    window.removeEventListener("keyup", this.keyUpHandler);
    window.removeEventListener("beforeunload", this.beforeUnload);
    void this.unsubscribe?.();
    if (this.templateTimer) window.clearInterval(this.templateTimer);
    if (this.debounceTimer) window.clearTimeout(this.debounceTimer);
    if (this.countdownTimer !== undefined) window.clearInterval(this.countdownTimer);
    if (this.sendTimer !== undefined) window.clearTimeout(this.sendTimer);
    this.cancelGesture?.();
  }

  private beforeUnload = (e: BeforeUnloadEvent) => {
    if (this.draft?.dirty) e.preventDefault();
  };

  /** One-second re-render while any preview shows a live countdown, so the
   * remaining time ticks like it does on the watch. Cleared as soon as no
   * countdown is live (and on disconnect). */
  private countdownTimer?: number;
  private syncCountdownTicker(layouts: ResolvedAll) {
    const canvas = [layouts.rectangular, layouts.circular, layouts.corner]
      .filter((l): l is ReturnType<Resolver["resolveLayout"]> => l !== undefined);
    const live = layouts.inline?.countdownEnd !== undefined || canvas.some((l) =>
      l.bezelCountdownEnd !== undefined ||
      l.elements.some((el) => el.kind === "text" && el.countdownEnd !== undefined));
    if (live && this.countdownTimer === undefined) {
      this.countdownTimer = window.setInterval(() => this.requestUpdate(), 1000);
    } else if (!live && this.countdownTimer !== undefined) {
      window.clearInterval(this.countdownTimer);
      this.countdownTimer = undefined;
    }
  }

  /** The selection the inspector was last drawn for. A re-render for an edit
   * keeps its scroll position; a different selection starts at the top. */
  private lastInspectKey?: string;

  protected override willUpdate(changed: PropertyValues) {
    // The dark skin follows Home Assistant's own dark mode, so the panel
    // never sits as a black island in a light frontend. Without the flag
    // (an old frontend) the OS setting decides.
    if (changed.has("hass")) {
      const dark = this.hass?.themes?.darkMode ?? window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
      this.toggleAttribute("dark", dark);
    }
    // A different selection starts with every card open, whatever the last
    // one had folded; One at a time is a choice made per selection.
    if (changed.has("inspect")) {
      const before = changed.get("inspect") as Inspect | undefined;
      if (before === undefined || inspectKey(before) !== inspectKey(this.inspect)) {
        this.openSections = new Set(ALL_SECTIONS);
      }
    }
  }

  protected override updated(changed: PropertyValues) {
    const key = inspectKey(this.inspect);
    if (key !== this.lastInspectKey) {
      this.lastInspectKey = key;
      const column = this.renderRoot.querySelector<HTMLElement>(".column.inspector");
      if (column) column.scrollTop = 0;
    }
    // Bring the pointed row into view, or a long Layers card can answer off
    // screen. `nearest` means a row already visible never moves.
    if (changed.has("pickHoverId") && this.pickHoverId !== undefined) {
      this.renderRoot.querySelector<HTMLElement>(".layer.pick")?.scrollIntoView({ block: "nearest" });
    }
    if (changed.has("hass") && this.draft) {
      const snapshot: Record<string, unknown> = {};
      for (const id of this.compiled?.entities.keys() ?? []) snapshot[id] = this.hass.states[id]?.last_updated;
      const before = JSON.stringify(this.lastStatesSnapshot ?? {});
      const after = JSON.stringify(snapshot);
      if (before !== after) {
        this.lastStatesSnapshot = snapshot;
        this.requestUpdate();
      }
    }
  }

  private onKey(e: KeyboardEvent) {
    // Escape leaves pick mode. It runs before the modifier gate, and only when
    // picking, so nothing else that uses Escape (the preset dialog, the entity
    // search) loses its key.
    if (e.key === "Escape" && this.picking) {
      e.preventDefault();
      this.togglePicking(false);
      return;
    }
    // Escape also drops the timestamp chip's selection. Not claimed (no
    // preventDefault), so a dialog that is open keeps its Escape too.
    if (e.key === "Escape") this.timestampActiveId = undefined;
    const focused = e.composedPath()[0] as HTMLElement | undefined;
    const inField = !!focused?.tagName?.match(/INPUT|TEXTAREA|SELECT/) || focused?.isContentEditable === true;
    // Arrows nudge what is selected on the preview, but only when they are not
    // a caret key in a field and nothing else has claimed them: ⌘← is history,
    // ⌥→ is a word. Shift is the coarse step, so it is allowed through.
    const step = ARROW_STEP[e.key];
    if (step && !inField && !e.metaKey && !e.ctrlKey && !e.altKey) {
      if (this.nudge(step.dx, step.dy, e.shiftKey)) {
        e.preventDefault();
        this.heldArrows.add(e.key);
      }
      return;
    }
    const mod = e.metaKey || e.ctrlKey;
    if (!mod) return;
    if (e.key === "s") {
      e.preventDefault();
      void this.save();
    } else if (e.key === "z" && !inField) {
      e.preventDefault();
      if (e.shiftKey) this.redo();
      else this.undo();
    } else if (e.key === "y" && !inField) {
      e.preventDefault();
      this.redo();
    }
  }

  // ── data loading ──────────────────────────────────────────────────────

  private get canEdit(): boolean {
    return !!this.hass.user?.is_admin && !this.readOnlyReason && !!this.draft;
  }

  private async loadOwners() {
    try {
      const reply = await fetchOwners(this.hass);
      this.owners = reply.owners;
      this.maxSchemaVersion = reply.max_schema_version;
      this.loadError = undefined;
      if (!this.ownerId && this.owners.length > 0) {
        const withData = this.owners.find((o) => o.complication_count > 0) ?? this.owners[0]!;
        await this.selectOwner(withData.owner_watch_id);
      }
    } catch (err) {
      this.loadError = `Could not load devices: ${errText(err)}`;
    }
  }

  private async selectOwner(ownerId: string) {
    if (this.draft?.dirty && !this.confirmDiscard()) {
      this.requestUpdate();
      return;
    }
    this.ownerId = ownerId;
    this.selectedId = undefined;
    this.moveTarget = undefined;
    this.moveError = undefined;
    // Default the preview to this watch's own case when the app reported one.
    // A manual dropdown pick survives record switches but re-defaults when a
    // different watch is selected — that's the watch being previewed now.
    const reported = caseForScreenSize(
      this.owners.find((o) => o.owner_watch_id === ownerId)?.screen_size,
    );
    if (reported) this.previewCase = reported.label;
    this.clearDraft();
    await this.unsubscribe?.();
    this.unsubscribe = await subscribeChanges(this.hass, ownerId, () => void this.loadRecords());
    await this.loadRecords();
  }

  private async loadRecords() {
    if (!this.ownerId) return;
    try {
      const reply = await fetchList(this.hass, this.ownerId);
      this.records = reply.records;
      this.maxSchemaVersion = reply.max_schema_version;
      this.presets = reply.presets ?? [];
      this.occupied = reply.occupied
        ?? this.presets.map((p): OccupiedSlot => ({ slot: p.slot, name: p.name, kind: "preset", home: "" }));
      this.pages = reply.pages ?? [];
      this.serverToken = reply.token;
      this.appliedToken = reply.applied_token;
      this.polling = reply.polling ?? false;
      if (this.appliedToken === this.serverToken) this.endSendWait();
      const still = this.records.find((r) => r.id === this.selectedId);
      if (still) {
        if (this.draft && this.draft.dirty) {
          // Keep the draft; tell the user the server moved.
          this.remoteRevision = still.revision !== this.draft.baseRevision ? still.revision : undefined;
        } else if (this.draft && still.revision !== this.draft.baseRevision) {
          this.openRecord(still);
        }
      } else if (this.draft && this.selectedId && this.draft.baseRevision !== null) {
        // Deleted under us. Keep an unsaved draft; drop a clean one.
        if (this.draft.dirty) this.remoteRevision = -1;
        else this.selectFirst();
      } else if (!this.draft) {
        this.selectFirst();
      }
    } catch (err) {
      this.loadError = `Could not load complications: ${errText(err)}`;
    }
  }

  private selectFirst() {
    if (this.records[0]) this.openRecord(this.records[0]);
    else {
      this.selectedId = undefined;
      this.clearDraft();
    }
  }

  private clearDraft() {
    this.draft = undefined;
    this.compiled = undefined;
    this.compiledDocument = undefined;
    this.readOnlyReason = undefined;
    this.parseError = undefined;
    this.remoteRevision = undefined;
    this.conflict = undefined;
    this.saveError = undefined;
    this.confirmDelete = false;
  }

  private confirmDiscard(): boolean {
    // window.confirm is the one modal the panel uses; it only appears when
    // the user is about to lose typed work.
    return window.confirm("You have unsaved changes. Discard them?");
  }

  private selectRecord(record: ComplicationRecord) {
    if (record.id === this.selectedId) return;
    if (this.draft?.dirty && !this.confirmDiscard()) return;
    this.openRecord(record);
  }

  private openRecord(record: ComplicationRecord) {
    this.selectedId = record.id;
    this.clearDraft();
    this.forced = new Map();
    this.inspect = { kind: "general" };
    try {
      this.draft = Draft.fromDocument(record.document, record.revision);
      this.savedName = String(record.document?.name ?? "");
      const schema = Number(record.document?.schemaVersion ?? 0);
      const unknown = auditUnknownKeys(record.document);
      if (schema > this.maxSchemaVersion) {
        this.readOnlyReason = `This document is schema v${schema}; this integration understands up to v${this.maxSchemaVersion}. Update the Wrist Assistant integration to edit it.`;
      } else if (unknown.length > 0) {
        this.readOnlyReason = `This document has fields the panel does not understand, so saving would drop them: ${unknown.slice(0, 5).join(", ")}${unknown.length > 5 ? ` and ${unknown.length - 5} more` : ""}. Update the integration to edit it.`;
      }
      this.recompile();
      this.ensureActiveFamily();
    } catch (err) {
      this.parseError = errText(err);
    }
    this.scheduleTemplates(0);
  }

  private startNew(config: CustomComplicationConfig) {
    if (this.draft?.dirty && !this.confirmDiscard()) return;
    this.selectedId = config.id;
    this.clearDraft();
    this.forced = new Map();
    this.inspect = { kind: "general" };
    this.savedName = undefined;
    this.draft = new Draft(config, null);
    this.recompile();
    this.ensureActiveFamily();
    this.scheduleTemplates(0);
  }

  /** First slot neither a stored record nor an occupied entry (a preset, or
   * a custom on another home) uses, or -1 when every slot is taken. */
  private freeSlot(): number {
    return freeSlotFrom(
      this.records.map((r) => Number(r.document?.slotIndex ?? -1)),
      this.occupied,
    );
  }

  // ── send to watch ─────────────────────────────────────────────────────

  /** Start (or restart) the wait for the watch's ack. Ends on the ack via
   * the subscription, or on the timeout, whichever comes first. */
  private beginSendWait() {
    if (this.sendTimer !== undefined) window.clearTimeout(this.sendTimer);
    this.sendPending = true;
    this.sendTimer = window.setTimeout(() => {
      this.sendTimer = undefined;
      this.sendPending = false;
      // The watch may have stopped polling meanwhile; refresh so the button
      // says "not connected" rather than offering a wake that goes nowhere.
      void this.loadRecords();
    }, SEND_WAIT_MS);
  }

  private endSendWait() {
    if (this.sendTimer !== undefined) window.clearTimeout(this.sendTimer);
    this.sendTimer = undefined;
    this.sendPending = false;
  }

  /** Wake the watch's parked long-poll so it is handed the current token
   * again. The store does not change; the ack does the rest. */
  private async sendToWatch() {
    if (!this.ownerId) return;
    try {
      const reply = await nudgeWatch(this.hass, this.ownerId);
      this.polling = reply.polling;
      this.serverToken = reply.token;
      this.appliedToken = reply.applied_token;
      if (reply.applied_token !== reply.token) this.beginSendWait();
    } catch (err) {
      this.saveError = errText(err);
    }
  }

  private renderSendButton() {
    const s = sendState({
      token: this.serverToken,
      appliedToken: this.appliedToken,
      polling: this.polling,
      pending: this.sendPending,
    });
    if (s.kind === "unsupported") return nothing;
    const d = describeSend(s);
    const resend = d.resend && this.hass.user?.is_admin
      ? html`<button class="link" title="Wake the watch again" @click=${() => void this.sendToWatch()}>Resend</button>`
      : nothing;
    return html`<span class="send ${s.kind}" title=${d.title}>${s.kind === "sent" ? "✓ " : ""}${d.label}${resend}</span>`;
  }

  /** The store refuses a document whose slot is outside 0..MAX_SLOTS-1. */
  private get slotChosen(): boolean {
    const slot = this.draft?.config.slotIndex ?? -1;
    return slot >= 0 && slot < MAX_SLOTS;
  }


  // ── draft mutation ────────────────────────────────────────────────────

  private mutate(mutateFn: (cfg: CustomComplicationConfig) => void, coalesce?: string) {
    if (!this.draft || !this.canEdit) return;
    this.draft.update(mutateFn, coalesce);
    this.afterMutation();
  }

  private afterMutation() {
    this.version++;
    this.recompile();
    this.ensureActiveFamily();
  }

  private recompile() {
    if (!this.draft) return;
    try {
      this.compiled = compile(this.draft.config);
    } catch {
      this.compiled = undefined;
    }
    this.lastStatesSnapshot = undefined;
    if (this.compiled?.document !== this.compiledDocument) {
      this.compiledDocument = this.compiled?.document;
      this.scheduleTemplates(TEMPLATE_DEBOUNCE_MS);
    }
  }

  private undo() {
    if (!this.draft?.canUndo) return;
    this.draft.undo();
    this.afterMutation();
  }

  private redo() {
    if (!this.draft?.canRedo) return;
    this.draft.redo();
    this.afterMutation();
  }

  private host(): EditorHost {
    const resolver = new Resolver(this.buildContext());
    return {
      hass: this.hass,
      config: this.draft!.config,
      icons: this.icons,
      symbols: this.symbols,
      pages: this.pages,
      update: (m, c) => this.mutate(m, c),
      endGesture: () => this.draft?.endGesture(),
      resolve: (v: Value) => resolver.resolve(v),
      evaluateTest: (t) => resolver.evaluateTest(t),
      liveBranch: (rule) => resolver.liveBranches([rule]).get(rule.id) ?? "none",
      forced: this.forced,
      setForced: (ruleId, branch) => this.setForced(ruleId, branch),
      activeFamily: this.activeFamily,
      setActiveFamily: (family) => { this.activeFamily = family; this.inspect = { kind: "family" }; },
      addFamily: (family) => this.addShape(family),
      removeFamily: (family) => this.removeShape(family),
      savedName: this.savedName,
      tapAreaShown: this.showTaps,
      showTapArea: (on) => this.setShowTaps(on),
      openSections: this.openSections,
      toggleSection: (id) => this.toggleSection(id),
    };
  }

  /** Open or shut one inspector card. With one card open (the default), a
   * click on another swaps to it; after Open all, each card shuts alone. */
  private toggleSection(id: string) {
    const next = new Set(this.openSections);
    if (next.has(id)) next.delete(id);
    else if (next.size <= 1) { next.clear(); next.add(id); }
    else next.add(id);
    this.openSections = next;
  }

  // ── shapes ────────────────────────────────────────────────────────────

  /** Rule 8: the panel works only with a watch at or above the per-shape
   * release. Below it the editor is replaced by an update message, so every
   * document authored here is one the wrist can draw. An orphaned owner has
   * no device to report a version and is exempt: its only action is Move. */
  private get watchSupported(): boolean {
    const owner = this.selectedOwner;
    if (!owner) return true;
    return owner.is_orphan || watchSupportsShapes(owner.app_version);
  }

  /** The canvas shape the layer controls work on. Inline has no canvas, so
   * while it is active the placement fields and drags target the document's
   * first canvas shape instead. */
  private get canvasFamily(): DrawableFamily {
    if (isDrawable(this.activeFamily)) return this.activeFamily;
    const cfg = this.draft?.config;
    return (cfg && firstDrawable(cfg)) ?? "rectangular";
  }

  /** Keep the active shape one the document has: after opening a document
   * that lacks the previous one, and after a shape is removed. */
  private ensureActiveFamily() {
    const cfg = this.draft?.config;
    if (!cfg || cfg.supportedFamilies.includes(this.activeFamily)) return;
    this.activeFamily = supportedFamilies(cfg)[0] ?? "rectangular";
  }

  private addShape(family: FamilyKind) {
    this.mutate((c) => addFamily(c, family));
    this.activeFamily = family;
    this.inspect = { kind: "family" };
  }

  private removeShape(family: FamilyKind) {
    const cfg = this.draft?.config;
    if (!cfg || !canRemoveFamily(cfg, family)) return;
    const lost = familyContentSummary(cfg, family);
    if (lost.length > 0 && !window.confirm(`Remove the ${familyTitle(family)} layout? This drops ${lost.join(", ")}.`)) return;
    this.mutate((c) => removeFamily(c, family));
    this.ensureActiveFamily();
  }

  private createNew(family: FamilyKind) {
    this.newShapeChooser = false;
    this.startNew(newConfig("New complication", this.freeSlot(), [family]));
  }

  private setForced(ruleId: string, branch: { caseId: string } | "otherwise" | "live") {
    const next = new Map(this.forced);
    if (branch === "live") next.delete(ruleId);
    else next.set(ruleId, branch);
    this.forced = next;
  }

  // ── save / delete ─────────────────────────────────────────────────────

  private async save(asNew = false) {
    if (!this.draft || !this.ownerId || !this.canEdit || this.saving) return;
    if (!asNew && !this.draft.dirty) return;
    if (!asNew && !this.slotChosen) {
      // Slots are auto-assigned and there is no picker; this only trips when
      // the draft was created with every slot taken.
      this.saveError = "The watch is full. Delete a complication first.";
      return;
    }
    this.saving = true;
    this.saveError = undefined;
    try {
      let draft = this.draft;
      if (asNew) {
        const slot = this.freeSlot();
        if (slot < 0) {
          this.saveError = "The watch is full (iPhone presets count too), so there is nowhere to put a copy. Delete a complication first.";
          return;
        }
        const cfg = structuredClone(draft.config);
        cfg.id = newId();
        cfg.slotIndex = slot;
        draft = new Draft(cfg, null);
      }
      const doc = draft.encoded();
      const result = await saveRecord(this.hass, this.ownerId, doc, draft.baseRevision);
      if (!result.ok || !result.record) {
        if (result.error === "conflict") {
          this.conflict = { current: result.current ?? null, message: result.message ?? "Someone else saved this complication first." };
        } else {
          this.saveError = result.message ?? result.error ?? "Save failed";
        }
        return;
      }
      this.conflict = undefined;
      this.remoteRevision = undefined;
      this.selectedId = result.record.id;
      this.draft = Draft.fromDocument(result.record.document, result.record.revision);
      // The saved name is the new baseline: the rename note clears until the
      // next edit. The watch still caches the picker label, but that is a
      // one-time re-pick on the wrist, not a per-save nag.
      this.savedName = String(result.record.document?.name ?? "");
      this.recompile();
      // The commit woke the watch's poll; wait for its ack before offering
      // a manual re-send.
      this.beginSendWait();
      await this.loadRecords();
    } catch (err) {
      this.saveError = errText(err);
    } finally {
      this.saving = false;
    }
  }

  private async deleteCurrent() {
    if (!this.draft || !this.ownerId || !this.selectedId || !this.canEdit) return;
    if (this.draft.baseRevision === null) {
      // Never saved: just drop it.
      this.clearDraft();
      this.selectedId = undefined;
      this.selectFirst();
      return;
    }
    this.saving = true;
    try {
      const result = await deleteRecord(this.hass, this.ownerId, this.selectedId, this.draft.baseRevision);
      if (!result.ok) {
        if (result.error === "conflict") this.conflict = { current: result.current ?? null, message: result.message ?? "This complication changed on the server." };
        else this.saveError = result.message ?? result.error ?? "Delete failed";
        return;
      }
      this.clearDraft();
      this.selectedId = undefined;
      await this.loadRecords();
    } catch (err) {
      this.saveError = errText(err);
    } finally {
      this.saving = false;
      this.confirmDelete = false;
    }
  }

  private duplicate() {
    if (!this.draft) return;
    const cfg = structuredClone(this.draft.config);
    cfg.id = newId();
    cfg.name = `${cfg.name} copy`;
    cfg.slotIndex = this.freeSlot();
    this.startNew(cfg);
  }

  private reloadFromServer() {
    const current = this.conflict?.current ?? this.records.find((r) => r.id === this.selectedId);
    this.conflict = undefined;
    if (current && !current.deleted) this.openRecord(current);
    else {
      this.clearDraft();
      this.selectedId = undefined;
      void this.loadRecords();
    }
  }

  // ── move (reinstall recovery) ─────────────────────────────────────────

  private get selectedOwner(): OwnerSummary | undefined {
    return this.owners.find((o) => o.owner_watch_id === this.ownerId);
  }

  /** Hand every complication of an unregistered watch to a registered one. */
  private async moveAll() {
    const source = this.ownerId;
    const target = this.moveTarget;
    if (!source || !target || this.moving) return;
    this.moving = true;
    this.moveError = undefined;
    try {
      await moveOwner(this.hass, source, target);
      this.moveTarget = undefined;
      await this.loadOwners();
      await this.selectOwner(target);
    } catch (err) {
      this.moveError = errText(err);
    } finally {
      this.moving = false;
    }
  }

  // ── templates ─────────────────────────────────────────────────────────

  private scheduleTemplates(delay: number) {
    if (this.debounceTimer) window.clearTimeout(this.debounceTimer);
    this.debounceTimer = window.setTimeout(() => void this.refreshTemplates(), delay);
    if (this.templateTimer) window.clearInterval(this.templateTimer);
    this.templateTimer = window.setInterval(() => void this.refreshTemplates(), TEMPLATE_REFRESH_MS);
  }

  private async refreshTemplates() {
    const doc = this.compiled?.document;
    if (!doc) {
      this.templateResults = new Map();
      this.templateError = undefined;
      this.templateFetchedAt = Date.now();
      return;
    }
    try {
      const reply = await renderTemplates(this.hass, { doc });
      const result = reply.doc;
      if (!result) return;
      if (!result.ok) {
        this.templateError = result.error;
        return;
      }
      const parsed = parseValueDocument(result.value);
      if (!parsed) {
        this.templateError = "Template did not render to a JSON object";
        return;
      }
      this.templateResults = parsed.values;
      this.templateError = undefined;
      this.templateFetchedAt = Date.now();
    } catch (err) {
      this.templateError = errText(err);
    }
  }

  // ── resolution ────────────────────────────────────────────────────────

  private buildContext(): ResolveContext {
    const entityStates = new Map<string, EntityState>();
    for (const id of this.compiled?.entities.keys() ?? []) {
      const s = this.hass.states[id];
      if (!s) continue;
      const attrs = s.attributes;
      const domain = id.split(".")[0] ?? "";
      const entry: EntityState = {
        entityId: id,
        // A typed test value stands in for the live state, and only here: the
        // document, the templates and the watch never see it.
        state: this.testValues.get(id) ?? s.state,
        unitOfMeasurement: typeof attrs.unit_of_measurement === "string" ? attrs.unit_of_measurement : undefined,
        iconName: this.compiled?.entities.get(id)?.iconName ?? "",
        domain,
      };
      if (domain === "timer") {
        // Countdown support: the resolver needs the timer's phase, finish
        // instant, and paused remaining (HA serializes remaining as "H:MM:SS").
        entry.timerState = s.state;
        if (typeof attrs.finishes_at === "string") entry.finishesAt = attrs.finishes_at;
        const remaining = parseDurationSeconds(attrs.remaining);
        if (remaining !== undefined) entry.remaining = remaining;
      }
      if (domain === "camera" && typeof attrs.entity_picture === "string") {
        // Image elements: the preview draws the camera's own tokenized proxy URL.
        entry.entityPicture = attrs.entity_picture;
      }
      entityStates.set(id, entry);
    }
    return {
      entityStates,
      templateResults: this.templateResults,
      namedValues: this.draft?.config.values ?? [],
      dataAgeSeconds: this.templateFetchedAt === undefined ? undefined : (Date.now() - this.templateFetchedAt) / 1000,
    };
  }

  // ── preview gestures ──────────────────────────────────────────────────

  /**
   * The pick toggle, drawn over the previews and over the Layers card. Both
   * buttons are the same switch: picking happens on the face, and the layer it
   * names is a row in the other card, so either place is a fair place to reach
   * for it.
   */
  private renderPickButton() {
    const on = this.picking;
    const off = !this.draft || this.parseError !== undefined;
    return html`<button class="pick ${on ? "on" : ""}" ?disabled=${off}
      aria-pressed=${on ? "true" : "false"}
      title=${on ? "Point at the face to name a layer. Click one to select it. Escape stops." : "Point at a layer on the face to find it (Escape stops)"}
      @click=${() => this.togglePicking()}><span class="glyph">⌖</span>${on ? "Picking…" : "Pick layer"}</button>`;
  }

  /** The review-mode toggle. Sits beside Pick layer because both answer a
   * question about the face rather than changing it. */
  private renderShowTapsButton() {
    const on = this.showTaps;
    return html`<button class="pick ${on ? "on" : ""}" ?disabled=${!this.draft || this.parseError !== undefined}
      aria-pressed=${on ? "true" : "false"}
      title="Show every tap area, labelled with what it does, over a dimmed face. With a layer selected, only its tap area shows, and you can drag its corners to size it."
      @click=${() => this.setShowTaps(!this.showTaps)}><span class="glyph">☞</span>Show taps</button>`;
  }

  private setShowTaps(on: boolean) {
    this.showTaps = on;
    // Both modes take over the pointer, so only one can be on.
    if (on) this.togglePicking(false);
  }

  private togglePicking(next = !this.picking) {
    this.picking = next;
    this.pickHoverId = undefined;
    if (next) {
      this.showTaps = false;
      this.cancelGesture?.();
    }
  }

  /** The layer a preview event points at, with an attached tap sent to the
   * layer it belongs to (the same redirect a drag does). */
  private hitLayerId(e: Event): string | undefined {
    const cfg = this.draft?.config;
    if (!cfg) return undefined;
    const target = e.target as Element | null;
    const id = target?.closest?.("[data-element-id]")?.getAttribute("data-element-id");
    return id ? selectableLayerId(cfg, id) : undefined;
  }

  private onPickMove(e: PointerEvent) {
    if (!this.picking) return;
    this.pickHoverId = this.hitLayerId(e);
  }

  /** Take the layer under the pointer and leave pick mode, so the next click is
   * an ordinary one. A click on bare background picks nothing and still ends
   * the mode, which is how it is cancelled without the keyboard. */
  private pickAt(family: FamilyKind, e: PointerEvent) {
    const id = this.hitLayerId(e);
    this.togglePicking(false);
    if (!id) return;
    if (family !== this.activeFamily) this.activeFamily = family;
    this.inspect = { kind: "layer", id };
  }

  private onPreviewPointerDown(family: FamilyKind, e: PointerEvent) {
    // Pick mode outranks dragging, and selecting is not an edit, so it works on
    // a read-only complication too.
    if (this.picking) {
      e.preventDefault();
      this.pickAt(family, e);
      return;
    }
    const target = e.target as SVGElement;
    const handle = target.closest("[data-handle]")?.getAttribute("data-handle") as HandleCorner | null;
    const hitId = target.closest("[data-element-id]")?.getAttribute("data-element-id") ?? undefined;
    const svg = target.closest("svg") as SVGSVGElement | null;
    // Any press on the face that is not on the timestamp chip drops the chip's
    // selection, the way a click elsewhere drops any selection.
    // `closest` gives undefined through the optional chain when nothing
    // matches, so the corner has to be normalised to null before the test, or
    // every press on the picture reads as a press on the chip.
    const tsCorner = (target.closest("[data-ts-corner]")?.getAttribute("data-ts-corner") ?? null) as HandleCorner | null;
    const onChip = tsCorner !== null || target.closest("[data-ts-handle]") !== null;
    if (!onChip) this.timestampActiveId = undefined;
    // Review mode reads the face rather than moving it. A click still selects,
    // so a tap box leads to its layer, but a layer never drags here: a pushed-out
    // tap reaches past its own layer, and dragging that outer margin would move
    // a layer that is not under the pointer. The one thing that does drag is
    // the focused tap box itself, which is how a tap area is sized.
    if (this.showTaps) {
      const focus = this.focusTapId();
      if (focus !== undefined && hitId === focus && svg && this.draft && this.canEdit) {
        if (family !== this.activeFamily) {
          this.activeFamily = family;
          return;
        }
        e.preventDefault();
        this.beginTapBoxGesture(family as DrawableFamily, e, svg, focus, handle ?? undefined);
        return;
      }
      const id = this.hitLayerId(e);
      if (id) this.inspect = { kind: "layer", id };
      // Bare background: back to every tap area.
      else if (hitId === undefined) this.inspect = { kind: "general" };
      return;
    }
    if (!this.draft || !this.canEdit) return;
    if (family !== this.activeFamily) {
      this.activeFamily = family;
      return;
    }
    // A plain press anywhere on the face drops the pick, the way a plain
    // click on a row does. A modified press keeps it and toggles the layer hit.
    const multiKey = isMultiKey(e);
    if (!multiKey && this.multi.size > 0) this.multi = new Set();
    if (!hitId || !svg) return;
    // An attached tap sits exactly over its owner and is not a layer the user
    // ever selects or drags: send the hit to the layer it belongs to, which is
    // what the author sees there. A free-standing tap is grabbed as before.
    const id = selectableLayerId(this.draft.config, hitId);
    const el = this.draft.config.elements.find((x) => x.payload.id === id);
    if (!id || !el) return;
    if (multiKey) {
      e.preventDefault();
      this.togglePick(id);
      return;
    }
    // A locked group moves as one: a press on any member grabs all of them,
    // and selects the group. Its corners stay with the member selected from
    // the list, so a handle press still resizes that one layer.
    const group = groupOf(this.draft.config, id);
    if (group?.locked && !handle && !onChip) {
      this.beginGroupGesture(family as DrawableFamily, e, svg, group);
      return;
    }
    if (this.inspect.kind !== "layer" || this.inspect.id !== id) {
      this.inspect = { kind: "layer", id };
      if (handle) return;
    }
    e.preventDefault();
    const frame = effectivePlacement(this.draft.config, family, el).frame;
    const canvas = this.gestureCanvas(family as DrawableFamily);
    // The timestamp chip sits inside its image layer's group, so the layer hit
    // above already selected the right layer. A press on the chip selects the
    // chip: dragging it moves it (and frees it from its corner on the first
    // move), dragging one of its corners changes the text size.
    if (onChip && el.kind === "image" && el.payload.timestamp === true) {
      this.timestampActiveId = id;
      const img = el.payload;
      const design = DESIGN_BOX[family as DrawableFamily];
      const lw = frame.width * design.width;
      const lh = frame.height * design.height;
      const layerBox = { x: 0, y: 0, w: lw, h: lh, cx: lw / 2, cy: lh / 2 };
      const chip = timestampChipRect(img, layerBox, timestampLabel(new Date()));
      this.cancelGesture?.();
      if (tsCorner) {
        // Chip geometry is in design points; the pointer moves in slot points.
        const scale = canvas.width / design.width;
        const startSize = img.timestampSize;
        this.cancelGesture = beginScaleDrag(svg, e, tsCorner, { w: chip.w * scale, h: chip.h * scale }, (factor, done) => {
          const size = Math.min(40, Math.max(4, Math.round(startSize * factor)));
          this.mutate((c) => {
            const n = c.elements.find((x) => x.payload.id === id);
            if (n?.kind === "image") n.payload.timestampSize = size;
          }, `ts-size-${id}`);
          if (done) {
            this.draft?.endGesture();
            this.cancelGesture = undefined;
          }
        });
        return;
      }
      const chipBox = { x: 0, y: 0, w: frame.width * canvas.width, h: frame.height * canvas.height };
      // A cornered chip starts its drag from where the corner put it, so the
      // first move is a nudge rather than a jump.
      const base = hasFreeTimestamp(img)
        ? { x: img.timestampX!, y: img.timestampY! }
        : { x: (chip.x + chip.w / 2) / layerBox.w, y: (chip.y + chip.h / 2) / layerBox.h };
      let moved = false;
      this.cancelGesture = beginPointDrag(svg, chipBox, e, base, (x, y, done) => {
        // A plain click selects the chip and changes nothing, so a cornered
        // chip stays cornered until it is actually dragged.
        if (!done) moved = true;
        if (moved) {
          this.mutate((c) => {
            const n = c.elements.find((x) => x.payload.id === id);
            if (n?.kind !== "image") return;
            n.payload.timestampX = x;
            n.payload.timestampY = y;
          }, `ts-${id}`);
        }
        if (done) {
          this.draft?.endGesture();
          this.cancelGesture = undefined;
        }
      });
      return;
    }
    this.cancelGesture?.();
    this.cancelGesture = beginGesture(svg, canvas, e, { elementId: id, frame, handle: handle ?? undefined }, {
      onFrame: (elementId: string, f: NormalizedFrame, done: boolean) => {
        this.mutate((c) => setPlacement(c, family, elementId, { frame: f }), `drag-${elementId}-${family}`);
        if (done) {
          this.draft?.endGesture();
          this.cancelGesture = undefined;
        }
      },
    });
  }

  /**
   * Drag every member of a group by the same amount. The gesture runs on the
   * members' bounding box, which is what keeps the whole group on the face,
   * and each member's placement is set from where it started plus the move.
   */
  private beginGroupGesture(family: DrawableFamily, e: PointerEvent, svg: SVGSVGElement, group: LayerGroup) {
    const cfg = this.draft?.config;
    if (!cfg) return;
    const members = groupMembers(cfg, group.id);
    if (members.length === 0) return;
    if (this.inspect.kind !== "group" || this.inspect.id !== group.id) this.inspect = { kind: "group", id: group.id };
    e.preventDefault();
    const starts = new Map(members.map((m) => [m.payload.id, effectivePlacement(cfg, family, m).frame] as const));
    const frames = [...starts.values()];
    const x0 = Math.min(...frames.map((f) => f.x));
    const y0 = Math.min(...frames.map((f) => f.y));
    const x1 = Math.max(...frames.map((f) => f.x + f.width));
    const y1 = Math.max(...frames.map((f) => f.y + f.height));
    const bounds: NormalizedFrame = { x: x0, y: y0, width: x1 - x0, height: y1 - y0, rotationDegrees: 0 };
    const round = (n: number) => Math.round(n * 1000) / 1000;
    this.cancelGesture?.();
    this.cancelGesture = beginGesture(svg, this.gestureCanvas(family), e, { elementId: group.id, frame: bounds }, {
      onFrame: (_id, f, done) => {
        const dx = f.x - bounds.x;
        const dy = f.y - bounds.y;
        this.mutate((c) => {
          for (const [mid, sf] of starts) setPlacement(c, family, mid, { frame: { ...sf, x: round(sf.x + dx), y: round(sf.y + dy) } });
        }, `drag-group-${group.id}-${family}`);
        if (done) {
          this.draft?.endGesture();
          this.cancelGesture = undefined;
        }
      },
    });
  }

  /**
   * Arrow keys move what is selected by whole design points: the correction a
   * drag is too coarse for. One point a press, ten with Shift held, on the
   * shape the layer controls work on, so the move lands in the same per-shape
   * layout a drag would write and is clamped the way that drag is clamped.
   *
   * Returns whether the key was used, which is what decides `preventDefault`:
   * with nothing movable selected the arrows stay the page's, and it still
   * scrolls.
   */
  private nudge(dx: number, dy: number, coarse: boolean): boolean {
    const cfg = this.draft?.config;
    // Review mode reads the face rather than moving it, and pick mode is
    // choosing a layer rather than editing one. Neither drags, so neither
    // nudges.
    if (!cfg || !this.canEdit || this.showTaps || this.picking) return false;
    const step = coarse ? NUDGE_COARSE : 1;
    const px = dx * step;
    const py = dy * step;
    const family = this.canvasFamily;
    const box = DESIGN_BOX[family];
    // The chip is the innermost thing that can be selected, and it moves inside
    // its own picture rather than on the face, so it answers first.
    if (this.timestampActiveId !== undefined && this.nudgeTimestamp(this.timestampActiveId, family, px, py)) return true;
    if (this.multi.size >= 2) return this.nudgeMany([...this.multi], family, box, `nudge-multi-${family}`, px, py);
    if (this.inspect.kind === "group") {
      const gid = this.inspect.id;
      return this.nudgeMany(groupMembers(cfg, gid).map((m) => m.payload.id), family, box, `nudge-group-${gid}-${family}`, px, py);
    }
    if (this.inspect.kind !== "layer") return false;
    const id = this.inspect.id;
    const el = cfg.elements.find((x) => x.payload.id === id);
    if (!el) return false;
    // A locked group moves as one under the pointer, so it moves as one under
    // the keyboard too: otherwise a layer could leave its group by arrow and
    // not by drag.
    const group = groupOf(cfg, id);
    if (group?.locked) {
      return this.nudgeMany(groupMembers(cfg, group.id).map((m) => m.payload.id), family, box, `nudge-group-${group.id}-${family}`, px, py);
    }
    const frame = effectivePlacement(cfg, family, el).frame;
    const next = nudgeFrame(frame, px, py, box);
    // At the edge of the face the clamp gives the frame back unchanged. The key
    // is still ours (the page must not scroll under a nudge), but there is
    // nothing to record.
    if (next.x !== frame.x || next.y !== frame.y) {
      this.mutate((c) => setPlacement(c, family, id, { frame: next }), `nudge-${id}-${family}`);
    }
    return true;
  }

  /**
   * Move several layers by one delta, the way the group drag does: the clamp
   * runs on their bounding box, so the block keeps its shape and reaches the
   * edge of the face together instead of piling up against it.
   */
  private nudgeMany(ids: string[], family: DrawableFamily, box: { width: number; height: number }, key: string, px: number, py: number): boolean {
    const cfg = this.draft?.config;
    if (!cfg) return false;
    const round = (n: number) => Math.round(n * 1000) / 1000;
    const starts = new Map<string, NormalizedFrame>();
    for (const id of ids) {
      const el = cfg.elements.find((x) => x.payload.id === id);
      if (el) starts.set(id, effectivePlacement(cfg, family, el).frame);
    }
    if (starts.size === 0) return false;
    const frames = [...starts.values()];
    const x0 = Math.min(...frames.map((f) => f.x));
    const y0 = Math.min(...frames.map((f) => f.y));
    const x1 = Math.max(...frames.map((f) => f.x + f.width));
    const y1 = Math.max(...frames.map((f) => f.y + f.height));
    const bounds: NormalizedFrame = { x: x0, y: y0, width: x1 - x0, height: y1 - y0, rotationDegrees: 0 };
    const moved = nudgeFrame(bounds, px, py, box);
    const dx = moved.x - bounds.x;
    const dy = moved.y - bounds.y;
    if (dx !== 0 || dy !== 0) {
      this.mutate((c) => {
        for (const [mid, sf] of starts) setPlacement(c, family, mid, { frame: { ...sf, x: round(sf.x + dx), y: round(sf.y + dy) } });
      }, key);
    }
    return true;
  }

  /**
   * Move the image timestamp chip inside its own picture, writing the free
   * position its drag writes: the first nudge frees a cornered chip, exactly as
   * the first drag move does. Returns false when the selected chip is not one
   * that can move, so the arrows fall through to whatever else is selected.
   */
  private nudgeTimestamp(id: string, family: DrawableFamily, px: number, py: number): boolean {
    const cfg = this.draft?.config;
    const el = cfg?.elements.find((x) => x.payload.id === id);
    if (!cfg || el?.kind !== "image" || el.payload.timestamp !== true) return false;
    const img = el.payload;
    const design = DESIGN_BOX[family];
    const frame = effectivePlacement(cfg, family, el).frame;
    // Chip geometry is in design points, as it is for the drag.
    const lw = frame.width * design.width;
    const lh = frame.height * design.height;
    const chip = timestampChipRect(img, { x: 0, y: 0, w: lw, h: lh, cx: lw / 2, cy: lh / 2 }, timestampLabel(new Date()));
    const base = hasFreeTimestamp(img)
      ? { x: img.timestampX!, y: img.timestampY! }
      : { x: lw > 0 ? (chip.x + chip.w / 2) / lw : 0.5, y: lh > 0 ? (chip.y + chip.h / 2) / lh : 0.5 };
    const next = nudgePoint(base, px, py, { w: lw, h: lh });
    if (next.x !== base.x || next.y !== base.y) {
      this.mutate((c) => {
        const n = c.elements.find((x) => x.payload.id === id);
        if (n?.kind !== "image") return;
        n.payload.timestampX = next.x;
        n.payload.timestampY = next.y;
      }, `nudge-ts-${id}`);
    }
    return true;
  }

  /**
   * The canvas gestures in one preview normalise against. Pointer deltas arrive
   * in slot points; the design box as it lands in this slot turns them into the
   * same fraction a 41 mm and a 46 mm preview would both move. Corner draws the
   * design box scaled down into the visible content tile (renderer.ts
   * cornerTileSide), so its gestures normalise against the tile.
   */
  private gestureCanvas(family: DrawableFamily): { width: number; height: number } {
    const fit = fitBox(this.previewSlot(family), family);
    if (family !== "corner") return { width: fit.width, height: fit.height };
    const corner = this.draft?.config.perFamily.corner;
    const hasBezel = !!corner?.bezelText || !!corner?.bezelGauge;
    const tile = cornerTileSide(fit.scale, hasBezel);
    return { width: tile, height: tile };
  }

  /** The tap the Show taps view is narrowed to: the selected layer's attached
   * tap, or the selected layer itself when it is a free-standing tap. Undefined
   * shows every tap area, as before there was anything to narrow to. */
  private focusTapId(): string | undefined {
    const cfg = this.draft?.config;
    if (!cfg || !this.showTaps || this.inspect.kind !== "layer") return undefined;
    const id = this.inspect.id;
    const el = cfg.elements.find((x) => x.payload.id === id);
    if (!el) return undefined;
    if (el.kind === "tap") return el.payload.id;
    return attachedTapsOf(cfg, id)[0]?.payload.id;
  }

  /**
   * Drag the focused tap box: a corner resizes it, the body moves it. An
   * attached tap turns the frame into points past its layer's edges, which then
   * apply in every shape; a free-standing tap is simply placed, as any layer is.
   */
  private beginTapBoxGesture(family: DrawableFamily, e: PointerEvent, svg: SVGSVGElement, tapId: string, handle?: HandleCorner) {
    const cfg = this.draft?.config;
    const tap = cfg?.elements.find((x) => x.payload.id === tapId);
    if (!cfg || !tap) return;
    const attached = isAttachedTap(cfg, tap);
    const frame = effectivePlacement(cfg, family, tap).frame;
    this.cancelGesture?.();
    this.cancelGesture = beginGesture(svg, this.gestureCanvas(family), e, { elementId: tapId, frame, handle }, {
      onFrame: (elementId: string, f: NormalizedFrame, done: boolean) => {
        this.mutate((c) => {
          if (attached) setTapOutsetFromFrame(c, elementId, family, f);
          else setPlacement(c, family, elementId, { frame: f });
        }, `tap-box-${elementId}-${family}`);
        if (done) {
          this.draft?.endGesture();
          this.cancelGesture = undefined;
        }
      },
    });
  }

  // ── render ────────────────────────────────────────────────────────────

  override render() {
    const d = this.draft;
    const dirty = !!d?.dirty;
    // `narrow` is Home Assistant telling us it is a phone; otherwise the fit
    // is decided from the panel's own measured width.
    const fit = this.narrow
      ? { columns: 1 as const, left: this.colLeft, right: this.colRight }
      : columnFit(this.panelWidth, this.colLeft, this.colRight);
    return html`
      <header>
        <h1><span class="mark">${uiIcon("watch")}</span>Wrist Assistant</h1>
        ${this.renderPicker()}
        ${dirty ? html`<span class="dirty-dot" title="Unsaved changes"></span>` : nothing}
        <div class="toolbar">
          <button @click=${() => this.undo()} ?disabled=${!d?.canUndo} title="Undo (⌘Z)">Undo</button>
          <button @click=${() => this.redo()} ?disabled=${!d?.canRedo} title="Redo (⇧⌘Z)">Redo</button>
        </div>
        <span class="spacer"></span>
        ${this.renderSendButton()}
        <label>Watch
          <select @change=${(e: Event) => void this.selectOwner((e.target as HTMLSelectElement).value)}>
            ${this.owners.map((o) => html`<option value=${o.owner_watch_id} ?selected=${o.owner_watch_id === this.ownerId}>
              ${ownerLabel(o)} (${o.complication_count})</option>`)}
          </select>
        </label>
        <button class="primary save ${dirty ? "dirty" : ""}" @click=${() => void this.save()} ?disabled=${!this.canEdit || !dirty || this.saving || !this.slotChosen} title="Save (⌘S)">${this.saving ? "Saving…" : d?.baseRevision === null ? "Save new" : dirty ? "Save" : "Saved"}</button>
      </header>
      ${this.loadError ? html`<div class="card error">${this.loadError}</div>` : nothing}
      ${this.watchSupported
        ? html`<div class="layout cols-${fit.columns}"
              style="--wa-left:${fit.left}px;--wa-right:${fit.right}px">
            <div class="column left">${this.renderAddLayer()}${this.renderLayers()}</div>
            ${this.renderGutter("left")}
            <div class="column canvas">${this.renderBanners()}${this.renderCanvas()}</div>
            ${this.renderGutter("right")}
            <div class="column inspector card">${this.renderInspector()}</div>
          </div>
          ${this.renderFooter()}`
        : html`<div class="card">
            <div class="banner warn"><b>Update the watch app first.</b> ${updateWatchMessage(this.selectedOwner?.app_version)}</div>
            <div class="hint">Nothing on this watch is changed or lost. Its ${this.selectedOwner?.complication_count ?? 0} complication${this.selectedOwner?.complication_count === 1 ? "" : "s"} stay in Home Assistant and can be edited once the watch is updated.</div>
          </div>`}`;
  }

  // ── header picker ─────────────────────────────────────────────────────

  /** The rows the picker shows, in watch face order (by slot). iPhone presets
   * and customs on another home are locked rows: this panel cannot edit them,
   * but hiding them is what used to make slots look haunted. */
  private pickerRows(): PickerRow[] {
    const rows: PickerRow[] = [
      ...this.records.map((r): PickerRow => ({ slot: Number(r.document?.slotIndex ?? 0), kind: "record", record: r })),
      ...this.occupied.map((o): PickerRow => o.kind === "custom"
        ? {
          slot: o.slot,
          kind: "locked",
          name: o.name || "Unnamed complication",
          badge: o.home || "Other home",
          title: `A complication on ${o.home ? `the ${o.home} home` : "another home"}${o.families?.length ? ` (${o.families.map(familyTitle).join(", ")})` : ""}. Edit it in that home's Wrist Assistant panel.`,
          families: o.families ?? [],
        }
        : {
          slot: o.slot,
          kind: "locked",
          name: o.name || "Unnamed preset",
          badge: "iPhone",
          title: "An iPhone preset complication. Edit it in the Wrist Assistant app on the iPhone.",
          families: [],
        }),
    ];
    return rows.sort((a, b) => a.slot - b.slot);
  }

  private shapeDots(families: readonly string[]) {
    return html`<span class="shape-dots">${ALL_FAMILIES.map((f) => html`<span class="shape-dot ${f} ${families.includes(f) ? "on" : ""}" title=${familyTitle(f)}></span>`)}</span>`;
  }

  private renderPicker() {
    const d = this.draft;
    const rec = this.records.find((r) => r.id === this.selectedId);
    const name = d ? (d.config.name.trim() || "Untitled") : "No complication";
    const families = d ? d.config.supportedFamilies : [];
    const rows = this.pickerRows();
    const free = this.freeSlot();
    return html`<div class="picker">
      <button aria-haspopup="listbox" aria-expanded=${this.pickerOpen ? "true" : "false"} title="Choose a complication"
        @click=${() => this.togglePicker()}>
        ${this.shapeDots(families)}
        <span class="pk-name">${name}</span>
        ${rec ? html`<span class="pk-rev">r${rec.revision}</span>` : d && d.baseRevision === null ? html`<span class="pk-rev">unsaved</span>` : nothing}
        ${uiIcon("chevron")}
      </button>
      ${this.pickerOpen ? html`<div class="menu" role="listbox">
        ${rows.length === 0 && !(d && d.baseRevision === null) ? html`<div class="empty">No complications for this watch yet.</div>` : nothing}
        ${rows.map((row) => row.kind === "record"
          ? html`<button class="row" role="option" aria-current=${row.record.id === this.selectedId ? "true" : "false"}
              @click=${() => { this.togglePicker(false); this.selectRecord(row.record); }}>
              ${this.shapeDots(familiesOf(row.record))}
              <span class="pk-name">${String(row.record.document?.name ?? "Untitled")}</span>
              <span class="pk-badge">r${row.record.revision}</span>
            </button>`
          : html`<div class="row locked" title=${row.title}>
              ${this.shapeDots(row.families)}
              <span class="pk-name">${row.name}</span>
              <span class="pk-badge">${row.badge}</span>
            </div>`)}
        ${d && d.baseRevision === null ? html`<div class="row" aria-current="true">${this.shapeDots(families)}<span class="pk-name">${name}</span><span class="pk-badge">unsaved</span></div>` : nothing}
        ${this.hass.user?.is_admin ? html`
          <button class="row new" ?disabled=${free < 0} @click=${() => { this.newShapeChooser = !this.newShapeChooser; }}>
            ${uiIcon("plus")}<span class="pk-name">New complication</span>${free < 0 ? html`<span class="pk-badge">watch is full</span>` : nothing}
          </button>
          ${this.newShapeChooser && free >= 0 ? html`<div class="new-shape">
            <div class="hint">Start with one shape. More can be added under the preview later.</div>
            <div class="adders">
              ${ALL_FAMILIES.map((f) => html`<button class="small ${f === "rectangular" ? "primary" : ""}" @click=${() => { this.togglePicker(false); this.createNew(f); }}>${familyTitle(f)}</button>`)}
            </div>
          </div>` : nothing}` : nothing}
      </div>` : nothing}
    </div>`;
  }

  private togglePicker(next = !this.pickerOpen) {
    this.pickerOpen = next;
    if (!next) this.newShapeChooser = false;
    if (next) window.addEventListener("pointerdown", this.pickerOutside, { capture: true });
    else window.removeEventListener("pointerdown", this.pickerOutside, { capture: true });
  }

  private pickerOutside = (e: PointerEvent) => {
    const inside = e.composedPath().some((n) => n instanceof HTMLElement && n.classList.contains("picker"));
    if (!inside) this.togglePicker(false);
  };

  private renderBanners() {
    const out: TemplateResult[] = [];
    const orphan = this.renderOrphanBanner();
    if (orphan) out.push(orphan);
    if (this.readOnlyReason) out.push(html`<div class="banner warn"><b>Read only.</b> ${this.readOnlyReason}</div>`);
    else if (this.draft && !this.hass.user?.is_admin) out.push(html`<div class="banner warn"><b>Read only.</b> Only a Home Assistant administrator can save complications.</div>`);
    if (this.conflict) {
      const c = this.conflict;
      out.push(html`<div class="banner err"><b>Save rejected.</b> ${c.message}
        ${c.current ? html` The server has revision ${c.current.revision}, saved ${c.current.updatedAt} by ${c.current.updatedBy || "unknown"}.` : " The server no longer has this complication."}
        <div class="acts">
          <button class="small" @click=${() => this.reloadFromServer()}>Reload the server version (lose my draft)</button>
          <button class="small" @click=${() => void this.save(true)}>Save my draft as a new complication</button>
          <button class="small" @click=${() => { this.conflict = undefined; }}>Keep editing</button>
        </div></div>`);
    } else if (this.remoteRevision !== undefined) {
      out.push(html`<div class="banner warn">${this.remoteRevision === -1 ? "This complication was deleted on the server while you were editing." : `Revision ${this.remoteRevision} was saved on the server while you were editing.`} Saving now will be rejected.
        <div class="acts">
          <button class="small" @click=${() => this.reloadFromServer()}>Reload the server version</button>
          <button class="small" @click=${() => void this.save(true)}>Save my draft as a new complication</button>
        </div></div>`);
    }
    if (this.saveError) out.push(html`<div class="banner err"><b>Could not save.</b> ${this.saveError}</div>`);
    return out;
  }

  /** Offer the Move action on a watch id no device answers for any more. */
  private renderOrphanBanner(): TemplateResult | undefined {
    const owner = this.selectedOwner;
    if (!owner?.is_orphan) return undefined;
    const targets = this.owners.filter((o) => !o.is_orphan);
    return html`<div class="banner warn">
      <b>This watch is no longer registered.</b> Reinstalling the watch app gives the watch a new id, and these
      ${owner.complication_count} complication${owner.complication_count === 1 ? "" : "s"} stayed behind under the old one.
      ${!this.hass.user?.is_admin
        ? html`<div class="hint">Only a Home Assistant administrator can move them.</div>`
        : targets.length === 0
          ? html`<div class="hint">No registered watch to move them to. Open Wrist Assistant on the watch first.</div>`
          : html`<div class="acts">
              <select @change=${(e: Event) => { this.moveTarget = (e.target as HTMLSelectElement).value || undefined; }}>
                <option value="" ?selected=${!this.moveTarget}>Move all to…</option>
                ${targets.map((t) => html`<option value=${t.owner_watch_id} ?selected=${t.owner_watch_id === this.moveTarget}>${ownerLabel(t)}</option>`)}
              </select>
              <button class="small" ?disabled=${!this.moveTarget || this.moving} @click=${() => void this.moveAll()}>${this.moving ? "Moving…" : "Move"}</button>
            </div>`}
      ${this.moveError ? html`<div class="err">${this.moveError}</div>` : nothing}
    </div>`;
  }

  // ── left column ───────────────────────────────────────────────────────

  /** Six tinted buttons, one per kind, and the presets under them. Above the
   * list on purpose: adding a layer never moves the button just pressed. */
  private renderAddLayer() {
    const cfg = this.draft?.config;
    if (!cfg || !this.canEdit) return nothing;
    const full = cfg.elements.length >= 64;
    return html`<div class="card">
      <h2 class="panel-title"><span class="swatch">${uiIcon("plus")}</span>Add a layer</h2>
      <div class="add-grid">
        ${KIND_ORDER.map((k) => html`<button class="add" style=${`--k:${KIND_COLOR[k]}`} ?disabled=${full} title=${`Add a blank ${KIND_LABEL[k].toLowerCase()} layer`}
          @click=${() => { const el = newElement(k); this.mutate((c) => { c.elements.push(el); }); this.inspect = { kind: "layer", id: el.payload.id }; }}>${uiIcon(k)}<span>${KIND_LABEL[k]}</span></button>`)}
      </div>
      <div class="presets-l">Or start from a preset</div>
      <div class="presets">
        ${LAYER_PRESETS.map((p) => html`<button class="preset" title=${p.blurb}
          ?disabled=${cfg.elements.length + p.layerCount > 64}
          @click=${() => this.openPreset(p.kind)}>${p.title}</button>`)}
      </div>
      ${this.renderPresetDialog()}
    </div>`;
  }

  /** Is this id a group's, rather than a layer's. */
  private isGroupId(id: string): boolean {
    return this.draft?.config.groups?.some((g) => g.id === id) === true;
  }

  /**
   * Reorder by drag. `id` (a layer or a whole group) lands before or after
   * `targetId` in the list as shown (top drawn last). A layer dropped among a
   * group's members joins that group; dropped anywhere else it leaves its
   * group. A group dropped onto another group's member lands beside that
   * whole group, so blocks never nest. Attached taps stay out of the rows and
   * follow their owner, the same as the arrow buttons.
   */
  /**
   * Move a layer (or a whole group) next to another row. A layer dropped
   * beside a group member joins that group, unless `outside` is set: then it
   * lands beside the whole block instead, which is how a layer gets past a
   * group that sits at the very top or bottom of the list.
   */
  private reorderLayer(id: string, targetId: string, before: boolean, outside = false) {
    if (id === targetId) return;
    this.mutate((c) => {
      const rows = c.elements.filter((e) => !isAttachedTap(c, e));
      const taps = c.elements.filter((e) => isAttachedTap(c, e));
      let shown = [...rows].reverse();
      const target = shown.find((e) => e.payload.id === targetId);
      if (!target) return;
      const movingGroup = c.groups?.find((g) => g.id === id);
      const moving = movingGroup
        ? shown.filter((e) => e.payload.groupId === movingGroup.id)
        : shown.filter((e) => e.payload.id === id);
      if (moving.length === 0 || moving.includes(target)) return;
      shown = shown.filter((e) => !moving.includes(e));
      let at: number;
      if ((movingGroup || outside) && target.payload.groupId !== undefined) {
        // Beside the target's whole block, not inside it.
        const block = shown.filter((e) => e.payload.groupId === target.payload.groupId);
        at = before ? shown.indexOf(block[0]!) : shown.indexOf(block[block.length - 1]!) + 1;
      } else {
        at = shown.indexOf(target) + (before ? 0 : 1);
      }
      shown.splice(at, 0, ...moving);
      if (!movingGroup) {
        const el = moving[0]!;
        const gid = outside ? undefined : target.payload.groupId;
        if (gid === undefined) delete el.payload.groupId;
        else el.payload.groupId = gid;
      }
      c.elements = [...shown.reverse(), ...taps];
      pruneGroups(c);
      packGroups(c);
    });
  }

  /** Drag-and-drop wiring shared by every row in the list. */
  private rowDrag(id: string, edit: boolean) {
    return {
      draggable: edit ? "true" : "false",
      onStart: (e: DragEvent) => {
        this.dragId = id;
        e.dataTransfer?.setData("text/plain", id);
        if (e.dataTransfer) e.dataTransfer.effectAllowed = "move";
        (e.currentTarget as HTMLElement).classList.add("dragging");
      },
      onEnd: (e: DragEvent) => { this.dragId = undefined; (e.currentTarget as HTMLElement).classList.remove("dragging"); },
      onOver: (e: DragEvent) => {
        if (!this.dragId || this.dragId === id) return;
        e.preventDefault();
        const row = e.currentTarget as HTMLElement;
        const r = row.getBoundingClientRect();
        const before = e.clientY < r.top + r.height / 2;
        row.classList.toggle("drop-before", before);
        row.classList.toggle("drop-after", !before);
      },
      onLeave: (e: DragEvent) => { (e.currentTarget as HTMLElement).classList.remove("drop-before", "drop-after"); },
      onDrop: (e: DragEvent) => {
        e.preventDefault();
        const row = e.currentTarget as HTMLElement;
        const before = row.classList.contains("drop-before");
        row.classList.remove("drop-before", "drop-after");
        if (this.dragId) this.reorderLayer(this.dragId, id, before);
        this.dragId = undefined;
      },
    };
  }

  /**
   * Cmd/Ctrl-click adds one row to the pick. Shift-click picks every row from
   * the last clicked row to this one. A plain click selects one and clears
   * the pick.
   */
  private clickRow(id: string, e: MouseEvent) {
    if (e.shiftKey && !e.metaKey && !e.ctrlKey) {
      this.pickRange(id);
      return;
    }
    if (isMultiKey(e)) {
      this.togglePick(id);
      this.pickAnchor = id;
      return;
    }
    this.multi = new Set();
    this.inspect = { kind: "layer", id };
    this.pickAnchor = id;
  }

  /** Pick every row between the anchor and `id`, in list order, groups and all. */
  private pickRange(id: string) {
    const cfg = this.draft?.config;
    const anchor = this.pickAnchor ?? (this.inspect.kind === "layer" ? this.inspect.id : undefined);
    if (!cfg || anchor === undefined || anchor === id) {
      this.togglePick(id);
      return;
    }
    const ids = [...cfg.elements].filter((el) => !isAttachedTap(cfg, el)).reverse().map((el) => el.payload.id);
    const a = ids.indexOf(anchor);
    const b = ids.indexOf(id);
    if (a < 0 || b < 0) {
      this.togglePick(id);
      return;
    }
    this.multi = new Set(ids.slice(Math.min(a, b), Math.max(a, b) + 1));
  }

  /**
   * Add a layer to the pick, or take it out again. The list and the preview
   * both share the one pick set, so a layer picked on the face lights up in
   * the list and the other way round.
   */
  private togglePick(id: string) {
    const next = new Set(this.multi);
    // The layer already selected counts as the first pick, so one modified
    // click on a second layer is enough to have a pair.
    if (next.size === 0 && this.inspect.kind === "layer" && this.inspect.id !== id) next.add(this.inspect.id);
    if (next.has(id)) next.delete(id); else next.add(id);
    this.multi = next;
  }

  private groupPicked() {
    const ids = [...this.multi];
    let gid: string | undefined;
    this.mutate((c) => { gid = createGroup(c, ids); });
    this.multi = new Set();
    if (gid) this.inspect = { kind: "group", id: gid };
  }

  private renderLayers() {
    const cfg = this.draft?.config;
    if (!cfg) return nothing;
    const edit = this.canEdit;
    const family = this.canvasFamily;
    const move = (id: string, dir: -1 | 1) => this.mutate((c) => {
      const rows = c.elements.filter((e) => !isAttachedTap(c, e));
      const taps = c.elements.filter((e) => isAttachedTap(c, e));
      const i = rows.findIndex((e) => e.payload.id === id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= rows.length) return;
      [rows[i], rows[j]] = [rows[j]!, rows[i]!];
      // Stepping past the edge of the block leaves the group; stepping onto a
      // member of another group joins it.
      const el = rows[j]!;
      const neighbour = rows[i]!;
      if (el.payload.groupId !== neighbour.payload.groupId) {
        if (neighbour.payload.groupId === undefined) delete el.payload.groupId;
        else el.payload.groupId = neighbour.payload.groupId;
      }
      c.elements = [...rows, ...taps];
      pruneGroups(c);
      packGroups(c);
    });
    const dup = (id: string) => {
      let copyId: string | undefined;
      this.mutate((c) => { copyId = duplicateElement(c, id); });
      if (copyId) this.inspect = { kind: "layer", id: copyId };
    };
    const del = (id: string) => {
      this.mutate((c) => removeElement(c, id));
      if (this.inspect.kind === "layer" && this.inspect.id === id) this.inspect = { kind: "general" };
    };
    // Top of the list = drawn last = on top. Attached taps are not rows: they
    // show as a badge on the layer they belong to.
    const ordered = [...cfg.elements].filter((el) => !isAttachedTap(cfg, el)).reverse();
    const ctx = describeContext(this.host());
    const resolver = new Resolver(this.buildContext());
    const layout = cfg.perFamily[this.activeFamily];
    const shapeHl = this.inspect.kind === "family";
    const shapeMeta = this.activeFamily === "inline"
      ? "one line of text"
      : `${layout?.backgroundColorHex ? colorWords(layout.backgroundColorHex) : "transparent"} · ${layout?.borderColorHex ? `${layout.borderWidth} pt border` : "no border"}`;
    const pickedCount = [...this.multi].filter((id) => cfg.elements.some((e) => e.payload.id === id)).length;
    // Each row carries a picture of its own layer, drawn alone, the way a
    // painting app's layer list does. The rows resolve the shape the same way
    // the big preview does, so a forced state shows in both.
    const resolved = resolveAll(cfg, this.buildContext(), this.forced)[family];
    const thumb = (ids: readonly string[]) => resolved
      ? html`<span class="thumb">${renderLayerThumb(resolved, ids, { icons: this.icons, imageSizes: this.imageSizes, width: THUMB_W, height: THUMB_H })}</span>`
      : html`<span class="thumb"></span>`;

    const layerRow = (el: CElement, inGroup: boolean) => {
      const id = el.payload.id;
      const hl = this.inspect.kind === "layer" && this.inspect.id === id;
      const eff = effectivePlacement(cfg, family, el);
      const hidden = el.payload.isHidden || eff.isHidden;
      const tap = attachedTapsOf(cfg, id)[0];
      const states = statesSummary(el.payload.rules);
      const pointed = this.picking && this.pickHoverId === id;
      const d = this.rowDrag(id, edit);
      return html`<div class="layer ${hl ? "hl" : ""} ${pointed ? "pick" : ""} ${hidden ? "dim" : ""} ${this.multi.has(id) ? "multi" : ""} ${inGroup ? "kid" : ""}"
        style=${`--k:${KIND_COLOR[el.kind]}`} tabindex="0" draggable=${d.draggable}
        @click=${(e: MouseEvent) => this.clickRow(id, e)}
        @keydown=${(e: KeyboardEvent) => { if (e.key === "Enter") this.inspect = { kind: "layer", id }; }}
        @dragstart=${d.onStart} @dragend=${d.onEnd} @dragover=${d.onOver} @dragleave=${d.onLeave} @drop=${d.onDrop}>
        <span class="grip" title="Drag to reorder. Drop on a folder to put it inside.">${uiIcon("grip")}</span>
        <span class="bar"></span>
        ${thumb([id])}
        <span class="name">
          <b>${layerTitle(el, ctx)}</b>
          <small><span class="kind">${KIND_LABEL[el.kind]}</span> · ${layerMeta(el, resolver)}</small>
        </span>
        <span class="right">
          <span class="badges">
            ${tap ? html`<span class="badge tap" title=${`Tappable · ${layerTitle(tap, ctx)}`}>tap</span>` : nothing}
            ${el.payload.rules.length === 0 ? nothing : html`<span class="badge states" title=${states}>${states.replace(/\.$/, "").toLowerCase()}</span>`}
            ${hidden ? html`<span class="badge">hidden</span>` : nothing}
          </span>
          ${edit ? html`<span class="acts">
            <button class="icon" title="Bring forward" aria-label="Bring forward" @click=${(e: Event) => { e.stopPropagation(); move(id, 1); }}>${uiIcon("up")}</button>
            <button class="icon" title="Send back" aria-label="Send back" @click=${(e: Event) => { e.stopPropagation(); move(id, -1); }}>${uiIcon("down")}</button>
            <button class="icon" title=${eff.isHidden ? `Show in ${familyTitle(family)}` : `Hide in ${familyTitle(family)}`} aria-label=${eff.isHidden ? "Show this layer" : "Hide this layer"} @click=${(e: Event) => { e.stopPropagation(); this.mutate((c) => setPlacement(c, family, id, { isHidden: !eff.isHidden })); }}>${uiIcon(eff.isHidden ? "hide" : "show")}</button>
            <button class="icon" title="Duplicate" aria-label="Duplicate" @click=${(e: Event) => { e.stopPropagation(); dup(id); }}>${uiIcon("duplicate")}</button>
            <button class="icon danger" title="Delete" aria-label="Delete" @click=${(e: Event) => { e.stopPropagation(); del(id); }}>${uiIcon("delete")}</button>
          </span>` : nothing}
        </span>
      </div>`;
    };

    const groupRow = (g: LayerGroup, members: CElement[]) => {
      const hl = this.inspect.kind === "group" && this.inspect.id === g.id;
      const open = !this.collapsed.has(g.id);
      const d = this.rowDrag(g.id, edit);
      // The folder row has three drop zones. Its top edge puts the dragged row
      // above the whole group, outside it. The middle puts it inside, at the
      // top. When the group is folded, its bottom edge puts the row below the
      // whole group. That is what lets a row get past a group that sits at
      // the very top of the list.
      const first = members[0];
      const last = members[members.length - 1];
      const zones = ["drop-before", "drop-into", "drop-after"];
      const zoneAt = (e: DragEvent): string => {
        const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const y = (e.clientY - r.top) / r.height;
        if (y < 0.25) return "drop-before";
        if (!open && y > 0.75) return "drop-after";
        return "drop-into";
      };
      return html`<div class="layer group ${hl ? "hl" : ""}" style=${`--k:${SECTION_COLOR.group}`} tabindex="0" draggable=${d.draggable}
        @click=${() => { this.multi = new Set(); this.inspect = { kind: "group", id: g.id }; }}
        @keydown=${(e: KeyboardEvent) => { if (e.key === "Enter") this.inspect = { kind: "group", id: g.id }; }}
        @dragstart=${d.onStart} @dragend=${d.onEnd}
        @dragover=${(e: DragEvent) => {
          if (!this.dragId || this.dragId === g.id) return;
          e.preventDefault();
          const row = e.currentTarget as HTMLElement;
          const zone = zoneAt(e);
          for (const z of zones) row.classList.toggle(z, z === zone);
        }}
        @dragleave=${(e: DragEvent) => { (e.currentTarget as HTMLElement).classList.remove(...zones); }}
        @drop=${(e: DragEvent) => {
          e.preventDefault();
          const row = e.currentTarget as HTMLElement;
          const zone = zoneAt(e);
          row.classList.remove(...zones);
          const id = this.dragId;
          this.dragId = undefined;
          if (!id || !first || !last) return;
          if (zone === "drop-before") { this.reorderLayer(id, first.payload.id, true, true); return; }
          if (zone === "drop-after") { this.reorderLayer(id, last.payload.id, false, true); return; }
          if (this.isGroupId(id)) return;
          this.reorderLayer(id, first.payload.id, true);
          this.mutate((c) => setGroup(c, id, g.id));
        }}>
        <button class="chev" aria-expanded=${open ? "true" : "false"} title=${open ? "Fold the group" : "Unfold the group"}
          @click=${(e: Event) => { e.stopPropagation(); const next = new Set(this.collapsed); if (open) next.add(g.id); else next.delete(g.id); this.collapsed = next; }}>${uiIcon("chevron")}</button>
        <span class="bar"></span>
        ${thumb(members.map((m) => m.payload.id))}
        <span class="name">
          <b>${g.name}</b>
          <small><span class="kind">Group</span> · ${members.length} layer${members.length === 1 ? "" : "s"} · ${g.locked ? "moves as one" : "unlocked"}</small>
        </span>
        <span class="right">
          ${edit ? html`<span class="acts">
            <button class="icon" title="Ungroup: keep the layers, drop the folder" aria-label="Ungroup" @click=${(e: Event) => { e.stopPropagation(); this.mutate((c) => ungroup(c, g.id)); if (hl) this.inspect = { kind: "general" }; }}>${uiIcon("ungroup")}</button>
          </span>` : nothing}
          <button class="icon lockbtn ${g.locked ? "on" : ""}" ?disabled=${!edit}
            title=${g.locked ? "Locked: drags on the watch move the whole group. Click to unlock." : "Unlocked: each layer moves alone. Click to lock."}
            aria-label=${g.locked ? "Unlock the group" : "Lock the group"}
            @click=${(e: Event) => { e.stopPropagation(); this.mutate((c) => { const x = c.groups?.find((y) => y.id === g.id); if (x) x.locked = !x.locked; }); }}>${uiIcon(g.locked ? "lock" : "unlock")}</button>
        </span>
      </div>`;
    };

    // Walk the stack from the top. A group's members sit together, so the
    // folder row goes in where its first member is met and the members
    // follow it, indented.
    const rows: TemplateResult[] = [];
    const seen = new Set<string>();
    for (let i = 0; i < ordered.length; i++) {
      const el = ordered[i]!;
      const gid = el.payload.groupId;
      const g = gid === undefined ? undefined : cfg.groups?.find((x) => x.id === gid);
      if (!g) {
        rows.push(layerRow(el, false));
        continue;
      }
      if (seen.has(g.id)) continue;
      seen.add(g.id);
      const members = ordered.filter((e) => e.payload.groupId === g.id);
      rows.push(groupRow(g, members));
      if (!this.collapsed.has(g.id)) rows.push(html`<div class="group-kids">${members.map((m) => layerRow(m, true))}</div>`);
    }

    return html`<div class="card">
      <h2 class="panel-title"><span class="swatch">${uiIcon("layers")}</span>Layers<span class="spacer"></span><span class="mini">top draws last</span>${this.renderPickButton()}</h2>
      ${this.activeFamily === "inline" ? html`<div class="hint">Inline is one line of text and draws no layers. The rows here belong to the ${familyTitle(family)} shape.</div>` : nothing}
      ${pickedCount >= 2 && edit
        ? html`<div class="group-cta"><span>${pickedCount} layers picked</span><span class="spacer"></span>
            <button class="small primary" @click=${() => this.groupPicked()}>Group them</button>
            <button class="small" @click=${() => { this.multi = new Set(); }}>Clear</button></div>`
        : cfg.elements.length >= 2 && edit && !cfg.groups?.length
          ? html`<div class="hint">${MULTI_KEY}-click layers here or on the preview, or shift-click a range of rows, then group them so a finished part moves as one.</div>`
          : nothing}
      ${cfg.elements.length === 0 ? html`<div class="empty">No layers yet. Add one above.</div>` : nothing}
      <div class="layers">
      ${rows}
      <div class="layer pinned ${shapeHl ? "hl" : ""}" style=${`--k:${SECTION_COLOR.place}`} tabindex="0" title="The shape is always the bottom layer"
        @click=${() => { this.inspect = { kind: "family" }; }}
        @keydown=${(e: KeyboardEvent) => { if (e.key === "Enter") this.inspect = { kind: "family" }; }}
        @dragover=${(e: DragEvent) => { if (!this.dragId) return; e.preventDefault(); (e.currentTarget as HTMLElement).classList.add("drop-before"); }}
        @dragleave=${(e: DragEvent) => { (e.currentTarget as HTMLElement).classList.remove("drop-before"); }}
        @drop=${(e: DragEvent) => {
          e.preventDefault();
          (e.currentTarget as HTMLElement).classList.remove("drop-before");
          // The very bottom, outside any group. The anchor is the lowest row
          // that is not part of what is being dragged.
          const id = this.dragId;
          const last = [...ordered].reverse().find((e) => e.payload.id !== id && e.payload.groupId !== id);
          if (id && last) this.reorderLayer(id, last.payload.id, false, true);
          this.dragId = undefined;
        }}>
        <span class="grip">${uiIcon("shape")}</span>
        <span class="bar"></span>
        ${thumb([])}
        <span class="name">
          <b>${this.activeFamily === "inline" ? "Inline text" : `${familyTitle(this.activeFamily)} shape`}</b>
          <small><span class="kind">${this.activeFamily === "inline" ? "Inline" : "Background"}</span> · ${shapeMeta}</small>
        </span>
        <span class="right"><span class="badges"><span class="badge">always bottom</span></span></span>
      </div>
      </div>
    </div>`;
  }

  /**
   * The one question a preset asks: which entity is this about.
   *
   * A preset with no entity would be a broken thing on the face, so it is
   * asked for before anything is created and Escape or Cancel creates nothing.
   * A native dialog brings the backdrop, the focus trap and Escape with it;
   * Escape reaches the entity search first, so the first press closes the
   * result list and the second closes the dialog.
   */
  private renderPresetDialog() {
    const spec = this.presetKind ? presetSpec(this.presetKind) : undefined;
    const chosen = this.presetEntity;
    return html`<dialog class="preset-dialog" @keydown=${this.presetKeys}
        @close=${() => { this.presetKind = undefined; this.presetEntity = undefined; }}>
      ${spec === undefined ? nothing : html`
        <h2>${spec.title}</h2>
        <div class="hint">${spec.blurb}</div>
        ${entityField(this.host(), "Entity", chosen ?? { entityId: "", displayName: "", domain: "" },
          (ref) => { this.presetEntity = ref.entityId === "" ? undefined : ref; },
          PRESET_ENTITY_KEY,
          {
            compact: true,
            ...(spec.domains ? { domain: spec.domains } : {}),
            ...(spec.preferNumeric ? { preferNumeric: true } : {}),
          })}
        <div class="adders">
          <button class="primary" ?disabled=${chosen === undefined} @click=${() => this.createFromPreset()}>Create</button>
          <button class="small" @click=${() => this.closePresetDialog()}>Cancel</button>
        </div>
        <div class="hint">Escape creates nothing, and Undo removes a whole preset in one step.</div>`}
    </dialog>`;
  }

  private openPreset(kind: PresetKind) {
    if (!this.canEdit) return;
    this.presetKind = kind;
    this.presetEntity = undefined;
    void this.updateComplete.then(() => {
      const dialog = this.renderRoot.querySelector<HTMLDialogElement>("dialog.preset-dialog");
      if (!dialog) return;
      if (!dialog.open) dialog.showModal();
      // Straight into the search: the entity is the only thing being asked for.
      dialog.querySelector<HTMLInputElement>(".entity-field input")?.focus();
    });
  }

  private closePresetDialog() {
    const dialog = this.renderRoot.querySelector<HTMLDialogElement>("dialog.preset-dialog");
    if (dialog?.open) dialog.close();
    else {
      this.presetKind = undefined;
      this.presetEntity = undefined;
    }
  }

  /**
   * Enter confirms, but only once the search has been answered. The entity
   * field's own Enter takes the highlighted row, so this listener runs in the
   * capture phase and stands back while the list is open.
   */
  private presetKeys = {
    handleEvent: (e: Event) => {
      if ((e as KeyboardEvent).key !== "Enter") return;
      if (this.presetEntity === undefined || entitySearchOpen(PRESET_ENTITY_KEY)) return;
      e.preventDefault();
      e.stopPropagation();
      this.createFromPreset();
    },
    capture: true,
  };

  /** Build the preset in one draft update, so undo removes all of it at once,
   * then select what it made. */
  private createFromPreset() {
    const kind = this.presetKind;
    const ref = this.presetEntity;
    if (!kind || !ref) return;
    const env: PresetEnv = { family: this.canvasFamily };
    const state = this.hass.states[ref.entityId];
    if (state) env.state = state;
    let created: string | undefined;
    this.mutate((c) => { created = applyPreset(c, kind, ref, env); });
    this.closePresetDialog();
    if (created) this.inspect = { kind: "layer", id: created };
  }

  // ── canvas column ─────────────────────────────────────────────────────

  /**
   * The middle column is the whole complication: the shape being edited,
   * big, then everything that belongs to the complication rather than to one
   * layer (its settings, its shapes, the live values it reads).
   */
  private renderCanvas() {
    if (this.parseError) return html`<div class="card error">This document cannot be read: ${this.parseError}</div>`;
    const cfg = this.draft?.config;
    if (!cfg) return html`<div class="card"><div class="empty">Choose a complication in the picker above, or make a new one.</div></div>`;
    const layouts = resolveAll(cfg, this.buildContext(), this.forced);
    this.syncCountdownTicker(layouts);
    const watchCase = this.currentCase();
    const family = this.activeFamily;
    return html`<div class="card canvas-card">
      <div class="canvas-bar">
        <label>Preview as
          <select @change=${(e: Event) => { this.previewCase = (e.target as HTMLSelectElement).value; }}>
            ${CASES.map((c) => html`<option value=${c.label} ?selected=${c.label === watchCase.label}>${c.label}${c.measured ? "" : " (estimated)"}</option>`)}
          </select>
        </label>
        <span class="hint">Layouts are made in the ${REFERENCE_CASE.label} box. Smaller cases scale it down.</span>
        <span class="spacer"></span>
        ${this.renderShowTapsButton()}
      </div>
      <div class="stage">
        ${family === "inline" ? this.renderInlinePreview(layouts.inline, false) : this.renderBigPreview(family, layouts, watchCase)}
        ${this.renderUnder(cfg, family)}
      </div>
      <div class="strip">
        ${this.renderSettingsRow(cfg)}
        ${this.renderShapesRow(cfg, layouts)}
        ${this.renderValuesRow()}
      </div>
    </div>`;
  }

  private renderBigPreview(family: DrawableFamily, layouts: ResolvedAll, watchCase: WatchCase) {
    const layout = layouts[family];
    if (!layout) return nothing;
    const highlightId = this.inspect.kind === "layer" ? this.inspect.id : undefined;
    const cfg = this.draft?.config;
    // A selected group outlines every member; a selected member of a locked
    // group outlines the rest of its group too, since a drag moves them all.
    const gid = this.inspect.kind === "group" ? this.inspect.id : highlightId !== undefined && cfg ? groupOf(cfg, highlightId)?.id : undefined;
    const groupIds = cfg && gid !== undefined && (this.inspect.kind === "group" || groupOf(cfg, highlightId!)?.locked)
      ? groupMembers(cfg, gid).map((m) => m.payload.id) : [];
    // Layers picked for grouping, in the list or on the face, outline as well,
    // so the pick reads the same in both places.
    const outlineIds = [...new Set([...groupIds, ...this.multi])];
    const slot = watchCase.slots[family];
    // Pick mode drops the resize handles: they are drag affordances, and
    // while picking nothing on the face is dragged. Review mode drops them
    // too, except on the one tap box it is narrowed to.
    const focus = this.focusTapId();
    const opts = {
      icons: this.icons, imageSizes: this.imageSizes, showHidden: true, tapAreas: true, slot,
      highlightId: focus ?? highlightId,
      ...(outlineIds.length > 0 && !this.showTaps ? { highlightIds: outlineIds } : {}),
      tapReview: this.showTaps,
      ...(focus !== undefined ? { tapFocusId: focus } : {}),
      handles: this.canEdit && !this.picking && (!this.showTaps || focus !== undefined),
      ...(this.picking && this.pickHoverId !== undefined ? { hoverId: this.pickHoverId } : {}),
      ...(this.timestampActiveId !== undefined && this.timestampActiveId === highlightId && !this.showTaps && !this.picking
        ? { timestampActiveId: this.timestampActiveId } : {}),
    };
    return html`<div class="preview ${family} active ${this.picking ? "picking" : ""}"
      @pointerdown=${(e: PointerEvent) => this.onPreviewPointerDown(family, e)}
      @pointermove=${(e: PointerEvent) => this.onPickMove(e)}
      @pointerleave=${() => { if (this.picking) this.pickHoverId = undefined; }}>
      ${renderLayout(layout, opts)}
    </div>`;
  }

  /** The line under the preview: which shape, its size, and what a drag does now. */
  private renderUnder(cfg: CustomComplicationConfig, family: FamilyKind) {
    const ctx = describeContext(this.host());
    const ins = this.inspect;
    const sel = ins.kind === "layer" ? cfg.elements.find((e) => e.payload.id === ins.id) : undefined;
    let tail: TemplateResult | string;
    if (this.showTaps) {
      tail = html`Every tap area is outlined. Where two overlap, the one higher in Layers wins. Anywhere else does <b>${describeTapAction(cfg.tapAction)}</b>.`;
    } else if (this.picking) {
      tail = "Point at a layer and click it. Escape stops.";
    } else if (family === "inline") {
      tail = "One line of text. Edit it on the right.";
    } else if (ins.kind === "group") {
      const g = cfg.groups?.find((x) => x.id === ins.id);
      const n = g ? groupMembers(cfg, g.id).length : 0;
      tail = g ? html`editing group <b>${g.name}</b>. ${g.locked ? `Drag to move all ${n} layers.` : "Unlocked: each layer drags alone."}` : "";
    } else if (sel) {
      const g = groupOf(cfg, sel.payload.id);
      tail = g?.locked
        ? html`editing <b>${layerTitle(sel, ctx)}</b> in <b>${g.name}</b>. A drag moves the whole group; pull a corner to resize this layer. Arrow keys nudge the group.`
        : html`editing <b>${layerTitle(sel, ctx)}</b>. Drag it, or pull a corner. Arrow keys nudge it.`;
    } else {
      tail = "click a layer to edit it";
    }
    if (family === "inline") return html`<div class="under"><b>Inline</b> · ${tail}</div>`;
    const slot = this.currentCase().slots[family];
    const fit = fitBox(slot, family);
    const pct = Math.round(fit.scale * 100);
    return html`<div class="under"><b>${familyTitle(family)}</b> · ${slot.width} × ${slot.height} pt${pct !== 100 ? ` · ${pct}%` : ""} · ${tail}</div>`;
  }

  /** The Inline shape as one line: symbol, then `label: value`, the way the
   * watch draws it on a wide face. A live countdown ticks with the same timer
   * the canvas previews use. */
  private renderInlinePreview(inline: ResolvedInline | undefined, small: boolean) {
    let line: TemplateResult;
    if (!inline) {
      line = html`<div class="inline-line missing">No inline text</div>`;
    } else {
      const now = Date.now();
      const value = inline.countdownEnd !== undefined && inline.countdownEnd > now
        ? countdownRemainingString((inline.countdownEnd - now) / 1000)
        : inline.text;
      const symbol = inline.symbol ? this.icons.render(inline.symbol, small ? 11 : 15, "#FFFFFF") : undefined;
      line = html`<div class="inline-line">${symbol ?? nothing}<span>${inline.label ? `${inline.label}: ` : ""}${value}</span></div>`;
    }
    if (small) return line;
    return html`<div class="preview inline active" @click=${() => { this.inspect = { kind: "family" }; }}>${line}</div>`;
  }

  /** The complication's own settings, as plain fields under the preview. */
  private renderSettingsRow(cfg: CustomComplicationConfig) {
    const host = this.host();
    const rec = this.records.find((r) => r.id === this.selectedId);
    const owner = this.selectedOwner;
    const mini = [rec ? `Revision ${rec.revision}` : "Not saved yet", owner ? ownerLabel(owner) : undefined].filter(Boolean).join(" · ");
    const values = cfg.values;
    const resolver = new Resolver(this.buildContext());
    const ctx = describeContext(host);
    return html`<div class="strip-row" style=${`--c:${SECTION_COLOR.complication}`} @change=${() => this.draft?.endGesture()}>
      <h2 class="panel-title"><span class="swatch">${uiIcon("watch")}</span>Complication<span class="spacer"></span><span class="mini">${mini}</span>
        <button class="small" @click=${() => this.openRaw()}>Raw JSON</button>
        ${this.canEdit ? html`
          <button class="small" @click=${() => this.duplicate()}>Duplicate</button>
          ${this.confirmDelete
            ? html`<button class="danger small" @click=${() => void this.deleteCurrent()}>Really delete</button><button class="small" @click=${() => { this.confirmDelete = false; }}>Cancel</button>`
            : html`<button class="danger small" @click=${() => { this.confirmDelete = true; }}>Delete</button>`}` : nothing}
      </h2>
      <div class="settings" style=${this.canEdit ? "" : "pointer-events:none;opacity:.6"}>${generalEditor(host)}</div>
      <div class="values-list">
        <div class="values-head"><span class="sub">Shared values</span>
          ${this.canEdit ? html`<button class="small" @click=${() => { const nv = newNamedValue(); this.mutate((c) => { c.values.push(nv); }); this.inspect = { kind: "data", id: nv.id }; }}>Add</button>` : nothing}
          <span class="help" title="A value defined once and read by several layers. Set a layer's Source to &quot;Named value&quot; to use one.">Defined once, read by several layers.</span>
        </div>
        ${values.length === 0 ? html`<p class="empty">No shared values yet.</p>` : html`<div class="data">
        ${values.map((v) => {
          const r = resolver.resolve({ kind: { kind: "named", id: v.id } });
          const hl = this.inspect.kind === "data" && this.inspect.id === v.id;
          return html`<div class="datum ${hl ? "hl" : ""}" @click=${() => { this.inspect = { kind: "data", id: v.id }; }}>
            <span class="name">${v.name || "(unnamed)"}</span>
            <span class="meta ${r === undefined ? "none" : ""}" title=${describeValue(v.value, ctx)}>${r ?? "unresolved"}</span>
            ${this.canEdit ? html`<button class="icon danger" title="Delete value" aria-label="Delete value" @click=${(e: Event) => { e.stopPropagation(); this.mutate((c) => { c.values = c.values.filter((x) => x.id !== v.id); }); if (hl) this.inspect = { kind: "general" }; }}>${uiIcon("delete")}</button>` : nothing}
          </div>`;
        })}
        </div>`}
      </div>
    </div>`;
  }

  /** Open the footer on its raw document, which is where the JSON lives. */
  private openRaw() {
    this.showRaw = true;
    const foot = this.renderRoot.querySelector<HTMLDetailsElement>("details.foot");
    if (foot) foot.open = true;
    void this.updateComplete.then(() => this.renderRoot.querySelector("pre")?.scrollIntoView({ block: "nearest" }));
  }

  /** One tile per shape. The supported ones draw small; clicking one swaps it
   * into the big preview. A missing one is a dashed "Add". */
  private renderShapesRow(cfg: CustomComplicationConfig, layouts: ResolvedAll) {
    const have = cfg.supportedFamilies;
    return html`<div class="strip-row">
      <h2 class="panel-title" style=${`--c:${SECTION_COLOR.place}`}><span class="swatch">${uiIcon("shape")}</span>Shapes</h2>
      <div class="tiles">
        ${ALL_FAMILIES.map((f) => {
          const on = have.includes(f);
          if (!on) {
            return html`<button class="tile off ${f}" ?disabled=${!this.canEdit} title=${`Add the ${familyTitle(f)} shape`} @click=${() => this.addShape(f)}>
              <span class="art"><span class="ghost ${f}"></span></span>
              <span class="lbl">+ Add ${familyTitle(f)}</span>
            </button>`;
          }
          const active = f === this.activeFamily;
          let art: TemplateResult | typeof nothing;
          if (f === "inline") art = this.renderInlinePreview(layouts.inline, true);
          else {
            const layout = layouts[f];
            art = layout ? renderLayout(layout, { icons: this.icons, imageSizes: this.imageSizes, slot: REFERENCE_CASE.slots[f] }) : nothing;
          }
          const empty = f !== "inline" && cfg.elements.every((e) => effectivePlacement(cfg, f, e).isHidden || e.payload.isHidden) && cfg.elements.length > 0;
          const removable = this.canEdit && canRemoveFamily(cfg, f);
          // The remove button sits beside the tile, not inside it: a button
          // inside a button is not valid markup.
          return html`<div class="tile-wrap">
            <button class="tile ${f}" aria-pressed=${active ? "true" : "false"} title=${`Edit the ${familyTitle(f)} shape`}
              @click=${() => { this.activeFamily = f; if (f === "inline" && this.inspect.kind === "layer") this.inspect = { kind: "family" }; }}>
              <span class="art">${art}</span>
              <span class="lbl">${familyTitle(f)}${empty ? html`<small>· nothing shown</small>` : nothing}${active ? html`<small>· editing</small>` : nothing}</span>
            </button>
            ${this.canEdit ? html`<button class="icon danger tile-x" ?disabled=${!removable}
              title=${removable ? `Remove the ${familyTitle(f)} shape` : "The only shape. Add another before removing it."}
              aria-label=${`Remove the ${familyTitle(f)} shape`}
              @click=${(e: Event) => { e.stopPropagation(); this.removeShape(f); }}>${uiIcon("delete")}</button>` : nothing}
          </div>`;
        })}
      </div>
      <div class="help">Click a shape to edit it in the big preview. Each shape keeps its own placements. Each shape adds an entry to the watch face picker. If you do not need a shape, delete it with the trash can on its card.</div>
    </div>`;
  }

  /**
   * Every entity the complication reads, with its live value. Clicking one
   * lets a different value be typed in, and the previews and the States cards
   * react to it exactly as the watch would. Nothing is saved: it is a way to
   * see the other states without waiting for the house to change.
   */
  private renderValuesRow() {
    const cfg = this.draft?.config;
    if (!cfg) return nothing;
    const ids = [...(this.compiled?.entities.keys() ?? [])];
    const testing = this.testValues.size > 0;
    return html`<div class="strip-row">
      <h2 class="panel-title" style=${`--c:${SECTION_COLOR.states}`}><span class="swatch">${uiIcon("states")}</span>Values on the watch<span class="spacer"></span>
        ${testing ? html`<span class="testing-pill">Testing with your values <button @click=${() => { this.testValues = new Map(); this.editingValue = undefined; }}>Back to live</button></span>` : nothing}
      </h2>
      ${ids.length === 0 ? html`<div class="hint">No entities yet. Give a layer an entity and its live value shows here.</div>` : html`<div class="chips values">
        ${ids.map((id) => {
          const s = this.hass.states[id];
          const name = typeof s?.attributes.friendly_name === "string" ? s.attributes.friendly_name : id;
          const unit = typeof s?.attributes.unit_of_measurement === "string" ? ` ${s.attributes.unit_of_measurement}` : "";
          const live = s ? `${s.state}${unit}` : "not in Home Assistant";
          const override = this.testValues.get(id);
          const user = cfg.elements.find((e) => layerEntityUses(cfg, e.payload.id).some((u) => u.ref.entityId === id));
          const kind = user?.kind ?? "text";
          const editing = this.editingValue === id;
          return html`<button class="vchip ${override !== undefined ? "testing" : ""}" style=${`--k:${KIND_COLOR[kind]}`}
            title=${override !== undefined ? `Live value: ${live}. Click to change the test value.` : "Click to try a different value"}
            @click=${(e: Event) => { if ((e.target as HTMLElement).tagName === "INPUT") return; this.editingValue = id; void this.updateComplete.then(() => this.renderRoot.querySelector<HTMLInputElement>(".vchip input")?.focus()); }}>
            <span class="dom">${uiIcon(kind)}</span><b>${name}</b>
            ${editing
              ? html`<input type="text" .value=${override ?? s?.state ?? ""} aria-label=${`Test value for ${name}`}
                  @keydown=${(e: KeyboardEvent) => { if (e.key === "Enter") (e.target as HTMLInputElement).blur(); if (e.key === "Escape") { this.editingValue = undefined; } }}
                  @blur=${(e: FocusEvent) => this.commitTestValue(id, (e.target as HTMLInputElement).value)} />`
              : html`<span class="val">${override !== undefined ? `${override}${unit}` : live}</span>`}
          </button>`;
        })}
      </div>
      <div class="help">Live from Home Assistant. Click a value to try a different one and watch the states react. Nothing is saved.</div>`}
    </div>`;
  }

  private commitTestValue(id: string, raw: string) {
    this.editingValue = undefined;
    const v = raw.trim();
    const next = new Map(this.testValues);
    const live = this.hass.states[id]?.state;
    if (v === "" || v === live) next.delete(id);
    else next.set(id, v);
    this.testValues = next;
  }

  private currentCase() {
    return CASES.find((c) => c.label === this.previewCase) ?? REFERENCE_CASE;
  }

  private previewSlot(family: DrawableFamily) {
    return this.currentCase().slots[family];
  }

  // ── inspector ─────────────────────────────────────────────────────────

  private crumbs(cfg: CustomComplicationConfig, picked?: number) {
    const ins = this.inspect;
    const name = cfg.name.trim() || "Complication";
    const shape = this.activeFamily === "inline" ? "Inline" : familyTitle(this.activeFamily);
    const shapeCrumb = ins.kind === "family" && picked === undefined
      ? html`<span class="here" style=${`--k:${SECTION_COLOR.place}`}>${shape} shape</span>`
      : html`<button @click=${() => { this.inspect = { kind: "family" }; }} title="Edit the shape">${shape}</button>`;
    let here: TemplateResult | typeof nothing = nothing;
    let parent: TemplateResult | typeof nothing = nothing;
    // A pick of several layers is what the inspector is about, whatever the
    // one selected layer under it happens to be.
    if (picked !== undefined) {
      here = html`<span class="here" style="--k:var(--wa-accent)"><span class="kchip">Picked</span>${picked} layers</span>`;
    } else if (ins.kind === "layer") {
      const el = cfg.elements.find((e) => e.payload.id === ins.id);
      if (el) {
        here = html`<span class="here" style=${`--k:${KIND_COLOR[el.kind]}`}><span class="kchip">${KIND_LABEL[el.kind]}</span>${layerTitle(el, describeContext(this.host()))}</span>`;
        const g = groupOf(cfg, el.payload.id);
        if (g) parent = html`<span class="sep">›</span><button @click=${() => { this.inspect = { kind: "group", id: g.id }; }} title="Edit the group">${g.name}</button>`;
      }
    } else if (ins.kind === "group") {
      const g = cfg.groups?.find((x) => x.id === ins.id);
      if (g) here = html`<span class="here" style=${`--k:${SECTION_COLOR.group}`}><span class="kchip">Group</span>${g.name}</span>`;
    } else if (ins.kind === "data") {
      const nv = cfg.values.find((v) => v.id === ins.id);
      if (nv) here = html`<span class="here" style=${`--k:${SECTION_COLOR.complication}`}><span class="kchip">Value</span>${nv.name || "(unnamed)"}</span>`;
    } else if (ins.kind === "general") {
      here = html`<span class="mini">nothing selected</span>`;
    }
    return html`<div class="crumbs">
      <span>${name}</span><span class="sep">›</span>${shapeCrumb}${parent}
      ${here === nothing ? nothing : html`<span class="sep">›</span>${here}`}
    </div>`;
  }

  /** The picked layers that still exist, in the document's draw order. */
  private pickedElements(cfg: CustomComplicationConfig): CElement[] {
    if (this.multi.size < 2) return [];
    return cfg.elements.filter((e) => this.multi.has(e.payload.id));
  }

  /**
   * The inspector: the thing that was clicked, as a column of cards. The
   * complication's own settings live under the preview, so with nothing
   * selected the column says so instead of showing a form.
   *
   * A pick of two or more layers takes the column over. The one-layer form
   * would still be showing whichever layer was selected first, and every edit
   * in it would land on that one layer alone, which is a lie the size of the
   * whole inspector.
   */
  private renderInspector() {
    const cfg = this.draft?.config;
    if (!cfg) return nothing;
    const picked = this.pickedElements(cfg);
    if (picked.length >= 2) {
      return html`
        <div class="insp-head">${this.crumbs(cfg, picked.length)}</div>
        <div class="insp-body" style=${this.canEdit ? "" : "pointer-events:none;opacity:.6"}
          @change=${() => this.draft?.endGesture()}>${this.multiEditor(cfg, picked)}</div>`;
    }
    const host = this.host();
    const ins = this.inspect;
    let body: TemplateResult | typeof nothing = nothing;
    let cards = true;
    if (ins.kind === "layer") {
      const el = cfg.elements.find((e) => e.payload.id === ins.id);
      if (!el) {
        this.inspect = { kind: "general" };
        return nothing;
      }
      body = layerEditor(host, el, this.canvasFamily);
    } else if (ins.kind === "group") {
      const g = cfg.groups?.find((x) => x.id === ins.id);
      if (!g) {
        this.inspect = { kind: "general" };
        return nothing;
      }
      cards = false;
      body = groupEditor(host, g);
    } else if (ins.kind === "data") {
      const nv = cfg.values.find((v) => v.id === ins.id);
      if (!nv) {
        this.inspect = { kind: "general" };
        return nothing;
      }
      cards = false;
      body = html`<div class="sec" data-open="true" style=${`--c:${SECTION_COLOR.complication}`}>
        <div class="sec-h"><span class="swatch">${uiIcon("content")}</span><span class="tt"><h4>Shared value</h4><span class="sum">Read by layers whose Source is "Named value"</span></span></div>
        <div class="sec-b">${namedValueEditor(host, nv)}</div>
      </div>`;
    } else if (ins.kind === "family") {
      body = familyEditor(host, this.activeFamily);
    } else {
      cards = false;
      body = html`<div class="empty-insp">${uiIcon("layers")}<b>Nothing selected</b>
        <span>Click a layer on the watch or in the list to edit it.<br />The shape's own background and border are the bottom row of the list.</span></div>`;
    }
    const all = this.openSections.size > 1;
    return html`
      <div class="insp-head">
        ${this.crumbs(cfg)}
        ${cards ? html`<button class="expand" @click=${() => { this.openSections = all ? new Set([defaultSection(ins)]) : new Set(ALL_SECTIONS); }}>${all ? "One at a time" : "Open all"}</button>` : nothing}
      </div>
      <div class="insp-body" style=${this.canEdit ? "" : "pointer-events:none;opacity:.6"} @change=${() => this.draft?.endGesture()}>${body}</div>`;
  }

  /**
   * A tick that three states fit into: on, off, and "these layers disagree".
   * A click on a mixed one settles the argument rather than flipping each
   * layer, which is the only reading that is the same before and after.
   */
  private triCheck(label: string, state: PickedFlag, set: (v: boolean) => void) {
    return html`<label class="field check">
      <input type="checkbox" .checked=${state === "all"} .indeterminate=${state === "mixed"}
        @change=${(e: Event) => set((e.target as HTMLInputElement).checked)} />
      <span>${label}${state === "mixed" ? html` <span class="mixed">(mixed)</span>` : nothing}</span></label>`;
  }

  /**
   * The inspector with several layers picked: which ones, what to do with the
   * set, and the few settings they all have in common.
   *
   * Deliberately short. Everything here has to mean the same thing on a text
   * layer, a picture and a tap area, so anything that reads differently per
   * kind stays in the one-layer editor where the form matches the object.
   */
  private multiEditor(cfg: CustomComplicationConfig, picked: readonly CElement[]): TemplateResult {
    const family = this.canvasFamily;
    const ctx = describeContext(this.host());
    const resolver = new Resolver(this.buildContext());
    const common = pickedCommon(cfg, family, picked);
    const n = picked.length;
    // Top of the list draws last, same as the Layers card, so the two agree.
    const rows = [...picked].reverse();
    const setHiddenHere = (v: boolean) => this.mutate((c) => {
      for (const el of picked) setPlacement(c, family, el.payload.id, { isHidden: v });
    });
    const setHiddenEverywhere = (v: boolean) => this.mutate((c) => {
      for (const el of picked) {
        const t = c.elements.find((e) => e.payload.id === el.payload.id);
        if (t) t.payload.isHidden = v;
      }
    });
    const setColour = (v: string) => this.mutate((c) => {
      for (const el of picked) {
        const t = c.elements.find((e) => e.payload.id === el.payload.id);
        if (t && t.kind !== "image" && t.kind !== "tap") t.payload.colorSlot.baseColorHex = v;
      }
    }, "multi-colour");
    return html`
      <div class="sec" data-open="true" style="--c:var(--wa-accent)">
        <div class="sec-h"><span class="swatch">${uiIcon("layers")}</span>
          <span class="tt"><h4>${n} layers picked</h4><span class="sum">Edits here land on all ${n}</span></span></div>
        <div class="sec-b">
          <div class="picked">
            ${rows.map((el) => html`<div class="row" style=${`--k:${KIND_COLOR[el.kind]}`}>
              <span class="bar"></span>
              <span class="name">
                ${el.kind === "icon" ? html`<span class="glyph">${this.icons.render(resolver.resolve(el.payload.symbol) ?? "questionmark", 16, el.payload.colorSlot.baseColorHex) ?? nothing}</span>` : nothing}
                <b>${layerTitle(el, ctx)}</b><span class="kind">${KIND_LABEL[el.kind]}</span>
              </span>
            </div>`)}
          </div>
          <div class="hint">${MULTI_KEY}-click a layer to add it or take it out. Click one on its own to edit it alone.</div>
          <div class="adders">
            <button class="small primary" @click=${() => this.groupPicked()}>Group them</button>
            <button class="small" @click=${() => { this.multi = new Set(); }}>Clear</button>
          </div>
        </div>
      </div>
      <div class="sec" data-open="true" style=${`--c:${SECTION_COLOR.place}`}>
        <div class="sec-h"><span class="swatch">${uiIcon("place")}</span>
          <span class="tt"><h4>All ${n} at once</h4><span class="sum">The settings every picked layer has</span></span></div>
        <div class="sec-b">
          ${this.triCheck(`Hidden in ${familyTitle(family)}`, common.hiddenHere, setHiddenHere)}
          ${this.triCheck("Hidden in every shape", common.hiddenEverywhere, setHiddenEverywhere)}
          ${common.colourable
            ? html`${colorField("Colour", common.colour, (v) => { if (v !== undefined) setColour(v); })}
              ${common.colour === undefined ? html`<div class="hint">These layers are different colours. Pick one to give them all the same.</div>` : nothing}`
            : html`<div class="hint">No shared colour: a picture and a tap area have none.</div>`}
          <div class="hint">Size, content and states belong to one layer at a time. Click a layer on its own to reach them.</div>
        </div>
      </div>`;
  }

  /**
   * Status and the raw document, folded into one line at the foot of the panel.
   *
   * Neither is part of authoring, so neither earns a card in the column beside
   * the previews. The summary still says the one thing that is worth a glance
   * while it is shut, which is whether the work is saved.
   */
  private renderFooter() {
    const d = this.draft;
    if (!d) return nothing;
    const rec = this.records.find((r) => r.id === this.selectedId);
    const status = draftStatus({
      revision: rec?.revision ?? null,
      dirty: d.dirty,
      ...(this.saveError !== undefined ? { error: this.saveError } : {}),
      ...(this.templateError !== undefined ? { templateError: this.templateError } : {}),
    });
    return html`<details class="foot">
      <summary>
        <span class="foot-dot ${status.tone}">●</span>
        <span class="foot-text">${status.text}</span>
        <span class="foot-more">Details and raw configuration</span>
      </summary>
      <div class="foot-body">
        <dl class="kv">
          <dt>Revision</dt><dd>${rec ? rec.revision : "unsaved"}${d.dirty ? html` <span class="warn">· unsaved changes</span>` : ""}</dd>
          ${rec ? html`<dt>Saved</dt><dd>${rec.updatedAt || "—"} by ${rec.updatedBy || "—"}</dd>` : nothing}
          <dt>Templates</dt><dd class=${this.templateError ? "err" : "ok"}>${this.templateError ?? (this.compiled?.document ? "rendered" : "none")}</dd>
          <dt>Entities</dt><dd>${this.compiled?.entities.size ?? 0}</dd>
        </dl>
        <p class="hint">Save writes to Home Assistant. Open Wrist Assistant on the watch to pull it down.</p>
        <button class="link" @click=${() => (this.showRaw = !this.showRaw)}>${this.showRaw ? "Hide the raw configuration" : "Show the raw configuration"}</button>
        ${this.showRaw ? html`<pre>${JSON.stringify(d.encoded(), null, 2)}</pre>` : nothing}
      </div>
    </details>`;
  }
}

function errText(err: unknown): string {
  return String((err as { message?: string })?.message ?? err);
}

/** Watch name plus the iPhone it is paired to, which is what tells two
    watches apart when both report themselves as "Apple Watch". */
/** HA serializes timer durations as "H:MM:SS" (numbers pass through). */
function parseDurationSeconds(v: unknown): number | undefined {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v !== "string" || v === "") return undefined;
  const parts = v.split(":").map((p) => Number(p));
  if (parts.length === 0 || parts.length > 3 || parts.some((n) => Number.isNaN(n))) return undefined;
  return parts.reduce((acc, n) => acc * 60 + n, 0);
}

function ownerLabel(o: OwnerSummary): string {
  const name = o.device_name ?? o.owner_watch_id;
  return o.paired_iphone_name ? `${name} (${o.paired_iphone_name})` : name;
}

/** The second line of a Layers row: the live reading and the one look fact
 * that tells this layer from its neighbours. */
function layerMeta(el: CElement, resolver: Resolver): string {
  switch (el.kind) {
    case "text": return `${resolver.resolve(el.payload.value) ?? "--"} · ${el.payload.fontSize} pt`;
    case "icon": return `${el.payload.size} pt · ${colorWords(el.payload.colorSlot.baseColorHex)}`;
    case "gauge": return `${resolver.resolve(el.payload.value) ?? "--"} · ${el.payload.style}`;
    case "shape": return `${colorWords(el.payload.colorSlot.baseColorHex)}${el.payload.borderColorHex ? " · border" : ""}`;
    case "image": return `${el.payload.contentMode === "fill" ? "fill" : "fit"} · ${el.payload.timestamp ? "time shown" : "no time"}`;
    case "tap": return describeTapAction(el.payload.action);
  }
}


// After an HA restart the frontend re-imports the panel module under its
// new cache-busted URL in the same page, so a plain @customElement would
// throw "name already used". The old class keeps serving until reload.
if (!customElements.get("wrist-assistant-panel")) {
  customElements.define("wrist-assistant-panel", WristAssistantPanel);
}

declare global {
  interface HTMLElementTagNameMap {
    "wrist-assistant-panel": WristAssistantPanel;
  }
}
