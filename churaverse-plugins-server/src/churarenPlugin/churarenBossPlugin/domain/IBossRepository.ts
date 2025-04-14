import { CollidableEntityRepository } from '@churaverse/collision-detection-plugin-server/domain/collisionDetection/collidableEntityRepository'
import { Boss } from './boss'

export type IBossRepository = CollidableEntityRepository<Boss>
