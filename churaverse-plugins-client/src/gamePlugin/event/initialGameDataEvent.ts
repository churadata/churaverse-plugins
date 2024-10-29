import { CVEvent, IMainScene } from 'churaverse-engine-client'
import { GameIds } from '../interface/gameIds'

/**
 * サーバーから受け取る進行中のゲームデータを保存するイベント
 * @param runningGameIds 進行中のゲームid
 */
export class InitialGameDataEvent extends CVEvent<IMainScene> {
  public constructor(public readonly runningGameIds: GameIds[]) {
    super('initialGameData', true)
  }
}

declare module 'churaverse-engine-client' {
  export interface CVMainEventMap {
    initialGameData: InitialGameDataEvent
  }
}
