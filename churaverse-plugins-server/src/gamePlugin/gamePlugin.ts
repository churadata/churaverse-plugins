import { BasePlugin, IMainScene } from 'churaverse-engine-server'
import { SocketController } from './controller/socketController'

export class GamePlugin extends BasePlugin<IMainScene> {
  public listenEvent(): void {
    const socketController = new SocketController(this.bus, this.store)
    this.bus.subscribeEvent('registerMessage', socketController.registerMessage.bind(socketController))
    this.bus.subscribeEvent('registerMessageListener', socketController.registerMessageListener.bind(socketController))
  }
}
