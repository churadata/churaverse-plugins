import { Scenes } from 'churaverse-engine-client'
import { MessageMap, MessageType } from '../message/messages'
import { IMessageListener } from './IMessageListener'

export interface IMessageListenerRegister<Scene extends Scenes> {
  /**
   * 受信時に実行するlistenerを登録する
   * @param type 受信するMessageのtype
   * @param listener 受信時に実行するcallback
   */
  on: <MsgType extends MessageType<Scene> & string>(
    type: MsgType,
    listener: IMessageListener<MessageMap<Scene>[MsgType]>
  ) => void
}
