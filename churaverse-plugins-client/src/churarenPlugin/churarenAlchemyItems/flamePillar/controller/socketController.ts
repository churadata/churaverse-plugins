import { IMainScene, IEventBus, Store, Position, EntitySpawnEvent, EntityDespawnEvent } from 'churaverse-engine-client'
import { BaseSocketController } from '@churaverse/network-plugin-client/interface/baseSocketController'
import { RegisterMessageEvent } from '@churaverse/network-plugin-client/event/registerMessageEvent'
import { RegisterMessageListenerEvent } from '@churaverse/network-plugin-client/event/registerMessageListenerEvent'
import { FlamePillarPluginStore } from '../store/defFlamePillarPluginStore'
import { IMessageListenerRegister } from '@churaverse/network-plugin-client/interface/IMessageListenerRegister'
import { FlamePillarSpawnMessage } from '../message/flamePillarSpawnMessage'
import { FlamePillar } from '../domain/flamePillar'
import { FlamePillarDespawnMessage } from '../message/flamePillarDespawnMessage'
import { FlamePillarHitMessage } from '../message/flamePillarHitMessage'

export class SocketController extends BaseSocketController<IMainScene> {
  private flamePillarPluginStore!: FlamePillarPluginStore
  private messageListenerRegister!: IMessageListenerRegister<IMainScene>

  public constructor(eventBus: IEventBus<IMainScene>, store: Store<IMainScene>) {
    super(eventBus, store)
  }

  public getStores(): void {
    this.flamePillarPluginStore = this.store.of('churarenFlamePillarPlugin')
  }

  public setupRegisterMessageListener(ev: RegisterMessageListenerEvent<IMainScene>): void {
    this.messageListenerRegister = ev.messageListenerRegister
  }

  public registerMessage(ev: RegisterMessageEvent<IMainScene>): void {
    ev.messageRegister.registerMessage('flamePillarSpawn', FlamePillarSpawnMessage, 'queue')
    ev.messageRegister.registerMessage('flamePillarDespawn', FlamePillarDespawnMessage, 'queue')
    ev.messageRegister.registerMessage('flamePillarHit', FlamePillarHitMessage, 'queue')
  }

  public registerMessageListener(ev: RegisterMessageListenerEvent<IMainScene>): void {
    this.messageListenerRegister.on('flamePillarSpawn', this.flamePillarSpawn)
    this.messageListenerRegister.on('flamePillarDespawn', this.flamePillarDespawn)
    this.messageListenerRegister.on('flamePillarHit', this.flamePillarHit)
  }

  public unregisterMessageListener(): void {
    this.messageListenerRegister.off('flamePillarSpawn', this.flamePillarSpawn)
    this.messageListenerRegister.off('flamePillarDespawn', this.flamePillarDespawn)
    this.messageListenerRegister.off('flamePillarHit', this.flamePillarHit)
  }

  private readonly flamePillarSpawn = (msg: FlamePillarSpawnMessage, senderId: string): void => {
    const data = msg.data
    const position = new Position(data.startPos.x, data.startPos.y)
    const flamePillar = new FlamePillar(data.flamePillarId, senderId, position, data.direction, data.spawnTime)
    const flamePillarSpawnEvent = new EntitySpawnEvent(flamePillar)
    this.eventBus.post(flamePillarSpawnEvent)
  }

  private readonly flamePillarDespawn = (msg: FlamePillarDespawnMessage): void => {
    const data = msg.data
    const flamePillar = this.flamePillarPluginStore.flamePillars.get(data.flamePillarId)
    if (flamePillar === undefined) return
    const flamePillarDespawnEvent = new EntityDespawnEvent(flamePillar)
    this.eventBus.post(flamePillarDespawnEvent)
  }

  private readonly flamePillarHit = (msg: FlamePillarHitMessage): void => {
    const data = msg.data
    const flamePillar = this.flamePillarPluginStore.flamePillars.get(data.flamePillarId)
    if (flamePillar === undefined) return
    const flamePillarDespawnEvent = new EntityDespawnEvent(flamePillar)
    this.eventBus.post(flamePillarDespawnEvent)
  }
}
