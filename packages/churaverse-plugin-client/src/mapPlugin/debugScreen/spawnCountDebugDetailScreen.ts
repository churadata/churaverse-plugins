import { BaseDebugDetailScreen } from '@churaverse/debug-screen-plugin-client/core/baseDebugDetailScreen'
import { DebugDetailScreenContainer } from '@churaverse/debug-screen-plugin-client/debugScreen/debugDetailScreenContainer'
import { ISpawnCountDebugDetailScreen } from './IDebugScreen/IMapInfoDebugScreen'

export class SpawnCountDebugDetailScreen extends BaseDebugDetailScreen implements ISpawnCountDebugDetailScreen {
  public constructor(debugDetailScreenContainer: DebugDetailScreenContainer) {
    const element = `SpawnCount: undefined`
    super(debugDetailScreenContainer, 'mapInfo', element)
  }

  public update(spawn: number | undefined): void {
    this.content.textContent = `SpawnCount: ${spawn ?? 'undefined'}`
  }
}
