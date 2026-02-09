import { ChurarenWeaponDamageCause, ChurarenWeaponEntity } from '@churaverse/churaren-core-plugin-client'
import { WeaponDamageCause } from 'churaverse-engine-client'

export class TornadoDamageCause extends ChurarenWeaponDamageCause {
  public constructor(public readonly tornado: ChurarenWeaponEntity) {
    super('tornado', tornado)
  }
}

declare module 'churaverse-engine-client' {
  export interface DamageCauseMap {
    tornado: WeaponDamageCause
  }
}
