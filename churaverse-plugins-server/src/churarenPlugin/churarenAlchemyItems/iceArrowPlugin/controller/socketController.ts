import { IMainScene, IEventBus, Store, Position, EntitySpawnEvent } from 'churaverse-engine-server'
import { BaseSocketController } from '@churaverse/network-plugin-server/interface/baseSocketController'
import { RegisterMessageEvent } from '@churaverse/network-plugin-server/event/registerMessageEvent'
import { RegisterMessageListenerEvent } from '@churaverse/network-plugin-server/event/registerMessageListenerEvent'
import { IMessageListenerRegister } from '@churaverse/network-plugin-server/interface/IMessageListenerRegister'
import { IceArrowSpawnMessage } from '../message/iceArrowSpawnMessage'
import { IceArrow } from '../domain/iceArrow'
import { IceArrowHitMessage } from '../message/iceArrowHitMessage'

export class SocketController extends BaseSocketController<IMainScene> {
  private messageListenerRegister!: IMessageListenerRegister<IMainScene>

  public constructor(eventBus: IEventBus<IMainScene>, store: Store<IMainScene>) {
    super(eventBus, store)
  }

  public registerMessage(ev: RegisterMessageEvent<IMainScene>): void {
    ev.messageRegister.registerMessage('iceArrowSpawn', IceArrowSpawnMessage, 'others')
    ev.messageRegister.registerMessage('iceArrowHit', IceArrowHitMessage, 'allClients')
  }

  public setupRegisterMessageListener(ev: RegisterMessageListenerEvent<IMainScene>): void {
    this.messageListenerRegister = ev.messageListenerRegister
  }

  public registerMessageListener(): void {
    this.messageListenerRegister.on('iceArrowSpawn', this.iceArrowSpawn)
  }

  public unregisterMessageListener(): void {
    this.messageListenerRegister.off('iceArrowSpawn', this.iceArrowSpawn)
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
    iceArrow.move(Date.now() - data.spawnTime) // 遅延分移動
    const iceArrowSpawnEvent = new EntitySpawnEvent(iceArrow)
    this.eventBus.post(iceArrowSpawnEvent)
  }
}
