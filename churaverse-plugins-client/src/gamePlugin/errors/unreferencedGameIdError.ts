import { GamePluginError } from './gamePluginError'

/**
 * 指定されたgameIdが参照されない場合に発生するエラー
 */
export class UnreferencedGameIdError extends GamePluginError {
  public constructor(gameId: string) {
    super(`gameId: ${gameId}は参照されていない`)
  }
}
