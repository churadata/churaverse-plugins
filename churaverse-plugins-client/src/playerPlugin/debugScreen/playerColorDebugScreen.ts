import { BaseDebugSummaryScreen } from '../../debugScreenPlugin/core/baseDebugSummaryScreen'
import { DebugSummaryScreenContainer } from '../../debugScreenPlugin/debugScreen/debugSummaryScreenContainer'
import { PlayerColor } from '../types/playerColor'
import { IPlayerColorDebugScreen } from './IDebugScreen/IPlayerInfoDebugScreen'

export class PlayerColorDebugScreen extends BaseDebugSummaryScreen implements IPlayerColorDebugScreen {
  public constructor(debugSummaryScreenContainer: DebugSummaryScreenContainer) {
    const element = `Color: undefined`
    super(debugSummaryScreenContainer, 'playerInfo', element)
  }

  public update(color: PlayerColor): void {
    this.content.textContent = `Color: ${color}`
  }
}
