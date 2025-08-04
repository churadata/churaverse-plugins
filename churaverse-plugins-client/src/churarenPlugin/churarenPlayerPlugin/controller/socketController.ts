import { RegisterMessageEvent } from '@churaverse/network-plugin-client/event/registerMessageEvent'
import { BaseSocketController } from '@churaverse/network-plugin-client/interface/baseSocketController'
import { IMessageListenerRegister } from '@churaverse/network-plugin-client/interface/IMessageListenerRegister'
import { PlayerPluginStore } from '@churaverse/player-plugin-client/store/defPlayerPluginStore'
import { IEventBus, IMainScene, Store } from 'churaverse-engine-client'
import { InvicibleTimeMessage } from '../message/invicibleTimeMessage'
import { GhostModeMessage } from '../message/ghostModeMessage'
import { RegisterMessageListenerEvent } from '@churaverse/network-plugin-client/event/registerMessageListenerEvent'
import { InvicibleTimeEvent } from '../event/invicibleTimeEvent'
import { GhostModeEvent } from '../event/ghostModeEvent'
import { GetChurarenItemMessage } from '../message/getChurarenItemMessage'
import { GetChurarenItemEvent } from '../event/getChurarenItemEvent'
import { DropChurarenItemMessage } from '../message/dropChurarenItemMessage'
import { DropChurarenItemEvent } from '../event/dropChurarenItemEvent'
import { ChurarenDamageMessage } from '../message/churarenDamageMessage'
import { PlayerHealMessage } from '../message/playerHealMessage'
import { PlayerHealEvent } from '../event/playerHealEvent'
import { PlayerRevivalMessage } from '../message/playerRevivalMessage'
import { PlayerRevivalEvent } from '../event/playerRevivalEvent'

export class SocketController extends BaseSocketController<IMainScene> {
  private playerPluginStore!: PlayerPluginStore
  private messageListenerRegister!: IMessageListenerRegister<IMainScene>

  public constructor(eventBus: IEventBus<IMainScene>, store: Store<IMainScene>) {
    super(eventBus, store)
  }

  public registerMessage(ev: RegisterMessageEvent<IMainScene>): void {
    ev.messageRegister.registerMessage('invicibleTime', InvicibleTimeMessage, 'queue')
    ev.messageRegister.registerMessage('getChurarenItem', GetChurarenItemMessage, 'queue')
    ev.messageRegister.registerMessage('dropChurarenItem', DropChurarenItemMessage, 'queue')
    ev.messageRegister.registerMessage('ghostMode', GhostModeMessage, 'queue')
    ev.messageRegister.registerMessage('churarenDamage', ChurarenDamageMessage, 'queue')
    ev.messageRegister.registerMessage('playerHeal', PlayerHealMessage, 'queue')
    ev.messageRegister.registerMessage('playerRevival', PlayerRevivalMessage, 'queue')
  }

  public setupMessageListenerRegister(ev: RegisterMessageListenerEvent<IMainScene>): void {
    this.messageListenerRegister = ev.messageListenerRegister
    this.playerPluginStore = this.store.of('playerPlugin')
  }

  public registerMessageListener(): void {
    this.messageListenerRegister.on('invicibleTime', this.onInvicibleTime)
    this.messageListenerRegister.on('getChurarenItem', this.getItem)
    this.messageListenerRegister.on('dropChurarenItem', this.dropItem)
    this.messageListenerRegister.on('ghostMode', this.ghostMode)
    this.messageListenerRegister.on('playerHeal', this.playerHeal)
    this.messageListenerRegister.on('playerRevival', this.playerRevival)
  }

  public unregisterMessageListener(): void {
    this.messageListenerRegister.off('invicibleTime', this.onInvicibleTime)
    this.messageListenerRegister.off('getChurarenItem', this.getItem)
    this.messageListenerRegister.off('dropChurarenItem', this.dropItem)
    this.messageListenerRegister.off('ghostMode', this.ghostMode)
    this.messageListenerRegister.off('playerHeal', this.playerHeal)
    this.messageListenerRegister.off('playerRevival', this.playerRevival)
  }

  private readonly onInvicibleTime = (msg: InvicibleTimeMessage): void => {
    const data = msg.data
    const invicibleTimeEvent = new InvicibleTimeEvent(data.playerId, data.invicibleTime)
    this.eventBus.post(invicibleTimeEvent)
  }

  private readonly getItem = (msg: GetChurarenItemMessage): void => {
    const data = msg.data
    const getItemEvent = new GetChurarenItemEvent(data.playerId, data.itemId)
    this.eventBus.post(getItemEvent)
  }

  private readonly dropItem = (msg: DropChurarenItemMessage): void => {
    const data = msg.data
    const dropItemEvent = new DropChurarenItemEvent(data.playerId, data.itemId)
    this.eventBus.post(dropItemEvent)
  }

  private readonly ghostMode = (msg: GhostModeMessage): void => {
    const data = msg.data
    const player = this.playerPluginStore.players.get(data.playerId)
    if (player === undefined) return
    const ghostModeEvent = new GhostModeEvent(player.id)
    this.eventBus.post(ghostModeEvent)
  }

  private readonly playerHeal = (msg: PlayerHealMessage): void => {
    const data = msg.data
    const player = this.playerPluginStore.players.get(data.playerId)
    if (player === undefined) return
    const playerHealEvent = new PlayerHealEvent(player.id, data.healAmount)
    this.eventBus.post(playerHealEvent)
  }

  private readonly playerRevival = (msg: PlayerRevivalMessage): void => {
    const data = msg.data
    const player = this.playerPluginStore.players.get(data.playerId)
    if (player === undefined) return
    const playerRevivalEvent = new PlayerRevivalEvent(player.id)
    this.eventBus.post(playerRevivalEvent)
  }
}
