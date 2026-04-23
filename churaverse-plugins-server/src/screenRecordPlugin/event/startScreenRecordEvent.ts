import { IMainScene, CVEvent } from 'churaverse-engine-server'

/**
 * 画面録画が開始された時に発火するイベント
 */
export class StartScreenRecordEvent extends CVEvent<IMainScene> {
  public constructor(
    /** 録画を開始したプレイヤーのID */
    public readonly playerId: string
  ) {
    super('startScreenRecord', true)
  }
}

declare module 'churaverse-engine-server' {
  export interface CVMainEventMap {
    startScreenRecord: StartScreenRecordEvent
  }
}
