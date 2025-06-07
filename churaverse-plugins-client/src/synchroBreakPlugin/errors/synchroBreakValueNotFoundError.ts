import { GamePluginError } from '@churaverse/game-plugin-client/errors/gamePluginError'

export class SynchroBreakValueNotFoundError extends GamePluginError {
  public constructor(value: string) {
    super(`${value}が見つかりませんでした。`)
  }
}
