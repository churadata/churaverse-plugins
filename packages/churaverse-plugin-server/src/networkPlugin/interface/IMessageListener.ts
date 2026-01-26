import { Scenes } from 'churaverse-engine-server'
import { BaseMessage } from '../message/baseMessage'

/**
 * メッセージ受信時に実行されるcallback
 */
export type IMessageListener<Msg extends BaseMessage<Scenes>> = (message: Msg, senderId: string) => void
