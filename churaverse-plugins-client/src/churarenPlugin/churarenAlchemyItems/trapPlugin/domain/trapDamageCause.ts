import { ChurarenWeaponDamageCause, ChurarenWeaponEntity } from '@churaverse/churaren-core-plugin-client'
import { WeaponDamageCause } from 'churaverse-engine-client'

export class TrapDamageCause extends ChurarenWeaponDamageCause {
  public constructor(public readonly trap: ChurarenWeaponEntity) {
    super('trap', trap)
  }
}

declare module 'churaverse-engine-client' {
  export interface DamageCauseMap {
    trap: WeaponDamageCause
  }
}
