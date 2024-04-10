import { Scene } from 'phaser'
import { MapRenderer } from './mapRenderer'
import { DrawingMapData } from '../mapJsonLoader'

export class MapRendererFactory {
  public constructor(private readonly scene: Scene) {}

  public async build(
    mapId: string,
    drawingLayerNames: string[],
    fileName: string,
    tilesetNames: string[]
  ): Promise<MapRenderer> {
    const mapData: DrawingMapData = {
      mapId,
      path: 'assets/maps/data/' + fileName,
      layerNames: drawingLayerNames,
      tilesetNames,
    }
    return await MapRenderer.build(this.scene, mapData)
  }
}
