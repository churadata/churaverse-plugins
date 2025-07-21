import { WeaponDamageCause } from '../../../../../domain/model/weaponDamageCause'
import { ChurarenWeaponDamageCause } from '../../../model/churarenWeaponDamageCause'
import { ChurarenWeaponEntity } from '../../../model/churarenWeaponEntity'

export class WaterRingDamageCause extends ChurarenWeaponDamageCause {
  public constructor(public readonly waterRing: ChurarenWeaponEntity) {
    super('waterRing', waterRing)
  }
}

declare module '../../../../../domain/model/damageCause' {
  export interface DamageCauseMap {
    waterRing: WeaponDamageCause
  }
}
