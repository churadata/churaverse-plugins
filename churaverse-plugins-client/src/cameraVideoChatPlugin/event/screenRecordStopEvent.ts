import { CVEvent, IMainScene } from 'churaverse-engine-client'

/**
 * 画面録画が停止した時に発火するイベント
 */
export class ScreenRecordStopEvent extends CVEvent<IMainScene> {
  public constructor() {
    super('screenRecordStop', true)
  }
}

declare module 'churaverse-engine-client' {
  interface CVMainEventMap {
    screenRecordStop: ScreenRecordStopEvent
  }
}
