import { GamePluginError } from './gamePluginError'

// プレイヤーのIDの取得に失敗した際に発生するエラー
export class PlayerIdFetchError extends GamePluginError {
  public constructor(playerId: string) {
    super(`${playerId}のプレイヤー情報の取得に失敗しました。`)
  }
}
