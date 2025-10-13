import { IMainScene, IEventBus, Store } from 'churaverse-engine-client'
import { RegisterMessageEvent } from '@churaverse/network-plugin-client/event/registerMessageEvent'
import { RegisterMessageListenerEvent } from '@churaverse/network-plugin-client/event/registerMessageListenerEvent'
import { BaseSocketController } from '@churaverse/network-plugin-client/interface/baseSocketController'
import { ScreenRecordStatusChangedMessage } from '../message/screenRecordStatusChangedMessage'
import { ScreenRecordStartMessage } from '../message/screenRecordStartMessage'
import { ScreenRecordStopMessage } from '../message/screenRecordStopMessage'
import { ScreenRecordStartEvent } from '../event/screenRecordStartEvent'
import { ScreenRecordStopEvent } from '../event/screenRecordStopEvent'

export class SocketController extends BaseSocketController<IMainScene> {
  public constructor(eventBus: IEventBus<IMainScene>, store: Store<IMainScene>) {
    super(eventBus, store)
  }

  public registerMessage(ev: RegisterMessageEvent<IMainScene>): void {
    ev.messageRegister.registerMessage('screenRecordStatusChanged', ScreenRecordStatusChangedMessage, 'queue')
    ev.messageRegister.registerMessage('screenRecordStart', ScreenRecordStartMessage, 'dest=onlySelf')
    ev.messageRegister.registerMessage('screenRecordStop', ScreenRecordStopMessage, 'dest=onlySelf')
  }

  public registerMessageListener(ev: RegisterMessageListenerEvent<IMainScene>): void {
    ev.messageListenerRegister.on('screenRecordStart', this.screenRecordStart.bind(this))
    ev.messageListenerRegister.on('screenRecordStop', this.screenRecordStop.bind(this))
  }

  private screenRecordStart(): void {
    this.eventBus.post(new ScreenRecordStartEvent())
  }

  private screenRecordStop(): void {
    this.eventBus.post(new ScreenRecordStopEvent())
  }
}
