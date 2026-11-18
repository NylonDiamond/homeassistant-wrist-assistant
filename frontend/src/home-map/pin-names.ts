// What the map editor writes beside each pin on its plan, and where, so a
// pin can be told from the next without hovering it or picking it.
//
// Each pin has a short name (`homeMapPinShortNames`): its name with its
// room's name taken off the front ("Jesse Office Lamps" in Jesse Office is
// "Lamps"), and among the pins of one kind in one room, the words they all
// share at the start and the end ("Eight Sleep - Chen Temperature" and
// "Eight Sleep - Jesse Temperature" are "Chen" and "Jesse"), cut to 18
// letters.
//
// Its pill (`homeMapPinPillWords`) is the reading it shows (78°), with its
// short name in front when another pin of its room shows the same kind of
// reading ("Chen 78°"); with no reading and Names on, its short name. A
// pill with a reading, a pinned name or a picked pin is always shown; a
// short name only where it is clear (`homeMapPlacePinPills`): under its pin,
// else over it, to its right or its left, off every pin, the pills placed
// before it and the rooms' names. A name with no clear spot is left out, so
// a plan zoomed out far shows fewer names, and none once the pins crowd.

import { homePolygonHolds } from "./geometry.js";
import { type HomeMapFloor, type HomeMapPin, type HomePoint, homeMapPinRoom, homeMapRoomName } from "./model.js";

/** The longest short name, in letters, an ellipsis included. */
export const HOME_MAP_PIN_NAME_MAX = 18;

/** A pin's pill's height on the stage, in pixels. */
export const HOME_MAP_PIN_PILL_H = 16;

/** A pin's pill's width on the stage, in pixels, by its words (10 pt). */
export function homeMapPinPillWidth(text: string): number {
  return text.length * 5.9 + 14;
}

/** A word that only joins others ("Eight Sleep - Chen"). */
const JOINER = /^[-–—·|:/,]+$/;

function wordsOf(name: string): string[] {
  return name.split(/\s+/).filter((w) => w !== "" && !JOINER.test(w));
}

const same = (a: string, b: string) => a.toLowerCase().replace(/['’]/g, "") === b.toLowerCase().replace(/['’]/g, "");

/** `words` without the room's name in front, unless that is all of it. */
function offRoom(words: string[], room: string | undefined): string[] {
  if (room === undefined) return words;
  const r = wordsOf(room);
  if (r.length === 0 || words.length <= r.length) return words;
  return r.every((w, i) => same(w, words[i]!)) ? words.slice(r.length) : words;
}

/** Each list without the words every list shares at its start and its end,
 * leaving every list one word at the least. */
function offShared(lists: string[][]): string[][] {
  const shortest = Math.min(...lists.map((l) => l.length));
  let head = 0;
  while (head < shortest - 1 && lists.every((l) => same(l[head]!, lists[0]![head]!))) head += 1;
  let tail = 0;
  while (head + tail < shortest - 1 && lists.every((l) => same(l[l.length - 1 - tail]!, lists[0]![lists[0]!.length - 1 - tail]!))) tail += 1;
  return lists.map((l) => l.slice(head, l.length - tail));
}

/** Words joined, cut at a word with an ellipsis past `max` letters. */
function cut(words: string[], max = HOME_MAP_PIN_NAME_MAX): string {
  const all = words.join(" ");
  if (all.length <= max) return all;
  let out = "";
  for (const w of words) {
    const next = out === "" ? w : `${out} ${w}`;
    if (next.length > max - 1) break;
    out = next;
  }
  return `${out === "" ? all.slice(0, max - 1).trimEnd() : out}…`;
}

const domainOf = (entityId: string) => entityId.slice(0, entityId.indexOf("."));

/** The room a pin is in, as a key: its id, or "" for none. */
function roomKey(floor: HomeMapFloor, pin: HomeMapPin): string {
  return homeMapPinRoom(floor, pin)?.id ?? "";
}

/** Each pin's short name by its id (see the top of the file). `nameOf` is
 * the pin's whole name (`homeMapPinName`). */
export function homeMapPinShortNames(floor: HomeMapFloor, nameOf: (pin: HomeMapPin) => string): Map<string, string> {
  const lists = new Map<string, string[]>();
  const groups = new Map<string, HomeMapPin[]>();
  for (const pin of floor.pins) {
    const room = homeMapPinRoom(floor, pin);
    const words = wordsOf(nameOf(pin));
    lists.set(pin.id, offRoom(words, room === undefined ? undefined : homeMapRoomName(room)));
    const key = `${room?.id ?? ""}|${domainOf(pin.entityId)}`;
    groups.set(key, [...(groups.get(key) ?? []), pin]);
  }
  for (const pins of groups.values()) {
    // A light on the map twice is one name, not two to tell apart.
    const names = [...new Set(pins.map((p) => lists.get(p.id)!.join(" ")))];
    if (names.length < 2 || names.some((n) => n === "")) continue;
    const trimmed = offShared(names.map(wordsOf));
    const short = new Map(names.map((n, i) => [n, trimmed[i]!]));
    for (const p of pins) lists.set(p.id, short.get(lists.get(p.id)!.join(" "))!);
  }
  const out = new Map<string, string>();
  for (const pin of floor.pins) {
    const words = lists.get(pin.id)!;
    out.set(pin.id, words.length === 0 ? cut(wordsOf(nameOf(pin))) : cut(words));
  }
  return out;
}

/** A pin's pill: its words, and whether it is shown even where it is not
 * clear. */
export interface HomeMapPinPillWords {
  text: string;
  must: boolean;
}

/** The kind of a reading: what is left without its number (° for 78°). */
function readingKind(reading: string): string {
  return reading.replace(/[-+−]?\d[\d.,]*/g, "").trim();
}

/**
 * Each pin's pill by its id (see the top of the file): a picked pin's whole
 * name; a pin with `reading` none, none; `reading` name, its whole name;
 * one with a reading, the reading, its short name in front when another
 * device in its room shows a reading of the same kind; else, with `names`,
 * its short name, shown only where it is clear.
 */
export function homeMapPinPillWords(
  floor: HomeMapFloor,
  o: {
    nameOf: (pin: HomeMapPin) => string;
    readingOf: (pin: HomeMapPin) => string | undefined;
    picked: (pin: HomeMapPin) => boolean;
    names: boolean;
  },
): Map<string, HomeMapPinPillWords> {
  const short = homeMapPinShortNames(floor, o.nameOf);
  const readings = new Map<string, string>();
  const kinds = new Map<string, Set<string>>();
  for (const pin of floor.pins) {
    if (pin.reading === "none" || pin.reading === "name") continue;
    const reading = o.readingOf(pin);
    if (reading === undefined || reading === "") continue;
    readings.set(pin.id, reading);
    const key = `${roomKey(floor, pin)}|${readingKind(reading)}`;
    kinds.set(key, (kinds.get(key) ?? new Set()).add(pin.entityId));
  }
  const out = new Map<string, HomeMapPinPillWords>();
  for (const pin of floor.pins) {
    if (o.picked(pin) || pin.reading === "name") {
      out.set(pin.id, { text: o.nameOf(pin), must: true });
      continue;
    }
    if (pin.reading === "none") continue;
    const reading = readings.get(pin.id);
    if (reading !== undefined) {
      const twins = (kinds.get(`${roomKey(floor, pin)}|${readingKind(reading)}`)?.size ?? 0) > 1;
      out.set(pin.id, { text: twins ? `${short.get(pin.id)!} ${reading}` : reading, must: true });
      continue;
    }
    if (o.names) out.set(pin.id, { text: short.get(pin.id)!, must: false });
  }
  return out;
}

/** A box on the stage: its middle and half its width and height. */
export interface HomeMapStageBox {
  c: HomePoint;
  half: readonly [number, number];
}

/** A pin on the stage: its middle and radius, in pixels, and its room's
 * outline there, which its pill keeps inside when it can. */
export interface HomeMapStagePin {
  id: string;
  c: HomePoint;
  r: number;
  room?: readonly HomePoint[] | undefined;
}

/** The space kept round a pin and between two pills, in pixels. */
const PAD = 2;
/** The gap between a pin and its pill, in pixels. */
const GAP = 4;

function boxesMeet(a: HomeMapStageBox, b: HomeMapStageBox): boolean {
  return Math.abs(a.c[0] - b.c[0]) < a.half[0] + b.half[0] + PAD && Math.abs(a.c[1] - b.c[1]) < a.half[1] + b.half[1] + PAD;
}

function boxMeetsPin(b: HomeMapStageBox, p: HomeMapStagePin): boolean {
  const dx = Math.max(Math.abs(p.c[0] - b.c[0]) - b.half[0], 0);
  const dy = Math.max(Math.abs(p.c[1] - b.c[1]) - b.half[1], 0);
  return Math.hypot(dx, dy) < p.r + PAD;
}

/**
 * Where each pill stands, its middle in stage pixels, by its pin's id: the
 * pills that must show first, then the rest, each under its pin, else over
 * it, to its right or its left, at the first spot off every other pin, the
 * pills placed already and `avoid` (the rooms' names), inside its pin's
 * room before any spot that crosses its walls. One that must show and
 * finds no clear spot goes under its pin; any other is left out.
 */
export function homeMapPlacePinPills(
  pins: readonly HomeMapStagePin[],
  pills: ReadonlyMap<string, HomeMapPinPillWords>,
  avoid: readonly HomeMapStageBox[] = [],
): Map<string, HomePoint> {
  const placed: HomeMapStageBox[] = [];
  const out = new Map<string, HomePoint>();
  const order = [...pins.filter((p) => pills.get(p.id)?.must === true), ...pins.filter((p) => pills.get(p.id)?.must === false)];
  for (const pin of order) {
    const pill = pills.get(pin.id)!;
    const half: readonly [number, number] = [homeMapPinPillWidth(pill.text) / 2, HOME_MAP_PIN_PILL_H / 2];
    const [x, y] = pin.c;
    const dy = pin.r + GAP + half[1];
    const dx = pin.r + GAP + half[0];
    const spots: HomePoint[] = [[x, y + dy], [x, y - dy], [x + dx, y], [x - dx, y]];
    const clear = (c: HomePoint) => {
      const box = { c, half };
      return pins.every((p) => p.id === pin.id || !boxMeetsPin(box, p)) && placed.every((b) => !boxesMeet(box, b)) && avoid.every((b) => !boxesMeet(box, b));
    };
    const room = pin.room;
    const inside = (c: HomePoint) => room === undefined || room.length < 3 || [
      [c[0] - half[0], c[1] - half[1]], [c[0] + half[0], c[1] - half[1]],
      [c[0] + half[0], c[1] + half[1]], [c[0] - half[0], c[1] + half[1]],
    ].every((q) => homePolygonHolds(room, q));
    const spot = spots.find((c) => inside(c) && clear(c)) ?? spots.find(clear) ?? (pill.must ? spots[0] : undefined);
    if (spot === undefined) continue;
    placed.push({ c: spot, half });
    out.set(pin.id, spot);
  }
  return out;
}
