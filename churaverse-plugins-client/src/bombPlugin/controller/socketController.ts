import {
  IMainScene,
  IEventBus,
  Store,
  Position,
  EntitySpawnEvent,
  EntityDespawnEvent,
  LivingDamageEvent,
} from 'churaverse-engine-client'
import { RegisterMessageEvent } from '../../networkPlugin/event/registerMessageEvent'
import { RegisterMessageListenerEvent } from '../../networkPlugin/event/registerMessageListenerEvent'
import { BaseSocketController } from '../../networkPlugin/interface/baseSocketController'
import { Bomb } from '../domain/bomb'
import { BombSpawnMessage } from '../message/bombSpawnMessage'
import { BombPluginStore } from '../store/defBombPluginStore'
import { BombExplosionMessage } from '../message/bombExplosionMessage'
import { WeaponDamageMessage } from '../../playerPlugin/message/weaponDamageMessage'
import { PlayerPluginStore } from '../../playerPlugin/store/defPlayerPluginStore'
import { BombDamageCause } from '../domain/bombDamageCause'

export class SocketController extends BaseSocketController<IMainScene> {
  private bombPluginStore!: BombPluginStore
  private playerPluginStore!: PlayerPluginStore

  public constructor(eventBus: IEventBus<IMainScene>, store: Store<IMainScene>) {
    super(eventBus, store)
    eventBus.subscribeEvent('init', this.getStores.bind(this))
  }

  private getStores(): void {
    this.bombPluginStore = this.store.of('bombPlugin')
    this.playerPluginStore = this.store.of('playerPlugin')
  }

  public registerMessage(ev: RegisterMessageEvent<IMainScene>): void {
    ev.messageRegister.registerMessage('bombSpawn', BombSpawnMessage, 'queue')
    ev.messageRegister.registerMessage('bombExplosion', BombExplosionMessage, 'queue')

    // this.socket.listenAction(SocketListenActionType.HitBomb, (data) => this.bombHit(data))
  }

  public registerMessageListener(ev: RegisterMessageListenerEvent<IMainScene>): void {
    ev.messageListenerRegister.on('bombSpawn', this.bombSpawn.bind(this))
    ev.messageListenerRegister.on('bombExplosion', this.bombExplosion.bind(this))
    ev.messageListenerRegister.on('weaponDamage', this.bombDamage.bind(this))
  }

  private bombSpawn(msg: BombSpawnMessage, senderId: string): void {
    const data = msg.data
    const pos = new Position(data.startPos.x, data.startPos.y)
    const bomb = new Bomb(data.bombId, senderId, pos, data.direction, data.spawnTime)
    const bombSpawnEvent = new EntitySpawnEvent(bomb)
    this.eventBus.post(bombSpawnEvent)
  }

  private bombExplosion(msg: BombExplosionMessage): void {
    const data = msg.data
    const bomb = this.bombPluginStore.bombs.get(data.bombId)
    if (bomb === undefined) return
    const bombDespawnEvent = new EntityDespawnEvent(bomb)
    this.eventBus.post(bombDespawnEvent)
  }

  private bombDamage(msg: WeaponDamageMessage): void {
    const data = msg.data
    if (data.cause !== 'bomb') return
    const target = this.playerPluginStore.players.get(data.targetId)
    const bomb = this.bombPluginStore.bombs.get(data.weaponId)
    const attacker = bomb?.ownerId
    if (target === undefined || bomb === undefined || attacker === undefined) return
    const bombDamageCause = new BombDamageCause(bomb)
    const livingDamageEvent = new LivingDamageEvent(target, bombDamageCause, data.amount)
    this.eventBus.post(livingDamageEvent)
  }
}
