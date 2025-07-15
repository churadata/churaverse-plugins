import { BaseSocketController } from '@churaverse/network-plugin-server/interface/baseSocketController'
import { IEventBus, IMainScene, Store } from 'churaverse-engine-server'
import { RegisterMessageEvent } from '@churaverse/network-plugin-server/event/registerMessageEvent'
import { IMessageListenerRegister } from '@churaverse/network-plugin-server/interface/IMessageListenerRegister'
import { RegisterMessageListenerEvent } from '@churaverse/network-plugin-server/event/registerMessageListenerEvent'
import { InvicibleTimeMessage } from '../message/invicibleTimeMessage'
import { GetChurarenItemMessage } from '../message/getChurarenItemMessage'
import { DropChurarenItemMessage } from '../message/dropChurarenItemMessage'
import { DropChurarenItemEvent } from '../event/dropChurarenItemEvent'
import { ChurarenDamageMessage } from '../message/churarenDamageMessage'
import { PlayerHealMessage } from '../message/playerHealMessage'
import { PlayerHealEvent } from '../event/playerHealEvent'
import { PlayerRevivalMessage } from '../message/playerRevivalMessage'

export class SocketController extends BaseSocketController<IMainScene> {
  private messageListenerRegister!: IMessageListenerRegister<IMainScene>

  public constructor(eventBus: IEventBus<IMainScene>, store: Store<IMainScene>) {
    super(eventBus, store)
  }

  public registerMessage(ev: RegisterMessageEvent<IMainScene>): void {
    ev.messageRegister.registerMessage('invicibleTime', InvicibleTimeMessage, 'allClients')
    ev.messageRegister.registerMessage('getChurarenItem', GetChurarenItemMessage, 'allClients')
    ev.messageRegister.registerMessage('dropChurarenItem', DropChurarenItemMessage, 'others')
    ev.messageRegister.registerMessage('churarenDamage', ChurarenDamageMessage, 'allClients')
    ev.messageRegister.registerMessage('playerHeal', PlayerHealMessage, 'allClients')
    ev.messageRegister.registerMessage('playerRevival', PlayerRevivalMessage, 'allClients')
  }

  public setupMessageListenerRegister(ev: RegisterMessageListenerEvent<IMainScene>): void {
    this.messageListenerRegister = ev.messageListenerRegister
  }

  public registerMessageListener(): void {
    this.messageListenerRegister.on('dropChurarenItem', this.dropItem)
    this.messageListenerRegister.on('playerHeal', this.playerHeal)
  }

  public unregisterMessageListener(): void {
    this.messageListenerRegister.off('dropChurarenItem', this.dropItem)
    this.messageListenerRegister.off('playerHeal', this.playerHeal)
  }

  private readonly dropItem = (msg: DropChurarenItemMessage): void => {
    const data = msg.data
    const dropItemEvent = new DropChurarenItemEvent(data.playerId, data.itemId)
    this.eventBus.post(dropItemEvent)
  }

  private readonly playerHeal = (msg: PlayerHealMessage): void => {
    const data = msg.data
    const player = this.store.of('playerPlugin').players.get(data.playerId)
    if (player === undefined) return
    const playerHealEvent = new PlayerHealEvent(player.id, data.healAmount)
    this.eventBus.post(playerHealEvent)
  }
}
