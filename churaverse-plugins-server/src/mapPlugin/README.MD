## Churaverse Plugin: map Plugin (Server)

### Description

マップの変更の通知の授受などを行うプラグインです。

### マップデータの追加について
Mapデータは TiledMapEditor で制作したデータをJSON形式で書き出した後、 `./data` フォルダに追加してください。
また、`mapManager.ts` の `loadMapJSON` メソッドにて、追加したマップデータを読み込むためのコードを追加する必要があります。 