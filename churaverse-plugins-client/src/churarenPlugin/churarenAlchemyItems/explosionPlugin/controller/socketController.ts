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
import { ExplosionPluginStore } from '../store/defExplosionPluginStore'
import { RegisterMessageEvent } from '@churaverse/network-plugin-client/event/registerMessageEvent'
import { ExplosionSpawnMessage } from '../message/explosionSpawnMessage'
import { ExplosionHitMessage } from '../message/explosionHitMessage'
import { RegisterMessageListenerEvent } from '@churaverse/network-plugin-client/event/registerMessageListenerEvent'
import { IMessageListenerRegister } from '@churaverse/network-plugin-client/interface/IMessageListenerRegister'
import { Explosion } from '../domain/explosion'
import { ChurarenDamageMessage } from '@churaverse/churaren-player-plugin-client/message/churarenDamageMessage'
import { ExplosionDamageCause } from '../domain/explosionDamageCause'
import { BossPluginStore } from '@churaverse/churaren-boss-plugin-client/store/defBossPluginStore'

export class SocketController extends BaseSocketController<IMainScene> {
  private explosionPluginStore!: ExplosionPluginStore
  private bossPluginStore!: BossPluginStore
  private messageListenerRegister!: IMessageListenerRegister<IMainScene>

  public constructor(eventBus: IEventBus<IMainScene>, store: Store<IMainScene>) {
    super(eventBus, store)
  }

  public registerMessage(ev: RegisterMessageEvent<IMainScene>): void {
    ev.messageRegister.registerMessage('explosionSpawn', ExplosionSpawnMessage, 'queue')
    ev.messageRegister.registerMessage('explosionHit', ExplosionHitMessage, 'queue')
  }

  public setupRegisterMessageListener(ev: RegisterMessageListenerEvent<IMainScene>): void {
    this.messageListenerRegister = ev.messageListenerRegister
  }

  public registerMessageListener(): void {
    this.messageListenerRegister.on('explosionSpawn', this.explosionSpawn)
    this.messageListenerRegister.on('explosionHit', this.explosionHit)
    this.messageListenerRegister.on('churarenDamage', this.explosionDamage)
  }

  public unregisterMessageListener(): void {
    this.messageListenerRegister.off('explosionSpawn', this.explosionSpawn)
    this.messageListenerRegister.off('explosionHit', this.explosionHit)
    this.messageListenerRegister.off('churarenDamage', this.explosionDamage)
  }

  public getStores(): void {
    this.explosionPluginStore = this.store.of('churarenExplosionPlugin')
    this.bossPluginStore = this.store.of('bossPlugin')
  }

  private readonly explosionSpawn = (msg: ExplosionSpawnMessage, senderId: string): void => {
    const data = msg.data
    const pos = new Position(data.startPos.x, data.startPos.y)
    const explosion = new Explosion(data.explosionId, senderId, pos, data.direction, data.spawnTime)
    const explosionSpawnEvent = new EntitySpawnEvent(explosion)
    this.eventBus.post(explosionSpawnEvent)
  }

  private readonly explosionHit = (msg: ExplosionHitMessage): void => {
    const data = msg.data
    const explosion = this.explosionPluginStore.explosions.get(data.explosionId)
    if (explosion === undefined) return
    const explosionDespawnEvent = new EntityDespawnEvent(explosion)
    this.eventBus.post(explosionDespawnEvent)
  }

  private readonly explosionDamage = (msg: ChurarenDamageMessage): void => {
    const data = msg.data
    if (data.cause !== 'explosion') return
    const target = this.bossPluginStore.bosses.get(data.targetId)
    const explosion = this.explosionPluginStore.explosions.get(data.sourceId)
    if (target === undefined || explosion === undefined) return
    const explosionDamageCause = new ExplosionDamageCause(explosion)
    const livingDamageEvent = new LivingDamageEvent(target, explosionDamageCause, data.amount)
    this.eventBus.post(livingDamageEvent)
  }
}
