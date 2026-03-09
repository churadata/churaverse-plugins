import AsyncLock from 'async-lock'
import { ITransmitQueue, TransmitQueueBuffers } from './ITransmitQueue'
import { Packet, SendMessage } from '../socket/packet'
import { BaseMessage } from '../message/baseMessage'
import { SendableObject } from '../types/sendable'
import { MessageType } from '../message/messages'
import { Scenes } from 'churaverse-engine-server'

const TRANSMIT_QUEUE_ASYNC_LOCK_KEY = 'transmitQueue'

export class TransmitQueue<Scene extends Scenes> implements ITransmitQueue<Scene> {
  private readonly lock = new AsyncLock({
    timeout: 1000 * 30,
    maxPending: Infinity,
  })

  // 送信キューは受信キューとは違いプレイヤーの数だけ存在する
  private readonly packets: TransmitQueueBuffers<Scene> = new Map()

  private _hasPacket = false

  /**
   * 全プレイヤーの送信キューにMessageを追加
   */
  public pushMessage<Msg extends BaseMessage<Scene>>(message: Msg): void {
    void this.lock.acquire(TRANSMIT_QUEUE_ASYNC_LOCK_KEY, () => {
      for (const playerId of this.packets.keys()) {
        this.pushMessageAt(playerId, message)
      }
    })
  }

  /**
   * 指定したプレイヤーの送信キューにMessageを追加
   */
  public pushMessageAt<Msg extends BaseMessage<Scene>>(playerId: string, message: Msg): void {
    void this.lock.acquire(TRANSMIT_QUEUE_ASYNC_LOCK_KEY, () => {
      this.pushMessageAtWithoutLock(playerId, message)
    })
  }

  /**
   * 指定したプレイヤーの送信キューにMessageを追加.
   * 排他制御は行わないので外部からは使用しない
   */
  private pushMessageAtWithoutLock<Msg extends BaseMessage<Scene>>(playerId: string, message: Msg): void {
    const buf = this.packets.get(playerId)
    if (buf === undefined) return
    buf.push(this.messageToSendableMessage(playerId, message))
    this._hasPacket = true
  }

  private messageToSendableMessage(
    senderId: string,
    message: BaseMessage<Scene>
  ): SendMessage<Scene, MessageType<Scene>> {
    let dataListOrCount: number | SendableObject[] = 1
    if (message.data !== undefined) {
      dataListOrCount = [message.data]
    }

    const sendMsg: SendMessage<Scene, MessageType<Scene>> = {
      senderId,
      type: message.type,
      dataListOrCount,
    }
    return sendMsg
  }

  /**
   * 指定したプレイヤー以外の送信キューにMessageを追加
   */
  public pushMessageWithout<Msg extends BaseMessage<Scene>>(excludeId: string, message: Msg): void {
    void this.lock.acquire(TRANSMIT_QUEUE_ASYNC_LOCK_KEY, () => {
      for (const playerId of this.packets.keys()) {
        if (excludeId === playerId) continue
        this.pushMessageAtWithoutLock(playerId, message)
      }
    })
  }

  /**
   * 全プレイヤーの送信キューにSendableなMessageオブジェクトを追加
   */
  public pushSendMessage(message: SendMessage<Scene, MessageType<Scene>>): void {
    void this.lock.acquire(TRANSMIT_QUEUE_ASYNC_LOCK_KEY, () => {
      for (const playerId of this.packets.keys()) {
        this.pushSendMessageAt(playerId, message)
      }
    })
  }

  /**
   * 指定したプレイヤーの送信キューにSendableなMessageオブジェクトを追加
   */
  public pushSendMessageAt(playerId: string, message: SendMessage<Scene, MessageType<Scene>>): void {
    void this.lock.acquire(TRANSMIT_QUEUE_ASYNC_LOCK_KEY, () => {
      this.pushSendMessageAtWithoutLock(playerId, message)
    })
  }

  /**
   * 指定したプレイヤー以外の送信キューにSendableなMessageオブジェクトを追加
   */
  public pushSendMessageWithout(excludeId: string, message: SendMessage<Scene, MessageType<Scene>>): void {
    void this.lock.acquire(TRANSMIT_QUEUE_ASYNC_LOCK_KEY, () => {
      for (const playerId of this.packets.keys()) {
        if (excludeId === playerId) continue
        this.pushSendMessageAtWithoutLock(playerId, message)
      }
    })
  }

  /**
   * 指定したプレイヤーの送信キューにSendableなMessageオブジェクトを追加.
   * 排他制御は行わないので外部からは使用しない
   */
  private pushSendMessageAtWithoutLock(playerId: string, message: SendMessage<Scene, MessageType<Scene>>): void {
    const buf = this.packets.get(playerId)
    if (buf === undefined) return
    buf.push(message)

    this._hasPacket = true
  }

  /**
   * 全プレイヤーの送信キュー内にある全パケットを取り出し、キューを空にする
   */
  public async popPacket(): Promise<TransmitQueueBuffers<Scene>> {
    const allPlayerTransmitQueue: TransmitQueueBuffers<Scene> = new Map()

    await this.lock.acquire(TRANSMIT_QUEUE_ASYNC_LOCK_KEY, () => {
      for (const playerId of this.packets.keys()) {
        allPlayerTransmitQueue.set(playerId, this.popPacketAtWithoutLock(playerId))
      }
    })

    this._hasPacket = false
    return allPlayerTransmitQueue
  }

  /**
   * 指定したプレイヤーの送信キュー内にある全パケットを取り出し、キューを空にする.
   * 排他制御は行わないので外部からは使用しない
   */
  private popPacketAtWithoutLock(playerId: string): Packet<Scene> {
    // この方法ではシリアライズ可能なオブジェクトのみコピー可能
    // socket.ioで通信できるのもシリアライズ可能なオブジェクトのみなのでこの方法でdeep copyしている
    const packet = this.packets.get(playerId)
    const poppedPacket = packet !== undefined ? structuredClone(packet) : []
    // 中身を空に
    this.packets.set(playerId, [])
    return poppedPacket
  }

  // 新規プレイヤー追加時に送信キューを追加
  public addQueue(playerId: string): void {
    void this.lock.acquire(TRANSMIT_QUEUE_ASYNC_LOCK_KEY, () => {
      if (this.packets.has(playerId)) {
        return
      }
      this.packets.set(playerId, [])
    })
  }

  // プレイヤー退出時に送信キューを削除
  public removeQueue(playerId: string): void {
    void this.lock.acquire(TRANSMIT_QUEUE_ASYNC_LOCK_KEY, () => {
      this.packets.delete(playerId)
    })
  }

  public getDestination(): string[] {
    return Array.from(this.packets.keys())
  }

  public hasPacket(): boolean {
    return this._hasPacket
  }
}
