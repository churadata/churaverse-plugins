import { CollidableEntityRepository } from '@churaverse/collision-detection-plugin-server/domain/collisionDetection/collidableEntityRepository'
import { Flare } from '../domain/flare'
import { IFlareRepository } from '../domain/IFlareRepository'

export class FlareRepository extends CollidableEntityRepository<Flare> implements IFlareRepository {
  private readonly flares = new Map<string, Flare>()

  public set(id: string, entity: Flare): void {
    super.set(id, entity)
    this.flares.set(id, entity)
  }

  public delete(id: string): void {
    super.delete(id)
    this.flares.delete(id)
  }

  public get(id: string): Flare | undefined {
    return this.flares.get(id)
  }

  public getAllId(): string[] {
    return Array.from(this.flares.keys())
  }
}
