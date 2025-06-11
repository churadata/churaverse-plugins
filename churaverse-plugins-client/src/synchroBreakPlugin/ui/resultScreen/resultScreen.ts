import { Store, IMainScene, DomManager, domLayerSetting, IEventBus } from 'churaverse-engine-client'
import { ResultRankingListItem } from './components/ResultRankingListItem'
import { ResultRankingListPanel } from './components/ResultRankingListPanel'
import { ResultExitButton } from './components/ResultExitButton'
import { INyokkiResultScreen } from '../../interface/INyokkiResultScreen'
import { GamePluginStore } from '@churaverse/game-plugin-client/store/defGamePluginStore'
import { GameEndEvent } from '@churaverse/game-plugin-client/event/gameEndEvent'

// resultRankingのID
export const RESULT_LIST_ID = 'result-list'
export const RESULT_CONTAINER_ID = 'result-container'

/**
 * addElementToEachRowで追加される要素の親要素が持つクラス名
 */
export const ROW_CONTENT_CONTAINER_CLASS_NAME = 'result-ranking-list-row-container'

export class ResultScreen implements INyokkiResultScreen {
  protected readonly gameId = 'synchroBreak'

  public element!: HTMLElement
  private resultScreenContainer!: HTMLElement
  private gamePluginStore!: GamePluginStore

  public readonly visible: boolean = false

  public constructor(
    private readonly store: Store<IMainScene>,
    private readonly eventBus: IEventBus<IMainScene>
  ) {}

  public initialize(): void {
    this.element = DomManager.addJsxDom(ResultRankingListPanel())
    domLayerSetting(this.element, 'highest')
    this.resultScreenContainer = DomManager.getElementById(RESULT_LIST_ID)
    this.resultScreenContainer.style.display = 'none'
    this.gamePluginStore = this.store.of('gamePlugin')
  }

  /**
   * 結果画面の作成
   */
  public createResultRanking(): void {
    this.element.style.display = ''
    this.resultScreenContainer.innerHTML = ''

    // ランキングボードを削除
    const rankingBoard = this.gamePluginStore.gameUiManager.getUi(this.gameId, 'rankingBoard')
    if (rankingBoard === undefined) throw new Error('rankingBoard is not found')
    rankingBoard.remove()

    // nyokkiButtonを削除
    const nyokkiButton = this.gamePluginStore.gameUiManager.getUi(this.gameId, 'nyokkiButton')
    if (nyokkiButton === undefined) throw new Error('nyokkiButton is not found')
    nyokkiButton.remove()

    // 説明ウィンドウの文章変更処理
    const descriptionWindow = this.gamePluginStore.gameUiManager.getUi(this.gameId, 'descriptionWindow')
    if (descriptionWindow === undefined) throw new Error('descriptionWindow is not found')
    descriptionWindow.setDescriptionText(
      '〜最終ランキング〜</br>お疲れ様でした。</br>閉じるボタンを押すと通常のちゅらバースに戻ります。'
    )

    this.createResultRankingList()
  }

  /**
   * プレイヤーの一覧UIの作成
   */
  private createResultRankingList(): void {
    const sortedPlayers = this.store.of('synchroBreakPlugin').playersCoinRepository.getPlayersSortedByCoins()
    let currentRank = 1
    let previousCoins = sortedPlayers[0].coins ?? 0
    this.resultScreenContainer.style.display = 'block'

    sortedPlayers.forEach((player) => {
      const playerName = this.store.of('playerPlugin').players.get(player.playerId)?.name
      if (playerName === undefined) return
      const playerListElement = DomManager.jsxToDom(
        ResultRankingListItem({ rank: currentRank, playerName, coinValue: player.coins })
      )
      this.resultScreenContainer.appendChild(playerListElement)

      if (player.coins !== previousCoins) {
        currentRank++
      }
      previousCoins = player.coins
    })

    this.createExitButton()
  }

  /**
   * 結果画面を閉じるボタンを作成する
   */
  private createExitButton(): void {
    const exitButton = DomManager.jsxToDom(ResultExitButton())
    this.element.appendChild(exitButton)
    exitButton.addEventListener('click', () => {
      this.eventBus.post(new GameEndEvent(this.gameId))
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
