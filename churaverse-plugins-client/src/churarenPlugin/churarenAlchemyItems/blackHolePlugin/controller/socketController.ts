import { BaseSocketController } from '@churaverse/network-plugin-client/interface/baseSocketController'
import {
  EntityDespawnEvent,
  EntitySpawnEvent,
  IEventBus,
  IMainScene,
  LivingDamageEvent,
  Position,
  Store,
} from 'churaverse-engine-client'
import { RegisterMessageEvent } from '@churaverse/network-plugin-client/event/registerMessageEvent'
import { RegisterMessageListenerEvent } from '@churaverse/network-plugin-client/event/registerMessageListenerEvent'
import { IMessageListenerRegister } from '@churaverse/network-plugin-client/interface/IMessageListenerRegister'
import { ChurarenDamageMessage } from '@churaverse/churaren-player-plugin-client/message/churarenDamageMessage'
import { BlackHole } from '../domain/blackHole'
import { BlackHoleDespawnMessage } from '../message/blackHoleDespawnMessage'
import { BlackHoleSpawnMessage } from '../message/blackHoleSpawnMessage'
import { BlackHolePluginStore } from '../store/defBlackHolePluginStore'
import { BossPluginStore } from '@churaverse/churaren-boss-plugin-client/store/defBossPluginStore'
import { BlackHoleDamageCause } from '../domain/blackHoleDamageCause'

export class SocketController extends BaseSocketController<IMainScene> {
  private blackHolePluginStore!: BlackHolePluginStore
  private bossPluginStore!: BossPluginStore
  private messageListenerRegister!: IMessageListenerRegister<IMainScene>

  public constructor(eventBus: IEventBus<IMainScene>, store: Store<IMainScene>) {
    super(eventBus, store)
  }

  public registerMessage(ev: RegisterMessageEvent<IMainScene>): void {
    ev.messageRegister.registerMessage('blackHoleSpawn', BlackHoleSpawnMessage, 'queue')
    ev.messageRegister.registerMessage('blackHoleDespawn', BlackHoleDespawnMessage, 'queue')
  }

  public setupRegisterMessageListener(ev: RegisterMessageListenerEvent<IMainScene>): void {
    this.messageListenerRegister = ev.messageListenerRegister
  }

  public registerMessageListener(): void {
    this.messageListenerRegister.on('blackHoleSpawn', this.blackHoleSpawn)
    this.messageListenerRegister.on('blackHoleDespawn', this.blackHoleDespawn)
    this.messageListenerRegister.on('churarenDamage', this.blackHoleDamage)
  }

  public unregisterMessageListener(): void {
    this.messageListenerRegister.off('blackHoleSpawn', this.blackHoleSpawn)
    this.messageListenerRegister.off('blackHoleDespawn', this.blackHoleDespawn)
    this.messageListenerRegister.off('churarenDamage', this.blackHoleDamage)
  }

  public getStores(): void {
    this.blackHolePluginStore = this.store.of('churarenBlackHolePlugin')
    this.bossPluginStore = this.store.of('bossPlugin')
  }

  private readonly blackHoleSpawn = (msg: BlackHoleSpawnMessage, senderId: string): void => {
    const data = msg.data
    const pos = new Position(data.startPos.x, data.startPos.y)
    const blackHole = new BlackHole(data.blackHoleId, senderId, pos, data.direction, data.spawnTime)
    const blackHoleSpawnEvent = new EntitySpawnEvent(blackHole)
    this.eventBus.post(blackHoleSpawnEvent)
  }

  private readonly blackHoleDespawn = (msg: BlackHoleDespawnMessage): void => {
    const data = msg.data
    const blackHole = this.blackHolePluginStore.blackHoles.get(data.blackHoleId)
    if (blackHole === undefined) return
    const blackHoleDespawnEvent = new EntityDespawnEvent(blackHole)
    this.eventBus.post(blackHoleDespawnEvent)
  }

  private readonly blackHoleDamage = (msg: ChurarenDamageMessage): void => {
    const data = msg.data
    if (data.cause !== 'blackHole') return
    const target = this.bossPluginStore.bosses.get(data.targetId)
    const blackHole = this.blackHolePluginStore.blackHoles.get(data.sourceId)
    if (target === undefined || blackHole === undefined) return
    const blackHoleDamageCause = new BlackHoleDamageCause(blackHole)
    const livingDamageEvent = new LivingDamageEvent(target, blackHoleDamageCause, data.amount)
    this.eventBus.post(livingDamageEvent)
  }
}
