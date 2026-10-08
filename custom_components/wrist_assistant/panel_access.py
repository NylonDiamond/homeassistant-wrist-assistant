"""Who may do what through the panel's WebSocket commands.

The sidebar panel is open to every signed-in Home Assistant user, not only
administrators, so each household member can look after their own watch and
iPhone. That splits the commands three ways:

* Owner scoped: anything about one device (its complications, its pages and
  settings, its status, forgetting it) is allowed only for a device the
  caller may manage (``may_manage_owner``). Each such command calls
  ``require_owner`` before it reads or writes anything.
* Shared: the home's own libraries (Parts, page photos, camera framing, HTTP
  actions, the complication Library) and the renders the editor previews
  with are open to every signed-in user, read and write. They belong to the
  household rather than to one person.
* Admin only: the little that is about the home's public face rather than
  any one person's devices (the gallery key), which keeps
  ``@websocket_api.require_admin``.

The device signed ops in ``wa_v2_views.py`` do not come through here; they
run as the device's bound user.
"""

from __future__ import annotations

from typing import TYPE_CHECKING, Any

from .const import DOMAIN, LIBRARY_OWNER_ID

if TYPE_CHECKING:
    from homeassistant.components.websocket_api import ActiveConnection
    from homeassistant.core import HomeAssistant

# The refusal every owner scoped command sends, the same words the phone's
# live lines have always used.
UNAUTHORIZED = "unauthorized"
NOT_YOURS = "not a device paired to this user"


def is_admin(connection: ActiveConnection) -> bool:
    """Whether the connection's user is a Home Assistant administrator."""
    user = getattr(connection, "user", None)
    return bool(user is not None and getattr(user, "is_admin", False))


def may_manage_owner(
    hass: HomeAssistant, connection: ActiveConnection, owner: str
) -> bool:
    """Whether the signed-in user may read and change ``owner``'s things.

    An administrator may manage any owner, orphans and unknown ids included,
    since an administrator looks after the whole home. Every signed-in user
    may manage the Library (``LIBRARY_OWNER_ID``): it is the home's shelf of
    designs that are on no device, shared by the household like Parts.
    Anyone else may manage only a device paired to them, one whose
    secret-store entry is bound to their user. A device bound to no user
    (paired before binding), one bound to someone else, and an id with no
    entry at all are refused: nothing says they are the caller's.
    """
    user = getattr(connection, "user", None)
    if user is None:
        return False
    if getattr(user, "is_admin", False):
        return True
    if owner == LIBRARY_OWNER_ID:
        return True
    user_id = getattr(user, "id", None)
    domain_data = hass.data.get(DOMAIN)
    secrets = getattr(domain_data, "widget_secret_store", None)
    entry = secrets.get(owner) if secrets is not None else None
    return (
        user_id is not None
        and entry is not None
        and entry.user_id is not None
        and entry.user_id == user_id
    )


def require_owner(
    hass: HomeAssistant,
    connection: ActiveConnection,
    msg: dict[str, Any],
    *owners: str,
) -> bool:
    """True when the caller may manage every one of ``owners``.

    Otherwise sends the ``unauthorized`` error for ``msg`` and returns False,
    so a command reads ``if not require_owner(...): return`` and touches
    nothing. A move names two owners, and both must be the caller's.
    """
    if all(may_manage_owner(hass, connection, owner) for owner in owners):
        return True
    connection.send_error(msg["id"], UNAUTHORIZED, NOT_YOURS)
    return False
