# Tests

HTTP integration tests that hit a live Home Assistant instance. They verify the integration's v1 and v2 endpoints behave correctly end-to-end — they do not mock HA.

## Setup

One-time, from the repo root:

```sh
python3 -m venv .venv-test
.venv-test/bin/pip install -r tests/requirements.txt
```

## Environment

Both required:

- `HA_URL` — base URL of the dev HA instance (e.g. `http://172.16.43.222:8123`).
- `HA_TOKEN` — long-lived access token from your HA profile.

`conftest.py` probes `$HA_URL/api/` before any test runs; a bad URL or expired token aborts the session with one clear error instead of N cryptic failures.

## Running

```sh
.venv-test/bin/pytest -v tests/
```

Single file or test:

```sh
.venv-test/bin/pytest -v tests/test_delta_regression.py
.venv-test/bin/pytest -v tests/test_delta_regression.py::test_template_subscription_renders_to_value_not_bound_method
```

The full suite finishes in ~1.5s against a healthy HA.

One test is gated behind an environment variable, because it restarts the Home
Assistant instance it is pointed at and takes about a minute:

```sh
WA_LIVE_RESTART=1 .venv-test/bin/pytest -v tests/test_complication_sync_live.py::test_the_collection_survives_a_restart
```

It is worth running before a release, since a store token that rewound across a
restart would make the watch miss changes silently rather than fail loudly.

## Conventions

### Watch IDs — avoid polluting the device registry

When a test calls `/api/watch/updates` (or `/v2/delta`), the coordinator creates a `WatchSession` keyed by `watch_id`. The `sensor`/`binary_sensor`/`text` platforms iterate `coordinator.real_sessions` and create a device entry per unknown watch — so a naïve `watch_id="pytest-foo"` leaves a permanent "Watch pytest-foo" device in HA after the test ends.

`real_sessions` filters out watch IDs wrapped in double underscores (`api.py:872-879`). **Always use a `__pytest_*__` watch_id in tests** so no device is registered:

```python
"watch_id": "__pytest_my_test__"
```

The session is still tracked normally inside the coordinator — only the visible device side-effect is suppressed.

### Signed identities: register through the fixture

Anything that needs to sign a v2 request must get its identity from the
`register_secret` fixture in `conftest.py`, never by posting to
`/v2/register_secret` directly:

```python
def test_something(register_secret):
    watch_id = f"iphone:test-{secrets.token_hex(8)}"
    secret = register_secret(watch_id, label="pytest something smoke")
```

The fixture records every id it creates and forgets them all at the end of the
session over the admin-only `wrist_assistant/devices/forget` WebSocket command.
Registering by hand is what left 120 abandoned `iphone:test-*` / `watch-*`
entries in the box's `.storage/wrist_assistant.widget_secrets`, where the
complication panel's watch picker then offered every one of them as a real
device.

Extra keyword arguments go into the register payload, so `owner_iphone_id`,
`app_version`, `app_build`, and `device_name` are all passed the same way.

Cleanup needs an HA instance running an integration build that has the forget
command. Against an older one the run still passes, with a warning naming the
ids it could not remove.

### Test entities — clean up after yourself

Tests that need to fire a real `state_changed` event use HA's REST endpoint to create a uniquely-named entity:

```python
test_entity = f"wrist_assistant.test_pytest_{uuid.uuid4().hex[:8]}"

# Create / mutate
requests.post(
    f"{base_url}/api/states/{test_entity}",
    json={"state": "off"},
    headers={"Authorization": f"Bearer {token}"},
)

# Delete in a finally: block
requests.delete(
    f"{base_url}/api/states/{test_entity}",
    headers={"Authorization": f"Bearer {token}"},
)
```

Always wrap the test body in `try: ... finally: _delete_state(...)` so transient state never lingers on HA between runs.

### Complications: reuse ids, because deleting never erases a row

Deleting a complication writes a tombstone rather than removing it, so that a
stale watch replica cannot resurrect something somebody deleted. A test that
invented a fresh UUID each run would therefore add a permanent row to the
stored file every single run.

`test_complication_sync_live.py` derives each test's complication id from the
test's own name with `uuid.uuid5`, so every run revives and re-deletes the same
fixed handful of rows. Measured across three consecutive runs: 14 rows, flat.
Follow the same pattern for any new complication test, and keep using the
`wa-test-owner` owner id so the real collection is never written to.

Those rows are invisible in the panel, which lists only owners holding a live
complication, and they are never sent anywhere, because no watch claims that
owner id. To clear them out anyway, edit
`/config/.storage/wrist_assistant.custom_complications` on the HA box, drop
every record whose `ownerWatchId` starts with `wa-test-`, leave `data.token`
alone, and restart HA. The restart matters: the running instance holds the
collection in memory and would otherwise write it straight back over the edit.
