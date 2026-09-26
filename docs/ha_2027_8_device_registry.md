# Device registry calls that stop working in Home Assistant 2027.8.0

Found 2026-09-26 in the Home Assistant log while testing 2.1.0-beta.16.
Not fixed in 3.0.0 (the release tested as 2.1.0 betas) on purpose: the release was already tested on devices,
and the deadline is far away. Fix it in the next integration release.

## What Home Assistant says

Two warnings from `homeassistant.helpers.frame`, both ending with
"This will stop working in Home Assistant 2027.8.0":

1. `device_registry.async_get_device` is deprecated "because device
   identifiers and connections are no longer unique across config entries".
   Replacements: `async_get_device_by_identifier`,
   `async_get_device_by_connection` or `async_get_devices`.
2. `device_registry.async_get_or_create` with a `via_device` parameter is
   deprecated. Replacement: `via_device_id`.

## What breaks if it is not fixed

From 2027.8.0 on, the integration cannot look up its own watch and iPhone
devices, and devices created with a parent (watch under its iPhone, devices
under the hub) fail. Diagnostic sensors, the text entities, device logbook
entries and the panel's device lookups stop working.

## Where

`async_get_device(...)` lookups:

- `logbook_events.py:42`
- `sensor.py:401`, `sensor.py:418`
- `text.py:151`, `text.py:166`
- `complication_ws.py:423`, `complication_ws.py:611`
- `wa_v2_views.py:2385`, `wa_v2_views.py:2836`
- `widget_secret_store.py:497`

`via_device=` (some are our own helper arguments that end up in a
`DeviceInfo` or an `async_get_or_create` call; follow each one through):

- `widget_secret_store.py:505`
- `sensor.py:509`, `sensor.py:623`, `sensor.py:703`, `sensor.py:857`
- `binary_sensor.py:153`, `binary_sensor.py:229`
- `text.py:61`, `text.py:98`, `text.py:139`

Line numbers are from commit `68ccaf2` (2.1.0-beta.16).

## The trap

`hacs.json` still allows Home Assistant 2024.7.0. The replacement functions
only exist in recent Home Assistant releases. Renaming the calls breaks every
install older than the release that added them. Either:

- use the new call when the registry has it and fall back to the old one, or
- raise `hacs.json` `homeassistant` to the release that added the new calls.

Before choosing, look up which Home Assistant release added
`async_get_device_by_identifier` and `via_device_id`, and check how
`DeviceInfo` passes a parent device in that release.

## Done when

- The Home Assistant log shows no `homeassistant.helpers.frame` warning for
  `wrist_assistant` after a restart with a watch and an iPhone paired.
- The test suite passes, and a watch still shows under its iPhone on the
  Home Assistant Devices page.
