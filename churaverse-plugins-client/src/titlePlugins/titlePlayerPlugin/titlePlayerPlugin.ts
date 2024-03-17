import {
  BasePlugin,
  ITitleScene,
  PhaserSceneInit,
  PhaserLoadAssets,
  InitEvent,
  StartEvent,
  Position,
  Direction,
  Scenes,
  IMainScene,
} from 'churaverse-engine-client'
import { NetworkPluginStore } from '../../networkPlugin/store/defNetworkPluginStore'
import { PlayerSetupInfoReader } from '../../../interface/playerSetupInfo/playerSetupInfoReader'
import { CookieStore } from '../../../interface/repository/cookieStore'
import { PlayerRenderer } from '../../playerPlugin/renderer/playerRenderer'
import { Player, DEFAULT_HP } from '../../playerPlugin/domain/player'
import { PLAYER_COLOR_NAMES } from '../../playerPlugin/types/playerColor'
import { TitlePlayerNameChangeEvent } from './event/titlePlayerNameChangeEvent'
import { initTitlePlayerPluginStore } from './store/initTitlePlayerPlugin'
import { TitlePlayerPluginStore } from './store/defTitlePlayerPlugin'
import { setupTitlePlayerUi } from './ui/setupTitlePlayerUi'
import { Scene } from 'phaser'
import { TitlePlayerColorChangeEvent } from './event/titlePlayerColorChangeEvent'
import { PlayerRendererFactory } from '../../playerPlugin/renderer/playerRendererFactory'
import { IPlayerRenderer } from '../../playerPlugin/domain/IPlayerRenderer'
import { TitleNameFieldRenderer } from './ui/renderer/titleNameFieldRenderer'
import { TitleArrowButtonRenderer } from './ui/renderer/titleArrowButtonRenderer'
import { TitlePlayerRoleRenderer } from './ui/renderer/titlePlayerRoleRenderer'
import { WillSceneTransitionEvent } from '../../transitionPlugin/event/willSceneTransitionEvent'
import { Socket } from '../../networkPlugin/socket/socket'

export class TitlePlayerPlugin extends BasePlugin<ITitleScene> {
  private scene!: Scene
  private playerRendererFactory!: PlayerRendererFactory
  private playerSetupInfoReader!: PlayerSetupInfoReader
  private networkStore!: NetworkPluginStore<ITitleScene>
  private titlePlayerPluginStore!: TitlePlayerPluginStore
  private ownPlayer!: Player

  public listenEvent(): void {
    this.bus.subscribeEvent('phaserSceneInit', this.phaserSceneInit.bind(this))
    this.bus.subscribeEvent('phaserLoadAssets', this.loadAssets.bind(this))

    this.bus.subscribeEvent('init', this.init.bind(this))
    this.bus.subscribeEvent('start', this.start.bind(this))

    this.bus.subscribeEvent('titlePlayerColorChange', this.changePlayerColor.bind(this))
    this.bus.subscribeEvent('titlePlayerNameChange', this.changePlayerName.bind(this))
    this.bus.subscribeEvent('willSceneTransition', this.willSceneTransition.bind(this))
  }

  private phaserSceneInit(ev: PhaserSceneInit): void {
    this.playerRendererFactory = new PlayerRendererFactory(ev.scene)
    this.scene = ev.scene
  }

  private loadAssets(ev: PhaserLoadAssets): void {
    PlayerRenderer.loadAssets(ev.scene)
    TitleArrowButtonRenderer.loadAssets(ev.scene)
  }

  private init(ev: InitEvent): void {
    this.playerSetupInfoReader = new PlayerSetupInfoReader(new CookieStore())
    this.networkStore = this.store.of('networkPlugin')
    this.ownPlayer = this.createOwnPlayer()
    initTitlePlayerPluginStore(
      this.store,
      this.ownPlayer,
      this.createPreviewPlayer(),
      new TitleNameFieldRenderer(this.bus),
      new TitlePlayerRoleRenderer(this.scene, this.playerSetupInfoReader)
    )
    this.titlePlayerPluginStore = this.store.of('titlePlayerPlugin')
  }

  private start(ev: StartEvent): void {
    setupTitlePlayerUi(this.scene, this.store, this.bus)
  }

  private createOwnPlayer(): Player {
    const pos = new Position(800, 440)
    const direction = Direction.down
    const ownPlayer = new Player(
      this.networkStore.socketId,
      pos,
      direction,
      this.playerSetupInfoReader.read().name ?? '',
      this.playerSetupInfoReader.read().color ?? PLAYER_COLOR_NAMES[4],
      DEFAULT_HP,
      this.playerSetupInfoReader.read().role ?? 'user'
    )
    return ownPlayer
  }

  private createPreviewPlayer(): IPlayerRenderer {
    const pos = new Position(0, 0)
    const direction = Direction.down
    const previewPlayer = this.playerRendererFactory.build(
      pos,
      direction,
      this.playerSetupInfoReader.read().name ?? '',
      this.playerSetupInfoReader.read().color ?? PLAYER_COLOR_NAMES[4],
      DEFAULT_HP
    )
    return previewPlayer
  }

  private changePlayerColor(ev: TitlePlayerColorChangeEvent): void {
    this.titlePlayerPluginStore.ownPlayer.setColor(ev.color)
    this.titlePlayerPluginStore.previewPlayer.applyPlayerColor(ev.color)
  }

  private changePlayerName(ev: TitlePlayerNameChangeEvent): void {
    this.titlePlayerPluginStore.ownPlayer.setName(ev.name)
    this.titlePlayerPluginStore.previewPlayer.applyPlayerName(ev.name)
  }

  private willSceneTransition(ev: WillSceneTransitionEvent<ITitleScene, Scenes>): void {
    if (ev.to !== 'MainScene') return
    // 遷移先にplayerのインスタンスをownPlayerをキーとして渡す
    // ev.sceneDataTransporter.push<IMainScene, 'ownPlayer'>('ownPlayer', this.ownPlayer)

    // playerのidがundefinedになってる問題があるから、とりあえずidだけ設定しなおして渡してる。
    const player = new Player(
      Socket.build().socketId,
      this.ownPlayer.position,
      this.ownPlayer.direction,
      this.ownPlayer.name,
      this.ownPlayer.color,
      this.ownPlayer.hp,
      this.ownPlayer.role,
      this.ownPlayer.spawnTime
    )
    ev.sceneDataTransporter.push<IMainScene, 'ownPlayer'>('ownPlayer', player)
  }
}
