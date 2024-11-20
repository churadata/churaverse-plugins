import { CVEvent, IMainScene } from 'churaverse-engine-server'

/**
 * タイムリミットが設定された際のイベント
 * @param playerId タイムリミットを設定したプレイヤーのid
 * @param timeLimit シンクロブレイクゲームのタイムリミット
 */
export class TimeLimitConfirmEvent extends CVEvent<IMainScene> {
  public constructor(
    public readonly playerId: string,
    public readonly timeLimit: string
  ) {
    super('timeLimitConfirm', true)
  }
}

declare module 'churaverse-engine-server' {
  export interface CVMainEventMap {
    timeLimitConfirm: TimeLimitConfirmEvent
  }
}
