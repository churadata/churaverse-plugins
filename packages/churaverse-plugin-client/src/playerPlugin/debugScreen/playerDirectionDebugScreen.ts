import { Direction, vectorToName } from 'churaverse-engine-client'
import { BaseDebugSummaryScreen } from '@churaverse/debug-screen-plugin-client/core/baseDebugSummaryScreen'
import { DebugSummaryScreenContainer } from '@churaverse/debug-screen-plugin-client/debugScreen/debugSummaryScreenContainer'
import { IPlayerDirectionDebugScreen } from './IDebugScreen/IPlayerInfoDebugScreen'

export class PlayerDirectionDebugScreen extends BaseDebugSummaryScreen implements IPlayerDirectionDebugScreen {
  public constructor(debugSummaryScreenContainer: DebugSummaryScreenContainer) {
    const element = `Direction: undefined`
    super(debugSummaryScreenContainer, 'playerInfo', element)
  }

  public update(direction: Direction): void {
    this.content.textContent = `Direction: ${vectorToName(direction)}`
  }
}
