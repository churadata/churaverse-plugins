import { CVEvent, IMainScene } from 'churaverse-engine-server'
import { GameIds } from '../interface/gameIds'
import { ToGameState } from '../type/toGameState'

/**
 * ゲーム開始時のイベント
 * @param playerId ゲームを開始したプレイヤーid
 */
export class UpdateGameStateEvent extends CVEvent<IMainScene> {
  public constructor(
    public readonly gameId: GameIds,
    public readonly playerId: string,
    public readonly toState: ToGameState
  ) {
    super('updateGameState', true)
  }
}

declare module 'churaverse-engine-server' {
  export interface CVMainEventMap {
    updateGameState: UpdateGameStateEvent
  }
}
