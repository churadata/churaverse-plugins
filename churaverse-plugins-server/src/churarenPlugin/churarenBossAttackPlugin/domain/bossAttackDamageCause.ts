import { DamageCause } from 'churaverse-engine-server'
import { BossAttack } from './bossAttack'
// import { ChurarenWeaponDamageCause } from '@churaverse/churaren-core-plugin-server/model/churarenWeaponDamageCause'

/**
 * ボスとの当たり判定によるダメージを表すクラス
 * @param collisionName 当たり判定の名前
 * @param collisionEntity 当たり判定のエンティティ
 */

export class BossAttackDamageCause extends DamageCause {
  public constructor(public readonly bossAttack: BossAttack) {
    super('bossAttack')
  }
}

declare module 'churaverse-engine-server' {
  export interface DamageCauseMap {
    bossAttack: BossAttackDamageCause
  }
}
