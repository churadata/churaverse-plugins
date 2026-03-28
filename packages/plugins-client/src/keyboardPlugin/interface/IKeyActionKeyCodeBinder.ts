import { Scenes } from 'churaverse-engine-client'
import { KeyActionType } from '../keyAction/keyActions'
import { KeyCode } from '../types/keyCode'

export interface IKeyActionKeyCodeBinder<Scene extends Scenes> {
  /**
   * KeyActionに紐付くKeyCodeを変更する
   */
  rebindKey: (type: KeyActionType<Scene>, newKeyCode: KeyCode) => void
}
