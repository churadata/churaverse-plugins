import { CVEvent, IMainScene } from 'churaverse-engine-client'

export class NyokkiTurnSelectResponseEvent extends CVEvent<IMainScene> {
  public constructor(
    public readonly playerId: string,
    public readonly turnNumber: number,
    public readonly allTurn: number
  ) {
    super('nyokkiTurnSelectResponse', true)
  }
}

declare module 'churaverse-engine-client' {
  export interface CVMainEventMap {
    nyokkiTurnSelectResponse: NyokkiTurnSelectResponseEvent
  }
}
