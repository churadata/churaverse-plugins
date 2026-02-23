import { CollidableEntityRepository } from '@churaverse/collision-detection-plugin-server/domain/collisionDetection/collidableEntityRepository'
import { WaterRing } from '../domain/waterRing'
import { IWaterRingRepository } from '../domain/IWaterRingRepository'

export class WaterRingRepository extends CollidableEntityRepository<WaterRing> implements IWaterRingRepository {
  private readonly waterRings = new Map<string, WaterRing>()
  private readonly ownerIdIndex = new Map<string, string>()

  public set(id: string, entity: WaterRing): void {
    super.set(id, entity)
    this.waterRings.set(id, entity)
    this.ownerIdIndex.set(entity.churarenWeaponOwnerId, id)
  }

  public delete(id: string): void {
    const waterRing = this.waterRings.get(id)
    if (waterRing !== undefined) {
      this.ownerIdIndex.delete(waterRing.churarenWeaponOwnerId)
    }
    super.delete(id)
    this.waterRings.delete(id)
  }

  public get(id: string): WaterRing | undefined {
    return this.waterRings.get(id)
  }

  public getAllId(): string[] {
    return Array.from(this.waterRings.keys())
  }

  public getByOwnerId(ownerId: string): WaterRing | undefined {
    const waterRingId = this.ownerIdIndex.get(ownerId)
    return waterRingId !== undefined ? this.waterRings.get(waterRingId) : undefined
  }
}
