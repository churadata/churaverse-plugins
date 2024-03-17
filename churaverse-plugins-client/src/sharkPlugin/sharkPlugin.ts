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
} from 'churaverse-engine-client'
import { KeyboardController } from './controller/keyboardController'
import { SharkRendererFactory } from './renderer/sharkRendererFactory'
import { SharkPluginStore } from './store/defSharkPluginStore'
import { PlayerPluginStore } from '../playerPlugin/store/defPlayerPluginStore'
import { NetworkPluginStore } from '../networkPlugin/store/defNetworkPluginStore'
import { initSharkPluginStore } from './store/initSharkPluginStore'
import { SharkRenderer } from './renderer/sharkRenderer'
import { Shark, SHARK_WALK_LIMIT_GRIDS } from './domain/shark'
import { ISharkRenderer } from './domain/ISharkRenderer'
import { SharkSpawnMessage } from './message/sharkSpawnMessage'
import { SocketController } from './controller/socketController'
import { KeyboardPluginStore } from '../keyboardPlugin/store/defKeyboardPluginStore'
import { DeathLog } from '../playerPlugin/ui/deathLog/deathLog'
import { DebugScreenPluginStore } from '../debugScreenPlugin/store/defDebugScreenPluginStore'
import { DebugDetailScreenSection } from '../debugScreenPlugin/debugScreen/debugDetailScreenSection'
import { SharkCountDebugDetailScreen } from './debugScreen/sharkCountDebugDetailScreen'
import { DumpDebugDataEvent } from '../debugScreenPlugin/event/dumpDebugDataEvent'
import { ISharkCountDebugDetailScreen } from './debugScreen/IDebugScreen/ISharkCountDebugDetailScreen'

export class SharkPlugin extends BasePlugin<IMainScene> {
  private rendererFactory?: SharkRendererFactory
  // Store系のプロパティは、コンストラクタではなくinitイベントで初期化されます。
  private sharkPluginStore!: SharkPluginStore
  private playerPluginStore!: PlayerPluginStore
  private networkStore!: NetworkPluginStore<IMainScene>
  private keyboardStore!: KeyboardPluginStore<IMainScene>
  private debugScreenStore!: DebugScreenPluginStore
  private sharkCountDebugDetailScreen!: ISharkCountDebugDetailScreen

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

    this.bus.subscribeEvent('entitySpawn', this.spawnShark.bind(this))
    this.bus.subscribeEvent('entityDespawn', this.dieShark.bind(this))
    this.bus.subscribeEvent('dumpDebugData', this.dumpDebugData.bind(this))
  }

  private phaserSceneInit(ev: PhaserSceneInit): void {
    this.rendererFactory = new SharkRendererFactory(ev.scene)
  }

  private loadAssets(ev: PhaserLoadAssets): void {
    SharkRenderer.loadAssets(ev.scene)
  }

  private init(ev: InitEvent): void {
    initSharkPluginStore(this.store, this.rendererFactory)
    this.sharkPluginStore = this.store.of('sharkPlugin')
    this.playerPluginStore = this.store.of('playerPlugin')
    this.networkStore = this.store.of('networkPlugin')
    this.keyboardStore = this.store.of('keyboardPlugin')
    this.debugScreenStore = this.store.of('debugScreenPlugin')
  }

  private start(ev: StartEvent): void {
    this.keyboardStore.keySettingWindow.addKeyAction('ShotShark', 'サメを射出')
    this.playerPluginStore.deathLogRenderer.addDeathLogMessageBuilder(
      'shark',
      (deathLog: DeathLog) => `サメの口へ ${deathLog.victim.name} がダイブ！ ${deathLog.killer.name} の勝利！`
    )
    this.setupDebugScreen()
  }

  private setupDebugScreen(): void {
    const debugDetailScreenContainer = this.debugScreenStore.debugDetailScreenContainer
    debugDetailScreenContainer.addSection(new DebugDetailScreenSection('sharkInfo', 'Shark'))
    this.sharkCountDebugDetailScreen = new SharkCountDebugDetailScreen(debugDetailScreenContainer)
    this.updateDebugScreenSharkCount()
  }

  public spawnShark(ev: EntitySpawnEvent): void {
    if (!(ev.entity instanceof Shark)) return
    const shark = ev.entity
    const renderer = this.sharkPluginStore.sharkRendererFactory.build()
    this.sharkPluginStore.sharks.set(shark.sharkId, shark)
    this.sharkPluginStore.sharkRenderers.set(shark.sharkId, renderer)

    // 他のプレイヤーにサメの出現を送信する
    if (shark.ownerId === this.playerPluginStore.ownPlayerId) {
      this.networkStore.messageSender.send(
        new SharkSpawnMessage({
          sharkId: shark.sharkId,
          startPos: shark.position.toVector(),
          direction: shark.direction,
          spawnTime: shark.spawnTime,
        })
      )
    }

    this.walkShark(shark, renderer)
    this.updateDebugScreenSharkCount()
  }

  public walkShark(shark: Shark, render: ISharkRenderer): void {
    const dest = shark.position.copy()
    dest.x = shark.direction.x * SHARK_WALK_LIMIT_GRIDS * GRID_SIZE + shark.position.x
    dest.y = shark.direction.y * SHARK_WALK_LIMIT_GRIDS * GRID_SIZE + shark.position.y
    render.walk(shark.position, dest, shark.direction, (pos) => {
      shark.walk(pos)
    })
  }

  private dieShark(ev: EntityDespawnEvent): void {
    if (!(ev.entity instanceof Shark)) return
    const sharkId = ev.entity.sharkId
    const shark = this.sharkPluginStore.sharks.get(sharkId)
    const sharkRenderer = this.sharkPluginStore.sharkRenderers.get(sharkId)
    shark?.die()
    sharkRenderer?.dead()
    this.sharkPluginStore.sharks.delete(sharkId)
    this.sharkPluginStore.sharkRenderers.delete(sharkId)
    this.updateDebugScreenSharkCount()
  }

  private updateDebugScreenSharkCount(): void {
    const sharkCount = this.sharkPluginStore.sharks.size
    this.sharkCountDebugDetailScreen.update(sharkCount)
  }

  private dumpDebugData(ev: DumpDebugDataEvent): void {
    const sharkCount = this.sharkPluginStore.sharks.size
    ev.dataDumper.dump('sharkCount', sharkCount.toString())
  }
}
