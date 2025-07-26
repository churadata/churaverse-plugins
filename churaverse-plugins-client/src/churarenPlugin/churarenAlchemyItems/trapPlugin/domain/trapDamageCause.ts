import { WeaponDamageCause, WeaponEntity } from 'churaverse-engine-client'

export class TrapDamageCause extends WeaponDamageCause {
  public constructor(public readonly trap: WeaponEntity) {
    super('trap', trap)
  }
}

declare module 'churaverse-engine-client' {
  export interface DamageCauseMap {
    trap: WeaponDamageCause
  }
}
