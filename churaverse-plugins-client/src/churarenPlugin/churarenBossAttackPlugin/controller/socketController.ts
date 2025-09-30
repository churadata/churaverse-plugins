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
import { PlayerPluginStore } from '@churaverse/player-plugin-client/store/defPlayerPluginStore'
import { BossAttackPluginStore } from '../store/defBossAttackPluginStore'
import { BossAttackSpawnMessage } from '../message/bossAttackSpawnMessage'
import { BossAttackHitMessage } from '../message/bossAttackHitMessage'
import { ChurarenDamageMessage } from '@churaverse/churaren-player-plugin-client/message/churarenDamageMessage'
import { BossAttack } from '../domain/bossAttack'
import { BossAttackDamageCause } from '../domain/bossAttackDamageCause'
import { IMessageListenerRegister } from '@churaverse/network-plugin-client/interface/IMessageListenerRegister'

export class SocketController extends BaseSocketController<IMainScene> {
  private bossAttackPluginStore!: BossAttackPluginStore
  private playerPluginStore!: PlayerPluginStore
  public messageListenerRegister!: IMessageListenerRegister<IMainScene>

  public constructor(eventBus: IEventBus<IMainScene>, store: Store<IMainScene>) {
    super(eventBus, store)
  }

  public registerMessage(ev: RegisterMessageEvent<IMainScene>): void {
    ev.messageRegister.registerMessage('bossAttackSpawn', BossAttackSpawnMessage, 'queue')
    ev.messageRegister.registerMessage('bossAttackHit', BossAttackHitMessage, 'queue')
  }

  public setupMessageListenerRegister(ev: RegisterMessageListenerEvent<IMainScene>): void {
    this.messageListenerRegister = ev.messageListenerRegister
  }

  public getStore(): void {
    this.bossAttackPluginStore = this.store.of('bossAttackPlugin')
    this.playerPluginStore = this.store.of('playerPlugin')
  }

  public registerMessageListener(): void {
    this.messageListenerRegister.on('bossAttackSpawn', this.bossAttackSpawn)
    this.messageListenerRegister.on('bossAttackHit', this.bossAttackHit)
    this.messageListenerRegister.on('churarenDamage', this.bossAttackDamage)
  }

  public unregisterMessageListener(): void {
    this.messageListenerRegister.off('bossAttackSpawn', this.bossAttackSpawn)
    this.messageListenerRegister.off('bossAttackHit', this.bossAttackHit)
    this.messageListenerRegister.off('churarenDamage', this.bossAttackDamage)
  }

  private readonly bossAttackSpawn = (msg: BossAttackSpawnMessage, senderId: string): void => {
    const data = msg.data
    const pos = new Position(data.startPos.x, data.startPos.y)
    const bossAttack = new BossAttack(data.bossAttackId, senderId, pos, data.direction, data.spawnTime)
    const bossAttackSpawnEvent = new EntitySpawnEvent(bossAttack)
    this.eventBus.post(bossAttackSpawnEvent)
  }

  private readonly bossAttackHit = (msg: BossAttackHitMessage): void => {
    const data = msg.data
    const bossAttack = this.bossAttackPluginStore.bossAttacks.get(data.bossAttackId)
    if (bossAttack === undefined) return
    const bossAttackDespawnEvent = new EntityDespawnEvent(bossAttack)
    this.eventBus.post(bossAttackDespawnEvent)
  }

  // TODO: CV-717のマージ後にChurarenDamageMessageを受け取るよう修正
  private readonly bossAttackDamage = (msg: ChurarenDamageMessage): void => {
    const data = msg.data
    if (data.cause !== 'bossAttack') return
    const target = this.playerPluginStore.players.get(data.targetId)
    const bossAttack = this.bossAttackPluginStore.bossAttacks.get(data.sourceId)
    const attacker = bossAttack?.churarenWeaponOwnerId
    if (target === undefined || bossAttack === undefined || attacker === undefined) return
    const bossAttackDamageCause = new BossAttackDamageCause(bossAttack)
    const livingDamageEvent = new LivingDamageEvent(target, bossAttackDamageCause, data.amount)
    this.eventBus.post(livingDamageEvent)
  }
}
