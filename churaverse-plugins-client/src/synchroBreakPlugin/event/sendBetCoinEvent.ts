import { CVEvent, IMainScene } from 'churaverse-engine-client'

export class SendBetCoinEvent extends CVEvent<IMainScene> {
  public constructor(
    public readonly playerId: string,
    public readonly betCoins: number
  ) {
    super('sendBetCoin', true)
  }
}

declare module 'churaVerse-engine-client' {
  export interface CVMainEventMap {
    sendBetCoin: SendBetCoinEvent
  }
}
