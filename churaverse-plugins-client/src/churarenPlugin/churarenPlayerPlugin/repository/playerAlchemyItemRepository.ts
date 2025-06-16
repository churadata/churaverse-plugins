import { AlchemyItem } from '@churaverse/churaren-alchemy-plugin-client/domain/alchemyItem'
import { IPlayerAlchemyItemRepository } from '../interface/IPlayerAlchemyItemRepository'

export class PlayerAlchemyItemRepository implements IPlayerAlchemyItemRepository {
  private readonly playerAlchemyItem = new Map<string, AlchemyItem>()

  public set(playerId: string, item: AlchemyItem): void {
    this.playerAlchemyItem.set(playerId, item)
  }

  public get(playerId: string): AlchemyItem | undefined {
    return this.playerAlchemyItem.get(playerId)
  }

  public delete(playerId: string): void {
    this.playerAlchemyItem.delete(playerId)
  }

  public clear(): void {
    this.playerAlchemyItem.clear()
  }
}
