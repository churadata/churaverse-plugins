import { IMainScene, IEventBus, Store } from 'churaverse-engine-server'
import { NetworkPluginStore } from '@churaverse/network-plugin-server/store/defNetworkPluginStore'
import '@churaverse/player-plugin-server/store/defPlayerPluginStore'
import { IGame } from '../interface/IGame'
import { SynchroBreakTurnEndEvent } from '../event/synchroBreakTurnEndEvent'
import { SynchroBreakTurnStartEvent } from '../event/synchroBreakTurnStartEvent'
import { SynchroBreakPluginStore } from '../store/defSynchroBreakPluginStore'
import { SynchroBreakStartCountMessage } from '../message/synchroBreakStartCountMessage'
import { SynchroBreakTurnTimerMessage } from '../message/synchroBreakTurnTimerMessage'
import { SynchroBreakResultEvent } from '../event/synchroBreakResultEvent'

export class Game implements IGame {
  private synchroBreakPluginStore!: SynchroBreakPluginStore
  private networkPluginStore!: NetworkPluginStore<IMainScene>
  private turnCountNumber: number = 1

  public constructor(
    private readonly eventBus: IEventBus<IMainScene>,
    private readonly store: Store<IMainScene>
  ) {
    this.getStores()
  }

  private getStores(): void {
    this.networkPluginStore = this.store.of('networkPlugin')
  }

  public getSynchroBreakPluginStore(synchroBreakPluginStore: SynchroBreakPluginStore): void {
    this.synchroBreakPluginStore = synchroBreakPluginStore
  }

  public async processTurnSequence(): Promise<void> {
    await this.startTurnCountdown()
    await this.startTurnTimer()
    await this.finishTurn()
  }

  /**
   * ターン開始前の3秒カウントダウンを実行
   */
  private async startTurnCountdown(): Promise<void> {
    // 最後にベットしたプレイヤーにも説明ウィンドウが表示されるように、1秒待機
    await this.delay(1000)

    for (let remainingSeconds = 3; remainingSeconds > 0; remainingSeconds--) {
      const synchroBreakStartCountMessage = new SynchroBreakStartCountMessage({ remainingSeconds })
      this.networkPluginStore.messageSender.send(synchroBreakStartCountMessage)

      await this.delay(1000)
    }
  }

  /**
   * ターンの制限時間をカウントダウン
   */
  private async startTurnTimer(): Promise<void> {
    const turnTimer = this.synchroBreakPluginStore.timeLimit
    if (turnTimer === undefined) return
    for (let remainingSeconds = turnTimer; remainingSeconds > 0; remainingSeconds--) {
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
    if (turnSelect <= this.turnCountNumber) {
      this.turnCountNumber = 1
      const synchroBreakResult = new SynchroBreakResultEvent()
      this.eventBus.post(synchroBreakResult)
    } else {
      this.turnCountNumber++
      const synchroBreakTurnEnd = new SynchroBreakTurnEndEvent()
      this.eventBus.post(synchroBreakTurnEnd)

      // ニョッキしなかったプレイヤーのFBを与えるため、1秒待機
      await this.delay(1000)

      const synchroBreakTurnStart = new SynchroBreakTurnStartEvent(this.turnCountNumber)
      this.eventBus.post(synchroBreakTurnStart)
    }
  }

  /**
   * 待機処理を行うためのヘルパー関数
   */
  private async delay(ms: number): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, ms))
  }
}
