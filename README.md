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
* [5. Release / Publish の仕組み](#5-release--publish-の仕組み)
* [6. 新しい Package を追加する場合](#6-新しい-package-を追加する場合)
* [7. 新しい Package の初回 Publish](#7-新しい-package-の初回-publish)



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



# 5. Release / Publish の仕組み

このリポジトリでは Changesets + GitHub Actions によって [npm registry](https://www.npmjs.com) への publish を自動化しています。


## リリースフロー

1. 開発者が `pnpm changeset` を実行することにより `.changeset/xxxx.md` を作成
2. PR を main に merge
3. CI が `.changeset/xxxx.md` を検出
4. version / changelog を更新する Release PR を自動作成
5. Release PR を merge
6. publish 実行
7. git tag および release note を自動作成


## workflow

```
.github/workflows/publish.yml
```

この workflow は

* version bump
* changelog 更新
* npm publish

を自動で行います。

そのため 通常は手動 publish は不要です。



# 6. 新しい Package を追加する場合

1. package ディレクトリ作成
2. `package.json` 作成
3. workspace に追加

## workspace protocol

内部依存は `workspace:` を使用します。

例：

```
"engine-client": "workspace:*"
```

publish 時には実際の version に自動変換されます。

参考：  
https://pnpm.io/workspaces



# 7. 新しい Package の初回 Publish

既存 package は Trusted Publisher により CI から自動 publish されます。  
ただし **新規 package は初回のみ手動 publish が必要**です。

なお、publish を行うには npm アカウントの 2FA が必要です。  
npmアカウントの運用方法については現在検討中です。

## 手順

### 1. provenance を一時的に無効化

初回 publish では provenance を有効にするとエラーになります。

一時的に `package.json` を以下のように変更してください。

```json
"publishConfig": {
  "access": "public"
}
```


### 2. 手動publish

```bash
cd packages/<package>
pnpm publish --access public
```


### 3. npm で Trusted Publisher を設定

publish 後、[npm registry](https://www.npmjs.com) で該当 package を開き、Trusted Publisher を設定してください。


### 4. provenance を元に戻す

設定完了後、`package.json` を以下に戻してください。

```json
"publishConfig": {
  "access": "public",
  "provenance": true
}
```

これにより、GitHub Actions から publish された際に provenance（署名付き publish）が有効になります。


### 5. repository 設定

`package.json` に以下を追加してください。（`directory` は適宜変更してください）

```json
"repository": {
  "type": "git",
  "url": "https://github.com/churadata/churaverse-plugins.git",
  "directory": "packages/pkg-name"
}
```