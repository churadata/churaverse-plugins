import { IEventBus, IMainScene, Store, EntitySpawnEvent, Position } from 'churaverse-engine-server'
import { RegisterMessageEvent } from '../../networkPlugin/event/registerMessageEvent'
import { RegisterMessageListenerEvent } from '../../networkPlugin/event/registerMessageListenerEvent'
import { BaseSocketController } from '../../networkPlugin/interface/baseSocketController'
import { Bomb } from '../domain/bomb'
import { BombSpawnMessage } from '../message/bombSpawnMessage'
import { BombExplosionMessage } from '../message/bombExplosionMessage'

export class SocketController extends BaseSocketController<IMainScene> {
  public constructor(eventBus: IEventBus<IMainScene>, store: Store<IMainScene>) {
    super(eventBus, store)
  }

  public registerMessage(ev: RegisterMessageEvent<IMainScene>): void {
    ev.messageRegister.registerMessage('bombSpawn', BombSpawnMessage, 'others')
    ev.messageRegister.registerMessage('bombExplosion', BombExplosionMessage, 'allClients')
  }

  public registerMessageListener(ev: RegisterMessageListenerEvent<IMainScene>): void {
    ev.messageListenerRegister.on('bombSpawn', this.bombSpawn.bind(this))
  }

  private bombSpawn(msg: BombSpawnMessage, senderId: string): void {
    const data = msg.data
    const position = new Position(data.startPos.x, data.startPos.y)
    const bomb = new Bomb(data.bombId, senderId, position, data.direction, data.spawnTime)
    const bombSpawnEvent = new EntitySpawnEvent(bomb)
    this.eventBus.post(bombSpawnEvent)
  }
}
