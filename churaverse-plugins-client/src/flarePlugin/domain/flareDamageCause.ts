import { WeaponEntity, WeaponDamageCause } from 'churaverse-engine-client'

export class FlareDamageCause extends WeaponDamageCause {
  public constructor(public readonly flare: WeaponEntity) {
    super('flare', flare)
  }
}

declare module 'churaverse-engine-client' {
  export interface DamageCauseMap {
    flare: WeaponDamageCause
  }
}
