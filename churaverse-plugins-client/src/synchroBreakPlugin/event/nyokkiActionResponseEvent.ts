import { CVEvent, IMainScene } from 'churaverse-engine-client'

export class NyokkiActionResponseEvent extends CVEvent<IMainScene> {
  public constructor(
    public readonly nyokkiId: string,
    public readonly nyokkiState: boolean,
    public readonly nyokkiLogText: string,
    public readonly order: number
  ) {
    super('nyokkiActionResponse', true)
  }
}

declare module 'churaverse-engine-client' {
  export interface CVMainEventMap {
    nyokkiActionResponse: NyokkiActionResponseEvent
  }
}
