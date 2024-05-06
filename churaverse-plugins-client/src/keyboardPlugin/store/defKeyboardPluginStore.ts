import { IMainScene, ITitleScene, Scenes } from 'churaverse-engine-client'
import { IKeyActionDispatcher } from '../interface/IKeyActionDispatcher'
import { IKeyActionKeyCodeBinder } from '../interface/IKeyActionKeyCodeBinder'
import { IKeyFactorySetter } from '../interface/IKeyFactorySetter'
import { IKeyStateGetter } from '../interface/IKeyStateGetter'
import { IKeyboardSettingPopUpWindow } from '../ui/interface/IKeySettingPopUpWindow'

declare module 'churaverse-engine-client' {
  export interface StoreInMain {
    keyboardPlugin: KeyboardPluginStore<IMainScene>
  }

  export interface StoreInTitle {
    keyboardPlugin: KeyboardPluginStore<ITitleScene>
  }
}

export interface KeyboardPluginStore<Scene extends Scenes> {
  readonly keyActionRebinder: IKeyActionKeyCodeBinder<Scene>
  readonly keyFactorySetter: IKeyFactorySetter
  readonly keyActionDispatcher: IKeyActionDispatcher<Scene>
  readonly keyStateGetter: IKeyStateGetter
  keySettingWindow: IKeyboardSettingPopUpWindow
}