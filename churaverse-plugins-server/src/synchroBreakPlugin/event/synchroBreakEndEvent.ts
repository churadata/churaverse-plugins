import { CVEvent, IMainScene } from 'churaverse-engine-server'

/**
 * ゲーム終了時のイベント
 */
export class SynchroBreakEndEvent extends CVEvent<IMainScene> {
  public constructor(public readonly playerId: string) {
    super('synchroBreakEnd', true)
  }
}

declare module 'churaverse-engine-server' {
  export interface CVMainEventMap {
    synchroBreakEnd: SynchroBreakEndEvent
  }
}
