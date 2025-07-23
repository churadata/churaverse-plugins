import { IMainScene, IEventBus, Store, Position, EntitySpawnEvent } from 'churaverse-engine-server'
import { BaseSocketController } from '@churaverse/network-plugin-server/interface/baseSocketController'
import { IMessageListenerRegister } from '@churaverse/network-plugin-server/interface/IMessageListenerRegister'
import { RegisterMessageListenerEvent } from '@churaverse/network-plugin-server/event/registerMessageListenerEvent'
import { RegisterMessageEvent } from '@churaverse/network-plugin-server/event/registerMessageEvent'
import { WaterRingSpawnMessage } from '../message/waterRingSpawnMessage'
import { WaterRing } from '../domain/waterRing'
import { WaterRingDespawnMessage } from '../message/waterRingDespawnMessage'
import { PlayerDieMessage } from '@churaverse/player-plugin-server/message/playerDieMessage'

export class SocketController extends BaseSocketController<IMainScene> {
  private messageListenerRegister!: IMessageListenerRegister<IMainScene>

  public constructor(eventBus: IEventBus<IMainScene>, store: Store<IMainScene>) {
    super(eventBus, store)
  }

  public registerMessage(ev: RegisterMessageEvent<IMainScene>): void {
    ev.messageRegister.registerMessage('waterRingSpawn', WaterRingSpawnMessage, 'others')
    ev.messageRegister.registerMessage('waterRingDespawn', WaterRingDespawnMessage, 'allClients')
  }

  public setupRegisterMessageListener(ev: RegisterMessageListenerEvent<IMainScene>): void {
    this.messageListenerRegister = ev.messageListenerRegister
  }

  public registerMessageListener(): void {
    this.messageListenerRegister.on('waterRingSpawn', this.waterRingSpawn)
    this.messageListenerRegister.on('playerDie', this.onPlayerDead)
  }

  public unregisterMessageListener(): void {
    this.messageListenerRegister.off('waterRingSpawn', this.waterRingSpawn)
    this.messageListenerRegister.off('playerDie', this.onPlayerDead)
  }

  private readonly waterRingSpawn = (msg: WaterRingSpawnMessage, senderId: string): void => {
    const data = msg.data
    const position = new Position(data.startPos.x, data.startPos.y)
    const waterRing = new WaterRing(data.waterRingId, senderId, position, data.direction, data.spawnTime)
    const waterRingSpawnEvent = new EntitySpawnEvent(waterRing)
    this.eventBus.post(waterRingSpawnEvent)
  }

  private readonly onPlayerDead = (msg: PlayerDieMessage): void => {
    const data = msg.data
    const waterRing = this.store.of('waterRingPlugin').waterRings.getByOwnerId(data.targetId)
    if (waterRing === undefined) return
    waterRing.die()
  }
}
