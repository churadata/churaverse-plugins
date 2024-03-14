import {
  IMainScene,
  BasePlugin,
  InitEvent,
  UpdateEvent,
  EntitySpawnEvent,
  LivingDamageEvent,
  EVENT_PRIORITY,
} from 'churaverse-engine-server'
import { SocketController } from './controller/socketController'
import { Bomb } from './domain/bomb'
import { checkExplode, removeExplodedBomb, sendExplodedBomb } from './domain/bombService'
import { BombPluginStore } from './store/defBombPluginStore'
import { initBombPluginStore } from './store/initBombPluginStore'
import { RegisterOnOverlapEvent } from '../collisionDetectionPlugin/event/registerOnOverlap'
import { Player } from '../playerPlugin/domain/player'
import { BombDamageCause } from './domain/bombDamageCause'
import { NetworkPluginStore } from '../networkPlugin/store/defNetworkPluginStore'

export class BombPlugin extends BasePlugin<IMainScene> {
  private bombPluginStore!: BombPluginStore
  private networkPluginStore!: NetworkPluginStore<IMainScene>

  public listenEvent(): void {
    this.bus.subscribeEvent('init', this.init.bind(this))
    this.bus.subscribeEvent('update', this.checkExplode.bind(this), EVENT_PRIORITY.HIGH)
    this.bus.subscribeEvent('update', this.update.bind(this))

    const socketController = new SocketController(this.bus, this.store)
    this.bus.subscribeEvent('registerMessage', socketController.registerMessage.bind(socketController))
    this.bus.subscribeEvent('registerMessageListener', socketController.registerMessageListener.bind(socketController))

    this.bus.subscribeEvent('registerOnOverlap', this.registerOnOverlap.bind(this))
    this.bus.subscribeEvent('entitySpawn', this.spawnBomb.bind(this))
  }

  private init(ev: InitEvent): void {
    initBombPluginStore(this.store)
    this.getStores()
  }

  private checkExplode(ev: UpdateEvent): void {
    checkExplode(this.bombPluginStore.bombs)
  }

  private update(ev: UpdateEvent): void {
    sendExplodedBomb(this.networkPluginStore.messageSender, this.bombPluginStore.bombs)
    removeExplodedBomb(this.bombPluginStore.bombs)
  }

  private getStores(): void {
    this.bombPluginStore = this.store.of('bombPlugin')
    this.networkPluginStore = this.store.of('networkPlugin')
  }

  private registerOnOverlap(ev: RegisterOnOverlapEvent): void {
    ev.collisionDetector.register(
      this.bombPluginStore.bombs,
      this.store.of('playerPlugin').players,
      this.bombHitPlayer.bind(this)
    )
  }

  private bombHitPlayer(bomb: Bomb, player: Player): void {
    // 爆弾を設置したプレイヤー自身との衝突は無視
    if (bomb.ownerId === player.id) return
    if (player.isDead) return
    // 爆弾衝突イベントの発火
    const bombDamageCause = new BombDamageCause(bomb) // ダメージの原因を爆弾として保存
    const livingDamageEvent = new LivingDamageEvent(player, bombDamageCause, bomb.power) // 生きているプレイヤーへのダメージ処理
    this.bus.post(livingDamageEvent)
  }

  private spawnBomb(ev: EntitySpawnEvent): void {
    if (!(ev.entity instanceof Bomb)) return
    const bomb = ev.entity
    this.bombPluginStore.bombs.set(bomb.bombId, bomb)
  }
}
