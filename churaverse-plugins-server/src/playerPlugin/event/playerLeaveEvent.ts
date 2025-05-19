import { IMainScene, CVEvent } from 'churaverse-engine-server'

export class PlayerLeaveEvent extends CVEvent<IMainScene> {
  public constructor(public readonly id: string) {
    super('playerLeave', true)
  }
}

declare module 'churaverse-engine-server' {
  export interface CVMainEventMap {
    playerLeave: PlayerLeaveEvent
  }
}
