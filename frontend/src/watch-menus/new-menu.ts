// New menu on the Menus tab: a fresh menu in the library, the app's own
// Anywhere menu or Entity quick menu (`menu-defaults.json`), used by one
// device from now on.
//
// Home Assistant makes a menu only as a copy (`library/menus/copy`: the
// device's menu for the unit, under a new name, which the device then uses).
// So New menu is that copy, then one save of that device's menus record with
// the unit's sections set back to the app's own, which Home Assistant maps
// back onto the new menu, the one the device now uses. The save keeps every
// other key as read, `linkIds` included, and it is made only on a record
// read after the copy that names no other menu for the unit: a `linkIds`
// mark naming another menu would move the device back onto it.

import type { WatchConfigRecord } from "../ha-api.js";
import type { MenuUnit } from "../library/client.js";
import { sameId } from "../library/model.js";
import { watchCommandError } from "../watch-pages/save-note.js";
import { type MenusDocument, asWatchMenusDocument, watchMenusDefaults } from "./model.js";

/** The sections that make up each unit's menu. */
export const UNIT_SECTIONS: Readonly<Record<MenuUnit, readonly string[]>> = {
  anywhere: ["quickAction", "pageSwitcher"],
  entity: ["entityRadial"],
};

/** A device's menus document with the unit's sections set to the app's
 * own; every other key stays as it was. */
export function freshUnitDocument(document: MenusDocument, unit: MenuUnit, defaults: MenusDocument = watchMenusDefaults()): MenusDocument {
  const next: MenusDocument = { ...document };
  for (const section of UNIT_SECTIONS[unit]) {
    if (Object.hasOwn(defaults, section)) next[section] = structuredClone(defaults[section]);
    else delete next[section];
  }
  return next;
}

/** The menu id the record marks for the unit, if any (step 1 of the plan
 * still writes these on a menu two devices use). Read only to keep a save
 * from naming another menu. */
function markedMenu(document: MenusDocument, unit: MenuUnit): string | undefined {
  const marks = document.linkIds;
  if (typeof marks !== "object" || marks === null || Array.isArray(marks)) return undefined;
  const id = (marks as Record<string, unknown>)[unit];
  return typeof id === "string" && id !== "" ? id : undefined;
}

/** The calls the reset makes. */
export interface MenusRecordIO {
  read(ownerId: string): Promise<Pick<WatchConfigRecord, "revision" | "document">>;
  save(ownerId: string, baseRevision: number, document: MenusDocument): Promise<{ revision: number }>;
}

export type ResetResult = { ok: true } | { ok: false; code: string; message: string };

/** The most times the reset is sent before conflicts end it. */
export const RESET_ATTEMPTS = 3;

/**
 * Set a device's new menu back to the app's own: read its menus record, and
 * unless it is older than the copy (`after`, the revision the copy wrote) or
 * marks another menu for the unit, save it with the unit's sections fresh,
 * over the revision read; on a conflict read again.
 */
export async function resetMenuUnit(io: MenusRecordIO, ownerId: string, unit: MenuUnit, menuId: string, after = 0): Promise<ResetResult> {
  for (let attempt = 1; ; attempt++) {
    let record: Pick<WatchConfigRecord, "revision" | "document">;
    try {
      record = await io.read(ownerId);
    } catch (err) {
      const { code = "unknown", message } = watchCommandError(err);
      return { ok: false, code, message };
    }
    const doc = record.revision > 0 ? asWatchMenusDocument(record.document) : undefined;
    if (doc === undefined || record.revision < after) return { ok: false, code: "stale", message: "The device's menus were not read after the copy." };
    const marked = markedMenu(doc, unit);
    if (marked !== undefined && !sameId(marked, menuId)) return { ok: false, code: "moved", message: "The device uses another menu now." };
    try {
      await io.save(ownerId, record.revision, freshUnitDocument(doc, unit));
      return { ok: true };
    } catch (err) {
      const { code = "unknown", message } = watchCommandError(err);
      if (code !== "conflict" || attempt >= RESET_ATTEMPTS) return { ok: false, code, message };
    }
  }
}
