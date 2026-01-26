import { Scenes } from 'churaverse-engine-server'
import { SendableObject } from '../types/sendable'
import { MessageType } from './messages'

/**
 * 通信用イベントクラス
 */
export abstract class BaseMessage<Scene extends Scenes> {
  public constructor(
    /**
     * Messageの種類
     */
    public readonly type: MessageType<Scene> & string,

    /**
     * 送受信するデータ. やりとりするデータがない場合は省略可能
     */
    public readonly data?: SendableObject
  ) {}
}
