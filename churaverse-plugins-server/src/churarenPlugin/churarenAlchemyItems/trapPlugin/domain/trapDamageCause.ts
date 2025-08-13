import { ChurarenWeaponDamageCause, ChurarenWeaponEntity } from '@churaverse/churaren-core-plugin-server'
import { WeaponDamageCause } from 'churaverse-engine-server'

export class TrapDamageCause extends ChurarenWeaponDamageCause {
  public constructor(public readonly trap: ChurarenWeaponEntity) {
    super('trap', trap)
  }
}

declare module 'churaverse-engine-server' {
  export interface DamageCauseMap {
    trap: WeaponDamageCause
  }
}
