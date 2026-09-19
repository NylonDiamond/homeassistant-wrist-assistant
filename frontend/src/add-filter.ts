// Narrowing the Add a layer card by what the author typed.
//
// The card offers a dozen elements and two dozen presets, and in Small the
// whole lot is on screen at once. Reading twelve names to find "Door history"
// is slower than typing "door", so the header carries a search box and this is
// what it runs. The elements and the presets are filtered; Saved is not,
// because it is one button and not a list of names.
//
// Matching is by name only, on purpose. A preset's blurb is a sentence about
// what it builds ("a layer or three, already set up" sort of prose), and
// matching it made "layer" return everything. A query is split on whitespace
// and every word has to appear somewhere in the name, so "door hist" finds
// "Door history" without the author guessing the gap.
//
// Pure, and knows nothing about the panel, so the rule can be tested on its
// own rather than through a rendered card.

/** The words a query asks for, lowercased, with the empty ones dropped. */
export function addSearchTerms(query: string): readonly string[] {
  return query.toLowerCase().split(/\s+/).filter((t) => t.length > 0);
}

/** Does this name answer the query. An empty query matches everything, so the
 * unfiltered card is the same code path as the filtered one. */
export function matchesAddSearch(title: string, query: string): boolean {
  return matchesTerms(title, addSearchTerms(query));
}

/** The offers left after the query, in the order they were given. */
export function filterAddOffers<T extends { readonly title: string }>(
  items: readonly T[],
  query: string,
): readonly T[] {
  const terms = addSearchTerms(query);
  if (terms.length === 0) return items;
  return items.filter((i) => matchesTerms(i.title, terms));
}

function matchesTerms(title: string, terms: readonly string[]): boolean {
  if (terms.length === 0) return true;
  const t = title.toLowerCase();
  return terms.every((term) => t.includes(term));
}
