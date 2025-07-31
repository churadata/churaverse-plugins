import { Position } from 'churaverse-engine-client'

export interface IFlamePillarAttackRenderer {
  /**
   * walk Phaserのtweenによりアニメーションするため,座標の同期をonUpdateでさせる
   * @param onUpdate updateごとに座標の通知
   */
  spawn: (source: Position) => void
  dead: () => void
}
