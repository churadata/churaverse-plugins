#!/bin/sh

set -e

PKG="$1"
PKG_PATH=$(jq -r --arg pkg "$PKG" '.[$pkg]' packages-map.json)

if [ "$PKG_PATH" = "null" ]; then
  echo "❌ unknown package: $PKG" >&2
  exit 1
fi

echo "$PKG_PATH"