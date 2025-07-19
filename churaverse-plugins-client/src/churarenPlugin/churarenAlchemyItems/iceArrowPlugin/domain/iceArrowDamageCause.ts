import { WeaponDamageCause, WeaponEntity } from 'churaverse-engine-client'
export class IceArrowDamageCause extends WeaponDamageCause {
  public constructor(public readonly iceArrow: WeaponEntity) {
    super('iceArrow', iceArrow)
  }
}

declare module 'churaverse-engine-client' {
  export interface DamageCauseMap {
    iceArrow: WeaponDamageCause
  }
}
