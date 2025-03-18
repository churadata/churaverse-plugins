import { IMainScene } from 'churaverse-engine-server'
import { NetworkPluginStore } from '@churaverse/network-plugin-server/store/defNetworkPluginStore'
import { SocketController } from './controller/socketController'
import { ChurarenPluginStore } from './store/defChurarenPluginStore'
import { initChurarenPluginStore, resetChurarenPluginStore } from './store/churarenPluginStoreManager'
import { ChurarenPlayerReadyEvent } from './event/churarenPlayerReadyEvent'
import { GameEndEvent } from '@churaverse/game-plugin-server/event/gameEndEvent'
import { UpdateChurarenUiEvent } from './event/updateChurarenUiEvent'
import { UpdateChurarenUiMessage } from './message/updateChurarenUiMessage'
import { BaseGamePlugin } from '@churaverse/game-plugin-server/domain/baseGamePlugin'
import { CHURAREN_CONSTANTS } from '@churaverse/churaren-engine-server'

export class ChurarenCorePlugin extends BaseGamePlugin {
  public gameId = CHURAREN_CONSTANTS.GAME_ID
  private networkPluginStore!: NetworkPluginStore<IMainScene>
  private churarenPluginStore!: ChurarenPluginStore
  private socketController!: SocketController
  private readonly readyPlayers = new Set<string>()

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
    this.bus.subscribeEvent('churarenPlayerReady', this.onPlayerReady)
    this.bus.subscribeEvent('updateChurarenUi', this.updateChurarenUi)
  }

  /**
   * ゲームが終了・中断された時に削除されるイベントリスナー
   */
  protected unsubscribeGameEvent(): void {
    super.unsubscribeGameEvent()
    this.bus.unsubscribeEvent('churarenPlayerReady', this.onPlayerReady)
    this.bus.unsubscribeEvent('updateChurarenUi', this.updateChurarenUi)
  }

  private init(): void {
    this.networkPluginStore = this.store.of('networkPlugin')
  }

  /**
   * ゲームが開始された時の処理
   */
  protected handleGameStart(): void {
    this.subscribeGameEvent()
    initChurarenPluginStore(this.store, this.bus)
    this.socketController.registerMessageListener()
    this.churarenPluginStore = this.store.of('churarenPlugin')
  }

  /**
   * 中断・終了時に実行される処理
   */
  protected handleGameTermination(): void {
    this.unsubscribeGameEvent()
    resetChurarenPluginStore(this.store)
    this.socketController.unregisterMessageListener()
    this.readyPlayers.clear()
  }

  private readonly onPlayerReady = (ev: ChurarenPlayerReadyEvent): void => {
    this.readyPlayers.add(ev.playerId)
    if (this.readyPlayers.size === this.participantIds.length) {
      console.log('All players are ready')
      this.sequence()
        .then(() => {
          console.log('Game end')
          this.bus.post(new GameEndEvent(this.gameId))
        })
        .catch((err) => {
          console.error(err)
          this.bus.post(new GameEndEvent(this.gameId))
        })
    }
  }

  private readonly updateChurarenUi = (ev: UpdateChurarenUiEvent): void => {
    const updateChurarenUiMessage = new UpdateChurarenUiMessage({ uiType: ev.uiType })
    this.networkPluginStore.messageSender.send(updateChurarenUiMessage)
  }

  private async sequence(): Promise<void> {
    await this.churarenPluginStore.churarenGameSequence.sequence(this.gameId)
  }
}

declare module '@churaverse/game-plugin-server/interface/gameIds' {
  export interface GameIdsMap {
    churaren: ChurarenCorePlugin
  }
}
