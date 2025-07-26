import { IMainScene, IEventBus, Store, Position, EntitySpawnEvent } from 'churaverse-engine-server'
import { BaseSocketController } from '@churaverse/network-plugin-server/interface/baseSocketController'
import { RegisterMessageListenerEvent } from '@churaverse/network-plugin-server/event/registerMessageListenerEvent'
import { RegisterMessageEvent } from '@churaverse/network-plugin-server/event/registerMessageEvent'
import { IMessageListenerRegister } from '@churaverse/network-plugin-server/interface/IMessageListenerRegister'
import { TrapSpawnMessage } from '../message/trapSpawnMessage'
import { Trap } from '../domain/trap'
import { TrapDespawnMessage } from '../message/trapDespawnMessage'

export class SocketController extends BaseSocketController<IMainScene> {
  private messageListenerRegister!: IMessageListenerRegister<IMainScene>

  public constructor(eventBus: IEventBus<IMainScene>, store: Store<IMainScene>) {
    super(eventBus, store)
  }

  public registerMessage(ev: RegisterMessageEvent<IMainScene>): void {
    ev.messageRegister.registerMessage('trapSpawn', TrapSpawnMessage, 'others')
    ev.messageRegister.registerMessage('trapDespawn', TrapDespawnMessage, 'allClients')
  }

  public setupRegisterMessageListener(ev: RegisterMessageListenerEvent<IMainScene>): void {
    this.messageListenerRegister = ev.messageListenerRegister
  }

  public registerMessageListener(): void {
    this.messageListenerRegister.on('trapSpawn', this.trapSpawn.bind(this))
  }

  public unregisterMessageListener(): void {
    this.messageListenerRegister.off('trapSpawn', this.trapSpawn.bind(this))
  }

  private trapSpawn(msg: TrapSpawnMessage, senderId: string): void {
    const data = msg.data
    const position = new Position(data.startPos.x, data.startPos.y)
    const trap = new Trap(data.trapId, senderId, position, data.direction, data.spawnTime)
    const trapSpawnEvent = new EntitySpawnEvent(trap)
    this.eventBus.post(trapSpawnEvent)
  }
}
