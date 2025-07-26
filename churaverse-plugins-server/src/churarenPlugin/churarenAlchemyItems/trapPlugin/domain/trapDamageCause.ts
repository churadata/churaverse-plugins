import { WeaponDamageCause, WeaponEntity } from 'churaverse-engine-server'

export class TrapDamageCause extends WeaponDamageCause {
  public constructor(public readonly trap: WeaponEntity) {
    super('trap', trap)
  }
}

declare module 'churaverse-engine-server' {
  export interface DamageCauseMap {
    trap: WeaponDamageCause
  }
}
