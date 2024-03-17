import { BaseDebugSummaryScreen } from '../../debugScreenPlugin/core/baseDebugSummaryScreen'
import { DebugSummaryScreenContainer } from '../../debugScreenPlugin/debugScreen/debugSummaryScreenContainer'
import { PlayerRole } from '../types/playerRole'
import { IPlayerRoleDebugScreen } from './IDebugScreen/IPlayerInfoDebugScreen'

export class PlayerRoleDebugScreen extends BaseDebugSummaryScreen implements IPlayerRoleDebugScreen {
  public constructor(debugSummaryScreenContainer: DebugSummaryScreenContainer) {
    const element = `Role: undefined`
    super(debugSummaryScreenContainer, 'playerInfo', element)
  }

  public update(role: PlayerRole): void {
    this.content.textContent = `Role: ${role}`
  }
}
