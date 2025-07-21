import { WeaponDamageCause, WeaponEntity } from 'churaverse-engine-client'

export class WaterRingDamageCause extends WeaponDamageCause {
  public constructor(public readonly waterRing: WeaponEntity) {
    super('waterRing', waterRing)
  }
}

declare module 'churaverse-engine-client' {
  export interface DamageCauseMap {
    waterRing: WeaponDamageCause
  }
}
