import { CVEvent, ITitleScene } from 'churaverse-engine-client'
import { PlayerRole } from '../../../playerPlugin/types/playerRole'

export class TitlePlayerRoleChangeEvent extends CVEvent<ITitleScene> {
  public constructor(public readonly playerRole: PlayerRole) {
    super('titlePlayerRoleChange', true)
  }
}

declare module 'churaverse-engine-client' {
  export interface CVTitleEventMap {
    titlePlayerRoleChange: TitlePlayerRoleChangeEvent
  }
}