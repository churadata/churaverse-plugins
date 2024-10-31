import { CVEvent, IMainScene } from 'churaverse-engine-client'

export class NyokkiTurnEndEvent extends CVEvent<IMainScene> {
  public constructor(
    public readonly turnNumber: number,
    public readonly allTurn: number,
    public readonly noNyokkiPlayerIds: string[]
  ) {
    super('nyokkiTurnEnd', true)
  }
}

declare module 'churaverse-engine-client' {
  export interface CVMainEventMap {
    nyokkiTurnEnd: NyokkiTurnEndEvent
  }
}
