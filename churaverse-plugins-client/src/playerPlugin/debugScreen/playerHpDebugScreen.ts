import { BaseDebugSummaryScreen } from '../../debugScreenPlugin/core/baseDebugSummaryScreen'
import { DebugSummaryScreenContainer } from '../../debugScreenPlugin/debugScreen/debugSummaryScreenContainer'
import { IPlayerHpDebugScreen } from './IDebugScreen/IPlayerInfoDebugScreen'

export class PlayerHpDebugScreen extends BaseDebugSummaryScreen implements IPlayerHpDebugScreen {
  public constructor(debugSummaryScreenContainer: DebugSummaryScreenContainer) {
    const element = `Hp: undefined`
    super(debugSummaryScreenContainer, 'playerInfo', element)
  }

  public update(hp: number): void {
    this.content.textContent = `Hp: ${hp}`
  }
}
