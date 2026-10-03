// What `<wa-page-editor>` hands the modules that draw parts of it on their
// own: the tile settings in the side column (`tile-settings.ts`) and the Add
// tile dialog (`add-tile.ts`). Each module is a function of its host and owns
// no state of its own beyond `uiState`, so the element stays the one place
// that holds the draft, the selection and the undo steps.
//
// The modules draw with the panel's own field rows, entity search, symbol
// grid and color box from `editors.ts`, whose rules the element already
// carries (`formStyles`). A field run inside a `.sec-b` looks as it does in
// the panel's inspector.
//
// No DOM here: the scrub bookkeeping below is plain state so it can be
// tested.

import type { HassLike } from "../ha-api.js";
import type { IconProvider } from "../renderer.js";
import type { SymbolBrowser } from "../symbols.js";
import type { WatchTemplateRender } from "./app-model.js";
import type { WatchCatalog } from "./catalog.js";
import type { WatchPagesApplyOptions } from "./draft.js";
import type { WatchPage, WatchPageTile, WatchPagesDocument } from "./model.js";
import type { WatchDeviceSiblings } from "./special-model.js";

/** What both modules get. Built afresh for every draw; keep none of it across
 * draws except through `uiState`.
 *
 * `document`, `page`, `otherPages`, `catalog`, `busy`, the home's data and
 * the template renders (and a tile host's `tile`) are
 * getters that read the draft every time they are read, never a copy taken at
 * the draw: one task can run two edits (a field's blur commit and then
 * another control's handler, a drag step after a merge, a script), and the
 * second must start from what the first left, or it puts the first back. So
 * a host is never spread (`{...host}` copies a getter's value once and drops
 * the getter); `extendHost` adds fields to one and keeps them. */
export interface WatchPagesEditorHost {
  /** Home Assistant as the panel has it now: `states`, and the `entities`,
   * `devices` and `areas` registries where the frontend has them. What
   * `entityField({ hass }, ...)` reads. A new object several times a second;
   * never compare it by identity. */
  readonly hass: HassLike;
  /** The panel's symbol provider: `names()` lists the SF Symbols once the
   * symbol file is in (undefined until then), `render()` draws one. A glyph
   * that arrives later redraws the element by itself. Never undefined: a
   * provider that draws nothing stands in when the panel passed none. */
  readonly icons: IconProvider;
  /** The element's own symbol browser (open grids, searches, recents), for
   * `symbolField(host, ...)` with this host. */
  readonly symbols: SymbolBrowser;
  /** The whole pages document as edited now. Every edit starts from this. */
  readonly document: WatchPagesDocument;
  /** The selected page: its id as the document has it, and the page. */
  readonly pageId: string;
  readonly page: WatchPage;
  /** Every other page a person can pick, in watch order: the targets of a
   * Go to page or Peek page tile. System pages are left out. */
  readonly otherPages: readonly WatchPage[];
  /** The iPhone's HTTP actions, macros and status pages (`catalog.ts`), as
   * the element read them last; undefined while the phone has published
   * none. Held by the element, never in the document: nothing here saves,
   * undoes or merges it. A getter like `document`. */
  readonly catalog: WatchCatalog | undefined;
  /** The watch's own camera setting from its `behavior` document (refresh
   * on page open, and the debounce), with the phone's defaults while there
   * is none: the words of the Camera task's Default. A getter. */
  readonly cameraRefreshDefaults: { on: boolean; debounce: string };
  /** The watch's `behavior` document as the element read it last (the
   * Pointer section's two switches live there); undefined while there is
   * none, before the read is in, and after a read that failed. Read only
   * here: the panel never writes it. A getter. */
  readonly behavior: Readonly<Record<string, unknown>> | undefined;
  /** Whether Music Assistant has a config entry in this home, in any state
   * (the phone's rule for the Music Hub add); undefined until the element's
   * call is answered, and after a call that failed. Asked once for the home,
   * and again after a reconnect. A getter. */
  readonly musicAssistant: boolean | undefined;
  /** Whether Home Assistant Cloud is logged in and connected, so `tts.cloud`
   * is a voice engine; undefined until known or when the call failed (the
   * phone then leaves `tts.cloud` out). A getter, asked as `musicAssistant`. */
  readonly cloudTTS: boolean | undefined;
  /** The shown page's template tiles rendered by Home Assistant
   * (`render_values`, as the watch's `template` op renders them), by tile
   * id: a value, or the error Home Assistant gave, with the text it was
   * asked for. A tile is missing until its first answer is in, and keeps its
   * last answer while a newer one is out or after a call failed; read it
   * through `watchTemplateRender`, which shows it only for the same text.
   * Held by the element, never in the draft. A getter. */
  readonly templateRenders: ReadonlyMap<string, WatchTemplateRender>;
  /** The entities on the same device as `entityId` in Home Assistant's
   * entity registry (registry order), for a remote's "Use <player>" and a
   * vacuum's discovery. Empty when the entity has no device. */
  deviceSiblings(entityId: string): WatchDeviceSiblings;
  /** Load a picture (a camera's `entity_picture`) and read its natural size,
   * for ratio detection; undefined when it does not load. The element
   * loads it as an image; a test or the harness stands one in. */
  loadImageSize(url: string): Promise<{ width: number; height: number } | undefined>;
  /** True while a save is out, a tile or a page is being dragged, or the page
   * is shown "As on the watch": `apply` refuses every edit then. Draw the
   * fields disabled. */
  readonly busy: boolean;
  /** View state the modules keep between draws (which sections are open,
   * text typed and not committed yet). Owned by the element: it outlives a
   * draw, not a watch switch or the element itself. Prefix keys with the
   * module's name. */
  readonly uiState: Map<string, unknown>;
  /** Make `next` the document: one undo step, or, with `coalesce`, a step
   * that the next edits with the same key replace (typing in one field). A
   * drag on a number's title or box (the panel's scrub) is one step by
   * itself, whatever keys its edits carry. False when nothing changed or the
   * edit was refused (`busy`). */
  apply(next: WatchPagesDocument, options?: WatchPagesApplyOptions): boolean;
  /** End the coalesced run, so the next edit is a step of its own. Call it
   * when a field loses focus. */
  endCoalesce(): void;
  /** Select a tile of the selected page by id (one just added), or none. */
  selectTile(id: string | undefined): void;
  /** Draw the element again, after a change to `uiState`. */
  requestUpdate(): void;
}

/** The tile settings' host: the selected tile, which is always on `page`. */
export interface TileSettingsHost extends WatchPagesEditorHost {
  readonly tileId: string;
  readonly tile: WatchPageTile;
}

/** The Add tile dialog's host. The selected tile, when there is one, is the
 * one the dialog was opened over. */
export interface AddTileHost extends WatchPagesEditorHost {
  readonly tileId: string | undefined;
  readonly tile: WatchPageTile | undefined;
  /** Close the dialog, as Cancel or Escape does. */
  close(): void;
}

/** A provider that draws nothing, for an element the panel gave no icons. */
export const NO_ICONS: IconProvider = {
  render: () => undefined,
  available: () => false,
  names: () => [],
};

/** The input types keys type text into, where Cmd+Z and the editor's own
 * keys belong to the field. */
const TEXT_INPUT_TYPES: ReadonlySet<string> = new Set(["text", "number", "search", "email", "url", "tel", "password"]);

/**
 * Whether a focused element takes typed text, so the editor leaves its keys
 * (undo, redo) to it: a text-like input, a text area, or an editable
 * element. A slider, a menu, a switch or a button is not one, and an undo
 * there is the editor's. Takes the element's tag name (any case), its
 * `type` for an input, and whether it is editable.
 */
export function watchKeysTypeText(tag: string, type: string | undefined, editable: boolean): boolean {
  const name = tag.toLowerCase();
  if (name === "textarea") return true;
  if (name === "input") return TEXT_INPUT_TYPES.has((type ?? "text").toLowerCase() || "text");
  return editable;
}

/**
 * `base` with more fields, each a getter read every time. The base is the
 * new object's prototype, so its own getters (`document`, `busy`) stay
 * getters and its functions stay reachable. A spread would have copied each
 * getter's value of that moment instead.
 */
export function extendHost<B extends object, X extends object>(
  base: B,
  extra: { readonly [K in keyof X]: () => X[K] },
): B & X {
  const out = Object.create(base) as B & X;
  for (const key of Object.keys(extra) as (keyof X & string)[]) {
    Object.defineProperty(out, key, { get: extra[key], enumerable: true, configurable: true });
  }
  return out;
}

/**
 * The provider with its `names()` answered once. The panel's provider sorts a
 * fresh copy of every name on each call, and the settings and the symbol
 * field ask on every draw (several a second while Home Assistant ticks); the
 * same array also lets the symbol field's own caches, which go by the
 * array's identity, hold. Make a new one whenever the provider or its tick
 * changes (names that arrived later). An undefined answer (still loading) is
 * asked again next time.
 */
export function memoIconNames(provider: IconProvider): IconProvider {
  let names: string[] | undefined;
  const out: IconProvider = {
    render: (symbol, size, colorHex) => provider.render(symbol, size, colorHex),
    available: () => provider.available(),
    names: () => (names ??= provider.names()),
  };
  if (typeof provider.mdiNames === "function") out.mdiNames = () => provider.mdiNames!();
  if (typeof provider.mdiPath === "function") out.mdiPath = (name) => provider.mdiPath!(name);
  return out;
}

/**
 * A drag on a number field (`SCRUB_START` to `SCRUB_END`) as one undo step.
 *
 * The panel opens a gesture on its draft for the drag. The page draft has no
 * gestures, only coalesced runs, so each drag gets a key of its own and every
 * edit made during it carries that key, whatever key the field asked for. A
 * drag ends the run that was going before it, and its own run at the end.
 */
export class ScrubRun {
  private seq = 0;
  private key: string | undefined;

  /** Whether a drag is going on. */
  get active(): boolean {
    return this.key !== undefined;
  }

  /** A drag began. The caller ends the draft's run first. */
  start(): void {
    this.key = `scrub:${++this.seq}`;
  }

  /** The drag ended. Returns whether one was going. */
  end(): boolean {
    const was = this.key !== undefined;
    this.key = undefined;
    return was;
  }

  /** The options an edit is applied with: the drag's key during a drag, the
   * edit's own otherwise. */
  options(own?: WatchPagesApplyOptions): WatchPagesApplyOptions | undefined {
    return this.key === undefined ? own : { ...own, coalesce: this.key };
  }
}
