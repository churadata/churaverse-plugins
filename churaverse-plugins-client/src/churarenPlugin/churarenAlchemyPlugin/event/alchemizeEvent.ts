import { CVEvent, IMainScene } from 'churaverse-engine-client'
import { AlchemyItemKind } from '../domain/alchemyItemKind'

/**
 * 錬金場所にきたら発火するイベント
 */
export class AlchemizeEvent extends CVEvent<IMainScene> {
  public constructor(
    public readonly playerId: string,
    public readonly itemId: string,
    public readonly kind: AlchemyItemKind,
    public readonly deletedItemIds: string[]
  ) {
    super('alchemize', true)
  }
}

declare module 'churaverse-engine-client' {
  export interface CVMainEventMap {
    alchemize: AlchemizeEvent
  }
}
