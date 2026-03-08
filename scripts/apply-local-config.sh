#!/usr/bin/env bash
set -euo pipefail

CREDENTIALS_FILE="${1:-local.credentials.env}"

if [[ ! -f "$CREDENTIALS_FILE" ]]; then
  echo "Missing $CREDENTIALS_FILE"
  echo "Create it from local.credentials.example:"
  echo "cp local.credentials.example local.credentials.env"
  exit 1
fi

# shellcheck disable=SC1090
source "$CREDENTIALS_FILE"

PORT="${PORT:-3333}"
VITE_API_URL="${VITE_API_URL:-http://localhost:$PORT}"
ALLOWED_ORIGINS="${ALLOWED_ORIGINS:-http://localhost:5173}"
NOTION_RESOURCE_TYPE="${NOTION_RESOURCE_TYPE:-auto}"

cat > .env <<ENV_FRONT
VITE_API_URL=$VITE_API_URL
ENV_FRONT

cat > server/.env <<ENV_BACK
PORT=$PORT
NOTION_API_KEY=${NOTION_API_KEY:-}
NOTION_DB_ID=${NOTION_DB_ID:-}
NOTION_RESOURCE_TYPE=$NOTION_RESOURCE_TYPE
ALLOWED_ORIGINS=$ALLOWED_ORIGINS
ENV_BACK

echo "Generated .env and server/.env from $CREDENTIALS_FILE"
