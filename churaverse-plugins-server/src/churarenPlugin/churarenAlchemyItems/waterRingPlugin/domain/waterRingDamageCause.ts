import { WeaponDamageCause, WeaponEntity } from 'churaverse-engine-server'

export class WaterRingDamageCause extends WeaponDamageCause {
  public constructor(public readonly waterRing: WeaponEntity) {
    super('waterRing', waterRing)
  }
}

declare module 'churaverse-engine-server' {
  export interface DamageCauseMap {
    waterRing: WeaponDamageCause
  }
}
