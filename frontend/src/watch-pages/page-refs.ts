// What else points at a watch page: the slots of the watch's menus that go
// to it, and the custom complications whose tap (or one of whose tap layers)
// opens it. Deleting a page used to leave all of these behind, still naming
// a page the watch no longer has. The page editor's delete question lists
// them, and once the delete is saved the editor clears them in the menus
// record and in each complication (`clearPageFromMenus`,
// `clearPageFromComplication`).
//
// Pure functions over the raw documents, so a test reaches them without the
// panel, and nothing is parsed and re-encoded: what is not about the page is
// written back exactly as it was read.

import type { ComplicationRecord } from "../ha-api.js";
import {
  ANYWHERE,
  type MenuListRef,
  type MenusDocument,
  removeWatchMenuSlot,
  slotAction,
  slotActionType,
  watchMenuDomains,
  watchMenuPositionLabel,
  watchMenuSlotId,
  watchMenuSlots,
  watchMenusSection,
} from "../watch-menus/model.js";
import { sameWatchId } from "./edit.js";
import { isJsonObject, type JsonObject } from "./model.js";

/** The menu action that goes to a page, and the payload key naming it. */
const GO_TO_PAGE = "navigateToPage";
const GO_TO_PAGE_KEY = "pageId";

/** One menu slot that goes to the page. `where` is the menu in the panel's
 * words; `position` the slot's place on the ring. */
export interface MenuPageRef {
  ref: MenuListRef;
  slotId: string;
  where: string;
  position: string;
}

/** Every slot list of the menus document: the Anywhere menu, each slot list
 * of the Entity quick menu (domains that share one list counted once), and
 * each entity's own list. */
function menuLists(menus: MenusDocument): { ref: MenuListRef; where: string }[] {
  const lists: { ref: MenuListRef; where: string }[] = [{ ref: ANYWHERE, where: "Anywhere menu" }];
  const seen = new Set<string>();
  for (const domain of watchMenuDomains()) {
    if (seen.has(domain.slotKey)) continue;
    seen.add(domain.slotKey);
    lists.push({ ref: { list: "domain", domain: domain.domain }, where: `Entity quick menu, ${domain.label}` });
  }
  const overrides = watchMenusSection(menus, "entityRadial").entityOverrides;
  if (isJsonObject(overrides)) {
    for (const entityId of Object.keys(overrides)) {
      lists.push({ ref: { list: "entity", entityId }, where: `Entity quick menu for ${entityId}` });
    }
  }
  return lists;
}

/** Whether a slot goes to one of `pageIds`. */
function slotOpens(slot: JsonObject, pageIds: readonly string[]): boolean {
  if (slotActionType(slot) !== GO_TO_PAGE) return false;
  const target = slotAction(slot)[GO_TO_PAGE_KEY];
  return pageIds.some((id) => sameWatchId(target, id));
}

/** The menu slots that go to `pageId`, in list order. */
export function menuSlotsOpeningPage(menus: MenusDocument | undefined, pageId: string): MenuPageRef[] {
  if (menus === undefined) return [];
  const found: MenuPageRef[] = [];
  for (const { ref, where } of menuLists(menus)) {
    for (const slot of watchMenuSlots(menus, ref)) {
      if (!slotOpens(slot, [pageId])) continue;
      const position = typeof slot.position === "string" ? watchMenuPositionLabel(slot.position) : "";
      found.push({ ref, slotId: watchMenuSlotId(slot), where, position });
    }
  }
  return found;
}

/** The menus with every slot that goes to one of `pageIds` taken out: a Go
 * to Page slot with no page is one the watch cannot run. The same document
 * (by identity) when nothing goes to them, so a caller can skip the save. */
export function clearPageFromMenus(menus: MenusDocument, pageIds: readonly string[]): MenusDocument {
  let next = menus;
  for (const { ref } of menuLists(menus)) {
    for (const slot of watchMenuSlots(next, ref)) {
      if (slotOpens(slot, pageIds)) next = removeWatchMenuSlot(next, ref, watchMenuSlotId(slot));
    }
  }
  return next;
}

/** How a complication opens the page: its own tap, and how many of its tap
 * layers. */
export interface ComplicationPageRef {
  id: string;
  name: string;
  whole: boolean;
  layers: number;
}

function opens(holder: JsonObject, pageIds: readonly string[]): boolean {
  return pageIds.some((id) => sameWatchId(holder.openPageId, id));
}

function tapLayers(document: JsonObject): JsonObject[] {
  const elements = Array.isArray(document.elements) ? document.elements : [];
  return elements.filter((el): el is JsonObject => isJsonObject(el) && el.kind === "tap" && isJsonObject(el.payload))
    .map((el) => el.payload as JsonObject);
}

/** The complications among `records` whose tap, or one of whose tap layers,
 * opens `pageId`. A deleted record, or one with no document, is skipped. */
export function complicationsOpeningPage(records: readonly ComplicationRecord[], pageId: string): ComplicationPageRef[] {
  const found: ComplicationPageRef[] = [];
  for (const record of records) {
    const document = record.document;
    if (record.deleted || !isJsonObject(document)) continue;
    const whole = opens(document, [pageId]);
    const layers = tapLayers(document).filter((tap) => opens(tap, [pageId])).length;
    if (!whole && layers === 0) continue;
    const name = typeof document.name === "string" && document.name.trim() !== "" ? document.name : "A complication";
    found.push({ id: record.id, name, whole, layers });
  }
  return found;
}

/** Take the page out of one holder: its page pair goes, and an "open a
 * page" action becomes no action, as a design imported without its pages
 * is cleaned (`transfer.ts`). */
function withoutPage(holder: JsonObject, actionKey: "tapAction" | "action"): JsonObject {
  const { openPageId: _id, openPageName: _name, ...rest } = holder;
  const action = rest[actionKey];
  if (isJsonObject(action) && action.type === "openPage") rest[actionKey] = { type: "none" };
  return rest;
}

/** A complication document with every tap that opens one of `pageIds` made
 * a tap that does nothing, or undefined when nothing in it opens them. */
export function clearPageFromComplication(document: JsonObject, pageIds: readonly string[]): JsonObject | undefined {
  let changed = false;
  let next: JsonObject = document;
  if (opens(document, pageIds)) {
    next = withoutPage(document, "tapAction");
    changed = true;
  }
  if (Array.isArray(document.elements)) {
    const elements = document.elements.map((el) => {
      if (!isJsonObject(el) || el.kind !== "tap" || !isJsonObject(el.payload) || !opens(el.payload, pageIds)) return el;
      changed = true;
      return { ...el, payload: withoutPage(el.payload, "action") };
    });
    if (changed) next = { ...next, elements };
  }
  return changed ? next : undefined;
}

/** The page ids `before` lists that `after` does not: the pages a save
 * deletes. */
export function deletedPageIds(before: readonly { id?: unknown }[], after: readonly { id?: unknown }[]): string[] {
  return before
    .map((page) => page.id)
    .filter((id): id is string => typeof id === "string" && id !== "")
    .filter((id) => !after.some((page) => sameWatchId(page.id, id)));
}
