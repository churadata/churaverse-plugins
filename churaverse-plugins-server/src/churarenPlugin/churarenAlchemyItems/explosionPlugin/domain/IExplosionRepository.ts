import { CollidableEntityRepository } from '@churaverse/collision-detection-plugin-server/domain/collisionDetection/collidableEntityRepository'
import { Explosion } from './explosion'

export type IExplosionRepository = CollidableEntityRepository<Explosion>
