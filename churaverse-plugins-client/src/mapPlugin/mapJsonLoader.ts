import { TiledMapOrthogonal } from 'tiled-types'

// マップの描画に必要なデータ
export interface DrawingMapData {
  mapId: string
  path: string
  layerNames: string[]
  tilesetNames: string[]
}

export class MapJsonLoader {
  public constructor(private readonly mapName: string) {}
  /**
   * マップの描画用データを返す
   */
  public static async getDrawingMapData(
    fileName: string,
    drawingLayerNames: string[],
    tilesetNames: string[]
  ): Promise<DrawingMapData> {
    const pathToMapJSON = 'assets/maps/data/' + fileName
    const file = await fetch(pathToMapJSON)
    const mapJSON = (await file.json()) as TiledMapOrthogonal

    const drawingLayerIndices = drawingLayerNames.map((layerName) => {
      const allLayerNames = mapJSON.layers.map((layer) => {
        return layer.name
      })
      return allLayerNames.indexOf(layerName)
    })

    const layerNames: string[] = drawingLayerIndices.map((index) => {
      return mapJSON.layers[index].name
    })

    const mapData = {
      path: pathToMapJSON,
      tilesetNames,
      layerNames,
    }
    return mapData
  }
}
