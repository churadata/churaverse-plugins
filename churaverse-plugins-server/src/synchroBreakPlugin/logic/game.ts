import { IMainScene, IEventBus, Store } from 'churaverse-engine-server'
import { NetworkPluginStore } from '@churaverse/network-plugin-server/store/defNetworkPluginStore'
import '@churaverse/player-plugin-server/store/defPlayerPluginStore'
import { IGame } from '../interface/IGame'
import { NyokkiGameTurnEnd } from '../event/nyokkiGameTurnEnd'
import { NyokkiGameTurnStartEvent } from '../event/nyokkiGameTurnStartEvent'
import { SynchroBreakPluginStore } from '../store/defSynchroBreakPluginStore'
import { NyokkiGameStartCountMessage } from '../message/nyokkiGameStartCountMessage'
import { NyokkiTurnTimerMessage } from '../message/nyokkiTurnTimerMessage'
import { NyokkiResultEvent } from '../event/nyokkiResultEvent'

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
      const nyokkiGameStartCountMessage = new NyokkiGameStartCountMessage({ remainingSeconds })
      this.networkPluginStore.messageSender.send(nyokkiGameStartCountMessage)

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
      const nyokkiTurnTimerMessage = new NyokkiTurnTimerMessage({ remainingSeconds })
      this.networkPluginStore.messageSender.send(nyokkiTurnTimerMessage)

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
      const nyokkiResult = new NyokkiResultEvent()
      this.eventBus.post(nyokkiResult)
    } else {
      this.turnCountNumber++
      const nyokkiTurnEnd = new NyokkiGameTurnEnd()
      this.eventBus.post(nyokkiTurnEnd)

      // ニョッキしなかったプレイヤーのFBを与えるため、1秒待機
      await this.delay(1000)

      const nyokkiTurnStart = new NyokkiGameTurnStartEvent(this.turnCountNumber)
      this.eventBus.post(nyokkiTurnStart)
    }
  }

  /**
   * 待機処理を行うためのヘルパー関数
   */
  private async delay(ms: number): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, ms))
  }
}
