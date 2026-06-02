import { IMainScene, CVEvent } from 'churaverse-engine-server'

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

declare module 'churaverse-engine-server' {
  export interface CVMainEventMap {
    stopScreenRecord: StopScreenRecordEvent
  }
}
