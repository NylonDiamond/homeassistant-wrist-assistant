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
  - iPhone: rename, move a tile, reorder pages, delete a page, add a page.
    Each is a device upload: a new revision signed by the watch, delivered at
    once, and a live event. "Add a page" on the Ultra uploads its first copy.
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

## From the console

    __harness.record()                       // shown watch, pages
    __harness.record("harness-watch-alex", "behavior")
    __harness.log                            // every command, reply, error, event
    __harness.reset()                        // reseed, clear the log, fresh element
    __harness.delay(1500)                    // slow every reply (150 ms by default)
    __harness.ticks()                        // fresh hass objects handed over so far
