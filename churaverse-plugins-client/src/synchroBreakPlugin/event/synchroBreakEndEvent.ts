import { CVEvent, IMainScene } from 'churaverse-engine-client'

/**
 * ゲームを終了した際のイベント
 * @param playerId ゲームを終了したプレイヤーのid
 */
export class SynchroBreakEndEvent extends CVEvent<IMainScene> {
  public constructor(public readonly playerId: string) {
    super('synchroBreakEnd', true)
  }
}

declare module 'churaverse-engine-client' {
  export interface CVMainEventMap {
    synchroBreakEnd: SynchroBreakEndEvent
  }
}
