import { Scene } from 'phaser'
import { KeyActionManager } from '../keyActionManager'
import { SceneUndefinedError, Scenes, Store } from 'churaverse-engine-client'
import { IKeyStateGetter } from '../interface/IKeyStateGetter'

export function initKeyboardPluginStore(
  store: Store<Scenes>,
  scene: Scene | undefined,
  keyActionManager: KeyActionManager<Scenes>,
  keyStateGetter: IKeyStateGetter
): void {
  if (scene === undefined) throw new SceneUndefinedError()

  // const cookieRepository = new CookieStore()
  // const keyboardSettingSetupInfoReader = new KeyboardSetupInfoReader(cookieRepository)
  // const keyConfiguration = new KeyConfiguration(keyboardSettingSetupInfoReader)
  // const keyboardHelper = new KeyboardHelper(scene, keyConfiguration)

  store.setInit('keyboardPlugin', {
    keyActionRebinder: keyActionManager,
    keyFactorySetter: keyActionManager,
    keyActionDispatcher: keyActionManager,
    keyStateGetter,
    keySettingWindow: undefined,
  })
}
