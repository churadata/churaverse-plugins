import { WeaponDamageCause, WeaponEntity } from 'churaverse-engine-server'

export class IceArrowDamageCause extends WeaponDamageCause {
  public constructor(public readonly iceArrow: WeaponEntity) {
    super('iceArrow', iceArrow)
  }
}

declare module 'churaverse-engine-server' {
  export interface DamageCauseMap {
    iceArrow: WeaponDamageCause
  }
}
