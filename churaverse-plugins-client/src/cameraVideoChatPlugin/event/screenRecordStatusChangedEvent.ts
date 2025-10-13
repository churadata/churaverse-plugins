import { CVEvent, IMainScene } from 'churaverse-engine-client'

/**
 * 画面録画開始・終了時に発火するイベント
 */
export class ScreenRecordStatusChangedEvent extends CVEvent<IMainScene> {
  public constructor(public readonly isRecording: boolean) {
    super('screenRecordStatusChanged', true)
  }
}

declare module 'churaverse-engine-client' {
  interface CVMainEventMap {
    screenRecordStatusChanged: ScreenRecordStatusChangedEvent
  }
}
