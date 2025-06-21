import { GamePluginError } from '@churaverse/game-plugin-client/errors/gamePluginError'

export class SynchroBreakPlayerCoinsNotFoundError extends GamePluginError {
  public constructor(playerId: string) {
    super(`[シンクロブレイク] playerId: ${playerId} のコイン情報が存在しません`)
  }
}
