import { CVEvent, IMainScene } from 'churaverse-engine-client'
import { GameIds } from '../interface/gameIds'

/**
 * ゲームセッションリクエスト時のイベント
 * ゲームダイアログの開始 or 中断ボタンを押した際に発火される
 */
export class ToggleGameStateEvent extends CVEvent<IMainScene> {
  public constructor(public readonly gameId: GameIds) {
    super('toggleGameState', true)
  }
}

declare module 'churaverse-engine-client' {
  export interface CVMainEventMap {
    toggleGameState: ToggleGameStateEvent
  }
}
