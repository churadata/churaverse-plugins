import { IMainScene } from 'churaverse-engine-server'
import { RegisterMessageEvent } from '../../networkPlugin/event/registerMessageEvent'
import { BaseSocketController } from '../../networkPlugin/interface/baseSocketController'
import { RequestKickPlayerMessage } from '../message/requestKickPlayerMessage'

export class SocketController extends BaseSocketController<IMainScene> {
  public registerMessage(ev: RegisterMessageEvent<IMainScene>): void {
    ev.messageRegister.registerMessage('requestKickPlayer', RequestKickPlayerMessage, 'others')
  }
}
