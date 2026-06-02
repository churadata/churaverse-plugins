import { IEventBus, IMainScene, Store } from 'churaverse-engine-server'
import { RegisterMessageEvent } from '@churaverse/network-plugin-server/event/registerMessageEvent'
import { RegisterMessageListenerEvent } from '@churaverse/network-plugin-server/event/registerMessageListenerEvent'
import { BaseSocketController } from '@churaverse/network-plugin-server/interface/baseSocketController'
import { StartScreenRecordEvent } from '../event/startScreenRecordEvent'
import { StopScreenRecordEvent } from '../event/stopScreenRecordEvent'
import { StartScreenRecordMessage } from '../message/startScreenRecordMessage'
import { StopScreenRecordMessage } from '../message/stopScreenRecordMessage'
import { ScreenRecordStartMessage } from '../message/screenRecordStartMessage'
import { ScreenRecordStopMessage } from '../message/screenRecordStopMessage'

export class SocketController extends BaseSocketController<IMainScene> {
  public constructor(eventBus: IEventBus<IMainScene>, store: Store<IMainScene>) {
    super(eventBus, store)
  }

  public registerMessage(ev: RegisterMessageEvent<IMainScene>): void {
    ev.messageRegister.registerMessage('startScreenRecordMessage', StartScreenRecordMessage, 'onlyServer')
    ev.messageRegister.registerMessage('stopScreenRecordMessage', StopScreenRecordMessage, 'onlyServer')
    ev.messageRegister.registerMessage('screenRecordStart', ScreenRecordStartMessage, 'allClients')
    ev.messageRegister.registerMessage('screenRecordStop', ScreenRecordStopMessage, 'allClients')
  }

  public registerMessageListener(ev: RegisterMessageListenerEvent<IMainScene>): void {
    ev.messageListenerRegister.on('startScreenRecordMessage', this.startScreenRecord.bind(this))
    ev.messageListenerRegister.on('stopScreenRecordMessage', this.stopScreenRecord.bind(this))
  }

  private startScreenRecord(msg: StartScreenRecordMessage): void {
    this.eventBus.post(new StartScreenRecordEvent(msg.data.playerId))
  }

  private stopScreenRecord(msg: StopScreenRecordMessage): void {
    this.eventBus.post(new StopScreenRecordEvent(msg.data.playerId))
  }
}
