"""Which platform a paired device runs: iOS, watchOS, Android or Wear OS.

A device's ``kind`` (``watch`` or ``iphone``) says which rules it follows:
an iPhone kind owns phone pages and the phone's settings, a watch kind owns
everything a watch does. An Android phone pairs as the ``iphone`` kind and a
Wear OS watch as the ``watch`` kind, so every rule keeps working as it is.
``platform`` is a second fact beside the kind: which store the app came from,
what Home Assistant calls the device, and which push service reaches it.

The app reports it on ``pair/start``, ``pair/redeem``, ``register_secret``
and ``update_metadata``. An app that never sends one is an Apple app, so the
platform defaults by kind: ``ios`` for the iPhone kind, ``watchos`` for a
watch. A platform that does not match the kind is refused, so a watch can
never turn itself into a phone through it.

The push token store uses the same four words for its token platforms, so a
device's own token is filed under its own platform.

Pure, so it is tested without Home Assistant.
"""

from __future__ import annotations

from typing import Any

# The kinds, as `widget_secret_store` spells them. Repeated here so this
# module needs nothing from that one.
_KIND_IPHONE = "iphone"
_KIND_WATCH = "watch"

PLATFORM_IOS = "ios"
PLATFORM_WATCHOS = "watchos"
PLATFORM_ANDROID = "android"
PLATFORM_WEAROS = "wearos"

DEVICE_PLATFORMS = (PLATFORM_IOS, PLATFORM_WATCHOS, PLATFORM_ANDROID, PLATFORM_WEAROS)

# A phone's platforms and a watch's platforms. A phone's token is the one an
# alert mirrored to a watch goes to; a watch's token is its own, direct one.
PHONE_PLATFORMS = (PLATFORM_IOS, PLATFORM_ANDROID)
WATCH_PLATFORMS = (PLATFORM_WATCHOS, PLATFORM_WEAROS)

# The platforms whose pushes go through Firebase Cloud Messaging rather than
# APNs. The relay picks the service from the platform the token was bound with.
FCM_PLATFORMS = frozenset({PLATFORM_ANDROID, PLATFORM_WEAROS})

# What the device registry calls each platform's devices (its `model`), and
# the start of the name a device gets until it reports its own.
_MODEL = {
    PLATFORM_IOS: "iPhone",
    PLATFORM_WATCHOS: "Apple Watch",
    PLATFORM_ANDROID: "Android phone",
    PLATFORM_WEAROS: "Wear OS watch",
}
_DEFAULT_NAME_PREFIX = {
    PLATFORM_IOS: "iPhone",
    PLATFORM_WATCHOS: "Watch",
    PLATFORM_ANDROID: "Android phone",
    PLATFORM_WEAROS: "Wear OS watch",
}

# Every registry model a phone or a watch can carry, for the counts that
# select devices by model.
PHONE_MODELS = frozenset(_MODEL[p] for p in PHONE_PLATFORMS)
WATCH_MODELS = frozenset(_MODEL[p] for p in WATCH_PLATFORMS)


class PlatformError(ValueError):
    """A reported platform that is not one of the four, or not the kind's."""


def default_platform(kind: str | None) -> str:
    """The platform of a device that never said: an Apple app of its kind."""
    return PLATFORM_IOS if kind == _KIND_IPHONE else PLATFORM_WATCHOS


def platform_fits_kind(platform: str, kind: str | None) -> bool:
    """Whether a platform is one a device of this kind can run."""
    if kind == _KIND_IPHONE:
        return platform in PHONE_PLATFORMS
    return platform in WATCH_PLATFORMS


def parse_platform(raw: Any) -> str | None:
    """A reported platform, checked: None when absent, else one of the four.

    Raises `PlatformError` for anything else (a number, an empty string, a
    word that is not one of the four). Case and surrounding space are
    forgiven, so ``"Android"`` reads as ``android``.
    """
    if raw is None:
        return None
    if not isinstance(raw, str):
        raise PlatformError("platform must be a string")
    platform = raw.strip().lower()
    if platform not in DEVICE_PLATFORMS:
        raise PlatformError(f"platform must be one of: {', '.join(DEVICE_PLATFORMS)}")
    return platform


def resolve_platform(kind: str | None, stored: str | None) -> str:
    """A device's platform: the one it reported, when that fits its kind, else
    its kind's Apple default. Every reader goes through this, so an entry
    written before the field, or one whose kind changed under it, still reads
    as something that fits."""
    if stored in DEVICE_PLATFORMS and platform_fits_kind(stored, kind):
        return stored
    return default_platform(kind)


def is_fcm_platform(platform: str | None) -> bool:
    """Whether a push token of this platform goes through FCM."""
    return platform in FCM_PLATFORMS


def device_model(kind: str | None, platform: str | None = None) -> str:
    """The device registry's `model` for a device of this kind and platform."""
    return _MODEL[resolve_platform(kind, platform)]


def default_device_name(kind: str | None, platform: str | None, device_id: str) -> str:
    """The name a device has until it reports its own: ``Watch 1a2b3c4d``,
    ``iPhone 1a2b3c4d``, ``Android phone 1a2b3c4d`` or ``Wear OS watch
    1a2b3c4d`` (the first eight characters of its id)."""
    return f"{_DEFAULT_NAME_PREFIX[resolve_platform(kind, platform)]} {device_id[:8]}"


def device_noun(kind: str | None, platform: str | None = None) -> str:
    """The device in a sentence: ``iPhone`` for an iPhone, ``phone`` for an
    Android phone, and ``watch`` for either watch."""
    resolved = resolve_platform(kind, platform)
    if resolved == PLATFORM_IOS:
        return "iPhone"
    if resolved == PLATFORM_ANDROID:
        return "phone"
    return "watch"


def phone_token_entry(tokens: Any) -> Any:
    """A device's phone token from its ``{platform: entry}`` map: the iOS one
    first, as it always was, then the Android one. None when it holds neither."""
    if not tokens:
        return None
    return tokens.get(PLATFORM_IOS) or tokens.get(PLATFORM_ANDROID)


def watch_token_entry(tokens: Any) -> Any:
    """A device's own watch token: the watchOS one first, then the Wear OS one."""
    if not tokens:
        return None
    return tokens.get(PLATFORM_WATCHOS) or tokens.get(PLATFORM_WEAROS)


def has_phone_token(tokens: Any) -> bool:
    return phone_token_entry(tokens) is not None


# ── General copy ────────────────────────────────────────────────────────
#
# Words about no device in particular keep the Apple words they always had
# while every device paired here is an Apple one, and say phone and watch
# once an Android phone or a Wear OS watch is paired (the panel's
# `generalCopy`, `frontend/src/device-platform.ts`). The owners reply carries
# `paired_platforms` for the panel; the integration's own general words read
# `home_has_android`.


def paired_platforms(entries: Any) -> list[str]:
    """The platforms of every paired device, sorted, once each. ``entries``
    is the secret store's entries (anything with ``device_kind`` and
    ``platform``), as a mapping or an iterable."""
    values = entries.values() if hasattr(entries, "values") else entries
    found = {
        resolve_platform(getattr(e, "device_kind", None), getattr(e, "platform", None))
        for e in values or ()
    }
    return sorted(found)


def home_has_android(entries: Any) -> bool:
    """Whether an Android phone or a Wear OS watch is paired here."""
    return any(p in FCM_PLATFORMS for p in paired_platforms(entries))


def general_words(entries: Any, apple: str, phone_and_watch: str) -> str:
    """General copy: ``apple`` while every paired device is an Apple one,
    ``phone_and_watch`` once an Android device is paired here."""
    return phone_and_watch if home_has_android(entries) else apple
