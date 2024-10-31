import { CVEvent, IMainScene } from 'churaverse-engine-server'

export class NyokkiEvent extends CVEvent<IMainScene> {
  public constructor(public readonly playerId: string) {
    super('nyokki', false)
  }
}

declare module 'churaverse-engine-server' {
  export interface CVMainEventMap {
    nyokki: NyokkiEvent
  }
}
