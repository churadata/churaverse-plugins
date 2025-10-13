import { CVEvent, IMainScene } from 'churaverse-engine-client'

/**
 * 画面録画が開始した時に発火するイベント
 */
export class ScreenRecordStartEvent extends CVEvent<IMainScene> {
  public constructor() {
    super('screenRecordStart', true)
  }
}

declare module 'churaverse-engine-client' {
  interface CVMainEventMap {
    screenRecordStart: ScreenRecordStartEvent
  }
}
