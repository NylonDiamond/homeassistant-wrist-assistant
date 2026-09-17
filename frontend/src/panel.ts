// Home Assistant sidebar panel: <wrist-assistant-panel>.
// Pick a watch, pick a complication, edit a browser-side draft with live
// previews for all three families, then Save with the record's revision so
// a concurrent edit is caught instead of overwritten (plan §"Save and
// conflict rules"). Rules are edited in the inspector's States section.

import { LitElement, html, svg, css, nothing, unsafeCSS, type PropertyValues, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import {
  type ComplicationRecord,
  type HassLike,
  type OwnerSummary,
  deletePart,
  deleteRecord,
  fetchGalleryKey,
  fetchList,
  fetchOwners,
  fetchParts,
  savePart,
  moveOwner,
  nudgeWatch,
  fetchWatchStatus,
  type SaveHistoryEntry,
  fetchSaveHistory,
  fetchSaveHistoryEntry,
  restoreSaveHistory,
  fetchHistorySeries,
  collectSeriesResults,
  type HistoryReadings,
  fetchStatisticsSeries,
  seriesRequests,
  collectListResults,
  fetchListItems,
  listItemsRequests,
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
  controlEffectiveKind,
  controlOnly,
  describeTapAction,
  duplicateElement,
  copyElements,
  DRAWABLE_FAMILIES,
  pasteElements,
  pasteElementsOnto,
  type LayerClip,
  freeSlotFrom,
  lockedOccupied,
  isAttachedTap,
  layerEntityUses,
  type DocumentView,
  viewReads,
  type LayerGroup,
  createGroup,
  groupMembers,
  pickedMoveIds,
  groupOf,
  packGroups,
  pruneGroups,
  setGroup,
  ungroup,
  chartHistoryKey,
  chartStatisticsKey,
  chartHistorySignature,
  timelineHistoryKey,
  timelineHistoryMinutes,
  newConfig,
  newElement,
  convertChartTimes,
  newId,
  parseConfig,
  schemaVersionFor,
  setControlShown,
  ownedElements,
  listOwningRowLayer,
  removeElement,
  selectableLayerId,
  setTapOutsetFromFrame,
  hasFreeTimestamp,
  deleteSharedValue,
  DESIGN_BOX,
  chartAnchorIsColumn,
  entityLayerIds,
  sharedValueLayerIds,
  clampPageCount,
  layerDrawsOnPage,
  nextPageAfter,
  pageNumbers,
  pagesSpecOf,
  tourDuration,
  usesPages,
  settleArrivedPages,
} from "./model.js";
import { TourPlayer } from "./tour-player.js";
import { keyed } from "lit/directives/keyed.js";
import { SHARED_TEST_PREFIX, sharedTestKey, testControlFor, testableSharedValues, testedNamedValues } from "./test-controls.js";
import { agoWords, describeSend, sendState, sendWaitMs } from "./send-state.js";
import { compile, parseValueDocument, type Compiled } from "./compiler.js";
import {
  type EntityState,
  type ForcedBranches,
  type ResolveContext,
  type ResolvedAll,
  type ResolvedInline,
  Resolver,
  chartNumbers,
  timelineSamples,
  countdownRemainingString,
  resolveAll,
  resolveControl,
} from "./resolver.js";
import { CASES, FACE_TINTS, PHONE_CASES, REFERENCE_CASE, REFERENCE_PHONE, caseForScreenSize, cornerTileSide, familyTitle, fitBox, handleResize, iconDrawnSide, phoneCaseForScreenSize, renderLayerThumb, renderLayout, slotFor, timestampChipRect, timestampLabel, type DrawableFamily, type IconProvider, type PreviewCase } from "./renderer.js";
import { type ShapePlace, addFamily, biggestFirst, canRemoveControl, canRemoveFamily, comingSoonFamilies, controlNoteLines, familiesFor, familyAllowsKind, familyContentSummary, familyNote, firstDrawable, importableFamilies, isDrawable, isHomeFamily, keepFamilies, opensInControlView, placeGroups, placeOf, placeTitle, removeFamily, resizableNote, supportedFamilies } from "./layouts.js";
import { KIND_COLOR, KIND_LABEL, KIND_ORDER, SECTION_COLOR } from "./kinds.js";
import { type DeviceOwnerLike, deviceKindOf, deviceNoun, deviceSupportsControls, deviceSupportsShapes, updateDeviceMessage } from "./version.js";
import { makeIconProvider } from "./icons.js";
import { makeImageSizeProvider } from "./image-sizes.js";
import { SymbolBrowser } from "./symbols.js";
import { Draft, draftStatus } from "./draft.js";
import { ScrollFades } from "./scroll-fade.js";
import { statesSummary } from "./states.js";
import { type UiIconName, uiIcon } from "./ui-icons.js";
import { isHiddenDocument, splitHidden, withHidden } from "./model.js";

/** Where an older panel kept hidden picker rows, per watch, in this browser.
 * The flag lives on the document now; the old keys are cleared once on load. */
const LEGACY_PICKER_HIDDEN_PREFIX = "wrist-assistant-panel.picker-hidden.v1:";
import { addPreview } from "./add-previews.js";
import { GRID_STEPS, NUDGE_COARSE, beginGesture, beginPointDrag, beginScaleDrag, gridFor, gridNudgeFrame, guideCandidates, guideThreshold, nudgeFrame, nudgePoint, type Grid, type GuideLine, type Guides, type HandleCorner } from "./interact.js";
import {
  type CopiedPosition,
  type EditorHost,
  type EffectivePlacement,
  type PickedFlag,
  ALL_SECTIONS,
  SCRUB_END,
  SCRUB_START,
  CONTROL_TILE_SIDE,
  card,
  colorField,
  colorWords,
  contentSummary,
  controlCard,
  controlDevice,
  controlHeadline,
  controlStateWord,
  controlStatusShows,
  type ControlTileHost,
  controlTile,
  controlTileShapes,
  describeContext,
  describeValue,
  effectivePlacement,
  elementIn,
  entityField,
  entityRefFrom,
  entitySearchOpen,
  familyEditor,
  generalEditor,
  groupEditor,
  layerEditor,
  layerTitle,
  lookSummary,
  namedValueEditor,
  newNamedValue,
  copyShapeLayout,
  type DescribeContext,
  pickedCommon,
  rowKindIcon,
  rowStageConfig,
  setPlacement,
  syncListAttributes,
  shownCount,
} from "./editors.js";
import { sampleListItem, withListSeeds } from "./list-seeds.js";
import { type PresetEnv, type PresetKind, LAYER_PRESETS, applyPreset, presetSpec } from "./presets.js";
import {
  type ImportParse,
  type ShareSlot,
  type UnresolvedEntity,
  SHARE_LINK_DAMAGED,
  decodeShareLink,
  encodeShareLink,
  exportFileName,
  exportText,
  hasInstanceFilters,
  importProblem,
  isPlaceholderId,
  parseImportText,
  remapEntities,
  shareLinkInText,
  shareLinkPayload,
  shareLinkUrl,
  SHARE_LINK_SITE,
  shareSlots,
  suggestImportName,
  unresolvedEntities,
} from "./transfer.js";
import {
  type GalleryFetch,
  type GalleryMeta,
  type GalleryNameRow,
  type GalleryOverrides,
  type GalleryPreview,
  type GalleryTag,
  type GalleryUpload,
  type GalleryUploadRow,
  GALLERY_LIMITS,
  GALLERY_TAGS,
  GALLERY_TAG_LABEL,
  GalleryError,
  applyGalleryOverrides,
  buildGallerySubmission,
  deleteMyUpload,
  galleryBlockers,
  galleryBlockersByStep,
  galleryErrorMessage,
  galleryPublicFields,
  galleryStatusLabel,
  galleryUploadRows,
  galleryUploadSubline,
  isPendingUpdate,
  listMyUploads,
  submitToGallery,
} from "./gallery.js";
import { renderGalleryPreviews } from "./preview-png.js";
import {
  type SavedPart,
  insertPart,
  partFromSelection,
  partText,
  partTextFits,
  suggestPartName,
} from "./parts.js";
import { domainIcon } from "./domain-icons.js";

/** The gallery calls go through the browser's own fetch. */
const galleryFetch: GalleryFetch = (url, init) => window.fetch(url, init);

/** Where this browser remembers the nickname last sent to the gallery. */
const GALLERY_NICKNAME_KEY = "wrist-assistant-gallery-nickname";

/** The nickname last sent, or empty. Storage can be blocked, which only means
 * typing it again. */
function readGalleryNickname(): string {
  try {
    return window.localStorage.getItem(GALLERY_NICKNAME_KEY) ?? "";
  } catch {
    return "";
  }
}

function writeGalleryNickname(name: string): void {
  try {
    if (name === "") window.localStorage.removeItem(GALLERY_NICKNAME_KEY);
    else window.localStorage.setItem(GALLERY_NICKNAME_KEY, name);
  } catch {
    // Not remembered; nothing else depends on it.
  }
}

/** How the gallery dialog names each read-only kind of public text, one row
 * per piece. */
/** One line of the public name check, in Share and in gallery step 2. */
interface PublicRow {
  key: string;
  label: string;
  /** The name as it will be read, for the preview caption. */
  name: string;
  /** The layers it belongs to: spotlit in the preview, listed as tags. */
  ids: string[];
  control: unknown;
  /** What an entity is in this home, shown with the private tags. */
}

const PUBLIC_ROW_LABEL: Record<string, string> = {
  "Layer names": "Layer name",
  "Template text": "Template text",
  "Service data": "Service data",
  "Other text": "Other text",
};

/** The public gallery's own page, which Share, the gallery dialog and Import
 * all link to. */
const GALLERY_PAGE = "https://wrist-assistant.com/gallery/";

/** Shapes in words, in the order given: "Rectangular and Circular". */
function familyWords(families: readonly FamilyKind[]): string {
  const words = families.map(familyTitle);
  if (words.length <= 1) return words[0] ?? "";
  return `${words.slice(0, -1).join(", ")} and ${words[words.length - 1]}`;
}

/** How many layers a document has as rows: attached taps are part of their
 * owner, not layers of their own. */
function layerCountWords(cfg: CustomComplicationConfig): string {
  const n = cfg.elements.filter((el) => !isAttachedTap(cfg, el)).length;
  return n === 1 ? "1 layer" : `${n} layers`;
}

const TEMPLATE_REFRESH_MS = 30_000;
const TEMPLATE_DEBOUNCE_MS = 500;
/** How often the header chip re-asks whether the watch is listening. Slow on
 * purpose: it answers "is it there right now", and nobody watches a watch come
 * and go by the second. */
const WATCH_STATUS_MS = 30_000;

/** Search key for the preset dialog's entity field. One dialog, one field, so
 * one key; the field's transient search state lives in editors.ts under it. */
const PRESET_ENTITY_KEY = "preset-entity";

/** Search key for one row of the import dialog's entity table. Keyed by the id
 * being replaced rather than by row number, so a row keeps its own open search
 * when the text above it is edited and the table is rebuilt. */
function importEntityKey(entityId: string): string {
  return `import-entity-${entityId}`;
}

/** The empty reference an unanswered import row shows. */
const NO_ENTITY: EntityRef = { entityId: "", displayName: "", domain: "" };

/** The test values while no complication is open. */
const NO_TEST_VALUES: ReadonlyMap<string, string> = new Map();

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

/** Whether a stored document carries a Control Center control, read the same
 * way: a row with no shapes says "Control" only when there is one. */
function hasControlOf(record: ComplicationRecord): boolean {
  const raw = record.document?.control;
  return raw !== null && typeof raw === "object";
}

/** The step from one header question to the next. Drawn rather than typed so
 * it can carry a stroke thick enough to read as a route, which a text chevron
 * at 12 px never did. */
function headerArrow(): TemplateResult {
  return html`<span class="hstep" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h13" /><path d="M12 6l6 6-6 6" /></svg></span>`;
}

/** The iPhone body every phone drawing sits in: case, screen, Dynamic Island.
 * The case and the screen are theme variables rather than `currentColor`, so
 * the device stays a quiet grey object while the slot inside it is the one
 * thing that lights up when a card is picked. */
function phoneBody(inner: unknown): TemplateResult {
  return html`<svg class="shape-art phone" viewBox="0 0 44 64" aria-hidden="true">
    <rect x="5" y="1.5" width="34" height="61" rx="8.5" fill="var(--wa-art-case)" />
    <rect x="7" y="3.5" width="30" height="57" rx="7" fill="var(--wa-art-screen)" />
    <rect x="17" y="5.5" width="10" height="3" rx="1.5" fill="var(--wa-art-case)" />
    ${inner}
  </svg>`;
}

/** The Apple Watch body: case, screen, the crown and the side button. The two
 * nubs on the right are most of what makes it read as a watch rather than a
 * small phone at this size. */
function watchBody(inner: unknown): TemplateResult {
  return html`<svg class="shape-art watch" viewBox="0 0 60 64" aria-hidden="true">
    <rect x="51" y="21" width="4.5" height="11" rx="2.25" fill="var(--wa-art-case)" />
    <rect x="51.5" y="35" width="3.4" height="8" rx="1.7" fill="var(--wa-art-case)" />
    <rect x="8" y="4" width="44" height="52" rx="14.5" fill="var(--wa-art-case)" />
    <rect x="10.5" y="6.5" width="39" height="47" rx="12.5" fill="var(--wa-art-screen)" />
    ${inner}
  </svg>`;
}

/**
 * A shape drawn where it sits on the device: the device in its own outline,
 * the slot filled inside it.
 *
 * The names alone say nothing to anyone who has not already learned them, and
 * "Corner" in particular is a place rather than a shape. A picture of the
 * device answers both at once, and answers it the way the gallery on the site
 * draws the same complication, so a card here and a card there read as one
 * product rather than two.
 *
 * A phone draws its Lock Screen shapes under a clock and its Home Screen tiles
 * on the page's own grid of four columns and six rows, so Small against Large
 * against Extra Large reads as how much of a page each one takes.
 */
function familyArt(family: FamilyKind, phone: boolean): TemplateResult {
  // A Home Screen tile, 2 by 2 icons for small, 4 by 2 for medium, 4 by 4 for
  // large and the whole 4 by 6 page for extra large.
  const tile = (x: number, y: number, w: number, h: number) => svg`<rect x=${x} y=${y} width=${w} height=${h} rx="3.5" fill="currentColor" />`;
  if (phone) {
    // The clock the Lock Screen shapes sit under. Without it Rectangular and
    // Inline are two grey bars at different heights.
    const clock = svg`<rect x="12" y="13" width="20" height="9" rx="2.5" fill="var(--wa-art-dim)" />`;
    switch (family) {
      case "small": return phoneBody(tile(16, 27, 12, 13.5));
      case "medium": return phoneBody(tile(9.5, 27, 25, 13.5));
      case "large": return phoneBody(tile(9.5, 20, 25, 27.5));
      case "xlarge": return phoneBody(tile(9.5, 12, 25, 44));
      // A circular widget is one of a row of them under the clock, never a dot
      // on its own in the middle of the screen. Its neighbours are what say so.
      case "circular": return phoneBody(svg`${clock}
        <circle cx="12" cy="30" r="4" fill="var(--wa-art-dim)" />
        <circle cx="22" cy="30" r="4" fill="currentColor" />
        <circle cx="32" cy="30" r="4" fill="var(--wa-art-dim)" />`);
      case "inline": return phoneBody(svg`${clock}<rect x="11" y="25" width="22" height="4.5" rx="2.25" fill="currentColor" />`);
      default: return phoneBody(svg`${clock}<rect x="9.5" y="26" width="25" height="9" rx="3" fill="currentColor" />`);
    }
  }
  // The watch face's own clock, top right, except under Corner, which lives
  // there, and under Inline, which sits along the bottom of the face.
  const time = (y: number) => svg`<rect x="31" y=${y} width="15" height="5" rx="2.5" fill="var(--wa-art-dim)" />`;
  switch (family) {
    // Circular goes in a corner of the face, not its middle: the middle is
    // where the hands are.
    case "circular": return watchBody(svg`${time(10)}<circle cx="20.5" cy="21" r="8" fill="currentColor" />`);
    case "corner": return watchBody(svg`${time(34)}<path d="M15.5 23a10 10 0 0 1 10-10" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" />
      <circle cx="17.5" cy="15" r="3.4" fill="currentColor" />`);
    case "inline": return watchBody(svg`${time(10)}<rect x="18" y="44" width="24" height="5" rx="2.5" fill="currentColor" />`);
    default: return watchBody(svg`${time(10)}<rect x="15" y="24" width="30" height="11" rx="3.5" fill="currentColor" />`);
  }
}

/** The Control Center tile, drawn like the shapes: the device with one control
 * on it, its symbol punched out of the middle, and the tiles under it left
 * grey so the one that is yours stands out. */
function controlArt(phone: boolean): TemplateResult {
  const tile = (x: number, y: number, side: number) => svg`<rect x=${x} y=${y} width=${side} height=${side} rx="5.5" fill="currentColor" />
    <circle cx=${x + side / 2} cy=${y + side / 2} r="3.2" fill="var(--wa-art-screen)" />`;
  if (phone) {
    return phoneBody(svg`${tile(13, 11, 18)}
      <rect x="13" y="33" width="18" height="4" rx="2" fill="var(--wa-art-dim)" />
      <rect x="13" y="39" width="18" height="4" rx="2" fill="var(--wa-art-dim)" />`);
  }
  // Two columns of buttons, the way the watch draws Control Center, with the
  // top left one yours.
  return watchBody(svg`${tile(15.75, 15.75, 13)}
    <rect x="31.25" y="15.75" width="13" height="13" rx="4.5" fill="var(--wa-art-dim)" />
    <rect x="15.75" y="31.25" width="13" height="13" rx="4.5" fill="var(--wa-art-dim)" />
    <rect x="31.25" y="31.25" width="13" height="13" rx="4.5" fill="var(--wa-art-dim)" />`);
}

/**
 * The whole device, with one place on it lit: the picture on a place card in
 * the New dialog.
 *
 * Bigger than the shape art and drawn with the screen's furniture around it (a
 * page of app icons, a clock, a grid of controls), because the question this
 * card answers is "where on my phone does this end up", and that is answered
 * by what surrounds the lit part rather than by the lit part itself.
 */
function placeArt(place: ShapePlace): TemplateResult {
  const icons = (y: number) => svg`<rect x="7.5" y=${y} width="5.5" height="5.5" rx="1.8" fill="var(--wa-art-dim)" />
    <rect x="15" y=${y} width="5.5" height="5.5" rx="1.8" fill="var(--wa-art-dim)" />
    <rect x="22.5" y=${y} width="5.5" height="5.5" rx="1.8" fill="var(--wa-art-dim)" />
    <rect x="30" y=${y} width="5.5" height="5.5" rx="1.8" fill="var(--wa-art-dim)" />`;
  const body = (inner: unknown) => html`<svg class="place-art" viewBox="0 0 44 80" aria-hidden="true">
    <rect x="2" y="2" width="40" height="76" rx="9.5" fill="var(--wa-art-case)" />
    <rect x="4" y="4" width="36" height="72" rx="7.5" fill="var(--wa-art-screen)" />
    <rect x="17" y="6" width="10" height="3" rx="1.5" fill="var(--wa-art-case)" />
    ${inner}
  </svg>`;
  if (place === "home") {
    return body(svg`<rect x="7.5" y="13" width="29" height="13" rx="3.5" fill="currentColor" />
      ${icons(30)}${icons(39)}${icons(48)}
      <rect x="6" y="60" width="32" height="12" rx="4.5" fill="var(--wa-art-dock)" />`);
  }
  if (place === "lock") {
    return body(svg`<rect x="15" y="12" width="14" height="3" rx="1.5" fill="var(--wa-art-dim)" />
      <rect x="11" y="18" width="22" height="12" rx="3.5" fill="var(--wa-art-clock)" />
      <rect x="7.5" y="34" width="29" height="10" rx="3.5" fill="currentColor" />
      <circle cx="12" cy="68" r="4.5" fill="var(--wa-art-dim)" />
      <circle cx="32" cy="68" r="4.5" fill="var(--wa-art-dim)" />`);
  }
  // The watch face, for a watch owner: one place, drawn as the device itself.
  return html`<svg class="place-art watch" viewBox="0 0 60 64" aria-hidden="true">
    <rect x="51" y="21" width="4.5" height="11" rx="2.25" fill="var(--wa-art-case)" />
    <rect x="51.5" y="35" width="3.4" height="8" rx="1.7" fill="var(--wa-art-case)" />
    <rect x="8" y="4" width="44" height="52" rx="14.5" fill="var(--wa-art-case)" />
    <rect x="10.5" y="6.5" width="39" height="47" rx="12.5" fill="var(--wa-art-screen)" />
    <rect x="31" y="10" width="15" height="5" rx="2.5" fill="var(--wa-art-clock)" />
    <rect x="15" y="24" width="30" height="11" rx="3.5" fill="currentColor" />
  </svg>`;
}

/**
 * The Control Center place card: the device's own Control Center, one tile
 * yours and the rest grey.
 *
 * Both devices have one and they look nothing alike: iOS lays out a page of
 * square tiles and sliders, watchOS a scatter of round buttons. A watch owner
 * shown the iPhone version is being told about a screen they do not have.
 */
function controlPlaceArt(phone: boolean): TemplateResult {
  if (phone) {
    return html`<svg class="place-art" viewBox="0 0 44 80" aria-hidden="true">
      <rect x="2" y="2" width="40" height="76" rx="9.5" fill="var(--wa-art-case)" />
      <rect x="4" y="4" width="36" height="72" rx="7.5" fill="var(--wa-art-blur)" />
      <rect x="17" y="6" width="10" height="3" rx="1.5" fill="var(--wa-art-case)" />
      <rect x="7.5" y="14" width="13" height="13" rx="4.5" fill="currentColor" />
      <circle cx="14" cy="20.5" r="3" fill="var(--wa-art-blur)" />
      <rect x="23.5" y="14" width="13" height="13" rx="4.5" fill="var(--wa-art-dim)" />
      <rect x="7.5" y="31" width="13" height="13" rx="4.5" fill="var(--wa-art-dim)" />
      <rect x="23.5" y="31" width="13" height="13" rx="4.5" fill="var(--wa-art-dim)" />
      <rect x="7.5" y="48" width="6" height="24" rx="3" fill="var(--wa-art-dim)" />
      <rect x="16" y="48" width="6" height="24" rx="3" fill="var(--wa-art-dim)" />
      <rect x="25.5" y="48" width="11" height="11" rx="3.5" fill="var(--wa-art-dim)" />
      <rect x="25.5" y="61" width="11" height="11" rx="3.5" fill="var(--wa-art-dim)" />
    </svg>`;
  }
  // watchOS: two columns of big rounded buttons filling the face, with the
  // battery pill above them. Not a scatter of circles, which is what the first
  // version of this drawing guessed at.
  const pad = (x: number, y: number) => svg`<rect x=${x} y=${y} width="12" height="12" rx="4.5" fill="var(--wa-art-dim)" />`;
  return html`<svg class="place-art watch" viewBox="0 0 60 64" aria-hidden="true">
    <rect x="51" y="21" width="4.5" height="11" rx="2.25" fill="var(--wa-art-case)" />
    <rect x="51.5" y="35" width="3.4" height="8" rx="1.7" fill="var(--wa-art-case)" />
    <rect x="8" y="4" width="44" height="52" rx="14.5" fill="var(--wa-art-case)" />
    <rect x="10.5" y="6.5" width="39" height="47" rx="12.5" fill="var(--wa-art-blur)" />
    <rect x="26.5" y="8.5" width="7" height="3" rx="1.5" fill="var(--wa-art-dim)" />
    <rect x="16.75" y="14" width="12" height="12" rx="4.5" fill="currentColor" />
    <circle cx="22.75" cy="20" r="2.6" fill="var(--wa-art-blur)" />
    ${pad(31.25, 14)}
    ${pad(16.75, 28)}${pad(31.25, 28)}
    ${pad(16.75, 42)}${pad(31.25, 42)}
  </svg>`;
}

/** The tick a picked shape card carries, top right. A border alone is easy to
 * miss in a grid of eight, and the count in the footer has to add up to
 * something the eye can find. */
function pickTick(): TemplateResult {
  return html`<span class="pick-tick" aria-hidden="true"><svg viewBox="0 0 16 16"><path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" /></svg></span>`;
}

/** The mock tile in the Control Center shape tab, CSS px. Sized to the row of
 * shape art beside it, which is 16px tall; a tile this small draws its symbol
 * alone, so it reads as a control without pretending to be readable. */
const CONTROL_TAB_TILE_SIDE = 20;
/** The tile height in a picker row, sized to the row picture that holds it. */
const CONTROL_ROW_TILE_SIDE = 38;

const COL_LEFT_DEFAULT = 300;
const COL_RIGHT_DEFAULT = 360;
/** Layer-row thumbnail box, CSS px. Wide, because most layers are wider than tall. */
const THUMB_W = 44;
const THUMB_H = 22;
/** The three sizes the row pictures come in, picked in the Layers bar. Small
 * is the size the list has always used; the other two are for reading a busy
 * layer without opening the big preview. */
const THUMB_STEPS = [1, 1.7, 2.6] as const;
const THUMB_STEP_LABEL = ["S", "M", "L"] as const;
const THUMB_STEP_TITLE = ["Small", "Medium", "Large"] as const;

/**
 * How the Layers rows fold as the card gets narrow, one pair of container
 * queries per picture size, since a bigger picture needs the room sooner.
 *
 * On one line a selected row gives its five buttons about 120px, and in a
 * 300px column that left the name no room at all. So the row folds twice.
 * First the badges and buttons drop to a second line under the picture and
 * the name. Then, narrower still, the name drops under the picture too, and
 * the picture shrinks if even that is too wide.
 *
 * On a folded row the buttons show only on the selected row, not on hover,
 * so the row never grows a line under the pointer. The badges stay put
 * beside them.
 */
function layerRowFolds(): string {
  return THUMB_STEPS.map((scale, i) => {
    const w = Math.round(THUMB_W * scale);
    const h = Math.round(THUMB_H * scale);
    const p = `.layers-card.s${i}`;
    return `
    @container layers (max-width: ${w + 299}px) {
      ${p} .layer {
        grid-template-columns: 16px 3px var(--thumb-w) minmax(0, 1fr);
        grid-template-areas: "grip bar thumb name" "grip bar right right";
        row-gap: 0; padding-top: 5px; padding-bottom: 5px;
      }
      ${p} .layer.dragging { padding-top: 0; padding-bottom: 0; }
      ${p} .layer > .grip { grid-area: grip; }
      ${p} .layer > .bar { grid-area: bar; }
      ${p} .layer > .thumb, ${p} .layer > .folder { grid-area: thumb; }
      ${p} .layer > .name { grid-area: name; }
      ${p} .layer > .right { grid-area: right; min-width: 0; flex-wrap: wrap; justify-content: flex-start; gap: 0 4px; }
      ${p} .layer:not(.group) .badge, ${p} .layer:not(.group) .acts { margin-top: 4px; }
      ${p} .layer:not(.group):hover .badges, ${p} .layer.hl .badges, ${p} .layer:focus-within .badges { display: inline-flex; }
      ${p} .layer:not(.group):not(.rich):not(.hl):not(:focus-within):hover .acts { display: none; }
      ${p} .layer.pinned .badges { display: none; }
      ${p} .layer.group { grid-template-areas: "grip bar thumb name" "grip bar thumb right"; }
      ${p} .layer.group > .right { justify-content: flex-end; gap: 2px; }
      ${p} .group-kids { margin-left: 6px; padding-left: 6px; }
      ${p} .group-cta { flex-wrap: wrap; }
    }
    @container layers (max-width: ${w + 149}px) {
      ${p} .layer {
        grid-template-columns: 16px 3px minmax(0, 1fr);
        grid-template-areas: "grip bar thumb" "grip bar name" "grip bar right";
      }
      ${p} .layer > .thumb { justify-self: start; width: min(var(--thumb-w), 100%); height: auto; aspect-ratio: ${w} / ${h}; }
      ${p} .layer > .name { padding-top: 4px; }
      ${p} .layer.group {
        grid-template-columns: 16px 3px minmax(0, 1fr) auto;
        grid-template-areas: "grip bar thumb right" "grip bar name name";
      }
      ${p} .layer.group > .folder { justify-self: start; width: auto; }
      ${p} .layer.group > .name { padding-top: 2px; }
      ${p} .group-kids { margin-left: 2px; padding-left: 4px; }
    }`;
  }).join("\n");
}
type ThumbStep = 0 | 1 | 2;
/** The help dialog's tabs. */
type HelpTab = "basics" | "keys" | "sync";
type LayerDetail = "compact" | "expanded";
/** How the Layers list is shown: picture size and row detail. Per browser,
 * like the column widths, and never part of the document. */
const LIST_STORE_KEY = "wrist-assistant-panel.layers.v1";
const GRID_STORE_KEY = "wrist-assistant-panel.grid.v1";/** How tall the slot a dragged row opens is, CSS px. */
const DROP_GAP = 34;
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
 * the narrowest column of the three, and the inspector was dragged wide while
 * its rows stacked their titles over their controls, so both start over. */
const COL_STORE_KEY = "wrist-assistant-panel.columns.v3";

const clampColumn = (n: number) => Math.max(COL_MIN, Math.min(COL_MAX, Math.round(n)));

/**
 * Picking several layers uses the platform's multi-select key: Cmd on a Mac,
 * Ctrl everywhere else. Shift keeps working too, since it did before.
 */
const isMultiKey = (e: MouseEvent | PointerEvent) => e.metaKey || e.ctrlKey || e.shiftKey;

/** Whether a press lands inside a layer's hit box on the preview, whatever is
 * drawn over it. The hit box is the first child of the layer's group and carries
 * its rotation, so its on-screen bounds are the box the author sees dashed. */
function pressInsideLayer(svg: SVGSVGElement, id: string, e: PointerEvent): boolean {
  const g = svg.querySelector(`g[data-element-id="${CSS.escape(id)}"]`);
  const hit = g?.firstElementChild;
  if (!hit || hit.tagName.toLowerCase() !== "rect") return false;
  const r = hit.getBoundingClientRect();
  return e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
}
/** Input types that hold no text, so nothing is lost by letting the panel's
 * own shortcuts through while one of them has the focus. */
const NON_TEXT_INPUTS = /^(range|checkbox|radio|color|button|submit|reset|file|image)$/;
/** How far the pointer travels, CSS px, before a press on a group or a pick is a drag and not a click. */
const DRAG_SLOP = 3;
const MULTI_KEY = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform) ? "Cmd" : "Ctrl";
/** How a shortcut is written in a tooltip: ⌘D on a Mac, Ctrl+D elsewhere. */
const KEY_MOD = MULTI_KEY === "Cmd" ? "⌘" : "Ctrl+";
const KEY_SHIFT = MULTI_KEY === "Cmd" ? "⇧" : "Shift+";

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
  @state() private maxSchemaVersion = 7;
  /** iPhone presets on the selected watch (slot + name). freeSlot() skips
   * their slots; the list shows them as locked rows. */
  @state() private presets: { slot: number; name: string }[] = [];
  /** Every slot something other than this server's records holds: the presets
   * plus customs on another home. The list shows them as locked rows and
   * freeSlot() skips them all. Built from `presets` when the integration
   * predates the field. */
  @state() private occupied: OccupiedSlot[] = [];
  /** The store token for the selected watch and the one it last confirmed.
   * Equal means everything here is on the wrist. `appliedToken` is undefined
   * when the watch has never acked at all, which is what the chip's "Update
   * the watch app" branch reports; null on the wire means the same thing. */
  @state() private serverToken = 0;
  @state() private appliedToken?: number;
  /** Whether a list or status reply has landed for the selected watch. The
   * chip claims nothing before one does: "Update the watch app" next to a
   * watch nobody has asked about yet is a guess, not a fact. */
  @state() private sendStatusKnown = false;
  /** Whether the watch holds a long-poll on this server right now. */
  @state() private polling = false;
  /** Seconds since the watch last polled, as of the last list or nudge reply.
   * Undefined from an integration older than the field, or when nothing has
   * polled since the server started. Read only while `polling` is false, so a
   * value that ages between refreshes is never the one on screen for long. */
  @state() private lastPollSeconds?: number;
  /** Seconds since a phone owner last ran a sync. A phone never polls, so
   * this is what its header chip ages itself against. Undefined from an
   * integration older than the field, or when it has never synced. */
  @state() private lastSyncSeconds?: number;
  /** Whether the server holds a push token for this phone owner, so a save
   * wakes it. False for a watch, and from an integration older than the
   * field: the chip then asks for the app to be opened, as it always did. */
  @state() private pushAvailable = false;
  /** Seconds since the last push attempt for this owner, this server run.
   * Null when there has been none, and when the server did not say. Kept for
   * the chip's own use; the age on screen is still the phone's last sync,
   * since that is the half that proves the push arrived. */
  @state() private lastPushSeconds: number | null = null;
  /** A save or a Send tap is waiting for the watch's ack. */
  @state() private sendPending = false;
  private sendTimer?: number;
  /** Watch-app pages (id + name) from the watch's last sync report; feeds the
   * "Open the page" tap-action picker. */
  @state() private pages: { id: string; name: string }[] = [];
  @state() private templateResults = new Map<string, string>();
  @state() private historySeries = new Map<string, string>();
  /** Every-reading fetches' counts, by the same key, from the same fetch. */
  @state() private historyReadings = new Map<string, HistoryReadings>();
  /** Calendar events, to-do items and forecasts for the service-backed list
   * layers, by the readable list key. Fetched on the templates' own clock:
   * neither an agenda nor a forecast moves faster than that, and each entry is
   * a service call rather than a state read. */
  @state() private listItems = new Map<string, string>();
  /** The list whose row is being designed on the canvas, if any. */
  @state() private rowEditListId?: string;
  @state() private templateError?: string;
  @state() private templateFetchedAt?: number;
  @state() private forced: ForcedBranches = new Map();
  @state() private showRaw = false;
  @state() private inspect: Inspect = { kind: "general" };
  /** The inspector cards that are open. One entry means one at a time. Reset
   * to the first card whenever something else is selected (willUpdate). */
  @state() private openSections: ReadonlySet<string> = new Set(["content"]);
  /** The inspector cards showing their help text, by card id. Not stored:
   * help is something asked for now, not a setting. The Control Center card
   * starts with its help on, because its rows are new and each one needs a
   * sentence; its "?" hides them for the rest of the session. */
  @state() private helpSections: ReadonlySet<string> = new Set(["control"]);
  /** A drag on a number's title is one undo step, however many edits it makes. */
  private readonly scrubStart = () => this.draft?.beginGesture();
  private readonly scrubEnd = () => this.draft?.endGesture();
  /** The header's complication menu is open. */
  @state() private pickerOpen = false;
  /** The shape the picker menu is narrowed to. "all" is the default and the
   * only state a short list ever has: the filter header only appears once the
   * list is long enough to be worth narrowing. Per session, never saved. */
  @state() private pickerFilter: FamilyKind | "all" = "all";
  /** The slot of the locked picker row whose explanation is unfolded. A tap
   * shows it inline because a hover title never appears on a touch screen. */
  @state() private pickerNote?: number;
  /** Whether the picker's Hidden section is unfolded. */
  @state() private pickerHiddenOpen = false;
  /** The picker row asking "Really delete", by record id. */
  @state() private pickerConfirmDelete?: string;
  /** A device has been picked and its complications are still on the way. The
   * picker stays open across the switch, so without this the pane beside the
   * device list would show the previous device's rows until the reply landed. */
  @state() private ownerBusy = false;
  /**
   * The device whose complications the picker is listing, when that is not the
   * device the editor is on. Undefined the rest of the time.
   *
   * Clicking a device in the picker only changes what the picker lists: the
   * editor keeps the complication it had open, because looking at what another
   * device holds is not the same as deciding to leave the one you are editing.
   * The editor moves when a complication is picked, and not before.
   */
  @state() private browseOwnerId?: string;
  /** The browsed device's own list, fetched for the picker alone. */
  @state() private browseList?: { records: ComplicationRecord[]; occupied: OccupiedSlot[] };
  /** Why the browsed device's list could not be fetched. */
  @state() private browseError?: string;
  /** Entity states typed in under the preview, standing in for the live ones
   * so the other states can be seen without waiting for the house. Never
   * saved; cleared by Back to live. */
  /** Values typed or slid in to test the preview. They live on the draft so
   * undo walks them too; see `Draft.testValues`. */
  private get testValues(): ReadonlyMap<string, string> {
    return this.draft?.testValues ?? NO_TEST_VALUES;
  }
  /** The shared value open for editing in its card under the preview. It
   * edits in place rather than in the inspector, so the form opens where it
   * was clicked and the inspector keeps its selection. */
  @state() private openValue?: string;
  /** The Shared values card's "?": how shared values work, in four steps. */
  @state() private sharedHelp = false;
  /** The value chip whose input is showing. */
  @state() private editingValue?: string;
  /** The layer row being dragged in the Layers list. */
  private dragId?: string;
  /** How big the pictures in the Layers rows are drawn. Index into THUMB_STEPS. */
  @state() private thumbStep: ThumbStep = 0;
  /** How much each Layers row says. Expanded adds a third line with the
   * layer's place on the face and keeps the badges next to the buttons. */
  @state() private layerDetail: LayerDetail = "compact";
  /** Whether the Add a layer card is open. Shut, its title bar is one line and
   * the Layers list rises to the top of the column, which is where anyone
   * past their first face wants it. */
  @state() private addOpen = true;
  /** How the add buttons are drawn. Expanded carries a sample of what each
   * kind draws; compact drops the samples for a row of tinted chips. */
  @state() private addDetail: LayerDetail = "expanded";
  /** Layers picked with Cmd/Ctrl-click, in the list or on the preview, waiting to be grouped. */
  @state() private multi: ReadonlySet<string> = new Set();
  /** The row a shift-click measures its range from: the last row clicked. */
  private pickAnchor?: string;
  /** Layers lifted by ⌘C or ⌘X. Held on the panel, not the system clipboard,
   * so it works without a permission prompt and pastes into any complication
   * opened in this tab. */
  private clipboard?: LayerClip;
  /** A layer's position lifted by the Position card's Copy position, for its
   * Paste position on another layer. Kept for the tab, like `clipboard`. */
  @state() private copiedPosition?: CopiedPosition;

  // ── Parts ──────────────────────────────────────────────────────────
  //
  // The home's library of saved layer sets. One library, so it is fetched once
  // and kept: every complication in the panel offers the same parts. `parts`
  // being undefined means "not asked yet", which is what the dialog shows a
  // spinner for; an empty array is a library with nothing in it.

  /** The Save to parts dialog: which layers, and what to call them. */
  @state() private savePartOpen = false;
  @state() private savePartName = "";
  @state() private savePartIds: readonly string[] = [];
  @state() private savePartError?: string;
  @state() private savePartBusy = false;
  /** The Add from parts dialog. */
  @state() private partsOpen = false;
  @state() private parts?: SavedPart[];
  @state() private partsError?: string;
  @state() private partsBusy = false;
  /** The part being brought in, read back out of its text, and the entities
   * this home is putting under its slots. */
  @state() private partPick?: { id: string; config: CustomComplicationConfig };
  @state() private partMap: ReadonlyMap<string, EntityRef> = new Map();
  /** The row being renamed in the dialog, and the one asking to be deleted.
   * Both are ids, so a list that reloads under them closes them by itself. */
  @state() private partRename?: { id: string; name: string };
  @state() private partConfirmDelete?: string;
  /** Each part's text read back into a document, so the grid parses a part
   * once rather than on every render. Keyed by id, checked against the text,
   * so a renamed or replaced part is re-read. */
  private partConfigCache = new Map<string, { text: string; config: CustomComplicationConfig | undefined }>();
  /** Snap to grid, and the grid's step as a fraction of the face. A choice of
   * this browser, like the column widths, never saved into a complication:
   * the watch has no use for it. */
  @state() private snapGrid = true;
  @state() private gridStep: number = 0.01;
  /** Whether the grid's lines are drawn. Snapping works either way; the lines
   * start hidden so a fine grid does not cover the face. */
  @state() private showGridLines = false;
  /** Snap to the other layers' edges and middles while dragging. A browser
   * setting like the grid, and on by default: the two work together, and a
   * user who wants only one turns the other off in the snapping menu. */
  @state() private snapLayers = true;
  /** The smart guides the drag under way is sitting on. Empty whenever nothing
   * is being dragged, so the lines are gone the moment the pointer is let go. */
  @state() private guides: readonly GuideLine[] = [];
  /** Which of the preview bar's menus is open: the grid size or Preview as.
   * Both are drawn by the panel rather than native selects: Chrome on macOS
   * held the next click on the face for most of a second after a native menu
   * closed, so a drag right after a change lagged (measured 2026-09-12: the
   * press was 650 to 900 ms old on arrival, with no long task on the page). */
  @state() private openMenu?: "grid" | "case" | "tint" | "list";
  /** Alt is down. It flips snapping for a drag, so the grid lines show while
   * it is held even with Snap to grid off. */
  @state() private altHeld = false;
  /** Groups folded shut in the Layers list. List state only, never saved. */
  @state() private collapsed: ReadonlySet<string> = new Set();
  @state() private activeFamily: FamilyKind = "rectangular";
  /**
   * The Control Center tab is the one being edited, in place of a shape.
   *
   * Its own flag rather than a value of `activeFamily`, which many places read
   * as "which canvas am I on" and would have to learn a case that has no
   * canvas at all. Read through `inControlView`, never directly: that getter is
   * what makes a control that is switched off, or a layer selected anywhere,
   * put the shape back.
   */
  @state() private controlView = false;
  /**
   * Which page of a paged document the canvas is showing, 1-based.
   *
   * Editor state and nothing else: it is never written to the document, and the
   * watch keeps its own page per placed slot. It starts at 1 for every document
   * opened, and is clamped to the document's page count after every change, so
   * taking a document from four pages down to two can never leave the canvas
   * showing a page that is gone.
   */
  @state() private page = 1;
  /** A tour is playing in the preview. The player itself holds the timers; this
   * is what the strip's Stop button and its progress bar are drawn from. */
  @state() private touring = false;
  /** Bumped once per tour, so the progress bar's animation restarts on a second
   * press rather than carrying on from where the first one left it. */
  @state() private tourRun = 0;
  /** The one tour player. Its boundaries go straight to `showPage`, since these
   * page changes are the tour rather than a user press that should stop it. */
  private readonly tour = new TourPlayer({
    // The selection is left alone while the tour runs: a tour is six seconds of
    // watching, and losing the layer you were working on to it would be a
    // surprise. It is settled once, when the tour ends or is stopped.
    show: (page) => this.showPage(page, true),
    done: () => { this.touring = false; this.dropOffPageSelection(); },
  });
  /** Pick mode: the pointer names the layer under it instead of dragging it,
   * the way a browser inspector picks a node. One click selects and ends it. */
  @state() private picking = false;
  /** The layer the pick-mode pointer is over. Shaded in every preview and
   * marked in the Layers card, so the two lists answer each other. */
  @state() private pickHoverId?: string;
  /** The layers under the pointer in the Layers list: one for a layer row,
   * every member for a group row. Tinted on the preview, so a row can be
   * found on the face without selecting it. Selection stays where it was. */
  @state() private listHoverIds: readonly string[] = [];
  /** The layer whose row inside the inspector (a group's members, a chart's
   * extras) is under the pointer. While it is set the preview draws that layer
   * as if it alone were selected, without changing the selection. */
  @state() private rowHoverId?: string;
  /** The preview is open full-width in a modal, for fine moves on a small
   * face. Only the face and its gestures come along; the columns stay under
   * the backdrop. */
  @state() private zoomed = false;
  /** The keys-and-mouse help is open. */
  @state() private helpOpen = false;
  /** Review mode: every tap area on show, labelled, with the drawing dimmed.
   * An attached tap is invisible during normal editing on purpose, which is
   * exactly why "what happens if I tap here?" needed a mode of its own. */
  @state() private showTaps = false;
  /** The name the open complication had when its edit session started, so the
   * General tab can warn that a rename does not reach the watch face picker.
   * Undefined for a brand-new complication (nothing is on the watch yet). */
  @state() private savedName?: string;
  /** The preset whose entity dialog is open, and the entity chosen in it so
   * far. A preset asks for its entity before it creates anything, so closing
   * the dialog leaves the document exactly as it was. */
  @state() private presetKind?: PresetKind;
  @state() private presetEntity?: EntityRef;
  /** The New complication dialog is open, and what has been answered in it.
   *
   * It used to be a popover offering four shape buttons, one of them tinted as
   * though it were the answer, and a click on any of them made a complication
   * called "New complication" straight away. Two things went wrong with that:
   * the tint chose for the author, and a watch quietly filled with documents
   * sharing one name. The dialog asks for both, and creates nothing until a
   * name nothing else on this watch uses sits beside a shape someone picked. */
  @state() private newOpen = false;
  @state() private newName = "";
  /** The shapes ticked in the dialog, in no particular order: `biggestFirst`
   * decides what the document is built with. A set rather than one shape
   * because a complication that is going to be Large and Medium is worth
   * saying in one go, and because nothing about the second shape is a
   * different question from the first. */
  @state() private newFamilies: ReadonlySet<FamilyKind> = new Set();
  /** Which place card is open. The picks of a place you leave are kept and
   * counted on its card, so switching tabs never loses an answer. */
  @state() private newPlace?: ShapePlace | "control";
  /** The dialog's Control Center tile. On its own it makes a document of no
   * shape with the control switched on; beside a shape it adds the control to
   * that shape's document. */
  @state() private newControl = false;
  /** The Share dialog is open, which mode it is in, and the labels the author
   * has renamed. Labels are keyed by placeholder id and only hold the edited
   * ones, so the defaults follow the document as it is edited underneath. */
  @state() private shareOpen = false;
  @state() private shareMode: "share" | "backup" = "share";
  @state() private shareLabels: ReadonlyMap<string, string> = new Map();
  /** The shapes picked in Share. Empty when it opens, so the author chooses. */
  @state() private shareFamilies: ReadonlySet<FamilyKind> = new Set();
  /** Layers a Share or gallery name row points at, lit in the Layers list. */
  @state() private dialogLitIds: readonly string[] = [];
  /** Group and shared value names changed for shared copies only, by id: the
   * link, the file and the gallery all take them. Cleared each time Share
   * opens; the draft keeps its own names. */
  @state() private shareGroupNames: ReadonlyMap<string, string> = new Map();
  @state() private shareValueNames: ReadonlyMap<string, string> = new Map();
  /** The complication's name for shared copies; empty keeps its own. */
  @state() private shareName = "";
  /** Layer names for shared copies, keyed by the layer's own name, so one box
   * renames every layer that shares it. */
  @state() private shareLayerNames: ReadonlyMap<string, string> = new Map();
  /** What the Share dialog's footer last had to say. Empty most of the time:
   * it speaks when a copy or a download landed, and when this browser has no
   * clipboard to write to and the text has been selected instead. */
  @state() private shareNote = "";
  /** The Share dialog's text box is shown. Folded away each time it opens:
   * the buttons carry the text, and the box is for reading it. */
  @state() private shareTextOpen = false;
  /** Which action tile just landed, for its "copied" or "saved" moment. */
  @state() private shareCopied?: "link" | "file" | "text";
  private shareCopiedTimer?: number;
  /** The link field shows only when the link could not reach the clipboard,
   * so there is something on screen to select and copy by hand. */
  @state() private shareLinkShown = false;
  /** The public name row the pointer or the focus is in, by row key. The
   * preview dims everything but the layers that use it. */
  @state() private shareFocus?: string;
  /** The Share to gallery dialog, opened from Share. The slots and their
   * labels are the Share dialog's, so what is sent is what Share shows. */
  @state() private galleryOpen = false;
  /** New upload or the uploads list, and which of the three steps New is on. */
  @state() private galleryTab: "new" | "mine" = "new";
  @state() private galleryStep: 1 | 2 = 1;
  /** The approved upload this one is sent as a new version of. */
  @state() private galleryReplaces?: { id: string; title: string };
  /** The public text row the pointer or the focus is in. */
  /** Waits out typing in a slot label before the pictures are drawn again,
   * since they print the labels. */
  private galleryRedrawTimer?: number;
  @state() private galleryTitle = "";
  @state() private galleryDescription = "";
  @state() private galleryTags: ReadonlySet<GalleryTag> = new Set();
  @state() private galleryNickname = "";
  /** Undefined while the pictures are being drawn. */
  @state() private galleryPreviews?: GalleryPreview[];
  @state() private galleryPreviewNote = "";
  @state() private gallerySending = false;
  @state() private gallerySent = false;
  @state() private galleryError = "";
  /** This home's uploads, undefined until the gallery has answered. */
  @state() private galleryUploads?: GalleryUpload[];
  @state() private galleryUploadsError = "";
  /** The upload whose Delete was clicked once and now asks again. */
  @state() private galleryConfirmDelete?: string;
  @state() private galleryDeleting?: string;
  /** Fetched from the integration once per panel load. */
  private galleryKey?: string;
  /** Counts preview runs, so a slow run for an older opening is dropped. */
  private galleryPreviewRun = 0;
  /** The Import dialog: the pasted text, what it parsed into, the name the
   * copy will take, and one chosen entity per slot the design asks about. */
  @state() private importOpen = false;
  @state() private importText = "";
  @state() private importParse?: ImportParse;
  @state() private importName = "";
  @state() private importMap: ReadonlyMap<string, EntityRef> = new Map();
  /** The shapes Import takes. Undefined takes every shape the text has. */
  @state() private importFamilies?: ReadonlySet<FamilyKind>;
  /** A file is being dragged over the Import dialog. */
  @state() private importDrop = false;
  /** Enter and leave fire for every child a drag crosses, so the highlight
   * counts them rather than trusting whichever fired last. */
  private importDragDepth = 0;
  /** The shared text is showing although it parsed. It folds away once it
   * reads as a complication, so the preview and the pickers come first; the
   * reader can still open it, and it stays open until the dialog closes. */
  @state() private importTextShown = false;
  /** The entity row the pointer or the focus is in, by the id it replaces. */
  @state() private importFocus?: string;
  /** Recorder series for the Import preview, keyed like `historySeries`. */
  @state() private importHistory = new Map<string, string>();
  private importHistoryTimer?: number;
  /** Counts history fetches, so a slow reply about an older pick is dropped. */
  private importHistoryRun = 0;
  /** The requests the current `importHistory` answers. */
  private importHistoryAsked?: string;
  /** The preview's document with the picks applied, cached against the parse
   * and the picks it was built from so a redraw does not remap and recompile. */
  private importPreviewCache?: {
    parse: ImportParse;
    map: ReadonlyMap<string, EntityRef>;
    families: ReadonlySet<FamilyKind> | undefined;
    config: CustomComplicationConfig;
    entities: EntityRef[];
  };
  /** The History dialog: the open complication's past revisions, the entry
   * being looked at, and its document once the server has handed it over.
   * Bodies are fetched one at a time, so the list itself stays small even for
   * a design with twenty saves behind it. */
  @state() private historyOpen = false;
  @state() private historyEntries: SaveHistoryEntry[] = [];
  /** The revision the list has selected, which is the one drawn. */
  @state() private historyPick?: number;
  @state() private historyDoc?: CustomComplicationConfig;
  @state() private historyBusy = false;
  @state() private historyNote?: string;
  /** The Restore button was pressed with unsaved work in the editor, so it is
   * asking first. A confirm inside the dialog, not a browser prompt. */
  @state() private historyConfirm = false;
  /** Counts body fetches, so a slow reply about an entry nobody is looking at
   * any more is dropped rather than drawn. */
  private historyRun = 0;
  /** The link the Share dialog last built and the text it holds. A link for
   * different text is not shown. */
  @state() private shareLink?: { text: string; url: string };
  @state() private helpTab: HelpTab = "basics";
  /** A share link the panel was opened with, held until the watch list has
   * loaded, since that is what says whether there is a slot to import into. */
  private pendingLink?: string;
  private linkReady = false;
  /** Why a share link could not open the Import dialog. */
  @state() private linkNote?: string;
  /** Parsed config per saved record, keyed by id and invalidated by revision.
   * The picker draws a real preview of every complication, and parsing and
   * compiling every document on every render of an open menu is the one part
   * of that worth keeping. */
  private readonly recordPreviews = new Map<string, { revision: number; config: CustomComplicationConfig; entities: EntityRef[] }>();
  /** Which watch case the previews are drawn in. The reference (46 mm) is scale 1. */
  @state() private previewCase = REFERENCE_CASE.label;
  /** The tint of a tinted watch face to preview in, or undefined for full
   * colour. Not saved: a preview left tinted by accident would read as a broken
   * complication on the next visit. */
  @state() private previewTint?: string;
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
  /** `chartHistorySignature` as of the last scheduled refresh. */
  private historySignature = "";
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
  /** The id written on whatever the last press on the face landed on, so a
   * double click that follows it still knows which row it is about. */
  private lastPressHitId?: string;
  private keyHandler = (e: KeyboardEvent) => {
    if (e.key === "Alt") this.altHeld = true;
    this.onKey(e);
  };
  /** A window that loses focus with Alt down never sees its keyup. */
  private blurHandler = () => { this.altHeld = false; };
  /** Arrows being held down right now, only the ones that actually nudged. */
  private heldArrows = new Set<string>();
  /** Letting the last one go closes the coalescing window, the way a pointer up
   * does, so the next run of presses is a fresh undo step. Counting them keeps
   * a diagonal nudge (two arrows at once) one step rather than two. */
  private keyUpHandler = (e: KeyboardEvent) => {
    if (e.key === "Alt") this.altHeld = false;
    if (!this.heldArrows.delete(e.key)) return;
    if (this.heldArrows.size === 0) this.draft?.endGesture();
  };

  static override styles = css`
    :host {
      /* Column so the footer can sit under a layout that takes the rest of the
         height, rather than being pushed off the bottom of the page. */
      display: flex;
      flex-direction: column;
      /* Home Assistant's ha-panel-custom is a plain block with no height of
         its own, so 100% here resolves to auto and the columns collapse to
         nothing. The panel owns the whole viewport (custom panels draw no
         HA toolbar), so take it from the viewport instead. */
      height: 100vh;
      height: 100dvh;
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
      --wa-bg: var(--primary-background-color, #f3f1ec);
      --wa-card: var(--card-background-color, #ffffff);
      --wa-panel: var(--secondary-background-color, #f6f4ef);
      --wa-raised: #faf9f6;
      --wa-input: #ffffff;
      --wa-line: var(--divider-color, #e4e0d7);
      --wa-line-strong: #cfc9bd;
      --wa-ink: var(--primary-text-color, #201d19);
      --wa-muted: var(--secondary-text-color, #7d766c);
      --wa-accent: var(--primary-color, #3d5bd9);
      --wa-accent-ink: #fff;
      /* The one filled button on screen. Ink on paper in the light skin, where
         a saturated fill fights the tinted cards; the accent in the dark one,
         where ink is the ground. */
      --wa-primary-bg: var(--wa-ink);
      --wa-primary-ink: #fff;
      /* A selected row: a cool wash rather than the kind colour, so a list of
         eight kinds still has one obvious "you are here". */
      --wa-sel-bg: #edf0fb;
      --wa-sel-ring: #c5cef2;
      /* Inspector rows: a fixed title column, so every control starts at the
         same x, and one soft fill for the boxes in them. The fill is ink at
         low strength, so it suits both skins without a second value. The lit
         button of a segmented control sits a step above that fill. */
      --wa-lab: 88px;
      /* Where a card's controls start: past the title column. A narrow
         inspector stacks titles over controls and sets this to 0. */
      --wa-col: calc(var(--wa-lab) + 8px);
      --wa-field: color-mix(in srgb, var(--wa-ink) 5.5%, transparent);
      --wa-seg-on: var(--wa-card);
      /* Two colours for the things that come out of Home Assistant rather
         than out of this editor: the entity a layer names, and the value it
         is reading right now. They are the same two colours in the search
         list, the inspector, the layer rows and the strip at the bottom, so
         "which words here are my house" is answered by hue alone and a dense
         card stops being a wall of grey. Nothing else in the sheet may use
         them. */
      --wa-ent: #0f766e;
      --wa-val: #9a5b00;
      --wa-ent-bg: color-mix(in srgb, var(--wa-ent) 12%, transparent);
      --wa-val-bg: color-mix(in srgb, var(--wa-val) 14%, transparent);
      /* The little drawn devices in the New dialog and the Add a shape panel.
         The device stays a quiet object in every theme and the slot inside it
         is drawn in currentColor, so picking a card lights the slot alone.
         A screen is dark in both themes, the way Apple's own pickers draw one:
         a white rectangle reads as a piece of paper. */
      --wa-art-case: #cfc9bd;
      --wa-art-screen: #26241f;
      --wa-art-dim: #45413a;
      --wa-art-clock: #5d584f;
      --wa-art-dock: #322f2a;
      --wa-art-blur: #2f2c27;
      --wa-r-sm: 8px;
      --wa-r-md: 12px;
      --wa-r-lg: 16px;
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
      --wa-primary-bg: var(--wa-accent);
      --wa-primary-ink: var(--wa-accent-ink);
      --wa-sel-bg: color-mix(in srgb, var(--wa-accent) 18%, var(--wa-card));
      --wa-sel-ring: color-mix(in srgb, var(--wa-accent) 45%, transparent);
      --wa-seg-on: #2b2f3d;
      --wa-ent: #5fd4c4;
      --wa-val: #ffc45c;
      --wa-ent-bg: color-mix(in srgb, var(--wa-ent) 14%, transparent);
      --wa-val-bg: color-mix(in srgb, var(--wa-val) 16%, transparent);
      --wa-art-case: #2b2f3d;
      --wa-art-screen: #05060a;
      --wa-art-dim: #232734;
      --wa-art-clock: #3a3f52;
      --wa-art-dock: #14161f;
      --wa-art-blur: #0f1119;
      --wa-shadow-pop: 0 16px 48px rgba(0,0,0,.6);
      color-scheme: dark;
      scrollbar-color: rgba(255,255,255,.14) transparent;
    }
    * { box-sizing: border-box; }
    svg { display: block; }
    :host([dark]) ::selection { background: color-mix(in srgb, var(--wa-accent) 45%, transparent); }
    /* The header sits on the page rather than on a bar of its own: no rule
       under it, no card behind it. What reads as chrome are the two white
       boxes in it, which is where the controls actually are. */
    header {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 0 12px;
      min-height: 54px;
      background: var(--wa-bg);
      color: var(--wa-ink);
      flex-wrap: wrap;
      position: relative;
      flex: none;
      z-index: 20;
    }
    /* The step from one header question to the next. The header reads left to
       right as a route: open the one you are on, or make one. Choosing the
       device used to be its own step here; it is inside the picker now, beside
       the list it decides. The arrow carries what is left of the route, so it
       is drawn in ink rather than in the hairline grey it used to wear, where
       it was all but invisible against the bar. */
    header .hstep { color: var(--wa-muted); display: grid; place-items: center; flex: none; margin: 0 2px; }
    header .hstep svg { width: 20px; height: 20px; display: block; }
    header .hor { font-size: 12px; color: var(--wa-muted); flex: none; margin: 0 2px; }
    header .spacer { flex: 1; }
    .toolbar { display: flex; gap: 6px; align-items: center; flex-wrap: wrap; }
    /* Two boxes, one shape: a white pill with a hairline ring, holding a run of
       quiet controls with 1px dividers between the groups inside it. */
    .hbox {
      display: inline-flex; align-items: center; gap: 8px; height: 34px; flex: none;
      border-radius: 9px; background: var(--wa-card); box-shadow: 0 0 0 1px var(--wa-line);
    }
    .hbox.hist { gap: 2px; padding: 0 3px; }
    .hbox.status { padding: 0 3px 0 10px; gap: 10px; max-width: 100%; }
    .hbox .hdiv { width: 1px; height: 18px; background: var(--wa-line); flex: none; }
    .hbox button.icon { width: 28px; height: 28px; }
    /* Buttons: one quiet shape everywhere, the accent fill kept for the single
       action that matters, and a soft ring on focus instead of a hard outline. */
    .toolbar button, button.primary, button.small, button.danger {
      font: inherit; font-size: 12.5px; font-weight: 600; padding: 0 11px; min-height: 30px; border-radius: 8px; cursor: pointer;
      border: 1px solid var(--wa-line); background: var(--wa-card); color: var(--wa-ink);
      transition: background-color .12s ease-out, border-color .12s ease-out, box-shadow .12s ease-out;
    }
    .toolbar button:hover:not(:disabled), button.small:hover:not(:disabled) { border-color: var(--wa-line-strong); background: var(--wa-panel); }
    .toolbar button:focus-visible, button.primary:focus-visible, button.small:focus-visible, button.danger:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .toolbar button:disabled, button:disabled { opacity: .45; cursor: default; }
    button.primary { background: var(--wa-primary-bg); color: var(--wa-primary-ink); border-color: transparent; font-weight: 600; }
    button.primary:hover:not(:disabled) { background: color-mix(in srgb, var(--wa-primary-bg) 85%, var(--wa-muted)); }
    /* The quiet third button: no fill, no ring, just muted words. */
    button.ghost {
      font: inherit; font-size: 12.5px; font-weight: 600; cursor: pointer;
      display: inline-flex; align-items: center; gap: 6px; padding: 0 9px; min-height: 26px; border-radius: 8px;
      background: transparent; border: 1px solid transparent; color: var(--wa-muted);
    }
    button.ghost:hover:not(:disabled) { background: var(--wa-panel); color: var(--wa-ink); }
    button.ghost:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    button.ghost.danger { color: var(--error-color, #b42318); background: transparent; border-color: transparent; }
    /* Save is the header's one call to action. It is quiet while there is
       nothing to save and lit, with the unsaved halo, once there is, so the
       button, the dirty dot and the footer line all say "unsaved" the same
       way. */
    header button.save { min-height: 28px; padding: 0 14px; }
    header button.save:not(.dirty) { background: var(--wa-panel); color: var(--wa-muted); border-color: transparent; }
    header button.save.dirty { box-shadow: 0 0 0 3px color-mix(in srgb, var(--warning-color, #e0a100) 35%, transparent); }
    button.danger { color: var(--error-color, #e5484d); border-color: color-mix(in srgb, var(--error-color, #e5484d) 45%, transparent); background: color-mix(in srgb, var(--error-color, #e5484d) 8%, transparent); }
    button.danger:hover:not(:disabled) { background: color-mix(in srgb, var(--error-color, #e5484d) 16%, transparent); border-color: var(--error-color, #e5484d); }
    button.small { padding: 0 9px; font-size: 12px; min-height: 26px; border-radius: 8px; }
    /* An icon and its words on one line. Without this the icon, drawn as a
       block, sits on a line of its own above the words. */
    button.small:has(> svg.ui-icon) { display: inline-flex; align-items: center; gap: 5px; }
    button.small > svg.ui-icon { width: 13px; height: 13px; flex: none; }
    /* An Extras switch whose layer is already on the chart: pressed, not greyed.
       Clicking it again takes the layer off. */
    .adders button.small.on, .adders button.small.on:disabled { display: inline-flex; align-items: center; gap: 5px; opacity: 1;
      color: var(--primary-color, #7c6cf0); border-color: color-mix(in srgb, var(--primary-color, #7c6cf0) 45%, transparent);
      background: color-mix(in srgb, var(--primary-color, #7c6cf0) 12%, transparent); }
    button.icon {
      font: inherit; border: none; background: none; cursor: pointer; color: var(--wa-muted);
      display: inline-flex; align-items: center; justify-content: center;
      width: 24px; height: 24px; padding: 0; border-radius: 6px; opacity: .8;
      transition: background-color .12s ease-out, opacity .12s ease-out;
    }
    button.icon:hover:not(:disabled) { opacity: 1; background: color-mix(in srgb, var(--wa-ink) 10%, transparent); }
    button.icon:focus-visible { opacity: 1; outline: none; box-shadow: var(--wa-ring); }
    button.icon.danger:hover:not(:disabled) { color: var(--error-color, #e5484d); background: color-mix(in srgb, var(--error-color, #e5484d) 14%, transparent); }
    svg.ui-icon { width: 15px; height: 15px; display: block; }
    .dirty-dot { display: inline-block; width: 8px; height: 8px; border-radius: 50%; flex: none; background: var(--warning-color, #e0a100); vertical-align: middle; box-shadow: 0 0 6px var(--warning-color, #e0a100); }
    .dirty-dot.clean { background: var(--success-color, #3dd68c); box-shadow: none; }
    .dirty-dot.none { background: var(--wa-line-strong); box-shadow: none; }

    /* Native controls: the same dark well, hairline and focus ring as the
       buttons, so a select in the header and a number field in the inspector
       read as one family. */
    select {
      font: inherit; font-size: 13px; font-weight: 500; color: var(--wa-ink); cursor: pointer; height: 30px;
      padding: 0 26px 0 10px; border-radius: 7px; border: 1px solid var(--wa-line); background-color: var(--wa-input);
      appearance: none; -webkit-appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%238d92a6' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
      background-repeat: no-repeat; background-position: right 8px center; background-size: 14px;
      transition: border-color .12s ease-out, box-shadow .12s ease-out;
    }
    select:hover:not(:disabled) { border-color: var(--wa-line-strong); }
    select:focus-visible { outline: none; border-color: var(--wa-accent); box-shadow: var(--wa-ring); }
    input[type=text], input[type=number], input[type=search], input[type=url], textarea {
      font: inherit; font-size: 13px; font-weight: 500; color: var(--wa-ink); min-height: 30px;
      padding: 5px 10px; border-radius: 7px; border: 1px solid var(--wa-line); background: var(--wa-input);
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
      width: 32px; height: 18px; border-radius: 999px; position: relative;
      background: color-mix(in srgb, var(--wa-ink) 16%, transparent); border: 0;
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
    .picker { position: relative; --wa-pk-art-h: 44px; }
    .picker > button {
      display: inline-flex; align-items: center; gap: 10px; font: inherit; font-size: 13px; font-weight: 700;
      height: 34px; padding: 0 10px 0 8px; border-radius: 9px; cursor: pointer; color: var(--wa-ink);
      border: 0; box-shadow: 0 0 0 1px var(--wa-line-strong); background: var(--wa-card); min-width: 250px; max-width: 380px;
      transition: box-shadow .12s ease-out, background-color .12s ease-out;
    }
    .picker > button:hover { box-shadow: 0 0 0 1px var(--wa-ink); }
    .picker > button:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .picker .pk-name { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; text-align: left; }
    .picker .pk-rev { color: var(--wa-muted); font-weight: 500; font-size: 12px; white-space: nowrap; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
    .picker > button svg { width: 16px; height: 16px; opacity: .7; }
    .picker .menu {
      position: absolute; top: calc(100% + 8px); left: 0; z-index: 50; width: 400px; max-height: 60vh; overflow: auto;
      background: var(--wa-card); color: var(--wa-ink); border: 1px solid var(--wa-line-strong);
      border-radius: var(--wa-r-md); box-shadow: var(--wa-shadow-pop); padding: 6px;
    }
    .picker .menu .row {
      display: flex; align-items: center; gap: 12px; width: 100%; text-align: left; font: inherit; font-size: 13.5px;
      background: transparent; border: 0; color: inherit; padding: 7px 10px; border-radius: 9px; cursor: pointer;
      min-height: calc(var(--wa-pk-art-h) + 14px);
    }
    .picker .menu .row:hover { background: var(--wa-panel); }
    .picker .menu .row[aria-current="true"] { background: color-mix(in srgb, var(--wa-accent) 18%, transparent); }
    .picker .menu .row.locked { opacity: .6; cursor: help; }
    .picker .menu .pk-note { font-size: 12.5px; line-height: 1.4; color: var(--wa-muted); padding: 0 10px 8px 122px; }
    .picker .menu .pk-badge { font-size: 12px; opacity: .7; white-space: nowrap; }
    /* A saved complication's row: the part that opens it, then its own hide
       and delete buttons, which neither open it nor shut the menu. */
    .picker .menu .row.rec { padding: 0; gap: 0; cursor: default; }
    .picker .menu .row.rec > .pick {
      display: flex; align-items: center; gap: 12px; flex: 1; min-width: 0; text-align: left; font: inherit;
      background: transparent; border: 0; color: inherit; padding: 7px 4px 7px 10px; border-radius: 9px; cursor: pointer;
      min-height: calc(var(--wa-pk-art-h) + 14px);
    }
    .picker .menu .row.rec > .pick:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .picker .menu .row.rec.dim > .pick { opacity: .5; }
    .picker .menu .pk-acts { display: flex; align-items: center; gap: 2px; flex: none; padding-right: 6px; }
    .picker .menu .pk-acts button.icon { width: 30px; height: 30px; }
    .picker .menu .pk-acts button.small { min-height: 24px; padding: 0 7px; }
    .picker .menu .pk-hidden-head {
      display: flex; align-items: center; gap: 6px; width: 100%; font: inherit; font-size: 12.5px; font-weight: 600;
      color: var(--wa-muted); background: transparent; border: 0; border-top: 1px solid var(--wa-line);
      margin-top: 6px; padding: 8px 10px 6px; cursor: pointer; text-align: left;
    }
    .picker .menu .pk-hidden-head:hover { color: var(--wa-ink); }
    .picker .menu .pk-hidden-head:focus-visible { outline: none; box-shadow: var(--wa-ring); border-radius: 6px; }
    .picker .menu .pk-hidden-head svg { width: 14px; height: 14px; transition: transform .12s ease-out; }
    .picker .menu .pk-hidden-head[aria-expanded="true"] svg { transform: rotate(90deg); }
    /* The row picture: the complication drawn as the watch draws it, in a
       fixed box so every name in the list still starts on the same column.
       Its height is the variable on .picker rather than a number here, because
       the rows holding it are buttons, and a button does not grow for a child
       taller than its own text: they have to take the same height as a
       min-height of their own, and the two must never drift apart. */
    .pk-art { width: 100px; height: var(--wa-pk-art-h); flex: none; display: grid; place-items: center; pointer-events: none; }
    .pk-art svg { display: block; max-width: 100%; max-height: var(--wa-pk-art-h); width: auto; height: auto; background: #000; border-radius: 5px; }
    .pk-art.circular svg { border-radius: 50%; }
    .pk-art.corner svg { background: #2c2c2e; }
    /* A Home Screen tile is rounded far harder than a lock screen slot, so its
       row picture takes the corner too, at the share of the box iOS uses. */
    .pk-art.small svg { border-radius: 16.3%; }
    .pk-art.medium svg { border-radius: 7.7% / 16.3%; }
    .pk-art.large svg { border-radius: 7.7% / 7.4%; }
    .pk-art.xlarge svg { border-radius: 7.7% / 4.8%; }
    .pk-art .inline-line {
      font-size: 11px; padding: 3px 8px; max-width: 100%; min-width: 0; display: inline-flex; align-items: center; gap: 4px;
      border-radius: 999px; background: #000; color: #fff; overflow: hidden; white-space: nowrap;
    }
    .pk-art .inline-line svg { background: transparent; border-radius: 0; }
    /* A control draws a Control Center tile, not a face, so the face rules on
       the picture's svg (a black card with rounded corners) must not reach the
       symbol inside it. */
    .pk-art.control-tile svg { background: transparent; border-radius: 0; max-height: none; }
    /* Shape filter, only drawn once the list is long. */
    .pk-filter { display: flex; gap: 4px; flex-wrap: wrap; padding: 4px 6px 8px; border-bottom: 1px solid var(--wa-line); margin-bottom: 6px; }
    .pk-chip {
      display: inline-flex; align-items: center; gap: 5px; font: inherit; font-size: 12.5px; font-weight: 500;
      padding: 5px 9px; border-radius: 999px; cursor: pointer; color: var(--wa-muted);
      border: 1px solid var(--wa-line); background: transparent;
    }
    .pk-chip:hover:not(:disabled) { border-color: var(--wa-line-strong); color: var(--wa-ink); }
    .pk-chip:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .pk-chip:disabled { opacity: .35; cursor: default; }
    .pk-chip.on { border-color: var(--wa-accent); color: var(--wa-ink); background: color-mix(in srgb, var(--wa-accent) 18%, transparent); }
    .pk-count { font-size: 11.5px; opacity: .65; font-weight: 400; }

    /* The picker's button, carrying both answers: the device in small type over
       the complication, so the bar says where you are without the header
       spending a second control and two labels on saying it. */
    .picker > button.pk-open { height: 46px; min-width: 292px; max-width: 400px; padding: 0 10px; gap: 9px; font-size: 14px; }
    .picker .pk-open-ico { flex: none; display: grid; place-items: center; color: var(--wa-muted); }
    .picker .pk-open-ico svg { width: 21px; height: 21px; opacity: 1; }
    .pk-open-lines { display: flex; flex-direction: column; align-items: stretch; flex: 1; min-width: 0; line-height: 1.25; }
    .pk-open-dev {
      font-size: 11.5px; font-weight: 500; color: var(--wa-muted); text-align: left;
      overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    }
    .pk-open-row { display: flex; align-items: baseline; gap: 6px; min-width: 0; }

    /* Two panes, one surface: devices on the left, that device's complications
       on the right. Only the panes scroll, so the shape filter and the New line
       stay put while a long list moves under them. */
    .picker .menu.two {
      width: min(900px, calc(100vw - 24px)); max-height: 74vh; padding: 0; overflow: hidden;
      display: grid; grid-template-columns: 268px minmax(0, 1fr);
    }
    /* On a phone-width panel there is no room beside the list, so the devices
       take a short scrolling strip above it instead of a column. */
    .picker .menu.two.narrow { grid-template-columns: minmax(0, 1fr); }
    .pk-devs { overflow: auto; padding: 8px; background: var(--wa-panel); border-right: 1px solid var(--wa-line); }
    .picker .menu.two.narrow .pk-devs { border-right: 0; border-bottom: 1px solid var(--wa-line); max-height: 172px; }
    .pk-dev-head {
      font-size: 11px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase;
      color: var(--wa-muted); padding: 9px 9px 5px;
    }
    .pk-dev {
      display: flex; align-items: center; gap: 10px; width: 100%; text-align: left; font: inherit; font-size: 13.5px;
      background: transparent; border: 0; color: inherit; padding: 8px 9px; border-radius: 9px; cursor: pointer;
    }
    .pk-dev:hover { background: var(--wa-card); }
    .pk-dev:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .pk-dev.on { background: color-mix(in srgb, var(--wa-accent) 18%, transparent); }
    .pk-dev-ico { flex: none; display: grid; place-items: center; color: var(--wa-muted); }
    .pk-dev-ico svg { width: 19px; height: 19px; }
    .pk-dev.on .pk-dev-ico { color: var(--wa-ink); }
    .pk-dev-meta { flex: 1; min-width: 0; display: flex; flex-direction: column; line-height: 1.25; }
    .pk-dev-name { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .pk-dev-note { font-size: 11.5px; color: var(--wa-muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    /* A device holding nothing stays in the list: it is still somewhere a new
       complication can go. It reads quiet so the ones with work on them lead. */
    .pk-dev.bare:not(.on) .pk-dev-name { color: var(--wa-muted); }
    .pk-dev-count {
      flex: none; font-size: 11.5px; color: var(--wa-muted); background: var(--wa-card);
      border-radius: 999px; padding: 2px 8px; min-width: 24px; text-align: center;
    }
    .pk-dev.on .pk-dev-count { color: var(--wa-ink); }
    .pk-comps { display: flex; flex-direction: column; min-width: 0; min-height: 0; }
    .pk-comps .pk-filter { margin-bottom: 0; padding: 10px 12px; }
    .pk-rows { flex: 1; min-height: 0; overflow: auto; padding: 8px; }
    .pk-foot {
      display: flex; align-items: center; gap: 8px; flex: none; padding: 10px 12px;
      border-top: 1px solid var(--wa-line); background: var(--wa-panel);
    }
    .pk-foot-hint { flex: 1; min-width: 0; font-size: 12.5px; color: var(--wa-muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

    /* New complication: its own button beside the list, because making one was
       a row buried under every complication that already existed. */
    .newc { position: relative; display: inline-flex; align-items: center; gap: 6px; }
    .new-btn {
      display: inline-flex; align-items: center; gap: 6px; font: inherit; font-size: 12.5px; font-weight: 600;
      height: 30px; padding: 0 11px; border-radius: 8px; cursor: pointer;
      border: 1px solid var(--wa-line); background: var(--wa-card); color: var(--wa-ink);
      transition: border-color .12s ease-out, background-color .12s ease-out;
    }
    /* The one way to start something from an empty panel, so it is filled
       rather than outlined: the header's other controls are all about a
       complication that already exists. */
    .new-btn.primary { border-color: transparent; background: var(--wa-primary-bg); color: var(--wa-primary-ink); }
    .new-btn.primary:hover:not(:disabled) { border-color: transparent; filter: brightness(1.1); }
    .new-btn:hover:not(:disabled) { border-color: var(--wa-line-strong); background: var(--wa-panel); }
    .new-btn:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .new-btn:disabled { opacity: .45; cursor: not-allowed; }
    .new-btn svg { width: 16px; height: 16px; }
    .newc-full { font-size: 11px; color: var(--wa-muted); white-space: nowrap; }

    /* The New complication dialog: name, shape, Create. In the middle of the
       window rather than hanging off the button, because it asks two questions
       and refuses until both are answered. */
    dialog.new-dialog {
      width: min(520px, calc(100vw - 32px)); padding: 0;
      border: 1px solid var(--wa-line); border-radius: 12px;
      background: var(--wa-card); color: var(--wa-ink);
      box-shadow: 0 12px 40px rgba(0,0,0,.4);
    }
    dialog.new-dialog::backdrop { background: rgba(0,0,0,.45); }
    .new-head { display: flex; align-items: center; gap: 8px; padding: 12px 12px 12px 18px; border-bottom: 1px solid var(--wa-line); }
    .new-head h2 { margin: 0; font-size: 15px; font-weight: 500; }
    .new-head .spacer { flex: 1; }
    /* Label over control here, not beside it: the inspector's two-column field
       gives a third of the row to a one-word label, and four shape cards need
       every pixel of a 430 px dialog. */
    .new-body .field { display: flex; flex-direction: column; align-items: stretch; gap: 5px; }
    .new-body .field > span { font-size: 11px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; }
    .new-body { padding: 14px 18px 4px; }
    .new-body .field.new-shapes { margin-top: 14px; }
    /* The running count sits opposite the buttons, so what Create is about to
       make is readable without moving the eye to the button itself. */
    .new-foot { display: flex; align-items: center; justify-content: flex-end; gap: 8px; padding: 14px 18px 16px; }
    .new-count { flex: 1; font-size: 12px; color: var(--wa-muted); }
    /* Auto-fit rather than four fixed columns: a watch owner has four shape
       cards and a phone owner up to seven, so the grid takes as many as the
       dialog's width allows and wraps the rest onto another row. */
    .shape-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(84px, 1fr)); gap: 8px; }
    /* The three place cards: where on the device this ends up. They behave as
       tabs, so leaving one keeps its picks, and its count says so. */
    .place-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(96px, 1fr)); gap: 9px; }
    .place-card {
      position: relative; display: flex; flex-direction: column; align-items: center; gap: 8px;
      cursor: pointer; font: inherit; font-size: 13px; padding: 12px 6px 10px; color: var(--wa-muted);
      border: 1px solid var(--wa-line); border-radius: 13px; background: var(--wa-raised);
      transition: border-color .12s ease-out, background-color .12s ease-out, color .12s ease-out;
    }
    .place-card:hover { border-color: var(--wa-line-strong); color: var(--wa-ink); }
    .place-card:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    /* Open, not picked: the card whose shapes the panel below is showing. A
       place with picks in it that is not open still says so with its count. */
    .place-card.open { border-color: var(--wa-accent); background: var(--wa-sel-bg); color: var(--wa-ink); }
    .place-card.has { color: var(--wa-ink); }
    .place-card .place-art { width: 46px; height: 84px; display: block; color: var(--wa-accent); }
    /* A watch is wider than it is tall. Left in the phone's tall slot the
       drawing shrinks to fit the width and lands half the size of the card. */
    .place-card .place-art.watch { width: 76px; height: 81px; }
    .place-card-name { font-weight: 600; color: var(--wa-ink); }
    .place-count {
      position: absolute; top: 7px; right: 7px; min-width: 18px; height: 18px; box-sizing: border-box;
      padding: 0 5px; display: flex; align-items: center; justify-content: center; border-radius: 9px;
      background: var(--wa-accent); color: var(--wa-accent-ink); font-size: 11px; font-weight: 700;
    }
    /* The open place's shapes, in a box tied to the card above by its accent
       edge, so the panel reads as that card's contents rather than a new
       question. */
    .pick-panel {
      margin-top: 12px; padding: 12px 12px 10px; border-radius: 13px;
      border: 1px solid var(--wa-sel-ring); background: var(--wa-sel-bg);
      display: flex; flex-direction: column; gap: 10px;
    }
    .pick-panel .hint { margin: 0; }
    /* Control Center's panel is the words alone: a tighter gap, because there
       is no grid of cards between the heading and the sentence. */
    .pick-panel.words { gap: 6px; }
    .pick-head { display: flex; align-items: baseline; gap: 8px; }
    .pick-title { flex: 1; font-size: 11px; font-weight: 600; letter-spacing: .05em; text-transform: uppercase; color: var(--wa-accent); }
    .pick-order { font-size: 11px; font-weight: 600; color: var(--wa-muted); }
    /* Not one of them starts picked. A tinted default reads as a
       recommendation, and the shape is the one thing about a complication
       that cannot be changed later without moving every layer. */
    .shape-card {
      position: relative; display: flex; flex-direction: column; align-items: center; gap: 6px; cursor: pointer;
      font: inherit; font-size: 11.5px; padding: 10px 4px 8px; color: var(--wa-muted);
      border: 1px solid var(--wa-line); border-radius: 10px; background: var(--wa-raised);
      transition: border-color .12s ease-out, background-color .12s ease-out, color .12s ease-out;
    }
    .shape-card:hover { border-color: var(--wa-line-strong); color: var(--wa-ink); }
    .shape-card:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .shape-card.on { border-color: var(--wa-accent); background: var(--wa-sel-bg); color: var(--wa-ink); }
    .shape-card .shape-art { width: 30px; height: 44px; display: block; }
    /* The watch art is wider than it is tall next to the phone's, because the
       crown and the button hang off its right edge. */
    .shape-card .shape-art.watch { width: 42px; height: 45px; }
    /* The tick on a picked card, and the empty ring that holds its place so
       nothing shifts when one is ticked. */
    .pick-tick {
      position: absolute; top: 6px; right: 6px; width: 16px; height: 16px; box-sizing: border-box;
      display: flex; align-items: center; justify-content: center; border-radius: 50%;
      background: var(--wa-accent); color: var(--wa-accent-ink);
    }
    .pick-tick svg { width: 10px; height: 10px; }
    .pick-tick.off { background: transparent; border: 1px solid var(--wa-line-strong); }
    .shape-card-name { font-weight: 600; }
    /* The condition under a shape's name: small, quiet, and on its own line, so
       "Extra Large" still reads as the name of the shape. */
    .shape-card-note { font-size: 10px; font-weight: 500; line-height: 1.25; opacity: .8; text-align: center; }
    /* A shape that is announced but not yet pickable: same card, dimmed, no
       hover lift, so it reads as a place in the row rather than a choice. */
    .shape-card.soon { opacity: .45; cursor: default; }
    .shape-card.soon:hover { border-color: var(--wa-line); color: var(--wa-muted); }
    .shape-dots { display: inline-flex; gap: 3px; align-items: center; flex: none; }
    .shape-dot { width: 14px; height: 10px; border-radius: 2px; background: currentColor; opacity: .3; display: inline-block; }
    .shape-dot.circular { width: 10px; border-radius: 50%; }
    .shape-dot.corner { width: 10px; border-radius: 0 6px 0 0; }
    .shape-dot.inline { width: 16px; height: 4px; }
    /* One dot per Home Screen tile, at the tile's own proportions, so a row of
       them reads as which sizes the complication draws. */
    .shape-dot.small { width: 10px; height: 10px; border-radius: 3px; }
    .shape-dot.medium { width: 16px; height: 8px; border-radius: 3px; }
    .shape-dot.large { width: 11px; height: 11px; border-radius: 3px; }
    .shape-dot.xlarge { width: 8px; height: 13px; border-radius: 3px; }
    .shape-dot.on { opacity: 1; }
    /* What stands in for the dots on a complication that is only a control. */
    .shape-none { font-size: 11px; opacity: .7; white-space: nowrap; flex: none; }

    /* Share, Post to online gallery and Import share one look: a head with a
       title and a close button, a body that scrolls between it and a foot
       that stays put, so a design with twenty entities still has its buttons
       on screen. Only the panel's own tokens, so both skins work. */
    dialog.xf {
      width: min(600px, calc(100vw - 32px)); max-height: calc(100vh - 40px); padding: 0;
      border: 1px solid var(--wa-line); border-radius: var(--wa-r-lg);
      background: var(--wa-card); color: var(--wa-ink);
      box-shadow: var(--wa-shadow-pop);
      display: flex; flex-direction: column;
    }
    dialog.xf::backdrop { background: rgba(0,0,0,.45); }
    /* Share stays open under the gallery dialog, so Back returns to it, but
       out of sight: one dialog and one dimmed backdrop at a time. */
    dialog.share-dialog.under { visibility: hidden; }
    dialog.share-dialog.under::backdrop { background: transparent; }
    .xf-head { display: flex; align-items: center; flex-wrap: wrap; gap: 8px 12px; padding: 12px 10px 12px 16px; border-bottom: 1px solid var(--wa-line); flex: none; }
    .xf-head .xf-t { flex: 1 1 180px; min-width: 0; display: flex; flex-direction: column; gap: 1px; }
    .xf-head h2 { margin: 0; font-size: 15px; font-weight: 650; line-height: 1.3; overflow-wrap: anywhere; }
    .xf-head .xf-t > span { font-size: 12px; color: var(--wa-muted); }
    .xf-head > button.icon { width: 30px; height: 30px; flex: none; }
    .xf-head > button.icon svg.ui-icon { width: 16px; height: 16px; }
    .xfer-body {
      padding: 16px; overflow: auto; flex: 1 1 auto; min-height: 0;
      display: flex; flex-direction: column; gap: 16px; container: xfer / inline-size;
    }
    .xfer-body > * { flex: none; }
    .xf-stack { display: flex; flex-direction: column; gap: 8px; min-width: 0; }
    .xf-label { font-size: 11px; text-transform: uppercase; letter-spacing: .07em; color: var(--wa-muted); font-weight: 600; display: flex; align-items: center; gap: 8px; }
    .xf-label .r { margin-left: auto; text-transform: none; letter-spacing: 0; font-weight: 500; }
    .xf-count { font-size: 11px; font-weight: 600; letter-spacing: 0; text-transform: none; line-height: 16px; padding: 0 6px; border-radius: 999px; background: var(--wa-field); color: var(--wa-muted); }
    .xf-f { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
    .xf-f > :is(input, textarea) { width: 100%; box-sizing: border-box; }
    .xf-sub { font-size: 12px; color: var(--wa-muted); overflow-wrap: anywhere; }
    .xf-lead { display: flex; gap: 10px; align-items: flex-start; font-size: 12.5px; line-height: 1.45; color: var(--wa-muted); }
    .xf-lead > svg.ui-icon { width: 16px; height: 16px; flex: none; margin-top: 1px; color: var(--wa-accent); }
    .xf-lead.warn > svg.ui-icon { color: var(--wa-val); }
    .xf-lead b { color: var(--wa-ink); font-weight: 600; }
    .xf-note { margin: 0; }
    .xf-galink { display: inline-flex; align-items: center; gap: 6px; align-self: flex-start; font-size: 13px; font-weight: 550; color: var(--wa-accent); text-decoration: none; }
    .xf-galink:hover { text-decoration: underline; }
    .xf-galink svg.ui-icon { width: 14px; height: 14px; }
    .xf-head .xf-galink { font-size: 12px; }
    /* The complication, drawn by the renderer on the black of a watch face.
       A spotlight inside the drawing picks out the layers being pointed at. */
    .xf-prev { display: grid; place-items: center; padding: 10px; border-radius: var(--wa-r-md); background: #000; border: 1px solid var(--wa-line); line-height: 0; }
    .xf-prev svg.complication { display: block; width: 100%; height: auto; max-height: 180px; }
    .xf-prev:is(.circular, .corner, .small) svg.complication { width: auto; height: 140px; max-width: 100%; }
    /* The two tall Home Screen tiles are given a height instead of a width, or
       a full-width Extra Large would be taller than the dialog. */
    .xf-prev:is(.large, .xlarge) svg.complication { width: auto; height: 180px; max-width: 100%; }
    .xf-prev.small svg.complication { border-radius: 16.3%; }
    .xf-prev.medium svg.complication { border-radius: 7.7% / 16.3%; }
    .xf-prev.large svg.complication { border-radius: 7.7% / 7.4%; }
    .xf-prev.xlarge svg.complication { border-radius: 7.7% / 4.8%; }
    .xf-prev .inline-line { line-height: 1.4; }
    .xf-prev-cap { display: flex; justify-content: space-between; flex-wrap: wrap; gap: 4px 8px; margin-top: 6px; font-size: 12px; color: var(--wa-muted); }
    .xf-prev-cap b { color: var(--wa-ink); font-weight: 600; }
    .seg.wide.xf-modes { height: 34px; padding: 3px; border-radius: 10px; }
    .seg.wide.xf-modes button { display: inline-flex; align-items: center; justify-content: center; gap: 6px; line-height: 1; font-size: 12.5px; font-weight: 600; border-radius: 7px; }
    .seg.wide.xf-modes button svg.ui-icon { width: 14px; height: 14px; flex: none; }
    .seg.xf-tabs { height: 30px; }
    .seg.xf-tabs button { display: inline-flex; align-items: center; gap: 6px; padding: 0 10px; font-size: 12px; }
    /* Rows of entities or uploads in one hairline box. */
    .xf-rows { border: 1px solid var(--wa-line); border-radius: var(--wa-r-md); overflow: hidden; }
    .xf-row { display: grid; grid-template-columns: 30px minmax(0, 1fr); gap: 10px; align-items: start; padding: 10px 12px; transition: background-color .12s ease-out; }
    .xf-row + .xf-row { border-top: 1px solid var(--wa-line); }
    .xf-row.on { background: var(--wa-sel-bg); }
    .xf-row .ent-ico.xf-dom { background: var(--wa-ent-bg); color: var(--wa-ent); margin-top: 1px; }
    .xf-main { min-width: 0; display: flex; flex-direction: column; gap: 5px; }
    .xf-main > input[type=text] { width: 100%; box-sizing: border-box; }
    .xf-uses { display: flex; flex-wrap: wrap; gap: 6px; }
    .xf-use { display: inline-flex; align-items: center; gap: 6px; max-width: 100%; font-size: 12px; padding: 2px 8px 2px 2px; border-radius: 7px; border: 1px solid var(--wa-line); background: var(--wa-raised); }
    .xf-use .xf-lt { width: 34px; height: 20px; flex: none; border-radius: 4px; overflow: hidden; background: #000; line-height: 0; }
    .xf-use .xf-lt svg { display: block; }
    .xf-use .xf-ln { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .xf-use em { font-style: normal; color: var(--wa-muted); flex: none; }
    .xf-name { font-weight: 600; display: flex; align-items: center; gap: 6px; overflow-wrap: anywhere; }
    .xf-done { color: var(--wa-ent); display: inline-flex; }
    .xf-done svg.ui-icon { width: 14px; height: 14px; }
    /* The entity search under its row, the row's name standing in for its label. */
    .xf-picker .entity-field { display: block; padding: 0; }
    .xf-picker .entity-field > span:first-child { display: none; }
    /* Share's ways out, as tiles: the one that fits the mode is lit. */
    .xf-acts { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
    .xf-act {
      font: inherit; color: inherit; text-align: left; cursor: pointer;
      display: flex; flex-direction: column; gap: 6px; padding: 12px; min-width: 0;
      border: 1px solid var(--wa-line); border-radius: var(--wa-r-md); background: var(--wa-raised);
      transition: border-color .12s ease-out, background-color .12s ease-out;
    }
    .xf-act:hover:not(:disabled) { border-color: var(--wa-line-strong); }
    .xf-act:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .xf-act b { font-weight: 600; font-size: 13px; }
    .xf-act > span:last-child { font-size: 12px; color: var(--wa-muted); }
    .xf-act .ic { width: 30px; height: 30px; border-radius: 8px; display: grid; place-items: center; background: var(--wa-field); }
    .xf-act .ic svg.ui-icon { width: 16px; height: 16px; }
    .xf-act.main { background: var(--wa-sel-bg); border-color: var(--wa-sel-ring); }
    .xf-act.main .ic { background: var(--wa-primary-bg); color: var(--wa-primary-ink); }
    .xf-act.flash { border-color: var(--wa-ent); }
    .xf-act.flash .ic { background: var(--wa-ent-bg); color: var(--wa-ent); }
    .xf-act:disabled { opacity: .45; cursor: not-allowed; }
    .xf-raw > summary { cursor: pointer; list-style: none; display: inline-flex; align-items: center; gap: 6px; font-size: 13px; color: var(--wa-muted); }
    .xf-raw > summary::-webkit-details-marker { display: none; }
    .xf-raw > summary:hover { color: var(--wa-ink); }
    .xf-raw > summary:focus-visible { outline: none; box-shadow: var(--wa-ring); border-radius: 6px; }
    .xf-raw > summary svg.ui-icon { width: 13px; height: 13px; transition: transform .15s ease-out; }
    .xf-raw[open] > summary svg.ui-icon { transform: rotate(90deg); }

    /* Parts: the library as a grid of pictures, each card its own picture,
       name and two actions. The same dialog chrome as Share and Import, so
       only the grid is new. */
    .pt-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 10px; }
    .pt-card {
      display: flex; flex-direction: column; gap: 6px; padding: 8px; min-width: 0;
      border: 1px solid var(--wa-line); border-radius: var(--wa-r-md); background: var(--wa-raised);
    }
    .pt-card.asking { border-color: var(--wa-line-strong); }
    .pt-pick {
      font: inherit; color: inherit; text-align: left; cursor: pointer; min-width: 0;
      display: flex; flex-direction: column; gap: 6px; padding: 0; border: 0; background: none;
    }
    .pt-pick:disabled { opacity: .5; cursor: not-allowed; }
    .pt-pick:focus-visible { outline: none; box-shadow: var(--wa-ring); border-radius: var(--wa-r-sm); }
    .pt-thumb { display: grid; place-items: center; height: 74px; padding: 6px; border-radius: var(--wa-r-sm); background: #000; border: 1px solid var(--wa-line); line-height: 0; }
    .pt-thumb svg.complication { display: block; max-width: 100%; max-height: 100%; width: auto; height: 100%; }
    .pt-name { font-size: 13px; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .pt-sub { font-size: 11.5px; color: var(--wa-muted); }
    .pt-acts { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; }
    .pt-ask { font-size: 11.5px; color: var(--wa-muted); }
    .pt-rename { width: 100%; box-sizing: border-box; }
    .xf-raw > .xfer-text { margin-top: 8px; }
    .xf-raw > button.link { margin-top: 6px; font-size: 12.5px; font-weight: 600; }
    /* The gallery's steps. */
    .xf-steps { display: flex; gap: 4px 16px; padding: 0 16px; border-bottom: 1px solid var(--wa-line); overflow-x: auto; flex: none; }
    .xf-step {
      font: inherit; font-size: 12.5px; font-weight: 600; color: var(--wa-muted); background: none; border: 0;
      border-bottom: 2px solid transparent; margin-bottom: -1px; padding: 10px 2px;
      display: inline-flex; align-items: center; gap: 8px; white-space: nowrap; cursor: pointer;
    }
    .xf-step i { font-style: normal; width: 20px; height: 20px; border-radius: 50%; display: grid; place-items: center; font-size: 11px; background: var(--wa-field); font-variant-numeric: tabular-nums; }
    .xf-step i svg.ui-icon { width: 12px; height: 12px; }
    .xf-step[aria-current="step"] { color: var(--wa-ink); border-bottom-color: var(--wa-accent); }
    .xf-step[aria-current="step"] i { background: var(--wa-accent); color: var(--wa-accent-ink); }
    .xf-step.past i { background: var(--wa-ent-bg); color: var(--wa-ent); }
    .xf-step:focus-visible { outline: none; box-shadow: var(--wa-ring); border-radius: 6px; }
    .xf-step:disabled { cursor: not-allowed; }
    .xf-two { display: grid; grid-template-columns: minmax(0, 1fr) 190px; gap: 16px; align-items: start; }
    .xf-form { gap: 14px; }
    .xf-caption { font-size: 11px; color: var(--wa-muted); text-align: center; margin-top: 6px; }
    .xf-gcard { border: 1px solid var(--wa-line); border-radius: var(--wa-r-md); overflow: hidden; background: var(--wa-raised); }
    .xf-gcard .img { aspect-ratio: 4 / 3; max-width: 100%; display: grid; place-items: center; padding: 10px; box-sizing: border-box; background: #000; }
    .xf-gcard .img img { max-width: 100%; max-height: 100%; display: block; }
    .xf-gcard .img .hint { margin: 0; color: #a0a0a8; }
    .xf-gcard .meta { padding: 10px; display: grid; gap: 3px; }
    .xf-gcard .meta b { font-size: 13px; overflow-wrap: anywhere; }
    .xf-gcard .meta > span { font-size: 12px; color: var(--wa-muted); overflow-wrap: anywhere; }
    .xf-gcard .tg { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 3px; }
    .xf-gcard .tg em { font-style: normal; font-size: 10.5px; padding: 1px 6px; border-radius: 999px; background: var(--wa-field); color: var(--wa-muted); }
    .gal-tags { display: flex; flex-wrap: wrap; gap: 6px; }
    .xf-blockers { margin: 0; padding: 8px 12px 8px 28px; border-radius: var(--wa-r-sm); font-size: 12.5px; line-height: 1.45; color: var(--error-color, #db4437); background: color-mix(in srgb, var(--error-color, #db4437) 10%, transparent); }
    div.xf-blockers { padding-left: 12px; }
    .xf-banner { display: flex; gap: 10px; align-items: flex-start; padding: 10px 12px; border-radius: var(--wa-r-md); background: var(--wa-sel-bg); border: 1px solid var(--wa-sel-ring); font-size: 12.5px; line-height: 1.45; }
    .xf-banner svg.ui-icon { width: 16px; height: 16px; flex: none; margin-top: 1px; color: var(--wa-accent); }
    /* What becomes public, in amber: the thing to read before sending. */
    .xf-pub { display: grid; gap: 4px; padding: 8px; border-radius: var(--wa-r-md); background: var(--wa-val-bg); border: 1px solid color-mix(in srgb, var(--wa-val) 40%, var(--wa-line)); }
    .xf-pub .kv { display: grid; grid-template-columns: 120px minmax(0, 1fr); gap: 8px; align-items: start; padding: 6px; border-radius: 8px; transition: background-color .12s ease-out; }
    .xf-pub .kv.on { background: var(--wa-sel-bg); }
    .xf-sec { --sc: var(--wa-accent); display: flex; flex-direction: column; gap: 10px; min-width: 0; padding: 12px; border-radius: var(--wa-r-md);
      background: color-mix(in srgb, var(--sc) 7%, var(--wa-card)); border: 1px solid color-mix(in srgb, var(--sc) 34%, var(--wa-line)); }
    .xf-sec.s-shapes { --sc: #26a69a; }
    .xf-sec.s-names { --sc: var(--wa-val); }
    .xf-sec.s-send { --sc: #4a7fe8; }
    .xf-sec > h3 { display: flex; align-items: center; gap: 8px; margin: 0; font-size: 13px; font-weight: 600; color: var(--wa-ink); }
    .xf-sec > h3 > i { display: inline-grid; place-items: center; flex: none; width: 20px; height: 20px; border-radius: 999px;
      font-style: normal; font-size: 11px; font-weight: 700; color: #fff; background: var(--sc); }
    .xf-sec.s-names > h3 > i { color: var(--wa-card); }
    .xf-sec > h3 .r { margin-left: auto; display: inline-flex; align-items: center; gap: 10px; font-size: 12px; font-weight: 500; color: var(--wa-muted); }
    .xf-sec-b { display: flex; flex-direction: column; gap: 10px; min-width: 0; }
    .xf-sec.locked > .xf-sec-b { opacity: .45; }
    .xf-sec.s-names .xf-pub { background: var(--wa-card); }
    .xf-shapes .pk-chip { display: inline-flex; align-items: center; gap: 4px; }
    .xf-shapes .pk-chip svg.ui-icon { width: 12px; height: 12px; }
    .xf-pub .kv > .k { font-size: 12px; color: var(--wa-muted); padding-top: 6px; }
    .xf-pub .kv > .v { min-width: 0; display: flex; flex-direction: column; gap: 5px; }
    .xf-pub input[type=text] { width: 100%; box-sizing: border-box; background: var(--wa-card); }
    .xf-pill { font-size: 12px; padding: 5px 8px; border-radius: 6px; background: var(--wa-card); border: 1px solid var(--wa-line); overflow-wrap: anywhere; white-space: pre-wrap; }
    .xf-pill.mono { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
    .xf-checks { display: grid; gap: 6px; }
    .xf-checks > div { display: flex; align-items: center; gap: 8px; font-size: 13px; }
    .xf-checks svg.ui-icon { width: 15px; height: 15px; flex: none; color: var(--wa-ent); }
    .xf-done { display: grid; justify-items: center; text-align: center; gap: 8px; padding: 24px 8px; }
    .xf-done .big { width: 52px; height: 52px; border-radius: 50%; display: grid; place-items: center; background: var(--wa-ent-bg); color: var(--wa-ent); }
    .xf-done .big svg.ui-icon { width: 24px; height: 24px; }
    .xf-done b { font-size: 16px; }
    .xf-done p { margin: 0; max-width: 38ch; color: var(--wa-muted); font-size: 13px; }
    .xf-done .btns { display: flex; gap: 8px; margin-top: 6px; }
    /* My uploads: a picture, the title and its state, and what can be done. A
       new version still in review hangs under the upload it replaces. */
    .xf-up { display: grid; grid-template-columns: 44px minmax(0, 1fr) auto; gap: 8px 12px; align-items: center; padding: 10px 12px; }
    .xf-up + .xf-up { border-top: 1px solid var(--wa-line); }
    .xf-up-thumb { width: 44px; height: 44px; border-radius: 10px; background: #000; overflow: hidden; display: grid; place-items: center; }
    .xf-up-thumb img { max-width: 100%; max-height: 100%; display: block; }
    .xf-up-t { display: flex; align-items: center; flex-wrap: wrap; gap: 4px 8px; }
    .xf-up-t b { font-weight: 600; font-size: 13px; overflow-wrap: anywhere; }
    .xf-up .sub { font-size: 12px; color: var(--wa-muted); overflow-wrap: anywhere; }
    .xf-up-acts { display: flex; align-items: center; gap: 4px; flex-wrap: wrap; justify-content: flex-end; }
    .xf-up-v { grid-column: 2 / -1; display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 8px; align-items: center; padding: 2px 0 2px 10px; border-left: 2px solid var(--wa-line-strong); }
    .gal-status { font-size: 11px; font-weight: 600; line-height: 18px; padding: 0 8px; border-radius: 999px; white-space: nowrap; color: var(--wa-muted); background: var(--wa-field); }
    .gal-status.approved { color: var(--wa-ent); background: var(--wa-ent-bg); }
    .gal-status.pending { color: var(--wa-val); background: var(--wa-val-bg); }
    .gal-status.rejected { color: var(--error-color, #db4437); background: color-mix(in srgb, var(--error-color, #db4437) 12%, transparent); }
    /* History: one row per earlier save, the picked one lit. A button rather
       than a div, so the keyboard walks the list the way it walks any list. */
    .hs-rows { max-height: 260px; overflow: auto; }
    button.hs-row { font: inherit; color: inherit; text-align: left; width: 100%; box-sizing: border-box; border: 0; background: none; cursor: pointer; align-items: center; }
    button.hs-row:hover { background: var(--wa-raised); }
    button.hs-row.on { background: var(--wa-sel-bg); }
    button.hs-row:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .hs-rev { display: grid; place-items: center; width: 30px; height: 24px; border-radius: 7px; font-size: 12px; font-weight: 650; font-variant-numeric: tabular-nums; background: var(--wa-field); color: var(--wa-muted); }
    button.hs-row.on .hs-rev { background: var(--wa-accent); color: var(--wa-accent-ink); }
    /* Import: one dashed drop area until something is loaded. */
    .xf-drop { display: grid; justify-items: center; gap: 10px; padding: 28px 16px; text-align: center; border: 1.5px dashed var(--wa-line-strong); border-radius: var(--wa-r-lg); transition: border-color .15s ease-out, background-color .15s ease-out; }
    .xf-drop.over { border-color: var(--wa-accent); background: var(--wa-sel-bg); }
    .xf-drop .big { width: 48px; height: 48px; border-radius: 14px; display: grid; place-items: center; background: var(--wa-sel-bg); color: var(--wa-accent); }
    .xf-drop .big svg.ui-icon { width: 22px; height: 22px; }
    .xf-drop b { font-size: 15px; }
    .xf-drop p { margin: 0; font-size: 13px; color: var(--wa-muted); }
    .xf-drop .btns { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; margin-top: 4px; }
    dialog.xf kbd { font: 11px ui-monospace, SFMono-Regular, Menlo, monospace; padding: 0 5px; border: 1px solid var(--wa-line-strong); border-bottom-width: 2px; border-radius: 5px; }
    button.link.xf-type { align-self: center; font-size: 13px; font-weight: 550; }
    .xf-galtile { display: flex; align-items: center; gap: 12px; padding: 12px; color: inherit; text-decoration: none; border: 1px solid var(--wa-line); border-radius: var(--wa-r-md); background: var(--wa-raised); }
    .xf-galtile:hover { border-color: var(--wa-line-strong); }
    .xf-galtile:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .xf-galtile .ic { width: 34px; height: 34px; border-radius: 10px; display: grid; place-items: center; background: var(--wa-sel-bg); color: var(--wa-accent); flex: none; }
    .xf-galtile svg.ui-icon { width: 16px; height: 16px; flex: none; }
    .xf-galtile .t { flex: 1; min-width: 0; display: flex; flex-direction: column; }
    .xf-galtile .t b { font-weight: 600; }
    .xf-galtile .t span { font-size: 12px; color: var(--wa-muted); }
    .xf-hero { display: grid; grid-template-columns: minmax(0, 220px) minmax(0, 1fr); gap: 16px; align-items: center; }
    .xf-bar { height: 6px; border-radius: 999px; background: var(--wa-field); overflow: hidden; }
    .xf-bar > i { display: block; height: 100%; background: var(--wa-accent); transition: width .2s ease-out; }
    button.primary:has(> svg.ui-icon) { display: inline-flex; align-items: center; gap: 6px; }
    button.primary > svg.ui-icon { width: 14px; height: 14px; }
    /* The document itself. Monospace and never wrapped: a wrapped line reads as
       a line break that is not in the text, and this text gets pasted. */
    .xfer-text {
      display: block; width: 100%; box-sizing: border-box; resize: vertical; white-space: pre; overflow: auto;
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 12px; line-height: 1.45;
      border-color: transparent; border-radius: 7px; background: var(--wa-field);
    }
    .xfer-problem { white-space: pre-line; margin: 0; }
    .xfer-link { width: 100%; box-sizing: border-box; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 12px; }
    /* The whole dialog is the drop target, lit while a file is over it. */
    dialog.import-dialog.dropping { border-color: var(--wa-accent); box-shadow: 0 0 0 2px var(--wa-accent), 0 12px 40px rgba(0,0,0,.4); }
    .xfer-drop {
      position: absolute; inset: 0; display: grid; place-items: center; pointer-events: none; border-radius: 12px;
      background: color-mix(in srgb, var(--wa-accent) 16%, transparent); font-size: 14px; font-weight: 600;
    }
    .xfer-drop span { padding: 8px 14px; border-radius: 8px; background: var(--wa-card); }
    .link-note { margin: 4px 12px 0; display: flex; align-items: center; gap: 10px; }
    .xfer-foot { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; padding: 12px 16px; border-top: 1px solid var(--wa-line); flex: none; }
    .xfer-foot .spacer { flex: 1; }
    /* A narrow dialog stacks: the tiles, the card beside the form, the preview
       beside the name, and each public row's name over its text. */
    @container xfer (max-width: 480px) {
      .xf-acts, .xf-two, .xf-hero { grid-template-columns: minmax(0, 1fr); }
      .xf-pub .kv { grid-template-columns: minmax(0, 1fr); gap: 4px; }
      .xf-pub .kv > .k { padding-top: 0; }
      .xf-up { grid-template-columns: 44px minmax(0, 1fr); }
      .xf-up-acts { grid-column: 2; justify-content: flex-start; }
      .xf-up-v { grid-column: 1 / -1; }
    }
    @media (prefers-reduced-motion: reduce) {
      dialog.xf *, dialog.xf *::after { transition: none !important; }
    }

    /* Three columns with a draggable gutter between each pair. The side widths
       come in as custom properties already fitted to the measured panel width
       (see columnFit), and every track can shrink to zero here, so the grid
       itself can never be wider than the panel and clip a column. */
    .layout {
      display: grid;
      grid-template-columns: var(--wa-left, 300px) 8px minmax(0, 1fr) 8px var(--wa-right, 360px);
      column-gap: 8px;
      row-gap: 8px;
      padding: 4px 12px 10px;
      /* The editor is exactly one viewport tall: the grid takes whatever the
         header and the footer leave, and each column scrolls inside it. A long
         inspector used to stretch the page, which pushed the two lists under
         the canvas below the fold in every other column. */
      flex: 1 1 0;
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
      grid-template-columns: var(--wa-left, 300px) 8px minmax(0, 1fr);
      overflow: auto;
    }
    .layout.cols-2 > .column.inspector { grid-column: 1 / -1; }
    .layout.cols-2 > .gutter.right { display: none; }
    .layout.cols-1 { grid-template-columns: minmax(0, 1fr); overflow: auto; }
    .layout.cols-1 > .column { grid-column: auto; }
    .layout.cols-1 > .gutter { display: none; }
    .column { min-height: 0; overflow-y: auto; overflow-x: hidden; scrollbar-width: thin; scrollbar-gutter: stable; }
    /* A scroll box says when there is more behind its edges: a short fade in
       the box's own ground, drawn by a sticky pseudo-element that cancels its
       own height with a negative margin, so nothing shifts when it appears.
       The attributes are set by the ScrollFades helper on scroll and on
       resize; in the stacked modes the boxes never scroll, so they never
       arrive and the fades never draw. */
    .column.inspector { --wa-fade: var(--wa-card); --wa-fade-gap: 0px; }
    .layers { --wa-fade: var(--wa-card); --wa-fade-gap: 2px; }
    .column.canvas { --wa-fade: var(--wa-bg); --wa-fade-gap: 8px; }
    .column.inspector::before, .column.inspector::after,
    .layers::before, .layers::after,
    .column.canvas::before, .column.canvas::after {
      content: ""; display: block; flex: none; height: 0; z-index: 4; pointer-events: none;
    }
    .column.inspector::before, .layers::before, .column.canvas::before {
      position: sticky; top: 0; margin-bottom: calc(-1 * var(--wa-fade-gap));
    }
    .column.inspector::after, .layers::after, .column.canvas::after {
      position: sticky; bottom: 0; margin-top: calc(-1 * var(--wa-fade-gap));
    }
    [data-more-above]::before {
      height: 28px; margin-bottom: calc(-28px - var(--wa-fade-gap));
      background: linear-gradient(to bottom, var(--wa-fade), transparent);
    }
    [data-more-below]::after {
      height: 28px; margin-top: calc(-28px - var(--wa-fade-gap));
      background: linear-gradient(to top, var(--wa-fade), transparent);
    }
    /* Stacked, the whole layout scrolls as one page again, so a column that
       owns its own scrollbar in three columns must give it up here. */
    .layout.cols-1 .column.left, .layout.cols-1 .column.canvas, .layout.cols-1 .column.inspector,
    .layout.cols-2 .column.inspector { overflow: visible; min-height: auto; }
    .layout.cols-1 .column.left .card.layers-card { flex: none; }
    .layout.cols-1 .layers { overflow: visible; }
    /* One card shape everywhere: white paper, a 12px corner, and a hairline
       drawn as a ring rather than a border, so nothing inside has to account
       for a border box. */
    .card {
      background: var(--wa-card);
      border: 0;
      border-radius: var(--wa-r-md);
      box-shadow: 0 0 0 1px var(--wa-line);
      padding: 10px 12px 12px;
    }
    /* The left column does not scroll: the Add card keeps its natural height
       and the Layers card takes the rest, scrolling its own rows. The shape
       row follows the last layer, and stays in sight once the rows scroll. */
    .column.left { display: flex; flex-direction: column; gap: 8px; overflow: hidden; }
    .column.left .card { flex: none; }
    .column.left .card.layers-card {
      flex: 1 1 auto; min-height: 0; display: flex; flex-direction: column; padding: 10px 8px 8px;
      --thumb-w: ${THUMB_W}px; --thumb-h: ${THUMB_H}px;
      container: layers / inline-size;
    }
    /* Card titles read as titles: sentence case, a little heavier, the ink
       colour. Their side notes stay small and muted. */
    .panel-title {
      display: flex; align-items: center; gap: 8px; margin: 0 0 10px; min-height: 30px;
      font-size: 13.5px; font-weight: 700; letter-spacing: 0; color: var(--wa-ink);
    }
    .panel-title .spacer { flex: 1; }
    .panel-title .mini { font-weight: 500; font-size: 12px; color: var(--wa-muted); letter-spacing: 0; }
    .panel-title button.small { font-weight: 600; letter-spacing: 0; }

    /* Status and the raw document: one line at the foot of the panel, shut by
       default, saying only whether the work is saved. */
    details.foot { flex: none; border-top: 1px solid var(--wa-line); background: var(--wa-raised); }
    details.foot > summary { display: flex; align-items: center; gap: 10px; min-height: 34px; padding: 0 24px; font-size: 12.5px; cursor: pointer; list-style: none; color: var(--wa-muted); }
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

    /* Add a layer: one tinted card per kind, each carrying a sample of what
       that kind draws, then the presets. It sits above the list so adding a
       layer never moves the button just pressed.

       The sample sits on the same black well the Layers list uses for its
       thumbnails, so "what a gauge looks like" is answered by the same picture
       in both places and the button reads as a watch face rather than a
       swatch. */
    /* A card whose whole title bar is the fold handle. Shut, the title keeps
       its own margin off the body it no longer has, so the card is one line. */
    .card.fold .fold-h { cursor: pointer; border-radius: var(--wa-r-sm); margin: -4px -6px 8px; padding: 4px 6px; user-select: none; }
    .card.fold[data-open="false"] .fold-h { margin-bottom: -4px; }
    .card.fold .fold-h:hover { background: var(--wa-panel); }
    .card.fold .fold-h:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .card.fold .fold-h .chev { color: var(--wa-muted); flex: none; display: grid; place-items: center; transition: transform .15s ease-out; }
    .card.fold .fold-h .chev svg { width: 16px; height: 16px; }
    .card.fold[data-open="true"] .fold-h .chev { transform: rotate(180deg); }

    /* Two across, not three: the sample is the whole point of the expanded
       buttons, and at a third of the column it was too small to tell a gauge
       from a chart without reading the name under it. */
    .add-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 6px; }
    /* Compact: the samples go and every button becomes one 34px line, a colour
       chip and a name, so eight kinds take four short rows. */
    .add-grid.lean button.add {
      flex-direction: row; align-items: center; gap: 8px; height: 34px; padding: 0 10px; border-radius: 8px;
      background: var(--wa-card); border-color: var(--wa-line);
    }
    .add-grid.lean button.add .add-name { justify-content: flex-start; gap: 8px; }
    /* The colour chip: the same square that marks the kind in the Layers rows
       and the inspector, at the size a button can spare. */
    button.add .k { width: 8px; height: 8px; border-radius: 2px; background: var(--k); flex: none; }
    button.add {
      display: flex; flex-direction: column; align-items: stretch; gap: 7px; padding: 7px 7px 8px; border-radius: 10px;
      font: inherit; font-size: 12.5px; font-weight: 600; cursor: pointer; color: var(--wa-ink); white-space: nowrap;
      background: color-mix(in srgb, var(--k) 10%, var(--wa-card)); border: 1px solid color-mix(in srgb, var(--k) 28%, transparent);
      transition: background-color .12s ease-out, border-color .12s ease-out, transform .12s ease-out, box-shadow .12s ease-out;
    }
    button.add:hover:not(:disabled) {
      background: color-mix(in srgb, var(--k) 18%, var(--wa-card)); border-color: color-mix(in srgb, var(--k) 55%, transparent);
    }
    button.add:active:not(:disabled) { transform: translateY(1px); }
    button.add:focus-visible { outline: none; box-shadow: 0 0 0 3px color-mix(in srgb, var(--k) 30%, transparent); }
    button.add:disabled { opacity: .45; cursor: default; }
    /* The well is a fixed shape, not a fixed height: the column is whatever a
       third of the panel happens to be, and the samples are drawn to scale
       with it. */
    button.add .well {
      display: block; width: 100%; aspect-ratio: 120 / 46; border-radius: 7px; overflow: hidden;
      background: #000; border: 1px solid color-mix(in srgb, var(--k) 30%, var(--wa-line-strong));
      box-sizing: border-box;
    }
    button.add svg.shot { display: block; width: 100%; height: 100%; }
    button.add .add-name { display: flex; align-items: center; justify-content: center; gap: 6px; }
    button.add svg.ui-icon { color: var(--k); width: 14px; height: 14px; flex: none; }
    /* The presets are one wrapped row under the kinds, opened by a label
       rather than a sentence: they are a shortcut, not a second offer. */
    .presets { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; margin-top: 10px; }
    .presets-l {
      margin-right: 4px; font-size: 11px; font-weight: 700; letter-spacing: .08em;
      text-transform: uppercase; color: var(--wa-muted);
    }
    button.preset {
      font: inherit; font-size: 12px; font-weight: 600; height: 26px; padding: 0 10px; border-radius: 999px; cursor: pointer;
      border: 0; background: var(--wa-panel); color: color-mix(in srgb, var(--wa-ink) 78%, var(--wa-muted));
      transition: color .12s ease-out, background-color .12s ease-out;
    }
    button.preset:hover:not(:disabled) { color: var(--wa-ink); background: color-mix(in srgb, var(--wa-ink) 10%, var(--wa-panel)); }

    /* Layers: one row per layer, coloured by kind, the shape pinned last.
       The picture size is a variable on the list, set by the S/M/L control in
       the card's title bar, so one change resizes every row's picture and the
       column that holds it. */
    /* Only as tall as its rows, so the shape row sits right under the last
       layer; it shrinks and scrolls once the card runs out of room. */
    .layers {
      display: flex; flex-direction: column; gap: 2px; flex: 0 1 auto; min-height: 0;
      overflow-y: auto; overflow-x: hidden; scrollbar-width: thin;
    }
    /* A row is a line of a list, not a card: no outline at rest, and the eye
       finds the selection by its wash rather than by counting borders. */
    .layer {
      display: grid; grid-template-columns: 16px 3px var(--thumb-w) minmax(0, 1fr) auto; align-items: center; gap: 8px;
      min-height: 46px; padding: 0 6px 0 4px; border-radius: var(--wa-r-sm);
      /* The list is a scrolling flex column: without this, expanded rows
         shrink to their minimum and their lines pile on top of each other. */
      flex: none;
      border: 0 solid transparent; background: transparent; background-clip: padding-box;
      cursor: pointer; user-select: none; position: relative; font-size: 13px;
      transition: background-color .12s ease-out, box-shadow .12s ease-out,
        border-top-width .1s ease-out, border-bottom-width .1s ease-out;
    }
    /* A group's members keep a faint ground of their own, so they read as
       nested rather than as another run of top-level rows. */
    .layer.kid { background: color-mix(in srgb, var(--wa-panel) 55%, transparent); }
    .layer:hover { background: var(--wa-panel); }
    /* The selected row: one cool wash and a ring, the same one wherever a row
       is selected, so eight kind colours never fight the selection. */
    .layer.hl { background: var(--wa-sel-bg); box-shadow: inset 0 0 0 1px var(--wa-sel-ring); }
    .layer:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .layer.pick { box-shadow: inset 0 0 0 2px var(--wa-accent); }
    .layer.lit { background: var(--wa-sel-bg); box-shadow: inset 0 0 0 2px var(--wa-accent); }
    /* A member of the selected group: lit in the folder's colour, without
       the selected row's ring, so the group reads as one block. */
    .layer.held { background: color-mix(in srgb, ${unsafeCSS(SECTION_COLOR.group)} 12%, var(--wa-panel)); }
    .layer .grip { color: var(--wa-line-strong); display: grid; place-items: center; cursor: grab; }
    .layer:hover .grip { color: var(--wa-muted); }
    .layer .grip svg { width: 15px; height: 15px; }
    .layer .bar { width: 3px; height: 26px; border-radius: 2px; background: var(--k); }
    /* The layer's own picture, cropped to it, on the black face. The rounded
       black well is the picture's frame, so an empty thumb still reads as a
       slot rather than a hole. */
    .layer .thumb {
      width: var(--thumb-w); height: var(--thumb-h); border-radius: 4px; overflow: hidden; flex: none;
      background: #000; border: 0; box-sizing: border-box; display: block;
    }
    .layer .thumb svg { display: block; width: 100%; height: 100%; }
    .layer.dim .thumb { opacity: .6; }
    .layer .name { display: flex; flex-direction: column; min-width: 0; gap: 1px; }
    .layer .name b { font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: flex; align-items: center; gap: 6px; }
    .layer .name .glyph { display: inline-grid; place-items: center; width: 18px; height: 18px; flex: none; }
    .layer .name .glyph svg { width: 16px; height: 16px; display: block; }
    .layer .name small { color: var(--wa-muted); font-size: 11.5px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .layer .name small .val-tok { color: var(--wa-val); }
    .layer .kind { font-size: 11.5px; font-weight: 500; letter-spacing: 0; text-transform: none; color: var(--wa-muted); }
    .layer.dim .name b { opacity: .55; }
    .layer .right { display: flex; align-items: center; gap: 2px; }
    .layer .badges { display: inline-flex; gap: 4px; }
    .badge {
      display: inline-flex; align-items: center; height: 18px; padding: 0 6px; border-radius: 4px;
      font-size: 10.5px; font-weight: 700; letter-spacing: .02em; white-space: nowrap;
      background: color-mix(in srgb, var(--wa-ink) 8%, transparent); color: var(--wa-muted);
    }
    .badge.tap { color: #c2185b; background: rgba(236,64,122,.14); }
    .badge.states { color: #8a5a00; background: rgba(249,168,37,.18); }
    :host([dark]) .badge.tap { color: var(--wa-tap); background: color-mix(in srgb, var(--wa-tap) 22%, transparent); }
    :host([dark]) .badge.states { color: var(--wa-states); background: color-mix(in srgb, var(--wa-states) 22%, transparent); }
    /* Reserved, not removed: taking the actions out of the layout made the
       name change width the moment the pointer arrived. The badges step aside
       for them instead, so the row keeps its width. */
    .layer .acts { display: none; gap: 0; }
    .layer:hover .acts, .layer.hl .acts, .layer:focus-within .acts { display: inline-flex; }
    .layer:hover .badges, .layer.hl .badges, .layer:focus-within .badges { display: none; }
    .layer .acts button.icon { width: 24px; height: 24px; }
    .layer .acts svg.ui-icon { width: 15px; height: 15px; }
    /* The row being dragged leaves the list. The slot opening under the
       pointer already says where the layer is going, so a ghost of it left
       behind in its old place is one thing too many to read.

       Collapsed, not removed: taking the drag source out of the document
       cancels the drag. The negative margin eats the second of the two 6px
       gaps a zero-height row would otherwise sit between. */
    .layer.dragging, .group-kids.dragging {
      height: 0; min-height: 0; margin-top: -1px; margin-bottom: -1px;
      padding-top: 0; padding-bottom: 0; border-top-width: 0; border-bottom-width: 0;
      opacity: 0; overflow: hidden;
    }
    /* The shape row closes the list, under a hairline that runs the full
       width of the card: it is the ground everything else is drawn on, not
       another layer in the stack, so nothing can be dropped below it. */
    .layer.pinned {
      flex: none; margin: 0 -8px; padding: 0 14px 0 12px; min-height: 40px; border-radius: 0;
      border-top: 1px solid var(--wa-line);
    }
    .layer.pinned .grip { cursor: default; }
    .layer.pinned .bar { background: repeating-linear-gradient(180deg, var(--k) 0 3px, transparent 3px 6px); }
    .group-cta {
      display: flex; align-items: center; gap: 8px; font-size: 13px; padding: 6px 8px; margin-bottom: 6px; border-radius: 8px;
      border: 1px solid color-mix(in srgb, var(--wa-accent) 30%, transparent);
      background: color-mix(in srgb, var(--wa-accent) 12%, transparent);
    }
    .group-cta .spacer { flex: 1; }
    /* A lone selection offers only Save to parts: a quiet row, no box. */
    .part-cta { display: flex; align-items: center; font-size: 12px; margin-bottom: 4px; }
    .part-cta .spacer { flex: 1; }
    /* Picked for grouping: an accent ring, since the kind colour is taken. */
    .layer.multi { box-shadow: inset 0 0 0 1px var(--wa-accent); }
    /* A folder row: the chevron folds it, the lock says whether it moves as
       one, and its members sit indented under a guide line. */
    .layer .chev {
      font: inherit; background: transparent; border: 0; color: var(--wa-muted); padding: 0; cursor: pointer;
      width: 24px; height: 24px; border-radius: 6px; display: grid; place-items: center; flex: none;
    }
    .layer .chev:hover { background: color-mix(in srgb, var(--wa-ink) 10%, transparent); }
    .layer .chev svg { width: 15px; height: 15px; transition: transform .15s ease-out; }
    .layer .chev[aria-expanded="false"] svg { transform: rotate(-90deg); }
    /* A list's row layers. They hang under the list the way a group's members
       hang under their folder, and they are not dragged: the grip column stays
       empty so the names still line up with the rows above. */
    .layer.rowkid { cursor: pointer; }
    .layer.rowkid .grip { cursor: default; }
    .layer.rowkid .bar { background: repeating-linear-gradient(180deg, var(--k) 0 4px, transparent 4px 7px); }
    .layer.rowkid .rowglyph { display: grid; place-items: center; width: var(--thumb-w); color: var(--wa-muted); }
    .layer.rowkid .rowglyph svg { width: 16px; height: 16px; }
    /* A folder shows a folder where a layer shows its picture. */
    .layer.group .folder { display: grid; place-items: center; width: var(--thumb-w); color: var(--wa-muted); }
    .layer.group .folder svg { width: 17px; height: 17px; }
    .layer.group .bar { background: repeating-linear-gradient(180deg, var(--k) 0 5px, transparent 5px 8px); }
    .layer.group.drop-into { box-shadow: inset 0 0 0 2px var(--wa-accent); }
    .layer .lockbtn { width: 24px; height: 24px; opacity: .55; }
    .layer .lockbtn svg.ui-icon { width: 15px; height: 15px; }
    .layer .lockbtn.on { opacity: 1; color: ${unsafeCSS(SECTION_COLOR.locked)}; }
    .layer:hover .lockbtn, .layer.hl .lockbtn { opacity: 1; }
    .group-kids {
      margin: 0 0 0 12px; padding-left: 10px; display: flex; flex-direction: column; gap: 2px;
      border-left: 2px solid color-mix(in srgb, var(--wa-line) 60%, transparent);
    }
    /* Drop targets last, so the slot beats whatever the row already had on its
       own border.

       The row grows a tall transparent border on the side the dragged layer
       will land, so every row past it really does step out of the way, and a
       dashed slot is drawn in the space that opens. The gap belongs to the
       row's own box, so a pointer resting in it still counts as hovering that
       row; a gap made of margin would leave the row, close, and flap. */
    .layer.drop-before, .layer.drop-after { z-index: 1; }
    .layer.drop-before { border-top: ${DROP_GAP}px solid transparent; }
    .layer.drop-after { border-bottom: ${DROP_GAP}px solid transparent; }
    .layer.drop-before::after, .layer.drop-after::after {
      content: ""; position: absolute; left: 0; right: 0; height: ${DROP_GAP}px; box-sizing: border-box;
      border: 2px dashed var(--wa-accent); border-radius: var(--wa-r-md); pointer-events: none;
      background: color-mix(in srgb, var(--wa-accent) 14%, transparent);
    }
    .layer.drop-before::after { top: -${DROP_GAP}px; }
    .layer.drop-after::after { bottom: -${DROP_GAP}px; }

    /* Expanded rows say more: a third line about what the layer is made of,
       its meta free to wrap, and the badges kept beside the buttons rather
       than swapped for them. */
    .layer.rich .name small { white-space: normal; overflow: visible; text-overflow: clip; }
    .layer.rich .facts { display: flex; flex-wrap: wrap; gap: 2px 8px; margin-top: 2px; font-size: 11.5px; color: var(--wa-muted); }
    .layer.rich .facts .fact { white-space: nowrap; }
    .layer.rich .facts .fact b { font-weight: 600; color: var(--wa-ink); opacity: .75; }
    /* An expanded row keeps both the badges and the buttons, so the buttons
       cannot appear out of nothing the way they do on a compact row: arriving
       would widen the right end, squeeze the facts, wrap them onto another
       line and grow the row under the pointer. The buttons hold their place
       at all times and only turn visible, and the right end never wraps, so
       hovering changes colour and nothing else. */
    .layer.rich .right { flex-wrap: nowrap; justify-content: flex-end; gap: 4px; }
    .layer.rich .acts { display: inline-flex; visibility: hidden; }
    .layer.rich:hover .acts, .layer.rich.hl .acts, .layer.rich:focus-within .acts { visibility: visible; }
    .layer.rich:hover .badges, .layer.rich.hl .badges, .layer.rich:focus-within .badges { display: inline-flex; }
    ${unsafeCSS(layerRowFolds())}

    /* Two small segmented controls in the Layers title: how big the row
       pictures are, and how much each row says. */
    .seg {
      display: inline-flex; flex: none; height: 24px; padding: 2px; gap: 2px; border: 0;
      border-radius: 7px; background: var(--wa-panel); box-shadow: inset 0 0 0 1px var(--wa-line);
    }
    .seg button {
      font: inherit; font-size: 11px; font-weight: 600; letter-spacing: .02em; line-height: 1;
      padding: 0 6px; min-width: 22px; border: 0; border-radius: 5px; background: transparent; color: var(--wa-muted);
      cursor: pointer; display: grid; place-items: center;
      transition: color .12s ease-out, background-color .12s ease-out, box-shadow .12s ease-out;
    }
    .seg button:hover { color: var(--wa-ink); }
    .seg button.on { color: var(--wa-ink); background: var(--wa-card); box-shadow: 0 1px 2px rgba(0,0,0,.08); }
    .seg button:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .seg button svg.ui-icon { width: 13px; height: 13px; }
    /* The form-sized segmented control: a setting with two to four choices
       shows them all, the way a dropdown never can. Buttons share the width
       evenly and clip a label rather than wrap it, so a row never grows a
       second line, and the tint takes the section's colour where there is one. */
    .seg.wide { display: flex; width: 100%; min-width: 0; height: 24px; border-radius: 6px; background: var(--wa-field); box-shadow: none; }
    .seg.wide button {
      flex: 1 1 0; min-width: 0; padding: 0 4px; border-radius: 4px;
      font-size: 11.5px; font-weight: 500; letter-spacing: 0; line-height: 20px;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: block; text-align: center;
    }
    .seg.wide button.on { color: var(--wa-ink); background: var(--wa-seg-on); box-shadow: 0 1px 1.5px rgba(0,0,0,.22); }
    /* The choice a setting falls back to while it has none of its own. */
    .seg.wide button.inh { color: var(--wa-ink); outline: 1px dashed var(--wa-muted); outline-offset: -3px; }
    .seg.wide button:focus-visible { box-shadow: inset 0 0 0 2px color-mix(in srgb, var(--c, var(--wa-accent)) 60%, transparent); }
    .seg.wide button:disabled, .seg.wide button:disabled:hover { color: var(--wa-muted); opacity: .38; cursor: not-allowed; }
    .field.seg-field { align-items: center; }
    /* Readings: which of two ways to count, then how many when it is a count. */
    .readings-row { display: flex; align-items: center; gap: 6px; min-width: 0; }
    .readings-row .seg.wide { flex: 1 1 auto; width: auto; }
    /* Three digits is the most this box ever holds. The type selector is
       there to outrank the ".field input[type=number]" full-width rule. */
    .field .readings-row input.short[type=number] { width: 46px; flex: none; text-align: right; }
    /* The count used to sit against the buttons as a bare number, which reads
       as a setting nobody named. Two quiet words either side make the row a
       sentence, "Average into 24 slots", and the number stops being a riddle. */
    .readings-row .readings-into, .readings-row .readings-unit {
      font-size: 12px; color: var(--wa-muted); flex: none; white-space: nowrap;
    }
    .grid3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0 8px; }
    .grid3 .field { display: flex; flex-direction: column; align-items: stretch; gap: 3px; }
    .grid3 .field > span { font-size: 12px; }
    /* The Layers title carries those controls, so it is allowed a second line
       in a narrow column instead of squeezing them. The auto margin keeps the
       pair on the right whichever line they land on. */
    .panel-title.tools { flex-wrap: wrap; row-gap: 8px; }
    .panel-title .tool-set { display: inline-flex; gap: 6px; margin-left: auto; }

    /* The canvas column: one card holding the bar, the big preview and the
       strip of things about the whole complication. */
    /* The canvas column is three blocks stacked: what the whole complication
       is, the face itself, and the two lists of values under it. */
    .column.canvas { display: flex; flex-direction: column; gap: 8px; }
    /* The bar and the two lists keep their own height; the face takes what is
       left, so the lists under it are on screen without scrolling. */
    .column.canvas > .card.canvas-card {
      padding: 0; overflow: hidden; flex: 1 1 auto; min-height: 260px;
      display: flex; flex-direction: column;
    }
    .banner { padding: 10px 14px; border-radius: 8px; font-size: 13px; background: var(--wa-panel); flex: none; }
    .banner.warn { border-left: 4px solid var(--warning-color, #ffa600); }
    .banner.err { border-left: 4px solid var(--error-color, #db4437); }
    .banner .acts { display: flex; gap: 6px; margin-top: 8px; flex-wrap: wrap; }

    /* The watch gate: the one screen a too-old watch gets instead of the
       editor. Centred like a welcome page, with the accent reserved for the
       glyph and the step numbers, so it reads as a considered pause rather
       than an error strip. */
    .gate {
      flex: 1 1 auto; min-height: 0; overflow: auto;
      display: flex; align-items: flex-start; justify-content: center;
      padding: clamp(24px, 8vh, 72px) 24px 40px;
    }
    .gate-card {
      width: min(600px, 100%);
      background: var(--wa-card);
      border-radius: var(--wa-r-lg);
      box-shadow: 0 0 0 1px var(--wa-line);
      padding: 36px 40px 32px;
      display: flex; flex-direction: column; align-items: flex-start; gap: 0;
      position: relative; overflow: hidden;
    }
    .gate-glyph {
      position: relative; width: 52px; height: 52px; border-radius: 16px;
      display: grid; place-items: center; color: var(--wa-accent);
      background: color-mix(in srgb, var(--wa-accent) 14%, var(--wa-card));
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--wa-accent) 30%, transparent);
      margin-bottom: 22px;
    }
    .gate-glyph svg { width: 28px; height: 28px; }
    .gate-eyebrow {
      position: relative; font-size: 11px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase;
      color: var(--wa-accent); margin-bottom: 10px;
    }
    .gate-title {
      position: relative; margin: 0 0 10px; font-size: 24px; line-height: 1.2; font-weight: 700;
      letter-spacing: -.015em; color: var(--wa-ink); text-wrap: balance;
    }
    .gate-lead { position: relative; margin: 0 0 26px; font-size: 14.5px; line-height: 1.55; color: var(--wa-muted); max-width: 52ch; }
    .gate-steps { position: relative; list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 0; width: 100%; }
    .gate-steps li {
      display: grid; grid-template-columns: 30px 1fr; gap: 14px; align-items: start;
      padding: 14px 0; border-top: 1px solid var(--wa-line);
    }
    .gate-steps li:last-child { border-bottom: 1px solid var(--wa-line); }
    .gate-n {
      width: 30px; height: 30px; border-radius: 999px; display: grid; place-items: center;
      font-size: 13px; font-weight: 700; font-variant-numeric: tabular-nums;
      color: var(--wa-accent); background: color-mix(in srgb, var(--wa-accent) 12%, transparent);
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--wa-accent) 28%, transparent);
    }
    .gate-steps b { display: block; font-size: 14.5px; font-weight: 650; color: var(--wa-ink); margin: 5px 0 3px; }
    .gate-steps span:not(.gate-n) { display: block; font-size: 13.5px; line-height: 1.5; color: var(--wa-muted); }
    .gate-foot { position: relative; margin-top: 18px; font-size: 13px; color: var(--wa-muted); }
    @media (max-width: 640px) {
      .gate { padding: 16px 12px 28px; }
      .gate-card { padding: 26px 22px 24px; }
      .gate-title { font-size: 21px; }
    }
    /* Two rows with a hairline between them: which shape is being edited on
       top, how the face is looked at underneath. The tool row sits a shade
       darker so the stage below reads as a third, separate surface. */
    .canvas-bar {
      display: flex; flex-direction: column; font-size: 13px; flex: none;
      border-bottom: 1px solid var(--wa-line); background: var(--wa-raised);
    }
    .bar-row { display: flex; align-items: center; gap: 6px; padding: 6px 10px; flex-wrap: wrap; }
    .bar-row.tools {
      border-top: 1px solid var(--wa-line);
      background: color-mix(in srgb, var(--wa-raised) 55%, var(--wa-input));
    }
    .bar-sep { width: 1px; height: 18px; background: var(--wa-line-strong); margin: 0 2px; flex: none; }
    .canvas-bar .spacer { flex: 1; min-width: 0; }
    /* The shapes the complication has, as one segmented control. */
    .shape-seg {
      display: inline-flex; flex-wrap: wrap; gap: 2px; padding: 2px; border-radius: 10px;
      background: var(--wa-input); box-shadow: inset 0 0 0 1px var(--wa-line);
    }
    .shape-seg button.tab { height: 34px; padding: 0 10px; border-radius: 8px; }
    .shape-adds { display: inline-flex; align-items: center; flex-wrap: wrap; gap: 8px; }
    .shape-adds button.tab { height: 28px; padding: 0 9px; gap: 5px; font-weight: 500; }
    .shape-adds button.tab svg { width: 12px; height: 12px; }
    .shape-adds button.tab.add-shape { height: 30px; padding: 0 11px; font-weight: 600; }
    .shape-spare { font-size: 11.5px; color: var(--wa-muted); }
    /* Every shape this complication could still have, under the same place
       headings the New dialog uses. A panel rather than a row because the
       headings are the point, and a row of nine cards with three headings in
       it is wider than the bar it hangs off. */
    .add-menu {
      position: fixed; inset: auto; margin: 0; width: min(370px, calc(100vw - 24px)); padding: 12px;
      border: 1px solid var(--wa-line-strong); border-radius: var(--wa-r-md);
      background: var(--wa-panel); color: var(--wa-ink); box-shadow: var(--wa-shadow-pop);
    }
    .add-menu:popover-open { display: flex; flex-direction: column; gap: 12px; }
    .add-group { display: flex; flex-direction: column; gap: 7px; }
    .add-group-label { font-size: 11px; font-weight: 600; letter-spacing: .05em; text-transform: uppercase; color: var(--wa-muted); }
    /* Three to a row here, not the dialog's auto-fit: the panel is narrower
       than the dialog and a fourth column would squeeze the names. */
    .add-menu .shape-cards { grid-template-columns: repeat(3, minmax(0, 1fr)); }
    .canvas-bar .hint { margin: 0; }
    /* Shape tabs: one per family, drawn with a real picture of what that shape
       holds. A family the complication does not have is a dashed invitation. */
    .tab-wrap { position: relative; display: inline-flex; align-items: center; }
    button.tab {
      display: inline-flex; align-items: center; gap: 8px; height: 36px; padding: 0 12px; border-radius: 9px;
      font: inherit; font-size: 12.5px; font-weight: 600; color: var(--wa-muted); cursor: pointer;
      background: transparent; border: 1px solid transparent; white-space: nowrap;
      transition: background-color .12s ease-out, color .12s ease-out, box-shadow .12s ease-out;
    }
    button.tab:hover:not(:disabled) { color: var(--wa-ink); }
    button.tab[aria-pressed="true"] { background: var(--wa-card); color: var(--wa-ink); box-shadow: 0 1px 2px rgba(0,0,0,.08), 0 0 0 1px var(--wa-line); }
    button.tab:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    button.tab.off { border: 1px dashed var(--wa-line-strong); color: color-mix(in srgb, var(--wa-muted) 80%, var(--wa-card)); }
    button.tab small { font-weight: 500; opacity: .75; }
    /* A shape's own render, drawn on the black a watch face and a Lock Screen
       are. On the dark skin that plate is all but invisible against the bar
       behind it, so every plate carries a hairline ring. The ring is a
       box-shadow rather than a border because a shadow follows the radius each
       shape sets below, and a circular tab needs a circular ring. */
    .tab .art { display: grid; place-items: center; flex: none; height: 18px; }
    .tab .art svg {
      display: block; max-height: 18px; max-width: 38px; width: auto; height: auto;
      background: #000; border-radius: 3px; box-shadow: 0 0 0 1px var(--wa-line-strong);
    }
    .tab.circular .art svg { border-radius: 50%; }
    .tab.corner .art svg { background: #2c2c2e; }
    /* The tab pictures are small, so the Home Screen tiles take a share of
       their own box as the corner rather than a flat radius. */
    .tab.small .art svg { border-radius: 16.3%; }
    .tab.medium .art svg { border-radius: 7.7% / 16.3%; }
    .tab.large .art svg { border-radius: 7.7% / 7.4%; }
    .tab.xlarge .art svg { border-radius: 7.7% / 4.8%; }
    .tab .art .inline-line { font-size: 8px; padding: 2px 5px; min-width: 0; display: inline-flex; align-items: center; gap: 3px; border-radius: 999px; background: #000; color: #fff; box-shadow: 0 0 0 1px var(--wa-line-strong); }
    .tab .art .inline-line svg { background: transparent; border-radius: 0; box-shadow: none; }
    /* The Control Center tab draws a mock tile rather than a face, so the art
       rules above (a black ground, a rounded corner, a 16px cap) must not
       reach its glyph: the tile carries its own tint and corner. */
    .tab.control .art { height: 20px; }
    .tab.control .art svg { background: transparent; border-radius: 0; box-shadow: none; max-height: none; max-width: none; }
    /* The remove button rides beside its tab and only while the pointer is on it. */
    .tab-wrap .tab-x { opacity: 0; pointer-events: none; margin-left: -4px; }
    .tab-wrap:hover .tab-x, .tab-wrap .tab-x:focus-visible { opacity: .7; pointer-events: auto; }
    .tab-wrap .tab-x:hover:not(:disabled) { opacity: 1; }
    .tab-wrap .tab-x:disabled { opacity: .2; }
    /* A control drawn as a box with a muted word inside it, so "Preview as" is
       part of the field rather than a label floating beside it. */
    .inbox {
      display: inline-flex; align-items: center; gap: 6px; height: 30px; padding: 0 4px 0 10px; border-radius: 7px;
      border: 1px solid var(--wa-line); background: var(--wa-input); flex: none;
    }
    .inbox .pre { color: var(--wa-muted); font-weight: 600; font-size: 12.5px; white-space: nowrap; }
    .inbox select { height: 26px; border: 0; background-color: transparent; padding-left: 0; }
    .inbox select:focus-visible { box-shadow: none; }
    /* The three face toggles wrap as one block, so a narrow bar never leaves
       one of them stranded on the line above the other two. */
    .over .face-tools { display: inline-flex; gap: 6px; flex: none; }
    /* The line-up strip: eight glyphs with no words, so it stays one block on
       a narrow bar. A hair tighter than the toggles beside it, since the six
       aligns read as one control. */
    .over .align-tools { display: inline-flex; gap: 1px; flex: none; }
    .over .align-tools svg { width: 17px; height: 17px; }
    /* The strip over the face: a small raised pill on the dotted stage, centred
       over the preview and moving with it, so the tools that act on the
       selection sit next to the selection. */
    .over {
      display: flex; align-items: center; justify-content: center; flex-wrap: nowrap; gap: 6px;
      position: sticky; top: 0; z-index: 4; justify-self: center;
      padding: 5px 8px; border-radius: 12px; font-size: 13px; max-width: 100%;
      background: color-mix(in srgb, var(--wa-raised) 92%, transparent);
      box-shadow: 0 0 0 1px var(--wa-line), 0 6px 18px rgba(0,0,0,.18);
    }
    /* The banner that says the canvas is showing one cell of a list. Same card
       as the tools pill, sitting above it, and it wraps rather than pushing
       Done off the edge of a narrow canvas. */
    .row-strip {
      display: flex; align-items: center; flex-wrap: wrap; gap: 10px;
      justify-self: center; max-width: 100%; font-size: 13px;
      padding: 7px 8px 7px 10px; border-radius: 12px;
      background: color-mix(in srgb, var(--wa-raised) 92%, transparent);
      box-shadow: 0 0 0 1px var(--wa-line), 0 6px 18px rgba(0,0,0,.18);
    }
    .row-strip .row-strip-thumb {
      width: ${THUMB_W}px; height: ${THUMB_H}px; border-radius: 4px; overflow: hidden;
      background: #000; flex: none; display: block;
    }
    .row-strip .row-strip-thumb svg { display: block; width: 100%; height: 100%; }
    .row-strip .row-strip-text { flex: 1 1 200px; min-width: 0; }
    .row-strip button {
      font: inherit; font-size: 12.5px; font-weight: 700; cursor: pointer; flex: none;
      height: 28px; padding: 0 14px; border-radius: 8px; border: 0;
      background: var(--wa-accent); color: var(--wa-accent-ink);
    }
    .row-strip button:hover { filter: brightness(1.06); }
    .row-strip button:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    /* The page tabs: the same raised card as the row banner, sitting under it
       when both are up, because which page is showing is read after which row
       is being designed. */
    .page-strip {
      display: flex; align-items: center; flex-wrap: wrap; gap: 8px;
      justify-self: center; max-width: 100%; font-size: 13px;
      padding: 6px 8px; border-radius: 12px;
      background: color-mix(in srgb, var(--wa-raised) 92%, transparent);
      box-shadow: 0 0 0 1px var(--wa-line), 0 6px 18px rgba(0,0,0,.18);
    }
    .page-strip .page-strip-word { color: var(--wa-muted); font-weight: 600; font-size: 12.5px; }
    .page-strip .page-tabs { display: inline-flex; gap: 2px; }
    .page-strip button {
      font: inherit; font-size: 12.5px; font-weight: 700; cursor: pointer; flex: none;
      height: 26px; min-width: 26px; padding: 0 8px; border-radius: 7px;
      border: 1px solid var(--wa-line); background: var(--wa-input); color: inherit;
    }
    .page-strip button.on { background: var(--wa-accent); color: var(--wa-accent-ink); border-color: transparent; }
    .page-strip button:hover:not(.on) { background: var(--wa-raised); }
    .page-strip button:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .page-strip button.page-act { padding: 0 12px; }
    /* The tour's progress: one thin bar, filled by a CSS animation over the
       tour's own length, so nothing has to tick at 60 fps to draw it. */
    .page-strip .tour-bar {
      flex: 1 1 60px; min-width: 40px; height: 4px; border-radius: 999px;
      background: var(--wa-line); overflow: hidden;
    }
    .page-strip .tour-bar i {
      display: block; height: 100%; width: 0; background: var(--wa-accent);
      animation-name: wa-tour; animation-timing-function: linear; animation-fill-mode: forwards;
    }
    @keyframes wa-tour { from { width: 0; } to { width: 100%; } }
    /* The pill never wraps and never leaves: it sticks to the top of the stage
       when the face is scrolled, and on a narrow canvas the two words go and
       the glyphs stay, so every button is always there to press. */
    .over button.pick { white-space: nowrap; }
    @container (max-width: 860px) {
      .over .word { display: none; }
      .over button.pick { width: 30px; padding: 0; justify-content: center; }
      .over button.pick .glyph { margin: 0; }
      .over .grid-tool.on button.pick { padding-right: 0; }
    }
    /* With snapping on, the button and its size read as one accent pill. */
    /* With the grid on, the switch and its size read as one accent pill. */
    .grid-tool { display: inline-flex; align-items: center; position: relative; }
    .grid-tool.on button.pick { border-radius: 8px 0 0 8px; padding-right: 8px; }
    button.grid-step {
      height: 30px; font: inherit; font-size: 12.5px; font-weight: 600; cursor: pointer;
      border: 0; border-left: 1px solid color-mix(in srgb, var(--wa-accent-ink) 30%, transparent);
      background-color: color-mix(in srgb, var(--wa-accent) 82%, #000); color: var(--wa-accent-ink);
      padding: 0 6px 0 8px; border-radius: 0 8px 8px 0; display: inline-flex; align-items: center; gap: 3px; font-variant-numeric: tabular-nums;
    }
    button.grid-step svg { width: 12px; height: 12px; opacity: .8; }
    button.grid-step:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .grid-tool .pop-menu { left: 0; right: auto; }
    button.pick .glyph svg { width: 15px; height: 15px; display: block; }
    /* The preview bar's own menus (grid size, Preview as), in place of native
       selects, whose closing menu made Chrome on macOS hold the next click. */
    .pop-menu {
      position: absolute; top: calc(100% + 6px); right: 0; z-index: 50; min-width: 84px;
      background: var(--wa-card); color: var(--wa-ink); border: 1px solid var(--wa-line-strong);
      border-radius: var(--wa-r-md); box-shadow: var(--wa-shadow-pop); padding: 4px;
      display: flex; flex-direction: column; gap: 1px;
    }
    .pop-menu .row {
      font: inherit; font-size: 12.5px; font-weight: 600; text-align: left; font-variant-numeric: tabular-nums; white-space: nowrap;
      background: transparent; border: 0; color: inherit; padding: 6px 10px; border-radius: 7px; cursor: pointer;
    }
    .pop-menu .row:hover { background: var(--wa-panel); }
    .pop-menu .row[aria-selected="true"] { background: color-mix(in srgb, var(--wa-accent) 18%, transparent); }
    .pop-menu .row:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .case-tool { position: relative; display: inline-flex; }
    .case-tool .pop-menu { left: -6px; right: auto; min-width: 150px; }
    /* The List button's menu: a blank list first, then the ready-made ones.
       The wrapper takes the button's grid cell so the menu hangs off it. */
    .add-tool { position: relative; display: grid; min-width: 0; }
    .add-tool .pop-menu { left: 0; right: auto; min-width: 210px; }
    .add-tool .pop-menu .row { display: flex; flex-direction: column; align-items: stretch; gap: 1px; white-space: normal; }
    .add-tool .pop-menu .row small { font-weight: 500; font-size: 11.5px; color: var(--wa-muted); }
    .add-tool .pop-menu .sep { height: 1px; margin: 3px 6px; background: var(--wa-line); }
    button.case-pick {
      display: inline-flex; align-items: center; gap: 6px; height: 26px; padding: 0 6px 0 0; border: 0; border-radius: 6px;
      background: transparent; color: var(--wa-ink); font: inherit; font-weight: 500; cursor: pointer; white-space: nowrap;
    }
    button.case-pick svg { width: 14px; height: 14px; opacity: .7; }
    /* The Colour menu: a round swatch per tint, and a split one for full colour.
       While a tint is on the box takes an accent edge, so a tinted preview is
       never mistaken for the real colours. */
    .tint-box.on { border-color: var(--wa-accent); box-shadow: 0 0 0 1px var(--wa-accent); }
    .tint-dot {
      display: inline-block; flex: none; width: 11px; height: 11px; border-radius: 50%; margin-right: 6px; vertical-align: -1px;
      background: var(--sw); box-shadow: inset 0 0 0 1px rgba(128,128,128,.5);
    }
    button.case-pick .tint-dot { margin-right: 0; }
    .tint-dot.full { background: conic-gradient(#FF453A 0 25%, #FFD60A 0 50%, #30D158 0 75%, #0A84FF 0); }
    button.case-pick:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .canvas-bar label { display: inline-flex; align-items: center; gap: 8px; color: var(--wa-muted); }
    .canvas-bar label select { color: var(--wa-ink); font-weight: 500; }
    button.pick {
      font: inherit; font-size: 12.5px; font-weight: 600; padding: 0 10px; height: 30px; border-radius: 8px; cursor: pointer;
      display: inline-flex; align-items: center; gap: 6px; white-space: nowrap;
      border: 1px solid transparent; background: transparent; color: var(--wa-muted);
      transition: background-color .12s ease-out, color .12s ease-out;
    }
    button.pick:hover:not(:disabled) { background: var(--wa-panel); color: var(--wa-ink); }
    button.pick:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    button.pick.on { background: var(--wa-accent); color: var(--wa-accent-ink); }
    button.pick.only-icon { width: 30px; padding: 0; justify-content: center; }
    button.pick .glyph { font-size: 13px; line-height: 1; }
    /* The stage: a faint dot grid under a soft accent glow, so the watch face
       sits on a work surface rather than on the card. */
    .stage {
      display: grid; justify-items: center; align-content: center; gap: 20px; padding: 20px; flex: 1 1 auto; min-height: 0; overflow: auto;
      container-type: inline-size;
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
    /* Resize handles sit just outside a layer's corners, so on a layer at the
       slot edge they reach past the face. */
    .preview > svg.complication { overflow: visible; }
    .preview.rectangular svg { width: 100%; max-width: 900px; }
    .preview.circular svg { width: min(100%, 440px); border-radius: 50%; }
    .preview.corner svg { width: min(100%, 420px); background: #2c2c2e; }
    /* The four Home Screen tiles. Each is capped at a width that leaves the
       whole tile on screen at its own ratio (square, 2.1:1, 0.96:1, 0.62:1),
       and takes the system's continuous corner as a share of its box, so the
       black behind the drawing rounds with it at any size. */
    .preview.small svg { width: min(100%, 460px); border-radius: 16.3%; }
    .preview.medium svg { width: min(100%, 880px); border-radius: 7.7% / 16.3%; }
    .preview.large svg { width: min(100%, 520px); border-radius: 7.7% / 7.4%; }
    .preview.xlarge svg { width: min(100%, 380px); border-radius: 7.7% / 4.8%; }
    .preview.picking svg, .preview.picking svg * { cursor: crosshair; }
    .preview.inline .inline-line {
      display: inline-flex; align-items: center; justify-content: center; gap: 6px; min-width: 220px;
      padding: 8px 18px; border-radius: 999px; background: #000; color: #fff; font-size: 15px;
    }
    .preview.inline .inline-line svg { display: inline-block; margin: 0; background: transparent; border-radius: 0; }
    .preview.inline .inline-line.missing { color: #999; font-style: italic; }
    /* The big mock tile on the stage, where a face would be. It takes the same
       drop shadow the faces take, so it sits on the work surface rather than
       floating over it. */
    .control-big { display: grid; place-items: center; gap: 22px; }
    .control-big.phone { grid-auto-flow: column; gap: 36px; }
    .control-big > span { box-shadow: 0 20px 50px rgba(0,0,0,.45); }
    /* What the watch prints above its grid: white, centred, two lines at most. */
    .control-big .cc-head {
      max-width: 300px; text-align: center; color: #fff; font-size: 22px; font-weight: 500; line-height: 1.2;
      display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; overflow: hidden; overflow-wrap: anywhere;
    }
    /* The line under the face: which shape, how big, and what a drag does. The
       size is set in mono, because it is a measurement rather than prose. */
    .under {
      display: flex; align-items: center; justify-content: center; flex-wrap: wrap; gap: 10px;
      text-align: center; font-size: 12.5px; font-weight: 500; color: var(--wa-muted);
    }
    .under b { color: var(--wa-ink); font-weight: 700; }
    .under .size { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 12px; }
    .under .dot { color: var(--wa-line-strong); }
    .under .tail b { font-weight: 700; }
    /* The two lists under the face: what the complication defines for itself,
       and what the house is telling it right now. Stacked, so each title and
       each value line gets the whole width instead of wrapping into a column
       half as wide. */
    .under-grid { display: grid; grid-template-columns: minmax(0, 1fr); gap: 8px; flex: none; }
    .card.tint-values {
      padding: 10px 14px 12px;
      background: color-mix(in srgb, ${unsafeCSS(SECTION_COLOR.complication)} 8%, var(--wa-card));
      box-shadow: 0 0 0 1px color-mix(in srgb, ${unsafeCSS(SECTION_COLOR.complication)} 25%, var(--wa-card));
    }
    .card.tint-states {
      padding: 10px 14px 12px;
      background: color-mix(in srgb, ${unsafeCSS(SECTION_COLOR.states)} 12%, var(--wa-card));
      box-shadow: 0 0 0 1px color-mix(in srgb, ${unsafeCSS(SECTION_COLOR.states)} 35%, var(--wa-card));
    }
    .card.tint-values .panel-title, .card.tint-states .panel-title { margin-bottom: 6px; }
    /* One value, one 30px white line: name, then what it reads. */
    .vrow {
      display: flex; align-items: center; gap: 8px; width: 100%; min-height: 30px; padding: 0 8px;
      border-radius: 7px; background: var(--wa-card); font-size: 13px; text-align: left;
    }
    .vrow .spacer { flex: 1; min-width: 0; }
    .vrow .nm { font-weight: 600; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .vrow .kbar { width: 3px; height: 14px; border-radius: 2px; background: var(--k); flex: none; }
    /* A card title opens with a tinted mark, the same one the inspector's
       cards wear, so every column speaks the same language. */
    .panel-title .swatch {
      width: 22px; height: 22px; border-radius: 6px; flex: none; display: grid; place-items: center;
      background: var(--c, var(--wa-accent)); border: 0; color: #fff;
    }
    .panel-title .swatch svg { width: 13px; height: 13px; stroke-width: 2.4; }
    /* The complication card's Flash row: the switch, then the colour it
       flashes, or the word Off. */
    .flash-row { display: flex; align-items: center; gap: 8px; min-width: 0; min-height: 26px; }
    .flash-row input.flash-color { width: 34px; height: 22px; padding: 1px 2px; border-radius: 5px; }
    .flash-row .muted { color: var(--wa-muted); font-size: 12px; }
    /* Shared values: a row per named value. The whole row opens its editor
       in place, under the row, so it carries the hover and open states a
       button would, and the delete button stays out of the way until the
       pointer is on it. */
    .values-list .data { display: flex; flex-direction: column; gap: 6px; }
    /* A row and its open editor, grouped only so a click can tell whether it
       landed on the open value; the list lays them out as before. */
    .values-list .vitem { display: contents; }
    /* Marks a shared value's row under the preview, so it is not read as
       an entity. */
    .vchip .vtag {
      flex: none; padding: 0 5px; border-radius: 4px; font-size: 10.5px; font-weight: 600; line-height: 16px;
      color: var(--wa-muted); background: color-mix(in srgb, var(--wa-ink) 8%, transparent);
    }
    .values-list .value-open {
      display: flex; flex-direction: column; gap: 4px; margin-top: -2px; padding: 6px 8px 8px;
      border-radius: 7px; background: color-mix(in srgb, var(--c) 5%, var(--wa-card));
    }
    .values-list .value-open .value-editor { display: flex; flex-direction: column; gap: 4px; }
    .values-list.empty-list .panel-title { margin-bottom: 0; }
    /* The card's "?" always shows: unlike an inspector card, this one has
       no header to hover first. */
    .values-list .panel-title button.sec-help { opacity: 1; }
    .values-list .shared-help {
      margin: 0 0 8px; padding: 8px 10px; border-radius: 7px; background: var(--wa-card);
      font-size: 12.5px; line-height: 1.45; color: var(--wa-ink);
    }
    .values-list .shared-help p { margin: 0 0 6px; }
    .values-list .shared-help ol { margin: 0; padding-left: 18px; display: flex; flex-direction: column; gap: 3px; }
    /* Now: the printed value as a token, spaces kept, so a prefix of "xx "
       shows its space; or the missing step in muted words. */
    .field.now-field .now-v { color: var(--wa-ink); }
    .now-v .now-tok {
      display: inline-block; max-width: 100%; padding: 1px 6px; border-radius: 5px; white-space: pre-wrap; overflow-wrap: anywhere;
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 12px; font-weight: 600;
      color: var(--wa-val); background: color-mix(in srgb, var(--wa-val) 12%, transparent);
    }
    .now-v.none { font-style: italic; }
    details.sub.format summary .sum-note { margin-left: 6px; color: var(--wa-muted); font-weight: 400; }
    /* Under Layers, the list takes at most part of the column and scrolls, so
       an open value never pushes the layer rows out of sight. */
    .column.left .card.values-list { max-height: 45%; overflow-y: auto; scrollbar-width: thin; }
    /* On the Control Center tab the layer tools are one note, so Shared
       values sits at the foot of the column rather than right under it. */
    .column.left.control .card.values-list { margin-top: auto; }
    .layout.cols-1 .column.left.control .card.values-list { margin-top: 0; }
    .layout.cols-1 .column.left .card.values-list { max-height: none; overflow: visible; }
    .values-list .datum {
      padding: 0 8px; border-radius: 7px; gap: 8px;
      transition: box-shadow .12s ease-out, background-color .12s ease-out;
    }
    .values-list .datum + .datum { box-shadow: none; }
    .values-list .datum:hover { box-shadow: inset 0 0 0 1px var(--wa-accent); }
    /* Selected: the same tint the inspector gives its complication section. */
    .values-list .datum.hl { box-shadow: inset 0 0 0 1px var(--c); background: color-mix(in srgb, var(--c) 10%, var(--wa-card)); }
    .values-list .datum .meta {
      flex: none; min-width: 0; max-width: 140px; opacity: 1; color: var(--wa-val); font-weight: 600;
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 12px;
      overflow: hidden; text-overflow: ellipsis; white-space: pre;
    }
    .values-list .datum .meta.none { font-family: inherit; font-style: italic; color: var(--wa-muted); }
    .values-list .datum button.icon { opacity: 0; pointer-events: none; flex: none; }
    .values-list .datum:hover button.icon, .values-list .datum:focus-within button.icon { opacity: .7; pointer-events: auto; }
    .values-list .datum button.icon:hover:not(:disabled), .values-list .datum button.icon:focus-visible { opacity: 1; }
    .chips { display: flex; gap: 6px; flex-wrap: wrap; align-items: center; }
    .chips .muted { color: var(--wa-muted); font-size: 12px; }
    /* Every entity the face reads, one white line each. The whole line is the
       button, so clicking anywhere on it opens the test value. */
    .chips.values { display: flex; flex-direction: column; flex-wrap: nowrap; align-items: stretch; gap: 6px; }
    .vchip { border: 0; cursor: pointer; color: inherit; transition: box-shadow .12s ease-out; }
    .vchip:hover { box-shadow: inset 0 0 0 1px var(--wa-accent); }
    .vchip b { font-weight: 600; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .vchip .val {
      flex: none; color: var(--wa-val); font-weight: 600;
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 12px;
    }
    .vchip.testing { box-shadow: inset 0 0 0 1px var(--wa-states); }
    .vchip.testing .val { color: color-mix(in srgb, var(--wa-states) 70%, var(--wa-ink)); }
    .vchip input[type=text] { width: 110px; min-height: 24px; font: inherit; font-size: 13px; padding: 2px 6px; border-radius: 6px; border: 1px solid var(--wa-states); background: var(--wa-card); color: inherit; }
    /* A test value's control sits at the end of its row: a slider and its
       reading for a number, a picker for known states, the reading alone for
       text. The row is no longer a button, so it drops the pointer. */
    .vchip.ctl { cursor: default; }
    .vchip .test-ctl { display: flex; align-items: center; justify-content: flex-end; gap: 8px; flex: 0 1 50%; min-width: 0; }
    .vchip .test-ctl input[type=range] { flex: 1 1 auto; min-width: 60px; height: 16px; margin: 0; accent-color: var(--wa-states); cursor: pointer; }
    .vchip .test-ctl select { min-width: 0; max-width: 100%; font: inherit; font-size: 12px; min-height: 24px; padding: 2px 6px; border-radius: 6px; cursor: pointer; }
    .vchip button.val { background: none; border: 0; padding: 0; cursor: text; min-width: 56px; text-align: right; }
    .vchip button.live-reset { flex: none; }
    .testing-pill { display: inline-flex; align-items: center; gap: 8px; font-size: 12px; text-transform: none; letter-spacing: 0; color: color-mix(in srgb, var(--wa-states) 70%, var(--wa-ink)); }
    .testing-pill button { font: inherit; font-size: 12px; font-weight: 500; background: var(--wa-states); color: #1a1600; border: 0; border-radius: 999px; padding: 2px 9px; cursor: pointer; }
    .empty { opacity: .6; padding: 24px; text-align: center; }
    /* A shape that draws nothing yet. Tinted in the placement colour rather
       than the accent: it is a statement about where you are, not a thing to
       press, and the buttons inside it carry the press. */
    .blank-shape {
      margin: 10px 0; padding: 10px 12px; border-radius: var(--wa-r-md);
      border: 1px solid color-mix(in srgb, var(--wa-place) 40%, var(--wa-line));
      background: color-mix(in srgb, var(--wa-place) 10%, transparent);
    }
    .blank-shape b { font-size: 13px; }
    .blank-shape .hint { margin: 5px 0 0; }
    .blank-shape .adders { margin-top: 9px; }

    /* The inspector: crumbs on top, then one card per section of the thing
       selected, tinted by what it is. */
    .column.inspector { padding: 10px 12px 12px; container: insp / inline-size; }
    /* The head grows when a long layer name wraps its crumbs onto a second
       line, rather than spilling over the first card. */
    .insp-head { display: flex; flex-wrap: wrap; align-items: center; gap: 0 8px; min-height: 34px; padding: 0; position: sticky; top: 0; background: var(--wa-card); z-index: 5; }
    /* The crumbs keep at least 180px; with less beside it, the One at a time
       button drops under them rather than squeezing every crumb onto its
       own line. */
    .crumbs { flex: 1 1 180px; min-width: 0; display: flex; align-items: center; gap: 2px 6px; flex-wrap: wrap; padding: 4px 0; font-size: 12.5px; font-weight: 600; color: var(--wa-muted); }
    .crumbs button { font: inherit; font-size: 12.5px; font-weight: 600; background: transparent; border: 0; padding: 3px 6px; border-radius: 5px; color: var(--wa-muted); cursor: pointer; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .insp-head .expand { margin-left: auto; }
    .crumbs button:hover { background: var(--wa-panel); color: var(--wa-ink); }
    .crumbs .sep { opacity: .5; }
    .here {
      display: inline-flex; align-items: center; gap: 6px; padding: 3px 8px 3px 6px; border-radius: 6px;
      background: color-mix(in srgb, var(--k) 14%, transparent); border: 1px solid color-mix(in srgb, var(--k) 40%, transparent);
      color: var(--wa-ink); font-weight: 500; min-width: 0; max-width: 100%;
    }
    .here .nm { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .here .kchip { flex: none; }
    .kchip { font-size: 10px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: #fff; background: var(--k); padding: 1px 5px; border-radius: 3px; }
    .insp-head .expand {
      flex: none; font: inherit; font-size: 12px; font-weight: 600; color: var(--wa-muted); cursor: pointer;
      background: transparent; border: 0; padding: 0 9px; min-height: 26px; border-radius: 8px;
    }
    .insp-head .expand:hover { background: var(--wa-panel); color: var(--wa-ink); }
    .insp-body { padding: 0 0 24px; }
    /* With no layer selected the inspector is the complication: its name, then
       its four actions, which wrap under the name when the column is narrow. */
    .insp-head.comp-head { height: auto; min-height: 34px; flex-wrap: wrap; row-gap: 0; }
    .comp-head .crumbs { flex: 1 1 100px; }
    .comp-acts { display: flex; align-items: center; gap: 0; margin-left: auto; flex: none; }
    .comp-acts button.ghost { font-size: 12px; padding: 0 6px; min-height: 24px; border-radius: 6px; }
    .insp-note { margin: 12px 0 0; font-size: 12px; line-height: 1.45; color: var(--wa-muted); }
    /* One tinted box per subject, in the section's colour, so each card reads
       as its own thing: a 36px header with a small mark, then a body of
       label-left rows. The header's hover runs to the box's edges while the
       rows keep the box's padding. */
    .sec {
      --c: var(--wa-accent);
      margin: 6px 0 0; padding: 0 12px; border-radius: 9px; overflow: hidden;
      background: color-mix(in srgb, var(--c) 7%, var(--wa-card));
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--c) 24%, var(--wa-card));
    }
    .sec[data-open="true"] { box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--c) 40%, var(--wa-card)); }
    .sec-h {
      display: flex; align-items: center; gap: 8px; height: 36px; margin: 0 -12px; padding: 0 6px 0 12px;
      cursor: pointer; user-select: none; transition: background-color .12s ease-out;
    }
    .sec-h:hover { background: color-mix(in srgb, var(--c) 10%, transparent); }
    .sec-h.pinned { cursor: default; }
    .sec-h.pinned:hover { background: transparent; }
    .sec-h:focus-visible { outline: none; box-shadow: inset 0 0 0 2px var(--c); }
    :is(.sec-h, .xfer-callout) .swatch {
      width: 18px; height: 18px; border-radius: 5px; border: 0; flex: none; display: grid; place-items: center;
      background: color-mix(in srgb, var(--c) 22%, transparent); color: var(--c);
    }
    :is(.sec-h, .xfer-callout) .swatch svg { width: 11px; height: 11px; stroke-width: 2.2; }
    /* Title and summary on one line: the summary is what the card says while
       it is shut, so it belongs beside the title, not under it. */
    .sec-h .tt { display: flex; flex-direction: row; align-items: center; gap: 8px; min-width: 0; flex: 1; }
    .sec-h h4 { margin: 0; flex: none; font-size: 12.5px; font-weight: 650; letter-spacing: 0; display: flex; align-items: center; gap: 6px; white-space: nowrap; }
    .sec-h .sum { margin-left: auto; min-width: 0; color: var(--wa-muted); font-size: 11.5px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    /* An open card shows its rows, so the summary would only repeat them. A
       pinned card is always open and keeps its summary as a subtitle. */
    .sec[data-open="true"] .sec-h:not(.pinned) .sum { display: none; }
    .sec-h .chev { color: var(--wa-muted); opacity: .6; flex: none; transition: transform .15s ease-out; }
    .sec-h .chev svg { width: 14px; height: 14px; }
    .sec[data-open="true"] .sec-h .chev { transform: rotate(180deg); }
    .sec-b { padding: 0 0 10px; }
    .sec-b > .hint { margin: 2px 0 6px; }
    /* Rows that belong together (a bar's border settings, its scale) sit in a
       hairline box. The box reaches 8px out into the card's padding, so its rows
       keep the same title and control edges as the rows outside it, and a
       changed-setting dot moves in so it stays inside the line. */
    .fgroup {
      margin: 6px -8px; padding: 3px 8px; border-radius: 8px;
      background: color-mix(in srgb, var(--c, var(--wa-accent)) 3%, transparent);
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--c, var(--wa-accent)) 20%, transparent);
    }
    .fgroup > .hint { margin: 2px 0 6px; }
    .fgroup > .hint:last-child { margin-bottom: 4px; }
    .fgroup button.reset-dot { left: -6px; }
    .sec-b > :is(.adders, .chart-numbers, .states-switch, details.sub) { margin-top: 6px; }
    .sec-b > :is(button.small, button.link) { margin: 4px 0; }
    /* Anything in a card that is not a row (help, a note, a strip of buttons)
       starts where the controls start, so the titles keep one clean edge down
       the left. Boxes that hold rows of their own keep the full width. */
    :is(.sec-b, .sec-b :is(.fgroup, .grid2, .grid4, .value-editor, .states, .rich-parts, .part-editor, .rule-box, .case-box, .test-box, .change-box))
      > :is(.hint, .rich-note, .rich-confirm, .adders, .chips, .states-foot, .states-switch, .span-parts, button.small, button.link, select.adder, details.sub):not(.value-pop *) {
      margin-left: var(--wa-col);
    }
    /* A row whose control is a list or a strip of buttons that can wrap: the
       title stays level with the first line. */
    .field.list-field { align-items: start; }
    .field.list-field > span:first-child { padding-top: 6px; }
    .field.list-field > :not(:first-child) { grid-column: 2; }
    .field.list-field > :is(.adders, .chart-numbers, .states-foot) { margin: 0; }
    .row-acts { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; min-width: 0; }
    /* A line to read rather than change, with a title like any other row:
       what a chart reads, how big a tap is, which layers a group holds. */
    .field.readout { align-items: start; }
    .field.readout > span:first-child { padding-top: 6px; }
    .readout-v { min-width: 0; padding: 6px 0 5px; font-size: 11.5px; line-height: 1.4; color: var(--wa-muted); overflow-wrap: anywhere; }
    .field.list-field > .readout-v { padding-bottom: 2px; }
    /* The reset dot. One control, two places: in the gutter left of a changed
       setting's title, and beside a card's title for everything the card owns.
       It is drawn only while something is away from its default, so the dots
       are the list of what someone changed. The pseudo-element widens the hit
       area without widening the dot. */
    button.reset-dot {
      position: absolute; left: -9px; top: 12px; width: 6px; height: 6px; margin: 0; padding: 0;
      border: 0; border-radius: 50%; background: var(--wa-accent); cursor: pointer; flex: none;
    }
    button.reset-dot::after { content: ""; position: absolute; inset: -7px; }
    button.reset-dot:hover, button.reset-dot:focus-visible { outline: none; box-shadow: 0 0 0 3px color-mix(in srgb, var(--wa-accent) 32%, transparent); }
    .sec-h h4 button.reset-dot { position: relative; left: auto; top: auto; }
    /* A layer's name: one header row with the input in place of the summary.
       The title never wraps and the input takes what width is left, down to
       nothing, so the row stays one line in the narrowest column. */
    .name-sec .sec-h { gap: 8px; }
    .name-sec .sec-h input[type=text] {
      flex: 1 1 auto; width: 0; min-width: 0; height: 26px; min-height: 26px; padding: 0 8px; font-size: 12px;
      border-radius: 6px; border-color: transparent; background-color: var(--wa-field);
    }
    .name-sec .sec-h input[type=text]:focus-visible { border-color: var(--c); box-shadow: 0 0 0 3px color-mix(in srgb, var(--c) 28%, transparent); }
    /* Each card's "?": quiet until the header is hovered, lit while its help
       is showing. A touch screen has no hover, so there it always shows. */
    button.sec-help {
      flex: none; width: 20px; height: 20px; padding: 0; border-radius: 50%; cursor: pointer;
      font: inherit; font-size: 11px; font-weight: 700; line-height: 1; display: grid; place-items: center;
      border: 1px solid var(--wa-line-strong); background: transparent; color: var(--wa-muted);
      opacity: 0; transition: opacity .12s ease-out, color .12s ease-out, border-color .12s ease-out;
    }
    .sec-h:hover button.sec-help, button.sec-help:focus-visible, button.sec-help.on { opacity: 1; }
    button.sec-help:hover { color: var(--wa-ink); border-color: var(--wa-muted); }
    button.sec-help:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    button.sec-help.on { color: var(--wa-accent-ink); background: var(--wa-accent); border-color: transparent; }
    @media (hover: none) { button.sec-help { opacity: 1; } }
    /* Help text waits behind that "?". A plain hint shows only while its
       card's help is on; a warning, an error, or a hint marked keep (a status,
       an empty state, a step that is required) always shows. A value popover
       keeps its hints, since it has no "?" of its own to ask with. */
    .sec[data-help="off"] > .sec-b .hint:not(.warn):not(.err):not(.keep):not(.value-pop .hint) { display: none; }
    /* Shown help is quiet text, not a box: italic and muted, so a card with a
       sentence under every row still reads as one form (Jesse, 2026-09-16). */
    .sec[data-help="on"] > .sec-b .hint:not(.warn):not(.err):not(.keep):not(.value-pop .hint) {
      padding: 0 2px; font-style: italic; color: var(--wa-muted);
    }
    /* An open card with no help text in it has nothing for its "?" to show. */
    .sec[data-open="true"][data-help="off"]:not(:has(> .sec-b .hint:not(.warn):not(.err):not(.keep):not(.value-pop .hint))) button.sec-help { display: none; }
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
    /* The Extras preview: the button last pointed at, drawn on a sample chart.
       A fixed height, so the buttons under it never move as the text changes. */
    .xprev {
      display: grid; grid-template-columns: minmax(96px, 150px) minmax(0, 1fr) auto; gap: 10px; align-items: start;
      margin: 6px 0 4px; padding: 8px; border-radius: 9px; background: var(--wa-field); min-height: 74px; box-sizing: border-box;
    }
    .xprev .well {
      --k: var(--primary-color, #7c6cf0);
      display: block; aspect-ratio: 120 / 46; border-radius: 7px; overflow: hidden; background: #000;
      border: 1px solid var(--wa-line-strong); box-sizing: border-box;
    }
    .xprev svg.shot { display: block; width: 100%; height: 100%; }
    .xprev-t { display: flex; flex-direction: column; gap: 2px; font-size: 12px; color: var(--wa-muted); min-width: 0; }
    .xprev-t b { font-size: 12.5px; font-weight: 600; color: var(--wa-ink); }
    .xprev-t .xprev-why { color: var(--warning-color, #e0a100); }
    .xprev button.xprev-hide { width: 24px; height: 24px; border-radius: 6px; }
    .xprev button.xprev-hide svg { width: 15px; height: 15px; }
    button.link.xprev-show { display: inline-flex; align-items: center; gap: 5px; font-size: 12px; }
    button.link.xprev-show svg { width: 14px; height: 14px; }
    /* One row per number: the whole label opens that text layer, and the ×
       at the end deletes it. Two buttons, because one cannot sit inside the
       other. */
    .chart-numbers { display: flex; flex-direction: column; gap: 4px; }
    .chart-numbers .num-row { display: flex; align-items: flex-start; gap: 4px; }
    .chart-numbers .num-row > button.icon { flex: none; margin-top: 8px; }
    /* A row opens in place: the header stays the same button-like strip, and the
       body holds that layer's main settings under it, inside the same border. */
    .chart-numbers details.num-item { flex: 1; min-width: 0; border-radius: 8px; border: 1px solid var(--wa-line-strong); background: var(--wa-panel); }
    .chart-numbers details.num-item:hover { border-color: color-mix(in srgb, var(--primary-color, #7c6cf0) 60%, transparent); }
    .chart-numbers details.num-item > summary { list-style: none; }
    .chart-numbers details.num-item > summary::-webkit-details-marker { display: none; }
    .chart-numbers details.num-item .chev { margin-left: auto; flex: none; color: var(--wa-muted); opacity: .6; transition: transform .15s ease-out; }
    .chart-numbers details.num-item .chev svg { width: 14px; height: 14px; display: block; }
    .chart-numbers details.num-item[open] .chev { transform: rotate(180deg); }
    .chart-numbers .num-body { padding: 4px 8px 8px; border-top: 1px solid var(--wa-line-strong); }
    .chart-numbers .num-body > .chips { margin-left: var(--wa-col); margin-top: 6px; }
    .shown-head { display: flex; align-items: center; gap: 6px; margin-top: 14px; padding-top: 10px; border-top: 1px solid var(--wa-line-strong); font-size: 12px; font-weight: 600; }
    .shown-count { font-size: 11px; font-weight: 500; color: var(--wa-muted); background: var(--wa-panel); border-radius: 999px; padding: 0 7px; line-height: 18px; }
    .chart-numbers .num-pick { display: flex; align-items: center; gap: 10px; text-align: left;
      padding: 6px 8px; color: inherit; font: inherit; cursor: pointer; }
    .num-lead { flex: none; display: inline-flex; align-items: center; justify-content: center; min-width: 26px; height: 26px; padding: 0 6px;
      border-radius: 6px; background: color-mix(in srgb, currentColor 8%, transparent); font-variant-numeric: tabular-nums; font-weight: 600; font-size: 12px; }
    .num-lead svg { width: 15px; height: 15px; }
    .num-text { display: flex; flex-direction: column; min-width: 0; line-height: 1.25; }
    .num-title { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .num-kind { font-size: 11px; color: var(--wa-muted); }
    /* A chart's Readings list: one line per reading, its value now, and a
       Number and a Marker switch where the reading has one. The cells sit in
       one grid so every switch lines up down its column. */
    .field.list-field > .xreadings { margin: 0; }
    /* The On the plot and Readings tables share fixed columns, so their name,
       value and switch columns line up across both tables, not just inside one. */
    .field.list-field:has(> .xreadings) + .field.list-field:has(> .xreadings),
    .hint + .field.list-field:has(> .xreadings) { margin-top: 10px; }
    .xreadings { display: grid; grid-template-columns: minmax(0, 1fr) 52px 64px 64px; min-width: 0; }
    .xr-row { display: contents; }
    .xr-row > span { display: flex; align-items: center; min-width: 0; min-height: 28px; border-top: 1px solid var(--wa-line); }
    .xr-row > span:first-child { padding-left: 6px; }
    .xr-row > span:nth-child(n+3) { justify-content: center; }
    .xr-row > span:nth-child(2) { justify-content: flex-end; padding-right: 4px; }
    .xr-row:not(.xr-head):hover > span { background: var(--wa-field); }
    .xr-row:not(.xr-head):hover > span:first-child { border-radius: 6px 0 0 6px; }
    .xr-row:not(.xr-head):hover > span:last-child { border-radius: 0 6px 6px 0; }
    .xr-head > span {
      min-height: 20px; border-top: 0; font-size: 10.5px; font-weight: 600; letter-spacing: .04em; text-transform: uppercase; color: var(--wa-muted);
    }
    .xr-name { display: block; min-width: 0; font-size: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .xr-head .xr-name { font-size: 10.5px; }
    .xr-v { display: block; max-width: 52px; font-size: 11.5px; color: var(--wa-muted); font-variant-numeric: tabular-nums; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    button.xtog {
      display: inline-grid; place-items: center; width: 48px; height: 22px; padding: 0; border-radius: 6px; cursor: pointer;
      font: inherit; font-size: 12px; font-weight: 700; line-height: 1;
      border: 1px dashed var(--wa-line-strong); background: transparent; color: var(--wa-muted);
    }
    button.xtog svg { width: 12px; height: 12px; display: block; }
    button.xtog:hover { color: var(--wa-ink); border-color: var(--wa-muted); }
    button.xtog:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    button.xtog.on { border: 1px solid transparent; background: var(--primary-color, #7c6cf0); color: #fff; }
    button.xtog:disabled { opacity: .35; cursor: not-allowed; }
    button.xtog:disabled:hover { color: var(--wa-muted); border-color: var(--wa-line-strong); }    dialog.preset-dialog {
      width: min(420px, calc(100vw - 32px)); padding: 16px 18px 18px;
      border: 1px solid var(--wa-line); border-radius: 12px;
      background: var(--wa-card); color: var(--wa-ink);
      box-shadow: 0 12px 40px rgba(0,0,0,.4);
    }
    dialog.preset-dialog::backdrop { background: rgba(0,0,0,.45); }
    /* The dialog's one question keeps its title above the search box. */
    dialog.preset-dialog .field.entity-field { display: flex; flex-direction: column; align-items: stretch; gap: 4px; margin: 8px 0; }
    /* The keys-and-mouse help: two tables side by side when there is room,
       one under the other when there is not. */
    button.help {
      font: inherit; font-size: 14px; font-weight: 600; width: 30px; height: 30px; border-radius: 50%; cursor: pointer;
      display: inline-grid; place-items: center; padding: 0;
      border: 1px solid var(--wa-line); background: var(--wa-raised); color: var(--wa-muted);
      transition: background-color .12s ease-out, border-color .12s ease-out, color .12s ease-out;
    }
    button.help:hover { border-color: var(--wa-line-strong); background: var(--wa-panel); color: var(--wa-ink); }
    button.help:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    dialog.help-dialog {
      width: min(880px, calc(100vw - 32px)); max-height: calc(100vh - 32px); padding: 0;
      border: 1px solid var(--wa-line); border-radius: 12px;
      background: var(--wa-card); color: var(--wa-ink);
      box-shadow: 0 12px 40px rgba(0,0,0,.4);
    }
    dialog.help-dialog::backdrop { background: rgba(0,0,0,.45); }
    .help-head { display: flex; align-items: center; gap: 12px; padding: 14px 18px 4px; }
    .help-head a { font-size: 13px; color: var(--wa-accent); }
    .help-tabs { display: flex; gap: 4px; padding: 0 18px; border-bottom: 1px solid var(--wa-line); }
    .help-tabs button {
      font: inherit; font-size: 13px; font-weight: 500; padding: 8px 10px; margin-bottom: -1px; cursor: pointer;
      border: 0; border-bottom: 2px solid transparent; background: transparent; color: var(--wa-muted);
    }
    .help-tabs button:hover { color: var(--wa-ink); }
    .help-tabs button:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .help-tabs button[aria-selected="true"] { color: var(--wa-ink); border-bottom-color: var(--wa-accent); }
    /* Words rather than keys in the first column wrap, so a long name does
       not squeeze its explanation into a sliver. */
    .help-body table.terms th { white-space: normal; width: 30%; }
    .help-body section + section h3 { margin-top: 0; }
    .help-head h2 { margin: 0; font-size: 15px; font-weight: 500; }
    .help-head .spacer { flex: 1; }
    .help-body { display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: 8px 24px; padding: 14px 18px 18px; }
    .help-body h3 { margin: 0 0 6px; font-size: 11px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; color: var(--wa-muted); }
    .help-body table { border-collapse: collapse; width: 100%; font-size: 13px; }
    .help-body th { text-align: left; font-weight: 500; white-space: nowrap; padding: 5px 12px 5px 0; vertical-align: top; width: 1%; }
    .help-body td { padding: 5px 0; color: var(--wa-muted); vertical-align: top; border-top: 1px solid var(--wa-line); }
    .help-body th { border-top: 1px solid var(--wa-line); }
    .help-body tr:first-child th, .help-body tr:first-child td { border-top: 0; }
    .help-body kbd {
      font: inherit; font-size: 12px; padding: 2px 7px; border-radius: 6px;
      border: 1px solid var(--wa-line); background: var(--wa-raised); color: var(--wa-ink);
    }
    .help-body .hint { margin: 8px 0 0; }
    /* The zoomed preview: the whole window, the face as wide as it will go.
       The picture keeps its slot's aspect and never runs taller than the room
       under the bar, so a wide rectangular face on a short window still fits. */
    dialog.zoom-dialog {
      width: 100vw; max-width: 100vw; height: 100vh; max-height: 100vh; margin: 0; padding: 0; border: 0;
      background: var(--wa-bg, #111); color: var(--wa-ink);
      display: flex; flex-direction: column; overflow: hidden;
    }
    dialog.zoom-dialog::backdrop { background: rgba(0,0,0,.6); }
    .zoom-bar {
      display: flex; align-items: center; gap: 8px; padding: 10px 16px; flex: none;
      border-bottom: 1px solid var(--wa-line); background: var(--wa-card);
    }
    .zoom-bar .under { margin: 0; text-align: left; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .zoom-bar .spacer { flex: 1; min-width: 0; }
    .zoom-stage {
      flex: 1 1 auto; min-height: 0; display: grid; place-items: center; padding: 16px;
      background:
        radial-gradient(ellipse at 50% 35%, color-mix(in srgb, var(--wa-accent) 10%, transparent) 0, transparent 65%),
        radial-gradient(color-mix(in srgb, var(--wa-ink) 9%, transparent) 1px, transparent 1px) 0 0 / 18px 18px;
    }
    .zoom-stage .preview svg,
    .zoom-stage .preview.rectangular svg,
    .zoom-stage .preview.circular svg,
    .zoom-stage .preview.corner svg,
    .zoom-stage .preview.small svg,
    .zoom-stage .preview.medium svg,
    .zoom-stage .preview.large svg,
    .zoom-stage .preview.xlarge svg {
      width: min(100%, calc((100vh - 90px) * var(--wa-ratio, 1))); max-width: none;
    }
    dialog.preset-dialog h2 { margin: 0 0 4px; font-size: 15px; font-weight: 500; }
    .ok { color: var(--success-color, #43a047); }
    .warn { color: var(--warning-color, #ffa600); }
    .err, .error { color: var(--error-color, #db4437); }
    .kv { display: grid; grid-template-columns: auto 1fr; gap: 2px 12px; font-size: 13px; }
    .kv dt { opacity: .7; }
    .kv dd { margin: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .send { font-size: 12.5px; font-weight: 600; display: inline-flex; align-items: center; gap: 6px; white-space: nowrap; min-width: 0; overflow: hidden; text-overflow: ellipsis; }
    .send.sent { color: var(--wa-ent); }
    .send.sending { opacity: .7; }
    .send.offline { color: var(--warning-color, #ffa600); }
    .send.unsupported { color: var(--warning-color, #ffa600); }
    /* A phone that has not pulled yet reads the same as a watch that is not
       listening: something to do, not something wrong. */
    .send.openApp { color: var(--warning-color, #ffa600); }
    /* "last seen 2 h ago" beside a green tick. Muted, because the tick is
       still true: the change is on the watch, and this only says the watch
       stopped listening afterwards. */
    .send-note { font-size: 12px; color: var(--wa-muted); white-space: nowrap; flex: none; }
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
    /* Inside a row of adders the top margin would push it off the buttons'
       baseline; the row already spaces itself. */
    .adders select.adder { margin-top: 0; }

    /* Form rows, the way a property sheet reads: the title in a fixed column
       on the left, the control on the right, one row per setting and every
       row at least 30px, so a card reads as an even list rather than a form.
       Contexts that lay fields out another way (the dialogs, the bars under
       the preview) set their own display over this. */
    .field {
      position: relative; display: grid; grid-template-columns: var(--wa-lab) minmax(0, 1fr); align-items: center;
      gap: 4px 8px; min-height: 30px; margin: 0; font-size: 12px;
    }
    .field > span { color: var(--wa-muted); font-size: 12px; line-height: 1.25; min-width: 0; overflow-wrap: break-word; }
    .field > span.changed { color: var(--wa-ink); }
    /* A number's title drags the number. */
    .field > span.scrub { cursor: ew-resize; user-select: none; -webkit-user-select: none; touch-action: none; }
    .field > span.scrub:hover { color: var(--wa-accent); }
    /* So does an idle number box; one being typed in keeps its text cursor. */
    input[data-scrub]:not(:focus):not(:disabled) { cursor: ew-resize; touch-action: pan-y; }
    input[data-scrub].scrubbing { user-select: none; -webkit-user-select: none; }
    .field input[type=text], .field input[type=number], .field select, .field textarea { width: 100%; min-width: 0; }
    /* The controls in an inspector row: 26px, 12px text, a soft fill and no
       ring until hovered, so a card of twenty rows is not twenty boxes. */
    :is(.sec-b, .value-pop) .field :is(input[type=text], input[type=number], input[type=time], select) {
      height: 26px; min-height: 26px; padding: 0 8px; font-size: 12px; border-radius: 6px;
      border-color: transparent; background-color: var(--wa-field);
    }
    :is(.sec-b, .value-pop) .field select { padding-right: 22px; background-position: right 6px center; background-size: 12px; }
    :is(.sec-b, .value-pop) .field textarea { font-size: 12px; padding: 5px 8px; border-radius: 6px; border-color: transparent; background: var(--wa-field); }
    :is(.sec-b, .value-pop) .field input[type=number] { -moz-appearance: textfield; appearance: textfield; }
    :is(.sec-b, .value-pop) .field input[type=number]::-webkit-inner-spin-button,
    :is(.sec-b, .value-pop) .field input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
    :is(.sec-b, .value-pop) .field .ent-box input { padding-left: 28px; padding-right: 26px; }
    /* Inside a tinted section the focus ring takes the section's colour. */
    .field input:focus-visible, .field select:focus-visible, .field textarea:focus-visible { border-color: var(--c, var(--wa-accent)); box-shadow: 0 0 0 3px color-mix(in srgb, var(--c, var(--wa-accent)) 28%, transparent); }
    .field:has(> textarea) { align-items: start; }
    .field:has(> textarea) > span { padding-top: 6px; }
    .field .mono, code { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 12px; }
    /* A unit drawn faint inside the number box, after the number. */
    .num-box { position: relative; display: flex; align-items: center; min-width: 0; }
    .num-box input[type=number] { flex: 1; font-variant-numeric: tabular-nums; }
    .num-box input[type=number],
    :is(.sec-b, .value-pop) .field .num-box input[type=number] { padding-right: calc(10px + var(--wa-unit, 1) * 7px); }
    .num-box .unit { position: absolute; right: 8px; font-size: 11px; color: var(--wa-muted); opacity: .8; pointer-events: none; }
    /* A glyph before the number, such as the link on a size a part inherits. */
    .num-box .lead { position: absolute; left: 7px; display: grid; place-items: center; color: var(--wa-muted); pointer-events: none; }
    .num-box .lead svg.ui-icon { width: 12px; height: 12px; }
    .num-box.lead input[type=number],
    :is(.sec-b, .value-pop) .field .num-box.lead input[type=number] { padding-left: 24px; }
    .field.slider .slider-row { display: flex; align-items: center; gap: 8px; min-width: 0; }
    .field.slider input[type=range] { flex: 1; min-width: 50px; height: 16px; margin: 0; }
    .field.slider .slider-row > :is(.num-box, input[type=number]) { flex: none; width: 66px; }
    .field.slider .slider-row > :is(.num-box, input[type=number]):only-child { flex: 1; width: auto; }
    /* A switch is a row like any other: title left, switch at the start of
       the control column. */
    .field.check { cursor: pointer; }
    .field.check > input[type=checkbox] { justify-self: start; }
    .field.check .mixed { color: var(--wa-muted); font-size: 12px; }
    /* The entity search and the value chip are rows like any other. The line
       under the search box stays in the control column; the result list takes
       the whole width, since its rows carry a name, a room and a state. */
    .field.entity-field > :not(:first-child) { grid-column: 2; }
    /* Entity 1, Entity 2 sit in rows with a remove button, and still start
       their box at the same x as every other row in the card. */
    .row-inline .field.entity-field { grid-template-columns: var(--wa-lab) minmax(0, 1fr); gap: 4px 8px; }
    .field.value-chip-field > button.value-chip:first-child { grid-column: 1 / -1; }
    /* A colour is one box: swatch, hex, and opacity in percent. */
    .color-row { display: flex; align-items: center; gap: 8px; min-width: 0; }
    .color-box {
      flex: 1; min-width: 0; display: flex; align-items: center; gap: 6px; height: 26px; padding: 0 0 0 5px;
      border-radius: 6px; border: 1px solid transparent; background: var(--wa-field);
    }
    .color-box:hover { border-color: var(--wa-line-strong); }
    .color-box:focus-within { border-color: var(--c, var(--wa-accent)); box-shadow: 0 0 0 3px color-mix(in srgb, var(--c, var(--wa-accent)) 28%, transparent); }
    .color-box:has(input:disabled) { opacity: .5; }
    .color-swatch {
      position: relative; flex: none; width: 16px; height: 16px; border-radius: 4px; overflow: hidden; cursor: pointer;
      background: linear-gradient(var(--sw), var(--sw)), repeating-conic-gradient(#c8c8c8 0 25%, #fff 0 50%) 0 0 / 8px 8px;
      box-shadow: inset 0 0 0 1px rgba(128,128,128,.45);
    }
    .color-swatch input[type=color] { position: absolute; inset: -6px; width: auto; height: auto; opacity: 0; cursor: pointer; border: 0; padding: 0; }
    :is(.color-row, .band-row) .color-box :is(input.hex, .alpha input) {
      height: 24px; min-height: 0; border: 0; border-radius: 0; background: transparent; box-shadow: none; font-size: 12px;
    }
    :is(.color-row, .band-row) .color-box input.hex { flex: 1; min-width: 0; padding: 0; text-transform: uppercase; }
    .band-row .color-box input.hex { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
    :is(.color-row, .band-row) .color-box .alpha { flex: none; width: 50px; border-left: 1px solid var(--wa-line); }
    :is(.color-row, .band-row) .color-box .alpha input { width: 100%; padding: 0 18px 0 4px; text-align: right; }
    :is(.color-row, .band-row) .color-box :is(input.hex, .alpha input):focus-visible { box-shadow: none; outline: none; }
    /* Outside a .field row the browser's own spin arrows would eat the
       opacity box and clip "100" to "10". */
    .color-box .alpha input { -moz-appearance: textfield; appearance: textfield; }
    .color-box .alpha input::-webkit-inner-spin-button,
    .color-box .alpha input::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
    /* A gradient's bar: the gradient itself, with one chip per stop sitting on
       it where that stop is. The checkerboard behind it shows transparency, the
       same way a colour swatch does. */
    .fill-bar {
      position: relative; flex: 1; min-width: 0; height: 22px; border-radius: 6px;
      background: var(--g), repeating-conic-gradient(#c8c8c8 0 25%, #fff 0 50%) 0 0 / 8px 8px;
      box-shadow: inset 0 0 0 1px rgba(128,128,128,.45); touch-action: none;
    }
    .fill-chip {
      position: absolute; top: 50%; width: 11px; height: 11px; margin: -5.5px 0 0 -5.5px;
      border-radius: 50%; cursor: ew-resize; touch-action: none;
      background: var(--sw); box-shadow: 0 0 0 1.5px #fff, 0 0 0 2.5px rgba(0,0,0,.45);
    }
    .fill-stop-n { flex: none; width: 14px; font-size: 11px; opacity: .65; text-align: center; }
    /* A colour table: a thin bar of the bands to scale with a mark at the
       current value, then one compact row per band, lowest first. It sits in
       the control column, under the Colour row it belongs to. It is its own
       size container so a narrow inspector can drop the opacity box, which
       the eight-digit hex still carries. */
    .bands { display: grid; gap: 3px; margin: 2px 0 6px var(--wa-col); container-type: inline-size; }
    @container (max-width: 240px) {
      .band-row .color-box .alpha { display: none; }
      .band-row .color-box { padding-right: 6px; }
    }
    /* The bar is pieces with a hairline gap between them, so two close colours
       still read as two bands; each piece is at least a tenth of the bar (see
       bandLayout). With a bar border on, a piece shows its fill inside its
       border colour. Band ends are labelled under the bar. */
    .band-bar { position: relative; margin: 8px 0 4px; }
    .band-bar .bb { display: flex; gap: 2px; height: 14px; }
    .band-bar .bb i {
      display: block; flex: 0 1 0; min-width: 4px; height: 100%; border-radius: 3px;
      background: var(--f); box-shadow: inset 0 0 0 1px rgba(128,128,128,.3);
    }
    .band-bar .bb i:first-child { border-radius: 7px 3px 3px 7px; }
    .band-bar .bb i:last-child { border-radius: 3px 7px 7px 3px; }
    .band-bar .bb i:only-child { border-radius: 7px; }
    .band-bar .bb i.bordered { box-shadow: inset 0 0 0 2px var(--b); }
    .band-bar .now {
      position: absolute; top: -4px; width: 3px; height: 22px; margin-left: -1.5px; border-radius: 2px;
      background: var(--wa-ink); box-shadow: 0 0 0 1.5px var(--wa-card);
    }
    /* The stretch a chart reads, as a bracket just over the bar. */
    .band-bar .span {
      position: absolute; top: -6px; height: 3px; min-width: 3px; margin-left: -1.5px; padding-right: 3px; border-radius: 2px;
      background: var(--wa-val); box-sizing: content-box;
    }
    .band-bar .ticks { position: relative; height: 13px; margin-top: 3px; }
    .band-bar .ticks span {
      position: absolute; top: 0; transform: translateX(-50%); white-space: nowrap;
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 10px; line-height: 13px;
      color: var(--wa-muted); font-variant-numeric: tabular-nums;
    }    /* The first column is the band's range, three slots: a start box, "to" and
       an end box ("122 to 231"). The first row and the last put their words
       ("Less than", "Greater than") across the first two slots and their number
       in the end slot, so the words line up with the start boxes and every
       row's end box lines up. */
    .band-row { position: relative; display: grid; grid-template-columns: 164px minmax(0, 1fr) 22px; gap: 4px; align-items: center; min-height: 28px; }
    .band-row .range { display: grid; grid-template-columns: minmax(0, 1fr) 22px minmax(0, 1fr); align-items: center; }
    .band-row .le { grid-column: 1 / 3; font-size: 12px; color: var(--wa-muted); padding-left: 2px; white-space: nowrap; }
    .band-row .to { font-size: 12px; color: var(--wa-muted); text-align: center; }
    .band-row .range .else { grid-column: 1 / -1; }
    .band-row .else { font-size: 12px; color: var(--wa-muted); padding-left: 2px; }
    .band-row.hit .le, .band-row.hit .else { color: var(--wa-val); font-weight: 700; }
    .band-row input.band-up {
      width: 100%; min-width: 0; height: 26px; min-height: 26px; padding: 0 6px; border-radius: 6px;
      border: 1px solid transparent; background-color: var(--wa-field); box-shadow: none;
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 12px; font-variant-numeric: tabular-nums;
      -moz-appearance: textfield; appearance: textfield;
    }
    .band-row input.band-up:hover { border-color: var(--wa-line-strong); }
    .band-row input.band-up::-webkit-inner-spin-button,
    .band-row input.band-up::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
    .band-row input.band-up:focus-visible { border-color: var(--c, var(--wa-accent)); box-shadow: 0 0 0 3px color-mix(in srgb, var(--c, var(--wa-accent)) 28%, transparent); }
    .band-row.hit input.band-up { color: var(--wa-val); }
    .band-row button.reset-dot { top: 50%; margin-top: -3px; }
    /* A bars chart with a border: a Fill and a Border colour box side by side
       on every row, under small column titles. A box whose colour is the
       band's own carries a reset dot at its corner. */
    .bands.split .band-row { grid-template-columns: 164px minmax(0, 1fr) minmax(0, 1fr) 22px; }
    .band-row.band-head { min-height: 0; margin-bottom: -2px; }
    .band-row.band-head span { font-size: 10px; line-height: 12px; color: var(--wa-muted); padding-left: 2px; white-space: nowrap; }
    .band-cell { position: relative; display: flex; min-width: 0; }
    .band-cell .color-box { flex: 1; min-width: 0; }
    .band-row .band-cell button.reset-dot { left: auto; right: -2px; top: -2px; margin-top: 0; }
    @container (max-width: 470px) {
      .bands.split .band-row .color-box .alpha { display: none; }
      .bands.split .band-row .color-box { padding-right: 6px; }
    }
    /* Too narrow for a hex beside the numbers: a colour box keeps its swatch. */
    @container (max-width: 340px) {
      .band-row, .bands.split .band-row { grid-template-columns: 136px minmax(0, 1fr) 22px; }
      .bands.split .band-row { grid-template-columns: 136px minmax(28px, 1fr) minmax(28px, 1fr) 22px; }
      .band-row .range { grid-template-columns: minmax(0, 1fr) 18px minmax(0, 1fr); }
      .band-row .le { font-size: 11px; }
    }
    @container (max-width: 300px) {
      .band-row .color-box input.hex { display: none; }
    }
    .bands button.link.add-band { justify-self: start; margin-top: 2px; font-size: 12px; font-weight: 500; }
    /* The Position card's four numbers: a 2x2 grid of boxes, each with its
       letter inside at the front. The letter drags the number. */
    .xy { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 4px 6px; min-width: 0; }
    label.pf {
      position: relative; display: flex; align-items: center; height: 26px; min-width: 0;
      border-radius: 6px; border: 1px solid transparent; background: var(--wa-field);
    }
    label.pf:hover { border-color: var(--wa-line-strong); }
    label.pf:focus-within { border-color: var(--c, var(--wa-accent)); box-shadow: 0 0 0 3px color-mix(in srgb, var(--c, var(--wa-accent)) 28%, transparent); }
    label.pf .pl {
      flex: none; width: 22px; align-self: stretch; display: grid; place-items: center;
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 10.5px; font-weight: 600; color: var(--wa-muted);
      cursor: ew-resize; user-select: none; -webkit-user-select: none; touch-action: none;
    }
    label.pf .pl:hover { color: var(--wa-accent); }
    /* Scoped under .xy so it outranks the inspector's own row input style,
       now that the boxes sit inside a .field row. */
    .xy label.pf input[type=number] {
      flex: 1; min-width: 0; height: 100%; min-height: 0; padding: 0 24px 0 0; margin: 0;
      border: 0; border-radius: 0; background: transparent; box-shadow: none; color: var(--wa-ink);
      font-size: 12px; font-variant-numeric: tabular-nums; -moz-appearance: textfield; appearance: textfield;
    }
    label.pf input[type=number]::-webkit-inner-spin-button,
    label.pf input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
    label.pf input[type=number]:focus-visible { outline: none; box-shadow: none; border: 0; }
    label.pf .unit { position: absolute; right: 8px; font-size: 11px; color: var(--wa-muted); opacity: .8; pointer-events: none; }
    /* Pairs and quads stack: each field is its own label-left row. */
    .grid2, .grid4 { display: block; }
    /* Two short choices on one row, the second titled in line. */
    .pair-row { display: flex; align-items: center; gap: 8px; min-width: 0; }
    .pair-row > .seg.wide:first-of-type { flex: 1 1 auto; width: auto; }
    .pair-row > .seg.wide:last-of-type { flex: 0 0 64px; width: 64px; }
    .pair-row > span { position: relative; flex: none; padding-left: 8px; color: var(--wa-muted); font-size: 12px; }
    .pair-row > span.changed { color: var(--wa-ink); }
    .pair-row > span button.reset-dot { left: -2px; top: 50%; margin-top: -3px; }
    /* A gauge's Min or Max: the title, then the one control the Number or
       Entity switch picks, then that switch at the end of the same row. */
    .field.gauge-end { grid-template-columns: var(--wa-lab) minmax(0, 1fr) auto; }
    .gauge-end-head { display: contents; }
    .gauge-end-head > .seg { grid-column: 3; grid-row: 1; height: 24px; }
    .field.gauge-end > :not(.gauge-end-head) { grid-column: 2; grid-row: 1; margin: 0; }
    /* A table row of fields: short titles in line, no title column. */
    .row-inline { display: flex; align-items: center; gap: 8px; }
    .row-inline .field { flex: 1; min-width: 0; grid-template-columns: auto minmax(0, 1fr); gap: 6px; }
    .row-inline > button.icon { flex: none; }
    /* A narrow inspector (a column dragged in, or a small window) stacks each
       row: the title on its own line and the control under it at full width,
       instead of squeezing the control into what is left beside an 88px
       title. A switch needs no width, so it keeps its title beside it. The
       value popover keeps its own label-left rows. */
    @container insp (max-width: 360px) {
      .insp-body { --wa-col: 0px; }
      .insp-body .value-pop { --wa-col: calc(var(--wa-lab) + 8px); }
      .sec-b .field:not(.value-pop *, .row-inline *) { grid-template-columns: minmax(0, 1fr); gap: 4px; min-height: 0; padding: 3px 0; }
      .sec-b .field:not(.value-pop *, .row-inline *) > * { grid-column: 1 / -1; }
      .sec-b .field:not(.value-pop *, .row-inline *) > span:first-child { padding-top: 0; }
      .sec-b .field.check:not(.value-pop *, .row-inline *) { grid-template-columns: minmax(0, 1fr) auto; min-height: 30px; padding: 0; }
      .sec-b .field.check:not(.value-pop *, .row-inline *) > * { grid-column: auto; }
      .sec-b .field.gauge-end:not(.value-pop *) { grid-template-columns: minmax(0, 1fr) auto; }
      .sec-b .field.gauge-end:not(.value-pop *) > .gauge-end-head > :first-child { grid-column: 1; grid-row: 1; align-self: center; }
      .sec-b .field.gauge-end:not(.value-pop *) > .gauge-end-head > .seg { grid-column: 2; grid-row: 1; }
      .sec-b .field.gauge-end:not(.value-pop *) > :not(.gauge-end-head) { grid-column: 1 / -1; grid-row: 2; }
      .sec-b .readout-v { padding-top: 0; }
      /* Choices wrap onto a second line rather than clip to "A…". */
      .sec-b .seg.wide { height: auto; min-height: 24px; flex-wrap: wrap; }
      .sec-b .seg.wide button { flex: 1 0 auto; text-overflow: clip; }
      .sec-b .pair-row { flex-wrap: wrap; row-gap: 4px; }
      .sec-b .pair-row > .seg.wide:first-of-type { flex: 1 1 100%; }
    }
    .hint { font-size: 11.5px; line-height: 1.45; color: var(--wa-muted); margin: 4px 0; }
    .hint.warn { color: var(--wa-ink); }
    /* The bare .err rule sits above .hint in this sheet, so a hint that is an
       error needs both class names to win the colour. */
    .hint.err { color: var(--error-color, #db4437); }
    details.sub { margin: 6px 0; }
    details.sub summary { font-size: 12px; opacity: .8; cursor: pointer; }
    .chip { display: inline-flex; align-items: center; gap: 6px; height: 24px; font-size: 12px; font-weight: 600; padding: 0 8px; border: 1px solid var(--wa-line); border-radius: 6px; }
    .chip.ent { border-color: transparent; background: var(--wa-ent-bg); color: var(--wa-ent); }
    .chip.val { border-color: transparent; background: var(--wa-val-bg); color: var(--wa-val); }
    button.chip { font: inherit; font-size: 12px; background: transparent; color: inherit; cursor: pointer; }
    button.chip.active { background: var(--wa-accent); color: var(--wa-accent-ink); border-color: transparent; }
    .chip-add { font: inherit; font-size: 12px; padding: 2px 8px; border-radius: 999px; border: 1px dashed var(--wa-line); background: transparent; color: inherit; cursor: pointer; }
    .value-editor { margin: 0; }

    /* Value chip: one line saying what a value is, with the full form behind it.
       The form lives in a popover, which the browser draws in the top layer, so
       a scrolling card cannot clip it. Its position is set in editors.ts. */
    .value-chip-field { gap: 4px 8px; }
    button.value-chip {
      display: flex; align-items: center; gap: 8px; width: 100%;
      font: inherit; font-size: 13px; text-align: left; padding: 6px 10px; border-radius: 8px;
      border: 1px solid var(--wa-line); background: var(--wa-card);
      color: inherit; cursor: pointer;
    }
    button.value-chip:hover { border-color: var(--wa-accent); }
    button.value-chip:focus-visible { outline: 2px solid var(--wa-accent); outline-offset: 1px; }
    .value-chip .chip-text { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .value-chip .chip-now {
      max-width: 45%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
      color: var(--wa-val); font-weight: 600;
      padding: 1px 6px; border-radius: 999px; background: var(--wa-val-bg);
    }
    .value-chip .chip-caret { opacity: .55; font-size: 11px; }
    /* In an inspector row the chip is a control like the boxes above and
       below it: 26px, 12px text and the same soft fill. */
    .sec-b .field.value-chip-field:not(.compact) > button.value-chip {
      min-height: 26px; padding: 2px 8px; font-size: 12px; border-radius: 6px;
      border-color: transparent; background: var(--wa-field);
    }
    .sec-b .field.value-chip-field:not(.compact) > button.value-chip:hover { border-color: var(--wa-line-strong); }
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

    /* States table: one rule as rows. A two-state light is two lines, so the
       row has to stay one line: every control in it is sized to the text it
       holds rather than to the column. */
    /* The table scrolls sideways inside its card when a narrow inspector
       cannot fit its columns, rather than running past the card's edge. */
    .states-scroll { overflow-x: auto; margin: 8px 0 4px; }
    .states-table { width: 100%; border-collapse: collapse; margin: 0; font-size: 13px; }
    .states-table th {
      text-align: left; font-weight: 500; font-size: 11px; text-transform: uppercase; letter-spacing: .04em;
      opacity: .6; padding: 2px 6px; border-bottom: 1px solid var(--wa-line); white-space: nowrap;
    }
    .states-table th button.icon { opacity: 0; width: 18px; height: 18px; }
    /* A title with its remove button beside it sits on the same line as a
       title alone, so the header reads as one row. */
    .states-table th { height: 24px; vertical-align: middle; }
    .states-table th > :is(span, button) { vertical-align: middle; }
    .states-table th:hover button.icon, .states-table th button.icon:focus-visible { opacity: .7; }
    .states-table th.acts { width: 1%; }
    .states-table td { padding: 4px 6px; border-bottom: 1px solid color-mix(in srgb, var(--wa-line) 55%, transparent); vertical-align: middle; }
    .states-table tbody tr:last-child td { border-bottom: none; }
    .states-table td.empty-row { opacity: .6; padding: 12px 6px; border-bottom: none; }
    .states-table tr.state-row { cursor: pointer; }
    .states-table tr.state-row:hover td { background: var(--wa-panel); }
    .states-table tr.state-row.forced td { background: var(--wa-panel); }
    .states-table tr.state-row.forced td { background: color-mix(in srgb, var(--wa-states) 18%, transparent); }
    /* When shrinks to its controls, so the first setting's column and its
       header start right after it rather than far across the table. */
    .states-table :is(th, td).when { width: 1%; white-space: nowrap; }
    .states-table td.acts { width: 1%; white-space: nowrap; }
    .states-table td.acts button.icon { opacity: 0; }
    .states-table tr:hover td.acts button.icon, .states-table td.acts button.icon:focus-visible { opacity: .8; }
    .row-flag { display: inline-block; width: 12px; color: var(--success-color, #43a047); font-size: 11px; }
    tr.forced .row-flag { color: color-mix(in srgb, var(--wa-states) 70%, var(--wa-ink)); }
    /* A row reads as one sentence of controls, drawn the way the band rows
       above a chart draw theirs: the comparison is a chip with a chevron, the
       number a quiet mono box, and a set cell the same box again. */
    .when-cell { display: inline-flex; align-items: center; gap: 6px; }
    .when-cell select.when-op {
      font: inherit; font-size: 12px; font-weight: 500; height: 26px; padding: 0 22px 0 8px; border-radius: 6px;
      border: 1px solid transparent; background-color: var(--wa-field); color: inherit;
      background-size: 12px; background-position: right 5px center;
      /* Sized for its longest common label rather than its longest option, so
         the chip hugs "Greater than" instead of stretching for "Is unavailable". */
      width: 118px; text-overflow: ellipsis;
    }
    .when-cell select.when-op:hover { border-color: var(--wa-line-strong); }
    .when-and { color: var(--wa-muted); font-size: 12px; }
    .when-otherwise { display: inline-block; padding-left: 8px; line-height: 26px; color: var(--wa-muted); font-style: italic; }
    .rhs { display: inline-flex; align-items: center; gap: 2px; }
    .rhs .value-chip-field { margin: 0; }
    input.cellin {
      font: inherit; font-size: 12px; width: 90px; height: 26px; min-height: 26px; padding: 0 6px; border-radius: 6px;
      border: 1px solid transparent; background: var(--wa-field); color: inherit; box-shadow: none;
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-variant-numeric: tabular-nums;
    }
    input.cellin:hover:not(:disabled) { border-color: var(--wa-line-strong); }
    input.cellin.num { width: 64px; -moz-appearance: textfield; appearance: textfield; }
    input.cellin.num::-webkit-inner-spin-button, input.cellin.num::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
    button.more { width: 22px; height: 22px; opacity: .45; }
    button.more svg { width: 13px; height: 13px; }
    button.more:hover { opacity: .9; }
    button.cell {
      display: inline-flex; align-items: center; gap: 6px; max-width: 190px; height: 26px;
      font: inherit; font-size: 12px; font-weight: 500; text-align: left; padding: 0 8px; border-radius: 6px;
      border: 1px solid transparent; background: transparent; color: inherit; cursor: pointer;
    }
    button.cell.filled { background: var(--wa-field); }
    button.cell:hover { border-color: var(--wa-line-strong); }
    button.cell .cell-word.mono { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-variant-numeric: tabular-nums; }
    /* An empty cell is a ghost of what it would set, not a word: a dashed
       swatch, a faint icon, or a short dashed box. Hovering brings it up. */
    button.cell.empty { opacity: .55; }
    button.cell.empty:hover { opacity: .9; }
    .swatch.ghost { background: transparent; border: 1px dashed var(--wa-line-strong); }
    .ghost-icon { display: inline-flex; }
    .ghost-icon svg { width: 14px; height: 14px; }
    .ghost-box { display: inline-block; width: 26px; height: 12px; border-radius: 3px; border: 1px dashed var(--wa-line-strong); }
    .cell-word { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .swatch { width: 12px; height: 12px; border-radius: 3px; border: 1px solid var(--wa-line); flex: none; }
    button.cell svg { display: block; }
    .states-foot { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; margin-top: 6px; }
    .sec-b .field .states-foot select.chip-add {
      width: auto; flex: none; height: 26px; min-height: 26px; padding: 0 22px 0 9px; border-radius: 8px;
      border: 1px dashed var(--wa-line-strong); background-color: transparent; font-size: 12px; font-weight: 600;
    }
    .states-switch { display: flex; align-items: baseline; gap: 8px; margin-top: 8px; }
    .states-switch .hint { margin: 0; }
    /* The add controls under a states table: one strip of buttons, each with
       its explanation in its tooltip, so the table is the loudest thing here. */
    .states > .states-add { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; margin: 8px 0 2px var(--wa-col); }
    /* The column menu: the settings a state can still change, one per line. */
    .col-menu {
      position: fixed; inset: auto; margin: 0; padding: 4px; border-radius: 10px; border: 1px solid var(--wa-line-strong);
      background: var(--wa-card); color: var(--wa-ink); box-shadow: 0 8px 24px rgba(0, 0, 0, .28);
      min-width: 140px;
    }
    .col-menu:popover-open { display: flex; flex-direction: column; }
    .col-menu button {
      font: inherit; font-size: 13px; text-align: left; padding: 6px 10px; border-radius: 6px;
      border: none; background: transparent; color: inherit; cursor: pointer;
    }
    .col-menu button:hover, .col-menu button:focus-visible { background: var(--wa-panel); outline: none; }
    .confirm-row { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
    .value-chip-field.compact { margin: 0; }
    .value-chip-field.compact button.value-chip { padding: 3px 8px; font-size: 13px; max-width: 190px; }

    /* Rich text: a Parts row holding the chips in one filled box, with the
       two add buttons under it, then the part picked in the one light box the
       inspector still draws. A chip keeps the value chip's colours (entity
       teal, reading amber), so a part reads the way the same value reads
       anywhere else in the inspector. */
    .field.parts-field { align-items: start; margin: 2px 0 6px; }
    .field.parts-field > span:first-child { padding-top: 9px; }
    .part-chips {
      min-width: 0; display: flex; flex-wrap: wrap; align-items: center; gap: 4px; min-height: 34px; padding: 4px;
      border-radius: 8px; background: var(--wa-field);
    }
    .part-adds { grid-column: 2; display: flex; flex-wrap: wrap; gap: 6px; }
    .part-adds button.small {
      display: inline-flex; align-items: center; gap: 5px; min-height: 26px; padding: 0 10px 0 8px;
      font-weight: 600; color: var(--c, var(--wa-accent));
      border: 1px solid color-mix(in srgb, var(--c, var(--wa-accent)) 45%, transparent);
      background: color-mix(in srgb, var(--c, var(--wa-accent)) 12%, transparent);
    }
    .part-adds button.small:hover { background: color-mix(in srgb, var(--c, var(--wa-accent)) 22%, transparent); }
    .part-adds button.small svg.ui-icon { width: 13px; height: 13px; }
    button.part-chip {
      display: inline-flex; align-items: center; gap: 5px; max-width: 100%; height: 24px; margin: 1px 0; padding: 0 7px 0 6px;
      font: inherit; font-size: 12px; color: var(--wa-ink); cursor: pointer;
      border: 1px solid var(--wa-line); border-radius: 5px; background: var(--wa-card);
      transition: border-color .12s ease-out, box-shadow .12s ease-out;
    }
    button.part-chip:hover { border-color: var(--wa-line-strong); }
    button.part-chip:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    button.part-chip.on {
      border-color: var(--c, var(--wa-accent));
      box-shadow: 0 0 0 2px color-mix(in srgb, var(--c, var(--wa-accent)) 28%, transparent);
    }
    .part-chip .part-dot { width: 8px; height: 8px; border-radius: 2px; flex: none; box-shadow: inset 0 0 0 1px rgba(128,128,128,.35); }
    .part-chip .part-txt { min-width: 0; max-width: 120px; overflow: hidden; text-overflow: ellipsis; white-space: pre; }
    .part-chip.value .part-txt { color: var(--wa-ent); font-weight: 600; }
    .part-chip.template .part-txt { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 11.5px; }
    .part-chip .part-sp { color: var(--wa-muted); opacity: .75; }
    .part-chip .part-empty { color: var(--wa-muted); font-style: italic; }
    .part-chip .part-now {
      max-width: 80px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; padding: 0 5px; border-radius: 999px;
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 11px; font-weight: 600; line-height: 16px;
      color: var(--wa-val); background: var(--wa-val-bg);
    }
    .part-chip .part-flag {
      padding: 0 3px; border: 1px solid var(--wa-line-strong); border-radius: 3px; white-space: nowrap;
      font-size: 9.5px; font-weight: 700; line-height: 13px; color: var(--wa-muted); font-variant-numeric: tabular-nums;
    }
    /* The one box left inside a card: the part being edited. Its header is a
       strip of its own, so the rows under it line up with the card's. */
    .part-editor { margin: 0 0 6px; padding: 0 8px 4px; border-radius: 8px; border: 1px solid var(--wa-line); }
    .part-editor button.reset-dot { left: -6px; }
    .part-head {
      display: flex; align-items: center; gap: 2px; height: 30px; margin: 0 -8px 4px; padding: 0 3px 0 9px;
      border-bottom: 1px solid var(--wa-line); font-size: 11.5px; color: var(--wa-muted);
    }
    .part-head .part-title { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .part-head b { color: var(--wa-ink); font-weight: 600; }
    .part-head .spacer { flex: 1; }
    .field.check:has(> input:disabled) { cursor: default; }
    .field.check:has(> input:disabled) > span { color: var(--wa-muted); }
    .rich-note {
      margin-top: 8px; padding: 8px 10px; border-radius: 8px; font-size: 12.5px; color: var(--wa-ink);
      background: color-mix(in srgb, var(--c, var(--wa-accent)) 14%, var(--wa-card));
    }
    .rich-confirm { margin-top: 8px; padding: 10px; border-radius: 8px; font-size: 12.5px; background: var(--wa-card); box-shadow: inset 0 0 0 1px var(--wa-line-strong); }
    .rich-confirm .acts { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }

    /* Entity search, laid out the way Home Assistant's own entity list is: a
       glyph for the domain, the friendly name in full, and the things that
       tell two similar names apart (the room and the id) on a quieter second
       line. The type and the live state sit right, where the eye can run down
       one column instead of hunting.

       The glyph is the panel's own drawing, not Home Assistant's icon set, so
       a row still has a picture whatever the frontend ships. It only takes the
       accent colour when the entity is doing something, which is what makes
       the one light that is on findable in a list of forty. */
    .entity-field { position: relative; }
    .ent-box { position: relative; display: flex; align-items: center; }
    .ent-box input { width: 100%; min-width: 0; padding-left: 32px; padding-right: 30px; color: var(--wa-ent); font-weight: 500; }
    .ent-box .ent-glass { position: absolute; left: 10px; display: grid; place-items: center; color: var(--wa-muted); pointer-events: none; }
    .ent-box .ent-glass svg { width: 14px; height: 14px; display: block; }
    .ent-box.open .ent-glass { color: var(--wa-accent); }
    /* A layer that can draw nothing until it names an entity: a chart on
       recorded history, a timeline, a picture. The empty box wears a ring in
       the entity colour and keeps pulsing, so "why is my layer blank?" is
       marked where the answer gets typed. It runs without end on purpose: a
       finite pulse fires once on the first paint and never again, so anyone
       who looked away, opened another layer and came back found a plain box
       and no answer. The ring and the pulse both go the moment an id lands. */
    .ent-box.needs { border-radius: 8px; animation: wa-needs-pulse 1.8s ease-out infinite; }
    .ent-box.needs input { border-color: color-mix(in srgb, var(--wa-ent) 60%, var(--wa-line)); }
    .ent-box.needs .ent-glass { color: var(--wa-ent); }
    @keyframes wa-needs-pulse {
      0% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--wa-ent) 55%, transparent); }
      70% { box-shadow: 0 0 0 7px color-mix(in srgb, var(--wa-ent) 0%, transparent); }
      100% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--wa-ent) 0%, transparent); }
    }
    /* A chosen entity: one row in place of the search box, exactly as tall as
       the box, so the label beside it and the rows under it never move when
       one swaps for the other. The name reads in the ordinary ink, the id
       after it is the quiet half and is cut first, the state sits right. The
       row is the edit target; the x beside it removes the entity. */
    .ent-anchor { position: relative; min-width: 0; }
    .ent-chosen {
      display: flex; align-items: center; height: 26px; min-width: 0; border-radius: 6px;
      background: var(--wa-field); box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--wa-ent) 22%, transparent);
    }
    .ent-chosen:hover { box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--wa-ent) 50%, transparent); }
    button.ent-pick {
      flex: 1; min-width: 0; height: 100%; display: flex; align-items: center; gap: 7px;
      font: inherit; font-size: 12px; text-align: left; padding: 0 8px 0 4px; border: 0; border-radius: 6px;
      background: none; color: var(--wa-ink); cursor: pointer;
    }
    button.ent-pick:focus-visible { outline: none; box-shadow: inset 0 0 0 2px var(--wa-accent); }
    .ent-pick .ent-ico { width: 18px; height: 18px; border-radius: 4px; background: color-mix(in srgb, var(--wa-ent) 16%, transparent); color: var(--wa-ent); }
    .ent-pick .ent-ico.on { background: color-mix(in srgb, var(--wa-ent) 30%, transparent); }
    .ent-pick .ent-ico svg { width: 11px; height: 11px; }
    .ent-pick .ent-name { flex: 0 1 auto; min-width: 3em; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-weight: 600; }
    .ent-pick .ent-id { flex: 1 1 0; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 11px; color: var(--wa-muted); }
    .ent-pick .ent-state { flex: none; max-width: 35%; margin-left: auto; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    button.ent-clear {
      flex: none; width: 24px; height: 24px; margin-right: 1px; display: grid; place-items: center;
      padding: 0; border: none; border-radius: 5px; background: none; color: var(--wa-muted); cursor: pointer;
    }
    button.ent-clear:hover { background: var(--wa-panel); color: var(--wa-ink); }
    button.ent-clear svg { width: 12px; height: 12px; display: block; }

    .entity-results {
      border: 1px solid var(--wa-line); border-radius: 12px; margin-top: 6px; max-height: 340px; overflow: auto;
      background: var(--wa-raised); padding: 4px; box-shadow: 0 10px 28px rgba(0,0,0,.22);
    }
    /* In an inspector card the list floats over the rows under the box, like
       any dropdown, rather than pushing the card taller. The card clips its
       rounded corners, so it stops clipping while a search is open. Dialogs
       and the value popover keep the list in the flow, where a float would
       be cut off at their own edge. */
    .sec:has(.ent-box.open) { overflow: visible; }
    .sec-b .ent-anchor:not(.value-pop *) > .entity-results {
      position: absolute; top: calc(100% + 4px); left: 0; right: 0; z-index: 40; margin: 0;
      background: var(--wa-card); border-color: var(--wa-line-strong, var(--wa-line));
      box-shadow: 0 14px 36px rgba(0,0,0,.45);
    }
    button.ent {
      display: flex; align-items: center; gap: 10px; width: 100%; border-radius: 9px;
      font: inherit; font-size: 13px; text-align: left; padding: 7px 8px;
      background: none; border: none; color: inherit; cursor: pointer;
      transition: background-color .1s ease-out;
    }
    button.ent:hover, button.ent.hl { background: color-mix(in srgb, var(--wa-accent) 14%, var(--wa-card)); }
    button.ent.hl { box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--wa-accent) 45%, transparent); }
    /* The glyph tile. A fixed square keeps every name on the list starting at
       the same x, which is most of why the list reads as a column. */
    .ent-ico {
      flex: none; width: 30px; height: 30px; border-radius: 8px; display: grid; place-items: center;
      background: color-mix(in srgb, var(--wa-ink) 7%, transparent); color: var(--wa-muted);
    }
    .ent-ico.on { background: color-mix(in srgb, var(--wa-accent) 20%, transparent); color: var(--wa-accent); }
    .ent-ico svg { width: 17px; height: 17px; display: block; }
    .ent .ent-main { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 1px; }
    .ent .ent-name { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-weight: 600; color: var(--wa-ink); }
    .ent .ent-sub { display: flex; align-items: baseline; gap: 6px; min-width: 0; font-size: 11px; }
    .ent .ent-area { flex: none; color: var(--wa-muted); }
    /* The room and the id are one line, and the id is the half that may be
       cut: the room is short and the id's tail is the least useful part. */
    .ent .ent-area + .ent-id::before { content: "·"; margin-right: 6px; opacity: .5; }
    .ent .ent-id { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--wa-muted); }
    .ent .ent-right { flex: none; display: flex; flex-direction: column; align-items: flex-end; gap: 1px; max-width: 40%; }
    .ent .ent-type { font-size: 11px; color: var(--wa-muted); white-space: nowrap; }
    .ent .ent-state {
      font-size: 11px; font-weight: 600; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
      color: var(--wa-val);
    }
    /* The line under the search box: which entity this layer holds, and what
       it says right now. It is the one place both tokens sit side by side, so
       it is also the key to reading them everywhere else. */
    .entity-current {
      display: flex; gap: 6px; align-items: center; font-size: 12px; margin: 0 0 2px;
      padding: 3px 8px 3px 4px; border-radius: 6px;
      border: 1px solid color-mix(in srgb, var(--wa-ent) 28%, var(--wa-line)); background: var(--wa-ent-bg);
    }
    .entity-current .ent-ico { width: 20px; height: 20px; border-radius: 5px; background: color-mix(in srgb, var(--wa-ent) 18%, transparent); color: var(--wa-ent); }
    .entity-current .ent-ico.on { background: color-mix(in srgb, var(--wa-ent) 28%, transparent); color: var(--wa-ent); }
    .entity-current .ent-ico svg { width: 12px; height: 12px; }
    .entity-current .ent-name { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--wa-ent); font-weight: 600; }
    .entity-current .ent-area { flex: none; color: var(--wa-muted); }
    .entity-current .ent-state { flex: none; max-width: 40%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

    /* The two tokens, wherever a run of ordinary prose has to name an entity
       or print what it reads. Everything that shows a live value ends up
       here, so the colour never has to be repeated by hand. */
    .ent-tok { color: var(--wa-ent); font-weight: 600; }
    .val-tok, .entity-current .ent-state, .ent-pick .ent-state, .vchip .val, .chart-numbers b, .hint .nums, .readout-v .nums {
      color: var(--wa-val); font-weight: 600;
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: .95em;
    }

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
    @media (prefers-reduced-motion: reduce) { * { transition: none !important; } .ent-box.needs { animation: none; } }
  `;

  // ── lifecycle ─────────────────────────────────────────────────────────

  /**
   * A dropdown lets go of focus as soon as an option is picked. Kept focused,
   * it went on taking the arrow keys meant for the selected layer, and the
   * first press on the face afterwards had to take the focus away before the
   * drag could begin. One listener on the shadow root covers every select the
   * panel draws, the zoom dialog's included, since `change` bubbles to it.
   */
  protected override firstUpdated(changed: PropertyValues) {
    super.firstUpdated(changed);    this.renderRoot.addEventListener("change", (e) => {
      const el = e.target as HTMLElement | null;
      if (el?.tagName === "SELECT") el.blur();
    });
  }

  override connectedCallback() {
    super.connectedCallback();
    this.clearLegacyPickerHidden();
    this.loadColumnWidths();
    this.loadListView();
    this.loadGrid();
    this.sizeObserver.observe(this);
    window.addEventListener("keydown", this.keyHandler);
    window.addEventListener("keyup", this.keyUpHandler);
    window.addEventListener("blur", this.blurHandler);
    window.addEventListener("beforeunload", this.beforeUnload);
    window.addEventListener("pointerdown", this.pressStart, { capture: true });
    window.addEventListener("pointerup", this.pressEnd, { capture: true });
    window.addEventListener("pointercancel", this.pressEnd, { capture: true });
    window.addEventListener("click", this.sharedValueOutside, { capture: true });
    window.addEventListener("focusin", this.sharedValueFocus);
    this.addEventListener(SCRUB_START, this.scrubStart);
    this.addEventListener(SCRUB_END, this.scrubEnd);
    window.addEventListener("hashchange", this.takeShareLink);
    this.takeShareLink();
    void this.loadOwners();
    this.watchStatusTimer = window.setInterval(() => void this.refreshWatchStatus(), WATCH_STATUS_MS);
  }

  /** Watches the panel itself, not the window, so opening or closing the Home
   * Assistant sidebar re-fits the columns too. */
  /** Edge fades on the three boxes that scroll on their own. */
  private fades = new ScrollFades();

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

  // ── snap to grid ──────────────────────────────────────────────────────

  private loadGrid() {
    try {
      const raw = window.localStorage.getItem(GRID_STORE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw) as { on?: unknown; step?: unknown; lines?: unknown; layers?: unknown };
      if (typeof saved.on === "boolean") this.snapGrid = saved.on;
      if ((GRID_STEPS as readonly unknown[]).includes(saved.step)) this.gridStep = saved.step as number;
      if (typeof saved.lines === "boolean") this.showGridLines = saved.lines;
      if (typeof saved.layers === "boolean") this.snapLayers = saved.layers;
    } catch {
      /* A browser with storage off keeps the defaults. */
    }
  }

  private setGrid(on: boolean, step: number, lines = this.showGridLines, layers = this.snapLayers) {
    this.snapGrid = on;
    this.gridStep = step;
    this.showGridLines = lines;
    this.snapLayers = layers;
    try {
      window.localStorage.setItem(GRID_STORE_KEY, JSON.stringify({ on, step, lines, layers }));
    } catch {
      /* Storage off: the settings still hold for this visit. */
    }
  }

  /** What a drag passes to the gesture: the grid, and whether snapping is on
   * before Alt flips it. */
  private snapTarget(family: DrawableFamily): { snap: { step: Grid; on: boolean } } {
    return { snap: { step: gridFor(this.gridStep, DESIGN_BOX[family]), on: this.snapGrid } };
  }

  /**
   * The lines a drag on this shape can land on: the edges and middles of every
   * other layer the shape draws, plus the face's own middle lines. The layers
   * being dragged are left out (a layer cannot line up with itself), and so are
   * the ones hidden here, which are not on the face to line up with.
   */
  private guideTarget(family: DrawableFamily, moving: readonly string[]): { guides?: Guides } {
    const cfg = this.canvasConfig();
    if (!this.snapLayers) return {};
    const others = cfg === undefined ? [] : ownedElements(cfg, family)
      .filter((el) => !moving.includes(el.payload.id) && !isAttachedTap(cfg, el))
      .map((el) => effectivePlacement(cfg, family, el))
      .filter((p) => !p.isHidden)
      .map((p) => p.frame);
    return { guides: { lines: guideCandidates(others), threshold: guideThreshold(DESIGN_BOX[family]) } };
  }

  /** What a gesture reports its guides through: straight onto the canvas. */
  private guideSink(): { onGuides: (lines: readonly GuideLine[]) => void } {
    return { onGuides: (lines) => { this.guides = lines; } };
  }

  // ── how the Layers list is shown ──────────────────────────────────────

  private loadListView() {
    try {
      const raw = window.localStorage.getItem(LIST_STORE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw) as { thumbStep?: unknown; detail?: unknown; addOpen?: unknown; addDetail?: unknown };
      if (saved.thumbStep === 0 || saved.thumbStep === 1 || saved.thumbStep === 2) this.thumbStep = saved.thumbStep;
      if (saved.detail === "compact" || saved.detail === "expanded") this.layerDetail = saved.detail;
      if (typeof saved.addOpen === "boolean") this.addOpen = saved.addOpen;
      if (saved.addDetail === "compact" || saved.addDetail === "expanded") this.addDetail = saved.addDetail;
    } catch {
      /* A browser with storage off keeps the defaults. */
    }
  }

  private saveListView() {
    try {
      window.localStorage.setItem(LIST_STORE_KEY, JSON.stringify({
        thumbStep: this.thumbStep, detail: this.layerDetail,
        addOpen: this.addOpen, addDetail: this.addDetail,
      }));
    } catch {
      /* Storage off: the choice still holds for this visit. */
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
    this.fades.disconnect();
    window.removeEventListener("keydown", this.keyHandler);
    window.removeEventListener("keyup", this.keyUpHandler);
    window.removeEventListener("blur", this.blurHandler);
    window.removeEventListener("beforeunload", this.beforeUnload);
    window.removeEventListener("pointerdown", this.pressStart, { capture: true });
    window.removeEventListener("pointerup", this.pressEnd, { capture: true });
    window.removeEventListener("pointercancel", this.pressEnd, { capture: true });
    window.removeEventListener("click", this.sharedValueOutside, { capture: true });
    window.removeEventListener("focusin", this.sharedValueFocus);
    this.removeEventListener(SCRUB_START, this.scrubStart);
    this.removeEventListener(SCRUB_END, this.scrubEnd);
    window.removeEventListener("hashchange", this.takeShareLink);
    void this.unsubscribe?.();
    if (this.templateTimer) window.clearInterval(this.templateTimer);
    if (this.debounceTimer) window.clearTimeout(this.debounceTimer);
    if (this.countdownTimer !== undefined) window.clearInterval(this.countdownTimer);
    if (this.sendTimer !== undefined) window.clearTimeout(this.sendTimer);
    if (this.watchStatusTimer !== undefined) window.clearInterval(this.watchStatusTimer);
    this.tour.stop();
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
    const canvas = DRAWABLE_FAMILIES
      .map((f) => layouts[f])
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
        // The row under the pointer belonged to the old selection's inspector.
        this.rowHoverId = undefined;
      }
      // Selecting anything at all is a move off the Control Center tab: that
      // tab draws no layers, so whatever was clicked belongs to a shape. Done
      // here rather than at each call site, since a layer is selected from the
      // list, the face, the keyboard, a paste and a preset.
      if (this.inspect.kind !== "general") this.controlView = false;
    }
  }

  protected override updated(changed: PropertyValues) {    // Every render can change what is in a scroll box, so the edge fades are
    // re-measured here rather than only on the first one.
    this.fades.refresh([
      this.renderRoot.querySelector<HTMLElement>(".column.inspector"),
      this.renderRoot.querySelector<HTMLElement>(".layers"),
      this.renderRoot.querySelector<HTMLElement>(".column.canvas"),
    ]);
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
    // The zoom dialog is only in the tree while open, and a native dialog
    // needs showModal() for the backdrop and the Escape key.
    if (changed.has("zoomed") && this.zoomed) {
      const dialog = this.renderRoot.querySelector<HTMLDialogElement>("dialog.zoom-dialog");
      if (dialog && !dialog.open) dialog.showModal();
    }
    if (changed.has("helpOpen") && this.helpOpen) {
      const dialog = this.renderRoot.querySelector<HTMLDialogElement>("dialog.help-dialog");
      if (dialog && !dialog.open) dialog.showModal();
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
    const focused = e.composedPath()[0] as HTMLElement | undefined;
    const inField = !!focused?.tagName?.match(/INPUT|TEXTAREA|SELECT/) || focused?.isContentEditable === true;
    // A slider, a checkbox or a select keeps the focus after it is used, so
    // "inField" alone made every editing shortcut dead until the user clicked
    // somewhere blank: drag a rotation slider, press undo, nothing happens.
    // Only somewhere text is typed needs to keep its own keys.
    const inTextField =
      inField &&
      focused?.tagName !== "SELECT" &&
      !NON_TEXT_INPUTS.test((focused as HTMLInputElement | undefined)?.type ?? "");
    const dialogOpen = this.renderRoot.querySelector("dialog[open]") !== null;
    // With nothing typed into, Escape clears the selection, the way it does in
    // a drawing app: the pick first, then the selected layer. A dialog keeps
    // its Escape (the zoomed preview closes on it).
    if (e.key === "Escape" && !inField && !dialogOpen) {
      // The row designer first: it is a mode the canvas is in, and leaving a
      // mode is what Escape is for. It puts the selection back on the list, so
      // a second Escape then clears that the ordinary way.
      if (this.rowEditList()) this.setRowEdit(undefined);
      else if (this.multi.size > 0) this.multi = new Set();
      else if (this.inspect.kind === "layer" || this.inspect.kind === "group") this.inspect = { kind: "general" };
      return;
    }
    // No key opens the help: Home Assistant answers ? with its own shortcut
    // dialog, and two dialogs on one key is worse than a button.
    // Delete and Backspace remove what is selected. Only outside a field, so
    // a Backspace in the name box stays a Backspace.
    if ((e.key === "Delete" || e.key === "Backspace") && !inField && !dialogOpen) {
      if (this.deleteSelection()) e.preventDefault();
      return;
    }
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
    // [ and ] move the page of a paged document, the way the tabs over the
    // canvas do. Bare only, and checked above the modifier gate because ⌘[ and
    // ⌘] are already bring forward and send back: the two never meet.
    if ((e.key === "[" || e.key === "]") && !inField && !dialogOpen
      && !e.metaKey && !e.ctrlKey && !e.altKey && !e.shiftKey) {
      if (this.stepPage(e.key === "]" ? 1 : -1)) {
        e.preventDefault();
        return;
      }
    }
    const mod = e.metaKey || e.ctrlKey;
    if (!mod) return;
    if (e.key === "s") {
      e.preventDefault();
      void this.save();
    } else if (e.key === "z" && !inTextField) {
      e.preventDefault();
      if (e.shiftKey) this.redo();
      else this.undo();
    } else if (e.key === "y" && !inTextField) {
      e.preventDefault();
      this.redo();
    }
    // Everything below acts on layers, so a text field keeps its own ⌘C, ⌘A
    // and the rest, and none of it runs while a dialog has the keyboard. A
    // slider or a checkbox has no use for those keys, so it does not block
    // them just because it still holds the focus.
    if (inTextField || dialogOpen) return;
    const key = e.key.toLowerCase();
    let used = true;
    if (key === "a") this.selectAll();
    else if (key === "c") this.copySelection();
    else if (key === "x") { if (this.copySelection()) this.deleteSelection(); }
    else if (key === "v") this.pasteClip();
    else if (key === "d") this.duplicateSelection();
    else if (key === "g") { if (e.shiftKey) this.ungroupSelection(); else this.groupPicked(); }
    else if (key === "h" && e.shiftKey) this.toggleHiddenSelection();
    else if (e.key === "]" || e.key === "[") this.moveSelection(e.key === "]" ? 1 : -1);
    else used = false;
    if (used) e.preventDefault();
  }

  // ── keyboard actions on the selection ─────────────────────────────────

  /** The layers a keyboard action works on: the pick when there is one, else
   * the selected layer, else the selected group's members. Rows only; an
   * attached tap goes with its owner. */
  private selectedIds(): string[] {
    const cfg = this.canvasConfig();
    if (!cfg) return [];
    if (this.multi.size > 0) return [...this.multi].filter((id) => cfg.elements.some((el) => el.payload.id === id));
    const ins = this.inspect;
    if (ins.kind === "layer") return cfg.elements.some((el) => el.payload.id === ins.id) ? [ins.id] : [];
    if (ins.kind === "group") return groupMembers(cfg, ins.id).map((m) => m.payload.id);
    return [];
  }

  /** Select the pasted or duplicated rows: one as the layer, several as a pick. */
  private selectRows(ids: string[]) {
    if (ids.length === 1) {
      this.multi = new Set();
      this.inspect = { kind: "layer", id: ids[0]! };
    } else if (ids.length > 1) {
      this.multi = new Set(ids);
    }
  }

  /** Remove the selection. Returns whether anything went, which is what
   * decides whether the key was ours. */
  private deleteSelection(): boolean {
    const ids = this.selectedIds();
    if (!this.canEdit || ids.length === 0) return false;
    // A row layer is not in `elements`, so `removeElement` would find nothing.
    // It is taken out of its list's template instead, and the list's attribute
    // list follows it out.
    const list = this.rowEditList();
    if (list) {
      this.mutate((c) => {
        const target = c.elements.find((e) => e.payload.id === list.payload.id);
        if (target?.kind !== "list") return;
        target.payload.template = target.payload.template.filter((r) => !ids.includes(r.payload.id));
        syncListAttributes(target.payload);
      });
      this.multi = new Set();
      this.inspect = { kind: "layer", id: list.payload.id };
      return true;
    }
    this.mutate((c) => { for (const id of ids) removeElement(c, id); });
    this.multi = new Set();
    this.inspect = { kind: "general" };
    return true;
  }

  private copySelection(): boolean {
    const cfg = this.draft?.config;
    const ids = this.selectedIds();
    // Copying a row layer would paste a layer of the document, which is not
    // what a row is. Nothing is copied while a row is being designed.
    if (!cfg || ids.length === 0 || this.rowEditList()) return false;
    this.clipboard = copyElements(cfg, ids, this.canvasFamily);
    return true;
  }

  /**
   * ⌘V: the copied rows onto the shape being edited, as layers of their own.
   *
   * Always copies, because a layer belongs to one shape. Rows copied on the
   * Rectangular face and pasted on the Circular one arrive scaled for the
   * round canvas and on the same spot, and are second layers from then on:
   * editing one of them cannot reach the rows it came from.
   */
  private pasteClip() {
    if (!this.canEdit || !this.clipboard) return;
    // A document with no shape has no canvas for a layer to land on, and a
    // layer nothing draws would be invisible and unreachable. Add a shape
    // first; the tab bar's adders are on screen.
    const cfg = this.draft?.config;
    if (cfg && cfg.supportedFamilies.length === 0) return;
    const clip = this.clipboard;
    const family = this.canvasFamily;
    const paged = cfg ? usesPages(cfg) : false;
    const page = this.page;
    let landed: string[] = [];
    this.mutate((c) => {
      landed = pasteElementsOnto(c, clip, family);
      settleArrivedPages(c, new Set(landed), paged, page);
    });
    this.selectRows(landed);
  }

  /** ⌘D: a copy of the selection straight into the document, the clipboard
   * left alone, so a paste later still gives what was copied. */
  private duplicateSelection() {
    const cfg = this.draft?.config;
    const ids = this.selectedIds();
    if (!cfg || !this.canEdit || ids.length === 0) return;
    const clip = copyElements(cfg, ids);
    let pasted: string[] = [];
    this.mutate((c) => { pasted = pasteElements(c, clip); });
    this.selectRows(pasted);
  }

  /** ⌘A: every row on this shape into the pick, groups and all. The list is
   * this shape's layers, so the select-all is too. */
  private selectAll() {
    const cfg = this.draft?.config;
    if (!cfg) return;
    const ids = ownedElements(cfg, this.canvasFamily).filter((el) => !isAttachedTap(cfg, el)).map((el) => el.payload.id);
    if (ids.length === 0) return;
    if (ids.length === 1) this.selectRows(ids);
    else this.multi = new Set(ids);
  }

  /** ⇧⌘G: dissolve the selected group, or the group the selected layer is in. */
  private ungroupSelection() {
    const cfg = this.draft?.config;
    if (!cfg || !this.canEdit) return;
    const ins = this.inspect;
    const gid = ins.kind === "group" ? ins.id : ins.kind === "layer" ? groupOf(cfg, ins.id)?.id : undefined;
    if (gid === undefined) return;
    this.mutate((c) => ungroup(c, gid));
    if (ins.kind === "group") this.inspect = { kind: "general" };
  }

  /** ⇧⌘H: hide the selection in the shape being edited, or show it again.
   * One switch for the lot: if any of them is showing, all of them hide. */
  private toggleHiddenSelection() {
    const cfg = this.draft?.config;
    const ids = this.selectedIds();
    if (!cfg || !this.canEdit || ids.length === 0) return;
    const family = this.canvasFamily;
    const els = ids.map((id) => cfg.elements.find((el) => el.payload.id === id)).filter((el): el is CElement => el !== undefined);
    const hide = els.some((el) => !effectivePlacement(cfg, family, el).isHidden);
    this.mutate((c) => { for (const id of ids) setPlacement(c, family, id, { isHidden: hide }); });
  }

  /** ⌘] and ⌘[: one step forward or back for the selected layer. */
  private moveSelection(dir: -1 | 1) {
    if (!this.canEdit || this.inspect.kind !== "layer" || this.multi.size > 0) return;
    this.moveLayer(this.inspect.id, dir);
  }

  /**
   * Swap a row with its neighbour in the Layers list. Stepping past the edge
   * of a group's block leaves the group; stepping onto a member of another
   * group joins it.
   */
  private moveLayer(id: string, dir: -1 | 1) {
    this.mutate((c) => {
      const rows = c.elements.filter((e) => !isAttachedTap(c, e));
      const taps = c.elements.filter((e) => isAttachedTap(c, e));
      const i = rows.findIndex((e) => e.payload.id === id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= rows.length) return;
      [rows[i], rows[j]] = [rows[j]!, rows[i]!];
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
    this.linkReady = true;
    void this.openPendingLink();
  }

  private async selectOwner(ownerId: string) {
    if (this.draft?.dirty && !this.confirmDiscard()) {
      this.requestUpdate();
      return;
    }
    this.ownerId = ownerId;
    this.pickerConfirmDelete = undefined;
    this.selectedId = undefined;
    this.moveTarget = undefined;
    this.moveError = undefined;
    // Nothing is known about the new watch until its list reply lands, and the
    // previous watch's status must not be shown beside it in the meantime.
    this.sendStatusKnown = false;
    this.lastSyncSeconds = undefined;
    this.pushAvailable = false;
    this.lastPushSeconds = null;
    // Default the preview to this device's own case when the app reported one.
    // A manual dropdown pick survives record switches but re-defaults when a
    // different device is selected: that's the device being previewed now. The
    // case comes from the owner's kind, since the two lists share no label, and
    // switching between a watch and a phone falls back to the reference device
    // of the new kind. No phone reports a screen size today, so a phone owner
    // starts on the reference phone.
    const owner = this.owners.find((o) => o.owner_watch_id === ownerId);
    const phone = deviceKindOf(owner) === "iphone";
    const cases: PreviewCase[] = phone ? PHONE_CASES : CASES;
    const reported = phone ? phoneCaseForScreenSize(owner?.screen_size) : caseForScreenSize(owner?.screen_size);
    if (reported) this.previewCase = reported.label;
    else if (!cases.some((c) => c.label === this.previewCase)) {
      this.previewCase = (phone ? REFERENCE_PHONE : REFERENCE_CASE).label;
    }
    this.clearDraft();
    // The previous device's list must not stand in for this one's while the
    // reply is on the way: the picker is open across the switch and would read
    // as though the new device already held those complications.
    this.records = [];
    this.ownerBusy = true;
    try {
      await this.unsubscribe?.();
      this.unsubscribe = await subscribeChanges(this.hass, ownerId, () => void this.loadRecords());
      await this.loadRecords();
    } finally {
      this.ownerBusy = false;
    }
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
      this.appliedToken = reply.applied_token ?? undefined;
      this.sendStatusKnown = true;
      this.polling = reply.polling ?? false;
      this.lastPollSeconds = typeof reply.last_poll_seconds === "number" ? reply.last_poll_seconds : undefined;
      // A list reply that carries nothing about pushes says nothing about
      // them: every save reloads this list, so blanking the flag here would
      // drop the chip to "open the app" for the whole status interval right
      // after the save that sent the push.
      if (typeof reply.push_available === "boolean") this.pushAvailable = reply.push_available;
      if (reply.last_push_seconds !== undefined) {
        this.lastPushSeconds = typeof reply.last_push_seconds === "number" ? reply.last_push_seconds : null;
      }
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
    // A different document starts on its first page, with nothing playing: the
    // page is a reading of the document on screen, not a setting of the panel.
    this.stopTour();
    this.page = 1;
    this.draft = undefined;
    this.compiled = undefined;
    this.compiledDocument = undefined;
    this.historySignature = "";
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
      this.startView(this.draft.config);
    } catch (err) {
      this.parseError = errText(err);
    }
    this.scheduleTemplates(0);
  }

  /** Open a document that is not on the server yet. False when the user was
   * asked to discard unsaved work and said no, so a caller with a dialog full
   * of answers (Import) can leave it standing rather than throwing it away. */
  private startNew(config: CustomComplicationConfig): boolean {
    if (this.draft?.dirty && !this.confirmDiscard()) return false;
    this.selectedId = config.id;
    this.clearDraft();
    this.forced = new Map();
    this.inspect = { kind: "general" };
    this.savedName = undefined;
    this.draft = new Draft(config, null);
    this.recompile();
    this.ensureActiveFamily();
    this.startView(config);
    this.scheduleTemplates(0);
    return true;
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

  private watchStatusTimer?: number;

  /**
   * Re-read whether the watch is listening, on a slow clock.
   *
   * The store's change events cover every edit, but a watch that simply stops
   * polling, or starts again without applying anything new, changes nothing in
   * the store and fires nothing. Without this the chip is frozen at whatever
   * the last list said, so a green "On watch" outlived the watch it was about.
   * Skipped while a send is being waited on, which has its own faster clock.
   */
  private async refreshWatchStatus() {
    if (!this.ownerId || this.sendPending) return;
    try {
      const reply = await fetchWatchStatus(this.hass, this.ownerId);
      this.polling = reply.polling;
      this.lastPollSeconds = typeof reply.last_poll_seconds === "number" ? reply.last_poll_seconds : undefined;
      this.lastSyncSeconds = typeof reply.last_sync_seconds === "number" ? reply.last_sync_seconds : undefined;
      // Absent on an integration older than the push: no token, so no push.
      this.pushAvailable = reply.push_available === true;
      this.lastPushSeconds = typeof reply.last_push_seconds === "number" ? reply.last_push_seconds : null;
      this.serverToken = reply.token;
      this.appliedToken = reply.applied_token ?? undefined;
      this.sendStatusKnown = true;
    } catch {
      // A dropped socket or an integration without the command: the chip keeps
      // what it had rather than blaming the watch for a panel problem.
    }
  }

  /** Start (or restart) the wait for the owner's ack. Ends on the ack via
   * the subscription, or on the timeout, whichever comes first. A phone waits
   * longer: its push is debounced, delivered by APNs, and only then pulled. */
  private beginSendWait() {
    if (this.sendTimer !== undefined) window.clearTimeout(this.sendTimer);
    this.sendPending = true;
    this.sendTimer = window.setTimeout(() => {
      this.sendTimer = undefined;
      this.sendPending = false;
      // The watch may have stopped polling meanwhile; refresh so the button
      // says "not connected" rather than offering a wake that goes nowhere.
      void this.loadRecords();
    }, sendWaitMs(this.selectedOwner?.device_kind));
  }

  private endSendWait() {
    if (this.sendTimer !== undefined) window.clearTimeout(this.sendTimer);
    this.sendTimer = undefined;
    this.sendPending = false;
  }

  /** Wake the watch's parked long-poll so it is handed the current token
   * again, or send a phone owner the push again. The store does not change;
   * the ack does the rest. */
  private async sendToWatch() {
    if (!this.ownerId) return;
    try {
      const reply = await nudgeWatch(this.hass, this.ownerId);
      this.polling = reply.polling;
      this.lastPollSeconds = typeof reply.last_poll_seconds === "number" ? reply.last_poll_seconds : undefined;
      if (typeof reply.push_available === "boolean") this.pushAvailable = reply.push_available;
      this.serverToken = reply.token;
      this.appliedToken = reply.applied_token ?? undefined;
      this.sendStatusKnown = true;
      // A push that went out is worth waiting on whatever the tokens say: a
      // phone that has never acked is reachable, unlike a watch that has not.
      if (reply.pushed === true) {
        this.beginSendWait();
      } else if (typeof reply.applied_token === "number" && reply.applied_token !== reply.token) {
        // A watch that has never acked is not behind, it is not listening.
        // Waiting for an ack it cannot send would only spin the chip.
        this.beginSendWait();
      }
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
      lastPollSeconds: this.lastPollSeconds,
      deviceKind: this.selectedOwner?.device_kind,
      lastSyncSeconds: this.lastSyncSeconds,
      pushAvailable: this.pushAvailable,
    });
    // Before the first reply nothing is known about this device, and the chip
    // would otherwise report the never-acked state as if it were an answer.
    if ((s.kind === "unsupported" || s.kind === "openApp") && !this.sendStatusKnown) return nothing;
    const d = describeSend(s);
    const resend = d.resend && this.hass.user?.is_admin
      ? html`<button class="ghost" title="Wake the watch again" @click=${() => void this.sendToWatch()}>Resend</button>`
      : nothing;
    // The phone's half of the same button: the nudge sends it another push.
    const refresh = d.refresh && this.hass.user?.is_admin
      ? html`<button class="ghost" title="Send the phone a push so it pulls this now. iOS decides when the widget redraws; opening the app or tapping the widget redraws it at once." @click=${() =>
          void this.sendToWatch()}>Refresh now</button>`
      : nothing;
    return html`<span class="send ${s.kind}" title=${d.title}>${s.kind === "sent" ? "✓ " : ""}${d.label}</span>${
      d.note ? html`<span class="send-note" title=${d.title}>${d.note}</span>` : nothing}${resend}${refresh}`;
  }

  /** The store refuses a document whose slot is outside 0..MAX_SLOTS-1. */
  private get slotChosen(): boolean {
    const slot = this.draft?.config.slotIndex ?? -1;
    return slot >= 0 && slot < MAX_SLOTS;
  }


  // ── draft mutation ────────────────────────────────────────────────────

  private mutate(mutateFn: (cfg: CustomComplicationConfig) => void, coalesce?: string) {
    if (!this.draft || !this.canEdit) return;
    // The shape on screen is where a layer this edit added belongs. The draft
    // settles that after every change, so no call site has to say so.
    this.draft.update(mutateFn, coalesce, this.canvasFamily);
    this.afterMutation();
  }

  private afterMutation() {
    this.version++;
    // Every change to the document goes through here, undo and redo included,
    // so this is the one place the page has to be pulled back inside a document
    // that just lost a page. A change also ends any tour: the author is editing
    // now, and a canvas that keeps moving under the edit is a canvas fighting
    // back.
    this.stopTour();
    this.clampPage();
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
    // History has to be watched separately from the document. A chart drawing
    // history compiles no Jinja, so widening its span or pointing it at another
    // entity leaves the document byte-identical, and testing the document alone
    // left the new series waiting for the 30-second heartbeat.
    const historySignature = chartHistorySignature(this.draft.config);
    if (this.compiled?.document !== this.compiledDocument || historySignature !== this.historySignature) {
      this.compiledDocument = this.compiled?.document;
      this.historySignature = historySignature;
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
    const resolver = new Resolver(this.buildContext(), this.draft?.config);
    return {
      hass: this.hass,
      config: this.draft!.config,
      icons: this.icons,
      symbols: this.symbols,
      pages: this.pages,
      documents: this.documentList(),
      watchAppVersion: this.selectedOwner?.app_version,
      deviceKind: deviceKindOf(this.selectedOwner),
      update: (m, c) => this.mutate(m, c),
      endGesture: () => this.draft?.endGesture(),
      resolve: (v: Value) => resolver.resolve(v),
      resolveContext: () => this.buildContext(),
      canCountDown: (v: Value) => resolver.canCountDown(v),
      historySeries: (key: string) => this.historySeries.get(key),
      historyReadings: (key: string) => this.historyReadings.get(key),
      evaluateTest: (t) => resolver.evaluateTest(t),
      liveBranch: (rule) => resolver.liveBranches([rule]).get(rule.id) ?? "none",
      forced: this.forced,
      setForced: (ruleId, branch) => this.setForced(ruleId, branch),
      activeFamily: this.activeFamily,
      setActiveFamily: (family) => { this.setRowEdit(undefined); this.activeFamily = family; this.inspect = { kind: "family" }; },
      addFamily: (family) => this.addShape(family),
      savedName: this.savedName,
      tapAreaShown: this.showTaps,
      showTapArea: (on) => this.setShowTaps(on),
      openSections: this.openSections,
      toggleSection: (id) => this.toggleSection(id),
      helpSections: this.helpSections,
      toggleHelp: (id) => this.toggleHelp(id),
      // The inspector's cross-links ("Select the chart", a group's members) go
      // to the layer's own page first, the same as a click in the Layers list.
      selectLayer:(id) => { this.multi = new Set(); this.showPageOf(id); this.inspect = { kind: "layer", id }; },
      peekLayer: (id, on) => {
        if (on) this.rowHoverId = id;
        else if (this.rowHoverId === id) this.rowHoverId = undefined;
      },
      selectValue: (id) => this.openSharedValue(id),
      beginGesture: () => this.draft?.beginGesture(),
      copiedPosition: this.copiedPosition,
      copyPosition: (position) => { this.copiedPosition = position; },
      ...(this.rowEditList() ? { rowEditListId: this.rowEditListId! } : {}),
      setRowEdit: (listId) => this.setRowEdit(listId),
    };
  }

  /**
   * The complications on the selected watch, id and name, for the "Refresh
   * complications" tap's picker.
   *
   * A deleted record is a tombstone, so it is left out along with anything that
   * carries no document at all. The list request already asks for one owner, but
   * the owner is checked again here: a picked id belongs to one watch, and a
   * watch must never be offered another device's.
   */
  private documentList(): { id: string; name: string }[] {
    return this.records
      .filter((r) => !r.deleted && r.document !== null)
      .filter((r) => r.ownerWatchId === "" || r.ownerWatchId === this.ownerId)
      .map((r) => {
        const name = typeof r.document?.name === "string" ? r.document.name.trim() : "";
        return { id: r.id.toUpperCase(), name: name === "" ? "Unnamed" : name };
      });
  }

  /**
   * Turn the preview into one cell of a list, or back into the whole face.
   *
   * Leaving puts the selection back on the list itself: the layer that was
   * selected is a row layer, which is nothing the face can show, so leaving it
   * selected would leave the inspector editing something the canvas no longer
   * draws.
   */
  private setRowEdit(listId: string | undefined) {
    if (this.rowEditListId === listId) return;
    const leaving = this.rowEditListId;
    this.cancelGesture?.();
    this.multi = new Set();
    this.rowEditListId = listId;
    if (listId === undefined && leaving !== undefined) this.inspect = { kind: "layer", id: leaving };
  }

  /** The list whose row is being designed, if it is still there. A list
   * deleted while its row was open drops the mode rather than drawing a stage
   * for a layer that is gone. */
  private rowEditList(): Extract<CElement, { kind: "list" }> | undefined {
    const id = this.rowEditListId;
    if (id === undefined) return undefined;
    const el = this.draft?.config.elements.find((e) => e.payload.id === id);
    return el?.kind === "list" ? el : undefined;
  }

  /**
   * The document the canvas draws: the complication, or one cell of a list
   * scaled up while its row is being designed.
   *
   * Everything the canvas does afterwards reads this rather than the draft, so
   * a press, a drag, a nudge and the layer outlines all agree about what is on
   * screen. The edits they make still go to the draft, where the row really
   * lives.
   */
  private canvasConfig(): CustomComplicationConfig | undefined {
    const cfg = this.draft?.config;
    if (!cfg) return undefined;
    const list = this.rowEditList();
    if (!list) return cfg;
    const sample = sampleListItem(list.payload, this.templateResults, this.listItems, Date.now() / 1000);
    return rowStageConfig(cfg, list.payload.id, this.canvasFamily, sample?.fields) ?? cfg;
  }

  // ── pages ─────────────────────────────────────────────────────────────
  // The canvas shows one page at a time, the way the watch does. Which one is
  // editor state: the document says how many pages there are and which layer
  // sits on which, and never which one was last looked at.

  /** How many pages the open document has. 1 is a document with no pages, and
   * the page is then always 1. */
  private pageCount(): number {
    const cfg = this.draft?.config;
    if (!cfg || !usesPages(cfg)) return 1;
    return clampPageCount(pagesSpecOf(cfg).count);
  }

  /**
   * Show a page, without touching a tour: this is what the tour itself calls.
   *
   * A selected layer that does not draw on the new page is dropped, and so are
   * the picked ones. A layer that cannot be seen is an invisible drag target
   * and an inspector editing something the canvas is not drawing, which reads
   * as the editor having gone wrong. `keepSelection` is the tour's exception:
   * it moves the page several times a second and settles the selection once, at
   * the end, rather than taking it away while the author watches.
   */
  private showPage(page: number, keepSelection = false) {
    const count = this.pageCount();
    const next = Math.min(Math.max(Math.trunc(page) || 1, 1), count);
    if (next === this.page) return;
    this.page = next;
    if (!keepSelection) this.dropOffPageSelection();
  }

  /** Show a page because the user asked for it, which drops any tour: a tap
   * during a tour takes over, the same rule the watch follows. */
  private setPage(page: number) {
    this.stopTour();
    this.showPage(page);
  }

  /** Drop anything selected that the showing page does not draw. Layers of the
   * row being designed are not pages' business, so a row layer (which is not in
   * `elements` at all) is left alone. */
  private dropOffPageSelection() {
    const cfg = this.draft?.config;
    if (!cfg || !usesPages(cfg)) return;
    const ins = this.inspect;
    if (ins.kind === "layer") {
      const el = cfg.elements.find((e) => e.payload.id === ins.id);
      if (el && !layerDrawsOnPage(el, this.page)) this.inspect = { kind: "general" };
    }
    if (this.multi.size === 0) return;
    const kept = [...this.multi].filter((id) => {
      const el = cfg.elements.find((e) => e.payload.id === id);
      return !el || layerDrawsOnPage(el, this.page);
    });
    if (kept.length !== this.multi.size) this.multi = new Set(kept);
  }

  /** Bring up the page a layer is pinned to. The one place the editor moves the
   * page for the user: selecting a layer you cannot see is useless, so the list
   * takes the canvas to it. */
  private showPageOf(id: string) {
    const cfg = this.draft?.config;
    if (!cfg || !usesPages(cfg)) return;
    const page = cfg.elements.find((e) => e.payload.id === id)?.payload.page;
    if (page !== undefined && page !== this.page) this.setPage(page);
  }

  /** `[` and `]`: a page back or on, wrapping. */
  private stepPage(by: 1 | -1): boolean {
    const count = this.pageCount();
    if (count <= 1) return false;
    this.setPage(((this.page - 1 + by + count) % count) + 1);
    return true;
  }

  /** Put the page back inside the document after a change. A shrink in the
   * inspector must not leave the canvas on a page that no longer exists. */
  private clampPage() {
    const count = this.pageCount();
    if (this.page > count || this.page < 1) this.showPage(this.page);
  }

  /** Play the tour in the preview, from page 1, whatever was playing. */
  private playTour() {
    const cfg = this.draft?.config;
    if (!cfg || !usesPages(cfg)) return;
    const spec = pagesSpecOf(cfg);
    if (spec.mode !== "tour") return;
    this.tourRun++;
    this.touring = true;
    this.tour.play(spec);
  }

  /** Drop a running tour and leave the page where it got to, which is the
   * watch's rule: a tap during a tour takes over from the page on screen. */
  private stopTour() {
    if (!this.touring && !this.tour.playing) return;
    this.tour.stop();
    this.touring = false;
    this.dropOffPageSelection();
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

  /** Show or hide one card's help text, the "?" in its header. */
  private toggleHelp(id: string) {
    const next = new Set(this.helpSections);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    this.helpSections = next;
  }

  // ── shapes ────────────────────────────────────────────────────────────

  /** Rule 8: the panel works only with a device at or above the release that
   * draws these documents, the per-shape watch app or the lock screen iPhone
   * app. Below it the editor is replaced by an update message, so every
   * document authored here is one the device can draw. An orphaned owner has
   * no device to report a version and is exempt: its only action is Move. */
  private get watchSupported(): boolean {
    const owner = this.selectedOwner;
    if (!owner) return true;
    return owner.is_orphan || deviceSupportsShapes(owner);
  }

  /** The shapes this owner's device can draw, which is every place the panel
   * lists shapes for the owner rather than for a document. */
  private get ownerFamilies(): FamilyKind[] {
    return familiesFor(this.selectedOwner);
  }

  /** What to call the selected owner in copy: "watch" or "iPhone". Only for
   * lines both kinds of owner read; a line about the long poll or the watch
   * face keeps its own words, because only a watch ever sees it. */
  private get deviceWord(): string {
    return deviceNoun(this.selectedOwner);
  }


  /** The canvas shape the layer controls work on. Inline has no canvas, so
   * while it is active the placement fields and drags target the document's
   * first canvas shape instead. */
  private get canvasFamily(): DrawableFamily {
    if (isDrawable(this.activeFamily)) return this.activeFamily;
    const cfg = this.draft?.config;
    return (cfg && firstDrawable(cfg)) ?? "rectangular";
  }

  /** Keep the active shape one the document has and this device offers: after
   * opening a document that lacks the previous one, after a shape is removed,
   * and on a document carrying a shape the owner has no tab for (a corner
   * layout moved onto a phone). */
  private ensureActiveFamily() {
    const cfg = this.draft?.config;
    if (!cfg) return;
    // A control-only document has no shape to be on. Its control is the only
    // view it has, so the tab goes up and nothing is selected; `activeFamily`
    // keeps whatever it held, which nothing reads while there are no shapes and
    // which the next `+ Shape` replaces.
    if (controlOnly(cfg)) {
      this.controlView = true;
      if (this.inspect.kind !== "general") this.inspect = { kind: "general" };
      return;
    }
    const offered = this.ownerFamilies;
    if (cfg.supportedFamilies.includes(this.activeFamily) && offered.includes(this.activeFamily)) return;
    this.activeFamily = supportedFamilies(cfg).find((f) => offered.includes(f)) ?? offered[0] ?? "rectangular";
  }

  /**
   * Whether the Control Center tab is what the three columns are showing.
   *
   * The flag alone is not the answer. There has to be a control to draw, the
   * device's app has to be new enough to have one at all, and nothing may be
   * selected: a click on a layer in any column, on the face or in the list,
   * moves the inspector off "general", and that click is how someone leaves
   * this view. So the three conditions live here instead of in a dozen places
   * that would each have to remember to clear the flag.
   *
   * A document with no shape is the exception, and needs neither the flag nor
   * an empty selection: it has no other view to be in, no canvas to draw and no
   * layer to click, so the control stays up whatever else happens.
   */
  private get inControlView(): boolean {
    const cfg = this.draft?.config;
    if (cfg?.control === undefined) return false;
    if (!deviceSupportsControls(this.selectedOwner?.app_version)) return false;
    if (controlOnly(cfg)) return true;
    return this.controlView && this.inspect.kind === "general";
  }

  /** The Control Center tab, clicked. */
  private openControlView() {
    this.setRowEdit(undefined);
    this.picking = false;
    this.controlView = true;
    this.inspect = { kind: "general" };
  }

  /** Which tab a freshly opened document starts on. A control-only document
   * starts on its control; everything else starts on a shape. */
  private startView(cfg: CustomComplicationConfig) {
    this.controlView = opensInControlView(cfg);
  }

  /**
   * Run a change that adds layers. Whatever it adds lands on the shape being
   * edited, because that is where a layer with no shape of its own goes.
   *
   * Kept as its own name so the call sites still read as "add this here",
   * even though the draft is what settles it now.
   *
   * On a paged document it is also where the page is settled: a layer added
   * while page N is showing belongs to page N, for every N including 1, because
   * that is the face the author is looking at. A layer that arrives carrying a
   * page of its own keeps it, which is what makes a pasted part land where it
   * was designed. Every layer is one click from "Every page" in its Position
   * card, so the guess costs nothing when it is wrong.
   */
  private addHere(change: (c: CustomComplicationConfig) => void) {
    const paged = this.draft ? usesPages(this.draft.config) : false;
    const before = new Set(this.draft?.config.elements.map((el) => el.payload.id) ?? []);
    const page = this.page;
    this.mutate((c) => {
      change(c);
      const arrived = new Set(c.elements.map((el) => el.payload.id).filter((id) => !before.has(id)));
      settleArrivedPages(c, arrived, paged, page);
    });
  }

  /**
   * What the Layers card says on a shape that has nothing on it.
   *
   * A shape starts empty, so this is the first thing anyone sees after adding
   * one. The list below it is empty too: the other shapes' layers are theirs,
   * not this one's. It offers the two ways to fill it: take a copy of a whole
   * shape's arrangement in one press, or add layers here one at a time.
   */
  /** A shape's canvas in points, for the line that says why the copy shrinks. */
  private static sizeWords(family: DrawableFamily): string {
    const box = DESIGN_BOX[family];
    return `${box.width} × ${box.height} pt`;
  }

  private renderShapeIsBlank(cfg: CustomComplicationConfig, family: DrawableFamily, edit: boolean) {
    // Nothing to say on a complication that has no layers at all: the Layers
    // card's own adders are the whole story there.
    if (cfg.elements.length === 0 || !isDrawable(this.activeFamily)) return nothing;
    if (ownedElements(cfg, family).length > 0) return nothing;
    const others = DRAWABLE_FAMILIES
      .filter((f): f is DrawableFamily => f !== family && cfg.supportedFamilies.includes(f))
      .filter((f) => shownCount(cfg, f) > 0);
    return html`<div class="blank-shape">
      <b>Nothing is on the ${familyTitle(family)} shape yet.</b>
      <div class="hint">Each shape has its own layers. The ones on the other shapes belong to
        those shapes, so they are not listed here and nothing you do here can reach them. Add
        layers below, or take a copy of another shape's arrangement.</div>
      ${edit && others.length > 0
        ? html`<div class="adders">
            ${others.map((f) => html`<button class="small primary"
              title=${`Put a copy of every layer on the ${familyTitle(f)} shape here, where it sits there, scaled to this canvas`}
              @click=${() => this.mutate((c) => copyShapeLayout(c, f, family))}>Copy the ${familyTitle(f)} layout</button>`)}
          </div>
          <div class="hint">The copies are layers of their own: editing one here changes nothing on
            the ${familyTitle(others[0]!)} shape. They are scaled on the way in, because a point is a
            point and this canvas is ${WristAssistantPanel.sizeWords(family)} against
            ${WristAssistantPanel.sizeWords(others[0]!)}, so sizes come down to match and a round
            shape pulls the layout in off its rim. Expect to nudge it by hand afterwards.</div>`
        : nothing}
    </div>`;
  }

  private addShape(family: FamilyKind) {
    // The tabs and the New dialog already list only what this device draws;
    // this is the one gate every other way in goes through.
    if (!this.ownerFamilies.includes(family)) return;
    this.mutate((c) => addFamily(c, family));
    this.activeFamily = family;
    this.controlView = false;
    this.inspect = { kind: "family" };
  }

  private removeShape(family: FamilyKind) {
    const cfg = this.draft?.config;
    if (!cfg || !canRemoveFamily(cfg, family)) return;
    // Taking the last shape off a document with a control leaves a control and
    // nothing else, which is worth saying out loud even when the shape holds
    // nothing: the complication disappears from every widget picker.
    const last = cfg.supportedFamilies.length === 1;
    const lost = familyContentSummary(cfg, family);
    const asked = last
      ? `Remove the ${familyTitle(family)} shape? It is the last one, so the complication keeps its Control Center control and stops appearing in any widget picker.${lost.length > 0 ? ` This deletes ${lost.join(", ")}.` : ""} A shape can be added again at any time.`
      : lost.length > 0
        ? `Remove the ${familyTitle(family)} shape? This deletes ${lost.join(", ")}. They are on this shape only, so nothing else in the complication loses anything.`
        : undefined;
    if (asked !== undefined && !window.confirm(asked)) return;
    this.mutate((c) => removeFamily(c, family));
    this.ensureActiveFamily();
  }

  /**
   * "+ Control Center" in the shape bar, clicked.
   *
   * One undoable change, then the view moves to the thing that was just made,
   * which is what `addShape` does for a shape. The card's help needs no help
   * from here: `helpSections` starts the session with the control card's help
   * on, so the card the author lands on already explains its rows, and a "?"
   * they pressed to hide them earlier is a choice worth keeping.
   */
  private addControl() {
    const cfg = this.draft?.config;
    if (!cfg || cfg.control !== undefined) return;
    if (!deviceSupportsControls(this.selectedOwner?.app_version)) return;
    this.mutate((c) => { setControlShown(c, true); });
    this.openControlView();
  }

  /**
   * The x on the Control Center tab, clicked.
   *
   * Always asks, unlike a shape, whose confirmation is skipped when the shape
   * holds nothing: every control was written by hand, so there is always
   * something to lose. The tab is up while the x is reachable, so the view has
   * to move afterwards, and a document that has a removable control has a
   * shape to move to.
   */
  private removeControl() {
    const cfg = this.draft?.config;
    if (!cfg || !canRemoveControl(cfg)) return;
    const named = describeValue(cfg.control!.title, describeContext(this.host())).trim();
    if (!window.confirm(`Remove the Control Center control${named === "" ? "" : ` "${named}"`}? This deletes the control alone, so every shape keeps its layers, and a control can be added again at any time.`)) return;
    this.mutate((c) => { setControlShown(c, false); });
    this.controlView = false;
    this.ensureActiveFamily();
  }

  /** Answered entirely by the New dialog, which is what stops a watch filling
   * with documents that all read "New complication" on the wrist. */
  private createNew() {
    // Biggest first, so the shape the author lands on is the one worth drawing
    // first: the rest are trimmed down from it, never grown out of it.
    const families = biggestFirst([...this.newFamilies].filter((f) => this.ownerFamilies.includes(f)));
    const name = this.newName.trim();
    if ((families.length === 0 && !this.newControl) || name === "" || this.newNameProblem() !== undefined) return;
    this.closeNewDialog();
    const slot = this.freeSlot();
    const config = newConfig(name, slot, families);
    if (this.newControl) setControlShown(config, true);
    if (!this.startNew(config)) return;
    // The author asked for a control, so its tab is the one up on arrival and
    // its card is the one open.
    if (this.newControl) {
      this.openSections = new Set(["control"]);
      this.controlView = true;
    }
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
      // A save moves the baseline; it does not wipe undo. `draft` is the one
      // that was sent, which for Save a copy is the fresh copy rather than
      // the open document, so a copy never inherits the original's undo.
      this.draft = draft.commit(result.record.revision);
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
    await this.deleteSaved(this.selectedId, this.draft.baseRevision);
  }

  /** Delete one saved complication on the server: the open one from the
   * inspector's Delete, or any row from the picker's. A conflict on the open
   * one opens the conflict banner, as a save's would; on another row it is a
   * plain error, since there is no draft of it to reconcile. */
  private async deleteSaved(id: string, revision: number) {
    if (!this.ownerId) return;
    const open = id === this.selectedId;
    this.saving = true;
    try {
      const result = await deleteRecord(this.hass, this.ownerId, id, revision);
      if (!result.ok) {
        if (result.error === "conflict" && open) this.conflict = { current: result.current ?? null, message: result.message ?? "This complication changed on the server." };
        else this.saveError = result.message ?? result.error ?? "Delete failed";
        return;
      }
      if (open) {
        this.clearDraft();
        this.selectedId = undefined;
      }
      await this.loadRecords();
    } catch (err) {
      this.saveError = errText(err);
    } finally {
      this.saving = false;
      this.confirmDelete = false;
      this.pickerConfirmDelete = undefined;
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

  /** Recorder series for the chart and timeline layers that draw history, by
   * `chartHistoryKey` or `timelineHistoryKey`. Fetched on the same clock as the
   * templates: a chart of the last six hours does not change faster than that,
   * and each entry is a database query rather than a state read. */
  private async refreshHistorySeries() {
    const cfg = this.draft?.config;
    // `mode` is left out at numeric and `gaps` unless a chart asks, so a
    // document with no timeline and no gap chart sends exactly what it always sent.
    const wanted = cfg ? seriesRequests(cfg) : undefined;
    if (!wanted || (Object.keys(wanted.history).length === 0 && Object.keys(wanted.statistics).length === 0)) {
      if (this.historySeries.size > 0) this.historySeries = new Map();
      if (this.historyReadings.size > 0) this.historyReadings = new Map();
      return;
    }
    try {
      // Rebuilt rather than merged, so a chart the author retargeted or deleted
      // stops answering with the entity it used to point at.
      const next = await this.fetchSeries(wanted);
      this.historySeries = next.series;
      this.historyReadings = next.readings;
    } catch {
      // A failed fetch leaves the last series in place. The preview being one
      // refresh stale beats it blanking every time the recorder is busy.
    }
  }

  /**
   * Calendar events, to-do items and forecasts for the list layers that need a
   * service call, by the readable list key.
   *
   * On the templates' clock, beside the recorder fetch and for the same
   * reasons: an agenda does not change faster than that, and each key is a
   * service call. Rebuilt rather than merged, so a list whose calendar the
   * author changed stops answering with the events of the old one.
   */
  private async refreshListItems() {
    const cfg = this.draft?.config;
    const wanted = cfg ? listItemsRequests(cfg) : undefined;
    if (!wanted || Object.keys(wanted.requests).length === 0) {
      if (this.listItems.size > 0) this.listItems = new Map();
      return;
    }
    try {
      this.listItems = collectListResults(await fetchListItems(this.hass, wanted.requests));
    } catch {
      // An integration too old for the command, or one busy service call: the
      // last items stay on screen, which beats a list that blanks every time
      // one calendar is slow.
    }
  }

  /** Two commands, one Map. The two stores answer different questions but in
   * the same shape, and the keys cannot collide, so the resolver has one place
   * to look. Issued together so a slow recorder costs one wait rather than
   * two, and one command failing does not blank the other's charts. */
  private async fetchSeries(wanted: ReturnType<typeof seriesRequests>) {
    const [results, statResults] = await Promise.all([
      fetchHistorySeries(this.hass, wanted.history),
      fetchStatisticsSeries(this.hass, wanted.statistics).catch(() => ({})),
    ]);
    return collectSeriesResults({ ...results, ...statResults });
  }

  /** Wait this long after the last pick before asking the recorder, so a run
   * of changes in the Import dialog costs one query. */
  private static readonly IMPORT_HISTORY_DELAY_MS = 350;

  /**
   * History for the Import dialog's preview, drawn with the entities picked so
   * far. Its own Maps, not the open draft's: the dialog sits over an editor
   * whose charts must keep their own answers.
   *
   * Debounced, skipped when the question is the one already answered, and
   * numbered, so a slow reply about an earlier pick never lands over a newer one.
   */
  private scheduleImportHistory() {
    if (this.importHistoryTimer) window.clearTimeout(this.importHistoryTimer);
    this.importHistoryTimer = window.setTimeout(() => {
      this.importHistoryTimer = undefined;
      void this.refreshImportHistory();
    }, WristAssistantPanel.IMPORT_HISTORY_DELAY_MS);
  }

  private async refreshImportHistory() {
    const cfg = this.importOpen ? this.importPreview()?.config : undefined;
    const wanted = cfg ? seriesRequests(cfg, (id) => this.hass.states[id] !== undefined) : undefined;
    if (wanted?.signature === this.importHistoryAsked) return;
    const run = ++this.importHistoryRun;
    this.importHistoryAsked = wanted?.signature;
    if (!wanted || (Object.keys(wanted.history).length === 0 && Object.keys(wanted.statistics).length === 0)) {
      if (this.importHistory.size > 0) this.importHistory = new Map();
      return;
    }
    try {
      const next = await this.fetchSeries(wanted);
      if (run !== this.importHistoryRun) return;
      this.importHistory = next.series;
    } catch {
      // Asked again at the next pick. The picture without history is the one
      // the dialog drew before, so nothing on screen gets worse.
      if (run === this.importHistoryRun) this.importHistoryAsked = undefined;
    }
  }

  private async refreshTemplates() {
    void this.refreshHistorySeries();
    void this.refreshListItems();
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

  /**
   * One entity's live state in the shape the resolver wants. Shared by the
   * draft's context and by the picker's per-record preview contexts, so a
   * timer or a camera picture reads the same either way. `useTestValues` is
   * off for the picker: a value typed in to test the open complication must
   * not change what another one's thumbnail says.
   */
  private entityStateFor(id: string, iconName: string, useTestValues: boolean): EntityState | undefined {
    const s = this.hass.states[id];
    if (!s) return undefined;
    const attrs = s.attributes;
    const domain = id.split(".")[0] ?? "";
    const entry: EntityState = {
      entityId: id,
      // A typed test value stands in for the live state, and only here: the
      // document, the templates and the watch never see it.
      state: (useTestValues ? this.testValues.get(id) : undefined) ?? s.state,
      unitOfMeasurement: typeof attrs.unit_of_measurement === "string" ? attrs.unit_of_measurement : undefined,
      iconName,
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
    if (typeof attrs.entity_picture === "string") {
      // Image elements: the preview draws the entity's own picture URL, which is
      // a camera's tokenized proxy for a camera and the avatar or cover art for
      // everything else. Any domain can carry one, so nothing is filtered here.
      entry.entityPicture = attrs.entity_picture;
    }
    return entry;
  }

  /** The draft's context. `withTests` false reads the house as it really is,
   * for the live value a test is measured against. */
  private buildContext(withTests = true): ResolveContext {
    const entityStates = new Map<string, EntityState>();
    for (const [id, ref] of this.compiled?.entities ?? []) {
      const entry = this.entityStateFor(id, ref.iconName ?? "", withTests);
      if (entry) entityStates.set(id, entry);
    }
    const values = this.draft?.config.values ?? [];
    // Sample items for any list nothing has answered for yet, so a row can be
    // designed before the first fetch lands and before a calendar is picked.
    // Only where the key is empty: "no events today" is an answer, and drawing
    // three made-up events over it would be a lie.
    const seeded = withListSeeds(this.draft?.config, this.templateResults, this.listItems, Date.now() / 1000);
    const cfg = this.draft?.config;
    return {
      // The page the canvas is showing, and only for the document being edited.
      // Every other picture of a document stays on page 1, because none of them
      // sets `page` at all: `configContext` below draws the picker rows and the
      // import preview, and `galleryPreviewContext` in preview-png.ts draws the
      // share and gallery PNGs. A thumbnail of somebody else's complication has
      // no page anyone has chosen.
      ...(cfg && usesPages(cfg) ? { page: this.page } : {}),
      entityStates,
      templateResults: seeded.templateResults,
      listItems: seeded.listItems,
      historySeries: this.historySeries,
      namedValues: withTests ? testedNamedValues(values, this.testValues) : values,
      dataAgeSeconds: this.templateFetchedAt === undefined ? undefined : (Date.now() - this.templateFetchedAt) / 1000,
      testedEntities: withTests ? new Set(this.testValues.keys()) : new Set(),
    };
  }

  // ── preview gestures ──────────────────────────────────────────────────

  /**
   * The pick toggle, drawn over the preview beside Show taps: picking happens
   * on the face, so the switch sits with the face.
   */
  private renderPickButton() {
    const on = this.picking;
    const off = !this.draft || this.parseError !== undefined;
    return html`<button class="pick ${on ? "on" : ""}" ?disabled=${off}
      aria-pressed=${on ? "true" : "false"}
      title=${on ? "Point at the face to name a layer. Click one to select it. Escape stops." : "Point at a layer on the face to find it (Escape stops)"}
      @click=${() => this.togglePicking()}><span class="glyph">⌖</span><span class="word">${on ? "Picking…" : "Pick layer"}</span></button>`;
  }

  /** The review-mode toggle. Sits beside Pick layer because both answer a
   * question about the face rather than changing it. */
  private renderShowTapsButton() {
    const on = this.showTaps;
    return html`<button class="pick ${on ? "on" : ""}" ?disabled=${!this.draft || this.parseError !== undefined}
      aria-pressed=${on ? "true" : "false"}
      title="Show every tap area, labelled with what it does, over a dimmed face. With a layer selected, only its tap area shows, and you can drag its corners to size it."
      @click=${() => this.setShowTaps(!this.showTaps)}><span class="glyph">☞</span><span class="word">Show taps</span></button>`;
  }

  /**
   * Full colour or a tinted surface. Many watch faces draw complications in one
   * tint, keeping only how see-through each part is, so colour by value and
   * dark fills can look nothing like the full colour preview. A tinted iPhone
   * Home Screen does the opposite: the tile's ground goes and every layer is
   * painted in the tint at the brightness it was drawn in. Which one the menu
   * previews follows the shape, since a Home Screen tile is never on a watch.
   */
  private renderTintTool() {
    const on = this.previewTint;
    const current = FACE_TINTS.find((t) => t.hex === on);
    const off = !this.draft || this.parseError !== undefined;
    const phone = isHomeFamily(this.activeFamily);
    const word = phone ? "iPhone tinted" : "tint";
    const pick = (hex: string | undefined) => { this.toggleMenu("tint", false); this.previewTint = hex; };
    return html`<span class="inbox tint-box ${on !== undefined ? "on" : ""}"
      title=${phone
        ? "A tinted Home Screen drops the tile's background and paints every layer in one colour, keeping only how bright each part was. Layers in the accent group take the lighter of the two colours."
        : "Many watch faces draw complications in one colour. Colours become the face's tint, text and background turn white, and only how see-through each part is survives."}>
      <span class="pre">Colour</span>
      <span class="case-tool" data-menu="tint">
        <button class="case-pick" ?disabled=${off} aria-haspopup="listbox" aria-expanded=${this.openMenu === "tint" ? "true" : "false"}
          aria-label=${`Preview colour, ${current ? `${current.label} ${phone ? "tinted Home Screen" : "tinted face"}` : "full colour"}`} @click=${() => this.toggleMenu("tint")}>
          ${current ? html`<i class="tint-dot" style=${`--sw:${current.hex}`}></i>${current.label} ${word}` : "Full colour"}${uiIcon("chevron")}
        </button>
        ${this.openMenu === "tint" ? html`<div class="pop-menu" role="listbox" aria-label="Preview colour">
          <button class="row" role="option" aria-selected=${on === undefined ? "true" : "false"} @click=${() => pick(undefined)}>
            <i class="tint-dot full"></i>Full colour</button>
          ${FACE_TINTS.map((t) => html`<button class="row" role="option" aria-selected=${t.hex === on ? "true" : "false"}
            @click=${() => pick(t.hex)}><i class="tint-dot" style=${`--sw:${t.hex}`}></i>${t.label} ${word}</button>`)}
        </div>` : nothing}
      </span>
    </span>`;
  }

  /** The zoom toggle: open the face full-width in a modal for fine moves.
   * Inline has no face to zoom, so it has no button. */
  private renderZoomButton() {
    const off = !this.draft || this.parseError !== undefined || !isDrawable(this.activeFamily);
    return html`<button class="pick only-icon" ?disabled=${off} aria-label="Expand the preview"
      title="Open the preview as large as the window allows, for small moves. Drag and arrow keys work there too. Escape closes."
      @click=${() => { this.zoomed = true; }}>${uiIcon("expand")}</button>`;
  }

  /**
   * Line up and even out, as one strip of glyph buttons. Aligning needs
   * something selected: one layer lines up against the face, two or more
   * against the box around themselves. Evening out the gaps needs three, since
   * two layers have a single gap and nothing to even it against.
   */
  /**
   * The strip right over the face: the three face toggles and the line-up
   * buttons. They sit here rather than in the bar above because the face can
   * be a long way down a tall canvas, and a tool that acts on the selection
   * wants to be next to it.
   */
  private renderOver() {
    return html`<div class="over">
      <span class="face-tools">${this.renderPickButton()}${this.renderShowTapsButton()}</span>
      <span class="bar-sep" aria-hidden="true"></span>
      <span class="face-tools">${this.renderSnapTools()}</span>
      <span class="bar-sep" aria-hidden="true"></span>
      ${this.renderZoomButton()}
    </div>`;
  }

  /**
   * The banner over the face while a row is being designed.
   *
   * The canvas showing one cell of a list, scaled up, is a mode, and a mode
   * that is not announced reads as the face having gone wrong. So it says which
   * list is open, what the layers on screen are, and carries the way out. It
   * sits above the tools pill because it is the first thing to read.
   */
  private renderRowStrip() {
    const list = this.rowEditList();
    const cfg = this.draft?.config;
    if (!list || !cfg) return nothing;
    const ctx = describeContext(this.host());
    // The list drawn on the real face, not on the stage: on the stage the list
    // is not there at all, only the row it is made of.
    const face = resolveAll(cfg, this.buildContext(), this.forced)[this.canvasFamily];
    return html`<div class="row-strip">
      ${face
        ? html`<span class="row-strip-thumb">${renderLayerThumb(face, [list.payload.id], { icons: this.icons, imageSizes: this.imageSizes, width: THUMB_W, height: THUMB_H })}</span>`
        : nothing}
      <span class="row-strip-text">Designing the row of <b>${layerTitle(list, ctx)}</b>. Every row draws these layers.</span>
      <button @click=${() => this.setRowEdit(undefined)}>Done</button>
    </div>`;
  }

  /**
   * The page tabs over the face, on a paged document only.
   *
   * The canvas shows one page at a time because the watch does. There is no
   * "All" tab: a face that drew every page at once would be the one picture the
   * wrist can never produce, and the whole reason pages are a version gate is
   * that stacking them is what a broken paged face looks like. Layers on every
   * page simply draw on every tab.
   *
   * No adder either. Pages are turned on in the Complication card, which is
   * also where they are turned off, so one switch owns the feature and this
   * strip only ever says which page is on screen.
   */
  private renderPageStrip() {
    const cfg = this.draft?.config;
    if (!cfg || !usesPages(cfg)) return nothing;
    // Inline is one line of text with no canvas and no pages of its own, so
    // tabs there would offer to change a picture that is not being drawn.
    if (!isDrawable(this.activeFamily)) return nothing;
    const spec = pagesSpecOf(cfg);
    const playing = this.touring;
    const pinned = (page: number) =>
      cfg.elements.filter((el) => el.payload.page === page && !isAttachedTap(cfg, el)).length;
    const tourButton = html`<button class="page-act ${playing ? "on" : ""}" aria-pressed=${playing ? "true" : "false"}
      title=${playing
        ? "Stop the tour. The page stays where it got to, the way a tap on the watch takes over from a tour."
        : `Play every page once here, ${Math.round(tourDuration(spec) * 10) / 10} s in all, then back to page 1. The watch plays the same boundaries from one tap.`}
      @click=${() => { if (playing) this.stopTour(); else this.playTour(); }}>${playing ? "Stop" : "Play tour"}</button>`;
    const nextButton = html`<button class="page-act"
      title="Show the next page, the way a Next page tap does on the watch"
      @click=${() => this.setPage(nextPageAfter(spec, this.page))}>Next</button>`;
    return html`<div class="page-strip">
      <span class="page-strip-word">Page</span>
      <span class="page-tabs" role="group" aria-label="Page the canvas is showing">
        ${pageNumbers(spec).map((page) => {
          const on = page === this.page;
          const count = pinned(page);
          return html`<button class=${on ? "on" : ""} aria-pressed=${on ? "true" : "false"}
            title=${`Page ${page}: ${count} layer${count === 1 ? "" : "s"}`}
            @click=${() => this.setPage(page)}>${page}</button>`;
        })}
      </span>
      ${spec.mode === "tour" ? tourButton : nextButton}
      ${playing
        // Keyed on the run so a second press starts the bar over: a CSS
        // animation on the same element would otherwise carry on from where
        // the first tour left it.
        ? keyed(this.tourRun, html`<span class="tour-bar" aria-hidden="true"><i
            style=${`animation-duration:${Math.max(1, Math.round(tourDuration(spec) * 1000))}ms`}></i></span>`)
        : nothing}
    </div>`;
  }

  /**
   * The snapping switches, right there in the pill rather than behind a menu:
   * snap to the grid with its size beside it, draw the grid's lines, and snap
   * to the other layers. Three switches, since some people want the grid
   * alone, some the layers alone, and both start on. The grid size is a
   * percent of the face's shorter side; the longer side takes the same
   * distance in points, so cells are square.
   */
  private renderSnapTools() {
    const off = !this.draft || this.parseError !== undefined || !isDrawable(this.activeFamily);
    const grid = this.snapGrid;
    const lines = this.showGridLines;
    const layers = this.snapLayers;
    const eye = lines
      ? svg`<path d="M1.5 8s2.4-4.5 6.5-4.5S14.5 8 14.5 8 12.1 12.5 8 12.5 1.5 8 1.5 8z" /><circle cx="8" cy="8" r="1.9" />`
      : svg`<path d="M1.5 8s2.4-4.5 6.5-4.5S14.5 8 14.5 8 12.1 12.5 8 12.5 1.5 8 1.5 8z" /><path d="M2.5 13.5l11-11" />`;
    return html`<span class="grid-tool ${grid ? "on" : ""}" data-menu="grid">
      <button class="pick ${grid ? "on" : ""}" ?disabled=${off} aria-pressed=${grid ? "true" : "false"}
        title=${grid ? "Layers land on the grid when you drag them, and arrow keys move one grid step. Hold Alt to drag freely. Click to turn it off." : "Snap layers to a grid when you drag them. Without it, hold Alt while dragging to snap."}
        @click=${() => this.setGrid(!grid, this.gridStep)}><span class="glyph">▦</span><span class="word">Snap to grid</span></button>
      ${grid ? html`<button class="grid-step" ?disabled=${off} aria-haspopup="listbox" aria-expanded=${this.openMenu === "grid" ? "true" : "false"}
        aria-label=${`Grid size, ${this.gridStep * 100}%`} title="Grid size"
        @click=${() => this.toggleMenu("grid")}>${this.gridStep * 100}%${uiIcon("chevron")}</button>
      ${this.openMenu === "grid" ? html`<div class="pop-menu" role="listbox" aria-label="Grid size">
        ${GRID_STEPS.map((step) => html`<button class="row" role="option" aria-selected=${step === this.gridStep ? "true" : "false"}
          @click=${() => { this.toggleMenu("grid", false); this.setGrid(true, step); }}>${step * 100}%</button>`)}
      </div>` : nothing}` : nothing}
    </span>
    <button class="pick ${lines ? "on" : ""}" ?disabled=${off} aria-pressed=${lines ? "true" : "false"}
      title=${lines ? "Hide the grid lines. Snapping is not changed." : "Draw the grid on the face. Snapping is not changed."}
      @click=${() => this.setGrid(grid, this.gridStep, !lines)}>
      <span class="glyph"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${eye}</svg></span><span class="word">Grid lines</span></button>
    <button class="pick ${layers ? "on" : ""}" ?disabled=${off} aria-pressed=${layers ? "true" : "false"}
      title=${layers ? "Edges and middles land on the other layers' edges and middles, and on the middle of the face, with a pink line while they meet. Click to turn it off." : "Snap to the other layers' edges and middles while dragging."}
      @click=${() => this.setGrid(grid, this.gridStep, lines, !layers)}><span class="glyph">${uiIcon("guides")}</span><span class="word">Snap to layers</span></button>`;
  }

  /**
   * The full-width preview: the same face, the same gestures, drawn as wide as
   * the window allows. A native dialog brings the backdrop and Escape with it.
   * The bar keeps the two face toggles and Close; everything else stays under
   * the backdrop, which is the point.
   */
  private renderZoomDialog(family: DrawableFamily, layouts: ResolvedAll, deviceCase: PreviewCase) {
    const cfg = this.draft?.config;
    if (!cfg) return nothing;
    const slot = slotFor(deviceCase, family);
    // The picture's own aspect: the slot for rectangular and circular, and the
    // 104 × 124 screen quadrant the corner preview draws (renderer.ts).
    const ratio = family === "corner" ? 104 / 124 : slot.width / slot.height;
    return html`<dialog class="zoom-dialog" @close=${() => { this.zoomed = false; }}>
      <div class="zoom-bar">
        ${this.renderUnder(cfg, family)}
        <span class="spacer"></span>
        ${this.renderTintTool()}
        ${this.renderPickButton()}
        ${this.renderShowTapsButton()}
        ${this.renderSnapTools()}
        <button class="pick" title="Back to the editor (Escape)" @click=${() => { this.zoomed = false; }}><span class="glyph">⤡</span>Close</button>
      </div>
      <div class="zoom-stage" style=${`--wa-ratio:${ratio}`}>
        ${this.renderBigPreview(family, layouts, deviceCase)}
      </div>
    </dialog>`;
  }

  /**
   * The help: what the parts of the editor are, every shortcut and pointer
   * trick, and how a complication reaches the watch and other people. Three
   * tabs, so each stays short enough to scan. One native dialog, so Escape and
   * the backdrop come for free, the same as the zoomed preview. Opened by the ?
   * button only: the ? key belongs to Home Assistant's own shortcut dialog, and
   * taking it would stack two dialogs.
   */
  private renderHelpDialog() {
    const m = KEY_MOD;
    const s = KEY_SHIFT;
    const keys: [string, string][] = [
      [`${m}S`, "Save"],
      [`${m}Z · ${s}${m}Z`, "Undo · Redo"],
      ["Arrows · ⇧ Arrows", "Nudge the selection 1 pt · 10 pt"],
      ["Delete", "Remove the selected layer, pick or group"],
      [`${m}C · ${m}X · ${m}V`, "Copy · Cut · Paste layers, into this complication or another one opened in this tab"],
      [`${m}D`, "Duplicate the selection in place"],
      [`${m}A`, "Pick every layer"],
      [`${m}G · ${s}${m}G`, "Group the pick · Ungroup"],
      [`${m}] · ${m}[`, "Bring the layer forward · Send it back"],
      [`${s}${m}H`, "Hide or show the selection in the shape being edited"],
      ["[ · ]", "The page before · after, on a complication that has pages"],
      ["Escape", "Leave the row designer, then drop the pick, then the selection. Also stops Pick layer and closes a dialog"],
    ];
    const mouse: [string, string][] = [
      ["Click", "A layer on the face or in the list: edit it. Drag it to move, pull a corner to resize"],
      [`${MULTI_KEY}-click · ⇧-click`, "Add a layer to the pick · Pick a range of rows. Then Group them so a finished part moves as one"],
      ["Rest on a row", "Tints that layer on the face without selecting it. A group row tints every member"],
      ["Drag a row", "Reorder the list. Drop it on a group to put it inside"],
      ["Pick layer", "Point at the face to find a layer. Click it to select it"],
      ["Show taps", "Every tap area, labelled. With a layer selected, only its tap shows and its corners drag"],
      ["Snapping", "The three switches over the face. Snap to grid: layers land on a grid when you drag them, 1% by default, and arrows move one grid step; the size sits beside it. Grid lines draws the grid. Snap to layers: edges and middles land on the other layers' and on the middle of the face, with a pink line while they meet. Both snaps start on"],
      ["Alt-drag", "Flips snapping for that drag: a drag that would snap moves freely, and one that would not snaps to the grid"],
      ["Expand", "The button over the face. The face full-window, for small moves. Everything above works there too"],
      ["Locked group", "Drags as one. Unlock it in its row to move layers alone"],
      ["Timestamp chip", "On a picture layer: click it to move it, pull a corner for its size"],
    ];
    const shapes: [string, string][] = [
      ["Shapes", "Rectangular, Circular, Corner and Inline are the kinds of slot on a watch face. The watch offers a complication only in slots whose shape it has."],
      ["Shape tabs", "Above the preview. Click one to edit that shape, or a dashed one to add it."],
      ["Canvas shapes", "Rectangular, Circular and Corner each hold their own layers. A layer belongs to one shape, so editing it never changes another. An empty shape can take a copy of another shape's layers."],
      ["Corner", "Its Corner content card picks big curved text or a canvas of layers."],
      ["Inline", "One line of text with an optional symbol before it. It has no layers."],
      ["Home Screen", "On an iPhone only: Small, Medium, Large and Extra Large are the Home Screen tile sizes. Each is a canvas shape with its own layers, drawn edge to edge in the tile."],
      ["Small · Medium · Large", "A square, a wide band about twice as wide as it is tall, and a tall tile a little taller than it is wide. Add the ones you want; a size the complication does not have is not offered when you add a widget."],
      ["Extra Large", "The full-page tile, iOS 27 and later. An iPhone on iOS 26 is not offered it when adding a widget, and everything else still draws."],
      ["A tinted Home Screen", "iOS 18 lets a user tint the whole Home Screen. The system then drops the tile background and draws the design in two tones, so a design that relies on colour alone reads differently there."],
      ["The shape itself", "The bottom row of the Layers list: its background, border and Shape states."],
      ["Pages", "One complication, several faces, one showing at a time. Turn them on with Pages in the Complication card, then each layer sits on one page or on every page, which is what a background or a shared label wants. A tap action of Next page moves on a page, and Play the page tour plays each page in turn and returns to page 1. The strip above the canvas shows one page at a time, and [ and ] move between them."],
    ];
    const layers: [string, string][] = [
      ["Text", "A value: typed words, an entity, a template, a shared value and more. It can count down to a time."],
      ["Icon", "An SF Symbol or Material Design icon, or the entity's own icon."],
      ["Gauge", "A number drawn between a minimum and a maximum."],
      ["Chart", "Recent history as bars, a line or an area."],
      ["Timeline", "Which state an entity was in over time, as a coloured strip."],
      ["Shape", "A rectangle, rounded rectangle, capsule, circle or line."],
      ["Picture", "A camera snapshot, or an entity's picture such as a person's avatar or album art."],
      ["Tap area", "Invisible. A tap inside it runs its own action. Outside it, the complication's tap action applies."],
      ["Extras", "Clock times, chart dots, a chart grid and a picture's timestamp are added from their layer's Extras card."],
      ["Order", "The top of the Layers list draws on top. Drag a row to reorder."],
      ["Groups", `A set of layers kept together in the list. Pick some and press ${m}G. Locked, the group moves as one on the face. Unlocked, each layer moves alone. The watch never sees groups.`],
    ];
    const cards: [string, string][] = [
      ["Content", "What the layer shows, starting with its entity or value."],
      ["Look", "How it is drawn: size, colour and style. On a picture the card is called Picture."],
      ["Extras", "Charts, timelines and pictures only: labels, markers, clock times, dots, grid lines or a timestamp."],
      ["States", "Changes that apply while a value matches, described below."],
      ["Position", "Where the layer sits on the shape being edited, and its size."],
      ["Tap", "What a tap on the layer does."],
      ["?", "In a card's header: shows that card's help text."],
    ];
    const values: [string, string][] = [
      ["By value", "Gauges, charts and text can colour by value instead of one colour. Each band colours readings up to its number, lowest band first. Readings above every band take the Above the last band colour."],
      ["Timeline colours", "A timeline colours each state from its own table."],
      ["States", "Rows that test a value, like is on or is greater than, each with the changes it makes: icon, text, colour, visibility and more. Rows are checked top to bottom and the first match wins. Otherwise applies when none match."],
      ["Shape states", "The same table, on the shape itself."],
      ["Shared values", "Like a variable: set it once under the Layers card, and every layer that reads it follows. On a layer, set Source to Shared value, or click Make shared."],
      ["Values on the watch", "Every entity and shared value the complication reads, with its live reading. Slide, pick or type another value to watch the preview and the states react. Nothing is saved, and Live or Back to live returns to the real reading."],
    ];
    const saving: [string, string][] = [
      ["Save", `Writes the complication to Home Assistant (${m}S). A new one says Save new until then. Only an administrator can save.`],
      ["The dot", "Beside Save: unsaved changes, saved, or not saved yet. The footer says the same in words."],
      ["Reaching the watch", "The watch pulls saved changes by itself while Wrist Assistant is open on this home. There is no separate send step."],
      ["Hide", "The eye beside a complication in the list. It stops the watch offering that complication when you edit a face, and faces already using it keep it. Hidden ones fold into Hidden at the bottom of the list. For the open complication it saves with Save; for any other it saves at once."],
    ];
    const status: [string, string][] = [
      ["On watch", "The watch has applied every change. With last seen beside it, the watch is not listening now, so a later save waits until the app is open again."],
      ["Sending…", "Waiting for the watch to pull and confirm."],
      ["Not on watch yet", "The watch is connected but has not confirmed the latest change. Resend wakes it again."],
      ["Open the watch app to sync", "The watch is not listening. Open Wrist Assistant on the watch, or switch it to this home, and it pulls at once. Resend tries to wake it."],
      ["Update the watch app", "This watch has never reported a change. Its app is older than custom complications, or it has not opened this home yet."],
    ];
    const sharing: [string, string][] = [
      ["Share", "In the top bar. Turns the open complication into text anyone can import. Your entity ids and names become numbered slots, and you can label each one."],
      ["Backup", "The other choice in Share: an exact copy, entity ids and names included. For your records, or another watch in this home."],
      ["Copy link", "A link to this panel with the text inside it. Opening it here fills in the Import dialog. On another home, paste the link into Import."],
      ["Import", "Beside New. Paste text or a link, choose a file, or drop one on the dialog. Check the preview, choose your own entity for each slot, then Import. It opens as unsaved work and reaches the watch at the first Save."],
      ["History", "In the complication's header, beside Duplicate. The last 20 saves of this complication, newest first, with a picture of the one you pick. Restore writes it back as a new revision, so the design you restored over becomes the newest entry and you can come straight back and undo it."],
      ["Parts", "A few layers kept under a name, for this home. Pick layers in the Layers list and press Save to parts; Add from parts, under the add buttons, drops them into the complication you have open. A part is stored the way a share is, so it asks which of your entities each slot is on the way in."],
    ];
    const rows = (list: [string, string][]) => list.map(([k, what]) => html`<tr><th scope="row"><kbd>${k}</kbd></th><td>${what}</td></tr>`);
    const section = (title: string, list: [string, string][]) => html`<section>
      <h3>${title}</h3>
      <table class="terms"><tbody>${list.map(([k, what]) => html`<tr><th scope="row">${k}</th><td>${what}</td></tr>`)}</tbody></table>
    </section>`;
    const tab = (id: HelpTab, label: string) => html`<button role="tab" id=${`wa-help-${id}`} aria-selected=${this.helpTab === id ? "true" : "false"}
      @click=${() => { this.helpTab = id; }}>${label}</button>`;
    let body: TemplateResult;
    if (this.helpTab === "keys") {
      body = html`
        <section>
          <h3>Keys</h3>
          <table><tbody>${rows(keys)}</tbody></table>
          <p class="hint">Keys act on layers only while nothing is being typed into. In a field they keep their usual meaning.</p>
        </section>
        <section>
          <h3>Mouse</h3>
          <table><tbody>${rows(mouse)}</tbody></table>
        </section>`;
    } else if (this.helpTab === "sync") {
      body = html`<div>${section("Saving", saving)}${section("Watch status", status)}</div>${section("Share and import", sharing)}`;
    } else {
      body = html`<div>${section("Shapes", shapes)}${section("Cards", cards)}</div><div>${section("Layers", layers)}${section("Colour, states and values", values)}</div>`;
    }
    return html`<dialog class="help-dialog" @close=${() => { this.helpOpen = false; }}>
      <div class="help-head">
        <h2>Help</h2>
        <span class="spacer"></span>
        <a href="https://docs.wrist-assistant.com/" target="_blank" rel="noopener noreferrer">Wrist Assistant docs</a>
        <button class="pick" title="Close (Escape)" @click=${() => { this.helpOpen = false; }}>Close</button>
      </div>
      <div class="help-tabs" role="tablist" aria-label="Help topics">
        ${tab("basics", "Basics")}${tab("keys", "Keys and mouse")}${tab("sync", "Syncing and sharing")}
      </div>
      <div class="help-body" role="tabpanel" aria-labelledby=${`wa-help-${this.helpTab}`}>${body}</div>
    </dialog>`;
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
   * layer it belongs to and a row layer sent to its list (the same redirects a
   * drag does). */
  private hitLayerId(e: Event): string | undefined {
    const cfg = this.canvasConfig();
    if (!cfg) return undefined;
    const id = this.rawHitId(e);
    return id ? selectableLayerId(cfg, id) : undefined;
  }

  /** The id written on the thing under the pointer, before any redirect. */
  private rawHitId(e: Event): string | undefined {
    const target = e.target as Element | null;
    return target?.closest?.("[data-element-id]")?.getAttribute("data-element-id") ?? undefined;
  }

  /** The row layer the pointer is on, when the canvas is drawing the real face
   * and the hit is one of some list's rows. Undefined while a row is being
   * designed, where the row's layers are the canvas's own layers. */
  private rowLayerHitId(e: Event): string | undefined {
    const cfg = this.draft?.config;
    if (!cfg || this.rowEditList()) return undefined;
    const id = this.rawHitId(e);
    return id !== undefined && listOwningRowLayer(cfg, id) ? id : undefined;
  }

  /** Drop the list tint, but only the one this row put up: the pointer can
   * enter the next row before this row's leave arrives. */
  private leaveRow(ids: readonly string[]) {
    const same = this.listHoverIds.length === ids.length && this.listHoverIds.every((id, i) => ids[i] === id);
    if (same) this.listHoverIds = [];
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

  /**
   * A double click on a list opens its row designer.
   *
   * A list draws one row design once per item, and the row is the part people
   * want to change. Landing on a row opens the designer with that row's layer
   * selected, so the double click goes straight to the thing under the finger;
   * landing on an empty part of the list opens it on the first layer of the
   * row, which is the nearest thing to "open this list's design".
   *
   * The first click of the pair has already selected the list and may have
   * begun a move, so the gesture is dropped: a double click is not a drag.
   */
  private onPreviewDoubleClick(e: MouseEvent) {
    if (!this.canEdit || this.picking || this.showTaps || this.rowEditList()) return;
    const cfg = this.draft?.config;
    if (!cfg) return;
    const hitId = this.rawHitId(e) ?? this.lastPressHitId;
    if (hitId === undefined) return;
    const owner = listOwningRowLayer(cfg, hitId);
    if (owner) {
      this.cancelGesture?.();
      this.setRowEdit(owner.payload.id);
      this.inspect = { kind: "layer", id: hitId };
      return;
    }
    const hit = cfg.elements.find((x) => x.payload.id === hitId);
    if (hit?.kind !== "list") return;
    this.cancelGesture?.();
    this.setRowEdit(hit.payload.id);
    const first = hit.payload.template[0];
    this.inspect = { kind: "layer", id: first ? first.payload.id : hit.payload.id };
  }

  private onPreviewPointerDown(family: FamilyKind, e: PointerEvent) {    // A press on the face calls preventDefault to start a drag, which also
    // stops the browser moving focus. A control used just before (the grid
    // size menu, a number box) then kept it and went on taking the arrow keys
    // meant for the layer. Clicking the face is clicking away, so let it go.
    const root = this.renderRoot as ShadowRoot | HTMLElement;
    const active = ("activeElement" in root ? root.activeElement : null) as HTMLElement | null;
    if (active && typeof active.blur === "function" && !(e.currentTarget as HTMLElement | null)?.contains(active)) active.blur();
    // Pick mode outranks dragging, and selecting is not an edit, so it works on
    // a read-only complication too.
    if (this.picking) {
      e.preventDefault();
      this.pickAt(family, e);
      return;
    }
    const target = e.target as SVGElement;
    // Null, never undefined, off a handle: the checks below test `!== null`, and
    // an undefined handle sent a plain drag on an icon down the corner path,
    // which threw on the first move.
    const handle = (target.closest("[data-handle]")?.getAttribute("data-handle") ?? null) as HandleCorner | null;
    const hitId = target.closest("[data-element-id]")?.getAttribute("data-element-id") ?? undefined;
    // What the press landed on, for the double click that may follow it. A
    // drag captures the pointer on the face's own svg, and a click that comes
    // out of a capture can be reported against the svg rather than against the
    // thing under it, which would lose the row the double click is about.
    this.lastPressHitId = hitId;
    // The face's own svg, not the nearest one: an icon draws its glyph as a
    // nested svg with a viewBox of its own, and a drag measured against that
    // one ran several times faster than the pointer.
    const svg = target.closest("svg.complication") as SVGSVGElement | null;
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
      // A row tap's box leads to the row tap, not to the list it is drawn in:
      // review is about reading one tap, and the inspector edits a row layer
      // as readily as a layer of the document.
      const id = this.rowLayerHitId(e) ?? this.hitLayerId(e);
      if (id) this.inspect = { kind: "layer", id };
      // Bare background: back to every tap area.
      else if (hitId === undefined) this.inspect = { kind: "general" };
      return;
    }
    if (!this.draft || !this.canEdit) return;
    // Lookups read what the canvas is actually drawing, which while a row is
    // being designed is the row rather than the document. Every write still
    // goes through `mutate`, where `setPlacement` finds a row layer inside its
    // list's template.
    const canvasCfg = this.canvasConfig();
    if (!canvasCfg) return;
    if (family !== this.activeFamily) {
      this.activeFamily = family;
      return;
    }
    // A plain press anywhere on the face drops the pick, the way a plain
    // click on a row does. A modified press keeps it and toggles the layer hit.
    const multiKey = isMultiKey(e);
    // A plain press on a picked layer moves the whole pick. A release that never
    // moved drops the pick and selects that one layer, as a plain click does.
    // A corner still resizes just the layer it belongs to.
    const pressedId = hitId !== undefined ? selectableLayerId(canvasCfg, hitId) : undefined;
    if (!multiKey && !handle && svg && this.multi.size >= 2 && pressedId !== undefined && this.multi.has(pressedId)) {
      const ids = pickedMoveIds(canvasCfg, this.multi);
      e.preventDefault();
      if (ids.length === 0) return;
      this.beginMoveGesture(family as DrawableFamily, e, svg, ids, `drag-pick-${family}`, () => {
        this.multi = new Set();
        this.inspect = { kind: "layer", id: pressedId };
      });
      return;
    }
    if (!multiKey && this.multi.size > 0) this.multi = new Set();
    if (!hitId || !svg) return;
    // An attached tap sits exactly over its owner and is not a layer the user
    // ever selects or drags: send the hit to the layer it belongs to, which is
    // what the author sees there. A free-standing tap is grabbed as before.
    let id = selectableLayerId(canvasCfg, hitId);
    let el = canvasCfg.elements.find((x) => x.payload.id === id);
    if (!id || !el) return;
    if (multiKey) {
      e.preventDefault();
      this.togglePick(id);
      return;
    }
    // The selected layer wins a press inside its own box, even where another
    // layer draws over it, so a layer picked from the list can be dragged out
    // from under the one on top. A press that never moves still selects the
    // top layer on release, so clicking a number on a selected chart works.
    let pickOnClick: string | undefined;
    const selectedId = this.inspect.kind === "layer" ? this.inspect.id : undefined;
    if (selectedId !== undefined && selectedId !== id && !handle) {
      const selected = canvasCfg.elements.find((x) => x.payload.id === selectedId);
      const movable = selected !== undefined && selected.kind !== "chartDots" && selected.kind !== "chartGrid"
        && selected.payload.chartAnchor?.place !== "through" && groupOf(canvasCfg, selectedId)?.locked !== true;
      if (movable && pressInsideLayer(svg, selectedId, e)) {
        pickOnClick = id;
        id = selectedId;
        el = selected;
      }
    }
    // A locked group moves as one: a press on any member grabs all of them,
    // and selects the group. Its corners stay with the member selected from
    // the list, so a handle press still resizes that one layer. A group
    // selected in the list moves as one too, locked or not: selecting the
    // row is selecting every member at once.
    //
    // The first click on a group selects the group. Once the group or one of
    // its members is selected, a click that never moves goes one level in and
    // selects the member under the pointer, while a drag from the same press
    // still moves the whole group.
    const group = groupOf(canvasCfg, id);
    const groupSelected = group !== undefined && this.inspect.kind === "group" && this.inspect.id === group.id;
    if (group && (group.locked || groupSelected) && !handle) {
      const inside = groupSelected || (this.inspect.kind === "layer" && groupOf(canvasCfg, this.inspect.id)?.id === group.id);
      this.beginGroupGesture(family as DrawableFamily, e, svg, group, inside ? id : undefined);
      return;
    }
    if (this.inspect.kind !== "layer" || this.inspect.id !== id) {
      this.inspect = { kind: "layer", id };
      if (handle) return;
    }
    // A line through a chart's plot sits where its reading is, so a press
    // selects it and never drags it off that reading.
    if (el.payload.chartAnchor?.place === "through") return;
    e.preventDefault();
    const frame = effectivePlacement(canvasCfg, family, el).frame;
    const canvas = this.gestureCanvas(family as DrawableFamily);
    // A layer pinned to a chart reading is not dragged to a place, because the
    // anchor decides its place every time the chart refreshes. The same drag
    // nudges it off that spot instead, so what the pointer does still matches
    // what the eye sees, and a resize still lands on the width and height.
    const anchor = el.payload.chartAnchor;
    // A marker belongs to its column, so a drag only moves it up and down: pulling
    // it sideways would point it at a reading it is not about. The threshold
    // settles only the height, so beside it the drag still moves the layer's own
    // X. Through the plot, the plot owns the other axis and the drag along it
    // does nothing.
    const ownsX = anchor !== undefined && !chartAnchorIsColumn(anchor.at) && anchor.place !== "through";
    const plotOwnsY = anchor !== undefined && chartAnchorIsColumn(anchor.at) && anchor.place === "through";
    const design = DESIGN_BOX[family as DrawableFamily];
    const startNudge = { dx: anchor?.dx ?? 0, dy: anchor?.dy ?? 0 };
    // A move starts from where the anchor draws the layer, not from its saved
    // frame, which for a marker sits in the corner of the face. Starting there
    // made the gesture hit the face edge after a few points and stop.
    const placed = anchor !== undefined && !handle
      ? resolveAll(canvasCfg, this.buildContext(), this.forced)[family as DrawableFamily]
        ?.elements.find((x) => x.id === id)?.frame
      : undefined;
    const start = placed ?? frame;
    // Points, to the tenth: a nudge is an offset on the plot, not a place on the face.
    const round = (n: number) => Math.round(n * 10) / 10;
    this.cancelGesture?.();
    // A plain click sends a pointermove too, of zero distance, between the press
    // and the release, and the gesture reports a frame on every move and again
    // on release. Writing that frame back made every click on a layer an edit:
    // an undo step, an "Unsaved changes" flag, and, when the frame snapped, a
    // layer that crept by a hair (a double click did exactly that). A few
    // pixels of travel is what makes it a drag, the same slop the group drag
    // uses; short of that nothing is written.
    let moved = false;
    const track = (ev: PointerEvent) => {
      if (ev.pointerId === e.pointerId && Math.hypot(ev.clientX - e.clientX, ev.clientY - e.clientY) > DRAG_SLOP) moved = true;
    };
    svg.addEventListener("pointermove", track);
    const stopTracking = () => svg.removeEventListener("pointermove", track);
    // Handles sit on what a layer draws (a circle's square, a line, a gauge's
    // bar or dots), so a corner drag resizes that rather than the frame around it.
    const drawn = handle !== null
      ? resolveAll(canvasCfg, this.buildContext(), this.forced)[family as DrawableFamily]?.elements.find((x) => x.id === id)
      : undefined;
    // An icon draws at its own size, centred, so its corners change that size.
    // Both sides grow at once, hence half the side: the corner then stays under
    // the pointer.
    if (handle !== null && drawn?.kind === "icon") {
      const half = iconDrawnSide(drawn) / 2;
      const startSize = drawn.size;
      const cancelScale = beginScaleDrag(svg, e, handle, { w: half, h: half }, (factor, done) => {
        if (done) stopTracking();
        if (!moved) {
          if (done) this.cancelGesture = undefined;
          return;
        }
        this.mutate((c) => {
          setPlacement(c, family, id, { size: Math.max(1, Math.round(startSize * factor)) });
        }, `drag-${id}-${family}`);
        if (done) {
          this.draft?.endGesture();
          this.cancelGesture = undefined;
        }
      });
      this.cancelGesture = () => { stopTracking(); cancelScale(); };
      return;
    }
    const resize = drawn !== undefined ? handleResize(drawn, start, canvas) : {};
    const cancelFrame = beginGesture(svg, canvas, e, {
      elementId: id, frame: start, handle: handle ?? undefined, ...resize,
      ...(anchor === undefined ? { ...this.snapTarget(family as DrawableFamily), ...this.guideTarget(family as DrawableFamily, [id]) } : {}),
    }, {
      ...this.guideSink(),
      onFrame: (elementId: string, f: NormalizedFrame, done: boolean) => {
        if (done) stopTracking();
        if (!moved) {
          // A press that never travelled is a click: it selects and writes
          // nothing. On the selected layer's box it selects the layer on top.
          if (done) {
            if (pickOnClick !== undefined) this.inspect = { kind: "layer", id: pickOnClick };
            this.cancelGesture = undefined;
          }
          return;
        }
        this.mutate((c) => {
          if (anchor === undefined) {
            setPlacement(c, family, elementId, { frame: f });
            return;
          }
          // A move keeps the saved size: a line through the plot is drawn far
          // bigger than its saved box, and that drawn size is not the author's.
          const size = placed ? { width: frame.width, height: frame.height } : { width: f.width, height: f.height };
          setPlacement(c, family, elementId, { frame: { ...f, ...size, x: ownsX ? f.x : frame.x, y: frame.y } });
          const target = c.elements.find((x) => x.payload.id === elementId)?.payload.chartAnchor;
          if (target === undefined) return;
          const dx = startNudge.dx;
          const dy = plotOwnsY ? startNudge.dy : round(startNudge.dy + (f.y - start.y) * design.height);
          if (dx) target.dx = dx; else delete target.dx;
          if (dy) target.dy = dy; else delete target.dy;
        }, `drag-${elementId}-${family}`);
        if (done) {
          this.draft?.endGesture();
          this.cancelGesture = undefined;
        }
      },
    });
    this.cancelGesture = () => { stopTracking(); cancelFrame(); };
  }

  /**
   * Drag every member of a group by the same amount. The gesture runs on the
   * members' bounding box, which is what keeps the whole group on the face,
   * and each member's placement is set from where it started plus the move.
   *
   * With `pickOnClick`, a release that never moved selects that member instead
   * of moving anything, and the press leaves the selection as it was.
   */
  private beginGroupGesture(family: DrawableFamily, e: PointerEvent, svg: SVGSVGElement, group: LayerGroup, pickOnClick?: string) {
    const cfg = this.draft?.config;
    if (!cfg) return;
    const members = groupMembers(cfg, group.id);
    if (members.length === 0) return;
    if (pickOnClick === undefined && (this.inspect.kind !== "group" || this.inspect.id !== group.id)) this.inspect = { kind: "group", id: group.id };
    e.preventDefault();
    const onClick = pickOnClick === undefined ? undefined : () => { this.inspect = { kind: "layer", id: pickOnClick }; };
    this.beginMoveGesture(family, e, svg, members.map((m) => m.payload.id), `drag-group-${group.id}-${family}`, onClick);
  }

  /**
   * Move several layers as one block by a drag: a group, or a pick. The grid
   * and the edge of the face work on the box around all of them, so the block
   * keeps its shape. With `onClick`, a release that never moved calls it
   * instead of recording a move.
   */
  private beginMoveGesture(family: DrawableFamily, e: PointerEvent, svg: SVGSVGElement, ids: readonly string[], key: string, onClick?: () => void) {
    const cfg = this.canvasConfig();
    if (!cfg) return;
    const members = cfg.elements.filter((m) => ids.includes(m.payload.id));
    if (members.length === 0) return;
    const starts = new Map(members.map((m) => [m.payload.id, effectivePlacement(cfg, family, m).frame] as const));
    const frames = [...starts.values()];
    const x0 = Math.min(...frames.map((f) => f.x));
    const y0 = Math.min(...frames.map((f) => f.y));
    const x1 = Math.max(...frames.map((f) => f.x + f.width));
    const y1 = Math.max(...frames.map((f) => f.y + f.height));
    const bounds: NormalizedFrame = { x: x0, y: y0, width: x1 - x0, height: y1 - y0, rotationDegrees: 0 };
    const round = (n: number) => Math.round(n * 1000) / 1000;
    this.cancelGesture?.();
    // A plain click sends a pointermove too, of zero distance, between the press
    // and the release (seen in Chrome 2026-09-13). Counting any move as a drag
    // meant a click never reached `onClick`, so a pick or a group stayed picked.
    // A few pixels of travel is what makes it a drag. Added before the gesture's
    // own listener, so it has decided by the time that one reports a frame.
    let moved = false;
    const track = (ev: PointerEvent) => {
      if (ev.pointerId === e.pointerId && Math.hypot(ev.clientX - e.clientX, ev.clientY - e.clientY) > DRAG_SLOP) moved = true;
    };
    svg.addEventListener("pointermove", track);
    const stopTracking = () => svg.removeEventListener("pointermove", track);
    const cancel = beginGesture(svg, this.gestureCanvas(family), e, {
      elementId: key, frame: bounds, ...this.snapTarget(family), ...this.guideTarget(family, ids),
    }, {
      ...this.guideSink(),
      onFrame: (_id, f, done) => {
        if (done) stopTracking();
        if (!done && !moved) return;
        if (done && !moved && onClick !== undefined) {
          onClick();
          this.cancelGesture = undefined;
          return;
        }
        const dx = f.x - bounds.x;
        const dy = f.y - bounds.y;
        this.mutate((c) => {
          for (const [mid, sf] of starts) setPlacement(c, family, mid, { frame: { ...sf, x: round(sf.x + dx), y: round(sf.y + dy) } });
        }, key);
        if (done) {
          this.draft?.endGesture();
          this.cancelGesture = undefined;
        }
      },
    });
    this.cancelGesture = () => {
      stopTracking();
      cancel();
    };
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
    // The canvas document, so the arrows move a row layer while its row is
    // being designed. `setPlacement` writes it back into the real one.
    const cfg = this.canvasConfig();
    // Review mode reads the face rather than moving it, and pick mode is
    // choosing a layer rather than editing one. Neither drags, so neither
    // nudges.
    if (!cfg || !this.canEdit || this.showTaps || this.picking) return false;
    const step = coarse ? NUDGE_COARSE : 1;
    const px = dx * step;
    const py = dy * step;
    const family = this.canvasFamily;
    const box = DESIGN_BOX[family];
    if (this.multi.size >= 2) return this.nudgeMany([...this.multi], family, box, `nudge-multi-${family}`, px, py);
    if (this.inspect.kind === "group") {
      const gid = this.inspect.id;
      return this.nudgeMany(groupMembers(cfg, gid).map((m) => m.payload.id), family, box, `nudge-group-${gid}-${family}`, px, py);
    }
    if (this.inspect.kind !== "layer") return false;
    const id = this.inspect.id;
    const el = cfg.elements.find((x) => x.payload.id === id);
    if (!el) return false;
    // A line through a chart's plot sits on its reading, so arrows leave it
    // where it is, the same as a drag does.
    if (el.payload.chartAnchor?.place === "through") return false;
    // A locked group moves as one under the pointer, so it moves as one under
    // the keyboard too: otherwise a layer could leave its group by arrow and
    // not by drag.
    const group = groupOf(cfg, id);
    if (group?.locked) {
      return this.nudgeMany(groupMembers(cfg, group.id).map((m) => m.payload.id), family, box, `nudge-group-${group.id}-${family}`, px, py);
    }
    const frame = effectivePlacement(cfg, family, el).frame;
    // A chart marker is drawn where its anchor says, whatever its frame says, so
    // the arrows move it the way a drag does: up and down change its nudge, and
    // sideways moves its own X only beside a threshold or zero, where the reading
    // does not settle X. Above a column, sideways does nothing.
    const anchor = el.payload.chartAnchor;
    if (anchor !== undefined) {
      const ownsX = !chartAnchorIsColumn(anchor.at);
      if (py === 0 && !(ownsX && px !== 0)) return true;
      this.mutate((c) => {
        if (ownsX && px !== 0) setPlacement(c, family, id, { frame: nudgeFrame(frame, px, 0, box) });
        const a = c.elements.find((x) => x.payload.id === id)?.payload.chartAnchor;
        if (a === undefined || py === 0) return;
        const dy = Math.round(((a.dy ?? 0) + py) * 10) / 10;
        if (dy) a.dy = dy; else delete a.dy;
      }, `nudge-${id}-${family}`);
      return true;
    }
    // With the grid on, a press moves to the next grid line instead of 1 pt.
    const next = this.snapGrid ? gridNudgeFrame(frame, px, py, gridFor(this.gridStep, box)) : nudgeFrame(frame, px, py, box);
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
    const cfg = this.canvasConfig();
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
    const moved = this.snapGrid ? gridNudgeFrame(bounds, px, py, gridFor(this.gridStep, box)) : nudgeFrame(bounds, px, py, box);
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
    this.cancelGesture = beginGesture(svg, this.gestureCanvas(family), e, { elementId: tapId, frame, handle, ...this.snapTarget(family) }, {
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

  override render() {    const d = this.draft;
    const dirty = !!d?.dirty;
    // `narrow` is Home Assistant telling us it is a phone; otherwise the fit
    // is decided from the panel's own measured width.
    const fit = this.narrow
      ? { columns: 1 as const, left: this.colLeft, right: this.colRight }
      : columnFit(this.panelWidth, this.colLeft, this.colRight);
    // The header used to spell the revision and whether it was saved. The
    // footer already says exactly that, at length, so the bar keeps only the
    // dot: colour for the glance, the same words in its tooltip.
    const rec = this.records.find((r) => r.id === this.selectedId);
    return html`
      <header>
        ${this.renderPicker()}
        ${this.hass.user?.is_admin ? html`<span class="hor" aria-hidden="true">or</span>${headerArrow()}` : nothing}
        ${this.renderNewButton()}
        ${d ? html`<button class="new-btn" aria-haspopup="dialog" aria-expanded=${this.shareOpen ? "true" : "false"}
          title="Share or back up this complication as text, a file or a link"
          @click=${() => this.openShareDialog()}><span>Share</span></button>` : nothing}
        <span class="spacer"></span>
        <button class="help" title="Help" aria-label="Help" @click=${() => { this.helpOpen = true; }}>?</button>
        <div class="toolbar hbox hist">
          <button class="icon" @click=${() => this.undo()} ?disabled=${!d?.canUndo} title="Undo (⌘Z)" aria-label="Undo">${uiIcon("undo")}</button>
          <span class="hdiv"></span>
          <button class="icon" @click=${() => this.redo()} ?disabled=${!d?.canRedo} title="Redo (⇧⌘Z)" aria-label="Redo">${uiIcon("redo")}</button>
        </div>
        <div class="hbox status">
          <span class="dirty-dot ${dirty ? "" : rec ? "clean" : "none"}" title=${dirty ? "Unsaved changes" : rec ? "Saved" : "Not saved yet"}></span>
          ${this.renderSendButton()}
          <button class="primary save ${dirty ? "dirty" : ""}" @click=${() => void this.save()} ?disabled=${!this.canEdit || !dirty || this.saving || !this.slotChosen} title="Save (⌘S)">${this.saving ? "Saving…" : d?.baseRevision === null ? "Save new" : dirty ? "Save" : "Saved"}</button>
        </div>
      </header>
      ${this.loadError ? html`<div class="card error">${this.loadError}</div>` : nothing}
      ${this.linkNote ? html`<div class="banner warn link-note"><span>${this.linkNote}</span>
        <button class="link" @click=${() => { this.linkNote = undefined; }}>Dismiss</button></div>` : nothing}
      ${this.helpOpen ? this.renderHelpDialog() : nothing}
      ${this.newOpen ? this.renderNewDialog() : nothing}
      ${this.shareOpen ? this.renderShareDialog() : nothing}
      ${this.galleryOpen ? this.renderGalleryDialog() : nothing}
      ${this.importOpen ? this.renderImportDialog() : nothing}
      ${this.historyOpen ? this.renderHistoryDialog() : nothing}
      ${this.savePartOpen ? this.renderSavePartDialog() : nothing}
      ${this.partsOpen ? this.renderPartsDialog() : nothing}
      ${this.watchSupported
        ? html`<div class="layout cols-${fit.columns}"
              style="--wa-left:${fit.left}px;--wa-right:${fit.right}px">
            <div class=${`column left ${this.inControlView ? "control" : ""}`}>${this.inControlView
              ? this.renderControlHasNoLayers()
              : html`${this.renderAddLayer()}${this.renderLayers()}`}${this.renderSharedValues()}</div>
            ${this.renderGutter("left")}
            <div class="column canvas">${this.renderBanners()}${this.renderCanvas()}</div>
            ${this.renderGutter("right")}
            <div class="column inspector card">${this.renderInspector()}</div>
          </div>
          ${this.renderFooter()}`
        : this.renderWatchGate()}`;
  }

  /** The whole-panel screen for a device whose app predates the editor: a
   * watch below the per-shape release, or an iPhone below the lock screen one.
   *
   * Everything the editor would show is held back on purpose (see version.ts),
   * so this screen has to do the editor's job of telling the owner what comes
   * next: the app update, the one-time move of the complications the iPhone
   * still holds, and the reload. The count line is the reassurance that the
   * gate cost them nothing. */
  private renderWatchGate(): TemplateResult {
    const owner = this.selectedOwner;
    const phone = deviceKindOf(owner) === "iphone";
    const count = owner?.complication_count ?? 0;
    const kept = count === 0
      ? `Nothing on this ${deviceNoun(owner)} changes until then.`
      : `Your ${count} complication${count === 1 ? "" : "s"} keep${count === 1 ? "s" : ""} working until then.`;
    const steps = phone
      ? html`<li>
            <span class="gate-n">1</span>
            <div><b>Update Wrist Assistant on your iPhone</b><span>Lock Screen and Home Screen complications come with it.</span></div>
          </li>
          <li>
            <span class="gate-n">2</span>
            <div><b>Open the app</b><span>The iPhone reports its new version here.</span></div>
          </li>
          <li>
            <span class="gate-n">3</span>
            <div><b>Reload this page</b><span>The editor opens. What you save here shows up on the Lock Screen customise screen, and when you add a Home Screen widget.</span></div>
          </li>`
      : html`<li>
            <span class="gate-n">1</span>
            <div><b>Update Wrist Assistant on your iPhone</b><span>The watch app updates with it.</span></div>
          </li>
          <li>
            <span class="gate-n">2</span>
            <div><b>Open the app on your iPhone and on your watch</b><span>The watch reports its new version here.</span></div>
          </li>
          <li>
            <span class="gate-n">3</span>
            <div><b>Reload this page</b><span>The editor opens. Complications still on your iPhone move here by themselves once the watch app is updated.</span></div>
          </li>`;
    return html`<div class="gate">
      <div class="gate-card">
        <div class="gate-glyph">${uiIcon("watch")}</div>
        <div class="gate-eyebrow">${phone ? "iPhone app update coming soon" : "Watch app update coming soon"}</div>
        <h2 class="gate-title">${phone ? "This iPhone needs the new app." : "This watch needs the new app."}</h2>
        <p class="gate-lead">${updateDeviceMessage(owner)}</p>
        <ol class="gate-steps">
          ${steps}
        </ol>
        <div class="gate-foot">${kept}</div>
      </div>
    </div>`;
  }

  // ── header picker ─────────────────────────────────────────────────────

  /** The rows the picker shows, in watch face order (by slot). iPhone presets
   * and customs on another home are locked rows: this panel cannot edit them,
   * but hiding them is what used to make slots look haunted. A preset whose
   * slot a record already holds has moved here and is left out. */
  private pickerRows(): PickerRow[] {
    const source = this.browsing ? this.browseList : undefined;
    const records = (source ? source.records : this.records)
      .map((r): PickerRow => ({ slot: Number(r.document?.slotIndex ?? 0), kind: "record", record: r }));
    const rows: PickerRow[] = [
      ...records,
      ...lockedOccupied(records.map((r) => r.slot), source ? source.occupied : this.occupied).map((o): PickerRow => o.kind === "custom"
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
          title: "Still on the iPhone. Open the Wrist Assistant app on the iPhone to move it here.",
          families: [],
        }),
    ];
    return rows.sort((a, b) => a.slot - b.slot);
  }

  /** The shapes a row's complication draws, as one dot each. A document with
   * no shape at all has a control and nothing else, so the word stands where
   * the dots would: a row of dots with none lit would read as a complication
   * that draws nothing. */
  private shapeDots(families: readonly string[], control = false, against: readonly FamilyKind[] = this.ownerFamilies) {
    if (families.length === 0 && control) {
      return html`<span class="shape-none" title="A control in Control Center, and no widget">Control</span>`;
    }
    // Biggest first, so a row of dots and the shape bar under it read left to
    // right in the same order.
    return html`<span class="shape-dots">${biggestFirst(against).map((f) => html`<span class="shape-dot ${f} ${families.includes(f) ? "on" : ""}" title=${familyTitle(f)}></span>`)}</span>`;
  }

  /** The shape filter appears only past this many rows. Under it the whole
   * list fits on screen and a filter is one more control for no gain. */
  private static readonly FILTER_FROM_ROWS = 8;

  /** A saved record's config, parsed once and kept until its revision moves.
   * Undefined for a document this panel cannot parse, which draws as a blank
   * picture rather than breaking the row. */
  private recordPreview(record: ComplicationRecord) {
    const hit = this.recordPreviews.get(record.id);
    if (hit && hit.revision === record.revision) return hit;
    try {
      const config = parseConfig(record.document);
      const entry = { revision: record.revision, config, entities: [...compile(config).entities.values()] };
      this.recordPreviews.set(record.id, entry);
      return entry;
    } catch {
      this.recordPreviews.delete(record.id);
      return undefined;
    }
  }

  /**
   * One saved complication drawn the way the watch draws it, small enough for
   * a menu row. Only the open complication has its templates rendered and its
   * history fetched, so a Jinja layer or a chart in another row draws what the
   * watch draws before its first sync: the fallback, or nothing. That is worth
   * it to make the list recognisable at a glance.
   */
  private renderRowArt(record: ComplicationRecord): TemplateResult {
    const entry = this.recordPreview(record);
    if (!entry) return html`<span class="pk-art"></span>`;
    const cfg = entry.config;
    // A document with no shape has no face to draw, but a control-only one is
    // not nothing: it draws the Control Center tile the device draws, from the
    // same `controlTile` the card and the canvas tab use, so the row shows the
    // real symbol and tint rather than a blank box beside the word Control.
    if (cfg.supportedFamilies.length === 0) {
      if (!cfg.control) return html`<span class="pk-art"></span>`;
      const shape = controlTileShapes(deviceKindOf(this.pickerOwner))[0]!;
      const tile = controlTile(this.tileHost(cfg, entry.entities), cfg.control, shape, CONTROL_ROW_TILE_SIDE);
      return html`<span class="pk-art control-tile">${tile}</span>`;
    }
    // With a filter on, every row draws the shape being filtered for, so the
    // pictures answer the question the filter asked.
    const filtered = this.pickerFilter !== "all" && cfg.supportedFamilies.includes(this.pickerFilter)
      ? this.pickerFilter
      : undefined;
    const family = filtered ?? firstDrawable(cfg) ?? "inline";
    return this.renderConfigArts(cfg, entry.entities, [family], "pk-art", undefined, this.pickerReferenceCase)[0]!;
  }

  /** Shapes of a document drawn small, one picture each, from the live states
   * of the entities it reads. The picker rows and the import preview both use
   * it; a class beyond `pk-art` sizes the picture for its place. */
  private renderConfigArts(cfg: CustomComplicationConfig, entities: readonly EntityRef[], families: readonly FamilyKind[], cls: string, historySeries?: Map<string, string>, reference: PreviewCase = this.referenceCase): TemplateResult[] {
    const layouts = this.configLayouts(cfg, entities, historySeries);
    return families.map((family) => {
      if (family === "inline") return html`<span class="${cls} inline">${this.renderInlinePreview(layouts.inline, true)}</span>`;
      const layout = layouts[family];
      if (!layout) return html`<span class=${cls}></span>`;
      return html`<span class="${cls} ${family}">${renderLayout(layout, { icons: this.icons, imageSizes: this.imageSizes, slot: slotFor(reference, family) })}</span>`;
    });
  }

  /** A document that is not the open one, resolved from the live states of
   * the entities it reads. Templates are not rendered for it. */
  private configLayouts(cfg: CustomComplicationConfig, entities: readonly EntityRef[], historySeries?: Map<string, string>): ResolvedAll {
    return resolveAll(cfg, this.configContext(cfg, entities, historySeries));
  }

  /** What one complication resolves against when it is drawn small and is not
   * the one being edited: its own entities read live, and nothing fetched.
   * No `page`, so a paged document draws its page 1 in every picker row and in
   * the import preview: page 1 is what the complication shows first. */
  private configContext(cfg: CustomComplicationConfig, entities: readonly EntityRef[], historySeries?: Map<string, string>): ResolveContext {
    const entityStates = new Map<string, EntityState>();
    for (const ref of entities) {
      const state = this.entityStateFor(ref.entityId, ref.iconName ?? "", false);
      if (state) entityStates.set(ref.entityId, state);
    }
    return {
      entityStates,
      templateResults: new Map(),
      // Only the import preview fetches any; a picker row's chart draws empty.
      ...(historySeries ? { historySeries } : {}),
      namedValues: cfg.values,
    };
  }

  /** A host for a Control Center tile of a complication that has no draft
   * behind it: enough for `controlTile`, and nothing it cannot answer. */
  private tileHost(cfg: CustomComplicationConfig, entities: readonly EntityRef[]): ControlTileHost {
    const context = this.configContext(cfg, entities);
    return { config: cfg, icons: this.icons, resolveContext: () => context };
  }

  /** The shape chips above the list. Each one carries its own count, so a
   * shape with nothing in it says so instead of opening an empty list. */
  private renderPickerFilter(rows: readonly PickerRow[]) {
    const familiesOfRow = (row: PickerRow) => row.kind === "record" ? familiesOf(row.record) : row.families;
    const chip = (key: FamilyKind | "all", label: string, count: number) => html`<button
      class="pk-chip ${this.pickerFilter === key ? "on" : ""}" ?disabled=${count === 0}
      aria-pressed=${this.pickerFilter === key ? "true" : "false"}
      @click=${() => { this.pickerFilter = key; }}>${label}<span class="pk-count">${count}</span></button>`;
    return html`<div class="pk-filter">
      ${chip("all", "All", rows.length)}
      ${this.pickerFamilies.map((f) => chip(f, familyTitle(f), rows.filter((r) => familiesOfRow(r).includes(f)).length))}
    </div>`;
  }

  /**
   * The header's one picker: which device, and which of that device's
   * complications. It used to be two controls, a plain `select` for the device
   * and this menu for the complication, and the select was the one nobody
   * found: a small grey box at the far left, holding the question that decides
   * everything the rest of the header offers.
   *
   * So both questions share one button and one surface. The button says where
   * you are, device above complication. The surface answers them side by side:
   * devices down the left, the picked device's complications down the right.
   * Picking a device leaves the surface open, because the list beside it is the
   * answer to that pick, and a device with nothing on it says so there rather
   * than looking like a dead end.
   */
  /** Whether the picker is listing a device other than the one being edited. */
  private get browsing(): boolean {
    return this.browseOwnerId !== undefined && this.browseOwnerId !== this.ownerId;
  }

  /** The device the picker's right pane is about: the browsed one, or the one
   * the editor is on. Everything the pane says about a device reads from this,
   * so a watch's list is never described in a phone's words. */
  private get pickerOwner(): OwnerSummary | undefined {
    if (this.browsing) return this.owners.find((o) => o.owner_watch_id === this.browseOwnerId);
    return this.selectedOwner;
  }

  private get pickerFamilies(): FamilyKind[] {
    return familiesFor(this.pickerOwner);
  }

  private get pickerDeviceWord(): string {
    return deviceNoun(this.pickerOwner);
  }

  private get pickerReferenceCase(): PreviewCase {
    return deviceKindOf(this.pickerOwner) === "iphone" ? REFERENCE_PHONE : REFERENCE_CASE;
  }

  /**
   * List another device's complications in the picker, without moving the
   * editor onto it.
   *
   * The reply is kept apart from `records`, which stays the edited device's,
   * and a second pick while this one is out wins: the guard is the id rather
   * than a flag, so a slow reply for a device nobody is looking at any more
   * lands nowhere.
   */
  private async browseDevice(ownerId: string) {
    this.pickerConfirmDelete = undefined;
    this.pickerFilter = "all";
    this.browseError = undefined;
    if (ownerId === this.ownerId) {
      this.browseOwnerId = undefined;
      this.browseList = undefined;
      return;
    }
    this.browseOwnerId = ownerId;
    this.browseList = undefined;
    this.ownerBusy = true;
    try {
      const reply = await fetchList(this.hass, ownerId);
      if (this.browseOwnerId !== ownerId) return;
      this.browseList = {
        records: reply.records,
        occupied: reply.occupied
          ?? (reply.presets ?? []).map((p): OccupiedSlot => ({ slot: p.slot, name: p.name, kind: "preset", home: "" })),
      };
    } catch (err) {
      if (this.browseOwnerId === ownerId) this.browseError = errText(err);
    } finally {
      if (this.browseOwnerId === ownerId) this.ownerBusy = false;
    }
  }

  /** Open a complication from the picker. This is the click that moves the
   * editor: a browsed device becomes the edited one here and nowhere else. */
  private async openFromPicker(record: ComplicationRecord) {
    const target = this.browseOwnerId;
    this.togglePicker(false);
    if (target === undefined || target === this.ownerId) {
      this.selectRecord(record);
      return;
    }
    await this.selectOwner(target);
    // A dirty draft the owner switch asked about and was told to keep leaves
    // the editor where it was, so there is nothing to open.
    if (this.ownerId !== target) return;
    // Prefer the copy the switch just loaded: it carries the current revision.
    this.selectRecord(this.records.find((r) => r.id === record.id) ?? record);
  }

  /** New from inside the picker, on the device the picker is showing. */
  private async newFromPicker() {
    const target = this.browseOwnerId;
    this.togglePicker(false);
    if (target !== undefined && target !== this.ownerId) {
      await this.selectOwner(target);
      if (this.ownerId !== target) return;
    }
    this.openNewDialog();
  }

  private renderPicker() {
    const d = this.draft;
    const name = d ? (d.config.name.trim() || "Untitled") : "No complication";
    const families = d ? d.config.supportedFamilies : [];
    const owner = this.selectedOwner;
    // The revision is not shown here: it meant nothing to anyone reading the
    // list. The inspector's summary still carries it.
    return html`<div class="picker">
      <button id="wa-picker" class="pk-open" aria-haspopup="dialog" aria-expanded=${this.pickerOpen ? "true" : "false"}
        title="Choose a device and a complication" @click=${() => this.togglePicker()}>
        <span class="pk-open-ico">${uiIcon(deviceKindOf(owner) === "iphone" ? "phone" : "watch")}</span>
        <span class="pk-open-lines">
          <span class="pk-open-dev">${owner ? ownerLabel(owner) : "No device"}</span>
          <span class="pk-open-row">
            <span class="pk-name">${name}</span>
            ${d && d.baseRevision === null ? html`<span class="pk-rev">unsaved</span>` : nothing}
          </span>
        </span>
        ${this.shapeDots(families, d?.config.control !== undefined)}
        ${uiIcon("chevron")}
      </button>
      ${this.pickerOpen ? html`<div class="menu two ${this.narrow ? "narrow" : ""}" role="dialog"
        aria-label="Choose a device and a complication">
        ${this.renderPickerDevices()}
        ${this.renderPickerList()}
      </div>` : nothing}
    </div>`;
  }

  /** The picker's left pane: every device this home knows, watches first, each
   * with what it is holding. A device with no complications stays in the list
   * and reads quiet rather than being hidden, because it is still somewhere a
   * new complication can go. */
  private renderPickerDevices() {
    const groups = ownerGroups(this.owners);
    // One kind of device needs no headings; the pane is then just a list.
    const heads = groups.length > 1;
    return html`<div class="pk-devs" role="listbox" aria-label="Device">
      ${this.owners.length === 0 ? html`<div class="empty">No devices yet.</div>` : nothing}
      ${groups.map((g) => html`${heads ? html`<div class="pk-dev-head">${g.label}</div>` : nothing}
        ${g.owners.map((o) => this.renderPickerDevice(o))}`)}
    </div>`;
  }

  private renderPickerDevice(owner: OwnerSummary) {
    const open = owner.owner_watch_id === (this.browseOwnerId ?? this.ownerId);
    const lines = ownerLines(owner);
    const count = owner.complication_count;
    return html`<button type="button" class="pk-dev ${open ? "on" : ""} ${count === 0 ? "bare" : ""}"
      role="option" aria-selected=${open ? "true" : "false"}
      @click=${() => void this.browseDevice(owner.owner_watch_id)}>
      <span class="pk-dev-ico">${uiIcon(deviceKindOf(owner) === "iphone" ? "phone" : "watch")}</span>
      <span class="pk-dev-meta">
        <span class="pk-dev-name">${lines.name}</span>
        ${lines.note ? html`<span class="pk-dev-note">${lines.note}</span>` : nothing}
      </span>
      <span class="pk-dev-count" title=${`${count} complication${count === 1 ? "" : "s"}`}>${count}</span>
    </button>`;
  }

  /** The picker's right pane: the picked device's complications, under the
   * shape filter and over the line that makes a new one where you are. */
  private renderPickerList() {
    const d = this.draft;
    const name = d ? (d.config.name.trim() || "Untitled") : "No complication";
    const families = d ? d.config.supportedFamilies : [];
    const all = this.pickerRows();
    const filter = this.pickerFilter;
    const rows = filter === "all"
      ? all
      : all.filter((row) => (row.kind === "record" ? familiesOf(row.record) : row.families).includes(filter));
    // Hidden rows go to a folded section at the bottom. The open complication
    // never does, so it can always be picked again.
    const split = splitHidden(rows, (row) => (row.kind === "record" ? { id: row.record.id, hidden: this.rowHidden(row.record) } : undefined), this.selectedId);
    return html`<div class="pk-comps">
      ${!this.ownerBusy && all.length >= WristAssistantPanel.FILTER_FROM_ROWS ? this.renderPickerFilter(all) : nothing}
      <div class="pk-rows">
        ${this.browseError !== undefined
          ? html`<div class="empty">Could not load that device: ${this.browseError}</div>`
          : this.ownerBusy
          ? html`<div class="empty">Loading…</div>`
          : html`${all.length === 0 && !(d && d.baseRevision === null && !this.browsing) ? html`<div class="empty">No complications for this ${this.pickerDeviceWord} yet.</div>` : nothing}
            ${all.length > 0 && rows.length === 0 ? html`<div class="empty">Nothing on this ${this.pickerDeviceWord} has a ${filter === "all" ? "" : familyTitle(filter)} shape.</div>` : nothing}
            ${split.shown.map((row) => this.renderPickerRow(row))}
            ${d && d.baseRevision === null && !this.browsing ? html`<div class="row" aria-current="true"><span class="pk-art"></span><span class="pk-name">${name}</span>${this.shapeDots(families, d.config.control !== undefined)}<span class="pk-badge">unsaved</span></div>` : nothing}
            ${split.hidden.length > 0 ? html`
              <button type="button" class="pk-hidden-head" aria-expanded=${this.pickerHiddenOpen ? "true" : "false"}
                @click=${() => { this.pickerHiddenOpen = !this.pickerHiddenOpen; }}>
                ${uiIcon("chevron")}<span>Hidden (${split.hidden.length})</span>
              </button>
              ${this.pickerHiddenOpen ? html`
                <div class="pk-note">These do not show in the ${this.pickerDeviceWord}'s own list of complications. A face or widget that already has one keeps it.</div>
                ${split.hidden.map((row) => this.renderPickerRow(row))}` : nothing}` : nothing}`}
      </div>
      ${this.renderPickerFoot(all.filter((row) => row.kind === "record").length)}
    </div>`;
  }

  /** The bottom line of the picker's right pane: what this device is holding,
   * and a New that lands on the device the pane is showing rather than on
   * whichever one the header happened to be on.
   *
   * The count is saved complications only, never the locked slots the list
   * also draws, so it says the same number as the device's own badge two
   * inches to the left. */
  private renderPickerFoot(count: number) {
    if (!this.hass.user?.is_admin) return nothing;
    // A browsed device answers about its own slots: New here makes one there.
    const browsed = this.browsing ? this.browseList : undefined;
    const full = browsed
      ? freeSlotFrom(browsed.records.map((r) => Number(r.document?.slotIndex ?? -1)), browsed.occupied) < 0
      : this.freeSlot() < 0;
    return html`<div class="pk-foot">
      <span class="pk-foot-hint">${this.ownerBusy
        ? nothing
        : `${count} complication${count === 1 ? "" : "s"} on this ${this.pickerDeviceWord}`}</span>
      <button type="button" class="new-btn primary" ?disabled=${full || this.ownerBusy}
        title=${full ? `This ${this.pickerDeviceWord} has no free slot. Delete a complication first.` : `Make a new complication on this ${this.pickerDeviceWord}`}
        @click=${() => void this.newFromPicker()}>${uiIcon("plus")}<span>New here</span></button>
    </div>`;
  }

  /** One picker row. A saved complication opens from the row and carries its
   * own hide and delete buttons; a locked slot unfolds its explanation. */
  private renderPickerRow(row: PickerRow) {
    if (row.kind !== "record") {
      return html`<button type="button" class="row locked" role="option" aria-disabled="true" title=${row.title}
          @click=${() => { this.pickerNote = this.pickerNote === row.slot ? undefined : row.slot; }}>
          <span class="pk-art"></span>
          <span class="pk-name">${row.name}</span>
          ${this.shapeDots(row.families, false, this.pickerFamilies)}
          <span class="pk-badge">${row.badge}</span>
        </button>
        ${this.pickerNote === row.slot ? html`<div class="pk-note">${row.title}</div>` : nothing}`;
    }
    const record = row.record;
    const open = !this.browsing && record.id === this.selectedId;
    const hidden = this.rowHidden(record);
    const recName = String(record.document?.name ?? "Untitled");
    // The open complication goes through the inspector's own Delete, so an
    // unsaved draft and a conflict behave the same from either place. Hide
    // follows the same split: the open one through its draft, others at once.
    const mayDelete = this.browsing ? false : open ? this.canEdit : !!this.hass.user?.is_admin;
    const mayHide = mayDelete;
    const confirming = this.pickerConfirmDelete === record.id;
    const stop = (e: Event) => e.stopPropagation();
    return html`<div class="row rec ${hidden ? "dim" : ""}" aria-current=${open ? "true" : "false"}>
      <button type="button" class="pick" role="option" aria-selected=${open ? "true" : "false"}
        @click=${() => void this.openFromPicker(record)}>
        ${this.renderRowArt(record)}
        <span class="pk-name">${recName}</span>
        ${this.shapeDots(familiesOf(record), hasControlOf(record), this.pickerFamilies)}
      </button>
      <span class="pk-acts">
        ${confirming
          ? html`<button type="button" class="ghost danger small" ?disabled=${this.saving}
              @click=${(e: Event) => { stop(e); void (open ? this.deleteCurrent() : this.deleteSaved(record.id, record.revision)); }}>Really delete</button>
            <button type="button" class="ghost small" @click=${(e: Event) => { stop(e); this.pickerConfirmDelete = undefined; }}>Cancel</button>`
          : html`${mayHide ? html`<button type="button" class="icon" ?disabled=${!open && this.saving}
              title=${hidden
                ? "Hidden from the watch's complication list. Show it there again."
                : "Hide from the watch's complication list. Faces already using it keep it."}
              aria-label=${hidden ? `Show ${recName} in the watch's complication list` : `Hide ${recName} from the watch's complication list`}
              @click=${(e: Event) => { stop(e); void this.setPickerHidden(record, !hidden); }}>${uiIcon(hidden ? "hide" : "show")}</button>` : nothing}
            ${mayDelete ? html`<button type="button" class="icon danger" title="Delete this complication" aria-label=${`Delete ${recName}`}
              ?disabled=${this.saving} @click=${(e: Event) => { stop(e); this.pickerConfirmDelete = record.id; }}>${uiIcon("delete")}</button>` : nothing}`}
      </span>
    </div>`;
  }

  /** Whether a picker row is hidden from the watch's complication list. The
   * open one answers from its draft, so an unsaved hide shows at once. */
  private rowHidden(record: ComplicationRecord): boolean {
    if (record.id === this.selectedId && this.draft) return this.draft.config.hidden === true;
    return isHiddenDocument(record.document);
  }

  /**
   * Hide one complication from the watch's complication list, or show it again.
   *
   * The open one changes through its draft, so the flag saves with Save and
   * undoes like any other edit: saving it behind the draft's back would move
   * the revision under unsaved work. Any other row has no draft, so it saves at
   * once with the revision the list holds, the way the picker's Delete does. A
   * conflict there is a plain error, since there is nothing to reconcile.
   */
  private async setPickerHidden(record: ComplicationRecord, hide: boolean) {
    if (!this.ownerId) return;
    if (record.id === this.selectedId) {
      this.mutate((c) => {
        if (hide) c.hidden = true;
        else delete c.hidden;
      });
      return;
    }
    if (!this.hass.user?.is_admin || this.saving || !record.document) return;
    this.saving = true;
    this.saveError = undefined;
    try {
      const doc = withHidden(record.document as Record<string, unknown>, hide);
      const result = await saveRecord(this.hass, this.ownerId, doc, record.revision);
      if (!result.ok) {
        this.saveError = result.error === "conflict"
          ? `${String(record.document.name ?? "That complication")} changed on the server. Try again.`
          : result.message ?? result.error ?? "Save failed";
        return;
      }
      this.beginSendWait();
      await this.loadRecords();
    } catch (err) {
      this.saveError = errText(err);
    } finally {
      this.saving = false;
    }
  }

  /** Clear the hidden lists an older panel kept in this browser. Storage that
   * throws (a private window, blocked site data) is left alone. */
  private clearLegacyPickerHidden() {
    try {
      const storage = window.localStorage;
      const stale: string[] = [];
      for (let i = 0; i < storage.length; i++) {
        const key = storage.key(i);
        if (key?.startsWith(LEGACY_PICKER_HIDDEN_PREFIX)) stale.push(key);
      }
      for (const key of stale) storage.removeItem(key);
    } catch {
      // Nothing to clear, or no way to reach it.
    }
  }

  /** Open or shut one of the preview bar's menus; opening one shuts the other.
   * A press anywhere outside the open menu's control shuts it, the same way
   * the complication picker closes. */
  private toggleMenu(menu: "grid" | "case" | "tint" | "list", next = this.openMenu !== menu) {
    this.openMenu = next ? menu : this.openMenu === menu ? undefined : this.openMenu;
    if (this.openMenu !== undefined) window.addEventListener("pointerdown", this.menuOutside, { capture: true });
    else window.removeEventListener("pointerdown", this.menuOutside, { capture: true });
  }

  private menuOutside = (e: PointerEvent) => {
    const open = this.openMenu;
    if (open === undefined) return;
    const inside = e.composedPath().some((n) => n instanceof HTMLElement && n.dataset.menu === open);
    if (!inside) this.toggleMenu(open, false);
  };

  private togglePicker(next = !this.pickerOpen) {
    this.pickerOpen = next;
    this.browseOwnerId = undefined;
    this.browseList = undefined;
    this.browseError = undefined;
    if (!next) {
      this.pickerNote = undefined;
      this.pickerConfirmDelete = undefined;
    }
    if (next) window.addEventListener("pointerdown", this.pickerOutside, { capture: true });
    else window.removeEventListener("pointerdown", this.pickerOutside, { capture: true });
  }

  private pickerOutside = (e: PointerEvent) => {
    const inside = e.composedPath().some((n) => n instanceof HTMLElement && n.classList.contains("picker"));
    if (!inside) this.togglePicker(false);
  };

  /**
   * The New complication button, beside the list rather than inside it. It
   * opens the dialog below; nothing is made until that dialog is answered.
   *
   * Import sits next to it because it answers the same question from the other
   * end: this is the second way a complication appears on a watch, and it needs
   * the same free slot New does.
   */
  private renderNewButton() {
    if (!this.hass.user?.is_admin) return nothing;
    const full = this.freeSlot() < 0;
    return html`<div class="newc">
      <button class="new-btn primary" ?disabled=${full} aria-haspopup="dialog" aria-expanded=${this.newOpen ? "true" : "false"}
        title=${full ? `This ${this.deviceWord} has no free slot. Delete a complication first.` : "Make a new complication"}
        @click=${() => this.openNewDialog()}>${uiIcon("plus")}<span>New</span></button>
      <button class="new-btn" ?disabled=${full} aria-haspopup="dialog" aria-expanded=${this.importOpen ? "true" : "false"}
        title=${full ? `This ${this.deviceWord} has no free slot. Delete a complication first.` : "Paste a complication somebody shared"}
        @click=${() => this.openImportDialog()}><span>Import</span></button>
      ${full ? html`<span class="newc-full">${this.deviceWord} is full</span>` : nothing}
    </div>`;
  }

  /** Names already on this watch, lower-cased, so the dialog can refuse one
   * twice. Locked rows count: an iPhone preset the panel cannot edit is still
   * a name the author will read on the wrist. */
  private takenNames(): Set<string> {
    const names = [
      ...this.records.map((r) => String(r.document?.name ?? "")),
      ...this.occupied.map((o) => ("name" in o && typeof o.name === "string" ? o.name : "")),
    ];
    return new Set(names.map((n) => n.trim().toLowerCase()).filter((n) => n !== ""));
  }

  /** What is still missing before Create can do anything, in words, or
   * undefined when nothing is. */
  private newNameProblem(): string | undefined {
    const name = this.newName.trim();
    if (name === "") return undefined; // Not an error yet, just unanswered.
    if (this.takenNames().has(name.toLowerCase())) return `A complication on this ${this.deviceWord} already has that name.`;
    return undefined;
  }

  /** The places this device has, plus the Control Center when the app on it is
   * new enough to draw one. The dialog and the editor's Add a shape panel list
   * the same things in the same order, from here. */
  private newPlaces() {
    return placeGroups(this.selectedOwner, this.ownerFamilies, comingSoonFamilies(this.selectedOwner));
  }

  /** How many shapes of a place are ticked, for the count on its card. */
  private pickedIn(place: ShapePlace): number {
    let n = 0;
    for (const f of this.newFamilies) if (placeOf(f, this.selectedOwner) === place) n += 1;
    return n;
  }

  /** The place whose shapes the dialog opens on: the only one a watch has, and
   * the Home Screen on a phone, which is the bigger canvas and the one a phone
   * owner most often opens the dialog for. */
  private firstPlace(): ShapePlace | "control" | undefined {
    const groups = this.newPlaces();
    if (groups.length > 0) return groups[0]!.place;
    return deviceSupportsControls(this.selectedOwner?.app_version) ? "control" : undefined;
  }

  /**
   * The New complication dialog: a name, where it lives, and which shapes of
   * that place to start with.
   *
   * Nothing is preselected among the shapes. The old popover tinted
   * Rectangular as though it were the answer, which is a choice made for the
   * author by a button that looked like a recommendation. The place, on the
   * other hand, is opened for them: a card that opens nothing until it is
   * clicked hides the real question behind a second click, and a watch has only
   * one place to open anyway.
   *
   * Shapes are ticked rather than chosen, because a complication meant for
   * Large and Medium is one answer, not two visits. They are listed biggest
   * first, and the line under them says the quiet part out loud: each shape is
   * its own design and nothing copies across on its own.
   */
  private renderNewDialog() {
    const nameProblem = this.newNameProblem();
    const named = this.newName.trim() !== "";
    const controls = deviceSupportsControls(this.selectedOwner?.app_version);
    const groups = this.newPlaces();
    const open = this.newPlace ?? this.firstPlace();
    const count = this.newFamilies.size + (this.newControl ? 1 : 0);
    const ready = named && nameProblem === undefined && count > 0;
    return html`<dialog class="new-dialog" @keydown=${this.newKeys} @close=${() => { this.newOpen = false; }}>
      <div class="new-head">
        <h2>New complication</h2>
        <span class="spacer"></span>
        <button class="icon" title="Cancel" aria-label="Cancel" @click=${() => this.closeNewDialog()}>${uiIcon("close")}</button>
      </div>
      <div class="new-body">
        <div class="field">
          <span>Name</span>
          <input type="text" .value=${this.newName} placeholder="Kitchen at a glance" maxlength="60"
            aria-label="Complication name" aria-invalid=${nameProblem ? "true" : "false"}
            @input=${(e: Event) => { this.newName = (e.target as HTMLInputElement).value; }} />
        </div>
        ${nameProblem
          ? html`<div class="hint err">${nameProblem}</div>`
          : html`<div class="hint">${deviceKindOf(this.selectedOwner) === "iphone"
            ? "This is the name the Lock Screen customise screen and the Home Screen widget picker show, so make it one you will recognise there."
            : "This is what the name shows on the watch face picker, so make it one you will recognise there."}</div>`}
        <div class="field new-shapes">
          <span>Where does it live?</span>
          <div class="place-cards" role="tablist" aria-label="Where does it live?">
            ${groups.map((group) => this.renderPlaceCard({
              label: group.label,
              art: placeArt(group.place),
              open: open === group.place,
              picked: this.pickedIn(group.place),
              click: () => { this.newPlace = group.place; },
            }))}
            ${controls ? this.renderPlaceCard({
              label: "Control Center",
              art: controlPlaceArt(deviceKindOf(this.selectedOwner) === "iphone"),
              open: open === "control",
              ticked: this.newControl,
              // Control Center holds one thing, so the card is the choice: the
              // first click opens it and turns it on, and a second click on the
              // open card turns it off again. A card that only opened a panel
              // holding a single card underneath asked the same question twice.
              click: () => {
                if (open === "control") this.newControl = !this.newControl;
                else { this.newPlace = "control"; this.newControl = true; }
              },
            }) : nothing}
          </div>
        </div>
        ${open === undefined ? nothing : open === "control"
          ? this.renderControlPanel()
          : this.renderShapePanel(groups.find((g) => g.place === open))}
      </div>
      <div class="new-foot">
        <span class="new-count">${WristAssistantPanel.pickedWords(count, this.newFamilies, this.selectedOwner)}</span>
        <button class="small" @click=${() => this.closeNewDialog()}>Cancel</button>
        <button class="primary" ?disabled=${!ready}
          title=${ready ? "Make it" : !named ? "Give it a name first" : nameProblem ? nameProblem : controls ? "Tick a shape or the control first" : "Tick a shape first"}
          @click=${() => this.createNew()}>${count > 1 ? `Create ${count} shapes` : "Create"}</button>
      </div>
    </dialog>`;
  }

  /**
   * One place card: the device with that place lit, its name, and what is
   * ticked inside it.
   *
   * A place holding shapes carries a count, which is the whole reason a place
   * you leave does not feel lost. Control Center holds one thing, so it
   * carries a tick instead and the card is the answer.
   */
  private renderPlaceCard(o: { label: string; art: TemplateResult; open: boolean; picked?: number; ticked?: boolean; click: () => void }) {
    const picked = o.picked ?? 0;
    const on = o.ticked === true || picked > 0;
    return html`<button type="button" role="tab" class="place-card ${o.open ? "open" : ""} ${on ? "has" : ""}"
      aria-selected=${o.open ? "true" : "false"} aria-controls="pick-panel"
      title=${o.ticked === undefined ? `Shapes on the ${o.label}` : "A toggle or a button in Control Center"}
      @click=${o.click}>
      ${o.art}
      <span class="place-card-name">${o.label}</span>
      ${o.ticked !== undefined
        ? (o.ticked ? pickTick() : nothing)
        : picked > 0 ? html`<span class="place-count" aria-label=${`${picked} picked`}>${picked}</span>` : nothing}
    </button>`;
  }

  /** The open place's shapes, ticked rather than chosen. */
  private renderShapePanel(group: ReturnType<WristAssistantPanel["newPlaces"]>[number] | undefined) {
    if (!group) return nothing;
    const big = group.place === "home" ? "Biggest first" : "Widest first";
    const word = group.place === "home" ? "size" : "shape";
    return html`<div class="pick-panel" id="pick-panel" role="tabpanel">
      <div class="pick-head">
        <span class="pick-title">${group.label} ${group.place === "home" ? "sizes" : "shapes"}</span>
        <span class="pick-order">${big}</span>
      </div>
      <div class="shape-cards" role="group" aria-label=${`${group.label} shapes`}>
        ${group.families.map((f) => {
          const on = this.newFamilies.has(f);
          return html`<button type="button" role="checkbox" class="shape-card ${on ? "on" : ""}"
            aria-checked=${on ? "true" : "false"}
            @click=${() => this.toggleNewFamily(f)}>
            ${familyArt(f, deviceKindOf(this.selectedOwner) === "iphone")}
            <span class="shape-card-name">${familyTitle(f)}</span>
            ${on ? pickTick() : html`<span class="pick-tick off" aria-hidden="true"></span>`}
          </button>`;
        })}
        ${group.comingSoon.map((f) => html`<button type="button" role="checkbox" class="shape-card soon" disabled
          aria-checked="false" aria-disabled="true" title="Coming soon">
          ${familyArt(f, deviceKindOf(this.selectedOwner) === "iphone")}
          <span class="shape-card-name">${familyTitle(f)}</span>
          <span class="shape-card-note">Coming soon${familyNote(f) ? html`<br />${familyNote(f)}` : nothing}</span>
        </button>`)}
      </div>
      <div class="hint">Every ${word} is its own design. Nothing copies across on its own, so build the ${group.place === "home" ? "biggest" : "widest"} one first and trim it down for the smaller ones.</div>
      ${group.place === "home" && resizableNote(this.newFamilies)
        ? html`<div class="hint keep">${resizableNote(this.newFamilies)}</div>`
        : nothing}
    </div>`;
  }

  /**
   * What the Control Center card has to say for itself: the words, and nothing
   * else.
   *
   * Every other place opens a panel of shapes to pick between. Control Center
   * has one thing in it, so a panel holding a single card under a card that
   * already showed the same thing asked the question twice. The card above is
   * the answer, and this is the explanation under it.
   */
  private renderControlPanel() {
    const phone = deviceKindOf(this.selectedOwner) === "iphone";
    return html`<div class="pick-panel words" id="pick-panel" role="tabpanel">
      <div class="pick-head"><span class="pick-title">Control Center</span></div>
      <div class="hint">A toggle or a button, on ${phone ? "the Control Center page and the Lock Screen's bottom corners" : "the Control Center that swipes up from the watch face"}. ${this.newControl
        ? (this.newFamilies.size === 0
          ? "With no shape ticked beside it, this complication appears there and nowhere else."
          : "It sits beside the shapes rather than instead of them.")
        : "Click the card above to add one."}</div>
    </div>`;
  }

  /** Tick or untick a shape in the New dialog. */
  private toggleNewFamily(family: FamilyKind) {
    const next = new Set(this.newFamilies);
    if (!next.delete(family)) next.add(family);
    this.newFamilies = next;
  }

  /** The footer's running count, which is what stops Create being a surprise.
   * Silent at nothing picked: an empty footer is quieter than a zero. */
  private static pickedWords(count: number, families: ReadonlySet<FamilyKind>, owner: DeviceOwnerLike | null | undefined): string {
    if (count === 0) return "";
    const places = new Set<ShapePlace>();
    for (const f of families) places.add(placeOf(f, owner));
    if (places.size > 1) return `${count} picked, across ${places.size} places.`;
    return count === 1 ? "1 picked." : `${count} picked.`;
  }

  private openNewDialog() {
    if (this.freeSlot() < 0) return;
    this.newOpen = true;
    this.newName = "";
    this.newFamilies = new Set();
    this.newPlace = undefined;
    this.newControl = false;
    void this.updateComplete.then(() => {
      const dialog = this.renderRoot.querySelector<HTMLDialogElement>("dialog.new-dialog");
      if (!dialog) return;
      if (!dialog.open) dialog.showModal();
      dialog.querySelector<HTMLInputElement>("input[type=text]")?.focus();
    });
  }

  private closeNewDialog() {
    const dialog = this.renderRoot.querySelector<HTMLDialogElement>("dialog.new-dialog");
    if (dialog?.open) dialog.close();
    else this.newOpen = false;
  }

  /** Enter creates, once both questions have been answered. A control on its
   * own is an answer to the second one. */
  private newKeys = (e: KeyboardEvent) => {
    if (e.key !== "Enter") return;
    if (this.newName.trim() === "" || (this.newFamilies.size === 0 && !this.newControl) || this.newNameProblem() !== undefined) return;
    e.preventDefault();
    this.createNew();
  };

  // ── share and import ──────────────────────────────────────────────────
  //
  // Two dialogs over transfer.ts: one turns the open complication into text
  // anyone can post, the other turns that text back into a complication on this
  // watch. Every decision either of them makes is a pure function over there.
  // What is left here is markup, plus the three things a pure function cannot
  // do: reach the clipboard, start a download, and read a chosen file.

  /** The domains this house has. It is what decides whether a quoted id inside
   * a template is an entity or a number that happens to have a dot in it. */
  private knownDomains(): Set<string> {
    const out = new Set<string>();
    for (const id of Object.keys(this.hass.states)) {
      const domain = id.split(".")[0] ?? "";
      if (domain !== "") out.add(domain);
    }
    return out;
  }

  /** The open document's slots, with whatever the author has renamed applied.
   * Only the edited labels are held, so the rest follow the document. */
  private currentShareSlots(): ShareSlot[] {
    const cfg = this.shareConfig();
    if (!cfg) return [];
    return shareSlots(cfg, this.knownDomains()).map((slot) => {
      const label = this.shareLabels.get(slot.placeholderId);
      return label === undefined ? slot : { ...slot, label };
    });
  }

  /**
   * The Share dialog: the complication drawn at the top, Share or Backup, the
   * names the other side will pick by, and the ways out.
   *
   * The text is recomputed on every render rather than held in state, so a
   * name typed in a row is in the link and the file at once. There is no Save
   * here and nothing is stored: this dialog only reads.
   */
  private renderShareDialog() {
    const whole = this.draft?.config;
    const cfg = this.shareConfig();
    if (!whole || !cfg) return nothing;
    const have = supportedFamilies(whole);
    const picked = this.sharePicked();
    // A document with no shape has nothing to pick: its control is the whole
    // design, so there is no shape step and Share is ready as it opens. The
    // gallery still turns it away, since the gallery is browsed by shape.
    const ready = picked.length > 0 || have.length === 0;
    const slots = this.currentShareSlots();
    const share = this.shareMode === "share";
    const text = share
      ? exportText(applyGalleryOverrides(cfg, this.shareNameOverrides()), "share", slots)
      : exportText(cfg, "backup");
    const link = this.shareLink?.text === text ? this.shareLink : undefined;
    const layouts = resolveAll(cfg, this.buildContext(), this.forced);
    const rows = share && ready
      ? this.publicNameRows(cfg, slots, this.knownDomains(), this.shareNameOverrides(), { label: "Name", value: cfg.name.trim() || "Untitled" })
      : [];
    const focused = rows.find((row) => row.key === this.shareFocus);
    const spot = focused?.ids ?? [];
    const family = this.dialogFamily(cfg);
    const admin = this.hass.user?.is_admin === true;
    const copied = this.shareCopied;
    let n = 0;
    const who = this.shareSection(++n, "s-who", "Who is it for", html`
      <div class="seg wide xf-modes" role="group" aria-label="Who is it for">
        <button class=${share ? "on" : ""} aria-pressed=${share ? "true" : "false"} @click=${() => this.setShareMode("share")}>${uiIcon("globe")}<span>Share with others</span></button>
        <button class=${share ? "" : "on"} aria-pressed=${share ? "false" : "true"} @click=${() => this.setShareMode("backup")}>${uiIcon("lock")}<span>Backup for me</span></button>
      </div>
      <div class="xf-lead ${share ? "" : "warn"}">${uiIcon(share ? "info" : "lock")}
        <span>${share ? "Your entities are removed. The other person picks their own." : "Exact copy with your entities. Keep it for yourself or this home."}</span></div>`);
    const all = picked.length === have.length;
    const shapes = have.length < 2 ? nothing : this.shareSection(++n, "s-shapes", "Pick the shapes", html`
      ${this.familyChips(have, (f) => this.shareFamilies.has(f), (next) => this.setShareFamilies(next), false)}
      ${ready ? nothing : html`<div class="xf-lead">${uiIcon("info")}<span>Only the shapes you pick go in the copy. Pick at least one.</span></div>`}`,
      html`${picked.length} of ${have.length}<button class="link" @click=${() => this.setShareFamilies(new Set(all ? [] : have))}>${all ? "None" : "All"}</button>`);
    const names = !share ? nothing : this.shareSection(++n, "s-names", "Public names",
      ready
        ? this.renderPublicRows(rows, this.shareFocus, (key) => this.pointAtRow(rows, key, (k) => { this.shareFocus = k; }))
        : html`<div class="hint">Pick a shape first.</div>`,
      nothing, !ready);
    const send = this.shareSection(++n, "s-send", "Send it", html`
      <div class="xf-acts">
        <button class="xf-act" ?disabled=${!share || !admin || !ready} aria-haspopup="dialog"
          @click=${() => this.openGalleryDialog()}>
          <span class="ic">${uiIcon("globe")}</span><b>Post to online gallery</b>
          <span>${!share ? "Only shares can go" : admin ? "Everyone can find it, after review" : "Needs a Home Assistant administrator"}</span>
        </button>
        <button class="xf-act ${copied === "link" ? "flash" : ""}" ?disabled=${!ready} @click=${() => void this.copyShareLink(text)}>
          <span class="ic">${uiIcon(copied === "link" ? "check" : "link")}</span><b>${copied === "link" ? "Link copied" : "Copy link"}</b>
          <span>Opens in their own Home Assistant</span>
        </button>
        <button class="xf-act ${copied === "file" ? "flash" : ""}" ?disabled=${!ready} title=${`Saves ${exportFileName(cfg)}`} @click=${() => this.downloadShareText(text)}>
          <span class="ic">${uiIcon(copied === "file" ? "check" : "download")}</span><b>${copied === "file" ? "Saved" : "Download"}</b>
          <span>A .json file</span>
        </button>
      </div>
      ${link && this.shareLinkShown ? html`<input class="xfer-link" type="text" readonly aria-label="Share link" .value=${link.url}
        @focus=${(e: Event) => (e.target as HTMLInputElement).select()} />` : nothing}
      ${this.shareNote === "" ? nothing : html`<div class="hint xf-note" role="status">${this.shareNote}</div>`}
      <a class="xf-galink" href=${GALLERY_PAGE} target="_blank" rel="noopener">${uiIcon("globe")}<span>See the online gallery</span>${uiIcon("arrow")}</a>
      <details class="xf-raw" .open=${this.shareTextOpen}
        @toggle=${(e: Event) => { this.shareTextOpen = (e.target as HTMLDetailsElement).open; }}>
        <summary>${uiIcon("right")}<span>Share text</span></summary>
        <textarea class="xfer-text" rows="10" readonly aria-label="The text to share" .value=${text}></textarea>
        <button class="link" @click=${() => void this.copyShareText(text, "text")}>${copied === "text" ? "Copied" : "Copy text"}</button>
      </details>`, nothing, !ready);
    return html`<dialog class="share-dialog xf ${this.galleryOpen ? "under" : ""}" @close=${() => { this.shareOpen = false; this.pointAtRow([], undefined, () => undefined); }}>
      ${this.dialogHead(`Share “${cfg.name.trim() || "Untitled"}”`,
        have.length === 0
          ? "A Control Center control, and no shape"
          : `${ready ? familyWords(picked) : "No shapes picked yet"} · ${layerCountWords(cfg)}`,
        () => this.closeShareDialog())}
      <div class="xfer-body">
        ${this.dialogPreview(layouts, family, spot,
          focused && spot.length > 0 ? html`Where <b>${focused.name}</b> is` : family ? familyTitle(family) : "",
          rows.some((row) => row.ids.length > 0) ? "Point at a name to see where it is" : "")}
        ${who}${shapes}${names}${send}
      </div>
    </dialog>`;
  }

  /** One numbered step of the Share dialog, in its own colour. A locked step
   * waits on an earlier one: it shows, faded, and takes no input. */
  private shareSection(n: number, tone: string, title: string, body: unknown, right: unknown = nothing, locked = false) {
    return html`<section class="xf-sec ${tone} ${locked ? "locked" : ""}">
      <h3><i>${n}</i><span>${title}</span>${right === nothing ? nothing : html`<span class="r">${right}</span>`}</h3>
      <div class="xf-sec-b" ?inert=${locked}>${body}</div>
    </section>`;
  }

  /**
   * A name row in Share or the gallery pointed at, or let go. The dialog's
   * preview picks out its layers, and so do the Layers list and the canvas
   * behind the dialog, with the lit row scrolled into view.
   */
  private pointAtRow(rows: readonly PublicRow[], key: string | undefined, set: (key: string | undefined) => void) {
    set(key);
    const ids = key === undefined ? [] : rows.find((r) => r.key === key)?.ids ?? [];
    this.listHoverIds = ids;
    // A group's name row lights the group's own row too, not only its layers.
    this.dialogLitIds = key?.startsWith("g:") ? [key.slice(2), ...ids] : ids;
    if (ids.length === 0) return;
    void this.updateComplete.then(() => {
      this.renderRoot.querySelector<HTMLElement>(".layer.lit")?.scrollIntoView({ block: "nearest" });
    });
  }

  /** The head every transfer dialog shares: a title, a line under it, any
   * extra control, and a close button. Escape closes too, being a dialog. */
  private dialogHead(title: string, sub: unknown, close: () => void, extra: unknown = nothing) {
    return html`<div class="xf-head">
      <div class="xf-t"><h2>${title}</h2>${sub === "" || sub === nothing ? nothing : html`<span>${sub}</span>`}</div>
      ${extra}
      <button class="icon" title="Close" aria-label="Close" @click=${close}>${uiIcon("close")}</button>
    </div>`;
  }

  /** The shape the dialogs draw: the first drawn one, rectangular before the
   * rest, else the inline line. */
  private dialogFamily(cfg: CustomComplicationConfig): FamilyKind | undefined {
    return firstDrawable(cfg) ?? (cfg.supportedFamilies.includes("inline") ? "inline" : undefined);
  }

  /**
   * The complication drawn by the panel's own renderer, with `spot` picked
   * out: the rest dims and each of those layers gets an accent ring, on the
   * box its selection would use. Layers that are not on this shape pick out
   * nothing, and the caption says so.
   */
  private dialogPreview(layouts: ResolvedAll, family: FamilyKind | undefined, spot: readonly string[], caption: unknown, tip: string, pictureScene = false) {
    if (family === undefined) return nothing;
    let art: unknown = nothing;
    let elsewhere = false;
    if (family === "inline") {
      art = this.renderInlinePreview(layouts.inline, true);
      elsewhere = spot.length > 0;
    } else {
      const layout = layouts[family];
      if (layout) {
        const here = spot.filter((id) => layout.elements.some((el) => el.id === id));
        elsewhere = spot.length > 0 && here.length === 0;
        art = renderLayout(layout, {
          icons: this.icons, imageSizes: this.imageSizes, slot: slotFor(this.referenceCase, family), pictureScene,
          ...(here.length > 0 ? { spotlightIds: here } : {}),
        });
      }
    }
    return html`<div class="xf-prev-wrap">
      <div class="xf-prev ${family}">${art}</div>
      <div class="xf-prev-cap"><span>${caption}${elsewhere ? ", on another shape" : ""}</span>${tip === "" ? nothing : html`<span>${tip}</span>`}</div>
    </div>`;
  }

  /** Small tags for the layers that use something: each layer's own picture,
   * as the Layers list draws it, its name and its kind. */
  private layerTags(cfg: CustomComplicationConfig, layouts: ResolvedAll, ids: readonly string[], ctx?: DescribeContext) {
    if (ids.length === 0) return nothing;
    return html`<span class="xf-uses">${ids.map((id) => {
      const el = cfg.elements.find((e) => e.payload.id === id);
      if (!el) return nothing;
      const family = DRAWABLE_FAMILIES.find((f) => ownedElements(cfg, f).some((o) => o.payload.id === id)) as DrawableFamily | undefined;
      const layout = family ? layouts[family] : undefined;
      return html`<span class="xf-use">
        <span class="xf-lt">${layout ? renderLayerThumb(layout, [id], { icons: this.icons, imageSizes: this.imageSizes, width: 34, height: 20 }) : nothing}</span>
        <span class="xf-ln">${layerTitle(el, ctx)}</span><em>${KIND_LABEL[el.kind]}</em>
      </span>`;
    })}</span>`;
  }

  /** A pointer or focus leaving a list of rows lets go of the row it lit,
   * unless the focus is still inside the list. */
  private leaveRows(e: Event, clear: () => void) {
    const box = e.currentTarget as HTMLElement;
    const next = e instanceof FocusEvent ? e.relatedTarget : (box.getRootNode() as ShadowRoot | Document).activeElement;
    if (next instanceof Node && box.contains(next)) return;
    clear();
  }

  /** The open document with only the shapes chosen in Share. Everything the
   * Share and gallery dialogs send or show is read from this copy. */
  private shareConfig(): CustomComplicationConfig | undefined {
    const cfg = this.draft?.config;
    if (!cfg) return cfg;
    const picked = this.sharePicked();
    // Nothing picked yet still draws the whole design; every way out waits.
    if (picked.length === 0 || picked.length === supportedFamilies(cfg).length) return cfg;
    return keepFamilies(cfg, picked);
  }

  /** The shapes Share will send. A document with one shape needs no pick. */
  private sharePicked(): FamilyKind[] {
    const cfg = this.draft?.config;
    if (!cfg) return [];
    const have = supportedFamilies(cfg);
    return have.length < 2 ? have : have.filter((f) => this.shareFamilies.has(f));
  }

  /** The names changed for shared copies: the complication, groups, shared
   * values and layers. */
  private shareNameOverrides(): GalleryOverrides {
    const layerNames = new Map<string, string>();
    const cfg = this.draft?.config;
    if (cfg && this.shareLayerNames.size > 0) {
      for (const el of cfg.elements) {
        const wanted = el.payload.name === undefined ? undefined : this.shareLayerNames.get(el.payload.name.trim());
        if (wanted !== undefined) layerNames.set(el.payload.id, wanted);
      }
    }
    return { name: this.shareName, groupNames: this.shareGroupNames, valueNames: this.shareValueNames, layerNames };
  }

  private setShareFamilies(next: ReadonlySet<FamilyKind>) {
    this.shareFamilies = next;
    this.pointAtRow([], undefined, (k) => { this.shareFocus = k; });
    this.shareNote = "";
    this.shareLinkShown = false;
  }

  /**
   * Chips for the shapes a document has, so Share can send and Import can
   * take only some of them. With `keepOne`, the last shape on cannot be
   * turned off.
   */
  private familyChips(have: readonly FamilyKind[], isOn: (f: FamilyKind) => boolean, set: (next: ReadonlySet<FamilyKind>) => void, keepOne: boolean) {
    const count = have.filter(isOn).length;
    return html`<div class="gal-tags xf-shapes" role="group" aria-label="Shapes">${have.map((f) => {
      const lit = isOn(f);
      const last = keepOne && lit && count === 1;
      return html`<button class="pk-chip ${lit ? "on" : ""}" aria-pressed=${lit ? "true" : "false"} ?disabled=${last}
        title=${last ? "At least one shape stays on" : lit ? `Leave ${familyTitle(f)} out` : `Put ${familyTitle(f)} in`}
        @click=${() => {
          const next = new Set(have.filter(isOn));
          if (lit) next.delete(f);
          else next.add(f);
          set(next);
        }}>${lit ? uiIcon("check") : nothing}${familyTitle(f)}</button>`;
    })}</div>`;
  }

  /**
   * The public name check, one row per piece of text a shared copy carries:
   * the name or title, then entity, group and shared value names to edit, and
   * layer names and other text to read. Share and gallery step 2 both show it,
   * over the same names, so a change in one is in the other.
   */
  private publicNameRows(cfg: CustomComplicationConfig, slots: readonly ShareSlot[], known: ReadonlySet<string>, overrides: GalleryOverrides,
    head: { label: string; value: string }): PublicRow[] {
    const fields = galleryPublicFields(cfg, slots, overrides);
    const gate = (_id: string, domain: string) => known.has(domain);
    const box = (label: string, original: string, typed: string | undefined, set: (value: string) => void, maxlength?: number) =>
      html`<input type="text" maxlength=${maxlength ?? nothing} aria-label=${`${label}: ${original}`}
          .value=${typed ?? original} placeholder=${original} ?disabled=${this.gallerySending}
          @input=${(e: Event) => set((e.target as HTMLInputElement).value)} />`;
    const rows: PublicRow[] = [{ key: "head", label: head.label, name: head.value, ids: [],
      control: box(head.label, cfg.name.trim(), this.shareName === "" ? undefined : this.shareName, (v) => { this.shareName = v; }) }];
    const nameInput = (row: GalleryNameRow, label: string, typed: string | undefined) =>
      box(label, row.original, typed ?? (row.value === row.original ? undefined : row.value),
        (v) => this.setPublicName(row, v), row.kind === "slot" ? 40 : undefined);
    for (const group of fields) {
      if (group.rows) {
        for (const row of group.rows) {
          if (row.kind === "group") {
            rows.push({ key: `g:${row.id}`, label: "Group name", name: row.value, ids: groupMembers(cfg, row.id).map((el) => el.payload.id),
              control: nameInput(row, "Group name", this.shareGroupNames.get(row.id)) });
          } else if (row.kind === "shared") {
            rows.push({ key: `v:${row.id}`, label: "Shared value name", name: row.value, ids: sharedValueLayerIds(cfg, row.id),
              control: nameInput(row, "Shared value name", this.shareValueNames.get(row.id)) });
          } else {
            const slot = slots.find((s) => s.placeholderId === row.id);
            rows.push({ key: `e:${row.id}`, label: "Entity name", name: row.value, ids: slot ? entityLayerIds(cfg, slot.originalId, gate) : [],
              control: nameInput(row, "Entity name", undefined) });
          }
        }
        continue;
      }
      if (group.label === "Layer names") {
        // Read off the document's own names, so a renamed box still finds its layers.
        const names: string[] = [];
        for (const el of cfg.elements) {
          const name = el.payload.name?.trim();
          if (name && !isAttachedTap(cfg, el) && !names.includes(name)) names.push(name);
        }
        for (const name of names) {
          const ids = cfg.elements.filter((el) => !isAttachedTap(cfg, el) && el.payload.name?.trim() === name).map((el) => el.payload.id);
          rows.push({ key: `l:${name}`, label: "Layer name", name, ids,
            control: box("Layer name", name, this.shareLayerNames.get(name), (v) => this.setShareLayerName(name, v)) });
        }
        continue;
      }
      // What a layer draws, such as typed text or chart numbers. It is part of
      // the design, so it is changed on the layer, not renamed here.
      group.values.forEach((value, i) => {
        rows.push({ key: `t:${group.label}:${i}`, label: PUBLIC_ROW_LABEL[group.label] ?? group.label, name: value, ids: [],
          control: html`<div class="xf-pill mono">${value}</div>` });
      });
    }
    return rows;
  }

  /** The public names as markup, one row each. Pointing at a row sets
   * `focus`, which lights its layers behind the dialog. */
  private renderPublicRows(rows: readonly PublicRow[], focus: string | undefined, setFocus: (key: string | undefined) => void) {
    const clear = () => setFocus(undefined);
    return html`
      <div class="xf-lead">${uiIcon("info")}<span>Others can see these names. Change the names of layers and groups here before you share, if you want.</span></div>
      <div class="xf-pub" @pointerleave=${(e: Event) => this.leaveRows(e, clear)} @focusout=${(e: Event) => this.leaveRows(e, clear)}>
        ${rows.map((row) => {
          const on = row.key === focus && row.ids.length > 0;
          const set = () => setFocus(row.key);
          return html`<div class="kv ${on ? "on" : ""}" @pointerenter=${set} @focusin=${set}>
            <span class="k">${row.label}</span>
            <div class="v">${row.control}</div>
          </div>`;
        })}
      </div>
      <div class="hint">Your own complication keeps its names. An empty box keeps the name it had.</div>`;
  }

  private setShareMode(mode: "share" | "backup") {
    this.shareMode = mode;
    this.shareNote = "";
    this.pointAtRow([], undefined, (k) => { this.shareFocus = k; });
    this.shareCopied = undefined;
    this.shareLinkShown = false;
  }

  private setShareLabel(placeholderId: string, label: string) {
    const next = new Map(this.shareLabels);
    next.set(placeholderId, label);
    this.shareLabels = next;
  }

  private openShareDialog() {
    if (!this.draft) return;
    this.shareOpen = true;
    this.shareMode = "share";
    this.shareLabels = new Map();
    this.shareFamilies = new Set();
    this.shareGroupNames = new Map();
    this.shareValueNames = new Map();
    this.shareName = "";
    this.shareLayerNames = new Map();
    this.shareNote = "";
    this.shareTextOpen = false;
    this.shareLink = undefined;
    this.shareLinkShown = false;
    this.shareCopied = undefined;
    this.shareFocus = undefined;
    void this.updateComplete.then(() => {
      const dialog = this.renderRoot.querySelector<HTMLDialogElement>("dialog.share-dialog");
      if (dialog && !dialog.open) dialog.showModal();
    });
  }

  private closeShareDialog() {
    const dialog = this.renderRoot.querySelector<HTMLDialogElement>("dialog.share-dialog");
    if (dialog?.open) dialog.close();
    else this.shareOpen = false;
  }

  // ── share to gallery ──────────────────────────────────────────────────
  //
  // A second dialog over the Share one. It sends the Share text, with the
  // slot labels as the author left them in Share, to the public gallery, and
  // lists what this home has sent before. The decisions live in gallery.ts
  // and the pictures in preview-png.ts; this is markup and the network.

  private galleryMeta(): GalleryMeta {
    return {
      title: this.galleryTitle,
      description: this.galleryDescription,
      authorName: this.galleryNickname,
      tags: [...this.galleryTags],
      panelVersion: this.panel?.config?.version ?? "",
    };
  }

  private openGalleryDialog() {
    const cfg = this.shareConfig();
    if (!cfg || !this.hass.user?.is_admin || this.sharePicked().length === 0) return;
    this.pointAtRow([], undefined, (k) => { this.shareFocus = k; });
    this.galleryOpen = true;
    this.galleryTitle = (this.shareName.trim() || cfg.name.trim()).slice(0, GALLERY_LIMITS.title);
    this.galleryDescription = "";
    this.galleryTags = new Set();
    this.galleryNickname = readGalleryNickname();
    this.gallerySending = false;
    this.gallerySent = false;
    this.galleryError = "";
    this.galleryPreviews = undefined;
    this.galleryPreviewNote = "";
    this.galleryConfirmDelete = undefined;
    this.galleryTab = "new";
    this.galleryStep = 1;
    this.galleryReplaces = undefined;
    void this.updateComplete.then(() => {
      const dialog = this.renderRoot.querySelector<HTMLDialogElement>("dialog.gallery-dialog");
      if (dialog && !dialog.open) dialog.showModal();
    });
    void this.makeGalleryPreviews(cfg, this.currentShareSlots());
    void this.loadGalleryUploads();
  }

  /** The renames that apply to the gallery copy: the title as its name, and
   * the group and shared value names changed in Share or here. */
  private galleryOverrides(): GalleryOverrides {
    return { ...this.shareNameOverrides(), name: this.galleryTitle };
  }

  private setShareLayerName(name: string, value: string) {
    const next = new Map(this.shareLayerNames);
    next.set(name, value);
    this.shareLayerNames = next;
  }

  /** A name typed into the public list, in Share or in the gallery. Slot
   * labels print on the gallery pictures, so those are drawn again once
   * typing stops while the gallery is open. */
  private setPublicName(row: GalleryNameRow, value: string) {
    if (row.kind === "slot") {
      this.setShareLabel(row.id, value);
      if (!this.galleryOpen) return;
      window.clearTimeout(this.galleryRedrawTimer);
      this.galleryRedrawTimer = window.setTimeout(() => {
        const cfg = this.shareConfig();
        if (!cfg || !this.galleryOpen || this.gallerySent) return;
        this.galleryPreviews = undefined;
        this.galleryPreviewNote = "";
        void this.makeGalleryPreviews(cfg, this.currentShareSlots());
      }, 500);
      return;
    }
    const next = new Map(row.kind === "group" ? this.shareGroupNames : this.shareValueNames);
    next.set(row.id, value);
    if (row.kind === "group") this.shareGroupNames = next;
    else this.shareValueNames = next;
  }

  private closeGalleryDialog() {
    const dialog = this.renderRoot.querySelector<HTMLDialogElement>("dialog.gallery-dialog");
    if (dialog?.open) dialog.close();
    else this.galleryOpen = false;
  }

  private async makeGalleryPreviews(cfg: CustomComplicationConfig, slots: readonly ShareSlot[]) {
    const run = ++this.galleryPreviewRun;
    try {
      const previews = await renderGalleryPreviews(cfg, slots, {
        entityState: (id) => this.entityStateFor(id, "", false),
        templateResults: this.templateResults,
        historySeries: this.historySeries,
        listItems: this.listItems,
      }, this.icons);
      if (run !== this.galleryPreviewRun) return;
      this.galleryPreviews = previews;
    } catch {
      if (run !== this.galleryPreviewRun) return;
      this.galleryPreviews = [];
      this.galleryPreviewNote = "The preview pictures could not be made. It can still be sent without them.";
    }
  }

  private async ensureGalleryKey(): Promise<string> {
    if (this.galleryKey === undefined) this.galleryKey = (await fetchGalleryKey(this.hass)).key;
    return this.galleryKey;
  }

  private async loadGalleryUploads() {
    this.galleryUploadsError = "";
    try {
      const key = await this.ensureGalleryKey();
      this.galleryUploads = await listMyUploads(galleryFetch, key);
    } catch (err) {
      this.galleryUploads = [];
      this.galleryUploadsError = err instanceof GalleryError
        ? galleryErrorMessage(err)
        : "Could not read this Home Assistant's gallery key.";
    }
  }

  private async sendToGallery() {
    const cfg = this.shareConfig();
    if (!cfg || this.gallerySending || this.gallerySent || this.galleryPreviews === undefined) return;
    const slots = this.currentShareSlots();
    const meta = this.galleryMeta();
    const overrides = this.galleryOverrides();
    if (galleryBlockers(cfg, slots, meta, this.knownDomains(), overrides).length > 0) return;
    this.gallerySending = true;
    this.galleryError = "";
    try {
      const key = await this.ensureGalleryKey();
      await submitToGallery(galleryFetch, key, {
        ...buildGallerySubmission(cfg, slots, meta, overrides),
        previews: this.galleryPreviews,
        ...(this.galleryReplaces ? { replaces: this.galleryReplaces.id } : {}),
      });
      this.gallerySent = true;
      writeGalleryNickname(meta.authorName.trim());
      void this.loadGalleryUploads();
    } catch (err) {
      this.galleryError = err instanceof GalleryError
        ? galleryErrorMessage(err)
        : "Could not read this Home Assistant's gallery key. Try again.";
    } finally {
      this.gallerySending = false;
    }
  }

  /** Delete asks twice, in place: the first click turns the button into the
   * question, the second answers it. */
  private async deleteGalleryUpload(id: string) {
    if (this.galleryConfirmDelete !== id) {
      this.galleryConfirmDelete = id;
      return;
    }
    this.galleryDeleting = id;
    this.galleryUploadsError = "";
    try {
      const key = await this.ensureGalleryKey();
      await deleteMyUpload(galleryFetch, key, id);
      this.galleryUploads = this.galleryUploads?.filter((u) => u.id !== id);
      // Read again: deleting an upload can take its waiting versions with it.
      void this.loadGalleryUploads();
    } catch (err) {
      this.galleryUploadsError = err instanceof GalleryError ? galleryErrorMessage(err) : "Could not delete it. Try again.";
    } finally {
      this.galleryDeleting = undefined;
      this.galleryConfirmDelete = undefined;
    }
  }

  private toggleGalleryTag(tag: GalleryTag) {
    const next = new Set(this.galleryTags);
    if (next.has(tag)) next.delete(tag);
    else if (next.size < GALLERY_LIMITS.tags) next.add(tag);
    this.galleryTags = next;
  }

  /**
   * Post to online gallery: two tabs over one dialog. New walks through three
   * steps (the listing, the public text, the promise and Send); My uploads
   * lists what this home has sent, with Update and Delete.
   */
  private renderGalleryDialog() {
    const cfg = this.shareConfig();
    if (!cfg) return nothing;
    const rows = this.galleryUploads ? galleryUploadRows(this.galleryUploads) : undefined;
    const tab = this.galleryTab;
    const tabs = html`<div class="seg xf-tabs" role="group" aria-label="Gallery view">
      <button class=${tab === "new" ? "on" : ""} aria-pressed=${tab === "new" ? "true" : "false"} @click=${() => this.setGalleryTab("new")}>New</button>
      <button class=${tab === "mine" ? "on" : ""} aria-pressed=${tab === "mine" ? "true" : "false"} @click=${() => this.setGalleryTab("mine")}>My uploads<span class="xf-count">${rows === undefined ? "…" : rows.length}</span></button>
    </div>`;
    return html`<dialog class="gallery-dialog xf" @close=${() => { this.galleryOpen = false; this.pointAtRow([], undefined, () => undefined); }}>
      ${this.dialogHead("Post to online gallery",
        html`<a class="xf-galink" href=${GALLERY_PAGE} target="_blank" rel="noopener">wrist-assistant.com/gallery</a>`,
        () => this.closeGalleryDialog(), tabs)}
      ${tab === "mine" ? this.renderGalleryUploads(rows) : this.gallerySent ? this.renderGallerySent() : this.renderGallerySteps(cfg)}
    </dialog>`;
  }

  /** Switching to New after a send starts a fresh one, and pressing New
   * leaves an Update for a plain new upload. */
  private setGalleryTab(tab: "new" | "mine") {
    if (tab === "new") {
      if (this.gallerySent) {
        this.gallerySent = false;
        this.galleryStep = 1;
        this.galleryError = "";
      }
      if (this.galleryTab === "new") this.galleryReplaces = undefined;
    }
    this.galleryTab = tab;
    this.galleryConfirmDelete = undefined;
  }

  private goGalleryStep(step: 1 | 2) {
    this.galleryStep = step;
  }

  /** Update on an upload: the same three steps, sent as its new version. */
  private startGalleryUpdate(u: GalleryUpload) {
    this.galleryReplaces = { id: u.id, title: u.title };
    this.galleryTitle = u.title.slice(0, GALLERY_LIMITS.title);
    this.galleryTab = "new";
    this.galleryStep = 1;
    this.gallerySent = false;
    this.galleryError = "";
    this.galleryConfirmDelete = undefined;
  }

  private renderGallerySent() {
    return html`<div class="xfer-body"><div class="xf-done">
      <span class="big">${uiIcon("check")}</span>
      <b>Sent for review</b>
      <p>${this.galleryReplaces
        ? "The new version goes up after it is approved. Until then the old one stays."
        : "It shows in the gallery after it is approved. Check My uploads for its status."}</p>
      <div class="btns">
        <button class="small" @click=${() => this.setGalleryTab("mine")}>My uploads</button>
        <button class="primary" @click=${() => this.closeGalleryDialog()}>Done</button>
      </div>
    </div></div>`;
  }

  private renderGallerySteps(cfg: CustomComplicationConfig) {
    const slots = this.currentShareSlots();
    const overrides = this.galleryOverrides();
    const known = this.knownDomains();
    const blockers = galleryBlockersByStep(cfg, slots, this.galleryMeta(), known, overrides);
    const step = this.galleryStep;
    const detailsOk = blockers.details.length === 0;
    const all = [...blockers.details, ...blockers.send];
    const ready = all.length === 0 && this.galleryPreviews !== undefined && !this.gallerySending;
    const why = all.length > 0 ? all[0]!
      : this.galleryPreviews === undefined ? "Drawing the preview pictures"
      : "Send it for review";
    const names = ["Details", "Send"];
    const steps = html`<nav class="xf-steps" aria-label="Steps">${names.map((label, i) => {
      const n = (i + 1) as 1 | 2;
      return html`<button class="xf-step ${n < step ? "past" : ""}" aria-current=${n === step ? "step" : nothing}
        ?disabled=${n > 1 && !detailsOk} @click=${() => this.goGalleryStep(n)}>
        <i>${n < step ? uiIcon("check") : n}</i>${label}</button>`;
    })}</nav>`;
    const body = step === 1 ? this.renderGalleryDetails(blockers.details) : this.renderGallerySend(cfg, slots, all);
    return html`${steps}
      <div class="xfer-body">
        ${this.galleryReplaces ? html`<div class="xf-banner">${uiIcon("info")}<span>New version of <b>${this.galleryReplaces.title}</b>. The link and votes stay. The old version stays up until this one is approved.</span></div>` : nothing}
        ${body}
      </div>
      <div class="xfer-foot">
        ${step === 1
          ? html`<button class="ghost" @click=${() => this.closeGalleryDialog()}>Back to Share</button>`
          : html`<button class="ghost" @click=${() => this.goGalleryStep(1)}>Back</button>`}
        <span class="spacer"></span>
        ${step === 1
          ? html`<button class="primary" ?disabled=${!detailsOk} title=${detailsOk ? "Next step" : blockers.details[0]!}
              @click=${() => this.goGalleryStep(2)}>Next${uiIcon("arrow")}</button>`
          : html`<button class="primary" ?disabled=${!ready} title=${why}
              @click=${() => void this.sendToGallery()}>${this.gallerySending ? "Sending…" : "Send for review"}</button>`}
      </div>`;
  }

  /** Step 1: the listing, beside the card it makes in the gallery. */
  private renderGalleryDetails(problems: readonly string[]) {
    const tags = this.galleryTags;
    return html`<div class="xf-two">
      <div class="xf-stack xf-form">
        <label class="xf-f"><span class="xf-label">Title</span>
          <input type="text" maxlength=${GALLERY_LIMITS.title} .value=${this.galleryTitle}
            @input=${(e: Event) => { this.galleryTitle = (e.target as HTMLInputElement).value; }} /></label>
        <label class="xf-f"><span class="xf-label">Description <span class="r">Optional</span></span>
          <textarea rows="2" maxlength=${GALLERY_LIMITS.description} .value=${this.galleryDescription}
            @input=${(e: Event) => { this.galleryDescription = (e.target as HTMLTextAreaElement).value; }}></textarea></label>
        <div class="xf-f"><span class="xf-label">Tags <span class="r">${tags.size} of ${GALLERY_LIMITS.tags}</span></span>
          <div class="gal-tags">
            ${GALLERY_TAGS.map((tag) => {
              const on = tags.has(tag);
              return html`<button class="pk-chip ${on ? "on" : ""}" aria-pressed=${on ? "true" : "false"}
                ?disabled=${!on && tags.size >= GALLERY_LIMITS.tags}
                @click=${() => this.toggleGalleryTag(tag)}>${GALLERY_TAG_LABEL[tag]}</button>`;
            })}
          </div></div>
        <label class="xf-f"><span class="xf-label">Your name <span class="r">Optional</span></span>
          <input type="text" maxlength=${GALLERY_LIMITS.authorName} .value=${this.galleryNickname}
            @input=${(e: Event) => { this.galleryNickname = (e.target as HTMLInputElement).value; }} /></label>
        ${problems.length > 0 ? html`<ul class="xf-blockers" role="alert">${problems.map((p) => html`<li>${p}</li>`)}</ul>` : nothing}
      </div>
      <div>${this.galleryCard()}<div class="xf-caption">How it looks in the gallery</div></div>
    </div>`;
  }

  /** The gallery's card for this upload: its first preview picture, the
   * title, the name and the tags, as they are now. */
  private galleryCard() {
    const previews = this.galleryPreviews;
    const nick = this.galleryNickname.trim();
    return html`<div class="xf-gcard">
      <div class="img">${previews === undefined
        ? html`<span class="hint">Drawing…</span>`
        : previews[0]
          ? html`<img alt="Gallery picture" src=${`data:image/png;base64,${previews[0].png}`} />`
          : html`<span class="hint">${this.galleryPreviewNote || "No picture for this shape"}</span>`}</div>
      <div class="meta">
        <b>${this.galleryTitle.trim() || "Untitled"}</b>
        <span>${nick ? `by ${nick}` : "No name"}</span>
        ${this.galleryTags.size > 0 ? html`<span class="tg">${[...this.galleryTags].map((t) => html`<em>${GALLERY_TAG_LABEL[t]}</em>`)}</span>` : nothing}
      </div>
    </div>`;
  }

  /** Step 2: what has been taken care of, the promise, and anything that still
   * stops the upload. */
  private renderGallerySend(cfg: CustomComplicationConfig, slots: readonly ShareSlot[], problems: readonly string[]) {
    const tags = this.galleryTags.size;
    const pictures = cfg.elements.some((el) => el.kind === "image");
    return html`<div class="xf-two">
      <div class="xf-stack xf-form">
        <div class="xf-checks">
          <div>${uiIcon("check")}<span>${tags === 0 ? "Title, no tags" : `Title and ${tags === 1 ? "1 tag" : `${tags} tags`}`}</span></div>
          <div>${uiIcon("check")}<span>${slots.length > 0 ? "Your entities are removed" : "It reads none of your entities"}</span></div>
          <div>${uiIcon("check")}<span>${pictures ? "Pictures show as a stand-in, never your photo" : "The preview shows your current values"}</span></div>
        </div>
        ${problems.length > 0 ? html`<ul class="xf-blockers" role="alert">${problems.map((p) => html`<li>${p}</li>`)}</ul>` : nothing}
        ${this.galleryError !== "" ? html`<div class="xf-blockers" role="alert">${this.galleryError}</div>` : nothing}
      </div>
      <div>${this.galleryCard()}</div>
    </div>`;
  }

  /** What this home has sent before, newest as the gallery orders it. */
  private renderGalleryUploads(rows: readonly GalleryUploadRow[] | undefined) {
    return html`<div class="xfer-body">
      ${this.galleryUploadsError !== "" ? html`<div class="xf-blockers" role="alert">${this.galleryUploadsError}</div>` : nothing}
      ${rows === undefined
        ? html`<div class="hint">Loading…</div>`
        : rows.length === 0
          ? this.galleryUploadsError === "" ? html`<div class="xf-lead">${uiIcon("info")}<span>Nothing sent from this Home Assistant yet.</span></div>` : nothing
          : html`<div class="xf-rows">${rows.map((row) => this.renderUploadRow(row))}</div>`}
      <div class="xf-lead">${uiIcon("info")}<span><b>Update</b> sends this complication as a new version. The link and votes stay. <b>Delete</b> removes it for everyone.</span></div>
    </div>`;
  }

  /** One upload, with any new version of it that has not gone up yet. */
  private renderUploadRow(row: GalleryUploadRow) {
    const u = row.upload;
    return html`<div class="xf-up">
      <span class="xf-up-thumb">${u.previewUrl ? html`<img src=${u.previewUrl} alt="" loading="lazy" />` : nothing}</span>
      <div class="xf-main">
        <div class="xf-up-t"><b>${u.title}</b>${this.uploadStatus(u)}</div>
        <div class="sub">${galleryUploadSubline(u)}</div>
      </div>
      <div class="xf-up-acts">
        ${row.canUpdate ? html`<button class="small" title="Send this complication as a new version of it"
          @click=${() => this.startGalleryUpdate(u)}>Update</button>` : nothing}
        ${this.uploadDelete(u, false)}
      </div>
      ${row.updates.map((v) => html`<div class="xf-up-v">
        <div class="xf-main">
          <div class="xf-up-t">${this.uploadStatus(v)}</div>
          <div class="sub">${galleryUploadSubline(v)}</div>
        </div>
        <div class="xf-up-acts">${this.uploadDelete(v, true)}</div>
      </div>`)}
    </div>`;
  }

  private uploadStatus(u: GalleryUpload) {
    return html`<span class="gal-status ${isPendingUpdate(u) ? "pending" : u.status}">${galleryStatusLabel(u)}</span>`;
  }

  /** Delete asks again in place; a new version is withdrawn rather than deleted. */
  private uploadDelete(u: GalleryUpload, version: boolean) {
    const busy = this.galleryDeleting !== undefined;
    if (this.galleryConfirmDelete === u.id || this.galleryDeleting === u.id) {
      const deleting = this.galleryDeleting === u.id;
      return html`${deleting ? nothing : html`<button class="small" @click=${() => { this.galleryConfirmDelete = undefined; }}>Keep</button>`}
        <button class="small danger" ?disabled=${busy}
          title=${version ? "Withdraws this new version. The one in the gallery stays." : "Removes it from the gallery for everyone"}
          @click=${() => void this.deleteGalleryUpload(u.id)}>${deleting ? "Deleting…" : version ? "Withdraw it" : "Delete for good"}</button>`;
    }
    return html`<button class="icon danger" ?disabled=${busy}
      title=${version ? "Withdraw this new version" : "Delete it from the gallery"}
      aria-label=${version ? `Withdraw the new version of ${u.title}` : `Delete ${u.title}`}
      @click=${() => void this.deleteGalleryUpload(u.id)}>${uiIcon("delete")}</button>`;
  }

  /**
   * Copy the text, or say how to.
   *
   * Home Assistant reached over plain http has no `navigator.clipboard` at all,
   * and a browser can refuse the write where it does have one, so the fallback
   * is not a rare branch. The old `execCommand("copy")` still copies a selection
   * on plain http when a click triggered it, in every browser that matters, so
   * it goes second. Only when that fails too does the user get the keys named:
   * the text stays selected, so one shortcut finishes the job.
   */
  private async copyShareText(text: string, kind: "text" | "link") {
    this.shareNote = "";
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        this.flashShare(kind);
        return;
      }
    } catch {
      // Refused or unavailable; the selection below works either way.
    }
    // A hidden box has nothing to select: the text is folded away in its
    // disclosure, and the link field only shows for this.
    if (kind === "text") this.shareTextOpen = true;
    else this.shareLinkShown = true;
    await this.updateComplete;
    const area = this.renderRoot.querySelector<HTMLTextAreaElement | HTMLInputElement>(
      kind === "text" ? "dialog.share-dialog textarea.xfer-text" : "dialog.share-dialog input.xfer-link");
    area?.focus();
    area?.select();
    let copied = false;
    try {
      copied = document.execCommand("copy");
    } catch {
      copied = false;
    }
    if (copied) this.flashShare(kind);
    else this.shareNote = "Press Cmd+C or Ctrl+C to copy.";
  }

  /** A tile's "copied" or "saved" moment, gone again after a breath. */
  private flashShare(kind: "text" | "link" | "file") {
    this.shareCopied = kind;
    window.clearTimeout(this.shareCopiedTimer);
    this.shareCopiedTimer = window.setTimeout(() => { this.shareCopied = undefined; }, 1600);
  }

  /**
   * Build a link to this panel with the text in its hash and copy it the same
   * way as the text. The address is this Home Assistant's; on another home the
   * Import dialog reads the same link pasted in.
   */
  private async copyShareLink(text: string) {
    const payload = await encodeShareLink(text);
    const url = shareLinkUrl(SHARE_LINK_SITE, payload);
    this.shareLink = { text, url };
    await this.copyShareText(url, "link");
  }

  /** Save the text as a file: a Blob and one click on a link nobody sees. The
   * panel has no download route on the server and needs none. */
  private downloadShareText(text: string) {
    const cfg = this.draft?.config;
    if (!cfg) return;
    const name = exportFileName(cfg);
    const url = URL.createObjectURL(new Blob([text], { type: "application/json" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = name;
    link.click();
    // Freed on the next turn: revoking in this one can beat the download to it.
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
    this.shareNote = "";
    this.flashShare("file");
  }

  /**
   * The Import dialog: paste, name it, say which of your entities it means.
   *
   * The parse runs on every keystroke because it is cheap and because an error
   * that appears while you are still pasting is easier to act on than one that
   * waits for a button. Nothing is created until Import, and Import saves it
   * straight away, so leaving the page afterwards does not lose it.
   */
  /** The pasted document with only the shapes chosen in Import, and only the
   * shapes this device draws: a watch document taken on a phone arrives
   * without its Corner layout, and a Home Screen one taken on a watch arrives
   * without its tiles. The preview and the saved copy read the same list. */
  private importConfig(): CustomComplicationConfig | undefined {
    const parse = this.importParse;
    if (!parse?.ok) return undefined;
    const offered = importableFamilies(parse.config, this.ownerFamilies);
    const keep = this.importFamilies === undefined ? offered : offered.filter((f) => this.importFamilies!.has(f));
    if (keep.length === supportedFamilies(parse.config).length) return parse.config;
    return keepFamilies(parse.config, keep);
  }

  private setImportFamilies(next: ReadonlySet<FamilyKind>) {
    this.importFamilies = next;
    this.importFocus = undefined;
    this.scheduleImportHistory();
  }

  private renderImportDialog() {
    const cfg = this.importConfig();
    return html`<dialog class="import-dialog xf ${this.importDrop ? "dropping" : ""}" @keydown=${this.importKeys} @close=${() => this.importClosed()}
      @dragenter=${this.importDragEnter} @dragover=${this.importDragOver} @dragleave=${this.importDragLeave} @drop=${this.importDropped}
      @paste=${this.importPasted}>
      ${this.dialogHead("Import", "", () => this.closeImportDialog())}
      ${cfg ? this.renderImportLoaded(cfg) : this.renderImportEmpty()}
      ${cfg && this.importDrop ? html`<div class="xfer-drop" aria-hidden="true"><span>Drop to read the file</span></div>` : nothing}
    </dialog>`;
  }

  /** Nothing loaded yet: one place to paste or drop, a way to type the text,
   * and the gallery for anyone who came here without a share. */
  private renderImportEmpty() {
    const parse = this.importParse;
    // Text that did not read as a complication stays on screen to fix.
    const typing = this.importTextShown || this.importText.trim() !== "";
    return html`<div class="xfer-body">
      <div class="xf-drop ${this.importDrop ? "over" : ""}">
        <span class="big">${uiIcon("paste")}</span>
        <b>Paste a share link</b>
        <p>Press <kbd>${MULTI_KEY === "Cmd" ? "⌘" : "Ctrl"}</kbd> <kbd>V</kbd> anywhere here, or drop a file.</p>
        <div class="btns">
          <button class="primary xf-paste" @click=${() => void this.pasteImport()}>Paste</button>
          <button class="small"
            @click=${(e: Event) => (e.currentTarget as HTMLElement).parentElement?.querySelector<HTMLInputElement>("input[type=file]")?.click()}>Choose a file</button>
          <input type="file" hidden accept=".json,application/json,text/plain" @change=${(e: Event) => void this.readImportFile(e)} />
        </div>
      </div>
      ${parse && !parse.ok ? html`<div class="hint err xfer-problem" role="alert">${parse.error}</div>` : nothing}
      ${typing
        ? html`<textarea class="xfer-text xf-typed" rows="6" placeholder="Paste or type the shared text or a share link"
            aria-label="Shared complication text or link" .value=${this.importText}
            @input=${(e: Event) => this.setImportText((e.target as HTMLTextAreaElement).value)}></textarea>`
        : html`<button class="link xf-type" @click=${() => void this.revealImportText()}>Type the text instead</button>`}
      <a class="xf-galtile" href=${GALLERY_PAGE} target="_blank" rel="noopener">
        <span class="ic">${uiIcon("globe")}</span>
        <span class="t"><b>Browse the online gallery</b><span>Ready-made complications from other people</span></span>
        ${uiIcon("arrow")}
      </a>
    </div>
    <div class="xfer-foot">
      <span class="spacer"></span>
      <button class="small" @click=${() => this.closeImportDialog()}>Cancel</button>
    </div>`;
  }

  /**
   * A complication loaded: its picture, its name, and a row per entity this
   * home has to answer for. The picture is drawn with the picks so far, so a
   * chart reads the entity chosen for it and its history. Importing with rows
   * left open is allowed; they can be picked in the editor later.
   */
  private renderImportLoaded(cfg: CustomComplicationConfig) {
    const rows = unresolvedEntities(cfg, this.hass.states);
    const known = this.knownDomains();
    const parse = this.importParse;
    // The chips list what this device can draw, so a shape it has no tab for
    // is never offered as something to bring in.
    const have = importableFamilies(parse?.ok ? parse.config : cfg, this.ownerFamilies);
    const preview = this.importPreview();
    const layouts: ResolvedAll = preview ? this.configLayouts(preview.config, preview.entities, this.importHistory) : {};
    const uses = new Map(rows.map((row) => [row.entityId, entityLayerIds(cfg, row.entityId, (id, domain) => isPlaceholderId(id) || known.has(domain))]));
    const required = rows.filter((row) => row.required);
    const picked = required.filter((row) => this.importMap.has(row.entityId)).length;
    const focus = rows.find((row) => row.entityId === this.importFocus);
    const family = this.dialogFamily(cfg);
    const name = this.importName.trim();
    const takenNames = this.takenNames();
    const taken = name !== "" && takenNames.has(name.toLowerCase());
    const problem = importProblem({ parsed: true, name: this.importName, taken: takenNames, unchosen: 0 });
    const clear = () => { this.importFocus = undefined; };
    return html`<div class="xfer-body">
      <div class="xf-hero">
        ${this.dialogPreview(layouts, family, focus ? uses.get(focus.entityId) ?? [] : [],
          focus ? html`Uses <b>${focus.label}</b>` : family ? familyTitle(family) : "", "")}
        <div class="xf-stack">
          <label class="xf-f"><span class="xf-label">Name</span>
            <input type="text" maxlength="60" aria-invalid=${taken ? "true" : "false"} .value=${this.importName}
              @input=${(e: Event) => { this.importName = (e.target as HTMLInputElement).value; }} /></label>
          ${taken ? html`<div class="hint err">A complication on this ${this.deviceWord} already has that name.</div>` : nothing}
          ${have.length < 2 ? nothing : html`<div class="xf-f"><span class="xf-label">Shapes to import<span class="r">${supportedFamilies(cfg).length} of ${have.length}</span></span>
            ${this.familyChips(have, (f) => this.importFamilies === undefined || this.importFamilies.has(f), (next) => this.setImportFamilies(next), true)}</div>`}
          <div class="xf-sub">${have.length === 0 && cfg.control !== undefined
            ? "A Control Center control, and no shape"
            : html`${have.length < 2 ? `${familyWords(have)} · ` : ""}${layerCountWords(cfg)}`}</div>
        </div>
      </div>
      ${rows.length === 0
        ? html`<div class="xf-lead">${uiIcon("check")}<span>Every entity this design reads is already in your Home Assistant.</span></div>`
        : html`<div class="xf-stack">
          <div class="xf-label">Pick your entities${required.length > 0 ? html`<span class="r">${picked} of ${required.length}</span>` : nothing}</div>
          ${required.length > 0 ? html`<div class="xf-bar" role="progressbar" aria-valuemin="0" aria-valuemax=${required.length} aria-valuenow=${picked}>
            <i style=${`width:${(picked / required.length) * 100}%`}></i></div>` : nothing}
          <div class="xf-rows" @pointerleave=${(e: Event) => this.leaveRows(e, clear)} @focusout=${(e: Event) => this.leaveRows(e, clear)}>
            ${rows.map((row) => this.renderImportRow(row, cfg, layouts, uses.get(row.entityId) ?? []))}
          </div>
          ${picked < required.length ? html`<div class="xf-lead">${uiIcon("info")}<span>You can import now and pick the rest later.</span></div>` : nothing}
        </div>`}
      ${hasInstanceFilters(cfg)
        ? html`<div class="xf-lead warn">${uiIcon("info")}<span>This design filters by areas, labels or floors from the sender's home. Check its aggregate layers after import.</span></div>`
        : nothing}
    </div>
    <div class="xfer-foot">
      <button class="ghost" @click=${() => this.startImportOver()}>Start over</button>
      <span class="spacer"></span>
      <button class="primary" ?disabled=${problem !== undefined}
        title=${problem ?? "Save it to this watch and open it in the editor"} @click=${() => void this.doImport()}>Import and save</button>
    </div>`;
  }

  /** Whether a drag carries something the Import dialog can read. */
  private dragReadable(e: DragEvent): boolean {
    const types = e.dataTransfer ? [...e.dataTransfer.types] : [];
    return types.includes("Files") || types.includes("text/plain");
  }

  private importDragEnter = (e: DragEvent) => {
    if (!this.dragReadable(e)) return;
    e.preventDefault();
    this.importDragDepth += 1;
    this.importDrop = true;
  };

  /** Refused by default, which is what makes a drop land here instead of the
   * browser opening the file in place of Home Assistant. */
  private importDragOver = (e: DragEvent) => {
    if (!this.dragReadable(e)) return;
    e.preventDefault();
    if (e.dataTransfer) e.dataTransfer.dropEffect = "copy";
  };

  private importDragLeave = () => {
    if (this.importDragDepth === 0) return;
    this.importDragDepth -= 1;
    if (this.importDragDepth === 0) this.importDrop = false;
  };

  /** A dropped file reads like a chosen one; dropped text replaces the box. */
  private importDropped = (e: DragEvent) => {
    this.importDragDepth = 0;
    this.importDrop = false;
    const file = e.dataTransfer?.files?.[0];
    if (file) {
      e.preventDefault();
      void this.readImportBlob(file);
      return;
    }
    const text = e.dataTransfer?.getData("text/plain") ?? "";
    if (text === "") return;
    e.preventDefault();
    this.setImportText(text);
  };

  /** One entity the design asks about: its type, the sender's name for it,
   * the layers that read it, and the picker. A slot is counted in the
   * progress; a real id this house happens not to have right now is not,
   * because the entity may be back tomorrow and blanking it helps nobody. */
  private renderImportRow(row: UnresolvedEntity, cfg: CustomComplicationConfig, layouts: ResolvedAll, ids: readonly string[]) {
    const chosen = this.importMap.get(row.entityId);
    const set = () => { this.importFocus = row.entityId; };
    return html`<div class="xf-row pick ${this.importFocus === row.entityId ? "on" : ""}" @pointerenter=${set} @focusin=${set}>
      <span class="ent-ico xf-dom">${domainIcon(row.domain)}</span>
      <div class="xf-main">
        <div class="xf-name">${row.label}${chosen ? html`<span class="xf-done" title="Picked">${uiIcon("check")}</span>` : nothing}</div>
        ${ids.length > 0 ? this.layerTags(cfg, layouts, ids) : html`<div class="xf-sub">${row.where.join(", ")}</div>`}
        ${row.required ? nothing : html`<div class="xf-sub">Not in your Home Assistant right now. Leave it empty to keep the id.</div>`}
        <div class="xf-picker">${entityField({ hass: this.hass }, row.label, chosen ?? NO_ENTITY,
          (ref) => this.setImportEntity(row.entityId, ref),
          importEntityKey(row.entityId),
          { compact: true, domain: row.domain, needed: row.required && chosen === undefined })}</div>
      </div>
    </div>`;
  }

  /** Paste reads the clipboard. A browser that will not hand it over (plain
   * http, a refused permission) gets the text box instead, focused, so the
   * keyboard paste works. */
  private async pasteImport() {
    let text = "";
    try {
      text = await navigator.clipboard.readText();
    } catch {
      text = "";
    }
    if (text.trim() === "") {
      await this.revealImportText();
      return;
    }
    this.setImportText(text);
  }

  private async revealImportText() {
    this.importTextShown = true;
    await this.updateComplete;
    this.renderRoot.querySelector<HTMLTextAreaElement>("dialog.import-dialog textarea.xf-typed")?.focus();
  }

  /** A paste anywhere in the empty dialog loads it: a file as a file, text as
   * text. A paste into a text box is that box's own. */
  private importPasted = (e: ClipboardEvent) => {
    if (this.importParse?.ok) return;
    const target = e.composedPath()[0];
    if (target instanceof HTMLTextAreaElement || target instanceof HTMLInputElement) return;
    const file = e.clipboardData?.files?.[0];
    if (file) {
      e.preventDefault();
      void this.readImportBlob(file);
      return;
    }
    const text = e.clipboardData?.getData("text/plain") ?? "";
    if (text.trim() === "") return;
    e.preventDefault();
    this.setImportText(text);
  };

  private setImportEntity(entityId: string, ref: EntityRef) {
    const next = new Map(this.importMap);
    if (ref.entityId === "") next.delete(entityId);
    // Read the whole reference back out of Home Assistant rather than trusting
    // the one the field built: the name saved beside the id is what the next
    // save copies into dataSources.
    else next.set(entityId, entityRefFrom(this.hass.states, ref.entityId));
    this.importMap = next;
    this.scheduleImportHistory();
  }

  /** The parsed document with the picks so far applied, and the entities it
   * reads, for the preview picture. Undefined until the text parses. */
  private importPreview(): { config: CustomComplicationConfig; entities: EntityRef[] } | undefined {
    const parse = this.importParse;
    if (!parse?.ok) return undefined;
    const cached = this.importPreviewCache;
    if (cached && cached.parse === parse && cached.map === this.importMap && cached.families === this.importFamilies) return cached;
    const config = remapEntities(this.importConfig() ?? parse.config, this.importMap);
    let entities: EntityRef[];
    try {
      entities = [...compile(config).entities.values()];
    } catch {
      entities = [];
    }
    this.importPreviewCache = { parse, map: this.importMap, families: this.importFamilies, config, entities };
    return this.importPreviewCache;
  }

  /**
   * Re-read the pasted text.
   *
   * Re-typing the same document is not a new one, so a change that leaves the
   * parsed document identical keeps the name and the entities already picked.
   * A change that does not, drops them: they were answers about a different
   * design.
   */
  private setImportText(text: string) {
    this.importText = text;
    // A pasted share link is read for the document inside it, which then
    // replaces the link in the box. An edit made while that unpacks wins.
    const link = shareLinkInText(text);
    if (link !== undefined) {
      this.importParse = undefined;
      this.importMap = new Map();
      this.importFamilies = undefined;
      this.importName = "";
      void decodeShareLink(link).then((decoded) => {
        if (this.importText !== text) return;
        if (decoded === undefined) this.importParse = { ok: false, error: SHARE_LINK_DAMAGED };
        else this.setImportText(decoded);
      });
      return;
    }
    const before = this.importParse?.ok ? JSON.stringify(this.importParse.config) : undefined;
    const parse = text.trim() === "" ? undefined : parseImportText(text, this.maxSchemaVersion);
    this.importParse = parse;
    this.scheduleImportHistory();
    if (!parse?.ok) {
      this.importMap = new Map();
      this.importFamilies = undefined;
      this.importName = "";
      return;
    }
    if (JSON.stringify(parse.config) === before) return;
    this.importMap = new Map();
    this.importFamilies = undefined;
    this.importName = suggestImportName(parse.config.name, this.takenNames());
  }

  /** A chosen file lands in the paste box, so there is one place the document
   * is read from and one place an error about it appears. */
  private async readImportFile(e: Event) {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    await this.readImportBlob(file);
    // Cleared so choosing the same file twice still counts as a change.
    input.value = "";
  }

  private async readImportBlob(file: Blob) {
    try {
      this.setImportText(await file.text());
    } catch (err) {
      this.importParse = { ok: false, error: `That file could not be read: ${errText(err)}` };
    }
  }

  /**
   * Take a share link out of the address, if the panel was opened with one.
   *
   * The hash is cleared at once, so a reload or a bookmarked address does not
   * offer the import again. It waits for the watch list before opening
   * anything, because that is what says whether there is a slot to import into.
   */
  private takeShareLink = () => {
    const payload = shareLinkPayload(window.location.hash);
    if (payload === undefined) return;
    history.replaceState(history.state, "", `${window.location.pathname}${window.location.search}`);
    this.pendingLink = payload;
    if (this.linkReady) void this.openPendingLink();
  };

  /** Open the Import dialog on the link's text, or say why it cannot open. */
  private async openPendingLink() {
    const payload = this.pendingLink;
    if (payload === undefined) return;
    this.pendingLink = undefined;
    if (!this.hass.user?.is_admin) {
      this.linkNote = "This link holds a shared complication. Only a Home Assistant administrator can import it.";
      return;
    }
    const text = await decodeShareLink(payload);
    if (text === undefined) {
      this.linkNote = SHARE_LINK_DAMAGED;
      return;
    }
    if (!this.ownerId) {
      this.linkNote = "This link holds a shared complication, but no watch has connected to this Home Assistant yet.";
      return;
    }
    if (this.freeSlot() < 0) {
      this.linkNote = "This link holds a shared complication, but this watch has no free slot. Delete a complication, then open the link again.";
      return;
    }
    this.linkNote = undefined;
    this.openImportDialog();
    this.setImportText(text);
  }

  /**
   * Enter imports, once the dialog has everything it needs.
   *
   * Capture phase, and it stands back for the entity search the same way the
   * preset dialog does: Enter there takes the highlighted row. It also stands
   * back inside the paste box, where Enter is a line of the document.
   */
  private importKeys = {
    handleEvent: (e: Event) => {
      if ((e as KeyboardEvent).key !== "Enter") return;
      if (e.target instanceof HTMLTextAreaElement) return;
      const cfg = this.importConfig();
      if (!cfg) return;
      const rows = unresolvedEntities(cfg, this.hass.states);
      if (rows.some((row) => entitySearchOpen(importEntityKey(row.entityId)))) return;
      const problem = importProblem({
        parsed: true,
        name: this.importName,
        taken: this.takenNames(),
        // Open rows do not stop it: they can be picked in the editor later.
        unchosen: 0,
      });
      if (problem !== undefined) return;
      e.preventDefault();
      e.stopPropagation();
      this.doImport();
    },
    capture: true,
  };

  /**
   * Take the document into the editor.
   *
   * Identity is always this watch's: a fresh id, the first free slot, and no
   * `dataSources`, which the first save derives. The dialog stays open when
   * `startNew` is declined, because the answer to "discard your unsaved work?"
   * being no should not also throw away a table of entities somebody just
   * filled in.
   *
   * The copy is saved at once. It used to open as an unsaved draft, and
   * leaving the page before pressing Save lost it, which is easy to do when
   * the whole point of the dialog felt finished. A save that fails leaves the
   * draft open and dirty with the editor's own save error beside it, so the
   * document is still there to save again.
   */
  private async doImport() {
    const base = this.importConfig();
    if (!base) return;
    const cfg = remapEntities(base, this.importMap);
    cfg.id = newId();
    cfg.name = this.importName.trim();
    cfg.slotIndex = this.freeSlot();
    cfg.dataSources = [];
    cfg.schemaVersion = schemaVersionFor(cfg);
    if (!this.startNew(cfg)) return;
    // Dirty before the save: nothing about it is on the server yet, and if the
    // save does not go through, Save has to stay live.
    this.draft?.markDirty();
    this.closeImportDialog();
    await this.save();
  }

  private openImportDialog() {
    if (!this.hass.user?.is_admin || this.freeSlot() < 0) return;
    this.importOpen = true;
    this.resetImportState();
    void this.updateComplete.then(() => {
      const dialog = this.renderRoot.querySelector<HTMLDialogElement>("dialog.import-dialog");
      if (!dialog) return;
      if (!dialog.open) dialog.showModal();
      // On Paste, so Enter pastes and a keyboard paste lands in the dialog.
      dialog.querySelector<HTMLButtonElement>("button.xf-paste")?.focus();
    });
  }

  /** Everything the Import dialog holds, back to the empty drop area. */
  private resetImportState() {
    this.importText = "";
    this.importParse = undefined;
    this.importName = "";
    this.importMap = new Map();
    this.importFamilies = undefined;
    this.importTextShown = false;
    this.importFocus = undefined;
    this.importHistory = new Map();
    this.importHistoryAsked = undefined;
    this.importPreviewCache = undefined;
    this.importDrop = false;
    this.importDragDepth = 0;
    if (this.importHistoryTimer) window.clearTimeout(this.importHistoryTimer);
    this.importHistoryTimer = undefined;
    this.importHistoryRun += 1;
  }

  private startImportOver() {
    this.resetImportState();
    void this.updateComplete.then(() => {
      this.renderRoot.querySelector<HTMLButtonElement>("dialog.import-dialog button.xf-paste")?.focus();
    });
  }

  private closeImportDialog() {
    const dialog = this.renderRoot.querySelector<HTMLDialogElement>("dialog.import-dialog");
    if (dialog?.open) dialog.close();
    else this.importClosed();
  }

  /** However the dialog shut, a history fetch still waiting or on its way no
   * longer has a picture to draw into. */
  private importClosed() {
    this.importOpen = false;
    if (this.importHistoryTimer) window.clearTimeout(this.importHistoryTimer);
    this.importHistoryTimer = undefined;
    this.importHistoryRun += 1;
  }

  // ── save history ──────────────────────────────────────────────────────

  /**
   * Earlier saves of the open complication.
   *
   * The list is revisions only, with no document bodies: one body arrives at
   * a time, for the entry being looked at. Restoring writes that body back as
   * a new revision through the ordinary save path, so nothing is ever lost by
   * looking, and putting a restore back is one more Restore.
   */
  private renderHistoryDialog() {
    const entries = this.historyEntries;
    const picked = this.historyPick;
    const cfg = this.historyDoc;
    const layouts: ResolvedAll = cfg ? this.configLayouts(cfg, this.historyEntities(cfg)) : {};
    const family = cfg ? this.dialogFamily(cfg) : undefined;
    const dirty = this.draft?.dirty === true;
    const name = this.draft?.config.name.trim() || "Untitled";
    return html`<dialog class="history-dialog xf" @close=${() => this.historyClosed()}>
      ${this.dialogHead(`History of “${name}”`,
        this.draft?.baseRevision === null || this.draft?.baseRevision === undefined
          ? ""
          : `Revision ${this.draft.baseRevision} is open`,
        () => this.closeHistoryDialog())}
      <div class="xfer-body">
        ${this.historyNote === undefined ? nothing : html`<div class="hint err" role="alert">${this.historyNote}</div>`}
        ${entries.length === 0
          ? html`<div class="xf-lead">${uiIcon("info")}<span>No earlier saves yet. Every save from now on leaves the revision it replaced here.</span></div>`
          : html`
            <div class="xf-hero">
              ${cfg
                ? this.dialogPreview(layouts, family, [],
                    picked === undefined ? "" : `Revision ${picked}`, "")
                : html`<div class="xf-prev-wrap"><div class="xf-prev"></div>
                    <div class="xf-prev-cap"><span>${this.historyBusy ? "Loading" : "Pick a revision"}</span></div></div>`}
              <div class="xf-stack">
                <span class="xf-label">Earlier saves<span class="r">${entries.length}</span></span>
                <div class="xf-sub">Restoring writes the old design back as a new revision. Nothing is thrown away, so you can come straight back here and undo it.</div>
              </div>
            </div>
            <div class="xf-rows hs-rows">
              ${entries.map((entry) => this.renderHistoryRow(entry))}
            </div>`}
      </div>
      <div class="xfer-foot">
        ${this.historyConfirm
          ? html`<span class="xf-sub">Your unsaved changes to this complication go.</span>
            <span class="spacer"></span>
            <button class="small" @click=${() => { this.historyConfirm = false; }}>Cancel</button>
            <button class="primary" @click=${() => void this.restoreHistory()}>Discard and restore</button>`
          : html`<span class="spacer"></span>
            <button class="small" @click=${() => this.closeHistoryDialog()}>Close</button>
            <button class="primary" ?disabled=${picked === undefined || this.historyBusy || !this.canEdit}
              title=${picked === undefined ? "Pick a revision first" : `Put revision ${picked} back as a new revision`}
              @click=${() => { if (dirty) this.historyConfirm = true; else void this.restoreHistory(); }}>Restore</button>`}
      </div>
    </dialog>`;
  }

  /** One past revision: what it was called, how long ago and who saved it. */
  private renderHistoryRow(entry: SaveHistoryEntry) {
    const on = this.historyPick === entry.revision;
    const shapes = entry.families.filter((f) => f !== "inline").length;
    const parts = [
      `${entry.layers} ${entry.layers === 1 ? "layer" : "layers"}`,
      shapes > 0 ? `${shapes} ${shapes === 1 ? "shape" : "shapes"}` : "",
      savedByWords(entry.updatedBy),
    ].filter((part) => part !== "");
    return html`<button class="xf-row hs-row ${on ? "on" : ""}" aria-pressed=${on ? "true" : "false"}
      @click=${() => void this.pickHistory(entry.revision)}>
      <span class="hs-rev">${entry.revision}</span>
      <span class="xf-main">
        <span class="xf-name">${entry.name || "Untitled"}</span>
        <span class="xf-sub">${savedAgoWords(entry.savedAt)} · ${parts.join(" · ")}</span>
      </span>
    </button>`;
  }

  /** The entities a history document reads, so its preview draws live states.
   * A document that will not compile draws with none rather than refusing. */
  private historyEntities(cfg: CustomComplicationConfig): EntityRef[] {
    try {
      return [...compile(cfg).entities.values()];
    } catch {
      return [];
    }
  }

  private async openHistoryDialog() {
    const id = this.selectedId;
    if (!this.ownerId || !id || this.draft?.baseRevision === null) return;
    this.historyOpen = true;
    this.historyEntries = [];
    this.historyPick = undefined;
    this.historyDoc = undefined;
    this.historyNote = undefined;
    this.historyConfirm = false;
    this.historyBusy = true;
    void this.updateComplete.then(() => {
      const dialog = this.renderRoot.querySelector<HTMLDialogElement>("dialog.history-dialog");
      if (dialog && !dialog.open) dialog.showModal();
    });
    try {
      const reply = await fetchSaveHistory(this.hass, this.ownerId, id);
      // The dialog may have been shut, or another complication opened, while
      // the reply was on its way.
      if (!this.historyOpen || this.selectedId !== id) return;
      this.historyEntries = reply.entries;
      this.historyBusy = false;
      // The newest entry is what anyone came here for, so it is drawn first.
      const newest = reply.entries[0];
      if (newest !== undefined) await this.pickHistory(newest.revision);
    } catch (err) {
      this.historyBusy = false;
      this.historyNote = errText(err);
    }
  }

  /** Draw one entry: its body is fetched the first time it is picked. */
  private async pickHistory(revision: number) {
    const id = this.selectedId;
    if (!this.ownerId || !id) return;
    this.historyPick = revision;
    this.historyDoc = undefined;
    this.historyNote = undefined;
    this.historyBusy = true;
    const run = ++this.historyRun;
    try {
      const reply = await fetchSaveHistoryEntry(this.hass, this.ownerId, id, revision);
      if (run !== this.historyRun || !this.historyOpen) return;
      this.historyDoc = parseConfig(reply.entry.document);
    } catch (err) {
      if (run !== this.historyRun) return;
      this.historyNote = errText(err);
    } finally {
      if (run === this.historyRun) this.historyBusy = false;
    }
  }

  /** Put the picked revision back, then open what came back in the editor. */
  private async restoreHistory() {
    const id = this.selectedId;
    const revision = this.historyPick;
    if (!this.ownerId || !id || revision === undefined || !this.canEdit) return;
    this.historyConfirm = false;
    this.historyBusy = true;
    this.historyNote = undefined;
    try {
      const result = await restoreSaveHistory(this.hass, this.ownerId, id, revision,
        this.draft?.baseRevision ?? null);
      if (!result.ok || !result.record) {
        if (result.error === "conflict") {
          // The panel already has a screen for this; it is the same conflict
          // a save meets, so it is answered in the same place.
          this.conflict = { current: result.current ?? null, message: result.message ?? "Someone else saved this complication first." };
          this.closeHistoryDialog();
          return;
        }
        this.historyNote = result.message ?? result.error ?? "Restore failed";
        return;
      }
      this.closeHistoryDialog();
      this.conflict = undefined;
      this.remoteRevision = undefined;
      this.openRecord(result.record);
      this.beginSendWait();
      await this.loadRecords();
    } catch (err) {
      this.historyNote = errText(err);
    } finally {
      this.historyBusy = false;
    }
  }

  private closeHistoryDialog() {
    const dialog = this.renderRoot.querySelector<HTMLDialogElement>("dialog.history-dialog");
    if (dialog?.open) dialog.close();
    else this.historyClosed();
  }

  /** However the dialog shut, a body fetch still on its way has nowhere to go. */
  private historyClosed() {
    this.historyOpen = false;
    this.historyConfirm = false;
    this.historyBusy = false;
    this.historyRun += 1;
  }

  // ── Parts ──────────────────────────────────────────────────────────
  //
  // Two dialogs over one library. Save keeps the picked layers as share text;
  // Add reads that text back, asks this home for an entity per slot, and drops
  // the layers into the open document as one undoable step.

  /** Names the library already uses, lower-cased, so a second part is not
   * called the same thing as the first. */
  private partNames(exceptId?: string): Set<string> {
    const rows = (this.parts ?? []).filter((p) => p.id !== exceptId);
    return new Set(rows.map((p) => p.name.trim().toLowerCase()));
  }

  /** Fetch the library. Kept for the tab once it arrives: one library serves
   * every complication opened here. */
  private async loadParts(): Promise<void> {
    this.partsBusy = true;
    try {
      const reply = await fetchParts(this.hass);
      this.parts = reply.parts;
      this.partsError = undefined;
    } catch (err) {
      this.partsError = errText(err);
    } finally {
      this.partsBusy = false;
    }
  }

  /** A part's text read back into a document, remembered per part so the grid
   * does not re-parse every row on every render. */
  private partConfig(part: SavedPart): CustomComplicationConfig | undefined {
    const cached = this.partConfigCache.get(part.id);
    if (cached && cached.text === part.text) return cached.config;
    const parse = parseImportText(part.text, this.maxSchemaVersion);
    const config = parse.ok ? parse.config : undefined;
    this.partConfigCache.set(part.id, { text: part.text, config });
    return config;
  }

  /** Save to parts: the picked layers, under a name. A row being designed
   * is out, the same way copying one is: a row is not a layer of the
   * document, so a part made of one could never be put back. */
  private async openSavePartDialog() {
    const cfg = this.draft?.config;
    const ids = this.selectedIds();
    if (!cfg || !this.canEdit || ids.length === 0 || this.rowEditList()) return;
    if (this.parts === undefined) await this.loadParts();
    const ctx = describeContext(this.host());
    const names = ids.map((id) => {
      const el = cfg.elements.find((e) => e.payload.id === id);
      return el ? layerTitle(el, ctx) : "";
    });
    this.savePartIds = ids;
    this.savePartName = suggestPartName(names, this.partNames());
    this.savePartError = undefined;
    this.savePartOpen = true;
    await this.updateComplete;
    const dialog = this.renderRoot.querySelector<HTMLDialogElement>("dialog.save-part-dialog");
    if (dialog && !dialog.open) dialog.showModal();
    dialog?.querySelector<HTMLInputElement>("input.part-name")?.select();
  }

  private closeSavePartDialog() {
    const dialog = this.renderRoot.querySelector<HTMLDialogElement>("dialog.save-part-dialog");
    if (dialog?.open) dialog.close();
    this.savePartOpen = false;
  }

  private async doSavePart() {
    const cfg = this.draft?.config;
    const name = this.savePartName.trim();
    if (!cfg || this.savePartBusy || name === "" || this.savePartIds.length === 0) return;
    const doc = partFromSelection(cfg, this.savePartIds, name, this.canvasFamily);
    const text = partText(doc, this.knownDomains());
    if (!partTextFits(text)) {
      this.savePartError = "These layers are too big to keep as a part. Pick fewer of them.";
      return;
    }
    this.savePartBusy = true;
    this.savePartError = undefined;
    try {
      const reply = await savePart(this.hass, name, text);
      this.parts = [reply.part, ...(this.parts ?? []).filter((p) => p.id !== reply.part.id)];
      this.closeSavePartDialog();
    } catch (err) {
      this.savePartError = errText(err);
    } finally {
      this.savePartBusy = false;
    }
  }

  /** The Save dialog: what is being kept, and what to call it. Short on
   * purpose; everything else about a part is worked out from the layers. */
  private renderSavePartDialog() {
    const cfg = this.draft?.config;
    if (!cfg) return nothing;
    const ctx = describeContext(this.host());
    const picked = this.savePartIds
      .map((id) => cfg.elements.find((e) => e.payload.id === id))
      .filter((el): el is CElement => el !== undefined);
    const name = this.savePartName.trim();
    const taken = name !== "" && this.partNames().has(name.toLowerCase());
    const problem = name === "" ? "Give it a name first." : taken ? "A part already has that name." : undefined;
    return html`<dialog class="save-part-dialog xf" @close=${() => { this.savePartOpen = false; }}
      @keydown=${(e: KeyboardEvent) => { if (e.key === "Enter" && problem === undefined) { e.preventDefault(); void this.doSavePart(); } }}>
      ${this.dialogHead("Save to parts", "Kept for this home, ready to drop into any complication", () => this.closeSavePartDialog())}
      <div class="xfer-body">
        <label class="xf-f"><span class="xf-label">Name</span>
          <input class="part-name" type="text" maxlength="60" aria-invalid=${taken ? "true" : "false"} .value=${this.savePartName}
            @input=${(e: Event) => { this.savePartName = (e.target as HTMLInputElement).value; }} /></label>
        ${taken ? html`<div class="hint err">A part already has that name.</div>` : nothing}
        <div class="xf-stack">
          <span class="xf-label">Layers<span class="r">${picked.length}</span></span>
          <div class="xf-rows">
            ${picked.map((el) => html`<div class="xf-row" style=${`--k:${KIND_COLOR[el.kind]}`}>
              <span class="ent-ico xf-dom">${uiIcon(el.kind)}</span>
              <div class="xf-main"><div class="xf-name">${layerTitle(el, ctx)}</div>
                <div class="xf-sub">${KIND_LABEL[el.kind]}</div></div>
            </div>`)}
          </div>
        </div>
        <div class="xf-lead">${uiIcon("info")}<span>Your entity ids become numbered slots, the way Share does it. Adding the part back asks which of your entities each slot is.</span></div>
        ${this.savePartError ? html`<div class="hint err" role="alert">${this.savePartError}</div>` : nothing}
      </div>
      <div class="xfer-foot">
        <span class="spacer"></span>
        <button class="small" @click=${() => this.closeSavePartDialog()}>Cancel</button>
        <button class="primary" ?disabled=${problem !== undefined || this.savePartBusy}
          title=${problem ?? "Keep these layers"} @click=${() => void this.doSavePart()}>${this.savePartBusy ? "Saving…" : "Save"}</button>
      </div>
    </dialog>`;
  }

  /** Add from parts. Opens on the grid; the library is fetched the first
   * time and re-read on every open, since another tab may have added one. */
  private async openPartsDialog() {
    if (!this.canEdit || !this.draft) return;
    this.partsOpen = true;
    this.partPick = undefined;
    this.partMap = new Map();
    this.partRename = undefined;
    this.partConfirmDelete = undefined;
    this.partsError = undefined;
    await this.updateComplete;
    const dialog = this.renderRoot.querySelector<HTMLDialogElement>("dialog.parts-dialog");
    if (dialog && !dialog.open) dialog.showModal();
    await this.loadParts();
  }

  private closePartsDialog() {
    const dialog = this.renderRoot.querySelector<HTMLDialogElement>("dialog.parts-dialog");
    if (dialog?.open) dialog.close();
    this.partsOpen = false;
  }

  private choosePart(part: SavedPart) {
    const config = this.partConfig(part);
    if (!config) {
      this.partsError = "That part could not be read. It may have been made by a newer panel.";
      return;
    }
    this.partPick = { id: part.id, config };
    this.partMap = new Map();
    this.partsError = undefined;
  }

  private setPartEntity(entityId: string, ref: EntityRef) {
    const next = new Map(this.partMap);
    if (ref.entityId === "") next.delete(entityId);
    else next.set(entityId, entityRefFrom(this.hass.states, ref.entityId));
    this.partMap = next;
  }

  /** Drop the chosen part into the open document: one mutation, so one undo
   * step takes the whole part back out again. */
  private doAddPart() {
    const pick = this.partPick;
    const cfg = this.draft?.config;
    if (!pick || !cfg || !this.canEdit) return;
    const family = this.canvasFamily;
    if (!isDrawable(family)) return;
    const part = remapEntities(pick.config, this.partMap);
    let landed: string[] = [];
    this.addHere((c) => { landed = insertPart(c, part, family); });
    this.closePartsDialog();
    this.selectRows(landed);
  }

  private async renamePart(id: string, name: string) {
    this.partRename = undefined;
    const part = (this.parts ?? []).find((p) => p.id === id);
    const clean = name.trim();
    if (!part || clean === "" || clean === part.name) return;
    try {
      const reply = await savePart(this.hass, clean, part.text, id);
      this.parts = (this.parts ?? []).map((p) => (p.id === id ? reply.part : p));
      this.partsError = undefined;
    } catch (err) {
      this.partsError = errText(err);
    }
  }

  private async removePart(id: string) {
    this.partConfirmDelete = undefined;
    try {
      await deletePart(this.hass, id);
      this.parts = (this.parts ?? []).filter((p) => p.id !== id);
      this.partConfigCache.delete(id);
      if (this.partPick?.id === id) this.partPick = undefined;
      this.partsError = undefined;
    } catch (err) {
      this.partsError = errText(err);
    }
  }

  /** One part's picture: its own shape, drawn by the panel's renderer from the
   * part's text. Nothing is stored beside the text, so a part drawn here is
   * always the part that is there. */
  private partThumb(part: SavedPart) {
    const cfg = this.partConfig(part);
    const family = cfg ? this.dialogFamily(cfg) : undefined;
    if (!cfg || family === undefined || !isDrawable(family)) return html`<span class="pt-thumb"></span>`;
    const layout = this.configLayouts(cfg, [])[family];
    return html`<span class="pt-thumb ${family}">${layout
      ? renderLayout(layout, { icons: this.icons, imageSizes: this.imageSizes, slot: slotFor(this.referenceCase, family) })
      : nothing}</span>`;
  }

  private renderPartsDialog() {
    return html`<dialog class="parts-dialog xf" @close=${() => { this.partsOpen = false; }}>
      ${this.dialogHead("Parts", "Layers you kept, ready to drop into this complication", () => this.closePartsDialog())}
      ${this.partPick ? this.renderPartPicked(this.partPick.config) : this.renderPartsGrid()}
    </dialog>`;
  }

  /** The library as a grid of pictures. Rename and delete live on the card, so
   * tidying up never needs a second dialog; the delete asks once, on the card
   * itself, and the question goes away on its own when anything else is
   * clicked. */
  private renderPartsGrid() {
    const rows = this.parts ?? [];
    return html`<div class="xfer-body">
      ${this.partsError ? html`<div class="hint err" role="alert">${this.partsError}</div>` : nothing}
      ${this.parts === undefined
        ? html`<div class="xf-sub">Reading your parts…</div>`
        : rows.length === 0
          ? html`<div class="xf-lead">${uiIcon("info")}<span>No parts yet. Pick a layer or a few in the Layers list, then <b>Save to parts</b>.</span></div>`
          : html`<div class="pt-grid">${rows.map((part) => this.renderPartCard(part))}</div>`}
    </div>
    <div class="xfer-foot">
      <span class="spacer"></span>
      <button class="small" @click=${() => this.closePartsDialog()}>Close</button>
    </div>`;
  }

  private renderPartCard(part: SavedPart) {
    const renaming = this.partRename?.id === part.id;
    const asking = this.partConfirmDelete === part.id;
    const cfg = this.partConfig(part);
    const layers = cfg ? cfg.elements.length : 0;
    return html`<div class="pt-card ${asking ? "asking" : ""}">
      <button class="pt-pick" title=${cfg ? "Add this part" : "This part could not be read"} ?disabled=${!cfg}
        @click=${() => this.choosePart(part)}>
        ${this.partThumb(part)}
        <span class="pt-name">${part.name}</span>
        <span class="pt-sub">${cfg ? `${layers} ${layers === 1 ? "layer" : "layers"}` : "Could not be read"}</span>
      </button>
      ${renaming
        ? html`<input class="pt-rename" type="text" maxlength="60" .value=${this.partRename!.name}
            @input=${(e: Event) => { this.partRename = { id: part.id, name: (e.target as HTMLInputElement).value }; }}
            @keydown=${(e: KeyboardEvent) => {
              if (e.key === "Enter") { e.preventDefault(); void this.renamePart(part.id, this.partRename?.name ?? ""); }
              if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); this.partRename = undefined; }
            }}
            @blur=${() => void this.renamePart(part.id, this.partRename?.name ?? "")} />`
        : asking
          ? html`<div class="pt-acts"><span class="pt-ask">Delete it?</span>
              <button class="small danger" @click=${() => void this.removePart(part.id)}>Delete</button>
              <button class="small" @click=${() => { this.partConfirmDelete = undefined; }}>Keep</button></div>`
          : html`<div class="pt-acts">
              <button class="small" @click=${() => { this.partRename = { id: part.id, name: part.name }; }}>Rename</button>
              <button class="small danger" @click=${() => { this.partConfirmDelete = part.id; }}>Delete</button></div>`}
    </div>`;
  }

  /** A part chosen: its picture, a row per entity it needs, and the way in.
   * The same table the Import dialog shows, asking the same question. */
  private renderPartPicked(cfg: CustomComplicationConfig) {
    const rows = unresolvedEntities(cfg, this.hass.states);
    const required = rows.filter((row) => row.required);
    const picked = required.filter((row) => this.partMap.has(row.entityId)).length;
    const preview = remapEntities(cfg, this.partMap);
    let entities: EntityRef[] = [];
    try {
      entities = [...compile(preview).entities.values()];
    } catch {
      entities = [];
    }
    const layouts = this.configLayouts(preview, entities);
    const family = this.dialogFamily(preview);
    const here = this.canvasFamily;
    const problem = !isDrawable(here)
      ? "Open a shape with a canvas first. A part is layers, and there is nowhere to put them here."
      : undefined;
    return html`<div class="xfer-body">
      <div class="xf-hero">
        ${this.dialogPreview(layouts, family, [], family ? familyTitle(family) : "", "")}
        <div class="xf-stack">
          <div class="xf-sub">${layerCountWords(cfg)}</div>
          <div class="xf-lead">${uiIcon("info")}<span>These layers land on the <b>${familyTitle(here)}</b> shape, the one you are editing.</span></div>
        </div>
      </div>
      ${rows.length === 0
        ? html`<div class="xf-lead">${uiIcon("check")}<span>Every entity this part reads is already in your Home Assistant.</span></div>`
        : html`<div class="xf-stack">
          <div class="xf-label">Pick your entities${required.length > 0 ? html`<span class="r">${picked} of ${required.length}</span>` : nothing}</div>
          <div class="xf-rows">${rows.map((row) => this.renderPartRow(row))}</div>
          ${picked < required.length ? html`<div class="xf-lead">${uiIcon("info")}<span>You can add it now and pick the rest in the editor.</span></div>` : nothing}
        </div>`}
      ${hasInstanceFilters(cfg)
        ? html`<div class="xf-lead warn">${uiIcon("info")}<span>This part filters by areas, labels or floors from the home it was made on. Check its aggregate layers after adding it.</span></div>`
        : nothing}
      ${this.partsError ? html`<div class="hint err" role="alert">${this.partsError}</div>` : nothing}
    </div>
    <div class="xfer-foot">
      <button class="ghost" @click=${() => { this.partPick = undefined; this.partMap = new Map(); }}>Back to parts</button>
      <span class="spacer"></span>
      <button class="primary" ?disabled=${problem !== undefined}
        title=${problem ?? "Put these layers into the open complication"} @click=${() => this.doAddPart()}>Add to this complication</button>
    </div>`;
  }

  private renderPartRow(row: UnresolvedEntity) {
    const chosen = this.partMap.get(row.entityId);
    return html`<div class="xf-row pick">
      <span class="ent-ico xf-dom">${domainIcon(row.domain)}</span>
      <div class="xf-main">
        <div class="xf-name">${row.label}${chosen ? html`<span class="xf-done" title="Picked">${uiIcon("check")}</span>` : nothing}</div>
        <div class="xf-sub">${row.where.join(", ")}</div>
        ${row.required ? nothing : html`<div class="xf-sub">Not in your Home Assistant right now. Leave it empty to keep the id.</div>`}
        <div class="xf-picker">${entityField({ hass: this.hass }, row.label, chosen ?? NO_ENTITY,
          (ref) => this.setPartEntity(row.entityId, ref),
          `part-entity-${row.entityId}`,
          { compact: true, domain: row.domain, needed: row.required && chosen === undefined })}</div>
      </div>
    </div>`;
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

  // ── left column ───────────────────────────────────────────────────────

  /** One tinted button per kind, and the presets under them. Above the
   * list on purpose: adding a layer never moves the button just pressed.
   *
   * The card folds, and its buttons have the same two densities the Layers
   * list has. Both choices are remembered per browser, because the person who
   * has built five faces already knows what a gauge looks like and wants the
   * room, and the person on their first one does not. */
  private renderAddLayer() {
    const cfg = this.draft?.config;
    if (!cfg || !this.canEdit) return nothing;
    // Nothing to add to a shape with no canvas. Left up, the buttons would
    // quietly put the layer on whichever canvas shape happens to be first.
    if (!isDrawable(this.activeFamily)) return nothing;
    const full = cfg.elements.length >= 64;
    const open = this.addOpen;
    const rich = this.addDetail === "expanded";
    // A list is offered on the wide face and the four Home Screen tiles only:
    // a cell on a round face is not a row. The same rule picks which presets
    // are shown, so the button and the preset can never disagree.
    const kinds = KIND_ORDER.filter((k) => familyAllowsKind(this.activeFamily, k));
    const offered = LAYER_PRESETS.filter((p) => p.families === undefined || p.families.includes(this.activeFamily));
    const plain = offered.filter((p) => p.group === undefined);
    const listy = offered.filter((p) => p.group === "list");
    const toggle = () => { this.addOpen = !this.addOpen; this.saveListView(); };
    const addBlank = (k: CElement["kind"]) => {
      const el = newElement(k);
      this.addHere((c) => {
        // A timeline's clock times are always a layer of their own.
        c.elements.push(el);
        if (el.kind === "timeline") convertChartTimes(c, el.payload.id);
      });
      this.inspect = { kind: "layer", id: el.payload.id };
    };
    const addButton = (k: CElement["kind"], title: string, onClick: () => void, menu = false) => html`
      <button class="add" style=${`--k:${KIND_COLOR[k]}`} ?disabled=${full} title=${title}
        aria-haspopup=${menu ? "listbox" : nothing} aria-expanded=${menu ? (this.openMenu === "list" ? "true" : "false") : nothing}
        @click=${onClick}
        >${rich ? html`<span class="well">${addPreview(k)}</span>` : nothing}<span class="add-name">${rich ? uiIcon(k) : html`<span class="k"></span>`}<span>${KIND_LABEL[k]}</span></span></button>`;
    // A list is the one kind that starts better from a pattern than from
    // nothing, so its button opens a menu: a blank list first, then the
    // ready-made ones. The list presets do not sit in the preset row below;
    // they live here, under the button that makes lists.
    const listMenu = html`<span class="add-tool" data-menu="list">
      ${addButton("list", "Add a list: blank, or one of the ready-made ones", () => this.toggleMenu("list"), true)}
      ${this.openMenu === "list" ? html`<div class="pop-menu" role="listbox" aria-label="Add a list">
        <button class="row" role="option" @click=${() => { this.toggleMenu("list", false); addBlank("list"); }}>
          Blank list<small>Start from nothing and design the row yourself.</small></button>
        ${listy.length === 0 ? nothing : html`<div class="sep"></div>`}
        ${listy.map((p) => html`<button class="row" role="option" ?disabled=${cfg.elements.length + p.layerCount > 64}
          @click=${() => { this.toggleMenu("list", false); this.openPreset(p.kind); }}>${p.title}<small>${p.blurb}</small></button>`)}
      </div>` : nothing}
    </span>`;
    return html`<div class="card fold" data-open=${open ? "true" : "false"}>
      <h2 class="panel-title tools fold-h" role="button" tabindex="0" aria-expanded=${open ? "true" : "false"}
        title=${open ? "Hide the add buttons" : "Show the add buttons"}
        @click=${toggle}
        @keydown=${(e: KeyboardEvent) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); } }}>
        <span class="swatch">${uiIcon("plus")}</span>Add a layer<span class="spacer"></span>
        ${open ? nothing : html`<span class="mini">${kinds.length} kinds · ${offered.length} presets</span>`}
        ${open
          ? html`<span class="tool-set" @click=${(e: Event) => e.stopPropagation()}>
              <span class="seg" role="group" aria-label="Button detail">
                ${([["compact", "Names"],
                    ["expanded", "Samples"]] as const).map(([mode, tip]) => html`
                  <button class=${this.addDetail === mode ? "on" : ""} title=${tip} aria-label=${tip} aria-pressed=${this.addDetail === mode ? "true" : "false"}
                    @click=${() => { this.addDetail = mode; this.saveListView(); }}>${uiIcon(mode)}</button>`)}
              </span>
            </span>`
          : nothing}
        <span class="chev">${uiIcon("chevron")}</span>
      </h2>
      ${open
        ? html`
          <div class="add-grid ${rich ? "" : "lean"}">
            ${kinds.map((k) => k === "list"
              ? listMenu
              : addButton(k, `Add a blank ${KIND_LABEL[k].toLowerCase()} layer`, () => addBlank(k)))}
          </div>
          <div class="presets">
            <span class="presets-l">Presets</span>
            ${plain.map((p) => html`<button class="preset" title=${p.blurb}
              ?disabled=${cfg.elements.length + p.layerCount > 64}
              @click=${() => this.openPreset(p.kind)}>${p.title}</button>`)}
          </div>
          <div class="presets">
            <span class="presets-l">Saved</span>
            <button class="preset" ?disabled=${full}
              title="Layers you kept earlier, ready to drop onto this shape"
              @click=${() => void this.openPartsDialog()}>Add from parts</button>
          </div>`
        : nothing}
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

  /**
   * Only one row may hold the slot open at a time. dragover on the next row
   * can arrive before dragleave on the last one, so every mark comes off
   * before the new one goes on. Returns false when the row already has the
   * mark asked for, which is most events: dragover fires many times a second
   * and the list must not be rewritten on each one.
   */
  private markDrop(row: HTMLElement, zone: string): boolean {
    if (row.classList.contains(zone)) return false;
    this.clearDropMarks();
    row.classList.add(zone);
    return true;
  }

  /** Take every drop slot back out of the list. Runs on each move of the slot,
   * so it must leave the collapsed row alone: clearing that here put the
   * dragged row back on screen at the first dragover. Rows are cleared
   * wholesale rather than one by one because a reorder re-renders the list and
   * a row's DOM node can come back holding another row. */
  private clearDropMarks() {
    for (const row of this.renderRoot.querySelectorAll(".layer")) {
      row.classList.remove("drop-before", "drop-after", "drop-into");
    }
  }

  /** The end of a drag: the slot goes, and every collapsed row comes back. */
  private clearDragMarks() {
    this.clearDropMarks();
    for (const row of this.renderRoot.querySelectorAll(".layer, .group-kids")) {
      row.classList.remove("dragging");
    }
  }

  /** Drag-and-drop wiring shared by every row in the list. */
  private rowDrag(id: string, edit: boolean) {
    return {
      draggable: edit ? "true" : "false",
      onStart: (e: DragEvent) => {
        this.dragId = id;
        e.dataTransfer?.setData("text/plain", id);
        if (e.dataTransfer) e.dataTransfer.effectAllowed = "move";
        const row = e.currentTarget as HTMLElement;
        // A folder takes its members with it, and a list its row layers, so the
        // whole block leaves. The block always follows the row it belongs to,
        // which is what makes the next sibling the right thing to look at.
        const kids = row.nextElementSibling;
        // Not this tick: hiding the drag source inside dragstart itself
        // cancels the drag in some browsers. By the next task the drag image
        // is taken and the row can go. The guard covers a drag that was over
        // before the timer ran.
        window.setTimeout(() => {
          if (this.dragId !== id) return;
          row.classList.add("dragging");
          if (kids?.classList.contains("group-kids")) kids.classList.add("dragging");
        }, 0);
      },
      onEnd: () => {
        this.dragId = undefined;
        // A drag let go outside every row would otherwise leave a slot open
        // and the row it came from collapsed.
        this.clearDragMarks();
      },
      onOver: (e: DragEvent) => {
        if (!this.dragId || this.dragId === id) return;
        e.preventDefault();
        const row = e.currentTarget as HTMLElement;
        const r = row.getBoundingClientRect();
        // Measure against the row's own body, not the slot it may already be
        // holding open: an open slot moves the middle, and a middle that
        // moves under the pointer makes the answer flip back and forth.
        const top = r.top + (row.classList.contains("drop-before") ? DROP_GAP : 0);
        const bottom = r.bottom - (row.classList.contains("drop-after") ? DROP_GAP : 0);
        this.markDrop(row, e.clientY < (top + bottom) / 2 ? "drop-before" : "drop-after");
      },
      onDrop: (e: DragEvent) => {
        e.preventDefault();
        const row = e.currentTarget as HTMLElement;
        const before = row.classList.contains("drop-before");
        this.clearDragMarks();
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
    // A layer pinned to another page brings that page up. This is the one place
    // the editor moves the page for the user, and it is worth it: a selected
    // layer the canvas does not draw cannot be dragged, sized or seen react to
    // anything typed in the inspector.
    this.showPageOf(id);
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
    // A group needs two; from the keyboard this runs with any pick, so it has
    // to refuse rather than record an empty edit.
    if (!this.canEdit || ids.length < 2) return;
    let gid: string | undefined;
    this.mutate((c) => { gid = createGroup(c, ids); });
    this.multi = new Set();
    if (gid) this.inspect = { kind: "group", id: gid };
  }

  private renderLayers() {
    const cfg = this.draft?.config;
    if (!cfg) return nothing;
    // Inline is one line of text with no canvas, so it has no layers to list.
    // The card used to fall back to the first canvas shape and show that
    // shape's rows under a line of small print, which reads as "here are the
    // Inline layers" however the print is worded.
    if (!isDrawable(this.activeFamily)) return this.renderInlineHasNoLayers();
    const edit = this.canEdit;
    const family = this.canvasFamily;
    const move = (id: string, dir: -1 | 1) => this.moveLayer(id, dir);
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
    //
    // Only this shape's layers. Every layer belongs to one shape, so the rows
    // here are the whole of what this shape draws and nothing on another shape
    // can be reached from them.
    //
    // Every layer of this shape stays in the list, hidden or not. Hiding one
    // used to move its row to a folded block below, which read as a delete: the
    // row the user had just clicked was gone from where they were looking. A
    // hidden row is dimmed and carries a "hidden" badge instead, so the list
    // stays a stable list of the shape's layers and the eye is a toggle rather
    // than a disappearing act.
    const ordered = ownedElements(cfg, family).filter((el) => !isAttachedTap(cfg, el)).reverse();
    const ctx = describeContext(this.host());
    const resolver = new Resolver(this.buildContext(), this.draft?.config);
    const layout = cfg.perFamily[this.activeFamily];
    const shapeHl = this.inspect.kind === "family";
    const shapeMeta = `${layout?.backgroundColorHex ? colorWords(layout.backgroundColorHex) : "transparent"} · ${layout?.borderColorHex ? `${layout.borderWidth} pt border` : "no border"}`;
    const pickedCount = [...this.multi].filter((id) => cfg.elements.some((e) => e.payload.id === id)).length;
    // A lone selection (one layer, or the members of a selected group) has no
    // bar of its own, and Save to parts is the one thing offered for it, so
    // the bar appears for that too. A row being designed is not a layer of the
    // document, so it offers nothing.
    const selectedCount = this.rowEditList() ? 0 : this.selectedIds().length;
    // Each row carries a picture of its own layer, drawn alone, the way a
    // painting app's layer list does. The rows resolve the shape the same way
    // the big preview does, so a forced state shows in both.
    const resolved = resolveAll(cfg, this.buildContext(), this.forced)[family];
    const scale = THUMB_STEPS[this.thumbStep];
    const thumbW = Math.round(THUMB_W * scale);
    const thumbH = Math.round(THUMB_H * scale);
    // A layer pinned to another page is not in the showing page's resolve at
    // all, so its row would carry an empty thumb. Each page that has a pinned
    // layer is resolved once more, on demand: at most three extra resolves, and
    // none at all on a document with no pages, which is nearly all of them.
    const paged = usesPages(cfg);
    const byPage = new Map<number, typeof resolved>();
    const resolvedOn = (page: number | undefined) => {
      if (!paged || page === undefined || page === this.page) return resolved;
      if (!byPage.has(page)) byPage.set(page, resolveAll(cfg, { ...this.buildContext(), page }, this.forced)[family]);
      return byPage.get(page);
    };
    const thumb = (ids: readonly string[], page?: number) => {
      const face = resolvedOn(page);
      return face
        ? html`<span class="thumb">${renderLayerThumb(face, ids, { icons: this.icons, imageSizes: this.imageSizes, width: thumbW, height: thumbH })}</span>`
        : html`<span class="thumb"></span>`;
    };
    const rich = this.layerDetail === "expanded";

    // `held` marks a member of the selected group: the row lights up with
    // its folder, a step softer than the selected row itself, because a drag
    // on the face moves all of them and the list should say so.
    const layerRow = (el: CElement, inGroup: boolean, held = false, chevron: TemplateResult | typeof nothing = nothing) => {
      const id = el.payload.id;
      const hl = this.inspect.kind === "layer" && this.inspect.id === id;
      const eff = effectivePlacement(cfg, family, el);
      const hidden = eff.isHidden;
      // A layer on another page stays in the list, dimmed and badged, for the
      // same reason a hidden one does: the list is the shape's layers, and a
      // row that vanishes when the page changes reads as a delete. Clicking it
      // brings its page up (clickRow).
      const page = paged ? el.payload.page : undefined;
      const offPage = page !== undefined && page !== this.page;
      const tap = attachedTapsOf(cfg, id)[0];
      const states = statesSummary(el.payload.rules);
      const pointed = this.picking && this.pickHoverId === id;
      const d = this.rowDrag(id, edit);
      return html`<div class="layer ${hl ? "hl" : ""} ${held ? "held" : ""} ${pointed ? "pick" : ""} ${this.dialogLitIds.includes(id) ? "lit" : ""} ${hidden || offPage ? "dim" : ""} ${this.multi.has(id) ? "multi" : ""} ${inGroup ? "kid" : ""} ${rich ? "rich" : ""}"
        style=${`--k:${KIND_COLOR[el.kind]}`} tabindex="0" draggable=${d.draggable}
        @pointerenter=${() => { this.listHoverIds = [id]; }}
        @pointerleave=${() => this.leaveRow([id])}
        @click=${(e: MouseEvent) => this.clickRow(id, e)}
        @keydown=${(e: KeyboardEvent) => { if (e.key === "Enter") this.inspect = { kind: "layer", id }; }}
        @dragstart=${d.onStart} @dragend=${d.onEnd} @dragover=${d.onOver} @drop=${d.onDrop}>
        <span class="grip" title="Drag to reorder. Drop on a group to put it inside.">${uiIcon("grip")}</span>
        <span class="bar"></span>
        ${thumb([id], page)}
        <span class="name">
          <b>${layerTitle(el, ctx)}</b>
          <small><span class="kind">${KIND_LABEL[el.kind]}</span> · ${layerMeta(el, resolver, this.historySeries, eff.size)}</small>
          ${rich ? html`<span class="facts">${layerFacts(this.host(), family, el, eff).map((f) => html`<span class="fact"><b>${f.label}</b> ${f.value}</span>`)}</span>` : nothing}
        </span>
        <span class="right">
          <span class="badges">
            ${tap ? html`<span class="badge tap" title=${`Tappable · ${layerTitle(tap, ctx)}`}>tap</span>` : nothing}
            ${el.payload.rules.length === 0 ? nothing : html`<span class="badge states" title=${states}>${states.replace(/\.$/, "").toLowerCase()}</span>`}
            ${hidden ? html`<span class="badge">hidden</span>` : nothing}
            ${offPage ? html`<span class="badge" title=${`On page ${page}`}>p${page}</span>` : nothing}
          </span>
          ${edit ? html`<span class="acts">
            <button class="icon" title=${`Bring forward (${KEY_MOD}])`} aria-label="Bring forward" @click=${(e: Event) => { e.stopPropagation(); move(id, 1); }}>${uiIcon("up")}</button>
            <button class="icon" title=${`Send back (${KEY_MOD}[)`} aria-label="Send back" @click=${(e: Event) => { e.stopPropagation(); move(id, -1); }}>${uiIcon("down")}</button>
            <button class="icon" title=${`${eff.isHidden ? "Show" : "Hide"} (${KEY_SHIFT}${KEY_MOD}H)`} aria-label=${eff.isHidden ? "Show this layer" : "Hide this layer"} @click=${(e: Event) => { e.stopPropagation(); this.mutate((c) => setPlacement(c, family, id, { isHidden: !eff.isHidden })); }}>${uiIcon(eff.isHidden ? "hide" : "show")}</button>
            <button class="icon" title=${`Duplicate (${KEY_MOD}D)`} aria-label="Duplicate" @click=${(e: Event) => { e.stopPropagation(); dup(id); }}>${uiIcon("duplicate")}</button>
            <button class="icon danger" title="Delete (Delete)" aria-label="Delete" @click=${(e: Event) => { e.stopPropagation(); del(id); }}>${uiIcon("delete")}</button>
          </span>` : nothing}
          ${chevron}
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
      const zoneAt = (e: DragEvent): string => {
        const row = e.currentTarget as HTMLElement;
        const r = row.getBoundingClientRect();
        // Measure the folder's own body, ignoring any slot it is holding
        // open, so the three zones keep the same edges while the list moves.
        const top = r.top + (row.classList.contains("drop-before") ? DROP_GAP : 0);
        const bottom = r.bottom - (row.classList.contains("drop-after") ? DROP_GAP : 0);
        const y = (e.clientY - top) / Math.max(1, bottom - top);
        if (y < 0.25) return "drop-before";
        if (!open && y > 0.75) return "drop-after";
        return "drop-into";
      };
      const memberIds = members.map((m) => m.payload.id);
      return html`<div class="layer group ${hl ? "hl" : ""} ${this.dialogLitIds.includes(g.id) ? "lit" : ""} ${rich ? "rich" : ""}" style=${`--k:${SECTION_COLOR.group}`} tabindex="0" draggable=${d.draggable}
        @pointerenter=${() => { this.listHoverIds = memberIds; }}
        @pointerleave=${() => this.leaveRow(memberIds)}
        @click=${() => { this.multi = new Set(); this.inspect = { kind: "group", id: g.id }; }}
        @keydown=${(e: KeyboardEvent) => { if (e.key === "Enter") this.inspect = { kind: "group", id: g.id }; }}
        @dragstart=${d.onStart} @dragend=${d.onEnd}
        @dragover=${(e: DragEvent) => {
          if (!this.dragId || this.dragId === g.id) return;
          e.preventDefault();
          this.markDrop(e.currentTarget as HTMLElement, zoneAt(e));
        }}
        @drop=${(e: DragEvent) => {
          e.preventDefault();
          const zone = zoneAt(e);
          this.clearDragMarks();
          const id = this.dragId;
          this.dragId = undefined;
          if (!id || !first || !last) return;
          if (zone === "drop-before") { this.reorderLayer(id, first.payload.id, true, true); return; }
          if (zone === "drop-after") { this.reorderLayer(id, last.payload.id, false, true); return; }
          if (this.isGroupId(id)) return;
          this.reorderLayer(id, first.payload.id, true);
          this.mutate((c) => setGroup(c, id, g.id));
        }}>
        <span class="grip" title="Drag to reorder the whole group.">${uiIcon("grip")}</span>
        <span class="bar"></span>
        <span class="folder">${uiIcon("folder")}</span>
        <span class="name">
          <b>${g.name}</b>
          <small><span class="kind">Group</span> · ${members.length} layer${members.length === 1 ? "" : "s"} · ${g.locked ? "locked" : "unlocked"}</small>
          ${rich ? html`<span class="facts"><span class="fact"><b>Holds</b> ${members.map((m) => layerTitle(m, ctx)).join(", ")}</span></span>` : nothing}
        </span>
        <span class="right">
          ${edit ? html`<span class="acts">
            <button class="icon" title=${`Ungroup: keep the layers, drop the folder (${KEY_SHIFT}${KEY_MOD}G)`} aria-label="Ungroup" @click=${(e: Event) => { e.stopPropagation(); this.mutate((c) => ungroup(c, g.id)); if (hl) this.inspect = { kind: "general" }; }}>${uiIcon("ungroup")}</button>
          </span>` : nothing}
          <button class="icon lockbtn ${g.locked ? "on" : ""}" ?disabled=${!edit}
            title=${g.locked ? "Locked: drags on the watch move the whole group. Click to unlock." : "Unlocked: each layer moves alone, unless the group row is selected. Click to lock."}
            aria-label=${g.locked ? "Unlock the group" : "Lock the group"}
            @click=${(e: Event) => { e.stopPropagation(); this.mutate((c) => { const x = c.groups?.find((y) => y.id === g.id); if (x) x.locked = !x.locked; }); }}>${uiIcon(g.locked ? "lock" : "unlock")}</button>
          <button class="chev" aria-expanded=${open ? "true" : "false"} title=${open ? "Fold the group" : "Unfold the group"}
            @click=${(e: Event) => { e.stopPropagation(); const next = new Set(this.collapsed); if (open) next.add(g.id); else next.delete(g.id); this.collapsed = next; }}>${uiIcon("chevron")}</button>
        </span>
      </div>`;
    };

    // A list draws one row design once per item, so the row's layers hang under
    // the list the way a group's members hang under their folder.
    //
    // They are not layers of the shape: they live in the list's `template`, and
    // nothing on the face can be dropped among them, so these rows carry no
    // drag of their own and no duplicate. What they do carry is what a row
    // layer really has: reorder inside the row, hide, remove, and a click that
    // opens the row designer on that layer, which is the only place it can be
    // moved or sized.
    const rowKidRow = (list: Extract<CElement, { kind: "list" }>, row: CElement, i: number) => {
      const listId = list.payload.id;
      const id = row.payload.id;
      const hl = this.inspect.kind === "layer" && this.inspect.id === id;
      const hidden = row.payload.isHidden;
      const count = list.payload.template.length;
      const open = () => { this.setRowEdit(listId); this.inspect = { kind: "layer", id }; };
      // Every write lands on the real list, found again by id: while the row
      // designer is open the canvas is drawing a throwaway copy of the row.
      const onList = (change: (p: Extract<CElement, { kind: "list" }>["payload"]) => void) => this.mutate((c) => {
        const target = elementIn(c, listId);
        if (target?.kind === "list") change(target.payload);
      });
      // Top of the list draws last, so "bring forward" is later in the template.
      const swap = (by: 1 | -1) => onList((p) => {
        const a = p.template[i];
        const b = p.template[i + by];
        if (!a || !b) return;
        p.template[i] = b;
        p.template[i + by] = a;
      });
      return html`<div class="layer kid rowkid ${hl ? "hl" : ""} ${hidden ? "dim" : ""}"
        style=${`--k:${KIND_COLOR[row.kind]}`} tabindex="0"
        @pointerenter=${() => { this.listHoverIds = [id]; }}
        @pointerleave=${() => this.leaveRow([id])}
        @click=${() => open()}
        @keydown=${(e: KeyboardEvent) => { if (e.key === "Enter") open(); }}>
        <span class="grip" aria-hidden="true"></span>
        <span class="bar"></span>
        <span class="rowglyph">${uiIcon(rowKindIcon(row.kind))}</span>
        <span class="name">
          <b>${layerTitle(row, ctx)}</b>
          <small><span class="kind">${KIND_LABEL[row.kind]}</span> · drawn in every row</small>
        </span>
        <span class="right">
          <span class="badges">${hidden ? html`<span class="badge">hidden</span>` : nothing}</span>
          ${edit ? html`<span class="acts">
            <button class="icon" title="Bring forward in the row" aria-label="Bring forward in the row" ?disabled=${i === count - 1}
              @click=${(e: Event) => { e.stopPropagation(); swap(1); }}>${uiIcon("up")}</button>
            <button class="icon" title="Send back in the row" aria-label="Send back in the row" ?disabled=${i === 0}
              @click=${(e: Event) => { e.stopPropagation(); swap(-1); }}>${uiIcon("down")}</button>
            <button class="icon" title=${hidden ? "Show this layer" : "Hide this layer"} aria-label=${hidden ? "Show this layer" : "Hide this layer"}
              @click=${(e: Event) => { e.stopPropagation(); onList((p) => { const x = p.template[i]; if (x) x.payload.isHidden = !x.payload.isHidden; }); }}>${uiIcon(hidden ? "hide" : "show")}</button>
            <button class="icon danger" title="Remove this layer from the row" aria-label="Remove this layer from the row"
              @click=${(e: Event) => {
                e.stopPropagation();
                onList((p) => { p.template.splice(i, 1); syncListAttributes(p); });
                if (this.inspect.kind === "layer" && this.inspect.id === id) this.inspect = { kind: "layer", id: listId };
              }}>${uiIcon("delete")}</button>
          </span>` : nothing}
        </span>
      </div>`;
    };

    /** The fold switch on a list's own row, when it has a row to fold. */
    const listChevron = (el: CElement) => {
      if (el.kind !== "list" || el.payload.template.length === 0) return nothing;
      const id = el.payload.id;
      const open = !this.collapsed.has(id);
      return html`<button class="chev" aria-expanded=${open ? "true" : "false"}
        title=${open ? "Fold the row's layers" : "Unfold the row's layers"}
        @click=${(e: Event) => {
          e.stopPropagation();
          const next = new Set(this.collapsed);
          if (open) next.add(id); else next.delete(id);
          this.collapsed = next;
        }}>${uiIcon("chevron")}</button>`;
    };

    /** A list's row layers, top of the stack first, or nothing when it is
     * folded or its row is still empty. */
    const listKids = (el: CElement) => {
      if (el.kind !== "list" || el.payload.template.length === 0) return nothing;
      if (this.collapsed.has(el.payload.id)) return nothing;
      const kids = el.payload.template.map((row, i) => [row, i] as const).reverse();
      return html`<div class="group-kids rowkids">${kids.map(([row, i]) => rowKidRow(el, row, i))}</div>`;
    };

    // Walk the stack from the top. A group's members sit together, so the
    // folder row goes in where its first member is met and the members
    // follow it, indented. A list's row layers follow the list the same way.
    const rows: TemplateResult[] = [];
    const seen = new Set<string>();
    for (let i = 0; i < ordered.length; i++) {
      const el = ordered[i]!;
      const gid = el.payload.groupId;
      const g = gid === undefined ? undefined : cfg.groups?.find((x) => x.id === gid);
      if (!g) {
        rows.push(html`${layerRow(el, false, false, listChevron(el))}${listKids(el)}`);
        continue;
      }
      if (seen.has(g.id)) continue;
      seen.add(g.id);
      const members = ordered.filter((e) => e.payload.groupId === g.id);
      rows.push(groupRow(g, members));
      const groupHl = this.inspect.kind === "group" && this.inspect.id === g.id;
      if (!this.collapsed.has(g.id)) rows.push(html`<div class="group-kids">${members.map((m) => html`${layerRow(m, true, groupHl, listChevron(m))}${listKids(m)}`)}</div>`);
    }

    return html`<div class="card layers-card s${this.thumbStep}" style=${`--thumb-w:${thumbW}px;--thumb-h:${thumbH}px`}>
      <h2 class="panel-title tools" style=${`--c:${SECTION_COLOR.place}`}><span class="swatch">${uiIcon("layers")}</span>Layers
        <span class="mini">top draws last</span><span class="spacer"></span>
        <span class="tool-set">
          <span class="seg" role="group" aria-label="Row detail">
            ${([["compact", "Compact rows: the name and one line about the layer"],
                ["expanded", "Expanded rows: what the layer is made of and where it sits"]] as const).map(([mode, tip]) => html`
              <button class=${this.layerDetail === mode ? "on" : ""} title=${tip} aria-label=${tip} aria-pressed=${this.layerDetail === mode ? "true" : "false"}
                @click=${() => { this.layerDetail = mode; this.saveListView(); }}>${uiIcon(mode)}</button>`)}
          </span>
          <span class="seg" role="group" aria-label="Preview size">
            ${THUMB_STEP_LABEL.map((label, i) => html`
              <button class=${this.thumbStep === i ? "on" : ""} title=${`${THUMB_STEP_TITLE[i]} row pictures`}
                aria-label=${`${THUMB_STEP_TITLE[i]} row pictures`} aria-pressed=${this.thumbStep === i ? "true" : "false"}
                @click=${() => { this.thumbStep = i as ThumbStep; this.saveListView(); }}>${label}</button>`)}
          </span>
        </span>
      </h2>
      ${pickedCount >= 2 && edit
        ? html`<div class="group-cta"><span>${pickedCount} layers picked</span><span class="spacer"></span>
            <button class="small primary" title=${`Group (${KEY_MOD}G)`} @click=${() => this.groupPicked()}>Group them</button>
            <button class="small" title="Keep these layers under a name, to use in another complication"
              @click=${() => void this.openSavePartDialog()}>Save to parts</button>
            <button class="small" @click=${() => { this.multi = new Set(); }}>Clear</button></div>`
        : selectedCount >= 1 && edit
          ? html`<div class="part-cta"><span class="spacer"></span>
              <button class="ghost" title=${selectedCount === 1 ? "Keep this layer under a name, to use in another complication" : "Keep these layers under a name, to use in another complication"}
                @click=${() => void this.openSavePartDialog()}>Save to parts</button></div>`
        : cfg.elements.length >= 2 && edit && !cfg.groups?.length
          ? html`<div class="hint">${MULTI_KEY}-click layers here or on the preview, or shift-click a range of rows, then group them so a finished part moves as one. The <b>?</b> button in the header lists every key and mouse trick.</div>`
          : nothing}
      ${cfg.elements.length === 0 ? html`<div class="empty">No layers yet. Add one above.</div>` : nothing}
      ${this.renderShapeIsBlank(cfg, family, edit)}
      <div class="layers">
      ${rows}
      </div>
      <div class="layer pinned ${shapeHl ? "hl" : ""}" style=${`--k:${SECTION_COLOR.place}`} tabindex="0" title="The shape is always the bottom layer"
        @click=${() => { this.inspect = { kind: "family" }; }}
        @keydown=${(e: KeyboardEvent) => { if (e.key === "Enter") this.inspect = { kind: "family" }; }}
        @dragover=${(e: DragEvent) => { if (!this.dragId) return; e.preventDefault(); this.markDrop(e.currentTarget as HTMLElement, "drop-before"); }}
        @drop=${(e: DragEvent) => {
          e.preventDefault();
          this.clearDragMarks();
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
          <b>${familyTitle(this.activeFamily)} shape</b>
          <small><span class="kind">Background</span> · ${shapeMeta}</small>
        </span>
        <span class="right"><span class="badges"><span class="badge">always bottom</span></span></span>
      </div>
    </div>`;
  }

  /** The Layers card while Inline is the shape being edited: there is nothing
   * to list, and saying so beats listing another shape's rows. */
  private renderInlineHasNoLayers() {
    return html`<div class="card">
      <h2 class="panel-title"><span class="swatch">${uiIcon("layers")}</span>Layers</h2>
      <div class="empty">Inline is one line of text and draws no layers.
        Its text is on the right. Pick a canvas shape above to work on layers.</div>
    </div>`;
  }

  /**
   * The left column while the Control Center tab is up, in place of the
   * add-layer palette and the layer list.
   *
   * Both of those act on the shape being edited, and a control is not a shape.
   * Left standing they would offer to put a text layer on something that draws
   * no layers, so they go and this says why. The second line is about the
   * shapes: which one the face shows, or, on a document that has none, that a
   * shape can be added.
   */
  private renderControlHasNoLayers() {
    const cfg = this.draft?.config;
    // No shape at all: there is no tab to explain, so the note offers one
    // instead of saying which one stays.
    const shape = cfg && supportedFamilies(cfg).length === 0 ? undefined : familyTitle(this.activeFamily);
    const [note, shapeLine] = controlNoteLines(
      shape,
      deviceKindOf(this.selectedOwner) === "iphone",
    );
    return html`<div class="card">
      <h2 class="panel-title"><span class="swatch">${uiIcon("layers")}</span>Layers</h2>
      <div class="empty">${note}</div>
      <div class="hint">${shapeLine}</div>
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
    // A preset that asks nothing is built on the click. The four scope-based
    // list presets are these: what they need is a filter, and a filter is
    // edited in the Source card rather than chosen from a search box.
    if (presetSpec(kind).needsEntity === false) {
      const env: PresetEnv = { family: this.canvasFamily };
      let created: string | undefined;
      this.addHere((c) => { created = applyPreset(c, kind, { entityId: "", displayName: "", domain: "" }, env); });
      if (created) this.inspect = { kind: "layer", id: created };
      return;
    }
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
    this.addHere((c) => { created = applyPreset(c, kind, ref, env); });
    this.closePresetDialog();
    if (created) this.inspect = { kind: "layer", id: created };
  }

  // ── canvas column ─────────────────────────────────────────────────────

  /**
   * The middle column is the whole complication: the shape being edited,
   * big, then the values the complication defines and the live values it
   * reads. Its own settings are in the inspector while no layer is selected.
   */
  private renderCanvas() {
    if (this.parseError) return html`<div class="card error">This document cannot be read: ${this.parseError}</div>`;
    const cfg = this.canvasConfig();
    if (!cfg) return html`<div class="card"><div class="empty">Choose a complication in the picker above, or make a new one.</div></div>`;
    const layouts = resolveAll(cfg, this.buildContext(), this.forced);
    this.syncCountdownTicker(layouts);
    const deviceCase = this.currentCase();
    const family = this.activeFamily;
    // The Control Center tab: the shape tabs stay, since they are how anyone
    // gets back to a face, and everything else on the bar and the stage is a
    // layer tool with no layers to act on.
    if (this.inControlView) {
      return html`
        <div class="card canvas-card">
          <div class="canvas-bar">
            <div class="bar-row shapes">${this.renderShapeTabs(cfg, layouts)}</div>
          </div>
          <div class="stage">${this.renderControlStage(cfg)}</div>
        </div>
        <div class="under-grid">
          ${this.renderValuesRow()}
        </div>`;
    }
    return html`
      <div class="card canvas-card">
        <div class="canvas-bar">
          <div class="bar-row shapes">${this.renderShapeTabs(cfg, layouts)}</div>
          <div class="bar-row tools">
          <span class="inbox" title=${`Layouts are made in the ${this.referenceCase.label} box. Every other size draws a scaled copy of it.`}>
            <span class="pre">Preview as</span>
            <span class="case-tool" data-menu="case">
              <button class="case-pick" aria-haspopup="listbox" aria-expanded=${this.openMenu === "case" ? "true" : "false"}
                aria-label=${`Preview as ${deviceCase.label}`} @click=${() => this.toggleMenu("case")}>
                ${deviceCase.label}${deviceCase.measured ? "" : " (estimated)"}${uiIcon("chevron")}
              </button>
              ${this.openMenu === "case" ? html`<div class="pop-menu" role="listbox" aria-label="Preview as">
                ${this.previewCases.map((c) => html`<button class="row" role="option" aria-selected=${c.label === deviceCase.label ? "true" : "false"}
                  @click=${() => { this.toggleMenu("case", false); this.previewCase = c.label; }}>${c.label}${c.measured ? "" : " (estimated)"}</button>`)}
              </div>` : nothing}
            </span>
          </span>
          ${isDrawable(family) ? this.renderTintTool() : nothing}
          </div>
        </div>
        <div class="stage">
          ${this.renderRowStrip()}
          ${this.renderPageStrip()}
          ${isDrawable(family) ? this.renderOver() : nothing}
          ${isDrawable(family) ? this.renderBigPreview(family, layouts, deviceCase) : this.renderInlinePreview(layouts.inline, false)}
          ${this.renderUnder(cfg, family)}
        </div>
        ${this.zoomed && isDrawable(family) ? this.renderZoomDialog(family, layouts, deviceCase) : nothing}
      </div>
      <div class="under-grid">
        ${this.renderValuesRow()}
      </div>`;
  }

  private renderBigPreview(family: DrawableFamily, layouts: ResolvedAll, deviceCase: PreviewCase) {
    const layout = layouts[family];
    if (!layout) return nothing;
    const highlightId = this.inspect.kind === "layer" ? this.inspect.id : undefined;
    // The stage while a row is being designed, so a row layer outlines and a
    // group of the document does not reach into a canvas it is not on.
    const cfg = this.canvasConfig();
    // A selected group outlines every member; a selected member of a locked
    // group outlines the rest of its group too, since a drag moves them all.
    const gid = this.inspect.kind === "group" ? this.inspect.id : highlightId !== undefined && cfg ? groupOf(cfg, highlightId)?.id : undefined;
    const groupIds = cfg && gid !== undefined && (this.inspect.kind === "group" || groupOf(cfg, highlightId!)?.locked)
      ? groupMembers(cfg, gid).map((m) => m.payload.id) : [];
    // Layers picked for grouping, in the list or on the face, outline as well,
    // so the pick reads the same in both places.
    const outlineIds = [...new Set([...groupIds, ...this.multi])];
    const slot = slotFor(deviceCase, family);
    // Pick mode drops the resize handles: they are drag affordances, and
    // while picking nothing on the face is dragged. Review mode drops them
    // too, except on the one tap box it is narrowed to.
    const focus = this.focusTapId();
    // A row under the pointer in the inspector draws its layer as the one
    // selection, group outlines and all dropped, until the pointer leaves.
    const peek = !this.picking && !this.showTaps && this.rowHoverId !== undefined
      && cfg?.elements.some((e) => e.payload.id === this.rowHoverId) ? this.rowHoverId : undefined;
    const hoverIds = peek !== undefined ? [] : this.listHoverIds;
    const opts = {
      icons: this.icons, imageSizes: this.imageSizes, tapAreas: true, slot,
      highlightId: focus ?? peek ?? highlightId,
      ...(outlineIds.length > 0 && !this.showTaps && peek === undefined ? { highlightIds: outlineIds } : {}),
      ...(this.showGridLines || (!this.snapGrid && this.altHeld && this.canEdit) ? { grid: this.gridStep } : {}),
      ...(this.guides.length > 0 && family === this.activeFamily ? { guides: this.guides } : {}),
      tapReview: this.showTaps,
      // A Home Screen tile is tinted the iPhone way: no ground of its own, and
      // every layer painted in the tint at the brightness it was drawn in.
      ...(this.previewTint !== undefined
        ? { tint: this.previewTint, ...(isHomeFamily(family) ? { tintSurface: "phone" as const } : {}) }
        : {}),
      ...(focus !== undefined ? { tapFocusId: focus } : {}),
      handles: this.canEdit && !this.picking && (!this.showTaps || focus !== undefined),
      // Pick mode owns the tint while it is on; otherwise the Layers list
      // does, so resting on a row shows where that layer sits on the face.
      ...(this.picking
        ? (this.pickHoverId !== undefined ? { hoverId: this.pickHoverId } : {})
        : (hoverIds.length > 0 ? { hoverIds } : {})),
    };
    return html`<div class="preview ${family} active ${this.picking ? "picking" : ""}"
      @pointerdown=${(e: PointerEvent) => this.onPreviewPointerDown(family, e)}
      @dblclick=${(e: MouseEvent) => this.onPreviewDoubleClick(e)}
      @pointermove=${(e: PointerEvent) => this.onPickMove(e)}
      @pointerleave=${() => { if (this.picking) this.pickHoverId = undefined; }}>
      ${renderLayout(layout, opts)}
    </div>`;
  }

  /**
   * The stage while the Control Center tab is up: one big mock tile, and the
   * same kind of caption a shape gets.
   *
   * The same `controlTile` the card and the tab draw, three times the card's
   * size. Big because this is the whole of what a control looks like, and the
   * card's thumbnail is too small to judge a title against a tint in.
   */
  private renderControlStage(cfg: CustomComplicationConfig) {
    const spec = cfg.control;
    if (spec === undefined) return nothing;
    const host = this.host();
    const context = host.resolveContext?.();
    const control = context === undefined ? undefined : resolveControl(spec, context, cfg);
    const status = control?.status;
    const phone = controlDevice(host) === "iphone";
    const kind = controlEffectiveKind(spec) === "toggle" ? "Toggle" : "Button";
    // The watch prints the title and value line above its grid, so the stage
    // draws that line over the pill, big and white, the way the watch does.
    // The iPhone has two sizes of one control, so both stand side by side.
    return html`
      <div class=${`control-big ${phone ? "phone" : "watch"}`}>
        ${phone || control === undefined ? nothing : html`<div class="cc-head">${controlHeadline(control)}</div>`}
        ${controlTileShapes(controlDevice(host)).map((shape) => controlTile(host, spec, shape, CONTROL_TILE_SIDE * 2))}
      </div>
      <div class="under">
        <b>Control Center</b>
        <span class="dot">·</span>
        <span class="tail">${control === undefined || controlStateWord(control) === undefined
          ? `${kind}.`
          : html`${kind}, reads <b>${controlStateWord(control)}</b>.`} ${phone
          ? "A circle in the grid, or the wide tile when it is given two columns."
          : "The watch prints the title and value line above the grid, not on the tile."}</span>
      </div>
      ${status === undefined || !controlStatusShows(host, spec)
        ? nothing
        : html`<div class="under"><span class="tail">A press flashes <b>${status}</b> over the tile.</span></div>`}`;
  }

  /** The line under the preview: which shape, its size, and what a drag does now. */
  private renderUnder(cfg: CustomComplicationConfig, family: FamilyKind) {
    const ctx = describeContext(this.host());
    const ins = this.inspect;
    const sel = ins.kind === "layer" ? cfg.elements.find((e) => e.payload.id === ins.id) : undefined;
    let tail: TemplateResult | string;
    const designing = this.rowEditList();
    if (designing) {
      tail = html`one cell of <b>${layerTitle(designing, ctx)}</b>, scaled up. Drag and size the row's layers here.
        <button class="link" @click=${() => this.setRowEdit(undefined)}>Done designing</button>`;
    } else if (this.showTaps) {
      tail = html`Every tap area is outlined. Where two overlap, the one higher in Layers wins. Anywhere else does <b>${describeTapAction(cfg.tapAction)}</b>.`;
    } else if (this.picking) {
      tail = "Point at a layer and click it. Escape stops.";
    } else if (family === "inline") {
      tail = "One line of text. Edit it on the right.";
    } else if (ins.kind === "group") {
      const g = cfg.groups?.find((x) => x.id === ins.id);
      const n = g ? groupMembers(cfg, g.id).length : 0;
      tail = g ? html`editing group <b>${g.name}</b>. Drag to move all ${n} layers.${g.locked ? "" : " Click one layer to move it alone."}` : "";
    } else if (sel) {
      const g = groupOf(cfg, sel.payload.id);
      tail = g?.locked
        ? html`editing <b>${layerTitle(sel, ctx)}</b> in <b>${g.name}</b>. A drag moves the whole group; pull a corner to resize this layer. Arrow keys nudge the group.`
        : html`editing <b>${layerTitle(sel, ctx)}</b>. Drag it, or pull a corner. Arrow keys nudge it.${this.snapGrid && this.snapLayers ? " It snaps to the grid and to the other layers. Hold Alt to drag freely." : this.snapGrid ? " It snaps to the grid. Hold Alt to drag freely." : this.snapLayers ? " It snaps to the other layers. Hold Alt to drag freely." : " Hold Alt while dragging to snap to the grid."}`;
    } else {
      tail = "click a layer to edit it";
    }
    if (!isDrawable(family)) return html`<div class="under"><b>Inline</b><span class="dot">·</span><span class="tail">${tail}</span></div>`;
    const slot = slotFor(this.currentCase(), family);
    const fit = fitBox(slot, family);
    const pct = Math.round(fit.scale * 100);
    return html`<div class="under">
      <b>${familyTitle(family)}</b>
      <span class="size">${slot.width} × ${slot.height} pt${pct !== 100 ? ` · ${pct}%` : ""}</span>
      <span class="dot">·</span>
      <span class="tail">${tail}</span>
    </div>`;
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

  /**
   * Values the complication defines once and several layers read, under the
   * Layers card because layers are what read them. Always there, so the idea
   * is findable: a single title row with a line of explanation and Add until
   * the first one exists, then the list.
   */
  private renderSharedValues() {
    const cfg = this.draft?.config;
    if (!cfg) return nothing;
    const values = cfg.values;
    const add = this.canEdit
      ? html`<button class="small" @click=${() => { const nv = newNamedValue(); this.mutate((c) => { c.values.push(nv); }); this.openSharedValue(nv.id); }}>Add</button>`
      : nothing;
    const explain = "Like a variable: set it once, and every layer that reads it follows.";
    const title = html`<h2 class="panel-title"><span class="swatch">${uiIcon("content")}</span>Shared values
        <span class="mini" title=${explain}>set once, used by many layers</span>
        <button type="button" class="sec-help ${this.sharedHelp ? "on" : ""}" title=${this.sharedHelp ? "Hide how shared values work" : "How shared values work"}
          aria-label="How shared values work" aria-expanded=${this.sharedHelp ? "true" : "false"}
          @click=${() => { this.sharedHelp = !this.sharedHelp; }}>?</button>
        <span class="spacer"></span>${add}
      </h2>
      ${this.sharedHelp ? html`<div class="shared-help">
        <p>${explain} Use one when several layers show the same thing, so a change is made in one place.</p>
        <ol>
          <li><b>Add</b> one here. Give it a name and choose its source, like an entity.</li>
          <li>On a layer, open its value and set <b>Source</b> to <b>Shared value</b>. Or click <b>Make shared</b> on a value that is already set up.</li>
          <li>Change the shared value here. Every layer that reads it changes too.</li>
          <li>Each layer can still add its own <b>Format</b>, like a unit or fewer decimals.</li>
        </ol>
      </div>` : nothing}`;
    if (values.length === 0) {
      return html`<div class="card tint-values values-list ${this.sharedHelp ? "" : "empty-list"}" style=${`--c:${SECTION_COLOR.complication}`}>
        ${title}
      </div>`;
    }
    const host = this.host();
    const resolver = new Resolver(this.buildContext(), this.draft?.config);
    const ctx = describeContext(host);
    return html`<div class="card tint-values values-list" style=${`--c:${SECTION_COLOR.complication}`}>
      ${title}
      <div class="data">
      ${values.map((v) => {
        const r = resolver.resolve({ kind: { kind: "named", id: v.id } });
        const open = this.openValue === v.id;
        const toggle = () => { this.setOpenValue(open ? undefined : v.id); };
        return html`<div class="vitem ${open ? "open" : ""}"><div class="datum vrow ${open ? "hl" : ""}" role="button" tabindex="0" aria-expanded=${open ? "true" : "false"}
            title=${open ? "Close" : "Edit this shared value"}
            @click=${toggle}
            @keydown=${(e: KeyboardEvent) => { if ((e.key === "Enter" || e.key === " ") && e.target === e.currentTarget) { e.preventDefault(); toggle(); } }}>
          <span class="nm">${v.name || "(unnamed)"}</span>
          <span class="spacer"></span>
          <span class="meta ${r === undefined ? "none" : ""}" title=${describeValue(v.value, ctx)}>${r ?? "unresolved"}</span>
          ${this.canEdit ? html`<button class="icon danger" title="Delete. Layers that read it keep their own copy." aria-label="Delete value" @click=${(e: Event) => { e.stopPropagation(); this.mutate((c) => { deleteSharedValue(c, v.id); }); if (open) this.openValue = undefined; }}>${uiIcon("delete")}</button>` : nothing}
        </div>
        ${open ? html`<div class="value-open">${namedValueEditor(host, v)}</div>` : nothing}</div>`;
      })}
      </div>
    </div>`;
  }

  /** A pointer is held down, so a focus change is part of a click that
   * `sharedValueOutside` will judge once it lands. */
  private pressing = false;
  private pressStart = () => { this.pressing = true; };
  /** Cleared after the click that follows pointerup has been dispatched. */
  private pressEnd = () => { window.setTimeout(() => { this.pressing = false; }); };

  /** Tabbing away closes the open value. A focus change made by a mouse press
   * waits for the click instead. */
  private sharedValueFocus = (e: FocusEvent) => {
    if (!this.pressing) this.sharedValueOutside(e);
  };

  /**
   * Close the open shared value once a click or the keyboard lands somewhere
   * else. The row and its editor are one `.vitem`; anything inside it (a
   * field, a popover the form opened, the row itself, which toggles on its own
   * click) keeps it open. A click on the card's own scrollbar lands on the
   * card itself and is not a move away.
   *
   * On the click, never the press: closing folds the editor away and the rows
   * under it move up, so closing on press would send the click that follows
   * to whatever row slid under the pointer.
   */
  private sharedValueOutside = (e: Event) => {
    if (this.openValue === undefined) return;
    const path = e.composedPath();
    const first = path[0];
    if (first instanceof HTMLElement && first.classList.contains("values-list")) return;
    const inside = path.some((n) => n instanceof HTMLElement && n.classList.contains("vitem") && n.classList.contains("open"));
    if (!inside) this.setOpenValue(undefined);
  };

  /**
   * Open a shared value, or close the open one with undefined. A value closed
   * while its name is still blank was never really made, so it is removed
   * rather than left in the list as "(unnamed)". A layer already reading it
   * keeps its own copy, the same as a delete.
   */
  private setOpenValue(id: string | undefined) {
    const left = this.openValue;
    this.openValue = id;
    if (left === undefined || left === id) return;
    const value = this.draft?.config.values.find((v) => v.id === left);
    if (value && value.name.trim() === "") this.mutate((c) => { deleteSharedValue(c, left); });
  }

  /** Open one shared value in its card and bring it into view. A value popover
   * that asked for this is closed first, or it would float over the page with
   * its chip scrolled away. A value with no name yet (a new one) also gets the
   * caret in its Name box, since naming it is the first thing to do. */
  private openSharedValue(id: string) {
    this.renderRoot.querySelectorAll<HTMLElement>(":popover-open").forEach((p) => p.hidePopover());
    this.setOpenValue(id);
    const unnamed = this.draft?.config.values.find((v) => v.id === id)?.name.trim() === "";
    void this.updateComplete.then(() => {
      this.renderRoot.querySelector(".values-list .datum.hl")?.scrollIntoView({ block: "start", behavior: "smooth" });
      if (unnamed) this.renderRoot.querySelector<HTMLInputElement>(".values-list .value-open input[type=text]")?.focus({ preventScroll: true });
    });
  }

  /** Open the footer on its raw document, which is where the JSON lives. */
  private openRaw() {
    this.showRaw = true;
    const foot = this.renderRoot.querySelector<HTMLDetailsElement>("details.foot");
    if (foot) foot.open = true;
    void this.updateComplete.then(() => this.renderRoot.querySelector("pre")?.scrollIntoView({ block: "nearest" }));
  }

  /**
   * One tab per shape, along the top of the canvas card. A shape the
   * complication has carries a real picture of itself and swaps into the big
   * preview when clicked; a shape it does not have is a dashed invitation to
   * add one. Tabs rather than tiles because this is which face you are looking
   * at, and that question belongs on the face's own card.
   */
  /**
   * The shapes the complication has, as one segmented control, and after it
   * the shapes it could add, as small dashed buttons. Kept apart so the control
   * reads as "which one am I editing" and the adds as a separate offer.
   *
   * The Control Center control is last in both halves: a tab while the
   * document has one, an adder while it does not, because it is added and
   * removed exactly like a shape (decided 2026-09-16).
   */
  private renderShapeTabs(cfg: CustomComplicationConfig, layouts: ResolvedAll) {
    const have = cfg.supportedFamilies;
    const missing = this.ownerFamilies.filter((f) => !have.includes(f));
    const addsControl = cfg.control === undefined && deviceSupportsControls(this.selectedOwner?.app_version);
    const spare = missing.length + (addsControl ? 1 : 0);
    return html`<div class="shape-seg" role="group" aria-label="Shapes">${this.renderHaveTabs(cfg, layouts)}${this.renderControlTab(cfg)}</div>
      ${spare > 0 ? html`<span class="shape-adds">
        <button class="tab off add-shape" ?disabled=${!this.canEdit} popovertarget="add-shapes"
          title="Add another shape, or the Control Center control">${uiIcon("plus")}Add a shape</button>
        <span class="shape-spare">${spare === 1 ? "1 more available" : `${spare} more available`}</span>
        <div id="add-shapes" popover="auto" class="add-menu" @beforetoggle=${this.placeAddMenu}>
          ${this.renderAddGroups(missing, addsControl)}
        </div>
      </span>` : nothing}`;
  }

  /**
   * What the Add a shape panel offers, under the same place headings the New
   * dialog uses.
   *
   * The row this replaced laid every missing shape out in one line, so a phone
   * owner read "+ Rectangular + Circular + Inline + Small + Large" and had no
   * way to tell that the first three are the Lock Screen and the last two the
   * Home Screen. Grouping is the whole point; the panel is only where the
   * grouping fits.
   */
  private renderAddGroups(missing: readonly FamilyKind[], addsControl: boolean) {
    const phone = deviceKindOf(this.selectedOwner) === "iphone";
    return html`${placeGroups(this.selectedOwner, missing, comingSoonFamilies(this.selectedOwner)).map((group) => html`<div class="add-group">
        <span class="add-group-label">${group.label}</span>
        <div class="shape-cards">
          ${group.families.map((f) => html`<button type="button" class="shape-card" title=${`Add the ${familyTitle(f)} shape`}
            @click=${() => { this.closeAddMenu(); this.addShape(f); }}>
            ${familyArt(f, phone)}
            <span class="shape-card-name">${familyTitle(f)}</span>
          </button>`)}
          ${group.comingSoon.map((f) => html`<button type="button" class="shape-card soon" disabled aria-disabled="true" title="Coming soon">
            ${familyArt(f, phone)}
            <span class="shape-card-name">${familyTitle(f)}</span>
            <span class="shape-card-note">Coming soon</span>
          </button>`)}
        </div>
      </div>`)}
      ${addsControl ? html`<div class="add-group">
        <span class="add-group-label">Control Center</span>
        <div class="shape-cards">
          <button type="button" class="shape-card" title="Add a Control Center control, beside whatever the complication already draws"
            @click=${() => { this.closeAddMenu(); this.addControl(); }}>
            ${controlArt(phone)}
            <span class="shape-card-name">Control</span>
          </button>
        </div>
      </div>` : nothing}`;
  }

  /**
   * Put the Add a shape panel under the button that opened it.
   *
   * A popover is drawn in the top layer, so it is laid out against the viewport
   * rather than the bar it belongs to, and CSS anchor positioning is not in
   * every browser Home Assistant runs in yet. Measuring the button on the way
   * open is the version that works everywhere. It is clamped to the viewport so
   * a bar scrolled to the right edge does not push the panel off screen.
   */
  private placeAddMenu = (e: Event) => {
    if ((e as unknown as { newState?: string }).newState !== "open") return;
    const panel = e.currentTarget as HTMLElement;
    const button = this.renderRoot.querySelector<HTMLElement>("button.add-shape");
    if (!button) return;
    const box = button.getBoundingClientRect();
    const width = Math.min(370, window.innerWidth - 24);
    panel.style.left = `${Math.max(12, Math.min(box.left, window.innerWidth - width - 12))}px`;
    panel.style.top = `${box.bottom + 6}px`;
  };

  /** Close the panel before the shape lands, so the bar the author is watching
   * redraws with nothing floating over it. */
  private closeAddMenu() {
    this.renderRoot.querySelector<HTMLElement>("#add-shapes")?.hidePopover();
  }

  private renderHaveTabs(cfg: CustomComplicationConfig, layouts: ResolvedAll) {
    const have = cfg.supportedFamilies;
    // Biggest canvas first, the way the New dialog lists shapes and the way
    // they are worth drawing: the big one is the design, the small ones are
    // what is left of it. The bar reading Small, Medium, Large put the work in
    // the reverse of the order it happens in.
    return biggestFirst(this.ownerFamilies.filter((f) => have.includes(f))).map((f) => {
      // While the Control Center tab is up no shape is being edited, so no
      // shape tab is pressed either.
      const active = f === this.activeFamily && !this.inControlView;
      let art: TemplateResult | typeof nothing;
      if (f === "inline") art = this.renderInlinePreview(layouts.inline, true);
      else {
        const layout = layouts[f];
        art = layout ? renderLayout(layout, { icons: this.icons, imageSizes: this.imageSizes, slot: slotFor(this.referenceCase, f) }) : nothing;
      }
      const empty = f !== "inline" && shownCount(cfg, f) === 0 && cfg.elements.length > 0;
      const removable = this.canEdit && canRemoveFamily(cfg, f);
      // The remove button sits beside the tab, not inside it: a button inside
      // a button is not valid markup.
      return html`<span class="tab-wrap">
        <button class="tab ${f}" aria-pressed=${active ? "true" : "false"} title=${`Edit the ${familyTitle(f)} shape`}
          @click=${() => { this.activeFamily = f; this.controlView = false; if (f === "inline" && this.inspect.kind === "layer") this.inspect = { kind: "family" }; }}>
          <span class="art">${art}</span>
          <span class="lbl">${familyTitle(f)}</span>${empty ? html`<small>nothing shown</small>` : nothing}
        </button>
        ${this.canEdit ? html`<button class="icon danger tab-x" ?disabled=${!removable}
          title=${!removable
            ? "The only shape. Add another before removing it."
            : have.length === 1
              ? `Remove the ${familyTitle(f)} shape, leaving the Control Center control on its own`
              : `Remove the ${familyTitle(f)} shape`}
          aria-label=${`Remove the ${familyTitle(f)} shape`}
          @click=${(e: Event) => { e.stopPropagation(); this.removeShape(f); }}>${uiIcon("delete")}</button>` : nothing}
      </span>`;
    });
  }

  /**
   * The Control Center tab, last in the segmented control: a shape that draws
   * no layers.
   *
   * It is a tab rather than a card in the inspector alone because a control is
   * one of the things this document shows, in the same sense the shapes are,
   * and because the layer tools are noise while it is being written. It carries
   * the shape tabs' own x, because the control goes the way a shape goes.
   */
  private renderControlTab(cfg: CustomComplicationConfig) {
    const spec = cfg.control;
    if (spec === undefined || !deviceSupportsControls(this.selectedOwner?.app_version)) return nothing;
    const active = this.inControlView;
    const removable = this.canEdit && canRemoveControl(cfg);
    return html`<span class="tab-wrap">
      <button class="tab control" aria-pressed=${active ? "true" : "false"} title="Edit the Control Center control"
        @click=${() => this.openControlView()}>
        <span class="art">${controlTile(this.host(), spec, controlTileShapes(deviceKindOf(this.selectedOwner))[0]!, CONTROL_TAB_TILE_SIDE)}</span>
        <span class="lbl">Control Center</span>
      </button>
      ${this.canEdit ? html`<button class="icon danger tab-x" ?disabled=${!removable}
        title=${removable ? "Remove the Control Center control" : "The only one. Add a shape before removing it."}
        aria-label="Remove the Control Center control"
        @click=${(e: Event) => { e.stopPropagation(); this.removeControl(); }}>${uiIcon("delete")}</button>` : nothing}
    </span>`;
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
    // Only what the open view reads: the shape's own layers, or the control.
    // The compiled set is the whole document, and the Control Center tab used
    // to list every layer's entity under a tile that reads none of them.
    const view: DocumentView = this.inControlView ? { kind: "control" } : { kind: "family", family: this.activeFamily };
    const compiledIds = new Set(this.compiled?.entities.keys() ?? []);
    const reads = viewReads(cfg, view, (id) => compiledIds.has(id));
    const ids = reads.entityIds.filter((id) => compiledIds.has(id));
    const named = new Set(reads.namedIds);
    const shared = testableSharedValues(cfg).filter((n) => named.has(n.id));
    const testing = this.testValues.size > 0;
    return html`<div class="card tint-states" style=${`--c:${SECTION_COLOR.states}`}>
      <h2 class="panel-title"><span class="swatch">${uiIcon("states")}</span>Values on the ${this.deviceWord}
        <span class="mini">live · slide, pick or type one to try another</span><span class="spacer"></span>
        ${testing ? html`<span class="testing-pill">Testing with your values <button @click=${() => { this.editingValue = undefined; this.applyTestValues(new Map()); }}>Back to live</button></span>` : nothing}
      </h2>
      ${ids.length === 0 && shared.length === 0 ? html`<div class="hint">${this.inControlView
        ? "The control reads no entity yet. Point its target, title or value line at one and its live value shows here."
        : "No entities on this shape yet. Give one of its layers an entity and its live value shows here."}</div>` : html`<div class="chips values">
        ${ids.map((id) => {
          const s = this.hass.states[id];
          const name = typeof s?.attributes.friendly_name === "string" ? s.attributes.friendly_name : id;
          const unit = typeof s?.attributes.unit_of_measurement === "string" ? ` ${s.attributes.unit_of_measurement}` : "";
          const live = s ? `${s.state}${unit}` : "not in Home Assistant";
          const override = this.testValues.get(id);
          const user = cfg.elements.find((e) => layerEntityUses(cfg, e.payload.id).some((u) => u.ref.entityId === id));
          const kind = user?.kind ?? "text";
          return html`<div class="vchip vrow ctl ${override !== undefined ? "testing" : ""}" style=${`--k:${KIND_COLOR[kind]}`}
            title=${override !== undefined ? `Live value: ${live}` : ""}>
            <span class="kbar"></span><b>${name}</b><span class="spacer"></span>
            ${this.renderTestControl(id, name, s, override, unit, live)}
            ${override !== undefined
              ? html`<button type="button" class="small live-reset" title=${`Back to the live value: ${live}`} @click=${() => this.setTestValue(id, undefined)}>Live</button>`
              : nothing}
          </div>`;
        })}
        ${shared.map((n) => {
          // A shared value is tried the same way: its reading before its own
          // format, so a slide from 66 prints "90.00" on a two-decimal value.
          const key = sharedTestKey(n.id);
          const raw = this.sharedRaw(n.id) ?? "";
          const live = raw === "" ? "empty" : raw;
          const name = n.name || "(unnamed)";
          const override = this.testValues.get(key);
          const s = { entity_id: key, state: raw, attributes: {}, last_changed: "", last_updated: "" };
          return html`<div class="vchip vrow ctl ${override !== undefined ? "testing" : ""}" style=${`--k:${SECTION_COLOR.complication}`}
            title=${override !== undefined ? `Saved value: ${live}` : ""}>
            <span class="kbar"></span><b>${name}</b><span class="vtag" title="A shared value. Trying one here is not saved; change it in Shared values to keep it.">shared</span><span class="spacer"></span>
            ${this.renderTestControl(key, name, s, override, "", live)}
            ${override !== undefined
              ? html`<button type="button" class="small live-reset" title=${`Back to the saved value: ${live}`} @click=${() => this.setTestValue(key, undefined)}>Live</button>`
              : nothing}
          </div>`;
        })}
      </div>`}
    </div>`;
  }

  /**
   * The control for one test value. A number slides, so a gauge filling or a
   * colour changing at a threshold can be watched as it moves rather than
   * retyped value by value, and its reading still opens a box for an exact
   * one. A state with a known set of words is a picker. Anything else is typed.
   */
  private renderTestControl(id: string, name: string, s: Parameters<typeof testControlFor>[1], override: string | undefined, unit: string, live: string) {
    const shown = override ?? s?.state ?? "";
    const control = testControlFor(id, s, override);
    if (control.kind === "choice") {
      return html`<span class="test-ctl"><select aria-label=${`Test value for ${name}`} @change=${(e: Event) => this.setTestValue(id, (e.target as HTMLSelectElement).value)}>
        ${control.options.map((o) => html`<option value=${o} ?selected=${o === shown}>${o}</option>`)}
      </select></span>`;
    }
    const reading = this.editingValue === id
      ? html`<input type="text" .value=${shown} aria-label=${`Test value for ${name}`}
          @keydown=${(e: KeyboardEvent) => { if (e.key === "Enter") (e.target as HTMLInputElement).blur(); if (e.key === "Escape") { this.editingValue = undefined; } }}
          @blur=${(e: FocusEvent) => this.commitTestValue(id, (e.target as HTMLInputElement).value)} />`
      : html`<button type="button" class="val" title="Click to type a value"
          @click=${() => { this.editingValue = id; void this.updateComplete.then(() => this.renderRoot.querySelector<HTMLInputElement>(".vchip input[type=text]")?.focus()); }}>${override !== undefined ? `${override}${unit}` : live}</button>`;
    if (control.kind === "text") return html`<span class="test-ctl">${reading}</span>`;
    const n = Number(shown);
    const at = shown.trim() !== "" && Number.isFinite(n) ? n : control.min;
    return html`<span class="test-ctl">
      <input type="range" min=${control.min} max=${control.max} step=${control.step} .value=${String(at)}
        aria-label=${`Slide the test value for ${name}`}
        @input=${(e: Event) => this.setTestValue(id, (e.target as HTMLInputElement).value, `test-${id}`)}
        @change=${() => this.draft?.endGesture()} />
      ${reading}
    </span>`;
  }

  private commitTestValue(id: string, raw: string) {
    this.editingValue = undefined;
    this.setTestValue(id, raw);
  }

  /** Try a value for one entity, or go back to its live state with undefined,
   * an empty value or the live value itself. `coalesce` makes one slide one
   * undo step; the slider's change event closes it on release. */
  private setTestValue(id: string, raw: string | undefined, coalesce?: string) {
    const v = raw?.trim() ?? "";
    const next = new Map(this.testValues);
    const live = id.startsWith(SHARED_TEST_PREFIX)
      ? this.sharedRaw(id.slice(SHARED_TEST_PREFIX.length))
      : this.hass.states[id]?.state;
    if (v === "" || v === live) next.delete(id);
    else next.set(id, v);
    this.applyTestValues(next, coalesce);
  }

  /** A shared value's real reading before its own format, with no test in
   * play: what its row shows as live, and what a test is compared with. */
  private sharedRaw(id: string): string | undefined {
    const cfg = this.draft?.config;
    if (!cfg) return undefined;
    const ctx = this.buildContext(false);
    const bare = ctx.namedValues.map((n) => ({ ...n, value: { kind: n.value.kind } }));
    return new Resolver({ ...ctx, namedValues: bare }, cfg).resolve({ kind: { kind: "named", id } });
  }

  /** Every change to the test values goes through the draft, so undo and
   * redo put them back. A change that changes nothing takes no undo step. */
  private applyTestValues(next: ReadonlyMap<string, string>, coalesce?: string) {
    const d = this.draft;
    if (!d) return;
    const same = next.size === d.testValues.size && [...next].every(([k, v]) => d.testValues.get(k) === v);
    if (same) return;
    d.setTestValues(next, coalesce);
    this.version++;
  }

  /** The devices "Preview as" offers: the watch cases for a watch owner, the
   * iPhone cases for a phone. A phone draws its lock screen shapes in slots of
   * its own and the Home Screen tiles at their measured sizes, so previewing a
   * phone document in a watch case would be the wrong picture twice over. */
  private get previewCases(): PreviewCase[] {
    return deviceKindOf(this.selectedOwner) === "iphone" ? PHONE_CASES : CASES;
  }

  /** The measured device of the owner's kind: the 46 mm watch, or the iPhone
   * 15 Pro. Every small picture in the panel is drawn in it, so a row in the
   * list and the big preview agree about proportions. */
  private get referenceCase(): PreviewCase {
    return deviceKindOf(this.selectedOwner) === "iphone" ? REFERENCE_PHONE : REFERENCE_CASE;
  }

  private currentCase(): PreviewCase {
    return this.previewCases.find((c) => c.label === this.previewCase) ?? this.referenceCase;
  }

  private previewSlot(family: DrawableFamily) {
    return slotFor(this.currentCase(), family);
  }

  // ── inspector ─────────────────────────────────────────────────────────

  private crumbs(cfg: CustomComplicationConfig, picked?: number) {
    const ins = this.inspect;
    const name = cfg.name.trim() || "Complication";
    const shape = familyTitle(this.activeFamily);
    const shapeCrumb = ins.kind === "family" && picked === undefined
      ? html`<span class="here" style=${`--k:${SECTION_COLOR.place}`}>${shape} shape</span>`
      : html`<button @click=${() => { this.inspect = { kind: "family" }; }} title="Edit the shape">${shape}</button>`;
    let here: TemplateResult | typeof nothing = nothing;
    let parent: TemplateResult | typeof nothing = nothing;
    // A pick of several layers is what the inspector is about, whatever the
    // one selected layer under it happens to be.
    if (picked !== undefined) {
      here = html`<span class="here" style="--k:var(--wa-accent)"><span class="kchip">Picked</span><span class="nm">${picked} layers</span></span>`;
    } else if (ins.kind === "layer") {
      const el = elementIn(cfg, ins.id);
      if (el) {
        // Only the kind: the name is the Name row directly under the crumbs,
        // so spelling it here too said it twice. It stays in the tooltip.
        here = html`<span class="here" style=${`--k:${KIND_COLOR[el.kind]}`} title=${layerTitle(el, describeContext(this.host()))}><span class="kchip">${KIND_LABEL[el.kind]}</span></span>`;
        const g = groupOf(cfg, el.payload.id);
        if (g) parent = html`<span class="sep">›</span><button @click=${() => { this.inspect = { kind: "group", id: g.id }; }} title="Edit the group">${g.name}</button>`;
      }
    } else if (ins.kind === "group") {
      const g = cfg.groups?.find((x) => x.id === ins.id);
      // The group's card opens with its Name field, so the crumb is the kind alone.
      if (g) here = html`<span class="here" style=${`--k:${SECTION_COLOR.group}`} title=${g.name}><span class="kchip">Group</span></span>`;
    }
    // The root deselects, and with nothing selected the inspector is the
    // complication itself.
    return html`<div class="crumbs">
      <button title="Edit the complication" @click=${() => { this.multi = new Set(); this.inspect = { kind: "general" }; }}>${name}</button><span class="sep">›</span>${shapeCrumb}${parent}
      ${here === nothing ? nothing : html`<span class="sep">›</span>${here}`}
    </div>`;
  }

  /** The picked layers that still exist, in the document's draw order. */
  private pickedElements(cfg: CustomComplicationConfig): CElement[] {
    if (this.multi.size < 2) return [];
    return cfg.elements.filter((e) => this.multi.has(e.payload.id));
  }

  /**
   * The inspector's header with no layer selected: the complication's name and
   * the things done to the whole complication. Raw JSON only reads, so it
   * stays usable when the document cannot be edited. Share is in the top bar,
   * where it can be found whatever is selected.
   */
  private complicationHead(cfg: CustomComplicationConfig) {
    const name = cfg.name.trim() || "Complication";
    return html`<div class="insp-head comp-head">
      <div class="crumbs"><span class="here" style=${`--k:${SECTION_COLOR.complication}`}>${name}</span></div>
      <span class="comp-acts">
        <button class="ghost" @click=${() => this.openRaw()}>Raw JSON</button>
        ${this.canEdit ? html`
          ${this.draft?.baseRevision === null ? nothing : html`
            <button class="ghost" aria-haspopup="dialog" aria-expanded=${this.historyOpen ? "true" : "false"}
              title="Earlier saves of this complication" @click=${() => void this.openHistoryDialog()}>History</button>`}
          <button class="ghost" @click=${() => this.duplicate()}>Duplicate</button>
          ${this.confirmDelete
            ? html`<button class="ghost danger" @click=${() => void this.deleteCurrent()}>Really delete</button><button class="ghost" @click=${() => { this.confirmDelete = false; }}>Cancel</button>`
            : html`<button class="ghost danger" @click=${() => { this.confirmDelete = true; }}>Delete</button>`}` : nothing}
      </span>
    </div>`;
  }

  /**
   * The inspector: the thing that was clicked, as a column of cards. With
   * nothing selected that thing is the complication: its settings, and the
   * actions on the whole of it in the header.
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
    const editable = this.canEdit ? "" : "pointer-events:none;opacity:.6";
    // On the Control Center tab the control is the subject, so its card stays
    // open, and the line about clicking a layer goes: there are no layers in
    // this view to click. The name still comes first, above it, because a
    // document is named before it is anything else. That tab is the only view a
    // document with no shape has, so it answers here whatever `inspect` says.
    //
    // The card is on that tab and nowhere else. A shape view is about the
    // shape, and a card for something that draws in Control Center was one
    // more thing to read past on every document that will never have one.
    const control = this.inControlView;
    if (ins.kind === "general" || control) {
      // Refresh, the tap action and the flash belong to the shapes, so on the
      // control's tab the card is the name alone.
      const complication = card(host, "complication", "Complication", generalEditor(host, { nameOnly: control }),
        { color: SECTION_COLOR.complication, icon: "watch", alwaysOpen: true });
      return html`
        ${this.complicationHead(cfg)}
        <div class="insp-body" style=${editable} @change=${() => this.draft?.endGesture()}>
          ${control
            ? html`${complication}${controlCard(host, { alwaysOpen: true })}`
            : html`${complication}
              <p class="insp-note">Click a layer ${deviceKindOf(this.selectedOwner) === "iphone" ? "on the preview" : "on the watch"} or in the list to edit it. The shape's own background and border are the bottom row of the list.</p>`}
        </div>`;
    }
    let body: TemplateResult | typeof nothing = nothing;
    let cards = true;
    if (ins.kind === "layer") {
      // `elementIn` rather than a search of `elements`: a row layer of a list
      // is edited by these same cards and lives inside its list's template.
      const el = elementIn(cfg, ins.id);
      if (!el) {
        this.inspect = { kind: "general" };
        return nothing;
      }
      body = layerEditor(host, el, this.canvasFamily, { placement: true, tap: true });
    } else if (ins.kind === "group") {
      const g = cfg.groups?.find((x) => x.id === ins.id);
      if (!g) {
        this.inspect = { kind: "general" };
        return nothing;
      }
      cards = false;
      body = groupEditor(host, g);
    } else {
      body = familyEditor(host, this.activeFamily);
    }
    const all = this.openSections.size > 1;
    return html`
      <div class="insp-head">
        ${this.crumbs(cfg)}
        ${cards ? html`<button class="expand" @click=${() => { this.openSections = all ? new Set([defaultSection(ins)]) : new Set(ALL_SECTIONS); }}>${all ? "One at a time" : "Open all"}</button>` : nothing}
      </div>
      <div class="insp-body" style=${editable} @change=${() => this.draft?.endGesture()}>${body}</div>`;
  }

  /**
   * A tick that three states fit into: on, off, and "these layers disagree".
   * A click on a mixed one settles the argument rather than flipping each
   * layer, which is the only reading that is the same before and after.
   */
  private triCheck(label: string, state: PickedFlag, set: (v: boolean) => void) {
    return html`<label class="field check">
      <span>${label}${state === "mixed" ? html` <span class="mixed">(mixed)</span>` : nothing}</span>
      <input type="checkbox" .checked=${state === "all"} .indeterminate=${state === "mixed"}
        @change=${(e: Event) => set((e.target as HTMLInputElement).checked)} /></label>`;
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
    const host = this.host();
    const ctx = describeContext(host);
    const resolver = new Resolver(this.buildContext(), this.draft?.config);
    const common = pickedCommon(cfg, family, picked);
    const n = picked.length;
    // Top of the list draws last, same as the Layers card, so the two agree.
    const rows = [...picked].reverse();
    const setHiddenHere = (v: boolean) => this.mutate((c) => {
      for (const el of picked) setPlacement(c, family, el.payload.id, { isHidden: v });
    });
    const setColour = (v: string) => this.mutate((c) => {
      for (const el of picked) {
        const t = c.elements.find((e) => e.payload.id === el.payload.id);
        if (t && t.kind !== "image" && t.kind !== "tap" && t.kind !== "timeline" && t.kind !== "chartTimes" && t.kind !== "chartDots" && t.kind !== "chartGrid" && t.kind !== "imageTime" && t.kind !== "list") t.payload.colorSlot.baseColorHex = v;
      }
    }, "multi-colour");
    return html`
      ${card(host, "picked", `${n} layers picked`, html`
          <div class="field list-field"><span>Layers</span>
            <div class="picked">
              ${rows.map((el) => html`<div class="row" style=${`--k:${KIND_COLOR[el.kind]}`}>
                <span class="bar"></span>
                <span class="name">
                  ${el.kind === "icon" ? html`<span class="glyph">${this.icons.render(resolver.resolve(el.payload.symbol) ?? "questionmark", 16, el.payload.colorSlot.baseColorHex) ?? nothing}</span>` : nothing}
                  <b>${layerTitle(el, ctx)}</b><span class="kind">${KIND_LABEL[el.kind]}</span>
                </span>
              </div>`)}
            </div>
            <div class="row-acts">
              <button class="small primary" title=${`Group (${KEY_MOD}G)`} @click=${() => this.groupPicked()}>Group them</button>
              <button class="small" @click=${() => { this.multi = new Set(); }}>Clear</button>
            </div>
          </div>
          <div class="hint">${MULTI_KEY}-click a layer to add it or take it out. Click one on its own to edit it alone.</div>`,
        { color: "var(--wa-accent)", icon: "layers", summary: `Edits here land on all ${n}`, alwaysOpen: true })}
      ${card(host, "picked-common", `All ${n} at once`, html`
          ${this.triCheck("Hidden", common.hiddenHere, setHiddenHere)}
          ${common.colourable
            ? html`${colorField("Colour", common.colour, (v) => { if (v !== undefined) setColour(v); })}
              ${common.colour === undefined ? html`<div class="hint keep">These layers are different colours. Pick one to give them all the same.</div>` : nothing}`
            : html`<div class="hint keep">No shared colour: a picture and a tap area have none.</div>`}
          <div class="hint">These layers are on the ${familyTitle(family)} shape and on no other, so nothing here reaches another shape.</div>
          <div class="hint">Size, content and states belong to one layer at a time. Click a layer on its own to reach them.</div>`,
        { color: SECTION_COLOR.place, icon: "place", summary: "The settings every picked layer has", alwaysOpen: true })}`;
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
        <p class="hint">Save writes to Home Assistant. Open Wrist Assistant on the ${this.deviceWord} to pull it down.</p>
        <button class="link" @click=${() => (this.showRaw = !this.showRaw)}>${this.showRaw ? "Hide the raw configuration" : "Show the raw configuration"}</button>
        ${this.showRaw ? html`<pre>${JSON.stringify(d.encoded(), null, 2)}</pre>` : nothing}
      </div>
    </details>`;
  }
}

function errText(err: unknown): string {
  return String((err as { message?: string })?.message ?? err);
}

/** How long ago a history entry was saved, from its ISO stamp. A stamp that
 * will not parse reads as "saved", since a date nobody can read is worse than
 * no date at all. */
function savedAgoWords(savedAt: string): string {
  const at = Date.parse(savedAt);
  if (Number.isNaN(at)) return "Saved";
  return `Saved ${agoWords(Math.max(0, (Date.now() - at) / 1000))}`;
}

/** Who saved a revision. The store writes `ha-panel:Name`; the prefix is
 * plumbing, so only the name is shown, and an entry with no name at all says
 * nothing rather than "by". */
function savedByWords(updatedBy: string): string {
  const who = updatedBy.startsWith("ha-panel:") ? updatedBy.slice("ha-panel:".length) : updatedBy;
  return who.trim() === "" ? "" : `by ${who.trim()}`;
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

/**
 * One owner's name in the device list.
 *
 * A watch takes the paired phone's name as its disambiguator, because both
 * real watches report themselves as "Apple Watch". A phone owner takes a kind
 * badge instead, so a list holding both says which is which; a phone whose
 * name already reads as an iPhone ("Jesse's iPhone") is left alone rather than
 * told twice.
 */
export function ownerLabel(o: OwnerSummary): string {
  const name = o.device_name ?? o.owner_watch_id;
  if (deviceKindOf(o) === "iphone") return /iphone/i.test(name) ? name : `${name} (iPhone)`;
  return o.paired_iphone_name ? `${name} (${o.paired_iphone_name})` : name;
}

/** Owners in the order the picker lists them: watches first, then phones,
 * each group left in the order the server gave. The server sorts them this
 * way too; doing it here as well means a mixed reply still reads as two
 * groups rather than an interleaved list. */
export function ownersByKind(owners: readonly OwnerSummary[]): OwnerSummary[] {
  return ownerGroups(owners).flatMap((g) => g.owners);
}

/**
 * One device as the picker's list draws it: the name on its own line, and what
 * tells it apart from the device under it on a second, quieter one.
 *
 * `ownerLabel` says the same things on one line, for the places that have only
 * one line to say them on, and it stays the wording of the header's button. A
 * watch's second line is the phone it is paired with, which is the only thing
 * separating two watches both called "Apple Watch"; a phone's is the word
 * iPhone, unless its own name already reads as one.
 */
export function ownerLines(o: OwnerSummary): { name: string; note?: string } {
  const name = o.device_name ?? o.owner_watch_id;
  // A watch id no device answers for any more outranks both: it says why the
  // complications under it cannot be sent anywhere.
  if (o.is_orphan) return { name, note: "no longer registered" };
  if (deviceKindOf(o) === "iphone") return { name, note: /iphone/i.test(name) ? undefined : "iPhone" };
  return { name, note: o.paired_iphone_name ? `paired with ${o.paired_iphone_name}` : undefined };
}

/**
 * The picker's device list, cut into the groups it draws headings for. The
 * order is `ownersByKind`'s: watches first, then phones, each group left as the
 * server gave it. A home with only one kind of device gets one group, and the
 * picker then draws no heading at all rather than a heading over everything.
 */
export function ownerGroups(owners: readonly OwnerSummary[]): { label: string; owners: OwnerSummary[] }[] {
  const watches = owners.filter((o) => deviceKindOf(o) !== "iphone");
  const phones = owners.filter((o) => deviceKindOf(o) === "iphone");
  const groups: { label: string; owners: OwnerSummary[] }[] = [];
  if (watches.length > 0) groups.push({ label: watches.length === 1 ? "Watch" : "Watches", owners: watches });
  if (phones.length > 0) groups.push({ label: phones.length === 1 ? "iPhone" : "iPhones", owners: phones });
  return groups;
}

/**
 * The third line of an expanded Layers row: what the layer is made of, rather
 * than what it happens to read right now. The compact row already carries the
 * live reading, so these are the settings behind it.
 *
 * The place and the size used to be here too. They are not: the numbers change
 * every time the layer is nudged, they are already on the Position card and on the
 * face itself, and reading them off a list is not how anyone positions a layer.
 * Two long facts per row also made the line wrap, which is what made the row
 * change height. Rotation stays, because it is rare and easy to miss.
 */
export function layerFacts(
  host: EditorHost,
  _family: DrawableFamily,
  el: CElement,
  eff: EffectivePlacement,
): { label: string; value: string }[] {
  const facts: { label: string; value: string }[] = [
    { label: "Shows", value: contentSummary(host, el) },
  ];
  const look = lookSummary(el);
  if (look) facts.push({ label: "Looks", value: look });
  if (eff.frame.rotationDegrees !== 0) facts.push({ label: "Turned", value: `${Math.round(eff.frame.rotationDegrees)}°` });
  return facts;
}

/** A history span in as few characters as the Layers list can spare. Under two
 * hours stays in minutes, because that is how the short spans are chosen and
 * "1 h" would read as a different span from the one in the picker. */
function historySpanWords(minutes: number): string {
  if (minutes < 120) return `${minutes} min`;
  if (minutes % 1440 === 0) return `${minutes / 1440} d`;
  if (minutes % 60 === 0) return `${minutes / 60} h`;
  return `${minutes} min`;
}

/** The second line of a Layers row: the live reading and the one look fact
 * that tells this layer from its neighbours. */
function layerMeta(el: CElement, resolver: Resolver, historySeries: Map<string, string>, size?: number): unknown {
  // What the layer reads right now takes the live-value colour here too, so a
  // row in the list and the card on the right agree about which half of the
  // line is the house talking.
  const now = (v: string | undefined) => html`<span class="val-tok">${v ?? "--"}</span>`;
  switch (el.kind) {
    case "text": return html`${now(resolver.resolve(el.payload.value))} · ${size ?? el.payload.fontSize} pt`;
    case "icon": return `${size ?? el.payload.size} pt · ${colorWords(el.payload.colorSlot.baseColorHex)}`;
    case "gauge": return html`${now(resolver.resolve(el.payload.value))} · ${el.payload.style}`;
    case "chart": {
      // A recorder chart's own value is one number; counting that would report
      // "1 value" on the exact layer the history feature exists to fix.
      const seriesKey = chartHistoryKey(el.payload) ?? chartStatisticsKey(el.payload);
      const raw = seriesKey !== undefined
        ? (historySeries.get(seriesKey) ?? "")
        : (resolver.resolve(el.payload.value) ?? "");
      return `${el.payload.style} · ${chartNumbers(raw).length} values`;
    }
    case "timeline": {
      // Changes rather than runs: the strip merges neighbours of one colour, and
      // "12 changes" is what the recorder actually holds for this entity.
      const key = timelineHistoryKey(el.payload);
      const samples = key === undefined ? [] : timelineSamples(historySeries.get(key) ?? "");
      const changes = Math.max(0, samples.length - 1);
      return `${historySpanWords(timelineHistoryMinutes(el.payload))} · ${changes} ${changes === 1 ? "change" : "changes"}`;
    }
    case "shape": return `${colorWords(el.payload.colorSlot.baseColorHex)}${el.payload.borderColorHex ? " · border" : ""}`;
    case "image": return el.payload.contentMode === "fill" ? "fill" : "fit";
    case "tap": return describeTapAction(el.payload.action);
    case "chartTimes": return `${el.payload.timeLabelCount} times · ${el.payload.labelSize} pt`;
    case "chartDots": return `${el.payload.dots === "all" ? "every reading" : "auto"}${el.payload.size === undefined ? "" : ` · ${el.payload.size} pt`}`;
    case "chartGrid": return `${el.payload.lines} ${el.payload.lines === 1 ? "line" : "lines"} · ${el.payload.thickness} pt`;
    case "imageTime": return undefined;
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
