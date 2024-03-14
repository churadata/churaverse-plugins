import { BaseSocketController } from '../../networkPlugin/interface/baseSocketController'
import { IEventBus, IMainScene, Store, EntitySpawnEvent, Position } from 'churaverse-engine-server'
import { RegisterMessageEvent } from '../../networkPlugin/event/registerMessageEvent'
import { RegisterMessageListenerEvent } from '../../networkPlugin/event/registerMessageListenerEvent'
import { SharkSpawnMessage } from '../message/sharkSpawnMessage'
import { Shark } from '../domain/shark'
import { SharkHitMessage } from '../message/sharkHitMessage'

export class SocketController extends BaseSocketController<IMainScene> {
  public constructor(eventBus: IEventBus<IMainScene>, store: Store<IMainScene>) {
    super(eventBus, store)
  }

  public registerMessage(ev: RegisterMessageEvent<IMainScene>): void {
    ev.messageRegister.registerMessage('sharkSpawn', SharkSpawnMessage, 'others')
    ev.messageRegister.registerMessage('sharkHit', SharkHitMessage, 'allClients')
  }

  public registerMessageListener(ev: RegisterMessageListenerEvent<IMainScene>): void {
    ev.messageListenerRegister.on('sharkSpawn', this.sharkSpawn.bind(this))
  }

  private sharkSpawn(msg: SharkSpawnMessage, senderId: string): void {
    const data = msg.data
    const position = new Position(data.startPos.x, data.startPos.y)
    const shark = new Shark(data.sharkId, senderId, position, data.direction, data.spawnTime)
    shark.move(Date.now() - data.spawnTime) // 遅延分移動
    const sharkSpawnEvent = new EntitySpawnEvent(shark)
    this.eventBus.post(sharkSpawnEvent)
  }
}
