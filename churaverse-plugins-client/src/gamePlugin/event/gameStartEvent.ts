import { CVEvent, IMainScene } from 'churaverse-engine-client'
import { GameIds } from '../interface/gameIds'

/**
 * ゲーム開始時のイベント
 * @param playerId ゲームを開始したプレイヤーid
 * @param participantIds ゲーム参加者のプレイヤーid
 *
 */
export class GameStartEvent extends CVEvent<IMainScene> {
  public constructor(
    public readonly gameId: GameIds,
    public readonly playerId: string,
    public readonly participantIds: string[]
  ) {
    super('gameStart', true)
  }
}

declare module 'churaverse-engine-client' {
  export interface CVMainEventMap {
    gameStart: GameStartEvent
  }
}
