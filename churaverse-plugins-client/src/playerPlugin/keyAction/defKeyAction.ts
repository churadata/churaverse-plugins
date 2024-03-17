import { KeyAction } from '../../keyboardPlugin/keyAction/keyAction'

declare module '../../keyboardPlugin/keyAction/keyActions' {
  export interface MainKeyActionMap {
    walkDown: KeyAction
    walkUp: KeyAction
    walkLeft: KeyAction
    walkRight: KeyAction
  }
}
