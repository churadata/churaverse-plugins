import { CVEvent, IMainScene } from 'churaverse-engine-server'
import { FinishState } from '../message/gameEndMessage'

export class GameEndEvent extends CVEvent<IMainScene> {
  public constructor(
    public readonly playerId: string,
    public readonly gameName: string,
    public readonly finishStatus: FinishState
  ) {
    super('gameEnd', true)
  }
}

declare module 'churaverse-engine-server' {
  export interface CVMainEventMap {
    gameEnd: GameEndEvent
  }
}
