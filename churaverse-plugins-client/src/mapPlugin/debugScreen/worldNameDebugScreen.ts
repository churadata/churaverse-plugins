import { BaseDebugSummaryScreen } from '../../debugScreenPlugin/core/baseDebugSummaryScreen'
import { DebugSummaryScreenContainer } from '../../debugScreenPlugin/debugScreen/debugSummaryScreenContainer'
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
