import { CVEvent, IMainScene } from 'churaverse-engine-client'
import { GameIds } from '../interface/gameIds'

/**
 * ゲーム開始時のイベント
 * @param playerId ゲームを開始したプレイヤーid
 */
export class GameStartEvent extends CVEvent<IMainScene> {
  public constructor(
    public readonly gameId: GameIds,
    public readonly playerId: string
  ) {
    super('gameStart', true)
  }
}

declare module 'churaverse-engine-client' {
  export interface CVMainEventMap {
    gameStart: GameStartEvent
  }
}
