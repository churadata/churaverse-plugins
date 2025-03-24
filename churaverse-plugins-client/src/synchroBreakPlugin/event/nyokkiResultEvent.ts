import { CVEvent, IMainScene } from 'churaverse-engine-client'

export class NyokkiResultEvent extends CVEvent<IMainScene> {
  public constructor() {
    super('nyokkiResult', true)
  }
}

declare module 'churaverse-engine-client' {
  export interface CVMainEventMap {
    nyokkiResult: NyokkiResultEvent
  }
}
