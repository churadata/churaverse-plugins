import { BaseDebugSummaryScreen } from '@churaverse/debug-screen-plugin-client/core/baseDebugSummaryScreen'
import { DebugSummaryScreenContainer } from '@churaverse/debug-screen-plugin-client/debugScreen/debugSummaryScreenContainer'
import { IWorldNameDebugScreen } from './IDebugScreen/IMapInfoDebugScreen'

export class WorldNameDebugScreen extends BaseDebugSummaryScreen implements IWorldNameDebugScreen {
  public constructor(debugSummaryScreenContainer: DebugSummaryScreenContainer) {
    const element = `Name: Undefined`
    super(debugSummaryScreenContainer, 'worldInfo', element)
  }

  public update(name: string): void {
    this.content.textContent = `Name: ${name}`
  }
}
