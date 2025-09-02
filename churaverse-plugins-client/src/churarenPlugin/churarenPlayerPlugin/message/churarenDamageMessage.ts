import { IMainScene, DamageCauseType } from 'churaverse-engine-client'
import { BaseMessage } from '@churaverse/network-plugin-client/message/baseMessage'
import { SendableObject } from '@churaverse/network-plugin-client/types/sendable'

export interface ChurarenDamageData extends SendableObject {
  targetId: string
  cause: DamageCauseType
  sourceId: string
  amount: number
}

export class ChurarenDamageMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: ChurarenDamageData) {
    super('churarenDamage', data)
  }
}

declare module '@churaverse/network-plugin-client/message/messages' {
  export interface MainMessageMap {
    churarenDamage: ChurarenDamageMessage
  }
}
