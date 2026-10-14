// Material Design icons in rich text icon parts.
//
// The watch has no MDI catalogue, so an icon layer carries the drawing of the
// `mdi:` icon it was picked with. An icon part cannot do that with one key: a
// template picks its name on the watch, long after the editor is gone. So the
// part carries the drawing of every `mdi:` name it could pick, found where the
// author wrote them out: in the part's icon value (typed, or a template's
// source) and in the icon changes of rules aimed at the part. A name built at
// run time (`'mdi:water-' ~ level`) is not written out and draws nothing.

import { MDI_PREFIX } from "./symbols.js";
import type { CustomComplicationConfig, Element, NamedValue, TextPart, Value } from "./model.js";

/** How many drawings one part keeps. A template that names more than this
 * is a list of names, not a choice of icon, and each drawing is up to a few
 * hundred bytes on the wire. The first names written win. */
export const PART_ICON_PATHS_MAX = 16;

/** An `mdi:` name as MDI spells them: lowercase words joined by hyphens. A
 * name that runs on into a hyphen is the start of one built at run time
 * (`'mdi:water-' ~ level`), not a name, so it does not match. */
const MDI_NAME = /mdi:[a-z0-9]+(?:-[a-z0-9]+)*(?![-a-z0-9])/g;

/** The `mdi:` names a value writes out, in the order written. A shared value
 * is followed to what it holds, once. */
export function mdiNamesIn(v: Value, values: readonly NamedValue[], seen = new Set<string>()): string[] {
  const k = v.kind;
  if (k.kind === "literal") {
    const name = k.value.trim();
    return name.startsWith(MDI_PREFIX) ? [name] : [];
  }
  if (k.kind === "jinja") return k.value.match(MDI_NAME) ?? [];
  if (k.kind === "named") {
    const id = k.id.toUpperCase();
    if (seen.has(id)) return [];
    seen.add(id);
    const named = values.find((n) => n.id.toUpperCase() === id);
    return named ? mdiNamesIn(named.value, values, seen) : [];
  }
  return [];
}

/** Every `mdi:` name an icon part can draw: its own value's, then those of the
 * icon changes aimed at it. Each name once. */
function partMdiNames(part: TextPart, rules: Element["payload"]["rules"], values: readonly NamedValue[]): string[] {
  const names: string[] = [];
  if (part.icon) names.push(...mdiNamesIn(part.icon, values));
  for (const rule of rules) {
    if (rule.partId !== part.id) continue;
    const changes = [...rule.cases.flatMap((c) => c.then), ...(rule.otherwise ?? [])];
    for (const ch of changes) {
      if (ch.kind === "setIcon" && ch.value) names.push(...mdiNamesIn(ch.value, values));
    }
  }
  return [...new Set(names)];
}

/** Every text layer, a list's row layers included. */
function forEachTextLayer(elements: readonly Element[], fn: (el: Extract<Element, { kind: "text" }>) => void): void {
  for (const el of elements) {
    if (el.kind === "text") fn(el);
    else if (el.kind === "list") forEachTextLayer(el.payload.template, fn);
  }
}

/**
 * Put each icon part's `iconPaths` in step with the names it can draw.
 *
 * `mdiPath` answers from the catalogue, and undefined both for a name it does
 * not hold and for every name while it is still loading. So a drawing already
 * carried is kept when the lookup has none: a document opened before the
 * catalogue arrives keeps what it was saved with. A name nothing can draw
 * (a typo, or the catalogue not loaded yet) is simply not carried, and the
 * part draws nothing for it, as the watch would.
 *
 * Changes the document only where a part's drawings differ, and returns
 * whether it did.
 */
export function syncPartIconPaths(cfg: CustomComplicationConfig, mdiPath: (name: string) => string | undefined): boolean {
  let changed = false;
  forEachTextLayer(cfg.elements, (el) => {
    for (const part of el.payload.parts ?? []) {
      const before = part.iconPaths ?? {};
      const next: Record<string, string> = {};
      if (part.icon !== undefined) {
        for (const name of partMdiNames(part, el.payload.rules, cfg.values)) {
          if (Object.keys(next).length >= PART_ICON_PATHS_MAX) break;
          const d = mdiPath(name) ?? before[name];
          if (d !== undefined && d !== "") next[name] = d;
        }
      }
      const same = Object.keys(next).length === Object.keys(before).length
        && Object.entries(next).every(([n, d]) => before[n] === d);
      if (same) continue;
      changed = true;
      if (Object.keys(next).length > 0) part.iconPaths = next;
      else delete part.iconPaths;
    }
  });
  return changed;
}

/** Whether any icon part names an `mdi:` icon, so the catalogue is worth
 * loading before a save. */
export function documentNamesPartMdi(cfg: CustomComplicationConfig): boolean {
  let found = false;
  forEachTextLayer(cfg.elements, (el) => {
    for (const part of el.payload.parts ?? []) {
      if (part.icon !== undefined && partMdiNames(part, el.payload.rules, cfg.values).length > 0) found = true;
    }
  });
  return found;
}
