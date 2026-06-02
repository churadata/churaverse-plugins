import { BasePlugin, IMainScene } from 'churaverse-engine-client'
import { PlayerPluginStore } from '@churaverse/player-plugin-client/store/defPlayerPluginStore'
import { SocketController } from './controller/socketController'
import { ScreenRecordPluginStore } from './store/defScreenRecordPluginStore'
import { initScreenRecordPluginStore } from './store/initScreenRecordPluginStore'
import { ScreenRecordUi } from './ui/screenRecordUi'

export class ScreenRecordPlugin extends BasePlugin<IMainScene> {
  private screenRecordPluginStore!: ScreenRecordPluginStore
  private playerPluginStore!: PlayerPluginStore
  private screenRecordUi!: ScreenRecordUi

  public listenEvent(): void {
    this.bus.subscribeEvent('init', this.init.bind(this))
    this.bus.subscribeEvent('init', this.getStores.bind(this))
    this.bus.subscribeEvent('start', this.start.bind(this))

    const socketController = new SocketController(this.bus, this.store)
    this.bus.subscribeEvent('registerMessage', socketController.registerMessage.bind(socketController))
    this.bus.subscribeEvent('registerMessageListener', socketController.registerMessageListener.bind(socketController))

    this.bus.subscribeEvent('startScreenRecord', this.onStartRecord.bind(this))
    this.bus.subscribeEvent('stopScreenRecord', this.onStopRecord.bind(this))
  }

  private init(): void {
    initScreenRecordPluginStore(this.store)
    this.screenRecordPluginStore = this.store.of('screenRecordPlugin')
  }

  private getStores(): void {
    this.playerPluginStore = this.store.of('playerPlugin')
  }

  private start(): void {
    const ownPlayerId = this.playerPluginStore.ownPlayerId
    const isAdmin = this.playerPluginStore.players.get(ownPlayerId)?.role === 'admin'
    this.screenRecordUi = new ScreenRecordUi(this.store, this.bus, ownPlayerId, isAdmin)
  }

  private onStartRecord(): void {
    this.screenRecordPluginStore.isRecording = true
    this.screenRecordUi.recIndicator.show()
  }

  private onStopRecord(): void {
    this.screenRecordPluginStore.isRecording = false
    this.screenRecordUi.recIndicator.hide()
  }
}
