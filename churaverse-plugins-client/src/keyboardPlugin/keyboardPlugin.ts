import {
  BasePlugin,
  CVEvent,
  EVENT_PRIORITY,
  PhaserSceneInit,
  SceneUndefinedError,
  Scenes,
  UpdateEvent,
} from 'churaverse-engine-client'
import { Scene } from 'phaser'
import { RegisterKeyActionListenerEvent } from './event/registerKeyActionListenerEvent'
import { initKeyboardPluginStore } from './store/initKeyboardPluginStore'
import { KeyActionManager } from './keyActionManager'
import { KeyActionManagerUndefinedError } from './error/keyActionManagerUndefinedError'
import { RegisterKeyActionEvent } from './event/registerKeyActionEvent'
import { KeyFactory } from './keyFactory'
import { KeyStateGetter } from './keyStateGetter'
import { setupKeyboardUi } from './ui/setupKeyboardUi'
import { IKeyboardSetupInfoWriter } from './interface/keySettingSave/IKeyboardSetupInfoWriter'
import { CookieStore } from '@churaverse/data-persistence-plugin-client/cookieStore'
import { KeyboardSetupInfoWriter } from './keySettingSave/keyboardSetupInfoWriter'
import { KeyboardSetupInfoReader } from './keySettingSave/keyboardSettingInfoReader'
import { CanSettingKeyActType } from './ui/keyboardSetting/canSettingKeyActionType'
import { KeyCode } from './types/keyCode'
import { ActivateUiEvent } from '@churaverse/core-ui-plugin-client/event/activateUiEvent'
import { DeactivateUiEvent } from '@churaverse/core-ui-plugin-client/event/deactivateUiEvent'
import { WillSceneTransitionEvent } from '@churaverse/transition-plugin-client/event/willSceneTransitionEvent'
import { toPhaserKeyCode } from './service/keyCodeUtil'

export class KeyboardPlugin extends BasePlugin<Scenes> {
  private scene?: Scene
  private keyActionManager?: KeyActionManager<Scenes>
  private keyboardSettingInfoWriter?: IKeyboardSetupInfoWriter

  public listenEvent(): void {
    this.bus.subscribeEvent('phaserSceneInit', this.phaserSceneInit.bind(this))
    this.bus.subscribeEvent('init', this.init.bind(this), 'HIGH')
    this.bus.subscribeEvent('start', this.listenRegister.bind(this), EVENT_PRIORITY.HIGH)
    this.bus.subscribeEvent('start', this.start.bind(this))
    this.bus.subscribeEvent('willSceneTransition', this.willSceneTransition.bind(this))
    this.bus.subscribeEvent('update', this.update.bind(this))
    this.bus.subscribeEvent('activateUiEvent', this.onActivateUi.bind(this))
    this.bus.subscribeEvent('deactivateUiEvent', this.onDeactivateUi.bind(this))
    this.bus.subscribeEvent('onGameShutdown', this.onGameShutdown.bind(this))
  }

  private phaserSceneInit(ev: PhaserSceneInit): void {
    this.scene = ev.scene
  }

  private async init(): Promise<void> {
    if (this.scene === undefined) throw new SceneUndefinedError()

    const cookieRepository = new CookieStore()
    this.keyboardSettingInfoWriter = new KeyboardSetupInfoWriter(cookieRepository)
    const keyboardSettingInfoReader = new KeyboardSetupInfoReader(cookieRepository)
    const savedKeyBindInfo = keyboardSettingInfoReader.read().keys ?? new Map<CanSettingKeyActType, KeyCode>()

    const keyStateGetter = new KeyStateGetter(this.scene)
    const keyFactory = new KeyFactory(keyStateGetter)
    this.keyActionManager = new KeyActionManager(keyFactory, savedKeyBindInfo)
    initKeyboardPluginStore(this.store, this.scene, this.keyActionManager, keyStateGetter)
    this.setupKeyboardEventListeners()
  }

  private setupKeyboardEventListeners(): void {
    window.addEventListener('keyup', this.handleKeyUp)
    window.addEventListener('keydown', this.handleKeyDown)
  }

  private readonly handleKeyUp = (e: KeyboardEvent): void => {
    if (this.keyActionManager === undefined) throw new KeyActionManagerUndefinedError()
    if (e.key === 'Meta') {
      this.keyActionManager.logicalReleaseAllKeys()
    }
  }

  private readonly handleKeyDown = (event: KeyboardEvent): void => {
    if (this.keyActionManager === undefined) throw new KeyActionManagerUndefinedError()
    const keyCode = toPhaserKeyCode(event.key)
    if (keyCode !== undefined) {
      this.keyActionManager.physicalKeyDown(keyCode)
    }
  }

  private start(): void {
    if (this.keyActionManager === undefined) throw new KeyActionManagerUndefinedError()

    if (this.sceneName === 'MainScene') {
      setupKeyboardUi(this.store, this.keyActionManager)
    }
  }

  private willSceneTransition(ev: WillSceneTransitionEvent<Scenes, Scenes>): void {
    if (ev.from === 'MainScene' && ev.to === 'TitleScene') {
      this.onGameShutdown()
    }
  }

  private onGameShutdown(): void {
    if (this.keyActionManager === undefined) throw new KeyActionManagerUndefinedError()
    this.keyboardSettingInfoWriter?.save(this.keyActionManager.getAllRegistered())
  }

  /**
   * KeyAction登録イベントとMessageListener登録イベントをpostする
   */
  private listenRegister(): void {
    if (this.keyActionManager === undefined) throw new KeyActionManagerUndefinedError()

    this.bus.post(new RegisterKeyActionEvent(this.keyActionManager) as CVEvent<Scenes>)
    this.bus.post(new RegisterKeyActionListenerEvent(this.keyActionManager) as CVEvent<Scenes>)
  }

  private update(ev: UpdateEvent): void {
    this.keyActionManager?.update(ev.dt)
  }

  private onActivateUi(ev: ActivateUiEvent): void {
    this.keyActionManager?.keyContextManager.setGui()
  }

  private onDeactivateUi(ev: DeactivateUiEvent): void {
    this.keyActionManager?.keyContextManager.setInGame()
  }
}
