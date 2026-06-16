#!/usr/bin/env python3
"""Generate catalog-fallback.js from catalog.json for local/file:// demos."""

import json
from pathlib import Path

root = Path(__file__).resolve().parents[1]
catalog = json.loads((root / "catalog.json").read_text(encoding="utf-8"))
output = "window.CATALOG_FALLBACK = " + json.dumps(catalog, ensure_ascii=False, indent=2) + ";\n"
(root / "catalog-fallback.js").write_text(output, encoding="utf-8")
print("Generated catalog-fallback.js")
