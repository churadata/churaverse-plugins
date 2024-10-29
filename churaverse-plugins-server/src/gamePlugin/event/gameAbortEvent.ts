import { CVEvent, IMainScene } from 'churaverse-engine-server'
import { GameIds } from '../interface/gameIds'

/**
 * ゲーム中断時のイベント
 * @param playerId ゲームを中断したプレイヤーのID
 */
export class GameAbortEvent extends CVEvent<IMainScene> {
  public constructor(
    public readonly gameId: GameIds,
    public readonly playerId: string
  ) {
    super('gameAbort', true)
  }
}

declare module 'churaverse-engine-server' {
  export interface CVMainEventMap {
    gameAbort: GameAbortEvent
  }
}
