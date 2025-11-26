import { ChurarenWeaponDamageCause, ChurarenWeaponEntity } from '@churaverse/churaren-core-plugin-client'
import { WeaponDamageCause } from 'churaverse-engine-client'

export class FlamePillarDamageCause extends ChurarenWeaponDamageCause {
  public constructor(public readonly flamePillar: ChurarenWeaponEntity) {
    super('flamePillar', flamePillar)
  }
}

declare module 'churaverse-engine-client' {
  export interface DamageCauseMap {
    flamePillar: WeaponDamageCause
  }
}
