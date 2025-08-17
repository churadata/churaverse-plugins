import { EntitySpawnEvent, IEventBus, IMainScene, Position, Store } from 'churaverse-engine-server'
import { BaseSocketController } from '@churaverse/network-plugin-server/interface/baseSocketController'
import { RegisterMessageListenerEvent } from '@churaverse/network-plugin-server/event/registerMessageListenerEvent'
import { RegisterMessageEvent } from '@churaverse/network-plugin-server/event/registerMessageEvent'
import { IMessageListenerRegister } from '@churaverse/network-plugin-server/interface/IMessageListenerRegister'
import { TornadoSpawnMessage } from '../message/tornadoSpawnMessage'
import { TornadoHitMessage } from '../message/tornadoHitMessage'
import { Tornado } from '../domain/tornado'

export class SocketController extends BaseSocketController<IMainScene> {
  private messageListenerRegister!: IMessageListenerRegister<IMainScene>

  public constructor(eventBus: IEventBus<IMainScene>, store: Store<IMainScene>) {
    super(eventBus, store)
  }

  public registerMessage(ev: RegisterMessageEvent<IMainScene>): void {
    ev.messageRegister.registerMessage('tornadoSpawn', TornadoSpawnMessage, 'others')
    ev.messageRegister.registerMessage('tornadoHit', TornadoHitMessage, 'allClients')
  }

  public setupRegisterMessageListener(ev: RegisterMessageListenerEvent<IMainScene>): void {
    this.messageListenerRegister = ev.messageListenerRegister
  }

  public registerMessageListener(): void {
    this.messageListenerRegister.on('tornadoSpawn', this.tornadoSpawn.bind(this))
  }

  public unregisterMessageListener(): void {
    this.messageListenerRegister.off('tornadoSpawn', this.tornadoSpawn.bind(this))
  }

  private readonly tornadoSpawn = (msg: TornadoSpawnMessage, senderId: string): void => {
    const data = msg.data
    const position = new Position(data.startPos.x, data.startPos.y)
    const tornado = new Tornado(data.tornadoId, senderId, position, data.direction, data.spawnTime)
    tornado.move(Date.now() - data.spawnTime) // 遅延分移動
    const tornadoSpawnEvent = new EntitySpawnEvent(tornado)
    this.eventBus.post(tornadoSpawnEvent)
  }
}
