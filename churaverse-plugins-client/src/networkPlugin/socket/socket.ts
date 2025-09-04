import { io, Socket as ioSocket } from 'socket.io-client'
import { Packet } from './packet'
import { IEventBus, Scenes } from 'churaverse-engine-client'
import { NetworkDisconnectEvent } from '../event/networkDisconnectEvent'

const SEND_PACKET_TO_SERVER = 'sendPacketToServer'
const SEND_PACKET_TO_CLIENT = 'sendPacketToClient'

/**
 * socket.ioのSocketクラスのラッパー
 */
export class Socket<Scene extends Scenes> {
  private static instance: Socket<Scenes>

  public constructor(private readonly iosocket: ioSocket) {}

  public static build<Scene extends Scenes>(): Socket<Scene> {
    if (Socket.instance !== undefined) {
      return Socket.instance
    }

    const regexpUrlHasScheme = /^.+:\/\//

    const urlStr = regexpUrlHasScheme.test(import.meta.env.VITE_BACKEND_URL)
      ? // true
        import.meta.env.VITE_BACKEND_URL
      : // false
        'http://' + import.meta.env.VITE_BACKEND_URL

    const url = new URL(urlStr)

    const ioSocket = io(url.host, {
      // 最後が/で終わるときはpathを置き換え
      path: url.pathname.replace(/\/$/, '') + '/socket.io/',
    })

    Socket.instance = new Socket(ioSocket)
    return Socket.instance
  }

  public emitPacket(packet: Packet<Scene>): void {
    this.iosocket.emit(SEND_PACKET_TO_SERVER, packet)
  }

  public listenPacket(packetListener: (packet: Packet<Scene>) => void): void {
    if (this.ioSocket.connected) {
      this._listenPacket(packetListener)
    } else {
      this.ioSocket.once('connect', () => {
        this._listenPacket(packetListener)
      })
    }
  }

  // eslint-disable-next-line @typescript-eslint/naming-convention
  private _listenPacket(packetListener: (packet: Packet<Scene>) => void): void {
    if (this.iosocket.hasListeners(SEND_PACKET_TO_CLIENT)) {
      this.iosocket.removeAllListeners(SEND_PACKET_TO_CLIENT)
    }

    this.iosocket.on(SEND_PACKET_TO_CLIENT, packetListener)
  }

  public get socketId(): string {
    return this.iosocket.id ?? ''
  }

  public get ioSocket(): ioSocket {
    // TODO: 旧Socketクラスが置き換わり次第, 関数削除
    return this.iosocket
  }

  public socketEventToBusEvent(bus: IEventBus<Scenes>): void {
    this.iosocket.on('disconnect', () => {
      console.log('Socket disconnected:', this.socketId)
      bus.post(new NetworkDisconnectEvent(this.socketId))
    })
  }
}
