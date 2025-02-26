import { CVEvent, IMainScene } from 'churaverse-engine-server'

export class NyokkiResultEvent extends CVEvent<IMainScene> {
  public constructor() {
    super('nyokkiResult', true)
  }
}

declare module 'churaverse-engine-server' {
  export interface CVMainEventMap {
    nyokkiResult: NyokkiResultEvent
  }
}
