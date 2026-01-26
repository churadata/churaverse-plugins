import { IMainScene } from 'churaverse-engine-server'
import { BaseMessage } from '@churaverse/network-plugin-server/message/baseMessage'
import { SendableObject } from '@churaverse/network-plugin-server/types/sendable'

export interface ExistPlayersMic {
  [id: string]: boolean
}

/**
 * サーバーから返される各Playerのミュート情報の初期化データ
 */
export interface PriorPlayersMicData extends SendableObject {
  existPlayersMic: ExistPlayersMic
}

export class PriorPlayersMicMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: PriorPlayersMicData) {
    super('priorPlayersMicData', data)
  }
}

declare module '@churaverse/network-plugin-server/message/messages' {
  export interface MainMessageMap {
    priorPlayersMicData: PriorPlayersMicMessage
  }
}
