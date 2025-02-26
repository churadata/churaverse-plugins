import { CVEvent, IMainScene } from 'churaverse-engine-client'

export class NyokkiTurnTimerEvent extends CVEvent<IMainScene> {
  public constructor(public readonly countdown: number) {
    super('nyokkiTurnTimer', true)
  }
}

declare module 'churaverse-engine-client' {
  export interface CVMainEventMap {
    nyokkiTurnTimer: NyokkiTurnTimerEvent
  }
}
