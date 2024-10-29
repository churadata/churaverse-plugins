import { Store, IMainScene } from 'churaverse-engine-client'
import { Player } from '@churaverse/player-plugin-client/domain/player'
import { PlayerNotExistsInPlayerRepositoryError } from '@churaverse/player-plugin-client/errors/playerNotExistsInPlayerRepositoryError'
import { IGameLogRenderer } from '../../interface/IGameLogRenderer'
import { GameIds } from '../../interface/gameIds'
import { GameNotExitInGameRepositoryError } from '../../errors/gameNotExitInGameRepositoryError'

export class GameLogRenderer implements IGameLogRenderer {
  public constructor(private readonly store: Store<IMainScene>) {}

  /**
   * ゲーム開始をログで表示
   * @param playerId ゲームを開始したプレイヤーid
   */
  public gameStartLog(gameId: GameIds, playerId: string): void {
    const playerName = this.getPlayerName(playerId)
    const gameName = this.getGameName(gameId)
    const message = `${playerName}さんが${gameName}を開始しました！`
    this.store.of('coreUiPlugin').fadeOutLogRenderer.add(message, 300)
  }

  /**
   * 途中参加者向けのゲーム開始をログで表示
   */
  public gameMidwayJoinLog(gameId: GameIds): void {
    const gameName = this.getGameName(gameId)
    const message = `${gameName}に途中参加しました！`
    this.store.of('coreUiPlugin').fadeOutLogRenderer.add(message, 300)
  }

  /**
   * ゲーム終了をログで表示
   */
  public gameEndLog(gameId: GameIds): void {
    const gameName = this.getGameName(gameId)
    const message = `${gameName}が終了しました！`
    this.store.of('coreUiPlugin').fadeOutLogRenderer.add(message, 300)
  }

  /**
   * ゲーム中断をログで表示
   * @param playerId ゲームを中断したプレイヤーid
   */
  public gameAbortLog(gameId: GameIds, playerId: string): void {
    const gameName = this.getGameName(gameId)
    const playerName = this.getPlayerName(playerId)
    const message = `${playerName}さんが${gameName}を中断しました！`
    this.store.of('coreUiPlugin').fadeOutLogRenderer.add(message, 300)
  }

  /**
   * ゲーム関係のログを表示
   */
  public gameLog(message: string): void {
    this.store.of('coreUiPlugin').fadeOutLogRenderer.add(message, 300)
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

  /**
   * gameIdからゲーム名を取得
   */
  private getGameName(gameId: GameIds): string {
    const game = this.store.of('gamePlugin').gameRepository.get(gameId)
    if (game === undefined) {
      throw new GameNotExitInGameRepositoryError(gameId)
    }
    return game.getName()
  }
}
