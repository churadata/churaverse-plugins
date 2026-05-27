#!/usr/bin/env bash

# ================================
# rsyncで excludeパターンをリスト管理して dist にコピーする例
# ================================

# 除外パターンをリスト(配列)で管理
EXCLUDE_LIST=(
  "dist"
  "node_modules"
  ".git"
  "*.ts"
  "*.tsx"
  "*.js"
  # "*.d.ts" # matched by *.ts
)

# rsync に渡すオプション配列を定義
RSYNC_OPTS=(-av)

# EXCLUDE_LIST にある除外パターンを
# 1つずつ --exclude オプションに追加していく
for pattern in "${EXCLUDE_LIST[@]}"; do
  RSYNC_OPTS+=("--exclude=$pattern")
done

# 最終的に rsync を実行
# 例: rsync -av --exclude=dist --exclude=node_modules ... . dist/
rsync "${RSYNC_OPTS[@]}" . dist/

echo "=== copy assets finished ==="