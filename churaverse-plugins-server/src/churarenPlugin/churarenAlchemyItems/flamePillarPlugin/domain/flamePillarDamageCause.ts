import { WeaponDamageCause } from 'churaverse-engine-server'
import { ChurarenWeaponDamageCause, ChurarenWeaponEntity } from '@churaverse/churaren-core-plugin-server'

export class FlamePillarDamageCause extends ChurarenWeaponDamageCause {
  public constructor(public readonly flamePillar: ChurarenWeaponEntity) {
    super('flamePillar', flamePillar)
  }
}

declare module 'churaverse-engine-server' {
  export interface DamageCauseMap {
    flamePillar: WeaponDamageCause
  }
}
