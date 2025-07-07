import { SocketController } from './controller/socketController'
import { ExplosionAttackRenderer } from './renderer/explosionAttackRenderer'
import {
  EntityDespawnEvent,
  EntitySpawnEvent,
  GRID_SIZE,
  IMainScene,
  PhaserLoadAssets,
  PhaserSceneInit,
  Position,
  Vector,
} from 'churaverse-engine-client'
import { ExplosionAttackRendererFactory } from './renderer/explosionAttackRendererFactory'
import { initExplosionPluginStore, resetExplosionPluginStore } from './store/initExplosionPluginStore'
import { ExplosionPluginStore } from './store/defExplosionPluginStore'
import { NetworkPluginStore } from '@churaverse/network-plugin-client/store/defNetworkPluginStore'
import { PlayerPluginStore } from '@churaverse/player-plugin-client/store/defPlayerPluginStore'
import { explosion, Explosion, EXPLOSION_ITEM, EXPLOSION_WALK_LIMIT_GRIDS } from './domain/explosion'
import { UseAlchemyItemEvent } from '@churaverse/churaren-alchemy-plugin-client/event/useAlchemyItemEvent'
import { ClearAlchemyItemBoxEvent } from '@churaverse/churaren-alchemy-plugin-client/event/clearAlchemyItemBox'
import { ExplosionSpawnMessage } from './message/explosionSpawnMessage'
import { Sendable } from '@churaverse/network-plugin-client/types/sendable'
import { IExplosionAttackRenderer } from './domain/IExplosionAttckRenderer'
import { BaseAlchemyItemPlugin } from '@churaverse/churaren-alchemy-plugin-client/domain/baseAlchemyItemPlugin'

export class ExplosionPlugin extends BaseAlchemyItemPlugin {
  private attackRendererFactory?: ExplosionAttackRendererFactory
  private explosionPluginStore!: ExplosionPluginStore
  private playerPluginStore!: PlayerPluginStore
  private networkStore!: NetworkPluginStore<IMainScene>
  private socketController?: SocketController
  protected alchemyItemKind = explosion
  protected alchemyItem = EXPLOSION_ITEM

  public listenEvent(): void {
    super.listenEvent()
    this.bus.subscribeEvent('phaserSceneInit', this.phaserSceneInit.bind(this))
    this.bus.subscribeEvent('phaserLoadAssets', this.loadAssets.bind(this))

    this.bus.subscribeEvent('init', this.init.bind(this))

    this.socketController = new SocketController(this.bus, this.store)
    this.bus.subscribeEvent('registerMessage', this.socketController.registerMessage.bind(this.socketController))
    this.bus.subscribeEvent(
      'registerMessageListener',
      this.socketController.setupRegisterMessageListener.bind(this.socketController)
    )
  }

  private phaserSceneInit(ev: PhaserSceneInit): void {
    this.attackRendererFactory = new ExplosionAttackRendererFactory(ev.scene)
  }

  private loadAssets(ev: PhaserLoadAssets): void {
    ExplosionAttackRenderer.loadAssets(ev.scene)
  }

  private init(): void {
    this.playerPluginStore = this.store.of('playerPlugin')
    this.networkStore = this.store.of('networkPlugin')
  }

  protected subscribeGameEvent(): void {
    super.subscribeGameEvent()
    this.bus.subscribeEvent('useAlchemyItem', this.useAlchemyItem)
    this.bus.subscribeEvent('entitySpawn', this.spawnExplosion)
    this.bus.subscribeEvent('entityDespawn', this.dieExplosion)
  }

  protected unsubscribeGameEvent(): void {
    super.unsubscribeGameEvent()
    this.bus.unsubscribeEvent('useAlchemyItem', this.useAlchemyItem)
    this.bus.unsubscribeEvent('entitySpawn', this.spawnExplosion)
    this.bus.unsubscribeEvent('entityDespawn', this.dieExplosion)
  }

  protected handleGameStart(): void {
    initExplosionPluginStore(this.store, this.attackRendererFactory)
    this.explosionPluginStore = this.store.of('churarenExplosionPlugin')
    this.socketController?.getStores()
    this.socketController?.registerMessageListener()
  }

  protected handleGameTermination(): void {
    resetExplosionPluginStore(this.store)
    this.socketController?.unregisterMessageListener()
  }

  protected handleMidwayParticipant(): void {
    this.unsubscribeGameEvent()
  }

  // 爆発アイテムを使った時の処理
  protected useAlchemyItem = (ev: UseAlchemyItemEvent): void => {
    if (ev.alchemyItem.kind !== 'explosion') return
    const renderer = this.explosionPluginStore.explosionAttackRendererFactory.build()
    const gap = 65
    const startPos = ev.ownPlayer.position.copy()
    const position = new Position(
      startPos.x + gap * ev.ownPlayer.direction.x,
      startPos.y + gap * ev.ownPlayer.direction.y
    )
    const explosion = new Explosion(
      ev.alchemyItem.itemId,
      ev.ownPlayer.id,
      position,
      ev.ownPlayer.direction,
      Date.now()
    )
    this.explosionPluginStore.explosions.set(explosion.explosionId, explosion)
    this.explosionPluginStore.explosionAttackRenderers.set(explosion.explosionId, renderer)
    // 他のプレイヤーに爆発の出現を送信する
    if (explosion.ownerId === this.playerPluginStore.ownPlayerId) {
      this.networkStore.messageSender.send(
        new ExplosionSpawnMessage({
          explosionId: explosion.explosionId,
          startPos: explosion.position.toVector() as Vector & Sendable,
          direction: explosion.direction,
          spawnTime: explosion.spawnTime,
        })
      )
    }

    const clearAlchemyItemBoxEvent = new ClearAlchemyItemBoxEvent(ev.ownPlayer.id)
    this.bus.post(clearAlchemyItemBoxEvent)
    this.walkExplosion(explosion, renderer)
  }

  // 爆発の出現を受信した時の処理
  private readonly spawnExplosion = (ev: EntitySpawnEvent): void => {
    if (!(ev.entity instanceof Explosion)) return
    if (ev.entity.ownerId === this.playerPluginStore.ownPlayerId) return
    const explosion = ev.entity
    const renderer = this.explosionPluginStore.explosionAttackRendererFactory.build()
    this.explosionPluginStore.explosions.set(explosion.explosionId, explosion)
    this.explosionPluginStore.explosionAttackRenderers.set(explosion.explosionId, renderer)
    this.walkExplosion(explosion, renderer)
  }

  private walkExplosion(explosion: Explosion, render: IExplosionAttackRenderer): void {
    const dest = explosion.position.copy()
    dest.x = explosion.direction.x * EXPLOSION_WALK_LIMIT_GRIDS * GRID_SIZE + explosion.position.x
    dest.y = explosion.direction.y * EXPLOSION_WALK_LIMIT_GRIDS * GRID_SIZE + explosion.position.y
    render.walk(explosion.position, dest, (pos) => {
      explosion.walk(pos)
    })
  }

  private readonly dieExplosion = (ev: EntityDespawnEvent): void => {
    if (!(ev.entity instanceof Explosion)) return
    const explosionId = ev.entity.explosionId
    const explosion = this.explosionPluginStore.explosions.get(explosionId)
    const explosionAttackRenderer = this.explosionPluginStore.explosionAttackRenderers.get(explosionId)
    explosion?.die()
    explosionAttackRenderer?.dead()
    this.explosionPluginStore.explosions.delete(explosionId)
    this.explosionPluginStore.explosionAttackRenderers.delete(explosionId)
  }
}
