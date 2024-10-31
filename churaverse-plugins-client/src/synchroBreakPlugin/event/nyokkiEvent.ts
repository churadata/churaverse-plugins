import { CVEvent, IMainScene } from 'churaverse-engine-client'

export class NyokkiEvent extends CVEvent<IMainScene> {
  public constructor(public readonly playerId: string) {
    super('nyokki', true)
  }
}

declare module 'churaverse-engine-client' {
  export interface CVMainEventMap {
    nyokki: NyokkiEvent
  }
}
