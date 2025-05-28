import { IFlareRepository } from './IFlareRepository'
import { Flare } from './flare'
import { WorldMap } from '@churaverse/map-plugin-server/domain/worldMap'

/**
 * 衝突した or 消滅時間に達した炎を削除
 * @param onDelete 削除時に実行する関数.引数に削除される炎のインスタンスとidを取る
 */
export function removeDieFlare(flares: IFlareRepository, onDelete: (flareId: string, flare: Flare) => void): void {
  flares.getAllId().forEach((flareId) => {
    const flare = flares.get(flareId)
    if (flare?.isDead ?? false) {
      flares.delete(flareId)

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      onDelete(flareId, flare!) // null合体でundefinedでないことは確定
    }
  })
}

/**
 * flareRepository内の全炎を微小時間分だけ移動
 * その際にワールド外に出た炎をdie
 */
export function moveFlares(dt: number, flares: IFlareRepository, worldMap: WorldMap): void {
    flares.getAllId().forEach((flareId) => {
    const flare = flares.get(flareId)
    if (flare !== undefined) {
        flare.move(dt)
      if (
        flare.position.x < 0 ||
        flare.position.x > worldMap.width ||
        flare.position.y < 0 ||
        flare.position.y > worldMap.height
      ) {
        flare.die()
      } else {
        flares.updateActor(flareId, flare)
      }
    }
  })
}
