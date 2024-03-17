import { BaseDebugSummaryScreen } from '../../debugScreenPlugin/core/baseDebugSummaryScreen'
import { DebugSummaryScreenContainer } from '../../debugScreenPlugin/debugScreen/debugSummaryScreenContainer'
import { IPlayerIdDebugScreen } from './IDebugScreen/IPlayerInfoDebugScreen'

export class PlayerIdDebugScreen extends BaseDebugSummaryScreen implements IPlayerIdDebugScreen {
  public constructor(debugSummaryScreenContainer: DebugSummaryScreenContainer) {
    const element = `Id: undefined`
    super(debugSummaryScreenContainer, 'playerInfo', element)
  }

  public update(Id: string): void {
    this.content.textContent = `Id: ${Id}`
  }
}
