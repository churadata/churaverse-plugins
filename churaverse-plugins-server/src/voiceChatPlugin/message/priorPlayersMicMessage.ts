import { IMainScene } from 'churaverse-engine-server'
import { BaseMessage } from '../../networkPlugin/message/baseMessage'
import { SendableObject } from '../../networkPlugin/types/sendable'

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

declare module '../../networkPlugin/message/messages' {
  export interface MainMessageMap {
    priorPlayersMicData: PriorPlayersMicMessage
  }
}
