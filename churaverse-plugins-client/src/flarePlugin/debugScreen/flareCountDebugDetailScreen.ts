import { BaseDebugDetailScreen } from '@churaverse/debug-screen-plugin-client/core/baseDebugDetailScreen'
import { DebugDetailScreenContainer } from '@churaverse/debug-screen-plugin-client/debugScreen/debugDetailScreenContainer'
import { IFlareCountDebugDetailScreen } from './IDebugScreen/IFlareCountDebugDetailScreen'

export class FlareCountDebugDetailScreen extends BaseDebugDetailScreen implements IFlareCountDebugDetailScreen {
  public constructor(debugDetailScreenContainer: DebugDetailScreenContainer) {
    const element = `FlareCount: undefined`
    super(debugDetailScreenContainer, 'flareInfo', element)
  }

  public update(flareCount: number): void {
    this.content.textContent = `FlareCount: ${flareCount}`
  }
}
