#!/usr/bin/env bash
set -euo pipefail
export LD_LIBRARY_PATH=/home/charles/opt/chrome-libs:${LD_LIBRARY_PATH:-}
cd /home/charles/创业/adventure-film
exec npx remotion "$@"
