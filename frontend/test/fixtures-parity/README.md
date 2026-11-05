# Parity fixtures

Shared between the Home Assistant panel and the phone and watch apps. The app
copies this folder byte for byte (`WristAssistantTests/Fixtures/parity`,
`./scripts/sync-complication-fixtures.sh`).

They hold the panel's previews to the real devices on a real home's pages: every
One Look tile, on the 46 mm watch (208 by 248) and on a 393 by 852 phone in the
phone's own look, zoomed as the phone draws it (`OneLookZoom`).

## The files

- `pages.json`: the input. A watch's pages as the integration stored them on
  2026-11-05, a fixed snapshot of the states their entities had, the text each
  Show tile template rendered to, and the size of the one icon photo. It is
  made anonymous: every entity id is `domain.parity_NN`, every label, name,
  option and rendered word is made up text of the same length with a similar
  letter mix (digits, units and signs kept), a person's or tracker's place is
  home, away or a made up zone, a template's code is a stand in, and only the
  attributes a layout reads are kept.
- `tiles.json`: written by the panel (`parity-fixtures.test.ts`). Each tile the
  previews draw in One Look, by page, tile and device: its item, its grid unit,
  cell and drawn size, what it says from the panel's kind rules (name, symbol,
  state line, accessory and so on), and the panel's own layout.
- `symbols.json`: written by the panel. Every SF Symbol it ships, and every one
  these tiles name.
- `symbol-sizes.json`: written by the app. Each of those symbols as the devices
  measure a glyph (`UIFontMeasurer.glyphAspect` and `glyphExtent`), then its
  image and ink box as the device draws One Look's glyph, at the medium weight.
  The panel ships it as `symbol-sizes.json.gz` (`build-symbol-sizes.mjs`), lays
  its glyphs out by it and draws each outline stretched onto that ink box.
- `app.json`: written by the app (`OneLookParityTests`). Each tile laid out as
  the device draws it, `OneLookTileModel.kindLayout`, with its item decoded as
  the device decodes the pages document, the real Inter and the real symbol
  sizes. Every rect in the drawn tile's points: the glyph's box and ink, the
  name's box, size and lines, the state's box and size, the bar, the
  accessory, the content box, the corner radius and the arranged parts.

`parity-fixtures.test.ts` lays each tile out again through the previews' own
path and holds every number to `app.json` within half a point.

## What it does not cover

- The kind rules that turn an entity into a name, a symbol and a state line:
  the app reads the panel's, as written in `tiles.json`.
- The grid: its packing, a Fit to screen page's rows, each screen's own spans.
  The app takes the panel's unit and drawn size.
- A template tile's text fit. The app fits it with SwiftUI's own
  `minimumScaleFactor`, which has no code to compare against.

## Regenerating

After a change to `pages.json`, the panel's layout or the app's:

1. `WA_WRITE_PARITY_FIXTURES=1 npx vitest run test/parity-fixtures.test.ts` in
   the panel's frontend.
2. In the app: `./scripts/sync-complication-fixtures.sh --pull`, then
   `TEST_RUNNER_WA_UPDATE_FIXTURES=1 ./scripts/test.sh OneLookParityTests`, then
   `--push`.
3. If `symbol-sizes.json` changed: `node build-symbol-sizes.mjs` and
   `npm run build` in the panel's frontend.
