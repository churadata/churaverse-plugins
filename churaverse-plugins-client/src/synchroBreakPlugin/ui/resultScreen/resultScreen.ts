import { DomManager, domLayerSetting } from 'churaverse-engine-client'
import { ResultRankingListItem } from './components/ResultRankingListItem'
import { ResultRankingListPanel } from './components/ResultRankingListPanel'
import { ResultExitButton } from './components/ResultExitButton'
import { SynchroBreakPluginStore } from '../../store/defSynchroBreakPluginStore'

// resultRankingのID
export const RESULT_LIST_ID = 'result-list'
export const RESULT_CONTAINER_ID = 'result-container'

/**
 * addElementToEachRowで追加される要素の親要素が持つクラス名
 */
export const ROW_CONTENT_CONTAINER_CLASS_NAME = 'result-ranking-list-row-container'

export class ResultScreen {
  private readonly resultContainer: HTMLElement
  private readonly resultScreenContainer: HTMLElement

  // private node!: HTMLElement

  public constructor(private readonly synchroBreakPluginStore: SynchroBreakPluginStore) {
    this.resultContainer = DomManager.addJsxDom(ResultRankingListPanel())
    domLayerSetting(this.resultContainer, 'highest')
    this.resultScreenContainer = DomManager.getElementById(RESULT_LIST_ID)
    this.resultContainer.style.display = 'none'
  }

  /**
   * 結果画面の作成
   */
  public createResultRanking(playersElementsArray: Array<[string, HTMLElement]>): void {
    this.resultContainer.style.display = ''
    this.resultScreenContainer.innerHTML = ''
    this.createResultRankingList(playersElementsArray)
  }

  /**
   * プレイヤーの一覧UIの作成
   */
  private createResultRankingList(playersElementsArray: Array<[string, HTMLElement]>): void {
    const rankingElementArray: Array<[number, HTMLElement]> = []
    playersElementsArray.forEach(([, playerElement], index) => {
      const playerId = playerElement.id.replace('board-element-', '')
      if (playerId === undefined) throw new Error('playerId is undefined')

      // rankの取得
      const rankElement = playerElement.querySelector(`#player-rank-${playerId}`)
      const rank = Number(rankElement?.textContent?.replace('位', ''))

      // playerNameの取得
      const playerNameElement = playerElement.querySelector(`#player-name-${playerId}`)
      const playerName = playerNameElement?.textContent
      if (playerName === undefined || playerName === null) throw new Error('playerName is undefined')

      // coinValueの取得
      const coinValueElement = playerElement.querySelector(`#player-coins-${playerId}`)
      const coinValue = Number(coinValueElement?.textContent?.replace('コイン', ''))
      if (coinValue === undefined || coinValue === null) throw new Error('coinValue is undefined')

      const playerListElement = this.resultList(rank, playerName, coinValue)
      rankingElementArray.push([rank, playerListElement])
    })

    rankingElementArray.sort((a, b) => a[0] - b[0])
    rankingElementArray.forEach((value) => {
      this.resultScreenContainer.appendChild(value[1])
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
    this.resultScreenContainer.appendChild(exitButton)
    exitButton.addEventListener('click', () => {
      this.deleteResultScreen()
      this.synchroBreakPluginStore.descriptionWindow.close()
    })
  }

  /**
   * 結果画面を削除する
   */
  private deleteResultScreen(): void {
    this.resultContainer.style.display = 'none'
  }
}
