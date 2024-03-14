import { IMainScene } from 'churaverse-engine-server'
import { BaseMessage } from '../../networkPlugin/message/baseMessage'
import { SendableObject } from '../../networkPlugin/types/sendable'

export interface ExistPlayersMegaphone {
  [id: string]: boolean
}

/**
 * サーバーから返される各Playerのメガホン情報の初期化データ
 */
export interface PriorPlayersMegaphoneData extends SendableObject {
  existPlayersMegaphone: ExistPlayersMegaphone
}

export class PriorPlayersMegaphoneMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: PriorPlayersMegaphoneData) {
    super('priorPlayersMegaphoneData', data)
  }
}

declare module '../../networkPlugin/message/messages' {
  export interface MainMessageMap {
    priorPlayersMegaphoneData: PriorPlayersMegaphoneMessage
  }
}
