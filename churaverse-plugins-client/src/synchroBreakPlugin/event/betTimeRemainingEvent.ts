import { CVEvent, IMainScene } from 'churaverse-engine-client'

/**
 * ベットタイム残りの時間を通知するイベント
 * @param remainingTime 残りのベットタイム
 */
export class BetTimeRemainingEvent extends CVEvent<IMainScene> {
  public constructor(public readonly remainingTime: number) {
    super('betTimeRemaining', true)
  }
}

declare module 'churaverse-engine-client' {
  export interface CVMainEventMap {
    betTimeRemaining: BetTimeRemainingEvent
  }
}
