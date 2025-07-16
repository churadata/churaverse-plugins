import { SocketController } from './controller/socketController'
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
import { NetworkPluginStore } from '@churaverse/network-plugin-client/store/defNetworkPluginStore'
import { PlayerPluginStore } from '@churaverse/player-plugin-client/store/defPlayerPluginStore'
import { UseAlchemyItemEvent } from '@churaverse/churaren-alchemy-plugin-client/event/useAlchemyItemEvent'
import { ClearAlchemyItemBoxEvent } from '@churaverse/churaren-alchemy-plugin-client/event/clearAlchemyItemBox'
import { Sendable } from '@churaverse/network-plugin-client/types/sendable'
import { BaseAlchemyItemPlugin } from '@churaverse/churaren-alchemy-plugin-client/domain/baseAlchemyItemPlugin'
import '@churaverse/churaren-core-plugin-client/churarenCorePlugin'
import { TornadoAttackRendererFactory } from './renderer/tornadoAttackRendererFactory'
import { TornadoPluginStore } from './store/defTornadoPluginStore'
import { Tornado, TORNADO_ITEM, TORNADO_WALK_LIMIT_GRIDS } from './domain/tornado'
import { TornadoAttackRenderer } from './renderer/tornadoAttackRenderer'
import { initTornadoPluginStore, resetTornadoPluginStore } from './store/initTornadoPluginStore'
import { TornadoSpawnMessage } from './message/tornadoSpawnMessage'
import { ITornadoAttackRenderer } from './domain/ITornadoAttckRenderer'

export class TornadoPlugin extends BaseAlchemyItemPlugin {
  private attackRendererFactory?: TornadoAttackRendererFactory
  private tornadoPluginStore!: TornadoPluginStore
  private playerPluginStore!: PlayerPluginStore
  private networkStore!: NetworkPluginStore<IMainScene>
  private socketController?: SocketController
  protected alchemyItem = TORNADO_ITEM

  public listenEvent(): void {
    // event登録
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
    this.attackRendererFactory = new TornadoAttackRendererFactory(ev.scene)
  }

  private loadAssets(ev: PhaserLoadAssets): void {
    TornadoAttackRenderer.loadAssets(ev.scene)
  }

  private init(): void {
    this.playerPluginStore = this.store.of('playerPlugin')
    this.networkStore = this.store.of('networkPlugin')
  }

  protected subscribeGameEvent(): void {
    super.subscribeGameEvent()
    this.bus.subscribeEvent('useAlchemyItem', this.useAlchemyItem)
    this.bus.subscribeEvent('entitySpawn', this.spawnTornado)
    this.bus.subscribeEvent('entityDespawn', this.dieTornado)
  }

  protected unsubscribeGameEvent(): void {
    super.unsubscribeGameEvent()
    this.bus.unsubscribeEvent('useAlchemyItem', this.useAlchemyItem)
    this.bus.unsubscribeEvent('entitySpawn', this.spawnTornado)
    this.bus.unsubscribeEvent('entityDespawn', this.dieTornado)
  }

  protected handleGameStart(): void {
    initTornadoPluginStore(this.store, this.attackRendererFactory)
    this.tornadoPluginStore = this.store.of('churarenTornadoPlugin')
    this.socketController?.getStores()
    this.socketController?.registerMessageListener()
  }

  protected handleGameTermination(): void {
    resetTornadoPluginStore(this.store)
    this.socketController?.unregisterMessageListener()
  }

  protected handleMidwayParticipant(): void {
    this.unsubscribeGameEvent()
  }

  // 竜巻アイテムを使った時の処理
  protected useAlchemyItem = (ev: UseAlchemyItemEvent): void => {
    if (ev.alchemyItem.kind !== 'tornado') return
    const renderer = this.tornadoPluginStore.tornadoAttackRendererFactory.build()
    const gap = 65
    const startPos = ev.ownPlayer.position.copy()
    const position = new Position(
      startPos.x + gap * ev.ownPlayer.direction.x,
      startPos.y + gap * ev.ownPlayer.direction.y
    )
    const tornado = new Tornado(ev.alchemyItem.itemId, ev.ownPlayer.id, position, ev.ownPlayer.direction, Date.now())
    if (renderer == null) return
    this.tornadoPluginStore.tornados.set(tornado.tornadoId, tornado)
    this.tornadoPluginStore.tornadoAttackRenderers.set(tornado.tornadoId, renderer)
    // 他のプレイヤーに竜巻の出現を送信する
    if (tornado.ownerId === this.playerPluginStore.ownPlayerId) {
      this.networkStore.messageSender.send(
        new TornadoSpawnMessage({
          tornadoId: tornado.tornadoId,
          startPos: tornado.position.toVector() as Vector & Sendable,
          direction: tornado.direction,
          spawnTime: tornado.spawnTime,
        })
      )
    }

    const clearAlchemyItemBoxEvent = new ClearAlchemyItemBoxEvent(ev.ownPlayer.id)
    this.bus.post(clearAlchemyItemBoxEvent)

    this.walkTornado(tornado, renderer)
  }

  // 竜巻の出現を受信した時の処理
  private readonly spawnTornado = (ev: EntitySpawnEvent): void => {
    if (!(ev.entity instanceof Tornado)) return
    if (ev.entity.ownerId === this.playerPluginStore.ownPlayerId) return
    const tornado = ev.entity
    const renderer = this.tornadoPluginStore.tornadoAttackRendererFactory.build()
    this.tornadoPluginStore.tornados.set(tornado.tornadoId, tornado)
    this.tornadoPluginStore.tornadoAttackRenderers.set(tornado.tornadoId, renderer)
    this.walkTornado(tornado, renderer)
  }

  private readonly dieTornado = (ev: EntityDespawnEvent): void => {
    if (!(ev.entity instanceof Tornado)) return
    const tornadoId = ev.entity.tornadoId
    const tornado = this.tornadoPluginStore.tornados.get(tornadoId)
    const tornadoAttackRenderer = this.tornadoPluginStore.tornadoAttackRenderers.get(tornadoId)
    tornado?.die()
    tornadoAttackRenderer?.dead()
    this.tornadoPluginStore.tornados.delete(tornadoId)
    this.tornadoPluginStore.tornadoAttackRenderers.delete(tornadoId)
  }

  private walkTornado(tornado: Tornado, render: ITornadoAttackRenderer): void {
    const totalSteps = 10 // アニメーションの総ステップ数
    const moveDistance = TORNADO_WALK_LIMIT_GRIDS * GRID_SIZE // 1ステップあたりの移動距離

    let stepIndex = 0 // 現在のステップ数

    const animateStep = (): void => {
      if (stepIndex > totalSteps) {
        render.dead()
        return
      }

      // nステップ目の竜巻の移動方向(stepIndexが偶数の時と奇数の時で切り替え)
      const attackDirection = stepIndex % 2 === 0 ? 1 : -1
      let dest: Position

      // 1ステップ目は移動距離が半分(ジグザグの真ん中から開始するため)
      if (stepIndex === 0) {
        dest = new Position(
          tornado.position.x +
            (tornado.direction.x * moveDistance) / 2 +
            (tornado.direction.y * attackDirection * moveDistance) / 2,
          tornado.position.y +
            (tornado.direction.y * moveDistance) / 2 +
            (tornado.direction.x * attackDirection * moveDistance) / 2
        )
      } else {
        dest = new Position(
          tornado.position.x +
            tornado.direction.x * moveDistance +
            tornado.direction.y * attackDirection * moveDistance,
          tornado.position.y + tornado.direction.y * moveDistance + tornado.direction.x * attackDirection * moveDistance
        )
      }

      render.walk(
        tornado.position,
        dest,
        (pos) => {
          tornado.walk(pos)
        },
        () => {
          stepIndex++
          animateStep() // 次のステップを呼び出す
        }
      )
    }

    // アニメーションを開始
    animateStep()
  }
}
