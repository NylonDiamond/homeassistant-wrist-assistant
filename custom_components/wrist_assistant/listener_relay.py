"""Change listeners that outlive one store instance.

A config entry reload builds a fresh ``ComplicationStore`` and
``WatchConfigStore``, but Home Assistant keeps every WebSocket connection,
and every subscription on it, open across the reload. A subscription that
added its listener to the store it found at subscribe time would keep
listening to the old instance, which no longer changes, and the panel or
phone would hear nothing more until it reloaded the page.

So a subscription adds its listener here instead. One relay per kind of
store lives in ``hass.data`` beside the entry, not inside it, and follows
whichever store instance is current: setup points it at the new store, and
unload lets go of the old one. The subscriptions themselves never notice a
reload.

No Home Assistant import, so the tests load it as it is.
"""

from __future__ import annotations

import logging
from collections.abc import Callable
from typing import Any, Generic, Protocol, TypeVar

_LOGGER = logging.getLogger(__name__)

# Where the relays live in hass.data. Not under the entry's own key, which
# unload pops, so they survive a reload.
_HASS_KEY = "wrist_assistant_listener_relays"

# The relay of each store that live subscriptions follow.
COMPLICATIONS = "complications"
WATCH_CONFIG = "watch_config"

_ChangeT = TypeVar("_ChangeT")


class _Listenable(Protocol):
    def async_add_listener(
        self, listener: Callable[[Any], None]
    ) -> Callable[[], None]: ...


class ListenerRelay(Generic[_ChangeT]):
    """Hands each change of the store it follows to every listener added
    here, whichever store instance that is."""

    def __init__(self) -> None:
        self._listeners: list[Callable[[_ChangeT], None]] = []
        self._store: _Listenable | None = None
        self._detach: Callable[[], None] | None = None

    def add_listener(
        self, listener: Callable[[_ChangeT], None]
    ) -> Callable[[], None]:
        """Call ``listener(change)`` on every change of the current store.
        Returns the function that removes it."""
        self._listeners.append(listener)

        def _remove() -> None:
            if listener in self._listeners:
                self._listeners.remove(listener)

        return _remove

    def follow(self, store: _Listenable) -> None:
        """Listen to ``store`` from now on, and to no store before it. Calling
        it again with the same store does nothing."""
        if store is self._store:
            return
        self.release()
        self._store = store
        self._detach = store.async_add_listener(self._dispatch)

    def release(self) -> None:
        """Stop listening to the store followed until now (the entry is
        unloading). The listeners stay, for the next store to reach."""
        detach, self._detach, self._store = self._detach, None, None
        if detach is not None:
            detach()

    def _dispatch(self, change: _ChangeT) -> None:
        for listener in list(self._listeners):
            try:
                listener(change)
            except Exception:
                _LOGGER.exception("A store change subscriber failed")


def listener_relay(hass: Any, name: str) -> ListenerRelay[Any]:
    """The relay ``name`` (``COMPLICATIONS`` or ``WATCH_CONFIG``), made on
    first use."""
    relays: dict[str, ListenerRelay[Any]] = hass.data.setdefault(_HASS_KEY, {})
    relay = relays.get(name)
    if relay is None:
        relay = relays[name] = ListenerRelay()
    return relay
