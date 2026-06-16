#!/usr/bin/env python3
"""Export catalog items to CSV so the schema can be compared with Easoft exports."""

import csv
import json
from pathlib import Path

root = Path(__file__).resolve().parents[1]
catalog = json.loads((root / "catalog.json").read_text(encoding="utf-8"))
output_path = root / "demo-products.csv"

fields = [
    "id",
    "sku",
    "name",
    "brand",
    "type",
    "category",
    "summary",
    "compatibleModels",
    "serialNumberRequired",
    "inquiryOnly",
    "priceVisible",
    "documentIds",
    "relatedIds",
    "requiredTogetherIds",
    "notes",
]

with output_path.open("w", encoding="utf-8", newline="") as handle:
    writer = csv.DictWriter(handle, fieldnames=fields, delimiter=";")
    writer.writeheader()
    for item in catalog["items"]:
        row = {}
        for field in fields:
            value = item.get(field, "")
            if isinstance(value, list):
                value = "|".join(str(part) for part in value)
            row[field] = value
        writer.writerow(row)

print(f"Wrote {output_path}")
