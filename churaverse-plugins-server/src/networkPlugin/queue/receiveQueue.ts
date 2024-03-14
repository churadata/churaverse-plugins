import AsyncLock from 'async-lock'
import { IReceiveQueue } from './IReceiveQueue'
import { Packet } from '../socket/packet'
import { Scenes } from 'churaverse-engine-server'

const RECEIVE_QUEUE_ASYNC_LOCK_KEY = 'receiveQueue'

export class ReceiveQueue<Scene extends Scenes> implements IReceiveQueue<Scene> {
  private readonly lock = new AsyncLock({
    timeout: 1000 * 30,
    maxPending: Infinity,
  })

  private readonly packets: Packet<Scene> = []

  /**
   * 受信キューにパケットを追加
   */
  public pushPacket(receivedPacket: Packet<Scene>): void {
    void this.lock.acquire(RECEIVE_QUEUE_ASYNC_LOCK_KEY, () => {
      this.packets.push(...receivedPacket)
    })
  }

  /**
   * 受信キュー内にある全パケットを取り出し、キューを空にする
   */
  public popPacket(): Packet<Scene> {
    let poppedPacket: Packet<Scene> = []
    void this.lock.acquire(RECEIVE_QUEUE_ASYNC_LOCK_KEY, () => {
      // 文字列化してdeep copyするこの方法ではシリアライズ可能なオブジェクトのみコピー可能
      // socket.ioで通信できるのもシリアライズ可能なオブジェクトのみなのでこの方法でdeep copyしている
      poppedPacket = JSON.parse(JSON.stringify(this.packets)) as Packet<Scene>
      this.packets.length = 0
    })

    // 中身を空に
    return poppedPacket
  }

  public hasPacket(): boolean {
    return this.packets.length > 0
  }
}
