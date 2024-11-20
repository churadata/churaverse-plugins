import { BasePlugin, IMainScene } from 'churaverse-engine-server'
import { NetworkPluginStore } from '@churaverse/network-plugin-server/store/defNetworkPluginStore'
import { SocketController } from './controller/socketController'
import { GameStartEvent } from './event/gameStartEvent'
import { GameAbortEvent } from './event/gameAbortEvent'
import { GameStartMessage } from './message/gameStartMessage'
import { GameAbortMessage } from './message/gameAbortMessage'
import { UpdateGameStateEvent } from './event/updateGameStateEvent'
import { GameIds } from './interface/gameIds'

export class GamePlugin extends BasePlugin<IMainScene> {
  private networkPluginStore!: NetworkPluginStore<IMainScene>

  public listenEvent(): void {
    this.bus.subscribeEvent('init', this.init.bind(this))

    const socketController = new SocketController(this.bus, this.store)
    this.bus.subscribeEvent('registerMessage', socketController.registerMessage.bind(socketController))
    this.bus.subscribeEvent('registerMessageListener', socketController.registerMessageListener.bind(socketController))

    this.bus.subscribeEvent('updateGameState', this.updateGameState.bind(this))
  }

  private init(): void {
    this.networkPluginStore = this.store.of('networkPlugin')
  }

  /**
   * ゲームの状態更新イベントを受け取り、開始または中断の処理を行う
   */
  private updateGameState(ev: UpdateGameStateEvent): void {
    if (ev.toState === 'start') {
      this.gameStart(ev.gameId, ev.playerId)
    } else if (ev.toState === 'abort') {
      this.gameAbort(ev.gameId, ev.playerId)
    }
  }

  private gameStart(gameId: GameIds, playerId: string): void {
    this.networkPluginStore.messageSender.send(new GameStartMessage({ gameId, playerId }))
    this.bus.post(new GameStartEvent(gameId, playerId))
  }

  private gameAbort(gameId: GameIds, playerId: string): void {
    this.networkPluginStore.messageSender.send(new GameAbortMessage({ gameId, playerId }))
    this.bus.post(new GameAbortEvent(gameId, playerId))
  }
}
