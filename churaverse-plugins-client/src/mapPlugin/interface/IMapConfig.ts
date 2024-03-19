/**
 * 外部プラグインがMapInfoに情報を追加する場合はこのinterfaceをdeclare moduleで拡張する
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface MapInfoPluginOptions {}

export interface MapInfo {
  displayName: string
  jsonName: string

  /**
   * tileset名. マップチップの画像名も同じである必要がある
   */
  tilesets: string[]

  /**
   * 描画するレイヤー名
   */
  drawingLayerNames?: string[]

  pluginOptions: MapInfoPluginOptions
}

interface MapInfos {
  [mapId: string]: MapInfo
}

export interface IMapConfig {
  maps: MapInfos
}
