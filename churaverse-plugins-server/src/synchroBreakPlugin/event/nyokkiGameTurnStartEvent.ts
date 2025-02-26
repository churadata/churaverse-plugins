import { CVEvent, IMainScene } from 'churaverse-engine-server'

export class NyokkiGameTurnStartEvent extends CVEvent<IMainScene> {
  public constructor(public readonly turnNumber: number) {
    super('nyokkiGameTurnStart', true)
  }
}

declare module 'churaverse-engine-server' {
  export interface CVMainEventMap {
    nyokkiGameTurnStart: NyokkiGameTurnStartEvent
  }
}
