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
  type HassEntityState,
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
  type TapAction,
  type Value,
  CUSTOM_FLASH_DEFAULT,
  CUSTOM_SVG_SYMBOL,
  MAX_SLOTS,
  literal,
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
  inlineRuns,
  newControlConfig,
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
  elementsOnPage,
  layerDrawsOnPage,
  nextPageAfter,
  pageNumbers,
  pagesSpecOf,
  tourDuration,
  usesPages,
  settleArrivedPages,
  addPage,
  removePage,
  startPages,
  addPageTurnTap,
  pageMoverExists,
  PAGES_MAX_COUNT,
} from "./model.js";
import { TourPlayer } from "./tour-player.js";
import { keyed } from "lit/directives/keyed.js";
import { SHARED_TEST_PREFIX, sharedTestKey, testControlFor, testableSharedValues, testedNamedValues } from "./test-controls.js";
import { type SendState, agoWords, describeSend, sendState, sendWaitMs } from "./send-state.js";
import { compile, parseValueDocument, type Compiled } from "./compiler.js";
import {
  type EntityState,
  type ForcedBranches,
  type ResolveContext,
  type ResolvedAll,
  type ResolvedInline,
  type ResolvedLayout,
  Resolver,
  chartNumbers,
  timelineSamples,
  countdownRemainingString,
  resolveAll,
  resolveInline,
  resolveControl,
} from "./resolver.js";
import { CANVAS, CASES, FACE_TINTS, PHONE_CASES, REFERENCE_CASE, REFERENCE_PHONE, caseForScreenSize, cornerContext, cornerTileSide, familyTitle, fitBox, handleResize, iconDrawnSide, phoneCaseForScreenSize, renderLayerThumb, renderLayout, slotFor, timestampChipRect, timestampLabel, type DrawableFamily, type IconProvider, type PreviewCase } from "./renderer.js";
import { actionAt, demoTapLabel, runTapAction, tapRefetches, type DemoOutcome } from "./demo.js";
import { ALL_FAMILIES, biggestFirst, blankInline, canRemoveControl, comingSoonFamilies, controlNoteLines, familiesFor, familyAllowsKind, familyNote, firstDrawable, importableFamilies, isDrawable, isHomeFamily, keepFamilies, opensInControlView, supportedFamilies } from "./layouts.js";
import {
  type DeviceOwner,
  type DevicePlace,
  type PlaceCopy,
  type SlotHolder,
  copyForOwner,
  designKind,
  devicePlaces,
  duplicateAs,
  freeSlotForFamily,
  linkedCopy,
  linkedDocumentFor,
  joinNames,
  newTargets,
  seatHoldersFor,
  slotForDuplicate,
  unreadableRefusal,
} from "./copies.js";
import {
  type SeatDevice,
  type SeatRecord,
  findSeatClashes,
  planSeatRepair,
  seatClashMessage,
  seatRepairSummary,
} from "./seatRepair.js";
import {
  type NewKind,
  type ShapeGroup,
  kindChoices,
  kindNote,
  kindOwners,
  kindTitle,
  newReady,
  newRecords,
  newSummary,
  shapeGroups,
  shapeOffered,
} from "./newComplication.js";
import { type Person, deviceShortName, peopleOf } from "./people.js";
import { type LiveDesign, type LiveShape, type LiveShapes, controlDeviceArt, deviceCropArt, deviceShapeArt, shapeOnlyArt, shapeWell } from "./shapeArt.js";
import { KIND_COLOR, KIND_LABEL, KIND_ORDER, SECTION_COLOR } from "./kinds.js";
import { type DeviceKind, type DeviceOwnerLike, LIBRARY_OWNER_ID, deviceKindOf, deviceNoun, deviceSupportsShapes, isLibraryOwner, ownerSupportsControls, updateDeviceMessage } from "./version.js";
import { type SplitNotice, autoSplitShapes, editBlockedBySplitGate, ownerCanSplit } from "./splitShapes.js";
import { makeIconProvider } from "./icons.js";
import { makeImageSizeProvider } from "./image-sizes.js";
import { SymbolBrowser } from "./symbols.js";
import { Draft, saveRefusal } from "./draft.js";
import { ScrollFades } from "./scroll-fade.js";
import { statesSummary } from "./states.js";
import { type UiIconName, uiIcon } from "./ui-icons.js";
import { isHiddenDocument, withHidden } from "./model.js";
import {
  type PickerCopy,
  type PickerDevice,
  type PickerListRow,
  type PickerPerson,
  type PickerBand,
  type PickerSection,
  type PickerTab,
  ALL_DEVICES,
  UNASSIGNED_LABEL,
  isShelvedRow,
  personColorVar,
  personIndex,
  pickerBands,
  pickerListRows,
  rowKeyFor,
  pickerSections,
  pickerShapeGroups,
  pickerTabs,
  pickerView,
  rowWhoText,
  rowsOnDevice,
  sortPickerRows,
} from "./pickerRows.js";

/** Where an older panel kept hidden picker rows, per watch, in this browser.
 * The flag lives on the document now; the old keys are cleared once on load. */
const LEGACY_PICKER_HIDDEN_PREFIX = "wrist-assistant-panel.picker-hidden.v1:";
import { GRID_STEPS, NUDGE_COARSE, beginGesture, beginPointDrag, beginScaleDrag, gridFor, gridNudgeFrame, guideCandidates, guideThreshold, nudgeFrame, nudgePoint, type Grid, type GuideLine, type Guides, type HandleCorner } from "./interact.js";
import {
  type CopiedPosition,
  type EditorHost,
  type EffectivePlacement,
  type PickedFlag,
  ALL_SECTIONS,
  collapsedSections,
  defaultOpenSections,
  moreThanDefaultOpen,
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
  type DescribeContext,
  pickedCommon,
  rowKindIcon,
  rowStageConfig,
  setPlacement,
  syncListAttributes,
  shownCount,
} from "./editors.js";
import { previewTintFor, previewWarnings, renderShapeArt } from "./shapePreviews.js";
import { sampleListItem, withListSeeds } from "./list-seeds.js";
import { type PresetEnv, type PresetKind, type PresetSpec, LAYER_PRESETS, applyPreset, presetSpec } from "./presets.js";
import { type AddVariant, addPreview } from "./add-previews.js";
import { presetColor, presetPreview } from "./preset-previews.js";
import {
  type BackupParse,
  type BackupSource,
  type ImportParse,
  type ShareSlot,
  type UnresolvedEntity,
  SHARE_LINK_DAMAGED,
  backupFileName,
  backupText,
  decodeShareLink,
  encodeShareLink,
  exportFileName,
  exportText,
  hasInstanceFilters,
  importProblem,
  isPlaceholderId,
  parseBackupText,
  parseImportText,
  planRestore,
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
  galleryDevice,
  galleryErrorMessage,
  galleryFamily,
  galleryPublicFields,
  galleryStatusLabel,
  galleryUploadRows,
  galleryUploadSubline,
  isPendingUpdate,
  listMyUploads,
  submitToGallery,
} from "./gallery.js";
import { renderGalleryPreviews } from "./preview-png.js";
import { PictureCache } from "./picture-cache.js";
import {
  type SavedPart,
  insertPart,
  partFromSelection,
  partText,
  partTextFits,
  suggestPartName,
} from "./parts.js";
import { domainIcon } from "./domain-icons.js";
import {
  FIRST_RUN_TILES, ZOOM_FIT, ZOOM_MAX, ZOOM_MIN, anySnap, pickGridStep, runFirstRunTile, slotWord, snapSwitchOn,
  stageReserve, toggleSnap, zoomIn, zoomLabel, zoomOut, type FirstRunTile, type SnapFlags, type SnapSwitch,
} from "./canvas-tools.js";

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

type Conflict = { current: ComplicationRecord | null; message: string };

/** What one row of the header picker is about: an editable record, or a slot
 * something else holds (an iPhone preset, or a custom on another home). The
 * device it is on, its seat there and its name live on the copy carrying it. */
type PickerItem =
  | { kind: "record"; record: ComplicationRecord }
  | { kind: "locked"; badge: string; title: string; families: readonly string[] };

/** One row of the header picker: one complication, on however many devices. */
type PickerRow = PickerListRow<PickerItem>;

/** The shapes one row draws, read off whichever copy the row opens. */
function familiesOfItem(item: PickerItem): readonly string[] {
  return item.kind === "record" ? familiesOf(item.record) : item.families;
}

/** The shapes a stored document lists, read without parsing the whole thing. */
function familiesOf(record: ComplicationRecord): string[] {
  const raw = record.document?.supportedFamilies;
  return Array.isArray(raw) ? raw.filter((f): f is string => typeof f === "string") : [];
}

/** The same list, narrowed to the shapes this panel knows, for the rules that
 * work per shape rather than per word. */
function shapesOf(record: ComplicationRecord): FamilyKind[] {
  const named = familiesOf(record);
  return ALL_FAMILIES.filter((f) => named.includes(f));
}

/** Whether a stored document carries a Control Center control, read the same
 * way: a row with no shapes says "Control" only when there is one. */
function hasControlOf(record: ComplicationRecord): boolean {
  const raw = record.document?.control;
  return raw !== null && typeof raw === "object";
}

/**
 * What one card says it is, at the end of its name line: the shape, and
 * nothing else.
 *
 * Where it sits used to be in these words too, and is now the section or tab
 * the card is under. A design with no shape at all is a Control Center
 * control and says so.
 */
function cardShapeTitle(family: FamilyKind | undefined, control: boolean): string {
  if (family !== undefined) return familyTitle(family);
  return control ? "Control Center" : "No shape yet";
}

/**
 * The order the shape boxes come in inside one device's block, which is not
 * the same question on a watch as on a phone.
 *
 * A watch is its face: the rectangular corner of it, the circular one, the
 * corner, the inline strip along the top. A phone is its Home Screen first,
 * biggest tile down to smallest, and only then the small shapes it lends to
 * the Lock Screen. Listing a phone's boxes in the watch's order put two Lock
 * Screen slivers above the Home Screen tiles that are most of what a phone
 * holds.
 *
 * The control is not a shape and comes after every one of them on both; a
 * document with neither is last, being a thing half made rather than a kind
 * of complication.
 *
 * Unassigned is no device and holds every shape there is, so it takes the
 * watch's order with the Home Screen tiles after it.
 */
const WATCH_SHAPE_ORDER: readonly string[] = ["rectangular", "circular", "corner", "inline"];
const PHONE_SHAPE_ORDER: readonly string[] = ["small", "medium", "large", "xlarge", "rectangular", "circular", "inline"];
const SHELF_SHAPE_ORDER: readonly string[] = [...WATCH_SHAPE_ORDER, "small", "medium", "large", "xlarge"];

function shapeGroupOrder(kind: DeviceKind): readonly string[] {
  const shapes = kind === "iphone" ? PHONE_SHAPE_ORDER : kind === "library" ? SHELF_SHAPE_ORDER : WATCH_SHAPE_ORDER;
  return [...shapes, "control", "none"];
}

/**
 * The custom property holding one shape's hue, ready to be set on its box.
 *
 * Undefined for a shape with no hue, which is the box of documents that have
 * no shape at all: the CSS reads `var(--pk-shape, ...)`, so a box with
 * nothing set falls back to the plain ground and the muted label without a
 * rule of its own. The control has one; it is not a shape, but it is a box
 * like any other and a box is what the colour is for.
 */
function shapeColorVar(key: string): string | undefined {
  return key === "none" ? undefined : `--pk-shape: var(--wa-shape-${key})`;
}

function shapeGroupRank(order: readonly string[], key: string): number {
  const i = order.indexOf(key);
  return i < 0 ? order.length : i;
}

/** The glyph a picker tab or section heading wears: the device itself, the
 * shelf for the library, and the grid for the All tab, which is no device. */
function tabIcon(kind: DeviceKind | "all"): UiIconName {
  return kind === "all" ? "grid" : kind === "iphone" ? "phone" : kind === "library" ? "layers" : "watch";
}

/** What Unassigned is for, said where it is rather than in a tooltip: nobody
 * leaves a design there without being told what it means. */
const LIBRARY_NOTE = "Not on any device yet. Duplicate one to a device to use it.";

/** A phrase at the head of a sentence. "this watch" and "Unassigned" both go
 * in the same slot, and only one of them starts with a capital already. */
function capFirst(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** What an empty device says, in its own words. A watch with nothing on it and
 * a shelf with nothing on it are different news. */
function nothingOnText(kind: DeviceKind | "all"): string {
  if (kind === "library") return "Nothing is unassigned.";
  if (kind === "iphone") return "Nothing on this iPhone yet.";
  if (kind === "watch") return "Nothing on this watch yet.";
  return "No complications yet.";
}

/**
 * The shapes are drawn by `shapeArt.ts` now.
 *
 * The four drawings that used to live here (a shape on a phone, a shape on a
 * watch, a whole device with one place lit, a device's Control Center) belonged
 * to the New dialog's place cards, which asked where a complication lives one
 * device at a time. The dialog asks for the design once and for the devices
 * separately, so the drawing a button carries is a tiny device outline per
 * device kind rather than one big picture of a screen.
 */

/** The tick a picked shape card carries, top right. A border alone is easy to
 * miss in a grid of eight, and the count in the footer has to add up to
 * something the eye can find. */
function pickTick(): TemplateResult {
  return html`<span class="pick-tick" aria-hidden="true"><svg viewBox="0 0 16 16"><path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" /></svg></span>`;
}

/** The mock tile in the Control Center shape tab, CSS px. Sized to the shape
 * pictures beside it, which stand in a box 80px tall, so the control reads as
 * one more thing this design draws rather than a glyph among faces. */
const CONTROL_TAB_TILE_SIDE = 52;

/** The side of the Control Center tile a picker card draws, CSS px. A card
 * whose design is only a control has the tile as its whole picture, so it is
 * drawn at the size of the crop beside it rather than as a glyph. */
const CARD_ART_TILE_SIDE = 44;

/** The side the inline line's symbol is rendered at for a picker card, CSS
 * px. The watch drawing scales it into the band over the clock, so this is
 * only the size the icon's own svg is asked for. */
const CARD_INLINE_SYMBOL = 11;

const COL_LEFT_DEFAULT = 300;
const COL_RIGHT_DEFAULT = 360;
/** Layer-row thumbnail box, CSS px. Wide, because most layers are wider than tall. */
const THUMB_W = 44;
const THUMB_H = 22;
/** The three sizes the row pictures come in, picked in the Layers bar. Small
 * is the size the list has always used; the other two are for reading a busy
 * layer without opening the big preview. */
const THUMB_STEPS = [1, 1.7, 2.6] as const;
/** How long the page trash stays armed after the first press, in ms. Long
 * enough to read the word and press again, short enough that the button is
 * back to its harmless self before the author looks away. */
const PAGE_TRASH_ARM_MS = 4000;

/** How long the demo's success flash stays up, in ms. The watch's own flash is
 * a brief wash of color over the whole complication, so this is short enough
 * to read as an acknowledgement rather than as a state the face went into. */
const DEMO_FLASH_MS = 700;

/** How long the demo lets live state through after a tap that would make the
 * watch fetch, in ms. Home Assistant answers the service call before it pushes
 * the new state, so a snapshot taken the moment the call returns would still
 * hold the old one. This is the window the push has to land in: long enough for
 * a slow box, short enough that a light switched elsewhere a moment later is
 * already shut out again. */
const DEMO_REFETCH_MS = 2000;

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
      ${p} .layer.pinned .badges, ${p} .layer.pinned .ground-cap { display: none; }
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
type HelpTab = "basics" | "pages" | "keys" | "sync";
type LayerDetail = "compact" | "expanded";
/** How the Layers list is shown: picture size and row detail. Per browser,
 * like the column widths, and never part of the document. The Add a layer
 * card's own open and size settings went with the card (2026-09-23); an older
 * browser's copy of them is read past. */
const LIST_STORE_KEY = "wrist-assistant-panel.layers.v1";

const GRID_STORE_KEY = "wrist-assistant-panel.grid.v1";

/** The complication open in this tab, so a reload opens it again. Session
 * storage, because it is about this tab: a second tab opens on its own. */
const OPEN_STORE_KEY = "wrist-assistant-panel.open.v1";/** How tall the slot a dragged row opens is, CSS px. */
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
/**
 * Run a button on the press rather than on the click.
 *
 * A click needs the press and the release on the same button. Under a search
 * box whose result list closes on blur, the press itself removes the list,
 * everything under it jumps up, and the release lands on empty air: the button
 * is never clicked. Cancelling the press keeps the focus where it is, so the
 * list is still open and nothing moves. The click handler stays beside it for
 * the keyboard, which fires a click and no press at all.
 */
function pressed(run: () => void) {
  return (e: PointerEvent) => {
    if (e.button !== 0) return;
    e.preventDefault();
    run();
  };
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

/** One row of the Layers list: a layer, or a group's folder with the members
 * that go under it. */
export type LayerListRow =
  | { kind: "layer"; el: CElement }
  | { kind: "group"; group: LayerGroup; members: CElement[]; total: number };

/**
 * What the Layers list shows for one page of one shape, top of the stack first.
 *
 * A paged document lists the page it is showing: the layers pinned to it and
 * the ones on every page. Layers on another page are not rows, because nothing
 * on screen draws them; the inspector's cross-links still reach them, and
 * following one brings its page up, which is what puts its row back.
 *
 * A group's folder stands where its topmost listed member is, so a group whose
 * members are all on other pages has no folder at all, and one that straddles
 * two pages lists only the members this page draws. `total` is what the group
 * holds on the shape either way, so the folder can say when it is showing part
 * of itself rather than count its own rows and read as a group that lost
 * layers.
 */
export function layerListRows(
  cfg: CustomComplicationConfig,
  shapeRows: readonly CElement[],
  page: number,
): LayerListRow[] {
  const ordered = elementsOnPage(cfg, shapeRows, page).reverse();
  const out: LayerListRow[] = [];
  const seen = new Set<string>();
  for (const el of ordered) {
    const gid = el.payload.groupId;
    const group = gid === undefined ? undefined : cfg.groups?.find((x) => x.id === gid);
    if (!group) {
      out.push({ kind: "layer", el });
      continue;
    }
    if (seen.has(group.id)) continue;
    seen.add(group.id);
    out.push({
      kind: "group",
      group,
      members: ordered.filter((e) => e.payload.groupId === group.id),
      total: shapeRows.filter((e) => e.payload.groupId === group.id).length,
    });
  }
  return out;
}

/** The top bar's and the left column's own menus: the bar's ···, the Pages
 * card's ··· and the Layers card's ···. Kept apart from the preview bar's
 * menus, which have a close rule of their own. */
type SideMenu = "top" | "pages" | "layers";

/** The Add sheet's three tabs. */
type AddTab = "elements" | "presets" | "parts";

/** How wide the Add sheet is, CSS px. */
export const ADD_SHEET_WIDTH = 560;
/** The tallest the Add sheet grows, and the least room under its button that
 * is still worth hanging it there rather than in the middle of the window. */
const ADD_SHEET_MAX_HEIGHT = 700;
const ADD_SHEET_MIN_HEIGHT = 420;
/** How far the sheet keeps from the window's edges. */
const ADD_SHEET_MARGIN = 12;

/** Where the Add sheet opens: hung under its button, or centred in the
 * window when there is not the room for that. */
export type AddSheetPlace =
  | { mode: "anchored"; left: number; top: number; height: number }
  | { mode: "centered" };

/**
 * Where the Add sheet goes. Under the + Add button, its left edge on the
 * button's, when the whole 560px width fits to the right and there is a
 * useful height below; otherwise in the middle of the window, which is what a
 * narrow panel or a phone gets.
 */
export function addSheetPlace(
  anchor: { left: number; bottom: number },
  viewport: { width: number; height: number },
): AddSheetPlace {
  const top = anchor.bottom + 6;
  const room = viewport.height - top - ADD_SHEET_MARGIN;
  const left = Math.max(ADD_SHEET_MARGIN, anchor.left);
  if (left + ADD_SHEET_WIDTH > viewport.width - ADD_SHEET_MARGIN || room < ADD_SHEET_MIN_HEIGHT) return { mode: "centered" };
  return { mode: "anchored", left, top, height: Math.min(ADD_SHEET_MAX_HEIGHT, room) };
}

/**
 * Whether a press of the / key opens the Add sheet's search. A bare slash
 * only, never while a text field has the keyboard, since that is where a
 * slash is a character, and never over a dialog, which owns its own keys.
 */
export function slashOpensAddSearch(
  e: { key: string; metaKey: boolean; ctrlKey: boolean; altKey: boolean },
  inTextField: boolean,
  dialogOpen: boolean,
): boolean {
  return e.key === "/" && !e.metaKey && !e.ctrlKey && !e.altKey && !inTextField && !dialogOpen;
}

/** Whether one offer's name answers the Add sheet's search: every word typed
 * is somewhere in the name, in any order and either case. Nothing typed
 * matches everything. */
export function matchesAddSearch(title: string, query: string): boolean {
  const words = query.trim().toLocaleLowerCase().split(/\s+/).filter((w) => w !== "");
  if (words.length === 0) return true;
  const name = title.toLocaleLowerCase();
  return words.every((w) => name.includes(w));
}

/** The elements and presets the Add sheet shows for one search. */
export function filterAddOffers<E extends { title: string }, P extends { title: string }>(
  query: string,
  elements: readonly E[],
  presets: readonly P[],
): { elements: E[]; presets: P[] } {
  return {
    elements: elements.filter((e) => matchesAddSearch(e.title, query)),
    presets: presets.filter((p) => matchesAddSearch(p.title, query)),
  };
}

/** The sync pill's color: green once the device has everything, amber while
 * it does not yet, quiet for the shelf, which waits for nothing. Never bare
 * orange words. */
export function sendTone(kind: SendState["kind"]): "ok" | "warn" | "quiet" {
  if (kind === "sent") return "ok";
  if (kind === "library") return "quiet";
  return "warn";
}

/** The caption beside Save: when this complication was last saved, or that
 * it never has been. */
export function savedCaption(neverSaved: boolean, updatedAt: string | undefined, nowMs: number): string {
  if (neverSaved) return "Not saved yet";
  const at = updatedAt === undefined ? Number.NaN : Date.parse(updatedAt);
  if (Number.isNaN(at)) return "Saved";
  return `Saved ${agoWords(Math.max(0, (nowMs - at) / 1000))}`;
}

/**
 * The badge a tapped row wears in the Layers list. A tap that turns the page
 * says which page it lands on, counted from the page the row is on and
 * wrapping the way the watch does; anything else is just "tap", and the
 * tooltip carries the whole action.
 */
export function tapBadge(action: TapAction, fromPage: number, pageCount: number): string {
  const count = Math.max(1, pageCount);
  switch (action.type) {
    case "nextPage": return count > 1 ? `→ page ${(fromPage % count) + 1}` : "→ next page";
    case "previousPage": return count > 1 ? `→ page ${((fromPage - 2 + count) % count) + 1}` : "→ previous page";
    case "showPage": return `→ page ${action.page}`;
    case "playTour": return "→ every page";
    default: return "tap";
  }
}

/** What a tap does, as the foot of the Layers list says it: "tap: refresh". */
function tapWords(action: TapAction): string {
  const words = describeTapAction(action);
  return `tap: ${words.charAt(0).toLowerCase()}${words.slice(1)}`;
}

/**
 * The one row at the foot of the Layers list: the shape's own ground and
 * border, and what a tap anywhere else does. It used to be two rows, the
 * shape and "Whole complication", which read as two things under the stack
 * when they are one: the complication itself. A click on it selects the
 * shape.
 */
export function backgroundRow(
  cfg: CustomComplicationConfig,
  family: FamilyKind,
): { name: string; meta: string; caption: string; inspect: { kind: "family" } } {
  const layout = cfg.perFamily[family];
  const fill = layout?.backgroundColorHex ? colorWords(layout.backgroundColorHex) : "Transparent";
  const border = layout?.borderColorHex ? `${layout.borderWidth} pt border` : "no border";
  return {
    name: "Background",
    meta: `${fill} · ${border} · ${tapWords(cfg.tapAction)}`,
    caption: "always at the bottom",
    inspect: { kind: "family" },
  };
}

/**
 * The one line under the Layers header: what the list is showing. A paged
 * document names the page and counts the layers on it apart from the ones
 * on every page, since those are rows too and would otherwise read as ones
 * that crept onto this page.
 */
export function layersFilterLine(
  shapeRows: readonly CElement[],
  paged: boolean,
  page: number,
  all: boolean,
): { lead: string; count: string } {
  const words = (n: number) => `${n} layer${n === 1 ? "" : "s"}`;
  if (!paged) return { lead: "", count: words(shapeRows.length) };
  if (all) return { lead: "Every page", count: words(shapeRows.length) };
  const here = shapeRows.filter((el) => el.payload.page === page).length;
  const everywhere = shapeRows.filter((el) => el.payload.page === undefined).length;
  return {
    lead: `On page ${page}`,
    count: everywhere > 0 ? `${words(here)}, plus ${everywhere} on every page` : words(here),
  };
}

/**
 * The Layers list with Show all on: one block per page, then the layers on
 * every page, each block top of the stack first. A page with nothing pinned
 * to it is left out, since a heading over nothing is not a fact worth a line.
 */
export function layerListSections(
  cfg: CustomComplicationConfig,
  shapeRows: readonly CElement[],
  pageCount: number,
): { label: string; page: number | undefined; rows: LayerListRow[] }[] {
  const out: { label: string; page: number | undefined; rows: LayerListRow[] }[] = [];
  for (let page = 1; page <= pageCount; page++) {
    const rows = layerListRows(cfg, shapeRows.filter((el) => el.payload.page === page), page);
    if (rows.length > 0) out.push({ label: `Page ${page}`, page, rows });
  }
  const every = layerListRows(cfg, shapeRows.filter((el) => el.payload.page === undefined), 1);
  if (every.length > 0) out.push({ label: "Every page", page: undefined, rows: every });
  return out;
}

/**
 * One button in the Elements grid.
 *
 * Most kinds are one card: press it, get one empty layer of that kind. Two
 * kinds are more than one, because the thing the card cannot draw is where
 * the layer reads from. `setup` runs on the fresh layer, so the card lands on
 * a picture that is already a camera or already an upload, rather than on a
 * picture the author then has to re-aim.
 */
interface AddCard {
  kind: CElement["kind"];
  /** The word on the card. */
  title: string;
  /** The card's tooltip: what pressing it makes. */
  blurb: string;
  /** Which sample to draw. Absent draws the kind's own sample. */
  variant?: AddVariant;
  /** Point the fresh layer at this card's source. */
  setup?: (el: CElement) => void;
}

/**
 * The kinds that are offered more than once, and what each offer makes.
 *
 * A picture layer carries `source`, and the three sources are not three looks:
 * a camera is a live feed, an entity picture is whatever that entity already
 * carries, and an upload is bytes in the document. An icon carries the same
 * split between a catalogue glyph and a pasted drawing. Both used to be one
 * button, which named the kind and said nothing about the choice, so the two
 * sources nobody guessed were the two nobody used.
 *
 * An uploaded picture and a pasted drawing name no entity at all, so their
 * cards clear the entity the blank layer came with. A picture that draws its
 * own bytes but still names a camera would carry that camera into every share
 * and every gallery upload, for nothing (`setImageSource` in `editors.ts`
 * does the same on a later switch).
 */
const ADD_VARIANTS: Partial<Record<CElement["kind"], readonly AddCard[]>> = {
  icon: [
    { kind: "icon", title: "Icon", blurb: "Add a blank icon layer, drawn from the symbol catalogue" },
    {
      kind: "icon", title: "Custom SVG", variant: "iconSvg",
      blurb: "Add a blank icon layer that draws an SVG path you paste",
      setup: (el) => { if (el.kind === "icon") el.payload.symbol = literal(CUSTOM_SVG_SYMBOL); },
    },
  ],
  image: [
    { kind: "image", title: "Camera", variant: "imageCamera", blurb: "Add a blank picture layer that shows a camera" },
    {
      kind: "image", title: "Entity picture", variant: "imageEntity",
      blurb: "Add a blank picture layer that shows the picture an entity already carries: a person's photo, cover art, a weather icon",
      setup: (el) => {
        if (el.kind !== "image") return;
        el.payload.source = "entityPicture";
        el.payload.entity = { entityId: "", displayName: "", domain: "" };
      },
    },
    {
      kind: "image", title: "Custom image", variant: "imageUpload",
      blurb: "Add a blank picture layer and put a picture of your own into it",
      setup: (el) => {
        if (el.kind !== "image") return;
        el.payload.source = "inline";
        el.payload.entity = { entityId: "", displayName: "", domain: "" };
      },
    },
  ],
  // Named for what it is on the face, since it draws nothing there: any layer
  // can take a tap, and this one is for the empty part of the face.
  tap: [{ kind: "tap", title: "Invisible tap zone", blurb: "Add an invisible tap zone. A tap inside it runs its own action." }],
};

/** The Add sheet's three groups of elements. */
type AddGroup = "value" | "pictures" | "decorate";

/** The kinds that show a value, in the order the Add sheet lists them. The
 * catalogue icon is here too: it shows a state as much as a text does. */
const ADD_VALUE_ORDER: readonly CElement["kind"][] = ["text", "gauge", "chart", "timeline", "list", "icon"];

/**
 * One of the Add sheet's groups, in the sheet's order. A pasted SVG is a
 * drawing, so it sits with the pictures rather than with the catalogue icon;
 * a shape and a tap zone draw nothing from the house, so they decorate.
 */
export function addGroupCards<C extends { kind: CElement["kind"]; variant?: AddVariant }>(cards: readonly C[], group: AddGroup): C[] {
  const picture = (c: C) => c.kind === "image" || c.variant === "iconSvg";
  if (group === "pictures") return [...cards.filter((c) => c.kind === "image"), ...cards.filter((c) => c.variant === "iconSvg")];
  if (group === "decorate") return [...cards.filter((c) => c.kind === "shape"), ...cards.filter((c) => c.kind === "tap")];
  return ADD_VALUE_ORDER.flatMap((kind) => cards.filter((c) => c.kind === kind && !picture(c)));
}

/** The presets most faces start from, offered on the Elements tab under the
 * empty layers, with the way to the rest beside them. */
const POPULAR_PRESETS: readonly PresetKind[] = ["gauge", "status", "timer"];

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
   * "Open a watch app page" tap-action picker. */
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
  /** Whether the footer's Raw configuration view is open. */
  @state() private rawOpen = false;
  @state() private inspect: Inspect = { kind: "general" };
  /** The inspector cards that are open. Reset to the default two (Content and
   * Look) whenever something else is selected (willUpdate). */
  @state() private openSections: ReadonlySet<string> = defaultOpenSections();
  /** The inspector cards showing their help text, by card id. Not stored:
   * help is something asked for now, not a setting. The Control Center card
   * starts with its help on, because its rows are new and each one needs a
   * sentence; its "?" hides them for the rest of the session. */
  @state() private helpSections: ReadonlySet<string> = new Set(["control"]);
  /** A drag on a number's title is one undo step, however many edits it makes. */
  private readonly scrubStart = () => this.draft?.beginGesture();
  private readonly scrubEnd = () => this.draft?.endGesture();
  /** The header's complication dialog is open. */
  @state() private pickerOpen = false;
  /** The device and complication this tab had open before a reload, read once
   * on connect and spent on the first list that lands. Until then nothing is
   * written back, so the panel's own empty start cannot overwrite it. */
  private restoreOpen?: { owner: string; id: string };
  /** Which device tab the picker is on: "all", an owner id, or the library.
   * Kept in this browser with the Layers list's other view choices, because a
   * household that works on one watch opens this dialog on that watch every
   * time. */
  @state() private pickerDevice: string = ALL_DEVICES;
  /** What the Shape menu is narrowed to: a shape, the control, or "all". Per
   * session, never saved: the tab is the choice worth remembering, and a
   * shape left on from last week is a dialog that opens half empty. */
  @state() private pickerFilter: FamilyKind | "all" | "control" = "all";
  /** What has been typed into the picker's search field. It narrows on the
   * name and on the people who have it, and combines with the chip. */
  @state() private pickerQuery = "";
  /** Which of the picker's blocks are folded away, by key: `who:<n>` for a
   * person's band and a device's owner id for one device's block. Kept in
   * this browser with the tab, because a household with four watches folds
   * the three it does not work on and means it next time.
   *
   * Folded rather than open is the list, so a device added later opens
   * unfolded: the other way round, a new watch would arrive already shut. */
  @state() private pickerShut: readonly string[] = [];
  /** Whether a card draws the complication on its own rather than on its
   * device. The device says where a shape sits, which is what somebody
   * placing one asks; the shape on its own is bigger and is what somebody
   * reading a list of thirty asks. Kept in this browser, because it is how
   * somebody likes to read the list. */
  @state() private pickerBare = false;
  /** Whether the picker is picking several cards at once rather than opening
   * one. Per session: it is a thing being done, not a way of working. */
  @state() private pickerSelecting = false;
  /** The cards picked, each `<ownerId>|<recordId>`. One card is one record on
   * one device, so that pair is what every batch acts on, and it survives a
   * design gaining a link, which changes its row's key. */
  @state() private pickerPicked: readonly string[] = [];
  /** What a batch is doing, while it does it: "Deleting 3 of 7…". The cards
   * stay on screen and the bar says where it is up to. */
  @state() private pickerBatchNote?: string;
  /** Which batch is asking before it runs, if any. Delete asks; the rest just
   * go, since every one of them can be done again. */
  @state() private pickerBatchAsk?: "delete";
  /** Whether the bar's "Put on…" menu of devices is open. */
  @state() private pickerBatchAdd = false;
  /** Every card the tab, the search and the shape have left on screen, by
   * pick key. Written as the grid is drawn and read by the bar under it, so
   * "Pick all" picks what is being looked at rather than the whole home. Not
   * reactive: it is a note of what was just rendered, never a cause to
   * render again. */
  private pickerShown: readonly string[] = [];
  /** The key of the locked picker card whose explanation is unfolded. A tap
   * shows it inline because a hover title never appears on a touch screen. */
  @state() private pickerNote?: string;
  /** The picker card asking "Really delete", by record id. */
  @state() private pickerConfirmDelete?: string;
  /** Which card has its "Devices" menu open, by row key. One at a time:
   * the menu is absolute inside its own card. */
  @state() private pickerDupFor?: string;
  /** A device has been picked and its complications are still on the way. The
   * picker stays open across the switch, so without this the list would show
   * the previous device's rows until the reply landed. */
  @state() private ownerBusy = false;
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
  /** Which of the top bar's and the left column's own menus is open. */
  @state() private sideMenu?: SideMenu;
  /** The Add sheet, and where it opened. Undefined while it is shut. */
  @state() private addSheet?: AddSheetPlace;
  /** What has been typed into the Add sheet's search. */
  @state() private addQuery = "";
  /** The Add sheet's tab. */
  @state() private addTab: AddTab = "elements";
  /** Whether the Shared values footer of the Layers card is open. */
  @state() private sharedOpen = false;
  /** Show all in the Layers card: every page's layers, grouped by page,
   * rather than the page showing. */
  @state() private allPages = false;
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
  /** The library of saved parts, read the first time the Add sheet opens. */
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
  @state() private openMenu?: "grid" | "case" | "tint" | "list" | "place" | "doc" | "snap";
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
  /** How big the stage draws the face, as a share of the size that fits it
   * (see canvas-tools.ts). 1 is Fit, the default. Not saved: every open
   * starts with the whole face in view. */
  @state() private canvasZoom = ZOOM_FIT;
  /** The "···" menu over the canvas has its Add to a device list unfolded. */
  @state() private docPlaceOpen = false;
  /**
   * Demo mode: the face alone in a dialog, drawn the way the watch draws it and
   * tapped the way the watch is tapped. Nothing of the editor comes along, no
   * grid, no handles, no tap boxes, because the question here is what this
   * complication is like to use rather than where its layers sit.
   */
  @state() private demoing = false;
  /** What the last demo tap did, in a line under the face. */
  @state() private demoNote?: DemoOutcome;
  /** The demo's success flash is on screen. Taken out and put back for each
   * flash rather than left in place, because a CSS animation on an element
   * that never left carries on instead of starting again. */
  @state() private demoFlashOn = false;
  /** Which box the flash rings: the tap area that fired, or the whole
   * complication when the press fell through to the document's own action. */
  @state() private demoFlashFrame?: NormalizedFrame;
  private demoFlashTimer?: number;
  /**
   * The house as it stood when the demo opened, or when the last tap made the
   * watch fetch. While this is set, every entity the face draws is read from
   * here rather than from `hass`.
   *
   * The editor's preview is live because an editor should follow the house.
   * The watch is not: it draws whatever it last fetched and holds that picture
   * until it reloads. A demo that followed a light switched in another room
   * would teach the opposite of the one thing people ask about most, which is
   * why their complication is showing an old value.
   */
  private demoStates?: Record<string, HassEntityState>;
  /** Live state is taken again until this instant, after a tap the watch would
   * have fetched for. Zero means frozen. */
  private demoRefetchUntil = 0;
  private demoRefetchTimer?: number;
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
  /** Step 2's answer: a watch, an iPhone, or Control Center. Undefined until
   * it is picked, because the kind decides which shapes step 3 offers and a
   * tinted default would be choosing for the author. */
  @state() private newKind?: NewKind;
  /** Step 3's answer: the one shape. A complication is one shape, so this is
   * one family and never a set. Undefined for a Control Center control, which
   * has no shape at all. */
  @state() private newFamily?: FamilyKind;
  /** Step 4's answer: the devices ticked, each of which gets a record of its
   * own. None ticked keeps the design in the home's library. */
  @state() private newOwners: ReadonlySet<string> = new Set();
  /** "Duplicate as": the design being copied and where it sits today, then the
   * same three questions the New dialog asks about the copy. A complication is
   * one shape on one device, so this is how a finished look reaches a second
   * shape or a second device; the copy is its own complication from the moment
   * it is written. */
  @state() private dupOpen = false;
  @state() private dupFrom?: { cfg: CustomComplicationConfig; ownerId: string };
  @state() private dupKind?: NewKind;
  @state() private dupFamily?: FamilyKind;
  @state() private dupOwners: ReadonlySet<string> = new Set();
  /** Every other device's records and taken slots, so the panel knows which
   * names are taken elsewhere and whether a device has a seat free. Refreshed
   * when the device list changes and after every save, not on every change
   * event: only the edited device's changes are subscribed to. */
  @state() private otherLists: ReadonlyMap<string, { records: ComplicationRecord[]; occupied: OccupiedSlot[]; appliedToken?: number | null; token: number }> = new Map();
  /** Where a write that was not the open document landed, in words. Not an
   * error: a device that has not synced yet is named as waiting. */
  @state() private copyStatus?: string;
  /** The first record a duplicate just wrote, so the note about it can offer
   * to open it. Cleared with the note. */
  @state() private copyOpen?: { ownerId: string; recordId: string };
  /** The Share dialog is open, which mode it is in, and the labels the author
   * has renamed. Labels are keyed by placeholder id and only hold the edited
   * ones, so the defaults follow the document as it is edited underneath. */
  @state() private shareOpen = false;
  @state() private shareMode: "share" | "backup" = "share";
  @state() private shareLabels: ReadonlyMap<string, string> = new Map();
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
  /** Set when the text is a whole-home backup rather than one complication. */
  @state() private importBackup?: Extract<BackupParse, { ok: true }>;
  /** What the last restore did, in words. Set once it has run. */
  @state() private restoreResult?: { text: string; error: boolean };
  @state() private restoring = false;
  /** "Back up all" is reading every device's list. */
  @state() private backingUp = false;
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
  /** What the one-shape-per-document split did on this first open, with its
   * own Undo. See `splitShapes.ts`. */
  @state() private splitNotice?: SplitNotice;
  /** Which documents in the home sit two to a seat, in the banner's words, or
   * undefined when none do. Worked out whenever a list lands; the move behind
   * the Fix button is planned again from fresh lists. See `seatRepair.ts`. */
  @state() private seatClash?: string;
  /** Parsed config per saved record, keyed by id and invalidated by revision.
   * Every picker card draws the real complication, and parsing and compiling
   * every document in the home on every render of the grid is the one part of
   * that worth keeping. */
  private readonly recordPreviews = new Map<string, { revision: number; config: CustomComplicationConfig; entities: EntityRef[] }>();
  /** The pixels behind the picture layers a card draws, fetched once each and
   * kept for the life of the page. The complication being edited is not read
   * through this: see `picture-cache.ts` for why the two differ. */
  private readonly pictures = new PictureCache({
    fetch: (url) => fetch(url),
    objectUrl: (blob) => URL.createObjectURL(blob),
    revoke: (url) => URL.revokeObjectURL(url),
    changed: () => this.requestUpdate(),
    now: () => Date.now(),
  });
  /** Whether a warm-up of `pictures` is already waiting for an idle moment.
   * Every list reply asks for one, and they would otherwise stack up. */
  private pictureWarmQueued = false;
  /** Which watch case the previews are drawn in. The reference (46 mm) is scale 1. */
  @state() private previewCase = REFERENCE_CASE.label;
  /** The tint of a tinted watch face to preview in, or undefined for full
   * color. Not saved: a preview left tinted by accident would read as a broken
   * complication on the next visit. */
  @state() private previewTint?: string;
  @state() private loadError?: string;
  @state() private saveError?: string;
  @state() private saving = false;
  @state() private conflict?: Conflict;
  @state() private remoteRevision?: number;
  @state() private confirmDelete = false;
  /** The page whose trash is armed. The first press asks, the second deletes.
   * A page takes its layers with it, so one stray click should not do it, and a
   * dialog for a control this small is heavier than the act. It clears itself
   * after a few seconds and whenever the page changes, so a press left behind
   * cannot delete a page minutes later. */
  @state() private pageTrashArm?: number;
  private pageTrashTimer?: number;
  /** The device whose chip in the devices row has its trash armed, by owner
   * id. Same rule as the page trash: one press asks, the next takes the
   * design off that device, and it forgets after a few seconds. */
  @state() private placeTrashArm?: string;
  private placeTrashTimer?: number;
  @state() private moveTarget?: string;
  @state() private moving = false;
  @state() private moveError?: string;
  @state() private version = 0; // bumped on every draft mutation

  private compiled?: Compiled;
  private compiledDocument?: string;
  /** `chartHistorySignature` as of the last scheduled refresh. */
  private historySignature = "";
  /** `listItemsRequests().signature` as of the last scheduled refresh. */
  private listSignature = "";
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
      /* Colors the whole editor shares: one per layer kind, one per section
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
         never drift apart in anything but color. */
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
      /* A selected row: a cool wash rather than the kind color, so a list of
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
      /* Two colors for the things that come out of Home Assistant rather
         than out of this editor: the entity a layer names, and the value it
         is reading right now. They are the same two colors in the search
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
      /* A slot a design does not fill, on a picker card's drawings. Lighter
         than the screen and darker than the furniture, so an unlit slot is a
         place that is empty rather than a shape nobody can see. */
      --wa-art-off: #3a372f;
      /* One color per person in the picker, handed out by their place in the
         household list. Six hues far enough apart to be told apart at the
         size of a tab glyph, each dark enough here to clear 4.5:1 on a white
         card; the dark skin sets its own lighter six, since no single value
         can clear that bar against white and against near-black at once. */
      --wa-person-1: #6d28d9;
      --wa-person-2: #0f766e;
      --wa-person-3: #9a5b00;
      --wa-person-4: #be123c;
      --wa-person-5: #0369a1;
      --wa-person-6: #4d7c0f;
      /* One hue per shape, for the box each shape's cards sit in. The same
         hue wherever that shape appears, on every device and in every list:
         the colour is the shape's, not the box's, so a household learns
         "circular is teal" once and reads it everywhere after that.
         Ordered the way a watch's boxes are, because a watch is where the
         hues sit closest together: five boxes, and each one's neighbour has
         to be plainly another colour. Control used to be a fuchsia a third
         of a turn from inline's violet, which on a watch put purple next to
         purple; it is the rose at the far side of the wheel now, and the
         three Home Screen tiles took the hues it left.
         These are washed into the ground at a tenth, so they only have to be
         told apart as a tint, but they name the box's label at full strength
         too and so are dark enough here to read on a white card. */
      --wa-shape-rectangular: #0369a1;
      --wa-shape-circular: #0f766e;
      --wa-shape-corner: #9a5b00;
      --wa-shape-inline: #6d28d9;
      --wa-shape-control: #be123c;
      --wa-shape-small: #4d7c0f;
      --wa-shape-medium: #c2410c;
      --wa-shape-large: #a21caf;
      --wa-shape-xlarge: #4338ca;
      --wa-r-sm: 8px;
      --wa-r-md: 12px;
      --wa-r-lg: 16px;
      /* The left column's cards and the Add sheet. */
      --wa-lc-r: 10px;
      /* Two states the top bar's sync pill and the Pages card's note say in
         color: on the device, and not there yet. */
      --wa-green: #1f8a4c;
      --wa-amber: #9a5b00;
      --wa-amber-bg: color-mix(in srgb, var(--wa-amber) 12%, transparent);
      --wa-amber-line: color-mix(in srgb, var(--wa-amber) 35%, transparent);
      --wa-shadow-pop: 0 12px 36px rgba(0,0,0,.28);
      --wa-ring: 0 0 0 3px color-mix(in srgb, var(--wa-accent) 28%, transparent);
      color: var(--wa-ink);
      background: var(--wa-bg);
    }
    /* The 2026 skin: near-black navy ground, cards a step up, hairlines made
       of light rather than grey, and a violet accent for the one thing on
       screen you are meant to press. Only colors change here. */
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
      --wa-art-off: #1b1f2b;
      /* The same six hues, lifted for the dark ground. */
      --wa-person-1: #a78bfa;
      --wa-person-2: #5eead4;
      --wa-person-3: #fbbf24;
      --wa-person-4: #fb7185;
      --wa-person-5: #38bdf8;
      --wa-person-6: #a3e635;
      /* The same shape hues, lifted for the dark ground. */
      --wa-shape-rectangular: #38bdf8;
      --wa-shape-circular: #5eead4;
      --wa-shape-corner: #fbbf24;
      --wa-shape-inline: #a78bfa;
      --wa-shape-control: #fb7185;
      --wa-shape-small: #a3e635;
      --wa-shape-medium: #fb923c;
      --wa-shape-large: #e879f9;
      --wa-shape-xlarge: #818cf8;
      --wa-green: #3fbf7f;
      --wa-amber: #f2c063;
      --wa-shadow-pop: 0 16px 48px rgba(0,0,0,.6);
      color-scheme: dark;
      scrollbar-color: rgba(255,255,255,.14) transparent;
    }
    * { box-sizing: border-box; }
    svg { display: block; }
    :host([dark]) ::selection { background: color-mix(in srgb, var(--wa-accent) 45%, transparent); }
    /* The header sits on the page rather than on a card of its own, with one
       hairline under it to part it from the columns. */
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
    header .spacer { flex: 1; }
    .toolbar { display: flex; gap: 6px; align-items: center; flex-wrap: wrap; }
    /* Top bar: Browse, the name, the place pill, then history, sync, Share,
       ···, Save and its caption, and the help. */
    header { gap: 10px; min-height: 50px; border-bottom: 1px solid var(--wa-line); }
    .picker > button.tb-browse { min-width: 0; max-width: none; height: 30px; gap: 7px; padding: 0 8px 0 10px; font-size: 12.5px; font-weight: 600; }
    .picker > button.tb-browse svg { width: 14px; height: 14px; }
    .tb-browse .tb-browse-l { color: var(--wa-ink); }
    .tb-name {
      display: inline-flex; align-items: center; gap: 6px; height: 30px; padding: 0 8px; min-width: 0;
      border-radius: 7px; border: 1px solid transparent; cursor: text;
    }
    .tb-name:hover { border-color: var(--wa-line); }
    .tb-name:focus-within { border-color: var(--wa-accent); box-shadow: var(--wa-ring); }
    header .tb-name > input.tb-name-input[type=text],
    header .tb-name > input.tb-name-input[type=text]:hover,
    header .tb-name > input.tb-name-input[type=text]:focus-visible {
      font: inherit; font-size: 13.5px; font-weight: 700; color: var(--wa-ink); min-height: 0; padding: 0;
      border: 0; background: transparent; box-shadow: none; outline: none;
      field-sizing: content; min-width: 7ch; max-width: 260px;
    }
    header .tb-name > input.tb-name-input:disabled { opacity: 1; cursor: default; }
    .tb-pen { font-size: 11px; color: var(--wa-muted); opacity: .6; }
    .tb-pill {
      display: inline-flex; align-items: center; height: 22px; padding: 0 9px; border-radius: 999px; min-width: 0; max-width: 300px;
      font-size: 11.5px; font-weight: 500; color: var(--wa-muted); background: var(--wa-panel);
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    header button.icon.tb-icon { width: 30px; height: 30px; }
    header button.icon.tb-icon svg.ui-icon { width: 16px; height: 16px; }
    .tb-div { width: 1px; height: 20px; flex: none; background: var(--wa-line); }
    .tb-sync {
      display: inline-flex; align-items: center; gap: 6px; height: 24px; padding: 0 10px 0 8px; min-width: 0; max-width: 380px;
      border-radius: 999px; font-size: 11.5px; font-weight: 600; white-space: nowrap; overflow: hidden; border: 1px solid transparent;
    }
    .tb-sync .tb-dot { width: 7px; height: 7px; border-radius: 50%; flex: none; background: currentColor; }
    .tb-sync-l { overflow: hidden; text-overflow: ellipsis; }
    .tb-sync-n { flex: none; font-weight: 500; color: var(--wa-muted); }
    .tb-sync.ok { color: var(--wa-green); background: color-mix(in srgb, var(--wa-green) 12%, transparent); border-color: color-mix(in srgb, var(--wa-green) 35%, transparent); }
    .tb-sync.warn { color: var(--wa-amber); background: var(--wa-amber-bg); border-color: var(--wa-amber-line); }
    .tb-sync.quiet { color: var(--wa-muted); background: var(--wa-panel); }
    .tb-sync.sending .tb-dot { animation: wa-pulse 1.2s ease-in-out infinite; }
    @keyframes wa-pulse { 50% { opacity: .3; } }
    @media (prefers-reduced-motion: reduce) { .tb-sync.sending .tb-dot { animation: none; } }
    button.tb-btn {
      font: inherit; font-size: 12.5px; font-weight: 600; height: 30px; padding: 0 11px; border-radius: 8px; cursor: pointer; flex: none;
      border: 1px solid var(--wa-line); background: var(--wa-card); color: var(--wa-ink); white-space: nowrap;
    }
    button.tb-btn:hover:not(:disabled) { border-color: var(--wa-line-strong); background: var(--wa-panel); }
    button.tb-btn:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    button.tb-btn.tb-more { padding: 0 9px; letter-spacing: .08em; }
    .tb-saved { font-size: 11.5px; color: var(--wa-muted); white-space: nowrap; }
    header.stacked .tb-saved, header.stacked .tb-pen { display: none; }
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
    /* A box that is the one thing left to do. An empty Custom SVG layer draws
       nothing at all, and a field that looks like every other field does not
       say so: the dashed accent border points at where to paste before the
       hint under it is read. The tint goes as soon as something lands. */
    input.needs, textarea.needs {
      border-color: color-mix(in srgb, var(--wa-accent) 60%, var(--wa-line));
      border-style: dashed;
      background: color-mix(in srgb, var(--wa-accent) 8%, var(--wa-input));
    }
    input.needs:focus-visible, textarea.needs:focus-visible { border-style: solid; }
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

    /* The complication picker: one button in the header instead of a list down
       the side, because the list was read once per session and the space it
       held is worth more to the layers. The button opens a centred dialog; the
       400 px dropdown that used to hang off it, its rows and its folded Hidden
       section all went with the cards (2026-09-19). */
    .picker { position: relative; }
    .picker > button {
      display: inline-flex; align-items: center; gap: 10px; font: inherit; font-size: 13px; font-weight: 700;
      height: 34px; padding: 0 10px 0 8px; border-radius: 9px; cursor: pointer; color: var(--wa-ink);
      border: 0; box-shadow: 0 0 0 1px var(--wa-line-strong); background: var(--wa-card); min-width: 250px; max-width: 380px;
      transition: box-shadow .12s ease-out, background-color .12s ease-out;
    }
    .picker > button:hover { box-shadow: 0 0 0 1px var(--wa-ink); }
    .picker > button:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .picker > button svg { width: 16px; height: 16px; opacity: .7; }
    /* A pill that is on or off. It was the picker's own filter row, which the
       device tabs and the Shape menu replaced (2026-09-20); the gallery
       dialog's tags are what wear it now. */
    .pk-chip {
      display: inline-flex; align-items: center; gap: 5px; font: inherit; font-size: 12.5px; font-weight: 500;
      padding: 5px 9px; border-radius: 999px; cursor: pointer; color: var(--wa-muted);
      border: 1px solid var(--wa-line); background: transparent;
    }
    .pk-chip:hover:not(:disabled) { border-color: var(--wa-line-strong); color: var(--wa-ink); }
    .pk-chip:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .pk-chip:disabled { opacity: .35; cursor: default; }
    .pk-chip.on { border-color: var(--wa-accent); color: var(--wa-ink); background: color-mix(in srgb, var(--wa-accent) 18%, transparent); }

    /* The device tabs under the head: All, a tab per device, Unassigned
       last. Each one carries its own count, so an empty device says so
       before it is opened.

       They wrap onto a second row rather than scrolling sideways. A household
       of four people has eight device tabs, and a sideways scroller hides
       half of them behind a bar nobody thinks to drag: the whole point of the
       row is that the home is visible at a glance. */
    .pk-tabs {
      display: flex; align-items: stretch; flex-wrap: wrap; gap: 2px; flex: none;
      padding: 0 12px; border-bottom: 1px solid var(--wa-line);
    }
    /* The --pk-person property is that person's color, set on the tab itself,
       so the six colors need no class each. A tab that is nobody's leaves it
       unset and falls back to the accent. */
    .pk-tab {
      display: inline-flex; align-items: center; gap: 7px; flex: none; cursor: pointer;
      font: inherit; font-size: 12.5px; font-weight: 500; color: var(--wa-muted); white-space: nowrap;
      padding: 9px 12px; border: 0; background: transparent;
      border-bottom: 2px solid transparent; margin-bottom: -1px;
    }
    .pk-tab:hover { color: var(--wa-ink); }
    .pk-tab:focus-visible { outline: none; box-shadow: var(--wa-ring); border-radius: 7px 7px 0 0; }
    .pk-tab.on { color: var(--wa-ink); font-weight: 700; border-bottom-color: var(--pk-person, var(--wa-accent)); }
    .pk-tab svg { width: 15px; height: 15px; }
    /* The glyph and the count wear the color; the name stays ink, so a row of
       eight tabs is not eight colors of text. One person's watch and one
       person's iPhone are the same color, which is what makes the row read as
       people rather than as devices. */
    .pk-tab-glyph { display: inline-flex; flex: none; color: var(--pk-person, var(--wa-accent)); }
    .pk-tab-count { font-size: 11.5px; font-weight: 400; opacity: .8; color: var(--pk-person, var(--wa-accent)); }
    /* One shape at a time, in the head beside the search. A menu rather than
       a chip each: eight pills for a question most visits never ask. */
    .pk-shape { display: inline-flex; align-items: center; gap: 6px; flex: none; }
    .pk-shape-lead { font-size: 12px; color: var(--wa-muted); }
    .pk-shape select { max-width: 180px; }


    /* One surface, one grid: every complication this home holds, under the
       device tabs, a search field and the Shape menu. A centred dialog rather
       than a dropdown off the button, because a grid four cards wide needs
       the width, and because this is the one place the whole household is
       read at once. Only the grid scrolls, so the tabs and the foot stay put
       while a long list moves under them.

       A fixed height, not a maximum: the dialog is the same size and in the
       same place on every tab, so an empty device does not shrink it to a
       strip and drop it to the middle of the screen. A short list leaves
       the grid's floor empty instead; the eye stays where the tabs are. */
    dialog.pk-dialog {
      width: min(1400px, 100vw - 48px); height: calc(100vh - 48px); padding: 0;
      border: 1px solid var(--wa-line); border-radius: var(--wa-r-lg);
      background: var(--wa-card); color: var(--wa-ink); box-shadow: var(--wa-shadow-pop);
      display: flex; flex-direction: column; overflow: hidden;
    }
    dialog.pk-dialog::backdrop { background: rgba(0,0,0,.45); }
    .pk-head { display: flex; align-items: center; gap: 12px; flex: none; padding: 12px 12px 12px 18px; border-bottom: 1px solid var(--wa-line); }
    .pk-head h2 { margin: 0; flex: 1; min-width: 0; font-size: 17px; font-weight: 700; }
    /* How many the home holds, beside the title: the tabs say how they are
       split up, and this says how many there are to split. */
    .pk-head-count { font-size: 14px; font-weight: 400; color: var(--wa-muted); margin-left: 6px; }
    .pk-head > button.icon { width: 32px; height: 32px; flex: none; }
    /* The real complication set into a slot on the drawing: its own picture,
       nested, sized by the transform around it rather than by any rule that
       sizes the card's other svgs. */
    .pk-card-crop svg svg.complication { width: auto; height: auto; max-width: none; max-height: none; border-radius: 0; overflow: visible; }
    .pk-search {
      display: flex; align-items: center; gap: 8px; flex: none; width: 260px; max-width: 45vw;
      padding: 6px 10px; border-radius: var(--wa-r-md); border: 1px solid var(--wa-line); background: var(--wa-panel);
    }
    .pk-search:focus-within { border-color: var(--wa-accent); box-shadow: var(--wa-ring); }
    .pk-search svg { width: 14px; height: 14px; flex: none; color: var(--wa-muted); }
    /* No border of its own: the label around it is the field, so the icon and
       the text sit in one box rather than in a box beside a box. */
    .pk-search-input {
      flex: 1; min-width: 0; font: inherit; font-size: 13px; color: var(--wa-ink);
      border: 0; background: transparent; outline: 0; padding: 0;
    }
    /* The grid sits on the panel color rather than the card color, so a
       white card reads as a card and not as a rule drawn round some text. */
    .pk-body { flex: 1; min-height: 0; overflow: auto; padding: 14px 18px; background: var(--wa-panel); }
    /* One device per block on the All tab, with room between them: the gap is
       what makes the headings read as headings rather than as captions under
       the grid above. */
    /* Three surfaces, nested: the dialog's body, one device's box on it, and
       one shape's box inside that. Each step goes toward the card colour, so
       the nesting reads as going inwards in the light theme and the dark one
       alike without a single hard-coded colour.

       Nothing here is a coloured rail. A person's hue is a dot on their band
       and a wash across their devices' headings: enough to pair "Jesse's two"
       at a glance, with no line down the left edge cutting the grid off from
       the page. */
    /* One person's band: a quiet caption with a rule running off it, holding
       their devices' boxes. It is deliberately lighter than a device heading:
       a person is the group a device is in, not a louder heading above it. */
    .pk-band { display: block; }
    .pk-band + .pk-band, .pk-band + .pk-sec, .pk-sec + .pk-band { margin-top: 18px; }
    .pk-band-top { display: flex; align-items: center; gap: 10px; margin: 0 0 8px; }
    .pk-band-dot { width: 7px; height: 7px; flex: none; border-radius: 50%; background: var(--pk-person, var(--wa-accent)); }
    .pk-band-name { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .09em; color: var(--wa-muted); }
    .pk-band-count { font-size: 11px; font-weight: 600; color: var(--pk-person, var(--wa-accent)); opacity: .9; }
    .pk-band-rule { flex: 1; height: 1px; min-width: 12px; background: var(--wa-line); }
    .pk-band-body { display: flex; flex-direction: column; gap: 10px; }
    .pk-band.shut .pk-band-top { margin-bottom: 0; }
    /* The fold control on a band and on a device: the whole heading is the
       button, so the target is the words rather than a chevron. */
    .pk-fold-btn {
      display: flex; align-items: center; gap: 9px; min-width: 0; flex: none;
      font: inherit; color: inherit; background: transparent; border: 0; padding: 2px 0; cursor: pointer; text-align: left;
    }
    .pk-fold-btn:hover .pk-sec-name, .pk-fold-btn:hover .pk-band-name { color: var(--wa-accent); }
    .pk-fold-btn:focus-visible { outline: none; box-shadow: var(--wa-ring); border-radius: 6px; }
    /* Down while the block is open, pointing at what it holds; round to the
       right while it is folded, pointing at what opening it would show. The
       glyph itself is drawn as a chevron pointing down. */
    .pk-fold { display: inline-flex; flex: none; color: var(--wa-muted); transform: rotate(0deg); transition: transform .12s ease; }
    .pk-fold svg { width: 13px; height: 13px; }
    .pk-band.shut .pk-fold, .pk-sec.shut .pk-fold { transform: rotate(-90deg); }
    /* One device's box. Clipping its overflow is what lets the heading's wash
       of the owner's colour run to the rounded corners without a second radius
       of its own, and what makes a folded box just its heading strip. */
    /* The whole box is washed with whoever's device it is, heading and cards
       alike, so a device reads as one coloured surface rather than as a
       coloured strip with a grey tray hanging off it. A device that is
       nobody's keeps the accent, so the shelf is still a surface of its own. */
    .pk-sec {
      display: flex; flex-direction: column; min-width: 0; overflow: hidden;
      border: 1px solid var(--wa-line); border-radius: 12px;
      background: color-mix(in srgb, var(--pk-person, var(--wa-accent)) 9%, var(--wa-panel));
    }
    .pk-sec + .pk-sec { margin-top: 10px; }
    /* A hairline under the heading and nothing else: the fill is already
       shared, so the line is all that has to say where the cards start. */
    .pk-sec-top {
      display: flex; align-items: baseline; gap: 10px; min-width: 0; padding: 7px 12px;
      border-bottom: 1px solid var(--wa-line);
    }
    .pk-sec.shut .pk-sec-top { border-bottom: 0; }
    .pk-sec-body { padding: 10px; min-width: 0; }
    .pk-sec-head { display: flex; align-items: center; gap: 9px; margin: 0; font-size: 13px; font-weight: 700; flex: none; }
    /* One shape per box inside a device's box, named on a line of its own over
       the cards. The name was stood on its end in a gutter for a while, which
       saved the line but read as a spine bolted to the side of the grid. The
       caption is set small and spaced instead, so it reads as a label on the
       box rather than as one more thing competing with the cards' own names. */
    .pk-boxes { display: flex; flex-direction: column; gap: 8px; }
    /* Washed with its own shape's hue, over the same ground every box sits
       on, so the tint is the only thing telling two boxes apart and every
       rectangular box in the dialog is the same colour. A shape with no hue
       of its own, which is a document with no shape at all, falls back to the
       plain ground rather than borrowing somebody else's. */
    .pk-box {
      display: flex; flex-direction: column; min-width: 0; padding: 8px 10px 10px;
      border: 1px solid var(--wa-line); border-radius: 10px;
      background: color-mix(in srgb, var(--pk-shape, transparent) 10%,
        color-mix(in srgb, var(--wa-card) 45%, var(--wa-panel)));
    }
    .pk-box-top { display: flex; align-items: center; gap: 7px; min-width: 0; margin: 0 0 8px 2px; }
    /* The label takes the hue at full strength: the wash alone is too faint to
       learn a shape's colour from, and the two together teach it in one look. */
    .pk-box-name {
      font-size: 10.5px; font-weight: 700; letter-spacing: .11em; text-transform: uppercase;
      color: var(--pk-shape, var(--wa-muted)); white-space: nowrap;
    }
    .pk-box-count { font-size: 10.5px; font-weight: 600; color: var(--wa-muted); opacity: .65; }
    .pk-box-pick { flex: none; margin: 0; accent-color: var(--wa-accent); }
    /* The person's own color, the same one their tabs wear, so the All tab's
       headings and the row of tabs agree about whose is whose. */
    .pk-sec-glyph { display: inline-flex; flex: none; color: var(--pk-person, var(--wa-accent)); }
    .pk-sec-glyph svg { width: 16px; height: 16px; }
    .pk-sec-name { color: var(--wa-ink); }
    .pk-sec-count { font-size: 12px; font-weight: 400; color: var(--pk-person, var(--wa-accent)); opacity: .8; }
    /* What Unassigned is, said where it is rather than in a tooltip: nobody
       duplicates a design into it without being told what it is for. */
    .pk-sec-note {
      margin: 0; font-size: 12px; font-weight: 400; color: var(--wa-muted); min-width: 0;
      overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    }
    .pk-sec-note.lone { margin: 0 0 12px; white-space: normal; }
    .pk-sec-empty { font-size: 12px; color: var(--wa-muted); }
    .pk-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; align-items: stretch; }
    /* Fewer columns on a narrow window: a crop of a device stops being
       readable well before the dialog runs out of width. */
    /* The dialog grows with the window, so a wide one takes a fifth column
       rather than stretching four cards past the point where a crop reads. */
    @media (min-width: 1300px) { .pk-grid { grid-template-columns: repeat(5, minmax(0, 1fr)); } }
    @media (max-width: 900px) { .pk-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
    @media (max-width: 640px) { .pk-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
    /* The Shape view is for somebody with a lot of them. A device window has
       to stay wide enough to read a watch in; a shape on its own does not, so
       the columns are as many as fit rather than four, and every box round
       them gives back the room it was holding for the device pictures.
       Two classes deep, so the column counts above do not win it back. */
    .pk-dialog.bare .pk-grid { grid-template-columns: repeat(auto-fill, minmax(148px, 1fr)); gap: 9px; }
    .pk-dialog.bare .pk-card { padding: 8px; border-radius: 10px; }
    .pk-dialog.bare .pk-card-top { margin-bottom: 6px; min-height: 16px; gap: 6px; }
    .pk-dialog.bare .pk-card-name { font-size: 12px; }
    .pk-dialog.bare .pk-boxes { gap: 6px; }
    .pk-dialog.bare .pk-box { padding: 6px 8px 8px; }
    .pk-dialog.bare .pk-sec-body { padding: 8px; }
    .pk-dialog.bare .pk-band-body { gap: 8px; }
    .pk-card {
      position: relative; z-index: 1; display: flex; flex-direction: column; min-width: 0;
      padding: 12px; border-radius: 12px; border: 1px solid var(--wa-line); background: var(--wa-card);
    }
    /* The card with the "Devices" menu open climbs over its neighbours,
       since the menu is absolute inside it and the grid would otherwise clip
       it under the next card along. */
    .pk-card.over { z-index: 3; }
    .pk-card[aria-current="true"] { border-color: var(--wa-accent); box-shadow: 0 0 0 3px var(--wa-sel-ring); }
    /* Hidden designs stay in the grid, quieter. They used to fold away under a
       "Hidden (3)" heading, which is a second list to remember in a surface
       whose whole point is that there is one. */
    .pk-card.dim { opacity: .72; }
    /* A design on the shelf is on no device, and its card says so twice: a
       dashed border here and a dashed case in the drawing. */
    .pk-card.shelved { border-style: dashed; border-color: var(--wa-line-strong); }
    /* A card being picked: the hover actions stand down, and the picked one
       wears the same ring the open one does so the two read alike. */
    .pk-card-acts.away { display: none; }
    .pk-card.picking { cursor: pointer; }
    .pk-card.picked { border-color: var(--wa-accent); box-shadow: 0 0 0 3px var(--wa-sel-ring); }
    .pk-card-pick { flex: none; margin: 0; accent-color: var(--wa-accent); }
    /* Every other checkbox in the panel is a switch, because every other one
       turns a setting on. These do not: they say which of thirty cards this
       act is about, and a row of sliding pills reads as thirty settings. A
       tick box is what "this one, and this one" looks like, so the picker's
       own boxes take their switch back off. */
    input.pk-card-pick, input.pk-box-pick {
      width: 17px; height: 17px; border-radius: 5px;
      background: color-mix(in srgb, var(--wa-ink) 8%, transparent);
      box-shadow: inset 0 0 0 1.5px var(--wa-line-strong);
    }
    input.pk-card-pick::after, input.pk-box-pick::after {
      top: 2px; left: 6px; width: 4px; height: 8.5px; border-radius: 0;
      background: none; box-shadow: none; opacity: 0;
      border: solid var(--wa-primary-ink, #fff); border-width: 0 2px 2px 0;
      transform: rotate(45deg); transition: opacity .1s ease-out;
    }
    input.pk-card-pick:checked, input.pk-box-pick:checked {
      background: var(--wa-accent); box-shadow: inset 0 0 0 1.5px var(--wa-accent);
    }
    input.pk-card-pick:checked::after, input.pk-box-pick:checked::after { opacity: 1; transform: rotate(45deg); }
    input.pk-card-pick:indeterminate, input.pk-box-pick:indeterminate {
      background: color-mix(in srgb, var(--wa-accent) 35%, transparent);
      box-shadow: inset 0 0 0 1.5px var(--wa-accent);
    }
    input.pk-card-pick:hover:not(:disabled), input.pk-box-pick:hover:not(:disabled) {
      box-shadow: inset 0 0 0 1.5px var(--wa-accent);
    }
    /* The bar over the grid while cards are picked, under the tabs. It was
       under the grid, which on a long list is a screen and a half from the
       card being ticked: the acts belong where the eye already is. Its own
       strip, so Import and New never move when picking is turned on. */
    .pk-bar {
      display: flex; align-items: center; flex-wrap: wrap; gap: 8px; flex: none;
      padding: 8px 18px; border-bottom: 1px solid var(--wa-line); background: var(--wa-card);
    }
    .pk-bar-count { font-size: 12px; color: var(--wa-muted); min-width: 90px; }
    .pk-bar-ask { font-size: 12px; color: var(--wa-ink); }
    .pk-bar-gap { flex: 1; min-width: 0; }
    /* The acts wear a border and a fill here rather than the quiet ghost
       they wear over a card. The bar is a row of six words on a strip of its
       own: without an edge each one read as a label, and the row as a
       sentence. */
    .pk-bar .ghost {
      min-height: 28px; padding: 0 10px;
      border-color: var(--wa-line); background: var(--wa-panel); color: var(--wa-ink);
    }
    .pk-bar .ghost:hover:not(:disabled) { border-color: var(--wa-line-strong); background: var(--wa-card); }
    .pk-bar .ghost.danger {
      color: var(--error-color, #b42318);
      border-color: color-mix(in srgb, var(--error-color, #b42318) 45%, var(--wa-line));
      background: color-mix(in srgb, var(--error-color, #b42318) 10%, var(--wa-panel));
    }
    .pk-bar .ghost.danger:hover:not(:disabled) {
      background: color-mix(in srgb, var(--error-color, #b42318) 18%, var(--wa-panel));
    }
    .pk-bar .ghost svg { width: 14px; height: 14px; color: var(--wa-muted); }
    .pk-bar .ghost.danger svg { color: inherit; }
    /* "Put on…" opens downwards, over the grid: the bar is at the top of the
       dialog, so a menu hung above it would be off the end of the surface. */
    .pk-bar-menu { position: relative; display: inline-flex; }
    .pk-bar-list {
      position: absolute; top: calc(100% + 6px); right: 0; z-index: 6; min-width: 190px;
      display: flex; flex-direction: column; gap: 2px; padding: 6px;
      border: 1px solid var(--wa-line); border-radius: 10px; background: var(--wa-card); box-shadow: 0 10px 30px rgba(0,0,0,.35);
    }
    .pk-bar-row {
      display: flex; align-items: center; gap: 8px; width: 100%; padding: 6px 8px; border: 0; border-radius: 7px;
      font: inherit; font-size: 12.5px; color: var(--wa-ink); background: transparent; cursor: pointer; text-align: left;
    }
    .pk-bar-row:hover { background: color-mix(in srgb, var(--wa-ink) 9%, transparent); }
    .pk-bar-row svg { width: 15px; height: 15px; flex: none; color: var(--wa-muted); }
    /* The one filled button on the bar: every other act is one of several
       things to do to a pick, and this is the way back out of the mode. */
    .pk-bar-done { display: inline-flex; align-items: center; gap: 6px; flex: none; margin-left: 4px; }
    .pk-bar-done svg { width: 14px; height: 14px; }
    .pk-pick-btn {
      display: inline-flex; align-items: center; gap: 6px; flex: none; font: inherit; font-size: 12.5px;
      padding: 6px 10px; border-radius: var(--wa-r-md); border: 1px solid var(--wa-line);
      background: var(--wa-panel); color: var(--wa-ink); cursor: pointer;
    }
    .pk-pick-btn svg { width: 14px; height: 14px; }
    .pk-pick-btn.on { border-color: var(--wa-accent); color: var(--wa-accent); }
    /* Two ways of drawing a card, both on the head with the one in use lit.
       A single button that swapped its own label made the reader work out
       whether the word on it was the state or the offer; a pair says which
       it is on and what the other one would be, and is one press either way. */
    .pk-seg {
      display: inline-flex; flex: none; gap: 2px; padding: 2px;
      border: 1px solid var(--wa-line); border-radius: var(--wa-r-md); background: var(--wa-panel);
    }
    .pk-seg-btn {
      display: inline-flex; align-items: center; gap: 6px; font: inherit; font-size: 12.5px;
      padding: 4px 9px; border: 0; border-radius: calc(var(--wa-r-md) - 3px);
      background: transparent; color: var(--wa-muted); cursor: pointer;
      transition: background .12s ease, color .12s ease;
    }
    .pk-seg-btn svg { width: 14px; height: 14px; }
    .pk-seg-btn:hover { color: var(--wa-ink); }
    .pk-seg-btn.on { background: color-mix(in srgb, var(--wa-accent) 18%, var(--wa-card)); color: var(--wa-ink); }
    .pk-seg-btn:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .pk-tag {
      flex: none; font-size: 10px; color: var(--wa-muted); cursor: help;
      border: 1px solid var(--wa-line); border-radius: 6px; padding: 1px 6px;
    }
    /* The picture is the card's button: one click on what you are looking at
       opens it. */
    .pk-card-open {
      display: block; width: 100%; font: inherit; color: inherit;
      background: transparent; border: 0; padding: 0; cursor: pointer;
    }
    .pk-card-open:focus-visible { outline: none; box-shadow: var(--wa-ring); border-radius: 10px; }
    /* The complication where it sits on its device, cropped to the slot. One
       fixed height on every card, so a grid of them sits on one baseline
       whatever mix of shapes the home holds. Black, because a watch face is
       black and a white plate reads as a piece of paper; the hairline ring is
       what keeps it from disappearing into the dark skin. */
    .pk-card-crop {
      display: flex; align-items: center; justify-content: center; overflow: hidden;
      aspect-ratio: 86 / 48; border-radius: 10px; background: #000; box-shadow: inset 0 0 0 1px rgba(255,255,255,.1);
    }
    /* In the Shape view the well is the shape rather than a window onto a
       device, so each card sets its own aspect ratio inline. The one here
       is only the fallback for a control and for a shape whose device has no
       slot for it, both of which keep their device picture. */
    .pk-card-crop.bare { border-radius: 8px; }
    .pk-card-crop > svg.pk-crop { display: block; width: 100%; height: 100%; }
    /* A design that is only a Control Center control has its tile as the whole
       picture: it sits on neither screen, so there is no device to crop. The
       real tile is the editor's own laid-out box, so it keeps the size it was
       drawn at and is centred with the well's own room round it. Nothing here
       may size the glyph inside it: a rule that set every svg in the tile to
       the tile's height blew the symbol up to fill the pill, and the pill,
       which clips, cut its own rounded ends off. */
    .pk-card-crop .pk-card-ctl {
      display: flex; align-items: center; justify-content: center;
      max-width: 100%; max-height: 100%; padding: 8px;
    }
    .pk-card-crop.none { font-size: 11.5px; color: var(--wa-muted); }
    /* The name over the picture, the shape under it. The name is what a card
       is looked up by, so it reads first, on the line the eye starts on
       rather than under a picture it has to be found beneath. Both rows are
       one line, cut with an ellipsis rather than wrapped, so every card in
       the grid is the same height. */
    .pk-card-top { display: flex; align-items: center; gap: 7px; min-height: 18px; margin-bottom: 9px; min-width: 0; }
    /* The picture and the buttons that sit over it. Its own box, so the
       actions are in the picture's corner rather than over the name. */
    .pk-card-pic { position: relative; min-width: 0; }
    .pk-card-name {
      flex: 1; min-width: 0; text-align: left; font: inherit; font-size: 13px; font-weight: 700;
      color: inherit; background: transparent; border: 0; padding: 0; cursor: pointer;
      overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    }
    .pk-card-name:focus-visible { outline: none; box-shadow: var(--wa-ring); border-radius: 6px; }
    /* Devices: the one control on this surface that writes anything. */
    .pk-dup { position: relative; flex: none; }
    .pk-dup-open {
      display: inline-flex; align-items: center; gap: 4px; font: inherit; font-size: 11px; font-weight: 600;
      padding: 3px 7px; border-radius: 7px; cursor: pointer; color: var(--wa-ink);
      border: 1px solid var(--wa-line); background: var(--wa-card);
    }
    .pk-dup-open:hover:not(:disabled) { border-color: var(--wa-line-strong); }
    .pk-dup-open:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .pk-dup-open:disabled { opacity: .45; cursor: not-allowed; }
    .pk-dup-open.on { border-color: var(--wa-accent); background: var(--wa-sel-bg); color: var(--wa-accent); }
    .pk-dup-open svg { width: 10px; height: 10px; }
    .pk-dup-menu {
      position: absolute; top: 40px; left: 0; right: 0; z-index: 5;
      display: flex; flex-direction: column; gap: 4px; padding: 8px;
      border: 1px solid var(--wa-line-strong); border-radius: 10px;
      background: var(--wa-card); box-shadow: var(--wa-shadow-pop);
    }
    .pk-dup-row {
      display: flex; align-items: center; gap: 7px; width: 100%; text-align: left; cursor: pointer;
      font: inherit; font-size: 12px; color: var(--wa-ink);
      padding: 5px 7px; border: 1px solid var(--wa-line); border-radius: 7px; background: var(--wa-card);
    }
    .pk-dup-row:hover:not([disabled]) { border-color: var(--wa-line-strong); }
    .pk-dup-row:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .pk-dup-row[disabled] { opacity: .5; cursor: default; }
    .pk-dup-row svg { flex: none; width: 14px; height: 14px; }
    /* A device row is a box to tick: the whole row is its label, so the name
       and the glyph are as clickable as the box. */
    /* A device row: the switch, glyph and name are one label, so the name is
       as clickable as the switch; the eye beside them is that device's own
       Hide and never flips the switch. The switch is the panel's, at the size
       the switch already is. */
    .pk-dup-row.check { padding: 0; gap: 0; cursor: default; }
    .pk-dup-pick { flex: 1; min-width: 0; display: flex; align-items: center; gap: 7px; padding: 5px 7px; cursor: pointer; }
    .pk-dup-pick svg { flex: none; width: 14px; height: 14px; }
    .pk-dup-row.check input { margin: 0; cursor: inherit; }
    .pk-dup-row.check.off .pk-dup-pick { opacity: .5; cursor: default; }
    .pk-dup-row.check:hover:not(.off) { border-color: var(--wa-line-strong); }
    .pk-dup-eye {
      flex: none; width: 24px; height: 24px; margin-right: 3px; display: inline-flex; align-items: center; justify-content: center;
      border: 0; border-radius: 6px; background: transparent; color: var(--wa-muted); cursor: pointer;
    }
    .pk-dup-eye:hover:not(:disabled) { background: var(--wa-sel-bg); color: var(--wa-ink); }
    .pk-dup-eye:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .pk-dup-eye:disabled { opacity: .45; cursor: default; }
    .pk-dup-eye.hid { color: var(--wa-accent); }
    .pk-dup-eye svg { width: 14px; height: 14px; }
    /* The row that is not a device sits under the ones that are: it opens the
       dialog where a shape is picked. */
    .pk-dup-row.other { margin-top: 4px; }
    .pk-dup-head { font-size: 11.5px; font-weight: 700; color: var(--wa-muted); margin: 2px 0; }
    .pk-dup-name { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .pk-dup-full { flex: none; font-size: 10px; color: var(--wa-muted); }
    .pk-dup-note { font-size: 10px; line-height: 1.4; color: var(--wa-muted); border-top: 1px solid var(--wa-line); padding-top: 6px; }
    /* The menu stays open across several boxes, so it has its own way out.
       Clicking anywhere else, or Escape, shuts it too. */
    .pk-dup-done {
      align-self: flex-end; margin-top: 2px; font: inherit; font-size: 11px; font-weight: 600;
      padding: 4px 12px; border-radius: 7px; cursor: pointer;
      border: 1px solid var(--wa-accent); background: var(--wa-sel-bg); color: var(--wa-accent);
    }
    .pk-dup-done:hover { filter: brightness(1.1); }
    .pk-dup-done:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    /* Duplicate, hide and delete, in the picture's own top corner. Only on
       hover, or while the keyboard is in the card, or while a menu or a
       confirm is open: a wall of cards with three buttons on every one of
       them is a wall of buttons. Over the picture rather than over the card,
       so they never sit on top of the name. */
    .pk-card-acts {
      position: absolute; right: 8px; top: 8px; display: flex; align-items: center; gap: 3px;
      opacity: 0; transition: opacity .12s ease-out;
    }
    .pk-card:hover .pk-card-acts, .pk-card:focus-within .pk-card-acts,
    .pk-card.over .pk-card-acts, .pk-card-acts.asking { opacity: 1; }
    /* A touch screen has no hover, so there is no way to bring these out:
       they stay. */
    @media (hover: none) { .pk-card-acts { opacity: 1; } }
    .pk-card-acts button.icon { width: 26px; height: 26px; background: var(--wa-card); }
    .pk-card-acts button.small { min-height: 24px; padding: 0 7px; background: var(--wa-card); }
    .pk-card .pk-note { font-size: 11.5px; line-height: 1.4; color: var(--wa-muted); margin-top: 8px; }
    .pk-card .pk-badge { flex: none; font-size: 11px; color: var(--wa-muted); white-space: nowrap; }
    .pk-foot {
      display: flex; align-items: center; gap: 10px; flex: none; padding: 12px 18px;
      border-top: 1px solid var(--wa-line); background: var(--wa-card);
    }
    .pk-foot-hint { flex: 1; min-width: 0; font-size: 12px; color: var(--wa-muted); }
    /* What the last write said, in the hint's place: the panel's own banner
       is behind the backdrop while this dialog is up. */
    .pk-foot-said { flex: 1; min-width: 0; font-size: 12px; font-weight: 500; color: var(--wa-ink); }
    .pk-foot-said.err { color: var(--error-color, #db4437); }

    /* New complication: its own button beside the list, because making one was
       a row buried under every complication that already existed. */
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
    .restore-list { margin: 0; padding: 0 0 0 18px; max-height: 280px; overflow: auto; font-size: 13px; line-height: 1.6; }
    .restore-list .restore-from { color: var(--wa-muted); font-size: 12px; }
    .restore-list li.err .restore-from { color: var(--error-color, #db4437); }

    /* The New complication dialog: three numbered steps and Create. In the
       middle of the window rather than hanging off the button, because it asks
       three questions and refuses until all three are answered. */
    dialog.new-dialog {
      width: min(720px, calc(100vw - 32px)); padding: 0;
      border: 1px solid var(--wa-line); border-radius: 12px;
      background: var(--wa-card); color: var(--wa-ink);
      box-shadow: 0 12px 40px rgba(0,0,0,.4);
    }
    dialog.new-dialog::backdrop { background: rgba(0,0,0,.45); }
    .new-head { display: flex; align-items: center; gap: 8px; padding: 12px 12px 12px 18px; border-bottom: 1px solid var(--wa-line); }
    .new-head h2 { margin: 0; font-size: 15px; font-weight: 500; }
    .new-head .spacer { flex: 1; }
    /* What the dialog is about to ask, beside its title: three steps named
       before the first one is answered. */
    .new-head-note { font-size: 11.5px; color: var(--wa-muted); }
    /* The three steps, stacked, with the body scrolling rather than the window:
       a home with four devices has four sections of shapes and two boxes of
       people under them. */
    .new-body { padding: 14px 18px; display: flex; flex-direction: column; gap: 10px; max-height: min(88vh, 960px); overflow-y: auto; }
    /* One tinted container per step, each a different token so the three read
       as an order rather than as three of the same box. Mixed into the card
       rather than written as a color, so dark mode follows. */
    .new-step {
      display: flex; flex-direction: column; gap: 9px; padding: 12px 14px;
      border-radius: var(--wa-r-md); border: 1px solid var(--wa-line);
      transition: opacity .14s ease-out;
    }
    .new-step.step-name {
      background: color-mix(in srgb, var(--wa-accent) 12%, var(--wa-card));
      border-color: color-mix(in srgb, var(--wa-accent) 32%, var(--wa-line));
    }
    .new-step.step-shapes {
      background: color-mix(in srgb, var(--success-color, #3dd68c) 12%, var(--wa-card));
      border-color: color-mix(in srgb, var(--success-color, #3dd68c) 32%, var(--wa-line));
    }
    .new-step.step-people {
      background: color-mix(in srgb, var(--warning-color, #e0a100) 12%, var(--wa-card));
      border-color: color-mix(in srgb, var(--warning-color, #e0a100) 32%, var(--wa-line));
    }
    /* A step whose answer would be thrown away: the name is what every other
       question is about, so until it is typed the rest waits rather than
       collecting picks Create will refuse. */
    .new-step.waiting { opacity: .45; pointer-events: none; }
    .new-step-head { display: flex; align-items: baseline; gap: 9px; flex-wrap: wrap; }
    .new-step-num {
      flex: none; width: 21px; height: 21px; align-self: center; border-radius: 50%;
      display: inline-flex; align-items: center; justify-content: center;
      font-size: 11.5px; font-weight: 700; color: var(--wa-accent-ink); background: var(--wa-accent);
    }
    .step-kind .new-step-num { background: var(--info-color, #39a9db); }
    .step-shapes .new-step-num { background: var(--success-color, #3dd68c); }
    .step-people .new-step-num { background: var(--warning-color, #e0a100); }
    .new-step-title { font-size: 13px; font-weight: 700; color: var(--wa-ink); }
    .new-step-hint { font-size: 11.5px; line-height: 1.35; color: var(--wa-muted); }
    .new-name { font-size: 14px; }
    /* The sections flow, each as wide as its own cards and no taller: a grid
       of equal cells gave a one-card section the height of the four-card one
       beside it, and the whole dialog scrolled for the empty space. Wrapped
       and top-aligned, all three steps fit a laptop screen at once. */
    .new-step .shape-rows { display: flex; flex-flow: row wrap; align-items: flex-start; gap: 10px; }
    .new-step .shape-row { flex: 0 1 auto; }
    /* A white card per section on the step's tint, so the sections are the
       shapes and the tint is the step. */
    .new-step .shape-row {
      padding: 10px; border-radius: 10px; border: 1px solid var(--wa-line); background: var(--wa-card);
    }
    /* The running line sits opposite the buttons, so what is still missing, or
       what Create is about to make, is readable without hovering the button
       that refuses to be pressed. */
    .new-foot { display: flex; align-items: center; justify-content: flex-end; gap: 8px; padding: 12px 18px 14px; border-top: 1px solid var(--wa-line); }
    .new-count { flex: 1; font-size: 12.5px; color: var(--wa-muted); }
    /* Wrapping rather than a grid of equal columns: every card is the same
       fixed width now that each one carries a 48 px drawing, so a section with
       one shape in it draws one card rather than one card stretched across the
       row. */
    .shape-cards { display: flex; flex-wrap: wrap; gap: 8px; }
    /* The shape groups, stacked: one for a watch face, two for an iPhone
       because its Lock Screen and its Home Screen are different places to put
       a thing. */
    .shape-rows { display: flex; flex-direction: column; gap: 12px; }
    .shape-row { display: flex; flex-direction: column; gap: 7px; }
    .shape-row-head { display: flex; align-items: center; gap: 6px; }
    /* The device kinds this section is drawn on, before its name: the icons
       say "watch and iPhone" faster than the heading does. */
    .shape-row-kinds { display: flex; align-items: center; gap: 3px; color: var(--wa-muted); }
    .shape-row-kinds svg { width: 14px; height: 14px; }
    .shape-row-title { font-size: 11.5px; font-weight: 600; color: var(--wa-ink); }
    /* The device outline a shape is drawn in, which is the kind picked in
       step 2: a watch face for a watch, a phone screen for an iPhone. */
    .shape-arts { display: flex; align-items: center; justify-content: center; gap: 4px; }
    /* Step 2's three choices, drawn as the shape cards are so the dialog
       reads as one row of pictures after another. Wider, because each one
       carries a line saying what that device is. */
    .kind-cards { display: flex; flex-wrap: wrap; gap: 8px; }
    .kind-card {
      position: relative; display: flex; flex-direction: column; align-items: center; gap: 4px; cursor: pointer;
      width: 132px; box-sizing: border-box; text-align: center;
      font: inherit; font-size: 12px; padding: 10px 8px 8px; color: var(--wa-muted);
      border: 1px solid var(--wa-line); border-radius: 10px; background: var(--wa-raised);
      transition: border-color .12s ease-out, background-color .12s ease-out, color .12s ease-out;
    }
    .kind-card:hover { border-color: var(--wa-line-strong); color: var(--wa-ink); }
    .kind-card:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .kind-card.on { border-color: var(--wa-accent); background: var(--wa-sel-bg); box-shadow: 0 0 0 2px var(--wa-sel-ring); color: var(--wa-ink); }
    .kind-card.on .shape-arts { color: var(--wa-accent); }
    /* Who shows it: a box per person, their devices as checkboxes inside. A
       flat list of four devices reads "Apple Watch, Apple Watch, iPhone,
       iPhone", which answers nothing. */
    .people-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: 8px; }
    /* Unassigned stands above the people rather than inside one of their
       boxes: it belongs to nobody, and it is the answer the step opens on. */
    .unassigned-row {
      display: flex; padding: 8px; margin-bottom: 8px;
      border-radius: 11px; background: var(--wa-panel); box-shadow: inset 0 0 0 1px var(--wa-line);
    }
    .unassigned-row .dev-tick { flex: 1; }
    .person-box {
      display: flex; flex-direction: column; gap: 4px; padding: 8px;
      border-radius: 11px; background: var(--wa-panel); box-shadow: inset 0 0 0 1px var(--wa-line);
    }
    .person-name { font-size: 12px; font-weight: 700; color: var(--wa-ink); padding: 0 2px 2px; }
    .dev-tick {
      display: flex; align-items: center; gap: 7px; cursor: pointer; text-align: left;
      font: inherit; font-size: 12.5px; padding: 6px 8px; color: var(--wa-muted);
      border: 1px solid transparent; border-radius: 9px; background: var(--wa-raised);
      transition: border-color .12s ease-out, color .12s ease-out;
    }
    .dev-tick:hover:not([disabled]) { border-color: var(--wa-line-strong); color: var(--wa-ink); }
    .dev-tick:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .dev-tick.on { border-color: var(--wa-accent); color: var(--wa-ink); }
    .dev-tick[disabled] { opacity: .5; cursor: default; }
    /* The tick sits in the row rather than in a corner of a card here, so it
       reads as a checkbox and the name beside it as its label. */
    .dev-tick .pick-tick { position: static; flex: none; }
    .dev-tick .dev-card-name { font-weight: 600; }
    /* Not one of them starts picked. A tinted default reads as a
       recommendation, and the shape is the one thing about a complication
       that cannot be changed later without moving every layer. */
    .shape-card {
      position: relative; display: flex; flex-direction: column; align-items: center; gap: 4px; cursor: pointer;
      width: 80px; box-sizing: border-box;
      /* Room above the art for the tick, which otherwise sits on the drawing
         when a card draws two devices side by side. */
      font: inherit; font-size: 11px; padding: 22px 4px 6px; color: var(--wa-muted);
      border: 1px solid var(--wa-line); border-radius: 10px; background: var(--wa-raised);
      transition: border-color .12s ease-out, background-color .12s ease-out, color .12s ease-out;
    }
    .shape-card:hover:not([disabled]) { border-color: var(--wa-line-strong); color: var(--wa-ink); }
    .shape-card:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .shape-card.on { border-color: var(--wa-accent); background: var(--wa-sel-bg); box-shadow: 0 0 0 2px var(--wa-sel-ring); color: var(--wa-ink); }
    /* A drawing big enough to be read at a glance, two of them side by side on
       a card this wide. The box is narrower than the 32 by 28 viewBox because
       the art crops its empty margins (preserveAspectRatio, in shapeArt.ts)
       rather than letterboxing itself to fit. */
    .shape-card .shape-art, .kind-card .shape-art { width: 30px; height: 40px; display: block; flex: none; }
    /* The drawing's two colors: the shape takes the button's own, the device
       around it stays furniture whatever the button is doing. */
    .shape-arts { height: 40px; --wa-shape-outline: var(--wa-muted); }
    /* Lit means the accent: this is the shape that was picked. */
    .shape-card.on .shape-arts { color: var(--wa-accent); }
    /* The tick on a picked card, and the empty ring that holds its place so
       nothing shifts when one is ticked. */
    .pick-tick {
      position: absolute; top: 4px; right: 4px; width: 15px; height: 15px; box-sizing: border-box;
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
    .xf-label { font-size: 12.5px; color: var(--wa-muted); font-weight: 600; display: flex; align-items: center; gap: 8px; }
    .xf-label .r { margin-left: auto; font-weight: 500; }
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
    .layout.bare { grid-template-columns: minmax(0, 1fr); overflow: auto; }
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
    /* Stacked, the three columns become one page, and the page is read top to
       bottom rather than left to right. In column order that page opened with
       Add a layer, and the face the whole editor is about came 1730px down,
       past Pages, past every layer row: two and a half phone screens of
       scrolling before you could see what you were drawing. Reported by a
       user on Discord, "Layout on mobile", 2026-09-20.
       The order here is the order of the question being asked: what am I
       drawing and where does it land, what does the thing I just picked do,
       and only then the lists that feed it. */
    .layout.cols-1 > .column.canvas { order: 1; }
    .layout.cols-1 > .column.inspector { order: 2; }
    .layout.cols-1 > .column.left { order: 3; }
    .layout.cols-1 .column.left > .pages-card { order: 1; }
    .layout.cols-1 .column.left > .layers-card { order: 2; }
    /* The two rows between the header and the face each wrapped to a second
       line on a phone, for 47px of nothing. The name goes because the header
       already carries it, in bigger type, 120px above; the device chip keeps
       its line and ellipses instead. */
    .layout.cols-1 .bar-row.doc-row { flex-wrap: nowrap; }
    .layout.cols-1 .doc-row .doc-name { display: none; }
    .layout.cols-1 .doc-row .doc-shape { flex: 0 1 auto; min-width: 0; }
    .layout.cols-1 .doc-row .doc-shape .paren { display: none; }
    .layout.cols-1 .bar-row.doc-places { flex-wrap: nowrap; }
    .layout.cols-1 .doc-places .doc-on { flex: 0 1 auto; min-width: 0; flex-wrap: nowrap; }
    .layout.cols-1 .doc-places .doc-chip { min-width: 0; }
    .layout.cols-1 .doc-places .doc-chip-name { min-width: 0; overflow: hidden; text-overflow: ellipsis; }
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
    /* The left column does not scroll: the Pages card keeps its one line and
       the Layers card takes the rest, scrolling its own rows. The Background
       row follows the last layer, and stays in sight once the rows scroll. */
    .column.left { display: flex; flex-direction: column; gap: 10px; overflow: hidden; }
    .column.left .card { flex: none; }
    /* A basis of 0 rather than auto: with auto the rows of a long design
       count as the card's size. The third is a floor, not a share. */
    .column.left .card.layers-card {
      flex: 1 1 0; min-height: 33%; display: flex; flex-direction: column; padding: 0;
      --thumb-w: ${THUMB_W}px; --thumb-h: ${THUMB_H}px;
      container: layers / inline-size;
    }
    /* Card titles read as titles: sentence case, a little heavier, the ink
       color. Their side notes stay small and muted. */
    .panel-title {
      display: flex; align-items: center; gap: 8px; margin: 0 0 10px; min-height: 30px;
      font-size: 13.5px; font-weight: 700; letter-spacing: 0; color: var(--wa-ink);
    }
    .panel-title .spacer { flex: 1; }
    .panel-title .mini { font-weight: 500; font-size: 12px; color: var(--wa-muted); letter-spacing: 0; }
    .panel-title button.small { font-weight: 600; letter-spacing: 0; }


    /* Layers: one row per layer, colored by kind, the shape pinned last.
       The picture size is a variable on the list, set by the S/M/L control in
       the card's title bar, so one change resizes every row's picture and the
       column that holds it. */
    /* Only as tall as its rows, so the shape row sits right under the last
       layer; it shrinks and scrolls once the card runs out of room. */
    .layers {
      display: flex; flex-direction: column; gap: 4px; flex: 0 1 auto; min-height: 0;
      overflow-y: auto; overflow-x: hidden; scrollbar-width: thin;
    }
    /* Every row is its own box: a ground and a hairline edge. Rows with no
       outline ran together, and a list of twenty with pictures in them read as
       one field of text where the eye had to find each row's start for itself.
       The selection still speaks louder, because its wash and its ring both
       land on top of these. */
    .layer {
      display: grid; grid-template-columns: 16px 3px var(--thumb-w) minmax(0, 1fr) auto; align-items: center; gap: 8px;
      min-height: 46px; padding: 0 6px 0 4px; border-radius: var(--wa-r-sm);
      /* The list is a scrolling flex column: without this, expanded rows
         shrink to their minimum and their lines pile on top of each other. */
      flex: none;
      border: 0 solid transparent; background-clip: padding-box;
      background: color-mix(in srgb, var(--wa-panel) 60%, var(--wa-card));
      box-shadow: inset 0 0 0 1px var(--wa-line);
      cursor: pointer; user-select: none; position: relative; font-size: 13px;
      transition: background-color .12s ease-out, box-shadow .12s ease-out,
        border-top-width .1s ease-out, border-bottom-width .1s ease-out;
    }
    /* A group's members sit a shade quieter than the rows above them, so they
       read as nested rather than as another run of top-level rows. */
    .layer.kid { background: color-mix(in srgb, var(--wa-panel) 30%, var(--wa-card)); }
    .layer:hover { background: var(--wa-panel); box-shadow: inset 0 0 0 1px var(--wa-line-strong); }
    /* The selected row: one cool wash and a ring, the same one wherever a row
       is selected, so eight kind colors never fight the selection. */
    .layer.hl { background: var(--wa-sel-bg); box-shadow: inset 0 0 0 1px var(--wa-sel-ring); }
    .layer:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .layer.pick { box-shadow: inset 0 0 0 2px var(--wa-accent); }
    .layer.lit { background: var(--wa-sel-bg); box-shadow: inset 0 0 0 2px var(--wa-accent); }
    /* A member of the selected group: lit in the folder's color, without
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
    /* The whole-complication tap row draws nothing, so it keeps the column the
       other rows line up on and shows no black tile where a picture would be. */
    .layer .thumb.blank { background: none; }
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
    /* The right end of a row holds one thing at a time: the badges at rest,
       the buttons under the pointer or on the selected row. They trade places
       rather than stand side by side, so the badges keep the right edge and
       the row keeps its width.

       The :has(.acts) guard is what keeps the swap honest. A pinned row and a
       read-only document carry badges and no buttons, and without it hovering
       one hid the badge and put nothing in its place. */
    .layer .acts { display: none; gap: 0; }
    .layer:hover .acts, .layer.hl .acts, .layer:focus-within .acts { display: inline-flex; }
    .layer:hover:has(.acts) .badges,
    .layer.hl:has(.acts) .badges,
    .layer:focus-within:has(.acts) .badges { display: none; }
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
      flex: none; margin: 0; padding: 0 12px 0 10px; min-height: 46px; border-radius: 0;
      border-top: 1px solid var(--wa-line);
    }
    /* The row that is not a layer: Background, the shape under everything and
       what a tap anywhere else does. It cannot be dragged, grouped or
       deleted, so it sits in a tray of its own below one hairline, full-bleed
       to the card's edges, a shade darker than the rows above so the list
       reads as the part you can actually reorder. */
    .pinned-set {
      flex: none; margin: 6px 0 0; border-top: 1px solid var(--wa-line-strong);
      background: color-mix(in srgb, var(--wa-ink) 5%, transparent);
    }
    /* The tray's rows keep the tray's own ground and its hairlines. An outline
       each would box in two rows that are not part of the stack above. */
    .pinned-set .layer.pinned { margin: 0; border-top: 0; }
    /* Inline has no stack above its rows, so they sit at the foot of the card,
       where a canvas shape's own rows end up. */
    .inline-layers .pinned-set { margin-top: auto; }
    .pinned-set .layer.pinned:not(.hl):not(.lit):not(.pick) { background: transparent; box-shadow: none; }
    .pinned-set .layer.pinned:not(.hl):not(.lit):not(.pick):hover {
      background: color-mix(in srgb, var(--wa-ink) 5%, transparent); box-shadow: none;
    }
    .pinned-set .layer.pinned + .layer.pinned {
      border-top: 1px solid color-mix(in srgb, var(--wa-line) 70%, transparent);
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
    /* Left column cards: Pages and Layers. One 40px header line each, plain
       card color, no band and no tint of their own; the one filled button is
       + Add. */
    .card.lc { padding: 0; border-radius: var(--wa-lc-r); }
    .lc-head {
      display: flex; align-items: center; flex-wrap: wrap; gap: 6px 8px; min-height: 40px; padding: 6px 8px 6px 12px;
    }
    .layers-card .lc-head { border-bottom: 1px solid var(--wa-line); }
    .lc-head .spacer { flex: 1; }
    .lc-title { font-size: 13px; font-weight: 600; color: var(--wa-ink); }
    .lc-sub { font-size: 11px; font-weight: 400; color: var(--wa-muted); white-space: nowrap; }
    .lc-sub b { color: var(--wa-ink); font-weight: 600; }
    /* The Pages line never wraps: the page buttons, + and ··· keep their row
       and the note beside the title gives way first. */
    .pages-card .lc-head { flex-wrap: nowrap; }
    .pages-card .lc-title { flex: none; }
    .pages-card .lc-sub { min-width: 0; overflow: hidden; text-overflow: ellipsis; }
    .pages-card .lc-head .spacer { min-width: 0; }
    button.lc-btn, button.lc-ghost {
      font: inherit; font-size: 11.5px; font-weight: 600; line-height: 1; cursor: pointer; flex: none; white-space: nowrap;
      display: inline-flex; align-items: center; gap: 5px; height: 26px; padding: 0 9px; border-radius: 7px;
      border: 1px solid var(--wa-line); background: var(--wa-panel); color: var(--wa-ink);
    }
    button.lc-btn svg.ui-icon, button.lc-ghost svg.ui-icon { width: 13px; height: 13px; }
    button.lc-btn.pri { background: var(--wa-accent); border-color: transparent; color: var(--wa-accent-ink); }
    button.lc-btn.pri:hover:not(:disabled) { filter: brightness(1.08); }
    button.lc-ghost { background: transparent; border-color: transparent; color: var(--wa-muted); padding: 0 7px; letter-spacing: .04em; }
    button.lc-ghost.sm { height: 24px; font-size: 11px; }
    button.lc-btn:hover:not(:disabled):not(.pri), button.lc-ghost:hover:not(:disabled) { background: var(--wa-panel); color: var(--wa-ink); border-color: var(--wa-line); }
    button.lc-ghost[aria-pressed="true"], button.lc-ghost[aria-expanded="true"] { color: var(--wa-ink); background: var(--wa-panel); }
    button.lc-btn:focus-visible, button.lc-ghost:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    button.lc-btn:disabled, button.lc-ghost:disabled { opacity: .45; cursor: default; }
    /* The page picker: one segmented control, the showing page raised. */
    .page-seg {
      display: inline-flex; flex: none; height: 26px; padding: 2px; gap: 2px; border-radius: 7px;
      background: var(--wa-input); box-shadow: inset 0 0 0 1px var(--wa-line);
    }
    .page-seg button {
      font: inherit; font-size: 11.5px; font-weight: 600; min-width: 24px; padding: 0 6px; border: 0; border-radius: 5px;
      background: transparent; color: var(--wa-muted); cursor: pointer;
    }
    .page-seg button:hover:not(.on) { color: var(--wa-ink); }
    .page-seg button.on { background: var(--wa-seg-on); color: var(--wa-ink); box-shadow: 0 1px 2px rgba(0,0,0,.18); }
    .page-seg button:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    /* The one line under the Pages header while nothing can turn a page. */
    .lc-note { display: flex; align-items: center; gap: 6px; margin: 0 10px 8px; padding: 5px 10px; border-radius: 7px; font-size: 11.5px; }
    .lc-note.warn { color: var(--wa-amber); background: var(--wa-amber-bg); box-shadow: inset 0 0 0 1px var(--wa-amber-line); }
    .lc-note button.link { margin-left: auto; font-weight: 700; color: inherit; text-decoration: underline; }
    .pages-card .page-tour-bar { margin: 0 12px 10px; }
    /* The Layers card's filter line, and the rows under it. */
    .lc-filter { display: flex; align-items: center; gap: 6px; min-height: 32px; padding: 3px 8px 3px 12px; border-bottom: 1px solid var(--wa-line); }
    .lc-filter .lc-sub { white-space: normal; }
    .lc-filter button.lc-ghost { margin-left: auto; }
    .layers-card > .group-cta { margin: 6px 8px 0; }
    .layers-card > .part-cta, .layers-card > .hint { margin: 6px 10px 0; }
    .layers-card > .lc-empty { margin: 0; padding: 24px 16px; text-align: center; font-size: 12px; line-height: 1.5; color: var(--wa-muted); }
    .layers-card > .layers { padding: 6px 8px 0; }
    .layers-sec {
      flex: none; margin: 6px 2px 0; font-size: 10.5px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: var(--wa-muted);
    }
    .layers-sec:first-child { margin-top: 0; }
    /* Background: its caption where a layer's badges sit. */
    .layer.pinned .ground-cap { font-size: 11px; color: var(--wa-muted); white-space: nowrap; }
    .layer.pinned.ground .grip { visibility: hidden; }
    /* The left column's and the top bar's own menus. */
    .side-menu { position: relative; display: inline-flex; flex: none; }
    .pop-menu.side-pop { min-width: 220px; }
    .side-pop .row { display: flex; flex-direction: column; align-items: flex-start; gap: 1px; }
    .side-pop .row[role="menuitemradio"] { flex-direction: row; align-items: center; gap: 6px; }
    .side-pop .row small { font-size: 11px; font-weight: 500; color: var(--wa-muted); }
    .side-pop .row:disabled { opacity: .45; cursor: default; }
    .side-pop .row.danger { color: var(--error-color, #e5484d); }
    .side-pop .row.danger.armed { background: var(--error-color, #e5484d); color: #fff; }
    .pop-sep { display: block; height: 1px; margin: 4px 2px; background: var(--wa-line); }
    .pop-label { padding: 6px 10px 2px; font-size: 10.5px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: var(--wa-muted); }
    .pop-tick { display: inline-grid; place-items: center; width: 14px; height: 14px; flex: none; color: var(--wa-accent); }
    .pop-tick svg.ui-icon { width: 13px; height: 13px; }
    /* The Add sheet: over the canvas, hung under + Add, or centred in the
       window when that does not fit. Drawn at the top level of the panel, so
       no column's clipping reaches it. */
    .add-sheet {
      position: fixed; z-index: 60; width: ${ADD_SHEET_WIDTH}px; max-width: calc(100vw - 24px);
      display: flex; flex-direction: column; overflow: hidden;
      background: var(--wa-card); color: var(--wa-ink); border-radius: var(--wa-lc-r);
      box-shadow: 0 0 0 1px var(--wa-line-strong), var(--wa-shadow-pop);
    }
    .add-sheet.centered { left: 50%; top: 50%; transform: translate(-50%, -50%); height: min(700px, calc(100vh - 24px)); }
    .as-head { display: flex; align-items: center; gap: 8px; padding: 8px 8px 8px 10px; border-bottom: 1px solid var(--wa-line); flex: none; }
    .as-search {
      flex: 1; min-width: 0; display: flex; align-items: center; gap: 8px; height: 32px; padding: 0 8px 0 10px;
      border-radius: 7px; background: var(--wa-input); box-shadow: inset 0 0 0 1px var(--wa-line); color: var(--wa-muted);
    }
    .as-search:focus-within { box-shadow: inset 0 0 0 1px var(--wa-accent), var(--wa-ring); }
    .as-search svg.ui-icon { width: 14px; height: 14px; flex: none; }
    .as-search input[type=search], .as-search input[type=search]:focus-visible {
      flex: 1; min-width: 0; min-height: 0; padding: 0; border: 0; background: transparent; box-shadow: none; outline: none;
      font-size: 12.5px; color: var(--wa-ink);
    }
    .as-search kbd { font: inherit; font-size: 10px; padding: 1px 5px; border-radius: 4px; border: 1px solid var(--wa-line); flex: none; }
    .as-head > button.icon { width: 28px; height: 28px; }
    .as-tabs { display: flex; align-items: center; gap: 4px; padding: 8px 10px; border-bottom: 1px solid var(--wa-line); flex: none; }
    .as-tabs .spacer { flex: 1; }
    button.as-tab {
      font: inherit; font-size: 12px; font-weight: 600; height: 28px; padding: 0 11px; border-radius: 7px; cursor: pointer;
      border: 1px solid transparent; background: transparent; color: var(--wa-muted);
    }
    button.as-tab:hover { color: var(--wa-ink); }
    button.as-tab.on { color: var(--wa-ink); background: var(--wa-sel-bg); border-color: var(--wa-sel-ring); }
    button.as-tab:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .as-count { font-weight: 400; font-size: 11px; color: var(--wa-muted); }
    button.as-tab.on .as-count { color: var(--wa-accent); }
    .as-full { flex: none; margin: 8px 10px 0; font-size: 12px; color: var(--wa-amber); }
    .as-body { flex: 1 1 auto; min-height: 0; overflow-y: auto; padding: 10px; display: flex; flex-direction: column; gap: 8px; scrollbar-width: thin; }
    .as-sect { font-size: 10px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: var(--wa-muted); padding: 2px 2px 0; }
    .as-sect:not(:first-child) { margin-top: 4px; }
    .as-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px; }
    @media (max-width: 520px) { .as-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
    button.as-tile {
      font: inherit; font-size: 11px; font-weight: 500; color: var(--wa-ink); cursor: pointer; min-width: 0;
      display: flex; flex-direction: column; align-items: stretch; gap: 6px; padding: 8px 6px 7px; border-radius: 9px;
      background: var(--wa-input); border: 1px solid var(--wa-line);
      transition: border-color .12s ease-out, background-color .12s ease-out;
    }
    button.as-tile.dashed { border-style: dashed; }
    button.as-tile:hover:not(:disabled) { border-color: color-mix(in srgb, var(--k, var(--wa-accent)) 55%, var(--wa-line)); background: color-mix(in srgb, var(--k, var(--wa-accent)) 8%, var(--wa-input)); }
    button.as-tile:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    button.as-tile:disabled { opacity: .45; cursor: default; }
    .as-pic { display: block; width: 100%; aspect-ratio: 120 / 46; border-radius: 6px; overflow: hidden; background: #000; }
    .as-pic svg.shot { display: block; width: 100%; height: 100%; }
    .as-name { text-align: center; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    button.as-tile.as-all .as-pic { display: grid; place-items: center; background: var(--wa-panel); }
    .as-more { font-size: 11px; font-weight: 600; color: var(--wa-accent); }
    .as-note { padding: 8px 10px; border-radius: 8px; font-size: 11.5px; color: var(--wa-muted); background: var(--wa-panel); box-shadow: inset 0 0 0 1px var(--wa-line); }
    .as-note b { color: var(--wa-ink); }
    .as-empty { padding: 28px 12px; text-align: center; font-size: 12.5px; color: var(--wa-muted); }
    /* Saved parts: the grid and the entity table the Parts dialog had, in the
       sheet's body. Its own head and foot sit inside the scroller. */
    .as-parts { display: flex; flex-direction: column; min-height: 0; margin: -10px; }
    .as-parts > .xfer-body { padding: 12px; }
    .as-parts > .xfer-foot { position: sticky; bottom: 0; background: var(--wa-card); }
    /* Picked for grouping: an accent ring, since the kind color is taken. */
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
      margin: 0 0 0 12px; padding-left: 10px; display: flex; flex-direction: column; gap: 4px;
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
    /* An expanded row swaps its badges for its buttons, the same as a compact
       one. It used to keep both, with the buttons held in the layout and only
       turned invisible, so that arriving they could not widen the right end
       and wrap the facts onto another line. That reserved width sat to the
       right of the badges and pushed them off the edge every other row lines
       up on, so at rest the badges read as crooked. The right end still never
       wraps. */
    .layer.rich .right { flex-wrap: nowrap; justify-content: flex-end; gap: 4px; }
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
       second line, and the tint takes the section's color where there is one. */
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
    /* Where a copy that was not the open document landed. Not a warning: every
       record it names is in the store, and a device that has not synced yet is
       on its way. */
    .banner.note { border-left: 4px solid var(--wa-accent); }
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
      position: relative; font-size: 12.5px; font-weight: 700; color: var(--wa-accent); margin-bottom: 10px;
    }
    .gate-title {
      position: relative; margin: 0 0 10px; font-size: 24px; line-height: 1.2; font-weight: 700;
      letter-spacing: -.015em; color: var(--wa-ink); text-wrap: balance;
    }
    .gate-lead { position: relative; margin: 0 0 26px; font-size: 14.5px; line-height: 1.55; color: var(--wa-muted); max-width: 52ch; }
    /* The "nothing open" card's two ways forward. */
    .gate-acts { position: relative; display: flex; gap: 8px; flex-wrap: wrap; }
    .gate-acts button { display: inline-flex; align-items: center; gap: 6px; }
    .gate-acts button svg { width: 14px; height: 14px; }
    .gate.start .gate-lead { margin-bottom: 18px; }
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
    /* Three rows: the document itself on top (name, devices, actions), then
       the shape it draws and how it is looked at, then the stage help. */
    .canvas-bar {
      display: flex; flex-direction: column; font-size: 13px; flex: none;
      border-bottom: 1px solid var(--wa-line); background: var(--wa-raised);
    }
    .bar-row { display: flex; align-items: center; gap: 6px; padding: 8px 12px; flex-wrap: wrap; }
    /* The document row: what this complication is called, where it is, and
       what can be done to the whole of it. Its own line above the shapes,
       ruled off, because none of it is a drawing tool. */
    .doc-row { gap: 4px 10px; padding-bottom: 6px; }
    .doc-name {
      font-size: 15px; font-weight: 700; color: var(--wa-ink); flex: 0 1 auto;
      min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    }
    /* The devices row, under the name: where this design is, and one button
       to put it somewhere else. Ruled off from the drawing tools below it. */
    .doc-places { gap: 4px 8px; padding-top: 0; padding-bottom: 7px; border-bottom: 1px solid var(--wa-line); }
    .doc-on-pre { font-size: 11.5px; font-weight: 600; color: var(--wa-muted); flex: none; }
    .doc-on { display: inline-flex; align-items: center; gap: 4px; flex-wrap: wrap; min-width: 0; }
    /* A chip per device the design is on: a label, not a control. Every one
       is lit, the copy the editor has open included, because they are all the
       same design and all equally on. Split into the name and the trash for
       that device, the way a page tab is. */
    .doc-chip {
      display: inline-flex; align-items: center; gap: 5px; height: 24px; padding: 0 0 0 9px;
      border-radius: 999px; font-size: 11.5px; font-weight: 600; overflow: hidden;
      background: color-mix(in srgb, var(--wa-accent) 22%, var(--wa-card));
      border: 1px solid transparent; color: var(--wa-ink); white-space: nowrap;
    }
    .doc-chip > svg { width: 13px; height: 13px; opacity: .85; }
    /* Red on the plain input ground, not on the accent: it is the one control
       on the chip that takes something away, and it should not look like part
       of the device it removes. */
    button.doc-trash {
      display: inline-flex; align-items: center; justify-content: center; flex: none;
      width: 24px; align-self: stretch; padding: 0; margin-left: 4px;
      border: 0; border-left: 1px solid color-mix(in srgb, var(--wa-accent-ink) 25%, transparent);
      font: inherit; background: var(--wa-input); color: #FF453A; cursor: pointer;
    }
    button.doc-trash svg.ui-icon { width: 13px; height: 13px; }
    button.doc-trash:hover:not(:disabled) { background: color-mix(in srgb, #FF453A 22%, var(--wa-input)); }
    button.doc-trash:disabled { color: var(--wa-muted); opacity: .6; cursor: default; }
    button.doc-trash:focus-visible { outline: none; box-shadow: inset var(--wa-ring); }
    /* Armed: the trash becomes the question, filled red and wide enough for
       the word, so the second press is plainly a different button. */
    button.doc-trash.armed {
      width: auto; padding: 0 8px; background: #FF453A; color: #fff;
      border-left-color: color-mix(in srgb, #fff 35%, transparent);
    }
    button.doc-trash.armed:hover { background: color-mix(in srgb, #fff 12%, #FF453A); }
    button.doc-trash .sure { font-size: 11px; font-weight: 700; letter-spacing: .01em; }
    /* "Add to a device" and its menu. A dashed edge so it reads as the empty
       place after the chips rather than as one more device. */
    .place-tool { position: relative; display: inline-flex; }
    .place-tool .pop-menu { left: 0; right: auto; min-width: 200px; }
    button.doc-add {
      display: inline-flex; align-items: center; gap: 3px; height: 22px; padding: 0 8px;
      border-radius: 999px; font: inherit; font-size: 11.5px; font-weight: 600;
      background: transparent; border: 1px dashed var(--wa-line-strong); color: var(--wa-muted);
      white-space: nowrap; cursor: pointer;
    }
    button.doc-add:hover:not(:disabled) { border-style: solid; border-color: var(--wa-accent); color: var(--wa-ink); }
    button.doc-add:disabled { opacity: .5; cursor: default; }
    button.doc-add svg { width: 12px; height: 12px; }
    .pop-menu .row.place-row { display: flex; align-items: center; gap: 7px; }
    .place-row svg { width: 14px; height: 14px; flex: none; opacity: .8; }
    .place-row .place-name { flex: 1 1 auto; min-width: 0; overflow: hidden; text-overflow: ellipsis; }
    .place-row .place-no { flex: none; font-size: 10.5px; font-weight: 600; color: var(--wa-muted); }
    .place-row:disabled { opacity: .55; cursor: default; }
    .place-row:disabled:hover { background: transparent; }
    .place-note {
      margin: 4px 4px 2px; max-width: 240px; font-size: 11px; line-height: 1.4; color: var(--wa-muted);
      white-space: normal;
    }
    /* The shape in brackets after the complication's name. Lighter than the
       name and the same size, so the pair reads as one line rather than as a
       heading with a subtitle. A note rides after it, so "nothing shown" and
       the warning still have somewhere to sit. */
    .doc-shape {
      display: inline-flex; align-items: baseline; gap: 6px; flex: none;
      font-size: 14px; font-weight: 500; color: var(--wa-muted);
    }
    .doc-shape .fam { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .doc-shape small { font-size: 11px; font-weight: 500; color: var(--wa-muted); }
    .doc-shape .warn { align-self: center; display: inline-flex; color: var(--wa-val); }
    .doc-shape .warn svg { width: 14px; height: 14px; }
    .bar-sep { width: 1px; height: 18px; background: var(--wa-line-strong); margin: 0 2px; flex: none; }
    .canvas-bar .spacer { flex: 1; min-width: 0; }
    /* The shape and the Control Center control, as one segmented control.
       Drawn only by a document that still holds both; one shape alone is
       named instead. */
    .shape-seg {
      display: inline-flex; flex-wrap: wrap; align-items: center; gap: 5px; padding: 4px; border-radius: 11px;
      background: var(--wa-input); box-shadow: inset 0 0 0 1px var(--wa-line);
    }
    /* Every tab used to be transparent until it was pressed, and the pressed
       one wore the card color: on the dark skin that is the bar it sits in, so
       four shapes read as one long button with no telling which was open. Each
       tab now carries its own plate at rest, and the open one is filled with
       the accent and ringed in it. */
    .shape-seg button.tab {
      height: 34px; padding: 0 10px; border-radius: 8px;
      background: var(--wa-card); border-color: var(--wa-line);
      color: color-mix(in srgb, var(--wa-ink) 72%, var(--wa-muted));
    }
    .shape-seg button.tab:hover:not(:disabled) { border-color: var(--wa-line-strong); color: var(--wa-ink); }
    .shape-seg button.tab[aria-pressed="true"] {
      background: color-mix(in srgb, var(--wa-accent) 22%, var(--wa-card));
      border-color: transparent; color: var(--wa-ink); font-weight: 700;
      box-shadow: 0 0 0 2px var(--wa-accent), 0 1px 4px rgba(0,0,0,.22);
    }
    .canvas-bar .hint { margin: 0; }
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
    button.tab .warn { display: inline-flex; color: var(--wa-val); }
    button.tab .warn svg { width: 13px; height: 13px; }
    /* The remove button rides beside the open tab, and only while the pointer
       is on it: it is drawn for that tab alone, so it never asks to remove a
       shape nobody is looking at. */
    .tab-wrap .tab-x { opacity: .35; margin-left: -4px; align-self: center; }
    .tab-wrap:hover .tab-x, .tab-wrap .tab-x:focus-visible { opacity: .7; }
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
    .panel-title button.help { flex: none; }
    /* The tour's progress, under the Pages row: one thin bar, filled by a CSS
       animation over the tour's own length, so nothing has to tick at 60 fps
       to draw it. */
    .page-tour-bar {
      display: block; height: 4px; margin: 8px 0 0; border-radius: 999px;
      background: var(--wa-line); overflow: hidden;
    }
    .page-tour-bar i {
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
    button.case-pick {
      display: inline-flex; align-items: center; gap: 6px; height: 26px; padding: 0 6px 0 0; border: 0; border-radius: 6px;
      background: transparent; color: var(--wa-ink); font: inherit; font-weight: 500; cursor: pointer; white-space: nowrap;
    }
    button.case-pick svg { width: 14px; height: 14px; opacity: .7; }
    /* The Color menu: a round swatch per tint, and a split one for full color.
       While a tint is on the box takes an accent edge, so a tinted preview is
       never mistaken for the real colors. */
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
      /* One column that can be narrower than its widest child. Left to size
         itself, the column took the tool row's max-content width, and on a
         phone that was wider than the stage: the face, drawn at 100% of that
         column, hung 22px off the right edge behind a scrollbar. */
      display: grid; grid-template-columns: minmax(0, 1fr);
      justify-items: center; align-content: center; gap: 20px; padding: 20px; flex: 1 1 auto; min-height: 0; overflow: auto;
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
    /* The one line of stage help: what a drag does right now. It rides in the
       bar over the face, and in the zoom bar. */
    .under {
      display: flex; align-items: center; justify-content: center; flex-wrap: wrap; gap: 10px;
      text-align: center; font-size: 12.5px; font-weight: 500; color: var(--wa-muted);
    }
    /* Under the face on the stage, centred with it: the words are about
       dragging the thing directly above them. */
    .stage > .under { max-width: 460px; }
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
    /* The left column's cards wear their own color the way the inspector's
       sections do, so the two columns read as one set of boxes rather than
       tinted panels on one side and plain ones on the other. The color comes
       from the card's own --c. */
    .card.tinted {
      --c: var(--wa-accent);
      background: color-mix(in srgb, var(--c) 7%, var(--wa-card));
      box-shadow: 0 0 0 1px color-mix(in srgb, var(--c) 24%, var(--wa-card));
    }
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
    /* The complication card's Flash row: the switch, then the color it
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
    /* Shared values footer: one line at the foot of the Layers card, the list
       unfolding under it. The open list takes at most part of the column and
       scrolls, so an open value never pushes the layer rows out of sight. */
    .sv-foot { flex: none; border-top: 1px solid var(--wa-line); }
    .layers-card > .sv-foot { margin-top: auto; }
    .sv-bar { display: flex; align-items: center; gap: 8px; min-height: 38px; padding: 0 8px 0 12px; }
    .sv-title { font-size: 12.5px; font-weight: 600; }
    .sv-bar .spacer, .sv-tools .spacer { flex: 1; }
    .sv-body { max-height: 40vh; overflow-y: auto; scrollbar-width: thin; padding: 0 10px 10px; display: flex; flex-direction: column; gap: 6px; }
    .sv-tools { display: flex; align-items: center; gap: 6px; }
    .sv-tools button.sec-help { opacity: 1; }
    .sv-none { font-size: 12px; color: var(--wa-muted); }
    /* On the Control Center tab there is no Layers card to sit at the foot
       of, so it is a card of its own at the foot of the column. */
    .sv-foot.standalone { border-top: 0; padding: 0; margin-top: auto; }
    .layout.cols-1 .sv-foot.standalone { margin-top: 0; }
    .layout.cols-1 .sv-body { max-height: none; overflow: visible; }
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
    /* Canvas column: quiet header, floating toolbar, zoomable stage, values bar, first run. */
    .canvas-card {
      --wa-float-bg: color-mix(in srgb, var(--wa-raised) 94%, transparent);
      --wa-float-line: var(--wa-line-strong);
      --wa-float-shadow: 0 6px 18px rgba(0,0,0,.14);
      --wa-float-sep: var(--wa-line-strong);
      --wa-hint: var(--wa-muted);
      --wa-chip-bg: var(--wa-panel);
      --wa-chip-line: var(--wa-line);
      --wa-live: #2f9e6a;
      --wa-testing: #b7791f;
      /* On the black face, in either skin. */
      --wa-face-muted: #8b91ad;
    }
    :host([dark]) .canvas-card {
      --wa-float-bg: rgba(21,26,46,.92);
      --wa-float-line: #262c4a;
      --wa-float-shadow: 0 8px 24px rgba(0,0,0,.45);
      --wa-float-sep: #2a3154;
      --wa-hint: #6b7190;
      --wa-chip-bg: #151a2e;
      --wa-chip-line: #232946;
      --wa-live: #3fbf7f;
      --wa-testing: #f2c063;
    }
    .column.canvas > .card.canvas-card { min-height: 440px; }
    .cv-head {
      display: flex; align-items: center; gap: 12px; height: 48px; padding: 0 16px; flex: none; min-width: 0;
      border-bottom: 1px solid var(--wa-line);
    }
    .cv-name {
      flex: 0 1 auto; min-width: 4em; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
      font-size: 14px; font-weight: 600; letter-spacing: -.01em; color: var(--wa-ink);
    }
    .cv-slash { flex: none; color: var(--wa-line-strong); }
    .cv-shape {
      display: inline-flex; align-items: center; gap: 6px; flex: 0 4 auto; min-width: 0;
      font-size: 12px; color: var(--wa-muted); white-space: nowrap;
    }
    .cv-shape .fam { min-width: 0; overflow: hidden; text-overflow: ellipsis; }
    .cv-shape small { font-size: 11px; }
    .cv-shape .warn { display: inline-flex; color: var(--wa-val); }
    .cv-shape .warn svg { width: 14px; height: 14px; }
    .cv-head .spacer { flex: 1; min-width: 0; }
    .cv-head .shape-seg { padding: 2px; gap: 2px; border-radius: 9px; flex-wrap: nowrap; }
    .cv-head .shape-seg button.tab { height: 26px; padding: 0 10px; font-size: 12px; }
    .cv-head .doc-on { display: inline-flex; align-items: center; gap: 6px; flex: 0 12 auto; min-width: 0; overflow: hidden; }
    .cv-head .doc-chip {
      height: 26px; gap: 7px; padding: 0 10px 0 8px; border-radius: 13px; min-width: 0; flex: 0 1 auto;
      background: var(--wa-chip-bg); border: 1px solid var(--wa-chip-line);
      font-size: 11.5px; font-weight: 500; color: var(--wa-ink);
    }
    .cv-head .doc-chip > svg { width: 13px; height: 13px; flex: none; }
    .cv-head .doc-chip-name { min-width: 0; overflow: hidden; text-overflow: ellipsis; }
    /* The x that takes the design off a device shows on hover or focus, and
       while it is armed. */
    .cv-head .doc-chip button.doc-trash {
      width: 0; height: 18px; margin: 0 -7px 0 0; align-self: center; border: 0; border-radius: 9px;
      background: transparent; color: var(--wa-muted); opacity: 0; overflow: hidden;
      transition: opacity .12s ease-out;
    }
    .cv-head .doc-chip:hover button.doc-trash, .cv-head .doc-chip:focus-within button.doc-trash,
    .cv-head .doc-chip button.doc-trash.armed { width: 18px; margin: 0 -4px 0 0; opacity: 1; }
    .cv-head .doc-chip button.doc-trash:hover:not(:disabled) { color: #FF453A; background: color-mix(in srgb, #FF453A 16%, transparent); }
    .cv-head .doc-chip button.doc-trash.armed { width: auto; padding: 0 7px; background: #FF453A; color: #fff; }
    button.cv-more {
      flex: none; height: 26px; min-width: 32px; padding: 0 8px; border: 0; border-radius: 7px; cursor: pointer;
      font: inherit; font-size: 16px; letter-spacing: 1px; line-height: 1; background: transparent; color: var(--wa-muted);
    }
    button.cv-more:hover, button.cv-more[aria-expanded="true"] { background: color-mix(in srgb, var(--wa-ink) 8%, transparent); color: var(--wa-ink); }
    button.cv-more:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .case-tool.doc-menu .pop-menu { left: auto; right: 0; min-width: 230px; }
    .doc-pop .row { display: flex; align-items: center; gap: 8px; }
    .doc-pop .row .why { margin-left: auto; font-size: 11px; font-weight: 500; color: var(--wa-muted); }
    .doc-pop .row .spacer { flex: 1; }
    .doc-pop .row svg.ui-icon { width: 13px; height: 13px; opacity: .7; }
    .doc-pop .row.danger { color: #FF453A; }
    .doc-pop .doc-places-list, .doc-pop .doc-del { display: flex; flex-direction: column; gap: 1px; }
    .doc-pop .doc-places-list { padding-left: 10px; }
    .pop-menu .row:disabled { opacity: .5; cursor: default; }
    .pop-menu .row:disabled:hover { background: transparent; }
    .pop-sep { height: 1px; margin: 4px 2px; background: var(--wa-line); }
    /* The stage: the dotted surface, the zoomable face on it, and the values
       bar at its foot. The face's Fit size comes from the stage-wrap's own
       box, through container units, so no script measures anything. */
    .stage-area {
      flex: 1 1 auto; min-height: 0; display: flex; flex-direction: column;
      background:
        radial-gradient(ellipse at 50% 35%, color-mix(in srgb, var(--wa-accent) 10%, transparent) 0, transparent 65%),
        radial-gradient(color-mix(in srgb, var(--wa-ink) 9%, transparent) 1px, transparent 1px) 0 0 / 18px 18px;
    }
    .stage-wrap { position: relative; flex: 1 1 auto; min-height: 300px; container-type: size; }
    .stage-wrap.first-run { min-height: 540px; }
    .stage-wrap > .stage {
      position: absolute; inset: 0; display: flex; flex-direction: column; align-items: stretch; gap: 12px;
      padding: 64px 24px 16px; overflow: auto; background: none; container-type: normal;
    }
    .stage-wrap > .stage.control-stage { align-items: center; justify-content: center; padding-top: 24px; }
    .stage-wrap .row-strip { align-self: center; flex: none; }
    /* Auto margins centre the face both ways and never push it past the
       stage's top or left edge, so a face zoomed past the stage scrolls from
       its own corner. */
    .stage-face { margin: auto; display: flex; flex-direction: column; align-items: center; gap: 12px; }
    .stage-face > .preview { width: auto; }
    .stage-wrap .stage-face > .preview > svg {
      width: calc(max(120px, min(100cqw - 48px, (100cqh - var(--wa-reserve, 124px)) * var(--wa-ratio, 1))) * var(--wa-zoom, 1));
      max-width: none;
    }
    .stage-face > .under { max-width: 460px; font-size: 11px; font-weight: 400; color: var(--wa-hint); }
    .stage-page { position: absolute; top: 25px; left: 16px; z-index: 3; font-size: 11px; color: var(--wa-hint); pointer-events: none; }
    .stage-tools {
      position: absolute; top: 14px; left: 50%; transform: translateX(-50%); z-index: 5;
      display: flex; align-items: center; gap: 2px; height: 36px; padding: 0 6px; max-width: calc(100% - 24px);
      border-radius: 10px; background: var(--wa-float-bg); border: 1px solid var(--wa-float-line); box-shadow: var(--wa-float-shadow);
    }
    button.tb {
      display: inline-flex; align-items: center; gap: 7px; flex: none; height: 26px; padding: 0 8px; border-radius: 7px;
      border: 1px solid transparent; background: transparent; color: var(--wa-ink); cursor: pointer;
      font: inherit; font-size: 11.5px; font-weight: 500; white-space: nowrap;
    }
    button.tb:hover:not(:disabled) { background: color-mix(in srgb, var(--wa-ink) 8%, transparent); }
    button.tb:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    button.tb:disabled { opacity: .4; cursor: default; }
    button.tb.on { background: color-mix(in srgb, var(--wa-accent) 26%, transparent); border-color: color-mix(in srgb, var(--wa-accent) 60%, transparent); }
    button.tb.lit { color: color-mix(in srgb, var(--wa-accent) 55%, var(--wa-ink)); }
    button.tb .tb-glyph { width: 13px; height: 13px; flex: none; }
    button.tb > svg.ui-icon { width: 14px; height: 14px; flex: none; }
    button.tb .caret { display: inline-flex; margin-left: -3px; color: var(--wa-hint); }
    button.tb .caret svg { width: 11px; height: 11px; }
    button.tb .tint-dot { margin-right: 0; }
    .tb-dot { width: 5px; height: 5px; margin-left: -4px; border-radius: 50%; background: currentColor; flex: none; }
    button.tb.icon { padding: 0 7px; font-size: 14px; }
    button.tb.pct { min-width: 42px; padding: 0 4px; justify-content: center; color: var(--wa-muted); font-variant-numeric: tabular-nums; }
    .tb-sep { width: 1px; height: 18px; margin: 0 6px; background: var(--wa-float-sep); flex: none; }
    .tb-zoom { display: inline-flex; align-items: center; }
    .stage-tools .case-tool .pop-menu { left: 0; }
    @container (max-width: 680px) {
      .stage-tools .word:not(.keep) { display: none; }
      .stage-tools button.tb { gap: 4px; padding: 0 6px; }
      .stage-tools .tb-sep { margin: 0 3px; }
    }
    /* A phone-width stage: the toolbar takes two rows rather than losing the
       zoom off its end, and the face starts under both. */
    @container (max-width: 460px) {
      .stage-tools { flex-wrap: wrap; justify-content: center; height: auto; padding: 4px; row-gap: 2px; width: max-content; }
      .stage-tools .tb-sep { display: none; }
      .stage-wrap > .stage { padding-top: 92px; }
      .stage-page { top: auto; bottom: 8px; }
    }
    .snap-menu { min-width: 220px; }
    .pop-menu .row.snap-row { display: flex; align-items: center; gap: 10px; }
    .snap-row .tog {
      position: relative; display: inline-block; flex: none; width: 26px; height: 14px; border-radius: 7px; background: var(--wa-line-strong);
    }
    .snap-row .tog.on { background: var(--wa-accent); }
    .snap-row .tog i { position: absolute; top: 2px; left: 2px; width: 10px; height: 10px; border-radius: 5px; background: #fff; transition: left .12s ease-out; }
    .snap-row .tog.on i { left: 14px; }
    .snap-steps { display: flex; gap: 2px; margin: 0 6px 4px 46px; padding: 2px; border-radius: 7px; background: var(--wa-panel); }
    .snap-steps button {
      flex: 1; padding: 3px 6px; border: 0; border-radius: 5px; background: transparent; color: var(--wa-muted); cursor: pointer;
      font: inherit; font-size: 11px; font-weight: 600; font-variant-numeric: tabular-nums;
    }
    .snap-steps button.on { background: var(--wa-seg-on); color: var(--wa-ink); }
    .snap-steps button:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    /* The values bar, the same floating family as the toolbar. */
    .values-foot { display: flex; justify-content: center; flex: none; min-width: 0; padding: 0 16px 14px; }
    .values-bar {
      display: flex; align-items: center; gap: 10px; min-width: 0; max-width: 100%; min-height: 40px; padding: 4px 8px 4px 14px;
      border-radius: 12px; background: var(--wa-float-bg); border: 1px solid var(--wa-float-line); box-shadow: var(--wa-float-shadow);
    }
    .values-bar .tb-sep { margin: 0; }
    .vb-state {
      display: inline-flex; align-items: center; gap: 6px; flex: none;
      font-size: 10.5px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: var(--wa-muted);
    }
    .vb-dot { width: 6px; height: 6px; border-radius: 3px; background: var(--wa-live); box-shadow: 0 0 6px var(--wa-live); }
    .values-bar.testing .vb-state { color: var(--wa-testing); }
    .values-bar.testing .vb-dot { background: var(--wa-testing); box-shadow: 0 0 6px var(--wa-testing); }
    .vb-empty { min-width: 0; font-size: 11.5px; color: var(--wa-muted); }
    .vb-pills { display: flex; gap: 6px; min-width: 0; padding: 2px 0; overflow-x: auto; scrollbar-width: thin; }
    .vchip.vpill {
      display: inline-flex; align-items: center; gap: 8px; flex: none; width: auto; height: 28px; padding: 0 10px; border-radius: 8px;
      background: var(--wa-chip-bg); border: 1px solid var(--wa-chip-line); font-size: 11.5px; color: var(--wa-ink); cursor: default;
    }
    .vpill .vp-icon { display: inline-flex; flex: none; color: var(--k); }
    .vpill .vp-icon svg { width: 13px; height: 13px; }
    .vpill b { max-width: 160px; font-weight: 500; }
    .vchip.vpill .test-ctl { flex: none; gap: 8px; }
    .vchip.vpill .test-ctl input[type=range] { flex: none; width: 64px; min-width: 64px; height: 14px; }
    .vpill .test-ctl .val, .vpill .test-ctl input[type=text] { order: -1; }
    .vchip.vpill button.val {
      min-width: 0; text-align: left; color: var(--wa-ink); font-family: inherit; font-size: 11.5px; font-weight: 700; font-variant-numeric: tabular-nums;
    }
    .vchip.vpill.testing { box-shadow: none; border-color: var(--wa-testing); }
    .vchip.vpill.testing button.val { color: var(--wa-testing); }
    .vchip.vpill .test-ctl select { min-height: 22px; padding: 1px 4px; font-size: 11.5px; }
    .vchip.vpill input[type=text] { width: 80px; min-height: 22px; font-size: 11.5px; }
    .vchip.vpill .vtag { background: transparent; border: 1px solid var(--wa-float-sep); font-size: 9.5px; line-height: 14px; padding: 0 4px; }
    .vpill button.live-reset { display: inline-flex; flex: none; padding: 0; border: 0; background: transparent; color: var(--wa-muted); cursor: pointer; }
    .vpill button.live-reset:hover { color: var(--wa-ink); }
    .vpill button.live-reset svg { width: 13px; height: 13px; }
    button.vb-live {
      flex: none; height: 24px; padding: 0 8px; border: 1px solid transparent; border-radius: 7px; cursor: pointer;
      font: inherit; font-size: 11px; font-weight: 600; white-space: nowrap; background: transparent; color: var(--wa-muted);
    }
    button.vb-live:hover:not(:disabled) { color: var(--wa-ink); background: color-mix(in srgb, var(--wa-ink) 8%, transparent); }
    button.vb-live:disabled { opacity: .45; cursor: default; }
    button.vb-live:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    /* An empty complication: what the black box is, and four ways to start. */
    .first-run-note {
      position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px;
      padding: 12px; text-align: center; color: #fff; pointer-events: none;
    }
    .first-run-note .fr-title { max-width: 90%; font-size: 22px; font-weight: 600; line-height: 1.2; }
    .first-run-note .fr-sub { max-width: 90%; font-size: 13px; color: var(--wa-face-muted); }
    .first-run { display: flex; flex-direction: column; align-items: center; gap: 12px; margin-top: 10px; }
    .fr-head { font-size: 13px; font-weight: 600; color: var(--wa-ink); }
    .fr-tiles { display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; }
    button.fr-tile {
      display: flex; flex-direction: column; align-items: center; gap: 10px; width: 150px; padding: 18px 10px 14px;
      border-radius: 12px; background: var(--wa-card); border: 1px solid var(--wa-float-sep); color: var(--wa-ink); cursor: pointer;
      font: inherit; font-size: 13px; font-weight: 600;
    }
    button.fr-tile:hover { border-color: var(--wa-accent); }
    button.fr-tile:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    button.fr-tile.fr-preset { border-style: dashed; }
    button.fr-tile small { font-size: 11px; font-weight: 400; color: var(--wa-muted); }
    .fr-pic { display: flex; align-items: center; justify-content: center; width: 100%; height: 56px; border-radius: 8px; background: #000; color: #fff; }
    .fr-tile.fr-preset .fr-pic { background: color-mix(in srgb, var(--wa-accent) 8%, var(--wa-card)); }
    .fr-big { font-size: 22px; font-weight: 700; }
    .fr-count { font-size: 12px; color: var(--wa-accent); }
    .fr-foot { font-size: 11px; color: var(--wa-muted); }
    .fr-foot b { color: var(--wa-ink); }
    .fr-foot button.link { font-size: inherit; }
    .layout.cols-1 .stage-wrap { flex: none; height: clamp(320px, 50vh, 480px); }
    .layout.cols-1 .stage-wrap.first-run { height: 600px; }
    .empty { opacity: .6; padding: 24px; text-align: center; }

    /* The inspector: crumbs on top, then one card per section of the thing
       selected, tinted by what it is. */
    /* The column is a flex column so the footer row can sit at its foot on a
       short inspector and stick there on a long one. No top or bottom
       padding: the head and the footer are edge to edge bars, and a sticky
       bar in a padded scroll box leaves a strip for the rows to show through. */
    .column.inspector { padding: 0 12px; container: insp / inline-size; display: flex; flex-direction: column; }
    .column.inspector > .insp-body { flex: 1 0 auto; }
    /* The head: one 40px bar with the breadcrumb and one ghost button. */
    .insp-head {
      display: flex; align-items: center; gap: 8px; min-height: 40px; margin: 0 -12px 4px; padding: 0 8px 0 12px;
      position: sticky; top: 0; background: var(--wa-card); z-index: 5; border-bottom: 1px solid var(--wa-line);
    }
    /* The breadcrumb stays one line: the complication's name gives way first,
       then the layer's name, and the kind chip never does. */
    .crumbs { flex: 1 1 auto; min-width: 0; display: flex; align-items: center; gap: 6px; font-size: 13px; color: var(--wa-muted); white-space: nowrap; }
    .crumbs button { font: inherit; font-size: 12px; font-weight: 400; background: transparent; border: 0; padding: 3px 4px; margin: 0 -2px; border-radius: 5px; color: var(--wa-muted); cursor: pointer; min-width: 0; flex: 0 1 auto; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .crumbs button:hover { background: var(--wa-panel); color: var(--wa-ink); }
    .crumbs .sep { opacity: .6; flex: none; }
    .crumbs .nm { min-width: 0; flex: 0 1 auto; overflow: hidden; text-overflow: ellipsis; font-weight: 600; color: var(--wa-ink); }
    .crumbs .kchip {
      flex: none; display: inline-flex; align-items: center; height: 20px; padding: 0 8px; border-radius: 999px;
      font-size: 10.5px; font-weight: 700; letter-spacing: .05em; text-transform: uppercase;
      background: color-mix(in srgb, var(--k) 26%, transparent); color: color-mix(in srgb, var(--k) 45%, var(--wa-ink));
    }
    .insp-head .expand {
      flex: none; margin-left: auto; font: inherit; font-size: 11.5px; font-weight: 500; color: var(--wa-muted); cursor: pointer;
      background: transparent; border: 0; padding: 0 8px; min-height: 24px; border-radius: 7px;
    }
    .insp-head .expand:hover { background: var(--wa-panel); color: var(--wa-ink); }
    .insp-body { padding: 0 0 24px; }
    /* The whole-complication actions, at the right of the document row. */
    .comp-acts { display: flex; align-items: center; gap: 0; margin-left: auto; flex: none; }
    .comp-acts button.ghost { font-size: 12px; padding: 0 6px; min-height: 24px; border-radius: 6px; }
    .insp-note { margin: 12px 0 0; font-size: 12px; line-height: 1.45; color: var(--wa-muted); }
    /* One tinted box per subject, in the section's color, so each card reads
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
    /* Inspector: header Add, More line, paired rows, how-to card, footer. */
    .sec-h button.sec-act { flex: none; min-height: 22px; padding: 0 8px 0 6px; font-size: 11px; gap: 3px; }
    .sec-h button.sec-act svg.ui-icon { width: 11px; height: 11px; }
    .more-fold { margin: 6px -12px 0; padding: 0 12px; border-top: 1px solid color-mix(in srgb, var(--c, var(--wa-accent)) 18%, transparent); }
    .more-line {
      display: flex; align-items: baseline; gap: 5px; width: 100%; min-width: 0; padding: 7px 0 1px; margin: 0;
      font: inherit; font-size: 11.5px; font-weight: 600; color: var(--wa-ink); background: transparent; border: 0; cursor: pointer; text-align: left;
    }
    .more-line:hover .more-word { color: var(--c, var(--wa-accent)); }
    .more-line:focus-visible { outline: none; box-shadow: var(--wa-ring); border-radius: 4px; }
    .more-line .more-arrow { color: var(--wa-muted); font-size: 10px; }
    .more-line .more-names { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-weight: 400; color: var(--wa-muted); }
    .more-body { padding-top: 4px; }
    .more-body > .hint { margin: 2px 0 6px var(--wa-col); }
    /* Size and alignment on one row: the number box, then Left, Center, Right. */
    .size-align-row { display: grid; grid-template-columns: minmax(64px, 1fr) minmax(0, 2fr); gap: 6px; align-items: center; min-width: 0; }
    /* A color and its One color / By value choice on one row. The hex box
       gives way first, so the choice keeps its words. */
    .color-mode-row { display: flex; align-items: center; gap: 6px; min-width: 0; }
    .color-mode-row > .color-row { flex: 1 1 auto; min-width: 0; }
    .color-mode-row > .seg.wide { flex: 0 0 auto; width: auto; }
    .color-mode-row > .seg.wide button { padding: 0 8px; white-space: nowrap; }
    /* The Complication card's Shape row reads like a field that cannot be typed into. */
    .field.shape-line > .readout-v {
      padding: 4px 8px; border-radius: 6px; background: var(--wa-field); color: var(--wa-muted);
      font-size: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .how-card {
      margin: 8px 0 0; padding: 10px 12px; border-radius: 9px; border: 1px solid var(--wa-line);
      background: var(--wa-raised); color: var(--wa-muted); font-size: 12px; line-height: 1.5;
    }
    .how-card b { color: var(--wa-ink); }
    .how-card ol { margin: 2px 0 4px; padding-left: 18px; }
    .how-card a { color: var(--wa-accent); }
    /* Status and the raw document: one 36px row at the foot of the column,
       with Raw configuration opening the rest above it. */
    .foot {
      flex: none; position: sticky; bottom: 0; z-index: 6; margin: auto -12px 0;
      background: var(--wa-card); border-top: 1px solid var(--wa-line);
    }
    .foot-row { display: flex; align-items: center; gap: 8px; height: 36px; padding: 0 8px 0 12px; font-size: 11.5px; color: var(--wa-muted); }
    .foot-dot { width: 7px; height: 7px; border-radius: 50%; flex: none; background: var(--wa-muted); opacity: .7; }
    .foot-dot.ok { background: var(--success-color, #3dd68c); opacity: 1; }
    .foot-dot.warn { background: var(--warning-color, #ffa600); opacity: 1; }
    .foot-dot.err { background: var(--error-color, #db4437); opacity: 1; }
    /* Same color on the words as on the dot, so the footer agrees with the
       header's Save button about there being work to save. */
    .foot-dot.warn + .foot-text { color: var(--warning-color, #ffa600); }
    .foot-dot.err + .foot-text { color: var(--error-color, #db4437); }
    .foot-text { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .foot-raw {
      flex: none; font: inherit; font-size: 11.5px; font-weight: 500; color: var(--wa-muted); cursor: pointer;
      background: transparent; border: 0; padding: 0 8px; min-height: 24px; border-radius: 7px;
    }
    .foot-raw:hover, .foot[data-open="true"] .foot-raw { background: var(--wa-panel); color: var(--wa-ink); }
    .foot-raw:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .foot-body { padding: 10px 12px 4px; max-height: 40vh; overflow: auto; border-bottom: 1px solid var(--wa-line); }
    .foot-body .hint { margin: 8px 0; }
    .foot-body pre { font-size: 11px; white-space: pre-wrap; overflow-wrap: anywhere; }
    /* The picked layers, read only: the Layers list's color coding without
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
      min-height: 20px; border-top: 0; font-size: 11.5px; font-weight: 600; color: var(--wa-muted);
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
      width: min(620px, calc(100vw - 32px)); padding: 16px 18px 18px;
      border: 1px solid var(--wa-line); border-radius: 12px;
      background: var(--wa-card); color: var(--wa-ink);
      box-shadow: 0 12px 40px rgba(0,0,0,.4);
    }
    /* The result list is the dialog: it is the one thing being read, so it
       takes as much of the window as the dialog's own frame leaves, instead of
       the short list an inspector row can afford. */
    dialog.preset-dialog .entity-results { max-height: min(62vh, 620px); }
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
    .help-body h3 { margin: 0 0 6px; font-size: 12.5px; font-weight: 600; color: var(--wa-muted); }
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
    /* Demo mode. The stage is plain black rather than the zoom stage's dotted
       ground: the watch's own surround is black, and a grid behind the face
       would be one more editor mark in the one view that has none. */
    /* A panel over the editor, not a second screen. The editor stays visible
       round it, dimmed, so it is obvious the demo is a thing you are looking
       through and can close, rather than somewhere you have gone. */
    dialog.demo-dialog {
      width: min(560px, 92vw); max-width: 92vw; max-height: 88vh; margin: auto;
      padding: 0; border: 1px solid var(--wa-line); border-radius: 14px;
      background: var(--wa-card); color: var(--wa-ink);
      display: flex; flex-direction: column; overflow: hidden;
      box-shadow: 0 24px 64px rgba(0,0,0,.55);
    }
    dialog.demo-dialog::backdrop { background: rgba(0,0,0,.55); }
    .demo-bar, .demo-foot {
      display: flex; align-items: center; gap: 10px; padding: 9px 14px; flex: none;
      background: var(--wa-card);
    }
    .demo-bar { border-bottom: 1px solid var(--wa-line); }
    .demo-foot { border-top: 1px solid var(--wa-line); min-height: 20px; }
    .demo-bar .spacer { flex: 1; min-width: 0; }
    .demo-title { font-size: 13px; color: var(--wa-muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .demo-title b { color: var(--wa-ink); font-weight: 600; }
    .demo-stage { flex: 1 1 auto; min-height: 0; display: grid; place-items: center; padding: 20px; background: #000; }
    /* Bigger than life, because a mouse needs room to aim at a tap area the
       size of a fingertip, but inside a dialog that still leaves the editor
       showing on every side. */
    .demo-face {
      position: relative; line-height: 0; cursor: pointer;
      width: min(100%, calc((66vh - 150px) * var(--wa-ratio, 1)));
    }
    /* The system's own mask for each shape, the same one the preview uses. A
       square circular face would be the first thing a demo got wrong. */
    .demo-face svg { width: 100%; height: auto; max-width: none; display: block; border-radius: 18px; }
    .demo-face.circular svg { border-radius: 50%; }
    .demo-face.corner svg { border-radius: 0; }
    .demo-face.small svg { border-radius: 16.3%; }
    .demo-face.medium svg { border-radius: 7.7% / 16.3%; }
    .demo-face.large svg { border-radius: 7.7% / 7.4%; }
    .demo-face.xlarge svg { border-radius: 7.7% / 4.8%; }
    /* The success flash is drawn inside the picture (renderer.ts FlashSpec),
       because the watch's flash is a stroke on the complication's own shape.
       All that is left here is letting it fade rather than blink out. */
    .demo-face .wa-flash { animation: wa-demo-flash 700ms ease-out forwards; }
    @keyframes wa-demo-flash {
      0% { opacity: 0; }
      12% { opacity: 1; }
      70% { opacity: 1; }
      100% { opacity: 0; }
    }
    @media (prefers-reduced-motion: reduce) {
      .demo-face .wa-flash { animation: none; }
    }
    .demo-pages { display: inline-flex; gap: 5px; flex: none; }
    .demo-pages i { width: 6px; height: 6px; border-radius: 50%; background: var(--wa-line); }
    .demo-pages i.on { background: var(--wa-accent); }
    .demo-note { font-size: 13px; color: var(--wa-muted); flex: 1; min-width: 0; }
    .demo-note.did { color: var(--wa-ent); }
    .demo-note.would { color: var(--warning-color, #ffa600); }
    .demo-note.failed { color: var(--error-color, #db4437); }
    dialog.preset-dialog h2 { margin: 0 0 4px; font-size: 15px; font-weight: 500; }
    .ok { color: var(--success-color, #43a047); }
    .warn { color: var(--warning-color, #ffa600); }
    .err, .error { color: var(--error-color, #db4437); }
    .kv { display: grid; grid-template-columns: auto 1fr; gap: 2px 12px; font-size: 13px; }
    .kv dt { opacity: .7; }
    .kv dd { margin: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
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
    /* Inside a tinted section the focus ring takes the section's color. */
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
    /* A color is one box: swatch, hex, and opacity in percent. */
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
       same way a color swatch does. */
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
    /* A color table: a thin bar of the bands to scale with a mark at the
       current value, then one compact row per band, lowest first. It sits in
       the control column, under the Color row it belongs to. It is its own
       size container so a narrow inspector can drop the opacity box, which
       the eight-digit hex still carries. */
    .bands { display: grid; gap: 3px; margin: 2px 0 6px var(--wa-col); container-type: inline-size; }
    @container (max-width: 240px) {
      .band-row .color-box .alpha { display: none; }
      .band-row .color-box { padding-right: 6px; }
    }
    /* The bar is pieces with a hairline gap between them, so two close colors
       still read as two bands; each piece is at least a tenth of the bar (see
       bandLayout). With a bar border on, a piece shows its fill inside its
       border color. Band ends are labelled under the bar. */
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
    /* A bars chart with a border: a Fill and a Border color box side by side
       on every row, under small column titles. A box whose color is the
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
    /* Too narrow for a hex beside the numbers: a color box keeps its swatch. */
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
    /* The one hint that is colored: a timed refresh is spending the redraw
       budget a tap on the face also needs, which is worth noticing. */
    .hint.budget { color: var(--warning-color, #ffa600); }
    /* The bare .err rule sits above .hint in this sheet, so a hint that is an
       error needs both class names to win the color. */
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
      text-align: left; font-weight: 500; font-size: 12px;
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
    /* The tap action menu: every action under its heading, each with one line
       saying what it does, so the choice is readable without a tooltip. */
    .tap-menu {
      position: fixed; inset: auto; margin: 0; padding: 4px; border-radius: 10px; border: 1px solid var(--wa-line-strong);
      background: var(--wa-card); color: var(--wa-ink); box-shadow: 0 8px 24px rgba(0, 0, 0, .28);
      width: min(340px, calc(100vw - 16px)); max-height: 70vh; overflow: auto;
    }
    .tap-menu:popover-open { display: flex; flex-direction: column; gap: 6px; }
    .tap-menu::backdrop { background: transparent; }
    /* One tinted box per heading, each in its own hue, so the groups read
       apart at a glance. The hue is mixed thin into the card, so it works on
       the light theme and the dark one alike. */
    .tap-menu-group {
      --g: var(--wa-muted);
      display: flex; flex-direction: column; padding: 2px; border-radius: 8px;
      background: color-mix(in srgb, var(--g) 9%, var(--wa-card));
      border: 1px solid color-mix(in srgb, var(--g) 28%, transparent);
    }
    .tap-menu-group[data-group="refresh"] { --g: #3b82f6; }
    .tap-menu-group[data-group="pages"] { --g: #f59e0b; }
    .tap-menu-group[data-group="home-assistant"] { --g: #14b8a6; }
    .tap-menu-group[data-group="open-the-app"] { --g: #8b5cf6; }
    .tap-menu-group[data-group="timer"] { --g: #f43f5e; }
    .tap-menu-head {
      font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .04em;
      color: color-mix(in srgb, var(--g) 70%, var(--wa-ink)); padding: 6px 8px 2px;
    }
    .tap-menu button {
      display: flex; flex-direction: column; align-items: stretch; gap: 1px;
      font: inherit; text-align: left; padding: 5px 8px; border-radius: 6px;
      border: none; background: transparent; color: inherit; cursor: pointer;
    }
    .tap-menu button:hover, .tap-menu button:focus-visible { background: color-mix(in srgb, var(--g) 16%, transparent); outline: none; }
    .tap-menu button.on { background: color-mix(in srgb, var(--g) 26%, transparent); }
    .tap-menu-name { font-size: 13px; }
    .tap-menu button.on .tap-menu-name { font-weight: 600; }
    .tap-menu-info { font-size: 11.5px; line-height: 1.35; opacity: .65; }
    .confirm-row { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
    .value-chip-field.compact { margin: 0; }
    .value-chip-field.compact button.value-chip { padding: 3px 8px; font-size: 13px; max-width: 190px; }

    /* Rich text: a Parts row holding the chips in one filled box, with the
       two add buttons under it, then the part picked in the one light box the
       inspector still draws. A chip keeps the value chip's colors (entity
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
    /* Boxes that belong to the box above them: the layers a scoped refresh
       fetches, hanging off "All layers". They sit in from the card's own rows
       under a guide line, the same way a group's members hang off their folder
       in the Layers list, so the nesting reads without a heading.

       These nest twice in the multi-complication picker: a picked complication
       hangs off the list, and its layers hang off its "All layers" box. The
       inner level indents less and draws a fainter line, so two levels still
       read as two and the rows keep their width in a narrow inspector. */
    .sub-checks {
      margin: 2px 0 0 8px; padding-left: 10px;
      border-left: 1px solid color-mix(in srgb, var(--wa-line) 85%, var(--wa-ink));
    }
    .sub-checks .sub-checks {
      margin-left: 4px; padding-left: 8px;
      border-left-color: color-mix(in srgb, var(--wa-line) 60%, transparent);
    }
    /* A row that names a layer lights up under the pointer, and the preview
       draws that layer selected at the same time, so a name nobody wrote (the
       kind and the entity) still says which layer is being ticked. */
    .sub-checks .peek-row { border-radius: 6px; margin: 0 -4px; padding: 0 4px; }
    .sub-checks .peek-row:hover { background: color-mix(in srgb, var(--wa-ink) 8%, transparent); }
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
       accent color when the entity is doing something, which is what makes
       the one light that is on findable in a list of forty. */
    .entity-field { position: relative; }
    .ent-box { position: relative; display: flex; align-items: center; }
    .ent-box input { width: 100%; min-width: 0; padding-left: 32px; padding-right: 30px; color: var(--wa-ent); font-weight: 500; }
    .ent-box .ent-glass { position: absolute; left: 10px; display: grid; place-items: center; color: var(--wa-muted); pointer-events: none; }
    .ent-box .ent-glass svg { width: 14px; height: 14px; display: block; }
    .ent-box.open .ent-glass { color: var(--wa-accent); }
    /* A layer that can draw nothing until it names an entity: a chart on
       recorded history, a timeline, a picture. The empty box wears a ring in
       the entity color and keeps pulsing, so "why is my layer blank?" is
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
       here, so the color never has to be repeated by hand. */
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
    this.loadOpen();
    this.sizeObserver.observe(this);
    window.addEventListener("keydown", this.keyHandler);
    window.addEventListener("keyup", this.keyUpHandler);
    window.addEventListener("blur", this.blurHandler);
    window.addEventListener("beforeunload", this.beforeUnload);
    window.addEventListener("pointerdown", this.pressStart, { capture: true });
    window.addEventListener("pointerup", this.pressEnd, { capture: true });
    window.addEventListener("pointercancel", this.pressEnd, { capture: true });
    window.addEventListener("click", this.sharedValueOutside, { capture: true });
    window.addEventListener("click", this.leaveGuard, { capture: true });
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

  private loadOpen() {
    try {
      const raw = window.sessionStorage.getItem(OPEN_STORE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw) as { owner?: unknown; id?: unknown };
      if (typeof saved.owner === "string" && typeof saved.id === "string") {
        this.restoreOpen = { owner: saved.owner, id: saved.id };
      }
    } catch {
      /* A browser with storage off opens on nothing, as before. */
    }
  }

  private saveOpen() {
    try {
      if (this.ownerId && this.selectedId) {
        window.sessionStorage.setItem(OPEN_STORE_KEY, JSON.stringify({ owner: this.ownerId, id: this.selectedId }));
      } else {
        window.sessionStorage.removeItem(OPEN_STORE_KEY);
      }
    } catch {
      /* Nothing to do: a reload opens on nothing. */
    }
  }

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
      const saved = JSON.parse(raw) as { thumbStep?: unknown; detail?: unknown; pickerDevice?: unknown; pickerShut?: unknown; pickerBare?: unknown };
      if (saved.thumbStep === 0 || saved.thumbStep === 1 || saved.thumbStep === 2) this.thumbStep = saved.thumbStep;
      if (saved.detail === "compact" || saved.detail === "expanded") this.layerDetail = saved.detail;
      // The owner it names is checked when the tabs are drawn, not here: the
      // devices are not read yet, and a watch that has gone falls back to All
      // rather than to nothing. `pickerLook` was the Preview or Devices
      // choice, which went when a card became one picture (2026-09-20); an
      // older browser's copy of it is read past.
      if (typeof saved.pickerDevice === "string") this.pickerDevice = saved.pickerDevice;
      if (Array.isArray(saved.pickerShut)) this.pickerShut = saved.pickerShut.filter((k): k is string => typeof k === "string");
      if (typeof saved.pickerBare === "boolean") this.pickerBare = saved.pickerBare;
    } catch {
      /* A browser with storage off keeps the defaults. */
    }
  }

  private saveListView() {
    try {
      window.localStorage.setItem(LIST_STORE_KEY, JSON.stringify({
        thumbStep: this.thumbStep, detail: this.layerDetail, pickerDevice: this.pickerDevice,
        pickerShut: this.pickerShut, pickerBare: this.pickerBare,
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
    window.removeEventListener("click", this.leaveGuard, { capture: true });
    window.removeEventListener("focusin", this.sharedValueFocus);
    window.removeEventListener("pointerdown", this.addSheetOutside, { capture: true });
    window.removeEventListener("pointerdown", this.sideMenuOutside, { capture: true });
    this.removeEventListener(SCRUB_START, this.scrubStart);
    this.removeEventListener(SCRUB_END, this.scrubEnd);
    window.removeEventListener("hashchange", this.takeShareLink);
    void this.unsubscribe?.().catch(() => undefined);
    this.unsubscribe = undefined;
    if (this.templateTimer) window.clearInterval(this.templateTimer);
    if (this.debounceTimer) window.clearTimeout(this.debounceTimer);
    if (this.countdownTimer !== undefined) window.clearInterval(this.countdownTimer);
    if (this.sendTimer !== undefined) window.clearTimeout(this.sendTimer);
    if (this.watchStatusTimer !== undefined) window.clearInterval(this.watchStatusTimer);
    this.tour.stop();
    this.cancelGesture?.();
    // An object URL the document never revokes holds its bytes until the tab
    // closes, and the panel is torn down and rebuilt on every sidebar visit.
    this.pictures.clear();
  }

  /** The browser's own "Leave site?" question, when there is work to lose.
   * It cannot offer a Save button; no page can add one to that dialog. The
   * `returnValue` is for Safari, which ignores `preventDefault` here. */
  private beforeUnload = (e: BeforeUnloadEvent) => {
    if (!this.draft?.dirty) return;
    e.preventDefault();
    e.returnValue = "";
  };

  /**
   * Ask before a Home Assistant link takes the page somewhere else.
   *
   * Moving to another sidebar page is not an unload: Home Assistant swaps the
   * route in place and tears this panel down, so `beforeUnload` never runs and
   * the draft is gone without a word. Window capture runs before any of Home
   * Assistant's own click handling, so a "no" here stops the link outright.
   * Links inside the panel, and clicks that open a new tab, leave this page
   * where it is and go through.
   */
  private leaveGuard = (e: MouseEvent) => {
    if (!this.draft?.dirty) return;
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const path = e.composedPath();
    if (path.includes(this)) return;
    const link = path.find((n): n is HTMLAnchorElement => n instanceof HTMLAnchorElement && n.href !== "");
    if (!link || (link.target !== "" && link.target !== "_self")) return;
    const to = new URL(link.href, window.location.href);
    if (to.origin !== window.location.origin || to.pathname === window.location.pathname) return;
    if (this.confirmDiscard()) return;
    e.preventDefault();
    e.stopImmediatePropagation();
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
    // A different selection starts with Content and Look open and every other
    // card folded to its summary, whatever the last one had open; what is
    // open is a choice made per selection.
    if (changed.has("inspect")) {
      const before = changed.get("inspect") as Inspect | undefined;
      if (before === undefined || inspectKey(before) !== inspectKey(this.inspect)) {
        this.openSections = defaultOpenSections();
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
    if ((changed.has("ownerId") || changed.has("selectedId")) && this.restoreOpen === undefined) {
      this.saveOpen();
    }
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
    if (changed.has("demoing") && this.demoing) {
      const dialog = this.renderRoot.querySelector<HTMLDialogElement>("dialog.demo-dialog");
      if (dialog && !dialog.open) dialog.showModal();
    }
    if (changed.has("helpOpen") && this.helpOpen) {
      const dialog = this.renderRoot.querySelector<HTMLDialogElement>("dialog.help-dialog");
      if (dialog && !dialog.open) dialog.showModal();
    }
    // A push that lands inside the demo's refetch window is the fetch the tap
    // asked for, so the frozen picture is retaken. Outside the window nothing
    // is taken, and the comparison below still re-renders the same face.
    if (changed.has("hass") && this.demoing && Date.now() < this.demoRefetchUntil) {
      this.demoStates = { ...this.hass.states };
      this.requestUpdate();
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
    // Escape shuts the Add sheet first, wherever the keyboard is in it: the
    // sheet is the thing on top.
    if (e.key === "Escape" && this.addSheet) {
      e.preventDefault();
      this.closeAddSheet();
      return;
    }
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
    // / opens the Add sheet with the keyboard in its search, or puts the
    // keyboard back there when the sheet is already open. Never while text is
    // being typed, where a slash is a slash.
    if (slashOpensAddSearch(e, inTextField, dialogOpen) && this.canAddHere) {
      e.preventDefault();
      if (this.addSheet) this.focusAddSearch();
      else this.openAddSheet();
      return;
    }
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
    const page = this.page;
    this.mutate((c) => {
      const rows = c.elements.filter((e) => !isAttachedTap(c, e));
      const taps = c.elements.filter((e) => isAttachedTap(c, e));
      const i = rows.findIndex((e) => e.payload.id === id);
      if (i < 0) return;
      // The step is to the next row the list is showing, not the next row in
      // the document. On a paged document the layers in between are on another
      // page: swapping with one of those would reorder the layer past nothing
      // the author can see and leave the list looking unchanged.
      const paged = usesPages(c);
      let j = i + dir;
      while (j >= 0 && j < rows.length && paged && !layerDrawsOnPage(rows[j]!, page)) j += dir;
      if (j < 0 || j >= rows.length) return;
      const el = rows[i]!;
      const neighbour = rows[j]!;
      // Taken out and put back rather than swapped, so a step that passed over
      // a layer on another page lands beside the row it really stepped to.
      rows.splice(i, 1);
      rows.splice(j, 0, el);
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
        const restored = this.owners.find((o) => o.owner_watch_id === this.restoreOpen?.owner);
        const withData = restored ?? this.owners.find((o) => o.complication_count > 0) ?? this.owners[0]!;
        await this.selectOwner(withData.owner_watch_id);
      }
      // No device came back with it, so no list will spend it.
      if (this.owners.length === 0) this.restoreOpen = undefined;
    } catch (err) {
      this.loadError = `Could not load devices: ${errText(err)}`;
    }
    this.linkReady = true;
    void this.openPendingLink();
    // Cut the complications that draw several shapes into one document per
    // shape, on this first open. It reads every owner's records itself, does
    // nothing unless there is something to cut, skips a device whose app is
    // too old to resolve a shared slot by shape, and never writes without
    // proving first that the records can be put back.
    void autoSplitShapes(this.hass, this.owners, (notice) => {
      this.splitNotice = notice;
      void this.loadRecords();
    });
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
      await this.listenTo(ownerId);
      // The other devices first: the picker's grid and every Devices
      // menu are read off those lists, and a seat count taken from a list
      // that has not landed would offer a seat something already holds.
      await this.loadOtherLists();
      await this.loadRecords();
    } finally {
      this.ownerBusy = false;
    }
  }

  /**
   * Follow one device's commits, dropping the previous device's feed.
   *
   * Neither half may stop the device from loading. The old feed can be gone
   * on the server already: after a restart the socket resubscribes, and a
   * resubscribe sent before the integration is ready fails and keeps the old
   * id, whose unsubscribe then answers "Subscription not found". Thrown from
   * here, that left every list empty behind a "Could not load devices" line,
   * which reads as every complication gone. The lists are the truth either
   * way; the feed only says when to read them again.
   */
  private async listenTo(ownerId: string) {
    const off = this.unsubscribe;
    this.unsubscribe = undefined;
    try {
      await off?.();
    } catch {
      // Already gone on the server, which is what was asked.
    }
    try {
      this.unsubscribe = await subscribeChanges(this.hass, ownerId, () => void this.loadRecords());
    } catch {
      // No live feed: the lists still load, and every write reads them again.
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
        else this.selectNone();
      } else if (!this.draft) {
        // A reload opens what was open before it. Nothing open leaves the
        // stage's pick-one card: the picker never opens unasked.
        const restore = this.restoreOpen;
        this.restoreOpen = undefined;
        const record = restore?.owner === this.ownerId
          ? this.records.find((r) => r.id === restore.id)
          : undefined;
        if (record) this.openRecord(record);
        else this.selectNone();
      }
    } catch (err) {
      this.loadError = `Could not load complications: ${errText(err)}`;
    }
    this.refreshSeatClash();
    this.warmPictures();
  }

  /**
   * Fetch the pictures the picker's cards will want, before anybody opens it.
   *
   * Holding a picture only pays off from the second open onwards, and the open
   * that hurts is the first one: a camera proxy takes four seconds to answer
   * here, and a grid that asks seven of them at once is a grid that fades in
   * for four seconds every time the page is fresh. The panel is sat in front of
   * for a while before that dialog is ever opened, so the waiting is done then
   * instead, out of the way and off the critical path.
   *
   * On idle, because this parses and compiles every document in the home to
   * find out which entities are pictures at all. That fills the parse cache
   * too, so the first open skips both halves of the work it used to do.
   */
  private warmPictures() {
    if (this.pictureWarmQueued) return;
    this.pictureWarmQueued = true;
    const run = () => {
      this.pictureWarmQueued = false;
      const lists = [this.records, ...[...this.otherLists.values()].map((l) => l.records)];
      // One card per link, but a link's copies are separate records and the
      // cache is keyed by entity, so asking twice for the same camera costs
      // one fetch. No need to dedupe the records themselves.
      for (const records of lists) {
        for (const record of records) {
          if (record.deleted) continue;
          for (const id of this.recordPreview(record)?.entities.map((e) => e.entityId) ?? []) {
            const url = this.hass.states[id]?.attributes?.entity_picture;
            if (typeof url === "string") this.pictures.urlFor(id, url);
          }
        }
      }
    };
    // Read off the object rather than tested with `in`: the DOM types promise
    // this exists, so `in` narrows the other branch to `never`, and Safari only
    // grew it in 17.4. A timer is the same thing a beat later.
    const idle = (window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
    }).requestIdleCallback;
    if (typeof idle === "function") idle.call(window, run, { timeout: 4_000 });
    else window.setTimeout(run, 2_000);
  }

  /** Nothing open. The panel used to open the first record in the list here,
   * on load and after a delete, so a reload silently put a complication on
   * screen nobody had asked for. Now the stage says how to pick one. */
  private selectNone() {
    this.selectedId = undefined;
    this.clearDraft();
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
    // Where the last write landed was about the complication that is going.
    this.copyStatus = undefined;
    this.copyOpen = undefined;
    // An armed trash belongs to the devices row of the complication leaving.
    this.disarmPlaceTrash();
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
      this.draft = new Draft(parseConfig(record.document), record.revision);
      this.savedName = String(record.document?.name ?? "");
      const schema = Number(record.document?.schemaVersion ?? 0);
      const unknown = auditUnknownKeys(record.document);
      if (schema > this.maxSchemaVersion) {
        this.readOnlyReason = `This document is schema v${schema}; this integration understands up to v${this.maxSchemaVersion}. Update the Wrist Assistant integration to edit it.`;
      } else if (unknown.length > 0) {
        this.readOnlyReason = `This document has fields the panel does not understand, so saving would drop them: ${unknown.slice(0, 5).join(", ")}${unknown.length > 5 ? ` and ${unknown.length - 5} more` : ""}. Update the integration to edit it.`;
      } else {
        // A document that still draws several shapes on a device whose app
        // cannot resolve a shared slot by shape. Saving it would mean cutting
        // it up, and this device could not follow. See `splitShapes.ts`.
        this.readOnlyReason = editBlockedBySplitGate(this.draft.config, this.selectedOwner);
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

  /**
   * The seat a new complication of this shape takes on the device being
   * edited, or -1 when every one of them is taken.
   *
   * A slot holds at most one document per shape, so a rectangular design and a
   * circular one can share a seat and a face keeps drawing both. Without a
   * shape (a Control Center control) nothing can share, so the first seat
   * nothing at all holds is the answer.
   */
  private freeSlot(family?: FamilyKind): number {
    return this.freeSlotOn(this.ownerId ?? "", family);
  }

  /** The same question on any device of this home. */
  private freeSlotOn(ownerId: string, family?: FamilyKind): number {
    return freeSlotForFamily(family, this.slotHoldersOn(ownerId), this.blockedSlotsOn(ownerId));
  }

  // ── the home's other devices ──────────────────────────────────────────

  /**
   * Read every other device's list, for the questions that cross them: which
   * names are taken, and which seats.
   *
   * One request per device, and there are two or three of them in a household.
   * It is not on the change subscription: that is per device, so nothing here
   * fires when another one moves, and refetching all of them on every edit of
   * the open one would be a request per keystroke's save.
   */
  private async loadOtherLists() {
    const ids = this.owners
      .filter((o) => o.owner_watch_id !== this.ownerId && !o.is_orphan)
      .map((o) => o.owner_watch_id);
    const next = new Map<string, { records: ComplicationRecord[]; occupied: OccupiedSlot[]; appliedToken?: number | null; token: number }>();
    for (const id of ids) {
      try {
        const reply = await fetchList(this.hass, id);
        next.set(id, {
          records: reply.records,
          occupied: reply.occupied
            ?? (reply.presets ?? []).map((p): OccupiedSlot => ({ slot: p.slot, name: p.name, kind: "preset", home: "" })),
          appliedToken: reply.applied_token,
          token: reply.token,
        });
      } catch {
        // A device that will not answer simply is not offered a copy; the
        // write below refuses rather than putting one in a taken seat.
      }
    }
    this.otherLists = next;
    this.refreshSeatClash();
  }

  /**
   * What each document on one device sits in, and which shape it draws there.
   *
   * A slot holds at most one document per shape, so a new complication has to
   * know both to find a seat. Occupied entries (an iPhone preset, a custom on
   * another home) are not in here: the panel cannot read their shapes, so they
   * hold a whole seat and go to `freeSlotForFamily` as blocked.
   *
   * Two shapes only share a seat where the device's app resolves a placed slot
   * by shape, which is the `ownerCanSplit` gate. Below it, every holder is
   * reported as holding the whole seat: an older app picks the first document
   * at the slot whatever shape it draws, so a shared seat there is a face that
   * draws the wrong design. A device this panel has no entry for reads as too
   * old, the same way the split gate reads it.
   */
  private slotHoldersOn(ownerId: string): SlotHolder[] {
    const list = ownerId === this.ownerId
      ? { records: this.records }
      : this.otherLists.get(ownerId);
    if (!list) return [];
    const held = list.records.filter((r) => !r.deleted).map((r) => ({
      slotIndex: Number(r.document?.slotIndex ?? -1),
      families: shapesOf(r),
    }));
    return seatHoldersFor(held, ownerCanSplit(this.ownerOf(ownerId)));
  }

  /** The seats nothing of ours can share on one device. */
  private blockedSlotsOn(ownerId: string): { slot: number }[] {
    const list = ownerId === this.ownerId
      ? { occupied: this.occupied }
      : this.otherLists.get(ownerId);
    return list ? list.occupied.map((o) => ({ slot: o.slot })) : [];
  }

  /**
   * What one device's seats hold, or undefined when its list never came back.
   *
   * `loadOtherLists` drops a device that would not answer, so the panel has no
   * entry for it at all. Reading that as an empty device is what let four
   * copies pile into seat 0: with nothing held, every seat looks free, so
   * every copy takes the first one and the device's picker draws one row for
   * the lot. Every write that picks a seat on another device asks this first
   * and refuses on undefined, and takes its holders from the answer, so there
   * is no way to pick a seat without having asked.
   *
   * The badges that only say "full" go on reading an absent list as empty
   * (`freeSlotOn` over `slotHoldersOn`). A badge writes nothing, and a device
   * drawn as having room is a better guess than one drawn as full while its
   * list is still on the way; the write behind it refuses anyway.
   */
  private seatsOn(ownerId: string): { held: SlotHolder[]; blocked: { slot: number }[] } | undefined {
    if (ownerId !== this.ownerId && !this.otherLists.has(ownerId)) return undefined;
    return { held: this.slotHoldersOn(ownerId), blocked: this.blockedSlotsOn(ownerId) };
  }

  /** Which of these devices could not be read, by the name the author knows
   * them by. Empty is the only answer a write may carry on from. */
  private unreadableAmong(targets: readonly { ownerId: string; label: string }[]): string[] {
    return targets.filter((t) => this.seatsOn(t.ownerId) === undefined).map((t) => t.label);
  }

  /** Slots something already holds on one device, its own copies included. */
  private usedSlotsOn(ownerId: string): number[] {
    const list = ownerId === this.ownerId
      ? { records: this.records, occupied: this.occupied }
      : this.otherLists.get(ownerId);
    if (!list) return [];
    return [
      ...list.records.filter((r) => !r.deleted).map((r) => Number(r.document?.slotIndex ?? -1)),
      ...list.occupied.map((o) => o.slot),
    ];
  }

  // ── two documents in one seat ─────────────────────────────────────────
  //
  // A seat holds at most one document per shape, and a device's picker draws
  // one row per seat, so a second document of the same shape in the same seat
  // is a row nobody ever sees. The rules that write a seat have been taught
  // not to make one; these three find the ones already written, say so, and
  // move them on the author's word. The finding and the plan are pure and
  // live in `seatRepair.ts`.

  /** Every device in the home as the clash rule reads it. The Library is not
   * one: nothing draws the shelf, so two documents in one of its seats are
   * two documents waiting, not a row that went missing. */
  private seatDevices(): SeatDevice[] {
    const out: SeatDevice[] = [];
    const add = (ownerId: string, records: readonly ComplicationRecord[], occupied: readonly OccupiedSlot[]) => {
      if (isLibraryOwner(this.ownerOf(ownerId))) return;
      out.push({
        ownerId,
        label: this.ownerName(ownerId),
        records: records.filter((r) => !r.deleted).map((r): SeatRecord => ({
          id: r.id,
          name: String(r.document?.name ?? "").trim() || "Untitled",
          slotIndex: Number(r.document?.slotIndex ?? -1),
          families: shapesOf(r),
          control: hasControlOf(r),
          token: r.token,
        })),
        blocked: occupied.map((o) => ({ slot: o.slot })),
        canShare: ownerCanSplit(this.ownerOf(ownerId)),
      });
    };
    if (this.ownerId) add(this.ownerId, this.records, this.occupied);
    for (const [ownerId, list] of this.otherLists) {
      if (ownerId === this.ownerId) continue;
      add(ownerId, list.records, list.occupied);
    }
    return out;
  }

  /** Read the lists that have landed and put the banner up, or take it down.
   * Called wherever a list lands, since a clash can as easily be made on
   * another device as found on this one. */
  private refreshSeatClash() {
    const words = seatClashMessage(findSeatClashes(this.seatDevices()));
    this.seatClash = words === "" ? undefined : words;
  }

  /**
   * Move the clashing documents apart, now.
   *
   * Never on its own: a move changes where a complication sits on somebody's
   * watch, and a panel that quietly rearranged a home on load would be worse
   * than the row it fixed. The lists are read again first, because the plan is
   * about seats and a seat freed since the banner went up is the whole reason
   * to look. The oldest write in each seat stays where it is, so whatever a
   * face is already drawing goes on drawing.
   */
  private async fixSeatClashes() {
    if (!this.hass.user?.is_admin || this.saving) return;
    this.saving = true;
    this.saveError = undefined;
    this.copyStatus = undefined;
    const failed: string[] = [];
    let said: string | undefined;
    try {
      await this.loadOtherLists();
      await this.loadRecords();
      const plan = planSeatRepair(this.seatDevices());
      const done: typeof plan.moves = [];
      for (const move of plan.moves) {
        const record = this.recordAt(move.ownerId, move.recordId);
        if (!record?.document) {
          failed.push(`${move.name} is no longer on ${move.label}`);
          continue;
        }
        // The open document moves through its own draft or not at all: saving
        // it from here would move the revision under unsaved work.
        if (move.ownerId === this.ownerId && move.recordId === this.selectedId && this.draft?.dirty) {
          failed.push(`${move.name} has unsaved changes, so save it here first`);
          continue;
        }
        try {
          const doc = { ...record.document, slotIndex: move.to };
          const out = await saveRecord(this.hass, move.ownerId, doc, record.revision);
          if (out.ok) done.push(move);
          else failed.push(`${move.name}: ${out.message ?? out.error ?? "the save failed"}`);
        } catch (err) {
          failed.push(`${move.name}: ${errText(err)}`);
        }
      }
      const lines = [seatRepairSummary({ moves: done, stuck: plan.stuck })];
      if (failed.length > 0) lines.push(`${joinNames(failed)}.`);
      said = lines.join(" ");
    } catch (err) {
      this.saveError = errText(err);
    } finally {
      this.saving = false;
    }
    // The banner goes up after the lists are read back, the way every other
    // cross-device write puts its own up: a reload with nothing open clears
    // the draft, and that takes this line with it.
    await this.reloadAfterRowWrite(...this.seatDevices().map((d) => d.ownerId));
    if (said !== undefined) this.copyStatus = said;
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
    const wait = sendWaitMs(this.selectedOwner?.device_kind);
    // The library is not waiting for anything. Nothing polls it, nothing is
    // pushed to it and nothing ever acks, so a wait of any length would be a
    // spinner that resolves to exactly where it started.
    if (wait === 0) {
      this.sendTimer = undefined;
      this.sendPending = false;
      return;
    }
    this.sendPending = true;
    this.sendTimer = window.setTimeout(() => {
      this.sendTimer = undefined;
      this.sendPending = false;
      // The watch may have stopped polling meanwhile; refresh so the button
      // says "not connected" rather than offering a wake that goes nowhere.
      void this.loadRecords();
    }, wait);
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

  /** Let the open complication's picture entities go, so the next card that
   * draws one fetches a new frame. Called after a save: everything else in the
   * grid keeps the copy it already has. */
  private dropCachedPictures() {
    for (const id of this.compiled?.entities.keys() ?? []) this.pictures.drop(id);
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
    // A calendar, to-do or forecast list is the same trap as a history chart:
    // its items come from a service call rather than from Jinja, so adding one
    // or pointing it at another calendar leaves the document byte-identical.
    // Without this the new list drew its sample rows until the 30-second
    // heartbeat came round, which read as a preset that ignored the entity.
    const listSignature = listItemsRequests(this.draft.config).signature;
    if (this.compiled?.document !== this.compiledDocument
      || historySignature !== this.historySignature
      || listSignature !== this.listSignature) {
      this.compiledDocument = this.compiled?.document;
      this.historySignature = historySignature;
      this.listSignature = listSignature;
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
      addInlineText: () => this.mutate((c) => { c.inline ??= blankInline(); }),
      savedName: this.savedName,
      tapAreaShown: this.showTaps,
      showTapArea: (on) => this.setShowTaps(on),
      openSections: this.openSections,
      toggleSection: (id) => this.toggleSection(id),
      helpSections: this.helpSections,
      toggleHelp: (id) => this.toggleHelp(id),
      tour: { playing: this.touring, toggle: () => { if (this.touring) this.stopTour(); else this.playTour(); } },
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
   *
   * The layers come from the record's own raw document, so nothing is fetched
   * for them. They are parsed behind a thunk and only once: this list is rebuilt
   * on every host build, and the layers are read only for a row that is both
   * ticked and narrowed. A document that no longer parses lists no layers rather
   * than taking the picker down with it.
   */
  private documentList(): { id: string; name: string; layers: () => CElement[]; refreshMinutes: number }[] {
    return this.records
      .filter((r) => !r.deleted && r.document !== null)
      .filter((r) => r.ownerWatchId === "" || r.ownerWatchId === this.ownerId)
      .map((r) => {
        const name = typeof r.document?.name === "string" ? r.document.name.trim() : "";
        const raw = r.document;
        let parsed: CElement[] | undefined;
        const layers = (): CElement[] => {
          if (parsed === undefined) {
            try {
              parsed = raw === null ? [] : parseConfig(raw).elements;
            } catch {
              parsed = [];
            }
          }
          return parsed;
        };
        // Read raw rather than parsed: the budget hint needs only this number,
        // and parsing is what `layers` defers.
        const minutes = raw?.refreshMinutes;
        const refreshMinutes = typeof minutes === "number" && minutes > 0 ? minutes : 0;
        return { id: r.id.toUpperCase(), name: name === "" ? "Unnamed" : name, layers, refreshMinutes };
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
    this.disarmPageTrash();
    if (!keepSelection) this.dropOffPageSelection();
  }

  /** Show a page because the user asked for it, which drops any tour: a tap
   * during a tour takes over, the same rule the watch follows. */
  private setPage(page: number) {
    this.stopTour();
    this.disarmPageTrash();
    this.showPage(page);
  }

  /** Ask before deleting a page: the trash reads "sure?" until it is pressed
   * again, or until this runs out. */
  private armPageTrash(page: number) {
    window.clearTimeout(this.pageTrashTimer);
    this.pageTrashArm = page;
    this.pageTrashTimer = window.setTimeout(() => { this.pageTrashArm = undefined; }, PAGE_TRASH_ARM_MS);
  }

  private disarmPageTrash() {
    window.clearTimeout(this.pageTrashTimer);
    this.pageTrashArm = undefined;
  }

  /** Ask before taking a design off a device, the way a page's trash asks:
   * the trash reads "sure?" until it is pressed again, or until this runs
   * out. The write deletes that device's record, so it earns the question. */
  private armPlaceTrash(ownerId: string) {
    window.clearTimeout(this.placeTrashTimer);
    this.placeTrashArm = ownerId;
    this.placeTrashTimer = window.setTimeout(() => { this.placeTrashArm = undefined; }, PAGE_TRASH_ARM_MS);
  }

  private disarmPlaceTrash() {
    window.clearTimeout(this.placeTrashTimer);
    this.placeTrashArm = undefined;
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

  /** Open or shut one inspector card (or a card's More line); every other
   * card stays as it is. */
  private toggleSection(id: string) {
    const next = new Set(this.openSections);
    if (next.has(id)) next.delete(id);
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
    // With nothing open there is nothing the device would be asked to draw,
    // so the stage's "pick one" card stands, not the update message. The
    // device the panel loaded with is a place to read lists from, not a
    // choice anyone made; the gate comes up once a complication on it opens.
    if (this.selectedId === undefined && this.draft === undefined) return true;
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

  /** The place being edited, as a sentence names it. A device is "this
   * watch"; Unassigned is not a device, so it is named rather than pointed
   * at: "this unassigned" is not English and "this library" was the word
   * nobody reading the picker sees any more. */
  private get placePhrase(): string {
    return isLibraryOwner(this.selectedOwner) ? UNASSIGNED_LABEL : `this ${this.deviceWord}`;
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
    // One shape per document, so there is nothing to choose: the active shape
    // is the document's own. A document an older panel wrote with several of
    // them opens on the first in the panel's order.
    const own = supportedFamilies(cfg)[0];
    if (own !== undefined) this.activeFamily = own;
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
    if (!ownerSupportsControls(this.selectedOwner)) return false;
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
    // Inline has one thing to edit, its line, so it opens picked rather than
    // on the Complication card with the line a click away.
    if (!this.controlView && this.activeFamily === "inline" && cfg.inline) this.inspect = { kind: "family" };
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
   * The x on the Control Center tab, clicked.
   *
   * Always asks, unlike a shape, whose confirmation is skipped when the shape
   * holds nothing: every control was written by hand, so there is always
   * something to lose. The tab is up while the x is reachable, so the view has
   * to move afterwards, and a document that has a removable control has a
   * shape to move to.
   *
   * Only a document written before the add button went can reach this: a
   * control is its own document now, and a control-only document cannot lose
   * the one thing it is (`canRemoveControl`). So the confirmation no longer
   * offers to add it back here. The New dialog's Control Center tile is where
   * a control comes from.
   */
  private removeControl() {
    const cfg = this.draft?.config;
    if (!cfg || !canRemoveControl(cfg)) return;
    const named = describeValue(cfg.control!.title, describeContext(this.host())).trim();
    if (!window.confirm(`Remove the Control Center control${named === "" ? "" : ` "${named}"`}? This deletes the control alone, so every shape keeps its layers. To get it back, make a new Control Center complication.`)) return;
    this.mutate((c) => { setControlShown(c, false); });
    this.controlView = false;
    this.ensureActiveFamily();
  }

  /**
   * Answered entirely by the New dialog, which is what stops a watch filling
   * with documents that all read "New complication" on the wrist.
   *
   * The draft is made on the first ticked device, in the picker's order, so a
   * complication ticked for someone else's watch alone is not built on this one
   * and then saved elsewhere. Moving the editor there can be refused (a dirty
   * draft the author chose to keep), and then nothing is created at all.
   *
   * Every other ticked device gets its own record, written now. They are
   * separate complications from that moment: a design is one shape on one
   * device, so editing the one that opens changes nothing on the others, and
   * "Duplicate as" is how a finished look travels.
   *
   * Nothing ticked is an answer of its own: the design is made in the home's
   * Library, which is a real place rather than a device borrowed for the
   * afternoon, and it is written there on the first Save.
   */
  private async createNew() {
    const name = this.newName.trim();
    const kind = this.newKind;
    if (name === "" || kind === undefined || this.newNameProblem() !== undefined) return;
    const family = kind === "control" ? undefined : this.newFamily;
    if (kind !== "control" && family === undefined) return;
    const owners = this.deviceOwnersFor(newTargets([...this.newOwners]));
    const here = owners[0];
    if (!here) return;
    this.closeNewDialog();
    if (here.ownerId !== this.ownerId) {
      await this.selectOwner(here.ownerId);
      if (this.ownerId !== here.ownerId) return;
    }
    // One record per ticked device, each with its own seat. The first is the
    // one that opens; the rest are written as they are made.
    const plan = newRecords(owners, family, (ownerId, f) => this.freeSlotOn(ownerId, f));
    const mine = plan[0]!;
    const config = kind === "control"
      ? newControlConfig(name, mine.slotIndex, family)
      : newConfig(name, mine.slotIndex, family ?? null);
    // Ticked for several devices, it is one design on all of them: every
    // record carries the same link, so an edit to one is written to the rest.
    if (owners.length > 1) config.linkId = newId();
    if (!this.startNew(config)) return;
    // The author asked for a control, so its tab is the one up on arrival and
    // its card is the one open.
    if (kind === "control") {
      this.openSections = new Set(["control"]);
      this.controlView = true;
    }
    await this.createOnOthers(config, owners.slice(1));
  }

  /**
   * Make the same fresh complication on the other ticked devices, now.
   *
   * Written rather than held for the first Save, because there is no save that
   * writes to several devices any more: each of these is its own record with
   * its own id and its own seat from the start. A device with no seat left is
   * named and the rest still go, since one full watch holding up somebody
   * else's copy helps nobody.
   */
  private async createOnOthers(config: CustomComplicationConfig, owners: readonly DeviceOwner[]) {
    if (owners.length === 0) return;
    const made: string[] = [];
    const failed: string[] = [];
    this.saving = true;
    try {
      await this.loadOtherLists();
      // A device whose list did not come back shows no seats at all, so every
      // seat would look free and the copy would land on whatever holds seat 0.
      const unread = this.unreadableAmong(owners);
      if (unread.length > 0) {
        this.saveError = unreadableRefusal(unread);
        return;
      }
      const plan = newRecords(owners, supportedFamilies(config)[0], (ownerId, f) => this.freeSlotOn(ownerId, f));
      for (const row of plan) {
        if (row.slotIndex < 0) {
          failed.push(`${row.label} has no free seat (iPhone presets count too)`);
          continue;
        }
        const copy = copyForOwner(config, {
          id: newId(),
          slotIndex: row.slotIndex,
          hidden: false,
          families: [...config.supportedFamilies],
        });
        try {
          const out = await saveRecord(this.hass, row.ownerId, new Draft(copy, null).encoded(), null);
          if (out.ok) made.push(row.label);
          else failed.push(`${row.label}: ${out.message ?? out.error ?? "the save failed"}`);
        } catch (err) {
          failed.push(`${row.label}: ${errText(err)}`);
        }
      }
    } finally {
      this.saving = false;
    }
    await this.loadOtherLists();
    const lines: string[] = [];
    if (failed.length > 0) lines.push(`${joinNames(failed)}.`);
    this.copyStatus = lines.length > 0 ? lines.join(" ") : undefined;
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
    if (!asNew && !this.draft.dirty && this.draft.baseRevision !== null) return;
    if (!asNew && !this.slotChosen) {
      // Slots are auto-assigned and there is no picker; this only trips when
      // the draft was created with every slot taken.
      this.saveError = "The watch is full. Delete a complication first.";
      return;
    }
    // A document an older panel wrote, with several shapes in it. It opens and
    // it draws; writing it back would put the old form in the store again.
    const refusal = saveRefusal(this.draft.config);
    if (refusal !== undefined) {
      this.saveError = refusal;
      return;
    }
    this.saving = true;
    this.saveError = undefined;
    try {
      let draft = this.draft;
      if (asNew) {
        const slot = this.freeSlot(supportedFamilies(draft.config)[0]);
        if (slot < 0) {
          this.saveError = "The watch is full (iPhone presets count too), so there is nowhere to put a copy. Delete a complication first.";
          return;
        }
        const cfg = structuredClone(draft.config);
        cfg.id = newId();
        cfg.slotIndex = slot;
        // A copy is a design of its own, not one more device of this one.
        delete cfg.linkId;
        draft = new Draft(cfg, null);
      }
      const result = await saveRecord(this.hass, this.ownerId, draft.encoded(), draft.baseRevision);
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
      // The same edit on every other device this design is on.
      await this.saveLinkedSiblings(draft.config, result.record.id);
      this.recompile();
      // The card for what was just saved goes back to the grid, and it should
      // not be drawing a frame from before the edit. Only this document's own
      // entities are let go, so every other card in the grid stays instant.
      this.dropCachedPictures();
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

  private async deleteCurrent(everywhere = true) {
    if (!this.draft || !this.ownerId || !this.selectedId || !this.canEdit) return;
    if (this.draft.baseRevision === null) {
      // Never saved: just drop it.
      this.clearDraft();
      this.selectedId = undefined;
      this.selectNone();
      return;
    }
    await this.deleteSaved(this.selectedId, this.draft.baseRevision, this.ownerId, everywhere);
  }

  /** Delete one saved complication on the server: the open one from the
   * inspector's Delete, or any row from the picker's, on whichever device that
   * row's copy sits. A conflict on the open one opens the conflict banner, as a
   * save's would; on another row it is a plain error, since there is no draft
   * of it to reconcile. */
  private async deleteSaved(id: string, revision: number, ownerId = this.ownerId, everywhere = true) {
    if (!ownerId) return;
    const open = ownerId === this.ownerId && id === this.selectedId;
    // Read before the delete: the record is gone from the lists after it.
    // `everywhere` false keeps the design's copies on the other devices.
    const link = everywhere ? this.linkOf(ownerId, id) : undefined;
    this.saving = true;
    try {
      const result = await deleteRecord(this.hass, ownerId, id, revision);
      if (!result.ok) {
        if (result.error === "conflict" && open) this.conflict = { current: result.current ?? null, message: result.message ?? "This complication changed on the server." };
        else this.saveError = result.message ?? result.error ?? "Delete failed";
        return;
      }
      if (open) {
        this.clearDraft();
        this.selectedId = undefined;
      }
      // Delete is the whole design: every device it is on. Taking it off one
      // device is the card's Devices menu.
      const kept = await this.deleteLinkedSiblings(link, ownerId, id);
      if (kept.length > 0) {
        this.saveError = `Deleted here, but not on ${joinNames(kept)}: a copy changed on the server. Delete it from its own card.`;
      }
      await this.loadRecords();
      // A row on another device is gone from that device's list, not this
      // one's, so the list the picker draws it from is the one to re-read.
      await this.loadOtherLists();
    } catch (err) {
      this.saveError = errText(err);
    } finally {
      this.saving = false;
      this.confirmDelete = false;
      this.pickerConfirmDelete = undefined;
    }
  }

  // ── linked copies ─────────────────────────────────────────────────────
  //
  // A design on several devices is one record per device, each carrying the
  // same `linkId`. The pure rules are in copies.ts; what is here is the
  // reading of the home's lists and the writes that keep the copies alike.

  /** Every live record in the home, each with the device it sits on. The
   * open device's come from the list this panel watches, the rest from the
   * lists read for the other devices. */
  private allRecords(): { ownerId: string; record: ComplicationRecord }[] {
    const out: { ownerId: string; record: ComplicationRecord }[] = [];
    if (this.ownerId) {
      for (const record of this.records) if (!record.deleted) out.push({ ownerId: this.ownerId, record });
    }
    for (const [ownerId, list] of this.otherLists) {
      if (ownerId === this.ownerId) continue;
      for (const record of list.records) if (!record.deleted) out.push({ ownerId, record });
    }
    return out;
  }

  private linkOfRecord(record: ComplicationRecord): string | undefined {
    const raw = record.document?.linkId;
    return typeof raw === "string" && raw !== "" ? raw.toUpperCase() : undefined;
  }

  private linkOf(ownerId: string, id: string): string | undefined {
    const hit = this.allRecords().find((e) => e.ownerId === ownerId && e.record.id === id);
    return hit ? this.linkOfRecord(hit.record) : undefined;
  }

  /** The other copies of one link, the named record left out. */
  private linkedSiblings(link: string | undefined, exceptOwnerId: string, exceptId: string) {
    if (link === undefined) return [];
    return this.allRecords().filter((e) =>
      this.linkOfRecord(e.record) === link && !(e.ownerId === exceptOwnerId && e.record.id === exceptId));
  }

  /** How many devices the open complication is on, for the words Delete uses. */
  private openLinkCount(): number {
    if (!this.ownerId || !this.selectedId) return 1;
    return 1 + this.linkedSiblings(this.draft?.config.linkId, this.ownerId, this.selectedId).length;
  }

  /**
   * Write a save of one copy to every other copy of its link.
   *
   * Each sibling gets the saved document wearing its own id, seat and hidden
   * flag, against the revision it was last read at, so a sibling somebody
   * else changed meanwhile is reported rather than overwritten. The lists are
   * read again first for those revisions.
   */
  private async saveLinkedSiblings(saved: CustomComplicationConfig, savedId: string) {
    if (saved.linkId === undefined || !this.ownerId) return;
    await this.loadOtherLists();
    const siblings = this.linkedSiblings(saved.linkId, this.ownerId, savedId);
    if (siblings.length === 0) return;
    const failed: string[] = [];
    for (const { ownerId, record } of siblings) {
      const doc = linkedDocumentFor(saved, {
        id: record.id,
        slotIndex: Number(record.document?.slotIndex ?? 0),
        hidden: record.document?.hidden === true,
      });
      try {
        const out = await saveRecord(this.hass, ownerId, new Draft(doc, record.revision).encoded(), record.revision);
        if (!out.ok) failed.push(this.ownerName(ownerId));
      } catch {
        failed.push(this.ownerName(ownerId));
      }
    }
    await this.loadOtherLists();
    if (failed.length > 0) {
      this.saveError = `Saved here, but not on ${joinNames(failed)}: the copy there changed on the server. Save again.`;
    }
  }

  /** Delete every other copy of one link. The devices whose copy would not
   * go are returned by name. */
  private async deleteLinkedSiblings(link: string | undefined, ownerId: string, id: string): Promise<string[]> {
    const kept: string[] = [];
    for (const s of this.linkedSiblings(link, ownerId, id)) {
      try {
        const gone = await deleteRecord(this.hass, s.ownerId, s.record.id, s.record.revision);
        if (!gone.ok) kept.push(this.ownerName(s.ownerId));
      } catch {
        kept.push(this.ownerName(s.ownerId));
      }
    }
    return kept;
  }

  /** What to call one device in a line the author reads. */
  private ownerName(ownerId: string): string {
    const owner = this.owners.find((o) => o.owner_watch_id === ownerId);
    return owner ? ownerLabel(owner) : "another device";
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
  private entityStateFor(id: string, iconName: string, useTestValues: boolean, cachedPicture = false): EntityState | undefined {
    // Demo mode reads the frozen house instead, so the face holds still the way
    // a watch does between fetches. One read point, so templates, history and
    // lists (which already only refetch on a refresh tap) and plain entity
    // states all go stale together.
    const s = (this.demoStates ?? this.hass.states)[id];
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
      //
      // A card in the picker reads the cached copy instead. A camera proxy
      // answers no-store and takes a new frame per request, so a grid of cards
      // refetched every camera in the house on every open; one held copy per
      // entity is what makes the dialog open at once. The complication being
      // edited keeps the live address, since a crop is adjusted against a
      // current frame. Undefined means the bytes have not landed yet, and the
      // layer draws the same placeholder the watch does before its own first
      // fetch.
      const cached = cachedPicture ? this.pictures.urlFor(id, attrs.entity_picture) : attrs.entity_picture;
      if (cached !== undefined) entry.entityPicture = cached;
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
      title="Show every tap zone, labelled with what it does, over a dimmed face. With a layer selected, only its tap zone shows, and you can drag its corners to size it."
      @click=${() => this.setShowTaps(!this.showTaps)}><span class="glyph">☞</span><span class="word">Show taps</span></button>`;
  }

  /**
   * Full color or a tinted surface. Many watch faces draw complications in one
   * tint, keeping only how see-through each part is, so color by value and
   * dark fills can look nothing like the full color preview. A tinted iPhone
   * Home Screen does the opposite: the tile's ground goes and every layer is
   * painted in the tint at the brightness it was drawn in. Which one the menu
   * previews follows the shape, since a Home Screen tile is never on a watch.
   *
   * On a phone owner's Lock Screen shape the untinted row is not full color at
   * all: iOS draws every Lock Screen widget desaturated and there is no way to
   * ask it not to, so the preview stands in white and the row says so.
   */
  private renderTintTool() {
    const t = this.tintState();
    const off = !this.draft || this.parseError !== undefined;
    return html`<span class="inbox tint-box ${t.on !== undefined ? "on" : ""}" title=${t.title}>
      <span class="pre">Color</span>
      <span class="case-tool" data-menu="tint">
        <button class="case-pick" ?disabled=${off} aria-haspopup="listbox" aria-expanded=${this.openMenu === "tint" ? "true" : "false"}
          aria-label=${t.aria} @click=${() => this.toggleMenu("tint")}>
          ${t.current ? html`<i class="tint-dot" style=${`--sw:${t.current.hex}`}></i>${t.current.label} ${t.word}` : t.plain}${uiIcon("chevron")}
        </button>
        ${this.renderTintMenu()}
      </span>
    </span>`;
  }

  /** What the Color tool reads right now, shared by the tool in the zoom and
   * demo bars and the one on the canvas toolbar. */
  private tintState() {
    const on = this.previewTint;
    const current = FACE_TINTS.find((t) => t.hex === on);
    const phone = isHomeFamily(this.activeFamily);
    const lockWhite = this.previewAsPhone && !phone && isDrawable(this.activeFamily);
    const plain = lockWhite ? "Lock Screen white" : "Full color";
    const word = phone ? "iPhone tinted" : "tint";
    const title = phone
      ? "A tinted Home Screen drops the tile's background and paints every layer in one color, keeping only how bright each part was. Layers in the accent group take the lighter of the two colors."
      : lockWhite
        ? "An iPhone always draws Lock Screen complications in white, whatever colors you pick, so the preview does the same. Your colors still set how bright each part comes out. Pick a tint here to see the design in another color."
        : "Many watch faces draw complications in one color. Colors become the face's tint, text and background turn white, and only how see-through each part is survives.";
    const aria = `Preview color, ${current ? `${current.label} ${phone ? "tinted Home Screen" : "tinted face"}` : plain.toLowerCase()}`;
    return { on, current, phone, lockWhite, plain, word, title, aria };
  }

  /** The Color tool's list, while it is open. */
  private renderTintMenu() {
    if (this.openMenu !== "tint") return nothing;
    const t = this.tintState();
    const pick = (hex: string | undefined) => { this.toggleMenu("tint", false); this.previewTint = hex; };
    return html`<div class="pop-menu" role="listbox" aria-label="Preview color">
      <button class="row" role="option" aria-selected=${t.on === undefined ? "true" : "false"} @click=${() => pick(undefined)}>
        <i class="tint-dot ${t.lockWhite ? "" : "full"}" style=${t.lockWhite ? "--sw:#FFFFFF" : nothing}></i>${t.plain}</button>
      ${FACE_TINTS.map((c) => html`<button class="row" role="option" aria-selected=${c.hex === t.on ? "true" : "false"}
        @click=${() => pick(c.hex)}><i class="tint-dot" style=${`--sw:${c.hex}`}></i>${c.label} ${t.word}</button>`)}
    </div>`;
  }

  /**
   * The one floating toolbar over the stage, top centre. Four groups: the
   * questions asked of the face (Pick, Taps, Demo), how it is looked at (the
   * case and the tint), snapping, and the zoom.
   *
   * It replaces the three rows that used to sit over the face (the shape and
   * Preview as row, then the pill of face toggles and snapping switches), so
   * the face gets the height. Every one of those controls is here or one menu
   * down. Inline has no face, so it keeps only Preview as.
   */
  private renderStageTools(family: FamilyKind, deviceCase: PreviewCase) {
    const drawable = isDrawable(family);
    const off = !this.draft || this.parseError !== undefined;
    const sep = html`<span class="tb-sep" aria-hidden="true"></span>`;
    const glyph = (body: ReturnType<typeof svg>, fill = false) => html`<svg class="tb-glyph" viewBox="0 0 13 13" fill=${fill ? "currentColor" : "none"}
      stroke=${fill ? "none" : "currentColor"} stroke-width="1.3" stroke-linejoin="round" stroke-linecap="round" aria-hidden="true">${body}</svg>`;
    const caseOpen = this.openMenu === "case";
    const tint = this.tintState();
    const tintOpen = this.openMenu === "tint";
    return html`<div class="stage-tools" role="toolbar" aria-label="Canvas tools">
      ${drawable ? html`
        <button class="tb ${this.picking ? "on" : ""}" ?disabled=${off} aria-pressed=${this.picking ? "true" : "false"}
          title=${this.picking ? "Point at the face to name a layer. Click one to select it. Escape stops." : "Point at a layer on the face to find it (Escape stops)"}
          @click=${() => this.togglePicking()}>${glyph(svg`<path d="M2 1.5L11 6L7 7.2L5.5 11.5Z" />`)}<span class="word">${this.picking ? "Picking…" : "Pick"}</span></button>
        <button class="tb ${this.showTaps ? "on" : ""}" ?disabled=${off} aria-pressed=${this.showTaps ? "true" : "false"}
          title="Show every tap zone, labelled with what it does, over a dimmed face. With a layer selected, only its tap zone shows, and you can drag its corners to size it."
          @click=${() => this.setShowTaps(!this.showTaps)}>${glyph(svg`<circle cx="6.5" cy="6.5" r="5" /><circle cx="6.5" cy="6.5" r="1.8" fill="currentColor" />`)}<span class="word">Taps</span></button>
        <button class="tb" ?disabled=${off}
          title="Try the complication the way the watch draws it: no grid, no handles, no tap boxes. Taps really run, so a toggle really toggles. Escape closes."
          @click=${() => this.openDemo()}>${glyph(svg`<path d="M3 1.8L11 6.5L3 11.2Z" />`, true)}<span class="word">Demo</span></button>
        ${sep}` : nothing}
      <span class="case-tool" data-menu="case">
        <button class="tb" aria-haspopup="listbox" aria-expanded=${caseOpen ? "true" : "false"}
          aria-label=${`Preview as ${deviceCase.label}`}
          title=${`Preview as. Layouts are made in the ${this.referenceCase.label} box. Every other size draws a scaled copy of it.`}
          @click=${() => this.toggleMenu("case")}>${uiIcon(this.previewAsPhone ? "phone" : "watch")}<span class="word keep">${deviceCase.label}</span><span class="caret">${uiIcon("chevron")}</span></button>
        ${caseOpen ? html`<div class="pop-menu" role="listbox" aria-label="Preview as">
          ${this.previewCases.map((c) => html`<button class="row" role="option" aria-selected=${c.label === deviceCase.label ? "true" : "false"}
            @click=${() => { this.toggleMenu("case", false); this.previewCase = c.label; }}>${c.label}${c.measured ? "" : " (estimated)"}</button>`)}
        </div>` : nothing}
      </span>
      ${drawable ? html`<span class="case-tool" data-menu="tint">
        <button class="tb ${tint.on !== undefined ? "lit" : ""}" ?disabled=${off} aria-haspopup="listbox" aria-expanded=${tintOpen ? "true" : "false"}
          aria-label=${tint.aria} title=${tint.title} @click=${() => this.toggleMenu("tint")}>
          ${tint.current ? html`<i class="tint-dot" style=${`--sw:${tint.current.hex}`}></i>` : html`<i class="tint-dot ${tint.lockWhite ? "" : "full"}" style=${tint.lockWhite ? "--sw:#FFFFFF" : nothing}></i>`}<span class="word">${tint.current ? `${tint.current.label} ${tint.word}` : tint.plain}</span><span class="caret">${uiIcon("chevron")}</span>
        </button>
        ${this.renderTintMenu()}
      </span>
      ${sep}${this.renderSnapMenu()}
      ${sep}${this.renderZoomTools()}` : nothing}
    </div>`;
  }

  /** The four snapping settings as one value, for the Snap menu. */
  private snapFlags(): SnapFlags {
    return { snapGrid: this.snapGrid, gridStep: this.gridStep, showGridLines: this.showGridLines, snapLayers: this.snapLayers };
  }

  private applySnap(next: SnapFlags) {
    this.setGrid(next.snapGrid, next.gridStep, next.showGridLines, next.snapLayers);
  }

  /**
   * Snap, one button and one small menu: Snap to grid with its size, Grid
   * lines, Snap to layers. The same three switches the pill over the face
   * used to show side by side, folded so the toolbar stays one short row. The
   * button is lit while anything snaps, so a drag that lands on a line is
   * never a surprise.
   */
  private renderSnapMenu() {
    const flags = this.snapFlags();
    const lit = anySnap(flags);
    const open = this.openMenu === "snap";
    const off = !this.draft || this.parseError !== undefined;
    const row = (which: SnapSwitch, label: string, title: string) => {
      const on = snapSwitchOn(flags, which);
      return html`<button class="row snap-row" role="menuitemcheckbox" aria-checked=${on ? "true" : "false"} title=${title}
        @click=${() => this.applySnap(toggleSnap(this.snapFlags(), which))}><span class="tog ${on ? "on" : ""}" aria-hidden="true"><i></i></span>${label}</button>`;
    };
    return html`<span class="case-tool snap-tool" data-menu="snap">
      <button class="tb ${lit ? "lit" : ""}" ?disabled=${off} aria-haspopup="menu" aria-expanded=${open ? "true" : "false"}
        title="Snapping: to a grid, to the other layers, and the grid's lines" @click=${() => this.toggleMenu("snap")}>
        <svg class="tb-glyph" viewBox="0 0 13 13" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M2 2V8A4.5 4.5 0 0 0 11 8V2" /><path d="M2 2H5M8 2H11" /></svg><span class="word">Snap</span>${lit ? html`<i class="tb-dot" aria-hidden="true"></i>` : nothing}<span class="caret">${uiIcon("chevron")}</span>
      </button>
      ${open ? html`<div class="pop-menu snap-menu" role="menu" aria-label="Snapping">
        ${row("grid", "Snap to grid", flags.snapGrid
          ? "Layers land on the grid when you drag them, and arrow keys move one grid step. Hold Alt to drag freely."
          : "Snap layers to a grid when you drag them. Without it, hold Alt while dragging to snap.")}
        <div class="snap-steps" role="group" aria-label="Grid size" title="Grid size, a share of the face's shorter side">
          ${GRID_STEPS.map((step) => html`<button class=${step === flags.gridStep ? "on" : ""} aria-pressed=${step === flags.gridStep ? "true" : "false"}
            @click=${() => this.applySnap(pickGridStep(this.snapFlags(), step))}>${step * 100}%</button>`)}
        </div>
        ${row("lines", "Grid lines", "Draw the grid on the face. Snapping is not changed.")}
        ${row("layers", "Snap to layers", "Edges and middles land on the other layers' edges and middles, and on the middle of the face, with a pink line while they meet.")}
      </div>` : nothing}
    </span>`;
  }

  /** The zoom: step down, back to Fit, step up, and Full screen, which is the
   * zoom dialog the expand button always opened. */
  private renderZoomTools() {
    const z = this.canvasZoom;
    const off = !this.draft || this.parseError !== undefined;
    return html`<span class="tb-zoom" role="group" aria-label="Zoom">
      <button class="tb icon" ?disabled=${off || z <= ZOOM_MIN} aria-label="Zoom out" title="Zoom out"
        @click=${() => { this.canvasZoom = zoomOut(this.canvasZoom); }}>−</button>
      <button class="tb pct" ?disabled=${off} aria-label=${`Zoom ${zoomLabel(z)}. Back to Fit`}
        title="The face as a share of the size that fits. Click to fit it again."
        @click=${() => { this.canvasZoom = ZOOM_FIT; }}>${zoomLabel(z)}</button>
      <button class="tb icon" ?disabled=${off || z >= ZOOM_MAX} aria-label="Zoom in" title="Zoom in"
        @click=${() => { this.canvasZoom = zoomIn(this.canvasZoom); }}>+</button>
      <button class="tb icon" ?disabled=${off} aria-label="Full screen"
        title="Full screen: the face as large as the window allows, for small moves. Drag and arrow keys work there too. Escape closes."
        @click=${() => { this.zoomed = true; }}>${uiIcon("expand")}</button>
    </span>`;
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
   * One button per page, the showing one pressed, as one segmented control.
   *
   * The canvas shows one page at a time because the watch does. There is no
   * "All" button here: a face that drew every page at once would be the one
   * picture the wrist can never produce. Layers on every page simply draw on
   * every page; the Layers card's Show all is where every page's list is read
   * at once.
   */
  private renderPageTabs(cfg: CustomComplicationConfig) {
    const spec = pagesSpecOf(cfg);
    const pinned = (page: number) =>
      cfg.elements.filter((el) => el.payload.page === page && !isAttachedTap(cfg, el)).length;
    return pageNumbers(spec).map((page) => {
      const on = page === this.page;
      const count = pinned(page);
      return html`<button class=${on ? "on" : ""} aria-pressed=${on ? "true" : "false"}
        title=${`Page ${page}: ${count} layer${count === 1 ? "" : "s"}`}
        @click=${() => this.setPage(page)}>${page}</button>`;
    });
  }

  /**
   * The Pages card, above Layers: the one place pages are switched and added.
   * It sits over the list it changes, so the order on screen reads the way the
   * work does: pick a page here, and its layers are in the card below.
   *
   * One header line. Without pages it says so and offers Add a page, which
   * pins what is there to page 1 and opens an empty page 2 (`startPages`). With
   * pages it carries the page buttons, + for one more, and a ··· menu for the
   * things done now and then: deleting the page showing, the two ready-made
   * page-turning tap zones, and the help. Neutral, with no color of its own:
   * a pressed page is not a selection, and the orange it used to wear made
   * the one quiet card on the column the loudest.
   *
   * The one line under the header appears only while it is true: a paged
   * complication that nothing can turn is stuck on page 1 on the wrist.
   */
  private renderPages() {
    const cfg = this.draft?.config;
    if (!cfg) return nothing;
    if (!isDrawable(this.activeFamily)) return nothing;
    const edit = this.canEdit;
    const on = usesPages(cfg);
    // No pages and no edit rights: nothing to switch and nothing to press.
    if (!on && !edit) return nothing;
    if (!on) {
      return html`<div class="card pages-card lc">
        <div class="lc-head">
          <span class="lc-title">Pages</span><span class="lc-sub">just one</span>
          <span class="spacer"></span>
          <button class="lc-btn" title="Start a second page. What is here now becomes page 1, and a new empty page 2 opens for you to draw on."
            @click=${() => { let page = 1; this.mutate((c) => { page = startPages(c); }); this.showPage(page); }}>${uiIcon("plus")}<span>Add a page</span></button>
        </div>
      </div>`;
    }
    const spec = pagesSpecOf(cfg);
    const full = spec.count >= PAGES_MAX_COUNT;
    const stuck = edit && !pageMoverExists(cfg);
    return html`<div class="card pages-card lc">
      <div class="lc-head">
        <span class="lc-title">Pages</span><span class="lc-sub">${spec.count} · shown one at a time</span>
        <span class="spacer"></span>
        <span class="page-seg" role="group" aria-label="Page the canvas and the list are showing"
          title="Which page the canvas and the Layers card show">${this.renderPageTabs(cfg)}</span>
        ${edit ? html`<button class="lc-ghost" ?disabled=${full} aria-label="Add a page"
          title=${full ? "Four pages is the most a complication can have." : "Add an empty page after the last one."}
          @click=${() => { let page: number | undefined; this.mutate((c) => { page = addPage(c); }); if (page !== undefined) this.showPage(page); }}>${uiIcon("plus")}</button>` : nothing}
        ${this.renderPagesMenu(cfg, edit)}
      </div>
      ${stuck ? html`<div class="lc-note warn">
        <span>Add a tap zone to turn pages</span>
        <button class="link" title=${`A tap zone over the right half of page ${this.page}. Tapping it shows the next page.`}
          @click=${() => this.mutate((c) => { addPageTurnTap(c, "nextPage", this.page); }, "pages-zone-nextPage")}>Add</button>
      </div>` : nothing}
      ${this.touring
        // A tour started by a Play all pages tap in the demo preview. Keyed on
        // the run so a second press starts the bar over: a CSS animation on
        // the same element would otherwise carry on from where the first tour
        // left it.
        ? keyed(this.tourRun, html`<span class="page-tour-bar" aria-hidden="true"><i
            style=${`animation-duration:${Math.max(1, Math.round(tourDuration(spec) * 1000))}ms`}></i></span>`)
        : nothing}
    </div>`;
  }

  /**
   * The Pages card's ··· menu. Delete this page asks first, in place: the
   * first press turns the row into the question and the second deletes, the
   * way the trash on the pressed tab used to. The two tap zones land on the
   * page showing, because page 1 usually wants Next alone and the last page
   * Back alone.
   */
  private renderPagesMenu(cfg: CustomComplicationConfig, edit: boolean) {
    const open = this.sideMenu === "pages";
    const page = this.page;
    const spec = pagesSpecOf(cfg);
    const count = cfg.elements.filter((el) => el.payload.page === page && !isAttachedTap(cfg, el)).length;
    const armed = this.pageTrashArm === page;
    const gone = spec.count > 2
      ? `Delete page ${page} and the ${count === 1 ? "layer" : `${count} layers`} on it. Later pages move down one. Layers on every page stay.`
      : `Delete page ${page} and the ${count === 1 ? "layer" : `${count} layers`} on it, which turns pages off. Layers on every page stay.`;
    const zone = (type: "previousPage" | "nextPage") => {
      const back = type === "previousPage";
      return html`<button class="row" role="menuitem"
        title=${back
          ? `A tap zone over the left half of page ${page}. Tapping it shows the page before.`
          : `A tap zone over the right half of page ${page}. Tapping it shows the next page.`}
        @click=${() => {
          this.toggleSideMenu("pages", false);
          this.mutate((c) => { addPageTurnTap(c, type, page); }, `pages-zone-${type}`);
        }}>Add ${back ? "previous" : "next"} page tap zone</button>`;
    };
    return html`<span class="side-menu" data-side-menu="pages">
      <button class="lc-ghost" aria-haspopup="menu" aria-expanded=${open ? "true" : "false"} aria-label="Page options" title="Page options"
        @click=${() => { this.disarmPageTrash(); this.toggleSideMenu("pages"); }}>···</button>
      ${open ? html`<div class="pop-menu side-pop" role="menu" aria-label="Page options">
        ${edit ? html`
          <button class="row danger ${armed ? "armed" : ""}" role="menuitem" title=${armed ? `Press again to delete page ${page}.` : gone}
            @click=${() => {
              if (!armed) { this.armPageTrash(page); return; }
              this.disarmPageTrash();
              this.toggleSideMenu("pages", false);
              this.mutate((c) => { removePage(c, page); });
              this.showPage(Math.max(1, page - 1));
            }}>${armed ? `Sure? Delete page ${page}` : "Delete this page"}</button>
          ${zone("previousPage")}${zone("nextPage")}
          <span class="pop-sep" aria-hidden="true"></span>` : nothing}
        <button class="row" role="menuitem"
          @click=${() => { this.toggleSideMenu("pages", false); this.helpTab = "pages"; this.helpOpen = true; }}>How pages work</button>
      </div>` : nothing}
    </span>`;
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
        ${this.renderStageHint(cfg, family)}
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

  /** Open demo mode. Any editor mode that would fight it is dropped first:
   * picking and review both draw marks the watch never draws. */
  private openDemo() {
    this.togglePicking(false);
    if (this.showTaps) this.setShowTaps(false);
    this.demoNote = undefined;
    this.freezeDemoStates();
    this.demoing = true;
  }

  private closeDemo() {
    this.stopTour();
    window.clearTimeout(this.demoFlashTimer);
    window.clearTimeout(this.demoRefetchTimer);
    this.demoing = false;
    this.demoNote = undefined;
    this.demoFlashOn = false;
    this.demoFlashFrame = undefined;
    this.demoStates = undefined;
    this.demoRefetchUntil = 0;
  }

  /** Take the picture of the house the demo draws from, and shut the window.
   * A shallow copy is enough: Home Assistant replaces an entity's state object
   * on every change rather than editing the one already there. */
  private freezeDemoStates() {
    window.clearTimeout(this.demoRefetchTimer);
    this.demoStates = { ...this.hass.states };
    this.demoRefetchUntil = 0;
  }

  /**
   * Let live state through for a moment, because the tap just made the watch
   * fetch.
   *
   * The window is needed rather than a single re-read: the service call returns
   * before Home Assistant pushes the new state, so reading straight away would
   * take the old value. Anything that lands inside the window is taken, and the
   * timer closes it whether a push arrived or not.
   */
  private openDemoRefetch() {
    window.clearTimeout(this.demoRefetchTimer);
    this.demoRefetchUntil = Date.now() + DEMO_REFETCH_MS;
    this.demoRefetchTimer = window.setTimeout(() => {
      if (!this.demoing) return;
      this.freezeDemoStates();
      this.requestUpdate();
    }, DEMO_REFETCH_MS);
  }

  /**
   * The demo: the complication alone, drawn as the watch draws it, on a face
   * you can press.
   *
   * Everything the editor adds is gone here, which is the whole point. The bar
   * underneath carries only what the watch itself would tell you: which page is
   * up, and what the last press did. The pages are read-only markers rather
   * than buttons, because a demo where you can change page by a means the watch
   * does not have would answer the wrong question.
   */
  private renderDemoDialog(family: DrawableFamily, layouts: ResolvedAll, deviceCase: PreviewCase) {
    const cfg = this.draft?.config;
    const layout = layouts[family];
    if (!cfg || !layout) return nothing;
    const slot = slotFor(deviceCase, family);
    const ratio = family === "corner" ? 104 / 124 : slot.width / slot.height;
    const pages = usesPages(cfg) ? this.pageCount() : 1;
    const note = this.demoNote;
    const flashOn = (cfg.showSuccessFlash ?? true) && this.demoFlashOn;
    const opts = {
      icons: this.icons,
      imageSizes: this.imageSizes,
      slot,
      ...previewTintFor(family, this.previewAsPhone, this.previewTint),
      ...(flashOn
        ? {
          flash: {
            color: (cfg.successFlashColorHex ?? CUSTOM_FLASH_DEFAULT).slice(0, 7),
            ...(this.demoFlashFrame !== undefined ? { frame: this.demoFlashFrame } : {}),
          },
        }
        : {}),
    };
    return html`<dialog class="demo-dialog" @close=${() => this.closeDemo()}>
      <div class="demo-bar">
        <span class="demo-title">Demo <b>${cfg.name || "this complication"}</b> on ${deviceCase.label}</span>
        <span class="spacer"></span>
        ${this.renderTintTool()}
        <button class="pick" title="Back to the editor (Escape)" @click=${() => this.closeDemo()}><span class="glyph">✕</span>Close</button>
      </div>
      <div class="demo-stage">
        <div class="demo-face ${family}" style=${`--wa-ratio:${ratio}`}
          @pointerdown=${(e: PointerEvent) => void this.onDemoTap(cfg, family, layout, e)}>
          ${renderLayout(layout, opts)}
        </div>
      </div>
      <div class="demo-foot">
        ${pages > 1
          ? html`<span class="demo-pages" aria-label=${`Page ${this.page} of ${pages}`}>
              ${Array.from({ length: pages }, (_, i) => html`<i class=${i + 1 === this.page ? "on" : ""}></i>`)}
            </span>`
          : nothing}
        <span class="demo-note ${note?.kind ?? "idle"}">
          ${note ? note.text : "Press the face. Taps really run, so a toggle really toggles."}
        </span>
      </div>
    </dialog>`;
  }

  /**
   * A press on the demo face, treated as a finger on the watch.
   *
   * The point is taken inside the design box rather than off the picture's
   * bounding rectangle, because a corner complication draws its face inside a
   * whole screen quadrant and every other shape letterboxes its design box into
   * the slot. That one group is the only place the two agree.
   */
  private async onDemoTap(cfg: CustomComplicationConfig, family: DrawableFamily, layout: ResolvedLayout, e: PointerEvent) {
    e.preventDefault();
    const point = this.demoPoint(family, e);
    if (!point) return;
    const { action, frame } = actionAt(cfg, layout, point);
    // A tap during a tour takes over from the page on screen, which is the
    // watch's own rule, so the tour stops before the action runs.
    this.stopTour();
    // Opened before the call rather than after it, so a house that answers fast
    // cannot push the new state into the gap while the demo is still frozen.
    if (tapRefetches(action)) this.openDemoRefetch();
    this.demoNote = { kind: "did", text: `${demoTapLabel(action)}…` };
    const outcome = await runTapAction(action, {
      hass: this.hass,
      refresh: () => { void this.refreshTemplates(); },
      stepPage: (by) => this.demoStepPage(by),
      showPage: (page) => {
        const count = this.pageCount();
        if (count <= 1) return false;
        this.showPage(Math.min(Math.max(page, 1), count), true);
        return true;
      },
      playTour: () => {
        if (!usesPages(cfg) || pagesSpecOf(cfg).mode !== "tour") return false;
        this.playTour();
        return true;
      },
    });
    this.demoNote = outcome;
    if (outcome.kind === "did") void this.flashDemo(frame);
  }

  /** Play the success flash the watch plays after an action lands: a stroke
   * round the tap area that fired, or round the whole complication when the
   * press fell through. Off first, then on once lit has taken the last one
   * out, so a second tap inside the flash still reads as a second flash. */
  private async flashDemo(frame?: NormalizedFrame) {
    window.clearTimeout(this.demoFlashTimer);
    this.demoFlashOn = false;
    await this.updateComplete;
    this.demoFlashFrame = frame;
    this.demoFlashOn = true;
    this.demoFlashTimer = window.setTimeout(() => { this.demoFlashOn = false; }, DEMO_FLASH_MS);
  }

  /** A page on or back in demo mode, wrapping. The selection is left where it
   * was: the demo is not editing, and coming back to a lost layer would be a
   * surprise the watch never causes. */
  private demoStepPage(by: 1 | -1): boolean {
    const count = this.pageCount();
    if (count <= 1) return false;
    this.showPage(((this.page - 1 + by + count) % count) + 1, true);
    return true;
  }

  /** Where a demo press landed, as fractions of the design box, or undefined
   * when the picture is not on screen to measure. */
  private demoPoint(family: DrawableFamily, e: PointerEvent): { x: number; y: number } | undefined {
    const face = this.renderRoot.querySelector<HTMLElement>(".demo-face");
    const svg = face?.querySelector<SVGSVGElement>("svg.complication");
    const box = svg?.querySelector<SVGGraphicsElement>("[data-design-box]");
    if (!svg || !box) return undefined;
    const ctm = box.getScreenCTM();
    if (!ctm) return undefined;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const local = pt.matrixTransform(ctm.inverse());
    const design = CANVAS[family];
    if (design.width <= 0 || design.height <= 0) return undefined;
    return { x: local.x / design.width, y: local.y / design.height };
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
      ["/", "Open Add in the Layers card and search the elements and presets"],
      ["Escape", "Leave the row designer, then drop the pick, then the selection. Also stops Pick layer and closes a dialog"],
    ];
    const mouse: [string, string][] = [
      ["Click", "A layer on the face or in the list: edit it. Drag it to move, pull a corner to resize"],
      [`${MULTI_KEY}-click · ⇧-click`, "Add a layer to the pick · Pick a range of rows. Then Group them so a finished part moves as one"],
      ["Rest on a row", "Tints that layer on the face without selecting it. A group row tints every member"],
      ["Drag a row", "Reorder the list. Drop it on a group to put it inside"],
      ["Pick layer", "Point at the face to find a layer. Click it to select it"],
      ["Show taps", "Every tap zone, labelled. With a layer selected, only its tap shows and its corners drag"],
      ["Demo", "The face alone, drawn the way the watch draws it, with no grid, no handles and no tap boxes. Press it and the tap really runs: pages turn, data refreshes, a toggle really toggles, and the success flash rings what was pressed exactly as it does on the wrist. The actions that live on the watch (opening the app, the timers) say what they would do instead. Escape closes"],
      ["Snapping", "The three switches over the face. Snap to grid: layers land on a grid when you drag them, 1% by default, and arrows move one grid step; the size sits beside it. Grid lines draws the grid. Snap to layers: edges and middles land on the other layers' and on the middle of the face, with a pink line while they meet. Both snaps start on"],
      ["Alt-drag", "Flips snapping for that drag: a drag that would snap moves freely, and one that would not snaps to the grid"],
      ["Expand", "The button over the face. The face full-window, for small moves. Everything above works there too"],
      ["Locked group", "Drags as one. Unlock it in its row to move layers alone"],
      ["Timestamp chip", "On a picture layer: click it to move it, pull a corner for its size"],
    ];
    const shapes: [string, string][] = [
      ["Shapes", "Rectangular, Circular, Corner and Inline are the kinds of slot on a watch face. The watch offers a complication only in slots whose shape it has."],
      ["The bar over the face", "It names the shape this complication is. Beside it: which watch case the preview is drawn at, and which tint."],
      ["Canvas shapes", "Rectangular, Circular and Corner each hold their own layers. A layer belongs to one shape, so editing it never changes another. An empty shape can take a copy of another shape's layers."],
      ["Corner", "Its Corner content card picks big curved text or a canvas of layers."],
      ["Inline", "One line built from parts: words, live values and icons. Its one layer is that line."],
      ["Home Screen", "On an iPhone only: Small, Medium, Large and Extra Large are the Home Screen tile sizes. Each is a canvas shape with its own layers, drawn edge to edge in the tile."],
      ["Small · Medium · Large", "A square, a wide band about twice as wide as it is tall, and a tall tile a little taller than it is wide. Add the ones you want; a size the complication does not have is not offered when you add a widget."],
      ["Extra Large", "The full-page tile, iOS 27 and later. An iPhone on iOS 26 is not offered it when adding a widget, and everything else still draws."],
      ["A tinted Home Screen", "iOS 18 lets a user tint the whole Home Screen. The system then drops the tile background and draws the design in two tones, so a design that relies on color alone reads differently there."],
      ["Background", "The bottom row of the Layers list: the shape's background, border and Shape states, and what a tap anywhere else does."],
      ["Pages", "One complication, several pages, one showing at a time. The Pages tab of this help explains them."],
    ];
    const pagesWhat: [string, string][] = [
      ["What a page is", "One slot on the watch face can hold several pages of the same complication, one showing at a time. A house battery on page 1 and the car on page 2 is the usual reason: one slot, two readings."],
      ["Turning pages on", "Add a page in the Pages card, above Layers. What you have now becomes page 1 and an empty page 2 opens. To turn pages off again, delete pages until one is left."],
      ["One page at a time", "The canvas and the Layers card show one page. The numbers in the Pages card say which, and clicking one switches both. [ and ] do the same from the keyboard. Show all, in the Layers card, lists the layers of every page at once."],
      ["Which page a layer is on", "Each layer sits on one page or on every page. Set it on the layer, in its Position card. A layer you add lands on the page you are looking at. A background, a border or a label that belongs everywhere goes on Every page."],
      ["+ and Delete this page", "In the Pages card. + adds an empty page at the end, up to four. Delete this page, in the card's ··· menu, deletes the page showing and the layers on it; it asks first, so press it once for \"sure?\" and again to delete. Later pages move down one, layers on every page stay, and undo puts it back."],
      ["Moving between pages on the watch", "A tap has to say so. Set the complication's tap action, or a tap zone's, to Show next page or Show previous page. The Pages card's ··· menu adds a ready-made tap zone for either one. A tap with any other action does its own job and leaves the page alone, so a page can still hold buttons. The page stays where it was left."],
      ["The tour", "Set a tap action to Play all pages and one tap plays every page once, then returns to page 1. Under that tap action you set how long each page shows, or one time for every page; a tour lasts the sum of them. Every Play all pages tap shares these times. Test on canvas, under the tap action, plays it here with the same timing. A tap during a tour on the watch stops it."],
      ["What the watch needs", "A complication with pages needs the Wrist Assistant app that understands them. An older app refuses the whole complication and asks for an update rather than drawing every page on top of each other."],
    ];
    const layers: [string, string][] = [
      ["Text", "A value: typed words, an entity, a template, a shared value and more. It can count down to a time."],
      ["Icon", "An SF Symbol or Material Design icon, or the entity's own icon."],
      ["Gauge", "A number drawn between a minimum and a maximum."],
      ["Chart", "Recent history as bars, a line or an area."],
      ["Timeline", "Which state an entity was in over time, as a colored strip."],
      ["Shape", "A rectangle, rounded rectangle, capsule, circle or line."],
      ["Picture", "A camera snapshot, or an entity's picture such as a person's avatar or album art."],
      ["Tap zone", "Invisible. A tap inside it runs its own action. Outside it, the complication's tap action applies. Any layer can be tapped too: tick Tap on the layer. A tap zone is for an empty area."],
      ["Extras", "Clock times, chart dots, a chart grid and a picture's timestamp are added from their layer's Extras card."],
      ["Order", "The top of the Layers list draws on top. Drag a row to reorder."],
      ["Groups", `A set of layers kept together in the list. Pick some and press ${m}G. Locked, the group moves as one on the face. Unlocked, each layer moves alone. The watch never sees groups.`],
    ];
    const cards: [string, string][] = [
      ["Content", "What the layer shows, starting with its entity or value."],
      ["Look", "How it is drawn: size, color and style. On a picture the card is called Picture."],
      ["Extras", "Charts, timelines and pictures only: labels, markers, clock times, dots, grid lines or a timestamp."],
      ["States", "Changes that apply while a value matches, described below."],
      ["Position", "Where the layer sits on the shape being edited, and its size."],
      ["Tap", "What a tap on the layer does."],
      ["?", "In a card's header: shows that card's help text."],
    ];
    const values: [string, string][] = [
      ["By value", "Gauges, charts and text can color by value instead of one color. Each band colors readings up to its number, lowest band first. Readings above every band take the Above the last band color."],
      ["Timeline colors", "A timeline colors each state from its own table."],
      ["States", "Rows that test a value, like is on or is greater than, each with the changes it makes: icon, text, color, visibility and more. Rows are checked top to bottom and the first match wins. Otherwise applies when none match."],
      ["Shape states", "The same table, on the shape itself."],
      ["Shared values", "Like a variable: set it once in Shared values, at the foot of the Layers card, and every layer that reads it follows. On a layer, set Source to Shared value, or click Make shared."],
      ["Values on the watch", "Every entity and shared value the complication reads, with its live reading. Slide, pick or type another value to watch the preview and the states react. Nothing is saved, and Live or Back to live returns to the real reading."],
    ];
    const saving: [string, string][] = [
      ["Save", `Writes the complication to Home Assistant (${m}S). It is dimmed while there is nothing to save. Only an administrator can save. Nothing saves by itself.`],
      ["Unassigned", "A design made with no device ticked is kept as unassigned. Nothing shows it until a copy of it goes on a device."],
      ["Saved", "Beside Save: when this complication was last saved, or Not saved yet. The footer says whether there are unsaved changes."],
      ["Reaching the watch", "The watch pulls saved changes by itself while Wrist Assistant is open on this home. There is no separate send step."],
      ["Hide", "The eye beside a complication in the list. It stops the watch offering that complication when you edit a face, and faces already using it keep it. Hidden ones fold into Hidden at the bottom of the list. For the open complication it saves with Save; for any other it saves at once."],
    ];
    const status: [string, string][] = [
      ["On watch", "The watch has applied every change. With last seen beside it, the watch is not listening now, so a later save waits until the app is open again."],
      ["Sending…", "Waiting for the watch to pull and confirm."],
      ["Not on watch yet", "The watch is connected but has not confirmed the latest change. Resend, in the top bar's ··· menu, wakes it again."],
      ["Open the watch app to sync", "The watch is not listening. Open Wrist Assistant on the watch, or switch it to this home, and it pulls at once. Resend, in the ··· menu, tries to wake it."],
      ["Update the watch app", "This watch has never reported a change. Its app is older than custom complications, or it has not opened this home yet."],
    ];
    const sharing: [string, string][] = [
      ["Share", "In the top bar. Turns the open complication into text anyone can import. Your entity ids and names become numbered slots, and you can label each one."],
      ["Backup", "The other choice in Share: an exact copy, entity ids and names included. For your records, or another watch in this home."],
      ["Copy link", "A link to this panel with the text inside it. Opening it here fills in the Import dialog. On another home, paste the link into Import."],
      ["Import", "In the top bar's ··· menu, beside Share. Paste text or a link, choose a file, or drop one on the dialog. Check the preview, choose your own entity for each slot, then Import. It opens as unsaved work and reaches the watch at the first Save."],
      ["History", "In the complication's header, beside Duplicate. The last 20 saves of this complication, newest first, with a picture of the one you pick. Restore writes it back as a new revision, so the design you restored over becomes the newest entry and you can come straight back and undo it."],
      ["Parts", "A few layers kept under a name, for this home. Pick layers in the Layers list and press Save to parts; the Saved parts tab of + Add, in the Layers card, drops them into the complication you have open. A part is stored the way a share is, so it asks which of your entities each slot is on the way in."],
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
    } else if (this.helpTab === "pages") {
      body = html`${section("Pages", pagesWhat)}`;
    } else {
      body = html`<div>${section("Shapes", shapes)}${section("Cards", cards)}</div><div>${section("Layers", layers)}${section("Color, states and values", values)}</div>`;
    }
    return html`<dialog class="help-dialog" @close=${() => { this.helpOpen = false; }}>
      <div class="help-head">
        <h2>Help</h2>
        <span class="spacer"></span>
        <a href="https://docs.wrist-assistant.com/" target="_blank" rel="noopener noreferrer">Wrist Assistant docs</a>
        <button class="pick" title="Close (Escape)" @click=${() => { this.helpOpen = false; }}>Close</button>
      </div>
      <div class="help-tabs" role="tablist" aria-label="Help topics">
        ${tab("basics", "Basics")}${tab("pages", "Pages")}${tab("keys", "Keys and mouse")}${tab("sync", "Syncing and sharing")}
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
    // A complication that was never saved is work to save as it stands: its
    // baseline is the config it was made from, so nothing else says so.
    const dirty = !!d?.dirty || d?.baseRevision === null;
    // `narrow` is Home Assistant telling us it is a phone; otherwise the fit
    // is decided from the panel's own measured width.
    const fit = this.narrow
      ? { columns: 1 as const, left: this.colLeft, right: this.colRight }
      : columnFit(this.panelWidth, this.colLeft, this.colRight);
    return html`
      ${this.renderTopBar(fit.columns === 1, dirty)}
      ${this.loadError ? html`<div class="card error">${this.loadError}</div>` : nothing}
      ${this.linkNote ? html`<div class="banner warn link-note"><span>${this.linkNote}</span>
        <button class="link" @click=${() => { this.linkNote = undefined; }}>Dismiss</button></div>` : nothing}
      ${this.splitNotice ? html`<div class="banner warn link-note"><span>${this.splitNotice.lines.map(
          (line, i) => html`${i > 0 ? html`<br>` : nothing}${line}`)}</span>
        ${this.splitNotice.undo
          ? html`<button class="link" ?disabled=${this.splitNotice.busy} @click=${this.splitNotice.undo}>Undo</button>`
          : nothing}
        <button class="link" @click=${() => { this.splitNotice = undefined; }}>Dismiss</button></div>` : nothing}
      ${this.seatClash && this.hass.user?.is_admin ? html`<div class="banner warn link-note"><span>${this.seatClash}</span>
        <button class="link" ?disabled=${this.saving} @click=${() => void this.fixSeatClashes()}>Fix</button></div>` : nothing}
      ${this.helpOpen ? this.renderHelpDialog() : nothing}
      ${this.newOpen ? this.renderNewDialog() : nothing}
      ${this.dupOpen ? this.renderDuplicateDialog() : nothing}
      ${this.shareOpen ? this.renderShareDialog() : nothing}
      ${this.galleryOpen ? this.renderGalleryDialog() : nothing}
      ${this.importOpen ? this.renderImportDialog() : nothing}
      ${this.historyOpen ? this.renderHistoryDialog() : nothing}
      ${this.savePartOpen ? this.renderSavePartDialog() : nothing}
      ${this.renderAddSheet()}
      ${this.watchSupported && !this.draft
        // Nothing open: the side columns have nothing to hold, so the stage
        // takes the whole width rather than sitting between two blank panels.
        ? html`<div class="layout bare"><div class="column canvas">${this.renderBanners()}${this.renderCanvas()}</div></div>
          ${this.renderFooter()}`
        : this.watchSupported
        ? html`<div class="layout cols-${fit.columns}"
              style="--wa-left:${fit.left}px;--wa-right:${fit.right}px">
            <div class=${`column left ${this.inControlView ? "control" : ""}`}>${this.inControlView
              ? html`${this.renderControlHasNoLayers()}${this.renderSharedValues(true)}`
              : html`${this.renderPages()}${this.renderLayers()}${this.renderPresetDialog()}`}</div>
            ${this.renderGutter("left")}
            <div class="column canvas">${this.renderBanners()}${this.renderCanvas()}</div>
            ${this.renderGutter("right")}
            <div class="column inspector card">${this.renderInspector()}${this.renderFooter()}</div>
          </div>`
        : this.renderWatchGate()}`;
  }

  /**
   * The top bar, left to right: Browse, the name you can type over, one quiet
   * pill saying which shape on which device, then the history, where the
   * complication has got to, Share, the ··· menu, Save and the help.
   *
   * Save is always there. It used to turn into the word "Saved", which read as
   * a label rather than a button and moved everything to its right each time it
   * changed. It is dimmed now while there is nothing to save, and the caption
   * beside it says when the last save was.
   */
  private renderTopBar(stacked: boolean, dirty: boolean) {
    const d = this.draft;
    const rec = this.records.find((r) => r.id === this.selectedId);
    const caption = d ? savedCaption(d.baseRevision === null, rec?.updatedAt, Date.now()) : undefined;
    return html`<header class=${stacked ? "stacked" : nothing}>
      ${this.renderPicker()}
      ${d ? this.renderNameField(d.config) : nothing}
      ${d ? this.renderPlacePill(d.config) : nothing}
      <span class="spacer"></span>
      <button class="icon tb-icon" @click=${() => this.undo()} ?disabled=${!d?.canUndo} title="Undo (⌘Z)" aria-label="Undo">${uiIcon("undo")}</button>
      <button class="icon tb-icon" @click=${() => this.redo()} ?disabled=${!d?.canRedo} title="Redo (⇧⌘Z)" aria-label="Redo">${uiIcon("redo")}</button>
      <span class="tb-div" aria-hidden="true"></span>
      ${this.renderSendPill()}
      ${d ? html`<button class="tb-btn" aria-haspopup="dialog" aria-expanded=${this.shareOpen ? "true" : "false"}
        title="Share or back up this complication as text, a file or a link"
        @click=${() => this.openShareDialog()}>Share</button>` : nothing}
      ${this.renderTopMenu()}
      ${d ? html`<button class="primary save ${dirty ? "dirty" : ""}" @click=${() => void this.save()}
          ?disabled=${!this.canEdit || !dirty || this.saving || !this.slotChosen}
          title=${dirty ? "Save (⌘S)" : "Nothing to save (⌘S)"}>${this.saving ? "Saving…" : "Save"}</button>
        <span class="tb-saved" title=${dirty && rec ? "Unsaved changes" : caption ?? ""}>${caption}</span>` : nothing}
      <button class="help" title="Help" aria-label="Help" @click=${() => { this.helpOpen = true; }}>?</button>
    </header>`;
  }

  /**
   * The complication's name, typed over where it stands. It commits on Enter
   * or on leaving the box, through the same write the Complication card's Name
   * field makes, so the two stay one setting and one undo step. Escape puts the
   * name back.
   */
  private renderNameField(cfg: CustomComplicationConfig) {
    const commit = (input: HTMLInputElement) => {
      const v = input.value;
      if (v === cfg.name) return;
      this.mutate((c) => { c.name = v; }, "name");
    };
    return html`<label class="tb-name" title=${this.canEdit ? "Click the name to rename it" : cfg.name}>
      <input type="text" class="tb-name-input" aria-label="Complication name" placeholder="Untitled"
        .value=${cfg.name} ?disabled=${!this.canEdit} maxlength="60"
        @change=${(e: Event) => commit(e.target as HTMLInputElement)}
        @keydown=${(e: KeyboardEvent) => {
          const input = e.target as HTMLInputElement;
          if (e.key === "Enter") { e.preventDefault(); input.blur(); }
          if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); input.value = cfg.name; input.blur(); }
        }} />
      ${this.canEdit ? html`<span class="tb-pen" aria-hidden="true">✎</span>` : nothing}
    </label>`;
  }

  /** "Rectangular · Jesse's Apple Watch": the shape this complication is and
   * the device it is on, as one quiet pill. A design on the shelf is on no
   * device, so it says unassigned. */
  private renderPlacePill(cfg: CustomComplicationConfig) {
    const families = supportedFamilies(cfg);
    const shape = families[0] !== undefined ? familyTitle(families[0]) : cfg.control !== undefined ? "Control" : "No shape";
    const owner = this.selectedOwner;
    const device = !owner || isLibraryOwner(owner) ? "unassigned" : ownerShortLabel(owner);
    return html`<span class="tb-pill" title=${`${shape}, ${device === "unassigned" ? "on no device yet" : `on ${device}`}`}>${shape} · ${device}</span>`;
  }

  /** The sync state as the header shows it, or undefined while there is
   * nothing true to say yet. */
  private sendInfo() {
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
    // Before the first reply nothing is known about this device, and the pill
    // would otherwise report the never-acked state as if it were an answer.
    if ((s.kind === "unsupported" || s.kind === "openApp") && !this.sendStatusKnown) return undefined;
    // A design that has not been saved yet is not in the library, whatever
    // the library's own list says, so the pill waits for the first save.
    if (s.kind === "library" && this.draft?.baseRevision === null) return undefined;
    return { s, d: describeSend(s) };
  }

  /** Where the saved complication has got to, as a pill: a dot and the words
   * from `send-state.ts`. Green once it is on the device, amber while it is
   * not there yet, and quiet for the shelf, which waits for nothing. Resend and
   * Refresh now live in the ··· menu beside it. */
  private renderSendPill() {
    const info = this.sendInfo();
    if (!info) return nothing;
    const { s, d } = info;
    return html`<span class="tb-sync ${sendTone(s.kind)} ${s.kind}" title=${d.title}>
      <i class="tb-dot" aria-hidden="true"></i><span class="tb-sync-l">${d.label}</span>${d.note ? html`<span class="tb-sync-n">· ${d.note}</span>` : nothing}
    </span>`;
  }

  /**
   * The ··· menu: the things the bar does now and then. Import, and the two
   * nudges that ask a device to pull again. All three are for an administrator;
   * anyone else gets no menu at all rather than an empty one.
   */
  private renderTopMenu() {
    if (!this.hass.user?.is_admin) return nothing;
    const info = this.sendInfo();
    const full = this.freeSlot() < 0;
    const open = this.sideMenu === "top";
    const run = (fn: () => void) => () => { this.toggleSideMenu("top", false); fn(); };
    return html`<span class="side-menu" data-side-menu="top">
      <button class="tb-btn tb-more" aria-haspopup="menu" aria-expanded=${open ? "true" : "false"} aria-label="More actions" title="More"
        @click=${() => this.toggleSideMenu("top")}>···</button>
      ${open ? html`<div class="pop-menu side-pop" role="menu" aria-label="More actions">
        <button class="row" role="menuitem" ?disabled=${full}
          title=${full ? `${capFirst(this.placePhrase)} has no free slot. Delete a complication first.` : "Paste a complication somebody shared"}
          @click=${run(() => this.openImportDialog())}>Import…${full
            ? html`<small>${isLibraryOwner(this.selectedOwner) ? UNASSIGNED_LABEL : this.deviceWord} is full</small>` : nothing}</button>
        ${info?.d.resend ? html`<button class="row" role="menuitem" title="Wake the watch again"
          @click=${run(() => void this.sendToWatch())}>Resend to the watch</button>` : nothing}
        ${info?.d.refresh ? html`<button class="row" role="menuitem"
          title="Send the phone a push so it pulls this now. iOS decides when the widget redraws; opening the app or tapping the widget redraws it at once."
          @click=${run(() => void this.sendToWatch())}>Refresh now</button>` : nothing}
      </div>` : nothing}
    </span>`;
  }

  /** Open or shut one of the top bar's and the left column's own menus; opening
   * one shuts the other. A press outside the open one shuts it. */
  private toggleSideMenu(menu: SideMenu, next = this.sideMenu !== menu) {
    this.sideMenu = next ? menu : this.sideMenu === menu ? undefined : this.sideMenu;
    if (this.sideMenu !== undefined) window.addEventListener("pointerdown", this.sideMenuOutside, { capture: true });
    else window.removeEventListener("pointerdown", this.sideMenuOutside, { capture: true });
  }

  private sideMenuOutside = (e: PointerEvent) => {
    const open = this.sideMenu;
    if (open === undefined) return;
    const inside = e.composedPath().some((n) => n instanceof HTMLElement && n.dataset.sideMenu === open);
    if (!inside) this.toggleSideMenu(open, false);
  };

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
            <div><b>Reload this page</b><span>The editor opens. Complications built on the iPhone before the update keep working on the watch; build new ones here.</span></div>
          </li>`;
    return html`<div class="gate">
      <div class="gate-card">
        <div class="gate-glyph">${uiIcon("watch")}</div>
        <div class="gate-eyebrow">${phone ? "iPhone app update needed" : "Watch app update needed"}</div>
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

  /** Every device this home has, in the order the picker names them. */
  private pickerDevices(): PickerDevice[] {
    return ownersByKind(this.owners).map((o) => ({
      ownerId: o.owner_watch_id,
      label: ownerShortLabel(o),
      kind: deviceKindOf(o),
    }));
  }

  /**
   * Every complication this home holds, one copy per device it is on.
   *
   * The edited device's come from `records`, which is the live list; the other
   * devices' from the lists read for the links, refreshed when the picker
   * opens. iPhone presets and customs on another home come along as locked
   * copies: this panel cannot edit them, but leaving them out is what used to
   * make seats look haunted. A preset whose seat a record already holds has
   * moved into Home Assistant and is left out.
   */
  private pickerCopies(): PickerCopy<PickerItem>[] {
    const out: PickerCopy<PickerItem>[] = [];
    const add = (ownerId: string, records: readonly ComplicationRecord[], occupied: readonly OccupiedSlot[]) => {
      const seats: number[] = [];
      for (const record of records) {
        if (record.deleted) continue;
        const slot = Number(record.document?.slotIndex ?? 0);
        seats.push(slot);
        const link = record.document?.linkId;
        out.push({
          ownerId,
          id: record.id,
          slot,
          name: String(record.document?.name ?? "Untitled"),
          ...(typeof link === "string" && link !== "" ? { linkId: link.toUpperCase() } : {}),
          item: { kind: "record", record },
        });
      }
      for (const o of lockedOccupied(seats, occupied)) {
        out.push({
          ownerId,
          id: `locked:${o.kind}:${o.slot}`,
          slot: o.slot,
          name: o.name || (o.kind === "custom" ? "Unnamed complication" : "Unnamed preset"),
          item: o.kind === "custom"
            ? {
              kind: "locked",
              badge: o.home || "Other home",
              title: `A complication on ${o.home ? `the ${o.home} home` : "another home"}${o.families?.length ? ` (${o.families.map(familyTitle).join(", ")})` : ""}. Edit it in that home's Wrist Assistant panel.`,
              families: o.families ?? [],
            }
            : {
              kind: "locked",
              badge: "iPhone",
              title: "Built on the iPhone before Wrist Assistant 2.8. It keeps working and cannot be edited here. To free this seat, open the Widgets tab in the iPhone app and tap Switch to the new editor.",
              families: [],
            },
        });
      }
    };
    if (this.ownerId) add(this.ownerId, this.records, this.occupied);
    for (const [ownerId, list] of this.otherLists) {
      if (ownerId === this.ownerId) continue;
      add(ownerId, list.records, list.occupied);
    }
    return out;
  }

  /** The rows the picker shows: every complication in the home, one row per
   * record, since a complication is one record on one device. */
  private pickerRows(): PickerRow[] {
    return pickerListRows(this.pickerCopies(), this.pickerDevices(), this.ownerId);
  }

  /** The owner one row's copy sits on, for the words and the shapes that
   * belong to that device rather than to whichever one the header is on. */
  private ownerOf(ownerId: string): OwnerSummary | undefined {
    return this.owners.find((o) => o.owner_watch_id === ownerId);
  }

  /** The row's copy when it is the one this panel has open, which is what
   * makes a card light up and what sends its hide through the draft. */
  private selectedCopyOf(row: PickerRow): PickerCopy<PickerItem> | undefined {
    if (this.selectedId === undefined) return undefined;
    return row.copies.find((c) =>
      c.ownerId === this.ownerId && c.item.kind === "record" && c.item.record.id === this.selectedId);
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

  /**
   * A saved record's config, parsed and compiled once and kept until its
   * revision moves.
   *
   * Every card draws the real complication, so without this the dialog would
   * parse and compile every document in the home on every keystroke in the
   * search field. Undefined for a document this panel cannot parse, whose card
   * draws an empty well rather than taking the grid down with it.
   */
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
   * The complication drawn into the slot it fills, on each kind of device.
   *
   * The lit fill said where a design sits; this says what sits there. The
   * shape is drawn in the real slot of its device, the watch's on the watch
   * and the phone's on the phone, so a Lock Screen shape is white the way the
   * phone draws it. A card takes the half its own device answers for, and the
   * crop around it shows that slot at a size worth reading.
   */
  private cardLive(cfg: CustomComplicationConfig, entities: readonly EntityRef[]): LiveDesign {
    const layouts = this.configLayouts(cfg, entities);
    const draw = (family: DrawableFamily, phone: boolean): LiveShape | undefined => {
      if (!cfg.supportedFamilies.includes(family)) return undefined;
      const slot = slotFor(phone ? REFERENCE_PHONE : REFERENCE_CASE, family);
      const art = renderShapeArt({
        config: cfg, layouts, icons: this.icons, imageSizes: this.imageSizes, phone, slotFor: () => slot,
      }, family);
      if (art === nothing) return undefined;
      // The corner is rendered as its whole screen quadrant, with the content
      // disc where the face puts it. The drawing wants the disc alone, so it
      // is told where the disc is, in the quadrant's own units: the reference
      // case's slot is the design box, so its scale is one.
      if (family === "corner") {
        const layout = layouts.corner;
        const bezel = !!layout?.bezelText || !!layout?.bezelGauge;
        const ctx = cornerContext(1, bezel);
        return {
          art, width: ctx.quad.width, height: ctx.quad.height,
          focus: { cx: ctx.tile.cx, cy: ctx.tile.cy, diameter: cornerTileSide(1, bezel) },
        };
      }
      return { art, width: slot.width, height: slot.height };
    };
    // The Control Center tile as the device draws it: the watch's pill and
    // the phone's circle, off the same host the card's own preview uses. It
    // is drawn beside the devices, so its size is its own.
    const tile = (phone: boolean): LiveShape | undefined => {
      if (!cfg.control) return undefined;
      const shape = controlTileShapes(phone ? "iphone" : "watch")[0]!;
      const art = controlTile(this.tileHost(cfg, entities), cfg.control, shape, CARD_ART_TILE_SIDE);
      if (art === nothing) return undefined;
      const width = shape === "watchPill" ? Math.round(CARD_ART_TILE_SIDE * 1.6) : CARD_ART_TILE_SIDE;
      return { art, width, height: CARD_ART_TILE_SIDE };
    };
    const pick = (families: readonly DrawableFamily[], phone: boolean): LiveShapes => {
      const out: LiveShapes = {};
      for (const family of families) {
        const shape = draw(family, phone);
        if (shape) out[family] = shape;
      }
      const control = tile(phone);
      if (control) out.control = control;
      return out;
    };
    const watch = pick(["rectangular", "circular", "corner"], false);
    // Inline is words rather than a render: its symbol and its text, for the
    // watch drawing to write into the band over the clock the way the watch
    // does, cut where the watch cuts it.
    const inline = layouts.inline;
    if (cfg.supportedFamilies.includes("inline") && inline) {
      const symbol = inline.symbol ? this.icons.render(inline.symbol, CARD_INLINE_SYMBOL, "#FFFFFF") : undefined;
      watch.inline = {
        art: symbol ?? nothing, width: symbol ? CARD_INLINE_SYMBOL : 0, height: symbol ? CARD_INLINE_SYMBOL : 0,
        text: this.inlineLineText(inline),
      };
    }
    return {
      watch,
      phone: pick(["rectangular", "circular", "small", "medium", "large", "xlarge"], true),
    };
  }

  /**
   * Which device a card draws: the one its copy sits on.
   *
   * A design on the shelf has no device of its own, so it takes the one its
   * shape belongs to. A Home Screen tile is a phone wherever it is kept, and
   * everything else is a watch.
   */
  private cardDevice(kind: DeviceKind, family: FamilyKind | undefined): "watch" | "iphone" {
    if (kind !== "library") return kind === "iphone" ? "iphone" : "watch";
    return family !== undefined && isHomeFamily(family) ? "iphone" : "watch";
  }

  /** A host for a Control Center tile of a complication that has no draft
   * behind it: enough for `controlTile`, and nothing it cannot answer. */
  private tileHost(cfg: CustomComplicationConfig, entities: readonly EntityRef[]): ControlTileHost {
    const context = this.configContext(cfg, entities);
    return { config: cfg, icons: this.icons, resolveContext: () => context };
  }

  /** A document that is not the open one, resolved from the live states of
   * the entities it reads. Templates are not rendered for it. */
  private configLayouts(cfg: CustomComplicationConfig, entities: readonly EntityRef[], historySeries?: Map<string, string>): ResolvedAll {
    // The open complication has the stage's own context: rendered templates,
    // fetched history, list items. Its card draws off that, or a list of
    // forecasts, which is nothing until fetched, is a black card for the one
    // complication the author is looking at.
    const d = this.draft;
    if (historySeries === undefined && d && d.config.id === cfg.id) return resolveAll(d.config, this.buildContext(), this.forced);
    return resolveAll(cfg, this.configContext(cfg, entities, historySeries));
  }

  /** What one complication resolves against when it is drawn small and is not
   * the one being edited: its own entities read live, and nothing fetched.
   * No `page`, so a paged document draws its page 1 in every picker row and in
   * the import preview: page 1 is what the complication shows first.
   *
   * Picture layers are the one thing read from a cache rather than live. This
   * is the path every card in the grid takes, and a camera proxy is a fresh
   * frame off the camera every time it is asked. */
  private configContext(cfg: CustomComplicationConfig, entities: readonly EntityRef[], historySeries?: Map<string, string>): ResolveContext {
    const entityStates = new Map<string, EntityState>();
    for (const ref of entities) {
      const state = this.entityStateFor(ref.entityId, ref.iconName ?? "", false, true);
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

  /**
   * The device tabs over the grid: All, then a tab per device, then the
   * library.
   *
   * Whose a complication is is the coarser question and the one a household
   * asks first, and it is answered by the device rather than by the person:
   * the tab already carries the person's name, since that is how this panel
   * labels a device. The row of person chips and shape chips this replaced
   * asked both questions at once in fourteen pills.
   *
   * A count on every tab, so an empty device says so before it is opened. All
   * is first and is where the picker opens, because the whole home in one
   * scroll is what this surface is for; the tab that was last used comes back
   * on the next visit.
   *
   * Each person's devices wear that person's color, on the glyph, the count
   * and the underline of the selected one. A household of four has eight
   * device tabs over two rows, and hue is what makes "Jesse's two" read as a
   * pair before any of the names have been read. All and Unassigned belong to
   * nobody and keep the accent.
   */
  private renderPickerTabs(tabs: readonly PickerTab[], current: string, people: readonly PickerPerson[]) {
    return html`<div class="pk-tabs" role="tablist" aria-label="Devices">
      ${tabs.map((tab) => {
        const color = personColorVar(personIndex(people, tab.key));
        return html`<button type="button" role="tab" class="pk-tab ${tab.key === current ? "on" : ""}"
          id=${`pk-tab-${tab.key}`} aria-selected=${tab.key === current ? "true" : "false"}
          style=${color ? `--pk-person: ${color}` : nothing}
          aria-controls="pk-tabpanel" @click=${() => this.pickPickerTab(tab.key)}>
          <span class="pk-tab-glyph" aria-hidden="true">${uiIcon(tabIcon(tab.kind))}</span>
          <span class="pk-tab-name">${tab.label}</span>
          <span class="pk-tab-count">${tab.count}</span>
        </button>`;
      })}
    </div>`;
  }

  /**
   * The Shape menu in the dialog's head: All, the shapes this tab's devices
   * draw, and the control.
   *
   * One menu rather than a shape chip each. The chips were a row of up to
   * eight pills for a question most visits never ask, above a grid that
   * already draws every shape at the size it really is.
   *
   * Only the shapes the tab can show, so a watch tab is never offered a Home
   * Screen size, and only the ones with something behind them, so an option
   * never opens an empty grid. The one already chosen stays on the list
   * whatever its count, or picking it would be a choice that vanishes.
   */
  private renderPickerShapes(rows: readonly PickerRow[], offered: readonly FamilyKind[]) {
    const filter = this.pickerFilter;
    const controls = rows.filter((r) => r.open.item.kind === "record" && hasControlOf(r.open.item.record)).length;
    const shapes = offered
      .map((f) => ({ key: f, label: familyTitle(f), count: rows.filter((r) => familiesOfItem(r.open.item).includes(f)).length }))
      .filter((o) => o.count > 0 || o.key === filter);
    const options = [
      { key: "all" as const, label: "All", count: rows.length },
      ...shapes,
      ...(controls > 0 || filter === "control" ? [{ key: "control" as const, label: "Control", count: controls }] : []),
    ];
    return html`<label class="pk-shape">
      <span class="pk-shape-lead">Shape</span>
      <select aria-label="Show one shape" .value=${filter}
        @change=${(e: Event) => { this.pickerFilter = (e.target as HTMLSelectElement).value as FamilyKind | "all" | "control"; }}>
        ${options.map((o) => html`<option value=${o.key} ?selected=${o.key === filter}>${o.label} (${o.count})</option>`)}
      </select>
    </label>`;
  }

  /**
   * Move to another device tab.
   *
   * The shape goes back to All when the new tab's devices do not draw it: a
   * watch tab holding a Home Screen filter is a grid that can only be empty,
   * and the reason for it would be off screen in a closed menu.
   */
  private pickPickerTab(key: string) {
    this.pickerDevice = key;
    this.saveListView();
    const filter = this.pickerFilter;
    if (filter === "all" || filter === "control") return;
    if (!this.tabFamilies(key).includes(filter)) this.pickerFilter = "all";
  }

  /** The tab the picker is on, checked against the tabs there are: a device
   * that has left the home falls back to All rather than to an empty grid. */
  private pickerTabKey(tabs: readonly PickerTab[]): string {
    return tabs.some((t) => t.key === this.pickerDevice) ? this.pickerDevice : ALL_DEVICES;
  }

  /**
   * The shapes one tab can show.
   *
   * A device tab offers what that device draws. All and the library offer
   * every shape any device in this home draws: the library holds every shape
   * there is, so asking it what it draws would offer a watch-only home the
   * Home Screen sizes it can never use.
   */
  private tabFamilies(tab: string): FamilyKind[] {
    if (tab === ALL_DEVICES) return this.pickerFamilies;
    const owner = this.ownerOf(tab);
    if (owner === undefined || isLibraryOwner(owner)) return this.pickerFamilies;
    return familiesFor(owner);
  }

  /** Whether one card answers what has been typed into the search field. The
   * name and the people who have it, because "chen" is as reasonable a thing
   * to type as "porch" and neither is the other's field. */
  private pickerMatches(row: PickerRow, query: string, people: readonly Person[]): boolean {
    if (query === "") return true;
    if (row.name.toLocaleLowerCase().includes(query)) return true;
    return rowWhoText(row.copies.map((c) => c.ownerId), this.pickerPeople(people))
      .toLocaleLowerCase().includes(query);
  }

  /** The household as the who-line reads it: a name and the kinds of that
   * person's devices, which is all `rowWhoText` needs to stay pure. */
  private pickerPeople(people: readonly Person[]): PickerPerson[] {
    return people.map((p) => ({
      label: p.label,
      devices: p.owners.map((o) => ({ ownerId: o.owner_watch_id, kind: deviceKindOf(o) })),
    }));
  }

  /** The shapes the Shape menu offers on the All tab: every shape any device
   * in this home draws, so one grid holding a watch and a phone can still be
   * narrowed to either one's. The Library is left out, because it holds every
   * shape there is: a watch-only home would be offered Home Screen sizes that
   * can only ever come up empty. */
  private get pickerFamilies(): FamilyKind[] {
    const out: FamilyKind[] = [];
    const add = (families: readonly FamilyKind[]) => {
      for (const f of families) if (!out.includes(f)) out.push(f);
    };
    for (const owner of ownersByKind(this.owners)) if (!isLibraryOwner(owner)) add(familiesFor(owner));
    if (out.length === 0) add(familiesFor(this.selectedOwner));
    return out;
  }

  /**
   * Open a complication from the picker. This is the click that moves the
   * editor onto another device, and the only one.
   *
   * A row is one record on one device, so there is one thing to open and one
   * device to open it on. Clicking the card of the complication this panel
   * already has open leaves the editor where it is.
   */
  private async openFromPicker(row: PickerRow, copy: PickerCopy<PickerItem> = this.selectedCopyOf(row) ?? row.open) {
    // The card says which device's copy it is: a design on two watches is
    // two cards, and each opens its own. The row's default copy is the panel's
    // current device or the first in device order, which for a card in
    // another device's block is the wrong one.
    if (copy.item.kind !== "record") return;
    const record = copy.item.record;
    const target = copy.ownerId;
    this.togglePicker(false);
    if (target === this.ownerId) {
      this.selectRecord(this.records.find((r) => r.id === record.id) ?? record);
      return;
    }
    await this.selectOwner(target);
    // A dirty draft the owner switch asked about and was told to keep leaves
    // the editor where it was, so there is nothing to open.
    if (this.ownerId !== target) return;
    // Prefer the copy the switch just loaded: it carries the current revision.
    this.selectRecord(this.records.find((r) => r.id === record.id) ?? record);
  }

  /** New from inside the picker. One button, whatever the chips are on: the
   * dialog is where the devices are picked. */
  private newFromPicker() {
    this.togglePicker(false);
    this.openNewDialog();
  }

  /**
   * Browse: the way to every complication in the home. The name it used to
   * carry is the field beside it now, where it can be typed over, and the
   * shape and the device are the pill after that, so the button is only the
   * way out to the list.
   */
  private renderPicker() {
    return html`<div class="picker">
      <button id="wa-picker" class="pk-open tb-browse" aria-haspopup="dialog" aria-expanded=${this.pickerOpen ? "true" : "false"}
        title="Browse all complications" aria-label="Browse all complications"
        @click=${() => this.pickerOpen ? this.togglePicker(false) : this.browseAll()}>
        ${uiIcon("compact")}<span class="tb-browse-l">Browse</span>${uiIcon("chevron")}
      </button>
      ${this.pickerOpen ? this.renderPickerDialog() : nothing}
    </div>`;
  }

  /**
   * The picker's surface: every complication in the home as a card, under a
   * row of device tabs, a search field and the Shape menu.
   *
   * A centred dialog, not the 400 px dropdown this hung off the button for a
   * year. A dropdown that narrow holds a list and nothing else, so the
   * question a household actually asks here, "which of my devices has this",
   * was answered in one line of small grey text and nothing could be done
   * about it from the list at all. A card has room for the complication drawn
   * where it sits and for a Devices menu that writes a copy from here.
   *
   * All is one grid per device, each under its device's own heading, so the
   * whole home is one scroll and nothing has to be opened to be seen. A
   * device tab is that device's block on its own, for the household that
   * already knows which watch it means.
   *
   * One card per complication, whatever the household holds: a complication is
   * one shape on one device, so two people's watches showing "Kitchen" are two
   * cards and each is edited on its own.
   */
  private renderPickerDialog() {
    const d = this.draft;
    const devices = this.pickerDevices();
    const people = peopleOf(this.owners);
    const all = pickerView(this.pickerRows(), devices, ALL_DEVICES);
    const tabs = pickerTabs(all, devices);
    const tab = this.pickerTabKey(tabs);
    const query = this.pickerQuery.trim().toLocaleLowerCase();
    // The tab first, then the search, then the shape: the Shape menu counts
    // what this tab and this search have left, so an option says what picking
    // it would show.
    const onTab = tab === ALL_DEVICES ? all : rowsOnDevice(all, tab);
    const searched = onTab.filter((row) => this.pickerMatches(row, query, people));
    const filter = this.pickerFilter;
    const rows = filter === "all"
      ? searched
      : filter === "control"
        ? searched.filter((row) => row.open.item.kind === "record" && hasControlOf(row.open.item.record))
        : searched.filter((row) => familiesOfItem(row.open.item).includes(filter));
    // The draft nobody has saved yet belongs to the device it is being made
    // on, whatever the search and the shape say: it is the one thing on this
    // surface that would be lost by being filtered away.
    const unsaved = d && d.baseRevision === null ? d : undefined;
    // What the grid is about to draw, for the bar's "Pick all shown". A card
    // is one record on one device, so the All tab's key for a row is that
    // row's key once per device it is under.
    this.pickerShown = tab === ALL_DEVICES
      ? pickerSections(rows, devices).flatMap((sec) => sec.rows.map((row) => this.pickKeyOf(row, sec.ownerId)))
        .filter((k): k is string => k !== undefined)
      : rows.map((row) => this.pickKeyOf(row, tab)).filter((k): k is string => k !== undefined);
    // What an empty grid is empty of. The search wins when something has been
    // typed, because that is the last thing the author did; then the shape;
    // then the tab says what it is a tab of.
    const emptyOf = query !== ""
      ? `Nothing here matches "${this.pickerQuery.trim()}".`
      : filter === "control"
        ? "Nothing here has a control."
        : filter !== "all"
          ? `Nothing here has a ${familyTitle(filter)} shape.`
          : nothingOnText(tabs.find((t) => t.key === tab)?.kind ?? "all");
    return html`<dialog class="pk-dialog ${this.pickerBare ? "bare" : ""}" aria-label="Your complications"
      @close=${() => this.pickerClosed()}
      @cancel=${this.pickerCancel}
      @click=${this.pickerBackdrop}>
      <div class="pk-head">
        <h2>Your complications <span class="pk-head-count">${all.length}</span></h2>
        ${this.ownerBusy ? nothing : this.renderPickerLook()}
        ${this.ownerBusy ? nothing : this.renderPickerSelect()}
        ${this.ownerBusy ? nothing : this.renderPickerShapes(searched, this.tabFamilies(tab))}
        <label class="pk-search">
          ${uiIcon("search")}
          <input type="search" class="pk-search-input" .value=${this.pickerQuery}
            placeholder="Search by name or person" aria-label="Search complications"
            @input=${(e: Event) => { this.pickerQuery = (e.target as HTMLInputElement).value; }} />
        </label>
        <button class="icon" title="Close" aria-label="Close" @click=${() => this.closePicker()}>${uiIcon("close")}</button>
      </div>
      ${this.ownerBusy ? nothing : this.renderPickerTabs(tabs, tab, this.pickerPeople(people))}
      ${this.pickerSelecting ? this.renderPickerBar() : nothing}
      <div class="pk-body" id="pk-tabpanel" role="tabpanel" aria-labelledby=${`pk-tab-${tab}`}>
        ${this.ownerBusy
          ? html`<div class="empty">Loading…</div>`
          : tab === ALL_DEVICES
            ? this.renderPickerSections(rows, devices, query !== "" || filter !== "all", unsaved, emptyOf, this.pickerPeople(people))
            : this.renderPickerTabBody(rows, devices, tab, unsaved, emptyOf)}
      </div>
      ${this.renderPickerFoot()}
    </dialog>`;
  }

  /**
   * The All tab: one block per device, in the tabs' own order.
   *
   * A device with nothing on it still gets its heading and a line saying so,
   * because an empty watch is part of the answer to "what has this home got".
   * That only holds while nothing is being narrowed: under a search or a
   * shape an empty device is not news, so the block goes and the devices that
   * did match stay together.
   *
   * The library comes last and only when something is on the shelf: a shelf
   * nobody has used is not a fact worth a heading.
   */
  private renderPickerSections(
    rows: readonly PickerRow[],
    devices: readonly PickerDevice[],
    narrowed: boolean,
    unsaved: Draft | undefined,
    emptyOf: string,
    people: readonly PickerPerson[],
  ) {
    // A home holding nothing at all says that once, rather than once per
    // device: four headings over four apologies is a wall of nothing.
    if (rows.length === 0 && unsaved === undefined) return html`<div class="empty">${emptyOf}</div>`;
    const sections = pickerSections(rows, devices).filter((section) =>
      section.rows.length > 0
      || this.unsavedBelongsTo(unsaved, section.ownerId)
      || (!narrowed && section.kind !== "library"));
    if (sections.length === 0) return html`<div class="empty">${emptyOf}</div>`;
    // The blocks are grouped by whose devices they are, so a person's watch
    // and their iPhone stand together however far apart the home's own device
    // list put them.
    const bands = pickerBands(sections, people, (i) => people[i]?.label ?? "");
    return html`${bands.map((band) => this.renderPickerBand(band, unsaved, people))}`;
  }

  /**
   * One person's band: their name over their devices' blocks.
   *
   * A band folds away as a whole, which is the fold a four-watch household
   * reaches for first: "not mine" is one press rather than one per device.
   *
   * Devices that are nobody's, which is Unassigned and any orphan, get no
   * band at all. Their own heading already says what they are, and a band
   * with no name over it would read as a person called nothing.
   */
  private renderPickerBand(band: PickerBand<PickerItem>, unsaved: Draft | undefined, people: readonly PickerPerson[]) {
    const blocks = band.sections.map((section) => this.renderPickerSection(section, unsaved, people));
    if (band.personIndex < 0) return html`${blocks}`;
    const color = personColorVar(band.personIndex);
    const shut = this.pickerIsShut(band.key);
    const count = band.sections.reduce(
      (n, s) => n + s.rows.length + (this.unsavedBelongsTo(unsaved, s.ownerId) ? 1 : 0), 0);
    return html`<section class="pk-band ${shut ? "shut" : ""}" style=${color ? `--pk-person: ${color}` : nothing}>
      <h3 class="pk-band-top">
        <button type="button" class="pk-fold-btn" aria-expanded=${shut ? "false" : "true"}
          title=${shut ? `Show ${band.label}'s devices` : `Fold ${band.label}'s devices away`}
          @click=${() => this.togglePickerShut(band.key)}>
          <span class="pk-fold" aria-hidden="true">${uiIcon("chevron")}</span>
          <span class="pk-band-dot" aria-hidden="true"></span>
          <span class="pk-band-name">${band.label}</span>
          <span class="pk-band-count">${count}</span>
        </button>
        <span class="pk-band-rule" aria-hidden="true"></span>
      </h3>
      ${shut ? nothing : html`<div class="pk-band-body">${blocks}</div>`}
    </section>`;
  }

  /**
   * The head's Device toggle: whether a card draws the device round the shape.
   *
   * Offered to everybody, admin or not: it changes what a card looks like and
   * writes nothing.
   */
  private renderPickerLook() {
    const bare = this.pickerBare;
    return html`<div class="pk-seg" role="group" aria-label="How a card draws its complication">
      <button type="button" class="pk-seg-btn ${bare ? "" : "on"}" aria-pressed=${bare ? "false" : "true"}
        title="Draw each complication on the device it sits on"
        @click=${() => this.setPickerBare(false)}>${uiIcon("watch")}<span>Device</span></button>
      <button type="button" class="pk-seg-btn ${bare ? "on" : ""}" aria-pressed=${bare ? "true" : "false"}
        title="Draw the complication on its own, with no device round it"
        @click=${() => this.setPickerBare(true)}>${uiIcon("shape")}<span>Shape</span></button>
    </div>`;
  }

  /** Turn the device round a card's picture off, or on again, and remember it. */
  private setPickerBare(bare: boolean) {
    this.pickerBare = bare;
    this.saveListView();
  }

  /** One card's picture, drawn whichever way the head's Device toggle asks
   * for. Every card in the dialog goes through here, so the locked slots, the
   * saved cards and the one being made all answer the toggle together. */
  private cardArt(
    family: FamilyKind | undefined,
    device: "watch" | "iphone",
    live: LiveShapes,
    shelved: boolean,
  ) {
    if (!this.pickerBare) {
      return html`<span class="pk-card-crop">${deviceCropArt(family, device, live, { shelved })}</span>`;
    }
    // The well takes the shape's own proportions, so nothing is a small
    // picture in a large black box. A shape with no well of its own kept its
    // device picture, so it keeps the device view's well too.
    const well = shapeWell(family, device);
    return html`<span class="pk-card-crop bare" style=${well === undefined ? nothing : `aspect-ratio: ${well}`}
      >${shapeOnlyArt(family, device, live)}</span>`;
  }

  /** Whether one of the picker's blocks is folded away. */
  private pickerIsShut(key: string): boolean {
    return this.pickerShut.includes(key);
  }

  /** Fold one block away, or open it again, and remember which. */
  private togglePickerShut(key: string) {
    this.pickerShut = this.pickerIsShut(key)
      ? this.pickerShut.filter((k) => k !== key)
      : [...this.pickerShut, key];
    this.saveListView();
  }

  /** One device tab: that device's cards on their own, with no heading over
   * them. The tab is the heading. */
  private renderPickerTabBody(
    rows: readonly PickerRow[],
    devices: readonly PickerDevice[],
    tab: string,
    unsaved: Draft | undefined,
    emptyOf: string,
  ) {
    const mine = this.unsavedBelongsTo(unsaved, tab) ? unsaved : undefined;
    const kind = deviceKindOf(this.ownerOf(tab));
    const note = kind === "library" ? html`<p class="pk-sec-note lone">${LIBRARY_NOTE}</p>` : nothing;
    if (rows.length === 0 && mine === undefined) return html`${note}<div class="empty">${emptyOf}</div>`;
    return html`${note}${this.renderPickerGroups(sortPickerRows(rows, devices, tab), tab, mine)}`;
  }

  /** One device's block of the All tab: its heading, then its cards. The
   * heading wears its owner's color, the same one that person's tabs wear. */
  private renderPickerSection(section: PickerSection<PickerItem>, unsaved: Draft | undefined, people: readonly PickerPerson[]) {
    const mine = this.unsavedBelongsTo(unsaved, section.ownerId) ? unsaved : undefined;
    const count = section.rows.length + (mine ? 1 : 0);
    const color = personColorVar(personIndex(people, section.ownerId));
    const shut = this.pickerIsShut(section.ownerId);
    return html`<section class="pk-sec ${shut ? "shut" : ""}" style=${color ? `--pk-person: ${color}` : nothing}>
      <div class="pk-sec-top">
        <h4 class="pk-sec-head">
          <button type="button" class="pk-fold-btn" aria-expanded=${shut ? "false" : "true"}
            title=${shut ? `Show ${section.label}` : `Fold ${section.label} away`}
            @click=${() => this.togglePickerShut(section.ownerId)}>
            <span class="pk-fold" aria-hidden="true">${uiIcon("chevron")}</span>
            <span class="pk-sec-glyph" aria-hidden="true">${uiIcon(tabIcon(section.kind))}</span>
            <span class="pk-sec-name">${section.label}</span>
            <span class="pk-sec-count">${count}</span>
          </button>
        </h4>
        ${section.kind === "library" ? html`<p class="pk-sec-note">${LIBRARY_NOTE}</p>` : nothing}
      </div>
      ${shut
        ? nothing
        : html`<div class="pk-sec-body">${count === 0
          ? html`<div class="pk-sec-empty">${nothingOnText(section.kind)}</div>`
          : this.renderPickerGroups(section.rows, section.ownerId, mine)}</div>`}
    </section>`;
  }

  /**
   * One device's cards, cut into a box per shape.
   *
   * A watch holding twenty-three complications used to be one grid of them in
   * name order, with rectangular, circular and inline cards shuffled together.
   * The shape is the first thing anybody looking for one of their own knows
   * about it, so it is what the cards are filed under.
   *
   * The box is drawn whatever the count, including a device that draws one
   * shape only: the same block of a phone and of a watch then read the same
   * way, and the label says which shape a lone box is without anything having
   * to be counted.
   *
   * The complication being made has no record yet and no box of its own: it
   * joins the box of the shape it will be, or makes that box if this device
   * has none of them yet.
   */
  private renderPickerGroups(rows: readonly PickerRow[], at: string, unsaved: Draft | undefined) {
    const order = shapeGroupOrder(deviceKindOf(this.ownerOf(at)));
    const groups = pickerShapeGroups(rows, (row) => this.pickerShapeOf(row, at), order)
      .map((g) => ({ key: g.key, label: g.label, rows: g.rows, unsaved: false }));
    if (unsaved) {
      const spare = this.draftShapeOf(unsaved);
      const hit = groups.find((g) => g.key === spare.key);
      if (hit) hit.unsaved = true;
      else {
        groups.push({ key: spare.key, label: spare.label, rows: [], unsaved: true });
        groups.sort((a, b) => shapeGroupRank(order, a.key) - shapeGroupRank(order, b.key));
      }
    }
    return html`<div class="pk-boxes">
      ${groups.map((group) => html`<section class="pk-box" aria-label=${group.label}
        style=${shapeColorVar(group.key) ?? nothing}>
        <div class="pk-box-top">
          ${this.renderShapePick(group.rows, at)}
          <span class="pk-box-name">${group.label}</span>
          <span class="pk-box-count">(${group.rows.length + (group.unsaved ? 1 : 0)})</span>
        </div>
        <div class="pk-grid">
          ${group.rows.map((row) => this.renderPickerCard(row, at))}
          ${group.unsaved && unsaved ? this.renderUnsavedCard(unsaved) : nothing}
        </div>
      </section>`)}
    </div>`;
  }

  /** The box's own tick, while several cards are being picked: it picks every
   * card in that box, or lets them all go. The box is the useful unit here:
   * "every rectangular one on this watch" is what a sweep is usually of. */
  private renderShapePick(rows: readonly PickerRow[], at: string) {
    if (!this.pickerSelecting) return nothing;
    const keys = rows.map((row) => this.pickKeyOf(row, at)).filter((k): k is string => k !== undefined);
    if (keys.length === 0) return nothing;
    const all = keys.every((k) => this.pickerPicked.includes(k));
    // Half the box picked is worth saying now that the control is a tick box:
    // as a switch it could only be on or off, and "some" read as none.
    const some = !all && keys.some((k) => this.pickerPicked.includes(k));
    return html`<input type="checkbox" class="pk-box-pick" .checked=${all} .indeterminate=${some}
      title=${all ? "Let these go" : "Pick every card in this box"}
      aria-label=${all ? "Let this shape's cards go" : "Pick this shape's cards"}
      ?disabled=${this.saving}
      @change=${() => this.pickMany(keys, !all)}>`;
  }

  /**
   * Which shape box one card falls in: its shape, and the words over the box.
   *
   * The card's own device's copy, so a design on a watch and a phone is filed
   * under the shape each one draws rather than under the first device's.
   */
  private pickerShapeOf(row: PickerRow, at: string): { key: string; label: string } {
    const copy = row.copies.find((c) => c.ownerId === at) ?? row.open;
    const families = familiesOfItem(copy.item);
    const family = ALL_FAMILIES.find((f) => families.includes(f));
    const control = copy.item.kind === "record" && hasControlOf(copy.item.record);
    return { key: family ?? (control ? "control" : "none"), label: cardShapeTitle(family, control) };
  }

  /** The same, for the complication being made, which has no record to read. */
  private draftShapeOf(d: Draft): { key: string; label: string } {
    const family = ALL_FAMILIES.find((f) => d.config.supportedFamilies.includes(f));
    const control = d.config.control !== undefined;
    return { key: family ?? (control ? "control" : "none"), label: cardShapeTitle(family, control) };
  }

  /** Whether the unsaved draft is being made on this device, which is the
   * section its card goes in. */
  private unsavedBelongsTo(unsaved: Draft | undefined, ownerId: string): boolean {
    return unsaved !== undefined && this.ownerId === ownerId;
  }

  /** The complication being made, which has no record behind it yet. A card
   * of its own in its device's own block, so it sits where it will sit once
   * it is saved. */
  private renderUnsavedCard(d: Draft) {
    const cfg = d.config;
    const families = ALL_FAMILIES.filter((f) => cfg.supportedFamilies.includes(f));
    const family = families[0];
    const kind = deviceKindOf(this.selectedOwner);
    const device = this.cardDevice(kind, family);
    const live = this.cardLive(cfg, this.historyEntities(cfg));
    return html`<div class="pk-card ${kind === "library" ? "shelved" : ""}" aria-current="true">
      <div class="pk-card-top">
        <span class="pk-card-name">${cfg.name.trim() || "Untitled"}</span>
        <span class="pk-badge">unsaved</span>
      </div>
      <div class="pk-card-pic">
        ${this.cardArt(family, device, device === "iphone" ? live.phone : live.watch, kind === "library")}
      </div>
    </div>`;
  }

  /**
   * The line under the grid: what a card does, then the two buttons that
   * bring a complication in from outside.
   *
   * It carries what a write said, too. The panel's own banner for that sits in
   * the editor behind a modal backdrop, so a write started from a card would
   * have said so where nobody could read it until the dialog was shut.
   */
  private renderPickerFoot() {
    if (!this.hass.user?.is_admin) return nothing;
    // The seats being counted are the edited device's: that is where New puts
    // a complication, and its dialog is where another device is chosen.
    const full = this.freeSlot() < 0;
    const where = this.selectedOwner ? ownerLabel(this.selectedOwner) : "This device";
    const said = this.saveError ?? this.copyStatus;
    return html`<div class="pk-foot">
      ${said === undefined
        ? html`<span class="pk-foot-hint">Click a card to open it. Hover a card for Duplicate, Unassign and Delete.</span>`
        : html`<span class="pk-foot-said ${this.saveError ? "err" : ""}">${said}</span>
          <button type="button" class="ghost small"
            @click=${() => { this.saveError = undefined; this.copyStatus = undefined; this.copyOpen = undefined; }}>Dismiss</button>`}
      <button type="button" class="new-btn" ?disabled=${this.backingUp}
        title="Save every complication in this home to one file"
        @click=${() => void this.backupAll()}>${uiIcon("download")}<span>${this.backingUp ? "Backing up…" : "Back up all"}</span></button>
      <button type="button" class="new-btn" ?disabled=${full || this.ownerBusy}
        title=${full ? `${where} has no free slot. Delete a complication first.` : "Paste a complication somebody shared"}
        @click=${() => this.importFromPicker()}><span>Import</span></button>
      <button type="button" class="new-btn primary" ?disabled=${full || this.ownerBusy}
        title=${full ? `${where} has no free slot. Delete a complication first.` : "Make a new complication"}
        @click=${() => this.newFromPicker()}>${uiIcon("plus")}<span>New</span></button>
    </div>`;
  }

  // ── picking several at once ───────────────────────────────────────────
  //
  // Everything else on this surface acts on one card: open it, hide it, put
  // it on a device, delete it. A household that has just added a watch, or
  // that wants last winter's six cameras off the list, was doing that six
  // times over with a confirm each. Picking turns the cards into ticks and
  // puts one bar of the same four acts under the grid.
  //
  // The writes themselves are the single-card ones, run one at a time: a
  // batch is a loop over the same server calls, never a second way of writing
  // that could drift from the first. One that fails stops the rest and says
  // so, rather than reporting twenty failures of the same cause.

  /** The head's Select toggle. Admins only, because every act on the bar is a
   * write and a reader has none of them. */
  private renderPickerSelect() {
    if (!this.hass.user?.is_admin) return nothing;
    const on = this.pickerSelecting;
    return html`<button type="button" class="pk-pick-btn ${on ? "on" : ""}" aria-pressed=${on ? "true" : "false"}
      title=${on ? "Back to opening one card at a time" : "Pick several cards and act on them together"}
      ?disabled=${this.saving} @click=${() => this.setPickerSelecting(!on)}>
      ${uiIcon("checklist")}<span>Multi select</span></button>`;
  }

  /** Turn picking on or off. Turning it off lets every pick go: a pick that
   * survived the mode would act on cards nobody can see is picked. */
  private setPickerSelecting(on: boolean) {
    this.pickerSelecting = on;
    this.pickerPicked = [];
    this.pickerBatchAsk = undefined;
    this.pickerBatchAdd = false;
    if (on) this.closePickerDup();
  }

  /** The pick key of one card: the record it is, on the device it is under.
   * Undefined for a locked slot, which is another home's or the iPhone's own
   * and nothing here may write to. */
  private pickKeyOf(row: PickerRow, at: string): string | undefined {
    const copy = row.copies.find((c) => c.ownerId === at) ?? row.open;
    if (copy.item.kind !== "record") return undefined;
    return `${copy.ownerId}|${copy.item.record.id}`;
  }

  /** A pick key read back: which device, and which record on it. */
  private cardAt(key: string): { ownerId: string; id: string } | undefined {
    const cut = key.indexOf("|");
    if (cut < 0) return undefined;
    return { ownerId: key.slice(0, cut), id: key.slice(cut + 1) };
  }

  /** The row one picked card belongs to, read again from the lists as they
   * are now: a write a moment ago may have given its design a link, which
   * changes the row the card is in. */
  private rowForCard(at: { ownerId: string; id: string }): PickerRow | undefined {
    return this.pickerRows().find((row) =>
      row.copies.some((c) => c.ownerId === at.ownerId && c.id === at.id));
  }

  /** The shape one picked card's own copy draws, which is the shape its seat
   * and its Devices boxes are about. */
  private cardFamily(row: PickerRow, at: string): FamilyKind | undefined {
    const copy = row.copies.find((c) => c.ownerId === at) ?? row.open;
    const families = familiesOfItem(copy.item);
    return ALL_FAMILIES.find((f) => families.includes(f));
  }

  private togglePickedCard(key: string) {
    this.pickerPicked = this.pickerPicked.includes(key)
      ? this.pickerPicked.filter((k) => k !== key)
      : [...this.pickerPicked, key];
  }

  private pickMany(keys: readonly string[], on: boolean) {
    const rest = this.pickerPicked.filter((k) => !keys.includes(k));
    this.pickerPicked = on ? [...rest, ...keys] : rest;
  }

  /**
   * The bar under the grid while cards are being picked: what is picked, and
   * the four things that can be done to them.
   *
   * It sits above the foot rather than replacing it, so Import and New stay
   * where they were and nothing moves when picking is turned on.
   */
  private renderPickerBar() {
    if (!this.hass.user?.is_admin) return nothing;
    const n = this.pickerPicked.length;
    const shown = this.pickerShown;
    const allShown = shown.length > 0 && shown.every((k) => this.pickerPicked.includes(k));
    const busy = this.saving || this.pickerBatchNote !== undefined;
    const none = n === 0;
    return html`<div class="pk-bar" role="group" aria-label="Act on the picked complications">
      <span class="pk-bar-count">${this.pickerBatchNote ?? (none ? "Pick a card to start." : `${n} picked`)}</span>
      <button type="button" class="ghost small" ?disabled=${busy || shown.length === 0}
        title=${allShown ? "Let the cards on screen go" : "Pick every card the tab, the search and the shape have left"}
        @click=${() => this.pickMany(shown, !allShown)}>${allShown ? "None" : "All shown"}</button>
      <span class="pk-bar-gap" aria-hidden="true"></span>
      ${this.pickerBatchAsk === "delete"
        ? html`<span class="pk-bar-ask">Delete ${n}? Faces and widgets using them lose them.</span>
          <button type="button" class="ghost danger small" ?disabled=${busy}
            @click=${() => void this.batchDelete()}>Really delete</button>
          <button type="button" class="ghost small" @click=${() => { this.pickerBatchAsk = undefined; }}>Cancel</button>`
        : html`<button type="button" class="ghost small" ?disabled=${busy || none}
            title="Show these in their devices' own lists again"
            @click=${() => void this.batchHidden(false)}>${uiIcon("show")}<span>Show</span></button>
          <button type="button" class="ghost small" ?disabled=${busy || none}
            title="Hide these from their devices' own lists. Faces already using one keep it."
            @click=${() => void this.batchHidden(true)}>${uiIcon("hide")}<span>Hide</span></button>
          ${this.renderBatchAdd(busy || none)}
          <button type="button" class="ghost small" ?disabled=${busy || none}
            title="Take each of these off the device its card is under. The last copy of a design is kept as unassigned."
            @click=${() => void this.batchTakeOff()}>${uiIcon("layers")}<span>Take off</span></button>
          <button type="button" class="ghost danger small" ?disabled=${busy || none}
            title="Delete these complications"
            @click=${() => { this.pickerBatchAsk = "delete"; }}>${uiIcon("delete")}<span>Delete</span></button>`}
      <button type="button" class="primary small pk-bar-done" ?disabled=${this.pickerBatchNote !== undefined}
        title="Stop picking and go back to opening one card at a time"
        @click=${() => this.setPickerSelecting(false)}>${uiIcon("check")}<span>Done</span></button>
    </div>`;
  }

  /** "Put on…": the home's devices, one row each. A design already on a
   * device is skipped there rather than refused, so one press can top up a
   * new watch from a mixed pick. */
  private renderBatchAdd(off: boolean) {
    const open = this.pickerBatchAdd;
    const targets = this.batchTargets();
    return html`<span class="pk-bar-menu" data-dup="pk-bar-add">
      <button type="button" class="ghost small" aria-expanded=${open ? "true" : "false"}
        ?disabled=${off || targets.length === 0} title="Put a copy of each of these on another device"
        @click=${() => { this.pickerBatchAdd = !open; }}>${uiIcon("plus")}<span>Put on…</span></button>
      ${open
        ? html`<div class="pk-bar-list" role="group" aria-label="Put the picked complications on">
          ${targets.map((target) => html`<button type="button" class="pk-bar-row"
            @click=${() => void this.batchAddTo(target)}>
            ${uiIcon(target.kind === "iphone" ? "phone" : "watch")}
            <span class="pk-dup-name">${target.label}</span></button>`)}
        </div>`
        : nothing}
    </span>`;
  }

  /** The devices a batch can put a copy on: the home's real ones. Unassigned
   * is where a design waits rather than a place to be put, so it is not
   * offered; "Take off" is what leaves a design there. */
  private batchTargets(): DeviceOwner[] {
    return ownersByKind(this.owners)
      .filter((o) => !isLibraryOwner(o) && !o.is_orphan)
      .map((o) => this.deviceOwnerOf(o));
  }

  /**
   * Run one act over every picked card, one write at a time.
   *
   * Serial on purpose: each of these writes reads the lists again first, and
   * two of them in flight would each be looking at seats the other is taking.
   * The first failure stops the rest, since twenty reports of one cause is
   * not twenty pieces of news.
   */
  private async runBatch(doing: string, act: (at: { ownerId: string; id: string }) => Promise<void>) {
    if (!this.hass.user?.is_admin || this.saving || this.pickerBatchNote !== undefined) return;
    const keys = [...this.pickerPicked];
    if (keys.length === 0) return;
    this.pickerBatchAsk = undefined;
    this.pickerBatchAdd = false;
    this.saveError = undefined;
    this.copyStatus = undefined;
    let done = 0;
    for (const key of keys) {
      this.pickerBatchNote = `${doing} ${done + 1} of ${keys.length}…`;
      const at = this.cardAt(key);
      if (!at) continue;
      try {
        await act(at);
      } catch (err) {
        this.saveError = errText(err);
      }
      if (this.saveError !== undefined) break;
      done += 1;
    }
    this.pickerBatchNote = undefined;
    if (this.saveError === undefined) this.copyStatus = `${doing} done: ${done} of ${keys.length}.`;
    else if (done > 0) this.saveError = `${this.saveError} ${done} of ${keys.length} were done first.`;
  }

  /** Hide every picked card from its own device's list, or show them again.
   * One already the way it is asked for is left alone rather than written
   * again, so a mixed pick takes one write per card that needs one. */
  private async batchHidden(hide: boolean) {
    await this.runBatch(hide ? "Hiding" : "Showing", async (at) => {
      const record = this.recordAt(at.ownerId, at.id);
      if (!record || this.rowHidden(record) === hide) return;
      await this.setPickerHidden(record, hide, at.ownerId);
    });
  }

  /**
   * Delete every picked card.
   *
   * The card, not the design: a pick is a card, so a design on two devices
   * with one card picked loses that copy and keeps the other. Picking both
   * cards is how the whole design goes, which is the same thing said in the
   * same place.
   */
  private async batchDelete() {
    await this.runBatch("Deleting", async (at) => {
      const record = this.recordAt(at.ownerId, at.id);
      if (!record) return;
      await this.deleteSaved(record.id, record.revision, at.ownerId, false);
    });
    this.pickerPicked = [];
  }

  /** Put a copy of every picked design on one more device. One already there
   * is skipped, so a pick of a whole watch tops a new one up. */
  private async batchAddTo(target: DeviceOwner) {
    await this.runBatch(`Putting on ${target.label}`, async (at) => {
      const row = this.rowForCard(at);
      if (!row) return;
      if (row.copies.some((c) => c.ownerId === target.ownerId)) return;
      await this.addRowTo(row, target, true);
    });
  }

  /**
   * Take every picked card off the device its card is under.
   *
   * The last copy of a design is moved to Unassigned rather than deleted,
   * which is what one card's own Devices box does. The copy the editor has
   * open is left where it is: a delete out from under a draft is the one
   * thing the picker refuses, and a batch is no reason to change that.
   */
  private async batchTakeOff() {
    let open = 0;
    await this.runBatch("Taking off", async (at) => {
      const row = this.rowForCard(at);
      if (!row) return;
      const place = this.rowPlaces(row, this.cardFamily(row, at.ownerId))
        .find((p) => p.owner.ownerId === at.ownerId);
      if (!place?.on) return;
      if (place.copies.some((c) => this.isOpenCopy(c))) { open += 1; return; }
      await this.removeRowFrom(row, place, true);
    });
    this.pickerPicked = [];
    if (open > 0 && this.saveError === undefined) {
      this.copyStatus = `${this.copyStatus ?? ""} The one open in the editor was left on its device: use Delete there.`.trim();
    }
  }

  /**
   * One card: the complication where it sits, and its name under it.
   *
   * One picture, cropped to the slot the complication fills on its own
   * device. A card used to carry two, the design alone and then a whole watch
   * and phone with its slots lit, which said where it sat twice and drew a
   * Home Screen tile nine pixels tall doing it. The section or the tab says
   * which device, so the picture only has to say where on it.
   */
  private renderPickerCard(row: PickerRow, at: string) {
    // The card stands in one device's block, so it draws and acts on that
    // device's copy of the design: its Hide is that device's, its preview is
    // what that device shows. The All tab's sections and a device tab both
    // say which device that is; a row with no copy there draws its own.
    const copy = row.copies.find((c) => c.ownerId === at) ?? row.open;
    // One card per device per design, so a design on two devices is two
    // cards on the All tab, and the menu and the confirm belong to one of
    // them, not to the row.
    const cardKey = `${at}|${row.key}`;
    const shelved = isShelvedRow(row);
    if (copy.item.kind !== "record") {
      const item = copy.item;
      const families = ALL_FAMILIES.filter((f) => item.families.includes(f));
      const family = families[0];
      const kind = deviceKindOf(this.ownerOf(copy.ownerId));
      return html`<div class="pk-card locked ${shelved ? "shelved" : ""}">
        <div class="pk-card-top">
          <button type="button" class="pk-card-name" title=${item.title}
            @click=${() => { this.pickerNote = this.pickerNote === row.key ? undefined : row.key; }}>${row.name}</button>
          <span class="pk-badge">${item.badge}</span>
        </div>
        <div class="pk-card-pic">
          <button type="button" class="pk-card-open" title=${item.title}
            @click=${() => { this.pickerNote = this.pickerNote === row.key ? undefined : row.key; }}>
            ${family === undefined
              ? html`<span class="pk-card-crop none">No preview</span>`
              : html`${this.cardArt(family, this.cardDevice(kind, family), {}, shelved)}`}
          </button>
        </div>
        ${this.pickerNote === row.key ? html`<div class="pk-note">${item.title}</div>` : nothing}
      </div>`;
    }
    const drawn = copy.item.record;
    // A row is one record on one device, so the copy the card draws is the one
    // its buttons act on. The one exception is the record this panel has open,
    // whose hide goes through its draft rather than behind it.
    const mine = this.selectedCopyOf(row);
    const actOn = mine !== undefined && mine.ownerId === copy.ownerId ? mine : copy;
    const actOwnerId = actOn.ownerId;
    const record = actOn.item.kind === "record" ? actOn.item.record : drawn;
    const open = actOn === mine;
    const hidden = this.rowHidden(record);
    const recName = row.name;
    // The one shape this record draws, and its control if it has one.
    const families = ALL_FAMILIES.filter((f) => familiesOf(drawn).includes(f));
    const family = families[0];
    const control = hasControlOf(drawn);
    // Which list Hide takes it out of. A device has its own list of
    // complications; Unassigned is a place rather than a device, so it is
    // named instead of being called "the Unassigned's complication list".
    const actOwner = this.ownerOf(actOwnerId);
    const listOf = isLibraryOwner(actOwner)
      ? "the Unassigned list"
      : `the ${deviceNoun(actOwner)}'s complication list`;
    const kind = deviceKindOf(this.ownerOf(copy.ownerId));
    const device = this.cardDevice(kind, family);
    // The open complication goes through the inspector's own Delete, so an
    // unsaved draft and a conflict behave the same from either place. Hide
    // follows the same split: the open one through its draft, others at once.
    const mayDelete = open ? this.canEdit : !!this.hass.user?.is_admin;
    const confirming = this.pickerConfirmDelete === record.id;
    const stop = (e: Event) => e.stopPropagation();
    // Parsed once per record and resolved once per card: this method is only
    // called for the cards the tab, the shape and the search left in.
    const preview = this.recordPreview(drawn);
    const live = preview ? this.cardLive(preview.config, preview.entities) : undefined;
    const menu = this.pickerDupFor === cardKey;
    const linked = row.copies.length > 1;
    const del = (everywhere: boolean) => void (open
      ? this.deleteCurrent(everywhere)
      : this.deleteSaved(record.id, record.revision, actOwnerId, everywhere));
    // While several are being picked, the card is a tick rather than a door:
    // the name and the picture both toggle it, so there is no small target to
    // find, and the hover actions stand down because the bar under the grid is
    // what acts on a pick.
    const picking = this.pickerSelecting && this.hass.user?.is_admin === true;
    const pickKey = `${actOwnerId}|${record.id}`;
    const picked = picking && this.pickerPicked.includes(pickKey);
    const hit = () => { if (picking) this.togglePickedCard(pickKey); else void this.openFromPicker(row, actOn); };
    const doing = picking ? (picked ? `Let ${recName} go` : `Pick ${recName}`) : "Open this complication";
    return html`<div class="pk-card ${hidden ? "dim" : ""} ${menu ? "over" : ""} ${shelved ? "shelved" : ""}
      ${picking ? "picking" : ""} ${picked ? "picked" : ""}"
      aria-current=${open ? "true" : "false"}>
      <div class="pk-card-top">
        ${picking
          ? html`<input type="checkbox" class="pk-card-pick" .checked=${picked} aria-label=${doing}
              ?disabled=${this.saving} @change=${() => this.togglePickedCard(pickKey)}>`
          : nothing}
        <button type="button" class="pk-card-name" title=${doing} @click=${hit}>${recName}</button>
        ${hidden ? html`<span class="pk-tag" title="These do not show in their device's own list of complications. A face or widget that already has one keeps it.">hidden</span>` : nothing}
      </div>
      <div class="pk-card-pic">
        <button type="button" class="pk-card-open" title=${doing}
          aria-label=${doing} @click=${hit}>
          ${this.cardArt(family, device,
            live ? (device === "iphone" ? live.phone : live.watch) : {}, shelved)}
        </button>
        <span class="pk-card-acts ${confirming ? "asking" : ""} ${picking ? "away" : ""}">
          ${confirming
            ? linked
              ? html`<button type="button" class="ghost danger small" ?disabled=${this.saving}
                  title=${`Delete only the copy on ${this.ownerName(actOwnerId)}`}
                  @click=${(e: Event) => { stop(e); del(false); }}>This device</button>
                <button type="button" class="ghost danger small" ?disabled=${this.saving}
                  title="Delete it on every device it is on"
                  @click=${(e: Event) => { stop(e); del(true); }}>All ${row.copies.length} devices</button>
                <button type="button" class="ghost small" @click=${(e: Event) => { stop(e); this.pickerConfirmDelete = undefined; }}>Cancel</button>`
              : html`<button type="button" class="ghost danger small" ?disabled=${this.saving}
                  @click=${(e: Event) => { stop(e); del(true); }}>Really delete</button>
                <button type="button" class="ghost small" @click=${(e: Event) => { stop(e); this.pickerConfirmDelete = undefined; }}>Cancel</button>`
            : html`${this.renderPickerDup(row, menu, cardKey)}
              ${mayDelete ? html`<button type="button" class="icon" ?disabled=${!open && this.saving}
                title=${hidden ? `Hidden from ${listOf}. Show it there again.` : `Hide from ${listOf}. Faces already using it keep it.`}
                aria-label=${hidden ? `Show ${recName} in ${listOf}` : `Hide ${recName} from ${listOf}`}
                @click=${(e: Event) => { stop(e); void this.setPickerHidden(record, !hidden, actOwnerId); }}>${uiIcon(hidden ? "hide" : "show")}</button>
              <button type="button" class="icon danger" title="Delete this complication" aria-label=${`Delete ${recName}`}
                ?disabled=${this.saving} @click=${(e: Event) => { stop(e); this.pickerConfirmDelete = record.id; }}>${uiIcon("delete")}</button>` : nothing}`}
        </span>
        ${menu ? this.renderPickerDupMenu(row, family, cardKey) : nothing}
      </div>
    </div>`;
  }

  /**
   * "Devices": where this design is, as a box per device, and "Duplicate as"
   * under them.
   *
   * The one control on this surface that writes anything. Everything else here
   * opens a complication or takes one away; this puts the design on somebody
   * else's watch without the author having to open it first, takes it off one
   * without having to find that device's card, and shelves it without having
   * to delete it.
   *
   * A box is ticked for the device the card is on and for any device holding
   * a record with this name and shape, since nothing else says two records
   * are one design. Ticking writes a copy there. Unticking removes that
   * device's copy, or, on the card's own device, unassigns the card's record.
   *
   * One menu at a time, held absolutely inside its own card, so a grid four
   * cards wide never has two of them overlapping each other.
   */
  private renderPickerDup(row: PickerRow, open: boolean, cardKey: string) {
    if (!this.hass.user?.is_admin) return nothing;
    if (row.open.item.kind !== "record") return nothing;
    return html`<span class="pk-dup" data-dup=${cardKey}>
      <button type="button" class="pk-dup-open ${open ? "on" : ""}" aria-expanded=${open ? "true" : "false"}
        title="Pick the devices this design is on" ?disabled=${this.saving}
        @click=${() => { if (open) this.closePickerDup(); else this.openPickerDup(cardKey); }}>Devices${uiIcon("chevron")}</button>
    </span>`;
  }

  /** The menu itself, drawn over the card's picture rather than hung off the
   * button: as wide as the picture, so it never runs out past the dialog's
   * edge on a card in the first column.
   *
   * Unassigned is listed only while the design is there, which it is only
   * while it is on no device at all. It is where a design waits, not a place
   * to be picked, so there is never a box to tick it on. */
  private renderPickerDupMenu(row: PickerRow, family: FamilyKind | undefined, cardKey: string) {
    const places = this.rowPlaces(row, family);
    const shape = family === undefined ? "Control Center control" : familyTitle(family).toLowerCase();
    return html`<div class="pk-dup-menu" role="group" aria-label=${`Devices for ${row.name}`} data-dup=${cardKey}>
      <div class="pk-dup-head">This ${shape} is on</div>
      ${places.filter((p) => p.owner.kind !== "library" || p.on).map((place) => this.renderPickerPlace(row, place, family))}
      <button type="button" class="pk-dup-row other" ?disabled=${this.saving}
        title="Make this design again as another shape, or on the other kind of device"
        @click=${() => this.duplicateAsFromCard(row)}>${uiIcon("shape")}
        <span class="pk-dup-name">Duplicate as another shape…</span></button>
      <div class="pk-dup-note">On means the design is on that device, and saving it saves it there too. The eye hides it from that device's own list; a face or widget already using it keeps it.</div>
      <button type="button" class="pk-dup-done" @click=${() => this.closePickerDup()}>Done</button>
    </div>`;
  }

  /** One device inside "Devices": a box, ticked when the design is there. A
   * device with no seat left for this shape says so rather than being quietly
   * greyed, and a box that cannot be unticked says why. */
  private renderPickerPlace(row: PickerRow, place: DevicePlace, family: FamilyKind | undefined) {
    const target = place.owner;
    const label = target.kind === "library" ? UNASSIGNED_LABEL : target.label;
    const full = place.draws && !place.on && this.freeSlotOn(target.ownerId, family) < 0;
    const shelf = this.libraryOwner();
    // A device whose app is too old for this shape, or that has not said
    // which version it runs. Named in the gate's own words.
    const owner = this.ownerOf(target.ownerId);
    const tooOld = !place.on && !place.draws
      ? (deviceSupportsShapes(owner) ? "This device's app does not draw this shape." : updateDeviceMessage(owner))
      : undefined;
    // The copy the editor has open cannot be taken out from under its draft:
    // Delete is what removes it. The last copy anywhere moves to Unassigned
    // rather than being deleted, which has nowhere to go from Unassigned.
    const open = place.on && place.copies.some((c) => this.isOpenCopy(c));
    const stuck = !place.on
      ? undefined
      : open
        ? "It is open in the editor. Use Delete there."
        : place.last && target.kind === "library"
          ? "It is unassigned already. Delete removes it."
          : place.last && shelf === undefined
            ? "This integration has no Unassigned list to move it to. Delete removes it."
            : undefined;
    const title = tooOld ?? (full
      ? `${label} has no free seat for this shape (iPhone presets count too). Delete a complication on it first.`
      : stuck ?? (place.on
        ? place.last
          ? "Take it off this device and keep it as unassigned"
          : `Take it off ${label}. A face or widget already using it keeps it.`
        : `Put it on ${label}. Saving it saves it everywhere it is.`));
    const disabled = this.saving || full || stuck !== undefined || tooOld !== undefined;
    // Hidden is per device: each copy keeps its own flag, and the eye on a
    // ticked row flips that device's. The open copy's goes through its draft.
    const here = place.on ? this.recordAt(target.ownerId, place.copies[0]!.id) : undefined;
    const hid = here !== undefined && this.rowHidden(here);
    return html`<div class="pk-dup-row check ${disabled ? "off" : ""}">
      <label class="pk-dup-pick" title=${title}>
        <input type="checkbox" .checked=${place.on} ?disabled=${disabled}
          aria-label=${`${row.name} on ${label}`}
          @change=${(e: Event) => {
            const box = e.currentTarget as HTMLInputElement;
            // The box follows the lists, not the click: it is drawn again from
            // them once the write has landed, or stays as it was if it fails.
            box.checked = place.on;
            void (place.on ? this.removeRowFrom(row, place) : this.addRowTo(row, target));
          }}>
        ${uiIcon(target.kind === "iphone" ? "phone" : target.kind === "library" ? "layers" : "watch")}
        <span class="pk-dup-name">${label}</span>
        ${full ? html`<span class="pk-dup-full">full, ${this.slotsTakenOn(target.ownerId)} of ${MAX_SLOTS}</span>` : nothing}
      </label>
      ${here ? html`<button type="button" class="pk-dup-eye ${hid ? "hid" : ""}" ?disabled=${this.saving && !this.isOpenCopy(place.copies[0]!)}
        title=${hid ? `Hidden from ${label}'s own list. Show it there again.` : `Hide from ${label}'s own list. A face or widget already using it keeps it.`}
        aria-label=${hid ? `Show ${row.name} on ${label}` : `Hide ${row.name} on ${label}`}
        @click=${() => void this.setPickerHidden(here, !hid, target.ownerId)}>${uiIcon(hid ? "hide" : "show")}</button>` : nothing}
    </div>`;
  }

  /** Whether one copy is the record the editor has open. */
  private isOpenCopy(copy: PlaceCopy): boolean {
    return copy.ownerId === this.ownerId && copy.id === this.selectedId;
  }

  /**
   * The places one card lists: the devices of its own kind that draw its
   * shape, the one it is on, and the library.
   *
   * The same kind, because a watch design and a phone design are different
   * places to stand even when they draw the same shape, and the editor's
   * "Duplicate as" is where crossing between them is asked for. A design on
   * the shelf is the exception: it is on no device at all, so every device
   * that draws its shape is offered.
   */
  private rowPlaces(row: PickerRow, family: FamilyKind | undefined): DevicePlace[] {
    // Every device in the home, not only the ones whose app draws shapes: a
    // watch that is too old is listed greyed with the reason, so nobody
    // wonders where it went.
    const shelf = this.libraryOwner();
    const devices = ownersByKind(this.owners)
      .filter((o) => !isLibraryOwner(o) && !o.is_orphan)
      .map((o) => this.deviceOwnerOf(o));
    const candidates = shelf ? [...devices, shelf] : devices;
    const copies = row.copies
      .filter((c) => c.item.kind === "record")
      .map((c): PlaceCopy => ({ ownerId: c.ownerId, id: c.id }));
    return devicePlaces(candidates, family, copies, designKind(copies, (id) => deviceKindOf(this.ownerOf(id))));
  }

  /** One stored record of the home by device and id, from whichever list
   * holds it. The open device's list is the one this panel watches; every
   * other device's is the one read as the menu opened. */
  private recordAt(ownerId: string, id: string): ComplicationRecord | undefined {
    const list = ownerId === this.ownerId ? { records: this.records } : this.otherLists.get(ownerId);
    return list?.records.find((r) => r.id === id && !r.deleted);
  }

  /**
   * Untick one device: take this design off it.
   *
   * The design's copy on that device is deleted; the design goes on living
   * on every other device it is on. Its last copy anywhere is moved to
   * Unassigned instead, since a design taken off everything is not a design
   * deleted. Each copy is read again first, so one that changed under the
   * menu is reported rather than silently clobbered.
   *
   * `quiet` drops the banner that says what happened, the way `addRowTo`'s
   * does. The editor's devices row calls it that way: the chip for that
   * device goes the moment the write lands, in the row the trash was pressed
   * in, so the banner said it again a few inches away and had to be put away
   * by hand.
   *
   * `follow` allows the one device this normally refuses: the one the editor
   * has open. Deleting the record a draft was built on leaves the editor
   * holding a document the server no longer has, so the picker simply will
   * not do it. The way round is to land somewhere first, and `follow` says
   * to: the editor moves to another copy of the same link, or to the
   * Unassigned copy the shelving makes. Every copy of a link is the same
   * document, so nothing on screen changes but the chips.
   */
  private async removeRowFrom(row: PickerRow, place: DevicePlace, quiet = false, follow = false) {
    if (!this.hass.user?.is_admin || this.saving) return;
    const openHere = place.copies.some((c) => this.isOpenCopy(c));
    if (openHere && !follow) return;
    // The copy this lands on is the one the server holds, not the one on
    // screen, so unsaved work goes with the record being deleted.
    if (openHere && this.draft?.dirty && !this.confirmDiscard()) return;
    if (place.last) {
      await this.shelveCopy(row, place.copies[0], quiet, openHere && follow);
      return;
    }
    const ownerId = place.owner.ownerId;
    const label = place.owner.kind === "library" ? UNASSIGNED_LABEL : place.owner.label;
    // Read before the delete, and only when the editor's own copy is the one
    // going: this is how the editor finds where to land afterwards.
    const wasOpen = openHere ? this.selectedId : undefined;
    const link = openHere ? this.draft?.config.linkId : undefined;
    // The menu stays open: one design often goes on or off several devices in
    // one sitting, and the boxes redraw from the lists once the write lands.
    this.saving = true;
    this.saveError = undefined;
    try {
      await this.loadOtherLists();
      let failed = 0;
      for (const copy of place.copies) {
        const record = this.recordAt(ownerId, copy.id);
        if (!record) continue;
        const gone = await deleteRecord(this.hass, ownerId, record.id, record.revision);
        if (!gone.ok) failed += 1;
      }
      // A failure is news wherever it is pressed, so `quiet` only silences
      // the write that did what it was asked.
      // Only a failure says anything: the switch going off is the news that
      // it worked.
      if (failed > 0) this.copyStatus = `${row.name} is still on ${label}: the copy there changed on the server. Open the menu again.`;
      // The draft goes before the lists are read again: it is built on a
      // record that is not there any more, and a render in between would
      // draw the editor over a document the server has lost.
      if (wasOpen !== undefined && failed === 0) {
        this.clearDraft();
        this.selectedId = undefined;
      }
      await this.reloadAfterRowWrite(ownerId);
      if (wasOpen !== undefined && failed === 0) await this.openAnotherCopy(link, ownerId, wasOpen);
    } catch (err) {
      this.saveError = errText(err);
    } finally {
      this.saving = false;
    }
  }

  /**
   * Open another copy of one link, after the device the editor was on lost
   * its copy.
   *
   * Every copy of a link is the same document, so the editor carries on
   * drawing what it was drawing; only the chips change. A design that turns
   * out to have no other copy leaves the editor empty, which is the honest
   * answer: there is nothing left of it to edit here.
   */
  private async openAnotherCopy(link: string | undefined, goneOwnerId: string, goneId: string) {
    const next = this.linkedSiblings(link, goneOwnerId, goneId)[0];
    if (!next) {
      this.selectNone();
      return;
    }
    await this.openCopyAt(next.ownerId, next.record.id);
  }

  /** Point the editor at one copy on one device. Whatever draft it had is
   * already gone, so the device switch asks nothing. */
  private async openCopyAt(ownerId: string, id: string) {
    if (ownerId !== this.ownerId) {
      await this.selectOwner(ownerId);
      if (this.ownerId !== ownerId) return;
    }
    const record = this.recordAt(ownerId, id);
    if (record) this.openRecord(record);
    else this.selectNone();
  }

  /**
   * Move a design's last copy off its device and keep it as unassigned.
   *
   * The shelf's copy is written first and the device's record deleted after
   * it: until the shelf has one, the device's is the only copy there is. The
   * link travels with it, so the design can be ticked back onto devices from
   * the shelf as the same design.
   *
   * `quiet` drops the banner, the way `removeRowFrom`'s does; the move to
   * Unassigned still shows on the editor's devices row as the chip changing.
   *
   * `follow` allows the copy the editor has open, which is otherwise refused
   * for the same reason a delete of it is: the draft would be built on a
   * record that has moved. The editor lands on the shelf's new copy, which
   * is this same document, so only the chip changes.
   */
  private async shelveCopy(row: PickerRow, copy: PlaceCopy | undefined, quiet = false, follow = false) {
    const shelf = this.libraryOwner();
    if (!copy || !shelf || copy.ownerId === shelf.ownerId) return;
    if (this.isOpenCopy(copy) && !follow) return;
    const record = this.recordAt(copy.ownerId, copy.id);
    if (!record?.document) return;
    let cfg: CustomComplicationConfig;
    try {
      cfg = parseConfig(record.document);
    } catch {
      return;
    }
    // The menu follows the card: the record moves to Unassigned under a new
    // id, so the menu is pointed at the card that will draw it there.
    const followed = this.pickerDupFor?.endsWith(`|${row.key}`) === true;
    this.saving = true;
    this.saveError = undefined;
    try {
      await this.loadOtherLists();
      const seats = this.seatsOn(shelf.ownerId);
      if (!seats) {
        this.saveError = unreadableRefusal([UNASSIGNED_LABEL]);
        return;
      }
      const family = supportedFamilies(cfg)[0];
      const slot = slotForDuplicate(family, seats.held, seats.blocked);
      if (slot < 0) {
        this.saveError = `${UNASSIGNED_LABEL} has no free seat for this shape. Delete something in it first.`;
        return;
      }
      const kept = copyForOwner(cfg, { id: newId(), slotIndex: slot, hidden: false, families: [...cfg.supportedFamilies] });
      const out = await saveRecord(this.hass, shelf.ownerId, new Draft(kept, null).encoded(), null);
      if (!out.ok) {
        this.saveError = `${row.name} could not be unassigned, so it is still on ${this.ownerName(copy.ownerId)}: ${out.message ?? out.error ?? "the save failed"}`;
        return;
      }
      const gone = await deleteRecord(this.hass, copy.ownerId, record.id, record.revision);
      // A half-done move is news wherever it is pressed: the design is now in
      // two places and one of them was not asked for.
      if (!gone.ok) this.copyStatus = `${row.name} is unassigned, but the copy on ${this.ownerName(copy.ownerId)} could not be removed. Delete it from its own card.`;
      if (followed) this.pickerDupFor = `${shelf.ownerId}|${rowKeyFor({ ownerId: shelf.ownerId, id: kept.id, ...(kept.linkId !== undefined ? { linkId: kept.linkId } : {}) })}`;
      // The draft goes before the lists are read again: the record it was
      // built on is on its way out, and a render in between would draw the
      // editor over a document that has moved.
      const land = follow && gone.ok;
      if (land) {
        this.clearDraft();
        this.selectedId = undefined;
      }
      await this.reloadAfterRowWrite(copy.ownerId, shelf.ownerId);
      if (land) await this.openCopyAt(shelf.ownerId, kept.id);
    } catch (err) {
      this.saveError = errText(err);
    } finally {
      this.saving = false;
    }
  }

  /**
   * The document a card's buttons act on.
   *
   * The open complication answers from its draft, so a copy is of what is on
   * screen rather than of the last save. Every other card answers from its
   * stored record. Undefined for a document this panel cannot parse, whose
   * card draws an empty well and has nothing to copy.
   */
  private rowConfig(row: PickerRow): CustomComplicationConfig | undefined {
    if (this.selectedCopyOf(row) && this.draft) return this.draft.config;
    const copy = row.open;
    if (copy.item.kind !== "record" || !copy.item.record.document) return undefined;
    try {
      return parseConfig(copy.item.record.document);
    } catch {
      return undefined;
    }
  }

  /**
   * Tick one device: put this design on it.
   *
   * A linked copy is written there: the same document under a new id and
   * seat, carrying the design's link, so a save of any copy reaches it. A
   * design on one device has no link yet, so one is made and written onto
   * its record first, and only then the copy, so the two never exist without
   * the link between them. The copy takes the lowest seat free for that
   * shape there, since a seat number on another device means nothing.
   *
   * The menu stays open, as removeRowFrom's does: the next box is the usual
   * next click.
   *
   * `quiet` drops the banner that says where the copy landed. The editor's
   * own devices row calls it that way: the row it is drawn in grows a chip
   * for that device the moment the write lands, so the banner said the same
   * thing again, a few inches higher up, and had to be dismissed.
   */
  private async addRowTo(row: PickerRow, target: DeviceOwner, quiet = false) {
    if (!this.hass.user?.is_admin || this.saving) return;
    const from = row.open;
    if (from.item.kind !== "record") return;
    const cfg = this.rowConfig(row);
    if (!cfg) return;
    const mine = this.selectedCopyOf(row) !== undefined;
    // The link is written to the record on the server, so an unsaved edit in
    // the editor would either be written along with it or be left behind by
    // it. Neither is what the author asked for.
    // Same for a design sitting on the shelf: its record is the one this
    // write takes away, so an unsaved edit in the editor would go with it.
    const shelf = this.libraryOwner();
    const fromShelf = target.kind !== "library" && shelf !== undefined
      && row.copies.some((c) => c.ownerId === shelf.ownerId && c.item.kind === "record");
    if (mine && (cfg.linkId === undefined || fromShelf) && this.draft && (this.draft.dirty || this.draft.baseRevision === null)) {
      this.saveError = `Save ${row.name} first, then put it on ${target.label}.`;
      return;
    }
    const family = supportedFamilies(cfg)[0];
    const label = target.kind === "library" ? UNASSIGNED_LABEL : target.label;
    // The menu is open on one card of this row; a design gaining its first
    // link changes the row's key, so the menu is pointed at the new key on
    // the same card.
    const at = this.pickerDupFor?.endsWith(`|${row.key}`) ? this.pickerDupFor.split("|")[0] : undefined;
    this.saving = true;
    this.saveError = undefined;
    try {
      // Fresh lists: a seat taken since the menu opened is the whole reason to
      // look before writing.
      await this.loadOtherLists();
      const seats = this.seatsOn(target.ownerId);
      if (!seats) {
        this.saveError = unreadableRefusal([label]);
        return;
      }
      const slot = slotForDuplicate(family, seats.held, seats.blocked);
      if (slot < 0) {
        this.saveError = `${label} has no free seat for this shape (iPhone presets count too). Delete a complication there first.`;
        return;
      }
      let link = cfg.linkId;
      // Revisions this write moved on, by record id. The lists were read
      // before the link went onto the shelf's record, so dropping that record
      // with the revision they hold is refused as a conflict with ourselves.
      const moved = new Map<string, number>();
      if (link === undefined) {
        link = newId();
        const record = this.recordAt(from.ownerId, from.id);
        if (!record) {
          this.saveError = `${row.name} changed on the server. Open the menu again.`;
          return;
        }
        const linked = structuredClone(cfg);
        linked.linkId = link;
        const out = await saveRecord(this.hass, from.ownerId, new Draft(linked, record.revision).encoded(), record.revision);
        if (!out.ok || !out.record) {
          this.saveError = `${row.name} could not be linked, so nothing was written to ${label}: ${out.message ?? out.error ?? "the save failed"}`;
          return;
        }
        moved.set(from.id, out.record.revision);
        // The editor's clean copy of it takes the link too, so its next save
        // does not write the link away again.
        if (mine && this.draft) {
          this.draft.config.linkId = link;
          this.draft = this.draft.commit(out.record.revision);
        }
      }
      const copy = linkedCopy(cfg, link, { id: newId(), slotIndex: slot });
      const out = await saveRecord(this.hass, target.ownerId, new Draft(copy, null).encoded(), null);
      if (!out.ok) {
        this.saveError = out.message ?? out.error ?? "Save failed";
        return;
      }
      // A design on a device is not unassigned any more, so the shelf's copy
      // goes. It goes after the device's is written, never before: until
      // the device has one, the shelf's is the only copy there is.
      const drop = fromShelf && shelf ? await this.dropShelfCopies(row, shelf, moved) : undefined;
      const followed = drop?.landed === true;
      if (at !== undefined) this.pickerDupFor = `${at}|${rowKeyFor({ ownerId: target.ownerId, id: copy.id, linkId: link })}`;
      // The draft goes before the lists are read again: the record it was
      // built on has just been taken off the shelf.
      if (followed) {
        this.clearDraft();
        this.selectedId = undefined;
      }
      await this.reloadAfterRowWrite(from.ownerId, target.ownerId, shelf?.ownerId ?? "");
      if (followed) await this.openCopyAt(target.ownerId, copy.id);
    } catch (err) {
      this.saveError = errText(err);
    } finally {
      this.saving = false;
    }
  }

  /**
   * Take a design off the Unassigned shelf, once it has landed on a device.
   *
   * Unassigned is where a design waits while it is on nothing, not a place
   * it lives beside devices, so the shelf's copy is dropped the moment the
   * design gains its first device. A drop that fails is reported and leaves
   * the shelf's copy where it is: two copies is untidy, none is lost work.
   *
   * Answers whether the copy the editor has open was one of the dropped
   * ones, which is the caller's cue to land the editor on the new copy, and
   * whether anything refused to go, which is news wherever it is pressed and
   * so takes the banner over from the caller's own.
   */
  private async dropShelfCopies(row: PickerRow, shelf: DeviceOwner, moved: ReadonlyMap<string, number>): Promise<{ landed: boolean; failed: number }> {
    let wasOpen = false;
    let failed = 0;
    for (const copy of row.copies) {
      if (copy.ownerId !== shelf.ownerId || copy.item.kind !== "record") continue;
      const record = this.recordAt(shelf.ownerId, copy.id);
      if (!record) continue;
      const gone = await deleteRecord(this.hass, shelf.ownerId, record.id, moved.get(record.id) ?? record.revision);
      if (gone.ok) wasOpen = wasOpen || this.isOpenCopy({ ownerId: copy.ownerId, id: copy.id });
      else failed += 1;
    }
    // Both copies share one card, so "its own card" does not exist, and the
    // editor's Delete takes every copy. The Devices menu's Unassigned box is
    // the one control that drops the shelf's copy alone.
    if (failed > 0) this.copyStatus = `${row.name} is on the device, and still unassigned as well. To tidy it, open Devices on its card and untick ${UNASSIGNED_LABEL}. Do not use Delete: that removes it everywhere.`;
    return { landed: wasOpen, failed };
  }

  /** "Duplicate as" from a card, which is the same dialog the editor's own
   * button opens, over whichever complication the card is about. The picker
   * shuts first: two modal dialogs stacked is two backdrops and one of them
   * unreachable. */
  private duplicateAsFromCard(row: PickerRow) {
    const from = row.open;
    const cfg = this.rowConfig(row);
    if (!cfg || from.item.kind !== "record") return;
    this.closePickerDup();
    this.closePicker();
    this.openDuplicateAs(cfg, from.ownerId);
  }

  private openPickerDup(key: string) {
    this.pickerDupFor = key;
    // How full each place is comes off lists this menu is about to draw rows
    // from, so they are read as it opens.
    void this.loadOtherLists();
    window.addEventListener("pointerdown", this.pickerDupOutside, { capture: true });
  }

  private closePickerDup() {
    this.pickerDupFor = undefined;
    window.removeEventListener("pointerdown", this.pickerDupOutside, { capture: true });
  }

  private pickerDupOutside = (e: PointerEvent) => {
    const open = this.pickerDupFor;
    if (open === undefined) return;
    const inside = e.composedPath().some((n) => n instanceof HTMLElement && n.dataset.dup === open);
    if (!inside) this.closePickerDup();
  };

  /** Escape shuts the open menu before it shuts the dialog, so the key undoes
   * the last thing that was opened rather than the first. A dialog's close
   * request is cancelable, which is the only hook that stops the browser
   * shutting the whole thing on the first press. */
  private pickerCancel = (e: Event) => {
    if (this.pickerDupFor === undefined) return;
    e.preventDefault();
    this.closePickerDup();
  };

  /** Whether a picker row is hidden from its device's complication list. The
   * open one answers from its draft, so an unsaved hide shows at once. */
  private rowHidden(record: ComplicationRecord): boolean {
    if (record.id === this.selectedId && this.draft) return this.draft.config.hidden === true;
    return isHiddenDocument(record.document);
  }

  /**
   * Hide one complication from its device's complication list, or show it
   * again.
   *
   * Hiding is a decision about one device's own list, so it acts on the record
   * the row draws and on no other: one shape of a design can be off a device's
   * list while another shape of it stays on.
   *
   * The open one changes through its draft, so the flag saves with Save and
   * undoes like any other edit: saving it behind the draft's back would move
   * the revision under unsaved work. Any other row has no draft, so it saves at
   * once with the revision the list holds, the way the picker's Delete does. A
   * conflict there is a plain error, since there is nothing to reconcile.
   */
  private async setPickerHidden(record: ComplicationRecord, hide: boolean, ownerId: string) {
    if (ownerId === this.ownerId && record.id === this.selectedId) {
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
      const result = await saveRecord(this.hass, ownerId, doc, record.revision);
      if (!result.ok) {
        this.saveError = result.error === "conflict"
          ? `${String(record.document.name ?? "That complication")} changed on the server. Try again.`
          : result.message ?? result.error ?? "Save failed";
        return;
      }
      // The sync wait is about the device being edited; another device's list
      // is read back instead, so the row settles when that device answers.
      if (ownerId === this.ownerId) {
        this.beginSendWait();
        await this.loadRecords();
      } else {
        await this.loadOtherLists();
      }
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
  private toggleMenu(menu: "grid" | "case" | "tint" | "list" | "place" | "doc" | "snap", next = this.openMenu !== menu) {
    this.openMenu = next ? menu : this.openMenu === menu ? undefined : this.openMenu;
    // The "···" menu opens folded, and forgets an armed Delete when it shuts.
    if (menu === "doc" && this.openMenu !== "doc") { this.docPlaceOpen = false; this.confirmDelete = false; }
    if (this.openMenu !== undefined) window.addEventListener("pointerdown", this.menuOutside, { capture: true });
    else window.removeEventListener("pointerdown", this.menuOutside, { capture: true });
  }

  private menuOutside = (e: PointerEvent) => {
    const open = this.openMenu;
    if (open === undefined) return;
    const inside = e.composedPath().some((n) => n instanceof HTMLElement && n.dataset.menu === open);
    if (!inside) this.toggleMenu(open, false);
  };

  /** Both buttons named Browse all open the picker on every device and every
   * shape. Opening it on a filter left from last time showed a part of the
   * list under a button that promised all of it. */
  private browseAll() {
    this.pickPickerTab(ALL_DEVICES);
    this.pickerFilter = "all";
    this.openPicker();
  }

  private togglePicker(next = !this.pickerOpen) {
    if (next) this.openPicker();
    else this.closePicker();
  }

  /** Open the picker as a modal dialog, the way the New dialog opens: a real
   * `showModal`, so the backdrop, the focus trap and Escape are the browser's
   * rather than three listeners of our own. */
  private openPicker() {
    this.pickerOpen = true;
    this.pickerQuery = "";
    // The other devices' lists are read for the links and are not on this
    // one's change subscription, so a complication added on the phone since
    // the panel loaded would be missing from the grid this dialog is about.
    void this.loadOtherLists();
    void this.updateComplete.then(() => {
      const dialog = this.renderRoot.querySelector<HTMLDialogElement>("dialog.pk-dialog");
      if (!dialog) return;
      if (!dialog.open) dialog.showModal();
      // Focus lands on the tab that is on, not in the search field: a
      // dialog that opens typing-ready reads as a search box, and this one
      // is a grid to look at. Typing is one Tab away.
      dialog.querySelector<HTMLButtonElement>("[role=tab][aria-selected=true]")?.focus();
    });
  }

  private closePicker() {
    const dialog = this.renderRoot.querySelector<HTMLDialogElement>("dialog.pk-dialog");
    if (dialog?.open) dialog.close();
    else this.pickerClosed();
  }

  /** Everything the picker forgets on the way out, however it was shut: the
   * close button, Escape, the backdrop, or opening something from it. */
  private pickerClosed() {
    this.pickerOpen = false;
    this.pickerNote = undefined;
    this.pickerConfirmDelete = undefined;
    this.closePickerDup();
  }

  /** A press on the backdrop shuts the dialog. A modal dialog's backdrop is
   * the dialog element itself as far as the event is concerned, so a click
   * that lands on nothing inside it is a click on the way out. */
  private pickerBackdrop = (e: MouseEvent) => {
    if (e.target === e.currentTarget) this.closePicker();
  };

  /** Import, from the picker's own foot. The picker shuts first: two modal
   * dialogs stacked is two backdrops and one of them unreachable. */
  private importFromPicker() {
    this.closePicker();
    this.openImportDialog();
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

  /**
   * What is still missing before Create can do anything, in words, or undefined
   * when nothing is.
   *
   * Every ticked device, not only the one being edited: a complication that is
   * about to land on two watches has to be a name neither of them already
   * uses, and the one it clashes with is named so the author knows which list
   * to look in. The other devices' lists are the ones `loadOtherLists` fetched
   * as the dialog opened, so a device that would not answer simply is not
   * checked; the write that follows refuses on its own.
   */
  private newNameProblem(): string | undefined {
    const name = this.newName.trim();
    if (name === "") return undefined; // Not an error yet, just unanswered.
    const lower = name.toLowerCase();
    // Every place this complication is about to land, which with nothing
    // ticked is the library: a name the shelf already uses clashes exactly as
    // one a watch uses does.
    const targets = newTargets([...this.newOwners]);
    const clash = (ownerId: string) => ownerId === LIBRARY_OWNER_ID
      ? `A complication in ${UNASSIGNED_LABEL} already has that name.`
      : undefined;
    if (this.ownerId !== undefined && targets.includes(this.ownerId) && this.takenNames().has(lower)) {
      return clash(this.ownerId) ?? `A complication on ${this.placePhrase} already has that name.`;
    }
    for (const owner of this.deviceOwnersFor(targets)) {
      if (owner.ownerId === this.ownerId) continue;
      const taken = (this.otherLists.get(owner.ownerId)?.records ?? [])
        .filter((r) => !r.deleted)
        .map((r) => String(r.document?.name ?? "").trim().toLowerCase());
      if (taken.includes(lower)) return clash(owner.ownerId) ?? `A complication on ${owner.label} already has that name.`;
    }
    return undefined;
  }

  /**
   * One device as the dialogs read it.
   *
   * The shapes are `familiesFor`'s, so a dialog can never offer a device a
   * shape its app does not draw, and the name is the picker's, so the same
   * device is called the same thing in both lists.
   *
   * The home's Library comes through here too, and answers every question the
   * same way a device does: every shape (`familiesFor`), every promise, and
   * the control, since nothing about a design on the shelf is waiting on an
   * App Store release. It is never offered as a tick; it is where a design
   * goes when no device is ticked.
   */
  private deviceOwnerOf(owner: OwnerSummary): DeviceOwner {
    return {
      ownerId: owner.owner_watch_id,
      label: ownerLabel(owner),
      kind: deviceKindOf(owner),
      families: familiesFor(owner),
      comingSoon: comingSoonFamilies(owner),
      controls: ownerSupportsControls(owner),
      appVersion: owner.app_version,
    };
  }

  /**
   * The devices the New dialog offers, in the picker's order.
   *
   * Only a device whose app can take these documents at all: an app below its
   * own gate has no widget to draw them, so offering it a copy would write a
   * record nothing ever reads. An orphan is out for the same reason from the
   * other end, there being no device left under the id. The device being
   * edited is always in the list, orphan or not, because it is the one the
   * complication is being made on.
   *
   * The Library is never one of them. Every list built from this is a list of
   * boxes to tick, and the library is not a tick: it is where a design sits
   * when none of these boxes is ticked.
   */
  private deviceOwners(): DeviceOwner[] {
    return ownersByKind(this.owners)
      .filter((o) => !isLibraryOwner(o))
      .filter((o) => o.owner_watch_id === this.ownerId || (!o.is_orphan && deviceSupportsShapes(o)))
      .map((o) => this.deviceOwnerOf(o));
  }

  /** These owner ids as owners, in the picker's order, the Library included.
   * For the places that have already worked out where a design is going and
   * need the shapes and the label of each place. */
  private deviceOwnersFor(ownerIds: readonly string[]): DeviceOwner[] {
    return ownersByKind(this.owners)
      .filter((o) => ownerIds.includes(o.owner_watch_id))
      .map((o) => this.deviceOwnerOf(o));
  }

  /**
   * Step 4's list: the home's people, each with the devices of theirs that can
   * take this complication.
   *
   * People rather than a flat list of devices, because a list reading "Apple
   * Watch, Apple Watch" is no help at all when the question is which boxes to
   * tick. A device that cannot draw the shape that was picked is left out, so
   * the list never offers a tick that would write a record nothing draws.
   */
  private newPeople(owners: readonly DeviceOwner[]): { person: Person; devices: OwnerSummary[] }[] {
    const offered = new Set(owners.map((o) => o.ownerId));
    return peopleOf(this.owners)
      .map((person) => ({ person, devices: person.owners.filter((o) => offered.has(o.owner_watch_id)) }))
      .filter((row) => row.devices.length > 0);
  }

  /** The devices step 4 offers: the ones of the picked kind that draw the
   * picked shape. A control is offered to every device that has one. */
  private newOffered(): DeviceOwner[] {
    const kind = this.newKind;
    if (kind === undefined) return [];
    const mine = kindOwners(this.deviceOwners(), kind);
    if (kind === "control" || this.newFamily === undefined) return mine;
    return mine.filter((o) => o.families.includes(this.newFamily!));
  }

  /** How many seats one device has taken, for the line on a full row. */
  private slotsTakenOn(ownerId: string): number {
    return new Set(this.slotHoldersOn(ownerId).map((h) => h.slotIndex).filter((n) => n >= 0)).size;
  }

  /**
   * The New complication dialog: a name, a device kind, one shape, and whose
   * devices get it.
   *
   * A complication is one shape on one kind of device, so the dialog asks for
   * exactly that and nothing more. It used to offer every shape in the home as
   * a set of ticks over a list of devices, which meant the answer to "what am
   * I making" was a grid rather than a sentence, and a design that reached a
   * watch and a phone at once had to be kept in step by a layer of linked
   * copies nobody could see. One shape is the whole of it now: a second shape
   * is a second complication, and "Duplicate as" makes it from a finished one.
   *
   * Four numbered steps, each a tinted container with a badge, and each one
   * waiting visibly until the step before it has an answer. Nothing is picked
   * when it opens except the author's own devices in step 4: a tinted default
   * reads as a recommendation, and the shape is the one thing about a
   * complication that cannot be changed later without moving every layer.
   */
  private renderNewDialog() {
    const nameProblem = this.newNameProblem();
    const named = this.newName.trim() !== "";
    const owners = this.deviceOwners();
    const kinds = kindChoices(owners);
    const kind = this.newKind;
    const groups = kind === undefined ? [] : shapeGroups(kind, owners);
    const offered = this.newOffered();
    const people = this.newPeople(offered);
    const ticked = offered.filter((o) => this.newOwners.has(o.ownerId)).length;
    const state = { named, nameProblem, kind, family: this.newFamily, devices: ticked };
    const summary = newSummary(state);
    const ready = newReady(state);
    // A step is an answer to a question the step before it has not been asked
    // yet, so it waits rather than refuses: dimmed, unclickable, and saying so
    // to a screen reader.
    const wait = (ok: boolean) => ok ? "" : "waiting";
    const shapeStep = kind !== undefined && kind !== "control";
    return html`<dialog class="new-dialog" @keydown=${this.newKeys} @close=${() => { this.newOpen = false; }}>
      <div class="new-head">
        <h2>New complication</h2>
        <span class="new-head-note">Name it, pick a device, pick one shape.</span>
        <span class="spacer"></span>
        <button class="icon" title="Cancel" aria-label="Cancel" @click=${() => this.closeNewDialog()}>${uiIcon("close")}</button>
      </div>
      <div class="new-body">
        <section class="new-step step-name">
          ${this.renderStepHead(1, "Name it", "This is the name the watch picker and the iPhone widget lists show.")}
          <input type="text" class="new-name" .value=${this.newName} placeholder="Kitchen at a glance" maxlength="60"
            autofocus aria-label="Complication name" aria-invalid=${nameProblem ? "true" : "false"}
            @input=${(e: Event) => { this.newName = (e.target as HTMLInputElement).value; }} />
          ${nameProblem ? html`<div class="hint err">${nameProblem}</div>` : nothing}
        </section>
        <section class="new-step step-kind ${wait(named)}" aria-disabled=${named ? "false" : "true"}>
          ${this.renderStepHead(2, "Pick the device", named
            ? "A complication is one shape on one kind of device."
            : "Waits for a name.")}
          <div class="kind-cards" role="radiogroup" aria-label="Device">
            ${kinds.map((k) => this.renderKindCard(k, this.newKind === k, (picked) => this.pickKind(picked)))}
          </div>
        </section>
        ${!shapeStep ? nothing : html`<section class="new-step step-shapes" aria-disabled="false">
          ${this.renderStepHead(3, "Pick one shape", "Blue shows where it sits. One shape per complication.")}
          <div class="shape-rows" role="radiogroup" aria-label="Shape">
            ${groups.map((group) => this.renderShapeGroup(kind!, group, this.newFamily,
              (family) => { this.newFamily = family; this.keepTickedOwners(); }))}
          </div>
        </section>`}
        ${people.length === 0 ? nothing : html`<section class="new-step step-people ${wait(ready)}"
          aria-disabled=${ready ? "false" : "true"}>
          ${this.renderStepHead(shapeStep ? 4 : 3, "Choose whose devices get it",
            "Each tick is a complication of its own on that device, to edit there. Unassigned keeps it off every device until you pick one.")}
          ${this.renderUnassignedTick()}
          <div class="people-grid" role="group" aria-label="Devices">${people.map((row) =>
            this.renderPersonBox(row, this.newOwners, this.newFamily, (id) => this.toggleNewOwner(id)))}</div>
        </section>`}
      </div>
      <div class="new-foot">
        <span class="new-count">${summary}</span>
        <button class="small" @click=${() => this.closeNewDialog()}>Cancel</button>
        <button class="primary" ?disabled=${!ready} title=${ready ? "Make it" : summary}
          @click=${() => void this.createNew()}>Create</button>
      </div>
    </dialog>`;
  }

  /** One step's badge, name and hint, the same three parts in every step. */
  private renderStepHead(step: number, title: string, hint: string) {
    return html`<div class="new-step-head">
      <span class="new-step-num" aria-hidden="true">${step}</span>
      <span class="new-step-title">${title}</span>
      <span class="new-step-hint">${hint}</span>
    </div>`;
  }

  /** One device choice in step 2, drawn as the outline of the thing it is.
   * The New dialog and "Duplicate as" ask the same question, so they draw the
   * same card and each passes its own answer and its own handler. */
  private renderKindCard(kind: NewKind, on: boolean, pick: (kind: NewKind) => void) {
    const device: DeviceKind = kind === "iphone" ? "iphone" : "watch";
    return html`<button type="button" class="kind-card ${on ? "on" : ""}" role="radio"
      aria-checked=${on ? "true" : "false"} title=${kindNote(kind)}
      @click=${() => pick(kind)}>
      <span class="shape-arts">${kind === "control"
        ? controlDeviceArt(device, on)
        : deviceShapeArt("rectangular", device, on)}</span>
      <span class="shape-card-name">${kindTitle(kind)}</span>
      <span class="shape-card-note">${kindNote(kind)}</span>
    </button>`;
  }

  /**
   * One heading of the shape grid, with a radio per shape.
   *
   * Each shape is drawn as the outline of the device that was picked in step
   * 2, so the grid answers "where does this sit" without a word: a watch face
   * for a watch, a phone screen for an iPhone.
   */
  private renderShapeGroup(
    kind: NewKind,
    group: ShapeGroup,
    picked: FamilyKind | undefined,
    pick: (family: FamilyKind) => void,
  ) {
    const device: DeviceKind = kind === "iphone" ? "iphone" : "watch";
    const where = kind === "iphone" ? "an iPhone" : "a watch";
    return html`<div class="shape-row">
      <div class="shape-row-head">
        <span class="shape-row-kinds" aria-hidden="true">${uiIcon(device === "iphone" ? "phone" : "watch")}</span>
        <span class="shape-row-title">${group.title}</span>
      </div>
      <div class="shape-cards">
        ${group.families.map((family) => {
          const on = picked === family;
          return html`<button type="button" class="shape-card ${on ? "on" : ""}" role="radio"
            aria-checked=${on ? "true" : "false"} title=${`${familyTitle(family)} on ${where}`}
            @click=${() => pick(family)}>
            <span class="shape-arts">${deviceShapeArt(family, device, on)}</span>
            <span class="shape-card-name">${familyTitle(family)}</span>
            ${on ? pickTick() : html`<span class="pick-tick off" aria-hidden="true"></span>`}
          </button>`;
        })}
        ${group.comingSoon.map((family) => html`<button type="button" class="shape-card soon" disabled
          aria-disabled="true" title="Coming soon">
          <span class="shape-arts">${deviceShapeArt(family, device, false)}</span>
          <span class="shape-card-name">${familyTitle(family)}</span>
          <span class="shape-card-note">Coming soon${familyNote(family) ? html`<br />${familyNote(family)}` : nothing}</span>
        </button>`)}
      </div>
    </div>`;
  }

  /**
   * The Unassigned row above the people, and the step's resting answer.
   *
   * Ticking no device is a real choice: the complication is made and waits on
   * the home's shelf until it is put somewhere. Before this row that choice was
   * drawn as the absence of every other choice, which reads as a step nobody
   * answered, and it is why the dialog used to tick the author's own devices
   * for them. Drawn as a tick rather than a note so the step always has exactly
   * one thing lit when it opens.
   *
   * It is on when nothing else is, and clicking it clears every device tick.
   * Clicking it while it is already on does nothing, because there is nothing
   * below it to fall back to.
   */
  private renderUnassignedTick() {
    const on = this.newOwners.size === 0;
    return html`<div class="unassigned-row" role="group" aria-label="Unassigned">
      <button type="button" role="checkbox" class="dev-tick ${on ? "on" : ""}"
        aria-checked=${on ? "true" : "false"}
        title="Make it and leave it on no device. Put it on one any time."
        @click=${() => { this.newOwners = new Set(); }}>
        ${on ? pickTick() : html`<span class="pick-tick off" aria-hidden="true"></span>`}
        <span class="dev-card-ico">${uiIcon("layers")}</span>
        <span class="dev-card-name">${UNASSIGNED_LABEL}</span>
        <span class="dev-row-note">on no device</span>
      </button>
    </div>`;
  }

  /**
   * One person's box in step 4: their name, then a checkbox per device.
   *
   * A device with no seat left is drawn with the seats it has taken rather
   * than simply greyed, because "why can I not tick my watch" is a question
   * worth answering where it is asked. It stays clickable while it is ticked,
   * so a device that filled up after the dialog opened can still be unticked.
   */
  private renderPersonBox(
    row: { person: Person; devices: readonly OwnerSummary[] },
    ticked: ReadonlySet<string>,
    family: FamilyKind | undefined,
    toggle: (ownerId: string) => void,
  ) {
    return html`<div class="person-box">
      <span class="person-name">${row.person.label}</span>
      ${row.devices.map((owner) => {
        const id = owner.owner_watch_id;
        const on = ticked.has(id);
        const full = this.freeSlotOn(id, family) < 0;
        const label = deviceShortName(owner, row.person);
        return html`<button type="button" role="checkbox" class="dev-tick ${on ? "on" : ""}"
          aria-checked=${on ? "true" : "false"} ?disabled=${full && !on}
          title=${full ? `${label} has no free slot for this shape (iPhone presets count too). Delete a complication on it first.` : `Put one on ${label}`}
          @click=${() => toggle(id)}>
          ${on ? pickTick() : html`<span class="pick-tick off" aria-hidden="true"></span>`}
          <span class="dev-card-ico">${uiIcon(deviceKindOf(owner) === "iphone" ? "phone" : "watch")}</span>
          <span class="dev-card-name">${label}</span>
          ${full ? html`<span class="dev-row-note">full, ${this.slotsTakenOn(id)} of ${MAX_SLOTS}</span>` : nothing}
        </button>`;
      })}
    </div>`;
  }

  /**
   * Step 2, answered.
   *
   * The shape goes with it unless the new kind still offers it, because a
   * corner picked for a watch means nothing on an iPhone.
   *
   * No device is ticked. This used to tick the author's own devices of the new
   * kind, on the theory that "mine" is the answer nearly every time. It reads
   * as the dialog answering its own question: a tick here writes a record on a
   * real device, and picking a kind is not consent to that. Unassigned is the
   * resting answer, drawn as its own ticked row so the step never looks
   * unanswered, and a device is one click away.
   */
  private pickKind(kind: NewKind) {
    this.newKind = kind;
    if (kind === "control" || !shapeOffered(kind, this.deviceOwners(), this.newFamily)) {
      this.newFamily = undefined;
    }
    this.newOwners = new Set();
  }

  /** Drop a tick on a device the new shape leaves behind, so Create never
   * writes a record the device cannot draw. */
  private keepTickedOwners() {
    const offered = new Set(this.newOffered().map((o) => o.ownerId));
    this.newOwners = new Set([...this.newOwners].filter((id) => offered.has(id)));
  }

  /** Tick or untick one device. Each tick is a complication of its own. */
  private toggleNewOwner(ownerId: string) {
    const next = new Set(this.newOwners);
    if (!next.delete(ownerId)) next.add(ownerId);
    this.newOwners = next;
  }

  private openNewDialog() {
    if (this.freeSlot() < 0) return;
    this.newOpen = true;
    this.newName = "";
    this.newKind = undefined;
    this.newFamily = undefined;
    this.newOwners = new Set();
    // The other devices' names, for the duplicate check, and their seats, for
    // the rows that say a device is full. Both are read while the dialog is
    // drawn, so a list that lands late simply redraws it.
    void this.loadOtherLists();
    void this.updateComplete.then(() => {
      const dialog = this.renderRoot.querySelector<HTMLDialogElement>("dialog.new-dialog:not(.dup-dialog)");
      if (!dialog) return;
      if (!dialog.open) dialog.showModal();
      dialog.querySelector<HTMLInputElement>("input[type=text]")?.focus();
    });
  }

  private closeNewDialog() {
    const dialog = this.renderRoot.querySelector<HTMLDialogElement>("dialog.new-dialog:not(.dup-dialog)");
    if (dialog?.open) dialog.close();
    else this.newOpen = false;
  }

  /** Enter creates, once every question has been answered. Escape is the
   * dialog's own. */
  private newKeys = (e: KeyboardEvent) => {
    if (e.key !== "Enter") return;
    if (!newReady({
      named: this.newName.trim() !== "",
      nameProblem: this.newNameProblem(),
      kind: this.newKind,
      family: this.newFamily,
      devices: this.newOwners.size,
    })) return;
    e.preventDefault();
    void this.createNew();
  };

  // ── duplicate as ──────────────────────────────────────────────────────
  //
  // A complication is one shape on one kind of device, so a design that should
  // also be a circle, or should also be on somebody else's watch, is copied
  // rather than extended. The dialog asks the New dialog's own questions about
  // the copy and draws them with the New dialog's own cards; the copy itself is
  // `duplicateAs` in copies.ts, which is where the layers are refitted for the
  // canvas they land on.

  /**
   * Open "Duplicate as" over one complication.
   *
   * The document is taken as it stands, which for the open one means the draft
   * rather than the saved record: copying what is on screen is what the button
   * appears to do. The kind and the shape it is today are the answers the
   * dialog starts with, so the shape only has to be touched when it is the
   * thing being changed. Where the copy goes starts at Unassigned, never at a
   * device: see `defaultDupTicks`.
   */
  private openDuplicateAs(cfg: CustomComplicationConfig, ownerId: string) {
    if (!this.hass.user?.is_admin) return;
    this.dupFrom = { cfg: structuredClone(cfg), ownerId };
    const family = supportedFamilies(cfg)[0];
    const owner = this.ownerOf(ownerId);
    this.dupKind = family === undefined
      ? "control"
      : isLibraryOwner(owner) ? (isHomeFamily(family) ? "iphone" : "watch") : deviceKindOf(owner) === "iphone" ? "iphone" : "watch";
    this.dupFamily = family;
    this.dupOwners = this.defaultDupTicks();
    this.dupOpen = true;
    // The other devices' seats, for the rows that say a device is full.
    void this.loadOtherLists();
    void this.updateComplete.then(() => {
      const dialog = this.renderRoot.querySelector<HTMLDialogElement>("dialog.dup-dialog");
      if (dialog && !dialog.open) dialog.showModal();
    });
  }

  private closeDuplicateDialog() {
    const dialog = this.renderRoot.querySelector<HTMLDialogElement>("dialog.dup-dialog");
    if (dialog?.open) dialog.close();
    else this.dupOpen = false;
  }

  /** The shape the copy is being made as, which a Control Center copy has
   * none of. */
  private get dupTargetFamily(): FamilyKind | undefined {
    return this.dupKind === "control" ? undefined : this.dupFamily;
  }

  /** Whether the dialog has an answer for every question it asked. */
  private dupReady(): boolean {
    if (!this.dupFrom || this.dupKind === undefined) return false;
    if (this.dupKind !== "control" && this.dupFamily === undefined) return false;
    return this.dupTicked().length > 0;
  }

  /**
   * The places this copy can go: the devices of the picked kind that draw the
   * picked shape, and the home's Library.
   *
   * The device the design is already on is offered only when the copy is of
   * another shape. The same shape on the same device would be two of one name
   * in one picker, and the inspector's own Duplicate is where that is asked
   * for. The Library is always here: a design on the shelf is off every device
   * without being deleted.
   */
  private dupOffered(): DeviceOwner[] {
    const from = this.dupFrom;
    const kind = this.dupKind;
    if (!from || kind === undefined) return [];
    const family = this.dupTargetFamily;
    if (kind !== "control" && family === undefined) return [];
    const source = supportedFamilies(from.cfg)[0];
    const library = this.libraryOwner();
    const devices = kindOwners(this.deviceOwners(), kind)
      .filter((o) => family === undefined || o.families.includes(family))
      .filter((o) => o.ownerId !== from.ownerId || family !== source);
    return library && library.ownerId !== from.ownerId ? [...devices, library] : devices;
  }

  /** The offered places that are ticked, in the order they are drawn. */
  private dupTicked(): DeviceOwner[] {
    return this.dupOffered().filter((o) => this.dupOwners.has(o.ownerId));
  }

  /** The home's shelf as the dialogs read a device. Absent on a home whose
   * integration is older than the library. */
  private libraryOwner(): DeviceOwner | undefined {
    const owner = this.owners.find((o) => isLibraryOwner(o));
    return owner ? this.deviceOwnerOf(owner) : undefined;
  }

  /**
   * The "Duplicate as" dialog: a device kind, one shape, and where the copies
   * go.
   *
   * The New dialog's own steps, minus the name: a copy keeps the name it was
   * made from, so the pickers read the same word on every shape of one design
   * and the card's shape glyph is what tells them apart.
   */
  private renderDuplicateDialog() {
    const from = this.dupFrom;
    if (!from) return nothing;
    const owners = this.deviceOwners();
    const kinds = kindChoices(owners);
    const kind = this.dupKind;
    const family = this.dupTargetFamily;
    const groups = kind === undefined ? [] : shapeGroups(kind, owners);
    const offered = this.dupOffered();
    const people = this.newPeople(offered);
    const library = offered.find((o) => o.kind === "library");
    const name = from.cfg.name.trim() || "Untitled";
    const ready = this.dupReady();
    const shapeStep = kind !== undefined && kind !== "control";
    const what = kind === "control"
      ? "A Control Center control"
      : family === undefined ? "" : `${familyTitle(family)} on ${kind === "watch" ? "a watch" : "an iPhone"}`;
    const ticked = this.dupTicked();
    const summary = what === ""
      ? "Pick one shape."
      : ticked.length === 0
        ? `${what}. Tick where it goes.`
        : `${what}, on ${joinNames(ticked.map((o) => o.label))}`;
    return html`<dialog class="new-dialog dup-dialog" @close=${() => { this.dupOpen = false; }}>
      <div class="new-head">
        <h2>Duplicate “${name}”</h2>
        <span class="new-head-note">The copy is a complication of its own. Editing it never changes this one.</span>
        <span class="spacer"></span>
        <button class="icon" title="Cancel" aria-label="Cancel" @click=${() => this.closeDuplicateDialog()}>${uiIcon("close")}</button>
      </div>
      <div class="new-body">
        <section class="new-step step-kind">
          ${this.renderStepHead(1, "Pick the device", "A complication is one shape on one kind of device.")}
          <div class="kind-cards" role="radiogroup" aria-label="Device">
            ${kinds.map((k) => this.renderKindCard(k, kind === k, (picked) => this.pickDupKind(picked)))}
          </div>
        </section>
        ${!shapeStep ? nothing : html`<section class="new-step step-shapes">
          ${this.renderStepHead(2, "Pick one shape", "The layers come over and are refitted for the shape you pick.")}
          <div class="shape-rows" role="radiogroup" aria-label="Shape">
            ${groups.map((group) => this.renderShapeGroup(kind!, group, this.dupFamily,
              (picked) => this.pickDupFamily(picked)))}
          </div>
        </section>`}
        <section class="new-step step-people">
          ${this.renderStepHead(shapeStep ? 3 : 2, "Choose where the copy goes",
            "Each tick is a complication of its own, written now.")}
          ${people.length === 0 && library === undefined
            ? html`<div class="hint">Nothing in this home can take this shape yet.</div>`
            : html`${library === undefined ? nothing : this.renderLibraryBox(library, family)}
              <div class="people-grid" role="group" aria-label="Devices">
                ${people.map((row) => this.renderPersonBox(row, this.dupOwners, family, (id) => this.toggleDupOwner(id)))}
              </div>`}
        </section>
      </div>
      <div class="new-foot">
        <span class="new-count">${summary}</span>
        <button class="small" @click=${() => this.closeDuplicateDialog()}>Cancel</button>
        <button class="primary" ?disabled=${!ready || this.saving} title=${ready ? "Make the copy" : summary}
          @click=${() => void this.duplicateNow()}>Duplicate</button>
      </div>
    </dialog>`;
  }

  /** Unassigned's own tick, above the people. It is not somebody's device, so
   * it stands in a row of its own rather than under a name, and it is where
   * the step rests until a device is picked (`defaultDupTicks`). The New
   * dialog draws the same row for the same answer. */
  private renderLibraryBox(library: DeviceOwner, family: FamilyKind | undefined) {
    const on = this.dupOwners.has(library.ownerId);
    const full = this.freeSlotOn(library.ownerId, family) < 0;
    return html`<div class="unassigned-row" role="group" aria-label="Unassigned">
      <button type="button" role="checkbox" class="dev-tick ${on ? "on" : ""}"
        aria-checked=${on ? "true" : "false"} ?disabled=${full && !on}
        title=${full ? `${UNASSIGNED_LABEL} is full. Delete something in it first.` : "Keep a copy unassigned, on no device"}
        @click=${() => this.toggleDupOwner(library.ownerId)}>
        ${on ? pickTick() : html`<span class="pick-tick off" aria-hidden="true"></span>`}
        <span class="dev-card-ico">${uiIcon("layers")}</span>
        <span class="dev-card-name">${UNASSIGNED_LABEL}</span>
        <span class="dev-row-note">on no device</span>
      </button>
    </div>`;
  }

  /**
   * Where a copy goes before anybody says: Unassigned, and nowhere else.
   *
   * This dialog needs at least one tick to enable Create, and unlike the New
   * dialog it says "unassigned" by ticking the Library, which is a real owner
   * that holds a real record. So the resting answer is that tick rather than
   * an empty set, and the step still opens with exactly one thing lit.
   *
   * Empty on a home whose integration predates the Library, on a copy made
   * from the Library itself, and on a shelf with no free seat, since a tick
   * Create could not honour is worse than no tick at all. Create stays
   * disabled there until a device is picked, which is the honest state.
   */
  private defaultDupTicks(): Set<string> {
    const library = this.dupOffered().find((o) => isLibraryOwner(this.ownerOf(o.ownerId)));
    if (!library || this.freeSlotOn(library.ownerId, this.dupTargetFamily) < 0) return new Set();
    return new Set([library.ownerId]);
  }

  /** The device kind, answered. The shape goes with it unless the new kind
   * still offers it, and the ticks go back to Unassigned. */
  private pickDupKind(kind: NewKind) {
    this.dupKind = kind;
    if (kind === "control" || !shapeOffered(kind, this.deviceOwners(), this.dupFamily)) {
      this.dupFamily = undefined;
    }
    this.dupOwners = this.defaultDupTicks();
  }

  /**
   * The shape, answered.
   *
   * This used to tick the device the design is already on whenever the copy
   * was of another shape, on the theory that it is the common case. It is the
   * same objection the New dialog's own auto-tick earned: a tick writes a
   * record on a real device, and picking a shape is not consent to that. The
   * answer goes back to Unassigned instead, and the device is one click away.
   */
  private pickDupFamily(family: FamilyKind) {
    this.dupFamily = family;
    this.dupOwners = this.defaultDupTicks();
  }

  private toggleDupOwner(ownerId: string) {
    const next = new Set(this.dupOwners);
    if (!next.delete(ownerId)) next.add(ownerId);
    this.dupOwners = next;
  }

  /**
   * Write one copy per ticked place, now.
   *
   * There is no Save to hold these for: each is its own record with its own id
   * and its own seat from the moment it lands. A place with no seat left for
   * this shape is named and the rest still go, and the first copy that landed
   * is offered as something to open, since a copy of another shape is usually
   * a copy about to be laid out by hand.
   */
  private async duplicateNow() {
    const from = this.dupFrom;
    if (!from || this.saving || !this.dupReady()) return;
    const family = this.dupTargetFamily;
    const targets = this.dupTicked();
    this.closeDuplicateDialog();
    const made: string[] = [];
    const failed: string[] = [];
    let first: { ownerId: string; recordId: string } | undefined;
    this.saving = true;
    this.saveError = undefined;
    try {
      // Fresh lists: a seat taken since the dialog opened is the whole reason
      // to look before writing.
      await this.loadOtherLists();
      // A device whose list did not come back shows no seats at all, so every
      // seat would look free and the copy would land on whatever holds seat 0.
      const unread = this.unreadableAmong(targets);
      if (unread.length > 0) {
        this.saveError = unreadableRefusal(unread);
        return;
      }
      for (const target of targets) {
        const seats = this.seatsOn(target.ownerId)!;
        // On the device the design is already on, the copy takes the original's
        // own seat when that shape is free there, so a face that later places
        // both shows one name in one position group.
        const slot = slotForDuplicate(
          family,
          seats.held,
          seats.blocked,
          target.ownerId === from.ownerId ? from.cfg.slotIndex : undefined,
        );
        if (slot < 0) {
          failed.push(`${target.label} has no free seat for this shape (iPhone presets count too)`);
          continue;
        }
        const copy = duplicateAs(from.cfg, family, { id: newId(), slotIndex: slot });
        try {
          const out = await saveRecord(this.hass, target.ownerId, new Draft(copy, null).encoded(), null);
          if (out.ok) {
            made.push(target.label);
            first ??= { ownerId: target.ownerId, recordId: copy.id };
          } else {
            failed.push(`${target.label}: ${out.message ?? out.error ?? "the save failed"}`);
          }
        } catch (err) {
          failed.push(`${target.label}: ${errText(err)}`);
        }
      }
    } finally {
      this.saving = false;
    }
    await this.reloadAfterRowWrite(...targets.map((t) => t.ownerId));
    // Only a failure speaks: the new copies show in the list and on the card.
    this.copyStatus = failed.length > 0 ? `${joinNames(failed)}.` : undefined;
    this.copyOpen = failed.length > 0 ? first : undefined;
  }

  /** Open the copy a write just made, wherever it landed. */
  private async openMadeCopy() {
    const made = this.copyOpen;
    if (!made) return;
    this.copyOpen = undefined;
    this.copyStatus = undefined;
    if (made.ownerId !== this.ownerId) {
      await this.selectOwner(made.ownerId);
      // A dirty draft the owner switch asked about and was told to keep leaves
      // the editor where it was, so there is nothing to open.
      if (this.ownerId !== made.ownerId) return;
    }
    const record = this.records.find((r) => r.id === made.recordId);
    if (record) this.selectRecord(record);
  }

  /** Read back whichever lists a write outside the open document touched. The
   * edited device's own list is the one the panel watches, so it also waits on
   * the sync; another device's is simply re-read. */
  private async reloadAfterRowWrite(...ownerIds: readonly string[]) {
    if (ownerIds.includes(this.ownerId ?? "")) {
      this.beginSendWait();
      await this.loadRecords();
    }
    await this.loadOtherLists();
  }

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
    const shared = this.sharePicked();
    // A complication is one shape, so there is nothing to pick and Share is
    // ready as it opens. A document with no shape at all is its control, which
    // shares as text and which the gallery turns away, since the gallery is
    // browsed by shape.
    const ready = true;
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
        shared.length === 0
          ? "A Control Center control, and no shape"
          : `${familyWords(shared)} · ${layerCountWords(cfg)}`,
        () => this.closeShareDialog())}
      <div class="xfer-body">
        ${this.dialogPreview(layouts, family, spot,
          focused && spot.length > 0 ? html`Where <b>${focused.name}</b> is` : family ? familyTitle(family) : "",
          rows.some((row) => row.ids.length > 0) ? "Point at a name to see where it is" : "")}
        ${who}${names}${send}
      </div>
    </dialog>`;
  }

  /** One numbered step of the Share dialog, in its own color. A locked step
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

  /** What Share and the gallery send, which is the open document: one shape,
   * so there is nothing to narrow it to. */
  private shareConfig(): CustomComplicationConfig | undefined {
    return this.draft?.config;
  }

  /** The shapes Share will send, which is whatever the document has. */
  private sharePicked(): FamilyKind[] {
    const cfg = this.draft?.config;
    return cfg ? supportedFamilies(cfg) : [];
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
    const device = this.galleryUploadDevice();
    return {
      title: this.galleryTitle,
      description: this.galleryDescription,
      authorName: this.galleryNickname,
      tags: [...this.galleryTags],
      panelVersion: this.panel?.config?.version ?? "",
      ...(device === undefined ? {} : { device }),
    };
  }

  /** The device the upload is filed under: the kind of the owner the document
   * is stored on. A design on the shelf belongs to no device, so there the
   * shape decides, and a shape both devices draw leaves the field off. */
  private galleryUploadDevice() {
    const cfg = this.shareConfig();
    return galleryDevice(deviceKindOf(this.selectedOwner), cfg ? galleryFamily(cfg) : undefined);
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
      this.galleryPreviewNote = "The preview picture could not be made. It can still be sent without it.";
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
      : this.galleryPreviews === undefined ? "Drawing the preview picture"
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

  /** The gallery's card for this upload: the one preview picture, the title,
   * the name and the tags, as they are now. */
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

  /** Save the text as a file. */
  private downloadShareText(text: string) {
    const cfg = this.draft?.config;
    if (!cfg) return;
    saveTextFile(exportFileName(cfg), text);
    this.shareNote = "";
    this.flashShare("file");
  }

  /**
   * Save every complication in this home to one file: every device and
   * Unassigned, read fresh from the server rather than from what the panel
   * happens to hold. Unsaved edits in the open editor are not in it, since
   * the file is a copy of what the server keeps.
   *
   * A record that does not parse is left out and counted, rather than
   * stopping the whole backup over one design.
   */
  private async backupAll() {
    this.backingUp = true;
    this.saveError = undefined;
    this.copyStatus = undefined;
    try {
      const { owners } = await fetchOwners(this.hass);
      const sources: BackupSource[] = [];
      let unreadable = 0;
      for (const owner of owners) {
        const reply = await fetchList(this.hass, owner.owner_watch_id);
        const device = isLibraryOwner(owner) ? UNASSIGNED_LABEL : ownerLabel(owner);
        for (const record of reply.records) {
          if (record.deleted || !record.document) continue;
          try {
            sources.push({ device, config: parseConfig(record.document) });
          } catch {
            unreadable += 1;
          }
        }
      }
      if (sources.length === 0) {
        this.copyStatus = "There are no complications to back up yet.";
        return;
      }
      const now = new Date();
      saveTextFile(backupFileName(now), backupText(sources, now));
      const count = sources.length === 1 ? "1 complication" : `${sources.length} complications`;
      const left = unreadable === 0 ? "" : ` ${unreadable} could not be read and ${unreadable === 1 ? "is" : "are"} not in it.`;
      this.copyStatus = `Saved ${count} to ${backupFileName(now)}. To restore, choose the file in Import.${left}`;
    } catch (err) {
      this.saveError = `The backup could not be made: ${errText(err)}`;
    } finally {
      this.backingUp = false;
    }
  }

  /**
   * Put every design of a backup in Unassigned.
   *
   * Never on a device: device ids change when the integration is removed and
   * added again, which is the usual reason to restore. Each design gets a new
   * id, a free seat and a name nothing in Unassigned uses. One failed save
   * does not stop the rest; the result names what did not land.
   */
  private async restoreBackup() {
    const backup = this.importBackup;
    const shelf = this.libraryOwner();
    if (!backup || this.restoring) return;
    if (!shelf) {
      this.restoreResult = { text: `${UNASSIGNED_LABEL} is not available. Update the Wrist Assistant integration.`, error: true };
      return;
    }
    this.restoring = true;
    this.restoreResult = undefined;
    try {
      await this.loadOtherLists();
      const seats = this.seatsOn(shelf.ownerId);
      if (!seats) {
        this.restoreResult = { text: unreadableRefusal([UNASSIGNED_LABEL]), error: true };
        return;
      }
      const records = shelf.ownerId === this.ownerId ? this.records : this.otherLists.get(shelf.ownerId)?.records ?? [];
      const taken = new Set(records
        .filter((r) => !r.deleted)
        .map((r) => String(r.document?.name ?? "").trim().toLowerCase())
        .filter((n) => n !== ""));
      const plan = planRestore(backup.entries, seats.held, seats.blocked, taken, newId);
      let saved = 0;
      const failed: string[] = [];
      for (const cfg of plan.writes) {
        try {
          const out = await saveRecord(this.hass, shelf.ownerId, new Draft(cfg, null).encoded(), null);
          if (out.ok) saved += 1;
          else failed.push(cfg.name);
        } catch {
          failed.push(cfg.name);
        }
      }
      await this.reloadAfterRowWrite(shelf.ownerId);
      await this.loadOwners();
      const lines = [
        saved === 0
          ? "Nothing was restored."
          : `Restored ${saved === 1 ? "1 complication" : `${saved} complications`} to ${UNASSIGNED_LABEL}. Open the list and put each one on a device from its card.`,
      ];
      if (plan.full.length > 0) lines.push(`${UNASSIGNED_LABEL} had no free seat for: ${plan.full.join(", ")}.`);
      if (failed.length > 0) lines.push(`These could not be saved: ${failed.join(", ")}.`);
      this.restoreResult = { text: lines.join(" "), error: saved === 0 || plan.full.length + failed.length > 0 };
    } catch (err) {
      this.restoreResult = { text: `The restore stopped: ${errText(err)}`, error: true };
    } finally {
      this.restoring = false;
    }
  }

  /**
   * The Import dialog: paste, name it, say which of your entities it means.
   *
   * The parse runs on every keystroke because it is cheap and because an error
   * that appears while you are still pasting is easier to act on than one that
   * waits for a button. Nothing is created until Import, and Import saves it
   * straight away, so leaving the page afterwards does not lose it.
   */
  /**
   * The pasted document as one complication: one shape, and a shape this
   * device draws.
   *
   * A shared text can carry several shapes, since anyone can be pasting a
   * design an older panel made. A complication is one shape, so the import
   * takes the first the device can draw and the dialog says which. Nothing is
   * lost that the sender cannot share again: the text still holds the whole
   * design. The preview and the saved copy read the same shape.
   */
  private importConfig(): CustomComplicationConfig | undefined {
    const parse = this.importParse;
    if (!parse?.ok) return undefined;
    const keep = importableFamilies(parse.config, this.ownerFamilies).slice(0, 1);
    if (keep.length === supportedFamilies(parse.config).length) return parse.config;
    return keepFamilies(parse.config, keep);
  }

  private renderImportDialog() {
    const cfg = this.importConfig();
    return html`<dialog class="import-dialog xf ${this.importDrop ? "dropping" : ""}" @keydown=${this.importKeys} @close=${() => this.importClosed()}
      @dragenter=${this.importDragEnter} @dragover=${this.importDragOver} @dragleave=${this.importDragLeave} @drop=${this.importDropped}
      @paste=${this.importPasted}>
      ${this.dialogHead(this.importBackup ? "Restore a backup" : "Import", "", () => this.closeImportDialog())}
      ${this.importBackup
        ? this.renderRestoreBackup(this.importBackup)
        : cfg ? this.renderImportLoaded(cfg) : this.renderImportEmpty()}
      ${cfg && this.importDrop ? html`<div class="xfer-drop" aria-hidden="true"><span>Drop to read the file</span></div>` : nothing}
    </dialog>`;
  }

  /**
   * A whole-home backup, read: what is in it, where it goes, and one button.
   * After the restore the same view says what landed, and the button closes.
   */
  private renderRestoreBackup(backup: Extract<BackupParse, { ok: true }>) {
    const count = backup.entries.length;
    const when = backup.createdAt === "" ? undefined : new Date(backup.createdAt);
    const made = when && !Number.isNaN(when.getTime()) ? ` from ${when.toLocaleString()}` : "";
    const done = this.restoreResult !== undefined && !this.restoring;
    return html`<div class="xfer-body">
      <div class="xf-lead">${uiIcon("info")}
        <span>A backup${made} with ${count === 1 ? "1 complication" : `${count} complications`}.
          Restore puts them all in ${UNASSIGNED_LABEL}, with the entities they had.
          Nothing already here is changed.</span></div>
      <ul class="restore-list">
        ${backup.entries.map((entry) => html`<li><b>${entry.config.name.trim() || "Untitled"}</b>${entry.devices.length > 0
          ? html` <span class="restore-from">${entry.devices.join(", ")}</span>` : nothing}</li>`)}
        ${backup.problems.map((p) => html`<li class="err"><b>${p.name}</b> <span class="restore-from">cannot be restored: ${p.error}</span></li>`)}
      </ul>
      ${this.restoreResult
        ? html`<div class="hint ${this.restoreResult.error ? "err" : ""}" role="status">${this.restoreResult.text}</div>`
        : nothing}
    </div>
    <div class="xfer-foot">
      ${done ? nothing : html`<button class="small" ?disabled=${this.restoring} @click=${() => this.startImportOver()}>Start over</button>`}
      <span class="spacer"></span>
      ${done
        ? html`<button class="primary" @click=${() => this.closeImportDialog()}>Done</button>`
        : html`<button class="small" ?disabled=${this.restoring} @click=${() => this.closeImportDialog()}>Cancel</button>
          <button class="primary" ?disabled=${this.restoring || count === 0} @click=${() => void this.restoreBackup()}>
            ${this.restoring ? "Restoring…" : `Restore ${count}`}</button>`}
    </div>`;
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
    // What this device can draw, so a shape it has no tab for is never
    // counted as something that came in.
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
          ${taken ? html`<div class="hint err">A complication on ${this.placePhrase} already has that name.</div>` : nothing}
          ${have.length < 2 ? nothing : html`<div class="hint">This was shared with ${have.length} shapes. A complication is one shape, so ${familyTitle(have[0]!)} is what comes in. Share the others from the panel they were made on.</div>`}
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
    // A whole-home backup has its own view. One that does not read says why
    // in the ordinary error line, the same place a single paste's would.
    const backup = text.trim() === "" ? undefined : parseBackupText(text, this.maxSchemaVersion);
    this.importBackup = backup?.ok ? backup : undefined;
    this.restoreResult = undefined;
    if (backup) {
      this.importParse = backup.ok ? undefined : backup;
      this.importMap = new Map();
      this.importFamilies = undefined;
      this.importName = "";
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
    this.importBackup = undefined;
    this.restoreResult = undefined;
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

  /** The saved parts are a tab of the Add sheet now, so shutting "the parts
   * dialog" (its Close, or a part going in) shuts the sheet. */
  private closePartsDialog() {
    this.closeAddSheet();
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

  /** The library as a grid of pictures, in the Add sheet's Saved parts tab. Rename and delete live on the card, so
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
    // Where a write that was not this document landed. A device that has not
    // synced yet is news rather than a fault, so the banner is a quiet one and
    // the author can put it away.
    if (this.copyStatus) {
      out.push(html`<div class="banner note link-note"><span>${this.copyStatus}</span>
        ${this.copyOpen ? html`<button class="link" @click=${() => void this.openMadeCopy()}>Open it</button>` : nothing}
        <button class="link" @click=${() => { this.copyStatus = undefined; this.copyOpen = undefined; }}>Dismiss</button></div>`);
    }
    return out;
  }

  /** Offer the Move action on a watch id no device answers for any more. */
  private renderOrphanBanner(): TemplateResult | undefined {
    const owner = this.selectedOwner;
    if (!owner?.is_orphan) return undefined;
    // Registered devices only. Move is about putting these records back where
    // a watch can reach them, and the Library reaches nothing.
    const targets = this.owners.filter((o) => !o.is_orphan && !isLibraryOwner(o));
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

  /**
   * Whether anything can be added here right now: an open complication this
   * user may edit, on a shape with a canvas. Inline and the Control Center tab
   * have nowhere to put a layer, and left up, the sheet would quietly put one
   * on whichever canvas shape happens to be first.
   */
  private get canAddHere(): boolean {
    return !!this.draft && this.canEdit && isDrawable(this.activeFamily) && !this.inControlView;
  }

  /** + Add, pressed: open the sheet under the button, or shut it again. */
  private toggleAddSheet(anchor?: HTMLElement) {
    if (this.addSheet) this.closeAddSheet();
    else this.openAddSheet(anchor);
  }

  /**
   * Open the Add sheet, hung under the + Add button when there is room and in
   * the middle of the window when there is not. The search has the keyboard
   * the moment it opens, so the / key and a click on + Add both land ready to
   * type. The library of saved parts is read the first time, so its tab can
   * say how many there are.
   */
  private openAddSheet(anchor?: HTMLElement | null, tab?: AddTab) {
    if (!this.canAddHere) return;
    const button = anchor ?? this.renderRoot.querySelector<HTMLElement>(".add-open");
    const r = button?.getBoundingClientRect();
    this.addSheet = r
      ? addSheetPlace({ left: r.left, bottom: r.bottom }, { width: window.innerWidth, height: window.innerHeight })
      : { mode: "centered" };
    this.addQuery = "";
    if (tab) this.addTab = tab;
    this.partPick = undefined;
    this.partMap = new Map();
    this.partRename = undefined;
    this.partConfirmDelete = undefined;
    this.partsError = undefined;
    this.toggleSideMenu(this.sideMenu ?? "top", false);
    window.addEventListener("pointerdown", this.addSheetOutside, { capture: true });
    if (this.parts === undefined || tab === "parts") void this.loadParts();
    this.focusAddSearch();
  }

  private closeAddSheet() {
    this.addSheet = undefined;
    this.partPick = undefined;
    window.removeEventListener("pointerdown", this.addSheetOutside, { capture: true });
  }

  private focusAddSearch() {
    void this.updateComplete.then(() => {
      const input = this.renderRoot.querySelector<HTMLInputElement>(".add-sheet .as-search input");
      input?.focus();
      input?.select();
    });
  }

  /** A press outside the sheet, and outside the button that opens it, shuts
   * it. The button is left to its own click, which toggles. */
  private addSheetOutside = (e: PointerEvent) => {
    if (!this.addSheet) return;
    const inside = e.composedPath().some((n) => n instanceof HTMLElement
      && (n.classList.contains("add-sheet") || n.classList.contains("add-open")));
    if (!inside) this.closeAddSheet();
  };

  /** One empty layer of the card's kind, set to the card's source, on the
   * page showing. The sheet shuts and the new layer is selected. */
  private addBlankLayer(card: AddCard) {
    const el = newElement(card.kind);
    card.setup?.(el);
    this.addHere((c) => {
      // A timeline's clock times are always a layer of their own.
      c.elements.push(el);
      if (el.kind === "timeline") convertChartTimes(c, el.payload.id);
    });
    this.closeAddSheet();
    this.multi = new Set();
    this.inspect = { kind: "layer", id: el.payload.id };
  }

  /**
   * The Add sheet: everything a layer can start from, in one place over the
   * canvas, in place of the Add a layer card that took the top of the column.
   *
   * A search at the top narrows the elements and the presets by name, and the
   * / key opens the sheet straight into it. Three tabs under that. Elements
   * is the empty layers, grouped by what they are for: showing a value,
   * showing a picture, and decorating, with a line under the last saying a
   * tap zone is only for an empty area, since any layer can take a tap.
   * Under those, three presets most faces start from and the way to the rest.
   * Presets is every preset. Saved parts is the library of kept layers, the
   * grid that used to be its own dialog.
   *
   * Adding anything shuts the sheet and selects what it made. Past 64 layers
   * the tiles are dimmed and one line says why.
   */
  private renderAddSheet() {
    const place = this.addSheet;
    const cfg = this.draft?.config;
    if (!place || !cfg || !this.canAddHere) return nothing;
    const full = cfg.elements.length >= 64;
    // A list is offered on the wide face and the four Home Screen tiles only:
    // a cell on a round face is not a row. The same rule picks which presets
    // are shown, so the tile and the preset can never disagree.
    const kinds = KIND_ORDER.filter((k) => familyAllowsKind(this.activeFamily, k));
    const cards: readonly AddCard[] = kinds.flatMap((k) =>
      ADD_VARIANTS[k] ?? [{ kind: k, title: KIND_LABEL[k], blurb: `Add a blank ${KIND_LABEL[k].toLowerCase()} layer` }]);
    const offered = LAYER_PRESETS.filter((p) => p.families === undefined || p.families.includes(this.activeFamily));
    const query = this.addQuery.trim();
    const searching = query !== "";
    const found = filterAddOffers(query, cards, offered);
    const tab = this.addTab;
    const tile = (card: AddCard) => html`<button class="as-tile ${card.kind === "tap" ? "dashed" : ""}" style=${`--k:${KIND_COLOR[card.kind]}`}
      ?disabled=${full} title=${card.blurb} @click=${() => this.addBlankLayer(card)}>
      <span class="as-pic">${addPreview(card.kind, card.variant)}</span><span class="as-name">${card.title}</span></button>`;
    const presetTile = (p: PresetSpec) => html`<button class="as-tile" style=${`--k:${presetColor(p.kind)}`}
      ?disabled=${cfg.elements.length + p.layerCount > 64} title=${p.blurb}
      @click=${() => { this.closeAddSheet(); this.openPreset(p.kind); }}>
      <span class="as-pic">${presetPreview(p.kind)}</span><span class="as-name">${p.title}</span></button>`;
    const group = (label: string, list: readonly AddCard[]) => list.length === 0 ? nothing
      : html`<div class="as-sect">${label}</div><div class="as-grid">${list.map(tile)}</div>`;
    const tabButton = (id: AddTab, label: string, count: number | undefined) => html`<button role="tab" class="as-tab ${tab === id ? "on" : ""}"
      aria-selected=${tab === id ? "true" : "false"} @click=${() => {
        this.addTab = id;
        if (id === "parts" && this.parts === undefined) void this.loadParts();
      }}>${label}${count === undefined ? nothing : html` <span class="as-count">${count}</span>`}</button>`;
    const nothingFound = (what: string) => html`<div class="as-empty">No ${what} match "${query}".</div>`;
    let body: TemplateResult;
    if (tab === "parts") {
      body = html`<div class="as-parts">${this.partPick ? this.renderPartPicked(this.partPick.config) : this.renderPartsGrid()}</div>`;
    } else if (tab === "presets") {
      body = found.presets.length === 0
        ? nothingFound("presets")
        : html`<div class="as-grid">${found.presets.map(presetTile)}</div>`;
    } else {
      const value = addGroupCards(found.elements, "value");
      const pictures = addGroupCards(found.elements, "pictures");
      const decorate = addGroupCards(found.elements, "decorate");
      const popular = POPULAR_PRESETS
        .map((kind) => offered.find((p) => p.kind === kind))
        .filter((p): p is PresetSpec => p !== undefined);
      body = found.elements.length === 0
        ? nothingFound("elements")
        : html`
          ${group("Show a value", value)}
          ${group("Pictures", pictures)}
          ${group("Decorate", decorate)}
          ${decorate.some((c) => c.kind === "tap")
            ? html`<div class="as-note">Any layer can be tapped. Tick <b>Tap</b> on the layer. A tap zone is only for an empty area.</div>`
            : nothing}
          ${searching || popular.length === 0 ? nothing : html`
            <div class="as-sect">Popular presets</div>
            <div class="as-grid">
              ${popular.map(presetTile)}
              <button class="as-tile as-all" title="Every preset" @click=${() => { this.addTab = "presets"; }}>
                <span class="as-pic"><span class="as-more">All ${offered.length} →</span></span><span class="as-name">More presets</span></button>
            </div>`}`;
    }
    const style = place.mode === "anchored" ? `left:${place.left}px;top:${place.top}px;height:${place.height}px` : nothing;
    return html`<div class="add-sheet ${place.mode}" role="dialog" aria-label="Add to this complication" style=${style}>
      <div class="as-head">
        <label class="as-search">${uiIcon("search")}
          <input type="search" placeholder="Search elements and presets…" aria-label="Search elements and presets"
            .value=${this.addQuery} @input=${(e: Event) => { this.addQuery = (e.target as HTMLInputElement).value; }} />
          <kbd aria-hidden="true">/</kbd>
        </label>
        <button class="icon" title="Close (Escape)" aria-label="Close" @click=${() => this.closeAddSheet()}>${uiIcon("close")}</button>
      </div>
      <div class="as-tabs" role="tablist" aria-label="What to add">
        ${tabButton("elements", "Elements", found.elements.length)}
        ${tabButton("presets", "Presets", found.presets.length)}
        ${tabButton("parts", "Saved parts", this.parts?.length)}
        <span class="spacer"></span>
        ${usesPages(cfg) ? html`<span class="lc-sub">Goes on page ${this.page}</span>` : nothing}
      </div>
      ${full ? html`<div class="as-full">This complication has 64 layers, the most it can hold. Delete one to add another.</div>` : nothing}
      <div class="as-body">${body}</div>
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
    // The list's own rows, so a shift-click range can never pick a layer on a
    // page the list is not showing.
    const ids = elementsOnPage(cfg, cfg.elements.filter((el) => !isAttachedTap(cfg, el)), this.page)
      .reverse().map((el) => el.payload.id);
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
    // Inline is one line of text with no canvas, so its card lists that line
    // alone. The card used to fall back to the first canvas shape and show
    // that shape's rows, which read as "here are the Inline layers".
    if (!isDrawable(this.activeFamily)) return this.renderInlineHasNoLayers(cfg);
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
    //
    // Pages are the one thing that does take a row out: the list shows the
    // showing page, the way the canvas does. A layer on another page used to
    // sit here dimmed with a "p2" badge, which made a four-page document four
    // times the list it is and put rows in it that nothing on screen draws.
    // The cross-links still reach those layers, and clicking one brings its
    // page up (showPageOf), which is what puts its row back in the list.
    const shapeRows = ownedElements(cfg, family).filter((el) => !isAttachedTap(cfg, el));
    const ordered = elementsOnPage(cfg, shapeRows, this.page).reverse();
    const ctx = describeContext(this.host());
    const resolver = new Resolver(this.buildContext(), this.draft?.config);
    const shapeHl = this.inspect.kind === "family";
    const ground = backgroundRow(cfg, this.activeFamily);
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
    // One resolve for the whole list: every row it draws is on the showing
    // page, so every thumb comes out of the same face the big preview does.
    // Show all draws each page's block from that page's own face, so `face`
    // is moved on as the blocks are built.
    let face = resolved;
    const thumb = (ids: readonly string[]) =>
      face
        ? html`<span class="thumb">${renderLayerThumb(face, ids, { icons: this.icons, imageSizes: this.imageSizes, width: thumbW, height: thumbH })}</span>`
        : html`<span class="thumb"></span>`;
    const paged = usesPages(cfg);
    const pageCount = paged ? pagesSpecOf(cfg).count : 1;
    const rich = this.layerDetail === "expanded";

    // `held` marks a member of the selected group: the row lights up with
    // its folder, a step softer than the selected row itself, because a drag
    // on the face moves all of them and the list should say so.
    const layerRow = (el: CElement, inGroup: boolean, held = false, chevron: TemplateResult | typeof nothing = nothing) => {
      const id = el.payload.id;
      const hl = this.inspect.kind === "layer" && this.inspect.id === id;
      const eff = effectivePlacement(cfg, family, el);
      const hidden = eff.isHidden;
      const tap = attachedTapsOf(cfg, id)[0];
      // A tap layer is a tap, so it wears the same badge as a layer with one
      // attached. Without it the list marked the layers that answer a press and
      // said nothing about the rows that are nothing but a press.
      // The badge is short: "tap", or where a page-turning tap lands. The
      // action's full name made the badge the widest thing in a 300px row, so
      // it is the tooltip that says what the tap does and what it acts on.
      const tapEl = el.kind === "tap" ? el : tap;
      const tapAct = tapEl?.kind === "tap" ? tapEl.payload.action : undefined;
      const tapTitle = el.kind === "tap"
        ? `Tappable · ${describeTapAction(el.payload.action)}`
        : tap ? `Tappable · ${layerTitle(tap, ctx)} · ${tapAct ? describeTapAction(tapAct) : ""}` : undefined;
      const states = statesSummary(el.payload.rules);
      const pointed = this.picking && this.pickHoverId === id;
      const d = this.rowDrag(id, edit);
      return html`<div class="layer ${hl ? "hl" : ""} ${held ? "held" : ""} ${pointed ? "pick" : ""} ${this.dialogLitIds.includes(id) ? "lit" : ""} ${hidden ? "dim" : ""} ${this.multi.has(id) ? "multi" : ""} ${inGroup ? "kid" : ""} ${rich ? "rich" : ""}"
        style=${`--k:${KIND_COLOR[el.kind]}`} tabindex="0" draggable=${d.draggable}
        @pointerenter=${() => { this.listHoverIds = [id]; }}
        @pointerleave=${() => this.leaveRow([id])}
        @click=${(e: MouseEvent) => this.clickRow(id, e)}
        @keydown=${(e: KeyboardEvent) => { if (e.key === "Enter") this.inspect = { kind: "layer", id }; }}
        @dragstart=${d.onStart} @dragend=${d.onEnd} @dragover=${d.onOver} @drop=${d.onDrop}>
        <span class="grip" title="Drag to reorder. Drop on a group to put it inside.">${uiIcon("grip")}</span>
        <span class="bar"></span>
        ${thumb([id])}
        <span class="name">
          <b>${layerTitle(el, ctx)}</b>
          <small><span class="kind">${KIND_LABEL[el.kind]}</span> · ${layerMeta(el, resolver, this.historySeries, eff.size)}</small>
          ${rich ? html`<span class="facts">${layerFacts(this.host(), family, el, eff).map((f) => html`<span class="fact"><b>${f.label}</b> ${f.value}</span>`)}</span>` : nothing}
        </span>
        <span class="right">
          <span class="badges">
            ${tapTitle ? html`<span class="badge tap" title=${tapTitle}>${tapAct ? tapBadge(tapAct, el.payload.page ?? this.page, pageCount) : "tap"}</span>` : nothing}
            ${el.payload.rules.length === 0 ? nothing : html`<span class="badge states" title=${states}>${states.replace(/\.$/, "").toLowerCase()}</span>`}
            ${hidden ? html`<span class="badge">hidden</span>` : nothing}
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

    // `members` is what the showing page lists, `total` what the group holds on
    // this shape. They differ only on a paged document whose group straddles
    // two pages: the folder then says so rather than counting its own rows and
    // reading as a group that lost layers.
    const groupRow = (g: LayerGroup, members: CElement[], total: number) => {
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
          <small><span class="kind">Group</span> · ${members.length === total
            ? `${total} layer${total === 1 ? "" : "s"}`
            : `${members.length} of ${total} layers on this page`} · ${g.locked ? "locked" : "unlocked"}</small>
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
    const buildRows = (list: readonly LayerListRow[]) => {
      const rows: TemplateResult[] = [];
      for (const row of list) {
        if (row.kind === "layer") {
          rows.push(html`${layerRow(row.el, false, false, listChevron(row.el))}${listKids(row.el)}`);
          continue;
        }
        const g = row.group;
        rows.push(groupRow(g, row.members, row.total));
        const groupHl = this.inspect.kind === "group" && this.inspect.id === g.id;
        if (!this.collapsed.has(g.id)) rows.push(html`<div class="group-kids">${row.members.map((m) => html`${layerRow(m, true, groupHl, listChevron(m))}${listKids(m)}`)}</div>`);
      }
      return rows;
    };
    // Show all: every page's layers at once, under a line naming the page.
    // Each block's pictures come from its own page, since the showing page's
    // face does not draw a layer pinned to another one.
    const all = this.allPages && paged;
    let body: TemplateResult[];
    if (all) {
      const base = this.buildContext();
      body = layerListSections(cfg, shapeRows, pageCount).map((sec) => {
        face = resolveAll(cfg, { ...base, page: sec.page ?? this.page }, this.forced)[family];
        return html`<div class="layers-sec">${sec.label}</div>${buildRows(sec.rows)}`;
      });
      face = resolved;
    } else {
      body = buildRows(layerListRows(cfg, shapeRows, this.page));
    }
    const filter = layersFilterLine(shapeRows, paged, this.page, all);

    return html`<div class="card layers-card lc s${this.thumbStep}" style=${`--thumb-w:${thumbW}px;--thumb-h:${thumbH}px`}>
      <div class="lc-head">
        <span class="lc-title">Layers</span><span class="lc-sub">top is in front</span>
        <span class="spacer"></span>
        ${edit ? html`<button class="lc-btn pri add-open" aria-haspopup="dialog" aria-expanded=${this.addSheet ? "true" : "false"}
          title="Add a layer, a preset or a saved part (/)"
          @click=${(e: Event) => this.toggleAddSheet(e.currentTarget as HTMLElement)}>${uiIcon("plus")}<span>Add</span></button>` : nothing}
        ${this.renderLayersMenu()}
      </div>
      ${pickedCount >= 2 && edit
        ? html`<div class="group-cta"><span>${pickedCount} layers picked</span><span class="spacer"></span>
            <button class="small primary" title=${`Group (${KEY_MOD}G)`} @click=${() => this.groupPicked()}>Group them</button>
            <button class="small" title="Keep these layers under a name, to use in another complication"
              @click=${() => void this.openSavePartDialog()}>Save to parts</button>
            <button class="small" @click=${() => { this.multi = new Set(); }}>Clear</button></div>`
        : shapeRows.length > 0
          ? html`<div class="lc-filter">
              <span class="lc-sub">${filter.lead === "" ? nothing : all ? html`${filter.lead} · ` : html`On <b>page ${this.page}</b> · `}${filter.count}</span>
              ${paged ? html`<button class="lc-ghost sm" aria-pressed=${all ? "true" : "false"}
                title=${all ? "List the page showing, and the layers on every page" : "List the layers of every page, page by page"}
                @click=${() => { this.allPages = !all; }}>${all ? "This page" : "Show all"}</button>` : nothing}
            </div>`
          : nothing}
      ${pickedCount < 2 && selectedCount >= 1 && edit
        ? html`<div class="part-cta"><span class="spacer"></span>
            <button class="ghost" title=${selectedCount === 1 ? "Keep this layer under a name, to use in another complication" : "Keep these layers under a name, to use in another complication"}
              @click=${() => void this.openSavePartDialog()}>Save to parts</button></div>`
        : pickedCount < 2 && cfg.elements.length >= 2 && edit && !cfg.groups?.length
          ? html`<div class="hint">${MULTI_KEY}-click layers here or on the preview, or shift-click a range of rows, then group them so a finished part moves as one. The <b>?</b> button in the header lists every key and mouse trick.</div>`
          : nothing}
      ${shapeRows.length === 0 ? html`<div class="empty lc-empty">Nothing here yet.<br>Layers you add show in this list, top first.</div>` : nothing}
      ${!all && body.length === 0 && shapeRows.length > 0 && paged
        // The shape has layers, they are all on other pages. The empty line
        // above is for a shape with nothing at all and would be a lie here.
        ? html`<div class="hint">Nothing is on page ${this.page} yet. Layers you add now go on it.</div>`
        : nothing}
      <div class="layers">
      ${body}
      </div>
      <div class="pinned-set">
      <div class="layer pinned ground ${shapeHl ? "hl" : ""}" style=${`--k:${SECTION_COLOR.place}`} tabindex="0"
        title="The shape's background and border, and what a tap anywhere else does. Always the bottom layer. Click to edit it."
        @click=${() => { this.multi = new Set(); this.inspect = ground.inspect; }}
        @keydown=${(e: KeyboardEvent) => { if (e.key === "Enter") this.inspect = ground.inspect; }}
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
        <span class="grip" aria-hidden="true"></span>
        <span class="bar"></span>
        ${thumb([])}
        <span class="name">
          <b>${ground.name}</b>
          <small title=${ground.meta}>${ground.meta}</small>
        </span>
        <span class="right"><span class="ground-cap">${ground.caption}</span></span>
      </div>
      </div>
      ${this.renderSharedValues()}
    </div>`;
  }

  /**
   * The Layers card's ··· menu: how the rows are drawn. Two small radio
   * groups, the row detail and the picture size, which used to be two
   * segmented controls in the card's header and took the room the Add button
   * needs. The menu stays open while they are changed, so the list can be
   * watched changing under it.
   */
  private renderLayersMenu() {
    const open = this.sideMenu === "layers";
    const radio = (on: boolean, label: string, title: string, pick: () => void) => html`<button class="row" role="menuitemradio"
      aria-checked=${on ? "true" : "false"} title=${title} @click=${pick}><span class="pop-tick" aria-hidden="true">${on ? uiIcon("check") : nothing}</span>${label}</button>`;
    return html`<span class="side-menu" data-side-menu="layers">
      <button class="lc-ghost" aria-haspopup="menu" aria-expanded=${open ? "true" : "false"} aria-label="List options" title="List options"
        @click=${() => this.toggleSideMenu("layers")}>···</button>
      ${open ? html`<div class="pop-menu side-pop" role="menu" aria-label="List options">
        <div class="pop-label" role="presentation">Rows</div>
        ${radio(this.layerDetail === "compact", "Compact", "The name and one line about the layer",
          () => { this.layerDetail = "compact"; this.saveListView(); })}
        ${radio(this.layerDetail === "expanded", "Expanded", "What the layer is made of and where it sits",
          () => { this.layerDetail = "expanded"; this.saveListView(); })}
        <span class="pop-sep" aria-hidden="true"></span>
        <div class="pop-label" role="presentation">Pictures</div>
        ${THUMB_STEP_TITLE.map((label, i) => radio(this.thumbStep === i, label, `${label} row pictures`,
          () => { this.thumbStep = i as ThumbStep; this.saveListView(); }))}
      </div>` : nothing}
    </span>`;
  }

  /** The Layers card while Inline is the shape being edited.
   *
   * Inline has no canvas, but an empty card read as "this complication has
   * lost its layers". So the card lists the one thing Inline draws, its line
   * of text, as a fixed row that opens the text on the right. The row has no
   * grip, no delete and no add: the line is always there, and there is nothing
   * to stack. */
  private renderInlineHasNoLayers(cfg: CustomComplicationConfig) {
    const line = cfg.inline ? resolveInline(cfg.inline, this.buildContext(), cfg) : undefined;
    const words = line ? this.inlineLineHtml(line, 11) : "No text yet";
    const picked = this.inspect.kind === "family";
    const open = () => { this.inspect = { kind: "family" }; };
    return html`<div class="card layers-card lc inline-layers s${this.thumbStep}">
      <div class="lc-head"><span class="lc-title">Layers</span><span class="lc-sub">one line of text</span></div>
      <div class="pinned-set">
      <div class="layer pinned ${picked ? "hl" : ""}" style=${`--k:${KIND_COLOR.text}`} tabindex="0"
        title="The one line Inline draws. Click to edit it."
        @click=${open}
        @keydown=${(e: KeyboardEvent) => { if (e.key === "Enter") open(); }}>
        <span class="grip">${uiIcon("text")}</span>
        <span class="bar"></span>
        <span class="thumb blank"></span>
        <span class="name">
          <b>Inline text</b>
          <small><span class="kind">Text</span> · ${words} · ${tapWords(cfg.tapAction)}</small>
        </span>
        <span class="right"><span class="ground-cap">always here</span></span>
      </div>
      </div>
      ${this.renderSharedValues()}
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
   *
   * Answering the question builds the preset on the spot. The entity is the
   * only thing asked for, so a Create press after it would be a second click
   * for a question already answered. Only a real answer counts: a click or
   * Enter on a result, or Enter on an id typed in full. Leaving the box
   * (`blur`) commits the same text but is not an answer, because a click on
   * Cancel blurs the box first, and that must still create nothing. Create
   * stays for that one path, where the field holds an entity and no preset
   * was built.
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
          (ref, source) => {
            this.presetEntity = ref.entityId === "" ? undefined : ref;
            if (this.presetEntity && (source === "pick" || source === "typed")) this.createFromPreset();
          },
          PRESET_ENTITY_KEY,
          {
            compact: true,
            ...(spec.domains ? { domain: spec.domains } : {}),
            ...(spec.preferNumeric ? { preferNumeric: true } : {}),
          })}
        <div class="adders">
          <button class="primary" ?disabled=${chosen === undefined}
            @pointerdown=${pressed(() => this.createFromPreset())} @click=${() => this.createFromPreset()}>Create</button>
          <button class="small"
            @pointerdown=${pressed(() => this.closePresetDialog())} @click=${() => this.closePresetDialog()}>Cancel</button>
        </div>
        <div class="hint">Picking an entity creates the preset. Escape creates nothing, and Undo removes a whole preset in one step.</div>`}
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
    const env: PresetEnv = { family: this.canvasFamily, states: this.hass.states };
    const state = this.hass.states[ref.entityId];
    if (state) env.state = state;
    let created: string | undefined;
    this.addHere((c) => { created = applyPreset(c, kind, ref, env); });
    this.closePresetDialog();
    if (created) this.inspect = { kind: "layer", id: created };
  }

  // ── canvas column ─────────────────────────────────────────────────────

  /**
   * The middle column is the whole complication, read top to bottom: where the
   * design goes, then the shape it draws, big, then the values the
   * complication defines and the live values it reads. Its own settings are in
   * the inspector while no layer is selected.
   *
   * The bar over the stage used to be a row of shape tabs, each a small copy
   * of the face under it. A document is one shape now, so the bar names the
   * shape and keeps the two tools that change how the face is looked at:
   * which case it is previewed in, and which tint.
   */
  private renderCanvas() {
    if (this.parseError) return html`<div class="card error">This document cannot be read: ${this.parseError}</div>`;
    const cfg = this.canvasConfig();
    if (!cfg) {
      // Nothing opens on its own: the stage says where to go instead.
      return html`<div class="gate start">
        <div class="gate-card">
          <div class="gate-glyph">${uiIcon("layers")}</div>
          <div class="gate-eyebrow">Nothing open</div>
          <h2 class="gate-title">Pick a complication to edit.</h2>
          <p class="gate-lead">Browse all, at the top left, lists every complication in this home. Or make a new one.</p>
          <div class="gate-acts">
            <button class="primary" @click=${() => this.browseAll()}>Browse all</button>
            <button class="ghost" @click=${() => this.openNewDialog()}>${uiIcon("plus")}<span>New complication</span></button>
          </div>
        </div>
      </div>`;
    }
    const layouts = resolveAll(cfg, this.buildContext(), this.forced);
    this.syncCountdownTicker(layouts);
    const deviceCase = this.currentCase();
    const family = this.activeFamily;
    // The Control Center tab: the header stays, since its switch is how
    // anyone gets back to the face, and the toolbar goes: every tool on it is
    // a layer tool with no layers to act on.
    if (this.inControlView) {
      return html`
        <div class="card canvas-card">
          ${this.renderCanvasHead(cfg, layouts)}
          <div class="stage-area">
            <div class="stage-wrap"><div class="stage control-stage">${this.renderControlStage(cfg)}</div></div>
            ${this.renderValuesRow()}
          </div>
        </div>`;
    }
    const drawable = isDrawable(family);
    const designing = this.rowEditList() !== undefined;
    // An empty complication shows what it is and four ways to start, until
    // its first layer exists.
    const firstRun = drawable && !designing && cfg.elements.length === 0;
    const tiles = firstRun && this.canEdit;
    const ratio = drawable ? this.faceRatio(family, deviceCase) : 1;
    const paged = usesPages(cfg);
    const reserve = stageReserve({ rowStrip: designing, firstRun: tiles });
    return html`
      <div class="card canvas-card">
        ${this.renderCanvasHead(cfg, layouts)}
        <div class="stage-area">
          <div class="stage-wrap ${tiles ? "first-run" : ""}"
            style=${`--wa-ratio:${ratio};--wa-reserve:${reserve}px;--wa-zoom:${this.canvasZoom}`}>
            ${this.renderStageTools(family, deviceCase)}
            ${paged ? html`<span class="stage-page">Page ${this.page} of ${pagesSpecOf(cfg).count}</span>` : nothing}
            <div class="stage">
              ${this.renderRowStrip()}
              <div class="stage-face">
                ${drawable
                  ? this.renderBigPreview(family, layouts, deviceCase, firstRun ? this.renderFirstRunNote(family) : undefined)
                  : this.renderInlinePreview(layouts.inline, false)}
                ${this.renderStageHint(cfg, family)}
                ${tiles ? this.renderFirstRunTiles() : nothing}
              </div>
            </div>
          </div>
          ${this.renderValuesRow()}
        </div>
        ${this.zoomed && drawable ? this.renderZoomDialog(family, layouts, deviceCase) : nothing}
        ${this.demoing && drawable ? this.renderDemoDialog(family, layouts, deviceCase) : nothing}
      </div>`;
  }

  /** The face's own width over height: the slot for most shapes, and the
   * 104 × 124 screen quadrant the corner preview draws (renderer.ts). The
   * zoom and demo dialogs size their face from the same number. */
  private faceRatio(family: DrawableFamily, deviceCase: PreviewCase): number {
    const slot = slotFor(deviceCase, family);
    return family === "corner" ? 104 / 124 : slot.width / slot.height;
  }

  /**
   * The quiet header over the canvas, one 48px row: what this is (name, then
   * shape and page, muted), where it lives (one chip per device), and one
   * "···" menu for what is done to the whole of it.
   *
   * It folds the three rows that used to sit here: the name with its actions,
   * the devices with "Add to a device", and the tool row. The actions and the
   * device menu went into "···"; the tools went onto the floating toolbar.
   * A document that still holds a shape and a Control Center control keeps
   * its segmented switch, here, in place of the shape's name.
   */
  private renderCanvasHead(cfg: CustomComplicationConfig, layouts: ResolvedAll) {
    const name = cfg.name.trim() || "Complication";
    const f = supportedFamilies(cfg)[0];
    const seg = this.hasControlTab(cfg);
    const paged = usesPages(cfg) && !this.inControlView;
    const pagePart = paged ? `page ${this.page} of ${pagesSpecOf(cfg).count}` : "";
    const row = this.openRow();
    const on = row ? this.rowPlaces(row, f).filter((p) => p.on) : [];
    return html`<div class="cv-head">
      <span class="cv-name" title=${name}>${name}</span>
      <span class="cv-slash" aria-hidden="true">/</span>
      ${seg
        ? html`${this.renderShapeSwitch(cfg, layouts)}${pagePart ? html`<span class="cv-shape">${pagePart}</span>` : nothing}`
        : f === undefined
          ? nothing
          : html`<span class="cv-shape"><span class="fam">${familyTitle(f)}${pagePart ? ` · ${pagePart}` : ""}</span>${this.shapeNotes(cfg, layouts, f)}</span>`}
      <span class="spacer"></span>
      ${row && on.length > 0 ? html`<span class="doc-on" role="group" aria-label="Devices this complication is on">
        ${on.map((place) => this.renderPlaceChip(row, place))}
      </span>` : nothing}
      ${this.renderDocMenu(cfg)}
    </div>`;
  }

  /**
   * The "···" menu: History, Duplicate as…, Add to a device, and Delete
   * under a rule. The same four things the document row used to carry as
   * buttons, in that order.
   *
   * History used to be hidden until the first save. It stays in the list now,
   * disabled with the reason, so the menu reads the same every time. Add to a
   * device unfolds its devices in place, each with the reason it cannot take
   * this design when it cannot. Delete arms the way it always did: one press
   * asks, and a design on several devices asks which.
   */
  private renderDocMenu(cfg: CustomComplicationConfig) {
    if (!this.canEdit) return nothing;
    const open = this.openMenu === "doc";
    const unsaved = this.draft?.baseRevision === null;
    const close = () => this.toggleMenu("doc", false);
    return html`<span class="case-tool doc-menu" data-menu="doc">
      <button class="cv-more" aria-haspopup="menu" aria-expanded=${open ? "true" : "false"}
        aria-label="More: history, duplicate, add to a device, delete" title="More"
        @click=${() => this.toggleMenu("doc")}>···</button>
      ${open ? html`<div class="pop-menu doc-pop" role="menu" aria-label="Complication">
        <button class="row" role="menuitem" ?disabled=${unsaved} aria-haspopup="dialog"
          title=${unsaved ? "Nothing to go back to until it has been saved once" : "Earlier saves of this complication"}
          @click=${() => { close(); void this.openHistoryDialog(); }}>History${unsaved ? html`<small class="why">No earlier saves yet</small>` : nothing}</button>
        <button class="row" role="menuitem" aria-haspopup="dialog"
          title="Make this design again as another shape, or on another device"
          @click=${() => { close(); this.openDuplicateAs(cfg, this.ownerId ?? ""); }}>Duplicate as…</button>
        ${this.renderDocPlaces(cfg)}
        <div class="pop-sep" role="separator"></div>
        ${this.confirmDelete
          ? html`<div class="doc-del">${this.openLinkCount() > 1
            ? html`<button class="row danger" role="menuitem" title=${`Delete only the copy on ${this.ownerName(this.ownerId ?? "")}`}
                @click=${() => { close(); void this.deleteCurrent(false); }}>This device</button>
              <button class="row danger" role="menuitem" title="Delete it on every device it is on"
                @click=${() => { close(); void this.deleteCurrent(true); }}>All ${this.openLinkCount()} devices</button>`
            : html`<button class="row danger" role="menuitem" @click=${() => { close(); void this.deleteCurrent(); }}>Really delete</button>`}
            <button class="row" role="menuitem" @click=${() => { this.confirmDelete = false; }}>Cancel</button></div>`
          : html`<button class="row danger" role="menuitem" @click=${() => { this.confirmDelete = true; }}>Delete</button>`}
      </div>` : nothing}
    </span>`;
  }

  /**
   * "Add to a device", inside the "···" menu: the picker's own Devices menu,
   * on the complication the editor has open. See `renderAddPlaceRow` for what
   * a row does. It is there even when it cannot act, disabled with the
   * reason, so the way to put a design on a second watch is always findable.
   */
  private renderDocPlaces(cfg: CustomComplicationConfig) {
    const row = this.openRow();
    const family = supportedFamilies(cfg)[0];
    const admin = this.hass.user?.is_admin === true;
    const places = row ? this.rowPlaces(row, family) : [];
    const rest = places.filter((p) => !p.on && p.owner.kind !== "library");
    const why = !admin
      ? "Only an administrator can put it on another device."
      : !row
        ? "Save it first. Then it can go on another device too."
        : rest.length === 0
          ? "There is no other device of this kind to put it on."
          : undefined;
    const open = this.docPlaceOpen && why === undefined;
    return html`<button class="row doc-place-row" role="menuitem" aria-haspopup="true" aria-expanded=${open ? "true" : "false"}
        ?disabled=${this.saving || why !== undefined} title=${why ?? "Put this complication on another device too"}
        @click=${() => { this.docPlaceOpen = !this.docPlaceOpen; }}>Add to a device<span class="spacer"></span>${uiIcon(open ? "down" : "right")}</button>
      ${open && row ? html`<div class="doc-places-list" role="group" aria-label="Add to a device">
        ${rest.map((place) => this.renderAddPlaceRow(row, place, family))}
        <div class="place-note">A linked copy is written there. Saving this one saves it there too.</div>
      </div>` : nothing}`;
  }

  private renderBigPreview(family: DrawableFamily, layouts: ResolvedAll, deviceCase: PreviewCase, overlay?: TemplateResult) {
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
      // The same rule the shape tabs draw under, so the stage and its tabs
      // never disagree: a phone owner's Lock Screen shapes stand in white,
      // because that is all a Lock Screen widget can be. A Home Screen tile is
      // tinted the iPhone way instead: no ground of its own, and every layer
      // painted in the tint at the brightness it was drawn in.
      ...previewTintFor(family, this.previewAsPhone, this.previewTint),
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
      ${renderLayout(layout, opts)}${overlay ?? nothing}
    </div>`;
  }

  /** The words on an empty face: what the black box is, and that it is
   * empty. Drawn over the face, not into it, and never saved. */
  private renderFirstRunNote(family: FamilyKind) {
    return html`<div class="first-run-note">
      <div class="fr-title">This is your ${slotWord(family, this.previewAsPhone)}.</div>
      <div class="fr-sub">It is empty. Add a layer to draw something on it.</div>
    </div>`;
  }

  /**
   * Four big ways to start an empty complication, under its face: a value, a
   * gauge, a chart, or a preset. The first three add one blank layer and
   * select it; the fourth opens the Add sheet on its presets. Gone once the
   * first layer exists.
   */
  private renderFirstRunTiles() {
    const family = this.activeFamily;
    const presets = LAYER_PRESETS.filter((p) => p.families === undefined || p.families.includes(family)).length;
    const pic = (tile: FirstRunTile) => {
      switch (tile.id) {
        case "value": return html`<span class="fr-big">72°</span>`;
        case "gauge": return html`<svg width="40" height="40" viewBox="0 0 40 40" aria-hidden="true"><path d="M8 32A16 16 0 1 1 32 32" fill="none" stroke="#3a3a3a" stroke-width="4" /><path d="M8 32A16 16 0 0 1 9 14" fill="none" stroke=${KIND_COLOR.gauge} stroke-width="4" /></svg>`;
        case "chart": return html`<svg width="60" height="30" viewBox="0 0 60 30" aria-hidden="true"><polyline points="2,26 12,16 22,20 32,8 42,14 58,4" fill="none" stroke=${KIND_COLOR.chart} stroke-width="2.5" /></svg>`;
        case "preset": return html`<span class="fr-count">${presets} presets →</span>`;
      }
    };
    const offered = FIRST_RUN_TILES.filter((t) => !("element" in t.action) || familyAllowsKind(family, t.action.element));
    const hooks = {
      addElement: (kind: CElement["kind"]) => this.addElement(kind),
      openAddSheet: (tab: "presets") => this.openAddSheet(null, tab),
    };
    return html`<div class="first-run">
      <div class="fr-head">Start with one of these</div>
      <div class="fr-tiles">
        ${offered.map((t) => html`<button class="fr-tile fr-${t.id}" @click=${() => runFirstRunTile(t, hooks)}>
          <span class="fr-pic">${pic(t)}</span><span class="fr-name">${t.title}</span><small>${t.blurb}</small>
        </button>`)}
      </div>
      <div class="fr-foot">Or press <b>+ Add</b> in Layers for everything${this.hass.user?.is_admin
        ? html`, or <button class="link" @click=${() => this.openImportDialog()}>import a shared one</button>.`
        : "."}</div>
    </div>`;
  }

  /** One blank layer of a kind, for the first-run tiles: the same add the
   * Add sheet's element tiles make. */
  private addElement(kind: CElement["kind"]) {
    const cfg = this.draft?.config;
    if (!cfg || !this.canEdit || cfg.elements.length >= 64) return;
    this.addBlankLayer({ kind, title: "", blurb: "" });
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

  /**
   * What a drag does right now: one line of stage help.
   *
   * It used to be led by the shape's name and its size in points, and to name
   * the layer being edited. The bar over the face says which shape this is,
   * the inspector beside it says which layer is open, and nobody was reading
   * the size. What is left is the part that changes with what you are doing.
   *
   * It rides under the face, centred with it: it is about dragging the thing
   * directly above it. It spent a while up in the bar instead, which put a
   * sentence about dragging two rows away from anything draggable.
   */
  private renderStageHint(cfg: CustomComplicationConfig, family: FamilyKind) {
    const ctx = describeContext(this.host());
    const ins = this.inspect;
    const sel = ins.kind === "layer" ? cfg.elements.find((e) => e.payload.id === ins.id) : undefined;
    let tail: TemplateResult | string;
    const designing = this.rowEditList();
    if (designing) {
      tail = html`one cell of <b>${layerTitle(designing, ctx)}</b>, scaled up. Drag and size the row's layers here.
        <button class="link" @click=${() => this.setRowEdit(undefined)}>Done designing</button>`;
    } else if (this.showTaps) {
      tail = html`Every tap zone is outlined. Where two overlap, the one higher in Layers wins. Anywhere else does <b>${describeTapAction(cfg.tapAction)}</b>.`;
    } else if (this.picking) {
      tail = "Point at a layer and click it. Escape stops.";
    } else if (family === "inline") {
      tail = "One line of text. Edit it on the right.";
    } else if (ins.kind === "group") {
      const g = cfg.groups?.find((x) => x.id === ins.id);
      const n = g ? groupMembers(cfg, g.id).length : 0;
      tail = g ? html`A drag moves all ${n} layers of <b>${g.name}</b>.${g.locked ? "" : " Click one layer to move it alone."}` : "";
    } else if (sel) {
      const g = groupOf(cfg, sel.payload.id);
      tail = g?.locked
        ? html`A drag moves the whole group <b>${g.name}</b>; pull a corner to resize this layer. Arrow keys nudge the group.`
        : html`Drag it, or pull a corner. Arrow keys nudge it.${this.snapGrid && this.snapLayers ? " It snaps to the grid and to the other layers. Hold Alt to drag freely." : this.snapGrid ? " It snaps to the grid. Hold Alt to drag freely." : this.snapLayers ? " It snaps to the other layers. Hold Alt to drag freely." : " Hold Alt while dragging to snap to the grid."}`;
    } else if (cfg.elements.length === 0) {
      // Nothing to click yet. With edit rights the first-run tiles under the
      // face say what to do instead, so the hint stays out of their way.
      if (this.canEdit) return nothing;
      tail = "Nothing on it yet.";
    } else {
      tail = "Click a layer to edit it.";
    }
    return html`<div class="under"><span class="tail">${tail}</span></div>`;
  }

  /** The Inline shape as one line: symbol, then `label: value`, the way the
   * watch draws it on a wide face. A live countdown ticks with the same timer
   * the canvas previews use. */
  /** The words of the inline line, label and all, with a running countdown
   * shown as the time left. Shared by the preview and the picker's cards. */
  private inlineLineText(inline: ResolvedInline): string {
    return this.inlineLineRuns(inline).map((r) => ("text" in r ? r.text : "")).join("");
  }

  /** The same line as words and icon parts, so a preview can draw each icon
   * where it sits, the way the watch does. */
  private inlineLineRuns(inline: ResolvedInline): ReturnType<typeof inlineRuns> {
    const now = Date.now();
    const value = inline.countdownEnd !== undefined && inline.countdownEnd > now
      ? countdownRemainingString((inline.countdownEnd - now) / 1000)
      : inline.text;
    return inlineRuns(`${inline.label ? `${inline.label}: ` : ""}${value}`);
  }

  /** The line drawn: words as text, each icon part as its symbol. */
  private inlineLineHtml(inline: ResolvedInline, size: number) {
    return this.inlineLineRuns(inline).map((r) => ("text" in r ? r.text : this.icons.render(r.symbol, size, "#FFFFFF")));
  }

  private renderInlinePreview(inline: ResolvedInline | undefined, small: boolean) {
    let line: TemplateResult;
    if (!inline) {
      line = html`<div class="inline-line missing">No inline text</div>`;
    } else {
      const symbol = inline.symbol ? this.icons.render(inline.symbol, small ? 11 : 15, "#FFFFFF") : undefined;
      line = html`<div class="inline-line">${symbol ?? nothing}<span>${this.inlineLineHtml(inline, small ? 11 : 15)}</span></div>`;
    }
    if (small) return line;
    return html`<div class="preview inline active" @click=${() => { this.inspect = { kind: "family" }; }}>${line}</div>`;
  }

  /**
   * Values the complication defines once and several layers read, as the foot
   * of the Layers card, because layers are what read them. At rest it is one
   * line: the title, how many there are, and Open, or Add while there are
   * none. Open unfolds the list and its editor in place, under the line, with
   * the "?" that says how shared values work.
   *
   * `standalone` is the Control Center tab, which has no Layers card to sit
   * at the foot of, so the same thing stands as a card of its own.
   */
  private renderSharedValues(standalone = false) {
    const cfg = this.draft?.config;
    if (!cfg) return nothing;
    const values = cfg.values;
    const expanded = this.sharedOpen || this.openValue !== undefined;
    const addValue = () => {
      const nv = newNamedValue();
      this.mutate((c) => { c.values.push(nv); });
      this.sharedOpen = true;
      this.openSharedValue(nv.id);
    };
    const toggle = () => {
      if (expanded) {
        this.sharedOpen = false;
        this.setOpenValue(undefined);
      } else {
        this.sharedOpen = true;
      }
    };
    const barButton = values.length === 0 && this.canEdit && !expanded
      ? html`<button class="lc-ghost sm" title="Add a shared value" @click=${addValue}>Add</button>`
      : html`<button class="lc-ghost sm" aria-expanded=${expanded ? "true" : "false"}
          title=${expanded ? "Fold the shared values away" : "Show the shared values"} @click=${toggle}>${expanded ? "Close" : "Open"}</button>`;
    const explain = "Like a variable: set it once, and every layer that reads it follows.";
    const host = this.host();
    const resolver = new Resolver(this.buildContext(), this.draft?.config);
    const ctx = describeContext(host);
    const body = html`<div class="sv-body">
      <div class="sv-tools">
        <span class="lc-sub" title=${explain}>set once, used by many layers</span>
        <button type="button" class="sec-help ${this.sharedHelp ? "on" : ""}" title=${this.sharedHelp ? "Hide how shared values work" : "How shared values work"}
          aria-label="How shared values work" aria-expanded=${this.sharedHelp ? "true" : "false"}
          @click=${() => { this.sharedHelp = !this.sharedHelp; }}>?</button>
        <span class="spacer"></span>
        ${this.canEdit ? html`<button class="small" @click=${addValue}>Add</button>` : nothing}
      </div>
      ${this.sharedHelp ? html`<div class="shared-help">
        <p>${explain} Use one when several layers show the same thing, so a change is made in one place.</p>
        <ol>
          <li><b>Add</b> one here. Give it a name and choose its source, like an entity.</li>
          <li>On a layer, open its value and set <b>Source</b> to <b>Shared value</b>. Or click <b>Make shared</b> on a value that is already set up.</li>
          <li>Change the shared value here. Every layer that reads it changes too.</li>
          <li>Each layer can still add its own <b>Format</b>, like a unit or fewer decimals.</li>
        </ol>
      </div>` : nothing}
      ${values.length === 0 ? html`<div class="sv-none">None yet.</div>` : html`<div class="data">
      ${values.map((v) => {
        const r = resolver.resolve({ kind: { kind: "named", id: v.id } });
        const open = this.openValue === v.id;
        const toggleOne = () => { this.setOpenValue(open ? undefined : v.id); };
        return html`<div class="vitem ${open ? "open" : ""}"><div class="datum vrow ${open ? "hl" : ""}" role="button" tabindex="0" aria-expanded=${open ? "true" : "false"}
            title=${open ? "Close" : "Edit this shared value"}
            @click=${toggleOne}
            @keydown=${(e: KeyboardEvent) => { if ((e.key === "Enter" || e.key === " ") && e.target === e.currentTarget) { e.preventDefault(); toggleOne(); } }}>
          <span class="nm">${v.name || "(unnamed)"}</span>
          <span class="spacer"></span>
          <span class="meta ${r === undefined ? "none" : ""}" title=${describeValue(v.value, ctx)}>${r ?? "unresolved"}</span>
          ${this.canEdit ? html`<button class="icon danger" title="Delete. Layers that read it keep their own copy." aria-label="Delete value" @click=${(e: Event) => { e.stopPropagation(); this.mutate((c) => { deleteSharedValue(c, v.id); }); if (open) this.openValue = undefined; }}>${uiIcon("delete")}</button>` : nothing}
        </div>
        ${open ? html`<div class="value-open">${namedValueEditor(host, v)}</div>` : nothing}</div>`;
      })}
      </div>`}
    </div>`;
    return html`<div class="values-list sv-foot ${standalone ? "card standalone" : ""} ${expanded ? "open" : ""}" style=${`--c:${SECTION_COLOR.complication}`}>
      <div class="sv-bar">
        <span class="sv-title">Shared values</span><span class="lc-sub">${values.length}</span>
        <span class="spacer"></span>
        ${barButton}
      </div>
      ${expanded ? body : nothing}
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
    if (first instanceof HTMLElement && (first.classList.contains("values-list") || first.classList.contains("sv-body"))) return;
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
    // The foot of the Layers card unfolds with it, and stays open once the
    // value closes again, so the list it came from is still in front of you.
    this.sharedOpen = true;
    this.setOpenValue(id);
    const unnamed = this.draft?.config.values.find((v) => v.id === id)?.name.trim() === "";
    void this.updateComplete.then(() => {
      this.renderRoot.querySelector(".values-list .datum.hl")?.scrollIntoView({ block: "start", behavior: "smooth" });
      if (unnamed) this.renderRoot.querySelector<HTMLInputElement>(".values-list .value-open input[type=text]")?.focus({ preventScroll: true });
    });
  }

  /** Whether the bar draws the shape/Control Center segmented control, which
   * is the one case where this document has two views to switch between. */
  private hasControlTab(cfg: CustomComplicationConfig): boolean {
    return cfg.control !== undefined && ownerSupportsControls(this.selectedOwner);
  }

  /**
   * One device this design is on, and a trash that takes it off again.
   *
   * Every chip is lit, the open copy's included: they are all the same design
   * and all equally on. The chip itself does nothing when it is clicked, since
   * every copy of a link is the same document. Opening another device's copy
   * would reload the editor onto a record that draws exactly what is already
   * on the screen.
   *
   * The trash arms before it writes, the way a page's does: one press asks,
   * the next one does it, and it forgets after a few seconds. It is the
   * picker's own untick underneath, so the design's last copy anywhere is
   * moved to Unassigned rather than deleted.
   *
   * Every chip's trash works, the open copy's included. Its record cannot be
   * deleted out from under the draft built on it, so that one lands the
   * editor somewhere first: on another copy of the link, or on the
   * Unassigned copy the shelving makes. Both are this same document, so the
   * screen does not change. The only trash that cannot act is the last copy
   * of a design that is already unassigned, which has nowhere left to go.
   */
  private renderPlaceChip(row: PickerRow, place: DevicePlace) {
    const target = place.owner;
    const label = target.kind === "library" ? UNASSIGNED_LABEL : target.label;
    const icon = target.kind === "library" ? "layers" : target.kind === "iphone" ? "phone" : "watch";
    const here = place.copies.some((c) => this.isOpenCopy(c));
    const stuck = place.last && target.kind === "library"
      ? "It is unassigned already. Delete removes it."
      : place.last && this.libraryOwner() === undefined
        ? "This integration has no Unassigned list to move it to. Delete removes it."
        : here && this.draft?.baseRevision === null
          ? "This complication has never been saved. Save it first."
          : undefined;
    const off = place.last
      ? `Take it off ${label} and keep it as unassigned`
      : `Take it off ${label}. A face or widget already using it keeps it.`;
    const armed = this.placeTrashArm === target.ownerId;
    const ask = `Press again to take it off ${label}.`;
    const mayEdit = this.canEdit && this.hass.user?.is_admin === true;
    return html`<span class="doc-chip" aria-current=${here ? "true" : nothing}>
      ${uiIcon(icon)}<span class="doc-chip-name">${label}</span>
      ${mayEdit ? html`<button type="button" class="doc-trash ${armed ? "armed" : ""}"
        ?disabled=${this.saving || stuck !== undefined}
        title=${stuck ?? (armed ? ask : off)} aria-label=${stuck ?? (armed ? ask : `Take ${row.name} off ${label}`)}
        @click=${() => {
          if (!armed) { this.armPlaceTrash(target.ownerId); return; }
          this.disarmPlaceTrash();
          void this.removeRowFrom(row, place, true, true);
        }}>${armed ? html`<span class="sure">sure?</span>` : uiIcon("close")}</button>` : nothing}
    </span>`;
  }

  /**
   * One device offered in "Add to a device". It calls the picker's own write,
   * so the seat check, the making of the design's first link and the wording
   * of what happened are one set of rules. A device that cannot take it is
   * listed with the reason rather than left out.
   *
   * Never the library. Unassigned is where a design waits when it is on
   * nothing, not one more place to be at the same time, and taking the last
   * device off already puts it there. Only devices of this design's kind are
   * offered; crossing from a watch to an iPhone is "Duplicate as".
   */
  private renderAddPlaceRow(row: PickerRow, place: DevicePlace, family: FamilyKind | undefined) {
    const target = place.owner;
    const label = target.label;
    const icon = target.kind === "iphone" ? "phone" : "watch";
    const block = this.placeBlock(place, family, label);
    const title = block?.why ?? `Put it on ${label}. Saving it saves it everywhere it is.`;
    return html`<button type="button" class="row place-row" role="menuitem"
      ?disabled=${this.saving || block !== undefined} title=${title}
      @click=${() => { this.toggleMenu("doc", false); void this.addRowTo(row, target, true); }}>
      ${uiIcon(icon)}<span class="place-name">${label}</span>
      ${block ? html`<small class="place-no">${block.tag}</small>` : nothing}
    </button>`;
  }

  /** Why one device cannot take this design, in a word for the row and a
   * sentence for its tooltip. The same two reasons the picker's menu gives. */
  private placeBlock(place: DevicePlace, family: FamilyKind | undefined, label: string) {
    const owner = this.ownerOf(place.owner.ownerId);
    if (!place.draws) {
      return deviceSupportsShapes(owner)
        ? { tag: "not this shape", why: "This device's app does not draw this shape." }
        : { tag: "app too old", why: updateDeviceMessage(owner) };
    }
    if (this.freeSlotOn(place.owner.ownerId, family) < 0) {
      return { tag: "full", why: `${label} has no free seat for this shape (iPhone presets count too). Delete a complication there first.` };
    }
    return undefined;
  }

  /** The picker row of the complication the editor has open: its copy and
   * every other copy of its link, the way the picker groups them. A draft
   * nobody has saved is in no row. */
  private openRow(): PickerRow | undefined {
    if (!this.ownerId || !this.selectedId) return undefined;
    return this.pickerRows().find((r) => this.selectedCopyOf(r) !== undefined);
  }

  /**
   * The bar along the top of the canvas card: the one thing this document is.
   *
   * It used to be one tab per shape with an "Add a shape" dialog after them,
   * because a document carried up to eight shapes at once. Then it was one
   * shape tab with an "Add a Control Center control" button beside it.
   *
   * Nothing can be added here any more, and the bar draws one tab. A document
   * is one shape or one control, never both: `documentParts` in splitShapes.ts
   * counts a control as a part of its own, so a document carrying a shape and a
   * control is exactly what `autoSplitShapes` cuts in two on the next open.
   * The add button built the thing the splitter takes apart, so it is gone and
   * the New dialog's Control Center tile is the only way to make a control.
   *
   * The control tab still renders, because a document written before the button
   * went can still hold both until the splitter reaches it.
   *
   * Each tab used to carry a live picture of its shape, drawn again at tab
   * size. With one shape in the document that picture was the stage picture,
   * smaller: the same face twice on one screen, and a tall bar for it. The
   * tabs are words now, and a document with nothing to switch to gets no bar
   * at all: `renderDocShape` puts its shape in brackets after the name and
   * the tool row carries the stage help instead. So this only ever draws for
   * a document that still holds a shape and a control.
   */
  private renderShapeSwitch(cfg: CustomComplicationConfig, layouts: ResolvedAll) {
    return html`<div class="shape-seg" role="group" aria-label="Shapes">${this.renderShapeTab(cfg, layouts)}${this.renderControlTab(cfg)}</div>`;
  }

  /** What the shape warns about and whether it draws nothing, for the name or
   * the tab to carry. */
  private shapeNotes(cfg: CustomComplicationConfig, layouts: ResolvedAll, f: FamilyKind) {
    const layout = f === "inline" ? undefined : layouts[f];
    const warnings = layout === undefined ? [] : previewWarnings(layout);
    const empty = f !== "inline" && shownCount(cfg, f) === 0 && cfg.elements.length > 0;
    return html`${empty ? html`<small>nothing shown</small>` : nothing}${warnings.length === 0 ? nothing : html`<span class="warn" role="img"
      aria-label=${`Worth a look: ${warnings.join(" ")}`}
      title=${warnings.join("\n")}>${uiIcon("info")}</span>`}`;
  }

  /** The shape tab, drawn only beside a control tab: the view the canvas is
   * showing unless the control is up. */
  private renderShapeTab(cfg: CustomComplicationConfig, layouts: ResolvedAll) {
    const f = supportedFamilies(cfg)[0];
    if (f === undefined) return nothing;
    // While the Control Center tab is up no shape is being edited, so the
    // shape tab is not pressed either.
    const active = !this.inControlView;
    return html`<span class="tab-wrap">
      <button class="tab" aria-pressed=${active ? "true" : "false"}
        title=${`Edit the ${familyTitle(f)} shape`}
        @click=${() => { this.controlView = false; if (f === "inline" && this.inspect.kind === "layer") this.inspect = { kind: "family" }; }}>
        ${familyTitle(f)}${this.shapeNotes(cfg, layouts, f)}
      </button>
    </span>`;
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
    if (spec === undefined || !ownerSupportsControls(this.selectedOwner)) return nothing;
    const active = this.inControlView;
    const removable = this.canEdit && canRemoveControl(cfg);
    return html`<span class="tab-wrap">
      <button class="tab control" aria-pressed=${active ? "true" : "false"} title="Edit the Control Center control"
        @click=${() => this.openControlView()}>Control Center</button>
      ${this.canEdit && active ? html`<button class="icon danger tab-x" ?disabled=${!removable}
        title=${removable ? "Remove the Control Center control" : "This complication is only its control. Delete the whole complication instead."}
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
    const title = isLibraryOwner(this.selectedOwner) ? "Values it reads" : `Values on the ${this.deviceWord}`;
    // One floating bar at the foot of the stage, the same family as the
    // toolbar over it. It reads Live until any value is overridden, then
    // Testing, with Back to live beside it. Each value is a pill that keeps its
    // own slider, picker or box; a row too long for the bar scrolls sideways.
    return html`<div class="values-foot"><div class="values-bar ${testing ? "testing" : ""}" role="group" aria-label=${title}>
      <span class="vb-state" title=${testing
        ? "Testing: the face is drawn with the values you set here. Nothing is saved."
        : "Live: the face is drawn with what the house says right now. Slide, pick or type a value to try another."}>
        <i class="vb-dot" aria-hidden="true"></i>${testing ? "Testing" : "Live"}</span>
      <span class="tb-sep" aria-hidden="true"></span>
      ${ids.length === 0 && shared.length === 0 ? html`<span class="vb-empty">${this.inControlView
        ? "The control reads no entity yet. Point its target, title or value line at one."
        : "No entities yet. Each layer you add brings its entity here."}</span>` : html`<div class="vb-pills">
        ${ids.map((id) => {
          const s = this.hass.states[id];
          const name = typeof s?.attributes.friendly_name === "string" ? s.attributes.friendly_name : id;
          const unit = typeof s?.attributes.unit_of_measurement === "string" ? ` ${s.attributes.unit_of_measurement}` : "";
          const live = s ? `${s.state}${unit}` : "not in Home Assistant";
          const override = this.testValues.get(id);
          const user = cfg.elements.find((e) => layerEntityUses(cfg, e.payload.id).some((u) => u.ref.entityId === id));
          const kind = user?.kind ?? "text";
          return html`<div class="vchip vpill ctl ${override !== undefined ? "testing" : ""}" style=${`--k:${KIND_COLOR[kind]}`}
            title=${override !== undefined ? `Live value: ${live}` : id}>
            <span class="vp-icon">${domainIcon(id.split(".")[0] ?? "")}</span><b>${name}</b>
            ${this.renderTestControl(id, name, s, override, unit, live)}
            ${override !== undefined
              ? html`<button type="button" class="live-reset" title=${`Back to the live value: ${live}`} aria-label=${`Back to the live value of ${name}`}
                  @click=${() => this.setTestValue(id, undefined)}>${uiIcon("reset")}</button>`
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
          return html`<div class="vchip vpill ctl ${override !== undefined ? "testing" : ""}" style=${`--k:${SECTION_COLOR.complication}`}
            title=${override !== undefined ? `Saved value: ${live}` : ""}>
            <span class="vp-icon">${uiIcon("content")}</span><b>${name}</b>
            ${this.renderTestControl(key, name, s, override, "", live)}
            <span class="vtag" title="A shared value. Trying one here is not saved; change it in Shared values to keep it.">shared</span>
            ${override !== undefined
              ? html`<button type="button" class="live-reset" title=${`Back to the saved value: ${live}`} aria-label=${`Back to the saved value of ${name}`}
                  @click=${() => this.setTestValue(key, undefined)}>${uiIcon("reset")}</button>`
              : nothing}
          </div>`;
        })}
      </div>`}
      <span class="tb-sep" aria-hidden="true"></span>
      <button type="button" class="vb-live" ?disabled=${!testing}
        title=${testing ? "Drop every value you set here and draw the face from the house again" : "Already live"}
        @click=${() => { this.editingValue = undefined; this.applyTestValues(new Map()); }}>Back to live</button>
    </div></div>`;
  }

  /**
   * The control for one test value. A number slides, so a gauge filling or a
   * color changing at a threshold can be watched as it moves rather than
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
   * phone document in a watch case would be the wrong picture twice over.
   *
   * The Library is offered both lists. A design on the shelf has not been
   * given a device yet, so there is no one answer to preview it as, and it can
   * carry every shape either kind of device draws. It starts on the reference
   * watch, which is what `referenceCase` says below. */
  private get previewCases(): PreviewCase[] {
    if (isLibraryOwner(this.selectedOwner)) return [...CASES, ...PHONE_CASES];
    return deviceKindOf(this.selectedOwner) === "iphone" ? PHONE_CASES : CASES;
  }

  /** The measured device of the owner's kind: the 46 mm watch, or the iPhone
   * 15 Pro. Every small picture in the panel is drawn in it, so a row in the
   * list and the big preview agree about proportions. The Library takes the
   * watch, the device these designs are mostly built for. */
  private get referenceCase(): PreviewCase {
    return deviceKindOf(this.selectedOwner) === "iphone" ? REFERENCE_PHONE : REFERENCE_CASE;
  }

  private currentCase(): PreviewCase {
    return this.previewCases.find((c) => c.label === this.previewCase) ?? this.referenceCase;
  }

  /** Whether previews stand for an iPhone, which decides the Lock Screen's
   * white. One getter rather than the test written out at each picture, so the
   * stage, its shape tabs and the demo can never disagree about it.
   *
   * The Library answers false: a design on the shelf has no device yet, so
   * there is nothing to say its Lock Screen shapes are a phone's rather than a
   * watch's, and it previews in full color the way it always has. */
  private get previewAsPhone(): boolean {
    return deviceKindOf(this.selectedOwner) === "iphone";
  }

  private previewSlot(family: DrawableFamily) {
    return slotFor(this.currentCase(), family);
  }

  // ── inspector ─────────────────────────────────────────────────────────

  /**
   * The inspector's breadcrumb: the complication's name, muted, then what is
   * selected as a kind chip and its name. A layer in a group has the group
   * between them; a pick of several says how many. With nothing selected the
   * complication itself is the subject, so it takes the chip.
   */
  private crumbs(cfg: CustomComplicationConfig, picked?: number) {
    const ins = this.inspect;
    const name = cfg.name.trim() || "Complication";
    const here = (color: string, kind: string, label: string) => html`<span class="kchip" style=${`--k:${color}`}>${kind}</span><span class="nm" title=${label}>${label}</span>`;
    if (picked === undefined && ins.kind === "general") {
      return html`<div class="crumbs">${here(SECTION_COLOR.complication, "Complication", name)}</div>`;
    }
    // The root deselects, and with nothing selected the inspector is the
    // complication itself.
    const root = html`<button class="root" title="Edit the complication" @click=${() => { this.multi = new Set(); this.inspect = { kind: "general" }; }}>${name}</button><span class="sep">›</span>`;
    let tail: TemplateResult | typeof nothing = nothing;
    // A pick of several layers is what the inspector is about, whatever the
    // one selected layer under it happens to be.
    if (picked !== undefined) {
      tail = html`<span class="nm">Picked ${picked} layers</span>`;
    } else if (ins.kind === "layer") {
      const el = elementIn(cfg, ins.id);
      if (el) {
        const g = groupOf(cfg, el.payload.id);
        tail = html`${g ? html`<button @click=${() => { this.inspect = { kind: "group", id: g.id }; }} title="Edit the group">${g.name}</button><span class="sep">›</span>` : nothing}${here(KIND_COLOR[el.kind], KIND_LABEL[el.kind], layerTitle(el, describeContext(this.host())))}`;
      }
    } else if (ins.kind === "group") {
      const g = cfg.groups?.find((x) => x.id === ins.id);
      if (g) tail = here(SECTION_COLOR.group, "Group", g.name);
    } else {
      tail = here(SECTION_COLOR.place, "Shape", "Background");
    }
    return html`<div class="crumbs">${root}${tail}</div>`;
  }

  /** The picked layers that still exist, in the document's draw order. */
  private pickedElements(cfg: CustomComplicationConfig): CElement[] {
    if (this.multi.size < 2) return [];
    return cfg.elements.filter((e) => this.multi.has(e.payload.id));
  }

  /**
   * What this complication is, in words, for the read-only Shape row of the
   * Complication card: "Rectangular, on Jesse's Apple Watch".
   *
   * One shape on one kind of device, so there is nothing to tick and nothing
   * to choose. It used to be the "Appears on" list, a column of devices with a
   * copy behind each tick, which is the whole of what one shape per
   * complication did away with. A shape travels by being copied now, and a
   * copy is its own complication from that moment, which the row's tooltip
   * says.
   */
  private whatItIs(cfg: CustomComplicationConfig): { line: string; note: string } {
    const family = supportedFamilies(cfg)[0];
    const shelved = isLibraryOwner(this.selectedOwner) || !this.selectedOwner;
    const shape = family === undefined ? "Control Center" : familyTitle(family);
    const where = shelved || !this.selectedOwner ? "not on a device yet" : `on ${ownerLabel(this.selectedOwner)}`;
    const also = cfg.control !== undefined && family !== undefined ? ", with a Control Center control" : "";
    return {
      line: `${shape}, ${where}${also}`,
      note: shelved
        ? "No device shows it until a copy of it goes on one."
        : "A copy on another device is a complication of its own.",
    };
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
      // control's tab the card is the name alone. What this complication is,
      // in words, is the read-only Shape row under the name on both tabs: one
      // shape on one kind of device is the fact everything else on the card
      // hangs off.
      const complication = card(host, "complication", "Complication",
        generalEditor(host, { nameOnly: control, shape: this.whatItIs(cfg) }),
        { color: SECTION_COLOR.complication, icon: "watch", alwaysOpen: true });
      // A document with no layers yet gets the three steps instead of the line
      // about clicking one, since there is nothing to click.
      const next = cfg.elements.length === 0
        ? html`<div class="how-card">
            <b>How this works</b>
            <ol>
              <li>Add layers. Each one shows an entity.</li>
              <li>Drag them on the face.</li>
              <li>Save. The ${this.deviceWord} picks it up.</li>
            </ol>
            <a href="https://docs.wrist-assistant.com/" target="_blank" rel="noopener">Read the two-minute guide</a>
          </div>`
        : html`<p class="insp-note">Click a layer ${deviceKindOf(this.selectedOwner) === "iphone" ? "on the preview" : "on the watch"} or in the list to edit it. The shape's own background and border are the Background row at the bottom of the list.</p>`;
      return html`
        <div class="insp-head">${this.crumbs(cfg)}</div>
        <div class="insp-body" style=${editable} @change=${() => this.draft?.endGesture()}>
          ${control
            ? html`${complication}${controlCard(host, { alwaysOpen: true })}`
            : html`${complication}${next}`}
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
    // Collapse all folds back to Content and Look; Open all opens every card.
    // A card's own More line keeps its state either way.
    const extra = moreThanDefaultOpen(this.openSections);
    const moreLines = [...this.openSections].filter((id) => id.includes(":"));
    return html`
      <div class="insp-head">
        ${this.crumbs(cfg)}
        ${cards ? html`<button class="expand" @click=${() => {
          this.openSections = new Set([...(extra ? collapsedSections() : ALL_SECTIONS), ...moreLines]);
        }}>${extra ? "Collapse all" : "Open all"}</button>` : nothing}
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
    const setColor = (v: string) => this.mutate((c) => {
      for (const el of picked) {
        const t = c.elements.find((e) => e.payload.id === el.payload.id);
        if (t && t.kind !== "image" && t.kind !== "tap" && t.kind !== "timeline" && t.kind !== "chartTimes" && t.kind !== "chartDots" && t.kind !== "chartGrid" && t.kind !== "imageTime" && t.kind !== "list") t.payload.colorSlot.baseColorHex = v;
      }
    }, "multi-color");
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
          ${common.colorable
            ? html`${colorField("Color", common.color, (v) => { if (v !== undefined) setColor(v); })}
              ${common.color === undefined ? html`<div class="hint keep">These layers are different colors. Pick one to give them all the same.</div>` : nothing}`
            : html`<div class="hint keep">No shared color: a picture and a tap zone have none.</div>`}
          <div class="hint">These layers are on the ${familyTitle(family)} shape and on no other, so nothing here reaches another shape.</div>
          <div class="hint">Size, content and states belong to one layer at a time. Click a layer on its own to reach them.</div>`,
        { color: SECTION_COLOR.place, icon: "place", summary: "The settings every picked layer has", alwaysOpen: true })}`;
  }

  /**
   * Status and the raw document, as one row at the foot of the inspector.
   *
   * Neither is part of authoring, so neither earns a card. The row says the
   * one thing worth a glance, which is whether the work is saved, and Raw
   * configuration opens the rest above it.
   */
  private renderFooter() {
    const d = this.draft;
    if (!d) return nothing;
    const rec = this.records.find((r) => r.id === this.selectedId);
    const status = footerStatus({
      revision: rec?.revision ?? null,
      dirty: d.dirty,
      updatedBy: rec?.updatedBy ?? "",
      ...(this.saveError !== undefined ? { error: this.saveError } : {}),
      ...(this.templateError !== undefined ? { templateError: this.templateError } : {}),
    });
    return html`<div class="foot" data-open=${this.rawOpen ? "true" : "false"}>
      ${this.rawOpen ? this.renderRawDetails(d, rec) : nothing}
      <div class="foot-row">
        <span class="foot-dot ${status.tone}" aria-hidden="true"></span>
        <span class="foot-text" title=${status.text}>${status.text}</span>
        <button class="foot-raw" aria-expanded=${this.rawOpen ? "true" : "false"}
          @click=${() => { this.rawOpen = !this.rawOpen; }}>Raw configuration</button>
      </div>
    </div>`;
  }

  /** What Raw configuration opens: the saved details, the templates and
   * entities the document reads, and the document itself. */
  private renderRawDetails(d: Draft, rec: ComplicationRecord | undefined) {
    return html`
      <div class="foot-body">
        <dl class="kv">
          <dt>Revision</dt><dd>${rec ? rec.revision : "unsaved"}${d.dirty ? html` <span class="warn">· unsaved changes</span>` : ""}</dd>
          ${rec ? html`<dt>Saved</dt><dd>${rec.updatedAt || "at an unknown time"} ${savedByWords(rec.updatedBy) || "by an unknown user"}</dd>` : nothing}
          <dt>Templates</dt><dd class=${this.templateError ? "err" : "ok"}>${this.templateError ?? (this.compiled?.document ? "rendered" : "none")}</dd>
          <dt>Entities</dt><dd>${this.compiled?.entities.size ?? 0}</dd>
        </dl>
        <p class="hint">Save writes to Home Assistant. ${isLibraryOwner(this.selectedOwner)
          ? "Nothing shows it until a copy of it goes on a device."
          : `Open Wrist Assistant on the ${this.deviceWord} to pull it down.`}</p>
        <button class="link" @click=${() => (this.showRaw = !this.showRaw)}>${this.showRaw ? "Hide the raw configuration" : "Show the raw configuration"}</button>
        ${this.showRaw ? html`<pre>${JSON.stringify(d.encoded(), null, 2)}</pre>` : nothing}
      </div>`;
  }
}

/** What the inspector's footer row says, and the color of its dot: green
 * once saved, amber with unsaved changes, grey before the first save, red for
 * an error. */
export function footerStatus(i: {
  revision: number | null;
  dirty: boolean;
  updatedBy: string;
  error?: string;
  templateError?: string;
}): { tone: "ok" | "warn" | "none" | "err"; text: string } {
  if (i.error !== undefined && i.error !== "") return { tone: "err", text: `Not saved: ${i.error}` };
  if (i.templateError !== undefined && i.templateError !== "") return { tone: "err", text: `Template error: ${i.templateError}` };
  if (i.revision === null) return { tone: "none", text: "Not saved yet" };
  if (i.dirty) return { tone: "warn", text: `Revision ${i.revision} · unsaved changes` };
  const by = savedByWords(i.updatedBy);
  return { tone: "ok", text: `Revision ${i.revision} · ${by === "" ? "saved" : `saved ${by}`}` };
}

/** Save text as a file: a Blob and one click on a link nobody sees. The panel
 * has no download route on the server and needs none. */
function saveTextFile(name: string, text: string) {
  const url = URL.createObjectURL(new Blob([text], { type: "application/json" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
  // Freed on the next turn: revoking in this one can beat the download to it.
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
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
  // The home's shelf is named here rather than by the server, which still
  // calls it Library: it is one word on screen and the integration's own
  // rows are not worth a migration for it.
  if (isLibraryOwner(o)) return UNASSIGNED_LABEL;
  const name = o.device_name ?? o.owner_watch_id;
  if (deviceKindOf(o) === "iphone") return /iphone/i.test(name) ? name : `${name} (iPhone)`;
  return o.paired_iphone_name ? `${name} (${o.paired_iphone_name})` : name;
}

/**
 * One owner's name where the list already says what kind of device it is.
 *
 * The picker's tabs and section headings carry a watch or phone glyph and
 * the person's color, so the paired phone in parentheses and the "(iPhone)"
 * badge only repeat what the glyph says. The bare name is what those read.
 */
export function ownerShortLabel(o: OwnerSummary): string {
  if (isLibraryOwner(o)) return UNASSIGNED_LABEL;
  return o.device_name ?? o.owner_watch_id;
}

/** Owners in the order the picker lists them: watches first, then phones,
 * each group left in the order the server gave. The server sorts them this
 * way too; doing it here as well means a mixed reply still reads as two
 * groups rather than an interleaved list. */
export function ownersByKind(owners: readonly OwnerSummary[]): OwnerSummary[] {
  return ownerGroups(owners).flatMap((g) => g.owners);
}

/**
 * One device for a list with two lines to spare: the name on its own line, and
 * what tells it apart from the device under it on a second, quieter one.
 *
 * `ownerLabel` says the same things on one line, for the places that have only
 * one line to say them on, and it stays the wording of the header's button and
 * of the picker's device chips. Nothing draws the two-line form since the
 * picker's device pane went; it is kept for the next list that needs one. A
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
 * This home's devices, cut into the groups a device list heads its sections
 * with. The order is `ownersByKind`'s: watches first, then phones, each group
 * left as the server gave it. A home with only one kind of device gets one
 * group, so a list can draw no heading at all rather than one over everything.
 *
 * The Library comes last and on its own. It is not a device, so counting it
 * among the watches would both misname it and put it before every phone in
 * every list that reads this order.
 */
export function ownerGroups(owners: readonly OwnerSummary[]): { label: string; owners: OwnerSummary[] }[] {
  const devices = owners.filter((o) => !isLibraryOwner(o));
  const watches = devices.filter((o) => deviceKindOf(o) !== "iphone");
  const phones = devices.filter((o) => deviceKindOf(o) === "iphone");
  const library = owners.filter((o) => isLibraryOwner(o));
  const groups: { label: string; owners: OwnerSummary[] }[] = [];
  if (watches.length > 0) groups.push({ label: watches.length === 1 ? "Watch" : "Watches", owners: watches });
  if (phones.length > 0) groups.push({ label: phones.length === 1 ? "iPhone" : "iPhones", owners: phones });
  if (library.length > 0) groups.push({ label: UNASSIGNED_LABEL, owners: library });
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
  // What the layer reads right now takes the live-value color here too, so a
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
      // Changes rather than runs: the strip merges neighbours of one color, and
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
