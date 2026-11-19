// What a row action marker (`[tap:ACTION VALUE]`) does, in plain words, for
// the code box's tap gutter and the tile picture's row highlight. The reading
// follows the app's `TemplateRowTap.parse` (`Shared/TemplateRichText.swift`)
// and "Round 4" of the app repo's `docs/template_tile_links_2026-11.md`:
// ACTION is the first word after `tap:` (any case), VALUE the rest, trimmed,
// and the first marker on a line that reads is the row's action.
//
// A value written with `{{ }}` is only known once Home Assistant renders it,
// so it is taken as it is and never judged.
//
// No DOM here.

import { templateRows } from "./template-rows.js";
import type { AlignedRow, SourceScan } from "./template-source.js";
import type { TemplateTapAction, TemplateTapNames } from "./template-taps.js";

/** A marker read: whether it makes a row action, and what it does or what
 * is wrong with it, in one short sentence. */
export interface RowTapReading {
  ok: boolean;
  action?: TemplateTapAction;
  text: string;
}

const ENTITY_ID = /^[a-z_]+\.[a-z0-9_]+$/;
const NUMBER = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/;
const TEMPLATED = /\{\{|\{%/;

/** `LAT,LON` or `LAT,LON,NAME`, as `TemplateTileLink.parse(kind: "map")`. */
export function templateTapPlace(value: string): { lat: number; lon: number; name?: string } | undefined {
  const parts = value.trim().split(",");
  if (parts.length < 2) return undefined;
  const lat = parts[0]!.trim(), lon = parts[1]!.trim();
  if (!NUMBER.test(lat) || !NUMBER.test(lon)) return undefined;
  const la = Number(lat), lo = Number(lon);
  if (Math.abs(la) > 90 || Math.abs(lo) > 180) return undefined;
  const name = parts.slice(2).join(",").trim();
  return name === "" ? { lat: la, lon: lo } : { lat: la, lon: lo, name };
}

/** An http or https address with a host, as `TemplateTileLink.parse(kind:
 * "link")`. */
export function templateTapWebAddress(value: string): boolean {
  if (/\s/.test(value.trim())) return false;
  try {
    const url = new URL(value.trim());
    return (url.protocol === "http:" || url.protocol === "https:") && url.hostname !== "";
  } catch {
    return false;
  }
}

const ok = (action: TemplateTapAction, does: string): RowTapReading => ({ ok: true, action, text: `A tap on this row ${does}.` });
const bad = (text: string, action?: TemplateTapAction): RowTapReading => (action === undefined ? { ok: false, text } : { ok: false, action, text });

/** The page or HTTP action a value names: by id, else by name, any case.
 * Undefined when the list is empty (not loaded) or nothing matches. */
function named<T extends { id: string; name: string }>(value: string, items: readonly T[], plain: (item: T) => string): T | null | undefined {
  if (items.length === 0) return undefined;
  const lower = value.toLowerCase();
  return items.find((i) => i.id.toLowerCase() === lower) ?? items.find((i) => plain(i).trim().toLowerCase() === lower) ?? null;
}

/**
 * What a marker's body (the text after `tap:`, before `]`) does. `names`,
 * when given, says whether a page or HTTP action of that name exists.
 */
export function describeTemplateTap(body: string, names?: TemplateTapNames): RowTapReading {
  const trimmed = body.trim();
  const written = trimmed.match(/^\S*/)![0];
  const word = written.toLowerCase();
  const value = trimmed.slice(written.length).trim();
  const templated = TEMPLATED.test(value);
  if (word === "") return bad("This tap has no action.");
  if (TEMPLATED.test(written)) return { ok: true, text: "A tap on this row runs the action the template writes." };
  switch (word) {
    case "refresh": return ok("refresh", "refreshes the tile");
    case "maps": {
      if (value === "") return bad("This tap has no place.", "maps");
      if (templated) return ok("maps", `opens Maps at ${value}`);
      if (ENTITY_ID.test(value)) return ok("maps", `opens ${value} in Maps`);
      const place = templateTapPlace(value);
      if (place === undefined) return bad("This place does not read. Write LAT,LON or an entity id.", "maps");
      const at = `${place.lat},${place.lon}`;
      return ok("maps", place.name === undefined ? `opens Maps at ${at}` : `opens Maps at ${place.name} (${at})`);
    }
    case "link": {
      if (value === "") return bad("This tap has no web address.", "link");
      if (!templated && !templateTapWebAddress(value)) return bad("This web address does not read. It needs http or https.", "link");
      return ok("link", `opens ${value} on iPhone`);
    }
    case "service": {
      const words = value.split(/\s+/).filter((w) => w !== "");
      const service = words[0];
      if (service === undefined) return bad("This tap has no service.", "service");
      if (!templated && !service.includes(".")) return bad("Write the service as domain.service, like light.turn_on.", "service");
      return ok("service", words.length > 1 ? `calls ${service} on ${words[1]}` : `calls ${service}`);
    }
    case "page": {
      if (value === "") return bad("This tap has no page.", "page");
      const page = templated ? undefined : named(value, names?.pages ?? [], (p) => p.name);
      if (page === null) return bad(`No page is called ${value}.`, "page");
      return ok("page", `opens the page ${page?.name.trim() || value}`);
    }
    case "http": {
      if (value === "") return bad("This tap has no HTTP action.", "http");
      const action = templated ? undefined : named(value, names?.httpActions ?? [], (a) => a.plain ?? a.name);
      if (action === null) return bad(`No HTTP action is called ${value}.`, "http");
      return ok("http", `runs the HTTP action ${(action?.plain ?? action?.name)?.trim() || value}`);
    }
    case "toggle": return value === "" ? bad("This tap has no entity.", "toggle") : ok("toggle", `toggles ${value}`);
    case "script": return value === "" ? bad("This tap has no script.", "script") : ok("script", `runs ${value}`);
    case "scene": return value === "" ? bad("This tap has no scene.", "scene") : ok("scene", `turns on ${value}`);
    case "control": return value === "" ? bad("This tap has no entity.", "control") : ok("control", `opens the controls for ${value}`);
    default: return bad(`Unknown tap action: ${written}`);
  }
}

/** One `[tap:` marker in the source. */
export interface SourceTap {
  from: number;
  to: number;
  /** Its row in the scan. */
  row: number;
  reading: RowTapReading;
  /** Inside a `{% for %}`: every row the loop makes gets it. */
  loop: boolean;
  /** An earlier marker on its row reads, so this one does nothing. */
  later: boolean;
}

/** Every `[tap:` marker in the scan, in order. */
export function templateSourceTaps(scan: SourceScan, names?: TemplateTapNames): SourceTap[] {
  const out: SourceTap[] = [];
  let loops = 0;
  scan.rows.forEach((row, index) => {
    let won = false;
    for (const token of row.tokens) {
      if (token.kind !== "logic") continue;
      if (/^\{%-?\s*for\b/.test(token.src)) { loops++; continue; }
      if (/^\{%-?\s*endfor\b/.test(token.src)) { loops = Math.max(0, loops - 1); continue; }
      if (!token.src.startsWith("[tap:")) continue;
      const reading = describeTemplateTap(token.src.slice(5, -1), names);
      out.push({ from: token.from, to: token.to, row: index, reading, loop: loops > 0, later: won });
      if (reading.ok) won = true;
    }
  });
  return out;
}

/** The lines of a marker's tooltip: what it does, then its notes. */
export function templateTapNotes(tap: SourceTap): string[] {
  return [
    tap.reading.text,
    ...(tap.later ? ["Only the first tap on a line counts."] : []),
    ...(tap.loop ? ["Each row the loop makes gets this tap."] : []),
  ];
}

/** A marker as written, as a test of a rendered marker: the words it
 * writes stay, and each `{{ }}` or `{% %}` can be anything without a `]`. */
function markerPattern(src: string): RegExp {
  const pieces = src.split(/(\{\{[\s\S]*?\}\}|\{%[\s\S]*?%\}|\{#[\s\S]*?#\})/);
  const body = pieces.map((piece, i) => {
    if (i % 2 === 1) return piece.startsWith("{#") ? "" : "[^\\]]*?";
    return piece.split(/\s+/).map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("\\s*");
  }).join("");
  return new RegExp(`^${body}$`);
}

/**
 * Which rendered rows (indexes of `templateRows`) a source row's marker
 * lands on. Exact when the source and the tile line up (`aligned`). Else
 * each rendered row's markers are matched to the source's: a row counts when
 * it matches this source row's markers and no other row's. Empty when it
 * cannot be told.
 */
export function templateTapDrawnRows(scan: SourceScan, sourceRow: number, rendered: string, aligned: readonly AlignedRow[] | undefined): number[] {
  if (aligned !== undefined) {
    const at = aligned.findIndex((r) => r.row === sourceRow);
    return at < 0 ? [] : [at];
  }
  const patterns = new Map<number, RegExp[]>();
  scan.rows.forEach((row, index) => {
    const own = row.tokens.filter((t) => t.kind === "logic" && t.src.startsWith("[tap:")).map((t) => markerPattern(t.src));
    if (own.length > 0) patterns.set(index, own);
  });
  if (!patterns.has(sourceRow)) return [];
  const lines = rendered.split("\n").filter((line) => templateRows(line).length > 0);
  const out: number[] = [];
  lines.forEach((line, index) => {
    const markers = line.match(/\[tap:[^\]]*\]/g) ?? [];
    if (markers.length === 0) return;
    const hits = [...patterns].filter(([, list]) => list.some((p) => markers.some((m) => p.test(m)))).map(([row]) => row);
    if (hits.length === 1 && hits[0] === sourceRow) out.push(index);
  });
  return out;
}
