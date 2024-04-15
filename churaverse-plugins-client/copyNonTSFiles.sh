#!/bin/bash

# コピー元の基本パス
src_base="src"
# コピー先の基本パス
dest_base="dist"

# コピー元のパスを検索し、それぞれに対して処理を実行
find "$src_base" -type f -name '*.scss' | while read src_file; do
    # 対応するコピー先のファイルパスを生成
    dest_file="${src_file/$src_base/$dest_base}"
    # コピー先のディレクトリを取得
    dest_dir=$(dirname "$dest_file")
    # コピー先のディレクトリがなければ作成
    mkdir -p "$dest_dir"
    # ファイルをコピー先にコピー
    cp "$src_file" "$dest_file"
done

echo "コピー完了"
