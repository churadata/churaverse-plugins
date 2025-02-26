import { Store, IMainScene, DomManager, domLayerSetting } from 'churaverse-engine-client'
import { ResultRankingListItem } from './components/ResultRankingListItem'
import { ResultRankingListPanel } from './components/ResultRankingListPanel'
import { ResultExitButton } from './components/ResultExitButton'
import { INyokkiResultScreen } from '../../interface/INyokkiResultScreen'

// resultRankingのID
export const RESULT_LIST_ID = 'result-list'
export const RESULT_CONTAINER_ID = 'result-container'

/**
 * addElementToEachRowで追加される要素の親要素が持つクラス名
 */
export const ROW_CONTENT_CONTAINER_CLASS_NAME = 'result-ranking-list-row-container'

export class ResultScreen implements INyokkiResultScreen {
  public element!: HTMLElement
  private resultScreenContainer!: HTMLElement

  public readonly visible: boolean = false
  // private node!: HTMLElement

  public constructor(private readonly store: Store<IMainScene>) {}

  public initialize(): void {
    this.element = DomManager.addJsxDom(ResultRankingListPanel())
    domLayerSetting(this.element, 'highest')
    this.resultScreenContainer = DomManager.getElementById(RESULT_LIST_ID)
    this.resultScreenContainer.style.display = 'none'
  }

  /**
   * 結果画面の作成
   */
  public createResultRanking(): void {
    this.element.style.display = ''
    this.resultScreenContainer.innerHTML = ''
    // this.createResultRankingList(playersElementsArray)
    this.createResultRankingList()
  }

  /**
   * プレイヤーの一覧UIの作成
   */
  private createResultRankingList(): void {
    const sortedPlayers = this.store.of('synchroBreakPlugin').playersCoinRepository.getPlayersSortedByCoins()
    let currentRank = 1
    let previousCoins = sortedPlayers[0].coins ?? 0

    sortedPlayers.forEach((player) => {
      const playerName = this.store.of('playerPlugin').players.get(player.playerId)?.name
      if (playerName === undefined) return
      const playerListElement = this.resultList(currentRank, playerName, player.coins)
      this.element.appendChild(playerListElement)

      if (player.coins !== previousCoins) {
        currentRank++
      }
      previousCoins = player.coins
    })

    this.createExitButton()
  }

  /**
   * 受け取った順位とプレイヤー名とコインの枚数の行を作成
   */
  private resultList(rank: number, playerName: string, coinValue: number): HTMLElement {
    const row = DomManager.jsxToDom(ResultRankingListItem({ rank, playerName, coinValue }))
    return row
  }

  /**
   * 結果画面を閉じるボタンを作成する
   */
  private createExitButton(): void {
    const exitButton = DomManager.jsxToDom(ResultExitButton())
    this.element.appendChild(exitButton)
    exitButton.addEventListener('click', () => {
      this.remove()
    })
  }

  /**
   * 結果画面を削除する
   */
  public remove(): void {
    this.resultScreenContainer.remove()
  }
}
