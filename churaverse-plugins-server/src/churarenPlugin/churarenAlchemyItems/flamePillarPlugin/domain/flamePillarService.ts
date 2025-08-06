import { IFlamePillarRepository } from './IFlamePillarRepository'
import { FlamePillar } from './flamePillar'

/**
 * 消滅時間に達したら削除
 * @param onDelete 削除時に実行する関数.引数に削除されるインスタンスとidを取る
 */
export function removeDieFlamePillar(
  flamePillars: IFlamePillarRepository,
  onDelete: (flamePillarId: string, flamePillar: FlamePillar) => void
): void {
  flamePillars.getAllId().forEach((flamePillarId: string) => {
    const flamePillar = flamePillars.get(flamePillarId)
    if (flamePillar?.isDead ?? false) {
      flamePillars.delete(flamePillarId)

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      onDelete(flamePillarId, flamePillar!) // null合体でundefinedでないことは確定
    }
  })
}
