import { IMainScene } from 'churaverse-engine-server'
import { BaseSocketController } from '@churaverse/network-plugin-server/interface/baseSocketController'
import { RegisterMessageEvent } from '@churaverse/network-plugin-server/event/registerMessageEvent'
import { ChurarenStartCountdownMessage } from '../message/churarenStartCountdownMessage'
import { ChurarenStartTimerMessage } from '../message/churarenStartTimerMessage'
import { ChurarenResultMessage } from '../message/churarenResultMessage'

export class SocketController extends BaseSocketController<IMainScene> {
  public registerMessage(ev: RegisterMessageEvent<IMainScene>): void {
    ev.messageRegister.registerMessage('churarenStartCountdown', ChurarenStartCountdownMessage, 'allClients')
    ev.messageRegister.registerMessage('churarenStartTimer', ChurarenStartTimerMessage, 'allClients')
    ev.messageRegister.registerMessage('churarenResult', ChurarenResultMessage, 'allClients')
  }
}
