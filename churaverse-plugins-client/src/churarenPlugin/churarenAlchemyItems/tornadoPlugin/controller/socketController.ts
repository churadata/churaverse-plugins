import { BaseSocketController } from '@churaverse/network-plugin-client/interface/baseSocketController'
import { EntityDespawnEvent, EntitySpawnEvent, IEventBus, IMainScene, Position, Store } from 'churaverse-engine-client'
import { RegisterMessageEvent } from '@churaverse/network-plugin-client/event/registerMessageEvent'
import { RegisterMessageListenerEvent } from '@churaverse/network-plugin-client/event/registerMessageListenerEvent'
import { IMessageListenerRegister } from '@churaverse/network-plugin-client/interface/IMessageListenerRegister'
import { ChurarenDamageMessage } from '@churaverse/churaren-player-plugin-client/message/churarenDamageMessage'
import { TornadoPluginStore } from '../store/defTornadoPluginStore'
import { TornadoSpawnMessage } from '../message/tornadoSpawnMessage'
import { TornadoHitMessage } from '../message/tornadoHitMessage'
import { Tornado } from '../domain/tornado'

export class SocketController extends BaseSocketController<IMainScene> {
  private tornadoPluginStore!: TornadoPluginStore
  private messageListenerRegister!: IMessageListenerRegister<IMainScene>

  public constructor(eventBus: IEventBus<IMainScene>, store: Store<IMainScene>) {
    super(eventBus, store)
  }

  public registerMessage(ev: RegisterMessageEvent<IMainScene>): void {
    ev.messageRegister.registerMessage('tornadoSpawn', TornadoSpawnMessage, 'queue')
    ev.messageRegister.registerMessage('tornadoHit', TornadoHitMessage, 'queue')
  }

  public setupRegisterMessageListener(ev: RegisterMessageListenerEvent<IMainScene>): void {
    this.messageListenerRegister = ev.messageListenerRegister
  }

  public registerMessageListener(): void {
    this.messageListenerRegister.on('tornadoSpawn', this.tornadoSpawn)
    this.messageListenerRegister.on('tornadoHit', this.tornadoHit)
    this.messageListenerRegister.on('churarenDamage', this.tornadoDamage)
  }

  public unregisterMessageListener(): void {
    this.messageListenerRegister.off('tornadoSpawn', this.tornadoSpawn)
    this.messageListenerRegister.off('tornadoHit', this.tornadoHit)
    this.messageListenerRegister.off('churarenDamage', this.tornadoDamage)
  }

  public getStores(): void {
    this.tornadoPluginStore = this.store.of('churarenTornadoPlugin')
  }

  private readonly tornadoSpawn = (msg: TornadoSpawnMessage, senderId: string): void => {
    const data = msg.data
    const pos = new Position(data.startPos.x, data.startPos.y)
    const tornado = new Tornado(data.tornadoId, senderId, pos, data.direction, data.spawnTime)
    const tornadoSpawnEvent = new EntitySpawnEvent(tornado)
    this.eventBus.post(tornadoSpawnEvent)
  }

  private readonly tornadoHit = (msg: TornadoHitMessage): void => {
    const data = msg.data
    const tornado = this.tornadoPluginStore.tornados.get(data.tornadoId)
    if (tornado === undefined) return
    const tornadoDespawnEvent = new EntityDespawnEvent(tornado)
    this.eventBus.post(tornadoDespawnEvent)
  }

  private readonly tornadoDamage = (msg: ChurarenDamageMessage): void => {
    // TODO: `ChruarenBossPlugin`を実装しているブランチと依存関係がないため、`LivingDamageEvent`を`TornadoDamageCause`で発火する処理の実装。
  }
}
