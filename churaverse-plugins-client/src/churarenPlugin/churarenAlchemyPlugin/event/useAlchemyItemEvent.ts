import { CVEvent, IMainScene } from 'churaverse-engine-client'
import { AlchemyItem } from '../domain/alchemyItem'
import { Player } from '@churaverse/player-plugin-client/domain/player'

/**
 * 錬金アイテムを使うイベント
 */
export class UseAlchemyItemEvent extends CVEvent<IMainScene> {
  public constructor(
    public readonly ownPlayer: Player,
    public readonly alchemyItem: AlchemyItem
  ) {
    super('useAlchemyItem', true)
  }
}

declare module 'churaverse-engine-client' {
  export interface CVMainEventMap {
    useAlchemyItem: UseAlchemyItemEvent
  }
}
