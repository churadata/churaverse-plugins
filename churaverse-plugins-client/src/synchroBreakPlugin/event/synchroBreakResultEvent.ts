import { CVEvent, IMainScene } from 'churaverse-engine-client'
import { ResultScreenType } from '../type/resultScreenType'

/**
 * ゲーム結果ウィンドウ表示イベント
 */
export class SynchroBreakResultEvent extends CVEvent<IMainScene> {
  public constructor(public readonly resultScreenType: ResultScreenType) {
    super('synchroBreakResult', true)
  }
}

declare module 'churaverse-engine-client' {
  export interface CVMainEventMap {
    synchroBreakResult: SynchroBreakResultEvent
  }
}
