import { BossAttack } from './bossAttack'
import { DamageCause } from 'churaverse-engine-client'
// import { ChurarenWeaponDamageCause } from '@churaverse/churaren-core-plugin-client/model/churarenWeaponDamageCause'

export class BossAttackDamageCause extends DamageCause {
  public constructor(public readonly bossAttack: BossAttack) {
    super('bossAttack')
  }
}

declare module 'churaverse-engine-client' {
  export interface DamageCauseMap {
    bossAttack: BossAttackDamageCause
  }
}
