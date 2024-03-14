import { IMainScene, DamageCauseType } from 'churaverse-engine-server'
import { BaseMessage } from '../../networkPlugin/message/baseMessage'
import { SendableObject } from '../../networkPlugin/types/sendable'

export interface WeaponDamageData extends SendableObject {
  targetId: string
  cause: DamageCauseType
  weaponId: string
  amount: number
}

export class WeaponDamageMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: WeaponDamageData) {
    super('weaponDamage', data)
  }
}

declare module '../../networkPlugin/message/messages' {
  export interface MainMessageMap {
    weaponDamage: WeaponDamageMessage
  }
}
