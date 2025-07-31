import { WeaponDamageCause, WeaponEntity } from 'churaverse-engine-client'

export class FlamePillarDamageCause extends WeaponDamageCause {
  public constructor(public readonly flamePillar: WeaponEntity) {
    super('flamePillar', flamePillar)
  }
}

declare module 'churaverse-engine-client' {
  export interface DamageCauseMap {
    flamePillar: WeaponDamageCause
  }
}
