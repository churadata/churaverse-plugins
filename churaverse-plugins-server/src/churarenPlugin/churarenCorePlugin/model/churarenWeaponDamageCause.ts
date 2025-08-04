import { DamageCause, DamageCauseType } from 'churaverse-engine-server'
import { ChurarenWeaponEntity } from './churarenWeaponEntity'

/**
 * ちゅられん用の武器によるダメージの抽象クラス
 * @param churarenWeaponName 武器の名前
 * @param churarenWeapon 武器のエンティティ
 */
export abstract class ChurarenWeaponDamageCause extends DamageCause {
  public constructor(
    public readonly churarenWeaponName: DamageCauseType,
    public readonly churarenWeapon: ChurarenWeaponEntity
  ) {
    super(churarenWeaponName)
  }
}
