"""Parts: the named pieces of a complication this home has kept.

The panel lets an author pick a few layers of a complication and keep them
under a name, then drop them into another complication later. What is kept is
the share text those layers make: the same wire the Share dialog produces, with
the author's entity ids replaced by the numbered ``domain.shared_N``
placeholders. That is what makes a part portable between two complications that
read different entities, and it is also why nothing about the house is written
here beyond the design itself.

The library belongs to the home, not to a watch. A part built on the watch's
rectangular face is just as useful on the iPhone's Home Screen tile, and asking
which watch a saved part "belongs to" is a question with no useful answer.

Storage is one file, made on first save. An install that has never saved a part
has no file at all, and loading one that is missing or damaged starts empty
rather than failing setup.
"""

from __future__ import annotations

import logging
import uuid
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store
from homeassistant.util import dt as dt_util

from .const import PARTS_STORAGE_KEY, PARTS_STORAGE_VERSION

_LOGGER = logging.getLogger(__name__)

_SAVE_DEBOUNCE_SECONDS = 1

# The same ceiling the share text carries, so anything that can be shared can
# be kept, and nothing bigger can be smuggled in through this door.
MAX_PART_BYTES = 64 * 1024
# A library, not an archive. Well past what anyone builds by hand, and low
# enough that the whole list is cheap to send to the panel on every open.
MAX_PARTS = 100
MAX_NAME_LENGTH = 60


class PartsStoreError(Exception):
    """Base class; ``code`` is the stable machine-readable reason."""

    code = "error"

    def __init__(self, message: str) -> None:
        super().__init__(message)
        self.message = message


class PartsValidationError(PartsStoreError):
    """The submitted part is malformed, too big, or one too many."""

    code = "invalid"


class PartNotFoundError(PartsStoreError):
    """No part in the library has that id."""

    code = "not_found"


def _now() -> str:
    return dt_util.utcnow().isoformat()


def _clean_name(raw: Any) -> str:
    if not isinstance(raw, str):
        raise PartsValidationError("a part needs a name")
    name = raw.strip()
    if name == "":
        raise PartsValidationError("a part needs a name")
    if len(name) > MAX_NAME_LENGTH:
        raise PartsValidationError(
            f"a part name is at most {MAX_NAME_LENGTH} characters"
        )
    return name


def _clean_text(raw: Any) -> str:
    if not isinstance(raw, str) or raw.strip() == "":
        raise PartsValidationError("a part needs its text")
    if len(raw.encode("utf-8")) > MAX_PART_BYTES:
        raise PartsValidationError(
            f"a part is at most {MAX_PART_BYTES} bytes"
        )
    return raw


class PartsStore:
    """The home's saved parts, newest change first when listed."""

    def __init__(self, hass: HomeAssistant) -> None:
        self._parts: dict[str, dict[str, Any]] = {}
        self._store: Store = Store(hass, PARTS_STORAGE_VERSION, PARTS_STORAGE_KEY)

    async def async_load(self) -> None:
        """Read the library from disk. A missing or damaged file starts empty."""
        data = await self._store.async_load()
        if not isinstance(data, dict):
            return
        parts = data.get("parts")
        if not isinstance(parts, list):
            return
        for raw in parts:
            if not isinstance(raw, dict):
                continue
            part_id = raw.get("id")
            name = raw.get("name")
            text = raw.get("text")
            if not isinstance(part_id, str) or part_id == "":
                continue
            if not isinstance(name, str) or not isinstance(text, str):
                continue
            created = raw.get("created_at")
            updated = raw.get("updated_at")
            self._parts[part_id] = {
                "id": part_id,
                "name": name,
                "text": text,
                "created_at": created if isinstance(created, str) else _now(),
                "updated_at": updated if isinstance(updated, str) else _now(),
            }
        _LOGGER.debug("Loaded %d saved parts from storage", len(self._parts))

    def _serialize(self) -> dict[str, Any]:
        return {"parts": list(self._parts.values())}

    def list(self) -> list[dict[str, Any]]:
        """Every part, newest change first."""
        return sorted(
            (dict(part) for part in self._parts.values()),
            key=lambda part: part["updated_at"],
            reverse=True,
        )

    def save(
        self, part_id: str | None, name: Any, text: Any
    ) -> dict[str, Any]:
        """Add a part, or replace the one with this id.

        A known id keeps its ``created_at``, so renaming a part or saving over
        it does not make it look new. An id nobody has is a refusal rather than
        a quiet create: the panel only ever sends an id it just listed.
        """
        clean_name = _clean_name(name)
        clean_text = _clean_text(text)
        if part_id is not None:
            existing = self._parts.get(part_id)
            if existing is None:
                raise PartNotFoundError("no such part")
            existing["name"] = clean_name
            existing["text"] = clean_text
            existing["updated_at"] = _now()
            self._store.async_delay_save(self._serialize, _SAVE_DEBOUNCE_SECONDS)
            return dict(existing)
        if len(self._parts) >= MAX_PARTS:
            raise PartsValidationError(
                f"this home already has {MAX_PARTS} saved parts. Delete one first."
            )
        now = _now()
        part = {
            "id": uuid.uuid4().hex,
            "name": clean_name,
            "text": clean_text,
            "created_at": now,
            "updated_at": now,
        }
        self._parts[part["id"]] = part
        self._store.async_delay_save(self._serialize, _SAVE_DEBOUNCE_SECONDS)
        return dict(part)

    def delete(self, part_id: str) -> None:
        """Drop a part. An id the library does not have is a refusal, so the
        panel can say so rather than showing a row that is already gone."""
        if self._parts.pop(part_id, None) is None:
            raise PartNotFoundError("no such part")
        self._store.async_delay_save(self._serialize, _SAVE_DEBOUNCE_SECONDS)
