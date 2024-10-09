import { CVEvent, ITitleScene } from 'churaverse-engine-client'
import { PlayerColor } from '@churaverse/player-plugin-client/types/playerColor'

export class TitlePlayerColorChangeEvent extends CVEvent<ITitleScene> {
  public constructor(public readonly color: PlayerColor) {
    super('titlePlayerColorChange', true)
  }
}

declare module 'churaverse-engine-client' {
  export interface CVTitleEventMap {
    titlePlayerColorChange: TitlePlayerColorChangeEvent
  }
}
