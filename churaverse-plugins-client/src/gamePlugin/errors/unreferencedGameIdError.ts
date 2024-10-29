import { GamePluginError } from './gamePluginError'

/**
 * 指定されたgameIdがswitch文で参照されていない場合に発生するエラー
 */
export class UnreferencedGameIdError extends GamePluginError {
  public constructor(gameId: string) {
    super(`gameId: ${gameId}はswitch文で参照されていない`)
  }
}
