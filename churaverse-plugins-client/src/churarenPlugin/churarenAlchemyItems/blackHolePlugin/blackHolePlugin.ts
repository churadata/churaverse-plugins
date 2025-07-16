import { SocketController } from './controller/socketController'
import {
  EntityDespawnEvent,
  EntitySpawnEvent,
  IMainScene,
  PhaserLoadAssets,
  PhaserSceneInit,
  Position,
  Vector,
  vectorToName,
} from 'churaverse-engine-client'
import { NetworkPluginStore } from '@churaverse/network-plugin-client/store/defNetworkPluginStore'
import { PlayerPluginStore } from '@churaverse/player-plugin-client/store/defPlayerPluginStore'
import { UseAlchemyItemEvent } from '@churaverse/churaren-alchemy-plugin-client/event/useAlchemyItemEvent'
import { ClearAlchemyItemBoxEvent } from '@churaverse/churaren-alchemy-plugin-client/event/clearAlchemyItemBox'
import { Sendable } from '@churaverse/network-plugin-client/types/sendable'
import { BaseAlchemyItemPlugin } from '@churaverse/churaren-alchemy-plugin-client/domain/baseAlchemyItemPlugin'
import '@churaverse/churaren-core-plugin-client/churarenCorePlugin'
import { BLACK_HOLE_ITEM, BLACK_HOLE_MOVE_LIMIT_GRIDS, BlackHole } from './domain/blackHole'
import { BlackHolePluginStore } from './store/defBlackHolePluginStore'
import { BlackHoleAttackRendererFactory } from './renderer/blackHoleAttackRendererFactory'
import { BlackHoleAttackRenderer } from './renderer/blackHoleAttackRenderer'
import { initBlackHolePluginStore, resetBlackHolePluginStore } from './store/initBlackHolePluginStore'
import { BlackHoleSpawnMessage } from './message/blackHoleSpawnMessage'
import { IBlackHoleAttackRenderer } from './domain/IBlackHoleAttackRenderer'

export class BlackHolePlugin extends BaseAlchemyItemPlugin {
  private attackRendererFactory!: BlackHoleAttackRendererFactory
  private blackHolePluginStore!: BlackHolePluginStore
  private playerPluginStore!: PlayerPluginStore
  private networkStore!: NetworkPluginStore<IMainScene>
  private socketController?: SocketController
  protected alchemyItem = BLACK_HOLE_ITEM

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

    this.bus.subscribeEvent('useAlchemyItem', this.useAlchemyItem.bind(this))
    this.bus.subscribeEvent('entitySpawn', this.spawnBlackHole.bind(this))
    this.bus.subscribeEvent('entityDespawn', this.dieBlackHole.bind(this))
  }

  private phaserSceneInit(ev: PhaserSceneInit): void {
    this.attackRendererFactory = new BlackHoleAttackRendererFactory(ev.scene)
  }

  private loadAssets(ev: PhaserLoadAssets): void {
    BlackHoleAttackRenderer.loadAssets(ev.scene)
  }

  private init(): void {
    this.playerPluginStore = this.store.of('playerPlugin')
    this.networkStore = this.store.of('networkPlugin')
  }

  protected subscribeGameEvent(): void {
    super.subscribeGameEvent()
    this.bus.subscribeEvent('useAlchemyItem', this.useAlchemyItem)
    this.bus.subscribeEvent('entitySpawn', this.spawnBlackHole)
    this.bus.subscribeEvent('entityDespawn', this.dieBlackHole)
  }

  protected unsubscribeGameEvent(): void {
    super.unsubscribeGameEvent()
    this.bus.unsubscribeEvent('useAlchemyItem', this.useAlchemyItem)
    this.bus.unsubscribeEvent('entitySpawn', this.spawnBlackHole)
    this.bus.unsubscribeEvent('entityDespawn', this.dieBlackHole)
  }

  protected handleGameStart(): void {
    initBlackHolePluginStore(this.store, this.attackRendererFactory)
    this.blackHolePluginStore = this.store.of('churarenBlackHolePlugin')
    this.socketController?.getStores()
    this.socketController?.registerMessageListener()
  }

  protected handleGameTermination(): void {
    resetBlackHolePluginStore(this.store)
    this.socketController?.unregisterMessageListener()
  }

  protected handleMidwayParticipant(): void {
    this.unsubscribeGameEvent()
  }

  protected useAlchemyItem = (ev: UseAlchemyItemEvent): void => {
    if (ev.alchemyItem.kind !== 'blackHole') return
    const startPos = ev.ownPlayer.position.copy()
    const renderer = this.blackHolePluginStore.blackHoleAttackRendererFactory.build()
    const pos = new Position(startPos.x, startPos.y)
    const blackHole = new BlackHole(ev.alchemyItem.itemId, ev.ownPlayer.id, pos, ev.ownPlayer.direction, Date.now()) // blackHoleは右向きに動き始める
    this.blackHolePluginStore.blackHoles.set(blackHole.blackHoleId, blackHole)
    this.blackHolePluginStore.blackHoleAttackRenderers.set(blackHole.blackHoleId, renderer)

    if (blackHole.ownerId === this.playerPluginStore.ownPlayerId) {
      const blackHoleSpawnMessage = new BlackHoleSpawnMessage({
        blackHoleId: blackHole.blackHoleId,
        startPos: blackHole.position.toVector() as Vector & Sendable,
        direction: blackHole.direction,
        spawnTime: blackHole.spawnTime,
      })
      this.networkStore.messageSender.send(blackHoleSpawnMessage)
    }

    const clearAlchemyItemBoxEvent = new ClearAlchemyItemBoxEvent(ev.ownPlayer.id)
    this.bus.post(clearAlchemyItemBoxEvent)
    this.moveBlackHole(blackHole, renderer)
  }

  private readonly spawnBlackHole = (ev: EntitySpawnEvent): void => {
    if (!(ev.entity instanceof BlackHole)) return
    if (ev.entity.ownerId === this.playerPluginStore.ownPlayerId) return
    const blackHole = ev.entity
    const renderer = this.blackHolePluginStore.blackHoleAttackRendererFactory.build()
    this.blackHolePluginStore.blackHoles.set(blackHole.blackHoleId, blackHole)
    this.blackHolePluginStore.blackHoleAttackRenderers.set(blackHole.blackHoleId, renderer)
    this.moveBlackHole(blackHole, renderer)
  }

  private readonly dieBlackHole = (ev: EntityDespawnEvent): void => {
    if (!(ev.entity instanceof BlackHole)) return
    const blackHoleId = ev.entity.blackHoleId
    const blackHole = this.blackHolePluginStore.blackHoles.get(blackHoleId)
    const blackHoleAttackRenderer = this.blackHolePluginStore.blackHoleAttackRenderers.get(blackHoleId)
    blackHole?.die()
    blackHoleAttackRenderer?.dead()
    this.blackHolePluginStore.blackHoles.delete(blackHoleId)
    this.blackHolePluginStore.blackHoleAttackRenderers.delete(blackHoleId)
  }

  private moveBlackHole(blackHole: BlackHole, render: IBlackHoleAttackRenderer): void {
    const startPosition: Position = blackHole.position.copy()
    let reversePosition: Position
    // 下、左を向いている時、左方向スタート
    if (vectorToName(blackHole.direction) === 'left' || vectorToName(blackHole.direction) === 'up') {
      reversePosition = new Position(blackHole.position.x - BLACK_HOLE_MOVE_LIMIT_GRIDS, blackHole.position.y)
    } else {
      reversePosition = new Position(blackHole.position.x + BLACK_HOLE_MOVE_LIMIT_GRIDS, blackHole.position.y)
    }
    render.move(startPosition, reversePosition, (pos) => {
      blackHole.position = pos
    })
  }
}
