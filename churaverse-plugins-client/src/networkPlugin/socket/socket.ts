import { io, Socket as ioSocket } from 'socket.io-client'
import { Packet } from './packet'
import { Scenes, getChuraverseConfig } from 'churaverse-engine-client'
import { NotExistsMySocketIdError } from '../errors/notExistsMySocketIdError'

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

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const urlStr = regexpUrlHasScheme.test(getChuraverseConfig().backendUrl)
      ? // true
        getChuraverseConfig().backendUrl
      : // false
        'http://' + getChuraverseConfig().backendUrl

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
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
    if (this.iosocket.connected) {
      this._listenPacket(packetListener)
    } else {
      this.iosocket.once('connect', () => {
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
    if (this.iosocket.id === undefined) throw new NotExistsMySocketIdError()
    return this.iosocket.id
  }
}
