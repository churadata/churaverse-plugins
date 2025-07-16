import { WeaponDamageCause, WeaponEntity } from 'churaverse-engine-client'

// TODO: CV-706のブランチのマージ後に`ChurarenWeaponDamageCause`を拡張したクラスにする
export class BlackHoleDamageCause extends WeaponDamageCause {
  // TODO: CV-706のブランチのマージ後に`ChurarenWeaponEntity`を引数に取るようにする
  public constructor(public readonly blackHole: WeaponEntity) {
    super('blackHole', blackHole)
  }
}

declare module 'churaverse-engine-client' {
  export interface DamageCauseMap {
    blackHole: WeaponDamageCause
  }
}
