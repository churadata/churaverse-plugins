import { IEventBus, IMainScene, Store } from 'churaverse-engine-server'
import { RegisterMessageEvent } from '../../networkPlugin/event/registerMessageEvent'
import { BaseSocketController } from '../../networkPlugin/interface/baseSocketController'
import { SendTextChatMessage } from '../message/sendTextChatMessage'

export class SocketController extends BaseSocketController<IMainScene> {
  public constructor(eventBus: IEventBus<IMainScene>, store: Store<IMainScene>) {
    super(eventBus, store)
  }

  public registerMessage(ev: RegisterMessageEvent<IMainScene>): void {
    ev.messageRegister.registerMessage('sendTextChatMessage', SendTextChatMessage, 'allClients')
  }
}
