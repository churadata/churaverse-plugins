import { BasePlugin, IMainScene } from 'churaverse-engine-client'
import { initGamePluginStore } from './store/initGamePluginStore'
import { SocketController } from './controller/socketController'
import { RegisterGameUiEvent } from './event/registerGameUiEvent'
import { GameUiRegister } from './gameUiRegister'
import { GameDialogManager } from './ui/gameDialogManager'

export class GamePlugin extends BasePlugin<IMainScene> {
  private gameUiRegister!: GameUiRegister
  private gameDialogManager?: GameDialogManager

  public listenEvent(): void {
    this.bus.subscribeEvent('init', this.init.bind(this))
    this.bus.subscribeEvent('start', this.registerGameUi.bind(this))

    const socketController = new SocketController(this.bus, this.store)
    this.bus.subscribeEvent('registerMessage', socketController.registerMessage.bind(socketController))
    this.bus.subscribeEvent('registerMessageListener', socketController.registerMessageListener.bind(socketController))

    this.bus.subscribeEvent('gameStart', this.closeGameDialog.bind(this))
  }

  private init(): void {
    this.gameUiRegister = new GameUiRegister()
    this.gameDialogManager = new GameDialogManager(this.store, this.bus)
    initGamePluginStore(this.store, this.gameUiRegister)
    this.gameDialogManager.init()
  }

  /**
   * ゲームUIを登録するイベントを発火させる
   */
  private registerGameUi(): void {
    this.bus.post(new RegisterGameUiEvent(this.gameUiRegister))
  }

  public closeGameDialog(): void {
    this.gameDialogManager?.closeGameDialog()
  }
}
