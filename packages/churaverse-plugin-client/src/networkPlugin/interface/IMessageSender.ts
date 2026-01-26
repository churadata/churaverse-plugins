import { MessageMap, MessageType } from '../message/messages'
import { Scenes } from 'churaverse-engine-client'

export interface IMessageSender<Scene extends Scenes> {
  /**
   * Messageを送信する
   */
  send: <MsgType extends MessageType<Scene> & string>(message: MessageMap<Scene>[MsgType]) => void
}
