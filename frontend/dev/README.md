# Page editor harness

`<wa-page-editor>` on a page of its own, without Home Assistant. A fake `hass`
answers the watch config WebSocket commands from an in-memory store that
follows `watch_config_ws.py` and `watch_config_store.py`: compare-and-swap
saves, the page and tile shape guard, history of five, restore, the live
subscribe events, and the same error codes and messages.

## Run it

From `frontend/`:

    node dev/build-harness.mjs            # once, into dev/dist/
    node dev/build-harness.mjs --watch    # rebuild on every change
    python3 -m http.server 8765 --directory dev

Then open http://localhost:8765/pages-harness.html. With `--watch`, reload the
page after a rebuild.

The build never touches the panel's bundle or `build.mjs`. `dev/dist/` is
ignored by git.

## What is in it

- Three watches: Alex's (46 mm, three iPhone uploads, behavior settings whose
  room quick jump points at Home and Living room), Sam's (42 mm, a panel save
  still waiting for the iPhone) and an Ultra (49 mm, no record). The pages
  come from `test/fixtures-pages/*.json`; every entity they name has a
  made-up state.
- The strip acts on the watch the element shows (the last `get` for `pages`):
  - iPhone: rename, move a tile, reorder pages, style a page (a pattern as
    its one decoration, a title, and borders, a pattern, an effect and state
    bars on its first tiles, for the State, Border, Background and Page
    sections, keys in sorted order as the phone writes them),
    delete a page, add a page.
    Each is a device upload: a new revision signed by the watch, delivered at
    once, and a live event. "Add a page" on the Ultra uploads its first copy.
  - Library: the phone's catalog of HTTP actions, macros and status pages
    (part 3e). Alex's and Sam's watches start with the bytes the app's tests
    write (`test/fixtures-catalog/catalog.json`): a styled macro, an unnamed
    action, one that needs setup, one with a reply value, a system status
    page. Sam's pages hold library tiles whose ids the catalog does not
    list, for "Not on the iPhone". The Catalog switch removes the record
    (a live event at revision 0, as with an app older than the kind) and
    publishes it again; "iPhone: add an HTTP action" publishes it with one
    more action, a new revision and a live event. The store refuses a panel
    save or restore of `catalog`, as Home Assistant does. Open
    `pages-harness.html?nocatalog` to start with none.
  - iPhone picks up the save, iPhone cannot read it: delivery and rejection,
    which the element learns on its next check or reload, as in Home
    Assistant (no live event).
  - Next save fails: one `unavailable` refusal for the next save or restore.
  - Go offline: every command and subscribe rejects with the connection-lost
    result `home-assistant-js-websocket` uses (`{type, success: false,
    error: {code: 3, message}}`, so `code` is not at the top), and live events
    are lost.
    "Go online" fires the connection's `ready` event, as Home Assistant's
    socket library does after a reconnect.
  - Admin: off refuses every admin command with `unauthorized`.
  - States tick (on by default): a fresh `hass` object every 500 ms, as
    Home Assistant hands the panel one on every state change. Fields being
    typed in must survive it.
  - Light or Dark, Narrow (390 px and the `narrow` attribute), width.
- Every reply waits about 150 ms. An unknown message type is refused with
  `unknown_command`, warned in the console and marked red in the log.
- `hass` carries Home Assistant's registries as the frontend does
  (`entities`, `devices`, `areas`, in `harness-home.ts`), consistent with the
  states: rooms, a Living Room TV whose `media_player.` and `remote.` share a
  device, sensors of several device classes, calendars and cameras. The
  entity picker reads the areas from them.
- A stand-in symbol provider: a few dozen real SF Symbol names (the start of
  the picker's catalogue and every tile icon in the fixtures), each drawn as
  a plain mark. Its names arrive 600 ms after the page loads and the harness
  bumps the element's `iconsTick`, as the panel does when its symbol file is
  in. Open `pages-harness.html?noicons` for an element with no provider.
- `pages-harness.html?many=3000` adds that many more entities (lights,
  switches, sensors and the rest, some of kinds the watch has no tile for),
  to try the Add tile list on a large home.

## The panel harness

`panel-harness.html` mounts the whole panel the same way, with a
complication open in the editor: one watch, a few complications taken from
`test/fixtures/*.json`, a state for every entity they name, canned replies
for the commands the panel sends on its way in. It is for looking at the
panel's own styles (the form rules it shares with the page editor among
them), not for saves. `#open=rules` opens the fixture of that name, `#dark`
the dark skin. Symbols draw as placeholders: the symbol file is not served.

## From the console

    __harness.record()                       // shown watch, pages
    __harness.record("harness-watch-alex", "behavior")
    __harness.log                            // every command, reply, error, event
    __harness.reset()                        // reseed, clear the log, fresh element
    __harness.delay(1500)                    // slow every reply (150 ms by default)
    __harness.ticks()                        // fresh hass objects handed over so far
