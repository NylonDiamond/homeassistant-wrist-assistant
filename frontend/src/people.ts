// A household read as people rather than as a pile of devices.
//
// The store knows only owners: four ids, each with a name the device reported.
// A list of them reads "Apple Watch, Apple Watch, iPhone, iPhone" in a home
// with two of each, which is no help at all when the question is which boxes to
// tick. People are what the owner actually has: Jesse with a phone and a watch,
// Chen with a phone and a watch, and a checkbox row that says so.
//
// The join is `paired_iphone_id`: the watch app tells the integration which
// phone provisioned it, and the owners reply passes the id along. Matching on
// `paired_iphone_name` is the fallback for an integration older than that
// field, and only the fallback, because two phones in one home are very often
// called the same thing.
//
// Everything here is pure, so the checkbox row can be read in a test without a
// browser. Plan: app repo docs/complication_one_shape_per_document.md.

import type { OwnerSummary } from "./ha-api.js";
import { deviceKindOf, isLibraryOwner } from "./version.js";

/** One member of the household, with the devices that are theirs. The phone
 * comes first in `owners`, then the watches paired to it. */
export interface Person {
  /** The phone's owner id, or a lone watch's own. Stable across re-renders and
   * unique in the home, so it keys a checkbox row. */
  key: string;
  /** What to call this person in a list: the phone's name, because "Jesse's
   * iPhone" is how the phone names its owner. No "(iPhone)" suffix; the group
   * is a person, and the devices under it say what they are. */
  label: string;
  owners: OwnerSummary[];
}

/** Watches before phones, each block left in the order the server gave it.
 *
 * The same order as the panel's `ownersByKind`, spelled again here rather than
 * imported: panel.ts is the whole editor, and a pure module that the editor
 * imports cannot import it back. The server sorts its reply this way too, so
 * this only has to hold a mixed reply together. */
function byKind(owners: readonly OwnerSummary[]): OwnerSummary[] {
  return [
    ...owners.filter((o) => deviceKindOf(o) !== "iphone"),
    ...owners.filter((o) => deviceKindOf(o) === "iphone"),
  ];
}

function nameOf(owner: OwnerSummary): string {
  return owner.device_name ?? owner.owner_watch_id;
}

/**
 * Which person a watch belongs to, as a group key.
 *
 * A phone heads its own group. A watch joins the phone it names, by id where
 * the integration sends one and by name only where it does not: an old
 * integration sends no id at all, and a watch whose id names a phone this home
 * no longer has is on its own rather than quietly attached to whichever phone
 * happens to share the missing one's name.
 */
function groupKey(owner: OwnerSummary, phones: readonly OwnerSummary[]): string {
  if (deviceKindOf(owner) === "iphone") return owner.owner_watch_id;
  const pairedId = owner.paired_iphone_id;
  if (pairedId !== undefined && pairedId !== null && pairedId !== "") {
    return phones.some((p) => p.owner_watch_id === pairedId) ? pairedId : owner.owner_watch_id;
  }
  const named = owner.paired_iphone_name;
  if (named) {
    const match = phones.find((p) => p.device_name === named);
    if (match) return match.owner_watch_id;
  }
  return owner.owner_watch_id;
}

/**
 * The household, in the order a list draws it.
 *
 * Orphans are left out entirely. They belong to nobody by definition (the
 * entry that would have said which phone is the one that went missing) and
 * nothing can be saved to one, so an orphan in a list of devices to tick is a
 * box that cannot be ticked.
 *
 * The Library is left out for the opposite reason. It belongs to nobody
 * because it belongs to the whole home: it is the one place a design can sit
 * that is not somebody's device, so filing it under a person would say the
 * wrong thing about every other person in the house. The panel draws it as its
 * own row beside the people, which is what `libraryOwner` is for.
 *
 * A group takes the position of its first member, which with watches sorted
 * first means a person is listed where their watch is. Inside the group the
 * phone comes first anyway, because that is the order a person reads their own
 * devices in.
 */
export function peopleOf(owners: readonly OwnerSummary[]): Person[] {
  const real = byKind(owners).filter((o) => !o.is_orphan && !isLibraryOwner(o));
  const phones = real.filter((o) => deviceKindOf(o) === "iphone");
  const groups = new Map<string, OwnerSummary[]>();
  for (const owner of real) {
    const key = groupKey(owner, phones);
    const group = groups.get(key) ?? [];
    group.push(owner);
    groups.set(key, group);
  }
  return [...groups].map(([key, group]) => {
    const phone = group.find((o) => deviceKindOf(o) === "iphone");
    const watches = group.filter((o) => deviceKindOf(o) !== "iphone");
    const head = phone ?? watches[0]!;
    return { key, label: nameOf(head), owners: phone ? [phone, ...watches] : watches };
  });
}

/** Whose device this is, or nobody's: an id that is not in the home, an
 * orphan's, or the Library's, all of which `peopleOf` left out. */
export function personOf(people: readonly Person[], ownerId: string): Person | undefined {
  return people.find((p) => p.owners.some((o) => o.owner_watch_id === ownerId));
}

/** The home's Library row, when the integration sends one.
 *
 * Undefined against an integration older than the Library, which is the
 * panel's cue to draw no shelf at all rather than to invent one: the owner
 * only exists if the server knows the reserved id.
 */
export function libraryOwner(owners: readonly OwnerSummary[]): OwnerSummary | undefined {
  return owners.find((o) => isLibraryOwner(o));
}

/**
 * The people these devices belong to, each named once, in the order the list
 * draws them.
 *
 * What a summary line under a ticked checkbox row reads: two devices of one
 * person are that person, not two entries of the same name. An id nobody owns
 * is ignored rather than named as unknown, because the only thing that
 * produces one is a device that has just left the home.
 */
export function peopleNames(people: readonly Person[], ownerIds: readonly string[]): string[] {
  const want = new Set(ownerIds);
  return people.filter((p) => p.owners.some((o) => want.has(o.owner_watch_id))).map((p) => p.label);
}

/**
 * What to call one device inside its person's group.
 *
 * A group headed "Jesse's iPhone" listing "Jesse's iPhone" and "Apple Watch"
 * says the name twice and the useful word once. So a phone whose name is
 * already the heading is simply "iPhone" there. Only when the group has a
 * watch to list beside it: a person with a phone and nothing else needs the
 * real name, since there is no heading above it doing the work.
 */
export function deviceShortName(owner: OwnerSummary, person: Person): string {
  const name = nameOf(owner);
  if (deviceKindOf(owner) !== "iphone") return name;
  const hasWatch = person.owners.some((o) => deviceKindOf(o) !== "iphone");
  return hasWatch && name === person.label ? "iPhone" : name;
}
