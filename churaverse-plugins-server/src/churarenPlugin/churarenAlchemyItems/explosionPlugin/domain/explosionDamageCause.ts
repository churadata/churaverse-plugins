import { ChurarenWeaponDamageCause, ChurarenWeaponEntity } from '@churaverse/churaren-core-plugin-server'
import { WeaponDamageCause } from 'churaverse-engine-server'

export class ExplosionDamageCause extends ChurarenWeaponDamageCause {
  public constructor(public readonly explosion: ChurarenWeaponEntity) {
    super('explosion', explosion)
  }
}

declare module 'churaverse-engine-server' {
  export interface DamageCauseMap {
    explosion: WeaponDamageCause
  }
}
