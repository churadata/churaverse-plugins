import { BasePlugin, IMainScene } from 'churaverse-engine-client'
import { PlayerPluginStore } from '@churaverse/player-plugin-client/store/defPlayerPluginStore'
import { NetworkPluginStore } from '@churaverse/network-plugin-client/store/defNetworkPluginStore'
import { initGamePluginStore } from './store/initGamePluginStore'
import { UpdateGameStateEvent } from './event/updateGameStateEvent'
import { SocketController } from './controller/socketController'
import { UpdateGameStateMessage } from './message/updateGameStateMessage'
import { RegisterGameUiEvent } from './event/registerGameUiEvent'
import { GameUiRegister } from './gameUiRegister'

export class GamePlugin extends BasePlugin<IMainScene> {
  private playerPluginStore!: PlayerPluginStore
  private networkPluginStore!: NetworkPluginStore<IMainScene>
  private gameUiRegister!: GameUiRegister

  public listenEvent(): void {
    this.bus.subscribeEvent('init', this.init.bind(this))
    this.bus.subscribeEvent('start', this.registerGameUi.bind(this))

    const socketController = new SocketController(this.bus, this.store)
    this.bus.subscribeEvent('registerMessage', socketController.registerMessage.bind(socketController))
    this.bus.subscribeEvent('registerMessageListener', socketController.registerMessageListener.bind(socketController))

    this.bus.subscribeEvent('updateGameState', this.updateGameState.bind(this))
  }

  private init(): void {
    this.gameUiRegister = new GameUiRegister()
    initGamePluginStore(this.store, this.gameUiRegister)
    this.playerPluginStore = this.store.of('playerPlugin')
    this.networkPluginStore = this.store.of('networkPlugin')
  }

  /**
   * ゲームUIを登録するイベントを発火させる
   */
  private registerGameUi(): void {
    this.bus.post(new RegisterGameUiEvent(this.gameUiRegister))
  }

  /**
   * ゲームの開始または中断のリクエストを処理する
   */
  private updateGameState(ev: UpdateGameStateEvent): void {
    const updateGameStateMessage = new UpdateGameStateMessage({
      gameId: ev.gameId,
      playerId: this.playerPluginStore.ownPlayerId,
      toState: ev.toState,
    })
    this.networkPluginStore.messageSender.send(updateGameStateMessage)
  }
}
