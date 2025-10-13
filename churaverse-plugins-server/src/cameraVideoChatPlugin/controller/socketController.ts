import { IEventBus, IMainScene, Store } from 'churaverse-engine-server'
import { RegisterMessageEvent } from '@churaverse/network-plugin-server/event/registerMessageEvent'
import { RegisterMessageListenerEvent } from '@churaverse/network-plugin-server/event/registerMessageListenerEvent'
import { BaseSocketController } from '@churaverse/network-plugin-server/interface/baseSocketController'
import { ScreenRecordStatusChangedMessage } from '../message/screenRecordStatusChangedMessage'
import { ScreenRecordStartMessage } from '../message/screenRecordStartMessage'
import { ScreenRecordStopMessage } from '../message/screenRecordStopMessage'
import { ScreenRecordStatusChangedEvent } from '../event/screenRecordStatusChangedEvent'

export class SocketController extends BaseSocketController<IMainScene> {
  public constructor(eventBus: IEventBus<IMainScene>, store: Store<IMainScene>) {
    super(eventBus, store)
  }

  public registerMessage(ev: RegisterMessageEvent<IMainScene>): void {
    ev.messageRegister.registerMessage('screenRecordStart', ScreenRecordStartMessage, 'allClients')
    ev.messageRegister.registerMessage('screenRecordStop', ScreenRecordStopMessage, 'allClients')
    ev.messageRegister.registerMessage('screenRecordStatusChanged', ScreenRecordStatusChangedMessage, 'onlySelf')
  }

  public registerMessageListener(ev: RegisterMessageListenerEvent<IMainScene>): void {
    ev.messageListenerRegister.on('screenRecordStatusChanged', this.toggleScreenRecordStatus.bind(this))
  }

  private toggleScreenRecordStatus(msg: ScreenRecordStatusChangedMessage): void {
    this.eventBus.post(new ScreenRecordStatusChangedEvent(msg.data.isRecording))
  }
}
