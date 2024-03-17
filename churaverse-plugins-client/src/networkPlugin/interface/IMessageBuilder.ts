import { Scenes } from 'churaverse-engine-client'
import { MessageMap, MessageType } from '../message/messages'

/**
 * Messageをインスタンス化して返す関数
 */
export type IMessageBuilder<Scene extends Scenes, MsgType extends MessageType<Scene> & string> = (
  data: MessageMap<Scene>[MsgType]['data']
) => MessageMap<Scene>[MsgType]
