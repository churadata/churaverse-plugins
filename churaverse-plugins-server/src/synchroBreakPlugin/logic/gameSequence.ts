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
      const sortedPlayersCoin = this.synchroBreakPluginStore.playersCoinRepository.sortedPlayerCoins()
      this.networkPluginStore.messageSender.send(new UpdatePlayersCoinMessage({ playersCoin: sortedPlayersCoin }))
      this.networkPluginStore.messageSender.send(new SynchroBreakResultMessage())
    } else {
      this.turnCountNumber++

      const synchroBreakTurnStart = new SynchroBreakTurnStartEvent(this.turnCountNumber)
      this.eventBus.post(synchroBreakTurnStart)
    }
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
