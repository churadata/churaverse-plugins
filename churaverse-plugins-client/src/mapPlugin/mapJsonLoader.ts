import { TiledMapOrthogonal } from 'tiled-types'

// マップの描画に必要なデータ
export interface DrawingMapData {
  mapId: string 
  path: string
  layerNames: string[]
  tilesetNames: string[]
}
