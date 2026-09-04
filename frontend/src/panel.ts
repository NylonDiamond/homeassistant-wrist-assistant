// Home Assistant sidebar panel: <wrist-assistant-panel>.
// Pick a watch, pick a complication, edit a browser-side draft with live
// previews for all three families, then Save with the record's revision so
// a concurrent edit is caught instead of overwritten (plan §"Save and
// conflict rules"). Rules are edited in the inspector's States section.

import { LitElement, html, css, nothing, type PropertyValues, type TemplateResult } from "lit";
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
  duplicateElement,
  freeSlotFrom,
  isAttachedTap,
  newConfig,
  newElement,
  newId,
  parseConfig,
  removeElement,
  selectableLayerId,
  hasFreeTimestamp,
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
import { CASES, REFERENCE_CASE, caseForScreenSize, cornerTileSide, familyTitle, fitBox, renderLayout, type DrawableFamily, type IconProvider } from "./renderer.js";
import { ALL_FAMILIES, addFamily, canRemoveFamily, familyContentSummary, firstDrawable, isDrawable, removeFamily, supportedFamilies } from "./layouts.js";
import { updateWatchMessage, watchSupportsShapes } from "./version.js";
import { makeIconProvider } from "./icons.js";
import { makeImageSizeProvider } from "./image-sizes.js";
import { SymbolBrowser } from "./symbols.js";
import { Draft, draftStatus } from "./draft.js";
import { statesSummary } from "./states.js";
import { uiIcon } from "./ui-icons.js";
import { beginGesture, beginPointDrag, type HandleCorner } from "./interact.js";
import {
  type DescribeContext,
  type EditorHost,
  describeContext,
  describeValue,
  effectivePlacement,
  entityField,
  entitySearchOpen,
  familyEditor,
  generalEditor,
  layerEditor,
  namedValueEditor,
  newNamedValue,
  setPlacement,
} from "./editors.js";
import { type PresetEnv, type PresetKind, LAYER_PRESETS, applyPreset, presetSpec } from "./presets.js";

const TEMPLATE_REFRESH_MS = 30_000;
const TEMPLATE_DEBOUNCE_MS = 500;

/** Search key for the preset dialog's entity field. One dialog, one field, so
 * one key; the field's transient search state lives in editors.ts under it. */
const PRESET_ENTITY_KEY = "preset-entity";

/** What the inspector is showing. One object, one selection: a layer's states
 * and its placement are sections of the layer, not selections of their own. */
type Inspect =
  | { kind: "general" }
  | { kind: "family" }
  | { kind: "data"; id: string }
  | { kind: "layer"; id: string };

/** Identity of a selection, so a re-render can tell "the same thing changed"
 * from "something else is selected now". */
function inspectKey(i: Inspect): string {
  return "id" in i ? `${i.kind}:${i.id}` : i.kind;
}

type Conflict = { current: ComplicationRecord | null; message: string };

const COL_LEFT_DEFAULT = 270;
const COL_RIGHT_DEFAULT = 340;
const COL_MIN = 200;
const COL_MAX = 720;
/** The canvas column never goes below this while three columns are shown. */
const CANVAS_MIN = 320;
/** .layout's own padding (16 each side) plus its column gaps and gutter tracks:
 * four 8px gaps and two 8px gutters with three columns, two gaps and one
 * gutter with two. */
const CHROME_3 = 32 + 4 * 8 + 2 * 8;
const CHROME_2 = 32 + 2 * 8 + 8;
const COL_STORE_KEY = "wrist-assistant-panel.columns";

const clampColumn = (n: number) => Math.max(COL_MIN, Math.min(COL_MAX, Math.round(n)));

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
  @state() private activeFamily: FamilyKind = "rectangular";
  /** Pick mode: the pointer names the layer under it instead of dragging it,
   * the way a browser inspector picks a node. One click selects and ends it. */
  @state() private picking = false;
  /** The layer the pick-mode pointer is over. Shaded in every preview and
   * marked in the Layers card, so the two lists answer each other. */
  @state() private pickHoverId?: string;
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

  static override styles = css`
    :host {
      /* Column so the footer can sit under a layout that takes the rest of the
         height, rather than being pushed off the bottom of the page. */
      display: flex;
      flex-direction: column;
      height: 100%;
      color: var(--primary-text-color);
      background: var(--primary-background-color);
      font-family: var(--paper-font-body1_-_font-family, Roboto, sans-serif);
    }
    header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 16px;
      border-bottom: 1px solid var(--divider-color);
      background: var(--app-header-background-color, var(--primary-color));
      color: var(--app-header-text-color, #fff);
      flex-wrap: wrap;
    }
    header h1 { font-size: 18px; font-weight: 500; margin: 0; flex: 1; }
    header select { font: inherit; padding: 4px 8px; }
    .toolbar { display: flex; gap: 6px; align-items: center; flex-wrap: wrap; }
    .toolbar button, button.primary, button.small, button.danger {
      font: inherit; font-size: 13px; padding: 6px 12px; border-radius: 8px; cursor: pointer;
      border: 1px solid var(--divider-color); background: var(--card-background-color, #fff); color: var(--primary-text-color);
    }
    .toolbar button:disabled, button:disabled { opacity: .45; cursor: default; }
    button.primary { background: var(--primary-color); color: var(--text-primary-color, #fff); border-color: transparent; }
    button.danger { color: var(--error-color, #db4437); border-color: var(--error-color, #db4437); }
    /* The adders and the row buttons. 3px of padding made a 21px target for a
       12px label; this is the same button one size up, which is still small
       against a preset button but no longer something to aim at. */
    button.small { padding: 5px 10px; font-size: 12.5px; min-height: 26px; }
    /* Row actions. They were 12px glyphs in a 2px box: too small to hit and
       too cryptic to read (a filled dot meant "visible"). Now every one is a
       28px target with a drawn icon, which is about a fingertip and the
       smallest thing a pointer hits without aiming. */
    button.icon {
      font: inherit; border: none; background: none; cursor: pointer; color: inherit;
      display: inline-flex; align-items: center; justify-content: center;
      width: 28px; height: 28px; padding: 0; border-radius: 6px; opacity: .75;
    }
    button.icon:hover:not(:disabled) { opacity: 1; background: rgba(127,127,127,.22); }
    button.icon:focus-visible { opacity: 1; outline: 2px solid var(--primary-color); outline-offset: -2px; }
    button.icon.danger:hover:not(:disabled) { color: var(--error-color, #db4437); }
    svg.ui-icon { width: 17px; height: 17px; display: block; }
    .dirty-dot { display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: var(--warning-color, #ffa600); margin-left: 6px; }
    /* Three columns with a draggable gutter between each pair. The side widths
       come in as custom properties already fitted to the measured panel width
       (see columnFit), and every track can shrink to zero here, so the grid
       itself can never be wider than the panel and clip a column. How many
       columns there are is decided from that same measurement rather than from
       a viewport media query, because the Home Assistant sidebar changes the
       panel's width without changing the window's. */
    .layout {
      display: grid;
      grid-template-columns: var(--wa-left, 270px) 8px minmax(0, 1fr) 8px var(--wa-right, 340px);
      column-gap: 8px;
      row-gap: 16px;
      padding: 16px;
      flex: 1 1 auto;
      min-height: 0;
      box-sizing: border-box;
      overflow: hidden;
    }
    .gutter {
      align-self: stretch; cursor: col-resize; border-radius: 4px;
      background: transparent; position: relative; touch-action: none;
    }
    .gutter::after {
      content: ""; position: absolute; inset: 0 3px; border-radius: 2px;
      background: var(--divider-color); opacity: .35;
    }
    .gutter:hover::after, .gutter.dragging::after { background: var(--primary-color); opacity: 1; }
    /* Two columns: the inspector drops to a full-width band underneath. */
    .layout.cols-2 {
      grid-template-columns: var(--wa-left, 270px) 8px minmax(0, 1fr);
      overflow: auto;
    }
    .layout.cols-2 > .column.inspector { grid-column: 1 / -1; }
    .layout.cols-2 > .gutter.right { display: none; }
    /* One column: everything stacks and the whole panel scrolls. */
    .layout.cols-1 { grid-template-columns: minmax(0, 1fr); overflow: auto; }
    .layout.cols-1 > .column { grid-column: auto; }
    .layout.cols-1 > .gutter { display: none; }
    .column { overflow: auto; min-height: 0; }

    /* Status and the raw document: one line at the foot of the panel, shut by
       default, saying only whether the work is saved. */
    details.foot { flex: none; border-top: 1px solid var(--divider-color); background: var(--card-background-color, #fff); }
    details.foot > summary { display: flex; align-items: center; gap: 8px; padding: 8px 16px; font-size: 13px; cursor: pointer; list-style: none; }
    details.foot > summary::-webkit-details-marker { display: none; }
    details.foot > summary:hover { background: var(--secondary-background-color); }
    details.foot .foot-dot { font-size: 10px; }
    details.foot .foot-dot.ok { color: var(--success-color, #43a047); }
    details.foot .foot-dot.warn { color: var(--warning-color, #ffa600); }
    details.foot .foot-dot.err { color: var(--error-color, #db4437); }
    details.foot .foot-text { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    details.foot .foot-more { font-size: 12px; opacity: .6; }
    details.foot[open] .foot-more { opacity: .4; }
    details.foot .foot-body { padding: 0 16px 12px; max-height: 40vh; overflow: auto; }
    details.foot .foot-body .hint { margin: 8px 0; }

    /* Inspector sections: one scroll, no tabs. Each title sits in a tinted band
       with a coloured edge, so a long inspector can be skimmed by heading
       instead of read top to bottom. Still not a bordered card, because a card
       inside the inspector's own card is two boxes saying the same thing. */
    .sect { margin: 18px 0 2px; }
    .sect:first-of-type { margin-top: 2px; }
    .sect > h4 {
      display: flex; align-items: baseline; gap: 8px; margin: 0 0 10px;
      padding: 5px 8px; border-radius: 5px;
      border-left: 3px solid var(--primary-color);
      background: var(--secondary-background-color, rgba(127,127,127,.12));
      font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; opacity: 1;
    }
    .sect > h4 .sect-note { font-size: 11px; font-weight: 400; text-transform: none; letter-spacing: 0; opacity: .7; }
    .card {
      background: var(--card-background-color, #fff);
      border-radius: var(--ha-card-border-radius, 12px);
      box-shadow: var(--ha-card-box-shadow, 0 1px 3px rgba(0,0,0,.2));
      padding: 12px 16px;
      margin-bottom: 16px;
    }
    .card h2 {
      font-size: 13px; font-weight: 700; margin: 0 0 8px; opacity: 1;
      text-transform: uppercase; letter-spacing: .08em;
      display: flex; align-items: center; gap: 8px;
      padding-bottom: 8px; border-bottom: 1px solid var(--divider-color);
    }
    .card h2 .spacer { flex: 1; }
    .card h3 { font-size: 13px; font-weight: 500; margin: 14px 0 6px; opacity: .8; }
    ul { list-style: none; margin: 0; padding: 0; }
    li.row {
      padding: 8px 10px; border-radius: 8px; cursor: pointer;
      display: flex; justify-content: space-between; align-items: center; gap: 8px;
    }
    /* Hairlines between rows: the lists are the thing you scan first, and an
       unbroken stack of same-sized rows has nothing to count against. */
    li.row + li.row, .layer + .layer, .datum + .datum { box-shadow: inset 0 1px 0 var(--divider-color); }
    li.row:hover, .layer:hover, .datum:hover, li.row.selected, .layer.hl, .datum.hl { box-shadow: none; }
    li.row:hover { background: var(--secondary-background-color); }
    li.row.selected { background: var(--primary-color); color: var(--text-primary-color, #fff); }
    li.row .meta { font-size: 12px; opacity: .7; }
    li.row.locked { cursor: default; opacity: .6; }
    li.row.locked:hover { background: none; }
    .send { font-size: 13px; display: inline-flex; align-items: center; gap: 6px; }
    .send.sent { color: var(--success-color, #43a047); }
    .send.sending { opacity: .7; }
    .send.offline { color: var(--warning-color, #ffa600); }
    /* The shapes always stack, one per row. Standing two of them side by side
       made each one small and left a wide empty gutter down both sides of the
       card, and a shape is easier to edit big than it is to compare with its
       neighbour. Width alone drives the size and the viewBox supplies the
       ratio, so every shape follows the column and none can be squashed.
       Pointer maths reads the SVG's screen CTM, so drags follow for free. */
    .previews { display: flex; flex-direction: column; gap: 22px; align-items: center; width: 100%; }
    .preview { text-align: center; position: relative; width: 100%; min-width: 0; }
    .preview .label { font-size: 12px; opacity: .7; margin-top: 6px; cursor: pointer; }
    .preview.active .label { color: var(--primary-color); opacity: 1; font-weight: 500; }
    .preview svg {
      display: block; margin: 0 auto; background: #000; border-radius: 12px; touch-action: none;
      height: auto; max-width: 100%;
    }
    .preview.active svg { outline: 2px solid var(--primary-color); outline-offset: 3px; }
    /* Rectangular is the shape people author in, so it takes the whole card.
       The other two are near square and would run off the bottom of the screen
       at that width, so they keep a cap. */
    .preview.rectangular svg { width: 100%; max-width: 960px; }
    .preview.circular svg { width: min(100%, 470px); border-radius: 50%; }
    /* The corner preview draws the top-right screen quadrant (104x124
       reference points), so the small content disc stays big enough to edit. */
    .preview.corner svg { width: min(100%, 430px); background: #2c2c2e; }
    /* Pick mode: the pointer names a layer, so nothing on the face should look
       grabbable. The crosshair has to sit on the groups too, because a
       draggable group carries its own inline cursor. */
    .preview.picking svg, .preview.picking svg * { cursor: crosshair; }
    .preview-case { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; margin-bottom: 14px; }
    .preview-case .spacer { flex: 1; min-width: 0; }
    /* One toggle drawn in two places (over the previews and over the Layers
       card), because the picking happens in one and the answer lands in the
       other. The on class is the pressed state, not a second button. */
    button.pick {
      font: inherit; font-size: 12px; padding: 3px 10px; border-radius: 999px; cursor: pointer;
      display: inline-flex; align-items: center; gap: 5px; white-space: nowrap;
      border: 1px solid var(--divider-color); background: transparent; color: inherit;
    }
    button.pick:hover:not(:disabled) { border-color: var(--primary-color); }
    button.pick.on { background: var(--primary-color); color: var(--text-primary-color, #fff); border-color: transparent; }
    button.pick .glyph { font-size: 13px; line-height: 1; }
    .preview-case label { font-size: 13px; display: flex; align-items: center; gap: 8px; }
    .preview-case select { font: inherit; padding: 4px 6px; border-radius: 6px; border: 1px solid var(--divider-color, #444); background: var(--card-background-color, #1c1c1e); color: inherit; }
    .ok { color: var(--success-color, #43a047); }
    .warn { color: var(--warning-color, #ffa600); }
    .err, .error { color: var(--error-color, #db4437); }
    .kv { display: grid; grid-template-columns: auto 1fr; gap: 2px 12px; font-size: 13px; }
    .kv dt { opacity: .7; }
    .kv dd { margin: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .layer, .datum { padding: 6px 8px; border-radius: 6px; cursor: pointer; font-size: 13px; display: flex; align-items: center; gap: 6px; }
    .layer:hover, .datum:hover { background: var(--secondary-background-color); }
    .layer.hl, .datum.hl { background: var(--primary-color); color: var(--text-primary-color, #fff); }
    /* The row for the layer the pick pointer is over. An outline rather than a
       fill, so it still reads on the row that is also selected. */
    .layer.pick { box-shadow: inset 0 0 0 2px var(--primary-color); }
    /* The kind is the fastest thing to scan a layer list by, so it reads as a
       badge rather than as faint grey text. */
    .layer .kind {
      flex: none; font-size: 9px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase;
      min-width: 46px; text-align: center; padding: 2px 4px; border-radius: 4px; margin-right: 2px;
      background: var(--secondary-background-color, rgba(127,127,127,.16)); opacity: .95;
    }
    .layer.hl .kind { background: rgba(255,255,255,.24); }
    .layer .name, .datum .name { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .layer .meta, .datum .meta { font-size: 12px; opacity: .7; }
    .layer .chip { font-size: 10px; padding: 0 6px; opacity: .8; }
    /* Reserved, not removed: taking the actions out of the layout made the row
       change height and the name change width the moment the pointer arrived,
       so the thing being aimed at moved. */
    .layer .acts { display: inline-flex; gap: 0; flex: none; visibility: hidden; }
    .layer:hover .acts, .layer.hl .acts, .layer:focus-within .acts { visibility: visible; }
    .adders { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 8px; }
    /* Layer presets are the primary way to add a layer: each one is a whole
       working thing (an icon, its tap and its states), so it carries the
       weight. The blank kinds underneath stay available but stay quiet. */
    .adders.presets { gap: 8px; }
    button.preset {
      font: inherit; font-size: 13px; font-weight: 500; padding: 7px 12px; border-radius: 8px; cursor: pointer;
      border: 1px solid var(--primary-color); background: var(--card-background-color, #fff); color: var(--primary-color);
    }
    button.preset:hover:not(:disabled) { background: var(--primary-color); color: var(--text-primary-color, #fff); }
    .adders.blanks { gap: 4px; margin-top: 6px; align-items: center; }
    .adders.blanks .hint { margin: 0 2px 0 0; }
    .adders.blanks button.small { opacity: .8; }
    dialog.preset-dialog {
      width: min(420px, calc(100vw - 32px)); box-sizing: border-box; padding: 16px 18px 18px;
      border: 1px solid var(--divider-color); border-radius: 12px;
      background: var(--card-background-color, #fff); color: var(--primary-text-color);
      box-shadow: 0 12px 40px rgba(0,0,0,.4);
    }
    dialog.preset-dialog::backdrop { background: rgba(0,0,0,.45); }
    .card dialog.preset-dialog h2 { margin: 0 0 4px; font-size: 15px; font-weight: 500; text-transform: none; letter-spacing: 0; opacity: 1; }
    .branches { display: flex; flex-wrap: wrap; gap: 4px; }
    .branches button {
      font: inherit; font-size: 12px; padding: 2px 8px; border-radius: 999px;
      border: 1px solid var(--divider-color); background: transparent; color: inherit; cursor: pointer;
    }
    .branches button.active { background: var(--primary-color); color: var(--text-primary-color, #fff); border-color: transparent; }
    .branches button.live-match { border-color: var(--success-color, #43a047); }
    pre { font-size: 11px; white-space: pre-wrap; word-break: break-all; max-height: 400px; overflow: auto; background: var(--secondary-background-color); padding: 8px; border-radius: 6px; }
    button.link { font: inherit; background: none; border: none; color: var(--primary-color); cursor: pointer; padding: 0; }
    .empty { opacity: .6; padding: 24px; text-align: center; }
    .banner { padding: 10px 14px; border-radius: 8px; margin-bottom: 12px; font-size: 13px; background: var(--secondary-background-color); }
    .banner.warn { border-left: 4px solid var(--warning-color, #ffa600); }
    .banner.err { border-left: 4px solid var(--error-color, #db4437); }
    .banner .acts { display: flex; gap: 6px; margin-top: 8px; flex-wrap: wrap; }
    .rule-box { border: 1px solid var(--divider-color); border-radius: 8px; padding: 8px; margin: 8px 0; }
    .case-box { border-left: 3px solid var(--divider-color); padding: 4px 8px; margin: 8px 0; }
    .case-box.match { border-left-color: var(--success-color, #43a047); }
    .case-box.otherwise { border-left-style: dashed; }
    .test-box, .change-box { background: var(--secondary-background-color, rgba(0,0,0,.04)); border-radius: 6px; padding: 4px 8px; margin: 6px 0; }
    .rule-head { display: flex; align-items: center; gap: 4px; font-size: 13px; }
    .ok { color: var(--success-color, #43a047); font-size: 12px; }
    .no { color: var(--error-color, #db4437); font-size: 12px; }
    select.adder { font: inherit; font-size: 12px; padding: 3px 6px; margin-top: 4px; }
    .tabs { display: flex; gap: 4px; margin-bottom: 10px; flex-wrap: wrap; }
    .tabs button { font: inherit; font-size: 12px; padding: 4px 10px; border-radius: 999px; border: 1px solid var(--divider-color); background: transparent; color: inherit; cursor: pointer; }
    .tabs button.active { background: var(--primary-color); color: var(--text-primary-color, #fff); border-color: transparent; }
    /* form controls */
    .field { display: flex; flex-direction: column; gap: 3px; margin: 6px 0; font-size: 13px; }
    .field > span { opacity: .75; font-size: 12px; }
    .field input[type=text], .field input[type=number], .field select, .field textarea {
      font: inherit; font-size: 13px; padding: 6px 8px; border-radius: 6px; border: 1px solid var(--divider-color);
      background: var(--card-background-color, #fff); color: inherit; width: 100%; box-sizing: border-box;
    }
    .field .mono, code { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 12px; }
    /* A slider with its number beside it: the crop controls are found by eye,
       so the value is a readout rather than something to type into. */
    .field.slider .slider-row { display: flex; align-items: center; gap: 8px; }
    .field.slider input[type=range] { flex: 1; min-width: 60px; }
    .field.slider .slider-value { min-width: 44px; text-align: right; opacity: .85; }
    .field.check { flex-direction: row; align-items: center; gap: 8px; }
    .field.check > span { opacity: 1; font-size: 13px; }
    .color-row { display: flex; align-items: center; gap: 6px; }
    .color-row input[type=color] { width: 32px; height: 26px; padding: 0; border: 1px solid var(--divider-color); border-radius: 6px; background: none; }
    .color-row input[type=range] { flex: 1; min-width: 40px; }
    .color-row input.hex { width: 96px; }
    .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 0 10px; }
    .grid4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0 6px; }
    .row-inline { display: flex; align-items: flex-end; gap: 4px; }
    .row-inline .field { flex: 1; }
    .hint { font-size: 12px; opacity: .75; margin: 4px 0; }
    .hint.warn { opacity: 1; }
    details.sub { margin: 6px 0; }
    details.sub summary { font-size: 12px; opacity: .8; cursor: pointer; }
    .chips { display: flex; gap: 6px; flex-wrap: wrap; align-items: center; }
    .chip { display: inline-flex; align-items: center; gap: 4px; font-size: 12px; padding: 2px 8px; border: 1px solid var(--divider-color); border-radius: 999px; }
    button.chip { font: inherit; font-size: 12px; background: transparent; color: inherit; cursor: pointer; }
    button.chip.active { background: var(--primary-color); color: var(--text-primary-color, #fff); border-color: transparent; }
    .chip-add { font: inherit; font-size: 12px; padding: 2px 8px; border-radius: 999px; border: 1px dashed var(--divider-color); background: transparent; color: inherit; cursor: pointer; }
    .new-shape { margin: 0 0 10px; }
    .preview.inline .inline-line { display: inline-flex; align-items: center; justify-content: center; gap: 6px; min-width: 200px; padding: 6px 16px; border-radius: 999px; background: #000; color: #fff; font-size: 14px; cursor: pointer; }
    .preview.inline .inline-line svg { display: inline-block; margin: 0; background: transparent; border-radius: 0; }
    .preview.inline.active .inline-line { outline: 2px solid var(--primary-color); outline-offset: 3px; }
    .preview.inline .inline-line.missing { color: #999; font-style: italic; }
    .value-editor { border-left: 2px solid var(--divider-color); padding-left: 10px; margin: 4px 0 8px; }

    /* Value chip: one line saying what a value is, with the full form behind it.
       The form lives in a popover, which the browser draws in the top layer, so
       a scrolling card cannot clip it. Its position is set in editors.ts. */
    .value-chip-field { gap: 4px; }
    button.value-chip {
      display: flex; align-items: center; gap: 8px; width: 100%; box-sizing: border-box;
      font: inherit; font-size: 13px; text-align: left; padding: 6px 10px; border-radius: 8px;
      border: 1px solid var(--divider-color); background: var(--card-background-color, #fff);
      color: inherit; cursor: pointer;
    }
    button.value-chip:hover { border-color: var(--primary-color); }
    button.value-chip:focus-visible { outline: 2px solid var(--primary-color); outline-offset: 1px; }
    .value-chip .chip-text { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .value-chip .chip-now { max-width: 45%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; opacity: .65; }
    .value-chip .chip-caret { opacity: .55; font-size: 11px; }
    .value-pop {
      position: fixed; inset: auto; margin: 0; width: min(430px, calc(100vw - 16px)); box-sizing: border-box;
      max-height: 70vh; overflow: auto; padding: 10px 14px 14px;
      border: 1px solid var(--divider-color); border-radius: 12px;
      background: var(--card-background-color, #fff); color: var(--primary-text-color);
      box-shadow: 0 10px 30px rgba(0,0,0,.35);
    }
    .value-pop::backdrop { background: transparent; }
    .pop-head { display: flex; align-items: center; gap: 8px; font-size: 13px; margin-bottom: 2px; position: sticky; top: -10px; background: inherit; padding: 4px 0; }
    .pop-head .spacer { flex: 1; }

    /* States table: one rule as rows. A two-state light is two lines, so the
       row has to stay one line: every control in it is sized to the text it
       holds rather than to the column. */
    .states-table { width: 100%; border-collapse: collapse; margin: 8px 0 4px; font-size: 13px; }
    .states-table th {
      text-align: left; font-weight: 500; font-size: 11px; text-transform: uppercase; letter-spacing: .04em;
      opacity: .6; padding: 2px 6px; border-bottom: 1px solid var(--divider-color); white-space: nowrap;
    }
    .states-table th button.icon { opacity: 0; }
    .states-table th:hover button.icon, .states-table th button.icon:focus-visible { opacity: .7; }
    .states-table th.acts { width: 1%; }
    .states-table td { padding: 3px 6px; border-bottom: 1px solid var(--divider-color); vertical-align: middle; }
    .states-table td.empty-row { opacity: .6; padding: 12px 6px; border-bottom: none; }
    .states-table tr.state-row { cursor: pointer; }
    .states-table tr.state-row:hover td { background: var(--secondary-background-color); }
    /* Two declarations: a browser without color-mix keeps the plain tint
       rather than losing the held row entirely. */
    .states-table tr.state-row.forced td { background: var(--secondary-background-color); }
    .states-table tr.state-row.forced td { background: color-mix(in srgb, var(--primary-color) 14%, transparent); }
    .states-table td.when { white-space: nowrap; }
    .states-table td.acts { width: 1%; white-space: nowrap; }
    .states-table td.acts button.icon { opacity: 0; }
    .states-table tr:hover td.acts button.icon, .states-table td.acts button.icon:focus-visible { opacity: .8; }
    .row-flag { display: inline-block; width: 12px; color: var(--success-color, #43a047); font-size: 11px; }
    tr.forced .row-flag { color: var(--primary-color); }
    .when-cell { display: inline-flex; align-items: center; gap: 4px; }
    .when-cell select.when-op { font: inherit; font-size: 12px; padding: 2px 4px; border-radius: 6px; border: 1px solid transparent; background: transparent; color: inherit; }
    .when-cell select.when-op:hover { border-color: var(--divider-color); }
    .when-and { opacity: .6; font-size: 12px; }
    .when-otherwise { opacity: .75; font-style: italic; }
    .rhs { display: inline-flex; align-items: center; gap: 2px; }
    .rhs .value-chip-field { margin: 0; }
    input.cellin {
      font: inherit; font-size: 13px; width: 90px; padding: 3px 6px; border-radius: 6px;
      border: 1px solid var(--divider-color); background: var(--card-background-color, #fff); color: inherit;
    }
    input.cellin.num { width: 64px; }
    button.more { font-size: 12px; opacity: .5; }
    button.cell {
      display: inline-flex; align-items: center; gap: 6px; max-width: 190px;
      font: inherit; font-size: 13px; text-align: left; padding: 3px 6px; border-radius: 6px;
      border: 1px solid transparent; background: transparent; color: inherit; cursor: pointer;
    }
    button.cell:hover { border-color: var(--divider-color); background: var(--card-background-color, #fff); }
    button.cell.empty { opacity: .45; font-style: italic; }
    .cell-word { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .swatch { width: 12px; height: 12px; border-radius: 3px; border: 1px solid var(--divider-color); flex: none; }
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
    .entity-results { border: 1px solid var(--divider-color); border-radius: 8px; margin-top: 4px; max-height: 300px; overflow: auto; }
    button.ent {
      display: flex; align-items: center; gap: 8px; width: 100%; box-sizing: border-box;
      font: inherit; font-size: 13px; text-align: left; padding: 6px 8px;
      background: none; border: none; color: inherit; cursor: pointer;
    }
    button.ent + button.ent { border-top: 1px solid var(--divider-color); }
    button.ent:hover, button.ent.hl { background: var(--secondary-background-color); }
    .ent .ent-main { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 1px; }
    .ent .ent-name { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .ent .ent-id { font-size: 11px; opacity: .6; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .ent .ent-state { flex: none; font-size: 11px; opacity: .8; max-width: 34%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .entity-current .ent-name { flex: 1; }
    .entity-current { display: flex; gap: 8px; align-items: baseline; font-size: 12px; opacity: .8; margin-top: 3px; }
    .entity-current .ent-name { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

    /* Symbol picker */
    .sym-browse { margin: 6px 0; }
    .sym-controls { display: flex; gap: 6px; margin-bottom: 6px; }
    .sym-controls input[type=search] { flex: 1; min-width: 0; }
    .sym-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(64px, 1fr)); gap: 4px; max-height: 240px; overflow-y: auto; padding: 2px; }
    /* Recents are a shortcut back to a handful of names, not a second
       catalogue, so they stay one strip that scrolls sideways instead of
       growing tall enough to push the real grid off screen. */
    .sym-grid.one-row { display: flex; flex-wrap: nowrap; max-height: none; overflow-x: auto; overflow-y: hidden; }
    .sym-grid.one-row button.sym { flex: 0 0 64px; }
    button.sym { display: flex; flex-direction: column; align-items: center; gap: 3px; padding: 5px 2px; background: none; cursor: pointer; color: var(--primary-text-color); border: 1px solid transparent; border-radius: 6px; overflow: hidden; }
    button.sym:hover { border-color: var(--divider-color); background: var(--secondary-background-color); }
    button.sym.on { border-color: var(--primary-color); }
    .sym-glyph { display: flex; align-items: center; justify-content: center; height: 24px; }
    /* Beats the fill the provider writes as a presentation attribute, so tiles
       follow the Home Assistant theme instead of the canvas colour. */
    .sym-glyph svg path { fill: currentColor; fill-opacity: 1; }
    .sym-none { font-size: 14px; opacity: .4; }
    .sym-name { font-size: 9px; line-height: 1.1; text-align: center; opacity: .8; overflow-wrap: anywhere; max-height: 22px; overflow: hidden; }
  `;

  // ── lifecycle ─────────────────────────────────────────────────────────

  override connectedCallback() {
    super.connectedCallback();
    this.loadColumnWidths();
    this.sizeObserver.observe(this);
    window.addEventListener("keydown", this.keyHandler);
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
    const mod = e.metaKey || e.ctrlKey;
    if (!mod) return;
    const inField = (e.composedPath()[0] as HTMLElement | undefined)?.tagName?.match(/INPUT|TEXTAREA|SELECT/);
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
    };
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
        state: s.state,
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

  private togglePicking(next = !this.picking) {
    this.picking = next;
    this.pickHoverId = undefined;
    if (next) this.cancelGesture?.();
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
    if (!this.draft || !this.canEdit) return;
    if (family !== this.activeFamily) {
      this.activeFamily = family;
      return;
    }
    const target = e.target as SVGElement;
    const handle = target.closest("[data-handle]")?.getAttribute("data-handle") as HandleCorner | null;
    const group = target.closest("[data-element-id]");
    const hitId = group?.getAttribute("data-element-id");
    if (!hitId) return;
    const svg = target.closest("svg") as SVGSVGElement | null;
    if (!svg) return;
    // An attached tap sits exactly over its owner and is not a layer the user
    // ever selects or drags: send the hit to the layer it belongs to, which is
    // what the author sees there. A free-standing tap is grabbed as before.
    const id = selectableLayerId(this.draft.config, hitId);
    const el = this.draft.config.elements.find((x) => x.payload.id === id);
    if (!id || !el) return;
    if (this.inspect.kind !== "layer" || this.inspect.id !== id) {
      this.inspect = { kind: "layer", id };
      if (handle) return;
    }
    e.preventDefault();
    const frame = effectivePlacement(this.draft.config, family, el).frame;
    // Pointer deltas arrive in slot points; normalize against the design box as
    // it lands in this slot, so a drag in a 41 mm preview moves the same fraction.
    // Corner draws the design box scaled down into the visible content tile
    // (renderer.ts cornerTileSide), so its gestures normalize against the tile.
    const fit = fitBox(this.previewSlot(family as DrawableFamily), family as DrawableFamily);
    let canvas = { width: fit.width, height: fit.height };
    if (family === "corner") {
      const corner = this.draft.config.perFamily.corner;
      const hasBezel = !!corner?.bezelText || !!corner?.bezelGauge;
      const tile = cornerTileSide(fit.scale, hasBezel);
      canvas = { width: tile, height: tile };
    }
    // The timestamp chip sits inside its image layer's group, so the layer hit
    // above already selected the right layer. Dragging the chip moves the chip,
    // not the layer, and only once the author has asked for free placement.
    if (target.closest("[data-ts-handle]") && el.kind === "image" && hasFreeTimestamp(el.payload)) {
      const chipBox = { x: 0, y: 0, w: frame.width * canvas.width, h: frame.height * canvas.height };
      const base = { x: el.payload.timestampX!, y: el.payload.timestampY! };
      this.cancelGesture?.();
      this.cancelGesture = beginPointDrag(svg, chipBox, e, base, (x, y, done) => {
        this.mutate((c) => {
          const img = c.elements.find((n) => n.payload.id === id);
          if (img?.kind !== "image") return;
          img.payload.timestampX = x;
          img.payload.timestampY = y;
        }, `ts-${id}`);
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
        <h1>Wrist Assistant${dirty ? html`<span class="dirty-dot" title="Unsaved changes"></span>` : nothing}</h1>
        <div class="toolbar">
          <button @click=${() => this.undo()} ?disabled=${!d?.canUndo} title="Undo (⌘Z)">Undo</button>
          <button @click=${() => this.redo()} ?disabled=${!d?.canRedo} title="Redo (⇧⌘Z)">Redo</button>
          <button class="primary" @click=${() => void this.save()} ?disabled=${!this.canEdit || !dirty || this.saving || !this.slotChosen} title="Save (⌘S)">${this.saving ? "Saving…" : d?.baseRevision === null ? "Save new" : "Save"}</button>
          ${this.renderSendButton()}
        </div>
        <label>Watch
          <select @change=${(e: Event) => void this.selectOwner((e.target as HTMLSelectElement).value)}>
            ${this.owners.map((o) => html`<option value=${o.owner_watch_id} ?selected=${o.owner_watch_id === this.ownerId}>
              ${ownerLabel(o)} (${o.complication_count})</option>`)}
          </select>
        </label>
      </header>
      ${this.loadError ? html`<div class="card error">${this.loadError}</div>` : nothing}
      ${this.watchSupported
        ? html`<div class="layout cols-${fit.columns}"
              style="--wa-left:${fit.left}px;--wa-right:${fit.right}px">
            <div class="column left">${this.renderList()}${this.renderData()}${this.renderLayers()}</div>
            ${this.renderGutter("left")}
            <div class="column canvas">${this.renderBanners()}${this.renderPreviews()}</div>
            ${this.renderGutter("right")}
            <div class="column inspector">${this.renderInspector()}</div>
          </div>
          ${this.renderFooter()}`
        : html`<div class="card">
            <div class="banner warn"><b>Update the watch app first.</b> ${updateWatchMessage(this.selectedOwner?.app_version)}</div>
            <div class="hint">Nothing on this watch is changed or lost. Its ${this.selectedOwner?.complication_count ?? 0} complication${this.selectedOwner?.complication_count === 1 ? "" : "s"} stay in Home Assistant and can be edited once the watch is updated.</div>
          </div>`}`;
  }

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

  private renderList() {
    // One list for everything on the watch, ordered the way the watch face
    // picker orders it (by slot, which stays invisible here). iPhone presets
    // and customs on another home are locked rows: this panel cannot edit
    // them, but hiding them is what used to make slots look haunted.
    type Row =
      | { slot: number; kind: "record"; record: ComplicationRecord }
      | { slot: number; kind: "locked"; name: string; badge: string; title: string };
    const rows: Row[] = [
      ...this.records.map((r): Row => ({ slot: Number(r.document?.slotIndex ?? 0), kind: "record", record: r })),
      ...this.occupied.map((o): Row => o.kind === "custom"
        ? {
          slot: o.slot,
          kind: "locked",
          name: o.name || "Unnamed complication",
          badge: o.home || "Other home",
          title: `A complication on ${o.home ? `the ${o.home} home` : "another home"}${o.families?.length ? ` (${o.families.map(familyTitle).join(", ")})` : ""}. Edit it in that home's Wrist Assistant panel.`,
        }
        : {
          slot: o.slot,
          kind: "locked",
          name: o.name || "Unnamed preset",
          badge: "iPhone",
          title: "An iPhone preset complication. Edit it in the Wrist Assistant app on the iPhone.",
        }),
    ].sort((a, b) => a.slot - b.slot);
    return html`<div class="card">
      <h2>Complications<span class="spacer"></span>
        ${this.hass.user?.is_admin
          ? html`<button class="small" @click=${() => { this.newShapeChooser = !this.newShapeChooser; }} ?disabled=${this.freeSlot() < 0}>New</button>`
          : nothing}
      </h2>
      ${this.newShapeChooser && this.freeSlot() >= 0 ? html`<div class="new-shape">
        <div class="hint">Shape of the new complication. More shapes can be added later on its General tab.</div>
        <div class="adders">
          ${ALL_FAMILIES.map((f) => html`<button class="small ${f === "rectangular" ? "primary" : ""}" @click=${() => this.createNew(f)}>${familyTitle(f)}</button>`)}
          <button class="small" @click=${() => { this.newShapeChooser = false; }}>Cancel</button>
        </div>
      </div>` : nothing}
      ${rows.length === 0 && !(this.draft && this.draft.baseRevision === null)
        ? html`<div class="empty">No complications for this watch yet.</div>`
        : html`<ul>${rows.map((row) => row.kind === "record"
            ? html`
            <li class="row ${row.record.id === this.selectedId ? "selected" : ""}" @click=${() => this.selectRecord(row.record)}>
              <span>${String(row.record.document?.name ?? "Untitled")}</span>
              <span class="meta">r${row.record.revision}</span>
            </li>`
            : html`
            <li class="row locked" title=${row.title}>
              <span>${row.name}</span>
              <span class="meta">${row.badge}</span>
            </li>`)}
            ${this.draft && this.draft.baseRevision === null ? html`<li class="row selected"><span>${this.draft.config.name}</span><span class="meta">unsaved</span></li>` : nothing}
          </ul>`}
    </div>`;
  }

  private renderData() {
    const cfg = this.draft?.config;
    if (!cfg) return nothing;
    const resolver = new Resolver(this.buildContext());
    const ctx = describeContext(this.host());
    return html`<div class="card">
      <h2>Data<span class="spacer"></span>
        ${this.canEdit ? html`<button class="small" @click=${() => { const nv = newNamedValue(); this.mutate((c) => { c.values.push(nv); }); this.inspect = { kind: "data", id: nv.id }; }}>Add</button>` : nothing}
      </h2>
      ${cfg.values.length === 0 ? html`<div class="empty">No named values. Layers can also read entities directly.</div>` : nothing}
      ${cfg.values.map((v) => {
        const r = resolver.resolve({ kind: { kind: "named", id: v.id } });
        const hl = this.inspect.kind === "data" && this.inspect.id === v.id;
        return html`<div class="datum ${hl ? "hl" : ""}" @click=${() => { this.inspect = { kind: "data", id: v.id }; }}>
          <span class="name">${v.name || "(unnamed)"}</span>
          <span class="meta" title=${describeValue(v.value, ctx)}>${r ?? "unresolved"}</span>
          ${this.canEdit ? html`<button class="icon danger" title="Delete value" aria-label="Delete value" @click=${(e: Event) => { e.stopPropagation(); this.mutate((c) => { c.values = c.values.filter((x) => x.id !== v.id); }); if (hl) this.inspect = { kind: "general" }; }}>${uiIcon("delete")}</button>` : nothing}
        </div>`;
      })}
    </div>`;
  }

  private renderLayers() {
    const cfg = this.draft?.config;
    if (!cfg) return nothing;
    const edit = this.canEdit;
    const family = this.canvasFamily;
    // An attached tap has no row of its own, so a step here is a step over the
    // rows the card shows. The tap travels with its owner; syncAttachedTaps
    // puts it back directly above whichever layer it belongs to.
    const move = (id: string, dir: -1 | 1) => this.mutate((c) => {
      const rows = c.elements.filter((e) => !isAttachedTap(c, e));
      const taps = c.elements.filter((e) => isAttachedTap(c, e));
      const i = rows.findIndex((e) => e.payload.id === id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= rows.length) return;
      [rows[i], rows[j]] = [rows[j]!, rows[i]!];
      c.elements = [...rows, ...taps];
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
    // Top of the list = drawn last = on top, like the phone editor. Attached
    // taps are not rows: they show as a badge on the layer they belong to.
    const ordered = [...cfg.elements].filter((el) => !isAttachedTap(cfg, el)).reverse();
    const ctx = describeContext(this.host());
    return html`<div class="card">
      <h2>Layers <span class="meta" style="text-transform:none;letter-spacing:0">(top first)</span>
        <span class="spacer"></span>${this.renderPickButton()}</h2>
      ${this.activeFamily === "inline" ? html`<div class="hint">Inline is one line of text and draws no layers. The controls here apply to the ${familyTitle(family)} layout.</div>` : nothing}
      ${cfg.elements.length === 0 ? html`<div class="empty">No layers.</div>` : nothing}
      ${ordered.map((el) => {
        const id = el.payload.id;
        const hl = this.inspect.kind === "layer" && this.inspect.id === id;
        const eff = effectivePlacement(cfg, family, el);
        const hidden = el.payload.isHidden || eff.isHidden;
        // A tappable layer says so on its own row, because its tap is edited
        // here rather than as a layer of its own.
        const tap = attachedTapsOf(cfg, id)[0];
        // Both badges answer "what will this layer do" without opening it: one
        // says it responds to a tap, the other that it changes with a value.
        const states = statesSummary(el.payload.rules);
        const pointed = this.picking && this.pickHoverId === id;
        return html`<div class="layer ${hl ? "hl" : ""} ${pointed ? "pick" : ""}" @click=${() => { this.inspect = { kind: "layer", id }; }}>
          <span class="kind">${el.kind}</span>
          <span class="name" style=${hidden ? "opacity:.5" : ""}>${layerTitle(el, ctx)}</span>
          ${tap ? html`<span class="chip" title=${`Tappable · ${layerTitle(tap, ctx)}`}>tap</span>` : nothing}
          ${el.payload.rules.length === 0 ? nothing : html`<span class="chip" title=${states}>${states.replace(/\.$/, "").toLowerCase()}</span>`}
          ${hidden ? html`<span class="meta">hidden</span>` : nothing}
          ${edit ? html`<span class="acts">
            <button class="icon" title="Bring forward" aria-label="Bring forward" @click=${(e: Event) => { e.stopPropagation(); move(id, 1); }}>${uiIcon("up")}</button>
            <button class="icon" title="Send back" aria-label="Send back" @click=${(e: Event) => { e.stopPropagation(); move(id, -1); }}>${uiIcon("down")}</button>
            <button class="icon" title=${eff.isHidden ? `Show in ${familyTitle(family)}` : `Hide in ${familyTitle(family)}`} aria-label=${eff.isHidden ? "Show this layer" : "Hide this layer"} @click=${(e: Event) => { e.stopPropagation(); this.mutate((c) => setPlacement(c, family, id, { isHidden: !eff.isHidden })); }}>${uiIcon(eff.isHidden ? "hide" : "show")}</button>
            <button class="icon" title="Duplicate" aria-label="Duplicate" @click=${(e: Event) => { e.stopPropagation(); dup(id); }}>${uiIcon("duplicate")}</button>
            <button class="icon danger" title="Delete" aria-label="Delete" @click=${(e: Event) => { e.stopPropagation(); del(id); }}>${uiIcon("delete")}</button>
          </span>` : nothing}
        </div>`;
      })}
      ${edit ? html`<div class="adders presets">
        ${LAYER_PRESETS.map((p) => html`<button class="preset" title=${p.blurb}
          ?disabled=${cfg.elements.length + p.layerCount > 64}
          @click=${() => this.openPreset(p.kind)}>${p.title}</button>`)}
      </div>
      <div class="adders blanks">
        <span class="hint">or start blank</span>
        ${(["text", "icon", "gauge", "shape", "image", "tap"] as const).map((k) => html`<button class="small" ?disabled=${cfg.elements.length >= 64} @click=${() => { const el = newElement(k); this.mutate((c) => { c.elements.push(el); }); this.inspect = { kind: "layer", id: el.payload.id }; }}>+ ${k === "image" ? "camera" : k === "tap" ? "tap area" : k}</button>`)}
      </div>
      ${this.renderPresetDialog()}` : nothing}
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

  private renderPreviews() {
    if (this.parseError) return html`<div class="card error">This document cannot be read: ${this.parseError}</div>`;
    const cfg = this.draft?.config;
    if (!cfg) return html`<div class="card"><div class="empty">Select a complication, or press New.</div></div>`;
    const layouts = resolveAll(cfg, this.buildContext(), this.forced);
    this.syncCountdownTicker(layouts);
    const highlightId = this.inspect.kind === "layer" ? this.inspect.id : undefined;
    const watchCase = this.currentCase();
    // Only the supported shapes draw, the same as the watch. A shape the
    // document lacks is simply not here; the Layouts row adds it.
    const one = (family: DrawableFamily) => {
      const layout = layouts[family];
      if (!layout) return nothing;
      const active = family === this.activeFamily;
      const slot = watchCase.slots[family];
      const fit = fitBox(slot, family);
      // Pick mode drops the resize handles: they are drag affordances, and
      // while picking nothing on the face is dragged.
      const opts = {
        icons: this.icons, imageSizes: this.imageSizes, showHidden: true, tapAreas: true, highlightId, slot,
        handles: active && this.canEdit && !this.picking,
        ...(this.picking && this.pickHoverId !== undefined ? { hoverId: this.pickHoverId } : {}),
      };
      const pct = Math.round(fit.scale * 100);
      return html`
      <div class="preview ${family} ${active ? "active" : ""} ${this.picking ? "picking" : ""}"
        @pointerdown=${(e: PointerEvent) => this.onPreviewPointerDown(family, e)}
        @pointermove=${(e: PointerEvent) => this.onPickMove(e)}
        @pointerleave=${() => { if (this.picking) this.pickHoverId = undefined; }}>
        ${renderLayout(layout, opts)}
        <div class="label" @click=${() => { this.activeFamily = family; }}>${familyTitle(family)} · ${slot.width}×${slot.height} pt${pct !== 100 ? ` · ${pct}%` : ""}${active ? " · editing" : ""}</div>
      </div>`;
    };
    return html`<div class="card">
      <div class="preview-case">
        <label>Preview as
          <select @change=${(e: Event) => { this.previewCase = (e.target as HTMLSelectElement).value; }}>
            ${CASES.map((c) => html`<option value=${c.label} ?selected=${c.label === watchCase.label}>${c.label}${c.measured ? "" : " (estimated)"}</option>`)}
          </select>
        </label>
        <span class="hint">Layouts are authored in the ${REFERENCE_CASE.label} box. Other cases draw the same box scaled down.</span>
        <span class="spacer"></span>
        ${this.renderPickButton()}
      </div>
      <div class="previews">
        ${one("rectangular")}
        ${one("circular")}
        ${one("corner")}
        ${cfg.supportedFamilies.includes("inline") ? this.renderInlinePreview(layouts.inline) : nothing}
      </div>
      <div class="hint" style="text-align:center;margin-top:10px">Click a preview to make it the editing shape. Drags and placement fields change only that shape. Add or remove shapes on the General tab.</div>
    </div>`;
  }

  /** The Inline shape as one line: symbol, then `label: value`, the way the
   * watch draws it on a wide face. A live countdown ticks with the same timer
   * the canvas previews use. */
  private renderInlinePreview(inline: ResolvedInline | undefined) {
    const active = this.activeFamily === "inline";
    const select = () => { this.activeFamily = "inline"; this.inspect = { kind: "family" }; };
    let line: TemplateResult;
    if (!inline) {
      line = html`<div class="inline-line missing" @click=${select}>No inline layout</div>`;
    } else {
      const now = Date.now();
      const value = inline.countdownEnd !== undefined && inline.countdownEnd > now
        ? countdownRemainingString((inline.countdownEnd - now) / 1000)
        : inline.text;
      const symbol = inline.symbol ? this.icons.render(inline.symbol, 14, "#FFFFFF") : undefined;
      line = html`<div class="inline-line" @click=${select}>${symbol ?? nothing}<span>${inline.label ? `${inline.label}: ` : ""}${value}</span></div>`;
    }
    return html`<div class="preview inline ${active ? "active" : ""}">
      ${line}
      <div class="label" @click=${select}>Inline · one line${active ? " · editing" : ""}</div>
    </div>`;
  }

  private currentCase() {
    return CASES.find((c) => c.label === this.previewCase) ?? REFERENCE_CASE;
  }

  private previewSlot(family: DrawableFamily) {
    return this.currentCase().slots[family];
  }

  /**
   * The inspector: one object, one scroll.
   *
   * The row above the title is navigation, not tabs. Its two buttons always
   * mean the same two things (the whole complication, and the shape being
   * edited), so a click never lands somewhere different because of what was
   * selected a moment ago. Anything else selected says so in the title.
   */
  private renderInspector() {
    const cfg = this.draft?.config;
    if (!cfg) return nothing;
    const host = this.host();
    const tab = (label: string, active: boolean, go: () => void) => html`<button class=${active ? "active" : ""} @click=${go}>${label}</button>`;
    let body: TemplateResult;
    let title: string;
    const ins = this.inspect;
    if (ins.kind === "layer") {
      const el = cfg.elements.find((e) => e.payload.id === ins.id);
      if (!el) {
        this.inspect = { kind: "general" };
        return nothing;
      }
      title = `${el.kind} layer`;
      body = layerEditor(host, el, this.canvasFamily);
    } else if (ins.kind === "data") {
      const nv = cfg.values.find((v) => v.id === ins.id);
      if (!nv) {
        this.inspect = { kind: "general" };
        return nothing;
      }
      title = "Named value";
      body = namedValueEditor(host, nv);
    } else if (ins.kind === "family") {
      title = `${familyTitle(this.activeFamily)} layout`;
      body = familyEditor(host, this.activeFamily);
    } else {
      // The complication's own name, rather than the word the button above
      // already says.
      title = cfg.name.trim() || "Complication";
      body = generalEditor(host);
    }
    return html`<div class="card" style=${this.canEdit ? "" : "pointer-events:none;opacity:.6"} @change=${() => this.draft?.endGesture()}>
      <div class="tabs">
        ${tab("Complication", ins.kind === "general", () => { this.inspect = { kind: "general" }; })}
        ${tab(`${familyTitle(this.activeFamily)} layout`, ins.kind === "family", () => { this.inspect = { kind: "family" }; })}
      </div>
      <h2>${title}</h2>
      ${body}
      ${ins.kind === "general" && this.canEdit ? html`<h3>Actions</h3><div class="adders">
        <button class="small" @click=${() => this.duplicate()}>Duplicate</button>
        ${this.confirmDelete
          ? html`<button class="danger small" @click=${() => void this.deleteCurrent()}>Really delete</button><button class="small" @click=${() => { this.confirmDelete = false; }}>Cancel</button>`
          : html`<button class="danger small" @click=${() => { this.confirmDelete = true; }}>Delete</button>`}
      </div>` : nothing}
    </div>`;
  }

  // The Rules card that used to sit here is gone. Its one unique job was
  // forcing a branch for the previews, which the states table now does on the
  // row itself; everything else it showed was a link to an editor the Layers
  // card already opens.

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

function layerTitle(el: CElement, ctx?: DescribeContext): string {
  switch (el.kind) {
    case "text": return describeValue(el.payload.value, ctx);
    case "icon": return describeValue(el.payload.symbol, ctx);
    case "gauge": return describeValue(el.payload.value, ctx);
    case "shape": return el.payload.kind;
    case "image": {
      const e = el.payload.entity;
      return e.displayName || e.entityId || "camera";
    }
    case "tap": {
      const a = el.payload.action;
      const target = "entityId" in a ? (a.displayName || a.entityId) : a.type === "openPage" ? (el.payload.openPageName || "") : "";
      return target ? `${a.type} · ${target}` : a.type;
    }
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
