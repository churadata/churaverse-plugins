import { AlchemyPotSpawnMessage } from '../message/alchemyPotSpawnMessage'
import { AlchemizeMessage } from '../message/alchemizeMessage'
import { ClearAlchemyItemBoxMessage } from '../message/clearAlchemyItemBoxMessage'
import { IMessageListenerRegister } from '@churaverse/network-plugin-server/interface/IMessageListenerRegister'
import { BaseSocketController } from '@churaverse/network-plugin-server/interface/baseSocketController'
import { IEventBus, IMainScene, Store } from 'churaverse-engine-server'
import { RegisterMessageEvent } from '@churaverse/network-plugin-server/event/registerMessageEvent'
import { RegisterMessageListenerEvent } from '@churaverse/network-plugin-server/event/registerMessageListenerEvent'

export class SocketController extends BaseSocketController<IMainScene> {
  private messageListenerRegister!: IMessageListenerRegister<IMainScene>

  public constructor(eventBus: IEventBus<IMainScene>, store: Store<IMainScene>) {
    super(eventBus, store)
  }

  public registerMessage(ev: RegisterMessageEvent<IMainScene>): void {
    ev.messageRegister.registerMessage('alchemyPotSpawn', AlchemyPotSpawnMessage, 'allClients')
    ev.messageRegister.registerMessage('alchemize', AlchemizeMessage, 'allClients')
    ev.messageRegister.registerMessage('clearAlchemyItemBox', ClearAlchemyItemBoxMessage, 'allClients')
  }

  public setupMessageListenerRegister(ev: RegisterMessageListenerEvent<IMainScene>): void {
    this.messageListenerRegister = ev.messageListenerRegister
  }
}
