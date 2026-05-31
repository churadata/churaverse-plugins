#!/bin/sh

set -e

PKG="$1"
PATH=$(jq -r --arg pkg "$PKG" '.[$pkg]' packages-map.json)

if [ "$PATH" = "null" ]; then
  echo "❌ unknown package: $PKG" >&2
  exit 1
fi

echo "$PATH"