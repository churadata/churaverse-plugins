import { CVEvent, IMainScene } from 'churaverse-engine-client'

export class GameStartEvent extends CVEvent<IMainScene> {
  public constructor(
    public readonly playerId: string,
    public readonly gameName: string
  ) {
    super('gameStart', true)
  }
}

declare module 'churaverse-engine-client' {
  export interface CVMainEventMap {
    gameStart: GameStartEvent
  }
}
