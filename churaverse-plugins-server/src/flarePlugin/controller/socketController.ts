import { BaseSocketController } from '@churaverse/network-plugin-server/interface/baseSocketController'
import { IEventBus, IMainScene, Store, EntitySpawnEvent, Position } from 'churaverse-engine-server'
import { RegisterMessageEvent } from '@churaverse/network-plugin-server/event/registerMessageEvent'
import { RegisterMessageListenerEvent } from '@churaverse/network-plugin-server/event/registerMessageListenerEvent'
import { FlareSpawnMessage } from '../message/flareSpawnMessage'
import { Flare } from '../domain/flare'
import { FlareHitMessage } from '../message/flareHitMessage'

export class SocketController extends BaseSocketController<IMainScene> {
  public constructor(eventBus: IEventBus<IMainScene>, store: Store<IMainScene>) {
    super(eventBus, store)
  }

  public registerMessage(ev: RegisterMessageEvent<IMainScene>): void {
    ev.messageRegister.registerMessage('flareSpawn', FlareSpawnMessage, 'others')
    ev.messageRegister.registerMessage('flareHit', FlareHitMessage, 'allClients')
  }

  public registerMessageListener(ev: RegisterMessageListenerEvent<IMainScene>): void {
    ev.messageListenerRegister.on('flareSpawn', this.flareSpawn.bind(this))
  }

  private flareSpawn(msg: FlareSpawnMessage, senderId: string): void {
    const data = msg.data
    const position = new Position(data.startPos.x, data.startPos.y)
    const flare = new Flare(data.flareId, senderId, position, data.direction, data.spawnTime)
    flare.move(Date.now() - data.spawnTime) // 遅延分移動
    const flareSpawnEvent = new EntitySpawnEvent(flare)
    this.eventBus.post(flareSpawnEvent)
  }
}
