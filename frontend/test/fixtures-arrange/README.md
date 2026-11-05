# Arrangement fixtures

Shared between the Home Assistant panel and the iPhone and watch apps. The
panel's copy (`frontend/test/fixtures-arrange/` in the integration repo) is
written by its test; the app copies the folder byte for byte. Each file is
one tile with its `arrange` key and where each part lands.

## The key

A tile key, absent means Default (every part in its native place):

```json
"arrange": {"v": 1, "parts": {
  "icon":  {"spot": "tr", "dx": 0, "dy": 0, "scale": 1.2, "hidden": false},
  "name":  {"spot": "bl"},
  "state": {"hidden": true},
  "bar":   {"spot": "bc"},
  "button": {"spot": "bl"}}}
```

- Parts: `icon` (the glyph; the icon glow and a person's photo travel with
  it), `name`, `state`, `bar` (the brightness or level bar across the top) and
  `button` (the round play or pause, or fan, button; its touch area goes with
  it). Each is optional; a part that is not listed sits in its native place.
  A build that does not know `bar` or `button` ignores them.
- `spot`: one of `tl tc tr ml mc mr bl bc br` (row top, middle, bottom, then
  column left, centre, right), or absent for the native place.
- `dx`, `dy`: a move as a share of the tile's width and height, -0.5 to 0.5.
- `scale`: 0.8 to 1.5, default 1. For text it scales the font, for the icon
  its glyph box.
- `hidden`: true hides the part.
- Read tolerantly: an unknown spot is dropped, numbers are clamped to their
  range, a version other than 1 reads as Default. Written sparsely: defaults
  left out, a part with no change dropped, the whole key dropped when no
  part has a change.

## The math

Inputs: the drawn tile T (its width and height), the content box C (the tile
less the native inset the centred layout already uses: `insetH` at the left
and right, `insetV` at the top and bottom), a part's native rect R (where
the centred layout put it: the glyph's box, the name's text block, the
state's box, the bar's track, the button's circle), and the part's entry.

1. Scaled size: S = (R.width * scale, R.height * scale). The name is the one
   exception: its box keeps its native width, only its height (its font)
   scales, so S = (R.width, R.height * scale).
2. With a spot, anchor the scaled rect to C. Column l puts its left edge at
   C's left, c centres it on C's middle across, r puts its right edge at C's
   right. Row t puts its top at C's top, m centres it on C's middle down, b
   puts its bottom at C's bottom. Without a spot, keep the scaled rect
   centred on R's centre.
3. Then move it by (dx * T.width, dy * T.height).
4. Hold text a little past T's edge: at most one grid cell, where the grid is
   T cut in 12 columns and 8 rows, and at most half of itself, so it never
   leaves the tile. over X = min(T.width / 12, S.width / 2), over Y =
   min(T.height / 8, S.height / 2). For the name and the state, y = max(-over Y, min(y, T.height - S.height + over Y)).
   For the state also x = max(-over X, min(x, T.width - S.width + over X)). The
   name is free across, as its box is nearly T's width whatever the name's
   length. The icon, the bar and the button are not held: they may hang over,
   and the tile's shape cuts what does. See `text-stays-inside.json` and
   `bar-moved.json`.
5. Hidden: the part is not drawn. Nothing else moves.
6. The name's text alignment: with a spot, its column sets it (l leading,
   c centre, r trailing); without one it keeps its native alignment, which
   in the centred layout is centre.

The icon's glow is centred on the icon's rect and scales with it; a
person's photo fills the icon's rect. A LIVE chip is not a part and never
moves.

Free is offered only for tiles drawn in the centred layout. A tile whose
picture fills it (a camera showing its picture, album art), a chart, and a
stacked or strip tile ignore the key and draw every part as Default.

One case changes the layout itself. A tile under 4 rows whose key hides the
name and the state, and not the icon, is laid out with no name and no state.
That draws only an icon, in the centred layout, and the key then places the
icon. See `short-icon-only.json`.

## A file

| Key | What it is |
| --- | --- |
| `name`, `about` | The file's name and what it covers. |
| `device` | `watch` or `iphone` (the iPhone look). |
| `tile`, `states` | The tile as stored, without its `arrange`, and the Home Assistant states the panel drew it with. |
| `cell`, `unit` | The tile's grid cell and the grid unit, in points, on the panel's reference screen. |
| `size` | T: the drawn tile, its cell less the cell inset. |
| `applies` | Whether the tile is drawn in the centred layout, so its key is used. |
| `content` | C (only when `applies`). |
| `native` | R for each part the tile draws (only when `applies`). |
| `arrange` | The key. |
| `expected` | For each part in `native`: its `rect`, the `scale` it is drawn at, `hidden`, and for the name its `align` (only when `applies`). |

The rects in `native` come from the panel's layout. Names, states and
numbers are in the tile font, Inter, on both devices, and the panel measures
them from Inter's own advances and kerning, as the apps' CoreText does, so an
app's layout lands on the same rects. A chosen rounded, monospaced or serif
design is still the panel's estimate there. So an app checks the math from the file's own `size`, `content`
and `native` against `expected`, never its own layout's rects. Numbers are
rounded to 4 decimals; compare within 0.001.

## The files

| File | Covers |
| --- | --- |
| `spots-top-row.json` | The top row of spots (icon `tl`, name `tc`, state `tr`) on a lit light, watch. |
| `spots-middle-row.json` | The middle row (icon `mr`, name `ml` leading, state `mc`) on a switch, watch. |
| `spots-bottom-row-iphone.json` | The bottom row (icon `bc`, name `br` trailing, state `bl`) on a sensor, iPhone. |
| `drag-offset.json` | A drag: the icon moved from its native place, the name moved from a spot; the state not listed. |
| `short-icon-only.json` | A short light whose key hides its name and state: laid out as only an icon, centred. |
| `text-stays-inside.json` | Moved past the edges: the name is held a little past the bottom, the state a little past the top and left, the icon hangs over. |
| `bar-moved.json` | A lit light's bar at the bottom at 80%, hanging over the edge. |
| `scale-up-down-iphone.json` | Sizes: icon 150% about its centre, name 120% (native width kept), state 80% in a spot, iPhone. |
| `hidden-parts.json` | Name and state hidden, icon 120% in the middle; hidden parts keep their rects. |
| `person-photo.json` | A person's photo as the icon part, in a spot at 80% with a nudge. |
| `ignored-camera-picture.json` | A camera showing its picture: the key is ignored. |
| `ignored-strip.json` | A tile under 4 rows (a strip): the key is ignored. |

To rewrite the computed fields after changing a file's inputs or the
panel's layout: `WA_WRITE_ARRANGE_FIXTURES=1 npx vitest run
test/arrange-fixtures.test.ts` in the panel's `frontend`, then read the diff.

## Which tiles draw the key

The centred layout places the parts. On the watch a tile only has that layout
when it fits, so a smaller tile ignores the key (`ignored-strip.json`), unless
the key hides its name and state (`short-icon-only.json`). On the iPhone a tile
with the key always takes the centred layout, whatever its size, and keeps it
when its parts do not fit: the person placed them and sees them. Its glyph then
stands at the centred layout's tiny floor (`small-tile-iphone.json`).
