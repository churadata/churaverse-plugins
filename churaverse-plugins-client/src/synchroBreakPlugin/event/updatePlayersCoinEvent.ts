import { CVEvent, IMainScene } from 'churaverse-engine-client'

export class UpdatePlayersCoinEvent extends CVEvent<IMainScene> {
  public constructor(public readonly playersCoin: Array<{ playerId: string; coins: number }>) {
    super('updatePlayersCoin', true)
  }
}

declare module 'churaverse-engine-client' {
  export interface CVMainEventMap {
    updatePlayersCoin: UpdatePlayersCoinEvent
  }
}
