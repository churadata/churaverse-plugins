import { Store, IMainScene } from 'churaverse-engine-client'
import '@churaverse/core-ui-plugin-client/store/defCoreUiPluginStore'
import '@churaverse/player-plugin-client/store/defPlayerPluginStore'
import { Player } from '@churaverse/player-plugin-client/domain/player'
import { PlayerNotExistsInPlayerRepositoryError } from '@churaverse/player-plugin-client/errors/playerNotExistsInPlayerRepositoryError'

export class GameLogRenderer {
  public constructor(private readonly store: Store<IMainScene>) {}

  /**
   * ゲームが開始のログを表示
   * @param gameName ゲーム名
   * @param playerId ゲームを開始したプレイヤーid
   */
  public gameStartLog(gameName: string, playerId: string): void {
    const playerName = this.getPlayerName(playerId)
    this.store.of('coreUiPlugin').fadeOutLogRenderer.add(`${playerName}さんが、${gameName}を開始しました`)
  }

  /**
   * ゲームが中断のログを表示
   * @param gameName ゲーム名
   * @param playerId ゲームを中断したプレイヤーid
   */
  public gameAbortLog(gameName: string, playerId: string): void {
    const playerName = this.getPlayerName(playerId)
    this.store.of('coreUiPlugin').fadeOutLogRenderer.add(`${playerName}さんが、${gameName}を中断しました`)
  }

  /**
   * ゲームが終了のログを表示
   * @param gameName ゲーム名
   */
  public gameEndLog(gameName: string): void {
    this.store.of('coreUiPlugin').fadeOutLogRenderer.add(`${gameName}が終了しました`)
  }

  /**
   * ゲーム関係のログを表示
   * @param message ログメッセージ
   * @param x ログを表示するx座標
   */
  public gameLog(message: string, x: number): void {
    this.store.of('coreUiPlugin').fadeOutLogRenderer.add(message, x)
  }

  /**
   * プレイヤーidからプレイヤー名を取得
   */
  private getPlayerName(playerId: string): string {
    const player: Player | undefined = this.store.of('playerPlugin').players.get(playerId)
    if (player === undefined) {
      throw new PlayerNotExistsInPlayerRepositoryError(playerId)
    }
    return player.name
  }
}
