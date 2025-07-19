import { WeaponDamageCause, WeaponEntity } from 'churaverse-engine-server'

// TODO: CV-706マージ後にChurarenWeaponDamageCauseを継承するように修正
export class ExplosionDamageCause extends WeaponDamageCause {
  // TODO: CV-706マージ後にChurarenWeaponEntityを引数に取るように修正
  public constructor(public readonly explosion: WeaponEntity) {
    super('explosion', explosion)
  }
}

declare module 'churaverse-engine-server' {
  export interface DamageCauseMap {
    explosion: WeaponDamageCause
  }
}
