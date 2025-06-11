import { Scenes } from 'churaverse-engine-client'
import { KeyActionType } from '../keyAction/keyActions'
import { IKeyActionListener } from './IKeyActionListener'

export interface IKeyActionListenerRegister<Scene extends Scenes> {
  /**
   * KeyActionの条件が満たされたときに実行するlistenerを登録する
   * @param type listenerと紐付けるKeyActionのtype
   * @param listener KeyAction発行時に実行するcallback
   */
  on: <KeyActType extends KeyActionType<Scene> & string>(type: KeyActType, listener: IKeyActionListener) => void

  /**
   * KeyActionの条件が満たされたときに実行するlistenerを解除する
   * @param type listenerと紐付けるKeyActionのtype
   * @param listener 解除するcallback
   */
  off: <KeyActType extends KeyActionType<Scene> & string>(type: KeyActType, listener: IKeyActionListener) => void
}
