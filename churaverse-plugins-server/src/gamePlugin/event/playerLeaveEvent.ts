import { CVEvent, IMainScene } from 'churaverse-engine-server'

/**
 * プレイヤーが退出した際に発火されるイベント
 */
export class PlayerLeaveEvent extends CVEvent<IMainScene> {
  public constructor(public readonly playerId: string) {
    super('playerLeave', true)
  }
}

declare module 'churaverse-engine-server' {
  export interface CVMainEventMap {
    playerLeave: PlayerLeaveEvent
  }
}
