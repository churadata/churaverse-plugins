import { KeyAction } from '../../keyboardPlugin/keyAction/keyAction'

declare module '../../keyboardPlugin/keyAction/keyActions' {
  export interface MainKeyActionMap {
    DropBomb: KeyAction
  }
}