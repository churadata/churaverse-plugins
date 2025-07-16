import { WeaponDamageCause, WeaponEntity } from 'churaverse-engine-client'

// TODO: CV-706のブランチのマージ後に`ChurarenWeaponDamageCause`を拡張したクラスにする
export class TornadoDamageCause extends WeaponDamageCause {
  // TODO: CV-706のブランチのマージ後に`ChurarenWeaponEntity`を引数に取るようにする
  public constructor(public readonly tornado: WeaponEntity) {
    super('tornado', tornado)
  }
}

declare module 'churaverse-engine-client' {
  export interface DamageCauseMap {
    tornado: WeaponDamageCause
  }
}
