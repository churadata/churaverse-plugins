import { BasePlugin, IMainScene, PhaserSceneInit, SceneUndefinedError } from 'churaverse-engine-client'
import { GroundScreenRendererFactory } from './renderer/groundScreenRendererFactory'
import { initGroundScreenPluginStore } from './store/initGroundScreenPluginStore'
import '@churaverse/core-ui-plugin-client/store/defCoreUiPluginStore'
import '@churaverse/map-plugin-client/store/defMapPluginStore'

export class GroundScreenPlugin extends BasePlugin<IMainScene> {
  private scene?: Phaser.Scene

  public listenEvent(): void {
    this.bus.subscribeEvent('phaserSceneInit', this.phaserSceneInit.bind(this))
    this.bus.subscribeEvent('init', this.init.bind(this))
  }

  private phaserSceneInit(ev: PhaserSceneInit): void {
    this.scene = ev.scene
  }

  private init(): void {
    if (this.scene === undefined) throw new SceneUndefinedError()

    const uiStore = this.store.of('coreUiPlugin')
    const groundScreenRenderer = new GroundScreenRendererFactory(
      this.scene,
      this.store.of('mapPlugin').mapManager,
      uiStore.focusTargetRepository
    )
    initGroundScreenPluginStore(this.store, groundScreenRenderer)
  }
}
