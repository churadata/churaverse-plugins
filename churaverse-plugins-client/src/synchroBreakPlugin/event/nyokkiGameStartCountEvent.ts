import { CVEvent, IMainScene } from 'churaverse-engine-client'

export class NyokkiGameStartCountEvent extends CVEvent<IMainScene> {
  public constructor(public readonly countdown: number) {
    super('nyokkiGameStartCount', true)
  }
}

declare module 'churaverse-engine-client' {
  export interface CVMainEventMap {
    nyokkiGameStartCount: NyokkiGameStartCountEvent
  }
}
