import { IMainScene, BasePlugin } from 'churaverse-engine-server'
import { NetworkPluginStore } from '@churaverse/network-plugin-server/store/defNetworkPluginStore'
import { SocketController } from './controller/socketController'
import { ScreenRecordPluginStore } from './store/defScreenRecordPluginStore'
import { initScreenRecordPluginStore } from './store/initScreenRecordPluginStore'
import { ScreenRecordStartMessage } from './message/screenRecordStartMessage'
import { ScreenRecordStopMessage } from './message/screenRecordStopMessage'

export class ScreenRecordPlugin extends BasePlugin<IMainScene> {
  private screenRecordPluginStore!: ScreenRecordPluginStore
  private networkPluginStore!: NetworkPluginStore<IMainScene>

  public listenEvent(): void {
    this.bus.subscribeEvent('init', this.init.bind(this))

    const socketController = new SocketController(this.bus, this.store)
    this.bus.subscribeEvent('registerMessage', socketController.registerMessage.bind(socketController))
    this.bus.subscribeEvent('registerMessageListener', socketController.registerMessageListener.bind(socketController))

    this.bus.subscribeEvent('startScreenRecord', this.onStartRecord.bind(this))
    this.bus.subscribeEvent('stopScreenRecord', this.onStopRecord.bind(this))
  }

  private init(): void {
    initScreenRecordPluginStore(this.store)
    this.screenRecordPluginStore = this.store.of('screenRecordPlugin')
    this.networkPluginStore = this.store.of('networkPlugin')
  }

  private onStartRecord(): void {
    this.screenRecordPluginStore.isRecording = true
    this.networkPluginStore.messageSender.send(new ScreenRecordStartMessage())
  }

  private onStopRecord(): void {
    this.screenRecordPluginStore.isRecording = false
    this.networkPluginStore.messageSender.send(new ScreenRecordStopMessage())
  }
}
