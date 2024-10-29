import { CVEvent, IMainScene } from 'churaverse-engine-client'
import { GameIds } from '../interface/gameIds'

/**
 * ゲーム中断時のイベント
 * @param playerId ゲームを中断したプレイヤーID
 */
export class InitialGameDataEvent extends CVEvent<IMainScene> {
  public constructor(public readonly runnigGameIds: GameIds[]) {
    super('initialGameData', true)
  }
}

declare module 'churaverse-engine-client' {
  export interface CVMainEventMap {
    initialGameData: InitialGameDataEvent
  }
}
