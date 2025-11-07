#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/words_of_life"

python -m http.server "${PORT:-8080}"

