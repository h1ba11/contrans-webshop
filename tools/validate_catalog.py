#!/usr/bin/env python3
"""Validate the demo catalog structure used by the static MVP."""

import json
import sys
from pathlib import Path

REQUIRED_ITEM_FIELDS = [
    "id",
    "sku",
    "name",
    "brand",
    "type",
    "category",
    "visibility",
    "inquiryOnly",
    "priceVisible",
]


def fail(message: str) -> None:
    print(f"ERROR: {message}", file=sys.stderr)
    sys.exit(1)


def main() -> None:
    root = Path(__file__).resolve().parents[1]
    catalog_path = root / "catalog.json"

    if not catalog_path.exists():
        fail("catalog.json not found")

    with catalog_path.open("r", encoding="utf-8") as handle:
        catalog = json.load(handle)

    items = catalog.get("items")
    documents = catalog.get("documents")

    if not isinstance(items, list) or not items:
        fail("items must be a non-empty list")
    if not isinstance(documents, list):
        fail("documents must be a list")

    item_ids = set()
    document_ids = {doc.get("id") for doc in documents if doc.get("id")}

    for index, item in enumerate(items, start=1):
        for field in REQUIRED_ITEM_FIELDS:
            if field not in item:
                fail(f"item #{index} missing required field: {field}")

        item_id = item["id"]
        if item_id in item_ids:
            fail(f"duplicate item id: {item_id}")
        item_ids.add(item_id)

        if item.get("priceVisible") is not False:
            fail(f"{item_id}: priceVisible must be false in inquiry-only MVP")
        if item.get("inquiryOnly") is not True:
            fail(f"{item_id}: inquiryOnly must be true in inquiry-only MVP")

        for doc_id in item.get("documentIds", []):
            if doc_id not in document_ids:
                fail(f"{item_id}: unknown document id: {doc_id}")

    for item in items:
        for field in ("relatedIds", "requiredTogetherIds"):
            for related_id in item.get(field, []):
                if related_id not in item_ids:
                    fail(f"{item['id']}: unknown {field} id: {related_id}")

    print(f"OK: {len(items)} items, {len(documents)} documents")


if __name__ == "__main__":
    main()
