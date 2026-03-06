import { ChurarenWeaponDamageCause, ChurarenWeaponEntity } from '@churaverse/churaren-core-plugin-client'
import { WeaponDamageCause } from 'churaverse-engine-client'

export class IceArrowDamageCause extends ChurarenWeaponDamageCause {
  public constructor(public readonly iceArrow: ChurarenWeaponEntity) {
    super('iceArrow', iceArrow)
  }
}

declare module 'churaverse-engine-client' {
  export interface DamageCauseMap {
    iceArrow: WeaponDamageCause
  }
}
