import {
  IMainScene,
  IEventBus,
  Store,
  Position,
  EntitySpawnEvent,
  EntityDespawnEvent,
  LivingDamageEvent,
} from 'churaverse-engine-client'
import { BaseSocketController } from '@churaverse/network-plugin-client/interface/baseSocketController'
import { RegisterMessageEvent } from '@churaverse/network-plugin-client/event/registerMessageEvent'
import { RegisterMessageListenerEvent } from '@churaverse/network-plugin-client/event/registerMessageListenerEvent'
import { IceArrowPluginStore } from '../store/defIceArrowPluginStore'
import { IceArrowSpawnMessage } from '../message/iceArrowSpawnMessage'
import { IceArrow } from '../domain/iceArrow'
import { IceArrowHitMessage } from '../message/iceArrowHitMessage'
import { ChurarenDamageMessage } from '@churaverse/churaren-player-plugin-client/message/churarenDamageMessage'
import { IMessageListenerRegister } from '@churaverse/network-plugin-client/interface/IMessageListenerRegister'
import { BossPluginStore } from '@churaverse/churaren-boss-plugin-client/store/defBossPluginStore'
import { IceArrowDamageCause } from '../domain/iceArrowDamageCause'

export class SocketController extends BaseSocketController<IMainScene> {
  private iceArrowPluginStore!: IceArrowPluginStore
  private bossPluginStore!: BossPluginStore
  private messageListenerRegister!: IMessageListenerRegister<IMainScene>

  public constructor(eventBus: IEventBus<IMainScene>, store: Store<IMainScene>) {
    super(eventBus, store)
  }

  public registerMessage(ev: RegisterMessageEvent<IMainScene>): void {
    ev.messageRegister.registerMessage('iceArrowSpawn', IceArrowSpawnMessage, 'queue')
    ev.messageRegister.registerMessage('iceArrowHit', IceArrowHitMessage, 'queue')
  }

  public setupRegisterMessageListener(ev: RegisterMessageListenerEvent<IMainScene>): void {
    this.messageListenerRegister = ev.messageListenerRegister
  }

  public registerMessageListener(): void {
    this.messageListenerRegister.on('iceArrowSpawn', this.iceArrowSpawn)
    this.messageListenerRegister.on('iceArrowHit', this.iceArrowHit)
    this.messageListenerRegister.on('churarenDamage', this.iceArrowDamage)
  }

  public unregisterMessageListener(): void {
    this.messageListenerRegister.off('iceArrowSpawn', this.iceArrowSpawn)
    this.messageListenerRegister.off('iceArrowHit', this.iceArrowHit)
    this.messageListenerRegister.off('churarenDamage', this.iceArrowDamage)
  }

  public getStores(): void {
    this.iceArrowPluginStore = this.store.of('churarenIceArrowPlugin')
    this.bossPluginStore = this.store.of('bossPlugin')
  }

  private readonly iceArrowSpawn = (msg: IceArrowSpawnMessage, senderId: string): void => {
    const data = msg.data
    const position = new Position(data.startPos.x, data.startPos.y)
    const iceArrow = new IceArrow(
      data.iceArrowId,
      senderId,
      position,
      data.direction,
      data.spawnTime,
      data.attackVector
    )
    const iceArrowSpawnEvent = new EntitySpawnEvent(iceArrow)
    this.eventBus.post(iceArrowSpawnEvent)
  }

  private readonly iceArrowHit = (msg: IceArrowHitMessage): void => {
    const data = msg.data
    const iceArrow = this.iceArrowPluginStore.iceArrows.get(data.iceArrowId)
    if (iceArrow === undefined) return
    const iceArrowDespawnEvent = new EntityDespawnEvent(iceArrow)
    this.eventBus.post(iceArrowDespawnEvent)
  }

  private readonly iceArrowDamage = (msg: ChurarenDamageMessage): void => {
    const data = msg.data
    if (data.cause !== 'iceArrow') return
    const target = this.bossPluginStore.bosses.get(data.targetId)
    const iceArrow = this.iceArrowPluginStore.iceArrows.get(data.sourceId)
    const attacker = iceArrow?.churarenWeaponOwnerId
    if (target === undefined || iceArrow === undefined || attacker === undefined) return
    const iceArrowDamageCause = new IceArrowDamageCause(iceArrow)
    const livingDamageEvent = new LivingDamageEvent(target, iceArrowDamageCause, data.amount)
    this.eventBus.post(livingDamageEvent)
  }
}
