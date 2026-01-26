import { InitEvent, PhaserSceneInit, EVENT_PRIORITY, Scenes, BasePlugin } from 'churaverse-engine-client'
import { WillSceneTransitionEvent } from './event/willSceneTransitionEvent'
import { TransitionManager } from './transitionManager'
import { TransitionManagerUndefinedError } from './errors/transitionManagerUndefinedError'
import { initTransitionPluginStore } from './store/initTransitionPluginStore'
import { SceneTransitionDataTransporter } from './sceneTransitionDataTransporter'

export class TransitionPlugin extends BasePlugin<Scenes> {
  private transitionMgr?: TransitionManager<Scenes>
  private readonly sceneDataTransporter = new SceneTransitionDataTransporter()

  public listenEvent(): void {
    this.bus.subscribeEvent('phaserSceneInit', this.phaserSceneInit.bind(this))
    this.bus.subscribeEvent('init', this.init.bind(this))

    this.bus.subscribeEvent('willSceneTransition', this.onSceneTransition.bind(this), EVENT_PRIORITY.LOWEST)
  }

  private phaserSceneInit(ev: PhaserSceneInit): void {
    this.transitionMgr = new TransitionManager<Scenes>(
      ev.scene.sceneName,
      this.sceneDataTransporter,
      ev.scene.scene,
      this.bus
    )
  }

  private init(ev: InitEvent): void {
    if (this.transitionMgr === undefined) throw new TransitionManagerUndefinedError()

    initTransitionPluginStore(this.store, this.transitionMgr)
  }

  private onSceneTransition(ev: WillSceneTransitionEvent<Scenes, Scenes>): void {
    if (this.transitionMgr === undefined) throw new TransitionManagerUndefinedError()

    this.transitionMgr.transitionByPhaserScene(ev.to, this.sceneDataTransporter.popData())
  }
}
