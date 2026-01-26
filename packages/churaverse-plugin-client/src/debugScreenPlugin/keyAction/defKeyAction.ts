import { KeyAction } from '@churaverse/keyboard-plugin-client/keyAction/keyAction'

declare module '@churaverse/keyboard-plugin-client/keyAction/keyActions' {
  export interface MainKeyActionMap {
    ToggleDebugScreen: KeyAction
  }
}
