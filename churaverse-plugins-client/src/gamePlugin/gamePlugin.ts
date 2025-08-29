import { BasePlugin, IMainScene } from 'churaverse-engine-client'
import { initGamePluginStore } from './store/initGamePluginStore'
import { SocketController } from './controller/socketController'
import { RegisterGameUiEvent } from './event/registerGameUiEvent'
import { GameUiRegister } from './gameUiRegister'

export class GamePlugin extends BasePlugin<IMainScene> {
  private gameUiRegister!: GameUiRegister

  public listenEvent(): void {
    this.bus.subscribeEvent('init', this.init.bind(this))
    this.bus.subscribeEvent('start', this.registerGameUi.bind(this))

    const socketController = new SocketController(this.bus, this.store)
    this.bus.subscribeEvent('registerMessage', socketController.registerMessage.bind(socketController))
    this.bus.subscribeEvent('registerMessageListener', socketController.registerMessageListener.bind(socketController))
  }

  private init(): void {
    this.gameUiRegister = new GameUiRegister()
    initGamePluginStore(this.store, this.gameUiRegister)
  }

  /**
   * ゲームUIを登録するイベントを発火させる
   */
  private registerGameUi(): void {
    this.bus.post(new RegisterGameUiEvent(this.gameUiRegister))
  }
}
