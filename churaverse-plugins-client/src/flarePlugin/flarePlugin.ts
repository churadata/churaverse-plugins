import {
  BasePlugin,
  IMainScene,
  PhaserSceneInit,
  PhaserLoadAssets,
  InitEvent,
  StartEvent,
  EntitySpawnEvent,
  EntityDespawnEvent,
  GRID_SIZE,
  Vector,
} from 'churaverse-engine-client'
import { KeyboardController } from './controller/keyboardController'
import { FlareRendererFactory } from './renderer/flareRendererFactory'
import { FlarePluginStore } from './store/defFlarePluginStore'
import { PlayerPluginStore } from '@churaverse/player-plugin-client/store/defPlayerPluginStore'
import { NetworkPluginStore } from '@churaverse/network-plugin-client/store/defNetworkPluginStore'
import { initFlarePluginStore } from './store/initFlarePluginStore'
import { FlareRenderer } from './renderer/flareRenderer'
import { Flare, FLARE_SPREAD_LIMIT_GRIDS } from './domain/flare'
import { IFlareRenderer } from './domain/IFlareRenderer'
import { FlareSpawnMessage } from './message/flareSpawnMessage'
import { SocketController } from './controller/socketController'
import { KeyboardPluginStore } from '@churaverse/keyboard-plugin-client/store/defKeyboardPluginStore'
import { DeathLog } from '@churaverse/player-plugin-client/ui/deathLog/deathLog'
import { DebugScreenPluginStore } from '@churaverse/debug-screen-plugin-client/store/defDebugScreenPluginStore'
import { DebugDetailScreenSection } from '@churaverse/debug-screen-plugin-client/debugScreen/debugDetailScreenSection'
import { FlareCountDebugDetailScreen } from './debugScreen/flareCountDebugDetailScreen'
import { DumpDebugDataEvent } from '@churaverse/debug-screen-plugin-client/event/dumpDebugDataEvent'
import { IFlareCountDebugDetailScreen } from './debugScreen/IDebugScreen/IFlareCountDebugDetailScreen'
import { Sendable } from '@churaverse/network-plugin-client/types/sendable'

export class FlarePlugin extends BasePlugin<IMainScene> {
  private rendererFactory?: FlareRendererFactory
  // Store系のプロパティは、コンストラクタではなくinitイベントで初期化されます。
  private flarePluginStore!: FlarePluginStore
  private playerPluginStore!: PlayerPluginStore
  private networkStore!: NetworkPluginStore<IMainScene>
  private keyboardStore!: KeyboardPluginStore<IMainScene>
  private debugScreenStore!: DebugScreenPluginStore
  private flareCountDebugDetailScreen!: IFlareCountDebugDetailScreen

  public listenEvent(): void {
    this.bus.subscribeEvent('phaserSceneInit', this.phaserSceneInit.bind(this))
    this.bus.subscribeEvent('phaserLoadAssets', this.loadAssets.bind(this))

    this.bus.subscribeEvent('init', this.init.bind(this))
    this.bus.subscribeEvent('start', this.start.bind(this))

    const socketController = new SocketController(this.bus, this.store)
    this.bus.subscribeEvent('registerMessage', socketController.registerMessage.bind(socketController))
    this.bus.subscribeEvent('registerMessageListener', socketController.registerMessageListener.bind(socketController))

    const keyboardController = new KeyboardController(this.bus, this.store)
    this.bus.subscribeEvent('registerKayAction', keyboardController.registerKeyAction.bind(keyboardController))
    this.bus.subscribeEvent(
      'registerKeyActionListener',
      keyboardController.registerKeyActionListener.bind(keyboardController)
    )

    this.bus.subscribeEvent('entitySpawn', this.spawnFlare.bind(this))
    this.bus.subscribeEvent('entityDespawn', this.dieFlare.bind(this))
    this.bus.subscribeEvent('dumpDebugData', this.dumpDebugData.bind(this))
  }

  private phaserSceneInit(ev: PhaserSceneInit): void {
    this.rendererFactory = new FlareRendererFactory(ev.scene)
  }

  private loadAssets(ev: PhaserLoadAssets): void {
    FlareRenderer.loadAssets(ev.scene)
  }

  private init(ev: InitEvent): void {
    initFlarePluginStore(this.store, this.rendererFactory)
    this.flarePluginStore = this.store.of('flarePlugin')
    this.playerPluginStore = this.store.of('playerPlugin')
    this.networkStore = this.store.of('networkPlugin')
    this.keyboardStore = this.store.of('keyboardPlugin')
    this.debugScreenStore = this.store.of('debugScreenPlugin')
  }

  private start(ev: StartEvent): void {
    this.keyboardStore.keySettingWindow.addKeyAction('ReleaseFlare', '炎を放出')
    this.playerPluginStore.deathLogRenderer.addDeathLogMessageBuilder(
      'flare',
      (deathLog: DeathLog) => `炎で ${deathLog.victim.name} が焼き尽くされた！ ${deathLog.killer.name} の勝利！`
    )
    this.setupDebugScreen()
  }

  private setupDebugScreen(): void {
    const debugDetailScreenContainer = this.debugScreenStore.debugDetailScreenContainer
    debugDetailScreenContainer.addSection(new DebugDetailScreenSection('flareInfo', 'Flare'))
    this.flareCountDebugDetailScreen = new FlareCountDebugDetailScreen(debugDetailScreenContainer)
    this.updateDebugScreenFlareCount()
  }

  public spawnFlare(ev: EntitySpawnEvent): void {
    if (!(ev.entity instanceof Flare)) return
    const flare = ev.entity
    const renderer = this.flarePluginStore.flareRendererFactory.build()
    this.flarePluginStore.flares.set(flare.flareId, flare)
    this.flarePluginStore.flareRenderers.set(flare.flareId, renderer)

    // 他のプレイヤーにサメの出現を送信する
    if (flare.ownerId === this.playerPluginStore.ownPlayerId) {
      this.networkStore.messageSender.send(
        new FlareSpawnMessage({
          flareId: flare.flareId,
          startPos: flare.position.toVector() as Vector & Sendable,
          direction: flare.direction,
          spawnTime: flare.spawnTime,
        })
      )
    }

    this.spreadFlare(flare, renderer)
    this.updateDebugScreenFlareCount()
  }

  public spreadFlare(flare: Flare, render: IFlareRenderer): void {
    const dest = flare.position.copy()
    dest.x = flare.direction.x * FLARE_SPREAD_LIMIT_GRIDS * GRID_SIZE + flare.position.x
    dest.y = flare.direction.y * FLARE_SPREAD_LIMIT_GRIDS * GRID_SIZE + flare.position.y
    render.spread(flare.position, dest, flare.direction, (pos) => {
      flare.spread(pos)
    })
  }

  private dieFlare(ev: EntityDespawnEvent): void {
    if (!(ev.entity instanceof Flare)) return
    const flareId = ev.entity.flareId
    const flare = this.flarePluginStore.flares.get(flareId)
    const flareRenderer = this.flarePluginStore.flareRenderers.get(flareId)
    flare?.die()
    flareRenderer?.dead()
    this.flarePluginStore.flares.delete(flareId)
    this.flarePluginStore.flareRenderers.delete(flareId)
    this.updateDebugScreenFlareCount()
  }

  private updateDebugScreenFlareCount(): void {
    const flareCount = this.flarePluginStore.flares.size
    this.flareCountDebugDetailScreen.update(flareCount)
  }

  private dumpDebugData(ev: DumpDebugDataEvent): void {
    const flareCount = this.flarePluginStore.flares.size
    ev.dataDumper.dump('flareCount', flareCount.toString())
  }
}
