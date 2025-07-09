import { RegisterMessageEvent } from '@churaverse/network-plugin-client/event/registerMessageEvent'
import { RegisterMessageListenerEvent } from '@churaverse/network-plugin-client/event/registerMessageListenerEvent'
import { BaseSocketController } from '@churaverse/network-plugin-client/interface/baseSocketController'
import { IMessageListenerRegister } from '@churaverse/network-plugin-client/interface/IMessageListenerRegister'
import { IEventBus, IMainScene, Store } from 'churaverse-engine-client'
import { UseHealingPotionMessage } from '../message/useHealingPotionMessage'
import { PlayerHealEvent } from '@churaverse/churaren-player-plugin-client/event/playerHealEvent'

export class SocketController extends BaseSocketController<IMainScene> {
  private messageListenerRegister!: IMessageListenerRegister<IMainScene>

  public constructor(eventBus: IEventBus<IMainScene>, store: Store<IMainScene>) {
    super(eventBus, store)
  }

  public registerMessage(ev: RegisterMessageEvent<IMainScene>): void {
    ev.messageRegister.registerMessage('useHealingPotion', UseHealingPotionMessage, 'queue')
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
