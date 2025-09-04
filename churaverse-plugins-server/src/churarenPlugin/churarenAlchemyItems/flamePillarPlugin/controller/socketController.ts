import { EntitySpawnEvent, IEventBus, IMainScene, Position, Store } from 'churaverse-engine-server'
import { BaseSocketController } from '@churaverse/network-plugin-server/interface/baseSocketController'
import { RegisterMessageListenerEvent } from '@churaverse/network-plugin-server/event/registerMessageListenerEvent'
import { IMessageListenerRegister } from '@churaverse/network-plugin-server/interface/IMessageListenerRegister'
import { RegisterMessageEvent } from '@churaverse/network-plugin-server/event/registerMessageEvent'
import { FlamePillar } from '../domain/flamePillar'
import { FlamePillarSpawnMessage } from '../message/flamePillarSpawnMessage'
import { FlamePillarHitMessage } from '../message/flamePillarHitMessage'

export class SocketController extends BaseSocketController<IMainScene> {
  private messageListenerRegister!: IMessageListenerRegister<IMainScene>

  public constructor(eventBus: IEventBus<IMainScene>, store: Store<IMainScene>) {
    super(eventBus, store)
  }

  public registerMessage(ev: RegisterMessageEvent<IMainScene>): void {
    ev.messageRegister.registerMessage('flamePillarSpawn', FlamePillarSpawnMessage, 'allClients')
    ev.messageRegister.registerMessage('flamePillarHit', FlamePillarHitMessage, 'allClients')
  }

  public setupRegisterMessageListener(ev: RegisterMessageListenerEvent<IMainScene>): void {
    this.messageListenerRegister = ev.messageListenerRegister
  }

  public registerMessageListener(): void {
    this.messageListenerRegister.on('flamePillarSpawn', this.flamePillarSpawn)
  }

  public unregisterMessageListener(): void {
    this.messageListenerRegister.off('flamePillarSpawn', this.flamePillarSpawn)
  }

  private readonly flamePillarSpawn = (msg: FlamePillarSpawnMessage, senderId: string): void => {
    const data = msg.data
    const position = new Position(data.startPos.x, data.startPos.y)
    const flamePillar = new FlamePillar(data.flamePillarId, senderId, position, data.direction, data.spawnTime)
    const flamePillarSpawnEvent = new EntitySpawnEvent(flamePillar)
    this.eventBus.post(flamePillarSpawnEvent)
  }
}
