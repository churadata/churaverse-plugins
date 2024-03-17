import { Scenes } from 'churaverse-engine-client'
import { IMessageListener } from './interface/IMessageListener'
import { MessageMap, MessageType } from './message/messages'
import { MessageListenerList } from './messageListenerList'

export class MessageReceiver<Scene extends Scenes> {
  private readonly listenersMap = new Map<MessageType<Scene>, MessageListenerList<any>>()

  /**
   * listenerを追加する
   */
  public on<MsgType extends MessageType<Scene> & string>(
    type: MsgType,
    listener: IMessageListener<MessageMap<Scene>[MsgType]>
  ): void {
    if (!this.listenersMap.has(type)) {
      this.listenersMap.set(type, [])
    }

    this.listenersMap.get(type)?.push(listener)
  }

  /**
   * on()で追加したlistenerを返す
   */
  public getListenerList<MsgType extends MessageType<Scene> & string>(
    type: MsgType
  ): MessageListenerList<MessageMap<Scene>[MsgType]> {
    return this.listenersMap.get(type) ?? []
  }
}
