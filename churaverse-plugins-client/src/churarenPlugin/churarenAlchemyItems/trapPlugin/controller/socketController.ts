import { IMainScene, IEventBus, Store, Position, EntityDespawnEvent, EntitySpawnEvent } from 'churaverse-engine-client'
import { RegisterMessageEvent } from '@churaverse/network-plugin-client/event/registerMessageEvent'
import { RegisterMessageListenerEvent } from '@churaverse/network-plugin-client/event/registerMessageListenerEvent'
import { BaseSocketController } from '@churaverse/network-plugin-client/interface/baseSocketController'
import { IMessageListenerRegister } from '@churaverse/network-plugin-client/interface/IMessageListenerRegister'
import { ChurarenDamageMessage } from '@churaverse/churaren-player-plugin-client/message/churarenDamageMessage'
import { TrapPluginStore } from '../store/defTrapPluginStore'
import { TrapSpawnMessage } from '../message/trapSpawnMessage'
import { Trap } from '../domain/trap'
import { TrapDespawnMessage } from '../message/trapDespawnMessage'

export class SocketController extends BaseSocketController<IMainScene> {
  private trapPluginStore!: TrapPluginStore
  private messageListenerRegister!: IMessageListenerRegister<IMainScene>

  public constructor(eventBus: IEventBus<IMainScene>, store: Store<IMainScene>) {
    super(eventBus, store)
  }

  public registerMessage(ev: RegisterMessageEvent<IMainScene>): void {
    ev.messageRegister.registerMessage('trapSpawn', TrapSpawnMessage, 'queue')
    ev.messageRegister.registerMessage('trapDespawn', TrapDespawnMessage, 'queue')
  }

  public setupRegisterMessageListener(ev: RegisterMessageListenerEvent<IMainScene>): void {
    this.messageListenerRegister = ev.messageListenerRegister
  }

  public registerMessageListener(): void {
    this.messageListenerRegister.on('trapSpawn', this.trapSpawn)
    this.messageListenerRegister.on('trapDespawn', this.trapDespawn)
    this.messageListenerRegister.on('churarenDamage', this.trapDamage)
  }

  public unregisterMessageListener(): void {
    this.messageListenerRegister.off('trapSpawn', this.trapSpawn)
    this.messageListenerRegister.off('trapDespawn', this.trapDespawn)
    this.messageListenerRegister.off('churarenDamage', this.trapDamage)
  }

  public getStores(): void {
    this.trapPluginStore = this.store.of('churarenTrapPlugin')
  }

  private readonly trapSpawn = (msg: TrapSpawnMessage, senderId: string): void => {
    const data = msg.data
    const pos = new Position(data.startPos.x, data.startPos.y)
    const trap = new Trap(data.trapId, senderId, pos, data.direction, data.spawnTime)
    const trapSpawnEvent = new EntitySpawnEvent(trap)
    this.eventBus.post(trapSpawnEvent)
  }

  private readonly trapDespawn = (msg: TrapDespawnMessage): void => {
    const data = msg.data
    const trap = this.trapPluginStore.traps.get(data.trapId)
    if (trap === undefined) return
    const trapDespawnEvent = new EntityDespawnEvent(trap)
    this.eventBus.post(trapDespawnEvent)
  }

  private readonly trapDamage = (msg: ChurarenDamageMessage): void => {}
}
