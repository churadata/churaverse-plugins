import {
  BasePlugin,
  IMeetingScene,
  PhaserSceneInit,
  StartEvent,
  DomManager,
} from 'churaverse-engine-client'
import { Scene } from 'phaser'
import { MeetingScreenComponent } from './components/MeetingScreenComponent'
import { initSidebarToggle } from './components/MeetingSidebarComponent'

export class MeetingCoreUiPlugin extends BasePlugin<IMeetingScene> {
  private scene?: Scene

  public listenEvent(): void {
    this.bus.subscribeEvent('phaserSceneInit', this.phaserSceneInit.bind(this))
    this.bus.subscribeEvent('start', this.start.bind(this))
  }

  private phaserSceneInit(ev: PhaserSceneInit): void {
    this.scene = ev.scene
  }

  private start(ev: StartEvent): void {
    DomManager.addJsxDom(MeetingScreenComponent())
    initSidebarToggle()
  }
}
