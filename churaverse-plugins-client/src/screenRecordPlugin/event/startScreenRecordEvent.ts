import { CVEvent, IMainScene } from 'churaverse-engine-client'

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

declare module 'churaverse-engine-client' {
  export interface CVMainEventMap {
    startScreenRecord: StartScreenRecordEvent
  }
}
