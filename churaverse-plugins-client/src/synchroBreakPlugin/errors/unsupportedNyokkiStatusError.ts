import { GamePluginError } from '@churaverse/game-plugin-client/errors/gamePluginError'

export class UnsupportedNyokkiStatusError extends GamePluginError {
  public constructor(status: string) {
    super(`ステータス"${status}"はNyokkiStatusに存在しません`)
  }
}
