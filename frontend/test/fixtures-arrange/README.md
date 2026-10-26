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
  "state": {"hidden": true}}}
```

- Parts: `icon` (the glyph; the icon glow and a person's photo travel with
  it), `name` and `state`. Each is optional; a part that is not listed sits
  in its native place.
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
state's box), and the part's entry.

1. Scaled size: S = (R.width * scale, R.height * scale). The name is the one
   exception: its box keeps its native width, only its height (its font)
   scales, so S = (R.width, R.height * scale).
2. With a spot, anchor the scaled rect to C. Column l puts its left edge at
   C's left, c centres it on C's middle across, r puts its right edge at C's
   right. Row t puts its top at C's top, m centres it on C's middle down, b
   puts its bottom at C's bottom. Without a spot, keep the scaled rect
   centred on R's centre.
3. Then move it by (dx * T.width, dy * T.height).
4. Hidden: the part is not drawn. Nothing else moves.
5. The name's text alignment: with a spot, its column sets it (l leading,
   c centre, r trailing); without one it keeps its native alignment, which
   in the centred layout is centre.

The icon's glow is centred on the icon's rect and scales with it; a
person's photo fills the icon's rect. The accessory button (play or pause,
the fan) is not a part and never moves.

Free is offered only for tiles drawn in the centred layout. A tile whose
picture fills it (a camera showing its picture, album art), a chart, and a
stacked or strip tile ignore the key and draw every part as Default.

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

The rects in `native` come from the panel's layout, which measures text with
its own estimate; an app's layout measures with real fonts and lands
elsewhere. So an app checks the math from the file's own `size`, `content`
and `native` against `expected`, never its own layout's rects. Numbers are
rounded to 4 decimals; compare within 0.001.

## The files

| File | Covers |
| --- | --- |
| `spots-top-row.json` | The top row of spots (icon `tl`, name `tc`, state `tr`) on a lit light, watch. |
| `spots-middle-row.json` | The middle row (icon `mr`, name `ml` leading, state `mc`) on a switch, watch. |
| `spots-bottom-row-iphone.json` | The bottom row (icon `bc`, name `br` trailing, state `bl`) on a sensor, iPhone. |
| `drag-offset.json` | A drag: the icon moved from its native place, the name moved from a spot; the state not listed. |
| `scale-up-down-iphone.json` | Sizes: icon 150% about its centre, name 120% (native width kept), state 80% in a spot, iPhone. |
| `hidden-parts.json` | Name and state hidden, icon 120% in the middle; hidden parts keep their rects. |
| `person-photo.json` | A person's photo as the icon part, in a spot at 80% with a nudge. |
| `ignored-camera-picture.json` | A camera showing its picture: the key is ignored. |
| `ignored-strip.json` | A tile under 4 rows (a strip): the key is ignored. |

To rewrite the computed fields after changing a file's inputs or the
panel's layout: `WA_WRITE_ARRANGE_FIXTURES=1 npx vitest run
test/arrange-fixtures.test.ts` in the panel's `frontend`, then read the diff.
