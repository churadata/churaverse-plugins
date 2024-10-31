import { CVEvent, IMainScene } from 'churaverse-engine-client'

export class NyokkiTurnSelectEvent extends CVEvent<IMainScene> {
  public constructor(
    public readonly playerId: string,
    public readonly allTurn: number
  ) {
    super('nyokkiTurnSelect', true)
  }
}

declare module 'churaverse-engine-client' {
  export interface CVMainEventMap {
    nyokkiTurnSelect: NyokkiTurnSelectEvent
  }
}
