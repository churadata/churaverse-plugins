import { Store, IMainScene, DomManager, domLayerSetting, IEventBus } from 'churaverse-engine-client'
import { ResultRankingListItem } from './components/ResultRankingListItem'
import { ResultRankingListPanel } from './components/ResultRankingListPanel'
import { ResultExitButton } from './components/ResultExitButton'
import { ISynchroBreakResultScreen } from '../../interface/ISynchroBreakResultScreen'
import { GamePlayerQuitEvent } from '@churaverse/game-plugin-client/event/gamePlayerQuitEvent'

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
  private resultScreenContainer!: HTMLElement

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
  }

  /**
   * 結果画面の作成
   */
  public createResultRanking(): void {
    this.element.style.display = ''
    this.resultScreenContainer.innerHTML = ''

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

    sortedPlayers.forEach((player, index) => {
      const playerName = this.store.of('playerPlugin').players.get(player.playerId)?.name
      if (playerName === undefined) return

      if (index > 0 && player.coins < previousCoins) {
        currentRank = index + 1
      }
      const playerListElement = DomManager.jsxToDom(
        ResultRankingListItem({ rank: currentRank, playerName, coinValue: player.coins })
      )
      this.resultScreenContainer.appendChild(playerListElement)
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
      const playerId = this.store.of('playerPlugin').ownPlayerId
      
      // 退出前に確認ダイアログを表示
      const gamePluginStore = this.store.of('gamePlugin')
      const synchroBreakStore = this.store.of('synchroBreakPlugin')
      const message = synchroBreakStore.exitConfirmMessage
      
      const ok = gamePluginStore.gameExitAlertConfirmManager.showAlert(this.gameId, message)
      if (!ok) {
        // ユーザーがキャンセルした場合は何もしない
        return
      }
      
      // ユーザーがOKした場合のみ退出処理を実行
      this.eventBus.post(new GamePlayerQuitEvent(this.gameId, playerId))
      this.remove()
    })
  }

  /**
   * 結果画面を削除する
   */
  public remove(): void {
    this.element.remove()
  }
}
