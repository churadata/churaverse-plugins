import {
  BasePlugin,
  ITitleScene,
  PhaserSceneInit,
  PhaserLoadAssets,
  InitEvent,
  StartEvent,
} from 'churaverse-engine-client'
import { Scene } from 'phaser'
import { JoinButtonRenderer } from './renderer/joinButtonRenderer'
import { TitleBackgroundRenderer } from './renderer/titleBackgroundRenderer'
import { ChuraDataLogoRenderer } from './renderer/churaDataLogoRenderer'
import { TitlePlayerRoleChangeEvent } from './event/titlePlayerRoleChangeEvent'
import { TitlePlayerPluginStore } from '../titlePlayerPlugin/store/defTitlePlayerPlugin'

export class TitleCoreUiPlugin extends BasePlugin<ITitleScene> {
  private scene!: Scene
  private titlePlayerPluginStore!: TitlePlayerPluginStore
  private joinButtonRenderer!: JoinButtonRenderer

  public listenEvent(): void {
    this.bus.subscribeEvent('phaserSceneInit', this.phaserSceneInit.bind(this))
    this.bus.subscribeEvent('phaserLoadAssets', this.loadAssets.bind(this))

    this.bus.subscribeEvent('init', this.init.bind(this))
    this.bus.subscribeEvent('start', this.start.bind(this))

    this.bus.subscribeEvent('titlePlayerRoleChange', this.changePlayerRole.bind(this))
  }

  private phaserSceneInit(ev: PhaserSceneInit): void {
    this.scene = ev.scene
  }

  private loadAssets(ev: PhaserLoadAssets): void {
    ChuraDataLogoRenderer.loadAssets(this.scene)
  }

  private init(ev: InitEvent): void {
    this.titlePlayerPluginStore = this.store.of('titlePlayerPlugin')
  }

  private start(ev: StartEvent): void {
    this.joinButtonRenderer = new JoinButtonRenderer(this.scene, this.store, this.bus)
    new TitleBackgroundRenderer(this.scene)
    new ChuraDataLogoRenderer(this.scene, this.store, this.bus)
  }

  private changePlayerRole(ev: TitlePlayerRoleChangeEvent): void {
    const role = this.titlePlayerPluginStore.ownPlayer.role
    if (role === 'admin') {
      this.titlePlayerPluginStore.titlePlayerRoleRenderer.disappear()
      this.titlePlayerPluginStore.ownPlayer.setRole('user')
    } else {
      this.titlePlayerPluginStore.titlePlayerRoleRenderer.appear()
      this.titlePlayerPluginStore.ownPlayer.setRole('admin')
    }
    const newRole = this.titlePlayerPluginStore.ownPlayer.role
    this.joinButtonRenderer.changeButtonColor(newRole)
  }
}
