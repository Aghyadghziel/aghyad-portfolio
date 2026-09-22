#!/usr/bin/env bash
# Prints /cv to public/Aghyad-Ghziel-CV.pdf so the PDF and the site can never
# disagree. Run after changing anything in src/resources/content.tsx.
#
#   npm run build && ./tools/print-cv.sh
set -euo pipefail

PORT=${PORT:-3412}
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CHROME=${CHROME:-"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"}
OUT="$ROOT/public/Aghyad-Ghziel-CV.pdf"

npx next start -p "$PORT" >/tmp/cv-server.log 2>&1 &
SERVER=$!
trap 'kill $SERVER 2>/dev/null || true' EXIT

for _ in $(seq 1 40); do
  if curl -sf "http://localhost:$PORT/cv" >/dev/null; then break; fi
  sleep 0.5
done

"$CHROME" --headless --disable-gpu --no-pdf-header-footer \
  --print-to-pdf="$OUT" "http://localhost:$PORT/cv"

echo "Wrote $OUT"
