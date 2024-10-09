import { BaseDebugSummaryScreen } from '@churaverse/debug-screen-plugin-client/core/baseDebugSummaryScreen'
import { DebugSummaryScreenContainer } from '@churaverse/debug-screen-plugin-client/debugScreen/debugSummaryScreenContainer'
import { WorldMap } from '../domain/worldMap'
import { IWorldSizeDebugScreen } from './IDebugScreen/IMapInfoDebugScreen'
import './defMapInfo'

export class WorldSizeDebugScreen extends BaseDebugSummaryScreen implements IWorldSizeDebugScreen {
  public constructor(debugSummaryScreenContainer: DebugSummaryScreenContainer) {
    const element = 'Map data not found'
    super(debugSummaryScreenContainer, 'worldInfo', element)
  }

  public update(map: WorldMap): void {
    this.content.textContent = `Width: ${map.width}, Height: ${map.height}`
  }
}

export class WorldSizeGridDebugScreen extends BaseDebugSummaryScreen implements IWorldSizeDebugScreen {
  public constructor(debugSummaryScreenContainer: DebugSummaryScreenContainer) {
    const element = 'Map data not found'
    super(debugSummaryScreenContainer, 'worldInfo', element)
  }

  public update(map: WorldMap): void {
    this.content.textContent = `GridWidth: ${map.widthTileNum}, GridHeight: ${map.heightTileNum}`
  }
}
