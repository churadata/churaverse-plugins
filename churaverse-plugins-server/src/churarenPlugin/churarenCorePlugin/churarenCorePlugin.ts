import { CoreGamePlugin } from '@churaverse/game-plugin-server/domain/coreGamePlugin'
import { SocketController } from './controller/socketController'
import { initChurarenPluginStore, resetChurarenPluginStore } from './store/churarenPluginStoreManager'
import { GameEndEvent } from '@churaverse/game-plugin-server/event/gameEndEvent'
import { CHURAREN_CONSTANTS } from './constants/churarenConstants'
import { NetworkPluginStore } from '@churaverse/network-plugin-server/store/defNetworkPluginStore'
import { IMainScene } from 'churaverse-engine-server'
import { ChurarenResultEvent } from './event/churarenResultEvent'
import { ChurarenStartCountdownMessage } from './message/churarenStartCountdownMessage'
import { ChurarenStartTimerMessage } from './message/churarenStartTimerMessage'
import { ChurarenResultMessage } from './message/churarenResultMessage'

const RESULT_DISPLAY_TIME_SECONDS = 5 // 結果表示時間(sec)

export class ChurarenCorePlugin extends CoreGamePlugin {
  public gameId = CHURAREN_CONSTANTS.GAME_ID
  private socketController?: SocketController
  private networkPluginStore!: NetworkPluginStore<IMainScene>

  public listenEvent(): void {
    super.listenEvent()
    this.bus.subscribeEvent('init', this.init.bind(this))

    this.socketController = new SocketController(this.bus, this.store)
    this.bus.subscribeEvent('registerMessage', this.socketController.registerMessage.bind(this.socketController))
    this.bus.subscribeEvent(
      'registerMessageListener',
      this.socketController.setupMessageListenerRegister.bind(this.socketController)
    )
  }

  /**
   * ゲームが開始された時に登録されるイベントリスナー
   */
  protected subscribeGameEvent(): void {
    super.subscribeGameEvent()
    this.bus.subscribeEvent('churarenStartCountdown', this.countdown)
    this.bus.subscribeEvent('churarenStartTimer', this.timer)
    this.bus.subscribeEvent('churarenResult', this.churarenResult)
  }

  /**
   * ゲームが終了・中断された時に削除されるイベントリスナー
   */
  protected unsubscribeGameEvent(): void {
    super.unsubscribeGameEvent()
    this.bus.unsubscribeEvent('churarenStartCountdown', this.countdown)
    this.bus.unsubscribeEvent('churarenStartTimer', this.timer)
    this.bus.unsubscribeEvent('churarenResult', this.churarenResult)
  }

  private init(): void {
    this.networkPluginStore = this.store.of('networkPlugin')
  }

  /**
   * ゲームが開始された時の処理
   */
  protected handleGameStart(): void {
    initChurarenPluginStore(this.gameId, this.store, this.bus)
    this.socketController?.registerMessageListener()
    this.sequence()
      .then(() => {})
      .catch((err) => {
        console.error(err)
        this.bus.post(new GameEndEvent(this.gameId))
      })
  }

  /**
   * 中断・終了時に実行される処理
   */
  protected handleGameTermination(): void {
    resetChurarenPluginStore(this.store)
    this.socketController?.unregisterMessageListener()
  }

  private readonly countdown = (): void => {
    this.networkPluginStore.messageSender.send(new ChurarenStartCountdownMessage())
  }

  private readonly timer = (): void => {
    this.networkPluginStore.messageSender.send(new ChurarenStartTimerMessage())
  }

  /**
   * 結果を表示する処理 \
   * `RESULT_DISPLAY_TIME_SECONDS`秒後にゲームを終了する
   */
  private readonly churarenResult = (ev: ChurarenResultEvent): void => {
    this.networkPluginStore.messageSender.send(new ChurarenResultMessage({ resultType: ev.resultType }))
    setTimeout(() => {
      this.bus.post(new GameEndEvent(this.gameId))
    }, RESULT_DISPLAY_TIME_SECONDS * 1000)
  }

  private async sequence(): Promise<void> {
    await this.store.of('churarenPlugin').churarenGameSequence.sequence()
  }
}

declare module '@churaverse/game-plugin-server/interface/gameIds' {
  export interface GameIdsMap {
    churaren: ChurarenCorePlugin
  }
}
