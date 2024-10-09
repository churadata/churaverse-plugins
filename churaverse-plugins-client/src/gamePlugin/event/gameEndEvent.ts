import { CVEvent, IMainScene } from 'churaverse-engine-client'
import { FinishStatus } from '../message/gameEndMessage'

export class GameEndEvent extends CVEvent<IMainScene> {
  public constructor(
    public readonly playerId: string,
    public readonly gameName: string,
    public readonly finishStatus: FinishStatus
  ) {
    super('gameEnd', true)
  }
}

declare module 'churaverse-engine-client' {
  export interface CVMainEventMap {
    gameEnd: GameEndEvent
  }
}
