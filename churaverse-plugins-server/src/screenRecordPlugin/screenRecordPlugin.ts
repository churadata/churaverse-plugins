import { IMainScene, BasePlugin } from 'churaverse-engine-server'
import { NetworkPluginStore } from '@churaverse/network-plugin-server/store/defNetworkPluginStore'
import { SocketController } from './controller/socketController'
import { ScreenRecordPluginStore } from './store/defScreenRecordPluginStore'
import { initScreenRecordPluginStore } from './store/initScreenRecordPluginStore'
import { ScreenRecordStartMessage } from './message/screenRecordStartMessage'
import { ScreenRecordStopMessage } from './message/screenRecordStopMessage'
import { ScreenRecordEgressClient, createDefaultConfig } from './domain/egressClient'
import { IEgressClient } from './domain/IEgressClient'

// 録画の対象になるルーム名
const RECORDING_ROOM_NAME = 'room1'

export class ScreenRecordPlugin extends BasePlugin<IMainScene> {
  private screenRecordPluginStore!: ScreenRecordPluginStore
  private networkPluginStore!: NetworkPluginStore<IMainScene>
  private egressClient!: IEgressClient

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
    this.egressClient = new ScreenRecordEgressClient(createDefaultConfig())
  }

  private async onStartRecord(): Promise<void> {
    if (this.screenRecordPluginStore.isRecording) {
      console.warn('すでに録画中です')
      return
    }

    try {
      const info = await this.egressClient.start(RECORDING_ROOM_NAME)
      this.screenRecordPluginStore.isRecording = true
      this.screenRecordPluginStore.egressId = info.egressId
      this.screenRecordPluginStore.startedAt = new Date()
      this.networkPluginStore.messageSender.send(new ScreenRecordStartMessage())
    } catch (err) {
      console.error('Egressへの録画開始リクエストが失敗しました', err)
    }
  }

  private async onStopRecord(): Promise<void> {
    const { egressId } = this.screenRecordPluginStore
    if (egressId == null) {
      console.warn('録画が開始されていないため停止できません')
      return
    }

    try {
      await this.egressClient.stop(egressId)
      this.screenRecordPluginStore.egressId = undefined
      this.screenRecordPluginStore.startedAt = undefined
      this.screenRecordPluginStore.isRecording = false
      this.networkPluginStore.messageSender.send(new ScreenRecordStopMessage())
    } catch (err) {
      console.error('録画停止に失敗しました', err)
    }
  }
}
