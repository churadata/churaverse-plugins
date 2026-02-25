import { RegisterMessageEvent } from '@churaverse/network-plugin-server/event/registerMessageEvent'
import { RegisterMessageListenerEvent } from '@churaverse/network-plugin-server/event/registerMessageListenerEvent'
import { BaseSocketController } from '@churaverse/network-plugin-server/interface/baseSocketController'
import { IMessageListenerRegister } from '@churaverse/network-plugin-server/interface/IMessageListenerRegister'
import { IEventBus, IMainScene, Store } from 'churaverse-engine-server'
import { UseRevivalItemMessage } from '../message/useRevivalItemMessage'
import { UseRevivalItemEvent } from '../event/useRevivalItemEvent'

export class SocketController extends BaseSocketController<IMainScene> {
  private messageListenerRegister!: IMessageListenerRegister<IMainScene>

  public constructor(eventBus: IEventBus<IMainScene>, store: Store<IMainScene>) {
    super(eventBus, store)
  }

  public registerMessage(ev: RegisterMessageEvent<IMainScene>): void {
    ev.messageRegister.registerMessage('useRevivalItem', UseRevivalItemMessage, 'onlyServer')
  }

  public setupMessageListenerRegister(ev: RegisterMessageListenerEvent<IMainScene>): void {
    this.messageListenerRegister = ev.messageListenerRegister
  }

  public registerMessageListener(): void {
    this.messageListenerRegister.on('useRevivalItem', this.useRevivalItem)
  }

  public unregisterMessageListener(): void {
    this.messageListenerRegister.off('useRevivalItem', this.useRevivalItem)
  }

  private readonly useRevivalItem = (msg: UseRevivalItemMessage): void => {
    const data = msg.data
    const playerRevivalEvent = new UseRevivalItemEvent(data.playerId)
    this.eventBus.post(playerRevivalEvent)
  }
}
