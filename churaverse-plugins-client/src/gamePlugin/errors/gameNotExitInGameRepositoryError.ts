import { GamePluginError } from './gamePluginError'

/**
 * GameRepositoryに存在しないゲームを取得しようとした際のエラー
 */
export class GameNotExitInGameRepositoryError extends GamePluginError {
  public constructor(gameId: string) {
    super(`gameId: ${gameId}はGameRepositoryに存在しない`)
  }
}
