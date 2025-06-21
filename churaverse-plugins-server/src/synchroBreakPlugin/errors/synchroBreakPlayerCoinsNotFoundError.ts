import { GamePluginError } from '@churaverse/game-plugin-server/errors/gamePluginError'

export class SynchroBreakPlayerCoinsNotFoundError extends GamePluginError {
  public constructor(playerId: string) {
    super(`[シンクロブレイク] playerId: ${playerId}の所持コイン情報が存在しません`)
  }
}
