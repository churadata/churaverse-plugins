import {
  BasePlugin,
  IMainScene,
  EVENT_PRIORITY,
  PhaserSceneInit,
  SceneUndefinedError,
  StartEvent,
  ITitleScene,
  DomManager,
} from 'churaverse-engine-client'
import { Scene } from 'phaser'
import { ExitButton } from './exit/exitButton'
import { SettingIcon } from './settingDialog/settingIcon'
import { AdminSettingIcon } from './adminSettingDialog/adminSettingIcon'
import { OwnPlayerUndefinedError } from '../playerPlugin/errors/ownPlayerUndefinedError'
import { TransitionPluginStore } from '../transitionPlugin/store/defTransitionPluginStore'
import { FocusSwitcher } from './focusSwitcher/focusSwitcher'
import { KeyboardPluginStore } from '../keyboardPlugin/store/defKeyboardPluginStore'
import { KeyboardController } from './controller/keyboardController'
import { CoreUiPluginStore } from './store/defCoreUiPluginStore'
import { initCoreUiPlugin } from './store/initCoreUiPluginStore'

export class CoreUiPlugin extends BasePlugin<IMainScene> {
  private scene?: Scene
  private coreUiPluginStore!: CoreUiPluginStore
  private transitionPluginStore!: TransitionPluginStore<IMainScene>
  private keyboardPluginStore!: KeyboardPluginStore<IMainScene>
  private readonly focusSwitcher = new FocusSwitcher()

  public listenEvent(): void {
    this.bus.subscribeEvent('phaserSceneInit', this.phaserSceneInit.bind(this))
    this.bus.subscribeEvent('start', this.start.bind(this))
    this.bus.subscribeEvent('init', this.init.bind(this), 'HIGHEST')
    this.bus.subscribeEvent('init', this.getStores.bind(this), 'LOW')

    const keyboardController = new KeyboardController(this.bus, this.store)
    this.bus.subscribeEvent('registerKayAction', keyboardController.registerKeyAction.bind(keyboardController))
    this.bus.subscribeEvent(
      'registerKeyActionListener',
      keyboardController.registerKeyActionListener.bind(keyboardController)
    )

    this.bus.subscribeEvent('ownPlayerExit', this.exitOwnPlayer.bind(this))
    this.bus.subscribeEvent('focusNextTarget', this.onFocusNextTarget.bind(this))
    this.bus.subscribeEvent('willSceneTransition', this.onWillSceneTransition.bind(this), EVENT_PRIORITY.LOWEST)
  }

  private phaserSceneInit(ev: PhaserSceneInit): void {
    this.scene = ev.scene
  }

  private init(): void {
    if (this.scene === undefined) {
      throw new SceneUndefinedError()
    }
    initCoreUiPlugin(this.bus, this.store, this.scene, this.focusSwitcher)
  }

  private getStores(): void {
    this.transitionPluginStore = this.store.of('transitionPlugin')
    this.coreUiPluginStore = this.store.of('coreUiPlugin')
    this.keyboardPluginStore = this.store.of('keyboardPlugin')
  }

  private start(ev: StartEvent): void {
    if (this.scene === undefined) return

    void new SettingIcon(
      this.coreUiPluginStore.switcher,
      this.coreUiPluginStore.settingDialog,
      this.coreUiPluginStore.topBarIconContainer
    )

    const ownPlayer = this.transitionPluginStore.transitionManager.getReceivedData<ITitleScene>().ownPlayer
    if (ownPlayer === undefined) throw new OwnPlayerUndefinedError()
    void new AdminSettingIcon(
      ownPlayer.role,
      this.coreUiPluginStore.switcher,
      this.coreUiPluginStore.adminSettingDialog,
      this.coreUiPluginStore.topBarIconContainer
    )

    void new ExitButton(this.bus)

    this.keyboardPluginStore.keySettingWindow.addKeyAction('focusNext', 'カメラフォーカス対象の切り替え', 50)
  }

  public exitOwnPlayer(): void {
    // TitleSceneに遷移
    this.transitionPluginStore.transitionManager.transitionTo('TitleScene')
  }

  private onFocusNextTarget(): void {
    this.focusSwitcher.focusNext()
  }

  private onWillSceneTransition(): void {
    DomManager.removeAll()
  }
}
