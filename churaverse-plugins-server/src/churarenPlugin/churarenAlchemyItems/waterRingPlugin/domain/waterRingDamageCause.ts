import { ChurarenWeaponDamageCause, ChurarenWeaponEntity } from '@churaverse/churaren-core-plugin-server'
import { WeaponDamageCause } from 'churaverse-engine-server'

export class WaterRingDamageCause extends ChurarenWeaponDamageCause {
  public constructor(public readonly waterRing: ChurarenWeaponEntity) {
    super('waterRing', waterRing)
  }
}

declare module 'churaverse-engine-server' {
  export interface DamageCauseMap {
    waterRing: WeaponDamageCause
  }
}
