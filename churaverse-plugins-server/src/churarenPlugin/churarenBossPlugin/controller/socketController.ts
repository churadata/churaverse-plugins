import { BossSpawnMessage } from '../message/bossSpawnMessage'
import { BossDespawnMessage } from '../message/bossDespawnMessage'
import { BossWalkMessage } from '../message/bossWalkMessage'
import { BaseSocketController } from '@churaverse/network-plugin-server/interface/baseSocketController'
import { IEventBus, IMainScene, Store } from 'churaverse-engine-server'
import { RegisterMessageEvent } from '@churaverse/network-plugin-server/event/registerMessageEvent'
import { IMessageListenerRegister } from '@churaverse/network-plugin-server/interface/IMessageListenerRegister'
import { RegisterMessageListenerEvent } from '@churaverse/network-plugin-server/event/registerMessageListenerEvent'

export class SocketController extends BaseSocketController<IMainScene> {
  private messageListenerRegister!: IMessageListenerRegister<IMainScene>

  public constructor(eventBus: IEventBus<IMainScene>, store: Store<IMainScene>) {
    super(eventBus, store)
  }

  public registerMessage(ev: RegisterMessageEvent<IMainScene>): void {
    ev.messageRegister.registerMessage('bossSpawn', BossSpawnMessage, 'allClients')
    ev.messageRegister.registerMessage('bossDespawn', BossDespawnMessage, 'allClients')
    ev.messageRegister.registerMessage('bossWalk', BossWalkMessage, 'allClients')
  }

  public setupMessageListenerRegister(ev: RegisterMessageListenerEvent<IMainScene>): void {
    this.messageListenerRegister = ev.messageListenerRegister
  }
}
