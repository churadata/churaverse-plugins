import { Scenes } from 'churaverse-engine-client'
import { IMessageListener } from './interface/IMessageListener'
import { BaseMessage } from './message/baseMessage'

/**
 * MessageReceiverが保持するlistenerの配列
 */
export type MessageListenerList<Msg extends BaseMessage<Scenes>> = Array<IMessageListener<Msg>>
