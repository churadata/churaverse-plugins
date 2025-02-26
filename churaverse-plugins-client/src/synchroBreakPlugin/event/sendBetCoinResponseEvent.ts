import { CVEvent, IMainScene } from 'churaverse-engine-client'

export class SendBetCoinResponseEvent extends CVEvent<IMainScene> {
  public constructor(
    public readonly playerId: string,
    public readonly betCoins: number,
    public readonly currentCoins: number
  ) {
    super('sendBetCoinResponse', true)
  }
}

declare module 'churaVerse-engine-client' {
  export interface CVMainEventMap {
    sendBetCoinResponse: SendBetCoinResponseEvent
  }
}
