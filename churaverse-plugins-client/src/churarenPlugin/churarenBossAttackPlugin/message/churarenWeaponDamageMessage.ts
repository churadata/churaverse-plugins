import { DamageCauseType, IMainScene } from 'churaverse-engine-client'
import { BaseMessage } from '@churaverse/network-plugin-client/message/baseMessage'
import { SendableObject } from '@churaverse/network-plugin-client/types/sendable'

export interface ChurarenWeaponDamageData extends SendableObject {
  targetId: string
  cause: DamageCauseType
  weaponId: string
  amount: number
}

export class ChurarenWeaponDamageMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: ChurarenWeaponDamageData) {
    super('weaponDamage', data)
  }
}

declare module '@churaverse/network-plugin-client/message/messages' {
  export interface MainMessageMap {
    weaponDamage: ChurarenWeaponDamageMessage
  }
}
