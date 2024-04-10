import { Scene } from 'phaser'
import { BasePlugin, PhaserSceneInit, SceneUndefinedError, Scenes } from 'churaverse-engine-client'
import { AutoKeyFactory } from './autoKeyFactory'
import { KeyboardPluginStore } from '../keyboardPlugin/store/defKeyboardPluginStore'

export class AutoKeyBoardPlugin extends BasePlugin<Scenes> {
  private scene?: Scene

  public listenEvent(): void {
    this.bus.subscribeEvent('phaserSceneInit', this.phaserSceneInit.bind(this))
    this.bus.subscribeEvent('init', this.init.bind(this))
  }

  private phaserSceneInit(ev: PhaserSceneInit): void {
    this.scene = ev.scene
  }

  private init(): void {
    if (this.scene === undefined) throw new SceneUndefinedError()

    const keyFactory = new AutoKeyFactory(this.scene)
    this.store.of('keyboardPlugin').keyFactorySetter.set(keyFactory)
  }
}
