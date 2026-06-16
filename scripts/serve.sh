#!/usr/bin/env bash
set -euo pipefail

PORT="${PORT:-8000}"
python3 -m http.server "$PORT"
