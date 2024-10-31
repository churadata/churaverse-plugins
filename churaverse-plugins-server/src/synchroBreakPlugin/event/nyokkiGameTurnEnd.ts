import { CVEvent, IMainScene } from 'churaverse-engine-server'

export class NyokkiGameTurnEnd extends CVEvent<IMainScene> {
  public constructor() {
    super('nyokkiGameTurnEnd', true)
  }
}

declare module 'churaverse-engine-server' {
  export interface CVMainEventMap {
    nyokkiGameTurnEnd: NyokkiGameTurnEnd
  }
}
