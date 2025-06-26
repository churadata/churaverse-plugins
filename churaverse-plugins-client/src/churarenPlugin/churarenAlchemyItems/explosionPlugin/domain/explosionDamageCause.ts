import { WeaponDamageCause, WeaponEntity } from 'churaverse-engine-client'

// TODO: CV-706のブランチのマージ後に`ChurarenWeaponDamageCause`を拡張したクラスにする
export class ExplosionDamageCause extends WeaponDamageCause {
  // TODO: CV-706のブランチのマージ後に`ChurarenWeaponEntity`を引数に取るようにする
  public constructor(public readonly explosion: WeaponEntity) {
    super('explosion', explosion)
  }
}

declare module 'churaverse-engine-client' {
  export interface DamageCauseMap {
    explosion: WeaponDamageCause
  }
}
