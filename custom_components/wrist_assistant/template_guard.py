"""Limits on the templates a device or a panel user asks this home to render.

A Jinja template is a small program. Rendered on the event loop, one with a
long loop holds up all of Home Assistant for as long as it runs. Home
Assistant's own ``render_template`` command guards itself with
``Template.async_render_will_timeout``: a first render in a thread of its own,
stopped from outside when it runs over, and a second render on the loop when it
did not. This module keeps that thread and that stop, and has the thread's
render be the only one, so a template that is quick the first time and slow the
second never reaches the loop.

What a caller gets:

* Off the loop. Every render, compile included, runs in a worker thread.
* A time limit. ``RENDER_SECONDS`` per template, the same 3 s the frontend's
  Markdown card asks for, and ``BATCH_SECONDS`` for one request's templates.
* Size limits. ``MAX_TEMPLATE_CHARS`` in, ``OUTPUT_CHARS`` out (Home Assistant's
  own ``MAX_TEMPLATE_OUTPUT``, which older versions lack), ``BATCH_OUTPUT_CHARS``
  across one request, and ``MEMORY_GROWTH_BYTES`` of process growth while a
  render runs, since a template can build a huge string it never prints. The
  output is counted as it is made (``limit_output``). Home Assistant checks only
  the finished string, and a loop printing one long string many times has built
  nothing yet when the join at its end asks for a terabyte in one C step.
* Limits per caller. One running at a time, ``MAX_WAITING_PER_CALLER`` in line
  behind it, and a time budget (``BUDGET_SECONDS``, refilled at
  ``BUDGET_REFILL_PER_SECOND``) charged with the CPU time each render used. A
  device bound to a user shares that user's limits, so pairing more devices
  buys no more.
* Limits for the home. ``MAX_RUNNING`` threads at once and ``MAX_WAITING`` in
  line, because each running thread takes its turn at the GIL with the loop.

A stop is an exception raised inside the worker thread. It is a BaseException,
so no ``except Exception`` in a filter can swallow it, and it is raised again
until the thread ends. A slot is given back only when the thread has really
ended, so a render that will not stop keeps its caller's slot.

What this cannot stop: one long step in C. The stop lands between two Python
bytecodes, and a huge integer power, a backtracking regular expression or a
huge join inside a ``{% set %}`` block holds the GIL for all of that one step, so
the loop waits with it, and memory goes where that step sends it. No thread can
avoid that. Home Assistant's own command has the same limit.

The module keeps Home Assistant out of its imports. A job is any callable, and
the callers in ``bundle_ops``, ``complication_ws`` and ``api`` hand it the
render.
"""

from __future__ import annotations

import asyncio
from collections import OrderedDict, deque
from collections.abc import Callable, Sequence
import ctypes
from dataclasses import dataclass, field
import logging
import os
import threading
import time
from typing import Any

_LOGGER = logging.getLogger(__name__)

RENDER_SECONDS = 3.0
BATCH_SECONDS = 6.0
MAX_TEMPLATE_CHARS = 128 * 1024
OUTPUT_CHARS = 256 * 1024
BATCH_OUTPUT_CHARS = 1024 * 1024
MEMORY_GROWTH_BYTES = 256 * 1024 * 1024

MAX_RUNNING = 3
MAX_WAITING = 64
MAX_WAITING_PER_CALLER = 8
WAIT_SECONDS = 5.0

# Four renders that run to the time limit, then one every 15 s.
BUDGET_SECONDS = 12.0
BUDGET_REFILL_PER_SECOND = 0.2
_MAX_BUDGETS = 256

# How often a running render is looked at, memory included. A render that ends
# first is never looked at at all, which is nearly every render.
_TICK_SECONDS = 0.05
# How long between two raises into a thread that has not stopped yet.
_RAISE_AGAIN_SECONDS = 0.25
# How long a caller waits for a stopped thread before answering without it.
_STOP_GRACE_SECONDS = 1.0
_STUCK_LOG_SECONDS = 30.0

OK = "ok"
ERROR = "error"
TIMEOUT = "timeout"
TOO_LARGE = "too_large"
MEMORY = "memory"
BUSY = "busy"
BUDGET = "budget"
SKIPPED = "skipped"

# Nothing is known about the template: it never ran, or ran into someone else's
# limit. The caller keeps what it had and may ask again.
REFUSED = frozenset({BUSY, BUDGET, SKIPPED})

TIME_LIMIT_TEXT = f"Exceeded maximum execution time of {RENDER_SECONDS:g}s"
_TEXT = {
    TIMEOUT: TIME_LIMIT_TEXT,
    TOO_LARGE: f"Template output exceeded maximum size of {OUTPUT_CHARS} characters",
    MEMORY: "Template used too much memory",
    BUSY: "Too many templates are rendering. Try again soon.",
    BUDGET: "Too many slow templates from this user or device. Try again soon.",
    SKIPPED: "Not rendered: the request's templates ran out of time",
}


def template_too_long_text() -> str:
    """The error for a template over ``MAX_TEMPLATE_CHARS``."""
    return f"A template is limited to {MAX_TEMPLATE_CHARS} characters"


def caller_for(user_id: str | None, device_id: str | None = None) -> str:
    """The name limits are kept under: the user when there is one, since one
    user may hold many devices, else the device."""
    if user_id:
        return f"user:{user_id}"
    return f"device:{device_id or 'unknown'}"


@dataclass(slots=True)
class Outcome:
    """What became of one job."""

    status: str
    value: Any = None
    error: str | None = None
    seconds: float = 0.0

    @property
    def ok(self) -> bool:
        return self.status == OK

    @property
    def refused(self) -> bool:
        return self.status in REFUSED


class _Stop(BaseException):
    """Raised inside a worker thread to stop its render."""


def _raise_in_thread(thread_id: int) -> bool:
    """Raise ``_Stop`` in a thread. False when the thread is already gone."""
    tid = ctypes.c_ulong(thread_id)
    done = ctypes.pythonapi.PyThreadState_SetAsyncExc(tid, ctypes.py_object(_Stop))
    if done > 1:
        ctypes.pythonapi.PyThreadState_SetAsyncExc(tid, None)
    return done == 1


def _resident_bytes() -> int | None:
    """This process's resident memory on Linux, None where it cannot be read.

    ``/proc`` answers from memory, without touching a disk, and ``os.read`` is
    what lets the loop ask it.
    """
    try:
        fd = os.open("/proc/self/statm", os.O_RDONLY)
    except OSError:
        return None
    try:
        return int(os.read(fd, 128).split()[1]) * os.sysconf("SC_PAGE_SIZE")
    except (OSError, ValueError, IndexError):
        return None
    finally:
        os.close(fd)


def output_chars(value: Any) -> int:
    """How much a render answered, in characters."""
    if value is None:
        return 0
    return len(value) if isinstance(value, str) else len(str(value))


class _CappedOutput:
    """Stands in for a compiled template, counting its output as it is made."""

    __slots__ = ("_compiled", "_limit")

    def __init__(self, compiled: Any, limit: int) -> None:
        self._compiled = compiled
        self._limit = limit

    def render(self, *args: Any, **kwargs: Any) -> str:
        made = 0
        parts: list[str] = []
        for chunk in self._compiled.generate(*args, **kwargs):
            made += len(chunk)
            if made > self._limit:
                raise ValueError(_TEXT[TOO_LARGE])
            parts.append(chunk)
        return "".join(parts)


def limit_output(template: Any, limit: int = OUTPUT_CHARS) -> Any:
    """Have a Home Assistant ``Template`` count its output as it renders, and
    hand it back. Called in the worker thread, since this compiles.

    This reaches into two private names of ``Template``. On a version that
    moved them it changes nothing, and the limits after the render still hold.
    A template that does not compile is left for its render to report.
    """
    if getattr(template, "is_static", True):
        return template
    try:
        compiled = template._compiled or template._ensure_compiled()  # noqa: SLF001
        template._compiled = _CappedOutput(compiled, limit)  # noqa: SLF001
    except Exception:  # noqa: BLE001
        _LOGGER.debug("No running count of a template's output", exc_info=True)
    return template


@dataclass(slots=True)
class _Budget:
    seconds: float
    at: float


@dataclass(slots=True)
class _Waiter:
    caller: str
    future: asyncio.Future[None]


@dataclass(slots=True)
class _Run:
    """One worker thread and the jobs it works through."""

    caller: str
    jobs: Sequence[Callable[[], Any]]
    results: list[Outcome | None]
    render_seconds: float
    batch_seconds: float
    output_chars: int
    batch_output_chars: int
    size_of: Callable[[Any], int]
    thread: threading.Thread | None = None
    index: int | None = None
    started: float = 0.0
    stop_reason: str | None = None
    halted: bool = False
    cpu: float = 0.0
    output: int = 0
    last_raise: float = 0.0
    ended: asyncio.Event = field(default_factory=asyncio.Event)


class TemplateGuard:
    """Runs renders under the limits above. Every method but the worker runs
    on the event loop, so nothing here needs a lock."""

    def __init__(
        self,
        *,
        clock: Callable[[], float] = time.monotonic,
        resident_bytes: Callable[[], int | None] = _resident_bytes,
        render_seconds: float = RENDER_SECONDS,
        batch_seconds: float = BATCH_SECONDS,
        wait_seconds: float = WAIT_SECONDS,
        output_chars: int = OUTPUT_CHARS,
        batch_output_chars: int = BATCH_OUTPUT_CHARS,
        memory_growth_bytes: int = MEMORY_GROWTH_BYTES,
        max_running: int = MAX_RUNNING,
        max_waiting: int = MAX_WAITING,
        max_waiting_per_caller: int = MAX_WAITING_PER_CALLER,
        budget_seconds: float = BUDGET_SECONDS,
        budget_refill_per_second: float = BUDGET_REFILL_PER_SECOND,
    ) -> None:
        self._clock = clock
        self._resident_bytes = resident_bytes
        self._render_seconds = render_seconds
        self._batch_seconds = batch_seconds
        self._wait_seconds = wait_seconds
        self._output_chars = output_chars
        self._batch_output_chars = batch_output_chars
        self._memory_growth_bytes = memory_growth_bytes
        self._max_running = max_running
        self._max_waiting = max_waiting
        self._max_waiting_per_caller = max_waiting_per_caller
        self._budget_seconds = budget_seconds
        self._budget_refill = budget_refill_per_second
        self._budgets: OrderedDict[str, _Budget] = OrderedDict()
        self._running: dict[str, int] = {}
        self._waiters: deque[_Waiter] = deque()
        # Holds the watchers, since the loop keeps only weak references.
        self._watchers: set[asyncio.Task[None]] = set()

    # ── the budget ───────────────────────────────────────────────────────

    def _budget_left(self, caller: str) -> float:
        now = self._clock()
        budget = self._budgets.get(caller)
        if budget is None:
            return self._budget_seconds
        budget.seconds = min(
            self._budget_seconds, budget.seconds + (now - budget.at) * self._budget_refill
        )
        budget.at = now
        return budget.seconds

    def _charge(self, caller: str, seconds: float) -> None:
        left = self._budget_left(caller)
        self._budgets[caller] = _Budget(left - seconds, self._clock())
        self._budgets.move_to_end(caller)
        while len(self._budgets) > _MAX_BUDGETS:
            # The longest untouched entry. Forgetting it gives it a full budget
            # back, which only a caller quiet this long is due anyway.
            self._budgets.popitem(last=False)

    # ── slots ────────────────────────────────────────────────────────────

    def _may_run(self, caller: str) -> bool:
        return (
            self._running.get(caller, 0) == 0
            and sum(self._running.values()) < self._max_running
        )

    def _take_slot(self, caller: str) -> None:
        self._running[caller] = self._running.get(caller, 0) + 1

    def _give_slot(self, caller: str) -> None:
        left = self._running.get(caller, 0) - 1
        if left > 0:
            self._running[caller] = left
        else:
            self._running.pop(caller, None)
        self._wake_waiters()

    def _wake_waiters(self) -> None:
        """Start whoever in line may run now, oldest first. A caller already
        running stays in line without holding up anyone behind it."""
        for waiter in list(self._waiters):
            if waiter.future.done():
                self._waiters.remove(waiter)
            elif self._may_run(waiter.caller):
                self._waiters.remove(waiter)
                self._take_slot(waiter.caller)
                waiter.future.set_result(None)

    async def _acquire(self, caller: str) -> str | None:
        """Take a slot. Returns None once it is held, or why not."""
        if not self._waiters and self._may_run(caller):
            self._take_slot(caller)
            return None
        waiting = sum(1 for w in self._waiters if w.caller == caller)
        if waiting >= self._max_waiting_per_caller or len(self._waiters) >= self._max_waiting:
            return BUSY
        waiter = _Waiter(caller, asyncio.get_running_loop().create_future())
        self._waiters.append(waiter)
        self._wake_waiters()
        try:
            await asyncio.wait_for(waiter.future, self._wait_seconds)
        except TimeoutError:
            return BUSY
        except asyncio.CancelledError:
            # The slot may have been given in the same tick as the cancel.
            if waiter.future.done() and not waiter.future.cancelled():
                self._give_slot(caller)
            raise
        return None

    # ── running ──────────────────────────────────────────────────────────

    async def async_run(
        self,
        caller: str,
        jobs: Sequence[Callable[[], Any]],
        *,
        size_of: Callable[[Any], int] = output_chars,
    ) -> list[Outcome]:
        """Run ``jobs`` in order in one worker thread, one outcome for each.

        A job that raises an ``Exception`` gets ``ERROR`` with its text, and
        the jobs after it still run. Past the batch limit the rest are
        ``SKIPPED``. ``size_of`` reads a job's answer for the output limits.
        Nothing raises to the caller but a cancel.
        """
        if not jobs:
            return []
        if self._budget_left(caller) <= 0:
            return [_refusal(BUDGET) for _ in jobs]
        why_not = await self._acquire(caller)
        if why_not is not None:
            return [_refusal(why_not) for _ in jobs]

        loop = asyncio.get_running_loop()
        run = _Run(
            caller=caller,
            jobs=jobs,
            results=[None] * len(jobs),
            render_seconds=self._render_seconds,
            batch_seconds=self._batch_seconds,
            output_chars=self._output_chars,
            batch_output_chars=self._batch_output_chars,
            size_of=size_of,
        )
        answer: asyncio.Future[None] = loop.create_future()
        thread = threading.Thread(
            target=self._work, args=(run, loop), name="wa_template_render", daemon=True
        )
        run.thread = thread
        started = self._clock()
        try:
            thread.start()
        except RuntimeError as err:
            # The system has no thread to give.
            self._give_slot(caller)
            _LOGGER.warning("Could not start a template render: %s", err)
            return [_refusal(BUSY) for _ in jobs]
        watcher = loop.create_task(self._watch(run, answer, started))
        self._watchers.add(watcher)
        watcher.add_done_callback(self._watchers.discard)
        try:
            await asyncio.shield(answer)
        except asyncio.CancelledError:
            # The asker went away. The render has no one left to answer.
            run.halted = True
            if run.stop_reason is None:
                run.stop_reason = TIMEOUT
            self._stop(run)
            raise
        return [_final(run, i) for i in range(len(jobs))]

    def _stop(self, run: _Run) -> None:
        if run.index is None or run.thread is None or run.thread.ident is None:
            return
        run.last_raise = self._clock()
        _raise_in_thread(run.thread.ident)

    async def _watch(
        self, run: _Run, answer: asyncio.Future[None], started: float
    ) -> None:
        """Stop what runs over, and answer once it ended or is out of time.

        Stays until the thread has really ended, so a thread that takes a while
        to stop keeps being told to. The caller's answer does not wait for
        that: it goes after ``_STOP_GRACE_SECONDS``.
        """
        base: int | None = None
        stuck_logged = False
        give_up_at: float | None = None
        while True:
            try:
                await asyncio.wait_for(run.ended.wait(), _TICK_SECONDS)
            except TimeoutError:
                pass
            if run.ended.is_set():
                break
            now = self._clock()
            index = run.index
            resident = self._resident_bytes()
            if base is None:
                base = resident
            if run.stop_reason is None:
                # A stop that ended its job has passed: this is another job.
                give_up_at = None
                if now - started > run.batch_seconds:
                    run.halted = True
                    run.stop_reason = TIMEOUT
                elif index is not None and now - run.started > run.render_seconds:
                    run.stop_reason = TIMEOUT
                elif (
                    base is not None
                    and resident is not None
                    and resident - base > self._memory_growth_bytes
                ):
                    run.halted = True
                    run.stop_reason = MEMORY
                if run.stop_reason is not None:
                    give_up_at = now + _STOP_GRACE_SECONDS
                    _LOGGER.warning(
                        "Stopped a template render for %s (%s)", run.caller, run.stop_reason
                    )
                    self._stop(run)
                    continue
            elif now - run.last_raise >= _RAISE_AGAIN_SECONDS:
                self._stop(run)
            if give_up_at is not None and now >= give_up_at and not answer.done():
                # Nobody reads what this thread does from here on.
                run.halted = True
                answer.set_result(None)
            if not stuck_logged and now - started > _STUCK_LOG_SECONDS:
                stuck_logged = True
                _LOGGER.warning(
                    "A template render for %s has not stopped after %.0f s",
                    run.caller,
                    now - started,
                )
        self._charge(run.caller, run.cpu)
        self._give_slot(run.caller)
        if not answer.done():
            answer.set_result(None)

    def _work(self, run: _Run, loop: asyncio.AbstractEventLoop) -> None:
        """The worker thread. Touches nothing of the guard, only its run."""
        try:
            _work_jobs(run)
        except _Stop:
            # A stop that landed between two jobs.
            pass
        except BaseException:  # noqa: BLE001 (a thread has nowhere else to report)
            _LOGGER.exception("A template render thread failed")
        run.index = None
        while True:
            try:
                loop.call_soon_threadsafe(run.ended.set)
            except _Stop:
                continue
            except RuntimeError:
                # The loop closed: Home Assistant is shutting down.
                pass
            return


def _work_jobs(run: _Run) -> None:
    for index, job in enumerate(run.jobs):
        if run.halted:
            return
        run.started = time.monotonic()
        run.stop_reason = None
        run.index = index
        cpu_from = time.thread_time()
        try:
            value = job()
            chars = run.size_of(value)
            if chars > run.output_chars or run.output + chars > run.batch_output_chars:
                outcome = Outcome(TOO_LARGE, error=_TEXT[TOO_LARGE])
            else:
                run.output += chars
                outcome = Outcome(OK, value=value)
        except _Stop:
            reason = run.stop_reason or TIMEOUT
            outcome = Outcome(reason, error=_TEXT[reason])
        except Exception as err:  # noqa: BLE001 (each job answers for itself)
            outcome = Outcome(ERROR, error=str(err) or type(err).__name__)
        finally:
            used = time.thread_time() - cpu_from
            run.cpu += used
        outcome.seconds = used
        # The index goes first: a stop only ever aims at a job in progress.
        run.index = None
        run.results[index] = outcome


def _refusal(status: str) -> Outcome:
    return Outcome(status, error=_TEXT[status])


def _final(run: _Run, index: int) -> Outcome:
    outcome = run.results[index]
    if outcome is not None:
        return outcome
    # The job in hand when the caller stopped waiting gets the stop's reason.
    # The ones after it never ran.
    if index == run.index and run.stop_reason is not None:
        return _refusal(run.stop_reason)
    return _refusal(SKIPPED)


# The one guard the integration's callers share. Limits per caller only mean
# something if every route charges the same ones.
GUARD = TemplateGuard()


async def async_guarded_jobs(
    caller: str,
    jobs: Sequence[Callable[[], Any]],
    *,
    size_of: Callable[[Any], int] = output_chars,
) -> list[Outcome]:
    """Run ``jobs`` under the shared guard."""
    return await GUARD.async_run(caller, jobs, size_of=size_of)
