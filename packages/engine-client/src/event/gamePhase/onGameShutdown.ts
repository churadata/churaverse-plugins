import { CVEvent } from '../cvEvent'
import { Scenes } from '../../scene/types'

export class OnGameShutdownEvent extends CVEvent<Scenes> {
  public constructor() {
    super('onGameShutdown', false)
  }
}

declare module '../events' {
  export interface CVTitleEventMap {
    onGameShutdown: OnGameShutdownEvent
  }
  export interface CVMainEventMap {
    onGameShutdown: OnGameShutdownEvent
  }
}
