import { WeaponEntity, WeaponDamageCause } from 'churaverse-engine-server'
export class FlareDamageCause extends WeaponDamageCause {
  public constructor(public readonly flare: WeaponEntity) {
    super('flare', flare)
  }
}

declare module 'churaverse-engine-server' {
  export interface DamageCauseMap {
    flare: WeaponDamageCause
  }
}
