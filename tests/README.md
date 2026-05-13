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

## Conventions

### Watch IDs — avoid polluting the device registry

When a test calls `/api/watch/updates` (or `/v2/delta`), the coordinator creates a `WatchSession` keyed by `watch_id`. The `sensor`/`binary_sensor`/`text` platforms iterate `coordinator.real_sessions` and create a device entry per unknown watch — so a naïve `watch_id="pytest-foo"` leaves a permanent "Watch pytest-foo" device in HA after the test ends.

`real_sessions` filters out watch IDs wrapped in double underscores (`api.py:872-879`). **Always use a `__pytest_*__` watch_id in tests** so no device is registered:

```python
"watch_id": "__pytest_my_test__"
```

The session is still tracked normally inside the coordinator — only the visible device side-effect is suppressed.

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
