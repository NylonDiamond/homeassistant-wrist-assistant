"""The real ``device_lookup.py``, loaded into a stub package.

Three kinds of in-process tests need it: those that build their own stub
package and load integration files into it (``load_into``), those that
exec code pulled out of a module, whose namespace needs the helper itself
(``find_paired_device``), and the module's own tests (``real_module``).
"""

from __future__ import annotations

import importlib.util
import sys
import types
from pathlib import Path
from typing import Any

_SRC = Path(__file__).resolve().parents[1] / "custom_components" / "wrist_assistant"
_OWN_PKG = "wa_device_lookup_loader_pkg"


def load_into(pkg: str) -> types.ModuleType:
    """Load ``device_lookup.py`` as ``<pkg>.device_lookup``. The package's
    ``const`` must already be in ``sys.modules`` and carry ``DOMAIN``."""
    name = f"{pkg}.device_lookup"
    spec = importlib.util.spec_from_file_location(name, _SRC / "device_lookup.py")
    module = importlib.util.module_from_spec(spec)
    sys.modules[name] = module
    spec.loader.exec_module(module)
    return module


def real_module() -> types.ModuleType:
    if f"{_OWN_PKG}.device_lookup" not in sys.modules:
        pkg = types.ModuleType(_OWN_PKG)
        pkg.__path__ = []
        sys.modules[_OWN_PKG] = pkg
        const = types.ModuleType(f"{_OWN_PKG}.const")
        const.DOMAIN = "wrist_assistant"
        sys.modules[f"{_OWN_PKG}.const"] = const
        load_into(_OWN_PKG)
    return sys.modules[f"{_OWN_PKG}.device_lookup"]


def find_paired_device(dev_reg: Any, device_id: str, config_entry_id: str | None = None) -> Any:
    return real_module().find_paired_device(dev_reg, device_id, config_entry_id)


def paired_device_name(dev_reg: Any, entry: Any, device_id: str) -> str:
    return real_module().paired_device_name(dev_reg, entry, device_id)
