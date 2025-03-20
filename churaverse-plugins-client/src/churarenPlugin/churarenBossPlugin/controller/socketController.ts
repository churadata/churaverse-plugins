import {
  IMainScene,
  IEventBus,
  Store,
  Position,
  EntitySpawnEvent,
  EntityDespawnEvent,
  LivingDamageEvent,
} from 'churaverse-engine-client'
import { RegisterMessageEvent } from '@churaverse/network-plugin-client/event/registerMessageEvent'
import { RegisterMessageListenerEvent } from '@churaverse/network-plugin-client/event/registerMessageListenerEvent'
import { BaseSocketController } from '@churaverse/network-plugin-client/interface/baseSocketController'
import { BossPluginStore } from '../store/defBossPluginStore'
import { BossSpawnMessage } from '../message/bossSpawnMessage'
import { BossDespawnMessage } from '../message/bossDespawnMessage'
import { BossWalkMessage } from '../message/bossWalkMessage'
import { Boss } from '../domain/boss'
import { WeaponDamageMessage } from '@churaverse/player-plugin-client/message/weaponDamageMessage'
import { CollisionBossDamageCause } from '../domain/collisionBossDamageCause'
import { BossWalkEvent } from '../event/bossWalkEvent'
import { IMessageListenerRegister } from '@churaverse/network-plugin-client/interface/IMessageListenerRegister'

// TODO:(DELETE)錬金アイテムを実装するまでの仮実装
import '@churaverse/bomb-plugin-client/store/defBombPluginStore'
import '@churaverse/shark-plugin-client/store/defSharkPluginStore'
import { BombDamageCause } from '@churaverse/bomb-plugin-client/domain/bombDamageCause'
import { SharkDamageCause } from '@churaverse/shark-plugin-client/domain/sharkDamageCause'

export class SocketController extends BaseSocketController<IMainScene> {
  public bossPluginStore!: BossPluginStore
  public messageListenerRegister!: IMessageListenerRegister<IMainScene>

  public constructor(eventBus: IEventBus<IMainScene>, store: Store<IMainScene>) {
    super(eventBus, store)
  }

  public registerMessage(ev: RegisterMessageEvent<IMainScene>): void {
    ev.messageRegister.registerMessage('bossSpawn', BossSpawnMessage, 'queue')
    ev.messageRegister.registerMessage('bossDespawn', BossDespawnMessage, 'queue')
    ev.messageRegister.registerMessage('bossWalk', BossWalkMessage, 'queue')
  }

  public setupMessageListenerRegister(ev: RegisterMessageListenerEvent<IMainScene>): void {
    this.messageListenerRegister = ev.messageListenerRegister
  }

  public registerMessageListener(): void {
    this.messageListenerRegister.on('bossSpawn', this.bossSpawn)
    this.messageListenerRegister.on('bossDespawn', this.bossDespawn)
    this.messageListenerRegister.on('weaponDamage', this.collisionBossDamage)
    this.messageListenerRegister.on('bossWalk', this.bossWalk)

    // TODO:(DELETE)錬金アイテムを実装するまでの仮実装
    this.messageListenerRegister.on('weaponDamage', this.bossDamageBombOrShark)
  }

  public unregisterMessageListener(): void {
    this.messageListenerRegister.off('bossSpawn', this.bossSpawn)
    this.messageListenerRegister.off('bossDespawn', this.bossDespawn)
    this.messageListenerRegister.off('weaponDamage', this.collisionBossDamage)
    this.messageListenerRegister.off('bossWalk', this.bossWalk)

    // TODO:(DELETE)錬金アイテムを実装するまでの仮実装
    this.messageListenerRegister.off('weaponDamage', this.bossDamageBombOrShark)
  }

  public getStore(): void {
    this.bossPluginStore = this.store.of('bossPlugin')
  }

  private readonly bossSpawn = (msg: BossSpawnMessage): void => {
    const data = msg.data
    const pos = new Position(data.startPos.x, data.startPos.y)
    const boss = new Boss(data.bossId, pos, data.spawnTime, data.bossHp)
    if (this.bossPluginStore.bosses.get(data.bossId) !== undefined) return
    const bossSpawnEvent = new EntitySpawnEvent(boss)
    this.eventBus.post(bossSpawnEvent)
  }

  private readonly bossDespawn = (msg: BossDespawnMessage): void => {
    const data = msg.data
    const boss = this.bossPluginStore.bosses.get(data.bossId)
    if (boss === undefined) return
    const bossDespawnEvent = new EntityDespawnEvent(boss)
    this.eventBus.post(bossDespawnEvent)
  }

  private readonly collisionBossDamage = (msg: WeaponDamageMessage): void => {
    const data = msg.data
    if (data.cause !== 'collisionBoss') return
    const target = this.store.of('playerPlugin').players.get(data.targetId)
    const bossEntity = this.bossPluginStore.bosses.get(data.weaponId)
    const attacker = bossEntity?.bossId
    if (target === undefined || bossEntity === undefined || attacker === undefined) return
    const collisionBossDamageCause = new CollisionBossDamageCause('collisionBoss', bossEntity)
    const livingDamageEvent = new LivingDamageEvent(target, collisionBossDamageCause, data.amount)
    this.eventBus.post(livingDamageEvent)
  }

  private readonly bossWalk = (msg: BossWalkMessage): void => {
    const data = msg.data
    const position = new Position(data.startPos.x, data.startPos.y)
    const dest = new Position(data.dest.x, data.dest.y)
    const bossWalkEvent = new BossWalkEvent(data.bossId, data.direction, position, dest, data.speed)
    this.eventBus.post(bossWalkEvent)
  }

  // TODO:(DELETE)錬金アイテムを実装するまでの仮実装
  private readonly bossDamageBombOrShark = (msg: WeaponDamageMessage): void => {
    const data = msg.data
    switch (data.cause as string) {
      case 'bomb': {
        const target = this.bossPluginStore.bosses.get(data.targetId)
        const bomb = this.store.of('bombPlugin').bombs.get(data.weaponId)
        const attacker = bomb?.ownerId
        if (target === undefined || bomb === undefined || attacker === undefined) return
        const damageCause = new BombDamageCause(bomb)
        const livingDamageEvent = new LivingDamageEvent(target, damageCause, data.amount)
        this.eventBus.post(livingDamageEvent)
        break
      }
      case 'shark': {
        const target = this.bossPluginStore.bosses.get(data.targetId)
        const shark = this.store.of('sharkPlugin').sharks.get(data.weaponId)
        const attacker = shark?.ownerId
        if (target === undefined || shark === undefined || attacker === undefined) return
        const damageCause = new SharkDamageCause(shark)
        const livingDamageEvent = new LivingDamageEvent(target, damageCause, data.amount)
        this.eventBus.post(livingDamageEvent)
        break
      }
    }
  }
}
