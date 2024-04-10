import {
  BasePlugin,
  IMainScene,
  PhaserSceneInit,
  PhaserLoadAssets,
  InitEvent,
  StartEvent,
  EntitySpawnEvent,
  EntityDespawnEvent,
  Vector,
} from 'churaverse-engine-client'
import { DebugDetailScreenSection } from '../debugScreenPlugin/debugScreen/debugDetailScreenSection'
import { DumpDebugDataEvent } from '../debugScreenPlugin/event/dumpDebugDataEvent'
import { DebugScreenPluginStore } from '../debugScreenPlugin/store/defDebugScreenPluginStore'
import { KeyboardPluginStore } from '../keyboardPlugin/store/defKeyboardPluginStore'
import { NetworkPluginStore } from '../networkPlugin/store/defNetworkPluginStore'
import { PlayerPluginStore } from '../playerPlugin/store/defPlayerPluginStore'
import { KeyboardController } from './controller/keyboardController'
import { SocketController } from './controller/socketController'
import { IBombCountDebugDetailScreen } from './debugScreen/IDebugScreen/IBombCountDebugDetailScreen'
import { BombCountDebugDetailScreen } from './debugScreen/bombCountDebugDetailScreen'
import { IBombRenderer } from './domain/IBombRenderer'
import { Bomb } from './domain/bomb'
import { BombSpawnMessage } from './message/bombSpawnMessage'
import { BombRenderer } from './renderer/bombRenderer'
import { BombRendererFactory } from './renderer/bombRendererFactory'
import { BombPluginStore } from './store/defBombPluginStore'
import { initBombPluginStore } from './store/initBombPluginStore'
import { DeathLog } from '../playerPlugin/ui/deathLog/deathLog'
import { SendableObject } from '../networkPlugin/types/sendable'

export class BombPlugin extends BasePlugin<IMainScene> {
  private rendererFactory?: BombRendererFactory
  // Store系のプロパティは、コンストラクタではなくinitイベントで初期化されます。
  private bombPluginStore!: BombPluginStore
  private playerPluginStore!: PlayerPluginStore
  private networkStore!: NetworkPluginStore<IMainScene>
  private keyboardStore!: KeyboardPluginStore<IMainScene>
  private debugScreenStore!: DebugScreenPluginStore
  private bombCountDebugDetailScreen!: IBombCountDebugDetailScreen

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

    this.bus.subscribeEvent('entitySpawn', this.spawnBomb.bind(this))
    this.bus.subscribeEvent('entityDespawn', this.removeBomb.bind(this))
    this.bus.subscribeEvent('dumpDebugData', this.dumpDebugData.bind(this))
  }

  private phaserSceneInit(ev: PhaserSceneInit): void {
    this.rendererFactory = new BombRendererFactory(ev.scene)
  }

  private loadAssets(ev: PhaserLoadAssets): void {
    BombRenderer.loadAssets(ev.scene)
  }

  private init(ev: InitEvent): void {
    initBombPluginStore(this.store, this.rendererFactory)
    this.bombPluginStore = this.store.of('bombPlugin')
    this.playerPluginStore = this.store.of('playerPlugin')
    this.networkStore = this.store.of('networkPlugin')
    this.keyboardStore = this.store.of('keyboardPlugin')
    this.debugScreenStore = this.store.of('debugScreenPlugin')
  }

  private start(ev: StartEvent): void {
    this.keyboardStore.keySettingWindow.addKeyAction('DropBomb', '爆弾を投下')
    this.playerPluginStore.deathLogRenderer.addDeathLogMessageBuilder(
      'bomb',
      (deathLog: DeathLog) => `${deathLog.victim.name} が死亡！ ${deathLog.killer.name} の爆弾の威力半端ねえぜ！`
    )
    this.setupDebugScreen()
  }

  private setupDebugScreen(): void {
    const debugDetailScreenContainer = this.debugScreenStore.debugDetailScreenContainer
    debugDetailScreenContainer.addSection(new DebugDetailScreenSection('bombInfo', 'Bomb'))
    this.bombCountDebugDetailScreen = new BombCountDebugDetailScreen(debugDetailScreenContainer)
    this.updateDebugScreenBombCount()
  }

  public spawnBomb(ev: EntitySpawnEvent): void {
    if (!(ev.entity instanceof Bomb)) return
    const bomb = ev.entity
    const renderer = this.bombPluginStore.bombRendererFactory.build()
    this.bombPluginStore.bombs.set(bomb.bombId, bomb)
    this.bombPluginStore.bombRenderers.set(bomb.bombId, renderer)
    this.updateDebugScreenBombCount()

    // 他のプレイヤーに爆弾の出現を送信する
    if (bomb.ownerId === this.playerPluginStore.ownPlayerId) {
      this.networkStore.messageSender.send(
        new BombSpawnMessage({
          bombId: bomb.bombId,
          startPos: bomb.position.toVector() as Vector & SendableObject ,
          direction: bomb.direction,
          spawnTime: bomb.spawnTime,
        })
      )
    }

    this.dropBomb(bomb, renderer)
  }

  public dropBomb(bomb: Bomb, renderer: IBombRenderer): void {
    const source = bomb.ownerId
    if (source === undefined) {
      renderer.destroy()
      return
    }

    renderer.drop(bomb.position)
  }

  public removeBomb(ev: EntityDespawnEvent): void {
    if (!(ev.entity instanceof Bomb)) return
    const bombId = ev.entity.bombId
    const bombRenderer = this.bombPluginStore.bombRenderers.get(bombId)
    if (bombRenderer === undefined) return
    bombRenderer.explode()

    this.bombPluginStore.bombs.delete(bombId)
    this.bombPluginStore.bombRenderers.delete(bombId)
    this.updateDebugScreenBombCount()
  }

  private updateDebugScreenBombCount(): void {
    const bombCount = this.bombPluginStore.bombs.size
    this.bombCountDebugDetailScreen.update(bombCount)
  }

  private dumpDebugData(ev: DumpDebugDataEvent): void {
    const bombCount = this.bombPluginStore.bombs.size
    ev.dataDumper.dump('bombCount', bombCount.toString())
  }
}
