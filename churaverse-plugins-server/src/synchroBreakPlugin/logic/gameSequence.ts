import { IMainScene, IEventBus, Store } from 'churaverse-engine-server'
import { NetworkPluginStore } from '@churaverse/network-plugin-server/store/defNetworkPluginStore'
import '@churaverse/player-plugin-server/store/defPlayerPluginStore'
import { GamePluginStore } from '@churaverse/game-plugin-server/store/defGamePluginStore'
import { GameIds } from '@churaverse/game-plugin-server/interface/gameIds'
import { IGameSequence } from '../interface/IGameSequence'
import { SynchroBreakTurnEndEvent } from '../event/synchroBreakTurnEndEvent'
import { SynchroBreakTurnStartEvent } from '../event/synchroBreakTurnStartEvent'
import { SynchroBreakPluginStore } from '../store/defSynchroBreakPluginStore'
import { SynchroBreakStartCountMessage } from '../message/synchroBreakStartCountMessage'
import { SynchroBreakTurnTimerMessage } from '../message/synchroBreakTurnTimerMessage'
import { SynchroBreakResultMessage } from '../message/synchroBreakResultMessage'
import { UpdatePlayersCoinMessage } from '../message/updatePlayersCoinMessage'
import { SYNCHRO_BREAK_MID_RESULT_TIME_LIMIT } from '../synchroBreakPlugin'
import { RESULT_SCREEN_TYPES } from '../type/resultScreenType'
import { BetTimeRemainingMessage } from '../message/betTimeRemainingMessage'
import { BET_TIMER_TIME_LIMIT } from '../synchroBreakPlugin'

export class GameSequence implements IGameSequence {
  private readonly synchroBreakPluginStore!: SynchroBreakPluginStore
  private readonly gamePluginStore: GamePluginStore
  private readonly networkPluginStore: NetworkPluginStore<IMainScene>
  private turnCountNumber: number = 1

  public constructor(
    private readonly gameId: GameIds,
    private readonly eventBus: IEventBus<IMainScene>,
    private readonly store: Store<IMainScene>
  ) {
    this.synchroBreakPluginStore = this.store.of('synchroBreakPlugin')
    this.gamePluginStore = this.store.of('gamePlugin')
    this.networkPluginStore = this.store.of('networkPlugin')
  }

  public async processTurnSequence(): Promise<void> {
    if (!this.isActive) return
    await this.startBetTimeCountdown()
    if (!this.isActive) return
    await this.startTurnCountdown()
    if (!this.isActive) return
    await this.startTurnTimer()
    if (!this.isActive) return
    await this.finishTurn()
  }

  /**
   * ターン開始前の3秒カウントダウンを実行
   */
  private async startTurnCountdown(): Promise<void> {
    if (!this.isActive) return

    // 最後にベットしたプレイヤーにも説明ウィンドウが表示されるように、1秒待機
    await this.delay(1000)

    for (let remainingSeconds = 3; remainingSeconds > 0; remainingSeconds--) {
      if (!this.isActive) return
      const synchroBreakStartCountMessage = new SynchroBreakStartCountMessage({ remainingSeconds })
      this.networkPluginStore.messageSender.send(synchroBreakStartCountMessage)

      await this.delay(1000)
    }
  }

  /**
   * ターンの制限時間をカウントダウン
   */
  private async startTurnTimer(): Promise<void> {
    if (!this.isActive) return
    const turnTimer = this.synchroBreakPluginStore.timeLimit
    if (turnTimer === undefined) return
    for (let remainingSeconds = turnTimer; remainingSeconds > 0; remainingSeconds--) {
      if (!this.isActive) return
      const synchroBreakTurnTimerMessage = new SynchroBreakTurnTimerMessage({ remainingSeconds })
      this.networkPluginStore.messageSender.send(synchroBreakTurnTimerMessage)

      await this.delay(1000)
    }
  }

  /**
   * ターン終了時の処理を実行し、次ターンが終了かを判定する。
   */
  private async finishTurn(): Promise<void> {
    const turnSelect = this.synchroBreakPluginStore.turnSelect
    if (turnSelect === undefined) return

    const synchroBreakTurnEnd = new SynchroBreakTurnEndEvent()
    this.eventBus.post(synchroBreakTurnEnd)

    // ニョッキしなかったプレイヤーのFBを与えるため、1秒待機
    await this.delay(1000)

    if (!this.isActive || turnSelect === undefined) return
    if (turnSelect <= this.turnCountNumber) {
      this.turnCountNumber = 1
      this.sendSortedPlayersCoin()
      this.networkPluginStore.messageSender.send(new SynchroBreakResultMessage({ resultScreenType: RESULT_SCREEN_TYPES.FINAL }))
    } else {
      this.turnCountNumber++

      this.sendSortedPlayersCoin()
      this.networkPluginStore.messageSender.send(new SynchroBreakResultMessage({ resultScreenType: RESULT_SCREEN_TYPES.TURN }))

      await this.delay(SYNCHRO_BREAK_MID_RESULT_TIME_LIMIT)

      if (!this.isActive) return
      const synchroBreakTurnStart = new SynchroBreakTurnStartEvent(this.turnCountNumber)
      this.eventBus.post(synchroBreakTurnStart)
    }
  }

  /**
   * ソート済みのプレイヤーコイン情報を送信
   */
  private sendSortedPlayersCoin(): void {
    const sortedPlayersCoin = this.synchroBreakPluginStore.playersCoinRepository.sortedPlayerCoins()
    this.networkPluginStore.messageSender.send(new UpdatePlayersCoinMessage({ playersCoin: sortedPlayersCoin }))
  }

  /**
   * ベットタイムのカウントダウンを実行し、残り時間を通知する処理
   */
  private async startBetTimeCountdown(): Promise<void> {
    let remainingTime = BET_TIMER_TIME_LIMIT

    // 100ミリ秒ごとに残り時間を通知
    while (remainingTime >= 0 && this.isActive) {
      // 全プレイヤーがベットした場合は終了
      const numOfPlayers = this.gamePluginStore.games.get(this.gameId)?.participantIds.length ?? 0
      const didBetPlayers = this.synchroBreakPluginStore.betCoinRepository.getBetCoinPlayerCount()
      if (numOfPlayers - didBetPlayers <= 0) {
        return
      }

      remainingTime -= 100
      const betTimeRemainingMessage = new BetTimeRemainingMessage({ remainingTime })
      this.networkPluginStore.messageSender.send(betTimeRemainingMessage)
      await this.delay(100)
    }

    await this.delay(100)
  }

  private get isActive(): boolean {
    return this.gamePluginStore.games.get(this.gameId)?.isActive ?? false
  }

  /**
   * 待機処理を行うためのヘルパー関数
   */
  private async delay(ms: number): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, ms))
  }
}
