import { Position } from '../../../domain/model/core/position'
import { BaseDebugSummaryScreen } from '../../debugScreenPlugin/core/baseDebugSummaryScreen'
import { DebugSummaryScreenContainer } from '../../debugScreenPlugin/debugScreen/debugSummaryScreenContainer'
import { IPlayerPositionDebugScreen } from './IDebugScreen/IPlayerInfoDebugScreen'

export class PlayerPositionDebugScreen extends BaseDebugSummaryScreen implements IPlayerPositionDebugScreen {
  public constructor(debugSummaryScreenContainer: DebugSummaryScreenContainer) {
    const element = `X: undefined, Y: undefined`
    super(debugSummaryScreenContainer, 'playerInfo', element)
  }

  public update(position: Position): void {
    this.content.textContent = `X: ${position.x.toFixed(0)}, Y: ${position.y.toFixed(0)}`
  }
}

export class PlayerPositionGridDebugScreen extends BaseDebugSummaryScreen implements IPlayerPositionDebugScreen {
  public constructor(debugSummaryScreenContainer: DebugSummaryScreenContainer) {
    const element = `GridX: undefined, GridY: undefined`
    super(debugSummaryScreenContainer, 'playerInfo', element)
  }

  public update(position: Position): void {
    this.content.textContent = `GridX: ${position.gridX}, GridY: ${position.gridY}`
  }
}
