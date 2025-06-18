import { GamePluginError } from '@churaverse/game-plugin-server/errors/gamePluginError'

export class SynchroBreakBetCoinsNotFoundError extends GamePluginError {
  public constructor(playerId: string) {
    super(`[シンクロブレイク] playerId: ${playerId}のベットコイン情報が存在しません`)
  }
}
