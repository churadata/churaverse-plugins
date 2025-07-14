import { WeaponDamageCause, WeaponEntity } from 'churaverse-engine-server'

// TODO: CV-706マージ後にChurarenWeaponDamageCauseを継承するように修正
export class TornadoDamageCause extends WeaponDamageCause {
  // TODO: CV-706マージ後にChurarenWeaponEntityを引数に取るように修正
  public constructor(public readonly tornado: WeaponEntity) {
    super('tornado', tornado)
  }
}

declare module 'churaverse-engine-server' {
  export interface DamageCauseMap {
    tornado: WeaponDamageCause
  }
}
