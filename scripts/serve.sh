#!/usr/bin/env bash
set -euo pipefail

PORT="${PORT:-8000}"
export PORT
node server.js
