import { BaseGamePlugin } from '@churaverse/game-plugin-server/domain/baseGamePlugin'
import { CHURAREN_CONSTANTS } from '@churaverse/churaren-core-plugin-server'
import { SocketController } from './controller/socketController'

export class RevivalItemPlugin extends BaseGamePlugin {
  public gameId = CHURAREN_CONSTANTS.GAME_ID
  private socketController?: SocketController

  public listenEvent(): void {
    super.listenEvent()
    this.socketController = new SocketController(this.bus, this.store)
    this.bus.subscribeEvent('registerMessage', this.socketController.registerMessage.bind(this.socketController))
    this.bus.subscribeEvent(
      'registerMessageListener',
      this.socketController.setupMessageListenerRegister.bind(this.socketController)
    )
  }

  // `UseRevivalItemEvent`は、`ChurarenPlayerPlugin`が処理する
  protected subscribeGameEvent(): void {}

  protected unsubscribeGameEvent(): void {}

  protected handleGameStart(): void {
    this.socketController?.registerMessageListener()
  }

  protected handleGameTermination(): void {
    this.socketController?.unregisterMessageListener()
  }
}
