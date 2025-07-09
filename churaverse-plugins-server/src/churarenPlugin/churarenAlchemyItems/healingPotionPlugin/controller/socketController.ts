import { PlayerHealEvent } from '@churaverse/churaren-player-plugin-server/event/playerHealEvent'
import { RegisterMessageEvent } from '@churaverse/network-plugin-server/event/registerMessageEvent'
import { RegisterMessageListenerEvent } from '@churaverse/network-plugin-server/event/registerMessageListenerEvent'
import { BaseSocketController } from '@churaverse/network-plugin-server/interface/baseSocketController'
import { IMessageListenerRegister } from '@churaverse/network-plugin-server/interface/IMessageListenerRegister'
import { IEventBus, IMainScene, Store } from 'churaverse-engine-server'
import { UseHealingPotionMessage } from '../message/useHealingPotionMessage'

export class SocketController extends BaseSocketController<IMainScene> {
  private messageListenerRegister!: IMessageListenerRegister<IMainScene>

  public constructor(eventBus: IEventBus<IMainScene>, store: Store<IMainScene>) {
    super(eventBus, store)
  }

  public registerMessage(ev: RegisterMessageEvent<IMainScene>): void {
    ev.messageRegister.registerMessage('useHealingPotion', UseHealingPotionMessage, 'allClients')
  }

  public setupMessageListenerRegister(ev: RegisterMessageListenerEvent<IMainScene>): void {
    this.messageListenerRegister = ev.messageListenerRegister
  }

  public registerMessageListener(): void {
    this.messageListenerRegister.on('useHealingPotion', this.useHealingPotion)
  }

  public unregisterMessageListener(): void {
    this.messageListenerRegister.off('useHealingPotion', this.useHealingPotion)
  }

  private readonly useHealingPotion = (msg: UseHealingPotionMessage): void => {
    const data = msg.data
    const playerHealEvent = new PlayerHealEvent(data.playerId, data.healAmount)
    this.eventBus.post(playerHealEvent)
  }
}
