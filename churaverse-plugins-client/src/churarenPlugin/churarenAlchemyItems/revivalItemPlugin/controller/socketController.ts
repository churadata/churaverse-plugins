import { RegisterMessageEvent } from '@churaverse/network-plugin-client/event/registerMessageEvent'
import { BaseSocketController } from '@churaverse/network-plugin-client/interface/baseSocketController'
import { IEventBus, IMainScene, Store } from 'churaverse-engine-client'
import { UseRevivalItemMessage } from '../message/useRevivalItemMessage'

export class SocketController extends BaseSocketController<IMainScene> {
  public constructor(eventBus: IEventBus<IMainScene>, store: Store<IMainScene>) {
    super(eventBus, store)
  }

  public registerMessage(ev: RegisterMessageEvent<IMainScene>): void {
    ev.messageRegister.registerMessage('useRevivalItem', UseRevivalItemMessage, 'queue')
  }
}
