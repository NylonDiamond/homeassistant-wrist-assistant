"""The limits on rendering a template (``template_guard``), with Python jobs.

A job here stands in for a render: it loops in Python as Jinja does, so the
stop lands the same way. ``test_template_guard_callers`` covers the routes that
hand it real renders' jobs, and the throwaway box run in the report covers
Jinja itself.
"""

from __future__ import annotations

import asyncio
import importlib.util
from pathlib import Path
import sys
import threading
import time

import pytest

_PATH = Path(__file__).resolve().parents[1] / "custom_components" / "wrist_assistant" / "template_guard.py"
_spec = importlib.util.spec_from_file_location("wa_template_guard_under_test", _PATH)
guard_mod = importlib.util.module_from_spec(_spec)
sys.modules[_spec.name] = guard_mod
_spec.loader.exec_module(guard_mod)

Guard = guard_mod.TemplateGuard


def _spin(stop_after: float = 30.0):
    def job():
        end = time.monotonic() + stop_after
        while time.monotonic() < end:
            pass
        return "ran to the end"

    return job


def _quick(value="done"):
    return lambda: value


def _guard(**kwargs):
    kwargs.setdefault("render_seconds", 0.2)
    kwargs.setdefault("batch_seconds", 0.6)
    kwargs.setdefault("wait_seconds", 0.5)
    return Guard(**kwargs)


def _threads() -> int:
    return sum(1 for t in threading.enumerate() if t.name == "wa_template_render")


def test_a_quick_job_answers_its_value() -> None:
    outcome = asyncio.run(_guard().async_run("a", [_quick(7)]))[0]
    assert outcome.ok
    assert outcome.value == 7


def test_nothing_to_do_starts_nothing() -> None:
    assert asyncio.run(_guard().async_run("a", [])) == []


def test_a_job_that_raises_is_its_error_and_the_rest_still_run() -> None:
    def boom():
        raise ValueError("bad filter")

    outcomes = asyncio.run(_guard().async_run("a", [boom, _quick()]))
    assert outcomes[0].status == guard_mod.ERROR
    assert outcomes[0].error == "bad filter"
    assert outcomes[1].ok


def test_a_long_loop_is_stopped_and_the_loop_keeps_answering() -> None:
    async def scenario():
        guard = _guard()
        late: list[float] = []

        async def beat():
            while True:
                before = time.monotonic()
                await asyncio.sleep(0.01)
                late.append(time.monotonic() - before - 0.01)

        beater = asyncio.create_task(beat())
        started = time.monotonic()
        outcome = (await guard.async_run("a", [_spin()]))[0]
        took = time.monotonic() - started
        beater.cancel()
        return outcome, took, late

    outcome, took, late = asyncio.run(scenario())
    assert outcome.status == guard_mod.TIMEOUT
    assert outcome.error == guard_mod.TIME_LIMIT_TEXT
    assert took < 1.0
    assert late
    # The loop waited for its turn at the GIL and nothing longer.
    assert max(late) < 0.15


def test_the_stopped_thread_really_ends_and_gives_back_its_slot() -> None:
    async def scenario():
        guard = _guard()
        await guard.async_run("a", [_spin()])
        for _ in range(100):
            if not guard._running:
                break
            await asyncio.sleep(0.01)
        assert guard._running == {}
        return (await guard.async_run("a", [_quick()]))[0]

    assert asyncio.run(scenario()).ok
    assert _threads() == 0


def test_a_filter_that_catches_every_exception_cannot_keep_it_running() -> None:
    def stubborn():
        end = time.monotonic() + 30
        while time.monotonic() < end:
            try:
                sum(range(1000))
            except Exception:  # noqa: BLE001, S110 (the point of the test)
                pass
        return "ran to the end"

    outcome = asyncio.run(_guard().async_run("a", [stubborn]))[0]
    assert outcome.status == guard_mod.TIMEOUT


def test_a_job_that_catches_the_stop_itself_is_stopped_again() -> None:
    """Jinja's sandbox gives a template no way to do this. A stop that gets
    lost must still not leave the thread running."""
    caught: list[int] = []

    def swallows():
        end = time.monotonic() + 30
        while time.monotonic() < end:
            try:
                while time.monotonic() < end:
                    pass
            except BaseException:  # noqa: BLE001
                caught.append(1)
                if len(caught) >= 2:
                    raise
        return "ran to the end"

    async def scenario():
        guard = _guard()
        outcome = (await guard.async_run("a", [swallows]))[0]
        for _ in range(300):
            if not guard._running:
                break
            await asyncio.sleep(0.01)
        return outcome, dict(guard._running)

    outcome, running = asyncio.run(scenario())
    assert outcome.status == guard_mod.TIMEOUT
    assert running == {}
    assert len(caught) == 2


def test_one_slow_job_leaves_the_next_jobs_their_own_time() -> None:
    outcomes = asyncio.run(_guard().async_run("a", [_spin(), _quick("after")]))
    assert outcomes[0].status == guard_mod.TIMEOUT
    assert outcomes[1].ok
    assert outcomes[1].value == "after"


def test_a_slow_template_in_a_batch_runs_into_the_batch_limit() -> None:
    outcomes = asyncio.run(_guard().async_run("a", [_spin() for _ in range(20)]))
    stopped = [o for o in outcomes if o.status == guard_mod.TIMEOUT]
    skipped = [o for o in outcomes if o.status == guard_mod.SKIPPED]
    assert 2 <= len(stopped) <= 4
    assert len(stopped) + len(skipped) == 20
    assert all(o.refused for o in skipped)


def test_too_much_output_is_refused_one_render_and_a_batch() -> None:
    async def scenario():
        one = await _guard(output_chars=10).async_run("a", [_quick("x" * 11)])
        native = await _guard(output_chars=10).async_run("a", [_quick(list(range(50)))])
        batch = await _guard(output_chars=10, batch_output_chars=15).async_run(
            "b", [_quick("x" * 10), _quick("y" * 10)]
        )
        return one[0], native[0], batch

    one, native, batch = asyncio.run(scenario())
    assert one.status == guard_mod.TOO_LARGE
    assert native.status == guard_mod.TOO_LARGE
    assert batch[0].ok
    assert batch[1].status == guard_mod.TOO_LARGE


def test_memory_growth_stops_a_render() -> None:
    readings = iter([100, 100])

    def resident():
        return next(readings, 10_000)

    guard = _guard(
        resident_bytes=resident, memory_growth_bytes=1000, render_seconds=20, batch_seconds=20
    )
    outcomes = asyncio.run(guard.async_run("a", [_spin(), _quick()]))
    assert outcomes[0].status == guard_mod.MEMORY
    # It stops the batch too: what comes next would grow the same process.
    assert outcomes[1].status == guard_mod.SKIPPED


def test_many_at_once_from_one_caller_run_one_by_one_and_the_line_is_capped() -> None:
    running = 0
    most = 0
    lock = threading.Lock()

    def job():
        nonlocal running, most
        with lock:
            running += 1
            most = max(most, running)
        time.sleep(0.01)
        with lock:
            running -= 1
        return "ok"

    async def scenario():
        guard = _guard(max_waiting_per_caller=3, wait_seconds=2.0)
        return await asyncio.gather(*(guard.async_run("a", [job]) for _ in range(30)))

    results = asyncio.run(scenario())
    statuses = [r[0].status for r in results]
    assert most == 1
    assert statuses.count(guard_mod.OK) == 4
    assert statuses.count(guard_mod.BUSY) == 26


def test_one_caller_in_line_does_not_hold_up_another() -> None:
    async def scenario():
        guard = _guard(render_seconds=0.3, batch_seconds=0.6, wait_seconds=2.0)
        slow = asyncio.create_task(guard.async_run("slow", [_spin()]))
        await asyncio.sleep(0.02)
        slow_again = asyncio.create_task(guard.async_run("slow", [_quick()]))
        await asyncio.sleep(0.02)
        started = time.monotonic()
        other = await guard.async_run("other", [_quick()])
        took = time.monotonic() - started
        await asyncio.gather(slow, slow_again)
        return other[0], took

    other, took = asyncio.run(scenario())
    assert other.ok
    assert took < 0.2


def test_the_home_runs_at_most_its_limit_and_then_waits_then_refuses() -> None:
    async def scenario():
        guard = _guard(max_running=2, wait_seconds=0.1, render_seconds=0.4, batch_seconds=1.0)
        first = [asyncio.create_task(guard.async_run(f"c{i}", [_spin()])) for i in range(2)]
        await asyncio.sleep(0.02)
        assert sum(guard._running.values()) == 2
        third = await guard.async_run("c9", [_quick()])
        await asyncio.gather(*first)
        return third[0]

    assert asyncio.run(scenario()).status == guard_mod.BUSY


def test_the_budget_runs_out_refuses_at_once_and_comes_back() -> None:
    now = [0.0]
    started_threads: list[int] = []

    def counted():
        started_threads.append(1)
        return "ok"

    async def scenario():
        guard = Guard(
            clock=lambda: now[0] + time.monotonic(),
            render_seconds=0.1,
            batch_seconds=0.5,
            budget_seconds=0.1,
            budget_refill_per_second=1.0,
        )
        first = (await guard.async_run("a", [_spin()]))[0]
        assert first.status == guard_mod.TIMEOUT
        for _ in range(100):
            if not guard._running:
                break
            await asyncio.sleep(0.01)
        # Spent. The next one starts no thread at all.
        refused = (await guard.async_run("a", [counted]))[0]
        assert refused.status == guard_mod.BUDGET
        assert refused.refused
        assert started_threads == []
        # Someone else still has theirs.
        assert (await guard.async_run("b", [_quick()]))[0].ok
        now[0] += 60
        return (await guard.async_run("a", [counted]))[0]

    assert asyncio.run(scenario()).ok
    assert started_threads == [1]


def test_one_long_render_leaves_at_most_one_budget_of_debt() -> None:
    now = [0.0]
    guard = Guard(clock=lambda: now[0], budget_seconds=12.0, budget_refill_per_second=0.2)
    guard._charge("a", 500.0)
    assert guard._budget_left("a") == -12.0
    now[0] += 61
    assert guard._budget_left("a") > 0


def test_quick_renders_cost_next_to_nothing() -> None:
    async def scenario():
        guard = _guard(budget_seconds=1.0, budget_refill_per_second=0.0)
        for _ in range(200):
            assert (await guard.async_run("a", [_quick()]))[0].ok

    asyncio.run(scenario())


def test_a_caller_that_goes_away_stops_its_render() -> None:
    async def scenario():
        guard = _guard(render_seconds=20, batch_seconds=20)
        task = asyncio.create_task(guard.async_run("a", [_spin()]))
        await asyncio.sleep(0.05)
        task.cancel()
        with pytest.raises(asyncio.CancelledError):
            await task
        for _ in range(100):
            if not guard._running:
                break
            await asyncio.sleep(0.01)
        return dict(guard._running)

    assert asyncio.run(scenario()) == {}


def test_a_caller_cancelled_in_line_gives_back_its_place() -> None:
    async def scenario():
        guard = _guard(render_seconds=0.2, wait_seconds=5)
        slow = asyncio.create_task(guard.async_run("a", [_spin()]))
        await asyncio.sleep(0.02)
        waiting = asyncio.create_task(guard.async_run("a", [_quick()]))
        await asyncio.sleep(0.02)
        waiting.cancel()
        with pytest.raises(asyncio.CancelledError):
            await waiting
        await slow
        for _ in range(100):
            if not guard._running:
                break
            await asyncio.sleep(0.01)
        return dict(guard._running), (await guard.async_run("a", [_quick()]))[0]

    running, outcome = asyncio.run(scenario())
    assert running == {}
    assert outcome.ok


class _Compiled:
    def __init__(self, chunks: int) -> None:
        self.chunks = chunks
        self.made = 0

    def generate(self, **_kwargs):
        for _ in range(self.chunks):
            self.made += 1
            yield "x" * 10


class _HaTemplate:
    """The private names of Home Assistant's ``Template`` the count reaches for."""

    is_static = False

    def __init__(self, compiled) -> None:
        self._compiled = None
        self._made = compiled

    def _ensure_compiled(self):
        self._compiled = self._made
        return self._compiled


def test_output_is_counted_as_it_is_made_and_stops_at_the_limit() -> None:
    compiled = _Compiled(1_000_000)
    template = guard_mod.limit_output(_HaTemplate(compiled), 100)
    with pytest.raises(ValueError, match="exceeded maximum size"):
        template._compiled.render()
    # The rest of the million was never made, and nothing was joined.
    assert compiled.made == 11


def test_output_under_the_limit_is_the_same_output() -> None:
    template = guard_mod.limit_output(_HaTemplate(_Compiled(3)), 100)
    assert template._compiled.render() == "x" * 30


def test_the_count_leaves_alone_what_it_cannot_reach() -> None:
    class Static:
        is_static = True

    class Moved:
        is_static = False

    class Broken(_HaTemplate):
        def _ensure_compiled(self):
            raise ValueError("does not compile")

    static = Static()
    assert guard_mod.limit_output(static) is static
    moved = Moved()
    assert guard_mod.limit_output(moved) is moved
    assert not hasattr(moved, "_compiled")
    broken = Broken(None)
    assert guard_mod.limit_output(broken)._compiled is None
    # A stand-in with no such names at all reads as static.
    plain = object()
    assert guard_mod.limit_output(plain) is plain


def test_a_user_s_devices_share_one_name() -> None:
    assert guard_mod.caller_for("u1", "watch-1") == guard_mod.caller_for("u1", "phone-1") == "user:u1"
    assert guard_mod.caller_for(None, "watch-1") == "device:watch-1"
    assert guard_mod.caller_for(None) == "device:unknown"


def test_resident_bytes_reads_or_says_it_cannot() -> None:
    value = guard_mod._resident_bytes()
    assert value is None or value > 0
