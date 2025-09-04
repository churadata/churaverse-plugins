import { BasePlugin, Scenes, EVENT_PRIORITY, PhaserSceneInit, InitEvent, CVEvent } from 'churaverse-engine-client'
import { Scene } from 'phaser'
import { initNetworkPluginStore } from './store/initNetworkPluginStore'
import { PriorDataRequestMessage } from './message/priorDataMessage'
import { RegisterMessageListenerEvent } from './event/registerMessageListenerEvent'
import { RegisterMessageEvent } from './event/registerMessageEvent'
import { MessageManager } from './messageManager'
import { Socket } from './socket/socket'
import { MessageManagerUndefinedError } from './errors/messageManagerUndefinedError'
import { SocketController } from './controller/socketController'

import { NetworkPluginStore } from './store/defNetworkPluginStore'

declare global {
  interface Window {
    io?: Socket<Scenes>
  }
}

export class NetworkPlugin extends BasePlugin<Scenes> {
  private scene?: Scene
  private messageManager?: MessageManager<Scenes>

  public listenEvent(): void {
    this.bus.subscribeEvent('phaserSceneInit', this.phaserSceneInit.bind(this))
    this.bus.subscribeEvent('init', this.init.bind(this), 'HIGHEST')
    this.bus.subscribeEvent('start', this.listenRegister.bind(this), EVENT_PRIORITY.HIGH)
    this.bus.subscribeEvent('start', this.requestPriorData.bind(this), EVENT_PRIORITY.LOW)

    const socketController = new SocketController(this.bus, this.store)
    this.bus.subscribeEvent('registerMessage', socketController.registerMessage.bind(socketController))

    this.bus.subscribeEvent('update', this.update.bind(this))
  }

  private phaserSceneInit(ev: PhaserSceneInit): void {
    this.scene = ev.scene
  }

  private init(ev: InitEvent): void {
    const socket = Socket.build()
    socket.socketEventToBusEvent(this.bus)
    window.io = socket
    this.messageManager = new MessageManager(socket.socketId)
    initNetworkPluginStore(this.store, this.scene, this.messageManager, this.messageManager.socketId)
  }

  /**
   * Message登録イベントとMessageListener登録イベントをpostする
   */
  private listenRegister(): void {
    if (this.messageManager === undefined) throw new MessageManagerUndefinedError()

    this.bus.post(new RegisterMessageEvent(this.messageManager) as CVEvent<Scenes>)
    this.bus.post(new RegisterMessageListenerEvent(this.messageManager) as CVEvent<Scenes>)
  }

  private requestPriorData(): void {
    const store = this.store.of('networkPlugin') as NetworkPluginStore<Scenes>
    store.messageSender.send(new PriorDataRequestMessage())
  }

  private update(): void {
    if (this.messageManager === undefined) throw new MessageManagerUndefinedError()

    if (this.messageManager.shouldSendPacket()) {
      this.messageManager.sendPacket()
    }
  }
}
