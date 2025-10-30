import { CVEvent, IMainScene } from 'churaverse-engine-client'
import { GameIds } from '../interface/gameIds'

export class ParticipationResponseEvent extends CVEvent<IMainScene> {
  public constructor(
    public readonly gameId: GameIds,
    public readonly isJoin: boolean
  ) {
    super('participationResponse', true)
  }
}

declare module 'churaverse-engine-client' {
  export interface CVMainEventMap {
    participationResponse: ParticipationResponseEvent
  }
}
