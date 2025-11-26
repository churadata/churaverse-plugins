import { CollidableEntityRepository } from '@churaverse/collision-detection-plugin-server/domain/collisionDetection/collidableEntityRepository'
import { FlamePillar } from './flamePillar'

export type IFlamePillarRepository = CollidableEntityRepository<FlamePillar>
