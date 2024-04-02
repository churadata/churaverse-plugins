import { IMainScene, BasePlugin } from 'churaverse-engine-server'
import { NetworkPluginStore } from '@churaverse/network-plugin-server/store/defNetworkPluginStore'
import { SocketController } from './controller/socketController'
import { SendTextChatEvent } from './event/sendTextChatEvent'
import { SendTextChatMessage } from './message/sendTextChatMessage'

export class TextChatPlugin extends BasePlugin<IMainScene> {
  private readonly networkStore!: NetworkPluginStore<IMainScene>

  public listenEvent(): void {
    const socketController = new SocketController(this.bus, this.store)
    this.bus.subscribeEvent('registerMessage', socketController.registerMessage.bind(socketController))
    this.bus.subscribeEvent('registerMessageListener', socketController.registerMessageListener.bind(socketController))

    this.bus.subscribeEvent('sendTextChat', this.sendChat.bind(this))
  }

  private sendChat(ev: SendTextChatEvent): void {
    const data = {
      playerId: ev.textChat.playerId,
      message: ev.textChat.message,
    }

    if (data.message !== '') {
      this.networkStore.messageSender.send(new SendTextChatMessage(data))
    }
  }
}
