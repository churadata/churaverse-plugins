import { CollidableEntityRepository } from '@churaverse/collision-detection-plugin-server/domain/collisionDetection/collidableEntityRepository'
import { Shark } from './shark'

export type ISharkRepository = CollidableEntityRepository<Shark>
