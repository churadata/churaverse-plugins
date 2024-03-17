import { InitEvent, StartEvent, IMainScene, BasePlugin, EVENT_PRIORITY } from 'churaverse-engine-client'
import { KeyboardPluginStore } from '../keyboardPlugin/store/defKeyboardPluginStore'
import { KeyboardController } from './controller/keyboardController'
import { DumpDebugDataEvent } from './event/dumpDebugDataEvent'
import { initDebugScreenPluginStore } from './store/initDebugScreenPluginStore'

export class DebugScreenPlugin extends BasePlugin<IMainScene> {
  private keyboardStore!: KeyboardPluginStore<IMainScene>

  public listenEvent(): void {
    this.bus.subscribeEvent('init', this.init.bind(this))
    this.bus.subscribeEvent('start', this.start.bind(this), EVENT_PRIORITY.LOW)

    const keyboardController = new KeyboardController(this.bus, this.store)
    this.bus.subscribeEvent('registerKayAction', keyboardController.registerKeyAction.bind(keyboardController))
    this.bus.subscribeEvent(
      'registerKeyActionListener',
      keyboardController.registerKeyActionListener.bind(keyboardController)
    )

    this.bus.subscribeEvent('dumpDebugData', this.dumpDebugData.bind(this), 'LOWEST')
  }

  private init(ev: InitEvent): void {
    initDebugScreenPluginStore(this.store, this.bus)
    this.keyboardStore = this.store.of('keyboardPlugin')
  }

  private start(ev: StartEvent): void {
    this.keyboardStore.keySettingWindow.addKeyAction('ToggleDebugScreen', 'デバッグ画面の開閉')
  }

  private dumpDebugData(ev: DumpDebugDataEvent): void {
    ev.dataDumper.saveJsonToFile()
  }
}
