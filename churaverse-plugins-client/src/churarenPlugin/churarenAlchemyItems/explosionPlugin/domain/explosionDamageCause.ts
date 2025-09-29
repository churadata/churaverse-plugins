import { ChurarenWeaponDamageCause, ChurarenWeaponEntity } from '@churaverse/churaren-core-plugin-client'
import { WeaponDamageCause } from 'churaverse-engine-client'

export class ExplosionDamageCause extends ChurarenWeaponDamageCause {
  public constructor(public readonly explosion: ChurarenWeaponEntity) {
    super('explosion', explosion)
  }
}

declare module 'churaverse-engine-client' {
  export interface DamageCauseMap {
    explosion: WeaponDamageCause
  }
}
