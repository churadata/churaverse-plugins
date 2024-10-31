import { CVEvent, IMainScene } from 'churaverse-engine-server'

export class NyokkiTurnSelectEvent extends CVEvent<IMainScene> {
  public constructor(public readonly allTurn: number) {
    super('nyokkiTurnSelect', true)
  }
}

declare module 'churaverse-engine-server' {
  export interface CVMainEventMap {
    nyokkiTurnSelect: NyokkiTurnSelectEvent
  }
}
