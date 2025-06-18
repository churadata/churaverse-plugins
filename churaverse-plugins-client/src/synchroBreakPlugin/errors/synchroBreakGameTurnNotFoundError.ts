import { GamePluginError } from '@churaverse/game-plugin-client/errors/gamePluginError'

export class SynchroBreakGameTurnNotFoundError extends GamePluginError {
  public constructor() {
    super(`[シンクロブレイク] gameTurnが存在しません`)
  }
}
