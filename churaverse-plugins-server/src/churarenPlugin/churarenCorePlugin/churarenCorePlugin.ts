import { CoreGamePlugin } from '@churaverse/game-plugin-server/domain/coreGamePlugin'
import { SocketController } from './controller/socketController'
import { ChurarenPluginStore } from './store/defChurarenPluginStore'
import { initChurarenPluginStore, resetChurarenPluginStore } from './store/churarenPluginStoreManager'
import { GameEndEvent } from '@churaverse/game-plugin-server/event/gameEndEvent'
import { UpdateChurarenUiEvent } from './event/updateChurarenUiEvent'
import { UpdateChurarenUiMessage } from './message/updateChurarenUiMessage'
import { CHURAREN_CONSTANTS } from './constants/churarenConstants'
import { NetworkPluginStore } from '@churaverse/network-plugin-server/store/defNetworkPluginStore'
import { isChurarenGameResult } from './types/uiTypes'
import { IMainScene } from 'churaverse-engine-server'

const RESULT_DISPLAY_TIME = 5 // 結果表示時間(sec)

export class ChurarenCorePlugin extends CoreGamePlugin {
  public gameId = CHURAREN_CONSTANTS.GAME_ID
  private churarenPluginStore!: ChurarenPluginStore
  private socketController!: SocketController
  private networkPluginStore!: NetworkPluginStore<IMainScene>
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
    this.bus.subscribeEvent('updateChurarenUi', this.updateChurarenUi)
  }

  /**
   * ゲームが終了・中断された時に削除されるイベントリスナー
   */
  protected unsubscribeGameEvent(): void {
    super.unsubscribeGameEvent()
    this.bus.unsubscribeEvent('updateChurarenUi', this.updateChurarenUi)
  }

  private init(): void {
    this.networkPluginStore = this.store.of('networkPlugin')
  }

  /**
   * ゲームが開始された時の処理
   */
  protected handleGameStart(): void {
    initChurarenPluginStore(this.store, this.bus)
    this.socketController.registerMessageListener()
    this.churarenPluginStore = this.store.of('churarenPlugin')
    this.sequence()
      .then(() => {
        console.log('sequence done')
      })
      .catch((err) => {
        console.error(err)
        this.bus.post(new GameEndEvent(this.gameId))
      })
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

  private readonly updateChurarenUi = (ev: UpdateChurarenUiEvent): void => {
    const uiType = ev.uiType
    const updateChurarenUiMessage = new UpdateChurarenUiMessage({ uiType })
    this.networkPluginStore.messageSender.send(updateChurarenUiMessage)
    console.log(`Update UI: ${uiType}`)

    if (isChurarenGameResult(uiType)) {
      console.log(`Game result: ${uiType}`)
      setTimeout(() => {
        this.bus.post(new GameEndEvent(this.gameId))
        console.log('Game end')
      }, RESULT_DISPLAY_TIME * 1000)
    }
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
