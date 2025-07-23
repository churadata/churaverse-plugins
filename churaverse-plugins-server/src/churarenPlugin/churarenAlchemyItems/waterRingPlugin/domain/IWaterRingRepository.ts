import { CollidableEntityRepository } from '@churaverse/collision-detection-plugin-server/domain/collisionDetection/collidableEntityRepository'
import { WaterRing } from './waterRing'

export interface IWaterRingRepository extends CollidableEntityRepository<WaterRing> {
  getByOwnerId: (ownerId: string) => WaterRing | undefined
}
