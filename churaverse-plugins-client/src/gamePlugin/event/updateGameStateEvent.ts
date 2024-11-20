import { CVEvent, IMainScene } from 'churaverse-engine-client'
import { GameIds } from '../interface/gameIds'
import { ToGameState } from '../type/toGameState'

/**
 * ゲームセッションリクエスト時のイベント
 * ゲームダイアログの開始 or 中断ボタンを押した際に発火される
 * @param toState ゲーム状態の遷移を指定
 */
export class UpdateGameStateEvent extends CVEvent<IMainScene> {
  public constructor(
    public readonly gameId: GameIds,
    public readonly toState: ToGameState
  ) {
    super('updateGameState', true)
  }
}

declare module 'churaverse-engine-client' {
  export interface CVMainEventMap {
    updateGameState: UpdateGameStateEvent
  }
}
