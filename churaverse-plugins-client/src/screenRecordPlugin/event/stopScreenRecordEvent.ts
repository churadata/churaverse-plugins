import { CVEvent, IMainScene } from 'churaverse-engine-client'

/**
 * 画面録画が停止された時に発火するイベント
 */
export class StopScreenRecordEvent extends CVEvent<IMainScene> {
  public constructor(
    /** 録画を停止したプレイヤーのID */
    public readonly playerId: string
  ) {
    super('stopScreenRecord', true)
  }
}

declare module 'churaverse-engine-client' {
  export interface CVMainEventMap {
    stopScreenRecord: StopScreenRecordEvent
  }
}
