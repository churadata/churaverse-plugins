import { GamePluginError } from '@churaverse/game-plugin-client/errors/gamePluginError'

export class PlayerCoinNotFoundError extends GamePluginError {
  public constructor(playerId: string) {
    super(`playerId: ${playerId}のコイン情報が見つかりません`)
  }
}
