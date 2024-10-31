import { CVEvent, IMainScene } from 'churaverse-engine-client'

export class ChangePlayersCoinEvent extends CVEvent<IMainScene> {
  public constructor(
    public readonly playerId: string,
    public readonly coins: number
  ) {
    super('changePlayersCoin', true)
  }
}

declare module 'churaverse-engine-client' {
  export interface CVMainEventMap {
    changePlayersCoin: ChangePlayersCoinEvent
  }
}
