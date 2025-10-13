import { IMainScene, BasePlugin } from 'churaverse-engine-server'
import { SocketController } from './controller/socketController'
import { ScreenRecorder } from './screenRecorder'
import { ScreenRecordStatusChangedEvent } from './event/screenRecordStatusChangedEvent'

export class CameraVideoChatPlugin extends BasePlugin<IMainScene> {
  private screenRecorder!: ScreenRecorder
  public listenEvent(): void {
    this.bus.subscribeEvent('init', this.init.bind(this))
    this.bus.subscribeEvent('screenRecordStatusChanged', this.toggleRecord.bind(this))

    const socketController = new SocketController(this.bus, this.store)
    this.bus.subscribeEvent('registerMessage', socketController.registerMessage.bind(socketController))
    this.bus.subscribeEvent('registerMessageListener', socketController.registerMessageListener.bind(socketController))
  }

  private init(): void {
    this.screenRecorder = new ScreenRecorder(this.store)
  }

  private async toggleRecord(ev: ScreenRecordStatusChangedEvent): Promise<void> {
    await this.screenRecorder.toggleRecord(ev)
  }
}
