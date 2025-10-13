import { CVEvent, IMainScene } from 'churaverse-engine-server'

/**
 * プレイヤーが参加中のゲームから離脱したことを通知するイベント
 */
export class ScreenRecordStatusChangedEvent extends CVEvent<IMainScene> {
  public constructor(public readonly isRecording: boolean) {
    super('screenRecordStatusChanged', true)
  }
}

declare module 'churaverse-engine-server' {
  export interface CVMainEventMap {
    screenRecordStatusChanged: ScreenRecordStatusChangedEvent
  }
}
