import { CVEvent, IMainScene } from 'churaverse-engine-client'

export class NyokkiTurnStartEvent extends CVEvent<IMainScene> {
  public constructor(public readonly turnNumber: number) {
    super('nyokkiTurnStart', true)
  }
}

declare module 'churaverse-engine-client' {
  export interface CVMainEventMap {
    nyokkiTurnStart: NyokkiTurnStartEvent
  }
}
