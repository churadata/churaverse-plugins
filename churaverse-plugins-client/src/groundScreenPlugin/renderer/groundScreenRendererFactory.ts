import { Scene } from 'phaser'
import { GroundScreenRenderer } from './groundScreenRenderer'
import { IGroundScreenRenderer } from '../interface/IGroundScreenRenderer'
import { IMapManager } from '../../mapPlugin/interface/IMapManager'
import { mapConfig } from '../../mapPlugin/mapConfig'
import { Position } from 'churaverse-engine-client'
import { IFocusTargetRepository } from '../../coreUiPlugin/interface/IFocusTargetRepository'

export class GroundScreenRendererFactory {
  public constructor(
    private readonly scene: Scene,
    private readonly mapManager: IMapManager,
    private readonly focusTargetRepository: IFocusTargetRepository
  ) {}

  public build(video: HTMLVideoElement): IGroundScreenRenderer {
    const configPos = mapConfig.maps[this.mapManager.currentMap.mapId].groundScreenPos
    let pos: Position | undefined
    if (configPos !== undefined) {
      pos = Position.from(configPos)
    }
    return new GroundScreenRenderer(this.scene, this.focusTargetRepository, video, pos)
  }
}
