#!/bin/bash

# コピー元の基本パス
src_base="src"
# コピー先の基本パス
dest_base="dist"

# コピー元のパスを検索し、それぞれに対して処理を実行
find "$src_base" -type d -name 'assets' | while read src_dir; do
    # 対応するコピー先のディレクトリパスを生成
    dest_dir="${src_dir/$src_base/$dest_base}"
    # コピー先のディレクトリがなければ作成
    mkdir -p "$dest_dir"
    # ファイルをコピー先にコピー
    cp -r "$src_dir/"* "$dest_dir"
done

echo "assetsコピー完了"
