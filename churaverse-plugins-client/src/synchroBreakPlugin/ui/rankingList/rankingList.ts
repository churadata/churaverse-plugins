import { DomManager } from 'churaverse-engine-client'
import { PlayersRepository } from '@churaverse/player-plugin-client/repository/playerRepository'
import { RankingListItem } from './components/RankingListItem'
import { RankingListPanel } from './components/RankingListPanel'
import { IRankingListRenderer } from '../../interface/IRankingListRenderer'

export const RANKING_LIST_ID = 'ranking-list'
export const RANKING_CONTAINER_ID = 'ranking-container'

/**
 * addElementToEachRowで追加される要素の親要素が持つクラス名
 */
export const ROW_CONTENT_CONTAINER_CLASS_NAME = 'ranking-list-row-content-container'

export class RankingList implements IRankingListRenderer {
  private readonly rankingContainer: HTMLElement
  private readonly rankingContainerList: HTMLElement

  public constructor() {
    this.rankingContainer = DomManager.addJsxDom(RankingListPanel())
    this.rankingContainerList = DomManager.getElementById(RANKING_LIST_ID)
  }

  /**
   * playerが名前変更&入退時に実行
   */
  public updateRankingList(players: PlayersRepository, sortedCoins: Array<[string, number]>): void {
    this.rankingContainerList.innerHTML = ''
    this.createPlayerList(players, sortedCoins)
  }

  /**
   * プレイヤーの一覧用UIの作成
   */
  private createPlayerList(players: PlayersRepository, sortedCoins: Array<[string, number]>): void {
    let rank = 1
    let sameRankCount = 0
    let previousCoinValue: number | undefined

    sortedCoins.forEach((coin) => {
      const [playerId, coinValue] = coin
      const player = players.get(playerId)
      if (player === undefined) return
      if (coinValue !== previousCoinValue) {
        rank += sameRankCount
        sameRankCount = 1
      } else {
        sameRankCount++
      }
      const playerListElement = this.rankingList(rank, player.name, coinValue)
      this.rankingContainerList.appendChild(playerListElement)

      previousCoinValue = coinValue
    })
  }

  /**
   * 受け取ったプレイヤー名とコインの枚数の行を作成
   */
  private rankingList(rank: number, playerName: string, coinValue: number): HTMLElement {
    const row = DomManager.jsxToDom(RankingListItem({ rank, playerName, coinValue }))
    return row
  }

  public deleteRankingList(): void {
    this.rankingContainer.style.display = 'none'
  }
}
