import { BasePlugin, IMainScene } from 'churaverse-engine-server'
import { NetworkPluginStore } from '@churaverse/network-plugin-server/store/defNetworkPluginStore'
import { SocketController } from './controller/socketController'
import { GameStartEvent } from './event/gameStartEvent'
import { GameEndEvent } from './event/gameEndEvent'
import { GameManager } from './gameManager'
import { initGamePluginStore } from './store/initGamePluginStore'
import { GameAbortEvent } from './event/gameAbortEvent'
import { GameStartMessage } from './message/gameStartMessage'
import { GameEndMessage } from './message/gameEndMessage'
import { GameAbortMessage } from './message/gameAbortMessage'
import { GamePluginStore } from './store/defGamePluginStore'

export class GamePlugin extends BasePlugin<IMainScene> {
  private gamePluginStore!: GamePluginStore
  private networkPluginStore!: NetworkPluginStore<IMainScene>
  private gameManager!: GameManager

  public listenEvent(): void {
    this.bus.subscribeEvent('init', this.init.bind(this))

    const socketController = new SocketController(this.bus, this.store)
    this.bus.subscribeEvent('registerMessage', socketController.registerMessage.bind(socketController))
    this.bus.subscribeEvent('registerMessageListener', socketController.registerMessageListener.bind(socketController))

    this.bus.subscribeEvent('gameStart', this.gameStart.bind(this))
    this.bus.subscribeEvent('gameEnd', this.gameEnd.bind(this))
    this.bus.subscribeEvent('gameAbort', this.gameAbort.bind(this))
  }

  private init(): void {
    initGamePluginStore(this.store)
    this.gamePluginStore = this.store.of('gamePlugin')
    this.networkPluginStore = this.store.of('networkPlugin')
    this.gameManager = new GameManager(this.store, this.bus)
  }

  /**
   * ゲーム開始時に実行されるメソッド
   */
  private gameStart(ev: GameStartEvent): void {
    if (!this.gamePluginStore.gameRepository.has(ev.gameId)) {
      this.gameManager.createGame(ev.gameId)
      this.networkPluginStore.messageSender.send(new GameStartMessage({ gameId: ev.gameId, playerId: ev.playerId }))
    }
  }

  /**
   * ゲーム終了時に実行されるメソッド
   */
  private gameEnd(ev: GameEndEvent): void {
    if (this.gamePluginStore.gameRepository.has(ev.gameId)) {
      this.gameManager.removeGame(ev.gameId)
      this.networkPluginStore.messageSender.send(new GameEndMessage({ gameId: ev.gameId }))
    }
  }

  /**
   * ゲーム中断時に実行されるメソッド
   */
  private gameAbort(ev: GameAbortEvent): void {
    if (this.gamePluginStore.gameRepository.has(ev.gameId)) {
      this.gameManager.removeGame(ev.gameId)
      this.networkPluginStore.messageSender.send(new GameAbortMessage({ gameId: ev.gameId, playerId: ev.playerId }))
    }
  }
}
