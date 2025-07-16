import { CVEvent, IMainScene } from 'churaverse-engine-client'

export class PlayerHealEvent extends CVEvent<IMainScene> {
  public constructor(
    public readonly id: string,
    public readonly healAmount: number
  ) {
    super('playerHeal', true)
  }
}

declare module 'churaverse-engine-client' {
  export interface CVMainEventMap {
    playerHeal: PlayerHealEvent
  }
}
