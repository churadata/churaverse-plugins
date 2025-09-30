import { AlchemyPotSpawnMessage } from '../message/alchemyPotSpawnMessage'
import { AlchemizeMessage } from '../message/alchemizeMessage'
import { ClearAlchemyItemBoxMessage } from '../message/clearAlchemyItemBoxMessage'
import { IMessageListenerRegister } from '@churaverse/network-plugin-server/interface/IMessageListenerRegister'
import { BaseSocketController } from '@churaverse/network-plugin-server/interface/baseSocketController'
import { IEventBus, IMainScene, Store } from 'churaverse-engine-server'
import { RegisterMessageEvent } from '@churaverse/network-plugin-server/event/registerMessageEvent'
import { RegisterMessageListenerEvent } from '@churaverse/network-plugin-server/event/registerMessageListenerEvent'
import { ClearAlchemyItemBoxEvent } from '../event/clearAlchemyItemBoxEvent'

export class SocketController extends BaseSocketController<IMainScene> {
  private messageListenerRegister!: IMessageListenerRegister<IMainScene>

  public constructor(eventBus: IEventBus<IMainScene>, store: Store<IMainScene>) {
    super(eventBus, store)
  }

  public registerMessage(ev: RegisterMessageEvent<IMainScene>): void {
    ev.messageRegister.registerMessage('alchemyPotSpawn', AlchemyPotSpawnMessage, 'allClients')
    ev.messageRegister.registerMessage('alchemize', AlchemizeMessage, 'allClients')
    ev.messageRegister.registerMessage('clearAlchemyItemBox', ClearAlchemyItemBoxMessage, 'others')
  }

  public setupMessageListenerRegister(ev: RegisterMessageListenerEvent<IMainScene>): void {
    this.messageListenerRegister = ev.messageListenerRegister
  }

  public registerMessageListener(): void {
    this.messageListenerRegister.on('clearAlchemyItemBox', this.clearAlchemyItem)
  }

  public unregisterMessageListener(): void {
    this.messageListenerRegister.off('clearAlchemyItemBox', this.clearAlchemyItem)
  }

  private readonly clearAlchemyItem = (msg: ClearAlchemyItemBoxMessage): void => {
    const data = msg.data
    const clearAlchemyItemBoxEvent = new ClearAlchemyItemBoxEvent(data.playerId)
    this.eventBus.post(clearAlchemyItemBoxEvent)
  }
}
