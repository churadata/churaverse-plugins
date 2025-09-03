import { KeyAction } from '@churaverse/keyboard-plugin-client/keyAction/keyAction'

declare module '@churaverse/keyboard-plugin-client/keyAction/keyActions' {
  export interface MainKeyActionMap {
    dropItem1: KeyAction
    dropItem2: KeyAction
    dropItem3: KeyAction
  }
}
