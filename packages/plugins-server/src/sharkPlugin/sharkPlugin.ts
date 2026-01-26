import {
  IMainScene,
  BasePlugin,
  InitEvent,
  UpdateEvent,
  LivingDamageEvent,
  EntitySpawnEvent,
} from 'churaverse-engine-server'
import { SharkPluginStore } from './store/defSharkPluginStore'
import { SocketController } from './controller/socketController'
import { initSharkPluginStore } from './store/initSharkPluginStore'
import { Shark } from './domain/shark'
import { MapPluginStore } from '@churaverse/map-plugin-server/store/defMapPluginStore'
import { moveSharks, removeDieShark } from './domain/sharkService'
import { RegisterOnOverlapEvent } from '@churaverse/collision-detection-plugin-server/event/registerOnOverlap'
import { Player } from '@churaverse/player-plugin-server/domain/player'
import { SharkDamageCause } from './domain/sharkDamageCause'
import { NetworkPluginStore } from '@churaverse/network-plugin-server/store/defNetworkPluginStore'
import { SharkHitMessage } from './message/sharkHitMessage'
import { PlayerPluginStore } from '@churaverse/player-plugin-server/store/defPlayerPluginStore'

export class SharkPlugin extends BasePlugin<IMainScene> {
  private sharkPluginStore!: SharkPluginStore
  private mapPluginStore!: MapPluginStore
  private networkPluginStore!: NetworkPluginStore<IMainScene>
  private playerPluginStore!: PlayerPluginStore

  public listenEvent(): void {
    this.bus.subscribeEvent('init', this.init.bind(this))
    this.bus.subscribeEvent('update', this.update.bind(this))

    const socketController = new SocketController(this.bus, this.store)
    this.bus.subscribeEvent('registerMessage', socketController.registerMessage.bind(socketController))
    this.bus.subscribeEvent('registerMessageListener', socketController.registerMessageListener.bind(socketController))

    this.bus.subscribeEvent('registerOnOverlap', this.registerOnOverlap.bind(this))
    this.bus.subscribeEvent('entitySpawn', this.spawnShark.bind(this))
  }

  private init(ev: InitEvent): void {
    initSharkPluginStore(this.store)
    this.getStores()
  }

  private getStores(): void {
    this.sharkPluginStore = this.store.of('sharkPlugin')
    this.mapPluginStore = this.store.of('mapPlugin')
    this.networkPluginStore = this.store.of('networkPlugin')
    this.playerPluginStore = this.store.of('playerPlugin')
  }

  private update(ev: UpdateEvent): void {
    moveSharks(ev.dt, this.sharkPluginStore.sharks, this.mapPluginStore.mapManager.currentMap)
    removeDieShark(this.sharkPluginStore.sharks, (sharkId: string) => {
      const sharkHitMessage = new SharkHitMessage({ sharkId: sharkId })
      this.networkPluginStore.messageSender.send(sharkHitMessage)
    })
  }

  private registerOnOverlap(ev: RegisterOnOverlapEvent): void {
    ev.collisionDetector.register(
      this.sharkPluginStore.sharks,
      this.playerPluginStore.players,
      this.sharkHitPlayer.bind(this)
    )
  }

  private sharkHitPlayer(shark: Shark, player: Player): void {
    // サメを発射したプレイヤー自身との衝突は無視
    if (shark.ownerId === player.id) return

    if (player.isDead) return

    // プレイヤーと衝突したサメは消える
    shark.isDead = true

    // サメ衝突イベントの発火
    const sharkDamageCause = new SharkDamageCause(shark)
    const livingDamageEvent = new LivingDamageEvent(player, sharkDamageCause, shark.power)
    this.bus.post(livingDamageEvent)
  }

  private spawnShark(ev: EntitySpawnEvent): void {
    if (!(ev.entity instanceof Shark)) return
    const shark = ev.entity
    this.sharkPluginStore.sharks.set(shark.sharkId, shark)
    shark.walk(this.mapPluginStore.mapManager.currentMap)
  }
}
