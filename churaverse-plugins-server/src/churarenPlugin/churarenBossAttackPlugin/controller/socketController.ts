import { BaseSocketController } from '@churaverse/network-plugin-server/interface/baseSocketController'
import { IEventBus, IMainScene, Store, EntitySpawnEvent, Position } from 'churaverse-engine-server'
import { RegisterMessageEvent } from '@churaverse/network-plugin-server/event/registerMessageEvent'
import { RegisterMessageListenerEvent } from '@churaverse/network-plugin-server/event/registerMessageListenerEvent'
import { BossAttackSpawnMessage } from '../message/bossAttackSpawnMessage'
import { BossAttack } from '../domain/bossAttack'
import { BossAttackHitMessage } from '../message/bossAttackHitMessage'
import { IMessageListenerRegister } from '@churaverse/network-plugin-server/interface/IMessageListenerRegister'

export class SocketController extends BaseSocketController<IMainScene> {
  private messageListenerRegister!: IMessageListenerRegister<IMainScene>

  public constructor(eventBus: IEventBus<IMainScene>, store: Store<IMainScene>) {
    super(eventBus, store)
  }

  public registerMessage(ev: RegisterMessageEvent<IMainScene>): void {
    ev.messageRegister.registerMessage('bossAttackSpawn', BossAttackSpawnMessage, 'allClients')
    ev.messageRegister.registerMessage('bossAttackHit', BossAttackHitMessage, 'allClients')
  }

  public setupMessageListenerRegister(ev: RegisterMessageListenerEvent<IMainScene>): void {
    this.messageListenerRegister = ev.messageListenerRegister
  }

  public bossAttackSpawn(msg: BossAttackSpawnMessage, senderId: string): void {
    const data = msg.data
    const pos = new Position(data.startPos.x, data.startPos.y)
    const bossAttack = new BossAttack(data.bossAttackId, senderId, pos, data.direction, data.spawnTime)
    bossAttack.move(Date.now() - data.spawnTime) // 遅延分移動
    const bossAttackSpawnEvent = new EntitySpawnEvent(bossAttack)
    this.eventBus.post(bossAttackSpawnEvent)
  }
}
