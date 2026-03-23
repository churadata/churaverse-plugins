# Development Guide

このリポジトリは pnpm workspace + Changesets を利用した monorepo 構成です。  
Node / pnpm のバージョン管理には [Volta](https://volta.sh) を使用しています。



# 目次

* [1. 環境構築](#1-環境構築)
  * [1.1 Volta のインストール](#11-volta-のインストール)
  * [1.2 corepack の無効化](#12-corepack-の無効化)
  * [1.3 Node / pnpm のインストール](#13-node--pnpm-のインストール)
  * [1.4 Volta shim 確認](#14-volta-shim-確認)
* [2. 依存関係のインストール](#2-依存関係のインストール)
* [3. Workspace 構成](#3-workspace-構成)
* [4. 開発フロー](#4-開発フロー)
  * [4.1 build](#41-build)
  * [4.2 dist の clean](#42-dist-の-clean)
  * [4.3 依存関係の追加](#43-依存関係の追加)
  * [4.4 Changeset の作成](#44-changeset-の作成)



# 1. 環境構築

このリポジトリでは [Volta](https://volta.sh) を利用して Node / pnpm のバージョンを固定しています。

Volta を使うことで

* Node / pnpm バージョンの統一
* ツールチェーンの自動切り替え

が可能になります。


## 1.1 Volta のインストール

macOS / Linux

```bash
curl https://get.volta.sh | bash
```

Windows

```powershell
winget install Volta.Volta
```

参考：  
https://docs.volta.sh/guide/getting-started


## 1.2 corepack の無効化

このプロジェクトでは pnpm を Volta で管理します。

corepack が有効だと pnpm バージョンが競合する可能性があるため、無効化してください。

```bash
corepack disable
```


## 1.3 Node / pnpm のインストール

`package.json` で Node / pnpm バージョンを固定しています。

```json
"volta": {
  "node": "20.20.0",
  "pnpm": "10.28.1"
}
```

以下を実行してください。

```bash
volta install node@20.20.0
volta install pnpm@10.28.1
```

確認

```bash
node -v
pnpm -v
```


## 1.4 Volta shim 確認

macOS / Linux

```bash
which node
which pnpm
```

Windows

```powershell
where node
where pnpm
```

以下のようになっている必要があります。

```
~/.volta/bin/node
~/.volta/bin/pnpm
```


## PATH が正しく設定されていない場合

macOS / Linux の場合は
`.zshrc` / `.bashrc` に以下を追加してください。

```bash
export VOLTA_HOME="$HOME/.volta"
export PATH="$VOLTA_HOME/bin:$PATH"
```

追加後

```bash
source ~/.zshrc
```

などを実行してください。



# 2. 依存関係のインストール

**必ずリポジトリ root で実行してください。**

```bash
pnpm install
```

## lockfile

`pnpm-lock.yaml` は CI の再現性を保証するための lockfile です。  
依存関係変更で lockfile が更新された場合は **必ず commit してください。**



# 3. Workspace 構成

このリポジトリは `pnpm-workspace.yaml` によって workspace package を定義しています。

```yaml
packages:
  - packages/engine-client
  - packages/engine-server
  - packages/plugins-client
  - packages/plugins-server
  - packages/plugins-client/src/*
  - packages/plugins-server/src/*
```

`src/*` を指定すると、`src` 配下の各ディレクトリがそれぞれ workspace package として認識されます。

例えば

```
packages/plugins-client/src/
  bombPlugin/
  collisionPlugin/
  mapPlugin/
```

のような構成の場合、以下のディレクトリが workspace package として扱われます。

```
packages/plugins-client/src/bombPlugin
packages/plugins-client/src/collisionPlugin
packages/plugins-client/src/mapPlugin
```

`pnpm-workspace.yaml` では `src/*` を指定しているため、  
`src` 配下に新しい plugin ディレクトリを追加しても自動的に workspace package として認識されます。

そのため、plugin を追加するたびに `pnpm-workspace.yaml` を変更する必要はありません。  
※ ただし、plugin ディレクトリがさらに深い階層になる場合は `src/**` のようなパターンを追加する必要があります。



# 4. 開発フロー

基本的な開発の流れ

```
実装
↓
build
↓
changeset 作成
↓
PR 作成
```


## 4.1 build

基本的には root でのフル build を推奨します。

```bash
pnpm build
```

理由

* engine package への依存が多いため
* 部分 build でも依存 build が走るため


## 4.2 dist の clean

dist を削除する場合

```bash
pnpm clean
```


## 4.3 依存関係の追加

### 全 package 共通依存

workspace root に追加

```bash
pnpm add typescript -Dw
# -D devDependencies
# -w workspace root
```

### 特定 package の依存

```bash
cd packages/<package>
pnpm add <追加したいpackage>
```


## 4.4 Changeset の作成

package のソースコードの変更を行った場合、 changeset を作成してください。

```bash
pnpm changeset
```

対話形式で以下を指定します。

* 変更対象 package（スペースで選択、複数選択可）
* version bump 種別
* summary

### version bump

| type  | 内容          |
| ----- | ----------- |
| patch | バグ修正        |
| minor | 後方互換のある機能追加 |
| major | 破壊的変更       |

参考：  
https://semver.org/lang/ja/

### summary

変更内容の簡単な説明を記述します。  
この内容は git tag の release notes に使用されます。

changeset を作成すると

```
.changeset/xxxx.md
```

のようなファイルが生成されます。  
このファイルも変更として commit し、PR に含めてください。
