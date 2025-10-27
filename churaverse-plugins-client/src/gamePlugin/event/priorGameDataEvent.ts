import { CVEvent, IMainScene } from 'churaverse-engine-client'
import { GameIds } from '../interface/gameIds'
import { GameState } from '../type/gameState'

/**
 * 進行中のゲームデータを受け取るイベント
 * @param runningGameId 進行中のゲームid
 */
export class PriorGameDataEvent extends CVEvent<IMainScene> {
  public constructor(
    public readonly runningGameId: GameIds,
    public readonly gameState: GameState
  ) {
    super('priorGameData', true)
  }
}

declare module 'churaverse-engine-client' {
  export interface CVMainEventMap {
    priorGameData: PriorGameDataEvent
  }
}
