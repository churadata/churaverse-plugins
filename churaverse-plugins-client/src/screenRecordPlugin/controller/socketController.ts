import { IMainScene } from 'churaverse-engine-client'
import { RegisterMessageEvent } from '@churaverse/network-plugin-client/event/registerMessageEvent'
import { RegisterMessageListenerEvent } from '@churaverse/network-plugin-client/event/registerMessageListenerEvent'
import { BaseSocketController } from '@churaverse/network-plugin-client/interface/baseSocketController'
import { StartScreenRecordEvent } from '../event/startScreenRecordEvent'
import { StopScreenRecordEvent } from '../event/stopScreenRecordEvent'
import { StartScreenRecordMessage } from '../message/startScreenRecordMessage'
import { StopScreenRecordMessage } from '../message/stopScreenRecordMessage'
import { ScreenRecordStartMessage } from '../message/screenRecordStartMessage'
import { ScreenRecordStopMessage } from '../message/screenRecordStopMessage'

export class SocketController extends BaseSocketController<IMainScene> {
  public registerMessage(ev: RegisterMessageEvent<IMainScene>): void {
    ev.messageRegister.registerMessage('startScreenRecordMessage', StartScreenRecordMessage, 'lastOnly')
    ev.messageRegister.registerMessage('stopScreenRecordMessage', StopScreenRecordMessage, 'lastOnly')
    ev.messageRegister.registerMessage('screenRecordStart', ScreenRecordStartMessage, 'dest=onlySelf')
    ev.messageRegister.registerMessage('screenRecordStop', ScreenRecordStopMessage, 'dest=onlySelf')
  }

  public registerMessageListener(ev: RegisterMessageListenerEvent<IMainScene>): void {
    ev.messageListenerRegister.on('screenRecordStart', this.onScreenRecordStart.bind(this))
    ev.messageListenerRegister.on('screenRecordStop', this.onScreenRecordStop.bind(this))
  }

  private onScreenRecordStart(msg: ScreenRecordStartMessage): void {
    this.eventBus.post(new StartScreenRecordEvent(''))
  }

  private onScreenRecordStop(msg: ScreenRecordStopMessage): void {
    this.eventBus.post(new StopScreenRecordEvent(''))
  }
}
