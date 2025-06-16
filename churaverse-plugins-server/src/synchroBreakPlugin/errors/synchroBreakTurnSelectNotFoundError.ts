import { GamePluginError } from '@churaverse/game-plugin-server/errors/gamePluginError'

export class SynchroBreakTurnSelectNotFoundError extends GamePluginError {
  public constructor() {
    super(`[シンクロブレイク] ターン情報が存在しません`)
  }
}
