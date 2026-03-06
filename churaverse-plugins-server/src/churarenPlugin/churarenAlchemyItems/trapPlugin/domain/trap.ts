import { Position, Direction } from 'churaverse-engine-server'
import { ICollidableEntity } from '@churaverse/collision-detection-plugin-server/domain/collisionDetection/collidableEntity/ICollidableEntity'
import { IRectangle } from '@churaverse/collision-detection-plugin-server/domain/collisionDetection/collidableEntity/IRectangle'
import { ChurarenWeaponEntity } from '@churaverse/churaren-core-plugin-server'
import { IAlchemyItem } from '@churaverse/churaren-alchemy-plugin-server/domain/IAlchemyItem'
import { AlchemyItem } from '@churaverse/churaren-alchemy-plugin-server/domain/alchemyItem'

export const TRAP_ITEM: IAlchemyItem = {
  kind: 'trap',
  recipe: {
    pattern: 'two_same_one_diff',
    materialKind: 'grassOre',
  },
}

export class Trap extends AlchemyItem implements ICollidableEntity, ChurarenWeaponEntity {
  public isCollidable = true
  public getRect(): IRectangle {
    return {
      width: this.SIDE_LENGTH,
      height: this.SIDE_LENGTH,
      position: this.position.copy(),
    }
  }

  public get id(): string {
    return this.trapId
  }

  private _isDead = false
  public readonly trapId: string
  public readonly churarenWeaponOwnerId: string
  public readonly power = 50
  public readonly spawnTime: number

  private readonly SIDE_LENGTH = 70

  public constructor(trapId: string, ownerId: string, position: Position, direction: Direction, spawnTime: number) {
    super(trapId, TRAP_ITEM.kind)
    this.trapId = trapId
    this.churarenWeaponOwnerId = ownerId
    this.spawnTime = spawnTime
    this.position = position
    this.direction = direction
  }

  public set isDead(_isDead: boolean) {
    this._isDead = _isDead
  }

  public get isDead(): boolean {
    return this._isDead
  }

  public die(): void {
    console.log(`Trap ${this.trapId} is triggered!`)
    this._isDead = true
    this.isCollidable = false
  }
}

declare module '@churaverse/churaren-alchemy-plugin-server/domain/alchemyItemKind' {
  export interface AlchemyItemKindMap {
    trap: Trap
  }
}
