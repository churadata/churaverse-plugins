import { CVEvent, IMainScene } from 'churaverse-engine-client'
import { AlchemyItemKind } from '../domain/alchemyItemKind'

/**
 * Rendererを作って、登録するイベント
 */
export class CreateAlchemyRendererEvent extends CVEvent<IMainScene> {
  public constructor(
    public readonly itemId: string,
    public readonly kind: AlchemyItemKind
  ) {
    super('createAlchemyRenderer', true)
  }
}

declare module 'churaverse-engine-client' {
  export interface CVMainEventMap {
    createAlchemyRenderer: CreateAlchemyRendererEvent
  }
}
