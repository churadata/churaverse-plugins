import { GamePluginError } from '@churaverse/game-plugin-server/errors/gamePluginError'

export class SynchroBreakValueNotFoundError extends GamePluginError {
  public constructor(value: string) {
    super(`${value} is not found.`)
  }
}
