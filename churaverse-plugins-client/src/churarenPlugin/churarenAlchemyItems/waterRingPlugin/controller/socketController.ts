import { IMainScene, IEventBus, Store, Position, EntitySpawnEvent, EntityDespawnEvent } from 'churaverse-engine-client'
import { BaseSocketController } from '@churaverse/network-plugin-client/interface/baseSocketController'
import { RegisterMessageEvent } from '@churaverse/network-plugin-client/event/registerMessageEvent'
import { RegisterMessageListenerEvent } from '@churaverse/network-plugin-client/event/registerMessageListenerEvent'
import { IMessageListenerRegister } from '@churaverse/network-plugin-client/interface/IMessageListenerRegister'
import { WaterRingPluginStore } from '../store/defWaterRingPluginStore'
import { WaterRingSpawnMessage } from '../message/waterRingSpawnMessage'
import { WaterRing } from '../domain/waterRing'
import { WaterRingDespawnMessage } from '../message/waterRingDespawnMessage'
import { ChurarenDamageMessage } from '@churaverse/churaren-player-plugin-client/message/churarenDamageMessage'

export class SocketController extends BaseSocketController<IMainScene> {
  private waterRingPluginStore!: WaterRingPluginStore
  private messageListenerRegister!: IMessageListenerRegister<IMainScene>

  public constructor(eventBus: IEventBus<IMainScene>, store: Store<IMainScene>) {
    super(eventBus, store)
  }

  public registerMessage(ev: RegisterMessageEvent<IMainScene>): void {
    ev.messageRegister.registerMessage('waterRingSpawn', WaterRingSpawnMessage, 'queue')
    ev.messageRegister.registerMessage('waterRingDespawn', WaterRingDespawnMessage, 'queue')
  }

  public setupRegisterMessageListener(ev: RegisterMessageListenerEvent<IMainScene>): void {
    this.messageListenerRegister = ev.messageListenerRegister
  }

  public registerMessageListener(): void {
    this.messageListenerRegister.on('waterRingSpawn', this.waterRingSpawn)
    this.messageListenerRegister.on('waterRingDespawn', this.waterRingDespawn)
    this.messageListenerRegister.on('churarenDamage', this.waterRingDamage)
  }

  public unregisterMessageListener(): void {
    this.messageListenerRegister.off('waterRingSpawn', this.waterRingSpawn)
    this.messageListenerRegister.off('waterRingDespawn', this.waterRingDespawn)
    this.messageListenerRegister.off('churarenDamage', this.waterRingDamage)
  }

  public getStores(): void {
    this.waterRingPluginStore = this.store.of('churarenWaterRingPlugin')
  }

  private readonly waterRingSpawn = (msg: WaterRingSpawnMessage, senderId: string): void => {
    const data = msg.data
    const pos = new Position(data.startPos.x, data.startPos.y)
    const waterRing = new WaterRing(data.waterRingId, senderId, pos, data.direction, data.spawnTime)
    const waterRingSpawnEvent = new EntitySpawnEvent(waterRing)
    this.eventBus.post(waterRingSpawnEvent)
  }

  private readonly waterRingDespawn = (msg: WaterRingDespawnMessage): void => {
    const data = msg.data
    const waterRing = this.waterRingPluginStore.waterRings.get(data.waterRingId)
    if (waterRing === undefined) return
    const waterRingDespawnEvent = new EntityDespawnEvent(waterRing)
    this.eventBus.post(waterRingDespawnEvent)
  }

  private readonly waterRingDamage = (msg: ChurarenDamageMessage): void => {}
}
