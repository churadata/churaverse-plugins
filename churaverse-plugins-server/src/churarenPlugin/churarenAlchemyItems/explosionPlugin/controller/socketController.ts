import { EntitySpawnEvent, IEventBus, IMainScene, Position, Store } from 'churaverse-engine-server'
import { ExplosionSpawnMessage } from '../message/explosionSpawnMessage'
import { BaseSocketController } from '@churaverse/network-plugin-server/interface/baseSocketController'
import { RegisterMessageListenerEvent } from '@churaverse/network-plugin-server/event/registerMessageListenerEvent'
import { RegisterMessageEvent } from '@churaverse/network-plugin-server/event/registerMessageEvent'
import { ExplosionHitMessage } from '../message/explosionHitMessage'
import { IMessageListenerRegister } from '@churaverse/network-plugin-server/interface/IMessageListenerRegister'
import { Explosion } from '../domain/explosion'

export class SocketController extends BaseSocketController<IMainScene> {
  private messageListenerRegister!: IMessageListenerRegister<IMainScene>

  public constructor(eventBus: IEventBus<IMainScene>, store: Store<IMainScene>) {
    super(eventBus, store)
  }

  public registerMessage(ev: RegisterMessageEvent<IMainScene>): void {
    ev.messageRegister.registerMessage('explosionSpawn', ExplosionSpawnMessage, 'allClients')
    ev.messageRegister.registerMessage('explosionHit', ExplosionHitMessage, 'allClients')
  }

  public setupRegisterMessageListener(ev: RegisterMessageListenerEvent<IMainScene>): void {
    this.messageListenerRegister = ev.messageListenerRegister
  }

  public registerMessageListener(): void {
    this.messageListenerRegister.on('explosionSpawn', this.explosionSpawn)
  }

  public unregisterMessageListener(): void {
    this.messageListenerRegister.off('explosionSpawn', this.explosionSpawn)
  }

  private readonly explosionSpawn = (msg: ExplosionSpawnMessage, senderId: string): void => {
    const data = msg.data
    const position = new Position(data.startPos.x, data.startPos.y)
    const explosion = new Explosion(data.explosionId, senderId, position, data.direction, data.spawnTime)
    explosion.move(Date.now() - data.spawnTime) // 遅延分移動
    const explosionSpawnEvent = new EntitySpawnEvent(explosion)
    this.eventBus.post(explosionSpawnEvent)
  }
}
