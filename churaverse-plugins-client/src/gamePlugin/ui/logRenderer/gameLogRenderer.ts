import { FadeOutLogRenderer } from '@churaverse/core-ui-plugin-client/fadeOutLog/fadeOutLogRenderer'
import { PlayersRepository } from '@churaverse/player-plugin-client/repository/playerRepository'
import { Player } from '@churaverse/player-plugin-client/domain/player'
import { IGameLogRenderer } from '../../interface/IGameLogRenderer'
import { PlayerIdFetchError } from '../../error/playerIdFetchError'

export class GameLogRenderer implements IGameLogRenderer {
  public constructor(
    private readonly fadeOutLogRenderer: FadeOutLogRenderer,
    private readonly playersRepository: PlayersRepository
  ) {}

  // ゲーム開始をログで表示
  public gameStartLog(playerId: string, gameName: string): void {
    const playerName = this.getPlayerName(playerId)
    const message = `${playerName}さんが${gameName}を開始しました。`
    this.fadeOutLogRenderer.add(message, 300)
  }

  // ゲーム終了をログで表示
  public gameEndLog(playerId: string, gameName: string): void {
    const playerName = this.getPlayerName(playerId)
    const message = `${playerName}さんが${gameName}を開始しました。`
    this.fadeOutLogRenderer.add(message, 300)
  }

  // ゲーム中断をログで表示
  public abortGameLog(playerId: string): void {
    const playerName = this.getPlayerName(playerId)
    const message = `${playerName}さんがゲームを中断しました。`
    this.fadeOutLogRenderer.add(message, 300)
  }

  // ゲーム関連のログを表示
  public gameLog(message: string): void {
    this.fadeOutLogRenderer.add(message, 300)
  }

  // プレイヤーIDからプレイヤー名を取得
  private getPlayerName(playerId: string): string {
    const player: Player | undefined = this.playersRepository.get(playerId)
    if (player === undefined) {
      throw new PlayerIdFetchError(playerId)
    }
    return player.name
  }
}
