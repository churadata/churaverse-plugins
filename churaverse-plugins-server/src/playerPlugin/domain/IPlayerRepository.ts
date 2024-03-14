import { CollidableEntityRepository } from '../../collisionDetectionPlugin/domain/collisionDetection/collidableEntityRepository'
import { Player } from './player'

export type IPlayerRepository = CollidableEntityRepository<Player>
