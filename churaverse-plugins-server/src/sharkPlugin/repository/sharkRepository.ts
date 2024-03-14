import { CollidableEntityRepository } from '../../collisionDetectionPlugin/domain/collisionDetection/collidableEntityRepository'
import { Shark } from '../domain/shark'
import { ISharkRepository } from '../domain/ISharkRepository'

export class SharkRepository extends CollidableEntityRepository<Shark> implements ISharkRepository {
  private readonly sharks = new Map<string, Shark>()

  public set(id: string, entity: Shark): void {
    super.set(id, entity)
    this.sharks.set(id, entity)
  }

  public delete(id: string): void {
    super.delete(id)
    this.sharks.delete(id)
  }

  public get(id: string): Shark | undefined {
    return this.sharks.get(id)
  }

  public getAllId(): string[] {
    return Array.from(this.sharks.keys())
  }
}
