import { Store, IMainScene, DomManager, domLayerSetting, IEventBus } from 'churaverse-engine-client'
import { ResultRankingListItem } from './components/ResultRankingListItem'
import { ResultRankingListPanel } from './components/ResultRankingListPanel'
import { ResultRankingSeparator } from './components/ResultRankingSeparator'
import { ResultExitButton } from './components/ResultExitButton'
import { ISynchroBreakResultScreen } from '../../interface/ISynchroBreakResultScreen'
import { GamePlayerQuitEvent } from '@churaverse/game-plugin-client/event/gamePlayerQuitEvent'
import { ResultScreenType } from '../../type/resultScreenType'
import finalResultRankingBoard from '../../assets/final_rankingBoard.png'
import middleResultRankingBoard from '../../assets/mid_rankingBoard.png'

// resultRankingのID
export const RESULT_LIST_ID = 'result-list'
export const RESULT_CONTAINER_ID = 'result-container'

/**
 * addElementToEachRowで追加される要素の親要素が持つクラス名
 */
export const ROW_CONTENT_CONTAINER_CLASS_NAME = 'result-ranking-list-row-container'

export class ResultScreen implements ISynchroBreakResultScreen {
  protected readonly gameId = 'synchroBreak'

  public element!: HTMLElement
  private resultListContainer!: HTMLElement
  private resultScreenContainer!: HTMLElement

  public readonly visible: boolean = false

  private readonly TOP_DISPLAY_COUNT = 4 // 上位表示人数

  public constructor(
    private readonly store: Store<IMainScene>,
    private readonly eventBus: IEventBus<IMainScene>
  ) {}

  public initialize(): void {
    this.element = DomManager.addJsxDom(ResultRankingListPanel())
    domLayerSetting(this.element, 'highest')
    this.resultListContainer = DomManager.getElementById(RESULT_LIST_ID)
    this.resultScreenContainer = DomManager.getElementById(RESULT_CONTAINER_ID)

    this.resultListContainer.style.display = 'none'
  }

  /**
   * 結果画面の作成
   */
  public createFinalResultRanking(): void {
    this.element.style.display = ''
    this.resultListContainer.innerHTML = ''

    this.createResultRankingList('final')
    this.createExitButton()
  }

  public createMiddleResultRanking(): void {
    this.element.style.display = ''
    this.resultListContainer.innerHTML = ''

    this.createResultRankingList('middle')
  }

  /**
   * プレイヤーの一覧UIの作成
   */
  private createResultRankingList(screenType: ResultScreenType): void {
    const sortedPlayers = this.store.of('synchroBreakPlugin').playersCoinRepository.getPlayersSortedByCoins()
    this.resultScreenContainer.style.backgroundImage =
      screenType === 'final' ? `url(${finalResultRankingBoard})` : `url(${middleResultRankingBoard})`
    this.resultListContainer.style.display = 'block'

    const rankedPlayers = this.calculatePlayerRanks(sortedPlayers)

    this.displayPlayers(rankedPlayers)
  }

  /**
   * プレイヤー一覧の表示
   */
  private displayPlayers(rankedPlayers: Array<{ playerId: string; coins: number; rank: number }>): void {
    for (let i = 0; i < Math.min(this.TOP_DISPLAY_COUNT, rankedPlayers.length); i++) {
      const rankedPlayer = rankedPlayers[i]
      const playerName = this.getPlayerName(rankedPlayer.playerId)
      if (playerName === undefined) return

      const playerListElement = DomManager.jsxToDom(
        ResultRankingListItem({ rank: rankedPlayer.rank, playerName, coinValue: rankedPlayer.coins })
      )
      this.resultListContainer.appendChild(playerListElement)
    }

    const ownPlayerId = this.store.of('playerPlugin').ownPlayerId
    const ownRankIndex = rankedPlayers.findIndex((rp) => rp.playerId === ownPlayerId)
    const ownPlayerRank = ownRankIndex >= 0 ? rankedPlayers[ownRankIndex].rank : -1

    // 自分が閾値より下の場合、セパレーターと自分を表示
    if (ownPlayerRank > this.TOP_DISPLAY_COUNT && ownRankIndex >= 0) {
      const separatorElement = DomManager.jsxToDom(ResultRankingSeparator())
      this.resultListContainer.appendChild(separatorElement)

      const playerName = this.getPlayerName(rankedPlayers[ownRankIndex].playerId)
      if (playerName === undefined) return

      const playerListElement = DomManager.jsxToDom(
        ResultRankingListItem({
          rank: rankedPlayers[ownRankIndex].rank,
          playerName,
          coinValue: rankedPlayers[ownRankIndex].coins,
        })
      )
      this.resultListContainer.appendChild(playerListElement)
    }
  }

  private getPlayerName(playerId: string): string | undefined {
    return this.store.of('playerPlugin').players.get(playerId)?.name
  }

  private calculatePlayerRanks(
    sortedPlayers: Array<{ playerId: string; coins: number }>
  ): Array<{ playerId: string; coins: number; rank: number }> {
    const rankedPlayers: Array<{ playerId: string; coins: number; rank: number }> = []
    let currentRank = 1
    let previousCoins = sortedPlayers[0]?.coins ?? 0

    sortedPlayers.forEach((player, index) => {
      if (index > 0 && player.coins < previousCoins) {
        currentRank = index + 1
      }
      rankedPlayers.push({
        playerId: player.playerId,
        coins: player.coins,
        rank: currentRank,
      })
      previousCoins = player.coins
    })

    return rankedPlayers
  }

  /**
   * 結果画面を閉じるボタンを作成する
   */
  private createExitButton(): void {
    const exitButton = DomManager.jsxToDom(ResultExitButton())
    this.element.appendChild(exitButton)
    exitButton.addEventListener('click', () => {
      const playerId = this.store.of('playerPlugin').ownPlayerId
      this.eventBus.post(new GamePlayerQuitEvent(this.gameId, playerId))
      this.remove()
    })
  }

  public close(): void {
    this.element.style.display = 'none'
  }

  /**
   * 結果画面を削除する
   */
  public remove(): void {
    this.element.remove()
  }
}
